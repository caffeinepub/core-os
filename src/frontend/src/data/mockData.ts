export interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  optimalMin: number;
  optimalMax: number;
  status: "optimal" | "suboptimal" | "alert";
  category: string;
}

export interface WearableSnapshot {
  date: string;
  hrv: number;
  bodyBattery: number;
  sleepScore: number;
  stressLevel: number;
  vo2Max: number;
  rhr: number;
  sleepDuration: number;
  deepSleepPct: number;
  remPct: number;
  lightSleepPct: number;
}

export interface AdvisorRecommendation {
  id: string;
  category: "ALERT" | "INSIGHT" | "ADVICE" | "FOCUS";
  title: string;
  detail: string;
  timestamp: string;
  actions?: string[];
}

export interface Protocol {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "active" | "paused" | "completed";
  startDate: string;
  notes?: string;
}

export interface HypnogramSegment {
  stage: "awake" | "rem" | "light" | "deep";
  startMin: number;
  endMin: number;
}

export interface SleepNight {
  date: string;
  bedtime: string;
  wakeTime: string;
  totalMinutes: number;
  sleepScore: number;
  hrv: number;
  deepPct: number;
  remPct: number;
  lightPct: number;
  awakePct: number;
  efficiency: number;
  segments: HypnogramSegment[];
}

export const biomarkers: Biomarker[] = [
  {
    id: "1",
    name: "hs-CRP",
    value: 0.8,
    unit: "mg/L",
    date: "2026-03-10",
    optimalMin: 0,
    optimalMax: 1.0,
    status: "optimal",
    category: "Inflammation",
  },
  {
    id: "2",
    name: "HbA1c",
    value: 5.1,
    unit: "%",
    date: "2026-03-10",
    optimalMin: 4.8,
    optimalMax: 5.4,
    status: "optimal",
    category: "Metabolic",
  },
  {
    id: "3",
    name: "Homocysteine",
    value: 9.2,
    unit: "µmol/L",
    date: "2026-03-10",
    optimalMin: 0,
    optimalMax: 8.0,
    status: "suboptimal",
    category: "Cardiovascular",
  },
  {
    id: "4",
    name: "DHEA-S",
    value: 180,
    unit: "µg/dL",
    date: "2026-03-10",
    optimalMin: 200,
    optimalMax: 350,
    status: "suboptimal",
    category: "Hormonal",
  },
  {
    id: "5",
    name: "Insulin (Fasting)",
    value: 4.2,
    unit: "µIU/mL",
    date: "2026-03-10",
    optimalMin: 0,
    optimalMax: 5.0,
    status: "optimal",
    category: "Metabolic",
  },
  {
    id: "6",
    name: "Vitamin D",
    value: 52,
    unit: "ng/mL",
    date: "2026-03-10",
    optimalMin: 50,
    optimalMax: 80,
    status: "optimal",
    category: "Micronutrient",
  },
  {
    id: "7",
    name: "Testosterone (Total)",
    value: 620,
    unit: "ng/dL",
    date: "2026-03-10",
    optimalMin: 600,
    optimalMax: 900,
    status: "optimal",
    category: "Hormonal",
  },
  {
    id: "8",
    name: "Cortisol (AM)",
    value: 18,
    unit: "µg/dL",
    date: "2026-03-10",
    optimalMin: 10,
    optimalMax: 16,
    status: "suboptimal",
    category: "Hormonal",
  },
];

export const latestWearable: WearableSnapshot = {
  date: "2026-03-18",
  hrv: 58,
  bodyBattery: 88,
  sleepScore: 91,
  stressLevel: 24,
  vo2Max: 47.2,
  rhr: 52,
  sleepDuration: 7.4,
  deepSleepPct: 22,
  remPct: 25,
  lightSleepPct: 53,
};

export const hrvHistory = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 48 + Math.round(Math.sin(i * 0.4) * 8 + Math.random() * 6),
}));

export const bodyBatteryHistory = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  value: [72, 85, 78, 91, 88, 95, 82][i],
}));

export const inflammationScore = 3.2;

export const inflammationDrivers = [
  { name: "Sleep Consistency", value: 78, delta: "+4%" },
  { name: "DHEA-S Level", value: 65, delta: "-8%" },
  { name: "Activity Balance", value: 82, delta: "+2%" },
  { name: "hs-CRP Trend", value: 91, delta: "+6%" },
];

