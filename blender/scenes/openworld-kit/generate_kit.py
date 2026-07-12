"""Modular open-world prop kit: rocks, trees, buildings, foliage, props."""
from __future__ import annotations

import math
import os
import random
from typing import Callable

import bmesh
import bpy
from mathutils import Euler, Vector, noise

BLEND = r"c:\projects\cursor-playground\blender\scenes\openworld-kit\openworld-kit.blend"
EXPORT = r"c:\projects\cursor-playground\blender\exports\openworld-kit"
os.makedirs(EXPORT, exist_ok=True)
os.makedirs(os.path.dirname(BLEND), exist_ok=True)

rng = random.Random(42)


def clear_scene() -> None:
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for block in list(bpy.data.meshes):
        bpy.data.meshes.remove(block)
    for block in list(bpy.data.materials):
        bpy.data.materials.remove(block)
    for block in list(bpy.data.curves):
        bpy.data.curves.remove(block)
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


def mat(name: str, color: tuple[float, float, float], rough: float = 0.8, metal: float = 0.0):
    m = bpy.data.materials.get(name)
    if m is None:
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        nodes = m.node_tree.nodes
        links = m.node_tree.links
        nodes.clear()
        out = nodes.new("ShaderNodeOutputMaterial")
        bsdf = nodes.new("ShaderNodeBsdfPrincipled")
        bsdf.inputs["Base Color"].default_value = (*color, 1.0)
        bsdf.inputs["Roughness"].default_value = rough
        bsdf.inputs["Metallic"].default_value = metal
        links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return m


def link_obj(obj: bpy.types.Object, coll: bpy.types.Collection) -> bpy.types.Object:
    coll.objects.link(obj)
    obj["kit_category"] = coll.name
    obj["usage"] = "openworld_modular_prop"
    return obj


def new_mesh_obj(name: str, coll: bpy.types.Collection) -> tuple[bpy.types.Object, bmesh.types.BMesh]:
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    link_obj(obj, coll)
    bm = bmesh.new()
    return obj, bm


def finish_mesh(obj: bpy.types.Object, bm: bmesh.types.BMesh, material: bpy.types.Material) -> None:
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()
    if material.name not in obj.data.materials:
        obj.data.materials.append(material)


def displace_verts(bm: bmesh.types.BMesh, amount: float, scale: float, seed: float) -> None:
    for v in bm.verts:
        n = noise.noise(Vector((v.co.x * scale + seed, v.co.y * scale, v.co.z * scale + seed * 0.3)))
        v.co += v.normal * (n * amount) if v.normal.length else Vector((n, n, n)) * amount * 0.2


def add_subdiv(obj: bpy.types.Object, levels: int = 1) -> None:
    mod = obj.modifiers.new("Subdiv", "SUBSURF")
    mod.levels = levels
    mod.render_levels = levels


def ico_rock(name: str, coll, material, radius: float, seed: float, subdiv: int = 1) -> bpy.types.Object:
    obj, bm = new_mesh_obj(name, coll)
    bmesh.ops.create_icosphere(bm, subdivisions=subdiv, radius=radius)
    # squash / stretch
    sx, sy, sz = 0.7 + rng.random() * 0.8, 0.7 + rng.random() * 0.8, 0.45 + rng.random() * 0.9
    for v in bm.verts:
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz
        n = noise.noise(Vector((v.co.x * 2.2 + seed, v.co.y * 2.2, v.co.z * 2.2 + seed)))
        v.co *= 1.0 + n * 0.28
    # flatten bottom so it sits on ground
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        if v.co.z < zmin + radius * 0.25:
            v.co.z = zmin * 0.2
    for v in bm.verts:
        v.co.z -= min(vv.co.z for vv in bm.verts)
    finish_mesh(obj, bm, material)
    return obj


def box_rubble(name: str, coll, material, size: Vector, seed: float) -> bpy.types.Object:
    obj, bm = new_mesh_obj(name, coll)
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size.x
        v.co.y *= size.y
        v.co.z *= size.z
        n = noise.noise(Vector((v.co.x * 3 + seed, v.co.y * 3, seed)))
        v.co += Vector((n, n * 0.4, abs(n) * 0.2)) * 0.15
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= zmin
    finish_mesh(obj, bm, material)
    return obj


