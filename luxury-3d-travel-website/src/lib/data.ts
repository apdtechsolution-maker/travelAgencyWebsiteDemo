// ---------------------------------------------------------------------------
// AURA VOYAGES — static catalog, pricing engine & helpers
// ---------------------------------------------------------------------------

export const WHATSAPP_NUMBER = "919825012345"; // agency desk (replace with live number)
export const TOKEN_AMOUNT = 2999;

export const px = (id: number, w = 1200, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
export const fmtINR = (n: number) => `₹${inr.format(Math.round(n))}`;
export const emiFrom = (price: number) => Math.max(500, Math.floor(price / 12 / 50) * 50);

export type Vibe = "honeymoon" | "family" | "adventure" | "visafree";
export type Region = "domestic" | "international";

export const VIBES: { id: Vibe; label: string; emoji: string }[] = [
  { id: "honeymoon", label: "Honeymoon & Romance", emoji: "💞" },
  { id: "family", label: "Family Maharaj Group Tour", emoji: "👨‍👩‍👧‍👦" },
  { id: "adventure", label: "High-Altitude Adventure", emoji: "🏔️" },
  { id: "visafree", label: "Visa-Free International", emoji: "🛂" },
];

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type ItineraryDay = {
  day: string;
  title: string;
  desc: string;
  tags: string[];
};

export type Pkg = {
  id: string;
  title: string;
  location: string;
  region: Region;
  price: number; // per person, 3★ family land package
  days: number;
  nights: number;
  rating: number;
  reviews: number;
  vibes: Vibe[];
  months: number[]; // 0-indexed best months
  images: string[];
  blurb: string;
  highlights: string[];
  hotels: [string, string, string];
  flight: number; // return flight per person (INR)
  visaIns: number; // visa + travel insurance per person (INR)
  itinerary: ItineraryDay[];
};

export const PACKAGES: Pkg[] = [
  {
    id: "swiss",
    title: "Swiss Alps & Paris Grand Tour",
    location: "Switzerland · France",
    region: "international",
    price: 145000,
    days: 9,
    nights: 8,
    rating: 4.9,
    reviews: 412,
    vibes: ["honeymoon", "family"],
    months: [3, 4, 5, 8, 9],
    images: [px(32514343), px(13602098), px(21041270)],
    blurb: "Jungfraujoch, Lucerne lake cruises and an Eiffel Tower sunset — with Indian Jain chefs on tour.",
    highlights: ["Jungfraujoch Top of Europe", "Mt. Titlis cable car", "Seine dinner cruise"],
    hotels: ["Ibis Zurich Adliswil", "Radisson Blu Lucerne", "Fairmont Le Montreux Palace"],
    flight: 68000,
    visaIns: 13500,
    itinerary: [
      { day: "Day 1", title: "Arrival in Zurich & Lake Cruise Dinner", desc: "Meet your Gujarati tour manager at ZRH, transfer to Lucerne and unwind with a sunset lake cruise.", tags: ["Airport Meet & Greet", "Lake Lucerne", "Jain Dinner"] },
      { day: "Day 2", title: "Mt. Titlis Glacier & Chapel Bridge", desc: "Rotair rotating gondola to 3,238 m, ice flyer, then a stroll across the 14th-century Kapellbrücke.", tags: ["Mt. Titlis", "Ice Flyer", "Old Town Walk"] },
      { day: "Day 3", title: "Jungfraujoch — Top of Europe", desc: "Cogwheel train to Europe's highest station, Sphinx Observatory and the Aletsch glacier panorama.", tags: ["Cogwheel Train", "Sphinx Deck", "Bollywood Point"] },
      { day: "Day 5", title: "TGV to Paris & Eiffel Illumination", desc: "Scenic high-speed rail to Paris, evening Eiffel Tower summit and Seine river illuminations cruise.", tags: ["TGV Lyria", "Eiffel Summit", "Seine Cruise"] },
      { day: "Day 9", title: "Shopping at Galeries Lafayette & Departure", desc: "Last-minute shopping, VAT refund assistance and airport transfer for your flight back to India.", tags: ["Tax-Free Shopping", "Airport Drop"] },
    ],
  },
  {
    id: "dubai",
    title: "Dubai & Abu Dhabi Luxury",
    location: "United Arab Emirates",
    region: "international",
    price: 54999,
    days: 6,
    nights: 5,
    rating: 4.8,
    reviews: 936,
    vibes: ["family", "honeymoon"],
    months: [9, 10, 11, 0, 1, 2],
    images: [px(19664340), px(5577693), px(31566720)],
    blurb: "Burj Khalifa At The Top, desert safari with Jain BBQ and the Sheikh Zayed Grand Mosque.",
    highlights: ["Burj Khalifa 148th floor", "Premium desert safari", "Ferrari World Abu Dhabi"],
    hotels: ["Citymax Bur Dubai", "Rove Downtown Dubai", "Atlantis The Palm"],
    flight: 21500,
    visaIns: 7800,
    itinerary: [
      { day: "Day 1", title: "Arrival & Dhow Cruise Dinner", desc: "Private transfer to hotel and a glittering Dubai Marina dhow cruise with live Tanoura show.", tags: ["Airport Pickup", "Dhow Cruise", "Jain Dinner"] },
      { day: "Day 2", title: "Old & New Dubai City Tour", desc: "Dubai Frame, Jumeirah Mosque, Museum of the Future photo-stop and Burj Khalifa At The Top.", tags: ["Burj Khalifa", "Dubai Mall", "Fountain Show"] },
      { day: "Day 3", title: "Premium Desert Safari", desc: "Dune bashing, camel ride, henna, falcon photos and a vegetarian BBQ under the stars.", tags: ["Dune Bashing", "Camel Ride", "Veg BBQ"] },
      { day: "Day 4", title: "Abu Dhabi: Mosque & Ferrari World", desc: "Sheikh Zayed Grand Mosque, Louvre Abu Dhabi exterior and thrill rides at Ferrari World.", tags: ["Grand Mosque", "Ferrari World", "Corniche"] },
      { day: "Day 6", title: "Gold Souk Shopping & Departure", desc: "Spice & Gold Souk walk and drop-off to DXB airport.", tags: ["Gold Souk", "Airport Drop"] },
    ],
  },
  {
    id: "vietnam",
    title: "Vietnam: Da Nang & Phu Quoc",
    location: "Vietnam",
    region: "international",
    price: 46500,
    days: 6,
    nights: 5,
    rating: 4.9,
    reviews: 684,
    vibes: ["honeymoon", "family", "adventure"],
    months: [1, 2, 3, 4, 8, 9, 10],
    images: [px(28297412), px(20602155), px(20539373)],
    blurb: "Golden Bridge in the clouds, Hoi An lantern nights and Phu Quoc's sunset beaches.",
    highlights: ["Ba Na Hills Golden Bridge", "Hoi An lantern boat", "Phu Quoc cable car"],
    hotels: ["Mercure Da Nang French Village", "Novotel Da Nang Premier", "InterContinental Phu Quoc"],
    flight: 29500,
    visaIns: 6200,
    itinerary: [
      { day: "Day 1", title: "Arrival & Han River Cruise Dinner", desc: "Land in Da Nang, transfer to your beach hotel, evening Han River cruise with Indian dinner.", tags: ["Airport Pickup", "Han River Cruise", "Jain Dinner"] },
      { day: "Day 2", title: "Ba Na Hills & Golden Bridge", desc: "Record-breaking cable car to the French village, the iconic Golden Bridge and Fantasy Park.", tags: ["Golden Bridge", "Cable Car", "Buffet Lunch"] },
      { day: "Day 3", title: "Hoi An Ancient Town & Lantern Boat", desc: "Japanese Bridge, tailor-made shopping and a lantern-lit Thu Bon boat ride.", tags: ["Hoi An", "Lantern Boat", "Basket Boat"] },
      { day: "Day 4", title: "Fly to Phu Quoc — Island Hopping", desc: "Snorkelling at An Thoi, floating bar and glass-bottom boat across the southern islands.", tags: ["Island Hopping", "Snorkelling", "Sunset Beach"] },
      { day: "Day 6", title: "Sunset Sanato Cable Car & Departure", desc: "Hon Thom cable car, pearl farm visit and drop to airport.", tags: ["Hon Thom Cable Car", "Pearl Farm"] },
    ],
  },
  {
    id: "bali",
    title: "Bali Private Pool Villa Escape",
    location: "Bali · Indonesia",
    region: "international",
    price: 49999,
    days: 6,
    nights: 5,
    rating: 4.9,
    reviews: 758,
    vibes: ["honeymoon", "visafree"],
    months: [3, 4, 5, 6, 7, 8, 9],
    images: [px(36418268), px(33709939), px(19570521)],
    blurb: "Floating breakfasts, Ubud rice terraces and Uluwatu temple sunsets from your private pool villa.",
    highlights: ["Private pool villa", "Nusa Penida day trip", "Uluwatu Kecak dance"],
    hotels: ["Kuta Beach Heritage", "The Ubud Village Resort", "Ayana Villas Jimbaran"],
    flight: 33000,
    visaIns: 5400,
    itinerary: [
      { day: "Day 1", title: "Arrival & Jimbaran Candle-lit Beach Dinner", desc: "Garland welcome, villa check-in and a candle-lit beach dinner with a pure veg Jain menu.", tags: ["Airport Pickup", "Beach Dinner", "Jain Menu"] },
      { day: "Day 2", title: "Ubud Rice Terraces & Swing", desc: "Tegalalang terraces, Bali swing, Monkey Forest and a traditional coffee plantation.", tags: ["Tegalalang", "Bali Swing", "Waterfall"] },
      { day: "Day 3", title: "Nusa Penida Island Hopping", desc: "Kelingking Beach, Angel's Billabong and Crystal Bay by fast boat.", tags: ["Kelingking", "Speed Boat", "Snorkel"] },
      { day: "Day 4", title: "Uluwatu Temple & Kecak Fire Dance", desc: "Cliff-top temple at sunset followed by the legendary Kecak fire dance.", tags: ["Uluwatu", "Kecak Dance", "Sunset"] },
      { day: "Day 6", title: "Floating Breakfast & Departure", desc: "Farewell floating breakfast in your pool and airport transfer.", tags: ["Floating Breakfast", "Airport Drop"] },
    ],
  },
  {
    id: "kashmir",
    title: "Kashmir & Gulmarg Gondola",
    location: "Jammu & Kashmir · India",
    region: "domestic",
    price: 24999,
    days: 6,
    nights: 5,
    rating: 4.9,
    reviews: 1240,
    vibes: ["honeymoon", "family", "adventure"],
    months: [3, 4, 5, 8, 9, 11, 0, 1],
    images: [px(30750204), px(15344129), px(16762529)],
    blurb: "Shikara on Dal Lake, Gulmarg Gondola Phase 2 snow views and Pahalgam's Betaab Valley.",
    highlights: ["Dal Lake houseboat night", "Gulmarg Gondola Phase 2", "Pahalgam & Betaab Valley"],
    hotels: ["Hotel Heevan Srinagar", "Vivanta Dal View", "Grand Mumtaz Houseboat Suite"],
    flight: 11500,
    visaIns: 1400,
    itinerary: [
      { day: "Day 1", title: "Srinagar Arrival & Shikara Sunset", desc: "Meet at SXR, check into your houseboat and glide across Dal Lake at golden hour.", tags: ["Airport Pickup", "Shikara Ride", "Jain Dinner"] },
      { day: "Day 2", title: "Mughal Gardens & Old Srinagar", desc: "Nishat, Shalimar and Chashme Shahi gardens, Shankaracharya hill view and Lal Chowk.", tags: ["Mughal Gardens", "Local Market"] },
      { day: "Day 3", title: "Gulmarg Gondola Excursion", desc: "Ride Asia's highest cable car to Apharwat, snow play and optional skiing lessons.", tags: ["Gondola Phase 2", "Snow Play", "Kashmiri Kahwa"] },
      { day: "Day 4", title: "Pahalgam via Saffron Fields", desc: "Awantipora ruins, Pampore saffron fields, Betaab Valley and Aru Valley by Lidder river.", tags: ["Betaab Valley", "Aru Valley", "Riverside Lunch"] },
      { day: "Day 6", title: "Departure with Dry Fruit Hampers", desc: "Pashmina shopping stop and airport drop.", tags: ["Shopping", "Airport Drop"] },
    ],
  },
  {
    id: "spiti",
    title: "Himachal & Spiti Expedition",
    location: "Himachal Pradesh · India",
    region: "domestic",
    price: 14999,
    days: 7,
    nights: 6,
    rating: 4.8,
    reviews: 530,
    vibes: ["adventure"],
    months: [5, 6, 7, 8],
    images: [px(31307365), px(32164017), px(34765189)],
    blurb: "Key Monastery, Chandratal camping and the highest village in the world — with a support SUV.",
    highlights: ["Key Monastery & Kibber", "Chandratal Lake camping", "Kunzum Pass 4,590 m"],
    hotels: ["Camp Zostel Kaza", "Spiti Heritage Homestay", "Snow Leopard Luxury Camps"],
    flight: 7800,
    visaIns: 1200,
    itinerary: [
      { day: "Day 1", title: "Shimla Pickup & Narkanda Drive", desc: "Assemble in Shimla, drive via Narkanda and Sangla valley with acclimatisation stops.", tags: ["Shimla Pickup", "Apple Orchards", "Veg Dinner"] },
      { day: "Day 2", title: "Kalpa — Kinnaur Kailash View", desc: "Reckong Peo, Kalpa village and the Roghi hanging villages.", tags: ["Kalpa", "Suicide Point", "Homestay"] },
      { day: "Day 3", title: "Nako Lake & Tabo Monastery", desc: "Hindustan–Tibet road, Nako lake and 1,000-year-old Tabo caves.", tags: ["Nako Lake", "Tabo Monastery"] },
      { day: "Day 4", title: "Key, Kibber & Langza Fossils", desc: "Key Monastery, Kibber village and the Buddha statue at Langza.", tags: ["Key Monastery", "Komic", "Hikkim Post Office"] },
      { day: "Day 7", title: "Chandratal & Manali Drop", desc: "Kunzum Pass, Chandratal lake and Atal Tunnel to Manali.", tags: ["Chandratal", "Kunzum Pass", "Manali Drop"] },
    ],
  },
  {
    id: "kerala",
    title: "Kerala Backwaters & Munnar Retreat",
    location: "Kerala · India",
    region: "domestic",
    price: 21999,
    days: 5,
    nights: 4,
    rating: 4.8,
    reviews: 602,
    vibes: ["honeymoon", "family"],
    months: [9, 10, 11, 0, 1, 2],
    images: [px(12950219), px(17928231), px(32518360)],
    blurb: "Private AC houseboat in Alleppey, Munnar tea hills and Ayurvedic spa evenings.",
    highlights: ["Private AC houseboat", "Munnar tea estates", "Ayurvedic massage"],
    hotels: ["Hotel Elephant Court", "Windermere Estate Munnar", "Kumarakom Lake Resort"],
    flight: 9800,
    visaIns: 1100,
    itinerary: [
      { day: "Day 1", title: "Cochin Arrival & Munnar Drive", desc: "Transfer through spice plantations and waterfalls to the misty Munnar hills.", tags: ["Airport Pickup", "Cheeyappara Falls"] },
      { day: "Day 2", title: "Munnar Tea Museum & Eravikulam", desc: "Tea estates, Mattupetty Dam and Rajamala wild Nilgiri tahr park.", tags: ["Tea Museum", "Eravikulam", "Echo Point"] },
      { day: "Day 3", title: "Thekkady Spice Trail", desc: "Spice garden walk, Periyar bamboo rafting and Kathakali evening.", tags: ["Periyar", "Spice Walk", "Kathakali"] },
      { day: "Day 4", title: "Alleppey Houseboat Overnight", desc: "Cruise the backwaters on a private houseboat with a Kerala sadya lunch.", tags: ["Houseboat", "Sadya Lunch", "Sunset Cruise"] },
      { day: "Day 5", title: "Cochin Sightseeing & Departure", desc: "Fort Kochi Chinese nets and Mattancherry before airport drop.", tags: ["Fort Kochi", "Airport Drop"] },
    ],
  },
  {
    id: "rajasthan",
    title: "Royal Rajasthan Palace Trail",
    location: "Udaipur · Jodhpur · Jaisalmer",
    region: "domestic",
    price: 28500,
    days: 7,
    nights: 6,
    rating: 4.9,
    reviews: 845,
    vibes: ["family", "honeymoon"],
    months: [9, 10, 11, 0, 1, 2],
    images: [px(33658452), px(27960113), px(33230283)],
    blurb: "Lake Pichola boat dinners, Mehrangarh Fort and a camel-lit night under the Thar sky.",
    highlights: ["City Palace Udaipur", "Mehrangarh Fort", "Sam Dunes camp"],
    hotels: ["Hotel Pichola Haveli", "Radisson Jodhpur", "Taj Lake Palace View Suite"],
    flight: 6900,
    visaIns: 1100,
    itinerary: [
      { day: "Day 1", title: "Udaipur — Pichola Boat Ride", desc: "Arrive in the City of Lakes and enjoy a sunset boat ride past the Lake Palace.", tags: ["Boat Ride", "Jain Dinner"] },
      { day: "Day 2", title: "City Palace & Sajjangarh", desc: "City Palace museum, Saheliyon-ki-Bari and monsoon palace sunset.", tags: ["City Palace", "Jagdish Temple"] },
      { day: "Day 3", title: "Ranakpur Jain Temples to Jodhpur", desc: "Marble Adinath temple at Ranakpur then onward to the Blue City.", tags: ["Ranakpur", "Jain Bhojanalaya"] },
      { day: "Day 4", title: "Mehrangarh Fort & Jaswant Thada", desc: "Zipline option over the fort and spice markets of Sardar.", tags: ["Mehrangarh", "Clock Tower"] },
      { day: "Day 7", title: "Sam Dunes Camp & Departure", desc: "Camel safari, folk music and a cultural dinner under the Thar stars.", tags: ["Camel Safari", "Folk Dance", "Desert Camp"] },
    ],
  },
  {
    id: "maldives",
    title: "Maldives Overwater Villa Honeymoon",
    location: "Maldives",
    region: "international",
    price: 78000,
    days: 5,
    nights: 4,
    rating: 4.9,
    reviews: 318,
    vibes: ["honeymoon", "visafree"],
    months: [10, 11, 0, 1, 2, 3],
    images: [px(9394274), px(30037392), px(30037393)],
    blurb: "Speedboat to your overwater villa, sandbank picnic and dolphin-watch sunset cruise.",
    highlights: ["Overwater villa", "Sandbank picnic", "Dolphin sunset cruise"],
    hotels: ["Kaani Beach Maafushi", "Sun Siyam Iru Fushi", "Conrad Maldives Rangali"],
    flight: 36000,
    visaIns: 4200,
    itinerary: [
      { day: "Day 1", title: "Malé Arrival & Speedboat to Resort", desc: "Free 30-day visa on arrival, speedboat transfer and welcome cocktails on your deck.", tags: ["Speedboat", "Welcome Drink", "Jain Dinner"] },
      { day: "Day 2", title: "Snorkel the House Reef", desc: "Turtles and reef sharks right off your villa with a guided snorkel.", tags: ["Snorkelling", "Spa Credit"] },
      { day: "Day 3", title: "Sandbank Picnic & Dolphin Cruise", desc: "Private sandbank lunch and a golden-hour dolphin watch.", tags: ["Sandbank", "Dolphin Cruise"] },
      { day: "Day 5", title: "Breakfast & Departure", desc: "Farewell breakfast and seaplane/speedboat to Malé airport.", tags: ["Airport Transfer"] },
    ],
  },
];

export const getPkg = (id: string) => PACKAGES.find((p) => p.id === id) ?? PACKAGES[0];

// --- 3D globe destinations -------------------------------------------------
export type Destination = {
  id: string; // matches package id
  label: string;
  short: string;
  flag: string;
  code: string;
  lat: number;
  lon: number;
  weather: string;
  visaStatus: string;
  color: string;
};

export const ORIGIN = { label: "Vadodara / Ahmedabad Hub", code: "BDQ/AMD", lat: 22.5, lon: 72.9 };

export const DESTINATIONS: Destination[] = [
  { id: "swiss", label: "Swiss Alps & Paris", short: "Swiss & Paris", flag: "🇨🇭", code: "ZRH", lat: 46.8, lon: 8.2, weather: "14°C Alpine Clear", visaStatus: "Schengen · 10–15 Days", color: "#FF5A36" },
  { id: "dubai", label: "Dubai & Abu Dhabi Luxury", short: "Dubai", flag: "🇦🇪", code: "DXB", lat: 25.2, lon: 55.3, weather: "31°C Sunny", visaStatus: "E-Visa in 48 Hrs", color: "#D4AF37" },
  { id: "vietnam", label: "Vietnam (Da Nang & Phu Quoc)", short: "Vietnam", flag: "🇻🇳", code: "DAD", lat: 16.0, lon: 108.2, weather: "28°C Partly Sunny", visaStatus: "E-Visa in 3 Days", color: "#0D9488" },
  { id: "bali", label: "Bali Private Pool Villa", short: "Bali", flag: "🇮🇩", code: "DPS", lat: -8.4, lon: 115.2, weather: "29°C Sunny", visaStatus: "Visa on Arrival", color: "#FF5A36" },
  { id: "kashmir", label: "Kashmir & Gulmarg Gondola", short: "Kashmir", flag: "🇮🇳", code: "SXR", lat: 34.1, lon: 74.8, weather: "9°C Snow Flurries", visaStatus: "No Visa · Domestic", color: "#D4AF37" },
  { id: "spiti", label: "Himachal & Spiti Expedition", short: "Spiti", flag: "🏔️", code: "KUU", lat: 32.2, lon: 78.0, weather: "6°C Crisp & Clear", visaStatus: "Inner Line Permit (We Assist)", color: "#0D9488" },
];

// --- Pricing engine --------------------------------------------------------
export const HOTEL_TIERS = [
  { id: 0, label: "3★ Comfort", short: "3★", mult: 1 },
  { id: 1, label: "4★ Premium", short: "4★", mult: 1.28 },
  { id: 2, label: "5★ Luxury Pool Villa", short: "5★", mult: 1.85 },
] as const;

export const GROUP_TYPES = [
  { id: "couple", label: "Couple Private Cab", pax: 2, mult: 1.18 },
  { id: "family", label: "Family of 4", pax: 4, mult: 1 },
  { id: "group", label: "Group Bus Tour", pax: 10, mult: 0.92 },
] as const;

export const CANDLE_PRICE = 6500;

export type Config = {
  hotel: 0 | 1 | 2;
  group: "couple" | "family" | "group";
  pax: number;
  flights: boolean;
  insurance: boolean;
  candle: boolean;
};

export const defaultConfig: Config = { hotel: 0, group: "couple", pax: 2, flights: false, insurance: false, candle: false };

export function calcQuote(pkg: Pkg, cfg: Config) {
  const hotel = HOTEL_TIERS[cfg.hotel];
  const group = GROUP_TYPES.find((g) => g.id === cfg.group)!;
  const land = Math.round(pkg.price * hotel.mult * group.mult);
  const landTotal = land * cfg.pax;
  const flights = cfg.flights ? pkg.flight * cfg.pax : 0;
  const insurance = cfg.insurance ? pkg.visaIns * cfg.pax : 0;
  const candle = cfg.candle ? CANDLE_PRICE : 0;
  const total = landTotal + flights + insurance + candle;
  return { landPerPerson: land, landTotal, flights, insurance, candle, total, perPerson: Math.round(total / cfg.pax) };
}

// --- Visa Hub --------------------------------------------------------------
export type VisaInfo = {
  id: string;
  country: string;
  flag: string;
  time: string;
  type: string;
  fee: number;
  docs: string[];
  note: string;
};

export const VISAS: VisaInfo[] = [
  { id: "schengen", country: "Schengen Europe", flag: "🇪🇺", time: "10–15 Working Days", type: "Sticker Visa (VFS Appointment)", fee: 12500, docs: ["Passport (6+ months validity)", "2 Schengen-size photos", "6-month Bank Statement", "ITR / Salary Slips", "Return Flights & Hotel Bookings"], note: "We book your earliest VFS Ahmedabad slot and prepare the cover letter." },
  { id: "dubai", country: "Dubai · UAE", flag: "🇦🇪", time: "2–3 Days", type: "E-Visa (30 Days)", fee: 6200, docs: ["Passport scan", "Passport-size photo", "Aadhaar / PAN copy"], note: "Express 24-hour processing available at a small surcharge." },
  { id: "vietnam", country: "Vietnam", flag: "🇻🇳", time: "3–5 Days", type: "E-Visa (90 Days)", fee: 4200, docs: ["Passport scan", "Passport-size photo", "Hotel & Flight Itinerary"], note: "Fully digital — approval letter delivered to your WhatsApp." },
  { id: "thailand", country: "Thailand", flag: "🇹🇭", time: "3–5 Days", type: "E-Visa / Visa Exemption", fee: 3500, docs: ["Passport (6+ months)", "2 Photos", "Bank Statement", "Return Tickets"], note: "Check current visa-exemption windows — we confirm before you pay." },
  { id: "bali", country: "Bali · Indonesia", flag: "🇮🇩", time: "On Arrival (15 Min)", type: "Visa on Arrival", fee: 3000, docs: ["Passport (6+ months)", "Return Flight Ticket", "Hotel Voucher", "Customs Declaration (We Fill)"], note: "e-VOA pre-approval available so you skip the airport queue." },
  { id: "usa", country: "USA", flag: "🇺🇸", time: "30–120 Days (Interview)", type: "B1/B2 Sticker Visa", fee: 18000, docs: ["Passport + Old Passports", "DS-160 Confirmation", "Photo (2×2)", "Bank & ITR Proof", "Travel Plan"], note: "Includes DS-160 filing and mock-interview coaching." },
  { id: "uk", country: "United Kingdom", flag: "🇬🇧", time: "15–21 Working Days", type: "Standard Visitor Visa", fee: 14500, docs: ["Passport", "2 Photos", "6-month Bank Statement", "ITR (3 Years)", "Travel Itinerary"], note: "Biometric slot booking at Ahmedabad / Mumbai included." },
];

// --- Social proof ----------------------------------------------------------
export const STORIES = [
  { id: 1, image: px(34181874, 800, 1200), place: "Kashmir", name: "Shah Family", from: "Alkapuri, Vadodara", quote: "Gulmarg snow + Jain food in every meal. Kids still ask for the gondola!", views: "212K", dur: "0:24" },
  { id: 2, image: px(34201827, 800, 1200), place: "Switzerland", name: "Priya & Harsh", from: "Manjalpur, Vadodara", quote: "Our 3D itinerary preview matched the real trip frame by frame.", views: "389K", dur: "0:31" },
  { id: 3, image: px(29704361, 800, 1200), place: "Vietnam", name: "Dhruv & Nidhi", from: "Gotri, Vadodara", quote: "Golden Bridge at sunrise — the team arranged everything in 48 hrs.", views: "158K", dur: "0:18" },
  { id: 4, image: px(21701172, 800, 1200), place: "Bali", name: "Patel Family", from: "Fatehgunj, Vadodara", quote: "Private pool villa, floating breakfast, zero stress. Booked again!", views: "276K", dur: "0:27" },
];

export const GROUP_DEPARTURES = [
  { id: "g1", pkgId: "kashmir", label: "Kashmir Family Special", offsetDays: 21, seats: 6, from: "Vadodara · Train + Flight" },
  { id: "g2", pkgId: "vietnam", label: "Vietnam Group Fixed Departure", offsetDays: 34, seats: 9, from: "Ahmedabad · Direct Charter" },
  { id: "g3", pkgId: "swiss", label: "Europe Jain Tour — Chef on Board", offsetDays: 52, seats: 4, from: "Ahmedabad · Via Dubai" },
];

export function waLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
