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