def tree_trunk_canopy(
    name: str,
    coll,
    trunk_mat,
    leaf_mat,
    height: float,
    trunk_r: float,
    canopy_r: float,
    canopy_type: str = "ico",
) -> bpy.types.Object:
    # Parent empty + children meshes joined later into one object via boolean-less join
    trunk_obj, tbm = new_mesh_obj(name + "_trunk", coll)
    bmesh.ops.create_cone(
        tbm,
        cap_ends=True,
        segments=8,
        radius1=trunk_r,
        radius2=trunk_r * 0.55,
        depth=height * 0.72,
    )
    for v in tbm.verts:
        v.co.z += height * 0.36
    finish_mesh(trunk_obj, tbm, trunk_mat)

    leaf_obj, lbm = new_mesh_obj(name + "_leaf", coll)
    if canopy_type == "ico":
        bmesh.ops.create_icosphere(lbm, subdivisions=1, radius=canopy_r)
    else:
        bmesh.ops.create_cone(
            lbm,
            cap_ends=True,
            segments=8,
            radius1=canopy_r,
            radius2=0.05,
            depth=canopy_r * 1.6,
        )
        for v in lbm.verts:
            v.co.z += canopy_r * 0.4
    for v in lbm.verts:
        v.co.z += height * 0.72
        n = noise.noise(v.co * 1.5)
        v.co *= 1.0 + n * 0.12
    finish_mesh(leaf_obj, lbm, leaf_mat)

    # Join into single object
    bpy.ops.object.select_all(action="DESELECT")
    trunk_obj.select_set(True)
    leaf_obj.select_set(True)
    bpy.context.view_layer.objects.active = trunk_obj
    bpy.ops.object.join()
    trunk_obj.name = name
    trunk_obj["kit_category"] = coll.name
    trunk_obj["usage"] = "openworld_modular_prop"
    return trunk_obj


def bush(name: str, coll, leaf_mat, radius: float, seed: float) -> bpy.types.Object:
    obj, bm = new_mesh_obj(name, coll)
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=radius)
    for v in bm.verts:
        n = noise.noise(Vector((v.co.x * 3 + seed, v.co.y * 3, v.co.z * 3)))
        v.co *= 1.0 + n * 0.35
        v.co.z = abs(v.co.z) * 0.7
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= zmin
    finish_mesh(obj, bm, leaf_mat)
    return obj


def building_block(
    name: str,
    coll,
    wall_mat,
    roof_mat,
    footprint: tuple[float, float],
    height: float,
    roof: str = "flat",
) -> bpy.types.Object:
    w, d = footprint
    wall, wbm = new_mesh_obj(name + "_wall", coll)
    bmesh.ops.create_cube(wbm, size=1.0)
    for v in wbm.verts:
        v.co.x *= w
        v.co.y *= d
        v.co.z *= height
        v.co.z += height * 0.5
    finish_mesh(wall, wbm, wall_mat)

    parts = [wall]
    if roof == "gable":
        roof_obj, rbm = new_mesh_obj(name + "_roof", coll)
        # prism via cone flattened
        bmesh.ops.create_cone(rbm, cap_ends=True, segments=4, radius1=max(w, d) * 0.72, radius2=0.02, depth=height * 0.45)
        for v in rbm.verts:
            v.co.z += height + height * 0.2
            v.co.y *= d / max(w, d)
            v.co.x *= w / max(w, d)
        finish_mesh(roof_obj, rbm, roof_mat)
        parts.append(roof_obj)
    elif roof == "hip":
        roof_obj, rbm = new_mesh_obj(name + "_roof", coll)
        bmesh.ops.create_cone(rbm, cap_ends=True, segments=8, radius1=max(w, d) * 0.7, radius2=0.05, depth=height * 0.4)
        for v in rbm.verts:
            v.co.z += height + height * 0.18
        finish_mesh(roof_obj, rbm, roof_mat)
        parts.append(roof_obj)

    bpy.ops.object.select_all(action="DESELECT")
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = wall
    bpy.ops.object.join()
    wall.name = name
    wall["kit_category"] = coll.name
    wall["usage"] = "openworld_modular_prop"
    return wall


