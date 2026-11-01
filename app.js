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
  grip: '<path d="M5 7h14M5 12h14M5 17h14"/>',
  updown: '<path d="M8 4v16M4.5 7.5 8 4l3.5 3.5M16 20V4M12.5 16.5 16 20l3.5-3.5"/>',
  expand: '<path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/>',
  contract: '<path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5"/>',
  move: '<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
  star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.7l6.2-.9L12 3z"/>',
  fork: '<path d="M7 3v6a2.5 2.5 0 0 0 5 0V3M9.5 11.5V21M16.5 3c-1.5 1.6-2 3.4-2 5.5 0 2 .8 2.8 2 2.8V21"/>',
  route: '<circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8.4 18H14a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c.6-3.6 3-5.4 6-5.4S14.4 16.4 15 20"/><path d="M15.5 5.5a3 3 0 0 1 0 5M17 14.8c2.3.5 3.6 2.2 4 5.2"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
  trash: '<path d="M4.5 6.5h15M9 6.5V4h6v2.5M6.5 6.5 8 21h8l1.5-14.5M10 10v7M14 10v7"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v4.5h-4.5"/>',
  wave: '<path d="M3 12c2 0 2-3 4-3s2 6 4 6 2-6 4-6 2 3 4 3"/>',
  globe: '<circle cx="12" cy="12" r="8.6"/><path d="M3.6 12h16.8M12 3.4c2.4 2.4 3.6 5.3 3.6 8.6s-1.2 6.2-3.6 8.6c-2.4-2.4-3.6-5.3-3.6-8.6S9.6 5.8 12 3.4z"/>'
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
  { id: 'a1', name: 'Forbidden City', day: 1, date: '10/15', week: 'Wed', time: '09:00', people: '2 guests', price: '¥120', booked: true, code: 'RC-8821', note: 'In at Meridian Gate · out at Shenwu Gate' },
  { id: 'a2', name: 'Badaling Great Wall', day: 2, date: '10/16', week: 'Thu', time: '08:30', people: '2 guests', price: '¥80', booked: false, note: 'ID required · cable car extra' },
  { id: 'a3', name: 'Summer Palace', day: 3, date: '10/17', week: 'Fri', time: '09:00', people: '2 guests', price: '¥60', booked: false, note: 'Combined ticket · East Palace Gate is easiest' },
  { id: 'a4', name: 'National Museum of China', day: 3, date: '10/17', week: 'Fri', time: '14:00', people: '2 guests', price: 'Free', booked: false, note: 'Real-name booking in advance' }
];

/* Trip dates are editable: the itinerary is seeded with 10/15 but the header
   date line opens a date sheet, and every day/weekday follows from it. */
const DEFAULT_TRIP_START = '2026-10-15';

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

const EXTRA_TRIP_PLANS = [
  {
    date: '10/19', week: 'Mon', day: 5, title: 'Temple of Heaven & Beihai',
    meta: '4 stops · 5.1 km · ~6 hr', tag: 'Pico pick', tagStyle: 'lime',
    stops: [
      { name: 'Temple of Heaven', time: '09:00' }, { name: 'Lunch in Qianmen', time: '12:30' },
      { name: 'Beihai Park', time: '15:00' }, { name: 'Shichahai at dusk', time: '18:00' }
    ],
    note: 'Enter the Temple of Heaven from the south gate · rent a boat if the weather holds'
  },
  {
    date: '10/20', week: 'Tue', day: 6, title: 'Museum morning · Departure',
    meta: '3 stops · 2.4 km · ~5 hr', tag: 'Departure', tagStyle: 'ok',
    stops: [
      { name: 'National Museum of China', time: '09:30' }, { name: 'Lunch in Qianmen', time: '12:30' },
      { name: 'Beijing Capital Airport', time: '16:00' }
    ],
    note: 'Real-name booking needed for the museum · flight at 18:40'
  }
];

/* swipeable photo strip on the today card — real Beijing shots */
const TRIP_HERO = [
  { src: 'img/trip/today-hero.jpg', name: 'Hall of Supreme Harmony', credit: 'Photo N509FZ / CC BY-SA 4.0' },
  { src: 'img/trip/hero-2.jpg', name: 'Forbidden City from Jingshan', credit: 'Photo EditQ / CC BY-SA 4.0' },
  { src: 'img/trip/hero-3.jpg', name: 'Houhai after dark', credit: 'Photo Morio / CC BY-SA 4.0' },
  { src: 'img/trip/hero-4.jpg', name: 'Drum Tower, 17:30 stop', credit: 'Photo Marek Śliwecki / CC BY-SA 4.0' },
  { src: 'img/trip/hero-5.jpg', name: 'Corner Tower in moonlight', credit: 'Photo Morio / CC BY-SA 4.0' }
];

/* travel-style check on the trip page */
const QUIZ = [
  { key: 'days', label: 'How many days do you like?', options: ['2–3 days', '4–5 days', '6+ days', 'Surprise me'] },
  { key: 'style', label: 'Your kind of holiday', options: ['Slow culture', 'Food first', 'Outdoors', 'Night owl', 'Family friendly', 'Budget smart'] },
  { key: 'theme', label: 'A theme, or none?', options: ['Imperial history', 'Hutongs & coffee', 'Art & design', 'Nature & parks', 'Night markets', 'No theme'] }
];

function quizPersona() {
  const q = S.quiz;
  if (!q.days || !q.style || !q.theme) return null;
  const titles = {
    'Slow culture': { title: 'The Slow Culture Wanderer', icon: 'compass' },
    'Food first': { title: 'The Table-First Wanderer', icon: 'fork' },
    'Outdoors': { title: 'The Open-Air Rambler', icon: 'walk' },
    'Night owl': { title: 'The After-Dark Flâneur', icon: 'star' },
    'Family friendly': { title: 'The Easy-Going Family Wanderer', icon: 'users' },
    'Budget smart': { title: 'The Shrewd City Wanderer', icon: 'ticket' }
  };
  const base = titles[q.style] || titles['Slow culture'];
  const axisThemes = ['Imperial history', 'Hutongs & coffee', 'Night markets'];
  const fit = axisThemes.includes(q.theme) ? 'Central Axis' : 'Imperial Gardens';
  return {
    ...base,
    meta: `${q.days} · ${q.style} · ${q.theme}`,
    metaParts: [q.days, q.style, q.theme],
    note: (q.note || '').trim(),
    fit
  };
}

/* translate a single known UI/content label; leaves proper nouns alone */
function tr(key) { return S.lang === 'zh' ? (ZH[key] || key) : key; }

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
  hero: 0,
  quiz: { days: null, style: null, theme: null, note: '' },
  tripStart: DEFAULT_TRIP_START,
  dateDraft: null,
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
  assistantContext: 'New trip · Planning with Pico',
  planning: true,
  planBuilt: false,
  welcome: false,
  lang: 'en',
  tripWrapped: false,
  recap: null,
  recapSlide: 0,
  tripDays: null,
  tripDay: 0,
  tripEdit: false,
  mapExpanded: false,
  tripSaved: false,
  tripDirty: false,
  tripLive: false,
  liveStop: 0,
  messages: [{ role: 'assistant', text: "Hi, I'm Pico. Tell me what kind of trip you like and I'll build your first Beijing plan — route order, timing and all." }],
  thinking: false,
  draft: { title: '', date: '11/08 Sat', time: '14:00 – 18:00', place: '', fee: 'Free', note: '' },
  toastTimer: null,
  scanTimer: null,
  micTimer: null,
  chatTimer: null
};

/* ---------- live Pico endpoint ---------- */
/* The API key never reaches the browser: this points at the hosted function
   (or the local proxy while developing). A static page without a backend gets
   an explicit "not connected" reply instead of fake travel facts. */
const PICO_ENDPOINT = (() => {
  if (typeof window.PICO_CHAT_ENDPOINT === 'string' && window.PICO_CHAT_ENDPOINT) return window.PICO_CHAT_ENDPOINT;
  const host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return location.port === '8787' ? '/api/chat' : 'http://127.0.0.1:8787/api/chat';
  }
  if (host === 'roamchina-pico-6n9ilgtpldd.qoder.website') return '/functions/v1/app/chat';
  if (host.endsWith('.qoder.site') || host.endsWith('.qoder.website')) return '/functions/v1/app/chat';
  if (host.endsWith('.trycloudflare.com') || host.endsWith('.ngrok-free.app')) return '/api/chat';
  return '';
})();

function picoContext() {
  const day = S.tab === 'trip' && S.planBuilt ? activeDay() : null;
  return {
    tab: TAB_CTX[S.tab] || S.tab,
    day: day ? `${day.title} · ${day.date}` : '',
    planBuilt: S.planBuilt,
    days: S.planBuilt ? tripDayCount() : undefined,
    style: S.quiz.style || '',
    theme: S.quiz.theme || '',
    note: (S.quiz.note || '').trim().slice(0, 140),
    stage: S.tripLive ? 'Journey in progress' : S.planBuilt ? 'Plan saved' : 'Planning the first trip',
    language: S.lang
  };
}

function chatHistory() {
  return S.messages.slice(-12).map((m) => {
    const raw = typeof m.raw === 'string' ? m.raw : (m.text && !/[<>]/.test(m.text) ? m.text : '');
    return { role: m.role, content: raw };
  }).filter((m) => m.content);
}

/* ---------- helpers ---------- */
/* UI chrome switches between English and Chinese. Place names, post bodies and
   demo content stay in their original language. */
