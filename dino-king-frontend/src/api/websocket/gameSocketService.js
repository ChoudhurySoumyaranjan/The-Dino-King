import { Client } from "@stomp/stompjs";

const WS_URL = "ws://localhost:5005/ws";

export const connectToRoom = (roomCode, onEvent) => {
  const client = new Client({
    brokerURL: WS_URL,

    reconnectDelay: 5000,

    onConnect: () => {
      console.log(`WebSocket connected to room: ${roomCode}`);

      client.subscribe(`/topic/room/${roomCode}`, (message) => {
        try {
          const event = JSON.parse(message.body);

          console.log("WebSocket event:", event);

          onEvent(event);
        } catch (error) {
          console.error("Failed to process WebSocket message:", error);
        }
      });
    },

    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers["message"]);
    },

    onWebSocketError: (error) => {
      console.error("WebSocket error:", error);
    },

    onDisconnect: () => {
      console.log("WebSocket disconnected");
    },
  });

  client.activate();

  return client;
};

//   GAME WEBSOCKET

export const sendPlayerDied = (
  client,
  playerId,
  playerName,
  roomCode,
  score,
) => {
  if (!client || !client.connected) {
    console.warn("Game WebSocket is not connected.");

    return;
  }

  const event = {
    event: "PLAYER_DIED",
    playerId,
    playerName,
    roomCode,
    score,
  };

  client.publish({
    destination: "/app/player-died",
    body: JSON.stringify(event),
  });

  console.log("Player death sent:", event);
};

export const connectToGame = (roomCode, playerId, onGameEvent) => {
  const client = new Client({
    brokerURL: WS_URL,

    reconnectDelay: 5000,

    onConnect: () => {
      console.log(`Game WebSocket connected to room: ${roomCode}`);

      client.subscribe(`/topic/room/${roomCode}`, (message) => {
        try {
          const event = JSON.parse(message.body);

          console.log("Game WebSocket event:", event);

          // Only process gameplay events
          if (
            event.event !== "PLAYER_JUMP" &&
            event.event !== "PLAYER_DIED" &&
            event.event !== "SCORE_UPDATE"
          ) {
            return;
          }

          // Ignore own events
          if (Number(event.playerId) === Number(playerId)) {
            return;
          }

          onGameEvent(event);
        } catch (error) {
          console.error("Failed to process game event:", error);
        }
      });
    },

    onStompError: (frame) => {
      console.error("Game STOMP error:", frame.headers["message"]);
    },

    onWebSocketError: (error) => {
      console.error("Game WebSocket error:", error);
    },

    onDisconnect: () => {
      console.log("Game WebSocket disconnected");
    },
  });

  client.activate();

  return client;
};

export const sendPlayerJump = (client, playerId, playerName, roomCode) => {
  if (!client || !client.connected) {
    console.warn("Game WebSocket is not connected.");
    return;
  }

  const event = {
    event: "PLAYER_JUMP",
    playerId,
    playerName,
    roomCode,
  };

  client.publish({
    destination: "/app/player-jump",
    body: JSON.stringify(event),
  });

  console.log("Player jump sent:", event);
};

export const sendScoreUpdate = (
  client,
  playerId,
  playerName,
  roomCode,
  score,
) => {
  if (!client || !client.connected) {
    console.warn("Game WebSocket is not connected.");
    return;
  }

  const event = {
    event: "SCORE_UPDATE",
    playerId,
    playerName,
    roomCode,
    score,
  };

  client.publish({
    destination: "/app/score-update",
    body: JSON.stringify(event),
  });

  console.log("Score update sent:", event);
};
