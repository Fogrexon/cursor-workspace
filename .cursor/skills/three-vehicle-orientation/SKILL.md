---
name: three-vehicle-orientation
description: >-
  Three.js / WebGL の回転・座標系（Y-up、−Z forward、親子 transform、Euler）を
  正しく推論する。Use when implementing or debugging 3D vehicle/plane orientation,
  yaw/pitch/roll, mesh facing, chase cameras, or left/right visual mismatch in Three.js.
---

# Three.js / OpenGL 回転の考え方

符号を当てずっぽうに反転して直すのはデバッグではない。  
**どの空間の、どの軸のまわりの、どの向きの回転か**を先に固定する。

## 誤解しがちな点（実際にやった失敗）

### 1. 「親の `rotation.y = yaw` なら、子の機首 −Z も sim の forward についてくる」

これは **θ = 0 のときだけ**正しい。

Y 回転行列（右手系、+Y 上から見て CCW が正）で局所点 `(0,0,−1)` は:

```text
Ry(θ)·(0,0,−1) = (−sin θ,  0,  −cos θ)
```

一方「yaw = 0 で −Z 前進」と定義した速度方向は:

```text
forward(θ) = ( sin θ,  0,  −cos θ)
```

`θ = 0` では両方 `(0,0,−1)`。  
`θ ≠ 0` では **X 成分の符号が反対**。  
「同じ yaw を親に入れれば機首と速度が一致する」は成り立たない。

**正しい問い:** 「このメッシュの機首ベクトルを、親の Euler がどう写像するか？」を成分で書く。一致しなければ、  
(A) メッシュの機首軸を変える、(B) 親に渡す角を写像する、(C) Euler をやめて basis / quaternion で組む——のどれか。  
(B) で `−yaw` になるのは **写像の結果**であって、先に符号を決めることではない。

### 2. 「±90° で軸を合わせておけば、あとは yaw をそのまま使える」

±90° は **静止姿勢で機首を −Z に乗せる**操作にすぎない。  
その後に親が `Ry(θ)` すると、上記の写像が乗る。  
「軸合わせ済み = 以降は identity 対応」と混同していた。

### 3. 「見た目が左右逆 = 入力か親 yaw の符号が逆」

左右逆に**見える**経路は複数ある。

| 実際の状態 | 画面上の見え方 |
|------------|----------------|
| 速度は正しいが機首が進行の反対 | 後ろ向き飛行 → 旋回の見え方も逆転して感じる |
| 親 yaw と forward の写像不一致 | 機首が速度の鏡像方向を向く |
| カメラが速度後方にいない | 操作と映像の左右が食い違う |
| ロール符号だけ逆 | 傾きだけ反対（ヨーは正しい） |

層を切り分けず「ヨーを反転」すると、合っている層まで壊す。

### 4. 「Euler YXZ で yaw/pitch/roll をそのまま Object3D に書けば航空の姿勢と同じ」

Three.js の `rotation.order = 'YXZ'` は **内因的な機体軸のバンク**と同じとは限らない。  
特にロールは「進行軸まわり」か「親のローカル Z まわり」かで意味が変わる。  
yaw を写像で反転したあと、ロールをセットで反転するのは根拠がない。ロールは **進行軸まわりの傾き**として別検証する。

## どう考えるべきか（手順）

### Step 0 — 空間を名付ける

必ず書き下す:

1. **ワールド:** Y-up、右手系か（Three.js は右手）
2. **前進の定義:** 例 `yaw=0 → (−Z)`。これを sim の唯一の真実にする
3. **メッシュ機首:** モデリング空間のどの軸か（例 `+X` / `−Z`）
4. **カメラ:** 速度の後方から、どの up で lookAt するか

### Step 1 — ベクトルで対応を検証する（符号より先）

```text
v_sim     = forward(yaw, pitch)          // 速度
v_mesh_0  = メッシュ機首（ローカル）
v_mesh_w  = R_parent · v_mesh_0          // ワールドの機首
```

一致条件: `v_mesh_w ≈ v_sim`（許容: 数度）  
不一致なら `R_parent(yaw)` の式を展開して、どの成分が違うか見る。

### Step 2 — 回転を「軸 + 角」で言い直す

- **Yaw（sim）:** ワールド up（+Y）まわり。水平面の進行方位
- **Pitch:** 機首の上げ下げ。ワールド座標系のまま Euler で積むなら order に注意
- **Roll:** **進行方向ベクトルまわり**の回転、と定義するなら quaternion/axis-angle の方が安全

「`rotation.z` をいじる」前に、「それはどの軸まわりか」を一文で言えること。

### Step 3 — カメラは速度に拘束する

チェイスカメラの「後ろ」は **mesh の後ろ**ではなく **`−v_sim` 側**。  
機首補正用の写像角をカメラに入れない。

### Step 4 — 直し方の優先順位

1. メッシュの静止機首を `v_sim(yaw=0)` に合わせる（ジオメトリ or 一回きりの bind pose）
2. 動的な `R_parent` を、成分が `v_sim` と一致するように選ぶ（必要なら basis を直接組む）
3. それでもロールだけ逆なら、**進行軸まわりのロール符号**だけを定義に合わせて直す

入力符号は、`v_sim` とカメラが期待どおり動いてから最後に触る。

## 推奨実装パターン

速度から姿勢を組む（Euler 対応表に頼らない）:

```ts
const forward = normalize(forwardFromAttitude(yaw, pitch)); // sim の真実
const worldUp = (0, 1, 0);
let right = normalize(cross(worldUp, forward));
const up = cross(forward, right);
// roll: forward まわりに up/right を回す
// basis: X=right, Y=up, Z=-forward  （Three.js は −Z が「正面」）
attitude.quaternion.setFromRotationMatrix(makeBasis(right, up, -forward));
```

このとき子メッシュは **ローカル −Z が機首**になるよう静的に揃えておく。  
動的な `−yaw` マジックナンバーが不要になる。

どうしても親に Euler yaw を載せるなら、Step 1 の展開結果として写像を書く:

```ts
// nose_local = (0,0,-1)
// Ry(ψ)·nose_local = forward(yaw)  ⇒  ψ = -yaw   （この式をコメントで残す）
attitude.rotation.y = -yaw;
```

## チェックリスト

- [ ] `forward(yaw)` をワールド矢印で描いた
- [ ] 機首ローカル軸を明示し、`R·nose` を同じ矢印と比較した
- [ ] `yaw=0` だけでなく `yaw=±90°` でも一致を確認した（今回のバグはここでしか出ない）
- [ ] カメラ後方は `−forward` 側である
- [ ] ロールは進行軸まわりとして左右を確認した（ヨー補正とセットで触っていない）

## 詳細式

[reference.md](reference.md)
