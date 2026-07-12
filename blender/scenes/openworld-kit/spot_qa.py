"""Spot QA renders only — not the final gallery pass."""
import bpy
from mathutils import Vector
import os

EXPORT = r"c:\projects\cursor-playground\blender\exports\openworld-kit\qa"
os.makedirs(EXPORT, exist_ok=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.image_settings.file_format = "PNG"
scene.render.resolution_x = 1280
scene.render.resolution_y = 960
cam = bpy.data.objects.get("PreviewCamera")
scene.camera = cam
prevs = [o for o in bpy.data.objects if o.name.startswith("PREV-")]
shows = [o for o in bpy.data.objects if o.name.startswith("SHOW-")]
for o in shows:
    o.hide_render = True


def aim(target, dist=8, height=3.5):
    center = target.matrix_world.translation + Vector((0, 0, max(0.3, target.dimensions.z * 0.4)))
    cam.location = center + Vector((dist * 0.75, -dist, height))
    cam.rotation_euler = (center - cam.location).to_track_quat("-Z", "Y").to_euler()


shots = [
    ("PREV-ROAD-cobble-cross", "spot_road", 7, 3.5),
    ("PREV-ROAD-cobble-straight", "spot_road_s", 7, 3.5),
    ("PREV-GRND-grass-00", "spot_grass", 7, 3.5),
    ("PREV-BLD-cottage-01", "spot_cottage", 10, 4),
    ("PREV-TREE-oak-00", "spot_oak", 9, 5),
    ("PREV-TREE-pine-03", "spot_pine", 9, 5.5),
    ("PREV-BLD-windmill-01", "spot_mill", 14, 7),
    ("PREV-ROCK-03", "spot_rock", 6, 2.5),
]
for name, out, dist, height in shots:
    t = bpy.data.objects.get(name)
    if not t:
        print("MISSING", name)
        continue
    for o in prevs:
        o.hide_render = o.name != name
    aim(t, dist, height)
    scene.render.filepath = os.path.join(EXPORT, out)
    bpy.ops.render.render(write_still=True)
    print("OK", out)

# showcase quick
for o in prevs:
    o.hide_render = True
for o in shows:
    o.hide_render = False
scene.camera = bpy.data.objects.get("ShowcaseCamera")
scene.render.filepath = os.path.join(EXPORT, "spot_showcase")
bpy.ops.render.render(write_still=True)
print("SPOT_DONE")
