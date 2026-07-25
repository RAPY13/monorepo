from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# Settings
w, h = 1400, 800
out_dir = os.path.join(os.getcwd(), 'public')
out_path = os.path.join(out_dir, 'LandingPage.png')

os.makedirs(out_dir, exist_ok=True)

# Create vertical gradient background
base = Image.new('RGB', (w, h), (18, 18, 18))
for y in range(h):
    t = y / h
    r = int(12 + (255 - 12) * t * 0.6)
    g = int(12 + (90 - 12) * t * 0.6)
    b = int(20 + (60 - 20) * t * 0.6)
    for x in range(w):
        base.putpixel((x, y), (r, g, b))

# Glow overlay
overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
od.ellipse((-300, -200, 700, 700), fill=(255, 140, 0, 120))
overlay = overlay.filter(ImageFilter.GaussianBlur(60))

img = Image.alpha_composite(base.convert('RGBA'), overlay).convert('RGB')
draw = ImageDraw.Draw(img)

# Text (use default font)
try:
    font_title = ImageFont.truetype('arial.ttf', 64)
    font_sub = ImageFont.truetype('arial.ttf', 28)
    font_btn = ImageFont.truetype('arial.ttf', 22)
except Exception:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_btn = ImageFont.load_default()

# Content
title = "Forge the future of your brand."
subtitle = "We build bold digital experiences that feel cinematic, fast, and unforgettable."

# Draw title and subtitle
margin_x = 96
y = 160
draw.text((margin_x, y), title, fill=(255, 255, 255), font=font_title)
y += 110
draw.text((margin_x, y), subtitle, fill=(230, 230, 230), font=font_sub)

# Button
btn_x0 = margin_x
btn_y0 = y + 90
btn_x1 = btn_x0 + 260
btn_y1 = btn_y0 + 56
radius = 14
# Rounded rectangle
draw.rounded_rectangle((btn_x0, btn_y0, btn_x1, btn_y1), radius=radius, fill=(255, 140, 0))
# Button text centered
btn_text = "View our work"
# compute text size using textbbox for modern Pillow
bbox = draw.textbbox((0, 0), btn_text, font=font_btn)
text_w = bbox[2] - bbox[0]
text_h = bbox[3] - bbox[1]
text_x = btn_x0 + (btn_x1 - btn_x0 - text_w) / 2
text_y = btn_y0 + (btn_y1 - btn_y0 - text_h) / 2
draw.text((text_x, text_y), btn_text, fill=(0, 0, 0), font=font_btn)

# Save
img.save(out_path, 'PNG')
print(f"Saved {out_path}")