const ZH = {
  // shell
  'Trip': '行程', 'Plan': '计划', 'Community': '社区', 'Translate': '翻译', 'Me': '我的',
  'Ask Pico': '问 Pico', 'Close': '关闭', 'Done': '完成', 'Save': '保存', 'Cancel': '取消',
  'New trip · Planning with Pico': '新旅程 · 和 Pico 一起规划',
  'Ask Pico about routes, tickets, translation…': '问 Pico 路线、门票、翻译…',
  'Live AI': '实时 AI',
  'Not connected': '未连接',
  "Pico's live model isn't connected on this static page. Open the hosted RoamChina demo to chat for real.": '这个静态页面上没有连接 Pico 的实时模型。打开线上版 RoamChina 就能和真的 Pico 聊天。',
  "Pico is getting a lot of questions right now. Try again in a minute.": 'Pico 现在收到的问题有点多，稍等一分钟再试。',
  "Pico couldn't reach the live model just now. Try once more in a moment.": 'Pico 刚才没连上实时模型，稍等一下再试一次。',
  'That took too long. Check the connection and ask me again.': '等得太久了，检查一下网络再问我一次。',
  'Ask Pico a question': '向 Pico 提问',
  'Rework my route': '重排我的路线', 'Any palace tickets left?': '故宫还有票吗？',
  'Where should I eat?': '去哪儿吃？', 'Translate: I have an allergy': '翻译：我过敏',
  'Check my pre-trip list': '检查行前清单',
  'Share': '分享', 'Share report': '分享报告', 'Share recap': '分享总结', 'Next': '下一步',
  'Back': '返回', 'Finish': '完成', 'Copy': '复制', 'Search': '搜索', 'Add': '添加',
  'Open': '打开', 'Booked': '已预约', 'Book': '预约', 'Free': '免费', 'Today': '今天',
  // trip header
  'My trip / BEIJING': '我的行程 / 北京',
  'Today · Day 1': '今天 · 第 1 天',
  'Your route': '你的路线', 'Your days': '你的日程',
  'Travel style check': '旅行风格测试',
  'Pico built this plan': 'Pico 为你规划', 'Adjust': '调整',
  'Unsaved changes': '有未保存的修改', 'Save plan': '保存计划', 'Start trip': '开始旅程',
  'Plan saved': '计划已保存', 'Plan ready': '计划已就绪',
  'Edit pins': '编辑点位', 'Reorder': '重新排序', 'Add stop': '添加站点',
  'Similar routes': '相似路线', 'Saved': '已保存', 'Draft plan': '草稿计划',
  'From the community': '来自社区', 'Stops': '站点',
  'DAY 01': '第 01 天', 'DAY 02': '第 02 天', 'DAY 03': '第 03 天', 'DAY 04': '第 04 天',
  'Just started · first stop ahead': '刚出发 · 下一站就在前面',
  'On the move': '在路上', 'Day complete': '今日完成', 'Trip complete': '旅程完成',
  'Car booked': '已订车', 'Tickets to book': '待订票', 'Departure': '离京', 'Pico pick': 'Pico 推荐',
  'Central Axis · Palace and Hutongs': '中轴线 · 宫殿与胡同',
  'Great Wall Day · Badaling': '长城日 · 八达岭',
  'Imperial Gardens · Palace & Museum': '皇家园林 · 宫殿与博物馆',
  'Slow Hutongs · Departure': '慢游胡同 · 离京',
  'Temple of Heaven & Beihai': '天坛与北海',
  'Museum morning · Departure': '博物馆上午 · 离京',
  'Bring your passport · it is windy up there, pack an extra layer': '带上护照 · 上面风大，多带一件外套',
  'The National Museum needs a real-name booking — bring your passport': '国家博物馆需要实名预约——记得带护照',
  'Flight at 18:40 · be at the airport 2.5 hr ahead': '航班 18:40 · 提前 2.5 小时到机场',
  'Enter the Temple of Heaven from the south gate · rent a boat if the weather holds': '从南门进天坛 · 天气好就租条船',
  'Real-name booking needed for the museum · flight at 18:40': '博物馆需实名预约 · 航班 18:40',
  'Central Axis · Forbidden City & Jingshan': '中轴线 · 故宫与景山',
  'Great Wall · Badaling by private car': '长城 · 专车去八达岭',
  'Imperial gardens · Palace & museum': '皇家园林 · 宫殿与博物馆',
  'Slow hutongs · departure': '慢游胡同 · 离京',
  'YOUR TRAVEL TITLE': '你的旅行称号', 'New plan': '新计划', 'Beijing': '北京',
  'Chengdu': '成都', 'Shanghai': '上海',
  'Apply': '应用', '1.2 km less': '少走 1.2 公里',
  'Pico: move Shichahai to 13:00': 'Pico：把什刹海挪到 13:00',
  // places along the route
  'Tiananmen Square': '天安门广场', 'Forbidden City': '故宫',
  'Jingshan Park': '景山公园', 'Jingshan, Wanchun Pavilion': '景山 · 万春亭', 'Jingshan': '景山',
  'Shichahai': '什刹海', 'Nanluoguxiang': '南锣鼓巷', 'Drum & Bell Towers': '鼓楼与钟楼',
  'Leave the hotel': '离开酒店', 'Hotel pickup': '酒店接送',
  'Badaling Great Wall': '八达岭长城', 'Olympic Forest Park': '奥林匹克森林公园',
  'Summer Palace': '颐和园', 'Lunch in Wudaokou': '五道口午餐',
  'National Museum of China': '中国国家博物馆', 'Qianmen Street': '前门大街',
  'Temple of Heaven': '天坛', 'Temple of Heaven Park': '天坛公园',
  'Lunch in Qianmen': '前门午餐', 'Beihai Park': '北海公园',
  'Shichahai at dusk': '什刹海 · 黄昏', 'Daoxiangcun run': '稻香村采购',
  'Beijing Capital Airport': '北京首都机场',
  'Siji Minfu · Forbidden City': '四季民福 · 故宫店',
  'Manhengji · Niujie': '满恒记 · 牛街',
  'Pangmei Noodle House · Beixinqiao': '胖妹面庄 · 北新桥',
  'Metal Hands · Qianmen': '铁手咖啡 · 前门',
  'Daoxiangcun · Local gift sweets': '稻香村 · 伴手礼',
  'Palace Shop · Fridge magnets': '故宫文创 · 冰箱贴',
  'Tongrentang · Sour plum mix': '同仁堂 · 酸梅汤',
  'Sunset at Jingshan': '景山日落',
  'PICO BUILT THIS PLAN': 'PICO 为你规划', 'Pico built this plan': 'Pico 为你规划',
  'Ask Pico': '问 Pico', 'Your travel plan': '你的旅行计划',
  "Hi, I'm Pico. Tell me what kind of trip you like and I'll build your first Beijing plan — route order, timing and all.": '嗨，我是 Pico。告诉我你喜欢什么样的旅行，我来搭好第一份北京计划——顺序、时间都算好。',
  'Start here': '从这里开始', 'on the route': '在路线上',
  'Answer all three for your title': '答完三题解锁称号',
  'Retake': '重测',
  'Pick one per question — it only changes your suggestion, never the plan.': '每题选一个——只影响推荐，不改行程。',
  'Answer all three first': '先答完三道题',
  'Next stop': '下一站', 'Next day': '下一天', 'Back to plan': '回到计划',
  'End live trip': '结束实时旅程', 'End': '结束',
  'Live': '实时', 'NOW': '当前', 'UP NEXT': '下一站', 'YOU ARE HERE': '你在这里',
  'You are here': '你在这里', 'all stops covered': '全部站点完成', 'finished': '结束',
  'Finish day': '结束今天', 'LAST STOP': '最后一站', 'Finish here': '在这里结束',
  'Tap Next stop to wrap up the day': '点“下一站”结束今天', 'On the route': '在路线上',
  'Great Wall Day': '长城日', 'Slow Hutongs': '慢游胡同', 'Navigate': '导航',
  'Mon': '周一', 'Tue': '周二', 'Wed': '周三', 'Thu': '周四', 'Fri': '周五', 'Sat': '周六', 'Sun': '周日',
  'Hilltop': '山顶', 'Sunset': '日落', 'Photo': '拍照点', 'Coffee': '咖啡',
  'Start point · 120 m away': '起点 · 120 米外', '6 min walk from the last stop': '距上一站步行 6 分钟',
  'Every stop covered': '所有站点已完成', 'Every stop on this day is checked off. Load tomorrow\'s route, or end the live trip and keep the saved plan.': '今天的站点已全部打卡。载入明天的路线，或结束实时旅程并保留已保存的计划。',
  'Forbidden City booked for 09:00 · in at Meridian Gate, out at Shenwu Gate': '故宫已预约 09:00 · 午门进、神武门出',
  // plan tab
  'Make a note': '写笔记', 'Add place': '添加地点', 'City walk': '城市漫步',
  'My plan / CITYWALK': '我的计划 / 城市漫步', 'Central Axis · Draft': '中轴线 · 草稿',
  'My route': '我的路线', 'Community 3': '社区 3', 'Crowds': '人流',
  '~5 hr · walk + metro': '约 5 小时 · 步行 + 地铁',
  'Adjust stops': '调整站点', 'Drag stops': '拖动站点', 'Draft': '草稿',
  'Drag a numbered dot — the route recalculates': '拖动编号圆点——路线会重新计算',
  'Drag the numbered dots · route updates live': '拖动编号圆点 · 路线实时更新',
  'Crowds rise after 14:00': '14:00 后人流变多',
  'Nearby': '附近', 'Tickets': '门票', 'Food': '美食', 'Coffee': '咖啡', 'Gifts': '伴手礼',
  'Local favorite': '本地人爱去', 'Queues': '排队', 'Quiet': '安静', 'Quick bite': '小吃',
  'Palace views': '宫殿景观', 'Family': '亲子', 'Boating': '划船', 'Night': '夜景',
  'Shopping': '购物', 'Sights': '景点', 'All': '全部',
  // community
  'For you': '为你推荐', 'Following': '关注', 'Events': '活动', 'Saved': '已保存',
  'Community / BEIJING': '社区 / 北京', 'Our Beijing': '我们的北京',
  '4,208 notes · 126 today · locals post here too': '4,208 条笔记 · 今日 126 条 · 本地人也在这里发',
  'Search notes, places, people': '搜索笔记、地点、作者', 'Search community notes': '搜索社区笔记',
  'Latest notes': '最新笔记', 'Routes': '路线',
  'SEE': '看', 'WALK': '走', 'EAT': '吃', 'GIFT': '礼', 'EVENT': '活动',
  'You are all caught up': '都看完了', '4,208 notes · pull down to refresh': '4,208 条笔记 · 下拉刷新',
  'Cities': '城市', 'Post': '发布', 'Publish': '发布', 'Follow': '关注', 'Following': '已关注',
  'All posts': '全部帖子', 'Nearby posts': '附近帖子', 'Ask Pico to plan it': '让 Pico 规划',
  'Save this walk': '收藏这条路线', 'Open in map': '在地图中打开',
  'Zoom in': '放大地图', 'Zoom out': '缩小地图', 'Reset zoom': '重置缩放',
  'Expand map': '展开地图框', 'Collapse map': '收起地图框',
  // community feed content
  'Where to eat': '去哪儿吃', 'Trending · 4 spots': '热门 · 4 家',
  'What to see': '看什么', 'This week · 3 places': '本周 · 3 处',
  'Gifts to take home': '带回家的伴手礼', 'Locals pick · 3 finds': '本地人推荐 · 3 件',
  'Citywalks': '城市漫步', 'Ready to borrow · 3': '可直接借用 · 3 条',
  'Local events': '本地活动', 'This week · 3 on': '本周 · 3 场',
  'What locals order · queues and signature dishes': '本地人点什么 · 排队和招牌菜',
  'Viewpoints, sunsets and the quiet hours': '观景点、日落和安静的时段',
  'Things worth carrying home': '值得带回家的东西',
  'Citywalks you can borrow whole': '可以整套借用的城市漫步',
  'Markets, night rides, swap meets': '市集、夜骑、跳蚤市场',
  'Start an event': '发起活动', 'This week': '本周', 'Going': '已参加', 'Join': '参加',
  'Post my event': '发布我的活动',
  'Joining adds a reminder under Me → Pre-trip checklist, pushed 2 hours before.': '参加后会在「我的 → 行前清单」里加一条提醒，提前 2 小时推送。',
  'No notes here yet': '这里还没有笔记',
  'Try another category, or start a citywalk under Events.': '换个分类看看，或者在「活动」里发起一次城市漫步。',
  'Try “duck”, “hutong”, “sunset” or “gifts”.': '试试“烤鸭”“胡同”“日落”或“伴手礼”。',
  'No comments yet': '还没有评论', 'From the author': '来自作者',
  'Place details': '地点详情', 'Use this route': '用这条路线', 'See event': '看活动',
  'Ask Pico if it is worth it': '问 Pico 值不值得',
  'Posted in the RoamChina Community · content from members': '发布在 RoamChina 社区 · 内容来自社区成员',
  'Note': '笔记',
  // community posts
  'Sunset from Wanchun Pavilion beats any photo': '万春亭的日落，比任何照片都好看',
  'Climb up before 17:00 for the last light — the roofs burn gold from here. Take the east railing, the whole axis lines up.': '17:00 前爬上去，刚好赶上最后一点光——从这里看，屋顶烧成一片金。站东侧栏杆，整条中轴正好对齐。',
  'Jingshan': '景山', 'Viewpoint': '观景点',
  '@Zhe: Went on Wednesday — at 17:10 the sun landed right on the ridge.': '@Zhe：周三去的——17:10 太阳正好落在山脊上。',
  'The Central Axis in a day: Yongdingmen to the Drum Tower': '一天走完中轴线：永定门到鼓楼',
  'Six stops, 4.2 km. Start at three and you reach Jingshan for sunset. There is a metro exit near every leg.': '六个站点，4.2 公里。三点出发，到景山正好看日落。每一段附近都有地铁口。',
  'Central Axis': '中轴线', 'Walking': '步行', 'Route': '路线',
  '@Lina: Walked the whole thing — feet held up, topped up with coffee twice.': '@Lina：全程走下来了——脚还撑得住，中途补了两杯咖啡。',
  'Siji Minfu before 11 really is queue-free': '11 点前的四季民福，真的不用排队',
  'Eat the skin with sugar first, and half a duck is plenty for two. After three, tables free up on their own.': '先蘸白糖吃鸭皮，两个人半只就够。三点以后，桌子自己就空出来了。',
  'Peking duck': '北京烤鸭', 'Queues': '排队',
  '@Zhou: Confirmed — arrived at 10:40 and walked straight in.': '@Zhou：确认——10:40 到的，直接进去了。',
  'A Qianmen hutong café, best light at three': '前门胡同咖啡馆，三点光线最好',
  'Metal Hands hides in a back alley; the two window tables are the quietest. The pour-over runs bright — order a croissant with it.': '铁手咖啡藏在后巷里，靠窗那两张桌子最安静。手冲偏明亮——配个可颂正好。',
  'Hutongs': '胡同', 'Afternoon': '下午',
  '@Xiaobei: Sat there two hours on Sunday. Nobody hurried us out.': '@Xiaobei：周日在那儿坐了两小时，没人赶我们。',
  'Early morning at the Temple of Heaven, almost empty': '清晨的天坛，几乎没人',
  'Come in by the south gate; the Echo Wall is quietest before nine. Cypress shadows on the red wall — every frame works.': '从南门进，九点前的回音壁最安静。柏树的影子落在红墙上——随手一拍都好看。',
  'Morning': '清晨', 'Architecture': '建筑',
  '@Hutong Archive: That is when locals do their morning practice. Keep voices low.': '@Hutong Archive：那是本地人晨练的时候，说话轻点。',
  'Saturday night market at the Drum Tower: stall list updated': '鼓楼周六夜市：摊位名单更新了',
  'Handmade goods, vinyl and mulled wine. Busiest after 19:00. Metro Line 8, Shichahai station, exit A.': '手作、黑胶和热红酒。19:00 后最热闹。地铁 8 号线什刹海站 A 口。',
  'Night market': '夜市', 'Drum Tower': '鼓楼', 'Weekend': '周末',
  '@Ken: Signed up — see you there.': '@Ken：报名了——到时候见。',
  'Daoxiangcun: loose pastries or gift boxes?': '稻香村：散装点心还是礼盒？',
  'Loose sweets are sold by weight, fresher, and you can mix flavors. Boxes are for giving — no need for your own snack stash.': '散装按斤称，更新鲜，还能混着挑口味。礼盒是送人的——自己吃不用囤。',
  'Daoxiangcun': '稻香村', 'Save money': '省钱',
  '@Lin Xiaoman: Date paste and ox-tongue pastries, every time.': '@Lin Xiaoman：枣泥和牛舌饼，每次必买。',
  'Shichahai after dark: 5 stops, 3 bars on the way': '天黑后的什刹海：5 站，路上 3 家小酒馆',
  'Begin at Yinding Bridge and follow the north shore to the Drum Tower. After nine it thins out; bring a jacket for the wind.': '从银锭桥出发，沿北岸走到鼓楼。九点以后人就少了；风大，带件外套。',
  'Shichahai': '什刹海', 'Bars': '酒吧',
  '@Lina: The craft beer spot by Yinding Bridge is solid.': '@Lina：银锭桥边那家精酿不错。',
  'Corner-tower magnets are back — buy on your way in': '角楼冰箱贴补货了——进门时顺手买',
  'The Shenwu Gate shop restocks in the morning and the corner-tower series goes fast. Two per person, so do not wait for closing.': '神武门商店上午补货，角楼系列走得特别快。每人限购两个，别等闭园。',
  'Palace shop': '故宫商店', 'Magnets': '冰箱贴', 'Limited': '限量',
  '@Zhou: They still had the sunset color yesterday. Go.': '@Zhou：昨天还有日落那款。快去。',
  'Forty minutes in line at Manhengji — worth it?': '满恒记排了四十分钟——值吗？',
  'Hand-cut lamb, sesame dip, and a copper pot that settles the question the moment it boils. Take a number before 17:00 and halve the wait.': '手切羊肉、麻酱，铜锅一开就什么都不用问了。17:00 前拿号，等的时间能减半。',
  'Hotpot': '火锅', 'Niujie': '牛街',
  '@Lao Zhao: Worth it. Order the sweet garlic.': '@Lao Zhao：值。记得点糖蒜。',
  'Boating at Beihai, the White Dagoba from the water': '北海划船，从水上看白塔',
  'After four the sun softens; an hour in a pedal boat is just right. Rentals stop when the wind picks up.': '四点以后光线柔和，脚踏船踩一小时正合适。风一大就停止租船了。',
  'Beihai': '北海',
  '@Xiaobei: With kids, choose an electric boat.': '@Xiaobei：带孩子就选电动船。',
  '2 hr ago': '2 小时前', '4 hr ago': '4 小时前', '5 hr ago': '5 小时前',
  'Yesterday': '昨天', '2 days ago': '2 天前', '3 days ago': '3 天前',
  '4 days ago': '4 天前', '5 days ago': '5 天前',
  // translate
  'Live translate': '实时翻译', 'Menu': '菜单', 'Sign': '路牌', 'Phrases': '常用语',
  'Translate / PHRASES': '翻译 / 常用语', 'Translate / Phrases': '翻译 / 常用语', 'SAY IT': '开口说',
  'LIVE CONVERSATION': '实时对话', 'Live conversation': '实时对话',
  'Say it clearly,': '慢慢说清楚，', 'then breathe': '再换口气。',
  'Live conversation · offline phrases · camera': '实时对话 · 离线常用语 · 拍照',
  'Works offline': '离线可用', 'Chinese': '中文', 'English': '英文',
  'Directions': '问路', 'Dining': '吃饭', 'Medical': '就医', 'Taxi': '打车', 'Emergency': '紧急情况',
  'LIVE CONVERSATION': '实时对话',
  'Tap to start talking': '点一下开始说话',
  'Two-way · detects Chinese and English': '双向 · 自动识别中英文',
  'Works without a signal. Speech is recognized on device, then translated into English.': '没有信号也能用。语音在设备上识别，再翻译成英文。',
  'Voice is processed on device · recordings are never saved': '语音只在设备上处理 · 录音不会保存',
  'Take a photo': '拍照翻译', 'Camera': '相机', 'Speak': '说话', 'Listen': '朗读',
  'Translate': '翻译', 'Hold to talk': '按住说话', 'Scanning…': '识别中…',
  // translate chrome & photo
  'Listening… tap again to finish': '正在听… 再点一下结束',
  'Recognizing offline · translates when you stop': '离线识别 · 停下后翻译',
  'Tap to talk': '点一下说话',
  'Offline phrasebook': '离线常用语', 'Downloaded': '已下载', 'Play': '朗读',
  'Emergency · call first': '紧急情况 · 先打电话',
  'Ambulance 120 · Police 110 · Fire 119. If you need help in Chinese, show the sentence below.': '急救 120 · 报警 110 · 火警 119。需要中文帮忙，就把下面这句话给对方看。',
  'Call 120': '拨打 120',
  'CAMERA · OCR': '相机 · 识别', 'Reading…': '识别中…', 'Found · 9 words': '找到 9 个词',
  '1x · autofocus': '1x · 自动对焦', 'TAP TO SCAN': '点一下扫描',
  'Menu sign': '菜单', 'Street sign': '路牌', 'Scan and translate': '扫描并翻译',
  'Point at a sign or a menu': '对准一块牌子或一份菜单',
  'Press the shutter and Pico will frame the text and translate it into English. You can play it aloud or copy it.': '按下快门，Pico 会框出文字并翻译成英文。可以朗读，也可以复制。',
  'MENU · SIGNATURE': '菜单 · 招牌',
  'Recognized · Old Beijing snacks': '识别结果 · 老北京小吃',
  'Recognized · Street signs': '识别结果 · 街边路牌',
  'Play aloud': '朗读', 'Copy all': '复制全部', 'Try another': '换一张',
  'What to order': '点什么', 'Finding your way': '怎么走',
  'Zhajiang noodles are the safest order; first-timers should share one glass of douzhi.': '炸酱面最稳；第一次来的话，豆汁儿两人分一碗就够了。',
  'Follow the signs straight ahead — Shichahai is toward Beihai North station on Metro Line 6.': '照路牌一直走——什刹海往地铁 6 号线北海北站方向。',
  'Playing aloud': '正在朗读', 'Copied to clipboard': '已复制到剪贴板',
  'Recognized and translated into English': '已识别并翻译成英文',
  'Found 4 pieces of text · translated': '找到 4 段文字 · 已翻译',
  'Switched to the offline phrasebook': '已切到离线常用语',
  'Saved to offline phrases': '已存进离线常用语',
  'Note saved · find it under Me': '笔记已保存 · 在「我的」里查看',
  'Removed from saved': '已取消保存',
  'Food & routes': '美食与路线',
  'Emergency phrases': '紧急用语',
  'Bookings & offline packs': '预约与离线包',
  // me
  'Journey reports': '旅程报告', 'Attraction bookings': '景点预约', 'Travel services': '旅行服务',
  'External info': '外部信息', 'Settings': '设置', 'Profile': '个人资料',
  'Beijing · in progress': '北京 · 进行中', 'archived': '已归档',
  'journey': '段旅程', 'journeys': '段旅程', 'stops done': '站已完成',
  'Share route': '分享路线', 'View trip': '查看行程', 'Open route': '打开路线',
  'All booked': '全部已约', 'Book all': '一键预约', 'Book now': '立即预约',
  'Notifications': '通知', 'Privacy': '隐私', 'Terms': '条款', 'Language': '语言',
  // me profile
  'Me / PROFILE': '我的 / 资料', 'RoamChina member': 'RoamChina 会员', '12th city': '第 12 座城市',
  'Cities visited': '到访城市', 'Saved places': '收藏地点', 'Shared routes': '分享路线',
  'Beijing · 4 days, 3 nights': '北京 · 4 天 3 晚',
  'Wangfujing · 2 adults · Central Axis on foot': '王府井 · 2 位成人 · 中轴线步行',
  'With Lin and Zhou': '与 Lin、Zhou 同行',
  'Beijing · recap ready': '北京 · 总结已就绪',
  'Wrap-up unlocks 10/19 — tap to preview the recap': '总结 10/19 解锁——点开可先预览',
  'Recap': '查看总结', 'Preview': '预览',
  'Each finished trip is archived automatically, on your device.': '每段完成的旅程都会自动归档，只存在你的设备上。',
  'Tickets are issued by the venues; scan your passport at the gate': '门票由场馆出票；入园时刷护照',
  'Trip dates': '出行日期', 'TRIP · ADJUST THE START': '行程 · 调整出发日',
  'Pick the day you arrive — every day, weekday and booking reminder follows.': '选好抵达那天——每天的日期、星期和预约提醒都会跟着走。',
  'Start date': '出发日期',
  '−1 day': '提前一天', '+1 day': '推后一天', '+1 week': '推后一周',
  'Times stay the same · booked tickets keep their entry slots.': '每天的时间不变 · 已订门票保留原来的入园时段。',
  'The Forbidden City is closed on Mondays — this start makes Day 1 a Monday.': '故宫周一闭馆——这样选，第 1 天正好是周一。',
  'The Forbidden City is closed on Mondays — Day 1 lands on a Monday. Move the start date to keep the palace.': '故宫周一闭馆——第 1 天正好是周一。换个出发日，才能把故宫留在第一天。',
  'Save dates': '保存日期', 'Reset': '重置', 'Dates unchanged': '日期没有变化',
  'Adjust trip dates': '调整出行日期',
  'The Forbidden City closes on Mondays; it is open Wednesday 10/15. Your booking receipts stay here.': '故宫周一闭馆，10/15 周三正常开放。预约凭证都保存在这里。',
  'Offline pack': '离线包', 'Maps · phrases · ready': '地图 · 常用语 · 已就绪',
  'Travel together': '一起出行', 'Lin, Zhou · 2 people': 'Lin、Zhou · 2 人',
  'Trip notes': '旅行笔记', 'Export a poster': '导出海报',
  'Booked elsewhere': '别处预订', 'Optional': '可选', 'Flights & hotel': '机票与酒店',
  'Synced from the airline and hotel · nothing to manage in RoamChina': '同步自航空公司和酒店 · 在 RoamChina 里无需管理',
  'Shown for reference only. It does not affect bookings, routes or your checklist.': '仅供参考，不影响预约、路线和清单。',
  'Preferences': '偏好', 'Trip reminders': '行程提醒', '2 hr before · weather changes': '提前 2 小时 · 天气变化',
  'Auto-play translations': '自动朗读翻译', 'Speak English as soon as it is read': '识别后立即用英文朗读',
  'Offline maps': '离线地图', 'Beijing · 42 MB downloaded': '北京 · 已下载 42 MB',
  'About': '关于', 'Your data stays on your device': '数据只保存在你的设备上',
  'Last updated 2026/10': '更新于 2026/10', 'About RoamChina': '关于 RoamChina',
  'Version 1.0.0 (12)': '版本 1.0.0 (12)',
  'ROAMCHINA · MADE FOR SLOW TRAVEL': 'ROAMCHINA · 为慢旅行而生',
  'A whole Beijing, in your pocket': '整个北京，装进口袋',
  'Privacy policy · all voice is processed on device': '隐私政策 · 所有语音都在设备上处理',
  'Terms of service · RoamChina 1.0.0': '服务条款 · RoamChina 1.0.0',
  'RoamChina 1.0.0 (12) · native SwiftUI edition': 'RoamChina 1.0.0 (12) · SwiftUI 原生版',
  'Offline maps are up to date · 42 MB': '离线地图已是最新 · 42 MB',
  // welcome
  'WELCOME TO ROAMCHINA': '欢迎来到 ROAMCHINA',
  'FIRST TRIP · BEIJING': '第一趟旅行 · 北京',
  'Beijing,\nat your pace.': '北京，\n按你的节奏走。',
  'Beijing,': '北京，', 'at your pace.': '按你的节奏走。',
  'A city is better on foot. Pico knows the gates, the queues and the side doors — answer three questions and your first plan is ready.': '这座城市适合用脚去走。Pico 知道哪个门进、哪里要排队、哪条小巷值得拐——回答三个问题，第一份计划就绪。',
  'Hi, I\'m Pico. Tell me what kind of trip you like and I\'ll build your first Beijing plan — route order, timing and all.': '嗨，我是 Pico。告诉我你喜欢什么样的旅行，我来搭好第一份北京计划——顺序、时间都算好。',
  'Build your first Beijing trip': '搭好你的第一趟北京之旅',
  'Three answers and I\'ll set the order, the timing and the walking.': '三个问题，我来安排顺序、时间和步行量。',
  'How many days do you like?': '想玩几天？',
  'Your kind of holiday': '你喜欢哪种旅行？',
  'A theme, or none?': '想定个主题吗？',
  '2–3 days': '2–3 天', '4–5 days': '4–5 天', '6+ days': '6 天以上', 'Surprise me': '随便安排',
  'Slow culture': '慢游文化', 'Food first': '美食优先', 'Outdoors': '户外', 'Night owl': '夜猫子',
  'Family friendly': '亲子出行', 'Budget smart': '省着点玩',
  'Imperial history': '皇城历史', 'Hutongs & coffee': '胡同与咖啡', 'Art & design': '艺术设计',
  'Nature & parks': '自然公园', 'Night markets': '夜市烟火', 'No theme': '不限主题',
  'The Easy-Going Family Wanderer': '佛系亲子漫游者', 'The Shrewd City Wanderer': '精打细算城市漫游者',
  'Anything else?': '还有什么想说的？', 'Optional': '可选',
  'Must-sees, pace, kids, food allergies…': '必去地点、节奏、带孩子、忌口…',
  'Generate plan': '生成计划', 'Pick one per question — you can change it later.': '每题选一个——之后还能改。',
  'Pick one per question — it only changes your suggestion, never the plan.': '每题选一个——只影响推荐，不改行程。',
  'All set — tap Generate plan.': '都选好了——点“生成计划”。',
  'Plan ready · days on your trip': '计划就绪 · 已放进你的行程',
  'View my trip': '查看我的行程', 'days': '天', 'stops': '站', 'km walking': '公里步行',
  'Trip match': '行程匹配', 'Thinking…': '思考中…',
  // reorder sheet
  'Reorder stops': '调整站点顺序',
  'Use the arrows to change the order; the route and times recalculate.': '用箭头调整顺序，路线和时间会重新计算。',
  // sheets
  'CITYWALK · 3 you can borrow': '城市漫步 · 3 条可借用',
  'Matched against your 6 stops. Applying a route replaces the order and times.': '根据你的 6 站匹配。套用后会替换顺序和时间。',
  'Apply to my route': '套用到我的路线', 'ROUTE · TUNE THE ORDER': '路线 · 调整顺序',
  'Add a stop': '添加站点',
  'Pick a place — it lands at the end of the route with a new time, then you can reorder it.': '选个地方——会排到路线末尾并生成新时间，之后可以再调整。',
  'On route': '已在路线', 'Trip note': '旅行笔记', 'NOTE · SAVE AS POSTER': '笔记 · 存成海报',
  'Save poster': '保存海报', 'Copy text': '复制文字',
  'Exports at 3:4 — good for the community or a story.': '3:4 导出——适合发社区或故事。',
  'Post to community': '发到社区',
  'Pre-trip checklist': '行前清单', 'Documents': '证件', 'Connectivity': '网络通讯', 'Transit': '交通',
  'Before you fly': '出发前', 'Arrival day': '抵达当天',
  'Ticking items updates your progress on the Trip tab.': '勾选后行程页的进度会同步更新。',
  'Ask Pico what is missing': '问 Pico 还差什么',
  'Start a citywalk': '发起城市漫步', 'COMMUNITY · POST': '社区 · 发布',
  'Event name': '活动名称', 'Meeting point': '集合地点', 'Cost': '费用', 'Notes': '备注',
  'Date': '日期', 'Time': '时间', 'Free / ¥20': '免费 / ¥20',
  'e.g. Shichahai sunset photo walk': '例如：什刹海日落摄影漫步',
  'e.g. Yinding Bridge': '例如：银锭桥',
  'What would you like to do together?': '想一起做点什么？',
  'Posts appear in Local events and can be edited or cancelled any time.': '发布后会出现在本地活动里，随时可以编辑或取消。',
  'Publish event': '发布活动',
  'Move up': '上移', 'Move down': '下移', 'Remove': '删除',
  // report
  'TRIP COMPLETE': '旅程完成', 'JOURNEY ARCHIVE': '旅程归档',
  'How rare was your route?': '你的路线有多稀有？',
  'Share of RoamChina travelers who unlocked each place': 'RoamChina 旅行者解锁每个地点的比例',
  'new places unlocked': '个新地点解锁', 'km walked': '公里步行',
  'explorers': '旅行者', 'places visited in total': '个地点到访',
  'Report saved to your archive': '报告已保存到归档',
  'Your explorer title': '你的探索者称号',
  'The Central Axis Cartographer': '中轴线制图师',
  'TRIP WRAP-UP': '旅程总结',
  'Your Beijing chapter': '你的北京篇章',
  'places only a few travelers find': '个只有少数旅行者知道的地方',
  'problems handled before they became stories': '个问题在变成故事前就被解决',
  'new places unlocked on this trip': '个新地点在这趟旅程中解锁',
  'meals worth the walk': '顿值得走过去的饭',
  'km on foot': '公里步行',
  'steps': '步', 'on your feet': '在路上',
  'Back to your trip': '回到行程', 'Save recap': '保存总结',
  'Your recap is ready': '你的总结已生成',
  'YOUR EXPLORER TITLE': '你的探索者称号', 'You are officially': '你的正式称号是',
  'OF THE TRIP': '本趟旅程', 'this season': '本季', 'rarest': '最稀有',
  'THE ROAD LESS WALKED': '少有人走的路', 'PICO’S QUIET WINS': 'Pico 的悄悄胜利',
  'NEW GROUND': '新地图', 'THE EATING PART': '吃这件事', 'MILES IN YOUR SHOES': '脚下的里程',
  'Swipe or tap next': '左右滑动或点下一步', 'places only a few': '个只有少数',
  'travelers find': '旅行者知道的地方', 'problems handled before': '个问题在变成',
  'they became stories': '故事之前被解决', 'new places unlocked': '个新地点',
  'on this trip': '在这趟旅程解锁', 'meals worth the walk': '顿值得走过去的饭',
  'on foot': '步行', 'on your feet': '在路上', 'days out': '天在外', 'steps': '步',
  'Also eaten': '还吃了', 'START': '出发', 'A true side door': '真正的小众入口',
  'new places': '个新地点',
  'Kept on your device · nothing shared unless you tap share.': '保存在你的设备上 · 不点分享就不会发出去。',
  'Known by the curious': '好奇的人知道', 'A classic, well earned': '经典，值得',
  'The city': '这座城市', 'remembers.': '会记得。', 'TRIP COMPLETE': '旅程完成',
  'Share of travelers who checked in here — lower is rarer.': '旅行者到这里打卡的比例——越低越稀有。',
  'No refunds, no rebookings, no lost afternoons.': '没有退款、没有改签、没有弄丢的下午。',
  'First-time check-ins, collected into your Beijing passport.': '第一次打卡，收进你的北京护照。',
  'Every one within a 12-minute walk of the route.': '每一家都在路线步行 12 分钟内。',
  'About three-quarters of a marathon — in one pair of shoes, with coffee stops.': '差不多四分之三个马拉松——一双鞋，几杯咖啡。',
  'This one is archived in Journey reports, with the title, the rare places and every meal attached.': '这份总结已归档到「旅程报告」，称号、稀有地点和每一顿饭都在里面。',
  'Your Beijing chapter': '你的北京篇章',
  'Your Chengdu chapter': '你的成都篇章', 'Your Shanghai chapter': '你的上海篇章',
  'The city, one step at a time.': '这座城市，一步一个脚印。',
  'The city,': '这座城市，', 'one step at a time.': '一步一个脚印。',
  'Four days, seventeen stops, one straight line through the middle of Beijing — and every side door that opened along the way.': '四天、十七站，一条穿过北京中轴的直线——还有沿途每一扇打开的侧门。',
  'You walked the axis like a local: early gates, long lunches, and never a queue longer than twelve minutes.': '你像本地人一样走完中轴：早进城门、慢慢吃饭，排队从没超过十二分钟。',
  'Five days of teahouses, chilli oil and one very long bamboo walk. You never once took a taxi before noon.': '五天茶馆、红油和一段很长的竹林散步。中午之前你一次都没打车。',
  'Four days of art deco lanes, midnight noodles and a ferry you took three times for the view.': '四天 Art Deco 里弄、深夜面和一趟为看风景坐了三次的轮渡。',
  // personas & plan chrome
  'The Slow Culture Wanderer': '慢游文化漫游者',
  'The Table-First Wanderer': '先吃为敬的漫游者',
  'The Open-Air Rambler': '户外闲逛者',
  'The After-Dark Flâneur': '夜行漫步者',
  'The Bamboo Teahouse Wanderer': '竹林茶馆漫游者',
  'The Lane Flâneur': '里弄漫游者',
  'Your travel plan': '你的旅行计划',
  'Central Axis': '中轴线', 'Imperial Gardens': '皇家园林',
  'WALKED': '步行',
  'Your rarest stop was': '你最稀有的站点是',
  '— only': '——只有',
  'of RoamChina travelers have unlocked it.': '的 RoamChina 旅行者解锁过。',
  '2 travelers · started 09:00': '2 位旅行者 · 09:00 出发',
  // day meta
  '6 stops · 4.2 km · ~5 hr': '6 站 · 4.2 公里 · 约 5 小时',
  '3 stops · private car both ways · ~full day': '3 站 · 往返专车 · 约一整天',
  '4 stops · Metro Line 4 · ~8 hr': '4 站 · 地铁 4 号线 · 约 8 小时',
  '4 stops · 3.1 km on foot · ~4 hr': '4 站 · 3.1 公里步行 · 约 4 小时',
  '4 stops · 5.1 km · ~6 hr': '4 站 · 5.1 公里 · 约 6 小时',
  '3 stops · 2.4 km · ~5 hr': '3 站 · 2.4 公里 · 约 5 小时',
  // recap quotes
  'You walked the axis like a local: early gates, long lunches, and never a queue longer than twelve minutes.': '你像本地人一样走完中轴：早进城门、慢慢吃饭，排队从没超过十二分钟。',
  'You ordered like a local by day two, and the teahouse auntie still remembers your usual seat.': '第二天你就点得像本地人了，茶馆阿姨还记得你常坐的那张椅子。',
  'You found the city between the avenues — one lane at a time, always with a coffee in hand.': '你在马路之间找到了这座城市——一条里弄一条里弄地走，手里总有一杯咖啡。',
  // Beijing solved
  'The palace sold out at 13:00': '故宫 13:00 的票售罄',
  'Pico moved you to the 09:00 gate — inside before the tour groups.': 'Pico 把你换到 09:00 入园——比旅行团还早进去。',
  "Chang'an Avenue closed for the marathon": '长安街因马拉松封路',
  'Rerouted through the hutongs; you arrived 20 minutes early.': '改道穿胡同，你反而早到了 20 分钟。',
  'Rain forecast on Great Wall morning': '长城那天早上预报有雨',
  'Swapped Days 2 and 3. You climbed Badaling in full sun.': '把第 2、3 天对调，你在晴天爬完了八达岭。',
  'Siji Minfu had a 90-minute queue': '四季民福排队 90 分钟',
  'A table was held for 11:20. Duck on the table by 11:35.': '留了 11:20 的位子，11:35 烤鸭就上桌了。',
  'Jingshan last entry in 11 minutes': '景山还有 11 分钟停止入场',
  'Found the east gate and made sunset with 4 minutes to spare.': '找到东门进去，赶在日落前 4 分钟登顶。',
  'Two passports, one booking': '两本护照，一个订单',
  'Split the reservation and kept both seats together.': '拆成两个预约，座位还挨在一起。',
  'Shichahai kept pulling the route west': '什刹海一直把路线往西拽',
  'Moved it to 13:00 — 1.2 km less on tired feet.': '挪到 13:00——脚累了就少走 1.2 公里。',
  // Chengdu solved
  'A week of drizzle': '一整周的毛毛雨',
  'Teahouse mornings and museum afternoons; the rain never ruined one.': '上午茶馆、下午博物馆，雨一天都没毁掉。',
  'Every hotpot had a queue': '每家火锅都在排队',
  'Booked at 16:30 for an 18:00 table, twice.': '16:30 就订 18:00 的桌，订了两次。',
  'The panda base was sold out': '熊猫基地卖完了',
  'Caught the 07:10 slot the day it reopened.': '重新开放当天抢到 07:10 的场次。',
  'A friend joined on day three': '第三天有朋友加入',
  'Reworked the walk and kept the walking under 9 km.': '重排了路线，步行控制在 9 公里以内。',
  // Shanghai solved
  'The museum closed early': '博物馆提前闭馆',
  'Caught the last entry with 25 minutes to spare.': '赶上最后入场，还早到 25 分钟。',
  'A sudden downpour on the Bund': '外滩突然下大雨',
  'Ducked into a ferry, crossed twice, stayed dry.': '钻进轮渡，来回坐了两趟，一点没淋湿。',
  'Midnight noodles were full': '深夜面馆满座',
  'Found the second shop on Yangjing street.': '在阳泾街找到第二家。',
  'The river walk was longer than it looked': '江边步道比看起来长',
  'Swapped to a tram for the last 3 km.': '最后 3 公里换成有轨电车。',
  // food notes
  'Crackled at 11:35, no queue.': '11:35 片鸭上桌，没排队。',
  'Hand-cut lamb, sesame dip.': '手切羊肉，麻酱蘸料。',
  'Loose ones, not the gift box.': '散装的，不是礼盒。',
  'Afternoon light included.': '还附赠下午的光。',
  'Mild side, twice.': '微辣锅底，吃了两次。',
  'Breakfast of champions.': '冠军的早餐。',
  'Peanuts and a bottomless cup.': '花生米配无限续杯。',
  'A break from chilli.': '从辣椒里喘口气。',
  'Midnight bowl.': '深夜的一碗。',
  'Burnt bottom, soup inside.': '底脆，里头有汤。',
  'Warm from the oven.': '刚出炉的温热。',
  'Three in four days.': '四天喝了三杯。'
};
const ZH_RULES = [
  [/^(\d+) days · (\d+) nights$/, '$1 天 · $2 晚'],
  [/^(\d+) days · (\d+) stops$/, '$1 天 · $2 站'],
  [/^(\d+) days?$/, '$1 天'],
  [/^(\d+) min$/, '$1 分钟'],
  [/^(\d+) min · 6 min walk$/, '$1 分钟 · 步行 6 分钟'],
  [/^([\d.]+) hr · 6 min walk$/, '$1 小时 · 步行 6 分钟'],
  [/^([\d.]+) hr$/, '$1 小时'],
  [/^Plan ready · (\d+) days on your trip$/, '计划就绪 · 已在行程里安排好 $1 天'],
  [/^\+ (\d+) more days, saved to your trip$/, '还有 $1 天，已存进行程'],
  [/^Still need “(.+)”\.$/, '还差“$1”。'],
  [/^(\d+) stops$/, '$1 站'],
  [/^(\d+) travelers$/, '$1 位旅行者'],
  [/^([\d\/]+ – [\d\/]+) · (\d+) travelers$/, '$1 · $2 位旅行者'],
  [/^Beijing · (\d+) days, (\d+) nights$/, '北京 · $1 天 $2 晚'],
  [/^([\d\/]+) – ([\d\/]+) · (\d+) nights · confirmed$/, '$1 – $2 · $3 晚 · 已确认'],
  [/^([\d\/]+) 08:45 → 11:20 · Capital T3 · ticketed$/, '$1 08:45 → 11:20 · 首都机场 T3 · 已出票'],
  [/^The Forbidden City closes on Mondays; it is open (\w+) ([\d\/]+)\. Your booking receipts stay here\.$/, (m, week, date) => {
    const zhWeek = { Mon: '周一', Tue: '周二', Wed: '周三', Thu: '周四', Fri: '周五', Sat: '周六', Sun: '周日' };
    return `故宫周一闭馆，${zhWeek[week] || week} ${date} 正常开放。预约凭证都保存在这里。`;
  }],
  [/^Dates moved · (.+) · 2 travelers$/, '日期已更新 · $1 · 2 位旅行者'],
  [/^(\d+) days on the trip$/, '行程共 $1 天'],
  [/^Plan · (.+?) · (\d+) days$/, (m, name, count) => `计划 · ${tr(name)} · ${count} 天`],
  [/^Trip · (.+)$/, (m, name) => `行程 · ${tr(name)}`],
  [/^Live · (.+)$/, (m, name) => `现场 · ${tr(name)}`],
  [/^Community · (.+)$/, (m, name) => `社区 · ${tr(name)}`],
  [/^Translate · (.+)$/, (m, name) => `翻译 · ${tr(name)}`],
  [/^(\d+–\d+ days|6\+ days|Surprise me) · (.+?) · (.+)$/, (m, days, style, theme) => `${tr(days)} · ${tr(style)} · ${tr(theme)}`],
  [/^(.+?) · (\d+) days$/, (m, name, count) => `${tr(name)} · ${count} 天`],
  [/^([\d\/]+) · (Beijing|Chengdu|Shanghai) · (\d+) travelers · ([\d.]+) km$/, '$1 · $2 · $3 位旅行者 · $4 公里'],
  [/^(\d+) stops · Day (\d+) of (\d+)$/, '$1 站 · 第 $2 天 / 共 $3 天'],
  [/^(\d+) stops · ([\d.]+) km$/, '$1 站 · $2 公里'],
  [/^(\d+) of (\d+) stops · ([\d.]+) km$/, '已完成 $1 / $2 站 · $3 公里'],
  [/^(\d+) stops in total\. Some were on every list; the good ones were not\.$/, '$1 站全部到访。有些在所有人的清单上，真正好的没有。'],
  [/^(.+) · (\d+) stops · ([\d.]+) km · (.+)$/, '$1 · $2 站 · $3 公里 · $4'],
  [/^(\d+) archived$/, '$1 份归档'],
  [/^(\d+) days to go$/, '还有 $1 天'],
  [/^(\d+) posts · newest first$/, '$1 篇 · 最新在前'],
  [/^(\d+) phrases · ([\d.]+) MB$/, '$1 句 · $2 MB'],
  [/^CHECKLIST · (\d+) ITEMS$/, '清单 · $1 项'],
  [/^(\d+) days to departure$/, '距出发还有 $1 天'],
  [/^Done (\d+) of (\d+)\. The Forbidden City is the tightest — book today\.$/, '已完成 $1 / $2。故宫最紧张——今天就订。'],
  [/^ROUTE · DAY (\d+) · (.+)$/, '路线 · 第 $1 天 · $2'],
  [/^(.+) · (\d+) stops · ([\d.]+) km · ~(\d+) hr$/, '$1 · $2 站 · $3 公里 · 约 $4 小时'],
  [/^List (\d+)\/(\d+)$/, '清单 $1/$2'],
  [/^(\d+) new places · rarest find ([\d.]+)%$/, '$1 个新地点 · 最稀有 $2%'],
  [/^(\d+) \/ (\d+) booked$/, '$1 / $2 已预约'],
  [/^(\d+) guests$/, '$1 位'],
  [/^([\d:]+) · (\d+) guests · Free$/, '$1 · $2 位 · 免费'],
  [/^([\d:]+) · (\d+) guests · (.+)$/, '$1 · $2 位 · $3'],
  [/^(\d+) places$/, '$1 个地点'],
  [/^(\d+) adults$/, '$1 位成人'],
  [/^(\d+) nights$/, '$1 晚'],
  [/^(\d+) items$/, '$1 项'],
  [/^(\d+) people$/, '$1 人'],
  [/^Wrap-up unlocks ([\d\/]+) — tap to preview the recap$/, '总结 $1 解锁——点开可先预览'],
  [/^(\d+) km$/, '$1 公里'],
  [/^([\d.]+) km$/, '$1 公里'],
  [/^([\d.]+) KM$/, '$1 公里'],
  [/^(\d+) km walking$/, '$1 公里步行'],
  [/^~(\d+) hr$/, '约 $1 小时'],
  [/^~(\d+\.\d+) hr$/, '约 $1 小时'],
  [/^~full day$/, '约一整天'],
  [/^Day (\d+)$/, '第 $1 天'],
  [/^Day (\d+) of (\d+)$/, '第 $1 天 / 共 $2 天'],
  [/^Today · Day (\d+)$/, '今天 · 第 $1 天'],
  [/^(\d+) of (\d+) stops done$/, '已完成 $1 / $2 站'],
  [/^(\d+) \/ (\d+) answered$/, '$1 / $2 已答'],
  [/^(\d+) new places$/, '$1 个新地点'],
  [/^(\d+) problems$/, '$1 个问题'],
  [/^Top (\d+)%$/, '前 $1%'],
  [/^(\d+) days · (\d+) nights · (\d+) travelers$/, '$1 天 · $2 晚 · $3 位旅行者'],
  [/^(\d+) stops · ([\d.]+) km · (.*)$/, '$1 站 · $2 公里 · $3'],
  [/^Only ([\d.]+)% of travelers found this — your rarest unlock\.$/, '只有 $1% 的旅行者找到过——你最稀有的解锁。'],
  [/^(\d+)% of travelers know it$/, '$1% 的旅行者知道这里'],
  [/^(\d+) of (\d+) stops$/, '$1 / $2 站'],
  [/^TRIP WRAP-UP · (\d+)$/, '旅程总结 · $1'],
  [/^LIVE TRIP \/ DAY (\d+) · (.+)$/, '实时旅程 / 第 $1 天 · $2'],
  [/^([\d:]+) · Beijing$/, '$1 · 北京'],
  [/^Day (\d+) complete$/, '第 $1 天完成'],
  [/^You covered (\d+) stops and ([\d.]+) km\. Your plan and the other (\d+) days are still saved\.$/, '你走完了 $1 站、$2 公里。计划和其他 $3 天都还保存着。'],
  [/^Stop (\d+) \/ (\d+)$/, '第 $1 站 / 共 $2 站'],
  [/^UP NEXT · (\d+) MIN$/, '下一站 · 步行 $1 分钟'],
  [/^NOW · ([\d:]+)$/, '当前 · $1'],
  [/^([\d:]+) · ([\d.]+) hr$/, '$1 · $2 小时'],
  [/^([\d:]+) · (\d+) min$/, '$1 · $2 分钟'],
  [/^([\d.]+) km walked · ends about ([\d:]+)$/, '走了 $1 公里 · 预计 $2 结束'],
  [/^([\d.]+) km walked · all stops covered$/, '走了 $1 公里 · 全部站点完成'],
  [/^Start point · 120 m away · (.+)$/, '起点 · 120 米外 · $1'],
  [/^6 min walk from the last stop · (.+)$/, '距上一站步行 6 分钟 · $1'],
  [/^of (.+) explorers$/, '$1探索者'],
  [/^rarest ([\d.]+)%$/, '稀有 $1%'],
  [/^([A-Z]+) · Community note$/, (m, lab) => `${tr(lab)} · 社区笔记`],
  [/^([A-Z]+) · (.+)$/, (m, lab, title) => `${tr(lab)} · ${tr(title)}`],
  [/^(.+)'s note$/, '$1 的笔记'],
  [/^Photo · (.+) · Wikimedia Commons$/, '图片 · $1 · Wikimedia Commons'],
  [/^(.+) · in Beijing$/, (m, time) => `${tr(time)} · 在北京`],
  [/^(\d+) notes$/, '$1 条笔记'],
  [/^(\S+) likes$/, '$1 人喜欢'],
  [/^(\S+) saves$/, '$1 人收藏'],
  [/^(\d+) comments$/, '$1 条评论'],
  [/^Comments · (\d+)$/, '评论 · $1'],
  [/^(\d+) events · open$/, '$1 场 · 开放'],
  [/^Nothing for “(.+)”$/, '没有找到“$1”'],
  [/^Search “(.+)”$/, '搜索“$1”'],
  [/^(\d+) lines$/, '$1 条'],
  [/^More than 82% of RoamChina travelers walk on a (\d+)-day trip\.$/, '超过 82% 的 RoamChina 旅行者在 $1 天的行程里走到这个数。']
];
function translateText(text) {
  if (S.lang !== 'zh') return text;
  const key = text.trim();
  if (!key) return text;
  let out = ZH[key];
  if (!out) {
    for (const [re, rep] of ZH_RULES) {
      if (re.test(key)) { out = key.replace(re, rep); break; }
    }
  }
  if (!out) return text;
  return text.replace(key, out);
}
const ZH_SKIP = '.lang-switch, .no-i18n, script, style, svg';
function zhify(root) {
  if (S.lang !== 'zh' || !root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || parent.closest(ZH_SKIP)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const next = translateText(node.nodeValue);
    if (next !== node.nodeValue) node.nodeValue = next;
  });
  root.querySelectorAll('[aria-label], [placeholder], [title]').forEach((el) => {
    if (el.closest(ZH_SKIP)) return;
    ['aria-label', 'placeholder', 'title'].forEach((attr) => {
      const value = el.getAttribute(attr);
      if (!value) return;
      const next = translateText(value);
      if (next !== value) el.setAttribute(attr, next);
    });
  });
}
function renderLangSwitch() {
  const el = $('#langSwitch');
  if (!el) return;
  el.dataset.lang = S.lang;
  el.querySelector('[data-lang="en"]').classList.toggle('on', S.lang === 'en');
  el.querySelector('[data-lang="zh"]').classList.toggle('on', S.lang === 'zh');
  el.setAttribute('aria-label', S.lang === 'zh' ? 'Switch to English' : '切换为中文');
}
function setLang(lang) {
  S.lang = lang === 'zh' ? 'zh' : 'en';
  renderLangSwitch();
  render(true);
  if (S.sheet) renderSheet();
  renderWelcome();
  renderRecap();
  toast(S.lang === 'zh' ? '已切换为中文' : 'Language switched to English', 'globe');
}
function toast(text, iconName = 'check') {
  const el = $('#toast');
  el.innerHTML = `${icon(iconName, 13)}<span>${esc(text)}</span>`;
  zhify(el);
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
/* ---------- map zoom / pan ---------- */
const MAPVIEW = { zoom: 1, panX: 0, panY: 0 };

function applyMapView() {
  const inner = $('.map-inner');
  if (!inner) return;
  if (MAPVIEW.zoom <= 1.001) { MAPVIEW.zoom = 1; MAPVIEW.panX = 0; MAPVIEW.panY = 0; }
  inner.style.transformOrigin = '0 0';
  inner.style.transform = `translate(${MAPVIEW.panX.toFixed(1)}px, ${MAPVIEW.panY.toFixed(1)}px) scale(${MAPVIEW.zoom})`;
}

function clampMapPan(host) {
  const w = host.clientWidth, h = host.clientHeight;
  MAPVIEW.panX = clamp(MAPVIEW.panX, Math.min(0, w - w * MAPVIEW.zoom), 0);
  MAPVIEW.panY = clamp(MAPVIEW.panY, Math.min(0, h - h * MAPVIEW.zoom), 0);
}

function setMapZoom(z, cx, cy) {
  const inner = $('.map-inner');
  if (!inner) return;
  const host = inner.parentElement;
  const nz = clamp(z, 1, 4);
  const k = nz / MAPVIEW.zoom;
  const px = cx == null ? host.clientWidth / 2 : cx;
  const py = cy == null ? host.clientHeight / 2 : cy;
  MAPVIEW.panX = px - (px - MAPVIEW.panX) * k;
  MAPVIEW.panY = py - (py - MAPVIEW.panY) * k;
  MAPVIEW.zoom = nz;
  clampMapPan(host);
  applyMapView();
}

function mapZoomBtns() {
  return `<div class="map-zoom" aria-label="Map zoom controls">
    <button type="button" data-act="map-zoom-in" aria-label="Zoom in">+</button>
    <button type="button" data-act="map-zoom-out" aria-label="Zoom out">−</button>
    <button type="button" data-act="map-zoom-reset" aria-label="Reset zoom">1×</button>
  </div>`;
}

function bindMapZooms() {
  const host = $('.map, .tmap');
  const inner = $('.map-inner');
  if (!host || !inner) return;
  applyMapView();
  host.addEventListener('wheel', (e) => {
    e.preventDefault();
    const r = host.getBoundingClientRect();
    setMapZoom(MAPVIEW.zoom * Math.exp(-(e.deltaY || e.deltaX) * 0.0016), e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
  const ptrs = new Map();
  let panStart = null;
  let pinch = null;
  const pinchInfo = () => {
    const pts = [...ptrs.values()];
    const r = host.getBoundingClientRect();
    const a = pts[0], b = pts[1];
    return {
      d: Math.hypot(a.x - b.x, a.y - b.y) || 1,
      cx: (a.x + b.x) / 2 - r.left,
      cy: (a.y + b.y) / 2 - r.top,
    };
  };
  host.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.pin, .pin-label, .lpin, .you-tag, .map-zoom, button, a, input, textarea, .map-hint, .collab')) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { host.setPointerCapture(e.pointerId); } catch (err) {}
    if (ptrs.size === 2) { pinch = pinchInfo(); panStart = null; }
    else panStart = { x: e.clientX - MAPVIEW.panX, y: e.clientY - MAPVIEW.panY };
  });
  host.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2 && pinch) {
      const cur = pinchInfo();
      setMapZoom(MAPVIEW.zoom * (cur.d / pinch.d), cur.cx, cur.cy);
      MAPVIEW.panX += cur.cx - pinch.cx;
      MAPVIEW.panY += cur.cy - pinch.cy;
      clampMapPan(host);
      applyMapView();
      pinch = pinchInfo();
    } else if (panStart && MAPVIEW.zoom > 1) {
      MAPVIEW.panX = e.clientX - panStart.x;
      MAPVIEW.panY = e.clientY - panStart.y;
      clampMapPan(host);
      applyMapView();
    }
  });
  const drop = (e) => {
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (!ptrs.size) panStart = null;
  };
  host.addEventListener('pointerup', drop);
  host.addEventListener('pointercancel', drop);
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
  const ctx = S.tab === 'trip' ? `Trip · ${activeDay().date} ${activeDay().title}` : TAB_CTX[S.tab];
  $('#dock').innerHTML = TABS.map((t) => `
    <button class="tab ${S.tab === t.id ? 'active' : ''}" data-act="tab" data-tab="${t.id}" aria-label="${t.label}" aria-current="${S.tab === t.id ? 'page' : 'false'}">
      ${icon(t.icon, 18)}<span>${t.label}</span>
      ${t.badge ? '<i class="badge" aria-hidden="true"></i>' : ''}
    </button>`).join('') + `
    <button class="orb" data-act="assistant" data-ctx="${esc(ctx)}" aria-label="Ask Pico">${sparkleIcon(21)}</button>`;
}

