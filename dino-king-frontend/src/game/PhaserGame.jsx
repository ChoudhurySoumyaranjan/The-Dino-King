import { useEffect, useRef, useState } from "react";

import Phaser from "phaser";

import RunnerScene from "./scenes/RunnerScene";

import { connectToGame } from "../api/websocket/gameSocketService";

import { getRoomDetails } from "../api/service/roomService";

function PhaserGame({ session, onPlayerDied }) {
  const gameContainerRef = useRef(null);

  const gameRef = useRef(null);

  const gameSocketRef = useRef(null);

  const [players, setPlayers] = useState([]);

  // =========================================
  // LOAD ROOM PLAYERS
  // =========================================

  useEffect(() => {
    if (!session) {
      return;
    }

    let cancelled = false;

    const loadRoomPlayers = async () => {
      try {
        const room = await getRoomDetails(session.roomCode);

        if (!cancelled) {
          setPlayers(room.players || []);
        }
      } catch (error) {
        console.error("Failed to load room players:", error);
      }
    };

    loadRoomPlayers();

    return () => {
      cancelled = true;
    };
  }, [session]);

  // =========================================
  // INITIALIZE PHASER + GAME WEBSOCKET
  // =========================================

  useEffect(() => {
    if (!gameContainerRef.current || !session || players.length === 0) {
      return;
    }

    console.log("Starting Phaser for player:", session);

    console.log("Room players:", players);

    // =========================================
    // HANDLE REAL-TIME GAME EVENTS
    // =========================================

    const handleGameEvent = (event) => {
      console.log("Received multiplayer game event:", event);

      const scene = gameRef.current?.scene.getScene("RunnerScene");

      if (!scene) {
        console.warn("RunnerScene is not ready yet.");

        return;
      }

      // =========================================
      // REMOTE PLAYER JUMP
      // =========================================

      if (event.event === "PLAYER_JUMP") {
        scene.remotePlayerJump(event.playerId);

        return;
      }

      // =========================================
      // REMOTE PLAYER SCORE
      // =========================================

      if (event.event === "SCORE_UPDATE") {
        scene.remotePlayerScoreUpdate(event.playerId, event.score);

        return;
      }

      // =========================================
      // REMOTE PLAYER DEATH
      // =========================================

      if (event.event === "PLAYER_DIED") {
        scene.remotePlayerDied(event.playerId, event.score);

        if (onPlayerDied) {
          onPlayerDied();
        }

        return;
      }
    };

    // =========================================
    // CONNECT GAME WEBSOCKET
    // =========================================

    gameSocketRef.current = connectToGame(
      session.roomCode,
      session.playerId,
      handleGameEvent,
    );

    // =========================================
    // PHASER CONFIGURATION
    // =========================================

    const config = {
      type: Phaser.AUTO,

      width: 1000,

      height: 500,

      parent: gameContainerRef.current,

      backgroundColor: "#020617",

      physics: {
        default: "arcade",

        arcade: {
          gravity: {
            y: 0,
          },

          debug: false,
        },
      },

      scene: [RunnerScene],

      scale: {
        mode: Phaser.Scale.FIT,

        autoCenter: Phaser.Scale.CENTER_BOTH,

        width: 1000,

        height: 500,
      },

      callbacks: {
        preBoot: (game) => {
          game.registry.set("session", session);

          game.registry.set("gameSocket", gameSocketRef.current);

          game.registry.set("players", players);

          game.registry.set("onPlayerDied", onPlayerDied);
        },
      },
    };

    // =========================================
    // CREATE PHASER GAME
    // =========================================

    gameRef.current = new Phaser.Game(config);

    // =========================================
    // CLEANUP
    // =========================================

    return () => {
      if (gameSocketRef.current) {
        gameSocketRef.current.deactivate();

        gameSocketRef.current = null;
      }

      if (gameRef.current) {
        gameRef.current.destroy(true);

        gameRef.current = null;
      }
    };
  }, [session, players, onPlayerDied]);

  // =========================================
  // GAME CONTAINER
  // =========================================

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-slate-950 sm:rounded-2xl">
      {/* LIVE BADGE */}

      <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-md sm:left-3 sm:top-3 sm:gap-2 sm:px-3 sm:py-1.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
          LIVE
        </span>
      </div>

      {/* PLAYER COUNT */}

      <div className="pointer-events-none absolute right-2.5 top-2.5 z-10 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-md sm:right-3 sm:top-3 sm:px-3 sm:py-1.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
          {players.length} Players
        </span>
      </div>

      {/* PHASER CANVAS */}

      <div ref={gameContainerRef} className="w-full overflow-hidden" />

      {/* CONTROLS HINT */}

      <div className="pointer-events-none absolute bottom-2.5 left-1/2 z-10 -translate-x-1/2 sm:bottom-3">
        <div className="rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-md sm:px-3 sm:py-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
            SPACE / TAP TO JUMP
          </span>
        </div>
      </div>
    </div>
  );
}

export default PhaserGame;
