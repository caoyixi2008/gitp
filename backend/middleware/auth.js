const jwt = require('jsonwebtoken');

const JWT_SECRET = 'health-management-system-secret-key-2024';
const JWT_EXPIRATION = '7d';

/**
 * JWT 认证中间件
 * 验证请求头中的 Bearer Token
 * 排除登录和注册接口
 */
function authMiddleware(req, res, next) {
    // 不需要认证的路由（相对于 /api 的路径）
    const publicPaths = ['/auth/login', '/auth/register'];
    if (publicPaths.includes(req.path)) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({
            code: 401,
            message: '未登录，请先登录',
            data: null
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.username = decoded.username;
        next();
    } catch (err) {
        return res.status(401).json({
            code: 401,
            message: '登录已过期，请重新登录',
            data: null
        });
    }
}

/**
 * 生成 JWT Token
 * @param {number} userId - 用户ID
 * @param {string} username - 用户名
 * @returns {string} JWT Token
 */
function generateToken(userId, username) {
    return jwt.sign(
        { userId: userId, username: username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
    );
}

module.exports = { authMiddleware, generateToken, JWT_SECRET };
