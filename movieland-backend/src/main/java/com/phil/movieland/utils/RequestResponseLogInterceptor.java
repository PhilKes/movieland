package com.phil.movieland.utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor to log every REST Api request-response
 */
@Component
public class RequestResponseLogInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Logger log = LoggerFactory.getLogger(((HandlerMethod) handler).getBeanType());

        if (request.getQueryString() != null)
            log.info("Request: {} '{}', query: {}, client: {}", request.getMethod(), request.getRequestURI(), request.getQueryString(), request.getRemoteHost());
        else
            log.info("Request: {} '{}'", request.getMethod(), request.getRequestURI());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        Logger log = LoggerFactory.getLogger(((HandlerMethod) handler).getBeanType());
        log.info("Response: Code {} to '{}', type: {}", response.getStatus(), request.getRequestURI(), response.getContentType());
    }
}
