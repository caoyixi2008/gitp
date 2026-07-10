package com.health.mapper;

import com.health.entity.Notice;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NoticeMapper {

    @Insert("INSERT INTO notice(user_id, title, content, notice_type) " +
            "VALUES(#{userId}, #{title}, #{content}, #{noticeType})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Notice notice);

    @Select("SELECT * FROM notice WHERE user_id = #{userId} ORDER BY created_at DESC")
    List<Notice> findByUserId(Integer userId);

    @Select("SELECT * FROM notice WHERE user_id = #{userId} AND is_read = 0 ORDER BY created_at DESC")
    List<Notice> findUnreadByUserId(Integer userId);

    @Update("UPDATE notice SET is_read = 1 WHERE id = #{id} AND user_id = #{userId}")
    int markAsRead(@Param("id") Integer id, @Param("userId") Integer userId);

    @Delete("DELETE FROM notice WHERE id = #{id} AND user_id = #{userId}")
    int deleteById(@Param("id") Integer id, @Param("userId") Integer userId);
}
