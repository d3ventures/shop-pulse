import { useState, useRef } from "react";

// ─── MOCK ORDER DATA (mirrors TikTok Seller Center export format) ─────────────
const MOCK_ORDERS = [
  { orderId:"TT-001", product:"Glow Serum 2.0",   salePrice:34.99, tikTokFee:1.82, affiliateCom:3.85, discount:2.80, shipping:4.20, channel:"affiliate", cogs:7.80 },
  { orderId:"TT-002", product:"Glow Serum 2.0",   salePrice:34.99, tikTokFee:1.82, affiliateCom:3.85, discount:2.80, shipping:4.20, channel:"affiliate", cogs:7.80 },
  { orderId:"TT-003", product:"Glow Serum 2.0",   salePrice:34.99, tikTokFee:1.82, affiliateCom:0.00, discount:0.00, shipping:4.20, channel:"organic",   cogs:7.80 },
  { orderId:"TT-004", product:"Glow Serum 2.0",   salePrice:34.99, tikTokFee:1.82, affiliateCom:0.00, discount:2.80, shipping:4.20, channel:"paid",      cogs:7.80 },
  { orderId:"TT-005", product:"Glow Serum 2.0",   salePrice:34.99, tikTokFee:1.82, affiliateCom:3.85, discount:2.80, shipping:4.20, channel:"affiliate", cogs:7.80 },
  { orderId:"TT-006", product:"Hydra Mist SPF",   salePrice:35.00, tikTokFee:1.84, affiliateCom:3.85, discount:2.80, shipping:3.80, channel:"affiliate", cogs:9.20 },
  { orderId:"TT-007", product:"Hydra Mist SPF",   salePrice:35.00, tikTokFee:1.84, affiliateCom:0.00, discount:0.00, shipping:3.80, channel:"organic",   cogs:9.20 },
  { orderId:"TT-008", product:"Hydra Mist SPF",   salePrice:35.00, tikTokFee:1.84, affiliateCom:3.85, discount:2.80, shipping:3.80, channel:"affiliate", cogs:9.20 },
  { orderId:"TT-009", product:"Hydra Mist SPF",   salePrice:35.00, tikTokFee:1.84, affiliateCom:0.00, discount:2.80, shipping:3.80, channel:"paid",      cogs:9.20 },
  { orderId:"TT-010", product:"Vitamin C Drops",  salePrice:35.00, tikTokFee:1.84, affiliateCom:3.85, discount:2.80, shipping:3.20, channel:"affiliate", cogs:6.50 },
  { orderId:"TT-011", product:"Vitamin C Drops",  salePrice:35.00, tikTokFee:1.84, affiliateCom:0.00, discount:0.00, shipping:3.20, channel:"organic",   cogs:6.50 },
  { orderId:"TT-012", product:"Vitamin C Drops",  salePrice:35.00, tikTokFee:1.84, affiliateCom:0.00, discount:2.80, shipping:3.20, channel:"paid",      cogs:6.50 },
  { orderId:"TT-013", product:"Night Repair Mask",salePrice:35.00, tikTokFee:1.84, affiliateCom:3.85, discount:2.80, shipping:4.50, channel:"affiliate", cogs:11.40 },
  { orderId:"TT-014", product:"Night Repair Mask",salePrice:35.00, tikTokFee:1.84, affiliateCom:0.00, discount:2.80, shipping:4.50, channel:"paid",      cogs:11.40 },
  { orderId:"TT-015", product:"Eye Lift Patches", salePrice:41.56, tikTokFee:2.16, affiliateCom:4.57, discount:3.32, shipping:3.60, channel:"affiliate", cogs:5.90 },
  { orderId:"TT-016", product:"Eye Lift Patches", salePrice:41.56, tikTokFee:2.16, affiliateCom:0.00, discount:0.00, shipping:3.60, channel:"organic",   cogs:5.90 },
  { orderId:"TT-017", product:"Glow Serum 2.0",   salePrice:34.99, tikTokFee:1.82, affiliateCom:3.85, discount:2.80, shipping:4.20, channel:"affiliate", cogs:7.80 },
  { orderId:"TT-018", product:"Hydra Mist SPF",   salePrice:35.00, tikTokFee:1.84, affiliateCom:3.85, discount:2.80, shipping:3.80, channel:"affiliate", cogs:9.20 },
  { orderId:"TT-019", product:"Glow Serum 2.0",   salePrice:34.99, tikTokFee:1.82, affiliateCom:0.00, discount:0.00, shipping:4.20, channel:"organic",   cogs:7.80 },
  { orderId:"TT-020", product:"Eye Lift Patches", salePrice:41.56, tikTokFee:2.16, affiliateCom:4.57, discount:3.32, shipping:3.60, channel:"affiliate", cogs:5.90 },
];

// ─── CATALOG DATA ─────────────────────────────────────────────────────────────
const TAG_TYPES = {
  campaign: { label:"Campaign",  color:"#ff6b35", bg:"rgba(255,107,53,0.12)"  },
  category: { label:"Category",  color:"#00e5a0", bg:"rgba(0,229,160,0.10)"   },
  internal: { label:"Internal",  color:"#c77dff", bg:"rgba(199,125,255,0.12)" },
};

const DEFAULT_TAGS = {
  campaign: ["Flash Sale","Spring Launch","Bundle Promo","Creator Seeding","Double Day"],
  category: ["Serum","SPF","Eye Care","Mask","Mist","Drops"],
  internal: ["Hero SKU","Trending","New Arrival","Low Stock","Evergreen","Test"],
};

const DEFAULT_CATALOG = [
  {
    id:"p1", name:"Glow Serum 2.0", sku:"GS2-30ML",
    retailPrice:44.99, discountedPrice:34.99, cogs:7.80,
    status:"active",
    tags:{ campaign:["Flash Sale","Creator Seeding"], category:["Serum"], internal:["Hero SKU","Trending"] },
    units:142, revenue:4970, emv:8200, roas:3.8, vcr:4.2, margin:38,
  },
  {
    id:"p2", name:"Hydra Mist SPF", sku:"HM-SPF50",
    retailPrice:42.00, discountedPrice:35.00, cogs:9.20,
    status:"active",
    tags:{ campaign:["Spring Launch","Flash Sale"], category:["SPF","Mist"], internal:["Hero SKU"] },
    units:98, revenue:3430, emv:5100, roas:2.9, vcr:3.1, margin:29,
  },
  {
    id:"p3", name:"Vitamin C Drops", sku:"VCD-15ML",
    retailPrice:39.99, discountedPrice:35.00, cogs:6.50,
    status:"active",
    tags:{ campaign:["Spring Launch"], category:["Drops","Serum"], internal:["Evergreen"] },
    units:61, revenue:2135, emv:2900, roas:1.9, vcr:1.8, margin:22,
  },
  {
    id:"p4", name:"Night Repair Mask", sku:"NRM-50ML",
    retailPrice:42.00, discountedPrice:35.00, cogs:11.40,
    status:"active",
    tags:{ campaign:[], category:["Mask"], internal:[] },
    units:34, revenue:1190, emv:1400, roas:1.2, vcr:0.9, margin:11,
  },
  {
    id:"p5", name:"Eye Lift Patches", sku:"ELP-60CT",
    retailPrice:41.56, discountedPrice:41.56, cogs:5.90,
    status:"active",
    tags:{ campaign:["Creator Seeding"], category:["Eye Care"], internal:["Trending","Test"] },
    units:27, revenue:1122, emv:980, roas:2.1, vcr:2.6, margin:34,
  },
  {
    id:"p6", name:"Brightening Toner", sku:"BT-150ML",
    retailPrice:36.00, discountedPrice:36.00, cogs:8.10,
    status:"testing",
    tags:{ campaign:[], category:["Mist"], internal:["New Arrival","Test"] },
    units:0, revenue:0, emv:0, roas:0, vcr:0, margin:0,
  },
  {
    id:"p7", name:"Peptide Eye Cream", sku:"PEC-15ML",
    retailPrice:52.00, discountedPrice:44.00, cogs:12.50,
    status:"paused",
    tags:{ campaign:["Bundle Promo"], category:["Eye Care"], internal:["Low Stock"] },
    units:8, revenue:352, emv:420, roas:1.1, vcr:0.7, margin:9,
  },
];

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const mockData = {
  date: "March 10, 2026",
  revenue: { today:12847, yesterday:10230, goal:15000, weeklyTrend:[6200,8100,10230,12847] },
  products: [
    { name:"Glow Serum 2.0",   units:142, revenue:4970, emv:8200, trend:"up",   vcr:4.2, roas:3.8, repeatRate:68 },
    { name:"Hydra Mist SPF",   units:98,  revenue:3430, emv:5100, trend:"up",   vcr:3.1, roas:2.9, repeatRate:54 },
    { name:"Vitamin C Drops",  units:61,  revenue:2135, emv:2900, trend:"flat", vcr:1.8, roas:1.9, repeatRate:41 },
    { name:"Night Repair Mask",units:34,  revenue:1190, emv:1400, trend:"down", vcr:0.9, roas:1.2, repeatRate:29 },
    { name:"Eye Lift Patches", units:27,  revenue:1122, emv:980,  trend:"up",   vcr:2.6, roas:2.1, repeatRate:37 },
  ],
  channels: {
    organic:   { revenue:4628, impressions:420000, vcr:3.1, completionRate:54 },
    paid:      { revenue:5139, spend:1350, roas:3.8, ctr:2.4 },
    affiliate: { revenue:3080, emv:11200, creators:14, topCreator:"@glowwithsara" },
  },
  alerts: [
    { type:"opportunity", msg:"Glow Serum 2.0 EMV up 38% — consider Spark Ad boost" },
    { type:"warning",     msg:"Night Repair Mask ROAS below 1.5 — review ad creative" },
    { type:"info",        msg:"14 affiliate posts live today — peak posting window: 6–9 PM" },
  ],
  blendedROAS:2.8, aov:62.40, newCustomers:187, repeatCustomers:94, cartAbandon:31,
  contentStats: { organicPosts:5, affiliatePosts:14, liveCount:2, sparkAds:3, totalPieces:24, weekRevenue:74200, prevWeekPieces:18, prevWeekRevenue:61800 },
  weekly: {
    dateRange:"Mar 3 – Mar 9, 2026", totalRevenue:74200, prevWeekRevenue:61800, weeklyGoal:80000,
    revenueByDay:[8100,9400,11200,10800,12300,11600,10800],
    budgetAllocation:{ paid:9450, affiliate:4200 }, budgetRecommendation:{ paid:11000, affiliate:5500 },
    products:[
      { name:"Glow Serum 2.0",   weekRev:28400, prevRev:19200, roas:3.8, emv:52000, vcr:4.2, repeatRate:68, action:"scale" },
      { name:"Hydra Mist SPF",   weekRev:19600, prevRev:17100, roas:2.9, emv:31000, vcr:3.1, repeatRate:54, action:"scale" },
      { name:"Vitamin C Drops",  weekRev:14200, prevRev:13900, roas:1.9, emv:17000, vcr:1.8, repeatRate:41, action:"hold"  },
      { name:"Night Repair Mask",weekRev:7100,  prevRev:9400,  roas:1.2, emv:8200,  vcr:0.9, repeatRate:29, action:"cut"   },
      { name:"Eye Lift Patches", weekRev:4900,  prevRev:2200,  roas:2.1, emv:6100,  vcr:2.6, repeatRate:37, action:"test"  },
    ],
    creators:[
      { handle:"@glowwithsara",    posts:4, emv:18400, revenue:6200, roas:3.1, rebooking:"yes"   },
      { handle:"@skinbyjade",      posts:3, emv:12100, revenue:4800, roas:2.8, rebooking:"yes"   },
      { handle:"@beautybymel",     posts:2, emv:5200,  revenue:1900, roas:1.4, rebooking:"maybe" },
      { handle:"@dailyroutine.co", posts:5, emv:3800,  revenue:900,  roas:0.8, rebooking:"no"    },
      { handle:"@gloss.tori",      posts:1, emv:6900,  revenue:2100, roas:2.2, rebooking:"yes"   },
    ],
    contentFormats:[
      { format:"Before / After Demo",      avgVCR:4.8, avgEMV:14200, verdict:"scale" },
      { format:"Morning Routine",          avgVCR:3.4, avgEMV:9800,  verdict:"scale" },
      { format:"Educational / Ingredient", avgVCR:2.1, avgEMV:5400,  verdict:"hold"  },
      { format:"Unboxing / First Look",    avgVCR:1.9, avgEMV:4200,  verdict:"hold"  },
      { format:"Talking Head / Review",    avgVCR:1.1, avgEMV:2100,  verdict:"cut"   },
    ],
    decisions:[
      { owner:"Media Buyer",        decision:"Increase paid budget by $1,550 — shift from Night Repair to Glow Serum Spark Ads" },
      { owner:"Creator Manager",    decision:"Re-book @glowwithsara, @skinbyjade, @gloss.tori — drop @dailyroutine.co" },
      { owner:"Brand / Leadership", decision:"Glow Serum 2.0 is hero product — prioritize inventory restock before week 3" },
    ],
  },
  projections: {
    trailing4WeekAvg:68500, wowGrowthRate:0.12,
    nextWeek:{
      label:"Mar 10 – Mar 16, 2026", baseline:68500,
      campaignType:"3-Day Flash Sale + Spark Ads",
      plannedContent:{ organic:6, affiliate:16, lives:2, sparkAds:4 },
      low:79200, mid:93400, high:108000,
      rationale:[
        { factor:"Baseline",           value:"$68,500", detail:"Trailing 4-week weekly average" },
        { factor:"WoW Growth Rate",    value:"+12%",    detail:"Consistent 4-week average growth trend" },
        { factor:"Campaign Multiplier",value:"1.65x",   detail:"3-day flash sale drives ~1.6x lift; Spark Ad push adds residual lift" },
        { factor:"Seasonality",        value:"1.1x",    detail:"Mid-March: spring skincare routines pick up" },
        { factor:"Content Pipeline",   value:"+21%",    detail:"6 organic + 16 affiliate + 2 LIVEs + 4 Spark Ads scheduled" },
        { factor:"Inventory",          value:"No cap",  detail:"Top 3 revenue products have 30+ days of stock" },
      ],
    },
    nextMonth:{
      label:"April 2026",
      weeks:[
        { week:"Mar 31 – Apr 6",  low:72000,  mid:81000,  high:91000,  note:"Campaign-light week, organic momentum only." },
        { week:"Apr 7 – Apr 13",  low:84000,  mid:96000,  high:109000, note:"Mid-month LIVE push + affiliate seeding. 1.4x campaign multiplier." },
        { week:"Apr 14 – Apr 20", low:91000,  mid:104000, high:118000, note:"Peak spring beauty demand. 1.15x seasonal lift." },
        { week:"Apr 21 – Apr 30", low:79000,  mid:90000,  high:103000, note:"10-day stretch. Vitamin C Drops restock mid-week." },
      ],
      totalLow:326000, totalMid:371000, totalHigh:421000,
      keyAssumptions:[
        { label:"Growth Rate",       text:"12% WoW maintained — slows to 8% final week" },
        { label:"Campaign Calendar", text:"1 LIVE event week 2, 1 affiliate seeding drop weeks 2–3, no Double Day" },
        { label:"Seasonality",       text:"April above-average for beauty. 1.1–1.15x multiplier weeks 3–4" },
        { label:"Content Volume",    text:"18–22 pieces/week assumed. Below 12 affiliate posts = -8% mid estimate" },
        { label:"Inventory Risk",    text:"Vitamin C Drops restock Apr 16 — stockout gap would cost ~$12k" },
        { label:"Downside Scenario", text:"No campaign + content <10 pieces/week = low estimate applies" },
      ],
    },
  },
};

const DEFAULT_TIKTOK_FEE_PCT   = 6.0;
const DEFAULT_AFFILIATE_COM_PCT = 12.0;
const DEFAULT_DISCOUNT_PCT     = 8.0;
const DEFAULT_PRODUCTS_PROFIT  = [
  { name:"Glow Serum 2.0",   salePrice:34.99, cogs:7.80,  shipping:4.20, adSpend:412, adType:"GMV Max + Spark" },
  { name:"Hydra Mist SPF",   salePrice:35.00, cogs:9.20,  shipping:3.80, adSpend:318, adType:"GMV Max"         },
  { name:"Vitamin C Drops",  salePrice:35.00, cogs:6.50,  shipping:3.20, adSpend:198, adType:"GMV Max"         },
  { name:"Night Repair Mask",salePrice:35.00, cogs:11.40, shipping:4.50, adSpend:241, adType:"In-Feed + Spark"  },
  { name:"Eye Lift Patches", salePrice:41.56, cogs:5.90,  shipping:3.60, adSpend:181, adType:"Spark Ads"       },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const r2      = (n) => Math.round(n * 100) / 100;
const fmt     = (n) => Number(n) >= 1000 ? "$" + (Number(n)/1000).toFixed(1)+"k" : "$"+Number(n).toFixed(2);
const fmtFull = (n) => "$" + Number(n).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0});
const fmtPct  = (n) => Number(n).toFixed(1)+"%";
const pct     = (a,b) => b===0 ? 0 : (((a-b)/b)*100).toFixed(1);

function calcUnitProfit(p, fees) {
  const { tikTokFeePct, affiliateComPct, discountPct } = fees;
  const discountAmt    = r2(p.salePrice * discountPct / 100);
  const netRevenue     = r2(p.salePrice - discountAmt);
  const tikTokFee      = r2(netRevenue * tikTokFeePct / 100);
  const affiliateCom   = r2(netRevenue * affiliateComPct / 100);
  const grossProfit    = r2(netRevenue - p.cogs - p.shipping - tikTokFee - affiliateCom);
  const grossMarginPct = r2((grossProfit / netRevenue) * 100);
  return { discountAmt, netRevenue, tikTokFee, affiliateCom, grossProfit, grossMarginPct };
}

function calcProductTotal(prod, dailyProduct, fees) {
  const units = dailyProduct?.units || 0;
  const unit  = calcUnitProfit(prod, fees);
  const totalGross   = r2(unit.grossProfit * units);
  const netProfit    = r2(totalGross - prod.adSpend);
  const netMarginPct = r2(dailyProduct ? (netProfit / dailyProduct.revenue) * 100 : 0);
  return { units, unit, totalGross, netProfit, netMarginPct };
}

// Parse CSV text into order rows
function parseCSV(text) {
  const lines = text.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,""));
  const COL = {
    orderId:      headers.findIndex(h => h.includes("order_id") || h.includes("orderid")),
    product:      headers.findIndex(h => h.includes("product")),
    salePrice:    headers.findIndex(h => h.includes("sale_price") || h.includes("saleprice") || h.includes("selling_price")),
    tikTokFee:    headers.findIndex(h => h.includes("platform_fee") || h.includes("tiktok_fee") || h.includes("referral_fee")),
    affiliateCom: headers.findIndex(h => h.includes("affiliate") || h.includes("commission")),
    discount:     headers.findIndex(h => h.includes("discount")),
    shipping:     headers.findIndex(h => h.includes("shipping")),
    channel:      headers.findIndex(h => h.includes("channel") || h.includes("source")),
    cogs:         headers.findIndex(h => h.includes("cogs") || h.includes("cost")),
  };
  return lines.slice(1).map(line => {
    const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g,""));
    const g = (i) => i >= 0 ? cols[i] : "";
    const n = (i) => parseFloat(g(i)) || 0;
    return {
      orderId:      g(COL.orderId)      || "—",
      product:      g(COL.product)      || "Unknown",
      salePrice:    n(COL.salePrice),
      tikTokFee:    n(COL.tikTokFee),
      affiliateCom: n(COL.affiliateCom),
      discount:     n(COL.discount),
      shipping:     n(COL.shipping),
      channel:      (g(COL.channel)||"organic").toLowerCase(),
      cogs:         n(COL.cogs),
    };
  }).filter(r => r.salePrice > 0);
}

// Roll orders up to product-level summary
function rollUpByProduct(orders) {
  const map = {};
  orders.forEach(o => {
    if (!map[o.product]) map[o.product] = { product:o.product, orders:0, revenue:0, tikTokFees:0, affiliateComs:0, discounts:0, shipping:0, cogs:0, netProfit:0 };
    const m = map[o.product];
    m.orders++;
    m.revenue      += o.salePrice;
    m.tikTokFees   += o.tikTokFee;
    m.affiliateComs+= o.affiliateCom;
    m.discounts    += o.discount;
    m.shipping     += o.shipping;
    m.cogs         += o.cogs;
    m.netProfit    += o.salePrice - o.tikTokFee - o.affiliateCom - o.discount - o.shipping - o.cogs;
  });
  return Object.values(map).map(m => ({ ...m, margin: r2((m.netProfit/m.revenue)*100) }));
}

// Roll up to channel-level summary
function rollUpByChannel(orders) {
  const map = {};
  orders.forEach(o => {
    const ch = o.channel || "organic";
    if (!map[ch]) map[ch] = { channel:ch, orders:0, revenue:0, tikTokFees:0, affiliateComs:0, discounts:0, shipping:0, cogs:0, netProfit:0 };
    const m = map[ch];
    m.orders++;
    m.revenue      += o.salePrice;
    m.tikTokFees   += o.tikTokFee;
    m.affiliateComs+= o.affiliateCom;
    m.discounts    += o.discount;
    m.shipping     += o.shipping;
    m.cogs         += o.cogs;
    m.netProfit    += o.salePrice - o.tikTokFee - o.affiliateCom - o.discount - o.shipping - o.cogs;
  });
  return Object.values(map).map(m => ({ ...m, margin: r2((m.netProfit/m.revenue)*100) }));
}

// ─── SMALL UI COMPONENTS ──────────────────────────────────────────────────────
function TrendBadge({ val }) {
  const v = parseFloat(val);
  const color = v > 0 ? "#00e5a0" : v < 0 ? "#ff4d6d" : "#aaa";
  return <span style={{ color, fontSize:11, fontWeight:700 }}>{v>0?"▲":v<0?"▼":"—"} {Math.abs(v)}%</span>;
}
function TrendDot({ trend }) {
  return <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:{up:"#00e5a0",flat:"#f5c518",down:"#ff4d6d"}[trend], marginRight:6 }}/>;
}
function MiniBar({ value, max, color }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:4, height:4, width:"100%", marginTop:6 }}>
      <div style={{ width:Math.min((value/max)*100,100)+"%", height:"100%", borderRadius:4, background:color||"#00e5a0" }}/>
    </div>
  );
}
function SparkLine({ data }) {
  const max=Math.max(...data), min=Math.min(...data), w=80, h=30;
  const pts = data.map((v,i)=>((i/(data.length-1))*w)+","+(h-((v-min)/(max-min||1))*h)).join(" ");
  const lastY = h-((data[data.length-1]-min)/(max-min||1))*h;
  return (
    <svg width={w} height={h} style={{ display:"block" }}>
      <polyline points={pts} fill="none" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={w} cy={lastY} r="3" fill="#00e5a0"/>
    </svg>
  );
}
function EditableField({ value, onChange, suffix="" }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", background:"rgba(255,255,255,0.06)", borderRadius:6, border:"1px solid rgba(255,255,255,0.1)", padding:"2px 8px" }}>
      <span style={{ fontSize:11, color:"#555", marginRight:2 }}>$</span>
      <input type="number" step="0.01" value={value} onChange={e=>onChange(parseFloat(e.target.value)||0)}
        style={{ background:"transparent", border:"none", outline:"none", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, fontWeight:700, width:60, textAlign:"right" }}/>
      {suffix&&<span style={{ fontSize:11, color:"#555", marginLeft:2 }}>{suffix}</span>}
    </div>
  );
}
function ProfitPill({ pct: p }) {
  const color = p >= 25 ? "#00e5a0" : p >= 10 ? "#f5c518" : "#ff4d6d";
  return <span style={{ background:p>=25?"rgba(0,229,160,0.1)":p>=10?"rgba(245,197,24,0.1)":"rgba(255,77,109,0.1)", color, border:`1px solid ${color}33`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{fmtPct(p)}</span>;
}
function WaterfallBar({ items }) {
  const total = items[0].value;
  return (
    <div style={{ marginTop:12 }}>
      {items.map((item,i) => {
        const wp = Math.abs(item.value/total*100);
        const isDed = item.value < 0;
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <div style={{ fontSize:10, color:"#555", width:160, textAlign:"right", flexShrink:0 }}>{item.label}</div>
            <div style={{ flex:1, height:20, background:"rgba(255,255,255,0.04)", borderRadius:3, overflow:"hidden", position:"relative" }}>
              <div style={{ position:"absolute", left:0, top:0, height:"100%", borderRadius:3, width:wp+"%", background:i===0?"rgba(0,229,160,0.3)":isDed?"rgba(255,77,109,0.4)":"rgba(0,229,160,0.5)" }}/>
            </div>
            <div style={{ fontSize:11, fontWeight:700, width:80, textAlign:"right", color:isDed?"#ff4d6d":i===0?"#aaa":"#00e5a0", flexShrink:0 }}>
              {isDed?"-":""}{fmt(Math.abs(item.value))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
function ContentRatioCard({ weekRevenue, totalPieces, prevWeekRevenue, prevWeekPieces }) {
  const rpc=Math.round(weekRevenue/totalPieces), prevRpc=Math.round(prevWeekRevenue/prevWeekPieces);
  const change=parseFloat(pct(rpc,prevRpc)); const color=change>0?"#00e5a0":"#ff4d6d";
  return (
    <div style={{ background:"rgba(255,193,7,0.04)", border:"1px solid rgba(255,193,7,0.15)", borderRadius:12, padding:"18px 20px", marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#f5c518", marginBottom:8 }}>Revenue per Content Piece</div>
          <div style={{ fontSize:36, fontWeight:700, color:"#fff", marginBottom:6 }}>{fmt(rpc)}<span style={{ fontSize:14, color:"#555", marginLeft:6 }}>/ piece</span></div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ color, fontSize:12, fontWeight:700 }}>{change>0?"▲":"▼"} {Math.abs(change)}% vs last week</span>
            <span style={{ fontSize:11, color:"#555" }}>(was {fmt(prevRpc)}/piece · {prevWeekPieces} pieces)</span>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, letterSpacing:1.5, textTransform:"uppercase", color:"#444", marginBottom:6 }}>This Week Breakdown</div>
          {[["Organic (5)",fmt(Math.round(weekRevenue*0.38/5))],["Affiliate (14)",fmt(Math.round(weekRevenue*0.42/14))],["LIVEs (2)",fmt(Math.round(weekRevenue*0.12/2))],["Spark Ads (3)",fmt(Math.round(weekRevenue*0.08/3))]].map(([t,v])=>(
            <div key={t} style={{ display:"flex", justifyContent:"space-between", gap:16, marginBottom:4 }}><span style={{ fontSize:11, color:"#555" }}>{t}</span><span style={{ fontSize:11, color:"#e8e8f0", fontWeight:600 }}>{v}/ea</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

const S = {
  card:{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"18px 20px" },
  lbl: { fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#555", marginBottom:8 },
  big: { fontSize:28, fontWeight:700, color:"#fff", lineHeight:1, marginBottom:6 },
  sub: { fontSize:11, color:"#555" },
  sec: { fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#444", marginBottom:12, marginTop:8 },
  th:  { fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:"#444", fontWeight:700, padding:"0 10px 10px 0", textAlign:"left", borderBottom:"1px solid rgba(255,255,255,0.05)" },
  td:  { padding:"11px 10px 11px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", verticalAlign:"middle" },
  g3:  { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 },
  g4:  { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:16 },
};
const AC={scale:"#00e5a0",hold:"#f5c518",cut:"#ff4d6d",test:"#c77dff"};
const AL={scale:"↑ SCALE",hold:"— HOLD",cut:"✕ CUT",test:"⊕ TEST"};
const VC={scale:"#00e5a0",hold:"#f5c518",cut:"#ff4d6d"};
const CHAN_COLOR={organic:"#00e5a0",paid:"#ff6b35",affiliate:"#c77dff"};

// ─── BRAND DASHBOARD (single brand) ──────────────────────────────────────────
function BrandDashboard({ brandId, brandName, brandColor, onBack }) {
  const [tab,       setTab]       = useState("overview");
  const [projView,  setProjView]  = useState("weekly");
  const [profMode,  setProfMode]  = useState("planning");   // "planning" | "actuals"
  const [profTab,   setProfTab]   = useState("product");
  const [expandedRow, setExpanded]= useState(null);
  const [fees, setFees] = useState({ tikTokFeePct:DEFAULT_TIKTOK_FEE_PCT, affiliateComPct:DEFAULT_AFFILIATE_COM_PCT, discountPct:DEFAULT_DISCOUNT_PCT });
  const [profProducts, setProfProducts] = useState(DEFAULT_PRODUCTS_PROFIT);

  // Catalog state
  const [catalog,        setCatalog]       = useState(DEFAULT_CATALOG);
  const [allTags,        setAllTags]       = useState(DEFAULT_TAGS);
  const [catFilters,     setCatFilters]    = useState({ campaign:[], category:[], internal:[], status:[] });
  const [catSearch,      setCatSearch]     = useState("");
  const [catView,        setCatView]       = useState("catalog");  // "catalog"|"report"|"tags"
  const [reportGroup,    setReportGroup]   = useState("campaign");
  const [reportDrillTag, setReportDrillTag]= useState(null);  // tag string currently drilled into
  const [editingProd,    setEditingProd]   = useState(null);
  const [newTagInputs,   setNewTagInputs]  = useState({campaign:"",category:"",internal:""});
  const [addingTagType,  setAddingTagType] = useState(null);
  // Bulk select
  const [selectedProds,  setSelectedProds] = useState([]);        // array of product ids
  const [bulkMode,       setBulkMode]      = useState(false);
  const [bulkPanel,      setBulkPanel]     = useState(false);
  // Tag manager
  const [renamingTag,    setRenamingTag]   = useState(null);       // {type,tag}
  const [renameVal,      setRenameVal]     = useState("");

  const toggleFilter = (type, val) => setCatFilters(f => ({ ...f, [type]: f[type].includes(val) ? f[type].filter(x=>x!==val) : [...f[type],val] }));

  const filteredCatalog = catalog.filter(p => {
    const matchSearch   = !catSearch || p.name.toLowerCase().includes(catSearch.toLowerCase()) || p.sku.toLowerCase().includes(catSearch.toLowerCase());
    const matchCampaign = catFilters.campaign.length===0 || catFilters.campaign.some(t=>p.tags.campaign.includes(t));
    const matchCategory = catFilters.category.length===0 || catFilters.category.some(t=>p.tags.category.includes(t));
    const matchInternal = catFilters.internal.length===0 || catFilters.internal.some(t=>p.tags.internal.includes(t));
    const matchStatus   = catFilters.status.length===0   || catFilters.status.includes(p.status);
    return matchSearch && matchCampaign && matchCategory && matchInternal && matchStatus;
  });

  // Tag counts: how many catalog products have each tag
  const tagCounts = {};
  Object.keys(TAG_TYPES).forEach(type => {
    tagCounts[type] = {};
    allTags[type].forEach(tag => { tagCounts[type][tag] = catalog.filter(p=>p.tags[type].includes(tag)).length; });
  });

  const toggleProductTag = (prodId, type, tag) => {
    setCatalog(prev => prev.map(p => {
      if (p.id !== prodId) return p;
      const has = p.tags[type].includes(tag);
      return { ...p, tags: { ...p.tags, [type]: has ? p.tags[type].filter(t=>t!==tag) : [...p.tags[type],tag] } };
    }));
  };

  // Bulk: apply/remove tag to all selected products
  const bulkApplyTag = (type, tag) => {
    const allHave = selectedProds.every(id => catalog.find(p=>p.id===id)?.tags[type].includes(tag));
    setCatalog(prev => prev.map(p => {
      if (!selectedProds.includes(p.id)) return p;
      const has = p.tags[type].includes(tag);
      if (allHave) return { ...p, tags:{ ...p.tags, [type]: p.tags[type].filter(t=>t!==tag) } };
      if (!has)    return { ...p, tags:{ ...p.tags, [type]: [...p.tags[type],tag] } };
      return p;
    }));
  };

  const toggleSelectProd = (id) => setSelectedProds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  const selectAll = () => setSelectedProds(filteredCatalog.map(p=>p.id));
  const clearSelection = () => { setSelectedProds([]); setBulkPanel(false); };

  const addNewTag = (type) => {
    const val = newTagInputs[type].trim();
    if (!val) return;
    setAllTags(prev => ({ ...prev, [type]: prev[type].includes(val) ? prev[type] : [...prev[type],val] }));
    setNewTagInputs(prev => ({ ...prev, [type]:"" }));
    setAddingTagType(null);
  };

  // Global tag rename
  const renameTag = (type, oldTag, newTag) => {
    const trimmed = newTag.trim();
    if (!trimmed || trimmed===oldTag) { setRenamingTag(null); return; }
    setAllTags(prev => ({ ...prev, [type]: prev[type].map(t=>t===oldTag?trimmed:t) }));
    setCatalog(prev => prev.map(p => ({ ...p, tags:{ ...p.tags, [type]: p.tags[type].map(t=>t===oldTag?trimmed:t) } })));
    setRenamingTag(null);
  };

  // Global tag delete
  const deleteTag = (type, tag) => {
    setAllTags(prev => ({ ...prev, [type]: prev[type].filter(t=>t!==tag) }));
    setCatalog(prev => prev.map(p => ({ ...p, tags:{ ...p.tags, [type]: p.tags[type].filter(t=>t!==tag) } })));
    setCatFilters(f => ({ ...f, [type]: f[type].filter(t=>t!==tag) }));
  };

  const updateCatalogField = (id, field, val) => setCatalog(prev => prev.map(p => p.id===id ? { ...p, [field]:val } : p));

  // Report: group products by tag type and aggregate
  const buildReport = (groupType) => {
    return allTags[groupType].map(tag => {
      const prods = catalog.filter(p => p.tags[groupType].includes(tag));
      if (!prods.length) return null;
      const totRev   = prods.reduce((s,p)=>s+p.revenue,0);
      const totUnits = prods.reduce((s,p)=>s+p.units,0);
      const totEMV   = prods.reduce((s,p)=>s+p.emv,0);
      const avgROAS  = r2(prods.reduce((s,p)=>s+p.roas,0)/prods.length);
      const avgMargin= r2(prods.reduce((s,p)=>s+p.margin,0)/prods.length);
      const avgDisc  = r2(prods.reduce((s,p)=>s+(p.retailPrice>0?((p.retailPrice-p.discountedPrice)/p.retailPrice*100):0),0)/prods.length);
      return { tag, prods, totRev, totUnits, totEMV, avgROAS, avgMargin, avgDisc };
    }).filter(Boolean).filter(r=>r.totRev>0||r.totUnits>0);
  };

  // Actuals state
  const [orders,      setOrders]    = useState(MOCK_ORDERS);
  const [csvText,     setCsvText]   = useState("");
  const [csvError,    setCsvError]  = useState("");
  const [showImport,  setShowImport]= useState(false);
  const [actTab,      setActTab]    = useState("product"); // "product"|"channel"|"orders"
  const fileRef = useRef();

  const d  = mockData;
  const w  = d.weekly;
  const p  = d.projections;
  const cs = d.contentStats;

  const updateProd = (i, field, val) => setProfProducts(prev => prev.map((p,j)=>j===i?{...p,[field]:val}:p));

  // Planning calcs
  const profRows = profProducts.map(prod => {
    const daily = d.products.find(p=>p.name===prod.name);
    const units = daily?.units||0;
    const unit  = calcUnitProfit(prod, fees);
    const totalGross   = r2(unit.grossProfit * units);
    const netProfit    = r2(totalGross - prod.adSpend);
    const netMarginPct = r2(daily?(netProfit/daily.revenue)*100:0);
    return { prod, daily, units, unit, totalGross, netProfit, netMarginPct };
  });
  const totRev      = profRows.reduce((s,r)=>s+(r.daily?.revenue||0),0);
  const totAdSpend  = profRows.reduce((s,r)=>s+r.prod.adSpend,0);
  const totNet      = profRows.reduce((s,r)=>s+r.netProfit,0);
  const totCOGS     = profRows.reduce((s,r)=>s+r.unit.cogs*(r.units||0),0);  // note: unit.cogs is from prod
  const totShip     = profRows.reduce((s,r)=>s+(r.prod.shipping*(r.units||0)),0);
  const totFees     = profRows.reduce((s,r)=>s+r.unit.tikTokFee*(r.units||0),0);
  const totAff      = profRows.reduce((s,r)=>s+r.unit.affiliateCom*(r.units||0),0);
  const totDisc     = profRows.reduce((s,r)=>s+r.unit.discountAmt*(r.units||0),0);
  const overallMarg = totRev>0?r2((totNet/totRev)*100):0;

  // Actuals calcs
  const actProductRows = rollUpByProduct(orders);
  const actChannelRows = rollUpByChannel(orders);
  const actTotRev      = orders.reduce((s,o)=>s+o.salePrice,0);
  const actTotFees     = orders.reduce((s,o)=>s+o.tikTokFee,0);
  const actTotAff      = orders.reduce((s,o)=>s+o.affiliateCom,0);
  const actTotDisc     = orders.reduce((s,o)=>s+o.discount,0);
  const actTotShip     = orders.reduce((s,o)=>s+o.shipping,0);
  const actTotCOGS     = orders.reduce((s,o)=>s+o.cogs,0);
  const actTotNet      = actTotRev - actTotFees - actTotAff - actTotDisc - actTotShip - actTotCOGS;
  const actMarg        = actTotRev>0?r2((actTotNet/actTotRev)*100):0;

  const handleCSVImport = () => {
    setCsvError("");
    const parsed = parseCSV(csvText);
    if (!parsed.length) { setCsvError("No valid rows found. Check your CSV format matches the template below."); return; }
    setOrders(parsed);
    setShowImport(false);
    setCsvText("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvText(ev.target.result);
    reader.readAsText(file);
  };

  const loadMockData = () => { setOrders(MOCK_ORDERS); setShowImport(false); };

  // ── Data Import ────────────────────────────────────────────────────────────
  const [importText,    setImportText]   = useState("");
  const [importError,   setImportError]  = useState("");
  const [importPreview, setImportPreview]= useState(null);
  const [importSuccess, setImportSuccess]= useState(false);
  const [importHistory, setImportHistory]= useState([]);
  const [colMap,        setColMap]       = useState({});
  const importFileRef = useRef();

  const FIELD_ALIASES = {
    name:           ["product name","product","name","item","sku name","product title"],
    sku:            ["sku","item id","product id","variant","sku code"],
    retailPrice:    ["retail price","retail","list price","original price","mrp","full price"],
    discountedPrice:["discounted price","sale price","selling price","current price","active price","tiktok price"],
    units:          ["units sold","units","qty sold","quantity sold","orders","sold"],
    revenue:        ["revenue","total revenue","gmv","gross revenue","sales","total sales","net revenue"],
    adSpend:        ["ad spend","spend","total spend","ads spend","paid spend","advertising spend"],
    roas:           ["roas","return on ad spend","return on ads"],
    margin:         ["margin","profit margin","net margin","margin %","margin pct"],
    vcr:            ["vcr","vcr %","video click rate","video-to-click","v2c","click rate"],
    cogs:           ["cogs","cost of goods","cost","unit cost","product cost"],
    emv:            ["emv","earned media value","media value"],
    repeatRate:     ["repeat rate","repeat purchase","repurchase","retention rate","repeat %"],
  };

  const autoDetectCols = (headers) => {
    const map = {};
    const norm = h => h.toLowerCase().trim().replace(/[^a-z0-9\s%]/g,"");
    headers.forEach((h,i) => {
      const hn = norm(h);
      Object.entries(FIELD_ALIASES).forEach(([field,aliases]) => {
        if (!map[field] && aliases.some(a => hn.includes(a) || a.includes(hn))) map[field] = i;
      });
    });
    return map;
  };
  // Parse ads creative export (creative_data_for_product_campaigns)
  const parseAdsCreative = (text) => {
    const lines = text.trim().split("\n").filter(l=>l.trim());
    if (lines.length<2) return { error:"Need header row + data rows." };
    const delim = lines[0].includes("\t")?"\t":",";
    const rawHeaders = lines[0].split(delim).map(h=>h.trim().replace(/^"|"$/g,""));
    const h = rawHeaders.map(x=>x.toLowerCase());
    const fi = (aliases) => h.findIndex(c=>aliases.some(a=>c.includes(a)));
    const COL = {
      campaignName: fi(["campaign name"]),
      productId:    fi(["product id"]),
      creativeType: fi(["creative type"]),
      videoTitle:   fi(["video title"]),
      tiktokAccount:fi(["tiktok account"]),
      timePosted:   fi(["time posted"]),
      cost:         fi(["cost"]),
      skuOrders:    fi(["sku orders"]),
      costPerOrder: fi(["cost per order"]),
      grossRevenue: fi(["gross revenue"]),
      roi:          fi(["roi"]),
      impressions:  fi(["product ad impressions"]),
      clicks:       fi(["product ad clicks"]),
      ctr:          fi(["product ad click rate"]),
      cvr:          fi(["ad conversion rate"]),
      vcr100:       fi(["100% ad video view rate"]),
      vcr25:        fi(["25% ad video view rate"]),
    };
    const g = (cols,k) => COL[k]>=0?String(cols[COL[k]]||"").trim().replace(/^"|"$/g,""):"";
    const n = (cols,k) => parseFloat(g(cols,k).replace(/[$,%\s]/g,""))||0;
    const rows = lines.slice(1).map((line,idx)=>{
      const cols = line.split(delim).map(c=>c.trim().replace(/^"|"$/g,""));
      const name = g(cols,"videoTitle")||g(cols,"campaignName"); if (!name) return null;
      return {
        id: "cr_"+idx, name,
        campaignName: g(cols,"campaignName"),
        creativeType: g(cols,"creativeType"),
        account:      g(cols,"tiktokAccount"),
        posted:       g(cols,"timePosted"),
        spend:        n(cols,"cost"),
        orders:       n(cols,"skuOrders"),
        revenue:      n(cols,"grossRevenue"),
        roas:         n(cols,"roi"),
        impressions:  n(cols,"impressions"),
        clicks:       n(cols,"clicks"),
        ctr:          n(cols,"ctr"),
        cvr:          n(cols,"cvr"),
        vcr:          n(cols,"vcr100"),
        type:         "spark",
      };
    }).filter(Boolean);
    return { rows, type:"ads_creative", count:rows.length };
  };

  // Parse campaign report (Heritage_Store-Campaign_Report)
  const parseAdsCampaign = (text) => {
    const lines = text.trim().split("\n").filter(l=>l.trim());
    if (lines.length<2) return { error:"Need header row + data rows." };
    const delim = lines[0].includes("\t")?"\t":",";
    const rawHeaders = lines[0].split(delim).map(h=>h.trim().replace(/^"|"$/g,""));
    const h = rawHeaders.map(x=>x.toLowerCase());
    const fi = (aliases) => h.findIndex(c=>aliases.some(a=>c.includes(a)));
    const COL = {
      name:        fi(["campaign name"]),
      status:      fi(["primary status"]),
      budget:      fi(["campaign budget"]),
      cost:        fi(["cost"]),
      cpc:         fi(["cpc"]),
      cpm:         fi(["cpm"]),
      impressions: fi(["impressions"]),
      clicks:      fi(["clicks"]),
      ctr:         fi(["ctr"]),
      conversions: fi(["conversions"]),
      cvr:         fi(["conversion rate","cvr"]),
      cpa:         fi(["cost per conversion"]),
    };
    const g = (cols,k) => COL[k]>=0?String(cols[COL[k]]||"").trim().replace(/^"|"$/g,""):"";
    const n = (cols,k) => parseFloat(g(cols,k).replace(/[$,%\s]/g,""))||0;
    const rows = lines.slice(1).map((line,idx)=>{
      const cols = line.split(delim).map(c=>c.trim().replace(/^"|"$/g,""));
      const name = g(cols,"name"); if (!name) return null;
      return {
        id:"camp_"+idx, name,
        spend:       n(cols,"cost"),
        revenue:     0,  // campaign reports don't always have attributed revenue
        roas:        0,
        impressions: n(cols,"impressions"),
        clicks:      n(cols,"clicks"),
        ctr:         n(cols,"ctr"),
        cpm:         n(cols,"cpm"),
        cpc:         n(cols,"cpc"),
        conversions: n(cols,"conversions"),
        cvr:         n(cols,"cvr"),
        videoViews:  0,
        vcr:         0,
        type:        "infeed",
      };
    }).filter(Boolean);
    return { rows, type:"ads_campaign", count:rows.length };
  };

  // Parse GMV Max / product campaign data
  const parseAdsGMVMax = (text) => {
    const lines = text.trim().split("\n").filter(l=>l.trim());
    if (lines.length<2) return { error:"Need header row + data rows." };
    const delim = lines[0].includes("\t")?"\t":",";
    const rawHeaders = lines[0].split(delim).map(h=>h.trim().replace(/^"|"$/g,""));
    const h = rawHeaders.map(x=>x.toLowerCase());
    const fi = (aliases) => h.findIndex(c=>aliases.some(a=>c.includes(a)));
    const COL = {
      name:        fi(["campaign name"]),
      id:          fi(["campaign id"]),
      cost:        fi(["cost"]),
      netCost:     fi(["net cost"]),
      skuOrders:   fi(["sku orders"]),
      costPerOrder:fi(["cost per order"]),
      grossRevenue:fi(["gross revenue"]),
      roi:         fi(["roi"]),
    };
    const g = (cols,k) => COL[k]>=0?String(cols[COL[k]]||"").trim().replace(/^"|"$/g,""):"";
    const n = (cols,k) => parseFloat(g(cols,k).replace(/[$,%\s]/g,""))||0;
    const rows = lines.slice(1).map((line,idx)=>{
      const cols = line.split(delim).map(c=>c.trim().replace(/^"|"$/g,""));
      const name = g(cols,"name")||g(cols,"id"); if (!name) return null;
      return {
        id:"gmv_"+idx, name,
        spend:       n(cols,"cost"),
        revenue:     n(cols,"grossRevenue"),
        roas:        n(cols,"roi"),
        orders:      n(cols,"skuOrders"),
        cpa:         n(cols,"costPerOrder"),
        impressions:0, clicks:0, ctr:0, cpm:0, cpc:0, conversions:0, cvr:0, videoViews:0, vcr:0,
        type:        "gmvmax",
      };
    }).filter(Boolean);
    return { rows, type:"ads_gmvmax", count:rows.length };
  };

  // Master file parser — detects type and routes
  const parseFile = (text, filename="") => {
    const lines = text.trim().split("\n").filter(l=>l.trim());
    if (lines.length<2) return { error:"File appears empty or has only one row.", type:"unknown", rows:[] };
    const delim = lines[0].includes("\t")?"\t":",";
    const headers = lines[0].split(delim).map(h=>h.trim().replace(/^"|"$/g,""));
    const dataRows = lines.slice(1).map(l=>l.split(delim).map(c=>c.trim().replace(/^"|"$/g,"")));
    const fileType = detectFileType(headers);
    const result = parseFileByType(fileType, headers, dataRows);
    return { ...result, count: result.rows?.length||0 };
  };

  const FILE_TYPE_META = {
    tiktok_orders:  { label:"TikTok Orders",         color:"#00e5a0", bg:"rgba(0,229,160,0.08)",   dest:"Profitability & Orders" },
    shopify_orders: { label:"Shopify Orders",         color:"#ff6b35", bg:"rgba(255,107,53,0.08)",  dest:"Profitability & Reconciliation" },
    ads_creative:   { label:"Ads — Creative Data",   color:"#c77dff", bg:"rgba(199,125,255,0.08)", dest:"Ads tab" },
    ads_campaign:   { label:"Ads — Campaign Report", color:"#c77dff", bg:"rgba(199,125,255,0.08)", dest:"Ads tab" },
    ads_gmvmax:     { label:"Ads — GMV Max",         color:"#c77dff", bg:"rgba(199,125,255,0.08)", dest:"Ads tab" },
    inventory:      { label:"Inventory",             color:"#f5c518", bg:"rgba(245,197,24,0.08)",  dest:"Inventory tab" },
    performance:    { label:"Sales & Performance",   color:"#00e5a0", bg:"rgba(0,229,160,0.08)",   dest:"Products & Overview" },
    unknown:        { label:"Unknown",               color:"#ff4d6d", bg:"rgba(255,77,109,0.08)",  dest:"Could not detect" },
  };

  // Batch file state
  const [batchFiles,    setBatchFiles]    = useState([]);   // [{name, type, result, committed}]
  const [batchError,    setBatchError]    = useState("");
  const [batchDone,     setBatchDone]     = useState(false);
  const [reconResult,   setReconResult]   = useState(null); // reconciled orders
  const batchDropRef = useRef();

  const processBatchFiles = (fileList) => {
    setBatchError(""); setBatchDone(false);
    const results = [];
    let pending = fileList.length;
    Array.from(fileList).forEach(file=>{
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const result = parseFile(text, file.name);
        results.push({ name:file.name, result, committed:false });
        pending--;
        if (pending===0) {
          // Sort: tiktok_orders + shopify_orders first for reconciliation
          results.sort((a,b)=>{ const order={tiktok_orders:0,shopify_orders:1,ads_creative:2,ads_campaign:3,ads_gmvmax:4,inventory:5,performance:6}; return (order[a.result.type]||9)-(order[b.result.type]||9); });
          // Auto-reconcile if both order types present
          const ttRows = results.find(r=>r.result.type==="tiktok_orders");
          const shopRows = results.find(r=>r.result.type==="shopify_orders");
          if (ttRows&&shopRows&&!ttRows.result.error&&!shopRows.result.error) {
            const reconciled = reconcileOrders(ttRows.result.rows, shopRows.result.rows);
            setReconResult({ rows:reconciled, matchCount:reconciled.filter(r=>r.matched).length, total:reconciled.length });
          }
          setBatchFiles([...results]);
        }
      };
      reader.readAsText(file);
    });
  };

  const commitBatchFile = (idx) => {
    const item = batchFiles[idx];
    if (!item||item.result.error) return;
    const { type, rows } = item.result;

    if (type==="tiktok_orders"||type==="shopify_orders") {
      // Use reconciled result if available
      const finalRows = reconResult?.rows || rows;
      setOrders(prev=>{
        const u=[...prev];
        finalRows.forEach(r=>{ const i=u.findIndex(o=>o.orderId===r.tiktokOrderId||o.orderId===r.shopifyOrderId); if(i>=0) u[i]={...u[i],...r}; else u.push({orderId:r.tiktokOrderId||r.shopifyOrderId, product:r.productName||"Unknown", salePrice:r.salePrice||r.orderAmount||0, tikTokFee:0, affiliateCom:0, discount:Math.abs(r.platformDisc||0)+Math.abs(r.sellerDisc||0), shipping:r.shipping||0, channel:r.channel||"tiktok", cogs:0, ...r}); });
        return u;
      });
      setImportHistory(prev=>[{date:new Date().toLocaleString(),rowCount:rows.length,source:item.name},...prev.slice(0,19)]);
    } else if (type==="ads_creative"||type==="ads_campaign"||type==="ads_gmvmax") {
      setAdsData(prev=>[...prev.filter(a=>a.type!==rows[0]?.type),...rows]);
    } else if (type==="inventory") {
      setInvSettings(prev=>{ const u=[...prev]; rows.forEach(row=>{ const i=u.findIndex(s=>s.name.toLowerCase()===row.name.toLowerCase()); if(i>=0) u[i]={...u[i],unitsOnHand:row.units,incoming:row.incoming}; }); return u; });
    } else {
      setCatalog(prev=>{ const u=[...prev]; rows.forEach(imp=>{ const i=u.findIndex(p=>p.name.toLowerCase()===imp.name.toLowerCase()); if(i>=0) u[i]={...u[i],...imp,tags:u[i].tags,status:u[i].status,id:u[i].id}; else u.push(imp); }); return u; });
      setImportHistory(prev=>[{date:new Date().toLocaleString(),rowCount:rows.length,source:item.name},...prev.slice(0,19)]);
    }
    setBatchFiles(prev=>prev.map((f,i)=>i===idx?{...f,committed:true}:f));
  };

  const commitAllBatch = () => {
    batchFiles.forEach((_,idx)=>commitBatchFile(idx));
    setBatchDone(true);
  };

  const parseTSV = (text) => {
    const lines = text.trim().split("\n").filter(l=>l.trim());
    if (lines.length < 2) return { error:"Need at least a header row and one data row." };
    const delim = lines[0].includes("\t") ? "\t" : ",";
    const headers = lines[0].split(delim).map(h=>h.trim().replace(/^"|"$/g,""));
    const map = autoDetectCols(headers);
    if (!map.name) return { error:`Could not find a product name column. Headers found: ${headers.join(", ")}` };
    const n = (cols,field) => { const v = map[field]!==undefined ? cols[map[field]] : ""; return parseFloat(String(v).replace(/[$,%\s]/g,"")) || 0; };
    const s = (cols,field) => map[field]!==undefined ? String(cols[map[field]]||"").trim().replace(/^"|"$/g,"") : "";
    const rows = lines.slice(1).map((line,idx) => {
      const cols = line.split(delim).map(c=>c.trim().replace(/^"|"$/g,""));
      const name = s(cols,"name");
      if (!name) return null;
      return {
        id: "imp_"+(idx+1), name,
        sku:            s(cols,"sku") || name.toUpperCase().replace(/\s+/g,"-").slice(0,12),
        retailPrice:    n(cols,"retailPrice"),
        discountedPrice:n(cols,"discountedPrice") || n(cols,"retailPrice"),
        cogs:           n(cols,"cogs"),
        units:          n(cols,"units"),
        revenue:        n(cols,"revenue"),
        adSpend:        n(cols,"adSpend"),
        roas:           n(cols,"roas"),
        margin:         n(cols,"margin"),
        vcr:            n(cols,"vcr"),
        emv:            n(cols,"emv"),
        repeatRate:     n(cols,"repeatRate"),
        trend:          "flat", status:"active",
        tags:{ campaign:[], category:[], internal:[] },
      };
    }).filter(Boolean);
    return { headers, map, rows };
  };

  const handleImportPreview = () => {
    setImportError(""); setImportSuccess(false);
    if (!importText.trim()) { setImportError("Paste your Google Sheet data first."); return; }
    const result = parseTSV(importText);
    if (result.error) { setImportError(result.error); return; }
    setImportPreview(result);
    setColMap(result.map);
  };

  const handleImportCommit = () => {
    if (!importPreview) return;
    const rows = importPreview.rows;
    setCatalog(prev => {
      const updated = [...prev];
      rows.forEach(imp => {
        const idx = updated.findIndex(p=>p.name.toLowerCase()===imp.name.toLowerCase());
        if (idx>=0) updated[idx] = { ...updated[idx], ...imp, tags:updated[idx].tags, status:updated[idx].status, id:updated[idx].id };
        else updated.push(imp);
      });
      return updated;
    });
    setProfProducts(prev => {
      const updated = [...prev];
      rows.forEach(imp => {
        const idx = updated.findIndex(p=>p.name.toLowerCase()===imp.name.toLowerCase());
        if (idx>=0) updated[idx] = { ...updated[idx], salePrice:imp.discountedPrice||imp.retailPrice||updated[idx].salePrice, cogs:imp.cogs||updated[idx].cogs, adSpend:imp.adSpend||updated[idx].adSpend };
        else updated.push({ name:imp.name, salePrice:imp.discountedPrice||imp.retailPrice||0, cogs:imp.cogs||0, shipping:0, adSpend:imp.adSpend||0, adType:"GMV Max" });
      });
      return updated;
    });
    setImportHistory(prev=>[{ date:new Date().toLocaleString(), rowCount:rows.length }, ...prev.slice(0,9)]);
    setImportSuccess(true);
    setImportPreview(null);
    setImportText("");
  };

  // ── Multi-source import state ──────────────────────────────────────────────
  const [srcText,      setSrcText]      = useState({});
  const [srcPreview,   setSrcPreview]   = useState({});
  const [srcError,     setSrcError]     = useState({});
  const [srcDone,      setSrcDone]      = useState({});
  const [activeSource, setActiveSource] = useState("performance");
  const multiFileRef = useRef();
  // Parse any file given headers + data rows
  const parseFileByType = (type, headers, dataRows) => {
    const h = headers.map(x=>String(x||"").toLowerCase().trim());
    const col = (name) => h.findIndex(c=>c.includes(name));
    const g = (r,name) => { const i=col(name); return i>=0?String(r[i]||"").trim():""; };
    const n = (r,name) => { const i=col(name); return i>=0?parseFloat(String(r[i]||"").replace(/[$,%\s]/g,""))||0:0; };

    if (type==="tiktok_orders") return { type, rows: parseTikTokOrders(dataRows, headers) };
    if (type==="shopify_orders") return { type, rows: parseShopifyOrders(dataRows, headers) };

    if (type==="ads_creative") {
      const rows = dataRows.map(r=>({
        name:        g(r,"campaign name")||g(r,"video title"),
        type:        "spark",
        spend:       n(r,"cost"),
        revenue:     n(r,"gross revenue"),
        roas:        n(r,"roi"),
        orders:      n(r,"sku orders"),
        impressions: n(r,"product ad impressions"),
        clicks:      n(r,"product ad clicks"),
        ctr:         n(r,"product ad click rate"),
        cvr:         n(r,"ad conversion rate"),
        vcr:         n(r,"100% ad video view rate"),
        videoTitle:  g(r,"video title"),
        productId:   g(r,"product id"),
      })).filter(r=>r.name);
      return { type:"ads", rows };
    }

    if (type==="ads_campaign") {
      const rows = dataRows.map(r=>({
        name:        g(r,"campaign name"),
        type:        "infeed",
        spend:       n(r,"cost"),
        revenue:     0,
        roas:        0,
        impressions: n(r,"impressions"),
        clicks:      n(r,"clicks"),
        ctr:         n(r,"ctr"),
        cpm:         n(r,"cpm"),
        cpc:         n(r,"cpc"),
        conversions: n(r,"conversions"),
        cvr:         n(r,"conversion rate"),
      })).filter(r=>r.name);
      return { type:"ads", rows };
    }

    if (type==="ads_gmvmax") {
      const rows = dataRows.map(r=>({
        name:    g(r,"campaign name"),
        type:    "gmvmax",
        spend:   n(r,"cost"),
        revenue: n(r,"gross revenue"),
        roas:    n(r,"roi"),
        orders:  n(r,"sku orders"),
        netCost: n(r,"net cost"),
      })).filter(r=>r.name);
      return { type:"ads", rows };
    }

    if (type==="profitability") {
      const rows = dataRows.map(r=>({
        orderId:          g(r,"order id"),
        sku:              g(r,"sku id"),
        subtotal:         n(r,"sku subtotal before discount"),
        platformDiscount: n(r,"sku platform discount"),
        sellerDiscount:   n(r,"sku seller discount"),
        finalAmount:      n(r,"sku subtotal after discount"),
        shipping:         n(r,"shipping fee after discount"),
        taxes:            n(r,"taxes"),
        orderAmount:      n(r,"order amount"),
      })).filter(r=>r.orderId);
      return { type:"profitability", rows };
    }

    if (type==="inventory") {
      const result = parseInvPaste(dataRows.map(r=>r.join("\t")).join("\n"));
      return { type:"inventory", rows: result.rows||[] };
    }

    // Default: try generic TSV parser
    const text = [headers.join("\t"), ...dataRows.map(r=>r.join("\t"))].join("\n");
    const result = parseTSV(text);
    return { type: result.error?"unknown":"catalog", rows: result.rows||[], headers, map: result.map };
  };

  // ── File type detection based on real TikTok/Shopify export column signatures ──
  const detectFileType = (headers) => {
    const h = headers.map(x=>String(x||"").toLowerCase().trim());
    const has = (...terms) => terms.every(t=>h.some(c=>c.includes(t)));
    const hasAny = (...terms) => terms.some(t=>h.some(c=>c.includes(t)));

    // TikTok order export (All_order CSV) — most specific first
    if (has("order id") && has("sku subtotal before discount") && has("fulfillment type"))
      return "tiktok_orders";
    // Shopify order export
    if (has("lineitem name") && has("financial status") && hasAny("billing name","billing address1"))
      return "shopify_orders";
    // Merchant P&L / Order payment info sheet
    if (has("order id") && has("sku platform discount") && has("sku seller discount") && !has("fulfillment type"))
      return "tiktok_orders";
    // Creative / Video ad performance (has video title column)
    if (has("video title") || has("creative type"))
      return "ads_creative";
    // Campaign report (standard — has CPC or CPM but no video title)
    if (has("campaign name") && (has("cpc") || has("cpm")) && has("impressions"))
      return "ads_campaign";
    // GMV Max / Product campaign (has roi + sku orders + net cost)
    if (has("campaign") && has("roi") && (has("sku orders") || has("gross revenue")))
      return "ads_gmvmax";
    // Inventory
    if (has("units on hand") || has("available stock") || has("stock quantity"))
      return "inventory";
    // Catalog batch edit
    if (has("product name") && has("seller sku") && hasAny("product status","listing status"))
      return "catalog";
    // Pricing
    if (has("retail price") || (has("sale price") && has("cogs")))
      return "pricing";
    // Competitors
    if (has("brand") && has("followers") && hasAny("commission","affiliate"))
      return "competitors";
    // Fallback: try sales/performance
    if (hasAny("revenue","gmv","gross revenue") && hasAny("product name","product"))
      return "performance";
    return "unknown";
  };

  // ── Parse TikTok order export (All_order CSV) ──
  const parseTikTokOrders = (rows, headers) => {
    const h = headers.map(x=>String(x||"").toLowerCase().trim());
    const ci = (terms) => { for(const t of terms){ const i=h.findIndex(c=>c.includes(t)); if(i>=0) return i; } return -1; };
    const COL = {
      orderId:    ci(["order id"]),
      product:    ci(["product name"]),
      sku:        ci(["seller sku","sku id"]),
      status:     ci(["order status"]),
      qty:        ci(["quantity"]),
      unitPrice:  ci(["sku unit original price"]),
      subtotal:   ci(["sku subtotal after discount","sku subtotal before discount"]),
      platformDisc: ci(["sku platform discount"]),
      sellerDisc: ci(["sku seller discount"]),
      shipping:   ci(["shipping fee after discount"]),
      taxes:      ci(["taxes"]),
      orderAmt:   ci(["order amount"]),
      created:    ci(["created time"]),
      fulfillment:ci(["fulfillment type"]),
      category:   ci(["product category"]),
    };
    return rows.filter(r=>r[COL.orderId]).map(r=>{
      const g = (k) => COL[k]>=0 ? String(r[COL[k]]||"").trim() : "";
      const n = (k) => parseFloat(g(k).replace(/[$,%\s]/g,""))||0;
      return {
        tiktokOrderId: g("orderId"),
        product:       g("product").replace(/\s*\(.*?\)\s*/g,"").trim().slice(0,60),
        sku:           g("sku"),
        status:        g("status"),
        qty:           n("qty")||1,
        unitPrice:     n("unitPrice"),
        subtotal:      n("subtotal"),
        platformDisc:  Math.abs(n("platformDisc")),
        sellerDisc:    Math.abs(n("sellerDisc")),
        shipping:      n("shipping"),
        taxes:         n("taxes"),
        orderAmount:   n("orderAmt"),
        date:          g("created").split("\\t")[0].trim(),
        fulfillment:   g("fulfillment"),
        category:      g("category"),
        channel:       "tiktok",
        source:        "tiktok_export",
      };
    });
  };

  // ── Parse Shopify order export ──
  const parseShopifyOrders = (rows, headers) => {
    const h = headers.map(x=>String(x||"").toLowerCase().trim());
    const ci = (terms) => { for(const t of terms){ const i=h.findIndex(c=>c.includes(t)); if(i>=0) return i; } return -1; };
    const COL = {
      name:       ci(["name"]),
      status:     ci(["financial status"]),
      product:    ci(["lineitem name"]),
      price:      ci(["lineitem price"]),
      qty:        ci(["lineitem quantity"]),
      sku:        ci(["lineitem sku"]),
      subtotal:   ci(["subtotal"]),
      total:      ci(["total"]),
      discount:   ci(["discount amount"]),
      shipping:   ci(["shipping"]),
      taxes:      ci(["taxes"]),
      tags:       ci(["tags"]),
      created:    ci(["created at"]),
      vendor:     ci(["vendor"]),
    };
    const g = (r,k) => COL[k]>=0 ? String(r[COL[k]]||"").trim() : "";
    const n = (r,k) => parseFloat(g(r,k).replace(/[$,%\s]/g,""))||0;
    // Extract TikTok order ID from Tags column
    const extractTikTokId = (tags) => {
      const m = String(tags||"").match(/TikTokOrderID:(\d+)/);
      return m ? m[1] : null;
    };
    return rows.filter(r=>g(r,"name")).map(r=>({
      shopifyOrderId: g(r,"name"),
      tiktokOrderId:  extractTikTokId(g(r,"tags")),
      product:        g(r,"product"),
      sku:            g(r,"sku"),
      qty:            n(r,"qty")||1,
      lineItemPrice:  n(r,"price"),
      subtotal:       n(r,"subtotal"),
      total:          n(r,"total"),
      discount:       n(r,"discount"),
      shipping:       n(r,"shipping"),
      taxes:          n(r,"taxes"),
      status:         g(r,"status"),
      date:           g(r,"created"),
      vendor:         g(r,"vendor"),
      source:         "shopify_export",
    }));
  };

  // ── Parse TikTok ads exports (all three formats) ──
  const parseTikTokAds = (rows, headers, adType) => {
    const h = headers.map(x=>String(x||"").toLowerCase().trim());
    const ci = (terms) => { for(const t of terms){ const i=h.findIndex(c=>c.includes(t)); if(i>=0) return i; } return -1; };
    const COL = {
      name:        ci(["campaign name","video title"]),
      campaignId:  ci(["campaign id"]),
      product:     ci(["product id","product name"]),
      cost:        ci(["cost","net cost"]),
      revenue:     ci(["gross revenue","revenue"]),
      roi:         ci(["roi"]),
      orders:      ci(["sku orders","conversions","results"]),
      impressions: ci(["impressions","product ad impressions"]),
      clicks:      ci(["clicks (destination)","clicks","product ad clicks"]),
      ctr:         ci(["ctr (destination)","ctr","product ad click rate"]),
      cpm:         ci(["cpm"]),
      cpc:         ci(["cpc (destination)","cpc","cost per order"]),
      cvr:         ci(["conversion rate (cvr)","ad conversion rate","cvr","result rate"]),
      vcr:         ci(["100% ad video view rate","75% ad video view rate","6-second ad video view rate"]),
      videoViews:  ci(["2-second ad video view rate","product ad impressions"]),
      creativeType:ci(["creative type"]),
      videoTitle:  ci(["video title"]),
      tiktokAcct:  ci(["tiktok account"]),
      status:      ci(["primary status","status"]),
    };
    const g = (r,k) => COL[k]>=0 ? String(r[COL[k]]||"").trim() : "";
    const n = (r,k) => parseFloat(g(r,k).replace(/[$,%\s]/g,""))||0;
    // Determine type from format
    const inferType = (name) => {
      const nl = String(name||"").toLowerCase();
      if (nl.includes("gmv")) return "gmvmax";
      if (nl.includes("spark")) return "spark";
      if (nl.includes("live")) return "live";
      return adType==="ads_creative"?"spark":adType==="ads_campaign"?"infeed":"gmvmax";
    };
    return rows.filter(r=>g(r,"name")).map(r=>({
      name:        g(r,"name"),
      campaignId:  g(r,"campaignId"),
      product:     g(r,"product"),
      type:        inferType(g(r,"name")),
      spend:       n(r,"cost"),
      revenue:     n(r,"revenue"),
      roas:        n(r,"roi")||r2(n(r,"revenue")/(n(r,"cost")||1)),
      orders:      n(r,"orders"),
      impressions: n(r,"impressions"),
      clicks:      n(r,"clicks"),
      ctr:         n(r,"ctr"),
      cpm:         n(r,"cpm"),
      cpc:         n(r,"cpc"),
      cvr:         n(r,"cvr"),
      vcr:         n(r,"vcr"),
      creativeType:g(r,"creativeType"),
      videoTitle:  g(r,"videoTitle"),
      tiktokAcct:  g(r,"tiktokAcct"),
      status:      g(r,"status"),
      source:      adType,
    }));
  };

  // ── Master file auto-detector and router ──
  const autoDetectAndParse = (text, filename="") => {
    const lines = text.trim().split("\n").filter(l=>l.trim());
    if (lines.length < 2) return { error:"Need at least a header row and one data row." };
    const delim = lines[0].includes("\t") ? "\t" : ",";
    const rawHeaders = lines[0].split(delim).map(h=>h.trim().replace(/^"|"$/g,""));
    const dataLines  = lines.slice(1);
    const dataRows   = dataLines.map(l=>l.split(delim).map(c=>c.trim().replace(/^"|"$/g,"")));
    const fileType   = detectFileType(rawHeaders);
    const h          = rawHeaders;

    if (fileType==="tiktok_orders") {
      const rows = parseTikTokOrders(dataRows, h);
      return { type:"tiktok_orders", fileType, rows, count:rows.length,
        label:"TikTok Orders", color:"#00e5a0",
        preview: rows.slice(0,5).map(r=>({ "Order ID":r.tiktokOrderId, "Product":r.product, "Amount":"$"+r.orderAmount, "Status":r.status, "Date":r.date })) };
    }
    if (fileType==="shopify_orders") {
      const rows = parseShopifyOrders(dataRows, h);
      const linked = rows.filter(r=>r.tiktokOrderId).length;
      return { type:"shopify_orders", fileType, rows, count:rows.length,
        label:"Shopify Orders", color:"#ff6b35",
        note: `${linked} of ${rows.length} orders have a TikTok Order ID — these will be reconciled automatically.`,
        preview: rows.slice(0,5).map(r=>({ "Shopify #":r.shopifyOrderId, "TikTok ID":r.tiktokOrderId||"—", "Product":r.product, "Total":"$"+r.total, "Status":r.status })) };
    }
    if (fileType==="ads_creative"||fileType==="ads_campaign"||fileType==="ads_gmvmax") {
      const rows = parseTikTokAds(dataRows, h, fileType);
      return { type:"ads", fileType, rows, count:rows.length,
        label: fileType==="ads_creative"?"Creative Ad Performance":fileType==="ads_campaign"?"Campaign Report":"GMV Max / Product Campaigns",
        color:"#c77dff",
        preview: rows.slice(0,5).map(r=>({ "Campaign":r.name.slice(0,40), "Spend":"$"+r.spend, "Revenue":"$"+r.revenue, "ROAS":r.roas+"x", "Orders":r.orders })) };
    }
    if (fileType==="inventory") {
      const result = parseInvPaste(text);
      return { type:"inventory", fileType, rows:result.rows||[], count:(result.rows||[]).length,
        label:"Inventory", color:"#f5c518",
        preview: (result.rows||[]).slice(0,5).map(r=>({ "Product":r.name, "Units on Hand":r.units })) };
    }
    if (fileType==="catalog") {
      const result = parseTSV(text);
      return { type:"catalog", fileType, rows:result.rows||[], count:(result.rows||[]).length,
        label:"Product Catalog", color:"#00e5a0",
        preview: (result.rows||[]).slice(0,5).map(r=>({ "Product":r.name, "SKU":r.sku, "Price":"$"+(r.retailPrice||0) })) };
    }
    if (fileType==="competitors") {
      const result = parseCompPaste(text);
      return { type:"competitors", fileType, rows:result.rows||[], count:(result.rows||[]).length,
        label:"Competitors", color:"#ff4d6d",
        preview: (result.rows||[]).slice(0,5).map(r=>({ "Brand":r.brand, "Niche":r.niche, "GMV":"$"+(r.monthlyGMV||0) })) };
    }
    // Fallback: generic performance/pricing
    const result = parseTSV(text);
    if (result.error) return { error: result.error, fileType:"unknown" };
    return { type:"catalog", fileType:"performance", rows:result.rows||[], count:(result.rows||[]).length,
      label:"Sales & Performance", color:"#00e5a0", headers:result.headers, map:result.map,
      preview: (result.rows||[]).slice(0,5).map(r=>({ "Product":r.name, "Revenue":"$"+(r.revenue||0), "Units":r.units||"—" })) };
  };

  // ── Reconcile Shopify + TikTok orders ──
  const reconcileOrders = (shopifyRows, tiktokRows) => {
    return shopifyRows.map(s=>{
      const match = s.tiktokOrderId ? tiktokRows.find(t=>t.tiktokOrderId===s.tiktokOrderId) : null;
      return {
        shopifyOrderId:  s.shopifyOrderId,
        tiktokOrderId:   s.tiktokOrderId || match?.tiktokOrderId || "—",
        product:         s.product || match?.product,
        sku:             s.sku || match?.sku,
        shopifyTotal:    s.total,
        tiktokAmount:    match?.orderAmount || 0,
        variance:        match ? r2(s.total - match.orderAmount) : null,
        platformDisc:    match?.platformDisc || 0,
        sellerDisc:      match?.sellerDisc || 0,
        taxes:           s.taxes || match?.taxes || 0,
        shipping:        s.shipping || match?.shipping || 0,
        status:          s.status,
        date:            s.date,
        matched:         !!match,
      };
    });
  };

  // ── Batch import state ──────────────────────────────────────────────────────
  // (batchFiles, processBatchFiles, commitBatchFile, commitAllBatch defined above at line ~936)
  const [tiktokOrders,  setTiktokOrders]  = useState([]);
  const [shopifyOrders, setShopifyOrders] = useState([]);
  const [reconOrders,   setReconOrders]   = useState([]);
  const batchFileInputRef = useRef();

  const SOURCES = [
    { id:"performance", label:"Sales & Performance", color:"#00e5a0", bg:"rgba(0,229,160,0.08)",
      desc:"Product Name, SKU, Revenue, Units Sold, ROAS, Margin %, VCR %, Ad Spend",
      placeholder:"Product Name\tRevenue\tUnits Sold\tROAS\tMargin %\tVCR %\tAd Spend\nGlow Serum 2.0\t4970\t142\t3.8\t38\t4.2\t412" },
    { id:"pricing",     label:"Pricing",             color:"#ff6b35", bg:"rgba(255,107,53,0.08)",
      desc:"Product Name, Retail Price, Sale Price, COGS",
      placeholder:"Product Name\tRetail Price\tSale Price\tCOGS\nGlow Serum 2.0\t44.99\t34.99\t7.80" },
    { id:"inventory",   label:"Inventory",           color:"#f5c518", bg:"rgba(245,197,24,0.08)",
      desc:"Product Name, Units on Hand",
      placeholder:"Product Name\tUnits on Hand\nGlow Serum 2.0\t245" },
    { id:"ads",         label:"Ads Manager",         color:"#c77dff", bg:"rgba(199,125,255,0.08)",
      desc:"Campaign name, Cost, Gross revenue, ROI, Impressions, Clicks, CTR — all TikTok ad export formats supported",
      placeholder:"Campaign name\tCost\tGross revenue\tROI\tImpressions\nGMV Max\t1240\t4836\t3.9\t84200" },
    { id:"competitors", label:"Competitors",         color:"#ff4d6d", bg:"rgba(255,77,109,0.08)",
      desc:"Brand, Niche, Followers, Monthly GMV, Running Ads (Y/N), Avg Commission %",
      placeholder:"Brand\tNiche\tFollowers\tMonthly GMV\tRunning Ads\tAvg Commission\nGlowLab Beauty\tSkincare\t284000\t187000\tY\t18" },
  ];

  const previewSource = (id) => {
    const text = srcText[id]||"";
    setSrcError(e=>({...e,[id]:""}));
    setSrcPreview(p=>({...p,[id]:null}));
    if (!text.trim()) { setSrcError(e=>({...e,[id]:"Paste your data first."})); return; }
    if (id==="ads") {
      const result = parseAdsTSV(text);
      if (result.error) { setSrcError(e=>({...e,[id]:result.error})); return; }
      setSrcPreview(p=>({...p,[id]:{ type:"ads", rows:result.rows }}));
    } else if (id==="competitors") {
      const result = parseCompPaste(text);
      if (result.error) { setSrcError(e=>({...e,[id]:result.error})); return; }
      setSrcPreview(p=>({...p,[id]:{ type:"competitors", rows:result.rows }}));
    } else if (id==="inventory") {
      const result = parseInvPaste(text);
      if (result.error) { setSrcError(e=>({...e,[id]:result.error})); return; }
      setSrcPreview(p=>({...p,[id]:{ type:"inventory", rows:result.rows }}));
    } else {
      const result = parseTSV(text);
      if (result.error) { setSrcError(e=>({...e,[id]:result.error})); return; }
      setSrcPreview(p=>({...p,[id]:{ type:"catalog", rows:result.rows, headers:result.headers, map:result.map }}));
    }
  };

  const commitSource = (id) => {
    const preview = srcPreview[id];
    const srcMeta = SOURCES.find(s=>s.id===id);
    if (!preview) return;
    if (preview.type==="ads") {
      setAdsData(preview.rows);
    } else if (preview.type==="competitors") {
      setCompetitors(prev=>{ const u=[...prev]; preview.rows.forEach(row=>{ const i=u.findIndex(c=>c.brand.toLowerCase()===row.brand.toLowerCase()); if(i>=0) u[i]={...u[i],...row,products:u[i].products}; else u.push(row); }); return u; });
    } else if (preview.type==="inventory") {
      setInvSettings(prev=>{ const u=[...prev]; preview.rows.forEach(row=>{ const i=u.findIndex(s=>s.name.toLowerCase()===row.name.toLowerCase()||s.name.toLowerCase().includes(row.name.toLowerCase())||row.name.toLowerCase().includes(s.name.toLowerCase())); if(i>=0) u[i]={...u[i],unitsOnHand:row.units,incoming:row.incoming}; }); return u; });
    } else {
      setCatalog(prev=>{ const u=[...prev]; preview.rows.forEach(imp=>{ const i=u.findIndex(p=>p.name.toLowerCase()===imp.name.toLowerCase()); if(i>=0) u[i]={...u[i],...imp,tags:u[i].tags,status:u[i].status,id:u[i].id}; else u.push(imp); }); return u; });
      setProfProducts(prev=>{ const u=[...prev]; preview.rows.forEach(imp=>{ const i=u.findIndex(p=>p.name.toLowerCase()===imp.name.toLowerCase()); if(i>=0) u[i]={...u[i],salePrice:imp.discountedPrice||imp.retailPrice||u[i].salePrice,cogs:imp.cogs||u[i].cogs,adSpend:imp.adSpend||u[i].adSpend}; else if(imp.name) u.push({name:imp.name,salePrice:imp.discountedPrice||imp.retailPrice||0,cogs:imp.cogs||0,shipping:0,adSpend:imp.adSpend||0,adType:"GMV Max"}); }); return u; });
      setImportHistory(prev=>[{date:new Date().toLocaleString(),rowCount:preview.rows.length,source:srcMeta?.label||id},...prev.slice(0,19)]);
    }
    setSrcDone(d=>({...d,[id]:true}));
    setSrcPreview(p=>({...p,[id]:null}));
    setSrcText(t=>({...t,[id]:""}));
  };

  const IMPORT_FIELDS = [
    { field:"name",          label:"Product Name",      required:true  },
    { field:"sku",           label:"SKU",               required:false },
    { field:"retailPrice",   label:"Retail Price",      required:false },
    { field:"discountedPrice",label:"Discounted Price", required:false },
    { field:"units",         label:"Units Sold",        required:false },
    { field:"revenue",       label:"Revenue",           required:false },
    { field:"adSpend",       label:"Ad Spend",          required:false },
    { field:"roas",          label:"ROAS",              required:false },
    { field:"margin",        label:"Profit Margin %",   required:false },
    { field:"vcr",           label:"VCR %",             required:false },
    { field:"cogs",          label:"COGS",              required:false },
    { field:"emv",           label:"EMV",               required:false },
    { field:"repeatRate",    label:"Repeat Rate %",     required:false },
  ];

  // ── Global tag filter (filters all tabs) ──────────────────────────────────
  const [globalTags,     setGlobalTags]    = useState([]);  // [{type, tag}]
  const [tagFilterOpen,  setTagFilterOpen] = useState(false);

  const toggleGlobalTag = (type, tag) => {
    setGlobalTags(prev => {
      const exists = prev.some(t=>t.type===type&&t.tag===tag);
      return exists ? prev.filter(t=>!(t.type===type&&t.tag===tag)) : [...prev, {type,tag}];
    });
  };

  // Products that match ALL active global tags (AND logic within each type, OR across types)
  const globalFilteredProds = globalTags.length === 0 ? catalog : catalog.filter(p =>
    globalTags.every(({type, tag}) => p.tags[type]?.includes(tag))
  );

  // Scoped aggregate metrics derived from globalFilteredProds
  const scopedTotals = (() => {
    const prods = globalFilteredProds;
    const rev     = prods.reduce((s,p)=>s+p.revenue,0);
    const units   = prods.reduce((s,p)=>s+p.units,0);
    const emv     = prods.reduce((s,p)=>s+p.emv,0);
    const adSpend = prods.reduce((s,p)=>s+(p.adSpend||0),0);
    const roas    = adSpend>0 ? r2(rev/adSpend) : 0;
    const margin  = prods.length ? r2(prods.reduce((s,p)=>s+(p.margin||0),0)/prods.length) : 0;
    return { rev, units, emv, adSpend, roas, margin, count:prods.length };
  })();

  // ── Inventory state ────────────────────────────────────────────────────────
  const DEFAULT_INV_SETTINGS = catalog.map(p => ({
    id:         p.id,
    name:       p.name,
    unitsOnHand:0,
    threshold:  30,   // units — below this = at risk
    leadTime:   14,   // days to restock
    moq:        50,   // minimum order quantity
    incoming:   0,    // units already on order
  }));
  const [invSettings,    setInvSettings]    = useState(DEFAULT_INV_SETTINGS);
  const [invPasteText,   setInvPasteText]   = useState("");
  const [invPasteError,  setInvPasteError]  = useState("");
  const [invPasteOpen,   setInvPasteOpen]   = useState(false);
  const [invPasteSuccess,setInvPasteSuccess]= useState(false);
  const [invEditId,      setInvEditId]      = useState(null);
  const invFileRef = useRef();

  // Keep invSettings in sync when new products are imported into catalog
  const syncedInvSettings = (() => {
    const existing = new Map(invSettings.map(s=>[s.id, s]));
    return catalog.map(p => existing.get(p.id) || {
      id:p.id, name:p.name, unitsOnHand:0, threshold:30, leadTime:14, moq:50, incoming:0
    });
  })();

  const updateInvField = (id, field, val) => {
    setInvSettings(prev => {
      const exists = prev.find(s=>s.id===id);
      if (exists) return prev.map(s=>s.id===id?{...s,[field]:val}:s);
      return [...prev, { id, name:catalog.find(p=>p.id===id)?.name||"", unitsOnHand:0, threshold:30, leadTime:14, moq:50, incoming:0, [field]:val }];
    });
  };

  // Parse inventory paste (tab or comma separated, needs product name + units on hand)
  const parseInvPaste = (text) => {
    const lines = text.trim().split("\n").filter(l=>l.trim());
    if (lines.length < 2) return { error:"Need a header row and at least one data row." };
    const delim = lines[0].includes("\t") ? "\t" : ",";
    const headers = lines[0].split(delim).map(h=>h.trim().toLowerCase().replace(/[^a-z0-9\s]/g,""));
    const nameIdx = headers.findIndex(h=>h.includes("product")||h.includes("name")||h.includes("item")||h.includes("sku"));
    const unitsIdx = headers.findIndex(h=>h.includes("unit")||h.includes("stock")||h.includes("inventory")||h.includes("on hand")||h.includes("qty")||h.includes("quantity"));
    const incomingIdx = headers.findIndex(h=>h.includes("incoming")||h.includes("on order")||h.includes("ordered")||h.includes("po"));
    if (nameIdx<0) return { error:`Could not find a product name column. Headers: ${headers.join(", ")}` };
    if (unitsIdx<0) return { error:`Could not find a units/stock column. Headers: ${headers.join(", ")}` };
    const rows = lines.slice(1).map(line=>{
      const cols = line.split(delim).map(c=>c.trim().replace(/^"|"$/g,""));
      const name = cols[nameIdx]||"";
      if (!name) return null;
      return { name, units: parseFloat(cols[unitsIdx])||0, incoming: incomingIdx>=0 ? parseFloat(cols[incomingIdx])||0 : 0 };
    }).filter(Boolean);
    return { rows };
  };

  const handleInvPaste = () => {
    setInvPasteError(""); setInvPasteSuccess(false);
    if (!invPasteText.trim()) { setInvPasteError("Paste your inventory data first."); return; }
    const result = parseInvPaste(invPasteText);
    if (result.error) { setInvPasteError(result.error); return; }
    setInvSettings(prev => {
      const updated = [...prev];
      result.rows.forEach(row => {
        // fuzzy match on name
        const idx = updated.findIndex(s=>s.name.toLowerCase()===row.name.toLowerCase()||s.name.toLowerCase().includes(row.name.toLowerCase())||row.name.toLowerCase().includes(s.name.toLowerCase()));
        if (idx>=0) { updated[idx]={...updated[idx], unitsOnHand:row.units, incoming:row.incoming}; }
        else {
          // try to match against catalog
          const catProd = catalog.find(p=>p.name.toLowerCase().includes(row.name.toLowerCase())||row.name.toLowerCase().includes(p.name.toLowerCase()));
          if (catProd) updated.push({ id:catProd.id, name:catProd.name, unitsOnHand:row.units, incoming:row.incoming, threshold:30, leadTime:14, moq:50 });
        }
      });
      return updated;
    });
    setInvPasteSuccess(true);
    setInvPasteText("");
    setInvPasteOpen(false);
  };

  // Compute per-product inventory status
  const invRows = syncedInvSettings.map(s => {
    const prod    = catalog.find(p=>p.id===s.id);
    const velocity= prod ? (prod.units||0) : 0;          // units/day from imported data
    const daysLeft= velocity>0 ? Math.floor((s.unitsOnHand+s.incoming)/velocity) : (s.unitsOnHand>0 ? 999 : 0);
    const reorderDate = daysLeft<999 ? new Date(Date.now()+(Math.max(0,daysLeft-s.leadTime))*86400000) : null;
    const restockArrival = reorderDate ? new Date(reorderDate.getTime()+s.leadTime*86400000) : null;
    const stockoutDate = daysLeft<999 && daysLeft>0 ? new Date(Date.now()+daysLeft*86400000) : null;
    const belowThreshold = s.unitsOnHand <= s.threshold;
    const status =
      s.unitsOnHand === 0                              ? "out"      :
      belowThreshold || (daysLeft>0 && daysLeft<=s.leadTime) ? "critical" :
      daysLeft>0 && daysLeft<=s.leadTime*2             ? "low"      :
      daysLeft>0 && daysLeft<=30                       ? "watch"    : "ok";
    const unitsToOrder = Math.max(0, s.moq, s.threshold*2 - s.unitsOnHand - s.incoming);
    return { ...s, prod, velocity, daysLeft, reorderDate, restockArrival, stockoutDate, belowThreshold, status, unitsToOrder };
  });

  const fmtDate = (d) => d ? d.toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "—";
  const STATUS_META = {
    out:      { label:"OUT OF STOCK", color:"#ff4d6d", bg:"rgba(255,77,109,0.12)",   icon:"✕" },
    critical: { label:"CRITICAL",     color:"#ff4d6d", bg:"rgba(255,77,109,0.08)",   icon:"⚠" },
    low:      { label:"LOW",          color:"#ff6b35", bg:"rgba(255,107,53,0.10)",   icon:"↓" },
    watch:    { label:"WATCH",        color:"#f5c518", bg:"rgba(245,197,24,0.10)",   icon:"·" },
    ok:       { label:"OK",           color:"#00e5a0", bg:"rgba(0,229,160,0.08)",    icon:"✓" },
  };

  // ── Ads state ──────────────────────────────────────────────────────────────
  const AD_TYPES = {
    gmvmax:   { label:"GMV Max",               color:"#00e5a0", bg:"rgba(0,229,160,0.10)"   },
    spark:    { label:"Spark Ads",             color:"#c77dff", bg:"rgba(199,125,255,0.10)" },
    infeed:   { label:"In-Feed / VSA",         color:"#ff6b35", bg:"rgba(255,107,53,0.10)"  },
    live:     { label:"LIVE Shopping Ads",     color:"#f5c518", bg:"rgba(245,197,24,0.10)"  },
  };

  const MOCK_ADS = [
    { id:"a1", type:"gmvmax", name:"GMV Max — All Products",       spend:1240, revenue:4836, roas:3.9, impressions:84200, clicks:2106, ctr:2.5, cpm:14.73, cpc:0.59, conversions:142, cvr:6.74, videoViews:0,     vcr:0    },
    { id:"a2", type:"spark",  name:"Spark — Glow Serum Hero",      spend:380,  revenue:1140, roas:3.0, impressions:52100, clicks:1042, ctr:2.0, cpm:7.29,  cpc:0.36, conversions:38,  cvr:3.65, videoViews:46890, vcr:3.6  },
    { id:"a3", type:"spark",  name:"Spark — Eye Lift Patches",     spend:210,  revenue:588,  roas:2.8, impressions:38400, clicks:691,  ctr:1.8, cpm:5.47,  cpc:0.30, conversions:21,  cvr:3.04, videoViews:34560, vcr:3.2  },
    { id:"a4", type:"infeed", name:"VSA — Hydra Mist SPF",         spend:320,  revenue:896,  roas:2.8, impressions:61000, clicks:1098, ctr:1.8, cpm:5.25,  cpc:0.29, conversions:32,  cvr:2.91, videoViews:54900, vcr:4.1  },
    { id:"a5", type:"infeed", name:"In-Feed — Bundle Promo",       spend:175,  revenue:385,  roas:2.2, impressions:29800, clicks:477,  ctr:1.6, cpm:5.87,  cpc:0.37, conversions:17,  cvr:3.56, videoViews:26820, vcr:3.8  },
    { id:"a6", type:"live",   name:"LIVE Ads — Weekly LIVE",       spend:290,  revenue:1015, roas:3.5, impressions:44600, clicks:1115, ctr:2.5, cpm:6.50,  cpc:0.26, conversions:58,  cvr:5.20, videoViews:0,     vcr:0    },
  ];

  const ADS_FIELD_ALIASES = {
    name:        ["ad name","campaign name","name","campaign","ad set","adset","creative name","ad group"],
    type:        ["ad type","type","campaign type","format"],
    spend:       ["spend","cost","total spend","amount spent","ad spend"],
    revenue:     ["revenue","attributed revenue","cvr revenue","purchase value","gmv","total purchase value"],
    roas:        ["roas","return on ad spend","purchase roas"],
    impressions: ["impressions","impr","reach"],
    clicks:      ["clicks","link clicks","total clicks"],
    ctr:         ["ctr","click rate","click-through rate","link ctr"],
    cpm:         ["cpm","cost per thousand","cost per mille"],
    cpc:         ["cpc","cost per click","avg cpc"],
    conversions: ["conversions","purchases","orders","total purchases","purchase"],
    cvr:         ["cvr","conversion rate","purchase rate","cr"],
    videoViews:  ["video views","views","2s views","6s views","video play"],
    vcr:         ["vcr","video completion","view rate","video view rate","play completion"],
  };

  const TYPE_KEYWORDS = { gmvmax:["gmv max","gmvmax","gmv"], spark:["spark"], live:["live","shopping live"], infeed:["in-feed","infeed","video shopping","vsa","in feed"] };

  const autoDetectAdType = (name="", typeCell="") => {
    const hay = (name+" "+typeCell).toLowerCase();
    for (const [key,kws] of Object.entries(TYPE_KEYWORDS)) if (kws.some(k=>hay.includes(k))) return key;
    return "infeed";
  };

  const parseAdsTSV = (text) => {
    const lines = text.trim().split("\n").filter(l=>l.trim());
    if (lines.length<2) return { error:"Need a header row and at least one data row." };
    const delim = lines[0].includes("\t")?"\t":",";
    const headers = lines[0].split(delim).map(h=>h.trim().toLowerCase().replace(/[^a-z0-9\s%/]/g,""));
    const map = {};
    headers.forEach((h,i)=>{ Object.entries(ADS_FIELD_ALIASES).forEach(([field,aliases])=>{ if(!map[field]&&aliases.some(a=>h.includes(a)||a.includes(h))) map[field]=i; }); });
    if (map.spend===undefined) return { error:`Could not find a Spend column. Headers found: ${headers.join(", ")}` };
    const g = (cols,field) => map[field]!==undefined ? String(cols[map[field]]||"").trim().replace(/^"|"$/g,"") : "";
    const n = (cols,field) => parseFloat(g(cols,field).replace(/[$,%\s]/g,""))||0;
    const rows = lines.slice(1).map((line,idx)=>{
      const cols = line.split(delim).map(c=>c.trim().replace(/^"|"$/g,""));
      const name = g(cols,"name")||`Ad Row ${idx+1}`;
      const spend = n(cols,"spend");
      if (!spend) return null;
      const typeRaw = g(cols,"type");
      return {
        id:"ad_"+idx, name, spend,
        type:        autoDetectAdType(name, typeRaw),
        revenue:     n(cols,"revenue"),
        roas:        n(cols,"roas") || (n(cols,"revenue")>0&&spend>0 ? r2(n(cols,"revenue")/spend) : 0),
        impressions: n(cols,"impressions"),
        clicks:      n(cols,"clicks"),
        ctr:         n(cols,"ctr") || (n(cols,"clicks")>0&&n(cols,"impressions")>0 ? r2(n(cols,"clicks")/n(cols,"impressions")*100) : 0),
        cpm:         n(cols,"cpm") || (n(cols,"impressions")>0 ? r2(spend/n(cols,"impressions")*1000) : 0),
        cpc:         n(cols,"cpc") || (n(cols,"clicks")>0 ? r2(spend/n(cols,"clicks")) : 0),
        conversions: n(cols,"conversions"),
        cvr:         n(cols,"cvr") || (n(cols,"conversions")>0&&n(cols,"clicks")>0 ? r2(n(cols,"conversions")/n(cols,"clicks")*100) : 0),
        videoViews:  n(cols,"videoViews"),
        vcr:         n(cols,"vcr"),
      };
    }).filter(Boolean);
    return { rows };
  };

  // ── Affiliate data ─────────────────────────────────────────────────────────
  const MOCK_AFFILIATES = [
    { id:"af1", handle:"@glowwithsara",    tier:"micro",  followers:48200,  commissionRate:20,
      videos:[
        { id:"v1", product:"Glow Serum 2.0",     views:142000, clicks:4260, orders:198, revenue:6931, vcr:4.8, posted:"2026-03-12" },
        { id:"v2", product:"Eye Lift Patches",    views:68000,  clicks:1632, orders:72,  revenue:2993, vcr:3.9, posted:"2026-03-14" },
      ]},
    { id:"af2", handle:"@skincarediaries", tier:"micro",  followers:31400,  commissionRate:20,
      videos:[
        { id:"v3", product:"Glow Serum 2.0",     views:89000,  clicks:2136, orders:104, revenue:3640, vcr:3.6, posted:"2026-03-10" },
        { id:"v4", product:"Hydra Mist SPF",      views:54000,  clicks:1080, orders:58,  revenue:2030, vcr:2.9, posted:"2026-03-15" },
      ]},
    { id:"af3", handle:"@beautybykim",     tier:"mid",    followers:124000, commissionRate:18,
      videos:[
        { id:"v5", product:"Vitamin C Drops",     views:210000, clicks:4410, orders:189, revenue:6615, vcr:5.2, posted:"2026-03-08" },
        { id:"v6", product:"Night Repair Mask",   views:97000,  clicks:1940, orders:82,  revenue:2870, vcr:3.4, posted:"2026-03-13" },
      ]},
    { id:"af4", handle:"@dailyritualskin",  tier:"nano",  followers:12800,  commissionRate:22,
      videos:[
        { id:"v7", product:"Brightening Toner",   views:28000,  clicks:504,  orders:24,  revenue:840,  vcr:2.1, posted:"2026-03-16" },
      ]},
    { id:"af5", handle:"@morningroutineclub",tier:"micro",followers:39600,  commissionRate:22,
      videos:[
        { id:"v8", product:"Glow Serum 2.0",      views:76000,  clicks:1900, orders:91,  revenue:3185, vcr:4.1, posted:"2026-03-11" },
        { id:"v9", product:"Hydra Mist SPF",      views:43000,  clicks:774,  orders:39,  revenue:1365, vcr:2.6, posted:"2026-03-17" },
      ]},
  ];

  const AFFILIATE_PASTE_ALIASES = {
    handle:      ["handle","creator","creator handle","username","tiktok handle","@","influencer"],
    tier:        ["tier","level","creator tier","size"],
    followers:   ["followers","fans","follower count"],
    commissionRate:["commission","commission rate","affiliate commission","rate"],
    product:     ["product","product name","item","sku","listing"],
    views:       ["views","video views","total views","play count"],
    clicks:      ["clicks","link clicks","product clicks","tiktok shop clicks"],
    orders:      ["orders","purchases","units sold","conversions","sales"],
    revenue:     ["revenue","gmv","sales revenue","attributed revenue","total revenue"],
    vcr:         ["vcr","video completion","completion rate","view rate"],
    posted:      ["posted","date","post date","video date","published"],
  };

  const parseAffiliatePaste = (text) => {
    const lines = text.trim().split("\n").filter(l=>l.trim());
    if (lines.length<2) return { error:"Need a header row and at least one data row." };
    const delim = lines[0].includes("\t")?"\t":",";
    const headers = lines[0].split(delim).map(h=>h.trim().toLowerCase().replace(/[^a-z0-9\s@%]/g,""));
    const fi = (aliases) => headers.findIndex(h=>aliases.some(a=>h.includes(a)||a.includes(h)));
    const COL = Object.fromEntries(Object.entries(AFFILIATE_PASTE_ALIASES).map(([k,v])=>[k,fi(v)]));
    if (COL.handle<0&&COL.product<0) return { error:`Could not find a Creator or Product column. Headers: ${headers.join(", ")}` };
    const g = (cols,k) => COL[k]>=0?String(cols[COL[k]]||"").trim().replace(/^"|"$/g,""):"";
    const n = (cols,k) => parseFloat(g(cols,k).replace(/[$,%KkMm\s]/g,""))||0;
    // Group by handle — multiple rows per creator (one per video)
    const byHandle = {};
    lines.slice(1).forEach((line,idx)=>{
      const cols = line.split(delim).map(c=>c.trim().replace(/^"|"$/g,""));
      const handle = g(cols,"handle")||"Unknown";
      if (!byHandle[handle]) byHandle[handle] = { id:"af_"+Date.now()+"_"+idx, handle, tier:g(cols,"tier")||"micro", followers:n(cols,"followers"), commissionRate:n(cols,"commissionRate")||18, videos:[] };
      const product = g(cols,"product");
      if (product) byHandle[handle].videos.push({ id:"v_"+idx, product, views:n(cols,"views"), clicks:n(cols,"clicks"), orders:n(cols,"orders"), revenue:n(cols,"revenue"), vcr:n(cols,"vcr"), posted:g(cols,"posted") });
    });
    return { rows:Object.values(byHandle) };
  };

  const [affiliates,       setAffiliates]       = useState(MOCK_AFFILIATES);
  const [affPasteOpen,     setAffPasteOpen]      = useState(false);
  const [affPasteText,     setAffPasteText]      = useState("");
  const [affPasteError,    setAffPasteError]     = useState("");
  const [affPasteOk,       setAffPasteOk]        = useState(false);
  const [channelView,      setChannelView]        = useState("overview");   // overview | affiliates
  const [affSortBy,        setAffSortBy]          = useState("revenue");    // revenue | views | orders | vcr
  const [affProductFilter, setAffProductFilter]   = useState("all");
  const [affTierFilter,    setAffTierFilter]       = useState("all");
  const affFileRef = useRef();

  const handleAffPaste = () => {
    setAffPasteError(""); setAffPasteOk(false);
    if (!affPasteText.trim()) { setAffPasteError("Paste your affiliate data first."); return; }
    const result = parseAffiliatePaste(affPasteText);
    if (result.error) { setAffPasteError(result.error); return; }
    setAffiliates(prev=>{
      const updated=[...prev];
      result.rows.forEach(row=>{
        const idx=updated.findIndex(a=>a.handle.toLowerCase()===row.handle.toLowerCase());
        if(idx>=0) updated[idx]={...updated[idx],...row,videos:[...updated[idx].videos,...row.videos]};
        else updated.push(row);
      });
      return updated;
    });
    setAffPasteOk(true); setAffPasteText(""); setAffPasteOpen(false);
  };

  // Flatten all videos for analysis (used in channels tab)
  const allAffVideos = affiliates.flatMap(a=>a.videos.map(v=>({ ...v, handle:a.handle, tier:a.tier, followers:a.followers, commissionRate:a.commissionRate||a.commission||18, affiliateId:a.id })));
  const affTiers     = ["all","nano","micro","mid","macro"];

  // Affiliate-level aggregates (per creator roll-up)
  const affRows = affiliates.map(a=>{
    const vids      = a.videos;
    const totRev    = vids.reduce((s,v)=>s+v.revenue,0);
    const totViews  = vids.reduce((s,v)=>s+v.views,0);
    const totOrders = vids.reduce((s,v)=>s+v.orders,0);
    const totClicks = vids.reduce((s,v)=>s+v.clicks,0);
    const avgVCR    = vids.length ? r2(vids.reduce((s,v)=>s+v.vcr,0)/vids.length) : 0;
    const cvr       = totClicks>0 ? r2(totOrders/totClicks*100) : 0;
    const rate      = a.commissionRate||a.commission||18;
    const commPaid  = r2(totRev * rate/100);
    const revenuePerVideo = vids.length ? r2(totRev/vids.length) : 0;
    return { ...a, commissionRate:rate, totRev, totViews, totOrders, totClicks, avgVCR, cvr, commPaid, revenuePerVideo, videoCount:vids.length };
  });

  const [adsData,       setAdsData]       = useState(MOCK_ADS);
  const [adsPasteText,  setAdsPasteText]  = useState("");
  const [adsPasteError, setAdsPasteError] = useState("");
  const [adsPasteOpen,  setAdsPasteOpen]  = useState(false);
  const [adsPasteOk,    setAdsPasteOk]    = useState(false);
  const [adsView,       setAdsView]       = useState("overview");  // "overview"|"bytype"|"creative"
  const [adsTypeFilter, setAdsTypeFilter] = useState("all");
  const adsFileRef = useRef();

  const handleAdsPaste = () => {
    setAdsPasteError(""); setAdsPasteOk(false);
    if (!adsPasteText.trim()) { setAdsPasteError("Paste your Ads Manager export first."); return; }
    const result = parseAdsTSV(adsPasteText);
    if (result.error) { setAdsPasteError(result.error); return; }
    setAdsData(result.rows);
    setAdsPasteOk(true);
    setAdsPasteText("");
    setAdsPasteOpen(false);
  };

  // Filtered + aggregated ad data
  const filteredAds = adsTypeFilter==="all" ? adsData : adsData.filter(a=>a.type===adsTypeFilter);

  const adsAgg = (rows) => {
    if (!rows.length) return null;
    const spend      = rows.reduce((s,a)=>s+a.spend,0);
    const revenue    = rows.reduce((s,a)=>s+a.revenue,0);
    const impressions= rows.reduce((s,a)=>s+a.impressions,0);
    const clicks     = rows.reduce((s,a)=>s+a.clicks,0);
    const conversions= rows.reduce((s,a)=>s+a.conversions,0);
    const videoViews = rows.reduce((s,a)=>s+a.videoViews,0);
    const roas       = spend>0 ? r2(revenue/spend) : 0;
    const ctr        = impressions>0 ? r2(clicks/impressions*100) : 0;
    const cpm        = impressions>0 ? r2(spend/impressions*1000) : 0;
    const cpc        = clicks>0 ? r2(spend/clicks) : 0;
    const cvr        = clicks>0 ? r2(conversions/clicks*100) : 0;
    const vcr        = videoViews>0&&impressions>0 ? r2(videoViews/impressions*100) : 0;
    return { spend, revenue, impressions, clicks, conversions, videoViews, roas, ctr, cpm, cpc, cvr, vcr };
  };

  const byType = Object.keys(AD_TYPES).map(type=>{
    const rows = adsData.filter(a=>a.type===type);
    return { type, meta:AD_TYPES[type], rows, agg:adsAgg(rows) };
  }).filter(t=>t.rows.length>0);

  const blended = adsAgg(adsData);

  // ── Competitor Analysis ────────────────────────────────────────────────────
  const MOCK_COMPETITORS = [
    { id:"c1", brand:"GlowLab Beauty", niche:"Skincare / Serums", followers:284000, monthlyGMV:187000, running_ads:true,
      products:[
        { name:"Glow Serum Pro", price:42.99, yourPrice:44.99, commission:18, discount:15, reviews:2840, rating:4.7 },
        { name:"Hydra Boost Mist", price:32.99, yourPrice:35.00, commission:20, discount:10, reviews:1620, rating:4.5 },
      ]},
    { id:"c2", brand:"PureGlow Co", niche:"Clean Beauty / SPF", followers:142000, monthlyGMV:94000, running_ads:true,
      products:[
        { name:"SPF 50 Daily Mist", price:38.00, yourPrice:35.00, commission:15, discount:20, reviews:3210, rating:4.8 },
        { name:"Vitamin C Serum", price:29.99, yourPrice:44.99, commission:12, discount:0,  reviews:890,  rating:4.3 },
      ]},
    { id:"c3", brand:"DermLux", niche:"Clinical Skincare", followers:67000, monthlyGMV:52000, running_ads:false,
      products:[
        { name:"Eye Revive Patches", price:44.99, yourPrice:41.56, commission:10, discount:5,  reviews:540,  rating:4.2 },
        { name:"Night Repair Serum", price:52.00, yourPrice:44.99, commission:8,  discount:0,  reviews:310,  rating:4.4 },
      ]},
  ];

  const DEFAULT_YOUR_BRAND = { commissionRate: 18, avgPrice: 0, followers: 0, monthlyGMV: 0 };

  const [competitors,     setCompetitors]    = useState(MOCK_COMPETITORS);
  const [yourBrand,       setYourBrand]      = useState(DEFAULT_YOUR_BRAND);
  const [compView,        setCompView]       = useState("overview");   // overview | products | commissions | benchmarks
  const [compPasteOpen,   setCompPasteOpen]  = useState(false);
  const [compPasteText,   setCompPasteText]  = useState("");
  const [compPasteError,  setCompPasteError] = useState("");
  const [compPasteOk,     setCompPasteOk]    = useState(false);
  const [editingComp,     setEditingComp]    = useState(null);   // competitor id being edited
  const [addingComp,      setAddingComp]     = useState(false);
  const [addingProd,      setAddingProd]     = useState(null);   // comp id adding product to
  const [expandedComp,    setExpandedComp]   = useState(null);   // comp id with products expanded
  const compFileRef = useRef();

  const BLANK_COMP = { id:"", brand:"", niche:"", followers:0, monthlyGMV:0, running_ads:false, products:[] };
  const BLANK_PROD = { name:"", price:0, yourPrice:0, commission:0, discount:0, reviews:0, rating:0 };
  const [newComp,  setNewComp]  = useState(BLANK_COMP);
  const [newProd,  setNewProd]  = useState(BLANK_PROD);

  const saveNewComp = () => {
    if (!newComp.brand.trim()) return;
    setCompetitors(prev=>[...prev, { ...newComp, id:"c_"+Date.now(), products:[] }]);
    setNewComp(BLANK_COMP);
    setAddingComp(false);
  };

  const saveNewProd = (compId) => {
    if (!newProd.name.trim()) return;
    setCompetitors(prev=>prev.map(c=>c.id===compId ? { ...c, products:[...c.products, { ...newProd }] } : c));
    setNewProd(BLANK_PROD);
    setAddingProd(null);
  };

  const deleteComp = (id) => setCompetitors(prev=>prev.filter(c=>c.id!==id));
  const deleteProd = (compId, prodIdx) => setCompetitors(prev=>prev.map(c=>c.id===compId ? { ...c, products:c.products.filter((_,i)=>i!==prodIdx) } : c));

  const updateCompField = (id, field, val) => setCompetitors(prev=>prev.map(c=>c.id===id?{...c,[field]:val}:c));
  const updateProdField = (compId, prodIdx, field, val) => setCompetitors(prev=>prev.map(c=>c.id===compId?{...c,products:c.products.map((p,i)=>i===prodIdx?{...p,[field]:val}:p)}:c));

  // Parse competitor paste (brand-level rows: Brand, Niche, Followers, GMV, Ads, Avg Commission)
  const parseCompPaste = (text) => {
    const lines = text.trim().split("\n").filter(l=>l.trim());
    if (lines.length<2) return { error:"Need a header row and at least one data row." };
    const delim = lines[0].includes("\t")?"\t":",";
    const headers = lines[0].split(delim).map(h=>h.trim().toLowerCase().replace(/[^a-z0-9\s%]/g,""));
    const fi = (aliases) => headers.findIndex(h=>aliases.some(a=>h.includes(a)||a.includes(h)));
    const COL = {
      brand:      fi(["brand","name","store","shop","seller"]),
      niche:      fi(["niche","category","type","vertical"]),
      followers:  fi(["followers","fans","following"]),
      gmv:        fi(["gmv","revenue","monthly","monthly gmv","est revenue","estimated"]),
      ads:        fi(["ads","running ads","paid","advertising"]),
      commission: fi(["commission","affiliate","rate","commission rate"]),
    };
    if (COL.brand<0) return { error:`Could not find a Brand/Name column. Headers: ${headers.join(", ")}` };
    const g = (cols,k) => COL[k]>=0 ? String(cols[COL[k]]||"").trim().replace(/^"|"$/g,"") : "";
    const n = (cols,k) => parseFloat(g(cols,k).replace(/[$,%KkMm\s]/g,""))||0;
    const rows = lines.slice(1).map((line,idx)=>{
      const cols = line.split(delim).map(c=>c.trim().replace(/^"|"$/g,""));
      const brand = g(cols,"brand"); if (!brand) return null;
      const gmvRaw = g(cols,"gmv").toUpperCase();
      const gmvMult = gmvRaw.includes("M")?1000000:gmvRaw.includes("K")?1000:1;
      return { id:"cp_"+idx+"_"+Date.now(), brand, niche:g(cols,"niche")||"", followers:n(cols,"followers"), monthlyGMV:n(cols,"gmv")*gmvMult||0, running_ads:g(cols,"ads").toLowerCase().includes("y")||g(cols,"ads")==="true", products:[], _commission:n(cols,"commission") };
    }).filter(Boolean);
    return { rows };
  };

  const handleCompPaste = () => {
    setCompPasteError(""); setCompPasteOk(false);
    if (!compPasteText.trim()) { setCompPasteError("Paste your competitor data first."); return; }
    const result = parseCompPaste(compPasteText);
    if (result.error) { setCompPasteError(result.error); return; }
    setCompetitors(prev=>{
      const updated=[...prev];
      result.rows.forEach(row=>{
        const idx=updated.findIndex(c=>c.brand.toLowerCase()===row.brand.toLowerCase());
        if (idx>=0) updated[idx]={...updated[idx],...row,products:updated[idx].products};
        else updated.push(row);
      });
      return updated;
    });
    setCompPasteOk(true); setCompPasteText(""); setCompPasteOpen(false);
  };

  // Your brand computed stats from catalog
  const yourAvgPrice   = catalog.length ? r2(catalog.reduce((s,p)=>s+(p.discountedPrice||p.retailPrice||0),0)/catalog.filter(p=>p.discountedPrice>0||p.retailPrice>0).length||1) : 0;
  const yourAvgRating  = 0; // will come from TikTok API
  const yourTotalReviews = 0; // will come from TikTok API

  // Benchmark helpers
  const allComps = competitors;
  const avgCompCommission = allComps.length ? r2(allComps.reduce((s,c)=>{ const prods=c.products; return s+(prods.length?prods.reduce((ss,p)=>ss+p.commission,0)/prods.length:0); },0)/allComps.filter(c=>c.products.length>0).length||1) : 0;
  const avgCompPrice = (() => { const prods=allComps.flatMap(c=>c.products); return prods.length?r2(prods.reduce((s,p)=>s+p.price,0)/prods.length):0; })();
  const avgCompGMV   = allComps.length ? r2(allComps.reduce((s,c)=>s+c.monthlyGMV,0)/allComps.length) : 0;

  // ── Launch Planner ─────────────────────────────────────────────────────────
  const LAUNCH_STAGES = [
    { id:"prelaunch", label:"Pre-Launch",  color:"#c77dff", bg:"rgba(199,125,255,0.08)", desc:"Planning & prep"      },
    { id:"soft",      label:"Soft Launch", color:"#f5c518", bg:"rgba(245,197,24,0.08)",  desc:"Testing live"         },
    { id:"full",      label:"Full Launch", color:"#ff6b35", bg:"rgba(255,107,53,0.08)",  desc:"Full push active"     },
    { id:"review",    label:"Review",      color:"#00e5a0", bg:"rgba(0,229,160,0.08)",   desc:"Post-launch analysis" },
  ];
  const CHECKLIST_ITEMS = {
    prelaunch: ["Product listing created","Hero images uploaded","Price & discount set","Inventory ordered & confirmed","Affiliate outreach sent","Creative brief written","First video shot","Launch date confirmed"],
    soft:      ["Listing live on TikTok Shop","First organic video posted","Affiliate seeding packages sent","Price point validated","Early VCR & CVR monitored","Feedback collected"],
    full:      ["Paid ads launched","Spark Ads boosting top video","Affiliate commission confirmed live","Launch promo or flash sale active","Inventory sufficient for demand","Daily metric monitoring active"],
    review:    ["2-week revenue vs projection reviewed","ROAS vs comparable SKU benchmarked","Top & bottom performing creatives identified","Affiliate performance reviewed","Restock order placed if needed","Scale / Hold / Cut decision made"],
  };
  const MOCK_LAUNCHES = [
    { id:"l1", name:"Peptide Eye Cream", stage:"full", launchDate:"2026-03-10", targetPrice:48.99, commissionRate:20, adBudget:500, projectedUnits:200, actualUnits:142, projectedRevenue:9798, actualRevenue:6956, comparableSKU:"p7", niche:"Eye Care", brief:"Targeting 25-45 skincare audience. Lead with before/after transformation hook. Seed 10 micro-creators first week.",
      checklist:{ prelaunch:[true,true,true,true,true,true,false,true], soft:[true,true,true,true,false,false], full:[true,true,true,false,true,true], review:[false,false,false,false,false,false] },
      creators:[{ name:"@glowwithsara", tier:"micro", status:"posted", views:42000, commission:20 },{ name:"@skincarediaries", tier:"micro", status:"posted", views:31000, commission:20 },{ name:"@beautybykim", tier:"mid", status:"pending", views:0, commission:18 }], notes:"Strong early VCR 4.2% but CVR lower than expected — product page needs more reviews." },
    { id:"l2", name:"Brightening Toner Pads", stage:"prelaunch", launchDate:"2026-04-01", targetPrice:36.99, commissionRate:22, adBudget:400, projectedUnits:150, actualUnits:0, projectedRevenue:5549, actualRevenue:0, comparableSKU:"p1", niche:"Serum", brief:"Spring launch campaign. Position as daily ritual product. Bundle opportunity with Glow Serum.",
      checklist:{ prelaunch:[true,true,true,false,false,false,false,false], soft:[false,false,false,false,false,false], full:[false,false,false,false,false,false], review:[false,false,false,false,false,false] },
      creators:[{ name:"@morningroutineclub", tier:"micro", status:"seeding", views:0, commission:22 }], notes:"" },
  ];
  const BLANK_LAUNCH = { id:"", name:"", stage:"prelaunch", launchDate:"", targetPrice:0, commissionRate:18, adBudget:0, projectedUnits:0, actualUnits:0, projectedRevenue:0, actualRevenue:0, comparableSKU:"", niche:"", brief:"",
    checklist:{ prelaunch:Array(8).fill(false), soft:Array(6).fill(false), full:Array(6).fill(false), review:Array(6).fill(false) }, creators:[], notes:"" };

  const [launches,      setLaunches]      = useState(MOCK_LAUNCHES);
  const [launchView,    setLaunchView]    = useState("pipeline");
  const [activeLaunch,  setActiveLaunch]  = useState(null);
  const [addingLaunch,  setAddingLaunch]  = useState(false);
  const [newLaunch,     setNewLaunch]     = useState(BLANK_LAUNCH);
  const [addingCreator, setAddingCreator] = useState(null);
  const [newCreator,    setNewCreator]    = useState({ name:"", tier:"micro", status:"seeding", views:0, commission:18 });

  const saveNewLaunch = () => {
    if (!newLaunch.name.trim()) return;
    const id = "l_"+Date.now();
    const comp = catalog.find(p=>p.id===newLaunch.comparableSKU);
    const projRev = newLaunch.projectedUnits>0&&newLaunch.targetPrice>0 ? r2(newLaunch.projectedUnits*newLaunch.targetPrice) : comp?r2(comp.units*newLaunch.targetPrice):0;
    setLaunches(prev=>[...prev,{...newLaunch,id,projectedRevenue:projRev,
      checklist:{prelaunch:Array(CHECKLIST_ITEMS.prelaunch.length).fill(false),soft:Array(CHECKLIST_ITEMS.soft.length).fill(false),full:Array(CHECKLIST_ITEMS.full.length).fill(false),review:Array(CHECKLIST_ITEMS.review.length).fill(false)},creators:[]}]);
    setNewLaunch(BLANK_LAUNCH); setAddingLaunch(false); setActiveLaunch(id);
  };
  const toggleCheckItem = (lid,stage,idx) => setLaunches(prev=>prev.map(l=>l.id!==lid?l:{...l,checklist:{...l.checklist,[stage]:l.checklist[stage].map((v,i)=>i===idx?!v:v)}}));
  const moveStage = (lid,sid) => setLaunches(prev=>prev.map(l=>l.id===lid?{...l,stage:sid}:l));
  const updateLaunchField = (id,field,val) => setLaunches(prev=>prev.map(l=>l.id===id?{...l,[field]:val}:l));
  const addCreatorToLaunch = (lid) => { if(!newCreator.name.trim())return; setLaunches(prev=>prev.map(l=>l.id===lid?{...l,creators:[...l.creators,{...newCreator}]}:l)); setNewCreator({name:"",tier:"micro",status:"seeding",views:0,commission:18}); setAddingCreator(null); };
  const updateCreator = (lid,idx,field,val) => setLaunches(prev=>prev.map(l=>l.id===lid?{...l,creators:l.creators.map((c,i)=>i===idx?{...c,[field]:val}:c)}:l));
  const launchProgress = (l) => { const flat=Object.values(l.checklist).flat(); const done=flat.filter(Boolean); const pct=flat.length?Math.round(done.length/flat.length*100):0; const revPct=l.projectedRevenue>0?Math.min(r2(l.actualRevenue/l.projectedRevenue*100),150):0; return {pct,revPct}; };
  const upcomingLaunches = launches.filter(l=>l.stage==="prelaunch"||l.stage==="soft");
  const activeLaunchList = launches.filter(l=>l.stage==="full");

  // ── Affiliate Creator state ────────────────────────────────────────────────
  // (MOCK_AFFILIATES, state, and paste handler defined earlier at line ~977)
  // Derived metrics for channels tab (second view)
  const affTotalRevenue  = affRows.reduce((s,a)=>s+a.totRev,0);
  const affTotalOrders   = affRows.reduce((s,a)=>s+a.totOrders,0);
  const affTotalViews    = affRows.reduce((s,a)=>s+a.totViews,0);
  const affAvgCommission = affiliates.length ? r2(affiliates.reduce((s,a)=>s+(a.commissionRate||a.commission||18),0)/affiliates.length) : 0;
  const affProducts      = [...new Set(allAffVideos.map(v=>v.product))];
  const filteredVideos   = affProductFilter==="all" ? allAffVideos : allAffVideos.filter(v=>v.product===affProductFilter);
  const affView          = channelView;
  const setAffView       = setChannelView;
  const [affExpandedId,  setAffExpandedId] = useState(null);
  const affExpandedCreator    = affExpandedId;
  const setAffExpandedCreator = setAffExpandedId;
  const allVideos        = allAffVideos;

  const TABS = ["sop","snapshot","data import","overview","products","channels","ads","weekly strategy","goals & projections","profitability","inventory","competitors","launches","catalog"];

  return (
    <div style={{ fontFamily:"'DM Mono','Courier New',monospace", background:"#0a0a0f", minHeight:"100vh", color:"#e8e8f0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box} input[type=number]::-webkit-inner-spin-button{opacity:0.3}`}</style>

      {/* Header */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,0.02)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ fontSize:11, color:"#555", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}>← Portfolio</button>
          <div style={{ width:28, height:28, background:brandColor||"linear-gradient(135deg,#ff0050,#00e5a0)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>⚡</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#fff" }}>{brandName||"Brand Dashboard"}</div>
            <div style={{ fontSize:9, color:"#444" }}>TikTok Shop · Shop Pulse</div>
          </div>
        </div>
        <div style={{ fontSize:11, color:"#666", letterSpacing:1, textTransform:"uppercase" }}>{d.date}</div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", padding:"0 28px", borderBottom:"1px solid rgba(255,255,255,0.06)", overflowX:"auto" }}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", padding:"14px 16px", cursor:"pointer", color:tab===t?"#00e5a0":"#555", background:"none", border:"none", borderBottom:tab===t?"2px solid #00e5a0":"2px solid transparent", whiteSpace:"nowrap" }}>{t}</button>
        ))}
      </div>

      {/* Global Tag Filter Bar */}
      {tab !== "data import" && tab !== "catalog" && (
        <div style={{ padding:"0 28px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.01)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, paddingTop:10, paddingBottom:10, flexWrap:"wrap" }}>
            {/* Toggle button */}
            <button onClick={()=>setTagFilterOpen(o=>!o)} style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", padding:"5px 12px", borderRadius:6, cursor:"pointer", background: globalTags.length>0?"rgba(255,107,53,0.12)":"rgba(255,255,255,0.04)", color: globalTags.length>0?"#ff6b35":"#555", border: globalTags.length>0?"1px solid rgba(255,107,53,0.3)":"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
              ⬡ Filter by Tag {globalTags.length>0 && <span style={{ background:"#ff6b35", color:"#000", borderRadius:20, padding:"1px 6px", fontSize:9 }}>{globalTags.length}</span>}
            </button>

            {/* Active tag pills */}
            {globalTags.map(({type,tag})=>{
              const meta = TAG_TYPES[type];
              return (
                <span key={type+tag} onClick={()=>toggleGlobalTag(type,tag)} style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20, background:meta.bg, color:meta.color, border:`1px solid ${meta.color}55`, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                  {tag} <span style={{ opacity:0.6 }}>✕</span>
                </span>
              );
            })}

            {/* Scoped summary when filter is active */}
            {globalTags.length>0 && (
              <div style={{ marginLeft:"auto", display:"flex", gap:16, alignItems:"center" }}>
                <span style={{ fontSize:10, color:"#555" }}>{scopedTotals.count} products</span>
                <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>${(scopedTotals.rev/1000).toFixed(1)}k rev</span>
                {scopedTotals.roas>0 && <span style={{ fontSize:11, color:scopedTotals.roas>=2.5?"#00e5a0":"#f5c518" }}>{scopedTotals.roas}x ROAS</span>}
                {scopedTotals.margin>0 && <span style={{ fontSize:11, color:scopedTotals.margin>=25?"#00e5a0":"#f5c518" }}>{scopedTotals.margin}% margin</span>}
                <button onClick={()=>setGlobalTags([])} style={{ fontSize:10, color:"#ff4d6d", background:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Clear all</button>
              </div>
            )}
          </div>

          {/* Expanded tag picker */}
          {tagFilterOpen && (
            <div style={{ paddingBottom:14 }}>
              <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
                {Object.entries(TAG_TYPES).map(([type,meta])=>(
                  <div key={type}>
                    <div style={{ fontSize:8, letterSpacing:2, textTransform:"uppercase", color:meta.color, fontWeight:700, marginBottom:8 }}>{meta.label}</div>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      {allTags[type].map(tag=>{
                        const active = globalTags.some(t=>t.type===type&&t.tag===tag);
                        const cnt = tagCounts[type][tag]||0;
                        return (
                          <button key={tag} onClick={()=>toggleGlobalTag(type,tag)} style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20, cursor:"pointer", background:active?meta.bg:"transparent", color:active?meta.color:"#555", border:`1px solid ${active?meta.color+"55":"rgba(255,255,255,0.08)"}`, display:"flex", alignItems:"center", gap:5 }}>
                            {tag}<span style={{ fontSize:9, opacity:0.5, fontWeight:400 }}>{cnt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, color:"#444", marginTop:10 }}>Selecting multiple tags narrows to products that have ALL of them. Click the bar above to collapse.</div>
            </div>
          )}
        </div>
      )}

      <div style={{ padding:"24px 28px", maxWidth:1140 }}>

        {/* ── SOP ── */}
        {tab==="sop" && (
          <div style={{ maxWidth:860 }}>

            {/* Header */}
            <div style={{ marginBottom:32 }}>
              <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#00e5a0", fontWeight:700, marginBottom:8 }}>Standard Operating Procedure</div>
              <div style={{ fontSize:24, fontWeight:700, color:"#fff", marginBottom:10 }}>Shop Pulse — Daily Usage Guide</div>
              <div style={{ fontSize:13, color:"#555", lineHeight:1.8 }}>
                This dashboard centralizes your TikTok Shop performance across products, ads, inventory, and competitors. Follow the daily routine below to keep data current and decisions fast.
              </div>
            </div>

            {/* Daily routine */}
            <div style={{ ...S.card, marginBottom:20, border:"1px solid rgba(0,229,160,0.15)", background:"rgba(0,229,160,0.02)" }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#00e5a0", fontWeight:700, marginBottom:20 }}>Daily Routine — Do This Every Morning</div>
              {[
                { step:"1", time:"2 min", title:"Paste Sales & Performance data",
                  detail:"Go to Data Import → Sales & Performance. Copy your daily product performance from Google Sheets (include header row, Cmd+C) and paste. Click Preview, verify the column mapping looks correct, then Confirm Import. This updates the Overview, Products, Profitability, and Catalog tabs." },
                { step:"2", time:"1 min", title:"Paste Inventory data",
                  detail:"Go to Data Import → Inventory. Copy your stock sheet (Product Name + Units on Hand columns). Paste, preview, confirm. This feeds the Inventory tab's risk calculations and reorder projections." },
                { step:"3", time:"1 min", title:"Paste Ads Manager data (if running paid)",
                  detail:"In TikTok Ads Manager, go to Reports, set your date range to yesterday or the current period, and export or copy the campaign table. Go to Data Import → Ads Manager, paste, confirm. This updates the Ads tab including recommendations." },
                { step:"4", time:"2 min", title:"Check the Overview tab",
                  detail:"Review today's revenue vs goal, blended ROAS, and any alert banners at the top. These surface the most urgent signals — low stock warnings, underperforming ad spend, or revenue anomalies — so you know where to dig in." },
                { step:"5", time:"3 min", title:"Check Inventory for red flags",
                  detail:"Go to Inventory. Any product showing CRITICAL or OUT OF STOCK needs immediate action. Check the Restock Action List at the bottom for recommended order quantities and reorder-by dates. Edit Lead Time and MOQ per product using the Edit button to keep projections accurate." },
                { step:"6", time:"3 min", title:"Review Ads recommendations",
                  detail:"Go to Ads → scroll to the Recommendations panel. High Priority items (red) need action today — pause low-ROAS campaigns or scale high-ROAS ones. Medium Priority (yellow) are this-week fixes. Address at least one per day." },
              ].map((s,i)=>(
                <div key={i} style={{ display:"flex", gap:20, paddingBottom:20, marginBottom:20, borderBottom:i<5?"1px solid rgba(255,255,255,0.05)":"none" }}>
                  <div style={{ flexShrink:0, width:36, height:36, borderRadius:"50%", background:"rgba(0,229,160,0.12)", border:"1px solid rgba(0,229,160,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#00e5a0" }}>{s.step}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:"#e8e8f0" }}>{s.title}</span>
                      <span style={{ fontSize:9, fontWeight:700, color:"#555", background:"rgba(255,255,255,0.05)", padding:"2px 8px", borderRadius:20 }}>{s.time}</span>
                    </div>
                    <div style={{ fontSize:12, color:"#666", lineHeight:1.8 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly routine */}
            <div style={{ ...S.card, marginBottom:20, border:"1px solid rgba(245,197,24,0.15)", background:"rgba(245,197,24,0.02)" }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#f5c518", fontWeight:700, marginBottom:20 }}>Weekly Routine — Do This Every Monday</div>
              {[
                { step:"1", title:"Update Pricing data",
                  detail:"Go to Data Import → Pricing. Paste your current retail prices, sale prices, and COGS per product. This keeps the Profitability planning tab and Competitor Benchmarks accurate." },
                { step:"2", title:"Update Competitor data",
                  detail:"Go to Data Import → Competitors or the Competitors tab directly. Update any price changes, new products, or commission rate changes you've spotted. Check the Benchmarks view to see if your commission rate is still competitive." },
                { step:"3", title:"Review Weekly Strategy tab",
                  detail:"Check WoW revenue change, revenue per content piece, and the Decisions by Owner strip. Assign action items to the right person (Media Buyer, Creator Manager, Brand/Leadership) based on the product verdict flags." },
                { step:"4", title:"Review Goals & Projections",
                  detail:"Check whether you're trending toward Base Case or Conservative scenario for the week. If you're tracking below Base, decide whether to activate a flash sale, push more content, or shift ad budget." },
                { step:"5", title:"Audit Catalog tags",
                  detail:"Go to Catalog → Tag Manager. Make sure new products are tagged with the right Campaign, Category, and Internal tags so the Tag Report and global filter work correctly across all tabs." },
              ].map((s,i)=>(
                <div key={i} style={{ display:"flex", gap:20, paddingBottom:20, marginBottom:20, borderBottom:i<4?"1px solid rgba(255,255,255,0.05)":"none" }}>
                  <div style={{ flexShrink:0, width:36, height:36, borderRadius:"50%", background:"rgba(245,197,24,0.1)", border:"1px solid rgba(245,197,24,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#f5c518" }}>{s.step}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", marginBottom:6 }}>{s.title}</div>
                    <div style={{ fontSize:12, color:"#666", lineHeight:1.8 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tab reference */}
            <div style={{ ...S.card, marginBottom:20 }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:20 }}>Tab Reference — What Each Tab Does</div>
              {[
                { tab:"Data Import",          color:"#00e5a0", icon:"⬇",
                  who:"Everyone",
                  what:"The central hub for getting data in. Five independent paste slots — Sales & Performance, Pricing, Inventory, Ads Manager, Competitors. Each has its own column detection so different sheet formats don't interfere. Paste, preview the column mapping, confirm. Import history tracked at the bottom.",
                  update:"Daily (Sales, Inventory, Ads) · Weekly (Pricing, Competitors)" },
                { tab:"Overview",             color:"#00e5a0", icon:"◈",
                  who:"Brand / Leadership",
                  what:"Top-level daily snapshot. Revenue vs goal with sparkline, blended ROAS, AOV, new vs returning customers, cart abandonment, and revenue by channel. Alert banners surface the most urgent signals. When a global tag filter is active, shows filtered totals.",
                  update:"Auto-updates from Data Import" },
                { tab:"Products",             color:"#00e5a0", icon:"⊞",
                  who:"Brand / Leadership · Creator Manager",
                  what:"Per-product performance table: units sold, revenue, EMV, VCR%, ROAS, repeat purchase rate, and margin. Color-coded green/yellow/red thresholds. Respects the global tag filter so you can view just one campaign's products. Filtered totals card shown when a tag filter is active.",
                  update:"Auto-updates from Data Import" },
                { tab:"Channels",             color:"#00e5a0", icon:"◎",
                  who:"Media Buyer · Brand / Leadership",
                  what:"Revenue and performance broken down by Organic, Paid, and Affiliate channels. Deep-dive cards per channel with their own metrics, plus a blended summary. Use this to evaluate channel mix and decide where to shift budget or creator focus.",
                  update:"Auto-updates from Data Import" },
                { tab:"Ads",                  color:"#ff6b35", icon:"▲",
                  who:"Media Buyer",
                  what:"Full paid ads dashboard. Three views: Overview (per-ad-type summary cards + efficiency benchmarks vs TikTok targets), By Ad Type (detailed table per campaign type), All Creatives (every ad sortable by ROAS). Recommendations panel at the bottom auto-generates scale/pause/fix signals based on ROAS, CTR, CVR, VCR, and CPM. Paste data from TikTok Ads Manager export.",
                  update:"Daily — paste from Ads Manager" },
                { tab:"Weekly Strategy",      color:"#c77dff", icon:"⊕",
                  who:"All three roles",
                  what:"WoW revenue summary, revenue per content piece, daily revenue bar chart, and product action flags (Scale / Hold / Cut / Test) with verdicts by owner. The Decisions strip at the bottom assigns specific actions to Media Buyer, Creator Manager, and Brand/Leadership so everyone knows what they own.",
                  update:"Auto-updates; decisions updated manually weekly" },
                { tab:"Goals & Projections",  color:"#c77dff", icon:"◐",
                  who:"Brand / Leadership",
                  what:"Weekly and monthly revenue projections with Conservative / Base / Upside scenarios. Projection rationale panel explains the 6 factors driving the estimate. Monthly breakdown shows week-by-week revenue ranges. Key assumptions and risk factors listed.",
                  update:"Review and adjust manually weekly" },
                { tab:"Profitability",        color:"#ff6b35", icon:"$",
                  who:"Brand / Leadership · Media Buyer",
                  what:"Two modes. Planning Mode: set TikTok fee %, affiliate commission %, and discount % at the top, then edit COGS/shipping/ad spend per product — waterfall shows gross and net profit. Actuals Mode: paste or upload your order-level CSV export for real fee data, with product rollup, channel rollup, and individual order views.",
                  update:"Planning: update fees/COGS weekly · Actuals: paste order export daily or weekly" },
                { tab:"Inventory",            color:"#f5c518", icon:"⬡",
                  who:"Brand / Leadership · Operations",
                  what:"Daily stock health report. Status tiers: Out of Stock → Critical → Low → Watch → OK, sorted worst-first. Velocity calculated from imported sales data. Reorder By date = Days Left minus Lead Time. Restock Action List shows products needing orders with recommended quantities. Edit threshold, lead time, and MOQ per product using the Edit button.",
                  update:"Daily — paste units on hand · Edit settings per product as needed" },
                { tab:"Competitors",          color:"#ff4d6d", icon:"◉",
                  who:"Brand / Leadership",
                  what:"Four views: Overview (competitor cards with followers, GMV, avg commission, avg price), Products (all competitor products vs your catalog with price gap %), Commissions (your affiliate rate vs market with pass/fail), Benchmarks (pricing gap analysis, discount activity scorecard). Add competitors manually or paste brand-level data from a sheet. Product-level data added per competitor card.",
                  update:"Weekly — update prices, commissions, new products" },
                { tab:"Catalog",             color:"#00e5a0", icon:"⊟",
                  who:"Brand / Leadership · Creator Manager",
                  what:"Full product catalog with inline editing. Three views: Catalog (table with retail/sale prices, status, tags, and metrics), Tag Report (group by Campaign/Category/Internal with drilldown into individual products), Tag Manager (rename or delete tags globally). Filter bar with product counts per tag. Bulk select for applying tags to multiple products at once.",
                  update:"Update status and prices weekly · Tag new products as they're added" },
              ].map((row,i)=>(
                <div key={i} style={{ display:"flex", gap:16, padding:"16px 0", borderBottom:i<10?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  {/* Icon */}
                  <div style={{ flexShrink:0, width:38, height:38, borderRadius:8, background:`${row.color}14`, border:`1px solid ${row.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:row.color }}>{row.icon}</div>
                  {/* Content */}
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:"#e8e8f0" }}>{row.tab}</span>
                      <span style={{ fontSize:9, fontWeight:700, color:row.color, background:`${row.color}14`, border:`1px solid ${row.color}33`, padding:"2px 8px", borderRadius:20 }}>{row.who}</span>
                    </div>
                    <div style={{ fontSize:12, color:"#666", lineHeight:1.8, marginBottom:6 }}>{row.what}</div>
                    <div style={{ fontSize:10, color:"#555", display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ color:"#333", fontWeight:700 }}>Update cadence:</span> {row.update}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div style={{ ...S.card, background:"rgba(255,255,255,0.01)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Tips & Notes</div>
              {[
                ["Column headers don't need to match exactly", "The importer uses fuzzy matching — \"GMV\", \"Total Sales\", \"Gross Revenue\" all map to Revenue. Check the preview step to confirm what was detected."],
                ["The global tag filter works across all tabs", "Click ⬡ Filter by Tag in the bar below the tab nav to filter Products, Overview, and Channels down to a specific campaign, category, or internal label. Stack multiple tags to narrow further."],
                ["Inventory velocity comes from your sales data", "Days of stock remaining is calculated using Units Sold from your last import. Import fresh sales data daily for accurate projections."],
                ["Tags are your organization layer", "Use Campaign tags for time-limited pushes (Flash Sale, Spring Launch), Category for product type (Serum, SPF), and Internal for operational flags (Hero SKU, Low Stock, Test). The Tag Report in Catalog groups and compares performance across any of these."],
                ["Mock data is pre-loaded", "All tabs show realistic mock data until you paste your own. Your imports layer on top — existing products update in place, new ones are added. Tags and status set in the Catalog are never overwritten by imports."],
                ["TikTok API integration", "This dashboard is built to connect to TikTok Shop's API when available. Tabs that will auto-populate include: Overview (daily revenue), Products (units/revenue), Inventory (stock levels), and Ads (campaign metrics). Competitor data will remain manual until TikTok exposes market data endpoints."],
              ].map(([title,body],i)=>(
                <div key={i} style={{ display:"flex", gap:12, paddingBottom:14, marginBottom:14, borderBottom:i<5?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <span style={{ color:"#00e5a0", fontSize:14, flexShrink:0, marginTop:1 }}>→</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#e8e8f0", marginBottom:4 }}>{title}</div>
                    <div style={{ fontSize:12, color:"#666", lineHeight:1.7 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ── SNAPSHOT ── */}
        {tab==="snapshot" && (()=>{
          // ── Derived signals ────────────────────────────────────────────────
          // Revenue
          const totalRev    = catalog.reduce((s,p)=>s+p.revenue,0);
          const totalUnits  = catalog.reduce((s,p)=>s+p.units,0);
          const avgROAS     = catalog.filter(p=>p.roas>0).length ? r2(catalog.filter(p=>p.roas>0).reduce((s,p)=>s+p.roas,0)/catalog.filter(p=>p.roas>0).length) : 0;
          const avgMargin   = catalog.filter(p=>p.margin>0).length ? r2(catalog.filter(p=>p.margin>0).reduce((s,p)=>s+p.margin,0)/catalog.filter(p=>p.margin>0).length) : 0;

          // Products
          const topProds    = [...catalog].filter(p=>p.revenue>0).sort((a,b)=>b.revenue-a.revenue).slice(0,3);
          const scaleProd   = catalog.filter(p=>p.roas>=3&&p.units>0);
          const cutProd     = catalog.filter(p=>p.roas>0&&p.roas<1.5&&p.units>0);
          const lowVCR      = catalog.filter(p=>p.vcr>0&&p.vcr<1.5);

          // Inventory
          const invOut      = invRows.filter(r=>r.status==="out");
          const invCritical = invRows.filter(r=>r.status==="critical");
          const invLow      = invRows.filter(r=>r.status==="low");
          const invUrgent   = [...invOut,...invCritical];

          // Ads
          const adsROAS     = blended ? blended.roas : 0;
          const totalSpend  = blended ? blended.spend : 0;
          const topAd       = [...adsData].sort((a,b)=>b.roas-a.roas)[0];
          const worstAd     = [...adsData].filter(a=>a.roas>0).sort((a,b)=>a.roas-b.roas)[0];
          const highPriRecs = (() => {
            const r=[];
            adsData.filter(a=>a.roas>=3.5&&a.spend<Math.max(...adsData.map(x=>x.spend),1)*0.35).forEach(a=>r.push({type:"scale",msg:`Scale "${a.name}" — ${a.roas}x ROAS, underfunded`}));
            adsData.filter(a=>a.roas>0&&a.roas<2&&a.spend>100).forEach(a=>r.push({type:"cut",msg:`Pause "${a.name}" — ${a.roas}x ROAS, losing money`}));
            return r;
          })();

          // Competitors
          const commGap     = r2(avgCompCommission - yourBrand.commissionRate);
          const pricingBelow= competitors.flatMap(c=>c.products).filter(cp=>cp.price<yourAvgPrice*0.85).length;

          // Goals
          const goalPct     = d.revenue.goal>0 ? Math.min(r2((d.revenue.today/d.revenue.goal)*100),100) : 0;
          const goalColor   = goalPct>=90?"#00e5a0":goalPct>=60?"#f5c518":"#ff4d6d";

          // Section helper
          const Section = ({title, color="#444", children}) => (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color, fontWeight:700, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ height:1, width:16, background:color, opacity:0.5 }}/>{title}<div style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)" }}/>
              </div>
              {children}
            </div>
          );

          const Flag = ({color, label, sub, onClick}) => (
            <div onClick={onClick} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:`${color}08`, border:`1px solid ${color}22`, borderRadius:8, cursor:onClick?"pointer":"default" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#e8e8f0" }}>{label}</div>
                {sub&&<div style={{ fontSize:11, color:"#555", marginTop:2 }}>{sub}</div>}
              </div>
              {onClick&&<span style={{ fontSize:10, color:"#555" }}>→</span>}
            </div>
          );

          const nothingUrgent = invUrgent.length===0 && highPriRecs.length===0 && cutProd.length===0 && commGap<=0 && activeLaunchList.length===0;

          return (
            <div>
              {/* Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
                <div>
                  <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#555", fontWeight:700, marginBottom:4 }}>Daily Snapshot</div>
                  <div style={{ fontSize:22, fontWeight:700, color:"#fff" }}>What needs your attention today</div>
                </div>
                <div style={{ fontSize:11, color:"#555" }}>{d.date}</div>
              </div>

              {/* All-clear banner */}
              {nothingUrgent && (
                <div style={{ padding:"14px 18px", background:"rgba(0,229,160,0.06)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:10, marginBottom:20, display:"flex", alignItems:"center", gap:12, fontSize:12, color:"#00e5a0" }}>
                  <span style={{ fontSize:18 }}>✓</span>
                  <span>No urgent flags today — all systems look healthy. Review the metrics below to stay informed.</span>
                </div>
              )}

              {/* ── URGENT ACTIONS ── */}
              {(invUrgent.length>0||highPriRecs.length>0||cutProd.length>0) && (
                <Section title="Urgent — Act Today" color="#ff4d6d">
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {invUrgent.map((r,i)=>(
                      <Flag key={"inv"+i} color="#ff4d6d"
                        label={r.status==="out"?`OUT OF STOCK: ${r.name}`:`CRITICAL STOCK: ${r.name} — ${r.daysLeft}d left`}
                        sub={`${r.unitsOnHand} units on hand · Reorder ${r.unitsToOrder} units${r.reorderDate?" · Reorder by "+fmtDate(r.reorderDate):""}`}
                        onClick={()=>setTab("inventory")}/>
                    ))}
                    {highPriRecs.map((r,i)=>(
                      <Flag key={"ad"+i} color="#ff4d6d"
                        label={r.type==="cut"?"Pause ad spend — below break-even":"Scale ad budget — high ROAS underfunded"}
                        sub={r.msg}
                        onClick={()=>setTab("ads")}/>
                    ))}
                    {cutProd.map((p,i)=>(
                      <Flag key={"cut"+i} color="#ff4d6d"
                        label={`Low ROAS product: ${p.name}`}
                        sub={`${p.roas}x ROAS — consider pausing ads or reviewing pricing`}
                        onClick={()=>setTab("products")}/>
                    ))}
                    {activeLaunchList.map((l,i)=>{
                      const {pct,revPct} = launchProgress(l);
                      return <Flag key={"al"+i} color="#ff6b35"
                        label={`Active launch: ${l.name}`}
                        sub={`Checklist ${pct}% · ${l.creators.filter(c=>c.status==="posted").length}/${l.creators.length} creators posted${l.projectedRevenue>0?" · Rev "+revPct+"% of projection":""}`}
                        onClick={()=>{ setTab("launches"); setActiveLaunch(l.id); setLaunchView("brief"); }}/>;
                    })}
                  </div>
                </Section>
              )}

              {/* ── WATCH ── */}
              {(invLow.length>0||lowVCR.length>0||commGap>2||pricingBelow>0||upcomingLaunches.length>0) && (
                <Section title="Watch — Review This Week" color="#f5c518">
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {upcomingLaunches.map((l,i)=>{
                      const {pct} = launchProgress(l);
                      const stage = LAUNCH_STAGES.find(s=>s.id===l.stage);
                      return <Flag key={"ul"+i} color="#c77dff"
                        label={`${stage.label}: ${l.name}${l.launchDate?" — launches "+new Date(l.launchDate).toLocaleDateString("en-US",{month:"short",day:"numeric"}):""}`}
                        sub={`Checklist ${pct}% · ${l.creators.length} creator${l.creators.length!==1?"s":""} · $${l.targetPrice} · ${l.commissionRate}% commission`}
                        onClick={()=>{ setTab("launches"); setActiveLaunch(l.id); setLaunchView("brief"); }}/>;
                    })}
                    {invLow.map((r,i)=>(
                      <Flag key={"low"+i} color="#f5c518"
                        label={`Low stock: ${r.name} — ~${r.daysLeft}d remaining`}
                        sub={`${r.unitsOnHand} units · Reorder ${r.unitsToOrder} soon`}
                        onClick={()=>setTab("inventory")}/>
                    ))}
                    {lowVCR.map((p,i)=>(
                      <Flag key={"vcr"+i} color="#f5c518"
                        label={`Weak video performance: ${p.name}`}
                        sub={`VCR ${p.vcr}% — hook may need refresh`}
                        onClick={()=>setTab("products")}/>
                    ))}
                    {commGap>2&&(
                      <Flag color="#f5c518"
                        label={`Affiliate commission ${commGap}pp below market average`}
                        sub={`You: ${yourBrand.commissionRate}% · Market avg: ${avgCompCommission}% — affiliates may prefer competitors`}
                        onClick={()=>setTab("competitors")}/>
                    )}
                    {pricingBelow>0&&(
                      <Flag color="#f5c518"
                        label={`${pricingBelow} competitor product${pricingBelow!==1?"s":""} priced 15%+ below yours`}
                        sub="Check Competitors → Products for details"
                        onClick={()=>setTab("competitors")}/>
                    )}
                  </div>
                </Section>
              )}

              {/* ── OPPORTUNITIES ── */}
              {scaleProd.length>0&&(
                <Section title="Opportunities" color="#00e5a0">
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {scaleProd.slice(0,3).map((p,i)=>(
                      <Flag key={"sc"+i} color="#00e5a0"
                        label={`Scale opportunity: ${p.name}`}
                        sub={`${p.roas}x ROAS · $${(p.revenue/1000).toFixed(1)}k revenue · Consider increasing ad budget or creator seeding`}
                        onClick={()=>setTab("ads")}/>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── KEY METRICS ── */}
              <Section title="Key Metrics" color="#555">
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:12 }}>
                  {[
                    { lbl:"Today vs Goal",    val:goalPct+"%",   sub:`$${(d.revenue.today/1000).toFixed(1)}k of $${(d.revenue.goal/1000).toFixed(1)}k`,  c:goalColor },
                    { lbl:"Blended ROAS",     val:avgROAS>0?avgROAS+"x":"—", sub:"Across all products",   c:avgROAS>=2.5?"#00e5a0":avgROAS>=1.5?"#f5c518":"#ff4d6d" },
                    { lbl:"Paid ROAS",        val:adsROAS>0?adsROAS+"x":"—", sub:`$${(totalSpend/1000).toFixed(1)}k ad spend`,  c:adsROAS>=3?"#00e5a0":adsROAS>=2?"#f5c518":"#ff4d6d" },
                    { lbl:"Avg Margin",       val:avgMargin>0?avgMargin+"%":"—", sub:"Across catalog",    c:avgMargin>=25?"#00e5a0":avgMargin>=15?"#f5c518":"#ff4d6d" },
                  ].map((m,i)=>(
                    <div key={i} style={{ ...S.card, textAlign:"center", padding:"14px 10px" }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:8 }}>{m.lbl}</div>
                      <div style={{ fontSize:24, fontWeight:700, color:m.c, marginBottom:4 }}>{m.val}</div>
                      <div style={{ fontSize:10, color:"#555" }}>{m.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                  {[
                    { lbl:"Total Revenue",   val:"$"+(totalRev/1000).toFixed(1)+"k",   sub:totalUnits+" units sold",           c:"#fff"    },
                    { lbl:"Stock Alerts",    val:invUrgent.length>0?invUrgent.length+" urgent":invLow.length>0?invLow.length+" low":"All OK", sub:invOut.length>0?invOut.length+" out of stock":invCritical.length>0?invCritical.length+" critical":"No urgent issues", c:invUrgent.length>0?"#ff4d6d":invLow.length>0?"#f5c518":"#00e5a0" },
                    { lbl:"Top Performer",   val:topProds[0]?.name?.split(" ").slice(0,2).join(" ")||"—", sub:topProds[0]?`$${(topProds[0].revenue/1000).toFixed(1)}k · ${topProds[0].roas}x ROAS`:"No data yet", c:"#00e5a0" },
                    { lbl:"Competitor Comm", val:commGap>0?"-"+commGap+"pp":commGap===0?"At market":"+"+Math.abs(commGap)+"pp", sub:`You ${yourBrand.commissionRate}% · Market ${avgCompCommission}%`, c:commGap>2?"#ff4d6d":commGap>0?"#f5c518":"#00e5a0" },
                  ].map((m,i)=>(
                    <div key={i} style={{ ...S.card, textAlign:"center", padding:"14px 10px" }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:8 }}>{m.lbl}</div>
                      <div style={{ fontSize:18, fontWeight:700, color:m.c, marginBottom:4, lineHeight:1.2 }}>{m.val}</div>
                      <div style={{ fontSize:10, color:"#555", lineHeight:1.4 }}>{m.sub}</div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* ── TOP PRODUCTS ── */}
              {topProds.length>0&&(
                <Section title="Top Products by Revenue" color="#555">
                  <div style={S.card}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                      <thead><tr>{["Product","Revenue","Units","ROAS","Margin","Stock Status"].map(h=><th key={h} style={{ ...S.th, fontSize:8 }}>{h}</th>)}</tr></thead>
                      <tbody>
                        {topProds.map((p,i)=>{
                          const inv = invRows.find(r=>r.id===p.id);
                          const sm  = inv ? STATUS_META[inv.status] : null;
                          return (
                            <tr key={i}>
                              <td style={S.td}><span style={{ fontWeight:700 }}>{p.name}</span></td>
                              <td style={S.td}><span style={{ fontWeight:700 }}>{p.revenue>0?"$"+(p.revenue/1000).toFixed(1)+"k":"—"}</span></td>
                              <td style={S.td}><span style={{ color:"#aaa" }}>{p.units||"—"}</span></td>
                              <td style={S.td}><span style={{ color:p.roas>=2.5?"#00e5a0":p.roas>=1.5?"#f5c518":p.roas>0?"#ff4d6d":"#444" }}>{p.roas>0?p.roas+"x":"—"}</span></td>
                              <td style={S.td}><span style={{ color:p.margin>=25?"#00e5a0":p.margin>=15?"#f5c518":p.margin>0?"#ff4d6d":"#444" }}>{p.margin>0?p.margin+"%":"—"}</span></td>
                              <td style={S.td}>{sm?<span style={{ fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20, background:sm.bg, color:sm.color }}>{sm.icon} {sm.label}</span>:<span style={{ color:"#444" }}>—</span>}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Section>
              )}

              {/* ── ADS SNAPSHOT ── */}
              {blended&&(
                <Section title="Ads at a Glance" color="#555">
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {topAd&&(
                      <div style={{ ...S.card, border:"1px solid rgba(0,229,160,0.15)" }}>
                        <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:"#00e5a0", fontWeight:700, marginBottom:8 }}>Best Performing Ad</div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", marginBottom:6 }}>{topAd.name}</div>
                        <div style={{ display:"flex", gap:16, fontSize:11 }}>
                          <span style={{ color:"#555" }}>ROAS <strong style={{ color:"#00e5a0" }}>{topAd.roas}x</strong></span>
                          <span style={{ color:"#555" }}>Spend <strong style={{ color:"#fff" }}>${topAd.spend.toLocaleString()}</strong></span>
                          <span style={{ color:"#555" }}>CVR <strong style={{ color:"#aaa" }}>{topAd.cvr}%</strong></span>
                        </div>
                      </div>
                    )}
                    {worstAd&&worstAd.id!==topAd?.id&&(
                      <div style={{ ...S.card, border:"1px solid rgba(255,77,109,0.15)" }}>
                        <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:"#ff4d6d", fontWeight:700, marginBottom:8 }}>Lowest ROAS Ad</div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", marginBottom:6 }}>{worstAd.name}</div>
                        <div style={{ display:"flex", gap:16, fontSize:11 }}>
                          <span style={{ color:"#555" }}>ROAS <strong style={{ color:worstAd.roas<2?"#ff4d6d":"#f5c518" }}>{worstAd.roas}x</strong></span>
                          <span style={{ color:"#555" }}>Spend <strong style={{ color:"#fff" }}>${worstAd.spend.toLocaleString()}</strong></span>
                          <span style={{ color:"#555" }}>Revenue <strong style={{ color:"#aaa" }}>${(worstAd.revenue/1000).toFixed(1)}k</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* ── WEEKLY GOAL ── */}
              <Section title="Weekly Goal Progress" color="#555">
                <div style={{ ...S.card }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <span style={{ fontSize:12, color:"#555" }}>Week of {w.dateRange}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:Math.round(w.totalRevenue/w.weeklyGoal*100)>=90?"#00e5a0":"#f5c518" }}>{Math.round(w.totalRevenue/w.weeklyGoal*100)}% of {fmt(w.weeklyGoal)} goal</span>
                  </div>
                  <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden", marginBottom:8 }}>
                    <div style={{ height:"100%", width:Math.min(w.totalRevenue/w.weeklyGoal*100,100)+"%", background:Math.round(w.totalRevenue/w.weeklyGoal*100)>=90?"#00e5a0":"#f5c518", borderRadius:4, transition:"width 0.3s" }}/>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#555" }}>
                    <span>{fmt(w.totalRevenue)} achieved</span>
                    <span>{fmt(w.weeklyGoal - w.totalRevenue > 0 ? w.weeklyGoal - w.totalRevenue : 0)} remaining</span>
                  </div>
                </div>
              </Section>

              {/* Footer nav hint */}
              <div style={{ fontSize:11, color:"#444", textAlign:"center", padding:"16px 0", borderTop:"1px solid rgba(255,255,255,0.04)", marginTop:8 }}>
                Click any flag above to jump to the relevant tab · Full detail available in each tab
              </div>

            </div>
          );
        })()}

        {/* ── DATA IMPORT ── */}
        {tab==="data import" && (
          <div>
            {/* Header */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#00e5a0", fontWeight:700, marginBottom:6 }}>Daily Data Import</div>
              <div style={{ fontSize:18, fontWeight:700, color:"#fff", marginBottom:6 }}>Drop Your Files</div>
              <div style={{ fontSize:12, color:"#555", lineHeight:1.7, maxWidth:680 }}>
                Drop all your export files at once — TikTok orders, Shopify orders, ads reports, inventory. Each file is automatically detected and routed to the right part of the dashboard. TikTok + Shopify orders are reconciled automatically.
              </div>
            </div>

            {/* Batch drop zone */}
            <div
              onDragOver={e=>{ e.preventDefault(); e.currentTarget.style.borderColor="#00e5a0"; }}
              onDragLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}
              onDrop={e=>{ e.preventDefault(); e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; processBatchFiles(e.dataTransfer.files); }}
              onClick={()=>batchDropRef.current.click()}
              style={{ border:"2px dashed rgba(255,255,255,0.1)", borderRadius:14, padding:"40px 20px", textAlign:"center", cursor:"pointer", marginBottom:20, transition:"border-color 0.15s", background:"rgba(255,255,255,0.02)" }}>
              <input ref={batchDropRef} type="file" multiple accept=".csv,.xlsx,.tsv,.txt" onChange={e=>processBatchFiles(e.target.files)} style={{ display:"none" }}/>
              <div style={{ fontSize:32, marginBottom:10 }}>⬇</div>
              <div style={{ fontSize:14, fontWeight:700, color:"#e8e8f0", marginBottom:6 }}>Drop files here or click to browse</div>
              <div style={{ fontSize:11, color:"#555" }}>Accepts: TikTok order exports, Shopify order exports, Ads Manager reports, Inventory files — all at once</div>
              <div style={{ fontSize:10, color:"#444", marginTop:8 }}>CSV · XLSX · TSV</div>
            </div>

            {batchError && <div style={{ marginBottom:16, padding:"10px 14px", background:"rgba(255,77,109,0.08)", border:"1px solid rgba(255,77,109,0.2)", borderRadius:8, fontSize:11, color:"#ff4d6d" }}>⚠ {batchError}</div>}

            {/* Detected files */}
            {batchFiles.length>0 && (
              <div style={{ ...S.card, marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:3 }}>{batchFiles.length} file{batchFiles.length!==1?"s":""} detected</div>
                    {reconResult && <div style={{ fontSize:11, color:"#00e5a0" }}>✓ {reconResult.matchCount} of {reconResult.total} TikTok orders matched to Shopify orders</div>}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>{ setBatchFiles([]); setReconResult(null); setBatchDone(false); }} style={{ fontSize:11, padding:"6px 12px", borderRadius:6, cursor:"pointer", background:"transparent", color:"#ff4d6d", border:"1px solid rgba(255,77,109,0.2)" }}>✕ Clear</button>
                    <button onClick={commitAllBatch} style={{ fontSize:12, fontWeight:700, padding:"8px 22px", borderRadius:7, background:"#00e5a0", color:"#000", border:"none", cursor:"pointer" }}>✓ Import All</button>
                  </div>
                </div>

                {batchFiles.map((item,idx)=>{
                  const meta = FILE_TYPE_META[item.result.type||"unknown"]||FILE_TYPE_META.unknown;
                  const hasError = !!item.result.error;
                  return (
                    <div key={idx} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:idx<batchFiles.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
                      {/* Status dot */}
                      <div style={{ width:10, height:10, borderRadius:"50%", background:item.committed?"#00e5a0":hasError?"#ff4d6d":meta.color, flexShrink:0 }}/>
                      {/* File info */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:"#e8e8f0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                        {hasError
                          ? <div style={{ fontSize:11, color:"#ff4d6d", marginTop:2 }}>⚠ {item.result.error}</div>
                          : <div style={{ fontSize:11, color:"#555", marginTop:2, display:"flex", gap:12 }}>
                              <span style={{ color:meta.color, fontWeight:700 }}>{meta.label}</span>
                              <span>→ {meta.dest}</span>
                              <span>{item.result.count} rows</span>
                              {item.result.type==="shopify_orders"&&reconResult&&<span style={{ color:"#00e5a0" }}>✓ Reconciled with TikTok orders</span>}
                            </div>
                        }
                      </div>
                      {/* Action */}
                      {!hasError && (
                        item.committed
                          ? <span style={{ fontSize:10, fontWeight:700, color:"#00e5a0" }}>✓ Imported</span>
                          : <button onClick={()=>commitBatchFile(idx)} style={{ fontSize:10, fontWeight:700, padding:"4px 12px", borderRadius:6, cursor:"pointer", background:meta.bg, color:meta.color, border:`1px solid ${meta.color}44`, whiteSpace:"nowrap" }}>Import →</button>
                      )}
                    </div>
                  );
                })}

                {batchDone && <div style={{ marginTop:14, padding:"10px 14px", background:"rgba(0,229,160,0.08)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:8, fontSize:11, color:"#00e5a0" }}>✓ All files imported successfully. Dashboard updated.</div>}
              </div>
            )}

            {/* Reconciliation detail */}
            {reconResult && (
              <div style={{ ...S.card, marginBottom:16, border:"1px solid rgba(0,229,160,0.15)", background:"rgba(0,229,160,0.02)" }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#00e5a0", fontWeight:700, marginBottom:14 }}>Order Reconciliation — TikTok × Shopify</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
                  {[
                    ["TikTok Orders",  reconResult.total,                                          "#fff"    ],
                    ["Matched",        reconResult.matchCount,                                     "#00e5a0" ],
                    ["Unmatched",      reconResult.total-reconResult.matchCount,                   reconResult.total-reconResult.matchCount>0?"#f5c518":"#555"],
                    ["Match Rate",     r2(reconResult.matchCount/reconResult.total*100)+"%",       "#00e5a0" ],
                  ].map(([k,v,c])=>(
                    <div key={k} style={{ background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
                      <div style={{ fontSize:9, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{k}</div>
                      <div style={{ fontSize:20, fontWeight:700, color:c }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ overflowX:"auto", maxHeight:240, overflowY:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                    <thead><tr>{["TikTok Order ID","Shopify Order ID","Product","Sale Price","Platform Disc","Seller Disc","Order Total","Status","Matched"].map(h=><th key={h} style={{ ...S.th, fontSize:8, whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {reconResult.rows.slice(0,50).map((row,i)=>(
                        <tr key={i} style={{ background:row.matched?"transparent":"rgba(245,197,24,0.03)" }}>
                          <td style={{ ...S.td, fontSize:10, color:"#555" }}>{row.tiktokOrderId?.slice(-8)}</td>
                          <td style={{ ...S.td, fontSize:10, color:row.shopifyOrderId?"#00e5a0":"#444" }}>{row.shopifyOrderId||"—"}</td>
                          <td style={{ ...S.td, maxWidth:160 }}><span style={{ fontSize:11, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>{row.productName}</span></td>
                          <td style={S.td}>${(row.salePrice||0).toFixed(2)}</td>
                          <td style={S.td}><span style={{ color:"#ff4d6d" }}>{row.platformDisc?"-$"+Math.abs(row.platformDisc).toFixed(2):"—"}</span></td>
                          <td style={S.td}><span style={{ color:"#f5c518" }}>{row.sellerDisc?"-$"+Math.abs(row.sellerDisc).toFixed(2):"—"}</span></td>
                          <td style={S.td}><span style={{ fontWeight:700 }}>${(row.orderAmount||0).toFixed(2)}</span></td>
                          <td style={S.td}><span style={{ fontSize:9, color:row.status?.toLowerCase().includes("deliver")?"#00e5a0":"#aaa" }}>{row.status}</span></td>
                          <td style={S.td}>{row.matched?<span style={{ color:"#00e5a0", fontWeight:700 }}>✓</span>:<span style={{ color:"#f5c518" }}>—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reconResult.rows.length>50&&<div style={{ fontSize:10,color:"#555",padding:"8px 0",textAlign:"center" }}>Showing 50 of {reconResult.rows.length} orders</div>}
                </div>
              </div>
            )}

            {/* File type reference */}
            <div style={{ ...S.card, background:"rgba(255,255,255,0.01)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:14 }}>Supported File Types — Auto-Detected</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
                {[
                  { label:"TikTok Order Export",      cols:"Order ID, Order Status, SKU Subtotal, Platform Discount, Order Amount",              dest:"Profitability & order reconciliation",  color:"#00e5a0" },
                  { label:"Shopify Order Export",      cols:"Lineitem name, Financial Status, Billing Name, Tags (TikTokOrderID)",                dest:"Reconciled with TikTok orders",          color:"#ff6b35" },
                  { label:"Ads — Creative Data",       cols:"Campaign name, Creative type, Video title, Cost, Gross revenue, ROI, VCR",           dest:"Ads tab — creative performance",         color:"#c77dff" },
                  { label:"Ads — Campaign Report",     cols:"Campaign name, Primary status, Cost, CPM, CPC, Impressions, Clicks, CVR",            dest:"Ads tab — campaign performance",         color:"#c77dff" },
                  { label:"Ads — GMV Max",             cols:"Campaign ID, Campaign name, Cost, Net Cost, SKU orders, Gross revenue, ROI",          dest:"Ads tab — GMV Max",                      color:"#c77dff" },
                  { label:"Inventory",                 cols:"Product name, Units on hand, Incoming",                                              dest:"Inventory tab",                          color:"#f5c518" },
                  { label:"Sales & Performance",       cols:"Product name, Revenue, Units sold, ROAS, Margin %, VCR %",                           dest:"Products & Overview tabs",               color:"#00e5a0" },
                ].map((row,i)=>(
                  <div key={i} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.02)", borderRadius:8, borderLeft:`3px solid ${row.color}` }}>
                    <div style={{ fontSize:11, fontWeight:700, color:row.color, marginBottom:4 }}>{row.label}</div>
                    <div style={{ fontSize:10, color:"#555", marginBottom:4, lineHeight:1.5 }}>{row.cols}</div>
                    <div style={{ fontSize:10, color:"#444" }}>→ {row.dest}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Import history */}
            {importHistory.length>0&&(
              <div style={{ ...S.card, marginTop:16 }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:12 }}>Import History</div>
                {importHistory.map((h,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:i<importHistory.length-1?"1px solid rgba(255,255,255,0.04)":"none", fontSize:11 }}>
                    <span style={{ color:"#888" }}>{h.date}</span>
                    <span style={{ color:"#555", fontSize:10 }}>{h.source||"Import"}</span>
                    <span style={{ color:"#00e5a0", fontWeight:700 }}>{h.rowCount} rows</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}





        {/* ── OVERVIEW ── */}
        {tab==="overview" && (
          <div>
            {/* Global filter context banner */}
            {globalTags.length>0 && (
              <div style={{ marginBottom:16, padding:"12px 16px", background:"rgba(255,107,53,0.06)", border:"1px solid rgba(255,107,53,0.2)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                  <span style={{ fontSize:10, color:"#ff6b35", fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>Tag Filter Active</span>
                  {globalTags.map(({type,tag})=><span key={type+tag} style={{ fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, background:TAG_TYPES[type].bg, color:TAG_TYPES[type].color, border:`1px solid ${TAG_TYPES[type].color}44` }}>{tag}</span>)}
                  <span style={{ fontSize:11, color:"#555" }}>— showing {scopedTotals.count} products · ${(scopedTotals.rev/1000).toFixed(1)}k rev · {scopedTotals.roas>0?scopedTotals.roas+"x ROAS":""}</span>
                </div>
                <button onClick={()=>setGlobalTags([])} style={{ fontSize:10, color:"#ff4d6d", background:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>✕ Clear</button>
              </div>
            )}
            <div style={{ marginBottom:20 }}>
              {d.alerts.map((a,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:8, marginBottom:8, background:a.type==="opportunity"?"rgba(0,229,160,0.06)":a.type==="warning"?"rgba(255,77,109,0.06)":"rgba(255,255,255,0.04)", border:`1px solid ${a.type==="opportunity"?"rgba(0,229,160,0.15)":a.type==="warning"?"rgba(255,77,109,0.15)":"rgba(255,255,255,0.07)"}`, fontSize:12, color:a.type==="opportunity"?"#00e5a0":a.type==="warning"?"#ff4d6d":"#888" }}>
                  <span>{a.type==="opportunity"?"↑":a.type==="warning"?"!":"·"}</span><span>{a.msg}</span>
                </div>
              ))}
            </div>
            <div style={{ ...S.card, marginBottom:16, background:"rgba(0,229,160,0.04)", border:"1px solid rgba(0,229,160,0.12)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div><div style={S.lbl}>Today's Revenue</div><div style={{ ...S.big, fontSize:42 }}>{fmt(d.revenue.today)}</div><div style={{ marginTop:6, display:"flex", alignItems:"center", gap:12 }}><TrendBadge val={pct(d.revenue.today,d.revenue.yesterday)}/><span style={S.sub}>vs yesterday ({fmt(d.revenue.yesterday)})</span></div></div>
                <div style={{ textAlign:"right" }}><div style={{ fontSize:10, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Daily Goal</div><div style={{ fontSize:22, fontWeight:700, color:"#00e5a0" }}>{Math.min((d.revenue.today/d.revenue.goal)*100,100).toFixed(0)}%</div><div style={{ fontSize:11, color:"#444" }}>of {fmt(d.revenue.goal)}</div><SparkLine data={d.revenue.weeklyTrend}/></div>
              </div>
              <MiniBar value={d.revenue.today} max={d.revenue.goal} color="#00e5a0"/>
            </div>
            <div style={S.g4}>
              {[{lbl:"Blended ROAS",val:d.blendedROAS+"x",s:"Paid + Organic + Aff.",c:"#fff"},{lbl:"Avg Order Value",val:"$"+d.aov,s:"vs $59 benchmark",c:d.aov>=59?"#00e5a0":"#ff4d6d"},{lbl:"New Customers",val:d.newCustomers,s:d.repeatCustomers+" returning",c:"#fff"},{lbl:"Cart Abandon",val:d.cartAbandon+"%",s:"Target: <25%",c:d.cartAbandon>25?"#ff4d6d":"#00e5a0"}].map((m,i)=>(
                <div key={i} style={S.card}><div style={S.lbl}>{m.lbl}</div><div style={{ ...S.big, fontSize:26, color:m.c }}>{m.val}</div><div style={S.sub}>{m.s}</div></div>
              ))}
            </div>
            <div style={{ ...S.g3, gridTemplateColumns:"2fr 1fr 1fr" }}>
              <ContentRatioCard weekRevenue={cs.weekRevenue} totalPieces={cs.totalPieces} prevWeekRevenue={cs.prevWeekRevenue} prevWeekPieces={cs.prevWeekPieces}/>
              <div style={S.card}><div style={S.lbl}>Content in Market</div><div style={{ ...S.big, fontSize:26 }}>{cs.totalPieces}<span style={{ fontSize:13, color:"#555", marginLeft:4 }}>pieces</span></div><div style={{ fontSize:11, color:"#555", marginTop:4 }}>{cs.organicPosts} organic · {cs.affiliatePosts} affiliate</div><div style={{ fontSize:11, color:"#555" }}>{cs.liveCount} LIVEs · {cs.sparkAds} Spark Ads</div></div>
              <div style={S.card}><div style={S.lbl}>Week Revenue</div><div style={{ ...S.big, fontSize:26 }}>{fmt(cs.weekRevenue)}</div><div style={{ fontSize:11, color:"#555", marginTop:4 }}><TrendBadge val={pct(cs.weekRevenue,cs.prevWeekRevenue)}/><span style={{ marginLeft:6 }}>vs prior week</span></div></div>
            </div>
            <div style={S.sec}>Revenue by Channel</div>
            <div style={S.g3}>
              {[{name:"Organic",rev:d.channels.organic.revenue,color:"#00e5a0"},{name:"Paid Ads",rev:d.channels.paid.revenue,color:"#ff6b35"},{name:"Affiliate",rev:d.channels.affiliate.revenue,color:"#c77dff"}].map((ch,i)=>(
                <div key={i} style={S.card}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}><div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#555", fontWeight:700 }}>{ch.name}</div><div style={{ fontSize:10, color:ch.color, fontWeight:700 }}>{Math.round(ch.rev/d.revenue.today*100)}% of rev</div></div><div style={{ fontSize:24, fontWeight:700, color:"#fff", marginBottom:6 }}>{fmt(ch.rev)}</div><MiniBar value={ch.rev} max={d.revenue.today} color={ch.color}/></div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab==="products" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={S.sec}>Product Performance — Today</div>
              {globalTags.length>0 && <span style={{ fontSize:11, color:"#ff6b35" }}>Filtered: {globalFilteredProds.length} of {catalog.length} products</span>}
            </div>
            <div style={S.card}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr>{["Product","Units","Revenue","EMV","VCR %","ROAS","Repeat %","Margin"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>{globalFilteredProds.filter(p=>p.status!=="paused").map((p,i)=>(
                  <tr key={i}><td style={S.td}><TrendDot trend={p.trend||"flat"}/><span style={{ fontWeight:600 }}>{p.name}</span></td><td style={S.td}><span style={{ color:"#aaa" }}>{p.units||"—"}</span></td><td style={S.td}><span style={{ fontWeight:700 }}>{p.revenue>0?fmt(p.revenue):"—"}</span></td><td style={S.td}><span style={{ color:"#c77dff" }}>{p.emv>0?fmt(p.emv):"—"}</span></td><td style={S.td}><span style={{ color:p.vcr>=3?"#00e5a0":p.vcr>=1.5?"#f5c518":p.vcr>0?"#ff4d6d":"#444" }}>{p.vcr>0?p.vcr+"%":"—"}</span></td><td style={S.td}><span style={{ color:p.roas>=2.5?"#00e5a0":p.roas>=1.5?"#f5c518":p.roas>0?"#ff4d6d":"#444" }}>{p.roas>0?p.roas+"x":"—"}</span></td><td style={S.td}><span style={{ color:p.repeatRate>=50?"#00e5a0":"#aaa" }}>{p.repeatRate>0?p.repeatRate+"%":"—"}</span></td><td style={S.td}><span style={{ color:p.margin>=25?"#00e5a0":p.margin>=10?"#f5c518":p.margin>0?"#ff4d6d":"#444" }}>{p.margin>0?p.margin+"%":"—"}</span></td></tr>
                ))}</tbody>
              </table>
              {globalFilteredProds.filter(p=>p.status!=="paused").length===0 && <div style={{ padding:"30px 0", textAlign:"center", color:"#555", fontSize:12 }}>No products match the current tag filter.</div>}
            </div>

            {/* Scoped aggregate when filtered */}
            {globalTags.length>0 && scopedTotals.rev>0 && (
              <div style={{ ...S.card, marginTop:16, background:"rgba(255,107,53,0.04)", border:"1px solid rgba(255,107,53,0.15)" }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#ff6b35", fontWeight:700, marginBottom:14 }}>Filtered Totals</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
                  {[
                    ["Revenue",  "$"+(scopedTotals.rev/1000).toFixed(1)+"k", "#fff"],
                    ["Units",    scopedTotals.units,                           "#aaa"],
                    ["ROAS",     scopedTotals.roas>0?scopedTotals.roas+"x":"—", scopedTotals.roas>=2.5?"#00e5a0":"#f5c518"],
                    ["Avg Margin",scopedTotals.margin>0?scopedTotals.margin+"%":"—", scopedTotals.margin>=25?"#00e5a0":"#f5c518"],
                    ["Total EMV","$"+(scopedTotals.emv/1000).toFixed(1)+"k",  "#c77dff"],
                    ["Ad Spend", "$"+(scopedTotals.adSpend/1000).toFixed(1)+"k","#ff6b35"],
                  ].map(([k,v,c])=>(
                    <div key={k} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:9, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{k}</div>
                      <div style={{ fontSize:16, fontWeight:700, color:c }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CHANNELS ── */}
        {tab==="channels" && (
          <div>
            {/* Channel summary cards */}
            <div style={S.sec}>Channel Overview</div>
            <div style={S.g3}>
              {[
                { label:"Organic Videos", color:"#00e5a0", rows:[["Revenue",fmt(d.channels.organic.revenue)],["Impressions",(d.channels.organic.impressions/1000).toFixed(0)+"K"],["VCR",d.channels.organic.vcr+"%"],["Completion",d.channels.organic.completionRate+"%"]] },
                { label:"Paid Ads",       color:"#ff6b35", rows:[["Revenue",fmt(d.channels.paid.revenue)],["Ad Spend",fmt(d.channels.paid.spend)],["ROAS",d.channels.paid.roas+"x"],["CTR",d.channels.paid.ctr+"%"]] },
                { label:"Affiliate",      color:"#c77dff", rows:[["Revenue",fmtFull(affTotalRevenue)],["Total Views",(affTotalViews/1000).toFixed(0)+"K"],["Creators",affiliates.length],["Avg Commission",affAvgCommission+"%"]] },
              ].map((ch,i)=>(
                <div key={i} style={S.card}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:ch.color, marginBottom:14 }}>{ch.label}</div>
                  {ch.rows.map(([k,v])=>(<div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}><div style={{ fontSize:11, color:"#666" }}>{k}</div><div style={{ fontSize:13, fontWeight:700 }}>{v}</div></div>))}
                </div>
              ))}
            </div>

            {/* ── AFFILIATE DEEP DIVE ── */}
            <div style={{ marginTop:8, marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
              <div>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#c77dff", fontWeight:700, marginBottom:4 }}>Affiliate Deep Dive</div>
                <div style={{ fontSize:11, color:"#555" }}>{affiliates.length} active creators · {allVideos.length} tracked videos · ${(affTotalRevenue/1000).toFixed(1)}k attributed revenue</div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                {/* View toggle */}
                <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.03)", borderRadius:7, padding:3, border:"1px solid rgba(255,255,255,0.07)" }}>
                  {[{id:"overview",label:"Overview"},{id:"creators",label:"Creators"},{id:"videos",label:"Videos"}].map(v=>(
                    <button key={v.id} onClick={()=>setAffView(v.id)} style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", padding:"6px 13px", cursor:"pointer", borderRadius:5, background:affView===v.id?"rgba(199,125,255,0.12)":"none", color:affView===v.id?"#c77dff":"#555", border:affView===v.id?"1px solid rgba(199,125,255,0.3)":"1px solid transparent", whiteSpace:"nowrap" }}>{v.label}</button>
                  ))}
                </div>
                {/* Paste button */}
                <button onClick={()=>setAffPasteOpen(o=>!o)} style={{ fontSize:11, padding:"6px 12px", borderRadius:6, cursor:"pointer", background:"rgba(199,125,255,0.08)", color:"#c77dff", border:"1px solid rgba(199,125,255,0.2)" }}>
                  {affPasteOpen?"▲ Collapse":"▼ Paste Data"}
                </button>
              </div>
            </div>

            {/* Paste panel */}
            {affPasteOpen && (
              <div style={{ ...S.card, marginBottom:16, border:"1px solid rgba(199,125,255,0.2)" }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#c77dff", fontWeight:700, marginBottom:8 }}>Paste Affiliate / Creator Data</div>
                <div style={{ fontSize:11, color:"#555", marginBottom:10, lineHeight:1.6 }}>
                  Columns: <strong style={{ color:"#e8e8f0" }}>Handle, Tier, Followers, Revenue, Views, Orders, Commission %</strong>. Headers auto-detected. Include the @ in handles or the importer adds it automatically.
                </div>
                <textarea value={affPasteText} onChange={e=>{ setAffPasteText(e.target.value); setAffPasteError(""); }}
                  placeholder={"Handle\tTier\tFollowers\tRevenue\tViews\tOrders\tCommission\n@glowwithsara\tmicro\t48000\t4820\t142000\t138\t20\n@beautybykim\tmid\t184000\t6290\t310000\t180\t15"}
                  style={{ width:"100%", height:120, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#e8e8f0", fontFamily:"monospace", fontSize:11, padding:10, resize:"vertical", outline:"none", lineHeight:1.6 }}/>
                <div style={{ display:"flex", gap:10, marginTop:10, alignItems:"center" }}>
                  <button onClick={handleAffPaste} style={{ fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:7, background:"rgba(199,125,255,0.1)", color:"#c77dff", border:"1px solid rgba(199,125,255,0.3)", cursor:"pointer" }}>Import →</button>
                  <input ref={affFileRef} type="file" accept=".csv,.tsv,.txt" onChange={e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setAffPasteText(ev.target.result); r.readAsText(f); }} style={{ display:"none" }}/>
                  <button onClick={()=>affFileRef.current.click()} style={{ fontSize:11, padding:"6px 12px", borderRadius:7, background:"rgba(255,255,255,0.04)", color:"#888", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>Upload file</button>
                  {affPasteText && <button onClick={()=>setAffPasteText("")} style={{ fontSize:11, color:"#ff4d6d", background:"transparent", border:"none", cursor:"pointer" }}>✕ Clear</button>}
                </div>
                {affPasteError && <div style={{ marginTop:8, fontSize:11, color:"#ff4d6d", padding:"6px 10px", background:"rgba(255,77,109,0.08)", borderRadius:6 }}>⚠ {affPasteError}</div>}
                {affPasteOk    && <div style={{ marginTop:8, fontSize:11, color:"#00e5a0" }}>✓ Affiliate data updated.</div>}
              </div>
            )}

            {/* Sort + product filter bar */}
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14, flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:10, color:"#555" }}>Sort by:</span>
                {["revenue","views","orders","vcr"].map(s=>(
                  <button key={s} onClick={()=>setAffSortBy(s)} style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, cursor:"pointer", background:affSortBy===s?"rgba(199,125,255,0.12)":"transparent", color:affSortBy===s?"#c77dff":"#555", border:`1px solid ${affSortBy===s?"rgba(199,125,255,0.3)":"rgba(255,255,255,0.08)"}`, textTransform:"capitalize" }}>{s}</button>
                ))}
              </div>
              {affView==="videos" && (
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:10, color:"#555" }}>Product:</span>
                  <button onClick={()=>setAffProductFilter("all")} style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, cursor:"pointer", background:affProductFilter==="all"?"rgba(255,255,255,0.1)":"transparent", color:affProductFilter==="all"?"#e8e8f0":"#555", border:"1px solid rgba(255,255,255,0.1)" }}>All</button>
                  {affProducts.map(p=>(
                    <button key={p} onClick={()=>setAffProductFilter(p)} style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, cursor:"pointer", background:affProductFilter===p?"rgba(199,125,255,0.12)":"transparent", color:affProductFilter===p?"#c77dff":"#555", border:`1px solid ${affProductFilter===p?"rgba(199,125,255,0.3)":"rgba(255,255,255,0.08)"}`, maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p}</button>
                  ))}
                </div>
              )}
            </div>

            {/* ── OVERVIEW VIEW ── */}
            {affView==="overview" && (
              <div>
                {/* Top-line affiliate KPIs */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
                  {[
                    ["Total Affiliate Revenue", fmtFull(affTotalRevenue), "#c77dff"],
                    ["Total Orders",            affTotalOrders,            "#fff"],
                    ["Total Views",             (affTotalViews/1000).toFixed(0)+"K", "#aaa"],
                    ["Avg Commission",          affAvgCommission+"%",      "#f5c518"],
                  ].map(([k,v,c])=>(
                    <div key={k} style={{ ...S.card, textAlign:"center", padding:"14px 12px" }}>
                      <div style={{ fontSize:9, color:"#444", letterSpacing:1.5, textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>{k}</div>
                      <div style={{ fontSize:22, fontWeight:700, color:c }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Revenue by product from affiliates */}
                <div style={{ ...S.card, marginBottom:16 }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Affiliate Revenue by Product</div>
                  {affProducts.map(prod=>{
                    const prodVideos = allVideos.filter(v=>v.product===prod);
                    const rev = prodVideos.reduce((s,v)=>s+v.revenue,0);
                    const views = prodVideos.reduce((s,v)=>s+v.views,0);
                    const orders = prodVideos.reduce((s,v)=>s+v.orders,0);
                    const avgVcr = prodVideos.length ? r2(prodVideos.reduce((s,v)=>s+v.vcr,0)/prodVideos.length) : 0;
                    const pct = affTotalRevenue>0 ? r2(rev/affTotalRevenue*100) : 0;
                    const catProd = catalog.find(p=>p.name===prod);
                    return (
                      <div key={prod} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ minWidth:160, fontSize:12, fontWeight:700 }}>{prod}</div>
                        <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:pct+"%", background:"#c77dff", borderRadius:3 }}/>
                        </div>
                        <div style={{ display:"flex", gap:16, fontSize:11 }}>
                          <span style={{ fontWeight:700, color:"#c77dff", minWidth:60 }}>${(rev/1000).toFixed(1)}k</span>
                          <span style={{ color:"#555", minWidth:70 }}>{(views/1000).toFixed(0)}K views</span>
                          <span style={{ color:"#555", minWidth:55 }}>{orders} orders</span>
                          <span style={{ color:avgVcr>=3?"#00e5a0":avgVcr>=2?"#f5c518":"#ff4d6d", minWidth:55 }}>VCR {avgVcr}%</span>
                          <span style={{ fontSize:10, color:"#444" }}>{prodVideos.length} video{prodVideos.length!==1?"s":""} · {[...new Set(prodVideos.map(v=>v.handle))].length} creators</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tier breakdown */}
                <div style={{ ...S.card }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Performance by Creator Tier</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                    {["nano","micro","mid","macro"].map(tier=>{
                      const tCreators = affiliates.filter(a=>a.tier===tier);
                      if (!tCreators.length) return null;
                      const tRev    = tCreators.reduce((s,a)=>s+a.totalRevenue,0);
                      const tViews  = tCreators.reduce((s,a)=>s+a.totalViews,0);
                      const tOrders = tCreators.reduce((s,a)=>s+a.totalOrders,0);
                      const tAvgComm= r2(tCreators.reduce((s,a)=>s+a.commission,0)/tCreators.length);
                      const tierColors = { nano:"#00e5a0", micro:"#f5c518", mid:"#ff6b35", macro:"#c77dff" };
                      const c = tierColors[tier];
                      return (
                        <div key={tier} style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"14px 14px", border:`1px solid ${c}22` }}>
                          <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:c, fontWeight:700, marginBottom:10 }}>{tier} <span style={{ color:"#444", fontWeight:400 }}>({tCreators.length})</span></div>
                          {[["Revenue","$"+(tRev/1000).toFixed(1)+"k"],["Views",(tViews/1000).toFixed(0)+"K"],["Orders",tOrders],["Avg Comm",tAvgComm+"%"]].map(([k,v])=>(
                            <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:11 }}>
                              <span style={{ color:"#555" }}>{k}</span>
                              <span style={{ fontWeight:700 }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── CREATORS VIEW ── */}
            {affView==="creators" && (
              <div style={S.card}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr>{["Creator","Tier","Followers","Revenue","Views","Orders","Avg VCR","Commission","Videos",""].map(h=>(
                      <th key={h} style={{ ...S.th, fontSize:8, whiteSpace:"nowrap" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {[...affiliates].sort((a,b)=>{
                      if (affSortBy==="views")  return b.totalViews-a.totalViews;
                      if (affSortBy==="orders") return b.totalOrders-a.totalOrders;
                      if (affSortBy==="vcr") {
                        const aVcr = a.videos.length ? r2(a.videos.reduce((s,v)=>s+v.vcr,0)/a.videos.length) : 0;
                        const bVcr = b.videos.length ? r2(b.videos.reduce((s,v)=>s+v.vcr,0)/b.videos.length) : 0;
                        return bVcr-aVcr;
                      }
                      return b.totalRevenue-a.totalRevenue;
                    }).map(creator=>{
                      const avgVcr = creator.videos.length ? r2(creator.videos.reduce((s,v)=>s+v.vcr,0)/creator.videos.length) : 0;
                      const tierColors = { nano:"#00e5a0", micro:"#f5c518", mid:"#ff6b35", macro:"#c77dff" };
                      const tc = tierColors[creator.tier]||"#aaa";
                      const isExpanded = affExpandedCreator===creator.id;
                      return (
                        <>
                          <tr key={creator.id} style={{ background:isExpanded?"rgba(199,125,255,0.04)":"transparent" }}>
                            <td style={S.td}><span style={{ fontWeight:700, color:"#c77dff" }}>{creator.handle}</span></td>
                            <td style={S.td}><span style={{ fontSize:9, fontWeight:700, color:tc, background:tc+"18", padding:"2px 7px", borderRadius:20, textTransform:"capitalize" }}>{creator.tier}</span></td>
                            <td style={S.td}><span style={{ color:"#aaa" }}>{creator.followers>0?(creator.followers/1000).toFixed(0)+"K":"—"}</span></td>
                            <td style={S.td}><span style={{ fontWeight:700, color:"#c77dff" }}>${(creator.totalRevenue/1000).toFixed(1)}k</span></td>
                            <td style={S.td}><span style={{ color:"#aaa" }}>{(creator.totalViews/1000).toFixed(0)}K</span></td>
                            <td style={S.td}>{creator.totalOrders}</td>
                            <td style={S.td}><span style={{ color:avgVcr>=3?"#00e5a0":avgVcr>=2?"#f5c518":"#ff4d6d" }}>{avgVcr>0?avgVcr+"%":"—"}</span></td>
                            <td style={S.td}><span style={{ color:"#f5c518" }}>{creator.commission}%</span></td>
                            <td style={S.td}><span style={{ color:"#555" }}>{creator.videos.length}</span></td>
                            <td style={S.td}>
                              <button onClick={()=>setAffExpandedCreator(isExpanded?null:creator.id)} style={{ fontSize:10, padding:"3px 8px", borderRadius:5, cursor:"pointer", background:"rgba(199,125,255,0.08)", color:"#c77dff", border:"1px solid rgba(199,125,255,0.2)" }}>
                                {isExpanded?"▲ Hide":"▼ Videos"}
                              </button>
                            </td>
                          </tr>
                          {isExpanded && creator.videos.map((v,vi)=>(
                            <tr key={creator.id+"v"+vi} style={{ background:"rgba(199,125,255,0.02)" }}>
                              <td colSpan={2} style={{ ...S.td, paddingLeft:20 }}><span style={{ fontSize:11, color:"#888", fontStyle:"italic" }}>{v.title}</span></td>
                              <td style={S.td}><span style={{ fontSize:10, color:"#c77dff" }}>{v.product}</span></td>
                              <td style={S.td}><span style={{ fontWeight:700 }}>${(v.revenue/1000).toFixed(1)}k</span></td>
                              <td style={S.td}><span style={{ color:"#aaa" }}>{(v.views/1000).toFixed(0)}K</span></td>
                              <td style={S.td}>{v.orders}</td>
                              <td style={S.td}><span style={{ color:v.vcr>=3?"#00e5a0":v.vcr>=2?"#f5c518":"#ff4d6d" }}>{v.vcr}%</span></td>
                              <td style={{ ...S.td, fontSize:10, color:"#555" }}>{v.date}</td>
                              <td colSpan={2} style={S.td}/>
                            </tr>
                          ))}
                        </>
                      );
                    })}
                  </tbody>
                </table>
                {affiliates.length===0&&<div style={{ padding:"30px 0", textAlign:"center", color:"#555", fontSize:12 }}>No affiliate data yet — paste creator data above.</div>}
              </div>
            )}

            {/* ── VIDEOS VIEW ── */}
            {affView==="videos" && (
              <div style={S.card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700 }}>
                    {filteredVideos.length} video{filteredVideos.length!==1?"s":""}{affProductFilter!=="all"?` for ${affProductFilter}`:""}
                  </div>
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr>{["Video Title","Creator","Tier","Product","Revenue","Views","Orders","VCR","Date"].map(h=>(
                      <th key={h} style={{ ...S.th, fontSize:8, whiteSpace:"nowrap" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {[...filteredVideos].sort((a,b)=>{
                      if (affSortBy==="views")  return b.views-a.views;
                      if (affSortBy==="orders") return b.orders-a.orders;
                      if (affSortBy==="vcr")    return b.vcr-a.vcr;
                      return b.revenue-a.revenue;
                    }).map((v,i)=>{
                      const tierColors = { nano:"#00e5a0", micro:"#f5c518", mid:"#ff6b35", macro:"#c77dff" };
                      const tc = tierColors[v.tier]||"#aaa";
                      return (
                        <tr key={i}>
                          <td style={{ ...S.td, maxWidth:200 }}><span style={{ fontWeight:600 }}>{v.title}</span></td>
                          <td style={S.td}><span style={{ color:"#c77dff", fontWeight:700 }}>{v.handle}</span></td>
                          <td style={S.td}><span style={{ fontSize:9, fontWeight:700, color:tc, background:tc+"18", padding:"2px 6px", borderRadius:20, textTransform:"capitalize" }}>{v.tier}</span></td>
                          <td style={S.td}><span style={{ color:"#aaa", fontSize:11 }}>{v.product}</span></td>
                          <td style={S.td}><span style={{ fontWeight:700, color:"#c77dff" }}>${(v.revenue/1000).toFixed(1)}k</span></td>
                          <td style={S.td}><span style={{ color:"#aaa" }}>{(v.views/1000).toFixed(0)}K</span></td>
                          <td style={S.td}>{v.orders}</td>
                          <td style={S.td}><span style={{ color:v.vcr>=3?"#00e5a0":v.vcr>=2?"#f5c518":"#ff4d6d", fontWeight:700 }}>{v.vcr}%</span></td>
                          <td style={S.td}><span style={{ fontSize:10, color:"#555" }}>{v.date}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredVideos.length===0&&<div style={{ padding:"30px 0", textAlign:"center", color:"#555", fontSize:12 }}>No videos{affProductFilter!=="all"?` for ${affProductFilter}`:""} yet.</div>}
              </div>
            )}
          </div>
        )}

        {/* ── ADS ── */}
        {tab==="ads" && blended && (
          <div>

            {/* Paste panel */}
            <div style={{ ...S.card, marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:adsPasteOpen?14:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#ff6b35", fontWeight:700 }}>TikTok Ads Manager Export</div>
                  {adsPasteOk && <span style={{ fontSize:10, color:"#00e5a0" }}>✓ Data loaded</span>}
                  {adsData===MOCK_ADS && <span style={{ fontSize:10, color:"#555" }}>showing mock data</span>}
                </div>
                <button onClick={()=>{ setAdsPasteOpen(o=>!o); setAdsPasteError(""); }} style={{ fontSize:11, padding:"5px 14px", borderRadius:6, cursor:"pointer", background:"rgba(255,107,53,0.08)", color:"#ff6b35", border:"1px solid rgba(255,107,53,0.25)" }}>
                  {adsPasteOpen?"▲ Collapse":"▼ Paste Ads Manager Data"}
                </button>
              </div>
              {adsPasteOpen && (
                <div>
                  <div style={{ fontSize:11, color:"#555", marginBottom:10, lineHeight:1.7 }}>
                    In TikTok Ads Manager → Reports → select date range → export CSV or copy table. Paste below. Columns auto-detected. Ad type inferred from campaign name if no type column exists.
                  </div>
                  <textarea value={adsPasteText} onChange={e=>{ setAdsPasteText(e.target.value); setAdsPasteError(""); }}
                    placeholder={"Ad Name\tSpend\tRevenue\tROAS\tImpressions\tClicks\tCTR\tCPM\tCPC\tConversions\tCVR\tVideo Views\tVCR\nGMV Max — All Products\t1240\t4836\t3.9\t84200\t2106\t2.5\t14.73\t0.59\t142\t6.74\t0\t0\n..."}
                    style={{ width:"100%", height:130, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#e8e8f0", fontFamily:"monospace", fontSize:11, padding:10, resize:"vertical", outline:"none", lineHeight:1.6 }}
                  />
                  <div style={{ display:"flex", gap:10, marginTop:10, alignItems:"center" }}>
                    <button onClick={handleAdsPaste} style={{ fontSize:12, fontWeight:700, padding:"8px 20px", borderRadius:7, background:"rgba(255,107,53,0.1)", color:"#ff6b35", border:"1px solid rgba(255,107,53,0.3)", cursor:"pointer" }}>Import Ads →</button>
                    <input ref={adsFileRef} type="file" accept=".csv,.tsv,.txt" onChange={e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>setAdsPasteText(ev.target.result); r.readAsText(f); }} style={{ display:"none" }}/>
                    <button onClick={()=>adsFileRef.current.click()} style={{ fontSize:11, padding:"7px 14px", borderRadius:7, background:"rgba(255,255,255,0.04)", color:"#888", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>Upload file</button>
                    {adsPasteText && <button onClick={()=>setAdsPasteText("")} style={{ fontSize:11, color:"#ff4d6d", background:"transparent", border:"none", cursor:"pointer" }}>✕ Clear</button>}
                  </div>
                  {adsPasteError && <div style={{ marginTop:8, fontSize:11, color:"#ff4d6d", padding:"6px 10px", background:"rgba(255,77,109,0.08)", borderRadius:6 }}>⚠ {adsPasteError}</div>}
                  <div style={{ marginTop:12, fontSize:10, color:"#444", lineHeight:1.7 }}>
                    <span style={{ color:"#555" }}>Ad type auto-detection:</span> name containing "GMV Max" → GMV Max · "Spark" → Spark Ads · "Live" → LIVE · everything else → In-Feed/VSA
                  </div>
                </div>
              )}
            </div>

            {/* Blended totals */}
            <div style={{ ...S.card, marginBottom:16, background:"rgba(255,107,53,0.03)", border:"1px solid rgba(255,107,53,0.12)" }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#ff6b35", fontWeight:700, marginBottom:16 }}>Blended Paid Performance — All Ad Types</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:12 }}>
                {[
                  ["Total Spend",    "$"+r2(blended.spend).toLocaleString(),          "#fff"   ],
                  ["Revenue Attrib", "$"+(blended.revenue/1000).toFixed(1)+"k",       "#00e5a0"],
                  ["Blended ROAS",   blended.roas+"x",  blended.roas>=3?"#00e5a0":blended.roas>=2?"#f5c518":"#ff4d6d"],
                  ["Impressions",    (blended.impressions/1000).toFixed(0)+"K",        "#aaa"   ],
                  ["CTR",            blended.ctr+"%",   blended.ctr>=2?"#00e5a0":blended.ctr>=1?"#f5c518":"#ff4d6d"],
                  ["CPM",            "$"+blended.cpm,   blended.cpm<=10?"#00e5a0":blended.cpm<=20?"#f5c518":"#ff4d6d"],
                  ["CPC",            "$"+blended.cpc,   blended.cpc<=0.5?"#00e5a0":blended.cpc<=1?"#f5c518":"#ff4d6d"],
                  ["CVR",            blended.cvr+"%",   blended.cvr>=4?"#00e5a0":blended.cvr>=2?"#f5c518":"#ff4d6d"],
                ].map(([k,v,c])=>(
                  <div key={k} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:9, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:6, fontWeight:700 }}>{k}</div>
                    <div style={{ fontSize:18, fontWeight:700, color:c }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* View toggle + type filter */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
              <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:4, border:"1px solid rgba(255,255,255,0.07)" }}>
                {[{id:"overview",label:"Overview"},{id:"bytype",label:"By Ad Type"},{id:"creative",label:"All Creatives"}].map(v=>(
                  <button key={v.id} onClick={()=>setAdsView(v.id)} style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", padding:"7px 16px", cursor:"pointer", borderRadius:6, background:adsView===v.id?"rgba(255,107,53,0.12)":"none", color:adsView===v.id?"#ff6b35":"#555", border:adsView===v.id?"1px solid rgba(255,107,53,0.3)":"1px solid transparent" }}>{v.label}</button>
                ))}
              </div>
              {adsView==="creative" && (
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <span style={{ fontSize:10, color:"#555" }}>Filter:</span>
                  <button onClick={()=>setAdsTypeFilter("all")} style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20, cursor:"pointer", background:adsTypeFilter==="all"?"rgba(255,255,255,0.1)":"transparent", color:adsTypeFilter==="all"?"#e8e8f0":"#555", border:"1px solid rgba(255,255,255,0.1)" }}>All</button>
                  {Object.entries(AD_TYPES).map(([key,meta])=>(
                    <button key={key} onClick={()=>setAdsTypeFilter(key)} style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20, cursor:"pointer", background:adsTypeFilter===key?meta.bg:"transparent", color:adsTypeFilter===key?meta.color:"#555", border:`1px solid ${adsTypeFilter===key?meta.color+"44":"rgba(255,255,255,0.08)"}` }}>{meta.label}</button>
                  ))}
                </div>
              )}
            </div>

            {/* ── OVERVIEW VIEW ── */}
            {adsView==="overview" && (
              <div>
                {/* Spend + ROAS by type comparison */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16, marginBottom:20 }}>
                  {byType.map(({type,meta,rows,agg})=>(
                    <div key={type} style={{ ...S.card, borderColor:meta.color+"33" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                        <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:meta.color, fontWeight:700 }}>{meta.label}</div>
                        <span style={{ fontSize:10, color:"#555" }}>{rows.length} ad{rows.length!==1?"s":""}</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                        {[
                          ["Spend",   "$"+r2(agg.spend).toLocaleString(),             "#fff"   ],
                          ["Revenue", "$"+(agg.revenue/1000).toFixed(1)+"k",          "#00e5a0"],
                          ["ROAS",    agg.roas+"x", agg.roas>=3?"#00e5a0":agg.roas>=2?"#f5c518":"#ff4d6d"],
                          ["CVR",     agg.cvr+"%",  agg.cvr>=4?"#00e5a0":agg.cvr>=2?"#f5c518":"#ff4d6d"],
                        ].map(([k,v,c])=>(
                          <div key={k} style={{ background:"rgba(255,255,255,0.03)", borderRadius:6, padding:"8px 10px" }}>
                            <div style={{ fontSize:9, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>{k}</div>
                            <div style={{ fontSize:14, fontWeight:700, color:c }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
                        {[
                          ["CTR",  agg.ctr+"%",  agg.ctr>=2?"#00e5a0":agg.ctr>=1?"#f5c518":"#ff4d6d"],
                          ["CPM",  "$"+agg.cpm,  agg.cpm<=10?"#00e5a0":agg.cpm<=20?"#f5c518":"#ff4d6d"],
                          ["CPC",  "$"+agg.cpc,  agg.cpc<=0.5?"#00e5a0":agg.cpc<=1?"#f5c518":"#ff4d6d"],
                        ].map(([k,v,c])=>(
                          <div key={k} style={{ textAlign:"center", padding:"6px 4px", background:"rgba(255,255,255,0.02)", borderRadius:5 }}>
                            <div style={{ fontSize:8, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>{k}</div>
                            <div style={{ fontSize:12, fontWeight:700, color:c }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      {agg.videoViews>0 && (
                        <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between" }}>
                          <span style={{ fontSize:10, color:"#555" }}>Video Views</span>
                          <span style={{ fontSize:11, fontWeight:700, color:"#aaa" }}>{(agg.videoViews/1000).toFixed(0)}K</span>
                          <span style={{ fontSize:10, color:"#555" }}>VCR</span>
                          <span style={{ fontSize:11, fontWeight:700, color:agg.vcr>=3?"#00e5a0":agg.vcr>=1.5?"#f5c518":"#ff4d6d" }}>{agg.vcr}%</span>
                        </div>
                      )}
                      <MiniBar value={agg.spend} max={Math.max(...byType.map(t=>t.agg.spend),1)} color={meta.color}/>
                      <div style={{ fontSize:9, color:"#444", marginTop:4, textAlign:"right" }}>{r2(agg.spend/blended.spend*100)}% of total spend</div>
                    </div>
                  ))}
                </div>

                {/* Efficiency benchmarks */}
                <div style={{ ...S.card }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:14 }}>Efficiency Benchmarks — TikTok Shop Targets</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
                    {[
                      { metric:"ROAS",  yours:blended.roas,   target:3.0,  fmt:v=>v+"x",   higher:true  },
                      { metric:"CTR",   yours:blended.ctr,    target:1.5,  fmt:v=>v+"%",   higher:true  },
                      { metric:"CVR",   yours:blended.cvr,    target:3.0,  fmt:v=>v+"%",   higher:true  },
                      { metric:"CPM",   yours:blended.cpm,    target:15,   fmt:v=>"$"+v,   higher:false },
                      { metric:"CPC",   yours:blended.cpc,    target:0.80, fmt:v=>"$"+v,   higher:false },
                      { metric:"VCR",   yours:blended.vcr||0, target:3.0,  fmt:v=>v+"%",   higher:true  },
                    ].map(({metric,yours,target,fmt,higher})=>{
                      const beating = higher ? yours>=target : yours<=target;
                      const pctOff  = target>0 ? r2(Math.abs(yours-target)/target*100) : 0;
                      return (
                        <div key={metric} style={{ background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"12px 10px", textAlign:"center" }}>
                          <div style={{ fontSize:9, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8, fontWeight:700 }}>{metric}</div>
                          <div style={{ fontSize:20, fontWeight:700, color:beating?"#00e5a0":"#ff4d6d", marginBottom:4 }}>{fmt(yours)}</div>
                          <div style={{ fontSize:9, color:"#555", marginBottom:6 }}>target {fmt(target)}</div>
                          <div style={{ fontSize:10, fontWeight:700, color:beating?"#00e5a0":"#ff4d6d" }}>
                            {beating ? `✓ +${pctOff}%` : `✕ -${pctOff}%`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── BY TYPE VIEW ── */}
            {adsView==="bytype" && (
              <div>
                {byType.map(({type,meta,rows,agg})=>(
                  <div key={type} style={{ ...S.card, marginBottom:16, borderColor:meta.color+"22" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                      <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:meta.color, fontWeight:700 }}>{meta.label}</div>
                      <div style={{ display:"flex", gap:20, fontSize:11 }}>
                        <span style={{ color:"#555" }}>Spend <strong style={{ color:"#fff" }}>${r2(agg.spend).toLocaleString()}</strong></span>
                        <span style={{ color:"#555" }}>ROAS <strong style={{ color:agg.roas>=3?"#00e5a0":agg.roas>=2?"#f5c518":"#ff4d6d" }}>{agg.roas}x</strong></span>
                        <span style={{ color:"#555" }}>Revenue <strong style={{ color:"#00e5a0" }}>${(agg.revenue/1000).toFixed(1)}k</strong></span>
                        <span style={{ color:"#555" }}>CVR <strong style={{ color:agg.cvr>=4?"#00e5a0":agg.cvr>=2?"#f5c518":"#ff4d6d" }}>{agg.cvr}%</strong></span>
                      </div>
                    </div>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                      <thead>
                        <tr>{["Ad Name","Spend","Revenue","ROAS","Impressions","CTR","CPM","CPC","Conversions","CVR",...(rows.some(r=>r.videoViews>0)?["Video Views","VCR"]:[])].map(h=>(
                          <th key={h} style={{ ...S.th, fontSize:8, whiteSpace:"nowrap" }}>{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody>
                        {rows.sort((a,b)=>b.spend-a.spend).map(ad=>(
                          <tr key={ad.id}>
                            <td style={{ ...S.td, maxWidth:200 }}><span style={{ fontWeight:600 }}>{ad.name}</span></td>
                            <td style={S.td}><span style={{ fontWeight:700 }}>${ad.spend.toLocaleString()}</span></td>
                            <td style={S.td}><span style={{ color:"#00e5a0" }}>${(ad.revenue/1000).toFixed(1)}k</span></td>
                            <td style={S.td}><span style={{ color:ad.roas>=3?"#00e5a0":ad.roas>=2?"#f5c518":"#ff4d6d", fontWeight:700 }}>{ad.roas}x</span></td>
                            <td style={S.td}><span style={{ color:"#aaa" }}>{ad.impressions>0?(ad.impressions/1000).toFixed(0)+"K":"—"}</span></td>
                            <td style={S.td}><span style={{ color:ad.ctr>=2?"#00e5a0":ad.ctr>=1?"#f5c518":ad.ctr>0?"#ff4d6d":"#444" }}>{ad.ctr>0?ad.ctr+"%":"—"}</span></td>
                            <td style={S.td}><span style={{ color:ad.cpm<=10?"#00e5a0":ad.cpm<=20?"#f5c518":ad.cpm>0?"#ff4d6d":"#444" }}>{ad.cpm>0?"$"+ad.cpm:"—"}</span></td>
                            <td style={S.td}><span style={{ color:ad.cpc<=0.5?"#00e5a0":ad.cpc<=1?"#f5c518":ad.cpc>0?"#ff4d6d":"#444" }}>{ad.cpc>0?"$"+ad.cpc:"—"}</span></td>
                            <td style={S.td}><span style={{ color:"#aaa" }}>{ad.conversions||"—"}</span></td>
                            <td style={S.td}><span style={{ color:ad.cvr>=4?"#00e5a0":ad.cvr>=2?"#f5c518":ad.cvr>0?"#ff4d6d":"#444" }}>{ad.cvr>0?ad.cvr+"%":"—"}</span></td>
                            {rows.some(r=>r.videoViews>0) && <>
                              <td style={S.td}><span style={{ color:"#aaa" }}>{ad.videoViews>0?(ad.videoViews/1000).toFixed(0)+"K":"—"}</span></td>
                              <td style={S.td}><span style={{ color:ad.vcr>=3?"#00e5a0":ad.vcr>=1.5?"#f5c518":ad.vcr>0?"#ff4d6d":"#444" }}>{ad.vcr>0?ad.vcr+"%":"—"}</span></td>
                            </>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}

            {/* ── ALL CREATIVES VIEW ── */}
            {adsView==="creative" && (
              <div style={S.card}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                  <thead>
                    <tr>{["Ad Name","Type","Spend","Revenue","ROAS","CTR","CPM","CPC","CVR","Video Views","VCR"].map(h=>(
                      <th key={h} style={{ ...S.th, fontSize:8, whiteSpace:"nowrap" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {filteredAds.sort((a,b)=>b.roas-a.roas).map(ad=>{
                      const meta = AD_TYPES[ad.type];
                      return (
                        <tr key={ad.id}>
                          <td style={{ ...S.td, maxWidth:220 }}><span style={{ fontWeight:600 }}>{ad.name}</span></td>
                          <td style={S.td}><span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:20, background:meta.bg, color:meta.color, whiteSpace:"nowrap" }}>{meta.label}</span></td>
                          <td style={S.td}><span style={{ fontWeight:700 }}>${ad.spend.toLocaleString()}</span></td>
                          <td style={S.td}><span style={{ color:"#00e5a0" }}>${(ad.revenue/1000).toFixed(1)}k</span></td>
                          <td style={S.td}><span style={{ color:ad.roas>=3?"#00e5a0":ad.roas>=2?"#f5c518":"#ff4d6d", fontWeight:700 }}>{ad.roas}x</span></td>
                          <td style={S.td}><span style={{ color:ad.ctr>=2?"#00e5a0":ad.ctr>=1?"#f5c518":ad.ctr>0?"#ff4d6d":"#444" }}>{ad.ctr>0?ad.ctr+"%":"—"}</span></td>
                          <td style={S.td}><span style={{ color:ad.cpm<=10?"#00e5a0":ad.cpm<=20?"#f5c518":ad.cpm>0?"#ff4d6d":"#444" }}>{ad.cpm>0?"$"+ad.cpm:"—"}</span></td>
                          <td style={S.td}><span style={{ color:ad.cpc<=0.5?"#00e5a0":ad.cpc<=1?"#f5c518":ad.cpc>0?"#ff4d6d":"#444" }}>{ad.cpc>0?"$"+ad.cpc:"—"}</span></td>
                          <td style={S.td}><span style={{ color:ad.cvr>=4?"#00e5a0":ad.cvr>=2?"#f5c518":ad.cvr>0?"#ff4d6d":"#444" }}>{ad.cvr>0?ad.cvr+"%":"—"}</span></td>
                          <td style={S.td}><span style={{ color:"#aaa" }}>{ad.videoViews>0?(ad.videoViews/1000).toFixed(0)+"K":"—"}</span></td>
                          <td style={S.td}><span style={{ color:ad.vcr>=3?"#00e5a0":ad.vcr>=1.5?"#f5c518":ad.vcr>0?"#ff4d6d":"#444" }}>{ad.vcr>0?ad.vcr+"%":"—"}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredAds.length===0 && <div style={{ padding:"30px 0", textAlign:"center", color:"#555", fontSize:12 }}>No ads match the current filter.</div>}
              </div>
            )}

            {/* ── RECOMMENDATIONS ── */}
            {(()=>{
              // Build signal-based recommendations from adsData + catalog
              const recs = [];

              // Helper: find catalog product that best matches an ad name
              const matchProd = (adName) => catalog.find(p =>
                adName.toLowerCase().includes(p.name.toLowerCase().split(" ")[0].toLowerCase())
              );

              // 1. Scale: high ROAS + not top spend share
              const maxSpend = Math.max(...adsData.map(a=>a.spend), 1);
              adsData.filter(a=>a.roas>=3.5 && a.spend < maxSpend*0.35).forEach(a=>{
                recs.push({
                  priority:"high", type:"scale",
                  title:`Scale budget on "${a.name}"`,
                  detail:`ROAS ${a.roas}x is well above target (3x) but spend is only $${a.spend} — ${r2(a.spend/blended.spend*100)}% of total. Room to push harder.`,
                  action:"↑ Increase spend",
                  ad: a,
                });
              });

              // 2. Cut: low ROAS + meaningful spend
              adsData.filter(a=>a.roas>0 && a.roas<2 && a.spend>100).forEach(a=>{
                recs.push({
                  priority:"high", type:"cut",
                  title:`Pause or cut "${a.name}"`,
                  detail:`ROAS ${a.roas}x is below break-even threshold (2x). Spending $${a.spend} with only $${a.revenue} attributed revenue. Reallocate to better-performing campaigns.`,
                  action:"↓ Reduce / pause spend",
                  ad: a,
                });
              });

              // 3. Fix CTR: low CTR but decent ROAS (creative problem, not product)
              adsData.filter(a=>a.ctr>0 && a.ctr<1.0 && a.roas>=2).forEach(a=>{
                recs.push({
                  priority:"medium", type:"creative",
                  title:`Refresh creative for "${a.name}"`,
                  detail:`CTR ${a.ctr}% is below 1% benchmark — the product converts (ROAS ${a.roas}x) but the hook isn't stopping the scroll. Test a new thumbnail, opening 3 seconds, or UGC angle.`,
                  action:"✎ New creative test",
                  ad: a,
                });
              });

              // 4. Fix CVR: good CTR but low CVR (landing page / product page problem)
              adsData.filter(a=>a.ctr>=1.5 && a.cvr>0 && a.cvr<2.5).forEach(a=>{
                recs.push({
                  priority:"medium", type:"product",
                  title:`Improve product page for "${a.name}"`,
                  detail:`CTR ${a.ctr}% is strong — people are clicking — but CVR ${a.cvr}% is low. Check product listing: images, reviews, price vs competitors, and first video.`,
                  action:"⊕ Audit product listing",
                  ad: a,
                });
              });

              // 5. VCR signal: Spark/infeed with low VCR
              adsData.filter(a=>["spark","infeed"].includes(a.type) && a.vcr>0 && a.vcr<2.5).forEach(a=>{
                recs.push({
                  priority:"medium", type:"creative",
                  title:`Low video completion on "${a.name}"`,
                  detail:`VCR ${a.vcr}% suggests viewers are dropping early. Tighten the hook to under 2 seconds, lead with the result/transformation, not the problem.`,
                  action:"✎ Edit video hook",
                  ad: a,
                });
              });

              // 6. CPM spike: high CPM relative to blended average
              const avgCpm = blended.cpm;
              adsData.filter(a=>a.cpm>0 && a.cpm>avgCpm*1.6).forEach(a=>{
                recs.push({
                  priority:"medium", type:"budget",
                  title:`High CPM on "${a.name}"`,
                  detail:`CPM $${a.cpm} is ${r2(a.cpm/avgCpm*100-100)}% above your blended average ($${avgCpm}). Check audience overlap, ad fatigue (frequency), or broaden targeting.`,
                  action:"⊙ Check audience / fatigue",
                  ad: a,
                });
              });

              // 7. Catalog cross-signal: high revenue product with no matching ad
              const topCatalogProds = catalog.filter(p=>p.revenue>0).sort((a,b)=>b.revenue-a.revenue).slice(0,3);
              topCatalogProds.forEach(p=>{
                const hasAd = adsData.some(a=>a.name.toLowerCase().includes(p.name.toLowerCase().split(" ")[0]));
                if (!hasAd) {
                  recs.push({
                    priority:"low", type:"product",
                    title:`No active ad for top seller "${p.name}"`,
                    detail:`"${p.name}" is generating $${(p.revenue/1000).toFixed(1)}k revenue organically with ${p.roas>0?p.roas+"x ROAS":"strong performance"} — no matching paid campaign detected. Test a GMV Max or Spark campaign to amplify.`,
                    action:"+ Launch campaign",
                    ad: null,
                  });
                }
              });

              // 8. GMV Max catching everything: if GMV Max has >60% of spend, flag diversification
              const gmvRow = byType.find(t=>t.type==="gmvmax");
              if (gmvRow && blended.spend>0 && gmvRow.agg.spend/blended.spend>0.6) {
                recs.push({
                  priority:"low", type:"budget",
                  title:"GMV Max is absorbing most of your budget",
                  detail:`${r2(gmvRow.agg.spend/blended.spend*100)}% of spend is in GMV Max. It's efficient but opaque — you have limited creative control. Consider shifting some budget to Spark or In-Feed to build brand awareness and test specific creatives.`,
                  action:"⊙ Diversify ad mix",
                  ad: null,
                });
              }

              // 9. LIVE ads: low CVR compared to other types
              const liveRow = byType.find(t=>t.type==="live");
              const nonLiveAvgCvr = r2(adsData.filter(a=>a.type!=="live"&&a.cvr>0).reduce((s,a,_,arr)=>s+a.cvr/arr.length,0));
              if (liveRow && liveRow.agg.cvr>0 && nonLiveAvgCvr>0 && liveRow.agg.cvr < nonLiveAvgCvr*0.7) {
                recs.push({
                  priority:"medium", type:"creative",
                  title:"LIVE ad CVR is lagging behind other formats",
                  detail:`LIVE Shopping Ads CVR ${liveRow.agg.cvr}% vs ${nonLiveAvgCvr}% across other ad types. Consider: stronger CTA timing during LIVE, better entry offer, or targeting warm audiences who've already seen product content.`,
                  action:"⊕ Improve LIVE strategy",
                  ad: null,
                });
              }

              if (!recs.length) return null;

              const PRIORITY_META = {
                high:   { color:"#ff4d6d", bg:"rgba(255,77,109,0.08)",   label:"High Priority"   },
                medium: { color:"#f5c518", bg:"rgba(245,197,24,0.08)",   label:"Medium Priority" },
                low:    { color:"#00e5a0", bg:"rgba(0,229,160,0.06)",    label:"Opportunity"     },
              };
              const TYPE_ICON = { scale:"↑", cut:"↓", creative:"✎", product:"⊕", budget:"⊙" };
              const TYPE_COLOR = { scale:"#00e5a0", cut:"#ff4d6d", creative:"#c77dff", product:"#ff6b35", budget:"#f5c518" };

              const sorted = [...recs].sort((a,b)=>{
                const o={high:0,medium:1,low:2};
                return o[a.priority]-o[b.priority];
              });

              return (
                <div style={{ ...S.card, marginTop:20, border:"1px solid rgba(255,107,53,0.15)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div>
                      <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#ff6b35", fontWeight:700, marginBottom:4 }}>Ad Recommendations</div>
                      <div style={{ fontSize:11, color:"#555" }}>Based on ROAS, CTR, CVR, VCR, CPM, spend share, and catalog performance signals.</div>
                    </div>
                    <div style={{ display:"flex", gap:10 }}>
                      {["high","medium","low"].map(p=>{
                        const cnt = recs.filter(r=>r.priority===p).length;
                        if (!cnt) return null;
                        return <span key={p} style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, background:PRIORITY_META[p].bg, color:PRIORITY_META[p].color, border:`1px solid ${PRIORITY_META[p].color}33` }}>{cnt} {PRIORITY_META[p].label}</span>;
                      })}
                    </div>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {sorted.map((rec,i)=>{
                      const pm = PRIORITY_META[rec.priority];
                      const tc = TYPE_COLOR[rec.type];
                      const ti = TYPE_ICON[rec.type];
                      const adMeta = rec.ad ? AD_TYPES[rec.ad.type] : null;
                      return (
                        <div key={i} style={{ display:"flex", gap:14, padding:"14px 16px", background:"rgba(255,255,255,0.02)", borderRadius:10, border:`1px solid rgba(255,255,255,0.05)`, borderLeft:`3px solid ${pm.color}` }}>
                          {/* Type icon */}
                          <div style={{ width:32, height:32, borderRadius:8, background:tc+"18", border:`1px solid ${tc}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:tc, flexShrink:0, marginTop:2 }}>{ti}</div>
                          {/* Content */}
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:6 }}>
                              <span style={{ fontSize:12, fontWeight:700, color:"#e8e8f0", lineHeight:1.4 }}>{rec.title}</span>
                              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                                <span style={{ fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20, background:pm.bg, color:pm.color, whiteSpace:"nowrap" }}>{pm.label}</span>
                                {adMeta && <span style={{ fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20, background:adMeta.bg, color:adMeta.color, whiteSpace:"nowrap" }}>{adMeta.label}</span>}
                              </div>
                            </div>
                            <div style={{ fontSize:11, color:"#666", lineHeight:1.7, marginBottom:8 }}>{rec.detail}</div>
                            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:10, fontWeight:700, color:tc, background:tc+"12", border:`1px solid ${tc}33`, borderRadius:6, padding:"3px 10px" }}>
                              {rec.action}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* ── WEEKLY STRATEGY ── */}
        {tab==="weekly strategy" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div><div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#444", marginBottom:4 }}>Week of</div><div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{w.dateRange}</div></div>
              <div style={{ display:"flex", gap:32, textAlign:"right" }}>
                <div><div style={{ fontSize:10, letterSpacing:1.5, textTransform:"uppercase", color:"#444", marginBottom:2 }}>Weekly Revenue</div><div style={{ fontSize:24, fontWeight:700, color:"#fff" }}>{fmt(w.totalRevenue)}</div><TrendBadge val={pct(w.totalRevenue,w.prevWeekRevenue)}/></div>
                <div><div style={{ fontSize:10, letterSpacing:1.5, textTransform:"uppercase", color:"#444", marginBottom:2 }}>Goal</div><div style={{ fontSize:24, fontWeight:700, color:Math.round(w.totalRevenue/w.weeklyGoal*100)>=90?"#00e5a0":"#f5c518" }}>{Math.round(w.totalRevenue/w.weeklyGoal*100)}%</div><div style={{ fontSize:11, color:"#555" }}>of {fmt(w.weeklyGoal)}</div></div>
              </div>
            </div>
            <ContentRatioCard weekRevenue={cs.weekRevenue} totalPieces={cs.totalPieces} prevWeekRevenue={cs.prevWeekRevenue} prevWeekPieces={cs.prevWeekPieces}/>
            <div style={{ ...S.card, marginBottom:16 }}>
              <div style={S.lbl}>Revenue by Day</div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:70, marginTop:8 }}>
                {["M","T","W","T","F","S","S"].map((day,i)=>{ const max=Math.max(...w.revenueByDay); const bh=Math.round((w.revenueByDay[i]/max)*60); const top=w.revenueByDay[i]===max; return (<div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}><div style={{ fontSize:9, color:top?"#00e5a0":"#444" }}>{fmt(w.revenueByDay[i])}</div><div style={{ width:"100%", height:bh, background:top?"#00e5a0":"rgba(255,255,255,0.08)", borderRadius:"3px 3px 0 0" }}/><div style={{ fontSize:9, color:"#444" }}>{day}</div></div>); })}
              </div>
            </div>
            <div style={{ ...S.card, borderColor:"rgba(0,229,160,0.15)", marginBottom:16 }}>
              <div style={{ marginBottom:14 }}><div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#00e5a0", fontWeight:700 }}>Brand / Leadership</div><div style={{ fontSize:14, fontWeight:700, color:"#fff", marginTop:2 }}>Product Decisions</div></div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr>{["Product","Week Rev","WoW","ROAS","EMV","Repeat %","Action"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>{w.products.map((p,i)=>(<tr key={i}><td style={S.td}><span style={{ fontWeight:600 }}>{p.name}</span></td><td style={S.td}><span style={{ fontWeight:700 }}>{fmt(p.weekRev)}</span></td><td style={S.td}><TrendBadge val={pct(p.weekRev,p.prevRev)}/></td><td style={S.td}><span style={{ color:p.roas>=2.5?"#00e5a0":p.roas>=1.5?"#f5c518":"#ff4d6d" }}>{p.roas}x</span></td><td style={S.td}><span style={{ color:"#c77dff" }}>{fmt(p.emv)}</span></td><td style={S.td}><span style={{ color:p.repeatRate>=50?"#00e5a0":"#aaa" }}>{p.repeatRate}%</span></td><td style={S.td}><span style={{ color:AC[p.action], fontWeight:700, fontSize:10 }}>{AL[p.action]}</span></td></tr>))}</tbody>
              </table>
            </div>
            <div style={{ ...S.card, background:"rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:14 }}>Decisions — By Owner</div>
              {w.decisions.map((dec,i)=>{ const oc={"Media Buyer":"#ff6b35","Creator Manager":"#c77dff","Brand / Leadership":"#00e5a0"}; return (<div key={i} style={{ display:"flex", gap:16, padding:"10px 0", borderBottom:i<w.decisions.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}><div style={{ fontSize:10, fontWeight:700, color:oc[dec.owner], minWidth:130 }}>{dec.owner}</div><div style={{ fontSize:12, color:"#aaa", lineHeight:1.5 }}>{dec.decision}</div></div>); })}
            </div>

            {/* Launch activity this week */}
            {(upcomingLaunches.length>0||activeLaunchList.length>0) && (
              <div style={{ ...S.card, marginTop:16, border:"1px solid rgba(199,125,255,0.2)", background:"rgba(199,125,255,0.02)" }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#c77dff", fontWeight:700, marginBottom:14 }}>Launch Activity This Week</div>
                {activeLaunchList.map((l,i)=>{
                  const {pct,revPct} = launchProgress(l);
                  const posted = l.creators.filter(c=>c.status==="posted");
                  return (
                    <div key={i} style={{ display:"flex", gap:14, padding:"12px 0", borderBottom:(i<activeLaunchList.length+upcomingLaunches.length-1)?"1px solid rgba(255,255,255,0.04)":"none", alignItems:"flex-start" }}>
                      <span style={{ fontSize:9, fontWeight:700, color:"#ff6b35", background:"rgba(255,107,53,0.1)", padding:"2px 8px", borderRadius:20, whiteSpace:"nowrap", marginTop:2 }}>Full Launch</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:"#e8e8f0", marginBottom:4, cursor:"pointer" }} onClick={()=>{ setTab("launches"); setActiveLaunch(l.id); setLaunchView("brief"); }}>{l.name} →</div>
                        <div style={{ display:"flex", gap:16, fontSize:11, color:"#555", flexWrap:"wrap" }}>
                          <span>Checklist <strong style={{ color:pct===100?"#00e5a0":"#f5c518" }}>{pct}%</strong></span>
                          {l.projectedRevenue>0&&<span>Rev <strong style={{ color:revPct>=100?"#00e5a0":revPct>=70?"#f5c518":"#ff4d6d" }}>{revPct}% of ${(l.projectedRevenue/1000).toFixed(1)}k proj</strong></span>}
                          <span>Creators <strong style={{ color:"#ff6b35" }}>{posted.length}/{l.creators.length} posted</strong></span>
                          {posted.length>0&&<span>Views <strong style={{ color:"#aaa" }}>{(posted.reduce((s,c)=>s+c.views,0)/1000).toFixed(0)}K</strong></span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {upcomingLaunches.map((l,i)=>{
                  const {pct} = launchProgress(l);
                  const stage = LAUNCH_STAGES.find(s=>s.id===l.stage);
                  return (
                    <div key={"u"+i} style={{ display:"flex", gap:14, padding:"12px 0", borderBottom:i<upcomingLaunches.length-1?"1px solid rgba(255,255,255,0.04)":"none", alignItems:"flex-start" }}>
                      <span style={{ fontSize:9, fontWeight:700, color:stage.color, background:stage.bg, padding:"2px 8px", borderRadius:20, whiteSpace:"nowrap", marginTop:2 }}>{stage.label}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:"#e8e8f0", marginBottom:4, cursor:"pointer" }} onClick={()=>{ setTab("launches"); setActiveLaunch(l.id); setLaunchView("brief"); }}>{l.name} →</div>
                        <div style={{ display:"flex", gap:16, fontSize:11, color:"#555", flexWrap:"wrap" }}>
                          {l.launchDate&&<span>Launch <strong style={{ color:"#c77dff" }}>{new Date(l.launchDate).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</strong></span>}
                          <span>Checklist <strong style={{ color:pct>=75?"#00e5a0":pct>=40?"#f5c518":"#ff4d6d" }}>{pct}%</strong></span>
                          <span>Price <strong style={{ color:"#fff" }}>${l.targetPrice}</strong></span>
                          <span>Commission <strong style={{ color:"#c77dff" }}>{l.commissionRate}%</strong></span>
                          <span>Creators <strong style={{ color:"#ff6b35" }}>{l.creators.length} seeded</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── GOALS & PROJECTIONS ── */}
        {tab==="goals & projections" && (
          <div>
            <div style={{ display:"flex", gap:0, marginBottom:24, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:4, width:"fit-content", border:"1px solid rgba(255,255,255,0.07)" }}>
              {["weekly","monthly"].map(v=>(<button key={v} onClick={()=>setProjView(v)} style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", padding:"8px 20px", cursor:"pointer", borderRadius:6, background:projView===v?"rgba(0,229,160,0.12)":"none", color:projView===v?"#00e5a0":"#555", border:projView===v?"1px solid rgba(0,229,160,0.3)":"1px solid transparent" }}>{v}</button>))}
            </div>
            {projView==="weekly" && (
              <div>
                <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#444" }}>Projection for</div>
                <div style={{ fontSize:18, fontWeight:700, color:"#fff", marginTop:2, marginBottom:20 }}>{p.nextWeek.label}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:20 }}>
                  {[{label:"Conservative",val:p.nextWeek.low,color:"#ff6b35",desc:"Campaign underperforms, content drops, no viral moments"},{label:"Base Case",val:p.nextWeek.mid,color:"#00e5a0",desc:"Campaign performs to historical average, all content deploys as planned",highlight:true},{label:"Upside",val:p.nextWeek.high,color:"#c77dff",desc:"One video hits >500k views, flash sale exceeds 2x baseline"}].map((sc,i)=>(
                    <div key={i} style={{ ...S.card, background:sc.highlight?"rgba(0,229,160,0.05)":"rgba(255,255,255,0.03)", border:sc.highlight?"1px solid rgba(0,229,160,0.2)":"1px solid rgba(255,255,255,0.07)", position:"relative" }}>
                      {sc.highlight&&<div style={{ position:"absolute", top:-1, left:20, fontSize:9, fontWeight:700, background:"#00e5a0", color:"#000", padding:"2px 8px", borderRadius:"0 0 4px 4px" }}>TARGET</div>}
                      <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:sc.color, fontWeight:700, marginBottom:10, marginTop:sc.highlight?8:0 }}>{sc.label}</div>
                      <div style={{ fontSize:32, fontWeight:700, color:"#fff", marginBottom:8 }}>{fmtFull(sc.val)}</div>
                      <div style={{ fontSize:11, color:"#555", lineHeight:1.6 }}>{sc.desc}</div>
                    </div>
                  ))}
                </div>
                <div style={S.card}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Projection Rationale</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
                    {p.nextWeek.rationale.map((r,i)=>(
                      <div key={i} style={{ display:"flex", gap:14, padding:"12px 16px 12px 0", borderBottom:i<p.nextWeek.rationale.length-2?"1px solid rgba(255,255,255,0.04)":"none", borderRight:i%2===0?"1px solid rgba(255,255,255,0.04)":"none", paddingRight:i%2===0?24:0, paddingLeft:i%2===1?24:0 }}>
                        <div style={{ minWidth:8, height:8, width:8, borderRadius:"50%", background:"#00e5a0", marginTop:4, flexShrink:0 }}/>
                        <div><div style={{ display:"flex", gap:10, marginBottom:3 }}><span style={{ fontSize:12, fontWeight:700 }}>{r.factor}</span><span style={{ fontSize:12, color:"#00e5a0", fontWeight:700 }}>{r.value}</span></div><div style={{ fontSize:11, color:"#555", lineHeight:1.5 }}>{r.detail}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {projView==="monthly" && (
              <div>
                <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#444" }}>Monthly Projection</div>
                <div style={{ fontSize:18, fontWeight:700, color:"#fff", marginTop:2, marginBottom:20 }}>{p.nextMonth.label}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:20 }}>
                  {[{label:"Conservative",val:p.nextMonth.totalLow,color:"#ff6b35"},{label:"Base Case",val:p.nextMonth.totalMid,color:"#00e5a0",highlight:true},{label:"Upside",val:p.nextMonth.totalHigh,color:"#c77dff"}].map((sc,i)=>(
                    <div key={i} style={{ ...S.card, background:sc.highlight?"rgba(0,229,160,0.05)":"rgba(255,255,255,0.03)", border:sc.highlight?"1px solid rgba(0,229,160,0.2)":"1px solid rgba(255,255,255,0.07)", position:"relative" }}>
                      {sc.highlight&&<div style={{ position:"absolute", top:-1, left:20, fontSize:9, fontWeight:700, background:"#00e5a0", color:"#000", padding:"2px 8px", borderRadius:"0 0 4px 4px" }}>TARGET</div>}
                      <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:sc.color, fontWeight:700, marginBottom:10, marginTop:sc.highlight?8:0 }}>{sc.label}</div>
                      <div style={{ fontSize:32, fontWeight:700, color:"#fff" }}>{fmtFull(sc.val)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ ...S.card, marginBottom:16 }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Week-by-Week Breakdown</div>
                  {p.nextMonth.weeks.map((wk,i)=>(
                    <div key={i} style={{ borderBottom:i<p.nextMonth.weeks.length-1?"1px solid rgba(255,255,255,0.05)":"none", paddingBottom:16, marginBottom:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                        <div><div style={{ fontSize:12, fontWeight:700, marginBottom:2 }}>Week {i+1} <span style={{ fontSize:10, color:"#555", fontWeight:400 }}>{wk.week}</span></div><div style={{ fontSize:11, color:"#555", lineHeight:1.5, maxWidth:500 }}>{wk.note}</div></div>
                        <div style={{ textAlign:"right", flexShrink:0, marginLeft:20 }}><div style={{ fontSize:13, fontWeight:700 }}>{fmtFull(wk.low)} – {fmtFull(wk.high)}</div><div style={{ fontSize:11, color:"#00e5a0" }}>Mid: {fmtFull(wk.mid)}</div></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={S.card}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Key Assumptions</div>
                  {p.nextMonth.keyAssumptions.map((a,i)=>(
                    <div key={i} style={{ display:"flex", gap:14, padding:"10px 0", borderBottom:i<p.nextMonth.keyAssumptions.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                      <div style={{ fontSize:10, fontWeight:700, color:a.label==="Inventory Risk"?"#ff4d6d":a.label==="Downside Scenario"?"#ff6b35":"#f5c518", minWidth:140 }}>{a.label}</div>
                      <div style={{ fontSize:11, color:"#888", lineHeight:1.6 }}>{a.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROFITABILITY ── */}
        {tab==="profitability" && (
          <div>
            {/* Mode toggle */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:4, border:"1px solid rgba(255,255,255,0.07)" }}>
                {[{id:"planning",label:"📊 Planning Mode"},{id:"actuals",label:"📋 Actuals Mode"}].map(m=>(
                  <button key={m.id} onClick={()=>setProfMode(m.id)} style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", padding:"8px 20px", cursor:"pointer", borderRadius:6, background:profMode===m.id?"rgba(0,229,160,0.12)":"none", color:profMode===m.id?"#00e5a0":"#555", border:profMode===m.id?"1px solid rgba(0,229,160,0.3)":"1px solid transparent" }}>{m.label}</button>
                ))}
              </div>
              <div style={{ fontSize:11, color:"#555" }}>
                {profMode==="planning" ? "Model scenarios with adjustable fees & COGS" : `${orders.length} orders loaded · ${[...new Set(orders.map(o=>o.product))].length} products`}
              </div>
            </div>

            {/* ─── PLANNING MODE ─── */}
            {profMode==="planning" && (
              <div>
                <div style={{ ...S.card, background:"rgba(255,255,255,0.02)", marginBottom:20, border:"1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#f5c518", fontWeight:700, marginBottom:14 }}>⚙ Fee Settings (editable — model different scenarios)</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
                    {[{label:"TikTok Platform Fee",key:"tikTokFeePct",note:"Referral fee on net sale"},{label:"Avg Affiliate Commission",key:"affiliateComPct",note:"% paid to creators per order"},{label:"Avg Discount / Promo",key:"discountPct",note:"Avg discount at checkout"}].map(({label,key,note})=>(
                      <div key={key}><div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#555", marginBottom:6 }}>{label}</div>
                        <div style={{ display:"inline-flex", alignItems:"center", background:"rgba(255,255,255,0.06)", borderRadius:6, border:"1px solid rgba(255,255,255,0.1)", padding:"2px 8px" }}>
                          <input type="number" step="0.1" value={fees[key]} onChange={e=>setFees(f=>({...f,[key]:parseFloat(e.target.value)||0}))} style={{ background:"transparent", border:"none", outline:"none", color:"#e8e8f0", fontFamily:"inherit", fontSize:13, fontWeight:700, width:50, textAlign:"right" }}/>
                          <span style={{ fontSize:11, color:"#555", marginLeft:2 }}>%</span>
                        </div>
                        <div style={{ fontSize:10, color:"#444", marginTop:4 }}>{note}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
                  {[{lbl:"Gross Revenue",val:fmtFull(Math.round(totRev)),c:"#fff"},{lbl:"Total Deductions",val:"-"+fmtFull(Math.round(totRev-totNet)),c:"#ff4d6d"},{lbl:"Net Profit",val:fmtFull(Math.round(totNet)),c:totNet>0?"#00e5a0":"#ff4d6d"},{lbl:"Net Margin",val:fmtPct(overallMarg),c:overallMarg>=25?"#00e5a0":overallMarg>=10?"#f5c518":"#ff4d6d"},{lbl:"Total Ad Spend",val:fmtFull(totAdSpend),c:"#ff6b35"}].map((m,i)=>(
                    <div key={i} style={{ ...S.card, textAlign:"center" }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:"#444", marginBottom:8, fontWeight:700 }}>{m.lbl}</div><div style={{ fontSize:20, fontWeight:700, color:m.c }}>{m.val}</div></div>
                  ))}
                </div>
                <div style={{ ...S.card, marginBottom:20 }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:4 }}>Profit Waterfall</div>
                  <div style={{ fontSize:11, color:"#555", marginBottom:16 }}>Where today's revenue goes</div>
                  <WaterfallBar items={[{label:"Gross Revenue",value:totRev},{label:"− COGS",value:-totCOGS},{label:"− Shipping",value:-totShip},{label:"− TikTok Fees",value:-totFees},{label:"− Affiliate Commissions",value:-totAff},{label:"− Discounts",value:-totDisc},{label:"− Ad Spend (GMV Max/Spark)",value:-totAdSpend}]}/>
                  <div style={{ marginTop:16, padding:"10px 14px", background:"rgba(0,229,160,0.06)", borderRadius:8, border:"1px solid rgba(0,229,160,0.15)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#00e5a0" }}>Net Profit after all deductions</span>
                    <span style={{ fontSize:20, fontWeight:700, color:totNet>0?"#00e5a0":"#ff4d6d" }}>{fmtFull(Math.round(totNet))}</span>
                  </div>
                </div>
                <div style={{ ...S.card }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:4 }}>Per-Product Planning</div>
                  <div style={{ fontSize:11, color:"#555", marginBottom:16 }}>Click any row to edit COGS, shipping & ad spend</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead><tr>{["Product","Units","Sale Price","COGS","Shipping","Ad Spend","TikTok Fee","Aff.Com","Discount","Net Margin","Net Profit"].map(h=><th key={h} style={{ ...S.th, fontSize:8 }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {profRows.map((row,i)=>{
                        const exp = expandedRow===i;
                        return (
                          <>
                            <tr key={i} onClick={()=>setExpanded(exp?null:i)} style={{ cursor:"pointer", background:exp?"rgba(0,229,160,0.03)":"transparent" }}>
                              <td style={S.td}><span style={{ fontWeight:600, color:exp?"#00e5a0":"#e8e8f0" }}>{row.prod.name}</span> <span style={{ fontSize:9, color:"#555" }}>{exp?"▲":"▼"}</span></td>
                              <td style={S.td}><span style={{ color:"#aaa" }}>{row.units}</span></td>
                              <td style={S.td}>${row.prod.salePrice.toFixed(2)}</td>
                              <td style={S.td}><span style={{ color:"#ff4d6d" }}>${row.prod.cogs.toFixed(2)}</span></td>
                              <td style={S.td}><span style={{ color:"#ff4d6d" }}>${row.prod.shipping.toFixed(2)}</span></td>
                              <td style={S.td}><div><span style={{ color:"#ff6b35", fontWeight:700 }}>{fmtFull(row.prod.adSpend)}</span></div><div style={{ fontSize:9, color:"#555" }}>{row.prod.adType}</div></td>
                              <td style={S.td}><span style={{ color:"#f5c518" }}>${row.unit.tikTokFee.toFixed(2)}</span></td>
                              <td style={S.td}><span style={{ color:"#c77dff" }}>${row.unit.affiliateCom.toFixed(2)}</span></td>
                              <td style={S.td}><span style={{ color:"#aaa" }}>-${row.unit.discountAmt.toFixed(2)}</span></td>
                              <td style={S.td}><ProfitPill pct={row.netMarginPct}/></td>
                              <td style={S.td}><span style={{ fontWeight:700, color:row.netProfit>=0?"#00e5a0":"#ff4d6d" }}>{fmtFull(Math.round(row.netProfit))}</span></td>
                            </tr>
                            {exp && (
                              <tr key={i+"-ed"} style={{ background:"rgba(0,229,160,0.02)" }}>
                                <td colSpan={11} style={{ padding:"16px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                                  <div style={{ padding:"0 4px" }}>
                                    <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#00e5a0", fontWeight:700, marginBottom:12 }}>Edit {row.prod.name}</div>
                                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
                                      {[{label:"Sale Price",field:"salePrice"},{label:"COGS (manual)",field:"cogs"},{label:"Shipping (manual)",field:"shipping"},{label:"Ad Spend — GMV Max",field:"adSpend"}].map(({label,field})=>(
                                        <div key={field}><div style={{ fontSize:10, color:"#555", marginBottom:6 }}>{label}</div><EditableField value={row.prod[field]} onChange={v=>updateProd(i,field,v)}/></div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── ACTUALS MODE ─── */}
            {profMode==="actuals" && (
              <div>
                {/* Import bar */}
                <div style={{ ...S.card, background:"rgba(255,255,255,0.02)", marginBottom:20, border:"1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#f5c518", fontWeight:700, marginBottom:4 }}>📥 Order Data Source</div>
                      <div style={{ fontSize:11, color:"#555" }}>Export from TikTok Seller Center → Orders → Order Details → Export CSV</div>
                    </div>
                    <div style={{ display:"flex", gap:10 }}>
                      <button onClick={loadMockData} style={{ fontSize:11, fontWeight:700, padding:"8px 16px", borderRadius:6, background:"rgba(255,255,255,0.05)", color:"#555", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>Load Sample Data</button>
                      <button onClick={()=>setShowImport(!showImport)} style={{ fontSize:11, fontWeight:700, padding:"8px 16px", borderRadius:6, background:"rgba(0,229,160,0.1)", color:"#00e5a0", border:"1px solid rgba(0,229,160,0.3)", cursor:"pointer" }}>Import CSV ↑</button>
                    </div>
                  </div>

                  {showImport && (
                    <div style={{ marginTop:16, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:16 }}>
                      {/* Column mapping guide */}
                      <div style={{ marginBottom:12, padding:"10px 14px", background:"rgba(255,193,7,0.05)", borderRadius:8, border:"1px solid rgba(255,193,7,0.15)" }}>
                        <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#f5c518", fontWeight:700, marginBottom:8 }}>Expected CSV Column Headers</div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                          {[["order_id","Order ID"],["product","Product Name"],["sale_price","Selling Price"],["platform_fee","TikTok Platform Fee"],["affiliate_commission","Affiliate Commission"],["discount","Discount Amount"],["shipping","Shipping Fee"],["channel","Channel (organic/paid/affiliate)"],["cogs","COGS (add manually)"]].map(([col,desc])=>(
                            <div key={col} style={{ fontSize:10 }}><span style={{ color:"#00e5a0", fontWeight:700 }}>{col}</span><span style={{ color:"#555" }}> — {desc}</span></div>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom:10, fontSize:11, color:"#555" }}>Paste CSV text below or upload a file:</div>
                      <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                        <input ref={fileRef} type="file" accept=".csv" onChange={handleFileUpload} style={{ display:"none" }}/>
                        <button onClick={()=>fileRef.current.click()} style={{ fontSize:11, padding:"6px 14px", borderRadius:6, background:"rgba(255,255,255,0.05)", color:"#888", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>Upload .csv file</button>
                        {csvText && <span style={{ fontSize:11, color:"#00e5a0", alignSelf:"center" }}>✓ File loaded — review below then click Import</span>}
                      </div>
                      <textarea
                        value={csvText} onChange={e=>setCsvText(e.target.value)}
                        placeholder={"order_id,product,sale_price,platform_fee,affiliate_commission,discount,shipping,channel,cogs\nTT-001,Glow Serum 2.0,34.99,1.82,3.85,2.80,4.20,affiliate,7.80\n..."}
                        style={{ width:"100%", height:120, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#e8e8f0", fontFamily:"monospace", fontSize:11, padding:10, resize:"vertical", outline:"none" }}
                      />
                      {csvError && <div style={{ marginTop:8, fontSize:11, color:"#ff4d6d" }}>⚠ {csvError}</div>}
                      <div style={{ display:"flex", gap:10, marginTop:10 }}>
                        <button onClick={handleCSVImport} style={{ fontSize:11, fontWeight:700, padding:"8px 20px", borderRadius:6, background:"rgba(0,229,160,0.12)", color:"#00e5a0", border:"1px solid rgba(0,229,160,0.3)", cursor:"pointer" }}>Import & Calculate</button>
                        <button onClick={()=>{setShowImport(false);setCsvText("");setCsvError("");}} style={{ fontSize:11, padding:"8px 14px", borderRadius:6, background:"transparent", color:"#555", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actuals summary strip */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
                  {[{lbl:"Gross Revenue",val:fmtFull(Math.round(actTotRev)),c:"#fff"},{lbl:"Total Deductions",val:"-"+fmtFull(Math.round(actTotFees+actTotAff+actTotDisc+actTotShip+actTotCOGS)),c:"#ff4d6d"},{lbl:"Net Profit",val:fmtFull(Math.round(actTotNet)),c:actTotNet>0?"#00e5a0":"#ff4d6d"},{lbl:"Net Margin",val:fmtPct(actMarg),c:actMarg>=25?"#00e5a0":actMarg>=10?"#f5c518":"#ff4d6d"},{lbl:"Total Orders",val:orders.length,c:"#fff"}].map((m,i)=>(
                    <div key={i} style={{ ...S.card, textAlign:"center" }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:"#444", marginBottom:8, fontWeight:700 }}>{m.lbl}</div><div style={{ fontSize:20, fontWeight:700, color:m.c }}>{m.val}</div></div>
                  ))}
                </div>

                {/* Actuals waterfall */}
                <div style={{ ...S.card, marginBottom:20 }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:4 }}>Actual Profit Waterfall</div>
                  <div style={{ fontSize:11, color:"#555", marginBottom:16 }}>Real fees & commissions paid — pulled from order data</div>
                  <WaterfallBar items={[{label:"Gross Revenue",value:actTotRev},{label:"− COGS",value:-actTotCOGS},{label:"− Shipping Collected",value:-actTotShip},{label:"− TikTok Platform Fees",value:-actTotFees},{label:"− Affiliate Commissions",value:-actTotAff},{label:"− Discounts Applied",value:-actTotDisc}]}/>
                  <div style={{ marginTop:16, padding:"10px 14px", background:"rgba(0,229,160,0.06)", borderRadius:8, border:"1px solid rgba(0,229,160,0.15)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#00e5a0" }}>Net Profit (excl. ad spend)</span>
                    <span style={{ fontSize:20, fontWeight:700, color:actTotNet>0?"#00e5a0":"#ff4d6d" }}>{fmtFull(Math.round(actTotNet))}</span>
                  </div>
                  <div style={{ marginTop:8, fontSize:11, color:"#555" }}>Note: ad spend not included here — add from Ads Manager export in Planning Mode to get full net profit.</div>
                </div>

                {/* Actuals sub-tabs */}
                <div style={{ display:"flex", gap:0, marginBottom:16, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:4, width:"fit-content", border:"1px solid rgba(255,255,255,0.07)" }}>
                  {["product","channel","orders"].map(v=>(
                    <button key={v} onClick={()=>setActTab(v)} style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", padding:"8px 16px", cursor:"pointer", borderRadius:6, background:actTab===v?"rgba(0,229,160,0.12)":"none", color:actTab===v?"#00e5a0":"#555", border:actTab===v?"1px solid rgba(0,229,160,0.3)":"1px solid transparent" }}>{v}</button>
                  ))}
                </div>

                {/* PRODUCT ROLLUP */}
                {actTab==="product" && (
                  <div style={S.card}>
                    <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Product-Level Actuals — Rolled Up from Orders</div>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                      <thead><tr>{["Product","Orders","Revenue","TikTok Fees","Aff. Commissions","Discounts","Shipping","COGS","Net Profit","Margin"].map(h=><th key={h} style={{ ...S.th, fontSize:8 }}>{h}</th>)}</tr></thead>
                      <tbody>
                        {actProductRows.sort((a,b)=>b.revenue-a.revenue).map((row,i)=>(
                          <tr key={i}>
                            <td style={S.td}><span style={{ fontWeight:600 }}>{row.product}</span></td>
                            <td style={S.td}><span style={{ color:"#aaa" }}>{row.orders}</span></td>
                            <td style={S.td}><span style={{ fontWeight:700 }}>{fmtFull(Math.round(row.revenue))}</span></td>
                            <td style={S.td}><span style={{ color:"#f5c518" }}>-{fmtFull(Math.round(row.tikTokFees))}</span></td>
                            <td style={S.td}><span style={{ color:"#c77dff" }}>-{fmtFull(Math.round(row.affiliateComs))}</span></td>
                            <td style={S.td}><span style={{ color:"#aaa" }}>-{fmtFull(Math.round(row.discounts))}</span></td>
                            <td style={S.td}><span style={{ color:"#ff4d6d" }}>-{fmtFull(Math.round(row.shipping))}</span></td>
                            <td style={S.td}><span style={{ color:"#ff4d6d" }}>-{fmtFull(Math.round(row.cogs))}</span></td>
                            <td style={S.td}><span style={{ fontWeight:700, color:row.netProfit>=0?"#00e5a0":"#ff4d6d" }}>{fmtFull(Math.round(row.netProfit))}</span></td>
                            <td style={S.td}><ProfitPill pct={row.margin}/></td>
                          </tr>
                        ))}
                        {/* Totals row */}
                        <tr style={{ background:"rgba(255,255,255,0.03)" }}>
                          <td style={{ ...S.td, fontWeight:700, color:"#f5c518" }}>TOTAL</td>
                          <td style={{ ...S.td, fontWeight:700 }}>{orders.length}</td>
                          <td style={{ ...S.td, fontWeight:700 }}>{fmtFull(Math.round(actTotRev))}</td>
                          <td style={{ ...S.td, color:"#f5c518", fontWeight:700 }}>-{fmtFull(Math.round(actTotFees))}</td>
                          <td style={{ ...S.td, color:"#c77dff", fontWeight:700 }}>-{fmtFull(Math.round(actTotAff))}</td>
                          <td style={{ ...S.td, color:"#aaa", fontWeight:700 }}>-{fmtFull(Math.round(actTotDisc))}</td>
                          <td style={{ ...S.td, color:"#ff4d6d", fontWeight:700 }}>-{fmtFull(Math.round(actTotShip))}</td>
                          <td style={{ ...S.td, color:"#ff4d6d", fontWeight:700 }}>-{fmtFull(Math.round(actTotCOGS))}</td>
                          <td style={{ ...S.td, fontWeight:700, color:actTotNet>=0?"#00e5a0":"#ff4d6d" }}>{fmtFull(Math.round(actTotNet))}</td>
                          <td style={S.td}><ProfitPill pct={actMarg}/></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* CHANNEL ROLLUP */}
                {actTab==="channel" && (
                  <div>
                    <div style={S.g3}>
                      {actChannelRows.sort((a,b)=>b.revenue-a.revenue).map((ch,i)=>{
                        const color = CHAN_COLOR[ch.channel] || "#888";
                        return (
                          <div key={i} style={{ ...S.card, borderColor:color+"33" }}>
                            <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color, fontWeight:700, marginBottom:14 }}>{ch.channel}</div>
                            {[["Orders",ch.orders],["Revenue",fmtFull(Math.round(ch.revenue))],["TikTok Fees","-"+fmtFull(Math.round(ch.tikTokFees))],["Aff. Commissions","-"+fmtFull(Math.round(ch.affiliateComs))],["Discounts","-"+fmtFull(Math.round(ch.discounts))],["Shipping","-"+fmtFull(Math.round(ch.shipping))],["COGS","-"+fmtFull(Math.round(ch.cogs))]].map(([k,v])=>(
                              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                                <div style={{ fontSize:11, color:"#555" }}>{k}</div>
                                <div style={{ fontSize:12, fontWeight:700, color: k==="Revenue"?"#fff":k==="Orders"?"#aaa":"#ff4d6d" }}>{v}</div>
                              </div>
                            ))}
                            <div style={{ marginTop:12, padding:"10px 12px", background:ch.margin>=20?"rgba(0,229,160,0.07)":ch.margin>=5?"rgba(245,197,24,0.07)":"rgba(255,77,109,0.07)", borderRadius:8, border:`1px solid ${ch.margin>=20?"rgba(0,229,160,0.2)":ch.margin>=5?"rgba(245,197,24,0.2)":"rgba(255,77,109,0.2)"}` }}>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><span style={{ fontSize:11, color:"#555" }}>Net Profit</span><ProfitPill pct={ch.margin}/></div>
                              <div style={{ fontSize:16, fontWeight:700, color:ch.netProfit>=0?"#00e5a0":"#ff4d6d", marginTop:6 }}>{fmtFull(Math.round(ch.netProfit))}</div>
                            </div>
                            <MiniBar value={Math.max(ch.margin,0)} max={50} color={color}/>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ORDER-LEVEL VIEW */}
                {actTab==="orders" && (
                  <div style={S.card}>
                    <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Individual Order Detail</div>
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                        <thead><tr>{["Order ID","Product","Channel","Sale Price","TikTok Fee","Aff. Com.","Discount","Shipping","COGS","Net Profit"].map(h=><th key={h} style={{ ...S.th, fontSize:8 }}>{h}</th>)}</tr></thead>
                        <tbody>
                          {orders.map((o,i)=>{
                            const net = r2(o.salePrice - o.tikTokFee - o.affiliateCom - o.discount - o.shipping - o.cogs);
                            const chColor = CHAN_COLOR[o.channel]||"#888";
                            return (
                              <tr key={i}>
                                <td style={S.td}><span style={{ color:"#555", fontSize:10 }}>{o.orderId}</span></td>
                                <td style={S.td}><span style={{ fontWeight:600 }}>{o.product}</span></td>
                                <td style={S.td}><span style={{ color:chColor, fontSize:10, fontWeight:700 }}>{o.channel}</span></td>
                                <td style={S.td}>${o.salePrice.toFixed(2)}</td>
                                <td style={S.td}><span style={{ color:"#f5c518" }}>-${o.tikTokFee.toFixed(2)}</span></td>
                                <td style={S.td}><span style={{ color:"#c77dff" }}>-${o.affiliateCom.toFixed(2)}</span></td>
                                <td style={S.td}><span style={{ color:"#aaa" }}>-${o.discount.toFixed(2)}</span></td>
                                <td style={S.td}><span style={{ color:"#ff4d6d" }}>-${o.shipping.toFixed(2)}</span></td>
                                <td style={S.td}><span style={{ color:"#ff4d6d" }}>-${o.cogs.toFixed(2)}</span></td>
                                <td style={S.td}><span style={{ fontWeight:700, color:net>=0?"#00e5a0":"#ff4d6d" }}>${net.toFixed(2)}</span></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── INVENTORY ── */}
        {tab==="inventory" && (
          <div>

            {/* Summary strip */}
            {(() => {
              const out      = invRows.filter(r=>r.status==="out").length;
              const critical = invRows.filter(r=>r.status==="critical").length;
              const low      = invRows.filter(r=>r.status==="low").length;
              const watch    = invRows.filter(r=>r.status==="watch").length;
              const ok       = invRows.filter(r=>r.status==="ok").length;
              const needsReorder = invRows.filter(r=>r.status==="out"||r.status==="critical"||r.status==="low");
              return (
                <div>
                  {/* Alert banners */}
                  {(out>0||critical>0) && (
                    <div style={{ padding:"10px 16px", background:"rgba(255,77,109,0.08)", border:"1px solid rgba(255,77,109,0.2)", borderRadius:8, marginBottom:12, display:"flex", alignItems:"center", gap:10, fontSize:12, color:"#ff4d6d" }}>
                      <span style={{ fontWeight:700 }}>⚠ Action required:</span>
                      {out>0 && <span>{out} product{out!==1?"s":""} out of stock</span>}
                      {out>0&&critical>0 && <span>·</span>}
                      {critical>0 && <span>{critical} critical (stock ≤ lead time)</span>}
                    </div>
                  )}
                  {/* Status summary cards */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:24 }}>
                    {[
                      { label:"Out of Stock", count:out,      ...STATUS_META.out      },
                      { label:"Critical",     count:critical, ...STATUS_META.critical },
                      { label:"Low",          count:low,      ...STATUS_META.low      },
                      { label:"Watch",        count:watch,    ...STATUS_META.watch    },
                      { label:"OK",           count:ok,       ...STATUS_META.ok       },
                    ].map((s,i)=>(
                      <div key={i} style={{ ...S.card, borderColor:s.color+"33", textAlign:"center", padding:"14px 10px" }}>
                        <div style={{ fontSize:28, fontWeight:700, color:s.count>0?s.color:"#333", marginBottom:4 }}>{s.count}</div>
                        <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:s.count>0?s.color:"#444", fontWeight:700 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Paste inventory panel */}
            <div style={{ ...S.card, marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: invPasteOpen?14:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#f5c518", fontWeight:700 }}>Update Units on Hand</div>
                  {invPasteSuccess && <span style={{ fontSize:10, color:"#00e5a0" }}>✓ Updated</span>}
                </div>
                <button onClick={()=>{ setInvPasteOpen(o=>!o); setInvPasteError(""); setInvPasteSuccess(false); }} style={{ fontSize:11, padding:"5px 14px", borderRadius:6, cursor:"pointer", background:"rgba(245,197,24,0.08)", color:"#f5c518", border:"1px solid rgba(245,197,24,0.25)" }}>
                  {invPasteOpen ? "▲ Collapse" : "▼ Paste from Sheets"}
                </button>
              </div>
              {invPasteOpen && (
                <div>
                  <div style={{ fontSize:11, color:"#555", marginBottom:10, lineHeight:1.6 }}>
                    Paste two columns from Google Sheets: <strong style={{ color:"#e8e8f0" }}>Product Name</strong> and <strong style={{ color:"#e8e8f0" }}>Units on Hand</strong>. Include the header row. Names will fuzzy-match to your catalog.
                  </div>
                  <textarea
                    value={invPasteText}
                    onChange={e=>{ setInvPasteText(e.target.value); setInvPasteError(""); }}
                    placeholder={"Product Name\tUnits on Hand\nGlow Serum 2.0\t245\nHydra Mist SPF\t88\nVitamin C Drops\t12"}
                    style={{ width:"100%", height:130, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#e8e8f0", fontFamily:"monospace", fontSize:11, padding:10, resize:"vertical", outline:"none", lineHeight:1.6 }}
                  />
                  <div style={{ display:"flex", gap:10, marginTop:10, alignItems:"center" }}>
                    <button onClick={handleInvPaste} style={{ fontSize:12, fontWeight:700, padding:"8px 20px", borderRadius:7, background:"rgba(245,197,24,0.1)", color:"#f5c518", border:"1px solid rgba(245,197,24,0.3)", cursor:"pointer" }}>Import Inventory →</button>
                    <input ref={invFileRef} type="file" accept=".csv,.tsv,.txt" onChange={e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>setInvPasteText(ev.target.result); r.readAsText(f); }} style={{ display:"none" }}/>
                    <button onClick={()=>invFileRef.current.click()} style={{ fontSize:11, padding:"7px 14px", borderRadius:7, background:"rgba(255,255,255,0.04)", color:"#888", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>Upload file</button>
                    {invPasteText && <button onClick={()=>{ setInvPasteText(""); setInvPasteError(""); }} style={{ fontSize:11, color:"#ff4d6d", background:"transparent", border:"none", cursor:"pointer" }}>✕ Clear</button>}
                  </div>
                  {invPasteError && <div style={{ marginTop:8, fontSize:11, color:"#ff4d6d", padding:"6px 10px", background:"rgba(255,77,109,0.08)", borderRadius:6 }}>⚠ {invPasteError}</div>}
                </div>
              )}
            </div>

            {/* Main inventory table */}
            <div style={S.card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700 }}>Daily Inventory Report</div>
                <div style={{ fontSize:10, color:"#555" }}>Click Edit to set threshold, lead time & MOQ per product</div>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr>{["Product","Status","On Hand","Threshold","Daily Velocity","Days Left","Reorder By","Restock Arrives","Units to Order",""].map(h=>(
                    <th key={h} style={{ ...S.th, fontSize:8, whiteSpace:"nowrap" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {invRows.sort((a,b)=>{
                    const order = {out:0,critical:1,low:2,watch:3,ok:4};
                    return order[a.status]-order[b.status];
                  }).map(row=>{
                    const sm = STATUS_META[row.status];
                    const isEditing = invEditId===row.id;
                    const daysColor = row.daysLeft===999?"#555":row.daysLeft<=row.leadTime?"#ff4d6d":row.daysLeft<=row.leadTime*2?"#ff6b35":row.daysLeft<=30?"#f5c518":"#00e5a0";
                    return (
                      <tr key={row.id} style={{ background:isEditing?"rgba(255,255,255,0.02)":"transparent", verticalAlign:"middle" }}>
                        {/* Product */}
                        <td style={{ ...S.td, fontWeight:700, minWidth:140 }}>{row.name}</td>
                        {/* Status badge */}
                        <td style={S.td}>
                          <span style={{ fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:20, background:sm.bg, color:sm.color, whiteSpace:"nowrap" }}>
                            {sm.icon} {sm.label}
                          </span>
                        </td>
                        {/* On hand */}
                        <td style={S.td}>
                          {isEditing
                            ? <input type="number" value={row.unitsOnHand} onChange={e=>updateInvField(row.id,"unitsOnHand",parseInt(e.target.value)||0)}
                                style={{ width:70, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(245,197,24,0.4)", borderRadius:4, padding:"3px 7px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, fontWeight:700, outline:"none" }}/>
                            : <span style={{ fontWeight:700, color:row.unitsOnHand===0?"#ff4d6d":row.belowThreshold?"#ff6b35":"#e8e8f0" }}>{row.unitsOnHand}</span>
                          }
                        </td>
                        {/* Threshold */}
                        <td style={S.td}>
                          {isEditing
                            ? <input type="number" value={row.threshold} onChange={e=>updateInvField(row.id,"threshold",parseInt(e.target.value)||0)}
                                style={{ width:60, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:4, padding:"3px 7px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, outline:"none" }}/>
                            : <span style={{ color:"#555" }}>{row.threshold} units</span>
                          }
                        </td>
                        {/* Daily velocity */}
                        <td style={S.td}>
                          <span style={{ color:row.velocity>0?"#aaa":"#333" }}>
                            {row.velocity>0 ? row.velocity+" / day" : "—"}
                          </span>
                        </td>
                        {/* Days left */}
                        <td style={S.td}>
                          <span style={{ fontWeight:700, color:daysColor }}>
                            {row.unitsOnHand===0 ? "0" : row.daysLeft===999 ? "∞" : row.daysLeft+"d"}
                          </span>
                        </td>
                        {/* Reorder by */}
                        <td style={S.td}>
                          {isEditing
                            ? <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                                <span style={{ fontSize:10, color:"#555" }}>Lead:</span>
                                <input type="number" value={row.leadTime} onChange={e=>updateInvField(row.id,"leadTime",parseInt(e.target.value)||1)}
                                  style={{ width:45, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:4, padding:"3px 6px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, outline:"none" }}/>
                                <span style={{ fontSize:10, color:"#555" }}>d</span>
                              </div>
                            : <span style={{ color:row.reorderDate&&row.reorderDate<=new Date()?"#ff4d6d":row.reorderDate?"#f5c518":"#444" }}>
                                {row.reorderDate&&row.reorderDate<=new Date() ? "⚠ NOW" : fmtDate(row.reorderDate)}
                              </span>
                          }
                        </td>
                        {/* Restock arrives */}
                        <td style={S.td}>
                          <span style={{ color:"#555" }}>{fmtDate(row.restockArrival)}</span>
                        </td>
                        {/* Units to order */}
                        <td style={S.td}>
                          {isEditing
                            ? <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                                <span style={{ fontSize:10, color:"#555" }}>MOQ:</span>
                                <input type="number" value={row.moq} onChange={e=>updateInvField(row.id,"moq",parseInt(e.target.value)||1)}
                                  style={{ width:55, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:4, padding:"3px 6px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, outline:"none" }}/>
                              </div>
                            : <span style={{ fontWeight:row.status!=="ok"?700:400, color:row.status==="out"||row.status==="critical"?"#ff4d6d":row.status==="low"?"#ff6b35":row.status==="watch"?"#f5c518":"#444" }}>
                                {row.status!=="ok" ? row.unitsToOrder+" units" : "—"}
                              </span>
                          }
                        </td>
                        {/* Edit button */}
                        <td style={S.td}>
                          <button onClick={()=>setInvEditId(isEditing?null:row.id)} style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:6, cursor:"pointer", background:isEditing?"rgba(0,229,160,0.12)":"rgba(255,255,255,0.04)", color:isEditing?"#00e5a0":"#555", border:isEditing?"1px solid rgba(0,229,160,0.3)":"1px solid rgba(255,255,255,0.08)" }}>
                            {isEditing ? "✓ Done" : "Edit"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {invRows.length===0 && (
                <div style={{ padding:"40px 0", textAlign:"center", color:"#444", fontSize:12 }}>
                  No products in catalog yet — import your catalog in the Data Import tab first.
                </div>
              )}
            </div>

            {/* Reorder action list */}
            {invRows.filter(r=>r.status!=="ok").length>0 && (
              <div style={{ ...S.card, marginTop:16, border:"1px solid rgba(255,107,53,0.15)" }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#ff6b35", fontWeight:700, marginBottom:16 }}>Restock Action List</div>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr>{["Product","Status","Units to Order","Reorder By","Est. Arrival","Notes"].map(h=>(
                      <th key={h} style={{ ...S.th, fontSize:8 }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {invRows.filter(r=>r.status!=="ok").sort((a,b)=>{
                      const order={out:0,critical:1,low:2,watch:3};
                      return order[a.status]-order[b.status];
                    }).map((row,i)=>{
                      const sm = STATUS_META[row.status];
                      const overdue = row.reorderDate && row.reorderDate <= new Date();
                      return (
                        <tr key={i}>
                          <td style={{ ...S.td, fontWeight:700 }}>{row.name}</td>
                          <td style={S.td}><span style={{ fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20, background:sm.bg, color:sm.color }}>{sm.label}</span></td>
                          <td style={S.td}><span style={{ fontWeight:700, color:sm.color }}>{row.unitsToOrder} units</span></td>
                          <td style={S.td}><span style={{ fontWeight:700, color:overdue?"#ff4d6d":"#f5c518" }}>{overdue?"⚠ OVERDUE":fmtDate(row.reorderDate)}</span></td>
                          <td style={S.td}><span style={{ color:"#888" }}>{fmtDate(row.restockArrival)}</span></td>
                          <td style={S.td}>
                            <span style={{ fontSize:11, color:"#555" }}>
                              {row.status==="out"    && "No stock — pausing ads recommended"}
                              {row.status==="critical"&& `${row.daysLeft}d left — order within lead time`}
                              {row.status==="low"    && `~${row.daysLeft}d left — order soon`}
                              {row.status==="watch"  && `~${row.daysLeft}d left — monitor daily`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* How velocity & projections work */}
            <div style={{ ...S.card, marginTop:16, background:"rgba(255,255,255,0.01)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:10 }}>How Projections Work</div>
              <div style={{ fontSize:11, color:"#555", lineHeight:1.9 }}>
                <span style={{ color:"#888" }}>Daily velocity</span> — pulled from your imported Units Sold data. If you import weekly data, it's divided by 7 automatically.<br/>
                <span style={{ color:"#888" }}>Days left</span> — (Units on Hand + Incoming) ÷ Daily Velocity.<br/>
                <span style={{ color:"#888" }}>Reorder by date</span> — Days Left minus Lead Time. Order before this date to avoid a stockout.<br/>
                <span style={{ color:"#888" }}>Units to order</span> — max(MOQ, Threshold × 2 − On Hand − Incoming). Edit MOQ and Threshold per product using the Edit button.<br/>
                <span style={{ color:"#888" }}>Status thresholds</span> — Critical: on hand ≤ threshold OR days left ≤ lead time · Low: days left ≤ 2× lead time · Watch: days left ≤ 30d.
              </div>
            </div>

          </div>
        )}

        {/* ── COMPETITORS ── */}
        {tab==="competitors" && (
          <div>

            {/* API notice */}
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", background:"rgba(199,125,255,0.06)", border:"1px solid rgba(199,125,255,0.15)", borderRadius:8, marginBottom:20, fontSize:11 }}>
              <span style={{ color:"#c77dff", fontWeight:700 }}>⚙ API Ready</span>
              <span style={{ color:"#555" }}>This tab is built to connect to TikTok Shop's competitor/market data API when available. Until then, enter data manually or paste from a spreadsheet.</span>
            </div>

            {/* Top bar: view toggle + actions */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
              <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:4, border:"1px solid rgba(255,255,255,0.07)" }}>
                {[{id:"overview",label:"Overview"},{id:"products",label:"Products"},{id:"commissions",label:"Commissions"},{id:"benchmarks",label:"Benchmarks"}].map(v=>(
                  <button key={v.id} onClick={()=>setCompView(v.id)} style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", padding:"7px 14px", cursor:"pointer", borderRadius:6, background:compView===v.id?"rgba(199,125,255,0.12)":"none", color:compView===v.id?"#c77dff":"#555", border:compView===v.id?"1px solid rgba(199,125,255,0.3)":"1px solid transparent", whiteSpace:"nowrap" }}>{v.label}</button>
                ))}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setCompPasteOpen(o=>!o)} style={{ fontSize:11, padding:"6px 14px", borderRadius:6, cursor:"pointer", background:"rgba(199,125,255,0.08)", color:"#c77dff", border:"1px solid rgba(199,125,255,0.2)" }}>
                  {compPasteOpen?"▲ Collapse":"▼ Paste from Sheet"}
                </button>
                <button onClick={()=>setAddingComp(true)} style={{ fontSize:11, fontWeight:700, padding:"6px 14px", borderRadius:6, cursor:"pointer", background:"rgba(0,229,160,0.08)", color:"#00e5a0", border:"1px solid rgba(0,229,160,0.2)" }}>+ Add Competitor</button>
              </div>
            </div>

            {/* Paste panel */}
            {compPasteOpen && (
              <div style={{ ...S.card, marginBottom:16, border:"1px solid rgba(199,125,255,0.2)" }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#c77dff", fontWeight:700, marginBottom:8 }}>Paste Brand-Level Data from Sheet</div>
                <div style={{ fontSize:11, color:"#555", marginBottom:10, lineHeight:1.7 }}>
                  Paste columns for: <strong style={{ color:"#e8e8f0" }}>Brand, Niche, Followers, Monthly GMV, Running Ads (Y/N), Avg Commission %</strong>. Include header row. Product-level data can be added manually after.
                </div>
                <textarea value={compPasteText} onChange={e=>{ setCompPasteText(e.target.value); setCompPasteError(""); }}
                  placeholder={"Brand\tNiche\tFollowers\tMonthly GMV\tRunning Ads\tAvg Commission\nGlowLab Beauty\tSkincare\t284000\t187000\tY\t18\nPureGlow Co\tClean Beauty\t142000\t94000\tY\t15"}
                  style={{ width:"100%", height:120, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#e8e8f0", fontFamily:"monospace", fontSize:11, padding:10, resize:"vertical", outline:"none", lineHeight:1.6 }}/>
                <div style={{ display:"flex", gap:10, marginTop:10, alignItems:"center" }}>
                  <button onClick={handleCompPaste} style={{ fontSize:12, fontWeight:700, padding:"8px 20px", borderRadius:7, background:"rgba(199,125,255,0.1)", color:"#c77dff", border:"1px solid rgba(199,125,255,0.3)", cursor:"pointer" }}>Import →</button>
                  <input ref={compFileRef} type="file" accept=".csv,.tsv,.txt" onChange={e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setCompPasteText(ev.target.result); r.readAsText(f); }} style={{ display:"none" }}/>
                  <button onClick={()=>compFileRef.current.click()} style={{ fontSize:11, padding:"7px 14px", borderRadius:7, background:"rgba(255,255,255,0.04)", color:"#888", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>Upload file</button>
                  {compPasteText && <button onClick={()=>setCompPasteText("")} style={{ fontSize:11, color:"#ff4d6d", background:"transparent", border:"none", cursor:"pointer" }}>✕ Clear</button>}
                </div>
                {compPasteError && <div style={{ marginTop:8, fontSize:11, color:"#ff4d6d", padding:"6px 10px", background:"rgba(255,77,109,0.08)", borderRadius:6 }}>⚠ {compPasteError}</div>}
                {compPasteOk    && <div style={{ marginTop:8, fontSize:11, color:"#00e5a0" }}>✓ Competitors updated.</div>}
              </div>
            )}

            {/* Add competitor form */}
            {addingComp && (
              <div style={{ ...S.card, marginBottom:16, border:"1px solid rgba(0,229,160,0.2)" }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#00e5a0", fontWeight:700, marginBottom:14 }}>New Competitor</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 }}>
                  {[["Brand Name","brand","text"],["Niche / Category","niche","text"],["Followers","followers","number"],["Est. Monthly GMV ($)","monthlyGMV","number"]].map(([label,field,type])=>(
                    <div key={field}>
                      <div style={{ fontSize:9, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>{label}</div>
                      <input type={type} value={newComp[field]} onChange={e=>setNewComp(p=>({...p,[field]:type==="number"?parseFloat(e.target.value)||0:e.target.value}))}
                        style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"6px 10px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, outline:"none" }}/>
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize:9, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>Running Ads?</div>
                    <div style={{ display:"flex", gap:8, marginTop:4 }}>
                      {[true,false].map(v=>(
                        <button key={String(v)} onClick={()=>setNewComp(p=>({...p,running_ads:v}))} style={{ fontSize:11, fontWeight:700, padding:"5px 14px", borderRadius:6, cursor:"pointer", background:newComp.running_ads===v?"rgba(0,229,160,0.1)":"rgba(255,255,255,0.04)", color:newComp.running_ads===v?"#00e5a0":"#555", border:newComp.running_ads===v?"1px solid rgba(0,229,160,0.3)":"1px solid rgba(255,255,255,0.08)" }}>{v?"Yes":"No"}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={saveNewComp} style={{ fontSize:12, fontWeight:700, padding:"7px 18px", borderRadius:6, background:"rgba(0,229,160,0.1)", color:"#00e5a0", border:"1px solid rgba(0,229,160,0.3)", cursor:"pointer" }}>✓ Save Competitor</button>
                  <button onClick={()=>{ setAddingComp(false); setNewComp(BLANK_COMP); }} style={{ fontSize:11, padding:"7px 14px", borderRadius:6, background:"transparent", color:"#555", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Your brand settings bar */}
            <div style={{ ...S.card, marginBottom:16, background:"rgba(0,229,160,0.03)", border:"1px solid rgba(0,229,160,0.12)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#00e5a0", fontWeight:700, whiteSpace:"nowrap" }}>Your Brand</div>
                <div style={{ display:"flex", gap:16, flexWrap:"wrap", flex:1, alignItems:"center" }}>
                  {[["Affiliate Commission %","commissionRate"],["Monthly GMV ($)","monthlyGMV"],["Followers","followers"]].map(([label,field])=>(
                    <div key={field} style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:10, color:"#555" }}>{label}:</span>
                      <input type="number" value={yourBrand[field]} onChange={e=>setYourBrand(p=>({...p,[field]:parseFloat(e.target.value)||0}))}
                        style={{ width:90, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:5, padding:"3px 8px", color:"#00e5a0", fontFamily:"inherit", fontSize:12, fontWeight:700, outline:"none" }}/>
                    </div>
                  ))}
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:10, color:"#555" }}>Avg Product Price:</span>
                    <span style={{ fontSize:12, fontWeight:700, color:"#00e5a0" }}>${yourAvgPrice}</span>
                    <span style={{ fontSize:9, color:"#444" }}>(from catalog)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── OVERVIEW VIEW ── */}
            {compView==="overview" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
                  {competitors.map(comp=>{
                    const avgComm = comp.products.length ? r2(comp.products.reduce((s,p)=>s+p.commission,0)/comp.products.length) : null;
                    const avgPrice = comp.products.length ? r2(comp.products.reduce((s,p)=>s+p.price,0)/comp.products.length) : null;
                    const avgRating = comp.products.length ? r2(comp.products.reduce((s,p)=>s+p.rating,0)/comp.products.length) : null;
                    const isEditing = editingComp===comp.id;
                    return (
                      <div key={comp.id} style={{ ...S.card, border:"1px solid rgba(199,125,255,0.15)" }}>
                        {/* Header */}
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                          <div>
                            {isEditing
                              ? <input value={comp.brand} onChange={e=>updateCompField(comp.id,"brand",e.target.value)} style={{ fontSize:14, fontWeight:700, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(199,125,255,0.3)", borderRadius:4, padding:"3px 8px", color:"#e8e8f0", fontFamily:"inherit", outline:"none", width:180, marginBottom:4 }}/>
                              : <div style={{ fontSize:14, fontWeight:700, color:"#e8e8f0", marginBottom:2 }}>{comp.brand}</div>
                            }
                            {isEditing
                              ? <input value={comp.niche} onChange={e=>updateCompField(comp.id,"niche",e.target.value)} style={{ fontSize:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"2px 6px", color:"#888", fontFamily:"inherit", outline:"none", width:160 }}/>
                              : <div style={{ fontSize:10, color:"#555" }}>{comp.niche}</div>
                            }
                          </div>
                          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                            {comp.running_ads && <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:20, background:"rgba(255,107,53,0.1)", color:"#ff6b35", border:"1px solid rgba(255,107,53,0.2)" }}>Running Ads</span>}
                            <button onClick={()=>setEditingComp(isEditing?null:comp.id)} style={{ fontSize:10, padding:"3px 8px", borderRadius:5, cursor:"pointer", background:isEditing?"rgba(0,229,160,0.1)":"rgba(255,255,255,0.04)", color:isEditing?"#00e5a0":"#555", border:isEditing?"1px solid rgba(0,229,160,0.3)":"1px solid rgba(255,255,255,0.08)" }}>{isEditing?"✓":"Edit"}</button>
                            <button onClick={()=>deleteComp(comp.id)} style={{ fontSize:10, padding:"3px 8px", borderRadius:5, cursor:"pointer", background:"rgba(255,77,109,0.06)", color:"#ff4d6d", border:"1px solid rgba(255,77,109,0.15)" }}>✕</button>
                          </div>
                        </div>

                        {/* Stats grid */}
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
                          {[
                            ["Followers",  comp.followers>0?(comp.followers/1000).toFixed(0)+"K":"—",  "#aaa",        isEditing?"followers":null],
                            ["Monthly GMV","$"+(comp.monthlyGMV>0?(comp.monthlyGMV/1000).toFixed(0)+"K":"—"), yourBrand.monthlyGMV>0?(comp.monthlyGMV>yourBrand.monthlyGMV?"#ff4d6d":"#00e5a0"):"#aaa", isEditing?"monthlyGMV":null],
                            ["Avg Commission", avgComm!==null?avgComm+"%":"—", avgComm!==null?(avgComm>yourBrand.commissionRate?"#ff4d6d":avgComm===yourBrand.commissionRate?"#f5c518":"#00e5a0"):"#555", null],
                            ["Avg Price",   avgPrice!==null?"$"+avgPrice:"—", avgPrice!==null?(avgPrice<yourAvgPrice?"#ff4d6d":avgPrice>yourAvgPrice?"#00e5a0":"#f5c518"):"#555", null],
                            ["Avg Rating",  avgRating!==null?avgRating+"★":"—", avgRating>=4.5?"#f5c518":avgRating>=4?"#00e5a0":"#aaa", null],
                            ["Products",   comp.products.length, "#aaa", null],
                          ].map(([k,v,c,editField])=>(
                            <div key={k} style={{ background:"rgba(255,255,255,0.03)", borderRadius:6, padding:"8px 10px" }}>
                              <div style={{ fontSize:8, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>{k}</div>
                              {isEditing && editField
                                ? <input type="number" value={comp[editField]} onChange={e=>updateCompField(comp.id,editField,parseFloat(e.target.value)||0)} style={{ width:"100%", background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.2)", color:c, fontFamily:"inherit", fontSize:14, fontWeight:700, outline:"none", padding:"0 0 2px" }}/>
                                : <div style={{ fontSize:14, fontWeight:700, color:c }}>{v}</div>
                              }
                            </div>
                          ))}
                        </div>

                        {/* Running ads toggle in edit */}
                        {isEditing && (
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                            <span style={{ fontSize:10, color:"#555" }}>Running ads:</span>
                            {[true,false].map(v=>(
                              <button key={String(v)} onClick={()=>updateCompField(comp.id,"running_ads",v)} style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, cursor:"pointer", background:comp.running_ads===v?"rgba(255,107,53,0.1)":"transparent", color:comp.running_ads===v?"#ff6b35":"#555", border:comp.running_ads===v?"1px solid rgba(255,107,53,0.3)":"1px solid rgba(255,255,255,0.08)" }}>{v?"Yes":"No"}</button>
                            ))}
                          </div>
                        )}

                        {/* Products expand */}
                        <button onClick={()=>setExpandedComp(expandedComp===comp.id?null:comp.id)} style={{ fontSize:10, color:"#555", background:"transparent", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit", width:"100%", textAlign:"left" }}>
                          {expandedComp===comp.id?"▲ Hide":"▼ Show"} {comp.products.length} product{comp.products.length!==1?"s":""}
                        </button>
                        {expandedComp===comp.id && (
                          <div style={{ marginTop:10 }}>
                            {comp.products.map((prod,pi)=>(
                              <div key={pi} style={{ padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr auto", gap:8, alignItems:"center", fontSize:11 }}>
                                <span style={{ fontWeight:600, color:"#e8e8f0" }}>{prod.name}</span>
                                <span style={{ color: prod.price<yourAvgPrice?"#ff4d6d":prod.price>yourAvgPrice?"#00e5a0":"#f5c518" }}>${prod.price}</span>
                                <span style={{ color: prod.commission>yourBrand.commissionRate?"#ff4d6d":"#00e5a0" }}>{prod.commission}% comm</span>
                                <span style={{ color:"#f5c518" }}>{prod.rating}★ ({prod.reviews})</span>
                                <span style={{ color:prod.discount>0?"#ff6b35":"#444" }}>{prod.discount>0?"-"+prod.discount+"%":"No disc"}</span>
                                <button onClick={()=>deleteProd(comp.id,pi)} style={{ fontSize:9, color:"#ff4d6d", background:"transparent", border:"none", cursor:"pointer" }}>✕</button>
                              </div>
                            ))}
                            {/* Add product */}
                            {addingProd===comp.id
                              ? <div style={{ marginTop:10, padding:"10px", background:"rgba(255,255,255,0.03)", borderRadius:8, border:"1px solid rgba(255,255,255,0.07)" }}>
                                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:8 }}>
                                    {[["Product Name","name","text"],["Price ($)","price","number"],["Commission (%)","commission","number"],["Discount (%)","discount","number"],["Rating","rating","number"],["Reviews","reviews","number"]].map(([label,field,type])=>(
                                      <div key={field}>
                                        <div style={{ fontSize:8, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>{label}</div>
                                        <input type={type} value={newProd[field]} onChange={e=>setNewProd(p=>({...p,[field]:type==="number"?parseFloat(e.target.value)||0:e.target.value}))}
                                          style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"4px 7px", color:"#e8e8f0", fontFamily:"inherit", fontSize:11, outline:"none" }}/>
                                      </div>
                                    ))}
                                  </div>
                                  <div style={{ display:"flex", gap:6 }}>
                                    <button onClick={()=>saveNewProd(comp.id)} style={{ fontSize:10, fontWeight:700, padding:"4px 12px", borderRadius:5, background:"rgba(0,229,160,0.1)", color:"#00e5a0", border:"1px solid rgba(0,229,160,0.25)", cursor:"pointer" }}>+ Add</button>
                                    <button onClick={()=>{ setAddingProd(null); setNewProd(BLANK_PROD); }} style={{ fontSize:10, padding:"4px 10px", borderRadius:5, background:"transparent", color:"#555", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>Cancel</button>
                                  </div>
                                </div>
                              : <button onClick={()=>{ setAddingProd(comp.id); setNewProd(BLANK_PROD); }} style={{ marginTop:8, fontSize:10, color:"#555", background:"transparent", border:"1px dashed rgba(255,255,255,0.1)", borderRadius:5, padding:"4px 12px", cursor:"pointer", width:"100%" }}>+ Add product</button>
                            }
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {competitors.length===0 && <div style={{ ...S.card, textAlign:"center", padding:40, color:"#444", fontSize:12 }}>No competitors yet — add one above or paste from a sheet.</div>}
              </div>
            )}

            {/* ── PRODUCTS VIEW ── */}
            {compView==="products" && (
              <div style={S.card}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>All Competitor Products vs Your Catalog</div>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                  <thead>
                    <tr>{["Brand","Product","Their Price","Your Closest","Price Gap","Commission","Discount","Rating","Reviews","Ads?"].map(h=>(
                      <th key={h} style={{ ...S.th, fontSize:8, whiteSpace:"nowrap" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {competitors.flatMap(comp=>comp.products.map((prod,pi)=>{
                      const closest = catalog.reduce((best,p)=>{ const diff=Math.abs((p.discountedPrice||p.retailPrice||0)-prod.price); const bdiff=Math.abs((best?.discountedPrice||best?.retailPrice||0)-prod.price); return diff<bdiff?p:best; }, catalog[0]);
                      const yourP   = closest ? (closest.discountedPrice||closest.retailPrice||0) : 0;
                      const gap     = yourP>0 ? r2(((yourP-prod.price)/prod.price)*100) : null;
                      return (
                        <tr key={comp.id+pi}>
                          <td style={S.td}><span style={{ fontWeight:700, color:"#c77dff" }}>{comp.brand}</span></td>
                          <td style={{ ...S.td, maxWidth:160 }}><span style={{ fontWeight:600 }}>{prod.name}</span></td>
                          <td style={S.td}><span style={{ fontWeight:700 }}>${prod.price}</span></td>
                          <td style={S.td}><span style={{ color:"#00e5a0" }}>{closest?"$"+(closest.discountedPrice||closest.retailPrice||0)+" ("+closest.name+")":"—"}</span></td>
                          <td style={S.td}>
                            {gap!==null
                              ? <span style={{ fontWeight:700, color:gap>10?"#00e5a0":gap<-10?"#ff4d6d":"#f5c518" }}>{gap>0?"+":""}{gap}%</span>
                              : <span style={{ color:"#444" }}>—</span>}
                          </td>
                          <td style={S.td}><span style={{ color:prod.commission>yourBrand.commissionRate?"#ff4d6d":"#00e5a0", fontWeight:700 }}>{prod.commission}%</span></td>
                          <td style={S.td}><span style={{ color:prod.discount>0?"#ff6b35":"#444" }}>{prod.discount>0?"-"+prod.discount+"%":"—"}</span></td>
                          <td style={S.td}><span style={{ color:prod.rating>=4.5?"#f5c518":"#aaa" }}>{prod.rating}★</span></td>
                          <td style={S.td}><span style={{ color:"#555" }}>{prod.reviews.toLocaleString()}</span></td>
                          <td style={S.td}>{comp.running_ads?<span style={{ fontSize:9, fontWeight:700, color:"#ff6b35", background:"rgba(255,107,53,0.1)", padding:"2px 6px", borderRadius:20 }}>Yes</span>:<span style={{ color:"#444" }}>No</span>}</td>
                        </tr>
                      );
                    }))}
                  </tbody>
                </table>
                {competitors.flatMap(c=>c.products).length===0 && <div style={{ padding:"30px 0", textAlign:"center", color:"#555", fontSize:12 }}>No competitor products yet — expand a competitor card and add products.</div>}
              </div>
            )}

            {/* ── COMMISSIONS VIEW ── */}
            {compView==="commissions" && (
              <div>
                {/* Your rate vs market */}
                <div style={{ ...S.card, marginBottom:16, background: yourBrand.commissionRate>=avgCompCommission?"rgba(0,229,160,0.04)":"rgba(255,77,109,0.04)", border:`1px solid ${yourBrand.commissionRate>=avgCompCommission?"rgba(0,229,160,0.15)":"rgba(255,77,109,0.15)"}` }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
                    <div>
                      <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:8 }}>Your Affiliate Commission vs Market</div>
                      <div style={{ display:"flex", alignItems:"baseline", gap:12 }}>
                        <span style={{ fontSize:36, fontWeight:700, color: yourBrand.commissionRate>=avgCompCommission?"#00e5a0":"#ff4d6d" }}>{yourBrand.commissionRate}%</span>
                        <span style={{ fontSize:14, color:"#555" }}>you  vs  {avgCompCommission}% market avg</span>
                      </div>
                    </div>
                    <div style={{ fontSize:12, color: yourBrand.commissionRate>=avgCompCommission?"#00e5a0":"#ff4d6d", maxWidth:320, lineHeight:1.6 }}>
                      {yourBrand.commissionRate>=avgCompCommission
                        ? `✓ Your rate is at or above market average — affiliates have a financial incentive to prefer your products.`
                        : `⚠ Your rate is below market average by ${r2(avgCompCommission-yourBrand.commissionRate)}pp. Affiliates may deprioritize your products in favour of competitors.`}
                    </div>
                  </div>
                </div>

                {/* Commission comparison table */}
                <div style={S.card}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Commission Rate — Brand Comparison</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead><tr>{["Brand","Avg Commission","vs Your Rate","Product Count","Running Ads","Est. Monthly GMV"].map(h=><th key={h} style={{ ...S.th, fontSize:8 }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {/* Your brand row */}
                      <tr style={{ background:"rgba(0,229,160,0.04)" }}>
                        <td style={S.td}><span style={{ fontWeight:700, color:"#00e5a0" }}>Your Brand ★</span></td>
                        <td style={S.td}><span style={{ fontWeight:700, color:"#00e5a0", fontSize:14 }}>{yourBrand.commissionRate}%</span></td>
                        <td style={S.td}><span style={{ color:"#555" }}>—</span></td>
                        <td style={S.td}><span style={{ color:"#aaa" }}>{catalog.length}</span></td>
                        <td style={S.td}><span style={{ fontSize:9, fontWeight:700, color:"#ff6b35", background:"rgba(255,107,53,0.1)", padding:"2px 6px", borderRadius:20 }}>Yes</span></td>
                        <td style={S.td}><span style={{ fontWeight:700 }}>{yourBrand.monthlyGMV>0?"$"+(yourBrand.monthlyGMV/1000).toFixed(0)+"K":"—"}</span></td>
                      </tr>
                      {competitors.map(comp=>{
                        const avgComm = comp.products.length ? r2(comp.products.reduce((s,p)=>s+p.commission,0)/comp.products.length) : null;
                        const diff = avgComm!==null ? r2(avgComm-yourBrand.commissionRate) : null;
                        return (
                          <tr key={comp.id}>
                            <td style={S.td}><span style={{ fontWeight:600 }}>{comp.brand}</span><div style={{ fontSize:9, color:"#555" }}>{comp.niche}</div></td>
                            <td style={S.td}><span style={{ fontWeight:700, fontSize:14, color:avgComm!==null?(avgComm>yourBrand.commissionRate?"#ff4d6d":"#00e5a0"):"#444" }}>{avgComm!==null?avgComm+"%":"—"}</span></td>
                            <td style={S.td}>{diff!==null?<span style={{ fontWeight:700, color:diff>0?"#ff4d6d":"#00e5a0" }}>{diff>0?"+":""}{diff}pp</span>:<span style={{ color:"#444" }}>—</span>}</td>
                            <td style={S.td}><span style={{ color:"#aaa" }}>{comp.products.length}</span></td>
                            <td style={S.td}>{comp.running_ads?<span style={{ fontSize:9, fontWeight:700, color:"#ff6b35", background:"rgba(255,107,53,0.1)", padding:"2px 6px", borderRadius:20 }}>Yes</span>:<span style={{ color:"#444" }}>No</span>}</td>
                            <td style={S.td}><span style={{ color:comp.monthlyGMV>yourBrand.monthlyGMV?"#ff4d6d":"#aaa" }}>{comp.monthlyGMV>0?"$"+(comp.monthlyGMV/1000).toFixed(0)+"K":"—"}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── BENCHMARKS VIEW ── */}
            {compView==="benchmarks" && (
              <div>
                {/* Summary scorecard */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
                  {[
                    { label:"Your Price vs Market",  yours:"$"+yourAvgPrice, market:"$"+avgCompPrice, better:yourAvgPrice>0&&avgCompPrice>0&&yourAvgPrice<=avgCompPrice*1.1, note:yourAvgPrice>0&&avgCompPrice>0?(yourAvgPrice<=avgCompPrice?"At or below market":"+"+ r2((yourAvgPrice/avgCompPrice-1)*100)+"%  above market"):"Set prices in catalog" },
                    { label:"Commission Rate",        yours:yourBrand.commissionRate+"%", market:avgCompCommission+"%", better:yourBrand.commissionRate>=avgCompCommission, note:yourBrand.commissionRate>=avgCompCommission?"Competitive for affiliates":"Below market — review rate" },
                    { label:"Monthly GMV",            yours:yourBrand.monthlyGMV>0?"$"+(yourBrand.monthlyGMV/1000).toFixed(0)+"K":"—", market:"$"+(avgCompGMV/1000).toFixed(0)+"K avg", better:yourBrand.monthlyGMV>=avgCompGMV, note:yourBrand.monthlyGMV>0?(yourBrand.monthlyGMV>=avgCompGMV?"Above average":"Below average competitor GMV"):"Enter your GMV above" },
                    { label:"Competitors Running Ads",yours:"You: Yes", market:competitors.filter(c=>c.running_ads).length+" of "+competitors.length, better:true, note:"Stay competitive — maintain paid presence" },
                  ].map((s,i)=>(
                    <div key={i} style={{ ...S.card, borderColor:s.better?"rgba(0,229,160,0.2)":"rgba(255,77,109,0.2)" }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:10 }}>{s.label}</div>
                      <div style={{ fontSize:22, fontWeight:700, color:s.better?"#00e5a0":"#ff4d6d", marginBottom:4 }}>{s.yours}</div>
                      <div style={{ fontSize:11, color:"#555", marginBottom:6 }}>Market: {s.market}</div>
                      <div style={{ fontSize:10, color:s.better?"#00e5a0":"#ff4d6d", fontWeight:700 }}>{s.better?"✓":"⚠"} {s.note}</div>
                    </div>
                  ))}
                </div>

                {/* Pricing gap analysis */}
                <div style={{ ...S.card, marginBottom:16 }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Pricing Gap — Your Products vs Competitor Equivalents</div>
                  {catalog.filter(p=>p.retailPrice>0||p.discountedPrice>0).length===0
                    ? <div style={{ color:"#555", fontSize:12 }}>Import your catalog prices first via Data Import.</div>
                    : catalog.filter(p=>p.retailPrice>0||p.discountedPrice>0).map(p=>{
                        const yourP = p.discountedPrice||p.retailPrice;
                        const compProds = competitors.flatMap(c=>c.products.filter(cp=>cp.name.toLowerCase().split(" ").some(w=>w.length>3&&p.name.toLowerCase().includes(w))||p.name.toLowerCase().split(" ").some(w=>w.length>3&&cp.name.toLowerCase().includes(w))));
                        if (!compProds.length) return null;
                        const avgCompP = r2(compProds.reduce((s,cp)=>s+cp.price,0)/compProds.length);
                        const gap = r2(((yourP-avgCompP)/avgCompP)*100);
                        const gapColor = Math.abs(gap)<=10?"#00e5a0":gap>10?"#f5c518":"#ff4d6d";
                        return (
                          <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                            <div style={{ minWidth:160, fontSize:12, fontWeight:700 }}>{p.name}</div>
                            <div style={{ fontSize:13, fontWeight:700, color:"#00e5a0", minWidth:60 }}>${yourP}</div>
                            <div style={{ fontSize:11, color:"#555", minWidth:120 }}>vs avg ${avgCompP} ({compProds.length} comp{compProds.length!==1?"s":""})</div>
                            <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
                              <div style={{ height:"100%", width:Math.min(Math.abs(gap)*2,100)+"%", background:gapColor, borderRadius:3 }}/>
                            </div>
                            <span style={{ fontSize:12, fontWeight:700, color:gapColor, minWidth:60, textAlign:"right" }}>{gap>0?"+":""}{gap}%</span>
                            <span style={{ fontSize:10, color:gapColor, minWidth:80 }}>{Math.abs(gap)<=10?"✓ In range":gap>10?"Above market":"Below market"}</span>
                          </div>
                        );
                      }).filter(Boolean)
                  }
                </div>

                {/* Discount activity */}
                <div style={S.card}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Competitor Discount Activity</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
                    {competitors.map(comp=>{
                      const discProds = comp.products.filter(p=>p.discount>0);
                      const avgDisc   = discProds.length ? r2(discProds.reduce((s,p)=>s+p.discount,0)/discProds.length) : 0;
                      return (
                        <div key={comp.id} style={{ padding:"12px 14px", background:"rgba(255,255,255,0.03)", borderRadius:8, border:"1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ fontSize:11, fontWeight:700, marginBottom:8 }}>{comp.brand}</div>
                          <div style={{ fontSize:20, fontWeight:700, color:avgDisc>=15?"#ff6b35":avgDisc>0?"#f5c518":"#444", marginBottom:2 }}>{avgDisc>0?"-"+avgDisc+"%":"No discounts"}</div>
                          <div style={{ fontSize:10, color:"#555" }}>{discProds.length} of {comp.products.length} products discounted</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── LAUNCHES ── */}
        {tab==="launches" && (
          <div>
            {/* Header bar */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#c77dff", fontWeight:700, marginBottom:4 }}>Launch Planner</div>
                <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>{launches.length} product launch{launches.length!==1?"es":""} tracked</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:3, border:"1px solid rgba(255,255,255,0.07)" }}>
                  {[{id:"pipeline",label:"Pipeline"},{id:"brief",label:"Briefs"},{id:"projections",label:"Projections"}].map(v=>(
                    <button key={v.id} onClick={()=>{ setLaunchView(v.id); setActiveLaunch(null); }} style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", padding:"6px 14px", cursor:"pointer", borderRadius:6, background:launchView===v.id?"rgba(199,125,255,0.12)":"none", color:launchView===v.id?"#c77dff":"#555", border:launchView===v.id?"1px solid rgba(199,125,255,0.3)":"1px solid transparent", whiteSpace:"nowrap" }}>{v.label}</button>
                  ))}
                </div>
                <button onClick={()=>setAddingLaunch(true)} style={{ fontSize:11, fontWeight:700, padding:"7px 14px", borderRadius:7, background:"rgba(199,125,255,0.08)", color:"#c77dff", border:"1px solid rgba(199,125,255,0.2)", cursor:"pointer" }}>+ New Launch</button>
              </div>
            </div>

            {/* New launch form */}
            {addingLaunch && (
              <div style={{ ...S.card, marginBottom:20, border:"1px solid rgba(199,125,255,0.25)" }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#c77dff", fontWeight:700, marginBottom:14 }}>New Product Launch</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 }}>
                  {[["Product Name","name","text"],["Niche / Category","niche","text"],["Launch Date","launchDate","date"],["Target Price ($)","targetPrice","number"],["Commission Rate (%)","commissionRate","number"],["Ad Budget ($)","adBudget","number"],["Projected Units","projectedUnits","number"]].map(([label,field,type])=>(
                    <div key={field}>
                      <div style={{ fontSize:9, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>{label}</div>
                      <input type={type} value={newLaunch[field]} onChange={e=>setNewLaunch(p=>({...p,[field]:type==="number"?parseFloat(e.target.value)||0:e.target.value}))}
                        style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"6px 10px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, outline:"none" }}/>
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize:9, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>Comparable SKU</div>
                    <select value={newLaunch.comparableSKU} onChange={e=>setNewLaunch(p=>({...p,comparableSKU:e.target.value}))} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"6px 10px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, outline:"none" }}>
                      <option value="">None</option>
                      {catalog.filter(p=>p.revenue>0).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:9, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>Launch Brief</div>
                  <textarea value={newLaunch.brief} onChange={e=>setNewLaunch(p=>({...p,brief:e.target.value}))} placeholder="Target audience, hook angle, seeding strategy, bundle opportunities…" style={{ width:"100%", height:70, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"8px 10px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, resize:"vertical", outline:"none" }}/>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={saveNewLaunch} style={{ fontSize:12, fontWeight:700, padding:"8px 20px", borderRadius:7, background:"rgba(199,125,255,0.12)", color:"#c77dff", border:"1px solid rgba(199,125,255,0.3)", cursor:"pointer" }}>✓ Create Launch</button>
                  <button onClick={()=>{ setAddingLaunch(false); setNewLaunch(BLANK_LAUNCH); }} style={{ fontSize:11, padding:"7px 14px", borderRadius:7, background:"transparent", color:"#555", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>Cancel</button>
                </div>
              </div>
            )}

            {/* ── PIPELINE VIEW ── */}
            {launchView==="pipeline" && !activeLaunch && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
                {LAUNCH_STAGES.map(stage=>{
                  const stageLaunches = launches.filter(l=>l.stage===stage.id);
                  return (
                    <div key={stage.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${stage.color}22`, borderRadius:12, padding:"14px 14px" }}>
                      {/* Stage header */}
                      <div style={{ marginBottom:14 }}>
                        <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:stage.color, fontWeight:700, marginBottom:2 }}>{stage.label}</div>
                        <div style={{ fontSize:10, color:"#555" }}>{stage.desc} · {stageLaunches.length} product{stageLaunches.length!==1?"s":""}</div>
                      </div>
                      {/* Launch cards */}
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {stageLaunches.map(l=>{
                          const {pct,revPct} = launchProgress(l);
                          const comp = catalog.find(p=>p.id===l.comparableSKU);
                          return (
                            <div key={l.id} onClick={()=>{ setActiveLaunch(l.id); setLaunchView("brief"); }} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${stage.color}33`, borderRadius:9, padding:"12px 13px", cursor:"pointer" }}
                              onMouseEnter={e=>e.currentTarget.style.borderColor=stage.color+"88"}
                              onMouseLeave={e=>e.currentTarget.style.borderColor=stage.color+"33"}>
                              <div style={{ fontSize:12, fontWeight:700, color:"#e8e8f0", marginBottom:4 }}>{l.name}</div>
                              {l.launchDate&&<div style={{ fontSize:10, color:"#555", marginBottom:8 }}>📅 {new Date(l.launchDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>}
                              {/* Checklist progress bar */}
                              <div style={{ marginBottom:8 }}>
                                <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#555", marginBottom:4 }}>
                                  <span>Checklist</span><span style={{ color:pct===100?stage.color:"#555" }}>{pct}%</span>
                                </div>
                                <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
                                  <div style={{ height:"100%", width:pct+"%", background:stage.color, borderRadius:2 }}/>
                                </div>
                              </div>
                              <div style={{ display:"flex", gap:10, fontSize:10 }}>
                                <span style={{ color:"#555" }}>${l.targetPrice}</span>
                                <span style={{ color:"#c77dff" }}>{l.commissionRate}% comm</span>
                                {l.creators.length>0&&<span style={{ color:"#ff6b35" }}>{l.creators.length} creator{l.creators.length!==1?"s":""}</span>}
                              </div>
                              {l.stage==="full"&&l.projectedRevenue>0&&(
                                <div style={{ marginTop:8, fontSize:10, color:revPct>=100?"#00e5a0":revPct>=70?"#f5c518":"#ff4d6d", fontWeight:700 }}>{revPct}% of proj. rev</div>
                              )}
                            </div>
                          );
                        })}
                        {stageLaunches.length===0&&<div style={{ fontSize:11, color:"#333", textAlign:"center", padding:"20px 0" }}>No launches</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── BRIEF / DETAIL VIEW ── */}
            {(launchView==="brief"||(launchView==="pipeline"&&activeLaunch)) && activeLaunch && (()=>{
              const l = launches.find(x=>x.id===activeLaunch);
              if (!l) return null;
              const stage = LAUNCH_STAGES.find(s=>s.id===l.stage);
              const comp  = catalog.find(p=>p.id===l.comparableSKU);
              const {pct} = launchProgress(l);
              return (
                <div>
                  {/* Back + stage mover */}
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, flexWrap:"wrap" }}>
                    <button onClick={()=>setActiveLaunch(null)} style={{ fontSize:11, color:"#555", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontFamily:"inherit" }}>← Pipeline</button>
                    <span style={{ fontSize:14, fontWeight:700, color:"#e8e8f0" }}>{l.name}</span>
                    <div style={{ display:"flex", gap:6, marginLeft:"auto" }}>
                      {LAUNCH_STAGES.map(s=>(
                        <button key={s.id} onClick={()=>moveStage(l.id,s.id)} style={{ fontSize:10, fontWeight:700, padding:"4px 12px", borderRadius:20, cursor:"pointer", background:l.stage===s.id?s.bg:"transparent", color:l.stage===s.id?s.color:"#555", border:`1px solid ${l.stage===s.id?s.color+"44":"rgba(255,255,255,0.07)"}` }}>{s.label}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                    {/* Left: brief + metrics */}
                    <div>
                      {/* Key numbers */}
                      <div style={{ ...S.card, marginBottom:14, borderColor:stage.color+"22" }}>
                        <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:stage.color, fontWeight:700, marginBottom:14 }}>Launch Metrics</div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
                          {[
                            ["Target Price","$"+l.targetPrice,"#fff"],
                            ["Commission",l.commissionRate+"%","#c77dff"],
                            ["Ad Budget","$"+l.adBudget,"#ff6b35"],
                            ["Proj. Units",l.projectedUnits||"—","#aaa"],
                            ["Proj. Revenue",l.projectedRevenue>0?"$"+(l.projectedRevenue/1000).toFixed(1)+"k":"—","#aaa"],
                            ["Launch Date",l.launchDate?new Date(l.launchDate).toLocaleDateString("en-US",{month:"short",day:"numeric"}):"TBD","#555"],
                          ].map(([k,v,c])=>(
                            <div key={k} style={{ background:"rgba(255,255,255,0.03)", borderRadius:6, padding:"8px 10px" }}>
                              <div style={{ fontSize:8, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>{k}</div>
                              <div style={{ fontSize:14, fontWeight:700, color:c }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        {/* Actuals if live */}
                        {(l.stage==="full"||l.stage==="review")&&(
                          <div style={{ padding:"10px 12px", background:"rgba(0,229,160,0.04)", borderRadius:8, border:"1px solid rgba(0,229,160,0.12)" }}>
                            <div style={{ fontSize:9, color:"#00e5a0", letterSpacing:1.5, textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>Actuals</div>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                              {[["Actual Units",l.actualUnits||"—",l.actualUnits>=l.projectedUnits?"#00e5a0":"#f5c518"],["Actual Revenue",l.actualRevenue>0?"$"+(l.actualRevenue/1000).toFixed(1)+"k":"—",l.actualRevenue>=l.projectedRevenue?"#00e5a0":"#f5c518"],["vs Projection",l.projectedRevenue>0?r2(l.actualRevenue/l.projectedRevenue*100)+"%":"—",l.actualRevenue>=l.projectedRevenue?"#00e5a0":"#ff4d6d"]].map(([k,v,c])=>(
                                <div key={k}><div style={{ fontSize:8, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>{k}</div><div style={{ fontSize:14, fontWeight:700, color:c }}>{v}</div></div>
                              ))}
                            </div>
                            {/* Editable actuals */}
                            <div style={{ display:"flex", gap:10, marginTop:10 }}>
                              {[["Actual Units","actualUnits"],["Actual Revenue","actualRevenue"]].map(([label,field])=>(
                                <div key={field} style={{ flex:1 }}>
                                  <div style={{ fontSize:8, color:"#555", marginBottom:3 }}>{label}</div>
                                  <input type="number" value={l[field]} onChange={e=>updateLaunchField(l.id,field,parseFloat(e.target.value)||0)} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:4, padding:"3px 8px", color:"#00e5a0", fontFamily:"inherit", fontSize:11, outline:"none" }}/>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Brief */}
                      <div style={{ ...S.card, marginBottom:14 }}>
                        <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:10 }}>Launch Brief</div>
                        <textarea value={l.brief} onChange={e=>updateLaunchField(l.id,"brief",e.target.value)} placeholder="Target audience, hook angle, seeding strategy, bundle opportunities…" style={{ width:"100%", height:90, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"8px 10px", color:"#e8e8f0", fontFamily:"inherit", fontSize:11, resize:"vertical", outline:"none", lineHeight:1.6 }}/>
                      </div>

                      {/* Comparable SKU */}
                      {comp&&(
                        <div style={{ ...S.card, marginBottom:14, background:"rgba(199,125,255,0.03)", border:"1px solid rgba(199,125,255,0.15)" }}>
                          <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#c77dff", fontWeight:700, marginBottom:10 }}>Comparable SKU — {comp.name}</div>
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                            {[["Revenue","$"+(comp.revenue/1000).toFixed(1)+"k","#fff"],["Units",comp.units||"—","#aaa"],["ROAS",comp.roas>0?comp.roas+"x":"—",comp.roas>=2.5?"#00e5a0":"#f5c518"],["Margin",comp.margin>0?comp.margin+"%":"—",comp.margin>=25?"#00e5a0":"#f5c518"]].map(([k,v,c])=>(
                              <div key={k} style={{ background:"rgba(255,255,255,0.03)", borderRadius:6, padding:"8px 10px", textAlign:"center" }}>
                                <div style={{ fontSize:8, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>{k}</div>
                                <div style={{ fontSize:13, fontWeight:700, color:c }}>{v}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ fontSize:10, color:"#555", marginTop:8 }}>Daily velocity: ~{comp.units||0} units/day · Proj. launch velocity at ${l.targetPrice}: ~{comp.units?Math.round(comp.units*(comp.discountedPrice||comp.retailPrice||1)/l.targetPrice):0} units/day</div>
                        </div>
                      )}

                      {/* Notes */}
                      <div style={S.card}>
                        <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:8 }}>Notes</div>
                        <textarea value={l.notes} onChange={e=>updateLaunchField(l.id,"notes",e.target.value)} placeholder="Observations, issues, decisions…" style={{ width:"100%", height:70, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"8px 10px", color:"#e8e8f0", fontFamily:"inherit", fontSize:11, resize:"vertical", outline:"none", lineHeight:1.6 }}/>
                      </div>
                    </div>

                    {/* Right: checklist + creators */}
                    <div>
                      {/* Checklist */}
                      <div style={{ ...S.card, marginBottom:14 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                          <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700 }}>Launch Checklist</div>
                          <span style={{ fontSize:11, color:pct===100?"#00e5a0":"#555", fontWeight:700 }}>{pct}% complete</span>
                        </div>
                        {LAUNCH_STAGES.map(s=>{
                          const items = CHECKLIST_ITEMS[s.id];
                          const checks = l.checklist[s.id]||[];
                          const done = checks.filter(Boolean).length;
                          return (
                            <div key={s.id} style={{ marginBottom:16 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                                <span style={{ fontSize:9, fontWeight:700, color:s.color, letterSpacing:1.5, textTransform:"uppercase" }}>{s.label}</span>
                                <span style={{ fontSize:9, color:"#444" }}>{done}/{items.length}</span>
                              </div>
                              {items.map((item,idx)=>{
                                const checked = checks[idx]||false;
                                return (
                                  <div key={idx} onClick={()=>toggleCheckItem(l.id,s.id,idx)} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                                    <div style={{ width:16, height:16, borderRadius:4, border:`2px solid ${checked?s.color:"rgba(255,255,255,0.15)"}`, background:checked?s.color:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#000", fontWeight:700 }}>{checked?"✓":""}</div>
                                    <span style={{ fontSize:11, color:checked?"#555":"#888", textDecoration:checked?"line-through":"none" }}>{item}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>

                      {/* Creator seeding tracker */}
                      <div style={S.card}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                          <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#ff6b35", fontWeight:700 }}>Creator Seeding</div>
                          <button onClick={()=>setAddingCreator(l.id)} style={{ fontSize:10, padding:"3px 10px", borderRadius:6, background:"rgba(255,107,53,0.08)", color:"#ff6b35", border:"1px solid rgba(255,107,53,0.2)", cursor:"pointer" }}>+ Add</button>
                        </div>
                        {l.creators.length===0&&<div style={{ fontSize:11, color:"#444", textAlign:"center", padding:"16px 0" }}>No creators added yet</div>}
                        {l.creators.map((c,ci)=>{
                          const statusColor = c.status==="posted"?"#00e5a0":c.status==="seeding"?"#f5c518":"#555";
                          return (
                            <div key={ci} style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto auto", gap:8, alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:11 }}>
                              <span style={{ fontWeight:700, color:"#e8e8f0" }}>{c.name}</span>
                              <span style={{ fontSize:9, fontWeight:700, color:"#c77dff", background:"rgba(199,125,255,0.1)", padding:"2px 7px", borderRadius:20, textTransform:"capitalize" }}>{c.tier}</span>
                              <select value={c.status} onChange={e=>updateCreator(l.id,ci,"status",e.target.value)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"2px 6px", color:statusColor, fontFamily:"inherit", fontSize:10, outline:"none" }}>
                                {["seeding","pending","posted","declined"].map(s=><option key={s} value={s}>{s}</option>)}
                              </select>
                              <span style={{ color:c.views>0?"#aaa":"#444", fontSize:10 }}>{c.views>0?(c.views/1000).toFixed(0)+"K views":"—"}</span>
                              <span style={{ color:"#c77dff", fontSize:10 }}>{c.commission}%</span>
                            </div>
                          );
                        })}
                        {addingCreator===l.id&&(
                          <div style={{ marginTop:12, padding:"12px", background:"rgba(255,255,255,0.03)", borderRadius:8, border:"1px solid rgba(255,255,255,0.07)" }}>
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:8 }}>
                              {[["Handle","name","text"],["Commission %","commission","number"],["Views","views","number"]].map(([label,field,type])=>(
                                <div key={field}>
                                  <div style={{ fontSize:8, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>{label}</div>
                                  <input type={type} value={newCreator[field]} onChange={e=>setNewCreator(p=>({...p,[field]:type==="number"?parseFloat(e.target.value)||0:e.target.value}))} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"4px 7px", color:"#e8e8f0", fontFamily:"inherit", fontSize:11, outline:"none" }}/>
                                </div>
                              ))}
                              <div>
                                <div style={{ fontSize:8, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>Tier</div>
                                <select value={newCreator.tier} onChange={e=>setNewCreator(p=>({...p,tier:e.target.value}))} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"4px 7px", color:"#e8e8f0", fontFamily:"inherit", fontSize:11, outline:"none" }}>
                                  {["nano","micro","mid","macro"].map(t=><option key={t} value={t}>{t}</option>)}
                                </select>
                              </div>
                            </div>
                            <div style={{ display:"flex", gap:6 }}>
                              <button onClick={()=>addCreatorToLaunch(l.id)} style={{ fontSize:10, fontWeight:700, padding:"4px 12px", borderRadius:5, background:"rgba(255,107,53,0.1)", color:"#ff6b35", border:"1px solid rgba(255,107,53,0.25)", cursor:"pointer" }}>+ Add</button>
                              <button onClick={()=>setAddingCreator(null)} style={{ fontSize:10, padding:"4px 10px", borderRadius:5, background:"transparent", color:"#555", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>Cancel</button>
                            </div>
                          </div>
                        )}
                        {l.creators.filter(c=>c.status==="posted").length>0&&(
                          <div style={{ marginTop:10, padding:"8px 10px", background:"rgba(0,229,160,0.05)", borderRadius:6, fontSize:10, color:"#00e5a0" }}>
                            Total views from posted content: {(l.creators.filter(c=>c.status==="posted").reduce((s,c)=>s+c.views,0)/1000).toFixed(0)}K
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── PROJECTIONS VIEW ── */}
            {launchView==="projections" && (
              <div>
                <div style={{ ...S.card, marginBottom:16 }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Launch Revenue Projections vs Actuals</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead>
                      <tr>{["Product","Stage","Launch Date","Comparable SKU","Proj. Revenue","Actual Revenue","vs Projection","Proj. Units","Actual Units","Checklist","Creators"].map(h=>(
                        <th key={h} style={{ ...S.th, fontSize:8, whiteSpace:"nowrap" }}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {launches.map(l=>{
                        const stage = LAUNCH_STAGES.find(s=>s.id===l.stage);
                        const comp  = catalog.find(p=>p.id===l.comparableSKU);
                        const {pct,revPct} = launchProgress(l);
                        const isLive = l.stage==="full"||l.stage==="review";
                        return (
                          <tr key={l.id} style={{ cursor:"pointer" }} onClick={()=>{ setActiveLaunch(l.id); setLaunchView("brief"); }}
                            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <td style={S.td}><span style={{ fontWeight:700 }}>{l.name}</span></td>
                            <td style={S.td}><span style={{ fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20, background:stage.bg, color:stage.color }}>{stage.label}</span></td>
                            <td style={S.td}><span style={{ color:"#555" }}>{l.launchDate?new Date(l.launchDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"2-digit"}):"—"}</span></td>
                            <td style={S.td}><span style={{ color:"#c77dff" }}>{comp?.name||"—"}</span></td>
                            <td style={S.td}><span style={{ fontWeight:700 }}>{l.projectedRevenue>0?"$"+(l.projectedRevenue/1000).toFixed(1)+"k":"—"}</span></td>
                            <td style={S.td}><span style={{ fontWeight:700, color:isLive?l.actualRevenue>=l.projectedRevenue?"#00e5a0":"#f5c518":"#444" }}>{isLive&&l.actualRevenue>0?"$"+(l.actualRevenue/1000).toFixed(1)+"k":"—"}</span></td>
                            <td style={S.td}>{isLive&&l.projectedRevenue>0?<span style={{ fontWeight:700, color:revPct>=100?"#00e5a0":revPct>=70?"#f5c518":"#ff4d6d" }}>{revPct}%</span>:<span style={{ color:"#444" }}>—</span>}</td>
                            <td style={S.td}>{l.projectedUnits||"—"}</td>
                            <td style={S.td}><span style={{ color:isLive?l.actualUnits>=l.projectedUnits?"#00e5a0":"#f5c518":"#444" }}>{isLive&&l.actualUnits>0?l.actualUnits:"—"}</span></td>
                            <td style={S.td}><span style={{ color:pct===100?"#00e5a0":pct>=50?"#f5c518":"#aaa" }}>{pct}%</span></td>
                            <td style={S.td}><span style={{ color:"#ff6b35" }}>{l.creators.length} · {l.creators.filter(c=>c.status==="posted").length} posted</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {launches.length===0&&<div style={{ padding:"30px 0", textAlign:"center", color:"#555", fontSize:12 }}>No launches yet — click + New Launch to get started.</div>}
                </div>

                {/* Comparable SKU benchmarks */}
                {launches.filter(l=>l.comparableSKU).length>0&&(
                  <div style={S.card}>
                    <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Comparable SKU Benchmarks</div>
                    {launches.filter(l=>l.comparableSKU).map(l=>{
                      const comp = catalog.find(p=>p.id===l.comparableSKU);
                      if (!comp) return null;
                      const priceDiff = comp.discountedPrice>0 ? r2(((l.targetPrice-comp.discountedPrice)/comp.discountedPrice)*100) : 0;
                      return (
                        <div key={l.id} style={{ padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                            <span style={{ fontSize:12, fontWeight:700 }}>{l.name}</span>
                            <span style={{ fontSize:11, color:"#c77dff" }}>vs {comp.name}</span>
                          </div>
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, fontSize:11 }}>
                            {[
                              ["Price",`$${l.targetPrice} vs $${comp.discountedPrice||comp.retailPrice}`,priceDiff>15?"#ff4d6d":priceDiff>0?"#f5c518":"#00e5a0"],
                              ["Proj. Units",`${l.projectedUnits||"?"} vs ${comp.units||"—"}`,l.projectedUnits>=comp.units?"#00e5a0":"#f5c518"],
                              ["Commission",`${l.commissionRate}% vs —`,"#c77dff"],
                              ["Comp ROAS",comp.roas>0?comp.roas+"x":"—",comp.roas>=2.5?"#00e5a0":"#f5c518"],
                              ["Comp Margin",comp.margin>0?comp.margin+"%":"—",comp.margin>=25?"#00e5a0":"#f5c518"],
                            ].map(([k,v,c])=>(
                              <div key={k} style={{ background:"rgba(255,255,255,0.03)", borderRadius:6, padding:"7px 10px" }}>
                                <div style={{ fontSize:8, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>{k}</div>
                                <div style={{ fontSize:11, fontWeight:700, color:c }}>{v}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── CATALOG ── */}
        {tab==="catalog" && (
          <div>

            {/* Top bar */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, gap:12, flexWrap:"wrap" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", flex:1 }}>
                <input value={catSearch} onChange={e=>setCatSearch(e.target.value)} placeholder="Search products or SKUs…"
                  style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 14px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, outline:"none", width:240 }}/>
                {Object.values(catFilters).some(v=>v.length>0) &&
                  <button onClick={()=>setCatFilters({campaign:[],category:[],internal:[],status:[]})} style={{ fontSize:11, color:"#ff4d6d", background:"rgba(255,77,109,0.08)", border:"1px solid rgba(255,77,109,0.2)", borderRadius:6, padding:"6px 12px", cursor:"pointer" }}>✕ Clear filters</button>}
                <span style={{ fontSize:11, color:"#555" }}>{filteredCatalog.length} of {catalog.length} products</span>
              </div>
              {/* View toggle — Catalog / Tag Report / Tag Manager */}
              <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:4, border:"1px solid rgba(255,255,255,0.07)" }}>
                {[{id:"catalog",label:"Catalog"},{id:"report",label:"Tag Report"},{id:"tags",label:"⚙ Tag Manager"}].map(m=>(
                  <button key={m.id} onClick={()=>{ setCatView(m.id); setBulkMode(false); clearSelection(); }} style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", padding:"8px 16px", cursor:"pointer", borderRadius:6, background:catView===m.id?"rgba(0,229,160,0.12)":"none", color:catView===m.id?"#00e5a0":"#555", border:catView===m.id?"1px solid rgba(0,229,160,0.3)":"1px solid transparent", whiteSpace:"nowrap" }}>{m.label}</button>
                ))}
              </div>
            </div>

            {/* Filter bar with tag counts */}
            {catView!=="tags" && (
              <div style={{ ...S.card, marginBottom:16, padding:"14px 18px" }}>
                <div style={{ display:"flex", gap:24, flexWrap:"wrap", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:8 }}>Status</div>
                    <div style={{ display:"flex", gap:6 }}>
                      {["active","testing","paused"].map(s=>{ const active=catFilters.status.includes(s); const sc=s==="active"?"#00e5a0":s==="testing"?"#f5c518":"#ff4d6d"; const cnt=catalog.filter(p=>p.status===s).length; return (
                        <button key={s} onClick={()=>toggleFilter("status",s)} style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20, cursor:"pointer", background:active?sc+"22":"transparent", color:active?sc:"#555", border:`1px solid ${active?sc+"66":"rgba(255,255,255,0.08)"}`, textTransform:"capitalize", display:"flex", alignItems:"center", gap:5 }}>
                          {s}<span style={{ fontSize:9, opacity:0.6 }}>{cnt}</span>
                        </button>
                      ); })}
                    </div>
                  </div>
                  {Object.entries(TAG_TYPES).map(([type,meta])=>(
                    <div key={type}>
                      <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:meta.color, fontWeight:700, marginBottom:8 }}>{meta.label}</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {allTags[type].map(tag=>{ const active=catFilters[type].includes(tag); const cnt=tagCounts[type][tag]||0; return (
                          <button key={tag} onClick={()=>toggleFilter(type,tag)} style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20, cursor:"pointer", background:active?meta.bg:"transparent", color:active?meta.color:"#555", border:`1px solid ${active?meta.color+"44":"rgba(255,255,255,0.08)"}`, display:"flex", alignItems:"center", gap:5 }}>
                            {tag}<span style={{ fontSize:9, opacity:0.55, fontWeight:400 }}>{cnt}</span>
                          </button>
                        ); })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bulk toolbar — shown when bulkMode is on */}
            {catView==="catalog" && (
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <button onClick={()=>{ setBulkMode(!bulkMode); clearSelection(); }} style={{ fontSize:11, fontWeight:700, padding:"6px 14px", borderRadius:6, cursor:"pointer", background:bulkMode?"rgba(199,125,255,0.12)":"rgba(255,255,255,0.04)", color:bulkMode?"#c77dff":"#555", border:bulkMode?"1px solid rgba(199,125,255,0.3)":"1px solid rgba(255,255,255,0.08)" }}>
                  {bulkMode?"✕ Exit Bulk Mode":"⬜ Bulk Select"}
                </button>
                {bulkMode && <>
                  <button onClick={selectAll} style={{ fontSize:11, padding:"6px 12px", borderRadius:6, cursor:"pointer", background:"rgba(255,255,255,0.04)", color:"#888", border:"1px solid rgba(255,255,255,0.08)" }}>Select all ({filteredCatalog.length})</button>
                  {selectedProds.length>0 && <>
                    <span style={{ fontSize:11, color:"#c77dff", fontWeight:700 }}>{selectedProds.length} selected</span>
                    <button onClick={()=>setBulkPanel(!bulkPanel)} style={{ fontSize:11, fontWeight:700, padding:"6px 14px", borderRadius:6, cursor:"pointer", background:"rgba(199,125,255,0.12)", color:"#c77dff", border:"1px solid rgba(199,125,255,0.3)" }}>
                      {bulkPanel?"▲ Hide Tag Panel":"▼ Apply Tags"}
                    </button>
                    <button onClick={clearSelection} style={{ fontSize:11, padding:"6px 10px", borderRadius:6, cursor:"pointer", background:"transparent", color:"#555", border:"1px solid rgba(255,255,255,0.07)" }}>Clear</button>
                  </>}
                </>}
              </div>
            )}

            {/* Bulk tag panel */}
            {bulkMode && bulkPanel && selectedProds.length>0 && (
              <div style={{ ...S.card, marginBottom:16, background:"rgba(199,125,255,0.04)", border:"1px solid rgba(199,125,255,0.2)" }}>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#c77dff", fontWeight:700, marginBottom:4 }}>Bulk Tag — {selectedProds.length} products selected</div>
                <div style={{ fontSize:11, color:"#555", marginBottom:14 }}>Click a tag to apply to all selected. If all selected already have it, click to remove it.</div>
                {Object.entries(TAG_TYPES).map(([type,meta])=>(
                  <div key={type} style={{ marginBottom:14 }}>
                    <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:meta.color, fontWeight:700, marginBottom:8 }}>{meta.label}</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {allTags[type].map(tag=>{
                        const allHave   = selectedProds.every(id=>catalog.find(p=>p.id===id)?.tags[type].includes(tag));
                        const someHave  = selectedProds.some(id=>catalog.find(p=>p.id===id)?.tags[type].includes(tag));
                        const bg        = allHave ? meta.bg : someHave ? meta.bg.replace("0.1","0.05").replace("0.12","0.04") : "transparent";
                        const border    = allHave ? meta.color+"66" : someHave ? meta.color+"33" : "rgba(255,255,255,0.08)";
                        const color     = allHave ? meta.color : someHave ? meta.color+"99" : "#555";
                        return (
                          <button key={tag} onClick={()=>bulkApplyTag(type,tag)} style={{ fontSize:10, fontWeight:700, padding:"5px 12px", borderRadius:20, cursor:"pointer", background:bg, color, border:`1px solid ${border}`, display:"flex", alignItems:"center", gap:5 }}>
                            {allHave?"✓ ":someHave?"— ":""}{tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div style={{ fontSize:10, color:"#555", marginTop:4 }}>✓ = all selected have tag · — = some have it · no mark = none have it</div>
              </div>
            )}

            {/* ─ CATALOG TABLE ─ */}
            {catView==="catalog" && (
              <div style={S.card}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr>
                      {bulkMode && <th style={{ ...S.th, fontSize:8, width:24 }}></th>}
                      {["Product / SKU","Status","Retail","Discounted","Disc %","Tags","Revenue","Units","ROAS","Margin","EMV",""].map(h=>(
                        <th key={h} style={{ ...S.th, fontSize:8, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCatalog.map((prod)=>{
                      const isEditing   = editingProd===prod.id;
                      const isSelected  = selectedProds.includes(prod.id);
                      const discPct     = prod.retailPrice>0 ? r2((prod.retailPrice-prod.discountedPrice)/prod.retailPrice*100) : 0;
                      const statusColor = prod.status==="active"?"#00e5a0":prod.status==="testing"?"#f5c518":"#ff4d6d";
                      return (
                        <tr key={prod.id} style={{ background: isSelected?"rgba(199,125,255,0.05)": isEditing?"rgba(0,229,160,0.02)":"transparent", verticalAlign:"top" }}>
                          {/* Bulk checkbox */}
                          {bulkMode && (
                            <td style={{ ...S.td, paddingRight:8, width:24 }}>
                              <div onClick={()=>toggleSelectProd(prod.id)} style={{ width:16, height:16, borderRadius:4, border:`2px solid ${isSelected?"#c77dff":"rgba(255,255,255,0.15)"}`, background:isSelected?"#c77dff":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#000", fontWeight:700 }}>{isSelected?"✓":""}</div>
                            </td>
                          )}
                          {/* Product name */}
                          <td style={{ ...S.td, minWidth:150 }}>
                            {isEditing ? <input value={prod.name} onChange={e=>updateCatalogField(prod.id,"name",e.target.value)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(0,229,160,0.3)", borderRadius:4, padding:"3px 8px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, fontWeight:700, width:"100%", outline:"none" }}/> : <span style={{ fontWeight:700 }}>{prod.name}</span>}
                            <div style={{ fontSize:10, color:"#444", marginTop:2 }}>{prod.sku}</div>
                          </td>
                          {/* Status */}
                          <td style={S.td}>
                            {isEditing
                              ? <select value={prod.status} onChange={e=>updateCatalogField(prod.id,"status",e.target.value)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"3px 6px", color:"#e8e8f0", fontFamily:"inherit", fontSize:11, outline:"none" }}>{["active","testing","paused"].map(s=><option key={s} value={s}>{s}</option>)}</select>
                              : <span style={{ fontSize:10, fontWeight:700, color:statusColor, background:statusColor+"15", borderRadius:20, padding:"2px 8px", textTransform:"capitalize" }}>{prod.status}</span>
                            }
                          </td>
                          {/* Retail */}
                          <td style={S.td}>
                            {isEditing ? <input type="number" step="0.01" value={prod.retailPrice} onChange={e=>updateCatalogField(prod.id,"retailPrice",parseFloat(e.target.value)||0)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"3px 6px", color:"#888", fontFamily:"inherit", fontSize:12, width:65, outline:"none" }}/> : <span style={{ color:"#888", textDecoration:discPct>0?"line-through":"none" }}>${prod.retailPrice.toFixed(2)}</span>}
                          </td>
                          {/* Discounted */}
                          <td style={S.td}>
                            {isEditing ? <input type="number" step="0.01" value={prod.discountedPrice} onChange={e=>updateCatalogField(prod.id,"discountedPrice",parseFloat(e.target.value)||0)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"3px 6px", color:"#00e5a0", fontFamily:"inherit", fontSize:12, fontWeight:700, width:65, outline:"none" }}/> : <span style={{ fontWeight:700, color:discPct>0?"#00e5a0":"#e8e8f0" }}>${prod.discountedPrice.toFixed(2)}</span>}
                          </td>
                          {/* Discount % */}
                          <td style={S.td}><span style={{ color:discPct>=15?"#ff6b35":discPct>0?"#f5c518":"#444", fontWeight:discPct>0?700:400 }}>{discPct>0?"-"+discPct.toFixed(0)+"%":"—"}</span></td>
                          {/* Tags cell */}
                          <td style={{ ...S.td, minWidth:200 }}>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                              {Object.entries(TAG_TYPES).map(([type,meta])=>
                                prod.tags[type].map(tag=>(
                                  <span key={type+tag} onClick={()=>isEditing&&toggleProductTag(prod.id,type,tag)}
                                    style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:20, background:meta.bg, color:meta.color, border:`1px solid ${meta.color}33`, cursor:isEditing?"pointer":"default", display:"inline-flex", alignItems:"center", gap:3 }}>
                                    {tag}{isEditing&&<span style={{ opacity:0.5, fontSize:9 }}>✕</span>}
                                  </span>
                                ))
                              )}
                            </div>
                            {/* Inline tag picker (edit mode only) */}
                            {isEditing && (
                              <div style={{ marginTop:8, background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"10px 12px" }}>
                                {Object.entries(TAG_TYPES).map(([type,meta])=>(
                                  <div key={type} style={{ marginBottom:10 }}>
                                    <div style={{ fontSize:8, letterSpacing:2, textTransform:"uppercase", color:meta.color, fontWeight:700, marginBottom:6 }}>{meta.label}</div>
                                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                                      {allTags[type].map(tag=>{ const has=prod.tags[type].includes(tag); return (
                                        <button key={tag} onClick={()=>toggleProductTag(prod.id,type,tag)} style={{ fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:20, cursor:"pointer", background:has?meta.bg:"transparent", color:has?meta.color:"#555", border:`1px solid ${has?meta.color+"44":"rgba(255,255,255,0.07)"}` }}>{has?"✓ ":""}{tag}</button>
                                      ); })}
                                      {addingTagType===type
                                        ? <span style={{ display:"inline-flex", gap:4 }}>
                                            <input autoFocus value={newTagInputs[type]} onChange={e=>setNewTagInputs(p=>({...p,[type]:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter")addNewTag(type);if(e.key==="Escape")setAddingTagType(null);}} placeholder="New tag…" style={{ fontSize:9, background:"rgba(255,255,255,0.06)", border:"1px solid "+meta.color+"66", borderRadius:4, padding:"3px 7px", color:"#e8e8f0", fontFamily:"inherit", outline:"none", width:80 }}/>
                                            <button onClick={()=>addNewTag(type)} style={{ fontSize:9, background:meta.bg, color:meta.color, border:"none", borderRadius:4, padding:"3px 7px", cursor:"pointer", fontFamily:"inherit" }}>Add</button>
                                          </span>
                                        : <button onClick={()=>setAddingTagType(type)} style={{ fontSize:9, padding:"3px 8px", borderRadius:20, background:"transparent", color:"#444", border:"1px dashed rgba(255,255,255,0.1)", cursor:"pointer" }}>+ new</button>
                                      }
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          {/* Metrics */}
                          <td style={S.td}><span style={{ fontWeight:700 }}>{prod.revenue>0?"$"+(prod.revenue/1000).toFixed(1)+"k":"—"}</span></td>
                          <td style={S.td}><span style={{ color:"#aaa" }}>{prod.units||"—"}</span></td>
                          <td style={S.td}><span style={{ color:prod.roas>=2.5?"#00e5a0":prod.roas>=1.5?"#f5c518":prod.roas>0?"#ff4d6d":"#444" }}>{prod.roas>0?prod.roas+"x":"—"}</span></td>
                          <td style={S.td}><span style={{ color:prod.margin>=25?"#00e5a0":prod.margin>=10?"#f5c518":prod.margin>0?"#ff4d6d":"#444" }}>{prod.margin>0?prod.margin+"%":"—"}</span></td>
                          <td style={S.td}><span style={{ color:"#c77dff" }}>{prod.emv>0?"$"+(prod.emv/1000).toFixed(1)+"k":"—"}</span></td>
                          {/* Edit button */}
                          <td style={S.td}>
                            {!bulkMode && <button onClick={()=>{ setEditingProd(isEditing?null:prod.id); setAddingTagType(null); }} style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:6, cursor:"pointer", background:isEditing?"rgba(0,229,160,0.12)":"rgba(255,255,255,0.04)", color:isEditing?"#00e5a0":"#555", border:isEditing?"1px solid rgba(0,229,160,0.3)":"1px solid rgba(255,255,255,0.08)" }}>{isEditing?"✓ Done":"Edit"}</button>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredCatalog.length===0 && <div style={{ padding:"40px 0", textAlign:"center", color:"#444", fontSize:12 }}>No products match the current filters.</div>}
                <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
                  <button onClick={()=>{ const nid="p"+(catalog.length+1); setCatalog(prev=>[...prev,{ id:nid, name:"New Product", sku:"SKU-"+nid.toUpperCase(), retailPrice:0, discountedPrice:0, cogs:0, status:"testing", tags:{campaign:[],category:[],internal:["New Arrival"]}, units:0, revenue:0, emv:0, roas:0, vcr:0, margin:0 }]); setEditingProd(nid); setBulkMode(false); }} style={{ fontSize:11, fontWeight:700, padding:"8px 16px", borderRadius:6, background:"rgba(0,229,160,0.08)", color:"#00e5a0", border:"1px solid rgba(0,229,160,0.25)", cursor:"pointer" }}>+ Add Product</button>
                </div>
              </div>
            )}

            {/* ─ TAG MANAGER ─ */}
            {catView==="tags" && (
              <div>
                <div style={{ fontSize:11, color:"#555", marginBottom:20 }}>Rename or delete tags globally — changes apply to all products immediately.</div>
                {Object.entries(TAG_TYPES).map(([type,meta])=>(
                  <div key={type} style={{ ...S.card, marginBottom:16, borderColor:meta.color+"22" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                      <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:meta.color, fontWeight:700 }}>{meta.label} Tags</div>
                      <div style={{ fontSize:11, color:"#555" }}>{allTags[type].length} tags · {Object.values(tagCounts[type]).reduce((s,n)=>s+n,0)} total assignments</div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:8 }}>
                      {allTags[type].map(tag=>{
                        const cnt = tagCounts[type][tag]||0;
                        const isRenaming = renamingTag?.type===type && renamingTag?.tag===tag;
                        return (
                          <div key={tag} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:"rgba(255,255,255,0.03)", borderRadius:8, border:`1px solid ${meta.color}22` }}>
                            {/* Tag pill / rename input */}
                            <div style={{ flex:1 }}>
                              {isRenaming
                                ? <input autoFocus value={renameVal} onChange={e=>setRenameVal(e.target.value)}
                                    onKeyDown={e=>{ if(e.key==="Enter")renameTag(type,tag,renameVal); if(e.key==="Escape")setRenamingTag(null); }}
                                    style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${meta.color}66`, borderRadius:4, padding:"3px 8px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, fontWeight:700, width:"100%", outline:"none" }}/>
                                : <span style={{ fontSize:12, fontWeight:700, color:meta.color }}>{tag}</span>
                              }
                            </div>
                            {/* Product count */}
                            <span style={{ fontSize:11, color:"#555", flexShrink:0 }}>{cnt} product{cnt!==1?"s":""}</span>
                            {/* Actions */}
                            {isRenaming
                              ? <div style={{ display:"flex", gap:4 }}>
                                  <button onClick={()=>renameTag(type,tag,renameVal)} style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:4, cursor:"pointer", background:meta.bg, color:meta.color, border:"none" }}>Save</button>
                                  <button onClick={()=>setRenamingTag(null)} style={{ fontSize:10, padding:"3px 8px", borderRadius:4, cursor:"pointer", background:"transparent", color:"#555", border:"1px solid rgba(255,255,255,0.08)" }}>Cancel</button>
                                </div>
                              : <div style={{ display:"flex", gap:4 }}>
                                  <button onClick={()=>{ setRenamingTag({type,tag}); setRenameVal(tag); }} style={{ fontSize:10, padding:"3px 8px", borderRadius:4, cursor:"pointer", background:"rgba(255,255,255,0.04)", color:"#888", border:"1px solid rgba(255,255,255,0.08)" }}>Rename</button>
                                  <button onClick={()=>{ if(window.confirm(`Delete tag "${tag}"? It will be removed from all ${cnt} product${cnt!==1?"s":""}.`)) deleteTag(type,tag); }} style={{ fontSize:10, padding:"3px 8px", borderRadius:4, cursor:"pointer", background:"rgba(255,77,109,0.06)", color:"#ff4d6d", border:"1px solid rgba(255,77,109,0.15)" }}>Delete</button>
                                </div>
                            }
                          </div>
                        );
                      })}
                      {/* Add new tag */}
                      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", background:"rgba(255,255,255,0.02)", borderRadius:8, border:`1px dashed rgba(255,255,255,0.08)` }}>
                        {addingTagType===type
                          ? <>
                              <input autoFocus value={newTagInputs[type]} onChange={e=>setNewTagInputs(p=>({...p,[type]:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter")addNewTag(type);if(e.key==="Escape")setAddingTagType(null);}} placeholder={`New ${meta.label.toLowerCase()} tag…`} style={{ flex:1, background:"rgba(255,255,255,0.06)", border:`1px solid ${meta.color}66`, borderRadius:4, padding:"3px 8px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, outline:"none" }}/>
                              <button onClick={()=>addNewTag(type)} style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:4, cursor:"pointer", background:meta.bg, color:meta.color, border:"none" }}>Add</button>
                            </>
                          : <button onClick={()=>setAddingTagType(type)} style={{ fontSize:11, color:"#555", background:"transparent", border:"none", cursor:"pointer", width:"100%", textAlign:"left" }}>+ New {meta.label} tag</button>
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─ TAG REPORT ─ */}
            {catView==="report" && (
              <div>
                {/* Group-by toggles + back breadcrumb */}
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:20, flexWrap:"wrap" }}>
                  {reportDrillTag
                    ? <button onClick={()=>setReportDrillTag(null)} style={{ fontSize:11, fontWeight:700, padding:"7px 14px", borderRadius:6, cursor:"pointer", background:"rgba(255,255,255,0.05)", color:"#888", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", gap:6 }}>← All {TAG_TYPES[reportGroup].label}s</button>
                    : <div style={{ fontSize:11, color:"#555" }}>Group by:</div>
                  }
                  {!reportDrillTag && Object.entries(TAG_TYPES).map(([type,meta])=>(
                    <button key={type} onClick={()=>{ setReportGroup(type); setReportDrillTag(null); }} style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", padding:"7px 16px", borderRadius:6, cursor:"pointer", background:reportGroup===type?meta.bg:"rgba(255,255,255,0.03)", color:reportGroup===type?meta.color:"#555", border:reportGroup===type?`1px solid ${meta.color}44`:"1px solid rgba(255,255,255,0.07)" }}>{meta.label}</button>
                  ))}
                  {reportDrillTag && (
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:11, color:"#555" }}>Viewing:</span>
                      <span style={{ fontSize:12, fontWeight:700, color:TAG_TYPES[reportGroup].color, background:TAG_TYPES[reportGroup].bg, border:`1px solid ${TAG_TYPES[reportGroup].color}44`, borderRadius:20, padding:"3px 12px" }}>{reportDrillTag}</span>
                    </div>
                  )}
                </div>

                {(()=>{
                  const rows = buildReport(reportGroup);
                  const meta = TAG_TYPES[reportGroup];

                  if (!rows.length) return (
                    <div style={{ ...S.card, textAlign:"center", padding:40, color:"#444", fontSize:12 }}>
                      No products tagged with {meta.label} tags yet — add tags in the Catalog or Tag Manager view.
                    </div>
                  );

                  // ── DRILLDOWN VIEW ──
                  if (reportDrillTag) {
                    const drillRow = rows.find(r=>r.tag===reportDrillTag);
                    if (!drillRow) return null;
                    return (
                      <div>
                        {/* Drilldown summary strip */}
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
                          {[
                            { lbl:"Revenue",      val:"$"+(drillRow.totRev/1000).toFixed(1)+"k", c:"#fff"    },
                            { lbl:"Units",         val:drillRow.totUnits,                          c:"#aaa"    },
                            { lbl:"Avg ROAS",      val:drillRow.avgROAS+"x",                       c:drillRow.avgROAS>=2.5?"#00e5a0":drillRow.avgROAS>=1.5?"#f5c518":"#ff4d6d" },
                            { lbl:"Avg Margin",    val:drillRow.avgMargin+"%",                     c:drillRow.avgMargin>=25?"#00e5a0":drillRow.avgMargin>=10?"#f5c518":"#ff4d6d" },
                            { lbl:"Total EMV",     val:"$"+(drillRow.totEMV/1000).toFixed(1)+"k", c:"#c77dff" },
                          ].map((m,i)=>(
                            <div key={i} style={{ ...S.card, textAlign:"center" }}>
                              <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:"#444", marginBottom:8, fontWeight:700 }}>{m.lbl}</div>
                              <div style={{ fontSize:20, fontWeight:700, color:m.c }}>{m.val}</div>
                            </div>
                          ))}
                        </div>

                        {/* Drilldown product table */}
                        <div style={S.card}>
                          <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:meta.color, fontWeight:700, marginBottom:16 }}>
                            {drillRow.prods.length} product{drillRow.prods.length!==1?"s":""} tagged — {reportDrillTag}
                          </div>
                          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                            <thead>
                              <tr>{["Product","SKU","Status","Retail","Sale Price","Disc %","Revenue","Units","ROAS","Margin %","EMV","VCR %","All Tags"].map(h=>(
                                <th key={h} style={{ ...S.th, fontSize:8, whiteSpace:"nowrap" }}>{h}</th>
                              ))}</tr>
                            </thead>
                            <tbody>
                              {drillRow.prods.sort((a,b)=>b.revenue-a.revenue).map((p,i)=>{
                                const discPct = p.retailPrice>0 ? r2((p.retailPrice-p.discountedPrice)/p.retailPrice*100) : 0;
                                const statusColor = p.status==="active"?"#00e5a0":p.status==="testing"?"#f5c518":"#ff4d6d";
                                const allTagsFlat = [...p.tags.campaign,...p.tags.category,...p.tags.internal];
                                return (
                                  <tr key={i}>
                                    <td style={S.td}><span style={{ fontWeight:700 }}>{p.name}</span></td>
                                    <td style={S.td}><span style={{ fontSize:10, color:"#555" }}>{p.sku}</span></td>
                                    <td style={S.td}><span style={{ fontSize:10, fontWeight:700, color:statusColor, background:statusColor+"15", borderRadius:20, padding:"2px 7px", textTransform:"capitalize" }}>{p.status}</span></td>
                                    <td style={S.td}><span style={{ color:"#888", textDecoration:discPct>0?"line-through":"none" }}>${p.retailPrice.toFixed(2)}</span></td>
                                    <td style={S.td}><span style={{ fontWeight:700, color:discPct>0?"#00e5a0":"#e8e8f0" }}>${p.discountedPrice.toFixed(2)}</span></td>
                                    <td style={S.td}><span style={{ color:discPct>=15?"#ff6b35":discPct>0?"#f5c518":"#444", fontWeight:discPct>0?700:400 }}>{discPct>0?"-"+discPct.toFixed(0)+"%":"—"}</span></td>
                                    <td style={S.td}><span style={{ fontWeight:700 }}>{p.revenue>0?"$"+(p.revenue/1000).toFixed(1)+"k":"—"}</span></td>
                                    <td style={S.td}><span style={{ color:"#aaa" }}>{p.units||"—"}</span></td>
                                    <td style={S.td}><span style={{ color:p.roas>=2.5?"#00e5a0":p.roas>=1.5?"#f5c518":p.roas>0?"#ff4d6d":"#444" }}>{p.roas>0?p.roas+"x":"—"}</span></td>
                                    <td style={S.td}><span style={{ color:p.margin>=25?"#00e5a0":p.margin>=10?"#f5c518":p.margin>0?"#ff4d6d":"#444" }}>{p.margin>0?p.margin+"%":"—"}</span></td>
                                    <td style={S.td}><span style={{ color:"#c77dff" }}>{p.emv>0?"$"+(p.emv/1000).toFixed(1)+"k":"—"}</span></td>
                                    <td style={S.td}><span style={{ color:p.vcr>=3?"#00e5a0":p.vcr>=1.5?"#f5c518":p.vcr>0?"#ff4d6d":"#444" }}>{p.vcr>0?p.vcr+"%":"—"}</span></td>
                                    <td style={{ ...S.td, maxWidth:180 }}>
                                      <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                                        {allTagsFlat.filter(t=>t!==reportDrillTag).map(t=>{
                                          const ttype = p.tags.campaign.includes(t)?"campaign":p.tags.category.includes(t)?"category":"internal";
                                          return <span key={t} style={{ fontSize:8, padding:"1px 6px", borderRadius:20, background:TAG_TYPES[ttype].bg, color:TAG_TYPES[ttype].color, border:`1px solid ${TAG_TYPES[ttype].color}22` }}>{t}</span>;
                                        })}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }

                  // ── OVERVIEW CARDS ──
                  const maxRev = Math.max(...rows.map(r=>r.totRev),1);
                  const sorted = [...rows].sort((a,b)=>b.totRev-a.totRev);
                  return (
                    <div>
                      <div style={{ fontSize:11, color:"#555", marginBottom:16 }}>Click any card or row to drill into that {meta.label.toLowerCase()}'s products.</div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16, marginBottom:24 }}>
                        {sorted.map((row)=>{
                          const tag = row.tag;
                          return (
                          <div key={tag}
                            style={{ ...S.card, borderColor:meta.color+"55", cursor:"pointer", userSelect:"none" }}
                            onClick={()=>{ setReportDrillTag(tag); }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:meta.color, fontWeight:700 }}>{tag}</div>
                              <span style={{ fontSize:10, color:meta.color, opacity:0.7 }}>view →</span>
                            </div>
                            <div style={{ fontSize:22, fontWeight:700, color:"#fff", marginBottom:4 }}>${(row.totRev/1000).toFixed(1)}k</div>
                            <div style={{ fontSize:11, color:"#555", marginBottom:12 }}>{row.totUnits} units · {row.prods.length} product{row.prods.length!==1?"s":""}</div>
                            <MiniBar value={row.totRev} max={maxRev} color={meta.color}/>
                            <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                              {[
                                ["Avg ROAS",   row.avgROAS+"x",   row.avgROAS>=2.5?"#00e5a0":row.avgROAS>=1.5?"#f5c518":"#ff4d6d"],
                                ["Avg Margin", row.avgMargin+"%", row.avgMargin>=25?"#00e5a0":row.avgMargin>=10?"#f5c518":"#ff4d6d"],
                                ["Total EMV",  "$"+(row.totEMV/1000).toFixed(1)+"k", "#c77dff"],
                                ["Avg Discount",row.avgDisc>0?"-"+row.avgDisc.toFixed(0)+"%":"None", row.avgDisc>=15?"#ff6b35":row.avgDisc>0?"#f5c518":"#555"],
                              ].map(([k,v,c])=>(
                                <div key={k} style={{ background:"rgba(255,255,255,0.03)", borderRadius:6, padding:"8px 10px" }}>
                                  <div style={{ fontSize:9, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>{k}</div>
                                  <div style={{ fontSize:13, fontWeight:700, color:c }}>{v}</div>
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop:12, borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:10 }}>
                              {row.prods.slice(0,3).map(p=>(
                                <div key={p.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                                  <span style={{ fontSize:10, color:"#888", maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</span>
                                  <span style={{ fontSize:10, fontWeight:700 }}>{p.revenue>0?"$"+(p.revenue/1000).toFixed(1)+"k":"—"}</span>
                                </div>
                              ))}
                              {row.prods.length>3 && <div style={{ fontSize:10, color:"#444", marginTop:2 }}>+{row.prods.length-3} more</div>}
                            </div>
                          </div>
                        );})}
                      </div>

                      {/* Comparison table */}
                      <div style={S.card}>
                        <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Full Comparison — by {meta.label}</div>
                        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                          <thead><tr>{[meta.label,"Products","Revenue","Units","Avg ROAS","Avg Margin","Total EMV","Avg Discount"].map(h=><th key={h} style={{ ...S.th, fontSize:8 }}>{h}</th>)}</tr></thead>
                          <tbody>
                            {sorted.map((row)=>{
                              const tag = row.tag;
                              return (
                              <tr key={tag} style={{ cursor:"pointer" }}
                                onClick={()=>{ setReportDrillTag(tag); }}>
                                <td style={S.td}><span style={{ fontWeight:700, color:meta.color }}>{tag}</span><span style={{ fontSize:9, color:meta.color, opacity:0.5, marginLeft:8 }}>→</span></td>
                                <td style={S.td}><span style={{ color:"#aaa" }}>{row.prods.length}</span></td>
                                <td style={S.td}><span style={{ fontWeight:700 }}>${(row.totRev/1000).toFixed(1)}k</span></td>
                                <td style={S.td}>{row.totUnits}</td>
                                <td style={S.td}><span style={{ color:row.avgROAS>=2.5?"#00e5a0":row.avgROAS>=1.5?"#f5c518":"#ff4d6d" }}>{row.avgROAS}x</span></td>
                                <td style={S.td}><span style={{ color:row.avgMargin>=25?"#00e5a0":row.avgMargin>=10?"#f5c518":"#ff4d6d" }}>{row.avgMargin}%</span></td>
                                <td style={S.td}><span style={{ color:"#c77dff" }}>${(row.totEMV/1000).toFixed(1)}k</span></td>
                                <td style={S.td}><span style={{ color:row.avgDisc>=15?"#ff6b35":row.avgDisc>0?"#f5c518":"#444" }}>{row.avgDisc>0?"-"+row.avgDisc.toFixed(0)+"%":"—"}</span></td>
                              </tr>
                            );})}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── PORTFOLIO WRAPPER (default export) ───────────────────────────────────────
const BRAND_COLORS = ["linear-gradient(135deg,#ff0050,#00e5a0)","linear-gradient(135deg,#c77dff,#ff6b35)","linear-gradient(135deg,#00e5a0,#0077ff)","linear-gradient(135deg,#f5c518,#ff4d6d)","linear-gradient(135deg,#ff6b35,#c77dff)","linear-gradient(135deg,#0077ff,#f5c518)"];
const BRAND_ACCENT = ["#00e5a0","#c77dff","#0077ff","#f5c518","#ff6b35","#ff4d6d"];

const MOCK_BRANDS = [
  { id:"b1", name:"Glow Lab Beauty", niche:"Skincare / Serums",  revenue:187400, roas:3.2, adSpend:8200, margin:34, stockAlerts:1, commRate:18, followers:284000 },
  { id:"b2", name:"PureGlow Co",     niche:"Clean Beauty / SPF", revenue:94200,  roas:2.8, adSpend:5100, margin:28, stockAlerts:0, commRate:15, followers:142000 },
  { id:"b3", name:"DermLux",         niche:"Clinical Skincare",  revenue:52000,  roas:2.1, adSpend:3200, margin:22, stockAlerts:2, commRate:10, followers:67000  },
];

export default function Portfolio() {
  const [activeBrand,   setActiveBrand]   = useState(null);
  const [portfolioView, setPortfolioView] = useState("home");
  const [brands,        setBrands]        = useState(MOCK_BRANDS);
  const [addingBrand,   setAddingBrand]   = useState(false);
  const [newBrand,      setNewBrand]      = useState({ name:"", niche:"", revenue:0, roas:0, adSpend:0, margin:0, stockAlerts:0, commRate:18, followers:0 });

  const saveBrand = () => {
    if (!newBrand.name.trim()) return;
    setBrands(prev=>[...prev, { ...newBrand, id:"b_"+Date.now() }]);
    setNewBrand({ name:"", niche:"", revenue:0, roas:0, adSpend:0, margin:0, stockAlerts:0, commRate:18, followers:0 });
    setAddingBrand(false);
  };

  const totalRev    = brands.reduce((s,b)=>s+b.revenue,0);
  const totalSpend  = brands.reduce((s,b)=>s+b.adSpend,0);
  const blendedROAS = totalSpend>0 ? r2(totalRev/totalSpend) : 0;
  const avgMargin   = brands.length ? r2(brands.reduce((s,b)=>s+b.margin,0)/brands.length) : 0;
  const totalAlerts = brands.reduce((s,b)=>s+b.stockAlerts,0);
  const maxRev      = Math.max(...brands.map(b=>b.revenue),1);

  if (activeBrand) {
    const b = brands.find(b=>b.id===activeBrand);
    const idx = brands.indexOf(b);
    return <BrandDashboard brandId={activeBrand} brandName={b?.name} brandColor={BRAND_COLORS[idx%BRAND_COLORS.length]} onBack={()=>setActiveBrand(null)}/>;
  }

  return (
    <div style={{ fontFamily:"'DM Mono','Courier New',monospace", background:"#0a0a0f", minHeight:"100vh", color:"#e8e8f0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box}`}</style>

      {/* Header */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"18px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,0.02)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, background:"linear-gradient(135deg,#ff0050,#00e5a0)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚡</div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#fff" }}>Shop Pulse</div>
            <div style={{ fontSize:10, color:"#444" }}>Portfolio · {brands.length} brand{brands.length!==1?"s":""}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.03)", borderRadius:7, padding:3, border:"1px solid rgba(255,255,255,0.07)" }}>
            {[{id:"home",label:"Overview"},{id:"compare",label:"Compare"}].map(v=>(
              <button key={v.id} onClick={()=>setPortfolioView(v.id)} style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", padding:"6px 14px", cursor:"pointer", borderRadius:5, background:portfolioView===v.id?"rgba(0,229,160,0.12)":"none", color:portfolioView===v.id?"#00e5a0":"#555", border:portfolioView===v.id?"1px solid rgba(0,229,160,0.3)":"1px solid transparent" }}>{v.label}</button>
            ))}
          </div>
          <button onClick={()=>setAddingBrand(true)} style={{ fontSize:11, fontWeight:700, padding:"7px 14px", borderRadius:7, background:"rgba(0,229,160,0.08)", color:"#00e5a0", border:"1px solid rgba(0,229,160,0.2)", cursor:"pointer" }}>+ Add Brand</button>
        </div>
      </div>

      <div style={{ padding:"24px 28px", maxWidth:1140 }}>

        {/* KPI strip */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:28 }}>
          {[
            { lbl:"Portfolio GMV",  val:"$"+(totalRev/1000).toFixed(0)+"k",   sub:brands.length+" brands",      c:"#fff"    },
            { lbl:"Total Ad Spend", val:"$"+(totalSpend/1000).toFixed(1)+"k", sub:"Across all brands",          c:"#ff6b35" },
            { lbl:"Blended ROAS",   val:blendedROAS>0?blendedROAS+"x":"—",    sub:"Portfolio average",          c:blendedROAS>=2.5?"#00e5a0":blendedROAS>=1.5?"#f5c518":"#ff4d6d" },
            { lbl:"Avg Margin",     val:avgMargin>0?avgMargin+"%":"—",         sub:"Across all brands",          c:avgMargin>=25?"#00e5a0":avgMargin>=15?"#f5c518":"#ff4d6d" },
            { lbl:"Stock Alerts",   val:totalAlerts>0?totalAlerts+" alerts":"All OK", sub:totalAlerts>0?"Needs attention":"No urgent issues", c:totalAlerts>0?"#ff4d6d":"#00e5a0" },
          ].map((m,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"16px 18px" }}>
              <div style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:8 }}>{m.lbl}</div>
              <div style={{ fontSize:22, fontWeight:700, color:m.c, marginBottom:4 }}>{m.val}</div>
              <div style={{ fontSize:10, color:"#555" }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Add brand form */}
        {addingBrand && (
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:12, padding:"18px 20px", marginBottom:20 }}>
            <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#00e5a0", fontWeight:700, marginBottom:14 }}>New Brand</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:12 }}>
              {[["Brand Name","name","text"],["Niche","niche","text"],["Monthly GMV ($)","revenue","number"],["Affiliate Commission %","commRate","number"]].map(([label,field,type])=>(
                <div key={field}>
                  <div style={{ fontSize:9, color:"#555", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>{label}</div>
                  <input type={type} value={newBrand[field]} onChange={e=>setNewBrand(p=>({...p,[field]:type==="number"?parseFloat(e.target.value)||0:e.target.value}))}
                    style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:6, padding:"6px 10px", color:"#e8e8f0", fontFamily:"inherit", fontSize:12, outline:"none" }}/>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={saveBrand} style={{ fontSize:12, fontWeight:700, padding:"7px 18px", borderRadius:6, background:"rgba(0,229,160,0.1)", color:"#00e5a0", border:"1px solid rgba(0,229,160,0.3)", cursor:"pointer" }}>✓ Add Brand</button>
              <button onClick={()=>setAddingBrand(false)} style={{ fontSize:11, padding:"7px 14px", borderRadius:6, background:"transparent", color:"#555", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {portfolioView==="home" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
            {brands.map((brand,idx)=>{
              const accent   = BRAND_ACCENT[idx%BRAND_ACCENT.length];
              const gradient = BRAND_COLORS[idx%BRAND_COLORS.length];
              const revShare = r2(brand.revenue/totalRev*100);
              const flags    = [];
              if (brand.stockAlerts>0) flags.push({ color:"#ff4d6d", text:brand.stockAlerts+" stock alert"+(brand.stockAlerts!==1?"s":"") });
              if (brand.roas<2)        flags.push({ color:"#ff4d6d", text:`ROAS ${brand.roas}x — below threshold` });
              if (brand.roas>=3.5)     flags.push({ color:"#00e5a0", text:`ROAS ${brand.roas}x — scale opportunity` });
              if (brand.margin<15)     flags.push({ color:"#f5c518", text:`Margin ${brand.margin}% — review costs` });
              return (
                <div key={brand.id} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${accent}22`, borderRadius:14, overflow:"hidden" }}>
                  <div style={{ background:gradient, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:2 }}>{brand.name}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)" }}>{brand.niche}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", marginBottom:2 }}>Followers</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{brand.followers>0?(brand.followers/1000).toFixed(0)+"K":"—"}</div>
                    </div>
                  </div>
                  <div style={{ padding:"16px 18px" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12 }}>
                      {[
                        ["GMV",      "$"+(brand.revenue/1000).toFixed(0)+"k",  "#fff"   ],
                        ["ROAS",     brand.roas+"x",   brand.roas>=2.5?"#00e5a0":brand.roas>=1.5?"#f5c518":"#ff4d6d"],
                        ["Margin",   brand.margin+"%", brand.margin>=25?"#00e5a0":brand.margin>=15?"#f5c518":"#ff4d6d"],
                        ["Ad Spend", "$"+(brand.adSpend/1000).toFixed(1)+"k", "#ff6b35"],
                        ["Rev Share",revShare+"%",     accent ],
                        ["Comm %",   brand.commRate+"%","#c77dff"],
                      ].map(([k,v,c])=>(
                        <div key={k} style={{ background:"rgba(255,255,255,0.04)", borderRadius:7, padding:"8px 10px" }}>
                          <div style={{ fontSize:8, color:"#444", letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>{k}</div>
                          <div style={{ fontSize:14, fontWeight:700, color:c }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom:12 }}>
                      <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:(brand.revenue/maxRev*100)+"%", background:accent, borderRadius:2 }}/>
                      </div>
                      <div style={{ fontSize:9, color:"#444", marginTop:3 }}>{revShare}% of portfolio revenue</div>
                    </div>
                    {flags.length>0 && (
                      <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:12 }}>
                        {flags.map((f,i)=>(
                          <div key={i} style={{ fontSize:10, color:f.color, display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:5, height:5, borderRadius:"50%", background:f.color, flexShrink:0 }}/>
                            {f.text}
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={()=>setActiveBrand(brand.id)} style={{ width:"100%", fontSize:12, fontWeight:700, padding:"9px 0", borderRadius:8, background:`${accent}14`, color:accent, border:`1px solid ${accent}33`, cursor:"pointer", letterSpacing:1, textTransform:"uppercase" }}>
                      Open Dashboard →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── COMPARE ── */}
        {portfolioView==="compare" && (
          <div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"18px 20px", marginBottom:16 }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Revenue Share</div>
              {brands.map((brand,idx)=>{
                const accent = BRAND_ACCENT[idx%BRAND_ACCENT.length];
                const pct = r2(brand.revenue/totalRev*100);
                return (
                  <div key={brand.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                    <div style={{ width:140, fontSize:11, fontWeight:700, color:"#e8e8f0", cursor:"pointer", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} onClick={()=>setActiveBrand(brand.id)}>{brand.name}</div>
                    <div style={{ flex:1, height:20, background:"rgba(255,255,255,0.04)", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:pct+"%", background:accent, borderRadius:4, display:"flex", alignItems:"center", paddingLeft:8 }}>
                        {pct>8&&<span style={{ fontSize:9, color:"#000", fontWeight:700 }}>${(brand.revenue/1000).toFixed(0)}k</span>}
                      </div>
                    </div>
                    <div style={{ fontSize:11, fontWeight:700, width:40, textAlign:"right", color:accent }}>{pct}%</div>
                  </div>
                );
              })}
            </div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"18px 20px" }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:"#444", fontWeight:700, marginBottom:16 }}>Full Brand Comparison</div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr>{["Brand","Niche","GMV","Ad Spend","ROAS","Margin","Comm %","Followers","Alerts",""].map(h=>(
                    <th key={h} style={{ fontSize:8, letterSpacing:1.5, textTransform:"uppercase", color:"#444", fontWeight:700, padding:"0 10px 10px 0", textAlign:"left", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {[...brands].sort((a,b)=>b.revenue-a.revenue).map((brand,i)=>{
                    const accent = BRAND_ACCENT[brands.indexOf(brand)%BRAND_ACCENT.length];
                    return (
                      <tr key={brand.id}>
                        <td style={{ padding:"10px 10px 10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontWeight:700, color:accent, cursor:"pointer" }} onClick={()=>setActiveBrand(brand.id)}>{brand.name}</td>
                        <td style={{ padding:"10px 10px 10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:10, color:"#555" }}>{brand.niche}</td>
                        <td style={{ padding:"10px 10px 10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontWeight:700 }}>${(brand.revenue/1000).toFixed(0)}k</td>
                        <td style={{ padding:"10px 10px 10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", color:"#ff6b35" }}>${(brand.adSpend/1000).toFixed(1)}k</td>
                        <td style={{ padding:"10px 10px 10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}><span style={{ color:brand.roas>=2.5?"#00e5a0":brand.roas>=1.5?"#f5c518":"#ff4d6d", fontWeight:700 }}>{brand.roas}x</span></td>
                        <td style={{ padding:"10px 10px 10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}><span style={{ color:brand.margin>=25?"#00e5a0":brand.margin>=15?"#f5c518":"#ff4d6d" }}>{brand.margin}%</span></td>
                        <td style={{ padding:"10px 10px 10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", color:"#c77dff" }}>{brand.commRate}%</td>
                        <td style={{ padding:"10px 10px 10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", color:"#aaa" }}>{brand.followers>0?(brand.followers/1000).toFixed(0)+"K":"—"}</td>
                        <td style={{ padding:"10px 10px 10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>{brand.stockAlerts>0?<span style={{ fontSize:9,fontWeight:700,color:"#ff4d6d",background:"rgba(255,77,109,0.1)",padding:"2px 7px",borderRadius:20 }}>⚠ {brand.stockAlerts}</span>:<span style={{ fontSize:9,color:"#00e5a0" }}>✓</span>}</td>
                        <td style={{ padding:"10px 10px 10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}><button onClick={()=>setActiveBrand(brand.id)} style={{ fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:5,background:`${accent}14`,color:accent,border:`1px solid ${accent}33`,cursor:"pointer" }}>Open →</button></td>
                      </tr>
                    );
                  })}
                  <tr style={{ background:"rgba(255,255,255,0.02)" }}>
                    <td style={{ padding:"10px 10px 10px 0", fontWeight:700, color:"#fff" }} colSpan={2}>Portfolio Total</td>
                    <td style={{ padding:"10px 10px 10px 0", fontWeight:700 }}>${(totalRev/1000).toFixed(0)}k</td>
                    <td style={{ padding:"10px 10px 10px 0", color:"#ff6b35", fontWeight:700 }}>${(totalSpend/1000).toFixed(1)}k</td>
                    <td style={{ padding:"10px 10px 10px 0" }}><span style={{ color:blendedROAS>=2.5?"#00e5a0":"#f5c518", fontWeight:700 }}>{blendedROAS}x</span></td>
                    <td style={{ padding:"10px 10px 10px 0" }}><span style={{ color:avgMargin>=25?"#00e5a0":"#f5c518" }}>{avgMargin}%</span></td>
                    <td colSpan={4} style={{ padding:"10px 10px 10px 0", color:"#444" }}>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
