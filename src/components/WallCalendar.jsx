import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS_SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const MONTH_THEMES = [
  { heroGrad:"linear-gradient(160deg,#0f2027 0%,#203a43 50%,#2c5364 100%)", accent:"#4fc3f7", label:"Deep Winter",   emoji:"❄️", season:"Winter", bg:"#eef4f8", darkBg:"#060d14", particles:["❄","✦","·","*","❅"] },
  { heroGrad:"linear-gradient(160deg,#1a0533 0%,#0d3b2e 60%,#1a4a3a 100%)", accent:"#43e97b", label:"Frost Thaw",   emoji:"🌨️", season:"Winter", bg:"#eef8f3", darkBg:"#020a06", particles:["·","∘","○","◦","❄"] },
  { heroGrad:"linear-gradient(160deg,#134e5e 0%,#2d6a4f 50%,#52b788 100%)", accent:"#ff6b9d", label:"First Bloom",  emoji:"🌸", season:"Spring", bg:"#fdf4f8", darkBg:"#0d0008", particles:["🌸","·","✿","❀","·"] },
  { heroGrad:"linear-gradient(160deg,#c67c00 0%,#e8b84b 50%,#ffd200 100%)", accent:"#e65100", label:"Spring Gold",  emoji:"🌼", season:"Spring", bg:"#fffde7", darkBg:"#100c00", particles:["✦","·","★","·","✧"] },
  { heroGrad:"linear-gradient(160deg,#004d40 0%,#00695c 50%,#2e7d32 100%)", accent:"#00e676", label:"Lush Green",   emoji:"🌿", season:"Spring", bg:"#f1f8e9", darkBg:"#010f04", particles:["🍃","·","✦","·","🌿"] },
  { heroGrad:"linear-gradient(160deg,#7b1fa2 0%,#b91d73 50%,#f953c6 100%)", accent:"#fff176", label:"Solstice",     emoji:"☀️", season:"Summer", bg:"#fff9c4", darkBg:"#0a000a", particles:["☀","·","✦","·","★"] },
  { heroGrad:"linear-gradient(160deg,#b71c1c 0%,#e53935 50%,#fc4a1a 100%)", accent:"#ffd740", label:"Summer Blaze", emoji:"🔥", season:"Summer", bg:"#fff8e1", darkBg:"#100400", particles:["🔥","·","✦","·","★"] },
  { heroGrad:"linear-gradient(160deg,#01579b 0%,#0277bd 50%,#2980b9 100%)", accent:"#ff6b6b", label:"Ocean Blue",   emoji:"🌊", season:"Summer", bg:"#e3f2fd", darkBg:"#000610", particles:["~","≋","·","∼","🌊"] },
  { heroGrad:"linear-gradient(160deg,#bf360c 0%,#e64a19 50%,#f45c43 100%)", accent:"#ffd700", label:"Harvest",      emoji:"🍂", season:"Autumn", bg:"#fff8f0", darkBg:"#0e0500", particles:["🍂","·","🍁","·","✦"] },
  { heroGrad:"linear-gradient(160deg,#4a148c 0%,#6a1b9a 50%,#8e24aa 100%)", accent:"#c8e6c9", label:"Deep Autumn",  emoji:"🍁", season:"Autumn", bg:"#f3e5f5", darkBg:"#0a0010", particles:["🍁","·","✦","🍂","·"] },
  { heroGrad:"linear-gradient(160deg,#1a237e 0%,#283593 50%,#4b6cb7 100%)", accent:"#b3e5fc", label:"Late Frost",   emoji:"🌫️", season:"Winter", bg:"#e8eaf6", darkBg:"#000412", particles:["·","∘","○","◦","·"] },
  { heroGrad:"linear-gradient(160deg,#0d0d0d 0%,#1a1a2e 50%,#c62a88 100%)", accent:"#ffd700", label:"Winter Glow",  emoji:"✨", season:"Winter", bg:"#fce4ec", darkBg:"#0a0008", particles:["✨","·","★","·","✦"] },
];

const HOLIDAYS = {
  "0-1":"New Year's Day","0-14":"Makar Sankranti","0-26":"Republic Day",
  "2-25":"Holi","3-14":"Ambedkar Jayanti","3-17":"Ram Navami",
  "4-23":"Buddha Purnima","7-15":"Independence Day",
  "8-7":"Janmashtami","9-2":"Gandhi Jayanti","9-12":"Dussehra",
  "10-1":"Diwali","10-14":"Children's Day","10-15":"Guru Nanak Jayanti",
  "11-25":"Christmas Day",
};

/* ─────────────────────────────────────────────
   UTILS
───────────────────────────────────────────── */
const getDaysInMonth = (y,m) => new Date(y,m+1,0).getDate();
const getFirstDay    = (y,m) => (new Date(y,m,1).getDay()+6)%7;
const sameDay        = (a,b) => a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
const between        = (d,s,e) => { if(!s||!e) return false; const[lo,hi]=s<e?[s,e]:[e,s]; return d>lo&&d<hi; };
const fmt            = d => d?`${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`:"";
const nk             = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const rnk            = (s,e)=>`range-${nk(s)}-${nk(e)}`;

