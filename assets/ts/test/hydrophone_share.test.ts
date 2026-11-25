import { test } from "node:test";
import assert from "node:assert/strict";
import { SHARE_KEYS, SavedState, decodeState, encodeState } from "../src/hydrophone_array/share";
import { mergeQuery } from "../src/common/query";

const STATE: SavedState = {
  controls: {
    "wh-pattern": "pulses", "wh-speed": "3", "wh-distance": "1200", "wh-count": "3",
    "wh-spacing": "400", "wh-depths": "slope", "wh-surface": "20", "wh-floor": "1000",
    "wh-depth": "600", "wh-echoes": "surface", "wh-rate": "0.5",
  },
  loop: true,
  speakers: { left: "0", right: "whale" },
  phones: [{ x: -400.04, y: 0, z: 0 }, { x: 0, y: 12.5, z: 300 }, { x: 400, y: -3, z: -15 }],
  marked: 12.1499999,
  now: 13.304,
  view3d: { yaw: -0.6, pitch: 0.35 },
};

const query = (s: SavedState) => mergeQuery("", SHARE_KEYS, encodeState(s));

test("shared links: the state round-trips through the address", () => {
  const decoded = decodeState(query(STATE));
  assert.deepEqual(decoded, {
    ...STATE,
    phones: [{ x: -400, y: 0, z: 0 }, { x: 0, y: 12.5, z: 300 }, { x: 400, y: -3, z: -15 }],
    marked: 12.15,
    now: 13.3,
  });
});

test("shared links are readable", () => {
  const q = query(STATE);
  assert.match(q, /[?&]left=H1(&|$)/);
  assert.match(q, /[?&]right=whale(&|$)/);
  assert.match(q, /[?&]ph=-400,0,0;0,12\.5,300;400,-3,-15(&|$)/);
  assert.match(q, /[?&]view=-0\.6,0\.35(&|$)/);
});

test("shared links: undragged hydrophones and looping off are left out", () => {
  const q = query({ ...STATE, phones: null, loop: false });
  assert.doesNotMatch(q, /[?&](ph|loop)=/);
  const decoded = decodeState(q)!;
  assert.equal(decoded.phones, null);
  assert.equal(decoded.loop, false);
});

test("shared links: an address without the tool's parameters gives null", () => {
  assert.equal(decodeState(""), null);
  assert.equal(decodeState("?utm_source=mail"), null);
});

test("shared links: invalid parts are left out", () => {
  const decoded = decodeState("?speed=fast&dist=1e9&pattern=<b>&left=H0&right=H3&t=abc&view=1&ph=1,2;3,4,5&call=%E0")!;
  assert.deepEqual(decoded.controls, {});
  assert.deepEqual(decoded.speakers, { left: "off", right: "2" });
  assert.equal(decoded.now, undefined);
  assert.equal(decoded.view3d, undefined);
  assert.equal(decoded.phones, null);
  assert.equal(decoded.marked, undefined);
});

test("shared links: other parameters in the address are kept", () => {
  const q = mergeQuery("?speed=1&ref=x", SHARE_KEYS, encodeState(STATE));
  assert.match(q, /^\?ref=x&/);
  assert.equal(q.match(/speed=/g)!.length, 1);
});
