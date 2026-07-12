"""
Production kit v3 — quality pass based on QA findings.

Fixes:
- Color Attribute shader (Blender 5.x)
- Buildings: foundation, trim, overhang roof, framed door/window
- Trees: coherent trunk/canopy clumps
- Rocks: cube-subdiv displace (not spindles)
- Isolated hero renders + denser prop detailing
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

rng = random.Random(77)

PAL = {
    "stone": (0.55, 0.53, 0.50),
    "stone2": (0.42, 0.41, 0.40),
    "stone3": (0.63, 0.60, 0.55),
    "moss": (0.36, 0.48, 0.30),
    "dirt": (0.40, 0.30, 0.20),
    "bark": (0.33, 0.20, 0.12),
    "bark2": (0.48, 0.34, 0.22),
    "leaf": (0.30, 0.58, 0.24),
    "leaf2": (0.18, 0.42, 0.18),
    "leaf3": (0.70, 0.55, 0.16),
    "autumn": (0.75, 0.34, 0.12),
    "pine": (0.16, 0.36, 0.20),
    "plaster": (0.86, 0.80, 0.70),
    "plaster2": (0.78, 0.72, 0.62),
    "brick": (0.62, 0.34, 0.26),
    "wood": (0.50, 0.34, 0.18),
    "wood2": (0.32, 0.20, 0.12),
    "thatch": (0.60, 0.50, 0.28),
    "roof": (0.48, 0.20, 0.16),
    "slate": (0.32, 0.36, 0.40),
    "metal": (0.45, 0.47, 0.50),
    "glass": (0.45, 0.70, 0.78),
    "grass": (0.34, 0.56, 0.24),
    "flower": (0.82, 0.25, 0.30),
    "flower2": (0.92, 0.78, 0.20),
}


def clear_all():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for b in list(coll):
            coll.remove(b)
    for c in list(bpy.data.collections):
        if c.name not in {"Collection", "Scene Collection"}:
            try:
                bpy.data.collections.remove(c)
            except Exception:
                pass


def coll(name, parent):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in [x.name for x in parent.children]:
        parent.children.link(c)
    return c


def mat_vc():
    m = bpy.data.materials.get("M_VC")
    if m:
        return m
    m = bpy.data.materials.new("M_VC")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "Col"
    bsdf.inputs["Roughness"].default_value = 0.78
    # slight subsurface for foliage softness optional later
    nt.links.new(attr.outputs["Color"], bsdf.inputs["Base Color"])
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return m


def jcolor(c, a=0.035):
    return tuple(max(0, min(1, c[i] + (rng.random() - 0.5) * 2 * a)) for i in range(3))


def paint(bm, fn):
    layer = bm.loops.layers.color.get("Col") or bm.loops.layers.color.new("Col")
    for f in bm.faces:
        rgb = fn(f)
        for loop in f.loops:
            loop[layer] = (*jcolor(rgb), 1.0)


def solid(bm, color):
    paint(bm, lambda f: color)


def box(bm, sx, sy, sz, ox=0.0, oy=0.0, oz=0.0):
    geom = bmesh.ops.create_cube(bm, size=1.0)["verts"]
    for v in geom:
        v.co.x = ox + v.co.x * sx
        v.co.y = oy + v.co.y * sy
        v.co.z = oz + v.co.z * sz
    return geom


def finish(obj, bm, triangulate=False):
    if triangulate:
        bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(obj.data)
    bm.free()
    # ensure color attribute named Col exists for Attribute node
    if not obj.data.color_attributes:
        obj.data.color_attributes.new(name="Col", domain="CORNER", type="BYTE_COLOR")
    obj.data.update()
    m = mat_vc()
    if m.name not in obj.data.materials:
        obj.data.materials.append(m)
    # ground pivot
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
    obj["usage"] = "openworld_modular_prop"


def new_obj(name, c):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    c.objects.link(obj)
    obj["kit_category"] = c.name
    return obj, bmesh.new()


# ---- assets ----

def make_rock(name, c, size=1.0, kind="boulder"):
    obj, bm = new_obj(name, c)
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=2 if size > 0.7 else 1, use_grid_fill=True)
    seed = rng.random() * 40
    sx = {"boulder": (1.1, 0.9, 0.75), "slab": (1.6, 1.1, 0.4), "chunk": (0.9, 0.7, 1.0), "round": (1.0, 1.0, 0.85)}[kind]
    for v in bm.verts:
        v.co.x *= size * sx[0]
        v.co.y *= size * sx[1]
        v.co.z *= size * sx[2]
        n = noise.noise(Vector((v.co.x * 1.3 + seed, v.co.y * 1.3, v.co.z * 1.3)))
        n2 = noise.noise(Vector((v.co.x * 3.5 + seed, v.co.y * 3.5, v.co.z * 2)))
        # pull toward sphere-ish then chip
        v.co *= 0.85 + n * 0.18
        v.co += Vector((n2, n, abs(n2))) * size * 0.08
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        if v.co.z < zmin + size * 0.4:
            v.co.z = zmin + (v.co.z - zmin) * 0.2
    bm.normal_update()

    def col(f):
        h = sum(v.co.z for v in f.verts) / len(f.verts)
        if f.normal.z > 0.7 and rng.random() > 0.55:
            return PAL["moss"]
        if f.normal.z < 0.25:
            return PAL["dirt"]
        return PAL["stone"] if h > size * 0.3 else PAL["stone2"]

    paint(bm, col)
    finish(obj, bm, triangulate=True)
    return obj


def make_tree(name, c, kind="oak"):
    obj, bm = new_obj(name, c)
    specs = {
        "oak": dict(h=5.0, r0=0.28, r1=0.14, leaf=PAL["leaf"], clumps=((0, 0, 0.78, 1.55), (0.75, 0.2, 0.68, 1.05), (-0.65, -0.25, 0.7, 1.1), (0.15, -0.7, 0.72, 0.95))),
        "pine": dict(h=6.5, r0=0.2, r1=0.08, leaf=PAL["pine"], clumps=()),
        "birch": dict(h=5.4, r0=0.14, r1=0.07, leaf=PAL["leaf3"], clumps=((0, 0, 0.82, 1.15), (0.5, 0.15, 0.72, 0.85), (-0.45, 0.2, 0.74, 0.8))),
        "autumn": dict(h=4.8, r0=0.24, r1=0.12, leaf=PAL["autumn"], clumps=((0, 0, 0.76, 1.4), (0.6, -0.2, 0.66, 1.0), (-0.55, 0.3, 0.68, 0.95))),
        "dead": dict(h=4.0, r0=0.18, r1=0.07, leaf=None, clumps=()),
    }[kind]
    h, r0, r1 = specs["h"], specs["r0"], specs["r1"]
    # trunk
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=r0, radius2=r1, depth=h * 0.72)
    for v in bm.verts:
        v.co.z += h * 0.36
        a = math.atan2(v.co.y, v.co.x)
        v.co.x += math.cos(a * 2.5) * r0 * 0.05
        v.co.y += math.sin(a * 2.0) * r0 * 0.05
    trunk_top = h * 0.72

    if kind == "pine":
        for i, t in enumerate((0.42, 0.58, 0.72, 0.85)):
            start = len(bm.verts)
            rad = 1.7 - i * 0.32
            depth = 1.5 - i * 0.15
            bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=rad, radius2=0.05, depth=depth)
            for v in bm.verts[start:]:
                v.co.z += h * t
    elif kind == "dead":
        for ang, zh, length in ((0.5, 0.55, 1.3), (2.4, 0.68, 1.1), (4.1, 0.6, 0.95), (1.2, 0.78, 0.7)):
            start = len(bm.verts)
            bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.07, radius2=0.02, depth=length)
            rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(math.radians(50), 4, "Y")
            for v in bm.verts[start:]:
                v.co = rot @ (v.co + Vector((0, 0, length * 0.5)))
                v.co.z += h * zh
    else:
        # branch stubs
        for ang, zh, length in ((0.3, 0.5, 0.7), (2.5, 0.58, 0.6)):
            start = len(bm.verts)
            bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.08, radius2=0.03, depth=length)
            rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(math.radians(40), 4, "Y")
            for v in bm.verts[start:]:
                v.co = rot @ (v.co + Vector((0, 0, length * 0.5)))
                v.co.z += h * zh
        for x, y, zt, rad in specs["clumps"]:
            start = len(bm.verts)
            bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rad)
            center = Vector((x, y, h * zt))
            for v in bm.verts[start:]:
                v.co.z *= 0.72
                n = noise.noise(v.co * 2.0 + center)
                v.co *= 1.0 + n * 0.15
                v.co += center

    bark = PAL["bark2"] if kind == "birch" else PAL["bark"]
    leaf = specs["leaf"]

    def col(f):
        cz = sum(v.co.z for v in f.verts) / len(f.verts)
        if leaf and cz > trunk_top * 0.85 and (f.normal.z > -0.15 or kind == "pine"):
            # pine cones are leaf; dead has no leaf
            if kind == "pine" and cz > h * 0.35:
                return leaf
            if kind != "pine" and cz > trunk_top * 0.9:
                return leaf if f.normal.z > -0.1 else PAL["leaf2"]
        return bark

    paint(bm, col)
    finish(obj, bm, triangulate=True)
    return obj


def make_bush(name, c, autumn=False):
    obj, bm = new_obj(name, c)
    col = PAL["autumn"] if autumn else PAL["leaf"]
    for center, rad in (
        (Vector((0, 0, 0.45)), 0.55),
        (Vector((0.35, 0.1, 0.35)), 0.4),
        (Vector((-0.3, -0.12, 0.38)), 0.42),
        (Vector((0.05, -0.35, 0.4)), 0.38),
    ):
        start = len(bm.verts)
        bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rad)
        for v in bm.verts[start:]:
            v.co.z *= 0.65
            v.co *= 1.0 + noise.noise(v.co * 2.5) * 0.16
            v.co += center
    paint(bm, lambda f: col if f.normal.z > -0.1 else PAL["leaf2"])
    finish(obj, bm, triangulate=True)
    return obj


def make_house(name, c, w=4.5, d=3.8, wall_h=2.7, style="cottage"):
    obj, bm = new_obj(name, c)
    t = 0.3
    # foundation
    box(bm, w + 0.25, d + 0.25, 0.28, oz=0.14)
    # floor
    box(bm, w - 0.05, d - 0.05, 0.08, oz=0.32)
    # walls: back / left / right
    box(bm, w, t, wall_h, oy=d * 0.5 - t * 0.5, oz=0.28 + wall_h * 0.5)
    box(bm, t, d - t * 2, wall_h, ox=-w * 0.5 + t * 0.5, oz=0.28 + wall_h * 0.5)
    box(bm, t, d - t * 2, wall_h, ox=w * 0.5 - t * 0.5, oz=0.28 + wall_h * 0.5)
    # front with door opening construction
    door_w, door_h = 0.95, 2.05
    side = (w - door_w) * 0.5
    fy = -d * 0.5 + t * 0.5
    box(bm, side, t, wall_h, ox=-(door_w * 0.5 + side * 0.5), oy=fy, oz=0.28 + wall_h * 0.5)
    box(bm, side, t, wall_h, ox=(door_w * 0.5 + side * 0.5), oy=fy, oz=0.28 + wall_h * 0.5)
    box(bm, door_w, t, wall_h - door_h, oy=fy, oz=0.28 + door_h + (wall_h - door_h) * 0.5)
    # door + frame
    box(bm, door_w + 0.12, 0.08, door_h + 0.1, oy=fy - 0.02, oz=0.28 + door_h * 0.5)
    box(bm, door_w * 0.88, 0.1, door_h * 0.92, oy=fy - 0.08, oz=0.28 + door_h * 0.46)
    # windows with frames on sides
    for ox in (-w * 0.5, w * 0.5):
        sign = -1 if ox < 0 else 1
        box(bm, 0.08, 0.85, 0.95, ox=ox + sign * 0.02, oz=1.55)  # frame outer
        box(bm, 0.06, 0.7, 0.75, ox=ox + sign * 0.06, oz=1.55)  # glass
        # mullion
        box(bm, 0.05, 0.06, 0.75, ox=ox + sign * 0.06, oz=1.55)
        box(bm, 0.05, 0.7, 0.06, ox=ox + sign * 0.06, oz=1.55)
    # corner posts / trim
    for ox, oy in ((-w * 0.5, -d * 0.5), (w * 0.5, -d * 0.5), (-w * 0.5, d * 0.5), (w * 0.5, d * 0.5)):
        box(bm, 0.16, 0.16, wall_h + 0.1, ox=ox, oy=oy, oz=0.28 + wall_h * 0.5)
    # roof with overhang
    rise = 1.45 if style != "barn" else 1.9
    ow, od = w * 0.58, d * 0.58
    z0 = 0.28 + wall_h
    coords = [
        Vector((-ow, -od, z0)), Vector((ow, -od, z0)), Vector((ow, od, z0)), Vector((-ow, od, z0)),
        Vector((0, -od, z0 + rise)), Vector((0, od, z0 + rise)),
    ]
    vs = [bm.verts.new(p) for p in coords]
    bm.verts.ensure_lookup_table()
    for ids in ((0, 1, 4), (3, 2, 5), (0, 4, 5, 3), (1, 2, 5, 4)):
        bm.faces.new([vs[i] for i in ids])
    # chimney
    if style in ("cottage", "inn"):
        box(bm, 0.5, 0.5, 1.2, ox=w * 0.22, oy=d * 0.12, oz=z0 + rise * 0.55)
        box(bm, 0.58, 0.58, 0.12, ox=w * 0.22, oy=d * 0.12, oz=z0 + rise * 0.55 + 0.6)

    plaster = PAL["wood"] if style in ("hut", "barn", "shed") else PAL["plaster"]
    roof = PAL["thatch"] if style in ("hut", "barn", "shed") else PAL["roof"]

    def col(f):
        ctr = sum((v.co for v in f.verts), Vector()) / len(f.verts)
        n = f.normal
        if ctr.z < 0.3:
            return PAL["stone2"]
        if ctr.z >= z0 - 0.02 and abs(n.z) < 0.9:
            return roof
        if n.z > 0.75 and ctr.z > z0:
            return roof
        # door
        if abs(n.y) > 0.7 and ctr.y < 0 and ctr.z < 0.28 + door_h and abs(ctr.x) < door_w * 0.55:
            return PAL["wood2"]
        # glass
        if abs(n.x) > 0.85 and 1.2 < ctr.z < 2.0:
            return PAL["glass"]
        # trim posts darker
        if abs(abs(ctr.x) - w * 0.5) < 0.2 and abs(abs(ctr.y) - d * 0.5) < 0.2:
            return PAL["wood"]
        if n.z > 0.8:
            return PAL["moss"] if rng.random() > 0.7 else plaster
        return plaster

    paint(bm, col)
    finish(obj, bm, triangulate=True)
    return obj


def make_tower(name, c):
    obj, bm = new_obj(name, c)
    box(bm, 2.6, 2.6, 0.35, oz=0.17)
    box(bm, 2.3, 2.3, 6.2, oz=3.3)
    box(bm, 2.7, 2.7, 0.28, oz=6.5)
    for x in (-0.95, 0.0, 0.95):
        for y in (-0.95, 0.95):
            box(bm, 0.4, 0.32, 0.55, ox=x, oy=y, oz=6.9)
    for y in (-0.35, 0.35):
        for x in (-0.95, 0.95):
            box(bm, 0.32, 0.4, 0.55, ox=x, oy=y, oz=6.9)
    box(bm, 0.85, 0.12, 1.2, oy=-1.2, oz=1.1)
    box(bm, 0.12, 0.7, 0.7, ox=1.2, oz=4.2)
    paint(bm, lambda f: PAL["wood2"] if abs(f.normal.y) > 0.9 and sum(v.co.z for v in f.verts)/len(f.verts) < 2 else (
        PAL["glass"] if abs(f.normal.x) > 0.9 and 3.8 < sum(v.co.z for v in f.verts)/len(f.verts) < 4.6 else (
            PAL["moss"] if f.normal.z > 0.8 else PAL["stone2"])))
    finish(obj, bm)
    return obj


def make_wall(name, c, length=4.0, door=False, window=False, material="plaster"):
    obj, bm = new_obj(name, c)
    h, t = 2.7, 0.3
    base = {"plaster": PAL["plaster"], "brick": PAL["brick"], "wood": PAL["wood"]}[material]
    box(bm, length + 0.1, t + 0.08, 0.22, oz=0.11)  # plinth
    if not door and not window:
        box(bm, length, t, h, oz=0.22 + h * 0.5)
    elif door:
        dw, dh = 0.95, 2.1
        side = (length - dw) * 0.5
        box(bm, side, t, h, ox=-(dw / 2 + side / 2), oz=0.22 + h * 0.5)
        box(bm, side, t, h, ox=(dw / 2 + side / 2), oz=0.22 + h * 0.5)
        box(bm, dw, t, h - dh, oz=0.22 + dh + (h - dh) * 0.5)
        box(bm, dw + 0.14, 0.08, dh + 0.12, oy=-0.02, oz=0.22 + dh * 0.5)
        box(bm, dw * 0.86, 0.1, dh * 0.9, oy=-0.1, oz=0.22 + dh * 0.45)
        if window:
            box(bm, 0.85, 0.08, 0.9, ox=length * 0.28, oy=-0.02, oz=1.6)
            box(bm, 0.7, 0.08, 0.7, ox=length * 0.28, oy=-0.08, oz=1.6)
    elif window:
        ww, wh, wz = 0.9, 1.0, 1.5
        box(bm, length, t, wz - wh / 2 - 0.22, oz=0.22 + (wz - wh / 2 - 0.22) * 0.5 + 0.11)
        top = h - (wz + wh / 2)
        box(bm, length, t, top, oz=wz + wh / 2 + top * 0.5)
        side = (length - ww) * 0.5
        box(bm, side, t, wh, ox=-(ww / 2 + side / 2), oz=wz)
        box(bm, side, t, wh, ox=(ww / 2 + side / 2), oz=wz)
        box(bm, ww + 0.1, 0.08, wh + 0.1, oy=-0.02, oz=wz)
        box(bm, ww * 0.85, 0.08, wh * 0.85, oy=-0.1, oz=wz)
        box(bm, 0.06, ww * 0.85, 0.06, oy=-0.1, oz=wz)
        box(bm, ww * 0.85, 0.06, 0.06, oy=-0.1, oz=wz)

    def col(f):
        ctr = sum((v.co for v in f.verts), Vector()) / len(f.verts)
        if ctr.z < 0.25:
            return PAL["stone"]
        if abs(f.normal.y) > 0.8 and door and abs(ctr.x) < 0.6 and ctr.z < 2.3:
            return PAL["wood2"]
        if abs(f.normal.y) > 0.8 and window and 1.1 < ctr.z < 2.1 and abs(ctr.x) < length * 0.4:
            return PAL["glass"]
        if f.normal.z > 0.8:
            return PAL["moss"] if rng.random() > 0.6 else base
        return base

    paint(bm, col)
    finish(obj, bm)
    return obj


def make_fence(name, c, length=2.5):
    obj, bm = new_obj(name, c)
    h = 1.2
    box(bm, 0.12, 0.12, h, ox=-length / 2, oz=h / 2)
    box(bm, 0.12, 0.12, h, ox=length / 2, oz=h / 2)
    box(bm, length, 0.08, 0.1, oz=h * 0.38)
    box(bm, length, 0.08, 0.1, oz=h * 0.72)
    # pickets
    n = max(3, int(length / 0.35))
    for i in range(n):
        x = -length / 2 + 0.2 + i * (length - 0.4) / max(1, n - 1)
        box(bm, 0.07, 0.05, h * 0.85, ox=x, oz=h * 0.45)
    solid(bm, PAL["wood"])
    finish(obj, bm)
    return obj


def make_crate(name, c, s=0.75):
    obj, bm = new_obj(name, c)
    box(bm, s, s, s, oz=s / 2)
    box(bm, s * 1.04, 0.08, 0.08, oz=0.12)
    box(bm, s * 1.04, 0.08, 0.08, oz=s - 0.12)
    box(bm, 0.08, s * 1.04, 0.08, oz=0.12)
    box(bm, 0.08, s * 1.04, 0.08, oz=s - 0.12)
    paint(bm, lambda f: PAL["wood2"] if abs(f.normal.z) < 0.3 else PAL["wood"])
    finish(obj, bm)
    return obj


def make_barrel(name, c):
    obj, bm = new_obj(name, c)
    h, r = 1.0, 0.4
    bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=r, radius2=r * 0.92, depth=h)
    for v in bm.verts:
        v.co.z += h / 2
        t = abs(v.co.z / h - 0.5)
        v.co.xy *= 1.0 + (0.5 - t) * 0.3
    box(bm, r * 2.2, r * 2.2, 0.06, oz=0.28)
    box(bm, r * 2.2, r * 2.2, 0.06, oz=0.72)
    paint(bm, lambda f: PAL["metal"] if abs(f.normal.z) < 0.35 and any(abs(v.co.z - z) < 0.1 for v in f.verts for z in (0.28, 0.72)) else PAL["wood"])
    finish(obj, bm, triangulate=True)
    return obj


def make_lamp(name, c, h=3.3):
    obj, bm = new_obj(name, c)
    box(bm, 0.45, 0.45, 0.12, oz=0.06)
    start = len(bm.verts)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.08, radius2=0.055, depth=h)
    for v in bm.verts[start:]:
        v.co.z += h / 2
    box(bm, 0.42, 0.42, 0.1, oz=h)
    box(bm, 0.5, 0.5, 0.08, oz=h + 0.3)
    box(bm, 0.34, 0.34, 0.36, oz=h + 0.14)
    paint(bm, lambda f: PAL["glass"] if abs(f.normal.z) < 0.55 and sum(v.co.z for v in f.verts) / len(f.verts) > h else PAL["metal"])
    finish(obj, bm)
    return obj


def make_well(name, c):
    obj, bm = new_obj(name, c)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=14, radius1=1.0, radius2=1.0, depth=0.9)
    for v in bm.verts:
        v.co.z += 0.45
    box(bm, 0.14, 0.14, 1.5, ox=-0.75, oz=1.35)
    box(bm, 0.14, 0.14, 1.5, ox=0.75, oz=1.35)
    box(bm, 1.7, 0.1, 0.1, oz=2.05)
    coords = [Vector((-1.05, -0.55, 2.1)), Vector((1.05, -0.55, 2.1)), Vector((1.05, 0.55, 2.1)), Vector((-1.05, 0.55, 2.1)),
              Vector((0, -0.55, 2.7)), Vector((0, 0.55, 2.7))]
    vs = [bm.verts.new(p) for p in coords]
    bm.verts.ensure_lookup_table()
    for ids in ((0, 1, 4), (3, 2, 5), (0, 4, 5, 3), (1, 2, 5, 4)):
        bm.faces.new([vs[i] for i in ids])
    paint(bm, lambda f: PAL["thatch"] if sum(v.co.z for v in f.verts)/len(f.verts) > 2.05 else (
        PAL["wood"] if abs(f.normal.x) > 0.7 or abs(f.normal.y) < 0.2 and abs(f.normal.z) < 0.2 else PAL["stone"]))
    finish(obj, bm, triangulate=True)
    return obj


def make_bridge(name, c, length=6.0, width=2.0):
    obj, bm = new_obj(name, c)
    box(bm, length, width, 0.2, oz=0.25)
    n = int(length / 0.4)
    for i in range(n):
        box(bm, 0.1, width * 0.96, 0.05, ox=-length / 2 + 0.25 + i * 0.4, oz=0.37)
    for side in (-1, 1):
        box(bm, length, 0.1, 0.1, oy=side * width / 2, oz=0.95)
        for x in (-length * 0.4, 0, length * 0.4):
            box(bm, 0.1, 0.1, 0.8, ox=x, oy=side * width / 2, oz=0.55)
    solid(bm, PAL["wood"])
    finish(obj, bm)
    return obj


def make_cart(name, c):
    obj, bm = new_obj(name, c)
    box(bm, 1.9, 1.15, 0.15, oz=0.7)
    box(bm, 1.9, 0.1, 0.55, oy=-0.55, oz=0.95)
    box(bm, 1.9, 0.1, 0.55, oy=0.55, oz=0.95)
    box(bm, 0.1, 1.15, 0.55, ox=-0.9, oz=0.95)
    box(bm, 0.1, 1.15, 0.35, ox=0.9, oz=0.85)
    # axle
    box(bm, 1.5, 0.08, 0.08, oz=0.38)
    for x, y in ((-0.65, -0.72), (0.65, -0.72), (-0.65, 0.72), (0.65, 0.72)):
        start = len(bm.verts)
        bmesh.ops.create_cone(bm, cap_ends=True, segments=10, radius1=0.38, radius2=0.38, depth=0.14)
        for v in bm.verts[start:]:
            y0, z0 = v.co.y, v.co.z
            v.co.y, v.co.z = z0, y0
            v.co += Vector((x, y, 0.38))
    paint(bm, lambda f: PAL["wood2"] if abs(f.normal.y) > 0.6 else PAL["wood"])
    finish(obj, bm, triangulate=True)
    return obj


def make_bench(name, c):
    obj, bm = new_obj(name, c)
    box(bm, 1.5, 0.42, 0.1, oz=0.48)
    box(bm, 1.5, 0.1, 0.45, oy=-0.2, oz=0.75)
    box(bm, 0.1, 0.4, 0.48, ox=-0.6, oz=0.24)
    box(bm, 0.1, 0.4, 0.48, ox=0.6, oz=0.24)
    solid(bm, PAL["wood"])
    finish(obj, bm)
    return obj


def make_sign(name, c):
    obj, bm = new_obj(name, c)
    box(bm, 0.12, 0.12, 2.3, oz=1.15)
    box(bm, 1.0, 0.1, 0.45, ox=0.4, oz=1.8)
    paint(bm, lambda f: PAL["wood"] if abs(sum(v.co.x for v in f.verts)/len(f.verts)) > 0.15 else PAL["wood2"])
    finish(obj, bm)
    return obj


def make_ruin(name, c, h=2.6):
    obj, bm = new_obj(name, c)
    box(bm, 1.0, 1.0, 0.3, oz=0.15)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.38, radius2=0.32, depth=h)
    for v in bm.verts:
        if abs(v.co.x) < 0.5 and abs(v.co.y) < 0.5 and v.co.z > 0.2:
            v.co.z += h / 2
            n = noise.noise(Vector((v.co.x * 3, v.co.y * 3, v.co.z)))
            v.co += Vector((n, n, 0)) * 0.06
            if v.co.z > h * 0.7:
                v.co.z -= abs(noise.noise(Vector((v.co.x, v.co.y, 2)))) * h * 0.28
    paint(bm, lambda f: PAL["moss"] if f.normal.z > 0.7 else PAL["stone3"])
    finish(obj, bm, triangulate=True)
    return obj


def make_path(name, c, size=0.75):
    obj, bm = new_obj(name, c)
    bmesh.ops.create_circle(bm, cap_ends=True, segments=7, radius=size)
    ret = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    verts = [e for e in ret["geom"] if isinstance(e, bmesh.types.BMVert)]
    for v in verts:
        v.co.z -= 0.12
    for v in bm.verts:
        n = noise.noise(Vector((v.co.x * 4, v.co.y * 4, 0)))
        if v.co.z > -0.05:
            v.co.xy *= 0.88 + n * 0.18
    paint(bm, lambda f: PAL["moss"] if f.normal.z > 0.8 and rng.random() > 0.65 else PAL["stone"])
    finish(obj, bm, triangulate=True)
    return obj


def make_grass(name, c):
    obj, bm = new_obj(name, c)
    for i in range(9):
        ang = i / 9 * math.tau + rng.random() * 0.2
        h = 0.35 + rng.random() * 0.4
        start = len(bm.verts)
        bmesh.ops.create_cone(bm, cap_ends=True, segments=3, radius1=0.035, radius2=0.004, depth=h)
        rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(0.2 + rng.random() * 0.25, 4, "X")
        for v in bm.verts[start:]:
            v.co = rot @ v.co
            v.co.z += h / 2
            v.co.x += math.cos(ang) * 0.08
            v.co.y += math.sin(ang) * 0.08
    solid(bm, PAL["grass"])
    finish(obj, bm, triangulate=True)
    return obj


def make_flower(name, c, petal):
    obj, bm = new_obj(name, c)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.02, radius2=0.015, depth=0.38)
    for v in bm.verts:
        v.co.z += 0.19
    start = len(bm.verts)
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=0.11)
    for v in bm.verts[start:]:
        v.co.z = v.co.z * 0.4 + 0.42
    paint(bm, lambda f: petal if sum(v.co.z for v in f.verts)/len(f.verts) > 0.3 else PAL["grass"])
    finish(obj, bm, triangulate=True)
    return obj


def make_roof(name, c, style="tile"):
    obj, bm = new_obj(name, c)
    w, d, rise = 4.4, 3.8, 1.35
    coords = [
        Vector((-w/2, -d/2, 0)), Vector((w/2, -d/2, 0)), Vector((w/2, d/2, 0)), Vector((-w/2, d/2, 0)),
        Vector((0, -d/2, rise)), Vector((0, d/2, rise)),
    ]
    vs = [bm.verts.new(p) for p in coords]
    bm.verts.ensure_lookup_table()
    for ids in ((0, 1, 4), (3, 2, 5), (0, 4, 5, 3), (1, 2, 5, 4), (0, 3, 2, 1)):
        bm.faces.new([vs[i] for i in ids])
    color = {"tile": PAL["roof"], "thatch": PAL["thatch"], "slate": PAL["slate"]}[style]
    solid(bm, color)
    finish(obj, bm, triangulate=True)
    return obj


def make_pillar(name, c, brick=False):
    obj, bm = new_obj(name, c)
    box(bm, 0.55, 0.55, 2.9, oz=1.45)
    box(bm, 0.7, 0.7, 0.18, oz=0.09)
    box(bm, 0.68, 0.68, 0.14, oz=2.95)
    solid(bm, PAL["brick"] if brick else PAL["stone"])
    finish(obj, bm)
    return obj


# -------- build --------
clear_all()
root = bpy.context.scene.collection
mat_vc()
cats = {n: coll(n, root) for n in [
    "01_Stones", "02_Rocks", "03_Trees", "04_Foliage", "05_Buildings",
    "06_ModularArch", "07_Props", "08_Ruins", "09_Paths", "10_NatureDetail", "PreviewLayout",
]}
created = []

for i in range(12):
    created.append(make_rock(f"STONE-{i:02d}", cats["01_Stones"], 0.18 + i * 0.05, kind=rng.choice(["round", "chunk", "slab"])).name)
for i in range(14):
    created.append(make_rock(f"ROCK-{i:02d}", cats["02_Rocks"], 0.7 + (i % 5) * 0.22, kind=["boulder", "slab", "chunk", "boulder", "round"][i % 5]).name)
for i, k in enumerate(["oak", "oak", "oak", "pine", "pine", "pine", "birch", "birch", "autumn", "autumn", "dead", "oak", "pine", "birch"]):
    created.append(make_tree(f"TREE-{k}-{i:02d}", cats["03_Trees"], k).name)
for i in range(10):
    created.append(make_bush(f"BUSH-{i:02d}", cats["04_Foliage"], autumn=i >= 7).name)

created += [
    make_house("BLD-hut-01", cats["05_Buildings"], 3.3, 3.0, 2.4, "hut").name,
    make_house("BLD-hut-02", cats["05_Buildings"], 3.8, 3.3, 2.5, "hut").name,
    make_house("BLD-cottage-01", cats["05_Buildings"], 4.6, 3.9, 2.7, "cottage").name,
    make_house("BLD-cottage-02", cats["05_Buildings"], 5.4, 4.3, 2.8, "cottage").name,
    make_house("BLD-barn-01", cats["05_Buildings"], 7.2, 4.4, 3.3, "barn").name,
    make_house("BLD-shed-01", cats["05_Buildings"], 2.7, 2.3, 2.2, "shed").name,
    make_house("BLD-inn-01", cats["05_Buildings"], 7.8, 5.2, 3.1, "inn").name,
    make_house("BLD-shop-01", cats["05_Buildings"], 5.2, 4.1, 2.8, "cottage").name,
    make_tower("BLD-tower-01", cats["05_Buildings"]).name,
    make_house("BLD-watch-01", cats["05_Buildings"], 3.0, 3.0, 3.4, "shed").name,
]

created.append(make_wall("ARCH-wall-01", cats["06_ModularArch"], 4.0, material="plaster").name)
created.append(make_wall("ARCH-wall-02", cats["06_ModularArch"], 2.0, material="brick").name)
created.append(make_wall("ARCH-wall-03", cats["06_ModularArch"], 4.0, material="wood").name)
created.append(make_wall("ARCH-wall-door-01", cats["06_ModularArch"], 4.0, door=True, material="plaster").name)
created.append(make_wall("ARCH-wall-door-02", cats["06_ModularArch"], 2.0, door=True, material="wood").name)
created.append(make_wall("ARCH-wall-window-01", cats["06_ModularArch"], 4.0, window=True, material="plaster").name)
created.append(make_wall("ARCH-wall-window-02", cats["06_ModularArch"], 2.0, window=True, material="brick").name)
created.append(make_wall("ARCH-wall-doorwindow-01", cats["06_ModularArch"], 4.0, door=True, window=True, material="plaster").name)
for i in range(4):
    created.append(make_pillar(f"ARCH-pillar-{i:02d}", cats["06_ModularArch"], brick=i % 2 == 1).name)
created.append(make_roof("ARCH-roof-tile-01", cats["06_ModularArch"], "tile").name)
created.append(make_roof("ARCH-roof-thatch-01", cats["06_ModularArch"], "thatch").name)
created.append(make_roof("ARCH-roof-slate-01", cats["06_ModularArch"], "slate").name)

for i in range(4):
    created.append(make_fence(f"PROP-fence-{i:02d}", cats["07_Props"], 2.0 + i * 0.5).name)
for i in range(4):
    created.append(make_crate(f"PROP-crate-{i:02d}", cats["07_Props"], 0.55 + i * 0.12).name)
for i in range(3):
    created.append(make_barrel(f"PROP-barrel-{i:02d}", cats["07_Props"]).name)
for i in range(3):
    created.append(make_lamp(f"PROP-lamp-{i:02d}", cats["07_Props"], 2.9 + i * 0.3).name)
created.append(make_well("PROP-well-01", cats["07_Props"]).name)
created.append(make_bridge("PROP-bridge-01", cats["07_Props"], 5.5).name)
created.append(make_bridge("PROP-bridge-02", cats["07_Props"], 7.5, 2.3).name)
created.append(make_cart("PROP-cart-01", cats["07_Props"]).name)
created.append(make_sign("PROP-sign-01", cats["07_Props"]).name)
created.append(make_bench("PROP-bench-01", cats["07_Props"]).name)

for i in range(10):
    created.append(make_ruin(f"RUIN-pillar-{i:02d}", cats["08_Ruins"], 1.8 + i * 0.25).name)
for i in range(12):
    created.append(make_path(f"PATH-stone-{i:02d}", cats["09_Paths"], 0.45 + (i % 5) * 0.1).name)
for i in range(8):
    created.append(make_grass(f"DET-grass-{i:02d}", cats["10_NatureDetail"]).name)
for i, p in enumerate([PAL["flower"], PAL["flower2"], PAL["flower"], PAL["flower2"], PAL["flower"], PAL["flower2"]]):
    created.append(make_flower(f"DET-flower-{i:02d}", cats["10_NatureDetail"], p).name)

# preview layout with more spacing for buildings/trees
preview = cats["PreviewLayout"]
order = list(cats.keys())[:-1]
row_y = 0.0
for cat_name in order:
    objs = [o for o in sorted(cats[cat_name].objects, key=lambda o: o.name) if o.name in created]
    sx = 9.0 if "Build" in cat_name else (7.0 if "Tree" in cat_name or "Arch" in cat_name else 4.5)
    rg = 11.0 if "Build" in cat_name or "Tree" in cat_name else 7.5
    maxc = 7 if "Build" in cat_name else 10
    col = 0
    for obj in objs:
        dup = obj.copy()
        dup.data = obj.data
        dup.name = f"PREV-{obj.name}"
        preview.objects.link(dup)
        dup.location = (col * sx, -row_y, 0)
        obj.hide_viewport = True
        obj.hide_render = True
        col += 1
        if col >= maxc:
            col = 0
            row_y += rg
    row_y += rg + 2.0

# lights/camera/world
sun = bpy.data.lights.new("Sun", "SUN"); sun.energy = 4.5
so = bpy.data.objects.new("Sun", sun); root.objects.link(so)
so.rotation_euler = (math.radians(50), math.radians(20), math.radians(35))
fill = bpy.data.lights.new("Fill", "AREA"); fill.energy = 500; fill.size = 90
fo = bpy.data.objects.new("Fill", fill); root.objects.link(fo); fo.location = (50, -40, 40)
rim = bpy.data.lights.new("Rim", "AREA"); rim.energy = 200; rim.size = 40
ro = bpy.data.objects.new("Rim", rim); root.objects.link(ro); ro.location = (-30, 20, 25)

world = bpy.data.worlds.new("World")
bpy.context.scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (0.62, 0.72, 0.82, 1)
bg.inputs[1].default_value = 0.7

prevs = [o for o in preview.objects if o.name.startswith("PREV-")]
xs = [o.location.x for o in prevs]; ys = [o.location.y for o in prevs]
cx, cy = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2
span = max(max(xs)-min(xs), max(ys)-min(ys), 40)
camd = bpy.data.cameras.new("PreviewCamera"); camd.lens = 40
cam = bpy.data.objects.new("PreviewCamera", camd); root.objects.link(cam)
cam.location = Vector((cx + span*0.15, cy - span*1.0, max(span*0.6, 50)))
cam.rotation_euler = (Vector((cx, cy, 2)) - cam.location).to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1440
scene.view_settings.view_transform = "Standard"
scene.render.filepath = os.path.join(EXPORT, "preview_contact_sheet")
bpy.ops.wm.save_as_mainfile(filepath=BLEND)
with open(os.path.join(EXPORT, "manifest.txt"), "w", encoding="utf-8") as f:
    f.write(f"v3 production\ncount={len(created)}\n")
    for n in created:
        f.write(n + "\n")
