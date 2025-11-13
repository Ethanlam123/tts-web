import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get API key from headers or fallback to environment variable
    const apiKey = request.headers.get('x-api-key') || process.env.ELEVENLABS_API_KEY;

    // Ensure API key is available
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required. Please configure your ElevenLabs API key in settings.' },
        { status: 401 }
      );
    }

    const elevenlabs = new ElevenLabsClient({
      apiKey: apiKey,
    });

    const voices = await elevenlabs.voices.getAll();

    // Map voiceId to voice_id for frontend consistency
    const mappedVoices = {
      voices: voices.voices?.map((voice: any) => ({
        voice_id: voice.voiceId,
        name: voice.name,
        labels: voice.labels,
        description: voice.description,
      })) || []
    };

    return NextResponse.json(mappedVoices);
  } catch (error) {
    console.error('Failed to fetch voices:', error);

    // Return specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        return NextResponse.json(
          { error: 'Invalid or expired API key. Please check your API key configuration.' },
          { status: 401 }
        );
      }
      if (error.message.includes('429')) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again shortly.' },
          { status: 429 }
        );
      }
    }

    // Generic error for other cases
    return NextResponse.json(
      { error: 'Failed to fetch voices. Please check your API configuration.' },
      { status: 500 }
    );
  }
}