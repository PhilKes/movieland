package com.phil.movieland;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication(exclude = {ThymeleafAutoConfiguration.class})
@EnableSwagger2
public class MovielandSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovielandSpringApplication.class, args);
    }

}
