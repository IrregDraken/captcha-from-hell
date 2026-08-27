// Blackbox Operator style: each task is a different failure mode in the same console, with crisp hit targets, dry copy, and a reliable path to success.

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Circle, Clock3, Crosshair, Eye, Keyboard, MousePointer2, ShieldCheck, Square, Terminal, Triangle, Zap } from "lucide-react";
import type { ChallengeAction, EngineSnapshot } from "@/types/game";
import { finalAnswers, humanGlyphs, instructionObjects, instructionPrompts, nestedLabels, readCodes, terminalLines, trafficObjects } from "@/data/challengeData";
import { getChallengeDefinition } from "@/challenges/registry";

interface ChallengeStageProps {
  snapshot: EngineSnapshot;
  record: (action: ChallengeAction) => void;
}

const seededOrder = <T,>(items: T[], seed: number) => {
  const copy = [...items];
  let value = seed || 11;
  for (let i = copy.length - 1; i > 0; i -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const swap = Math.floor((value / 233280) * (i + 1));
    [copy[i], copy[swap]] = [copy[swap], copy[i]];
  }
  return copy;
};

function StageHeader({ snapshot, helper }: { snapshot: EngineSnapshot; helper: string }) {
  const definition = getChallengeDefinition(snapshot.currentChallengeId);
  return (
    <div className="stage-header">
      <div className="stage-number"><span>CHALLENGE</span><strong>{String(snapshot.challengeIndex + 1).padStart(2, "0")}</strong><span>/ {String(snapshot.challengeOrder.length).padStart(2, "0")}</span></div>
      <div className="stage-header-copy"><span className="eyebrow">{definition?.eyebrow}</span><h1>{definition?.title}</h1><p>{helper}</p></div>
      <div className="stage-timer"><Clock3 size={15} /><span>TIME LIMIT</span><strong>{definition?.estimatedSeconds}s</strong></div>
    </div>
  );
}

function SubmitButton({ children, onClick, disabled = false, tone = "primary" }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; tone?: "primary" | "quiet" }) {
  return <button type="button" className={`submit-button ${tone}`} onClick={onClick} disabled={disabled}>{children}<ArrowRight size={16} /></button>;
}

function FindHuman({ snapshot, record }: ChallengeStageProps) {
  const tiles = useMemo(() => seededOrder(humanGlyphs.map((glyph, index) => ({ glyph, robot: index !== 4, id: index })), snapshot.challengeSeed), [snapshot.challengeSeed]);
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="challenge-content">
      <StageHeader snapshot={snapshot} helper="Select the only biological signal in the grid. It is attempting to look ordinary." />
      <div className="challenge-instruction"><Crosshair size={16} /><span>SELECT THE HUMAN. DECOYS HAVE BEEN TRAINED TO LOOK CONFIDENT.</span></div>
      <div className="human-grid" role="group" aria-label="Human or robot tiles">
        {tiles.map((tile, index) => <button key={`${tile.id}-${snapshot.challengeSeed}`} type="button" aria-label={`Candidate ${index + 1}`} className={`human-tile ${selected === tile.id ? "selected" : ""}`} onClick={() => setSelected(tile.id)}><span className={tile.robot ? "robot-glyph" : "human-glyph"}>{tile.glyph}</span><span className="tile-id">ID {String(index + 1).padStart(2, "0")}</span></button>)}
      </div>
      <div className="stage-footer"><span className="attempt-copy">{selected === null ? "No candidate selected." : "Candidate queued for review."}</span><SubmitButton disabled={selected === null} onClick={() => record({ success: tiles.find((tile) => tile.id === selected)?.robot === false, message: tiles.find((tile) => tile.id === selected)?.robot === false ? "Biological signal accepted." : "Incorrect. That was suspicious." })}>Submit evidence</SubmitButton></div>
    </div>
  );
}

