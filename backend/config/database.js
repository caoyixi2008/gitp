const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'health.db');
let _db = null;

// 确保 data 目录存在
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * 保存数据库到文件
 * 注意：export() 会重置 last_insert_rowid，必须在保存前获取 rowid
 */
function saveDb() {
    if (!_db) return;
    const data = _db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
}

/**
 * 执行写入 SQL（不自动保存，由调用方控制保存时机）
 */
function execRun(sql, params = []) {
    _db.run(sql, params);
}

function execGet(sql, params = []) {
    const stmt = _db.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    let result = undefined;
    if (stmt.step()) {
        result = stmt.getAsObject();
    }
    stmt.free();
    return result;
}

function execAll(sql, params = []) {
    const stmt = _db.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    const results = [];
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
}

/**
 * 兼容 better-sqlite3 API 的包装对象
 * 使路由代码无需修改，方便后续升级到 better-sqlite3
 */
const db = {
    prepare(sql) {
        const self = {
            get(...params) {
                return execGet(sql, params);
            },
            all(...params) {
                return execAll(sql, params);
            },
            run(...params) {
                // 执行 INSERT/UPDATE/DELETE
                _db.run(sql, params);
                // ★ 关键：在 saveDb() 之前获取 lastInsertRowid
                // 因为 export() 会重置 SQLite 的 last_insert_rowid
                const rowidResult = execGet('SELECT last_insert_rowid() AS id', []);
                const lastId = rowidResult ? rowidResult.id : 0;
                const changes = _db ? _db.getRowsModified() : 0;
                // 持久化到磁盘
                saveDb();
                return {
                    lastInsertRowid: lastId,
                    changes: changes
                };
            }
        };
        return self;
    },

    // 直接执行（用于建表等无参数批量 SQL）
    exec(sql) {
        _db.run(sql);
        saveDb();
    },

    // 事务支持
    transaction(fn) {
        return () => {
            execRun('BEGIN');
            try {
                fn();
                execRun('COMMIT');
                saveDb();
            } catch (e) {
                execRun('ROLLBACK');
                saveDb();
                throw e;
            }
        };
    }
};

/**
 * 初始化数据库连接
 * 如果已有数据库文件则加载，否则创建新的内存数据库
 */
async function initDb() {
    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        _db = new SQL.Database(fileBuffer);
        console.log('[数据库] 已加载现有数据库文件');
    } else {
        _db = new SQL.Database();
        console.log('[数据库] 已创建新数据库');
    }

    _db.run('PRAGMA foreign_keys = ON');
    saveDb();
    return db;
}

module.exports = { db, initDb };