export const advisorRecs: AdvisorRecommendation[] = [
  {
    id: "1",
    category: "ALERT",
    title: "Homocysteine Elevated",
    detail:
      "Your Homocysteine at 9.2 µmol/L exceeds the functional longevity threshold of 8.0. Elevated homocysteine is a strong predictor of cardiovascular and cognitive decline.",
    timestamp: "2h ago",
    actions: [
      "Start B6/B12/Folate methylation protocol",
      "Retest in 6 weeks",
      "Review dietary methionine load",
    ],
  },
  {
    id: "2",
    category: "INSIGHT",
    title: "HRV Trending Upward",
    detail:
      "Your 14-day HRV average has increased from 51ms to 58ms. This correlates with improved sleep consistency and reduced evening stress scores. Positive adaptive response detected.",
    timestamp: "6h ago",
    actions: [
      "Maintain current Zone 2 frequency",
      "Continue evening wind-down protocol",
    ],
  },
  {
    id: "3",
    category: "ADVICE",
    title: "Cortisol Management Priority",
    detail:
      "Fasting Insulin is optimal (4.2), but AM Cortisol is elevated at 18 µg/dL alongside Garmin stress data. Chronic cortisol elevation accelerates skin glycation and testosterone suppression.",
    timestamp: "12h ago",
    actions: [
      "400mg Magnesium Glycinate pre-sleep",
      "20min Zone 2 cardio at 60-70% max HR",
      "Reduce caffeine after 12pm",
      "Add Ashwagandha KSM-66 (300mg)",
    ],
  },
  {
    id: "4",
    category: "FOCUS",
    title: "Sleep Architecture Optimization",
    detail:
      "Deep sleep is at 22% — within optimal range but improvable. DHEA-S deficiency correlates with reduced slow-wave sleep. Addressing DHEA-S may compound sleep depth improvements.",
    timestamp: "1d ago",
    actions: [
      "Consider DHEA-S supplementation (consult physician)",
      "Magnesium Glycinate stack",
      "Maintain consistent sleep/wake times",
    ],
  },
  {
    id: "5",
    category: "INSIGHT",
    title: "Metabolic Health Strong",
    detail:
      "HbA1c at 5.1% and Fasting Insulin at 4.2 µIU/mL place you in the top metabolic health quartile. Time-restricted eating and Zone 2 training are working effectively.",
    timestamp: "2d ago",
    actions: [
      "Maintain 16:8 intermittent fasting window",
      "Continue low-glycemic dietary pattern",
    ],
  },
];

export const protocols: Protocol[] = [
  {
    id: "1",
    title: "Zone 2 Cardio Protocol",
    category: "Exercise",
    description:
      "3-4x weekly aerobic sessions at 60-70% max HR for 30-45 minutes. Primary driver for mitochondrial biogenesis, metabolic flexibility, and HRV improvement.",
    status: "active",
    startDate: "2026-01-15",
    notes: "Currently at 3x/week. Target 4x/week.",
  },
  {
    id: "2",
    title: "Magnesium Glycinate Stack",
    category: "Supplementation",
    description:
      "400mg Magnesium Glycinate 60 minutes before sleep. Supports cortisol regulation, deep sleep architecture, and neuromuscular recovery.",
    status: "active",
    startDate: "2026-02-01",
  },
  {
    id: "3",
    title: "B-Vitamin Methylation Protocol",
    category: "Supplementation",
    description:
      "Methylfolate (800µg) + Methylcobalamin B12 (1000µg) + P5P B6 (50mg) to reduce Homocysteine. Critical for cardiovascular and cognitive longevity.",
    status: "active",
    startDate: "2026-03-12",
    notes: "New protocol. Monitor Homocysteine in 6 weeks.",
  },
  {
    id: "4",
    title: "Cold Exposure Therapy",
    category: "Hormesis",
    description:
      "2-3 min cold shower or ice bath at 50-59°F post-workout. Activates brown adipose tissue, norepinephrine release, and resilience adaptation.",
    status: "active",
    startDate: "2026-01-20",
  },
  {
    id: "5",
    title: "Time-Restricted Eating (16:8)",
    category: "Metabolic",
    description:
      "Eating window: 12pm-8pm. Supports insulin sensitivity, metabolic flexibility, and autophagy induction. Correlates directly with optimal HbA1c and Fasting Insulin markers.",
    status: "active",
    startDate: "2025-11-01",
  },
  {
    id: "6",
    title: "Sauna Protocol",
    category: "Hormesis",
    description:
      "4x weekly, 20 minutes at 180-190°F. Correlates with 40% reduction in all-cause mortality in Finnish cohort studies. Heat shock protein activation.",
    status: "paused",
    startDate: "2026-01-01",
    notes: "Paused due to travel. Resume next week.",
  },
];

