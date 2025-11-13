import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const elevenlabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const voices = await elevenlabs.voices.getAll();

    return NextResponse.json(voices);
  } catch (error) {
    console.error('Failed to fetch voices:', error);

    // Return a generic error to avoid exposing API key details
    return NextResponse.json(
      { error: 'Failed to fetch voices. Please check your API configuration.' },
      { status: 500 }
    );
  }
}