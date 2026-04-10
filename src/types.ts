export interface TestItem {
  title: string;
  status: "passed" | "failed";
  error: string | null;
}
 
export interface TestResult {
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
  tests: TestItem[];
}
 
export interface ApiResponse {
  message: string;
  testCases: string;
  result: TestResult;
  debug?: string;
}
 