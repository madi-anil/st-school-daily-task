package com.challenge.backend.model;

public class User {
    private Long id;
    private String name;
    private String email;
    private String passwordHash;
    private Integer age;

    public User(Long id, String name, String email, String passwordHash, Integer age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.age = age;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public Integer getAge() { return age; }
}