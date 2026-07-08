package com.health.mapper;
import com.health.entity.DietRecord;
import org.apache.ibatis.annotations.*;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface DietRecordMapper {

    // 添加饮食记录
    @Insert("INSERT INTO diet_record(user_id, food_name, calories, meal_type, record_date) " +
            "VALUES(#{userId}, #{foodName}, #{calories}, #{mealType}, #{recordDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(DietRecord record);

    // 查询用户某天的饮食记录
    @Select("SELECT * FROM diet_record WHERE user_id = #{userId} AND record_date = #{date}")
    List<DietRecord> findByUserIdAndDate(@Param("userId") Integer userId, @Param("date") LocalDate date);
    // 查询用户某段时间的饮食记录
    @Select("SELECT * FROM diet_record WHERE user_id = #{userId} AND record_date BETWEEN #{startDate} AND #{endDate}")
    List<DietRecord> findByUserIdAndDateRange(@Param("userId") Integer userId,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    // 计算某天总卡路里
    @Select("SELECT SUM(calories) FROM diet_record WHERE user_id = #{userId} AND record_date = #{date}")
    Integer getTotalCaloriesByDate(@Param("userId") Integer userId, @Param("date") LocalDate date);
}