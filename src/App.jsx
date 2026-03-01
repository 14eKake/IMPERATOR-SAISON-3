import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════
// ⚙ CONFIG SUPABASE — remplacer par tes vraies valeurs
// ═══════════════════════════════════════════════════════════
const SUPABASE_URL  = "https://esmafrehuerbcgnjqwwe.supabase.co";   // ← ton URL
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbWFmcmVodWVyYmNnbmpxd3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzODQwOTYsImV4cCI6MjA4Nzk2MDA5Nn0.4FavCrRe3QTxYSjAE5zRxRsu65ulJfa3lNuQStDgclQ"; // ← ta clé anon

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ═══════════════════════════════════════════════════════════
// CONSTANTES UI
// ═══════════════════════════════════════════════════════════
const PRIORITE = {
  critique:   { color: "#c0392b", bg: "#2d1111", label: "CRITIQUE" },
  urgent:     { color: "#e67e22", bg: "#2d1a08", label: "URGENT" },
  importante: { color: "#f39c12", bg: "#2d2308", label: "IMPORTANTE" },
  normale:    { color: "#27ae60", bg: "#0d2211", label: "NORMALE" },
  longterme:  { color: "#2980b9", bg: "#0d1a2d", label: "LONG TERME" },
  risquee:    { color: "#8e44ad", bg: "#1a0d2d", label: "RISQUÉE" },
};

const FACTION_STATUS = {
  actif:     { color: "#27ae60", label: "ACTIF" },
  potentiel: { color: "#f39c12", label: "POTENTIEL" },
  inactif:   { color: "#7f8c8d", label: "INACTIF" },
  inconnu:   { color: "#8e44ad", label: "INCONNU" },
  hostile:   { color: "#c0392b", label: "HOSTILE" },
};

const SUSPICION_LABELS = {
  0: { label: "INVISIBLE",  color: "#27ae60" },
  1: { label: "SURVEILLÉ",  color: "#f39c12" },
  2: { label: "CIBLÉ",      color: "#e67e22" },
  3: { label: "MENACÉ",     color: "#c0392b" },
  4: { label: "PERDU",      color: "#7b1818" },
};

