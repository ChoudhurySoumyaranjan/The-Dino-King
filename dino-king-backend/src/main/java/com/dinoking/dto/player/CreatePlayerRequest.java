package com.dinoking.dto.player;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePlayerRequest {

    @NotBlank(message = "Player name is required")
    @Size(min = 2, max = 30, message = "Player name must be between 2 and 30 characters")
    private String playerName;
}