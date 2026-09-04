import type { RouteId } from "./types";

export type Lang = "en" | "zh";

export interface UIStrings {
  routeLabel: Record<RouteId, string>;
  levels: Record<string, string>;
  common: {
    home: string;
    decisions: string;
    search: string;
    play: string;
    stop: string;
    back: string;
    next: string;
    close: string;
    offline: string;
    live: string;
  };
  hero: {
    headline: string;
    placeholder: string;
    hint: string;
    tagline: string[];
    recent: string;
    errorOffline: string;
    errorUnreachable: string;
  };
  before: { eyebrow: string; today: string; cost: string };
  montage: { eyebrow: string; title: string; routing: string; asRequested: string; following: string };
  analysis: {
    eyebrow: string;
    steps: string[];
    why: string;
    whyClose: string;
    necessity: string;
    sufficiency: string;
    complexity: string;
    realtime: string;
    conflict: string;
    basedOn: string;
    cost: string;
    costBasis: string;
  };
  route: {
    eyebrow: string;
    considered: string;
    preview: string;
    participants: string;
    duration: string;
    goal: string;
    notChosen: string;
  };
  async: {
    eyebrow: string;
    header: (n: number) => string;
    waiting: string;
    replied: string;
    queued: string;
    collected: (a: number, b: number) => string;
    synthesis: string;
    escalating: string;
    noInvites: string;
  };
  brief: {
    eyebrow: string;
    confidence: string;
    owner: string;
    stakeholders: string;
    openQuestions: string;
    evidence: string;
    approve: string;
    requestMore: string;
    turnIntoMeeting: string;
    approved: string;
    executed: string;
    seeResult: string;
  };
  roi: {
    eyebrow: string;
    before: string;
    after: string;
    saving: string;
    finish: string;
  };
  closing: { strategic: string };
  palette: {
    placeholder: string;
    actions: string;
    scenarios: string;
    screens: string;
    empty: string;
    playDemo: string;
    newDecision: string;
    switchLang: string;
    restart: string;
  };
  screens: string[];
}

const en: UIStrings = {
  routeLabel: { ai_handles_it: "AI HANDLES IT", async_first: "ASYNC FIRST", meeting: "MEETING" },
  levels: { Low: "Low", Medium: "Medium", High: "High", None: "None", Required: "Required" },
  common: {
    home: "Home",
    decisions: "Decisions",
    search: "Search",
    play: "Play demo",
    stop: "Stop",
    back: "Back",
    next: "Next",
    close: "Close",
    offline: "Offline",
    live: "Live",
  },
  hero: {
    headline: "What are you trying to get done?",
    placeholder: "Describe the work, decision, or question you need help coordinating…",
    hint: "⌘ ↵ to analyze",
    tagline: ["AI handles it.", "Async first.", "Meeting when necessary."],
    recent: "Recent decisions",
    errorOffline: "Live analysis is off. Open one of the decisions below to run the full demo.",
    errorUnreachable: "Live analysis could not be reached. Open one of the decisions below instead.",
  },
  before: { eyebrow: "Before", today: "What happens today", cost: "What it costs" },
  montage: {
    eyebrow: "Routing",
    title: "Three requests. Three different answers.",
    routing: "Routing",
    asRequested: "As requested",
    following: "Following this one",
  },
  analysis: {
    eyebrow: "Analysis",
    steps: [
      "Understanding the request",
      "Identifying stakeholders",
      "Checking available information",
      "Assessing decision complexity",
      "Choosing coordination mode",
    ],
    why: "Why this route",
    whyClose: "Hide reasoning",
    necessity: "Meeting necessity",
    sufficiency: "Information sufficiency",
    complexity: "Decision complexity",
    realtime: "Real-time discussion",
    conflict: "Stakeholder conflict",
    basedOn: "Based on",
    cost: "Coordination cost of the meeting as requested",
    costBasis: "How that is calculated",
  },
  route: {
    eyebrow: "Route",
    considered: "Also considered",
    preview: "The meeting SYNCLESS would have booked",
    participants: "Participants",
    duration: "Duration",
    goal: "Decision",
    notChosen: "Not chosen",
  },
  async: {
    eyebrow: "Coordination",
    header: (n) => `${n} stakeholders · ${n} targeted questions · 1 decision`,
    waiting: "Waiting",
    replied: "Replied",
    queued: "Queued",
    collected: (a, b) => `${a} of ${b} collected`,
    synthesis: "Synthesis",
    escalating: "Conflict unresolved — escalating",
    noInvites: "0 calendar invites sent",
  },
  brief: {
    eyebrow: "Decision",
    confidence: "confidence",
    owner: "Owner",
    stakeholders: "stakeholders",
    openQuestions: "questions answered",
    evidence: "Evidence",
    approve: "Approve",
    requestMore: "Request more input",
    turnIntoMeeting: "Turn into a meeting",
    approved: "Approved",
    executed: "On approval",
    seeResult: "See what it saved",
  },
  roi: {
    eyebrow: "Result",
    before: "Before",
    after: "After",
    saving: "Coordination cost avoided",
    finish: "Finish",
  },
  closing: { strategic: "Right work. Right people. Right synchronization." },
  palette: {
    placeholder: "What do you want to do?",
    actions: "Actions",
    scenarios: "Decisions",
    screens: "Go to",
    empty: "Nothing matches",
    playDemo: "Play the full demo",
    newDecision: "New decision",
    switchLang: "Switch to 中文",
    restart: "Restart",
  },
  screens: ["Request", "Analysis", "Route", "Coordination", "Decision", "Result"],
};

