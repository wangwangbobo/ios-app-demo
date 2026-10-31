/* Lucia — interactive web edition */
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
  { id: 's1', name: '天安门广场', time: '09:00', duration: '30 分钟', x: 0.49, y: 0.86, tag: '拍照' },
  { id: 's2', name: '故宫博物院', time: '09:40', duration: '3 小时', x: 0.52, y: 0.67, tag: '已订', tagStyle: 'ok' },
  { id: 's3', name: '景山公园', time: '13:00', duration: '1 小时', x: 0.57, y: 0.56, tag: '登高' },
  { id: 's4', name: '什刹海', time: '15:00', duration: '1.5 小时', x: 0.37, y: 0.38, tag: 'AI 建议', tagStyle: 'coral' },
  { id: 's5', name: '南锣鼓巷', time: '16:30', duration: '45 分钟', x: 0.61, y: 0.31, tag: '咖啡' },
  { id: 's6', name: '钟鼓楼', time: '17:30', duration: '45 分钟', x: 0.50, y: 0.20, tag: '日落' }
];

const SIMILAR = [
  { title: '北京中轴线 · 经典半日', author: '@Ken', match: 94, stops: 6, distance: '4.2 km', duration: '约 5 小时', tags: ['经典', '步行', '日落'], highlight: '和你的 6 个点位重合 5 个，故宫段顺序一致。' },
  { title: '胡同咖啡慢走 · 8 站', author: '@Lina', match: 87, stops: 8, distance: '6.4 km', duration: '约一整天', tags: ['咖啡', '拍照', '轻松'], highlight: '把南锣鼓巷换成 3 家咖啡店，适合下午出发。' },
  { title: '景山落日 + 什刹海夜走', author: '@阿哲', match: 79, stops: 5, distance: '3.8 km', duration: '约 3 小时', tags: ['夜游', '日落', '本地'], highlight: '保留你的景山日落，回程沿什刹海走，少一次折返。' }
];

const PLACES = [
  { id: 'p1', kind: 'restaurant', title: '四季民福 · 故宫店', subtitle: '11:00 前到不排队 · 烤鸭', price: '¥150', tags: ['家庭', '本地人常去'], likes: '2.3k', symbol: 'fork', tint: 'mustard-soft', heat: 96, area: '东城 · 故宫', note: '下午三点以后去几乎不用等位，鸭皮还是脆的。', bestTime: '11:00 前 / 15:00 后' },
  { id: 'p2', kind: 'restaurant', title: '满恒记 · 牛街', subtitle: '手切鲜羊肉 · 铜锅涮肉', price: '¥95', tags: ['本地', '排队'], likes: '1.9k', symbol: 'flame', tint: 'pink-soft', heat: 93, area: '西城 · 牛街', note: '手切羊肉配麻酱，本地人排队也愿意等。', bestTime: '17:00 前取号' },
  { id: 'p3', kind: 'restaurant', title: '胖妹面庄 · 北新桥', subtitle: '小面 · 现炸酥肉', price: '¥45', tags: ['本地', '快吃'], likes: '886', symbol: 'fork', tint: 'mint-soft', heat: 88, area: '东城 · 北新桥', note: '小面要少辣，酥肉现炸的最好吃。', bestTime: '工作日 14:00' },
  { id: 'p4', kind: 'restaurant', title: 'Metal Hands · 前门', subtitle: '胡同咖啡 · 自家烘焙', price: '¥45', tags: ['咖啡', '安静'], likes: '1.1k', symbol: 'coffee', tint: 'peri-soft', heat: 81, area: '东城 · 前门', note: '巷子里的安静咖啡馆，下午光线最好。', bestTime: '15:00–17:00' },
  { id: 'p5', kind: 'gift', title: '稻香村 · 本地人伴手礼', subtitle: '避开网红款 · 8 件', price: '¥50–120', tags: ['伴手礼', '可托运'], likes: '1.7k', symbol: 'gift', tint: 'pink-soft', heat: 86, area: '各城区门店', note: '散装点心比礼盒更值得买，记得要新鲜日期。', bestTime: '上午补货' },
  { id: 'p6', kind: 'gift', title: '故宫文创 · 冰箱贴', subtitle: '角楼系列 · 限定色', price: '¥39', tags: ['轻便', '限定'], likes: '604', symbol: 'sparkle', tint: 'mustard-soft', heat: 78, area: '故宫 · 神武门', note: '角楼冰箱贴经常断货，进门先买。', bestTime: '开馆后 1 小时' },
  { id: 'p7', kind: 'gift', title: '同仁堂 · 酸梅汤原料', subtitle: '煮一壶老北京的夏天', price: '¥38', tags: ['可托运', '轻便'], likes: '512', symbol: 'leaf', tint: 'mint-soft', heat: 74, area: '东城 · 大栅栏', note: '夏天煮一壶，比瓶装饮料更像北京。', bestTime: '任何时间' },
  { id: 'p8', kind: 'spot', title: '景山看日落', subtitle: '17:00 前上山 · 万春亭', price: '免费', tags: ['日落', '俯拍故宫'], likes: '3.4k', symbol: 'sun', tint: 'mustard-soft', heat: 94, area: '东城 · 景山', note: '17:00 前上万春亭，能拍到故宫全景。', bestTime: '日落前 40 分钟' },
  { id: 'p9', kind: 'spot', title: '天坛公园', subtitle: '回音壁 · 古柏与祈年殿', price: '¥34', tags: ['建筑', '人少'], likes: '2.8k', symbol: 'building', tint: 'peri-soft', heat: 90, area: '东城 · 天坛', note: '从南门进，回音壁人少的时候最有意思。', bestTime: '开园后 1 小时' },
  { id: 'p10', kind: 'spot', title: '北海公园', subtitle: '划船看白塔 · 亲子友好', price: '¥10', tags: ['亲子', '划船'], likes: '2.1k', symbol: 'wave', tint: 'sky-soft', heat: 82, area: '西城 · 北海', note: '租一条船，从湖上看白塔最舒服。', bestTime: '15:00 后' }
];

const EVENTS = [
  { id: 'e1', title: '胡同夜市 · 免费入场', subtitle: '手作、黑胶与小吃，本地摊主出摊', date: '10/18 周六', time: '18:00 – 22:00', place: '钟鼓楼广场 · 距酒店 35 分钟', host: '@Lucia 社区', fee: '免费', attendees: 128, tint: 'coral' },
  { id: 'e2', title: '白塔寺旧物市集', subtitle: '老相机、旧书与手冲咖啡，摊主多是本地藏家', date: '11/01 周六', time: '13:00 – 19:00', place: '白塔寺东夹道 · 距酒店 20 分钟', host: '@胡同档案', fee: '免费', attendees: 64, tint: 'mustard' },
  { id: 'e3', title: '中轴线夜骑 · 自备车', subtitle: '从永定门骑到钟鼓楼，领队讲城楼故事', date: '11/02 周日', time: '19:00', place: '永定门公园北门', host: '@Ken', fee: '¥20', attendees: 37, tint: 'peri' }
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
  { id: 'c1', title: '护照有效期 ≥ 6 个月', meta: '已确认 · 2027/03 到期', cat: '证件', phase: '出发前', status: 'done', right: '已核验' },
  { id: 'c2', title: '往返机票 & 酒店', meta: '已出票 · 王府井 3 晚', cat: '证件', phase: '出发前', status: 'done', right: '查看' },
  { id: 'c3', title: '旅行保险 · 生效中', meta: '安联 · 保额 ¥80 万', cat: '证件', phase: '出发前', status: 'done', right: '已生效' },
  { id: 'c4', title: '故宫门票 · 10/15 09:00', meta: '成人 ×2 · ¥120 · 余票 812', cat: '门票', phase: '出发前', status: 'action', action: '去预约', tag: '余票紧张', tone: 'warn' },
  { id: 'c5', title: '长城 · 10/16 08:30', meta: '八达岭 · 需预约缆车', cat: '门票', phase: '出发前', status: 'action', action: '预约', tag: '待预约', tone: 'soft' },
  { id: 'c6', title: '颐和园 · 10/17 09:00', meta: '联票 ¥60 / 人', cat: '门票', phase: '出发前', status: 'todo', action: '购票' },
  { id: 'c7', title: '国家博物馆 · 10/17 14:00', meta: '免费 · 需实名预约', cat: '门票', phase: '出发前', status: 'todo', action: '预约' },
  { id: 'c8', title: 'eSIM / 中国手机号', meta: '3 家方案对比 · 从 ¥29 起', cat: '网络', phase: '落地当天', status: 'action', action: '选套餐' },
  { id: 'c9', title: 'VPN', meta: '境内应用商店无法下载', cat: '网络', phase: '落地当天', status: 'action', action: '教程', tag: '提前装', tone: 'warn' },
  { id: 'c10', title: '离线地图与翻译包', meta: '北京 · 86 句应急表达', cat: '网络', phase: '落地当天', status: 'done', right: '已下载' },
  { id: 'c11', title: '支付宝 / 微信支付', meta: '已绑定 VISA · 单笔 ≤ ¥5,000', cat: '交通', phase: '落地当天', status: 'done', right: '已完成' },
  { id: 'c12', title: '交通卡 / 地铁乘车码', meta: 'Apple 钱包 · 已开通', cat: '交通', phase: '落地当天', status: 'done', right: '已开通' }
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
  routeName: '北京中轴线 · 草稿',
  aiVisible: true,
  reminderDismissed: false,
  applied: false,
  forumChannel: null,
  search: '',
  events: EVENTS.map((e) => ({ ...e })),
  joined: new Set(['e1']),
  saved: new Set(),
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
  checklistCat: '全部',
  notifications: true,
  autoplay: false,
  assistantContext: '行程 · 10/15 故宫',
  messages: [{ role: 'assistant', text: '我在。行程、路线、翻译、清单都可以问我。' }],
  thinking: false,
  draft: { title: '', date: '11/08 周六', time: '14:00 – 18:00', place: '', fee: '免费', note: '' },
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
  { id: 'trip', label: '行程', icon: 'home', badge: 0 },
  { id: 'plan', label: '计划', icon: 'map', badge: 1 },
  { id: 'forum', label: '社区', icon: 'compass', badge: 0 },
  { id: 'translate', label: '翻译', icon: 'chat', badge: 0 },
  { id: 'me', label: '我的', icon: 'user', badge: 0 }
];
const TAB_CTX = {
  trip: '行程 · 10/15 故宫',
  plan: '计划 · 北京中轴线',
  forum: '社区 · 餐厅与路线',
  translate: '翻译 · 应急语句',
  me: '我的 · 订单与离线包'
};

