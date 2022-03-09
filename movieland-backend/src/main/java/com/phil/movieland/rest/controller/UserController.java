package com.phil.movieland.rest.controller;

import com.phil.movieland.auth.jwt.entity.*;
import com.phil.movieland.auth.jwt.util.CurrentUser;
import com.phil.movieland.auth.jwt.util.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static com.phil.movieland.auth.jwt.entity.Role.RoleName.ROLE_ADMIN;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currUser) {
        UserSummary userSummary = new UserSummary(currUser.getId(), currUser.getUsername(), currUser.getName());
        log.info("Querying current User '{}'", currUser.getUsername());
        return userSummary;
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/me")
    ResponseEntity<?> updateUserMe(@CurrentUser UserPrincipal currUser, @RequestBody User user) {
        User beforeUser = fillUserUpdate(currUser.getId(), user);
        log.info("Updating current User '{}'", currUser.getUsername());
        userRepository.save(beforeUser);
        return ResponseEntity.ok().body("User updated");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    ResponseEntity<?> updateUser(@PathVariable long id, @RequestBody User user) {
        User beforeUser = fillUserUpdate(id, user);
        if (user.getRoles() != null) {
            beforeUser.setRoles(user.getRoles());
        }
        log.info("Updating User '{}'", user.getUsername());
        userRepository.save(beforeUser);
        return ResponseEntity.ok().body("User updated");
    }

    private User fillUserUpdate(@PathVariable long id, @RequestBody User user) {
        User beforeUser = userRepository.findById(id).orElse(new User());
        if (user.getPassword() != null) {
            beforeUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        if (user.getName() != null) {
            beforeUser.setName(user.getName());
        }
        if (user.getUsername() != null) {
            beforeUser.setUsername(user.getUsername());
        }
        if (user.getEmail() != null) {
            beforeUser.setEmail(user.getEmail());
        }
        return beforeUser;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<User> getAllUsers() {
        log.info("Querying all Users");
        return userRepository.findAll();

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<User> getUsersOfRoleUsers() {
        return getAllUserOfRole(Role.RoleName.ROLE_USER);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admins")
    public List<User> getUsersOfRoleAdmins() {
        log.info("Querying all Users with Role 'Admin'");
        Role role = roleRepository.findByName(ROLE_ADMIN).get();
        return userRepository.findAllByRolesContaining(role);
    }

    public List<Long> getAllUserIds() {
        log.info("Querying all User Ids");
        return userRepository.findAll().stream().map(User::getId).collect(Collectors.toList());
    }

    public List<User> getAllUserOfRole(Role.RoleName roleName) {
        log.info("Querying all Users with Role '{}'", roleName);
        Role role = roleRepository.findByName(roleName).get();
        return userRepository.findAllByRolesContaining(role).stream()
                .filter(user -> user.getRoles().size() == 1)
                .collect(Collectors.toList());
    }

    public List<Long> getAllUserIdsOfRole(Role.RoleName roleName) {
        log.info("Querying all User Ids by Role '{}'", roleName);
        return getAllUserOfRole(roleName).stream().map(User::getId).collect(Collectors.toList());
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
    @GetMapping("/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
        log.info("Querying UserProfile of User '{}'", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        UserProfile userProfile = new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt());
        return userProfile;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        log.info("Deleting User of by id='{}'", id);
        userRepository.deleteById(id);
        return ResponseEntity.ok("User (id:" + id + ") deleted");
    }

}