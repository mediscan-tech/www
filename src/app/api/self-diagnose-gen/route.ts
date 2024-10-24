import { NextResponse } from "next/server";
import type { NextApiResponse } from "next";
import Groq from "groq-sdk";

// Define the handler for POST requests
export async function POST(request: Request, res: NextApiResponse) {
  const data: any = await request.json(); // Parse the JSON request body to get the input data

  if (!data?.model_type || !data?.predicted_class_name) {
    return NextResponse.json(
      {
        error:
          "Invalid request body. Pass `model_type` and/or `predicted_class`",
      },
      { status: 400 }
    );
  }

  try {
    // ENV KEYS
    let GROQ_API_KEY = process.env.GROQ2_API_KEY;

    const groq = new Groq({
      apiKey: GROQ_API_KEY,
    }); // Initialize Groq SDK

    // Create a prompt for Groq API with the response from Tavily API
    let groqPrompt = `Model_type: ${data.model_type} model, predicted_class from the model: ${data.predicted_class_name}. do the things you are assigned to do as a healthcare professional AI`;

    // Define the parameters for the Groq API call
    const groqParams: any = {
      messages: [
        {
          role: "system",
          content:
            "You are a healthcare professional AI that gives information about diseases that patients may be diagnosed with (The diagnoses come from 3 different models, skin, nails, and mouth that we developed ourselves.) Model_type is where the disease is occuring, it will either be skin, nails, or mouth. Predicted Class is the diagnosed disease. Give a summary of what the disease given is, (They will always be either skin, nail, or oral diseases), and what steps the patient can take about the disease. Give me the completion in JSON format strictly looking like this: {'groq_generation': '(your generation about the disease)'}, No extra brackets or escape sequences or anything. Return back perfect JSON to display on a web page",
        },
        { role: "user", content: groqPrompt },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.05,
      max_tokens: 5000,
      stream: false,
      response_format: {
        type: "json_object",
      },
    };

    // Call Groq API and parse the response
    const groqCompletion = await groq.chat.completions.create(groqParams);
    let parsedGroqCompletion: any =
      groqCompletion.choices[0]?.message?.content ?? "";
    parsedGroqCompletion = JSON.parse(parsedGroqCompletion); // parse to get rid of the extra quotes and \n's Groq gives

    // Return the successfully processed and inserted data
    return NextResponse.json(
      { generation: parsedGroqCompletion.groq_generation },
      { status: 200 }
    );
  } catch (err: any) {
    // Handle any other errors that may occur during the process
    console.error(err);
    return NextResponse.json(
      { error: `An error occurred: ${err.message}` },
      { status: 500 }
    );
  }
}
