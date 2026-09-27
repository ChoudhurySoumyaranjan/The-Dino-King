package com.dinoking.mapper;

import com.dinoking.dto.player.PlayerResponse;
import com.dinoking.entity.Player;

public final class PlayerMapper {

    private PlayerMapper() {
    }

    public static PlayerResponse toResponse(Player player) {
        return PlayerResponse.builder()
                .id(player.getId())
                .playerName(player.getPlayerName())
                .playerCode(player.getPlayerCode())
                .dinoColor(player.getDinoColor())
                .score(player.getScore())
                .status(player.getStatus())
                .roomId(player.getRoom().getId())
                .build();
    }
}