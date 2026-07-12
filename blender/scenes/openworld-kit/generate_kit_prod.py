"""
Production indie low-poly openworld kit generator.

Art direction: stylized village / wilderness kitbash set.
- Limited warm palette + vertex color variation
- Grounded origins, ~1m modular architecture grid
- Readable silhouettes over noise blobs
"""
from __future__ import annotations

import math
import os
import random
from dataclasses import dataclass

import bmesh
import bpy
from mathutils import Matrix, Vector, noise

BLEND = r"c:\projects\cursor-playground\blender\scenes\openworld-kit\openworld-kit.blend"
EXPORT = r"c:\projects\cursor-playground\blender\exports\openworld-kit"
QA_DIR = os.path.join(EXPORT, "qa")
os.makedirs(EXPORT, exist_ok=True)
os.makedirs(QA_DIR, exist_ok=True)
os.makedirs(os.path.dirname(BLEND), exist_ok=True)

SEED = 20260712
rng = random.Random(SEED)

# --- Palette (sRGB-ish) ---
PAL = {
    "stone_a": (0.52, 0.50, 0.47),
    "stone_b": (0.40, 0.39, 0.38),
    "stone_c": (0.62, 0.58, 0.52),
    "moss": (0.34, 0.46, 0.28),
    "dirt": (0.38, 0.28, 0.18),
    "sand": (0.70, 0.60, 0.42),
    "bark": (0.30, 0.18, 0.10),
    "bark_light": (0.45, 0.32, 0.20),
    "leaf": (0.28, 0.55, 0.22),
    "leaf_dark": (0.16, 0.38, 0.16),
    "leaf_yellow": (0.72, 0.58, 0.18),
    "leaf_autumn": (0.72, 0.32, 0.10),
    "pine": (0.14, 0.32, 0.18),
    "plaster": (0.78, 0.74, 0.66),
    "plaster_warm": (0.82, 0.72, 0.58),
    "brick": (0.58, 0.30, 0.22),
    "wood": (0.46, 0.30, 0.16),
    "wood_dark": (0.28, 0.18, 0.10),
    "thatch": (0.55, 0.45, 0.22),
    "roof_tile": (0.42, 0.18, 0.14),
    "roof_slate": (0.28, 0.32, 0.36),
    "metal": (0.42, 0.44, 0.46),
    "glass": (0.55, 0.72, 0.78),
    "grass": (0.30, 0.52, 0.20),
    "flower_r": (0.78, 0.22, 0.28),
    "flower_y": (0.90, 0.75, 0.18),
    "flower_w": (0.92, 0.92, 0.88),
}


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.curves, bpy.data.lights, bpy.data.cameras):
        for item in list(block):
            block.remove(item)
    for coll in list(bpy.data.collections):
        if coll.name not in {"Collection", "Scene Collection"}:
            try:
                bpy.data.collections.remove(coll)
            except Exception:
                pass


def ensure_coll(name: str, parent: bpy.types.Collection) -> bpy.types.Collection:
    coll = bpy.data.collections.get(name)
    if coll is None:
        coll = bpy.data.collections.new(name)
        parent.children.link(coll)
    return coll


