import { Link, Outlet } from "react-router-dom";

export function LearnReactLayout() {
  return (
    <div>
      <nav className="bg-gray-100 p-2">
        <ul className="space-x-4 overflow-x-hidden overflow-x-scroll whitespace-nowrap">
          <Link to={"/"} className="text-slate-800 hover:text-slate-700">Home</Link>
          <Link to={"/use-id"} className="text-slate-800 hover:text-slate-700">use-id</Link>
          <Link to={"/use-ref"} className="text-slate-800 hover:text-slate-700">use-ref</Link>
          <Link to={"/use-action-state"} className="text-slate-800 hover:text-slate-700">use-actions-state</Link>
          <Link to={"/use-form-status"} className="text-slate-800 hover:text-slate-700">use-form-status</Link>
          <Link to={"/use-callback"} className="text-slate-800 hover:text-slate-700">use-callback</Link>
          <Link to={"/use-context"} className="text-slate-800 hover:text-slate-700">use-context</Link>
    
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
