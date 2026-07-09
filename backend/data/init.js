const { db } = require('../config/database');

/**
 * 初始化数据库表结构并插入预置数据
 * 成员3负责：users 表、goals 表、weight_records 表
 * 同时预置 activity_types 和 food_library 供成员4使用
 */
function initDatabase() {
    console.log('[数据库] 开始初始化表结构...');

    // ==================== 建表 ====================
    db.exec(`
        -- 用户信息表（成员3）
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(128) NOT NULL,
            nickname VARCHAR(50),
            age INTEGER,
            gender VARCHAR(4),
            height REAL,
            weight REAL,
            created_at DATETIME DEFAULT (datetime('now','localtime'))
        );

        -- 健康目标表（成员3）
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title VARCHAR(100) NOT NULL,
            goal_type VARCHAR(20) NOT NULL,
            target_value REAL,
            current_value REAL DEFAULT 0,
            unit VARCHAR(20),
            start_date DATE,
            end_date DATE,
            status VARCHAR(10) DEFAULT '进行中',
            created_at DATETIME DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        -- 体重记录表（成员3）
        CREATE TABLE IF NOT EXISTS weight_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            weight REAL NOT NULL,
            recorded_at DATE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        -- ========== 以下为成员4模块的基础表 ==========

        -- 运动类型表（成员4-曹祎茜）
        CREATE TABLE IF NOT EXISTS activity_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50) NOT NULL,
            calories_per_minute REAL,
            category VARCHAR(20)
        );

        -- 运动记录表（成员4-曹祎茜）
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            activity_type_id INTEGER NOT NULL,
            duration_minutes INTEGER,
            distance_km REAL,
            calories_burned REAL,
            notes VARCHAR(200),
            recorded_at DATE NOT NULL,
            created_at DATETIME DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (activity_type_id) REFERENCES activity_types(id)
        );

        -- 食物库表（成员4-曹祎茜）
        CREATE TABLE IF NOT EXISTS food_library (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50) NOT NULL,
            calories_per_100g REAL,
            protein_per_100g REAL,
            fat_per_100g REAL,
            carbs_per_100g REAL,
            category VARCHAR(20)
        );

        -- 饮食记录表（成员4-曹祎茜）
        CREATE TABLE IF NOT EXISTS diet_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            food_id INTEGER NOT NULL,
            amount_g REAL,
            meal_type VARCHAR(10),
            calories REAL,
            recorded_at DATE NOT NULL,
            created_at DATETIME DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (food_id) REFERENCES food_library(id)
        );

        -- 健康建议表（成员4-曹祎茜）
        CREATE TABLE IF NOT EXISTS health_suggestions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            content VARCHAR(500) NOT NULL,
            suggestion_type VARCHAR(10),
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        -- 提醒表（成员4-曹祎茜）
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title VARCHAR(100) NOT NULL,
            reminder_time VARCHAR(5),
            days_of_week VARCHAR(20),
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);

    console.log('[数据库] 表结构检查完成');

    // ==================== 种子数据 ====================

    // 插入预置活动类型（避免重复）
    const typeCount = db.prepare('SELECT COUNT(*) AS cnt FROM activity_types').get();
    if (!typeCount || typeCount.cnt === 0) {
        const activities = [
            ['跑步', 10.0, '有氧运动'],
            ['快走', 5.0, '有氧运动'],
            ['游泳', 8.0, '有氧运动'],
            ['骑行', 7.0, '有氧运动'],
            ['跳绳', 11.0, '有氧运动'],
            ['瑜伽', 3.0, '柔韧训练'],
            ['力量训练', 6.0, '力量训练'],
            ['篮球', 9.0, '有氧运动'],
            ['健身操', 6.0, '有氧运动'],
            ['爬山', 8.0, '有氧运动'],
        ];
        for (const a of activities) {
            db.prepare(
                'INSERT INTO activity_types (name, calories_per_minute, category) VALUES (?, ?, ?)'
            ).run(...a);
        }
        console.log('[数据库] 已插入 10 条活动类型预置数据');
    }

    // 插入预置食物库
    const foodCount = db.prepare('SELECT COUNT(*) AS cnt FROM food_library').get();
    if (!foodCount || foodCount.cnt === 0) {
        const foods = [
            ['白米饭', 116, 2.6, 0.3, 25.9, '主食'],
            ['馒头', 223, 7.0, 1.1, 44.2, '主食'],
            ['面条', 110, 3.5, 0.5, 22.0, '主食'],
            ['全麦面包', 246, 8.5, 3.4, 46.0, '主食'],
            ['鸡胸肉', 133, 31.0, 1.2, 0.0, '肉类'],
            ['猪肉', 395, 13.2, 37.0, 2.4, '肉类'],
            ['牛肉', 125, 20.2, 4.2, 0.2, '肉类'],
            ['鸡蛋', 144, 13.3, 8.8, 2.8, '肉类'],
            ['西兰花', 34, 2.8, 0.4, 6.6, '蔬菜'],
            ['番茄', 18, 0.9, 0.2, 3.9, '蔬菜'],
            ['黄瓜', 15, 0.7, 0.1, 2.9, '蔬菜'],
            ['菠菜', 23, 2.9, 0.4, 3.6, '蔬菜'],
            ['苹果', 52, 0.3, 0.2, 13.8, '水果'],
            ['香蕉', 91, 1.1, 0.3, 22.8, '水果'],
            ['橙子', 47, 0.9, 0.1, 11.8, '水果'],
            ['葡萄', 67, 0.7, 0.2, 17.2, '水果'],
            ['薯片', 536, 5.0, 34.0, 53.0, '零食'],
            ['巧克力', 546, 5.0, 31.0, 59.0, '零食'],
            ['饼干', 433, 6.0, 14.0, 71.0, '零食'],
            ['牛奶', 54, 3.0, 3.2, 3.4, '饮品'],
            ['豆浆', 31, 3.0, 1.6, 1.2, '饮品'],
            ['可乐', 42, 0.0, 0.0, 10.6, '饮品'],
            ['橙汁', 45, 0.7, 0.2, 10.4, '饮品'],
        ];
        for (const f of foods) {
            db.prepare(
                'INSERT INTO food_library (name, calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g, category) VALUES (?, ?, ?, ?, ?, ?)'
            ).run(...f);
        }
        console.log('[数据库] 已插入 23 条食物库预置数据');
    }

    console.log('[数据库] 初始化完成');
}

module.exports = { initDatabase };
