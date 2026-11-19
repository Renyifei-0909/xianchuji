const STORAGE_KEY = "foodmind-state-v1";
const PHOTO_IMPORT_VERSION = 6;
const WEEK_RECIPE_VERSION = 2;

const photoExampleNames = ["生菜", "豆腐", "土豆", "紫洋葱", "虾仁", "猪排", "五花肉", "鸡胸肉", "排骨", "肥牛卷", "草莓", "面包", "猕猴桃", "樱桃", "蓝莓", "荔枝", "苹果", "柠檬", "李子", "西瓜", "桃子", "馒头", "挂面", "大米", "胡萝卜", "小米", "红豆", "绿豆", "黄豆", "花生", "蘑菇", "玉米", "茄子", "黄瓜", "西葫芦", "苦瓜", "长豆角", "荷兰豆", "牛肉", "鸡腿肉", "可乐", "鸡翅"];

const categories = ["全部", "蔬菜", "水果", "肉类", "水产", "蛋奶", "主食", "调味品", "饮料", "零食", "其他"];

const ingredientMeta = {
  "西红柿": { emoji: "🍅", category: "蔬菜", storage: "冷藏", unit: "个", life: 6 },
  "鸡蛋": { emoji: "🥚", category: "蛋奶", storage: "冷藏", unit: "个", life: 18 },
  "土豆": { emoji: "🥔", category: "蔬菜", storage: "常温", unit: "个", life: 20 },
  "胡萝卜": { emoji: "🥕", category: "蔬菜", storage: "冷藏", unit: "根", life: 12 },
  "牛奶": { emoji: "🥛", category: "蛋奶", storage: "冷藏", unit: "盒", life: 6 },
  "生菜": { emoji: "🥬", category: "蔬菜", storage: "冷藏", unit: "颗", life: 5 },
  "鸡胸肉": { emoji: "🍗", category: "肉类", storage: "冷冻", unit: "g", life: 30 },
  "面条": { emoji: "🍜", category: "主食", storage: "常温", unit: "袋", life: 90 },
  "豆腐": { emoji: "⬜", category: "蛋奶", storage: "冷藏", unit: "盒", life: 5 },
  "青椒": { emoji: "🫑", category: "蔬菜", storage: "冷藏", unit: "个", life: 7 },
  "橙子": { emoji: "🍊", category: "水果", storage: "冷藏", unit: "个", life: 10 },
  "牛肉": { emoji: "🥩", category: "肉类", storage: "冷冻", unit: "g", life: 30 },
  "鸡腿肉": { emoji: "🍗", category: "肉类", storage: "冷冻", unit: "g", life: 30 },
  "玉米": { emoji: "🌽", category: "主食", storage: "冷藏", unit: "根", life: 8 },
  "虾仁": { emoji: "🍤", category: "水产", storage: "冷冻", unit: "g", life: 25 },
  "大虾": { emoji: "🦐", category: "水产", storage: "冷冻", unit: "g", life: 25 },
  "芹菜": { emoji: "🥬", category: "蔬菜", storage: "冷藏", unit: "把", life: 6 },
  "黑木耳": { emoji: "🍄", category: "蔬菜", storage: "常温", unit: "g", life: 90 },
  "蘑菇": { emoji: "🍄", category: "蔬菜", storage: "冷藏", unit: "盒", life: 6 },
  "洋葱": { emoji: "🧅", category: "蔬菜", storage: "常温", unit: "个", life: 20 },
  "西兰花": { emoji: "🥦", category: "蔬菜", storage: "冷藏", unit: "颗", life: 7 },
  "米饭": { emoji: "🍚", category: "主食", storage: "常温", unit: "g", life: 180 },
  "可乐": { emoji: "🥤", category: "饮料", storage: "常温", unit: "罐", life: 120 },
  "鸡翅": { emoji: "🍗", category: "肉类", storage: "冷冻", unit: "个", life: 30 },
  "面包": { emoji: "🍞", category: "主食", storage: "常温", unit: "袋", life: 5 },
  "紫洋葱": { emoji: "🧅", category: "蔬菜", storage: "常温", unit: "个", life: 20 },
  "猪排": { emoji: "🥩", category: "肉类", storage: "冷冻", unit: "g", life: 30 },
  "五花肉": { emoji: "🥓", category: "肉类", storage: "冷冻", unit: "g", life: 30 },
  "排骨": { emoji: "🍖", category: "肉类", storage: "冷冻", unit: "g", life: 30 },
  "肥牛卷": { emoji: "🥩", category: "肉类", storage: "冷冻", unit: "g", life: 30 },
  "草莓": { emoji: "🍓", category: "水果", storage: "冷藏", unit: "盒", life: 4 },
  "猕猴桃": { emoji: "🥝", category: "水果", storage: "冷藏", unit: "个", life: 7 },
  "樱桃": { emoji: "🍒", category: "水果", storage: "冷藏", unit: "盒", life: 5 },
  "蓝莓": { emoji: "🫐", category: "水果", storage: "冷藏", unit: "盒", life: 6 },
  "荔枝": { emoji: "🍒", category: "水果", storage: "冷藏", unit: "盒", life: 4 },
  "苹果": { emoji: "🍎", category: "水果", storage: "冷藏", unit: "个", life: 18 },
  "柠檬": { emoji: "🍋", category: "水果", storage: "冷藏", unit: "个", life: 14 },
  "李子": { emoji: "🍑", category: "水果", storage: "冷藏", unit: "个", life: 7 },
  "西瓜": { emoji: "🍉", category: "水果", storage: "常温", unit: "个", life: 7 },
  "桃子": { emoji: "🍑", category: "水果", storage: "冷藏", unit: "个", life: 6 },
  "馒头": { emoji: "🍞", category: "主食", storage: "冷冻", unit: "个", life: 30 },
  "挂面": { emoji: "🍜", category: "主食", storage: "常温", unit: "袋", life: 90 },
  "大米": { emoji: "🍚", category: "主食", storage: "常温", unit: "g", life: 180 },
  "小米": { emoji: "🌾", category: "主食", storage: "常温", unit: "g", life: 180 },
  "红豆": { emoji: "🫘", category: "主食", storage: "常温", unit: "g", life: 180 },
  "绿豆": { emoji: "🫘", category: "主食", storage: "常温", unit: "g", life: 180 },
  "黄豆": { emoji: "🫘", category: "主食", storage: "常温", unit: "g", life: 180 },
  "花生": { emoji: "🥜", category: "零食", storage: "常温", unit: "g", life: 90 },
  "杏鲍菇": { emoji: "🍄", category: "蔬菜", storage: "冷藏", unit: "个", life: 6 },
  "茄子": { emoji: "🍆", category: "蔬菜", storage: "冷藏", unit: "根", life: 6 },
  "黄瓜": { emoji: "🥒", category: "蔬菜", storage: "冷藏", unit: "根", life: 6 },
  "西葫芦": { emoji: "🥒", category: "蔬菜", storage: "冷藏", unit: "根", life: 6 },
  "苦瓜": { emoji: "🥒", category: "蔬菜", storage: "冷藏", unit: "根", life: 5 },
  "长豆角": { emoji: "🫛", category: "蔬菜", storage: "冷藏", unit: "把", life: 5 },
  "荷兰豆": { emoji: "🫛", category: "蔬菜", storage: "冷藏", unit: "把", life: 5 }
};
const foodImages = {
  "西红柿": "tomato.png", "牛奶": "milk.png", "鸡蛋": "egg.png", "可乐": "cola.png", "鸡翅": "chicken_wing.png",
  "生菜": "lettuce.png", "豆腐": "tofu.png", "土豆": "potato.png",
  "洋葱": "onion.png", "紫洋葱": "onion.png", "虾仁": "shrimp.png",
  "猪排": "pork_chop.png", "五花肉": "pork_belly.png",
  "鸡胸肉": "chicken_breast.png", "鸡腿肉": "chicken_leg.png", "牛肉": "beef.png", "排骨": "ribs.png", "肥牛卷": "beef_rolls.png",
  "草莓": "strawberry.png", "面包": "bread.png", "猕猴桃": "kiwi.png",
  "樱桃": "cherry.png", "蓝莓": "blueberry.png", "荔枝": "lychee.png",
  "苹果": "apple.png", "柠檬": "lemon.png", "李子": "plum.png",
  "西瓜": "watermelon.png", "桃子": "peach.png", "馒头": "steamed_bun.png",
  "挂面": "dried_noodles.png", "面条": "dried_noodles.png", "大米": "uncooked_rice.png",
  "胡萝卜": "carrot.png", "小米": "millet.png", "红豆": "red_beans.png",
  "绿豆": "mung_beans.png", "黄豆": "soybeans.png", "花生": "peanuts.png",
  "蘑菇": "king_oyster_mushroom.png", "杏鲍菇": "king_oyster_mushroom.png", "玉米": "corn.png",
  "茄子": "eggplant.png", "黄瓜": "cucumber.png", "西葫芦": "zucchini.png",
  "苦瓜": "bitter_melon.png", "长豆角": "long_bean.png", "荷兰豆": "snow_pea.png"
};
const dishImages = {
  "r8": "cola_chicken_wings.png", "r60": "tomato_eggs.png", "r61": "minced_pork_long_beans.png",
  "r62": "hot_sour_potato.png", "r63": "pepper_pork.png", "r64": "stir_fried_broccoli.png",
  "r55": "stir_fried_beef.png", "r56": "stir_fried_snow_peas.png", "r57": "braised_prawns.png",
  "r58": "minced_pork_tofu.png", "r59": "fish_flavored_pork.png"
};
function recipeArtwork(recipe, className = "dish-artwork") {
  const file = dishImages[recipe.id];
  return file ? `<img class="${className}" src="assets/dishes/${file}" alt="${safe(recipe.name)}">` : recipe.emoji;
}
function preferredFoodImage(name, image = "") {
  const owner = state.ingredients.find(item => canonicalIngredient(item.name) === canonicalIngredient(name) && item.image);
  const uploaded = name === "西红柿" && owner?.photoVerifiedName !== "西红柿" ? "" : image || owner?.image;
  if (uploaded && /^data:image\/(?:png|jpeg|webp);base64,/i.test(uploaded)) return uploaded;
  return foodImages[name] ? `assets/foods/${foodImages[name]}` : "";
}
function foodArtwork(name, category, className = "food-artwork", image = "") {
  const source = preferredFoodImage(name, image);
  return source ? `<img class="${className}" src="${source}" alt="${safe(name)}" loading="lazy">` : `<span class="food-emoji">${metaFor(name, category).emoji}</span>`;
}

const recipes = [
  { id: "r1", name: "番茄鸡蛋面", emoji: "🍜", type: "主食", taste: "咸香", time: 20, difficulty: "简单", calories: 420, desc: "酸甜番茄汤底裹住筋道面条，是忙碌日子里最治愈的一碗。", ingredients: [{name:"西红柿",amount:"2 个"},{name:"鸡蛋",amount:"2 个"},{name:"面条",amount:"1 袋"}], seasonings: "盐、生抽、葱花、食用油", steps: ["西红柿切块，鸡蛋加少许盐打散。","热锅放油，将鸡蛋炒至蓬松后盛出。","原锅放入西红柿炒出汁，加两碗清水煮开。","放入面条煮熟，倒回鸡蛋，加盐和生抽调味。"] },
  { id: "r2", name: "胡萝卜土豆咖喱鸡", emoji: "🍛", type: "家常菜", taste: "咸香", time: 35, difficulty: "中等", calories: 510, desc: "软糯根茎蔬菜吸满咖喱汁，搭配嫩鸡肉，一锅就能满足全家。", ingredients: [{name:"土豆",amount:"2 个"},{name:"胡萝卜",amount:"1 根"},{name:"鸡胸肉",amount:"300g"},{name:"洋葱",amount:"半个"}], seasonings: "咖喱块、盐、黑胡椒", steps: ["土豆、胡萝卜和洋葱切块，鸡胸肉切丁。","鸡肉煎至表面变白，加入洋葱炒香。","加入土豆和胡萝卜翻炒，倒入清水没过食材。","炖煮 18 分钟，关小火放咖喱块搅匀即可。"] },
  { id: "r3", name: "低脂鸡胸生菜卷", emoji: "🥗", type: "轻食", taste: "清淡", time: 18, difficulty: "简单", calories: 280, desc: "清爽脆嫩的生菜包裹香煎鸡胸，轻盈却有满足感。", ingredients: [{name:"鸡胸肉",amount:"200g"},{name:"生菜",amount:"6 片"},{name:"胡萝卜",amount:"半根"}], seasonings: "黑胡椒、盐、生抽、柠檬汁", steps: ["鸡胸肉切条，用盐和黑胡椒腌制 8 分钟。","平底锅少油煎熟鸡胸肉，胡萝卜切细丝。","生菜洗净沥干，放入鸡肉和胡萝卜丝。","淋少量生抽与柠檬汁，卷起食用。"] },
  { id: "r4", name: "青椒土豆丝", emoji: "🥘", type: "家常菜", taste: "香辣", time: 15, difficulty: "简单", calories: 210, desc: "爽脆下饭的经典家常菜，十五分钟就能端上桌。", ingredients: [{name:"土豆",amount:"2 个"},{name:"青椒",amount:"1 个"}], seasonings: "盐、醋、干辣椒、食用油", steps: ["土豆切细丝后用清水洗去淀粉。","青椒切丝，锅中热油爆香干辣椒。","大火放入土豆丝快速翻炒。","加入青椒、盐和少许醋，炒匀即可。"] },
  { id: "r5", name: "番茄炖牛肉", emoji: "🍲", type: "家常菜", taste: "酸甜", time: 55, difficulty: "中等", calories: 480, desc: "牛肉酥软、汤汁浓郁，番茄的酸甜让整锅味道格外开胃。", ingredients: [{name:"牛肉",amount:"400g"},{name:"西红柿",amount:"3 个"},{name:"土豆",amount:"1 个"},{name:"洋葱",amount:"半个"}], seasonings: "盐、生抽、姜、香叶", steps: ["牛肉切块冷水焯水，西红柿和土豆切块。","洋葱炒香，加入西红柿炒出浓汤。","放牛肉、生抽和香叶，加热水炖 35 分钟。","加入土豆再炖 15 分钟，以盐调味。"] },
  { id: "r6", name: "虾仁西兰花", emoji: "🍤", type: "家常菜", taste: "清淡", time: 16, difficulty: "简单", calories: 240, desc: "鲜甜虾仁配上爽脆西兰花，色彩明亮、营养均衡。", ingredients: [{name:"虾仁",amount:"200g"},{name:"西兰花",amount:"1 颗"},{name:"胡萝卜",amount:"半根"}], seasonings: "盐、蒜、生抽、淀粉", steps: ["虾仁以盐和淀粉抓匀，西兰花掰小朵。","西兰花和胡萝卜焯水一分钟捞出。","热锅爆香蒜末，虾仁炒至变色。","加入蔬菜快速翻炒，以盐和生抽调味。"] },
  { id: "r7", name: "蘑菇豆腐汤", emoji: "🥣", type: "汤羹", taste: "清淡", time: 22, difficulty: "简单", calories: 180, desc: "清鲜柔和的一碗暖汤，蘑菇的鲜味让简单食材也很出彩。", ingredients: [{name:"蘑菇",amount:"1 盒"},{name:"豆腐",amount:"1 盒"},{name:"鸡蛋",amount:"1 个"}], seasonings: "盐、白胡椒、香油、葱花", steps: ["蘑菇切片，豆腐切小块。","锅中加清水，放蘑菇煮出鲜味。","加入豆腐煮 4 分钟，淋入蛋液。","以盐和白胡椒调味，滴香油出锅。"] },
  { id: "r8", name: "可乐鸡翅", emoji: "🍗", type: "家常菜", taste: "酸甜", time: 30, difficulty: "中等", calories: 560, desc: "色泽红亮、咸甜入味，是新手也不容易失败的人气菜。", ingredients: [{name:"鸡翅",amount:"8 个"},{name:"可乐",amount:"1 罐"}], seasonings: "生抽、姜片、料酒、盐", steps: ["鸡翅两面划刀，冷水下锅焯去浮沫。","少油将鸡翅煎至两面金黄。","加入姜片、生抽和可乐，液体没过鸡翅。","中火焖约 15 分钟，大火收浓汤汁。"] },
  { id: "r9", name: "玉米胡萝卜浓汤", emoji: "🌽", type: "汤羹", taste: "清淡", time: 28, difficulty: "简单", calories: 260, desc: "自然清甜、温润顺口，适合作为轻松晚餐。", ingredients: [{name:"玉米",amount:"1 根"},{name:"胡萝卜",amount:"1 根"},{name:"牛奶",amount:"1 盒"}], seasonings: "盐、黑胡椒、黄油", steps: ["玉米剥粒，胡萝卜切小丁。","胡萝卜与玉米煮熟，取一半加牛奶打碎。","倒回锅中与剩余食材一起加热。","以盐和黑胡椒调味，不要煮沸过久。"] },
  { id: "r10", name: "牛奶鸡蛋吐司", emoji: "🍞", type: "主食", taste: "咸香", time: 12, difficulty: "简单", calories: 330, desc: "外焦内软的快手早餐，也适合消耗临期牛奶和面包。", ingredients: [{name:"牛奶",amount:"半盒"},{name:"鸡蛋",amount:"1 个"},{name:"面包",amount:"2 片"}], seasonings: "盐或蜂蜜、少量黄油", steps: ["鸡蛋与牛奶搅匀，按口味加盐或蜂蜜。","面包两面快速蘸满蛋奶液。","平底锅放少量黄油，小火煎至两面金黄。","出锅后搭配水果或生菜食用。"] }
];

