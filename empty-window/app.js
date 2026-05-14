var ZHILU_VISIT_KEY = "zhilu_visit_history";

var TRACKS = {
  gong: "考公",
  kaoyan: "考研",
  job: "就业",
  startup: "创业"
};

var WEIGHT_BY_VISIT = {
  gong: { gong: 0.1 },
  kaoyan: { kaoyan: 0.1 },
  job: { job: 0.1 },
  industry: { job: 0.04 },
  startup: { startup: 0.1 }
};

var DATA = {
  industries: [
    { name: "互联网", stars: 4, salary: "8k-18k/月", req: "编程/产品/运营基础，项目或实习经历", detail: "岗位包括前后端开发、算法、数据分析、产品经理、运营、设计。未来 5 年 AI 应用、产业互联网、出海 SaaS 仍有增长空间，但纯流量岗位竞争更激烈。适合学习快、能做项目、愿意持续更新技能的学生。", track: "job" },
    { name: "金融", stars: 4, salary: "7k-16k/月", req: "金融/会计/数学基础，证书或实习加分", detail: "岗位包括银行管培、券商研究、投行、风控、财富管理、量化助理。未来 5 年金融科技、普惠金融和财富管理需求稳定。适合数理能力强、表达稳、抗压能力好的学生。", track: "job" },
    { name: "教育", stars: 4, salary: "5k-12k/月", req: "教师资格证、表达能力、学科基础", detail: "岗位包括公办/民办教师、教研、课程产品、教育运营。未来 5 年职业教育、素质教育和教育数字化仍有机会。适合耐心强、表达清楚、愿意长期陪伴学生成长的人。", track: "job" },
    { name: "医疗", stars: 5, salary: "6k-14k/月", req: "医学/药学/护理/生物相关背景，资格证重要", detail: "岗位包括医生、药企研发、临床协调、器械销售、健康管理。人口老龄化带来长期需求，医疗器械和创新药仍是重点。适合专业门槛高、学习周期长但追求稳定价值的学生。", track: "kaoyan" },
    { name: "制造业", stars: 4, salary: "6k-13k/月", req: "机械/自动化/材料/工业工程基础", detail: "岗位包括工艺、设备、质量、供应链、智能制造工程师。未来 5 年高端制造、机器人和工业软件会持续升级。适合动手能力强、愿意到一线理解真实生产的学生。", track: "job" },
    { name: "新能源", stars: 5, salary: "8k-18k/月", req: "电气、材料、化学、车辆、能源相关基础", detail: "岗位包括电池研发、储能、光伏、风电、BMS、测试工程师。未来 5 年新能源车、储能和新型电力系统仍是高景气方向。适合理工科、能接受技术迭代和项目制工作的学生。", track: "job" },
    { name: "文化传媒", stars: 3, salary: "5k-12k/月", req: "内容能力、审美、剪辑/运营/策划作品", detail: "岗位包括新媒体运营、编导、品牌策划、短视频、商务。未来 5 年内容产业仍有机会，但平台变化快、作品和执行力更重要。适合表达欲强、审美好、能持续产出的学生。", track: "job" },
    { name: "咨询", stars: 4, salary: "9k-20k/月", req: "商科/理工复合背景，逻辑表达和案例能力", detail: "岗位包括战略咨询、管理咨询、财务咨询、IT 咨询。企业数字化、组织效率和出海会带来项目需求。适合逻辑强、沟通强、能承受高强度项目节奏的学生。", track: "job" },
    { name: "房地产", stars: 2, salary: "5k-11k/月", req: "土木/建筑/营销/财务基础，抗压能力", detail: "岗位包括工程管理、成本招采、物业运营、资产管理。未来 5 年行业从高增长转向存量运营和城市更新。适合愿意扎实做项目、关注城市空间和资产运营的学生。", track: "job" },
    { name: "公务员", stars: 4, salary: "5k-12k/月", req: "专业匹配、行测申论、政策理解能力", detail: "岗位包括中央机关、税务、海关、统计、公安、选调生、事业单位。未来 5 年公共服务、基层治理和数字政务会持续需要人才。适合追求稳定、规则感强、愿意服务公共事务的学生。", track: "gong" }
  ],
  majors: {
    "计算机科学与技术": {
      aliases: ["计算机", "软件工程", "人工智能", "数据科学"],
      schools: [
        { name: "北京邮电大学", ratio: "约 6:1-10:1", line: "近年复试线常见 330-360+", note: "通信、计算机就业认可度高" },
        { name: "华中科技大学", ratio: "约 5:1-9:1", line: "近年复试线常见 340-370+", note: "工科平台强，适合冲刺" },
        { name: "南京邮电大学", ratio: "约 4:1-8:1", line: "近年复试线常见 320-350+", note: "通信与计算机方向性价比高" }
      ],
      tutors: ["人工智能与机器学习方向导师：关注论文、项目、数学基础", "软件工程方向课程：算法、操作系统、数据库、工程实践评价较高"],
      jobs: [
        { name: "后端开发工程师", salary: "10k-22k/月", req: "Java/Go/Python、数据库、项目经验" },
        { name: "数据分析师", salary: "8k-18k/月", req: "SQL、Python、统计分析、业务理解" },
        { name: "测试开发工程师", salary: "8k-16k/月", req: "自动化测试、脚本、质量意识" }
      ],
      growth: ["做 2 个可展示项目并部署上线", "刷算法与数据库基础", "参加互联网+、挑战杯或开源项目", "通过国家大学生就业服务平台投递实习"],
      gongPosts: [
        { name: "税务局信息化岗", req: "计算机类，本科及以上，部分岗位限应届", score: "往年进面常见 125-140+" },
        { name: "公安机关网络安全岗", req: "计算机类，需符合体测/政审要求", score: "往年进面常见 120-135+" }
      ]
    },
    "汉语言文学": {
      aliases: ["中文", "汉语言", "新闻传播", "文秘"],
      schools: [
        { name: "北京师范大学", ratio: "约 8:1-15:1", line: "文学类复试线常见 365-390+", note: "师范与中文学科强" },
        { name: "华东师范大学", ratio: "约 7:1-12:1", line: "文学类复试线常见 360-385+", note: "适合教育与学术方向" },
        { name: "暨南大学", ratio: "约 5:1-10:1", line: "文学类复试线常见 355-380+", note: "华南地区就业资源较好" }
      ],
      tutors: ["古代文学、现当代文学方向：重视阅读量和文本分析", "课程评价：文学理论、中国文学史、语言学概论是核心"],
      jobs: [
        { name: "语文教师", salary: "6k-12k/月", req: "教师资格证、普通话、试讲能力" },
        { name: "新媒体编辑", salary: "5k-10k/月", req: "写作、选题、排版、热点判断" },
        { name: "行政文秘", salary: "5k-9k/月", req: "公文写作、沟通协调、办公软件" }
      ],
      growth: ["考教师资格证", "参加学术论坛或论文写作训练", "积累公众号/短视频文案作品", "关注学校和地方教育局招聘"],
      gongPosts: [
        { name: "机关综合文字岗", req: "中国语言文学类，本科及以上", score: "往年进面常见 130-145+" },
        { name: "宣传部门岗位", req: "中文、新闻传播相关，写作能力强", score: "往年进面常见 125-140+" }
      ]
    },
    "金融": {
      aliases: ["金融学", "经济学", "会计", "财务管理"],
      schools: [
        { name: "中央财经大学", ratio: "约 8:1-15:1", line: "金融专硕复试线常见 370-400+", note: "财经平台强，竞争高" },
        { name: "西南财经大学", ratio: "约 6:1-12:1", line: "金融专硕复试线常见 360-390+", note: "金融行业校友资源好" },
        { name: "上海财经大学", ratio: "约 10:1-18:1", line: "金融专硕复试线常见 380-410+", note: "区位优势明显" }
      ],
      tutors: ["金融工程、公司金融、资产定价方向：重视数学和计量", "课程评价：投资学、公司理财、计量经济学是核心"],
      jobs: [
        { name: "银行管培生", salary: "7k-14k/月", req: "金融基础、沟通、抗压、网申笔试" },
        { name: "证券研究助理", salary: "8k-18k/月", req: "财务分析、行业研究、写作" },
        { name: "风控/合规助理", salary: "7k-15k/月", req: "金融法规、数据分析、细致度" }
      ],
      growth: ["参加商赛和案例分析比赛", "准备 CPA/CFA/基金从业等证书", "找银行、券商、咨询实习", "训练财务建模和行业研究报告"],
      gongPosts: [
        { name: "税务局财税岗", req: "财政学、金融学、会计等相关专业", score: "往年进面常见 125-145+" },
        { name: "金融监管相关岗位", req: "经济金融类，部分要求硕士", score: "往年进面常见 130-150+" }
      ]
    },
    "教育学": {
      aliases: ["师范", "小学教育", "学前教育", "教育技术"],
      schools: [
        { name: "北京师范大学", ratio: "约 8:1-16:1", line: "教育学复试线常见 350-380+", note: "教育学顶尖平台" },
        { name: "华中师范大学", ratio: "约 5:1-10:1", line: "教育学复试线常见 340-370+", note: "师范就业认可度高" },
        { name: "东北师范大学", ratio: "约 4:1-8:1", line: "教育学复试线常见 335-365+", note: "性价比和师范资源较好" }
      ],
      tutors: ["课程与教学论、教育心理方向：重视阅读和研究设计", "课程评价：教育学原理、教育心理学、中外教育史是核心"],
      jobs: [
        { name: "中小学教师", salary: "5k-11k/月", req: "教师资格证、试讲、学科基础" },
        { name: "教研员/课程设计", salary: "6k-12k/月", req: "课程开发、教学设计、沟通" },
        { name: "教育运营", salary: "5k-10k/月", req: "用户运营、活动组织、数据意识" }
      ],
      growth: ["尽早考教师资格证", "参加教育实习和公开课训练", "关注学术论坛与教育科研项目", "准备教招笔试和结构化面试"],
      gongPosts: [
        { name: "教育局综合管理岗", req: "教育学类，本科及以上", score: "往年进面常见 125-140+" },
        { name: "事业单位教师岗", req: "教师资格证，专业对口", score: "以地方公告和笔面综合分为准" }
      ]
    }
  },
  competitions: [
    { name: "挑战杯", desc: "适合科研、社会实践、创新作品积累", url: "https://www.tiaozhanbei.net/" },
    { name: "中国国际大学生创新大赛", desc: "原互联网+，适合创新创业项目", url: "https://cy.ncss.cn/" },
    { name: "全国大学生数学建模竞赛", desc: "适合理工、金融、数据分析方向", url: "https://www.mcm.edu.cn/" }
  ],
  links: {
    yanzhao: "https://yz.chsi.com.cn/",
    ncss: "https://www.ncss.cn/",
    jobPlatform: "https://www.ncss.cn/student/jobfair/index.html",
    resume: "https://www.ncss.cn/student/",
    scs2025: "http://bm.scs.gov.cn/kl2025",
    scs: "https://www.scs.gov.cn/",
    moeTeacher: "https://ntce.neea.edu.cn/",
    institution: "https://www.mohrss.gov.cn/"
  },
  exams: [
    { name: "2025 年国考", time: "报名：2024 年 10 月；笔试：2024 年 12 月 1 日", link: "http://bm.scs.gov.cn/kl2025", note: "以国家公务员局专题公告为准" },
    { name: "2025 年省考", time: "多数省份集中在 2025 年 1-3 月发布公告，3-4 月笔试", link: "https://www.scs.gov.cn/", note: "各省公务员主管部门公告为准" },
    { name: "2025 年事业单位", time: "多地全年分批招聘，联考常见于上半年和下半年", link: "https://www.mohrss.gov.cn/", note: "以人社部门和招聘单位公告为准" }
  ],
  civilTypes: [
    { name: "国考", desc: "中央机关及直属机构招录，岗位覆盖税务、海关、统计、铁路公安等，竞争范围全国。" },
    { name: "省考", desc: "省市县乡机关招录，地域属性强，适合想留在本省发展的同学。" },
    { name: "事业单位", desc: "学校、医院、科研院所、公共服务机构等，考试内容因地区和单位差异较大。" },
    { name: "选调生", desc: "面向优秀应届毕业生和部分服务基层项目人员，通常重视学校、党员、学生干部等条件。" }
  ]
};