/* ─────────────────────────────────────────────
   HOOK: useBreakpoint
───────────────────────────────────────────── */
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState("desktop"); // "mobile", "tablet", "desktop"
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("mobile");
      else if (width < 1024) setBreakpoint("tablet");
      else setBreakpoint("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return breakpoint;
}

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */
function SpiralBind({dark, breakpoint}) {
  const circleSize = breakpoint === "mobile" ? 8 : breakpoint === "tablet" ? 11 : 15;
  const gap = breakpoint === "mobile" ? 3 : 5;
  return (
    <div style={{
      display:"flex", justifyContent:"center", alignItems:"center",
      gap, padding:"8px 0 6px",
      background:dark?"#080812":"#ccc8c2",
      borderBottom:`2px solid ${dark?"#14142a":"#b0aca6"}`,
      flexWrap:"wrap",
    }}>
      {Array.from({length:26}).map((_,i)=>(
        <div key={i} style={{
          width:circleSize, height:circleSize, borderRadius:"50%", flexShrink:0,
          background:dark?"linear-gradient(135deg,#444,#1a1a1a)":"linear-gradient(135deg,#e0e0e0,#9e9e9e)",
          border:`2px solid ${dark?"#555":"#9e9e9e"}`,
          boxShadow:dark?"0 2px 5px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.08)":"0 2px 4px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.7)",
        }}/>
      ))}
    </div>
  );
}

function FloatingParticles({month}) {
  const t = MONTH_THEMES[month];
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:1}}>
      {Array.from({length:16}).map((_,i)=>{
        const left=(i*41+7)%100;
        const delay=(i*0.35)%5;
        const dur=4+(i%4);
        const size=9+(i%4)*5;
        return (
          <span key={i} style={{
            position:"absolute",left:`${left}%`,top:"108%",
            fontSize:size,opacity:0.14+(i%5)*0.04,userSelect:"none",
            animation:`wcParticle ${dur}s ${delay}s infinite linear`,
          }}>
            {t.particles[i%t.particles.length]}
          </span>
        );
      })}
    </div>
  );
}

function HeroPanel({month,year,flipping,flipPhase, breakpoint}) {
  const t = MONTH_THEMES[month];
  let flipStyle = {};
  if(flipping){
    if(flipPhase==="out") flipStyle={animation:"wcFlipOut 0.22s ease forwards"};
    else if(flipPhase==="in") flipStyle={animation:"wcFlipIn 0.24s ease forwards"};
  }
  const emojiSize = breakpoint === "mobile" ? 56 : breakpoint === "tablet" ? 68 : 78;
  const titleFontSize = breakpoint === "mobile" ? 20 : breakpoint === "tablet" ? 24 : 28;
  return (
    <div style={{
      width:"100%", height:"100%", minHeight: breakpoint === "mobile" ? 200 : 260,
      background:t.heroGrad,
      position:"relative", overflow:"hidden",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      ...flipStyle,
    }}>
      <FloatingParticles month={month}/>
      <div style={{position:"absolute",top:-70,right:-70,width:220,height:220,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.07)",zIndex:0}}/>
      <div style={{position:"absolute",bottom:-50,left:-50,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.04)",zIndex:0}}/>
      <div style={{position:"absolute",top:"28%",left:"8%",width:55,height:55,border:"1px solid rgba(255,255,255,0.1)",transform:"rotate(45deg)",zIndex:0}}/>
      <div style={{
        fontSize: emojiSize, zIndex:2, userSelect:"none",
        filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.45))",
        animation:"wcFloat 3s ease-in-out infinite alternate",
      }}>{t.emoji}</div>
      <div style={{
        position:"absolute", bottom:0, left:0, right:0,
        background:"linear-gradient(0deg,rgba(0,0,0,0.58) 0%,transparent 100%)",
        padding:"22px 18px 14px", zIndex:3,
        display:"flex", flexDirection:"column", alignItems:"flex-end",
      }}>
        <span style={{color:"rgba(255,255,255,0.5)", fontSize:11, letterSpacing:5, textTransform:"uppercase"}}>{year}</span>
        <span style={{color:"#fff", fontSize: titleFontSize, fontWeight:800, letterSpacing:3, textTransform:"uppercase", fontFamily:"'Cinzel',Georgia,serif", textShadow:"0 3px 14px rgba(0,0,0,0.55)", lineHeight:1.1}}>{MONTHS[month]}</span>
        <span style={{color:t.accent, fontSize:10, letterSpacing:4, textTransform:"uppercase", marginTop:4, opacity:0.9}}>{t.label}</span>
      </div>
    </div>
  );
}