def ensure_vc_material() -> bpy.types.Material:
    name = "M_VertexColor"
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nodes, links = nt.nodes, nt.links
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    attr = nodes.new("ShaderNodeVertexColor")
    attr.layer_name = "Col"
    bsdf.inputs["Roughness"].default_value = 0.82
    links.new(attr.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return m


def lerp(a, b, t):
    return tuple(a[i] * (1 - t) + b[i] * t for i in range(3))


def jitter_color(c, amount=0.06):
    return tuple(max(0, min(1, c[i] + (rng.random() - 0.5) * 2 * amount)) for i in range(3))


def new_bm_obj(name: str, coll: bpy.types.Collection) -> tuple[bpy.types.Object, bmesh.types.BMesh]:
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    coll.objects.link(obj)
    obj["usage"] = "openworld_modular_prop"
    obj["kit_category"] = coll.name
    return obj, bmesh.new()


def paint_faces(bm: bmesh.types.BMesh, color_by_face) -> None:
    """color_by_face: callable(face) -> rgb tuple"""
    color_layer = bm.loops.layers.color.get("Col") or bm.loops.layers.color.new("Col")
    for f in bm.faces:
        col = (*color_by_face(f), 1.0)
        for loop in f.loops:
            # slight per-loop jitter for faceted look
            j = jitter_color(col[:3], 0.025)
            loop[color_layer] = (*j, 1.0)


def paint_all(bm: bmesh.types.BMesh, color) -> None:
    paint_faces(bm, lambda f: color)


def finish(obj: bpy.types.Object, bm: bmesh.types.BMesh, triangulate=False) -> None:
    if triangulate:
        bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()
    mat = ensure_vc_material()
    if mat.name not in obj.data.materials:
        obj.data.materials.append(mat)
    # origin to bottom center
    ground_origin(obj)


def ground_origin(obj: bpy.types.Object) -> None:
    bpy.context.view_layer.update()
    # compute local bbox
    deps = bpy.context.evaluated_depsgraph_get()
    eo = obj.evaluated_get(deps)
    coords = [obj.matrix_world.inverted() @ (obj.matrix_world @ Vector(c)) for c in obj.bound_box]
    # simpler: mesh local
    xs = [v.co.x for v in obj.data.vertices]
    ys = [v.co.y for v in obj.data.vertices]
    zs = [v.co.z for v in obj.data.vertices]
    if not zs:
        return
    cx, cy, zmin = (min(xs) + max(xs)) * 0.5, (min(ys) + max(ys)) * 0.5, min(zs)
    for v in obj.data.vertices:
        v.co.x -= cx
        v.co.y -= cy
        v.co.z -= zmin
    obj.data.update()
    obj.location = (0, 0, 0)


def add_box(bm, sx, sy, sz, ox=0, oy=0, oz=0):
    """Create box centered; oz is center z."""
    verts = [
        Vector((ox + x * sx * 0.5, oy + y * sy * 0.5, oz + z * sz * 0.5))
        for z in (-1, 1)
        for y in (-1, 1)
        for x in (-1, 1)
    ]
    # order for cube faces is messy; use bmesh cube + transform
    geom = bmesh.ops.create_cube(bm, size=1.0)["verts"]
    for v in geom:
        v.co.x = ox + v.co.x * sx
        v.co.y = oy + v.co.y * sy
        v.co.z = oz + v.co.z * sz
    return geom


def rock_asset(name, coll, size, style="boulder"):
    obj, bm = new_bm_obj(name, coll)
    subdiv = 2 if size > 0.8 else 1
    bmesh.ops.create_icosphere(bm, subdivisions=subdiv, radius=size)
    seed = rng.random() * 50
    sx, sy, sz = 0.75 + rng.random() * 0.7, 0.7 + rng.random() * 0.7, 0.45 + rng.random() * 0.7
    if style == "slab":
        sx, sy, sz = 1.4 + rng.random(), 0.9 + rng.random() * 0.5, 0.28 + rng.random() * 0.2
    elif style == "spike":
        sx, sy, sz = 0.55, 0.55, 1.3 + rng.random() * 0.6
    elif style == "flat":
        sx, sy, sz = 1.1, 1.0, 0.35
    for v in bm.verts:
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz
        n1 = noise.noise(Vector((v.co.x * 1.8 + seed, v.co.y * 1.8, v.co.z * 1.8)))
        n2 = noise.noise(Vector((v.co.x * 4.5 + seed, v.co.y * 4.5, v.co.z * 3.0)))
        v.co += v.normal * (n1 * size * 0.22 + n2 * size * 0.08)
    # flatten underside
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        if v.co.z < zmin + size * 0.35:
            v.co.z = zmin + (v.co.z - zmin) * 0.15
    # color by height / slope
    bm.normal_update()
    base = PAL["stone_a"] if style != "slab" else PAL["stone_c"]
    moss = PAL["moss"]
    dirt = PAL["dirt"]

    def col(f):
        n = f.normal
        h = sum(v.co.z for v in f.verts) / 3
        c = base
        if n.z < 0.35:
            c = lerp(base, dirt, 0.35)
        if n.z > 0.75 and h > size * 0.2:
            c = lerp(c, moss, 0.45 if rng.random() > 0.4 else 0.15)
        if style == "spike":
            c = lerp(PAL["stone_b"], PAL["stone_c"], 0.3)
        return jitter_color(c, 0.04)

    paint_faces(bm, col)
    finish(obj, bm, triangulate=True)
    return obj


def stone_pebble(name, coll, r):
    return rock_asset(name, coll, r, style=rng.choice(["flat", "boulder", "slab"]))


def trunk_mesh(bm, height, r0, r1, segs=8):
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segs, radius1=r0, radius2=r1, depth=height)
    for v in bm.verts:
        v.co.z += height * 0.5
        # bark wobble
        a = math.atan2(v.co.y, v.co.x)
        v.co.x += math.cos(a * 3) * r0 * 0.06
        v.co.y += math.sin(a * 2) * r0 * 0.06


def canopy_clump(bm, center: Vector, radius: float, squash=0.75):
    start = len(bm.verts)
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=radius)
    new_verts = bm.verts[start:]
    for v in new_verts:
        v.co.z *= squash
        n = noise.noise(v.co * 2.2 + center)
        v.co *= 1.0 + n * 0.18
        v.co += center


def tree_asset(name, coll, kind="oak"):
    obj, bm = new_bm_obj(name, coll)
    if kind == "pine":
        h, r0, r1 = 5.5 + rng.random() * 2.0, 0.18, 0.08
        trunk_mesh(bm, h * 0.85, r0, r1, 7)
        # layered cones
        for i, t in enumerate((0.45, 0.62, 0.78)):
            rad = 1.5 - i * 0.35
            depth = 1.6 - i * 0.2
            start = len(bm.verts)
            bmesh.ops.create_cone(bm, cap_ends=True, segments=7, radius1=rad, radius2=0.05, depth=depth)
            for v in bm.verts[start:]:
                v.co.z += h * t
        leaf_c, bark_c = PAL["pine"], PAL["bark"]
    elif kind == "dead":
        h, r0, r1 = 3.8, 0.16, 0.07
        trunk_mesh(bm, h, r0, r1, 6)
        # branches as thin boxes
        for ang, zh, length in ((0.4, 0.55, 1.2), (2.2, 0.7, 1.0), (4.0, 0.62, 0.9)):
            start = len(bm.verts)
            bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.06, radius2=0.02, depth=length)
            rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(math.radians(55), 4, "Y")
            for v in bm.verts[start:]:
                v.co = rot @ v.co
                v.co.z += h * zh
        leaf_c, bark_c = PAL["stone_b"], PAL["bark_light"]
    else:
        # oak / birch / autumn
        h = {"oak": 4.8, "birch": 5.2, "autumn": 4.5, "bushy": 3.4}.get(kind, 4.5)
        h += rng.random() * 0.8
        r0 = 0.22 if kind != "birch" else 0.12
        trunk_mesh(bm, h * 0.7, r0, r0 * 0.55, 8)
        clumps = {
            "oak": [(0, 0, h * 0.78, 1.5), (0.7, 0.2, h * 0.7, 1.1), (-0.55, -0.3, h * 0.72, 1.0)],
            "birch": [(0, 0, h * 0.82, 1.1), (0.45, 0.1, h * 0.72, 0.85), (-0.4, 0.2, h * 0.74, 0.8)],
            "autumn": [(0, 0, h * 0.76, 1.4), (0.6, -0.2, h * 0.68, 1.0), (-0.5, 0.25, h * 0.7, 0.95)],
            "bushy": [(0, 0, h * 0.7, 1.6), (0.5, 0.4, h * 0.55, 1.1), (-0.45, -0.35, h * 0.58, 1.15), (0.2, -0.5, h * 0.62, 1.0)],
        }.get(kind, [(0, 0, h * 0.75, 1.3)])
        for x, y, z, rad in clumps:
            canopy_clump(bm, Vector((x, y, z)), rad, squash=0.7 + rng.random() * 0.15)
        leaf_c = {
            "oak": PAL["leaf"],
            "birch": PAL["leaf_yellow"],
            "autumn": PAL["leaf_autumn"],
            "bushy": PAL["leaf_dark"],
        }.get(kind, PAL["leaf"])
        bark_c = PAL["bark_light"] if kind == "birch" else PAL["bark"]

    bm.normal_update()
    z_trunk = max(v.co.z for v in bm.verts) * 0.35

    def col(f):
        cz = sum(v.co.z for v in f.verts) / len(f.verts)
        # canopy faces tend to be higher and more horizontal-ish
        if cz > z_trunk and f.normal.z > -0.2 and kind != "dead":
            return jitter_color(lerp(leaf_c, PAL["leaf_dark"], 0.2 if f.normal.z < 0.3 else 0.0), 0.05)
        return jitter_color(bark_c, 0.04)

    paint_faces(bm, col)
    finish(obj, bm, triangulate=True)
    return obj


