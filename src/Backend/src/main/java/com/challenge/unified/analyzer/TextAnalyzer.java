package com.challenge.unified.analyzer;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TextAnalyzer {

    private static final Pattern WORD_PATTERN = Pattern.compile("[a-zA-Z0-9]+(?:'[a-zA-Z0-9]+)?");
    private static final Pattern SENTENCE_END_PATTERN = Pattern.compile("[.!?]+");
    private static final Set<String> STOP_WORDS = Set.of(
            "a", "an", "and", "are", "as", "at", "be", "but", "by", "for",
            "if", "in", "into", "is", "it", "no", "not", "of", "on", "or",
            "such", "that", "the", "their", "then", "there", "these", "they",
            "this", "to", "was", "will", "with"
    );

    public static AnalyzeResponse analyze(String text, boolean ignoreStopWords) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text is required");
        }

        int characters = text.length();
        List<String> extractedWords = new ArrayList<>();
        Matcher wordMatcher = WORD_PATTERN.matcher(text.toLowerCase());
        while (wordMatcher.find()) {
            extractedWords.add(wordMatcher.group());
        }

        int totalWords = extractedWords.size();
        int sentences = 0;
        Matcher sentenceMatcher = SENTENCE_END_PATTERN.matcher(text);
        while (sentenceMatcher.find()) {
            sentences++;
        }

        Map<String, Long> frequencyMap = new HashMap<>();
        String longestWord = "";
        for (String w : extractedWords) {
            frequencyMap.merge(w, 1L, Long::sum);
            if (w.length() > longestWord.length()) {
                longestWord = w;
            }
        }

        int readingTimeSeconds = totalWords == 0 ? 0 : (int) Math.ceil((totalWords / 200.0) * 60.0);
        List<WordCount> topWords = frequencyMap.entrySet().stream()
                .filter(e -> !ignoreStopWords || !STOP_WORDS.contains(e.getKey()))
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder())
                        .thenComparing(Map.Entry.comparingByKey()))
                .limit(5)
                .map(e -> new WordCount(e.getKey(), e.getValue()))
                .toList();

        return new AnalyzeResponse(characters, totalWords, sentences, frequencyMap.size(), longestWord, readingTimeSeconds, topWords);
    }
}
