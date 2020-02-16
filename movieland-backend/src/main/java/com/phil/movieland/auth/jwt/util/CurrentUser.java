package com.phil.movieland.auth.jwt.util;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.lang.annotation.*;

//Get Currenuser from JWT Token
@Target({ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal
public @interface CurrentUser {

}