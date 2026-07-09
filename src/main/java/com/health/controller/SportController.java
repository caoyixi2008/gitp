// SportController.java
package com.health.controller;

import com.health.entity.SportRecord;
import com.health.service.SportRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sport")
public class SportController {

    @Autowired
    private SportRecordService sportRecordService;

    // 添加运动记录
    @PostMapping("/add")
    public Map<String, Object> addSportRecord(@RequestBody SportRecord record) {
        Map<String, Object> result = new HashMap<>();
        boolean success = sportRecordService.addSportRecord(record);
        result.put("code", success ? 0 : -1);
        result.put("message", success ? "添加成功" : "添加失败");
        if (success) {
            result.put("data", record);
        }
        return result;
    }

    // 查询某天运动记录
    @GetMapping("/list")
    public Map<String, Object> getSportRecords(@RequestParam Integer userId,
                                                @RequestParam String date) {
        Map<String, Object> result = new HashMap<>();
        LocalDate recordDate = LocalDate.parse(date);
        List<SportRecord> records = sportRecordService.getRecordsByDate(userId, recordDate);
        result.put("code", 0);
        result.put("data", records);
        return result;
    }

    // 删除运动记录
    @DeleteMapping("/delete")
    public Map<String, Object> deleteSportRecord(@RequestParam Integer id,
                                                  @RequestParam Integer userId) {
        Map<String, Object> result = new HashMap<>();
        boolean success = sportRecordService.deleteRecord(id, userId);
        result.put("code", success ? 0 : -1);
        result.put("message", success ? "删除成功" : "删除失败");
        return result;
    }
}