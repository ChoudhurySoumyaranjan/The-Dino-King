package com.dinoking.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRoomRequest {

    @NotBlank(message = "Room code is required")
    @Size(
            min = 6,
            max = 6,
            message = "Room code must be 6 characters"
    )
    private String roomCode;

    @NotBlank(message = "Player name is required")
    @Size(
            min = 2,
            max = 30,
            message = "Player name must be between 2 and 30 characters"
    )
    private String playerName;

    @NotBlank(message = "Player ID is required")
    @Size(
            min = 3,
            max = 50,
            message = "Player ID must be between 3 and 50 characters"
    )
    private String playerCode;

    @NotBlank(message = "Dino color is required")
    @Pattern(
            regexp = "GREEN|BLUE|RED|YELLOW",
            message = "Invalid Dino color"
    )
    private String dinoColor;
}