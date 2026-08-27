// Blackbox Operator style: the shell is an offset operations console with strict metadata, one branded acid signal, and enough breathing room for the joke to land.

import { RotateCcw, Volume2, VolumeX, Wifi } from "lucide-react";
import type { EngineSnapshot } from "@/types/game";
import TelemetryRail from "@/components/TelemetryRail";

interface CaptchaShellProps {
  snapshot: EngineSnapshot;
  children: React.ReactNode;
  muted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
}

export default function CaptchaShell({ snapshot, children, muted, onToggleMute, onReset }: CaptchaShellProps) {
  return (
    <div className="app-frame">
      <div className="ambient-backdrop" aria-hidden="true" />
      <div className="scanline-layer" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><img src="/manus-storage/captcha-eye-mark_a0e2d007.png" alt="" /></div>
          <div><div className="brand-name">CAPTCHA <span>FROM HELL</span></div><div className="brand-sub">HUMANITY VERIFICATION SYSTEM / BUILD 0.9.7</div></div>
        </div>
        <div className="topbar-status"><span className="status-connection"><Wifi size={14} /> SECURE LINK</span><span className="status-divider" /><span className="status-session">SESSION {snapshot.startedAt ? "ACTIVE" : "STANDBY"}</span></div>
        <div className="topbar-actions">
          <button type="button" className="icon-button" onClick={onToggleMute} aria-label={muted ? "Enable sound" : "Mute sound"}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
          <button type="button" className="icon-button" onClick={onReset} aria-label="Reset verification"><RotateCcw size={16} /></button>
        </div>
      </header>
      <div className="mobile-telemetry"><TelemetryRail snapshot={snapshot} /></div>
      <main className="console-layout">
        <section className="challenge-column">
          <div className="command-row"><span className="command-prefix">SYS://VERIFY</span><span className="command-state" data-tone={snapshot.feedbackTone}>{snapshot.status}</span><span className="command-time">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}</span></div>
          <div className="challenge-bay">{children}</div>
          <div className="audit-bar"><span className="audit-marker" /> <span className="micro-label">AUDIT TRAIL</span><span className="audit-copy">{snapshot.feedback}</span><span className="audit-right">ENCRYPTED / LOCAL</span></div>
        </section>
        <TelemetryRail snapshot={snapshot} />
      </main>
      <footer className="footer-line"><span>FICTIONAL SIMULATION — NOT A REAL CAPTCHA SERVICE</span><span>NO TRACKING / NO ROBOTS WERE HARMED</span></footer>
    </div>
  );
}