var state = {
  page: "home",
  qIndex: 0,
  answers: [],
  expandedIndustry: null
};

function $(id) {
  return document.getElementById(id);
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(ZHILU_VISIT_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveVisit(type, name, track) {
  var history = getHistory();
  history.unshift({ type: type, name: name, track: track, time: new Date().toISOString() });
  localStorage.setItem(ZHILU_VISIT_KEY, JSON.stringify(history.slice(0, 80)));
}

function route(page) {
  state.page = page;
  document.querySelectorAll(".page").forEach(function (el) {
    el.classList.toggle("hidden", el.id !== "page-" + page);
  });
  document.querySelectorAll(".nav-btn").forEach(function (el) {
    el.classList.toggle("active", el.dataset.nav === page);
  });
  $("mobile-menu").classList.add("hidden");
  if (page === "industry") saveVisit("section", "行业认知", "industry");
  if (page === "kaoyan") saveVisit("section", "考研专区", "kaoyan");
  if (page === "job") saveVisit("section", "就业专区", "job");
  if (page === "gong") saveVisit("section", "考公专区", "gong");
  if (page === "kaoyan") renderKaoyan();
  if (page === "job") renderJob();
  if (page === "gong") renderGong();
  window.scrollTo(0, 0);
}

function stars(n) {
  return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
}

function matchMajor(input) {
  var q = (input || "").trim().toLowerCase();
  var majors = Object.keys(DATA.majors);
  if (!q) return DATA.majors[majors[0]];
  for (var i = 0; i < majors.length; i++) {
    var name = majors[i];
    var item = DATA.majors[name];
    var aliases = [name].concat(item.aliases);
    if (aliases.some(function (x) { return x.toLowerCase().indexOf(q) >= 0 || q.indexOf(x.toLowerCase()) >= 0; })) {
      return item;
    }
  }
  return null;
}

function majorNameByData(target) {
  var names = Object.keys(DATA.majors);
  for (var i = 0; i < names.length; i++) {
    if (DATA.majors[names[i]] === target) return names[i];
  }
  return "";
}

function card(title, body, extra) {
  return '<article class="data-card"><h3 class="mb-2 text-lg font-black text-slate-950">' + title + '</h3>' + body + (extra || "") + "</article>";
}

function link(url, text) {
  return '<a class="link-btn" href="' + url + '" target="_blank" rel="noopener">' + text + '</a>';
}

function renderIndustries() {
  var q = ($("industry-search").value || "").trim();
  var list = DATA.industries.filter(function (it) {
    return !q || it.name.indexOf(q) >= 0 || it.detail.indexOf(q) >= 0;
  });
  $("industry-list").innerHTML = list.map(function (it) {
    var open = state.expandedIndustry === it.name;
    return '<button class="data-card text-left" data-industry="' + it.name + '">' +
      '<div class="flex items-start justify-between gap-3"><div><h3 class="text-xl font-black text-slate-950">' + it.name + '</h3><p class="mt-1 text-sm text-amber-500">' + stars(it.stars) + '</p></div><span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">' + it.salary + '</span></div>' +
      '<p class="mt-3 text-sm text-slate-600"><b>入门要求：</b>' + it.req + '</p>' +
      (open ? '<div class="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600">' + it.detail + '</div>' : '<p class="mt-4 text-sm font-semibold text-brand">点击展开详情</p>') +
    '</button>';
  }).join("");
}

function renderQuiz() {
  var box = $("quiz-card");
  if (state.qIndex >= ZHILU_QUESTIONS.length) {
    renderResult();
    return;
  }
  var q = ZHILU_QUESTIONS[state.qIndex];
  box.innerHTML = '<div class="mb-5 flex items-center justify-between text-sm text-slate-500"><span>第 ' + (state.qIndex + 1) + ' / ' + ZHILU_QUESTIONS.length + ' 题</span><span>' + q.dim + '</span></div>' +
    '<h2 class="mb-5 text-xl font-black leading-8 text-slate-950">' + q.q + '</h2>' +
    '<div class="grid gap-3">' + q.opts.map(function (o, i) {
      return '<label class="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand hover:bg-blue-50">' +
        '<input class="mt-1" type="radio" name="quiz-option" value="' + i + '">' +
        '<span><b class="text-brand">' + o.k + ".</b> " + o.t + '</span></label>';
    }).join("") + '</div>' +
    '<button id="next-question" class="mt-6 w-full rounded-xl bg-brand px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" disabled>' +
    (state.qIndex === ZHILU_QUESTIONS.length - 1 ? "提交测评" : "下一题") + '</button>';
}

function computeBaseScores() {
  var scores = { gong: 0, kaoyan: 0, job: 0, startup: 0 };
  state.answers.forEach(function (answerIndex, i) {
    var opt = ZHILU_QUESTIONS[i].opts[answerIndex];
    Object.keys(opt.s).forEach(function (k) {
      scores[k] += opt.s[k];
    });
  });
  return scores;
}

function applyVisitWeights(scores) {
  var weighted = Object.assign({}, scores);
  var history = getHistory();
  var used = {};
  history.forEach(function (h) {
    if (!h.track || used[h.track]) return;
    used[h.track] = true;
    var w = WEIGHT_BY_VISIT[h.track] || {};
    Object.keys(w).forEach(function (key) {
      weighted[key] = Math.round(weighted[key] * (1 + w[key]) * 10) / 10;
    });
  });
  return { weighted: weighted, used: used, history: history };
}

function renderResult() {
  var base = computeBaseScores();
  var adjusted = applyVisitWeights(base);
  var max = ZHILU_QUESTIONS.length * 3;
  var rows = Object.keys(adjusted.weighted).map(function (key) {
    return { key: key, pct: Math.min(100, Math.round(adjusted.weighted[key] / max * 100)), raw: adjusted.weighted[key] };
  }).sort(function (a, b) { return b.raw - a.raw; });
  var top = rows[0];
  var lastRelated = adjusted.history.find(function (h) { return h.track === top.key || (top.key === "job" && h.track === "industry"); });
  var reason = buildReason(top, adjusted.used, lastRelated);
  $("quiz-card").innerHTML = '<h2 class="mb-5 text-2xl font-black text-slate-950">你的方向适配度</h2>' +
    '<div class="grid gap-3">' + rows.map(function (r) {
      return '<div class="rounded-2xl bg-slate-50 p-4"><div class="mb-2 flex justify-between font-bold"><span>' + TRACKS[r.key] + '</span><span>' + r.pct + '%</span></div><div class="h-2 rounded-full bg-slate-200"><div class="h-2 rounded-full bg-brand" style="width:' + r.pct + '%"></div></div></div>';
    }).join("") + '</div>' +
    '<p class="mt-5 rounded-2xl bg-blue-50 p-4 leading-7 text-slate-700">' + reason + '</p>' +
    '<div class="mt-5 grid gap-3 sm:grid-cols-2"><button class="rounded-xl bg-brand px-5 py-3 font-semibold text-white" data-nav="' + top.key + '">' + '查看' + TRACKS[top.key] + '资源</button><button id="restart-quiz" class="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold">重新测评</button></div>';
}

function buildReason(top, used, visit) {
  var visitText = visit ? "你之前浏览过「" + visit.name + "」，系统已给相关方向加入 10% 行为权重。" : "你还没有明显的浏览偏好，本次主要依据答题结果推荐。";
  var map = {
    kaoyan: "结合你的学习投入、家庭经济支持和长期规划倾向，考研适配度是 " + top.pct + "%，很适合用学历和专业深度换更高平台。",
    gong: "结合你的稳定偏好、规则适应度和试错成本，考公适配度是 " + top.pct + "%，适合优先关注岗位表和行测申论计划。",
    job: "结合你的技能基础、收入需求和市场实践倾向，就业适配度是 " + top.pct + "%，适合尽快用项目、实习和简历打开机会。",
    startup: "结合你的自主性、资源整合和试错接受度，创业适配度是 " + top.pct + "%，适合先用比赛或小项目验证想法。"
  };
  return visitText + map[top.key];
}

function renderKaoyan() {
  var major = matchMajor($("kaoyan-search").value);
  if (!major) {
    $("kaoyan-content").innerHTML = emptyState("暂时没有匹配专业，先试试：计算机、汉语言文学、金融、教育学。");
    return;
  }
  var competitions = major.competitions || DATA.competitions;
  var resources = major.resources || [];
  if (state.page === "kaoyan") saveVisit("tool", "考研院校信息：" + majorNameByData(major), "kaoyan");
  $("kaoyan-content").innerHTML =
    '<div class="grid gap-4 lg:grid-cols-3">' +
    card("院校匹配工具", '<div class="mb-4 grid gap-3"><input class="field" placeholder="本科专业" value="' + majorNameByData(major) + '"><input class="field" placeholder="本科成绩，如前 30%"><input class="field" placeholder="英语水平，如四级/六级"></div>' + major.schools.map(function (s) { return '<div class="mb-3 rounded-2xl bg-slate-50 p-4"><b>' + s.name + '</b><p class="text-sm text-slate-600">报录比：' + s.ratio + '；往年分数线：' + s.line + '</p><p class="text-sm text-slate-500">' + s.note + '</p></div>'; }).join("")) +
    card("导师与课程", '<ul class="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">' + major.tutors.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>") +
    card("竞赛科研信息", competitions.map(function (c) { return '<div class="mb-3 rounded-2xl bg-slate-50 p-4"><b>' + c.name + '</b><p class="my-2 text-sm text-slate-600">' + c.desc + '</p>' + link(c.url, "官方入口") + '</div>'; }).join("")) +
    '</div><div class="mt-4 data-card"><h3 class="section-title">备考资料汇总</h3><div class="flex flex-wrap gap-2">' + link(DATA.links.yanzhao, "研招网") + link("https://yz.chsi.com.cn/kyzx/", "研招资讯") + link("https://yz.chsi.com.cn/zsml/", "硕士专业目录") + resources.map(function (r) { return link(r.url, r.name); }).join("") + '</div></div>';
}

function renderJob() {
  var major = matchMajor($("job-search").value);
  if (!major) {
    $("job-content").innerHTML = emptyState("暂时没有匹配专业，先试试：计算机、汉语言文学、金融、教育学。");
    return;
  }
  if (state.page === "job") saveVisit("tool", "就业岗位信息：" + majorNameByData(major), "job");
  $("job-content").innerHTML =
    '<div class="grid gap-4 lg:grid-cols-3">' +
    card("岗位匹配", major.jobs.map(function (j) { return '<div class="mb-3 rounded-2xl bg-slate-50 p-4"><b>' + j.name + '</b><p class="text-sm text-slate-600">薪资：' + j.salary + '</p><p class="text-sm text-slate-500">要求：' + j.req + '</p></div>'; }).join("")) +
    card("成长路线规划", '<ol class="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600">' + major.growth.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol>") +
    card("实习与比赛渠道", '<div class="flex flex-wrap gap-2">' + link(DATA.links.ncss, "国家大学生就业服务平台") + link(DATA.links.jobPlatform, "招聘会/实习") + link("https://cy.ncss.cn/", "创新大赛") + link("https://www.tiaozhanbei.net/", "挑战杯") + link(DATA.links.moeTeacher, "教师资格考试") + '</div>') +
    '</div><div class="mt-4 data-card"><h3 class="section-title">简历面试技巧</h3><p class="mb-3 text-slate-600">简历优先写结果和数据：项目目标、你负责什么、用了什么方法、带来什么结果。面试准备 STAR：情境、任务、行动、结果。</p>' + link(DATA.links.resume, "就业指导与简历资源") + '</div>';
}

function renderGong() {
  var major = matchMajor($("gong-search").value);
  if (!major) {
    $("gong-content").innerHTML = emptyState("暂时没有匹配专业，先试试：计算机、汉语言文学、金融、教育学。");
    return;
  }
  if (state.page === "gong") saveVisit("tool", "考公岗位信息：" + majorNameByData(major), "gong");
  $("gong-content").innerHTML =
    '<div class="grid gap-4 lg:grid-cols-3">' +
    card("岗位匹配", major.gongPosts.map(function (p) { return '<div class="mb-3 rounded-2xl bg-slate-50 p-4"><b>' + p.name + '</b><p class="text-sm text-slate-600">报考条件：' + p.req + '</p><p class="text-sm text-slate-500">往年进面分数：' + p.score + '</p></div>'; }).join("")) +
    card("公务员类型介绍", DATA.civilTypes.map(function (x) { return '<div class="mb-3"><b>' + x.name + '</b><p class="text-sm leading-6 text-slate-600">' + x.desc + '</p></div>'; }).join("")) +
    card("考试信息汇总", DATA.exams.map(function (e) { return '<div class="mb-3 rounded-2xl bg-slate-50 p-4"><b>' + e.name + '</b><p class="text-sm text-slate-600">' + e.time + '</p><p class="mb-2 text-xs text-slate-500">' + e.note + '</p>' + link(e.link, "公告入口") + '</div>'; }).join("")) +
    '</div><div class="mt-4 data-card"><h3 class="section-title">备考资料</h3><p class="mb-3 text-slate-600">行测先分模块刷题，资料分析和判断推理适合先提分；申论要训练材料归纳、公文格式和大作文结构。</p><div class="flex flex-wrap gap-2">' + link(DATA.links.scs2025, "2025 国考专题") + link(DATA.links.scs, "国家公务员局") + '</div></div>';
}

function emptyState(text) {
  return '<div class="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">' + text + '</div>';
}

function bindEvents() {
  document.querySelectorAll("[data-nav]").forEach(function (el) {
    el.addEventListener("click", function () {
      var page = el.dataset.nav === "startup" ? "industry" : el.dataset.nav;
      route(page);
    });
  });
  $("mobile-menu-btn").addEventListener("click", function () {
    $("mobile-menu").classList.toggle("hidden");
  });
  $("industry-search").addEventListener("input", renderIndustries);
  $("industry-list").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-industry]");
    if (!btn) return;
    state.expandedIndustry = state.expandedIndustry === btn.dataset.industry ? null : btn.dataset.industry;
    var item = DATA.industries.find(function (x) { return x.name === btn.dataset.industry; });
    if (item) saveVisit("industry", item.name, item.track);
    renderIndustries();
  });
  $("quiz-card").addEventListener("change", function (e) {
    if (e.target.name === "quiz-option") $("next-question").disabled = false;
  });
  $("quiz-card").addEventListener("click", function (e) {
    if (e.target.id === "next-question") {
      var checked = document.querySelector('input[name="quiz-option"]:checked');
      if (!checked) return;
      state.answers[state.qIndex] = parseInt(checked.value, 10);
      state.qIndex += 1;
      renderQuiz();
    }
    if (e.target.id === "restart-quiz") {
      state.qIndex = 0;
      state.answers = [];
      renderQuiz();
    }
  });
  $("kaoyan-search").addEventListener("input", renderKaoyan);
  $("job-search").addEventListener("input", renderJob);
  $("gong-search").addEventListener("input", renderGong);
}

function buildExpandedData2025() {
  var links = {
    yanzhao: "https://yz.chsi.com.cn/",
    yanzhaoNews: "https://yz.chsi.com.cn/kyzx/",
    yanzhaoMajor: "https://yz.chsi.com.cn/zsml/",
    ncss: "https://www.ncss.cn/",
    jobPlatform: "https://www.ncss.cn/student/jobfair/index.html",
    resume: "https://www.ncss.cn/student/",
    scs2025: "http://bm.scs.gov.cn/kl2025",
    scs: "https://www.scs.gov.cn/",
    moeTeacher: "https://ntce.neea.edu.cn/",
    tiaozhanbei: "https://www.tiaozhanbei.net/",
    innovation: "https://cy.ncss.cn/",
    mcm: "https://www.mcm.edu.cn/",
    cpa: "https://cpaexam.cicpa.org.cn/",
    bar: "https://www.moj.gov.cn/",
    cet: "https://cet.neea.edu.cn/",
    neea: "https://www.neea.edu.cn/",
    mohrss: "https://www.mohrss.gov.cn/",
    cac: "https://www.cac.gov.cn/",
    miit: "https://www.miit.gov.cn/"
  };

  function industry(name, stars, salary, req, detail, track) {
    return { name: name, stars: stars, salary: salary, req: req, detail: detail, track: track || "job" };
  }

  function comp(name, desc, url) {
    return { name: name, desc: desc, url: url };
  }

  var commonComps = [
    comp("挑战杯", "适合科研、社会实践、创新作品积累，很多学校认定为综合素质和推免/复试展示材料。", links.tiaozhanbei),
    comp("中国国际大学生创新大赛", "原互联网+，适合创新创业、技术转化、商业计划书和团队项目。", links.innovation),
    comp("全国大学生数学建模竞赛", "适合理工、金融、数据分析、工程优化等方向，能体现建模和协作能力。", links.mcm)
  ];

  function makeSchool(name, ratio, line, note) {
    return { name: name, ratio: ratio, line: line, note: note };
  }

  function job(name, salary, req) {
    return { name: name, salary: salary, req: req };
  }

  function post(name, req, score) {
    return { name: name, req: req, score: score };
  }

  function major(cfg) {
    cfg.resources = cfg.resources || [
      { name: "研招网", url: links.yanzhao },
      { name: "硕士专业目录", url: links.yanzhaoMajor },
      { name: "研招资讯", url: links.yanzhaoNews }
    ];
    cfg.competitions = cfg.competitions || commonComps;
    return cfg;
  }

  function growth(items) {
    return items.concat([
      '实习投递：<a class="text-brand font-semibold" target="_blank" rel="noopener" href="' + links.ncss + '">国家大学生就业服务平台</a>',
      '简历面试：<a class="text-brand font-semibold" target="_blank" rel="noopener" href="' + links.resume + '">就业指导与简历资源</a>'
    ]);
  }

  var industries = [
    industry("互联网", 4, "8k-18k/月", "编程、产品、运营、数据分析基础；项目或实习经历加分", "岗位包括开发、算法、产品、运营、设计、数据。未来 5 年 AI 应用、出海 SaaS、产业互联网仍有结构性机会，但通用运营和初级开发竞争加剧。适合学习快、能做项目、愿意持续迭代技能的学生。"),
    industry("金融", 4, "7k-16k/月", "金融、会计、数学、数据分析基础；证书和实习加分", "岗位包括银行管培、券商研究、投行、风控、财富管理、量化助理。财富管理、金融科技和合规风控需求稳定。适合数理能力、表达能力、抗压能力都较好的学生。"),
    industry("教育", 4, "5k-12k/月", "教师资格证、学科基础、表达能力和试讲能力", "岗位包括中小学教师、教研、课程产品、教育运营。职业教育、教育数字化和素质教育仍有机会。适合有耐心、表达清楚、愿意长期陪伴学生成长的人。"),
    industry("医疗", 5, "6k-15k/月", "医学、药学、护理、生物相关背景；执业资格重要", "岗位包括医生、护士、药企研发、临床协调、器械销售、健康管理。老龄化和创新药械带来长期需求。适合专业门槛高、学习周期长但追求稳定价值的学生。", "kaoyan"),
    industry("制造业", 4, "6k-13k/月", "机械、自动化、材料、工业工程基础；能接受一线", "岗位包括工艺、设备、质量、供应链、智能制造工程师。高端制造、工业软件和机器人会持续升级。适合动手能力强、愿意理解真实生产的学生。"),
    industry("新能源", 5, "8k-18k/月", "电气、材料、化学、能源、车辆基础", "岗位包括储能、电池、光伏、风电、电力系统、测试工程师。新能源车、储能和新型电力系统仍是高景气方向。适合理工科、能接受项目制和技术迭代的学生。"),
    industry("文化传媒", 3, "5k-12k/月", "内容能力、审美、剪辑、策划或运营作品", "岗位包括新媒体运营、编导、品牌策划、短视频、商务。内容产业仍有机会，但平台规则变化快，作品和执行力更重要。适合表达欲强、审美好、能持续产出的学生。"),
    industry("咨询", 4, "9k-20k/月", "商科/理工复合背景，逻辑表达和案例分析能力", "岗位包括战略咨询、管理咨询、财务咨询、IT 咨询。企业数字化、组织效率和出海会带来项目需求。适合逻辑强、沟通强、能承受高强度项目节奏的学生。"),
    industry("房地产", 2, "5k-11k/月", "土木、建筑、营销、财务基础；抗压能力", "岗位包括工程管理、成本招采、物业运营、资产管理。行业从高增长转向存量运营、保障房、城市更新和资产管理。适合愿意扎实做项目、关注城市空间的学生。"),
    industry("公务员", 4, "5k-12k/月", "专业匹配、行测申论、政策理解和公文表达", "岗位包括中央机关、税务、海关、统计、公安、选调生、事业单位。公共服务、基层治理和数字政务持续需要人才。适合追求稳定、规则感强、愿意服务公共事务的学生。", "gong"),
    industry("半导体", 5, "9k-20k/月", "电子、微电子、材料、物理、自动化基础", "岗位包括芯片设计、验证、工艺、设备、封测、EDA。国产替代、先进封装、汽车芯片需求长期存在。适合数理基础强、能接受长周期研发和工程细节的学生。"),
    industry("生物医药", 5, "7k-16k/月", "生物、药学、医学、化学基础；实验和合规意识", "岗位包括药物研发、临床试验、注册、医学事务、生产质量。创新药、细胞基因治疗和器械仍是重点。适合愿意深造、实验能力强、耐心细致的学生。", "kaoyan"),
    industry("新能源汽车", 5, "8k-18k/月", "车辆、电气、自动化、材料、软件基础", "岗位包括三电系统、智能座舱、自动驾驶测试、供应链、质量。智能化和电动化继续推进，竞争从整车扩展到软件和供应链。适合工程实践强、愿意跨学科学习的学生。"),
    industry("人工智能", 5, "12k-25k/月", "数学、编程、机器学习、数据处理能力", "岗位包括算法工程师、数据科学家、AI 产品、模型应用工程师。大模型应用、行业智能化和智能硬件是热点。适合数学基础好、项目能力强、愿意持续学习的学生。"),
    industry("广告营销", 3, "5k-12k/月", "创意、文案、数据分析、品牌策划或投放能力", "岗位包括品牌策划、媒介投放、用户增长、内容营销、客户执行。数字营销和效果广告仍有需求，但更看重数据和复盘。适合表达力强、对消费和内容敏感的学生。"),
    industry("物流供应链", 4, "6k-14k/月", "供应链、数据、英语、流程优化能力", "岗位包括供应链计划、采购、仓配、国际物流、跨境电商运营。制造出海、即时零售和跨境贸易推动需求。适合逻辑清晰、执行力强、能协调多方的学生。"),
    industry("建筑设计", 3, "5k-12k/月", "建筑、规划、景观、软件制图和作品集", "岗位包括建筑设计、规划设计、景观、BIM、城市更新。新增开发放缓，但城市更新、公共建筑和存量改造仍有机会。适合审美和空间理解强、能长期打磨作品的学生。"),
    industry("化工", 4, "6k-14k/月", "化学、化工、安全环保、实验与工艺基础", "岗位包括工艺工程师、研发、生产技术、安全环保、质量。新材料、精细化工和绿色化工是重点方向。适合实验能力强、重视安全和工程细节的学生。"),
    industry("农业", 3, "5k-11k/月", "农学、生物、食品、机械或数字农业基础", "岗位包括种业、植保、食品研发、农业科技、乡村运营。种业振兴、智慧农业和食品安全带来机会。适合愿意下沉一线、关注长期价值的学生。"),
    industry("环保", 4, "5k-12k/月", "环境工程、化学、数据监测、政策理解", "岗位包括环评、污水处理、固废、碳管理、ESG 咨询。双碳、环保合规和绿色供应链推动需求。适合责任感强、能做现场和数据分析的学生。"),
    industry("法律", 4, "6k-15k/月", "法学基础、法考、检索写作和沟通能力", "岗位包括律师助理、法务、合规、知识产权、公检法相关岗位。合规、数据安全、知识产权和涉外业务增长。适合逻辑严谨、表达稳、抗压能力强的学生。", "gong"),
    industry("会计审计", 4, "6k-13k/月", "会计、审计、税法、Excel；CPA/初会加分", "岗位包括审计、税务、财务分析、内控、共享财务。监管合规和企业精细化管理使需求稳定。适合细致、规则感强、能接受忙季强度的学生。"),
    industry("广告传媒", 3, "5k-12k/月", "文案、视频、投放、账号运营和内容作品", "岗位包括广告执行、媒介、内容编导、直播策划、商务。品牌内容化和短视频营销仍活跃。适合创意强、节奏快、愿意用作品说话的学生。"),
    industry("游戏", 4, "8k-18k/月", "编程、美术、策划、数值、引擎或作品集", "岗位包括客户端、服务端、游戏策划、技术美术、运营。精品化、出海和小游戏带来机会，版号和周期也带来不确定性。适合热爱游戏、作品能力强的学生。"),
    industry("电商", 4, "6k-15k/月", "运营、数据分析、供应链、内容和客服管理", "岗位包括平台运营、商品运营、用户增长、店铺运营、数据分析。即时零售、跨境电商和内容电商继续增长。适合执行力强、对数据和消费敏感的学生。"),
    industry("直播电商", 4, "6k-16k/月", "内容策划、主播运营、投流、选品和复盘能力", "岗位包括主播运营、直播中控、投流、选品、供应链。行业进入精细化运营阶段，合规和供应链能力更重要。适合反应快、能抗压、愿意复盘数据的学生。"),
    industry("保险", 3, "5k-12k/月", "金融基础、销售服务、精算/风控或合规能力", "岗位包括管培、核保核赔、精算、保险科技、渠道运营。养老、健康险和保险科技仍有空间。适合沟通强、服务意识好或数理能力强的学生。"),
    industry("证券", 4, "8k-18k/月", "金融、财务、估值、研究写作和从业资格", "岗位包括投研、财富管理、机构销售、合规风控。资本市场改革和居民财富管理带来机会。适合财务分析强、抗压强、表达清楚的学生。"),
    industry("基金", 4, "8k-20k/月", "金融、会计、数学、数据分析和投研能力", "岗位包括行业研究、基金运营、渠道、风控、量化助理。公募、私募和指数化投资持续发展。适合长期学习、对市场敏感、能独立研究的学生。"),
    industry("租赁", 3, "5k-12k/月", "金融、风控、资产管理、合同和客户服务能力", "岗位包括融资租赁、汽车租赁、设备租赁、资产运营、风控。产业设备更新和消费租赁带来细分机会。适合金融+产业理解强、细致稳健的学生。")
  ];

  var majors = {
    "计算机科学与技术": major({
      aliases: ["计算机", "软件工程", "人工智能", "数据科学"],
      schools: [makeSchool("北京邮电大学", "约 6:1-10:1", "2025 复试线参考：330-360+", "通信、计算机认可度高"), makeSchool("华中科技大学", "约 5:1-9:1", "2025 复试线参考：340-370+", "工科平台强"), makeSchool("南京大学", "约 8:1-15:1", "2025 复试线参考：350-380+", "计算机学科实力强")],
      tutors: ["AI、系统、软件工程方向重视论文、项目和数学基础。", "核心课程：算法、操作系统、数据库、计算机网络、机器学习。"],
      competitions: [commonComps[1], commonComps[2], comp("中国大学生程序设计竞赛", "适合算法和工程能力展示。", "https://ccpc.io/")],
      jobs: [job("后端开发工程师", "10k-22k/月", "Java/Go/Python、数据库、项目经验"), job("算法/AI 应用工程师", "12k-25k/月", "机器学习、深度学习、工程落地"), job("数据分析师", "8k-18k/月", "SQL、Python、统计分析")],
      growth: growth(["做 2 个可部署项目并写清技术文档。", "刷算法、数据库、操作系统，参加程序设计/创新大赛。"]),
      gongPosts: [post("税务局信息化岗", "计算机类，本科及以上", "往年进面常见 125-145+"), post("公安网络安全岗", "计算机类，部分岗位需体测政审", "往年进面常见 120-140+")]
    }),
    "临床医学": major({
      aliases: ["医学", "临床", "内科学", "外科学"],
      schools: [makeSchool("北京协和医学院", "约 6:1-12:1", "2025 复试线参考：330-360+", "医学顶尖平台"), makeSchool("复旦大学上海医学院", "约 5:1-10:1", "2025 复试线参考：330-365+", "临床资源强"), makeSchool("四川大学华西医学中心", "约 5:1-9:1", "2025 复试线参考：325-360+", "西部医学高地")],
      tutors: ["内外妇儿、影像、麻醉等方向重视规培规划和临床科研。", "核心准备：西医综合、英语、复试病历分析和专业问答。"],
      competitions: [comp("全国大学生基础医学创新研究暨实验设计论坛", "适合医学科研训练和实验设计展示。", links.neea), commonComps[0]],
      jobs: [job("住院医师/规培医师", "6k-12k/月", "执业医师路径、规培、临床能力"), job("临床研究协调员", "6k-11k/月", "GCP、临床试验流程"), job("医学事务专员", "8k-15k/月", "医学文献、沟通、合规")],
      growth: growth(["明确专硕/学硕与规培路径。", "积累临床见习、病例汇报和科研训练。"]),
      gongPosts: [post("卫健委综合管理岗", "医学类，本科/硕士", "往年进面常见 120-140+"), post("公立医院事业编岗位", "临床医学、执业资格或规培要求", "以地方公告和综合成绩为准")]
    }),
    "法学": major({
      aliases: ["法律", "民商法", "刑法", "国际法"],
      schools: [makeSchool("中国政法大学", "约 8:1-16:1", "2025 复试线参考：350-380+", "法学平台强"), makeSchool("西南政法大学", "约 6:1-12:1", "2025 复试线参考：340-370+", "政法传统强校"), makeSchool("华东政法大学", "约 7:1-14:1", "2025 复试线参考：345-375+", "区位与实务资源好")],
      tutors: ["民商、刑法、诉讼、国际法方向重视案例分析和论文写作。", "核心课程：法理、宪法、民法、刑法、诉讼法。"],
      competitions: [comp("国家统一法律职业资格考试", "法学生就业和公检法路径的重要资格。", links.bar), commonComps[0]],
      jobs: [job("律师助理", "6k-12k/月", "法考、检索、文书写作"), job("企业法务", "7k-15k/月", "合同、合规、沟通"), job("合规专员", "7k-14k/月", "数据合规、金融合规、风控")],
      growth: growth(['准备法考：<a class="text-brand font-semibold" target="_blank" rel="noopener" href="' + links.bar + '">司法部入口</a>', "积累律所、法院、企业法务实习。"]),
      gongPosts: [post("法院/检察院司法行政岗", "法学类，常要求法考证书", "往年进面常见 125-145+"), post("市场监管/司法局执法岗", "法学类，本科及以上", "往年进面常见 120-140+")]
    }),
    "金融": major({
      aliases: ["金融学", "经济学", "投资学"],
      schools: [makeSchool("中央财经大学", "约 8:1-15:1", "2025 复试线参考：365-395+", "财经平台强"), makeSchool("上海财经大学", "约 10:1-18:1", "2025 复试线参考：370-405+", "区位优势明显"), makeSchool("西南财经大学", "约 6:1-12:1", "2025 复试线参考：355-390+", "金融校友资源好")],
      tutors: ["公司金融、金融工程、资产定价重视数学和计量。", "核心课程：投资学、公司理财、计量经济学、金融市场。"],
      competitions: [commonComps[2], comp("CFA Institute Research Challenge", "适合投研、估值和英文展示。", "https://www.cfainstitute.org/"), commonComps[1]],
      jobs: [job("银行管培生", "7k-14k/月", "金融基础、网申笔试、沟通"), job("证券研究助理", "8k-18k/月", "财务分析、行业研究"), job("风控/合规助理", "7k-15k/月", "金融法规、数据分析")],
      growth: growth(['准备 CPA/CFA/基金从业等证书，CPA 报名入口：<a class="text-brand font-semibold" target="_blank" rel="noopener" href="' + links.cpa + '">中注协</a>', "做行业研究报告和财务建模。"]),
      gongPosts: [post("税务局财税岗", "财政、金融、会计等相关专业", "往年进面常见 125-145+"), post("金融监管相关岗位", "经济金融类，部分要求硕士", "往年进面常见 130-150+")]
    }),
    "教育学": major({
      aliases: ["师范", "小学教育", "学前教育", "教育技术"],
      schools: [makeSchool("北京师范大学", "约 8:1-16:1", "2025 复试线参考：350-380+", "教育学顶尖平台"), makeSchool("华东师范大学", "约 6:1-12:1", "2025 复试线参考：345-375+", "师范资源强"), makeSchool("华中师范大学", "约 5:1-10:1", "2025 复试线参考：340-370+", "就业认可度高")],
      tutors: ["课程与教学论、教育心理、教育技术方向重视研究设计。", "核心课程：教育学原理、教育心理学、中外教育史。"],
      competitions: [commonComps[0], comp("全国教师资格考试", "师范生就业和教招的重要资格。", links.moeTeacher)],
      jobs: [job("中小学教师", "5k-11k/月", "教师资格证、试讲、学科基础"), job("教研/课程设计", "6k-12k/月", "教学设计、课程开发"), job("教育运营", "5k-10k/月", "活动组织、用户运营")],
      growth: growth(['考教师资格证：<a class="text-brand font-semibold" target="_blank" rel="noopener" href="' + links.moeTeacher + '">NTCE 官方入口</a>', "参加教育实习和公开课训练。"]),
      gongPosts: [post("教育局综合管理岗", "教育学类，本科及以上", "往年进面常见 125-140+"), post("事业单位教师岗", "教师资格证，专业对口", "以地方公告为准")]
    }),
    "汉语言文学": major({
      aliases: ["中文", "汉语言", "文秘", "新闻传播"],
      schools: [makeSchool("北京师范大学", "约 8:1-15:1", "2025 复试线参考：365-390+", "中文与师范强"), makeSchool("南京大学", "约 7:1-14:1", "2025 复试线参考：365-395+", "文科平台强"), makeSchool("暨南大学", "约 5:1-10:1", "2025 复试线参考：355-380+", "华南资源好")],
      tutors: ["古代文学、现当代文学、语言学重视阅读量和文本分析。", "核心课程：中国文学史、文学理论、语言学概论。"],
      competitions: [commonComps[0], comp("全国大学生广告艺术大赛", "适合文案、策划、传播作品展示。", "https://www.sun-ada.net/")],
      jobs: [job("语文教师", "6k-12k/月", "教师资格证、普通话、试讲"), job("新媒体编辑", "5k-10k/月", "写作、选题、排版"), job("行政文秘", "5k-9k/月", "公文写作、办公软件")],
      growth: growth(["积累公众号、短视频文案、论文或评论作品。", '考教师资格证：<a class="text-brand font-semibold" target="_blank" rel="noopener" href="' + links.moeTeacher + '">官方入口</a>']),
      gongPosts: [post("机关综合文字岗", "中国语言文学类，本科及以上", "往年进面常见 130-145+"), post("宣传部门岗位", "中文、新闻传播相关", "往年进面常见 125-140+")]
    }),
    "英语": major({
      aliases: ["英语语言文学", "翻译", "商务英语"],
      schools: [makeSchool("北京外国语大学", "约 7:1-14:1", "2025 复试线参考：365-390+", "外语强校"), makeSchool("上海外国语大学", "约 7:1-13:1", "2025 复试线参考：365-390+", "区位和外语资源好"), makeSchool("广东外语外贸大学", "约 5:1-10:1", "2025 复试线参考：355-380+", "外贸与翻译资源好")],
      tutors: ["翻译、语言学、文学和国别研究方向重视英语基础和研究兴趣。", "核心课程：语言学、翻译理论、英美文学、二外。"],
      competitions: [comp("全国大学英语四、六级考试", "英语专业也可用作基础能力证明。", links.cet), commonComps[0]],
      jobs: [job("外贸业务员", "6k-13k/月", "英语沟通、客户开发、外贸流程"), job("英语教师", "5k-12k/月", "教师资格证、口语、试讲"), job("翻译/本地化", "6k-14k/月", "笔译、术语管理、CAT 工具")],
      growth: growth(["准备专四专八、CATTI 或教师资格证。", "积累翻译作品、外贸实习或英文运营项目。"]),
      gongPosts: [post("海关/外事外语岗", "英语相关专业，部分要求专八", "往年进面常见 125-145+"), post("综合文字/翻译岗", "英语、翻译类，本科及以上", "往年进面常见 125-140+")]
    }),
    "会计学": major({
      aliases: ["会计", "审计", "财务会计"],
      schools: [makeSchool("厦门大学", "约 7:1-14:1", "2025 复试线参考：240-260+（会计专硕）", "会计传统强校"), makeSchool("上海财经大学", "约 10:1-18:1", "2025 复试线参考：240-265+（会计专硕）", "财经平台强"), makeSchool("中央财经大学", "约 8:1-15:1", "2025 复试线参考：240-260+（会计专硕）", "区位和平台好")],
      tutors: ["财务会计、审计、税务、管理会计方向重视准则和案例。", "核心课程：财务会计、审计、财管、税法。"],
      competitions: [comp("注册会计师全国统一考试", "财会审计就业关键证书。", links.cpa), commonComps[2]],
      jobs: [job("审计助理", "6k-12k/月", "会计准则、Excel、抗压"), job("财务分析", "7k-14k/月", "预算、报表、经营分析"), job("税务助理", "6k-12k/月", "税法、申报、沟通")],
      growth: growth(['准备 CPA/初级会计，CPA 入口：<a class="text-brand font-semibold" target="_blank" rel="noopener" href="' + links.cpa + '">中注协</a>', "找事务所、企业财务、税务实习。"]),
      gongPosts: [post("税务局财会岗", "会计学、审计学、财务管理", "往年进面常见 125-145+"), post("审计机关岗位", "会计审计类，部分要求证书", "往年进面常见 125-145+")]
    }),
    "电气工程": major({
      aliases: ["电气", "电力系统", "自动化"],
      schools: [makeSchool("华北电力大学", "约 5:1-10:1", "2025 复试线参考：320-360+", "电力系统特色强"), makeSchool("西安交通大学", "约 6:1-12:1", "2025 复试线参考：340-370+", "电气强校"), makeSchool("重庆大学", "约 4:1-9:1", "2025 复试线参考：320-355+", "电气工程实力强")],
      tutors: ["电力系统、电机电器、电力电子、新能源并网方向。", "核心课程：电路、电机、电力系统分析、继电保护。"],
      competitions: [commonComps[2], comp("全国大学生电子设计竞赛", "适合电气电子工程实践展示。", links.neea)],
      jobs: [job("电气工程师", "7k-15k/月", "电力系统、电气设计"), job("电力运维/调度", "6k-13k/月", "电网知识、倒班适应"), job("新能源电气工程师", "8k-16k/月", "储能、光伏、并网")],
      growth: growth(["学习电力系统和新能源并网项目。", "关注电网、发电集团、新能源企业校招。"]),
      gongPosts: [post("能源监管/工信相关岗位", "电气工程类，本科及以上", "往年进面常见 120-140+"), post("事业单位设备管理岗", "电气、自动化相关", "以地方公告为准")]
    }),
    "土木工程": major({
      aliases: ["土木", "结构工程", "岩土", "工程管理"],
      schools: [makeSchool("同济大学", "约 6:1-12:1", "2025 复试线参考：320-360+", "土木建筑强校"), makeSchool("东南大学", "约 5:1-10:1", "2025 复试线参考：315-350+", "建筑土木平台强"), makeSchool("哈尔滨工业大学", "约 4:1-9:1", "2025 复试线参考：310-350+", "工科基础扎实")],
      tutors: ["结构、岩土、桥梁、智能建造方向重视力学和工程实践。", "核心课程：结构力学、混凝土、钢结构、施工组织。"],
      competitions: [commonComps[2], comp("全国大学生结构设计竞赛", "适合结构设计和工程实践能力展示。", links.neea)],
      jobs: [job("结构设计助理", "6k-12k/月", "力学、规范、CAD/PKPM"), job("施工管理", "6k-11k/月", "现场协调、进度质量"), job("BIM 工程师", "6k-13k/月", "Revit、建模、协同")],
      growth: growth(["准备作品集和工程软件能力。", "关注设计院、施工单位、城投平台实习。"]),
      gongPosts: [post("住建局工程管理岗", "土木、建筑、工程管理", "往年进面常见 120-140+"), post("自然资源/交通事业单位", "土木工程类", "以地方公告为准")]
    }),
    "软件工程": major({
      aliases: ["软工", "软件", "计算机"],
      schools: [makeSchool("北京航空航天大学", "约 6:1-12:1", "2025 复试线参考：335-370+", "软件和计算机强"), makeSchool("电子科技大学", "约 5:1-10:1", "2025 复试线参考：330-365+", "电子信息平台强"), makeSchool("大连理工大学", "约 4:1-8:1", "2025 复试线参考：320-355+", "工科性价比高")],
      tutors: ["软件工程、系统架构、云计算、大数据方向重视工程项目。", "核心课程：软件工程、数据库、操作系统、分布式系统。"],
      competitions: [commonComps[1], commonComps[2], comp("中国大学生程序设计竞赛", "适合算法和工程能力展示。", "https://ccpc.io/")],
      jobs: [job("软件开发工程师", "10k-22k/月", "工程能力、代码质量"), job("前端工程师", "8k-18k/月", "JS/框架/交互"), job("DevOps 工程师", "9k-18k/月", "Linux、云、CI/CD")],
      growth: growth(["做开源项目或完整产品 Demo。", "训练代码质量、测试、部署和协作流程。"]),
      gongPosts: [post("信息中心技术岗", "软件工程、计算机类", "往年进面常见 125-145+"), post("政务数据管理岗", "计算机/软件/数据相关", "往年进面常见 120-140+")]
    }),
    "市场营销": major({
      aliases: ["营销", "工商管理", "品牌管理"],
      schools: [makeSchool("中国人民大学", "约 6:1-12:1", "2025 复试线参考：355-380+", "商科平台强"), makeSchool("中山大学", "约 5:1-10:1", "2025 复试线参考：345-370+", "管理学实力强"), makeSchool("对外经济贸易大学", "约 5:1-10:1", "2025 复试线参考：345-375+", "商科就业好")],
      tutors: ["消费者行为、品牌管理、数字营销方向重视案例和数据。", "核心课程：市场调研、消费者行为、品牌管理、数据营销。"],
      competitions: [comp("全国大学生广告艺术大赛", "适合品牌策划和创意作品展示。", "https://www.sun-ada.net/"), commonComps[1]],
      jobs: [job("品牌策划", "6k-13k/月", "洞察、文案、提案"), job("用户运营", "6k-14k/月", "活动、社群、数据"), job("广告投放", "7k-15k/月", "投流、素材、复盘")],
      growth: growth(["做品牌策划案和数据复盘作品。", "找快消、互联网、电商、广告公司实习。"]),
      gongPosts: [post("市场监管综合岗", "工商管理、市场营销等", "往年进面常见 125-140+"), post("商务部门综合岗", "管理类、经济类", "往年进面常见 120-140+")]
    }),
    "财务管理": major({
      aliases: ["财管", "会计", "公司财务"],
      schools: [makeSchool("西南财经大学", "约 6:1-12:1", "2025 复试线参考：350-380+", "财经特色强"), makeSchool("中南财经政法大学", "约 5:1-10:1", "2025 复试线参考：345-375+", "财会法融合"), makeSchool("东北财经大学", "约 4:1-9:1", "2025 复试线参考：340-370+", "财经性价比高")],
      tutors: ["公司财务、资本预算、管理会计方向重视案例和数据。", "核心课程：财务管理、会计、审计、税法。"],
      competitions: [comp("注册会计师全国统一考试", "财务管理就业关键证书。", links.cpa), commonComps[2]],
      jobs: [job("财务专员", "6k-12k/月", "会计、报表、Excel"), job("经营分析", "7k-15k/月", "预算、BI、业务理解"), job("资金管理助理", "7k-14k/月", "现金流、融资、风险")],
      growth: growth(['准备 CPA/初会：<a class="text-brand font-semibold" target="_blank" rel="noopener" href="' + links.cpa + '">CPA 报名入口</a>', "做财务模型和经营分析案例。"]),
      gongPosts: [post("财政局/税务局岗位", "财务管理、会计、财政类", "往年进面常见 125-145+"), post("审计与国资监管岗", "财会审计类", "往年进面常见 125-145+")]
    }),
    "机械工程": major({
      aliases: ["机械", "机电", "智能制造"],
      schools: [makeSchool("西安交通大学", "约 5:1-10:1", "2025 复试线参考：320-360+", "机械强校"), makeSchool("哈尔滨工业大学", "约 5:1-10:1", "2025 复试线参考：320-360+", "工程平台强"), makeSchool("华中科技大学", "约 5:1-10:1", "2025 复试线参考：325-365+", "制造方向强")],
      tutors: ["机器人、智能制造、机械设计、车辆工程方向。", "核心课程：机械设计、控制、材料力学、制造工艺。"],
      competitions: [comp("全国大学生机械创新设计大赛", "适合机械设计和工程实践展示。", links.neea), commonComps[1]],
      jobs: [job("机械设计工程师", "7k-14k/月", "CAD/CAE、结构设计"), job("工艺工程师", "6k-13k/月", "生产工艺、质量改善"), job("机器人工程师", "8k-16k/月", "控制、机构、调试")],
      growth: growth(["做机械设计作品和工程图纸集。", "关注制造业、新能源车、机器人企业实习。"]),
      gongPosts: [post("市场监管特种设备岗", "机械类，本科及以上", "往年进面常见 120-140+"), post("工信/质检事业单位", "机械工程类", "以地方公告为准")]
    }),
    "化学工程": major({
      aliases: ["化工", "化学", "应用化学"],
      schools: [makeSchool("天津大学", "约 5:1-10:1", "2025 复试线参考：320-360+", "化工强校"), makeSchool("华东理工大学", "约 5:1-10:1", "2025 复试线参考：315-355+", "化工就业资源好"), makeSchool("北京化工大学", "约 4:1-8:1", "2025 复试线参考：310-350+", "化工特色鲜明")],
      tutors: ["反应工程、分离工程、材料化工、绿色化工方向。", "核心课程：化工原理、反应工程、物化、有机化学。"],
      competitions: [commonComps[0], comp("全国大学生化工设计竞赛", "适合化工流程设计和团队协作展示。", links.neea)],
      jobs: [job("化工工艺工程师", "7k-14k/月", "流程、设备、安全"), job("研发助理", "7k-15k/月", "实验、分析、记录"), job("EHS 工程师", "7k-14k/月", "安全环保、法规")],
      growth: growth(["强化实验记录、工艺模拟和安全规范。", "关注新材料、精细化工、能源化工实习。"]),
      gongPosts: [post("生态环境执法/监测岗", "化学、化工、环境类", "往年进面常见 120-140+"), post("应急管理相关岗位", "化工安全相关", "往年进面常见 120-140+")]
    }),
    "生物医学工程": major({
      aliases: ["生医工", "医疗器械", "生物工程"],
      schools: [makeSchool("东南大学", "约 5:1-10:1", "2025 复试线参考：320-360+", "生医工实力强"), makeSchool("上海交通大学", "约 6:1-12:1", "2025 复试线参考：335-370+", "医工交叉平台强"), makeSchool("浙江大学", "约 6:1-12:1", "2025 复试线参考：330-365+", "交叉学科资源好")],
      tutors: ["医学影像、医疗器械、生物材料、神经工程方向。", "核心课程：生物医学信号、医学成像、传感器、生物材料。"],
      competitions: [commonComps[1], commonComps[2], commonComps[0]],
      jobs: [job("医疗器械研发", "8k-16k/月", "电子/机械/法规"), job("医学影像算法助理", "10k-20k/月", "图像处理、AI"), job("注册/质量工程师", "7k-14k/月", "医疗器械法规、质量体系")],
      growth: growth(["做医疗器械或医学影像项目。", "了解 NMPA 注册、质量体系和临床需求。"]),
      gongPosts: [post("药监/市场监管医疗器械岗", "生物医学工程、医疗器械相关", "往年进面常见 120-140+"), post("卫健委信息/设备岗", "医工交叉专业", "以地方公告为准")]
    }),
    "药学": major({
      aliases: ["药物制剂", "药理", "中药学"],
      schools: [makeSchool("中国药科大学", "约 5:1-10:1", "2025 复试线参考：320-360+", "药学特色强"), makeSchool("沈阳药科大学", "约 4:1-8:1", "2025 复试线参考：310-350+", "药学传统强校"), makeSchool("北京大学药学院", "约 6:1-12:1", "2025 复试线参考：330-370+", "平台和科研强")],
      tutors: ["药物化学、药剂、药理、临床药学方向。", "核心课程：药理学、药剂学、药物分析、药物化学。"],
      competitions: [commonComps[0], commonComps[1]],
      jobs: [job("药企研发助理", "7k-15k/月", "实验、文献、记录"), job("药品注册专员", "7k-14k/月", "法规、申报资料"), job("临床监察员 CRA", "8k-16k/月", "GCP、沟通、出差")],
      growth: growth(["积累药企、医院药房或临床试验实习。", "训练文献检索、实验记录和法规意识。"]),
      gongPosts: [post("药监局监管岗", "药学、药物制剂相关", "往年进面常见 120-140+"), post("市场监管药品安全岗", "药学类，本科及以上", "往年进面常见 120-140+")]
    }),
    "护理学": major({
      aliases: ["护理", "助产", "老年护理"],
      schools: [makeSchool("北京协和医学院", "约 4:1-8:1", "2025 复试线参考：310-345+", "护理教育资源强"), makeSchool("中南大学", "约 4:1-8:1", "2025 复试线参考：305-340+", "护理学科强"), makeSchool("四川大学", "约 4:1-8:1", "2025 复试线参考：305-340+", "医学平台好")],
      tutors: ["临床护理、护理管理、老年护理、社区护理方向。", "核心课程：基础护理、内外科护理、护理研究、护理管理。"],
      competitions: [commonComps[0], comp("护士执业资格考试", "护理就业核心资格考试。", links.neea)],
      jobs: [job("临床护士", "5k-11k/月", "护士资格证、临床操作"), job("护理管理助理", "6k-12k/月", "沟通、流程、质控"), job("健康管理师助理", "5k-10k/月", "慢病管理、沟通服务")],
      growth: growth(["通过护士执业资格考试，积累医院实习。", "关注老年护理、社区护理、专科护士方向。"]),
      gongPosts: [post("卫健系统事业编护理岗", "护理学，护士资格证", "以地方公告和综合成绩为准"), post("疾控/社区卫生相关岗位", "护理或公共卫生相关", "往年进面常见 115-135+")]
    }),
    "心理学": major({
      aliases: ["应用心理", "心理咨询", "心理健康教育"],
      schools: [makeSchool("北京师范大学", "约 8:1-16:1", "2025 复试线参考：360-390+", "心理学顶尖平台"), makeSchool("华东师范大学", "约 6:1-12:1", "2025 复试线参考：350-380+", "心理与教育资源强"), makeSchool("华南师范大学", "约 5:1-10:1", "2025 复试线参考：345-375+", "应用心理资源好")],
      tutors: ["发展心理、教育心理、咨询心理、用户研究方向。", "核心课程：心理统计、实验心理、心理测量、咨询理论。"],
      competitions: [commonComps[0], commonComps[2]],
      jobs: [job("用户研究助理", "8k-16k/月", "访谈、问卷、数据分析"), job("心理健康教师", "5k-11k/月", "教师资格、咨询基础"), job("EAP/心理服务运营", "6k-12k/月", "心理学基础、项目运营")],
      growth: growth(["训练统计、问卷、访谈和报告写作。", '教育方向准备教师资格证：<a class="text-brand font-semibold" target="_blank" rel="noopener" href="' + links.moeTeacher + '">官方入口</a>']),
      gongPosts: [post("监狱/戒毒系统心理矫治岗", "心理学类，部分有体测要求", "往年进面常见 115-135+"), post("教育系统心理健康岗", "心理学、教育学相关", "以地方公告为准")]
    }),
    "应用经济学": major({
      aliases: ["经济学", "产业经济", "区域经济", "国际贸易"],
      schools: [makeSchool("中国人民大学", "约 8:1-16:1", "2025 复试线参考：360-390+", "经济学平台强"), makeSchool("南开大学", "约 6:1-12:1", "2025 复试线参考：350-380+", "经济学传统强校"), makeSchool("厦门大学", "约 6:1-12:1", "2025 复试线参考：350-380+", "财政金融和统计资源好")],
      tutors: ["产业经济、区域经济、国际贸易、数量经济方向。", "核心课程：微观、宏观、计量经济学、产业经济学。"],
      competitions: [commonComps[2], commonComps[1]],
      jobs: [job("经济研究助理", "7k-15k/月", "数据、报告、宏观分析"), job("产业分析师", "8k-16k/月", "行业研究、政策分析"), job("数据运营/商业分析", "8k-18k/月", "SQL、BI、业务理解")],
      growth: growth(["训练计量、数据分析和政策研究报告。", "找智库、券商研究、咨询、政府研究机构实习。"]),
      gongPosts: [post("发改委/统计局综合岗", "经济学、统计、应用经济学", "往年进面常见 125-145+"), post("商务/财政部门岗位", "经济贸易、财政金融相关", "往年进面常见 125-145+")]
    })
  };

  return {
    industries: industries,
    majors: majors,
    competitions: commonComps,
    links: links,
    exams: [
      { name: "2025 年国考", time: "报名：2024 年 10 月 15 日至 10 月 24 日；公共科目笔试：2024 年 12 月 1 日。", link: links.scs2025, note: "以国家公务员局 2025 年度考试录用公务员专题为准。" },
      { name: "2025 年各省省考", time: "各省时间不同，多数省份在 2025 年 1-3 月发布公告并组织报名，2-4 月笔试。", link: links.scs, note: "请以各省公务员主管部门公告为准，本站提供国家公务员局入口做汇总跳转。" },
      { name: "2025 年事业单位", time: "事业单位全年分批招聘，联考多见于上半年和下半年，岗位以各地人社部门公告为准。", link: links.mohrss, note: "以人社部门、招聘单位和当地人事考试网公告为准。" }
    ],
    civilTypes: [
      { name: "国考", desc: "中央机关及直属机构统一招录，岗位覆盖税务、海关、统计、铁路公安等，竞争范围全国，公告和职位表集中发布。" },
      { name: "省考", desc: "省市县乡机关招录，地域属性强，适合想留在本省发展的同学，考试时间和题型由各省安排。" },
      { name: "事业单位", desc: "学校、医院、科研院所、公共服务机构等招聘，既有综合管理岗也有专业技术岗，考试内容因地区和单位差异较大。" },
      { name: "选调生", desc: "面向优秀应届毕业生和部分基层项目人员，通常重视学校、党员、学生干部、基层服务意愿等条件。" }
    ]
  };
}

DATA = buildExpandedData2025();

function init() {
  renderIndustries();
  renderQuiz();
  renderKaoyan();
  renderJob();
  renderGong();
  bindEvents();
  route("home");
}

init();
