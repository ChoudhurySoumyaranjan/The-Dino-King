package com.dinoking.service.impl;

import com.dinoking.dto.room.CreateRoomRequest;
import com.dinoking.dto.room.JoinRoomRequest;
import com.dinoking.dto.room.RoomDetailsResponse;
import com.dinoking.dto.room.RoomResponse;
import com.dinoking.dto.websocket.GameStartedEvent;
import com.dinoking.dto.websocket.PlayerJoinedEvent;
import com.dinoking.entity.Player;
import com.dinoking.entity.Room;
import com.dinoking.exception.NoDinoColorAvailableException;
import com.dinoking.exception.ResourceNotFoundException;
import com.dinoking.exception.RoomFullException;
import com.dinoking.mapper.PlayerMapper;
import com.dinoking.mapper.RoomMapper;
import com.dinoking.repository.PlayerRepository;
import com.dinoking.repository.RoomRepository;
import com.dinoking.service.RoomService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final PlayerRepository playerRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    @Override
    public RoomResponse createRoom(CreateRoomRequest request) {

        String roomCode = generateRoomCode();

        Room room = Room.builder()
                .roomCode(roomCode)
                .roomName(request.getRoomName())
                .ownerPlayerId(0L)
                .maxPlayers(4)
                .gameStarted(false)
                .build();

        Room savedRoom = roomRepository.save(room);

        /*
         * Player ID only needs to be unique inside the same room.
         * The same Player ID can be reused when creating a new room.
         */
        if (playerRepository.existsByPlayerCodeAndRoom(
                request.getPlayerCode(),
                savedRoom
        )) {
            throw new IllegalStateException(
                    "Player ID is already taken in this room"
            );
        }

        Player player = Player.builder()
                .playerName(request.getPlayerName())
                .playerCode(request.getPlayerCode())
                .dinoColor(request.getDinoColor())
                .score(0)
                .status("PLAYING")
                .room(savedRoom)
                .build();

        Player savedPlayer = playerRepository.save(player);

        savedRoom.setOwnerPlayerId(savedPlayer.getId());
        roomRepository.save(savedRoom);

        return RoomMapper.toResponse(
                savedRoom,
                savedPlayer,
                1
        );
    }

    @Transactional
    @Override
    public RoomResponse joinRoom(JoinRoomRequest request) {

        Room room = roomRepository.findByRoomCode(request.getRoomCode())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found")
                );

        long playerCount =
                playerRepository.findByRoom(room).size();

        if (playerCount >= room.getMaxPlayers()) {
            throw new RoomFullException("Room is full");
        }

        /*
         * Player ID only needs to be unique inside this room.
         */
        if (playerRepository.existsByPlayerCodeAndRoom(
                request.getPlayerCode(),
                room
        )) {
            throw new IllegalStateException(
                    "Player ID is already taken in this room"
            );
        }

        String requestedColor =
                request.getDinoColor();

        /*
         * Each Dino color can only be used once
         * inside the same room.
         */
        if (playerRepository.existsByRoomAndDinoColor(
                room,
                requestedColor
        )) {
            throw new IllegalStateException(
                    "Dino color " + requestedColor
                            + " is already taken in this room"
            );
        }

        Player player = Player.builder()
                .playerName(request.getPlayerName())
                .playerCode(request.getPlayerCode())
                .dinoColor(requestedColor)
                .score(0)
                .status("PLAYING")
                .room(room)
                .build();

        Player savedPlayer =
                playerRepository.save(player);

        PlayerJoinedEvent event =
                PlayerJoinedEvent.builder()
                        .event("PLAYER_JOINED")
                        .playerId(savedPlayer.getId())
                        .playerName(savedPlayer.getPlayerName())
                        .playerCode(savedPlayer.getPlayerCode())
                        .dinoColor(savedPlayer.getDinoColor())
                        .roomId(room.getId())
                        .roomCode(room.getRoomCode())
                        .build();

        messagingTemplate.convertAndSend(
                "/topic/room/" + room.getRoomCode(),
                event
        );

        return RoomMapper.toResponse(
                room,
                savedPlayer,
                (int) playerCount + 1
        );
    }

    @Override
    public RoomDetailsResponse getRoomDetails(String roomCode) {

        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found")
                );

        var players = playerRepository.findByRoom(room)
                .stream()
                .map(PlayerMapper::toResponse)
                .toList();

        return RoomDetailsResponse.builder()
                .id(room.getId())
                .roomCode(room.getRoomCode())
                .roomName(room.getRoomName())
                .ownerPlayerId(room.getOwnerPlayerId())
                .maxPlayers(room.getMaxPlayers())
                .gameStarted(room.getGameStarted())
                .players(players)
                .build();
    }

    @Transactional
    @Override
    public RoomResponse startGame(
            String roomCode,
            Long playerId
    ) {

        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found")
                );

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Player not found")
                );

        if (!player.getRoom().getId().equals(room.getId())) {
            throw new ResourceNotFoundException(
                    "Player does not belong to this room"
            );
        }

        if (!room.getOwnerPlayerId().equals(playerId)) {
            throw new IllegalStateException(
                    "Only the room owner can start the game"
            );
        }

        if (room.getGameStarted()) {
            throw new IllegalStateException(
                    "Game has already started"
            );
        }

        room.setGameStarted(true);

        Room savedRoom = roomRepository.save(room);

        GameStartedEvent event = GameStartedEvent.builder()
                .event("GAME_STARTED")
                .roomId(savedRoom.getId())
                .roomCode(savedRoom.getRoomCode())
                .startedByPlayerId(playerId)
                .build();

        messagingTemplate.convertAndSend(
                "/topic/room/" + savedRoom.getRoomCode(),
                event
        );

        return RoomMapper.toResponse(
                savedRoom,
                player,
                playerRepository.findByRoom(savedRoom).size()
        );
    }

    private String generateRoomCode() {

        String roomCode;

        do {
            roomCode = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 6)
                    .toUpperCase();

        } while (roomRepository.existsByRoomCode(roomCode));

        return roomCode;
    }

    private String generatePlayerCode() {

        String playerCode;

        do {
            playerCode = "P-" + UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 6)
                    .toUpperCase();

        } while (playerRepository.existsByPlayerCodeAndRoom(
                playerCode,
                null
        ));

        return playerCode;
    }

    private String findAvailableDinoColor(Room room) {

        String[] colors = {
                "GREEN",
                "BLUE",
                "RED",
                "YELLOW"
        };

        for (String color : colors) {

            if (!playerRepository.existsByRoomAndDinoColor(
                    room,
                    color
            )) {
                return color;
            }
        }

        throw new NoDinoColorAvailableException(
                "No Dino color available"
        );
    }
}