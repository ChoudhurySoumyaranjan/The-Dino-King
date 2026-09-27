package com.dinoking.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class GameStartedEvent {

    private String event;
    private Long roomId;
    private String roomCode;
    private Long startedByPlayerId;
}