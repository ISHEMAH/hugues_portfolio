# 3D models

`robot.glb` is the site mascot: "RobotExpressive" by Tomás Laulhé (Quaternius), modified by
Don McCurdy, CC0, from the three.js examples. It was compressed with

```bash
npx @gltf-transform/cli optimize RobotExpressive.glb robot.glb --compress meshopt --flatten false --join false --instance false --palette false --simplify false --texture-compress false
```

so every node name, animation clip (Idle, Wave, Yes, No, ThumbsUp, Jump, Punch, Dance, Death,
Sitting, Standing, Walking, Running, WalkJump) and the face morph targets (Angry, Surprised, Sad)
survive. The behaviour engine in `web/src/lib/mascot/brain.ts` depends on those names. Meshopt and
Draco decoders live in `web/public/draco`; the KTX2 transcoder in `web/public/basis`.
