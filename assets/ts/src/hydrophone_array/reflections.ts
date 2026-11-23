// ╭───────────────────────────────────────────────────────────────╮
// │      Surface and seafloor reflections by the image method     │
// ╰───────────────────────────────────────────────────────────────╯
// Depths z are measured downward from the whale's depth, so the sea surface is at z = −surface and
// the seafloor at z = floor. Sound that bounces once off a flat boundary travels the same distance
// as sound going straight to the hydrophone's mirror image across that boundary, so each
// reflected path is handled as a direct path to an "image" hydrophone, with a gain for the bounce.

export interface Point3 { x: number; y: number; z: number; }

export type PathKind = "direct" | "surface" | "seafloor";

export interface SoundPath<P extends Point3> {
  kind    : PathKind;
  receiver: P;      // The hydrophone itself, or its mirror image across the boundary
  gain    : number; // Amplitude factor of the bounce (negative flips the waveform)
}

// The sea surface reflects nearly all of the sound but flips its sign (it's a pressure-release
// boundary); the seafloor reflects only part of it, without flipping.
export const SURFACE_GAIN  = -0.9;
export const SEAFLOOR_GAIN = 0.5;

export interface Boundaries {
  surface: number; // Depth of the whale below the sea surface (m)
  floor  : number; // Depth of the seafloor below the whale (m)
  echoes : { surface: boolean; seafloor: boolean };
}

// Mirror image of a point across the surface or the seafloor.
export function mirror<P extends Point3>(p: P, kind: "surface" | "seafloor", b: Boundaries): P {
  const plane = kind === "surface" ? -b.surface : b.floor;
  return { ...p, z: 2 * plane - p.z };
}

// The direct path to a hydrophone, followed by the reflected paths that are switched on.
export function soundPaths<P extends Point3>(ph: P, b: Boundaries): SoundPath<P>[] {
  const paths: SoundPath<P>[] = [{ kind: "direct", receiver: ph, gain: 1 }];
  if (b.echoes.surface)  paths.push({ kind: "surface",  receiver: mirror(ph, "surface", b),  gain: SURFACE_GAIN });
  if (b.echoes.seafloor) paths.push({ kind: "seafloor", receiver: mirror(ph, "seafloor", b), gain: SEAFLOOR_GAIN });
  return paths;
}

// Where the sound from `source` to the image `image` bounces: the point where the straight line
// between them crosses the boundary that `image` was mirrored across.
export function bouncePoint(source: Point3, image: Point3, kind: "surface" | "seafloor", b: Boundaries): Point3 {
  const plane = kind === "surface" ? -b.surface : b.floor;
  const s = image.z === source.z ? 0 : (plane - source.z) / (image.z - source.z);
  return {
    x: source.x + s * (image.x - source.x),
    y: source.y + s * (image.y - source.y),
    z: plane,
  };
}
