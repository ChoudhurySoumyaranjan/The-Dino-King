package com.dinoking.dto.room;

import com.dinoking.dto.player.PlayerResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class RoomDetailsResponse {

    private Long id;
    private String roomCode;
    private String roomName;
    private Long ownerPlayerId;
    private Integer maxPlayers;
    private Boolean gameStarted;
    private List<PlayerResponse> players;
}