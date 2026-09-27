package com.dinoking.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PlayerDiedEvent {

    private String event;

    private Long playerId;

    private String playerName;

    private String roomCode;

    private Integer score;
}