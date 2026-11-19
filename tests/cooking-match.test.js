const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const controls = {
  "#mealType": { value: "家常菜" }, "#taste": { value: "清淡" },
  "#cookTime": { value: "30" }, "#servings": { value: "2 人" },
  "#customPrompt": { value: "" }, "#familyActivityList": { innerHTML: "" }
};
const storage = new Map();
let nextId = 0;
const context = vm.createContext({
  console,
  crypto: { randomUUID: () => String(++nextId) },
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  document: { querySelector: selector => controls[selector], createElement: () => ({
    set textContent(value) { this._text = String(value); },
    get innerHTML() { return this._text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  }) },
});
const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8").replace(/\ninit\(\);\s*$/, "");
vm.runInContext(source, context);

vm.runInContext('state.familyActivity = []; recordFamilyActivity({ name: "鸡蛋", quantity: 6, unit: "个", storage: "冷藏" }, "家庭成员A"); saveState(); renderFamilyActivity()', context);
assert.match(controls["#familyActivityList"].innerHTML, /家庭成员 A.*鸡蛋.*6个到冷藏区/);
assert.equal(JSON.parse([...storage.values()][0]).familyActivity[0].actor, "家庭成员A");

const pepperPixels = new Uint8ClampedArray(100 * 100 * 4);
for (let y = 0; y < 100; y++) for (let x = 0; x < 100; x++) {
  const index = (y * 100 + x) * 4;
  const pepper = x >= 30 && x < 70 && y >= 12 && y < 88;
  pepperPixels.set(pepper ? [45, 150, 60, 255] : [255, 255, 255, 255], index);
}
context.pepperPixels = pepperPixels;
assert.equal(vm.runInContext("analyzeWhiteBackgroundPhoto({ data: pepperPixels, width: 100, height: 100 }).name", context), "青椒");
const pepperMask = vm.runInContext("extractForegroundMask({ data: pepperPixels, width: 100, height: 100 })", context);
assert.equal(pepperMask.background[0], 1);
assert.equal(pepperMask.background[50 * 100 + 50], 0);
assert.equal(pepperMask.minX, 30);
assert.equal(pepperMask.maxY, 87);
const orangePixels = new Uint8ClampedArray(100 * 100 * 4);
for (let y = 0; y < 100; y++) for (let x = 0; x < 100; x++) {
  const index = (y * 100 + x) * 4, fruit = (x - 50) ** 2 + (y - 50) ** 2 < 35 ** 2;
  orangePixels.set(fruit ? [240, 145, 25, 255] : [255, 255, 255, 255], index);
}
context.orangePixels = orangePixels;
assert.equal(vm.runInContext("analyzeWhiteBackgroundPhoto({ data: orangePixels, width: 100, height: 100 }).name", context), "橙子");
context.duplicateIngredients = [
  { id: "uploaded", name: "青椒", category: "蔬菜", unit: "个", quantity: 1, image: "data:image/png;base64,AAAA", expiryDate: "2099-01-02" },
  { id: "manual", name: "青椒", category: "蔬菜", unit: "个", quantity: 1, expiryDate: "2099-01-01" },
  { id: "orange", name: "橙子", category: "其他", unit: "个", quantity: 1, expiryDate: "2099-01-03" }
];
const mergedIngredients = vm.runInContext("mergeSameNameIngredients(duplicateIngredients)", context);
assert.equal(mergedIngredients.length, 2);
assert.equal(mergedIngredients[0].quantity, 1);
assert.equal(mergedIngredients[0].image, "data:image/png;base64,AAAA");
assert.equal(mergedIngredients[1].category, "水果");

function item(name, quantity, unit) {
  return { name, quantity, unit, expiryDate: "2099-01-01" };
}
function match(items, settings = {}) {
  controls["#mealType"].value = settings.type || "家常菜";
  controls["#taste"].value = settings.taste || "清淡";
  controls["#cookTime"].value = String(settings.time || 30);
  controls["#servings"].value = `${settings.servings || 2} 人`;
  controls["#customPrompt"].value = settings.prompt || "";
  context.testItems = items;
  vm.runInContext("state.ingredients = testItems", context);
  return vm.runInContext("findBestRecipe(testItems)", context);
}

assert.equal(match([item("荷兰豆", 1, "把"), item("虾仁", 200, "g")]).recipe.id, "r11");
assert.equal(match([item("紫洋葱", 1, "个"), item("肥牛卷", 200, "g")]).recipe.id, "r23");
assert.equal(match([item("草莓", 1, "盒"), item("排骨", 300, "g")]), null);
assert.equal(match([item("茄子", 1, "根"), item("长豆角", 1, "把")], { time: 15 }).recipe.name, "清炒茄子");
assert.notEqual(match([item("土豆", 2, "个"), item("青椒", 1, "个")], { prompt: "不要辣", time: 15 }).recipe.taste, "香辣");
assert.equal(match([item("荷兰豆", 1, "把"), item("虾仁", 100, "g")], { prompt: "不买菜" }).recipe.id, "r11");
assert.equal(match([item("荷兰豆", 1, "把"), item("虾仁", 200, "g")], { servings: 4 }).recipe.id, "r11");
assert.equal(match([item("荷兰豆", 2, "把"), item("虾仁", 400, "g")], { servings: 4 }).recipe.id, "r11");
assert.equal(match([item("荷兰豆", 1, "把"), item("虾仁", 200, "g")], { prompt: "不吃虾仁" }).recipe.id, "r56");
assert.equal(match([item("西红柿", 2, "个"), item("肥牛卷", 200, "g")], { prompt: "想喝汤", time: 30 }).recipe.id, "r24");
assert.notEqual(match([item("土豆", 2, "个"), item("青椒", 1, "个")], { prompt: "最好不要太辣", time: 15 }).recipe.taste, "香辣");
assert.equal(match([item("荷兰豆", 1, "把"), item("虾仁", 200, "g")], { prompt: "15分钟内，用荷兰豆" }).recipe.id, "r11");
assert.equal(match([item("鸡腿肉", 300, "g")], { taste: "咸香" }).recipe.id, "r54");
assert.equal(match([item("牛肉", 200, "g"), item("紫洋葱", 1, "个")], { taste: "咸香" }).recipe.id, "r52");
assert.equal(match([item("鸡翅", 8, "个"), item("可乐", 1, "罐")], { taste: "酸甜", time: 45 }).recipe.id, "r8");
assert.equal(match([item("鸡翅", 8, "个"), item("可乐", 1, "瓶")], { taste: "酸甜", time: 45 }).recipe.id, "r8");
const scaledTomatoEggs = match([item("西红柿", 1, "个"), item("鸡蛋", 1, "个")]);
assert.equal(scaledTomatoEggs.recipe.id, "r60");
assert.equal(scaledTomatoEggs.missing.length, 0);
assert.equal(scaledTomatoEggs.needs.every(need => need.quantity > 0 && need.quantity <= 1), true);
const newCombination = match([item("牛肉", 150, "g"), item("西葫芦", 1, "根")]);
assert.equal(newCombination.recipe.name, "牛肉炒西葫芦");
assert.equal(newCombination.recipe.isCombination, true);
assert.equal(newCombination.missing.length, 0);
const manySelected = match([item("牛肉", 150, "g"), item("西葫芦", 1, "根"), item("鸡蛋", 1, "个"), item("橙子", 1, "个"), item("可乐", 1, "罐")]);
assert.equal(manySelected.hits.length >= 2, true);
assert.equal(manySelected.missing.length, 0);
assert.equal(match([item("牛肉", 200, "g"), item("紫洋葱", 1, "个"), item("青椒", 1, "个")]).recipe.id, "r55");
assert.equal(match([item("荷兰豆", 1, "把")]).recipe.id, "r56");
assert.equal(match([item("大虾", 300, "g")]).recipe.id, "r57");
assert.equal(match([item("五花肉", 150, "g"), item("豆腐", 1, "盒")]).recipe.id, "r58");
assert.equal(match([item("芹菜", 1, "把"), item("黑木耳", 20, "g"), item("五花肉", 200, "g"), item("胡萝卜", 1, "根")], { taste: "酸甜" }).recipe.id, "r59");
assert.equal(vm.runInContext("['r55','r56','r57','r58','r59'].every(id => dishImages[id] && recipes.some(recipe => recipe.id === id))", context), true);
assert.equal(vm.runInContext("['r8','r60','r61','r62','r63','r64'].every(id => dishImages[id] && recipes.some(recipe => recipe.id === id))", context), true);
assert.equal(vm.runInContext("['r55','r57','r59','r60','r61','r63'].every(id => weekMealRecipeIds['午餐'].includes(id))", context), true);
assert.equal(vm.runInContext("['r56','r58','r62','r64'].every(id => weekMealRecipeIds['晚餐'].includes(id))", context), true);
assert.equal(vm.runInContext("buildWeekPlan().slice(7).filter(id => dishImages[id]).length >= 6", context), true);
for (const filename of vm.runInContext("['r55','r56','r57','r58','r59'].map(id => dishImages[id])", context)) {
  assert.equal(fs.existsSync(path.join(__dirname, "..", "assets", "dishes", filename)), true, `Missing dish image: ${filename}`);
}
for (const filename of vm.runInContext("['r8','r60','r61','r62','r63','r64'].map(id => dishImages[id])", context)) {
  assert.equal(fs.existsSync(path.join(__dirname, "..", "assets", "dishes", filename)), true, `Missing dish image: ${filename}`);
}
const smallColaWings = match([item("鸡翅", 1, "个"), item("可乐", 1, "罐")]);
assert.equal(smallColaWings.recipe.id, "r8");
assert.equal(smallColaWings.near, false);
assert.equal(smallColaWings.missing.length, 0);
assert.equal(smallColaWings.needs[0].quantity, 1);
assert.equal(smallColaWings.needs[1].quantity, 0.1);
assert.equal(match([item("牛奶", 1, "盒"), item("苹果", 1, "个")]).recipe.name, "苹果奶昔");
assert.equal(match([item("牛奶", 1, "盒"), item("草莓", 1, "盒"), item("蓝莓", 1, "盒")]).recipe.isMilkshake, true);
assert.equal(match([{ ...item("香蕉", 1, "个"), category: "水果" }, item("牛奶", 1, "盒")]).recipe.name, "香蕉奶昔");
assert.equal(match([item("牛奶", 1, "盒"), item("苹果", 1, "个")], { prompt: "想喝汤" }), null);
const threeFruitPlatter = match([item("苹果", 1, "个"), item("桃子", 1, "个"), item("蓝莓", 1, "盒")]);
assert.equal(threeFruitPlatter.recipe.name, "苹果桃子蓝莓水果拼盘");
assert.equal(threeFruitPlatter.recipe.ingredients.length, 3);
assert.equal(match([item("牛奶", 1, "盒"), item("苹果", 1, "个"), item("桃子", 1, "个"), item("蓝莓", 1, "盒")]).recipe.isFruitPlatter, true);
const customFruitPlatter = match([item("苹果", 1, "个"), item("桃子", 1, "个"), item("蓝莓", 1, "盒"), { ...item("香蕉", 1, "个"), category: "水果" }]);
assert.equal(customFruitPlatter.recipe.name, "苹果桃子蓝莓香蕉水果拼盘");
assert.equal(customFruitPlatter.recipe.ingredients.length, 4);
assert.equal(match([item("苹果", 1, "个"), item("桃子", 1, "个")]).recipe.isFruitPlatter, undefined);
const resultNode = { innerHTML: "", classList: { add() {}, remove() {} }, scrollIntoView() {} };
controls["#recipeResult"] = resultNode;
controls["#generationLoading"] = { classList: { add() {} } };
match([item("鸡翅", 1, "个"), item("可乐", 1, "罐")]);
context.document.createElement = () => ({
  set textContent(value) { this.value = value; },
  get innerHTML() { return String(this.value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
});
assert.equal(vm.runInContext("['r55','r56','r57','r58','r59'].every(id => weekFoodArt(recipes.find(recipe => recipe.id === id)).includes(dishImages[id]))", context), true);
vm.runInContext("state.ingredients = testItems.map((item, index) => ({ ...item, id: String(index) })); state.selectedIds = ['0', '1']; generateRecipe()", context);
assert.match(resultNode.innerHTML, /可乐鸡翅/);
assert.match(resultNode.innerHTML, /按库存制作小份/);
assert.match(resultNode.innerHTML, /data-complete-recipe="r8"/);
assert.doesNotMatch(resultNode.innerHTML, /data-complete-recipe="r8" disabled/);
controls["#consumeRows"] = { innerHTML: "" };
controls["#consumeModalBackdrop"] = { classList: { add() {} } };
vm.runInContext("completeRecipe('r8')", context);
assert.match(controls["#consumeRows"].innerHTML, /value="0.1" data-consume-id="1"/);
match([item("苹果", 1, "个"), item("桃子", 1, "个"), item("蓝莓", 1, "盒")]);
vm.runInContext("state.ingredients = testItems.map((item, index) => ({ ...item, id: String(index) })); state.selectedIds = ['0', '1', '2']; generateRecipe()", context);
assert.match(resultNode.innerHTML, /苹果桃子蓝莓水果拼盘/);
assert.match(resultNode.innerHTML, /选中至少三种水果/);
assert.equal(vm.runInContext("recipes.length >= 64", context), true);
assert.equal(vm.runInContext("new Set(recipes.map(recipe => recipe.id)).size === recipes.length", context), true);
assert.equal(vm.runInContext("recipes.every(recipe => recipe.ingredients.length > 0 && recipe.ingredients.every(item => parseAmount(item.amount)))", context), true);
assert.equal(vm.runInContext("rankedSuggestions().every(recipe => recipe.type !== '轻食' && recipe.time <= 60)", context), true);
const weekPlan = vm.runInContext("buildWeekPlan()", context);
assert.equal(weekPlan.length, 21);
assert.equal(new Set(weekPlan).size, 21);
context.testWeekPlan = weekPlan;
assert.equal(vm.runInContext("testWeekPlan.every((id, index) => weekMealRecipeIds[weekMeals[Math.floor(index / 7)]].includes(id))", context), true);
assert.equal(vm.runInContext("testWeekPlan.slice(0, 7).every(id => recipes.find(recipe => recipe.id === id).time <= 30)", context), true);
assert.equal(vm.runInContext("buildWeekPlan(1).some((id, index) => id !== testWeekPlan[index])", context), true);
for (const selector of ["#weekDays", "#weekGrid", "#shoppingList"]) controls[selector] = { innerHTML: "", textContent: "" };
controls["#weekRecipePopover"] = { innerHTML: "", style: {}, offsetHeight: 190, classList: { add() {}, remove() {} } };
vm.runInContext("state.weekPlan = ['r10', 'r3', 'r1', 'r7', 'r4', 'r6', 'r2']; renderWeek()", context);
assert.equal(vm.runInContext("state.weekPlan.length", context), 21);
assert.equal((controls["#weekGrid"].innerHTML.match(/class="day-card /g) || []).length, 21);
assert.equal((controls["#weekDays"].innerHTML.match(/class="week-day /g) || []).length, 7);
assert.match(controls["#weekDays"].innerHTML, /周一/);
assert.match(controls["#weekDays"].innerHTML, /\d+月\d+日/);
assert.match(controls["#weekGrid"].innerHTML, /aria-label="周一早餐"/);
assert.match(controls["#weekGrid"].innerHTML, /aria-label="周日晚餐"/);
assert.equal((controls["#weekGrid"].innerHTML.match(/data-week-recipe=/g) || []).length, 21);
assert.match(controls["#weekGrid"].innerHTML, /assets\/foods\/[^" ]+\.png/);
assert.doesNotMatch(controls["#weekGrid"].innerHTML, /库存匹配|分钟/);
context.window = { innerWidth: 1280, innerHeight: 800 };
context.testAnchor = { getBoundingClientRect: () => ({ left: 200, top: 200, bottom: 320 }) };
vm.runInContext("openWeekRecipePopover(state.weekPlan[0], testAnchor)", context);
assert.match(controls["#weekRecipePopover"].innerHTML, /查看完整做法/);
assert.match(controls["#weekRecipePopover"].innerHTML, /data-open-recipe=/);
for (const selector of ["#favoriteCount", "#historyCount", "#favoriteGrid"]) controls[selector] = { innerHTML: "", textContent: "" };
controls["#favoriteEmpty"] = { classList: { toggle() {} } };
vm.runInContext("state.favorites = ['r55', 'r59']; ui.favoriteTab = 'saved'; renderFavorites()", context);
assert.equal((controls["#favoriteGrid"].innerHTML.match(/class="recipe-card"/g) || []).length, 2);
assert.match(controls["#favoriteGrid"].innerHTML, /assets\/dishes\/stir_fried_beef\.png/);
assert.match(controls["#favoriteGrid"].innerHTML, /鱼香肉丝/);
assert.match(controls["#favoriteGrid"].innerHTML, /data-cook-recipe="r55"/);
controls["#recipeSearchInput"] = { value: "鱼香" };
controls["#recipeSearchResults"] = { innerHTML: "" };
controls["#recipeLookupDetail"] = { innerHTML: "", classList: { remove() {} }, scrollIntoView() {} };
vm.runInContext("renderRecipeSearch()", context);
assert.match(controls["#recipeSearchResults"].innerHTML, /鱼香肉丝/);
assert.doesNotMatch(controls["#recipeSearchResults"].innerHTML, /小炒牛肉/);
vm.runInContext("showPage = () => {}; showCookRecipe('r59')", context);
assert.match(controls["#recipeLookupDetail"].innerHTML, /烹饪做法/);
assert.match(controls["#recipeLookupDetail"].innerHTML, /黑木耳/);
storage.set("foodmind-state-v1", JSON.stringify({ ingredients: [item("牛奶", 1, "盒")], selectedIds: ["old-selection"], photoImportVersion: 6 }));
assert.equal(vm.runInContext("loadState().selectedIds.length", context), 0);
vm.runInContext("state.ingredients = [{ id: 'tomato', name: '西红柿', category: '蔬菜', unit: '个', quantity: 1, image: 'data:image/png;base64,AAAA', note: '由照片导入', expiryDate: '2099-01-01' }]; renderPantry = () => {}", context);
assert.equal(vm.runInContext("preferredFoodImage('西红柿')", context), "assets/foods/tomato.png");
vm.runInContext("moveMisidentifiedOrangePhoto(state.ingredients[0])", context);
assert.equal(vm.runInContext("state.ingredients.find(item => item.name === '西红柿').image", context), undefined);
assert.equal(vm.runInContext("state.ingredients.find(item => item.name === '橙子').category", context), "水果");
assert.equal(vm.runInContext("preferredFoodImage('橙子')", context), "data:image/png;base64,AAAA");
Object.assign(controls, {
  "[data-add-tab='photo']": { classList: { contains: () => false } },
  "#ingredientActor": { value: "家庭成员B" },
  "#ingredientName": { value: "家庭测试食材" }, "#ingredientCategory": { value: "其他" },
  "#ingredientStorage": { value: "常温" }, "#ingredientQuantity": { value: "2" },
  "#ingredientUnit": { value: "袋" }, "#purchaseDate": { value: "2099-01-01" },
  "#expiryDate": { value: "2099-01-05" }, "#ingredientNote": { value: "" }
});
vm.runInContext("renderCategories = () => {}; closeAdd = () => {}; toast = () => {}; ui.editingId = null; state.familyActivity = []; submitIngredient({ preventDefault() {} }); renderFamilyActivity()", context);
assert.match(controls["#familyActivityList"].innerHTML, /家庭成员 B.*家庭测试食材.*2袋到常温区/);
assert.equal(vm.runInContext("state.ingredients.find(item => item.name === '家庭测试食材').addedBy", context), "家庭成员B");
controls["#foodhubPostCount"] = { textContent: "" };
controls["#foodhubFeed"] = { innerHTML: "" };
let composerOpen = false;
controls["#foodhubComposerBackdrop"] = { classList: {
  remove: name => { if (name === "hidden") composerOpen = true; },
  add: name => { if (name === "hidden") composerOpen = false; }
} };
controls["#foodhubDish"] = { focus() {} };
vm.runInContext("renderFoodHub()", context);
assert.match(controls["#foodhubFeed"].innerHTML, /可乐鸡翅/);
assert.match(controls["#foodhubFeed"].innerHTML, /foodhub-post-content/);
assert.match(controls["#foodhubFeed"].innerHTML, /data-hub-comment-form="hub-demo-1"/);
vm.runInContext("openFoodHubComposer()", context);
assert.equal(composerOpen, true);
vm.runInContext("closeFoodHubComposer()", context);
assert.equal(composerOpen, false);
assert.equal(vm.runInContext("commentFoodHubPost('hub-demo-1', '<script>alert(1)</script>')", context), true);
assert.doesNotMatch(controls["#foodhubFeed"].innerHTML, /<script>/);
assert.match(controls["#foodhubFeed"].innerHTML, /&lt;script&gt;/);
vm.runInContext("toggleFoodHubLike('hub-demo-1')", context);
assert.equal(vm.runInContext("state.foodHubPosts[0].likes", context), 25);
assert.equal(vm.runInContext("publishFoodHubPost('r60', '我做的西红柿炒蛋')", context), true);
assert.match(controls["#foodhubFeed"].innerHTML, /我做的西红柿炒蛋/);
assert.equal(JSON.parse(storage.get("foodmind-state-v1")).foodHubPosts[0].author, "鲜小厨");
storage.set("foodmind-state-v1", JSON.stringify({ ingredients: [], photoImportVersion: 6, foodHubPosts: [{ author: "林小满", avatar: "林", comments: [{ author: "林小满", text: "好吃" }] }] }));
const renamedHubState = vm.runInContext("loadState()", context);
assert.equal(renamedHubState.foodHubPosts[0].author, "鲜小厨");
assert.equal(renamedHubState.foodHubPosts[0].avatar, "鲜");
assert.equal(renamedHubState.foodHubPosts[0].comments[0].author, "鲜小厨");
assert.equal(JSON.parse(storage.get("foodmind-state-v1")).foodHubPosts[0].author, "鲜小厨");
const oldPosts = vm.runInContext("demoFoodHubPosts().slice(0, 3)", context);
oldPosts[0].likes = 26;
oldPosts[0].comments.push({ id: "visitor-comment", author: "鲜小厨", text: "我也做过" });
oldPosts[1].comments = [];
storage.set("foodmind-state-v1", JSON.stringify({ ingredients: [], photoImportVersion: 6, foodHubPosts: oldPosts }));
const upgradedHubState = vm.runInContext("loadState()", context);
assert.equal(upgradedHubState.foodHubPosts.length, 5);
assert.equal(upgradedHubState.foodHubPosts[0].likes, 26);
assert.equal(upgradedHubState.foodHubPosts[0].comments.some(comment => comment.id === "visitor-comment"), true);
assert.equal(upgradedHubState.foodHubPosts[1].comments.length, 2);
assert.equal(upgradedHubState.foodHubPosts[4].comments.length, 2);
assert.equal(vm.runInContext("ensureDemoFoodHubPosts(loadState().foodHubPosts).changed", context), false);
console.log("Cooking matcher and weekly plan checks passed");
