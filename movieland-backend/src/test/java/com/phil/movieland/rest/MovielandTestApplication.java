package com.phil.movieland.rest;

import com.phil.movieland.MovielandSpringApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;

@SpringBootApplication(exclude = {ThymeleafAutoConfiguration.class})
public class MovielandTestApplication {

  public static void main(String[] args) {
    SpringApplication.run(MovielandSpringApplication.class, args);
  }

}