function renderDock() {
  $('#dock').innerHTML = TABS.map((t) => `
    <button class="tab ${S.tab === t.id ? 'active' : ''}" data-act="tab" data-tab="${t.id}" aria-label="${t.label}" aria-current="${S.tab === t.id ? 'page' : 'false'}">
      ${icon(t.icon, 18)}<span>${t.label}</span>
      ${t.badge ? '<i class="badge" aria-hidden="true"></i>' : ''}
    </button>`).join('') + `
    <button class="orb" data-act="assistant" data-ctx="${TAB_CTX[S.tab]}" aria-label="问问 Lucia">${sparkleIcon(21)}</button>`;
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
  const progress = doneCount() / S.checklist.length;
  return `
    <header class="top">
      <div>
        <div class="eyebrow"><span class="eyebrow-line"></span>我的旅行 / BEIJING ${sparkleIcon(8)}</div>
        <div class="h1row"><div class="h1">北京</div>${tag('4 天 3 晚', 'coral')}</div>
        <div class="meta">10/15 – 10/18 · 2 人同行</div>
      </div>
      <div class="top-right">
        <div class="row">
          <button class="icon-btn" data-act="assistant" data-ctx="行程 · 通知与提醒" aria-label="通知">${icon('bell', 15)}</button>
          <div class="avatar">W</div>
        </div>
        <div class="meta">3 天后出发</div>
      </div>
    </header>

    <article class="card" style="margin-top:12px;overflow:hidden">
      <div class="cityscape">
        ${cityscape()}
        <div class="scene-chips">
          <span class="weather">${icon('sun', 12)}22° <small>多云转晴</small></span>
          ${tag('第 2 天 / 4', 'dark')}
        </div>
      </div>
      <div class="hero-foot">
        <div class="grow">
          <div class="h3">中轴线 · 故宫与胡同</div>
          <div class="mini">
            <span>${icon('pin', 9)} 6 站</span>
            <span>${icon('walk', 9)} 4.2 km</span>
            <span>${icon('clock', 9)} 约 5 小时</span>
          </div>
        </div>
        <button class="round-lime" data-act="tab" data-tab="plan" aria-label="打开地图">${icon('arrowur', 14)}</button>
      </div>
    </article>

    ${S.reminderDismissed ? '' : `
    <div class="reminder">
      <div class="ai-dot">${sparkleIcon(13)}</div>
      <div class="body">
        <div class="head"><b>LUCIA 提醒</b><button data-act="dismiss-reminder" aria-label="关闭提醒" style="opacity:.6">${icon('x', 9)}</button></div>
        <p>10/15–17 白天 22℃，早晚 11℃。故宫周一闭馆，建议改到 15 号上午。</p>
        <div class="foot">${tag('已排进清单')}${tag('温差 11℃', 'pink')}
          <button class="ghost-pill" data-act="apply-from-trip" style="margin-left:auto">调整路线 ${icon('arrowr', 8)}</button>
        </div>
      </div>
    </div>`}

    <div class="stats">
      <button class="stat progress" data-act="checklist" aria-label="打开行前清单">
        ${ring(progress, 42, 3.6, 'var(--ink)', 'rgba(255,252,242,.75)', `${Math.round(progress * 100)}%`)}
        <div><div class="stat-label">行前清单</div><b>${doneCount()} / ${S.checklist.length}</b></div>
      </button>
      <button class="stat peri" data-act="tab" data-tab="plan">
        <div class="stat-top"><span class="dot" style="background:var(--peri)">${icon('map', 11)}</span>${icon('arrowur', 9)}</div>
        <div class="stat-val"><b>6</b><span>站</span></div>
        <div class="stat-label">今日路线</div>
      </button>
      <button class="stat pink" data-act="assistant" data-ctx="行程 · 门票预约">
        <div class="stat-top"><span class="dot" style="background:var(--pink)">${icon('ticket', 11)}</span>${icon('arrowur', 9)}</div>
        <div class="stat-val"><b>2</b><span>/ 4</span></div>
        <div class="stat-label">门票已约</div>
      </button>
      <button class="stat mint" data-act="tab" data-tab="plan">
        <div class="stat-top"><span class="dot" style="background:var(--mint)">${icon('walk', 11)}</span>${icon('arrowur', 9)}</div>
        <div class="stat-val"><b>4.2</b><span>km</span></div>
        <div class="stat-label">步行距离</div>
      </button>
    </div>

    <div class="section-title">
      <div class="st-left"><span class="idx">01</span><h2>今天的路线</h2></div>
      <button class="link" data-act="tab" data-tab="plan">打开地图 ${icon('arrowur', 8)}</button>
    </div>
    <button class="card route-card" data-act="tab" data-tab="plan" style="width:100%;text-align:left">
      <div class="mini-map">${miniMap()}</div>
      <div class="grow">
        <div class="tags">${tag('草稿')}${tag('3 人协作', 'blue')}</div>
        <h4>天安门 → 故宫 → 什刹海</h4>
        <div class="meta">09:00 出发 · 日落前到钟鼓楼</div>
        <div class="who"><div class="avatar-stack"><div class="avatar sm">林</div><div class="avatar sm pink">周</div></div><span>+1 正在编辑</span></div>
      </div>
    </button>

    <div class="section-title">
      <div class="st-left"><span class="idx">02</span><h2>行前情报</h2></div>
      <button class="link" data-act="assistant" data-ctx="行程 · 行前情报">问 Lucia</button>
    </div>
    <div class="intel">
      <button class="intel-card" data-act="assistant" data-ctx="天气 · 北京 10/15–18">
        <div class="ico" style="background:var(--sky)">${icon('sun', 12)}</div>
        <div class="lab">天气</div><div class="val">11° – 22°</div><div class="det">昼夜温差大，带薄外套</div>
      </button>
      <button class="intel-card" data-act="assistant" data-ctx="客流 · 故宫上午">
        <div class="ico" style="background:var(--mint)">${icon('users', 12)}</div>
        <div class="lab">客流</div><div class="val">上午 · 低</div><div class="det">故宫 14 点后明显变挤</div>
      </button>
      <button class="intel-card" data-act="assistant" data-ctx="门票 · 故宫余票">
        <div class="ico" style="background:var(--pink)">${icon('ticket', 12)}</div>
        <div class="lab">余票</div><div class="val">812 张</div><div class="det">故宫 10/15 09:00</div>
      </button>
      <button class="intel-card" data-act="assistant" data-ctx="住宿 · 王府井">
        <div class="ico" style="background:var(--mustard)">${icon('bed', 12)}</div>
        <div class="lab">住宿</div><div class="val">王府井</div><div class="det">步行 12 分到故宫</div>
      </button>
    </div>

    <div class="section-title">
      <div class="st-left"><span class="idx">03</span><h2>社区灵感</h2></div>
      <button class="link" data-act="tab" data-tab="forum">去社区 ${icon('arrowur', 8)}</button>
    </div>
    <div class="rail">
      <button class="mini-card" data-act="forum" data-channel="route">
        <div class="art" style="background:var(--sky-soft)">${miniMap([{x:.2,y:.8},{x:.4,y:.6},{x:.6,y:.4},{x:.8,y:.2}], 'var(--peri)')}<span class="sticker">WALK 08</span></div>
        <div class="lab">路线 · Lina</div><h4>2 天胡同慢走 · 8 站</h4><p>4.8 分 · 收藏 1.2k</p>
      </button>
      <button class="mini-card" data-act="forum" data-channel="restaurant">
        <div class="art" style="background:var(--pink-soft)">${foodArt('var(--pink)')}<span class="sticker">EAT</span></div>
        <div class="lab">餐厅 · 本地人常去</div><h4>四季民福 · 故宫店</h4><p>11:00 前到不排队</p>
      </button>
      <button class="mini-card" data-act="forum" data-channel="spot">
        <div class="art" style="background:var(--mustard-soft)">${sunsetArt()}<span class="sticker">GOLDEN</span></div>
        <div class="lab">景点 · 日落</div><h4>景山看日落</h4><p>17:00 前上山 · 万春亭</p>
      </button>
    </div>

    <div class="quote">
      <svg viewBox="0 0 40 10" fill="none" stroke="var(--ink2)" stroke-width="1.3"><path d="M1 6c3-4 6-4 9 0s6 4 9 0 6-4 9 0 6 4 9 0"/></svg>
      <span>慢一点，才看得见北京。</span>
    </div>`;
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
      <span class="map-label" style="left:20%;top:31%">什刹海</span>
      <span class="map-label" style="left:71%;top:27%">南锣鼓巷</span>
      <span class="map-label" style="left:68%;top:50%">故宫</span>
      <span class="map-label" style="left:71%;top:40%">景山</span>
      ${collaborator('Lina', 'left:74%;top:33%')}
      ${collaborator('周', 'left:27%;top:58%', true)}
      <div class="map-body" id="mapBody">
        ${communityOverlay()}
        ${crowdOverlay()}
        <svg class="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="${routePathD()}" fill="none" stroke="var(--ink)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
          <path d="${routePathD()}" fill="none" stroke="var(--coral)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
        </svg>
        ${stops.map((s, i) => pinHTML(s, i)).join('')}
      </div>
      ${S.editMode ? `<div class="map-hint">${icon('hand', 9)} ${icon('move', 8)} 拖动编号圆点，路线会跟着重算</div>` : ''}
    </div>

    <header class="plan-head">
      <div class="spread" style="align-items:flex-start">
        <div>
          <div class="eyebrow"><span class="eyebrow-line"></span>我的计划 / CITYWALK <span class="tag lime" style="transform:rotate(3deg)">DAY 02</span></div>
          <div class="name">${esc(S.routeName)}</div>
          <div class="meta">${stops.length} 站 · 4.2 km · 约 5 小时</div>
        </div>
        <div class="row" style="padding-top:2px">
          <div class="avatar-stack"><div class="avatar sm">林</div><div class="avatar sm pink">周</div></div>
          <button class="icon-btn" data-act="share-route" aria-label="分享路线">${icon('share', 14)}</button>
        </div>
      </div>
      <div class="chips">
        <button class="chip ${S.layer === 'mine' ? 'on' : ''}" data-act="layer" data-layer="mine">我的路线</button>
        <button class="chip ${S.layer === 'community' ? 'on' : ''}" data-act="layer" data-layer="community">社区 3</button>
        <button class="chip ${S.layer === 'crowd' ? 'on' : ''}" data-act="layer" data-layer="crowd">客流</button>
        ${S.editMode ? `<span class="chip lime" style="margin-left:auto">${icon('hand', 9)} 拖动点位</span>` : ''}
      </div>
    </header>

    <div class="plan-panel">
      <div class="grab"></div>
      <div class="panel-top">
        <div>
          <h3>${stops.length} 站 · 4.2 km</h3>
          <div class="meta">${S.editMode ? '拖动编号圆点 · 路线实时重算' : '约 5 小时 · 步行 + 地铁'}</div>
        </div>
        <div class="actions">
          <button class="small-chip ${S.editMode ? 'on' : ''}" data-act="toggle-edit">${icon(S.editMode ? 'check' : 'hand', 9)}${S.editMode ? '完成' : '调点位'}</button>
          <button class="small-chip" data-act="reorder">${icon('updown', 9)}编辑顺序</button>
        </div>
      </div>

      ${S.aiVisible && !S.editMode ? `
      <div class="ai-bar">
        <span class="spark">${sparkleIcon(10)}</span>
        <span>Lucia 建议：什刹海挪到 13:00</span>
        <span class="note">少走 1.2 km</span>
        <button data-act="apply-ai">应用</button>
      </div>` : ''}

      ${!S.editMode ? `
      <div class="sim-row">
        <div class="sim-label"><b>${icon('layers', 8)}相似路线</b><span>${SIMILAR.length} 条 · 最高 94%</span></div>
        <div class="sim-scroll">
          ${SIMILAR.map((r, i) => `<button class="sim-card" data-act="similar" aria-label="${esc(r.title)}">
            <span class="pct ${r.match >= 90 ? '' : 'mid'}">${r.match}%</span>
            <span style="min-width:0"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.title)}</b><small>${esc(r.author)} · ${r.stops} 站</small></span>
          </button>`).join('')}
        </div>
        <button class="sim-more" data-act="similar" aria-label="查看相似路线">${icon('right', 8)}</button>
      </div>` : ''}

      <div class="stops" id="stopList">
        ${stops.map((s, i) => stopRowHTML(s, i)).join('')}
      </div>

      <div class="panel-actions">
        <button class="pa dashed" data-act="assistant" data-ctx="计划 · 添加地点">${icon('plus', 10)}加地点</button>
        <button class="pa lime" data-act="notes">${icon('doc', 10)}生成笔记</button>
        <button class="pa coral" data-act="assistant" data-ctx="计划 · ${esc(S.routeName)}"><span class="sp">${sparkleIcon(9)}</span>问问 Lucia</button>
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
    <span class="info"><b>${esc(stop.name)} ${stop.tag ? tag(stop.tag, stop.tagStyle || 'soft') : ''}</b><small>${esc(stop.duration)} · 步行 6 分</small></span>
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
    <span style="position:absolute;right:4px;bottom:6px;font:700 8px var(--mono);color:var(--warn)">14:00 后客流上升</span>
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
        toast('点位已更新 · 路线已重算', 'refresh');
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
  { title: '2 天胡同慢走 · 8 站', author: '@Lina', meta: '4.8 分 · 收藏 1.2k', tags: ['胡同', '咖啡', '慢走'], likes: '1.2k', art: 'A' },
  { title: '中轴线一日 · 6 站', author: '@Ken', meta: '4.9 分 · 收藏 3.4k', tags: ['经典', '日落', '故宫'], likes: '3.4k', art: 'B' },
  { title: '什刹海夜走 · 5 站', author: '@阿哲', meta: '4.7 分 · 收藏 860', tags: ['夜游', '本地', '小酒馆'], likes: '860', art: 'C' }
];

