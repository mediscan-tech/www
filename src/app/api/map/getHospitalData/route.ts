import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis.ts';
import { NextApiResponse } from 'next';

type Result = {
    facility_id: string;
    facility_name: string;
    address: string;
    citytown: string;
    state: string;
    zip_code: string;
    countyparish: string;
    telephone_number: string;
    condition: string;
    measure_id: string;
    measure_name: string;
    score: string;
    sample: string;
    footnote: string;
    start_date: string;
    end_date: string;
};

export async function POST(request: Request, res: NextApiResponse) {
    const data: any = await request.json();
    if (!data || data.latitude === null || data.longitude === undefined || data === '') {
        return new Response(`Latitude or longitude missing!`, {
            status: 500,
        })
    }

    let latitude = data.latitude;
    let longitude = data.longitude;
    let zipCode: string | null = null;
    let postalCodesArray = [];
    let formattedData: { count: number; startLatitude: number; startLongitude: number;  results: Result[]; } = {
        count: 0,
        startLatitude: latitude,
        startLongitude: longitude,
        results: [],
    };    

    //Round latitude and longitude to 4 decimal places to maintain consistency to reduce the number of API calls and cache hits (https://blis.com/precision-matters-critical-importance-decimal-places-five-lowest-go/)
    latitude = parseFloat(latitude.toFixed(4));
    longitude = parseFloat(longitude.toFixed(4));

    //Redis caching to save on API calls
    const cachedZip = await redis.get(`${latitude},${longitude}`);
    if (cachedZip) {
        zipCode = cachedZip;
    } else if (!cachedZip) {
        // If not in cache, get zip code from latitude and longitude 
        const getZipCode = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}`)
        try {
            if (getZipCode.ok) {
                const data = await getZipCode.json();
                zipCode = data.results[0].components.postcode;
                await redis.set(`${latitude},${longitude}`, zipCode)
            } else {
                return new Response(`Failed to fetch ZIP code!`, {
                    status: 500,
                })
            }
        } catch (error) {           
            return new Response(JSON.stringify({
                msg: `Error fetching ZIP code!`,
                data: `${error.name + error.message}`
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }    
    
    //Get nearby zip codes
    const geoNamesLimit = 499; // Not 500, as it would use 3 credits for 500 results
    const getNearbyZipCodes = await fetch(`http://api.geonames.org/findNearbyPostalCodesJSON?postalcode=${zipCode}&country=US&radius=24.2&maxRows=${geoNamesLimit}&username=${process.env.GEONAMES_USERNAME}`)
    try {
        if (getNearbyZipCodes.ok) {
            const getNearbyZipCodesData = await getNearbyZipCodes.json();
            postalCodesArray = [];
            for (let i = 0; i < Math.min(geoNamesLimit, getNearbyZipCodesData.postalCodes.length); i++) {
                postalCodesArray.push(getNearbyZipCodesData.postalCodes[i].postalCode);
            }
            
        } else {
            return new Response(`Failed to fetch nearby ZIP codes!`, {
                status: 500,
            })
        }
    } catch (error) {
        return new Response(JSON.stringify({
            msg: `Error fetching nearby ZIP codes!`,
            data: `${error.name + error.message}`
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    //Cross-reference zip codes with CMS (Centers for Medicare & Medicaid Services) database to find hospitals in zip code
    const conditions = [
        {
            "property": "measure_id",
            "value": "OP_18b",
            "operator": "="
        }
    ];
    const formattedPostalCodesArray = postalCodesArray.map((postalCode) => ({
        "property": "zip_code",
        "value": postalCode,
        "operator": "="
      }));
    const payload = {
        "conditions": [
            ...conditions,
            {
                "groupOperator": "or",
                "conditions": formattedPostalCodesArray
            }
        ],
        "limit": 500
    };

    const fetchCMSData = await fetch('https://data.cms.gov/provider-data/api/1/datastore/query/yv7e-xc69/0', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    try {
        if (fetchCMSData.ok) {
            const CMSData = await fetchCMSData.json();
            const formattedResults = CMSData.results.map(async (result: Result) => {
                const hospital = {
                    facility_name: result.facility_name,
                    address: result.address,
                    citytown: result.citytown,
                    state: result.state,
                    zip_code: result.zip_code,
                    countyparish: result.countyparish,
                    telephone_number: result.telephone_number,
                    hospital_latitude: null,
                    hospital_longitude: null,
                    score: result.score,
                    sample: result.sample,
                };
          
                //Now get lat and long for each hospital and add to data
                const forwardGeocodeHospitalAddress = async (address: string) => {
                    try {
                        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?autocomplete=false&types=address&access_token=${process.env.MAPBOX_API}`);
                        if (response.ok) {
                            const data = await response.json();
                            if (data.features && data.features.length > 0) {
                                // Access the coordinates from the first feature (hihgest relevancy)
                                const [longitude, latitude] = data.features[0].center;
                                return { latitude, longitude };
                            } else {
                                console.log(`No coordinates found for ${address}`)
                                return new Response(`No coordinates found for ${address}`, {
                                    status: 204,
                                })
                            }
                        }
                    } catch (error) {
                        return new Response(JSON.stringify({
                            msg: `Error forward fetching hospital coordinates!`,
                            data: `${error.name + error.message}`
                        }), {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }
                };
                const geocodedData: any = await forwardGeocodeHospitalAddress(`${hospital.address} + ${hospital.citytown} + ${hospital.state} + ${hospital.zip_code} + "United States"`);
                
                if (geocodedData) {
                    hospital.hospital_latitude = geocodedData.latitude;
                    hospital.hospital_longitude = geocodedData.longitude;
                }
          
                return hospital;
              });
          
              const formattedResultsWithCoordinates = await Promise.all(formattedResults);
          
              formattedData = {
                count: formattedResultsWithCoordinates.length,
                results: formattedResultsWithCoordinates,
                startLatitude: latitude,
                startLongitude: longitude,
              };
            
        } else {
            return new Response(`Failed to cross-reference the CMS database!`, {
                status: 500,
            })
        }
    } catch (error) {
        return new Response(JSON.stringify({
            msg: `Error cross-referencing the CMS database!`,
            data: `${error.name + error.message}`
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return NextResponse.json({ status: "success", data: { formattedData } });
}