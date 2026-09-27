# 🦖 The Dino King

### Infinite Runner 2D Multiplayer Game

The Dino King is a browser-based multiplayer infinite runner built with **React, Phaser, Spring Boot, WebSocket/STOMP, and MySQL**.

Players can choose a Dino, create or join a room, compete with other players, and see gameplay events in real time.

## ✨ Features

- Create and join multiplayer rooms
- Choose Dino character and color
- Player name and Player ID
- Room lobby with player count and leaderboard
- Room owner controls game start
- Infinite runner gameplay
- Jump using **Space** or mouse/touch
- Real-time multiplayer events
- Live scores and player status
- Dead-player leaderboard
- Persistent MySQL database
- Docker Compose support

## 🛠️ Tech Stack

### Frontend
- React + Vite
- JavaScript / JSX
- Phaser
- Tailwind CSS
- Axios
- STOMP WebSocket

### Backend
- Java 17
- Spring Boot
- Spring Data JPA / Hibernate
- Spring Web MVC
- WebSocket / STOMP
- MySQL

### DevOps
- Docker
- Docker Compose
- Nginx

## 🏗️ Architecture

```text
React + Phaser
      │
      ├── REST API ───────► Spring Boot
      │                         │
      │                         └── MySQL
      │
      └── WebSocket/STOMP ──► Spring Boot
                                │
                                └── Real-time room events
```

**REST API** is used for room operations such as creating, joining, loading room details, and starting a game.

**WebSocket/STOMP** is used for real-time multiplayer events such as jumps, deaths, and score updates.

## 📁 Project Structure

```text
THE-DINO-KING/
├── dino-king-backend/
├── dino-king-frontend/
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🚀 Run With Docker

### Requirements

Install:

- Git
- Docker Desktop

Clone the repository:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd The-Dino-King
```

Start the complete application:

```bash
docker compose up -d --build
```

Open:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5005
```

Docker starts:

- MySQL
- Spring Boot backend
- React frontend with Nginx

MySQL data is stored in a Docker volume, so it persists when containers are stopped.

## 💻 Run Backend Locally

If running the backend directly from IntelliJ:

```text
Java 17+
MySQL
```

Database:

```text
Database: dino_king
Username: root
Password: 12345
```

The backend runs on:

```text
http://localhost:5005
```

## 🔌 Main API Endpoints

```text
POST /api/rooms
POST /api/rooms/join
GET  /api/rooms/{roomCode}
POST /api/rooms/{roomCode}/start
```

## 🔄 WebSocket

Endpoint:

```text
/ws
```

Room topic:

```text
/topic/room/{roomCode}
```

Main application destinations:

```text
/app/player-jump
/app/player-died
/app/score-update
```

Events include:

```text
PLAYER_JOINED
GAME_STARTED
PLAYER_JUMP
PLAYER_DIED
SCORE_UPDATE
```

## 🐳 Docker Commands

Start:

```bash
docker compose up -d
```

Build and start:

```bash
docker compose up -d --build
```

Stop:

```bash
docker compose stop
```

View logs:

```bash
docker compose logs -f
```

Remove containers:

```bash
docker compose down
```

## 🎮 Gameplay

1. Choose your Dino and enter player details.
2. Create a room or join an existing room.
3. Wait in the lobby.
4. The room owner starts the game.
5. Jump over obstacles and increase your score.
6. Multiplayer events are synchronized through WebSocket.
7. When a player dies, their final score and status are updated.

## 🤝 Contributing

Contributions and improvements are welcome. Fork the repository, create a branch, make your changes, and submit a pull request.

## 📄 License

This project is available for educational and portfolio purposes.

---

**🦖 The Dino King — Create a room. Choose your Dino. Start running.**