// Curated home recipes for two people; recommendations only select from these recipes.
const additionalRecipes = [
  ["r11", "荷兰豆炒虾仁", "家常菜", "清淡", 15, "🫛", "荷兰豆:1把|虾仁:200g", "盐、蒜、食用油", ["荷兰豆去筋洗净，虾仁解冻并沥干。", "荷兰豆焯水约 1 分钟，捞出。", "热锅少油炒熟虾仁，放入荷兰豆和蒜末翻炒，以盐调味。"]],
  ["r12", "荷兰豆炒蘑菇", "家常菜", "清淡", 15, "🍄", "荷兰豆:1把|蘑菇:1盒", "盐、蒜、食用油", ["荷兰豆去筋，蘑菇切片。", "荷兰豆焯水 1 分钟。", "蘑菇炒软后加入荷兰豆和蒜末，炒匀调味。"]],
  ["r13", "鸡胸肉炒荷兰豆", "家常菜", "咸香", 20, "🍗", "鸡胸肉:200g|荷兰豆:1把", "盐、生抽、淀粉、食用油", ["鸡胸肉切片，以少许生抽和淀粉抓匀。", "荷兰豆去筋焯水 1 分钟。", "鸡肉炒至熟透，再加入荷兰豆翻炒调味。"]],
  ["r14", "茄子烧长豆角", "家常菜", "咸香", 25, "🍆", "茄子:1根|长豆角:1把", "蒜、生抽、盐、食用油", ["茄子切条，长豆角切段。", "长豆角先炒至完全熟透，盛出。", "茄子炒软后放回豆角，加入蒜末和生抽炒匀。"]],
  ["r15", "番茄烧茄子", "家常菜", "酸甜", 22, "🍅", "西红柿:2个|茄子:1根", "盐、蒜、食用油", ["西红柿切块，茄子切条。", "茄子少油煎软，加入西红柿炒出汁。", "加少量水焖 5 分钟，放蒜末和盐收汁。"]],
  ["r16", "黄瓜炒鸡蛋", "家常菜", "清淡", 12, "🥒", "黄瓜:1根|鸡蛋:2个", "盐、食用油", ["黄瓜切片，鸡蛋打散。", "鸡蛋炒熟盛出。", "黄瓜大火快炒，倒回鸡蛋加盐拌匀。"]],
  ["r17", "黄瓜鸡胸肉丁", "家常菜", "咸香", 18, "🥒", "黄瓜:1根|鸡胸肉:200g", "盐、生抽、淀粉、食用油", ["鸡胸肉切丁并用生抽、淀粉抓匀，黄瓜切丁。", "鸡肉炒至完全熟透。", "加入黄瓜快速翻炒，加盐调味。"]],
  ["r18", "西葫芦炒鸡蛋", "家常菜", "清淡", 15, "🥚", "西葫芦:1根|鸡蛋:2个", "盐、食用油", ["西葫芦切片，鸡蛋打散。", "鸡蛋炒熟盛出。", "西葫芦炒软后倒回鸡蛋，加盐炒匀。"]],
  ["r19", "西葫芦炒虾仁", "家常菜", "清淡", 18, "🍤", "西葫芦:1根|虾仁:200g", "盐、蒜、食用油", ["西葫芦切片，虾仁解冻沥干。", "虾仁炒至变色熟透后盛出。", "西葫芦炒软，放回虾仁和蒜末调味。"]],
  ["r20", "苦瓜炒鸡蛋", "家常菜", "清淡", 18, "🥚", "苦瓜:1根|鸡蛋:2个", "盐、食用油", ["苦瓜去瓤切薄片，用少许盐抓匀后冲洗。", "苦瓜焯水约 1 分钟，鸡蛋打散。", "苦瓜炒热后倒入蛋液，炒至凝固熟透。"]],
  ["r21", "苦瓜炒五花肉", "家常菜", "咸香", 22, "🥓", "苦瓜:1根|五花肉:200g", "盐、生抽、食用油", ["苦瓜去瓤切片，五花肉切薄片。", "五花肉煸出油并炒至熟透。", "加入苦瓜炒软，用少量生抽和盐调味。"]],
  ["r22", "长豆角炒五花肉", "家常菜", "咸香", 25, "🥓", "长豆角:1把|五花肉:200g", "盐、蒜、生抽、食用油", ["长豆角切段，五花肉切片。", "五花肉炒熟后加入长豆角和少量水。", "盖锅焖至豆角完全熟透，加入蒜末和生抽收汁。"]],
  ["r23", "洋葱炒肥牛", "家常菜", "咸香", 15, "🥩", "肥牛卷:200g|紫洋葱:1个", "盐、生抽、食用油", ["紫洋葱切丝，肥牛卷焯水至变色。", "洋葱炒软，倒入肥牛卷。", "加生抽和少量盐炒匀即可。"]],
  ["r24", "番茄肥牛汤", "汤羹", "酸甜", 18, "🍲", "西红柿:2个|肥牛卷:200g", "盐、生抽、食用油", ["西红柿切块炒出汁，加水煮开。", "放肥牛卷煮至完全熟透。", "加盐和少量生抽调味。"]],
  ["r25", "蘑菇肥牛煲", "家常菜", "咸香", 20, "🍲", "蘑菇:1盒|肥牛卷:200g", "盐、生抽、蒜、食用油", ["蘑菇切片，肥牛卷焯水。", "蘑菇炒软后加入少量水。", "放肥牛卷煮透，加蒜末、生抽和盐调味。"]],
  ["r26", "土豆炖排骨", "家常菜", "咸香", 55, "🍖", "排骨:300g|土豆:2个", "姜、生抽、盐、食用油", ["排骨冷水焯去浮沫，土豆切块。", "排骨加姜、生抽和热水炖约 35 分钟。", "放入土豆再炖 15 分钟，至排骨和土豆熟透后调味。"]],
  ["r27", "玉米胡萝卜排骨汤", "汤羹", "清淡", 60, "🥣", "排骨:300g|玉米:1根|胡萝卜:1根", "姜、盐", ["排骨焯水，玉米切段，胡萝卜切块。", "排骨和姜加足量水炖约 35 分钟。", "加入玉米、胡萝卜再炖 20 分钟，放盐调味。"]],
  ["r28", "青椒炒猪排", "家常菜", "咸香", 20, "🥩", "猪排:200g|青椒:1个", "盐、生抽、食用油", ["猪排切成薄片，青椒切丝。", "肉片炒至完全熟透，盛出。", "青椒炒断生，倒回肉片并用生抽调味。"]],
  ["r29", "蘑菇炒鸡胸肉", "家常菜", "咸香", 20, "🍗", "蘑菇:1盒|鸡胸肉:200g", "盐、生抽、食用油", ["鸡胸肉切片，蘑菇切片。", "鸡肉炒至完全熟透后盛出。", "蘑菇炒软，放回鸡肉，加生抽和盐炒匀。"]],
  ["r30", "虾仁豆腐煲", "家常菜", "清淡", 20, "🍤", "虾仁:200g|豆腐:1盒", "盐、姜、淀粉", ["豆腐切块，虾仁解冻沥干。", "锅中加少量水和姜，放豆腐煮 5 分钟。", "加入虾仁煮熟，放盐调味，可用少量淀粉水勾芡。"]],
  ["r31", "番茄豆腐汤", "汤羹", "酸甜", 18, "🥣", "西红柿:2个|豆腐:1盒", "盐、食用油", ["西红柿切块炒出汁，加水煮开。", "豆腐切块放入，煮约 5 分钟。", "加盐调味即可。"]],
  ["r32", "花生拌黄瓜", "轻食", "咸香", 35, "🥗", "花生:50g|黄瓜:1根", "盐、醋、香油", ["花生煮熟或炒熟并放凉；黄瓜洗净拍碎。", "将花生与黄瓜拌匀。", "加盐、醋和少量香油调味。"]],
  ["r33", "玉米虾仁蛋炒饭", "主食", "咸香", 40, "🍚", "大米:150g|玉米:1根|虾仁:150g|鸡蛋:2个", "盐、生抽、食用油", ["先用大米煮好米饭并放凉，玉米剥粒煮熟。", "鸡蛋炒散，虾仁炒至熟透。", "加入米饭和玉米粒炒热，以盐和生抽调味。"]],
  ["r34", "肥牛蘑菇面", "主食", "咸香", 20, "🍜", "挂面:1袋|肥牛卷:200g|蘑菇:1盒", "盐、生抽", ["蘑菇切片，加水煮出鲜味。", "放挂面煮至接近熟透。", "加入肥牛卷煮熟，以盐和生抽调味。"]],
  ["r35", "鸡胸肉炒面", "主食", "咸香", 25, "🍜", "挂面:1袋|鸡胸肉:200g|胡萝卜:1根", "盐、生抽、食用油", ["挂面煮至八成熟后沥干，鸡胸肉和胡萝卜切丝。", "鸡肉炒熟，加入胡萝卜炒软。", "放入面条和生抽，炒至面条熟透。"]],
  ["r36", "绿豆小米粥", "主食", "清淡", 180, "🥣", "绿豆:80g|小米:80g", "清水", ["绿豆洗净后提前浸泡 2 小时。", "绿豆加水煮至开始开花。", "加入小米继续煮至软糯，期间搅拌防粘锅。"]],
  ["r37", "红豆花生粥", "主食", "清淡", 330, "🥣", "红豆:80g|花生:50g|大米:80g", "清水", ["红豆和花生提前浸泡至少 4 小时。", "全部食材洗净加水煮开。", "转小火煮至红豆完全软烂，期间适当补水。"]],
  ["r38", "馒头夹蛋和生菜", "主食", "咸香", 12, "🍞", "馒头:2个|鸡蛋:2个|生菜:1颗", "盐、食用油", ["馒头蒸热后从中间切开。", "鸡蛋煎至熟透，生菜洗净沥干。", "把鸡蛋和生菜夹入馒头即可。"]],
  ["r39", "水果拼盘", "轻食", "清淡", 10, "🍓", "草莓:1盒|蓝莓:1盒|猕猴桃:2个", "无", ["水果洗净，猕猴桃去皮切片。", "草莓去蒂，与蓝莓和猕猴桃摆盘。", "切好后尽快食用。"]],
  ["r40", "茄子烧五花肉", "家常菜", "咸香", 25, "🍆", "茄子:1根|五花肉:200g", "盐、生抽、蒜、食用油", ["茄子切条，五花肉切薄片。", "五花肉炒熟并煸出少量油。", "放茄子和少量水焖软，加入蒜末、生抽和盐收汁。"]],
  ["r41", "柠檬香煎鸡胸肉", "家常菜", "清淡", 20, "🍋", "柠檬:1个|鸡胸肉:200g", "盐、黑胡椒、食用油", ["鸡胸肉切薄片，加盐和黑胡椒腌 5 分钟。", "平底锅少油煎至两面金黄且内部完全熟透。", "出锅后挤上适量柠檬汁。"]],
  ["r42", "玉米蘑菇汤", "汤羹", "清淡", 22, "🥣", "玉米:1根|蘑菇:1盒", "盐、白胡椒", ["玉米剥粒，蘑菇切片。", "加水煮玉米约 10 分钟。", "加入蘑菇煮熟，以盐和白胡椒调味。"]],
  ["r43", "苹果桃子水果杯", "轻食", "清淡", 10, "🍎", "苹果:1个|桃子:1个", "无", ["苹果和桃子洗净。", "去核切块后装入杯中。", "切好后尽快食用。"]],
  ["r44", "西瓜荔枝水果盘", "轻食", "清淡", 10, "🍉", "西瓜:0.25个|荔枝:1盒", "无", ["西瓜切块去籽，荔枝剥壳去核。", "摆盘后冷藏片刻即可食用。"]],
  ["r45", "樱桃蓝莓水果盘", "轻食", "清淡", 8, "🍒", "樱桃:1盒|蓝莓:1盒", "无", ["樱桃和蓝莓充分洗净。", "樱桃去核后与蓝莓摆盘。"]],
  ["r46", "李子猕猴桃水果盘", "轻食", "清淡", 10, "🥝", "李子:2个|猕猴桃:2个", "无", ["李子洗净去核，猕猴桃去皮。", "切片后摆盘，尽快食用。"]],
  ["r47", "牛奶草莓蓝莓杯", "轻食", "清淡", 10, "🥛", "牛奶:1盒|草莓:1盒|蓝莓:1盒", "无", ["草莓和蓝莓充分洗净，草莓去蒂切块。", "倒入冷牛奶，加入水果即可。"]],
  ["r48", "黄豆排骨汤", "汤羹", "清淡", 240, "🥣", "黄豆:100g|排骨:300g", "姜、盐", ["黄豆提前泡发约 3 小时，排骨冷水焯去浮沫。", "黄豆、排骨和姜加水煮开。", "转小火炖至黄豆和排骨熟软，最后加盐调味。"]],
  ["r49", "红烧鸡腿肉", "家常菜", "咸香", 35, "🍗", "鸡腿肉:300g", "姜、生抽、盐、食用油", ["鸡腿肉洗净沥干，切成适口块。", "锅中少油煎至表面变色，加入姜和生抽。", "加适量热水盖锅焖至鸡肉完全熟透，开盖收汁。"]],
  ["r50", "土豆炖鸡腿肉", "家常菜", "咸香", 40, "🍲", "鸡腿肉:300g|土豆:2个", "姜、生抽、盐、食用油", ["土豆切块，鸡腿肉切块并沥干。", "鸡腿肉炒至变色，加入姜、生抽和热水焖 15 分钟。", "放入土豆继续炖至鸡肉和土豆熟透，最后加盐调味。"]],
  ["r51", "蘑菇炒鸡腿肉", "家常菜", "咸香", 25, "🍄", "鸡腿肉:200g|蘑菇:1盒", "蒜、生抽、盐、食用油", ["鸡腿肉切小块，蘑菇切片。", "鸡肉炒至完全熟透后盛出。", "蘑菇炒软，倒回鸡肉，加蒜末和生抽炒匀。"]],
  ["r52", "洋葱炒牛肉", "家常菜", "咸香", 20, "🥩", "牛肉:200g|紫洋葱:1个", "生抽、盐、淀粉、食用油", ["牛肉逆纹切薄片，用少量生抽和淀粉抓匀，洋葱切丝。", "牛肉快速炒至熟透后盛出。", "洋葱炒软，放回牛肉翻炒调味。"]],
  ["r53", "青椒炒牛肉", "家常菜", "咸香", 20, "🥩", "牛肉:200g|青椒:1个", "生抽、盐、淀粉、食用油", ["牛肉逆纹切薄片并用少量淀粉抓匀，青椒切丝。", "牛肉炒至熟透后盛出。", "青椒炒断生，倒回牛肉并用生抽调味。"]],
  ["r54", "香煎鸡腿肉", "家常菜", "咸香", 30, "🍗", "鸡腿肉:300g", "盐、黑胡椒、食用油", ["鸡腿肉去骨后拍平，用盐和黑胡椒腌 5 分钟。", "平底锅少油，鸡皮朝下煎至金黄后翻面。", "继续煎至内部完全熟透，再切块食用。"]],
  ["r55", "小炒牛肉", "家常菜", "咸香", 20, "🥩", "牛肉:200g|洋葱:1个|青椒:1个", "生抽、盐、淀粉、食用油", ["牛肉逆纹切薄片，加少量生抽和淀粉抓匀；洋葱、青椒切丝。", "热锅快炒牛肉至熟透，盛出。", "洋葱和青椒炒至断生，倒回牛肉，加盐和生抽炒匀。"]],
  ["r56", "清炒荷兰豆", "家常菜", "清淡", 12, "🫛", "荷兰豆:1把", "蒜、盐、少量食用油", ["荷兰豆去筋并洗净。", "沸水中焯约 1 分钟，捞出沥干。", "锅中少油炒香蒜末，倒入荷兰豆大火翻炒至熟，放盐调味。"]],
  ["r57", "油焖大虾", "家常菜", "咸香", 25, "🦐", "大虾:300g", "姜、葱、生抽、料酒、糖、食用油", ["大虾剪去虾须、挑去虾线，洗净沥干。", "热锅少油煎虾至两面变红，加入姜葱炒香。", "加入生抽、料酒、少量糖和水，盖锅焖至虾完全熟透，开盖收浓汤汁。"]],
  ["r58", "肉末豆腐", "家常菜", "咸香", 20, "🥣", "五花肉:150g|豆腐:1盒", "蒜、生抽、盐、淀粉、食用油", ["五花肉剁成肉末，豆腐切小块。", "肉末炒散并炒至完全熟透，加入蒜末和生抽。", "放入豆腐和少量水轻轻焖煮，最后以少量淀粉水勾芡。"]],
  ["r59", "鱼香肉丝", "家常菜", "酸甜", 30, "🥘", "芹菜:1把|黑木耳:20g|五花肉:200g|胡萝卜:1根", "蒜、姜、生抽、醋、糖、少量辣椒、淀粉", ["干黑木耳充分泡发后洗净、焯熟；芹菜、胡萝卜和五花肉切细丝。", "五花肉丝炒至完全熟透，加入姜蒜和少量辣椒炒香。", "放入芹菜、木耳和胡萝卜炒熟，再用生抽、醋、糖及少量淀粉水调成鱼香汁，炒匀收汁。"]],
  ["r60", "西红柿炒蛋", "家常菜", "酸甜", 15, "🍅", "西红柿:2个|鸡蛋:3个", "盐、糖、葱、食用油", ["西红柿切块，鸡蛋打散加少许盐。", "热锅炒熟鸡蛋盛出，再下西红柿炒软出汁。", "倒回鸡蛋，加少许盐和糖炒匀，撒葱花。"]],
  ["r61", "肉末豆角", "家常菜", "咸香", 25, "🫛", "长豆角:1把|五花肉:150g", "蒜、生抽、盐、食用油", ["长豆角去筋切小段，五花肉剁成肉末。", "豆角先焯水，再下锅炒至完全熟透。", "肉末炒散炒熟，加入蒜末、豆角、生抽和盐炒匀。"]],
  ["r62", "酸辣土豆丝", "家常菜", "香辣", 15, "🥔", "土豆:2个|青椒:1个", "醋、干辣椒、盐、食用油", ["土豆切细丝后冲洗掉表面淀粉，青椒切丝。", "热油爆香干辣椒，放土豆丝大火快炒。", "放青椒丝、盐和醋，炒至断生后出锅。"]],
  ["r63", "青椒肉丝", "家常菜", "咸香", 20, "🫑", "青椒:2个|五花肉:200g", "蒜、生抽、盐、淀粉、食用油", ["五花肉切细丝，青椒去籽切丝。", "肉丝加少量生抽、淀粉抓匀，下锅炒至熟透盛出。", "青椒与蒜末炒至断生，倒回肉丝调味炒匀。"]],
  ["r64", "清炒西兰花", "家常菜", "清淡", 12, "🥦", "西兰花:1颗", "蒜、盐、食用油", ["西兰花掰小朵，洗净后焯水约 1 分钟。", "少油炒香蒜末，下西兰花大火翻炒。", "加盐调味，炒至熟透即可。"]]
];
additionalRecipes.forEach(([id, name, type, taste, time, emoji, rawIngredients, seasonings, steps]) => {
  recipes.push({ id, name, type, taste, time, emoji, difficulty: time <= 25 ? "简单" : "中等", calories: null,
    desc: `用${rawIngredients.split("|").map(x => x.split(":")[0]).join("、")}做的家常搭配。`,
    ingredients: rawIngredients.split("|").map(x => { const [name, amount] = x.split(":"); return { name, amount }; }), seasonings, steps });
});

