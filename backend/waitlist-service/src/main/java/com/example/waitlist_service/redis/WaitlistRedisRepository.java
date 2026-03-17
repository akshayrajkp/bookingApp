package com.example.waitlist_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class WaitlistRedisRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    private String key(Long eventId) {
        return "event:" + eventId + ":waitlist";
    }

    // add user to end of queue
    public void addUserToWaitlist(Long eventId, Long userId) {
        redisTemplate.opsForList().rightPush(key(eventId), userId);
        System.out.println("Added user " + userId
                + " to waitlist for event " + eventId);
    }

    // get and remove first user from queue
    public Long getNextUser(Long eventId) {
        Object value = redisTemplate.opsForList().leftPop(key(eventId));
        if (value == null) return null;
        return Long.parseLong(value.toString());
    }

    // check how many users are waiting
    public Long getWaitlistSize(Long eventId) {
        return redisTemplate.opsForList().size(key(eventId));
    }
}