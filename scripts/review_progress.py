#!/usr/bin/env python3
"""Chart the review progress of the Dictionary of Fine Distinctions over time.

An item (definition, distinction, or example) counts as reviewed once its front matter no longer
has `published: false`. For each commit that touched the dictionary, and for the working tree, the
script counts reviewed and remaining items and writes a self-contained HTML chart.

Usage:
  python3 scripts/review_progress.py [OUTPUT.html]   # default: dev/review_progress.html
"""
import glob
import json
import os
import subprocess
import sys
from datetime import datetime

DIRS = ["collections/_definitions", "collections/_distinctions", "collections/_examples"]
ROOT = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True, check=True).stdout.strip()


def git(*args):
    return subprocess.run(["git", "-C", ROOT, *args], capture_output=True, text=True).stdout


def counts_at(commit):
    files = [f for f in git("ls-tree", "-r", "--name-only", commit, "--", *DIRS).split("\n") if f.endswith(".md")]
    unpublished = [f for f in git("grep", "-l", "^published: false", commit, "--", *DIRS).split("\n") if f.endswith(".md")]
    return len(files), len(unpublished)


def counts_now():
    files = [f for d in DIRS for f in glob.glob(os.path.join(ROOT, d, "*.md"))]
    unpublished = 0
    for f in files:
        with open(f, encoding="utf-8") as fh:
            head = fh.read(2000)
        if "\npublished: false" in head:
            unpublished += 1
    return len(files), unpublished


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "dev", "review_progress.html")
    points = []
    log = git("log", "--reverse", "--format=%H %cI %s", "--", *DIRS).strip().split("\n")
    for line in log:
        if not line:
            continue
        sha, date, subject = line.split(" ", 2)
        total, remaining = counts_at(sha)
        if total == 0:
            continue
        points.append({"date": date, "label": subject, "sha": sha[:7], "total": total,
                       "reviewed": total - remaining, "remaining": remaining})
    # Start at the first commit that marked items for review; earlier commits predate the review.
    while points and points[0]["remaining"] == 0:
        points.pop(0)
    total, remaining = counts_now()
    points.append({"date": datetime.now().astimezone().isoformat(timespec="seconds"),
                   "label": "Working tree (uncommitted)", "sha": "", "total": total,
                   "reviewed": total - remaining, "remaining": remaining})
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(TEMPLATE.replace("__DATA__", json.dumps(points)))
    last = points[-1]
    print(f"{out}: {len(points)} points; now {last['reviewed']} reviewed, {last['remaining']} remaining, {last['total']} total")