const zh: UIStrings = {
  routeLabel: { ai_handles_it: "AI 直接處理", async_first: "非同步優先", meeting: "召開會議" },
  levels: { Low: "低", Medium: "中", High: "高", None: "無", Required: "必要" },
  common: {
    home: "首頁",
    decisions: "決策",
    search: "搜尋",
    play: "播放示範",
    stop: "暫停",
    back: "上一步",
    next: "下一步",
    close: "關閉",
    offline: "離線",
    live: "即時",
  },
  hero: {
    headline: "你想完成什麼？",
    placeholder: "描述你需要協調的工作、決策或問題…",
    hint: "⌘ ↵ 開始分析",
    tagline: ["AI 直接處理。", "非同步優先。", "必要時才開會。"],
    recent: "最近的決策",
    errorOffline: "即時分析未開啟。開啟下方任一決策即可完整播放示範。",
    errorUnreachable: "無法連線至即時分析。請改開啟下方任一決策。",
  },
  before: { eyebrow: "之前", today: "今天會發生什麼", cost: "代價是什麼" },
  montage: {
    eyebrow: "路由判定",
    title: "三個需求，三種不同的答案。",
    routing: "判定中",
    asRequested: "照原樣開會",
    following: "接下來跟著這一個",
  },
  analysis: {
    eyebrow: "分析",
    steps: ["理解這個需求", "辨識關係人", "盤點既有資訊", "評估決策複雜度", "選擇協調方式"],
    why: "為什麼是這條路徑",
    whyClose: "收起判斷依據",
    necessity: "會議必要性",
    sufficiency: "資訊充足度",
    complexity: "決策複雜度",
    realtime: "即時討論需求",
    conflict: "利害關係衝突",
    basedOn: "依據",
    cost: "照原樣開會的協調成本",
    costBasis: "計算方式",
  },
  route: {
    eyebrow: "路徑",
    considered: "同時評估過",
    preview: "SYNCLESS 原本會排的那場會",
    participants: "參與人數",
    duration: "會議長度",
    goal: "決策目標",
    notChosen: "未選擇",
  },
  async: {
    eyebrow: "協調",
    header: (n) => `${n} 位關係人 · ${n} 個針對性提問 · 1 個決策`,
    waiting: "等待回覆",
    replied: "已回覆",
    queued: "等待派發",
    collected: (a, b) => `已收集 ${a} / ${b}`,
    synthesis: "彙整",
    escalating: "衝突未解 — 升級為會議",
    noInvites: "發出 0 封行事曆邀請",
  },
  brief: {
    eyebrow: "決策",
    confidence: "信心度",
    owner: "決策負責人",
    stakeholders: "位關係人",
    openQuestions: "個提問已回覆",
    evidence: "依據",
    approve: "核准",
    requestMore: "要求補充資訊",
    turnIntoMeeting: "改為召開會議",
    approved: "已核准",
    executed: "核准後自動執行",
    seeResult: "看看省下了什麼",
  },
  roi: {
    eyebrow: "成果",
    before: "之前",
    after: "之後",
    saving: "省下的協調成本",
    finish: "完成",
  },
  closing: { strategic: "對的工作、對的人、對的同步方式。" },
  palette: {
    placeholder: "你想做什麼？",
    actions: "操作",
    scenarios: "決策",
    screens: "前往",
    empty: "沒有符合的項目",
    playDemo: "播放完整示範",
    newDecision: "新的決策",
    switchLang: "Switch to English",
    restart: "重新開始",
  },
  screens: ["需求", "分析", "路徑", "協調", "決策", "成果"],
};

export const STRINGS: Record<Lang, UIStrings> = { en, zh };
