"""
v5  Eexpanded + polished low-poly openworld kit.
- Fixed trees (operator verts, canopy above trunk)
- More biomes/props/buildings
- Richer showcase
"""
from __future__ import annotations

import math
import os
import random

import bmesh
import bpy
from mathutils import Matrix, Vector, noise

BLEND = r"c:\projects\cursor-playground\blender\scenes\openworld-kit\openworld-kit.blend"
EXPORT = r"c:\projects\cursor-playground\blender\exports\openworld-kit"
QA = os.path.join(EXPORT, "qa")
os.makedirs(QA, exist_ok=True)
rng = random.Random(20260712)

COLS = {
    "stone": (0.56, 0.54, 0.51, 1),
    "stone_dark": (0.38, 0.37, 0.36, 1),
    "stone_warm": (0.62, 0.56, 0.48, 1),
    "moss": (0.32, 0.52, 0.26, 1),
    "dirt": (0.42, 0.30, 0.20, 1),
    "dirt_light": (0.58, 0.46, 0.32, 1),
    "dirt_road": (0.50, 0.36, 0.22, 1),
    "mud": (0.32, 0.24, 0.16, 1),
    "sand": (0.78, 0.68, 0.45, 1),
    "sand_wet": (0.62, 0.52, 0.36, 1),
    "bark": (0.32, 0.18, 0.10, 1),
    "bark_light": (0.58, 0.42, 0.26, 1),
    "leaf": (0.22, 0.58, 0.18, 1),
    "leaf_dark": (0.10, 0.34, 0.12, 1),
    "leaf_yellow": (0.78, 0.62, 0.14, 1),
    "autumn": (0.82, 0.32, 0.10, 1),
    "pine": (0.08, 0.42, 0.16, 1),
    "plaster": (0.92, 0.88, 0.78, 1),
    "plaster_cool": (0.82, 0.84, 0.80, 1),
    "brick": (0.68, 0.32, 0.24, 1),
    "wood": (0.56, 0.36, 0.16, 1),
    "wood_dark": (0.26, 0.15, 0.08, 1),
    "thatch": (0.66, 0.52, 0.24, 1),
    "roof": (0.55, 0.18, 0.14, 1),
    "roof_blue": (0.26, 0.40, 0.58, 1),
    "slate": (0.28, 0.32, 0.36, 1),
    "metal": (0.48, 0.50, 0.54, 1),
    "glass": (0.38, 0.72, 0.80, 1),
    "grass": (0.28, 0.60, 0.20, 1),
    "grass_bright": (0.38, 0.70, 0.24, 1),
    "grass_dry": (0.55, 0.58, 0.26, 1),
    "cobble": (0.52, 0.52, 0.50, 1),
    "cobble_dark": (0.34, 0.34, 0.33, 1),
    "gravel": (0.58, 0.54, 0.48, 1),
    "farm_soil": (0.38, 0.26, 0.16, 1),
    "farm_furrow": (0.28, 0.18, 0.10, 1),
    "flower_r": (0.86, 0.22, 0.28, 1),
    "flower_y": (0.94, 0.78, 0.16, 1),
    "flower_p": (0.70, 0.35, 0.75, 1),
    "flower_w": (0.94, 0.94, 0.90, 1),
    "water": (0.22, 0.52, 0.78, 1),
    "cloth_r": (0.72, 0.18, 0.18, 1),
    "cloth_b": (0.22, 0.38, 0.72, 1),
    "cloth_g": (0.20, 0.55, 0.32, 1),
    "cloth_w": (0.92, 0.90, 0.84, 1),
    "mushroom": (0.78, 0.22, 0.22, 1),
    "mushroom_stem": (0.88, 0.82, 0.70, 1),
    "wheat": (0.78, 0.68, 0.28, 1),
    "snow": (0.92, 0.94, 0.96, 1),
    "snow_dirt": (0.72, 0.70, 0.68, 1),
}


def clear():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    for db in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for b in list(db):
            db.remove(b)
    for c in list(bpy.data.collections):
        if c.name not in {"Collection", "Scene Collection"}:
            try:
                bpy.data.collections.remove(c)
            except Exception:
                pass


def ensure_coll(name, parent):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in [x.name for x in parent.children]:
        parent.children.link(c)
    return c


_mats = {}


def mat(key):
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new("M_" + key)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = COLS[key]
    rough = 0.3 if key == "glass" else (0.4 if key == "metal" else (0.55 if key == "water" else 0.82))
    bsdf.inputs["Roughness"].default_value = rough
    if key == "metal":
        bsdf.inputs["Metallic"].default_value = 0.6
    if key in ("glass", "water"):
        bsdf.inputs["Alpha"].default_value = 0.7 if key == "glass" else 0.85
        m.blend_method = "BLEND"
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    _mats[key] = m
    return m


def new_obj(name, coll):
    me = bpy.data.meshes.new(name)
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    ob["kit_category"] = coll.name
    ob["usage"] = "openworld_modular_prop"
    return ob, bmesh.new()


def box(bm, sx, sy, sz, ox=0.0, oy=0.0, oz=0.0, mat_index=0):
    before = set(bm.faces)
    verts = bmesh.ops.create_cube(bm, size=1.0)["verts"]
    for v in verts:
        v.co.x = ox + v.co.x * sx
        v.co.y = oy + v.co.y * sy
        v.co.z = oz + v.co.z * sz
    for f in bm.faces:
        if f not in before:
            f.material_index = mat_index
    return verts


def mark_new(bm, before_faces, mat_index):
    """Assign material to faces created after a snapshot (face indices are unstable)."""
    for f in bm.faces:
        if f not in before_faces:
            f.material_index = mat_index


def facesnap(bm):
    return set(bm.faces)

def assign_mats(obj, keys):
    for i, k in enumerate(keys):
        m = mat(k)
        if i < len(obj.data.materials):
            obj.data.materials[i] = m
        else:
            obj.data.materials.append(m)
    while len(obj.data.materials) > len(keys):
        obj.data.materials.pop()


def ground(obj):
    xs = [v.co.x for v in obj.data.vertices]
    ys = [v.co.y for v in obj.data.vertices]
    zs = [v.co.z for v in obj.data.vertices]
    cx, cy, z0 = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, min(zs)
    for v in obj.data.vertices:
        v.co.x -= cx
        v.co.y -= cy
        v.co.z -= z0
    obj.data.update()
    obj.location = (0, 0, 0)


def finish(obj, bm, mat_keys, triangulate=False):
    # Clamp indices before export; do NOT re-zip after to_mesh
    # (mesh polygon order can differ from bm.faces and scramble colors).
    max_i = max(0, len(mat_keys) - 1)
    bm.faces.ensure_lookup_table()
    for f in bm.faces:
        f.material_index = min(max(0, f.material_index), max_i)
        f.smooth = False
    if triangulate:
        bmesh.ops.triangulate(bm, faces=bm.faces[:])
        for f in bm.faces:
            f.material_index = min(max(0, f.material_index), max_i)
            f.smooth = False
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(obj.data)
    bm.free()
    assign_mats(obj, mat_keys)
    for p in obj.data.polygons:
        p.use_smooth = False
    ground(obj)


# ---------- assets ----------

def make_rock(name, coll, size=1.0, kind="boulder"):
    obj, bm = new_obj(name, coll)
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=3, use_grid_fill=True)
    seed = rng.random() * 40
    sc = {"boulder": (1.2, 1.0, 0.85), "slab": (1.8, 1.2, 0.35), "chunk": (0.95, 0.8, 1.1), "round": (1.05, 1.05, 0.9), "tall": (0.7, 0.7, 1.5)}[kind]
    for v in bm.verts:
        v.co.x *= size * sc[0]
        v.co.y *= size * sc[1]
        v.co.z *= size * sc[2]
        n = noise.noise(Vector((v.co.x * 1.8 + seed, v.co.y * 1.8, v.co.z * 1.8)))
        n2 = noise.noise(Vector((v.co.x * 3.5, v.co.y * 3.5 + seed, v.co.z * 3.5)))
        v.co *= 0.82 + n * 0.22
        v.co += Vector((n, n2 * 0.5, abs(n))) * size * 0.1
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        if v.co.z < zmin + size * 0.35:
            v.co.z = zmin + (v.co.z - zmin) * 0.1
    bm.normal_update()
    for f in bm.faces:
        if f.normal.z > 0.65 and rng.random() > 0.4:
            f.material_index = 1
        elif f.normal.z < 0.15:
            f.material_index = 2
        else:
            f.material_index = 0
    finish(obj, bm, ["stone", "moss", "dirt"], triangulate=True)
    return obj


def make_cliff(name, coll, w=4.0, d=2.0, h=3.5):
    obj, bm = new_obj(name, coll)
    # Layered noisy cliff face (not a flat box stack)
    layers = 5
    for li in range(layers):
        t = li / (layers - 1)
        ww = w * (1.05 - t * 0.35) + rng.random() * 0.4
        dd = d * (1.0 - t * 0.25) + rng.random() * 0.25
        hh = h / layers * (0.85 + rng.random() * 0.35)
        oz = sum(h / layers for _ in range(li)) + hh / 2
        ox = (rng.random() - 0.5) * 0.35
        oy = -t * d * 0.15
        before = facesnap(bm)
        verts = box(bm, ww, dd, hh, ox=ox, oy=oy, oz=oz, mat_index=0)
        seed = rng.random() * 30
        for v in verts:
            n = noise.noise(Vector((v.co.x * 0.7 + seed, v.co.y * 0.7, v.co.z * 0.4)))
            v.co.x += n * 0.25
            v.co.y += n * 0.15 if v.co.y > oy else -abs(n) * 0.35
    # talus / rubble at base
    for i in range(4):
        box(bm, 0.5 + rng.random() * 0.5, 0.4 + rng.random() * 0.3, 0.25 + rng.random() * 0.35,
            ox=(rng.random() - 0.5) * w * 0.8, oy=-d * 0.55 - rng.random() * 0.3, oz=0.2, mat_index=2)
    for f in bm.faces:
        if f.normal.z > 0.65:
            f.material_index = 1
        elif f.normal.y < -0.4 and rng.random() > 0.5:
            f.material_index = 2
    finish(obj, bm, ["stone_dark", "moss", "dirt"], triangulate=True)
    return obj