def _append_cube(bm: bmesh.types.BMesh, scale: Vector, offset: Vector) -> None:
    tmp = bmesh.new()
    bmesh.ops.create_cube(tmp, size=1.0)
    for v in tmp.verts:
        v.co.x = v.co.x * scale.x + offset.x
        v.co.y = v.co.y * scale.y + offset.y
        v.co.z = v.co.z * scale.z + offset.z
    vert_map = {v.index: bm.verts.new(v.co.copy()) for v in tmp.verts}
    bm.verts.ensure_lookup_table()
    for f in tmp.faces:
        try:
            bm.faces.new([vert_map[v.index] for v in f.verts])
        except ValueError:
            pass
    tmp.free()


def fence_segment(name: str, coll, wood_mat, length: float = 2.0, height: float = 1.2) -> bpy.types.Object:
    obj, bm = new_mesh_obj(name, coll)
    post_r = 0.08
    _append_cube(bm, Vector((post_r, post_r, height)), Vector((-length * 0.5, 0.0, height * 0.5)))
    _append_cube(bm, Vector((post_r, post_r, height)), Vector((length * 0.5, 0.0, height * 0.5)))
    _append_cube(bm, Vector((length, 0.06, 0.08)), Vector((0.0, 0.0, height * 0.35)))
    _append_cube(bm, Vector((length, 0.06, 0.08)), Vector((0.0, 0.0, height * 0.75)))
    finish_mesh(obj, bm, wood_mat)
    return obj

def crate(name: str, coll, wood_mat, size: float) -> bpy.types.Object:
    obj, bm = new_mesh_obj(name, coll)
    bmesh.ops.create_cube(bm, size=size)
    for v in bm.verts:
        v.co.z += size * 0.5
    finish_mesh(obj, bm, wood_mat)
    return obj


def barrel(name: str, coll, wood_mat, radius: float, height: float) -> bpy.types.Object:
    obj, bm = new_mesh_obj(name, coll)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=radius, radius2=radius * 0.92, depth=height)
    for v in bm.verts:
        v.co.z += height * 0.5
        # bulge
        t = abs(v.co.z / height - 0.5)
        v.co.xy *= 1.0 + (0.5 - t) * 0.25
    finish_mesh(obj, bm, wood_mat)
    return obj


def path_stone(name: str, coll, stone_mat, size: float, seed: float) -> bpy.types.Object:
    obj, bm = new_mesh_obj(name, coll)
    bmesh.ops.create_circle(bm, cap_ends=True, segments=7, radius=size)
    # extrude down thin
    ret = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    verts = [e for e in ret["geom"] if isinstance(e, bmesh.types.BMVert)]
    for v in verts:
        v.co.z -= 0.08
        n = noise.noise(Vector((v.co.x * 4 + seed, v.co.y * 4, seed)))
        v.co.x *= 1.0 + n * 0.15
        v.co.y *= 1.0 + n * 0.15
    for v in bm.verts:
        if v.co.z >= -0.001:
            n = noise.noise(Vector((v.co.x * 5 + seed, v.co.y * 5, 0)))
            v.co.x *= 0.85 + n * 0.2
            v.co.y *= 0.85 + n * 0.2
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= zmin
    finish_mesh(obj, bm, stone_mat)
    return obj


def ruin_pillar(name: str, coll, stone_mat, height: float, radius: float, seed: float) -> bpy.types.Object:
    obj, bm = new_mesh_obj(name, coll)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=radius, radius2=radius * 0.85, depth=height)
    for v in bm.verts:
        v.co.z += height * 0.5
        n = noise.noise(Vector((v.co.x * 3 + seed, v.co.y * 3, v.co.z)))
        v.co += Vector((n, n, 0)) * 0.08
    # chop top irregularly
    for v in bm.verts:
        if v.co.z > height * 0.7:
            v.co.z -= abs(noise.noise(Vector((v.co.x + seed, v.co.y, 0)))) * height * 0.25
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= zmin
    finish_mesh(obj, bm, stone_mat)
    return obj