const breakfastRecipes = [
  ["b1", "小米牛奶粥", 25, "🥣", "小米:80g|牛奶:1盒", "清水", ["小米淘洗干净，加水煮开后转小火煮约 20 分钟。", "小米软糯后倒入牛奶，搅拌加热至温热即可，避免久煮。"]],
  ["b2", "玉米鸡蛋羹", 20, "🌽", "玉米:1根|鸡蛋:2个", "盐、温水", ["玉米剥粒煮熟，鸡蛋加温水和少量盐搅匀。", "加入玉米粒，盖上盘子，中小火蒸约 12 分钟至蛋羹凝固。"]],
  ["b3", "胡萝卜鸡蛋粥", 30, "🥣", "大米:80g|胡萝卜:1根|鸡蛋:1个", "盐、清水", ["大米洗净加水煮开，胡萝卜切细丁。", "加入胡萝卜煮至米粒软烂，淋入打散的鸡蛋，煮熟后用少量盐调味。"]],
  ["b4", "豆腐蒸蛋", 20, "🥚", "豆腐:1盒|鸡蛋:2个", "盐、温水、生抽", ["豆腐切小块放入碗中，鸡蛋加温水和盐打散后倒入。", "盖上盘子，中小火蒸约 12 分钟至完全凝固，出锅淋少量生抽。"]],
  ["b5", "鸡蛋生菜汤面", 18, "🍜", "挂面:1袋|鸡蛋:2个|生菜:1颗", "盐、生抽", ["锅中水烧开，放入挂面煮至接近熟透。", "打入鸡蛋煮熟，放入洗净的生菜烫软，以盐和少量生抽调味。"]]
];
breakfastRecipes.forEach(([id, name, time, emoji, rawIngredients, seasonings, steps]) => {
  recipes.push({ id, name, type: "主食", taste: "清淡", time, emoji, difficulty: "简单", calories: null,
    desc: "适合早餐的温热家常搭配。", ingredients: rawIngredients.split("|").map(entry => {
      const [ingredientName, amount] = entry.split(":"); return { name: ingredientName, amount };
    }), seasonings, steps });
});

const weekMeals = ["早餐", "午餐", "晚餐"];
const weekMealRecipeIds = {
  "早餐": ["r1", "r9", "r10", "r38", "b1", "b2", "b3", "b4", "b5"],
  "午餐": ["r2", "r5", "r8", "r11", "r13", "r14", "r17", "r21", "r22", "r23", "r25", "r26", "r27", "r28", "r29", "r33", "r34", "r35", "r40", "r49", "r50", "r51", "r52", "r53", "r54", "r55", "r57", "r59", "r60", "r61", "r63"],
  "晚餐": ["r4", "r6", "r7", "r12", "r15", "r16", "r18", "r19", "r20", "r24", "r30", "r31", "r42", "r41", "r56", "r58", "r62", "r64"]
};

function ensureMilkshakeRecipes(selectedItems = []) {
  const fruits = new Map();
  Object.entries(ingredientMeta).forEach(([name, meta]) => {
    if (meta.category === "水果") fruits.set(name, meta.unit);
  });
  [...state.ingredients, ...selectedItems].forEach(item => {
    if (item.category === "水果") fruits.set(item.name, item.unit);
  });
  fruits.forEach((unit, name) => {
    const id = `milkshake:${encodeURIComponent(name)}`;
    if (recipes.some(recipe => recipe.id === id)) return;
    const amount = name === "西瓜" ? "0.25个" : name === "柠檬" ? "0.5个" : `1${unit || "个"}`;
    recipes.push({ id, name: `${name}奶昔`, type: "轻食", taste: "清淡", time: 8,
      emoji: "🥤", difficulty: "简单", calories: null, isMilkshake: true,
      desc: `用牛奶和${name}现打的水果奶昔。`,
      ingredients: [{ name: "牛奶", amount: "1盒" }, { name, amount }],
      seasonings: "可选：少量蜂蜜", steps: name === "柠檬" ?
        ["柠檬洗净，取少量黄色表皮并挤出少许果汁，避免白色皮屑。", "先将冰牛奶与柠檬皮屑打匀，临喝前加入少量柠檬汁并立即饮用。"] :
        [`${name}洗净，按需去皮、去核或切块。`, `将${name}与冰牛奶放入搅拌机，打至顺滑后立即饮用。`] });
  });
}

function ensureFruitPlatterRecipe(selectedItems) {
  const fruits = [...new Map(selectedItems.filter(item => item.category === "水果" || ingredientMeta[item.name]?.category === "水果")
    .map(item => [item.name, item])).values()];
  if (fruits.length < 3) return;
  const id = `fruitplatter:${fruits.map(item => encodeURIComponent(item.name)).sort().join("+")}`;
  const ingredients = fruits.map(item => {
    const preferred = item.name === "西瓜" ? 0.25 : item.name === "柠檬" ? 0.5 : item.unit === "g" ? 150 : item.unit === "kg" ? 0.15 : 1;
    return { name: item.name, amount: `${Math.min(Number(item.quantity), preferred)}${item.unit}` };
  });
  const names = fruits.map(item => item.name);
  const recipe = { id, name: `${names.join("")}水果拼盘`, type: "轻食", taste: "清淡", time: 10,
    emoji: "🍓", difficulty: "简单", calories: null, isFruitPlatter: true,
    desc: `把选中的${names.join("、")}做成新鲜水果拼盘。`, ingredients, seasonings: "无需调料",
    steps: [`将${names.join("、")}洗净，按需去皮、去核并切成适口大小。`,
      fruits.some(item => item.name === "柠檬") ? "把其他水果分区摆盘，柠檬只取少量果汁调味。" : "将水果分区摆盘，颜色交错搭配。",
      "切好后尽快食用；喜欢冰凉口感可短暂冷藏。"] };
  const existing = recipes.find(item => item.id === id);
  if (existing) Object.assign(existing, recipe);
  else recipes.push(recipe);
}