def bush_asset(name, coll, radius=0.7, autumn=False):
    obj, bm = new_bm_obj(name, coll)
    for c in (
        Vector((0, 0, radius * 0.55)),
        Vector((radius * 0.45, 0.1, radius * 0.4)),
        Vector((-radius * 0.4, -0.15, radius * 0.42)),
    ):
        canopy_clump(bm, c, radius * (0.55 + rng.random() * 0.2), squash=0.65)
    base = PAL["leaf_autumn"] if autumn else PAL["leaf"]
    paint_faces(bm, lambda f: jitter_color(lerp(base, PAL["leaf_dark"], 0.25 if f.normal.z < 0.2 else 0.0), 0.05))
    finish(obj, bm, triangulate=True)
    return obj


def grass_tuft(name, coll, blades=7):
    obj, bm = new_bm_obj(name, coll)
    for i in range(blades):
        ang = i / blades * math.pi * 2 + rng.random() * 0.3
        lean = 0.15 + rng.random() * 0.25
        h = 0.35 + rng.random() * 0.35
        w = 0.04 + rng.random() * 0.03
        # simple blade quad extruded as thin box
        start = len(bm.verts)
        bmesh.ops.create_cone(bm, cap_ends=True, segments=3, radius1=w, radius2=0.005, depth=h)
        rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(lean, 4, "X")
        for v in bm.verts[start:]:
            v.co = rot @ v.co
            v.co.z += h * 0.5
            v.co.x += math.cos(ang) * 0.05
            v.co.y += math.sin(ang) * 0.05
    paint_all(bm, PAL["grass"])
    finish(obj, bm, triangulate=True)
    return obj


def flower_asset(name, coll, petal):
    obj, bm = new_bm_obj(name, coll)
    # stem
    start = len(bm.verts)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.02, radius2=0.015, depth=0.35)
    for v in bm.verts[start:]:
        v.co.z += 0.18
    # petals as small icosphere
    canopy_clump(bm, Vector((0, 0, 0.4)), 0.12, squash=0.45)
    paint_faces(bm, lambda f: PAL["grass"] if sum(v.co.z for v in f.verts) / 3 < 0.32 else petal)
    finish(obj, bm, triangulate=True)
    return obj


def wall_panel(name, coll, length=2.0, height=2.6, thick=0.28, material="plaster", door=False, window=False):
    obj, bm = new_bm_obj(name, coll)
    # main wall as solid then we build around openings
    if not door and not window:
        add_box(bm, length, thick, height, oz=height * 0.5)
    elif door and not window:
        # left / right / lintel
        door_w, door_h = 0.9, 2.0
        side = (length - door_w) * 0.5
        add_box(bm, side, thick, height, ox=-(door_w * 0.5 + side * 0.5), oz=height * 0.5)
        add_box(bm, side, thick, height, ox=(door_w * 0.5 + side * 0.5), oz=height * 0.5)
        add_box(bm, door_w, thick, height - door_h, oz=door_h + (height - door_h) * 0.5)
        # door fill slightly inset darker
        add_box(bm, door_w * 0.92, thick * 0.4, door_h * 0.95, oy=-thick * 0.15, oz=door_h * 0.48)
    elif window and not door:
        win_w, win_h, win_z = 0.8, 0.9, 1.35
        # full wall first then... construct frame pieces
        add_box(bm, length, thick, win_z - win_h * 0.5, oz=(win_z - win_h * 0.5) * 0.5)  # below
        top_h = height - (win_z + win_h * 0.5)
        add_box(bm, length, thick, top_h, oz=win_z + win_h * 0.5 + top_h * 0.5)
        side = (length - win_w) * 0.5
        add_box(bm, side, thick, win_h, ox=-(win_w * 0.5 + side * 0.5), oz=win_z)
        add_box(bm, side, thick, win_h, ox=(win_w * 0.5 + side * 0.5), oz=win_z)
        # glass pane
        add_box(bm, win_w * 0.85, thick * 0.25, win_h * 0.85, oy=-thick * 0.1, oz=win_z)
    else:
        # door + window
        door_w, door_h = 0.85, 2.0
        add_box(bm, 0.45, thick, height, ox=-length * 0.5 + 0.225, oz=height * 0.5)
        add_box(bm, length - door_w - 0.45, thick, height, ox=length * 0.5 - (length - door_w - 0.45) * 0.5, oz=height * 0.5)
        add_box(bm, door_w, thick, height - door_h, ox=-length * 0.5 + 0.45 + door_w * 0.5, oz=door_h + (height - door_h) * 0.5)
        add_box(bm, door_w * 0.9, thick * 0.35, door_h * 0.95, ox=-length * 0.5 + 0.45 + door_w * 0.5, oy=-thick * 0.12, oz=door_h * 0.48)
        add_box(bm, 0.7, thick * 0.2, 0.7, ox=length * 0.25, oy=-thick * 0.15, oz=1.5)

    base = {"plaster": PAL["plaster"], "brick": PAL["brick"], "wood": PAL["wood"]}.get(material, PAL["plaster"])

    def col(f):
        n = abs(f.normal.y)
        c = base
        # door-ish darker wood
        ctr = sum((v.co for v in f.verts), Vector()) / len(f.verts)
        if ctr.z < 2.05 and abs(ctr.y) > thick * 0.05 and abs(f.normal.y) > 0.7 and door:
            if abs(ctr.x) < 0.6 or (door and window and ctr.x < 0):
                c = PAL["wood_dark"]
        # glass
        if f.normal.length and abs(f.normal.y) > 0.8 and 1.0 < ctr.z < 1.9 and window:
            if abs(ctr.x) < length * 0.35:
                c = PAL["glass"]
        # top edge moss
        if f.normal.z > 0.8:
            c = lerp(c, PAL["moss"], 0.25)
        return jitter_color(c, 0.03)

    paint_faces(bm, col)
    finish(obj, bm)
    return obj


