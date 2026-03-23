package com.example.notification_service.client;

import com.example.notification_service.dto.EventDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "event-service", path = "/events")
public interface EventServiceClient {

    @GetMapping("/{id}")
    EventDTO getEventById(@PathVariable("id") Long id);
}
