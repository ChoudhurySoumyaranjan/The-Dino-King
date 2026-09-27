import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../../api/service/roomService";

const dinoColors = [
  {
    value: "GREEN",
    label: "Green",
    hex: "#4ade80",
  },
  {
    value: "BLUE",
    label: "Blue",
    hex: "#38bdf8",
  },
  {
    value: "RED",
    label: "Red",
    hex: "#ef4444",
  },
  {
    value: "YELLOW",
    label: "Yellow",
    hex: "#facc15",
  },
];

function JoinRoomPage() {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [dinoColor, setDinoColor] = useState("GREEN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCharacter = sessionStorage.getItem("dinoKingCharacter");

    if (!savedCharacter) {
      return;
    }

    try {
      const characterData = JSON.parse(savedCharacter);

      setPlayerName(characterData.playerName || "");
      setPlayerId(characterData.playerId || "");
      setDinoColor(characterData.dinoColor || "GREEN");
    } catch (error) {
      console.error("Failed to load character data:", error);
    }
  }, []);

  const handleJoinRoom = async (event) => {
    event.preventDefault();

    setError("");

    if (!roomCode.trim()) {
      setError("Please enter the Room Code.");
      return;
    }

    if (roomCode.trim().length !== 6) {
      setError("Room Code must be 6 characters.");
      return;
    }

    if (!playerName.trim()) {
      setError("Please enter your Player Name.");
      return;
    }

    if (!playerId.trim()) {
      setError("Please enter your Player ID.");
      return;
    }

    try {
      setLoading(true);

      const data = await joinRoom({
        roomCode: roomCode.trim().toUpperCase(),
        playerName: playerName.trim(),
        playerCode: playerId.trim(),
        dinoColor,
      });

      sessionStorage.setItem(
        "dinoKingRoom",
        JSON.stringify({
          roomId: data.id,
          roomCode: data.roomCode,
          roomName: data.roomName,
          playerId: data.playerId,
          playerCode: data.playerCode,
          ownerPlayerId: data.ownerPlayerId,
          playerName: playerName.trim(),
          dinoColor,
        }),
      );

      navigate(`/lobby/${data.roomCode}`);
    } catch (error) {
      console.error("Failed to join room:", error);

      const message =
        error.response?.data?.message ||
        "Unable to join room. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const selectedColor = dinoColors.find((color) => color.value === dinoColor);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]" />
        <div className="absolute left-1/2 top-[-160px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-3xl sm:h-[420px] sm:w-[420px]" />
        <div className="absolute bottom-[-160px] right-[-100px] h-[320px] w-[320px] rounded-full bg-emerald-500/[0.05] blur-3xl sm:h-[380px] sm:w-[380px]" />
        <div className="absolute left-[-120px] top-1/2 h-[260px] w-[260px] rounded-full bg-cyan-500/[0.03] blur-3xl sm:h-[300px] sm:w-[300px]" />
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
        <div className="w-full max-w-lg">
          {/* Top Nav */}
          <div className="mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => navigate("/game-menu")}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:px-4 sm:py-2.5"
            >
              <span className="transition group-hover:-translate-x-0.5">←</span>
              Back
            </button>
          </div>

          {/* Header */}
          <div className="mb-6 text-center sm:mb-7">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-3xl shadow-xl shadow-cyan-500/10 sm:mb-5 sm:h-16 sm:w-16 sm:text-4xl">
              🦖
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-400">
              The Dino King
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              JOIN ROOM
            </h1>

            <p className="mx-auto mt-2.5 max-w-sm text-sm leading-6 text-slate-400 sm:mt-3">
              Enter the room code and join your friends in the multiplayer
              arena.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleJoinRoom}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-6"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="space-y-4 sm:space-y-5">
              {/* Room Code */}
              <div>
                <label
                  htmlFor="roomCode"
                  className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:mb-2"
                >
                  Room Code
                </label>

                <input
                  id="roomCode"
                  type="text"
                  value={roomCode}
                  onChange={(event) => {
                    setRoomCode(
                      event.target.value
                        .replace(/[^a-zA-Z0-9]/g, "")
                        .toUpperCase(),
                    );
                    setError("");
                  }}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  disabled={loading}
                  autoComplete="off"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-center text-base font-black tracking-[0.3em] text-white uppercase outline-none transition placeholder:text-xs placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50 sm:py-4 sm:text-lg sm:tracking-[0.35em]"
                />

                <div className="mt-1.5 flex items-center justify-between sm:mt-2">
                  <p className="text-[10px] text-slate-600">
                    6 characters required
                  </p>
                  <p
                    className={`text-[10px] font-bold ${
                      roomCode.length === 6
                        ? "text-emerald-400"
                        : "text-slate-600"
                    }`}
                  >
                    {roomCode.length}/6
                  </p>
                </div>
              </div>

              {/* Player Name */}
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
                  disabled={loading}
                  autoComplete="off"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5"
                />

                <p className="mt-1.5 text-[10px] text-slate-600 sm:mt-2">
                  {playerName
                    ? "Player name loaded"
                    : "Enter the name shown to other players"}
                </p>
              </div>

              {/* Player ID */}
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
                  placeholder="Enter your Player ID"
                  maxLength={50}
                  disabled={loading}
                  autoComplete="off"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5"
                />

                <p className="mt-1.5 text-[10px] text-slate-600 sm:mt-2">
                  Must be unique in the game
                </p>
              </div>

              {/* Dino Color */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Dino Color
                  </label>
                  <span
                    className="h-3 w-3 rounded-full ring-2 ring-white/20"
                    style={{ backgroundColor: selectedColor?.hex }}
                  />
                </div>

                <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                  {dinoColors.map((color) => {
                    const isSelected = dinoColor === color.value;
                    return (
                      <button
                        key={color.value}
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setDinoColor(color.value);
                          setError("");
                        }}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition active:scale-95 sm:p-3 ${
                          isSelected
                            ? "border-white/30 bg-white/[0.08] shadow-lg"
                            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-lg shadow-md sm:h-9 sm:w-9 sm:text-xl"
                          style={{ backgroundColor: color.hex }}
                        >
                          🦖
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide ${
                            isSelected ? "text-white" : "text-slate-500"
                          }`}
                        >
                          {color.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-2 text-[10px] text-slate-600">
                  Choose an available Dino color
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3.5 py-3 sm:px-4 sm:py-3.5">
                  <span className="text-sm">⚠️</span>
                  <p className="text-sm leading-5 text-red-300">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2.5 pt-1 sm:gap-3 sm:pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/game-menu")}
                  disabled={loading}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-black text-slate-400 transition hover:bg-white/[0.07] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-3.5"
                >
                  <span className="transition group-hover:-translate-x-0.5">
                    ←
                  </span>
                  BACK
                </button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !roomCode.trim() ||
                    !playerName.trim() ||
                    !playerId.trim()
                  }
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-300 hover:shadow-emerald-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:py-3.5"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                      JOINING...
                    </>
                  ) : (
                    <>
                      JOIN ROOM
                      <span className="transition group-hover:translate-x-0.5">
                        →
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-700 sm:mt-6">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Enter the arena
          </div>
        </div>
      </div>
    </main>
  );
}

export default JoinRoomPage;