const CHANNELS = [
  { id: 'restaurant', lab: 'EAT', title: '餐厅热度', sub: '热度榜 · 4 家', icon: 'flame', fill: 'mustard' },
  { id: 'spot', lab: 'SEE', title: '景点推荐', sub: '本周 · 3 处', icon: 'sun', fill: 'mint' },
  { id: 'gift', lab: 'GIFT', title: '伴手礼', sub: '本地人买 · 3 件', icon: 'gift', fill: 'pink' },
  { id: 'route', lab: 'WALK', title: '城市漫步', sub: '可套用 · 3 条', icon: 'route', fill: 'peri' },
  { id: 'event', lab: 'EVENT', title: '本地活动', sub: '本周 · 3 场', icon: 'calendar', fill: 'sky' }
];

const SCENARIOS = [
  { id: 'route', title: '找路', icon: 'pin' },
  { id: 'dining', title: '就餐', icon: 'fork' },
  { id: 'medical', title: '就医', icon: 'shield' },
  { id: 'taxi', title: '打车', icon: 'plane' },
  { id: 'shopping', title: '购物', icon: 'gift' },
  { id: 'emergency', title: '紧急求助', icon: 'info' }
];

const LIVE_MORE = [
  { zh: '请问洗手间在哪里？', en: 'Where is the restroom?', mine: false },
  { zh: '这个可以刷卡吗？', en: 'Can I pay by card?', mine: false },
  { zh: '去南锣鼓巷怎么走？', en: 'How do I get to Nanluoguxiang?', mine: false }
];

const QUICK = ['帮我调路线', '故宫还有票吗', '附近吃什么', '翻译：我过敏', '检查行前清单'];

/* ================= FORUM ================= */
function channelMeta(id) { return CHANNELS.find((c) => c.id === id) || CHANNELS[0]; }

function forumView() {
  if (S.forumChannel) return forumChannelView(S.forumChannel);
  return `<div class="forum-top">
      <header class="top">
        <div>
          <div class="eyebrow"><span class="eyebrow-line"></span>社区 / BEIJING ${sparkleIcon(8)}</div>
          <div class="forum-title">大家的北京</div>
          <div class="meta">4,208 条路线 · 1,286 家餐厅 · 本地人也在看</div>
        </div>
        <button class="icon-btn" style="background:var(--ink);color:var(--paper);width:42px;height:42px" data-act="compose" aria-label="发起活动">${icon('pencil', 15)}</button>
      </header>
    </div>

    <div class="forum-search" style="margin-top:12px">
      ${icon('search', 13)}
      <input type="search" placeholder="搜餐厅、路线、伴手礼" data-role="search" value="${esc(S.search)}" aria-label="搜索社区">
      ${S.search ? `<button class="clear" data-act="search-clear" aria-label="清空搜索">${icon('x', 8)}</button>` : ''}
    </div>

    <div id="forumBody">${forumBodyHTML()}</div>`;
}

function forumBodyHTML() {
  if (S.search.trim()) return searchHTML();
  return `${channelRailHTML()}${eventFeatureHTML()}${forumRoutesHTML()}${forumPlacesHTML()}`;
}

function channelRailHTML() {
  return `<div class="channel-rail" style="margin-top:10px">
    ${CHANNELS.map((c) => `<button class="channel ${c.fill}" data-act="forum" data-channel="${c.id}">
      <span class="art">${icon(c.icon, 34)}</span>
      <span class="lab">${c.lab}</span>
      <b>${c.title}</b>
      <small>${c.sub}</small>
    </button>`).join('')}
  </div>`;
}

