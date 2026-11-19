const assert = require("node:assert/strict");
const handler = require("../api/recommend.js");

const items = [{ name: "牛肉", quantity: 150, unit: "g", category: "肉类" }, { name: "西葫芦", quantity: 1, unit: "根", category: "蔬菜" }];
const preferences = { maxTime: 30, type: "家常菜", taste: "咸香", excluded: [], wanted: [] };
const recipe = { name: "牛肉炒西葫芦", type: "家常菜", taste: "咸香", time: 20,
  desc: "牛肉与西葫芦快炒。", ingredients: [{ name: "牛肉", amount: "150g" }, { name: "西葫芦", amount: "1根" }],
  seasonings: "盐、生抽、食用油", steps: ["牛肉切薄片炒至熟透。", "西葫芦切片，炒熟后与牛肉拌匀。"] };
assert.equal(handler.validRecipe(recipe, items, preferences), true);
assert.equal(handler.validRecipe({ ...recipe, ingredients: [{ name: "牛肉", amount: "300g" }] }, items, preferences), false);
assert.equal(handler.validRecipe({ ...recipe, ingredients: [{ name: "鸡蛋", amount: "1个" }] }, items, preferences), false);
assert.equal(handler.validRecipe({ ...recipe, time: 40 }, items, preferences), false);
assert.equal(handler.validRecipe({ ...recipe, name: "<script>oops</script>" }, items, preferences), false);

const originalEnabled = process.env.COOK_AI_ENABLED;
const originalKey = process.env.OPENAI_API_KEY;
const originalFetch = global.fetch;
function response() { return { setHeader() {}, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } }; }
(async () => {
  delete process.env.COOK_AI_ENABLED;
  const disabled = response();
  await handler({ method: "POST", headers: {}, socket: {}, body: { items, preferences } }, disabled);
  assert.equal(disabled.code, 503);
  process.env.COOK_AI_ENABLED = "true";
  process.env.OPENAI_API_KEY = "test-only-key";
  global.fetch = async (_url, options) => {
    assert.equal(options.headers.Authorization, "Bearer test-only-key");
    assert.equal(JSON.parse(options.body).store, false);
    return { ok: true, json: async () => ({ status: "completed", output: [{ content: [{ type: "output_text", text: JSON.stringify(recipe) }] }] }) };
  };
  const generated = response();
  await handler({ method: "POST", headers: {}, socket: {}, body: { items, preferences } }, generated);
  assert.equal(generated.code, 200);
  assert.equal(generated.body.recipe.name, recipe.name);
  assert.equal(JSON.stringify(generated.body).includes("test-only-key"), false);
  const malformed = response();
  await handler({ method: "POST", headers: {}, socket: {}, body: "{" }, malformed);
  assert.equal(malformed.code, 400);
  console.log("AI endpoint validation checks passed");
})().finally(() => {
  global.fetch = originalFetch;
  if (originalEnabled === undefined) delete process.env.COOK_AI_ENABLED; else process.env.COOK_AI_ENABLED = originalEnabled;
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
});
