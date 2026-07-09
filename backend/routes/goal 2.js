const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

/**
 * POST /api/goal
 * 创建健康目标
 * Body: { title, goalType, targetValue, unit, startDate, endDate }
 * goalType: "体重" | "运动" | "饮食" 等
 */
router.post('/', (req, res) => {
    try {
        const { title, goalType, targetValue, unit, startDate, endDate } = req.body;

        // 参数校验
        if (!title || !goalType || !targetValue || !unit) {
            return res.json({ code: 400, message: '请填写完整的目标信息（标题、类型、目标值、单位）', data: null });
        }

        const result = db.prepare(
            'INSERT INTO goals (user_id, title, goal_type, target_value, current_value, unit, start_date, end_date) VALUES (?, ?, ?, ?, 0, ?, ?, ?)'
        ).run(req.userId, title, goalType, targetValue, unit, startDate || null, endDate || null);

        console.log(`[创建目标] 用户 id=${req.userId}, 目标="${title}", 目标值=${targetValue}${unit}`);

        res.json({
            code: 200,
            message: '创建成功',
            data: {
                id: result.lastInsertRowid,
                title,
                goalType,
                targetValue,
                currentValue: 0,
                unit,
                startDate,
                endDate,
                status: '进行中'
            }
        });
    } catch (err) {
        console.error('[创建目标错误]', err);
        res.json({ code: 500, message: '创建失败: ' + err.message, data: null });
    }
});

/**
 * GET /api/goal/list
 * 获取用户所有目标列表（进行中优先，然后按创建时间降序）
 */
router.get('/list', (req, res) => {
    try {
        const goals = db.prepare(
            'SELECT * FROM goals WHERE user_id = ? ORDER BY status ASC, created_at DESC'
        ).all(req.userId);

        // 为每个目标计算完成百分比
        const goalsWithProgress = goals.map(goal => ({
            ...goal,
            progressPercent: goal.target_value > 0
                ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
                : 0
        }));

        res.json({ code: 200, message: '成功', data: goalsWithProgress });
    } catch (err) {
        console.error('[获取目标列表错误]', err);
        res.json({ code: 500, message: '获取失败: ' + err.message, data: null });
    }
});

/**
 * PUT /api/goal/:id/progress
 * 更新目标进度（currentValue）
 * Body: { currentValue }
 * 自动判定：当 currentValue >= targetValue 时自动标记为"已完成"
 */
router.put('/:id/progress', (req, res) => {
    try {
        const { currentValue } = req.body;
        const goalId = req.params.id;

        if (currentValue === undefined || currentValue === null) {
            return res.json({ code: 400, message: '请提供当前进度值', data: null });
        }

        // 归属校验：确保目标属于当前用户
        const goal = db.prepare(
            'SELECT * FROM goals WHERE id = ? AND user_id = ?'
        ).get(goalId, req.userId);

        if (!goal) {
            return res.json({ code: 404, message: '目标不存在', data: null });
        }

        // 更新 current_value
        db.prepare('UPDATE goals SET current_value = ? WHERE id = ?').run(currentValue, goalId);

        // 自动判断是否达成目标
        if (currentValue >= goal.target_value && goal.status === '进行中') {
            db.prepare('UPDATE goals SET status = ? WHERE id = ?').run('已完成', goalId);
            console.log(`[目标完成] 用户 id=${req.userId}, 目标="${goal.title}" 已达成！`);
        }

        const updated = db.prepare('SELECT * FROM goals WHERE id = ?').get(goalId);
        updated.progressPercent = updated.target_value > 0
            ? Math.min(100, Math.round((updated.current_value / updated.target_value) * 100))
            : 0;

        res.json({ code: 200, message: '进度更新成功', data: updated });
    } catch (err) {
        console.error('[更新进度错误]', err);
        res.json({ code: 500, message: '更新失败: ' + err.message, data: null });
    }
});

/**
 * PUT /api/goal/:id/status
 * 手动更新目标状态
 * Body: { status }  status: "进行中" | "已完成" | "已放弃"
 */
router.put('/:id/status', (req, res) => {
    try {
        const { status } = req.body;
        const goalId = req.params.id;

        const validStatuses = ['进行中', '已完成', '已放弃'];
        if (!validStatuses.includes(status)) {
            return res.json({ code: 400, message: '无效的状态值，允许：进行中、已完成、已放弃', data: null });
        }

        // 归属校验
        const goal = db.prepare(
            'SELECT * FROM goals WHERE id = ? AND user_id = ?'
        ).get(goalId, req.userId);

        if (!goal) {
            return res.json({ code: 404, message: '目标不存在', data: null });
        }

        db.prepare('UPDATE goals SET status = ? WHERE id = ?').run(status, goalId);

        console.log(`[目标状态] 用户 id=${req.userId}, 目标="${goal.title}" → ${status}`);

        const updated = db.prepare('SELECT * FROM goals WHERE id = ?').get(goalId);
        updated.progressPercent = updated.target_value > 0
            ? Math.min(100, Math.round((updated.current_value / updated.target_value) * 100))
            : 0;

        res.json({ code: 200, message: '状态更新成功', data: updated });
    } catch (err) {
        console.error('[更新状态错误]', err);
        res.json({ code: 500, message: '更新失败: ' + err.message, data: null });
    }
});

/**
 * DELETE /api/goal/:id
 * 删除目标（归属校验）
 */
router.delete('/:id', (req, res) => {
    try {
        const goalId = req.params.id;

        // 归属校验
        const goal = db.prepare(
            'SELECT * FROM goals WHERE id = ? AND user_id = ?'
        ).get(goalId, req.userId);

        if (!goal) {
            return res.json({ code: 404, message: '目标不存在', data: null });
        }

        db.prepare('DELETE FROM goals WHERE id = ? AND user_id = ?').run(goalId, req.userId);

        console.log(`[删除目标] 用户 id=${req.userId}, 目标="${goal.title}"`);

        res.json({ code: 200, message: '删除成功', data: null });
    } catch (err) {
        console.error('[删除目标错误]', err);
        res.json({ code: 500, message: '删除失败: ' + err.message, data: null });
    }
});

module.exports = router;
