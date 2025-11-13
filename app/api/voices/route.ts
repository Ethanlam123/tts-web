import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const elevenlabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
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

    // Return a generic error to avoid exposing API key details
    return NextResponse.json(
      { error: 'Failed to fetch voices. Please check your API configuration.' },
      { status: 500 }
    );
  }
}