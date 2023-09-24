import { NextResponse } from 'next/server';
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

export async function POST(request: Request) {
    const data: any = await request.json();
    const latitude = data.latitude;
    const longitude = data.longitude;
    const limit = 499;
    let zipCode: string | null = null;
    let postalCodesArray = [];
    let formattedData: { count: number; results: Result[] } = {
        count: 0,
        results: [],
    };
    if (!data || data === null || data === undefined || data === '') {
        return new Response(`Latitude or longitude missing!`, {
            status: 500,
        })
    }
    
    const getZipCode = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}`)
    //TODO: add redis caching here to save on API calls
    try {
        if (getZipCode.ok) {
            const data = await getZipCode.json();
            zipCode = data.results[0].components.postcode;
        } else {
            return new Response(`Failed to fetch ZIP code!`, {
                status: 500,
            })
        }
    } catch (error) {
        return new Response(`Error fetching ZIP code! ${error}`, {
            status: 500,
        })
    }

    //Get nearby zip codes
    const getNearbyZipCodes = await fetch(`http://api.geonames.org/findNearbyPostalCodesJSON?postalcode=${zipCode}&country=US&radius=24.2&maxRows=${limit}&username=${process.env.GEONAMES_USERNAME}`)
    try {
        if (getNearbyZipCodes.ok) {
            const getNearbyZipCodesData = await getNearbyZipCodes.json();
            postalCodesArray = [];
            for (let i = 0; i < Math.min(limit, getNearbyZipCodesData.postalCodes.length); i++) {
                postalCodesArray.push(getNearbyZipCodesData.postalCodes[i].postalCode);
            }
            
        } else {
            return new Response(`Failed to fetch nearby ZIP codes!`, {
                status: 500,
            })
        }
    } catch (error) {
        return new Response(`Error fetching nearby ZIP codes! ${error}`, {
            status: 500,
        })
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

      const finalConditions = [
        ...conditions,
        {
          "groupOperator": "or",
          "conditions": formattedPostalCodesArray
        }
      ];

    const payload = {
        "conditions": finalConditions,
        "limit": 500
    };

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    const fetchCMSData = await fetch('https://data.cms.gov/provider-data/api/1/datastore/query/yv7e-xc69/0', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })

    try {
        if (fetchCMSData.ok) {
            const CMSData = await fetchCMSData.json();

            const formattedResults = CMSData.results.map((result: Result) => ({
                facility_name: result.facility_name,
                address: result.address,
                citytown: result.citytown,
                state: result.state,
                zip_code: result.zip_code,
                countyparish: result.countyparish,
                telephone_number: result.telephone_number,
                score: result.score,
                sample: result.sample,
            }));

            formattedData = {
                count: formattedResults.length,
                results: formattedResults,
            };
            
        } else {
            return new Response(`Failed to cross-reference the CMS database!`, {
                status: 500,
            })
        }
    } catch (error) {
        return new Response(`Error cross-referencing the CMS database! ${error}`, {
            status: 500,
        })
    }

    return NextResponse.json({ status: "success", data: { formattedData } });
}