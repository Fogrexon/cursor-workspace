"""
v4  Emulti-material low-poly kit (reliable shading) + village showcase vignette.
Target: indie stylized low-poly production kitbash set.
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

rng = random.Random(99)

COLS = {
    "stone": (0.56, 0.54, 0.51, 1),
    "stone_dark": (0.40, 0.39, 0.38, 1),
    "moss": (0.34, 0.50, 0.28, 1),
    "dirt": (0.42, 0.30, 0.20, 1),
    "bark": (0.34, 0.20, 0.12, 1),
    "bark_light": (0.52, 0.38, 0.24, 1),
    "leaf": (0.28, 0.58, 0.22, 1),
    "leaf_dark": (0.16, 0.40, 0.16, 1),
    "leaf_yellow": (0.72, 0.58, 0.18, 1),
    "autumn": (0.78, 0.34, 0.12, 1),
    "pine": (0.14, 0.36, 0.18, 1),
    "plaster": (0.88, 0.82, 0.72, 1),
    "plaster_cool": (0.78, 0.80, 0.76, 1),
    "brick": (0.64, 0.34, 0.26, 1),
    "wood": (0.52, 0.34, 0.18, 1),
    "wood_dark": (0.30, 0.18, 0.10, 1),
    "thatch": (0.62, 0.50, 0.26, 1),
    "roof": (0.50, 0.20, 0.16, 1),
    "slate": (0.30, 0.34, 0.38, 1),
    "metal": (0.46, 0.48, 0.52, 1),
    "glass": (0.42, 0.68, 0.76, 1),
    "grass": (0.32, 0.56, 0.22, 1),
    "flower_r": (0.84, 0.24, 0.28, 1),
    "flower_y": (0.92, 0.78, 0.18, 1),
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
    nodes = m.node_tree.nodes
    links = m.node_tree.links
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    col = COLS[key]
    bsdf.inputs["Base Color"].default_value = col
    rough = 0.35 if key == "glass" else (0.45 if key == "metal" else 0.82)
    bsdf.inputs["Roughness"].default_value = rough
    if key == "metal":
        bsdf.inputs["Metallic"].default_value = 0.55
    if key == "glass":
        bsdf.inputs["Alpha"].default_value = 0.65
        m.blend_method = "BLEND"
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    _mats[key] = m
    return m


def new_obj(name, coll):
    me = bpy.data.meshes.new(name)
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    ob["kit_category"] = coll.name
    ob["usage"] = "openworld_modular_prop"
    return ob, bmesh.new()


def box(bm, sx, sy, sz, ox=0, oy=0, oz=0, mat_index=0):
    f0 = len(bm.faces)
    geom = bmesh.ops.create_cube(bm, size=1.0)["verts"]
    for v in geom:
        v.co.x = ox + v.co.x * sx
        v.co.y = oy + v.co.y * sy
        v.co.z = oz + v.co.z * sz
    bm.faces.ensure_lookup_table()
    for i in range(f0, len(bm.faces)):
        bm.faces[i].material_index = mat_index
    return geom


def mark_new_faces(bm, f0, mat_index):
    bm.faces.ensure_lookup_table()
    for i in range(f0, len(bm.faces)):
        bm.faces[i].material_index = mat_index


def assign_mats(obj, keys):
    # Clearing materials resets polygon material_index to 0 in Blender.
    # Keep slot count by overwriting / extending carefully.
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
    if triangulate:
        bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.faces.ensure_lookup_table()
    face_mats = [f.material_index for f in bm.faces]
    bm.to_mesh(obj.data)
    bm.free()
    assign_mats(obj, mat_keys)
    max_i = max(0, len(mat_keys) - 1)
    for poly, idx in zip(obj.data.polygons, face_mats):
        poly.material_index = min(max(0, idx), max_i)
    ground(obj)


def make_rock(name, coll, size=1.0, kind="boulder"):
    obj, bm = new_obj(name, coll)
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=2, use_grid_fill=True)
    seed = rng.random() * 30
    scales = {"boulder": (1.15, 0.95, 0.8), "slab": (1.7, 1.2, 0.38), "chunk": (0.95, 0.8, 1.05), "round": (1.05, 1.0, 0.9)}[kind]
    for v in bm.verts:
        v.co.x *= size * scales[0]
        v.co.y *= size * scales[1]
        v.co.z *= size * scales[2]
        n = noise.noise(Vector((v.co.x * 1.4 + seed, v.co.y * 1.4, v.co.z * 1.4)))
        v.co *= 0.88 + n * 0.16
        v.co += Vector((n, n * 0.5, abs(n))) * size * 0.07
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        if v.co.z < zmin + size * 0.35:
            v.co.z = zmin + (v.co.z - zmin) * 0.15
    bm.normal_update()
    for f in bm.faces:
        if f.normal.z > 0.72 and rng.random() > 0.55:
            f.material_index = 1  # moss
        elif f.normal.z < 0.2:
            f.material_index = 2  # dirt
        else:
            f.material_index = 0
    finish(obj, bm, ["stone", "moss", "dirt"], triangulate=True)
    return obj


def make_tree(name, coll, kind="oak"):
    obj, bm = new_obj(name, coll)
    cfg = {
        "oak": (5.2, 0.3, 0.14, "leaf", [(0, 0, 0.8, 1.6), (0.8, 0.25, 0.7, 1.1), (-0.7, -0.2, 0.72, 1.15), (0.2, -0.75, 0.74, 1.0)]),
        "pine": (6.8, 0.22, 0.08, "pine", []),
        "birch": (5.6, 0.15, 0.07, "leaf_yellow", [(0, 0, 0.84, 1.2), (0.55, 0.15, 0.74, 0.9), (-0.5, 0.2, 0.76, 0.85)]),
        "autumn": (5.0, 0.26, 0.12, "autumn", [(0, 0, 0.78, 1.45), (0.65, -0.2, 0.68, 1.05), (-0.6, 0.3, 0.7, 1.0)]),
        "dead": (4.2, 0.2, 0.08, None, []),
    }[kind]
    h, r0, r1, leaf_key, clumps = cfg
    bark_key = "bark_light" if kind == "birch" else "bark"

    f0 = len(bm.faces)
    start = len(bm.verts)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=r0, radius2=r1, depth=h * 0.7)
    for v in bm.verts[start:]:
        v.co.z += h * 0.35
    mark_new_faces(bm, f0, 0)

    if kind == "pine":
        for i, t in enumerate((0.42, 0.58, 0.72, 0.86)):
            start = len(bm.verts)
            f0 = len(bm.faces)
            bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=1.7 - i * 0.32, radius2=0.04, depth=1.5 - i * 0.15)
            for v in bm.verts[start:]:
                v.co.z += h * t
            mark_new_faces(bm, f0, 1)
    elif kind == "dead":
        for ang, zh, length in ((0.4, 0.52, 1.35), (2.3, 0.66, 1.15), (4.0, 0.58, 1.0), (1.3, 0.78, 0.75)):
            start = len(bm.verts)
            f0 = len(bm.faces)
            bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.08, radius2=0.02, depth=length)
            rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(math.radians(52), 4, "Y")
            for v in bm.verts[start:]:
                v.co = rot @ (v.co + Vector((0, 0, length * 0.5)))
                v.co.z += h * zh
            mark_new_faces(bm, f0, 0)
    else:
        for ang, zh, length in ((0.35, 0.48, 0.75), (2.6, 0.56, 0.65)):
            start = len(bm.verts)
            f0 = len(bm.faces)
            bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.09, radius2=0.03, depth=length)
            rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(math.radians(42), 4, "Y")
            for v in bm.verts[start:]:
                v.co = rot @ (v.co + Vector((0, 0, length * 0.5)))
                v.co.z += h * zh
            mark_new_faces(bm, f0, 0)
        for x, y, zt, rad in clumps:
            start = len(bm.verts)
            f0 = len(bm.faces)
            bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rad)
            center = Vector((x, y, h * zt))
            for v in bm.verts[start:]:
                v.co.z *= 0.7
                v.co *= 1.0 + noise.noise(v.co * 2.2 + center) * 0.14
                v.co += center
            mark_new_faces(bm, f0, 1)

    keys = [bark_key] if leaf_key is None else [bark_key, leaf_key]
    finish(obj, bm, keys, triangulate=True)
    return obj


def make_bush(name, coll, autumn=False):
    obj, bm = new_obj(name, coll)
    leaf = "autumn" if autumn else "leaf"
    for center, rad in (
        (Vector((0, 0, 0.5)), 0.6),
        (Vector((0.4, 0.12, 0.38)), 0.42),
        (Vector((-0.35, -0.15, 0.4)), 0.45),
        (Vector((0.1, -0.4, 0.42)), 0.4),
    ):
        start = len(bm.verts)
        f0 = len(bm.faces)
        bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rad)
        for v in bm.verts[start:]:
            v.co.z *= 0.62
            v.co *= 1.0 + noise.noise(v.co * 2.4) * 0.15
            v.co += center
        mark_new_faces(bm, f0, 0)
    finish(obj, bm, [leaf, "leaf_dark"], triangulate=True)
    return obj


def make_house(name, coll, w=4.8, d=4.0, wh=2.8, style="cottage"):
    obj, bm = new_obj(name, coll)
    # mat indices: 0 plaster/wood wall, 1 foundation stone, 2 wood trim/door, 3 roof, 4 glass
    plaster = 0
    foundation = 1
    wood = 2
    roof_i = 3
    glass = 4
    t = 0.32
    box(bm, w + 0.3, d + 0.3, 0.32, oz=0.16, mat_index=foundation)
    box(bm, w - 0.1, d - 0.1, 0.1, oz=0.36, mat_index=wood)
    # walls
    box(bm, w, t, wh, oy=d / 2 - t / 2, oz=0.32 + wh / 2, mat_index=plaster)
    box(bm, t, d - 2 * t, wh, ox=-w / 2 + t / 2, oz=0.32 + wh / 2, mat_index=plaster)
    box(bm, t, d - 2 * t, wh, ox=w / 2 - t / 2, oz=0.32 + wh / 2, mat_index=plaster)
    dw, dh = 1.0, 2.15
    side = (w - dw) / 2
    fy = -d / 2 + t / 2
    box(bm, side, t, wh, ox=-(dw / 2 + side / 2), oy=fy, oz=0.32 + wh / 2, mat_index=plaster)
    box(bm, side, t, wh, ox=(dw / 2 + side / 2), oy=fy, oz=0.32 + wh / 2, mat_index=plaster)
    box(bm, dw, t, wh - dh, oy=fy, oz=0.32 + dh + (wh - dh) / 2, mat_index=plaster)
    # door frame + door
    box(bm, dw + 0.16, 0.1, dh + 0.14, oy=fy - 0.02, oz=0.32 + dh / 2, mat_index=wood)
    box(bm, dw * 0.86, 0.12, dh * 0.9, oy=fy - 0.1, oz=0.32 + dh * 0.45, mat_index=wood)
    # windows
    for ox, sign in ((-w / 2, -1), (w / 2, 1)):
        box(bm, 0.1, 0.95, 1.05, ox=ox + sign * 0.02, oz=1.6, mat_index=wood)
        box(bm, 0.08, 0.78, 0.82, ox=ox + sign * 0.08, oz=1.6, mat_index=glass)
        box(bm, 0.06, 0.08, 0.82, ox=ox + sign * 0.08, oz=1.6, mat_index=wood)
        box(bm, 0.06, 0.78, 0.08, ox=ox + sign * 0.08, oz=1.6, mat_index=wood)
    # corner posts
    for ox, oy in ((-w / 2, -d / 2), (w / 2, -d / 2), (-w / 2, d / 2), (w / 2, d / 2)):
        box(bm, 0.18, 0.18, wh + 0.15, ox=ox, oy=oy, oz=0.32 + wh / 2, mat_index=wood)
    # roof overhang prism
    rise = 1.55 if style != "barn" else 2.0
    ow, od = w * 0.6, d * 0.6
    z0 = 0.32 + wh
    coords = [Vector((-ow, -od, z0)), Vector((ow, -od, z0)), Vector((ow, od, z0)), Vector((-ow, od, z0)), Vector((0, -od, z0 + rise)), Vector((0, od, z0 + rise))]
    vs = [bm.verts.new(p) for p in coords]
    bm.verts.ensure_lookup_table()
    for ids in ((0, 1, 4), (3, 2, 5), (0, 4, 5, 3), (1, 2, 5, 4)):
        f = bm.faces.new([vs[i] for i in ids])
        f.material_index = roof_i
    if style in ("cottage", "inn"):
        box(bm, 0.55, 0.55, 1.25, ox=w * 0.22, oy=d * 0.1, oz=z0 + rise * 0.5, mat_index=foundation)
        box(bm, 0.65, 0.65, 0.12, ox=w * 0.22, oy=d * 0.1, oz=z0 + rise * 0.5 + 0.65, mat_index=foundation)

    wall_key = "wood" if style in ("hut", "barn", "shed") else "plaster"
    roof_key = "thatch" if style in ("hut", "barn", "shed") else "roof"
    finish(obj, bm, [wall_key, "stone_dark", "wood_dark", roof_key, "glass"], triangulate=True)
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
        box(bm, 0.08, ww * 0.82, 0.08, oy=-0.1, oz=wz, mat_index=2)
        box(bm, ww * 0.82, 0.08, 0.08, oy=-0.1, oz=wz, mat_index=2)
    finish(obj, bm, [material if material != "wood" else "wood", "stone_dark", "wood_dark", "glass"])
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
    box(bm, 0.09, s * 1.05, 0.09, oz=0.14, mat_index=1)
    box(bm, 0.09, s * 1.05, 0.09, oz=s - 0.14, mat_index=1)
    finish(obj, bm, ["wood", "wood_dark"])
    return obj


def make_barrel(name, coll):
    obj, bm = new_obj(name, coll)
    h, r = 1.05, 0.42
    f0 = len(bm.faces)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=r, radius2=r * 0.9, depth=h)
    for v in bm.verts:
        v.co.z += h / 2
        t = abs(v.co.z / h - 0.5)
        v.co.xy *= 1.0 + (0.5 - t) * 0.28
    for f in bm.faces:
        f.material_index = 0
    box(bm, r * 2.25, r * 2.25, 0.07, oz=0.3, mat_index=1)
    box(bm, r * 2.25, r * 2.25, 0.07, oz=0.75, mat_index=1)
    finish(obj, bm, ["wood", "metal"], triangulate=True)
    return obj


def make_lamp(name, coll, h=3.4):
    obj, bm = new_obj(name, coll)
    box(bm, 0.5, 0.5, 0.14, oz=0.07, mat_index=0)
    start = len(bm.verts)
    f0 = len(bm.faces)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.085, radius2=0.055, depth=h)
    for v in bm.verts[start:]:
        v.co.z += h / 2
    mark_new_faces(bm, f0, 0)
    box(bm, 0.45, 0.45, 0.1, oz=h, mat_index=0)
    box(bm, 0.55, 0.55, 0.08, oz=h + 0.32, mat_index=0)
    box(bm, 0.36, 0.36, 0.38, oz=h + 0.15, mat_index=1)
    finish(obj, bm, ["metal", "glass"])
    return obj


def make_well(name, coll):
    obj, bm = new_obj(name, coll)
    f0 = len(bm.faces)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=14, radius1=1.05, radius2=1.05, depth=0.95)
    for v in bm.verts:
        v.co.z += 0.48
    for f in bm.faces:
        f.material_index = 0
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


def make_bridge(name, coll, length=6.0, width=2.1):
    obj, bm = new_obj(name, coll)
    box(bm, length, width, 0.22, oz=0.28, mat_index=0)
    n = int(length / 0.38)
    for i in range(n):
        box(bm, 0.1, width * 0.95, 0.06, ox=-length / 2 + 0.25 + i * 0.38, oz=0.42, mat_index=1)
    for s in (-1, 1):
        box(bm, length, 0.1, 0.1, oy=s * width / 2, oz=1.0, mat_index=0)
        for x in (-length * 0.4, 0, length * 0.4):
            box(bm, 0.1, 0.1, 0.85, ox=x, oy=s * width / 2, oz=0.6, mat_index=0)
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
        start = len(bm.verts)
        f0 = len(bm.faces)
        bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=0.4, radius2=0.4, depth=0.16)
        for v in bm.verts[start:]:
            y0, z0 = v.co.y, v.co.z
            v.co.y, v.co.z = z0, y0
            v.co += Vector((x, y, 0.4))
        mark_new_faces(bm, f0, 1)
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
    start = len(bm.verts)
    f0 = len(bm.faces)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.4, radius2=0.34, depth=h)
    for v in bm.verts[start:]:
        v.co.z += h / 2
        n = noise.noise(Vector((v.co.x * 3, v.co.y * 3, v.co.z)))
        v.co += Vector((n, n, 0)) * 0.07
        if v.co.z > h * 0.65:
            v.co.z -= abs(noise.noise(Vector((v.co.x, v.co.y, 3)))) * h * 0.3
    mark_new_faces(bm, f0, 0)
    bm.faces.ensure_lookup_table()
    for f in bm.faces[f0:]:
        if f.normal.z > 0.7:
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
        start = len(bm.verts)
        f0 = len(bm.faces)
        bmesh.ops.create_cone(bm, cap_ends=True, segments=3, radius1=0.04, radius2=0.004, depth=hh)
        rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(0.22 + rng.random() * 0.25, 4, "X")
        for v in bm.verts[start:]:
            v.co = rot @ v.co
            v.co.z += hh / 2
            v.co.x += math.cos(ang) * 0.1
            v.co.y += math.sin(ang) * 0.1
        mark_new_faces(bm, f0, 0)
    finish(obj, bm, ["grass"], triangulate=True)
    return obj


def make_flower(name, coll, key):
    obj, bm = new_obj(name, coll)
    start = len(bm.verts)
    f0 = len(bm.faces)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.02, radius2=0.015, depth=0.4)
    for v in bm.verts[start:]:
        v.co.z += 0.2
    mark_new_faces(bm, f0, 0)
    start = len(bm.verts)
    f0 = len(bm.faces)
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=0.12)
    for v in bm.verts[start:]:
        v.co.z = v.co.z * 0.4 + 0.45
    mark_new_faces(bm, f0, 1)
    finish(obj, bm, ["grass", key], triangulate=True)
    return obj


def make_roof(name, coll, style):
    obj, bm = new_obj(name, coll)
    w, d, rise = 4.6, 4.0, 1.4
    coords = [Vector((-w/2, -d/2, 0)), Vector((w/2, -d/2, 0)), Vector((w/2, d/2, 0)), Vector((-w/2, d/2, 0)), Vector((0, -d/2, rise)), Vector((0, d/2, rise))]
    vs = [bm.verts.new(p) for p in coords]
    bm.verts.ensure_lookup_table()
    for ids in ((0, 1, 4), (3, 2, 5), (0, 4, 5, 3), (1, 2, 5, 4), (0, 3, 2, 1)):
        f = bm.faces.new([vs[i] for i in ids])
        f.material_index = 0
    key = {"tile": "roof", "thatch": "thatch", "slate": "slate"}[style]
    finish(obj, bm, [key], triangulate=True)
    return obj


def make_pillar(name, coll, brick=False):
    obj, bm = new_obj(name, coll)
    box(bm, 0.6, 0.6, 3.0, oz=1.5, mat_index=0)
    box(bm, 0.75, 0.75, 0.2, oz=0.1, mat_index=1)
    box(bm, 0.72, 0.72, 0.15, oz=3.05, mat_index=1)
    finish(obj, bm, ["brick" if brick else "stone", "stone_dark"])
    return obj


# ===== BUILD =====
clear()
root = bpy.context.scene.collection
cats = {n: ensure_coll(n, root) for n in [
    "01_Stones", "02_Rocks", "03_Trees", "04_Foliage", "05_Buildings",
    "06_ModularArch", "07_Props", "08_Ruins", "09_Paths", "10_NatureDetail",
    "PreviewLayout", "11_Showcase",
]}
created = []

for i in range(12):
    created.append(make_rock(f"STONE-{i:02d}", cats["01_Stones"], 0.2 + i * 0.05, rng.choice(["round", "chunk", "slab"])).name)
for i in range(14):
    created.append(make_rock(f"ROCK-{i:02d}", cats["02_Rocks"], 0.75 + (i % 5) * 0.22, ["boulder", "slab", "chunk", "boulder", "round"][i % 5]).name)
for i, k in enumerate(["oak", "oak", "oak", "pine", "pine", "pine", "birch", "birch", "autumn", "autumn", "dead", "oak", "pine", "birch"]):
    created.append(make_tree(f"TREE-{k}-{i:02d}", cats["03_Trees"], k).name)
for i in range(10):
    created.append(make_bush(f"BUSH-{i:02d}", cats["04_Foliage"], autumn=i >= 7).name)

created += [
    make_house("BLD-hut-01", cats["05_Buildings"], 3.4, 3.1, 2.5, "hut").name,
    make_house("BLD-hut-02", cats["05_Buildings"], 3.9, 3.4, 2.55, "hut").name,
    make_house("BLD-cottage-01", cats["05_Buildings"], 4.8, 4.0, 2.8, "cottage").name,
    make_house("BLD-cottage-02", cats["05_Buildings"], 5.5, 4.4, 2.9, "cottage").name,
    make_house("BLD-barn-01", cats["05_Buildings"], 7.4, 4.5, 3.4, "barn").name,
    make_house("BLD-shed-01", cats["05_Buildings"], 2.8, 2.4, 2.25, "shed").name,
    make_house("BLD-inn-01", cats["05_Buildings"], 8.0, 5.3, 3.2, "inn").name,
    make_house("BLD-shop-01", cats["05_Buildings"], 5.3, 4.2, 2.85, "cottage").name,
    make_tower("BLD-tower-01", cats["05_Buildings"]).name,
    make_house("BLD-watch-01", cats["05_Buildings"], 3.1, 3.1, 3.5, "shed").name,
]

created.append(make_wall("ARCH-wall-01", cats["06_ModularArch"], 4, material="plaster").name)
created.append(make_wall("ARCH-wall-02", cats["06_ModularArch"], 2, material="brick").name)
created.append(make_wall("ARCH-wall-03", cats["06_ModularArch"], 4, material="wood").name)
created.append(make_wall("ARCH-wall-door-01", cats["06_ModularArch"], 4, door=True).name)
created.append(make_wall("ARCH-wall-door-02", cats["06_ModularArch"], 2, door=True, material="wood").name)
created.append(make_wall("ARCH-wall-window-01", cats["06_ModularArch"], 4, window=True).name)
created.append(make_wall("ARCH-wall-window-02", cats["06_ModularArch"], 2, window=True, material="brick").name)
created.append(make_wall("ARCH-wall-doorwindow-01", cats["06_ModularArch"], 4, door=True, window=True).name)
for i in range(4):
    created.append(make_pillar(f"ARCH-pillar-{i:02d}", cats["06_ModularArch"], i % 2 == 1).name)
created.append(make_roof("ARCH-roof-tile-01", cats["06_ModularArch"], "tile").name)
created.append(make_roof("ARCH-roof-thatch-01", cats["06_ModularArch"], "thatch").name)
created.append(make_roof("ARCH-roof-slate-01", cats["06_ModularArch"], "slate").name)

for i in range(4):
    created.append(make_fence(f"PROP-fence-{i:02d}", cats["07_Props"], 2 + i * 0.5).name)
for i in range(4):
    created.append(make_crate(f"PROP-crate-{i:02d}", cats["07_Props"], 0.55 + i * 0.12).name)
for i in range(3):
    created.append(make_barrel(f"PROP-barrel-{i:02d}", cats["07_Props"]).name)
for i in range(3):
    created.append(make_lamp(f"PROP-lamp-{i:02d}", cats["07_Props"], 3.0 + i * 0.3).name)
created.append(make_well("PROP-well-01", cats["07_Props"]).name)
created.append(make_bridge("PROP-bridge-01", cats["07_Props"], 5.5).name)
created.append(make_bridge("PROP-bridge-02", cats["07_Props"], 7.5, 2.3).name)
created.append(make_cart("PROP-cart-01", cats["07_Props"]).name)
created.append(make_sign("PROP-sign-01", cats["07_Props"]).name)
created.append(make_bench("PROP-bench-01", cats["07_Props"]).name)
for i in range(10):
    created.append(make_ruin(f"RUIN-pillar-{i:02d}", cats["08_Ruins"], 1.9 + i * 0.25).name)
for i in range(12):
    created.append(make_path(f"PATH-stone-{i:02d}", cats["09_Paths"], 0.5 + (i % 5) * 0.1).name)
for i in range(8):
    created.append(make_grass(f"DET-grass-{i:02d}", cats["10_NatureDetail"]).name)
for i, k in enumerate(["flower_r", "flower_y", "flower_r", "flower_y", "flower_r", "flower_y"]):
    created.append(make_flower(f"DET-flower-{i:02d}", cats["10_NatureDetail"], k).name)

# Preview grid
preview = cats["PreviewLayout"]
order = [k for k in cats if k.startswith(("0", "1")) and k not in ("11_Showcase",)]
order = [k for k in cats.keys() if k not in ("PreviewLayout", "11_Showcase")]
row_y = 0.0
for cat_name in order:
    objs = [o for o in sorted(cats[cat_name].objects, key=lambda o: o.name) if o.name in created]
    sx = 9.5 if "Build" in cat_name else (7.5 if "Tree" in cat_name or "Arch" in cat_name else 4.8)
    rg = 12.0 if "Build" in cat_name or "Tree" in cat_name else 8.0
    maxc = 7 if "Build" in cat_name else 10
    col = 0
    for obj in objs:
        dup = obj.copy(); dup.data = obj.data; dup.name = f"PREV-{obj.name}"
        preview.objects.link(dup)
        dup.location = (col * sx, -row_y, 0)
        obj.hide_viewport = True; obj.hide_render = True
        col += 1
        if col >= maxc:
            col = 0; row_y += rg
    row_y += rg + 2

# Showcase village vignette
sc = cats["11_Showcase"]

def place(src_name, loc, rot_z=0.0):
    src = bpy.data.objects.get(src_name)
    if not src:
        return
    d = src.copy(); d.data = src.data; d.name = "SHOW-" + src_name
    sc.objects.link(d)
    d.location = loc
    d.rotation_euler = (0, 0, math.radians(rot_z))
    d.hide_viewport = False; d.hide_render = False

# ground path
ox, oy = 80.0, 20.0  # offset away from preview grid
place("BLD-cottage-01", (ox, oy, 0))
place("BLD-hut-01", (ox + 9, oy - 2, 0), 25)
place("BLD-tower-01", (ox - 8, oy + 4, 0), -10)
place("BLD-shed-01", (ox + 4, oy + 8, 0), 90)
place("PROP-well-01", (ox + 3, oy - 5, 0))
place("PROP-cart-01", (ox - 2, oy - 6, 0), 40)
place("PROP-fence-02", (ox + 6, oy - 7, 0), 10)
place("PROP-fence-01", (ox + 9, oy - 6, 0), 55)
place("PROP-lamp-01", (ox + 1, oy - 3.5, 0))
place("PROP-bench-01", (ox + 5, oy - 4, 0), -20)
place("PROP-sign-01", (ox - 4, oy - 4, 0), 15)
place("PROP-bridge-01", (ox - 12, oy - 2, 0), 90)
place("TREE-oak-00", (ox - 5, oy + 7, 0))
place("TREE-pine-03", (ox + 12, oy + 5, 0))
place("TREE-autumn-08", (ox + 11, oy - 1, 0))
place("BUSH-02", (ox + 2, oy + 5, 0))
place("BUSH-08", (ox - 3, oy + 2, 0))
place("ROCK-03", (ox - 6, oy - 1, 0))
place("ROCK-07", (ox + 7, oy + 6, 0))
for i, p in enumerate([(ox+x, oy+y) for x, y in [(-1, -2), (0, -2.5), (1, -3), (2, -3.2), (3, -3.5), (4, -3.7)]]):
    place(f"PATH-stone-{i:02d}", (*p, 0), i * 15)
place("DET-grass-00", (ox + 1.5, oy + 3, 0))
place("DET-grass-01", (ox - 2, oy + 5.5, 0))
place("DET-flower-00", (ox + 4.5, oy - 3, 0))
place("DET-flower-01", (ox + 5.2, oy - 3.4, 0))
place("ARCH-wall-01", (ox + 14, oy + 2, 0), 90)
place("ARCH-wall-door-01", (ox + 14, oy - 2, 0), 90)
place("RUIN-pillar-03", (ox - 10, oy + 6, 0))
place("PROP-crate-01", (ox + 2.5, oy - 5.5, 0))
place("PROP-barrel-00", (ox + 1.8, oy - 5.8, 0))

# lights / world / cameras
sun = bpy.data.lights.new("Sun", "SUN"); sun.energy = 5
so = bpy.data.objects.new("Sun", sun); root.objects.link(so)
so.rotation_euler = (math.radians(52), math.radians(18), math.radians(40))
fill = bpy.data.lights.new("Fill", "AREA"); fill.energy = 450; fill.size = 80
fo = bpy.data.objects.new("Fill", fill); root.objects.link(fo); fo.location = (ox + 30, oy - 40, 35)

world = bpy.data.worlds.new("World"); bpy.context.scene.world = world; world.use_nodes = True
bg = world.node_tree.nodes["Background"]; bg.inputs[0].default_value = (0.58, 0.70, 0.82, 1); bg.inputs[1].default_value = 0.75

prevs = [o for o in preview.objects if o.name.startswith("PREV-")]
xs = [o.location.x for o in prevs]; ys = [o.location.y for o in prevs]
cx, cy = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2
span = max(max(xs)-min(xs), max(ys)-min(ys), 40)
camd = bpy.data.cameras.new("PreviewCamera"); camd.lens = 40
cam = bpy.data.objects.new("PreviewCamera", camd); root.objects.link(cam)
cam.location = Vector((cx + span*0.15, cy - span*1.0, max(span*0.55, 48)))
cam.rotation_euler = (Vector((cx, cy, 2)) - cam.location).to_track_quat("-Z", "Y").to_euler()

cam2 = bpy.data.cameras.new("ShowcaseCamera"); cam2.lens = 35
c2 = bpy.data.objects.new("ShowcaseCamera", cam2); root.objects.link(c2)
c2.location = Vector((ox + 8, oy - 16, 11))
c2.rotation_euler = (Vector((ox + 2, oy + 1, 1.5)) - c2.location).to_track_quat("-Z", "Y").to_euler()

bpy.context.scene.camera = cam
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.view_settings.view_transform = "Standard"
bpy.ops.wm.save_as_mainfile(filepath=BLEND)
with open(os.path.join(EXPORT, "manifest.txt"), "w", encoding="utf-8") as f:
    f.write(f"v4 multi-material\ncount={len(created)}\n")
    for n in created:
        f.write(n + "\n")
