import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const language = formData.get('language') as string;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error: API key missing' }, { status: 500 });
    }
    const langCode = language === 'FR' ? 'fr' : 'en';

    console.log('--- Transcription Request ---');
    console.log('File size:', file.size, 'type:', file.type);
    console.log('Language:', langCode);

    const groqFormData = new FormData();
    groqFormData.append('file', file, 'audio.webm');
    groqFormData.append('model', 'whisper-large-v3');
    groqFormData.append('language', langCode);

    console.log('Calling Groq transcription API with key:', apiKey.substring(0, 10) + '...');
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: groqFormData,
    });

    const responseText = await response.text();
    console.log('Groq response status:', response.status);
    console.log('Groq response:', responseText);

    if (!response.ok) {
      let errorMessage = `Groq API error: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {}
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({ text: data.text });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Transcription error:', message);
    return NextResponse.json({ error: `Transcription failed: ${message}` }, { status: 500 });
  }
}
