let sq = (x) => x * x

let distPointToPoint = ([ax, ay], [bx, by]) =>
  Math.sqrt(sq(ax - bx) + sq(ay - by))


let distPointToParabol = (a, f) => {
  let p = distPointToPoint(a, f)

  return p==0 ? Infinity : sq(p) / (2 * Math.abs(a[1] - f[1]))
}

let circumCenter = (a, b, c)  => {
  let d = (a[0]-c[0])*(b[1]-c[1])-(b[0]-c[0])*(a[1]-c[1])

  if (d == 0) return [Infinity, Infinity]

  let xc = (((a[0]-c[0])*(a[0]+c[0])+(a[1]-c[1])*(a[1]+c[1]))/2*(b[1]-c[1])-((b[0]-c[0])*(b[0]+c[0])+(b[1]-c[1])*(b[1]+c[1]))/2*(a[1]-c[1]))/d
  let yc = (((b[0]-c[0])*(b[0]+c[0])+(b[1]-c[1])*(b[1]+c[1]))/2*(a[0]-c[0])-((a[0]-c[0])*(a[0]+c[0])+(a[1]-c[1])*(a[1]+c[1]))/2*(b[0]-c[0]))/d
  return [xc, yc]
}

let parabolsCrossX = (fa, fb, q) => {
  if(fa[1]===fb[1]) return [(fa[0]+fb[0])/2, (fa[0]+fb[0])/2]

  let s1=(fa[1]*fb[0]-fa[0]*fb[1]+fa[0]*q-fb[0]*q+Math.sqrt((fa[0]*fa[0]+fa[1]*fa[1]-2*fa[0]*fb[0]+fb[0]*fb[0]-2*fa[1]*fb[1]+fb[1]*fb[1])*(fa[1]*fb[1]-fa[1]*q-fb[1]*q+q*q)))/(fa[1]-fb[1])
  let s2=(fa[1]*fb[0]-fa[0]*fb[1]+fa[0]*q-fb[0]*q-Math.sqrt((fa[0]*fa[0]+fa[1]*fa[1]-2*fa[0]*fb[0]+fb[0]*fb[0]-2*fa[1]*fb[1]+fb[1]*fb[1])*(fa[1]*fb[1]-fa[1]*q-fb[1]*q+q*q)))/(fa[1]-fb[1])

  return (s1<s2) ? [s1,s2] : [s2, s1]
}

let doHalflinesCross = (sa, sb, approx = 1e-10) => { //sa, sb are Segment instance
  let dx = sb.ps[0] - sa.ps[0]
  let dy = sb.ps[1] - sa.ps[1]

  if (sa.m == Infinity) return sa.hp*(sb.m*dx-dy)<=approx && sb.vec[0]*dx<=approx
  if (sb.m == Infinity) return sb.hp*(sa.m*dx-dy)>=-approx && sa.vec[0]*dx>=-approx

  let det = sb.vec[0] * sa.vec[1] - sb.vec[1] * sa.vec[0]

  if (det===0) return false

  let u = (dy * sb.vec[0] - dx * sb.vec[1])/det
  let v = (dy * sa.vec[0] - dx * sa.vec[1])/det

  return (u>=-approx && v>=approx) || (u>=approx && v>=-approx)
}

export default { distPointToPoint, distPointToParabol, circumCenter,
  parabolsCrossX, doHalflinesCross }