function TrafficLights({ snapshot, record }: ChallengeStageProps) {
  const tiles = useMemo(() => seededOrder(trafficObjects, snapshot.challengeSeed).slice(0, snapshot.mode === "hell" ? 12 : 9), [snapshot.challengeSeed, snapshot.mode]);
  const [selected, setSelected] = useState<number[]>([]);
  const [refreshes, setRefreshes] = useState(0);
  const correct = tiles.reduce((sum, tile) => sum + Number(tile.correct), 0);
  const submit = () => {
    const exact = selected.length === correct && selected.every((index) => tiles[index].correct);
    if (exact && refreshes < 1) {
      setRefreshes(1); setSelected([]); record({ success: false, message: "New objects detected. We moved the goalposts by 14 pixels." });
    } else record({ success: exact, message: exact ? "All traffic signals acknowledged." : "You missed an object. The street has filed a complaint." });
  };
  return (
    <div className="challenge-content">
      <StageHeader snapshot={snapshot} helper="Select every tile containing a traffic light. Similar objects are present for legal reasons." />
      <div className="challenge-instruction"><Eye size={16} /><span>{refreshes ? "ROUND 02 / NEW OBJECTS DETECTED" : "ROUND 01 / CLASSIFY ALL VISIBLE SIGNALS"}</span></div>
      <div className="traffic-grid" role="group" aria-label="Traffic light tiles">
        {tiles.map((tile, index) => <button key={`${tile.label}-${index}-${refreshes}`} type="button" aria-pressed={selected.includes(index)} className={`traffic-tile ${selected.includes(index) ? "selected" : ""}`} onClick={() => setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])}><span className={`traffic-glyph ${tile.tint}`}>{tile.glyph}</span><span>{tile.label}</span><span className="tile-check">{selected.includes(index) ? <Check size={14} /> : `0${index + 1}`}</span></button>)}
      </div>
      <div className="stage-footer"><span className="attempt-copy">{selected.length} selected / {tiles.length} observed</span><SubmitButton onClick={submit}>Submit classification</SubmitButton></div>
    </div>
  );
}

function ReadText({ snapshot, record }: ChallengeStageProps) {
  const code = useMemo(() => readCodes[snapshot.challengeSeed % readCodes.length], [snapshot.challengeSeed]);
  const [value, setValue] = useState("");
  return (
    <div className="challenge-content">
      <StageHeader snapshot={snapshot} helper="Enter the characters exactly as displayed. Ambiguity is a feature, apparently." />
      <div className="captcha-canvas" aria-label={`Distorted code ${code}`}><div className="captcha-noise" /><div className="captcha-code">{code.split("").map((character, index) => <span key={`${character}-${index}`} style={{ transform: `rotate(${(index % 2 ? -1 : 1) * (4 + index)}deg) translateY(${index % 3 === 0 ? 5 : 0}px)`, fontSize: `${28 + (index % 3) * 5}px` }}>{character}</span>)}</div><div className="captcha-line line-a" /><div className="captcha-line line-b" /></div>
      <label className="input-label" htmlFor="captcha-read">TRANSCRIPTION BUFFER</label><input id="captcha-read" className="captcha-input" value={value} onChange={(event) => setValue(event.target.value.toUpperCase())} autoComplete="off" placeholder="TYPE THE SIGNAL" />
      <div className="stage-footer"><span className="attempt-copy">O / 0 • I / l / 1 • S / 5 — good luck.</span><SubmitButton disabled={!value} onClick={() => record({ success: value.toUpperCase() === code.toUpperCase(), message: value.toUpperCase() === code.toUpperCase() ? "Optical recognition accepted." : "Those characters were not the characters. Probably." })}>Verify transcription</SubmitButton></div>
    </div>
  );
}

function Reaction({ snapshot, record }: ChallengeStageProps) {
  const [phase, setPhase] = useState<"waiting" | "green" | "early" | "late">("waiting");
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    setPhase("waiting");
    const delay = 2200 + (snapshot.challengeSeed % 1500);
    timerRef.current = window.setTimeout(() => setPhase((current) => current === "waiting" ? "late" : current), delay);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [snapshot.challengeSeed]);
  const retry = () => {
    setPhase("waiting");
    timerRef.current = window.setTimeout(() => setPhase((current) => current === "waiting" ? "late" : current), 2200 + (snapshot.challengeSeed % 1500));
  };
  const click = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (phase === "waiting") { setPhase("early"); record({ success: false, message: "Human impatience detected." }); }
    else if (phase === "green") { record({ success: true, message: "Acceptable reflexes detected.", confidenceDelta: 7 }); }
    else { record({ success: false, message: phase === "late" ? "Suspiciously slow human detected. Fresh attempt authorized." : "Human impatience detected. Try the waiting part." }); retry(); }
  };
  const arm = () => { if (phase === "waiting") setPhase("green"); };
  return (
    <div className="challenge-content reaction-content">
      <StageHeader snapshot={snapshot} helper="Click the button when it turns GREEN. Not before. Not after. The button is listening." />
      <div className={`reaction-panel ${phase}`}><span className="reaction-scan">REACTION GATE / ARMED</span><button type="button" className="reaction-button" onClick={click} onMouseEnter={arm} onFocus={arm}><span className="reaction-light" />{phase === "green" ? "CLICK NOW" : phase === "early" ? "TOO EARLY" : phase === "late" ? "TOO LATE" : "WAIT FOR GREEN"}</button><span className="reaction-hint">{phase === "waiting" ? "signal pending…" : phase === "green" ? "the color is legally green" : phase === "early" ? "your eagerness has been recorded" : "time is a construct; you still missed it"}</span></div>
      <div className="stage-footer"><span className="attempt-copy">Target latency: under 620ms</span><span className="key-hint"><Keyboard size={14} /> TAB + SPACE supported</span></div>
    </div>
  );
}

