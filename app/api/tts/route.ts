import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { text, voiceId } = body;

    // Validate required parameters
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!voiceId || typeof voiceId !== 'string') {
      return NextResponse.json(
        { error: 'Voice ID is required' },
        { status: 400 }
      );
    }

    const elevenlabs = new ElevenLabsClient({
      apiKey: apiKey,
    });

    const audio = await elevenlabs.textToSpeech.convert(voiceId, {
      text: text.trim(),
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });

    // Convert stream to buffer with better error handling
    const chunks = [];
    let totalSize = 0;

    try {
      const reader = audio.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        totalSize += value.length;
      }

      if (chunks.length === 0) {
        throw new Error('No audio data received from ElevenLabs');
      }

      const buffer = Buffer.concat(chunks);

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'no-cache',
        },
      });
    } catch (streamError) {
      console.error('Error processing audio stream:', streamError);
      throw new Error('Failed to process audio stream from ElevenLabs');
    }
  } catch (error) {
    console.error('Failed to generate audio:', error);

    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again shortly.' },
        { status: 429 }
      );
    }

    // Generic error for other cases
    return NextResponse.json(
      { error: 'Failed to generate audio. Please try again.' },
      { status: 500 }
    );
  }
}