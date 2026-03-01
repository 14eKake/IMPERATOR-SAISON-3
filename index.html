import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// DONNÉES INITIALES — ÉTAT DE LA CAMPAGNE AU JOUR 10
// ═══════════════════════════════════════════════════════════
const INITIAL_STATE = {
  currentDay: 10,
  suspicion: {
    groupe: 1,
    caius: 1,
    rufus: 0,
    valeus: 0,
  },
  resources: {
    sesterces: 150000,
    contactsSubures: 18,
    senateursSympathisants: 35,
  },
  factions: [
    { id: "custodes", name: "Custodes (Lépidus)", status: "potentiel", confiance: 0, notes: "Attend preuves du parricide de Marcus. Réunion Jour 14." },
    { id: "senateurs", name: "Sénateurs (Ancus)", status: "actif", confiance: 3, notes: "30-40 sénateurs en attente. Documents livrés." },
    { id: "guilde", name: "Guilde de Vatia", status: "inconnu", confiance: 0, notes: "Contacts potentiels — pas encore approchés." },
    { id: "veterains", name: "Vétérans de Gaule", status: "inactif", confiance: 0, notes: "Dispersés dans Rome. À recruter." },
    { id: "caius", name: "Caius (Agent Palatin)", status: "actif", confiance: 4, notes: "Double jeu stable. Suspicion 1. Accès Palatin." },
  ],
  personnages: [
    { id: "maximus", name: "Maximus", emoji: "⚔️", statut: "Proconsul. Frère de Rufus.", danger: "moyen" },
    { id: "aven", name: "Aven", emoji: "🎭", statut: "Infiltré festival. Recruté.", danger: "faible" },
    { id: "nona", name: "Nona / Atépios", emoji: "🌿", statut: "Mission grain accomplie.", danger: "moyen" },
    { id: "aracos", name: "Aracos", emoji: "🗡️", statut: "Co-dirige réseau Subures.", danger: "faible" },
    { id: "caius_pj", name: "Caius", emoji: "📜", statut: "Double agent. Palatin.", danger: "élevé" },
    { id: "valeus", name: "Valeus", emoji: "🏛️", statut: "Sénateur/forgeron influent.", danger: "faible" },
  ],
  actions: [
    { id: "A1", nom: "Preuves du parricide", duree: 14, priorite: "critique", status: "disponible", jourDebut: null, joueurAssigne: "", notes: "Lépidus en a besoin. Plusieurs pistes possibles.", prerequis: [] },
    { id: "A2", nom: "Préparer rencontre Lépidus", duree: 4, priorite: "critique", status: "disponible", jourDebut: null, joueurAssigne: "", notes: "Automatique Jour 14 via Ancus.", prerequis: [] },
    { id: "A3", nom: "Rôle pour Rufus", duree: 3, priorite: "urgent", status: "disponible", jourDebut: null, joueurAssigne: "Maximus", notes: "Timer: 5 jours avant qu'il agisse seul!", prerequis: [] },
    { id: "A4", nom: "Neutraliser agent Verres", duree: 2, priorite: "urgent", status: "disponible", jourDebut: null, joueurAssigne: "", notes: "48h pour agir. +1 Suspicion si ignoré Jour 12.", prerequis: [] },
    { id: "A5", nom: "Approche Guilde Vatia", duree: 5, priorite: "normale", status: "disponible", jourDebut: null, joueurAssigne: "", notes: "300-500 sesterces requis.", prerequis: [] },
    { id: "A6", nom: "Espionnage via Caius", duree: 5, priorite: "normale", status: "disponible", jourDebut: null, joueurAssigne: "Caius", notes: "Continu. Surveiller suspicion Caius!", prerequis: [] },
    { id: "A7", nom: "Recrutement sénateurs", duree: 7, priorite: "normale", status: "disponible", jourDebut: null, joueurAssigne: "", notes: "+10 sénateurs potentiels via Ancus.", prerequis: ["A2"] },
    { id: "A8", nom: "Révéler Julia à Rufus", duree: 1, priorite: "importante", status: "disponible", jourDebut: null, joueurAssigne: "Maximus", notes: "Roleplay pur. Lieu sécurisé crucial.", prerequis: ["A3"] },
    { id: "A9", nom: "Trouver refuge sûr", duree: 3, priorite: "normale", status: "disponible", jourDebut: null, joueurAssigne: "", notes: "Sécurité +1 pour le groupe.", prerequis: [] },
    { id: "A10", nom: "Contacter vétérans Gaule", duree: 10, priorite: "longterme", status: "disponible", jourDebut: null, joueurAssigne: "", notes: "20-40 hommes. Aven/Aracos requis.", prerequis: [] },
    { id: "A11", nom: "Fabriquer fausses preuves", duree: 5, priorite: "risquée", status: "disponible", jourDebut: null, joueurAssigne: "", notes: "Option risquée si A1 échoue.", prerequis: [] },
    { id: "A12", nom: "Infiltrer le Palatin", duree: 7, priorite: "longterme", status: "disponible", jourDebut: null, joueurAssigne: "", notes: "Nécessite Caius + Aven ensemble.", prerequis: ["A6"] },
  ],
  jalons: [
    { jour: 14, titre: "Rencontre Lépidus", desc: "Ancus arrange le contact. Preuves requises.", status: "a_venir" },
    { jour: 18, titre: "Combat Invictus", desc: "Balbus a vendu les billets. Rufus doit y aller.", status: "a_venir" },
    { jour: 25, titre: "Purge au Sénat", desc: "Tiberius arrête 3 sénateurs. Ancus nerveux.", status: "a_venir" },
    { jour: 50, titre: "Réunion mi-parcours", desc: "Ancus convoque tous les conjurés.", status: "a_venir" },
    { jour: 100, titre: "Les Ludi Imperatoris", desc: "Tiberius entre dans l'arène. Tout se joue là.", status: "final" },
  ],
  notes: "",
  festivalResult: null, // "parfait" | "partiel" | "rate" | "catastrophe"
};

