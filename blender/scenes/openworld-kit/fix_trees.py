import bpy, bmesh, math, os
from mathutils import Vector, Matrix, noise

rng_noise = noise

def get_mat(name, color, rough=0.82):
    m = bpy.data.materials.get(name)
    if m is None:
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        nt = m.node_tree; nt.nodes.clear()
        out = nt.nodes.new('ShaderNodeOutputMaterial')
        bsdf = nt.nodes.new('ShaderNodeBsdfPrincipled')
        bsdf.inputs['Base Color'].default_value = (*color, 1)
        bsdf.inputs['Roughness'].default_value = rough
        nt.links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    else:
        bsdf = next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
        bsdf.inputs['Base Color'].default_value = (*color, 1)
    return m

M_BARK = get_mat('M_bark', (0.34, 0.20, 0.12))
M_BARKL = get_mat('M_bark_light', (0.52, 0.38, 0.24))
M_LEAF = get_mat('M_leaf', (0.25, 0.62, 0.20))
M_LEAFY = get_mat('M_leaf_yellow', (0.72, 0.58, 0.16))
M_AUT = get_mat('M_autumn', (0.78, 0.34, 0.12))
M_PINE = get_mat('M_pine', (0.12, 0.48, 0.18))  # brighter pine

def rebuild_tree(obj, kind):
    # clear mesh
    mesh = obj.data
    bm = bmesh.new()
    h = {'oak':5.0,'pine':6.5,'birch':5.4,'autumn':4.8,'dead':4.0}.get(kind,5.0)
    r0 = {'oak':0.28,'pine':0.2,'birch':0.13,'autumn':0.24,'dead':0.18}.get(kind,0.25)
    bark = M_BARKL if kind=='birch' else M_BARK
    leaf = {'oak':M_LEAF,'pine':M_PINE,'birch':M_LEAFY,'autumn':M_AUT,'dead':None}[kind]

    # trunk as tapered cone sitting on z=0
    f0 = len(bm.faces); s=len(bm.verts)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=r0, radius2=r0*0.55, depth=h*0.65)
    for v in bm.verts[s:]:
        v.co.z += h*0.325  # base near 0
    bm.faces.ensure_lookup_table()
    for i in range(f0, len(bm.faces)):
        bm.faces[i].material_index = 0
    # flatten bottom to z=0
    zmin = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= zmin

    trunk_top = max(v.co.z for v in bm.verts)

    if kind == 'pine':
        for i,t in enumerate((0.55,0.68,0.80,0.92)):
            s=len(bm.verts); f0=len(bm.faces)
            bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=1.55-i*0.28, radius2=0.05, depth=1.35-i*0.12)
            for v in bm.verts[s:]:
                v.co.z += trunk_top * t
            bm.faces.ensure_lookup_table()
            for j in range(f0, len(bm.faces)):
                bm.faces[j].material_index = 1
    elif kind == 'dead':
        for ang,zh,length in ((0.5,0.55,1.2),(2.4,0.7,1.0),(4.0,0.6,0.9)):
            s=len(bm.verts); f0=len(bm.faces)
            bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.07, radius2=0.02, depth=length)
            rot = Matrix.Rotation(ang,4,'Z') @ Matrix.Rotation(math.radians(50),4,'Y')
            for v in bm.verts[s:]:
                v.co = rot @ (v.co + Vector((0,0,length*0.5)))
                v.co.z += trunk_top * zh
            bm.faces.ensure_lookup_table()
            for j in range(f0, len(bm.faces)):
                bm.faces[j].material_index = 0
    else:
        clumps = {
            'oak':[(0,0,1.15,1.45),(0.75,0.2,0.95,1.0),(-0.65,-0.2,1.0,1.05),(0.15,-0.7,1.05,0.9)],
            'birch':[(0,0,1.1,1.05),(0.5,0.15,0.9,0.8),(-0.45,0.2,0.95,0.75)],
            'autumn':[(0,0,1.1,1.3),(0.6,-0.2,0.9,0.95),(-0.55,0.25,0.95,0.9)],
        }[kind]
        for x,y,zoff,rad in clumps:
            s=len(bm.verts); f0=len(bm.faces)
            bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rad)
            center = Vector((x,y, trunk_top + zoff - rad*0.3))
            for v in bm.verts[s:]:
                v.co.z *= 0.72
                v.co *= 1.0 + rng_noise.noise(v.co*2.0+center)*0.12
                v.co += center
            bm.faces.ensure_lookup_table()
            for j in range(f0, len(bm.faces)):
                bm.faces[j].material_index = 1

    # ground
    zs=[v.co.z for v in bm.verts]
    z0=min(zs)
    xs=[v.co.x for v in bm.verts]; ys=[v.co.y for v in bm.verts]
    cx=(min(xs)+max(xs))/2; cy=(min(ys)+max(ys))/2
    for v in bm.verts:
        v.co.x -= cx; v.co.y -= cy; v.co.z -= z0

    face_mats=[f.material_index for f in bm.faces]
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.clear()
    mesh.materials.append(bark)
    if leaf:
        mesh.materials.append(leaf)
    max_i = len(mesh.materials)-1
    for p,idx in zip(mesh.polygons, face_mats):
        p.material_index = min(idx, max_i)
    mesh.update()

# rebuild all trees
kinds = []
for obj in list(bpy.data.objects):
    if not obj.name.startswith('TREE-'):
        continue
    if obj.name.startswith('PREV-') or obj.name.startswith('SHOW-'):
        continue
    # TREE-oak-00
    parts = obj.name.split('-')
    kind = parts[1]
    rebuild_tree(obj, kind)
    kinds.append(obj.name)

bpy.ops.wm.save_mainfile()
print('FIXED', len(kinds))
