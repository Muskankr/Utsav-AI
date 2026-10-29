import { EventDetails, AIEventPlan, TaskPhase, TaskPriority } from '@/types';

/**
 * Generate a deterministic, realistic expert celebration plan when GEMINI_API_KEY
 * is not configured or during Demo Mode.
 * This ensures Utsav AI is 100% functional, reliable, and testable out of the box.
 */
export function generateDeterministicPlan(details: EventDetails): AIEventPlan {
  const { name, type, city, guestCount, budget, dietary, theme, preferences } = details;

  // Derive customized theme & styling
  let primaryTheme = theme || 'Festive Indian Elegance & Warm Hospitality';
  let colorPalette = ['#991B1B', '#D97706', '#FDE68A', '#1E1B4B', '#FFFFFF'];
  let aestheticVibe = '';
  let decorConcepts: string[] = [];
  let entertainmentRituals: string[] = [];
  let welcomeDrinks: string[] = [];
  let liveCounters: string[] = [];
  let specialties: string[] = [];
  let desserts: string[] = [];

  // Budget category ratios
  let budgetRatio: Record<string, number> = {
    venue: 28,
    catering: 32,
    decoration: 15,
    photography: 9,
    entertainment: 6,
    transport: 4,
    contingency: 6,
  };

  switch (type) {
    case 'birthday':
      primaryTheme = theme || 'Carnival Lights & Pastel Balloon Symphony';
      colorPalette = ['#F43F5E', '#8B5CF6', '#FBBF24', '#38BDF8', '#FFFFFF'];
      aestheticVibe = `Vibrant, joyful celebration in ${city} with balloon arches, personalized photo photobooth, fairy light canopies, and playful interactive corners.`;
      decorConcepts = [
        'Grand 3D Marquee Lettering with LED backlit name display',
        'Organic pastel balloon garland arch & shimmering tinsel photobooth backdrop',
        'Customized sweet treat dessert table with floral cake pedestal',
        'Ambient warm festoon bulbs and glow-in-the-dark dance floor for evening',
      ];
      welcomeDrinks = [
        'Virgin Blue Curacao & Lychee Fizz',
        'Fresh Alphonso Mango Shake with ice cream scoops',
        'Spiced Watermelon-Mint Coolers',
      ];
      liveCounters = [
        'Live Mumbai Pav Bhaji & Mini Slider station',
        'Interactive Pasta Bar with choice of sauces (Alfredo / Arbiatta)',
        'Kids favourite Nachos & Quesadilla station',
      ];
      specialties = [
        'Crispy Corn Canapes & Paneer Tikka Skewers',
        dietary === 'pure_veg' || dietary === 'jain_options'
          ? 'Gourmet Vegetable Lasagna & Dal Makhani with Garlic Naan'
          : 'Butter Chicken & Paneer Lababdar with buttery parathas',
        'Assorted Dum Biryani with pomegranate raita',
      ];
      desserts = [
        'Custom 3-Tier Theme Fondant / Fresh Fruit Cake',
        'Live Dutch Pancake (Poffertjes) counter with Nutella & sprinkles',
        'Artisanal Nitrogen Ice-Cream scoop bar',
      ];
      entertainmentRituals = [
        'Energetic Host / Emcee hosting trivia quizzes and musical chairs',
        'Interactive Close-Up Magician or Live Puppet performance for children',
        'High-energy Bollywood DJ dance hour with fog machines',
        'Cake cutting countdown with family toasts and celebratory confetti blast',
      ];
      budgetRatio = {
        venue: 22,
        catering: 35,
        decoration: 18,
        photography: 8,
        entertainment: 10,
        transport: 2,
        contingency: 5,
      };
      break;

    case 'community':
      primaryTheme = theme || 'Utsav Milan: Traditional Folk & Community Harmony';
      colorPalette = ['#DC2626', '#EA580C', '#EAB308', '#047857', '#FFFFFF'];
      aestheticVibe = `Warm, inclusive community gathering in ${city} welcoming ${guestCount} attendees with traditional torans, cultural stage setup, and communal seating.`;
      decorConcepts = [
        'Main Entry: Grand welcome arch draped with authentic yellow and orange marigold garlands & brass URLIs',
        'Central Stage: Cultural program stage with auspicious backdrop, Rangoli artwork, and professional PA audio truss',
        'Community Dining: Clean, covered pandal with systematic buffet queue islands to handle ${guestCount} guests smoothly',
        'Photo Kiosk: Traditional selfie spot with heritage charpai, puppets, and festival props',
      ];
      welcomeDrinks = [
        'Thandai with crushed almonds and saffron',
        'Aam Panna with roasted cumin',
        'Ginger Lemongrass Masala Chai counter',
      ];
      liveCounters = [
        'Live Street Food Bazar: Pani Puri (5 flavored waters), Sev Puri & Dahi Papdi',
        'Hot Jalebi & Fafda with fried green chilies counter',
        'Steaming South Indian Dosa & Idli live grill station',
      ];
      specialties = [
        'Traditional community Mahaprasad / Festive Thali with pure ghee preparation',
        'Paneer Butter Masala, Chhole Kulche & Kashmiri Pulao',
        dietary === 'jain_options'
          ? 'Dedicated root-vegetable-free Jain Bhojan station'
          : 'Regional seasonal specialties with seasonal pickle and papad bar',
      ];
      desserts = [
        'Saffron Kheer (Rice Pudding) garnished with silver vark and pistachios',
        'Hot Gulab Jamun dipped in rose syrup',
        'Traditional Moong Dal Halwa made in desi ghee',
      ];
      entertainmentRituals = [
        'Lighting of the ceremonial diya / lamp by community elders',
        'Inter-society kids dance, classical performance, and drama recital',
        'Dandiya-Raas / Bhangra open floor for all families and youth',
        'Felicitation ceremony recognizing volunteers and community achievers',
      ];
      budgetRatio = {
        venue: 25,
        catering: 38,
        decoration: 14,
        photography: 6,
        entertainment: 9,
        transport: 3,
        contingency: 5,
      };
      break;

    case 'anniversary':
      primaryTheme = theme || 'Golden Milestones & Candlelit Romance';
      colorPalette = ['#B45309', '#1E1B4B', '#FDE68A', '#F43F5E', '#FAF5FF'];
      aestheticVibe = `Intimate, sophisticated gala in ${city} honouring lifelong love with warm candlelit tables, lush white orchids, and vintage jazz/ghazal melodies.`;
      decorConcepts = [
        'Memory Lane Tunnel: Framed chronological family photos with fairy light canopy',
        'Stage: Elegant floral arch with golden ring centerpiece and velvet lounge chairs',
        'Tablescapes: White linen, vintage candelabras, fresh rose centerpieces, and personalized name cards',
      ];
      welcomeDrinks = [
        'Sparkling Cranberry Spritzer',
        'Peach Bellini Mocktail with rosemary sprig',
        'Signature Royal Badam Sharbat',
      ];
      liveCounters = [
        'Live Woodfired Neapolitan Pizza & Bruschetta station',
        'Tawa Paneer & Galouti Kebab counter with roomali roti',
        'Dim Sum & Baos live steaming counter',
      ];
      specialties = [
        'Gourmet North Indian Mughlai & Continental spread',
        'Dal Bukhara simmered for 24 hours with Garlic butter naan',
        'Awadhi Subz Biryani with burani dip',
      ];
      desserts = [
        'Silver/Golden Jubilee layered tier cake with edible flowers',
        'Tiramisu cups & Belgian chocolate mousse',
        'Angoori Rasmalai with saffron milk',
      ];
      entertainmentRituals = [
        'Couple grand entry accompanied by saxophone or violin melody',
        'Emotional video documentary screening of their decades together',
        'Vow renewal ceremony with ring exchange and blessings from children/grandchildren',
        'Slow dance and live Ghazal / Retro Bollywood acoustic band',
      ];
      budgetRatio = {
        venue: 26,
        catering: 34,
        decoration: 16,
        photography: 10,
        entertainment: 7,
        transport: 2,
        contingency: 5,
      };
      break;

    case 'pooja_ceremony':
      primaryTheme = theme || 'Vedic Sanctity & Shubh Sangeet';
      colorPalette = ['#B91C1C', '#D97706', '#FEF08A', '#065F46', '#FFFFFF'];
      aestheticVibe = `Auspicious, serene Vedic ambiance in ${city} with fresh banana leaves, mango leaf torans, brass oil lamps, and sacred Vedic chants.`;
      decorConcepts = [
        'Havan Kund / Altar: Traditional brick havan with auspicious geometric swastik rangoli and fresh cow dung purification base',
        'Mandap: Traditional yellow marigold & mango leaf canopy with hanging brass bells',
        'Seating: Comfortable cotton durries and low wooden chowkis for seated rituals',
      ];
      welcomeDrinks = [
        'Tender Coconut Water straight in shell with eco-friendly straws',
        'Aromatic Tulsi-Adrak Masala Chai',
        'Kesar Elaichi Lassi',
      ];
      liveCounters = [
        'Fresh South Indian Tiffin counter: Ghee Roast Dosa, Medu Vada & Idli',
        'Chana Sundal & Sabudana Vada counter',
      ];
      specialties = [
        'Pure Satvik Prasadam Bhojan without onion or garlic',
        'Bisi Bele Bath / Khichdi served with home churned white butter',
        'Panchamrit, Kaddu ki Sabzi, Poori, and Kuttu delicacies',
      ];
      desserts = [
        'Desi Ghee Boondi Ladoo & Tirupati-style Prasadam',
        'Payasam / Sheera enriched with dry fruits and saffron',
        'Fresh Rasgulla in sweet cardamom syrup',
      ];
      entertainmentRituals = [
        'Ganesh Sthapana & Navagraha Havan by learned Sanskrit scholars',
        'Soulful Bhajan and Sangeet Kirtan with harmonium, tabla, and kartal',
        'Aarti ceremony where all family members participate together',
        'Prasadam distribution and blessings from elders',
      ];
      budgetRatio = {
        venue: 18,
        catering: 38,
        decoration: 16,
        photography: 6,
        entertainment: 8,
        transport: 4,
        contingency: 10,
      };
      break;

    case 'wedding':
    default:
      primaryTheme = theme || 'Royal Heritage & Contemporary Elegance';
      colorPalette = ['#991B1B', '#D97706', '#FDE68A', '#1E1B4B', '#FFFFFF'];
      aestheticVibe = `Regal, heartwarming celebration in ${city} combining timeless cultural rituals, lavish hospitality for ${guestCount} guests, and contemporary comfort.`;
      decorConcepts = [
        'Auspicious Mandap: Circular 4-pillar floral mandap elevated with hanging lotus buds and brass diyas',
        'Grand Entrance: Arch of 1,000 marigolds with live Shehnai / Nadaswaram players to greet arriving guests',
        'Dining Pavilions: Silk shamiana tents with handcrafted brass lanterns and block-printed runners',
        'Varmala Stage: Elevated platform with cold-sparkular pyros and cascading flower chandeliers',
      ];
      welcomeDrinks = [
        'Kesar Pista Badam Milk served in chilled clay kulhads',
        'Kokum & Fresh Mint Spritzer',
        'Royal Rose Sherbet with chia seeds',
      ];
      liveCounters = [
        'Purani Dilli Chaat Galli: Palak Patta Chaat, Raj Kachori, Dahi Bhalla',
        'Amritsari Stuffed Kulcha & Pindi Chole live tandoor',
        'Gourmet Live Pasta & Stonebaked Neapolitan flatbreads',
      ];
      specialties = [
        'Signature Heritage Curries (Shahi Paneer / Rogan Josh / Dal Makhani)',
        'Dum Pukht Handi Biryani served with Mirch ka Salan & Burani Raita',
        dietary === 'jain_options'
          ? 'Dedicated separate pure Jain kitchen line with zero root vegetables'
          : 'Assorted artisan Indian breads baked fresh in clay ovens',
      ];
      desserts = [
        'Warm Ghewar & Malpua served with dense saffron Rabdi',
        'Live Jalebi counter fried crisp in desi ghee',
        'Kulfi Falooda bar with rose syrup and roasted dry fruits',
        'Late-night cutting chai & hot pyaaz kachori counter',
      ];
      entertainmentRituals = [
        'Joyous Baraat procession with high-tempo dhol rhythms and brass band',
        'Varmala garland exchange under golden sparks and rose petal shower',
        'Sacred Vedic Pheras accompanied by acoustic Santoor and flute commentary',
        'Choreographed Sangeet family dance face-offs with professional anchor',
      ];
      budgetRatio = {
        venue: 28,
        catering: 32,
        decoration: 15,
        photography: 9,
        entertainment: 6,
        transport: 4,
        contingency: 6,
      };
      break;
  }

  // Generate suggested tasks
  const suggestedTasks: Array<{
    title: string;
    phase: TaskPhase;
    priority: TaskPriority;
    offsetDaysBefore: number;
  }> = [
    {
      title: `Finalize and book primary ${type} venue in ${city} with advance deposit`,
      phase: 'early_planning',
      priority: 'high',
      offsetDaysBefore: 90,
    },
    {
      title: `Confirm Catering contract for ${guestCount} guests (${dietary} requirements)`,
      phase: 'early_planning',
      priority: 'high',
      offsetDaysBefore: 60,
    },
    {
      title: `Design and send digital Save-the-Date invitations via WhatsApp & Email`,
      phase: 'early_planning',
      priority: 'medium',
      offsetDaysBefore: 45,
    },
    {
      title: `Book Photographer & Videographer with drone & candid coverage clause`,
      phase: 'early_planning',
      priority: 'high',
      offsetDaysBefore: 40,
    },
    {
      title: `Approve decor themes, floral mockups, and stage lighting specifications`,
      phase: 'month_before',
      priority: 'medium',
      offsetDaysBefore: 30,
    },
    {
      title: `Finalize DJ tracklist, emcee script, and family performance choreography`,
      phase: 'month_before',
      priority: 'medium',
      offsetDaysBefore: 15,
    },
    {
      title: `Reconfirm guest RSVPs, transport coach pickups, and room allotments`,
      phase: 'week_before',
      priority: 'high',
      offsetDaysBefore: 7,
    },
    {
      title: `Assemble emergency kit (medicines, cash envelopes, extra safety pins, battery banks)`,
      phase: 'week_before',
      priority: 'high',
      offsetDaysBefore: 3,
    },
    {
      title: `Conduct venue walkthrough, AV microphone check, and coordinator briefing`,
      phase: 'event_day',
      priority: 'high',
      offsetDaysBefore: 0,
    },
    {
      title: `Settle final vendor invoice balances and collect raw photo backup drive`,
      phase: 'post_event',
      priority: 'medium',
      offsetDaysBefore: -2,
    },
  ];

  // Timeline for day of event
  const dayOfTimeline = [
    {
      time: '09:00 AM',
      title: 'Vendor Access & Setup Walkthrough',
      description: 'Decorators commence floral installations, sound crew sets up PA console, catering team verifies kitchen access.',
    },
    {
      time: '01:00 PM',
      title: 'Styling, Attire & Family Preparations',
      description: 'Hair, makeup, and outfit coordination for host family and key participants.',
    },
    {
      time: '04:30 PM',
      title: 'Guest Welcome & High Tea / Refreshments',
      description: 'Welcome drinks, live instrumental music, and photo booth activations.',
    },
    {
      time: '06:00 PM',
      title: 'Main Ceremonial Rituals / Key Moments',
      description: 'Primary auspicious rituals, auspicious lamp lighting, or grand arrival.',
    },
    {
      time: '07:30 PM',
      title: 'Cultural Performances, Speeches & Music',
      description: 'Choreographed dances, heartfelt speeches, and celebratory milestones.',
    },
    {
      time: '08:30 PM',
      title: 'Grand Banquet Dinner & Live Counters Open',
      description: `Buffet open for all ${guestCount} guests with signature ${dietary} selections and live dessert stations.`,
    },
    {
      time: '11:00 PM',
      title: 'Blessings, Family Wrap-up & Safe Departures',
      description: 'Return favors distribution, heartfelt farewells, and overnight logistics handover.',
    },
  ];

  const vendorRecommendations = [
    {
      category: 'Venue & Banquet Hall',
      keyQuestions: [
        'Does the rental include generator backup (DG sets) and HVAC electricity charges?',
        'What are the municipal sound curfew cutoffs for open lawn areas?',
        'How many complimentary dressing / green rooms are included?',
      ],
      estimatedSharePercent: budgetRatio.venue,
    },
    {
      category: 'Catering & Dining Kitchens',
      keyQuestions: [
        `How is the kitchen partitioned to strictly respect ${dietary} dietary mandates?`,
        'What is the staff-to-guest ratio for live counters vs floating service?',
        'What is the policy for unexpected extra guests (10-15% buffer)?',
      ],
      estimatedSharePercent: budgetRatio.catering,
    },
    {
      category: 'Decor & Floral Architecture',
      keyQuestions: [
        'Can you provide a 3D digital walkthrough or sample swatch board beforehand?',
        'How do you manage fresh floral preservation during temperature swings?',
        'Is all structural trussing, fireproof carpeting, and safety certification covered?',
      ],
      estimatedSharePercent: budgetRatio.decoration,
    },
    {
      category: 'Cinematography & Candid Photography',
      keyQuestions: [
        'How many dedicated traditional vs candid shooters will be deployed?',
        'What is the contractual turnaround time for the teaser highlight reel?',
        'Will uncompressed raw photo and 4K video files be supplied on an external hard drive?',
      ],
      estimatedSharePercent: budgetRatio.photography,
    },
  ];

  return {
    summary: `A bespoke celebration designed for "${name}" hosting ${guestCount} guests in ${city} with a budget of ₹${budget.toLocaleString('en-IN')}. This plan harmonizes traditional festive warmth, tailored ${dietary} gourmet culinary experiences, thoughtful timeline pacing, and seamless vendor coordination.`,
    themeVision: {
      primaryTheme,
      colorPalette,
      aestheticVibe,
      decorConcepts,
    },
    cateringHighlights: {
      welcomeDrinks,
      liveCounters,
      specialties,
      desserts,
    },
    entertainmentRituals,
    recommendedBudgetRatio: budgetRatio,
    suggestedTasks,
    dayOfTimeline,
    vendorRecommendations,
    isAiGenerated: false,
    modelUsed: 'Utsav AI Vedic Planner Engine (Demo Mode)',
    generatedAt: new Date().toISOString(),
  };
}

