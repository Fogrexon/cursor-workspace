"""Verify facesnap marking survives create_cone reshuffles."""
import bmesh

bm = bmesh.new()
ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.2, radius2=0.1, depth=3.0)
for v in ret["verts"]:
    v.co.z += 1.5
for f in bm.faces:
    f.material_index = 0

for i in range(4):
    before = set(bm.faces)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=1.5 - i * 0.3, radius2=0.08, depth=1.2)
    for v in ret["verts"]:
        v.co.z += 2.5 + i * 0.8
    for f in bm.faces:
        if f not in before:
            f.material_index = 1
    print(f"tier{i}", {i: sum(1 for f in bm.faces if f.material_index == i) for i in (0, 1)})

bmesh.ops.triangulate(bm, faces=bm.faces[:])
print("after tri", {i: sum(1 for f in bm.faces if f.material_index == i) for i in (0, 1)})
bm.free()