function ensureCombinationRecipes(selectedItems) {
  const usable = [...new Map(selectedItems.filter(item => Number(item.quantity) > 0 && freshness(item).days >= 0 &&
    (!(["肉类", "水产"].includes(item.category || metaFor(item.name).category)) || Number(item.quantity) >= (item.unit === "kg" ? 0.05 : item.unit === "g" ? 50 : 1)))
    .map(item => [canonicalIngredient(item.name), item])).values()].slice(0, 12);
  const vegetables = usable.filter(item => (item.category || metaFor(item.name).category) === "蔬菜");
  const proteins = usable.filter(item => ["肉类", "水产"].includes(item.category || metaFor(item.name).category) || ["鸡蛋", "豆腐"].includes(item.name));
  const amountFor = item => `${Math.min(Number(item.quantity), item.unit === "g" ? 200 : item.unit === "kg" ? 0.2 : 1)}${item.unit}`;
  const add = (first, second) => {
    const egg = first.name === "鸡蛋", tofu = first.name === "豆腐";
    const meat = ["肉类", "水产"].includes(first.category || metaFor(first.name).category);
    const name = egg ? `${second.name}炒鸡蛋` : tofu ? `${second.name}烧豆腐` : meat ? `${first.name}炒${second.name}` : `清炒${first.name}和${second.name}`;
    if (recipes.some(recipe => recipe.name === name)) return;
    const id = `combo:${encodeURIComponent(first.name)}+${encodeURIComponent(second.name)}`;
    if (recipes.some(recipe => recipe.id === id)) return;
    const steps = egg ? [`${second.name}洗净切好，鸡蛋打散。`, `先把鸡蛋炒至凝固盛出；${second.name}炒至熟透。`, "放回鸡蛋，加少量盐炒匀即可。"]
      : tofu ? [`${second.name}洗净切好，豆腐切块。`, `将${second.name}炒至断生，加少量水和豆腐焖煮。`, "煮至食材熟透，用盐或少量生抽调味。"]
      : meat ? [`${first.name}处理干净并切成适口大小，${second.name}洗净切好。`, `先将${first.name}炒至完全熟透，再加入${second.name}。`, `继续炒至${second.name}熟透，用盐和少量生抽调味。`]
      : [`${first.name}和${second.name}洗净切好。`, "锅中放少量油，先炒较难熟的食材，再放另一种。", "炒至两种食材都熟透，加盐调味。"];
    recipes.push({ id, name, type: "家常菜", taste: meat ? "咸香" : "清淡", time: 22,
      emoji: meat ? "🥘" : "🥬", difficulty: "简单", calories: null, isCombination: true,
      desc: `用仓库中的${first.name}和${second.name}做一份家常搭配。`,
      ingredients: [first, second].map(item => ({ name: item.name, amount: amountFor(item) })),
      seasonings: "盐、食用油；可选少量生抽", steps });
  };
  for (const protein of proteins) for (const vegetable of vegetables) add(protein, vegetable);
  for (let i = 0; i < vegetables.length; i++) for (let j = i + 1; j < vegetables.length; j++) add(vegetables[i], vegetables[j]);
  for (const vegetable of vegetables.filter(item => !["西红柿", "黑木耳"].includes(item.name))) {
    const name = `清炒${vegetable.name}`;
    if (recipes.some(recipe => recipe.name === name)) continue;
    recipes.push({ id: `solo:${encodeURIComponent(vegetable.name)}`, name, type: "家常菜", taste: "清淡", time: 15,
      emoji: "🥬", difficulty: "简单", calories: null, isCombination: true,
      desc: `用现有${vegetable.name}做一道清爽家常菜。`, ingredients: [{ name: vegetable.name, amount: amountFor(vegetable) }],
      seasonings: "盐、蒜、食用油", steps: [`${vegetable.name}洗净，切成适合翻炒的大小。`, "锅中放少量油，蒜末炒香后放入食材。", "持续翻炒至完全熟透，加盐调味。"] });
  }
}

const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function offsetDate(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function initialState() {
  return {
    ingredients: [
      { id: crypto.randomUUID(), name: "西红柿", category: "蔬菜", storage: "冷藏", quantity: 3, unit: "个", purchaseDate: offsetDate(-3), expiryDate: offsetDate(2), note: "适合做汤" },
      { id: crypto.randomUUID(), name: "鸡蛋", category: "蛋奶", storage: "冷藏", quantity: 8, unit: "个", purchaseDate: offsetDate(-4), expiryDate: offsetDate(12), note: "" },
      { id: crypto.randomUUID(), name: "土豆", category: "蔬菜", storage: "常温", quantity: 4, unit: "个", purchaseDate: offsetDate(-6), expiryDate: offsetDate(14), note: "阴凉避光" },
      { id: crypto.randomUUID(), name: "胡萝卜", category: "蔬菜", storage: "冷藏", quantity: 2, unit: "根", purchaseDate: offsetDate(-5), expiryDate: offsetDate(1), note: "优先食用" },
      { id: crypto.randomUUID(), name: "牛奶", category: "蛋奶", storage: "冷藏", quantity: 2, unit: "盒", purchaseDate: offsetDate(-4), expiryDate: offsetDate(1), note: "其中一盒已开封" },
      { id: crypto.randomUUID(), name: "生菜", category: "蔬菜", storage: "冷藏", quantity: 1, unit: "颗", purchaseDate: offsetDate(-2), expiryDate: offsetDate(3), note: "" },
      { id: crypto.randomUUID(), name: "虾仁", category: "水产", storage: "冷冻", quantity: 300, unit: "g", purchaseDate: offsetDate(-8), expiryDate: offsetDate(20), note: "" },
      { id: crypto.randomUUID(), name: "面条", category: "主食", storage: "常温", quantity: 2, unit: "袋", purchaseDate: offsetDate(-10), expiryDate: offsetDate(80), note: "" }
    ],
    selectedIds: [], favorites: ["r6"], history: [], generatedRecipes: [], weekPlan: [], weekStart: "", weekGeneration: 0, shoppingChecked: [], suggestionIndex: 0
  };
}

function addPhotoExamples(target, names = photoExampleNames) {
  const missing = names.filter(name => !target.ingredients.some(item => item.name === name || name === "紫洋葱" && item.name === "洋葱"));
  missing.forEach(name => { const meta = metaFor(name); target.ingredients.push({ id: crypto.randomUUID(), name, category: meta.category, storage: meta.storage, quantity: meta.unit === "g" ? 300 : 1, unit: meta.unit, purchaseDate: offsetDate(0), expiryDate: offsetDate(meta.life), note: "图片素材示例" }); });
  return missing.length;
}

function mergeSameNameIngredients(items) {
  const merged = [], positions = new Map();
  for (const item of items) {
    const name = item.name.trim(), meta = ingredientMeta[name], key = `${canonicalIngredient(name)}|${item.unit}`;
    const normalized = { ...item, name, category: meta && (name === "橙子" || item.category === "其他" || !item.category) ? meta.category : item.category };
    if (!positions.has(key)) { positions.set(key, merged.length); merged.push(normalized); continue; }
    const existing = merged[positions.get(key)];
    if (normalized.image) existing.quantity = Number(normalized.quantity);
    else if (!existing.image) existing.quantity = Math.round((Number(existing.quantity) + Number(normalized.quantity)) * 10) / 10;
    if (normalized.expiryDate && (!existing.expiryDate || normalized.expiryDate < existing.expiryDate)) existing.expiryDate = normalized.expiryDate;
    if (normalized.purchaseDate && (!existing.purchaseDate || normalized.purchaseDate < existing.purchaseDate)) existing.purchaseDate = normalized.purchaseDate;
    if (normalized.image) { existing.image = normalized.image; existing.photoVerifiedName = normalized.photoVerifiedName; }
    if (normalized.image && meta) existing.category = meta.category;
  }
  return merged;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    let loaded;
    if (saved && Array.isArray(saved.ingredients)) {
      saved.ingredients.forEach(item => {
        if (item.name === "面团" && item.note === "图片素材示例") item.name = "馒头";
        if (item.name === "杏鲍菇" && item.note === "图片素材示例") item.name = "蘑菇";
        if (item.name === "可乐" && item.note === "图片素材示例" && item.unit === "瓶") item.unit = "罐";
      });
      loaded = { ...initialState(), ...saved };
    } else loaded = initialState();
    loaded.selectedIds = [];
    if (loaded.photoImportVersion !== PHOTO_IMPORT_VERSION) {
      const previousVersion = Number(loaded.photoImportVersion) || 0;
      const newNames = previousVersion >= 3 ? [
        ...(previousVersion < 4 ? ["荷兰豆"] : []),
        ...(previousVersion < 5 ? ["牛肉", "鸡腿肉"] : []),
        ...(previousVersion < 6 ? ["可乐", "鸡翅"] : [])
      ] : photoExampleNames;
      addPhotoExamples(loaded, newNames);
      loaded.photoImportVersion = PHOTO_IMPORT_VERSION;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
    }
    const merged = mergeSameNameIngredients(loaded.ingredients);
    if (merged.length !== loaded.ingredients.length || merged.some((item, index) => item.category !== loaded.ingredients[index].category)) {
      loaded.ingredients = merged;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
    }
    return loaded;
  } catch {
    const loaded = initialState();
    addPhotoExamples(loaded);
    loaded.photoImportVersion = PHOTO_IMPORT_VERSION;
    return loaded;
  }
}

let state = loadState();
if (Array.isArray(state.generatedRecipes)) state.generatedRecipes.filter(recipe => recipe?.id && Array.isArray(recipe.ingredients) && Array.isArray(recipe.steps) && !recipes.some(item => item.id === recipe.id)).forEach(recipe => recipes.push(recipe));
let ui = { category: "全部", storage: "全部", query: "", onlyExpiring: false, view: "grid", page: "pantry", favoriteTab: "saved", editingId: null, recognized: null, lastRecipeId: null, lastServings: 2, cookingRecipeId: null, aiRequestId: 0, aiUnavailable: false };

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function rememberDynamicRecipe(recipe) {
  if (!/^(ai:|combo:|solo:|milkshake:|fruitplatter:)/.test(recipe.id)) return;
  state.generatedRecipes = [recipe, ...(state.generatedRecipes || []).filter(item => item.id !== recipe.id)].slice(0, 40);
}
function safe(text = "") { const d = document.createElement("div"); d.textContent = String(text); return d.innerHTML; }
function metaFor(name, category = "其他") { return ingredientMeta[name] || { emoji: category === "水果" ? "🍎" : category === "肉类" ? "🥩" : category === "蔬菜" ? "🥬" : "🥫", category, storage: "冷藏", unit: "个", life: 7 }; }
function daysUntil(dateString) { const end = new Date(`${dateString}T12:00:00`); const now = new Date(); now.setHours(12, 0, 0, 0); return Math.ceil((end - now) / 86400000); }
function freshness(item) {
  const daysLeft = daysUntil(item.expiryDate);
  if (daysLeft < 0) return { key: "expired", label: `已过期 ${Math.abs(daysLeft)} 天`, days: daysLeft };
  if (daysLeft === 0) return { key: "urgent", label: "今天到期", days: 0 };
  if (daysLeft === 1) return { key: "urgent", label: "明天到期", days: 1 };
  if (daysLeft <= 3) return { key: "soon", label: `${daysLeft} 天后到期`, days: daysLeft };
  return { key: "fresh", label: "新鲜", days: daysLeft };
}
function formatDate(value) { return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(new Date(`${value}T12:00:00`)); }
function parseAmount(amount) {
  const value = String(amount).replace(/^半/, "0.5");
  const match = value.match(/(\d+(?:\.\d+)?)\s*(kg|g|个|袋|盒|瓶|罐|根|颗|片|把)/i);
  return match ? { quantity: Number(match[1]) * (match[2] === "kg" ? 1000 : 1), unit: match[2] === "kg" ? "g" : match[2] } : null;
}
function canonicalIngredient(name) {
  return ({ "面条": "挂面", "紫洋葱": "洋葱", "杏鲍菇": "蘑菇" })[name] || name;
}
function pantryAmount(name, unit) {
  return state.ingredients.filter(item => canonicalIngredient(item.name) === canonicalIngredient(name) && freshness(item).days >= 0)
    .reduce((total, item) => total + (item.unit === unit || name === "可乐" && item.unit === "瓶" && unit === "罐" ? Number(item.quantity) : item.unit === "kg" && unit === "g" ? Number(item.quantity) * 1000 : 0), 0);
}
function servingNeed(required, servings = 2) {
  const parsed = parseAmount(required.amount);
  if (!parsed) return { ...required, quantity: 0, unit: "", amount: required.amount };
  const quantity = Math.round(parsed.quantity * servings / 2 * 10) / 10;
  return { ...required, quantity, unit: parsed.unit, amount: `${quantity} ${parsed.unit}` };
}
function recipeNeeds(recipe, servings = 2) {
  const needs = recipe.ingredients.map(item => servingNeed(item, servings));
  if (needs.some(item => !item.quantity || pantryAmount(item.name, item.unit) <= 0)) return needs;
  const scale = Math.min(1, ...needs.map(item => pantryAmount(item.name, item.unit) / item.quantity));
  if (scale < 0.1) return needs;
  const scaled = needs.map(item => {
    const whole = ["鸡蛋", "鸡翅", "馒头"].includes(canonicalIngredient(item.name));
    const quantity = whole ? Math.floor(item.quantity * scale) : Math.floor(item.quantity * scale * 10 + 0.00001) / 10;
    return { ...item, quantity, amount: `${quantity} ${item.unit}` };
  });
  return scaled.some(item => item.quantity <= 0) ? needs : scaled;
}
function weeklyNeeds(plan) {
  const required = new Map();
  plan.flatMap(recipe => recipe.ingredients).forEach(item => {
    const parsed = parseAmount(item.amount); if (!parsed) return;
    const key = `${item.name}|${parsed.unit}`;
    const entry = required.get(key) || { name: item.name, unit: parsed.unit, quantity: 0 };
    entry.quantity += parsed.quantity; required.set(key, entry);
  });
  return [...required.values()].map(item => ({ ...item, quantity: Math.max(0, Math.round((item.quantity - pantryAmount(item.name, item.unit)) * 10) / 10) })).filter(item => item.quantity > 0);
}
function toast(message, type = "success") {
  const node = document.createElement("div"); node.className = `toast ${type === "error" ? "error" : ""}`; node.innerHTML = `<span>${type === "error" ? "!" : "✓"}</span><span>${safe(message)}</span>`;
  $("#toastContainer").append(node); setTimeout(() => node.remove(), 2800);
}

