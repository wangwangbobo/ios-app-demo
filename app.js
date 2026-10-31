/* RoamChina — interactive web edition */
(() => {
'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- icons ---------- */
const ICONS = {
  home: '<path d="M3.5 10.6 12 3.2l8.5 7.4"/><path d="M5.4 9.4V20h13.2V9.4"/><path d="M9.8 20v-5.4h4.4V20"/>',
  map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z"/><path d="M9 4v14M15 6v14"/>',
  compass: '<circle cx="12" cy="12" r="8.6"/><path d="m15.4 8.6-2 4.8-4.8 2 2-4.8 4.8-2z"/>',
  chat: '<path d="M4 5.5h16v11H9.5L4 20.5v-15z"/><path d="M8 9.5h8M8 12.8h5"/>',
  user: '<circle cx="12" cy="8.2" r="3.4"/><path d="M4.8 20c.8-4 3.6-6 7.2-6s6.4 2 7.2 6"/>',
  sparkle: '<path d="M12 2.8c.7 4.8 2.6 6.7 7.4 7.4-4.8.7-6.7 2.6-7.4 7.4-.7-4.8-2.6-6.7-7.4-7.4 4.8-.7 6.7-2.6 7.4-7.4z"/>',
  bell: '<path d="M18 9a6 6 0 0 0-12 0c0 6-2 6.5-2 8h16c0-1.5-2-2-2-8z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  back: '<path d="M15 4 7 12l8 8"/>',
  right: '<path d="m9 4 8 8-8 8"/>',
  down: '<path d="M12 3v18M6.5 15.5 12 21l5.5-5.5"/>',
  up: '<path d="M12 21V3M6.5 8.5 12 3l5.5 5.5"/>',
  arrowur: '<path d="M7 17 17 7M9 7h8v8"/>',
  arrowr: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/>',
  share: '<path d="M12 15V3M8 7l4-4 4 4"/><path d="M5 12v8h14v-8"/>',
  hand: '<path d="M8 12V5.5a1.6 1.6 0 0 1 3.2 0V11"/><path d="M11.2 10.5V4.6a1.6 1.6 0 0 1 3.2 0v6"/><path d="M14.4 10.8V6.4a1.6 1.6 0 0 1 3.2 0V14c0 4-2.6 6.5-6.2 6.5-2.6 0-4.2-1-5.4-3l-2-3.5a1.7 1.7 0 0 1 2.9-1.7L8 14"/>',
  clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.2 2"/>',
  pin: '<path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.2"/>',
  walk: '<circle cx="13.5" cy="4.5" r="1.7"/><path d="M6 21l3.4-5.4-2-3.6L9 7.8l3.4 1.4 2.2 3 3 1.4"/><path d="M11.4 12.6 9.6 17l4.8 4"/>',
  ticket: '<path d="M3.5 8.5A2 2 0 0 1 5.5 6h13a2 2 0 0 1 2 2.5 3.5 3.5 0 0 0 0 7 2 2 0 0 1-2 2.5h-13a2 2 0 0 1-2-2.5 3.5 3.5 0 0 0 0-7z"/><path d="M14 6v12" stroke-dasharray="2 2.4"/>',
  speaker: '<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="M15.5 9a4.4 4.4 0 0 1 0 6M18 6.6a7.6 7.6 0 0 1 0 10.8"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="12" rx="2"/><path d="M15.5 8.5V5.5a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
  camera: '<path d="M4 8.5h3l1.5-2.5h7L17 8.5h3v11H4z"/><circle cx="12" cy="13.5" r="3.4"/>',
  check: '<path d="M4.5 12.5 9.5 17.5 20 6.5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 15.5h6"/>',
  calendar: '<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v5M16 3v5"/>',
  heart: '<path d="M12 20.5S4 15.5 4 9.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.8c0 5.7-8 10.7-8 10.7z"/>',
  bookmark: '<path d="M6.5 3.5h11v17l-5.5-3.8-5.5 3.8z"/>',
  comment: '<path d="M4 5h16v11h-9l-4.5 4v-4H4z"/><path d="M8.5 10.5h7"/>',
  gift: '<rect x="4" y="9.5" width="16" height="11" rx="1.5"/><path d="M3 9.5h18M12 9.5V20.5"/><path d="M12 9.5S8.5 9 7.4 7.2C6 4.8 8.2 3.4 9.7 4.6c1.6 1.2 2.3 4.9 2.3 4.9zM12 9.5s3.5-.5 4.6-2.3c1.4-2.4-.8-3.8-2.3-2.6C12.7 5.8 12 9.5 12 9.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
  flame: '<path d="M12 21c3.6 0 6-2.2 6-5.4 0-4-3-5.4-3.6-9.6-.2-1.4-2-2.2-2.8-.6C9.6 9 11 10.4 10 12c-.6 1-1.4.6-1.8-.6-.3-1-1.8-1.2-2.2.2C5.5 13.4 6 21 12 21z"/>',
  coffee: '<path d="M4 8h13v6.5A4.5 4.5 0 0 1 12.5 19h-4A4.5 4.5 0 0 1 4 14.5z"/><path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17M7 3.5c-1 1.5 1 2 0 3.5M11 3.5c-1 1.5 1 2 0 3.5M3 21.5h16"/>',
  settings: '<circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z"/>',
  plane: '<path d="M3 13.5 21 4l-3 9.5-5.5 2-2 5-2.5-4.5L3 13.5z"/>',
  bed: '<path d="M3 18V7M3 13h18v5M21 18v-3M6.5 13V9.5h5V13"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.5-3 7.8-7.5 9.5-4.5-1.7-7.5-5-7.5-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  info: '<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.5M12 7.8v.4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4.5 20.5h15"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  updown: '<path d="M8 4v16M4.5 7.5 8 4l3.5 3.5M16 20V4M12.5 16.5 16 20l3.5-3.5"/>',
  move: '<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
  star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.7l6.2-.9L12 3z"/>',
  fork: '<path d="M7 3v6a2.5 2.5 0 0 0 5 0V3M9.5 11.5V21M16.5 3c-1.5 1.6-2 3.4-2 5.5 0 2 .8 2.8 2 2.8V21"/>',
  route: '<circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8.4 18H14a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c.6-3.6 3-5.4 6-5.4S14.4 16.4 15 20"/><path d="M15.5 5.5a3 3 0 0 1 0 5M17 14.8c2.3.5 3.6 2.2 4 5.2"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
  trash: '<path d="M4.5 6.5h15M9 6.5V4h6v2.5M6.5 6.5 8 21h8l1.5-14.5M10 10v7M14 10v7"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v4.5h-4.5"/>',
  wave: '<path d="M3 12c2 0 2-3 4-3s2 6 4 6 2-6 4-6 2 3 4 3"/>'
};
function icon(name, size = 16, cls = '') {
  const p = ICONS[name] || ICONS.sparkle;
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}
function sparkleIcon(size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS.sparkle}</svg>`;
}

/* ---------- data ---------- */
const STOPS = [
  { id: 's1', name: 'Tiananmen Square', time: '09:00', duration: '30 min', x: 0.49, y: 0.86, tag: 'Photo' },
  { id: 's2', name: 'Forbidden City', time: '09:40', duration: '3 hr', x: 0.52, y: 0.67, tag: 'Booked', tagStyle: 'ok' },
  { id: 's3', name: 'Jingshan Park', time: '13:00', duration: '1 hr', x: 0.57, y: 0.56, tag: 'Hilltop' },
  { id: 's4', name: 'Shichahai', time: '15:00', duration: '1.5 hr', x: 0.37, y: 0.38, tag: 'Pico pick', tagStyle: 'coral' },
  { id: 's5', name: 'Nanluoguxiang', time: '16:30', duration: '45 min', x: 0.61, y: 0.31, tag: 'Coffee' },
  { id: 's6', name: 'Drum & Bell Towers', time: '17:30', duration: '45 min', x: 0.50, y: 0.20, tag: 'Sunset' }
];

const SIMILAR = [
  { title: 'Central Axis · Classic Half Day', author: '@Ken', match: 94, stops: 6, distance: '4.2 km', duration: '~5 hr', tags: ['Classic', 'Walking', 'Sunset'], highlight: 'Shares 5 of your 6 stops, and the palace stretch runs in the same order.' },
  { title: 'Hutong Coffee Stroll · 8 stops', author: '@Lina', match: 87, stops: 8, distance: '6.4 km', duration: '~a full day', tags: ['Coffee', 'Photos', 'Easy'], highlight: 'Swaps Nanluoguxiang for three coffee stops — best if you start after lunch.' },
  { title: 'Jingshan Sunset + Shichahai by Night', author: '@Zhe', match: 79, stops: 5, distance: '3.8 km', duration: '~3 hr', tags: ['Night', 'Sunset', 'Local'], highlight: 'Keeps your Jingshan sunset, then walks back along Shichahai — one less backtrack.' }
];

const PLACES = [
  { id: 'p1', kind: 'restaurant', title: 'Siji Minfu · Forbidden City', subtitle: 'In before 11:00 · Peking duck', price: '¥150', tags: ['Family', 'Local favorite'], likes: '2.3k', symbol: 'fork', tint: 'mustard-soft', heat: 96, area: 'Dongcheng · Forbidden City', note: 'Come after three and there is barely a wait, with the skin still crisp.', bestTime: 'Before 11:00 / after 15:00' },
  { id: 'p2', kind: 'restaurant', title: 'Manhengji · Niujie', subtitle: 'Hand-cut lamb · Copper-pot hotpot', price: '¥95', tags: ['Local', 'Queues'], likes: '1.9k', symbol: 'flame', tint: 'pink-soft', heat: 93, area: 'Xicheng · Niujie', note: 'Hand-cut lamb with sesame dip — locals queue, and happily.', bestTime: 'Take a number before 17:00' },
  { id: 'p3', kind: 'restaurant', title: 'Pangmei Noodle House · Beixinqiao', subtitle: 'Chongqing noodles · Crispy pork', price: '¥45', tags: ['Local', 'Quick bite'], likes: '886', symbol: 'fork', tint: 'mint-soft', heat: 88, area: 'Dongcheng · Beixinqiao', note: 'Ask for mild heat; the crispy pork is best straight from the wok.', bestTime: 'Weekdays at 14:00' },
  { id: 'p4', kind: 'restaurant', title: 'Metal Hands · Qianmen', subtitle: 'Hutong coffee · House roast', price: '¥45', tags: ['Coffee', 'Quiet'], likes: '1.1k', symbol: 'coffee', tint: 'peri-soft', heat: 81, area: 'Dongcheng · Qianmen', note: 'A quiet café down a side alley; the afternoon light is the good part.', bestTime: '15:00–17:00' },
  { id: 'p5', kind: 'gift', title: 'Daoxiangcun · Local gift sweets', subtitle: 'Skip the tourist boxes · 8 picks', price: '¥50–120', tags: ['Gifts', 'Check-in ok'], likes: '1.7k', symbol: 'gift', tint: 'pink-soft', heat: 86, area: 'Branches across town', note: 'Loose pastries beat the gift boxes — and check the date stamp.', bestTime: 'Morning restock' },
  { id: 'p6', kind: 'gift', title: 'Palace Shop · Fridge magnets', subtitle: 'Corner tower series · Limited colors', price: '¥39', tags: ['Light', 'Limited'], likes: '604', symbol: 'sparkle', tint: 'mustard-soft', heat: 78, area: 'Forbidden City · Shenwu Gate', note: 'The corner-tower magnets sell out; buy on your way in.', bestTime: 'Within an hour of opening' },
  { id: 'p7', kind: 'gift', title: 'Tongrentang · Sour plum mix', subtitle: 'Brew a pot of old Beijing summer', price: '¥38', tags: ['Check-in ok', 'Light'], likes: '512', symbol: 'leaf', tint: 'mint-soft', heat: 74, area: 'Dongcheng · Dashilar', note: 'Brew a pot in summer — it tastes more like Beijing than anything bottled.', bestTime: 'Any time' },
  { id: 'p8', kind: 'spot', title: 'Sunset at Jingshan', subtitle: 'Up before 17:00 · Wanchun Pavilion', price: 'Free', tags: ['Sunset', 'Palace views'], likes: '3.4k', symbol: 'sun', tint: 'mustard-soft', heat: 94, area: 'Dongcheng · Jingshan', note: 'Reach Wanchun Pavilion before 17:00 for the full palace panorama.', bestTime: '40 min before sunset' },
  { id: 'p9', kind: 'spot', title: 'Temple of Heaven Park', subtitle: 'Echo Wall · Old cypresses, Prayer Hall', price: '¥34', tags: ['Architecture', 'Quiet'], likes: '2.8k', symbol: 'building', tint: 'peri-soft', heat: 90, area: 'Dongcheng · Temple of Heaven', note: 'Enter by the south gate; the Echo Wall is best when it is quiet.', bestTime: 'An hour after opening' },
  { id: 'p10', kind: 'spot', title: 'Beihai Park', subtitle: 'Boat out to the White Dagoba · Family friendly', price: '¥10', tags: ['Family', 'Boating'], likes: '2.1k', symbol: 'wave', tint: 'sky-soft', heat: 82, area: 'Xicheng · Beihai', note: 'Rent a boat — the White Dagoba looks best from the water.', bestTime: 'After 15:00' }
];

const EVENTS = [
  { id: 'e1', title: 'Hutong Night Market · Free entry', subtitle: 'Handmade goods, vinyl and snacks from local stalls', date: '10/18 Sat', time: '18:00 – 22:00', place: 'Drum & Bell Towers square · 35 min from hotel', host: '@RoamChina Community', fee: 'Free', attendees: 128, tint: 'coral' },
  { id: 'e2', title: 'BaiTa Temple Flea Market', subtitle: 'Old cameras, secondhand books and pour-over coffee, run by local collectors', date: '11/01 Sat', time: '13:00 – 19:00', place: 'BaiTa Temple east alley · 20 min from hotel', host: '@Hutong Archive', fee: 'Free', attendees: 64, tint: 'mustard' },
  { id: 'e3', title: 'Central Axis Night Ride · BYO bike', subtitle: 'From Yongdingmen to the Drum & Bell Towers, with gate stories from the lead', date: '11/02 Sun', time: '19:00', place: 'Yongdingmen Park, north gate', host: '@Ken', fee: '¥20', attendees: 37, tint: 'peri' }
];

const ATTRACTIONS = [
  { id: 'a1', name: 'Forbidden City', date: '10/15', week: 'Wed', time: '09:00', people: '2 guests', price: '¥120', booked: true, code: 'RC-8821', note: 'In at Meridian Gate · out at Shenwu Gate' },
  { id: 'a2', name: 'Badaling Great Wall', date: '10/16', week: 'Thu', time: '08:30', people: '2 guests', price: '¥80', booked: false, note: 'ID required · cable car extra' },
  { id: 'a3', name: 'Summer Palace', date: '10/17', week: 'Fri', time: '09:00', people: '2 guests', price: '¥60', booked: false, note: 'Combined ticket · East Palace Gate is easiest' },
  { id: 'a4', name: 'National Museum of China', date: '10/17', week: 'Fri', time: '14:00', people: '2 guests', price: 'Free', booked: false, note: 'Real-name booking in advance' }
];

const TRIP_PLANS = [
  {
    date: '10/15', week: 'Wed', day: 1, title: 'Central Axis · Palace and Hutongs',
    meta: '6 stops · 4.2 km · ~5 hr', tag: 'Today', tagStyle: 'coral',
    stops: [
      { name: 'Tiananmen Square', time: '09:00' }, { name: 'Forbidden City', time: '09:40' },
      { name: 'Jingshan, Wanchun Pavilion', time: '12:30' }, { name: 'Shichahai', time: '15:00' },
      { name: 'Nanluoguxiang', time: '16:30' }, { name: 'Drum & Bell Towers', time: '17:30' }
    ],
    note: 'Forbidden City booked for 09:00 · in at Meridian Gate, out at Shenwu Gate'
  },
  {
    date: '10/16', week: 'Thu', day: 2, title: 'Great Wall Day · Badaling',
    meta: '3 stops · private car both ways · ~full day', tag: 'Car booked', tagStyle: 'blue',
    stops: [
      { name: 'Leave the hotel', time: '07:30' }, { name: 'Badaling Great Wall', time: '09:00' },
      { name: 'Olympic Forest Park', time: '16:30' }
    ],
    note: 'Bring your passport · it is windy up there, pack an extra layer'
  },
  {
    date: '10/17', week: 'Fri', day: 3, title: 'Imperial Gardens · Palace & Museum',
    meta: '4 stops · Metro Line 4 · ~8 hr', tag: 'Tickets to book', tagStyle: 'soft',
    stops: [
      { name: 'Summer Palace', time: '09:00' }, { name: 'Lunch in Wudaokou', time: '12:30' },
      { name: 'National Museum of China', time: '14:00' }, { name: 'Qianmen Street', time: '18:00' }
    ],
    note: 'The National Museum needs a real-name booking — bring your passport'
  },
  {
    date: '10/18', week: 'Sat', day: 4, title: 'Slow Hutongs · Departure',
    meta: '4 stops · 3.1 km on foot · ~4 hr', tag: 'Departure', tagStyle: 'ok',
    stops: [
      { name: 'Nanluoguxiang', time: '09:30' }, { name: 'Drum & Bell Towers', time: '11:00' },
      { name: 'Daoxiangcun run', time: '13:00' }, { name: 'Beijing Capital Airport', time: '16:00' }
    ],
    note: 'Flight at 18:40 · be at the airport 2.5 hr ahead'
  }
];

/* travel-style check on the trip page */
const QUIZ = [
  { key: 'days', label: 'How many days do you like?', options: ['2–3 days', '4–5 days', '6+ days'] },
  { key: 'style', label: 'Your kind of holiday', options: ['Slow culture', 'Food first', 'Outdoors', 'Night owl'] },
  { key: 'theme', label: 'A theme, or none?', options: ['Imperial history', 'Hutongs & coffee', 'Art & design', 'No theme'] }
];

function quizPersona() {
  const q = S.quiz;
  if (!q.days || !q.style || !q.theme) return null;
  const titles = {
    'Slow culture': { title: 'The Slow Culture Wanderer', icon: 'compass' },
    'Food first': { title: 'The Table-First Wanderer', icon: 'fork' },
    'Outdoors': { title: 'The Open-Air Rambler', icon: 'walk' },
    'Night owl': { title: 'The After-Dark Flâneur', icon: 'star' }
  };
  const base = titles[q.style] || titles['Slow culture'];
  const fit = q.theme === 'Imperial history' || q.theme === 'Hutongs & coffee' ? 'Central Axis' : 'Imperial Gardens';
  return { ...base, meta: `${q.days} · ${q.style} · ${q.theme}`, fit };
}

/* archived trip reports — the fun end-of-journey wrap-up */
const JOURNEYS = [
  {
    id: 'chengdu', city: 'Chengdu', dates: 'Mar 2026', color: 'mint',
    title: 'The Bamboo Teahouse Wanderer',
    blurb: 'Five days of teahouses, chilli oil and one very long bamboo walk. You never once took a taxi before noon.',
    places: 14, newPlaces: 11, km: 38.4, rare: 'Wangjianglou bamboo grove', rarePct: 3.2, rank: 12,
    stamps: ['Tea house', 'Chilli', 'Bamboo'],
    rarities: [
      { name: 'Wangjianglou bamboo grove', pct: 3.2 },
      { name: "Yu's Bakery back lane", pct: 7.8 },
      { name: "People's Park teahouse", pct: 28 },
      { name: 'Wenshu Monastery', pct: 54 },
      { name: 'Kuanzhai Alley', pct: 81 }
    ]
  },
  {
    id: 'shanghai', city: 'Shanghai', dates: 'Nov 2025', color: 'pink',
    title: 'The Lane Flâneur',
    blurb: 'Four days of art deco lanes, midnight noodles and a ferry you took three times for the view.',
    places: 12, newPlaces: 9, km: 41.2, rare: 'Zhangyuan lane houses', rarePct: 6.8, rank: 18,
    stamps: ['Lanes', 'Art deco', 'Night ferry'],
    rarities: [
      { name: 'Zhangyuan lane houses', pct: 6.8 },
      { name: 'Yangjing snack street', pct: 11 },
      { name: 'West Bund galleries', pct: 34 },
      { name: 'Wukang Road', pct: 62 },
      { name: 'The Bund', pct: 94 }
    ]
  }
];


const PHRASES = [
  { zh: '请问最近的地铁站怎么走？', en: 'Where is the nearest subway station?', scenario: 'route' },
  { zh: '我迷路了，能帮我看看地图吗？', en: "I'm lost. Could you help me read the map?", scenario: 'route' },
  { zh: '我对花生过敏，请确认这道菜不含花生。', en: 'I am allergic to peanuts. Does this dish contain any?', scenario: 'dining' },
  { zh: '可以刷卡吗？', en: 'Can I pay by card?', scenario: 'dining' },
  { zh: '我食物过敏，需要去医院。', en: 'I have a food allergy and need a hospital.', scenario: 'medical' },
  { zh: '请帮我叫一辆救护车。', en: 'Please call an ambulance for me.', scenario: 'medical' },
  { zh: '我对青霉素过敏。', en: 'I am allergic to penicillin.', scenario: 'medical' },
  { zh: '这是我正在服用的药。', en: 'This is the medication I am taking.', scenario: 'medical' },
  { zh: '请带我去这个地址。', en: 'Please take me to this address.', scenario: 'taxi' },
  { zh: '大概需要多长时间？', en: 'How long will it take?', scenario: 'taxi' },
  { zh: '这个多少钱？', en: 'How much is this?', scenario: 'shopping' },
  { zh: '可以退税吗？', en: 'Can I get a tax refund?', scenario: 'shopping' },
  { zh: '请帮我报警。', en: 'Please help me call the police.', scenario: 'emergency' },
  { zh: '我需要中文翻译帮助。', en: 'I need help from a Chinese interpreter.', scenario: 'emergency' }
];

const CHECKLIST = [
  { id: 'c1', title: 'Passport valid 6+ months', meta: 'Confirmed · expires 2027/03', cat: 'Documents', phase: 'Before you fly', status: 'done', right: 'Verified' },
  { id: 'c2', title: 'Flights & hotel', meta: 'Ticketed · 3 nights in Wangfujing', cat: 'Documents', phase: 'Before you fly', status: 'done', right: 'View' },
  { id: 'c3', title: 'Travel insurance · Active', meta: 'Allianz · ¥800k cover', cat: 'Documents', phase: 'Before you fly', status: 'done', right: 'Active' },
  { id: 'c4', title: 'Forbidden City · 10/15 09:00', meta: '2 adults · ¥120 · 812 left', cat: 'Tickets', phase: 'Before you fly', status: 'action', action: 'Book now', tag: 'Filling up', tone: 'warn' },
  { id: 'c5', title: 'Great Wall · 10/16 08:30', meta: 'Badaling · cable car needs booking', cat: 'Tickets', phase: 'Before you fly', status: 'action', action: 'Book', tag: 'To book', tone: 'soft' },
  { id: 'c6', title: 'Summer Palace · 10/17 09:00', meta: 'Combined ticket ¥60 / person', cat: 'Tickets', phase: 'Before you fly', status: 'todo', action: 'Buy tickets' },
  { id: 'c7', title: 'National Museum · 10/17 14:00', meta: 'Free · real-name booking', cat: 'Tickets', phase: 'Before you fly', status: 'todo', action: 'Book' },
  { id: 'c8', title: 'eSIM / Chinese number', meta: '3 plans compared · from ¥29', cat: 'Connectivity', phase: 'Arrival day', status: 'action', action: 'Pick a plan' },
  { id: 'c9', title: 'VPN', meta: 'Not on the local app stores', cat: 'Connectivity', phase: 'Arrival day', status: 'action', action: 'How-to', tag: 'Install early', tone: 'warn' },
  { id: 'c10', title: 'Offline maps & phrasebook', meta: 'Beijing · 86 emergency phrases', cat: 'Connectivity', phase: 'Arrival day', status: 'done', right: 'Downloaded' },
  { id: 'c11', title: 'Alipay / WeChat Pay', meta: 'VISA linked · up to ¥5,000 per payment', cat: 'Transit', phase: 'Arrival day', status: 'done', right: 'Done' },
  { id: 'c12', title: 'Transit card / metro QR', meta: 'Apple Wallet · activated', cat: 'Transit', phase: 'Arrival day', status: 'done', right: 'Active' }
];

const LIVE = [
  { zh: '你好，请问最近的地铁站怎么走？', en: 'Hello, where is the nearest subway station?', mine: false },
  { zh: '直走两个路口，在红绿灯处左转。', en: 'Go straight for two blocks, then turn left at the lights.', mine: true }
];

const MENU = [
  { zh: '炸酱面', en: 'Zhajiang noodles', price: '¥28' },
  { zh: '卤煮火烧', en: 'Pork offal stew', price: '¥35' },
  { zh: '豆汁儿', en: 'Fermented bean drink', price: '¥8' },
  { zh: '焦圈', en: 'Fried dough ring', price: '¥3' }
];
const SIGN = [
  { zh: '南锣鼓巷', en: 'Nanluoguxiang Alley', price: '北' },
  { zh: '什刹海', en: 'Shichahai Lake', price: '800m' },
  { zh: '地铁 6 号线', en: 'Metro Line 6', price: '→' }
];

/* ---------- state ---------- */
const S = {
  tab: 'trip',
  lastTab: 'trip',
  stops: STOPS.map((s) => ({ ...s })),
  selected: null,
  editMode: false,
  layer: 'mine',
  routeName: 'Central Axis · Draft',
  aiVisible: true,
  expandedPlan: 0,
  quiz: { days: null, style: null, theme: null },
  applied: false,
  forumChannel: null,
  forumFilter: 'all',
  search: '',
  userPosts: [],
  savedPosts: new Set(),
  events: EVENTS.map((e) => ({ ...e })),
  joined: new Set(['e1']),
  saved: new Set(),
  attractions: ATTRACTIONS.map((a) => ({ ...a })),
  showBookings: false,
  translateMode: 'live',
  scenario: 'medical',
  live: LIVE.map((m) => ({ ...m })),
  listening: false,
  flipped: false,
  photoSample: 'menu',
  photoScanning: false,
  photoScanned: false,
  notes: false,
  sheet: null,
  sheetData: null,
  checklist: CHECKLIST.map((c) => ({ ...c })),
  checklistCat: 'All',
  notifications: true,
  autoplay: false,
  assistantContext: 'Trip · 10/15 Forbidden City',
  messages: [{ role: 'assistant', text: "I'm here. Ask me about your route, tickets, translation or checklist." }],
  thinking: false,
  draft: { title: '', date: '11/08 Sat', time: '14:00 – 18:00', place: '', fee: 'Free', note: '' },
  toastTimer: null,
  scanTimer: null,
  micTimer: null,
  chatTimer: null
};

/* ---------- helpers ---------- */
function toast(text, iconName = 'check') {
  const el = $('#toast');
  el.innerHTML = `${icon(iconName, 13)}<span>${esc(text)}</span>`;
  el.classList.add('show');
  clearTimeout(S.toastTimer);
  S.toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
}
function doneCount() { return S.checklist.filter((c) => c.status === 'done').length; }
function progressPct() { return Math.round((doneCount() / S.checklist.length) * 100); }
function ring(progress, size = 42, width = 3.6, tint = 'var(--ink)', track = 'rgba(25,23,16,.16)', label = `${Math.round(progress * 100)}%`) {
  const r = (size - width) / 2;
  const c = 2 * Math.PI * r;
  return `<div class="ring" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${width}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${tint}" stroke-width="${width}"
        stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - progress)}" stroke-linecap="round"/>
    </svg><span>${label}</span></div>`;
}
function tag(text, style = 'soft') {
  return `<span class="tag ${style}">${esc(text)}</span>`;
}
function placeById(id) { return PLACES.find((p) => p.id === id); }
function routePathD(stops = S.stops) {
  const pts = stops.map((s) => [s.x * 100, s.y * 100]);
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]; const b = pts[i];
    const mx = ((a[0] + b[0]) / 2).toFixed(2);
    const my = ((a[1] + b[1]) / 2).toFixed(2);
    d += ` Q ${a[0].toFixed(2)} ${a[1].toFixed(2)} ${mx} ${my}`;
  }
  d += ` L ${pts[pts.length - 1][0].toFixed(2)} ${pts[pts.length - 1][1].toFixed(2)}`;
  return d;
}
function miniMap(stops = S.stops, tint = 'var(--coral)') {
  const pts = stops.map((s) => `${(s.x * 100).toFixed(1)},${(s.y * 100).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <rect width="100" height="100" fill="var(--sky-soft)"/>
    <path d="M12 0v100M54 0v100M0 62h100M0 24h100" stroke="rgba(255,252,242,.9)" stroke-width="7"/>
    <path d="M12 0v100M54 0v100M0 62h100M0 24h100" stroke="rgba(207,192,165,.9)" stroke-width="1"/>
    <rect x="14" y="26" width="36" height="34" rx="8" fill="var(--mint)" stroke="rgba(25,23,16,.5)" stroke-width="1"/>
    <rect x="58" y="66" width="38" height="30" rx="8" fill="var(--lime-soft)" stroke="rgba(25,23,16,.4)" stroke-width="1"/>
    <polyline points="${pts}" fill="none" stroke="rgba(25,23,16,.75)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
    <polyline points="${pts}" fill="none" stroke="${tint}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  </svg>`;
}
function cityscape() {
  return `<svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <rect width="360" height="200" fill="var(--sky-soft)"/>
    <circle cx="286" cy="48" r="22" fill="var(--mustard)" stroke="var(--ink)" stroke-width="1.4"/>
    <g stroke="var(--ink)" stroke-width="1.3" fill="var(--paper)">
      <path d="M52 42c10-9 24-9 34 0 10-7 23-4 27 6H40c1-6 5-9 12-6z"/>
    </g>
    <path d="M0 158h360v42H0z" fill="var(--mint)" stroke="var(--ink)" stroke-width="1.2"/>
    <g stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round">
      <path d="M28 158v-30h66v30" fill="var(--mustard-soft)"/>
      <path d="M22 126h78l-7-10H29z" fill="var(--coral)"/>
      <path d="M40 140h14v18H40zM68 140h14v18H68z" fill="var(--paper)"/>
      <path d="M122 158v-38h92v38" fill="var(--paper)"/>
      <path d="M114 118h108l-9-12H123z" fill="var(--coral)"/>
      <path d="M138 132h18v26h-18zM174 132h18v26h-18z" fill="var(--sky)"/>
      <path d="M248 158v-44h74v44" fill="var(--paper-warm)"/>
      <path d="M240 112h90l-8-13h-74z" fill="var(--coral)"/>
      <path d="M264 126h16v32h-16zM294 126h16v32h-16z" fill="var(--sky)"/>
    </g>
    <g stroke="var(--ink)" stroke-width="1.2">
      <path d="M14 158V96M346 158V88" stroke-width="2"/>
      <path d="M4 100h26M330 92h30" stroke="var(--coral)"/>
      <circle cx="60" cy="168" r="4" fill="var(--olive)"/>
      <circle cx="302" cy="172" r="5" fill="var(--olive)"/>
    </g>
    <g fill="var(--paper)" opacity=".85">
      <path d="M96 54c7-6 16-6 23 0z" stroke="var(--ink)" stroke-width="1"/>
      <path d="M198 34c6-5 14-5 20 0z" stroke="var(--ink)" stroke-width="1"/>
    </g>
  </svg>`;
}
function mapBase() {
  let blocks = '';
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 5; col++) {
      const w = 390 / 5 - 15;
      const h = 460 / 10 - 20;
      const x = col * (390 / 5) + 7.5;
      const y = row * (460 / 10) + 10;
      blocks += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="rgba(244,236,220,.5)" stroke="rgba(230,217,194,.85)" stroke-width=".7"/>`;
    }
  }
  return `<svg class="map-base" viewBox="0 0 390 460" preserveAspectRatio="none" aria-hidden="true">
    <rect width="390" height="460" fill="var(--paper)"/>
    ${blocks}
    <rect x="5" y="55" width="140" height="106" rx="28" fill="var(--mint)" stroke="rgba(25,23,16,.5)" stroke-width="1"/>
    <rect x="23" y="71" width="82" height="44" rx="20" fill="var(--sky)" stroke="rgba(25,23,16,.5)" stroke-width="1"/>
    <rect x="242" y="271" width="144" height="101" rx="26" fill="var(--lime-soft)" stroke="rgba(25,23,16,.45)" stroke-width="1"/>
    <g fill="var(--olive)" stroke="rgba(25,23,16,.7)" stroke-width=".8">
      <circle cx="22" cy="76" r="3.7"/><circle cx="46" cy="76" r="3.7"/><circle cx="70" cy="76" r="3.7"/><circle cx="94" cy="76" r="3.7"/>
      <circle cx="22" cy="100" r="3.7"/><circle cx="46" cy="100" r="3.7"/><circle cx="70" cy="100" r="3.7"/>
      <circle cx="256" cy="306" r="3.7"/><circle cx="280" cy="306" r="3.7"/><circle cx="304" cy="306" r="3.7"/>
    </g>
    <g stroke="var(--cream)" stroke-width="13" stroke-linecap="round">
      <path d="M187 0 211 460"/><path d="M0 258 390 221"/><path d="M0 110 390 156"/>
    </g>
    <g stroke="rgba(207,192,165,.85)" stroke-width="1" stroke-linecap="round">
      <path d="M187 0 211 460"/><path d="M0 258 390 221"/><path d="M0 110 390 156"/>
    </g>
    <g stroke="var(--paper)" stroke-width="6" stroke-linecap="round">
      <path d="M70 0 47 460"/><path d="M312 0 296 460"/><path d="M0 340 390 304"/>
    </g>
    <g stroke="rgba(207,192,165,.7)" stroke-width="1" stroke-linecap="round">
      <path d="M70 0 47 460"/><path d="M312 0 296 460"/><path d="M0 340 390 304"/>
    </g>
  </svg>`;
}

/* ---------- shell render ---------- */
const TABS = [
  { id: 'trip', label: 'Trip', icon: 'home', badge: 0 },
  { id: 'plan', label: 'Plan', icon: 'map', badge: 1 },
  { id: 'forum', label: 'Community', icon: 'compass', badge: 0 },
  { id: 'translate', label: 'Translate', icon: 'chat', badge: 0 },
  { id: 'me', label: 'Me', icon: 'user', badge: 0 }
];
const TAB_CTX = {
  trip: 'Trip · 10/15 Forbidden City',
  plan: 'Plan · Central Axis',
  forum: 'Community · Food & routes',
  translate: 'Translate · Emergency phrases',
  me: 'Me · Bookings & offline packs'
};

function renderDock() {
  $('#dock').innerHTML = TABS.map((t) => `
    <button class="tab ${S.tab === t.id ? 'active' : ''}" data-act="tab" data-tab="${t.id}" aria-label="${t.label}" aria-current="${S.tab === t.id ? 'page' : 'false'}">
      ${icon(t.icon, 18)}<span>${t.label}</span>
      ${t.badge ? '<i class="badge" aria-hidden="true"></i>' : ''}
    </button>`).join('') + `
    <button class="orb" data-act="assistant" data-ctx="${TAB_CTX[S.tab]}" aria-label="Ask Pico">${sparkleIcon(21)}</button>`;
}

const screens = {
  trip: tripView,
  plan: planView,
  forum: forumView,
  translate: translateView,
  me: meView
};

function render(resetScroll = false) {
  const v = $('#view');
  const old = v.scrollTop;
  v.innerHTML = `<div class="screen ${S.tab === 'plan' ? 'fill' : ''}">${screens[S.tab]()}</div>`;
  if (S.tab !== S.lastTab || resetScroll) v.scrollTop = 0;
  else v.scrollTop = old;
  S.lastTab = S.tab;
  renderDock();
  if (S.sheet) renderSheet();
  if (S.tab === 'plan') initMapDrag();
  updateHash();
}

function updateHash() {
  const h = '#' + S.tab + (S.tab === 'forum' && S.forumChannel ? '-' + S.forumChannel : '');
  if (location.hash !== h) history.replaceState(null, '', h);
}

function go(tab, channel = null) {
  if (S.micTimer) { clearTimeout(S.micTimer); S.micTimer = null; S.listening = false; }
  S.tab = tab;
  S.forumChannel = channel;
  if (tab !== 'translate') S.listening = false;
  render(true);
}

/* ================= TRIP ================= */
function tripView() {
  return `
    <header class="top">
      <div>
        <div class="eyebrow"><span class="eyebrow-line"></span>My trip / BEIJING ${sparkleIcon(8)}</div>
        <div class="h1row"><div class="h1">Beijing</div>${tag('4 days, 3 nights', 'coral')}</div>
        <div class="meta">10/15 – 10/18 · 2 travelers</div>
      </div>
      <div class="top-right">
        <div class="row">
          <button class="icon-btn" data-act="assistant" data-ctx="Trip · Notifications and reminders" aria-label="Notifications">${icon('bell', 15)}</button>
          <div class="avatar">W</div>
        </div>
        <div class="meta">Today · Day 1</div>
      </div>
    </header>

    <div class="section-title" style="margin-top:18px">
      <div class="st-left"><span class="idx">01</span><h2>Today at a glance</h2></div>
      <span class="today-date">10/15 · Wed</span>
    </div>

    <article class="card today-card">
      <div class="cityscape">
        <img class="today-photo" src="img/trip/today-hero.jpg" alt="Hall of Supreme Harmony at the Forbidden City, Beijing" loading="lazy">
        <div class="scene-chips">
          <span class="weather">${icon('sun', 12)}22° <small>Clear · 11–22°</small></span>
          ${tag('Today · Day 1 of 4', 'dark')}
        </div>
        <span class="photo-credit">Hall of Supreme Harmony · Photo N509FZ / CC BY-SA 4.0</span>
      </div>
      <div class="hero-foot">
        <div class="grow">
          <div class="h3">Central Axis · Palace and Hutongs</div>
          <div class="mini">
            <span>${icon('pin', 9)} 6 stops</span>
            <span>${icon('walk', 9)} 4.2 km</span>
            <span>${icon('clock', 9)} ~5 hr</span>
          </div>
        </div>
        <button class="round-lime" data-act="tab" data-tab="plan" aria-label="Open map">${icon('arrowur', 14)}</button>
      </div>
      <div class="today-facts">
        <button class="fact" data-act="assistant" data-ctx="Tickets · Forbidden City 10/15 09:00">
          ${icon('ticket', 11)}<span><b>Palace 09:00</b><small>Booked · Meridian Gate</small></span>
        </button>
        <button class="fact" data-act="assistant" data-ctx="Weather · Beijing 10/15">
          ${icon('sun', 11)}<span><b>11° – 22°</b><small>Chilly mornings</small></span>
        </button>
        <button class="fact" data-act="assistant" data-ctx="Trip · sunset today 17:18">
          ${icon('clock', 11)}<span><b>Sunset 17:18</b><small>Wanchun Pavilion</small></span>
        </button>
      </div>
    </article>

    <div class="section-title">
      <div class="st-left"><span class="idx">02</span><h2>Travel style check</h2></div>
      <span class="meta">${quizAnswered()} / 3 answered</span>
    </div>
    ${quizCard()}

    <div class="section-title">
      <div class="st-left"><span class="idx">03</span><h2>Your days</h2></div>
      <button class="link" data-act="assistant" data-ctx="Trip · Adjust the plan">Ask Pico ${icon('arrowur', 8)}</button>
    </div>

    <div class="trip-plans">
      ${TRIP_PLANS.map((p, i) => tripPlanCard(p, i)).join('')}
    </div>`;
}

function quizAnswered() {
  return QUIZ.filter((q) => S.quiz[q.key]).length;
}

function quizCard() {
  const persona = quizPersona();
  return `<article class="card quiz-card${persona ? ' done' : ''}">
    <div class="quiz-top">
      <span class="quiz-badge">${icon('sparkle', 10)} Trip match</span>
      ${persona
        ? `<button class="quiz-retake" data-act="quiz-reset">Retake ${icon('arrowur', 7)}</button>`
        : `<span class="quiz-hintline">Answer all three for your title</span>`}
    </div>
    ${persona
      ? `<div class="quiz-result">
          <span class="qr-ico">${icon(persona.icon, 14)}</span>
          <span class="grow"><small>YOUR TRAVEL TITLE</small><b>${esc(persona.title)}</b><em>${esc(persona.meta)}</em></span>
          <button class="qr-go" data-act="tab" data-tab="plan">${icon('map', 9)}${esc(persona.fit)}</button>
        </div>`
      : `${QUIZ.map((q) => `<div class="quiz-q">
          <div class="quiz-label">${esc(q.label)}</div>
          <div class="quiz-opts">
            ${q.options.map((o) => `<button class="qchip ${S.quiz[q.key] === o ? 'on' : ''}" data-act="quiz" data-key="${q.key}" data-val="${esc(o)}" aria-pressed="${S.quiz[q.key] === o}">${esc(o)}</button>`).join('')}
          </div>
        </div>`).join('')}
        <div class="quiz-empty">${icon('info', 9)} Pick one per question — it only changes your suggestion, never the plan.</div>`}
  </article>`;
}

function tripPlanCard(p, index) {
  const open = S.expandedPlan === index;
  return `<article class="trip-plan ${open ? 'open' : ''}">
    <button class="tp-head" data-act="toggle-trip-plan" data-index="${index}" aria-expanded="${open}">
      <span class="tp-date"><b>${p.date}</b><small>${p.week}</small></span>
      <span class="tp-main">
        <span class="rowline"><span class="day">DAY ${String(p.day).padStart(2, '0')}</span>${tag(p.tag, p.tagStyle)}</span>
        <span class="tp-title">${esc(p.title)}</span>
        <span class="meta">${esc(p.meta)}</span>
      </span>
      <span class="tp-chev">${icon('right', 8)}</span>
    </button>
    ${open ? `<div class="tp-body">
      <div class="tp-stops">${p.stops.map((s) => `<div class="tp-stop"><i></i><b>${esc(s.name)}</b><span>${esc(s.time)}</span></div>`).join('')}</div>
      <div class="tp-note">${esc(p.note)}</div>
      <div class="tp-foot">
        <button class="tp-open" data-act="tab" data-tab="plan">Open map ${icon('arrowur', 8)}</button>
        <button class="tp-open ghost" data-act="assistant" data-ctx="Trip · ${esc(p.title)}">Ask Pico ${sparkleIcon(8)}</button>
        <span class="tp-hint">${p.stops.length} stops</span>
      </div>
    </div>` : ''}
  </article>`;
}

function foodArt(bg) {
  return `<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="90" fill="${bg}" opacity=".55"/>
    <circle cx="80" cy="48" r="27" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>
    <circle cx="80" cy="48" r="18" fill="var(--mustard-soft)" stroke="var(--ink)" stroke-width="1"/>
    <path d="M68 44c5-6 19-6 24 0M70 52h20" stroke="var(--ink)" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M42 16v16M38 16v10M46 16v10M42 32v42" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M120 18c-4 4-6 9-6 14h10c0-5-2-10-6-14zM120 32v40" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>`;
}
function sunsetArt() {
  return `<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="90" fill="var(--mustard-soft)"/>
    <circle cx="112" cy="36" r="17" fill="var(--coral)" stroke="var(--ink)" stroke-width="1.3"/>
    <path d="M0 74c26-16 44 2 68-9 22-10 40 5 92-8v33H0z" fill="var(--mint)" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M0 82c30-6 58 5 84 0s45-6 76 2" fill="none" stroke="var(--olive)" stroke-width="1.5"/>
    <path d="M30 74V47h20v27M42 47l-9-9h20z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M120 30h14M124 37h9" stroke="var(--ink)" stroke-width="1.1" stroke-linecap="round"/>
  </svg>`;
}

/* ================= PLAN ================= */
function planView() {
  const stops = S.stops;
  return `<div class="plan">
    <div class="map">
      ${mapBase()}
      <div class="map-wash"></div>
      <span class="map-label" style="left:20%;top:31%">Shichahai</span>
      <span class="map-label" style="left:71%;top:27%">Nanluoguxiang</span>
      <span class="map-label" style="left:68%;top:50%">Forbidden City</span>
      <span class="map-label" style="left:71%;top:40%">Jingshan</span>
      ${collaborator('Lina', 'left:74%;top:33%')}
      ${collaborator('Zhou', 'left:27%;top:58%', true)}
      <div class="map-body" id="mapBody">
        ${communityOverlay()}
        ${crowdOverlay()}
        <svg class="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="${routePathD()}" fill="none" stroke="var(--ink)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
          <path d="${routePathD()}" fill="none" stroke="var(--coral)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
        </svg>
        ${stops.map((s, i) => pinHTML(s, i)).join('')}
      </div>
      ${S.editMode ? `<div class="map-hint">${icon('hand', 9)} ${icon('move', 8)} Drag a numbered dot — the route recalculates</div>` : ''}
    </div>

    <header class="plan-head">
      <div class="spread" style="align-items:flex-start">
        <div>
          <div class="eyebrow"><span class="eyebrow-line"></span>My plan / CITYWALK <span class="tag lime" style="transform:rotate(3deg)">DAY 02</span></div>
          <div class="name">${esc(S.routeName)}</div>
          <div class="meta">${stops.length} stops · 4.2 km · ~5 hr</div>
        </div>
        <div class="plan-head-right">
          <button class="plan-note" data-act="notes">${icon('doc', 10)}Make a note</button>
          <div class="row" style="justify-content:flex-end;gap:6px">
            <div class="avatar-stack"><div class="avatar sm">L</div><div class="avatar sm pink">Z</div></div>
            <button class="icon-btn" data-act="share-route" aria-label="Share route" style="width:31px;height:31px">${icon('share', 13)}</button>
          </div>
        </div>
      </div>
      <div class="chips">
        <button class="chip ${S.layer === 'mine' ? 'on' : ''}" data-act="layer" data-layer="mine">My route</button>
        <button class="chip ${S.layer === 'community' ? 'on' : ''}" data-act="layer" data-layer="community">Community 3</button>
        <button class="chip ${S.layer === 'crowd' ? 'on' : ''}" data-act="layer" data-layer="crowd">Crowds</button>
        ${S.editMode ? `<span class="chip lime" style="margin-left:auto">${icon('hand', 9)} Drag stops</span>` : ''}
      </div>
    </header>

    <div class="plan-panel">
      <div class="grab"></div>
      <div class="panel-top">
        <div>
          <h3>${stops.length} stops · 4.2 km</h3>
          <div class="meta">${S.editMode ? 'Drag the numbered dots · route updates live' : '~5 hr · walk + metro'}</div>
        </div>
        <div class="actions">
          <button class="small-chip ${S.editMode ? 'on' : ''}" data-act="toggle-edit">${icon(S.editMode ? 'check' : 'hand', 9)}${S.editMode ? 'Done' : 'Adjust stops'}</button>
          <button class="small-chip" data-act="reorder">${icon('updown', 9)}Reorder</button>
        </div>
      </div>

      ${S.aiVisible && !S.editMode ? `
      <div class="ai-bar">
        <span class="spark">${sparkleIcon(10)}</span>
        <span>Pico: move Shichahai to 13:00</span>
        <span class="note">1.2 km less</span>
        <button data-act="apply-ai">Apply</button>
      </div>` : ''}

      <div class="stops" id="stopList">
        ${stops.map((s, i) => stopRowHTML(s, i)).join('')}
      </div>

      <div class="panel-actions">
        <button class="pa dashed" data-act="assistant" data-ctx="Plan · Add a place">${icon('plus', 10)}Add place</button>
        <button class="pa lime" data-act="similar">${icon('layers', 10)}Similar routes</button>
      </div>
    </div>
  </div>`;
}

function collaborator(name, pos, lime = false) {
  return `<div class="collab ${lime ? 'lime' : ''}" style="${pos};opacity:${S.layer === 'community' ? 1 : .55}">
    <svg viewBox="0 0 24 24" fill="var(--ink)"><path d="M5 3l14 9-6 1.5L10 20z"/></svg>
    <span>${name}</span>
  </div>`;
}
function pinHTML(stop, index) {
  const selected = S.selected === stop.id;
  return `<button class="pin ${selected ? 'selected' : ''} ${S.editMode ? 'edit' : ''}" style="left:${stop.x * 100}%;top:${stop.y * 100}%"
    data-pin="${stop.id}" data-act="${S.editMode ? 'noop' : 'select-stop'}" data-id="${stop.id}" aria-label="${esc(stop.name)}">
    ${index + 1}
    ${S.editMode ? `<span class="move">${icon('move', 7)}</span>` : ''}
  </button>
  ${selected ? `<div class="pin-label" style="left:${stop.x * 100}%;top:${stop.y * 100}%"><b>${esc(stop.name)}</b><span>${esc(stop.time)}</span></div>` : ''}`;
}
function stopRowHTML(stop, index) {
  const colors = ['var(--mustard)', 'var(--pink)', 'var(--mint)', 'var(--peri)', 'var(--lime)', 'var(--sky)'];
  const selected = S.selected === stop.id;
  return `<button class="stop-row ${selected ? 'on' : ''}" data-act="select-stop" data-id="${stop.id}">
    <span class="time">${esc(stop.time)}</span>
    <span class="num" style="background:${colors[index % colors.length]}">${index + 1}</span>
    <span class="info"><b>${esc(stop.name)} ${stop.tag ? tag(stop.tag, stop.tagStyle || 'soft') : ''}</b><small>${esc(stop.duration)} · 6 min walk</small></span>
    <span class="grip">${icon(selected ? 'arrowur' : 'sliders', 10)}</span>
  </button>`;
}
function communityOverlay() {
  if (S.layer !== 'community') return '';
  const altA = [[.22,.82],[.30,.58],[.46,.40],[.66,.22]].map(([x,y]) => `${x*100},${y*100}`).join(' ');
  const altB = [[.76,.80],[.68,.58],[.56,.46],[.38,.20]].map(([x,y]) => `${x*100},${y*100}`).join(' ');
  return `<svg class="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="${altA}" fill="none" stroke="var(--peri)" stroke-width="2.2" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/>
    <polyline points="${altB}" fill="none" stroke="var(--olive)" stroke-width="2.2" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/>
  </svg>`;
}
function crowdOverlay() {
  if (S.layer !== 'crowd') return '';
  return `<div style="position:absolute;inset:0;pointer-events:none">
    <span style="position:absolute;left:54%;top:60%;width:92px;height:92px;border-radius:50%;background:rgba(238,91,52,.14);transform:translate(-50%,-50%)"></span>
    <span style="position:absolute;left:62%;top:30%;width:64px;height:64px;border-radius:50%;background:rgba(238,91,52,.16);transform:translate(-50%,-50%)"></span>
    <span style="position:absolute;left:48%;top:88%;width:52px;height:52px;border-radius:50%;background:rgba(238,91,52,.18);transform:translate(-50%,-50%)"></span>
    <span style="position:absolute;right:4px;bottom:6px;font:700 8px var(--mono);color:var(--warn)">Crowds rise after 14:00</span>
  </div>`;
}

function initMapDrag() {
  const body = $('#mapBody');
  if (!body || !S.editMode) return;
  $$('.pin', body).forEach((pin) => {
    pin.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      const id = pin.dataset.pin;
      const stop = S.stops.find((s) => s.id === id);
      if (!stop) return;
      S.selected = id;
      const rect = body.getBoundingClientRect();
      const startX = ev.clientX;
      const startY = ev.clientY;
      const originX = stop.x;
      const originY = stop.y;
      pin.setPointerCapture?.(ev.pointerId);
      $$('.pin', body).forEach((p) => p.classList.toggle('selected', p.dataset.pin === id));
      const move = (e) => {
        const nx = clamp(originX + (e.clientX - startX) / rect.width, .07, .93);
        const ny = clamp(originY + (e.clientY - startY) / rect.height, .08, .94);
        stop.x = nx; stop.y = ny;
        pin.style.left = `${nx * 100}%`;
        pin.style.top = `${ny * 100}%`;
        const paths = $$('.route-svg path', body);
        paths.forEach((p) => { if (p.getAttribute('stroke') !== null) p.setAttribute('d', routePathD()); });
        const label = $('.pin-label', body);
        if (label) { label.style.left = `${nx * 100}%`; label.style.top = `${ny * 100}%`; }
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        toast('Stop moved · route recalculated', 'refresh');
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    });
  });
}

/* ================= extra data ================= */
ICONS.building = '<path d="M4 21h16M6 21V8l6-4 6 4v13"/><path d="M10 21v-5h4v5M9.5 10h.4M14 10h.4"/>';
ICONS.leaf = '<path d="M5 19c0-8 5-13 14-13 0 9-5 14-13 14"/><path d="M5 19c3-4 6-6 10-7"/>';
ICONS.pencil = '<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>';

const FORUM_ROUTES = [
  { title: 'Two Days of Hutong Strolling · 8 stops', author: '@Lina', meta: '4.8 · 1.2k saves', tags: ['Hutongs', 'Coffee', 'Slow'], likes: '1.2k', art: 'A' },
  { title: 'Central Axis in a Day · 6 stops', author: '@Ken', meta: '4.9 · 3.4k saves', tags: ['Classic', 'Sunset', 'Palace'], likes: '3.4k', art: 'B' },
  { title: 'Shichahai After Dark · 5 stops', author: '@Zhe', meta: '4.7 · 860 saves', tags: ['Night', 'Local', 'Bars'], likes: '860', art: 'C' }
];

const CHANNELS = [
  { id: 'restaurant', lab: 'EAT', title: 'Where to eat', sub: 'Trending · 4 spots', icon: 'flame', fill: 'mustard' },
  { id: 'spot', lab: 'SEE', title: 'What to see', sub: 'This week · 3 places', icon: 'sun', fill: 'mint' },
  { id: 'gift', lab: 'GIFT', title: 'Gifts to take home', sub: 'Locals pick · 3 finds', icon: 'gift', fill: 'pink' },
  { id: 'route', lab: 'WALK', title: 'Citywalks', sub: 'Ready to borrow · 3', icon: 'route', fill: 'peri' },
  { id: 'event', lab: 'EVENT', title: 'Local events', sub: 'This week · 3 on', icon: 'calendar', fill: 'sky' }
];

const POST_KINDS = [
  { id: 'all', lab: 'All' },
  { id: 'restaurant', lab: 'Food' },
  { id: 'spot', lab: 'Sights' },
  { id: 'route', lab: 'Routes' },
  { id: 'gift', lab: 'Gifts' },
  { id: 'event', lab: 'Events' }
];

const POST_KIND_LABEL = { restaurant: 'EAT', spot: 'SEE', route: 'WALK', gift: 'GIFT', event: 'EVENT' };

/* platform user posts — the primary forum content */
const POSTS = [
  {
    id: 'n1',
    photo: 'img/posts/post-n1.jpg', credit: 'EditQ / CC BY-SA 4.0', author: 'Lin Xiaoman', avatar: 'LX', tint: 'lime', time: '2 hr ago', kind: 'spot',
    title: 'Sunset from Wanchun Pavilion beats any photo', body: 'Climb up before 17:00 for the last light — the roofs burn gold from here. Take the east railing, the whole axis lines up.',
    tags: ['Jingshan', 'Sunset', 'Viewpoint'], likes: '3.4k', saves: '862', art: 'sunset', h: 174, placeId: 'p8',
    comment: '@Zhe: Went on Wednesday — at 17:10 the sun landed right on the ridge.'
  },
  {
    id: 'n2',
    photo: 'img/posts/post-n2.jpg', credit: 'xiquinhosilva / CC BY 4.0', author: 'Ken', avatar: 'K', tint: 'peri', time: '4 hr ago', kind: 'route',
    title: 'The Central Axis in a day: Yongdingmen to the Drum Tower', body: 'Six stops, 4.2 km. Start at three and you reach Jingshan for sunset. There is a metro exit near every leg.',
    tags: ['Central Axis', 'Walking', 'Route'], likes: '2.1k', saves: '1.2k', art: 'route', h: 120, routeIndex: 1,
    comment: '@Lina: Walked the whole thing — feet held up, topped up with coffee twice.'
  },
  {
    id: 'n3',
    photo: 'img/posts/post-n3.jpg', credit: 'Mr Wabu / CC BY-SA 2.0', author: 'Zhe', avatar: 'Z', tint: 'mustard', time: '5 hr ago', kind: 'restaurant',
    title: 'Siji Minfu before 11 really is queue-free', body: 'Eat the skin with sugar first, and half a duck is plenty for two. After three, tables free up on their own.',
    tags: ['Peking duck', 'Forbidden City', 'Queues'], likes: '2.3k', saves: '708', art: 'food', h: 146, placeId: 'p1',
    comment: '@Zhou: Confirmed — arrived at 10:40 and walked straight in.'
  },
  {
    id: 'n4',
    photo: 'img/posts/post-n4.jpg', credit: 'Arisepeter / CC BY-SA 4.0', author: 'Lina', avatar: 'L', tint: 'pink', time: 'Yesterday', kind: 'restaurant',
    title: 'A Qianmen hutong café, best light at three', body: 'Metal Hands hides in a back alley; the two window tables are the quietest. The pour-over runs bright — order a croissant with it.',
    tags: ['Coffee', 'Hutongs', 'Afternoon'], likes: '1.1k', saves: '433', art: 'coffee', h: 162, placeId: 'p4',
    comment: '@Xiaobei: Sat there two hours on Sunday. Nobody hurried us out.'
  },
  {
    id: 'n5',
    photo: 'img/posts/post-n5.jpg', credit: 'Balon Greyjoy / CC0', author: 'Zhou', avatar: 'Z', tint: 'mint', time: 'Yesterday', kind: 'spot',
    title: 'Early morning at the Temple of Heaven, almost empty', body: 'Come in by the south gate; the Echo Wall is quietest before nine. Cypress shadows on the red wall — every frame works.',
    tags: ['Temple of Heaven', 'Morning', 'Architecture'], likes: '2.8k', saves: '610', art: 'temple', h: 130, placeId: 'p9',
    comment: '@Hutong Archive: That is when locals do their morning practice. Keep voices low.'
  },
  {
    id: 'n6',
    photo: 'img/posts/post-n6.jpg', credit: 'Marek Śliwecki / CC BY-SA 4.0', author: 'Hutong Archive', avatar: 'HA', tint: 'coral', time: '2 days ago', kind: 'event',
    title: 'Saturday night market at the Drum Tower: stall list updated', body: 'Handmade goods, vinyl and mulled wine. Busiest after 19:00. Metro Line 8, Shichahai station, exit A.',
    tags: ['Night market', 'Drum Tower', 'Weekend'], likes: '986', saves: '241', art: 'night', h: 154, eventId: 'e1',
    comment: '@Ken: Signed up — see you there.'
  },
  {
    id: 'n7',
    photo: 'img/posts/post-n7.jpg', credit: 'Zicheng zic / CC BY 4.0', author: 'Lao Zhao', avatar: 'LZ', tint: 'sky', time: '2 days ago', kind: 'gift',
    title: 'Daoxiangcun: loose pastries or gift boxes?', body: 'Loose sweets are sold by weight, fresher, and you can mix flavors. Boxes are for giving — no need for your own snack stash.',
    tags: ['Gifts', 'Daoxiangcun', 'Save money'], likes: '1.7k', saves: '529', art: 'gift', h: 138, placeId: 'p5',
    comment: '@Lin Xiaoman: Date paste and ox-tongue pastries, every time.'
  },
  {
    id: 'n8',
    photo: 'img/posts/post-n8.jpg', credit: 'Morio / CC BY-SA 4.0', author: 'Zhe', avatar: 'Z', tint: 'mustard', time: '3 days ago', kind: 'route',
    title: 'Shichahai after dark: 5 stops, 3 bars on the way', body: 'Begin at Yinding Bridge and follow the north shore to the Drum Tower. After nine it thins out; bring a jacket for the wind.',
    tags: ['Night', 'Shichahai', 'Bars'], likes: '860', saves: '377', art: 'hutong', h: 126, routeIndex: 2,
    comment: '@Lina: The craft beer spot by Yinding Bridge is solid.'
  },
  {
    id: 'n9',
    photo: 'img/posts/post-n9.jpg', credit: 'Morio / CC BY-SA 4.0', author: 'Xiaobei', avatar: 'XB', tint: 'pink', time: '3 days ago', kind: 'gift',
    title: 'Corner-tower magnets are back — buy on your way in', body: 'The Shenwu Gate shop restocks in the morning and the corner-tower series goes fast. Two per person, so do not wait for closing.',
    tags: ['Palace shop', 'Magnets', 'Limited'], likes: '604', saves: '188', art: 'gift2', h: 112, placeId: 'p6',
    comment: '@Zhou: They still had the sunset color yesterday. Go.'
  },
  {
    id: 'n10',
    photo: 'img/posts/post-n10.jpg', credit: 'ZhengZhou / CC BY-SA 4.0', author: 'May', avatar: 'M', tint: 'lime', time: '4 days ago', kind: 'restaurant',
    title: 'Forty minutes in line at Manhengji — worth it?', body: 'Hand-cut lamb, sesame dip, and a copper pot that settles the question the moment it boils. Take a number before 17:00 and halve the wait.',
    tags: ['Hotpot', 'Niujie', 'Queues'], likes: '1.9k', saves: '522', art: 'hotpot', h: 140, placeId: 'p2',
    comment: '@Lao Zhao: Worth it. Order the sweet garlic.'
  },
  {
    id: 'n11',
    photo: 'img/posts/post-n11.jpg', credit: 'Daniel Case / CC BY-SA 3.0', author: 'Lina', avatar: 'L', tint: 'pink', time: '5 days ago', kind: 'spot',
    title: 'Boating at Beihai, the White Dagoba from the water', body: 'After four the sun softens; an hour in a pedal boat is just right. Rentals stop when the wind picks up.',
    tags: ['Beihai', 'Boating', 'Family'], likes: '2.1k', saves: '498', art: 'boat', h: 148, placeId: 'p10',
    comment: '@Xiaobei: With kids, choose an electric boat.'
  }
];


const SCENARIOS = [
  { id: 'route', title: 'Directions', icon: 'pin' },
  { id: 'dining', title: 'Dining', icon: 'fork' },
  { id: 'medical', title: 'Medical', icon: 'shield' },
  { id: 'taxi', title: 'Taxi', icon: 'plane' },
  { id: 'shopping', title: 'Shopping', icon: 'gift' },
  { id: 'emergency', title: 'Emergency', icon: 'info' }
];

const LIVE_MORE = [
  { zh: '请问洗手间在哪里？', en: 'Where is the restroom?', mine: false },
  { zh: '这个可以刷卡吗？', en: 'Can I pay by card?', mine: false },
  { zh: '去南锣鼓巷怎么走？', en: 'How do I get to Nanluoguxiang?', mine: false }
];

const QUICK = ['Rework my route', 'Any palace tickets left?', 'Where should I eat?', 'Translate: I have an allergy', 'Check my pre-trip list'];

/* ================= FORUM ================= */
function channelMeta(id) { return CHANNELS.find((c) => c.id === id) || CHANNELS[0]; }
function allPosts() { return S.userPosts.concat(POSTS); }
function postById(id) { return allPosts().find((p) => p.id === id); }

function filteredPosts(kind = 'all') {
  const q = S.search.trim().toLowerCase();
  return allPosts().filter((p) => {
    if (kind !== 'all' && p.kind !== kind) return false;
    if (!q) return true;
    return [p.title, p.body, p.author, ...p.tags].join(' ').toLowerCase().includes(q);
  });
}

function forumView() {
  if (S.forumChannel) return forumChannelView(S.forumChannel);
  return `<div class="forum-top">
      <header class="top">
        <div>
          <div class="eyebrow"><span class="eyebrow-line"></span>Community / BEIJING ${sparkleIcon(8)}</div>
          <div class="forum-title">Our Beijing</div>
          <div class="meta">4,208 notes · 126 today · locals post here too</div>
        </div>
        <button class="icon-btn" style="background:var(--ink);color:var(--paper);width:42px;height:42px" data-act="compose" aria-label="Start an event">${icon('pencil', 15)}</button>
      </header>
    </div>

    <div class="forum-search">
      ${icon('search', 13)}
      <input type="search" placeholder="Search notes, places, people" data-role="search" value="${esc(S.search)}" aria-label="Search community notes">
      ${S.search ? `<button class="clear" data-act="search-clear" aria-label="Clear search">${icon('x', 8)}</button>` : ''}
    </div>

    <div id="forumBody">${forumBodyHTML()}</div>`;
}

function forumBodyHTML() {
  if (S.search.trim()) return searchHTML();
  return `${feedFiltersHTML(S.forumFilter)}${feedIntroHTML()}${postFeedHTML(filteredPosts(S.forumFilter))}${feedEndHTML()}`;
}

function feedFiltersHTML(active) {
  return `<div class="feed-filters">
    ${POST_KINDS.map((k) => `<button class="feed-filter ${k.id === active ? 'active' : ''}" data-act="feed-filter" data-key="${k.id}">${k.lab}</button>`).join('')}
  </div>`;
}

function feedIntroHTML() {
  const k = POST_KINDS.find((x) => x.id === S.forumFilter) || POST_KINDS[0];
  const n = filteredPosts(S.forumFilter).length;
  return `<div class="feed-intro">
    <div class="st-left"><span class="live-dot"></span><b>${k.id === 'all' ? 'Latest notes' : k.lab + ' notes'}</b></div>
    <span class="meta">${n} posts · newest first</span>
  </div>`;
}

function feedEndHTML() {
  return `<div class="feed-end"><span>You are all caught up</span><small>4,208 notes · pull down to refresh</small></div>`;
}

function postFeedHTML(list) {
  if (!list.length) {
    return `<div class="feed-empty">
      <span class="doodle">${sparkleIcon(18)}</span>
      <b>No notes here yet</b>
      <small>Try another category, or start a citywalk under Events.</small>
    </div>`;
  }
  return `<div class="post-feed">${list.map(postCardHTML).join('')}</div>`;
}

function postCardHTML(p) {
  const saved = S.savedPosts.has(p.id);
  return `<article class="post-card" data-act="post" data-id="${p.id}" role="button" tabindex="0" aria-label="${esc(p.title)}">
    <span class="post-cover" style="height:${p.h}px">
      ${postCover(p)}
      <span class="post-kind">${esc(POST_KIND_LABEL[p.kind])}</span>
      <button class="post-save ${saved ? 'saved' : ''}" data-act="save-post" data-id="${p.id}" aria-label="${saved ? 'Remove from saved' : 'Save note'}">${icon(saved ? 'bookmark' : 'heart', 9)}</button>
    </span>
    <span class="post-body">
      <b>${esc(p.title)}</b>
      <small class="post-sub">${esc(p.body)}</small>
      <span class="post-meta">
        <span class="mini-avatar" style="background:var(--${p.tint})">${esc(p.avatar)}</span>
        <span class="post-author">${esc(p.author)}</span>
        <span class="post-stats">${icon('heart', 7)}${esc(p.likes)}</span>
      </span>
    </span>
  </article>`;
}

function searchHTML() {
  const q = S.search.trim();
  const list = filteredPosts('all');
  return `<div class="search-results">
    <div class="spread" style="margin:8px 0 2px">
      <b style="font-size:13px">Search “${esc(q)}”</b>
      <span class="meta">${list.length} notes</span>
    </div>
    ${list.length ? postFeedHTML(list) : `<div class="feed-empty">
      <span class="doodle">${sparkleIcon(18)}</span>
      <b>Nothing for “${esc(q)}”</b>
      <small>Try “duck”, “hutong”, “sunset” or “gifts”.</small>
    </div>`}
  </div>`;
}

function forumChannelView(id) {
  const c = channelMeta(id);
  const action = id === 'event'
    ? `<button class="link" style="font-size:9px" data-act="compose">${icon('plus', 9)}Start an event</button>`
    : `<button class="link" style="font-size:9px" data-act="assistant" data-ctx="Community · ${esc(c.title)}">Ask Pico</button>`;
  return `<div class="back-row">
      <button class="icon-btn" data-act="back-forum" aria-label="Back to community">${icon('back', 13)}</button>
      <span class="channel-name">${esc(c.lab)} · ${esc(c.title)}</span>
      <span class="spacer"></span>
      ${action}
    </div>
    ${channelBanner(id)}
    ${id === 'event' ? eventAdminHTML() : ''}
    ${feedFiltersHTML(id)}
    ${postFeedHTML(filteredPosts(id))}`;
}

function channelBanner(id) {
  const c = channelMeta(id);
  const count = filteredPosts(id).length;
  const desc = {
    restaurant: 'What locals order · queues and signature dishes',
    spot: 'Viewpoints, sunsets and the quiet hours',
    gift: 'Things worth carrying home',
    route: 'Citywalks you can borrow whole',
    event: 'Markets, night rides, swap meets'
  }[id] || '';
  return `<div class="channel-banner ${c.fill}">
    <span class="cb-sticker">${esc(c.lab)}</span>
    <div class="grow">
      <h2>${esc(c.title)}</h2>
      <p>${esc(desc)}</p>
    </div>
    <span class="cb-count">${count} notes</span>
  </div>`;
}

function eventAdminHTML() {
  return `<div class="card event-admin">
    <div class="rank-head"><b style="font-size:11.5px">This week</b><span class="mono">${S.events.length} events · open</span></div>
    ${S.events.map((e) => {
      const joined = S.joined.has(e.id);
      const [d, w] = e.date.split(' ');
      return `<div class="calendar-row">
        <span class="calendar-date"><b>${esc(d)}</b><small>${esc(w || '')}</small></span>
        <span class="calendar-info"><b>${esc(e.title)}</b><small>${esc(e.time)} · ${esc(e.place)}</small></span>
        <button class="check-action" style="background:${joined ? 'var(--lime)' : 'var(--paper)'};border-color:var(--ink);color:var(--ink)" data-act="join-event" data-id="${e.id}">${joined ? 'Going' : 'Join'}</button>
      </div>`;
    }).join('')}
    <button class="full-btn coral" style="margin-top:10px" data-act="compose">${icon('plus', 11)}Post my event</button>
  </div>
  <div class="tip-strip">${icon('users', 12)}<span>Joining adds a reminder under Me → Pre-trip checklist, pushed 2 hours before.</span></div>`;
}

/* ---------- post cover art ---------- */
function postCover(p) {
  if (p.photo) {
    return `<img class="post-photo" src="${p.photo}" alt="${esc(p.title)}" loading="lazy" decoding="async">`;
  }
  return postArt(p.art);
}

function postArt(kind) {
  switch (kind) {
    case 'sunset': return sunsetArt();
    case 'temple': return templeArt();
    case 'food': return foodArt('var(--mustard-soft)');
    case 'coffee': return coffeeArt();
    case 'gift': return giftArt('var(--pink-soft)', 'var(--coral)');
    case 'gift2': return giftArt('var(--mustard-soft)', 'var(--peri)');
    case 'night': return nightArt();
    case 'hutong': return nightArt(true);
    case 'route': return routeArt();
    case 'hotpot': return hotpotArt();
    case 'boat': return boatArt();
    default: return sunsetArt();
  }
}

function coffeeArt() {
  return `<svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="110" fill="var(--peri-soft)"/>
    <rect x="92" y="8" width="56" height="66" rx="3" fill="var(--sky-soft)" stroke="var(--ink)" stroke-width="1.3"/>
    <path d="M92 8v66M112 8v66M132 8v66" stroke="var(--ink)" stroke-width="1" opacity=".55"/>
    <path d="M0 78h160v32H0z" fill="var(--paper-warm)" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M46 76c-3-7 3-9 0-16M60 76c-3-7 3-9 0-16" fill="none" stroke="var(--ink2)" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M34 48h42v18a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>
    <path d="M76 52h6a6 6 0 0 1 0 12h-6" fill="none" stroke="var(--ink)" stroke-width="1.4"/>
    <path d="M36 58h34" stroke="var(--ink)" stroke-width="1.2" opacity=".5"/>
    <circle cx="55" cy="46" r="2" fill="var(--coral)"/>
  </svg>`;
}

function giftArt(bg, ribbon) {
  return `<svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="110" fill="${bg}"/>
    <circle cx="128" cy="24" r="16" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2" opacity=".75"/>
    <path d="M0 86h160v24H0z" fill="var(--paper-warm)" stroke="var(--ink)" stroke-width="1.1"/>
    <rect x="34" y="44" width="58" height="42" rx="4" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>
    <path d="M63 44v42M34 60h58" stroke="${ribbon}" stroke-width="5"/>
    <path d="M63 44c-10 0-16-4-16-10 0-4 6-6 9-2 4 4 7 12 7 12zM63 44c10 0 16-4 16-10 0-4-6-6-9-2-4 4-7 12-7 12z" fill="${ribbon}" stroke="var(--ink)" stroke-width="1.2"/>
    <rect x="100" y="62" width="30" height="24" rx="3" fill="var(--mustard)" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M115 62v24" stroke="var(--ink)" stroke-width="1"/>
    <path d="M22 100h-8M148 100h-6" stroke="var(--ink)" stroke-width="1.2"/>
  </svg>`;
}

function nightArt(wide) {
  return `<svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="110" fill="var(--ink)"/>
    <circle cx="126" cy="24" r="14" fill="var(--lime)" opacity=".9"/>
    <circle cx="132" cy="20" r="3" fill="var(--paper)" opacity=".5"/>
    <path d="M0 74l22-18 20 18M34 74l24-24 24 24M76 74l20-16 20 16M112 74l18-14 18 14" fill="none" stroke="var(--paper)" stroke-width="1.3" opacity=".55"/>
    <path d="M0 74h160v36H0z" fill="#2A261D"/>
    <path d="M14 90V78h30v12M52 90V82h26v8" fill="none" stroke="var(--paper)" stroke-width="1.2" opacity=".7"/>
    ${wide ? `<path d="M104 84v-8h14v8M122 84v-10h12v10" fill="none" stroke="var(--paper)" stroke-width="1.1" opacity=".6"/>` : ''}
    <g stroke="var(--ink)" stroke-width="1.1">
      <path d="M74 18v10M70 18h8" />
      <rect x="66" y="28" width="16" height="19" rx="5" fill="var(--coral)"/>
      <path d="M74 47v6" />
      <rect x="96" y="40" width="13" height="16" rx="4" fill="var(--mustard)"/>
      <path d="M102.5 56v5" />
    </g>
    <circle cx="74" cy="37" r="3" fill="var(--paper)" opacity=".7"/>
    <path d="M42 96h76" stroke="var(--mustard)" stroke-width="1" stroke-dasharray="3 4" opacity=".7"/>
  </svg>`;
}

function routeArt() {
  return `<svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="110" fill="var(--paper-warm)"/>
    <g stroke="var(--ink)" stroke-width=".7" opacity=".16">
      <path d="M0 30h160M0 62h160M0 92h160M28 0v110M70 0v110M112 0v110M146 0v110"/>
    </g>
    <path d="M22 92c18-6 22-28 38-32s14-22 30-24 22-14 40-10" fill="none" stroke="var(--coral)" stroke-width="2.6" stroke-dasharray="5 4" stroke-linecap="round"/>
    <g stroke="var(--ink)" stroke-width="1.2">
      <circle cx="22" cy="92" r="6" fill="var(--lime)"/><circle cx="60" cy="60" r="6" fill="var(--paper)"/>
      <circle cx="90" cy="36" r="6" fill="var(--paper)"/><circle cx="130" cy="26" r="6" fill="var(--mustard)"/>
    </g>
    <path d="M22 92v-9M60 60v-9M90 36v-9" stroke="var(--ink)" stroke-width="1" opacity=".5"/>
    <path d="M8 14h38l-6 8 6 8H8z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.1"/>
    <path d="M18 22h18" stroke="var(--ink)" stroke-width="1.1"/>
    <path d="M118 84c8-4 16 2 26-2" fill="none" stroke="var(--peri)" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>
  </svg>`;
}

function hotpotArt() {
  return `<svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="110" fill="var(--mustard-soft)"/>
    <circle cx="30" cy="24" r="13" fill="var(--coral)" stroke="var(--ink)" stroke-width="1.2" opacity=".9"/>
    <path d="M0 80h160v30H0z" fill="var(--paper-warm)" stroke="var(--ink)" stroke-width="1.1"/>
    <path d="M40 72c-3-8 3-10 0-18M58 72c-3-8 3-10 0-18M76 72c-3-8 3-10 0-18" fill="none" stroke="var(--ink2)" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M52 42h48l-6 30a10 10 0 0 1-10 8H68a10 10 0 0 1-10-8z" fill="var(--coral)" stroke="var(--ink)" stroke-width="1.4"/>
    <path d="M52 42h48" stroke="var(--ink)" stroke-width="1.4"/>
    <path d="M48 50h56M62 82h28" stroke="var(--ink)" stroke-width="1.2"/>
    <ellipse cx="76" cy="44" rx="22" ry="4" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.1"/>
    <path d="M118 62h18v14h-18zM124 56v6M130 56v6" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.1"/>
    <path d="M116 88h22" stroke="var(--ink)" stroke-width="1.2"/>
  </svg>`;
}

function boatArt() {
  return `<svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="110" fill="var(--sky-soft)"/>
    <circle cx="126" cy="24" r="13" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M0 52c20-8 34 6 52 0s30-8 48 0 32 4 60-4v62H0z" fill="var(--sky)" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M0 72c24-6 40 6 58 2s32-6 48 0 30 2 54-4" fill="none" stroke="var(--paper)" stroke-width="2"/>
    <path d="M34 64h56l-10 16H44z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>
    <path d="M58 64V38l20 10-20 10z" fill="var(--coral)" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M76 70l-6 8M52 70l-4 8" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M106 34c6-4 10-4 16 0" fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M92 86h44" stroke="var(--paper)" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

function waveArt() {
  return `<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="90" fill="var(--sky-soft)"/>
    <circle cx="124" cy="26" r="14" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M0 52c18-8 32 6 48 0s30-10 46-2 34 6 66-4v44H0z" fill="var(--sky)" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M0 68c22-6 38 6 56 2s30-6 46 0 32 4 58-2" fill="none" stroke="var(--paper)" stroke-width="2"/>
    <path d="M88 18v32l9-7 5 16 8-3-5-16 11-2z" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2"/>
  </svg>`;
}
function templeArt() {
  return `<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="90" fill="var(--peri-soft)"/>
    <circle cx="30" cy="24" r="13" fill="var(--mustard)" stroke="var(--ink)" stroke-width="1.2"/>
    <path d="M0 74h160v16H0z" fill="var(--mint)" stroke="var(--ink)" stroke-width="1.1"/>
    <g stroke="var(--ink)" stroke-width="1.3" fill="var(--paper)">
      <path d="M54 74V46h52v28"/><path d="M46 46h68l-10-9H56z" fill="var(--coral)"/>
      <path d="M46 58h68l-8-7H54z" fill="var(--coral)"/>
      <path d="M70 74V58h20v16"/>
    </g>
  </svg>`;
}

/* ================= TRANSLATE ================= */
function translateView() {
  const mode = S.translateMode;
  return `<header class="top">
      <div>
        <div class="eyebrow"><span class="eyebrow-line"></span>Translate / Phrases <span class="tag lime" style="transform:rotate(-3deg)">SAY IT</span></div>
        <div class="h1" style="font-size:35px;line-height:1.06">Say it clearly,<br><span style="color:var(--coral)">then breathe</span></div>
        <div class="meta">Live conversation · offline phrases · camera</div>
      </div>
      <div class="top-right">
        <span class="tag" style="background:var(--mint)">Works offline</span>
        <div class="meta">86 phrases · 4.2 MB</div>
      </div>
    </header>

    <div class="seg" role="tablist">
      <button class="${mode === 'live' ? 'on' : ''}" data-act="mode" data-mode="live">${icon('mic', 11)}Live</button>
      <button class="${mode === 'offline' ? 'on' : ''}" data-act="mode" data-mode="offline">${icon('download', 11)}Phrases</button>
      <button class="${mode === 'photo' ? 'on' : ''}" data-act="mode" data-mode="photo">${icon('camera', 11)}Camera</button>
    </div>

    ${mode === 'live' ? liveSection() : mode === 'offline' ? offlineSection() : photoSection()}

    <div class="privacy">${icon('lock', 9)} Voice is processed on device · recordings are never saved</div>`;
}

function liveSection() {
  return `<div class="scenario-rail" style="margin-top:-2px">
      ${SCENARIOS.map((sc) => `<button class="chip" data-act="pick-scenario" data-scenario="${sc.id}">${icon(sc.icon, 8)}${sc.title}</button>`).join('')}
    </div>
    <div class="card live-card">
      <div class="live-head">
        <span class="eyebrow">Live conversation</span>
        <span class="lang-swap">Chinese ${icon('arrowr', 9)} <b>English</b> ${icon('refresh', 9)}</span>
      </div>
      ${S.live.map((m) => `<div class="bubble-row ${m.mine ? 'mine' : ''}">
        <div class="bubble">
          <b>${esc(m.zh)}</b>
          <small>${esc(m.en)}</small>
          <div class="tools">
            <button class="tool-chip" data-act="speak" data-text="${esc(m.en)}" data-lang="en">${icon('speaker', 8)}EN</button>
            <button class="tool-chip" data-act="speak" data-text="${esc(m.zh)}" data-lang="zh">${icon('speaker', 8)}ZH</button>
          </div>
        </div>
      </div>`).join('')}
      <div class="live-foot">
        <div class="live-hint">
          <b>${S.listening ? 'Listening… tap again to finish' : 'Tap to start talking'}</b>
          <span>${S.listening ? 'Recognizing offline · translates when you stop' : 'Two-way · detects Chinese and English'}</span>
        </div>
        <button class="mic ${S.listening ? 'listening' : ''}" data-act="mic" aria-label="Tap to talk">${icon('mic', 19)}</button>
      </div>
    </div>
    <div class="tip-strip" style="margin-top:8px">${icon('info', 12)}<span>Works without a signal. Speech is recognized on device, then translated into English.</span></div>`;
}

function offlineSection() {
  const list = PHRASES.filter((p) => p.scenario === S.scenario);
  return `<div class="scenario-rail">
      ${SCENARIOS.map((sc) => `<button class="chip ${S.scenario === sc.id ? 'on' : ''}" data-act="scenario" data-scenario="${sc.id}">${icon(sc.icon, 8)}${sc.title}</button>`).join('')}
    </div>
    <div class="spread" style="margin:2px 0 9px">
      <div class="st-left" style="display:flex;align-items:baseline;gap:7px"><b style="font-size:15px;font-weight:900">Offline phrasebook</b><span class="idx" style="font:700 8px var(--mono);color:var(--ink3)">Downloaded</span></div>
      <span class="meta">86 phrases · 4.2 MB</span>
    </div>
    ${list.map((p) => phraseCardHTML(p)).join('')}
    ${S.scenario === 'medical' ? emergencyCardHTML() : ''}`;
}

function phraseCardHTML(p) {
  const idx = PHRASES.indexOf(p);
  return `<div class="card phrase-card" data-act="phrase" data-index="${idx}" role="button" tabindex="0">
    <span class="txt">
      <b>${esc(p.zh)}</b>
      <small>${esc(p.en)}</small>
      <span class="tools">
        <button class="tool-chip" data-act="speak" data-text="${esc(p.en)}" data-lang="en">${icon('speaker', 8)}Play</button>
        <button class="tool-chip" data-act="copy" data-text="${esc(p.en)}">${icon('copy', 8)}Copy</button>
        <button class="tool-chip" data-act="favorite-phrase">${icon('heart', 8)}Save</button>
      </span>
    </span>
    ${icon('arrowur', 10)}
  </div>`;
}

function emergencyCardHTML() {
  return `<div class="emergency-card">
    <b>Emergency · call first</b>
    <span>Ambulance 120 · Police 110 · Fire 119. If you need help in Chinese, show the sentence below.</span>
    <a class="call" href="tel:120">${icon('shield', 9)}Call 120</a>
  </div>`;
}

function photoSection() {
  const menu = S.photoSample === 'menu';
  return `<div class="photo-card">
    <div class="photo-top">
      <i class="dot"></i><b>CAMERA · OCR</b>
      <span class="right">${S.photoScanning ? '<i class="pulse-dot"></i>Reading…' : S.photoScanned ? 'Found · 9 words' : '1x · autofocus'}</span>
    </div>
    <div class="photo-scene">
      ${menu ? menuScene() : signScene()}
      ${S.photoScanning ? '<div class="scan-beam"></div>' : ''}
      <div class="viewfinder"><i></i><i></i><i></i><i></i></div>
      ${!S.photoScanning && !S.photoScanned ? '<div class="scene-stamp">TAP TO SCAN</div>' : ''}
    </div>
    <div class="photo-controls">
      <button class="sample-chip ${menu ? 'on' : ''}" data-act="sample" data-sample="menu">${icon('doc', 8)}Menu sign</button>
      <button class="sample-chip ${menu ? '' : 'on'}" data-act="sample" data-sample="sign">${icon('pin', 8)}Street sign</button>
      <button class="shutter ${S.photoScanning ? 'scanning' : ''}" data-act="shutter" aria-label="Scan and translate"></button>
    </div>
  </div>
  ${S.photoScanned ? photoResultHTML() : `<div class="photo-hint"><b>Point at a sign or a menu</b><br>Press the shutter and Pico will frame the text and translate it into English. You can play it aloud or copy it.</div>`}`;
}

function menuScene() {
  return `<div class="scene-menu">
    <div class="menu-paper">
      <div class="head"><b>老北京小吃</b><small>MENU · SIGNATURE</small></div>
      ${MENU.map((m, i) => `<div class="menu-line ${i === 0 ? 'hl' : ''}">
        <span class="idx">${i + 1}</span><b>${esc(m.zh)}</b><small>${esc(m.en)}</small><span class="price">${esc(m.price)}</span>
      </div>`).join('')}
    </div>
    <span class="scene-stamp">OCR</span>
  </div>`;
}

function signScene() {
  const spots = [
    { left: '30px', top: '22px' },
    { left: '142px', top: '76px' },
    { left: '58px', top: '140px' }
  ];
  return `<div class="scene-sign">
    <div class="sign-post"></div>
    ${SIGN.map((s, i) => `<div class="sign-board ${i === 0 ? 'hl' : ''}" style="left:${spots[i].left};top:${spots[i].top}">
      <b>${esc(s.zh)}</b><small>${esc(s.en)} · ${esc(s.price)}</small>
    </div>`).join('')}
  </div>`;
}

function photoResultHTML() {
  const isMenu = S.photoSample === 'menu';
  const rows = isMenu ? MENU : SIGN;
  return `<div class="card result-card">
    <div class="result-head"><b>Recognized · ${isMenu ? 'Old Beijing snacks' : 'Street signs'}</b><span>ZH / EN</span></div>
    ${rows.map((r, i) => `<div class="result-row">
      <span class="no">${i + 1}</span>
      <span class="txt"><b>${esc(r.zh)}</b><small>${esc(r.en)} ${esc(r.price)}</small></span>
      <button class="tool-chip" data-act="speak" data-text="${esc(r.en)}" data-lang="en">${icon('speaker', 8)}</button>
    </div>`).join('')}
    <div class="result-actions">
      <button class="tool-chip solid" data-act="speak" data-text="${esc(rows[0].en)}" data-lang="en">${icon('speaker', 9)}Play aloud</button>
      <button class="tool-chip" data-act="copy" data-text="${esc(rows.map((r) => `${r.zh} · ${r.en}`).join('\n'))}">${icon('copy', 9)}Copy all</button>
      <button class="tool-chip" data-act="sample" data-sample="${isMenu ? 'sign' : 'menu'}">${icon('refresh', 9)}Try another</button>
    </div>
  </div>
  <div class="photo-hint"><b>${isMenu ? 'What to order' : 'Finding your way'}</b><br>${isMenu ? 'Zhajiang noodles are the safest order; first-timers should share one glass of douzhi.' : 'Follow the signs straight ahead — Shichahai is toward Beihai North station on Metro Line 6.'}</div>`;
}

/* ================= ME ================= */
function meView() {
  const bookedCount = S.attractions.filter((a) => a.booked).length;
  const attractionTotal = S.attractions.length;
  const bookedPct = Math.round((bookedCount / attractionTotal) * 100);
  return `<div class="me-head">
      <div class="me-avatar">W</div>
      <div class="grow">
        <div class="eyebrow">Me / PROFILE</div>
        <div class="me-name">Wang Bo</div>
        <div class="me-tags">${tag('RoamChina member', 'lime')}${tag('12th city')}</div>
      </div>
      <button class="icon-btn" data-act="assistant" data-ctx="Me · Settings and preferences" aria-label="Settings">${icon('settings', 14)}</button>
    </div>

    <div class="me-stat-row">
      <div class="me-stat mustard"><b>12</b><span>Cities visited</span></div>
      <div class="me-stat pink"><b>46</b><span>Saved places</span></div>
      <div class="me-stat mint"><b>3</b><span>Shared routes</span></div>
    </div>

    <div class="trip-dark">
      <div class="top" style="display:flex;align-items:center;justify-content:space-between">
        <span class="tag lime">3 days to go</span>
        <span class="meta">10/15 – 10/18</span>
      </div>
      <h3>Beijing · 4 days, 3 nights</h3>
      <div class="meta">Wangfujing · 2 adults · Central Axis on foot</div>
      <div class="who">
        <div class="avatar-stack"><div class="avatar sm">L</div><div class="avatar sm pink">Z</div></div>
        <span>With Lin and Zhou</span>
        <button class="view-trip" data-act="tab" data-tab="trip">View trip</button>
      </div>
      <div class="quick">
        <button data-act="checklist">${icon('check', 8)}List ${doneCount()}/${S.checklist.length}</button>
        <button data-act="tab" data-tab="plan">${icon('map', 8)}Open route</button>
        <button data-act="share-route">${icon('share', 8)}Share</button>
      </div>
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">01</span><h2>Journey reports</h2></div><span class="meta">${JOURNEYS.length} archived</span></div>
    <div class="jr-card">
      <div class="jr-now">
        <span class="jr-pulse"></span>
        <span class="grow"><b>Beijing · in progress</b><small>Wrap-up unlocks 10/19 — new places, rarity and your title</small></span>
        <span class="tag soft">Day 1</span>
      </div>
      ${JOURNEYS.map((j) => `<button class="jr-row" data-act="report" data-id="${j.id}">
        <span class="jr-year">${esc(j.dates)}</span>
        <span class="grow"><b>${esc(j.city)} · ${esc(j.title)}</b><small>${j.newPlaces} new places · rarest find ${j.rarePct}%</small></span>
        <span class="jr-arrow">${icon('arrowur', 10)}</span>
      </button>`).join('')}
      <div class="jr-foot">${icon('info', 9)} Each finished trip is archived automatically, on your device.</div>
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">02</span><h2>Attraction bookings</h2></div><span class="meta">${bookedCount} / ${attractionTotal} booked</span></div>
    <div class="resv-card">
      <div class="resv-head">
        <div class="grow">
          <div class="spread"><b>Beijing · 4 days, 3 nights</b><span class="resv-count">${bookedPct}%</span></div>
          <small>Tickets are issued by the venues; scan your passport at the gate</small>
          <div class="resv-progress"><i style="width:${bookedPct}%"></i></div>
        </div>
        <button class="resv-all" data-act="book-all" ${bookedCount === attractionTotal ? 'disabled' : ''}>${bookedCount === attractionTotal ? 'All booked' : 'Book all'}</button>
      </div>
      <div class="resv-list">
        ${S.attractions.map((a) => `<div class="resv-row" data-act="resv-info" data-id="${a.id}" role="button" tabindex="0">
          <span class="resv-date"><b>${esc(a.date)}</b><small>${esc(a.week)}</small></span>
          <span class="grow resv-info"><b>${esc(a.name)}</b><small>${esc(a.time)} · ${esc(a.people)} · ${esc(a.price)}</small></span>
          ${a.booked
            ? `<span class="resv-status ok">${icon('check', 8)}Booked</span>`
            : `<button class="resv-book" data-act="book-attraction" data-id="${a.id}">Book</button>`}
        </div>`).join('')}
      </div>
      <div class="resv-tip">${icon('info', 10)}<span>The Forbidden City closes on Mondays; it is open Wednesday 10/15. Your booking receipts stay here.</span></div>
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">03</span><h2>Travel services</h2></div></div>
    <div class="service-grid">
      <button class="service" data-act="assistant" data-ctx="Me · Offline pack">
        <span class="ico" style="background:var(--mint-soft)">${icon('download', 12)}</span>
        <span><b>Offline pack</b><small>Maps · phrases · ready</small></span>
      </button>
      <button class="service" data-act="tab" data-tab="forum">
        <span class="ico" style="background:var(--pink-soft)">${icon('heart', 12)}</span>
        <span><b>Saved</b><small>46 places</small></span>
      </button>
      <button class="service" data-act="assistant" data-ctx="Together · Invite a traveler">
        <span class="ico" style="background:var(--peri-soft)">${icon('users', 12)}</span>
        <span><b>Travel together</b><small>Lin, Zhou · 2 people</small></span>
      </button>
      <button class="service" data-act="notes">
        <span class="ico" style="background:var(--mustard-soft)">${icon('doc', 12)}</span>
        <span><b>Trip notes</b><small>Export a poster</small></span>
      </button>
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">04</span><h2>Booked elsewhere</h2></div><span class="meta">Optional</span></div>
    <div class="ext-card">
      <button class="ext-head" data-act="toggle-bookings" aria-expanded="${S.showBookings}">
        <span class="ico">${icon('layers', 13)}</span>
        <span class="grow"><b>Flights & hotel</b><small>Synced from the airline and hotel · nothing to manage in RoamChina</small></span>
        <span class="tag soft">2 items</span>
        <span class="chev ${S.showBookings ? 'open' : ''}">${icon('down', 9)}</span>
      </button>
      ${S.showBookings ? `<div class="ext-body">
        <div class="ext-row">${icon('plane', 11)}<span class="grow"><b>Air China CA182</b><small>10/15 08:45 → 11:20 · Capital T3 · ticketed</small></span></div>
        <div class="ext-row">${icon('bed', 11)}<span class="grow"><b>Mandarin Oriental Wangfujing</b><small>10/15 – 10/18 · 3 nights · confirmed</small></span></div>
        <div class="ext-foot">Shown for reference only. It does not affect bookings, routes or your checklist.</div>
      </div>` : ''}
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">05</span><h2>Preferences</h2></div></div>
    <div class="card" style="padding:2px 13px">
      <div class="setting-row">
        <span class="ico">${icon('bell', 12)}</span>
        <span class="grow"><b>Trip reminders</b><small>2 hr before · weather changes</small></span>
        <span class="toggle ${S.notifications ? 'on' : ''}" data-act="toggle-setting" data-key="notifications" role="switch" aria-checked="${S.notifications}" tabindex="0"></span>
      </div>
      <div class="setting-row">
        <span class="ico">${icon('speaker', 12)}</span>
        <span class="grow"><b>Auto-play translations</b><small>Speak English as soon as it is read</small></span>
        <span class="toggle ${S.autoplay ? 'on' : ''}" data-act="toggle-setting" data-key="autoplay" role="switch" aria-checked="${S.autoplay}" tabindex="0"></span>
      </div>
      <div class="setting-row" data-act="toast" data-text="Offline maps are up to date · 42 MB" data-icon="download" role="button" tabindex="0">
        <span class="ico">${icon('map', 12)}</span>
        <span class="grow"><b>Offline maps</b><small>Beijing · 42 MB downloaded</small></span>
        <span class="val">${icon('right', 9)}</span>
      </div>
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">06</span><h2>About</h2></div></div>
    <div class="card" style="padding:2px 13px">
      <div class="setting-row" data-act="toast" data-text="Privacy policy · all voice is processed on device" data-icon="lock" role="button" tabindex="0">
        <span class="ico">${icon('lock', 12)}</span>
        <span class="grow"><b>Privacy</b><small>Your data stays on your device</small></span>
        <span class="val">${icon('right', 9)}</span>
      </div>
      <div class="setting-row" data-act="toast" data-text="Terms of service · RoamChina 1.0.0" data-icon="doc" role="button" tabindex="0">
        <span class="ico">${icon('doc', 12)}</span>
        <span class="grow"><b>Terms</b><small>Last updated 2026/10</small></span>
        <span class="val">${icon('right', 9)}</span>
      </div>
      <div class="setting-row" data-act="toast" data-text="RoamChina 1.0.0 (12) · native SwiftUI edition" data-icon="info" role="button" tabindex="0">
        <span class="ico">${icon('info', 12)}</span>
        <span class="grow"><b>About RoamChina</b><small>Version 1.0.0 (12)</small></span>
        <span class="val">${icon('right', 9)}</span>
      </div>
    </div>

    <div class="me-footer">ROAMCHINA · MADE FOR SLOW TRAVEL<br>A whole Beijing, in your pocket</div>`;
}

/* ================= SHEETS ================= */
const sheetBuilders = {
  assistant: assistantSheet,
  similar: similarSheet,
  reorder: reorderSheet,
  notes: notesSheet,
  checklist: checklistSheet,
  place: placeSheet,
  compose: composeSheet,
  phrase: phraseSheet,
  post: postSheet,
  report: reportSheet
};

function openSheet(name, data = null) {
  clearTimeout(S.sheetTimer);
  S.sheet = name;
  S.sheetData = data;
  renderSheet();
}

function closeSheet() {
  const layer = $('#sheetLayer');
  if (!layer) return;
  clearTimeout(S.sheetTimer);
  S.sheet = null;
  S.sheetData = null;
  layer.classList.remove('show');
  S.sheetTimer = setTimeout(() => {
    if (!S.sheet) layer.innerHTML = '';
  }, 300);
}

function renderSheet() {
  const layer = $('#sheetLayer');
  if (!layer) return;
  if (!S.sheet) { layer.classList.remove('show'); return; }
  const build = sheetBuilders[S.sheet];
  if (!build) return;
  layer.innerHTML = `<div class="backdrop" data-act="close-sheet"></div>${build()}`;
  requestAnimationFrame(() => layer.classList.add('show'));
  if (S.sheet === 'assistant') requestAnimationFrame(scrollChat);
  if (S.sheet === 'compose') requestAnimationFrame(updateComposePreview);
}

function sheetHead(title, eyebrow) {
  return `<div class="sheet-head">
    <div class="grab"></div>
    <div class="row">
      <div>
        ${eyebrow ? `<div class="eyebrow" style="margin-bottom:2px">${esc(eyebrow)}</div>` : ''}
        <h3>${esc(title)}</h3>
      </div>
      <button class="sheet-close" data-act="close-sheet" aria-label="Close">${icon('x', 10)}</button>
    </div>
  </div>`;
}

function scrollChat() {
  const c = $('#chat');
  if (c) c.scrollTop = c.scrollHeight;
}

function refreshChat() {
  const c = $('#chat');
  if (c) {
    c.innerHTML = chatHTML();
    requestAnimationFrame(() => { c.scrollTop = c.scrollHeight; });
  }
  const input = $('#chatInput');
  if (input) input.value = '';
}

/* ---------- post detail ---------- */
function postSheet() {
  const p = postById(S.sheetData) || allPosts()[0];
  if (!p) return '';
  const saved = S.savedPosts.has(p.id);
  const c = channelMeta(p.kind);
  return `<div class="sheet tall">
    <div class="sheet-head">
      <div class="grab"></div>
      <div class="row">
        <div>
          <div class="eyebrow" style="margin-bottom:2px">${esc(c.lab)} · Community note</div>
          <h3>${esc(p.author)}'s note</h3>
        </div>
        <button class="sheet-close" data-act="close-sheet" aria-label="Close">${icon('x', 10)}</button>
      </div>
    </div>
    <div class="sheet-body">
      <div class="post-hero">
        ${postCover(p)}
        <span class="post-kind">${esc(c.lab)}</span>
        ${p.credit ? `<span class="post-credit">Photo · ${esc(p.credit)} · Wikimedia Commons</span>` : ''}
      </div>
      <div class="post-author-row">
        <span class="pa-avatar" style="background:var(--${p.tint})">${esc(p.avatar)}</span>
        <div class="grow"><b>${esc(p.author)}</b><small>${esc(p.time)} · in Beijing</small></div>
        <span class="tag soft">${esc(p.tags[0] || 'Note')}</span>
      </div>
      <h2 class="post-detail-title">${esc(p.title)}</h2>
      <p class="post-detail-body">${esc(p.body)}</p>
      <div class="tags">${p.tags.map((t) => tag(t)).join('')}</div>
      <div class="post-detail-stats">
        <span>${icon('heart', 9)} ${esc(p.likes)} likes</span>
        <span>${icon('bookmark', 9)} ${esc(p.saves)} saves</span>
        <span>${icon('comment', 9)} ${p.comments === 0 ? 'No comments yet' : (p.comments || 28) + ' comments'}</span>
      </div>
      ${p.comment ? `<div class="post-comment"><b>${p.comments === 0 ? 'From the author' : 'Comments · ' + (p.comments || 28)}</b>${esc(p.comment)}</div>` : ''}
      <div class="post-actions">
        <button class="post-action primary" data-act="save-post" data-id="${p.id}">${icon(saved ? 'bookmark' : 'heart', 10)}${saved ? 'Saved' : 'Save'}</button>
        ${p.placeId ? `<button class="post-action" data-act="post-place" data-id="${p.placeId}">${icon('pin', 10)}Place details</button>` : ''}
        ${p.routeIndex !== undefined ? `<button class="post-action" data-act="apply-forum-route" data-index="${p.routeIndex}">${icon('route', 10)}Use this route</button>` : ''}
        ${p.eventId ? `<button class="post-action" data-act="forum" data-channel="event">${icon('calendar', 10)}See event</button>` : ''}
      </div>
      <button class="post-action dark" style="width:100%;margin-top:7px" data-act="assistant" data-ctx="Community · ${esc(p.title)}">${icon('sparkle', 10)}Ask Pico if it is worth it</button>
      <div class="post-detail-foot">Posted in the RoamChina Community · content from members</div>
    </div>
  </div>`;
}

/* ---------- journey report ---------- */
function reportSheet() {
  const j = JOURNEYS.find((x) => x.id === S.sheetData) || JOURNEYS[0];
  return `<div class="sheet tall">
    ${sheetHead(`${j.city} trip report`, 'JOURNEY ARCHIVE · ' + j.dates.toUpperCase())}
    <div class="sheet-body">
      <div class="report-hero" style="--rc:var(--${j.color})">
        <div class="rh-badge">${icon('check', 8)} TRIP COMPLETE</div>
        <div class="rh-title">${esc(j.title)}</div>
        <p>${esc(j.blurb)}</p>
        <div class="row" style="flex-wrap:wrap;gap:4px">${j.stamps.map((t) => tag(t, 'lime')).join('')}</div>
      </div>
      <div class="report-stats">
        <div class="rs"><b>${j.newPlaces}</b><span>new places<br>unlocked</span></div>
        <div class="rs"><b>${j.km}</b><span>km<br>walked</span></div>
        <div class="rs"><b>Top ${j.rank}%</b><span>${esc(j.city)}<br>explorers</span></div>
      </div>
      <div class="report-rarity">
        <div class="rr-head"><b>How rare was your route?</b><small>Share of RoamChina travelers who unlocked each place</small></div>
        ${j.rarities.map((r) => `<div class="rr-row">
          <span class="rr-name">${esc(r.name)}</span>
          <span class="rr-bar"><i style="width:${Math.max(4, r.pct)}%"></i></span>
          <b>${r.pct}%</b>
        </div>`).join('')}
      </div>
      <div class="report-award">
        <span class="ra-ico">${icon('star', 12)}</span>
        <span class="grow"><b>${esc(j.rare)}</b><small>Only ${j.rarePct}% of travelers found this — your rarest unlock.</small></span>
      </div>
      <div class="report-foot">${j.places} places visited in total · archived when the trip ended · kept on your device</div>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="toast" data-text="Report saved to your archive" data-icon="download">Save</button>
      <button class="primary" data-act="toast" data-text="Report link copied · ${esc(j.title)}" data-icon="share">Share report</button>
    </div>
  </div>`;
}

/* ---------- assistant ---------- */
function assistantSheet() {
  return `<div class="sheet tall">
    <div class="assistant-head">
      <span class="orb-mini">${sparkleIcon(16)}</span>
      <div class="grow">
        <h3>Pico</h3>
        <div class="ctx">${esc(S.assistantContext)}</div>
      </div>
      <button class="sheet-close" data-act="close-sheet" aria-label="Close">${icon('x', 10)}</button>
    </div>
    <div class="chat" id="chat">${chatHTML()}</div>
    <div class="quick-wrap">
      ${QUICK.map((q) => `<button data-act="quick" data-text="${esc(q)}">${esc(q)}</button>`).join('')}
    </div>
    <div class="chat-input">
      <input id="chatInput" placeholder="Ask Pico about routes, tickets, translation…" aria-label="Ask Pico a question" autocomplete="off">
      <button data-act="send-chat" aria-label="Send">${icon('arrowr', 14)}</button>
    </div>
  </div>`;
}

function assistContextHTML() {
  return `<div class="assist-card">
    <div class="assist-card-top">
      <span class="eyebrow">NOW · 3 days to departure</span>
      <span class="assist-tag">Beijing · 4 days, 3 nights</span>
    </div>
    <div class="assist-stats">
      <div><b>06</b><span>Route stops</span></div>
      <div><b>02</b><span>Travelers</span></div>
      <div><b>6/12</b><span>Checklist</span></div>
    </div>
    <button class="assist-nudge" data-act="checklist">
      <span class="nudge-dot"></span>
      <span class="grow">Forbidden City tickets are tightest · book today</span>
      ${icon('arrowr', 9)}
    </button>
    <div class="assist-plan">
      <div class="assist-plan-head">
        <span>Today's route</span>
        <button data-act="tab" data-tab="plan">Open map ${icon('arrowr', 8)}</button>
      </div>
      <div class="assist-line"><b>09:40</b><span class="grow">Forbidden City · Central Axis</span><em>Booked</em></div>
      <div class="assist-line"><b>13:00</b><span class="grow">Shichahai · Yinding Bridge</span><em>Open</em></div>
      <div class="assist-line"><b>17:00</b><span class="grow">Jingshan · sunset 17:42</span><em class="best">Best</em></div>
    </div>
  </div>`;
}

function chatHTML() {
  return S.messages.map((m) => {
    if (m.role === 'assistant') {
      return `<div class="msg">
        <span class="ava">${sparkleIcon(10)}</span>
        <div>
          <div class="bubble">${m.text}
            ${m.actions ? `<div class="actions">${m.actions.map((a) => `<button class="${a.plain ? 'plain' : ''}" data-act="${a.act}"${a.tab ? ` data-tab="${a.tab}"` : ''}${a.channel ? ` data-channel="${a.channel}"` : ''}>${a.icon ? icon(a.icon, 8) : ''}${esc(a.label)}</button>`).join('')}</div>` : ''}
          </div>
        </div>
      </div>`;
    }
    return `<div class="msg user"><div class="bubble">${esc(m.text)}</div></div>`;
  }).join('')
  + (S.messages.length === 1 ? assistContextHTML() : '')
  + (S.thinking ? `<div class="msg"><span class="ava">${sparkleIcon(10)}</span><div class="bubble"><div class="thinking"><i></i><i></i><i></i></div></div></div>` : '');
}

function replyFor(text) {
  const t = text.toLowerCase();
  if (/route|plan|shichahai|schedule|which day|order/.test(t)) {
    return { role: 'assistant', text: 'I looked at your Central Axis plan: entering the Forbidden City at 09:40 flows best, and moving Shichahai to 13:00 saves 1.2 km. Sunset is 17:42 today — up Jingshan by 17:00 is just right.', actions: [
      { label: 'Apply to route', act: 'apply-ai', icon: 'sparkle' },
      { label: 'Open map', act: 'tab', tab: 'plan', plain: true }
    ] };
  }
  if (/ticket|palace|book|booking|wall|summer palace|museum/.test(t)) {
    return { role: 'assistant', text: 'The Forbidden City still has 812 tickets for 10/15 at 09:00 — ¥60 adult, real name required, so bring your passport. The Great Wall cable car and the Summer Palace are still unbooked; today is a good day to do both.', actions: [
      { label: 'Open checklist', act: 'checklist', icon: 'check' },
      { label: 'Book now', act: 'assistant-ticket', plain: true }
    ] };
  }
  if (/eat|food|duck|coffee|dinner|lunch|restaurant/.test(t)) {
    return { role: 'assistant', text: 'For duck, Siji Minfu at the Forbidden City — arrive before 11 and you walk straight in. For a quiet coffee, Metal Hands in Qianmen has the best light at three.', actions: [
      { label: 'Browse community', act: 'forum', channel: 'restaurant', icon: 'compass' },
      { label: 'Add to route', act: 'add-place', dataId: 'p1', plain: true }
    ] };
  }
  if (/hotel|stay|wangfujing|room/.test(t)) {
    return { role: 'assistant', text: 'The Mandarin Oriental Wangfujing is confirmed: three nights, king room. It is a 12-minute walk to the Forbidden City east gate, so no taxi in the morning. Shall I add luggage storage to your checklist?', actions: [
      { label: 'See booking', act: 'tab', tab: 'me', icon: 'bed' },
      { label: 'Add to checklist', act: 'checklist', plain: true }
    ] };
  }
  if (/translat|allerg|english|phrase|medical|say/.test(t)) {
    return { role: 'assistant', text: 'I have added the sentence about a peanut allergy to your offline phrases, so you can play it without a signal. More urgent lines sit under Translate → Medical.', actions: [
      { label: 'Open Translate', act: 'tab', tab: 'translate', icon: 'chat' },
      { label: 'Offline phrases', act: 'tab', tab: 'translate', plain: true }
    ] };
  }
  if (/weather|rain|temperature|cold|hot|forecast/.test(t)) {
    return { role: 'assistant', text: '10/15–17 sits around 22°C by day and 11°C at night — pack a light jacket. The 18th may bring drizzle; a folding umbrella in your bag is enough.', actions: [
      { label: 'Add to checklist', act: 'checklist', icon: 'check' },
      { label: 'Open trip', act: 'tab', tab: 'trip', plain: true }
    ] };
  }
  if (/checklist|passport|visa|prepare|pack|bring|list/.test(t)) {
    return { role: 'assistant', text: 'Four items are still open: Forbidden City tickets, the Great Wall cable car, the Summer Palace and the National Museum. The Forbidden City is tightest — book today, since it closes on Mondays.', actions: [
      { label: 'Open checklist', act: 'checklist', icon: 'check' }
    ] };
  }
  if (/event|market|night|join|meet/.test(t)) {
    return { role: 'assistant', text: 'There is a hutong night market at the Drum & Bell Towers on the 18th — free entry, 128 going, and you are on the list. I can add a reminder to your trip if you like.', actions: [
      { label: 'See events', act: 'forum', channel: 'event', icon: 'calendar' }
    ] };
  }
  return { role: 'assistant', text: 'Noted. If you want the route changed, tickets booked or a sentence translated, just say so and I will take care of it here.', actions: [
    { label: 'Open route', act: 'tab', tab: 'plan', icon: 'map' },
    { label: 'Pre-trip checklist', act: 'checklist', plain: true }
  ] };
}

function sendChat(text) {
  const t = String(text || '').trim();
  if (!t || S.thinking) return;
  S.messages.push({ role: 'user', text: t });
  S.thinking = true;
  refreshChat();
  clearTimeout(S.chatTimer);
  S.chatTimer = setTimeout(() => {
    S.messages.push(replyFor(t));
    S.thinking = false;
    refreshChat();
  }, 700);
}

/* ---------- similar ---------- */
function similarSheet() {
  return `<div class="sheet tall">
    ${sheetHead('Similar routes', 'CITYWALK · 3 you can borrow')}
    <div class="sheet-body">
      <p class="sub" style="margin:2px 0 9px">Matched against your 6 stops. Applying a route replaces the order and times.</p>
      ${SIMILAR.map((r, i) => `<div class="card sim-route-card">
        <div class="sim-route-top">
          <div class="match-box ${r.match >= 90 ? '' : 'mid'}">${r.match}%</div>
          <div class="sim-route-info">
            <b>${esc(r.title)}</b>
            <small>${esc(r.author)} · ${r.stops} stops · ${esc(r.distance)} · ${esc(r.duration)}</small>
          </div>
        </div>
        <div class="sim-tags">${r.tags.map((t) => tag(t)).join('')}</div>
        <p>${esc(r.highlight)}</p>
        <button class="apply" data-act="apply-similar" data-index="${i}">${icon('check', 10)}Apply to my route</button>
      </div>`).join('')}
    </div>
  </div>`;
}

/* ---------- reorder ---------- */
function reorderSheet() {
  return `<div class="sheet medium">
    ${sheetHead('Reorder stops', 'ROUTE · TUNE THE ORDER')}
    <div class="sheet-body">
      <p class="sub" style="margin:2px 0 8px">Use the arrows to change the order; the route and times recalculate.</p>
      ${S.stops.map((s, i) => `<div class="reorder-row">
        <span class="num">${i + 1}</span>
        <span class="grow"><b>${esc(s.name)}</b><small>${esc(s.time)} · ${esc(s.duration)}</small></span>
        <span class="btns">
          <button data-act="move-stop" data-index="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${icon('up', 10)}</button>
          <button data-act="move-stop" data-index="${i}" data-dir="1" ${i === S.stops.length - 1 ? 'disabled' : ''} aria-label="Move down">${icon('down', 10)}</button>
        </span>
      </div>`).join('')}
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="close-sheet">Cancel</button>
      <button class="primary" data-act="finish-reorder">Done</button>
    </div>
  </div>`;
}

/* ---------- notes ---------- */
function notesSheet() {
  return `<div class="sheet tall">
    ${sheetHead('Trip note', 'NOTE · SAVE AS POSTER')}
    <div class="sheet-body">
      ${posterHTML()}
      <div class="row" style="gap:6px;margin-top:10px">
        <button class="full-btn" data-act="save-note">${icon('download', 11)}Save poster</button>
        <button class="full-btn ink" data-act="copy" data-text="${esc(noteText())}">${icon('copy', 11)}Copy text</button>
      </div>
      <div class="empty-note">Exports at 3:4 — good for the community or a story.</div>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="close-sheet">Close</button>
      <button class="primary" data-act="note-to-forum">Post to community</button>
    </div>
  </div>`;
}

function posterHTML() {
  return `<div class="note-poster">
    <div class="poster-head">
      <div>
        <div class="eyebrow" style="margin-bottom:5px">ROAMCHINA · CITYWALK</div>
        <b>${esc(S.routeName)}</b>
      </div>
      ${tag('DAY 02', 'lime')}
    </div>
    <div class="meta">10/15 · Beijing · 2 travelers · 4.2 km</div>
    <div class="note-stops">
      ${S.stops.map((s, i) => `<div class="note-stop">
        <span class="n">${i + 1}</span>
        <span class="grow"><b>${esc(s.name)}</b><small>${esc(s.duration)} · ${esc(s.tag || 'Slow walk')}</small></span>
        <span class="tm">${esc(s.time)}</span>
      </div>`).join('')}
    </div>
    <div class="note-foot"><span>~5 hr · walk + metro</span><span>ROAMCHINA / 2026</span></div>
  </div>`;
}

function noteText() {
  return `${S.routeName}\n10/15 · Beijing · 2 travelers\n\n${S.stops.map((s, i) => `${i + 1}. ${s.name} ${s.time}`).join('\n')}\n\n4.2 km · ~5 hr · made with RoamChina`;
}

/* ---------- checklist ---------- */
function checklistSheet() {
  const progress = doneCount() / S.checklist.length;
  const cats = ['All', 'Documents', 'Tickets', 'Connectivity', 'Transit'];
  const phaseNames = ['Before you fly', 'Arrival day'];
  return `<div class="sheet tall">
    ${sheetHead('Pre-trip checklist', 'CHECKLIST · 12 ITEMS')}
    <div class="sheet-body">
      <div class="card check-summary">
        ${bigRingHTML(progress)}
        <div class="grow">
          <h3>3 days to departure</h3>
          <p>Done ${doneCount()} of ${S.checklist.length}. The Forbidden City is the tightest — book today.</p>
        </div>
      </div>
      <div class="check-cats">
        ${cats.map((c) => `<button class="chip ${S.checklistCat === c ? 'on' : ''}" data-act="check-cat" data-cat="${c}">${c}</button>`).join('')}
      </div>
      ${phaseNames.map((phase) => {
        const items = S.checklist.filter((c) => c.phase === phase && (S.checklistCat === 'All' || c.cat === S.checklistCat));
        if (!items.length) return '';
        return `<div class="phase-title">${phase} · ${items.length}</div>${items.map(checkRowHTML).join('')}`;
      }).join('')}
      <div class="empty-note">Ticking items updates your progress on the Trip tab.</div>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="close-sheet">Close</button>
      <button class="primary" data-act="checklist-assistant">Ask Pico what is missing</button>
    </div>
  </div>`;
}

function bigRingHTML(progress) {
  const size = 58; const w = 4; const r = (size - w) / 2; const c = 2 * Math.PI * r;
  return `<span class="big-ring">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--paper-warm)" stroke-width="${w}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--ink)" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - progress)}"/>
    </svg>
    <span>${Math.round(progress * 100)}%</span>
  </span>`;
}

function checkRowHTML(c) {
  const done = c.status === 'done';
  return `<div class="check-row ${done ? 'done' : ''}">
    <button class="check-box" data-act="toggle-check" data-id="${c.id}" aria-label="Tick ${esc(c.title)}">${icon('check', 10)}</button>
    <span class="check-info">
      <b>${esc(c.title)}</b>
      <small>${esc(c.meta)}</small>
      ${c.tag ? `<span class="tags">${tag(c.tag, c.tone === 'warn' ? 'warn' : 'soft')}</span>` : ''}
    </span>
    ${done
      ? `<span class="check-action">${esc(c.right || 'Done')}</span>`
      : `<button class="check-action" data-act="check-action" data-id="${c.id}">${esc(c.action || 'View')}</button>`}
  </div>`;
}

/* ---------- place ---------- */
function placeSheet() {
  const p = placeById(S.sheetData) || PLACES[0];
  const saved = S.saved.has(p.id);
  return `<div class="sheet medium">
    ${sheetHead('Place details', 'COMMUNITY · ' + p.area)}
    <div class="sheet-body">
      <div class="place-hero">
        ${placeScene(p)}
        <span class="heat">${icon('flame', 8)}${p.heat}</span>
      </div>
      <div class="place-title">${esc(p.title)}</div>
      <div class="row" style="flex-wrap:wrap;gap:4px">${p.tags.map((t) => tag(t)).join('')}${tag(p.bestTime, 'lime')}</div>
      <div class="place-price">${esc(p.price)}</div>
      <div class="place-note">${esc(p.note)}</div>
      <div class="place-facts">
        <div class="place-fact"><span>Best time</span><b>${esc(p.bestTime)}</b></div>
        <div class="place-fact"><span>Where</span><b>${esc(p.area)}</b></div>
      </div>
      <button class="full-btn" style="margin-top:9px;width:100%" data-act="place-assistant" data-id="${p.id}">${icon('sparkles', 11)}Ask Pico how to fit it in</button>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="save-place" data-id="${p.id}">${icon(saved ? 'check' : 'heart', 10)}${saved ? 'Saved' : 'Save'}</button>
      <button class="primary" data-act="add-place" data-id="${p.id}">Add to today's route</button>
    </div>
  </div>`;
}

function placeScene(p) {
  const bg = p.kind === 'restaurant' ? 'var(--mustard-soft)' : p.kind === 'gift' ? 'var(--pink-soft)' : 'var(--mint-soft)';
  return `<svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="320" height="150" fill="${bg}"/>
    <circle cx="264" cy="36" r="27" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2" opacity=".9"/>
    <path d="M0 118c44-20 82 6 124-8 44-15 86 8 196-4v44H0z" fill="var(--mint)" stroke="var(--ink)" stroke-width="1.2"/>
    <g transform="translate(128 33) scale(2.6)" stroke="var(--ink)" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round">${ICONS[p.symbol] || ICONS.sparkle}</g>
    <path d="M36 28h58M36 42h40" stroke="var(--ink)" stroke-width="1.3" opacity=".5" stroke-linecap="round"/>
  </svg>`;
}

/* ---------- compose ---------- */
function composeSheet() {
  const d = S.draft;
  return `<div class="sheet tall">
    ${sheetHead('Start a citywalk', 'COMMUNITY · POST')}
    <div class="sheet-body">
      <div class="field">
        <label>Event name</label>
        <input data-field="title" value="${esc(d.title)}" placeholder="e.g. Shichahai sunset photo walk" maxlength="30">
      </div>
      <div class="field-row">
        <div class="field"><label>Date</label><input data-field="date" value="${esc(d.date)}" placeholder="11/08 Sat"></div>
        <div class="field"><label>Time</label><input data-field="time" value="${esc(d.time)}" placeholder="14:00 – 18:00"></div>
      </div>
      <div class="field"><label>Meeting point</label><input data-field="place" value="${esc(d.place)}" placeholder="e.g. Yinding Bridge"></div>
      <div class="field"><label>Cost</label><input data-field="fee" value="${esc(d.fee)}" placeholder="Free / ¥20"></div>
      <div class="field"><label>Notes</label><textarea data-field="note" rows="3" placeholder="What would you like to do together?">${esc(d.note)}</textarea></div>
      <div class="preview-card" id="composePreview">${composePreviewHTML()}</div>
      <div class="publish-note">Posts appear in Local events and can be edited or cancelled any time.</div>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="close-sheet">Cancel</button>
      <button class="primary" id="publishBtn" data-act="publish-event">Publish event</button>
    </div>
  </div>`;
}

function composePreviewHTML() {
  const d = S.draft;
  return `<div class="lab">PREVIEW · COMMUNITY CARD</div>
    <b>${esc(d.title.trim() || 'Your event name')}</b>
    <p>${esc(d.date)} ${esc(d.time)} · ${esc(d.place.trim() || 'Meeting point to be confirmed')} · ${esc(d.fee)}</p>
    <p>${esc(d.note.trim() || 'Hosted by you · all welcome')}</p>`;
}

function updateComposePreview() {
  const box = $('#composePreview');
  if (box) box.innerHTML = composePreviewHTML();
  const btn = $('#publishBtn');
  if (btn) {
    const ready = !!(S.draft.title.trim() && S.draft.place.trim());
    btn.disabled = !ready;
    btn.style.opacity = ready ? '1' : '.55';
  }
}

/* ---------- phrase ---------- */
function phraseSheet() {
  const p = S.sheetData || PHRASES[0];
  return `<div class="sheet medium">
    ${sheetHead('Emergency phrase', 'OFFLINE · PLAY ALOUD')}
    <div class="sheet-body">
      <div class="phrase-focus">
        <div class="zh">${esc(p.zh)}</div>
        <div class="en">${esc(p.en)}</div>
        <button class="speaker" data-act="speak" data-text="${esc(p.en)}" data-lang="en" aria-label="Play English">${icon('speaker', 17)}</button>
        <div class="hint">Tap the speaker to play · works offline</div>
      </div>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="copy" data-text="${esc(p.en)}">${icon('copy', 9)}English</button>
      <button class="primary" data-act="copy" data-text="${esc(p.zh)}">${icon('copy', 9)}Copy Chinese</button>
    </div>
  </div>`;
}

/* ================= ACTIONS ================= */
function openAssistant(ctx) {
  if (ctx) S.assistantContext = ctx;
  openSheet('assistant');
}

function applyRouteSuggestion(silent) {
  const order = ['s1', 's2', 's4', 's3', 's5', 's6'];
  const next = order.map((id) => S.stops.find((s) => s.id === id)).filter(Boolean);
  if (next.length === S.stops.length) S.stops = next;
  const shichahai = S.stops.find((s) => s.id === 's4');
  if (shichahai) shichahai.time = '13:00';
  const jingshan = S.stops.find((s) => s.id === 's3');
  if (jingshan) jingshan.time = '15:00';
  S.aiVisible = false;
  S.applied = true;
  S.routeName = 'Central Axis · Tuned';
  render();
  if (!silent) toast("Pico's suggestion applied · 1.2 km shorter", 'sparkle');
}

function applySimilar(index) {
  const r = SIMILAR[index] || SIMILAR[0];
  const orders = [
    ['s1', 's2', 's3', 's4', 's5', 's6'],
    ['s1', 's2', 's3', 's5', 's4', 's6'],
    ['s1', 's2', 's4', 's3', 's5', 's6']
  ];
  const times = ['09:00', '09:40', '13:00', '15:00', '16:30', '17:30'];
  const next = orders[index % orders.length].map((id) => S.stops.find((s) => s.id === id)).filter(Boolean);
  if (next.length) S.stops = next.map((s, i) => ({ ...s, time: times[i] || s.time }));
  S.routeName = r.title;
  S.aiVisible = false;
  closeSheet();
  S.tab = 'plan';
  render(true);
  toast(`Applied “${r.title}”`, 'check');
}

function applyForumRoute(index) {
  const r = FORUM_ROUTES[index] || FORUM_ROUTES[0];
  const orders = [
    ['s1', 's2', 's3', 's5', 's4', 's6'],
    ['s1', 's2', 's3', 's4', 's5', 's6'],
    ['s1', 's2', 's4', 's3', 's6', 's5']
  ];
  const times = ['09:00', '09:40', '13:00', '15:00', '16:30', '17:30'];
  const next = orders[index % orders.length].map((id) => S.stops.find((s) => s.id === id)).filter(Boolean);
  if (next.length) S.stops = next.map((s, i) => ({ ...s, time: times[i] || s.time }));
  S.routeName = r.title;
  S.aiVisible = false;
  closeSheet();
  S.tab = 'plan';
  render(true);
  toast(`Applied “${r.title}”`, 'check');
}

function speak(text, lang) {
  if (!('speechSynthesis' in window)) { toast('This browser cannot play audio', 'info'); return; }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    u.rate = .95;
    window.speechSynthesis.speak(u);
    toast('Playing aloud', 'speaker');
  } catch (e) {
    toast('Playback failed — check your system voice', 'info');
  }
}