const screens = {
  trip: tripView,
  plan: planView,
  forum: forumView,
  translate: translateView,
  me: meView
};

let heroTimer = 0;
let heroResumeAt = 0;
const HERO_DELAY = 4500;

function initHeroCarousel() {
  const track = $('#heroTrack');
  if (!track) return;
  const dots = $$('.hero-dot', track.parentElement);
  const label = $('[data-hero-index]', track.parentElement);
  const apply = (i) => {
    S.hero = clamp(i, 0, TRIP_HERO.length - 1);
    dots.forEach((d, j) => {
      d.classList.toggle('on', j === S.hero);
      d.setAttribute('aria-current', j === S.hero ? 'true' : 'false');
    });
    if (label) label.textContent = String(S.hero + 1);
  };
  if (S.hero && track.clientWidth) track.scrollLeft = track.clientWidth * S.hero;
  apply(S.hero);
  let raf = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => apply(Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
  }, { passive: true });

  const hold = () => { heroResumeAt = Date.now() + 9000; };
  ['pointerdown', 'touchstart', 'wheel'].forEach((evt) => track.addEventListener(evt, hold, { passive: true }));

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    if (document.hidden || S.sheet || S.tab !== 'trip') return;
    if (Date.now() < heroResumeAt) return;
    const t = $('#heroTrack');
    if (!t || !t.clientWidth) return;
    const next = (S.hero + 1) % TRIP_HERO.length;
    t.scrollTo({ left: t.clientWidth * next, behavior: 'smooth' });
  }, HERO_DELAY);
}