def lamp_post(name: str, coll, metal_mat, glass_mat, height: float = 3.2) -> bpy.types.Object:
    pole, pbm = new_mesh_obj(name + "_pole", coll)
    bmesh.ops.create_cone(pbm, cap_ends=True, segments=8, radius1=0.08, radius2=0.06, depth=height)
    for v in pbm.verts:
        v.co.z += height * 0.5
    finish_mesh(pole, pbm, metal_mat)
    lamp, lbm = new_mesh_obj(name + "_lamp", coll)
    bmesh.ops.create_icosphere(lbm, subdivisions=1, radius=0.22)
    for v in lbm.verts:
        v.co.z += height + 0.1
    finish_mesh(lamp, lbm, glass_mat)
    bpy.ops.object.select_all(action="DESELECT")
    pole.select_set(True)
    lamp.select_set(True)
    bpy.context.view_layer.objects.active = pole
    bpy.ops.object.join()
    pole.name = name
    pole["kit_category"] = coll.name
    pole["usage"] = "openworld_modular_prop"
    return pole


def well(name: str, coll, stone_mat, wood_mat) -> bpy.types.Object:
    base, bbm = new_mesh_obj(name + "_base", coll)
    bmesh.ops.create_cone(bbm, cap_ends=True, segments=12, radius1=0.9, radius2=0.9, depth=0.7)
    for v in bbm.verts:
        v.co.z += 0.35
    # inner hole approx by scaling top ring inward visually - keep solid for kit simplicity
    finish_mesh(base, bbm, stone_mat)
    roof, rbm = new_mesh_obj(name + "_roof", coll)
    bmesh.ops.create_cone(rbm, cap_ends=True, segments=4, radius1=1.1, radius2=0.05, depth=0.7)
    for v in rbm.verts:
        v.co.z += 1.6
    finish_mesh(roof, rbm, wood_mat)
    bpy.ops.object.select_all(action="DESELECT")
    base.select_set(True)
    roof.select_set(True)
    bpy.context.view_layer.objects.active = base
    bpy.ops.object.join()
    base.name = name
    base["kit_category"] = coll.name
    base["usage"] = "openworld_modular_prop"
    return base


def bridge_plank(name: str, coll, wood_mat, length: float = 4.0, width: float = 1.6) -> bpy.types.Object:
    obj, bm = new_mesh_obj(name, coll)
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= length
        v.co.y *= width
        v.co.z *= 0.18
        v.co.z += 0.09
    finish_mesh(obj, bm, wood_mat)
    return obj


# --- build kit ---
clear_scene()
root = bpy.context.scene.collection
cats = {
    "01_Stones": ensure_coll("01_Stones", root),
    "02_Rocks": ensure_coll("02_Rocks", root),
    "03_Trees": ensure_coll("03_Trees", root),
    "04_Foliage": ensure_coll("04_Foliage", root),
    "05_Buildings": ensure_coll("05_Buildings", root),
    "06_ModularWalls": ensure_coll("06_ModularWalls", root),
    "07_Props": ensure_coll("07_Props", root),
    "08_Ruins": ensure_coll("08_Ruins", root),
    "09_Paths": ensure_coll("09_Paths", root),
    "PreviewLayout": ensure_coll("PreviewLayout", root),
}