function eventFeatureHTML() {
  const e = S.events[0];
  if (!e) return '';
  const joined = S.joined.has(e.id);
  return `<div class="event-feature" style="margin-top:6px">
    <div class="date"><span>${tag('本地活动', 'dark')}</span><span>${esc(e.date)} · ${esc(e.time)}</span></div>
    <h3>${esc(e.title)}</h3>
    <p>${esc(e.subtitle)}</p>
    <div class="foot">
      <div class="avatar-stack"><div class="avatar sm">林</div><div class="avatar sm pink">周</div><div class="avatar sm peri">K</div></div>
      <span class="meta">${e.attendees + (joined ? 1 : 0)} 人已报名</span>
      <button class="join ${joined ? 'done' : ''}" data-act="join-event" data-id="${e.id}">${icon(joined ? 'check' : 'plus', 9)}${joined ? '已报名' : '报名'}</button>
    </div>
    <div class="foot" style="margin-top:10px">
      <span class="meta">${esc(e.place)}</span>
      <button class="join" style="background:transparent;color:var(--paper);border-color:rgba(255,252,242,.55);height:23px;font-size:8px" data-act="forum" data-channel="event">活动频道 ${icon('arrowr', 7)}</button>
    </div>
  </div>`;
}

function forumRoutesHTML() {
  return `<div class="section-title">
      <div class="st-left"><span class="idx">01</span><h2>社区路线</h2></div>
      <button class="link" data-act="forum" data-channel="route">全部路线 ${icon('arrowur', 8)}</button>
    </div>
    ${FORUM_ROUTES.map((r, i) => routeFeedCard(r, i)).join('')}`;
}

function routeFeedCard(r, i) {
  const paths = [
    [{ x: .16, y: .82 }, { x: .30, y: .62 }, { x: .28, y: .40 }, { x: .52, y: .34 }, { x: .70, y: .52 }, { x: .86, y: .26 }],
    [{ x: .48, y: .86 }, { x: .52, y: .66 }, { x: .58, y: .50 }, { x: .38, y: .38 }, { x: .62, y: .22 }],
    [{ x: .20, y: .78 }, { x: .36, y: .60 }, { x: .40, y: .40 }, { x: .66, y: .30 }, { x: .80, y: .14 }]
  ];
  return `<button class="card route-feed-card" data-act="forum" data-channel="route" style="width:100%;text-align:left">
    <span class="mini-map">${miniMap(paths[i % paths.length], i === 0 ? 'var(--peri)' : 'var(--coral)')}</span>
    <span class="grow">
      <h4>${esc(r.title)}</h4>
      <span class="by">${esc(r.author)} · ${esc(r.meta)}</span>
      <span class="tags">${r.tags.map((t) => tag(t)).join('')}</span>
    </span>
    ${icon('right', 10)}
  </button>`;
}

function forumPlacesHTML() {
  return `<div class="section-title">
      <div class="st-left"><span class="idx">02</span><h2>本地人推荐</h2></div>
      <span class="meta">${PLACES.length} 处</span>
    </div>
    ${PLACES.slice(0, 5).map(placeRowHTML).join('')}`;
}

function placeRowHTML(p) {
  return `<div class="card place-row" data-act="place" data-id="${p.id}" role="button" tabindex="0">
    <span class="thumb" style="background:var(--${p.tint})">${icon(p.symbol, 24)}</span>
    <span class="grow">
      <h4>${esc(p.title)}</h4>
      <span class="sub">${esc(p.subtitle)}</span>
      <span class="price">${esc(p.price)} · ${esc(p.area)}</span>
    </span>
    <span class="like">${icon('heart', 9)}${esc(p.likes)}</span>
  </div>`;
}

function searchHTML() {
  const q = S.search.trim().toLowerCase();
  const places = PLACES.filter((p) => [p.title, p.subtitle, p.area, ...p.tags].join(' ').toLowerCase().includes(q));
  const routes = FORUM_ROUTES.filter((r) => [r.title, r.author, r.meta, ...r.tags].join(' ').toLowerCase().includes(q));
  const total = places.length + routes.length;
  return `<div class="search-results">
    <div class="spread" style="margin:8px 0 4px">
      <b style="font-size:13px">搜索 “${esc(S.search)}”</b>
      <span class="meta">${total} 条</span>
    </div>
    ${total === 0 ? `<div class="search-empty">没有找到「${esc(S.search)}」<br>试试 “烤鸭” “胡同” “伴手礼”</div>` : ''}
    ${routes.map((r) => `<button class="search-item" data-act="forum" data-channel="route">
      <span class="thumb" style="background:var(--peri-soft)">${icon('route', 16)}</span>
      <span class="grow"><b>${esc(r.title)}</b><small>${esc(r.author)} · ${esc(r.meta)}</small></span>
      ${icon('right', 9)}
    </button>`).join('')}
    ${places.map((p) => `<button class="search-item" data-act="place" data-id="${p.id}">
      <span class="thumb" style="background:var(--${p.tint})">${icon(p.symbol, 16)}</span>
      <span class="grow"><b>${esc(p.title)}</b><small>${esc(p.subtitle)}</small></span>
      ${icon('right', 9)}
    </button>`).join('')}
  </div>`;
}

function forumChannelView(id) {
  const c = channelMeta(id);
  return `<div class="back-row">
      <button class="icon-btn" data-act="back-forum" aria-label="返回社区">${icon('back', 13)}</button>
      <span class="channel-name">${esc(c.lab)} · ${esc(c.title)}</span>
      <span class="spacer"></span>
      <button class="link" style="font-size:9px" data-act="compose">${icon('plus', 9)}发起</button>
    </div>
    ${channelHero(id)}
    ${channelBody(id)}`;
}

function channelHero(id) {
  if (id === 'restaurant') return `<div class="channel-hero" style="background:var(--mustard-soft)">
    <span class="sticker">EAT · 04</span>
    <button class="hero-action" data-act="assistant" data-ctx="社区 · 餐厅热度">问 Lucia ${icon('arrowr', 8)}</button>
    <h2>本地人排队<br>的那几家</h2>
    <p>按实时热度排序，避开 12:00–13:30 的午市高峰。点开任意一家看招牌菜与排队时间。</p>
  </div>`;
  if (id === 'spot') return `<div class="channel-hero" style="background:var(--mint-soft)">
    <span class="sticker">SEE · 03</span>
    <button class="hero-action" data-act="assistant" data-ctx="社区 · 景点日落">问 Lucia ${icon('arrowr', 8)}</button>
    <h2>这周最值得<br>去的三处</h2>
    <p>都适合下午出发，日落前能到机位。故宫周一闭馆，记得避开。</p>
  </div>`;
  if (id === 'gift') return `<div class="channel-hero" style="background:var(--pink-soft)">
    <span class="sticker">GIFT · 03</span>
    <button class="hero-action" data-act="assistant" data-ctx="社区 · 伴手礼">问 Lucia ${icon('arrowr', 8)}</button>
    <h2>带得走、<br>不踩雷的手信</h2>
    <p>本地人自己会买的三样，都能托运。散装点心比礼盒更值得。</p>
  </div>`;
  if (id === 'route') return `<div class="channel-hero" style="background:var(--peri-soft)">
    <span class="sticker">WALK · 03</span>
    <button class="hero-action" data-act="assistant" data-ctx="社区 · 城市漫步">问 Lucia ${icon('arrowr', 8)}</button>
    <h2>可以整套抄<br>的城市漫步</h2>
    <p>每条都标好了站点顺序与步行距离，一键套用到你的计划。</p>
  </div>`;
  return `<div class="channel-hero" style="background:var(--coral-soft)">
    <span class="sticker">EVENT · 本周</span>
    <button class="hero-action" data-act="compose">发布 ${icon('plus', 8)}</button>
    <h2>周末去认识<br>几个本地人</h2>
    <p>市集、夜骑、旧物交换。免费的多，报名就能去，位置都在地铁沿线。</p>
  </div>`;
}