function NoteModal({noteKey:key,notes,setNotes,dark,accent,borderCol,textCol,mutedCol,onClose}) {
  const [val,setVal]=useState(notes[key]||"");
  const ref=useRef();
  useEffect(()=>{setTimeout(()=>ref.current?.focus(),80);},[]);
  const save=()=>{setNotes(n=>({...n,[key]:val}));onClose();};
  const del=()=>{setNotes(n=>{const c={...n};delete c[key];return c;});onClose();};
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:300,
      background:"rgba(0,0,0,0.6)", backdropFilter:"blur(7px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:dark?"#13132a":"#fff",
        borderRadius:20, padding: "clamp(16px, 5vw, 26px)",
        width: "min(380px, 92vw)", maxWidth:"92vw",
        boxShadow:"0 32px 80px rgba(0,0,0,0.5)",
        border:`1px solid ${borderCol}`,
        animation:"wcModalIn 0.22s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
          <span style={{fontSize:11, letterSpacing:3, textTransform:"uppercase", color:accent, fontWeight:700}}>📝 Day Note</span>
          <button onClick={onClose} style={{background:"none", border:"none", cursor:"pointer", fontSize:18, color:mutedCol, padding:"2px 6px", lineHeight:1}}>✕</button>
        </div>
        <textarea
          ref={ref} value={val} rows={5}
          onChange={e=>setVal(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)save();}}
          placeholder="Your note… (Ctrl+Enter to save)"
          style={{
            width:"100%", border:`1.5px solid ${borderCol}`, borderRadius:10,
            padding:"10px 12px",
            background:dark?"#0a0a1a":"#f8f6f3",
            color:textCol, fontSize:14,
            fontFamily:"inherit", lineHeight:1.7, resize:"vertical", outline:"none",
          }}
          onFocus={e=>e.target.style.borderColor=accent}
          onBlur={e=>e.target.style.borderColor=borderCol}
        />
        <div style={{display:"flex", gap:8, marginTop:14, justifyContent:"flex-end", flexWrap:"wrap"}}>
          <button onClick={del} style={{background:"none", border:`1px solid ${dark?"#2a2a44":"#e0e0e0"}`, borderRadius:8, padding:"7px 16px", cursor:"pointer", color:mutedCol, fontSize:11, letterSpacing:2}}>DELETE</button>
          <button onClick={onClose} style={{background:"none", border:`1px solid ${borderCol}`, borderRadius:8, padding:"7px 16px", cursor:"pointer", color:textCol, fontSize:11, letterSpacing:2}}>CANCEL</button>
          <button onClick={save} style={{background:accent, border:"none", borderRadius:8, padding:"7px 22px", cursor:"pointer", color:"#111", fontSize:11, fontWeight:700, letterSpacing:2, boxShadow:`0 4px 14px ${accent}55`}}>SAVE</button>
        </div>
      </div>
    </div>
  );
}

