"""Generate modular open-world terrain chunk assets into the open .blend."""
import bpy
import bmesh
import math
import os
from mathutils import Vector, noise

TILE = 32.0
RES = 33
GAP = 8.0
EXPORT = r"c:\projects\cursor-playground\blender\exports\openworld-terrain"
BLEND = r"c:\projects\cursor-playground\blender\scenes\openworld-terrain\openworld-terrain.blend"

os.makedirs(EXPORT, exist_ok=True)

for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
for mesh in list(bpy.data.meshes):
    bpy.data.meshes.remove(mesh)
for mat in list(bpy.data.materials):
    bpy.data.materials.remove(mat)
for coll in list(bpy.data.collections):
    if coll.name not in {"Scene Collection", "Collection"}:
        try:
            bpy.data.collections.remove(coll)
        except Exception:
            pass

root = bpy.context.scene.collection
assets_coll = bpy.data.collections.new("TerrainAssets")
preview_coll = bpy.data.collections.new("PreviewLayout")
root.children.link(assets_coll)
root.children.link(preview_coll)


def fbm(p, octaves=3, lac=2.0, gain=0.5):
    amp = 1.0
    freq = 1.0
    total = 0.0
    norm = 0.0
    for _ in range(octaves):
        total += amp * noise.noise(p * freq)
        norm += amp
        amp *= gain
        freq *= lac
    return total / norm if norm else 0.0


def ridge(p, octaves=3):
    return 1.0 - abs(fbm(p, octaves))


def clamp01(x):
    return max(0.0, min(1.0, x))


def height_fn(kind, u, v, seed):
    p = Vector((u * 4.0 + seed * 17.3, v * 4.0 + seed * 9.1, seed * 3.7))
    edge = max(abs(u), abs(v)) * 2.0
    edge_w = clamp01((edge - 0.75) / 0.25)

    if kind == "plains":
        h = fbm(p, 3) * 0.35 + fbm(p * 2.5, 2) * 0.08
    elif kind == "gentle_hills":
        h = fbm(p * 0.7, 3) * 2.2 + fbm(p * 2.0, 2) * 0.4
    elif kind == "rolling_hills":
        h = fbm(p * 0.55, 4) * 4.0 + fbm(p * 1.8, 2) * 0.8
    elif kind == "mountain":
        h = ridge(p * 0.45, 4) * 10.0 + fbm(p * 1.5, 2) * 1.2
        h *= 1.0 - edge * 0.35
    elif kind == "cliff":
        step = 1.0 / (1.0 + math.exp(-(u * 18.0)))
        h = step * 8.0 + fbm(p, 2) * 0.6 + ridge(p * 0.8, 2) * step * 1.5
    elif kind == "canyon":
        trench = math.exp(-((u) * 6.0) ** 2) * 6.0
        h = fbm(p * 0.6, 3) * 1.5 - trench
    elif kind == "plateau":
        plate = 1.0 - clamp01((math.sqrt(u * u + v * v) - 0.22) / 0.12)
        h = plate * 5.5 + fbm(p, 2) * 0.35
        h += (1.0 - plate) * fbm(p * 0.8, 2) * 1.2
    elif kind == "valley":
        bowl = (u * u + (v * 0.7) ** 2) * 10.0
        h = bowl + fbm(p, 3) * 0.8 - 0.5
    elif kind == "coast_slope":
        h = max((-u + 0.5) * 3.5 + fbm(p, 2) * 0.45, -0.2)
    elif kind == "riverbed":
        bed = math.exp(-((v + math.sin(u * math.pi) * 0.15) * 7.0) ** 2) * 3.2
        h = fbm(p * 0.7, 2) * 0.9 - bed
    elif kind == "rocky_outcrop":
        mound = math.exp(-(u * u + v * v) * 12.0) * 6.5
        h = mound + ridge(p * 1.4, 3) * mound * 0.8
    elif kind == "dunes":
        waves = math.sin((u * 7.0 + fbm(p, 2) * 0.8) * math.pi) * 1.6
        waves += math.sin((v * 3.5 + u * 1.2) * math.pi) * 0.7
        h = waves + fbm(p * 1.5, 2) * 0.2
    elif kind == "mesa":
        r = math.sqrt(u * u * 1.1 + v * v)
        top = 1.0 - clamp01((r - 0.28) / 0.08)
        h = top * 7.0 + (1.0 - top) * fbm(p, 2) * 0.8
    elif kind == "foothills":
        h = abs(fbm(p * 0.5, 3)) * 3.5 + fbm(p * 1.6, 2) * 0.7
    elif kind == "crater":
        r = math.sqrt(u * u + v * v)
        rim = math.exp(-((r - 0.28) * 14.0) ** 2) * 3.5
        bowl = math.exp(-(r * 8.0) ** 2) * -2.2
        h = rim + bowl + fbm(p, 2) * 0.25
    elif kind == "pass":
        walls = abs(v) * 14.0
        h = walls + fbm(p, 3) * 1.0 - math.exp(-(v * 5.0) ** 2) * 1.5
    else:
        h = fbm(p, 2)

    return h * (1.0 - edge_w * 0.85)


