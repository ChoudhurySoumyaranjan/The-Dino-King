package com.dinoking.dto.room;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StartGameRequest {

    @NotNull(message = "Player ID is required")
    private Long playerId;
}