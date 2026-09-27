package com.dinoking.handler;

import com.dinoking.dto.error.ErrorResponse;
import com.dinoking.exception.NoDinoColorAvailableException;
import com.dinoking.exception.ResourceNotFoundException;
import com.dinoking.exception.RoomFullException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException exception,
            HttpServletRequest request) {

        ErrorResponse response = ErrorResponse.builder()
                .message(exception.getMessage())
                .status(HttpStatus.NOT_FOUND.value())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {

        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Invalid request");

        ErrorResponse response = ErrorResponse.builder()
                .message(message)
                .status(HttpStatus.BAD_REQUEST.value())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(RoomFullException.class)
    public ResponseEntity<ErrorResponse> handleRoomFullException(
            RoomFullException exception,
            HttpServletRequest request) {

        ErrorResponse response = ErrorResponse.builder()
                .message(exception.getMessage())
                .status(HttpStatus.CONFLICT.value())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(NoDinoColorAvailableException.class)
    public ResponseEntity<ErrorResponse> handleNoDinoColorAvailableException(
            NoDinoColorAvailableException exception,
            HttpServletRequest request) {

        ErrorResponse response = ErrorResponse.builder()
                .message(exception.getMessage())
                .status(HttpStatus.CONFLICT.value())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalStateException(
            IllegalStateException exception,
            HttpServletRequest request) {

        ErrorResponse response = ErrorResponse.builder()
                .message(exception.getMessage())
                .status(HttpStatus.CONFLICT.value())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }
}