function copyText(text) {
  const done = () => toast('Copied to clipboard', 'copy');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    done();
  } catch (e) {
    toast('Copy failed — select the text manually', 'copy');
  }
}

async function shareRoute() {
  const data = { title: S.routeName, text: `${S.routeName} · ${S.stops.length} stops · 4.2 km · RoamChina`, url: location.href };
  if (navigator.share) {
    try { await navigator.share(data); return; }
    catch (err) { if (err && err.name === 'AbortError') return; }
  }
  copyText(location.href);
}

function toggleMic() {
  if (S.listening) {
    S.listening = false;
    finishLive();
    return;
  }
  S.listening = true;
  render();
  clearTimeout(S.micTimer);
  S.micTimer = setTimeout(() => {
    S.listening = false;
    finishLive();
  }, 2600);
}

function finishLive() {
  const next = LIVE_MORE[(S.liveExtra || 0) % LIVE_MORE.length];
  S.liveExtra = (S.liveExtra || 0) + 1;
  S.live.push({ ...next });
  S.listening = false;
  render();
  toast('Recognized and translated into English', 'mic');
  if (S.autoplay) speak(next.en, 'en');
}

function startScan() {
  if (S.photoScanning) return;
  S.photoScanning = true;
  S.photoScanned = false;
  render();
  clearTimeout(S.scanTimer);
  S.scanTimer = setTimeout(() => {
    S.photoScanning = false;
    S.photoScanned = true;
    render();
    toast('Found 4 pieces of text · translated', 'camera');
    if (S.autoplay) {
      const row = (S.photoSample === 'menu' ? MENU : SIGN)[0];
      speak(row.en, 'en');
    }
  }, 1700);
}

