// DietController.java
package com.health.controller;

import com.health.entity.DietRecord;
import com.health.service.DietRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diet")
public class DietController {

    @Autowired
    private DietRecordService dietRecordService;

    // 添加饮食记录
    @PostMapping("/add")
    public Map<String, Object> addDietRecord(@RequestBody DietRecord record) {
        Map<String, Object> result = new HashMap<>();
        boolean success = dietRecordService.addDietRecord(record);
        result.put("code", success ? 0 : -1);
        result.put("message", success ? "添加成功" : "添加失败");
        if (success) {
            result.put("data", record);
        }
        return result;
    }

    // 查询某天饮食记录
    @GetMapping("/list")
    public Map<String, Object> getDietRecords(@RequestParam Integer userId,
                                               @RequestParam String date) {
        Map<String, Object> result = new HashMap<>();
        LocalDate recordDate = LocalDate.parse(date);
        List<DietRecord> records = dietRecordService.getRecordsByDate(userId, recordDate);
        result.put("code", 0);
        result.put("data", records);
        return result;
    }

    // 查询某天总卡路里
    @GetMapping("/total")
    public Map<String, Object> getTotalCalories(@RequestParam Integer userId,
                                                 @RequestParam String date) {
        Map<String, Object> result = new HashMap<>();
        LocalDate recordDate = LocalDate.parse(date);
        int total = dietRecordService.getTotalCaloriesByDate(userId, recordDate);
        result.put("code", 0);
        result.put("data", total);
        return result;
    }
}