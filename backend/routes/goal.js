const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

/**
 * GET /api/goal/list
 * 获取用户所有目标（动态计算状态）
 */
router.get('/list', (req, res) => {
    try {
        const goals = db.prepare(
            'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC'
        ).all(req.userId);

        const today = new Date().toISOString().split('T')[0];

        const goalsWithProgress = goals.map(goal => {
            // 动态计算状态
            let status = '进行中'
            if (goal.end_date && goal.end_date < today) {
                status = '已过期'
            } else if (goal.start_date && goal.start_date > today) {
                status = '未开始'
            }

            return {
                ...goal,
                status: status,
                progressPercent: goal.target_value > 0
                    ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
                    : 0
            }
        });

        res.json({ code: 200, message: '成功', data: goalsWithProgress });
    } catch (err) {
        console.error('[获取目标列表错误]', err);
        res.json({ code: 500, message: '获取失败: ' + err.message, data: null });
    }
});

/**
 * POST /api/goal
 * 创建目标
 */
router.post('/', (req, res) => {
    try {
        const { title, goalType, targetValue, unit, startDate, endDate } = req.body;

        if (!title || !goalType || !targetValue || !unit) {
            return res.json({ code: 400, message: '请填写完整的目标信息', data: null });
        }

        const result = db.prepare(
            'INSERT INTO goals (user_id, title, goal_type, target_value, current_value, unit, start_date, end_date, status) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)'
        ).run(req.userId, title, goalType, targetValue, unit, startDate || null, endDate || null, '进行中');

        res.json({
            code: 200,
            message: '创建成功',
            data: { id: result.lastInsertRowid }
        });
    } catch (err) {
        console.error('[创建目标错误]', err);
        res.json({ code: 500, message: '创建失败: ' + err.message, data: null });
    }
});

/**
 * PUT /api/goal/:id/progress
 * 更新目标进度
 */
router.put('/:id/progress', (req, res) => {
    try {
        const { currentValue } = req.body;
        const goalId = req.params.id;

        db.prepare(
            'UPDATE goals SET current_value = ? WHERE id = ? AND user_id = ?'
        ).run(currentValue, goalId, req.userId);

        res.json({ code: 200, message: '进度更新成功' });
    } catch (err) {
        console.error('[更新进度错误]', err);
        res.json({ code: 500, message: '更新失败: ' + err.message, data: null });
    }
});

/**
 * DELETE /api/goal/:id
 * 删除目标
 */
router.delete('/:id', (req, res) => {
    try {
        const goalId = req.params.id;
        db.prepare('DELETE FROM goals WHERE id = ? AND user_id = ?').run(goalId, req.userId);
        res.json({ code: 200, message: '删除成功' });
    } catch (err) {
        console.error('[删除目标错误]', err);
        res.json({ code: 500, message: '删除失败: ' + err.message, data: null });
    }
});

module.exports = router;
