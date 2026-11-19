const path = require("node:path");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "freshcook_app",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "freshcook",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4"
});

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS ingredients (
    id VARCHAR(191) NOT NULL,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT '',
    storage VARCHAR(64) NOT NULL DEFAULT '',
    quantity DOUBLE NOT NULL DEFAULT 1,
    unit VARCHAR(32) NOT NULL DEFAULT '',
    purchase_date VARCHAR(32) NOT NULL DEFAULT '',
    expiry_date VARCHAR(32) NOT NULL DEFAULT '',
    note VARCHAR(500) NOT NULL DEFAULT '',
    image LONGTEXT,
    added_by VARCHAR(64) NOT NULL DEFAULT '我',
    photo_verified_name VARCHAR(255) NOT NULL DEFAULT '',
    position INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS family_activity (
    id VARCHAR(191) NOT NULL,
    user_id INT NOT NULL,
    actor VARCHAR(64) NOT NULL DEFAULT '我',
    name VARCHAR(255) NOT NULL,
    quantity DOUBLE NOT NULL DEFAULT 1,
    unit VARCHAR(32) NOT NULL DEFAULT '',
    storage VARCHAR(64) NOT NULL DEFAULT '',
    at VARCHAR(64) NOT NULL DEFAULT '',
    position INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS foodhub_posts (
    id VARCHAR(191) NOT NULL,
    user_id INT NOT NULL,
    author VARCHAR(64) NOT NULL DEFAULT '',
    avatar VARCHAR(255) NOT NULL DEFAULT '',
    recipe_id VARCHAR(191) NOT NULL DEFAULT '',
    text TEXT,
    at VARCHAR(64) NOT NULL DEFAULT '',
    likes INT NOT NULL DEFAULT 0,
    liked TINYINT(1) NOT NULL DEFAULT 0,
    position INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS foodhub_comments (
    id VARCHAR(191) NOT NULL,
    post_id VARCHAR(191) NOT NULL,
    user_id INT NOT NULL,
    author VARCHAR(64) NOT NULL DEFAULT '',
    text TEXT,
    at VARCHAR(64) NOT NULL DEFAULT '',
    position INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id, post_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS favorites (
    user_id INT NOT NULL,
    recipe_id VARCHAR(191) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS history (
    user_id INT NOT NULL,
    recipe_id VARCHAR(191) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS generated_recipes (
    id VARCHAR(191) NOT NULL,
    user_id INT NOT NULL,
    recipe_json LONGTEXT,
    position INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS week_plan (
    user_id INT NOT NULL,
    day_index INT NOT NULL,
    recipe_id VARCHAR(191) NOT NULL,
    PRIMARY KEY (user_id, day_index),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS shopping_checked (
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS user_state (
    user_id INT PRIMARY KEY,
    week_start VARCHAR(64) NOT NULL DEFAULT '',
    week_generation INT NOT NULL DEFAULT 0,
    week_recipe_version INT NOT NULL DEFAULT 0,
    suggestion_index INT NOT NULL DEFAULT 0,
    photo_import_version INT NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
];

const ready = initDb();
ready.catch(() => {});

async function initDb() {
  for (const sql of SCHEMA) await pool.execute(sql);
}

async function query(sql, params = []) {
  await ready;
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

async function insertUser(username, passwordHash) {
  await ready;
  const [result] = await pool.execute(
    "INSERT INTO users (username, password_hash) VALUES (?, ?)",
    [username, passwordHash]
  );
  return Number(result.insertId);
}

async function getOrCreateUserState(userId) {
  await pool.execute("INSERT IGNORE INTO user_state (user_id) VALUES (?)", [userId]);
  const rows = await query("SELECT * FROM user_state WHERE user_id = ?", [userId]);
  return rows[0];
}

async function loadState(userId) {
  await ready;
  const [ingredientRows, activityRows, postRows, favoriteRows, historyRows,
    generatedRows, weekRows, checkedRows] = await Promise.all([
    query(`SELECT id, name, category, storage, quantity, unit,
             purchase_date AS purchaseDate, expiry_date AS expiryDate,
             note, image, added_by AS addedBy, photo_verified_name AS photoVerifiedName
           FROM ingredients WHERE user_id = ? ORDER BY position ASC`, [userId]),
    query(`SELECT id, actor, name, quantity, unit, storage, at FROM family_activity
           WHERE user_id = ? ORDER BY position ASC`, [userId]),
    query(`SELECT id, author, avatar, recipe_id AS recipeId, text, at, likes, liked
           FROM foodhub_posts WHERE user_id = ? ORDER BY position ASC`, [userId]),
    query("SELECT recipe_id FROM favorites WHERE user_id = ? ORDER BY position ASC", [userId]),
    query("SELECT recipe_id FROM history WHERE user_id = ? ORDER BY position ASC", [userId]),
    query("SELECT recipe_json FROM generated_recipes WHERE user_id = ? ORDER BY position ASC", [userId]),
    query("SELECT day_index, recipe_id FROM week_plan WHERE user_id = ? ORDER BY day_index ASC", [userId]),
    query("SELECT name FROM shopping_checked WHERE user_id = ?", [userId])
  ]);

  const commentRows = await query(
    "SELECT post_id, author, text, at FROM foodhub_comments WHERE user_id = ? ORDER BY position ASC",
    [userId]
  );
  const commentsByPost = new Map();
  commentRows.forEach(row => {
    if (!commentsByPost.has(row.post_id)) commentsByPost.set(row.post_id, []);
    commentsByPost.get(row.post_id).push({ author: row.author, text: row.text, at: row.at });
  });

  const foodHubPosts = postRows.map(post => ({
    id: post.id,
    author: post.author,
    avatar: post.avatar,
    recipeId: post.recipeId,
    text: post.text,
    at: post.at,
    likes: Number(post.likes),
    liked: Boolean(post.liked),
    comments: commentsByPost.get(post.id) || []
  }));

  const weekPlan = Array(21).fill("");
  weekRows.forEach(row => {
    if (row.day_index >= 0 && row.day_index < 21) weekPlan[row.day_index] = row.recipe_id;
  });

  const meta = await getOrCreateUserState(userId);
  return {
    ingredients: ingredientRows.map(row => ({ ...row, quantity: Number(row.quantity) })),
    familyActivity: activityRows.map(row => ({ ...row, quantity: Number(row.quantity) })),
    foodHubPosts,
    favorites: favoriteRows.map(row => row.recipe_id),
    history: historyRows.map(row => row.recipe_id),
    generatedRecipes: generatedRows
      .map(row => { try { return JSON.parse(row.recipe_json); } catch { return null; } })
      .filter(Boolean),
    weekPlan: weekPlan.filter(Boolean).length ? weekPlan : [],
    shoppingChecked: checkedRows.map(row => row.name),
    weekStart: meta.week_start,
    weekGeneration: Number(meta.week_generation),
    weekRecipeVersion: Number(meta.week_recipe_version),
    suggestionIndex: Number(meta.suggestion_index),
    photoImportVersion: Number(meta.photo_import_version)
  };
}

async function saveState(userId, state) {
  await ready;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const tables = ["ingredients", "family_activity", "foodhub_comments", "foodhub_posts",
      "favorites", "history", "generated_recipes", "week_plan", "shopping_checked"];
    for (const table of tables) await conn.execute(`DELETE FROM ${table} WHERE user_id = ?`, [userId]);

    const insertAll = async (sql, rows) => {
      for (const row of rows) await conn.execute(sql, row);
    };

    let pos = 0;
    await insertAll(`INSERT INTO ingredients (id, user_id, name, category, storage, quantity, unit,
        purchase_date, expiry_date, note, image, added_by, photo_verified_name, position)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      (state.ingredients || []).map(item => [
        String(item.id), userId, String(item.name || ""), String(item.category || ""),
        String(item.storage || ""), Number(item.quantity) || 0, String(item.unit || ""),
        String(item.purchaseDate || ""), String(item.expiryDate || ""), String(item.note || ""),
        String(item.image || ""), String(item.addedBy || "我"), String(item.photoVerifiedName || ""), pos++
      ]));

    pos = 0;
    await insertAll(`INSERT INTO family_activity (id, user_id, actor, name, quantity, unit, storage, at, position)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      (state.familyActivity || []).map(entry => [
        String(entry.id || `act-${pos}`), userId, String(entry.actor || "我"),
        String(entry.name || ""), Number(entry.quantity) || 0, String(entry.unit || ""),
        String(entry.storage || ""), String(entry.at || ""), pos++
      ]));

    pos = 0;
    const postRows = [], commentRows = [];
    for (const post of state.foodHubPosts || []) {
      postRows.push([
        String(post.id), userId, String(post.author || ""), String(post.avatar || ""),
        String(post.recipeId || ""), String(post.text || ""), String(post.at || ""),
        Number(post.likes) || 0, post.liked ? 1 : 0, pos++
      ]);
      let cpos = 0;
      for (const comment of Array.isArray(post.comments) ? post.comments : []) {
        commentRows.push([
          String(comment.id || `${post.id}-c${cpos}`), String(post.id), userId,
          String(comment.author || ""), String(comment.text || ""), String(comment.at || ""), cpos++
        ]);
      }
    }
    await insertAll(`INSERT INTO foodhub_posts (id, user_id, author, avatar, recipe_id, text, at, likes, liked, position)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, postRows);
    await insertAll(`INSERT INTO foodhub_comments (id, post_id, user_id, author, text, at, position)
      VALUES (?, ?, ?, ?, ?, ?, ?)`, commentRows);

    const addRef = (table, ids) => insertAll(
      `INSERT INTO ${table} (user_id, recipe_id, position) VALUES (?, ?, ?)`,
      ids.map((id, i) => [userId, String(id), i])
    );
    await addRef("favorites", state.favorites || []);
    await addRef("history", state.history || []);

    pos = 0;
    await insertAll("INSERT INTO generated_recipes (id, user_id, recipe_json, position) VALUES (?, ?, ?, ?)",
      (state.generatedRecipes || []).map(recipe => [String(recipe.id), userId, JSON.stringify(recipe), pos++]));

    await insertAll("INSERT INTO week_plan (user_id, day_index, recipe_id) VALUES (?, ?, ?)",
      (state.weekPlan || []).slice(0, 21).map((id, i) => [userId, i, String(id)]).filter(row => row[2] !== "undefined" && row[2]));

    await insertAll("INSERT INTO shopping_checked (user_id, name) VALUES (?, ?)",
      (state.shoppingChecked || []).map(name => [userId, String(name)]));

    await conn.execute("INSERT IGNORE INTO user_state (user_id) VALUES (?)", [userId]);
    await conn.execute(`
      UPDATE user_state SET week_start=?, week_generation=?, week_recipe_version=?,
        suggestion_index=?, photo_import_version=? WHERE user_id=?
    `, [
      String(state.weekStart || ""), Number(state.weekGeneration) || 0,
      Number(state.weekRecipeVersion) || 0, Number(state.suggestionIndex) || 0,
      Number(state.photoImportVersion) || 0, userId
    ]);

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function close() {
  await pool.end();
}

module.exports = { query, queryOne, insertUser, loadState, saveState, initDb, close };