def make_tree(name, coll, kind="oak"):
    obj, bm = new_obj(name, coll)
    h = {"oak": 5.4, "pine": 7.0, "birch": 5.6, "autumn": 5.0, "dead": 4.3, "willow": 4.8, "palm": 6.0}.get(kind, 5.0)
    r0 = {"oak": 0.32, "pine": 0.22, "birch": 0.13, "autumn": 0.26, "dead": 0.2, "willow": 0.24, "palm": 0.17}.get(kind, 0.25)
    bark_key = "bark_light" if kind in ("birch", "palm") else "bark"
    leaf_key = {"oak": "leaf", "pine": "pine", "birch": "leaf_yellow", "autumn": "autumn", "dead": None, "willow": "leaf_dark", "palm": "leaf"}.get(kind)
    leaf2 = {"oak": "leaf_dark", "pine": "leaf_dark", "birch": "leaf", "autumn": "leaf_yellow", "willow": "leaf", "palm": "leaf_dark"}.get(kind)

    trunk_h = h * 0.52
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=r0 * 1.35, radius2=r0 * 0.95, depth=trunk_h * 0.22)
    for v in ret["verts"]:
        v.co.z += trunk_h * 0.11
    mark_new(bm, before, 0)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=r0, radius2=r0 * 0.5, depth=trunk_h * 0.85)
    for v in ret["verts"]:
        v.co.z += trunk_h * 0.22 + trunk_h * 0.425
    mark_new(bm, before, 0)
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= zmin
    trunk_top = max(v.co.z for v in bm.verts)

    def add_leaf_sphere(center, rad, mat_i=1):
        before = facesnap(bm)
        ret = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rad)
        for v in ret["verts"]:
            co = v.co.copy()
            co.z *= 0.7
            co *= 1.0 + noise.noise(co * 2.2 + center) * 0.14
            v.co = co + center
            if v.co.z < trunk_top - 0.08:
                v.co.z = trunk_top - 0.08
        mark_new(bm, before, mat_i)

    if kind == "pine":
        for i in range(5):
            before = facesnap(bm)
            rad, depth = 1.75 - i * 0.28, 1.25 - i * 0.1
            rad *= 0.92 + rng.random() * 0.12
            ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=7, radius1=rad, radius2=0.06, depth=depth)
            base = trunk_top - 0.35 + i * depth * 0.68
            ox = (rng.random() - 0.5) * 0.15
            oy = (rng.random() - 0.5) * 0.15
            for v in ret["verts"]:
                v.co.x += ox
                v.co.y += oy
                v.co.z += base + depth * 0.5
            mark_new(bm, before, 1 if i % 2 == 0 else 2)
    elif kind == "palm":
        for ang in range(8):
            before = facesnap(bm)
            ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=1.05, radius2=0.03, depth=0.16)
            tilt = math.radians(68 + rng.random() * 12)
            rot = Matrix.Rotation(ang / 8 * math.tau, 4, "Z") @ Matrix.Rotation(tilt, 4, "Y")
            for v in ret["verts"]:
                v.co = rot @ v.co
                v.co.z += trunk_top - 0.05
            mark_new(bm, before, 1)
        add_leaf_sphere(Vector((0, 0, trunk_top + 0.2)), 0.4, 1)
    elif kind == "dead":
        for ang, zh, length in ((0.4, 0.55, 1.3), (2.3, 0.7, 1.1), (4.0, 0.6, 0.95), (1.2, 0.8, 0.7), (5.1, 0.45, 0.85)):
            before = facesnap(bm)
            ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.07, radius2=0.02, depth=length)
            rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(math.radians(45 + rng.random() * 20), 4, "Y")
            for v in ret["verts"]:
                v.co = rot @ (v.co + Vector((0, 0, length * 0.5)))
                v.co.z += trunk_top * zh
            mark_new(bm, before, 0)
    else:
        clumps = {
            "oak": [(0, 0, 1.6), (0.9, 0.35, 1.15), (-0.85, -0.3, 1.2), (0.3, -0.85, 1.1), (0.6, 0.75, 1.0), (-0.45, 0.7, 0.95), (0.15, 0.15, 1.85), (-0.2, -0.35, 1.55)],
            "birch": [(0, 0, 1.25), (0.55, 0.2, 1.0), (-0.55, 0.15, 0.95), (0.2, -0.55, 0.9), (0.0, 0.1, 1.7)],
            "autumn": [(0, 0, 1.4), (0.75, -0.25, 1.1), (-0.7, 0.3, 1.05), (0.2, 0.8, 0.95), (0.1, 0.1, 1.75)],
            "willow": [(0, 0, 1.3), (0.95, 0.2, 1.1), (-0.95, -0.15, 1.1), (0.3, -1.0, 1.15), (-0.4, 0.95, 1.1), (0.65, -0.55, 1.0), (-0.5, -0.6, 1.0)],
        }[kind]
        for i, (x, y, rad) in enumerate(clumps):
            mat_i = 1 if (leaf2 is None or i % 3) else 2
            add_leaf_sphere(Vector((x * 0.85, y * 0.85, trunk_top + rad * 0.5)), rad, mat_i)
        if kind == "willow":
            for i in range(8):
                ang = i / 8 * math.tau
                box(bm, 0.1, 0.1, 1.55 + rng.random() * 0.3,
                    ox=math.cos(ang) * 1.0, oy=math.sin(ang) * 1.0,
                    oz=trunk_top + 0.15, mat_index=1)

    xs = [v.co.x for v in bm.verts]
    ys = [v.co.y for v in bm.verts]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    for v in bm.verts:
        v.co.x -= cx
        v.co.y -= cy
    zmin = min(v.co.z for v in bm.verts)
    if zmin < 0:
        for v in bm.verts:
            v.co.z -= zmin

    if leaf_key is None:
        keys = [bark_key]
    elif leaf2:
        keys = [bark_key, leaf_key, leaf2]
    else:
        keys = [bark_key, leaf_key]
    finish(obj, bm, keys, triangulate=True)
    return obj

def make_bush(name, coll, autumn=False):
    obj, bm = new_obj(name, coll)
    leaf = "autumn" if autumn else "leaf"
    for center, rad in ((Vector((0, 0, 0.55)), 0.65), (Vector((0.4, 0.15, 0.4)), 0.45), (Vector((-0.38, -0.12, 0.42)), 0.48), (Vector((0.1, -0.4, 0.45)), 0.42)):
        before = facesnap(bm)
        ret = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rad)
        for v in ret["verts"]:
            v.co.z *= 0.62
            v.co *= 1.0 + noise.noise(v.co * 2.5) * 0.15
            v.co += center
        mark_new(bm, before, 0)
    finish(obj, bm, [leaf, "leaf_dark"], triangulate=True)
    return obj


def make_house(name, coll, w=4.8, d=4.0, wh=2.8, style="cottage"):
    obj, bm = new_obj(name, coll)
    plaster, foundation, wood, roof_i, glass = 0, 1, 2, 3, 4
    t = 0.32
    # Tall visible plinth so seating on ground reads clearly
    box(bm, w + 0.45, d + 0.45, 0.5, oz=0.25, mat_index=foundation)
    box(bm, w - 0.05, d - 0.05, 0.1, oz=0.52, mat_index=wood)
    # front steps
    box(bm, 1.3, 0.55, 0.14, oy=-d / 2 - 0.35, oz=0.22, mat_index=foundation)
    box(bm, 1.1, 0.4, 0.12, oy=-d / 2 - 0.22, oz=0.34, mat_index=foundation)
    wall_z0 = 0.5
    box(bm, w, t, wh, oy=d / 2 - t / 2, oz=wall_z0 + wh / 2, mat_index=plaster)
    box(bm, t, d - 2 * t, wh, ox=-w / 2 + t / 2, oz=wall_z0 + wh / 2, mat_index=plaster)
    box(bm, t, d - 2 * t, wh, ox=w / 2 - t / 2, oz=wall_z0 + wh / 2, mat_index=plaster)
    dw, dh = 1.0, 2.15
    side = (w - dw) / 2
    fy = -d / 2 + t / 2
    box(bm, side, t, wh, ox=-(dw / 2 + side / 2), oy=fy, oz=wall_z0 + wh / 2, mat_index=plaster)
    box(bm, side, t, wh, ox=(dw / 2 + side / 2), oy=fy, oz=wall_z0 + wh / 2, mat_index=plaster)
    box(bm, dw, t, wh - dh, oy=fy, oz=wall_z0 + dh + (wh - dh) / 2, mat_index=plaster)
    box(bm, dw + 0.18, 0.1, dh + 0.16, oy=fy - 0.02, oz=wall_z0 + dh / 2, mat_index=wood)
    box(bm, dw * 0.86, 0.12, dh * 0.9, oy=fy - 0.1, oz=wall_z0 + dh * 0.45, mat_index=wood)
    # door handle + panels
    box(bm, 0.06, 0.08, 0.06, ox=dw * 0.28, oy=fy - 0.18, oz=wall_z0 + dh * 0.45, mat_index=wood)
    box(bm, 0.04, 0.04, dh * 0.7, oy=fy - 0.14, oz=wall_z0 + dh * 0.45, mat_index=wood)
    for ox, sign in ((-w / 2, -1), (w / 2, 1)):
        # sill
        box(bm, 0.14, 1.05, 0.08, ox=ox + sign * 0.05, oz=wall_z0 + 0.75, mat_index=wood)
        box(bm, 0.1, 0.95, 1.05, ox=ox + sign * 0.02, oz=wall_z0 + 1.35, mat_index=wood)
        box(bm, 0.08, 0.78, 0.82, ox=ox + sign * 0.08, oz=wall_z0 + 1.35, mat_index=glass)
        box(bm, 0.06, 0.08, 0.82, ox=ox + sign * 0.08, oz=wall_z0 + 1.35, mat_index=wood)
        box(bm, 0.06, 0.78, 0.08, ox=ox + sign * 0.08, oz=wall_z0 + 1.35, mat_index=wood)
        # lintel
        box(bm, 0.12, 1.05, 0.1, ox=ox + sign * 0.05, oz=wall_z0 + 1.9, mat_index=wood)
    for ox, oy in ((-w / 2, -d / 2), (w / 2, -d / 2), (-w / 2, d / 2), (w / 2, d / 2)):
        box(bm, 0.2, 0.2, wh + 0.2, ox=ox, oy=oy, oz=wall_z0 + wh / 2, mat_index=wood)
    # wall plate beam under eaves
    box(bm, w + 0.15, d + 0.15, 0.14, oz=wall_z0 + wh + 0.05, mat_index=wood)
    if style in ("inn", "shop", "market"):
        box(bm, w * 0.7, 1.2, 0.12, oy=-d / 2 - 0.5, oz=wall_z0 + 0.08, mat_index=wood)
        box(bm, 0.12, 0.12, 2.2, ox=-w * 0.28, oy=-d / 2 - 1.0, oz=wall_z0 + 1.1, mat_index=wood)
        box(bm, 0.12, 0.12, 2.2, ox=w * 0.28, oy=-d / 2 - 1.0, oz=wall_z0 + 1.1, mat_index=wood)
    rise = 1.55 if style != "barn" else 2.0
    ow, od = w * 0.62, d * 0.62
    z0 = wall_z0 + wh
    # thick roof: outer shell + inset underside
    for scale, zoff, mat_use in ((1.0, 0.0, roof_i), (0.92, -0.12, wood)):
        sow, sod = ow * scale, od * scale
        coords = [
            Vector((-sow, -sod, z0 + zoff)), Vector((sow, -sod, z0 + zoff)),
            Vector((sow, sod, z0 + zoff)), Vector((-sow, sod, z0 + zoff)),
            Vector((0, -sod, z0 + rise * scale + zoff)), Vector((0, sod, z0 + rise * scale + zoff)),
        ]
        vs = [bm.verts.new(p) for p in coords]
        bm.verts.ensure_lookup_table()
        for ids in ((0, 1, 4), (3, 2, 5), (0, 4, 5, 3), (1, 2, 5, 4)):
            f = bm.faces.new([vs[i] for i in ids])
            f.material_index = mat_use
    box(bm, ow * 2 + 0.35, 0.1, 0.16, oy=-od - 0.04, oz=z0 + 0.06, mat_index=wood)
    box(bm, ow * 2 + 0.35, 0.1, 0.16, oy=od + 0.04, oz=z0 + 0.06, mat_index=wood)
    if style in ("cottage", "inn", "shop"):
        box(bm, 0.55, 0.55, 1.35, ox=w * 0.22, oy=d * 0.1, oz=z0 + rise * 0.55, mat_index=foundation)
        box(bm, 0.75, 0.75, 0.14, ox=w * 0.22, oy=d * 0.1, oz=z0 + rise * 0.55 + 0.75, mat_index=foundation)
        box(bm, 0.42, 0.42, 0.22, ox=w * 0.22, oy=d * 0.1, oz=z0 + rise * 0.55 + 0.92, mat_index=foundation)

    wall_key = "wood" if style in ("hut", "barn", "shed", "market") else ("plaster_cool" if style == "towerish" else "plaster")
    roof_key = "thatch" if style in ("hut", "barn", "shed") else ("roof_blue" if style == "shop" else "roof")
    finish(obj, bm, [wall_key, "stone_dark", "wood_dark", roof_key, "glass"], triangulate=True)
    return obj


