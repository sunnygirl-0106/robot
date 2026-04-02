import { useState, useEffect } from "react";

// ============================================================
//  机器人解耦架构详解 — React 内容框架
//  风格：科技感 / 未来感 (深色主题 + 发光效果 + 网格)
//  说明：这是纯组件 + 样式层，脚手架（Vite/Next 等）后续再搭
// ============================================================

// ─── 设计令牌 (Design Tokens) ─────────────────────────────────
const T = {
  // 底色
  bg:        "#0a0e1a",
  bgCard:    "rgba(15, 23, 42, 0.75)",
  bgGlass:   "rgba(255,255,255,0.03)",
  surface:   "#111827",
  // 边框
  border:    "rgba(99,102,241,0.15)",
  borderGlow:"rgba(99,102,241,0.35)",
  // 文字
  text:      "#e2e8f0",
  textDim:   "#64748b",
  textMuted: "#475569",
  // 品牌色
  cyan:      "#06b6d4",
  cyanGlow:  "rgba(6,182,212,0.4)",
  indigo:    "#818cf8",
  indigoGlow:"rgba(129,140,248,0.35)",
  purple:    "#a78bfa",
  purpleGlow:"rgba(167,139,250,0.35)",
  amber:     "#fbbf24",
  amberGlow: "rgba(251,191,36,0.3)",
  green:     "#34d399",
  greenGlow: "rgba(52,211,153,0.3)",
  red:       "#f87171",
  redGlow:   "rgba(248,113,113,0.4)",
  pink:      "#f472b6",
  // 圆角 / 阴影
  radius:    "16px",
  radiusSm:  "10px",
  glow: (color, spread = 20) =>
    `0 0 ${spread}px ${color}, 0 0 ${spread * 2}px ${color}`,
};