function renderCategories() {
  $("#categoryFilters").innerHTML = categories.map(cat => `<button class="category-chip ${ui.category === cat ? "active" : ""}" data-category="${cat}">${cat}</button>`).join("");
  $("#ingredientCategory").innerHTML = categories.filter(x => x !== "全部").map(cat => `<option>${cat}</option>`).join("");
  $("#photoCategory").innerHTML = $("#ingredientCategory").innerHTML;
}

function filteredIngredients() {
  return state.ingredients
    .filter(item => ui.category === "全部" || item.category === ui.category)
    .filter(item => ui.storage === "全部" || item.storage === ui.storage)
    .filter(item => !ui.query || item.name.toLowerCase().includes(ui.query.toLowerCase()))
    .filter(item => !ui.onlyExpiring || freshness(item).days <= 3)
    .sort((a, b) => daysUntil(a.expiryDate) - daysUntil(b.expiryDate));
}

function renderPantry() {
  const items = filteredIngredients();
  $("#pantryGrid").className = `pantry-grid ${ui.view === "list" ? "list-view" : ""}`;
  $("#pantryGrid").innerHTML = items.map(item => {
    const fresh = freshness(item); const selected = state.selectedIds.includes(item.id);
    return `<article class="ingredient-card freshness-${fresh.key}" data-id="${item.id}">
      <div class="ingredient-visual">
        <span class="freshness-pill ${fresh.key}">${fresh.label}</span>
        <button class="select-food ${selected ? "selected" : ""}" data-select="${item.id}" title="选择用于烹饪">${selected ? "✓" : "+"}</button>
        ${foodArtwork(item.name, item.category, "food-artwork", item.image)}
      </div>
      <div class="ingredient-info"><h3>${safe(item.name)}</h3><p class="category">${safe(item.category)} · ${safe(item.storage)}保存</p>
        <div class="ingredient-meta"><div><span>剩余数量</span><strong>${item.quantity} ${safe(item.unit)}</strong></div><div><span>到期日期</span><strong>${formatDate(item.expiryDate)}</strong></div><button class="card-more" data-more="${item.id}">···</button></div>
      </div>
      <div class="ingredient-actions"><button data-edit="${item.id}">编辑信息</button><button data-delete="${item.id}">删除</button></div>
    </article>`;
  }).join("");
  $("#pantryEmpty").classList.toggle("hidden", items.length > 0);
  $("#itemTotal").textContent = state.ingredients.length;
  $("#allCount").textContent = state.ingredients.length;
  $("#coldCount").textContent = state.ingredients.filter(x => x.storage === "冷藏").length;
  $("#frozenCount").textContent = state.ingredients.filter(x => x.storage === "冷冻").length;
  $("#roomCount").textContent = state.ingredients.filter(x => x.storage === "常温").length;
  renderAlerts(); renderSuggestion(); renderPicker();
}

function recipeScore(recipe) {
  const owned = recipe.ingredients.filter(required => { const amount = parseAmount(required.amount); return amount && pantryAmount(required.name, amount.unit) >= amount.quantity; });
  const expiringNames = state.ingredients.filter(item => freshness(item).days >= 0 && freshness(item).days <= 3).map(item => canonicalIngredient(item.name));
  const expiryHits = owned.filter(item => expiringNames.includes(canonicalIngredient(item.name))).length;
  return owned.length / recipe.ingredients.length * 80 + expiryHits * 15 - (recipe.ingredients.length - owned.length) * 20 - recipe.time / 10;
}

function weekChoices(meal, excludedIds = []) {
  return weekMealRecipeIds[meal].map(id => recipes.find(recipe => recipe.id === id)).filter(recipe => recipe && !excludedIds.includes(recipe.id))
    .sort((a, b) => recipeScore(b) - recipeScore(a) || a.time - b.time || a.id.localeCompare(b.id));
}

function buildWeekPlan(seed = state.weekGeneration || 0) {
  const used = [];
  return weekMeals.flatMap((meal, mealIndex) => days.map((_, dayIndex) => {
    const choices = weekChoices(meal, used);
    const plated = meal !== "早餐" && dayIndex % 2 === 1 ? choices.filter(recipe => dishImages[recipe.id]) : [];
    const pool = plated.length ? plated : choices;
    const recipe = pool[seed ? (seed + dayIndex + mealIndex) % Math.min(3, pool.length) : 0];
    used.push(recipe.id);
    return recipe.id;
  }));
}

function currentWeekDates() {
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 6) % 7, 12);
  const dates = days.map((_, index) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index, 12));
  const key = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
  return { dates, key, todayIndex: (today.getDay() + 6) % 7 };
}

function weekFoodArt(recipe) {
  if (dishImages[recipe.id]) return recipeArtwork(recipe, "week-dish-image");
  const pictures = recipe.ingredients.filter(item => preferredFoodImage(item.name)).slice(0, 2);
  return pictures.length ? pictures.map(item => `<img src="${preferredFoodImage(item.name)}" alt="${safe(item.name)}">`).join("") : `<span>${recipe.emoji}</span>`;
}

function rankedSuggestions() { return recipes.filter(recipe => recipe.type !== "轻食" && recipe.time <= 60).sort((a, b) => recipeScore(b) - recipeScore(a)); }
function renderSuggestion() {
  const ranked = rankedSuggestions(); const recipe = ranked[state.suggestionIndex % ranked.length];
  const owned = recipe.ingredients.filter(item => { const amount = parseAmount(item.amount); return amount && pantryAmount(item.name, amount.unit) >= amount.quantity; });
  const missing = recipe.ingredients.filter(item => !owned.includes(item));
  const buyText = missing.length ? `买${missing.map(x => x.name).join("、")}` : "不用额外买菜";
  $("#suggestionTitle").textContent = `${buyText}，今晚就能做${recipe.name}`;
  $("#suggestionText").textContent = missing.length ? `搭配仓库中的${owned.map(x => x.name).join("、") || "现有食材"}，只需再买 ${missing.length} 种食材。` : `仓库食材已经齐全，还能优先消耗${owned[0]?.name || "临期食材"}。`;
  $("#suggestionIngredients").innerHTML = recipe.ingredients.slice(0, 4).map(x => `<span title="${safe(x.name)}">${preferredFoodImage(x.name) ? `<img src="${preferredFoodImage(x.name)}" alt="${safe(x.name)}">` : metaFor(x.name).emoji}</span>`).join("");
  $("#viewSuggestion").dataset.recipeId = recipe.id;
}

function renderAlerts() {
  const alerts = state.ingredients.filter(x => freshness(x).days <= 3).sort((a,b) => freshness(a).days - freshness(b).days);
  $("#notificationCount").textContent = alerts.length;
  $("#drawerSummaryTitle").textContent = alerts.length ? `${alerts.length} 种食材需要你的关注` : "今天没有食材临期";
  $("#alertList").innerHTML = alerts.length ? `<p class="alert-section-title">建议优先处理</p>` + alerts.map(item => {
    const f = freshness(item); return `<div class="alert-item"><span class="emoji">${preferredFoodImage(item.name, item.image) ? `<img src="${preferredFoodImage(item.name, item.image)}" alt="${safe(item.name)}">` : metaFor(item.name, item.category).emoji}</span><div><strong>${safe(item.name)}</strong><small>${f.label} · 剩余 ${item.quantity}${safe(item.unit)}</small></div><button data-cook-alert="${item.id}">去做菜</button></div>`;
  }).join("") : `<div class="empty-state"><span>🌿</span><h3>所有食材都很新鲜</h3><p>继续保持良好的采购节奏吧。</p></div>`;
}

function renderPicker() {
  const query = ($("#pickerSearch")?.value || "").trim().toLowerCase();
  const items = state.ingredients.filter(x => !query || x.name.toLowerCase().includes(query));
  $("#pickerList").innerHTML = items.map(item => `<div class="picker-item ${state.selectedIds.includes(item.id) ? "selected" : ""}" data-picker="${item.id}"><span class="emoji">${preferredFoodImage(item.name, item.image) ? `<img src="${preferredFoodImage(item.name, item.image)}" alt="${safe(item.name)}">` : metaFor(item.name,item.category).emoji}</span><div><strong>${safe(item.name)}</strong><small>${item.quantity}${safe(item.unit)} · ${freshness(item).label}</small></div><span class="picker-check">✓</span></div>`).join("");
  const selected = state.ingredients.filter(x => state.selectedIds.includes(x.id));
  $("#selectedCount").textContent = selected.length;
  $("#selectedPreview").innerHTML = selected.length ? selected.map(x => `<span class="selected-ingredient">${metaFor(x.name,x.category).emoji} ${safe(x.name)}<button type="button" data-remove-selected="${x.id}" aria-label="移除${safe(x.name)}" title="移除${safe(x.name)}">×</button></span>`).join("") : `<p>从左侧选择至少一种食材</p>`;
}

function toggleSelected(id) {
  state.selectedIds = state.selectedIds.includes(id) ? state.selectedIds.filter(x => x !== id) : [...state.selectedIds, id];
  saveState(); renderPantry();
}

function showPage(page) {
  closeWeekRecipePopover();
  ui.page = page;
  const titles = { pantry: "我的食材仓库", cook: "COOK", week: "一周食谱推荐", favorites: "我的菜谱" };
  $$(".page").forEach(node => node.classList.remove("active"));
  $(`#${page}Page`).classList.add("active");
  $$(".nav-item").forEach(node => node.classList.toggle("active", node.dataset.page === page));
  $("#pageTitle").textContent = titles[page];
  $("#searchBox").classList.toggle("hidden", page !== "pantry");
  $("#openAddModal").classList.toggle("hidden", page !== "pantry");
  $(".sidebar").classList.remove("open");
  if (page === "week") renderWeek();
  if (page === "favorites") renderFavorites();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openAdd(editId = null) {
  ui.editingId = editId; ui.recognized = null; ui.photoRequestId = (ui.photoRequestId || 0) + 1;
  $("#ingredientForm").reset();
  $("#purchaseDate").value = offsetDate(0); $("#expiryDate").value = offsetDate(7);
  $("#photoPreview").classList.add("hidden"); $("#uploadZone").classList.remove("has-preview"); $("#uploadPlaceholder").classList.remove("hidden"); $("#recognitionBox").classList.add("hidden"); $("#photoConfirm").classList.add("hidden");
  if (editId) {
    const item = state.ingredients.find(x => x.id === editId); if (!item) return;
    $("#addModalTitle").textContent = "编辑食材信息";
    $("#ingredientName").value = item.name; $("#ingredientCategory").value = item.category; $("#ingredientStorage").value = item.storage;
    $("#ingredientQuantity").value = item.quantity; $("#ingredientUnit").value = item.unit; $("#purchaseDate").value = item.purchaseDate; $("#expiryDate").value = item.expiryDate; $("#ingredientNote").value = item.note || "";
  } else $("#addModalTitle").textContent = "添加新食材";
  switchAddTab("manual"); $("#modalBackdrop").classList.add("open");
}
function closeAdd() { $("#modalBackdrop").classList.remove("open"); ui.editingId = null; }
function switchAddTab(tab) {
  $$("[data-add-tab]").forEach(x => x.classList.toggle("active", x.dataset.addTab === tab));
  $$("[data-add-panel]").forEach(x => x.classList.toggle("active", x.dataset.addPanel === tab));
  $("#saveIngredient").textContent = tab === "photo" ? "确认识别并入库" : "确认入库";
}

function analyzeWhiteBackgroundPhoto({ data, width, height }) {
  let count = 0, green = 0, red = 0, orange = 0, minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4, r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 80 || Math.min(r, g, b) > 225 || (r + g + b > 700 && Math.max(r, g, b) - Math.min(r, g, b) < 25)) continue;
    count++; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    if (g > r * 1.12 && g > b * 1.1 && g > 45) green++;
    if (r > g * 1.3 && r > b * 1.5) red++;
    if (r > g * 1.15 && g >= r * .42 && g > b * 1.25) orange++;
  }
  if (count < width * height * .02) return { name: "", reason: "主体不够清晰，请填写名称" };
  const aspect = (maxX - minX + 1) / (maxY - minY + 1);
  const fill = count / ((maxX - minX + 1) * (maxY - minY + 1));
  if (green / count > .42 && aspect > .43 && aspect < 2.2 && fill > .3) return { name: "青椒", reason: "检测到白底绿色块状食材，请核对是否为青椒" };
  if (orange / count > .45 && (aspect < .5 || aspect > 2)) return { name: "胡萝卜", reason: "检测到白底橙色细长食材，请核对名称" };
  if (orange / count > .4 && aspect > .65 && aspect < 1.5 && fill > .5) return { name: "橙子", reason: "检测到白底橙色圆形食材，请核对是否为橙子" };
  if (red / count > .48 && aspect > .65 && aspect < 1.5) return { name: "西红柿", reason: "检测到白底红色圆形食材，请核对名称" };
  return { name: "", reason: "暂无法可靠判断，请填写实际食材名称" };
}

function moveMisidentifiedOrangePhoto(tomato) {
  if (!tomato.image) return;
  const photo = tomato.image, orange = state.ingredients.find(item => item.name === "橙子");
  if (orange) {
    if (!orange.image) orange.image = photo;
    orange.category = "水果"; orange.photoVerifiedName = "橙子";
  } else {
    const meta = ingredientMeta["橙子"];
    state.ingredients.unshift({ id: crypto.randomUUID(), name: "橙子", category: meta.category, storage: meta.storage, quantity: 1, unit: meta.unit, purchaseDate: offsetDate(0), expiryDate: offsetDate(meta.life), note: "由照片导入", image: photo, photoVerifiedName: "橙子" });
  }
  delete tomato.image; delete tomato.photoVerifiedName;
  if (tomato.note === "由照片导入") tomato.note = "";
  saveState(); renderPantry();
}

function repairStoredPhotoClassification() {
  state.ingredients.filter(item => item.name === "西红柿" && item.image && !item.photoVerifiedName).forEach(item => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas"), scale = Math.min(128 / image.width, 128 / image.height, 1);
      canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const result = analyzeWhiteBackgroundPhoto(context.getImageData(0, 0, canvas.width, canvas.height));
      if (result.name === "橙子") moveMisidentifiedOrangePhoto(item);
      else if (result.name === "西红柿") { item.photoVerifiedName = "西红柿"; saveState(); renderPantry(); }
    };
    image.src = item.image;
  });
}