def make_windmill(name, coll):
    obj, bm = new_obj(name, coll)
    # tapered tower
    box(bm, 2.8, 2.8, 0.35, oz=0.175, mat_index=1)
    box(bm, 2.5, 2.5, 5.2, oz=2.85, mat_index=0)
    box(bm, 2.7, 2.7, 0.2, oz=5.45, mat_index=2)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=1.55, radius2=0.08, depth=1.35)
    for v in ret["verts"]:
        v.co.z += 5.55 + 0.55
    mark_new(bm, before, 2)
    # axle facing +Y
    box(bm, 0.22, 0.9, 0.22, oy=1.55, oz=4.7, mat_index=3)
    hub = Vector((0, 1.95, 4.7))
    for ang in (0.0, math.pi / 2, math.pi, 3 * math.pi / 2):
        rot = Matrix.Rotation(ang, 4, "Y")
        before = facesnap(bm)
        ret = bmesh.ops.create_cube(bm, size=1.0)
        for v in ret["verts"]:
            v.co.x *= 0.12
            v.co.y *= 0.12
            v.co.z *= 2.4
            v.co.z += 1.35
            v.co = rot @ v.co
            v.co += hub
        mark_new(bm, before, 3)
        before = facesnap(bm)
        ret = bmesh.ops.create_cube(bm, size=1.0)
        for v in ret["verts"]:
            v.co.x *= 0.7
            v.co.y *= 0.05
            v.co.z *= 2.0
            v.co.z += 1.4
            v.co.x += 0.38
            v.co = rot @ v.co
            v.co += hub
        mark_new(bm, before, 4)
    box(bm, 0.85, 0.14, 1.7, oy=-1.3, oz=1.15, mat_index=3)
    box(bm, 0.55, 0.1, 0.55, ox=1.28, oz=3.2, mat_index=4)  # tiny window panel as cloth/light
    finish(obj, bm, ["plaster", "stone_dark", "wood", "wood_dark", "cloth_w"])
    return obj

def make_stall(name, coll):
    obj, bm = new_obj(name, coll)
    box(bm, 2.8, 1.6, 0.12, oz=1.05, mat_index=0)
    box(bm, 0.1, 0.1, 1.05, ox=-1.2, oy=-0.6, oz=0.52, mat_index=0)
    box(bm, 0.1, 0.1, 1.05, ox=1.2, oy=-0.6, oz=0.52, mat_index=0)
    box(bm, 0.1, 0.1, 1.05, ox=-1.2, oy=0.6, oz=0.52, mat_index=0)
    box(bm, 0.1, 0.1, 1.05, ox=1.2, oy=0.6, oz=0.52, mat_index=0)
    # awning
    box(bm, 3.0, 1.8, 0.08, oz=2.0, mat_index=1)
    box(bm, 0.08, 0.08, 0.9, ox=-1.3, oy=-0.7, oz=1.55, mat_index=0)
    box(bm, 0.08, 0.08, 0.9, ox=1.3, oy=-0.7, oz=1.55, mat_index=0)
    finish(obj, bm, ["wood", "cloth_r"])
    return obj


def make_tower(name, coll):
    obj, bm = new_obj(name, coll)
    box(bm, 2.8, 2.8, 0.4, oz=0.2, mat_index=1)
    box(bm, 2.4, 2.4, 6.4, oz=3.4, mat_index=0)
    box(bm, 2.9, 2.9, 0.3, oz=6.7, mat_index=1)
    for x in (-1.0, 0.0, 1.0):
        for y in (-1.0, 1.0):
            box(bm, 0.42, 0.34, 0.6, ox=x, oy=y, oz=7.1, mat_index=0)
    for y in (-0.4, 0.4):
        for x in (-1.0, 1.0):
            box(bm, 0.34, 0.42, 0.6, ox=x, oy=y, oz=7.1, mat_index=0)
    box(bm, 0.9, 0.14, 1.3, oy=-1.25, oz=1.2, mat_index=2)
    box(bm, 0.14, 0.75, 0.75, ox=1.25, oz=4.3, mat_index=3)
    finish(obj, bm, ["stone", "stone_dark", "wood_dark", "glass"])
    return obj


def make_dock(name, coll, length=6.0):
    obj, bm = new_obj(name, coll)
    # deck
    box(bm, length, 2.4, 0.18, oz=0.85, mat_index=0)
    # planks
    n = max(4, int(length / 0.45))
    for i in range(n):
        box(bm, 0.14, 2.3, 0.05, ox=-length / 2 + 0.35 + i * (length - 0.5) / max(n - 1, 1), oz=0.96, mat_index=1)
    # posts into water
    for x in (-length * 0.4, -length * 0.1, length * 0.2, length * 0.4):
        for y in (-1.0, 1.0):
            box(bm, 0.22, 0.22, 1.0, ox=x, oy=y, oz=0.4, mat_index=1)
    # side rails
    for y in (-1.15, 1.15):
        box(bm, length * 0.95, 0.1, 0.12, oy=y, oz=1.25, mat_index=0)
        for x in (-length * 0.35, 0, length * 0.35):
            box(bm, 0.1, 0.1, 0.45, ox=x, oy=y, oz=1.05, mat_index=0)
    finish(obj, bm, ["wood", "wood_dark"])
    return obj


def make_boat(name, coll):
    obj, bm = new_obj(name, coll)
    # hull: wide mid, tapered ends
    box(bm, 2.6, 1.2, 0.5, oz=0.35, mat_index=0)
    box(bm, 3.2, 0.85, 0.35, oz=0.45, mat_index=0)
    box(bm, 0.9, 0.55, 0.4, ox=1.55, oz=0.4, mat_index=0)
    box(bm, 0.7, 0.7, 0.35, ox=-1.55, oz=0.38, mat_index=0)
    # gunwales
    box(bm, 2.8, 0.1, 0.2, oy=-0.55, oz=0.7, mat_index=1)
    box(bm, 2.8, 0.1, 0.2, oy=0.55, oz=0.7, mat_index=1)
    # thwarts + mast + sail
    box(bm, 0.12, 1.0, 0.08, oz=0.72, mat_index=1)
    box(bm, 0.1, 0.1, 2.1, oz=1.6, mat_index=1)
    box(bm, 0.08, 1.3, 1.2, ox=0.2, oz=1.75, mat_index=2)
    finish(obj, bm, ["wood", "wood_dark", "cloth_b"])
    return obj


def make_tent(name, coll):
    obj, bm = new_obj(name, coll)
    coords = [
        Vector((-1.2, -1.0, 0)), Vector((1.2, -1.0, 0)), Vector((1.2, 1.0, 0)), Vector((-1.2, 1.0, 0)),
        Vector((0, 0, 1.8)),
    ]
    vs = [bm.verts.new(p) for p in coords]
    bm.verts.ensure_lookup_table()
    for ids in ((0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4)):
        f = bm.faces.new([vs[i] for i in ids])
        f.material_index = 0
    box(bm, 0.08, 0.08, 1.7, ox=-1.1, oy=-0.9, oz=0.85, mat_index=1)
    box(bm, 0.08, 0.08, 1.7, ox=1.1, oy=-0.9, oz=0.85, mat_index=1)
    finish(obj, bm, ["cloth_g", "wood"], triangulate=True)
    return obj


def make_campfire(name, coll):
    obj, bm = new_obj(name, coll)
    for i in range(6):
        ang = i / 6 * math.tau
        box(bm, 0.55, 0.25, 0.2, ox=math.cos(ang) * 0.45, oy=math.sin(ang) * 0.45, oz=0.1, mat_index=0)
    # logs
    box(bm, 0.9, 0.18, 0.18, oz=0.25, mat_index=1)
    box(bm, 0.18, 0.9, 0.18, oz=0.28, mat_index=1)
    # flame proxy
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.25, radius2=0.02, depth=0.7)
    for v in ret["verts"]:
        v.co.z += 0.55
    mark_new(bm, before, 2)
    finish(obj, bm, ["stone", "wood_dark", "flower_y"], triangulate=True)
    return obj


def make_mushroom(name, coll, tall=False):
    obj, bm = new_obj(name, coll)
    h, r = (0.55, 0.12) if not tall else (0.9, 0.15)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=r, radius2=r * 0.8, depth=h)
    for v in ret["verts"]:
        v.co.z += h * 0.5
    mark_new(bm, before, 0)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=r * 2.2, radius2=0.05, depth=r * 1.2)
    for v in ret["verts"]:
        v.co.z += h + r * 0.3
    mark_new(bm, before, 1)
    finish(obj, bm, ["mushroom_stem", "mushroom"], triangulate=True)
    return obj


def make_banner(name, coll, color="cloth_r"):
    obj, bm = new_obj(name, coll)
    box(bm, 0.12, 0.12, 3.2, oz=1.6, mat_index=0)
    box(bm, 1.2, 0.08, 0.08, ox=0.55, oz=3.0, mat_index=0)
    box(bm, 1.0, 0.06, 1.4, ox=0.55, oz=2.2, mat_index=1)
    finish(obj, bm, ["wood_dark", color])
    return obj


def make_fence(name, coll, length=2.5):
    obj, bm = new_obj(name, coll)
    h = 1.25
    box(bm, 0.14, 0.14, h, ox=-length / 2, oz=h / 2, mat_index=0)
    box(bm, 0.14, 0.14, h, ox=length / 2, oz=h / 2, mat_index=0)
    box(bm, length, 0.09, 0.1, oz=h * 0.4, mat_index=0)
    box(bm, length, 0.09, 0.1, oz=h * 0.75, mat_index=0)
    n = max(4, int(length / 0.32))
    for i in range(n):
        x = -length / 2 + 0.22 + i * (length - 0.44) / max(1, n - 1)
        box(bm, 0.08, 0.06, h * 0.88, ox=x, oz=h * 0.46, mat_index=0)
    finish(obj, bm, ["wood"])
    return obj


def make_crate(name, coll, s=0.8):
    obj, bm = new_obj(name, coll)
    box(bm, s, s, s, oz=s / 2, mat_index=0)
    box(bm, s * 1.05, 0.09, 0.09, oz=0.14, mat_index=1)
    box(bm, s * 1.05, 0.09, 0.09, oz=s - 0.14, mat_index=1)
    finish(obj, bm, ["wood", "wood_dark"])
    return obj


def make_barrel(name, coll):
    obj, bm = new_obj(name, coll)
    h, r = 1.05, 0.42
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=r, radius2=r * 0.9, depth=h)
    for v in ret["verts"]:
        v.co.z += h / 2
        t = abs(v.co.z / h - 0.5)
        v.co.xy *= 1.0 + (0.5 - t) * 0.28
    mark_new(bm, before, 0)
    box(bm, r * 2.25, r * 2.25, 0.07, oz=0.3, mat_index=1)
    box(bm, r * 2.25, r * 2.25, 0.07, oz=0.75, mat_index=1)
    finish(obj, bm, ["wood", "metal"], triangulate=True)
    return obj


def make_lamp(name, coll, h=3.4):
    obj, bm = new_obj(name, coll)
    box(bm, 0.5, 0.5, 0.14, oz=0.07, mat_index=0)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.085, radius2=0.055, depth=h)
    for v in ret["verts"]:
        v.co.z += h / 2
    mark_new(bm, before, 0)
    box(bm, 0.45, 0.45, 0.1, oz=h, mat_index=0)
    box(bm, 0.55, 0.55, 0.08, oz=h + 0.32, mat_index=0)
    box(bm, 0.36, 0.36, 0.38, oz=h + 0.15, mat_index=1)
    finish(obj, bm, ["metal", "glass"])
    return obj


