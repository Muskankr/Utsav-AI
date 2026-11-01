import { NextRequest, NextResponse } from 'next/server';
import { EventDetails, AIEventPlan } from '@/types';
import { generateDeterministicPlan } from '@/lib/aiPlanner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const details = body.details as EventDetails;

    if (!details || !details.name || !details.type || !details.date) {
      return NextResponse.json(
        { error: 'Missing required event details (name, type, date).' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // If no API key configured, use deterministic expert planner in Demo Mode
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      const demoPlan = generateDeterministicPlan(details);
      return NextResponse.json({
        plan: demoPlan,
        mode: 'demo',
        message: 'Generated using Utsav AI Deterministic Vedic Engine (Demo Mode). Set GEMINI_API_KEY in your environment for live Google Gemini AI generation.',
      });
    }

    // Call Google Gemini API
    const prompt = `You are "Utsav AI", an elite Indian event planner and celebration designer with 20+ years of experience curating magnificent weddings, grand birthdays, vibrant community festivals, and auspicious poojas across India.

Create an exhaustive, deeply personalized celebration blueprint for the following event in valid JSON format:
- Event Name: ${details.name}
- Event Type: ${details.type}
- Celebration Date: ${details.date}
- City / Region: ${details.city || 'India'}
- Guest Count: ${details.guestCount} attendees
- Overall Budget: ₹${details.budget?.toLocaleString('en-IN')} INR
- Dietary Preference: ${details.dietary}
- Theme Preference: ${details.theme || 'Traditional Festive Opulence with Modern Comfort'}
- Host Special Requests & Vision: ${details.preferences || 'None specified'}

Return a single valid JSON object strictly matching this TypeScript structure, with no markdown code blocks and no text outside the JSON:
{
  "summary": "A 2-3 sentence inspiring vision summarizing the emotional tone, hospitality style, and unique ambiance.",
  "themeVision": {
    "primaryTheme": "Name of the aesthetic theme",
    "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
    "aestheticVibe": "Detailed 2-sentence description of the visual mood, materials, and lighting",
    "decorConcepts": [
      "Specific entrance concept with Indian floral/brass elements",
      "Mandap or Central Stage architecture and backdrop concept",
      "Dining area styling, seating arrangements, and tableware",
      "Photo-op or selfie installation concept tailored to this event"
    ]
  },
  "cateringHighlights": {
    "welcomeDrinks": ["3 signature welcome drinks with regional flair"],
    "liveCounters": ["3 interactive live food counters suited to the guests"],
    "specialties": ["3 main course signature delicacies matching the ${details.dietary} requirement"],
    "desserts": ["3 authentic celebratory desserts including live counter"]
  },
  "entertainmentRituals": [
    "4 chronological ritual or entertainment milestones tailored to this event"
  ],
  "recommendedBudgetRatio": {
    "venue": 28,
    "catering": 32,
    "decoration": 15,
    "photography": 9,
    "entertainment": 6,
    "transport": 4,
    "contingency": 6
  },
  "suggestedTasks": [
    {
      "title": "Actionable milestone description",
      "phase": "early_planning", // one of: "early_planning", "month_before", "week_before", "event_day", "post_event"
      "priority": "high", // one of: "high", "medium", "low"
      "offsetDaysBefore": 60 // integer days before event date
    }
  ],
  "dayOfTimeline": [
    {
      "time": "09:00 AM",
      "title": "Milestone title",
      "description": "Specific activities occurring at this hour"
    }
  ],
  "vendorRecommendations": [
    {
      "category": "Vendor category name",
      "keyQuestions": ["2-3 crucial questions host should ask this vendor"],
      "estimatedSharePercent": 25
    }
  ]
}`;

    // Use Gemini 1.5 Flash endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Gemini API returned error ${response.status}: ${errorText}. Falling back to demo engine.`);
        const demoPlan = generateDeterministicPlan(details);
        return NextResponse.json({
          plan: demoPlan,
          mode: 'demo_fallback',
          message: `Live Gemini API returned status ${response.status}. Switched smoothly to Utsav AI Demo Engine.`,
        });
      }

      const result = await response.json();
      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Empty response from Gemini model.');
      }

      // Clean any potential markdown wrapping
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.slice(7);
      }
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.slice(3);
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.slice(0, -3);
      }
      cleanJson = cleanJson.trim();

      const parsed = JSON.parse(cleanJson);

      const aiPlan: AIEventPlan = {
        summary: parsed.summary || 'A bespoke celebration designed to create everlasting memories.',
        themeVision: parsed.themeVision || {
          primaryTheme: details.theme || 'Festive Indian Charm',
          colorPalette: ['#991B1B', '#D97706', '#FDE68A', '#1E1B4B', '#FFFFFF'],
          aestheticVibe: 'Joyous ambiance with marigolds and festive lights.',
          decorConcepts: ['Entrance Toran', 'Auspicious Stage', 'Festive Dining Area'],
        },
        cateringHighlights: parsed.cateringHighlights || {
          welcomeDrinks: ['Kesar Badam Milk', 'Fresh Lime Soda'],
          liveCounters: ['Live Chaat Counter', 'Jalebi Station'],
          specialties: ['Shahi Paneer', 'Dal Makhani', 'Pulao'],
          desserts: ['Gulab Jamun', 'Rasmalai'],
        },
        entertainmentRituals: parsed.entertainmentRituals || ['Welcome Aarti', 'Family Dance', 'Grand Dinner'],
        recommendedBudgetRatio: parsed.recommendedBudgetRatio || {
          venue: 28,
          catering: 32,
          decoration: 15,
          photography: 9,
          entertainment: 6,
          transport: 4,
          contingency: 6,
        },
        suggestedTasks: Array.isArray(parsed.suggestedTasks) && parsed.suggestedTasks.length > 0
          ? parsed.suggestedTasks
          : generateDeterministicPlan(details).suggestedTasks,
        dayOfTimeline: Array.isArray(parsed.dayOfTimeline) && parsed.dayOfTimeline.length > 0
          ? parsed.dayOfTimeline
          : generateDeterministicPlan(details).dayOfTimeline,
        vendorRecommendations: Array.isArray(parsed.vendorRecommendations) && parsed.vendorRecommendations.length > 0
          ? parsed.vendorRecommendations
          : generateDeterministicPlan(details).vendorRecommendations,
        isAiGenerated: true,
        modelUsed: 'Google Gemini 1.5 Flash',
        generatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        plan: aiPlan,
        mode: 'live_ai',
        message: 'Successfully generated personalized event blueprint via Google Gemini 1.5 Flash.',
      });
    } catch (fetchErr: unknown) {
      clearTimeout(timeoutId);
      const errMessage = fetchErr instanceof Error ? fetchErr.message : 'Network failure';
      console.warn(`Fetch to Gemini failed (${errMessage}). Falling back to Demo Engine.`);
      
      const demoPlan = generateDeterministicPlan(details);
      return NextResponse.json({
        plan: demoPlan,
        mode: 'demo_fallback',
        message: `Gemini API call timed out or failed (${errMessage}). Showing comprehensive plan via Utsav AI Demo Engine.`,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('API /api/generate-plan error:', message);
    return NextResponse.json(
      { error: `Internal server error: ${message}` },
      { status: 500 }
    );
  }
}

