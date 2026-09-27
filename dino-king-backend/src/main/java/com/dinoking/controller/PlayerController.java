package com.dinoking.controller;

import com.dinoking.dto.player.CreatePlayerRequest;
import com.dinoking.dto.player.PlayerResponse;
import com.dinoking.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping("/rooms/{roomId}")
    public ResponseEntity<PlayerResponse> createPlayer(
            @PathVariable Long roomId,
            @Valid @RequestBody CreatePlayerRequest request) {

        PlayerResponse response = playerService.createPlayer(request, roomId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}