def make_well(name, coll):
    obj, bm = new_obj(name, coll)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=14, radius1=1.05, radius2=1.05, depth=0.95)
    for v in ret["verts"]:
        v.co.z += 0.48
    mark_new(bm, before, 0)
    box(bm, 0.16, 0.16, 1.55, ox=-0.8, oz=1.4, mat_index=1)
    box(bm, 0.16, 0.16, 1.55, ox=0.8, oz=1.4, mat_index=1)
    box(bm, 1.8, 0.12, 0.12, oz=2.15, mat_index=1)
    coords = [Vector((-1.1, -0.6, 2.2)), Vector((1.1, -0.6, 2.2)), Vector((1.1, 0.6, 2.2)), Vector((-1.1, 0.6, 2.2)), Vector((0, -0.6, 2.8)), Vector((0, 0.6, 2.8))]
    vs = [bm.verts.new(p) for p in coords]
    bm.verts.ensure_lookup_table()
    for ids in ((0, 1, 4), (3, 2, 5), (0, 4, 5, 3), (1, 2, 5, 4)):
        f = bm.faces.new([vs[i] for i in ids])
        f.material_index = 2
    finish(obj, bm, ["stone", "wood", "thatch"], triangulate=True)
    return obj


def make_bridge(name, coll, length=6.0, width=2.2):
    """Simple span bridge: length along +X. Deck raised for river crossing."""
    obj, bm = new_obj(name, coll)
    deck_z = 1.05
    # solid deck + side beams (one continuous span)
    box(bm, length, width, 0.22, oz=deck_z, mat_index=0)
    box(bm, length * 0.98, width * 0.2, 0.18, oy=-width * 0.35, oz=deck_z - 0.16, mat_index=1)
    box(bm, length * 0.98, width * 0.2, 0.18, oy=width * 0.35, oz=deck_z - 0.16, mat_index=1)
    # plank strips on top (flush, no floating gaps)
    n = max(6, int(length / 0.35))
    for i in range(n):
        box(bm, length / n * 0.92, width * 0.9, 0.05,
            ox=-length / 2 + (i + 0.5) * (length / n),
            oz=deck_z + 0.12, mat_index=1)
    # pilings down into water / banks
    for x in (-length * 0.4, -length * 0.15, length * 0.15, length * 0.4):
        for y in (-width * 0.38, width * 0.38):
            box(bm, 0.24, 0.24, deck_z + 0.2, ox=x, oy=y, oz=(deck_z + 0.2) * 0.5, mat_index=1)
    # railings
    for y in (-width * 0.5, width * 0.5):
        box(bm, length * 0.95, 0.1, 0.12, oy=y, oz=deck_z + 0.55, mat_index=0)
        for x in (-length * 0.35, 0.0, length * 0.35):
            box(bm, 0.1, 0.1, 0.55, ox=x, oy=y, oz=deck_z + 0.3, mat_index=0)
    finish(obj, bm, ["wood", "wood_dark"])
    return obj


def make_cart(name, coll):
    obj, bm = new_obj(name, coll)
    box(bm, 2.0, 1.2, 0.16, oz=0.75, mat_index=0)
    box(bm, 2.0, 0.12, 0.6, oy=-0.58, oz=1.0, mat_index=0)
    box(bm, 2.0, 0.12, 0.6, oy=0.58, oz=1.0, mat_index=0)
    box(bm, 0.12, 1.2, 0.6, ox=-0.95, oz=1.0, mat_index=0)
    box(bm, 0.12, 1.2, 0.4, ox=0.95, oz=0.9, mat_index=0)
    box(bm, 1.6, 0.1, 0.1, oz=0.4, mat_index=1)
    for x, y in ((-0.7, -0.75), (0.7, -0.75), (-0.7, 0.75), (0.7, 0.75)):
        before = facesnap(bm)
        ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=0.4, radius2=0.4, depth=0.16)
        for v in ret["verts"]:
            y0, z0 = v.co.y, v.co.z
            v.co.y, v.co.z = z0, y0
            v.co += Vector((x, y, 0.4))
        mark_new(bm, before, 1)
    finish(obj, bm, ["wood", "wood_dark"], triangulate=True)
    return obj


def make_bench(name, coll):
    obj, bm = new_obj(name, coll)
    box(bm, 1.6, 0.45, 0.1, oz=0.5, mat_index=0)
    box(bm, 1.6, 0.1, 0.48, oy=-0.2, oz=0.78, mat_index=0)
    box(bm, 0.1, 0.42, 0.5, ox=-0.65, oz=0.25, mat_index=1)
    box(bm, 0.1, 0.42, 0.5, ox=0.65, oz=0.25, mat_index=1)
    finish(obj, bm, ["wood", "wood_dark"])
    return obj


def make_sign(name, coll):
    obj, bm = new_obj(name, coll)
    box(bm, 0.14, 0.14, 2.4, oz=1.2, mat_index=1)
    box(bm, 1.05, 0.12, 0.5, ox=0.42, oz=1.85, mat_index=0)
    finish(obj, bm, ["wood", "wood_dark"])
    return obj


def make_ruin(name, coll, h=2.8):
    obj, bm = new_obj(name, coll)
    box(bm, 1.1, 1.1, 0.35, oz=0.17, mat_index=1)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.4, radius2=0.34, depth=h)
    for v in ret["verts"]:
        v.co.z += h / 2
        n = noise.noise(Vector((v.co.x * 3, v.co.y * 3, v.co.z)))
        v.co += Vector((n, n, 0)) * 0.07
        if v.co.z > h * 0.65:
            v.co.z -= abs(noise.noise(Vector((v.co.x, v.co.y, 3)))) * h * 0.3
    mark_new(bm, before, 0)
    bm.normal_update()
    for f in bm.faces:
        if f not in before and f.normal.z > 0.7:
            f.material_index = 2
    finish(obj, bm, ["stone", "stone_dark", "moss"], triangulate=True)
    return obj


def make_path(name, coll, size=0.8):
    obj, bm = new_obj(name, coll)
    bmesh.ops.create_circle(bm, cap_ends=True, segments=8, radius=size)
    ret = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    for v in [e for e in ret["geom"] if isinstance(e, bmesh.types.BMVert)]:
        v.co.z -= 0.12
    for v in bm.verts:
        n = noise.noise(Vector((v.co.x * 4, v.co.y * 4, 0)))
        if v.co.z > -0.05:
            v.co.xy *= 0.86 + n * 0.18
    for f in bm.faces:
        f.material_index = 1 if f.normal.z > 0.8 and rng.random() > 0.7 else 0
    finish(obj, bm, ["stone", "moss"], triangulate=True)
    return obj


def make_grass(name, coll):
    obj, bm = new_obj(name, coll)
    for i in range(10):
        ang = i / 10 * math.tau + rng.random() * 0.2
        hh = 0.4 + rng.random() * 0.45
        before = facesnap(bm)
        ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=3, radius1=0.04, radius2=0.004, depth=hh)
        rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(0.22 + rng.random() * 0.25, 4, "X")
        for v in ret["verts"]:
            v.co = rot @ v.co
            v.co.z += hh / 2
            v.co.x += math.cos(ang) * 0.1
            v.co.y += math.sin(ang) * 0.1
        mark_new(bm, before, 0)
    finish(obj, bm, ["grass"], triangulate=True)
    return obj


def make_flower(name, coll, key):
    obj, bm = new_obj(name, coll)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.02, radius2=0.015, depth=0.4)
    for v in ret["verts"]:
        v.co.z += 0.2
    mark_new(bm, before, 0)
    before = facesnap(bm)
    ret = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=0.12)
    for v in ret["verts"]:
        v.co.z = v.co.z * 0.4 + 0.45
    mark_new(bm, before, 1)
    finish(obj, bm, ["grass", key], triangulate=True)
    return obj


def make_wall(name, coll, length=4.0, door=False, window=False, material="plaster"):
    obj, bm = new_obj(name, coll)
    h, t = 2.8, 0.32
    box(bm, length + 0.15, t + 0.1, 0.25, oz=0.12, mat_index=1)
    if not door and not window:
        box(bm, length, t, h, oz=0.25 + h / 2, mat_index=0)
    elif door:
        dw, dh = 1.0, 2.15
        side = (length - dw) / 2
        box(bm, side, t, h, ox=-(dw / 2 + side / 2), oz=0.25 + h / 2, mat_index=0)
        box(bm, side, t, h, ox=(dw / 2 + side / 2), oz=0.25 + h / 2, mat_index=0)
        box(bm, dw, t, h - dh, oz=0.25 + dh + (h - dh) / 2, mat_index=0)
        box(bm, dw + 0.16, 0.1, dh + 0.14, oy=-0.02, oz=0.25 + dh / 2, mat_index=2)
        box(bm, dw * 0.86, 0.12, dh * 0.9, oy=-0.1, oz=0.25 + dh * 0.45, mat_index=2)
        if window:
            box(bm, 0.9, 0.1, 0.95, ox=length * 0.28, oy=-0.02, oz=1.65, mat_index=2)
            box(bm, 0.72, 0.1, 0.75, ox=length * 0.28, oy=-0.1, oz=1.65, mat_index=3)
    else:
        ww, wh, wz = 0.95, 1.05, 1.55
        below = wz - wh / 2 - 0.25
        box(bm, length, t, below, oz=0.25 + below / 2, mat_index=0)
        top = h - (wz + wh / 2)
        box(bm, length, t, top, oz=wz + wh / 2 + top / 2, mat_index=0)
        side = (length - ww) / 2
        box(bm, side, t, wh, ox=-(ww / 2 + side / 2), oz=wz, mat_index=0)
        box(bm, side, t, wh, ox=(ww / 2 + side / 2), oz=wz, mat_index=0)
        box(bm, ww + 0.12, 0.1, wh + 0.12, oy=-0.02, oz=wz, mat_index=2)
        box(bm, ww * 0.82, 0.1, wh * 0.82, oy=-0.1, oz=wz, mat_index=3)
    wall_key = material if material != "wood" else "wood"
    finish(obj, bm, [wall_key, "stone_dark", "wood_dark", "glass"])
    return obj


def make_roof(name, coll, style):
    obj, bm = new_obj(name, coll)
    w, d, rise = 4.6, 4.0, 1.4
    coords = [Vector((-w / 2, -d / 2, 0)), Vector((w / 2, -d / 2, 0)), Vector((w / 2, d / 2, 0)), Vector((-w / 2, d / 2, 0)), Vector((0, -d / 2, rise)), Vector((0, d / 2, rise))]
    vs = [bm.verts.new(p) for p in coords]
    bm.verts.ensure_lookup_table()
    for ids in ((0, 1, 4), (3, 2, 5), (0, 4, 5, 3), (1, 2, 5, 4), (0, 3, 2, 1)):
        f = bm.faces.new([vs[i] for i in ids])
        f.material_index = 0
    key = {"tile": "roof", "thatch": "thatch", "slate": "slate", "blue": "roof_blue"}[style]
    finish(obj, bm, [key], triangulate=True)
    return obj


def make_pillar(name, coll, brick=False):
    obj, bm = new_obj(name, coll)
    box(bm, 0.6, 0.6, 3.0, oz=1.5, mat_index=0)
    box(bm, 0.75, 0.75, 0.2, oz=0.1, mat_index=1)
    box(bm, 0.72, 0.72, 0.15, oz=3.05, mat_index=1)
    finish(obj, bm, ["brick" if brick else "stone", "stone_dark"])
    return obj


def make_hay(name, coll):
    obj, bm = new_obj(name, coll)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=10, radius1=0.9, radius2=0.9, depth=0.9)
    for v in ret["verts"]:
        v.co.z += 0.45
        v.co.xy *= 1.0 + abs(noise.noise(v.co)) * 0.08
    mark_new(bm, before, 0)
    finish(obj, bm, ["thatch"], triangulate=True)
    return obj


def make_water_plane(name, coll, size=4.0):
    obj, bm = new_obj(name, coll)
    box(bm, size, size, 0.08, oz=0.04, mat_index=0)
    finish(obj, bm, ["water"])
    return obj


