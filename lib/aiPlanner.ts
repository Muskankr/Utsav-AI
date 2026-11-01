
import {
  EventDetails,
  AIEventPlan,
  TaskPhase,
  TaskPriority,
  EventType,
  DietaryRequirement,
} from '@/types';

type PlannerConfig = {
  primaryTheme: string;
  colorPalette: string[];
  aestheticVibe: string;
  decorConcepts: string[];
  welcomeDrinks: string[];
  liveCounters: string[];
  specialties: string[];
  desserts: string[];
  entertainmentRituals: string[];
  budgetRatio: Record<string, number>;
  timeline: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  vendorCategories: Array<{
    category: string;
    questions: string[];
    budgetKey: string;
  }>;
};

type PlannerTask = {
  title: string;
  phase: TaskPhase;
  priority: TaskPriority;
  offsetDaysBefore: number;
};

function getCateringRecommendations(
  dietary: DietaryRequirement,
  type: EventType
) {
  const menus: Record<
    DietaryRequirement,
    {
      specialties: string[];
      note: string;
    }
  > = {
    pure_veg: {
      specialties: [
        'Shahi Paneer, Dal Makhani and seasonal vegetable curries',
        'Vegetable dum biryani with fresh raita',
        'Assorted Indian breads and regional vegetarian specialties',
      ],
      note: 'Plan a completely vegetarian kitchen and separate serving utensils.',
    },
    jain_options: {
      specialties: [
        'Jain-style paneer curry prepared without root vegetables',
        'Jain-friendly rice preparations and seasonal vegetables',
        'Dedicated Jain breads, snacks and accompaniments',
      ],
      note:
        'Confirm Jain preparation requirements with the host, including restrictions on onion, garlic and root vegetables.',
    },
    multi_cuisine: {
      specialties: [
        'Indian, Continental and regional main-course selections',
        'Vegetarian specialties with separately labelled optional non-vegetarian dishes',
        'Rice, breads, salads and complementary accompaniments',
      ],
      note:
        'Keep vegetarian and non-vegetarian preparation and serving areas separate.',
    },
    regional_specialty: {
      specialties: [
        'Traditional regional thali and seasonal specialties',
        'Locally inspired rice, bread and curry selections',
        'Regional snacks, chutneys and traditional accompaniments',
      ],
      note: 'Confirm the preferred regional cuisine and any family-specific food traditions.',
    },
    custom: {
      specialties: [
        'Customized main-course menu based on host requirements',
        'Fresh seasonal rice and bread selections',
        'Personalized regional and celebratory specialties',
      ],
      note:
        'Confirm every dietary restriction and ingredient preference with the host before finalizing the menu.',
    },
  };

  const selected = menus[dietary];

  const welcomeDrinks = [
    'Fresh seasonal fruit and mint cooler',
    'Kesar Badam Sharbat',
    'Fresh Lime and Herbal Refreshment',
  ];

  const liveCounters = [
    'Live Chaat and Regional Street Food Counter',
    'Fresh Indian Bread and Main-Course Station',
    'Live Dessert and Refreshment Counter',
  ];

  const desserts = [
    'Gulab Jamun or regional traditional mithai',
    'Seasonal fruit and assorted dessert selection',
    'Live Kulfi, Ice Cream or Traditional Sweet Counter',
  ];

  if (type === 'pooja_ceremony') {
    return {
      welcomeDrinks: [
        'Tender Coconut Water',
        'Kesar Elaichi Lassi',
        'Tulsi and Ginger Herbal Refreshment',
      ],
      liveCounters: [
        'Fresh South Indian Tiffin Counter',
        'Sabudana Vada and Seasonal Satvik Snacks',
        'Traditional Prasadam Distribution Station',
      ],
      specialties: [
        'Satvik prasadam prepared according to host requirements',
        'Traditional khichdi, seasonal vegetables and Indian breads',
        ...selected.specialties.slice(0, 1),
      ],
      desserts: [
        'Desi Ghee Boondi Ladoo',
        'Payasam or Saffron Sheera',
        'Fresh Seasonal Traditional Mithai',
      ],
      dietaryNote: selected.note,
    };
  }

  return {
    welcomeDrinks,
    liveCounters,
    specialties: selected.specialties,
    desserts,
    dietaryNote: selected.note,
  };
}