function render(resetScroll = false) {
  const v = $('#view');
  const old = v.scrollTop;
  v.innerHTML = `<div class="screen ${S.tab === 'plan' ? 'fill' : ''}">${screens[S.tab]()}</div>`;
  v.classList.toggle('has-cta', S.tab === 'trip' && S.planBuilt);
  const cta = $('#ctaLayer');
  if (cta) cta.innerHTML = (S.tab === 'trip' && S.planBuilt) ? (S.tripLive ? liveCTAHTML() : tripCTAHTML()) : '';
  if (S.tab !== S.lastTab || resetScroll) v.scrollTop = 0;
  else v.scrollTop = old;
  S.lastTab = S.tab;
  renderDock();
  if (S.sheet) renderSheet();
  if (S.tab === 'plan') initMapDrag();
  if (S.tab === 'plan') initPlanStopDrag();
  if (S.tab === 'trip' && S.tripEdit && !S.tripLive) {
    initMapDrag('#tripMapBody', activeDay().stops);
    initTripStopDrag();
  }
  clearInterval(heroTimer);
  if (S.tab === 'trip') initHeroCarousel();
  if (S.tab === 'plan' || S.tab === 'trip') bindMapZooms();
  renderWelcome();
  renderRecap();
  zhify(v);
  if (cta) zhify(cta);
  zhify($('#dock'));
  renderLangSwitch();
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
function tripDayCount() {
  return S.planBuilt ? planLength() : 4;
}

function isoToDate(iso) {
  const [y, m, d] = String(iso || DEFAULT_TRIP_START).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12);
}

function dayDate(index, startISO = S.tripStart) {
  const base = isoToDate(startISO);
  const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() + index, 12);
  return {
    date: `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`,
    week: date.toLocaleDateString('en-US', { weekday: 'short' }),
    iso: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  };
}

function tripDateRange(count = tripDayCount(), startISO = S.tripStart) {
  return `${dayDate(0, startISO).date} – ${dayDate(count - 1, startISO).date}`;
}

