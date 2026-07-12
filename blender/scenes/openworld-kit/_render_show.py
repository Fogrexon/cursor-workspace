import bpy, os
from mathutils import Vector
EXPORT=r"c:\projects\cursor-playground\blender\exports\openworld-kit"
scene=bpy.context.scene
scene.render.engine="BLENDER_EEVEE"
scene.render.image_settings.file_format="PNG"
scene.render.resolution_x=1920
scene.render.resolution_y=1080
prevs=[o for o in bpy.data.objects if o.name.startswith("PREV-")]
shows=[o for o in bpy.data.objects if o.name.startswith("SHOW-")]
for o in prevs: o.hide_render=True
for o in shows: o.hide_render=False
cam=bpy.data.objects.get("ShowcaseCamera")
scene.camera=cam
scene.render.filepath=os.path.join(EXPORT,"preview_showcase")
bpy.ops.render.render(write_still=True)
print("SHOWCASE_OK")