function toggleCheck(id) {
  const item = S.checklist.find((c) => c.id === id);
  if (!item) return;
  item.status = item.status === 'done' ? 'todo' : 'done';
  if (item.status === 'done') item.right = 'Done';
  const body = $('.sheet-body');
  const top = body ? body.scrollTop : 0;
  render();
  requestAnimationFrame(() => {
    const nb = $('.sheet-body');
    if (nb) nb.scrollTop = top;
  });
  toast(item.status === 'done' ? 'One more done' : 'Unticked', 'check');
}

function moveStop(index, dir) {
  const to = index + dir;
  if (to < 0 || to >= S.stops.length) return;
  const body = $('.sheet-body');
  const top = body ? body.scrollTop : 0;
  const arr = S.stops.slice();
  [arr[index], arr[to]] = [arr[to], arr[index]];
  S.stops = arr;
  renderSheet();
  requestAnimationFrame(() => {
    const nb = $('.sheet-body');
    if (nb) nb.scrollTop = top;
  });
}

function publishEvent() {
  const d = S.draft;
  if (!d.title.trim() || !d.place.trim()) { toast('Add an event name and a meeting point', 'info'); return; }
  const event = {
    id: 'e' + Date.now(),
    title: d.title.trim(),
    subtitle: d.note.trim() || 'A citywalk by you · all welcome',
    date: d.date.trim() || '11/08 Sat',
    time: d.time.trim() || '14:00 – 18:00',
    place: d.place.trim(),
    host: '@Wang Bo',
    fee: d.fee.trim() || 'Free',
    attendees: 1,
    tint: 'lime'
  };
  S.events.unshift(event);
  S.joined.add(event.id);
  S.userPosts.unshift({
    id: 'n' + Date.now(),
    author: 'Wang Bo', avatar: 'W', tint: 'lime', time: 'Just now', kind: 'event',
    title: event.title, body: event.subtitle,
    tags: [event.date, event.fee], likes: '0', saves: '0', comments: 0,
    art: 'sunset', h: 148, eventId: event.id,
    comment: 'Hosted by you · all welcome'
  });
  S.draft = { title: '', date: '11/08 Sat', time: '14:00 – 18:00', place: '', fee: 'Free', note: '' };
  closeSheet();
  S.forumChannel = 'event';
  go('forum', 'event');
  toast('Event published · invite your friends', 'sparkle');
}