const PRIORITE_CONFIG = {
  critique: { color: "#c0392b", bg: "#2d1111", label: "CRITIQUE" },
  urgent: { color: "#e67e22", bg: "#2d1a08", label: "URGENT" },
  importante: { color: "#f39c12", bg: "#2d2308", label: "IMPORTANTE" },
  normale: { color: "#27ae60", bg: "#0d2211", label: "NORMALE" },
  longterme: { color: "#2980b9", bg: "#0d1a2d", label: "LONG TERME" },
  risquée: { color: "#8e44ad", bg: "#1a0d2d", label: "RISQUÉE" },
};

const FACTION_STATUS = {
  actif: { color: "#27ae60", label: "ACTIF" },
  potentiel: { color: "#f39c12", label: "POTENTIEL" },
  inactif: { color: "#7f8c8d", label: "INACTIF" },
  inconnu: { color: "#8e44ad", label: "INCONNU" },
  hostile: { color: "#c0392b", label: "HOSTILE" },
};

// ═══════════════════════════════════════════════════════════
// STORAGE — localStorage avec fallback
// ═══════════════════════════════════════════════════════════
const STORAGE_KEY = "imperator_s3_state";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...INITIAL_STATE, ...JSON.parse(raw) };
  } catch {}
  return INITIAL_STATE;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// ═══════════════════════════════════════════════════════════
// COMPOSANTS UI
// ═══════════════════════════════════════════════════════════

function SuspicionBar({ value, label }) {
  const max = 4;
  const colors = ["#27ae60", "#f39c12", "#e67e22", "#c0392b", "#7b1818"];
  const col = colors[Math.min(value, 4)];
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ color: "#c9b899", fontSize: 12, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>{label}</span>
        <span style={{ color: col, fontWeight: 700, fontSize: 14, fontFamily: "'Cinzel', serif" }}>{value} / {max}</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 8, borderRadius: 2,
            background: i < value ? col : "#2a2420",
            border: `1px solid ${i < value ? col : "#3d3530"}`,
            transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

function DayCounter({ currentDay }) {
  const remaining = 100 - currentDay;
  const pct = (currentDay / 100) * 100;
  const dangerColor = remaining < 20 ? "#c0392b" : remaining < 40 ? "#e67e22" : "#c9a227";
  return (
    <div style={{
      background: "linear-gradient(135deg, #1a0f0a 0%, #2d1a0d 100%)",
      border: "1px solid #5c3d20",
      borderRadius: 8,
      padding: "20px 24px",
      marginBottom: 16,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, height: "100%",
        width: `${pct}%`, background: "rgba(192, 57, 43, 0.08)",
        transition: "width 0.5s",
      }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#7a5c3a", fontSize: 11, letterSpacing: 3, fontFamily: "'Cinzel', serif", marginBottom: 4 }}>DIES CONSPIRATIONIS</div>
          <div style={{ color: "#f0e6d3", fontSize: 40, fontWeight: 700, fontFamily: "'Cinzel Decorative', serif", lineHeight: 1 }}>
            DIES {currentDay}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: dangerColor, fontSize: 32, fontWeight: 700, fontFamily: "'Cinzel Decorative', serif" }}>{remaining}</div>
          <div style={{ color: "#7a5c3a", fontSize: 10, letterSpacing: 2 }}>DIES RESTANT</div>
          <div style={{ color: "#5c3d20", fontSize: 10, letterSpacing: 1, marginTop: 4 }}>jusqu'aux LUDI IMPERATORIS</div>
        </div>
      </div>
    </div>
  );
}

