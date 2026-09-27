import { useEffect, useState } from "react";
import { getRoomDetails } from "./api/service/roomService";

function App() {
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await getRoomDetails("779694");
        setRoom(data);
      } catch (error) {
        console.error(error);
        setError("Failed to connect to backend");
      }
    };

    loadRoom();
  }, []);

  return (
    <div>
      <h1>The Dino King</h1>

      {error && <p>{error}</p>}

      {room && (
        <div>
          <h2>{room.roomName}</h2>
          <p>Room Code: {room.roomCode}</p>
          <p>Players: {room.players.length}</p>

          {room.players.map((player) => (
            <p key={player.id}>
              {player.playerName} - {player.dinoColor}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;