def make_stump(name, coll):
    obj, bm = new_obj(name, coll)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.45, radius2=0.4, depth=0.55)
    for v in ret["verts"]:
        v.co.z += 0.28
    mark_new(bm, before, 0)
    box(bm, 0.55, 0.55, 0.06, oz=0.58, mat_index=1)
    finish(obj, bm, ["bark", "wood"])
    return obj


def make_fallen_log(name, coll, length=2.8):
    obj, bm = new_obj(name, coll)
    before = facesnap(bm)
    ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.28, radius2=0.22, depth=length)
    rot = Matrix.Rotation(math.radians(90), 4, "Y")
    for v in ret["verts"]:
        v.co = rot @ v.co
        v.co.z += 0.28
    mark_new(bm, before, 0)
    box(bm, 0.12, 0.5, 0.12, oy=0.4, oz=0.45, mat_index=1)
    finish(obj, bm, ["bark", "bark_light"], triangulate=True)
    return obj


def make_gate(name, coll):
    obj, bm = new_obj(name, coll)
    box(bm, 0.18, 0.18, 2.2, ox=-1.3, oz=1.1, mat_index=0)
    box(bm, 0.18, 0.18, 2.2, ox=1.3, oz=1.1, mat_index=0)
    box(bm, 2.8, 0.12, 0.14, oz=2.0, mat_index=0)
    box(bm, 1.15, 0.1, 1.5, ox=-0.6, oz=1.0, mat_index=1)
    box(bm, 1.15, 0.1, 1.5, ox=0.6, oz=1.0, mat_index=1)
    box(bm, 0.12, 0.12, 1.5, oz=1.0, mat_index=0)
    finish(obj, bm, ["wood_dark", "wood"])
    return obj


def make_wheat(name, coll):
    obj, bm = new_obj(name, coll)
    for i in range(14):
        ang = i / 14 * math.tau + rng.random() * 0.3
        r = 0.15 + rng.random() * 0.35
        hh = 0.7 + rng.random() * 0.35
        before = facesnap(bm)
        ret = bmesh.ops.create_cone(bm, cap_ends=True, segments=3, radius1=0.03, radius2=0.01, depth=hh)
        for v in ret["verts"]:
            v.co.z += hh / 2
            v.co.x += math.cos(ang) * r
            v.co.y += math.sin(ang) * r
        mark_new(bm, before, 0)
        box(bm, 0.08, 0.08, 0.12, ox=math.cos(ang) * r, oy=math.sin(ang) * r, oz=hh + 0.05, mat_index=1)
    finish(obj, bm, ["grass", "wheat"], triangulate=True)
    return obj


def make_arch_ruin(name, coll):
    obj, bm = new_obj(name, coll)
    box(bm, 0.7, 0.7, 3.2, ox=-1.4, oz=1.6, mat_index=0)
    box(bm, 0.7, 0.7, 3.2, ox=1.4, oz=1.6, mat_index=0)
    box(bm, 3.5, 0.7, 0.7, oz=3.4, mat_index=0)
    box(bm, 0.5, 0.5, 0.6, ox=0.9, oz=3.9, mat_index=1)
    for f in bm.faces:
        if f.normal.z > 0.7 and rng.random() > 0.5:
            f.material_index = 2
    finish(obj, bm, ["stone", "stone_dark", "moss"])
    return obj


def make_crate_stack(name, coll):
    obj, bm = new_obj(name, coll)
    box(bm, 0.9, 0.9, 0.9, oz=0.45, mat_index=0)
    box(bm, 0.75, 0.75, 0.75, ox=0.15, oy=-0.1, oz=1.25, mat_index=1)
    box(bm, 0.55, 0.55, 0.55, ox=-0.2, oy=0.15, oz=1.85, mat_index=0)
    finish(obj, bm, ["wood", "wood_dark"])
    return obj


def make_anvil_table(name, coll):
    obj, bm = new_obj(name, coll)
    box(bm, 1.4, 0.8, 0.12, oz=0.95, mat_index=0)
    for ox, oy in ((-0.55, -0.28), (0.55, -0.28), (-0.55, 0.28), (0.55, 0.28)):
        box(bm, 0.12, 0.12, 0.95, ox=ox, oy=oy, oz=0.47, mat_index=0)
    box(bm, 0.7, 0.35, 0.28, oz=1.2, mat_index=1)
    finish(obj, bm, ["wood_dark", "metal"])
    return obj


# ---------- Ground / roads (4m modular grid) ----------

TILE = 4.0
GROUND_H = 0.10  # flat top of modular ground tiles (after ground())
SURFACE_Z = 0.22  # clear of ground/road tops so plinths read above the surface


def _grid_plane(bm, size, cuts, height=0.1, noise_amp=0.0, seed=0.0):
    """Create a subdivided ground slab centered on XY, top near z=height."""
    before = facesnap(bm)
    verts = bmesh.ops.create_grid(bm, x_segments=cuts + 1, y_segments=cuts + 1, size=size)["verts"]
    # create_grid is centered, lies on XY; raise top then extrude down for thickness
    for v in verts:
        if noise_amp:
            n = noise.noise(Vector((v.co.x * 0.55 + seed, v.co.y * 0.55, seed * 0.2)))
            v.co.z = height + n * noise_amp
        else:
            v.co.z = height
    ret = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    for el in ret["geom"]:
        if isinstance(el, bmesh.types.BMVert):
            el.co.z = 0.0
    return before


def make_ground_tile(name, coll, size=TILE, kind="grass", variant=0):
    """Modular ground tile with richer surface breakup."""
    obj, bm = new_obj(name, coll)
    cuts = 6 if kind in ("farm", "cobble_plaza", "grass") else 5
    # Keep noise modest so buildings/props don't sink into peaks
    amp = {"grass": 0.025, "grass_dry": 0.02, "dirt": 0.018, "mud": 0.022, "sand": 0.03, "snow": 0.02, "farm": 0.015, "gravel": 0.015, "cobble_plaza": 0.008}.get(kind, 0.02)
    seed = variant * 7.13 + (hash(kind) % 100) * 0.1
    _grid_plane(bm, size, cuts, height=GROUND_H, noise_amp=amp, seed=seed)

    # Farm: carve shallow furrow valleys
    if kind == "farm":
        for v in bm.verts:
            if abs(v.co.z) > 0.01:
                furrow = abs(math.sin(v.co.y * 3.2))
                v.co.z -= furrow * 0.05

    for f in bm.faces:
        if f.normal.z < 0.45:
            f.material_index = 2 if kind not in ("farm", "mud", "gravel") else 1
            continue
        cx = sum(v.co.x for v in f.verts) / len(f.verts)
        cy = sum(v.co.y for v in f.verts) / len(f.verts)
        n = noise.noise(Vector((cx * 0.9 + seed, cy * 0.9, seed)))
        if kind == "farm":
            f.material_index = 1 if int((cy + size) * 2.4) % 2 == 0 else 0
        elif kind == "cobble_plaza":
            f.material_index = 1 if (int(cx * 2.2) + int(cy * 2.2) + variant) % 2 else 0
        elif kind == "grass":
            f.material_index = 1 if n > 0.25 else (2 if n < -0.28 else 0)
        elif kind == "grass_dry":
            f.material_index = 1 if n > 0.15 else (2 if n < -0.2 else 0)
        elif kind == "dirt":
            f.material_index = 1 if n > 0.2 else (2 if n < -0.25 else 0)
        elif kind == "mud":
            f.material_index = 1 if n > 0.05 else 0
        elif kind == "sand":
            f.material_index = 1 if n > 0.18 else (2 if n < -0.22 else 0)
        elif kind == "snow":
            f.material_index = 1 if n > 0.3 else (2 if n < -0.35 else 0)
        elif kind == "gravel":
            f.material_index = 1 if n > 0.1 else 0
        else:
            f.material_index = 0

    keys = {
        "farm": ["farm_soil", "farm_furrow"],
        "cobble_plaza": ["cobble", "cobble_dark"],
        "grass": ["grass", "grass_bright", "dirt"],
        "grass_dry": ["grass_dry", "wheat", "dirt"],
        "dirt": ["dirt", "dirt_light", "mud"],
        "mud": ["mud", "dirt"],
        "sand": ["sand", "sand_wet", "dirt_light"],
        "snow": ["snow", "snow_dirt", "stone"],
        "gravel": ["gravel", "stone_dark"],
    }.get(kind, ["grass"])
    if kind in ("farm", "mud", "gravel") and len(keys) < 3:
        # underside already uses index 1
        pass
    finish(obj, bm, keys, triangulate=True)
    obj["tile_size"] = size
    obj["ground_kind"] = kind
    return obj


def make_ground_slope(name, coll, size=TILE, kind="grass", rise=0.8):
    """Gentle ramp tile (low at -Y, high at +Y) for hills / banks."""
    obj, bm = new_obj(name, coll)
    cuts = 5
    bmesh.ops.create_grid(bm, x_segments=cuts + 1, y_segments=cuts + 1, size=size)
    for v in bm.verts:
        t = (v.co.y / size) + 0.5
        n = noise.noise(Vector((v.co.x * 0.5, v.co.y * 0.5, 1.2))) * 0.05
        v.co.z = 0.06 + t * rise + n
    ret = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    for el in ret["geom"]:
        if isinstance(el, bmesh.types.BMVert):
            el.co.z = 0.0
    for f in bm.faces:
        f.material_index = 0 if f.normal.z > 0.4 else 1
    keys = {"grass": ["grass", "dirt"], "dirt": ["dirt", "mud"], "sand": ["sand", "sand_wet"], "snow": ["snow", "stone"]}.get(kind, ["grass", "dirt"])
    finish(obj, bm, keys, triangulate=True)
    obj["tile_size"] = size
    return obj


def make_ground_edge(name, coll, size=TILE, primary="grass", secondary="dirt"):
    """Half-and-half transition strip (primary +X, secondary -X)."""
    obj, bm = new_obj(name, coll)
    _grid_plane(bm, size, 5, height=GROUND_H, noise_amp=0.02, seed=3.3)
    for f in bm.faces:
        if f.normal.z < 0.5:
            f.material_index = 2
            continue
        cx = sum(v.co.x for v in f.verts) / len(f.verts)
        # soft blend band near center
        if abs(cx) < size * 0.08:
            f.material_index = 2
        else:
            f.material_index = 0 if cx >= 0 else 1
    finish(obj, bm, [primary, secondary, "dirt"], triangulate=True)
    obj["tile_size"] = size
    return obj


