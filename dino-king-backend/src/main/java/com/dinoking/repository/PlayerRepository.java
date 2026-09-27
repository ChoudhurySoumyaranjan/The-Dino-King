package com.dinoking.repository;

import com.dinoking.entity.Player;
import com.dinoking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByPlayerCodeAndRoom(
            String playerCode,
            Room room
    );

    List<Player> findByRoom(Room room);

    boolean existsByPlayerCodeAndRoom(
            String playerCode,
            Room room
    );

    boolean existsByRoomAndDinoColor(
            Room room,
            String dinoColor
    );
}