// ═══════════════════════════════════════════════════════════
// HOOK — chargement + realtime Supabase
// ═══════════════════════════════════════════════════════════
function useSupabase() {
  const [connected, setConnected] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const [campaignState, setCampaignState] = useState({ current_day: 10, festival_result: null });
  const [suspicion,     setSuspicion]     = useState([]);
  const [finances,      setFinances]      = useState([]);
  const [factions,      setFactions]      = useState([]);
  const [actions,       setActions]       = useState([]);
  const [jalons,        setJalons]        = useState([]);
  const [notes,         setNotes]         = useState("");

  // Chargement initial
  useEffect(() => {
    async function load() {
      try {
        const [cs, susp, fin, fac, act, jal, not] = await Promise.all([
          supabase.from("campaign_state").select("*").single(),
          supabase.from("suspicion").select("*").order("id"),
          supabase.from("finances").select("*").order("id"),
          supabase.from("factions").select("*").order("name"),
          supabase.from("actions").select("*").order("id"),
          supabase.from("jalons").select("*").order("jour"),
          supabase.from("session_notes").select("*").single(),
        ]);

        if (cs.error)   throw new Error("campaign_state: " + cs.error.message);
        if (susp.error) throw new Error("suspicion: " + susp.error.message);

        setCampaignState(cs.data);
        setSuspicion(susp.data || []);
        setFinances(fin.data || []);
        setFactions(fac.data || []);
        setActions(act.data || []);
        setJalons(jal.data || []);
        setNotes(not.data?.contenu || "");
        setConnected(true);
        setError(null);
      } catch (e) {
        setError(e.message);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    if (!connected) return;

    const channels = [
      supabase.channel("campaign_state-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "campaign_state" },
          p => { if (p.new) setCampaignState(p.new); })
        .subscribe(),

      supabase.channel("suspicion-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "suspicion" },
          p => setSuspicion(prev => {
            if (p.eventType === "UPDATE") return prev.map(s => s.id === p.new.id ? p.new : s);
            return prev;
          }))
        .subscribe(),

      supabase.channel("finances-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "finances" },
          p => setFinances(prev => {
            if (p.eventType === "UPDATE") return prev.map(f => f.id === p.new.id ? p.new : f);
            return prev;
          }))
        .subscribe(),

      supabase.channel("factions-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "factions" },
          p => setFactions(prev => {
            if (p.eventType === "UPDATE") return prev.map(f => f.id === p.new.id ? p.new : f);
            return prev;
          }))
        .subscribe(),

      supabase.channel("actions-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "actions" },
          p => setActions(prev => {
            if (p.eventType === "UPDATE") return prev.map(a => a.id === p.new.id ? p.new : a);
            return prev;
          }))
        .subscribe(),

      supabase.channel("jalons-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "jalons" },
          p => setJalons(prev => {
            if (p.eventType === "UPDATE") return prev.map(j => j.jour === p.new.jour ? p.new : j);
            return prev;
          }))
        .subscribe(),
    ];

    return () => channels.forEach(c => supabase.removeChannel(c));
  }, [connected]);

  // ── MUTATIONS ──

  const updateDay = useCallback(async (delta) => {
    const newDay = Math.max(1, Math.min(100, campaignState.current_day + delta));
    setCampaignState(prev => ({ ...prev, current_day: newDay }));
    await supabase.from("campaign_state").update({ current_day: newDay, updated_at: new Date().toISOString() }).eq("id", "main");
  }, [campaignState.current_day]);

  const updateFestival = useCallback(async (result) => {
    setCampaignState(prev => ({ ...prev, festival_result: result }));
    await supabase.from("campaign_state").update({ festival_result: result, updated_at: new Date().toISOString() }).eq("id", "main");
  }, []);

  const updateSuspicion = useCallback(async (id, delta) => {
    const item = suspicion.find(s => s.id === id);
    if (!item) return;
    const newVal = Math.max(0, Math.min(4, item.value + delta));
    setSuspicion(prev => prev.map(s => s.id === id ? { ...s, value: newVal } : s));
    await supabase.from("suspicion").update({ value: newVal, updated_at: new Date().toISOString() }).eq("id", id);
  }, [suspicion]);

  const updateFinance = useCallback(async (id, amount) => {
    setFinances(prev => prev.map(f => f.id === id ? { ...f, amount } : f));
    await supabase.from("finances").update({ amount, updated_at: new Date().toISOString() }).eq("id", id);
  }, []);

  const updateFaction = useCallback(async (id, changes) => {
    setFactions(prev => prev.map(f => f.id === id ? { ...f, ...changes } : f));
    await supabase.from("factions").update({ ...changes, updated_at: new Date().toISOString() }).eq("id", id);
  }, []);

  const updateAction = useCallback(async (id, changes) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, ...changes } : a));
    await supabase.from("actions").update({ ...changes, updated_at: new Date().toISOString() }).eq("id", id);
  }, []);

  const updateJalon = useCallback(async (jour, changes) => {
    setJalons(prev => prev.map(j => j.jour === jour ? { ...j, ...changes } : j));
    await supabase.from("jalons").update({ ...changes, updated_at: new Date().toISOString() }).eq("jour", jour);
  }, []);

  const saveNotes = useCallback(async (text) => {
    setNotes(text);
    await supabase.from("session_notes").update({ contenu: text, updated_at: new Date().toISOString() }).eq("id", "main");
  }, []);

  return {
    connected, loading, error,
    campaignState, suspicion, finances, factions, actions, jalons, notes,
    updateDay, updateFestival, updateSuspicion, updateFinance,
    updateFaction, updateAction, updateJalon, saveNotes,
  };
}

// ═══════════════════════════════════════════════════════════
// COMPOSANTS
// ═══════════════════════════════════════════════════════════

const btn = (color, bg) => ({
  background: bg, border: `1px solid ${color}`, color,
  borderRadius: 6, padding: "5px 12px", fontSize: 11,
  cursor: "pointer", fontFamily: "'Cinzel', serif",
  letterSpacing: 0.5, transition: "all 0.2s",
});

