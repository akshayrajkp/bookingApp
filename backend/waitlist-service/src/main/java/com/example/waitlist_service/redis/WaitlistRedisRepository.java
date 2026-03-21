package com.example.waitlist_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class WaitlistRedisRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    private String key(Long eventId) {
        return "event:" + eventId + ":waitlist";
    }

    // add user to end of queue
    public void addUserToWaitlist(Long eventId, Long userId) {
        String redisKey = key(eventId);
        String userIdStr = userId.toString();

        redisTemplate.opsForList().rightPush(redisKey, userIdStr);

        // confirm what was written
        Long size = redisTemplate.opsForList().size(redisKey);
        List<Object> all = redisTemplate.opsForList().range(redisKey, 0, -1);

        System.out.println("Wrote to Redis key: " + redisKey);
        System.out.println("List size after write: " + size);
        System.out.println("List contents: " + all);
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

    public List<Object> getAllUsers(Long eventId) {
        return redisTemplate.opsForList().range(key(eventId), 0, -1);
    }
}