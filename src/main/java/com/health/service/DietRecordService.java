
package com.health.service;

import com.health.entity.DietRecord;
import com.health.mapper.DietRecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DietRecordService {

    @Autowired
    private DietRecordMapper dietRecordMapper;

    // 添加饮食记录
    public boolean addDietRecord(DietRecord record) {
        return dietRecordMapper.insert(record) > 0;
    }

    // 查询某天的饮食记录
    public List<DietRecord> getRecordsByDate(Integer userId, LocalDate date) {
        return dietRecordMapper.findByUserIdAndDate(userId, date);
    }

    // 查询某段时间的饮食记录（报表用）
    public List<DietRecord> getRecordsByDateRange(Integer userId, LocalDate startDate, LocalDate endDate) {
        return dietRecordMapper.findByUserIdAndDateRange(userId, startDate, endDate);
    }

    // 计算某天总卡路里
    public int getTotalCaloriesByDate(Integer userId, LocalDate date) {
        Integer total = dietRecordMapper.getTotalCaloriesByDate(userId, date);
        return total != null ? total : 0;
    }
}