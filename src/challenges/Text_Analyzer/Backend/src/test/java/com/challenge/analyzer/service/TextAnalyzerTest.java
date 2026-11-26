package com.challenge.analyzer.service;

import com.challenge.analyzer.dto.AnalyzeResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TextAnalyzerTest {

    @Test
    void countsRepeatedWordsPunctuationAndSentences() {
        AnalyzeResponse result = TextAnalyzer.analyze("Hi! Hi? hi.");
        assertEquals(3, result.words());
        assertEquals(3, result.sentences());
        assertEquals(1, result.uniqueWords());
        assertEquals("hi", result.longestWord());
    }

    @Test
    void breaksTopWordTiesAlphabetically() {
        AnalyzeResponse result = TextAnalyzer.analyze("zebra apple banana apple zebra banana");
        assertEquals(3, result.topWords().size());
        assertEquals("apple", result.topWords().get(0).word());
        assertEquals("banana", result.topWords().get(1).word());
        assertEquals("zebra", result.topWords().get(2).word());
    }

    @Test
    void filtersStopWordsAndCalculatesReadingTime() {
        AnalyzeResponse result = TextAnalyzer.analyze("The react state is in the component.", true);
        assertEquals(7, result.words());
        assertEquals(3, result.readingTimeSeconds()); // ceil(7 / 200 * 60) = 3
        assertEquals("component", result.longestWord());
        assertFalse(result.topWords().stream().anyMatch(w -> w.word().equals("the")));
    }
}