def make_road_piece(name, coll, kind="straight", surface="cobble", size=TILE):
    """
    Modular road on a size×size footprint with visible grass shoulders.
    kind: straight | corner | t | cross | end | diagonal
    surface: cobble | dirt | gravel
    """
    obj, bm = new_obj(name, coll)
    half = size * 0.5
    road_w = size * 0.28  # half-width — ~2.24m road on 4m tile, clear shoulders
    h = GROUND_H  # shoulder matches ground tile top
    rh = 0.05  # thin carriageway, slightly proud of shoulders

    # grass / dirt shoulders fill the tile (replaces stacked GRND under roads)
    shoulder = 2 if surface == "cobble" else (2 if surface == "dirt" else 2)
    box(bm, size, size, h, oz=h * 0.5, mat_index=shoulder)

    def road_box(sx, sy, ox=0.0, oy=0.0, mat_index=0):
        box(bm, sx, sy, rh, ox=ox, oy=oy, oz=h + rh * 0.5 - 0.005, mat_index=mat_index)

    def cobble_detail(sx, sy, ox, oy):
        # checker insets on road surface
        nx, ny = max(2, int(sx / 0.55)), max(2, int(sy / 0.55))
        for ix in range(nx):
            for iy in range(ny):
                if (ix + iy) % 2:
                    continue
                px = ox - sx * 0.5 + (ix + 0.5) * (sx / nx)
                py = oy - sy * 0.5 + (iy + 0.5) * (sy / ny)
                box(bm, sx / nx * 0.85, sy / ny * 0.85, 0.025, ox=px, oy=py, oz=h + rh + 0.01, mat_index=1)

    if kind == "straight":
        road_box(road_w * 2, size)
        if surface == "cobble":
            cobble_detail(road_w * 2 * 0.92, size * 0.92, 0, 0)
            box(bm, 0.1, size * 0.7, 0.025, oz=h + 0.05, mat_index=1)  # center wear
        for side in (-1, 1):
            box(bm, 0.12, size * 0.98, 0.1, ox=side * road_w, oz=h * 0.75, mat_index=1)
    elif kind == "end":
        road_box(road_w * 2, size * 0.58, 0, -size * 0.2)
        box(bm, road_w * 1.85, road_w * 1.15, rh, oy=size * 0.05, oz=h + rh * 0.5 - 0.005, mat_index=0)
        for side in (-1, 1):
            box(bm, 0.12, size * 0.55, 0.08, ox=side * road_w, oy=-size * 0.2, oz=h * 0.7, mat_index=1)
    elif kind == "corner":
        road_box(road_w * 2, half + road_w, 0, -half * 0.5 + road_w * 0.5)
        road_box(half + road_w, road_w * 2, half * 0.5 - road_w * 0.5, 0)
        # outer curb bits
        box(bm, 0.12, half + road_w * 0.8, 0.1, ox=-road_w, oy=-half * 0.35, oz=h * 0.75, mat_index=1)
        box(bm, half + road_w * 0.8, 0.12, 0.1, ox=half * 0.35, oy=road_w, oz=h * 0.75, mat_index=1)
    elif kind == "t":
        road_box(road_w * 2, size)
        road_box(half + road_w, road_w * 2, half * 0.5 - road_w * 0.5, 0)
        for side in (-1, 1):
            box(bm, 0.12, size * 0.98, 0.1, ox=side * road_w, oz=h * 0.75, mat_index=1)
    elif kind == "cross":
        road_box(road_w * 2, size)
        road_box(size, road_w * 2)
        # curb stubs in each quadrant leaving grass corners
        for sx, sy in ((-1, -1), (-1, 1), (1, -1), (1, 1)):
            box(bm, 0.12, road_w * 0.9, 0.1, ox=sx * road_w, oy=sy * (road_w + 0.35), oz=h * 0.75, mat_index=1)
            box(bm, road_w * 0.9, 0.12, 0.1, ox=sx * (road_w + 0.35), oy=sy * road_w, oz=h * 0.75, mat_index=1)
        if surface == "cobble":
            box(bm, 0.1, size * 0.35, 0.025, oz=h + 0.05, mat_index=1)
            box(bm, size * 0.35, 0.1, 0.025, oz=h + 0.05, mat_index=1)
    elif kind == "diagonal":
        for i in range(6):
            t = (i - 2.5) / 3.0
            road_box(road_w * 1.5, size * 0.22, t * half * 0.75, t * half * 0.75)
    else:
        road_box(road_w * 2, size)

    # dirt/gravel: add worn edge strips
    if surface in ("dirt", "gravel") and kind in ("straight", "cross", "t"):
        for side in (-1, 1):
            box(bm, 0.22, size * 0.9, 0.04, ox=side * (road_w + 0.05), oz=h + 0.03, mat_index=1)

    surf_keys = {
        "cobble": ["cobble", "cobble_dark", "grass"],
        "dirt": ["dirt_road", "dirt", "grass_dry"],
        "gravel": ["gravel", "stone_dark", "dirt"],
    }[surface]
    finish(obj, bm, surf_keys)
    obj["tile_size"] = size
    obj["road_kind"] = kind
    obj["road_surface"] = surface
    return obj


def make_river_tile(name, coll, size=TILE, kind="straight"):
    """Water channel with dirt/sand banks. Water is built lower so after ground() it stays recessed."""
    obj, bm = new_obj(name, coll)
    half = size * 0.5
    bank_w = size * 0.2
    water_w = size * 0.6
    h = GROUND_H
    # banks sit high; water slab is intentionally below so the channel reads after ground()
    box(bm, bank_w, size, h, ox=-(half - bank_w * 0.5), oz=h * 0.5, mat_index=1)
    box(bm, bank_w, size, h, ox=(half - bank_w * 0.5), oz=h * 0.5, mat_index=1)
    if kind == "straight":
        box(bm, water_w, size * 1.04, 0.22, oz=-0.1, mat_index=0)
    elif kind == "corner":
        box(bm, water_w, half + water_w * 0.5 + 0.08, 0.22, oz=-0.1, oy=-half * 0.25, mat_index=0)
        box(bm, half + water_w * 0.5 + 0.08, water_w, 0.22, oz=-0.1, ox=half * 0.25, mat_index=0)
        box(bm, bank_w, half, h, ox=-(half - bank_w * 0.5), oy=half * 0.5, oz=h * 0.5, mat_index=1)
        box(bm, half, bank_w, h, ox=half * 0.5, oy=-(half - bank_w * 0.5), oz=h * 0.5, mat_index=1)
    # sand lips on bank edges (above water)
    box(bm, 0.2, size * 0.9, 0.04, ox=-water_w * 0.42, oz=0.06, mat_index=2)
    box(bm, 0.2, size * 0.9, 0.04, ox=water_w * 0.42, oz=0.06, mat_index=2)
    for i in range(3):
        box(bm, 0.22, 0.28, 0.16, ox=-half + 0.28, oy=-size * 0.3 + i * 0.55, oz=0.14, mat_index=1)
    finish(obj, bm, ["water", "dirt", "sand"])
    obj["tile_size"] = size
    return obj


# ================= BUILD =================
clear()
root = bpy.context.scene.collection
CAT_NAMES = [
    "00_Ground", "00_Roads",
    "01_Stones", "02_Rocks", "03_Cliffs", "04_Trees", "05_Foliage",
    "06_Buildings", "07_ModularArch", "08_Props", "09_Farm", "10_Camp",
    "11_Water", "12_Ruins", "13_Paths", "14_NatureDetail",
    "PreviewLayout", "15_Showcase",
]
cats = {n: ensure_coll(n, root) for n in CAT_NAMES}
created = []

# ---- Ground tiles (modular 4m) ----
gcoll = cats["00_Ground"]
for i, kind in enumerate(["grass", "grass", "grass", "grass_dry", "grass_dry", "dirt", "dirt", "mud", "sand", "sand", "snow", "snow", "farm", "farm", "gravel", "cobble_plaza", "cobble_plaza"]):
    created.append(make_ground_tile(f"GRND-{kind}-{i:02d}", gcoll, TILE, kind, variant=i).name)
for i, kind in enumerate(["grass", "dirt", "sand", "snow"]):
    created.append(make_ground_slope(f"GRND-slope-{kind}-{i:02d}", gcoll, TILE, kind, rise=0.55 + i * 0.15).name)
for i, (a, b) in enumerate([("grass", "dirt"), ("grass", "sand"), ("grass", "farm_soil"), ("dirt", "mud"), ("snow", "dirt"), ("grass_dry", "dirt_road")]):
    created.append(make_ground_edge(f"GRND-edge-{i:02d}", gcoll, TILE, a, b).name)
for i in range(4):
    created.append(make_ground_tile(f"GRND-plains-{i:02d}", gcoll, TILE * 2, "grass", variant=i + 20).name)

# ---- Roads & rivers ----
rcoll = cats["00_Roads"]
for surf in ("cobble", "dirt", "gravel"):
    for kind in ("straight", "corner", "t", "cross", "end"):
        created.append(make_road_piece(f"ROAD-{surf}-{kind}", rcoll, kind, surf).name)
created.append(make_road_piece("ROAD-cobble-diagonal", rcoll, "diagonal", "cobble").name)
created.append(make_road_piece("ROAD-dirt-diagonal", rcoll, "diagonal", "dirt").name)
for i, kind in enumerate(("straight", "straight", "corner", "corner")):
    created.append(make_river_tile(f"RIV-{kind}-{i:02d}", rcoll, TILE, kind).name)

# Stones & rocks
for i in range(14):
    created.append(make_rock(f"STONE-{i:02d}", cats["01_Stones"], 0.18 + i * 0.045, rng.choice(["round", "chunk", "slab"])).name)
for i in range(16):
    created.append(make_rock(f"ROCK-{i:02d}", cats["02_Rocks"], 0.7 + (i % 6) * 0.2, ["boulder", "slab", "chunk", "round", "tall", "boulder"][i % 6]).name)
for i in range(6):
    created.append(make_cliff(f"CLIFF-{i:02d}", cats["03_Cliffs"], w=3.5 + i * 0.4, d=1.6 + (i % 3) * 0.3, h=2.8 + i * 0.5).name)

# Trees
for i, k in enumerate(["oak", "oak", "oak", "pine", "pine", "pine", "birch", "birch", "autumn", "autumn", "dead", "willow", "willow", "palm", "palm", "oak", "pine", "birch"]):
    created.append(make_tree(f"TREE-{k}-{i:02d}", cats["04_Trees"], k).name)
for i in range(12):
    created.append(make_bush(f"BUSH-{i:02d}", cats["05_Foliage"], autumn=i >= 8).name)

# Buildings
created += [
    make_house("BLD-hut-01", cats["06_Buildings"], 3.4, 3.1, 2.5, "hut").name,
    make_house("BLD-hut-02", cats["06_Buildings"], 3.9, 3.4, 2.55, "hut").name,
    make_house("BLD-cottage-01", cats["06_Buildings"], 4.8, 4.0, 2.8, "cottage").name,
    make_house("BLD-cottage-02", cats["06_Buildings"], 5.5, 4.4, 2.9, "cottage").name,
    make_house("BLD-cottage-03", cats["06_Buildings"], 4.2, 3.6, 2.7, "cottage").name,
    make_house("BLD-barn-01", cats["06_Buildings"], 7.4, 4.5, 3.4, "barn").name,
    make_house("BLD-shed-01", cats["06_Buildings"], 2.8, 2.4, 2.25, "shed").name,
    make_house("BLD-inn-01", cats["06_Buildings"], 8.0, 5.3, 3.2, "inn").name,
    make_house("BLD-shop-01", cats["06_Buildings"], 5.3, 4.2, 2.85, "shop").name,
    make_house("BLD-market-01", cats["06_Buildings"], 4.0, 3.5, 2.5, "market").name,
    make_tower("BLD-tower-01", cats["06_Buildings"]).name,
    make_house("BLD-watch-01", cats["06_Buildings"], 3.1, 3.1, 3.5, "shed").name,
    make_windmill("BLD-windmill-01", cats["06_Buildings"]).name,
    make_stall("BLD-stall-01", cats["06_Buildings"]).name,
    make_stall("BLD-stall-02", cats["06_Buildings"]).name,
]

# Modular
created.append(make_wall("ARCH-wall-01", cats["07_ModularArch"], 4, material="plaster").name)
created.append(make_wall("ARCH-wall-02", cats["07_ModularArch"], 2, material="brick").name)
created.append(make_wall("ARCH-wall-03", cats["07_ModularArch"], 4, material="wood").name)
created.append(make_wall("ARCH-wall-door-01", cats["07_ModularArch"], 4, door=True).name)
created.append(make_wall("ARCH-wall-door-02", cats["07_ModularArch"], 2, door=True, material="wood").name)
created.append(make_wall("ARCH-wall-window-01", cats["07_ModularArch"], 4, window=True).name)
created.append(make_wall("ARCH-wall-window-02", cats["07_ModularArch"], 2, window=True, material="brick").name)
created.append(make_wall("ARCH-wall-doorwindow-01", cats["07_ModularArch"], 4, door=True, window=True).name)
for i in range(4):
    created.append(make_pillar(f"ARCH-pillar-{i:02d}", cats["07_ModularArch"], i % 2 == 1).name)
