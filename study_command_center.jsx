import { useState, useEffect, useCallback } from "react";

const COMEDK_TS = new Date('2026-05-09T08:00:00+05:30').getTime();
const MET_TS    = new Date('2026-05-24T08:00:00+05:30').getTime();

const TOPICS = {
  maths: {
    title: 'MATHEMATICS', color: '#FF6B35',
    grade11: [
      { topic: "Trigonometry",            why: "Shows up everywhere — compound angles, equations, inverse trig. Also bleeds into 12th calculus." },
      { topic: "Sequences & Series",      why: "AP/GP/HP — direct formula questions, consistent presence every year." },
      { topic: "Straight Lines",          why: "Heavy in COMEDK. Formula-based easy marks. Learn all standard forms cold." },
      { topic: "Circles",                 why: "Pairs with straight lines. High ROI, predictable question types." },
      { topic: "Permutations & Combinations", why: "Conceptually tricky but high frequency. Nail the logic, not just the formulas." },
      { topic: "Binomial Theorem",        why: "Straightforward once the pattern clicks. Middle term, general term — fast marks." },
      { topic: "Complex Numbers",         why: "Moderate difficulty, can't skip. Modulus, argument, De Moivre's." },
      { topic: "Quadratic Equations",     why: "Fast marks if standard results are memorised. Nature of roots, sum/product." },
      { topic: "Limits & Derivatives",    why: "Foundation for 12th calculus. Standard limits, L'Hôpital — fix it now." },
    ],
    grade12: [
      { topic: "Integration (Indefinite)", why: "Highest weightage topic in 12th Maths. All substitution/by-parts methods." },
      { topic: "Definite Integration",     why: "Properties-based tricks give fast marks. King's property is gold." },
      { topic: "Differential Equations",  why: "Variable separable, linear DE — standard types, highly predictable." },
      { topic: "Vectors",                  why: "Fast if formulas are memorised. Dot, cross, scalar triple product." },
      { topic: "3D Geometry",              why: "Lines and planes — formula-heavy, reliable marks every year." },
      { topic: "Probability",             why: "Bayes theorem + conditional probability — appears every year without fail." },
      { topic: "Relations & Functions",   why: "Domain/range/types — usually one direct question, fast to revise." },
      { topic: "Matrices & Determinants", why: "Properties + inverse — board AND competitive overlap, don't skip." },
    ]
  },
  physics: {
    title: 'PHYSICS', color: '#00C9FF',
    grade11: [
      { topic: "Kinematics",                why: "Non-negotiable. Projectile motion, relative motion — always in the paper." },
      { topic: "Laws of Motion + Friction", why: "Newton's laws, constraint problems — high frequency, high marks." },
      { topic: "Work, Energy & Power",      why: "Conceptually linked to LoM. Fast to revise once LoM is clear." },
      { topic: "Rotational Motion",         why: "MOI, torque, rolling — heaviest 11th Physics topic. Start early." },
      { topic: "Gravitation",               why: "Mostly formula-based. Orbital mechanics, Kepler's laws — fast marks." },
      { topic: "Simple Harmonic Motion",    why: "Standard, predictable questions. Energy and velocity at a position." },
      { topic: "Waves",                     why: "Standing waves, Doppler effect — moderate effort, decent return." },
      { topic: "Thermodynamics + KTG",      why: "Laws, Cp/Cv, gas laws — reliable consistent marks every year." },
    ],
    grade12: [
      { topic: "Electrostatics",           why: "Coulomb's law, potential, capacitors — always present in COMEDK." },
      { topic: "Current Electricity",      why: "Kirchhoff's laws, Wheatstone bridge — reliable high marks." },
      { topic: "Magnetism + Moving Charges", why: "Biot-Savart, Ampere's law, force on conductor — high weightage." },
      { topic: "Electromagnetic Induction", why: "Faraday, Lenz, inductance — linked to AC circuits." },
      { topic: "Ray Optics",               why: "Lenses, mirrors, refraction — formula-heavy but fast marks." },
      { topic: "Wave Optics",              why: "YDSE, diffraction — standard patterns, predictable every year." },
      { topic: "Modern Physics",           why: "Photoelectric effect, Bohr model, radioactivity — easy marks." },
      { topic: "Semiconductors",           why: "Logic gates, diode, transistor — short chapter, always asked." },
    ]
  },
  chemistry: {
    title: 'CHEMISTRY', color: '#A8FF3E',
    grade11: [
      { topic: "Mole Concept",       why: "Fundamental. If shaky, it bleeds into every calculation question." },
      { topic: "Atomic Structure",   why: "Quantum numbers, electronic config — direct questions, fast marks." },
      { topic: "Chemical Bonding",   why: "VSEPR, hybridisation, MO theory — frequently tested, conceptual." },
      { topic: "Thermodynamics",     why: "Enthalpy, Hess's law, bond energies — overlaps with Physics thermo." },
      { topic: "Equilibrium",        why: "Kp/Kc, Le Chatelier, pH calculations — multi-concept questions." },
      { topic: "s-block + p-block",  why: "Factual but high return specifically in COMEDK." },
      { topic: "GOC",                why: "Foundation for ALL organic. Inductive, resonance, hyperconjugation — non-negotiable." },
      { topic: "Hydrocarbons",       why: "IUPAC nomenclature, reactions, isomerism — basic organic follow-through." },
    ],
    grade12: [
      { topic: "Electrochemistry",          why: "Nernst equation, EMF, electrolysis — always present." },
      { topic: "Chemical Kinetics",         why: "Rate laws, order determination, Arrhenius equation." },
      { topic: "Coordination Compounds",    why: "IUPAC, isomerism, VBT/CFT — consistent high marks in COMEDK." },
      { topic: "Aldehydes & Ketones",       why: "Named reactions, aldol condensation — high frequency organic." },
      { topic: "Haloalkanes (SN1/SN2)",     why: "Mechanism questions, stereochemistry — moderate but asked." },
      { topic: "Amines",                    why: "Basicity comparison, reactions — straightforward once understood." },
      { topic: "Biomolecules + Polymers",   why: "Factual chapter — fast marks if memorised before the exam." },
      { topic: "Solutions + Colligative",   why: "Vapour pressure, osmosis — formula-based easy marks." },
    ]
  }
};

