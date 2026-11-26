package com.challenge.analyzer.dto;

public record AnalyzeRequest(String text, Boolean ignoreStopWords) {}