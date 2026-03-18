const pages = {
  home: { file: "index.html", title: "首页", sceneLabel: "AI 推荐入口", icon: "fa-sparkles", tab: "home" },
  plan: { file: "plan.html", title: "行程方案", sceneLabel: "最优价格与最顺路线", icon: "fa-route", tab: "plan" },
  detail: { file: "detail.html", title: "柜点详情", sceneLabel: "状态、视觉和取件提醒", icon: "fa-box-open", tab: null },
  assistant: { file: "assistant.html", title: "AI 助手", sceneLabel: "行程中的动态调整", icon: "fa-wand-magic-sparkles", tab: "assistant" },
  orders: { file: "orders.html", title: "订单", sceneLabel: "存取状态与异常提示", icon: "fa-rectangle-list", tab: "orders" },
  profile: { file: "profile.html", title: "我的", sceneLabel: "常用偏好与优惠券", icon: "fa-user", tab: "profile" },
};

const tabs = [
  { id: "home", icon: "fa-house", label: "首页" },
  { id: "plan", icon: "fa-route", label: "方案" },
  { id: "assistant", icon: "fa-sparkles", label: "AI" },
  { id: "orders", icon: "fa-bag-shopping", label: "订单" },
  { id: "profile", icon: "fa-user", label: "我的" },
];

const activePage = document.body.dataset.page || "home";

function pageLink(pageId, className, html) {
  return `<a href="./${pages[pageId].file}" class="${className}">${html}</a>`;
}

const content = {};

content.home = `
  <div class="space-y-5 pb-28">
    <div class="rounded-[30px] bg-gradient-to-br from-[#131313] via-[#27224A] to-[#6F66FF] p-5 text-white shadow-card">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs tracking-[0.3em] text-white/60">SMART STORAGE</p>
          <h2 class="mt-3 text-[30px] font-bold leading-[1.15]">把存包<br/>放进行程里</h2>
        </div>
        <div class="rounded-full bg-white/10 px-3 py-1 text-xs">上海 · 今晚返程</div>
      </div>
      <p class="mt-4 max-w-[260px] text-sm leading-6 text-white/75">
        AI 根据你的出发地、景点顺序、返程时间和预算，推荐最省时也最省钱的寄存方案。
      </p>
      <div class="mt-5 grid grid-cols-3 gap-3">
        <div class="rounded-[22px] bg-white/10 p-3">
          <p class="text-xs text-white/60">预计省时</p>
          <p class="mt-2 text-xl font-semibold">34 分钟</p>
        </div>
        <div class="rounded-[22px] bg-white/10 p-3">
          <p class="text-xs text-white/60">最低价格</p>
          <p class="mt-2 text-xl font-semibold">¥12</p>
        </div>
        <div class="rounded-[22px] bg-white/10 p-3">
          <p class="text-xs text-white/60">回取风险</p>
          <p class="mt-2 text-xl font-semibold">低</p>
        </div>
      </div>
    </div>

    <div class="glass-card rounded-[28px] p-4 shadow-sm">
      <div class="mb-3 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">你的今日行程</h3>
          <p class="mt-1 text-xs text-gray-500">AI 会用路线顺序替代单点 LBS 推荐</p>
        </div>
        <button class="rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600">编辑行程</button>
      </div>
      <div class="rounded-[24px] bg-[#f5f6f8] p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime/30">
            <i class="fa-solid fa-train-subway text-gray-700"></i>
          </div>
          <div class="flex-1">
            <p class="font-semibold">虹桥火车站 10:10 到达</p>
            <p class="text-xs text-gray-500">随后去武康路、安福路、静安寺，19:30 去机场</p>
          </div>
        </div>
        <div class="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span class="whitespace-nowrap rounded-full bg-white px-3 py-2 text-gray-600">20 寸行李箱 x1</span>
          <span class="whitespace-nowrap rounded-full bg-white px-3 py-2 text-gray-600">双肩包 x1</span>
          <span class="whitespace-nowrap rounded-full bg-white px-3 py-2 text-gray-600">优先低价</span>
          <span class="whitespace-nowrap rounded-full bg-white px-3 py-2 text-gray-600">返程不走回头路</span>
        </div>
      </div>
      ${pageLink("plan", "mt-4 flex w-full items-center justify-center gap-2 rounded-[22px] bg-brand px-4 py-4 text-sm font-semibold text-white transition hover:brightness-95", '<i class="fa-solid fa-wand-magic-sparkles"></i>查看 AI 最优存包方案')}
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-[28px] bg-white p-4 shadow-sm">
        <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#efeefe] text-lilac">
          <i class="fa-solid fa-vault"></i>
        </div>
        <h3 class="font-semibold">智能柜</h3>
        <p class="mt-2 text-xs leading-5 text-gray-500">适合快存快取，支持重量监测和格口摄像头确认。</p>
      </div>
      <div class="rounded-[28px] bg-white p-4 shadow-sm">
        <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef8dc] text-[#739d28]">
          <i class="fa-solid fa-store"></i>
        </div>
        <h3 class="font-semibold">商家寄存</h3>
        <p class="mt-2 text-xs leading-5 text-gray-500">价格更低，适合大学生短途游和长时间存放。</p>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">热门场景</h3>
        <span class="text-xs text-gray-400">一键切换</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${[
          ["地铁换乘", "fa-train-subway", "from-[#ffefe5] to-[#fff8f1]"],
          ["火车站到达", "fa-train", "from-[#edf5ff] to-[#f7fbff]"],
          ["商圈逛街", "fa-bag-shopping", "from-[#f6efff] to-[#fcfbff]"],
          ["演出活动", "fa-ticket", "from-[#effff5] to-[#fbfffd]"],
        ]
          .map(
            ([name, icon, bg]) => `
          <button class="rounded-[26px] bg-gradient-to-br ${bg} p-4 text-left shadow-sm">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-gray-700 shadow-sm">
              <i class="fa-solid ${icon}"></i>
            </div>
            <p class="mt-8 text-base font-semibold">${name}</p>
          </button>`
          )
          .join("")}
      </div>
    </div>
  </div>
`;

