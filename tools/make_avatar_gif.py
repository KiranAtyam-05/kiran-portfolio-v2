from PIL import Image, ImageEnhance
from pathlib import Path
base = Path(r'C:\Users\hp\Documents\Codex\2026-06-13\files-mentioned-by-the-user-kiran\outputs\kiran-portfolio\public\assets')
img = Image.open(base / 'kiran-avatar.jpeg').convert('RGB').resize((512, 512), Image.LANCZOS)
frames = []
for i in range(24):
    phase = i if i < 12 else 24 - i
    scale = 1 + phase * 0.0025
    bright = 1 + phase * 0.012
    frame = ImageEnhance.Color(img).enhance(1.08)
    frame = ImageEnhance.Brightness(frame).enhance(bright)
    size = int(512 * scale)
    grown = frame.resize((size, size), Image.LANCZOS)
    left = (size - 512) // 2
    top = (size - 512) // 2
    frames.append(grown.crop((left, top, left + 512, top + 512)))
frames[0].save(base / 'kiran-avatar-animated.gif', save_all=True, append_images=frames[1:], duration=72, loop=0, optimize=True)
