import { useNavigate } from "react-router-dom";

function StartMenuPage() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Layered Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.18),transparent)]" />

        {/* Ambient orbs - scale better on mobile */}
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-[90px] sm:-left-32 sm:h-[420px] sm:w-[420px] sm:blur-[100px]" />
        <div className="absolute -right-24 bottom-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px] sm:-right-32 sm:h-[380px] sm:w-[380px] sm:blur-[100px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="mb-10 text-center sm:mb-12">
            <div className="relative mx-auto mb-5 inline-flex h-20 w-20 items-center justify-center sm:mb-6 sm:h-24 sm:w-24">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl" />
              <span className="relative text-6xl drop-shadow-[0_0_25px_rgba(52,211,153,0.4)] sm:text-7xl">
                🦖
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl">
              THE DINO
            </h1>
            <h2 className="mt-1 bg-gradient-to-r from-emerald-300 via-green-400 to-cyan-400 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-5xl md:text-6xl">
              KING
            </h2>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 sm:mt-5 sm:text-[11px] sm:tracking-[0.35em]">
              Infinite Runner · Multiplayer
            </p>
          </div>

          {/* Menu Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-3xl sm:p-6">
            {/* Top highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="space-y-3">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={() => {
                  const savedCharacter =
                    sessionStorage.getItem("dinoKingCharacter");

                  if (!savedCharacter) {
                    navigate("/character-selection");
                    return;
                  }

                  try {
                    const character = JSON.parse(savedCharacter);

                    if (
                      !character?.playerName?.trim() ||
                      !character?.playerId?.trim() ||
                      !character?.dinoColor
                    ) {
                      sessionStorage.removeItem("dinoKingCharacter");
                      navigate("/character-selection");
                      return;
                    }

                    navigate("/game-menu");
                  } catch (error) {
                    sessionStorage.removeItem("dinoKingCharacter");
                    navigate("/character-selection");
                  }
                }}
                className="group relative w-full overflow-hidden rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-extrabold tracking-wide text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:bg-emerald-300 hover:shadow-emerald-400/40 active:scale-[0.98] sm:rounded-2xl sm:px-6 sm:py-4 sm:text-base"
              >
                <span className="relative z-10">PLAY</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>

              {/* Secondary buttons */}
              <button
                type="button"
                onClick={() => navigate("/character-selection")}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-bold text-slate-100 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.98] sm:rounded-2xl sm:px-6 sm:py-4"
              >
                🦖 CHARACTER
              </button>

              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-bold text-slate-100 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.98] sm:rounded-2xl sm:px-6 sm:py-4"
              >
                ⚙ SETTINGS
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center sm:mt-8">
            <p className="text-xs font-medium tracking-wide text-slate-500">
              THE DINO KING
            </p>
            <p className="mt-1 text-[11px] text-slate-600">
              Multiplayer Infinite Runner
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default StartMenuPage;