function channelBody(id) {
  if (id === 'restaurant') {
    const list = PLACES.filter((p) => p.kind === 'restaurant').sort((a, b) => b.heat - a.heat);
    return `<div class="card ranking">
      <div class="rank-head"><b style="font-size:12px">实时热度榜</b><span class="mono">每小时更新 · 满分 100</span></div>
      ${list.map((p, i) => `<button class="rank-row" data-act="place" data-id="${p.id}">
        <span class="rank-no ${i === 0 ? 'top' : ''}">0${i + 1}</span>
        <span class="rank-thumb" style="background:var(--${p.tint})">${icon(p.symbol, 17)}</span>
        <span class="rank-info"><b>${esc(p.title)}</b><small>${esc(p.subtitle)}</small></span>
        <span class="rank-right"><span class="heat">${icon('flame', 8)}${p.heat}</span><span class="heat-bar" style="display:block"><i style="width:${p.heat}%"></i></span></span>
      </button>`).join('')}
      <div class="quote-card"><p>“${esc(list[0].note)}”</p><div class="who">— @林 · 本地人 · 3 天前</div></div>
    </div>
    <div class="tip-strip" style="margin-top:8px">${icon('info', 12)}<span>热度来自近 7 天的排队时长与打卡量，仅供参考。</span></div>`;
  }
  if (id === 'spot') {
    const list = PLACES.filter((p) => p.kind === 'spot');
    return `<div class="spot-grid">
      ${list.map((p) => `<button class="spot-card" data-act="place" data-id="${p.id}">
        <span class="art" style="display:block">${p.title.includes('景山') ? sunsetArt() : p.title.includes('北海') ? waveArt() : templeArt()}</span>
        <span class="body" style="display:block"><b>${esc(p.title)}</b><small>${esc(p.area)} · ${esc(p.price)}</small></span>
      </button>`).join('')}
    </div>
    <div class="tip-strip" style="margin-top:8px">${icon('sun', 12)}<span>景山 17:00 前上万春亭，能同时拍到故宫与落日。</span></div>`;
  }
  if (id === 'gift') {
    const list = PLACES.filter((p) => p.kind === 'gift');
    return `<div class="compare">
      <div class="compare-col local"><div class="lab">本地人买</div><ul><li>稻香村散装点心</li><li>同仁堂酸梅汤原料</li><li>故宫角楼冰箱贴</li></ul></div>
      <div class="compare-col tourist"><div class="lab">游客常买</div><ul><li>景区门口礼盒</li><li>真空烤鸭</li><li>同质化钥匙扣</li></ul></div>
    </div>
    <div class="card ranking" style="margin-top:9px">
      ${list.map((p) => `<div class="gift-row" data-act="place" data-id="${p.id}" role="button" tabindex="0">
        <span class="rank-thumb" style="background:var(--${p.tint})">${icon(p.symbol, 17)}</span>
        <span class="grow"><b>${esc(p.title)}</b><small>${esc(p.subtitle)}</small></span>
        <span class="price">${esc(p.price)}</span>
      </div>`).join('')}
    </div>
    <button class="full-btn" style="margin-top:9px" data-act="assistant" data-ctx="社区 · 伴手礼清单">${icon('sparkles', 11)}让 Lucia 帮我排购买顺序</button>`;
  }
  if (id === 'route') {
    return `<div class="draft-dark">
      <div class="meta">LUCIA 生成 · 基于你的 6 个点位</div>
      <h3>${esc(S.routeName)}</h3>
      <div class="meta">${S.stops.length} 站 · 4.2 km · 约 5 小时</div>
      <div class="tags">${['经典', '步行', '日落'].map((t) => tag(t)).join('')}</div>
      <button class="apply" data-act="apply-ai">套用到我的路线 ${icon('arrowr', 9)}</button>
    </div>
    <div class="section-title" style="margin-top:14px"><div class="st-left"><span class="idx">01</span><h2>社区路线</h2></div><span class="meta">${FORUM_ROUTES.length} 条</span></div>
    ${FORUM_ROUTES.map((r, i) => `<div class="card route-share-card">
      <span class="mini-map">${miniMap([{ x: .2, y: .8 }, { x: .42, y: .56 }, { x: .64, y: .34 }, { x: .8, y: .18 }], i === 1 ? 'var(--coral)' : 'var(--peri)')}</span>
      <span class="grow"><b>${esc(r.title)}</b><small>${esc(r.author)} · ${esc(r.meta)}</small></span>
      <button class="mini-apply" data-act="apply-forum-route" data-index="${i}">套用</button>
    </div>`).join('')}`;
  }
  return `<div class="card ranking">
    <div class="rank-head"><b style="font-size:12px">本周活动</b><span class="mono">${S.events.length} 场 · 都可报名</span></div>
    ${S.events.map((e) => {
      const joined = S.joined.has(e.id);
      const [d, w] = e.date.split(' ');
      return `<div class="calendar-row">
        <span class="calendar-date"><b>${esc(d)}</b><small>${esc(w || '')}</small></span>
        <span class="calendar-info"><b>${esc(e.title)}</b><small>${esc(e.time)} · ${esc(e.place)}</small></span>
        <button class="check-action" style="background:${joined ? 'var(--lime)' : 'var(--paper)'};border-color:var(--ink);color:var(--ink)" data-act="join-event" data-id="${e.id}">${joined ? '已报名' : '报名'}</button>
      </div>`;
    }).join('')}
  </div>
  <div class="tip-strip" style="margin-top:8px">${icon('users', 12)}<span>报名后会在「我的 → 行前清单」里生成提醒，出发前 2 小时推送。</span></div>
  <button class="full-btn coral" style="margin-top:10px" data-act="compose">${icon('plus', 11)}发布我的活动</button>`;
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
        <div class="eyebrow"><span class="eyebrow-line"></span>翻译 / TRANSLATE <span class="tag lime" style="transform:rotate(-3deg)">SAY IT</span></div>
        <div class="h1" style="font-size:35px;line-height:1.06">说清楚，<br><span style="color:var(--coral)">就不慌了</span></div>
        <div class="meta">实时对话 · 离线语句 · 拍照即译</div>
      </div>
      <div class="top-right">
        <span class="tag" style="background:var(--mint)">离线可用</span>
        <div class="meta">86 句 · 4.2 MB</div>
      </div>
    </header>

    <div class="seg" role="tablist">
      <button class="${mode === 'live' ? 'on' : ''}" data-act="mode" data-mode="live">${icon('mic', 11)}实时对话</button>
      <button class="${mode === 'offline' ? 'on' : ''}" data-act="mode" data-mode="offline">${icon('download', 11)}应急语句</button>
      <button class="${mode === 'photo' ? 'on' : ''}" data-act="mode" data-mode="photo">${icon('camera', 11)}拍照翻译</button>
    </div>

    ${mode === 'live' ? liveSection() : mode === 'offline' ? offlineSection() : photoSection()}

    <div class="privacy">${icon('lock', 9)} 语音只在设备端处理 · 不保存录音</div>`;
}

function liveSection() {
  return `<div class="scenario-rail" style="margin-top:-2px">
      ${SCENARIOS.map((sc) => `<button class="chip" data-act="pick-scenario" data-scenario="${sc.id}">${icon(sc.icon, 8)}${sc.title}</button>`).join('')}
    </div>
    <div class="card live-card">
      <div class="live-head">
        <span class="eyebrow">实时对话</span>
        <span class="lang-swap">中文 ${icon('arrowr', 9)} <b>English</b> ${icon('refresh', 9)}</span>
      </div>
      ${S.live.map((m) => `<div class="bubble-row ${m.mine ? 'mine' : ''}">
        <div class="bubble">
          <b>${esc(m.zh)}</b>
          <small>${esc(m.en)}</small>
          <div class="tools">
            <button class="tool-chip" data-act="speak" data-text="${esc(m.en)}" data-lang="en">${icon('speaker', 8)}英文</button>
            <button class="tool-chip" data-act="speak" data-text="${esc(m.zh)}" data-lang="zh">${icon('speaker', 8)}中文</button>
          </div>
        </div>
      </div>`).join('')}
      <div class="live-foot">
        <div class="live-hint">
          <b>${S.listening ? '正在听… 说完点一下结束' : '点一下开始说话'}</b>
          <span>${S.listening ? '离线识别中 · 说完会自动翻译' : '双人对话 · 自动识别中英文'}</span>
        </div>
        <button class="mic ${S.listening ? 'listening' : ''}" data-act="mic" aria-label="按住说话">${icon('mic', 19)}</button>
      </div>
    </div>
    <div class="tip-strip" style="margin-top:8px">${icon('info', 12)}<span>没有网络也能用。语音会先在设备上识别，再翻译成英文。</span></div>`;
}

function offlineSection() {
  const list = PHRASES.filter((p) => p.scenario === S.scenario);
  return `<div class="scenario-rail">
      ${SCENARIOS.map((sc) => `<button class="chip ${S.scenario === sc.id ? 'on' : ''}" data-act="scenario" data-scenario="${sc.id}">${icon(sc.icon, 8)}${sc.title}</button>`).join('')}
    </div>
    <div class="spread" style="margin:2px 0 9px">
      <div class="st-left" style="display:flex;align-items:baseline;gap:7px"><b style="font-size:15px;font-weight:900">离线语句库</b><span class="idx" style="font:700 8px var(--mono);color:var(--ink3)">已下载</span></div>
      <span class="meta">86 句 · 4.2 MB</span>
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
        <button class="tool-chip" data-act="speak" data-text="${esc(p.en)}" data-lang="en">${icon('speaker', 8)}朗读</button>
        <button class="tool-chip" data-act="copy" data-text="${esc(p.en)}">${icon('copy', 8)}复制</button>
        <button class="tool-chip" data-act="favorite-phrase">${icon('heart', 8)}收藏</button>
      </span>
    </span>
    ${icon('arrowur', 10)}
  </div>`;
}

function emergencyCardHTML() {
  return `<div class="emergency-card">
    <b>紧急情况 · 先打电话</b>
    <span>急救 120 · 报警 110 · 火警 119。需要中文协助时，把下面的句子给对方看。</span>
    <a class="call" href="tel:120">${icon('shield', 9)}拨打 120</a>
  </div>`;
}

function photoSection() {
  const menu = S.photoSample === 'menu';
  return `<div class="photo-card">
    <div class="photo-top">
      <i class="dot"></i><b>CAMERA · OCR</b>
      <span class="right">${S.photoScanning ? '<i class="pulse-dot"></i>识别中…' : S.photoScanned ? '已识别 · 9 个词' : '1x · 自动对焦'}</span>
    </div>
    <div class="photo-scene">
      ${menu ? menuScene() : signScene()}
      ${S.photoScanning ? '<div class="scan-beam"></div>' : ''}
      <div class="viewfinder"><i></i><i></i><i></i><i></i></div>
      ${!S.photoScanning && !S.photoScanned ? '<div class="scene-stamp">TAP TO SCAN</div>' : ''}
    </div>
    <div class="photo-controls">
      <button class="sample-chip ${menu ? 'on' : ''}" data-act="sample" data-sample="menu">${icon('doc', 8)}菜单招牌</button>
      <button class="sample-chip ${menu ? '' : 'on'}" data-act="sample" data-sample="sign">${icon('pin', 8)}路牌</button>
      <button class="shutter ${S.photoScanning ? 'scanning' : ''}" data-act="shutter" aria-label="拍照识别"></button>
    </div>
  </div>
  ${S.photoScanned ? photoResultHTML() : `<div class="photo-hint"><b>对准招牌或菜单</b><br>按下快门，Lucia 会框出文字并翻译成中文，识别结果可以直接朗读或复制。</div>`}`;
}

function menuScene() {
  return `<div class="scene-menu">
    <div class="menu-paper">
      <div class="head"><b>老北京小吃</b><small>MENU · 招牌</small></div>
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
    <div class="result-head"><b>识别结果 · ${isMenu ? '老北京小吃' : '街区路牌'}</b><span>ZH / EN</span></div>
    ${rows.map((r, i) => `<div class="result-row">
      <span class="no">${i + 1}</span>
      <span class="txt"><b>${esc(r.zh)}</b><small>${esc(r.en)} ${esc(r.price)}</small></span>
      <button class="tool-chip" data-act="speak" data-text="${esc(r.en)}" data-lang="en">${icon('speaker', 8)}</button>
    </div>`).join('')}
    <div class="result-actions">
      <button class="tool-chip solid" data-act="speak" data-text="${esc(rows[0].en)}" data-lang="en">${icon('speaker', 9)}朗读</button>
      <button class="tool-chip" data-act="copy" data-text="${esc(rows.map((r) => `${r.zh} · ${r.en}`).join('\n'))}">${icon('copy', 9)}复制全部</button>
      <button class="tool-chip" data-act="sample" data-sample="${isMenu ? 'sign' : 'menu'}">${icon('refresh', 9)}换一张</button>
    </div>
  </div>
  <div class="photo-hint"><b>${isMenu ? '点菜建议' : '认路建议'}</b><br>${isMenu ? '炸酱面是本地最稳的选择，豆汁儿第一次喝可以先两人分一杯。' : '沿指示牌直走，什刹海在地铁 6 号线北海北站方向。'}</div>`;
}

/* ================= ME ================= */
function meView() {
  return `<div class="me-head">
      <div class="me-avatar">W</div>
      <div class="grow">
        <div class="eyebrow">我的 / PROFILE</div>
        <div class="me-name">王博</div>
        <div class="me-tags">${tag('Lucia 会员', 'lime')}${tag('旅行第 12 城')}</div>
      </div>
      <button class="icon-btn" data-act="assistant" data-ctx="我的 · 设置与偏好" aria-label="设置">${icon('settings', 14)}</button>
    </div>

    <div class="me-stat-row">
      <div class="me-stat mustard"><b>12</b><span>走过的城市</span></div>
      <div class="me-stat pink"><b>46</b><span>收藏的地点</span></div>
      <div class="me-stat mint"><b>3</b><span>共享的路线</span></div>
    </div>

    <div class="trip-dark">
      <div class="top" style="display:flex;align-items:center;justify-content:space-between">
        <span class="tag lime">3 天后出发</span>
        <span class="meta">10/15 – 10/18</span>
      </div>
      <h3>北京 · 4 天 3 晚</h3>
      <div class="meta">王府井 · 2 位成人 · 中轴线慢走</div>
      <div class="who">
        <div class="avatar-stack"><div class="avatar sm">林</div><div class="avatar sm pink">周</div></div>
        <span>与林、周同行</span>
        <button class="view-trip" data-act="tab" data-tab="trip">查看行程</button>
      </div>
      <div class="quick">
        <button data-act="checklist">${icon('check', 8)}清单 ${doneCount()}/${S.checklist.length}</button>
        <button data-act="tab" data-tab="plan">${icon('map', 8)}打开路线</button>
        <button data-act="share-route">${icon('share', 8)}分享</button>
      </div>
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">01</span><h2>订单与预订</h2></div><span class="meta">2 笔</span></div>
    <div class="card" style="padding:2px 13px">
      <div class="order-row" data-act="toast" data-text="已打开机票详情" data-icon="plane" role="button" tabindex="0">
        <span class="ico" style="background:var(--peri-soft)">${icon('plane', 15)}</span>
        <span class="grow"><b>国航 CA182</b><small>10/15 08:45 → 11:20 · 首都 T3</small></span>
        <span class="status">${tag('已出票', 'ok')}</span>
      </div>
      <div class="order-row" data-act="toast" data-text="已打开酒店确认单" data-icon="bed" role="button" tabindex="0">
        <span class="ico" style="background:var(--mustard-soft)">${icon('bed', 15)}</span>
        <span class="grow"><b>王府井文华东方</b><small>10/15 – 10/18 · 3 晚 · 大床房</small></span>
        <span class="status">${tag('已确认', 'ok')}</span>
      </div>
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">02</span><h2>旅行服务</h2></div></div>
    <div class="service-grid">
      <button class="service" data-act="assistant" data-ctx="我的 · 离线包">
        <span class="ico" style="background:var(--mint-soft)">${icon('download', 12)}</span>
        <span><b>离线包</b><small>地图 · 翻译 · 已就绪</small></span>
      </button>
      <button class="service" data-act="tab" data-tab="forum">
        <span class="ico" style="background:var(--pink-soft)">${icon('heart', 12)}</span>
        <span><b>我的收藏</b><small>46 个地点</small></span>
      </button>
      <button class="service" data-act="assistant" data-ctx="协作 · 邀请同行">
        <span class="ico" style="background:var(--peri-soft)">${icon('users', 12)}</span>
        <span><b>同行协作</b><small>林、周 · 2 人</small></span>
      </button>
      <button class="service" data-act="notes">
        <span class="ico" style="background:var(--mustard-soft)">${icon('doc', 12)}</span>
        <span><b>行程笔记</b><small>导出海报</small></span>
      </button>
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">03</span><h2>偏好设置</h2></div></div>
    <div class="card" style="padding:2px 13px">
      <div class="setting-row">
        <span class="ico">${icon('bell', 12)}</span>
        <span class="grow"><b>行程提醒</b><small>出发前 2 小时 · 天气变化</small></span>
        <span class="toggle ${S.notifications ? 'on' : ''}" data-act="toggle-setting" data-key="notifications" role="switch" aria-checked="${S.notifications}" tabindex="0"></span>
      </div>
      <div class="setting-row">
        <span class="ico">${icon('speaker', 12)}</span>
        <span class="grow"><b>自动朗读翻译</b><small>识别后直接播英文</small></span>
        <span class="toggle ${S.autoplay ? 'on' : ''}" data-act="toggle-setting" data-key="autoplay" role="switch" aria-checked="${S.autoplay}" tabindex="0"></span>
      </div>
      <div class="setting-row" data-act="toast" data-text="离线地图已是最新 · 42 MB" data-icon="download" role="button" tabindex="0">
        <span class="ico">${icon('map', 12)}</span>
        <span class="grow"><b>离线地图</b><small>北京 · 已下载 42 MB</small></span>
        <span class="val">${icon('right', 9)}</span>
      </div>
    </div>

    <div class="section-title"><div class="st-left"><span class="idx">04</span><h2>关于</h2></div></div>
    <div class="card" style="padding:2px 13px">
      <div class="setting-row" data-act="toast" data-text="隐私政策 · 所有语音只在设备端处理" data-icon="lock" role="button" tabindex="0">
        <span class="ico">${icon('lock', 12)}</span>
        <span class="grow"><b>隐私政策</b><small>数据只留在你的设备上</small></span>
        <span class="val">${icon('right', 9)}</span>
      </div>
      <div class="setting-row" data-act="toast" data-text="服务条款 · Lucia 1.0.0" data-icon="doc" role="button" tabindex="0">
        <span class="ico">${icon('doc', 12)}</span>
        <span class="grow"><b>服务条款</b><small>最后更新于 2026/10</small></span>
        <span class="val">${icon('right', 9)}</span>
      </div>
      <div class="setting-row" data-act="toast" data-text="Lucia 1.0.0 (12) · 原生 SwiftUI 版" data-icon="info" role="button" tabindex="0">
        <span class="ico">${icon('info', 12)}</span>
        <span class="grow"><b>关于 Lucia</b><small>版本 1.0.0 (12)</small></span>
        <span class="val">${icon('right', 9)}</span>
      </div>
    </div>

    <div class="me-footer">LUCIA · MADE FOR SLOW TRAVEL<br>把一趟北京装进口袋</div>`;
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
  phrase: phraseSheet
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
      <button class="sheet-close" data-act="close-sheet" aria-label="关闭">${icon('x', 10)}</button>
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

/* ---------- assistant ---------- */
function assistantSheet() {
  return `<div class="sheet tall">
    <div class="assistant-head">
      <span class="orb-mini">${sparkleIcon(16)}</span>
      <div class="grow">
        <h3>Lucia 助手</h3>
        <div class="ctx">${esc(S.assistantContext)}</div>
      </div>
      <button class="sheet-close" data-act="close-sheet" aria-label="关闭">${icon('x', 10)}</button>
    </div>
    <div class="chat" id="chat">${chatHTML()}</div>
    <div class="quick-wrap">
      ${QUICK.map((q) => `<button data-act="quick" data-text="${esc(q)}">${esc(q)}</button>`).join('')}
    </div>
    <div class="chat-input">
      <input id="chatInput" placeholder="问 Lucia：路线、门票、翻译…" aria-label="向 Lucia 提问" autocomplete="off">
      <button data-act="send-chat" aria-label="发送">${icon('arrowr', 14)}</button>
    </div>
  </div>`;
}

function assistContextHTML() {
  return `<div class="assist-card">
    <div class="assist-card-top">
      <span class="eyebrow">NOW · 出发前 3 天</span>
      <span class="assist-tag">北京 · 4 天 3 晚</span>
    </div>
    <div class="assist-stats">
      <div><b>06</b><span>路线地点</span></div>
      <div><b>02</b><span>位同行</span></div>
      <div><b>6/12</b><span>清单完成</span></div>
    </div>
    <button class="assist-nudge" data-act="checklist">
      <span class="nudge-dot"></span>
      <span class="grow">故宫门票最紧 · 建议今天预约</span>
      ${icon('arrowr', 9)}
    </button>
    <div class="assist-plan">
      <div class="assist-plan-head">
        <span>今天的路线</span>
        <button data-act="tab" data-tab="plan">打开地图 ${icon('arrowr', 8)}</button>
      </div>
      <div class="assist-line"><b>09:40</b><span class="grow">故宫 · 中轴线</span><em>已订</em></div>
      <div class="assist-line"><b>13:00</b><span class="grow">什刹海 · 银锭桥</span><em>待定</em></div>
      <div class="assist-line"><b>17:00</b><span class="grow">景山 · 日落 17:42</span><em class="best">最佳</em></div>
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
  if (/路线|行程|什刹海|安排|哪天|顺序/.test(text)) {
    return { role: 'assistant', text: '我看了一下你的中轴线：故宫 09:40 进最顺，什刹海挪到 13:00 能少走 1.2 km。今天日落 17:42，景山 17:00 上山刚好。', actions: [
      { label: '应用到路线', act: 'apply-ai', icon: 'sparkle' },
      { label: '打开地图', act: 'tab', tab: 'plan', plain: true }
    ] };
  }
  if (/门票|故宫|预约|余票|长城|颐和园/.test(text)) {
    return { role: 'assistant', text: '故宫 10/15 09:00 还有 812 张，成人票 ¥60，需要实名，记得带护照原件。长城缆车和颐和园还没约，建议今天一起订。', actions: [
      { label: '打开清单', act: 'checklist', icon: 'check' },
      { label: '去预约', act: 'assistant-ticket', plain: true }
    ] };
  }
  if (/吃|餐厅|烤鸭|咖啡|美食|饭/.test(text)) {
    return { role: 'assistant', text: '想吃烤鸭就四季民福故宫店，11:00 前到基本不排队；想安静喝咖啡，Metal Hands 前门店下午 3 点光线最好。', actions: [
      { label: '看社区', act: 'forum', channel: 'restaurant', icon: 'compass' },
      { label: '加入路线', act: 'add-place', dataId: 'p1', plain: true }
    ] };
  }
  if (/住|酒店|王府井/.test(text)) {
    return { role: 'assistant', text: '王府井文华东方已确认，3 晚大床房。步行 12 分钟到故宫东门，早上不用打车。要不要我把行李寄存的时间也加进清单？', actions: [
      { label: '看订单', act: 'tab', tab: 'me', icon: 'bed' },
      { label: '加入清单', act: 'checklist', plain: true }
    ] };
  }
  if (/翻译|过敏|英语|怎么说|医疗/.test(text)) {
    return { role: 'assistant', text: '我把「我对花生过敏，请确认这道菜不含花生」放进离线语句了，断网也能朗读。更紧急的句子在「翻译 → 就医」里。', actions: [
      { label: '去翻译', act: 'tab', tab: 'translate', icon: 'chat' },
      { label: '离线语句', act: 'tab', tab: 'translate', plain: true }
    ] };
  }
  if (/天气|下雨|温度|冷|热/.test(text)) {
    return { role: 'assistant', text: '10/15–17 白天 22℃，早晚 11℃，带一件薄外套。18 号可能有小雨，折叠伞放包里就好。', actions: [
      { label: '加入清单', act: 'checklist', icon: 'check' },
      { label: '打开行程', act: 'tab', tab: 'trip', plain: true }
    ] };
  }
  if (/清单|护照|签证|准备|带什么/.test(text)) {
    return { role: 'assistant', text: '清单还有 4 项没完成：故宫门票、长城缆车、颐和园、国家博物馆。最紧的是故宫，建议今天预约，周一会闭馆。', actions: [
      { label: '打开清单', act: 'checklist', icon: 'check' }
    ] };
  }
  if (/活动|市集|夜|报名/.test(text)) {
    return { role: 'assistant', text: '18 号钟鼓楼有胡同夜市，免费入场，128 人报名，你已经在名单里了。想去的话我可以把提醒加到行程里。', actions: [
      { label: '看活动', act: 'forum', channel: 'event', icon: 'calendar' }
    ] };
  }
  return { role: 'assistant', text: '我先记下了。想改路线、订门票或翻译一句话，直接说，我帮你在 App 里办好。', actions: [
    { label: '打开路线', act: 'tab', tab: 'plan', icon: 'map' },
    { label: '行前清单', act: 'checklist', plain: true }
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
    ${sheetHead('相似路线', 'CITYWALK · 3 条可套用')}
    <div class="sheet-body">
      <p class="sub" style="margin:2px 0 9px">按你的 6 个点位匹配，套用后会替换站点顺序与时间。</p>
      ${SIMILAR.map((r, i) => `<div class="card sim-route-card">
        <div class="sim-route-top">
          <div class="match-box ${r.match >= 90 ? '' : 'mid'}">${r.match}%</div>
          <div class="sim-route-info">
            <b>${esc(r.title)}</b>
            <small>${esc(r.author)} · ${r.stops} 站 · ${esc(r.distance)} · ${esc(r.duration)}</small>
          </div>
        </div>
        <div class="sim-tags">${r.tags.map((t) => tag(t)).join('')}</div>
        <p>${esc(r.highlight)}</p>
        <button class="apply" data-act="apply-similar" data-index="${i}">${icon('check', 10)}套用到我的路线</button>
      </div>`).join('')}
    </div>
  </div>`;
}

/* ---------- reorder ---------- */
function reorderSheet() {
  return `<div class="sheet medium">
    ${sheetHead('编辑顺序', '路线 · 调整站点')}
    <div class="sheet-body">
      <p class="sub" style="margin:2px 0 8px">用箭头调整先后，路线与时间会自动重算。</p>
      ${S.stops.map((s, i) => `<div class="reorder-row">
        <span class="num">${i + 1}</span>
        <span class="grow"><b>${esc(s.name)}</b><small>${esc(s.time)} · ${esc(s.duration)}</small></span>
        <span class="btns">
          <button data-act="move-stop" data-index="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="上移">${icon('up', 10)}</button>
          <button data-act="move-stop" data-index="${i}" data-dir="1" ${i === S.stops.length - 1 ? 'disabled' : ''} aria-label="下移">${icon('down', 10)}</button>
        </span>
      </div>`).join('')}
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="close-sheet">取消</button>
      <button class="primary" data-act="finish-reorder">完成</button>
    </div>
  </div>`;
}

/* ---------- notes ---------- */
function notesSheet() {
  return `<div class="sheet tall">
    ${sheetHead('行程笔记', 'NOTE · 可保存为海报')}
    <div class="sheet-body">
      ${posterHTML()}
      <div class="row" style="gap:6px;margin-top:10px">
        <button class="full-btn" data-act="save-note">${icon('download', 11)}保存海报</button>
        <button class="full-btn ink" data-act="copy" data-text="${esc(noteText())}">${icon('copy', 11)}复制文案</button>
      </div>
      <div class="empty-note">海报按 3:4 导出，适合发在社区或朋友圈。</div>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="close-sheet">关闭</button>
      <button class="primary" data-act="note-to-forum">发到社区</button>
    </div>
  </div>`;
}

function posterHTML() {
  return `<div class="note-poster">
    <div class="poster-head">
      <div>
        <div class="eyebrow" style="margin-bottom:5px">LUCIA · CITYWALK</div>
        <b>${esc(S.routeName)}</b>
      </div>
      ${tag('DAY 02', 'lime')}
    </div>
    <div class="meta">10/15 · 北京 · 2 人同行 · 4.2 km</div>
    <div class="note-stops">
      ${S.stops.map((s, i) => `<div class="note-stop">
        <span class="n">${i + 1}</span>
        <span class="grow"><b>${esc(s.name)}</b><small>${esc(s.duration)} · ${esc(s.tag || '慢走')}</small></span>
        <span class="tm">${esc(s.time)}</span>
      </div>`).join('')}
    </div>
    <div class="note-foot"><span>约 5 小时 · 步行 + 地铁</span><span>LUCIA / 2026</span></div>
  </div>`;
}

function noteText() {
  return `${S.routeName}\n10/15 · 北京 · 2 人同行\n\n${S.stops.map((s, i) => `${i + 1}. ${s.name} ${s.time}`).join('\n')}\n\n4.2 km · 约 5 小时 · 由 Lucia 生成`;
}

/* ---------- checklist ---------- */
function checklistSheet() {
  const progress = doneCount() / S.checklist.length;
  const cats = ['全部', '证件', '门票', '网络', '交通'];
  const phaseNames = ['出发前', '落地当天'];
  return `<div class="sheet tall">
    ${sheetHead('行前清单', 'CHECKLIST · 12 项')}
    <div class="sheet-body">
      <div class="card check-summary">
        ${bigRingHTML(progress)}
        <div class="grow">
          <h3>出发还剩 3 天</h3>
          <p>已完成 ${doneCount()} / ${S.checklist.length} 项。故宫门票最紧，建议今天预约。</p>
        </div>
      </div>
      <div class="check-cats">
        ${cats.map((c) => `<button class="chip ${S.checklistCat === c ? 'on' : ''}" data-act="check-cat" data-cat="${c}">${c}</button>`).join('')}
      </div>
      ${phaseNames.map((phase) => {
        const items = S.checklist.filter((c) => c.phase === phase && (S.checklistCat === '全部' || c.cat === S.checklistCat));
        if (!items.length) return '';
        return `<div class="phase-title">${phase} · ${items.length} 项</div>${items.map(checkRowHTML).join('')}`;
      }).join('')}
      <div class="empty-note">勾选后进度会同步到「行程」页。</div>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="close-sheet">关闭</button>
      <button class="primary" data-act="checklist-assistant">问 Lucia 还缺什么</button>
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
    <button class="check-box" data-act="toggle-check" data-id="${c.id}" aria-label="勾选 ${esc(c.title)}">${icon('check', 10)}</button>
    <span class="check-info">
      <b>${esc(c.title)}</b>
      <small>${esc(c.meta)}</small>
      ${c.tag ? `<span class="tags">${tag(c.tag, c.tone === 'warn' ? 'warn' : 'soft')}</span>` : ''}
    </span>
    ${done
      ? `<span class="check-action">${esc(c.right || '已完成')}</span>`
      : `<button class="check-action" data-act="check-action" data-id="${c.id}">${esc(c.action || '查看')}</button>`}
  </div>`;
}

/* ---------- place ---------- */
function placeSheet() {
  const p = placeById(S.sheetData) || PLACES[0];
  const saved = S.saved.has(p.id);
  return `<div class="sheet medium">
    ${sheetHead('地点详情', '社区 · ' + p.area)}
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
        <div class="place-fact"><span>最佳时间</span><b>${esc(p.bestTime)}</b></div>
        <div class="place-fact"><span>位置</span><b>${esc(p.area)}</b></div>
      </div>
      <button class="full-btn" style="margin-top:9px;width:100%" data-act="place-assistant" data-id="${p.id}">${icon('sparkles', 11)}问问 Lucia 怎么安排</button>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="save-place" data-id="${p.id}">${icon(saved ? 'check' : 'heart', 10)}${saved ? '已收藏' : '收藏'}</button>
      <button class="primary" data-act="add-place" data-id="${p.id}">加入今天的路线</button>
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
    ${sheetHead('发起一场活动', '社区 · 发布')}
    <div class="sheet-body">
      <div class="field">
        <label>活动名称</label>
        <input data-field="title" value="${esc(d.title)}" placeholder="例如：什刹海落日摄影局" maxlength="30">
      </div>
      <div class="field-row">
        <div class="field"><label>日期</label><input data-field="date" value="${esc(d.date)}" placeholder="11/08 周六"></div>
        <div class="field"><label>时间</label><input data-field="time" value="${esc(d.time)}" placeholder="14:00 – 18:00"></div>
      </div>
      <div class="field"><label>集合地点</label><input data-field="place" value="${esc(d.place)}" placeholder="例如：银锭桥"></div>
      <div class="field"><label>费用</label><input data-field="fee" value="${esc(d.fee)}" placeholder="免费 / ¥20"></div>
      <div class="field"><label>补充说明</label><textarea data-field="note" rows="3" placeholder="想带大家一起做什么？">${esc(d.note)}</textarea></div>
      <div class="preview-card" id="composePreview">${composePreviewHTML()}</div>
      <div class="publish-note">发布后会出现在「本地活动」频道，可随时编辑或取消。</div>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="close-sheet">取消</button>
      <button class="primary" id="publishBtn" data-act="publish-event">发布活动</button>
    </div>
  </div>`;
}

function composePreviewHTML() {
  const d = S.draft;
  return `<div class="lab">预览 · 社区卡片</div>
    <b>${esc(d.title.trim() || '你的活动名称')}</b>
    <p>${esc(d.date)} ${esc(d.time)} · ${esc(d.place.trim() || '集合地点待定')} · ${esc(d.fee)}</p>
    <p>${esc(d.note.trim() || '由你发起 · 欢迎同行')}</p>`;
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
    ${sheetHead('应急语句', '离线 · 可朗读')}
    <div class="sheet-body">
      <div class="phrase-focus">
        <div class="zh">${esc(p.zh)}</div>
        <div class="en">${esc(p.en)}</div>
        <button class="speaker" data-act="speak" data-text="${esc(p.en)}" data-lang="en" aria-label="朗读英文">${icon('speaker', 17)}</button>
        <div class="hint">点喇叭朗读 · 没有网络也能用</div>
      </div>
    </div>
    <div class="sheet-cta">
      <button class="ghost" data-act="copy" data-text="${esc(p.en)}">${icon('copy', 9)}英文</button>
      <button class="primary" data-act="copy" data-text="${esc(p.zh)}">${icon('copy', 9)}复制中文</button>
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
  S.routeName = '北京中轴线 · 已优化';
  render();
  if (!silent) toast('已应用 Lucia 建议 · 少走 1.2 km', 'sparkle');
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
  toast(`已套用「${r.title}」`, 'check');
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
  toast(`已套用「${r.title}」`, 'check');
}

function speak(text, lang) {
  if (!('speechSynthesis' in window)) { toast('当前浏览器不支持语音朗读', 'info'); return; }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    u.rate = .95;
    window.speechSynthesis.speak(u);
    toast('正在朗读', 'speaker');
  } catch (e) {
    toast('朗读失败，请检查系统语音', 'info');
  }
}

function copyText(text) {
  const done = () => toast('已复制到剪贴板', 'copy');
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
    toast('复制失败，请手动选择', 'copy');
  }
}

async function shareRoute() {
  const data = { title: S.routeName, text: `${S.routeName} · ${S.stops.length} 站 · 4.2 km · Lucia`, url: location.href };
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
  toast('已识别并翻译成英文', 'mic');
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
    toast('识别到 4 处文字 · 已翻译', 'camera');
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
  if (item.status === 'done') item.right = '已完成';
  const body = $('.sheet-body');
  const top = body ? body.scrollTop : 0;
  render();
  requestAnimationFrame(() => {
    const nb = $('.sheet-body');
    if (nb) nb.scrollTop = top;
  });
  toast(item.status === 'done' ? '已完成一项' : '已取消勾选', 'check');
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
  if (!d.title.trim() || !d.place.trim()) { toast('还差活动名称和地点', 'info'); return; }
  const event = {
    id: 'e' + Date.now(),
    title: d.title.trim(),
    subtitle: d.note.trim() || '由你发起的 Citywalk · 欢迎同行',
    date: d.date.trim() || '11/08 周六',
    time: d.time.trim() || '14:00 – 18:00',
    place: d.place.trim(),
    host: '@王博',
    fee: d.fee.trim() || '免费',
    attendees: 1,
    tint: 'lime'
  };
  S.events.unshift(event);
  S.joined.add(event.id);
  S.draft = { title: '', date: '11/08 周六', time: '14:00 – 18:00', place: '', fee: '免费', note: '' };
  closeSheet();
  S.forumChannel = 'event';
  go('forum', 'event');
  toast('活动已发布 · 可以邀请同行的朋友了', 'sparkle');
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
      toast('顺序已更新 · 时间已重算', 'refresh');
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
    case 'dismiss-reminder':
      S.reminderDismissed = true;
      render();
      break;
    case 'apply-ai':
      closeSheet();
      applyRouteSuggestion();
      break;
    case 'apply-from-trip':
      applyRouteSuggestion(true);
      S.tab = 'plan';
      render(true);
      toast('已调整路线 · 什刹海挪到 13:00', 'sparkle');
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
      toast(S.editMode ? '拖动编号圆点调整位置' : '点位已保存', S.editMode ? 'hand' : 'check');
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
      if (S.joined.has(id)) { S.joined.delete(id); toast('已取消报名'); } else { S.joined.add(id); toast('报名成功 · 已加入行程提醒', 'check'); }
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
      toast('已加入今天的路线', 'plus');
      break;
    case 'save-place': {
      const id = el.dataset.id;
      if (S.saved.has(id)) { S.saved.delete(id); toast('已取消收藏'); } else { S.saved.add(id); toast('已收藏 · 可在「我的」查看', 'heart'); }
      renderSheet();
      break;
    }
    case 'place-assistant': {
      const p = placeById(el.dataset.id);
      openAssistant(p ? `社区 · ${p.title}` : null);
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
      toast('已切到离线语句库', 'download');
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
      toast('已收藏到离线语句', 'heart');
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
        toast(key === 'notifications' ? (S.notifications ? '行程提醒已开启' : '行程提醒已关闭') : (S.autoplay ? '自动朗读已开启' : '自动朗读已关闭'), key === 'notifications' ? 'bell' : 'speaker');
      }
      break;
    }
    case 'toggle-check':
      toggleCheck(el.dataset.id);
      break;
    case 'check-action': {
      const item = S.checklist.find((c) => c.id === el.dataset.id);
      if (item) toast(`已打开「${item.title}」· ${item.action}`, 'check');
      break;
    }
    case 'check-cat':
      S.checklistCat = el.dataset.cat || '全部';
      renderSheet();
      break;
    case 'checklist-assistant':
      openAssistant('清单 · 还缺什么');
      break;
    case 'move-stop':
      moveStop(Number(el.dataset.index), Number(el.dataset.dir));
      break;
    case 'publish-event':
      publishEvent();
      break;
    case 'save-note':
      toast('海报已保存到相册', 'download');
      break;
    case 'note-to-forum':
      closeSheet();
      go('forum');
      toast('笔记已发到社区', 'sparkle');
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
      toast('已打开故宫预约入口', 'ticket');
      break;
    case 'toast':
      toast(el.dataset.text || '已完成', el.dataset.icon || 'check');
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
      if (wrap) wrap.insertAdjacentHTML('beforeend', `<button class="clear" data-act="search-clear" aria-label="清空搜索">${icon('x', 8)}</button>`);
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
      if (!sessionStorage.getItem('lucia-hint')) {
        sessionStorage.setItem('lucia-hint', '1');
        toast('试试计划页的「调点位」，拖动编号圆点', 'hand');
      }
    } catch (e) { /* storage unavailable */ }
  }, 1100);
}

boot();
})();