def wall_pillar(name, coll, height=2.8, material="stone"):
    obj, bm = new_bm_obj(name, coll)
    add_box(bm, 0.5, 0.5, height, oz=height * 0.5)
    # cap
    add_box(bm, 0.62, 0.62, 0.12, oz=height + 0.06)
    base = PAL["stone_a"] if material == "stone" else PAL["brick"]
    paint_faces(bm, lambda f: jitter_color(lerp(base, PAL["moss"], 0.3 if f.normal.z > 0.8 else 0.0), 0.04))
    finish(obj, bm)
    return obj


def roof_gable(name, coll, length=4.0, depth=3.5, rise=1.3, style="tile"):
    obj, bm = new_bm_obj(name, coll)
    # two roof slopes as boxes rotated approx via verts
    # Create a prism: 6 verts
    hw, hd, hr = length * 0.5, depth * 0.5, rise
    coords = [
        Vector((-hw, -hd, 0)),
        Vector((hw, -hd, 0)),
        Vector((hw, hd, 0)),
        Vector((-hw, hd, 0)),
        Vector((0, -hd, hr)),
        Vector((0, hd, hr)),
    ]
    vs = [bm.verts.new(c) for c in coords]
    bm.verts.ensure_lookup_table()
    faces = [
        (0, 1, 4),
        (3, 2, 5),
        (0, 4, 5, 3),
        (1, 2, 5, 4),
        (0, 3, 2, 1),
    ]
    for f in faces:
        bm.faces.new([vs[i] for i in f])
    # thickness: solidify-ish by extruding down slightly - skip, visual plane ok with thickness via second shell
    # Add underside offset
    color = PAL["roof_tile"] if style == "tile" else (PAL["thatch"] if style == "thatch" else PAL["roof_slate"])
    paint_all(bm, color)
    finish(obj, bm, triangulate=True)
    return obj


def house_complete(name, coll, footprint=(4.0, 3.5), wall_h=2.6, style="cottage"):
    """Combined house as single mesh for kit convenience."""
    obj, bm = new_bm_obj(name, coll)
    w, d = footprint
    # walls
    thick = 0.28
    # floor
    add_box(bm, w, d, 0.12, oz=0.06)
    # four walls with front door
    # front ( -Y )
    door_w, door_h = 0.9, 2.0
    side = (w - door_w) * 0.5
    add_box(bm, side, thick, wall_h, ox=-(door_w * 0.5 + side * 0.5), oy=-d * 0.5 + thick * 0.5, oz=wall_h * 0.5)
    add_box(bm, side, thick, wall_h, ox=(door_w * 0.5 + side * 0.5), oy=-d * 0.5 + thick * 0.5, oz=wall_h * 0.5)
    add_box(bm, door_w, thick, wall_h - door_h, oy=-d * 0.5 + thick * 0.5, oz=door_h + (wall_h - door_h) * 0.5)
    add_box(bm, door_w * 0.9, thick * 0.35, door_h * 0.92, oy=-d * 0.5 + thick * 0.2, oz=door_h * 0.46)
    # back
    add_box(bm, w, thick, wall_h, oy=d * 0.5 - thick * 0.5, oz=wall_h * 0.5)
    # sides
    add_box(bm, thick, d - thick * 2, wall_h, ox=-w * 0.5 + thick * 0.5, oz=wall_h * 0.5)
    add_box(bm, thick, d - thick * 2, wall_h, ox=w * 0.5 - thick * 0.5, oz=wall_h * 0.5)
    # windows on sides
    add_box(bm, thick * 0.3, 0.7, 0.7, ox=-w * 0.5 - 0.02, oz=1.4)
    add_box(bm, thick * 0.3, 0.7, 0.7, ox=w * 0.5 + 0.02, oz=1.4)
    # roof prism
    rise = 1.35 if style != "barn" else 1.8
    hw, hd = w * 0.55, d * 0.55
    coords = [
        Vector((-hw, -hd, wall_h)),
        Vector((hw, -hd, wall_h)),
        Vector((hw, hd, wall_h)),
        Vector((-hw, hd, wall_h)),
        Vector((0, -hd, wall_h + rise)),
        Vector((0, hd, wall_h + rise)),
    ]
    vs = [bm.verts.new(c) for c in coords]
    bm.verts.ensure_lookup_table()
    for f in [(0, 1, 4), (3, 2, 5), (0, 4, 5, 3), (1, 2, 5, 4)]:
        bm.faces.new([vs[i] for i in f])
    # chimney
    if style in ("cottage", "inn"):
        add_box(bm, 0.45, 0.45, 1.1, ox=w * 0.25, oy=d * 0.15, oz=wall_h + rise * 0.55)

    plaster = PAL["plaster_warm"] if style == "cottage" else (PAL["wood"] if style in ("hut", "barn", "shed") else PAL["plaster"])
    roof = PAL["thatch"] if style in ("hut", "barn", "shed") else (PAL["roof_tile"] if style != "tower" else PAL["roof_slate"])

    def col(f):
        ctr = sum((v.co for v in f.verts), Vector()) / len(f.verts)
        if ctr.z >= wall_h - 0.05 and abs(f.normal.z) < 0.85:
            return jitter_color(roof, 0.04)
        if f.normal.z > 0.7 and ctr.z > wall_h:
            return jitter_color(roof, 0.04)
        if abs(f.normal.y) > 0.8 and ctr.z < door_h and abs(ctr.x) < door_w * 0.55 and ctr.y < 0:
            return jitter_color(PAL["wood_dark"], 0.03)
        if abs(f.normal.x) > 0.9 and 1.0 < ctr.z < 1.9:
            return jitter_color(PAL["glass"], 0.02)
        if ctr.z < 0.15:
            return jitter_color(PAL["stone_b"], 0.03)
        if f.normal.z > 0.8 and ctr.z < wall_h:
            return jitter_color(lerp(plaster, PAL["moss"], 0.2), 0.03)
        return jitter_color(plaster, 0.035)

    paint_faces(bm, col)
    finish(obj, bm, triangulate=True)
    return obj