function StatusBar({ connected, loading, error }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "4px 12px",
      background: error ? "#2d1111" : connected ? "#0d1a0d" : "#1a1a0d",
      borderBottom: `1px solid ${error ? "#c0392b" : connected ? "#1e4d1e" : "#3d3d10"}`,
      fontSize: 10, fontFamily: "'Cinzel', serif", letterSpacing: 1,
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: error ? "#c0392b" : loading ? "#f39c12" : connected ? "#27ae60" : "#7f8c8d",
        boxShadow: `0 0 6px ${error ? "#c0392b" : connected ? "#27ae60" : "transparent"}`,
      }} />
      <span style={{ color: error ? "#c0392b" : connected ? "#27ae60" : "#f39c12" }}>
        {error ? `ERREUR SUPABASE — ${error}` : loading ? "CONNEXION..." : "SUPABASE CONNECTÉ · TEMPS RÉEL"}
      </span>
      {error && (
        <span style={{ color: "#5c3d20", marginLeft: 8 }}>
          → Vérifier SUPABASE_URL et SUPABASE_ANON dans le code
        </span>
      )}
    </div>
  );
}

function DayCounter({ day, onAdj }) {
  const remaining = 100 - day;
  const pct = (day / 100) * 100;
  const dangerCol = remaining < 20 ? "#c0392b" : remaining < 40 ? "#e67e22" : "#c9a227";

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a0f0a 0%, #2d1a0d 100%)",
      border: "1px solid #5c3d20", borderRadius: 8,
      padding: "20px 24px", marginBottom: 16, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, height: "100%",
        width: `${pct}%`, background: "rgba(192,57,43,0.09)",
        transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
      }} />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ color: "#5c3d20", fontSize: 10, letterSpacing: 3, fontFamily: "'Cinzel', serif", marginBottom: 4 }}>
              DIES CONSPIRATIONIS
            </div>
            <div style={{ color: "#f0e6d3", fontSize: 42, fontWeight: 700, fontFamily: "'Cinzel Decorative', serif", lineHeight: 1 }}>
              DIES {day}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: dangerCol, fontSize: 34, fontWeight: 700, fontFamily: "'Cinzel Decorative', serif", lineHeight: 1 }}>
              {remaining}
            </div>
            <div style={{ color: "#5c3d20", fontSize: 9, letterSpacing: 2, marginTop: 2 }}>JOURS RESTANTS</div>
            <div style={{ color: "#3d2810", fontSize: 9, marginTop: 2 }}>LUDI IMPERATORIS</div>
          </div>
        </div>
        {/* Countdown bar */}
        <div style={{ height: 4, background: "#2a1f18", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: 2,
            background: `linear-gradient(90deg, #27ae60, ${dangerCol})`,
            transition: "width 0.6s",
          }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[-5, -1, +1, +5].map(d => (
            <button key={d} onClick={() => onAdj(d)}
              style={{ ...btn(d < 0 ? "#c0392b" : "#27ae60", d < 0 ? "#2d1111" : "#0d2211"), flex: 1, padding: "7px 0" }}>
              {d > 0 ? "+" : ""}{d}j
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SuspicionPanel({ suspicion, onAdj }) {
  return (
    <div style={{ background: "#14100d", border: "1px solid #3d2810", borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3 style={{ color: "#c9a227", fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, marginBottom: 14 }}>
        ⚠ JAUGE DE SUSPICION
      </h3>
      {suspicion.map(s => {
        const lvl = SUSPICION_LABELS[s.value] || SUSPICION_LABELS[0];
        return (
          <div key={s.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ color: "#c9b899", fontSize: 12, fontFamily: "'Cinzel', serif", flex: 1 }}>{s.label}</span>
              <span style={{
                background: lvl.color + "22", border: `1px solid ${lvl.color}`, color: lvl.color,
                fontSize: 9, padding: "2px 8px", borderRadius: 10, letterSpacing: 1,
              }}>{lvl.label}</span>
              <button onClick={() => onAdj(s.id, -1)} style={{ ...btn("#27ae60", "#0d2211"), padding: "3px 10px" }}>−</button>
              <button onClick={() => onAdj(s.id, +1)} style={{ ...btn("#c0392b", "#2d1111"), padding: "3px 10px" }}>+</button>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  flex: 1, height: 8, borderRadius: 2,
                  background: i < s.value ? lvl.color : "#2a2420",
                  border: `1px solid ${i < s.value ? lvl.color : "#3d3530"}`,
                  transition: "all 0.3s",
                }} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FinancesPanel({ finances, onUpdate }) {
  return (
    <div style={{ background: "#14100d", border: "1px solid #3d2810", borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3 style={{ color: "#c9a227", fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, marginBottom: 14 }}>
        🪙 RESSOURCES
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {finances.map(f => (
          <div key={f.id} style={{ background: "#1a1410", border: "1px solid #2d1a0d", borderRadius: 6, padding: 12 }}>
            <div style={{ color: "#5c3d20", fontSize: 9, letterSpacing: 2, marginBottom: 6 }}>{f.label.toUpperCase()}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <input
                type="number"
                value={f.amount}
                onChange={(e) => onUpdate(f.id, parseInt(e.target.value) || 0)}
                style={{
                  flex: 1, background: "transparent", border: "none",
                  borderBottom: "1px solid #3d2810", color: "#c9a227",
                  fontSize: f.id === "sesterces" ? 20 : 26, fontFamily: "'Cinzel Decorative', serif",
                  fontWeight: 700, outline: "none", width: "100%",
                }}
              />
              {f.unit && <span style={{ color: "#5c3d20", fontSize: 11 }}>{f.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FestivalResult({ result, onUpdate }) {
  const opts = [
    { val: "parfait",      label: "✅ Dose parfaite",  desc: "30% affectés — Tiberius humilié", color: "#27ae60" },
    { val: "partiel",      label: "⚠ Dose partielle", desc: "15% affectés — effet mitigé",     color: "#f39c12" },
    { val: "rate",         label: "❌ Trop faible",    desc: "Effet négligeable",               color: "#7f8c8d" },
    { val: "catastrophe",  label: "💀 Overdose",       desc: "Victimes · Susp. +1 Nona",        color: "#c0392b" },
  ];
  return (
    <div style={{ background: "#14100d", border: "1px solid #3d2810", borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3 style={{ color: "#c9a227", fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>
        🌾 RÉSULTAT DU FESTIVAL
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {opts.map(o => (
          <button key={o.val} onClick={() => onUpdate(o.val)}
            style={{
              background: result === o.val ? o.color + "22" : "#1a1410",
              border: `2px solid ${result === o.val ? o.color : "#2d1a0d"}`,
              borderRadius: 6, padding: 12, cursor: "pointer", textAlign: "left",
              transition: "all 0.2s",
            }}>
            <div style={{ color: result === o.val ? o.color : "#c9b899", fontSize: 12, marginBottom: 4 }}>{o.label}</div>
            <div style={{ color: "#5c3d20", fontSize: 10 }}>{o.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActionCard({ action, currentDay, onUpdate }) {
  const prio = PRIORITE[action.priorite] || PRIORITE.normale;
  const isActive = action.status === "active";
  const isDone   = action.status === "termine";
  const isEchec  = action.status === "echoue";
  const jourFin  = isActive && action.jour_debut ? action.jour_debut + action.duree : null;
  const joursRestants = jourFin ? jourFin - currentDay : null;
  const urgent = joursRestants !== null && joursRestants <= 2;

  return (
    <div style={{
      background: isDone ? "#0d110d" : isEchec ? "#130d0d" : `linear-gradient(135deg, #1a1410 0%, ${prio.bg} 100%)`,
      border: `1px solid ${isDone ? "#1d2d1d" : isEchec ? "#3d1111" : isActive ? prio.color : "#3d2810"}`,
      borderRadius: 8, padding: 14, marginBottom: 10,
      opacity: (isDone || isEchec) ? 0.55 : 1, transition: "all 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{
              background: prio.color, color: "#fff",
              fontSize: 9, padding: "2px 7px", borderRadius: 10, letterSpacing: 1,
            }}>{prio.label}</span>
            <span style={{ color: "#7a6550", fontSize: 10 }}>
              {action.id} · {action.duree}j
            </span>
            {isActive && action.jour_debut && (
              <span style={{ color: "#5c3d20", fontSize: 10 }}>
                Lancé Jour {action.jour_debut} → fin Jour {jourFin}
              </span>
            )}
          </div>
          <div style={{ color: (isDone || isEchec) ? "#4a504a" : "#e8d5b7", fontSize: 14, fontWeight: 600 }}>
            {isDone && "✓ "}{isEchec && "✗ "}{action.nom}
          </div>
        </div>
        {isActive && joursRestants !== null && (
          <div style={{
            background: urgent ? "#2d1111" : "#0d2211",
            border: `1px solid ${urgent ? "#c0392b" : "#27ae60"}`,
            borderRadius: 6, padding: "6px 12px", textAlign: "center", minWidth: 55,
          }}>
            <div style={{ color: urgent ? "#ff6b6b" : "#27ae60", fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
              {joursRestants}
            </div>
            <div style={{ color: urgent ? "#c0392b" : "#1e4d1e", fontSize: 9 }}>j. rest.</div>
          </div>
        )}
      </div>

      <div style={{ color: "#7a6550", fontSize: 11, marginBottom: 10 }}>{action.notes}</div>

      {action.joueur_assigne && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ color: "#5c3d20", fontSize: 10 }}>Assigné : </span>
          <span style={{ color: "#c9a227", fontSize: 11 }}>{action.joueur_assigne}</span>
        </div>
      )}

      {action.prerequis?.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ color: "#3d2810", fontSize: 10 }}>Prérequis : </span>
          <span style={{ color: "#5c3d20", fontSize: 10 }}>{action.prerequis.join(", ")}</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {action.status === "disponible" && (
          <button onClick={() => onUpdate(action.id, { status: "active", jour_debut: currentDay })}
            style={btn("#c9a227", "#2d2308")}>▶ Lancer</button>
        )}
        {isActive && <>
          <button onClick={() => onUpdate(action.id, { status: "termine" })}
            style={btn("#27ae60", "#0d2211")}>✓ Terminé</button>
          <button onClick={() => onUpdate(action.id, { status: "echoue" })}
            style={btn("#c0392b", "#2d1111")}>✗ Échoué</button>
          <button onClick={() => onUpdate(action.id, { status: "disponible", jour_debut: null })}
            style={btn("#7f8c8d", "#1a1a1a")}>↩ Annuler</button>
        </>}
        {(isDone || isEchec) && (
          <button onClick={() => onUpdate(action.id, { status: "disponible", jour_debut: null })}
            style={btn("#5c3d20", "#1a1010")}>↩ Réouvrir</button>
        )}
      </div>
    </div>
  );
}

function FactionCard({ faction, onChange }) {
  const st = FACTION_STATUS[faction.status] || FACTION_STATUS.inconnu;
  const [editNotes, setEditNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(faction.notes);

  return (
    <div style={{ background: "#14100d", border: `1px solid ${st.color}44`, borderRadius: 8, padding: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{
          background: st.color + "22", border: `1px solid ${st.color}`,
          color: st.color, fontSize: 9, padding: "2px 7px", borderRadius: 10, letterSpacing: 1,
        }}>{st.label}</span>
        <span style={{ color: "#e8d5b7", fontSize: 14, fontWeight: 600, flex: 1 }}>{faction.name}</span>
        <select value={faction.status}
          onChange={(e) => onChange(faction.id, { status: e.target.value })}
          style={{
            background: "#1a1410", border: "1px solid #3d2810", color: "#c9b899",
            fontSize: 11, borderRadius: 4, padding: "3px 6px",
          }}>
          {Object.entries(FACTION_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Confiance */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ color: "#5c3d20", fontSize: 10, width: 65 }}>CONFIANCE</span>
        <div style={{ display: "flex", gap: 4 }}>
          {[1,2,3,4,5].map(l => (
            <button key={l} onClick={() => onChange(faction.id, { confiance: faction.confiance === l ? l-1 : l })}
              style={{
                width: 26, height: 26, borderRadius: 4,
                background: l <= faction.confiance ? st.color + "33" : "#1a1410",
                border: `1px solid ${l <= faction.confiance ? st.color : "#3d2810"}`,
                cursor: "pointer", color: l <= faction.confiance ? st.color : "#3d2810",
                fontSize: 12, fontWeight: 700, transition: "all 0.2s",
              }}>★</button>
          ))}
        </div>
        <span style={{ color: st.color, fontSize: 13, fontWeight: 700, marginLeft: 4 }}>{faction.confiance}/5</span>
      </div>

      {/* Notes */}
      {!editNotes ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <div style={{ color: "#7a6550", fontSize: 11, flex: 1, lineHeight: 1.4 }}>{faction.notes || "—"}</div>
          <button onClick={() => setEditNotes(true)}
            style={{ ...btn("#5c3d20", "transparent"), fontSize: 9, padding: "2px 8px" }}>✏</button>
        </div>
      ) : (
        <div>
          <textarea value={localNotes} onChange={(e) => setLocalNotes(e.target.value)}
            style={{
              width: "100%", background: "#1a1410", border: "1px solid #3d2810",
              borderRadius: 4, color: "#c9b899", fontSize: 11, padding: 8,
              resize: "vertical", outline: "none", minHeight: 60, fontFamily: "inherit",
            }} />
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button onClick={() => { onChange(faction.id, { notes: localNotes }); setEditNotes(false); }}
              style={btn("#27ae60", "#0d2211")}>Sauvegarder</button>
            <button onClick={() => { setLocalNotes(faction.notes); setEditNotes(false); }}
              style={btn("#7f8c8d", "#1a1a1a")}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

function JalonTimeline({ jalons, currentDay, onUpdate }) {
  return (
    <div>
      {jalons.map((j, i) => {
        const past     = j.jour < currentDay;
        const imminent = !past && j.jour - currentDay <= 5;
        const isFinal  = j.jour === 100;
        const col = past ? "#3d2810" : imminent ? "#c0392b" : isFinal ? "#c9a227" : "#5c7a9a";

        return (
          <div key={j.jour} style={{ display: "flex", gap: 16, marginBottom: 20, position: "relative" }}>
            {i < jalons.length - 1 && (
              <div style={{
                position: "absolute", left: 19, top: 36, bottom: -20, width: 1,
                background: past ? "#2d1a0d" : "#3d2810",
              }} />
            )}
            {/* Dot */}
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              border: `2px solid ${col}`,
              background: j.status === "accompli" ? col + "33" : "#0d0907",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 12,
            }}>
              {j.status === "accompli" ? "✓" : j.status === "rate" ? "✗" : isFinal ? "⚔" : "◆"}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ color: col, fontSize: 10, letterSpacing: 2, fontFamily: "'Cinzel', serif" }}>
                  JOUR {j.jour}
                </span>
                {imminent && !past && (
                  <span style={{
                    background: "#c0392b", color: "#fff",
                    fontSize: 9, padding: "1px 7px", borderRadius: 10,
                    animation: "pulse 1.5s infinite",
                  }}>IMMINENT · {j.jour - currentDay}j</span>
                )}
                {isFinal && (
                  <span style={{ background: "#c9a227", color: "#1a0f0a", fontSize: 9, padding: "1px 7px", borderRadius: 10, fontWeight: 700 }}>
                    FINAL
                  </span>
                )}
              </div>
              <div style={{ color: past ? "#4a3828" : "#e8d5b7", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                {j.titre}
              </div>
              <div style={{ color: past ? "#3d2e20" : "#7a6550", fontSize: 11, marginBottom: 8 }}>
                {j.description}
              </div>
              {!past && (
                <div style={{ display: "flex", gap: 6 }}>
                  {j.status !== "accompli" && (
                    <button onClick={() => onUpdate(j.jour, { status: "accompli" })}
                      style={btn("#27ae60", "#0d2211")}>✓ Accompli</button>
                  )}
                  {j.status !== "rate" && (
                    <button onClick={() => onUpdate(j.jour, { status: "rate" })}
                      style={btn("#c0392b", "#2d1111")}>✗ Raté</button>
                  )}
                  {j.status !== "a_venir" && (
                    <button onClick={() => onUpdate(j.jour, { status: "a_venir" })}
                      style={btn("#5c3d20", "#1a1010")}>↩</button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
const TABS = [
  { id: "dashboard", label: "TABLEAU",    icon: "🏛" },
  { id: "actions",   label: "ACTIONS",    icon: "⚔" },
  { id: "factions",  label: "FACTIONS",   icon: "🌐" },
  { id: "jalons",    label: "JALONS",     icon: "📅" },
  { id: "notes",     label: "NOTES MJ",   icon: "📜" },
];

export default function ImperatorApp() {
  const db = useSupabase();
  const [tab, setTab] = useState("dashboard");
  const [localNotes, setLocalNotes] = useState("");
  const notesTimer = useRef(null);

  useEffect(() => { setLocalNotes(db.notes); }, [db.notes]);

  const handleNotesChange = (val) => {
    setLocalNotes(val);
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => db.saveNotes(val), 800);
  };

  const currentDay = db.campaignState.current_day;
  const rufusTimer = 15 - currentDay;
  const activeActions = db.actions.filter(a => a.status === "active").length;
  const imminentJalons = db.jalons.filter(j => j.status === "a_venir" && j.jour - currentDay >= 0 && j.jour - currentDay <= 5);

  return (
    <div style={{ minHeight: "100vh", background: "#0d0907", fontFamily: "'Georgia', serif", color: "#c9b899" }}>

      {/* STATUS BAR */}
      <StatusBar connected={db.connected} loading={db.loading} error={db.error} />

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(180deg, #1a0f0a 0%, #0d0907 100%)",
        borderBottom: "1px solid #2d1a0d", padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ color: "#5c3d20", fontSize: 10, letterSpacing: 4, fontFamily: "'Cinzel', serif" }}>IMPERATOR · SAISON III</div>
          <div style={{ color: "#c9a227", fontSize: 22, fontWeight: 700, fontFamily: "'Cinzel Decorative', serif", letterSpacing: 2 }}>
            LA CHUTE DU TYRAN
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {rufusTimer > 0 && rufusTimer <= 5 && (
            <div style={{
              background: "#2d1111", border: "1px solid #c0392b", borderRadius: 8, padding: "6px 14px",
              animation: "pulse 1.5s infinite",
            }}>
              <span style={{ color: "#c0392b", fontSize: 11, fontFamily: "'Cinzel', serif" }}>
                ⚠ RUFUS EXPLOSE DANS {rufusTimer}J
              </span>
            </div>
          )}
          {imminentJalons.map(j => (
            <div key={j.jour} style={{
              background: "#2d1a0d", border: "1px solid #e67e22", borderRadius: 8, padding: "6px 14px",
            }}>
              <span style={{ color: "#e67e22", fontSize: 10, fontFamily: "'Cinzel', serif" }}>
                📅 {j.titre} dans {j.jour - currentDay}j
              </span>
            </div>
          ))}
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#c0392b", fontSize: 26, fontWeight: 700, fontFamily: "'Cinzel Decorative', serif" }}>
              {100 - currentDay}
            </div>
            <div style={{ color: "#5c3d20", fontSize: 9, letterSpacing: 2 }}>JOURS</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a0f0a", background: "#100b08", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? "#1a0f0a" : "transparent",
              border: "none",
              borderBottom: `2px solid ${tab === t.id ? "#c9a227" : "transparent"}`,
              color: tab === t.id ? "#c9a227" : "#5c3d20",
              padding: "12px 20px", cursor: "pointer", fontSize: 11,
              fontFamily: "'Cinzel', serif", letterSpacing: 1.5, whiteSpace: "nowrap",
            }}>
            {t.icon} {t.label}
            {t.id === "actions" && activeActions > 0 && (
              <span style={{
                background: "#c9a227", color: "#1a0f0a",
                borderRadius: 10, fontSize: 9, padding: "1px 6px", marginLeft: 6, fontWeight: 700,
              }}>{activeActions}</span>
            )}
          </button>
        ))}
      </div>

      {/* PAGE CONTENT */}
      <div style={{ padding: 20, maxWidth: 940, margin: "0 auto" }}>

        {/* ── TABLEAU ── */}
        {tab === "dashboard" && !db.loading && (
          <div>
            <DayCounter day={currentDay} onAdj={db.updateDay} />
            <SuspicionPanel suspicion={db.suspicion} onAdj={db.updateSuspicion} />
            <FinancesPanel finances={db.finances} onUpdate={db.updateFinance} />
            <FestivalResult result={db.campaignState.festival_result} onUpdate={db.updateFestival} />

            {/* Résumé rapide */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              {[
                { val: activeActions, label: "ACTIONS EN COURS", color: "#c9a227" },
                { val: db.actions.filter(a => a.status === "termine").length, label: "TERMINÉES", color: "#27ae60" },
                { val: db.factions.filter(f => f.status === "actif").length, label: "FACTIONS ACTIVES", color: "#2980b9" },
                { val: db.jalons.filter(j => j.status === "accompli").length, label: "JALONS ACCOMPLIS", color: "#8e44ad" },
              ].map(s => (
                <div key={s.label} style={{ background: "#14100d", border: "1px solid #2d1a0d", borderRadius: 6, padding: 14, textAlign: "center" }}>
                  <div style={{ color: s.color, fontSize: 30, fontFamily: "'Cinzel Decorative', serif", fontWeight: 700 }}>{s.val}</div>
                  <div style={{ color: "#3d2810", fontSize: 9, letterSpacing: 1.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ACTIONS ── */}
        {tab === "actions" && !db.loading && (
          <div>
            {["critique", "urgent", "importante", "normale", "longterme", "risquee"].map(prio => {
              const acts = db.actions.filter(a => a.priorite === prio);
              if (!acts.length) return null;
              const p = PRIORITE[prio];
              return (
                <div key={prio}>
                  <div style={{
                    color: p.color, fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3,
                    marginTop: 20, marginBottom: 10, display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{ flex: 1, height: 1, background: p.color + "40" }} />
                    {p.label} ({acts.filter(a => a.status === "active").length}/{acts.length} actives)
                    <div style={{ flex: 1, height: 1, background: p.color + "40" }} />
                  </div>
                  {acts.map(a => <ActionCard key={a.id} action={a} currentDay={currentDay} onUpdate={db.updateAction} />)}
                </div>
              );
            })}
          </div>
        )}

        {/* ── FACTIONS ── */}
        {tab === "factions" && !db.loading && (
          <div>
            <p style={{ color: "#5c3d20", fontSize: 12, marginBottom: 16, fontStyle: "italic" }}>
              Cliquer sur les étoiles pour ajuster la confiance. Modifier le statut avec le menu.
            </p>
            {db.factions.map(f => <FactionCard key={f.id} faction={f} onChange={db.updateFaction} />)}
          </div>
        )}

        {/* ── JALONS ── */}
        {tab === "jalons" && !db.loading && (
          <div>
            <JalonTimeline jalons={db.jalons} currentDay={currentDay} onUpdate={db.updateJalon} />
            {rufusTimer > 0 && rufusTimer <= 8 && (
              <div style={{ background: "#2d1111", border: "1px solid #c0392b", borderRadius: 8, padding: 16, marginTop: 16 }}>
                <div style={{ color: "#c0392b", fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>
                  ⚠ TIMER RUFUS — PRIORITÉ ABSOLUE
                </div>
                <div style={{ color: "#e8d5b7" }}>
                  Rufus agit seul au <strong style={{ color: "#c0392b" }}>Jour 15</strong>. Il reste{" "}
                  <strong style={{ color: "#c0392b" }}>{rufusTimer} jour(s)</strong>.
                  Lancer l'Action <strong>A3 — Rôle pour Rufus</strong> immédiatement.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── NOTES ── */}
        {tab === "notes" && (
          <div>
            <h3 style={{ color: "#c9a227", fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 3, marginBottom: 12 }}>
              NOTES DU MAÎTRE DE JEU
            </h3>
            <textarea
              value={localNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Décisions des joueurs, rebondissements, idées pour la prochaine séance..."
              style={{
                width: "100%", minHeight: 450, background: "#14100d",
                border: "1px solid #3d2810", borderRadius: 8, padding: 16,
                color: "#c9b899", fontSize: 13, fontFamily: "'Georgia', serif",
                lineHeight: 1.7, resize: "vertical", outline: "none", boxSizing: "border-box",
              }}
            />
            <div style={{ color: "#2d1a0d", fontSize: 10, marginTop: 6, textAlign: "right" }}>
              {db.connected ? "✓ Sauvegarde Supabase automatique" : "⚠ Hors ligne"} · {localNotes.length} caractères
            </div>
          </div>
        )}

        {/* Loading state */}
        {db.loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ color: "#5c3d20", fontFamily: "'Cinzel', serif", fontSize: 14, letterSpacing: 3 }}>
              CONNEXION À SUPABASE...
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{
        borderTop: "1px solid #140c09", padding: "10px 24px", textAlign: "center",
        color: "#2d1a0d", fontSize: 10, letterSpacing: 2, fontFamily: "'Cinzel', serif",
      }}>
        IMPERATOR · LA CHUTE DU TYRAN · SAISON III · {db.connected ? "● SUPABASE" : "○ OFFLINE"}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d0907; }
        ::-webkit-scrollbar-thumb { background: #3d2810; border-radius: 3px; }
        button:hover { filter: brightness(1.25); }
        textarea::placeholder { color: #2d1a0d; }
        select option { background: #1a1410; }
      `}</style>
    </div>
  );
}