# materials
M_STONE = mat("M_Stone", (0.45, 0.43, 0.40), 0.9)
M_STONE_DARK = mat("M_StoneDark", (0.28, 0.27, 0.26), 0.92)
M_ROCK = mat("M_Rock", (0.38, 0.36, 0.34), 0.88)
M_ROCK_MOSS = mat("M_RockMoss", (0.34, 0.40, 0.28), 0.9)
M_SANDSTONE = mat("M_Sandstone", (0.62, 0.52, 0.36), 0.85)
M_BARK = mat("M_Bark", (0.28, 0.18, 0.10), 0.95)
M_LEAF = mat("M_Leaf", (0.22, 0.48, 0.18), 0.75)
M_LEAF_DARK = mat("M_LeafDark", (0.14, 0.32, 0.12), 0.8)
M_LEAF_AUTUMN = mat("M_LeafAutumn", (0.55, 0.28, 0.08), 0.78)
M_PINE = mat("M_Pine", (0.12, 0.28, 0.14), 0.82)
M_WALL = mat("M_Wall", (0.72, 0.68, 0.58), 0.85)
M_WALL_BRICK = mat("M_WallBrick", (0.55, 0.32, 0.24), 0.88)
M_WALL_WOOD = mat("M_WallWood", (0.42, 0.28, 0.16), 0.9)
M_ROOF_TILE = mat("M_RoofTile", (0.35, 0.18, 0.14), 0.7)
M_ROOF_THATCH = mat("M_RoofThatch", (0.48, 0.40, 0.22), 0.95)
M_WOOD = mat("M_Wood", (0.40, 0.26, 0.14), 0.88)
M_METAL = mat("M_Metal", (0.35, 0.36, 0.38), 0.45, 0.6)
M_GLASS = mat("M_Glass", (0.85, 0.9, 0.7), 0.15)

created: list[str] = []

# Stones (small) - 12
for i in range(12):
    r = 0.12 + i * 0.03 + rng.random() * 0.04
    o = ico_rock(f"STONE-{i:02d}", cats["01_Stones"], M_STONE if i % 2 == 0 else M_STONE_DARK, r, seed=i * 1.7, subdiv=1)
    created.append(o.name)

# Rocks (medium/large) - 14
for i in range(14):
    r = 0.55 + (i % 7) * 0.18 + rng.random() * 0.1
    mat_r = [M_ROCK, M_ROCK_MOSS, M_SANDSTONE, M_STONE_DARK][i % 4]
    o = ico_rock(f"ROCK-{i:02d}", cats["02_Rocks"], mat_r, r, seed=10 + i * 2.3, subdiv=2)
    created.append(o.name)

# Extra angular rubble rocks - 6
for i in range(6):
    s = Vector((0.6 + rng.random(), 0.5 + rng.random() * 0.8, 0.35 + rng.random() * 0.5))
    o = box_rubble(f"ROCK-rubble-{i:02d}", cats["02_Rocks"], M_ROCK if i % 2 else M_SANDSTONE, s, seed=50 + i)
    created.append(o.name)

# Trees - 12
tree_defs = [
    ("TREE-oak-01", 4.5, 0.28, 1.8, "ico", M_LEAF),
    ("TREE-oak-02", 5.5, 0.32, 2.2, "ico", M_LEAF),
    ("TREE-oak-03", 3.8, 0.24, 1.5, "ico", M_LEAF_DARK),
    ("TREE-pine-01", 6.0, 0.22, 1.4, "cone", M_PINE),
    ("TREE-pine-02", 7.2, 0.25, 1.6, "cone", M_PINE),
    ("TREE-pine-03", 5.0, 0.2, 1.2, "cone", M_PINE),
    ("TREE-birch-01", 4.0, 0.16, 1.3, "ico", M_LEAF),
    ("TREE-birch-02", 4.8, 0.18, 1.5, "ico", M_LEAF_DARK),
    ("TREE-autumn-01", 4.2, 0.26, 1.7, "ico", M_LEAF_AUTUMN),
    ("TREE-autumn-02", 5.0, 0.28, 1.9, "ico", M_LEAF_AUTUMN),
    ("TREE-dead-01", 3.5, 0.2, 0.9, "ico", M_STONE_DARK),
    ("TREE-bushy-01", 3.2, 0.3, 2.0, "ico", M_LEAF),
]
for name, h, tr, cr, ctype, lm in tree_defs:
    o = tree_trunk_canopy(name, cats["03_Trees"], M_BARK, lm, h, tr, cr, ctype)
    created.append(o.name)