function Instructions({ snapshot, record }: ChallengeStageProps) {
  const variant = snapshot.challengeSeed % instructionPrompts.length;
  const [clicked, setClicked] = useState<string[]>([]);
  const success = variant === 0 ? clicked[0] === "red-circle" && clicked[1] === "blue-square" : variant === 1 ? clicked.includes("green-triangle") : clicked.length >= 4 && !clicked.includes("blue-square");
  const toggle = (id: string) => setClicked((current) => current.includes(id) ? current : [...current, id]);
  return (
    <div className="challenge-content">
      <StageHeader snapshot={snapshot} helper="Follow the instruction precisely. The legal department wrote this one." />
      <div className="awkward-instruction"><Terminal size={17} /><strong>{instructionPrompts[variant]}</strong></div>
      <div className="instruction-board">{instructionObjects.map((object) => <button key={object.id} type="button" className={`instruction-object ${object.shape} ${object.tint} ${clicked.includes(object.id) ? "selected" : ""}`} onClick={() => toggle(object.id)} aria-label={object.label}>{object.shape === "circle" ? <Circle /> : object.shape === "square" ? <Square /> : <Triangle />}<span>{object.label}</span></button>)}</div>
      <div className="stage-footer"><span className="attempt-copy">{clicked.length ? `${clicked.length} objects acknowledged.` : "No objects acknowledged."}</span><SubmitButton onClick={() => record({ success, message: success ? "Instruction compliance accepted." : "You followed the words, not the meaning." })}>Submit sequence</SubmitButton></div>
    </div>
  );
}

function ImpossibleCheckbox({ snapshot, record }: ChallengeStageProps) {
  const [moves, setMoves] = useState(0);
  const positions = [{ x: 8, y: 8 }, { x: 62, y: 14 }, { x: 34, y: 62 }, { x: 70, y: 66 }];
  const position = positions[Math.min(moves, positions.length - 1)];
  const approach = () => { if (moves < 4) setMoves((count) => count + 1); };
  return (
    <div className="challenge-content">
      <StageHeader snapshot={snapshot} helper="Please click the checkbox. It has developed a small amount of self-preservation." />
      <div className="moving-zone" onPointerMove={approach}><div className="moving-grid" /><button type="button" className={`moving-checkbox ${moves >= 4 ? "settled" : ""}`} style={{ left: `${position.x}%`, top: `${position.y}%` }} onMouseEnter={approach} onClick={() => record({ success: true, message: "Fine. Checkbox acknowledged.", confidenceDelta: 5 })}><span className="checkbox-square" /><span>I am not a robot</span></button><span className="move-count">EVASION ATTEMPTS {moves}/4</span></div>
      <div className="stage-footer"><span className="attempt-copy">It will stop moving after four evasions.</span><span className="key-hint"><MousePointer2 size={14} /> keyboard activation remains valid</span></div>
    </div>
  );
}

