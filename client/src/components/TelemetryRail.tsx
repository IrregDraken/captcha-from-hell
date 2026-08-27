// Blackbox Operator style: telemetry is quiet, legible, and slightly accusatory; it should feel like a real operator console, not a scorecard.

import { Activity, ShieldAlert, TimerReset } from "lucide-react";
import type { EngineSnapshot } from "@/types/game";
import { challengeRegistry } from "@/challenges/registry";

interface TelemetryRailProps {
  snapshot: EngineSnapshot;
}

function Metric({ label, value, tone = "steel", icon }: { label: string; value: string; tone?: string; icon: React.ReactNode }) {
  return (
    <div className="metric-row">
      <div className="metric-icon" data-tone={tone}>{icon}</div>
      <div className="metric-copy"><span>{label}</span><strong>{value}</strong></div>
    </div>
  );
}

export default function TelemetryRail({ snapshot }: TelemetryRailProps) {
  const current = snapshot.currentChallengeId ? challengeRegistry[snapshot.currentChallengeId] : null;
  const progress = snapshot.challengeOrder.length ? Math.max(0, ((snapshot.challengeIndex + 1) / snapshot.challengeOrder.length) * 100) : 0;
  const modeName = snapshot.mode === "hell" ? "CAPTCHA FROM HELL" : snapshot.mode === "annoying" ? "ANNOYING" : "NORMAL";

  return (
    <aside className="telemetry-rail" aria-label="Verification telemetry">
      <div className="rail-head"><span className="micro-label">LIVE TELEMETRY</span><span className="pulse-dot" aria-hidden="true" /></div>
      <div className="confidence-block">
        <div className="micro-label">HUMAN CONFIDENCE</div>
        <div className="confidence-value">{snapshot.confidence}<span>%</span></div>
        <div className="confidence-track"><div className="confidence-fill" style={{ width: `${snapshot.confidence}%` }} /></div>
        <div className="confidence-caption">Confidence is not a feeling.</div>
      </div>
      <div className="metric-stack">
        <Metric label="Suspicion level" value={`${snapshot.suspicion}%`} tone="amber" icon={<ShieldAlert size={15} />} />
        <Metric label="Attempts" value={String(snapshot.totalAttempts).padStart(2, "0")} icon={<Activity size={15} />} />
        <Metric label="Challenges" value={`${snapshot.completed}/${snapshot.challengeOrder.length || "—"}`} tone="green" icon={<TimerReset size={15} />} />
      </div>
      <div className="rail-divider" />
      <div className="current-record">
        <div className="micro-label">CURRENT RECORD</div>
        <div className="record-name">{current?.title ?? "No active challenge"}</div>
        <div className="record-meta">{current?.difficulty ?? "STANDBY"} <span>•</span> {modeName}</div>
      </div>
      <div className="rail-footer">
        <div className="micro-label">SEQUENCE PROGRESS</div>
        <div className="sequence-count"><strong>{Math.max(snapshot.challengeIndex + 1, 0).toString().padStart(2, "0")}</strong><span>/</span><span>{snapshot.challengeOrder.length.toString().padStart(2, "0")}</span></div>
        <div className="sequence-track"><div style={{ width: `${progress}%` }} /></div>
      </div>
    </aside>
  );
}
