import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import ErrorPage from "../pages/common/ErrorPage";
import StartMenuPage from "../pages/game/StartMenuPage";
import GameMenuPage from "../pages/game/GameMenuPage";
import CreateRoomPage from "../pages/game/CreateRoomPage";
import JoinRoomPage from "../pages/game/JoinRoomPage";
import LobbyPage from "../pages/game/LobbyPage";
import GamePage from "../pages/game/GamePage";
import CharacterSelectionPage from "../pages/game/CharacterSelectionPage";
import SettingsPage from "../pages/game/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <StartMenuPage />,
      },
      {
        path: "/game-menu",
        element: <GameMenuPage />,
      },
      {
        path: "/create-room",
        element: <CreateRoomPage />,
      },
      {
        path: "/join-room",
        element: <JoinRoomPage />,
      },
      {
        path: "/lobby/:roomCode",
        element: <LobbyPage />,
      },
      {
        path: "/game/:roomCode",
        element: <GamePage />,
      },
      {
        path: "/character-selection",
        element: <CharacterSelectionPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);
