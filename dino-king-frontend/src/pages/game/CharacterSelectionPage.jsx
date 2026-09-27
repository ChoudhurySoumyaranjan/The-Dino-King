import { useState } from "react";
import { useNavigate } from "react-router-dom";

const characters = [
  {
    color: "GREEN",
    label: "GREEN DINO",
    hex: "#4ade80",
  },
  {
    color: "BLUE",
    label: "BLUE DINO",
    hex: "#38bdf8",
  },
  {
    color: "RED",
    label: "RED DINO",
    hex: "#ef4444",
  },
  {
    color: "YELLOW",
    label: "YELLOW DINO",
    hex: "#facc15",
  },
];

function CharacterSelectionPage() {
  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] = useState("GREEN");
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [error, setError] = useState("");

  const selectedCharacter = characters.find(
    (character) => character.color === selectedColor,
  );

  const handleContinue = () => {
    if (!playerName.trim()) {
      setError("Please enter your Player Name.");
      return;
    }

    if (!playerId.trim()) {
      setError("Please enter your Player ID.");
      return;
    }

    setError("");

    sessionStorage.setItem(
      "dinoKingCharacter",
      JSON.stringify({
        playerName: playerName.trim(),
        playerId: playerId.trim(),
        dinoColor: selectedColor,
      }),
    );

    navigate("/game-menu");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]" />
        <div className="absolute left-1/2 top-[-160px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-3xl sm:h-[420px] sm:w-[420px]" />
        <div className="absolute bottom-[-160px] right-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-500/[0.05] blur-3xl sm:h-[380px] sm:w-[380px]" />
        <div className="absolute left-[-120px] top-1/2 h-[260px] w-[260px] rounded-full bg-emerald-500/[0.04] blur-3xl sm:h-[300px] sm:w-[300px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ✅ Proper centered container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-3xl">
          {/* Top Nav */}
          <div className="mb-6 flex items-center justify-between sm:mb-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:px-4 sm:py-2.5"
            >
              <span className="transition group-hover:-translate-x-0.5">←</span>
              Back
            </button>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">
                Player Setup
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="mb-3 flex items-center justify-center gap-2.5 sm:mb-4 sm:gap-3">
              <span className="text-2xl sm:text-3xl">🦖</span>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400 sm:text-xs">
                The Dino King
              </p>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              CHARACTER
            </h1>

            <p className="mx-auto mt-2.5 max-w-md text-sm leading-6 text-slate-400 sm:mt-3">
              Choose your Dino and set your player details before entering
              multiplayer mode.
            </p>
          </div>

          {/* Main Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-6">
            {/* Top highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Dino Preview */}
            <div className="relative mb-5 overflow-hidden rounded-xl border border-white/10 bg-black/20 sm:mb-7 sm:rounded-2xl">
              <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
                <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:px-3 sm:py-1.5">
                  Selected Dino
                </span>
              </div>

              <div className="flex h-52 flex-col items-center justify-center sm:h-64">
                <div
                  className="relative flex h-24 w-24 items-center justify-center rounded-2xl shadow-2xl transition-all duration-300 sm:h-32 sm:w-32 sm:rounded-[2rem]"
                  style={{
                    backgroundColor: selectedCharacter?.hex,
                    boxShadow: `0 20px 60px ${selectedCharacter?.hex}30`,
                  }}
                >
                  <span className="text-5xl drop-shadow-lg sm:text-6xl">
                    🦖
                  </span>
                </div>

                <p className="mt-4 text-base font-black tracking-wide sm:mt-5 sm:text-lg">
                  {selectedCharacter?.label}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Color: {selectedColor}
                </p>
              </div>

              {/* Decorative ground */}
              <div
                className="absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full opacity-60 sm:w-32"
                style={{
                  backgroundColor: selectedCharacter?.hex,
                }}
              />
            </div>

            {/* Character Options */}
            <div className="mb-5 sm:mb-7">
              <div className="mb-2.5 flex items-center justify-between sm:mb-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                    Select Character
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600 sm:mt-1">
                    Choose your Dino color
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {selectedColor}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {characters.map((character) => {
                  const selected = selectedColor === character.color;

                  return (
                    <button
                      key={character.color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(character.color);
                        setError("");
                      }}
                      className={`group relative flex h-16 flex-col items-center justify-center rounded-xl border transition active:scale-[0.97] sm:h-20 sm:rounded-2xl ${
                        selected
                          ? "border-emerald-400/50 bg-emerald-400/[0.08]"
                          : "border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span
                        className="h-7 w-7 rounded-lg shadow-lg transition group-hover:scale-105 sm:h-9 sm:w-9 sm:rounded-xl"
                        style={{
                          backgroundColor: character.hex,
                        }}
                      />

                      <span
                        className={`mt-1.5 text-[8px] font-bold uppercase tracking-wider sm:mt-2 sm:text-[9px] ${
                          selected ? "text-white" : "text-slate-600"
                        }`}
                      >
                        {character.color}
                      </span>

                      {selected && (
                        <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 text-[8px] font-black text-slate-950 sm:right-2 sm:top-2 sm:h-4 sm:w-4 sm:text-[9px]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="mb-5 h-px bg-white/[0.07] sm:mb-7" />

            {/* Player Details */}
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label
                  htmlFor="playerName"
                  className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:mb-2"
                >
                  Player Name
                </label>

                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(event) => {
                    setPlayerName(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your player name"
                  maxLength={30}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-white/[0.04] sm:py-3.5"
                />

                <p className="mt-1.5 text-[10px] text-slate-600 sm:mt-2">
                  Maximum 30 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="playerId"
                  className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:mb-2"
                >
                  Player ID
                </label>

                <input
                  id="playerId"
                  type="text"
                  value={playerId}
                  onChange={(event) => {
                    setPlayerId(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your unique Player ID"
                  maxLength={50}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-white/[0.04] sm:py-3.5"
                />

                <p className="mt-1.5 text-[10px] text-slate-600 sm:mt-2">
                  This ID is used to identify you in multiplayer games
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3.5 py-3 sm:px-4">
                  <span className="text-sm">⚠️</span>
                  <p className="text-sm font-medium text-red-300">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2.5 pt-1 sm:gap-3 sm:pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-black text-slate-400 transition hover:bg-white/[0.07] hover:text-white active:scale-[0.98] sm:px-5 sm:py-3.5"
                >
                  <span className="transition group-hover:-translate-x-0.5">
                    ←
                  </span>
                  BACK
                </button>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!playerName.trim() || !playerId.trim()}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-300 hover:shadow-emerald-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:py-3.5"
                >
                  CONTINUE
                  <span className="transition group-hover:translate-x-0.5">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 text-center sm:mt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-700">
              Choose your Dino · Enter the arena
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CharacterSelectionPage;
