const assert = require("node:assert/strict");
const { app } = require("../server/index");
const { close, query } = require("../server/db");

const server = app.listen(0);
const base = () => `http://127.0.0.1:${server.address().port}`;
const testUsers = [];

async function request(path, { method = "GET", token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(base() + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

function sampleState(name) {
  return {
    ingredients: [{ id: "i1", name, category: "蔬菜", storage: "冷藏", quantity: 2, unit: "个", expiryDate: "2099-01-01" }],
    favorites: ["r8"], history: ["r60"], generatedRecipes: [],
    familyActivity: [{ id: "a1", actor: "我", name, quantity: 2, unit: "个", storage: "冷藏", at: "2026-01-01T00:00:00Z" }],
    foodHubPosts: [{ id: "p1", author: "鲜小厨", avatar: "鲜", recipeId: "r8", text: "好吃", at: "2026-01-01T00:00:00Z", likes: 0, liked: false, comments: [{ id: "c1", author: "阿杰", text: "赞" }] }],
    weekPlan: Array.from({ length: 21 }, (_, i) => `r${i + 1}`),
    shoppingChecked: ["土豆"], weekStart: "2026-01-05", weekGeneration: 1,
    weekRecipeVersion: 2, suggestionIndex: 0, photoImportVersion: 6
  };
}

(async () => {
  const health = await request("/api/health");
  assert.equal(health.status, 200);
  assert.equal(health.data.ok, true);
  assert.equal((await fetch(base() + "/")).status, 200);
  assert.equal((await fetch(base() + "/styles.css")).status, 200);
  assert.equal((await fetch(base() + "/server/db.js")).status, 404);

  const suffix = Date.now().toString(36);
  const userA = "testA_" + suffix, userB = "testB_" + suffix;

  const regA = await request("/api/auth/register", { method: "POST", body: { username: userA, password: "secret123" } });
  assert.equal(regA.status, 201, JSON.stringify(regA.data));
  testUsers.push({ id: regA.data.user.id, username: userA });
  const tokenA = regA.data.token;
  assert.ok(tokenA);

  const dup = await request("/api/auth/register", { method: "POST", body: { username: userA, password: "secret123" } });
  assert.equal(dup.status, 409);

  const badLogin = await request("/api/auth/login", { method: "POST", body: { username: userA, password: "wrong" } });
  assert.equal(badLogin.status, 401);
  const loginA = await request("/api/auth/login", { method: "POST", body: { username: userA, password: "secret123" } });
  assert.equal(loginA.status, 200);

  const noToken = await request("/api/state");
  assert.equal(noToken.status, 401);

  const saved = await request("/api/state", { method: "PUT", token: tokenA, body: { state: sampleState("西红柿") } });
  assert.equal(saved.status, 200, JSON.stringify(saved.data));

  const loaded = await request("/api/state", { token: tokenA });
  assert.equal(loaded.status, 200);
  assert.equal(loaded.data.state.ingredients[0].name, "西红柿");
  assert.equal(loaded.data.state.ingredients[0].quantity, 2);
  assert.deepEqual(loaded.data.state.favorites, ["r8"]);
  assert.equal(loaded.data.state.weekPlan.length, 21);
  assert.equal(loaded.data.state.foodHubPosts[0].comments[0].text, "赞");
  assert.equal(loaded.data.state.familyActivity[0].actor, "我");
  assert.equal(loaded.data.state.weekRecipeVersion, 2);

  const regB = await request("/api/auth/register", { method: "POST", body: { username: userB, password: "secret456" } });
  assert.equal(regB.status, 201);
  testUsers.push({ id: regB.data.user.id, username: userB });
  const tokenB = regB.data.token;
  await request("/api/state", { method: "PUT", token: tokenB, body: { state: sampleState("黄瓜") } });

  const loadedB = await request("/api/state", { token: tokenB });
  assert.equal(loadedB.data.state.ingredients[0].name, "黄瓜");
  const loadedAAgain = await request("/api/state", { token: tokenA });
  assert.equal(loadedAAgain.data.state.ingredients[0].name, "西红柿");

  const badPayload = await request("/api/state", { method: "PUT", token: tokenA, body: { state: { nope: true } } });
  assert.equal(badPayload.status, 400);

  console.log("Server API checks passed");
})().catch(err => { console.error(err); process.exitCode = 1; }).finally(async () => {
  try {
    for (const user of testUsers) await query("DELETE FROM users WHERE id = ? AND username = ?", [user.id, user.username]);
  } catch (err) { console.error("test cleanup failed", err); process.exitCode = 1; }
  await new Promise(resolve => server.close(resolve));
  await close();
});
