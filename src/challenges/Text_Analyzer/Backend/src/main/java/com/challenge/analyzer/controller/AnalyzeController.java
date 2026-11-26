package com.challenge.analyzer.controller;

import com.challenge.analyzer.dto.AnalyzeRequest;
import com.challenge.analyzer.dto.AnalyzeResponse;
import com.challenge.analyzer.service.TextAnalyzer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analyze")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyzeController {

    @PostMapping
    public ResponseEntity<?> analyzeText(@RequestBody(required = false) AnalyzeRequest request) {
        if (request == null || request.text() == null || request.text().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Text is required"));
        }

        boolean ignoreStopWords = Boolean.TRUE.equals(request.ignoreStopWords());
        AnalyzeResponse response = TextAnalyzer.analyze(request.text(), ignoreStopWords);
        return ResponseEntity.ok(response);
    }
}