function createPlannerConfig(
  details: EventDetails
): PlannerConfig {
  const {
    type,
    city,
    guestCount,
    theme,
    dietary,
  } = details;

  const food = getCateringRecommendations(dietary, type);

  const commonQuestions = [
    'What is included in the quoted package and what costs extra?',
    'Can you provide a written agreement with payment milestones?',
    'What is the cancellation and backup arrangement?',
  ];

  switch (type) {
    case 'birthday':
      return {
        primaryTheme: theme || 'Carnival Lights & Pastel Celebration',
        colorPalette: [
          '#F43F5E',
          '#8B5CF6',
          '#FBBF24',
          '#38BDF8',
          '#FFFFFF',
        ],
        aestheticVibe: `A vibrant birthday celebration in ${city} for ${guestCount} guests, featuring playful decor, personalized installations, warm lighting and interactive entertainment.`,
        decorConcepts: [
          'Grand entrance with personalized birthday signage and balloon arch',
          'Main stage with themed backdrop, marquee lettering and cake display',
          'Customized dessert table and colorful guest seating',
          'Interactive photo booth with birthday props and memory wall',
        ],
        ...food,
        entertainmentRituals: [
          'Guest welcome, music and interactive games',
          'Birthday host activities, family performances and entertainment',
          'Special birthday cake cutting and family celebration',
          'Dinner, dancing, photographs and return gifts',
        ],
        budgetRatio: {
          venue: 22,
          catering: 35,
          decoration: 18,
          photography: 8,
          entertainment: 10,
          transport: 2,
          contingency: 5,
        },
        timeline: [
          {
            time: '10:00 AM',
            title: 'Venue and Decoration Setup',
            description:
              'Install themed decorations, seating, lighting and birthday signage.',
          },
          {
            time: '02:00 PM',
            title: 'Cake and Celebration Preparation',
            description:
              'Arrange the birthday cake, dessert table, gifts and activity stations.',
          },
          {
            time: '04:00 PM',
            title: 'Guest Welcome',
            description:
              'Welcome guests with refreshments, music and photo opportunities.',
          },
          {
            time: '05:00 PM',
            title: 'Games and Entertainment',
            description:
              'Host interactive games, performances and activities for guests.',
          },
          {
            time: '06:30 PM',
            title: 'Cake Cutting',
            description:
              'Celebrate the birthday with cake cutting, photographs and family wishes.',
          },
          {
            time: '07:30 PM',
            title: 'Dinner and Celebration',
            description:
              'Open food counters and continue music and entertainment.',
          },
          {
            time: '09:30 PM',
            title: 'Farewell and Return Gifts',
            description:
              'Distribute return gifts and coordinate guest departures.',
          },
        ],
        vendorCategories: [
          {
            category: 'Birthday Venue',
            budgetKey: 'venue',
            questions: [
              ...commonQuestions,
              'Are children-friendly spaces and activity areas available?',
            ],
          },
          {
            category: 'Catering',
            budgetKey: 'catering',
            questions: [
              ...commonQuestions,
              'Can you provide a customized birthday menu?',
            ],
          },
          {
            category: 'Theme Decor and Balloon Artist',
            budgetKey: 'decoration',
            questions: [
              ...commonQuestions,
              'Can you create the requested theme and personalized backdrop?',
            ],
          },
          {
            category: 'Photographer and Videographer',
            budgetKey: 'photography',
            questions: [
              ...commonQuestions,
              'Is birthday cake-cutting and candid coverage included?',
            ],
          },
          {
            category: 'DJ and Entertainment',
            budgetKey: 'entertainment',
            questions: [
              ...commonQuestions,
              'Can you arrange age-appropriate games and activities?',
            ],
          },
        ],
      };

    case 'community':
      return {
        primaryTheme: theme || 'Utsav Milan: Community and Cultural Harmony',
        colorPalette: [
          '#DC2626',
          '#EA580C',
          '#EAB308',
          '#047857',
          '#FFFFFF',
        ],
        aestheticVibe: `A welcoming community celebration in ${city} for ${guestCount} attendees, combining cultural traditions, inclusive activities, regional food and comfortable communal spaces.`,
        decorConcepts: [
          'Traditional entrance arch with marigold garlands and welcome signage',
          'Cultural stage with rangoli-inspired backdrop and sound system',
          `Covered dining pandal with organized seating and buffet arrangements for ${guestCount} guests`,
          'Community photo corner featuring cultural props and local artwork',
        ],
        ...food,
        entertainmentRituals: [
          'Traditional welcome and ceremonial lamp lighting',
          'Community performances, cultural programs and local talent showcases',
          'Recognition ceremony for volunteers and community contributors',
          'Group activities, dinner and community networking',
        ],
        budgetRatio: {
          venue: 25,
          catering: 38,
          decoration: 14,
          photography: 6,
          entertainment: 9,
          transport: 3,
          contingency: 5,
        },
        timeline: [
          {
            time: '08:00 AM',
            title: 'Community Venue Preparation',
            description:
              'Arrange the stage, seating, sound equipment and dining areas.',
          },
          {
            time: '10:00 AM',
            title: 'Volunteer Briefing',
            description:
              'Coordinate registration desks, guest assistance and activity teams.',
          },
          {
            time: '11:00 AM',
            title: 'Guest Registration and Welcome',
            description:
              'Welcome attendees and guide them to the event areas.',
          },
          {
            time: '12:00 PM',
            title: 'Opening Ceremony',
            description:
              'Begin with traditional welcome activities and opening remarks.',
          },
          {
            time: '02:00 PM',
            title: 'Cultural Performances',
            description:
              'Host community performances, competitions and group activities.',
          },
          {
            time: '05:00 PM',
            title: 'Recognition and Networking',
            description:
              'Recognize contributors and encourage community interaction.',
          },
          {
            time: '07:00 PM',
            title: 'Dinner and Closing',
            description:
              'Serve dinner, distribute acknowledgements and coordinate departures.',
          },
        ],
        vendorCategories: [
          {
            category: 'Community Venue and Pandal',
            budgetKey: 'venue',
            questions: [
              ...commonQuestions,
              'Can the venue comfortably accommodate the expected attendance?',
            ],
          },
          {
            category: 'Catering and Food Stalls',
            budgetKey: 'catering',
            questions: [
              ...commonQuestions,
              'Can food counters handle peak guest traffic?',
            ],
          },
          {
            category: 'Stage and Event Decoration',
            budgetKey: 'decoration',
            questions: [
              ...commonQuestions,
              'Is stage setup and seating decoration included?',
            ],
          },
          {
            category: 'Event Photography',
            budgetKey: 'photography',
            questions: [
              ...commonQuestions,
              'Will cultural performances and group photographs be covered?',
            ],
          },
          {
            category: 'Sound and Cultural Entertainment',
            budgetKey: 'entertainment',
            questions: [
              ...commonQuestions,
              'Are microphones and backup audio equipment available?',
            ],
          },
        ],
      };

    case 'anniversary':
      return {
        primaryTheme: theme || 'Golden Milestones & Timeless Romance',
        colorPalette: [
          '#B45309',
          '#1E1B4B',
          '#FDE68A',
          '#F43F5E',
          '#FAF5FF',
        ],
        aestheticVibe: `An intimate anniversary celebration in ${city} for ${guestCount} guests, featuring warm candlelight, meaningful family memories, elegant dining and personalized moments.`,
        decorConcepts: [
          'Memory lane entrance with photographs and milestone highlights',
          'Elegant anniversary stage with floral arch and personalized signage',
          'Romantic dining tables with candles and fresh floral arrangements',
          'Photo installation featuring the couple’s journey together',
        ],
        ...food,
        entertainmentRituals: [
          'Couple welcome and special anniversary entry',
          'Family speeches, photographs and memorable video presentation',
          'Anniversary cake cutting and family blessings',
          'Dinner, music and a special couple dance',
        ],
        budgetRatio: {
          venue: 26,
          catering: 34,
          decoration: 16,
          photography: 10,
          entertainment: 7,
          transport: 2,
          contingency: 5,
        },
        timeline: [
          {
            time: '10:00 AM',
            title: 'Venue and Decor Setup',
            description:
              'Prepare floral arrangements, memory displays and dining tables.',
          },
          {
            time: '02:00 PM',
            title: 'Family Preparation',
            description:
              'Coordinate outfits, gifts and the anniversary presentation.',
          },
          {
            time: '04:00 PM',
            title: 'Guest Welcome',
            description:
              'Welcome family and friends with refreshments and photographs.',
          },
          {
            time: '05:00 PM',
            title: 'Couple Celebration',
            description:
              'Host the special entry, anniversary wishes and family messages.',
          },
          {
            time: '06:00 PM',
            title: 'Memory Presentation',
            description:
              'Screen photographs, videos and messages from loved ones.',
          },
          {
            time: '07:00 PM',
            title: 'Cake Cutting and Dinner',
            description:
              'Celebrate the milestone with cake cutting and dinner.',
          },
          {
            time: '09:00 PM',
            title: 'Music and Farewell',
            description:
              'Enjoy music, family photographs and guest departures.',
          },
        ],
        vendorCategories: [
          {
            category: 'Celebration Venue',
            budgetKey: 'venue',
            questions: [
              ...commonQuestions,
              'Can the venue arrange intimate seating and private dining?',
            ],
          },
          {
            category: 'Catering',
            budgetKey: 'catering',
            questions: [
              ...commonQuestions,
              'Can you arrange a personalized anniversary menu?',
            ],
          },
          {
            category: 'Floral Decor and Styling',
            budgetKey: 'decoration',
            questions: [
              ...commonQuestions,
              'Can you create a customized memory display?',
            ],
          },
          {
            category: 'Photography and Videography',
            budgetKey: 'photography',
            questions: [
              ...commonQuestions,
              'Can you capture family messages and the milestone presentation?',
            ],
          },
          {
            category: 'Music and Entertainment',
            budgetKey: 'entertainment',
            questions: [
              ...commonQuestions,
              'Can you arrange the couple’s preferred music?',
            ],
          },
        ],
      };

    case 'pooja_ceremony':
      return {
        primaryTheme: theme || 'Vedic Sanctity and Traditional Serenity',
        colorPalette: [
          '#B91C1C',
          '#D97706',
          '#FEF08A',
          '#065F46',
          '#FFFFFF',
        ],
        aestheticVibe: `A serene and auspicious ceremony in ${city} for ${guestCount} attendees, featuring traditional floral decor, sacred arrangements, comfortable seating and thoughtful hospitality.`,
        decorConcepts: [
          'Traditional entrance with mango leaf torans and marigold garlands',
          'Sacred altar and ritual area with appropriate ceremonial arrangements',
          'Comfortable seating with traditional floor arrangements where suitable',
          'Prasadam and guest welcome area with organized distribution',
        ],
        ...food,
        entertainmentRituals: [
          'Guest welcome and preparation of ceremonial arrangements',
          'Opening prayers and primary pooja rituals with the appointed priest',
          'Bhajan, kirtan and family participation',
          'Aarti, prasadam distribution and blessings',
        ],
        budgetRatio: {
          venue: 18,
          catering: 38,
          decoration: 16,
          photography: 6,
          entertainment: 8,
          transport: 4,
          contingency: 10,
        },
        timeline: [
          {
            time: '06:00 AM',
            title: 'Ceremony Preparation',
            description:
              'Arrange the altar, ritual materials, flowers and seating.',
          },
          {
            time: '08:00 AM',
            title: 'Guest Welcome',
            description:
              'Welcome attendees and guide them to the ceremony area.',
          },
          {
            time: '09:00 AM',
            title: 'Opening Prayers',
            description:
              'Begin the ceremony according to the family’s chosen traditions.',
          },
          {
            time: '10:00 AM',
            title: 'Main Pooja Rituals',
            description:
              'Coordinate the primary rituals with the appointed priest.',
          },
          {
            time: '12:00 PM',
            title: 'Bhajan and Family Participation',
            description:
              'Host devotional music and family participation as appropriate.',
          },
          {
            time: '01:00 PM',
            title: 'Aarti and Prasadam',
            description:
              'Complete the ceremony and organize prasadam distribution.',
          },
          {
            time: '02:00 PM',
            title: 'Traditional Meal and Farewell',
            description:
              'Serve the planned meal and coordinate guest departures.',
          },
        ],
        vendorCategories: [
          {
            category: 'Ceremony Venue',
            budgetKey: 'venue',
            questions: [
              ...commonQuestions,
              'Is the ritual area suitable for the planned ceremony?',
            ],
          },
          {
            category: 'Satvik Catering',
            budgetKey: 'catering',
            questions: [
              ...commonQuestions,
              'Can you follow the host’s specific food and preparation restrictions?',
            ],
          },
          {
            category: 'Traditional Decor and Flowers',
            budgetKey: 'decoration',
            questions: [
              ...commonQuestions,
              'Can the decor be customized to the family’s traditions?',
            ],
          },
          {
            category: 'Event Photography',
            budgetKey: 'photography',
            questions: [
              ...commonQuestions,
              'Can important rituals be photographed respectfully?',
            ],
          },
          {
            category: 'Priest and Devotional Music',
            budgetKey: 'entertainment',
            questions: [
              ...commonQuestions,
              'Can the ceremony sequence be confirmed with the family beforehand?',
            ],
          },
        ],
      };

    case 'corporate_gala':
      return {
        primaryTheme: theme || 'Modern Corporate Excellence and Networking',
        colorPalette: [
          '#172554',
          '#0F766E',
          '#D4AF37',
          '#F8FAFC',
          '#334155',
        ],
        aestheticVibe: `A polished corporate gala in ${city} for ${guestCount} attendees, combining professional staging, premium hospitality, networking opportunities and memorable brand experiences.`,
        decorConcepts: [
          'Branded entrance with digital welcome display and registration counters',
          'Professional stage with LED backdrop, podium and presentation screens',
          'Networking lounge with comfortable seating and charging facilities',
          'Elegant dining setup with subtle corporate branding',
        ],
        ...food,
        entertainmentRituals: [
          'Guest registration, welcome refreshments and networking',
          'Opening address, leadership speeches and keynote presentations',
          'Awards, employee recognition and special announcements',
          'Networking dinner, entertainment and closing acknowledgements',
        ],
        budgetRatio: {
          venue: 25,
          catering: 25,
          decoration: 12,
          photography: 8,
          entertainment: 10,
          transport: 8,
          contingency: 12,
        },
        timeline: [
          {
            time: '08:00 AM',
            title: 'Technical and Stage Setup',
            description:
              'Set up the stage, LED screens, presentation equipment and audio system.',
          },
          {
            time: '10:00 AM',
            title: 'Registration Desk Preparation',
            description:
              'Prepare guest lists, badges, registration desks and welcome displays.',
          },
          {
            time: '11:00 AM',
            title: 'Guest Arrival and Networking',
            description:
              'Welcome attendees and open the networking and refreshments area.',
          },
          {
            time: '12:00 PM',
            title: 'Opening and Keynote Sessions',
            description:
              'Host leadership addresses, keynote presentations and company updates.',
          },
          {
            time: '03:00 PM',
            title: 'Awards and Recognition',
            description:
              'Conduct employee recognition, awards and special announcements.',
          },
          {
            time: '06:00 PM',
            title: 'Networking and Entertainment',
            description:
              'Arrange professional networking, performances and guest interaction.',
          },
          {
            time: '08:00 PM',
            title: 'Gala Dinner and Closing',
            description:
              'Serve dinner, conclude the program and coordinate guest transportation.',
          },
        ],
        vendorCategories: [
          {
            category: 'Conference and Gala Venue',
            budgetKey: 'venue',
            questions: [
              ...commonQuestions,
              'Are conference facilities, power backup and parking included?',
            ],
          },
          {
            category: 'Corporate Catering',
            budgetKey: 'catering',
            questions: [
              ...commonQuestions,
              'Can food service accommodate a fixed event schedule?',
            ],
          },
          {
            category: 'Stage, Branding and AV Production',
            budgetKey: 'decoration',
            questions: [
              ...commonQuestions,
              'Are LED screens, microphones and presentation equipment included?',
            ],
          },
          {
            category: 'Corporate Photography and Video',
            budgetKey: 'photography',
            questions: [
              ...commonQuestions,
              'Will keynote sessions and award presentations be covered?',
            ],
          },
          {
            category: 'Entertainment and Event Host',
            budgetKey: 'entertainment',
            questions: [
              ...commonQuestions,
              'Can the host follow a professional corporate event script?',
            ],
          },
          {
            category: 'Guest Transportation',
            budgetKey: 'transport',
            questions: [
              ...commonQuestions,
              'Can guest pickups and drop-offs be coordinated by schedule?',
            ],
          },
        ],
      };

    case 'wedding':
    default:
      return {
        primaryTheme: theme || 'Royal Heritage and Contemporary Elegance',
        colorPalette: [
          '#991B1B',
          '#D97706',
          '#FDE68A',
          '#1E1B4B',
          '#FFFFFF',
        ],
        aestheticVibe: `A regal wedding celebration in ${city} for ${guestCount} guests, combining cultural traditions, floral elegance, thoughtful hospitality and contemporary comfort.`,
        decorConcepts: [
          'Grand entrance with marigold flowers and traditional welcome decor',
          'Floral mandap with brass lamps and an elegant ceremonial backdrop',
          'Dining pavilions with traditional table settings and comfortable seating',
          'Wedding stage with floral installations and personalized photo area',
        ],
        ...food,
        entertainmentRituals: [
          'Baraat procession with traditional music and family participation',
          'Varmala ceremony with coordinated stage arrangements',
          'Wedding rituals and pheras according to family traditions',
          'Sangeet performances, celebration and wedding dinner',
        ],
        budgetRatio: {
          venue: 28,
          catering: 32,
          decoration: 15,
          photography: 9,
          entertainment: 6,
          transport: 4,
          contingency: 6,
        },
        timeline: [
          {
            time: '09:00 AM',
            title: 'Venue and Mandap Preparation',
            description:
              'Coordinate floral decor, mandap setup, lighting and ceremonial arrangements.',
          },
          {
            time: '01:00 PM',
            title: 'Family and Wedding Preparations',
            description:
              'Coordinate outfits, makeup, family members and ceremony requirements.',
          },
          {
            time: '04:00 PM',
            title: 'Guest Welcome',
            description:
              'Welcome guests with refreshments, music and photography.',
          },
          {
            time: '06:00 PM',
            title: 'Baraat and Varmala',
            description:
              'Coordinate the wedding procession and garland exchange.',
          },
          {
            time: '07:00 PM',
            title: 'Wedding Ceremony',
            description:
              'Conduct the main wedding rituals with the appointed priest.',
          },
          {
            time: '08:30 PM',
            title: 'Dinner and Celebration',
            description:
              'Open dining counters and coordinate family photographs.',
          },
          {
            time: '10:30 PM',
            title: 'Farewell and Guest Departures',
            description:
              'Coordinate guest transportation, family handover and final arrangements.',
          },
        ],
        vendorCategories: [
          {
            category: 'Wedding Venue',
            budgetKey: 'venue',
            questions: [
              ...commonQuestions,
              'Are guest rooms, parking and backup electricity included?',
            ],
          },
          {
            category: 'Wedding Catering',
            budgetKey: 'catering',
            questions: [
              ...commonQuestions,
              'Can separate dietary arrangements be provided?',
            ],
          },
          {
            category: 'Wedding Decor and Florist',
            budgetKey: 'decoration',
            questions: [
              ...commonQuestions,
              'Can the mandap and stage be customized to the selected theme?',
            ],
          },
          {
            category: 'Wedding Photography and Cinematography',
            budgetKey: 'photography',
            questions: [
              ...commonQuestions,
              'Are candid, traditional and ceremony coverage included?',
            ],
          },
          {
            category: 'Music and Entertainment',
            budgetKey: 'entertainment',
            questions: [
              ...commonQuestions,
              'Can the team coordinate baraat and family performances?',
            ],
          },
        ],
      };
  }
}

