import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
v02 = json.loads((root / "data/boundaries/mumbai-localities-v0.2.geojson").read_text())
v03 = json.loads((root / "data/boundaries/mumbai-localities-v0.3.geojson").read_text())

old = next(f for f in v02["features"] if f["properties"]["localityId"] == "juhu")
new = next(f for f in v03["features"] if f["properties"]["localityId"] == "juhu")

width = height = 1200
margin = 120
image = Image.new("RGB", (width, height), "#fbfaf5")
draw = ImageDraw.Draw(image, "RGBA")
font = ImageFont.load_default(size=24)
small = ImageFont.load_default(size=18)
all_points = old["geometry"]["coordinates"][0] + new["geometry"]["coordinates"][0]
xs, ys = zip(*all_points)
xmin, xmax = min(xs) - 0.001, max(xs) + 0.001
ymin, ymax = min(ys) - 0.001, max(ys) + 0.001

def project(point):
    x, y = point
    px = margin + (x - xmin) / (xmax - xmin) * (width - 2 * margin)
    py = height - margin - (y - ymin) / (ymax - ymin) * (height - 2 * margin)
    return (px, py)

old_line = [project(p) for p in old["geometry"]["coordinates"][0]]
new_line = [project(p) for p in new["geometry"]["coordinates"][0]]
draw.polygon(new_line, fill="#1b783722")
draw.line(old_line, fill="#d95f02ff", width=5)
draw.line(new_line, fill="#1b7837ff", width=7)

draw.text((margin, 35), "TreeScore Juhu boundary revision", fill="#173b2b", font=font)
draw.text((margin, 72), "Coordinate preview - satellite review recorded separately", fill="#3d5a4c", font=small)
draw.line([(margin, height - 70), (margin + 70, height - 70)], fill="#d95f02ff", width=5)
draw.text((margin + 85, height - 84), "Juhu v0.2 preserved", fill="#5a321d", font=small)
draw.line([(540, height - 70), (610, height - 70)], fill="#1b7837ff", width=7)
draw.text((625, height - 84), "Juhu v0.3 current candidate", fill="#173b2b", font=small)
draw.text(project((72.831, 19.0995)), "lagoon / aerodrome removed", fill="#8c2d04", font=small, anchor="mm")
draw.multiline_text(project((72.8265, 19.101)), "coastal residential\nstrip retained", fill="#1b7837", font=small, anchor="mm", align="center")

image.save(root / "data/boundaries/preview-juhu-v0.3.png")
