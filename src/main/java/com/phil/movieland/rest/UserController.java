package com.phil.movieland.rest;

import com.phil.movieland.auth.jwt.entity.User;
import com.phil.movieland.auth.jwt.entity.UserPrincipal;
import com.phil.movieland.auth.jwt.entity.UserRepository;
import com.phil.movieland.auth.jwt.util.CurrentUser;
import com.phil.movieland.auth.jwt.util.ResourceNotFoundException;
import com.phil.movieland.data.UserProfile;
import com.phil.movieland.data.UserSummary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger=LoggerFactory.getLogger(UserController.class);

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        UserSummary userSummary=new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
        return userSummary;
    }

/*
    @GetMapping("/user/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/user/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }
*/
@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{username}")
    public UserProfile getUserProfile(@PathVariable(value="username") String username) {
        User user=userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    UserProfile userProfile=new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt());
        return userProfile;
    }

}