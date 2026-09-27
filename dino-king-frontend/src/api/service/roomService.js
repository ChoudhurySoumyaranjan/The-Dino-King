//src/api/service/roomService.js

import api from "../axiosInstance";

export const createRoom = async (roomData) => {
  const response = await api.post("/rooms", roomData);
  return response.data;
};

export const joinRoom = async (roomData) => {
  const response = await api.post("/rooms/join", roomData);
  return response.data;
};

export const getRoomDetails = async (roomCode) => {
  const response = await api.get(`/rooms/${roomCode}`);
  return response.data;
};

export const startGame = async (roomCode, playerId) => {
  const response = await api.post(`/rooms/${roomCode}/start`, {
    playerId,
  });

  return response.data;
};