content.plan = `
  <div class="space-y-5 pb-28">
    <div class="flex items-center justify-between px-1">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">AI Route</p>
        <h2 class="mt-2 text-2xl font-bold">动态推荐方案</h2>
      </div>
      <button class="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm">重算</button>
    </div>

    <div class="rounded-[30px] bg-white p-4 shadow-sm">
      <div class="flex gap-3 overflow-x-auto pb-1 text-xs">
        <span class="rounded-full bg-brand px-3 py-2 font-semibold text-white">综合最优</span>
        <span class="rounded-full bg-[#f3f4f6] px-3 py-2 text-gray-600">最低价格</span>
        <span class="rounded-full bg-[#f3f4f6] px-3 py-2 text-gray-600">最短时间</span>
        <span class="rounded-full bg-[#f3f4f6] px-3 py-2 text-gray-600">营业最稳</span>
      </div>

      <div class="mt-4 rounded-[26px] bg-gradient-to-br from-[#171717] via-[#232345] to-[#7c6cff] p-5 text-white">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-white/65">AI 推荐 No.1</p>
            <h3 class="mt-1 text-xl font-semibold">静安寺 2 号口智能柜</h3>
          </div>
          <span class="rounded-full bg-white/10 px-3 py-2 text-xs">顺路指数 96</span>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div class="rounded-2xl bg-white/10 px-2 py-3">
            <p class="text-white/60">价格</p>
            <p class="mt-1 text-lg font-semibold">¥15</p>
          </div>
          <div class="rounded-2xl bg-white/10 px-2 py-3">
            <p class="text-white/60">额外绕路</p>
            <p class="mt-1 text-lg font-semibold">6 分钟</p>
          </div>
          <div class="rounded-2xl bg-white/10 px-2 py-3">
            <p class="text-white/60">回取保障</p>
            <p class="mt-1 text-lg font-semibold">24h</p>
          </div>
        </div>
        <p class="mt-4 text-sm leading-6 text-white/75">
          因为你最后一站在静安寺附近，存这里比虹桥站便宜 10 元，同时避免返程回拿。
        </p>
        ${pageLink("detail", "mt-4 flex w-full items-center justify-center gap-2 rounded-[22px] bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:scale-[0.99]", "查看柜点详情")}
      </div>
    </div>

    <div class="rounded-[30px] bg-white p-4 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold">路线示意</h3>
        <span class="text-xs text-gray-400">最少回头路</span>
      </div>
      <div class="space-y-4">
        ${[
          ["10:10", "虹桥火车站到达", "fa-location-dot", "bg-[#eef3ff] text-[#4564ff]"],
          ["10:35", "地铁 2 号线到静安寺，先存包", "fa-box-archive", "bg-[#fff1ec] text-[#f0632b]"],
          ["11:10", "武康路 & 安福路", "fa-camera", "bg-[#f2efff] text-[#7058ff]"],
          ["15:00", "静安寺商圈", "fa-mug-hot", "bg-[#ecfaef] text-[#2a8b45]"],
          ["18:40", "返回静安寺 2 号口取包", "fa-unlock-keyhole", "bg-[#fff8e7] text-[#b98500]"],
          ["19:30", "直达机场", "fa-plane", "bg-[#eef7ff] text-[#3177bd]"],
        ]
          .map(
            ([time, title, icon, color], index) => `
          <div class="flex gap-3">
            <div class="flex w-[54px] shrink-0 justify-center">
              <div class="text-xs font-semibold text-gray-400">${time}</div>
            </div>
            <div class="flex flex-col items-center">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl ${color}">
                <i class="fa-solid ${icon}"></i>
              </div>
              ${index < 5 ? '<div class="mt-2 h-10 w-px bg-gradient-to-b from-gray-200 to-transparent"></div>' : ""}
            </div>
            <div class="flex-1 pt-1">
              <p class="font-semibold">${title}</p>
              <p class="mt-1 text-xs leading-5 text-gray-500">${index === 1 ? "AI 判断这里先存最优，之后所有景点都在前方线路上。" : index === 4 ? "柜体 24 小时可取，晚点也不会受营业时间影响。" : "路线已结合交通方式、时段拥挤度和取件顺序优化。"}</p>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <div class="space-y-3">
      ${[
        {
          title: "虹桥站出发层商家寄存",
          price: "¥12",
          time: "绕路 28 分钟",
          note: "最便宜，但晚上取件需要折返，不适合你的后续行程。",
          badge: "低价",
        },
        {
          title: "武康路合作咖啡店寄存",
          price: "¥18",
          time: "绕路 12 分钟",
          note: "离首个景点近，但 20:00 关门，返程稍有风险。",
          badge: "轻松",
        },
      ]
        .map(
          (item) => `
        <div class="rounded-[28px] bg-white p-4 shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-semibold">${item.title}</h3>
                <span class="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-500">${item.badge}</span>
              </div>
              <p class="mt-2 text-xs leading-5 text-gray-500">${item.note}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold">${item.price}</p>
              <p class="text-xs text-gray-400">${item.time}</p>
            </div>
          </div>
        </div>`
        )
        .join("")}
    </div>
  </div>