const PHASES = [
  {
    id:'p1', num:1, name:'11TH REBUILD', dates:'APR 16 – APR 24', color:'#FF6B35',
    target:'Cover all high-weightage 11th topics. Not deep theory — concept notes, then straight to questions.',
    achieve:[
      'Maths: Trig, Seq & Series, Straight Lines, Circles, P&C, Binomial, Complex Nos, Quadratics, Limits',
      'Physics: Kinematics, Laws of Motion, WEP, Rotational, Gravitation, SHM, Waves, Thermo+KTG',
      'Chemistry: Mole Concept, Atomic Structure, Bonding, Thermo, Equilibrium, GOC, Hydrocarbons, s/p block'
    ]
  },
  {
    id:'p2', num:2, name:'12TH FINALIZE + PYQS', dates:'APR 25 – MAY 3', color:'#00C9FF',
    target:'12th is fresh — maintenance, not rebuilding. Subject-wise PYQs + mixed practice sessions.',
    achieve:[
      'Maths 12th: Integration, DEs, Vectors, 3D Geometry, Probability fully revised',
      'Physics 12th: Electrostatics → Modern Physics with PYQ practice',
      'Chemistry 12th: Full revision + subject-wise PYQ papers'
    ]
  },
  {
    id:'p3', num:3, name:'COMEDK CRUNCH', dates:'MAY 4 – MAY 8', color:'#FF3366',
    target:'Full timed mocks only. 3 hrs per mock + 1.5 hrs analysis. Zero new topics. Sleep 7+ hrs every night.',
    achieve:[
      'Complete 3 full timed COMEDK mocks under exam conditions',
      'Identify top 3 weak areas per subject post-mock and patch them',
      'No late nights — performance requires sleep, non-negotiable'
    ]
  },
  {
    id:'p4', num:4, name:'MET PHASE 2 PREP', dates:'MAY 10 – MAY 23', color:'#A8FF3E',
    target:'Post-COMEDK consolidation. Fix weak areas from mock analysis, then MET-specific PYQs.',
    achieve:[
      'Weak area deep dives based on actual COMEDK performance',
      'MET PYQs — subject-wise first, then full papers',
      '3 full timed MET mocks in final week — analyse every paper'
    ]
  }
];

const PHASE_COLORS = {1:'#FF6B35',2:'#00C9FF',3:'#FF3366',4:'#A8FF3E'};