function extractForegroundMask({ data, width, height }) {
  const total = width * height, background = new Uint8Array(total), queue = new Int32Array(total);
  let head = 0, tail = 0;
  const add = index => {
    if (background[index]) return;
    const i = index * 4, r = data[i], g = data[i + 1], b = data[i + 2];
    if (data[i + 3] < 80 || (Math.min(r, g, b) >= 225 && Math.max(r, g, b) - Math.min(r, g, b) <= 32)) {
      background[index] = 1; queue[tail++] = index;
    }
  };
  for (let x = 0; x < width; x++) { add(x); add((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { add(y * width); add(y * width + width - 1); }
  while (head < tail) {
    const index = queue[head++], x = index % width;
    if (x) add(index - 1);
    if (x < width - 1) add(index + 1);
    if (index >= width) add(index - width);
    if (index < total - width) add(index + width);
  }
  if (tail < total * .08) return null;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let index = 0; index < total; index++) if (!background[index]) {
    const x = index % width, y = Math.floor(index / width);
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  return maxX >= 0 ? { background, minX, minY, maxX, maxY } : null;
}

function makeStickerCutout(canvas, imageData) {
  const { width, height } = canvas, mask = extractForegroundMask(imageData);
  if (!mask) return null;
  const padding = 12, boxWidth = mask.maxX - mask.minX + 1, boxHeight = mask.maxY - mask.minY + 1;
  const subject = document.createElement("canvas"); subject.width = boxWidth; subject.height = boxHeight;
  const subjectContext = subject.getContext("2d"), subjectData = subjectContext.createImageData(boxWidth, boxHeight);
  for (let y = 0; y < boxHeight; y++) for (let x = 0; x < boxWidth; x++) {
    const sourceIndex = (y + mask.minY) * width + x + mask.minX;
    if (mask.background[sourceIndex]) continue;
    const from = sourceIndex * 4, to = (y * boxWidth + x) * 4;
    subjectData.data[to] = imageData.data[from]; subjectData.data[to + 1] = imageData.data[from + 1];
    subjectData.data[to + 2] = imageData.data[from + 2]; subjectData.data[to + 3] = 255;
  }
  subjectContext.putImageData(subjectData, 0, 0);
  const silhouette = document.createElement("canvas"); silhouette.width = boxWidth; silhouette.height = boxHeight;
  const silhouetteContext = silhouette.getContext("2d"); silhouetteContext.drawImage(subject, 0, 0);
  silhouetteContext.globalCompositeOperation = "source-in"; silhouetteContext.fillStyle = "#fff"; silhouetteContext.fillRect(0, 0, boxWidth, boxHeight);
  const result = document.createElement("canvas"); result.width = boxWidth + padding * 2; result.height = boxHeight + padding * 2;
  const output = result.getContext("2d");
  for (let angle = 0; angle < 24; angle++) {
    const radians = angle * Math.PI / 12, radius = 7 + Math.sin(angle * 2.7) * .8;
    output.drawImage(silhouette, padding + Math.cos(radians) * radius, padding + Math.sin(radians) * radius);
  }
  output.drawImage(subject, padding, padding);
  return result.toDataURL("image/png");
}

function recognizePhoto(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) return toast("请选择图片文件", "error");
  if (file.size > 5 * 1024 * 1024) return toast("图片请小于 5 MB", "error");
  ui.recognized = null;
  const requestId = ui.photoRequestId = (ui.photoRequestId || 0) + 1;
  $("#recognitionBox").classList.remove("hidden"); $(".recognition-loading").classList.remove("hidden"); $("#recognitionResult").classList.add("hidden"); $("#photoConfirm").classList.add("hidden");
  const reader = new FileReader();
  reader.onerror = () => { $(".recognition-loading").classList.add("hidden"); toast("图片读取失败，请重试", "error"); };
  reader.onload = event => {
    if (requestId !== ui.photoRequestId) return;
    const source = event.target.result;
    $("#photoPreview").src = source; $("#photoPreview").classList.remove("hidden"); $("#uploadPlaceholder").classList.add("hidden");
    const image = new Image();
    image.onerror = () => { $(".recognition-loading").classList.add("hidden"); toast("图片无法解析，请换一张", "error"); };
    image.onload = () => {
      if (requestId !== ui.photoRequestId) return;
      const canvas = document.createElement("canvas"), scale = Math.min(384 / image.width, 384 / image.height, 1);
      canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const suggestion = analyzeWhiteBackgroundPhoto(pixels);
      const cutout = makeStickerCutout(canvas, pixels);
      if (!cutout) {
        $(".recognition-loading").classList.add("hidden");
        $("#recognitionResult").classList.remove("hidden");
        $("#recognitionResult").innerHTML = "<div><span>抠图未完成</span><strong>请换一张背景更白、主体更清晰的照片</strong></div>";
        return;
      }
      const meta = metaFor(suggestion.name);
      ui.recognized = { name: suggestion.name, category: meta.category, storage: meta.storage, unit: meta.unit, quantity: 1, purchaseDate: offsetDate(0), expiryDate: offsetDate(meta.life), note: "由照片导入", image: cutout, photoVerifiedName: suggestion.name };
      $("#photoPreview").src = cutout; $("#uploadZone").classList.add("has-preview");
      $(".recognition-loading").classList.add("hidden"); $("#recognitionResult").classList.remove("hidden"); $("#photoConfirm").classList.remove("hidden");
      $("#recognitionResult").innerHTML = `<div><span>照片分析建议</span><strong>${suggestion.name ? `${meta.emoji} ${safe(suggestion.name)}` : "待填写"}</strong></div><div><span>图片处理</span><strong>已去白底并加白边</strong></div><div><span>判断说明</span><strong>${safe(suggestion.reason)}</strong></div><div><span>建议分类</span><strong>${safe(meta.category)}</strong></div><div><span>建议位置</span><strong>${safe(meta.storage)}</strong></div>`;
      $("#photoName").value = suggestion.name; $("#photoCategory").value = meta.category; $("#photoStorage").value = meta.storage; $("#photoUnit").value = meta.unit; $("#photoQuantity").value = 1; $("#photoExpiryDate").value = offsetDate(meta.life);
    };
    image.src = source;
  };
  reader.readAsDataURL(file);
}

function submitIngredient(event) {
  event.preventDefault(); const photoMode = $("[data-add-tab='photo']").classList.contains("active");
  const wasEditing = Boolean(ui.editingId);
  let item;
  if (photoMode) {
    if (!ui.recognized) return toast("请先上传并完成图片识别", "error");
    item = { ...ui.recognized, id: crypto.randomUUID(), name: $("#photoName").value.trim(), category: $("#photoCategory").value, storage: $("#photoStorage").value, quantity: Number($("#photoQuantity").value), unit: $("#photoUnit").value, expiryDate: $("#photoExpiryDate").value };
    if (!item.name || !item.expiryDate || !(item.quantity > 0)) return toast("请确认名称、数量和到期日期", "error");
    const meta = ingredientMeta[item.name];
    if (meta && (item.name === "橙子" || item.category === "其他" || item.category === ui.recognized.category && ui.recognized.name !== item.name)) item.category = meta.category;
  } else {
    item = { id: ui.editingId || crypto.randomUUID(), name: $("#ingredientName").value.trim(), category: $("#ingredientCategory").value, storage: $("#ingredientStorage").value, quantity: Number($("#ingredientQuantity").value), unit: $("#ingredientUnit").value, purchaseDate: $("#purchaseDate").value, expiryDate: $("#expiryDate").value, note: $("#ingredientNote").value.trim() };
    if (!item.name || !item.expiryDate || !(item.quantity > 0)) return toast("请填写名称、数量和到期日期", "error");
  }
  const selectedNames = new Set(state.ingredients.filter(x => state.selectedIds.includes(x.id)).map(x => canonicalIngredient(x.name)));
  if (ui.editingId) state.ingredients = state.ingredients.map(x => x.id === ui.editingId ? item : x); else state.ingredients.unshift(item);
  state.ingredients = mergeSameNameIngredients(state.ingredients);
  state.selectedIds = state.ingredients.filter(x => selectedNames.has(canonicalIngredient(x.name))).map(x => x.id);
  if (photoMode) ui.category = item.category;
  saveState(); renderCategories(); renderPantry(); closeAdd(); toast(wasEditing ? "食材信息已更新" : `${item.name} 已加入仓库`);
}

function cookRequest(selectedItems) {
  const prompt = $("#customPrompt").value.trim();
  const allNames = Object.keys(ingredientMeta).sort((a, b) => b.length - a.length);
  const excluded = allNames.filter(name => ["不要", "不吃", "不能吃", "不放", "去掉", "避开", "忌口"].some(word => prompt.includes(word + name))).map(canonicalIngredient);
  const wanted = allNames.filter(name => prompt.includes(name) && !excluded.includes(canonicalIngredient(name))).map(canonicalIngredient);
  const names = [...new Set(selectedItems.map(item => canonicalIngredient(item.name)))];
  const timeRequest = prompt.match(/(?:不超过|最多|控制在)\s*(\d+)\s*分钟|\b(\d+)\s*分钟(?:内|以内|搞定|完成)/);
  const promptType = /想喝汤|做汤|汤羹/.test(prompt) ? "汤羹" : /想吃面|做面|炒面|盖饭|炒饭/.test(prompt) ? "主食" : /轻食|沙拉/.test(prompt) ? "轻食" : null;
  const promptTaste = /酸甜/.test(prompt) ? "酸甜" : /清淡/.test(prompt) ? "清淡" : /香辣|想吃辣|辣一点/.test(prompt) ? "香辣" : null;
  return { prompt, names, excluded, wanted, servings: Number($("#servings").value.match(/\d+/)[0]),
    type: promptType || $("#mealType").value, taste: promptTaste || $("#taste").value,
    strictType: Boolean(promptType), strictTaste: Boolean(promptTaste),
    recognized: Boolean(timeRequest || promptType || promptTaste || excluded.length || wanted.length || /不买菜|不采购|只用现有|不想买菜|只用所选|只用这些|只用选中|素食|不吃肉|不要肉|不辣|不要太?辣|不能吃辣|少辣|想吃辣|要辣|香辣|辣一点|少油|清淡|减脂|低脂/.test(prompt)),
    maxTime: timeRequest ? Math.min(Number($("#cookTime").value), Number(timeRequest[1] || timeRequest[2])) : Number($("#cookTime").value),
    hardTime: Boolean(timeRequest),
    noBuy: /不买菜|不采购|只用现有|不想买菜/.test(prompt),
    onlySelected: /只用所选|只用这些|只用选中/.test(prompt),
    vegetarian: /素食|不吃肉|不要肉/.test(prompt),
    noSpicy: /不辣|不要太?辣|不能吃辣|少辣/.test(prompt),
    spicy: /想吃辣|要辣|香辣|辣一点/.test(prompt),
    light: /少油|清淡|减脂|低脂/.test(prompt) };
}

function findBestRecipe(selectedItems, excludeId = null, allowNear = false) {
  ensureMilkshakeRecipes(selectedItems);
  ensureFruitPlatterRecipe(selectedItems);
  ensureCombinationRecipes(selectedItems);
  const request = cookRequest(selectedItems);
  const selectedFruitNames = [...new Set(selectedItems.filter(item => item.category === "水果" || ingredientMeta[item.name]?.category === "水果").map(item => canonicalIngredient(item.name)))];
  const candidates = recipes.filter(recipe => recipe.time <= request.maxTime || allowNear && !request.hardTime && recipe.time <= request.maxTime + 30).map(recipe => {
    const names = recipe.ingredients.map(item => canonicalIngredient(item.name));
    const hits = request.names.filter(name => names.includes(name));
    const needs = recipeNeeds(recipe, request.servings);
    const missing = needs.filter(item => pantryAmount(item.name, item.unit) < item.quantity);
    const milkshakeMatch = recipe.isMilkshake && hits.length === 2;
    const fruitPlatterMatch = recipe.isFruitPlatter && names.length === selectedFruitNames.length && names.every(name => selectedFruitNames.includes(name));
    if (recipe.isFruitPlatter && !fruitPlatterMatch) return null;
    if (!hits.length || missing.length > (allowNear ? 2 : 1) || request.noBuy && missing.length) return null;
    if (missing.length && hits.length < Math.min(2, request.names.length)) return null;
    if (request.onlySelected && names.some(name => !request.names.includes(name))) return null;
    if (request.strictType && recipe.type !== request.type || request.strictTaste && recipe.taste !== request.taste) return null;
    if (names.some(name => request.excluded.includes(name))) return null;
    if (request.wanted.some(name => !names.includes(name))) return null;
    if (request.vegetarian && recipe.ingredients.some(item => ["肉类", "水产"].includes(metaFor(item.name).category))) return null;
    if (request.noSpicy && recipe.taste === "香辣" || request.spicy && !request.noSpicy && recipe.taste !== "香辣") return null;
    const expiring = selectedItems.filter(item => freshness(item).days >= 0 && freshness(item).days <= 3 && names.includes(canonicalIngredient(item.name)));
    const score = hits.length * 110 + hits.length / request.names.length * 55 - missing.length * 260
      + expiring.length * 18 + (recipe.type === request.type ? 25 : 0) + (recipe.taste === request.taste ? 15 : 0)
      + (request.light && recipe.taste === "清淡" ? 25 : 0) + (fruitPlatterMatch ? 1500 : milkshakeMatch ? 1000 : 0) - (recipe.isCombination ? 45 : 0) - recipe.time / 10
      - Math.max(0, recipe.time - request.maxTime) * 5;
    return { recipe, score, hits, missing, needs, expiring, request,
      near: recipe.time > request.maxTime || missing.length > 0 };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.recipe.time - b.recipe.time || a.recipe.id.localeCompare(b.recipe.id));
  return candidates.find(item => item.recipe.id !== excludeId) || candidates[0] || null;
}

async function tryAiRecipe(selected, request, requestId) {
  if (ui.aiUnavailable || typeof fetch !== "function" || typeof location === "undefined" || location.protocol === "file:") return;
  try {
    const response = await fetch("api/recommend", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: selected.map(item => ({ name: canonicalIngredient(item.name), quantity: Number(item.quantity), unit: item.unit, category: item.category })), preferences: request }) });
    if (response.status === 404 || response.status === 503) ui.aiUnavailable = true;
    if (!response.ok) return;
    const data = await response.json();
    if (requestId !== ui.aiRequestId || selected.some(item => !state.selectedIds.includes(item.id))) return;
    const result = data.recipe;
    if (!result || !Array.isArray(result.ingredients) || !Array.isArray(result.steps)) return;
    const recipe = { ...result, id: `ai:${crypto.randomUUID()}`, emoji: "🍳", difficulty: "简单", calories: null, isAi: true };
    recipes.push(recipe);
    rememberDynamicRecipe(recipe);
    ui.lastRecipeId = recipe.id;
    ui.lastServings = request.servings;
    state.history = [recipe.id, ...state.history.filter(id => id !== recipe.id)].slice(0, 12);
    saveState();
    renderRecipeResult(recipe, selected);
  } catch { /* The local matcher remains usable when the optional model endpoint is offline. */ }
}