`;

content.detail = `
  <div class="space-y-5 pb-28">
    <div class="hero-image h-[220px] rounded-[34px] shadow-card" style="background-image:url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80');">
      <div class="flex h-full flex-col justify-between rounded-[34px] bg-gradient-to-b from-black/20 via-black/5 to-black/55 p-5 text-white">
        <div class="flex items-center justify-between">
          ${pageLink("plan", "flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur", '<i class="fa-solid fa-arrow-left"></i>')}
          <span class="rounded-full bg-white/15 px-3 py-2 text-xs backdrop-blur">24 小时可取</span>
        </div>
        <div>
          <p class="text-xs tracking-[0.28em] text-white/70">LOCKER · LIVE</p>
          <h2 class="mt-2 text-2xl font-bold">静安寺 2 号口智能柜</h2>
          <p class="mt-2 text-sm text-white/75">地铁出站 90 米，可直连机场线，适合最后一站取包</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div class="rounded-[24px] bg-white p-4 text-center shadow-sm">
        <p class="text-xs text-gray-400">小柜</p>
        <p class="mt-2 text-lg font-semibold">¥15</p>
      </div>
      <div class="rounded-[24px] bg-white p-4 text-center shadow-sm">
        <p class="text-xs text-gray-400">中柜</p>
        <p class="mt-2 text-lg font-semibold">¥22</p>
      </div>
      <div class="rounded-[24px] bg-white p-4 text-center shadow-sm">
        <p class="text-xs text-gray-400">大柜</p>
        <p class="mt-2 text-lg font-semibold">¥29</p>
      </div>
    </div>

    <div class="rounded-[30px] bg-white p-4 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">柜体状态可视化</h3>
          <p class="mt-1 text-xs text-gray-500">通过重量、门锁状态和取件前后图像确认异常</p>
        </div>
        <span class="rounded-full bg-[#eef8dc] px-3 py-2 text-xs font-semibold text-[#648b1f]">运行正常</span>
      </div>
      <div class="rounded-[28px] bg-[#f4f6f8] p-4">
        <div class="grid grid-cols-[1.15fr_0.85fr] gap-3">
          <div class="hero-image min-h-[180px] rounded-[24px]" style="background-image:url('https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&w=900&q=80');"></div>
          <div class="space-y-3">
            <div class="rounded-[22px] bg-white p-3">
              <p class="text-xs text-gray-400">当前重量</p>
              <p class="mt-2 text-xl font-semibold">12.6kg</p>
            </div>
            <div class="rounded-[22px] bg-white p-3">
              <p class="text-xs text-gray-400">门锁状态</p>
              <p class="mt-2 text-xl font-semibold">已闭合</p>
            </div>
            <div class="rounded-[22px] bg-white p-3">
              <p class="text-xs text-gray-400">取件提醒</p>
              <p class="mt-2 text-sm font-semibold">若重量未清零，将提示有遗漏</p>
            </div>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div class="rounded-[22px] bg-white p-3">
            <p class="text-gray-400">放入记录</p>
            <p class="mt-2 font-semibold text-gray-700">10:39 完成扫码 + 关门拍照</p>
          </div>
          <div class="rounded-[22px] bg-white p-3">
            <p class="text-gray-400">AI 提示</p>
            <p class="mt-2 font-semibold text-gray-700">推荐大衣单独挂放至衣物专柜</p>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-[30px] bg-gradient-to-br from-[#f3f0ff] via-white to-[#effadb] p-4 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">物品识别推荐</h3>
          <p class="mt-1 text-xs text-gray-500">按物品类型推荐专用寄存空间</p>
        </div>
        <i class="fa-solid fa-shirt text-lilac"></i>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-[22px] bg-white p-3 text-center">
          <div class="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f3ff] text-lilac">
            <i class="fa-solid fa-shirt"></i>
          </div>
          <p class="mt-3 text-xs font-semibold">衣物专柜</p>
        </div>
        <div class="rounded-[22px] bg-white p-3 text-center">
          <div class="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef8dc] text-[#739d28]">
            <i class="fa-solid fa-laptop"></i>
          </div>
          <p class="mt-3 text-xs font-semibold">数码防震</p>
        </div>
        <div class="rounded-[22px] bg-white p-3 text-center">
          <div class="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1ec] text-[#f0632b]">
            <i class="fa-solid fa-suitcase-rolling"></i>
          </div>
          <p class="mt-3 text-xs font-semibold">通用大件</p>
        </div>
      </div>
    </div>

    ${pageLink("orders", "flex w-full items-center justify-center gap-2 rounded-[24px] bg-brand px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-95", '<i class="fa-solid fa-lock"></i>立即预订并进入存包订单')}
  </div>
`;

content.assistant = `
  <div class="space-y-5 pb-28">
    <div class="rounded-[32px] bg-gradient-to-br from-[#131313] via-[#2b205a] to-[#7c6cff] p-5 text-white shadow-card">
      <p class="text-xs tracking-[0.28em] text-white/65">AI COPILOT</p>
      <h2 class="mt-3 text-2xl font-bold">随行存包助手</h2>
      <p class="mt-3 text-sm leading-6 text-white/75">
        在你行程变动、晚点、换景点时，实时更新寄存建议，并提醒是否还来得及取件。
      </p>
    </div>

    <div class="space-y-3">
      <div class="mr-10 rounded-[26px] rounded-tl-md bg-white p-4 shadow-sm">
        <p class="text-sm leading-6 text-gray-700">我晚上临时想去外滩，不去静安寺了，还推荐原来的寄存点吗？</p>
      </div>
      <div class="ml-10 rounded-[26px] rounded-tr-md bg-gradient-to-br from-[#f3f0ff] to-[#effadb] p-4 shadow-sm">
        <p class="text-sm leading-6 text-gray-700">
          不建议。若改去外滩，原方案会增加 26 分钟回取时间。我建议切换到南京东路合作酒店寄存，价格 +¥3，但总路程少 18 分钟，22:00 前可自助取件。
        </p>
        <div class="mt-4 flex gap-2 text-xs">
          <button class="rounded-full bg-white px-3 py-2 font-semibold text-gray-700 shadow-sm">采纳新方案</button>
          <button class="rounded-full bg-white/70 px-3 py-2 font-semibold text-gray-500">保留原方案</button>
        </div>
      </div>
    </div>

    <div class="rounded-[30px] bg-white p-4 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold">快捷问题</h3>
        <span class="text-xs text-gray-400">可一键发问</span>
      </div>
      <div class="grid grid-cols-2 gap-3 text-sm">
        ${[
          "我会不会来不及取包",
          "有没有更便宜但差不多顺路的",
          "双肩包换成衣物寄存",
          "晚点两小时怎么办",
        ]
          .map(
            (text) => `
          <button class="rounded-[22px] bg-[#f5f6f8] p-4 text-left font-semibold text-gray-700 transition hover:bg-[#edeff3]">${text}</button>`
          )
          .join("")}
      </div>
    </div>

    <div class="rounded-[30px] bg-white p-4 shadow-sm">
      <div class="mb-3 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">AI 判断依据</h3>
          <p class="mt-1 text-xs text-gray-500">比传统“附近推荐”多看这些因素</p>
        </div>
        <i class="fa-solid fa-sliders text-gray-400"></i>
      </div>
      <div class="space-y-3">
        ${[
          ["行程顺路程度", 96, "bg-lilac"],
          ["营业/可取稳定性", 88, "bg-lime"],
          ["价格性价比", 91, "bg-brand"],
          ["物品适配度", 84, "bg-[#ffb977]"],
        ]
          .map(
            ([name, score, color]) => `
          <div class="rounded-[22px] bg-[#f7f8fa] p-3">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-semibold">${name}</span>
              <span class="text-gray-400">${score}</span>
            </div>
            <div class="h-2 rounded-full bg-white">
              <div class="h-2 rounded-full ${color}" style="width:${score}%"></div>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <div class="rounded-[30px] bg-white p-4 shadow-sm">
      <div class="flex items-center gap-3 rounded-[24px] bg-[#f5f6f8] px-4 py-4">
        <i class="fa-solid fa-microphone text-gray-400"></i>
        <span class="flex-1 text-sm text-gray-400">直接说：帮我改成外滩结束后取件</span>
        <button class="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white">发送</button>
      </div>
    </div>
  </div>
`;

content.orders = `
  <div class="space-y-5 pb-28">
    <div class="flex items-center justify-between px-1">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">ORDERS</p>
        <h2 class="mt-2 text-2xl font-bold">我的存包</h2>
      </div>
      <button class="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm">历史记录</button>
    </div>

    <div class="rounded-[30px] bg-gradient-to-br from-[#191919] via-[#2e2a5c] to-[#7c6cff] p-5 text-white shadow-card">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs text-white/60">进行中</p>
          <h3 class="mt-2 text-xl font-semibold">静安寺 2 号口智能柜</h3>
        </div>
        <span class="rounded-full bg-white/10 px-3 py-2 text-xs">柜号 A-18</span>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div class="rounded-[22px] bg-white/10 p-3">
          <p class="text-white/60">存入时间</p>
          <p class="mt-1 font-semibold">今天 10:39</p>
        </div>
        <div class="rounded-[22px] bg-white/10 p-3">
          <p class="text-white/60">建议取件</p>
          <p class="mt-1 font-semibold">18:40 前后</p>
        </div>
      </div>
      <div class="mt-4 rounded-[22px] bg-white/10 p-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-white/70">剩余时长</span>
          <span class="text-lg font-semibold">07:26:12</span>
        </div>
      </div>
    </div>

    <div class="rounded-[30px] bg-white p-4 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">取件安全提示</h3>
          <p class="mt-1 text-xs text-gray-500">避免忘取、漏取、关门超时</p>
        </div>
        <i class="fa-solid fa-shield-heart text-lilac"></i>
      </div>
      <div class="space-y-3">
        ${[
          ["重量仍大于 0kg 时提醒", "未取空会推送通知", true],
          ["扫码后自动比对存入照片", "检测还有衣物挂在内侧", true],
          ["若商家即将打烊提前 30 分钟提醒", "当前订单无需提醒", false],
        ]
          .map(
            ([title, desc, on]) => `
          <div class="flex items-center justify-between rounded-[22px] bg-[#f6f7f9] p-4">
            <div class="pr-4">
              <p class="text-sm font-semibold">${title}</p>
              <p class="mt-1 text-xs text-gray-500">${desc}</p>
            </div>
            <div class="relative h-7 w-12 rounded-full ${on ? "bg-lilac" : "bg-gray-300"}">
              <div class="absolute top-1 h-5 w-5 rounded-full bg-white transition ${on ? "left-6" : "left-1"}"></div>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <div class="rounded-[30px] bg-white p-4 shadow-sm">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-lg font-semibold">异常状态示例</h3>
        <span class="text-xs text-gray-400">视觉 + 传感器</span>
      </div>
      <div class="rounded-[26px] bg-[#fff8ea] p-4">
        <div class="flex items-start gap-3">
          <div class="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#c38a00]">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <p class="font-semibold text-[#7a5a00]">检测到取件后重量仍有 1.4kg</p>
            <p class="mt-2 text-xs leading-5 text-[#8d6a00]">系统会弹出“可能遗留小件物品”，并显示上次存入对比图，提醒再次检查。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

content.profile = `
  <div class="space-y-5 pb-28">
    <div class="rounded-[32px] bg-gradient-to-br from-[#ffffff] via-[#f4f2ff] to-[#effadb] p-5 shadow-sm">
      <div class="flex items-center gap-4">
        <div class="hero-image h-16 w-16 rounded-[24px]" style="background-image:url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80');"></div>
        <div>
          <h2 class="text-2xl font-bold">周末学生卡</h2>
          <p class="mt-1 text-sm text-gray-500">偏好：低价优先 · 常用城市：上海 / 杭州</p>
        </div>
      </div>
      <div class="mt-5 grid grid-cols-3 gap-3">
        <div class="rounded-[22px] bg-white p-3 text-center">
          <p class="text-xs text-gray-400">累计省下</p>
          <p class="mt-2 text-lg font-semibold">¥186</p>
        </div>
        <div class="rounded-[22px] bg-white p-3 text-center">
          <p class="text-xs text-gray-400">完成订单</p>
          <p class="mt-2 text-lg font-semibold">23</p>
        </div>
        <div class="rounded-[22px] bg-white p-3 text-center">
          <p class="text-xs text-gray-400">优惠券</p>
          <p class="mt-2 text-lg font-semibold">4 张</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-[28px] bg-white p-4 shadow-sm">
        <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1ec] text-brand">
          <i class="fa-solid fa-ticket"></i>
        </div>
        <h3 class="font-semibold">学生优惠</h3>
        <p class="mt-2 text-xs text-gray-500">工作日智能柜 85 折，商家寄存低至 ¥9 起。</p>
      </div>
      <div class="rounded-[28px] bg-white p-4 shadow-sm">
        <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#4564ff]">
          <i class="fa-solid fa-heart"></i>
        </div>
        <h3 class="font-semibold">常用偏好</h3>
        <p class="mt-2 text-xs text-gray-500">低价优先、24h 可取、避免回头路。</p>
      </div>
    </div>

    <div class="rounded-[30px] bg-white p-4 shadow-sm">
      <h3 class="text-lg font-semibold">功能入口</h3>
      <div class="mt-4 space-y-3">
        ${[
          ["常用旅程模板", "周末短途、演出夜场、毕业旅行"],
          ["物品寄存偏好", "衣物专柜、数码防震、易碎物提醒"],
          ["消息通知", "营业时间预警、取件遗漏提醒"],
          ["合作城市", "上海、杭州、南京、苏州等持续接入"],
        ]
          .map(
            ([title, desc]) => `
          <div class="flex items-center justify-between rounded-[22px] bg-[#f6f7f9] p-4">
            <div>
              <p class="text-sm font-semibold">${title}</p>
              <p class="mt-1 text-xs text-gray-500">${desc}</p>
            </div>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
          </div>`
          )
          .join("")}
      </div>
    </div>
  </div>
`;

function renderSidebar() {
  return `
    <aside class="hidden w-[290px] shrink-0 rounded-[32px] bg-white/80 p-6 shadow-soft backdrop-blur xl:block">
      <div class="mb-8">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">产品概览</p>
        <h1 class="font-display text-3xl font-semibold text-ink">寄旅 AI</h1>
        <p class="mt-3 text-sm leading-6 text-gray-500">
          面向短途旅客与大学生，把商家寄存、智能柜、地铁站、火车站寄存整合成一条动态行程服务链。
        </p>
      </div>
      <div class="space-y-3">
        ${Object.entries(pages)
          .map(([id, page]) => {
            const active = id === activePage ? "active" : "";
            return `<a href="./${page.file}" class="scene-btn ${active}">
              <span><i class="fa-solid ${page.icon}"></i> ${page.title}</span>
              <small>${page.sceneLabel}</small>
            </a>`;
          })
          .join("")}
      </div>
      <div class="mt-8 rounded-[28px] bg-gradient-to-br from-lilac/15 via-white to-lime/20 p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">核心创新</p>
        <ul class="mt-4 space-y-3 text-sm leading-6 text-gray-600">
          <li>动态行程推荐，不只看“离我最近”</li>
          <li>接入商家、柜机、交通枢纽所有可存场景</li>
          <li>结合营业时间、回取成本、价格和路线综合排序</li>
          <li>通过重量、格口视觉、扫码记录做取件提醒</li>
        </ul>
      </div>
    </aside>
  `;
}

function renderTabs() {
  return tabs
    .map((tab) => {
      const pageId = Object.keys(pages).find((id) => pages[id].tab === tab.id) || "home";
      const active = pages[activePage].tab === tab.id ? "active" : "";
      return `<a href="./${pages[pageId].file}" class="tab-item ${active}">
        <i class="fa-solid ${tab.icon}"></i>
        <span>${tab.label}</span>
      </a>`;
    })
    .join("");
}

document.getElementById("app").innerHTML = `
  <div class="mx-auto flex min-h-screen max-w-7xl items-center justify-center gap-8 px-5 py-10">
    ${renderSidebar()}
    <main class="relative">
      <div class="pointer-events-none absolute inset-0 -z-10 rounded-[54px] bg-gradient-to-br from-white via-white to-[#d8e8ff] blur-2xl"></div>
      <div class="phone-shell">
        <div class="phone-camera"></div>
        <div class="phone-screen">
          <div class="status-bar">
            <span>9:41</span>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-signal text-[11px]"></i>
              <i class="fa-solid fa-wifi text-[11px]"></i>
              <i class="fa-solid fa-battery-three-quarters text-[12px]"></i>
            </div>
          </div>
          <div class="screen-page">${content[activePage]}</div>
          <nav class="tab-bar">${renderTabs()}</nav>
        </div>
      </div>
    </main>
  </div>
`;
