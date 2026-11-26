package com.challenge.analyzer.dto;

import java.util.List;

public record AnalyzeResponse(
        int characters,
        int words,
        int sentences,
        int uniqueWords,
        String longestWord,
        int readingTimeSeconds,
        List<WordCount> topWords
) {}