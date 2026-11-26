package com.challenge.unified.signup;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class UserStore {
    private static final Set<String> REGISTERED_EMAILS = ConcurrentHashMap.newKeySet();

    public static boolean exists(String email) {
        return REGISTERED_EMAILS.contains(email.toLowerCase().trim());
    }

    public static void save(String email) {
        REGISTERED_EMAILS.add(email.toLowerCase().trim());
    }
}
