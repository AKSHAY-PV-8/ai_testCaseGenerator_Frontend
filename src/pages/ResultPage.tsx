import { useState } from "react";
import type { TestResult, TestItem } from "../types";

interface Props {
  result: TestResult;
  testCases: string;
  onReset: () => void;
}

export default function ResultPage({ result, testCases, onReset }: Props) {
  const [activeTab, setActiveTab] = useState<"results" | "code">("results");
  const [expandedTest, setExpandedTest] = useState<number | null>(null);

  const passRate =
    result.summary.total > 0
      ? Math.round((result.summary.passed / result.summary.total) * 100)
      : 0;

  const getGrade = () => {
    if (passRate === 100) return { label: "PERFECT", color: "#00ff88" };
    if (passRate >= 80) return { label: "GOOD", color: "#88ff00" };
    if (passRate >= 60) return { label: "FAIR", color: "#ffaa00" };
    return { label: "NEEDS WORK", color: "#ff4444" };
  };

  const grade = getGrade();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 right-0 w-100 h-100 rounded-full bg-[#00ff88] opacity-[0.03] blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#00ff88] flex items-center justify-center">
            <span className="text-black text-xs font-bold">AI</span>
          </div>
          <span className="text-white font-bold tracking-widest text-sm uppercase">
            TestForge
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 text-sm hover:border-white/20 hover:text-white/80 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          New File
        </button>
      </header>

      <main className="relative z-10 flex-1 px-4 md:px-8 py-10 max-w-6xl mx-auto w-full">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {/* Grade card */}
          <div
            className="col-span-2 md:col-span-1 rounded-2xl border p-6 flex flex-col justify-between"
            style={{
              borderColor: `${grade.color}30`,
              background: `${grade.color}08`,
            }}
          >
            <span className="text-white/40 text-xs uppercase tracking-widest">Grade</span>
            <div>
              <div
                className="text-4xl font-black mt-3 mb-1"
                style={{ color: grade.color, textShadow: `0 0 30px ${grade.color}60` }}
              >
                {passRate}%
              </div>
              <div className="text-xs tracking-widest" style={{ color: grade.color }}>
                {grade.label}
              </div>
            </div>
          </div>

          {/* Stat cards */}
          {[
            { label: "Total Tests", value: result.summary.total, color: "#ffffff" },
            { label: "Passed", value: result.summary.passed, color: "#00ff88" },
            { label: "Failed", value: result.summary.failed, color: result.summary.failed > 0 ? "#ff4444" : "#ffffff" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.07] bg-white/2 p-6 flex flex-col justify-between"
            >
              <span className="text-white/40 text-xs uppercase tracking-widest">
                {stat.label}
              </span>
              <div
                className="text-4xl font-black mt-3"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex justify-between text-xs text-white/30 mb-2">
            <span>Test pass rate</span>
            <span>{result.summary.passed}/{result.summary.total} passing</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${passRate}%`,
                background: `linear-gradient(90deg, ${grade.color}, ${grade.color}aa)`,
                boxShadow: `0 0 10px ${grade.color}60`,
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/3 p-1 rounded-xl border border-white/[0.07] w-fit">
          {(["results", "code"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all capitalize ${
                activeTab === tab
                  ? "bg-[#00ff88] text-black"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab === "results" ? "Test Results" : "Generated Code"}
            </button>
          ))}
        </div>

        {/* Results Tab */}
        {activeTab === "results" && (
          <div className="space-y-3">
            {result.tests.map((test: TestItem, i: number) => (
              <TestCard
                key={i}
                test={test}
                index={i}
                expanded={expandedTest === i}
                onToggle={() =>
                  setExpandedTest(expandedTest === i ? null : i)
                }
              />
            ))}
          </div>
        )}

        {/* Code Tab */}
        {activeTab === "code" && (
          <div className="rounded-2xl border border-white/10 bg-black/60 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-white/30 text-xs ml-3 font-mono">
                  code.test.js
                </span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(testCases)}
                className="text-xs text-white/30 hover:text-[#00ff88] transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
            <pre className="p-6 text-sm font-mono text-white/70 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              <CodeHighlight code={testCases} />
            </pre>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-white/5 px-8 py-4 text-center text-white/20 text-xs">
        TestForge · Built with Node.js, Express, Groq AI, Docker & React
      </footer>
    </div>
  );
}

function TestCard({
  test,
  index,
  expanded,
  onToggle,
}: {
  test: TestItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const passed = test.status === "passed";

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        passed
          ? "border-[#00ff88]/20 bg-[#00ff88]/3"
          : "border-red-500/20 bg-red-500/3"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        {/* Status icon */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
            passed ? "bg-[#00ff88]/20" : "bg-red-500/20"
          }`}
        >
          {passed ? (
            <svg className="w-3.5 h-3.5 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Index */}
        <span className="text-white/20 text-xs font-mono w-6 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Title */}
        <span className="flex-1 text-sm text-white/80 font-mono">{test.title}</span>

        {/* Badge */}
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium tracking-wide shrink-0 ${
            passed
              ? "bg-[#00ff88]/15 text-[#00ff88]"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {passed ? "PASS" : "FAIL"}
        </span>

        {/* Expand arrow (only for failures) */}
        {!passed && test.error && (
          <svg
            className={`w-4 h-4 text-white/30 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Error detail */}
      {!passed && test.error && expanded && (
        <div className="px-5 pb-4 pt-0">
          <div className="rounded-lg bg-black/50 border border-red-500/10 p-4 font-mono text-xs text-red-300/70 whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {test.error
              .split("\n")
              .slice(0, 15)
              .join("\n")}
          </div>
        </div>
      )}
    </div>
  );
}

function CodeHighlight({ code }: { code: string }) {
  // Simple syntax highlighting
  const highlighted = code
    .replace(/(describe|test|expect|it)\b/g, '<span style="color:#00ff88">$1</span>')
    .replace(/(const|let|var|function|return|import|require|module\.exports)\b/g, '<span style="color:#88aaff">$1</span>')
    .replace(/('.*?'|".*?"|`.*?`)/g, '<span style="color:#ffcc88">$1</span>')
    .replace(/(\/\/.*)/g, '<span style="color:#ffffff30">$1</span>')
    .replace(/(\.(toEqual|toThrow|toBe|toMatchSnapshot|toBeGreaterThan|toHaveLength))\b/g, '<span style="color:#ff88cc">$1</span>');

  return (
    <code
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}