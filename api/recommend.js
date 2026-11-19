const requests = new Map();

const schema = {
  type: "object", additionalProperties: false,
  required: ["name", "type", "taste", "time", "desc", "ingredients", "seasonings", "steps"],
  properties: {
    name: { type: "string" }, type: { type: "string" }, taste: { type: "string" },
    time: { type: "integer" }, desc: { type: "string" },
    ingredients: { type: "array", items: { type: "object", additionalProperties: false,
      required: ["name", "amount"], properties: { name: { type: "string" }, amount: { type: "string" } } } },
    seasonings: { type: "string" }, steps: { type: "array", items: { type: "string" } }
  }
};

function amount(value) {
  const match = String(value).trim().match(/^(\d+(?:\.\d+)?)\s*(kg|g|个|袋|盒|瓶|罐|根|颗|片|把)$/i);
  return match ? { quantity: Number(match[1]) * (match[2] === "kg" ? 1000 : 1), unit: match[2] === "kg" ? "g" : match[2] } : null;
}

function validRecipe(recipe, items, preferences) {
  if (!recipe || typeof recipe.name !== "string" || recipe.name.length < 2 || recipe.name.length > 40) return false;
  if (!["家常菜", "主食", "轻食", "汤羹"].includes(recipe.type) || !["咸香", "清淡", "香辣", "酸甜"].includes(recipe.taste)) return false;
  if (!Number.isInteger(recipe.time) || recipe.time < 5 || recipe.time > Math.min(999, preferences.maxTime)) return false;
  if (preferences.strictType && recipe.type !== preferences.type || preferences.strictTaste && recipe.taste !== preferences.taste) return false;
  if (typeof recipe.desc !== "string" || recipe.desc.length > 180 || typeof recipe.seasonings !== "string" || recipe.seasonings.length > 120) return false;
  if (!Array.isArray(recipe.steps) || recipe.steps.length < 2 || recipe.steps.length > 6 || recipe.steps.some(step => typeof step !== "string" || !step.trim() || step.length > 150)) return false;
  if (!Array.isArray(recipe.ingredients) || !recipe.ingredients.length || recipe.ingredients.length > Math.min(items.length, 6)) return false;
  if (preferences.noSpicy && (recipe.taste === "香辣" || /辣椒|花椒|辣油|辣酱|豆瓣/.test(`${recipe.seasonings} ${recipe.steps.join(" ")}`)) ||
      preferences.vegetarian && recipe.ingredients.some(entry => items.some(item => item.name === entry.name && ["肉类", "水产"].includes(item.category)))) return false;
  if ([recipe.name, recipe.desc, recipe.seasonings, ...recipe.steps].some(value => /[<>]/.test(value))) return false;
  const used = new Set();
  for (const entry of recipe.ingredients) {
    if (!entry || typeof entry.name !== "string" || used.has(entry.name) || preferences.excluded?.includes(entry.name)) return false;
    used.add(entry.name);
    const available = items.find(item => item.name === entry.name);
    const needed = amount(entry.amount);
    const stock = available && amount(`${available.quantity}${available.unit}`);
    if (!needed || !stock || (needed.unit !== stock.unit && !(entry.name === "可乐" && needed.unit === "罐" && stock.unit === "瓶")) || needed.quantity > stock.quantity) return false;
  }
  if (preferences.wanted?.some(name => !used.has(name))) return false;
  return true;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "只支持 POST" });
  if (process.env.COOK_AI_ENABLED !== "true" || !process.env.OPENAI_API_KEY) return res.status(503).json({ error: "模型服务尚未配置" });
  const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(",")[0];
  const now = Date.now(), recent = (requests.get(ip) || []).filter(time => now - time < 60000);
  if (recent.length >= 10) return res.status(429).json({ error: "请求过于频繁，请稍后再试" });
  recent.push(now); requests.set(ip, recent);
  if (requests.size > 500) for (const [key, times] of requests) if (times.every(time => now - time >= 60000)) requests.delete(key);
  let body;
  try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ error: "请求内容不是有效 JSON" }); }
  const items = body?.items, preferences = body?.preferences;
  if (!Array.isArray(items) || !items.length || items.length > 12 || !preferences || JSON.stringify(body).length > 12000 ||
      items.some(item => !item || typeof item.name !== "string" || item.name.length > 30 || /[<>]/.test(item.name) || !Number.isFinite(item.quantity) || item.quantity <= 0 || !amount(`${item.quantity}${item.unit}`)) ||
      !Number.isFinite(preferences.maxTime) || preferences.maxTime < 5 || preferences.maxTime > 999) return res.status(400).json({ error: "食材或偏好数据无效" });
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST", signal: AbortSignal.timeout(20000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5.4-mini", store: false, max_output_tokens: 1800,
        instructions: "你是中国家常菜厨师。只使用用户提供且有库存的主食材，调料可用常见盐、油、酱油等。菜名必须是真正合理的菜，不能凭空加入肉、蛋、奶、蔬菜或水果。按现有数量做小份也可以。严格遵守时间、忌口和类型限制。生肉、海鲜、鸡蛋、豆角必须充分做熟。输出一份可操作的中文菜谱，不要输出解释。",
        input: JSON.stringify({ items, preferences }),
        text: { format: { type: "json_schema", name: "cook_recipe", strict: true, schema } } })
    });
    if (!response.ok) return res.status(502).json({ error: "模型服务暂时不可用" });
    const data = await response.json();
    const text = data.output?.flatMap(part => part.content || []).find(part => part.type === "output_text")?.text;
    if (data.status !== "completed" || !text) return res.status(502).json({ error: "模型没有返回完整菜谱" });
    const recipe = JSON.parse(text);
    if (!validRecipe(recipe, items, preferences)) return res.status(422).json({ error: "模型菜谱未通过食材或时间核对" });
    return res.status(200).json({ recipe });
  } catch {
    return res.status(502).json({ error: "模型生成失败" });
  }
};

module.exports.validRecipe = validRecipe;
