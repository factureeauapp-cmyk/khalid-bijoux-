package com.khalidbijoux.api.shared;

import com.khalidbijoux.api.catalog.ProductNotFoundException;
import com.khalidbijoux.api.order.OrderNotFoundException;
import com.khalidbijoux.api.order.OrderStatusException;
import com.khalidbijoux.api.security.AuthenticationException;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticationException(AuthenticationException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiErrorResponse(
                        OffsetDateTime.now(),
                        HttpStatus.UNAUTHORIZED.value(),
                        exception.getErrorCode(),
                        List.of(exception.getMessage())
                ));
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleProductNotFound(ProductNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiErrorResponse(
                        OffsetDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "PRODUCT_NOT_FOUND",
                        List.of(exception.getMessage())
                ));
    }

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleOrderNotFound(OrderNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiErrorResponse(
                        OffsetDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "ORDER_NOT_FOUND",
                        List.of(exception.getMessage())
                ));
    }

    @ExceptionHandler(OrderStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleOrderStatusException(OrderStatusException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiErrorResponse(
                        OffsetDateTime.now(),
                        HttpStatus.CONFLICT.value(),
                        "ORDER_STATUS_ERROR",
                        List.of(exception.getMessage())
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        List<String> details = exception.getBindingResult()
                .getAllErrors()
                .stream()
                .map(error -> error instanceof FieldError fieldError
                        ? fieldError.getField() + ": " + fieldError.getDefaultMessage()
                        : error.getDefaultMessage())
                .toList();

        return ResponseEntity.badRequest()
                .body(new ApiErrorResponse(
                        OffsetDateTime.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        "VALIDATION_ERROR",
                        details
                ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.badRequest()
                .body(new ApiErrorResponse(
                        OffsetDateTime.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        "INVALID_REQUEST",
                        List.of(exception.getMessage())
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorResponse(
                        OffsetDateTime.now(),
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "INTERNAL_SERVER_ERROR",
                        List.of("An unexpected error occurred")
                ));
    }
}

