package com.phil.movieland.auth.jwt;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class SignUpWithRoleRequest extends SignUpRequest {
    @NotBlank
    @Size(min=4, max=40)
    private String roleName;

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName=roleName;
    }
}