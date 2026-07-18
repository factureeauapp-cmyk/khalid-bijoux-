package com.khalidbijoux.api.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public Map<String, Object> test() {
        return Map.of(
                "status", "OK",
                "message", "Backend is running"
        );
    }
}