TEMPLATE = r"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dictionary review progress</title>
<style>
  :root { --surface: #fcfcfb; --ink: #0b0b0b; --ink-2: #52514e; --grid: #e4e3df; --s1: #2a78d6; --s2: #eb6834; }
  @media (prefers-color-scheme: dark) {
    :root { --surface: #1a1a19; --ink: #f0efec; --ink-2: #c3c2b7; --grid: #383835; --s1: #3987e5; --s2: #d95926; color-scheme: dark; }
  }
  body { margin: 0; padding: 24px 16px; background: var(--surface); color: var(--ink); font: 14px/1.4 system-ui, sans-serif; }
  main { max-width: 900px; margin: 0 auto; }
  h1 { font-size: 20px; margin: 0 0 4px; text-align: center; }
  .sub { color: var(--ink-2); text-align: center; margin: 0 0 16px; }
  .tiles { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-bottom: 16px; }
  .tile { min-width: 130px; padding: 8px 12px; border: 1px solid var(--grid); border-radius: 8px; }
  .tile b { display: block; font-size: 22px; }
  .tile span { color: var(--ink-2); }
  .legend { display: flex; gap: 16px; justify-content: center; color: var(--ink-2); margin-bottom: 6px; }
  .key { display: inline-block; width: 14px; height: 3px; border-radius: 2px; vertical-align: middle; margin-right: 6px; }
  .chart { position: relative; }
  svg { width: 100%; height: auto; display: block; }
  .axis text { fill: var(--ink-2); font-size: 11px; }
  .grid line { stroke: var(--grid); }
  .tip { position: absolute; pointer-events: none; background: var(--surface); border: 1px solid var(--grid); border-radius: 6px; padding: 6px 8px; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.15); }
  table { margin: 20px auto 0; border-collapse: collapse; font-size: 12px; }
  td, th { padding: 3px 8px; border-bottom: 1px solid var(--grid); text-align: right; }
  td:first-child, th:first-child { text-align: left; }
  details { margin-top: 16px; }
  summary { cursor: pointer; text-align: center; color: var(--ink-2); }
</style></head>
<body><main>
<h1>Dictionary review progress</h1>
<p class="sub">An item counts as reviewed once it no longer has <code>published: false</code>.</p>
<div class="tiles" id="tiles"></div>
<div class="legend"><span><i class="key" style="background:var(--s1)"></i>Reviewed</span><span><i class="key" style="background:var(--s2)"></i>Remaining</span></div>
<div class="chart"><svg id="svg" viewBox="0 0 900 360" role="img" aria-label="Reviewed and remaining items over time"></svg><div class="tip" id="tip" hidden></div></div>
<details><summary>Table</summary><table id="table"></table></details>
</main>
<script>
const data = __DATA__;
const W = 900, H = 360, m = {l: 48, r: 120, t: 12, b: 32};
const t = data.map(d => new Date(d.date).getTime());
const t0 = Math.min(...t), t1 = Math.max(...t);
const yMax = Math.ceil(Math.max(...data.map(d => Math.max(d.reviewed, d.remaining))) / 100) * 100;
const x = v => m.l + (t1 === t0 ? 0.5 : (v - t0) / (t1 - t0)) * (W - m.l - m.r);
const y = v => H - m.b - v / yMax * (H - m.t - m.b);
const svg = document.getElementById("svg");
const NS = "http://www.w3.org/2000/svg";
const el = (n, a, p = svg) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
const grid = el("g", {class: "grid"}), axis = el("g", {class: "axis"});
for (let v = 0; v <= yMax; v += yMax / 4) {
  el("line", {x1: m.l, x2: W - m.r, y1: y(v), y2: y(v)}, grid);
  el("text", {x: m.l - 6, y: y(v) + 4, "text-anchor": "end"}, axis).textContent = v;
}
const fmt = ms => new Date(ms).toLocaleDateString(undefined, {month: "short", day: "numeric"});
for (let i = 0; i <= 4; i++) {
  const v = t0 + (t1 - t0) * i / 4;
  el("text", {x: x(v), y: H - 10, "text-anchor": "middle"}, axis).textContent = fmt(v);
}
const series = [["reviewed", "var(--s1)", "Reviewed"], ["remaining", "var(--s2)", "Remaining"]];
for (const [k, c, name] of series) {
  el("path", {d: data.map((d, i) => (i ? "L" : "M") + x(t[i]) + " " + y(d[k])).join(" "), fill: "none", stroke: c, "stroke-width": 2, "stroke-linejoin": "round"});
  const last = data[data.length - 1];
  el("circle", {cx: x(t[t.length - 1]), cy: y(last[k]), r: 4, fill: c, stroke: "var(--surface)", "stroke-width": 2});
  el("text", {x: x(t[t.length - 1]) + 8, y: y(last[k]) + 4, fill: "var(--ink)", "font-size": 12}).textContent = name + " " + last[k];
}
const cross = el("line", {y1: m.t, y2: H - m.b, stroke: "var(--ink-2)", "stroke-dasharray": "3 3", visibility: "hidden"});
const dots = series.map(([k, c]) => el("circle", {r: 4, fill: c, stroke: "var(--surface)", "stroke-width": 2, visibility: "hidden"}));
const tip = document.getElementById("tip");
svg.addEventListener("mousemove", ev => {
  const r = svg.getBoundingClientRect(), px = (ev.clientX - r.left) * W / r.width;
  let i = 0; for (let j = 1; j < t.length; j++) if (Math.abs(x(t[j]) - px) < Math.abs(x(t[i]) - px)) i = j;
  const d = data[i];
  cross.setAttribute("x1", x(t[i])); cross.setAttribute("x2", x(t[i])); cross.setAttribute("visibility", "visible");
  series.forEach(([k], n) => { dots[n].setAttribute("cx", x(t[i])); dots[n].setAttribute("cy", y(d[k])); dots[n].setAttribute("visibility", "visible"); });
  tip.hidden = false;
  tip.innerHTML = `<b>${new Date(d.date).toLocaleString()}</b><br>${d.label}${d.sha ? " (" + d.sha + ")" : ""}<br>Reviewed ${d.reviewed} · Remaining ${d.remaining} · Total ${d.total}`;
  const left = x(t[i]) / W * r.width;
  tip.style.left = Math.min(left + 12, r.width - 260) + "px"; tip.style.top = "8px";
});
svg.addEventListener("mouseleave", () => { tip.hidden = true; cross.setAttribute("visibility", "hidden"); dots.forEach(d => d.setAttribute("visibility", "hidden")); });
const last = data[data.length - 1];
document.getElementById("tiles").innerHTML = [["Reviewed", last.reviewed], ["Remaining", last.remaining], ["Total", last.total], ["Done", Math.round(100 * last.reviewed / last.total) + "%"]]
  .map(([a, b]) => `<div class="tile"><b>${b}</b><span>${a}</span></div>`).join("");
document.getElementById("table").innerHTML = "<tr><th>Date</th><th>Commit</th><th>Reviewed</th><th>Remaining</th><th>Total</th></tr>" +
  data.map(d => `<tr><td>${new Date(d.date).toLocaleDateString()}</td><td>${d.sha || "now"}</td><td>${d.reviewed}</td><td>${d.remaining}</td><td>${d.total}</td></tr>`).join("");
</script></body></html>
"""

if __name__ == "__main__":
    main()