function shiftISO(iso, days) {
  const [y, m, d] = String(iso || DEFAULT_TRIP_START).split('-').map(Number);
  const date = new Date(y, (m || 1) - 1, (d || 1) + Number(days || 0), 12);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/* Move the whole trip: day dates, weekdays and booking reminders follow the start. */
function setTripStart(iso) {
  if (!iso) return;
  S.tripStart = iso;
  S.dateDraft = null;
  const days = tripDays();
  days.forEach((day, i) => {
    const when = dayDate(i, iso);
    day.date = when.date;
    day.week = when.week;
  });
}

function datePreviewHTML(startISO) {
  const count = tripDayCount();
  return Array.from({ length: count }, (_, i) => {
    const d = dayDate(i, startISO);
    return `<div class="dp-row${i === 0 ? ' on' : ''}">
      <span class="dp-day">Day ${i + 1}</span>
      <b>${esc(d.date)}</b>
      <span class="dp-week">${esc(tr(d.week))}</span>
    </div>`;
  }).join('');
}

function dateRangeNoteHTML(startISO) {
  const count = tripDayCount();
  return `${esc(tripDateRange(count, startISO))} · ${count - 1} ${S.lang === 'zh' ? '晚' : 'nights'}`;
}

function tripDatesSheet() {
  const count = tripDayCount();
  const draft = S.dateDraft || S.tripStart;
  return `<div class="sheet medium">
    ${sheetHead('Trip dates', 'TRIP · ADJUST THE START')}
    <div class="sheet-body">
      <p class="sub" style="margin:2px 0 10px">Pick the day you arrive — every day, weekday and booking reminder follows.</p>
      <label class="date-field" for="tripStartInput">
        <span class="df-label">Start date</span>
        <input type="date" id="tripStartInput" value="${esc(draft)}" min="2026-01-01" max="2027-12-31">
        <span class="df-week">${esc(tr(dayDate(0, draft).week))}</span>
      </label>
      <div class="date-nudges">
        <button class="chip" data-act="date-nudge" data-days="-1">−1 day</button>
        <button class="chip" data-act="date-nudge" data-days="1">+1 day</button>
        <button class="chip" data-act="date-nudge" data-days="7">+1 week</button>
      </div>
      <div class="date-warn" id="dateWarn" ${dayDate(0, draft).week === 'Mon' ? '' : 'hidden'}>
        ${icon('info', 9)}<span>The Forbidden City is closed on Mondays — this start makes Day 1 a Monday.</span>
      </div>
      <div class="date-preview-head">
        <span>${count} days on the trip</span>
        <em class="date-range" id="dateRangeNote">${dateRangeNoteHTML(draft)}</em>
      </div>
      <div class="date-preview" id="datePreview">${datePreviewHTML(draft)}</div>
      <div class="empty-note">Times stay the same · booked tickets keep their entry slots.</div>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="date-reset">Reset</button>
      <button class="primary" data-act="date-save">Save dates</button>
    </div>
  </div>`;
}

function refreshDatePreview() {
  const draft = S.dateDraft || S.tripStart;
  const preview = $('#datePreview');
  if (preview) preview.innerHTML = datePreviewHTML(draft);
  const range = $('#dateRangeNote');
  if (range) range.textContent = dateRangeNoteHTML(draft);
  const week = $('.date-field .df-week');
  if (week) week.textContent = tr(dayDate(0, draft).week);
  const warn = $('#dateWarn');
  if (warn) warn.hidden = dayDate(0, draft).week !== 'Mon';
  zhify($('#sheetLayer'));
}

function tripPlans() {
  const count = tripDayCount();
  const all = TRIP_PLANS.concat(EXTRA_TRIP_PLANS);
  return all.slice(0, count);
}

/* ---------- merged trip editor ---------- */
const DAY_COORDS = [
  [[.30, .82], [.42, .64], [.54, .48], [.44, .32], [.60, .24], [.70, .40]],
  [[.34, .86], [.46, .70], [.56, .54], [.50, .36], [.64, .28], [.72, .48]],
  [[.28, .78], [.40, .62], [.52, .44], [.62, .30], [.70, .50], [.58, .68]],
  [[.36, .84], [.48, .66], [.58, .50], [.48, .34], [.34, .44], [.26, .62]],
  [[.32, .80], [.44, .62], [.54, .46], [.66, .32], [.74, .50], [.62, .70]]
];

function buildTripDays() {
  const count = tripDayCount();
  const plans = tripPlans();
  const days = [];
  for (let i = 0; i < count; i++) {
    const p = plans[i] || plans[plans.length - 1];
    const when = dayDate(i);
    const base = { date: when.date, week: when.week, title: p.title, meta: p.meta, note: p.note, tag: p.tag, tagStyle: p.tagStyle };
    if (i === 0) {
      days.push({ ...base, stops: S.stops });
      continue;
    }
    const coords = DAY_COORDS[(i - 1) % DAY_COORDS.length];
    const stops = p.stops.map((s, si) => ({
      id: `d${i}s${si}`,
      name: s.name,
      time: s.time,
      duration: si === 0 ? 'Start' : '45 min',
      x: coords[si % coords.length][0],
      y: coords[si % coords.length][1],
      tag: si === 0 ? 'Start' : '',
      tagStyle: 'soft'
    }));
    days.push({ ...base, stops });
  }
  return days;
}

function tripDays() {
  const count = tripDayCount();
  if (!S.tripDays || S.tripDays.length !== count || S.tripDays[0].stops !== S.stops) S.tripDays = buildTripDays();
  return S.tripDays;
}

function activeDay() {
  const days = tripDays();
  return days[clamp(S.tripDay, 0, days.length - 1)];
}

function activeStops() {
  return (S.tab === 'trip' && S.planBuilt) ? activeDay().stops : S.stops;
}

function dayStats(day) {
  const n = day.stops.length;
  const meta = day.meta || '';
  const full = /full day/.test(meta);
  const km = (/([\d.]+) km/.exec(meta) || [])[1] || (n * 0.72).toFixed(1);
  const hr = full ? null : (/([\d.]+) hr/.exec(meta) || [])[1] || String(Math.max(1, Math.round(n * 0.85)));
  return { n, km, hr, full };
}

function markPlanEdited() {
  if (S.tripSaved) S.tripDirty = true;
}

function plusMinutes(hhmm, mins) {
  const [h, m] = String(hhmm || '09:00').split(':').map(Number);
  const total = (h || 0) * 60 + (m || 0) + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function tripView() {
  if (S.tripLive) return liveTripView();
  const dayCount = tripDayCount();
  const persona = quizPersona();
  const days = tripDays();
  const dayNo = clamp(S.tripDay, 0, days.length - 1);
  const day = days[dayNo];
  const stops = day.stops;
  const stats = dayStats(day);
  return `
    <header class="top">
      <div>
        <div class="eyebrow"><span class="eyebrow-line"></span>My trip / BEIJING ${sparkleIcon(8)}</div>
        <div class="h1row"><div class="h1">${esc(tr('Beijing'))}</div>${tag(`${dayCount} days · ${dayCount - 1} nights`, 'coral')}</div>
        <button class="meta trip-dates" data-act="dates" aria-label="Adjust trip dates">
          ${icon('calendar', 9)}<span>${esc(tripDateRange(dayCount))} · 2 travelers</span>${icon('down', 7)}
        </button>
      </div>
      <div class="top-right">
        <div class="row">
          <div class="avatar">W</div>
        </div>
        <div class="meta">${dayNo === 0 ? 'Today · Day 1' : `Day ${dayNo + 1} of ${dayCount}`}</div>
      </div>
    </header>

    ${S.planBuilt ? `<button class="plan-strip" data-act="assistant" data-ctx="${esc(S.assistantContext)}">
      <span class="ps-ico">${sparkleIcon(12)}</span>
      <span class="grow"><b>Pico built this plan</b><small>${esc(tr(persona ? persona.title : 'Your travel plan'))} · ${dayCount} ${S.lang === 'zh' ? '天' : 'days'}</small></span>
      <span class="ps-act">Adjust ${icon('arrowur', 8)}</span>
    </button>` : ''}

    <div class="section-title" style="margin-top:16px">
      <div class="st-left"><span class="idx idx-logo">${icon('map', 11)}</span><h2>Your route</h2></div>
      <button class="link" data-act="assistant" data-ctx="Trip · ${esc(day.title)}">Ask Pico ${icon('arrowur', 8)}</button>
    </div>

    <article class="plan-card">
      <div class="rc-days" role="tablist" aria-label="Trip days">
        ${days.map((d, i) => `<button class="rc-day ${i === dayNo ? 'on' : ''}" data-act="trip-day" data-day="${i}" role="tab" aria-selected="${i === dayNo}" aria-label="Day ${i + 1}, ${esc(d.date)}">
          <b>Day ${i + 1}</b><span>${esc(d.date)}</span>
        </button>`).join('')}
      </div>

      <div class="tmap${S.mapExpanded ? ' expanded' : ''}">
        <div class="map-inner">
          ${mapBase()}
          <div class="map-wash"></div>
          <div class="map-body" id="tripMapBody">
            <svg class="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="${routePathD(stops)}" fill="none" stroke="var(--ink)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
              <path d="${routePathD(stops)}" fill="none" stroke="var(--coral)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
            </svg>
            ${stops.map((s, i) => pinHTML(s, i)).join('')}
          </div>
        </div>
        <div class="tmap-tools">
          <button class="small-chip ${S.tripEdit ? 'on' : ''}" data-act="trip-edit">${icon(S.tripEdit ? 'check' : 'hand', 9)}${S.tripEdit ? 'Done' : 'Edit pins'}</button>
          <button class="small-chip" data-act="reorder">${icon('updown', 9)}Reorder</button>
          <button class="small-chip ${S.mapExpanded ? 'on' : ''}" data-act="map-expand" aria-label="${S.mapExpanded ? 'Collapse map' : 'Expand map'}">${icon(S.mapExpanded ? 'contract' : 'expand', 9)}${S.mapExpanded ? 'Collapse' : 'Expand'}</button>
        </div>
        ${mapZoomBtns()}
      </div>

      <div class="rc-head">
        <div class="grow">
          <div class="rowline"><span class="day">DAY ${String(dayNo + 1).padStart(2, '0')}</span>${tag(tr(day.tag), day.tagStyle)}</div>
          <div class="rc-title">${esc(tr(day.title))}</div>
          <div class="rc-stats">
            <span>${icon('pin', 9)}${stats.n} stops</span>
            <span>${icon('walk', 9)}${stats.km} km</span>
            <span>${icon('clock', 9)}${stats.full ? '~full day' : `~${stats.hr} hr`}</span>
          </div>
        </div>
        ${S.tripSaved && !S.tripDirty ? `<span class="rc-saved">${icon('check', 8)}Saved</span>` : ''}
      </div>

      ${S.aiVisible && dayNo === 0 && !S.tripEdit ? `
      <div class="ai-bar rc-ai">
        <span class="spark">${sparkleIcon(10)}</span>
        <span>Pico: move Shichahai to 13:00</span>
        <span class="note">1.2 km less</span>
        <button data-act="apply-ai">Apply</button>
      </div>` : ''}

      <div class="rc-stops">
        ${stops.map((s, i) => tripStopRow(s, i)).join('')}
      </div>

      ${day.note ? `<div class="rc-note">${icon('info', 9)}<span>${esc(tr(day.note))}</span></div>` : ''}

      <div class="rc-actions">
        <button class="pa dashed" data-act="trip-add">${icon('plus', 10)}Add stop</button>
        <button class="pa lime" data-act="similar">${icon('layers', 10)}Similar routes</button>
      </div>
    </article>

    <div class="section-title">
      <div class="st-left"><span class="idx idx-logo">${icon('calendar', 11)}</span><h2>Your days</h2></div>
      <span class="meta">${days.length} days · ${days.reduce((n, d) => n + d.stops.length, 0)} stops</span>
    </div>

    <div class="day-list">
      ${days.map((d, i) => `<button class="day-row ${i === dayNo ? 'on' : ''}" data-act="trip-day" data-day="${i}" data-scroll="1">
        <span class="dd"><b>${esc(d.date)}</b><small>${esc(d.week)}</small></span>
        <span class="di">
          <span class="rowline"><span class="day">DAY ${String(i + 1).padStart(2, '0')}</span>${tag(tr(d.tag), d.tagStyle)}</span>
          <b>${esc(tr(d.title))}</b>
          <small>${esc(d.meta)}</small>
        </span>
        <span class="go">${icon('right', 9)}</span>
      </button>`).join('')}
    </div>

    <div class="section-title">
      <div class="st-left"><span class="idx idx-logo">${icon('compass', 11)}</span><h2>Travel style check</h2></div>
      <span class="meta">${quizAnswered()} / 3 answered</span>
    </div>
    ${quizCard()}`;
}

function tripStopRow(stop, index) {
  const colors = ['var(--mustard)', 'var(--pink)', 'var(--mint)', 'var(--peri)', 'var(--lime)', 'var(--sky)'];
  const selected = S.selected === stop.id;
  return `<div class="trow ${selected ? 'on' : ''}" data-stop="${stop.id}" data-index="${index}">
    <span class="time">${esc(stop.time)}</span>
    <span class="num" style="background:${colors[index % colors.length]}">${index + 1}</span>
    <button class="info" data-act="select-stop" data-id="${stop.id}">
      <b>${esc(stop.name)} ${stop.tag ? tag(stop.tag, stop.tagStyle || 'soft') : ''}</b>
      <small><span>${esc(stop.duration || '45 min')}</span> · <span>${index === 0 ? 'Start here' : 'on the route'}</span></small>
    </button>
    ${S.tripEdit
      ? `<span class="tdrag"><span class="drag-grip" data-grip="${stop.id}" role="button" tabindex="0" aria-label="Drag ${esc(stop.name)} to reorder">${icon('grip', 13)}</span></span>`
      : `<span class="grip">${icon('sliders', 10)}</span>`}
  </div>`;
}

function tripCTAHTML() {
  const days = tripDays();
  const dayNo = clamp(S.tripDay, 0, days.length - 1);
  const stops = days[dayNo].stops;
  const saved = S.tripSaved;
  const dirty = S.tripDirty;
  return `<div class="trip-cta${saved && !dirty ? ' ready' : ''}">
    <div class="tc-status">
      <b><span class="tc-dot ${saved && !dirty ? 'ok' : ''}"></span>${saved ? (dirty ? 'Unsaved changes' : 'Plan saved') : 'Draft plan'}</b>
      <small>${stops.length} stops · Day ${dayNo + 1} of ${days.length}</small>
    </div>
    ${saved && !dirty
      ? `<button class="tc-btn lime" data-act="trip-start">${icon('walk', 13)}Start trip ${icon('arrowr', 12)}</button>`
      : `<button class="tc-btn" data-act="trip-save">${icon('check', 12)}Save plan</button>`}
  </div>`;
}

/* ---------- live trip ---------- */
function livePin(stop, index) {
  const state = index < S.liveStop ? 'done' : index === S.liveStop ? 'now' : 'next';
  return `<span class="lpin ${state}" style="left:${stop.x * 100}%;top:${stop.y * 100}%">${state === 'done' ? icon('check', 9) : index + 1}</span>`;
}

function liveTripView() {
  const days = tripDays();
  const dayNo = clamp(S.tripDay, 0, days.length - 1);
  const day = days[dayNo];
  const stops = day.stops;
  const n = stops.length;
  const done = S.liveStop >= n;
  const idx = done ? n - 1 : S.liveStop;
  const stop = stops[idx];
  const next = stops[S.liveStop + 1];
  const visited = Math.min(S.liveStop, n);
  const pct = Math.round((visited / n) * 100);
  const walked = (visited * 0.72).toFixed(1);
  const clock = plusMinutes(done ? (stops[n - 1] ? stops[n - 1].time : '17:30') : stop.time, 12);
  const eta = plusMinutes(stops[n - 1] ? stops[n - 1].time : '17:30', 60);
  const lat = (39.93 - (stop.y - 0.5) * 0.09).toFixed(4);
  const lng = (116.39 + (stop.x - 0.5) * 0.11).toFixed(4);
  const shortTitle = day.title.split('·')[0].trim();

  return `
    <header class="top live-top">
      <div>
        <div class="eyebrow live-eyebrow"><span class="live-dot"></span>LIVE TRIP / DAY ${dayNo + 1} · ${esc(day.date)}</div>
        <div class="h1row"><div class="h1">${esc(tr(shortTitle))}</div></div>
        <div class="meta">2 travelers · started 09:00</div>
      </div>
      <div class="top-right">
        <button class="small-chip" data-act="trip-live-end">${icon('x', 9)}End</button>
        <div class="meta">${clock} · Beijing</div>
      </div>
    </header>

    <article class="live-card">
      <div class="live-row">
        ${ring(pct / 100, 42, 3.6, 'var(--coral)', 'rgba(25,23,16,.14)', `${pct}%`)}
        <div class="grow">
          <b>${done ? 'Trip complete' : visited === 0 ? 'Just started · first stop ahead' : `${visited} of ${n} stops done`}</b>
          <small>${walked} km walked · ${done ? 'all stops covered' : `ends about ${eta}`}</small>
        </div>
        ${done ? '' : `<span class="live-where">${icon('pin', 9)}${esc(stop.name.split('·')[0].trim())}</span>`}
      </div>
      <div class="live-bar"><i style="width:${Math.max(4, pct)}%"></i></div>
    </article>

    <article class="tmap live-map">
      <div class="map-inner">
        ${mapBase()}
        <div class="map-wash"></div>
        <div class="map-body">
          <svg class="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="${routePathD(stops)}" fill="none" stroke="rgba(25,23,16,.32)" stroke-width="3" stroke-dasharray="6 5" vector-effect="non-scaling-stroke"/>
            ${S.liveStop > 0 ? `<path d="${routePathD(stops.slice(0, Math.min(S.liveStop + 1, n)))}" fill="none" stroke="var(--coral)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` : ''}
          </svg>
          ${stops.map((s, i) => livePin(s, i)).join('')}
          ${done ? '' : `<span class="you-tag" style="left:${stop.x * 100}%;top:${stop.y * 100}%">You are here</span>`}
        </div>
      </div>
      <div class="live-map-tag">${icon('pin', 8)} ${lat}° N, ${lng}° E</div>
      ${mapZoomBtns()}
    </article>

    ${done ? `
    <article class="done-card">
      <span class="done-ico">${icon('check', 16)}</span>
      <b>Day ${dayNo + 1} complete</b>
      <p>You covered ${n} stops and ${(n * 0.72).toFixed(1)} km. Your plan and the other ${days.length - 1} days are still saved.</p>
      <div class="done-stats">
        <div><b>${n}</b><span>stops</span></div>
        <div><b>${(n * 0.72).toFixed(1)}</b><span>km walked</span></div>
        <div><b>${eta}</b><span>finished</span></div>
      </div>
    </article>` : `
    <article class="now-card">
      <div class="now-top">
        <span class="now-badge">${icon('pin', 8)}NOW · ${esc(stop.time)}</span>
        <span class="now-count">Stop ${idx + 1} / ${n}</span>
      </div>
      <div class="now-title">${esc(stop.name)}</div>
      <div class="now-meta"><span>${esc(stop.duration || '45 min')}</span> · <span>${esc(stop.tag || 'On the route')}</span></div>
      <div class="now-loc">${icon('pin', 9)}<span>${idx === 0 ? 'Start point · 120 m away' : '6 min walk from the last stop'} · ${lat}° N ${lng}° E</span></div>
      <div class="now-actions">
        <button data-act="assistant" data-ctx="Live · ${esc(stop.name)}">${sparkleIcon(9)}Ask Pico</button>
        <button data-act="toast" data-text="Navigation opened · ${esc(stop.name)}" data-icon="pin">${icon('map', 9)}Navigate</button>
      </div>
    </article>

    ${next ? `<button class="next-card" data-act="trip-live-next">
      <span class="nc-label">UP NEXT · 6 MIN</span>
      <span class="nc-main"><b>${esc(next.name)}</b><small>${esc(next.time)} · ${esc(next.duration || '45 min')}</small></span>
      <span class="nc-go">${icon('right', 9)}</span>
    </button>` : `<div class="next-card last"><span class="nc-label">LAST STOP</span><span class="nc-main"><b>Finish here</b><small>Tap Next stop to wrap up the day</small></span></div>`}
    `}
    `;
}

function liveCTAHTML() {
  const n = activeDay().stops.length;
  const done = S.liveStop >= n;
  const visited = Math.min(S.liveStop, n);
  const walked = (visited * 0.72).toFixed(1);
  return `<div class="trip-cta live-cta">
    <button class="tc-stop" data-act="trip-live-end" aria-label="End live trip">${icon('x', 13)}</button>
    <div class="tc-status">
      <b>${done ? 'Day complete' : 'On the move'}</b>
      <small>${done ? `${n} stops · ${(n * 0.72).toFixed(1)} km` : `${S.liveStop} of ${n} stops · ${walked} km`}</small>
    </div>
    <button class="tc-btn lime" data-act="${done ? 'trip-live-back' : 'trip-live-next'}">
      ${done ? 'Back to plan' : S.liveStop === n - 1 ? 'Finish day' : 'Next stop'} ${icon('arrowr', 12)}
    </button>
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
        ? (S.planBuilt
          ? `<button class="quiz-retake" data-act="assistant" data-ctx="Trip · Adjust the plan">Adjust ${icon('arrowur', 7)}</button>`
          : `<button class="quiz-retake" data-act="quiz-reset">Retake ${icon('arrowur', 7)}</button>`)
        : `<span class="quiz-hintline">Answer all three for your title</span>`}
    </div>
    ${persona
      ? `<div class="quiz-result">
          <span class="qr-ico">${icon(persona.icon, 14)}</span>
          <span class="grow"><small>YOUR TRAVEL TITLE</small><b>${esc(tr(persona.title))}</b><em>${persona.metaParts.map((p) => esc(tr(p))).join(' · ')}</em>${persona.note ? `<em class="qr-note">${esc(persona.note)}</em>` : ''}</span>
          <button class="qr-go" data-act="trip-day" data-day="0" data-scroll="1">${icon('map', 9)}${esc(tr(persona.fit))}</button>
        </div>`
      : `${QUIZ.map((q) => `<div class="quiz-q">
          <div class="quiz-label">${esc(tr(q.label))}</div>
          <div class="quiz-opts">
            ${q.options.map((o) => `<button class="qchip ${S.quiz[q.key] === o ? 'on' : ''}" data-act="quiz" data-key="${q.key}" data-val="${esc(o)}" aria-pressed="${S.quiz[q.key] === o}">${esc(tr(o))}</button>`).join('')}
          </div>
        </div>`).join('')}
        ${quizNoteHTML('quiz')}
        <div class="quiz-empty">${icon('info', 9)} ${esc(tr('Pick one per question — it only changes your suggestion, never the plan.'))}</div>`}
  </article>`;
}

function tripPlanCard(p, index) {
  const open = S.expandedPlan === index;
  const when = dayDate(index);
  return `<article class="trip-plan ${open ? 'open' : ''}">
    <button class="tp-head" data-act="toggle-trip-plan" data-index="${index}" aria-expanded="${open}">
      <span class="tp-date"><b>${when.date}</b><small>${tr(when.week)}</small></span>
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
      <div class="map-inner">
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
      </div>
      ${mapZoomBtns()}
      ${S.editMode ? `<div class="map-hint">${icon('hand', 9)} ${icon('move', 8)} Drag a numbered dot — the route recalculates</div>` : ''}
    </div>

    <header class="plan-head">
      <div class="spread" style="align-items:flex-start">
        <div>
          <div class="eyebrow"><span class="eyebrow-line"></span>My plan / CITYWALK <span class="tag lime" style="transform:rotate(3deg)">DAY 02</span></div>
          <div class="name">${esc(tr(S.routeName))}</div>
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

      <div class="stops${S.editMode ? ' edit' : ''}" id="stopList">
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
  const editing = S.editMode || S.tripEdit;
  return `<button class="pin ${selected ? 'selected' : ''} ${editing ? 'edit' : ''}" style="left:${stop.x * 100}%;top:${stop.y * 100}%"
    data-pin="${stop.id}" data-act="${editing ? 'noop' : 'select-stop'}" data-id="${stop.id}" aria-label="${esc(stop.name)}">
    ${index + 1}
    ${editing ? `<span class="move">${icon('move', 7)}</span>` : ''}
  </button>
  ${selected ? `<div class="pin-label" style="left:${stop.x * 100}%;top:${stop.y * 100}%"><b>${esc(stop.name)}</b><span>${esc(stop.time)}</span></div>` : ''}`;
}
function stopRowHTML(stop, index) {
  const colors = ['var(--mustard)', 'var(--pink)', 'var(--mint)', 'var(--peri)', 'var(--lime)', 'var(--sky)'];
  const selected = S.selected === stop.id;
  const grip = S.editMode
    ? `<span class="grip" data-plan-grip="${stop.id}" title="${S.lang === 'zh' ? '拖动排序' : 'Drag to reorder'}">${icon('grip', 11)}</span>`
    : `<span class="grip">${icon(selected ? 'arrowur' : 'sliders', 10)}</span>`;
  return `<button class="stop-row ${selected ? 'on' : ''}" data-act="select-stop" data-id="${stop.id}" data-index="${index}">
    <span class="time">${esc(stop.time)}</span>
    <span class="num" style="background:${colors[index % colors.length]}">${index + 1}</span>
    <span class="info"><b>${esc(stop.name)} ${stop.tag ? tag(stop.tag, stop.tagStyle || 'soft') : ''}</b><small>${esc(stop.duration)} · 6 min walk</small></span>
    ${grip}
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

function initMapDrag(bodySel = '#mapBody', stops = S.stops) {
  const body = $(bodySel);
  if (!body || (bodySel === '#mapBody' ? !S.editMode : !S.tripEdit)) return;
  $$('.pin', body).forEach((pin) => {
    pin.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      const id = pin.dataset.pin;
      const stop = stops.find((s) => s.id === id);
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
        paths.forEach((p) => { if (p.getAttribute('stroke') !== null) p.setAttribute('d', routePathD(stops)); });
        const label = $('.pin-label', body);
        if (label) { label.style.left = `${nx * 100}%`; label.style.top = `${ny * 100}%`; }
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        markPlanEdited();
        toast('Stop moved · route recalculated', 'refresh');
        if (bodySel === '#tripMapBody') render();
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
    const raw = [p.title, p.body, p.author, ...p.tags];
    const localized = [tr(p.title), tr(p.body), p.author, ...p.tags.map((t) => tr(t))];
    return [...raw, ...localized].join(' ').toLowerCase().includes(q);
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
    <div class="st-left"><span class="live-dot"></span><b>${k.id === 'all' ? 'Latest notes' : `${tr(k.lab)}${S.lang === 'zh' ? '笔记' : ' notes'}`}</b></div>
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
  const dayCount = tripDayCount();
  const firstDay = dayDate(0);
  const lastDay = dayDate(dayCount - 1);
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
        <span class="meta">${esc(tripDateRange(dayCount))}</span>
      </div>
      <h3>Beijing · ${dayCount} days, ${dayCount - 1} nights</h3>
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
      <button class="jr-now" data-act="report" data-id="beijing">
        <span class="jr-pulse"></span>
        <span class="grow"><b>${S.tripWrapped ? 'Beijing · recap ready' : 'Beijing · in progress'}</b><small>${S.tripWrapped ? `<span>${esc(tr('The Central Axis Cartographer'))}</span> · <span>13 new places</span>` : `Wrap-up unlocks ${dayDate(tripDayCount()).date} — tap to preview the recap`}</small></span>
        <span class="tag soft">${S.tripWrapped ? 'Recap' : 'Preview'}</span>
      </button>
      ${JOURNEYS.map((j) => `<button class="jr-row" data-act="report" data-id="${j.id}">
        <span class="jr-year">${esc(j.dates)}</span>
        <span class="grow"><b>${esc(tr(j.city))} · ${esc(tr(j.title))}</b><small>${j.newPlaces} new places · rarest find ${j.rarePct}%</small></span>
        <span class="jr-arrow">${icon('arrowur', 10)}</span>
      </button>`).join('')}
      <div class="jr-foot">${icon('info', 9)} Each finished trip is archived automatically, on your device.</div>
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">02</span><h2>Attraction bookings</h2></div><span class="meta">${bookedCount} / ${attractionTotal} booked</span></div>
    <div class="resv-card">
      <div class="resv-head">
        <div class="grow">
          <div class="spread"><b>Beijing · ${dayCount} days, ${dayCount - 1} nights</b><span class="resv-count">${bookedPct}%</span></div>
          <small>Tickets are issued by the venues; scan your passport at the gate</small>
          <div class="resv-progress"><i style="width:${bookedPct}%"></i></div>
        </div>
        <button class="resv-all" data-act="book-all" ${bookedCount === attractionTotal ? 'disabled' : ''}>${bookedCount === attractionTotal ? 'All booked' : 'Book all'}</button>
      </div>
      <div class="resv-list">
        ${S.attractions.map((a) => {
          const when = dayDate((a.day || 1) - 1);
          return `<div class="resv-row" data-act="resv-info" data-id="${a.id}" role="button" tabindex="0">
          <span class="resv-date"><b>${esc(when.date)}</b><small>${esc(tr(when.week))}</small></span>
          <span class="grow resv-info"><b>${esc(a.name)}</b><small>${esc(a.time)} · ${esc(a.people)} · ${esc(a.price)}</small></span>
          ${a.booked
            ? `<span class="resv-status ok">${icon('check', 8)}Booked</span>`
            : `<button class="resv-book" data-act="book-attraction" data-id="${a.id}">Book</button>`}
        </div>`;
        }).join('')}
      </div>
      <div class="resv-tip">${icon('info', 10)}<span>${firstDay.week === 'Mon'
        ? 'The Forbidden City is closed on Mondays — Day 1 lands on a Monday. Move the start date to keep the palace.'
        : `The Forbidden City closes on Mondays; it is open ${esc(firstDay.week)} ${esc(firstDay.date)}. Your booking receipts stay here.`}</span></div>
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
        <div class="ext-row">${icon('plane', 11)}<span class="grow"><b>Air China CA182</b><small>${esc(firstDay.date)} 08:45 → 11:20 · Capital T3 · ticketed</small></span></div>
        <div class="ext-row">${icon('bed', 11)}<span class="grow"><b>Mandarin Oriental Wangfujing</b><small>${esc(firstDay.date)} – ${esc(lastDay.date)} · ${dayCount - 1} nights · confirmed</small></span></div>
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
  addStop: addStopSheet,
  notes: notesSheet,
  checklist: checklistSheet,
  dates: tripDatesSheet,
  place: placeSheet,
  compose: composeSheet,
  phrase: phraseSheet,
  post: postSheet
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
  zhify(layer);
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
    zhify(c);
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

/* ---------- trip wrap-up (end-of-journey recap) ---------- */
const RECAPS = {
  beijing: {
    id: 'beijing', city: 'Beijing', dates: '10/15 – 10/18', year: '2026',
    color: 'lime',
    title: 'The Central Axis Cartographer',
    kicker: 'Your Beijing chapter',
    blurb: 'Four days, seventeen stops, one straight line through the middle of Beijing — and every side door that opened along the way.',
    quote: 'You walked the axis like a local: early gates, long lunches, and never a queue longer than twelve minutes.',
    rank: 7, days: 4, places: 17, newPlaces: 13, km: 31.8, steps: '41,600', onFeet: '9h 20m',
    rare: 'Corner Tower moat walk', rarePct: 2.7,
    hidden: [
      { name: 'Corner Tower moat walk', pct: 2.7 },
      { name: 'Zhihua Temple side courtyard', pct: 4.9 },
      { name: 'Yandai Xiejie back lane', pct: 12 },
      { name: 'Jingshan east slope', pct: 23 },
      { name: 'Shichahai west bank', pct: 31 },
      { name: 'Forbidden City · 09:00 gate', pct: 88 }
    ],
    solved: [
      { icon: 'ticket', title: 'The palace sold out at 13:00', note: 'Pico moved you to the 09:00 gate — inside before the tour groups.' },
      { icon: 'route', title: "Chang'an Avenue closed for the marathon", note: 'Rerouted through the hutongs; you arrived 20 minutes early.' },
      { icon: 'sun', title: 'Rain forecast on Great Wall morning', note: 'Swapped Days 2 and 3. You climbed Badaling in full sun.' },
      { icon: 'fork', title: 'Siji Minfu had a 90-minute queue', note: 'A table was held for 11:20. Duck on the table by 11:35.' },
      { icon: 'clock', title: 'Jingshan last entry in 11 minutes', note: 'Found the east gate and made sunset with 4 minutes to spare.' },
      { icon: 'users', title: 'Two passports, one booking', note: 'Split the reservation and kept both seats together.' },
      { icon: 'walk', title: 'Shichahai kept pulling the route west', note: 'Moved it to 13:00 — 1.2 km less on tired feet.' }
    ],
    unlocked: [
      'Tiananmen Square', 'Forbidden City', 'Jingshan Park', 'Shichahai', 'Nanluoguxiang',
      'Drum & Bell Towers', 'Badaling Great Wall', 'Summer Palace', 'National Museum of China',
      'Qianmen Street', 'Olympic Forest Park', 'Daoxiangcun', 'Hutong coffee'
    ],
    foods: [
      { name: 'Peking duck', place: 'Siji Minfu', img: 'img/posts/post-n3.jpg', note: 'Crackled at 11:35, no queue.' },
      { name: 'Copper-pot hotpot', place: 'Manhengji', img: 'img/posts/post-n10.jpg', note: 'Hand-cut lamb, sesame dip.' },
      { name: 'Daoxiangcun pastries', place: 'Qianmen', img: 'img/posts/post-n7.jpg', note: 'Loose ones, not the gift box.' },
      { name: 'Hutong coffee', place: 'Qianmen back lane', img: 'img/posts/post-n4.jpg', note: 'Afternoon light included.' }
    ],
    extraFoods: ['Zhajiang noodles', 'Jianbing', 'Tanghulu', 'Sour plum drink']
  },
  chengdu: {
    id: 'chengdu', city: 'Chengdu', dates: 'Mar 2026', year: '2026',
    color: 'mint',
    title: 'The Bamboo Teahouse Wanderer',
    kicker: 'Your Chengdu chapter',
    blurb: 'Five days of teahouses, chilli oil and one very long bamboo walk. You never once took a taxi before noon.',
    quote: 'You ordered like a local by day two, and the teahouse auntie still remembers your usual seat.',
    rank: 12, days: 5, places: 14, newPlaces: 11, km: 38.4, steps: '50,200', onFeet: '11h 05m',
    rare: 'Wangjianglou bamboo grove', rarePct: 3.2,
    hidden: [
      { name: 'Wangjianglou bamboo grove', pct: 3.2 },
      { name: "Yu's Bakery back lane", pct: 7.8 },
      { name: "People's Park teahouse", pct: 28 },
      { name: 'Wenshu Monastery', pct: 54 },
      { name: 'Kuanzhai Alley', pct: 81 }
    ],
    solved: [
      { icon: 'sun', title: 'A week of drizzle', note: 'Teahouse mornings and museum afternoons; the rain never ruined one.' },
      { icon: 'fork', title: 'Every hotpot had a queue', note: 'Booked at 16:30 for an 18:00 table, twice.' },
      { icon: 'route', title: 'The panda base was sold out', note: 'Caught the 07:10 slot the day it reopened.' },
      { icon: 'users', title: 'A friend joined on day three', note: 'Reworked the walk and kept the walking under 9 km.' }
    ],
    unlocked: ['Wangjianglou Park', "Yu's Bakery", "People's Park", 'Wenshu Monastery', 'Kuanzhai Alley', 'Panda Base', 'Yulin back streets', 'Jinli', 'Sichuan Opera', 'Anshun Bridge', 'Taikoo Li'],
    foods: [
      { name: 'Sichuan hotpot', place: 'Yulin', img: 'img/posts/post-n10.jpg', note: 'Mild side, twice.' },
      { name: 'Dan dan noodles', place: 'Back lane', img: 'img/posts/post-n3.jpg', note: 'Breakfast of champions.' },
      { name: 'Teahouse snacks', place: "People's Park", img: 'img/posts/post-n7.jpg', note: 'Peanuts and a bottomless cup.' },
      { name: 'Hutong coffee', place: 'Yulin', img: 'img/posts/post-n4.jpg', note: 'A break from chilli.' }
    ],
    extraFoods: ['Mapo tofu', 'Rabbit head', 'Sweet water noodles']
  },
  shanghai: {
    id: 'shanghai', city: 'Shanghai', dates: 'Nov 2025', year: '2025',
    color: 'pink',
    title: 'The Lane Flâneur',
    kicker: 'Your Shanghai chapter',
    blurb: 'Four days of art deco lanes, midnight noodles and a ferry you took three times for the view.',
    quote: 'You found the city between the avenues — one lane at a time, always with a coffee in hand.',
    rank: 18, days: 4, places: 12, newPlaces: 9, km: 41.2, steps: '53,800', onFeet: '12h 10m',
    rare: 'Zhangyuan lane houses', rarePct: 6.8,
    hidden: [
      { name: 'Zhangyuan lane houses', pct: 6.8 },
      { name: 'Yangjing snack street', pct: 11 },
      { name: 'West Bund galleries', pct: 34 },
      { name: 'Wukang Road', pct: 62 },
      { name: 'The Bund', pct: 94 }
    ],
    solved: [
      { icon: 'clock', title: 'The museum closed early', note: 'Caught the last entry with 25 minutes to spare.' },
      { icon: 'sun', title: 'A sudden downpour on the Bund', note: 'Ducked into a ferry, crossed twice, stayed dry.' },
      { icon: 'fork', title: 'Midnight noodles were full', note: 'Found the second shop on Yangjing street.' },
      { icon: 'walk', title: 'The river walk was longer than it looked', note: 'Swapped to a tram for the last 3 km.' }
    ],
    unlocked: ['Zhangyuan', 'Yangjing snack street', 'West Bund', 'Wukang Road', 'The Bund', 'Yuyuan Garden', 'Tianzifang', 'Power Station of Art', 'Ferry Line 2', 'Anfu Road'],
    foods: [
      { name: 'Scallion oil noodles', place: 'Yangjing', img: 'img/posts/post-n3.jpg', note: 'Midnight bowl.' },
      { name: 'Shengjian bao', place: 'Yuyuan', img: 'img/posts/post-n10.jpg', note: 'Burnt bottom, soup inside.' },
      { name: 'Butter pastries', place: 'Zhangyuan', img: 'img/posts/post-n7.jpg', note: 'Warm from the oven.' },
      { name: 'Lane coffee', place: 'Wukang Road', img: 'img/posts/post-n4.jpg', note: 'Three in four days.' }
    ],
    extraFoods: ['Crab roe noodles', 'Shanghai soup dumplings', 'Sesame ice cream']
  }
};

/* ---------- full-screen trip wrap-up ---------- */
function recapData() { return RECAPS[S.recap] || RECAPS.beijing; }
function recapCity(city) {
  if (S.lang !== 'zh') return city;
  return { Beijing: '北京', Chengdu: '成都', Shanghai: '上海' }[city] || city;
}
function recapTotal() { return 8; }
function openRecap(id) {
  S.recap = RECAPS[id] ? id : 'beijing';
  S.recapSlide = 0;
  if (S.sheet) closeSheet();
  renderRecap();
  HapticsPulse();
}
function closeRecap() {
  S.recap = null;
  const layer = $('#recapLayer');
  if (!layer) return;
  layer.classList.remove('show');
  setTimeout(() => { if (!S.recap) layer.innerHTML = ''; }, 280);
}
function recapGo(delta) {
  const next = clamp(S.recapSlide + delta, 0, recapTotal() - 1);
  if (next === S.recapSlide) return;
  S.recapSlide = next;
  renderRecap();
}
function recapJump(index) {
  const next = clamp(Number(index) || 0, 0, recapTotal() - 1);
  if (next === S.recapSlide) return;
  S.recapSlide = next;
  renderRecap();
}
function HapticsPulse() { if (navigator.vibrate) { try { navigator.vibrate(6); } catch (e) {} } }

function recapSlideHTML(r, index) {
  const active = index === S.recapSlide ? ' active' : '';
  const head = (kicker, extra = '') => `<div class="rslide-top"><span>${kicker}</span>${extra}</div>`;

  if (index === 0) {
    return `<section class="rslide r-cover${active}" data-slide="0">
      <div class="cover-top">
        <span class="cover-eyebrow">TRIP WRAP-UP · ${r.year}</span>
        <span class="cover-stamp">WALKED<br><b>${r.km} KM</b></span>
      </div>
      <div class="cover-ghost" aria-hidden="true">${r.year}</div>
      <div class="cover-main">
        <div class="cover-city">${esc(r.city.toUpperCase())}</div>
        <div class="cover-dates"><b>${esc(r.dates)}</b><span>${r.days} days · ${r.places} stops</span></div>
        <svg class="cover-route" viewBox="0 0 340 120" fill="none" aria-hidden="true">
          <path d="M6 92 C 58 92, 54 28, 110 34 S 190 102, 238 78 300 26 334 40" stroke="var(--rc)" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 7"/>
          <circle cx="6" cy="92" r="4" fill="var(--recap-cream)"/>
          <circle cx="334" cy="40" r="4" fill="var(--rc)"/>
        </svg>
        <h1 class="cover-title">The city,<br><em>one step at a time.</em></h1>
        <p class="cover-sub">${esc(r.blurb)}</p>
      </div>
      <div class="cover-foot">${icon('hand', 11)} Swipe or tap next</div>
    </section>`;
  }

  if (index === 1) {
    return `<section class="rslide r-title${active}" data-slide="1">
      <div class="rslide-scroll">
        ${head('YOUR EXPLORER TITLE', `<span class="r-tag">${icon('sparkle', 8)} ${S.lang === 'zh' ? '年度称号' : 'OF THE TRIP'}</span>`)}
        <div class="title-wrap">
          <span class="title-pre">You are officially</span>
          <h2 class="rtitle">${esc(r.title)}</h2>
        </div>
        <div class="title-rule"></div>
        <div class="rank-line">
          <span class="rank-num">Top ${r.rank}%</span>
          <span class="rank-label">of ${esc(recapCity(r.city))} explorers<br>this season</span>
        </div>
        <p class="rblurb">${esc(r.quote)}</p>
        <div class="stamp-row">
          <span class="rstamp">${icon('walk', 9)} ${r.km} km</span>
          <span class="rstamp">${icon('pin', 9)} ${r.newPlaces} new places</span>
          <span class="rstamp">${icon('star', 9)} rarest ${r.rarePct}%</span>
        </div>
      </div>
    </section>`;
  }

  if (index === 2) {
    return `<section class="rslide r-hidden${active}" data-slide="2">
      <div class="rslide-scroll">
        ${head('THE ROAD LESS WALKED', `<span class="r-count">${String(index + 1).padStart(2, '0')} / 08</span>`)}
        <div class="big-line"><b>${r.hidden.length}</b><span>places only a few<br>travelers find</span></div>
        <p class="rlede"><span>Your rarest stop was</span> <b>${esc(r.rare)}</b> <span>— only</span> <em>${r.rarePct}%</em> <span>of RoamChina travelers have unlocked it.</span></p>
        <div class="rarity-list">
          ${r.hidden.map((h, i) => `<div class="rarity-row" style="--i:${i}">
            <div class="rarity-top"><span>${esc(h.name)}</span><b>${h.pct}%</b></div>
            <div class="rarity-bar"><i style="width:${Math.max(3, h.pct)}%"></i></div>
            <small>${h.pct < 10 ? 'A true side door' : h.pct < 50 ? 'Known by the curious' : 'A classic, well earned'}</small>
          </div>`).join('')}
        </div>
        <div class="r-note">${icon('info', 9)} Share of travelers who checked in here — lower is rarer.</div>
      </div>
    </section>`;
  }

  if (index === 3) {
    return `<section class="rslide r-solved${active}" data-slide="3">
      <div class="rslide-scroll">
        ${head('PICO’S QUIET WINS', `<span class="r-count">${String(index + 1).padStart(2, '0')} / 08</span>`)}
        <div class="big-line"><b>${String(r.solved.length).padStart(2, '0')}</b><span>problems handled before<br>they became stories</span></div>
        <div class="solved-list">
          ${r.solved.map((s, i) => `<div class="solved-row" style="--i:${i}">
            <span class="solved-ico">${icon(s.icon, 13)}</span>
            <div class="grow"><b>${esc(s.title)}</b><small>${esc(s.note)}</small></div>
            <span class="solved-check">${icon('check', 8)}</span>
          </div>`).join('')}
        </div>
        <div class="r-note">${icon('sparkle', 9)} No refunds, no rebookings, no lost afternoons.</div>
      </div>
    </section>`;
  }

  if (index === 4) {
    return `<section class="rslide r-places${active}" data-slide="4">
      <div class="rslide-scroll">
        ${head('NEW GROUND', `<span class="r-count">${String(index + 1).padStart(2, '0')} / 08</span>`)}
        <div class="big-line"><b>${r.newPlaces}</b><span>new places unlocked<br>on this trip</span></div>
        <p class="rlede">${r.places} stops in total. Some were on every list; the good ones were not.</p>        <div class="place-grid">
          ${r.unlocked.map((p, i) => `<span class="place-chip" style="--i:${i}"><b>${String(i + 1).padStart(2, '0')}</b>${esc(p)}</span>`).join('')}
        </div>
        <div class="r-note">${icon('pin', 9)} First-time check-ins, collected into your Beijing passport.</div>
      </div>
    </section>`;
  }

  if (index === 5) {
    return `<section class="rslide r-food${active}" data-slide="5">
      <div class="rslide-scroll">
        ${head('THE EATING PART', `<span class="r-count">${String(index + 1).padStart(2, '0')} / 08</span>`)}
        <div class="big-line"><b>${r.foods.length}</b><span>meals worth the walk</span></div>
        <div class="food-grid">
          ${r.foods.map((f, i) => `<div class="food-card" style="--i:${i}">
            <div class="food-photo"><img src="${esc(f.img)}" alt="${esc(f.name)}" loading="lazy"><span>${icon('fork', 8)}</span></div>
            <div class="food-copy"><b>${esc(f.name)}</b><small>${esc(f.place)} · ${esc(f.note)}</small></div>
          </div>`).join('')}
        </div>
        <div class="food-extra">
          <span class="r-kicker">Also eaten</span>
          ${r.extraFoods.map((f) => `<span class="food-chip">${esc(f)}</span>`).join('')}
        </div>
        <div class="r-note">${icon('heart', 9)} Every one within a 12-minute walk of the route.</div>
      </div>
    </section>`;
  }

  if (index === 6) {
    return `<section class="rslide r-distance${active}" data-slide="6">
      <div class="rslide-scroll">
        ${head('MILES IN YOUR SHOES', `<span class="r-count">${String(index + 1).padStart(2, '0')} / 08</span>`)}
        <div class="km-line"><b>${r.km}</b><span>km<br>on foot</span></div>
        <div class="distance-rule">
          <span class="dr-start">START</span>
          <i></i><i></i><i></i><i></i>
          <span class="dr-end">${esc(r.dates.split('–')[1].trim())}</span>
        </div>
        <div class="distance-stats">
          <div><b>${r.steps}</b><span>steps</span></div>
          <div><b>${r.onFeet}</b><span>on your feet</span></div>
          <div><b>${r.days}</b><span>days out</span></div>
        </div>
        <p class="rblurb big">About three-quarters of a marathon — in one pair of shoes, with coffee stops.</p>
        <div class="distance-note">${icon('walk', 10)} More than 82% of RoamChina travelers walk on a ${r.days}-day trip.</div>
      </div>
    </section>`;
  }

  return `<section class="rslide r-final${active}" data-slide="7">
    <div class="rslide-scroll">
      <div class="final-badge">${icon('check', 9)} TRIP COMPLETE</div>
      <h2 class="final-title">The city<br><em>remembers.</em></h2>
      <p class="rblurb">This one is archived in Journey reports, with the title, the rare places and every meal attached.</p>
      <div class="final-card">
        <span class="fc-kicker">${esc(recapCity(r.city))} · ${esc(r.dates)}</span>
        <b class="fc-title">${esc(r.title)}</b>
        <div class="fc-stats">
          <div><b>${r.newPlaces}</b><span>new places</span></div>
          <div><b>${r.km}</b><span>km walked</span></div>
          <div><b>Top ${r.rank}%</b><span>explorers</span></div>
        </div>
      </div>
      <div class="final-actions">
        <button class="r-primary" data-act="recap-share">${icon('share', 12)} Share recap</button>
        <button class="r-ghost" data-act="recap-close">Back to your trip ${icon('arrowr', 10)}</button>
      </div>
      <div class="r-note">${icon('lock', 9)} Kept on your device · nothing shared unless you tap share.</div>
    </div>
  </section>`;
}

function renderRecap() {
  const layer = $('#recapLayer');
  if (!layer) return;
  if (!S.recap) { layer.classList.remove('show'); return; }
  const r = recapData();
  const total = recapTotal();
  S.recapSlide = clamp(S.recapSlide, 0, total - 1);
  layer.innerHTML = `<div class="recap" style="--rc:var(--${r.color})">
    <div class="recap-grain" aria-hidden="true"></div>
    <header class="recap-head">
      <button class="recap-close" data-act="recap-close" aria-label="Close recap">${icon('x', 11)}</button>
      <span class="recap-label">TRIP WRAP-UP</span>
      <span class="recap-count">${String(S.recapSlide + 1).padStart(2, '0')} <i>/</i> ${String(total).padStart(2, '0')}</span>
    </header>
    <div class="recap-slides" id="recapSlides">
      ${Array.from({ length: total }, (_, i) => recapSlideHTML(r, i)).join('')}
    </div>
    <footer class="recap-foot">
      <div class="recap-dots">${Array.from({ length: total }, (_, i) => `<button class="${i === S.recapSlide ? 'on' : ''}" data-act="recap-dot" data-index="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}</div>
      <button class="recap-next" data-act="recap-next">
        <span>${S.recapSlide === total - 1 ? 'Finish' : 'Next'}</span>${icon(S.recapSlide === total - 1 ? 'check' : 'arrowr', 11)}
      </button>
    </footer>
  </div>`;
  layer.classList.add('show');
  zhify(layer);
  initRecapSwipe();
}

function initRecapSwipe() {
  const deck = $('#recapSlides');
  if (!deck) return;
  let startX = 0; let startY = 0; let moved = false;
  deck.addEventListener('pointerdown', (e) => {
    startX = e.clientX; startY = e.clientY; moved = false;
  });
  deck.addEventListener('pointerup', (e) => {
    if (!startX) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = 0;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      moved = true;
      recapGo(dx < 0 ? 1 : -1);
    }
  });
}

/* ---------- assistant ---------- */
const PLAN_DAYS = [
  ['Day 1', 'Central Axis · Forbidden City & Jingshan'],
  ['Day 2', 'Great Wall · Badaling by private car'],
  ['Day 3', 'Imperial gardens · Palace & museum'],
  ['Day 4', 'Slow hutongs · departure']
];

function planLength() {
  if (S.quiz.days === '2–3 days') return 3;
  if (S.quiz.days === '6+ days') return 6;
  return 4; // 4–5 days, Surprise me, or nothing picked yet
}

/* The optional "anything else" line, mirrored in the planner and the trip-page
   retake. Both stay in sync through S.quiz.note. */
function quizNoteHTML(variant = 'planner') {
  const note = S.quiz.note || '';
  const count = `${note.length}/140`;
  if (variant === 'quiz') {
    return `<div class="quiz-note">
      <div class="qn-head"><span>${esc(tr('Anything else?'))}</span><em>${esc(tr('Optional'))}</em></div>
      <textarea data-quiz-note maxlength="140" rows="2" placeholder="${esc(tr('Must-sees, pace, kids, food allergies…'))}" aria-label="${esc(tr('Anything else?'))}">${esc(note)}</textarea>
    </div>`;
  }
  return `<div class="planner-q planner-custom${note ? ' filled' : ''}">
    <div class="pq-head">
      <span class="pq-num pq-plus">+</span>
      <span class="planner-label">${esc(tr('Anything else?'))}</span>
      <span class="pq-optional">${esc(tr('Optional'))}</span>
    </div>
    <div class="pq-inputwrap">
      <textarea data-quiz-note maxlength="140" rows="2" placeholder="${esc(tr('Must-sees, pace, kids, food allergies…'))}" aria-label="${esc(tr('Anything else?'))}">${esc(note)}</textarea>
      <span class="pq-count" data-quiz-count>${count}</span>
    </div>
  </div>`;
}

function planBuilderHTML() {
  const answered = quizAnswered();
  return `<div class="planner-card" id="plannerCard">
    <div class="planner-top">
      <span class="quiz-badge">${icon('sparkle', 10)} Trip match</span>
      <span class="planner-prog" aria-label="${answered} of 3 answered">
        ${QUIZ.map((q) => `<i class="${S.quiz[q.key] ? 'on' : ''}"></i>`).join('')}
        <b>${answered}/3</b>
      </span>
    </div>
    <div>
      <div class="planner-title">${esc(tr('Build your first Beijing trip'))}</div>
      <p class="planner-sub">${esc(tr("Three answers and I'll set the order, the timing and the walking."))}</p>
    </div>
    ${QUIZ.map((q, i) => `<div class="planner-q${S.quiz[q.key] ? ' done' : ''}">
      <div class="pq-head">
        <span class="pq-num">${i + 1}</span>
        <span class="planner-label">${esc(tr(q.label))}</span>
        <span class="pq-check">${icon('check', 8)}</span>
      </div>
      <div class="planner-opts" style="--cols:${q.options.length <= 4 ? 2 : 3}">
        ${q.options.map((o) => `<button class="qchip ${S.quiz[q.key] === o ? 'on' : ''}" data-act="quiz" data-key="${q.key}" data-val="${esc(o)}" aria-pressed="${S.quiz[q.key] === o}">${esc(tr(o))}</button>`).join('')}
      </div>
    </div>`).join('')}
    ${quizNoteHTML()}
    <button class="plan-generate" data-act="generate-plan">
      ${icon('sparkle', 12)}<span>Generate plan</span>${icon('arrowr', 11)}
    </button>
    <div class="planner-note" id="plannerNote">
      ${icon('info', 9)}<span>${answered === 3 ? esc(tr('All set — tap Generate plan.')) : esc(tr('Pick one per question — you can change it later.'))}</span>
    </div>
  </div>`;
}

function planSummaryHTML() {
  const persona = quizPersona();
  const days = planLength();
  const rows = PLAN_DAYS.slice(0, Math.min(days, 4));
  return `<div class="plan-ready">
    <div class="pr-head">
      <span class="quiz-badge">${icon('check', 9)} Plan ready</span>
      <span class="pr-days">${days} days</span>
    </div>
    <div class="pr-title">${esc(tr(persona ? persona.title : 'Your Beijing plan'))}</div>
    <div class="pr-meta">${[S.quiz.days, S.quiz.style, S.quiz.theme].map((v) => esc(tr(v))).join(' · ')}</div>
    ${persona && persona.note ? `<div class="pr-note">${icon('chat', 8)}<span>${esc(persona.note)}</span></div>` : ''}
    <div class="pr-stats">
      <div><b>${days}</b><span>days</span></div>
      <div><b>${days * 4}</b><span>stops</span></div>
      <div><b>${(days * 4.6).toFixed(1)}</b><span>km walking</span></div>
    </div>
    <div class="pr-days-list">
      ${rows.map(([d, t]) => `<div class="pr-row"><b>${esc(d)}</b><span>${esc(t)}</span></div>`).join('')}
      ${days > 4 ? `<div class="pr-more">+ ${days - 4} more days, saved to your trip</div>` : ''}
    </div>
    <button class="pr-open" data-act="open-trip">${icon('map', 10)} View my trip ${icon('arrowr', 10)}</button>
  </div>`;
}

function planNarrative(persona) {
  const style = S.quiz.style;
  const who = persona ? tr(persona.title) : tr('you');
  const note = (persona && persona.note) || '';
  if (S.lang === 'zh') {
    const zhDetail = style === 'Food first'
      ? '午饭是 11:30 排队前的烤鸭，景点之间还留了咖啡空档。'
      : style === 'Outdoors'
        ? '上午都在户外——日出时的景山、长城山脊、北海划船。'
        : style === 'Night owl'
          ? '17:00 前看完景点，之后鼓楼和后海接着带你过夜。'
          : style === 'Family friendly'
            ? '每天只排两个重点，中间留足休息和找洗手间的时间，地铁优先、少走回头路。'
            : style === 'Budget smart'
              ? '门票按免费或低价优先，午饭挑本地小馆，交通全用地铁和步行。'
              : '两段长长的博物馆时间和一个茶馆下午，每天走路不超过 4 公里。';
    const zhNote = note ? `你写的「${note}」我也记下了，排路线时会先顾这个。` : '';
    return `搞定。我给${who}排了 ${planLength()} 天的路线，第一天留给故宫。${zhDetail}${zhNote}想改什么直接说。`;
  }
  const detail = style === 'Food first'
    ? 'Lunch is a duck stop before the 11:30 queue, and there are coffee gaps between sights.'
    : style === 'Outdoors'
      ? 'Mornings stay outside — Jingshan at sunrise, the Great Wall ridge walk, boats at Beihai.'
      : style === 'Night owl'
        ? 'Sights finish by 17:00, then the Drum Tower and Houhai carry you into the evening.'
        : style === 'Family friendly'
          ? 'Two highlights a day, with rest and bathroom breaks between them, and metro over long walks.'
          : style === 'Budget smart'
            ? 'Free and low-cost sights first, lunch at local noodle shops, metro and walking only.'
            : 'Two long museum stops and a teahouse afternoon, never more than 4 km of walking a day.';
  const noteLine = note ? ` And I kept your note in mind: “${note}”.` : '';
  return `Done. I built a ${planLength()}-day route for ${who}, keeping the palace on day one. ${detail}${noteLine} Adjust anything by just asking.`;
}

function generatePlan() {
  const missing = QUIZ.find((q) => !S.quiz[q.key]);
  if (missing) {
    const card = $('#plannerCard');
    const note = $('#plannerNote');
    if (note) note.innerHTML = `${icon('info', 9)}<span>Still need “${esc(missing.label.replace('?', ''))}”.</span>`;
    if (card) {
      card.classList.remove('nudge');
      void card.offsetWidth;
      card.classList.add('nudge');
    }
    toast('Answer all three first', 'info');
    return;
  }
  const persona = quizPersona();
  const days = planLength();
  S.planning = false;
  S.planBuilt = true;
  S.tripDays = null;
  S.tripDay = 0;
  S.tripEdit = false;
  S.tripSaved = false;
  S.tripDirty = false;
  S.tripLive = false;
  S.liveStop = 0;
  S.assistantContext = `Plan · ${persona ? tr(persona.fit) : tr('Beijing')} · ${days} days`;
  S.routeName = `${persona ? tr(persona.fit) : tr('Central Axis')} · ${tr('New plan')}`;
  const note = (S.quiz.note || '').trim();
  S.messages.push({ role: 'user', text: `${S.quiz.days} · ${S.quiz.style} · ${S.quiz.theme}${note ? ` · ${note}` : ''}` });
  S.thinking = true;
  renderSheet();
  if (S.welcome) renderWelcome();
  clearTimeout(S.chatTimer);
  S.chatTimer = setTimeout(() => {
    S.thinking = false;
    S.messages.push({ role: 'assistant', text: planNarrative(persona), plan: true });
    if (S.welcome) {
      S.welcome = false;
      renderWelcome();
      S.tab = 'trip';
      S.tripDay = 0;
      render(true);
      toast(`Plan ready · ${days} days on your trip`, 'sparkle');
    } else if (S.sheet === 'assistant') {
      refreshChat();
      closeSheet();
      S.tab = 'trip';
      render(true);
      toast(`Plan ready · ${days} days on your trip`, 'sparkle');
    } else {
      toast('Plan ready · open Trip to see it', 'sparkle');
    }
  }, 1250);
}

function renderWelcome() {
  const layer = $('#welcomeLayer');
  if (!layer) return;
  if (!S.welcome) {
    layer.classList.remove('show');
    setTimeout(() => { if (!S.welcome) layer.innerHTML = ''; }, 280);
    return;
  }
  layer.innerHTML = `<div class="welcome">
    <div class="w-grain" aria-hidden="true"></div>
    <div class="w-scroll">
      <div class="w-top">
        <div class="w-brand"><span class="brand-mark">R</span><span>ROAMCHINA</span><i></i></div>
        <span class="w-step">FIRST TRIP · BEIJING</span>      </div>
      <h1 class="w-title">Beijing,<br><em>at your pace.</em></h1>
      <p class="w-lede">A city is better on foot. Pico knows the gates, the queues and the side doors — answer three questions and your first plan is ready.</p>
      <div class="w-pico">
        <span class="orb-mini">${sparkleIcon(18)}</span>
        <div class="grow">
          <b>Pico</b>
          <p>Hi, I'm Pico. Tell me what kind of trip you like and I'll build your first Beijing plan — route order, timing and all.</p>
        </div>
      </div>
      <div class="w-builder">${planBuilderHTML()}</div>
      ${S.thinking ? `<div class="w-thinking"><span class="thinking"><i></i><i></i><i></i></span><b>Pico is laying out your days…</b></div>` : ''}
      <div class="w-foot">${icon('hand', 10)} Choose one answer per question — there is no skip. Your plan is saved on this device.</div>
    </div>
  </div>`;
  layer.classList.add('show');
  zhify(layer);
}

function assistantSheet() {
  return `<div class="sheet tall">
    <div class="assistant-head">
      <span class="orb-mini">${sparkleIcon(16)}</span>
      <div class="grow">
        <div class="pico-title"><h3>Pico</h3><span class="live-chip ${PICO_ENDPOINT ? '' : 'off'}"><i></i>${PICO_ENDPOINT ? 'Live AI' : 'Not connected'}</span></div>
        <div class="ctx">${esc(S.planBuilt ? S.assistantContext : 'New trip · Planning with Pico')}</div>
      </div>
      <button class="sheet-close" data-act="close-sheet" aria-label="Close">${icon('x', 10)}</button>
    </div>
    <div class="chat" id="chat">${chatHTML()}</div>
    ${S.planning ? '' : `<div class="quick-wrap">
      ${QUICK.map((q) => `<button data-act="quick" data-text="${esc(q)}">${esc(q)}</button>`).join('')}
    </div>`}
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
            ${m.plan ? planSummaryHTML() : ''}
            ${m.actions ? `<div class="actions">${m.actions.map((a) => `<button class="${a.plain ? 'plain' : ''}" data-act="${a.act}"${a.tab ? ` data-tab="${a.tab}"` : ''}${a.channel ? ` data-channel="${a.channel}"` : ''}>${a.icon ? icon(a.icon, 8) : ''}${esc(a.label)}</button>`).join('')}</div>` : ''}
          </div>
        </div>
      </div>`;
    }
    return `<div class="msg user"><div class="bubble">${esc(m.text)}</div></div>`;
  }).join('')
  + (S.planBuilt ? '' : (S.planning ? planBuilderHTML() : (S.messages.length === 1 ? assistContextHTML() : '')))
  + (S.thinking ? `<div class="msg"><span class="ava">${sparkleIcon(10)}</span><div class="bubble"><div class="thinking"><i></i><i></i><i></i></div></div></div>` : '');
}

