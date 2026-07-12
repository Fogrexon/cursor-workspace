"""Debug tree material assignment in isolation."""
import bmesh
import bpy
from mathutils import Vector

# clear
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)

bm = bmesh.new()
ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.2, radius2=0.1, depth=3.0)
for v in ret["verts"]:
    v.co.z += 1.5
for f in bm.faces:
    f.material_index = 0
print("after trunk", len(bm.faces), "mats", set(f.material_index for f in bm.faces))

for i in range(4):
    f0 = len(bm.faces)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=1.5 - i * 0.3, radius2=0.08, depth=1.2)
    for v in ret["verts"]:
        v.co.z += 2.5 + i * 0.8
    bm.faces.ensure_lookup_table()
    for j in range(f0, len(bm.faces)):
        bm.faces[j].material_index = 1
    print(f"tier{i} f0={f0} faces={len(bm.faces)} new_mats", set(bm.faces[j].material_index for j in range(f0, len(bm.faces))))

print("before tri", {i: sum(1 for f in bm.faces if f.material_index == i) for i in (0, 1)})
bmesh.ops.triangulate(bm, faces=bm.faces[:])
print("after tri", {i: sum(1 for f in bm.faces if f.material_index == i) for i in (0, 1)})

me = bpy.data.meshes.new("t")
ob = bpy.data.objects.new("t", me)
bpy.context.scene.collection.objects.link(ob)
bm.to_mesh(me)
bm.free()
print("mesh", {i: sum(1 for p in me.polygons if p.material_index == i) for i in (0, 1)})
