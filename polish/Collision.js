
function _pt(o){ return Array.isArray(o) ? {x:o[0], y:o[1]} : o; }

function closestPointOnSegment(ax, ay, bx, by, px, py) {
  const abx = bx - ax, aby = by - ay;
  const apx = px - ax, apy = py - ay;
  const ab2 = abx*abx + aby*aby;
  let t = (ab2 === 0) ? 0 : (apx*abx + apy*aby) / ab2;
  t = Math.max(0, Math.min(1, t));
  return { x: ax + abx * t, y: ay + aby * t, t };
}

function circleIntersectsSegment(cx, cy, r, ax, ay, bx, by) {
  const q = closestPointOnSegment(ax, ay, bx, by, cx, cy);
  const dx = cx - q.x, dy = cy - q.y;
  return (dx*dx + dy*dy) <= r*r;
}

function circleIntersectsPolyline(cx, cy, r, pts) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = _pt(pts[i]), b = _pt(pts[i+1]);
    if (circleIntersectsSegment(cx, cy, r, a.x, a.y, b.x, b.y)) return true;
  }
  return false;
}

function collideCaveCircle(cx, cy, r, topPts, botPts) {
  return circleIntersectsPolyline(cx, cy, r, topPts) || circleIntersectsPolyline(cx, cy, r, botPts);
}

function noseProbeHit(cx, cy, ang, r, ptsTop, ptsBot, probeLen=1.1*r) {
  const nx = cx + Math.cos(ang) * (r + probeLen);
  const ny = cy + Math.sin(ang) * (r + probeLen);
  return circleIntersectsPolyline(nx, ny, r*0.35, ptsTop) || circleIntersectsPolyline(nx, ny, r*0.35, ptsBot);
}
