import bpy
from collections import Counter
from mathutils import Vector

for name in ["TREE-oak-00", "TREE-pine-03", "TREE-willow-11", "BLD-cottage-01", "CLIFF-01"]:
    o = bpy.data.objects[name]
    c = Counter(p.material_index for p in o.data.polygons)
    mats = [m.name if m else None for m in o.data.materials]
    # trunk vs canopy by z
    trunk_mats = Counter()
    canopy_mats = Counter()
    zcut = max(v.co.z for v in o.data.vertices) * 0.35
    for p in o.data.polygons:
        ctr = Vector((0, 0, 0))
        for i in p.vertices:
            ctr += o.data.vertices[i].co
        ctr /= len(p.vertices)
        (trunk_mats if ctr.z < zcut else canopy_mats)[p.material_index] += 1
    print(name, "ALL", dict(c), "MATS", mats)
    print("  trunk_z<", round(zcut, 2), dict(trunk_mats), "canopy", dict(canopy_mats))
