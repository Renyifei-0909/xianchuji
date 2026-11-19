"""Extract user-supplied food photos for the pantry UI."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage


SOURCE = Path(r"C:\Users\60352\AppData\Local\Temp")
OUTPUT = Path(__file__).resolve().parents[1] / "assets" / "foods"
OUTPUT.mkdir(parents=True, exist_ok=True)

# Crop boxes exclude social-app controls, captions and source watermarks.
ITEMS = [
    ("lettuce", "cf659df9-97f0-4f54-8c0e-64c1eec995f6", (50, 160, 1180, 1550)),
    ("tofu", "e9c676fb-58ca-472a-9fc9-548de8958998", (290, 355, 990, 890)),
    ("potato", "8ce2d134-3a7b-448c-b110-75a7793c57a5", (180, 760, 900, 1400)),
    ("onion", "a97d1874-8bc0-46e7-a6a1-cc96a8357152", (40, 300, 1220, 1420)),
    ("shrimp", "4ce0dcac-80e4-488b-b8d8-3471c5ae3f52", (265, 165, 1035, 965)),
    ("pork_chop", "2c49c7b3-c15a-42e6-bbbb-3909514b52c2", (230, 385, 850, 1010)),
    ("pork_belly", "fc89a18c-0663-4a55-a06f-80cc9e0ae56a", (255, 330, 1030, 1490)),
    ("chicken_breast", "4fa51bba-b0e6-4c93-8761-6fe0c9bed3c4", (170, 470, 900, 990)),
    ("ribs", "1704d800-8495-4ecc-92c3-afd29c2fc375", (200, 425, 870, 1080)),
    ("beef_rolls", "e38299e7-d8c5-4ca3-8cdc-8a9d9aa08f97", (165, 385, 910, 1080)),
    ("strawberry", "18739c42-b565-4916-99b5-b256199be01e", (80, 720, 1010, 1690)),
    ("bread", "c21711aa-f650-4000-89e5-900643891f5c", (100, 300, 980, 1320)),
    ("kiwi", "e1b898a7-8004-4cc5-a900-390e5814b5d2", (80, 720, 1010, 1690)),
    ("cherry", "3ce76333-15c7-43b1-90c6-9df9b1544761", (80, 720, 1010, 1690)),
    ("blueberry", "5a0a386c-d601-4755-9b9f-b4a3517bb65d", (80, 720, 1010, 1690)),
    ("lychee", "c7472bdd-943c-4ca3-908c-02a7201ff956", (80, 720, 1010, 1690)),
    ("apple", "e9e505d0-d8eb-4a5a-8014-b50cd67b489e", (80, 720, 1010, 1690)),
    ("lemon", "c9c069d0-bfdb-4345-868f-6e325a3e0191", (80, 720, 1010, 1690)),
    ("plum", "9cda548e-7d24-41c7-872c-6fc61301756d", (80, 720, 1010, 1690)),
    ("watermelon", "1730ac39-9e83-42a3-bf1e-776e4c02d5e4", (80, 720, 1010, 1690)),
    ("peach", "7d0059d8-88e4-4667-9383-1e89bd5db0cd", (80, 720, 1010, 1690)),
    ("steamed_bun", "ec89f79c-c28c-440a-ba17-70a4faac397b", (80, 720, 1010, 1690)),
    ("dried_noodles", "7bff3959-b284-43d4-abc2-3ab77158c578", (350, 70, 900, 1180)),
    ("uncooked_rice", "8d70176f-a1de-469a-b8cd-9d1b8d13eb83", (75, 250, 1180, 960)),
    ("carrot", "58a56dbe-f60a-4122-a585-956154c6cfa4", (350, 60, 950, 1590)),
    ("millet", "bcda1f45-6ac7-4539-8333-3b5cae2473f3", (80, 235, 1180, 1020)),
    ("red_beans", "bb2b3ffe-4594-4bd3-a2f4-99193b1d4c4a", (90, 270, 1170, 1020)),
    ("mung_beans", "f996c46b-175b-4ffe-bc77-f2aae7752f0f", (90, 270, 1170, 1020)),
    ("soybeans", "81015ec7-242c-4ffb-a101-85bf33d9a1c4", (90, 250, 1170, 1020)),
    ("peanuts", "1f963731-ba31-4e7d-a5bc-fde0e6b3c910", (80, 240, 1180, 1050)),
    ("king_oyster_mushroom", "2d1f7f1f-22b6-4b30-b8e2-ffd2074b3467", (180, 250, 740, 630)),
    ("corn", "e28a0db6-8249-4eab-8795-2b3ecd4ae567", (200, 330, 1030, 1000)),
    ("eggplant", "aca4360b-0082-429b-baeb-9720c907afe7", (430, 250, 920, 1500)),
    ("cucumber", "5c20cdaa-3f6d-4446-9ab2-8c6694d02905", (430, 240, 900, 1510)),
    ("zucchini", "229647d2-cb0d-4e58-a65a-7490f397ecf1", (430, 240, 900, 1500)),
    ("bitter_melon", "4d155bec-586a-414c-bf82-6ede2cb07799", (400, 250, 900, 1500)),
    ("long_bean", "7f5c8d85-1bec-4040-ae13-d931f6011d28", (430, 250, 900, 1510)),
    ("snow_pea", "e8c77419-88dc-465b-b383-fdae862d8a03", (240, 70, 1040, 1200)),
    ("beef", "70784dd4-c159-499f-b618-9cb50fde9b37", (270, 450, 800, 990)),
    ("chicken_leg", "b6319f9f-719b-4351-8683-bda8a4efbc8b", (240, 420, 840, 990)),
    ("cola", "addeb6b6-7916-4ade-bd7e-2fa97bb6b393", (390, 940, 700, 1480)),
    ("chicken_wing", "a752c669-d553-4845-af2f-6a03a8504889", (90, 330, 1190, 980)),
]


for name, identifier, box in ITEMS:
    source = SOURCE / f"codex-clipboard-{identifier}.jpg"
    if not source.exists():
        source = SOURCE / f"codex-clipboard-{identifier}.png"
    image = Image.open(source).convert("RGB").crop(box)
    rgb = np.asarray(image).astype(np.int16)
    darkest = rgb.min(axis=2)
    spread = rgb.max(axis=2) - darkest
    foreground = (darkest < 239) | (spread > 25)
    foreground = ndimage.binary_opening(foreground, iterations=2)
    labels, count = ndimage.label(foreground)
    if not count:
        raise RuntimeError(f"Could not isolate {name}")
    sizes = np.bincount(labels.ravel())
    sizes[0] = 0
    main = labels == sizes.argmax()
    main = ndimage.binary_fill_holes(main)
    main = ndimage.binary_closing(main, iterations=3)
    rows, cols = np.where(main)
    left, right = cols.min(), cols.max() + 1
    top, bottom = rows.min(), rows.max() + 1
    image = image.crop((left, top, right, bottom))
    alpha = Image.fromarray((main[top:bottom, left:right] * 255).astype("uint8"))
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.2))
    image.thumbnail((460, 460), Image.Resampling.LANCZOS)
    alpha = alpha.resize(image.size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    x, y = (512 - image.width) // 2, (512 - image.height) // 2
    border = alpha.filter(ImageFilter.MaxFilter(21))
    canvas.paste(Image.new("RGBA", image.size, "white"), (x, y), border)
    canvas.paste(image, (x, y), alpha)
    canvas.save(OUTPUT / f"{name}.png", optimize=True)
    print(f"{name}: {source.name} -> {name}.png")
