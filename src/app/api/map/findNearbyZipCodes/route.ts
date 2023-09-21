import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
    const data: any = await request.json();
    const latitude = data.latitude;
    const longitude = data.longitude;
    const limit = 499;
    let zipCode: string | null = null;
    let postalCodesArray = [];

    if (!data || data === null || data === undefined || data === '') {
        return new Response(`Latitude or longitude missing!`, {
            status: 500,
        })
    }
    
    const getZip = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}`)
    //TODO: add redis caching here to save on API calls
    try {
        if (getZip.ok) {
            const data = await getZip.json();
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
            console.log(postalCodesArray)
            
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
    
    return NextResponse.json({ status: "success" });
}