def tower_asset(name, coll):
    obj, bm = new_bm_obj(name, coll)
    add_box(bm, 2.4, 2.4, 6.0, oz=3.0)
    add_box(bm, 2.8, 2.8, 0.25, oz=6.1)
    # battlements
    for x in (-1.1, 0, 1.1):
        for y in (-1.1, 1.1):
            add_box(bm, 0.45, 0.35, 0.55, ox=x, oy=y, oz=6.45)
    for y in (-0.35, 0.35):
        for x in (-1.1, 1.1):
            add_box(bm, 0.35, 0.45, 0.55, ox=x, oy=y, oz=6.45)
    add_box(bm, 0.7, 0.15, 1.0, oy=-1.25, oz=2.2)  # door
    add_box(bm, 0.6, 0.12, 0.6, ox=1.25, oz=4.0)

    def col(f):
        ctr = sum((v.co for v in f.verts), Vector()) / len(f.verts)
        if abs(f.normal.y) > 0.9 and ctr.z < 2.8:
            return PAL["wood_dark"]
        if abs(f.normal.x) > 0.9 and 3.6 < ctr.z < 4.5:
            return PAL["glass"]
        if f.normal.z > 0.7:
            return lerp(PAL["stone_c"], PAL["moss"], 0.25)
        return jitter_color(PAL["stone_b"], 0.04)

    paint_faces(bm, col)
    finish(obj, bm)
    return obj


def fence_asset(name, coll, length=2.0):
    obj, bm = new_bm_obj(name, coll)
    h = 1.15
    add_box(bm, 0.1, 0.1, h, ox=-length * 0.5, oz=h * 0.5)
    add_box(bm, 0.1, 0.1, h, ox=length * 0.5, oz=h * 0.5)
    add_box(bm, length, 0.07, 0.08, oz=h * 0.35)
    add_box(bm, length, 0.07, 0.08, oz=h * 0.72)
    # diagonal brace
    start = len(bm.verts)
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts[start:]:
        v.co.x *= length * 0.9
        v.co.y *= 0.05
        v.co.z *= 0.07
        # rotate in XZ
        x, z = v.co.x, v.co.z
        a = math.radians(28)
        v.co.x = x * math.cos(a) - z * math.sin(a)
        v.co.z = x * math.sin(a) + z * math.cos(a) + h * 0.5
    paint_all(bm, PAL["wood"])
    finish(obj, bm)
    return obj


def crate_asset(name, coll, size=0.7):
    obj, bm = new_bm_obj(name, coll)
    add_box(bm, size, size, size, oz=size * 0.5)
    # edge straps
    add_box(bm, size * 1.02, size * 0.08, size * 0.08, oz=size * 0.15)
    add_box(bm, size * 1.02, size * 0.08, size * 0.08, oz=size * 0.85)
    paint_faces(bm, lambda f: PAL["wood_dark"] if abs(f.normal.z) < 0.2 and abs(sum(v.co.z for v in f.verts) / 3 - size * 0.15) < 0.2 or abs(sum(v.co.z for v in f.verts) / 3 - size * 0.85) < 0.2 else PAL["wood"])
    finish(obj, bm)
    return obj


def barrel_asset(name, coll):
    obj, bm = new_bm_obj(name, coll)
    h, r = 0.95, 0.38
    bmesh.ops.create_cone(bm, cap_ends=True, segments=10, radius1=r, radius2=r * 0.9, depth=h)
    for v in bm.verts:
        v.co.z += h * 0.5
        t = abs(v.co.z / h - 0.5)
        v.co.xy *= 1.0 + (0.5 - t) * 0.28
    # rings as thin toroidal approx boxes
    for z in (0.25, 0.7):
        add_box(bm, r * 2.15, r * 2.15, 0.05, oz=z)
    paint_faces(bm, lambda f: PAL["metal"] if abs(f.normal.z) < 0.4 and any(abs(v.co.z - z) < 0.08 for v in f.verts for z in (0.25, 0.7)) else PAL["wood"])
    finish(obj, bm, triangulate=True)
    return obj


