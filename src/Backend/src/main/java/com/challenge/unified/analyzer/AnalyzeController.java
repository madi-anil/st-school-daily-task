package com.challenge.unified.analyzer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analyze")
public class AnalyzeController {

    @PostMapping
    public ResponseEntity<?> analyzeText(@RequestBody(required = false) AnalyzeRequest request) {
        if (request == null || request.text() == null || request.text().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Text is required"));
        }
        boolean ignoreStopWords = Boolean.TRUE.equals(request.ignoreStopWords());
        return ResponseEntity.ok(TextAnalyzer.analyze(request.text(), ignoreStopWords));
    }
}
