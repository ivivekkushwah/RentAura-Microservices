package com.rentaura.authservice.service;

import com.rentaura.authservice.model.User;
import com.rentaura.authservice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo repo;

    // ✅ Toggle roommate status
    @Override
    public Object toggleRoommate(String email) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean newStatus = !user.isLookingForRoommate();

        user.setLookingForRoommate(newStatus);

        repo.save(user);

        return Map.of(
                "lookingForRoommate", newStatus
        );
    }

    // ✅ Get all users looking for roommate
    @Override
    public Object getRoommates() {

        List<User> users = repo.findByLookingForRoommateTrue();

        // 🔥 return only required data (not password!)
        return users.stream().map(user -> Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "phone", user.getPhone(),
                "city", user.getCity(),
                "avatar", user.getAvatar()
        )).toList();
    }
}