function formatReply(text) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n{2,}/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function sendChat(text) {
  const t = String(text || '').trim();
  if (!t || S.thinking) return;
  S.messages.push({ role: 'user', text: t, raw: t });
  S.thinking = true;
  refreshChat();
  clearTimeout(S.chatTimer);

  if (!PICO_ENDPOINT) {
    S.chatTimer = setTimeout(() => {
      S.thinking = false;
      S.messages.push({ role: 'assistant', text: esc(tr("Pico's live model isn't connected on this static page. Open the hosted RoamChina demo to chat for real.")) });
      refreshChat();
    }, 500);
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 48000);
  fetch(PICO_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: chatHistory(), context: picoContext() }),
    signal: controller.signal
  }).then(async (response) => {
    const data = await response.json().catch(() => null);
    if (!response.ok || !data || data.ok !== true || typeof data.reply !== 'string' || !data.reply.trim()) {
      const message = data && data.error === 'rate_limited'
        ? "Pico is getting a lot of questions right now. Try again in a minute."
        : "Pico couldn't reach the live model just now. Try once more in a moment.";
      throw new Error(message);
    }
    const reply = data.reply.trim();
    S.thinking = false;
    S.messages.push({ role: 'assistant', text: formatReply(reply), raw: reply, live: true });
    refreshChat();
  }).catch((error) => {
    S.thinking = false;
    const message = error && error.name === 'AbortError'
      ? "That took too long. Check the connection and ask me again."
      : (error && error.message) || "Pico couldn't reach the live model just now.";
    S.messages.push({ role: 'assistant', text: esc(tr(message)) });
    refreshChat();
  }).finally(() => {
    clearTimeout(timeout);
  });
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