def lamp_asset(name, coll, height=3.2):
    obj, bm = new_bm_obj(name, coll)
    add_box(bm, 0.35, 0.35, 0.12, oz=0.06)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.07, radius2=0.05, depth=height)
    for v in list(bm.verts)[-16:]:
        pass
    for v in bm.verts:
        if abs(v.co.x) < 0.2 and abs(v.co.y) < 0.2 and v.co.z < height:
            if v.co.z < 0.2:
                continue
    # fix pole verts - recreate cleanly
    bm.clear()
    add_box(bm, 0.4, 0.4, 0.1, oz=0.05)
    start = len(bm.verts)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.07, radius2=0.05, depth=height)
    for v in bm.verts[start:]:
        v.co.z += height * 0.5
    # lamp head
    add_box(bm, 0.35, 0.35, 0.45, oz=height + 0.1)
    canopy_clump(bm, Vector((0, 0, height + 0.1)), 0.16, squash=0.8)

    def col(f):
        ctr = sum((v.co for v in f.verts), Vector()) / len(f.verts)
        if ctr.z > height - 0.05:
            return PAL["glass"] if abs(f.normal.z) < 0.5 else PAL["metal"]
        return PAL["metal"]

    paint_faces(bm, col)
    finish(obj, bm, triangulate=True)
    return obj


def well_asset(name, coll):
    obj, bm = new_bm_obj(name, coll)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=0.95, radius2=0.95, depth=0.85)
    for v in bm.verts:
        v.co.z += 0.42
    # posts + roof
    add_box(bm, 0.12, 0.12, 1.4, ox=-0.7, oz=1.3)
    add_box(bm, 0.12, 0.12, 1.4, ox=0.7, oz=1.3)
    coords = [Vector((-1.0, -0.5, 2.0)), Vector((1.0, -0.5, 2.0)), Vector((1.0, 0.5, 2.0)), Vector((-1.0, 0.5, 2.0)), Vector((0, -0.5, 2.55)), Vector((0, 0.5, 2.55))]
    vs = [bm.verts.new(c) for c in coords]
    bm.verts.ensure_lookup_table()
    for f in [(0, 1, 4), (3, 2, 5), (0, 4, 5, 3), (1, 2, 5, 4)]:
        bm.faces.new([vs[i] for i in f])
    paint_faces(bm, lambda f: PAL["thatch"] if sum(v.co.z for v in f.verts) / len(f.verts) > 1.9 else (PAL["wood"] if abs(f.normal.x) > 0.8 else PAL["stone_a"]))
    finish(obj, bm, triangulate=True)
    return obj


def bridge_asset(name, coll, length=5.0, width=1.8):
    obj, bm = new_bm_obj(name, coll)
    add_box(bm, length, width, 0.18, oz=0.2)
    # planks visual ridges via thin boxes
    n = int(length / 0.45)
    for i in range(n):
        x = -length * 0.5 + 0.25 + i * 0.45
        add_box(bm, 0.08, width * 0.98, 0.04, ox=x, oz=0.31)
    # rails
    add_box(bm, length, 0.08, 0.08, oy=-width * 0.5, oz=0.85)
    add_box(bm, length, 0.08, 0.08, oy=width * 0.5, oz=0.85)
    for x in (-length * 0.45, 0, length * 0.45):
        add_box(bm, 0.08, 0.08, 0.75, ox=x, oy=-width * 0.5, oz=0.5)
        add_box(bm, 0.08, 0.08, 0.75, ox=x, oy=width * 0.5, oz=0.5)
    paint_all(bm, PAL["wood"])
    finish(obj, bm)
    return obj


def ruin_pillar(name, coll, height=2.8):
    obj, bm = new_bm_obj(name, coll)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.35, radius2=0.3, depth=height)
    for v in bm.verts:
        v.co.z += height * 0.5
        n = noise.noise(Vector((v.co.x * 3, v.co.y * 3, v.co.z)))
        v.co += Vector((n, n, 0)) * 0.07
        if v.co.z > height * 0.65:
            v.co.z -= abs(noise.noise(Vector((v.co.x, v.co.y, 1)))) * height * 0.3
    # base plinth
    add_box(bm, 0.9, 0.9, 0.25, oz=0.12)
    paint_faces(bm, lambda f: jitter_color(lerp(PAL["stone_c"], PAL["moss"], 0.4 if f.normal.z > 0.7 else 0.1), 0.04))
    finish(obj, bm, triangulate=True)
    return obj


def path_flagstone(name, coll, size=0.7):
    obj, bm = new_bm_obj(name, coll)
    segs = 6 + rng.randint(0, 2)
    bmesh.ops.create_circle(bm, cap_ends=True, segments=segs, radius=size)
    ret = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    verts = [e for e in ret["geom"] if isinstance(e, bmesh.types.BMVert)]
    for v in verts:
        v.co.z -= 0.1
    for v in bm.verts:
        n = noise.noise(Vector((v.co.x * 5, v.co.y * 5, 0.2)))
        if v.co.z > -0.05:
            v.co.x *= 0.85 + n * 0.2
            v.co.y *= 0.85 + n * 0.2
            v.co.z += abs(n) * 0.03
    paint_faces(bm, lambda f: jitter_color(lerp(PAL["stone_a"], PAL["moss"], 0.35 if f.normal.z > 0.8 and rng.random() > 0.6 else 0.05), 0.04))
    finish(obj, bm, triangulate=True)
    return obj


