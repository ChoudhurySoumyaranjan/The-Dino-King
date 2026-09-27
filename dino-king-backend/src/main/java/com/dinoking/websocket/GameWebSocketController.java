package com.dinoking.websocket;

import com.dinoking.dto.websocket.PlayerDiedEvent;
import com.dinoking.dto.websocket.PlayerJumpEvent;
import com.dinoking.dto.websocket.ScoreUpdateEvent;
import com.dinoking.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class GameWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    private final PlayerService playerService;

    @MessageMapping("/player-jump")
    public void playerJump(PlayerJumpEvent event) {

        messagingTemplate.convertAndSend(
                "/topic/room/" + event.getRoomCode(),
                event
        );
    }

    @MessageMapping("/player-died")
    public void playerDied(PlayerDiedEvent event) {

        playerService.markPlayerDead(
                event.getPlayerId(),
                event.getScore()
        );

        messagingTemplate.convertAndSend(
                "/topic/room/" + event.getRoomCode(),
                event
        );
    }

    @MessageMapping("/score-update")
    public void scoreUpdate(ScoreUpdateEvent event) {

        playerService.updatePlayerScore(
                event.getPlayerId(),
                event.getScore()
        );

        messagingTemplate.convertAndSend(
                "/topic/room/" + event.getRoomCode(),
                event
        );
    }
}