const DAYS = [
  {date:'2026-04-16',phase:1,label:'APR 16',focus:'MATHS',   maths:'Trig: Identities + Compound Angles',            physics:'Kinematics (1D, 2D, Projectile)',          chem:'Mole Concept'},
  {date:'2026-04-17',phase:1,label:'APR 17',focus:'MATHS',   maths:'Trig: Equations + Inverse Trig',                physics:'Laws of Motion + Friction',               chem:'Atomic Structure'},
  {date:'2026-04-18',phase:1,label:'APR 18',focus:'PHYSICS', maths:'Sequences & Series (AP/GP/HP)',                 physics:'Work, Energy & Power',                    chem:'Chemical Bonding'},
  {date:'2026-04-19',phase:1,label:'APR 19',focus:'MATHS',   maths:'Straight Lines',                               physics:'Rotational Motion Pt.1 — MOI, Torque',     chem:'Thermodynamics (Chem)'},
  {date:'2026-04-20',phase:1,label:'APR 20',focus:'PHYSICS', maths:'Circles',                                      physics:'Rotational Motion Pt.2 — Rolling, Angular L',chem:'Equilibrium (Kp/Kc, pH)'},
  {date:'2026-04-21',phase:1,label:'APR 21',focus:'MATHS',   maths:'Permutations & Combinations',                  physics:'Gravitation + SHM',                        chem:'GOC (Inductive, Resonance, Hyperconj)'},
  {date:'2026-04-22',phase:1,label:'APR 22',focus:'CHEM',    maths:'Binomial Theorem',                             physics:'Waves (Standing Waves, Doppler)',           chem:'Hydrocarbons (IUPAC, Reactions)'},
  {date:'2026-04-23',phase:1,label:'APR 23',focus:'MATHS',   maths:'Complex Numbers + Quadratics',                 physics:'Thermodynamics + KTG',                     chem:'s-block + p-block Elements'},
  {date:'2026-04-24',phase:1,label:'APR 24',focus:'MATHS',   maths:'Limits & Derivatives (11th)',                  physics:'11th Revision + Q Practice',               chem:'11th Revision + Q Practice'},
  {date:'2026-04-25',phase:2,label:'APR 25',focus:'MATHS',   maths:'Integration: Substitution + By Parts',         physics:'Electrostatics (Coulomb, Field, Potential)',chem:'Electrochemistry'},
  {date:'2026-04-26',phase:2,label:'APR 26',focus:'MATHS',   maths:'Integration: Special Forms + Definite',        physics:'Capacitors + Gauss Law',                   chem:'Chemical Kinetics'},
  {date:'2026-04-27',phase:2,label:'APR 27',focus:'PHYSICS', maths:'Differential Equations',                       physics:'Current Electricity (Kirchhoff, Wheatstone)',chem:'Coordination Compounds'},
  {date:'2026-04-28',phase:2,label:'APR 28',focus:'MATHS',   maths:'Vectors + 3D Geometry',                        physics:'Magnetism + Moving Charges',               chem:'Aldehydes & Ketones'},
  {date:'2026-04-29',phase:2,label:'APR 29',focus:'CHEM',    maths:'Probability (Bayes, Conditional)',             physics:'EMI + AC Circuits',                        chem:'Haloalkanes + Amines'},
  {date:'2026-04-30',phase:2,label:'APR 30',focus:'PHYSICS', maths:'Matrices & Determinants',                      physics:'Ray Optics',                               chem:'Biomolecules + Polymers + Surface Chem'},
  {date:'2026-05-01',phase:2,label:'MAY 1', focus:'MATHS',   maths:'12th PYQs: Calculus focused',                  physics:'Wave Optics',                              chem:'Solutions + Colligative Properties'},
  {date:'2026-05-02',phase:2,label:'MAY 2', focus:'PHYSICS', maths:'Mixed PYQ: Maths full paper',                  physics:'Modern Physics + Semiconductors',          chem:'Mixed PYQ: Chemistry'},
  {date:'2026-05-03',phase:2,label:'MAY 3', focus:'MATHS',   maths:'Mixed PYQ: Full simulation',                   physics:'Mixed PYQ: Physics full',                  chem:'Mixed PYQ: Full simulation'},
  {date:'2026-05-04',phase:3,label:'MAY 4', focus:'MOCK',    maths:'COMEDK Full Mock #1',                          physics:'COMEDK Full Mock #1',                      chem:'COMEDK Full Mock #1',    isMock:true},
  {date:'2026-05-05',phase:3,label:'MAY 5', focus:'REVISION',maths:'Weak area revision (post-mock)',               physics:'Weak area revision (post-mock)',            chem:'Weak area revision (post-mock)'},
  {date:'2026-05-06',phase:3,label:'MAY 6', focus:'MOCK',    maths:'COMEDK Full Mock #2',                          physics:'COMEDK Full Mock #2',                      chem:'COMEDK Full Mock #2',    isMock:true},
  {date:'2026-05-07',phase:3,label:'MAY 7', focus:'REVISION',maths:'Weak area revision (post-mock)',               physics:'Weak area revision (post-mock)',            chem:'Weak area revision (post-mock)'},
  {date:'2026-05-08',phase:3,label:'MAY 8', focus:'LIGHT',   maths:'Formulas only — zero new problems',            physics:'Formulas only — zero new problems',        chem:'Formulas only — zero new problems'},
  {date:'2026-05-09',phase:3,label:'MAY 9', focus:'EXAM',    maths:'COMEDK EXAM',                                  physics:'COMEDK EXAM',                              chem:'COMEDK EXAM', isExam:true, examName:'COMEDK'},
  {date:'2026-05-10',phase:4,label:'MAY 10',focus:'REST',    maths:'Rest + light COMEDK review',                   physics:'Rest + light COMEDK review',               chem:'Rest + light COMEDK review'},
  {date:'2026-05-11',phase:4,label:'MAY 11',focus:'REVISION',maths:'Weak topic deep dive (Maths)',                 physics:'Weak topic deep dive (Physics)',            chem:'Weak topic deep dive (Chem)'},
  {date:'2026-05-12',phase:4,label:'MAY 12',focus:'MATHS',   maths:'MET PYQs: Maths',                              physics:'MET PYQs: Physics',                        chem:'MET PYQs: Chemistry'},
  {date:'2026-05-13',phase:4,label:'MAY 13',focus:'PHYSICS', maths:'MET PYQs: Maths continued',                   physics:'MET PYQs: Physics continued',              chem:'MET PYQs: Chemistry continued'},
  {date:'2026-05-14',phase:4,label:'MAY 14',focus:'CHEM',    maths:'Mixed weak area revision',                     physics:'Mixed weak area revision',                 chem:'Mixed weak area revision'},
  {date:'2026-05-15',phase:4,label:'MAY 15',focus:'MOCK',    maths:'MET Full Mock #1',                             physics:'MET Full Mock #1',                         chem:'MET Full Mock #1',       isMock:true},
  {date:'2026-05-16',phase:4,label:'MAY 16',focus:'REVISION',maths:'Mock analysis + weak areas',                  physics:'Mock analysis + weak areas',               chem:'Mock analysis + weak areas'},
  {date:'2026-05-17',phase:4,label:'MAY 17',focus:'MOCK',    maths:'MET Full Mock #2',                             physics:'MET Full Mock #2',                         chem:'MET Full Mock #2',       isMock:true},
  {date:'2026-05-18',phase:4,label:'MAY 18',focus:'REVISION',maths:'Mock analysis + weak areas',                  physics:'Mock analysis + weak areas',               chem:'Mock analysis + weak areas'},
  {date:'2026-05-19',phase:4,label:'MAY 19',focus:'MOCK',    maths:'MET Full Mock #3',                             physics:'MET Full Mock #3',                         chem:'MET Full Mock #3',       isMock:true},
  {date:'2026-05-20',phase:4,label:'MAY 20',focus:'REVISION',maths:'Final weak areas from mock 3',                physics:'Final weak areas from mock 3',             chem:'Final weak areas from mock 3'},
  {date:'2026-05-21',phase:4,label:'MAY 21',focus:'LIGHT',   maths:'Formula revision only',                       physics:'Formula revision only',                    chem:'Formula revision only'},
  {date:'2026-05-22',phase:4,label:'MAY 22',focus:'LIGHT',   maths:'Light revision — stay calm',                  physics:'Light revision — stay calm',               chem:'Light revision — stay calm'},
  {date:'2026-05-23',phase:4,label:'MAY 23',focus:'LIGHT',   maths:'Very light — formulas only',                  physics:'Very light — formulas only',               chem:'Very light — formulas only'},
  {date:'2026-05-24',phase:4,label:'MAY 24',focus:'EXAM',    maths:'MET PHASE 2 EXAM',                             physics:'MET PHASE 2 EXAM',                         chem:'MET PHASE 2 EXAM', isExam:true, examName:'MET PHASE 2'},
];

