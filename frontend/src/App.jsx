import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllJobs from "./pages/AllJobs";
import PostJob from "./pages/PostJob";
import ViewedJobs from "./pages/ViewedJobs";
import Notifications from "./pages/Notifications";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllJobs />} />
        <Route path="/post" element={<PostJob />} />
        <Route path="/viewed" element={<ViewedJobs />} />
        <Route path="/notify" element={<Notifications />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}
