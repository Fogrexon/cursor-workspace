import * as THREE from 'three';

/**
 * Low-poly miniature airplane.
 * Built with nose along local −Z so it matches sim forward (no ±90° yaw hack).
 */
export function createPlaneMesh(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'plane';

  const red = new THREE.MeshStandardMaterial({ color: 0xc44536, roughness: 0.55, metalness: 0.15 });
  const cream = new THREE.MeshStandardMaterial({ color: 0xf0e6d2, roughness: 0.6, metalness: 0.05 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a2a32, roughness: 0.7, metalness: 0.2 });
  const yellow = new THREE.MeshStandardMaterial({ color: 0xe8b84a, roughness: 0.5, metalness: 0.1 });

  // Fuselage along Z; nose toward −Z
  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.85, 4, 8), red);
  fuselage.rotation.x = Math.PI / 2;
  fuselage.castShadow = true;
  root.add(fuselage);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 8), cream);
  nose.rotation.x = -Math.PI / 2;
  nose.position.z = -0.62;
  nose.castShadow = true;
  root.add(nose);

  const cockpit = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
    cream,
  );
  cockpit.position.set(0, 0.14, -0.05);
  cockpit.castShadow = true;
  root.add(cockpit);

  const wing = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.05, 0.35), yellow);
  wing.position.set(0, -0.02, -0.05);
  wing.castShadow = true;
  root.add(wing);

  const stab = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.22), yellow);
  stab.position.set(0, 0.02, 0.45);
  stab.castShadow = true;
  root.add(stab);

  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.28), red);
  fin.position.set(0, 0.16, 0.48);
  fin.castShadow = true;
  root.add(fin);

  const propHub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 8), dark);
  propHub.rotation.x = Math.PI / 2;
  propHub.position.z = -0.8;
  root.add(propHub);

  const prop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.04), dark);
  prop.position.z = -0.84;
  prop.name = 'propeller';
  root.add(prop);

  root.scale.setScalar(0.28); // keep softChaseTarget PLANE_VIEW_SCALE in sync
  return root;
}
