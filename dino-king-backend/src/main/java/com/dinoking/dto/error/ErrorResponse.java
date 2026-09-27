package com.dinoking.dto.error;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ErrorResponse {

    private String message;

    private int status;

    private String path;

    private LocalDateTime timestamp;
}