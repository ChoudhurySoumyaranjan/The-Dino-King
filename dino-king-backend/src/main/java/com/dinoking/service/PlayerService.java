package com.dinoking.service;

import com.dinoking.dto.player.CreatePlayerRequest;
import com.dinoking.dto.player.PlayerResponse;

public interface PlayerService {
    void markPlayerDead(Long playerId, Integer score);

    PlayerResponse createPlayer(CreatePlayerRequest request, Long roomId);

    void updatePlayerScore(
            Long playerId,
            Integer score
    );
}