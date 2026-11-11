"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Gift,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import { Answer, getResult, questions } from "./test-data";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
type Stage = "intro" | "quiz" | "reveal" | "result";
export default function Home() {
  const [stage, setStage] = useState<Stage>("intro"),
    [name, setName] = useState(""),
    [index, setIndex] = useState(0),
    [answers, setAnswers] = useState<Answer[]>([]),
    [saved, setSaved] = useState(false),
    [stats, setStats] = useState<number | null>(null),
    [choosing, setChoosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    result = answers.length === questions.length ? getResult(answers) : null,
    q = questions[index];
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const save = (final: Answer[]) => {
    const r = getResult(final);
    fetch(`${api}/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        code: r.code,
        flavor: r.flavor,
      }),
    })
      .then((x) => {
        if (!x.ok) throw Error("save");
        setSaved(true);
        return fetch(`${api}/results/count`);
      })
      .then((x) => x.json())
      .then((x) => setStats(x.total))
      .catch(() => setSaved(false));
  };
  const choose = (a: Answer) => {
    if (choosing) return;
    setChoosing(true);
    const next = [...answers.slice(0, index), a];
    setAnswers(next);
    if (index === questions.length - 1) {
      setStage("reveal");
      setSaved(false);
      save(next);
      timer.current = setTimeout(() => setStage("result"), 2600);
    } else
      setTimeout(() => {
        setIndex((v) => v + 1);
        setChoosing(false);
      }, 220);
  };
  const back = () => {
    if (choosing) return;
    if (!index) setStage("intro");
    else {
      setIndex((v) => v - 1);
      setAnswers((v) => v.slice(0, -1));
    }
  };
  const restart = () => {
    if (timer.current) clearTimeout(timer.current);
    setStage("intro");
    setIndex(0);
    setAnswers([]);
    setStats(null);
    setSaved(false);
    setChoosing(false);
  };
  const share = async () => {
    if (!result) return;
    const text = `🍫 빼빼로로 알아보는 한컴케어링크 업무성향\n${name}님의 결과: ${result.nickname} (${result.code})\n${result.flavor}`;
    try {
      if (navigator.share)
        await navigator.share({ title: "한컴케어링크 업무성향", text });
      else await navigator.clipboard.writeText(text);
    } catch {}
  };
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {["💖", "✨", "⭐", "💕", "🍫", "💫"].map((x, i) => (
          <span
            key={i}
            className="float absolute text-3xl opacity-50"
            style={{
              left: `${9 + i * 16}%`,
              top: `${8 + ((i * 23) % 82)}%`,
              animationDelay: `${i * 0.35}s`,
            }}
          >
            {x}
          </span>
        ))}
      </div>
      <div className="relative z-10 w-full max-w-[560px] rounded-[36px] border-4 border-white bg-white/90 px-6 py-8 text-center shadow-[0_25px_80px_rgba(227,100,150,.22)] backdrop-blur-xl sm:px-10 sm:py-11">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-xs font-extrabold tracking-widest text-pink-600">
          🍫 HANCOM CARELINK · 11.11
        </div>
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="float text-7xl">🍫✨</div>
              <h1 className="mt-5 text-3xl font-black leading-tight text-[#6c3457] sm:text-4xl">
                빼빼로로 알아보는
                <br />
                <span className="text-pink-500">나의 업무성향은?</span>
              </h1>
              <p className="mt-4 text-sm leading-7 text-[#946b80]">
                한컴케어링크 동료들과 가볍게 즐기는
                <br />
                사내 이벤트용 업무성향 테스트예요.
              </p>
              <label
                htmlFor="username"
                className="mt-9 block text-left text-sm font-bold text-[#6c3457]"
              >
                먼저 이름 또는 별명을 알려주세요 🍫
              </label>
              <input
                id="username"
                maxLength={20}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) setStage("quiz");
                }}
                placeholder="이름 또는 별명"
                className="mt-2 w-full rounded-2xl border-2 border-pink-100 bg-pink-50 px-5 py-4 text-base outline-none focus:border-pink-400"
              />
              <button
                disabled={!name.trim()}
                onClick={() => setStage("quiz")}
                className="shimmer mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-black text-white shadow-lg shadow-pink-200 transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
              >
                내 업무성향 알아보기 <ArrowRight size={20} />
              </button>
              <p className="mt-4 text-xs leading-5 text-[#b58ca1]">
                이름과 결과는 참여 현황 집계를 위해 서버 메모리에 저장되며, 서버
                재시작 시 삭제됩니다.
              </p>
            </motion.section>
          )}
          {stage === "quiz" && (
            <motion.section
              key={`q${index}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between text-sm font-bold text-pink-500">
                <button
                  onClick={back}
                  className="flex items-center gap-1 text-[#a17a8e]"
                >
                  <ArrowLeft size={16} /> 이전
                </button>
                <span>
                  {index + 1} / {questions.length}
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-pink-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 transition-all duration-500"
                  style={{
                    width: `${((index + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <div className="my-7 text-6xl">{q.face}🍫</div>
              <h2 className="mb-8 text-2xl font-black leading-snug text-[#63374f]">
                Q{q.id}. {q.title}
              </h2>
              <div className="grid gap-4">
                {q.options.map((option, i) => (
                  <button
                    disabled={choosing}
                    key={option}
                    onClick={() => choose(i as Answer)}
                    className="answer-card rounded-2xl border-2 border-pink-100 bg-[#fff7fb] p-5 text-left text-base font-bold leading-relaxed disabled:opacity-70"
                  >
                    <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-pink-200 text-pink-700">
                      {i ? "B" : "A"}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </motion.section>
          )}
          {stage === "reveal" && (
            <motion.section
              key="reveal"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12"
            >
              <div className="box-glow mx-auto text-8xl">🎁</div>
              <h2 className="mt-8 text-3xl font-black text-pink-500">
                초콜릿 농도 분석 중... 🍫
              </h2>
              <p className="mt-3 text-[#9b7287]">업무 DNA 추출 중... ✨</p>
              <p className="mt-2 text-sm text-[#b07792]">
                당신에게 어울리는 빼빼로 찾는 중... 💕
              </p>
              <div className="mx-auto mt-8 h-3 w-56 overflow-hidden rounded-full bg-pink-100">
                <motion.div
                  className="h-full rounded-full bg-pink-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.4 }}
                />
              </div>
            </motion.section>
          )}
          {stage === "result" && result && (
            <motion.section
              key="result"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 160 }}
            >
              {Array.from({ length: 28 }, (_, i) => (
                <span
                  key={i}
                  className="confetti text-xl"
                  style={
                    {
                      "--left": `${(i * 37) % 100}%`,
                      "--delay": `${(i % 8) * 0.12}s`,
                      "--duration": `${2 + (i % 4) * 0.4}s`,
                      "--drift": `${(i % 2 ? 1 : -1) * (20 + (i % 20))}px`,
                    } as React.CSSProperties
                  }
                >
                  {["💖", "✨", "🎉", "🍫"][i % 4]}
                </span>
              ))}
              <div className="pop text-7xl">{result.emoji}🍫</div>
              <p className="mt-5 text-sm font-bold text-pink-500">
                11.11 나의 업무성향 결과
              </p>
              <h2 className="mt-3 text-2xl font-black leading-snug text-[#63374f]">
                {name}님의 업무성향은
                <br />
                <span className="text-pink-500">{result.nickname}</span>입니다!
              </h2>
              <div className="mt-5 rounded-[28px] border-2 border-pink-100 bg-gradient-to-b from-pink-50 to-amber-50 p-6">
                <div className="text-5xl">🍫 {result.emoji} 🍫</div>
                <h3 className="mt-4 text-xl font-black text-[#793b5b]">
                  {result.flavor} — {result.character}
                </h3>
                <span className="mt-2 inline-block rounded-full bg-white px-4 py-1 text-sm font-bold text-pink-500">
                  {result.code} 유형
                </span>
                <p className="mt-5 text-sm leading-7 text-[#76536a]">
                  {result.description}
                </p>
                <div className="mt-5 grid gap-3 text-left text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/85 p-4">
                    <strong>💪 업무 강점</strong>
                    <ul className="mt-2 list-inside list-disc leading-6">
                      {result.strengths.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-white/85 p-4">
                    <strong>🐣 귀여운 약점</strong>
                    <ul className="mt-2 list-inside list-disc leading-6">
                      {result.weaknesses.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 rounded-2xl bg-white/70 p-3 text-sm">
                  <strong>잘 맞는 동료:</strong> {result.match}
                </p>
              </div>
              <p className="mt-4 text-sm font-bold text-[#a4758e]">
                “{result.quote}”
              </p>
              <p className="mt-2 text-xs text-[#b68fa3]">
                {saved && stats !== null
                  ? `지금까지 ${stats}명이 참여했어요!`
                  : "가볍게 즐기는 사내 이벤트용 테스트예요."}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={restart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-pink-200 py-4 font-bold text-pink-600"
                >
                  <RotateCcw size={18} /> 다시 하기
                </button>
                <button
                  onClick={share}
                  className="shimmer flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white"
                >
                  <Share2 size={18} /> 결과 공유
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-[#bb90a5]">
          <Sparkles size={13} /> Made with 💖 for Hancom Carelink KIMJIHEE{" "}
          <Gift size={13} />
        </div>
      </div>
    </main>
  );
}