function buildSegments(
  totalMin: number,
  deepPct: number,
  remPct: number,
  lightPct: number,
  awakePct: number,
): HypnogramSegment[] {
  const segs: HypnogramSegment[] = [];
  let cursor = 0;

  // Typical human sleep: 4-5 cycles ~90min each
  // Deep sleep front-loaded (cycles 1-2), REM back-loaded (cycles 3-5)
  // Light sleep transitions between stages

  const deepMin = Math.round((deepPct / 100) * totalMin);
  const remMin = Math.round((remPct / 100) * totalMin);
  const lightMin = Math.round((lightPct / 100) * totalMin);
  const awakeMin = Math.round((awakePct / 100) * totalMin);

  let deepLeft = deepMin;
  let remLeft = remMin;
  let lightLeft = lightMin;
  let awakeLeft = awakeMin;

  // Sleep onset - brief light then awake burst sometimes
  const onsetLight = Math.min(8, lightLeft);
  segs.push({ stage: "light", startMin: cursor, endMin: cursor + onsetLight });
  cursor += onsetLight;
  lightLeft -= onsetLight;

  // Cycle pattern over totalMin
  let cycle = 0;
  while (cursor < totalMin - 5) {
    const isEarlyNight = cycle < 2;
    const remaining = totalMin - cursor;

    if (isEarlyNight && deepLeft > 0) {
      // Deep sleep chunk front-loaded
      const deepChunk = Math.min(deepLeft, Math.round(25 + Math.random() * 15));
      if (deepChunk > 0 && lightLeft > 3) {
        const descent = Math.min(lightLeft, 5);
        segs.push({
          stage: "light",
          startMin: cursor,
          endMin: cursor + descent,
        });
        cursor += descent;
        lightLeft -= descent;
      }
      const actual = Math.min(deepChunk, remaining - 5);
      if (actual > 0) {
        segs.push({ stage: "deep", startMin: cursor, endMin: cursor + actual });
        cursor += actual;
        deepLeft -= actual;
      }
      // Ascent back through light
      if (lightLeft > 3 && cursor < totalMin - 5) {
        const ascent = Math.min(lightLeft, 8);
        segs.push({
          stage: "light",
          startMin: cursor,
          endMin: cursor + ascent,
        });
        cursor += ascent;
        lightLeft -= ascent;
      }
    } else if (remLeft > 0) {
      // REM chunk back-loaded
      const remChunk = Math.min(remLeft, Math.round(20 + Math.random() * 20));
      if (lightLeft > 3) {
        const transit = Math.min(lightLeft, 5);
        segs.push({
          stage: "light",
          startMin: cursor,
          endMin: cursor + transit,
        });
        cursor += transit;
        lightLeft -= transit;
      }
      const actual = Math.min(remChunk, remaining - 5);
      if (actual > 0) {
        segs.push({ stage: "rem", startMin: cursor, endMin: cursor + actual });
        cursor += actual;
        remLeft -= actual;
      }
    } else if (lightLeft > 0) {
      const chunk = Math.min(lightLeft, Math.round(10 + Math.random() * 15));
      const actual = Math.min(chunk, remaining - 2);
      if (actual > 0) {
        segs.push({
          stage: "light",
          startMin: cursor,
          endMin: cursor + actual,
        });
        cursor += actual;
        lightLeft -= actual;
      }
    } else {
      break;
    }

    // Occasional brief awakening
    if (awakeLeft > 0 && Math.random() < 0.3 && cursor < totalMin - 8) {
      const awakeChunk = Math.min(awakeLeft, Math.round(2 + Math.random() * 4));
      segs.push({
        stage: "awake",
        startMin: cursor,
        endMin: cursor + awakeChunk,
      });
      cursor += awakeChunk;
      awakeLeft -= awakeChunk;
    }

    cycle++;
    if (cycle > 10) break;
  }

  // Fill any remaining with light
  if (cursor < totalMin) {
    segs.push({ stage: "light", startMin: cursor, endMin: totalMin });
  }

  return segs;
}

