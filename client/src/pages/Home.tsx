// Blackbox Operator style: the page starts as a credible verification panel and gradually exposes the comedy through telemetry, copy, and challenge escalation.

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, LockKeyhole, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import CaptchaShell from "@/components/CaptchaShell";
import ChallengeStage from "@/components/challenge/ChallengeStage";
import { useChallengeGame } from "@/hooks/useChallengeGame";
import type { DifficultyMode } from "@/types/game";

const modeCards: { id: DifficultyMode; name: string; detail: string; count: string; tag: string }[] = [
  { id: "normal", name: "Normal", detail: "A reasonable proof of personhood. By our standards.", count: "05 CHALLENGES", tag: "RECOMMENDED" },
  { id: "annoying", name: "Annoying", detail: "More tasks. Less certainty. Mild bureaucratic hostility.", count: "07 CHALLENGES", tag: "ESCALATED" },
  { id: "hell", name: "CAPTCHA FROM HELL", detail: "Randomized requirements, recursive checks, no refunds.", count: "09 CHALLENGES", tag: "YOU CHOSE THIS" },
];

function ping(muted: boolean, frequency = 420) {
  if (muted || typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "square";
    gain.gain.setValueAtTime(0.025, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.09);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.1);
  } catch { /* Audio is an enhancement, never a dependency. */ }
}

function Landing({ mode, onMode, onStart, muted }: { mode: DifficultyMode; onMode: (mode: DifficultyMode) => void; onStart: () => void; muted: boolean }) {
  return (
    <div className="landing-view">
      <div className="landing-hero">
        <div className="system-stamp"><span className="stamp-dot" /> AUTHENTICATION GATE / INBOUND REQUEST</div>
        <div className="hero-copy"><span className="eyebrow">SECURITY CHECK / HUMAN VERIFICATION REQUIRED</span><h1>Prove you're<br /><em>not a robot.</em></h1><p>Before continuing, please verify that you are human. This will be quick, professional, and almost certainly not a trap.</p></div>
        <div className="verification-panel">
          <div className="panel-top"><div><span className="micro-label">VERIFICATION REQUEST</span><strong>Suspicious activity detected.</strong></div><LockKeyhole size={17} /></div>
          <button type="button" className="fake-checkbox" onClick={onStart}><span className="checkbox-square" /><span>I'm not a robot</span><ChevronRight size={17} /></button>
          <div className="panel-status"><span className="status-led" /> Verification required <span className="panel-status-right">SECURE / TLS 1.3</span></div>
        </div>
      </div>
      <div className="mode-selector"><div className="mode-selector-head"><div><span className="eyebrow">SELECT A VERIFICATION PROFILE</span><h2>How difficult should being human be?</h2></div><span className="micro-label">MODE CONTROL / 03 OPTIONS</span></div><div className="mode-grid">{modeCards.map((card) => <button type="button" key={card.id} className={`mode-card ${mode === card.id ? "active" : ""}`} onClick={() => { onMode(card.id); ping(muted, 330); }}><span className="mode-tag">{card.tag}</span><strong>{card.name}</strong><span className="mode-detail">{card.detail}</span><span className="mode-count">{card.count}<ChevronRight size={14} /></span></button>)}</div></div>
      <div className="landing-foot"><span><Sparkles size={14} /> Fictional simulation — no real security service is involved.</span><span>EXPECTED SESSION: 04:32 <span className="foot-divider">/</span> NO DATA RETAINED</span></div>
    </div>
  );
}

function Transition({ mode }: { mode: DifficultyMode }) {
  const messages = mode === "hell" ? ["Opening the lower chamber...", "Cross-referencing your worst decisions...", "Verification inconclusive."] : ["Analyzing human behavior...", "Comparing cursor confidence...", "Verification inconclusive."];
  return <div className="transition-view"><div className="loading-orbit"><div /><div /><div /></div><span className="eyebrow">SYSTEM HANDSHAKE / {mode.toUpperCase()}</span><h1>Analyzing human behavior<span className="blink-cursor">_</span></h1><div className="boot-log">{messages.map((message, index) => <div key={message} style={{ animationDelay: `${index * 380}ms` }}><span>{String(index + 1).padStart(2, "0")}</span><span>{message}</span><b>{index === messages.length - 1 ? "WARN" : "OK"}</b></div>)}</div><div className="transition-progress"><span /><span /><span /><span /><span /></div></div>;
}

