package com.dinoking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "players",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_player_code_room",
                        columnNames = {"player_code", "room_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String playerName;

    @Column(nullable = false, length = 50)
    private String playerCode;

    @Column(nullable = false, length = 20)
    private String dinoColor;

    @Column(nullable = false)
    @Builder.Default
    private Integer score = 0;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PLAYING";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}