import { POIItem } from '../types/map';

export const GARDENS_POIS: POIItem[] = [
  // 1-8 MAJOR ICONS & CONSERVATORIES
  {
    id: 'flower-dome',
    numberKey: '3',
    name: 'Flower Dome',
    category: 'conservatory',
    categoryLabel: 'Conservatory',
    subtitle: 'World\'s Largest Glass Greenhouse (Guinness World Records)',
    description: 'Enter a spectacular indoor paradise holding plants and flowers from five continents, across Mediterranean and semi-arid subtropical regions. Features 9 unique gardens including the Baobabs, Succulent Garden, Australian Garden, and rotating floral displays in the central Flower Field.',
    highlights: [
      'Guinness World Record for largest glass greenhouse (1.2 hectares)',
      'Perpetual cool spring climate maintained at 23°C – 25°C',
      'Spectacular changing seasonal floral festivals (Tulipmania, Orchid Haven, Dahlia Dreams)',
      '1,000-year-old olive trees and exotic bottle trees'
    ],
    admission: 'Ticketed Attraction',
    hours: '9:00 AM – 9:00 PM Daily (Last entry 8:30 PM)',
    climate: 'Air-Conditioned (23-25°C)',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.54, y: 0.22 },
    bannerGradient: 'from-pink-600 via-rose-500 to-amber-400',
    tags: ['iconic', 'conservatory', 'indoor', 'flowers', 'unesco']
  },
  {
    id: 'cloud-forest',
    numberKey: '4',
    name: 'Cloud Forest',
    category: 'conservatory',
    categoryLabel: 'Conservatory',
    subtitle: 'Majestic 35-Metre Indoor Waterfall & Cloud Walk',
    description: 'A mist-veiled world showcasing rare vegetation and dramatic highland vistas. Dominated by a 35-metre tall mountain covered in lush orchids, pitcher plants, and ferns, featuring one of the world\'s tallest indoor man-made waterfalls tumbling into a crystal pool below.',
    highlights: [
      'Iconic 35-metre indoor mountain with cascading waterfall',
      'The breathtaking Cloud Walk aerial gangway suspended in mid-air',
      'Highland biodiversity with carnivorous pitcher plants and rare orchids',
      'Secret Garden & Lost World ecological exhibits at the mountain summit'
    ],
    admission: 'Ticketed Attraction',
    hours: '9:00 AM – 9:00 PM Daily (Last entry 8:30 PM)',
    climate: 'Air-Conditioned (23-25°C)',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.66, y: 0.27 },
    bannerGradient: 'from-cyan-600 via-teal-500 to-emerald-400',
    tags: ['waterfall', 'mist', 'iconic', 'conservatory', 'highlands']
  },
  {
    id: 'supertree-grove',
    numberKey: '6',
    name: 'Supertree Grove',
    category: 'supertree',
    categoryLabel: 'Supertrees',
    subtitle: 'Vertical Gardens of Architectural Wonder & Garden Rhapsody',
    description: 'The world-famous heart of Gardens by the Bay! These twelve towering vertical gardens measure between 25 and 50 metres tall. Over 162,900 plants comprising more than 200 species of bromeliads, orchids, ferns, and tropical climbers cover their concrete cores and steel branches.',
    highlights: [
      'Spectacular Garden Rhapsody Light & Sound Show every evening at 7:45 PM & 8:45 PM',
      'Photovoltaic cells harvesting solar energy for the conservatories',
      'Air exhaust and rainwater harvesting ecological integration',
      '12 massive Supertrees clustered around interactive plaza'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.45, y: 0.38 },
    bannerGradient: 'from-purple-600 via-fuchsia-500 to-indigo-600',
    tags: ['supertrees', 'lightshow', 'free', 'iconic', 'night']
  },
  {
    id: 'ocbc-skyway',
    numberKey: '7',
    name: 'OCBC Skyway',
    category: 'supertree',
    categoryLabel: 'Supertrees',
    subtitle: '128-Metre Aerial Walkway Suspended 22 Metres Above Ground',
    description: 'Stroll along the curved aerial walkway suspended between two majestic Supertrees. Provides panoramic 360-degree vistas of the gardens, Marina Bay Sands skyline, and Singapore Strait, feeling like walking among giant treetops in the sky.',
    highlights: [
      'Panoramic vistas of Marina Bay skyline and Singapore Strait',
      'Suspended 22 metres in mid-air along a 128-metre walkway',
      'Up-close views of the vertical plant tapestry on Supertree trunks',
      'Unforgettable vantage point during sunset and evening light shows'
    ],
    admission: 'Ticketed Attraction',
    hours: '9:00 AM – 9:00 PM Daily (Last entry 8:30 PM)',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.43, y: 0.40 },
    bannerGradient: 'from-amber-500 via-orange-500 to-rose-500',
    tags: ['walkway', 'skyline', 'views', 'aerial']
  },
  {
    id: 'supertree-observatory',
    numberKey: '8',
    name: 'Supertree Observatory',
    category: 'supertree',
    categoryLabel: 'Supertrees',
    subtitle: 'Highest Vantage Point at the Canopy of the Tallest Supertree',
    description: 'Located at the highest point of the tallest 50-metre Supertree in the central grove. Features an indoor immersive visual gallery, digital media experiences, open-air rooftop observation deck, and a café with refreshing beverages and snacks.',
    highlights: [
      'Highest observation deck in Gardens by the Bay (50 metres high)',
      'Open-air rooftop viewing deck with unobstructed 360° panoramas',
      'Immersive digital climate and nature installation',
      'Supertree Observatory Café with artisanal refreshments'
    ],
    admission: 'Ticketed Attraction',
    hours: '9:00 AM – 9:00 PM Daily (Last entry 8:30 PM)',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.45, y: 0.34 },
    bannerGradient: 'from-violet-600 via-purple-500 to-pink-500',
    tags: ['observatory', 'panoramic', 'highest-point', 'cocktails']
  },
  {
    id: 'golden-garden',
    numberKey: '1',
    name: 'Golden Garden',
    category: 'supertree',
    categoryLabel: 'Supertrees',
    subtitle: 'Welcoming Supertrees at the Main Entrance Plaza',
    description: 'Three majestic gold-hued Supertrees standing proudly at the main entrance drop-off to welcome guests into Gardens by the Bay. Lushly wrapped with epiphytic orchids and ferns, setting the majestic stage for arrival.',
    highlights: [
      'Immediate visual beacon upon arriving at Main Entrance Drop-off',
      'Convenient access to Ticketing Hub, Shuttle, and Information Counter',
      'Beautiful night illumination framing the entrance axis'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.63, y: 0.36 },
    bannerGradient: 'from-amber-400 via-yellow-500 to-orange-500',
    tags: ['entrance', 'drop-off', 'welcome', 'supertrees']
  },
  {
    id: 'silver-garden',
    numberKey: '25',
    name: 'Silver Garden',
    category: 'supertree',
    categoryLabel: 'Supertrees',
    subtitle: 'Tranquil Trio of Supertrees Overlooking Dragonfly Lake',
    description: 'Three elegant Supertrees situated along the serene shores of Dragonfly Lake. Draped in silvery-green tillandsias, bromeliads, and epiphytes, this tranquil grove offers a quieter contemplation zone away from the bustling main plaza.',
    highlights: [
      'Serene waterside views across Dragonfly Lake to Marina Bay Sands',
      'Reflections in the lake create stunning morning and dusk photographs',
      'Peaceful shaded park benches beneath the silvery canopies'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.45, y: 0.17 },
    bannerGradient: 'from-slate-400 via-gray-500 to-teal-600',
    tags: ['lake', 'peaceful', 'waterfront', 'supertrees']
  },
  {
    id: 'the-canopy',
    numberKey: '2',
    name: 'The Canopy',
    category: 'facility',
    categoryLabel: 'Exhibition & Plaza',
    subtitle: 'Undercover Event Plaza & Conservatory Gateway',
    description: 'A grand covered forecourt and pavilion nestled between Flower Dome and Cloud Forest. Serves as the central hub connecting visitor ticketing, premier dining (Shake Shack, McDonald\'s), and seasonal event installations.',
    highlights: [
      'Covered sheltered plaza providing seamless all-weather transit',
      'Main ticketing counters and visitor information assistance',
      'Direct entrances to Flower Dome and Cloud Forest conservatories'
    ],
    admission: 'Free Outdoor Access',
    hours: '8:30 AM – 9:00 PM Daily',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.58, y: 0.28 },
    bannerGradient: 'from-sky-500 via-indigo-500 to-blue-600',
    tags: ['plaza', 'ticketing', 'shelter', 'dining-hub']
  },
  {
    id: 'floral-clock',
    numberKey: '5',
    name: 'Floral Clock',
    category: 'attraction',
    categoryLabel: 'Attractions',
    subtitle: '7-Metre Living Horticultural Timepiece',
    description: 'A precision-engineered working clock surrounded by a 7-metre wide ring of vibrant seasonal flowering plants and foliage. Created in partnership with master watchmaker Audemars Piguet to celebrate Singapore\'s 50th year of independence.',
    highlights: [
      'Working mechanical timepiece with floral numbers and motifs',
      'Redesigned periodically with fresh colorful flowering patterns',
      'Popular photographic centerpiece near The Canopy forecourt'
    ],
    admission: 'Free Outdoor Access',
    hours: '24 Hours Open',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.57, y: 0.30 },
    bannerGradient: 'from-emerald-500 via-teal-500 to-sky-400',
    tags: ['clock', 'garden', 'photo-spot']
  },

  // SCULPTURES, MEADOW & OUTDOORS
  {
    id: 'planet-sculpture',
    numberKey: '19',
    name: 'Planet ("Floating Baby")',
    category: 'attraction',
    categoryLabel: 'Art & Sculptures',
    subtitle: 'Iconic Bronze Cantilevered Sculpture by Marc Quinn',
    description: 'A monumental, world-renowned 9-metre long and 3-metre tall painted bronze sculpture of a sleeping baby, depicting the artist\'s infant son. Masterfully balanced on just one elbow, giving the astonishing illusion of weightlessly floating above the lush meadow grass.',
    highlights: [
      'Weighs over 9 tonnes yet appears completely weightless',
      'Cast in bronze and painted white, one of Marc Quinn\'s greatest works',
      'Stunning backdrop with Marina Bay Sands and the skyline in view',
      'One of the most photographed contemporary art landmarks in Asia'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.28, y: 0.49 },
    bannerGradient: 'from-zinc-400 via-stone-300 to-cyan-500',
    tags: ['art', 'sculpture', 'marc-quinn', 'photo-spot']
  },
  {
    id: 'the-meadow',
    numberKey: '20',
    name: 'The Meadow',
    category: 'garden',
    categoryLabel: 'Gardens & Lawns',
    subtitle: 'Singapore\'s Largest Outdoor Event Amphitheatre (22,000 sqm)',
    description: 'A sprawling 22,000-square-metre gently sloping green amphitheatre lawn. Hosts world-class music concerts, open-air film festivals, and community celebrations, framed by dramatic skyline backdrops of the Conservatories and Supertrees.',
    highlights: [
      'Singapore\'s premier outdoor concert and festival venue (up to 30,000 capacity)',
      'Expansive picnic lawns with panoramic unobstructed skies',
      'Sweeping pedestrian jogging and walking paths looping the grounds'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.27, y: 0.58 },
    bannerGradient: 'from-emerald-500 via-green-600 to-lime-500',
    tags: ['lawn', 'events', 'concerts', 'picnic']
  },
  {
    id: 'serene-garden',
    numberKey: '21',
    name: 'Serene Garden',
    category: 'garden',
    categoryLabel: 'Gardens & Lawns',
    subtitle: '2-Hectare Japanese Zen & Minimalist Rock Sanctuary',
    description: 'Inspired by Japanese Zen garden concepts, this 2-hectare tranquil oasis features over 160 rock monoliths sourced from Shikoku, Japan, weeping bamboo groves, tranquil water cascades, and miniature bonsai trees.',
    highlights: [
      '160 authentic blue and red granite monoliths imported from Japan',
      'Miniature waterfall trickling into a peaceful koi pond',
      'Traditional Zen gravel raking, bamboo screens, and contemplation gazebos',
      'Tranquil escape ideal for meditation, wellness, and quiet walks'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.15, y: 0.61 },
    bannerGradient: 'from-stone-600 via-emerald-700 to-teal-800',
    tags: ['zen', 'japanese', 'peaceful', 'meditation']
  },
  {
    id: 'far-east-children-garden',
    numberKey: '23',
    name: 'Children\'s Garden',
    category: 'attraction',
    categoryLabel: 'Attractions',
    subtitle: 'Interactive Water Play, Splash Fountains & Treehouses',
    description: 'A wonderland of adventure funded by Far East Organization. Features hydro-vault arches, interactive motion sensors triggering water jets synced to musical tracks, elevated canopy treehouse bridges, and dedicated toddler water play zones.',
    highlights: [
      'Sensory water-play splash fountains synced to sound and motion sensors',
      'Two 7.5-metre tall canopy treehouses linked by hanging suspension bridges',
      'Toddler play zone with gentle water springs and padded play structures',
      'Shaded family amphitheatre and café for parents'
    ],
    admission: 'Free Outdoor Access',
    hours: '9:00 AM – 7:00 PM (Thu – Sun & Holidays)',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.77, y: 0.39 },
    bannerGradient: 'from-blue-500 via-cyan-400 to-amber-400',
    tags: ['kids', 'waterplay', 'family', 'adventure']
  },
  {
    id: 'floral-fantasy',
    numberKey: '26',
    name: 'Floral Fantasy',
    category: 'conservatory',
    categoryLabel: 'Conservatory',
    subtitle: 'Suspended Floral Bouquets & 4D Flight Ride',
    description: 'A magical floral dreamscape featuring four distinct garden landscapes: Dance, Float, Waltz, and Drift. Includes over 15,000 hanging, dried, and preserved flowers suspended from the ceiling in dynamic kinetic waves, along with a 4D multisensory flight simulation.',
    highlights: [
      '15,000 blooms creating upside-down floral ceiling waves',
      'Delicate poison dart frogs in vivarium displays',
      'Flight of the Dragonfly 4D motion simulator ride',
      'Located right at the entrance of Bayfront MRT Station'
    ],
    admission: 'Ticketed Attraction',
    hours: '10:00 AM – 7:00 PM (Mon – Fri) | 10:00 AM – 8:00 PM (Sat – Sun)',
    climate: 'Air-Conditioned (23-25°C)',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.18, y: 0.40 },
    bannerGradient: 'from-fuchsia-600 via-pink-500 to-purple-500',
    tags: ['floral', 'art', 'mrt-entrance', '4d-ride']
  },
  {
    id: 'sun-pavilion',
    numberKey: '22',
    name: 'Sun Pavilion',
    category: 'garden',
    categoryLabel: 'Gardens & Lawns',
    subtitle: 'Exotic Desert Cacti & Succulent Sanctuary',
    description: 'Home to over 1,000 desert plants spanning some 100 species from Madagascar, the Americas, and Africa. Marvel at the giant Mexican Fence Post cactus, golden barrel cacti, and rare drought-tolerant euphorbias under a striking glass canopy.',
    highlights: [
      'Giant Golden Barrel cacti resembling yellow pincushions',
      'Striking desert-scape contrast next to the tropical wetlands',
      'Educational exhibits on desert botanical adaptations'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.69, y: 0.35 },
    bannerGradient: 'from-yellow-600 via-amber-500 to-stone-600',
    tags: ['cacti', 'desert', 'succulents']
  },
  {
    id: 'the-canyon',
    numberKey: '24',
    name: 'The Canyon',
    category: 'garden',
    categoryLabel: 'Gardens & Lawns',
    subtitle: 'Dragon Rock Formations & 40 Sculptural Rocks from Shandong',
    description: 'A geological showcase of 40 sculptural rock monoliths sourced from Shandong, China, framed by towering granite canyon walls, prehistoric cycads, and Chinese dragon bronze sculptures nestled among lush ferns.',
    highlights: [
      'Dramatic geological limestone formations from China',
      'Bronze sculptures including the legendary Dragonfly and dragon carvings',
      'Cool shaded canyon ravine walk leading towards the conservatories'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.71, y: 0.29 },
    bannerGradient: 'from-stone-600 via-amber-700 to-orange-800',
    tags: ['canyon', 'rocks', 'sculpture']
  },
  {
    id: 'kingfisher-wetlands',
    numberKey: '28',
    name: 'Kingfisher Wetlands',
    category: 'garden',
    categoryLabel: 'Gardens & Lawns',
    subtitle: '15,000 sqm Eco-Sanctuary, Lotus Pond & Mangrove Boardwalk',
    description: 'A restored freshwater eco-sanctuary and urban mangrove forest. Provides natural water filtration for the reservoir while sustaining native birds, dragonflies, and otters with elevated boardwalks and wildlife observation hides.',
    highlights: [
      'Home to exotic native kingfishers, smooth-coated otters, and herons',
      'Living mangrove habitat with specialized stilt root botanical adaptations',
      'Lotus Pond & Victoria Lily Pond blooming with giant floating pads'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.80, y: 0.46 },
    bannerGradient: 'from-teal-600 via-emerald-600 to-cyan-700',
    tags: ['wetlands', 'nature', 'otters', 'birds', 'lotus']
  },
  {
    id: 'active-garden',
    numberKey: '27',
    name: 'Active Garden & PropNex Zone',
    category: 'attraction',
    categoryLabel: 'Attractions',
    subtitle: 'Outdoor Community Fitness, Waterfront Promenade & Pet Café',
    description: 'A vibrant waterfront community hub designed for all generations. Features outdoor calisthenics fitness equipment, musical playground instruments, dog-friendly community lawns, and waterfront dining.',
    highlights: [
      'Intergenerational fitness zones and musical playground',
      'Dog-friendly community green lawns with water points',
      'Direct link to the Waterfront Promenade towards Marina Barrage'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.32, y: 0.15 },
    bannerGradient: 'from-orange-500 via-amber-500 to-green-500',
    tags: ['fitness', 'waterfront', 'community', 'pets']
  },

  // HERITAGE GARDENS (15 - 18)
  {
    id: 'chinese-garden',
    numberKey: '16',
    name: 'Chinese Garden',
    category: 'garden',
    categoryLabel: 'Heritage Gardens',
    subtitle: 'Traditional Scholars\' Pavilion, Moongate & Bonsai',
    description: 'Reflects the role of nature in Chinese culture, poetry, and philosophy. Showcases a magnificent red moongate bridge, classical wooden scholar pavilion, carved stone lanterns, and artistic bamboo and miniature pine arrangements.',
    highlights: [
      'Iconic red circular moongate framing views across Dragonfly Lake',
      'Traditional curved scholar pavilion with tiled eaves',
      'Symbolic Chinese plants including bamboo, lotus, and camellias'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.39, y: 0.28 },
    bannerGradient: 'from-red-600 via-rose-500 to-amber-500',
    tags: ['heritage', 'chinese', 'moongate', 'culture']
  },
  {
    id: 'malay-garden',
    numberKey: '17',
    name: 'Malay Garden',
    category: 'garden',
    categoryLabel: 'Heritage Gardens',
    subtitle: 'Traditional Timber Kampong House & Medicinal Flora',
    description: 'Highlights the traditional relationship between the Malay community and medicinal rainforest plants. Centered around a charming wooden stilt house (rumah panggung) surrounded by breadfruit, betel nut palms, turmeric, and lemongrass.',
    highlights: [
      'Authentic Malay timber kampong house with steep pitched attap roof',
      'Edible and healing herbal remedies of traditional Southeast Asia',
      'Fragrant pandan, ginger, and indigenous fruit tree groves'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.37, y: 0.33 },
    bannerGradient: 'from-amber-700 via-yellow-600 to-emerald-700',
    tags: ['heritage', 'malay', 'kampong', 'timber-house']
  },
  {
    id: 'indian-garden',
    numberKey: '15',
    name: 'Indian Garden',
    category: 'garden',
    categoryLabel: 'Heritage Gardens',
    subtitle: 'Sacred Banyan Trees, Floral Rangoli & Ayurvedic Herbs',
    description: 'Explores the rich botanical tapestry of Hinduism and Indian civilization. Centered on a sacred Banyan tree surrounded by sacred tulsi basil, neem, jasmine, and flower motifs reflecting traditional rangoli art.',
    highlights: [
      'Sacred banyan tree spreading majestic aerial roots',
      'Ayurvedic healing flora and fragrant garland flowers',
      'Floral rangoli patterns paved into pedestrian pathways'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.52, y: 0.27 },
    bannerGradient: 'from-orange-600 via-amber-500 to-rose-600',
    tags: ['heritage', 'indian', 'ayurveda', 'banyan']
  },
  {
    id: 'colonial-garden',
    numberKey: '18',
    name: 'Colonial Garden',
    category: 'garden',
    categoryLabel: 'Heritage Gardens',
    subtitle: 'Spices of the Historic Trade Routes & British Gazebo',
    description: 'Tells the historic story of the lucrative spice trade that brought European merchants to Singapore. Walk past nutmeg, clove, rubber trees, and coffee plants, centered around a Victorian white ornate gazebo.',
    highlights: [
      'Priceless cash crops: nutmeg, clove, cocoa, and Pará rubber trees',
      'Classic white Victorian cast-iron garden gazebo',
      'Historical narrative of Singapore\'s botanical garden foundation'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.35, y: 0.40 },
    bannerGradient: 'from-slate-600 via-emerald-800 to-zinc-700',
    tags: ['heritage', 'colonial', 'spices', 'gazebo']
  },

  // WORLD OF PLANTS (9 - 14)
  {
    id: 'understorey',
    numberKey: '12',
    name: 'Understorey',
    category: 'garden',
    categoryLabel: 'World of Plants',
    subtitle: 'Conical Canopy & Forest Floor Ecosystem',
    description: 'Step into the dark, moisture-rich understorey of the rainforest. Features the iconic conical wooden dome structure illustrating how fungi, fallen leaves, and shade-tolerant species drive forest nutrient recycling.',
    highlights: [
      'Distinctive conical architecture representing forest shelter',
      'Exhibits on fungal networks, decomposing organisms, and saprophytes',
      'Giant tree root cross-sections and sculptural display'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.54, y: 0.51 },
    bannerGradient: 'from-stone-700 via-amber-800 to-yellow-700',
    tags: ['botany', 'understorey', 'forest', 'architecture']
  },
  {
    id: 'world-of-palms',
    numberKey: '13',
    name: 'World of Palms',
    category: 'garden',
    categoryLabel: 'World of Plants',
    subtitle: '150 Species of Tropical Palms & Cycads',
    description: 'A dramatic boulevard displaying the incredible diversity of the palm family—the princes of the vegetable kingdom. Features towering wax palms, fan palms, and peach palms providing cool green shade.',
    highlights: [
      'Over 150 diverse palm species from the rainforests of the world',
      'Rare endangered cycads dating back to the dinosaur era',
      'Shady walking avenue between Supertree Grove and the Meadow'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.56, y: 0.46 },
    bannerGradient: 'from-emerald-700 via-teal-600 to-green-600',
    tags: ['palms', 'world-of-plants', 'avenue']
  },
  {
    id: 'secret-life-of-trees',
    numberKey: '14',
    name: 'Secret Life of Trees',
    category: 'garden',
    categoryLabel: 'World of Plants',
    subtitle: 'Bark, Rings, Canopy Dynamics & Ecological Web',
    description: 'Explores how giant trees survive, adapt, and anchor complex forest food webs. Learn about bark defense chemicals, internal xylem transport, and tree communication.',
    highlights: [
      'Sculptural tree trunks showing annual growth rings and bark defense',
      'Direct pathway leading between Main Drop-off and Supertree Grove'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.56, y: 0.39 },
    bannerGradient: 'from-green-700 via-emerald-600 to-amber-700',
    tags: ['trees', 'botany', 'education']
  },
  {
    id: 'discovery-garden',
    numberKey: '9',
    name: 'Discovery',
    category: 'garden',
    categoryLabel: 'World of Plants',
    subtitle: 'Evolution of Ancient Plants Over 500 Million Years',
    description: 'Take a journey through deep evolutionary time from early mosses, liverworts, and giant club mosses to spore-bearing ferns and modern flowering plants.',
    highlights: [
      'Prehistoric living fossil plant species',
      'Giant stone fossil logs and sculptures along the lawn edge'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.38, y: 0.53 },
    bannerGradient: 'from-amber-700 via-stone-600 to-emerald-800',
    tags: ['fossils', 'evolution', 'nature']
  },
  {
    id: 'web-of-life',
    numberKey: '10',
    name: 'Web of Life',
    category: 'garden',
    categoryLabel: 'World of Plants',
    subtitle: 'Fig Trees, Hornbills & Mutual Ecological Dependencies',
    description: 'Highlights the vital role keystone fig trees play in feeding hundreds of rainforest bird and mammal species, featuring topiary animal sculptures woven into living greenery.',
    highlights: [
      'Lush animal topiary sculptures crafted from living plants',
      'Keystone strangler figs and wildlife mutualism stories'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.43, y: 0.49 },
    bannerGradient: 'from-teal-700 via-emerald-600 to-lime-600',
    tags: ['topiary', 'animals', 'ecology']
  },
  {
    id: 'fruits-and-flowers',
    numberKey: '11',
    name: 'Fruits and Flowers',
    category: 'garden',
    categoryLabel: 'World of Plants',
    subtitle: 'Pollination Wonders, Nectar Traps & Vivid Seed Dispersal',
    description: 'Discover the brilliant evolutionary tricks flowering plants use to lure pollinators—from sweet scents and vivid petals to explosive seed cannons.',
    highlights: [
      'Vivid tropical blooming flowers and butterfly food plants',
      'Close proximity to the central Supertree promenade'
    ],
    admission: 'Free Outdoor Access',
    hours: '5:00 AM – 2:00 AM Daily',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.48, y: 0.54 },
    bannerGradient: 'from-rose-500 via-pink-600 to-amber-500',
    tags: ['flowers', 'pollination', 'botany']
  },

  // DINING & FOOD PLACES (a to l)
  {
    id: 'satay-by-the-bay',
    numberKey: 'g',
    name: 'Satay by the Bay',
    category: 'dining',
    categoryLabel: 'Dining & Food Hall',
    subtitle: 'Singapore Hawker Food Haven by the Waterfront',
    description: 'An open-air hawker food village nestled among coastal trees. Enjoy smoky skewers of grilled chicken, beef, and mutton satay with peanut sauce, alongside barbecue stingray, chili crab, laksa, and fried carrot cake.',
    highlights: [
      'Authentic Singapore charcoal-grilled satay with peanut gravy',
      'Fresh local seafood, barbecue stingray, and chili crab',
      'Breezy waterside seating overlooking the Marina Reservoir'
    ],
    admission: 'Food & Beverage',
    hours: '11:00 AM – 10:00 PM Daily',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.865, y: 0.485 },
    bannerGradient: 'from-orange-600 via-amber-600 to-red-600',
    tags: ['hawker', 'satay', 'food', 'local', 'dinner', 'seafood']
  },
  {
    id: 'jurassic-nest',
    numberKey: 'l',
    name: 'Jurassic Nest Food Hall',
    category: 'dining',
    categoryLabel: 'Dining & Food Hall',
    subtitle: 'Michelin-Rated Food Hall with Animatronic Dinosaurs',
    description: 'Located right at Supertree Grove, this themed dining hall features life-sized roaring animatronic T-Rex and Brachiosaurus dinosaurs, housing stalls by Michelin-starred culinary brands including Tsuta Ramen, Hawker Chan, and Bismillah Biryani.',
    highlights: [
      'Life-sized animatronic roaring dinosaurs that move every hour',
      'Michelin-starred and Bib Gourmand street food hawker brands',
      'Family-friendly interactive indoor air-conditioned dining hall'
    ],
    admission: 'Food & Beverage',
    hours: '11:00 AM – 9:30 PM Daily',
    climate: 'Indoor Dining',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.492, y: 0.448 },
    bannerGradient: 'from-amber-600 via-stone-700 to-orange-700',
    tags: ['dinosaurs', 'michelin', 'ramen', 'family', 'food-hall']
  },
  {
    id: 'supertree-food-hall',
    numberKey: 'k',
    name: 'Supertree Dining & Tapas',
    category: 'dining',
    categoryLabel: 'Dining & Café',
    subtitle: 'Al Fresco Bistro & Refreshments Under the Supertrees',
    description: 'Vibrant dining enclave beneath the glowing canopies of Supertree Grove. Features wood-fired pizzas, artisanal tapas, craft beverages, and tropical desserts with front-row seats to the evening Garden Rhapsody light show.',
    highlights: [
      'Al fresco terrace directly beneath the towering Supertree canopies',
      'Wood-fired pizzas, Asian fusion tapas, and chilled mocktails',
      'Front-row dining view for the nightly Garden Rhapsody show'
    ],
    admission: 'Food & Beverage',
    hours: '10:30 AM – 10:30 PM Daily',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.412, y: 0.348 },
    bannerGradient: 'from-rose-600 via-orange-500 to-amber-500',
    tags: ['supertrees', 'bistro', 'pizza', 'tapas', 'dinner']
  },
  {
    id: 'shake-shack',
    numberKey: 'j',
    name: 'Shake Shack',
    category: 'dining',
    categoryLabel: 'Dining & Burgers',
    subtitle: 'New York Angus Burgers, Crinkle Fries & Pandan Shakes',
    description: 'Located in the prime position right outside Flower Dome at The Canopy. Enjoy all-natural Angus beef burgers, crispy crinkle-cut fries with cheese sauce, and exclusive Singapore-inspired pandan custard concretes.',
    highlights: [
      'Prime dining hub directly outside the Conservatories',
      'Signature ShackBurger, Chick\'n Shack, and local Pandan Shake',
      'Spacious modern botanical pavilion with air-conditioned comfort'
    ],
    admission: 'Food & Beverage',
    hours: '10:00 AM – 10:00 PM Daily',
    climate: 'Indoor Dining',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.588, y: 0.268 },
    bannerGradient: 'from-emerald-600 via-teal-500 to-green-600',
    tags: ['burgers', 'shakes', 'lunch', 'dinner', 'canopy']
  },
  {
    id: 'mcdonalds-canopy',
    numberKey: 'b',
    name: 'McDonald\'s & McCafé',
    category: 'dining',
    categoryLabel: 'Quick Service Dining',
    subtitle: 'Family Burgers, McCafé Pastries & Soft-Serve Sundaes',
    description: 'A spacious family dining pavilion at The Canopy plaza, offering favorite burgers, McNuggets, soft-serve sundaes, and McCafé specialty espresso drinks right between Supertree Grove and the Conservatories.',
    highlights: [
      'Rapid self-order touch kiosks and family seating zones',
      'McCafé counter with fresh pastries, cakes, and barista coffee'
    ],
    admission: 'Food & Beverage',
    hours: '8:30 AM – 10:00 PM Daily',
    climate: 'Indoor Dining',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.558, y: 0.338 },
    bannerGradient: 'from-red-600 via-yellow-500 to-red-700',
    tags: ['fast-food', 'burgers', 'kids', 'quick', 'coffee']
  },
  {
    id: 'starbucks-conservatories',
    numberKey: 'a',
    name: 'Starbucks Reserve Café',
    category: 'dining',
    categoryLabel: 'Café & Bakery',
    subtitle: 'Artisanal Coffee, Cold Brew & Fresh Bakery Pastries',
    description: 'Conveniently situated at the Golden Garden arrival plaza connecting the Main Drop-off and Conservatories. Sip your favorite iced espresso, cold brew, and seasonal Frappuccino with views of the Golden Garden Supertrees.',
    highlights: [
      'Signature espresso drinks, nitro cold brew, and warm sandwiches',
      'Shaded garden terrace overlooking the Golden Garden Supertrees'
    ],
    admission: 'Food & Beverage',
    hours: '8:00 AM – 9:30 PM Daily',
    climate: 'Indoor Dining',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.608, y: 0.365 },
    bannerGradient: 'from-green-800 via-emerald-700 to-teal-900',
    tags: ['coffee', 'beverages', 'snack', 'cafe', 'bakery']
  },
  {
    id: 'tunglok-seafood',
    numberKey: 'd',
    name: 'TungLok Seafood',
    category: 'dining',
    categoryLabel: 'Seafood Restaurant',
    subtitle: 'Award-Winning Singapore Chilli Crab & Fresh Seafood',
    description: 'Located along the Conservatory waterfront promenade. Serves Singapore\'s famous Chilli Crab with golden mantou buns, Deep-fried Prawn with Wasabi-mayo sauce, and freshly steamed catch of the day.',
    highlights: [
      'Authentic Singapore Chilli Crab and Black Pepper Crab',
      'Panoramic waterfront views across the Marina Reservoir'
    ],
    admission: 'Food & Beverage',
    hours: '11:30 AM – 3:00 PM | 6:00 PM – 10:00 PM',
    climate: 'Indoor Dining',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.622, y: 0.205 },
    bannerGradient: 'from-blue-700 via-cyan-600 to-teal-500',
    tags: ['seafood', 'crab', 'chinese', 'dinner', 'restaurant']
  },
  {
    id: 'marguerite-hortus',
    numberKey: 'e',
    name: 'Marguerite & Hortus',
    category: 'dining',
    categoryLabel: 'Fine Dining & Mediterranean',
    subtitle: 'Michelin-Starred Botanical Gastronomy & Mediterranean Grill',
    description: 'Set within the lush botanical setting of Flower Dome. Marguerite offers Michelin-starred contemporary tasting menus, while Hortus serves rustic Mediterranean wood-fired sharing plates surrounded by ancient olive trees.',
    highlights: [
      'Michelin-starred fine dining inside the Flower Dome conservatory',
      'Mediterranean wood-fired grill and afternoon high tea at Hortus',
      'Complimentary buggy shuttle service from the Main Entrance'
    ],
    admission: 'Food & Beverage',
    hours: '12:00 PM – 3:00 PM | 6:00 PM – 10:30 PM',
    climate: 'Air-Conditioned (23-25°C)',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.502, y: 0.165 },
    bannerGradient: 'from-amber-600 via-rose-400 to-purple-600',
    tags: ['fine-dining', 'michelin', 'mediterranean', 'flower-dome']
  },
  {
    id: 'conservatory-sweet-cafe',
    numberKey: 'c',
    name: 'Cloud Forest Patisserie & Gelato',
    category: 'dining',
    categoryLabel: 'Dessert & Gelato Bar',
    subtitle: 'Artisanal Gelato, Floral Teas & Botanical Confections',
    description: 'Nestled right beside the Cloud Forest exit and The Canyon. Cool down with handcrafted tropical fruit gelato, single-origin chocolate bonbons, cold-pressed juices, and floral-infused iced teas.',
    highlights: [
      'Artisanal mango, coconut, and lychee botanical gelato',
      'Handcrafted floral pastries and refreshing cold-pressed juices'
    ],
    admission: 'Food & Beverage',
    hours: '9:30 AM – 8:30 PM Daily',
    climate: 'Indoor Dining',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.702, y: 0.238 },
    bannerGradient: 'from-pink-500 via-amber-500 to-orange-500',
    tags: ['gelato', 'ice-cream', 'dessert', 'tea', 'cafe']
  },
  {
    id: 'childrens-garden-cafe',
    numberKey: 'f',
    name: 'Children\'s Garden Café',
    category: 'dining',
    categoryLabel: 'Family Café & Snacks',
    subtitle: 'Family Refreshments, Waffles, Smoothies & Kids\' Meals',
    description: 'Positioned right between the Sun Pavilion and Far East Organization Children\'s Garden. Serves wholesome kids\' bento boxes, Belgian waffles, fruit smoothies, and iced coffee for parents relaxing by the water play zone.',
    highlights: [
      'Wholesome kid-friendly meals, crispy waffles, and fruit popsicles',
      'Shaded family patio right next to the Children\'s Garden splash pad'
    ],
    admission: 'Food & Beverage',
    hours: '9:30 AM – 6:30 PM (Tue – Sun)',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.742, y: 0.352 },
    bannerGradient: 'from-amber-500 via-orange-500 to-yellow-500',
    tags: ['family', 'kids', 'waffles', 'smoothies', 'cafe']
  },
  {
    id: 'waterfront-bistro',
    numberKey: 'h',
    name: 'Dragonfly Waterfront Bistro',
    category: 'dining',
    categoryLabel: 'Lakeside Bistro & Café',
    subtitle: 'All-Day Brunch, Wood-Fired Flatbreads & Lakeside Coffee',
    description: 'Overlooking the tranquil northern reaches of Dragonfly Lake near the Active Garden. A breezy lakeside spot for all-day brunch, gourmet sandwiches, iced matcha lattes, and pet-friendly outdoor patio dining.',
    highlights: [
      'Scenic waterfront deck overlooking Dragonfly Lake and MBS skyline',
      'All-day eggs benedict, flatbreads, and specialty iced coffee'
    ],
    admission: 'Food & Beverage',
    hours: '8:30 AM – 9:00 PM Daily',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.345, y: 0.212 },
    bannerGradient: 'from-orange-500 via-amber-500 to-teal-600',
    tags: ['brunch', 'lakeside', 'coffee', 'bistro']
  },
  {
    id: 'bayfront-cafe',
    numberKey: 'i',
    name: 'Bayfront Floral Café',
    category: 'dining',
    categoryLabel: 'Gateway Café & Bakery',
    subtitle: 'Botanical Pastries, Kopi & Grab-and-Go Refreshments',
    description: 'Located at Bayfront Plaza next to Floral Fantasy and Bayfront MRT. The ideal starting or ending stop for visitors seeking traditional Nanyang kopi, kaya toast, artisanal croissants, and chilled coconut water.',
    highlights: [
      'Traditional Singapore kaya toast, local kopi, and French pastries',
      'Conveniently located right at the Bayfront MRT & Floral Fantasy hub'
    ],
    admission: 'Food & Beverage',
    hours: '8:00 AM – 8:30 PM Daily',
    climate: 'Indoor Dining',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.245, y: 0.388 },
    bannerGradient: 'from-rose-500 via-amber-500 to-orange-600',
    tags: ['kopi', 'bakery', 'breakfast', 'bayfront', 'cafe']
  },

  // OTHERS & ARCHITECTURAL HIGHLIGHTS (29 - 37 & GATEWAYS)
  {
    id: 'bayfront-pavilion',
    numberKey: '33',
    name: 'Bayfront Pavilion (SG50 Lattice)',
    category: 'others',
    categoryLabel: 'Pavilion & Landmark',
    subtitle: 'Intricate Geometric Architectural Geodesic Shell',
    description: 'A striking architectural pavilion constructed for the SG50 "The Future of Us" exhibition. Consists of over 11,000 uniquely cut perforated aluminum panels that create enchanting dappled light patterns like sunlight filtering through a tropical jungle canopy.',
    highlights: [
      'Prizewinning computational parametric architecture',
      'Over 11,000 unique perforated panels generating light-and-shadow tapestry',
      'Key landmark right outside Bayfront MRT (Exit B)'
    ],
    admission: 'Free Outdoor Access',
    hours: '24 Hours Open',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.17, y: 0.44 },
    bannerGradient: 'from-teal-600 via-cyan-500 to-slate-700',
    tags: ['architecture', 'parametric', 'sg50', 'design']
  },
  {
    id: 'bayfront-plaza',
    numberKey: 'MRT',
    name: 'Bayfront Plaza & MRT Gateway',
    category: 'facility',
    categoryLabel: 'Visitor Gateway',
    subtitle: 'Direct Link to Bayfront MRT Station (CE1/DT16)',
    description: 'The primary transit gateway for visitors arriving via the Singapore MRT network (Circle Line and Downtown Line). Connects directly to Bayfront Plaza, ticketing kiosks, visitor lockers, Floral Fantasy, and the Shuttle Service.',
    highlights: [
      'Direct underground subway connection to Bayfront MRT (Exit B)',
      'Garden Shuttle station for easy transit to Conservatories',
      'Auto Rider autonomous electric vehicle boarding point'
    ],
    admission: 'Visitor Facility',
    hours: '5:00 AM – 1:00 AM Daily',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.23, y: 0.33 },
    bannerGradient: 'from-sky-600 via-blue-600 to-indigo-700',
    tags: ['mrt', 'shuttle', 'gateway', 'transit']
  },
  {
    id: 'main-entrance-dropoff',
    numberKey: 'P',
    name: 'Main Entrance & Coach Bay',
    category: 'facility',
    categoryLabel: 'Visitor Gateway',
    subtitle: 'Drop-Off Plaza, Taxi Stand & Underground Car Park',
    description: 'The main vehicular arrival entrance located along Marina Gardens Drive. Features a multi-lane taxi stand, tour bus coach bays, electronic underground parking, barrier-free access ramps, and direct access to Golden Garden.',
    highlights: [
      'Sheltered taxi stand and passenger drop-off driveway',
      'Electronic underground car park (420 lots) with EV charging stations',
      'Immediate access to Visitor Information Desk and Garden Cruiser shuttle'
    ],
    admission: 'Visitor Facility',
    hours: '24 Hours Open',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.62, y: 0.42 },
    bannerGradient: 'from-indigo-600 via-purple-600 to-slate-700',
    tags: ['parking', 'taxi', 'drop-off', 'bus']
  },
  {
    id: 'dragonfly-bridge',
    numberKey: 'Bridge',
    name: 'Dragonfly Bridge & Lake',
    category: 'others',
    categoryLabel: 'Bridges & Waterways',
    subtitle: 'Scenic Pedestrian Bridge Across Dragonfly Lake',
    description: 'A wide scenic pedestrian boardwalk bridge spanning Dragonfly Lake. Offers iconic view corridors framing the Conservatories, Silver Garden, and Marina Bay Sands with dragonflies dancing across the water lilies below.',
    highlights: [
      'Primary walking connection between Bayfront Plaza and Supertree Grove',
      '440-metre lakeside boardwalk with solar-powered water aeration sculptures',
      'Breathtaking photo vantage of the iconic Supertrees reflected in the lake'
    ],
    admission: 'Free Outdoor Access',
    hours: '24 Hours Open',
    climate: 'Outdoor Tropical',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.32, y: 0.35 },
    bannerGradient: 'from-cyan-600 via-blue-500 to-teal-700',
    tags: ['bridge', 'lake', 'photo', 'walk']
  },
  {
    id: 'mbs-overpass',
    numberKey: 'Link',
    name: 'Marina Bay Sands Lions Bridge',
    category: 'facility',
    categoryLabel: 'Visitor Gateway',
    subtitle: 'Elevated Overpass Connecting MBS Hotel to the Gardens',
    description: 'A spectacular elevated pedestrian bridge traversing high above Marina Boulevard, connecting directly from the Marina Bay Sands hotel atrium into the heart of Gardens by the Bay.',
    highlights: [
      'Direct elevated access from Marina Bay Sands without crossing street-level traffic',
      'Sweeping elevated vantage over Dragonfly Lake and Bayfront Plaza',
      'Open 24 hours with elevator and ramp accessibility'
    ],
    admission: 'Free Outdoor Access',
    hours: '24 Hours Open',
    climate: 'Outdoor Sheltered',
    accessibility: 'Wheelchair / Barrier-Free',
    mapCoord: { x: 0.19, y: 0.28 },
    bannerGradient: 'from-slate-700 via-indigo-600 to-blue-700',
    tags: ['mbs', 'overpass', 'bridge', 'hotel-link']
  }
];