/* ================= EVENTS ================= */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (act === 'noop') return;
  switch (act) {
    case 'tab':
      closeSheet();
      go(el.dataset.tab || 'trip', el.dataset.channel || null);
      break;
    case 'forum':
      closeSheet();
      go('forum', el.dataset.channel || null);
      break;
    case 'feed-filter': {
      const key = el.dataset.key || 'all';
      if (S.forumChannel) go('forum', key === 'all' ? null : key);
      else { S.forumFilter = key; render(); }
      break;
    }
    case 'post':
      openSheet('post', el.dataset.id);
      break;
    case 'quiz': {
      const wasComplete = !!quizPersona();
      S.quiz[el.dataset.key] = el.dataset.val;
      render();
      if (!wasComplete && quizPersona()) {
        requestAnimationFrame(() => {
          document.querySelector('.quiz-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
      break;
    }
    case 'quiz-reset':
      S.quiz = { days: null, style: null, theme: null };
      render();
      requestAnimationFrame(() => {
        document.querySelector('.quiz-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      break;
    case 'report':
      openSheet('report', el.dataset.id);
      break;
    case 'save-post': {
      const id = el.dataset.id;
      if (S.savedPosts.has(id)) { S.savedPosts.delete(id); toast('Removed from saved'); } else { S.savedPosts.add(id); toast('Note saved · find it under Me', 'bookmark'); }
      if (S.sheet === 'post') renderSheet(); else render();
      break;
    }
    case 'post-place':
      openSheet('place', el.dataset.id);
      break;
    case 'book-attraction': {
      const a = S.attractions.find((x) => x.id === el.dataset.id);
      if (!a || a.booked) return;
      a.booked = true;
      a.code = 'RC-' + (3000 + Math.floor(Math.random() * 6000));
      render();
      toast(`${a.name} booked · receipt saved`, 'check');
      break;
    }
    case 'book-all': {
      const pending = S.attractions.filter((a) => !a.booked);
      if (!pending.length) { toast('Every attraction is booked', 'check'); return; }
      pending.forEach((a) => { a.booked = true; a.code = 'RC-' + (3000 + Math.floor(Math.random() * 6000)); });
      render();
      toast(`Booked ${pending.length} attractions · receipts saved`, 'check');
      break;
    }
    case 'resv-info': {
      const a = S.attractions.find((x) => x.id === el.dataset.id);
      if (!a) return;
      toast(a.booked ? `${a.name} · receipt ${a.code}` : `${a.name} · ${a.note || 'Book during opening hours'}`, a.booked ? 'ticket' : 'info');
      break;
    }
    case 'toggle-bookings':
      S.showBookings = !S.showBookings;
      render();
      break;
    case 'assistant':
      openAssistant(el.dataset.ctx || null);
      break;
    case 'close-sheet':
      closeSheet();
      break;
    case 'compose':
      closeSheet();
      openSheet('compose');
      break;
    case 'similar':
      openSheet('similar');
      break;
    case 'reorder':
      openSheet('reorder');
      break;
    case 'finish-reorder':
      closeSheet();
      render();
      toast('Order updated · times recalculated', 'refresh');
      break;
    case 'notes':
      openSheet('notes');
      break;
    case 'checklist':
      closeSheet();
      openSheet('checklist');
      break;
    case 'back-forum':
      go('forum');
      break;
    case 'search-clear':
      S.search = '';
      render();
      break;
    case 'toggle-trip-plan': {
      const index = Number(el.dataset.index);
      S.expandedPlan = S.expandedPlan === index ? -1 : index;
      render();
      break;
    }
    case 'apply-ai':
      closeSheet();
      applyRouteSuggestion();
      break;
    case 'apply-similar':
      applySimilar(Number(el.dataset.index || 0));
      break;
    case 'apply-forum-route':
      applyForumRoute(Number(el.dataset.index || 0));
      break;
    case 'layer':
      S.layer = el.dataset.layer || 'mine';
      render();
      break;
    case 'toggle-edit':
      S.editMode = !S.editMode;
      if (S.editMode) S.selected = null;
      render();
      toast(S.editMode ? 'Drag the numbered dots to move stops' : 'Stops saved', S.editMode ? 'hand' : 'check');
      break;
    case 'select-stop':
      S.selected = S.selected === el.dataset.id ? null : el.dataset.id;
      render();
      break;
    case 'share-route':
      shareRoute();
      break;
    case 'join-event': {
      const id = el.dataset.id;
      if (S.joined.has(id)) { S.joined.delete(id); toast('Left the event'); } else { S.joined.add(id); toast('You are going · reminder added', 'check'); }
      render();
      break;
    }
    case 'place':
      openSheet('place', el.dataset.id);
      break;
    case 'add-place':
      closeSheet();
      S.tab = 'plan';
      render(true);
      toast("Added to today's route", 'plus');
      break;
    case 'save-place': {
      const id = el.dataset.id;
      if (S.saved.has(id)) { S.saved.delete(id); toast('Removed from saved'); } else { S.saved.add(id); toast('Saved · find it under Me', 'heart'); }
      renderSheet();
      break;
    }
    case 'place-assistant': {
      const p = placeById(el.dataset.id);
      openAssistant(p ? `Community · ${p.title}` : null);
      break;
    }
    case 'mode':
      S.translateMode = el.dataset.mode || 'live';
      if (S.translateMode !== 'live') S.listening = false;
      render();
      break;
    case 'scenario':
      S.scenario = el.dataset.scenario || 'medical';
      render();
      break;
    case 'pick-scenario':
      S.scenario = el.dataset.scenario || 'medical';
      S.translateMode = 'offline';
      render();
      toast('Switched to the offline phrasebook', 'download');
      break;
    case 'mic':
      toggleMic();
      break;
    case 'sample':
      S.photoSample = el.dataset.sample || 'menu';
      S.photoScanned = false;
      S.photoScanning = false;
      render();
      break;
    case 'shutter':
      startScan();
      break;
    case 'speak':
      speak(el.dataset.text || '', el.dataset.lang || 'en');
      break;
    case 'copy':
      copyText(el.dataset.text || '');
      break;
    case 'favorite-phrase':
      toast('Saved to offline phrases', 'heart');
      break;
    case 'phrase': {
      const p = PHRASES[Number(el.dataset.index)];
      if (p) openSheet('phrase', p);
      break;
    }
    case 'toggle-setting': {
      const key = el.dataset.key;
      if (key === 'notifications' || key === 'autoplay') {
        S[key] = !S[key];
        render();
        toast(key === 'notifications' ? (S.notifications ? 'Trip reminders on' : 'Trip reminders off') : (S.autoplay ? 'Auto-play on' : 'Auto-play off'), key === 'notifications' ? 'bell' : 'speaker');
      }
      break;
    }
    case 'toggle-check':
      toggleCheck(el.dataset.id);
      break;
    case 'check-action': {
      const item = S.checklist.find((c) => c.id === el.dataset.id);
      if (item) toast(`Opened “${item.title}” · ${item.action}`, 'check');
      break;
    }
    case 'check-cat':
      S.checklistCat = el.dataset.cat || 'All';
      renderSheet();
      break;
    case 'checklist-assistant':
      openAssistant('Checklist · what is missing');
      break;
    case 'move-stop':
      moveStop(Number(el.dataset.index), Number(el.dataset.dir));
      break;
    case 'publish-event':
      publishEvent();
      break;
    case 'save-note':
      toast('Poster saved to Photos', 'download');
      break;
    case 'note-to-forum':
      closeSheet();
      go('forum');
      toast('Note posted to the community', 'sparkle');
      break;
    case 'quick':
    case 'send-chat': {
      const input = $('#chatInput');
      const text = act === 'quick' ? el.dataset.text : (input ? input.value : '');
      sendChat(text);
      break;
    }
    case 'assistant-ticket':
      closeSheet();
      S.tab = 'trip';
      render(true);
      toast('Opened Forbidden City booking', 'ticket');
      break;
    case 'toast':
      toast(el.dataset.text || 'Done', el.dataset.icon || 'check');
      break;
    default:
      break;
  }
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.matches('[data-role="search"]')) {
    S.search = t.value;
    const body = $('#forumBody');
    if (body) body.innerHTML = forumBodyHTML();
    const clear = $('.forum-search .clear');
    if (!clear && S.search) {
      const wrap = $('.forum-search');
      if (wrap) wrap.insertAdjacentHTML('beforeend', `<button class="clear" data-act="search-clear" aria-label="Clear search">${icon('x', 8)}</button>`);
    }
    if (clear && !S.search) clear.remove();
  }
  if (t.matches('[data-field]')) {
    S.draft[t.dataset.field] = t.value;
    updateComposePreview();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && S.sheet) { closeSheet(); return; }
  if (e.key === 'Enter' && e.target && e.target.id === 'chatInput') {
    e.preventDefault();
    sendChat(e.target.value);
    return;
  }
  if (e.key === 'Enter' && e.target && e.target.matches('[role="button"][data-act]')) {
    e.preventDefault();
    e.target.click();
  }
});

window.addEventListener('hashchange', () => {
  const raw = location.hash.replace(/^#/, '');
  if (raw.startsWith('forum-')) {
    const ch = raw.slice(6);
    if (CHANNELS.some((c) => c.id === ch)) {
      S.tab = 'forum';
      S.forumChannel = ch;
      render(true);
      return;
    }
  }
  const tab = ['trip', 'plan', 'forum', 'translate', 'me'].includes(raw) ? raw : 'trip';
  if (tab !== S.tab || S.forumChannel) {
    S.tab = tab;
    S.forumChannel = null;
    render(true);
  }
});

/* ================= BOOT ================= */
function boot() {
  const raw = location.hash.replace(/^#/, '');
  if (raw.startsWith('forum-')) {
    const ch = raw.slice(6);
    if (CHANNELS.some((c) => c.id === ch)) {
      S.tab = 'forum';
      S.forumChannel = ch;
    }
  } else if (['trip', 'plan', 'forum', 'translate', 'me'].includes(raw)) {
    S.tab = raw;
  }
  render(true);
  setTimeout(() => {
    try {
      if (!sessionStorage.getItem('roamchina-hint')) {
        sessionStorage.setItem('roamchina-hint', '1');
        toast('Try Adjust stops on the Plan tab, then drag a numbered dot', 'hand');
      }
    } catch (e) { /* storage unavailable */ }
  }, 1100);
}

boot();
})();