function pad(n){ return String(n).padStart(2,'0'); }
function diff(ts){
  const d = Math.max(0, ts - Date.now());
  return { d:Math.floor(d/86400000), h:Math.floor(d/3600000)%24, m:Math.floor(d/60000)%60, s:Math.floor(d/1000)%60 };
}

function SectionLabel({ children }){
  return (
    <div style={{
      fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(22px,4vw,32px)',
      letterSpacing:'5px', color:'#E0E0E0', marginBottom:'20px',
      paddingBottom:'10px', borderBottom:'1px solid #1e1e1e'
    }}>{children}</div>
  );
}

function Checkbox({ checked, color, onClick }){
  return (
    <div onClick={onClick} style={{
      width:'16px', height:'16px', borderRadius:'3px', flexShrink:0,
      border:`1.5px solid ${checked ? color : '#2a2a2a'}`,
      background: checked ? color : 'transparent',
      display:'flex', alignItems:'center', justifyContent:'center',
      cursor:'pointer', transition:'all .15s', fontSize:'10px', color:'#000', fontWeight:900
    }}>{checked ? '✓' : ''}</div>
  );
}

export default function StudyPlan(){
  const [checks, setChecks]     = useState({});
  const [cd, setCd]             = useState({ comedk:{d:0,h:0,m:0,s:0}, met:{d:0,h:0,m:0,s:0} });
  const [activeSub, setActiveSub] = useState('maths');
  const [expanded, setExpanded] = useState(null);

  // Load from storage
  useEffect(()=>{
    (async()=>{
      try {
        const r = await window.storage.get('kapish_checks_v1');
        if(r) setChecks(JSON.parse(r.value));
      } catch(e){}
    })();
  },[]);

  const toggle = useCallback((key)=>{
    setChecks(prev=>{
      const next = {...prev, [key]: !prev[key]};
      window.storage.set('kapish_checks_v1', JSON.stringify(next)).catch(()=>{});
      return next;
    });
  },[]);

  // Live countdown
  useEffect(()=>{
    const id = setInterval(()=>setCd({ comedk:diff(COMEDK_TS), met:diff(MET_TS) }),1000);
    setCd({ comedk:diff(COMEDK_TS), met:diff(MET_TS) });
    return ()=>clearInterval(id);
  },[]);

  const totalTasks = DAYS.filter(d=>!d.isExam).length * 3;
  const doneTasks  = Object.values(checks).filter(Boolean).length;
  const pct        = Math.min(100, Math.round(doneTasks/totalTasks*100));

  const sub = TOPICS[activeSub];

  return (
    <div style={{
      fontFamily:"'JetBrains Mono','Courier New',monospace",
      background:'#080808', color:'#E0E0E0', minHeight:'100vh'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;background:#0d0d0d;}
        ::-webkit-scrollbar-thumb{background:#222;}
        .btn{cursor:pointer;transition:all .2s;font-family:inherit;}
        .btn:hover{opacity:.8;}
        .chk{cursor:pointer;}
        .chk:hover>div:first-child{opacity:.7;}
        .daycard{cursor:pointer;transition:transform .15s;}
        .daycard:hover{transform:translateY(-1px);}
      `}</style>

      {/* ──────────── HERO ──────────── */}
      <div style={{
        background:'linear-gradient(180deg,#0e0e0e 0%,#080808 100%)',
        borderBottom:'1px solid #141414', padding:'48px 24px',
        textAlign:'center', position:'relative', overflow:'hidden'
      }}>
        {/* grid bg */}
        <div style={{
          position:'absolute',inset:0,opacity:.025,
          backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize:'50px 50px', pointerEvents:'none'
        }}/>

        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontSize:'10px',letterSpacing:'8px',color:'#333',marginBottom:'12px',fontWeight:600}}>
            // MISSION CONTROL — KAPISH 2026
          </div>
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:'clamp(32px,6vw,64px)', letterSpacing:'6px',
            color:'#E0E0E0', marginBottom:'6px'
          }}>STUDY COMMAND CENTER</div>
          <div style={{fontSize:'10px',color:'#333',letterSpacing:'3px',marginBottom:'28px'}}>
            COMEDK · MET PHASE 2 · LOCK IN
          </div>

          {/* Progress */}
          <div style={{maxWidth:'380px',margin:'0 auto 36px'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'9px',color:'#444',marginBottom:'6px',letterSpacing:'1px'}}>
              <span>OVERALL PROGRESS</span>
              <span>{doneTasks}/{totalTasks} TASKS — {pct}%</span>
            </div>
            <div style={{height:'3px',background:'#111',borderRadius:'2px'}}>
              <div style={{
                height:'100%',width:`${pct}%`,
                background:'linear-gradient(90deg,#FF6B35,#FF3366)',
                borderRadius:'2px',transition:'width .6s'
              }}/>
            </div>
          </div>

          {/* Countdowns */}
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            {[
              {label:'COMEDK',sub:'MAY 9, 2026',color:'#FF6B35',c:cd.comedk},
              {label:'MET P2',sub:'MAY 24, 2026',color:'#00C9FF',c:cd.met}
            ].map(({label,sub:s,color,c})=>(
              <div key={label} style={{
                border:`1px solid ${color}28`,background:`${color}06`,
                padding:'24px 28px',borderRadius:'6px',minWidth:'260px'
              }}>
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:'clamp(40px,8vw,72px)',color,lineHeight:1,letterSpacing:'4px'
                }}>{label}</div>
                <div style={{fontSize:'11px',color:'#555',marginBottom:'18px',letterSpacing:'3px'}}>{s}</div>
                <div style={{display:'flex',gap:'14px',justifyContent:'center'}}>
                  {[['DAYS',c.d],['HRS',c.h],['MIN',c.m],['SEC',c.s]].map(([lbl,v])=>(
                    <div key={lbl} style={{textAlign:'center'}}>
                      <div style={{
                        fontFamily:"'Bebas Neue',sans-serif",
                        fontSize:'clamp(28px,5vw,44px)',color,lineHeight:1
                      }}>{pad(v)}</div>
                      <div style={{fontSize:'8px',color:'#444',letterSpacing:'2px',marginTop:'4px'}}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────── TOPICS ──────────── */}
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'44px 20px 0'}}>
        <SectionLabel>IMPORTANT TOPICS</SectionLabel>

        {/* Subject tabs */}
        <div style={{display:'flex',gap:'8px',marginBottom:'24px',flexWrap:'wrap'}}>
          {Object.keys(TOPICS).map(s=>{
            const c = TOPICS[s].color;
            const active = activeSub===s;
            return (
              <button key={s} className="btn" onClick={()=>setActiveSub(s)} style={{
                padding:'8px 22px',fontSize:'11px',letterSpacing:'2px',fontWeight:700,
                borderRadius:'3px',
                background: active ? c : 'transparent',
                color: active ? '#000' : c,
                border:`1.5px solid ${c}`,
              }}>{s.toUpperCase()}</button>
            );
          })}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'16px'}}>
          {['grade11','grade12'].map(g=>(
            <div key={g} style={{border:`1px solid ${sub.color}1a`,borderRadius:'6px',overflow:'hidden'}}>
              <div style={{
                background:`${sub.color}10`,padding:'12px 16px',
                borderBottom:`1px solid ${sub.color}1a`,
                display:'flex',alignItems:'center',gap:'10px'
              }}>
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",fontSize:'20px',
                  color:sub.color,letterSpacing:'3px'
                }}>{sub.title}</div>
                <div style={{
                  fontSize:'9px',color:sub.color,
                  border:`1px solid ${sub.color}55`,padding:'2px 8px',
                  borderRadius:'2px',letterSpacing:'2px'
                }}>{g==='grade11'?'CLASS XI':'CLASS XII'}</div>
              </div>
              {sub[g].map((t,i)=>(
                <div key={i} style={{
                  padding:'10px 16px',
                  borderBottom: i<sub[g].length-1 ? '1px solid #111' : 'none'
                }}>
                  <div style={{fontSize:'12px',fontWeight:700,color:'#E0E0E0',marginBottom:'3px'}}>{t.topic}</div>
                  <div style={{fontSize:'10px',color:'#4a4a4a',lineHeight:1.6}}>{t.why}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ──────────── PHASES ──────────── */}
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'44px 20px 0'}}>
        <SectionLabel>MISSION PHASES</SectionLabel>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'14px'}}>
          {PHASES.map(ph=>{
            const done = ph.achieve.filter((_,i)=>checks[`${ph.id}_${i}`]).length;
            return (
              <div key={ph.id} style={{
                border:`1px solid ${ph.color}1a`,borderRadius:'6px',overflow:'hidden'
              }}>
                <div style={{
                  background:`${ph.color}0e`,padding:'14px 16px',
                  borderBottom:`1px solid ${ph.color}1a`
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div style={{
                      fontFamily:"'Bebas Neue',sans-serif",fontSize:'24px',
                      color:ph.color,letterSpacing:'2px'
                    }}>PHASE {ph.num}</div>
                    <div style={{fontSize:'9px',color:'#444',letterSpacing:'1px',marginTop:'6px'}}>
                      {done}/{ph.achieve.length} DONE
                    </div>
                  </div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#DDD',marginTop:'2px'}}>{ph.name}</div>
                  <div style={{fontSize:'9px',color:ph.color,marginTop:'4px',letterSpacing:'1px'}}>{ph.dates}</div>
                </div>
                <div style={{padding:'14px 16px'}}>
                  <div style={{fontSize:'10px',color:'#555',lineHeight:1.7,marginBottom:'14px'}}>{ph.target}</div>
                  <div style={{fontSize:'9px',color:'#3a3a3a',letterSpacing:'1px',marginBottom:'10px'}}>OBJECTIVES:</div>
                  {ph.achieve.map((item,i)=>{
                    const key=`${ph.id}_${i}`, chk=checks[key];
                    return (
                      <div key={i} className="chk"
                        onClick={()=>toggle(key)}
                        style={{
                          display:'flex',gap:'10px',alignItems:'flex-start',
                          padding:'7px 0',cursor:'pointer',
                          borderBottom: i<ph.achieve.length-1 ? '1px solid #0f0f0f':'none'
                        }}>
                        <Checkbox checked={chk} color={ph.color} onClick={()=>{}}/>
                        <div style={{
                          fontSize:'10px',color:chk?'#3a3a3a':'#999',
                          lineHeight:1.5,textDecoration:chk?'line-through':'none'
                        }}>{item}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{height:'2px',background:'#0d0d0d'}}>
                  <div style={{
                    height:'100%',width:`${done/ph.achieve.length*100}%`,
                    background:ph.color,transition:'width .4s'
                  }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──────────── CALENDAR ──────────── */}
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'44px 20px 0'}}>
        <SectionLabel>DAY-WISE CALENDAR</SectionLabel>
        <div style={{fontSize:'9px',color:'#2e2e2e',marginBottom:'28px',letterSpacing:'2px'}}>
          CLICK ANY DAY TO EXPAND AND TICK OFF DAILY TASKS
        </div>

        {[1,2,3,4].map(pn=>{
          const days   = DAYS.filter(d=>d.phase===pn);
          const pc     = PHASE_COLORS[pn];
          const po     = PHASES[pn-1];
          const cmplt  = days.filter(d=>!d.isExam && ['4hrs','2hrs','30q'].every(t=>checks[`${d.date}_${t}`])).length;
          const tot    = days.filter(d=>!d.isExam).length;

          return (
            <div key={pn} style={{marginBottom:'36px'}}>
              <div style={{
                display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap',
                marginBottom:'14px',paddingBottom:'10px',
                borderBottom:`1px solid ${pc}1a`
              }}>
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",fontSize:'20px',
                  color:pc,letterSpacing:'3px'
                }}>PHASE {pn} — {po.name}</div>
                <div style={{
                  fontSize:'9px',color:pc,border:`1px solid ${pc}44`,
                  padding:'2px 8px',borderRadius:'2px',letterSpacing:'1px'
                }}>{po.dates}</div>
                <div style={{fontSize:'9px',color:'#333',marginLeft:'auto',letterSpacing:'1px'}}>
                  {cmplt}/{tot} DAYS COMPLETE
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'8px'}}>
                {days.map(day=>{
                  if(day.isExam){
                    return (
                      <div key={day.date} style={{
                        border:`2px solid ${pc}`,background:`${pc}10`,
                        borderRadius:'6px',padding:'20px 14px',textAlign:'center'
                      }}>
                        <div style={{
                          fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',
                          color:pc,letterSpacing:'3px'
                        }}>{day.label}</div>
                        <div style={{fontSize:'10px',fontWeight:700,color:pc,letterSpacing:'2px',marginTop:'6px'}}>
                          🎯 {day.examName}
                        </div>
                        <div style={{fontSize:'9px',color:'#444',marginTop:'4px',letterSpacing:'1px'}}>EXAM DAY</div>
                      </div>
                    );
                  }

                  const t4 = checks[`${day.date}_4hrs`];
                  const t2 = checks[`${day.date}_2hrs`];
                  const tq = checks[`${day.date}_30q`];
                  const all = t4&&t2&&tq;
                  const cnt = [t4,t2,tq].filter(Boolean).length;
                  const isExp = expanded===day.date;

                  return (
                    <div key={day.date} className="daycard" style={{
                      border:`1px solid ${all?pc:isExp?pc+'55':'#161616'}`,
                      background: all ? `${pc}06` : '#0b0b0b',
                      borderRadius:'6px',overflow:'hidden'
                    }}>
                      <div onClick={()=>setExpanded(isExp?null:day.date)}
                        style={{padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div>
                          <div style={{
                            fontFamily:"'Bebas Neue',sans-serif",fontSize:'17px',
                            color: all?pc:'#DDD', letterSpacing:'2px'
                          }}>{day.label}</div>
                          <div style={{fontSize:'8px',color:`${pc}99`,letterSpacing:'1px',marginTop:'1px'}}>
                            {day.focus}
                          </div>
                        </div>
                        <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
                          {[t4,t2,tq].map((t,i)=>(
                            <div key={i} style={{
                              width:'6px',height:'6px',borderRadius:'50%',
                              background: t?pc:'#1c1c1c'
                            }}/>
                          ))}
                          <span style={{fontSize:'9px',color:all?pc:'#333',marginLeft:'3px'}}>{cnt}/3</span>
                        </div>
                      </div>

                      {isExp && (
                        <div style={{borderTop:'1px solid #111',padding:'12px'}}>
                          {/* Topics */}
                          <div style={{marginBottom:'12px'}}>
                            {[
                              {l:'M',v:day.maths,  c:'#FF6B35'},
                              {l:'P',v:day.physics, c:'#00C9FF'},
                              {l:'C',v:day.chem,    c:'#A8FF3E'}
                            ].map(({l,v,c})=>(
                              <div key={l} style={{display:'flex',gap:'6px',marginBottom:'5px',alignItems:'flex-start'}}>
                                <div style={{
                                  fontSize:'8px',fontWeight:700,color:c,
                                  border:`1px solid ${c}55`,padding:'1px 5px',
                                  borderRadius:'2px',flexShrink:0,marginTop:'1px',letterSpacing:'1px'
                                }}>{l}</div>
                                <div style={{fontSize:'10px',color:'#666',lineHeight:1.5}}>{v}</div>
                              </div>
                            ))}
                          </div>
                          {/* Tasks */}
                          <div style={{fontSize:'8px',color:'#2a2a2a',letterSpacing:'2px',marginBottom:'8px'}}>DAILY TASKS:</div>
                          {[
                            {key:`${day.date}_4hrs`, label:'4 HRS TOTAL STUDY'},
                            {key:`${day.date}_2hrs`, label:`2 HRS FOCUSED — ${day.focus}`},
                            {key:`${day.date}_30q`,  label:'30+ QUESTIONS PRACTICED'},
                          ].map(({key,label})=>{
                            const chk=checks[key];
                            return (
                              <div key={key} className="chk"
                                onClick={()=>toggle(key)}
                                style={{
                                  display:'flex',gap:'8px',alignItems:'center',
                                  padding:'6px 0',
                                  borderBottom:'1px solid #0d0d0d'
                                }}>
                                <Checkbox checked={chk} color={pc} onClick={()=>{}}/>
                                <div style={{
                                  fontSize:'10px',
                                  color:chk?'#2e2e2e':'#999',
                                  textDecoration:chk?'line-through':'none'
                                }}>{label}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div style={{textAlign:'center',padding:'40px 20px 20px',fontSize:'9px',color:'#1e1e1e',letterSpacing:'3px'}}>
        STOP CHECKING CUTOFFS. GO STUDY. // KAPISH 2026
      </div>
    </div>
  );
}
