package com.dinoking.controller;

import com.dinoking.dto.room.*;
import com.dinoking.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(
            @Valid @RequestBody CreateRoomRequest request) {

        RoomResponse response = roomService.createRoom(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/join")
    public ResponseEntity<RoomResponse> joinRoom(
            @Valid @RequestBody JoinRoomRequest request) {

        RoomResponse response = roomService.joinRoom(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<RoomDetailsResponse> getRoomDetails(
            @PathVariable String roomCode) {

        RoomDetailsResponse response = roomService.getRoomDetails(roomCode);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{roomCode}/start")
    public ResponseEntity<RoomResponse> startGame(
            @PathVariable String roomCode,
            @Valid @RequestBody StartGameRequest request) {

        RoomResponse response = roomService.startGame(
                roomCode,
                request.getPlayerId()
        );

        return ResponseEntity.ok(response);
    }
}