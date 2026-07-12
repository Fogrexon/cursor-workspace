import bpy, bmesh, math
from mathutils import Vector, Matrix, noise

def rebuild_tree(obj, kind):
    mesh = obj.data
    bm = bmesh.new()
    h = {"oak":5.0,"pine":6.5,"birch":5.4,"autumn":4.8,"dead":4.0}.get(kind,5.0)
    r0 = {"oak":0.28,"pine":0.2,"birch":0.13,"autumn":0.24,"dead":0.18}.get(kind,0.25)

    trunk_h = h * 0.62
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=r0, radius2=r0*0.55, depth=trunk_h)
    for v in ret["verts"]:
        v.co.z += trunk_h * 0.5
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= zmin
    for f in bm.faces:
        f.material_index = 0
    trunk_top = max(v.co.z for v in bm.verts)

    if kind == "pine":
        for i, t in enumerate((0.1, 0.32, 0.54, 0.76)):
            rad = 1.5 - i * 0.28
            depth = 1.25 - i * 0.12
            f0 = len(bm.faces)
            ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=rad, radius2=0.05, depth=depth)
            for v in ret["verts"]:
                v.co.z += trunk_top + t * (h - trunk_top) + depth * 0.4
            bm.faces.ensure_lookup_table()
            for j in range(f0, len(bm.faces)):
                bm.faces[j].material_index = 1
    elif kind == "dead":
        for ang, zh, length in ((0.5, 0.55, 1.2), (2.4, 0.7, 1.0), (4.0, 0.6, 0.9)):
            f0 = len(bm.faces)
            ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.07, radius2=0.02, depth=length)
            rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(math.radians(48), 4, "Y")
            for v in ret["verts"]:
                v.co = rot @ (v.co + Vector((0, 0, length * 0.5)))
                v.co.z += trunk_top * zh
            bm.faces.ensure_lookup_table()
            for j in range(f0, len(bm.faces)):
                bm.faces[j].material_index = 0
    else:
        clumps = {
            "oak": [(0, 0, 1.35), (0.7, 0.25, 1.0), (-0.65, -0.2, 1.05), (0.2, -0.65, 0.95)],
            "birch": [(0, 0, 1.1), (0.5, 0.15, 0.85), (-0.45, 0.2, 0.8)],
            "autumn": [(0, 0, 1.25), (0.6, -0.2, 0.95), (-0.55, 0.25, 0.9)],
        }[kind]
        for x, y, rad in clumps:
            f0 = len(bm.faces)
            ret = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rad)
            center = Vector((x, y, trunk_top + rad * 0.9))
            for v in ret["verts"]:
                co = v.co.copy()
                co.z *= 0.7
                co *= 1.0 + noise.noise(co * 2.0 + center) * 0.12
                v.co = co + center
            bm.faces.ensure_lookup_table()
            for j in range(f0, len(bm.faces)):
                bm.faces[j].material_index = 1

    # XY center, keep Z as-is (already grounded by trunk)
    xs = [v.co.x for v in bm.verts]
    ys = [v.co.y for v in bm.verts]
    cx = (min(xs) + max(xs)) / 2
    cy = (min(ys) + max(ys)) / 2
    for v in bm.verts:
        v.co.x -= cx
        v.co.y -= cy
    # if anything dipped below 0, lift all
    zmin = min(v.co.z for v in bm.verts)
    if zmin < -0.001:
        for v in bm.verts:
            v.co.z -= zmin

    face_mats = [f.material_index for f in bm.faces]
    bm.to_mesh(mesh)
    bm.free()

    bark = bpy.data.materials.get("M_bark_light" if kind == "birch" else "M_bark")
    leaf_name = {"oak": "M_leaf", "pine": "M_pine", "birch": "M_leaf_yellow", "autumn": "M_autumn", "dead": None}[kind]
    while len(mesh.materials) < (1 if kind == "dead" else 2):
        mesh.materials.append(None)
    mesh.materials[0] = bark
    if leaf_name:
        mesh.materials[1] = bpy.data.materials.get(leaf_name)
    max_i = len(mesh.materials) - 1
    for p, idx in zip(mesh.polygons, face_mats):
        p.material_index = min(idx, max_i)
    mesh.update()

n = 0
for obj in bpy.data.objects:
    if obj.name.startswith("TREE-") and not obj.name.startswith(("PREV-", "SHOW-")):
        rebuild_tree(obj, obj.name.split("-")[1])
        n += 1
bpy.ops.wm.save_mainfile()
from mathutils import Vector
o = bpy.data.objects["TREE-oak-00"]
zb, zl = [], []
for p in o.data.polygons:
    c = sum((o.data.vertices[i].co for i in p.vertices), Vector()) / len(p.vertices)
    (zb if p.material_index == 0 else zl).append(c.z)
print("FIXED3", n, "oak bark", round(min(zb), 2), round(max(zb), 2), "leaf", round(min(zl), 2), round(max(zl), 2), "dims", tuple(round(x, 2) for x in o.dimensions))
