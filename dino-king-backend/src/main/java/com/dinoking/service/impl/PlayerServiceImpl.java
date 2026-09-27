package com.dinoking.service.impl;

import com.dinoking.dto.player.CreatePlayerRequest;
import com.dinoking.dto.player.PlayerResponse;
import com.dinoking.entity.Player;
import com.dinoking.entity.Room;
import com.dinoking.exception.NoDinoColorAvailableException;
import com.dinoking.exception.ResourceNotFoundException;
import com.dinoking.exception.RoomFullException;
import com.dinoking.mapper.PlayerMapper;
import com.dinoking.repository.PlayerRepository;
import com.dinoking.repository.RoomRepository;
import com.dinoking.service.PlayerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private final RoomRepository roomRepository;

    @Transactional
    @Override
    public PlayerResponse createPlayer(
            CreatePlayerRequest request,
            Long roomId
    ) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found")
                );

        long playerCount =
                playerRepository.findByRoom(room).size();

        if (playerCount >= room.getMaxPlayers()) {
            throw new RoomFullException("Room is full");
        }

        String playerCode = generatePlayerCode(room);
        String dinoColor = findAvailableDinoColor(room);

        Player player = Player.builder()
                .playerName(request.getPlayerName())
                .playerCode(playerCode)
                .dinoColor(dinoColor)
                .score(0)
                .status("PLAYING")
                .room(room)
                .build();

        Player savedPlayer =
                playerRepository.save(player);

        return PlayerMapper.toResponse(savedPlayer);
    }

    private String generatePlayerCode(Room room) {

        String playerCode;

        do {
            playerCode = "P-" + UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 6)
                    .toUpperCase();

        } while (playerRepository.existsByPlayerCodeAndRoom(
                playerCode,
                room
        ));

        return playerCode;
    }

    private String findAvailableDinoColor(Room room) {

        List<String> colors = List.of(
                "GREEN",
                "BLUE",
                "RED",
                "YELLOW"
        );

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

    @Transactional
    @Override
    public void markPlayerDead(
            Long playerId,
            Integer score
    ) {

        Player player =
                playerRepository.findById(playerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Player not found"
                                )
                        );

        player.setScore(score);
        player.setStatus("DEAD");

        playerRepository.save(player);
    }

    @Transactional
    @Override
    public void updatePlayerScore(
            Long playerId,
            Integer score
    ) {

        Player player =
                playerRepository.findById(playerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Player not found"
                                )
                        );

        // Do not update the score of a dead player.
        if ("DEAD".equals(player.getStatus())) {
            return;
        }

        player.setScore(score);

        playerRepository.save(player);
    }
}