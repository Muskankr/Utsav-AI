import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const hasKey = Boolean(apiKey && apiKey !== 'your_gemini_api_key_here');

  return NextResponse.json({
    hasGeminiKey: hasKey,
    mode: hasKey ? 'live_ai' : 'demo',
    model: hasKey ? 'Google Gemini 1.5 Flash' : 'Utsav AI Demo Engine',
  });
}

