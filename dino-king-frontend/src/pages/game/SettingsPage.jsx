import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const navigate = useNavigate();

  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);

  const handleResetCharacter = () => {
    sessionStorage.removeItem("dinoKingCharacter");
    sessionStorage.removeItem("dinoKingSession");
    sessionStorage.removeItem("dinoKingRoom");

    navigate("/character-selection");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]" />
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-[90px] sm:-left-32 sm:h-[380px] sm:w-[380px] sm:blur-[100px]" />
        <div className="absolute -right-24 bottom-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px] sm:-right-32 sm:h-[340px] sm:w-[340px] sm:blur-[100px]" />
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
          {/* Header */}
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-400 sm:mb-3">
              The Dino King
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              SETTINGS
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:mt-3">
              Customize your game experience
            </p>
          </div>

          {/* Settings Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-3xl sm:p-5">
            {/* Top highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="space-y-3">
              {/* Sound Effects */}
              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition-colors hover:bg-white/[0.06] sm:rounded-2xl sm:p-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-100">
                    Sound Effects
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 sm:mt-1">
                    Enable game sound effects
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSound((value) => !value)}
                  className={`shrink-0 min-w-[60px] rounded-full px-3.5 py-2 text-xs font-black tracking-wide transition-all duration-200 active:scale-95 sm:min-w-[64px] sm:px-4 ${
                    sound
                      ? "bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30"
                      : "bg-slate-700/80 text-slate-300"
                  }`}
                >
                  {sound ? "ON" : "OFF"}
                </button>
              </div>

              {/* Background Music */}
              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition-colors hover:bg-white/[0.06] sm:rounded-2xl sm:p-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-100">
                    Background Music
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 sm:mt-1">
                    Enable background music
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMusic((value) => !value)}
                  className={`shrink-0 min-w-[60px] rounded-full px-3.5 py-2 text-xs font-black tracking-wide transition-all duration-200 active:scale-95 sm:min-w-[64px] sm:px-4 ${
                    music
                      ? "bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30"
                      : "bg-slate-700/80 text-slate-300"
                  }`}
                >
                  {music ? "ON" : "OFF"}
                </button>
              </div>

              {/* Reset Character */}
              <button
                type="button"
                onClick={handleResetCharacter}
                className="w-full rounded-xl border border-red-500/25 bg-red-500/10 p-3.5 text-left transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/15 active:scale-[0.98] sm:rounded-2xl sm:p-4"
              >
                <p className="text-sm font-bold text-red-400">
                  Reset Character
                </p>
                <p className="mt-0.5 text-xs text-slate-500 sm:mt-1">
                  Clear your saved player details and choose again
                </p>
              </button>
            </div>
          </div>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-bold tracking-wide text-slate-100 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.98] sm:mt-6 sm:rounded-2xl sm:px-6 sm:py-4"
          >
            BACK TO MENU
          </button>
        </div>
      </div>
    </main>
  );
}

export default SettingsPage;