# Foliage bushes - 10
for i in range(10):
    lm = [M_LEAF, M_LEAF_DARK, M_LEAF_AUTUMN, M_PINE][i % 4]
    o = bush(f"BUSH-{i:02d}", cats["04_Foliage"], lm, 0.4 + (i % 5) * 0.12, seed=80 + i)
    created.append(o.name)

# Buildings - 10
bdefs = [
    ("BLD-hut-01", (3.2, 3.0), 2.2, "gable", M_WALL_WOOD, M_ROOF_THATCH),
    ("BLD-hut-02", (4.0, 3.2), 2.4, "gable", M_WALL_WOOD, M_ROOF_THATCH),
    ("BLD-cottage-01", (5.0, 4.0), 3.0, "gable", M_WALL, M_ROOF_TILE),
    ("BLD-cottage-02", (6.0, 4.5), 3.2, "hip", M_WALL, M_ROOF_TILE),
    ("BLD-barn-01", (7.0, 4.0), 3.5, "gable", M_WALL_WOOD, M_ROOF_THATCH),
    ("BLD-tower-01", (2.4, 2.4), 6.0, "hip", M_WALL_BRICK, M_ROOF_TILE),
    ("BLD-shop-01", (5.5, 4.0), 3.4, "flat", M_WALL_BRICK, M_ROOF_TILE),
    ("BLD-shed-01", (2.5, 2.0), 2.0, "gable", M_WALL_WOOD, M_ROOF_THATCH),
    ("BLD-inn-01", (7.5, 5.0), 4.0, "gable", M_WALL, M_ROOF_TILE),
    ("BLD-watch-01", (2.0, 2.0), 5.0, "flat", M_WALL_BRICK, M_ROOF_TILE),
]
for name, fp, h, roof, wm, rm in bdefs:
    o = building_block(name, cats["05_Buildings"], wm, rm, fp, h, roof)
    created.append(o.name)

# Modular wall pieces - 12
for i, length in enumerate([2.0, 2.0, 4.0, 4.0, 2.0, 4.0, 2.0, 4.0, 2.0, 4.0, 2.0, 4.0]):
    h = 2.4 if i < 8 else 1.2
    wm = M_WALL if i % 3 == 0 else (M_WALL_BRICK if i % 3 == 1 else M_WALL_WOOD)
    name = f"WALL-{'low' if h < 2 else 'full'}-{i:02d}"
    obj, bm = new_mesh_obj(name, cats["06_ModularWalls"])
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= length
        v.co.y *= 0.35
        v.co.z *= h
        v.co.z += h * 0.5
    finish_mesh(obj, bm, wm)
    created.append(obj.name)

# Corner / pillar wall modules
for i in range(4):
    name = f"WALL-pillar-{i:02d}"
    obj, bm = new_mesh_obj(name, cats["06_ModularWalls"])
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= 0.55
        v.co.y *= 0.55
        v.co.z *= 2.6
        v.co.z += 1.3
    finish_mesh(obj, bm, M_WALL_BRICK if i % 2 else M_STONE)
    created.append(obj.name)

# Props - 16
for i in range(4):
    created.append(fence_segment(f"PROP-fence-{i:02d}", cats["07_Props"], M_WOOD, length=2.0 + i * 0.5).name)
for i in range(4):
    created.append(crate(f"PROP-crate-{i:02d}", cats["07_Props"], M_WOOD, size=0.5 + i * 0.15).name)
for i in range(3):
    created.append(barrel(f"PROP-barrel-{i:02d}", cats["07_Props"], M_WOOD, radius=0.35 + i * 0.05, height=0.7 + i * 0.1).name)
for i in range(3):
    created.append(lamp_post(f"PROP-lamp-{i:02d}", cats["07_Props"], M_METAL, M_GLASS, height=2.8 + i * 0.4).name)
created.append(well("PROP-well-01", cats["07_Props"], M_STONE, M_WOOD).name)
created.append(bridge_plank("PROP-bridge-01", cats["07_Props"], M_WOOD).name)
created.append(bridge_plank("PROP-bridge-02", cats["07_Props"], M_WOOD, length=6.0, width=2.0).name)

