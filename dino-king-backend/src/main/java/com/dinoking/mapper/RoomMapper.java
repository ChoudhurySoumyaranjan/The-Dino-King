package com.dinoking.mapper;

import com.dinoking.dto.room.RoomResponse;
import com.dinoking.entity.Player;
import com.dinoking.entity.Room;

public final class RoomMapper {

    private RoomMapper() {
    }

    public static RoomResponse toResponse(
            Room room,
            Player player,
            int playerCount) {

        return RoomResponse.builder()
                .id(room.getId())
                .roomCode(room.getRoomCode())
                .roomName(room.getRoomName())
                .ownerPlayerId(room.getOwnerPlayerId())
                .playerId(player.getId())
                .playerCode(player.getPlayerCode())
                .maxPlayers(room.getMaxPlayers())
                .gameStarted(room.getGameStarted())
                .playerCount(playerCount)
                .createdAt(room.getCreatedAt())
                .build();
    }
}