const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/database');
const { initDatabase } = require('./data/init');
const { authMiddleware } = require('./middleware/auth');

// ==================== 路由导入 ====================
// 成员3（闵文欣）负责的路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const goalRoutes = require('./routes/goal');

// ==================== 成员4（曹祎茜）路由预留 ====================
// 取消下面注释即可合并成员4的模块：
// const activityRoutes = require('./routes/activity');
// const dietRoutes = require('./routes/diet');
// const reminderRoutes = require('./routes/reminder');
// const reportRoutes = require('./routes/report');

const app = express();
const PORT = 8081;

// ==================== 中间件配置 ====================

// CORS 跨域配置
app.use(cors({
    origin: '*',        // 允许所有来源（开发阶段），生产环境需限制
    credentials: true
}));

// JSON 请求体解析
app.use(express.json({ limit: '10mb' }));

// JWT 认证中间件 — 挂载到 /api 路径
// 自动排除 /api/auth/login 和 /api/auth/register
app.use('/api', authMiddleware);

// ==================== 路由注册 ====================

// 成员3路由
app.use('/api/auth', authRoutes);     // 认证：注册、登录
app.use('/api/user', userRoutes);     // 用户：资料管理、体重记录
app.use('/api/goal', goalRoutes);     // 目标：CRUD、进度跟踪

// 成员4路由（预留，合代码时取消注释）
// app.use('/api/activity', activityRoutes);   // 运动记录
// app.use('/api/diet', dietRoutes);           // 饮食日记
// app.use('/api/report', reportRoutes);       // 健康报告
// app.use('/api/reminder', reminderRoutes);   // 消息提醒

// ==================== 全局错误处理 ====================

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        message: `接口不存在: ${req.method} ${req.path}`,
        data: null
    });
});

// 全局异常捕获
app.use((err, req, res, next) => {
    console.error('[全局错误]', err.stack || err.message);
    res.status(500).json({
        code: 500,
        message: '服务器内部错误',
        data: null
    });
});

// ==================== 启动服务 ====================

async function start() {
    // 1. 初始化数据库连接
    await initDb();
    console.log('[启动] 数据库连接就绪');

    // 2. 初始化表结构 + 种子数据
    initDatabase();

    // 3. 启动 HTTP 服务
    app.listen(PORT, () => {
        console.log('');
        console.log('============================================');
        console.log('   个人健康管理系统 — 后端服务启动成功！');
        console.log('   成员3：闵文欣（用户体系+健康目标模块）');
        console.log(`   访问地址: http://localhost:${PORT}`);
        console.log('   接口基础路径: http://localhost:' + PORT + '/api');
        console.log('============================================');
        console.log('');
    });
}

start().catch(err => {
    console.error('[启动失败]', err);
    process.exit(1);
});
