package com.example.waitlist_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class WaitlistRedisRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public void addUserToWaitlist(Long eventId, Long userId) {

        String key = "event:" + eventId + ":waitlist";

        redisTemplate.opsForList().rightPush(key, userId);
    }

    public Long getNextUser(Long eventId) {

        String key = "event:" + eventId + ":waitlist";

        Object user = redisTemplate.opsForList().leftPop(key);

        if (user == null) {
            return null;
        }

        return Long.valueOf(user.toString());
    }
}