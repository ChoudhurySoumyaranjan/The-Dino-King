package com.dinoking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String roomCode;

    @Column(nullable = false, length = 50)
    private String roomName;

    @Column(nullable = false)
    private Long ownerPlayerId;

    @Column(nullable = false)
    @Builder.Default
    private Integer maxPlayers = 4;

    @Column(nullable = false)
    @Builder.Default
    private Boolean gameStarted = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}