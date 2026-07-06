import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IcoClient,
  IcoStaff,
  IcoInventory,
} from "../../../components/icon/AdminIcons";

/* ── Palette ── */
const NAVY     = "#1E3A5F";
const NAVY_D   = "#13253E";
const NAVY_L   = "#2A5488";
const ORANGE   = "#FF8A00";
const ORANGE_B = "#FFF4E6";

// Calendar Icon Component
const IcoCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const BLUE     = "#3B82F6";
const BLUE_B   = "#EFF6FF";
const PURPLE   = "#8B5CF6";
const PURPLE_B = "#F5F3FF";
const GREEN    = "#10B981";
const GREEN_B  = "#ECFDF5";
const RED      = "#EF4444";
const RED_B    = "#FEF2F2";
const SLATE    = "#64748B";
const LIGHT    = "#F8FAFC";
const WHITE    = "#FFFFFF";
const BORDER   = "rgba(30,58,95,0.08)";

/* ── Static Data ── */
const ALL_RECORDS = [
  { id:1, name:"Maria Santos",   date:"2026-10-08", category:"Family Planning", status:"Pending",     priority:"High"   },
  { id:2, name:"Juan Dela Cruz", date:"2026-10-10", category:"Consultation",    status:"In Progress", priority:"Medium" },
  { id:3, name:"Ana Reyes",      date:"2026-10-12", category:"Prenatal Care",   status:"Completed",   priority:"High"   },
  { id:4, name:"Pedro Lim",      date:"2026-10-15", category:"Vaccination",     status:"Cancelled",   priority:"Low"    },
  { id:5, name:"Liza Garcia",    date:"2026-10-18", category:"Check-up",        status:"In Progress", priority:"Medium" },
];

const ACTIVITY = [
  { label:"Maria booked a consultation",   time:"2 min ago",  color:ORANGE },
  { label:"Juan completed his check-up",   time:"15 min ago", color:GREEN  },
  { label:"Ana's prenatal record updated", time:"1 hr ago",   color:BLUE   },
  { label:"Pedro cancelled appointment",   time:"2 hr ago",   color:RED    },
];

const SUMMARY = [
  { label:"New Registrations",  val:"23" },
  { label:"Appointments Today", val:"41" },
  { label:"Completed Sessions", val:"38" },
  { label:"Pending Reviews",    val:"7"  },
];

const STATUS_CFG = {
  "Pending":     { bg:ORANGE_B, color:ORANGE },
  "In Progress": { bg:GREEN_B,  color:GREEN  },
  "Completed":   { bg:BLUE_B,   color:BLUE   },
  "Cancelled":   { bg:RED_B,    color:RED    },
};

/* ── Area Chart ── */
const chartMap = {
  "All Services":    { Oct:[20,35,30,75,52,65,90], Nov:[28,42,38,80,60,72,95], Dec:[35,50,45,88,68,82,100] },
  "Family Planning": { Oct:[15,25,20,55,40,48,65], Nov:[20,30,25,62,45,55,72], Dec:[25,38,32,70,52,65,80]  },
  "Consultations":   { Oct:[8,18,15,38,28,32,45],  Nov:[12,22,18,44,32,38,52], Dec:[15,28,22,50,40,46,60]  },
};
const MONTHS   = ["Oct","Nov","Dec"];
const SERVICES = ["All Services","Family Planning","Consultations"];

