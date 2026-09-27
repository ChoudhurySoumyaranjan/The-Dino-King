import { useCallback, useEffect, useState } from "react";
import PhaserGame from "../../game/PhaserGame";
import { getRoomDetails } from "../../api/service/roomService";

const getDinoColor = (color) => {
  const colors = {
    GREEN: "#4ade80",
    BLUE: "#38bdf8",
    RED: "#ef4444",
    YELLOW: "#facc15",
  };

  return colors[color] || colors.GREEN;
};

function GamePage() {
  const [session, setSession] = useState(null);
  const [room, setRoom] = useState(null);

  /* =========================================
     LOAD PLAYER SESSION
  ========================================= */

  useEffect(() => {
    const storedSession = sessionStorage.getItem("dinoKingSession");

    if (!storedSession) {
      return;
    }

    try {
      const parsedSession = JSON.parse(storedSession);
      setSession(parsedSession);
      console.log("Game session:", parsedSession);
    } catch (error) {
      console.error("Failed to read game session:", error);
    }
  }, []);

  /* =========================================
     LOAD ROOM DETAILS
  ========================================= */

  useEffect(() => {
    const storedSession =
      sessionStorage.getItem("dinoKingSession") ||
      sessionStorage.getItem("dinoKingRoom");

    if (!storedSession) {
      return;
    }

    try {
      const parsedSession = JSON.parse(storedSession);

      setSession(parsedSession);

      console.log("Game session:", parsedSession);
    } catch (error) {
      console.error("Failed to read game session:", error);
    }
  }, []);
  /* =========================================
     REFRESH ROOM AFTER PLAYER DEATH
  ========================================= */

  const handlePlayerDied = useCallback(() => {
    if (!session) {
      return;
    }

    getRoomDetails(session.roomCode)
      .then((data) => {
        setRoom(data);
      })
      .catch((error) => {
        console.error("Failed to refresh room after player death:", error);
      });
  }, [session]);

  /* =========================================
     LOADING
  ========================================= */

  if (!session) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]" />
        </div>

        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-3xl shadow-lg shadow-emerald-500/10 sm:h-20 sm:w-20 sm:text-4xl">
            🦖
          </div>
          <p className="mt-4 text-sm text-slate-400">Loading game...</p>
        </div>
      </main>
    );
  }

  /* =========================================
     PLAYER DATA
  ========================================= */

  const players = room?.players || [];

  const totalPlayers = players.length;

  const deadPlayers = players
    .filter((player) => player.status === "DEAD")
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const playingPlayers = players.filter(
    (player) => player.status === "PLAYING",
  );

  const deadCount = deadPlayers.length;
  const playingCount = playingPlayers.length;

  const currentPlayer = players.find(
    (player) => Number(player.id) === Number(session.playerId),
  );

  /* =========================================
     RENDER
  ========================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.10),transparent)]" />
        <div className="absolute left-1/2 top-[-180px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-3xl sm:h-[500px] sm:w-[500px]" />
        <div className="absolute bottom-[-150px] right-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-500/[0.04] blur-3xl sm:h-[400px] sm:w-[400px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ✅ Stronger centering */}
      <div className="relative z-10 flex justify-center px-4 py-5 sm:px-6 sm:py-8">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <header className="mb-5 text-center sm:mb-6">
            <div className="mb-2 flex items-center justify-center gap-2.5 sm:mb-3 sm:gap-3">
              <span className="text-2xl sm:text-3xl">🦖</span>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 sm:text-xs">
                Multiplayer Arena
              </p>
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
              THE DINO KING
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 sm:mt-3">
              <span>Player</span>
              <span className="rounded-md bg-emerald-400/10 px-2 py-1 font-bold text-emerald-400">
                {session.playerName}
              </span>

              {room?.roomCode && (
                <>
                  <span className="text-slate-700">•</span>
                  <span>
                    Room{" "}
                    <span className="font-bold text-slate-400">
                      {room.roomCode}
                    </span>
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Game Area */}
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.025] px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Live Game
                </span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                SPACE / TAP TO JUMP
              </div>
            </div>

            <div className="bg-black">
              <PhaserGame session={session} onPlayerDied={handlePlayerDied} />
            </div>
          </section>

          {/* Player Summary Stats */}
          <section className="mt-4 sm:mt-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Total */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:rounded-2xl sm:p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 sm:text-[10px]">
                  Total
                </p>
                <p className="mt-1.5 text-xl font-black text-white sm:mt-2 sm:text-3xl">
                  {totalPlayers}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-600 sm:mt-1 sm:text-[10px]">
                  Players
                </p>
              </div>

              {/* Playing */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-3.5 sm:rounded-2xl sm:p-5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 sm:text-[10px]">
                    Playing
                  </p>
                </div>
                <p className="mt-1.5 text-xl font-black text-emerald-400 sm:mt-2 sm:text-3xl">
                  {playingCount}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-600 sm:mt-1 sm:text-[10px]">
                  Active
                </p>
              </div>

              {/* Dead */}
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] p-3.5 sm:rounded-2xl sm:p-5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 sm:text-[10px]">
                    Dead
                  </p>
                </div>
                <p className="mt-1.5 text-xl font-black text-red-400 sm:mt-2 sm:text-3xl">
                  {deadCount}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-600 sm:mt-1 sm:text-[10px]">
                  Eliminated
                </p>
              </div>
            </div>
          </section>

          {/* Current Player Status */}
          {currentPlayer && (
            <section className="mt-4 sm:mt-5">
              <div className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-3.5 sm:gap-4 sm:rounded-2xl sm:p-4">
                <div
                  className="h-9 w-9 shrink-0 rounded-xl shadow-lg sm:h-10 sm:w-10"
                  style={{
                    backgroundColor: getDinoColor(currentPlayer.dinoColor),
                  }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-black">
                      {currentPlayer.playerName}
                    </p>
                    <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-cyan-400">
                      YOU
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-600">
                    Your current game status
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-emerald-400 sm:text-xl">
                    {currentPlayer.score ?? 0}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                    Score
                  </p>
                </div>

                <div
                  className={
                    currentPlayer.status === "DEAD"
                      ? "rounded-lg bg-red-500/10 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-red-400"
                      : "rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-400"
                  }
                >
                  {currentPlayer.status === "DEAD" ? "DEAD" : "PLAYING"}
                </div>
              </div>
            </section>
          )}

          {/* Player Status List */}
          <section className="mt-4 sm:mt-5">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 shadow-xl sm:rounded-2xl sm:p-5">
              <div className="mb-4 flex items-center justify-between sm:mb-5">
                <div>
                  <h2 className="text-base font-black sm:text-lg md:text-xl">
                    PLAYER STATUS
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-600 sm:mt-1">
                    Current status of all players
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.07] bg-black/20 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:px-3 sm:py-2">
                  {totalPlayers} Players
                </div>
              </div>

              {players.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
                  <p className="text-sm text-slate-500">No players found.</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-2.5">
                  {players.map((player) => {
                    const isDead = player.status === "DEAD";
                    const isCurrentPlayer =
                      Number(player.id) === Number(session.playerId);

                    return (
                      <div
                        key={player.id}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition sm:gap-3 sm:px-4 sm:py-3 ${
                          isCurrentPlayer
                            ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                            : "border-white/[0.07] bg-black/20"
                        }`}
                      >
                        <div
                          className="h-3.5 w-3.5 shrink-0 rounded-full shadow-md sm:h-4 sm:w-4"
                          style={{
                            backgroundColor: getDinoColor(player.dinoColor),
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <p className="truncate text-sm font-bold text-white">
                              {player.playerName}
                            </p>
                            {isCurrentPlayer && (
                              <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-cyan-400 sm:px-2">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="truncate text-[10px] text-slate-600">
                            {player.playerCode}
                          </p>
                        </div>

                        <div className="hidden text-right sm:block">
                          <p className="text-sm font-black text-emerald-400">
                            {player.score ?? 0}
                          </p>
                          <p className="text-[8px] font-bold uppercase tracking-wider text-slate-700">
                            Score
                          </p>
                        </div>

                        <div
                          className={
                            isDead
                              ? "rounded-lg bg-red-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-red-400 sm:px-2.5 sm:py-1.5"
                              : "rounded-lg bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-400 sm:px-2.5 sm:py-1.5"
                          }
                        >
                          {isDead ? "DEAD" : "PLAYING"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Dead Leaderboard */}
          <section className="mt-4 pb-6 sm:mt-5 sm:pb-8">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 shadow-xl sm:rounded-2xl sm:p-5">
              <div className="mb-4 flex items-center justify-between sm:mb-5">
                <div>
                  <h2 className="text-base font-black sm:text-lg md:text-xl">
                    💀 DEAD LEADERBOARD
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-600 sm:mt-1">
                    Players eliminated from the race
                  </p>
                </div>
                <div className="rounded-lg bg-red-500/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 sm:px-3 sm:py-2">
                  {deadPlayers.length} Dead
                </div>
              </div>

              {deadPlayers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
                  <div className="text-2xl opacity-50">🏃</div>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    No players are dead yet.
                  </p>
                  <p className="mt-1 text-[10px] text-slate-600">
                    Keep running!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-2.5">
                  {deadPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-xs font-black text-slate-400 sm:h-9 sm:w-9">
                        #{index + 1}
                      </div>

                      <div
                        className="h-3.5 w-3.5 shrink-0 rounded-full sm:h-4 sm:w-4"
                        style={{
                          backgroundColor: getDinoColor(player.dinoColor),
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">
                          {player.playerName}
                        </p>
                        <p className="truncate text-[10px] text-slate-600">
                          {player.playerCode}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-base font-black text-emerald-400 sm:text-lg">
                          {player.score ?? 0}
                        </p>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-600">
                          Score
                        </p>
                      </div>

                      <div className="rounded-lg bg-red-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-red-400 sm:px-2.5 sm:py-1.5">
                        DEAD
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default GamePage;
