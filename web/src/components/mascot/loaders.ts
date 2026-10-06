import type { WebGLRenderer } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

let ktx2: KTX2Loader | null = null;
let draco: DRACOLoader | null = null;

/**
 * Gives the glTF loader every decoder an optimised model might need. The
 * transcoders are served from /public so nothing is fetched from a CDN, and
 * Draco only downloads its decoder when a Draco-compressed file shows up.
 */
export function configureGltfLoader(loader: GLTFLoader, gl: WebGLRenderer) {
  if (!ktx2) ktx2 = new KTX2Loader().setTranscoderPath("/basis/").detectSupport(gl);
  if (!draco) draco = new DRACOLoader().setDecoderPath("/draco/");
  loader.setKTX2Loader(ktx2);
  loader.setDRACOLoader(draco);
  loader.setMeshoptDecoder(MeshoptDecoder);
}