function AreaChart({ service, month }) {
  const [tip, setTip] = useState(null);
  const vals = chartMap[service]?.[month] ?? chartMap["All Services"]["Oct"];
  const days  = [1,5,10,15,20,25,30];
  const W=440, H=110, PL=28, PR=8, PT=8, PB=20;
  const iW=W-PL-PR, iH=H-PT-PB;
  const xOf = i => PL+(i/6)*iW;
  const yOf = v => PT+iH-(v/100)*iH;
  const stroke = vals.map((v,i)=>`${i===0?"M":"L"}${xOf(i)},${yOf(v)}`).join(" ");
  const area   = `${stroke} L${xOf(6)},${PT+iH} L${xOf(0)},${PT+iH} Z`;
  return (
    <div style={{position:"relative",width:"100%"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
        <defs>
          <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.20"/>
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0,25,50,75,100].map(v=>(
          <g key={v}>
            <line x1={PL} y1={yOf(v)} x2={W-PR} y2={yOf(v)} stroke={BORDER} strokeDasharray="3 3"/>
            <text x={PL-3} y={yOf(v)+3} textAnchor="end" fontSize="7" fill="#94a3b8">{v}%</text>
          </g>
        ))}
        {days.map((d,i)=>(
          <text key={i} x={xOf(i)} y={H-4} textAnchor="middle" fontSize="7" fill="#94a3b8">{d}</text>
        ))}
        <path d={area} fill="url(#aGrad)"/>
        <path d={stroke} fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {tip!==null && <line x1={xOf(tip)} y1={PT} x2={xOf(tip)} y2={PT+iH} stroke={ORANGE} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>}
        {vals.map((v,i)=>(
          <circle key={i} cx={xOf(i)} cy={yOf(v)} r={tip===i?5:3}
            fill={tip===i?ORANGE:WHITE} stroke={ORANGE} strokeWidth="1.5"
            style={{cursor:"pointer"}}
            onMouseEnter={()=>setTip(i)} onMouseLeave={()=>setTip(null)}
          />
        ))}
      </svg>
      {tip!==null && (
        <div style={{
          position:"absolute",
          left:`calc(${(xOf(tip)/W)*100}% - 40px)`,
          top:Math.max(0, yOf(vals[tip])-42),
          background:WHITE, border:`1px solid ${BORDER}`,
          borderRadius:6, padding:"4px 8px",
          boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
          fontSize:10, pointerEvents:"none", zIndex:30, whiteSpace:"nowrap"
        }}>
          <div style={{color:NAVY}}>Day {days[tip]}</div>
          <div style={{color:ORANGE}}>{vals[tip]}%</div>
        </div>
      )}
    </div>
  );
}

/* ── Donut Chart ── */
const DONUT = [
  { name:"Family Planning", pct:45, color:ORANGE },
  { name:"Consultations",   pct:25, color:BLUE   },
  { name:"Immunizations",   pct:20, color:PURPLE  },
  { name:"Prenatal Care",   pct:10, color:GREEN   },
];

