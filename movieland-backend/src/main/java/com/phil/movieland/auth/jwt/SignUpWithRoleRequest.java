package com.phil.movieland.auth.jwt;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class SignUpWithRoleRequest extends SignUpRequest {
    @NotBlank
    @Size(min=4, max=40)
    private String roleName;

    public SignUpWithRoleRequest(String name, String username, String email, String password) {
        super(name, username, email, password);
    }

    public SignUpWithRoleRequest(String name, String username, String email, String password, String roleName) {
        super(name, username, email, password);
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName=roleName;
    }
}