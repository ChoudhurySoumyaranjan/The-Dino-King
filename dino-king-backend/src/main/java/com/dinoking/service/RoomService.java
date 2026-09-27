package com.dinoking.service;

import com.dinoking.dto.room.CreateRoomRequest;
import com.dinoking.dto.room.JoinRoomRequest;
import com.dinoking.dto.room.RoomDetailsResponse;
import com.dinoking.dto.room.RoomResponse;

public interface RoomService {

     RoomResponse createRoom(CreateRoomRequest request);

     RoomResponse joinRoom(JoinRoomRequest request);

     RoomDetailsResponse getRoomDetails(String roomCode);
     RoomResponse startGame(String roomCode, Long playerId);
}