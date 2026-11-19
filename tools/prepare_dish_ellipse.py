from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

source = Path(r'C:\Users\60352\AppData\Local\Temp')
output = Path(r'D:\example\web\finalhomework2\assets\dishes')
output.mkdir(parents=True, exist_ok=True)
plates = [
    ('8bcca40e-09d4-4fd2-94af-4caa602a8778', 'cola_chicken_wings.png', (120, 380, 1160, 1000)),
    ('8372495c-3353-4426-885e-eb215d046e3d', 'tomato_eggs.png', (100, 350, 1170, 1010)),
    ('2df9df43-d983-4508-afc9-37a6387468db', 'minced_pork_long_beans.png', (140, 350, 1140, 1040)),
    ('330b0c40-3bb9-463f-bd0f-30771a388899', 'hot_sour_potato.png', (140, 450, 1170, 1030)),
    ('495d9077-865f-4076-8f46-90b7816f9dcc', 'pepper_pork.png', (205, 420, 1080, 985)),
    ('7a91722e-59ae-4454-a4a2-ba7f20b99783', 'stir_fried_broccoli.png', (190, 405, 1110, 970)),
]
for identifier, filename, box in plates:
    image = Image.open(source / f'codex-clipboard-{identifier}.jpg').convert('RGBA')
    scale = 4
    mask_large = Image.new('L', (image.width * scale, image.height * scale))
    draw = ImageDraw.Draw(mask_large)
    draw.ellipse(tuple(value * scale for value in box), fill=255)
    mask = mask_large.resize(image.size, Image.Resampling.LANCZOS)
    outline = mask.filter(ImageFilter.MaxFilter(31))
    result = Image.new('RGBA', image.size, (255, 255, 255, 0))
    white = Image.new('RGBA', image.size, (255, 255, 255, 255))
    result.paste(white, (0, 0), outline)
    result.paste(image, (0, 0), mask)
    bounds = (box[0] - 25, box[1] - 25, box[2] + 25, box[3] + 25)
    result.crop(bounds).save(output / filename, optimize=True)
    print(filename, (output / filename).stat().st_size)
