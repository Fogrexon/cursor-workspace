"""Render contact sheet, showcase, and hero QA shots for openworld-kit."""
from __future__ import annotations

import math
import os

import bpy
from mathutils import Vector

EXPORT = r"c:\projects\cursor-playground\blender\exports\openworld-kit"
QA = os.path.join(EXPORT, "qa")
os.makedirs(QA, exist_ok=True)

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.image_settings.file_format = "PNG"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.view_settings.view_transform = "Standard"

prevs = [o for o in bpy.data.objects if o.name.startswith("PREV-")]
shows = [o for o in bpy.data.objects if o.name.startswith("SHOW-")]
cam_prev = bpy.data.objects.get("PreviewCamera")
cam_show = bpy.data.objects.get("ShowcaseCamera")


def set_visible(objs, visible: bool):
    for o in objs:
        o.hide_render = not visible
        o.hide_viewport = not visible


def aim_cam(cam, target, dist=8.0, height=3.5):
    center = target.matrix_world.translation + Vector((0, 0, max(0.4, target.dimensions.z * 0.4)))
    cam.location = center + Vector((dist * 0.75, -dist, height))
    cam.rotation_euler = (center - cam.location).to_track_quat("-Z", "Y").to_euler()


def render_to(path: str):
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print("WROTE", path)


# --- Contact sheet ---
set_visible(shows, False)
set_visible(prevs, True)
if cam_prev:
    # Fit camera to preview grid
    xs = [o.location.x for o in prevs]
    ys = [o.location.y for o in prevs]
    zs = [o.dimensions.z for o in prevs]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    span = max(max(xs) - min(xs), max(ys) - min(ys), 50)
    zmax = max(zs) if zs else 8
    cam_prev.data.lens = 35
    cam_prev.location = Vector((cx + span * 0.08, cy - span * 1.05, max(span * 0.55, zmax * 4, 60)))
    cam_prev.rotation_euler = (Vector((cx, cy, 2)) - cam_prev.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam_prev
render_to(os.path.join(EXPORT, "preview_contact_sheet"))

# --- World showcase ---
set_visible(prevs, False)
set_visible(shows, True)
if shows and cam_show:
    xs = [o.location.x for o in shows]
    ys = [o.location.y for o in shows]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    span = max(max(xs) - min(xs), max(ys) - min(ys), 40)
    cam_show.data.lens = 30
    cam_show.location = Vector((cx + 8, cy - span * 0.95, max(28, span * 0.6)))
    cam_show.rotation_euler = (Vector((cx, cy + 1, 1)) - cam_show.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam_show
render_to(os.path.join(EXPORT, "preview_showcase"))

# Extra world angles
cam_hero = bpy.data.objects.get("WorldHeroCamera")
if cam_hero and shows:
    cam_hero.data.lens = 30
    cam_hero.location = Vector((cx + 0.5, cy - 14, 7.5))
    cam_hero.rotation_euler = (Vector((cx + 0.5, cy + 2, 1.2)) - cam_hero.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam_hero
    render_to(os.path.join(EXPORT, "preview_world_street"))
cam_dock = bpy.data.objects.get("WorldDockCamera")
if cam_dock:
    cam_dock.data.lens = 28
    cam_dock.location = Vector((cx - 22, cy - 18, 11))
    cam_dock.rotation_euler = (Vector((cx - 16, cy - 4, 1)) - cam_dock.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam_dock
    render_to(os.path.join(EXPORT, "preview_world_dock"))

# --- Heroes ---
set_visible(shows, False)
heroes = [
    ("PREV-BLD-cottage-01", "qa_hero_cottage", 10.0, 4.0),
    ("PREV-BLD-tower-01", "qa_hero_tower", 12.0, 6.0),
    ("PREV-BLD-windmill-01", "qa_hero_windmill", 14.0, 7.0),
    ("PREV-TREE-oak-00", "qa_hero_tree_oak", 9.0, 5.0),
    ("PREV-TREE-pine-03", "qa_hero_tree_pine", 9.0, 5.5),
    ("PREV-ROCK-03", "qa_hero_rock", 6.0, 2.5),
    ("PREV-CLIFF-01", "qa_hero_cliff", 14.0, 6.0),
    ("PREV-GRND-grass-00", "qa_hero_ground_grass", 8.0, 4.0),
    ("PREV-GRND-farm-12", "qa_hero_ground_farm", 8.0, 4.0),
    ("PREV-GRND-cobble_plaza-15", "qa_hero_ground_plaza", 8.0, 4.0),
    ("PREV-ROAD-cobble-cross", "qa_hero_road_cross", 8.0, 4.0),
    ("PREV-ROAD-dirt-straight", "qa_hero_road_dirt", 8.0, 4.0),
    ("PREV-RIV-straight-00", "qa_hero_river", 8.0, 4.0),
    ("PREV-PROP-cart-01", "qa_hero_cart", 6.0, 2.8),
    ("PREV-WAT-boat-01", "qa_hero_boat", 7.0, 2.5),
    ("PREV-CAMP-tent-01", "qa_hero_tent", 8.0, 3.5),
]

scene.camera = cam_prev
for name, outfile, dist, height in heroes:
    target = bpy.data.objects.get(name)
    if not target or not cam_prev:
        print("SKIP", name)
        continue
    for o in prevs:
        hide = o.name != name
        o.hide_render = hide
        o.hide_viewport = hide
    aim_cam(cam_prev, target, dist, height)
    render_to(os.path.join(QA, outfile))

# restore visibility for file
set_visible(prevs, True)
set_visible(shows, True)
if cam_prev:
    scene.camera = cam_prev

# Tree QA metrics
metrics = {}
for n in ["TREE-oak-00", "TREE-pine-03", "TREE-willow-11", "TREE-palm-13"]:
    o = bpy.data.objects.get(n)
    if not o:
        continue
    zs = [o.matrix_world @ v.co for v in o.data.vertices]
    metrics[n] = {
        "zmin": round(min(p.z for p in zs), 3),
        "zmax": round(max(p.z for p in zs), 3),
        "mats": sorted({p.material_index for p in o.data.polygons}),
        "verts": len(o.data.vertices),
    }

print("TREE_METRICS", metrics)
print("DONE_RENDER")