def cart_asset(name, coll):
    obj, bm = new_bm_obj(name, coll)
    add_box(bm, 1.8, 1.1, 0.55, oz=0.75)
    add_box(bm, 1.9, 0.12, 0.45, oy=-0.55, oz=0.9)
    add_box(bm, 1.9, 0.12, 0.45, oy=0.55, oz=0.9)
    # wheels
    for x, y in ((-0.6, -0.7), (0.6, -0.7), (-0.6, 0.7), (0.6, 0.7)):
        start = len(bm.verts)
        bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.35, radius2=0.35, depth=0.12)
        for v in bm.verts[start:]:
            # orient wheel
            y0, z0 = v.co.y, v.co.z
            v.co.y = z0
            v.co.z = y0
            v.co += Vector((x, y, 0.35))
    paint_faces(bm, lambda f: PAL["wood_dark"] if abs(f.normal.x) < 0.3 and abs(f.normal.y) > 0.5 else PAL["wood"])
    finish(obj, bm, triangulate=True)
    return obj


def signpost_asset(name, coll):
    obj, bm = new_bm_obj(name, coll)
    add_box(bm, 0.1, 0.1, 2.2, oz=1.1)
    add_box(bm, 0.9, 0.08, 0.4, ox=0.35, oz=1.7)
    paint_faces(bm, lambda f: PAL["wood"] if abs(f.normal.z) < 0.5 and abs(sum(v.co.x for v in f.verts)/len(f.verts)) > 0.1 else PAL["wood_dark"])
    finish(obj, bm)
    return obj


def bench_asset(name, coll):
    obj, bm = new_bm_obj(name, coll)
    add_box(bm, 1.4, 0.4, 0.08, oz=0.45)
    add_box(bm, 1.4, 0.08, 0.4, oy=-0.18, oz=0.7)
    add_box(bm, 0.08, 0.35, 0.45, ox=-0.55, oz=0.22)
    add_box(bm, 0.08, 0.35, 0.45, ox=0.55, oz=0.22)
    paint_all(bm, PAL["wood"])
    finish(obj, bm)
    return obj


# ---------------- build world ----------------
clear_scene()
root = bpy.context.scene.collection
ensure_vc_material()

cats = {n: ensure_coll(n, root) for n in [
    "01_Stones", "02_Rocks", "03_Trees", "04_Foliage", "05_Buildings",
    "06_ModularArch", "07_Props", "08_Ruins", "09_Paths", "10_NatureDetail",
    "PreviewLayout",
]}

created: list[str] = []

# Stones
for i in range(14):
    created.append(stone_pebble(f"STONE-{i:02d}", cats["01_Stones"], 0.12 + i * 0.04 + rng.random() * 0.03).name)

# Rocks
styles = ["boulder", "slab", "spike", "flat", "boulder", "slab"]
for i in range(16):
    created.append(rock_asset(f"ROCK-{i:02d}", cats["02_Rocks"], 0.55 + (i % 6) * 0.2, style=styles[i % len(styles)]).name)

# Trees
for i, kind in enumerate(["oak", "oak", "oak", "pine", "pine", "pine", "birch", "birch", "autumn", "autumn", "dead", "bushy", "oak", "pine"]):
    created.append(tree_asset(f"TREE-{kind}-{i:02d}", cats["03_Trees"], kind=kind).name)

# Foliage
for i in range(10):
    created.append(bush_asset(f"BUSH-{i:02d}", cats["04_Foliage"], radius=0.55 + (i % 4) * 0.12, autumn=i >= 7).name)

# Buildings complete
created.append(house_complete("BLD-hut-01", cats["05_Buildings"], (3.2, 3.0), 2.3, "hut").name)
created.append(house_complete("BLD-hut-02", cats["05_Buildings"], (3.6, 3.2), 2.4, "hut").name)
created.append(house_complete("BLD-cottage-01", cats["05_Buildings"], (4.5, 3.8), 2.6, "cottage").name)
created.append(house_complete("BLD-cottage-02", cats["05_Buildings"], (5.2, 4.2), 2.7, "cottage").name)
created.append(house_complete("BLD-barn-01", cats["05_Buildings"], (7.0, 4.2), 3.2, "barn").name)
created.append(house_complete("BLD-shed-01", cats["05_Buildings"], (2.6, 2.2), 2.1, "shed").name)
created.append(house_complete("BLD-inn-01", cats["05_Buildings"], (7.5, 5.0), 3.0, "inn").name)
created.append(tower_asset("BLD-tower-01", cats["05_Buildings"]).name)
created.append(house_complete("BLD-shop-01", cats["05_Buildings"], (5.0, 4.0), 2.8, "cottage").name)
created.append(house_complete("BLD-watch-01", cats["05_Buildings"], (2.8, 2.8), 3.5, "shed").name)

# Modular architecture
for i, L in enumerate([2.0, 2.0, 4.0, 4.0]):
    created.append(wall_panel(f"ARCH-wall-{i:02d}", cats["06_ModularArch"], length=L, material=["plaster", "brick", "wood", "plaster"][i]).name)
created.append(wall_panel("ARCH-wall-door-01", cats["06_ModularArch"], 4.0, door=True, material="plaster").name)
created.append(wall_panel("ARCH-wall-door-02", cats["06_ModularArch"], 2.0, door=True, material="wood").name)
created.append(wall_panel("ARCH-wall-window-01", cats["06_ModularArch"], 4.0, window=True, material="plaster").name)
created.append(wall_panel("ARCH-wall-window-02", cats["06_ModularArch"], 2.0, window=True, material="brick").name)
created.append(wall_panel("ARCH-wall-doorwindow-01", cats["06_ModularArch"], 4.0, door=True, window=True, material="plaster").name)
for i in range(4):
    created.append(wall_pillar(f"ARCH-pillar-{i:02d}", cats["06_ModularArch"], material="stone" if i % 2 == 0 else "brick").name)
