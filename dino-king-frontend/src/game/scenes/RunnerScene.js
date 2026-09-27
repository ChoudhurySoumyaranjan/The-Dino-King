import Phaser from "phaser";

import {
  sendPlayerJump,
  sendPlayerDied,
  sendScoreUpdate,
} from "../../api/websocket/gameSocketService";

import dinoGreen from "../../assets/dinos/green-dino.png";
import dinoBlue from "../../assets/dinos/blue-dino.png";
import dinoRed from "../../assets/dinos/red-dino.png";
import dinoYellow from "../../assets/dinos/yellow-dino.png";

class RunnerScene extends Phaser.Scene {
  constructor() {
    super("RunnerScene");

    this.dino = null;

    this.remoteDinos = new Map();
    this.remoteScoreTexts = new Map();
    this.remoteNameTexts = new Map();

    this.obstacle = null;

    this.score = 0;
    this.scoreText = null;

    this.gameOver = false;

    this.session = null;
    this.gameSocket = null;

    this.players = [];
    this.deadPlayers = [];

    // Keyboard key
    this.spaceKey = null;
  }

  preload() {
    this.load.image("dino-green", dinoGreen);
    this.load.image("dino-blue", dinoBlue);
    this.load.image("dino-red", dinoRed);
    this.load.image("dino-yellow", dinoYellow);
  }

  // =========================================
  // CREATE
  // =========================================

  create() {
    // Get shared data from Phaser Registry
    this.session = this.registry.get("session");
    this.gameSocket = this.registry.get("gameSocket");
    this.players = this.registry.get("players") || [];

    this.deadPlayers = this.players.filter(
      (player) => player.status === "DEAD",
    );

    console.log("RunnerScene session:", this.session);
    console.log("RunnerScene game socket:", this.gameSocket);
    console.log("RunnerScene players:", this.players);

    // =========================================
    // BACKGROUND
    // =========================================

    this.add.rectangle(500, 250, 1000, 500, 0x020617).setDepth(-10);

    this.add
      .rectangle(500, 160, 1000, 280, 0x0f172a)
      .setAlpha(0.4)
      .setDepth(-9);

    // =========================================
    // BACKGROUND DECORATION
    // =========================================

    this.add.circle(820, 90, 42, 0xfacc15).setAlpha(0.07).setDepth(-8);

    this.add.circle(820, 90, 28, 0xfacc15).setAlpha(0.04).setDepth(-8);

    const stars = [
      [120, 100],
      [260, 70],
      [430, 120],
      [600, 75],
      [730, 145],
      [930, 105],
    ];

    stars.forEach(([x, y]) => {
      this.add.circle(x, y, 1.8, 0xffffff).setAlpha(0.25).setDepth(-8);
    });

    // =========================================
    // GROUND
    // =========================================

    const ground = this.add.rectangle(500, 440, 1000, 40, 0x16a34a);

    this.physics.add.existing(ground, true);

    this.add.rectangle(500, 420, 1000, 3, 0x4ade80).setDepth(-1);

    this.add.rectangle(500, 460, 1000, 8, 0x000000).setAlpha(0.25).setDepth(-2);

    // =========================================
    // LOCAL PLAYER
    // =========================================

    const localPlayer = this.players.find(
      (player) => Number(player.id) === Number(this.session.playerId),
    );

    const localColor = localPlayer?.dinoColor || "GREEN";
    this.dino = this.createDino(120, localColor);

    this.physics.add.collider(this.dino, ground);

    // =========================================
    // LOCAL PLAYER NAME
    // =========================================

    if (localPlayer) {
      this.add
        .text(120, 348, localPlayer.playerName, {
          fontSize: "12px",
          fontStyle: "bold",
          color: "#f8fafc",
          backgroundColor: "#020617cc",
          padding: {
            left: 7,
            right: 7,
            top: 3,
            bottom: 3,
          },
        })
        .setOrigin(0.5)
        .setAlpha(0.95);
    }

    // =========================================
    // LOCAL PLAYER DEAD STATE
    // =========================================

    if (localPlayer?.status === "DEAD") {
      this.gameOver = true;

      this.dino.body.enable = false;
      this.dino.setAlpha(0.35);

      this.add
        .text(
          this.dino.x,
          this.dino.y - 58,
          `DEAD\nScore: ${localPlayer.score ?? 0}`,
          {
            fontSize: "13px",
            fontStyle: "bold",
            color: "#f87171",
            align: "center",
            backgroundColor: "#020617cc",
            padding: {
              left: 8,
              right: 8,
              top: 5,
              bottom: 5,
            },
          },
        )
        .setOrigin(0.5);
    }

    // =========================================
    // REMOTE PLAYERS
    // =========================================

    const remotePlayers = this.players.filter(
      (player) =>
        Number(player.id) !== Number(this.session.playerId) &&
        player.status !== "DEAD",
    );

    remotePlayers.forEach((player, index) => {
      const x = 220 + index * 100;

      const remoteDino = this.createDino(x, player.dinoColor);

      this.physics.add.collider(remoteDino, ground);

      this.remoteDinos.set(Number(player.id), remoteDino);

      const nameText = this.add
        .text(x, 348, player.playerName, {
          fontSize: "12px",
          fontStyle: "bold",
          color: "#f8fafc",
          backgroundColor: "#020617cc",
          padding: {
            left: 6,
            right: 6,
            top: 2,
            bottom: 2,
          },
        })
        .setOrigin(0.5);

      this.remoteNameTexts.set(Number(player.id), nameText);

      const scoreText = this.add
        .text(x, 323, `Score: ${player.score ?? 0}`, {
          fontSize: "11px",
          fontStyle: "bold",
          color: "#4ade80",
          backgroundColor: "#020617cc",
          padding: {
            left: 6,
            right: 6,
            top: 2,
            bottom: 2,
          },
        })
        .setOrigin(0.5);

      this.remoteScoreTexts.set(Number(player.id), scoreText);
    });

    // =========================================
    // OBSTACLE
    // =========================================

    this.obstacle = this.add.rectangle(900, 400, 35, 60, 0xef4444);

    this.physics.add.existing(this.obstacle);

    this.obstacle.body.setAllowGravity(false);
    this.obstacle.body.setVelocityX(-300);

    this.add.rectangle(900, 370, 45, 6, 0xdc2626).setAlpha(0.7);

    // =========================================
    // LOCAL DINO + OBSTACLE
    // =========================================

    this.physics.add.collider(this.dino, this.obstacle, () => {
      this.endGame();
    });

    // =========================================
    // SCORE UI
    // =========================================

    this.scoreText = this.add
      .text(28, 22, "SCORE  0", {
        fontSize: "20px",
        fontStyle: "bold",
        color: "#f8fafc",
        backgroundColor: "#020617cc",
        padding: {
          left: 12,
          right: 12,
          top: 8,
          bottom: 8,
        },
      })
      .setDepth(10);

    // =========================================
    // KEYBOARD
    // =========================================

    /*
     * Use Phaser's keyboard system directly.
     * This is more reliable than listening for
     * "keydown-SPACE" manually.
     */

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    // Prevent the browser from scrolling when Space
    // is pressed while the Phaser game is active.
    this.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.SPACE);

