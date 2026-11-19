const path = require("node:path");
const crypto = require("node:crypto");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query, queryOne, insertUser, loadState, saveState, initDb } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || crypto.createHash("sha256").update("freshcook-dev-secret-" + path.resolve(__dirname)).digest("hex");

app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true }));
app.use(express.json({ limit: "2mb" }));

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "请先登录" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "登录状态已失效，请重新登录" });
  }
}

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "freshcook-api", db: "mysql" }));

app.post("/api/auth/register", async (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  if (!/^[\w\u4e00-\u9fa5-]{2,24}$/.test(username)) return res.status(400).json({ error: "用户名为 2-24 位中英文、数字或下划线" });
  if (password.length < 6 || password.length > 72) return res.status(400).json({ error: "密码需 6-72 位" });
  try {
    if (await queryOne("SELECT 1 FROM users WHERE username = ?", [username])) return res.status(409).json({ error: "用户名已存在" });
    const hash = await bcrypt.hash(password, 10);
    const userId = await insertUser(username, hash);
    await saveState(userId, {});
    const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
    res.status(201).json({ token, user: { id: userId, username } });
  } catch (err) {
    console.error("register failed", err);
    res.status(500).json({ error: "注册失败" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  try {
    const user = await queryOne("SELECT * FROM users WHERE username = ?", [username]);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ error: "用户名或密码错误" });
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error("login failed", err);
    res.status(500).json({ error: "登录失败" });
  }
});

app.get("/api/me", authRequired, async (req, res) => {
  try {
    const user = await queryOne("SELECT id, username, created_at AS createdAt FROM users WHERE id = ?", [req.userId]);
    if (!user) return res.status(401).json({ error: "用户不存在" });
    res.json({ user });
  } catch (err) {
    console.error("me failed", err);
    res.status(500).json({ error: "读取用户信息失败" });
  }
});

app.get("/api/state", authRequired, async (req, res) => {
  try {
    res.json({ state: await loadState(req.userId) });
  } catch (err) {
    console.error("load state failed", err);
    res.status(500).json({ error: "读取云端数据失败" });
  }
});

app.put("/api/state", authRequired, async (req, res) => {
  const state = req.body?.state;
  if (!state || typeof state !== "object" || !Array.isArray(state.ingredients)) {
    return res.status(400).json({ error: "数据格式无效" });
  }
  if (JSON.stringify(state).length > 8 * 1024 * 1024) return res.status(413).json({ error: "数据过大" });
  try {
    await saveState(req.userId, state);
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error("save state failed", err);
    res.status(500).json({ error: "保存云端数据失败" });
  }
});

const dist = path.join(__dirname, "..");
app.get("/", (_req, res) => res.sendFile(path.join(dist, "index.html")));
for (const file of ["app.js", "styles.css", "logo.png"]) {
  app.get(`/${file}`, (_req, res) => res.sendFile(path.join(dist, file)));
}
app.use("/assets", express.static(path.join(dist, "assets")));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "服务器内部错误" });
});

async function start() {
  await initDb();
  app.listen(PORT, () => console.log(`鲜厨记 API 已启动 (MySQL): http://localhost:${PORT}`));
}

if (require.main === module) {
  start().catch(err => { console.error("服务启动失败：", err); process.exitCode = 1; });
}

module.exports = { app, authRequired, start };
