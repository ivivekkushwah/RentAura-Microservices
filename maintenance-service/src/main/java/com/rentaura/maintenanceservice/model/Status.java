package com.rentaura.maintenanceservice.model;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
    PENDING,
    REJECTED,
    IN_PROGRESS,
    RESOLVED;

    // ✅ Accept flexible input from frontend
    @JsonCreator
    public static Status from(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        String normalized = value
                .trim()
                .replace("-", "_")
                .toUpperCase();

        // ✅ alias support (frontend might send "completed")
        if (normalized.equals("COMPLETED")) {
            normalized = "RESOLVED";
        }

        return Status.valueOf(normalized);
    }

    // ✅ Control how enum is sent in API response
    @JsonValue
    public String toValue() {
        return name(); // returns IN_PROGRESS, RESOLVED, etc.
    }
}