function BehaviorAnalysis({ snapshot, record }: ChallengeStageProps) {
  const [visible, setVisible] = useState(0);
  useEffect(() => { setVisible(0); const interval = window.setInterval(() => setVisible((current) => Math.min(terminalLines.length, current + 1)), 520); return () => window.clearInterval(interval); }, [snapshot.challengeSeed]);
  const complete = visible >= terminalLines.length;
  return (
    <div className="challenge-content">
      <StageHeader snapshot={snapshot} helper="Remain still while we infer whether your behavior is human, robotic, or simply odd." />
      <div className="terminal-window"><div className="terminal-bar"><span className="terminal-dot red" /><span className="terminal-dot amber" /><span className="terminal-dot green" /><span>behavioral_inference.log</span></div>{terminalLines.map((line, index) => <div key={line} className={`terminal-line ${index < visible ? "visible" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span>{line}<i>{index < visible ? "OK" : "—"}</i></div>)}<div className={`analysis-result ${complete ? "visible" : ""}`}><span>PROBABILITY OF HUMAN</span><strong>{snapshot.mode === "hell" ? "97.4" : "98.1"}%</strong></div></div>
      <div className="stage-footer"><span className="attempt-copy">{complete ? "Verification confidence insufficient." : "Analysis in progress…"}</span><SubmitButton disabled={!complete} onClick={() => record({ success: true, message: "Analysis complete. Confidence insufficient anyway.", confidenceDelta: 1 })}>Accept analysis</SubmitButton></div>
    </div>
  );
}

function CaptchaCeption({ snapshot, record }: ChallengeStageProps) {
  const [layer, setLayer] = useState(0);
  const click = () => { if (layer < nestedLabels.length - 1) setLayer((current) => current + 1); else record({ success: true, message: "Recursive verification collapsed successfully.", confidenceDelta: 3 }); };
  return (
    <div className="challenge-content nested-content">
      <StageHeader snapshot={snapshot} helper="A verification inside a verification inside a questionable use of your afternoon." />
      <div className="nested-stage"><div className="nested-meta">VERIFICATION {layer + 1}/{nestedLabels.length}</div><div className="nested-frame" style={{ transform: `translate(${layer * 5}px, ${layer * 5}px) rotate(${layer % 2 ? 0.4 : -0.4}deg)` }}><button type="button" className="nested-checkbox" onClick={click}><span className="checkbox-square" /><span>{nestedLabels[layer]}</span></button><span className="nested-annotation">{layer === 0 ? "outer shell" : layer === 4 ? "please" : "nested layer detected"}</span></div></div>
      <div className="stage-footer"><span className="attempt-copy">{layer === 4 ? "No further layers detected. Suspicious." : `${nestedLabels.length - layer - 1} layers remain.`}</span><span className="key-hint">each layer is solvable</span></div>
    </div>
  );
}

function FinalBoss({ record }: ChallengeStageProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const response = answer === "D" ? "Self-awareness is not a disqualifier. Yet." : answer === "B" ? "Correct, but that is exactly what a motivated robot would say." : "Noted. We will be pretending this helped.";
  return (
    <div className="challenge-content final-boss-content">
      <div className="boss-mark"><Zap size={22} /></div><div className="eyebrow">ULTIMATE REVIEW / FINAL BOSS</div><h1>Final Humanity Test</h1><p className="boss-lede">We need one final piece of evidence.</p><div className="final-question"><span>WHAT WOULD A ROBOT DO?</span><div className="answer-list">{finalAnswers.map((option) => <button key={option.id} type="button" className={answer === option.id ? "selected" : ""} onClick={() => setAnswer(option.id)}><b>{option.id}</b><span>{option.label}</span></button>)}</div></div>{answer && <div className="boss-response"><ShieldCheck size={17} /><span>{response}</span></div>}<div className="stage-footer"><span className="attempt-copy">There is no wrong answer. This is not reassuring.</span><SubmitButton disabled={!answer} onClick={() => record({ success: true, message: "Final answer logged. Humanity remains statistically plausible.", confidenceDelta: 8 })}>Submit final evidence</SubmitButton></div>
    </div>
  );
}

export default function ChallengeStage(props: ChallengeStageProps) {
  switch (props.snapshot.currentChallengeId) {
    case "find-human": return <FindHuman {...props} />;
    case "traffic-lights": return <TrafficLights {...props} />;
    case "read-text": return <ReadText {...props} />;
    case "reaction": return <Reaction {...props} />;
    case "instructions": return <Instructions {...props} />;
    case "impossible-checkbox": return <ImpossibleCheckbox {...props} />;
    case "behavior-analysis": return <BehaviorAnalysis {...props} />;
    case "captcha-ception": return <CaptchaCeption {...props} />;
    case "final-boss": return <FinalBoss {...props} />;
    default: return null;
  }
}
