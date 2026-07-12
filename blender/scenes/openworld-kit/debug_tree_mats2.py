"""Debug: track global mat counts after each cone."""
import bmesh
import bpy

bm = bmesh.new()
ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.2, radius2=0.1, depth=3.0)
for v in ret["verts"]:
    v.co.z += 1.5
for f in bm.faces:
    f.material_index = 0
print("trunk", len(bm.faces), {i: sum(1 for f in bm.faces if f.material_index == i) for i in (0, 1)})

for i in range(4):
    f0 = len(bm.faces)
    # snapshot old face mats
    old = [f.material_index for f in bm.faces]
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=1.5 - i * 0.3, radius2=0.08, depth=1.2)
    for v in ret["verts"]:
        v.co.z += 2.5 + i * 0.8
    bm.faces.ensure_lookup_table()
    # check if old faces changed
    changed = 0
    for j, m in enumerate(old):
        if j < len(bm.faces) and bm.faces[j].material_index != m:
            changed += 1
    for j in range(f0, len(bm.faces)):
        bm.faces[j].material_index = 1
    print(f"tier{i} faces={len(bm.faces)} old_changed_before_mark={changed} counts", {i: sum(1 for f in bm.faces if f.material_index == i) for i in (0, 1)})
    # also check face index stability: did old face count stay?
    print(f"  f0={f0} new={len(bm.faces)-f0}")

bm.free()
print("DONE")
