package com.health.mapper;
import com.health.entity.Notice;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NoticeMapper {

    // 插入提醒
    @Insert("INSERT INTO notice(user_id, title, content, notice_type) " +
            "VALUES(#{userId}, #{title}, #{content}, #{noticeType})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Notice notice);

    // 查询用户所有提醒
    @Select("SELECT * FROM notice WHERE user_id = #{userId} ORDER BY created_at DESC")
    List<Notice> findByUserId(Integer userId);
    // 查询用户未读提醒
    @Select("SELECT * FROM notice WHERE user_id = #{userId} AND is_read = 0 ORDER BY created_at DESC")
    List<Notice> findUnreadByUserId(Integer userId);

    // 标记为已读
    @Update("UPDATE notice SET is_read = 1 WHERE id = #{id} AND user_id = #{userId}")
    int markAsRead(@Param("id") Integer id, @Param("userId") Integer userId);
}