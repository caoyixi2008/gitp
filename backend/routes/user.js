const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

/**
 * GET /api/user/profile
 * 获取当前登录用户的个人资料
 */
router.get('/profile', (req, res) => {
    try {
        const user = db.prepare(
            'SELECT id, username, nickname, age, gender, height, weight, created_at FROM users WHERE id = ?'
        ).get(req.userId);

        if (!user) {
            return res.json({ code: 404, message: '用户不存在', data: null });
        }

        res.json({ code: 200, message: '成功', data: user });
    } catch (err) {
        console.error('[获取资料错误]', err);
        res.json({ code: 500, message: '获取失败: ' + err.message, data: null });
    }
});

/**
 * PUT /api/user/profile
 * 更新个人资料（昵称、年龄、性别、身高、体重）
 * Body: { nickname?, age?, gender?, height?, weight? }
 */
router.put('/profile', (req, res) => {
    try {
        const { nickname, age, gender, height, weight } = req.body;

        db.prepare(
            'UPDATE users SET nickname = ?, age = ?, gender = ?, height = ?, weight = ? WHERE id = ?'
        ).run(nickname, age, gender, height, weight, req.userId);

        // 返回更新后的资料
        const updated = db.prepare(
            'SELECT id, username, nickname, age, gender, height, weight, created_at FROM users WHERE id = ?'
        ).get(req.userId);

        console.log(`[更新资料] 用户 id=${req.userId}`);
        res.json({ code: 200, message: '更新成功', data: updated });
    } catch (err) {
        console.error('[更新资料错误]', err);
        res.json({ code: 500, message: '更新失败: ' + err.message, data: null });
    }
});

/**
 * POST /api/user/weight
 * 记录体重数据
 * Body: { weight, date? }  date 格式 YYYY-MM-DD，默认为今天
 */
router.post('/weight', (req, res) => {
    try {
        const { weight, date } = req.body;

        if (!weight || weight <= 0) {
            return res.json({ code: 400, message: '请输入有效的体重数值', data: null });
        }

        const recordedAt = date || new Date().toISOString().split('T')[0];

        const result = db.prepare(
            'INSERT INTO weight_records (user_id, weight, recorded_at) VALUES (?, ?, ?)'
        ).run(req.userId, weight, recordedAt);

        // 同时更新用户表中的最新体重
        db.prepare('UPDATE users SET weight = ? WHERE id = ?').run(weight, req.userId);

        console.log(`[体重记录] 用户 id=${req.userId}, 体重=${weight}kg, 日期=${recordedAt}`);

        res.json({
            code: 200,
            message: '记录成功',
            data: { id: result.lastInsertRowid, weight, recorded_at: recordedAt }
        });
    } catch (err) {
        console.error('[体重记录错误]', err);
        res.json({ code: 500, message: '记录失败: ' + err.message, data: null });
    }
});

/**
 * GET /api/user/weight/history
 * 获取体重历史记录（最近30条，按日期降序）
 */
router.get('/weight/history', (req, res) => {
    try {
        const records = db.prepare(
            'SELECT id, weight, recorded_at FROM weight_records WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 30'
        ).all(req.userId);

        res.json({ code: 200, message: '成功', data: records });
    } catch (err) {
        console.error('[体重历史错误]', err);
        res.json({ code: 500, message: '获取失败: ' + err.message, data: null });
    }
});

/**
 * DELETE /api/user/weight/:id
 * 删除体重记录（归属校验）
 */
router.delete('/weight/:id', (req, res) => {
    try {
        const record = db.prepare(
            'SELECT * FROM weight_records WHERE id = ? AND user_id = ?'
        ).get(req.params.id, req.userId);

        if (!record) {
            return res.json({ code: 404, message: '记录不存在', data: null });
        }

        db.prepare('DELETE FROM weight_records WHERE id = ? AND user_id = ?')
            .run(req.params.id, req.userId);

        console.log(`[体重删除] 用户 id=${req.userId}, 记录 id=${req.params.id}`);
        res.json({ code: 200, message: '删除成功', data: null });
    } catch (err) {
        console.error('[体重删除错误]', err);
        res.json({ code: 500, message: '删除失败: ' + err.message, data: null });
    }
});

module.exports = router;
