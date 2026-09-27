import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100">
      <Outlet />
    </div>
  );
}

export default PublicLayout;
