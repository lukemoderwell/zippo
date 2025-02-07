import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the Zod schema for the structured output
const LandingPageSchema = z.object({
  name: z.string(),
  description: z.string(),
  app_url: z.string().url(),
  landing_page_html: z.string(),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const appUrl = formData.get('appUrl') as string;
    const screenshot = formData.get('screenshot') as File | null;
    const googleAnalyticsId = formData.get('googleAnalyticsId') as string;
    if (!name || !description || !appUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let screenshotDescription = '';
    if (screenshot) {
      try {
        const buffer = await screenshot.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Describe this app screenshot in detail:',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
        });
        screenshotDescription = response.choices[0].message.content || '';
      } catch (error) {
        console.error('Error processing screenshot:', error);
        return NextResponse.json(
          {
            error: 'Error processing screenshot',
            details: (error as Error).message,
          },
          { status: 500 }
        );
      }
    }

    const response = await openai.chat.completions.create({
      model: 'o3-mini',
      messages: [
        {
          role: 'system',
          content: `You are a landing page generator. Generate a response in the following JSON structure:
        {
        "name": "The app name",
        "description": "A brief description of the app",
        "app_url": "The app's URL",
        "landing_page_html": "The complete HTML for the landing page including inline CSS"
        }`,
        },
        {
          role: 'user',
          content: `Create a landing page with the following details:
            Name: ${name}
            Description: ${description}
            App URL: ${appUrl}
            App Screenshot Description: ${screenshotDescription}
            Google Analytics ID: ${googleAnalyticsId}
            The App Screenshot is only to be used as a reference for the colors, styles and features of the app.

            The landing page should:
            - Use colors and styles that match the screenshot description
            - Include Google Analytics tracking
            - Use marketing best practices to write a compelling heading and subheading
            - Also the CTA should have a button that compels the user to take action or sign up
            - Have proper SEO meta data
            - Use semantic HTML with inline CSS
            - Be modern and attractive
            - Include headings, paragraphs, and a call-to-action button
            - Use modern fonts like Inter and Roboto
            - Be responsive and mobile friendly`,
        },
      ],
      response_format: { type: 'json_object' },
    //   temperature: 0.7,
    });

    const rawResponse = response.choices[0].message.content || '';
    if (!rawResponse) {
      throw new Error('No content generated');
    }

    // Parse and validate the response
    const parsedResponse = JSON.parse(rawResponse);
    const validatedResponse = LandingPageSchema.parse(parsedResponse);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('Error generating landing page:', error);
    let errorMessage = 'Error generating landing page';
    let errorDetails = '';
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = JSON.stringify(error);
    }
    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 }
    );
  }
}
