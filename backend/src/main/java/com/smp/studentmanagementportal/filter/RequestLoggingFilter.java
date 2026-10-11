package com.smp.studentmanagementportal.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * High-observability HTTP Request/Response logging filter.
 * Injects correlation ID into MDC and logs execution timing for all REST endpoints.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {

    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    public static final String MDC_TRACE_KEY = "traceId";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        long startTime = System.currentTimeMillis();

        // Extract correlation ID from client or generate a new trace UUID
        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.trim().isEmpty()) {
            correlationId = "smp-" + UUID.randomUUID().toString().substring(0, 8);
        }

        // Put trace ID in MDC for SLF4J / Logback pattern injection
        MDC.put(MDC_TRACE_KEY, correlationId);
        response.setHeader(CORRELATION_ID_HEADER, correlationId);

        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String fullPath = (queryString != null) ? uri + "?" + queryString : uri;
        String clientIp = getClientIp(request);

        log.info("[HTTP INCOMING] [{}] {} {} from client IP: {}", correlationId, method, fullPath, clientIp);

        try {
            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            log.error("[HTTP ERROR] [{}] {} {} failed with exception: {}", correlationId, method, fullPath, ex.getMessage(), ex);
            throw ex;
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();

            if (status >= 400) {
                log.warn("[HTTP OUTGOING] [{}] {} {} finished with status {} in {} ms", correlationId, method, fullPath, status, duration);
            } else {
                log.info("[HTTP OUTGOING] [{}] {} {} finished with status {} in {} ms", correlationId, method, fullPath, status, duration);
            }

            MDC.remove(MDC_TRACE_KEY);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}