/* ---------- drag stops ---------- */
let tripStopDrag = null;

function initTripStopDrag() {
  $$('.rc-stops [data-grip]').forEach((grip) => {
    grip.addEventListener('pointerdown', onTripGripDown);
  });
}

function onTripGripDown(event) {
  if (event.button !== undefined && event.button !== 0) return;
  const grip = event.currentTarget;
  const row = grip.closest('.trow');
  if (!row) return;
  event.preventDefault();
  event.stopPropagation();
  const rows = $$('.rc-stops .trow');
  tripStopDrag = {
    row,
    grip,
    rows,
    index: Number(row.dataset.index),
    pointerId: event.pointerId,
    startY: event.clientY,
    target: Number(row.dataset.index),
    active: false
  };
  try { grip.setPointerCapture(event.pointerId); } catch (_) {}
  grip.addEventListener('pointermove', onTripGripMove, { passive: false });
  grip.addEventListener('pointerup', onTripGripEnd);
  grip.addEventListener('pointercancel', onTripGripEnd);
}

function onTripGripMove(event) {
  const drag = tripStopDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  const dy = event.clientY - drag.startY;
  if (!drag.active) {
    if (Math.abs(dy) < 5) return;
    drag.active = true;
    drag.row.classList.add('dragging');
    drag.grip.parentElement.classList.add('armed');
    drag.rows.forEach((r) => { if (r !== drag.row) r.style.transition = 'background .15s, border-color .15s'; });
  }
  event.preventDefault();
  drag.row.style.transform = `translateY(${dy}px)`;
  let target = 0;
  drag.rows.forEach((r) => {
    if (r === drag.row) return;
    const rect = r.getBoundingClientRect();
    if (event.clientY > rect.top + rect.height / 2) target += 1;
  });
  target = clamp(target, 0, drag.rows.length - 1);
  if (target !== drag.target) {
    drag.target = target;
    drag.rows.forEach((r, i) => r.classList.toggle('drop-target', i === target && r !== drag.row));
  }
}