// ─── 全局 CSS（注入到 <style>）──────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'Space Grotesk','Noto Sans SC', sans-serif;
    background: ${T.bg};
    color: ${T.text};
    min-height: 100vh;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* 全局网格背景 */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  /* 顶部光晕 */
  body::after {
    content: '';
    position: fixed; top: -40%; left: 50%; transform: translateX(-50%);
    width: 120%; height: 60%;
    background: radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }
  @keyframes float-up {
    0%   { transform: translateY(30px); opacity: 0; }
    100% { transform: translateY(0);    opacity: 1; }
  }
  @keyframes dash-flow {
    to { stroke-dashoffset: -20; }
  }
  @keyframes scan-line {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
`;


// ─── 工具组件 ─────────────────────────────────────────────────

/** 注入全局样式 */
function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = globalCSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return null;
}

/** 玻璃卡片容器 */
function GlassCard({ children, style, glowColor, className = "" }) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        background: T.bgCard,
        backdropFilter: "blur(12px)",
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: "28px",
        position: "relative",
        overflow: "hidden",
        boxShadow: glowColor
          ? `0 0 30px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
        ...style,
      }}
    >
      {/* 顶部发光条 */}
      {glowColor && (
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "2px",
            background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

/** 板块标题 */
function SectionHeader({ tag, tagColor, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 12, fontWeight: 600, letterSpacing: 3,
          textTransform: "uppercase", color: tagColor,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            width: 8, height: 8, borderRadius: "50%",
            background: tagColor,
            boxShadow: T.glow(tagColor, 6),
          }}
        />
        {tag}
      </div>
      <h2 style={{
        fontSize: 28, fontWeight: 700, color: T.text,
        letterSpacing: "-0.3px",
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 14, color: T.textDim, marginTop: 6 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}


// ─── SVG 公共定义 ──────────────────────────────────────────────

/** SVG 全局 defs：发光滤镜、渐变、箭头等 */
function SvgDefs() {
  return (
    <defs>
      {/* 发光滤镜 */}
      <filter id="glow-cyan">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="glow-indigo">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="glow-purple">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="glow-amber">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="glow-green">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="glow-red">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="card-shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5" />
      </filter>

      {/* 渐变 */}
      <linearGradient id="grad-brain" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="rgba(99,102,241,0.12)" />
        <stop offset="100%" stopColor="rgba(139,92,246,0.08)" />
      </linearGradient>
      <linearGradient id="grad-brain-stroke" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id="grad-timeline" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={T.cyan} />
        <stop offset="25%" stopColor={T.indigo} />
        <stop offset="50%" stopColor={T.purple} />
        <stop offset="65%" stopColor={T.red} />
        <stop offset="80%" stopColor={T.purple} />
        <stop offset="100%" stopColor={T.green} />
      </linearGradient>

      {/* 箭头 */}
      <marker id="arrow-cyan" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0,8 3,0 6" fill={T.cyan} />
      </marker>
      <marker id="arrow-indigo" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0,8 3,0 6" fill={T.indigo} />
      </marker>
      <marker id="arrow-purple" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0,8 3,0 6" fill={T.purple} />
      </marker>
      <marker id="arrow-amber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0,8 3,0 6" fill={T.amber} />
      </marker>
      <marker id="arrow-green" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0,8 3,0 6" fill={T.green} />
      </marker>
    </defs>
  );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  1️⃣  Hero 顶部
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Hero() {
  return (
    <header
      style={{
        position: "relative",
        padding: "80px 24px 56px",
        textAlign: "center",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {/* 背景光晕 */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 60%),
          radial-gradient(circle at 20% 80%, rgba(6,182,212,0.08) 0%, transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(167,139,250,0.08) 0%, transparent 40%)
        `,
        pointerEvents: "none",
      }} />

      {/* 扫描线动画 */}
      <div style={{
        position: "absolute", left: 0, width: "100%", height: 1,
        background: `linear-gradient(90deg, transparent, ${T.indigo}, transparent)`,
        opacity: 0.3,
        animation: "scan-line 4s linear infinite",
        pointerEvents: "none",
      }} />

      <h1 style={{
        fontSize: 42, fontWeight: 700, position: "relative",
        background: `linear-gradient(135deg, ${T.cyan}, ${T.indigo}, ${T.purple})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "-0.5px",
        marginBottom: 12,
      }}>
        机器人解耦架构详解
      </h1>
      <p style={{
        fontSize: 16, color: T.textDim, position: "relative",
        maxWidth: 480, margin: "0 auto",
      }}>
        世界模型 vs 调度决策模型 — 它们各自管什么？边界在哪里？
      </p>

      {/* 装饰：HUD 角标 */}
      <HudCorners />
    </header>
  );
}

/** HUD 四角装饰线 */
function HudCorners() {
  const L = 30;
  const style = (top, right, bottom, left, rotate) => ({
    position: "absolute", width: L, height: L,
    ...(top != null && { top }), ...(right != null && { right }),
    ...(bottom != null && { bottom }), ...(left != null && { left }),
    borderColor: T.indigo, borderStyle: "solid", borderWidth: 0,
    ...(top != null && left != null && { borderTopWidth: 2, borderLeftWidth: 2 }),
    ...(top != null && right != null && { borderTopWidth: 2, borderRightWidth: 2 }),
    ...(bottom != null && left != null && { borderBottomWidth: 2, borderLeftWidth: 2 }),
    ...(bottom != null && right != null && { borderBottomWidth: 2, borderRightWidth: 2 }),
    opacity: 0.4,
  });

  return (
    <>
      <div style={style(16, null, null, 16)} />
      <div style={style(16, 16, null, null)} />
      <div style={style(null, null, 16, 16)} />
      <div style={style(null, 16, 16, null)} />
    </>
  );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  2️⃣  主架构图
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** 传感器卡片（左侧） */
function SensorCard({ x, y, icon, label, sub }) {
  return (
    <g>
      <rect x={x} y={y} width={130} height={72} rx={12}
        fill="rgba(6,182,212,0.06)" stroke={T.cyan} strokeWidth={1}
        filter="url(#card-shadow)" />
      {/* 左侧发光边 */}
      <rect x={x} y={y + 8} width={2} height={56} rx={1} fill={T.cyan} opacity={0.5} />
      <text x={x + 65} y={y + 28} fill={T.cyan} fontSize={22} textAnchor="middle">{icon}</text>
      <text x={x + 65} y={y + 48} fill={T.text} fontSize={12} fontWeight={600}
        textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{label}</text>
      <text x={x + 65} y={y + 63} fill={T.textDim} fontSize={9}
        textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{sub}</text>
    </g>
  );
}

/** 执行器卡片（右侧） */
function ActuatorCard({ x, y, icon, label, sub }) {
  return (
    <g>
      <rect x={x} y={y} width={130} height={72} rx={12}
        fill="rgba(52,211,153,0.06)" stroke={T.green} strokeWidth={1}
        filter="url(#card-shadow)" />
      <rect x={x + 128} y={y + 8} width={2} height={56} rx={1} fill={T.green} opacity={0.5} />
      <text x={x + 65} y={y + 28} fill={T.green} fontSize={22} textAnchor="middle">{icon}</text>
      <text x={x + 65} y={y + 48} fill={T.text} fontSize={12} fontWeight={600}
        textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{label}</text>
      <text x={x + 65} y={y + 63} fill={T.textDim} fontSize={9}
        textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{sub}</text>
    </g>
  );
}

/** 功能子模块小方块 */
function FeatureBox({ x, y, w = 118, h = 42, icon, label, color, bgAlpha = 0.08 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8}
        fill={`${color}${Math.round(bgAlpha * 255).toString(16).padStart(2, "0")}`}
        stroke={color} strokeWidth={0.6} strokeOpacity={0.4} />
      <text x={x + w / 2} y={y + 17} fill={color} fontSize={16} textAnchor="middle">{icon}</text>
      <text x={x + w / 2} y={y + 33} fill={color} fontSize={10} textAnchor="middle"
        fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{label}</text>
    </g>
  );
}

/** 技能卡片 */
function SkillBox({ x, y, icon, label }) {
  return (
    <g>
      <rect x={x} y={y} width={100} height={56} rx={10}
        fill="rgba(251,191,36,0.06)" stroke={T.amber} strokeWidth={0.6} strokeOpacity={0.5} />
      <text x={x + 50} y={y + 24} fill={T.amber} fontSize={18} textAnchor="middle">{icon}</text>
      <text x={x + 50} y={y + 46} fill={T.amber} fontSize={11} fontWeight={600}
        textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{label}</text>
    </g>
  );
}

/** 流动虚线（带动画） */
function FlowLine({ d, x1, y1, x2, y2, color, marker, opacity = 0.5 }) {
  const lineProps = {
    stroke: color, strokeWidth: 1.5,
    strokeDasharray: "6 4", opacity,
    markerEnd: marker ? `url(#${marker})` : undefined,
    style: { animation: "dash-flow 1.5s linear infinite" },
  };
  if (d) return <path d={d} fill="none" {...lineProps} />;
  return <line x1={x1} y1={y1} x2={x2} y2={y2} {...lineProps} />;
}

function ArchitectureDiagram() {
  const sensors = [
    { y: 66,  icon: "\uD83D\uDCF7", label: "深度相机", sub: "视觉模态" },
    { y: 150, icon: "\uD83D\uDCE1", label: "激光雷达", sub: "空间模态" },
    { y: 234, icon: "\uD83C\uDF99\uFE0F", label: "麦克风",   sub: "听觉模态" },
    { y: 318, icon: "\uD83C\uDF21\uFE0F", label: "其他传感器", sub: "触觉 / 温度" },
  ];
  const actuators = [
    { y: 66,  icon: "\uD83E\uDDBF", label: "腿部关节", sub: "运动模态" },
    { y: 150, icon: "\uD83E\uDDBE", label: "机械臂",   sub: "操作模态" },
    { y: 234, icon: "\uD83D\uDD0A", label: "扬声器",   sub: "语音模态" },
    { y: 318, icon: "\uD83D\uDCFA", label: "显示屏",   sub: "视觉输出" },
  ];

  return (
    <GlassCard glowColor={T.indigoGlow} style={{ padding: "40px 24px 32px", overflowX: "auto" }}>
      <svg viewBox="0 0 1100 560" width="100%" xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", minWidth: 900 }}>
        <SvgDefs />

        {/* ── 左列：采集器标题 ── */}
        <text x={80} y={28} fill={T.cyan} fontSize={14} fontWeight={700}
          textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif"
          letterSpacing="2">采集器</text>
        <text x={80} y={46} fill={T.textDim} fontSize={10}
          textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">感官 · 输入模态</text>

        {/* 传感器卡片 */}
        {sensors.map((s, i) => (
          <SensorCard key={i} x={15} y={s.y} icon={s.icon} label={s.label} sub={s.sub} />
        ))}
        {/* 左侧并行指示线 */}
        <line x1={10} y1={74} x2={10} y2={384} stroke={T.cyan} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
        <text x={6} y={230} fill={T.cyan} fontSize={9} fontWeight={600} textAnchor="middle"
          transform="rotate(-90,6,230)" fontFamily="Space Grotesk,sans-serif">并行运行</text>

        {/* ── 采集器 → 大脑 连线 ── */}
        <FlowLine x1={148} y1={102} x2={228} y2={160} color={T.cyan} marker="arrow-cyan" />
        <FlowLine x1={148} y1={186} x2={228} y2={195} color={T.cyan} marker="arrow-cyan" />
        <FlowLine x1={148} y1={270} x2={228} y2={230} color={T.cyan} marker="arrow-cyan" />
        <FlowLine x1={148} y1={354} x2={228} y2={270} color={T.cyan} marker="arrow-cyan" />

        {/* ── 大脑区域 ── */}
        <rect x={238} y={56} width={620} height={440} rx={20}
          fill="url(#grad-brain)" stroke="url(#grad-brain-stroke)" strokeWidth={1.5}
          strokeDasharray="4 2" strokeOpacity={0.6} />
        <text x={548} y={84} fill={T.purple} fontSize={15} fontWeight={700}
          textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif"
          filter="url(#glow-purple)">
          模型组（机器人的大脑）
        </text>

        {/* ── 世界模型 ── */}
        <rect x={264} y={102} width={268} height={186} rx={14}
          fill="rgba(99,102,241,0.06)" stroke={T.indigo} strokeWidth={1} strokeOpacity={0.5}
          filter="url(#card-shadow)" />
        <text x={398} y={126} fill={T.indigo} fontSize={14} fontWeight={700}
          textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          {"\uD83D\uDDFA\uFE0F"} 世界模型
        </text>
        <text x={398} y={144} fill={T.indigo} fontSize={10} textAnchor="middle" opacity={0.7}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          "我周围长什么样" · 管怎么做
        </text>

        <FeatureBox x={276} y={156} icon={"\uD83E\uDDF1"} label="环境建模" color={T.indigo} />
        <FeatureBox x={402} y={156} icon={"\uD83D\uDEA7"} label="障碍检测" color={T.indigo} />
        <FeatureBox x={276} y={204} icon={"\uD83D\uDCCD"} label="自身定位" color={T.indigo} />
        <FeatureBox x={402} y={204} icon={"\uD83D\uDEE4\uFE0F"} label="局部路径" color={T.indigo} />

        <rect x={276} y={254} width={244} height={22} rx={5}
          fill="rgba(99,102,241,0.08)" />
        <text x={398} y={269} fill={T.indigo} fontSize={9} textAnchor="middle" opacity={0.8}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          类比：骑手的眼睛和空间感，只管怎么骑
        </text>

        {/* ── 决策模型 ── */}
        <rect x={556} y={102} width={274} height={186} rx={14}
          fill="rgba(167,139,250,0.06)" stroke={T.purple} strokeWidth={1} strokeOpacity={0.5}
          filter="url(#card-shadow)" />
        <text x={693} y={126} fill={T.purple} fontSize={14} fontWeight={700}
          textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          {"\uD83E\uDDED"} 决策模型
        </text>
        <text x={693} y={144} fill={T.purple} fontSize={10} textAnchor="middle" opacity={0.7}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          "我现在该做什么" · 管做什么
        </text>

        <FeatureBox x={568} y={156} w={122} icon={"\uD83C\uDFAF"} label="定全局目标" color={T.purple} />
        <FeatureBox x={698} y={156} w={122} icon={"\u2696\uFE0F"} label="排优先级" color={T.purple} />
        <FeatureBox x={568} y={204} w={122} icon={"\uD83D\uDD27"} label="选技能" color={T.purple} />
        <FeatureBox x={698} y={204} w={122} icon={"\uD83D\uDD04"} label="可打断调度" color={T.purple} />

        <rect x={568} y={254} width={252} height={22} rx={5}
          fill="rgba(167,139,250,0.08)" />
        <text x={694} y={269} fill={T.purple} fontSize={9} textAnchor="middle" opacity={0.8}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          类比：外卖平台，只管派单和调度
        </text>

        {/* ── 双向交互箭头 ── */}
        <line x1={534} y1={172} x2={554} y2={172} stroke={T.purple} strokeWidth={2}
          markerEnd="url(#arrow-purple)" />
        <line x1={554} y1={222} x2={534} y2={222} stroke={T.purple} strokeWidth={2}
          markerEnd="url(#arrow-purple)" />
        <text x={544} y={165} fill={T.purple} fontSize={8} textAnchor="middle" opacity={0.8}
          fontFamily="Space Grotesk,sans-serif">环境信息</text>
        <text x={544} y={236} fill={T.purple} fontSize={8} textAnchor="middle" opacity={0.8}
          fontFamily="Space Grotesk,sans-serif">任务目标</text>

        {/* ── 技能库 ── */}
        <rect x={306} y={306} width={486} height={108} rx={14}
          fill="rgba(251,191,36,0.04)" stroke={T.amber} strokeWidth={1} strokeOpacity={0.4}
          filter="url(#card-shadow)" />
        <text x={549} y={332} fill={T.amber} fontSize={13} fontWeight={700}
          textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          {"\uD83E\uDDF0"} 技能库（SKILL）— 模块化可执行动作
        </text>

        <SkillBox x={322} y={344} icon={"\uD83E\uDDED"} label="导航" />
        <SkillBox x={432} y={344} icon={"\uD83E\uDD0F"} label="抓取" />
        <SkillBox x={542} y={344} icon={"\uD83D\uDCAC"} label="社交" />
        <SkillBox x={652} y={344} icon="\u26A1" label="自定义" />

        {/* 决策→技能 / 技能→世界模型 */}
        <FlowLine x1={693} y1={290} x2={620} y2={304} color={T.amber} marker="arrow-amber" opacity={0.6} />
        <text x={666} y={294} fill={T.amber} fontSize={8} opacity={0.7}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">选技能</text>
        <FlowLine d="M372,344 L372,296 L398,290" color={T.indigo} marker="arrow-indigo" opacity={0.5} />
        <text x={354} y={315} fill={T.indigo} fontSize={8} opacity={0.7}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">查地图</text>

        {/* ── 大脑 → 执行器 连线 ── */}
        <FlowLine x1={858} y1={195} x2={940} y2={110} color={T.green} marker="arrow-green" />
        <FlowLine x1={858} y1={250} x2={940} y2={194} color={T.green} marker="arrow-green" />
        <FlowLine x1={858} y1={345} x2={940} y2={278} color={T.green} marker="arrow-green" />
        <FlowLine x1={858} y1={395} x2={940} y2={362} color={T.green} marker="arrow-green" />

        {/* ── 右列：执行器标题 ── */}
        <text x={1020} y={28} fill={T.green} fontSize={14} fontWeight={700}
          textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif"
          letterSpacing="2">执行器</text>
        <text x={1020} y={46} fill={T.textDim} fontSize={10}
          textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">手脚 · 输出模态</text>

        {/* 执行器卡片 */}
        {actuators.map((a, i) => (
          <ActuatorCard key={i} x={955} y={a.y} icon={a.icon} label={a.label} sub={a.sub} />
        ))}
        <line x1={1090} y1={74} x2={1090} y2={384} stroke={T.green} strokeWidth={2}
          strokeLinecap="round" opacity={0.6} />
        <text x={1094} y={230} fill={T.green} fontSize={9} fontWeight={600} textAnchor="middle"
          transform="rotate(90,1094,230)" fontFamily="Space Grotesk,sans-serif">并行响应</text>

        {/* ── 底部循环 ── */}
        <path d="M1020,394 Q1020,520 548,520 Q80,520 80,394"
          stroke={T.textDim} strokeWidth={1.2} fill="none" strokeDasharray="8 4" opacity={0.4}
          markerEnd="url(#arrow-cyan)"
          style={{ animation: "dash-flow 3s linear infinite" }} />
        <text x={548} y={540} fill={T.textDim} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          持续循环：执行结果影响环境 → 传感器重新采集 → 世界模型更新
        </text>

        {/* ── 底部三标注 ── */}
        <rect x={264} y={430} width={200} height={26} rx={13}
          fill="rgba(236,72,153,0.08)" stroke={T.pink} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={364} y={447} fill={T.pink} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          {"\uD83E\uDDE0"} 算法：视觉/SLAM/规划/决策
        </text>
        <rect x={480} y={430} width={200} height={26} rx={13}
          fill="rgba(6,182,212,0.08)" stroke={T.cyan} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={580} y={447} fill={T.cyan} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          {"\u2699\uFE0F"} 工程：通信/调度/驱动
        </text>
        <rect x={696} y={430} width={130} height={26} rx={13}
          fill="rgba(167,139,250,0.08)" stroke={T.purple} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={761} y={447} fill={T.purple} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          {"\uD83E\uDD1D"} 两者协作
        </text>
      </svg>
    </GlassCard>
  );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  3️⃣  边界对比卡片
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function WorldModelCard() {
  return (
    <GlassCard glowColor={T.indigoGlow}>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: T.indigo, marginBottom: 16 }}>
        {"\uD83D\uDDFA\uFE0F"} 世界模型管"怎么做"
      </h3>
      <svg viewBox="0 0 340 180" width="100%" style={{ display: "block" }}>
        <SvgDefs />
        <rect x={10} y={10} width={320} height={160} rx={12}
          fill="rgba(15,23,42,0.6)" stroke={T.border} strokeWidth={1} />
        {/* 网格线 */}
        {[40, 80, 120].map(v => (
          <line key={`h${v}`} x1={10} y1={v} x2={330} y2={v}
            stroke={T.border} strokeWidth={0.3} />
        ))}
        {[70, 130, 190, 250].map(v => (
          <line key={`v${v}`} x1={v} y1={10} x2={v} y2={170}
            stroke={T.border} strokeWidth={0.3} />
        ))}

        <text x={170} y={24} fill={T.textDim} fontSize={9} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">客厅</text>

        {/* 家具 */}
        <rect x={120} y={60} width={70} height={30} rx={6}
          fill="rgba(99,102,241,0.1)" stroke={T.indigo} strokeWidth={0.8} strokeOpacity={0.5} />
        <text x={155} y={80} fill={T.indigo} fontSize={9} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">沙发</text>

        <rect x={220} y={90} width={50} height={30} rx={6}
          fill="rgba(99,102,241,0.1)" stroke={T.indigo} strokeWidth={0.8} strokeOpacity={0.5} />
        <text x={245} y={110} fill={T.indigo} fontSize={9} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">桌子</text>

        {/* 机器人 */}
        <circle cx={60} cy={110} r={13} fill={T.cyan} opacity={0.9}
          filter="url(#glow-cyan)" />
        <text x={60} y={114} fill="white" fontSize={10} textAnchor="middle">{"\uD83E\uDD16"}</text>

        {/* 目标 */}
        <rect x={270} y={35} width={30} height={20} rx={4}
          fill="rgba(52,211,153,0.15)" stroke={T.green} strokeWidth={0.8} />
        <text x={285} y={48} fill={T.green} fontSize={7} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">厨房</text>

        {/* 路径 - 发光虚线 */}
        <path d="M60,97 Q60,68 110,63 Q140,55 200,54 Q260,48 275,44"
          stroke={T.amber} strokeWidth={2.5} fill="none"
          strokeDasharray="5 3" strokeLinecap="round"
          filter="url(#glow-amber)"
          style={{ animation: "dash-flow 2s linear infinite" }} />
        <text x={140} y={48} fill={T.amber} fontSize={8}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">绕过沙发的路径</text>

        {/* 障碍标记 */}
        <circle cx={155} cy={75} r={5} fill={T.red} opacity={0.4}
          filter="url(#glow-red)" />
        <text x={175} y={98} fill={T.red} fontSize={7} opacity={0.8}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">障碍</text>
      </svg>
    </GlassCard>
  );
}

function DecisionModelCard() {
  const tasks = [
    { level: "P0", color: T.red,    bgAlpha: 0.1, borderColor: T.red,    text: '用户语音指令："停下来"', badge: "中断!", badgeColor: T.red },
    { level: "P1", color: T.indigo,  bgAlpha: 0.08, borderColor: T.indigo,  text: "当前任务：前往厨房", badge: "导航技能", badgeColor: T.indigo },
    { level: "P2", color: T.textDim, bgAlpha: 0.04, borderColor: T.textMuted, text: "待办：拿杯子给主人", badge: "抓取技能", badgeColor: T.textMuted },
  ];

  return (
    <GlassCard glowColor={T.purpleGlow}>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: T.purple, marginBottom: 16 }}>
        {"\uD83E\uDDED"} 决策模型管"做什么"
      </h3>
      <svg viewBox="0 0 340 180" width="100%" style={{ display: "block" }}>
        <SvgDefs />
        <rect x={10} y={10} width={320} height={160} rx={12}
          fill="rgba(15,23,42,0.6)" stroke={T.border} strokeWidth={1} />
        <text x={170} y={32} fill={T.purple} fontSize={11} fontWeight={600} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">任务优先级队列</text>

        {tasks.map((t, i) => {
          const ty = 42 + i * 38;
          return (
            <g key={i}>
              <rect x={30} y={ty} width={280} height={32} rx={8}
                fill={`${t.borderColor}${Math.round(t.bgAlpha * 255).toString(16).padStart(2, "0")}`}
                stroke={t.borderColor} strokeWidth={1} strokeOpacity={0.4} />
              <text x={44} y={ty + 21} fill={t.color} fontSize={10} fontWeight={700}
                fontFamily="Space Grotesk,sans-serif">{t.level}</text>
              <text x={80} y={ty + 21} fill={t.color} fontSize={10}
                fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{t.text}</text>
              <rect x={244} y={ty + 6} width={56} height={20} rx={5} fill={t.badgeColor} opacity={0.9} />
              <text x={272} y={ty + 20} fill="white" fontSize={8} fontWeight={600}
                textAnchor="middle" fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{t.badge}</text>
            </g>
          );
        })}

        <text x={170} y={166} fill={T.purple} fontSize={9} textAnchor="middle" opacity={0.7}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          根据优先级选择当前执行什么、调用哪个技能
        </text>
      </svg>
    </GlassCard>
  );
}

function BoundarySection() {
  return (
    <section style={{ marginTop: 64 }}>
      <SectionHeader tag="BOUNDARY" tagColor={T.purple} title="世界模型 vs 决策模型" />
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
      }}>
        <WorldModelCard />
        <DecisionModelCard />
      </div>

      {/* 总结横幅 */}
      <div style={{
        marginTop: 28,
        padding: "20px 32px",
        borderRadius: T.radius,
        border: `1px dashed ${T.purple}`,
        borderOpacity: 0.4,
        background: "rgba(167,139,250,0.04)",
        textAlign: "center",
        fontSize: 14,
        color: T.textDim,
        lineHeight: 2.2,
      }}>
        世界模型不管 <KeyTag>该不该去厨房</KeyTag> — 决策模型不管 <KeyTag>路上有没有桌子挡着</KeyTag>
        <br />
        各管各的，通过数据交换协作 — 这就是 <KeyTag>解耦</KeyTag>
      </div>
    </section>
  );
}