// Curated walking paths for the Route Finder
export const POPULAR_ROUTES = [
  {
    fromId: 'bayfront-plaza',
    toId: 'flower-dome',
    title: 'Bayfront MRT → Flower Dome',
    distanceMeters: 620,
    walkMinutes: 8,
    barrierFree: true,
    description: 'Scenic stroll across Dragonfly Bridge, past the Heritage Gardens straight to The Canopy and Flower Dome entrance.'
  },
  {
    fromId: 'bayfront-plaza',
    toId: 'supertree-grove',
    title: 'Bayfront MRT → Supertree Grove',
    distanceMeters: 480,
    walkMinutes: 6,
    barrierFree: true,
    description: 'Direct walk crossing Dragonfly Bridge and following the paved boulevard past the Malay and Chinese Gardens to the Supertrees.'
  },
  {
    fromId: 'main-entrance-dropoff',
    toId: 'cloud-forest',
    title: 'Main Entrance → Cloud Forest',
    distanceMeters: 280,
    walkMinutes: 4,
    barrierFree: true,
    description: 'Quick barrier-free walk from the Drop-off past Golden Garden through The Canopy directly into Cloud Forest.'
  },
  {
    fromId: 'supertree-grove',
    toId: 'planet-sculpture',
    title: 'Supertree Grove → "Planet" Floating Baby',
    distanceMeters: 340,
    walkMinutes: 5,
    barrierFree: true,
    description: 'Gentle walk through the World of Plants and across Meadow Bridge into the open green lawns.'
  },
  {
    fromId: 'flower-dome',
    toId: 'satay-by-the-bay',
    title: 'Conservatories → Satay by the Bay',
    distanceMeters: 750,
    walkMinutes: 10,
    barrierFree: true,
    description: 'Picturesque waterfront route past the Sun Pavilion, Children\'s Garden, and Kingfisher Wetlands to the hawker haven.'
  }
];