function generateRecipe(another = false) {
  const selected = state.ingredients.filter(item => state.selectedIds.includes(item.id));
  if (!selected.length) return toast("请先选择至少一种食材", "error");
  const requestId = ++ui.aiRequestId;
  $("#generationLoading").classList.add("hidden");
  const result = $("#recipeResult");
  const expired = selected.filter(item => freshness(item).days < 0);
  if (expired.length) {
    result.innerHTML = `<div class="result-empty"><h3>所选食材中有已过期的食材</h3><p>${safe(expired.map(item => item.name).join("、"))}已过期，请先取消选择并确认食材安全，再重新匹配。</p></div>`;
  } else {
    const best = findBestRecipe(selected, another ? ui.lastRecipeId : null) || findBestRecipe(selected, another ? ui.lastRecipeId : null, true);
    if (!best) {
      const request = cookRequest(selected);
      const timeText = request.maxTime >= 999 ? "不限时间" : `${request.maxTime} 分钟内`;
      result.innerHTML = `<div class="result-empty"><h3>本地暂时没有符合条件的菜谱</h3><p>已按「${safe(request.names.join("、"))}」「${safe(timeText)}」及你的忌口和补充要求查找。可调整限制，或部署模型服务分析新的食材组合。</p></div>`;
    } else {
      ui.lastRecipeId = best.recipe.id;
      ui.lastServings = best.request.servings;
      rememberDynamicRecipe(best.recipe);
      state.history = [best.recipe.id, ...state.history.filter(id => id !== best.recipe.id)].slice(0, 12);
      saveState(); renderRecipeResult(best.recipe, selected, best);
    }
  }
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
  if (!expired.length) void tryAiRecipe(selected, cookRequest(selected), requestId);
}

function renderRecipeResult(recipe, selected, matchResult = null) {
  const request = matchResult?.request || cookRequest(selected);
  const needs = matchResult?.needs || recipeNeeds(recipe, request.servings);
  const matched = needs.filter(item => pantryAmount(item.name, item.unit) >= item.quantity);
  const match = Math.round(matched.length / needs.length * 100);
  const used = selected.filter(item => recipe.ingredients.some(required => canonicalIngredient(required.name) === canonicalIngredient(item.name)));
  const unused = selected.filter(item => !used.includes(item));
  const missing = needs.filter(item => pantryAmount(item.name, item.unit) < item.quantity);
  const overTime = recipe.time > request.maxTime;
  const baseNeeds = recipe.ingredients.map(item => servingNeed(item, request.servings));
  const portionScale = Math.min(1, ...needs.map((item, index) => item.quantity / baseNeeds[index].quantity));
  const smallPortion = portionScale < 1;
  const calories = recipe.calories && smallPortion ? Math.round(recipe.calories * portionScale) : recipe.calories;
  const expiring = used.filter(item => freshness(item).days <= 3);
  const notes = [`用了所选食材：${used.map(item => item.name).join("、")}`];
  if (unused.length) notes.push(`本菜未用：${unused.map(item => item.name).join("、")}`);
  if (overTime) notes.push(`预计 ${recipe.time} 分钟，比设定的 ${request.maxTime} 分钟多 ${recipe.time - request.maxTime} 分钟`);
  if (missing.length) notes.push(`库存不足：${missing.map(item => `${item.name}还差${Math.round((item.quantity - pantryAmount(item.name, item.unit)) * 10) / 10}${item.unit}`).join("、")}`);
  if (smallPortion) notes.push(`按库存制作小份：${needs.map(item => item.amount.replace(" ", "")).join("、")}；不足 ${request.servings} 人份`);
  if (expiring.length) notes.push(`优先消耗临期食材：${expiring.map(item => item.name).join("、")}`);
  if (recipe.isFruitPlatter) notes.push("选中至少三种水果，按所选水果推荐拼盘");
  else if (recipe.isMilkshake) notes.push("牛奶搭配水果，优先推荐现打奶昔");
  else if (recipe.type !== request.type) notes.push(`当前没有更合适的${request.type}，因此推荐${recipe.type}`);
  if (request.prompt && !request.recognized) notes.push("补充要求未识别；目前支持食材名、忌口、少油、不辣、菜品类型、时间和只用现有食材等要求");
  $("#recipeResult").innerHTML = `<div class="result-top"><div class="result-cover"><span class="match-badge ${matchResult?.near ? "near" : ""}">${matchResult?.near ? "最接近的做法" : `库存足量 ${match}%`}</span>${recipeArtwork(recipe)}</div><div class="result-info"><span class="eyebrow green">${recipe.isAi ? "AI 生成并核对库存" : recipe.isCombination ? "本地食材搭配" : "本地菜谱智能匹配"}</span><h2>${safe(recipe.name)}</h2><p>${safe(recipe.desc)}</p><div class="match-explanation ${overTime || missing.length ? "near" : ""}">${notes.map(note => `<p>${safe(note)}</p>`).join("")}</div><div class="recipe-facts"><span>烹饪时间<b>${recipe.time} 分钟</b></span><span>难度<b>${recipe.difficulty}</b></span>${calories ? `<span>参考热量<b>${calories} kcal</b></span>` : ""}<span>${smallPortion ? "预计份量" : "用餐人数"}<b>${smallPortion ? "小份" : `${request.servings} 人`}</b></span></div><div class="result-actions"><button class="primary" data-complete-recipe="${recipe.id}" ${overTime || missing.length ? "disabled title=\"请先补齐食材或调整时间后重新匹配\"" : ""}>${overTime || missing.length ? "条件满足后可记录" : "完成烹饪"}</button><button data-favorite-recipe="${recipe.id}">${state.favorites.includes(recipe.id) ? "♥ 已收藏" : "♡ 收藏菜谱"}</button><button data-regenerate>换一道菜</button></div></div></div>
    <div class="result-body"><div><h3>所需食材与调料</h3><div class="ingredient-checklist">${needs.map(item => { const available = pantryAmount(item.name, item.unit) >= item.quantity; return `<div class="${available ? "" : "missing"}"><span>${available ? "✓" : "+"} ${safe(item.name)}</span><span>${safe(item.amount)} · ${available ? "仓库足量" : "数量不足或需补购"}</span></div>`; }).join("")}<div><span>调料</span><span>${safe(recipe.seasonings)}</span></div></div></div><div class="recipe-method"><h3>烹饪做法</h3><div class="recipe-steps">${recipe.steps.map((step, i) => `<div class="recipe-step"><b>${i + 1}</b><p>${safe(step)}</p></div>`).join("")}</div></div></div>`;
}

function toggleFavorite(recipeId) {
  const had = state.favorites.includes(recipeId); state.favorites = had ? state.favorites.filter(x => x !== recipeId) : [recipeId, ...state.favorites]; saveState(); toast(had ? "已取消收藏" : "菜谱已收藏");
  if (!$("#recipeResult").classList.contains("hidden")) { const selected = state.ingredients.filter(x => state.selectedIds.includes(x.id)); renderRecipeResult(recipes.find(x => x.id === recipeId), selected); }
  renderFavorites();
}

function completeRecipe(recipeId) {
  const recipe = recipes.find(x => x.id === recipeId); if (!recipe) return;
  ui.cookingRecipeId = recipeId;
  const needs = recipeNeeds(recipe, ui.lastRecipeId === recipeId ? ui.lastServings : 2);
  const rows = needs.flatMap(required => {
    let remaining = required.quantity;
    return state.ingredients.filter(item => canonicalIngredient(item.name) === canonicalIngredient(required.name) && freshness(item).days >= 0).map(item => {
    const compatible = item.unit === required.unit || required.name === "可乐" && item.unit === "瓶" && required.unit === "罐";
    const available = compatible ? Number(item.quantity) : required.unit === "g" && item.unit === "kg" ? Number(item.quantity) * 1000 : 0;
    const used = Math.min(available, remaining);
    remaining -= used;
    const use = item.unit === "kg" && required.unit === "g" ? used / 1000 : used;
    return `<label class="consume-row"><span>${metaFor(item.name,item.category).emoji} <strong>${safe(item.name)}</strong><small>现有 ${item.quantity}${safe(item.unit)} · 建议 ${safe(required.amount)}</small></span><span><input type="number" min="0" max="${item.quantity}" step="any" value="${use}" data-consume-id="${item.id}" aria-label="${safe(item.name)}的使用数量"><em>${safe(item.unit)}</em></span></label>`;
  });
  });
  $("#consumeRows").innerHTML = rows.length ? rows.join("") : `<p class="consume-intro">仓库中没有这道菜所需的食材，可直接确认记录完成。</p>`;
  $("#consumeModalBackdrop").classList.add("open");
}
function confirmCooking(event) {
  event.preventDefault();
  const inputs = $$("[data-consume-id]");
  if (inputs.some(input => !Number.isFinite(Number(input.value)) || Number(input.value) < 0 || Number(input.value) > Number(input.max))) return toast("用量应在 0 和现有数量之间", "error");
  inputs.forEach(input => { const item = state.ingredients.find(x => x.id === input.dataset.consumeId); if (item) item.quantity = Math.round((Number(item.quantity) - Number(input.value)) * 100) / 100; });
  const recipe = recipes.find(x => x.id === ui.cookingRecipeId);
  state.ingredients = state.ingredients.filter(item => item.quantity > 0); state.selectedIds = []; saveState(); renderPantry(); renderWeek();
  $("#consumeModalBackdrop").classList.remove("open"); toast(`已记录${recipe.name}，库存已按实际用量更新`);
}

function renderWeek() {
  closeWeekRecipePopover();
  const week = currentWeekDates();
  if (state.weekRecipeVersion !== WEEK_RECIPE_VERSION || state.weekStart !== week.key || !Array.isArray(state.weekPlan) || state.weekPlan.length !== 21 || new Set(state.weekPlan).size !== 21 || state.weekPlan.some((id, index) => !weekMealRecipeIds[weekMeals[Math.floor(index / 7)]].includes(id))) {
    state.weekStart = week.key; state.weekRecipeVersion = WEEK_RECIPE_VERSION; state.weekPlan = buildWeekPlan(); saveState();
  }
  const plan = state.weekPlan.map(id => recipes.find(recipe => recipe.id === id));
  $("#weekDays").innerHTML = days.map((day, index) => `<div class="week-day ${index === week.todayIndex ? "today" : ""}"><strong>${day}</strong><span>${week.dates[index].getMonth() + 1}月${week.dates[index].getDate()}日${index === week.todayIndex ? " · 今天" : ""}</span></div>`).join("");
  $("#weekGrid").innerHTML = plan.map((recipe, index) => {
    const dayIndex = index % 7, meal = weekMeals[Math.floor(index / 7)];
    return `<article class="day-card meal-${Math.floor(index / 7)} ${dayIndex === week.todayIndex ? "today" : ""}" aria-label="${days[dayIndex]}${meal}"><div class="day-head"><strong>${meal}</strong></div><div class="day-food"><button class="week-food-button" data-week-recipe="${recipe.id}" aria-label="查看${days[dayIndex]}${meal}：${safe(recipe.name)}">${weekFoodArt(recipe)}</button><button class="week-swap-button" data-swap-day="${index}" title="更换${days[dayIndex]}${meal}" aria-label="更换${days[dayIndex]}${meal}">↻</button></div></article>`;
  }).join("");
  const list = weeklyNeeds(plan);
  $("#shoppingList").innerHTML = list.length ? list.map(item => `<div class="shopping-item ${state.shoppingChecked.includes(item.name) ? "checked" : ""}" data-shopping="${item.name}" data-quantity="${item.quantity}" data-unit="${item.unit}"><span class="check">${state.shoppingChecked.includes(item.name) ? "✓" : ""}</span><div><strong>${item.name}</strong><small>${item.quantity}${item.unit}</small></div></div>`).join("") : `<p style="color:var(--muted);font-size:10px">仓库食材已经可以覆盖本周计划，无需额外采购。</p>`;
}

function closeWeekRecipePopover() { $("#weekRecipePopover").classList.add("hidden"); }