function JalonTimeline({ jalons, currentDay }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ color: "#c9a227", fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 3, marginBottom: 12 }}>JALONS SCRIPTÉS</h3>
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", left: 20, top: 0, bottom: 0, width: 1,
          background: "linear-gradient(to bottom, #5c3d20, #3d2810)",
        }} />
        {jalons.map((j, i) => {
          const past = j.jour <= currentDay;
          const imminent = !past && j.jour - currentDay <= 5;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", marginBottom: 16, paddingLeft: 48, position: "relative" }}>
              <div style={{
                position: "absolute", left: 12, top: 4, width: 16, height: 16,
                borderRadius: "50%", border: `2px solid ${past ? "#5c3d20" : imminent ? "#c0392b" : "#c9a227"}`,
                background: past ? "#1a0f0a" : imminent ? "#2d1111" : "#1a0f0a",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {past && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3d2810" }} />}
                {!past && <div style={{ width: 6, height: 6, borderRadius: "50%", background: imminent ? "#c0392b" : "#c9a227" }} />}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{
                    color: past ? "#5c3d20" : imminent ? "#c0392b" : "#c9a227",
                    fontSize: 10, letterSpacing: 2, fontFamily: "'Cinzel', serif",
                  }}>JOUR {j.jour}</span>
                  {imminent && <span style={{ background: "#c0392b", color: "#fff", fontSize: 9, padding: "1px 6px", borderRadius: 10, letterSpacing: 1 }}>IMMINENT</span>}
                  {j.jour === 100 && <span style={{ background: "#c9a227", color: "#1a0f0a", fontSize: 9, padding: "1px 6px", borderRadius: 10, letterSpacing: 1, fontWeight: 700 }}>FINAL</span>}
                </div>
                <div style={{ color: past ? "#4a3828" : "#e8d5b7", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{j.titre}</div>
                <div style={{ color: past ? "#3d2e20" : "#7a6550", fontSize: 11 }}>{j.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionCard({ action, currentDay, onUpdate }) {
  const prio = PRIORITE_CONFIG[action.priorite] || PRIORITE_CONFIG.normale;
  const isActive = action.status === "active";
  const isDone = action.status === "termine";
  const jourFin = isActive && action.jourDebut ? action.jourDebut + action.duree : null;
  const joursRestants = jourFin ? jourFin - currentDay : null;

  return (
    <div style={{
      background: isDone ? "#0d110d" : `linear-gradient(135deg, #1a1410 0%, ${prio.bg} 100%)`,
      border: `1px solid ${isDone ? "#1d2d1d" : isActive ? prio.color : "#3d2810"}`,
      borderRadius: 8,
      padding: 14,
      marginBottom: 10,
      opacity: isDone ? 0.5 : 1,
      transition: "all 0.3s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{
              background: prio.color, color: "#fff",
              fontSize: 9, padding: "2px 7px", borderRadius: 10, letterSpacing: 1,
              fontFamily: "'Cinzel', serif",
            }}>{prio.label}</span>
            <span style={{ color: "#7a6550", fontSize: 10 }}>
              {action.id} · {action.duree} {action.duree > 1 ? "jours" : "jour"}
            </span>
          </div>
          <div style={{ color: isDone ? "#4a5a4a" : "#e8d5b7", fontSize: 14, fontWeight: 600 }}>{action.nom}</div>
        </div>
        {isActive && joursRestants !== null && (
          <div style={{
            background: joursRestants <= 2 ? "#c0392b" : "#1a2d1a",
            border: `1px solid ${joursRestants <= 2 ? "#c0392b" : "#27ae60"}`,
            borderRadius: 6, padding: "4px 10px", textAlign: "center",
          }}>
            <div style={{ color: joursRestants <= 2 ? "#ff9999" : "#27ae60", fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{joursRestants}</div>
            <div style={{ color: "#5c7a5c", fontSize: 9 }}>j. restants</div>
          </div>
        )}
      </div>

      <div style={{ color: "#7a6550", fontSize: 11, marginBottom: 10 }}>{action.notes}</div>

      {action.joueurAssigne && (
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: "#5c3d20", fontSize: 10 }}>Assigné : </span>
          <span style={{ color: "#c9a227", fontSize: 11, fontFamily: "'Cinzel', serif" }}>{action.joueurAssigne}</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {action.status === "disponible" && (
          <button onClick={() => onUpdate(action.id, { status: "active", jourDebut: currentDay })}
            style={btnStyle("#c9a227", "#2d2308")}>▶ Lancer (Jour {currentDay})</button>
        )}
        {isActive && (
          <button onClick={() => onUpdate(action.id, { status: "termine" })}
            style={btnStyle("#27ae60", "#0d2211")}>✓ Terminer</button>
        )}
        {isActive && (
          <button onClick={() => onUpdate(action.id, { status: "disponible", jourDebut: null })}
            style={btnStyle("#7f8c8d", "#1a1a1a")}>✗ Annuler</button>
        )}
        {isDone && (
          <button onClick={() => onUpdate(action.id, { status: "disponible", jourDebut: null })}
            style={btnStyle("#5c3d20", "#1a1010")}>↩ Réouvrir</button>
        )}
      </div>
    </div>
  );
}

function btnStyle(color, bg) {
  return {
    background: bg, border: `1px solid ${color}`, color, borderRadius: 6,
    padding: "5px 12px", fontSize: 11, cursor: "pointer", fontFamily: "'Cinzel', serif",
    letterSpacing: 0.5, transition: "all 0.2s",
  };
}

function FactionCard({ faction, onChange }) {
  const st = FACTION_STATUS[faction.status] || FACTION_STATUS.inconnu;
  const levels = [0, 1, 2, 3, 4, 5];
  return (
    <div style={{
      background: "#14100d", border: "1px solid #3d2810",
      borderRadius: 8, padding: 14, marginBottom: 10,
    }}>
      <div style={{ display: "flex", justify: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <span style={{
            background: st.color + "22", border: `1px solid ${st.color}`,
            color: st.color, fontSize: 9, padding: "2px 7px", borderRadius: 10,
            marginRight: 8, letterSpacing: 1,
          }}>{st.label}</span>
          <span style={{ color: "#e8d5b7", fontSize: 13, fontWeight: 600 }}>{faction.name}</span>
        </div>
        <select value={faction.status} onChange={(e) => onChange(faction.id, { status: e.target.value })}
          style={{ background: "#1a1410", border: "1px solid #3d2810", color: "#c9b899", fontSize: 11, borderRadius: 4, padding: "2px 6px" }}>
          {Object.entries(FACTION_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>
      <div style={{ color: "#7a6550", fontSize: 11, marginBottom: 8 }}>{faction.notes}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#5c3d20", fontSize: 10 }}>CONFIANCE</span>
        {levels.map(l => (
          <button key={l} onClick={() => onChange(faction.id, { confiance: l })}
            style={{
              width: 20, height: 20, borderRadius: 4,
              background: l <= faction.confiance ? "#c9a227" : "#2a2420",
              border: `1px solid ${l <= faction.confiance ? "#c9a227" : "#3d3530"}`,
              cursor: "pointer", fontSize: 10, color: l <= faction.confiance ? "#1a0f0a" : "#5c4a35",
            }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP PRINCIPALE
// ═══════════════════════════════════════════════════════════
export default function ImperatorApp() {
  const [state, setState] = useState(() => loadState());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notesLocal, setNotesLocal] = useState(state.notes);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback((path, value) => {
    setState(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  }, []);

  const updateAction = useCallback((id, changes) => {
    setState(prev => ({
      ...prev,
      actions: prev.actions.map(a => a.id === id ? { ...a, ...changes } : a),
    }));
  }, []);

  const updateFaction = useCallback((id, changes) => {
    setState(prev => ({
      ...prev,
      factions: prev.factions.map(f => f.id === id ? { ...f, ...changes } : f),
    }));
  }, []);

  const adjDay = (d) => setState(prev => ({ ...prev, currentDay: Math.max(1, Math.min(100, prev.currentDay + d)) }));
  const adjSusp = (key, d) => setState(prev => ({
    ...prev,
    suspicion: { ...prev.suspicion, [key]: Math.max(0, Math.min(4, prev.suspicion[key] + d)) },
  }));

  const tabs = [
    { id: "dashboard", label: "TABLEAU", icon: "🏛️" },
    { id: "actions", label: "ACTIONS", icon: "⚔️" },
    { id: "factions", label: "FACTIONS", icon: "🌐" },
    { id: "jalons", label: "JALONS", icon: "📅" },
    { id: "notes", label: "NOTES", icon: "📜" },
  ];

  const activeActions = state.actions.filter(a => a.status === "active").length;
  const rufusTimer = 15 - state.currentDay;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0907",
      fontFamily: "'Georgia', serif",
      color: "#c9b899",
    }}>
      {/* HEADER */}
      <div style={{
        background: "linear-gradient(180deg, #1a0f0a 0%, #0d0907 100%)",
        borderBottom: "1px solid #3d2810",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ color: "#5c3d20", fontSize: 10, letterSpacing: 4, fontFamily: "'Cinzel', serif" }}>IMPERATOR · SAISON III</div>
          <div style={{ color: "#c9a227", fontSize: 20, fontWeight: 700, fontFamily: "'Cinzel Decorative', serif", letterSpacing: 2 }}>LA CHUTE DU TYRAN</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {rufusTimer > 0 && rufusTimer <= 5 && (
            <div style={{
              background: "#2d1111", border: "1px solid #c0392b",
              borderRadius: 8, padding: "6px 14px",
              animation: "pulse 1.5s infinite",
            }}>
              <span style={{ color: "#c0392b", fontSize: 11, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>
                ⚠ RUFUS EXPLOSE DANS {rufusTimer} J.
              </span>
            </div>
          )}
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#c0392b", fontSize: 24, fontWeight: 700, fontFamily: "'Cinzel Decorative', serif" }}>
              {100 - state.currentDay}
            </div>
            <div style={{ color: "#5c3d20", fontSize: 9, letterSpacing: 2 }}>JOURS RESTANTS</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #2d1a0d",
        background: "#100b08",
        overflowX: "auto",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{
              background: activeTab === t.id ? "#1a0f0a" : "transparent",
              border: "none",
              borderBottom: activeTab === t.id ? "2px solid #c9a227" : "2px solid transparent",
              color: activeTab === t.id ? "#c9a227" : "#5c3d20",
              padding: "12px 20px",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "'Cinzel', serif",
              letterSpacing: 1.5,
              whiteSpace: "nowrap",
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>

        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <div>
            {/* Day control */}
            <DayCounter currentDay={state.currentDay} />
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[-5, -1, +1, +5].map(d => (
                <button key={d} onClick={() => adjDay(d)}
                  style={{ ...btnStyle(d < 0 ? "#c0392b" : "#27ae60", d < 0 ? "#2d1111" : "#0d2211"), flex: 1 }}>
                  {d > 0 ? "+" : ""}{d} jour{Math.abs(d) > 1 ? "s" : ""}
                </button>
              ))}
            </div>

            {/* SUSPICION */}
            <div style={{
              background: "#14100d", border: "1px solid #3d2810", borderRadius: 8, padding: 16, marginBottom: 16,
            }}>
              <h3 style={{ color: "#c9a227", fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>JAUGE DE SUSPICION</h3>
              {Object.entries(state.suspicion).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <SuspicionBar value={val} label={key.charAt(0).toUpperCase() + key.slice(1)} />
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => adjSusp(key, -1)} style={{ ...btnStyle("#27ae60", "#0d2211"), padding: "3px 8px" }}>−</button>
                    <button onClick={() => adjSusp(key, +1)} style={{ ...btnStyle("#c0392b", "#2d1111"), padding: "3px 8px" }}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* RESSOURCES */}
            <div style={{
              background: "#14100d", border: "1px solid #3d2810", borderRadius: 8, padding: 16, marginBottom: 16,
            }}>
              <h3 style={{ color: "#c9a227", fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>RESSOURCES</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { key: "sesterces", label: "SESTERCES", icon: "🪙", suffix: " HS" },
                  { key: "contactsSubures", label: "CONTACTS SUBURES", icon: "👤", suffix: "" },
                  { key: "senateursSympathisants", label: "SÉNATEURS ALLIÉS", icon: "🏛️", suffix: "" },
                ].map(r => (
                  <div key={r.key} style={{
                    background: "#1a1410", border: "1px solid #2d1a0d", borderRadius: 6, padding: 12,
                  }}>
                    <div style={{ color: "#5c3d20", fontSize: 9, letterSpacing: 2, marginBottom: 4 }}>{r.icon} {r.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input
                        type="number"
                        value={state.resources[r.key]}
                        onChange={(e) => update(`resources.${r.key}`, parseInt(e.target.value) || 0)}
                        style={{
                          flex: 1, background: "transparent", border: "none", borderBottom: "1px solid #3d2810",
                          color: "#c9a227", fontSize: 18, fontFamily: "'Cinzel Decorative', serif",
                          fontWeight: 700, width: "100%", outline: "none",
                        }}
                      />
                      <span style={{ color: "#5c3d20", fontSize: 11 }}>{r.suffix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FESTIVAL RESULT */}
            <div style={{
              background: "#14100d", border: "1px solid #3d2810", borderRadius: 8, padding: 16, marginBottom: 16,
            }}>
              <h3 style={{ color: "#c9a227", fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>RÉSULTAT DU FESTIVAL</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { val: "parfait", label: "✅ Dose parfaite", desc: "30% affectés, image détruite", color: "#27ae60" },
                  { val: "partiel", label: "⚠️ Dose partielle", desc: "15% affectés, effet mitigé", color: "#f39c12" },
                  { val: "rate", label: "❌ Trop faible", desc: "Effet négligeable", color: "#7f8c8d" },
                  { val: "catastrophe", label: "💀 Overdose", desc: "Victimes civiles. Susp. +1", color: "#c0392b" },
                ].map(opt => (
                  <button key={opt.val} onClick={() => update("festivalResult", opt.val)}
                    style={{
                      background: state.festivalResult === opt.val ? opt.color + "22" : "#1a1410",
                      border: `2px solid ${state.festivalResult === opt.val ? opt.color : "#2d1a0d"}`,
                      borderRadius: 6, padding: 10, cursor: "pointer", textAlign: "left",
                    }}>
                    <div style={{ color: state.festivalResult === opt.val ? opt.color : "#c9b899", fontSize: 12, marginBottom: 4 }}>{opt.label}</div>
                    <div style={{ color: "#5c3d20", fontSize: 10 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* QUICK STATS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "ACTIONS ACTIVES", val: activeActions, color: "#c9a227" },
                { label: "FACTIONS ACTIVES", val: state.factions.filter(f => f.status === "actif").length, color: "#27ae60" },
                { label: "ACTIONS TERMINÉES", val: state.actions.filter(a => a.status === "termine").length, color: "#2980b9" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "#14100d", border: "1px solid #2d1a0d",
                  borderRadius: 6, padding: 14, textAlign: "center",
                }}>
                  <div style={{ color: s.color, fontSize: 28, fontFamily: "'Cinzel Decorative', serif", fontWeight: 700 }}>{s.val}</div>
                  <div style={{ color: "#5c3d20", fontSize: 9, letterSpacing: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ACTIONS ── */}
        {activeTab === "actions" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ background: "#14100d", border: "1px solid #3d2810", borderRadius: 6, padding: "8px 14px" }}>
                <span style={{ color: "#c9a227", fontSize: 18, fontWeight: 700 }}>{activeActions}</span>
                <span style={{ color: "#5c3d20", fontSize: 11, marginLeft: 6 }}>EN COURS</span>
              </div>
              <div style={{ background: "#14100d", border: "1px solid #3d2810", borderRadius: 6, padding: "8px 14px" }}>
                <span style={{ color: "#27ae60", fontSize: 18, fontWeight: 700 }}>
                  {state.actions.filter(a => a.status === "termine").length}
                </span>
                <span style={{ color: "#5c3d20", fontSize: 11, marginLeft: 6 }}>TERMINÉES</span>
              </div>
            </div>

            {["critique", "urgent", "importante", "normale", "longterme", "risquée"].map(prio => {
              const actions = state.actions.filter(a => a.priorite === prio);
              if (actions.length === 0) return null;
              return (
                <div key={prio}>
                  <div style={{
                    color: PRIORITE_CONFIG[prio].color,
                    fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3,
                    marginBottom: 8, marginTop: 16,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <div style={{ flex: 1, height: 1, background: PRIORITE_CONFIG[prio].color + "40" }} />
                    {PRIORITE_CONFIG[prio].label}
                    <div style={{ flex: 1, height: 1, background: PRIORITE_CONFIG[prio].color + "40" }} />
                  </div>
                  {actions.map(a => (
                    <ActionCard key={a.id} action={a} currentDay={state.currentDay} onUpdate={updateAction} />
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ── FACTIONS ── */}
        {activeTab === "factions" && (
          <div>
            <p style={{ color: "#5c3d20", fontSize: 12, marginBottom: 16, fontStyle: "italic" }}>
              Relations et confiance avec les factions clés de la conspiration.
            </p>
            {state.factions.map(f => (
              <FactionCard key={f.id} faction={f} onChange={updateFaction} />
            ))}
          </div>
        )}

        {/* ── JALONS ── */}
        {activeTab === "jalons" && (
          <div>
            <JalonTimeline jalons={state.jalons} currentDay={state.currentDay} />
            <div style={{ background: "#14100d", border: "1px solid #c0392b", borderRadius: 8, padding: 16, marginTop: 8 }}>
              <div style={{ color: "#c0392b", fontSize: 11, fontFamily: "'Cinzel', serif", letterSpacing: 2, marginBottom: 8 }}>⚠ TIMER RUFUS</div>
              <div style={{ color: "#e8d5b7", fontSize: 13 }}>
                Sans action pour le canaliser, Rufus agit seul au <strong style={{ color: "#c0392b" }}>Jour 15</strong>.
              </div>
              <div style={{ marginTop: 8 }}>
                {state.currentDay < 15 ? (
                  <span style={{ color: "#e67e22" }}>
                    Il reste <strong>{15 - state.currentDay}</strong> jour(s) pour lancer l'Action A3.
                  </span>
                ) : (
                  <span style={{ color: "#27ae60" }}>⬛ Timer passé — situation gérée (ou non).</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── NOTES ── */}
        {activeTab === "notes" && (
          <div>
            <h3 style={{ color: "#c9a227", fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 3, marginBottom: 12 }}>NOTES DU MAÎTRE DE JEU</h3>
            <textarea
              value={notesLocal}
              onChange={(e) => {
                setNotesLocal(e.target.value);
                update("notes", e.target.value);
              }}
              placeholder="Vos notes de séance, décisions des joueurs, rebondissements inattendus..."
              style={{
                width: "100%", minHeight: 400,
                background: "#14100d", border: "1px solid #3d2810",
                borderRadius: 8, padding: 16,
                color: "#c9b899", fontSize: 13, fontFamily: "'Georgia', serif",
                lineHeight: 1.7, resize: "vertical", outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div style={{ color: "#3d2810", fontSize: 10, marginTop: 8, textAlign: "right" }}>
              Sauvegarde automatique • {notesLocal.length} caractères
            </div>

            {/* RESET */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #2d1a0d" }}>
              <button onClick={() => {
                if (window.confirm("Réinitialiser toute la campagne au Jour 10 ? Cette action est irréversible.")) {
                  localStorage.removeItem(STORAGE_KEY);
                  setState(INITIAL_STATE);
                  setNotesLocal("");
                }
              }}
                style={{ ...btnStyle("#c0392b", "#2d1111"), padding: "8px 20px" }}>
                ⚠ Réinitialiser au Jour 10
              </button>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{
        borderTop: "1px solid #1a0f0a",
        padding: "12px 24px",
        textAlign: "center",
        color: "#2d1a0d",
        fontSize: 10,
        letterSpacing: 2,
        fontFamily: "'Cinzel', serif",
      }}>
        IMPERATOR · LA CHUTE DU TYRAN · SAISON III · OUTIL MJ
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d0907; }
        ::-webkit-scrollbar-thumb { background: #3d2810; border-radius: 3px; }
        button:hover { filter: brightness(1.2); }
        textarea::placeholder { color: #3d2810; }
      `}</style>
    </div>
  );
}
