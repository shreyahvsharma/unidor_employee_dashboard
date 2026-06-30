import { useState } from "react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "projects", label: "Projects", icon: "◈" },
  { id: "timesheet", label: "Timesheet", icon: "◷" },
  { id: "payroll", label: "Payroll", icon: "◎" },
  { id: "notifications", label: "Notifications", icon: "◆", badge: true },
  { id: "compliance", label: "Compliance & Leave", icon: "◉" },
  { id: "profile", label: "My Profile", icon: "◐" },
];

const COLORS = {
  bg: "#0A0D14", surface: "#111520", card: "#151C2C", border: "#1E2A42",
  accent: "#4F8EF7", accentSoft: "rgba(79,142,247,0.12)",
  teal: "#26D9C7", tealSoft: "rgba(38,217,199,0.12)",
  pink: "#F75EBF", pinkSoft: "rgba(247,94,191,0.12)",
  amber: "#F7A844", amberSoft: "rgba(247,168,68,0.12)",
  green: "#3DD68C", greenSoft: "rgba(61,214,140,0.12)",
  red: "#F75E5E", redSoft: "rgba(247,94,94,0.12)",
  purple: "#A78BFA", purpleSoft: "rgba(167,139,250,0.12)",
  text: "#E8EDF8", textMuted: "#6B7A99", textDim: "#3D4F72",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0A0D14; color: #E8EDF8; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0A0D14; }
  ::-webkit-scrollbar-thumb { background: #1E2A42; border-radius: 2px; }
  input, select, textarea { font-family: 'DM Sans', sans-serif; }
  .day-hover:hover { background: rgba(79,142,247,0.18) !important; border-color: #4F8EF7 !important; cursor: pointer; }
  .fade-in { animation: fi 0.16s ease; }
  @keyframes fi { from { opacity:0; transform:scale(0.96) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .nav-btn { transition: background 0.15s, color 0.15s; }
  .nav-btn:hover { background: rgba(79,142,247,0.07) !important; }
`;

// ── Primitives ────────────────────────────────────────────────────────────────
const Badge = ({ color, children, soft }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: soft ? COLORS[color + "Soft"] : COLORS[color], color: soft ? COLORS[color] : (color === "green" ? "#0A0D14" : "#fff") }}>{children}</span>
);
const Tag = ({ children, color = "accent" }) => (
  <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, background: COLORS[color + "Soft"], color: COLORS[color], fontWeight: 500 }}>{children}</span>
);
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20, transition: "border-color 0.2s", cursor: onClick ? "pointer" : "default", ...style }}
    onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = COLORS.accent)}
    onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = COLORS.border)}>{children}</div>
);
const Stat = ({ label, value, sub, color = "accent" }) => (
  <Card><div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "Syne", color: COLORS[color] }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{sub}</div>}</Card>
);
const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 700 }}>{children}</h2>
    {sub && <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{sub}</p>}
  </div>
);
const Input = ({ label, value, onChange, type = "text", disabled, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</label>
    <input type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} style={{ background: disabled ? "rgba(255,255,255,0.03)" : COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: disabled ? COLORS.textMuted : COLORS.text, fontSize: 13, outline: "none" }} />
  </div>
);
const SelectEl = ({ label, options, value, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</label>
    <select value={value} onChange={onChange} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
const Btn = ({ children, onClick, variant = "primary", small }) => {
  const s = { primary: { background: COLORS.accent, color: "#fff", border: "none" }, outline: { background: "transparent", color: COLORS.accent, border: `1px solid ${COLORS.accent}` }, ghost: { background: "transparent", color: COLORS.textMuted, border: `1px solid ${COLORS.border}` }, danger: { background: COLORS.red, color: "#fff", border: "none" }, success: { background: COLORS.green, color: "#0A0D14", border: "none" } };
  return <button onClick={onClick} style={{ ...s[variant], borderRadius: 8, padding: small ? "6px 14px" : "9px 18px", fontSize: small ? 12 : 13, fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans", transition: "opacity 0.15s" }}
    onMouseEnter={e => e.currentTarget.style.opacity = "0.82"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>{children}</button>;
};

// ── Projects data ─────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: 1, name: "Project Apollo", client: "Acme Corp", status: "active", role: "Senior Contributor", billable: true, rate: "$95/hr", payFreq: "Monthly", currency: "USD", start: "2026-01-15", end: "2026-06-30", pm: "Sarah Chen", desc: "Full-stack platform rebuild for client portal.", allowedWork: ["Development", "Code Review", "Architecture"], availability: "Available", hoursPerWeek: 40 },
  { id: 2, name: "Beta Analytics", client: "Fintech Inc", status: "active", role: "Reviewer", billable: true, rate: "$95/hr", payFreq: "Bi-weekly", currency: "USD", start: "2026-02-01", end: "2026-04-30", pm: "Marco Polo", desc: "Dashboard analytics overhaul.", allowedWork: ["Review", "QA"], availability: "Part-time", hoursPerWeek: 20 },
  { id: 3, name: "Gamma Design", client: "Startup XYZ", status: "draft", role: "Contributor", billable: false, rate: "Internal", payFreq: "Monthly", currency: "USD", start: "2026-03-10", end: null, pm: "Lena Rose", desc: "Internal design system.", allowedWork: ["Design Review"], availability: "Limited", hoursPerWeek: 8 },
];
const projColors = { 1: COLORS.accent, 2: COLORS.teal, 3: COLORS.purple };

// ── Notifications data ────────────────────────────────────────────────────────
const ALL_NOTIFS = [
  { id: 1, category: "Projects", icon: "◈", color: "accent", msg: "You've been assigned to Project Apollo", sub: "Role: Senior Contributor · Billable · $95/hr", time: "2m ago", unread: true },
  { id: 2, category: "Timesheet", icon: "◷", color: "green", msg: "Timesheet for Feb 2026 approved ✓", sub: "Net pay: $4,300 — payslip ready to download", time: "1h ago", unread: true },
  { id: 3, category: "Payroll", icon: "◎", color: "teal", msg: "Payslip for February 2026 generated", sub: "Gross: $4,820 · Deductions: $520 · Net: $4,300", time: "3h ago", unread: false },
  { id: 4, category: "Compliance", icon: "◉", color: "amber", msg: "Work Authorization expiring in 30 days", sub: "Upload renewed copy before Jun 15, 2026", time: "1d ago", unread: false },
  { id: 5, category: "Projects", icon: "◈", color: "accent", msg: "Beta Analytics deadline updated", sub: "New end date: Apr 30, 2026", time: "2d ago", unread: false },
  { id: 6, category: "Timesheet", icon: "◷", color: "red", msg: "Dec 2025 timesheet rejected", sub: "Reason: Insufficient overtime documentation", time: "3d ago", unread: false },
  { id: 7, category: "Payroll", icon: "◎", color: "teal", msg: "March 2026 payroll cycle is now open", sub: "Submit timesheet by Mar 29", time: "4d ago", unread: false },
];

// ── Day Log Popup ─────────────────────────────────────────────────────────────
const DayPopup = ({ day, month, year, data, onSave, onClose }) => {
  const [hours, setHours] = useState(data?.hours ?? "");
  const [startTime, setStartTime] = useState(data?.startTime ?? "09:00");
  const [workType, setWorkType] = useState(data?.workType ?? "Development");
  const [notes, setNotes] = useState(data?.notes ?? "");
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekday = new Date(year, month, day).toLocaleDateString("en-US", { weekday: "long" });
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade-in" style={{ background: COLORS.card, border: `1px solid ${COLORS.accent}`, borderRadius: 20, padding: 28, width: 390, boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17 }}>Log Hours</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>{weekday}, {monthNames[month]} {day}, {year}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textMuted, fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        {data?.leave && <div style={{ padding: "8px 12px", background: COLORS.amberSoft, borderRadius: 8, fontSize: 12, color: COLORS.amber, marginBottom: 14 }}>🌴 Leave already marked — you can overwrite or keep</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Start Time</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Total Hours</label>
              <input type="number" value={hours} onChange={e => setHours(e.target.value)} min={0} max={24} placeholder="e.g. 8" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Work Type</label>
            <select value={workType} onChange={e => setWorkType(e.target.value)} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none" }}>
              {["Development","Code Review","Architecture","Meetings","QA / Testing","Design Review","Documentation"].map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What did you work on?" rows={2} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, outline: "none", resize: "none" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Btn onClick={onClose} variant="ghost" small>Cancel</Btn>
          <Btn onClick={() => { onSave(day, { hours: Number(hours), startTime, workType, notes }); onClose(); }} small>Save Entry</Btn>
          <Btn onClick={() => { onSave(day, { leave: true, hours: 0 }); onClose(); }} variant="outline" small>Mark as Leave</Btn>
        </div>
      </div>
    </div>
  );
};

// ── Timesheet View ────────────────────────────────────────────────────────────
const TimesheetView = () => {
  const [tab, setTab] = useState("submit");
  const [selProj, setSelProj] = useState(1);
  const [calMonth, setCalMonth] = useState(2);
  const calYear = 2026;
  const [dayData, setDayData] = useState({
    3: { hours: 8, startTime: "09:00", workType: "Development", notes: "API setup" },
    4: { hours: 8, startTime: "09:00", workType: "Development", notes: "" },
    5: { hours: 7, startTime: "09:30", workType: "Code Review", notes: "" },
    6: { hours: 8, startTime: "09:00", workType: "Architecture", notes: "Planning session" },
    9: { hours: 8, startTime: "09:00", workType: "Development", notes: "Dashboard work" },
    10: { hours: 8, startTime: "09:00", workType: "Development", notes: "" },
    11: { leave: true, hours: 0 },
    12: { hours: 8, startTime: "09:00", workType: "QA / Testing", notes: "" },
    13: { hours: 8, startTime: "09:00", workType: "Meetings", notes: "Sprint review" },
  });
  const [popupDay, setPopupDay] = useState(null);
  const [expandedCycle, setExpandedCycle] = useState(null);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
  const totalHours = Object.values(dayData).reduce((a, b) => a + (b.hours || 0), 0);
  const leaveDays = Object.values(dayData).filter(d => d.leave).length;
  const loggedDays = Object.values(dayData).filter(d => d.hours > 0).length;

  const history = [
    { cycle: "Feb 2026", hours: 158, status: "Approved", gross: "$4,820", deductions: "$520", net: "$4,300", reason: null, days: { 2:{h:8,type:"Development"}, 3:{h:8,type:"Development"}, 4:{h:8,type:"Code Review"}, 5:{h:7,type:"Architecture"}, 6:{h:8,type:"Meetings"}, 9:{h:8,type:"Development"}, 10:{h:8,type:"Development"}, 11:{leave:true}, 12:{h:8,type:"QA"}, 13:{h:8,type:"Development"}, 16:{h:8,type:"Development"}, 17:{h:7.5,type:"Architecture"}, 18:{h:8,type:"Code Review"}, 19:{h:8,type:"Development"}, 20:{h:8,type:"Meetings"}, 23:{h:8,type:"Development"}, 24:{h:8,type:"Development"}, 25:{h:8,type:"Development"}, 26:{h:8,type:"Code Review"}, 27:{h:6.5,type:"Documentation"} } },
    { cycle: "Jan 2026", hours: 160, status: "Approved", gross: "$4,820", deductions: "$520", net: "$4,300", reason: null, days: { 5:{h:8,type:"Development"}, 6:{h:8,type:"Architecture"}, 7:{h:8,type:"Development"}, 8:{h:8,type:"Code Review"}, 9:{h:8,type:"Meetings"}, 12:{h:8,type:"Development"}, 13:{h:8,type:"Development"}, 14:{h:8,type:"QA"}, 15:{h:8,type:"Development"}, 16:{h:8,type:"Architecture"}, 19:{leave:true}, 20:{h:8,type:"Development"}, 21:{h:8,type:"Code Review"}, 22:{h:8,type:"Development"}, 23:{h:8,type:"Meetings"}, 26:{h:8,type:"Development"}, 27:{h:8,type:"Development"}, 28:{h:8,type:"Architecture"}, 29:{h:8,type:"Development"}, 30:{h:8,type:"Code Review"} } },
    { cycle: "Dec 2025", hours: 144, status: "Rejected", gross: "—", deductions: "—", net: "—", reason: "Insufficient documentation for overtime hours", days: { 1:{h:8,type:"Development"}, 2:{h:8,type:"Development"}, 3:{h:10,type:"Development",overtime:true}, 4:{h:8,type:"Code Review"}, 5:{h:8,type:"Architecture"} } },
  ];
  const activeProjects = PROJECTS.filter(p => p.status === "active");

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: COLORS.surface, borderRadius: 10, padding: 4, width: "fit-content" }}>
        {[["submit","Submit Timesheet"],["history","History & Payslips"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: tab===k ? COLORS.accent : "transparent", color: tab===k ? "#fff" : COLORS.textMuted, fontSize: 13, fontWeight: 500 }}>{l}</button>
        ))}
      </div>

      {tab === "submit" && (
        <div>
          {/* Project selector — clear unselected vs selected state */}
          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Select Project</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 14 }}>Choose which project to log hours against</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {activeProjects.map(p => {
                const active = selProj === p.id;
                return (
                  <button key={p.id} onClick={() => setSelProj(p.id)} style={{
                    padding: "12px 20px", borderRadius: 12, cursor: "pointer", fontFamily: "DM Sans", textAlign: "left",
                    border: active ? `2px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`,
                    background: active ? COLORS.accentSoft : COLORS.surface,
                    color: active ? COLORS.text : COLORS.textMuted, transition: "all 0.15s", position: "relative",
                  }}>
                    {active && <div style={{ position: "absolute", top: 8, right: 10, width: 8, height: 8, borderRadius: 4, background: COLORS.accent }} />}
                    <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? COLORS.accent : COLORS.textMuted }}>{p.name}</div>
                    <div style={{ fontSize: 11, marginTop: 3, color: active ? COLORS.textMuted : COLORS.textDim }}>{p.client} · {p.role}</div>
                    {!active && <div style={{ fontSize: 10, marginTop: 4, color: COLORS.textDim }}>Click to select</div>}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Calendar */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16 }}>{monthNames[calMonth]} {calYear}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                  Cycle: {monthNames[calMonth]} 1 → {monthNames[calMonth]} {daysInMonth} · <span style={{ color: COLORS.accent, fontWeight: 600 }}>{totalHours}h logged</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => setCalMonth(m => Math.max(0, m-1))} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 12px", color: COLORS.text, cursor: "pointer" }}>‹</button>
                <button onClick={() => setCalMonth(m => Math.min(11, m+1))} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 12px", color: COLORS.text, cursor: "pointer" }}>›</button>
                <Btn small variant="success" onClick={() => alert("Timesheet submitted!")}>Submit Cycle</Btn>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
              {[["accent","Hours logged"],["amber","Leave"],["green","Cycle deadline"],["textDim","Weekend"]].map(([c,l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[c] }} />
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>{l}</span>
                </div>
              ))}
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginBottom: 6 }}>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 10, color: COLORS.textMuted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", paddingBottom: 4 }}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                const data = dayData[d];
                const dow = (firstDay + d - 1) % 7;
                const isWeekend = dow >= 5;
                const isToday = d === 9 && calMonth === 2;
                const isDeadline = d === 29 && calMonth === 2;
                const isLeave = data?.leave;
                const hasHours = data?.hours > 0;
                let bg = "transparent", bc = COLORS.border, tc = isWeekend ? COLORS.textDim : COLORS.textMuted;
                if (isToday) { bg = COLORS.accent; bc = COLORS.accent; tc = "#fff"; }
                else if (isLeave) { bg = COLORS.amberSoft; bc = COLORS.amber; tc = COLORS.amber; }
                else if (hasHours) { bg = COLORS.accentSoft; bc = COLORS.accent; tc = COLORS.text; }
                else if (isDeadline) { bc = COLORS.green; tc = COLORS.green; }
                else if (isWeekend) { bg = "rgba(255,255,255,0.015)"; }
                return (
                  <div key={d} className={isWeekend ? "" : "day-hover"} onClick={() => !isWeekend && setPopupDay(d)}
                    style={{ borderRadius: 10, border: `1px solid ${bc}`, background: bg, padding: "7px 5px", minHeight: 64, transition: "all 0.12s", userSelect: "none" }}>
                    <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: tc, textAlign: "right", lineHeight: 1 }}>{d}</div>
                    {isLeave && <div style={{ fontSize: 10, color: COLORS.amber, textAlign: "center", marginTop: 5 }}>🌴 Leave</div>}
                    {hasHours && !isLeave && (
                      <div style={{ textAlign: "center", marginTop: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: isToday ? "#fff" : COLORS.accent, lineHeight: 1.1 }}>{data.hours}h</div>
                        <div style={{ fontSize: 9, color: isToday ? "rgba(255,255,255,0.75)" : COLORS.textMuted, marginTop: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "100%" }}>{data.workType?.split(" ")[0]}</div>
                      </div>
                    )}
                    {!hasHours && !isLeave && !isWeekend && !isToday && (
                      <div style={{ fontSize: 20, color: COLORS.textDim, textAlign: "center", marginTop: 4, lineHeight: 1 }}>+</div>
                    )}
                    {isDeadline && !hasHours && <div style={{ fontSize: 9, color: COLORS.green, textAlign: "center", marginTop: 4 }}>deadline</div>}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div style={{ marginTop: 16, padding: "12px 16px", background: COLORS.surface, borderRadius: 10, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
              <div><span style={{ fontSize: 11, color: COLORS.textMuted }}>Total Hours </span><span style={{ fontWeight: 700, color: COLORS.accent, fontSize: 15 }}>{totalHours}h</span></div>
              <div><span style={{ fontSize: 11, color: COLORS.textMuted }}>Leave Days </span><span style={{ fontWeight: 700, color: COLORS.amber }}>{leaveDays}</span></div>
              <div><span style={{ fontSize: 11, color: COLORS.textMuted }}>Days Logged </span><span style={{ fontWeight: 700, color: COLORS.green }}>{loggedDays}</span></div>
              <div style={{ marginLeft: "auto" }}><Btn variant="ghost" small>Save Draft</Btn></div>
            </div>
          </Card>
        </div>
      )}

      {tab === "history" && (
        <div>
          <SectionTitle sub="Click any cycle to expand the daily hour breakdown">Timesheet & Payslip History</SectionTitle>
          {history.map((h, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div onClick={() => setExpandedCycle(expandedCycle === i ? null : i)} style={{ background: COLORS.card, border: `1px solid ${expandedCycle===i ? COLORS.accent : COLORS.border}`, borderRadius: expandedCycle===i ? "16px 16px 0 0" : 16, padding: "16px 20px", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "Syne", fontWeight: 600, fontSize: 15 }}>{h.cycle}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{h.hours}h logged · {Object.values(h.days).filter(d => d.leave).length > 0 ? `${Object.values(h.days).filter(d => d.leave).length} leave day(s)` : "no leave"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    {h.status === "Approved" && (
                      <>
                        <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: COLORS.textMuted }}>Gross</div><div style={{ fontWeight: 600 }}>{h.gross}</div></div>
                        <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: COLORS.textMuted }}>Deductions</div><div style={{ fontWeight: 600, color: COLORS.red }}>{h.deductions}</div></div>
                        <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: COLORS.textMuted }}>Net Pay</div><div style={{ fontWeight: 700, color: COLORS.green, fontSize: 18 }}>{h.net}</div></div>
                      </>
                    )}
                    <Badge color={h.status === "Approved" ? "green" : "red"} soft>{h.status}</Badge>
                    {h.status === "Approved" && <Btn small variant="outline" onClick={e => e.stopPropagation()}>⬇ Payslip</Btn>}
                    <span style={{ color: COLORS.textMuted, fontSize: 13, display: "inline-block", transform: expandedCycle===i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                  </div>
                </div>
                {h.reason && <div style={{ marginTop: 10, padding: "7px 12px", background: COLORS.redSoft, borderRadius: 8, fontSize: 12, color: COLORS.red }}>⚠ {h.reason}</div>}
              </div>
              {expandedCycle === i && (
                <div className="fade-in" style={{ background: COLORS.surface, border: `1px solid ${COLORS.accent}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: 20 }}>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Daily Breakdown — {h.cycle}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
                    {Object.entries(h.days).map(([day, info]) => (
                      <div key={day} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${info.leave ? COLORS.amber : info.overtime ? COLORS.red : COLORS.border}`, background: info.leave ? COLORS.amberSoft : info.overtime ? COLORS.redSoft : COLORS.card }}>
                        <div style={{ fontSize: 10, color: COLORS.textMuted }}>Day {day}</div>
                        {info.leave
                          ? <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.amber, marginTop: 3 }}>🌴 Leave</div>
                          : <><div style={{ fontSize: 16, fontWeight: 700, color: info.overtime ? COLORS.red : COLORS.accent, marginTop: 3 }}>{info.h}h {info.overtime ? "⚡" : ""}</div>
                            <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{info.type}</div></>
                        }
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, padding: "10px 14px", background: COLORS.card, borderRadius: 10, display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: COLORS.textMuted }}>Total: <b style={{ color: COLORS.accent }}>{h.hours}h</b></span>
                    <span style={{ fontSize: 12, color: COLORS.textMuted }}>Leave: <b style={{ color: COLORS.amber }}>{Object.values(h.days).filter(d => d.leave).length}d</b></span>
                    {h.status === "Approved" && <span style={{ fontSize: 12, color: COLORS.textMuted }}>Net Pay: <b style={{ color: COLORS.green }}>{h.net}</b></span>}
                    {h.status === "Approved" && <span style={{ fontSize: 12, color: COLORS.textMuted }}>Deductions: <b style={{ color: COLORS.red }}>{h.deductions}</b></span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {popupDay && <DayPopup day={popupDay} month={calMonth} year={calYear} data={dayData[popupDay]} onSave={(d, val) => setDayData(prev => ({ ...prev, [d]: val }))} onClose={() => setPopupDay(null)} />}
    </div>
  );
};

// ── Dashboard payroll calendar (full-width, project filter) ───────────────────
const PayrollCalendar = () => {
  const [selProj, setSelProj] = useState("all");
  const daysInMonth = 31;
  const firstDay = (new Date(2026, 2, 1).getDay() + 6) % 7;
  const dayEntries = {
    3:[{pid:1,h:8}], 4:[{pid:1,h:8}], 5:[{pid:1,h:7},{pid:2,h:1}],
    6:[{pid:2,h:8}], 9:[{pid:1,h:8}], 10:[{pid:1,h:6},{pid:2,h:2}],
    11:[{pid:0,leave:true}], 12:[{pid:1,h:8}], 13:[{pid:1,h:8}],
    16:[{pid:2,h:8}], 17:[{pid:1,h:8}], 18:[{pid:1,h:8}],
  };
  const filtered = entries => {
    if (!entries) return [];
    if (selProj === "all") return entries;
    return entries.filter(e => e.pid === Number(selProj));
  };
  const activeProjects = PROJECTS.filter(p => p.status === "active");

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16 }}>March 2026 · Payroll Calendar</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>Full cycle: Mar 1 → Mar 31 · Submit by Mar 29</div>
        </div>
        <select value={selProj} onChange={e => setSelProj(e.target.value)} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "7px 12px", color: COLORS.text, fontSize: 13, outline: "none", cursor: "pointer" }}>
          <option value="all">All Projects</option>
          {activeProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        {activeProjects.map(p => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: projColors[p.id] }} />
            <span style={{ fontSize: 11, color: COLORS.textMuted }}>{p.name}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.amber }} />
          <span style={{ fontSize: 11, color: COLORS.textMuted }}>Leave</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.green }} />
          <span style={{ fontSize: 11, color: COLORS.textMuted }}>Deadline</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginBottom: 6 }}>
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", paddingBottom: 4 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const entries = filtered(dayEntries[d]);
          const isToday = d === 9;
          const isDeadline = d === 29;
          const dow = (firstDay + d - 1) % 7;
          const isWeekend = dow >= 5;
          const isLeave = dayEntries[d]?.[0]?.leave;
          const totalH = entries.reduce((a, e) => a + (e.h || 0), 0);
          return (
            <div key={d} style={{ borderRadius: 10, border: `1px solid ${isToday ? COLORS.accent : isDeadline ? COLORS.green : isLeave ? COLORS.amber : COLORS.border}`, background: isToday ? COLORS.accent : isWeekend ? "rgba(255,255,255,0.015)" : isLeave ? COLORS.amberSoft : "transparent", padding: "7px 5px", minHeight: 56 }}>
              <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? "#fff" : isDeadline ? COLORS.green : COLORS.textMuted, textAlign: "right" }}>{d}</div>
              {isLeave && <div style={{ fontSize: 10, color: COLORS.amber, textAlign: "center", marginTop: 4 }}>🌴</div>}
              {!isLeave && entries.length > 0 && (
                <>
                  {entries.map((e, i) => (
                    <div key={i} style={{ height: 4, borderRadius: 2, background: projColors[e.pid] || COLORS.accent, marginTop: i===0 ? 5 : 2 }} />
                  ))}
                  <div style={{ fontSize: 10, color: isToday ? "rgba(255,255,255,0.8)" : COLORS.textMuted, textAlign: "center", marginTop: 4, fontWeight: 600 }}>{totalH}h</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const DashboardView = ({ setView }) => (
  <div>
    <div style={{ background: `linear-gradient(135deg, ${COLORS.accentSoft}, ${COLORS.tealSoft})`, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "24px 28px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Good morning 👋</div>
        <h1 style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 800 }}>Jordan Rivera</h1>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>Senior Developer · Acme Corp</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, color: COLORS.textMuted }}>Current Pay Cycle</div>
        <div style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: COLORS.teal }}>Mar 1–31</div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>18 days remaining</div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
      <Stat label="Hours This Cycle" value="62h" sub="of 160h" color="accent" />
      <Stat label="Active Projects" value="2" sub="Apollo + Beta Analytics" color="teal" />
      <Stat label="Last Payslip" value="$4,300" sub="Feb 2026 · Net" color="green" />
      <Stat label="Leave Balance" value="12d" sub="Annual leave" color="amber" />
    </div>

    <div style={{ marginBottom: 24 }}><PayrollCalendar /></div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "Syne", fontWeight: 600 }}>Timesheet History</div>
          <Btn onClick={() => setView("timesheet")} small variant="ghost">View All</Btn>
        </div>
        {[{cycle:"Feb 2026",hours:158,status:"Approved",pay:"$4,300"},{cycle:"Jan 2026",hours:160,status:"Approved",pay:"$4,300"},{cycle:"Dec 2025",hours:144,status:"Rejected",pay:"—"}].map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
            <div><div style={{ fontSize: 13, fontWeight: 500 }}>{t.cycle}</div><div style={{ fontSize: 11, color: COLORS.textMuted }}>{t.hours}h logged</div></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>{t.pay}</span>
              <Badge color={t.status==="Approved"?"green":"red"} soft>{t.status}</Badge>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 14 }}>Quick Actions</div>
        {[
          {label:"Submit March Timesheet",sub:"Deadline: Mar 29",act:"timesheet",color:"accent"},
          {label:"View Active Projects",sub:"2 projects active",act:"projects",color:"teal"},
          {label:"Download Feb Payslip",sub:"Approved · $4,300 net",act:"payroll",color:"green"},
          {label:"Compliance Alert",sub:"Visa expiring Jun 2026",act:"compliance",color:"amber"},
        ].map((a, i) => (
          <div key={i} onClick={() => setView(a.act)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }}>
            <div><div style={{ fontSize: 13, fontWeight: 500, color: COLORS[a.color] }}>{a.label}</div><div style={{ fontSize: 11, color: COLORS.textMuted }}>{a.sub}</div></div>
            <span style={{ color: COLORS.textMuted }}>›</span>
          </div>
        ))}
      </Card>
    </div>
  </div>
);

// ── Projects ──────────────────────────────────────────────────────────────────
const ProjectsView = () => {
  const [sel, setSel] = useState(null);
  const proj = sel ? PROJECTS.find(p => p.id === sel) : null;
  if (proj) return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Btn onClick={() => setSel(null)} small variant="ghost">← Back</Btn>
        <h2 style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700 }}>{proj.name}</h2>
        <Badge color={proj.status==="active"?"green":"amber"} soft>{proj.status}</Badge>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 14, color: COLORS.accent }}>◈ Project Details</div>
          {[["Project Name",proj.name],["Client",proj.client],["Project Manager",proj.pm],["Status",proj.status],["Start Date",proj.start],["End Date",proj.end||"Ongoing"]].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
              <span style={{ color: COLORS.textMuted }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, fontSize: 13, color: COLORS.textMuted }}>{proj.desc}</div>
        </Card>
        <Card>
          <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 14, color: COLORS.teal }}>◷ My Assignment & Payment</div>
          {[["Role",proj.role],["Billable",proj.billable?"Yes":"No"],["Rate",proj.rate],["Pay Frequency",proj.payFreq],["Currency",proj.currency],["Hours/Week",`${proj.hoursPerWeek}h`],["Availability",proj.availability]].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
              <span style={{ color: COLORS.textMuted }}>{k}</span>
              <span style={{ fontWeight: 500, color: v==="Yes"?COLORS.green:v==="No"?COLORS.red:COLORS.text }}>{v}</span>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 14, color: COLORS.amber }}>Allowed Work Types</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{proj.allowedWork.map(w => <Tag key={w} color="amber">{w}</Tag>)}</div>
        </Card>
        <Card style={{ background: COLORS.accentSoft, border: `1px solid ${COLORS.accent}` }}>
          <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 8 }}>Submit Timesheet</div>
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 14 }}>March 2026 cycle · Deadline: Mar 29</div>
          <Btn>Log Hours for This Project →</Btn>
        </Card>
      </div>
    </div>
  );
  return (
    <div>
      <SectionTitle sub="Projects you're assigned to">My Projects</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {PROJECTS.map(p => (
          <Card key={p.id} onClick={() => setSel(p.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>{p.name}</div>
              <Badge color={p.status==="active"?"green":"amber"} soft>{p.status}</Badge>
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12 }}>{p.client}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <Tag color="accent">{p.role}</Tag>
              {p.billable && <Tag color="green">Billable</Tag>}
              <Tag color="teal">{p.rate}</Tag>
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, display: "flex", justifyContent: "space-between" }}>
              <span>PM: {p.pm}</span><span>{p.hoursPerWeek}h/week</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── Payroll ───────────────────────────────────────────────────────────────────
const PayrollView = () => (
  <div>
    <SectionTitle sub="Your compensation and payroll configuration">Payroll Overview</SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
      <Stat label="Gross Salary" value="$4,820" sub="Monthly · Fixed" color="accent" />
      <Stat label="Deductions" value="$520" sub="Tax + Benefits" color="red" />
      <Stat label="Net Pay" value="$4,300" sub="Last payslip" color="green" />
      <Stat label="YTD Earned" value="$12,900" sub="Jan–Mar 2026" color="teal" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <Card>
        <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 14, color: COLORS.accent }}>Compensation Config</div>
        {[["Salary Type","Fixed Monthly"],["Gross Rate","$4,820/mo"],["Currency","USD"],["Payroll Frequency","Monthly"],["Overtime Eligible","Yes"],["Tax Filing Status","Single"],["Allowances","Internet: $50, Phone: $30"]].map(([k,v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
            <span style={{ color: COLORS.textMuted }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </Card>
      <Card>
        <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 14, color: COLORS.teal }}>Bank Details</div>
        {[["Bank Name","Chase Bank"],["Account Number","••••••4729"],["SWIFT / Routing","021000021"],["Account Type","Checking"]].map(([k,v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
            <span style={{ color: COLORS.textMuted }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: 14 }}><Btn small variant="outline">Update Bank Details</Btn></div>
      </Card>
    </div>
  </div>
);

// ── Notifications ─────────────────────────────────────────────────────────────
const NotificationsView = () => {
  const [filter, setFilter] = useState("All");
  const cats = ["All","Projects","Timesheet","Payroll","Compliance"];
  const shown = filter==="All" ? ALL_NOTIFS : ALL_NOTIFS.filter(n => n.category===filter);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <SectionTitle sub="All activity across projects, timesheets, payroll and compliance">Notifications</SectionTitle>
        <Tag color="red">{ALL_NOTIFS.filter(n=>n.unread).length} unread</Tag>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter===c?COLORS.accent:COLORS.border}`, background: filter===c?COLORS.accentSoft:"transparent", color: filter===c?COLORS.accent:COLORS.textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {shown.map(n => (
          <div key={n.id} style={{ background: n.unread ? COLORS.card : COLORS.surface, borderLeft: `3px solid ${n.unread ? COLORS[n.color] : COLORS.border}`, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS[n.color+"Soft"], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: COLORS[n.color], flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: n.unread?600:400 }}>{n.msg}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>{n.sub}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: 12, flexShrink: 0 }}>
                  {n.unread && <div style={{ width: 7, height: 7, borderRadius: 4, background: COLORS[n.color] }} />}
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>{n.time}</span>
                  <Tag color={n.color}>{n.category}</Tag>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Compliance & Leave ────────────────────────────────────────────────────────
const ComplianceView = () => {
  const [tab, setTab] = useState("compliance");
  return (
    <div>
      <SectionTitle sub="Country compliance rules, legal documents, and your leave policies">Compliance & Leave Policies</SectionTitle>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: COLORS.surface, borderRadius: 10, padding: 4, width: "fit-content" }}>
        {[["compliance","Compliance & Legal"],["leave","Leave Policies"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: tab===k?COLORS.accent:"transparent", color: tab===k?"#fff":COLORS.textMuted, fontSize: 13, fontWeight: 500 }}>{l}</button>
        ))}
      </div>
      {tab === "compliance" && (
        <div>
          <Card style={{ marginBottom: 20, background: `linear-gradient(135deg, ${COLORS.accentSoft}, ${COLORS.tealSoft})`, border: `1px solid ${COLORS.accent}` }}>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>🇺🇸 United States · California</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>Governed by US Federal law + California state regulations</div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Card>
              <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 14, color: COLORS.amber }}>◉ Applied Rules</div>
              {[["Leave Policy","US PTO Standard — 15d/yr"],["Holiday Calendar","US Federal + CA Holidays"],["Timesheet Policy","Weekly submit, monthly approval"],["Approval Workflow","Line Manager → HR"],["Overtime Rule","1.5× after 8h/day (CA Law)"],["Tax Withholding","W-4 Federal + CA DE-4"],["Work Authorization","US Citizen / Permanent Resident"]].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                  <span style={{ color: COLORS.textMuted }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 14, color: COLORS.pink }}>Compliance Documents</div>
              {[{name:"Government ID",status:"Verified",due:null},{name:"Employment Contract",status:"Signed",due:null},{name:"W-4 Tax Form",status:"On File",due:null},{name:"Bank Proof",status:"Verified",due:null},{name:"Work Authorization",status:"Expiring",due:"Jun 15 2026"}].map((d,i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</div>
                    {d.due && <div style={{ fontSize: 11, color: COLORS.red }}>Expires: {d.due}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Badge color={d.status==="Expiring"?"amber":"green"} soft>{d.status}</Badge>
                    {d.status==="Expiring" && <Btn small variant="danger">Upload</Btn>}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
      {tab === "leave" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            <Stat label="Annual Leave" value="12d" sub="of 15d remaining" color="green" />
            <Stat label="Sick Leave" value="5d" sub="of 10d remaining" color="teal" />
            <Stat label="Public Holidays" value="8" sub="remaining in 2026" color="accent" />
            <Stat label="Taken YTD" value="3d" sub="Jan–Mar 2026" color="amber" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Card>
              <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 14, color: COLORS.green }}>Policy · US PTO Standard</div>
              {[["Policy Type","Paid Time Off (PTO)"],["Annual Entitlement","15 days / year"],["Sick Leave","10 days / year"],["Carry Forward","Up to 5 days"],["Approval Required","Manager → HR"],["Notice Period","2 weeks for planned leave"],["Public Holidays","US Federal + CA (16 days)"],["Unpaid Leave","Available with manager approval"]].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                  <span style={{ color: COLORS.textMuted }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 14, color: COLORS.teal }}>Leave History 2026</div>
              {[{type:"Annual Leave",date:"Jan 19",days:1,status:"Approved"},{type:"Sick Leave",date:"Feb 11",days:1,status:"Approved"},{type:"Annual Leave",date:"Mar 11",days:1,status:"Approved"}].map((l,i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{l.type}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{l.date} · {l.days}d</div>
                  </div>
                  <Badge color="green" soft>{l.status}</Badge>
                </div>
              ))}
              <div style={{ marginTop: 16 }}><Btn small>Request Leave</Btn></div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Profile ───────────────────────────────────────────────────────────────────
const ProfileView = () => {
  const [tab, setTab] = useState("personal");
  const tabs = [["personal","Personal Info"],["legal","Legal & Tax ID"],["employment","Employment"],["payroll","Payroll & Bank"],["documents","Documents"]];
  return (
    <div>
      <SectionTitle sub="View and edit your profile information">My Profile</SectionTitle>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: COLORS.surface, borderRadius: 10, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
        {tabs.map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: tab===k?COLORS.accent:"transparent", color: tab===k?"#fff":COLORS.textMuted, fontSize: 12, fontWeight: 500 }}>{l}</button>
        ))}
      </div>
      {tab==="personal" && <Card><div style={{ display:"flex",justifyContent:"space-between",marginBottom:20 }}><div style={{ fontFamily:"Syne",fontWeight:600 }}>Personal Details</div><Btn small>Save Changes</Btn></div><div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}><Input label="Full Legal Name" value="Jordan Rivera" disabled /><Input label="Date of Birth" value="1992-05-14" disabled /><Input label="Gender" value="Non-binary" /><Input label="Nationality" value="American" disabled /><Input label="Personal Email" value="jordan.r@gmail.com" /><Input label="Work Email (system)" value="jordan@acme.com" disabled /><Input label="Phone Number" value="+1 (555) 234-8901" /><Input label="Current Address" value="123 Maple St, San Francisco" /><Input label="Country of Residence" value="United States" disabled /><Input label="State / Region" value="California" /><Input label="Postal Code" value="94103" /></div><div style={{ marginTop:12,padding:"8px 12px",background:COLORS.amberSoft,borderRadius:8,fontSize:12,color:COLORS.amber }}>ℹ Greyed fields are system-controlled. Contact HR to change.</div></Card>}
      {tab==="legal" && <Card><div style={{ display:"flex",justifyContent:"space-between",marginBottom:20 }}><div style={{ fontFamily:"Syne",fontWeight:600 }}>Government & Tax ID</div><Btn small>Save Changes</Btn></div><div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}><Input label="National ID Number" value="••••••7823" /><Input label="Social Security Number" value="•••-••-1234" /><Input label="Tax ID Number" value="••-•••1234" /><Input label="Passport Number" value="P12345678" /><Input label="Visa Type" value="H-1B" /><Input label="Work Auth Status" value="Authorized" disabled /><Input label="Visa Expiry" value="2026-06-15" type="date" /><Input label="Permit Expiry" value="2026-06-15" type="date" /></div></Card>}
      {tab==="employment" && <Card><div style={{ fontFamily:"Syne",fontWeight:600,marginBottom:20 }}>Employment Setup</div><div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}><SelectEl label="Employment Type" options={[{value:"fulltime",label:"Full-time"},{value:"contract",label:"Contract"},{value:"freelance",label:"Freelance"}]} value="fulltime" /><Input label="Job Title" value="Senior Developer" disabled /><Input label="Department" value="Engineering" disabled /><Input label="Reporting Manager" value="Sarah Chen" disabled /><Input label="Start Date" value="2024-01-15" disabled /><Input label="End Date" value="—" disabled /><Input label="Work Location" value="United States" disabled /><SelectEl label="Work Mode" options={[{value:"remote",label:"Remote"},{value:"hybrid",label:"Hybrid"},{value:"onsite",label:"On-site"}]} value="remote" /></div><div style={{ fontFamily:"Syne",fontWeight:600,marginBottom:14 }}>Policy Mapping</div><div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>{[["Leave Policy","US PTO Standard"],["Holiday Calendar","US Federal + CA"],["Timesheet Policy","Weekly Submit"],["Approval Workflow","Manager → HR"],["Overtime Rule","CA 1.5× Rule"]].map(([k,v]) => <Input key={k} label={k} value={v} disabled />)}</div></Card>}
      {tab==="payroll" && <Card><div style={{ fontFamily:"Syne",fontWeight:600,marginBottom:20 }}>Payroll & Bank Details</div><div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}><SelectEl label="Salary Type" options={[{value:"fixed",label:"Fixed Monthly"},{value:"hourly",label:"Hourly"},{value:"project",label:"Project-based"}]} value="fixed" /><Input label="Gross Salary" value="$4,820" disabled /><Input label="Currency" value="USD" disabled /><SelectEl label="Payroll Frequency" options={[{value:"monthly",label:"Monthly"},{value:"biweekly",label:"Bi-weekly"},{value:"weekly",label:"Weekly"}]} value="monthly" /><Input label="Tax Filing Status" value="Single" /><Input label="Allowances" value="Internet $50, Phone $30" /><Input label="Overtime Eligible" value="Yes" disabled /></div><div style={{ fontFamily:"Syne",fontWeight:600,marginBottom:14 }}>Bank Information</div><div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}><Input label="Bank Name" value="Chase Bank" /><Input label="Account Number" value="••••••4729" /><Input label="SWIFT / Routing" value="021000021" /><Input label="Account Type" value="Checking" /></div><div style={{ marginTop:16 }}><Btn>Save Bank Details</Btn></div></Card>}
      {tab==="documents" && <Card><div style={{ fontFamily:"Syne",fontWeight:600,marginBottom:20 }}>Required Documents</div>{[{name:"Government ID Copy",status:"Uploaded",date:"Jan 2024"},{name:"Signed Employment Contract",status:"Uploaded",date:"Jan 2024"},{name:"Tax Form (W-4)",status:"Uploaded",date:"Jan 2024"},{name:"Bank Proof",status:"Uploaded",date:"Jan 2024"},{name:"Visa Copy",status:"Needs Update",date:null}].map((d,i) => (<div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${COLORS.border}` }}><div><div style={{ fontSize:14,fontWeight:500 }}>{d.name}</div>{d.date&&<div style={{ fontSize:11,color:COLORS.textMuted }}>Uploaded: {d.date}</div>}</div><div style={{ display:"flex",gap:10,alignItems:"center" }}><Badge color={d.status==="Uploaded"?"green":"red"} soft>{d.status}</Badge><Btn small variant={d.status==="Uploaded"?"ghost":"danger"}>{d.status==="Uploaded"?"Re-upload":"Upload Now"}</Btn></div></div>))}</Card>}
    </div>
  );
};

// ── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("dashboard");
  const unread = ALL_NOTIFS.filter(n => n.unread).length;
  const VIEWS = { dashboard: <DashboardView setView={setView} />, projects: <ProjectsView />, timesheet: <TimesheetView />, payroll: <PayrollView />, notifications: <NotificationsView />, compliance: <ComplianceView />, profile: <ProfileView /> };
  const titleMap = { dashboard: "Dashboard", projects: "Projects", timesheet: "Timesheet", payroll: "Payroll", notifications: "Notifications", compliance: "Compliance & Leave", profile: "My Profile" };

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg }}>
        {/* Sidebar */}
        <div style={{ width: 226, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
          <div style={{ padding: "20px 20px 16px" }}>
            <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>work<span style={{ color: COLORS.accent }}>flow</span></div>
            <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>Employee Portal</div>
          </div>
          <div style={{ padding: "12px 16px", margin: "0 8px 12px", background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne", fontWeight: 700, fontSize: 13 }}>JR</div>
              <div><div style={{ fontSize: 12, fontWeight: 600 }}>Jordan Rivera</div><div style={{ fontSize: 10, color: COLORS.textMuted }}>Senior Developer</div></div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "0 8px" }}>
            {NAV_ITEMS.map(item => {
              const isActive = view === item.id;
              return (
                <button key={item.id} onClick={() => setView(item.id)} className="nav-btn" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: isActive ? COLORS.accentSoft : "transparent", color: isActive ? COLORS.accent : COLORS.textMuted, fontSize: 13, fontWeight: isActive ? 600 : 400, marginBottom: 2, textAlign: "left" }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && unread > 0 && (
                    <span style={{ background: COLORS.red, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{unread}</span>
                  )}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: 16, borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>v2.4.1 · Mar 2026</div>
          </div>
        </div>

        {/* Main */}
        <div style={{ marginLeft: 226, flex: 1 }}>
          <div style={{ height: 56, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
            <div style={{ fontFamily: "Syne", fontWeight: 600, fontSize: 15 }}>{titleMap[view]}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>Mon, Mar 9 2026</div>
              <button onClick={() => setView("notifications")} style={{ position: "relative", background: view==="notifications"?COLORS.accentSoft:"transparent", border: `1px solid ${view==="notifications"?COLORS.accent:COLORS.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>
                🔔
                {unread > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, background: COLORS.red, borderRadius: 4 }} />}
              </button>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne", fontWeight: 700, fontSize: 12 }}>JR</div>
            </div>
          </div>
          <div style={{ padding: 24 }}>{VIEWS[view]}</div>
        </div>
      </div>
    </>
  );
}
