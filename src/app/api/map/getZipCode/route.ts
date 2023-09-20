import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
    const data: any = await request.json();
    const latitude = data.latitude;
    const longitude = data.longitude;

    if (!data || data === null || data === undefined || data === '') {
        return new Response(`Latitude or longitude missing!`, {
            status: 500,
        })
    }
    
    const getZip = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}`)

    try {
        if (getZip.ok) {
            const data = await getZip.json();
            const zipCode = data.results[0].components.postcode;
            return NextResponse.json({ zipCode });
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
}
