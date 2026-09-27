import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getRoomDetails, startGame } from "../../api/service/roomService";
import { connectToRoom } from "../../api/websocket/gameSocketService.js";

function LobbyPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [realtimeMessage, setRealtimeMessage] = useState("");
  const [startingGame, setStartingGame] = useState(false);

  /* =========================================
     LOAD PLAYER SESSION
  ========================================= */

  useEffect(() => {
    const storedSession = sessionStorage.getItem("dinoKingSession");

    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch (error) {
        console.error("Invalid session data:", error);
      }
    }
  }, []);

  /* =========================================
     LOAD ROOM
  ========================================= */

  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRoomDetails(roomCode);

        setRoom(data);
      } catch (error) {
        console.error("Failed to load room:", error);

        setError(error.response?.data?.message || "Unable to load the room.");
      } finally {
        setLoading(false);
      }
    };

    if (roomCode) {
      loadRoom();
    }
  }, [roomCode]);

  /* =========================================
     LOBBY WEBSOCKET
  ========================================= */

  useEffect(() => {
    if (!roomCode) {
      return;
    }

    const client = connectToRoom(roomCode, async (event) => {
      console.log("WebSocket event received:", event);

      if (event.event === "PLAYER_JOINED") {
        setRealtimeMessage(`${event.playerName} joined the room`);

        try {
          const updatedRoom = await getRoomDetails(roomCode);
          setRoom(updatedRoom);
        } catch (error) {
          console.error("Failed to refresh room after player joined:", error);
        }

        return;
      }

      if (event.event === "GAME_STARTED") {
        setRealtimeMessage("Game started!");

        navigate(`/game/${roomCode}`);

        return;
      }
    });

    return () => {
      client.deactivate();
    };
  }, [roomCode, navigate]);

  /* =========================================
     START GAME
  ========================================= */

  const handleStartGame = async () => {
    if (!session || !room) {
      return;
    }

    try {
      setStartingGame(true);
      setRealtimeMessage("Starting game...");

      await startGame(roomCode, session.playerId);
    } catch (error) {
      console.error("Failed to start game:", error);

      setRealtimeMessage(
        error.response?.data?.message || "Unable to start the game.",
      );

      setStartingGame(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]" />
        </div>

        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-3xl shadow-lg shadow-emerald-500/10 sm:h-20 sm:w-20 sm:text-4xl">
            🦖
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-slate-400">
              Loading lobby...
            </span>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-red-500/20 bg-white/[0.03] p-6 text-center shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl sm:h-16 sm:w-16 sm:text-3xl">
            ⚠️
          </div>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.3em] text-red-400">
            Lobby Error
          </p>

          <h1 className="mt-2 text-xl font-black sm:text-2xl">
            Unable to Load Lobby
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/game-menu")}
            className="mt-6 w-full rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 active:scale-[0.98] sm:mt-7"
          >
            BACK TO GAME MENU
          </button>
        </div>
      </main>
    );
  }

  if (!room) {
    return null;
  }

  /* =========================================
     OWNER CHECK
  ========================================= */

  const isOwner =
    session && Number(session.playerId) === Number(room.ownerPlayerId);

  const players = room.players || [];

  /* =========================================
     DINO COLOR
  ========================================= */

  const getDinoColor = (color) => {
    const colors = {
      GREEN: {
        bg: "#22c55e",
        shadow: "shadow-green-500/20",
      },
      BLUE: {
        bg: "#3b82f6",
        shadow: "shadow-blue-500/20",
      },
      RED: {
        bg: "#ef4444",
        shadow: "shadow-red-500/20",
      },
      YELLOW: {
        bg: "#eab308",
        shadow: "shadow-yellow-500/20",
      },
    };

    return colors[color] || colors.GREEN;
  };

  /* =========================================
     UI
  ========================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]" />
        <div className="absolute left-1/2 top-[-160px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-3xl sm:h-[420px] sm:w-[420px]" />
        <div className="absolute bottom-[-160px] right-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-500/[0.05] blur-3xl sm:h-[400px] sm:w-[400px]" />
        <div className="absolute left-[-100px] top-1/2 h-[260px] w-[260px] rounded-full bg-emerald-500/[0.04] blur-3xl sm:h-[300px] sm:w-[300px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ✅ Stronger centering */}
      <div className="relative z-10 flex justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="w-full max-w-5xl">
          {/* Top Nav */}
          <div className="mb-6 flex items-center justify-between sm:mb-8">
            <button
              type="button"
              onClick={() => navigate("/game-menu")}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:px-4 sm:py-2.5"
            >
              <span className="transition group-hover:-translate-x-0.5">←</span>
              Back
            </button>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                Online
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 sm:mb-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2.5 sm:mb-3 sm:gap-3">
                  <span className="text-2xl sm:text-3xl">🦖</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 sm:text-xs">
                    The Dino King
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                  {room.roomName}
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:mt-3">
                  Your multiplayer room is ready. Wait for your players and
                  start the run together.
                </p>
              </div>

              {/* Room Code */}
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] px-5 py-3.5 text-center shadow-lg shadow-emerald-500/[0.04] sm:px-6 sm:py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                  Room Code
                </p>
                <p className="mt-1 text-2xl font-black tracking-[0.18em] text-emerald-400 sm:text-3xl md:text-4xl">
                  {room.roomCode}
                </p>
                <p className="mt-1 text-[10px] text-slate-600">
                  Share with players
                </p>
              </div>
            </div>
          </div>

          {/* Realtime Message */}
          {realtimeMessage && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-3 sm:mb-6 sm:py-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-sm">
                ✓
              </div>
              <p className="text-sm font-medium text-emerald-300">
                {realtimeMessage}
              </p>
            </div>
          )}

          {/* Room Stats */}
          <div className="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-3">
            {/* Players */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.05] sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
                    Players
                  </p>
                  <p className="mt-1.5 text-2xl font-black sm:mt-2 sm:text-3xl">
                    {players.length}
                    <span className="ml-1 text-sm font-semibold text-slate-600 sm:text-base">
                      / {room.maxPlayers}
                    </span>
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-base sm:h-11 sm:w-11 sm:text-lg">
                  👥
                </div>
              </div>
            </div>

            {/* Game Status */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.05] sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
                    Game Status
                  </p>
                  <p
                    className={`mt-1.5 text-lg font-black sm:mt-2 sm:text-xl ${
                      room.gameStarted ? "text-emerald-400" : "text-yellow-400"
                    }`}
                  >
                    {room.gameStarted ? "Started" : "Waiting"}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
                    room.gameStarted ? "bg-emerald-400/10" : "bg-yellow-400/10"
                  }`}
                >
                  {room.gameStarted ? "▶" : "⏳"}
                </div>
              </div>
            </div>

            {/* Your Player */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.05] sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
                    Your Player
                  </p>
                  <p className="mt-1.5 truncate text-lg font-black sm:mt-2 sm:text-xl">
                    {session?.playerName || "Unknown"}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-base sm:h-11 sm:w-11 sm:text-lg">
                  🦖
                </div>
              </div>
            </div>
          </div>

          {/* Player Panel */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl sm:rounded-3xl">
            {/* Panel Header */}
            <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5">
              <div>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <h2 className="text-lg font-black sm:text-xl">Players</h2>
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 sm:py-1 sm:text-[11px]">
                    {players.length} / {room.maxPlayers}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Players currently connected to the lobby
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live updates enabled
              </div>
            </div>

            {/* Player List */}
            <div className="p-3 sm:p-5 md:p-6">
              {players.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center sm:px-6 sm:py-12">
                  <div className="text-3xl sm:text-4xl">🦖</div>
                  <p className="mt-3 font-bold sm:mt-4">Waiting for players</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Share the room code to invite other players.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  {players.map((player, index) => {
                    const isCurrentPlayer =
                      session && Number(session.playerId) === Number(player.id);

                    const isPlayerOwner =
                      Number(room.ownerPlayerId) === Number(player.id);

                    const dino = getDinoColor(player.dinoColor);

                    return (
                      <div
                        key={player.id}
                        className={`group flex flex-col gap-3 rounded-xl border p-3.5 transition sm:flex-row sm:items-center sm:gap-4 sm:rounded-2xl sm:p-4 ${
                          isCurrentPlayer
                            ? "border-emerald-400/25 bg-emerald-400/[0.05]"
                            : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                        }`}
                      >
                        {/* Left */}
                        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                          {/* Rank */}
                          <div className="hidden w-7 shrink-0 text-center text-sm font-black text-slate-600 sm:block">
                            #{index + 1}
                          </div>

                          {/* Dino */}
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg shadow-lg sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl ${dino.shadow}`}
                            style={{ backgroundColor: dino.bg }}
                          >
                            🦖
                          </div>

                          {/* Player Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <p className="truncate text-sm font-bold sm:text-base">
                                {player.playerName}
                              </p>

                              {isCurrentPlayer && (
                                <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                                  You
                                </span>
                              )}

                              {isPlayerOwner && (
                                <span className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-yellow-400">
                                  Owner
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 truncate text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
                              {player.dinoColor} · {player.playerCode}
                            </p>
                          </div>
                        </div>

                        {/* Score + Status */}
                        <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] pt-3 sm:justify-end sm:gap-6 sm:border-0 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-base font-black sm:text-lg">
                              {player.score ?? 0}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                              Score
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider sm:px-3 sm:py-1.5 ${
                              player.status === "DEAD"
                                ? "bg-red-400/10 text-red-400"
                                : "bg-emerald-400/10 text-emerald-400"
                            }`}
                          >
                            {player.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Start Game */}
          <div className="mt-5 sm:mt-6">
            {isOwner ? (
              <div>
                <button
                  type="button"
                  onClick={handleStartGame}
                  disabled={room.gameStarted || startingGame}
                  className="group relative w-full overflow-hidden rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-black tracking-wide text-slate-950 shadow-xl shadow-emerald-500/10 transition hover:bg-emerald-300 hover:shadow-emerald-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-6 sm:py-4"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {startingGame
                      ? "STARTING GAME..."
                      : room.gameStarted
                        ? "GAME STARTED"
                        : "START GAME"}

                    {!startingGame && !room.gameStarted && (
                      <span className="transition group-hover:translate-x-0.5">
                        →
                      </span>
                    )}
                  </span>
                </button>

                {!room.gameStarted && (
                  <p className="mt-2.5 text-center text-xs text-slate-600 sm:mt-3">
                    You are the room owner. You can start the game.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4 text-center sm:rounded-2xl sm:px-6 sm:py-5">
                <div className="flex items-center justify-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                  <p className="text-sm font-semibold text-slate-300">
                    Waiting for the room owner
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  Only the room owner can start the game.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pb-2 pt-6 text-center sm:pt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-700">
              The Dino King · Multiplayer Lobby
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LobbyPage;
