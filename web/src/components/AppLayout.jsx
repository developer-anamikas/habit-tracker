import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      <TopNav />
      <main className="ml-[220px] pt-14">
        <div className="max-w-[1140px] mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
