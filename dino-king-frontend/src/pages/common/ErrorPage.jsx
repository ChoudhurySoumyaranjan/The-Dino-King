import { Link, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  console.error(error);

  const status = error?.status || 500;

  const title = status === 404 ? "Page Not Found" : "Something Went Wrong";

  const message =
    error?.statusText || error?.message || "An unexpected error occurred.";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-slate-100 sm:px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]" />
        <div className="absolute left-1/2 top-[-160px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-3xl sm:h-[420px] sm:w-[420px]" />
        <div className="absolute bottom-[-140px] right-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/[0.05] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-8">
          {/* Top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Status Code */}
          <p className="text-6xl font-black tracking-tighter text-emerald-400 sm:text-7xl">
            {status}
          </p>

          {/* Title */}
          <h1 className="mt-3 text-2xl font-black tracking-tight sm:mt-4 sm:text-3xl">
            {title}
          </h1>

          {/* Message */}
          <p className="mt-2.5 text-sm leading-6 text-slate-400 sm:mt-3">
            {message}
          </p>

          {/* Dev Error Details */}
          {import.meta.env.DEV && (
            <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-3.5 text-left sm:mt-6 sm:p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Development Error
              </p>
              <pre className="overflow-auto whitespace-pre-wrap break-words text-xs text-red-300">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}

          {/* Back Button */}
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-black tracking-wide text-slate-950 shadow-lg shadow-emerald-500/15 transition hover:bg-emerald-300 hover:shadow-emerald-400/25 active:scale-[0.98] sm:mt-8"
          >
            Back To Main Menu
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center sm:mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-700">
            The Dino King
          </p>
        </div>
      </div>
    </main>
  );
}

export default ErrorPage;