function DonutChart() {
  const [hov, setHov] = useState(null);
  const R=30, C=2*Math.PI*R;
  let acc=0;
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,width:"100%"}}>
      <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <svg width="90" height="90" viewBox="0 0 80 80">
          {DONUT.map((d,i)=>{
            const sv=(d.pct/100)*C, off=C-(acc/100)*C;
            acc+=d.pct;
            return (
              <circle key={i} cx="40" cy="40" r={R}
                fill="none" stroke={d.color}
                strokeWidth={hov===i?10:7}
                strokeDasharray={`${sv} ${C-sv}`}
                strokeDashoffset={off}
                transform="rotate(-90 40 40)"
                style={{transition:"all 0.15s",cursor:"pointer",opacity:hov===null||hov===i?1:0.5}}
                onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
              />
            );
          })}
        </svg>
        <div style={{position:"absolute",textAlign:"center",pointerEvents:"none"}}>
          <div style={{fontSize:7,color:SLATE,textTransform:"uppercase"}}>{hov!==null?DONUT[hov].name.split(" ")[0]:"Total"}</div>
          <div style={{fontSize:14,color:NAVY}}>{hov!==null?`${DONUT[hov].pct}%`:"180"}</div>
        </div>
      </div>
      <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:4}}>
        {DONUT.map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:10,color:SLATE}}
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
            <div style={{width:6,height:6,borderRadius:"50%",background:d.color,flexShrink:0}}/>
            <span style={{overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",flex:1}}>{d.name}</span>
            <span style={{color:NAVY,flexShrink:0}}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── KPI Card ── */
function KpiCard({ label, value, delta, up, accent, Icon }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:WHITE, borderRadius:8, padding:"10px 14px",
        border:`1.5px solid ${hov?accent:BORDER}`,
        boxShadow:hov?"0 6px 18px rgba(0,0,0,0.07)":"0 1px 4px rgba(0,0,0,0.03)",
        transition:"all 0.2s", display:"flex", alignItems:"center",
        gap:10, flex:1, minWidth:0, overflow:"hidden"
      }}
    >
      <div style={{width:34,height:34,borderRadius:6,background:`${accent}15`,
        display:"flex",alignItems:"center",justifyContent:"center",color:accent,flexShrink:0}}>
        <Icon/>
      </div>
      <div style={{flex:1,minWidth:0,overflow:"hidden"}}>
        <div style={{fontSize:10,color:SLATE,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{label}</div>
        <div style={{fontSize:18,color:NAVY,lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{value}</div>
        <div style={{fontSize:9,color:up?GREEN:RED,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
          {up?"▲":"▼"} {delta} vs last month
        </div>
      </div>
    </div>
  );
}

/* ── Shared select style ── */
const selStyle = {
  padding:"3px 8px", borderRadius:6, border:`1.5px solid ${BORDER}`,
  background:WHITE, fontSize:10, color:NAVY, outline:"none", cursor:"pointer"
};

/* ── Main Component ── */
export default function DashboardOverview({ isMobile }) { const navigate = useNavigate();
  const [service, setService]           = useState("All Services");
  const [month, setMonth]               = useState("Oct");
  const [showAll, setShowAll]           = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const visibleRows = ALL_RECORDS.slice(0,3);

  return (
    <div style={{
      flex:1, display:"flex", flexDirection:"column",
      padding:"10px 16px",
      background:LIGHT, overflow:"hidden",
      height:"100%", boxSizing:"border-box", gap:8,
      fontFamily:"'Inter','Poppins',sans-serif"
    }}>

      {/* ── Header ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{minWidth:0,flex:1,overflow:"hidden"}}>
          <div style={{fontSize:15,color:NAVY,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Welcome Back, Admin!</div>
          <div style={{fontSize:11,color:SLATE,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
            You have <span style={{color:ORANGE}}>5 appointments</span> today — keep it up!
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,marginLeft:12}}>
          <div style={{fontSize:11,color:SLATE,whiteSpace:"nowrap"}}>
            <IcoCalendar /> {new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"})}
          </div>
          <button style={{
            display:"flex",alignItems:"center",gap:5,
            background:WHITE,border:`1.5px solid ${BORDER}`,
            borderRadius:8,padding:"5px 10px",fontSize:11,
            color:NAVY,cursor:"pointer",whiteSpace:"nowrap"
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{display:"flex",gap:8,flexShrink:0}}>
        <KpiCard label="Total Records"    value="12,584" delta="+12.5%" up Icon={IcoClient}    accent={ORANGE}/>
        <KpiCard label="Active Users"     value="348"    delta="+8.2%"  up Icon={IcoStaff}     accent={BLUE}  />
        <KpiCard label="Performance Score" value="94.5%" delta="+2.1%"  up Icon={IcoInventory} accent={PURPLE}/>
      </div>

      {/* ── Main row ── */}
      <div style={{display:"flex",gap:8,flex:1,minHeight:0,overflow:"hidden"}}>

        {/* ── Left column (65%) ── */}
        <div style={{display:"flex",flexDirection:"column",gap:8,flex:"0 0 64%",minWidth:0,overflow:"hidden"}}>

          {/* Area chart */}
          <div style={{
            background:WHITE, borderRadius:8, padding:"10px 12px",
            border:`1.5px solid ${BORDER}`,
            boxShadow:"0 1px 4px rgba(0,0,0,0.03)",
            flex:1, minHeight:0, display:"flex", flexDirection:"column", overflow:"hidden"
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,flexShrink:0}}>
              <div style={{minWidth:0,overflow:"hidden"}}>
                <div style={{fontSize:12,color:NAVY,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Progress Overview</div>
                <div style={{fontSize:10,color:SLATE,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Patient traffic and appointment trends</div>
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:8}}>
                <select value={service} onChange={e=>setService(e.target.value)} style={selStyle}>
                  {SERVICES.map(s=><option key={s}>{s}</option>)}
                </select>
                <select value={month} onChange={e=>setMonth(e.target.value)} style={selStyle}>
                  {MONTHS.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div style={{flex:1,minHeight:0,overflow:"hidden",display:"flex",alignItems:"center"}}>
              <AreaChart service={service} month={month}/>
            </div>
          </div>

          {/* Table */}
          <div style={{
            background:WHITE, borderRadius:8, padding:"8px 12px",
            border:`1.5px solid ${BORDER}`,
            boxShadow:"0 1px 4px rgba(0,0,0,0.03)", flexShrink:0
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:12,color:NAVY}}>Upcoming Deadlines</div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={selStyle}>
                  {["All","Pending","In Progress","Completed","Cancelled"].map(s=><option key={s}>{s}</option>)}
                </select>
                <button onClick={()=>setShowAll(!showAll)} style={{
                  fontSize:10,color:ORANGE,background:ORANGE_B,
                  border:`1px solid ${ORANGE}33`,borderRadius:6,
                  padding:"3px 10px",cursor:"pointer",whiteSpace:"nowrap"
                }}>
                  {showAll?"Collapse":"View All"}
                </button>
              </div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}>
                <thead>
                  <tr style={{borderBottom:`1.5px solid ${BORDER}`,background:"rgba(30,58,95,0.02)"}}>
                    {["Name","Date","Category","Status","Priority"].map(h=>(
                      <th key={h} style={{padding:"5px 10px",fontSize:9,color:SLATE,textTransform:"uppercase",letterSpacing:"0.4px",whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(showAll?ALL_RECORDS:visibleRows)
                    .filter(r=>statusFilter==="All"||r.status===statusFilter)
                    .map((row,idx,arr)=>(
                    <tr key={row.id}
                      style={{borderBottom:idx<arr.length-1?`1px solid ${BORDER}`:"none",transition:"background 0.12s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,138,0,0.03)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <td style={{padding:"5px 10px",fontSize:11,color:NAVY,whiteSpace:"nowrap"}}>{row.name}</td>
                      <td style={{padding:"5px 10px",fontSize:11,color:SLATE,whiteSpace:"nowrap"}}>{row.date}</td>
                      <td style={{padding:"5px 10px",fontSize:11,color:SLATE,whiteSpace:"nowrap"}}>{row.category}</td>
                      <td style={{padding:"5px 10px"}}>
                        <span style={{
                          fontSize:9,padding:"2px 7px",borderRadius:20,
                          background:STATUS_CFG[row.status]?.bg,
                          color:STATUS_CFG[row.status]?.color,whiteSpace:"nowrap"
                        }}>{row.status}</span>
                      </td>
                      <td style={{padding:"5px 10px",fontSize:11,whiteSpace:"nowrap",
                        color:row.priority==="High"?RED:row.priority==="Medium"?ORANGE:GREEN}}>
                        {row.priority}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right panel (36%) ── */}
        <div style={{display:"flex",flexDirection:"column",gap:8,flex:"0 0 calc(36% - 4px)",minWidth:0,overflow:"hidden"}}>

          {/* Donut */}
          <div style={{
            background:WHITE, borderRadius:8, padding:"10px 12px",
            border:`1.5px solid ${BORDER}`,
            boxShadow:"0 1px 4px rgba(0,0,0,0.03)",
            display:"flex",flexDirection:"column",flexShrink:0
          }}>
            <div style={{fontSize:11,color:NAVY,marginBottom:8}}>Patient Activity Split</div>
            <DonutChart/>
          </div>

          {/* Recent activity */}
          <div style={{
            background:WHITE, borderRadius:8, padding:"10px 12px",
            border:`1.5px solid ${BORDER}`,
            boxShadow:"0 1px 4px rgba(0,0,0,0.03)", flex:1, minHeight:0, overflow:"hidden"
          }}>
            <div style={{fontSize:11,color:NAVY,marginBottom:6}}>Recent Activity</div>
            {ACTIVITY.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:7,alignItems:"flex-start",
                padding:"5px 0",borderBottom:i<ACTIVITY.length-1?`1px solid ${BORDER}`:"none"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:a.color,marginTop:3,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:10,color:NAVY,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.label}</div>
                  <div style={{fontSize:9,color:SLATE}}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button onClick={() => navigate("/admin/analytics")} style={{
              flex:1,padding:"7px",borderRadius:8,
              border:`1.5px solid ${NAVY}`,background:"transparent",
              color:NAVY,fontSize:11,cursor:"pointer"
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(30,58,95,0.05)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}
            >Analytics</button>
            <button onClick={() => navigate("/admin/appointments")} style={{
              flex:1,padding:"7px",borderRadius:8,
              border:"none",background:ORANGE,
              color:WHITE,fontSize:11,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:5
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="#e07900"}}
              onMouseLeave={e=>{e.currentTarget.style.background=ORANGE}}
            >
              New Appt
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