def make_mat(name, base_color):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nodes = nt.nodes
    links = nt.links
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.85
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


COLORS = {
    "plains": (0.35, 0.55, 0.28),
    "gentle_hills": (0.40, 0.58, 0.30),
    "rolling_hills": (0.32, 0.50, 0.26),
    "mountain": (0.45, 0.45, 0.48),
    "cliff": (0.42, 0.40, 0.38),
    "canyon": (0.55, 0.35, 0.22),
    "plateau": (0.50, 0.48, 0.35),
    "valley": (0.30, 0.52, 0.32),
    "coast_slope": (0.72, 0.66, 0.42),
    "riverbed": (0.28, 0.38, 0.28),
    "rocky_outcrop": (0.48, 0.46, 0.44),
    "dunes": (0.78, 0.68, 0.42),
    "mesa": (0.62, 0.40, 0.28),
    "foothills": (0.38, 0.52, 0.34),
    "crater": (0.40, 0.38, 0.36),
    "pass": (0.44, 0.46, 0.42),
}


def build_tile(kind, seed):
    name = f"TERRAIN-{kind}"
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    for iy in range(RES):
        for ix in range(RES):
            u = ix / (RES - 1) - 0.5
            v = iy / (RES - 1) - 0.5
            bm.verts.new((u * TILE, v * TILE, height_fn(kind, u, v, seed)))
    bm.verts.ensure_lookup_table()
    for iy in range(RES - 1):
        for ix in range(RES - 1):
            i0 = iy * RES + ix
            bm.faces.new(
                (
                    bm.verts[i0],
                    bm.verts[i0 + 1],
                    bm.verts[i0 + RES + 1],
                    bm.verts[i0 + RES],
                )
            )
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()

    obj = bpy.data.objects.new(name, mesh)
    assets_coll.objects.link(obj)
    obj.data.materials.append(make_mat(f"MAT-{kind}", COLORS[kind]))
    obj["tile_size_m"] = TILE
    obj["asset_kind"] = kind
    obj["usage"] = "openworld_terrain_chunk"
    return obj


created = []
for i, kind in enumerate(COLORS):
    created.append(build_tile(kind, seed=i + 1).name)

cols = 4
for i, name in enumerate(created):
    src = bpy.data.objects[name]
    row, col = divmod(i, cols)
    dup = src.copy()
    dup.data = src.data
    dup.name = f"PREV-{name}"
    preview_coll.objects.link(dup)
    src.location = (-80.0, 0.0, 0.0)
    src.hide_render = True
    dup.location = (col * (TILE + GAP), -row * (TILE + GAP), 0.0)

light_data = bpy.data.lights.new(name="Sun", type="SUN")
light_data.energy = 3.0
light_obj = bpy.data.objects.new("Sun", light_data)
root.objects.link(light_obj)
light_obj.rotation_euler = (math.radians(45), math.radians(15), math.radians(30))

fill = bpy.data.lights.new(name="Fill", type="AREA")
fill.energy = 200.0
fill.size = 40.0
fill_obj = bpy.data.objects.new("Fill", fill)
root.objects.link(fill_obj)
fill_obj.location = (40, -40, 50)

cam_data = bpy.data.cameras.new("PreviewCamera")
cam_data.lens = 50
cam = bpy.data.objects.new("PreviewCamera", cam_data)
root.objects.link(cam)
grid_w = 4 * TILE + 3 * GAP
grid_h = 4 * TILE + 3 * GAP
cam.location = (grid_w * 0.5 - TILE * 0.5, -grid_h * 0.5 + TILE * 0.5 - 20, 95)
cam.rotation_euler = (math.radians(52), 0.0, math.radians(12))
bpy.context.scene.camera = cam

world = bpy.data.worlds.new("World") if not bpy.data.worlds else bpy.context.scene.world
if world is None:
    world = bpy.data.worlds.new("World")
bpy.context.scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs[0].default_value = (0.55, 0.68, 0.82, 1.0)
    bg.inputs[1].default_value = 0.6

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1600
scene.render.resolution_y = 1200
scene.render.filepath = os.path.join(EXPORT, "preview_contact_sheet")
scene.render.image_settings.file_format = "PNG"

bpy.ops.wm.save_as_mainfile(filepath=BLEND)
