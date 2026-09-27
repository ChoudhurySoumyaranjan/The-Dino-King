import { useNavigate } from "react-router-dom";

function GameMenuPage() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-12">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]" />
        <div className="absolute left-1/2 top-[-160px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-3xl sm:h-[420px] sm:w-[420px]" />
        <div className="absolute bottom-[-140px] right-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/[0.06] blur-3xl sm:h-[360px] sm:w-[360px]" />
        <div className="absolute left-[-120px] top-1/2 h-[260px] w-[260px] rounded-full bg-emerald-500/[0.04] blur-3xl sm:h-[320px] sm:w-[320px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center sm:mb-9">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-4xl shadow-xl shadow-emerald-500/10 sm:mb-5 sm:h-20 sm:w-20 sm:rounded-3xl sm:text-5xl">
              🦖
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400">
              The Dino King
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              GAME MENU
            </h1>

            <p className="mx-auto mt-2.5 max-w-sm text-sm leading-6 text-slate-400 sm:mt-3">
              Create a multiplayer room or join an existing game using a room
              code.
            </p>
          </div>

          {/* Menu Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-6">
            {/* Top highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="space-y-3">
              {/* Create Room */}
              <button
                type="button"
                onClick={() => navigate("/create-room")}
                className="group flex w-full items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] p-3.5 text-left transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.12] active:scale-[0.98] sm:gap-4 sm:rounded-2xl sm:p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-lg text-slate-950 shadow-lg shadow-emerald-500/10 sm:h-12 sm:w-12 sm:text-xl">
                  +
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-white sm:text-base">
                    CREATE A ROOM
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 sm:mt-1">
                    Start a new multiplayer game
                  </p>
                </div>

                <span className="text-lg text-emerald-400 transition group-hover:translate-x-0.5 sm:text-xl">
                  →
                </span>
              </button>

              {/* Join Room */}
              <button
                type="button"
                onClick={() => navigate("/join-room")}
                className="group flex w-full items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-3.5 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.1] active:scale-[0.98] sm:gap-4 sm:rounded-2xl sm:p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-lg text-slate-950 shadow-lg shadow-cyan-500/10 sm:h-12 sm:w-12 sm:text-xl">
                  ↗
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-white sm:text-base">
                    JOIN WITH CODE
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 sm:mt-1">
                    Enter a room code to join
                  </p>
                </div>

                <span className="text-lg text-cyan-400 transition group-hover:translate-x-0.5 sm:text-xl">
                  →
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3 sm:my-5">
              <div className="h-px flex-1 bg-white/[0.07]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                or
              </span>
              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            {/* Back */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-slate-400 transition hover:bg-white/[0.07] hover:text-white active:scale-[0.98] sm:py-3.5"
            >
              <span className="transition group-hover:-translate-x-0.5">←</span>
              BACK TO MAIN MENU
            </button>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-700 sm:mt-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Multiplayer Mode
          </div>
        </div>
      </div>
    </main>
  );
}

export default GameMenuPage;
