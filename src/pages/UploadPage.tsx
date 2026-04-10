import { useState, useRef, useCallback } from "react";

import type { TestResult } from "../types";
import { uploadFile } from "../services/api";


interface Props {
  onResult: (result: TestResult, testCases: string) => void;
}

const STEPS = [
  "Parsing AST...",
  "Extracting functions...",
  "Generating test cases with AI...",
  "Spinning up Docker sandbox...",
  "Running Jest...",
  "Parsing results...",
];

export default function UploadPage({ onResult }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLogs((l) => [...l, msg]);

  const handleFile = (f: File) => {
    if (!f.name.endsWith(".js") && !f.name.endsWith(".ts")) {
      setError("Only .js or .ts files are supported.");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setLogs([]);
    setError(null);
    setStepIndex(0);

    // Simulate step logging
    const stepDelay = (ms: number) =>
      new Promise((res) => setTimeout(res, ms));

    try {
      // Kick off real request
      const requestPromise = uploadFile(file);

      // Animate steps while waiting
      for (let i = 0; i < STEPS.length; i++) {
        setStepIndex(i);
        addLog(`[${new Date().toLocaleTimeString()}] ${STEPS[i]}`);
        await stepDelay(i === 3 ? 2500 : 900);
      }

      const data = await requestPromise;
      addLog(`[${new Date().toLocaleTimeString()}] ✓ Done! ${data.result.summary.total} tests generated.`);
      await stepDelay(600);
      onResult(data.result, data.testCases);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setError(errorMessage);
      addLog(`[${new Date().toLocaleTimeString()}] ✗ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-[#00ff88] opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-[#0088ff] opacity-[0.05] blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#00ff88] flex items-center justify-center">
            <span className="text-black text-xs font-bold">AI</span>
          </div>
          <span className="text-white font-bold tracking-widest text-sm uppercase">
            TestForge
          </span>
          <span className="text-white/20 text-xs ml-2">v1.0.0</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          System online
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 border border-[#00ff88]/20 bg-[#00ff88]/5 rounded-full px-4 py-1.5 text-[#00ff88] text-xs tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            Powered by LLaMA 3.3 + Jest
          </div>

          <h1
            className="text-6xl md:text-7xl font-black mb-6 leading-none tracking-tight"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            <span className="text-white">Auto</span>
            <span
              className="text-[#00ff88]"
              style={{ textShadow: "0 0 40px rgba(0,255,136,0.4)" }}
            >
              Test
            </span>
            <br />
            <span className="text-white/40 text-4xl md:text-5xl font-normal">
              your code. instantly.
            </span>
          </h1>

          <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto">
            Upload any JavaScript or TypeScript file. Our AI extracts your
            functions, generates comprehensive Jest tests, and runs them in an
            isolated Docker sandbox — in seconds.
          </p>
        </div>

        {/* Upload Card */}
        <div className="w-full max-w-2xl">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !loading && inputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
              ${dragging
                ? "border-[#00ff88] bg-[#00ff88]/10 scale-[1.02]"
                : file
                ? "border-[#00ff88]/50 bg-[#00ff88]/5"
                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }
              ${loading ? "pointer-events-none" : ""}
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".js,.ts"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {!file ? (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-white/60 text-lg mb-2">
                  Drop your file here
                </p>
                <p className="text-white/25 text-sm">
                  .js or .ts files only · max 5MB
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#00ff88] font-bold">{file.name}</p>
                  <p className="text-white/30 text-sm mt-1">
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Terminal log */}
          {loading && logs.length > 0 && (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-white/20 ml-2">testforge — bash</span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={`${i === logs.length - 1 ? "text-[#00ff88]" : "text-white/40"}`}
                  >
                    {log}
                  </div>
                ))}
                {loading && (
                  <div className="text-[#00ff88] flex items-center gap-1">
                    <span className="inline-block w-2 h-4 bg-[#00ff88] animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className={`
              mt-6 w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 relative overflow-hidden
              ${file && !loading
                ? "bg-[#00ff88] text-black hover:bg-[#00ff88]/90 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/5 text-white/20 cursor-not-allowed border border-white/10"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {STEPS[stepIndex]}
              </span>
            ) : (
              "Generate Tests →"
            )}
          </button>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {[
            "AST Parsing",
            "LLaMA 3.3 70B",
            "Docker Sandbox",
            "Jest Runner",
            "Edge Cases",
            "Auto Import",
          ].map((f) => (
            <span
              key={f}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-white/40 text-xs tracking-wide"
            >
              {f}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-4 text-center text-white/20 text-xs">
        TestForge · Built with Node.js, Express, Groq AI, Docker & React
      </footer>
    </div>
  );
}