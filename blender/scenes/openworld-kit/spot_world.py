import bpy, os
from mathutils import Vector
EXPORT = r"c:\projects\cursor-playground\blender\exports\openworld-kit\qa"
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.image_settings.file_format = "PNG"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
for o in bpy.data.objects:
    if o.name.startswith("PREV-"):
        o.hide_render = True
        o.hide_viewport = True
    elif o.name.startswith("SHOW-"):
        o.hide_render = False
        o.hide_viewport = False
shows = [o for o in bpy.data.objects if o.name.startswith("SHOW-")]
xs = [o.location.x for o in shows]; ys = [o.location.y for o in shows]
cx, cy = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2
span = max(max(xs)-min(xs), max(ys)-min(ys), 40)
for name, path, loc, look, lens in [
    ("ShowcaseCamera", "world_overview", (cx+8, cy-span*0.95, max(28, span*0.6)), (cx, cy+1, 1), 30),
    ("WorldHeroCamera", "world_hero", (cx+0.5, cy-14, 7.5), (cx+0.5, cy+2, 1.2), 30),
    ("WorldDockCamera", "world_dock", (cx-22, cy-18, 11), (cx-16, cy-4, 1), 28),
    ("ShowcaseCamera", "world_topdown", (cx, cy-2, span*0.85), (cx, cy, 0), 35),
]:
    cam = bpy.data.objects.get(name)
    cam.data.lens = lens
    cam.location = Vector(loc)
    cam.rotation_euler = (Vector(look) - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam
    scene.render.filepath = os.path.join(EXPORT, path)
    bpy.ops.render.render(write_still=True)
    print("SHOT", path)
print("DONE", len(shows))
