package com.dinoking.dto.player;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PlayerResponse {

    private Long id;

    private String playerName;

    private String playerCode;

    private String dinoColor;

    private Integer score;

    private String status;

    private Long roomId;
}