for style in ("tile", "thatch", "slate", "blue"):
    created.append(make_roof(f"ARCH-roof-{style}-01", cats["07_ModularArch"], style).name)

# Props
for i in range(5):
    created.append(make_fence(f"PROP-fence-{i:02d}", cats["08_Props"], 2 + i * 0.4).name)
for i in range(5):
    created.append(make_crate(f"PROP-crate-{i:02d}", cats["08_Props"], 0.5 + i * 0.12).name)
for i in range(4):
    created.append(make_barrel(f"PROP-barrel-{i:02d}", cats["08_Props"]).name)
for i in range(4):
    created.append(make_lamp(f"PROP-lamp-{i:02d}", cats["08_Props"], 2.9 + i * 0.25).name)
created.append(make_well("PROP-well-01", cats["08_Props"]).name)
created.append(make_bridge("PROP-bridge-01", cats["08_Props"], 5.5).name)
created.append(make_bridge("PROP-bridge-02", cats["08_Props"], 7.5, 2.3).name)
created.append(make_cart("PROP-cart-01", cats["08_Props"]).name)
created.append(make_cart("PROP-cart-02", cats["08_Props"]).name)
created.append(make_sign("PROP-sign-01", cats["08_Props"]).name)
created.append(make_sign("PROP-sign-02", cats["08_Props"]).name)
created.append(make_bench("PROP-bench-01", cats["08_Props"]).name)
created.append(make_bench("PROP-bench-02", cats["08_Props"]).name)
for i, c in enumerate(("cloth_r", "cloth_b", "cloth_g")):
    created.append(make_banner(f"PROP-banner-{i:02d}", cats["08_Props"], c).name)

# Farm
for i in range(4):
    created.append(make_hay(f"FARM-hay-{i:02d}", cats["09_Farm"]).name)
created.append(make_fence("FARM-fence-long", cats["09_Farm"], 4.0).name)

# Camp
created.append(make_tent("CAMP-tent-01", cats["10_Camp"]).name)
created.append(make_tent("CAMP-tent-02", cats["10_Camp"]).name)
created.append(make_campfire("CAMP-fire-01", cats["10_Camp"]).name)
created.append(make_campfire("CAMP-fire-02", cats["10_Camp"]).name)

# Water
created.append(make_dock("WAT-dock-01", cats["11_Water"]).name)
created.append(make_dock("WAT-dock-02", cats["11_Water"], 8.0).name)
created.append(make_boat("WAT-boat-01", cats["11_Water"]).name)
created.append(make_boat("WAT-boat-02", cats["11_Water"]).name)
created.append(make_water_plane("WAT-plane-01", cats["11_Water"], 5.0).name)
created.append(make_water_plane("WAT-plane-02", cats["11_Water"], 8.0).name)

# Ruins / paths / nature
for i in range(12):
    created.append(make_ruin(f"RUIN-pillar-{i:02d}", cats["12_Ruins"], 1.8 + i * 0.22).name)
for i in range(14):
    created.append(make_path(f"PATH-stone-{i:02d}", cats["13_Paths"], 0.45 + (i % 5) * 0.1).name)
for i in range(10):
    created.append(make_grass(f"DET-grass-{i:02d}", cats["14_NatureDetail"]).name)
for i, k in enumerate(["flower_r", "flower_y", "flower_p", "flower_w", "flower_r", "flower_y", "flower_p", "flower_w"]):
    created.append(make_flower(f"DET-flower-{i:02d}", cats["14_NatureDetail"], k).name)
for i in range(6):
    created.append(make_mushroom(f"DET-mushroom-{i:02d}", cats["14_NatureDetail"], tall=i % 2 == 1).name)
for i in range(4):
    created.append(make_stump(f"DET-stump-{i:02d}", cats["14_NatureDetail"]).name)
for i in range(3):
    created.append(make_fallen_log(f"DET-log-{i:02d}", cats["14_NatureDetail"], 2.2 + i * 0.5).name)

# Extra props / farm / ruins
created.append(make_gate("PROP-gate-01", cats["08_Props"]).name)
created.append(make_gate("PROP-gate-02", cats["08_Props"]).name)
created.append(make_crate_stack("PROP-crates-01", cats["08_Props"]).name)
created.append(make_anvil_table("PROP-anvil-01", cats["08_Props"]).name)
for i in range(6):
    created.append(make_wheat(f"FARM-wheat-{i:02d}", cats["09_Farm"]).name)
for i in range(4):
    created.append(make_arch_ruin(f"RUIN-arch-{i:02d}", cats["12_Ruins"]).name)
for i in range(4):
    created.append(make_cliff(f"CLIFF-{i+6:02d}", cats["03_Cliffs"], w=4.5 + i * 0.5, d=2.0, h=4.0 + i * 0.4).name)

# Preview layout
preview = cats["PreviewLayout"]
order = [k for k in CAT_NAMES if k not in ("PreviewLayout", "15_Showcase")]
row_y = 0.0
for cat_name in order:
    objs = [o for o in sorted(cats[cat_name].objects, key=lambda o: o.name) if o.name in created]
    sx = 9.5 if "Build" in cat_name else (8.5 if "Ground" in cat_name or "Roads" in cat_name else (7.5 if "Tree" in cat_name or "Cliff" in cat_name or "Arch" in cat_name else 4.8))
    rg = 12.0 if "Build" in cat_name or "Tree" in cat_name or "Ground" in cat_name else 8.0
    maxc = 7 if "Build" in cat_name or "Ground" in cat_name else 10
    col = 0
    for obj in objs:
        dup = obj.copy()
        dup.data = obj.data
        dup.name = f"PREV-{obj.name}"
        dup.parent = None
        dup.matrix_parent_inverse.identity()
        dup.hide_viewport = False
        dup.hide_render = False
        preview.objects.link(dup)
        dup.location = (col * sx, -row_y, 0)
        col += 1
        if col >= maxc:
            col = 0
            row_y += rg
    row_y += rg + 2

# ================= WORLD ASSEMBLY =================
sc = cats["15_Showcase"]
_place_n = 0


def place(src_name, loc, rot_z=0.0):
    global _place_n
    src = bpy.data.objects.get(src_name)
    if not src:
        return None
    d = src.copy()
    d.data = src.data
    d.parent = None
    d.matrix_parent_inverse.identity()
    d.hide_viewport = False
    d.hide_render = False
    _place_n += 1
    d.name = f"SHOW-{_place_n:03d}-{src_name}"
    sc.objects.link(d)
    d.location = loc
    d.rotation_euler = (0, 0, math.radians(rot_z))
    d.scale = (1.0, 1.0, 1.0)
    return d


def T(tx, ty, z=0.0):
    """Tile-center world position (4m grid)."""
    return (ox + tx * TILE, oy + ty * TILE, z)


ox, oy = 120.0, 40.0
gz = SURFACE_Z

# --- Ground biomes (larger coherent map: 11 x 10 tiles) ---
# tx: -5..5   ty: -4..5
ground_tiles = {}
for tx in range(-5, 6):
    for ty in range(-4, 6):
        # default grass plains with slight variety
        ground_tiles[(tx, ty)] = ("GRND-grass-00" if (tx + ty) % 2 == 0 else "GRND-grass-01", 0)

# Beach / shore west-south
for tx, ty in [(-5, -4), (-4, -4), (-5, -3), (-3, -4)]:
    ground_tiles[(tx, ty)] = ("GRND-sand-08", 0)
for tx, ty in [(-5, -2), (-4, -3)]:
    ground_tiles[(tx, ty)] = ("GRND-sand-09", 90)

# Dirt approach to farm / camp
for tx, ty in [(2, -2), (3, -2), (2, -3), (3, -3)]:
    ground_tiles[(tx, ty)] = ("GRND-dirt-05", 0)
ground_tiles[(4, -2)] = ("GRND-dirt-06", 0)

# Farm fields east
for tx, ty in [(3, 0), (4, 0), (3, 1), (4, 1), (5, 0), (5, 1)]:
    ground_tiles[(tx, ty)] = ("GRND-farm-12" if (tx + ty) % 2 == 0 else "GRND-farm-13", (tx * 90) % 180)

# Dry grass meadow north
for tx, ty in [(-2, 4), (-1, 4), (0, 4), (1, 4), (2, 4), (-1, 5), (0, 5), (1, 5)]:
    ground_tiles[(tx, ty)] = ("GRND-grass_dry-03", 0)

# Snow pocket far NE foothills
for tx, ty in [(4, 4), (5, 4), (5, 5), (4, 5)]:
    ground_tiles[(tx, ty)] = ("GRND-snow-10", 0)

# Village plazas around crossroads
for tx, ty in [(0, 0), (-1, 0), (1, 0), (0, -1), (0, 1)]:
    ground_tiles[(tx, ty)] = ("GRND-cobble_plaza-15" if (tx + ty) % 2 == 0 else "GRND-cobble_plaza-16", 0)

# Edges / transitions
ground_tiles[(-3, 2)] = ("GRND-edge-00", 0)
ground_tiles[(2, 2)] = ("GRND-edge-02", 90)
ground_tiles[(2, -1)] = ("GRND-edge-01", 0)

# Hill slopes toward cliffs (east)
ground_tiles[(5, 2)] = ("GRND-slope-grass-00", 0)
ground_tiles[(5, 3)] = ("GRND-slope-dirt-01", 0)
ground_tiles[(4, 3)] = ("GRND-slope-grass-00", 90)

# Gravel yard near smith
ground_tiles[(-1, 1)] = ("GRND-gravel-14", 0)

# --- Road network (connected) ---
roads = [
    (0, -3, "ROAD-cobble-end", 180),
    (0, -2, "ROAD-cobble-straight", 0),
    (0, -1, "ROAD-cobble-straight", 0),
    (0, 0, "ROAD-cobble-cross", 0),
    (0, 1, "ROAD-cobble-straight", 0),
    (0, 2, "ROAD-cobble-straight", 0),
    (0, 3, "ROAD-cobble-t", 0),
    (0, 4, "ROAD-cobble-end", 0),
    (-2, 0, "ROAD-cobble-straight", 90),
    (-1, 0, "ROAD-cobble-straight", 90),
    (1, 0, "ROAD-cobble-straight", 90),
    (2, 0, "ROAD-cobble-t", 90),
    (-3, 0, "ROAD-cobble-end", 90),  # west spur to bridge
    (3, 0, "ROAD-dirt-straight", 90),
    (4, 0, "ROAD-dirt-straight", 90),
    (5, 0, "ROAD-dirt-end", 90),
    (2, -1, "ROAD-dirt-straight", 0),
    (2, -2, "ROAD-dirt-corner", 180),
    (3, -2, "ROAD-dirt-end", 90),
    (1, 3, "ROAD-cobble-straight", 90),
    (2, 3, "ROAD-cobble-end", 90),
]

# Roads include their own shoulders — don't stack GRND underneath
for tx, ty, _asset, _rot in roads:
    ground_tiles.pop((tx, ty), None)

# River bed — RIV tiles include banks; no GRND underneath (avoids burying water)
for ty in (-3, -2, -1, 0, 1, 2, 3):
    ground_tiles.pop((-4, ty), None)
ground_tiles.pop((-5, -3), None)

for (tx, ty), (asset, rot) in sorted(ground_tiles.items()):
    place(asset, T(tx, ty, 0), rot)

# --- River corridor (west): continuous water channel ---
for ty in (-2, -1, 0, 1, 2):
    place("RIV-straight-00", T(-4, ty, 0.0), 0)
place("RIV-corner-02", T(-4, -3, 0.0), 90)
place("RIV-corner-03", T(-4, 3, 0.0), 0)
place("RIV-straight-01", T(-5, -3, 0.0), 90)
place("WAT-plane-01", T(-4.0, 0.0, 0.06))
place("WAT-plane-02", T(-4.0, -1.5, 0.06))
place("WAT-plane-01", T(-4.0, 1.5, 0.06))

