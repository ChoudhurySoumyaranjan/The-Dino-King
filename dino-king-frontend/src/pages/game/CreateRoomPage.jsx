import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../api/service/roomService";

function CreateRoomPage() {
  const navigate = useNavigate();

  const [characterData, setCharacterData] = useState(null);
  const [characterChecked, setCharacterChecked] = useState(false);

  const [formData, setFormData] = useState({
    roomName: "",
    playerName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [room, setRoom] = useState(null);

  /* =========================================
     LOAD CHARACTER
  ========================================= */

  useEffect(() => {
    const savedCharacter = sessionStorage.getItem("dinoKingCharacter");

    if (!savedCharacter) {
      navigate("/character-selection", {
        replace: true,
      });
      return;
    }

    try {
      const parsedCharacter = JSON.parse(savedCharacter);

      if (
        !parsedCharacter?.playerName?.trim() ||
        !parsedCharacter?.playerId?.trim() ||
        !parsedCharacter?.dinoColor
      ) {
        sessionStorage.removeItem("dinoKingCharacter");

        navigate("/character-selection", {
          replace: true,
        });

        return;
      }

      setCharacterData(parsedCharacter);

      setFormData({
        roomName: "",
        playerName: parsedCharacter.playerName.trim(),
      });

      setCharacterChecked(true);
    } catch (error) {
      console.error("Failed to read character selection:", error);

      sessionStorage.removeItem("dinoKingCharacter");

      navigate("/character-selection", {
        replace: true,
      });
    }
  }, [navigate]);

  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  /* =========================================
     CREATE ROOM
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!characterData) {
      setError(
        "Character selection is required. Please select your character.",
      );
      return;
    }

    if (!formData.roomName.trim()) {
      setError("Room name is required.");
      return;
    }

    if (!formData.playerName.trim()) {
      setError("Player name is required.");
      return;
    }

    if (!characterData.playerId?.trim()) {
      setError("Player ID is required. Please complete Character Selection.");
      return;
    }

    if (!characterData.dinoColor) {
      setError("Dino color is required. Please complete Character Selection.");
      return;
    }

    try {
      setLoading(true);

      const data = await createRoom({
        roomName: formData.roomName.trim(),
        playerName: formData.playerName.trim(),
        playerCode: characterData.playerId.trim(),
        dinoColor: characterData.dinoColor,
      });

      sessionStorage.setItem(
        "dinoKingSession",
        JSON.stringify({
          roomId: data.id,
          roomCode: data.roomCode,
          roomName: data.roomName,
          playerId: data.playerId,
          playerCode: data.playerCode,
          ownerPlayerId: data.ownerPlayerId,
          playerName: formData.playerName.trim(),
          dinoColor: characterData.dinoColor,
        }),
      );

      setRoom(data);
    } catch (error) {
      console.error("Failed to create room:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create room. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     WAIT FOR CHARACTER CHECK
  ========================================= */

  if (!characterChecked) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]" />
        </div>

        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-3xl shadow-lg shadow-emerald-500/10 sm:h-20 sm:w-20 sm:text-4xl">
            🦖
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Preparing your player...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================
     UI
  ========================================= */

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
        <div className="w-full max-w-lg">
          {!room ? (
            <>
              {/* Top Nav */}
              <div className="mb-6 sm:mb-8">
                <button
                  type="button"
                  onClick={() => navigate("/game-menu")}
                  className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:px-4 sm:py-2.5"
                >
                  <span className="transition group-hover:-translate-x-0.5">
                    ←
                  </span>
                  Back
                </button>
              </div>

              {/* Header */}
              <div className="mb-6 sm:mb-7">
                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-xl sm:h-11 sm:w-11 sm:text-2xl">
                    🦖
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
                      The Dino King
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">Multiplayer</p>
                  </div>
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                  CREATE A ROOM
                </h1>

                <p className="mt-2.5 text-sm leading-6 text-slate-400 sm:mt-3">
                  Create your room and invite other players to join your
                  multiplayer game.
                </p>
              </div>

              {/* Form Card */}
              <form
                onSubmit={handleSubmit}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-6"
              >
                {/* Top highlight */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="space-y-4 sm:space-y-5">
                  {/* Room Name */}
                  <div>
                    <label
                      htmlFor="roomName"
                      className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:mb-2"
                    >
                      Room Name
                    </label>

                    <input
                      id="roomName"
                      name="roomName"
                      type="text"
                      value={formData.roomName}
                      onChange={handleChange}
                      placeholder="Enter your room name"
                      maxLength={50}
                      disabled={loading}
                      autoComplete="off"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5"
                    />

                    <p className="mt-1.5 text-[10px] text-slate-600 sm:mt-2">
                      Maximum 50 characters
                    </p>
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
                      name="playerName"
                      type="text"
                      value={formData.playerName}
                      onChange={handleChange}
                      placeholder="Enter your player name"
                      maxLength={30}
                      disabled={loading}
                      autoComplete="off"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5"
                    />

                    <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-600 sm:mt-2">
                      <span className="text-emerald-400">✓</span>
                      Loaded from Character Selection
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

                    <div className="relative">
                      <input
                        id="playerId"
                        type="text"
                        value={characterData.playerId}
                        readOnly
                        className="w-full cursor-not-allowed rounded-xl border border-white/[0.07] bg-black/30 px-4 py-3 pr-12 text-sm text-slate-400 outline-none sm:py-3.5"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
                        ✓
                      </span>
                    </div>

                    <p className="mt-1.5 text-[10px] text-slate-600 sm:mt-2">
                      Selected from Character Selection
                    </p>
                  </div>

                  {/* Dino Color */}
                  <div>
                    <label
                      htmlFor="dinoColor"
                      className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:mb-2"
                    >
                      Dino Color
                    </label>

                    <div className="relative">
                      <input
                        id="dinoColor"
                        type="text"
                        value={characterData.dinoColor}
                        readOnly
                        className="w-full cursor-not-allowed rounded-xl border border-white/[0.07] bg-black/30 px-4 py-3 pr-12 text-sm font-bold text-slate-400 outline-none sm:py-3.5"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
                        ✓
                      </span>
                    </div>

                    <p className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-600 sm:mt-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            characterData.dinoColor === "GREEN"
                              ? "#4ade80"
                              : characterData.dinoColor === "BLUE"
                                ? "#38bdf8"
                                : characterData.dinoColor === "RED"
                                  ? "#ef4444"
                                  : "#facc15",
                        }}
                      />
                      Selected from Character Selection
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3.5 py-3 sm:px-4 sm:py-3.5">
                      <span className="text-sm">⚠️</span>
                      <p className="text-sm leading-5 text-red-300">{error}</p>
                    </div>
                  )}

                  {/* Create Button */}
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !formData.roomName.trim() ||
                      !formData.playerName.trim() ||
                      !characterData.playerId.trim()
                    }
                    className="group w-full rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-black tracking-wide text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-300 hover:shadow-emerald-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 sm:px-6 sm:py-4"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {loading ? "CREATING ROOM..." : "CREATE ROOM"}
                      {!loading && (
                        <span className="transition group-hover:translate-x-0.5">
                          →
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="mt-5 text-center sm:mt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-700">
                  Create · Invite · Play
                </p>
              </div>
            </>
          ) : (
            /* =========================================
               ROOM CREATED
            ========================================= */

            <div className="w-full text-center">
              {/* Success Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-3xl shadow-xl shadow-emerald-500/10 sm:h-20 sm:w-20 sm:rounded-3xl sm:text-4xl">
                🦖
              </div>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400 sm:mt-6">
                Ready to Play
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                ROOM CREATED
              </h1>

              <p className="mt-2.5 text-sm text-slate-400 sm:mt-3">
                Share the room code with your friends.
              </p>

              {/* Room Card */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] shadow-2xl sm:mt-8 sm:rounded-3xl">
                <div className="border-b border-emerald-400/10 px-5 py-3.5 sm:px-6 sm:py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                    Room Code
                  </p>
                </div>

                <div className="px-5 py-6 sm:px-6 sm:py-7">
                  <p className="text-4xl font-black tracking-[0.15em] text-emerald-400 sm:text-5xl md:text-6xl sm:tracking-[0.18em]">
                    {room.roomCode}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-3">
                    <div className="rounded-xl border border-white/[0.06] bg-black/20 px-3 py-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Room
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-300">
                        {room.roomName}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-black/20 px-3 py-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        Players
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-300">
                        {room.playerCount} / {room.maxPlayers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Copy */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(room.roomCode);
                }}
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.99] sm:mt-5 sm:px-6 sm:py-3.5"
              >
                COPY ROOM CODE
              </button>

              {/* Enter */}
              <button
                type="button"
                onClick={() => navigate(`/lobby/${room.roomCode}`)}
                className="group mt-2.5 w-full rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-black tracking-wide text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-300 hover:shadow-emerald-500/20 active:scale-[0.99] sm:mt-3 sm:px-6 sm:py-4"
              >
                ENTER LOBBY
                <span className="ml-2 inline-block transition group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default CreateRoomPage;