created.append(roof_gable("ARCH-roof-tile-01", cats["06_ModularArch"], 4.2, 3.6, 1.3, "tile").name)
created.append(roof_gable("ARCH-roof-thatch-01", cats["06_ModularArch"], 3.6, 3.2, 1.2, "thatch").name)
created.append(roof_gable("ARCH-roof-slate-01", cats["06_ModularArch"], 4.0, 3.4, 1.1, "slate").name)

# Props
for i in range(4):
    created.append(fence_asset(f"PROP-fence-{i:02d}", cats["07_Props"], length=2.0 + i * 0.5).name)
for i in range(4):
    created.append(crate_asset(f"PROP-crate-{i:02d}", cats["07_Props"], size=0.5 + i * 0.12).name)
for i in range(3):
    created.append(barrel_asset(f"PROP-barrel-{i:02d}", cats["07_Props"]).name)
for i in range(3):
    created.append(lamp_asset(f"PROP-lamp-{i:02d}", cats["07_Props"], height=2.8 + i * 0.35).name)
created.append(well_asset("PROP-well-01", cats["07_Props"]).name)
created.append(bridge_asset("PROP-bridge-01", cats["07_Props"], 5.0).name)
created.append(bridge_asset("PROP-bridge-02", cats["07_Props"], 7.0, 2.2).name)
created.append(cart_asset("PROP-cart-01", cats["07_Props"]).name)
created.append(signpost_asset("PROP-sign-01", cats["07_Props"]).name)
created.append(bench_asset("PROP-bench-01", cats["07_Props"]).name)

# Ruins
for i in range(10):
    created.append(ruin_pillar(f"RUIN-pillar-{i:02d}", cats["08_Ruins"], height=1.6 + i * 0.28).name)

# Paths
for i in range(12):
    created.append(path_flagstone(f"PATH-stone-{i:02d}", cats["09_Paths"], size=0.4 + (i % 5) * 0.1).name)

# Nature detail
for i in range(8):
    created.append(grass_tuft(f"DET-grass-{i:02d}", cats["10_NatureDetail"], blades=6 + i % 4).name)
for i, petal in enumerate([PAL["flower_r"], PAL["flower_y"], PAL["flower_w"], PAL["flower_r"], PAL["flower_y"], PAL["flower_w"]]):
    created.append(flower_asset(f"DET-flower-{i:02d}", cats["10_NatureDetail"], petal).name)

# Preview layout
preview = cats["PreviewLayout"]
order = [
    "01_Stones", "02_Rocks", "03_Trees", "04_Foliage", "05_Buildings",
    "06_ModularArch", "07_Props", "08_Ruins", "09_Paths", "10_NatureDetail",
]
row_y = 0.0
spacing_x = 5.5
row_gap = 9.0
for cat_name in order:
    objs = [o for o in sorted(cats[cat_name].objects, key=lambda o: o.name) if o.name in created]
    # adaptive spacing for larger buildings
    sx = 8.0 if "Build" in cat_name else (6.5 if "Tree" in cat_name or "Arch" in cat_name else spacing_x)
    col = 0
    max_cols = 8 if "Build" in cat_name else 10
    for obj in objs:
        dup = obj.copy()
        dup.data = obj.data
        dup.name = f"PREV-{obj.name}"
        preview.objects.link(dup)
        dup.location = (col * sx, -row_y, 0.0)
        obj.hide_viewport = True
        obj.hide_render = True
        obj.location = (-150, order.index(cat_name) * 5, 0)
        col += 1
        if col >= max_cols:
            col = 0
            row_y += row_gap
    row_y += row_gap + 3.0

# Lighting / world / camera
sun = bpy.data.lights.new("Sun", "SUN")
sun.energy = 4.0
sun_o = bpy.data.objects.new("Sun", sun)
root.objects.link(sun_o)
sun_o.rotation_euler = (math.radians(48), math.radians(15), math.radians(25))

fill = bpy.data.lights.new("Fill", "AREA")
fill.energy = 400
fill.size = 80
fill_o = bpy.data.objects.new("Fill", fill)
root.objects.link(fill_o)
fill_o.location = (40, -50, 35)

world = bpy.data.worlds.new("World") if not bpy.context.scene.world else bpy.context.scene.world
bpy.context.scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs[0].default_value = (0.55, 0.66, 0.78, 1.0)
    bg.inputs[1].default_value = 0.65

prevs = [o for o in preview.objects if o.name.startswith("PREV-")]
xs = [o.location.x for o in prevs]
ys = [o.location.y for o in prevs]
cx, cy = (min(xs) + max(xs)) * 0.5, (min(ys) + max(ys)) * 0.5
span = max(max(xs) - min(xs), max(ys) - min(ys), 30.0)

cam_d = bpy.data.cameras.new("PreviewCamera")
cam_d.lens = 40
cam = bpy.data.objects.new("PreviewCamera", cam_d)
root.objects.link(cam)
cam.location = Vector((cx + span * 0.2, cy - span * 1.05, max(span * 0.65, 45)))
cam.rotation_euler = (Vector((cx, cy, 2)) - cam.location).to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1440
scene.render.image_settings.file_format = "PNG"
scene.view_settings.view_transform = "Standard"
scene.render.filepath = os.path.join(EXPORT, "preview_contact_sheet")

bpy.ops.wm.save_as_mainfile(filepath=BLEND)

# write manifest
manifest = os.path.join(EXPORT, "manifest.txt")
with open(manifest, "w", encoding="utf-8") as f:
    f.write(f"openworld-kit production pass\ncount={len(created)}\n")
    for n in created:
        f.write(n + "\n")
