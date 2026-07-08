package com.health.mapper;
import com.health.entity.SportRecord;
import org.apache.ibatis.annotations.*;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface SportRecordMapper {

    // 添加运动记录
    @Insert("INSERT INTO sport_record(user_id, sport_type, duration, calories, record_date) " +
            "VALUES(#{userId}, #{sportType}, #{duration}, #{calories}, #{recordDate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SportRecord record);
  // 查询用户某天的运动记录
    @Select("SELECT * FROM sport_record WHERE user_id = #{userId} AND record_date = #{date}")
    List<SportRecord> findByUserIdAndDate(@Param("userId") Integer userId, @Param("date") LocalDate date);

    // 查询用户某段时间的运动记录（用于报表）
    @Select("SELECT * FROM sport_record WHERE user_id = #{userId} AND record_date BETWEEN #{startDate} AND #{endDate}")
    List<SportRecord> findByUserIdAndDateRange(@Param("userId") Integer userId,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);

    // 删除运动记录
    @Delete("DELETE FROM sport_record WHERE id = #{id} AND user_id = #{userId}")
    int deleteById(@Param("id") Integer id, @Param("userId") Integer userId);
}