function createSuggestedTasks(
  details: EventDetails
): PlannerTask[] {
  const { type, city, guestCount, dietary } = details;

  const tasksByType: Record<EventType, PlannerTask[]> = {
    wedding: [
      {
        title: `Shortlist wedding venues in ${city}`,
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 90,
      },
      {
        title: 'Finalize wedding date, ceremony sequence and priest',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 75,
      },
      {
        title: `Confirm catering for ${guestCount} guests with ${dietary} requirements`,
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 60,
      },
      {
        title: 'Send wedding invitations and collect RSVPs',
        phase: 'early_planning',
        priority: 'medium',
        offsetDaysBefore: 45,
      },
      {
        title: 'Finalize mandap, stage and floral decoration',
        phase: 'month_before',
        priority: 'high',
        offsetDaysBefore: 30,
      },
      {
        title: 'Confirm photographer, videographer and entertainment',
        phase: 'month_before',
        priority: 'medium',
        offsetDaysBefore: 20,
      },
      {
        title: 'Confirm guest accommodation and transportation',
        phase: 'week_before',
        priority: 'high',
        offsetDaysBefore: 7,
      },
      {
        title: 'Reconfirm vendors and wedding ceremony arrangements',
        phase: 'week_before',
        priority: 'high',
        offsetDaysBefore: 3,
      },
      {
        title: 'Complete venue, mandap and vendor walkthrough',
        phase: 'event_day',
        priority: 'high',
        offsetDaysBefore: 0,
      },
      {
        title: 'Settle final invoices and organize photographs',
        phase: 'post_event',
        priority: 'medium',
        offsetDaysBefore: -2,
      },
    ],

    birthday: [
      {
        title: 'Book a suitable birthday venue',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 30,
      },
      {
        title: 'Finalize birthday theme, cake design and guest list',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 25,
      },
      {
        title: 'Confirm catering and dietary requirements',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 20,
      },
      {
        title: 'Send invitations and confirm attendance',
        phase: 'early_planning',
        priority: 'medium',
        offsetDaysBefore: 15,
      },
      {
        title: 'Arrange balloon decor, stage and photo booth',
        phase: 'month_before',
        priority: 'medium',
        offsetDaysBefore: 10,
      },
      {
        title: 'Confirm cake, games and entertainment',
        phase: 'month_before',
        priority: 'high',
        offsetDaysBefore: 7,
      },
      {
        title: 'Reconfirm guest count and food arrangements',
        phase: 'week_before',
        priority: 'high',
        offsetDaysBefore: 3,
      },
      {
        title: 'Prepare birthday gifts and activity materials',
        phase: 'week_before',
        priority: 'medium',
        offsetDaysBefore: 2,
      },
      {
        title: 'Check cake delivery, decor and music setup',
        phase: 'event_day',
        priority: 'high',
        offsetDaysBefore: 0,
      },
      {
        title: 'Collect photographs and settle vendor payments',
        phase: 'post_event',
        priority: 'medium',
        offsetDaysBefore: -1,
      },
    ],

    community: [
      {
        title: 'Confirm community venue and required permissions',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 60,
      },
      {
        title: 'Assign volunteer teams and responsibilities',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 45,
      },
      {
        title: 'Confirm catering capacity for expected attendance',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 30,
      },
      {
        title: 'Publish invitations and community announcements',
        phase: 'early_planning',
        priority: 'medium',
        offsetDaysBefore: 25,
      },
      {
        title: 'Finalize stage, sound and cultural program',
        phase: 'month_before',
        priority: 'high',
        offsetDaysBefore: 15,
      },
      {
        title: 'Confirm performers, volunteers and food stalls',
        phase: 'month_before',
        priority: 'medium',
        offsetDaysBefore: 10,
      },
      {
        title: 'Prepare registration and guest management lists',
        phase: 'week_before',
        priority: 'high',
        offsetDaysBefore: 5,
      },
      {
        title: 'Reconfirm equipment, seating and vendor arrangements',
        phase: 'week_before',
        priority: 'high',
        offsetDaysBefore: 2,
      },
      {
        title: 'Brief volunteers and check event infrastructure',
        phase: 'event_day',
        priority: 'high',
        offsetDaysBefore: 0,
      },
      {
        title: 'Review expenses and collect community feedback',
        phase: 'post_event',
        priority: 'medium',
        offsetDaysBefore: -1,
      },
    ],

    anniversary: [
      {
        title: 'Choose an anniversary venue and celebration style',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 45,
      },
      {
        title: 'Prepare guest list and anniversary invitations',
        phase: 'early_planning',
        priority: 'medium',
        offsetDaysBefore: 30,
      },
      {
        title: 'Confirm catering and dietary preferences',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 25,
      },
      {
        title: 'Collect family photographs and milestone memories',
        phase: 'early_planning',
        priority: 'medium',
        offsetDaysBefore: 20,
      },
      {
        title: 'Finalize floral decor and memory display',
        phase: 'month_before',
        priority: 'medium',
        offsetDaysBefore: 15,
      },
      {
        title: 'Arrange cake, music and special presentation',
        phase: 'month_before',
        priority: 'high',
        offsetDaysBefore: 10,
      },
      {
        title: 'Confirm guest attendance and seating',
        phase: 'week_before',
        priority: 'high',
        offsetDaysBefore: 5,
      },
      {
        title: 'Reconfirm vendors and presentation materials',
        phase: 'week_before',
        priority: 'medium',
        offsetDaysBefore: 2,
      },
      {
        title: 'Check decor, cake and anniversary presentation',
        phase: 'event_day',
        priority: 'high',
        offsetDaysBefore: 0,
      },
      {
        title: 'Share photographs and settle remaining invoices',
        phase: 'post_event',
        priority: 'medium',
        offsetDaysBefore: -1,
      },
    ],

    pooja_ceremony: [
      {
        title: 'Confirm ceremony date, venue and appointed priest',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 30,
      },
      {
        title: 'Confirm ritual sequence and required samagri',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 20,
      },
      {
        title: 'Finalize satvik catering and dietary requirements',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 15,
      },
      {
        title: 'Inform guests and family members',
        phase: 'early_planning',
        priority: 'medium',
        offsetDaysBefore: 12,
      },
      {
        title: 'Arrange flowers, altar and ceremonial seating',
        phase: 'month_before',
        priority: 'high',
        offsetDaysBefore: 7,
      },
      {
        title: 'Purchase and organize pooja materials',
        phase: 'month_before',
        priority: 'high',
        offsetDaysBefore: 5,
      },
      {
        title: 'Confirm priest, catering and guest attendance',
        phase: 'week_before',
        priority: 'high',
        offsetDaysBefore: 3,
      },
      {
        title: 'Prepare prasadam distribution and seating',
        phase: 'week_before',
        priority: 'medium',
        offsetDaysBefore: 1,
      },
      {
        title: 'Check altar, samagri and ceremony arrangements',
        phase: 'event_day',
        priority: 'high',
        offsetDaysBefore: 0,
      },
      {
        title: 'Complete vendor settlements and organize remaining materials',
        phase: 'post_event',
        priority: 'medium',
        offsetDaysBefore: -1,
      },
    ],

    corporate_gala: [
      {
        title: 'Shortlist corporate event venue and confirm date',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 60,
      },
      {
        title: 'Finalize event objectives, agenda and expected attendees',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 45,
      },
      {
        title: 'Confirm catering and hospitality arrangements',
        phase: 'early_planning',
        priority: 'high',
        offsetDaysBefore: 30,
      },
      {
        title: 'Send invitations and open attendee registration',
        phase: 'early_planning',
        priority: 'medium',
        offsetDaysBefore: 25,
      },
      {
        title: 'Finalize stage, branding, lighting and AV requirements',
        phase: 'month_before',
        priority: 'high',
        offsetDaysBefore: 20,
      },
      {
        title: 'Confirm speakers, awards and event host',
        phase: 'month_before',
        priority: 'high',
        offsetDaysBefore: 15,
      },
      {
        title: 'Prepare guest badges and registration lists',
        phase: 'week_before',
        priority: 'medium',
        offsetDaysBefore: 7,
      },
      {
        title: 'Test presentations, microphones and display equipment',
        phase: 'week_before',
        priority: 'high',
        offsetDaysBefore: 2,
      },
      {
        title: 'Brief event staff and complete technical checks',
        phase: 'event_day',
        priority: 'high',
        offsetDaysBefore: 0,
      },
      {
        title: 'Review attendance, feedback and event expenses',
        phase: 'post_event',
        priority: 'medium',
        offsetDaysBefore: -2,
      },
    ],
  };

  return tasksByType[type] ?? tasksByType.wedding;
}

