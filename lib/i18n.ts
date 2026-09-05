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
    constraints: string;
    gaps: string;
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
  trace: {
    open: string;
    close: string;
    factors: string;
    factorNames: Record<string, string>;
    fit: string;
    fitNote: string;
    recommendation: string;
    confidence: string;
  };
  cost: {
    label: string;
    show: string;
    hide: string;
    formula: string;
    participants: string;
    duration: string;
    rate: string;
    assumption: string;
  };
  meetingBrief: {
    title: string;
    objective: string;
    decisions: string;
    participants: string;
    preread: string;
    questions: string;
  };
  evidenceNote: string;
  narrator: {
    title: string;
    idle: string;
    collapse: string;
    expand: string;
    demoNote: string;
    received: string;
    breaking: string;
    understanding: string;
    statusUnderstanding: string;
    stakeholders: (n: number) => string;
    noStakeholders: string;
    checkingInfo: string;
    constraints: (n: number) => string;
    gaps: (n: number) => string;
    infoAvailable: string;
    evidenceFound: string;
    sources: (n: number) => string;
    realtime: string;
    realtimeNone: string;
    cost: (amount: string) => string;
    ready: string;
    routeWhy: Record<RouteId, string>;
    meetingReasons: string;
    meetingPrepared: string;
    asyncSelected: string;
    asyncIndependent: string;
    sent: (n: number) => string;
    responded: (name: string) => string;
    conflict: string;
    enough: string;
    briefReady: string;
    approved: (owner: string) => string;
    saved: (amount: string) => string;
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
  playback: {
    title: string;
    states: Record<string, string>;
    blurbs: Record<string, string>;
    restart: string;
    fullWalkthrough: string;
    playMeeting: string;
  };
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
      "Surfacing constraints",
      "Locating information gaps",
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
    constraints: "Constraints",
    gaps: "Information gaps",
    cost: "Coordination cost of the meeting as requested",
    costBasis: "How that is calculated",
  },
  route: {
    eyebrow: "Route",
    considered: "Also considered",
    preview: "The meeting ORBIT would have booked",
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
  trace: {
    open: "Why this decision",
    close: "Hide decision trace",
    factors: "Extracted factors",
    factorNames: {
      information_sufficiency: "Information sufficiency",
      stakeholder_load: "Stakeholder load",
      stakeholder_complexity: "Stakeholder complexity",
      decision_ambiguity: "Decision ambiguity",
      real_time_dependency: "Real-time dependency",
      urgency: "Urgency",
      disagreement_potential: "Disagreement potential",
      decision_consequence: "Decision consequence",
    },
    fit: "Route fit",
    fitNote: "Independent fit scores. They do not sum to 100.",
    recommendation: "Recommendation",
    confidence: "Recommendation confidence",
  },
  cost: {
    label: "Cost of the meeting as requested",
    show: "How this is calculated",
    hide: "Hide calculation",
    formula: "participants × hours × loaded hourly cost",
    participants: "Participants",
    duration: "Duration",
    rate: "Loaded cost",
    assumption: "Demo assumption, not a measurement.",
  },
  meetingBrief: {
    title: "Meeting brief",
    objective: "Objective",
    decisions: "Decisions required",
    participants: "Participants",
    preread: "Pre-read",
    questions: "Questions to resolve",
  },
  evidenceNote: "Simulated demo evidence",
  narrator: {
    title: "Decision Narrator",
    idle: "Tell me what you're trying to get done. I'll work out how your team should coordinate.",
    collapse: "Collapse narrator",
    expand: "Decision Narrator",
    demoNote: "Demo data. No external systems are connected.",
    received: "Request received.",
    breaking: "I'm breaking it into the information, the people and the decision it requires.",
    understanding: "First, what actually needs to be decided here.",
    statusUnderstanding: "Understanding request",
    stakeholders: (n) => `${n} stakeholders have to contribute to this one.`,
    noStakeholders: "Nobody has to contribute. This is a lookup, not a decision.",
    checkingInfo: "Now I'm checking whether what this needs already exists, or has to be collected.",
    constraints: (n) => `${n} constraints this decision has to live inside.`,
    gaps: (n) =>
      n === 0
        ? "Nothing is unresolved — the answer is already in the systems."
        : `${n} questions remain unresolved.`,
    infoAvailable: "Information available",
    evidenceFound: "Sources checked",
    sources: (n) => `${n}`,
    realtime:
      "This needs human input. The real question is whether that input needs everyone in the room at the same time.",
    realtimeNone: "No human judgement is required, so there is nothing to coordinate.",
    cost: (amount) => `The meeting as requested would cost ${amount} of synchronous time.`,
    ready: "Recommendation ready.",
    routeWhy: {
      ai_handles_it:
        "This doesn't need coordination at all. What it needs already exists, so I can answer it directly.",
      async_first:
        "This needs human input, but not a live conversation. I'll collect the missing pieces asynchronously and turn them into one decision.",
      meeting:
        "Ambiguity is high and the parties disagree. Real-time discussion will change the outcome here, so a meeting is justified.",
    },
    meetingReasons: "Three things pushed this toward a room:",
    meetingPrepared: "So I've prepared the meeting rather than simply booking one.",
    asyncSelected: "Instead of scheduling anything, I'm turning the decision into independent questions.",
    asyncIndependent: "None of them needs another answered first.",
    sent: (n) => `${n} questions sent.`,
    responded: (name) => `${name} responded.`,
    conflict: "Two answers contradict each other. That can't be closed in writing.",
    enough: "That's enough to synthesize the decision.",
    briefReady: "Decision brief ready.",
    approved: (owner) => `Approved. Logged, and ${owner} notified as the owner.`,
    saved: (amount) => `${amount} of coordination cost avoided.`,
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
  playback: {
    title: "Decision Playback",
    states: {
      request: "Request",
      understand: "Understand",
      stakeholders: "Stakeholders",
      constraints: "Constraints",
      gaps: "Information gaps",
      route: "Route",
      questions: "Questions",
      responses: "Responses",
      decision: "Decision",
      impact: "Impact",
    },
    blurbs: {
      request: "A request arrives the way it always does — as a meeting.",
      understand: "Identifying the actual decision behind this request.",
      stakeholders: "Working out who has to contribute.",
      constraints: "Surfacing the constraints the decision has to live inside.",
      gaps: "Finding what is still unresolved.",
      route: "Choosing the lowest-cost way to close it.",
      questions: "Turning the decision into independent questions.",
      responses: "Collecting the answers.",
      decision: "Synthesizing the decision.",
      impact: "What it saved.",
    },
    restart: "Restart playback",
    fullWalkthrough: "Play the full walkthrough",
    playMeeting: "Play the meeting scenario",
  },
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
    steps: ["理解這個需求", "辨識關係人", "浮現限制條件", "找出資訊缺口", "選擇協調方式"],
    why: "為什麼是這條路徑",
    whyClose: "收起判斷依據",
    necessity: "會議必要性",
    sufficiency: "資訊充足度",
    complexity: "決策複雜度",
    realtime: "即時討論需求",
    conflict: "利害關係衝突",
    basedOn: "依據",
    constraints: "限制條件",
    gaps: "資訊缺口",
    cost: "照原樣開會的協調成本",
    costBasis: "計算方式",
  },
  route: {
    eyebrow: "路徑",
    considered: "同時評估過",
    preview: "ORBIT 原本會排的那場會",
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
  trace: {
    open: "為什麼是這個判斷",
    close: "收起判斷依據",
    factors: "擷取到的因子",
    factorNames: {
      information_sufficiency: "資訊充足度",
      stakeholder_load: "關係人負載",
      stakeholder_complexity: "關係人複雜度",
      decision_ambiguity: "決策模糊度",
      real_time_dependency: "即時討論依賴度",
      urgency: "急迫性",
      disagreement_potential: "分歧可能性",
      decision_consequence: "決策後果",
    },
    fit: "路徑適配",
    fitNote: "三者為各自獨立的適配分數，加總不等於 100。",
    recommendation: "建議路徑",
    confidence: "建議信心度",
  },
  cost: {
    label: "照原樣開會的成本",
    show: "這個數字怎麼算的",
    hide: "收起計算方式",
    formula: "參與人數 × 小時 × 每人每小時成本",
    participants: "參與人數",
    duration: "會議長度",
    rate: "每人每小時",
    assumption: "示範用的假設值，不是實測數字。",
  },
  meetingBrief: {
    title: "會議簡報",
    objective: "會議目的",
    decisions: "需要做出的決策",
    participants: "參與者",
    preread: "事前資料",
    questions: "要解決的問題",
  },
  evidenceNote: "示範用的模擬依據",
  narrator: {
    title: "決策敘事",
    idle: "告訴我你想完成什麼，我來判斷你的團隊該用哪種方式協調。",
    collapse: "收起敘事面板",
    expand: "決策敘事",
    demoNote: "示範資料，未連接任何外部系統。",
    received: "收到需求。",
    breaking: "我把它拆成所需的資訊、需要的人，以及要做的決策。",
    understanding: "先看這件事真正要決定的是什麼。",
    statusUnderstanding: "理解需求中",
    stakeholders: (n) => `這件事需要 ${n} 位關係人提供輸入。`,
    noStakeholders: "沒有人需要提供輸入。這是查詢，不是決策。",
    checkingInfo: "接著我確認需要的資訊是已經存在，還是必須去收集。",
    constraints: (n) => `這個決策必須容納 ${n} 個限制條件。`,
    gaps: (n) => (n === 0 ? "沒有懸而未決的部分 —— 答案已經在系統裡。" : `還有 ${n} 個問題沒有答案。`),
    infoAvailable: "資訊充足度",
    evidenceFound: "查核來源",
    sources: (n) => `${n} 個`,
    realtime: "這件事需要人的輸入。真正的問題是：這些輸入需不需要所有人同時在場。",
    realtimeNone: "不需要任何人的判斷，因此沒有需要協調的東西。",
    cost: (amount) => `照原樣開這場會，要花掉 ${amount} 的同步時間。`,
    ready: "建議已就緒。",
    routeWhy: {
      ai_handles_it: "這件事完全不需要協調。它需要的東西都已經存在，我可以直接回答。",
      async_first:
        "這件事需要人的輸入，但不需要即時對話。我會用非同步方式收齊缺的部分，再彙整成一個決策。",
      meeting: "模糊度高，而且各方結論對立。即時討論會改變結果，所以這場會開得有道理。",
    },
    meetingReasons: "有三件事把它推向了會議室：",
    meetingPrepared: "所以我把這場會準備好了，而不是只把它排進行事曆。",
    asyncSelected: "我不排任何會議，而是把這個決策拆成彼此獨立的提問。",
    asyncIndependent: "沒有任何一題需要等另一題先有答案。",
    sent: (n) => `已送出 ${n} 個提問。`,
    responded: (name) => `${name} 已回覆。`,
    conflict: "有兩個答案互相矛盾，這無法用書面收斂。",
    enough: "資訊足夠了，可以彙整成決策。",
    briefReady: "決策摘要已就緒。",
    approved: (owner) => `已核准。決策入檔，並已通知 ${owner} 為負責人。`,
    saved: (amount) => `省下 ${amount} 的協調成本。`,
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
  playback: {
    title: "決策回放",
    states: {
      request: "需求",
      understand: "理解",
      stakeholders: "關係人",
      constraints: "限制條件",
      gaps: "資訊缺口",
      route: "路徑",
      questions: "提問",
      responses: "回覆",
      decision: "決策",
      impact: "影響",
    },
    blurbs: {
      request: "需求進來的方式一如往常 —— 一場會議。",
      understand: "辨識這個需求背後真正要決定的事。",
      stakeholders: "釐清誰必須提供輸入。",
      constraints: "浮現這個決策必須容納的限制條件。",
      gaps: "找出還沒有答案的部分。",
      route: "選出能完成決策、成本最低的方式。",
      questions: "把決策拆成彼此獨立的提問。",
      responses: "收集回覆。",
      decision: "彙整成決策。",
      impact: "省下了什麼。",
    },
    restart: "重新播放",
    fullWalkthrough: "播放完整版導覽",
    playMeeting: "播放需要開會的情境",
  },
};

export const STRINGS: Record<Lang, UIStrings> = { en, zh };