function KeyTag({ children }) {
  return (
    <span style={{
      color: T.purple,
      fontWeight: 700,
      background: "rgba(167,139,250,0.12)",
      padding: "2px 10px",
      borderRadius: 4,
      border: `1px solid rgba(167,139,250,0.2)`,
    }}>
      {children}
    </span>
  );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  4️⃣  场景时间线
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** 时间线步骤数据 */
const STEPS = [
  {
    num: 1, y: 40, color: T.cyan,
    title: "传感器并行采集",
    content: (
      <g>
        <rect x={80} y={48} width={260} height={38} rx={8}
          fill="rgba(6,182,212,0.08)" stroke={T.cyan} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={95} y={64} fill={T.cyan} fontSize={10}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          {"\uD83D\uDCF7"} 视觉  {"\uD83D\uDCE1"} 雷达  {"\uD83C\uDF99\uFE0F"} 听觉  {"\uD83C\uDF21\uFE0F"} 触觉
        </text>
        <text x={95} y={80} fill={T.textDim} fontSize={10}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">全部同时工作，互不干扰</text>
      </g>
    ),
  },
  {
    num: 2, y: 120, color: T.indigo,
    title: "世界模型更新心理地图",
    content: (
      <g>
        <rect x={80} y={128} width={240} height={80} rx={10}
          fill="rgba(99,102,241,0.06)" stroke={T.indigo} strokeWidth={0.8} strokeOpacity={0.4} />
        <circle cx={110} cy={178} r={9} fill={T.cyan} filter="url(#glow-cyan)" />
        <text x={110} y={181} fill="white" fontSize={8} textAnchor="middle">{"\uD83E\uDD16"}</text>
        <rect x={155} y={146} width={40} height={16} rx={3}
          fill="rgba(99,102,241,0.12)" stroke={T.indigo} strokeWidth={0.5} strokeOpacity={0.4} />
        <text x={175} y={157} fill={T.indigo} fontSize={7} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">沙发</text>
        <rect x={258} y={133} width={35} height={14} rx={3}
          fill="rgba(52,211,153,0.12)" stroke={T.green} strokeWidth={0.5} />
        <text x={275} y={143} fill={T.green} fontSize={7} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">厨房</text>
        <path d="M118,175 Q140,140 175,140 Q245,130 260,138"
          stroke={T.amber} strokeWidth={1.5} fill="none" strokeDasharray="4 2"
          style={{ animation: "dash-flow 2s linear infinite" }} />
        <text x={340} y={155} fill={T.indigo} fontSize={10}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">前方3米有沙发</text>
        <text x={340} y={170} fill={T.indigo} fontSize={10}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">左边有通道通厨房</text>
        <text x={340} y={185} fill={T.indigo} fontSize={10}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">我在客厅中央</text>
      </g>
    ),
  },
  {
    num: 3, y: 240, color: T.purple,
    title: "决策模型定目标 → 选「导航技能」",
    content: (
      <g>
        <rect x={80} y={248} width={140} height={34} rx={8}
          fill="rgba(167,139,250,0.08)" stroke={T.purple} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={150} y={270} fill={T.purple} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{"\uD83C\uDFAF"} 目标：前往厨房</text>
        <text x={232} y={268} fill={T.textDim} fontSize={16}>→</text>
        <rect x={252} y={248} width={110} height={34} rx={8}
          fill="rgba(251,191,36,0.08)" stroke={T.amber} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={307} y={270} fill={T.amber} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{"\uD83E\uDDED"} 导航技能</text>
      </g>
    ),
  },
  {
    num: 4, y: 320, color: T.amber,
    title: "导航技能 ⇄ 世界模型协作",
    content: (
      <g>
        <rect x={80} y={328} width={110} height={34} rx={8}
          fill="rgba(251,191,36,0.08)" stroke={T.amber} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={135} y={350} fill={T.amber} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{"\uD83E\uDDED"} 导航技能</text>
        <text x={200} y={340} fill={T.indigo} fontSize={8}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">怎么走？→</text>
        <text x={200} y={358} fill={T.indigo} fontSize={8}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">←绕沙发右边</text>
        <rect x={268} y={328} width={110} height={34} rx={8}
          fill="rgba(99,102,241,0.08)" stroke={T.indigo} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={323} y={350} fill={T.indigo} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{"\uD83D\uDDFA\uFE0F"} 世界模型</text>
      </g>
    ),
  },
  {
    num: 5, y: 400, color: T.green,
    title: "执行器：机器人走起来",
    content: (
      <g>
        <rect x={80} y={408} width={340} height={30} rx={8}
          fill="rgba(52,211,153,0.06)" stroke={T.green} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={95} y={428} fill={T.green} fontSize={10}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          {"\uD83E\uDDBF"} 腿部关节启动 → 绕过沙发 → 朝厨房方向移动  {"\uD83E\uDD16\uD83D\uDCA8"}
        </text>
      </g>
    ),
  },
  {
    num: "!", y: 480, color: T.red, isAlert: true,
    title: '突发：主人喊"停下来！"',
    content: (
      <g>
        <rect x={80} y={488} width={400} height={48} rx={10}
          fill="rgba(248,113,113,0.08)" stroke={T.red} strokeWidth={1.5} strokeOpacity={0.5}
          filter="url(#glow-red)" />
        <text x={110} y={510} fill={T.red} fontSize={18}>{"\uD83C\uDF99\uFE0F"}</text>
        <text x={140} y={506} fill={T.red} fontSize={10}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          麦克风一直在监听（并行感知）→ 语音识别：指令 = "停"
        </text>
        <text x={140} y={522} fill={T.red} fontSize={10}
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
          → 立刻上报给决策模型！ {"\u26A1"}
        </text>
      </g>
    ),
  },
  {
    num: 7, y: 570, color: T.purple,
    title: "决策模型重新调度",
    content: (
      <g>
        <rect x={80} y={578} width={180} height={28} rx={7}
          fill="rgba(248,113,113,0.08)" stroke={T.red} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={170} y={596} fill={T.red} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{"\u2696\uFE0F"} 用户指令 {">"} 导航任务</text>
        <text x={272} y={596} fill={T.textDim} fontSize={14}>→</text>
        <rect x={290} y={578} width={100} height={28} rx={7}
          fill="rgba(167,139,250,0.08)" stroke={T.purple} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={340} y={596} fill={T.purple} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">中断导航</text>
      </g>
    ),
  },
  {
    num: 8, y: 650, color: T.green,
    title: "机器人停下 + 语音回应（并行输出）",
    content: (
      <g>
        <rect x={80} y={658} width={130} height={28} rx={7}
          fill="rgba(52,211,153,0.06)" stroke={T.green} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={145} y={676} fill={T.green} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{"\uD83E\uDDBF"} 停止运动</text>
        <rect x={224} y={658} width={185} height={28} rx={7}
          fill="rgba(52,211,153,0.06)" stroke={T.green} strokeWidth={0.8} strokeOpacity={0.4} />
        <text x={316} y={676} fill={T.green} fontSize={10} textAnchor="middle"
          fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{"\uD83D\uDD0A"} "好的，已停下来了"</text>
      </g>
    ),
  },
];

/** 右侧注解卡 */
function SideNote({ y, title, color, children }) {
  return (
    <g>
      <rect x={550} y={y} width={480} height={children.length * 22 + 40} rx={14}
        fill="rgba(15,23,42,0.8)" stroke={color} strokeWidth={1} strokeOpacity={0.3} />
      <text x={574} y={y + 26} fill={color} fontSize={13} fontWeight={700}
        fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{title}</text>
      {children.map((line, i) => (
        <g key={i}>
          <circle cx={580} cy={y + 48 + i * 22} r={4} fill={line.dotColor || color} opacity={0.8} />
          <text x={596} y={y + 52 + i * 22} fill={T.textDim} fontSize={11}
            fontFamily="Space Grotesk,Noto Sans SC,sans-serif">{line.text}</text>
        </g>
      ))}
    </g>
  );
}

function TimelineSection() {
  return (
    <section style={{ marginTop: 64 }}>
      <SectionHeader
        tag="SCENARIO"
        tagColor={T.green}
        title="完整场景：机器人去厨房，中途被打断"
      />
      <GlassCard glowColor={T.greenGlow} style={{ overflowX: "auto" }}>
        <svg viewBox="0 0 1060 700" width="100%" style={{ display: "block", minWidth: 900 }}
          xmlns="http://www.w3.org/2000/svg">
          <SvgDefs />

          {/* 时间线主干 */}
          <line x1={50} y1={20} x2={50} y2={680}
            stroke="url(#grad-timeline)" strokeWidth={3} strokeLinecap="round" />

          {/* 步骤 */}
          {STEPS.map((step) => (
            <g key={step.num}>
              {/* 节点圆 */}
              <circle cx={50} cy={step.y}
                r={step.isAlert ? 16 : 14}
                fill={step.isAlert ? "rgba(248,113,113,0.15)" : T.bg}
                stroke={step.color}
                strokeWidth={step.isAlert ? 3 : 2}
                filter={step.isAlert ? "url(#glow-red)" : undefined}
              />
              <text x={50} y={step.y + 4} fill={step.color}
                fontSize={step.isAlert ? 12 : 10} fontWeight={700}
                textAnchor="middle" fontFamily="Space Grotesk,sans-serif">
                {step.num}
              </text>

              {/* 标题 */}
              <text x={80} y={step.y - 3} fill={step.isAlert ? T.red : T.text}
                fontSize={14} fontWeight={700}
                fontFamily="Space Grotesk,Noto Sans SC,sans-serif">
                {step.title}
              </text>

              {/* 内容 */}
              {step.content}
            </g>
          ))}

          {/* ── 右侧注解 ── */}
          <SideNote y={30} title="关键理解：三层并行" color={T.indigo}>
            {[
              { dotColor: T.cyan,   text: "感知层并行：所有传感器同时采集，互不干扰" },
              { dotColor: T.purple, text: "调度层解耦：决策模型随时可以打断和重新分配" },
              { dotColor: T.green,  text: "执行层并行：多个执行器可同时响应" },
            ]}
          </SideNote>
          <SideNote y={162} title="为什么能被打断？" color={T.purple}>
            {[
              { text: "因为麦克风一直在并行工作" },
              { text: "决策模型随时接收新信息、随时重新决策" },
            ]}
          </SideNote>
          <SideNote y={252} title="如果是串行链条呢？" color={T.amber}>
            {[
              { text: "麦克风在链路上没位置" },
              { text: "机器人走完全程才能处理语音 → 无法打断" },
            ]}
          </SideNote>
        </svg>
      </GlassCard>
    </section>
  );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  5️⃣  图例 + 页脚
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const LEGEND_ITEMS = [
  { color: T.cyan,   label: "采集器（输入模态）" },
  { color: T.indigo, label: "世界模型（感知+局部规划）" },
  { color: T.purple, label: "决策模型（目标+调度）" },
  { color: T.amber,  label: "技能库（可执行模块）" },
  { color: T.green,  label: "执行器（输出模态）" },
  { color: T.red,    label: "中断事件" },
];

function Legend() {
  return (
    <div style={{
      display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap",
      marginTop: 40, padding: "16px 24px",
      background: T.bgCard,
      borderRadius: T.radiusSm,
      border: `1px solid ${T.border}`,
    }}>
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, fontWeight: 500, color: T.textDim,
        }}>
          <span style={{
            width: 10, height: 10, borderRadius: "50%",
            background: item.color,
            boxShadow: T.glow(item.color, 4),
          }} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "56px 24px 32px",
      fontSize: 13,
      color: T.textMuted,
    }}>
      具身智能项目 · 学习笔记 · 2026
    </footer>
  );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🏠  主应用
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function RobotArchitecture() {
  return (
    <>
      <GlobalStyles />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Hero />

        <main style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px" }}>
          {/* 1. 架构总览 */}
          <section style={{ marginTop: 56 }}>
            <SectionHeader
              tag="ARCHITECTURE"
              tagColor={T.indigo}
              title="系统架构总览"
              subtitle="采集器 → 模型组（大脑） → 执行器，全链路并行解耦"
            />
            <ArchitectureDiagram />
          </section>

          {/* 2. 边界对比 */}
          <BoundarySection />

          {/* 3. 场景时间线 */}
          <TimelineSection />

          {/* 图例 */}
          <Legend />
        </main>

        <Footer />
      </div>
    </>
  );
}