# Ruins - 8
for i in range(8):
    created.append(
        ruin_pillar(
            f"RUIN-pillar-{i:02d}",
            cats["08_Ruins"],
            M_STONE if i % 2 == 0 else M_SANDSTONE,
            height=1.5 + i * 0.35,
            radius=0.25 + (i % 3) * 0.08,
            seed=200 + i,
        ).name
    )

# Path stones - 10
for i in range(10):
    created.append(path_stone(f"PATH-stone-{i:02d}", cats["09_Paths"], M_STONE if i % 2 else M_STONE_DARK, size=0.35 + (i % 4) * 0.1, seed=300 + i).name)

# --- Preview layout: place by category in rows ---
preview = cats["PreviewLayout"]
# Hide originals in category shelves; create linked duplicates for preview
x = 0.0
row_y = 0.0
col = 0
max_cols = 10
spacing = 6.0
row_height = 8.0
category_order = [
    "01_Stones",
    "02_Rocks",
    "03_Trees",
    "04_Foliage",
    "05_Buildings",
    "06_ModularWalls",
    "07_Props",
    "08_Ruins",
    "09_Paths",
]

for cat_name in category_order:
    coll = cats[cat_name]
    objs = [o for o in coll.objects if o.name in created or o.name.startswith(tuple(["STONE", "ROCK", "TREE", "BUSH", "BLD", "WALL", "PROP", "RUIN", "PATH"]))]
    objs = sorted(coll.objects, key=lambda o: o.name)
    # filter out temp joined leftovers - only top-level kit names we tracked
    objs = [o for o in objs if o.name in created]
    col = 0
    for obj in objs:
        dup = obj.copy()
        dup.data = obj.data
        dup.name = f"PREV-{obj.name}"
        preview.objects.link(dup)
        dup.location = (col * spacing, -row_y, 0.0)
        obj.location = (-120.0, category_order.index(cat_name) * 8.0, 0.0)
        obj.hide_render = True
        obj.hide_viewport = True
        col += 1
        if col >= max_cols:
            col = 0
            row_y += row_height
    row_y += row_height + 2.0

# Lights + camera
sun = bpy.data.lights.new("Sun", "SUN")
sun.energy = 3.5
sun_obj = bpy.data.objects.new("Sun", sun)
root.objects.link(sun_obj)
sun_obj.rotation_euler = (math.radians(50), math.radians(20), math.radians(30))

fill = bpy.data.lights.new("Fill", "AREA")
fill.energy = 350
fill.size = 60
fill_obj = bpy.data.objects.new("Fill", fill)
root.objects.link(fill_obj)
fill_obj.location = (30, -40, 40)

# World
if bpy.context.scene.world is None:
    bpy.context.scene.world = bpy.data.worlds.new("World")
world = bpy.context.scene.world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs[0].default_value = (0.52, 0.64, 0.78, 1.0)
    bg.inputs[1].default_value = 0.55

# Camera framing all preview objects
prevs = [o for o in preview.objects if o.name.startswith("PREV-")]
xs = [o.location.x for o in prevs]
ys = [o.location.y for o in prevs]
cx = (min(xs) + max(xs)) * 0.5
cy = (min(ys) + max(ys)) * 0.5
span = max(max(xs) - min(xs), max(ys) - min(ys), 20.0)

cam_data = bpy.data.cameras.new("PreviewCamera")
cam_data.lens = 35
cam = bpy.data.objects.new("PreviewCamera", cam_data)
root.objects.link(cam)
cam.location = Vector((cx + span * 0.2, cy - span * 1.05, span * 0.75))
cam.rotation_euler = (Vector((cx, cy, 1.0)) - cam.location).to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1440
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = os.path.join(EXPORT, "preview_contact_sheet")

bpy.ops.wm.save_as_mainfile(filepath=BLEND)

# summary counts by prefix
counts = {}
for name in created:
    key = name.split("-")[0]
    counts[key] = counts.get(key, 0) + 1