function YearGrid({year,viewMonth,dark,accent,borderCol,mutedCol,textCol,onPick, breakpoint}) {
  const today=new Date();
  const columns = breakpoint === "mobile" ? 3 : 4;
  return (
    <div style={{display:"grid", gridTemplateColumns:`repeat(${columns},1fr)`, gap: breakpoint === "mobile" ? 6 : 8, padding:"4px 0"}}>
      {MONTHS.map((m,i)=>{
        const t=MONTH_THEMES[i];
        const cur=today.getFullYear()===year&&today.getMonth()===i;
        const active=i===viewMonth;
        return (
          <button key={m} onClick={()=>onPick(i)} style={{
            border:`2px solid ${active?accent:cur?`${accent}55`:borderCol}`,
            borderRadius:12, padding:"8px 4px",
            background:dark?(active?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.02)"):(active?"rgba(0,0,0,0.04)":"transparent"),
            cursor:"pointer", transition:"all 0.18s",
            display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            minHeight: breakpoint === "mobile" ? 56 : "auto",
          }}>
            <span style={{fontSize: breakpoint === "mobile" ? 16 : 20}}>{t.emoji}</span>
            <span style={{fontSize: breakpoint === "mobile" ? 8 : 9, letterSpacing:2, textTransform:"uppercase", color:active?accent:mutedCol, fontWeight:active?700:400}}>{m.slice(0,3)}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function WallCalendar() {
  const today = new Date();

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [dark,      setDark]      = useState(false);
  const [showYear,  setShowYear]  = useState(false);

  // Flip animation
  const [flipPhase, setFlipPhase] = useState(null);
  const [flipping,  setFlipping]  = useState(false);

  // Range
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd,   setRangeEnd]   = useState(null);
  const [selecting,  setSelecting]  = useState(false);
  const [hoverDate,  setHoverDate]  = useState(null);

  // Notes
  const [notes,    setNotes]    = useState(()=>{ try{return JSON.parse(localStorage.getItem("wcal3")||"{}");}catch{return{};} });
  const [modalKey, setModalKey] = useState(null);

  // Sidebar tab
  const [tab, setTab] = useState("monthly");

  // Long-press for mobile note open
  const longPressTimer = useRef(null);

  // Responsive breakpoint
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";

  const t = MONTH_THEMES[viewMonth];

  useEffect(()=>{ localStorage.setItem("wcal3",JSON.stringify(notes)); },[notes]);

  // Colors
  const accent    = t.accent;
  const bg        = dark ? t.darkBg    : t.bg;
  const cardBg    = dark ? "#111827"   : "#ffffff";
  const textCol   = dark ? "#dde4f0"   : "#1a1a2e";
  const mutedCol  = dark ? "#4a5080"   : "#aaa";
  const borderCol = dark ? "#1c2040"   : "#e4e0da";
  const rangeCol  = dark ? `${accent}18` : `${accent}22`;

  // Grid cells
  const dim      = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDay(viewYear, viewMonth);
  const cells    = [];
  const prevDim  = getDaysInMonth(viewYear, viewMonth===0?11:viewMonth-1);
  for(let i=firstDay-1;i>=0;i--) cells.push({day:prevDim-i,cur:false});
  for(let d=1;d<=dim;d++) cells.push({day:d,cur:true});
  while(cells.length%7!==0) cells.push({day:cells.length-firstDay-dim+1,cur:false});

  function navigate(dir) {
    if(flipping) return;
    setFlipping(true);
    setFlipPhase("out");
    setTimeout(()=>{
      setViewMonth(m=>{
        let nm=m+dir;
        if(nm>11){setViewYear(y=>y+1);return 0;}
        if(nm<0){setViewYear(y=>y-1);return 11;}
        return nm;
      });
      setFlipPhase("in");
    },230);
    setTimeout(()=>{setFlipping(false);setFlipPhase(null);},480);
  }

  function handleDayClick(date) {
    if(!selecting){
      setRangeStart(date); setRangeEnd(null);
      setSelecting(true); setTab("range");
    } else {
      const s=date<rangeStart?date:rangeStart;
      const e=date<rangeStart?rangeStart:date;
      setRangeStart(s); setRangeEnd(e);
      setSelecting(false); setTab("range");
    }
  }

  function clearRange(){setRangeStart(null);setRangeEnd(null);setSelecting(false);}

  const effEnd = rangeEnd||(selecting?hoverDate:null);

  function handleTouchStart(date,e) {
    e.preventDefault();
    longPressTimer.current=setTimeout(()=>{ setModalKey(nk(date)); },600);
  }
  function handleTouchEnd(){ clearTimeout(longPressTimer.current); }

  const monthKey = `month-${viewYear}-${viewMonth}`;

  const monthHolidays = Object.entries(HOLIDAYS)
    .filter(([k])=>k.startsWith(`${viewMonth}-`))
    .map(([k,v])=>({day:parseInt(k.split("-")[1]),name:v}))
    .sort((a,b)=>a.day-b.day);

  const dayNotesList = Object.entries(notes)
    .filter(([k,v])=>{
      if(k.startsWith("month-")||k.startsWith("range-")) return false;
      const[y,m]=k.split("-").map(Number);
      return y===viewYear&&m===viewMonth&&v;
    })
    .map(([k,v])=>({day:parseInt(k.split("-")[2]),text:v}))
    .sort((a,b)=>a.day-b.day);

  // Dynamic cell height
  const cellHeight = isMobile ? 44 : isTablet ? 48 : 52;

  /* ─── RENDER ─── */
  return (
    <div style={{
      minHeight:"100vh",
      background:dark
        ? `radial-gradient(ellipse at 25% 15%,${dark?"#1a1a2e":t.bg} 0%,${t.darkBg} 80%)`
        : `radial-gradient(ellipse at 35% 25%,${t.bg} 0%,#ebe8e3 100%)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding: isMobile ? "8px 0" : "28px 16px",
      fontFamily:"'Cormorant Garamond',Georgia,'Times New Roman',serif",
      transition:"background 0.5s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');
        *{box-sizing:border-box;}
        @keyframes wcParticle{0%{transform:translateY(0) rotate(0deg);opacity:0;}10%{opacity:0.18;}90%{opacity:0.1;}100%{transform:translateY(-115vh) rotate(400deg);opacity:0;}}
        @keyframes wcFloat{0%{transform:translateY(0) rotate(-4deg) scale(1);}100%{transform:translateY(-10px) rotate(4deg) scale(1.07);}}
        @keyframes wcFlipOut{0%{transform:perspective(900px) rotateX(0deg);opacity:1;}100%{transform:perspective(900px) rotateX(-88deg);opacity:0;}}
        @keyframes wcFlipIn{0%{transform:perspective(900px) rotateX(88deg);opacity:0;}100%{transform:perspective(900px) rotateX(0deg);opacity:1;}}
        @keyframes wcModalIn{from{opacity:0;transform:scale(0.86) translateY(24px);}to{opacity:1;transform:scale(1) translateY(0);}}
        @keyframes wcFadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes wcPulse{0%,100%{opacity:1;}50%{opacity:0.55;}}
        .wcDayCell:hover{transform:scale(1.06)!important;z-index:8!important;}
        .wcDayCell{transition:transform .14s,background .14s,box-shadow .14s!important;}
        .wcNavBtn:hover{opacity:0.55!important;transform:scale(1.1)!important;}
        .wcNavBtn{transition:opacity .15s,transform .15s!important; min-width: 44px; min-height: 44px;}
        .wcTabBtn:hover{opacity:0.7;}
        textarea{font-family:inherit;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(128,128,128,0.25);border-radius:4px;}
        button { touch-action: manipulation; }
      `}</style>

      <div style={{
        width:"100%", maxWidth: isMobile ? "100%" : 940,
        borderRadius: isMobile ? 0 : 24, overflow:"hidden",
        background:cardBg,
        boxShadow:dark
          ?"0 40px 100px rgba(0,0,0,0.85),0 1px 0 rgba(255,255,255,0.03) inset"
          :"0 40px 100px rgba(0,0,0,0.16),0 -1px 0 rgba(255,255,255,0.95) inset",
        border:`1px solid ${borderCol}`,
        transition:"background .4s,border-color .4s",
      }}>
        <SpiralBind dark={dark} breakpoint={breakpoint}/>

        {/* Top bar */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding: isMobile ? "8px 12px" : "10px 22px",
          background:dark?"rgba(255,255,255,0.015)":"rgba(0,0,0,0.018)",
          borderBottom:`1px solid ${borderCol}`, gap:8, flexWrap:"wrap",
        }}>
          <button onClick={()=>setShowYear(v=>!v)} style={{
            background:"none", border:`1px solid ${borderCol}`,
            borderRadius:8, padding:"5px 12px", cursor:"pointer",
            color:textCol, fontSize:12, letterSpacing:2,
            display:"flex", alignItems:"center", gap:6, minHeight:44,
          }}>
            <b>{viewYear}</b>
            <span style={{opacity:.45, fontSize:9}}>{showYear?"▲":"▼"}</span>
          </button>

          <div style={{
            padding:"4px 14px", borderRadius:20,
            background:dark?"rgba(255,255,255,0.055)":"rgba(0,0,0,0.045)",
            fontSize:11, letterSpacing:3, textTransform:"uppercase", color:mutedCol,
          }}>
            {t.emoji} {t.season}
          </div>

          <button onClick={()=>setDark(d=>!d)} style={{
            background:"none", border:`1px solid ${borderCol}`,
            borderRadius:8, padding:"5px 12px", cursor:"pointer",
            color:textCol, fontSize:11, letterSpacing:1, transition:"all .2s",
            minHeight:44,
          }}>
            {dark?"☀ Light":"☾ Dark"}
          </button>
        </div>

        {showYear && (
          <div style={{
            padding:"14px 20px", borderBottom:`1px solid ${borderCol}`,
            background:dark?"rgba(0,0,0,0.28)":"rgba(0,0,0,0.018)",
            animation:"wcFadeUp .2s ease",
          }}>
            <YearGrid
              year={viewYear} viewMonth={viewMonth}
              dark={dark} accent={accent}
              borderCol={borderCol} mutedCol={mutedCol} textCol={textCol}
              onPick={m=>{setViewMonth(m);setShowYear(false);}}
              breakpoint={breakpoint}
            />
          </div>
        )}

        {/* Main body */}
        <div style={{
          display:"flex", flexDirection: isMobile ? "column" : "row",
        }}>
          {/* Hero Panel */}
          <div style={{
            width: isMobile ? "100%" : (isTablet ? "40%" : "37%"),
            minWidth: isMobile ? undefined : (isTablet ? 200 : 210),
            flexShrink:0,
            display:"flex", flexDirection:"column",
            borderRight: isMobile ? "none" : `1px solid ${borderCol}`,
            borderBottom: isMobile ? `1px solid ${borderCol}` : "none",
          }}>
            <div style={{
              flex: isMobile ? "0 0 200px" : 1,
              minHeight: isMobile ? 200 : (isTablet ? 240 : 290),
              position:"relative",
              transformOrigin:"top center",
            }}>
              <HeroPanel
                month={viewMonth} year={viewYear}
                flipping={flipping} flipPhase={flipPhase}
                breakpoint={breakpoint}
              />
            </div>

            {!isMobile && (
              <div style={{
                padding:"14px 16px",
                background:dark?"rgba(0,0,0,0.22)":"rgba(0,0,0,0.018)",
                borderTop:`1px solid ${borderCol}`,
              }}>
                <p style={{fontSize:9, letterSpacing:3, textTransform:"uppercase", color:accent, marginBottom:8, fontWeight:700}}>Month Notes</p>
                <textarea
                  value={notes[monthKey]||""}
                  onChange={e=>setNotes(n=>({...n,[monthKey]:e.target.value}))}
                  rows={5}
                  placeholder={`Notes for ${MONTHS[viewMonth]}…`}
                  style={{
                    width:"100%", border:`1.5px solid ${borderCol}`,
                    borderRadius:10, padding:"8px 10px", resize:"vertical",
                    background:dark?"#090916":"#fff",
                    color:textCol, fontSize:13, lineHeight:1.7, outline:"none",
                  }}
                  onFocus={e=>e.target.style.borderColor=accent}
                  onBlur={e=>e.target.style.borderColor=borderCol}
                />
              </div>
            )}
          </div>

          {/* Calendar Panel */}
          <div style={{
            flex:1, display:"flex", flexDirection:"column",
            padding: isMobile ? "10px 8px 12px" : "18px 20px 16px",
          }}>
            {/* Month nav */}
            <div style={{
              display:"flex", alignItems:"center",
              justifyContent:"space-between", marginBottom:10, gap:8,
            }}>
              <button className="wcNavBtn" onClick={()=>navigate(-1)} style={{
                background:"none", border:`1px solid ${borderCol}`,
                borderRadius:10, width:44, height:44,
                cursor:"pointer", fontSize:24, color:textCol,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>‹</button>

              <div style={{textAlign:"center", flex:1}}>
                <div style={{
                  fontSize: isMobile ? 18 : (isTablet ? 22 : 26),
                  fontWeight:800, color:textCol,
                  fontFamily:"'Cinzel',Georgia,serif", letterSpacing:2,
                  animation:flipping?"wcFadeUp .28s ease":"none",
                }}>
                  {MONTHS[viewMonth]}
                </div>
                <div style={{fontSize:10, color:mutedCol, letterSpacing:4, textTransform:"uppercase", marginTop:1}}>
                  {viewYear}
                </div>
              </div>

              <button className="wcNavBtn" onClick={()=>navigate(1)} style={{
                background:"none", border:`1px solid ${borderCol}`,
                borderRadius:10, width:44, height:44,
                cursor:"pointer", fontSize:24, color:textCol,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>›</button>
            </div>

            {/* Range status */}
            <div style={{
              borderRadius:10, padding:"7px 12px", marginBottom:10,
              background:rangeStart?`${accent}14`:(dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.025)"),
              border:`1px solid ${rangeStart?`${accent}44`:borderCol}`,
              display:"flex", alignItems:"center", justifyContent:"space-between",
              gap:8, transition:"all .3s", flexWrap:"wrap",
            }}>
              <span style={{fontSize:11, color:rangeStart?accent:mutedCol, letterSpacing:1, wordBreak:"break-word"}}>
                {!rangeStart&&!selecting&&"✦ Tap a date to start range"}
                {selecting&&<span style={{animation:"wcPulse 1.2s infinite"}}>✦ Tap end date…</span>}
                {rangeStart&&rangeEnd&&`${fmt(rangeStart)}  →  ${fmt(rangeEnd)}`}
                {rangeStart&&!rangeEnd&&!selecting&&fmt(rangeStart)}
              </span>
              {(rangeStart||rangeEnd)&&(
                <button onClick={clearRange} style={{
                  background:"none", border:`1px solid ${accent}55`,
                  borderRadius:6, padding:"4px 12px", cursor:"pointer",
                  color:accent, fontSize:9, letterSpacing:2, flexShrink:0, minHeight:32,
                }}>CLEAR</button>
              )}
            </div>

            {/* Day header */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:3}}>
              {DAYS_SHORT.map(d=>(
                <div key={d} style={{
                  textAlign:"center",
                  fontSize: isMobile ? 10 : (isTablet ? 11 : 12),
                  color:(d==="Sat"||d==="Sun")?(dark?"#ff8fa3":"#c62828"):mutedCol,
                  letterSpacing:2, textTransform:"uppercase",
                  padding:"6px 0", fontWeight:600,
                }}>
                  {isMobile ? d[0] : d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap: isMobile ? 2 : 3, flex:1}}>
              {cells.map((cell,i)=>{
                if(!cell.cur) return (
                  <div key={`p${i}`} style={{
                    display:"flex", alignItems:"center", justifyContent:"center",
                    height: cellHeight,
                    color:dark?"#282840":"#ddd",
                    fontSize: isMobile ? 11 : 13,
                  }}>{cell.day}</div>
                );

                const date = new Date(viewYear, viewMonth, cell.day);
                const isToday   = sameDay(date, today);
                const isStart   = sameDay(date, rangeStart);
                const isEnd     = sameDay(date, effEnd);
                const inRange   = between(date, rangeStart, effEnd);
                const hk        = `${viewMonth}-${cell.day}`;
                const holiday   = HOLIDAYS[hk];
                const hasNote   = !!notes[nk(date)];
                const wkday     = (firstDay + cell.day - 1) % 7;
                const isWknd    = wkday >= 5;

                let cellBg="transparent", cellColor, br="10px", shadow="none";

                cellColor = isWknd
                  ? (dark?"#ff8fa3":"#c62828")
                  : (dark?"#dde4f0":"#1a1a2e");

                if(isStart||isEnd){
                  cellBg = accent;
                  cellColor = "#111";
                  shadow = `0 5px 18px ${accent}66`;
                  if(isStart&&!sameDay(rangeStart,effEnd)) br="10px 0 0 10px";
                  if(isEnd&&!sameDay(rangeStart,effEnd))   br="0 10px 10px 0";
                } else if(inRange){
                  cellBg = rangeCol;
                  br = "0";
                }

                return (
                  <div
                    key={`d${cell.day}`}
                    className="wcDayCell"
                    style={{
                      position:"relative",
                      display:"flex", flexDirection:"column",
                      alignItems:"center", justifyContent:"center",
                      height: cellHeight,
                      background:cellBg, borderRadius:br, boxShadow:shadow,
                      cursor:"pointer", userSelect:"none",
                      outline:isToday?`2.5px solid ${accent}`:"none", outlineOffset:2,
                      WebkitTapHighlightColor:"transparent",
                      zIndex:(isStart||isEnd)?2:1,
                      touchAction:"manipulation",
                    }}
                    onClick={()=>handleDayClick(date)}
                    onContextMenu={e=>{e.preventDefault();setModalKey(nk(date));}}
                    onMouseEnter={()=>selecting&&setHoverDate(date)}
                    onMouseLeave={()=>selecting&&setHoverDate(null)}
                    onTouchStart={e=>handleTouchStart(date,e)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchEnd}
                  >
                    <span style={{
                      fontSize: isMobile ? 14 : (isTablet ? 15 : 16),
                      lineHeight:1, zIndex:1,
                      fontWeight:(isToday||isStart||isEnd)?700:400,
                      color:(isStart||isEnd)?"#111":cellColor,
                      fontFamily:"'Cinzel',Georgia,serif",
                    }}>{cell.day}</span>
                    <div style={{display:"flex", gap:2, marginTop:2}}>
                      {holiday&&<span style={{width:4, height:4, borderRadius:"50%", background:"#ffb300", display:"block"}}/>}
                      {hasNote&&<span style={{width:4, height:4, borderRadius:"50%", background:"#43e97b", display:"block"}}/>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{display:"flex", flexWrap:"wrap", gap:10, marginTop:12, alignItems:"center"}}>
              {[{c:"#ffb300", l:"Holiday"},{c:"#43e97b", l:"Note"}].map(({c,l})=>(
                <div key={l} style={{display:"flex", alignItems:"center", gap:5}}>
                  <div style={{width:8, height:8, borderRadius:"50%", background:c}}/>
                  <span style={{fontSize:9, color:mutedCol, letterSpacing:2, textTransform:"uppercase"}}>{l}</span>
                </div>
              ))}
              <div style={{display:"flex", alignItems:"center", gap:5}}>
                <div style={{width:14, height:14, borderRadius:3, border:`2px solid ${accent}`}}/>
                <span style={{fontSize:9, color:mutedCol, letterSpacing:2, textTransform:"uppercase"}}>Today</span>
              </div>
              <span style={{fontSize:8, color:mutedCol, marginLeft:"auto", letterSpacing:1, textAlign:"right"}}>
                {isMobile ? "Long-press = note" : "Right-click = note"}
              </span>
            </div>

            {/* Tabs */}
            <div style={{marginTop:14}}>
              <div style={{
                display:"flex", gap:0, borderBottom:`1px solid ${borderCol}`,
                marginBottom:12, overflowX:"auto", scrollbarWidth:"thin",
              }}>
                {[
                  {id:"monthly", label:"Month"},
                  {id:"range", label:"Range"},
                  {id:"holidays", label:"Holidays"},
                  {id:"allnotes", label:"All Notes"},
                ].map(({id,label})=>(
                  <button key={id} className="wcTabBtn" onClick={()=>setTab(id)} style={{
                    background:"none", border:"none", cursor:"pointer",
                    padding: isMobile ? "8px 12px" : "7px 12px",
                    fontSize: isMobile ? 10 : 11, letterSpacing:2, textTransform:"uppercase",
                    color:tab===id?accent:mutedCol, whiteSpace:"nowrap",
                    borderBottom:tab===id?`2px solid ${accent}`:"2px solid transparent",
                    marginBottom:-1, transition:"color .18s,border-color .18s",
                    fontFamily:"inherit", minHeight:44,
                  }}>{label}</button>
                ))}
              </div>

              {tab==="monthly" && (
                <div style={{animation:"wcFadeUp .18s ease"}}>
                  <textarea
                    value={notes[monthKey]||""}
                    onChange={e=>setNotes(n=>({...n,[monthKey]:e.target.value}))}
                    rows={3}
                    placeholder={`General notes for ${MONTHS[viewMonth]} ${viewYear}…`}
                    style={{
                      width:"100%", border:`1.5px solid ${borderCol}`,
                      borderRadius:10, padding:"8px 12px", resize:"vertical",
                      background:dark?"#080814":"#faf9f7",
                      color:textCol, fontSize:13, lineHeight:1.7, outline:"none",
                    }}
                    onFocus={e=>e.target.style.borderColor=accent}
                    onBlur={e=>e.target.style.borderColor=borderCol}
                  />
                </div>
              )}

              {tab==="range" && (
                <div style={{animation:"wcFadeUp .18s ease"}}>
                  {rangeStart&&rangeEnd ? (
                    <>
                      <p style={{fontSize:10, color:accent, letterSpacing:2, textTransform:"uppercase", marginBottom:8, fontWeight:700, wordBreak:"break-word"}}>
                        {fmt(rangeStart)} → {fmt(rangeEnd)}
                        <span style={{
                          marginLeft:10, background:`${accent}22`, color:accent,
                          fontSize:9, borderRadius:6, padding:"2px 8px", display:"inline-block",
                        }}>
                          {Math.round((rangeEnd-rangeStart)/(1000*60*60*24))+1} days
                        </span>
                      </p>
                      <textarea
                        rows={3}
                        placeholder="Notes for this range…"
                        value={notes[rnk(rangeStart,rangeEnd)]||""}
                        onChange={e=>setNotes(n=>({...n,[rnk(rangeStart,rangeEnd)]:e.target.value}))}
                        style={{
                          width:"100%", border:`1.5px solid ${borderCol}`,
                          borderRadius:10, padding:"8px 12px", resize:"vertical",
                          background:dark?"#080814":"#faf9f7",
                          color:textCol, fontSize:13, lineHeight:1.7, outline:"none",
                        }}
                        onFocus={e=>e.target.style.borderColor=accent}
                        onBlur={e=>e.target.style.borderColor=borderCol}
                      />
                    </>
                  ) : (
                    <p style={{fontSize:12, color:mutedCol, fontStyle:"italic", padding:"6px 0"}}>
                      Tap a start date, then an end date to add a range note.
                    </p>
                  )}
                </div>
              )}

              {tab==="holidays" && (
                <div style={{animation:"wcFadeUp .18s ease", display:"flex", flexDirection:"column", gap:6}}>
                  {monthHolidays.length===0 ? (
                    <p style={{fontSize:12, color:mutedCol, fontStyle:"italic"}}>No holidays this month.</p>
                  ) : monthHolidays.map(h=>(
                    <div key={h.day} style={{
                      display:"flex", alignItems:"center", gap:10,
                      padding:"7px 10px", borderRadius:10,
                      background:dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.025)",
                      border:`1px solid ${borderCol}`,
                    }}>
                      <span style={{
                        minWidth:32, height:32, borderRadius:8,
                        background:`${accent}22`, color:accent,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:12, fontWeight:700, flexShrink:0,
                      }}>{h.day}</span>
                      <div>
                        <div style={{fontSize:12, color:textCol}}>{h.name}</div>
                        <div style={{fontSize:10, color:mutedCol}}>{MONTHS[viewMonth]} {h.day}, {viewYear}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab==="allnotes" && (
                <div style={{animation:"wcFadeUp .18s ease"}}>
                  {dayNotesList.length===0 ? (
                    <p style={{fontSize:12, color:mutedCol, fontStyle:"italic"}}>
                      No day notes this month. Right-click / long-press a date.
                    </p>
                  ) : (
                    <div style={{display:"flex", flexDirection:"column", gap:5, maxHeight:200, overflowY:"auto"}}>
                      {dayNotesList.map(n=>(
                        <div key={n.day}
                          onClick={()=>setModalKey(nk(new Date(viewYear,viewMonth,n.day)))}
                          style={{
                            display:"flex", gap:10, padding:"8px 10px",
                            borderRadius:8, border:`1px solid ${borderCol}`,
                            background:dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.018)",
                            cursor:"pointer", alignItems:"center",
                          }}>
                          <span style={{
                            minWidth:28, height:28, borderRadius:7,
                            background:`${accent}22`, color:accent,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:12, fontWeight:700, flexShrink:0,
                          }}>{n.day}</span>
                          <span style={{fontSize:12, color:mutedCol, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{n.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isMobile && (
          <div style={{padding:"12px 12px 16px", borderTop:`1px solid ${borderCol}`}}>
            <p style={{fontSize:9, letterSpacing:3, textTransform:"uppercase", color:accent, marginBottom:8, fontWeight:700}}>Month Notes</p>
            <textarea
              value={notes[monthKey]||""}
              onChange={e=>setNotes(n=>({...n,[monthKey]:e.target.value}))}
              rows={3}
              placeholder={`Notes for ${MONTHS[viewMonth]}…`}
              style={{
                width:"100%", border:`1.5px solid ${borderCol}`,
                borderRadius:10, padding:"8px 10px", resize:"vertical",
                background:dark?"#090916":"#fff",
                color:textCol, fontSize:13, lineHeight:1.7, outline:"none",
              }}
              onFocus={e=>e.target.style.borderColor=accent}
              onBlur={e=>e.target.style.borderColor=borderCol}
            />
          </div>
        )}
      </div>

      {modalKey && (
        <NoteModal
          noteKey={modalKey} notes={notes} setNotes={setNotes}
          dark={dark} accent={accent} borderCol={borderCol}
          textCol={textCol} mutedCol={mutedCol}
          onClose={()=>setModalKey(null)}
        />
      )}
    </div>
  );
}