export function generateDeterministicPlan(
  details: EventDetails
): AIEventPlan {
  const {
    name,
    type,
    city,
    guestCount,
    budget,
    dietary,
    theme,
    preferences,
  } = details;

  const config = createPlannerConfig(details);

  const suggestedTasks = createSuggestedTasks(details);

  const vendorRecommendations = config.vendorCategories.map((vendor) => ({
    category: vendor.category,
    keyQuestions: vendor.questions,
    estimatedSharePercent:
      config.budgetRatio[vendor.budgetKey] ?? 0,
  }));

  const safeCity = city?.trim() || 'your city';
  const safeName = name?.trim() || 'Your Celebration';
  const safePreferences = preferences?.trim();

  const personalizedSummary = safePreferences
    ? ` Your special requests have also been considered: ${safePreferences}.`
    : '';

  const budgetDescription =
    Number.isFinite(budget) && budget >= 0
      ? ` with a planned budget of ₹${budget.toLocaleString('en-IN')}`
      : '';

  return {
    summary:
      `${config.primaryTheme} brings together a thoughtfully planned ${type.replaceAll('_', ' ')} for "${safeName}", welcoming ${guestCount} guests in ${safeCity}${budgetDescription}. ` +
      `The plan includes event-specific decor, catering, activities, a practical timeline and vendor coordination. ` +
      `Dietary planning: ${getCateringRecommendations(dietary, type).dietaryNote}` +
      personalizedSummary,

    themeVision: {
      primaryTheme: config.primaryTheme,
      colorPalette: config.colorPalette,
      aestheticVibe: safePreferences
        ? `${config.aestheticVibe} Host preferences: ${safePreferences}`
        : config.aestheticVibe,
      decorConcepts: config.decorConcepts,
    },

    cateringHighlights: {
      welcomeDrinks: config.welcomeDrinks,
      liveCounters: config.liveCounters,
      specialties: config.specialties,
      desserts: config.desserts,
    },

    entertainmentRituals: config.entertainmentRituals,

    recommendedBudgetRatio: config.budgetRatio,

    suggestedTasks,

    dayOfTimeline: config.timeline,

    vendorRecommendations,

    isAiGenerated: false,
    modelUsed: 'Utsav AI Deterministic Event Planner',
    generatedAt: new Date().toISOString(),
  };
}
