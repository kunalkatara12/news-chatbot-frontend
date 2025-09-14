import { Route, Routes } from "react-router";
import WelcomePage from "./pages/WelcomePage";
import ChatPage from "./pages/ChatPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="*" element={<div>No Page Found</div>} />
      </Routes>
    </QueryClientProvider>
  );
}
