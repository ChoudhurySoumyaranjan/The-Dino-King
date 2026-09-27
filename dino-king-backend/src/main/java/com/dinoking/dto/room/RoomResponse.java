package com.dinoking.dto.room;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RoomResponse {

    private Long id;
    private String roomCode;
    private String roomName;

    private Long ownerPlayerId;

    private Long playerId;
    private String playerCode;

    private Integer maxPlayers;
    private Boolean gameStarted;
    private Integer playerCount;

    private LocalDateTime createdAt;
}