const sleepNightData: Array<{
  offsetDays: number;
  bedtime: string;
  wakeTime: string;
  totalMin: number;
  score: number;
  hrv: number;
  deep: number;
  rem: number;
  light: number;
  awake: number;
  eff: number;
}> = [
  {
    offsetDays: 0,
    bedtime: "22:34",
    wakeTime: "06:12",
    totalMin: 458,
    score: 91,
    hrv: 58,
    deep: 22,
    rem: 25,
    light: 49,
    awake: 4,
    eff: 94,
  },
  {
    offsetDays: 1,
    bedtime: "23:02",
    wakeTime: "06:38",
    totalMin: 456,
    score: 85,
    hrv: 54,
    deep: 20,
    rem: 22,
    light: 51,
    awake: 7,
    eff: 91,
  },
  {
    offsetDays: 2,
    bedtime: "22:18",
    wakeTime: "06:05",
    totalMin: 467,
    score: 88,
    hrv: 56,
    deep: 23,
    rem: 24,
    light: 48,
    awake: 5,
    eff: 93,
  },
  {
    offsetDays: 3,
    bedtime: "23:45",
    wakeTime: "06:50",
    totalMin: 425,
    score: 72,
    hrv: 44,
    deep: 15,
    rem: 20,
    light: 54,
    awake: 11,
    eff: 82,
  },
  {
    offsetDays: 4,
    bedtime: "00:12",
    wakeTime: "07:28",
    totalMin: 436,
    score: 68,
    hrv: 41,
    deep: 13,
    rem: 18,
    light: 58,
    awake: 11,
    eff: 80,
  },
  {
    offsetDays: 5,
    bedtime: "22:55",
    wakeTime: "06:20",
    totalMin: 445,
    score: 82,
    hrv: 52,
    deep: 19,
    rem: 23,
    light: 52,
    awake: 6,
    eff: 90,
  },
  {
    offsetDays: 6,
    bedtime: "22:10",
    wakeTime: "06:00",
    totalMin: 470,
    score: 90,
    hrv: 61,
    deep: 24,
    rem: 26,
    light: 46,
    awake: 4,
    eff: 95,
  },
  {
    offsetDays: 7,
    bedtime: "22:42",
    wakeTime: "06:15",
    totalMin: 453,
    score: 87,
    hrv: 57,
    deep: 21,
    rem: 24,
    light: 50,
    awake: 5,
    eff: 92,
  },
  {
    offsetDays: 8,
    bedtime: "23:30",
    wakeTime: "06:55",
    totalMin: 445,
    score: 76,
    hrv: 47,
    deep: 17,
    rem: 21,
    light: 54,
    awake: 8,
    eff: 87,
  },
  {
    offsetDays: 9,
    bedtime: "22:50",
    wakeTime: "06:10",
    totalMin: 440,
    score: 84,
    hrv: 53,
    deep: 20,
    rem: 23,
    light: 51,
    awake: 6,
    eff: 91,
  },
  {
    offsetDays: 10,
    bedtime: "01:05",
    wakeTime: "07:40",
    totalMin: 395,
    score: 61,
    hrv: 37,
    deep: 11,
    rem: 17,
    light: 61,
    awake: 11,
    eff: 75,
  },
  {
    offsetDays: 11,
    bedtime: "22:25",
    wakeTime: "06:08",
    totalMin: 463,
    score: 89,
    hrv: 59,
    deep: 23,
    rem: 25,
    light: 47,
    awake: 5,
    eff: 94,
  },
  {
    offsetDays: 12,
    bedtime: "22:48",
    wakeTime: "06:22",
    totalMin: 454,
    score: 86,
    hrv: 55,
    deep: 21,
    rem: 24,
    light: 50,
    awake: 5,
    eff: 92,
  },
  {
    offsetDays: 13,
    bedtime: "23:15",
    wakeTime: "06:45",
    totalMin: 450,
    score: 80,
    hrv: 50,
    deep: 18,
    rem: 22,
    light: 53,
    awake: 7,
    eff: 89,
  },
];

const BASE_DATE = new Date("2026-03-18");

export const sleepNights: SleepNight[] = sleepNightData.map((d) => {
  const date = new Date(BASE_DATE);
  date.setDate(date.getDate() - d.offsetDays);
  const dateStr = date.toISOString().split("T")[0];
  return {
    date: dateStr,
    bedtime: d.bedtime,
    wakeTime: d.wakeTime,
    totalMinutes: d.totalMin,
    sleepScore: d.score,
    hrv: d.hrv,
    deepPct: d.deep,
    remPct: d.rem,
    lightPct: d.light,
    awakePct: d.awake,
    efficiency: d.eff,
    segments: buildSegments(d.totalMin, d.deep, d.rem, d.light, d.awake),
  };
});
