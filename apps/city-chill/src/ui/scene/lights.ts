import * as THREE from 'three';

export function createLights(scene: THREE.Scene): void {
  // 昼の空寄り。256 マップでは濃い霧だと全体が沈むので薄くする
  scene.background = new THREE.Color(0x8eb8d8);
  scene.fog = new THREE.FogExp2(0xa8c8e0, 0.0012);

  const hemi = new THREE.HemisphereLight(0xf0f6ff, 0x6a8a58, 1.45);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff8ea, 2.0);
  sun.position.set(50, 80, 30);
  sun.castShadow = false;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0xc8daf0, 0.75);
  fill.position.set(-40, 30, -50);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xb0c0ff, 0.4);
  rim.position.set(20, 15, -60);
  scene.add(rim);

  const ambient = new THREE.AmbientLight(0x90a0b8, 0.7);
  scene.add(ambient);
}
