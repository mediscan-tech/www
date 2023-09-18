import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
    const data: any = await request.json();
    const latitude = data.latitude;
    const longitude = data.longitude;
    // console.log(data.latitude)
    const getZip = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}`)
    // console.log(await getZip.json())
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


// import { NextResponse } from 'next/server';
// export async function POST(request: Request) {
//     const data: any = await request.json();
//     const latitude = data.latitude;
//     const longitude = data.longitude;
//     console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
//     return NextResponse.json({ lat: latitude, long: longitude})
// }


// import { NextResponse } from 'next/server'
 
// export async function POST(request: Request) {
//  const res = await request.json()
//  return NextResponse.json({ res })
// }