function onTripGripEnd(event) {
  const drag = tripStopDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  tripStopDrag = null;
  drag.grip.removeEventListener('pointermove', onTripGripMove);
  drag.grip.removeEventListener('pointerup', onTripGripEnd);
  drag.grip.removeEventListener('pointercancel', onTripGripEnd);
  try { drag.grip.releasePointerCapture(event.pointerId); } catch (_) {}
  if (!drag.active) return;
  drag.row.style.transform = '';
  drag.row.classList.remove('dragging');
  drag.grip.parentElement.classList.remove('armed');
  drag.rows.forEach((r) => { r.classList.remove('drop-target'); r.style.transition = ''; });
  const blockClick = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
  document.addEventListener('click', blockClick, { capture: true, once: true });
  setTimeout(() => document.removeEventListener('click', blockClick, true), 400);
  if (drag.target === drag.index) return;
  const stops = activeStops();
  const slots = stops.map((s) => s.time);
  const [stop] = stops.splice(drag.index, 1);
  if (!stop) return;
  stops.splice(clamp(drag.target, 0, stops.length), 0, stop);
  stops.forEach((s, i) => { if (slots[i] != null) s.time = slots[i]; });
  markPlanEdited();
  render();
  toast('Order updated · route recalculated', 'refresh');
}

/* ---------- drag plan stop rows ---------- */
let planStopDrag = null;

function initPlanStopDrag() {
  if (!S.editMode) return;
  $$('#stopList [data-plan-grip]').forEach((grip) => {
    grip.addEventListener('pointerdown', onPlanGripDown);
  });
}

function onPlanGripDown(event) {
  if (event.button !== undefined && event.button !== 0) return;
  const grip = event.currentTarget;
  const row = grip.closest('.stop-row');
  if (!row) return;
  event.preventDefault();
  event.stopPropagation();
  const rows = $$('#stopList .stop-row');
  planStopDrag = {
    row,
    grip,
    rows,
    index: Number(row.dataset.index),
    pointerId: event.pointerId,
    startY: event.clientY,
    target: Number(row.dataset.index),
    active: false
  };
  try { grip.setPointerCapture(event.pointerId); } catch (_) {}
  grip.addEventListener('pointermove', onPlanGripMove, { passive: false });
  grip.addEventListener('pointerup', onPlanGripEnd);
  grip.addEventListener('pointercancel', onPlanGripEnd);
}

function onPlanGripMove(event) {
  const drag = planStopDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  const dy = event.clientY - drag.startY;
  if (!drag.active) {
    if (Math.abs(dy) < 4) return;
    drag.active = true;
    drag.row.classList.add('dragging');
    drag.rows.forEach((r) => { if (r !== drag.row) r.style.transition = 'background .15s, border-color .15s'; });
  }
  event.preventDefault();
  drag.row.style.transform = `translateY(${dy}px)`;
  let target = 0;
  drag.rows.forEach((r) => {
    if (r === drag.row) return;
    const rect = r.getBoundingClientRect();
    if (event.clientY > rect.top + rect.height / 2) target += 1;
  });
  target = clamp(target, 0, drag.rows.length - 1);
  if (target !== drag.target) {
    drag.target = target;
    drag.rows.forEach((r, i) => r.classList.toggle('drop-target', i === target && r !== drag.row));
  }
}

function onPlanGripEnd(event) {
  const drag = planStopDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  planStopDrag = null;
  drag.grip.removeEventListener('pointermove', onPlanGripMove);
  drag.grip.removeEventListener('pointerup', onPlanGripEnd);
  drag.grip.removeEventListener('pointercancel', onPlanGripEnd);
  try { drag.grip.releasePointerCapture(event.pointerId); } catch (_) {}
  if (!drag.active) return;
  drag.row.style.transform = '';
  drag.row.classList.remove('dragging');
  drag.rows.forEach((r) => { r.classList.remove('drop-target'); r.style.transition = ''; });
  const blockClick = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
  document.addEventListener('click', blockClick, { capture: true, once: true });
  setTimeout(() => document.removeEventListener('click', blockClick, true), 400);
  if (drag.target === drag.index) return;
  const slots = S.stops.map((s) => s.time);
  const [stop] = S.stops.splice(drag.index, 1);
  if (!stop) return;
  S.stops.splice(clamp(drag.target, 0, S.stops.length), 0, stop);
  S.stops.forEach((s, i) => { if (slots[i] != null) s.time = slots[i]; });
  markPlanEdited();
  render();
  toast(S.lang === 'zh' ? '顺序已更新 · 路线已重算' : 'Order updated · route recalculated', 'refresh');
}

/* ---------- reorder ---------- */
function reorderSheet() {
  const stops = activeStops();
  return `<div class="sheet medium">
    ${sheetHead('Reorder stops', S.tab === 'trip' ? `ROUTE · DAY ${String(clamp(S.tripDay, 0, tripDays().length - 1) + 1).padStart(2, '0')}` : 'ROUTE · TUNE THE ORDER')}
    <div class="sheet-body">
      <p class="sub" style="margin:2px 0 8px">Use the arrows to change the order; the route and times recalculate.</p>
      ${stops.map((s, i) => `<div class="reorder-row">
        <span class="num">${i + 1}</span>
        <span class="grow"><b>${esc(s.name)}</b><small>${esc(s.time)} · ${esc(s.duration || '45 min')}</small></span>
        <span class="btns">
          <button data-act="move-stop" data-index="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${icon('up', 10)}</button>
          <button data-act="move-stop" data-index="${i}" data-dir="1" ${i === stops.length - 1 ? 'disabled' : ''} aria-label="Move down">${icon('down', 10)}</button>
        </span>
      </div>`).join('')}
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="close-sheet">Cancel</button>
      <button class="primary" data-act="finish-reorder">Done</button>
    </div>
  </div>`;
}

/* ---------- add a stop ---------- */
function addStopSheet() {
  const day = activeDay();
  const dayNo = clamp(S.tripDay, 0, tripDays().length - 1) + 1;
  const existing = new Set(day.stops.map((s) => s.name.toLowerCase()));
  return `<div class="sheet tall">
    ${sheetHead('Add a stop', `ROUTE · DAY ${String(dayNo).padStart(2, '0')} · ${day.date}`)}
    <div class="sheet-body">
      <p class="sub" style="margin:2px 0 9px">Pick a place — it lands at the end of the route with a new time, then you can reorder it.</p>
      ${PLACES.map((p) => {
        const added = existing.has(p.title.toLowerCase());
        return `<button class="place-add" data-act="trip-add-pick" data-id="${p.id}" ${added ? 'disabled' : ''}>
          <span class="pa-ico" style="background:var(--${p.tint})">${icon(p.symbol, 12)}</span>
          <span class="grow"><b>${esc(p.title)}</b><small>${esc(p.subtitle)} · ${esc(p.price)}</small></span>
          ${added ? `<span class="tag soft">On route</span>` : `<span class="pa-plus">${icon('plus', 10)}</span>`}
        </button>`;
      }).join('')}
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
        return `<div class="phase-title">${tr(phase)} · ${items.length}</div>${items.map(checkRowHTML).join('')}`;
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
  markPlanEdited();
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
  markPlanEdited();
  const wasTrip = S.tab === 'trip';
  closeSheet();
  S.tab = wasTrip ? 'trip' : 'plan';
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
  markPlanEdited();
  const wasTrip = S.tab === 'trip';
  closeSheet();
  S.tab = wasTrip ? 'trip' : 'plan';
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
  const stops = activeStops();
  const to = index + dir;
  if (to < 0 || to >= stops.length) return;
  const slots = stops.map((s) => s.time);
  const body = $('.sheet-body');
  const top = body ? body.scrollTop : 0;
  const arr = stops.slice();
  [arr[index], arr[to]] = [arr[to], arr[index]];
  arr.forEach((s, i) => { if (slots[i] != null) s.time = slots[i]; });
  if (stops === S.stops) S.stops = arr;
  else stops.splice(0, stops.length, ...arr);
  markPlanEdited();
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
      if (S.sheet === 'assistant') {
        renderSheet();
      } else {
        render();
        if (!wasComplete && quizPersona()) {
          requestAnimationFrame(() => {
            document.querySelector('.quiz-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
      }
      break;
    }
    case 'generate-plan':
      generatePlan();
      break;
    case 'open-trip':
      closeSheet();
      S.tripDay = 0;
      go('trip');
      toast(`Your plan · ${planLength()} days`, 'map');
      break;
    case 'trip-day': {
      S.tripDay = clamp(Number(el.dataset.day) || 0, 0, tripDays().length - 1);
      S.tripEdit = false;
      S.selected = null;
      render();
      if (el.dataset.scroll) requestAnimationFrame(() => $('.plan-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      break;
    }
    case 'trip-edit':
      S.tripEdit = !S.tripEdit;
      if (S.tripEdit) S.selected = null;
      render();
      toast(S.tripEdit ? 'Drag a numbered dot or grab a row to reorder' : 'Stops saved', S.tripEdit ? 'hand' : 'check');
      break;
    case 'dates':
      S.dateDraft = S.tripStart;
      openSheet('dates');
      break;
    case 'date-nudge':
      S.dateDraft = shiftISO(S.dateDraft || S.tripStart, Number(el.dataset.days) || 0);
      refreshDatePreview();
      break;
    case 'date-reset':
      S.dateDraft = DEFAULT_TRIP_START;
      renderSheet();
      break;
    case 'date-save': {
      const next = S.dateDraft || S.tripStart;
      const changed = next !== S.tripStart;
      setTripStart(next);
      closeSheet();
      render();
      toast(changed ? `Dates moved · ${tripDateRange()} · 2 travelers` : 'Dates unchanged', changed ? 'calendar' : 'info');
      break;
    }
    case 'trip-add':
      openSheet('addStop');
      break;
    case 'trip-add-pick': {
      const p = placeById(el.dataset.id);
      if (!p) break;
      const stops = activeStops();
      if (stops.some((s) => s.name.toLowerCase() === p.title.toLowerCase())) { toast('Already on this route', 'info'); break; }
      const last = stops[stops.length - 1];
      const time = plusMinutes(last ? last.time : '10:00', 60);
      stops.push({
        id: 'x' + Date.now(),
        name: p.title,
        time,
        duration: '45 min',
        x: clamp((last ? last.x : .5) + .06, .1, .9),
        y: clamp((last ? last.y : .5) + .06, .12, .9),
        tag: 'Pico pick',
        tagStyle: 'coral'
      });
      markPlanEdited();
      closeSheet();
      render();
      toast(`${p.title} added · ${time}`, 'plus');
      break;
    }
    case 'trip-up':
    case 'trip-down': {
      const stops = activeStops();
      const i = Number(el.dataset.index);
      const to = i + (act === 'trip-up' ? -1 : 1);
      if (to < 0 || to >= stops.length) break;
      [stops[i], stops[to]] = [stops[to], stops[i]];
      markPlanEdited();
      render();
      toast('Order updated · times follow the stop', 'refresh');
      break;
    }
    case 'trip-del': {
      const stops = activeStops();
      const i = Number(el.dataset.index);
      if (stops.length <= 2) { toast('Keep at least two stops', 'info'); break; }
      stops.splice(i, 1);
      S.selected = null;
      markPlanEdited();
      render();
      toast('Stop removed · route recalculated', 'trash');
      break;
    }
    case 'trip-save':
      S.tripSaved = true;
      S.tripDirty = false;
      render();
      toast('Plan saved · start when you are ready', 'check');
      break;
    case 'trip-start':
      S.tripSaved = true;
      S.tripDirty = false;
      S.tripEdit = false;
      S.selected = null;
      S.tripLive = true;
      S.liveStop = 0;
      render(true);
      toast('Trip started · first stop ahead', 'walk');
      break;
    case 'trip-live-next': {
      const stops = activeDay().stops;
      if (S.liveStop < stops.length) {
        S.liveStop += 1;
        render();
        if (S.liveStop >= stops.length) toast('Day complete · every stop covered', 'check');
        else toast(`Next · ${stops[S.liveStop].name}`, 'pin');
      }
      break;
    }
    case 'trip-live-end':
      S.tripLive = false;
      S.liveStop = 0;
      render(true);
      toast('Live trip ended · plan saved', 'check');
      break;
    case 'trip-live-back': {
      const atEnd = S.tripDay >= tripDays().length - 1;
      S.tripLive = false;
      S.liveStop = 0;
      S.tripDay = clamp(S.tripDay + 1, 0, tripDays().length - 1);
      render(true);
      if (atEnd) {
        S.tripWrapped = true;
        render();
        openRecap('beijing');
      } else {
        toast(`Day done · Day ${S.tripDay + 1} loaded`, 'check');
      }
      break;
    }
    case 'quiz-reset':
      S.quiz = { days: null, style: null, theme: null, note: '' };
      render();
      requestAnimationFrame(() => {
        document.querySelector('.quiz-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      break;
    case 'hero-go': {
      const track = $('#heroTrack');
      const i = Number(el.dataset.hero) || 0;
      heroResumeAt = Date.now() + 9000;
      if (track) track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
      break;
    }
    case 'recap-close':
      closeRecap();
      break;
    case 'recap-next':
      if (S.recapSlide >= recapTotal() - 1) closeRecap();
      else recapGo(1);
      break;
    case 'recap-prev':
      recapGo(-1);
      break;
    case 'recap-dot':
      recapJump(el.dataset.index);
      break;
    case 'recap-share':
      toast(`Recap link copied · ${recapData().title}`, 'share');
      break;
    case 'report':
      openRecap(el.dataset.id);
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
      markPlanEdited();
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
    case 'map-zoom-in':
    case 'map-zoom-out': {
      const host = $('.map, .tmap');
      if (host) setMapZoom(MAPVIEW.zoom * (act === 'map-zoom-in' ? 1.35 : 1 / 1.35), host.clientWidth / 2, host.clientHeight / 2);
      break;
    }
    case 'map-zoom-reset':
      MAPVIEW.zoom = 1;
      MAPVIEW.panX = 0;
      MAPVIEW.panY = 0;
      applyMapView();
      break;
    case 'map-expand':
      S.mapExpanded = !S.mapExpanded;
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
    if (body) { body.innerHTML = forumBodyHTML(); zhify(body); }
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
  if (t.id === 'tripStartInput') {
    if (t.value) {
      S.dateDraft = t.value;
      refreshDatePreview();
    }
  }
  if (t.matches('[data-quiz-note]')) {
    S.quiz.note = t.value.slice(0, 140);
    const count = document.querySelector('[data-quiz-count]');
    if (count) count.textContent = `${S.quiz.note.length}/140`;
    const card = t.closest('.planner-custom');
    if (card) card.classList.toggle('filled', !!S.quiz.note.trim());
  }
});

document.addEventListener('keydown', (e) => {
  if (S.recap) {
    if (e.key === 'Escape') { closeRecap(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); recapGo(1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); recapGo(-1); return; }
  }
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
  if (!S.planBuilt) {
    S.welcome = true;
    S.assistantContext = 'New trip · Planning with Pico';
  }
  render(true);
  setTimeout(() => {
    try {
      if (!S.sheet && !S.welcome && !S.recap && !sessionStorage.getItem('roamchina-hint')) {
        sessionStorage.setItem('roamchina-hint', '1');
        toast(S.lang === 'zh' ? '在计划页点“调整站点”，再拖动编号圆点' : 'Try Adjust stops on the Plan tab, then drag a numbered dot', 'hand');
      }
    } catch (e) { /* storage unavailable */ }
  }, 1100);
}

bootstrap();

function bootstrap() {
  const langSwitch = $('#langSwitch');
  if (langSwitch) {
    langSwitch.addEventListener('click', () => setLang(S.lang === 'zh' ? 'en' : 'zh'));
  }
  renderLangSwitch();
  boot();
  window.RC = { S, openRecap, closeRecap, recapGo, recapJump, setLang, render, toast };
}
})();