    console.log("Space key initialized.");

    // =========================================
    // MOUSE / TOUCH
    // =========================================

    this.input.on("pointerdown", () => {
      this.jump();
    });
  }

  // =========================================
  // CREATE DINO
  // =========================================

  createDino(x, color) {
    const textureKey = this.getDinoTexture(color);

    const dino = this.physics.add.sprite(x, 390, textureKey);

    dino.setDisplaySize(60, 60);

    dino.body.setSize(50, 50);
    dino.body.setOffset(5, 5);

    dino.body.setGravityY(1000);
    dino.body.setCollideWorldBounds(true);

    return dino;
  }

  getDinoTexture(color) {
    const textures = {
      GREEN: "dino-green",
      BLUE: "dino-blue",
      RED: "dino-red",
      YELLOW: "dino-yellow",
    };

    return textures[color] || textures.GREEN;
  }

  // // =========================================
  // // DINO COLOR
  // // =========================================

  // getDinoColor(color) {
  //   const colors = {
  //     GREEN: 0x4ade80,
  //     BLUE: 0x38bdf8,
  //     RED: 0xef4444,
  //     YELLOW: 0xfacc15,
  //   };

  //   return colors[color] || colors.GREEN;
  // }

  // =========================================
  // GAME UPDATE
  // =========================================

  update() {
    if (this.gameOver) {
      return;
    }

    /*
     * Detect Space press using Phaser.
     *
     * JustDown returns true only once when the
     * key changes from UP -> DOWN.
     */
    if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.jump();
    }

    // =========================================
    // OBSTACLE + SCORE
    // =========================================

    if (this.obstacle.x < -50) {
      this.obstacle.x = 1050;

      this.score += 1;

      this.scoreText.setText(`SCORE  ${this.score}`);

      if (this.gameSocket && this.session) {
        sendScoreUpdate(
          this.gameSocket,
          this.session.playerId,
          this.session.playerName,
          this.session.roomCode,
          this.score,
        );
      }
    }
  }

  // =========================================
  // LOCAL JUMP
  // =========================================

  jump() {
    if (this.gameOver) {
      return;
    }

    if (!this.dino || !this.dino.body) {
      return;
    }

    /*
     * Only allow jumping while the Dino is
     * standing on the ground.
     */
    if (!this.dino.body.blocked.down) {
      return;
    }

    // Jump
    this.dino.body.setVelocityY(-500);

    console.log("LOCAL PLAYER JUMP");

    // Send jump event to other players
    if (this.gameSocket && this.session) {
      sendPlayerJump(
        this.gameSocket,
        this.session.playerId,
        this.session.playerName,
        this.session.roomCode,
      );
    } else {
      console.warn("Cannot send jump: WebSocket or session is missing.");
    }
  }

  // =========================================
  // REMOTE PLAYER JUMP
  // =========================================

  remotePlayerJump(playerId) {
    const remoteDino = this.remoteDinos.get(Number(playerId));

    if (!remoteDino) {
      console.warn("Remote player Dino not found:", playerId);
      return;
    }

    if (remoteDino.body.blocked.down) {
      remoteDino.body.setVelocityY(-500);
    }
  }

  // =========================================
  // REMOTE PLAYER SCORE
  // =========================================

  remotePlayerScoreUpdate(playerId, score) {
    const scoreText = this.remoteScoreTexts.get(Number(playerId));

    if (!scoreText) {
      console.warn("Remote player score text not found:", playerId);
      return;
    }

    scoreText.setText(`Score: ${score ?? 0}`);
  }

  // =========================================
  // REMOTE PLAYER DEATH
  // =========================================

  remotePlayerDied(playerId, score) {
    const numericPlayerId = Number(playerId);

    const remoteDino = this.remoteDinos.get(numericPlayerId);

    if (!remoteDino) {
      console.warn("Remote player Dino not found:", playerId);
      return;
    }

    remoteDino.body.setVelocityX(0);
    remoteDino.body.setVelocityY(0);
    remoteDino.body.enable = false;
    remoteDino.setAlpha(0.35);

    const nameText = this.remoteNameTexts.get(numericPlayerId);

    if (nameText) {
      nameText.setAlpha(0.35);
    }

    const scoreText = this.remoteScoreTexts.get(numericPlayerId);

    if (scoreText) {
      scoreText.setText(`DEAD • ${score ?? 0}`);

      scoreText.setColor("#f87171");
    }

    this.add
      .text(remoteDino.x, remoteDino.y - 58, `DEAD\nScore: ${score ?? 0}`, {
        fontSize: "12px",
        fontStyle: "bold",
        color: "#f87171",
        align: "center",
        backgroundColor: "#020617cc",
        padding: {
          left: 7,
          right: 7,
          top: 4,
          bottom: 4,
        },
      })
      .setOrigin(0.5);
  }

  // =========================================
  // LOCAL GAME OVER
  // =========================================

  endGame() {
    if (this.gameOver) {
      return;
    }

    this.gameOver = true;

    this.obstacle.body.setVelocityX(0);

    // Send death to backend
    if (this.gameSocket && this.session) {
      sendPlayerDied(
        this.gameSocket,
        this.session.playerId,
        this.session.playerName,
        this.session.roomCode,
        this.score,
      );
    } else {
      console.warn("Cannot send death: WebSocket or session is missing.");
    }

    // Refresh React leaderboard
    const onPlayerDied = this.registry.get("onPlayerDied");

    if (onPlayerDied) {
      setTimeout(() => {
        onPlayerDied();
      }, 300);
    }

    // =========================================
    // GAME OVER OVERLAY
    // =========================================

    this.add
      .rectangle(500, 250, 1000, 500, 0x020617)
      .setAlpha(0.65)
      .setDepth(20);

    this.add
      .rectangle(500, 250, 420, 180, 0x0f172a)
      .setAlpha(0.85)
      .setStrokeStyle(1, 0xffffff, 0.08)
      .setDepth(20);

    this.add
      .text(500, 195, "GAME OVER", {
        fontSize: "42px",
        fontStyle: "bold",
        color: "#f87171",
        shadow: {
          offsetX: 0,
          offsetY: 4,
          color: "#000000",
          blur: 14,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setDepth(21);

    this.add
      .text(500, 255, `FINAL SCORE  ${this.score}`, {
        fontSize: "22px",
        fontStyle: "bold",
        color: "#f8fafc",
      })
      .setOrigin(0.5)
      .setDepth(21);

    this.add
      .text(500, 300, "Check the leaderboard below", {
        fontSize: "13px",
        color: "#94a3b8",
      })
      .setOrigin(0.5)
      .setDepth(21);
  }
}

export default RunnerScene;
