import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, signout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="rounded-2xl border border-surface-800 bg-surface-900 p-10 shadow-xl shadow-black/20">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600/20">
            <span className="text-2xl">👋</span>
          </div>

          <h1 className="text-2xl font-bold text-white">
            Welcome{user?.email ? `, ${user.email}` : ""}!
          </h1>
          <p className="mt-2 text-surface-400">
            Your dashboard is coming soon. Stay tuned!
          </p>

          <button
            onClick={signout}
            className="mt-8 cursor-pointer rounded-lg border border-surface-700 bg-surface-800 px-6 py-2.5 text-sm font-medium text-surface-300 transition-colors hover:border-surface-600 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