function openWeekRecipePopover(recipeId, anchor) {
  const recipe = recipes.find(item => item.id === recipeId);
  if (!recipe) return;
  const popover = $("#weekRecipePopover");
  popover.innerHTML = `<button class="week-popover-close" data-close-week-recipe aria-label="关闭菜谱卡片">×</button><div class="week-popover-art">${weekFoodArt(recipe)}</div><h3>${safe(recipe.name)}</h3><p>${safe(recipe.desc)}</p><div class="week-popover-ingredients">${recipe.ingredients.map(item => `<span>${safe(item.name)}</span>`).join("")}</div><button class="week-popover-detail" data-open-recipe="${recipe.id}">查看完整做法 →</button>`;
  const rect = anchor.getBoundingClientRect();
  const width = Math.min(280, window.innerWidth - 24);
  popover.style.width = `${width}px`;
  popover.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - width - 12))}px`;
  popover.classList.remove("hidden");
  const height = popover.offsetHeight;
  popover.style.top = `${rect.bottom + height + 8 <= window.innerHeight ? rect.bottom + 8 : Math.max(12, rect.top - height - 8)}px`;
}
function stockPurchased() {
  const checked = $$(".shopping-item.checked"); if (!checked.length) return toast("先勾选已经购买的食材", "error");
  checked.forEach(node => { const name = node.dataset.shopping, quantity = Number(node.dataset.quantity), unit = node.dataset.unit, meta = metaFor(name);
    state.ingredients.unshift({ id: crypto.randomUUID(), name, category: meta.category, storage: meta.storage, quantity, unit, purchaseDate: offsetDate(0), expiryDate: offsetDate(meta.life), note: "来自本周采购清单" });
  });
  state.shoppingChecked = []; saveState(); renderPantry(); renderWeek(); toast(`已将 ${checked.length} 种食材加入仓库`);
}

function generateWeek() {
  state.weekGeneration = (state.weekGeneration || 0) + 1;
  state.weekStart = currentWeekDates().key;
  state.weekPlan = buildWeekPlan();
  saveState(); renderWeek(); toast("已根据当前库存重新生成一周食谱");
}

function renderFavorites() {
  const ids = ui.favoriteTab === "saved" ? state.favorites : state.history;
  const list = ids.map(id => recipes.find(x => x.id === id)).filter(Boolean);
  $("#favoriteCount").textContent = state.favorites.length; $("#historyCount").textContent = state.history.length;
  $("#favoriteGrid").innerHTML = list.map(recipe => `<article class="recipe-card" data-cook-recipe="${recipe.id}" role="button" tabindex="0" aria-label="去 COOK 查看${safe(recipe.name)}的做法"><div class="recipe-cover">${recipeArtwork(recipe)}<button data-favorite-recipe="${recipe.id}">${state.favorites.includes(recipe.id) ? "♥" : "♡"}</button></div><div class="recipe-card-info"><h3>${safe(recipe.name)}</h3><p>${safe(recipe.desc.slice(0,34))}...</p><div class="recipe-card-meta"><span>◷ ${recipe.time} 分钟</span><span>${safe(recipe.difficulty)}</span>${recipe.calories ? `<span>${recipe.calories} kcal</span>` : ""}</div></div></article>`).join("");
  $("#favoriteEmpty").classList.toggle("hidden", list.length > 0);
}

function renderRecipeSearch() {
  const query = $("#recipeSearchInput").value.trim().toLowerCase();
  const matches = query ? recipes.filter(recipe => recipe.name.toLowerCase().includes(query)).slice(0, 12) : [];
  $("#recipeSearchResults").innerHTML = !query ? "" : matches.length
    ? matches.map(recipe => `<button class="recipe-search-item" data-cook-recipe="${recipe.id}">${recipeArtwork(recipe)}<span><strong>${safe(recipe.name)}</strong><small>${safe(recipe.type)} · ${recipe.time} 分钟</small></span><b>查看做法 →</b></button>`).join("")
    : `<p class="recipe-search-empty">没有找到这道菜，试试其他菜名。</p>`;
}

function showCookRecipe(recipeId) {
  const recipe = recipes.find(item => item.id === recipeId);
  if (!recipe) return;
  showPage("cook");
  $("#recipeSearchInput").value = recipe.name;
  renderRecipeSearch();
  const detail = $("#recipeLookupDetail");
  detail.innerHTML = `<div class="recipe-lookup-heading">${recipeArtwork(recipe)}<div><span class="eyebrow green">菜谱做法</span><h2>${safe(recipe.name)}</h2><p>${safe(recipe.desc)}</p><small>${recipe.time} 分钟 · ${safe(recipe.type)} · ${safe(recipe.taste)}</small></div></div><div class="recipe-lookup-body"><div><h3>所需食材与调料</h3><div class="ingredient-checklist">${recipe.ingredients.map(item => `<div><span>${safe(item.name)}</span><span>${safe(item.amount)}</span></div>`).join("")}<div><span>调料</span><span>${safe(recipe.seasonings)}</span></div></div></div><div class="recipe-method"><h3>烹饪做法</h3><div class="recipe-steps">${recipe.steps.map((step, index) => `<div class="recipe-step"><b>${index + 1}</b><p>${safe(step)}</p></div>`).join("")}</div></div></div>`;
  detail.classList.remove("hidden");
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openRecipeModal(recipeId) {
  const recipe = recipes.find(x => x.id === recipeId); if (!recipe) return;
  closeWeekRecipePopover();
  $("#recipeModalTitle").textContent = recipe.name;
  $("#recipeModalContent").innerHTML = `<div class="modal-recipe-top"><div class="recipe-cover">${recipeArtwork(recipe)}</div><div><span class="eyebrow green">${recipe.type} · ${recipe.taste}</span><h2>${recipe.name}</h2><p>${recipe.desc}</p><div class="recipe-facts"><span>时间<b>${recipe.time} 分钟</b></span><span>难度<b>${recipe.difficulty}</b></span>${recipe.calories ? `<span>热量<b>${recipe.calories} kcal</b></span>` : ""}</div><button class="primary-button" data-use-recipe="${recipe.id}">用仓库食材做这道菜</button></div></div><div class="modal-recipe-body"><div><h3>准备食材</h3><div class="ingredient-checklist">${recipe.ingredients.map(i => `<div><span>${i.name}</span><span>${i.amount}</span></div>`).join("")}<div><span>调料</span><span>${recipe.seasonings}</span></div></div></div><div><h3>烹饪步骤</h3><div class="recipe-steps">${recipe.steps.map((s,i)=>`<div class="recipe-step"><b>${i+1}</b><p>${s}</p></div>`).join("")}</div></div></div>`;
  $("#recipeModalBackdrop").classList.add("open");
}

function openDrawer() { $("#drawerBackdrop").classList.add("open"); $("#notificationDrawer").classList.add("open"); }
function closeDrawer() { $("#drawerBackdrop").classList.remove("open"); $("#notificationDrawer").classList.remove("open"); }

function bindEvents() {
  document.addEventListener("click", event => {
    if (event.target.closest("[data-close-week-recipe]")) return closeWeekRecipePopover();
    const weekFood = event.target.closest("[data-week-recipe]"); if (weekFood) return openWeekRecipePopover(weekFood.dataset.weekRecipe, weekFood);
    if (!event.target.closest("#weekRecipePopover")) closeWeekRecipePopover();
    const pageButton = event.target.closest("[data-page]"); if (pageButton) { event.preventDefault(); return showPage(pageButton.dataset.page); }
    const jump = event.target.closest("[data-page-jump]"); if (jump) return showPage(jump.dataset.pageJump);
    const category = event.target.closest("[data-category]"); if (category) { ui.category = category.dataset.category; renderCategories(); return renderPantry(); }
    const storage = event.target.closest("[data-storage]"); if (storage) { ui.storage = storage.dataset.storage; $$("[data-storage]").forEach(x=>x.classList.toggle("active",x===storage)); return renderPantry(); }
    const view = event.target.closest("[data-view]"); if (view) { ui.view = view.dataset.view; $$("[data-view]").forEach(x=>x.classList.toggle("active",x===view)); return renderPantry(); }
    const select = event.target.closest("[data-select]"); if (select) return toggleSelected(select.dataset.select);
    const removeSelected = event.target.closest("[data-remove-selected]"); if (removeSelected) return toggleSelected(removeSelected.dataset.removeSelected);
    const picker = event.target.closest("[data-picker]"); if (picker) return toggleSelected(picker.dataset.picker);
    const more = event.target.closest("[data-more]"); if (more) return more.closest(".ingredient-card").classList.toggle("actions-open");
    const edit = event.target.closest("[data-edit]"); if (edit) return openAdd(edit.dataset.edit);
    const del = event.target.closest("[data-delete]"); if (del && confirm("确定删除这份食材吗？")) { state.ingredients = state.ingredients.filter(x=>x.id!==del.dataset.delete); state.selectedIds = state.selectedIds.filter(x=>x!==del.dataset.delete); saveState(); renderPantry(); return toast("食材已删除"); }
    const alertCook = event.target.closest("[data-cook-alert]"); if (alertCook) { if (!state.selectedIds.includes(alertCook.dataset.cookAlert)) state.selectedIds.push(alertCook.dataset.cookAlert); saveState(); closeDrawer(); renderPicker(); return showPage("cook"); }
    const favorite = event.target.closest("[data-favorite-recipe]"); if (favorite) return toggleFavorite(favorite.dataset.favoriteRecipe);
    const cookRecipe = event.target.closest("[data-cook-recipe]"); if (cookRecipe) return showCookRecipe(cookRecipe.dataset.cookRecipe);
    const openRecipe = event.target.closest("[data-open-recipe]"); if (openRecipe) return openRecipeModal(openRecipe.dataset.openRecipe);
    const complete = event.target.closest("[data-complete-recipe]"); if (complete) return completeRecipe(complete.dataset.completeRecipe);
    if (event.target.closest("[data-regenerate]")) return generateRecipe(true);
    const swap = event.target.closest("[data-swap-day]"); if (swap) { const index = Number(swap.dataset.swapDay), meal = weekMeals[Math.floor(index / 7)]; const choices = weekChoices(meal, state.weekPlan); if (!choices.length) return toast("暂无其他可替换菜谱"); state.weekPlan[index] = choices[0].id; saveState(); renderWeek(); return; }
    const shopping = event.target.closest("[data-shopping]"); if (shopping) { const name = shopping.dataset.shopping; state.shoppingChecked = state.shoppingChecked.includes(name) ? state.shoppingChecked.filter(x=>x!==name) : [...state.shoppingChecked,name]; saveState(); return renderWeek(); }
    const useRecipe = event.target.closest("[data-use-recipe]"); if (useRecipe) { const recipe=recipes.find(x=>x.id===useRecipe.dataset.useRecipe); state.selectedIds=state.ingredients.filter(x=>recipe.ingredients.some(i=>canonicalIngredient(i.name)===canonicalIngredient(x.name))).map(x=>x.id); saveState(); $("#recipeModalBackdrop").classList.remove("open"); renderPicker(); return showPage("cook"); }
    if (event.target.closest("[data-open-add]")) return openAdd();
  });

  $$(".nav-item").forEach(button => button.addEventListener("click", () => showPage(button.dataset.page)));
  $("#searchInput").addEventListener("input", e => { ui.query = e.target.value; renderPantry(); });
  $("#pickerSearch").addEventListener("input", renderPicker);
  $("#recipeSearchInput").addEventListener("input", () => { $("#recipeLookupDetail").classList.add("hidden"); renderRecipeSearch(); });
  $("#favoriteGrid").addEventListener("keydown", event => { if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-cook-recipe]")) { event.preventDefault(); showCookRecipe(event.target.dataset.cookRecipe); } });
  $("#openFilter").addEventListener("click", () => { ui.onlyExpiring = !ui.onlyExpiring; $("#openFilter").textContent = ui.onlyExpiring ? "✓ 仅看临期" : "☷ 筛选"; $("#openFilter").style.background = ui.onlyExpiring ? "var(--green-soft)" : "#fff"; renderPantry(); });
  $("#openAddModal").addEventListener("click", () => openAdd());
  $$(".close-modal").forEach(button => button.addEventListener("click", closeAdd));
  $("#modalBackdrop").addEventListener("click", e => { if (e.target === e.currentTarget) closeAdd(); });
  $$("[data-add-tab]").forEach(button => button.addEventListener("click", () => switchAddTab(button.dataset.addTab)));
  $("#ingredientForm").addEventListener("submit", submitIngredient);
  $("#ingredientName").addEventListener("input", e => { const meta = ingredientMeta[e.target.value.trim()]; if (meta && !ui.editingId) { $("#ingredientCategory").value = meta.category; $("#ingredientStorage").value = meta.storage; $("#ingredientUnit").value = meta.unit; $("#expiryDate").value = offsetDate(meta.life); } });
  $("#photoInput").addEventListener("change", e => recognizePhoto(e.target.files[0]));
  $("#photoName").addEventListener("change", e => { const meta = ingredientMeta[e.target.value.trim()]; if (!meta) return; $("#photoCategory").value = meta.category; $("#photoStorage").value = meta.storage; $("#photoUnit").value = meta.unit; $("#photoExpiryDate").value = offsetDate(meta.life); });
  $("#uploadZone").addEventListener("dragover", e => { e.preventDefault(); e.currentTarget.classList.add("dragover"); });
  $("#uploadZone").addEventListener("dragleave", e => e.currentTarget.classList.remove("dragover"));
  $("#uploadZone").addEventListener("drop", e => { e.preventDefault(); e.currentTarget.classList.remove("dragover"); recognizePhoto(e.dataTransfer.files[0]); });
  $("#notificationButton").addEventListener("click", openDrawer); $("#closeDrawer").addEventListener("click", closeDrawer); $("#drawerBackdrop").addEventListener("click", closeDrawer);
  $("#mobileMenu").addEventListener("click", () => $(".sidebar").classList.toggle("open"));
  $("#clearSelection").addEventListener("click", () => { state.selectedIds=[]; saveState(); renderPantry(); });
  $("#generateRecipe").addEventListener("click", () => generateRecipe());
  $("#shuffleSuggestion").addEventListener("click", () => { state.suggestionIndex=(state.suggestionIndex+1)%rankedSuggestions().length; saveState(); renderSuggestion(); });
  $("#viewSuggestion").addEventListener("click", e => { const recipe=recipes.find(x=>x.id===e.currentTarget.dataset.recipeId); state.selectedIds=state.ingredients.filter(x=>recipe.ingredients.some(i=>i.name===x.name)).map(x=>x.id); saveState(); renderPicker(); showPage("cook"); toast("已把仓库中匹配的食材选好"); });
  $("#generateWeek").addEventListener("click", generateWeek);
  $("#stockPurchased").addEventListener("click", stockPurchased);
  $("#consumeForm").addEventListener("submit", confirmCooking);
  $("#closeConsumeModal").addEventListener("click", () => $("#consumeModalBackdrop").classList.remove("open"));
  $("#cancelConsume").addEventListener("click", () => $("#consumeModalBackdrop").classList.remove("open"));
  $("#consumeModalBackdrop").addEventListener("click", e => { if (e.target === e.currentTarget) e.currentTarget.classList.remove("open"); });
  $("#copyShopping").addEventListener("click", async () => { const text=$$(".shopping-item strong").map(x=>x.textContent).join("、"); try { await navigator.clipboard.writeText(text); toast("采购清单已复制"); } catch { toast("复制失败，请手动记录", "error"); } });
  $$("[data-favorite-tab]").forEach(button => button.addEventListener("click", () => { ui.favoriteTab=button.dataset.favoriteTab; $$("[data-favorite-tab]").forEach(x=>x.classList.toggle("active",x===button)); renderFavorites(); }));
  $$(".close-recipe-modal").forEach(button => button.addEventListener("click", () => $("#recipeModalBackdrop").classList.remove("open")));
  $("#recipeModalBackdrop").addEventListener("click", e => { if(e.target===e.currentTarget)e.currentTarget.classList.remove("open"); });
  document.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==="k") { e.preventDefault(); showPage("pantry"); $("#searchInput").focus(); } if(e.key==="Escape"){ closeWeekRecipePopover(); closeAdd(); closeDrawer(); $("#recipeModalBackdrop").classList.remove("open"); $("#consumeModalBackdrop").classList.remove("open"); } });
}

function init() {
  const hour = new Date().getHours(); $("#dateGreeting").textContent = `${hour < 11 ? "早上" : hour < 14 ? "中午" : hour < 18 ? "下午" : "晚上"}好，林小满`;
  renderCategories(); renderPantry(); renderWeek(); renderFavorites(); bindEvents(); repairStoredPhotoClassification();
}

init();