for tx, ty, asset, rot in roads:
    place(asset, T(tx, ty, 0.0), rot)

# --- Buildings (face roads, spaced off the carriageway) ---
# Village core around crossroads — keep ~1.6–2.2 tiles from center
place("BLD-cottage-01", T(-1.55, 1.55, gz), 180)
place("BLD-cottage-02", T(1.6, 1.55, gz), 180)
place("BLD-shop-01", T(-1.6, -1.55, gz), 0)
place("BLD-inn-01", T(1.75, -1.65, gz), 0)
place("BLD-hut-01", T(-2.45, 1.35, gz), 200)
place("BLD-hut-02", T(2.5, 1.4, gz), 160)
place("BLD-stall-01", T(0.85, -1.05, gz), -8)
place("BLD-stall-02", T(-0.85, -1.1, gz), 12)
place("BLD-shed-01", T(2.8, -0.75, gz), 90)
place("BLD-barn-01", T(4.4, 1.9, gz), 180)
place("BLD-market-01", T(1.25, 1.15, gz), 180)
place("BLD-tower-01", T(-2.7, 2.7, gz), 20)
place("BLD-watch-01", T(2.9, 2.85, gz), -15)
place("BLD-windmill-01", T(5.15, -1.25, gz), 25)
place("BLD-cottage-03", T(-1.25, 2.85, gz), 180)

# --- Props / village life ---
place("PROP-well-01", T(0.35, 0.35, gz))
place("PROP-lamp-01", T(-0.35, 0.35, gz))
place("PROP-lamp-02", T(0.35, -0.35, gz))
place("PROP-lamp-03", T(-0.35, -0.35, gz))
place("PROP-bench-01", T(0.7, 0.15, gz), 90)
place("PROP-bench-02", T(-0.7, 0.1, gz), -90)
place("PROP-cart-01", T(1.6, -0.15, gz), -20)
place("PROP-cart-02", T(3.3, -0.35, gz), 10)
place("PROP-banner-00", T(-0.15, -0.85, gz), 5)
place("PROP-banner-01", T(0.2, 0.85, gz), 175)
place("PROP-sign-01", T(0.15, -1.55, gz), 0)
place("PROP-sign-02", T(-1.55, 0.15, gz), 90)
place("PROP-crates-01", T(1.7, -0.7, gz), 25)
place("PROP-crate-02", T(1.95, -0.55, gz))
place("PROP-barrel-00", T(-1.7, -0.5, gz))
place("PROP-barrel-01", T(-1.85, -0.7, gz))
place("PROP-anvil-01", T(-1.4, 0.85, gz), 40)
place("PROP-gate-01", T(2.55, 0.05, gz), 90)        # gate to farm road
place("PROP-gate-02", T(0.05, -2.55, gz), 0)        # south gate
place("PROP-fence-00", T(3.2, 0.7, gz), 0)
place("PROP-fence-01", T(3.7, 0.7, gz), 0)
place("PROP-fence-02", T(4.2, 0.7, gz), 0)
place("PROP-fence-03", T(4.7, 0.7, gz), 0)
place("FARM-fence-long", T(3.5, 1.85, gz), 90)
place("FARM-hay-00", T(3.4, 0.55, gz), 15)
place("FARM-hay-01", T(4.2, 0.45, gz), -20)
place("FARM-wheat-00", T(3.55, 0.15, gz))
place("FARM-wheat-01", T(4.1, 0.2, gz))
place("FARM-wheat-02", T(4.6, 0.25, gz))

# Dock / bridge / water life — one clear span at the road spur, dock south
place("PROP-bridge-01", T(-4.0, 0.0, 0.0), 0)
place("WAT-dock-01", T(-3.5, -2.15, 0.0), 180)
place("WAT-boat-01", T(-4.4, -2.5, -0.05), 75)
place("WAT-boat-02", T(-4.6, -1.85, -0.05), 105)

# Camp south-east
place("CAMP-tent-01", T(3.1, -2.4, gz), 35)
place("CAMP-tent-02", T(3.55, -2.7, gz), -20)
place("CAMP-fire-01", T(3.25, -2.55, gz))
place("PROP-bench-01", T(2.95, -2.35, gz), 50)
place("DET-log-00", T(3.5, -2.35, gz), 70)
place("DET-stump-00", T(2.8, -2.7, gz))

# Forest belt north + scattered trees (keep clear of river x≈-4 and bridges)
forest = [
    (-2.2, 3.6, "TREE-pine-03", 0), (-1.4, 4.2, "TREE-pine-04", 30),
    (-0.5, 4.5, "TREE-pine-05", 10), (0.6, 4.3, "TREE-oak-00", 0),
    (1.4, 4.6, "TREE-pine-03", 45), (2.2, 4.1, "TREE-oak-01", 20),
    (-2.8, 2.8, "TREE-oak-02", 0), (2.8, 3.2, "TREE-birch-06", 0),
    (-1.6, 2.6, "TREE-birch-07", 15), (1.7, 2.5, "TREE-autumn-08", 0),
    (-2.9, 1.3, "TREE-willow-11", 0), (-2.7, -1.6, "TREE-willow-12", 25),
    (-5.2, -3.5, "TREE-palm-13", 0), (-5.4, -2.9, "TREE-palm-14", 40),
    (4.3, 2.4, "TREE-pine-16", 0), (4.8, 3.1, "TREE-pine-03", 60),
    (-0.8, -2.4, "TREE-oak-15", 0), (0.9, -2.6, "TREE-birch-17", 0),
]
for x, y, name, rot in forest:
    place(name, T(x, y, gz), rot)

# Bushes / details along roads and yards
for i, (x, y, rot) in enumerate([
    (-0.7, 0.7, 0), (0.7, 0.7, 40), (-0.7, -0.7, 80), (0.7, -0.7, 120),
    (-1.6, 0.5, 0), (1.6, 0.5, 0), (-1.5, -1.5, 20), (1.8, -1.4, 0),
    (3.0, 0.4, 0), (4.5, 1.6, 0), (-2.5, 1.6, 0), (2.5, -2.0, 0),
]):
    place(f"BUSH-{i % 8:02d}", T(x, y, gz), rot)

for i, (x, y) in enumerate([(-0.4, 1.4), (0.5, 1.5), (1.3, -1.6), (-1.2, -1.7), (3.2, 0.3), (-2.0, 2.0)]):
    place(f"DET-flower-{i:02d}", T(x, y, gz))
for i, (x, y) in enumerate([(1.1, 1.6), (-1.8, 1.3), (2.6, 2.8), (-2.6, 3.3)]):
    place(f"DET-mushroom-{i:02d}", T(x, y, gz))
for i, (x, y) in enumerate([(-0.2, 1.7), (2.1, 0.6), (-2.2, -0.8), (0.4, -2.1), (3.8, -1.5)]):
    place(f"DET-grass-{i:02d}", T(x, y, gz))

# Rocks / cliffs / ruins framing the map
place("CLIFF-01", T(5.3, 2.6, gz), -40)
place("CLIFF-02", T(5.5, 3.4, gz), -20)
place("CLIFF-07", T(4.9, 4.2, gz), 10)
place("ROCK-03", T(-2.6, -0.3, gz), 20)
place("ROCK-05", T(2.7, 1.7, gz), 50)
place("ROCK-08", T(-3.8, 2.5, gz), 0)
place("ROCK-10", T(3.6, -1.8, gz), 70)
place("STONE-04", T(0.2, 0.55, gz))
place("STONE-08", T(-0.5, -0.4, gz))
place("RUIN-arch-00", T(-3.3, 3.3, gz), 25)
place("RUIN-pillar-02", T(-2.9, 3.6, gz))
place("RUIN-pillar-05", T(-3.6, 3.0, gz), 15)
place("RUIN-arch-01", T(5.0, 4.6, gz), -30)

# Footpaths in plaza (short stone trail from south gate to well)
for i, (x, y, rot) in enumerate([
    (0.0, -1.7, 0), (0.05, -1.35, 12), (0.1, -1.0, 8),
    (0.15, -0.65, 5), (0.25, -0.3, 10), (0.3, 0.05, 0),
]):
    place(f"PATH-stone-{i:02d}", T(x, y, gz + 0.01), rot)

# --- Lighting for world ---
sun = bpy.data.lights.new("Sun", "SUN")
sun.energy = 4.8
sun.angle = math.radians(8)
so = bpy.data.objects.new("Sun", sun)
root.objects.link(so)
so.rotation_euler = (math.radians(48), math.radians(12), math.radians(35))
fill = bpy.data.lights.new("Fill", "AREA")
fill.energy = 650
fill.size = 120
fo = bpy.data.objects.new("Fill", fill)
root.objects.link(fo)
fo.location = (ox + 25, oy - 45, 40)
rim = bpy.data.lights.new("Rim", "AREA")
rim.energy = 280
rim.size = 60
ro = bpy.data.objects.new("Rim", rim)
root.objects.link(ro)
ro.location = (ox - 30, oy + 20, 28)

world = bpy.data.worlds.new("World")
bpy.context.scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (0.55, 0.68, 0.82, 1)
bg.inputs[1].default_value = 0.85

# Preview grid camera (kit catalog)
prevs = [o for o in preview.objects if o.name.startswith("PREV-")]
xs = [o.location.x for o in prevs]
ys = [o.location.y for o in prevs]
cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
span = max(max(xs) - min(xs), max(ys) - min(ys), 50)
camd = bpy.data.cameras.new("PreviewCamera")
camd.lens = 40
cam = bpy.data.objects.new("PreviewCamera", camd)
root.objects.link(cam)
cam.location = Vector((cx + span * 0.12, cy - span * 1.0, max(span * 0.5, 55)))
cam.rotation_euler = (Vector((cx, cy, 2)) - cam.location).to_track_quat("-Z", "Y").to_euler()

# World overview camera — saved into blend
cam2 = bpy.data.cameras.new("ShowcaseCamera")
cam2.lens = 30
c2 = bpy.data.objects.new("ShowcaseCamera", cam2)
root.objects.link(c2)
c2.location = Vector((ox + 8, oy - 48, 32))
c2.rotation_euler = (Vector((ox + 0, oy + 2, 1.0)) - c2.location).to_track_quat("-Z", "Y").to_euler()

# Village square hero — south approach looking into crossroads
cam3 = bpy.data.cameras.new("WorldHeroCamera")
cam3.lens = 30
c3 = bpy.data.objects.new("WorldHeroCamera", cam3)
root.objects.link(c3)
c3.location = Vector((ox + 0.5, oy - 14, 7.5))
c3.rotation_euler = (Vector((ox + 0.5, oy + 2, 1.2)) - c3.location).to_track_quat("-Z", "Y").to_euler()

# River / dock vista
cam4 = bpy.data.cameras.new("WorldDockCamera")
cam4.lens = 28
c4 = bpy.data.objects.new("WorldDockCamera", cam4)
root.objects.link(c4)
c4.location = Vector((ox - 28, oy - 22, 10))
c4.rotation_euler = (Vector((ox - 16, oy - 6, 1.0)) - c4.location).to_track_quat("-Z", "Y").to_euler()

bpy.context.scene.camera = c2
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.view_settings.view_transform = "Standard"

# Hide library masters (PREV/SHOW copies are the visible instances)
for name in created:
    obj = bpy.data.objects.get(name)
    if obj:
        obj.hide_viewport = True
        obj.hide_render = True

bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=BLEND)

with open(os.path.join(EXPORT, "manifest.txt"), "w", encoding="utf-8") as f:
    f.write(f"v5.4 world\ncount={len(created)}\nworld_instances={_place_n}\n")
    for n in created:
        f.write(n + "\n")
print("CREATED", len(created), "WORLD_INSTANCES", _place_n)
