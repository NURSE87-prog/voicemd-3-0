import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transcript, language } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error: API key missing' }, { status: 500 });
    }

    const langInstruction = language === 'FR' ? 'Write the medical note entirely in French.' : 'Write the medical note entirely in English.';

    const systemPrompt = `You are an expert AI medical scribe helping a general practitioner. 
Your task is to take a raw transcript of a doctor's voice note and convert it into a structured, professional medical note.
Structure the note strictly into these 4 sections:
1. Chief Complaint
2. History
3. Assessment
4. Plan

Rules:
- Be concise.
- Keep professional medical terminology.
- Infer reasonable details if they are implied, but do not hallucinate diagnoses that have no basis in the text.
- If a section lacks information from the transcript, state "Not mentioned."
- ${langInstruction}

Return ONLY a JSON object with the exact keys: 'chiefComplaint', 'history', 'assessment', 'plan'.`;

    const userPrompt = `Raw Transcript:\n"${transcript}"`;

    console.log('Calling Groq chat completion API...');
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    const responseText = await response.text();
    console.log('Groq chat response status:', response.status);
    console.log('Groq chat response:', responseText);

    if (!response.ok) {
      let errorMessage = `Groq API error: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {}
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = JSON.parse(responseText);
    const resultText = data.choices?.[0]?.message?.content;

    if (!resultText) {
      return NextResponse.json({ error: 'Empty response from Groq' }, { status: 500 });
    }

    console.log('Parsing structured note...');
    const structuredNote = JSON.parse(resultText);
    return NextResponse.json({ note: structuredNote });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Note generation error:', message);
    return NextResponse.json({ error: `Note generation failed: ${message}` }, { status: 500 });
  }
}
