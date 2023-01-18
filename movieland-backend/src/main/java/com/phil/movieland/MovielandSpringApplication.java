package com.phil.movieland;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = {ThymeleafAutoConfiguration.class})
@EnableJpaRepositories
@OpenAPIDefinition(info=@Info(title="MovieLand REST API"))
public class MovielandSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovielandSpringApplication.class, args);
    }

}
