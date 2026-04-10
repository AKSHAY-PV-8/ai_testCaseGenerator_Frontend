import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import ResultPage from "./pages/ResultPage";
import type { TestResult } from "./types";

export default function App() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [testCases, setTestCases] = useState<string>("");

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono overflow-x-hidden">
      {!result ? (
        <UploadPage
          onResult={(r, t) => {
            setResult(r);
            setTestCases(t);
          }}
        />
      ) : (
        <ResultPage
          result={result}
          testCases={testCases}
          onReset={() => setResult(null)}
        />
      )}
    </div>
  );
}