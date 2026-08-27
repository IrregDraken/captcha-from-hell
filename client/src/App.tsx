// Blackbox Operator style: the app keeps one focused route so the user never escapes the verification console before the joke lands.

import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";

export default function App() {
  return <ErrorBoundary><Home /></ErrorBoundary>;
}