function Success({ snapshot, onContinue, onReset }: { snapshot: ReturnType<typeof useChallengeGame>["snapshot"]; onContinue: () => void; onReset: () => void }) {
  const seconds = snapshot.startedAt && snapshot.finishedAt ? Math.max(1, Math.round((snapshot.finishedAt - snapshot.startedAt) / 1000)) : 0;
  return <div className="result-view success-view"><div className="result-symbol"><CheckCircle2 size={34} /></div><span className="eyebrow">VERIFICATION COMPLETE / RESULT 200</span><h1>Human verified <span>✓</span></h1><p className="result-lede">Humanity confirmed. Against our better judgment.</p><div className="result-grid"><div><span>CHALLENGES COMPLETED</span><strong>{snapshot.completed}</strong></div><div><span>TOTAL ATTEMPTS</span><strong>{snapshot.totalAttempts}</strong></div><div><span>VERIFICATION TIME</span><strong>{seconds}s</strong></div><div><span>HUMAN CONFIDENCE</span><strong>{snapshot.confidence}%</strong></div><div><span>SUSPICION LEVEL</span><strong>{snapshot.suspicion}%</strong></div></div><div className="result-actions"><button type="button" className="submit-button primary" onClick={onContinue}>Continue <ArrowRight size={16} /></button><button type="button" className="text-button" onClick={onReset}><RotateCcw size={14} /> Verify again</button></div></div>;
}

function Joke({ onReset }: { onReset: () => void }) {
  return <div className="result-view joke-view"><div className="result-symbol warning"><ShieldCheck size={31} /></div><span className="eyebrow">ACCESS GRANTED / UNFORTUNATELY</span><h1>Thank you for proving<br /><em>you can complete CAPTCHA.</em></h1><p className="result-lede">This may actually make you more suspicious. The system will be thinking about this for several minutes.</p><div className="access-card"><span className="micro-label">FINAL SYSTEM NOTE</span><strong>“A robot could have done that.”</strong><span>— Verification Department, probably</span></div><button type="button" className="submit-button primary" onClick={onReset}>Verify again <RotateCcw size={16} /></button></div>;
}

export default function Home() {
  const game = useChallengeGame();
  const { snapshot } = game;
  const [muted, setMuted] = useState(false);
  const [selectedMode, setSelectedMode] = useState<DifficultyMode>(snapshot.mode);
  useEffect(() => setSelectedMode(snapshot.mode), [snapshot.mode]);
  useEffect(() => { if (snapshot.screen !== "transition") return; const timer = window.setTimeout(game.launchNext, 2500); return () => window.clearTimeout(timer); }, [snapshot.screen, snapshot.challengeSeed, game.launchNext]);
  const content = useMemo(() => {
    if (snapshot.screen === "landing") return <Landing mode={selectedMode} onMode={(mode) => { setSelectedMode(mode); game.setMode(mode); }} onStart={() => { ping(muted, 620); game.start(); }} muted={muted} />;
    if (snapshot.screen === "transition") return <Transition mode={snapshot.mode} />;
    if (snapshot.screen === "challenge") return <ChallengeStage snapshot={snapshot} record={(action) => { ping(muted, action.success ? 740 : 160); game.record(action); }} />;
    if (snapshot.screen === "success") return <Success snapshot={snapshot} onContinue={() => { ping(muted, 780); game.showJoke(); }} onReset={game.reset} />;
    return <Joke onReset={game.reset} />;
  }, [game, muted, selectedMode, snapshot]);
  return <CaptchaShell snapshot={snapshot} muted={muted} onToggleMute={() => setMuted((value) => !value)} onReset={game.reset}>{content}</CaptchaShell>;
}
