const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const { generateToken } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * 用户注册
 * Body: { username, password, nickname?, age?, gender?, height?, weight? }
 */
router.post('/register', (req, res) => {
    try {
        const { username, password, nickname, age, gender, height, weight } = req.body;

        // 参数校验
        if (!username || !password) {
            return res.json({ code: 400, message: '用户名和密码不能为空', data: null });
        }
        if (username.length < 3 || username.length > 50) {
            return res.json({ code: 400, message: '用户名长度应为3-50个字符', data: null });
        }
        if (password.length < 6) {
            return res.json({ code: 400, message: '密码长度不能少于6位', data: null });
        }

        // 检查用户名是否已存在
        const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existing) {
            return res.json({ code: 400, message: '用户名已存在', data: null });
        }

        // bcrypt 加密密码（10轮盐）
        const passwordHash = bcrypt.hashSync(password, 10);

        // 插入用户
        const result = db.prepare(
            'INSERT INTO users (username, password_hash, nickname, age, gender, height, weight) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).run(
            username,
            passwordHash,
            nickname || username,  // 未填昵称默认用用户名
            age || null,
            gender || null,
            height || null,
            weight || null
        );

        const userId = result.lastInsertRowid;
        const token = generateToken(userId, username);

        console.log(`[注册] 新用户: ${username} (id=${userId})`);

        res.json({
            code: 200,
            message: '注册成功',
            data: {
                token,
                user: { id: userId, username, nickname: nickname || username }
            }
        });
    } catch (err) {
        console.error('[注册错误]', err);
        res.json({ code: 500, message: '注册失败: ' + err.message, data: null });
    }
});

/**
 * POST /api/auth/login
 * 用户登录
 * Body: { username, password }
 */
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        // 参数校验
        if (!username || !password) {
            return res.json({ code: 400, message: '用户名和密码不能为空', data: null });
        }

        // 查找用户
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (!user) {
            return res.json({ code: 400, message: '用户名或密码错误', data: null });
        }

        // bcrypt 验证密码
        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.json({ code: 400, message: '用户名或密码错误', data: null });
        }

        const token = generateToken(user.id, user.username);

        console.log(`[登录] 用户: ${username} (id=${user.id})`);

        res.json({
            code: 200,
            message: '登录成功',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    nickname: user.nickname,
                    age: user.age,
                    gender: user.gender,
                    height: user.height,
                    weight: user.weight
                }
            }
        });
    } catch (err) {
        console.error('[登录错误]', err);
        res.json({ code: 500, message: '登录失败: ' + err.message, data: null });
    }
});

module.exports = router;
