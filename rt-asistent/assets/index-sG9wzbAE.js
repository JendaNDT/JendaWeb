const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/pdfmake-Q44JKpeV.js","assets/_commonjsHelpers-BFTU3MAI.js","assets/vfs_fonts-DYgd5Mxl.js"])))=>i.map(i=>d[i]);
true              &&(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
}());

/*!
 * Chart.js v3.7.1
 * https://www.chartjs.org
 * (c) 2022 Chart.js Contributors
 * Released under the MIT License
 */
const requestAnimFrame = (function() {
  if (typeof window === 'undefined') {
    return function(callback) {
      return callback();
    };
  }
  return window.requestAnimationFrame;
}());
function throttled(fn, thisArg, updateFn) {
  const updateArgs = updateFn || ((args) => Array.prototype.slice.call(args));
  let ticking = false;
  let args = [];
  return function(...rest) {
    args = updateArgs(rest);
    if (!ticking) {
      ticking = true;
      requestAnimFrame.call(window, () => {
        ticking = false;
        fn.apply(thisArg, args);
      });
    }
  };
}
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    if (delay) {
      clearTimeout(timeout);
      timeout = setTimeout(fn, delay, args);
    } else {
      fn.apply(this, args);
    }
    return delay;
  };
}
const _toLeftRightCenter = (align) => align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
const _alignStartEnd = (align, start, end) => align === 'start' ? start : align === 'end' ? end : (start + end) / 2;
const _textX = (align, left, right, rtl) => {
  const check = rtl ? 'left' : 'right';
  return align === check ? right : align === 'center' ? (left + right) / 2 : left;
};

function noop() {}
const uid = (function() {
  let id = 0;
  return function() {
    return id++;
  };
}());
function isNullOrUndef(value) {
  return value === null || typeof value === 'undefined';
}
function isArray(value) {
  if (Array.isArray && Array.isArray(value)) {
    return true;
  }
  const type = Object.prototype.toString.call(value);
  if (type.substr(0, 7) === '[object' && type.substr(-6) === 'Array]') {
    return true;
  }
  return false;
}
function isObject(value) {
  return value !== null && Object.prototype.toString.call(value) === '[object Object]';
}
const isNumberFinite = (value) => (typeof value === 'number' || value instanceof Number) && isFinite(+value);
function finiteOrDefault(value, defaultValue) {
  return isNumberFinite(value) ? value : defaultValue;
}
function valueOrDefault(value, defaultValue) {
  return typeof value === 'undefined' ? defaultValue : value;
}
const toPercentage = (value, dimension) =>
  typeof value === 'string' && value.endsWith('%') ?
    parseFloat(value) / 100
    : value / dimension;
const toDimension = (value, dimension) =>
  typeof value === 'string' && value.endsWith('%') ?
    parseFloat(value) / 100 * dimension
    : +value;
function callback(fn, args, thisArg) {
  if (fn && typeof fn.call === 'function') {
    return fn.apply(thisArg, args);
  }
}
function each(loopable, fn, thisArg, reverse) {
  let i, len, keys;
  if (isArray(loopable)) {
    len = loopable.length;
    {
      for (i = 0; i < len; i++) {
        fn.call(thisArg, loopable[i], i);
      }
    }
  } else if (isObject(loopable)) {
    keys = Object.keys(loopable);
    len = keys.length;
    for (i = 0; i < len; i++) {
      fn.call(thisArg, loopable[keys[i]], keys[i]);
    }
  }
}
function _elementsEqual(a0, a1) {
  let i, ilen, v0, v1;
  if (!a0 || !a1 || a0.length !== a1.length) {
    return false;
  }
  for (i = 0, ilen = a0.length; i < ilen; ++i) {
    v0 = a0[i];
    v1 = a1[i];
    if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
      return false;
    }
  }
  return true;
}
function clone$1(source) {
  if (isArray(source)) {
    return source.map(clone$1);
  }
  if (isObject(source)) {
    const target = Object.create(null);
    const keys = Object.keys(source);
    const klen = keys.length;
    let k = 0;
    for (; k < klen; ++k) {
      target[keys[k]] = clone$1(source[keys[k]]);
    }
    return target;
  }
  return source;
}
function isValidKey(key) {
  return ['__proto__', 'prototype', 'constructor'].indexOf(key) === -1;
}
function _merger(key, target, source, options) {
  if (!isValidKey(key)) {
    return;
  }
  const tval = target[key];
  const sval = source[key];
  if (isObject(tval) && isObject(sval)) {
    merge$1(tval, sval, options);
  } else {
    target[key] = clone$1(sval);
  }
}
function merge$1(target, source, options) {
  const sources = isArray(source) ? source : [source];
  const ilen = sources.length;
  if (!isObject(target)) {
    return target;
  }
  options = options || {};
  const merger = options.merger || _merger;
  for (let i = 0; i < ilen; ++i) {
    source = sources[i];
    if (!isObject(source)) {
      continue;
    }
    const keys = Object.keys(source);
    for (let k = 0, klen = keys.length; k < klen; ++k) {
      merger(keys[k], target, source, options);
    }
  }
  return target;
}
function mergeIf(target, source) {
  return merge$1(target, source, {merger: _mergerIf});
}
function _mergerIf(key, target, source) {
  if (!isValidKey(key)) {
    return;
  }
  const tval = target[key];
  const sval = source[key];
  if (isObject(tval) && isObject(sval)) {
    mergeIf(tval, sval);
  } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = clone$1(sval);
  }
}
const emptyString = '';
const dot = '.';
function indexOfDotOrLength(key, start) {
  const idx = key.indexOf(dot, start);
  return idx === -1 ? key.length : idx;
}
function resolveObjectKey(obj, key) {
  if (key === emptyString) {
    return obj;
  }
  let pos = 0;
  let idx = indexOfDotOrLength(key, pos);
  while (obj && idx > pos) {
    obj = obj[key.substr(pos, idx - pos)];
    pos = idx + 1;
    idx = indexOfDotOrLength(key, pos);
  }
  return obj;
}
function _capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const defined = (value) => typeof value !== 'undefined';
const isFunction = (value) => typeof value === 'function';
const setsEqual = (a, b) => {
  if (a.size !== b.size) {
    return false;
  }
  for (const item of a) {
    if (!b.has(item)) {
      return false;
    }
  }
  return true;
};
function _isClickEvent(e) {
  return e.type === 'mouseup' || e.type === 'click' || e.type === 'contextmenu';
}

const PI = Math.PI;
const TAU = 2 * PI;
const PITAU = TAU + PI;
const INFINITY = Number.POSITIVE_INFINITY;
const RAD_PER_DEG = PI / 180;
const HALF_PI = PI / 2;
const QUARTER_PI = PI / 4;
const TWO_THIRDS_PI = PI * 2 / 3;
const log10 = Math.log10;
const sign = Math.sign;
function niceNum(range) {
  const roundedRange = Math.round(range);
  range = almostEquals(range, roundedRange, range / 1000) ? roundedRange : range;
  const niceRange = Math.pow(10, Math.floor(log10(range)));
  const fraction = range / niceRange;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * niceRange;
}
function _factorize(value) {
  const result = [];
  const sqrt = Math.sqrt(value);
  let i;
  for (i = 1; i < sqrt; i++) {
    if (value % i === 0) {
      result.push(i);
      result.push(value / i);
    }
  }
  if (sqrt === (sqrt | 0)) {
    result.push(sqrt);
  }
  result.sort((a, b) => a - b).pop();
  return result;
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function almostEquals(x, y, epsilon) {
  return Math.abs(x - y) < epsilon;
}
function almostWhole(x, epsilon) {
  const rounded = Math.round(x);
  return ((rounded - epsilon) <= x) && ((rounded + epsilon) >= x);
}
function _setMinAndMaxByKey(array, target, property) {
  let i, ilen, value;
  for (i = 0, ilen = array.length; i < ilen; i++) {
    value = array[i][property];
    if (!isNaN(value)) {
      target.min = Math.min(target.min, value);
      target.max = Math.max(target.max, value);
    }
  }
}
function toRadians(degrees) {
  return degrees * (PI / 180);
}
function toDegrees(radians) {
  return radians * (180 / PI);
}
function _decimalPlaces(x) {
  if (!isNumberFinite(x)) {
    return;
  }
  let e = 1;
  let p = 0;
  while (Math.round(x * e) / e !== x) {
    e *= 10;
    p++;
  }
  return p;
}
function getAngleFromPoint(centrePoint, anglePoint) {
  const distanceFromXCenter = anglePoint.x - centrePoint.x;
  const distanceFromYCenter = anglePoint.y - centrePoint.y;
  const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
  let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
  if (angle < (-0.5 * PI)) {
    angle += TAU;
  }
  return {
    angle,
    distance: radialDistanceFromCenter
  };
}
function distanceBetweenPoints(pt1, pt2) {
  return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}
function _angleDiff(a, b) {
  return (a - b + PITAU) % TAU - PI;
}
function _normalizeAngle(a) {
  return (a % TAU + TAU) % TAU;
}
function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
  const a = _normalizeAngle(angle);
  const s = _normalizeAngle(start);
  const e = _normalizeAngle(end);
  const angleToStart = _normalizeAngle(s - a);
  const angleToEnd = _normalizeAngle(e - a);
  const startToAngle = _normalizeAngle(a - s);
  const endToAngle = _normalizeAngle(a - e);
  return a === s || a === e || (sameAngleIsFullCircle && s === e)
    || (angleToStart > angleToEnd && startToAngle < endToAngle);
}
function _limitValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function _int16Range(value) {
  return _limitValue(value, -32768, 32767);
}
function _isBetween(value, start, end, epsilon = 1e-6) {
  return value >= Math.min(start, end) - epsilon && value <= Math.max(start, end) + epsilon;
}

const atEdge = (t) => t === 0 || t === 1;
const elasticIn = (t, s, p) => -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
const elasticOut = (t, s, p) => Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
const effects = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => -t * (t - 2),
  easeInOutQuad: t => ((t /= 0.5) < 1)
    ? 0.5 * t * t
    : -0.5 * ((--t) * (t - 2) - 1),
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (t -= 1) * t * t + 1,
  easeInOutCubic: t => ((t /= 0.5) < 1)
    ? 0.5 * t * t * t
    : 0.5 * ((t -= 2) * t * t + 2),
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => -((t -= 1) * t * t * t - 1),
  easeInOutQuart: t => ((t /= 0.5) < 1)
    ? 0.5 * t * t * t * t
    : -0.5 * ((t -= 2) * t * t * t - 2),
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => (t -= 1) * t * t * t * t + 1,
  easeInOutQuint: t => ((t /= 0.5) < 1)
    ? 0.5 * t * t * t * t * t
    : 0.5 * ((t -= 2) * t * t * t * t + 2),
  easeInSine: t => -Math.cos(t * HALF_PI) + 1,
  easeOutSine: t => Math.sin(t * HALF_PI),
  easeInOutSine: t => -0.5 * (Math.cos(PI * t) - 1),
  easeInExpo: t => (t === 0) ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: t => (t === 1) ? 1 : -Math.pow(2, -10 * t) + 1,
  easeInOutExpo: t => atEdge(t) ? t : t < 0.5
    ? 0.5 * Math.pow(2, 10 * (t * 2 - 1))
    : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
  easeInCirc: t => (t >= 1) ? t : -(Math.sqrt(1 - t * t) - 1),
  easeOutCirc: t => Math.sqrt(1 - (t -= 1) * t),
  easeInOutCirc: t => ((t /= 0.5) < 1)
    ? -0.5 * (Math.sqrt(1 - t * t) - 1)
    : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
  easeInElastic: t => atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
  easeOutElastic: t => atEdge(t) ? t : elasticOut(t, 0.075, 0.3),
  easeInOutElastic(t) {
    const s = 0.1125;
    const p = 0.45;
    return atEdge(t) ? t :
      t < 0.5
        ? 0.5 * elasticIn(t * 2, s, p)
        : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
  },
  easeInBack(t) {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
  },
  easeOutBack(t) {
    const s = 1.70158;
    return (t -= 1) * t * ((s + 1) * t + s) + 1;
  },
  easeInOutBack(t) {
    let s = 1.70158;
    if ((t /= 0.5) < 1) {
      return 0.5 * (t * t * (((s *= (1.525)) + 1) * t - s));
    }
    return 0.5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
  },
  easeInBounce: t => 1 - effects.easeOutBounce(1 - t),
  easeOutBounce(t) {
    const m = 7.5625;
    const d = 2.75;
    if (t < (1 / d)) {
      return m * t * t;
    }
    if (t < (2 / d)) {
      return m * (t -= (1.5 / d)) * t + 0.75;
    }
    if (t < (2.5 / d)) {
      return m * (t -= (2.25 / d)) * t + 0.9375;
    }
    return m * (t -= (2.625 / d)) * t + 0.984375;
  },
  easeInOutBounce: t => (t < 0.5)
    ? effects.easeInBounce(t * 2) * 0.5
    : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5,
};

/*!
 * @kurkle/color v0.1.9
 * https://github.com/kurkle/color#readme
 * (c) 2020 Jukka Kurkela
 * Released under the MIT License
 */
const map$1 = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15};
const hex = '0123456789ABCDEF';
const h1 = (b) => hex[b & 0xF];
const h2 = (b) => hex[(b & 0xF0) >> 4] + hex[b & 0xF];
const eq = (b) => (((b & 0xF0) >> 4) === (b & 0xF));
function isShort(v) {
	return eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
}
function hexParse(str) {
	var len = str.length;
	var ret;
	if (str[0] === '#') {
		if (len === 4 || len === 5) {
			ret = {
				r: 255 & map$1[str[1]] * 17,
				g: 255 & map$1[str[2]] * 17,
				b: 255 & map$1[str[3]] * 17,
				a: len === 5 ? map$1[str[4]] * 17 : 255
			};
		} else if (len === 7 || len === 9) {
			ret = {
				r: map$1[str[1]] << 4 | map$1[str[2]],
				g: map$1[str[3]] << 4 | map$1[str[4]],
				b: map$1[str[5]] << 4 | map$1[str[6]],
				a: len === 9 ? (map$1[str[7]] << 4 | map$1[str[8]]) : 255
			};
		}
	}
	return ret;
}
function hexString(v) {
	var f = isShort(v) ? h1 : h2;
	return v
		? '#' + f(v.r) + f(v.g) + f(v.b) + (v.a < 255 ? f(v.a) : '')
		: v;
}
function round(v) {
	return v + 0.5 | 0;
}
const lim = (v, l, h) => Math.max(Math.min(v, h), l);
function p2b(v) {
	return lim(round(v * 2.55), 0, 255);
}
function n2b(v) {
	return lim(round(v * 255), 0, 255);
}
function b2n(v) {
	return lim(round(v / 2.55) / 100, 0, 1);
}
function n2p(v) {
	return lim(round(v * 100), 0, 100);
}
const RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function rgbParse(str) {
	const m = RGB_RE.exec(str);
	let a = 255;
	let r, g, b;
	if (!m) {
		return;
	}
	if (m[7] !== r) {
		const v = +m[7];
		a = 255 & (m[8] ? p2b(v) : v * 255);
	}
	r = +m[1];
	g = +m[3];
	b = +m[5];
	r = 255 & (m[2] ? p2b(r) : r);
	g = 255 & (m[4] ? p2b(g) : g);
	b = 255 & (m[6] ? p2b(b) : b);
	return {
		r: r,
		g: g,
		b: b,
		a: a
	};
}
function rgbString(v) {
	return v && (
		v.a < 255
			? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})`
			: `rgb(${v.r}, ${v.g}, ${v.b})`
	);
}
const HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function hsl2rgbn(h, s, l) {
	const a = s * Math.min(l, 1 - l);
	const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	return [f(0), f(8), f(4)];
}
function hsv2rgbn(h, s, v) {
	const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
	return [f(5), f(3), f(1)];
}
function hwb2rgbn(h, w, b) {
	const rgb = hsl2rgbn(h, 1, 0.5);
	let i;
	if (w + b > 1) {
		i = 1 / (w + b);
		w *= i;
		b *= i;
	}
	for (i = 0; i < 3; i++) {
		rgb[i] *= 1 - w - b;
		rgb[i] += w;
	}
	return rgb;
}
function rgb2hsl(v) {
	const range = 255;
	const r = v.r / range;
	const g = v.g / range;
	const b = v.b / range;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	let h, s, d;
	if (max !== min) {
		d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		h = max === r
			? ((g - b) / d) + (g < b ? 6 : 0)
			: max === g
				? (b - r) / d + 2
				: (r - g) / d + 4;
		h = h * 60 + 0.5;
	}
	return [h | 0, s || 0, l];
}
function calln(f, a, b, c) {
	return (
		Array.isArray(a)
			? f(a[0], a[1], a[2])
			: f(a, b, c)
	).map(n2b);
}
function hsl2rgb(h, s, l) {
	return calln(hsl2rgbn, h, s, l);
}
function hwb2rgb(h, w, b) {
	return calln(hwb2rgbn, h, w, b);
}
function hsv2rgb(h, s, v) {
	return calln(hsv2rgbn, h, s, v);
}
function hue(h) {
	return (h % 360 + 360) % 360;
}
function hueParse(str) {
	const m = HUE_RE.exec(str);
	let a = 255;
	let v;
	if (!m) {
		return;
	}
	if (m[5] !== v) {
		a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
	}
	const h = hue(+m[2]);
	const p1 = +m[3] / 100;
	const p2 = +m[4] / 100;
	if (m[1] === 'hwb') {
		v = hwb2rgb(h, p1, p2);
	} else if (m[1] === 'hsv') {
		v = hsv2rgb(h, p1, p2);
	} else {
		v = hsl2rgb(h, p1, p2);
	}
	return {
		r: v[0],
		g: v[1],
		b: v[2],
		a: a
	};
}
function rotate(v, deg) {
	var h = rgb2hsl(v);
	h[0] = hue(h[0] + deg);
	h = hsl2rgb(h);
	v.r = h[0];
	v.g = h[1];
	v.b = h[2];
}
function hslString(v) {
	if (!v) {
		return;
	}
	const a = rgb2hsl(v);
	const h = a[0];
	const s = n2p(a[1]);
	const l = n2p(a[2]);
	return v.a < 255
		? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})`
		: `hsl(${h}, ${s}%, ${l}%)`;
}
const map$1$1 = {
	x: 'dark',
	Z: 'light',
	Y: 're',
	X: 'blu',
	W: 'gr',
	V: 'medium',
	U: 'slate',
	A: 'ee',
	T: 'ol',
	S: 'or',
	B: 'ra',
	C: 'lateg',
	D: 'ights',
	R: 'in',
	Q: 'turquois',
	E: 'hi',
	P: 'ro',
	O: 'al',
	N: 'le',
	M: 'de',
	L: 'yello',
	F: 'en',
	K: 'ch',
	G: 'arks',
	H: 'ea',
	I: 'ightg',
	J: 'wh'
};
const names = {
	OiceXe: 'f0f8ff',
	antiquewEte: 'faebd7',
	aqua: 'ffff',
	aquamarRe: '7fffd4',
	azuY: 'f0ffff',
	beige: 'f5f5dc',
	bisque: 'ffe4c4',
	black: '0',
	blanKedOmond: 'ffebcd',
	Xe: 'ff',
	XeviTet: '8a2be2',
	bPwn: 'a52a2a',
	burlywood: 'deb887',
	caMtXe: '5f9ea0',
	KartYuse: '7fff00',
	KocTate: 'd2691e',
	cSO: 'ff7f50',
	cSnflowerXe: '6495ed',
	cSnsilk: 'fff8dc',
	crimson: 'dc143c',
	cyan: 'ffff',
	xXe: '8b',
	xcyan: '8b8b',
	xgTMnPd: 'b8860b',
	xWay: 'a9a9a9',
	xgYF: '6400',
	xgYy: 'a9a9a9',
	xkhaki: 'bdb76b',
	xmagFta: '8b008b',
	xTivegYF: '556b2f',
	xSange: 'ff8c00',
	xScEd: '9932cc',
	xYd: '8b0000',
	xsOmon: 'e9967a',
	xsHgYF: '8fbc8f',
	xUXe: '483d8b',
	xUWay: '2f4f4f',
	xUgYy: '2f4f4f',
	xQe: 'ced1',
	xviTet: '9400d3',
	dAppRk: 'ff1493',
	dApskyXe: 'bfff',
	dimWay: '696969',
	dimgYy: '696969',
	dodgerXe: '1e90ff',
	fiYbrick: 'b22222',
	flSOwEte: 'fffaf0',
	foYstWAn: '228b22',
	fuKsia: 'ff00ff',
	gaRsbSo: 'dcdcdc',
	ghostwEte: 'f8f8ff',
	gTd: 'ffd700',
	gTMnPd: 'daa520',
	Way: '808080',
	gYF: '8000',
	gYFLw: 'adff2f',
	gYy: '808080',
	honeyMw: 'f0fff0',
	hotpRk: 'ff69b4',
	RdianYd: 'cd5c5c',
	Rdigo: '4b0082',
	ivSy: 'fffff0',
	khaki: 'f0e68c',
	lavFMr: 'e6e6fa',
	lavFMrXsh: 'fff0f5',
	lawngYF: '7cfc00',
	NmoncEffon: 'fffacd',
	ZXe: 'add8e6',
	ZcSO: 'f08080',
	Zcyan: 'e0ffff',
	ZgTMnPdLw: 'fafad2',
	ZWay: 'd3d3d3',
	ZgYF: '90ee90',
	ZgYy: 'd3d3d3',
	ZpRk: 'ffb6c1',
	ZsOmon: 'ffa07a',
	ZsHgYF: '20b2aa',
	ZskyXe: '87cefa',
	ZUWay: '778899',
	ZUgYy: '778899',
	ZstAlXe: 'b0c4de',
	ZLw: 'ffffe0',
	lime: 'ff00',
	limegYF: '32cd32',
	lRF: 'faf0e6',
	magFta: 'ff00ff',
	maPon: '800000',
	VaquamarRe: '66cdaa',
	VXe: 'cd',
	VScEd: 'ba55d3',
	VpurpN: '9370db',
	VsHgYF: '3cb371',
	VUXe: '7b68ee',
	VsprRggYF: 'fa9a',
	VQe: '48d1cc',
	VviTetYd: 'c71585',
	midnightXe: '191970',
	mRtcYam: 'f5fffa',
	mistyPse: 'ffe4e1',
	moccasR: 'ffe4b5',
	navajowEte: 'ffdead',
	navy: '80',
	Tdlace: 'fdf5e6',
	Tive: '808000',
	TivedBb: '6b8e23',
	Sange: 'ffa500',
	SangeYd: 'ff4500',
	ScEd: 'da70d6',
	pOegTMnPd: 'eee8aa',
	pOegYF: '98fb98',
	pOeQe: 'afeeee',
	pOeviTetYd: 'db7093',
	papayawEp: 'ffefd5',
	pHKpuff: 'ffdab9',
	peru: 'cd853f',
	pRk: 'ffc0cb',
	plum: 'dda0dd',
	powMrXe: 'b0e0e6',
	purpN: '800080',
	YbeccapurpN: '663399',
	Yd: 'ff0000',
	Psybrown: 'bc8f8f',
	PyOXe: '4169e1',
	saddNbPwn: '8b4513',
	sOmon: 'fa8072',
	sandybPwn: 'f4a460',
	sHgYF: '2e8b57',
	sHshell: 'fff5ee',
	siFna: 'a0522d',
	silver: 'c0c0c0',
	skyXe: '87ceeb',
	UXe: '6a5acd',
	UWay: '708090',
	UgYy: '708090',
	snow: 'fffafa',
	sprRggYF: 'ff7f',
	stAlXe: '4682b4',
	tan: 'd2b48c',
	teO: '8080',
	tEstN: 'd8bfd8',
	tomato: 'ff6347',
	Qe: '40e0d0',
	viTet: 'ee82ee',
	JHt: 'f5deb3',
	wEte: 'ffffff',
	wEtesmoke: 'f5f5f5',
	Lw: 'ffff00',
	LwgYF: '9acd32'
};
function unpack() {
	const unpacked = {};
	const keys = Object.keys(names);
	const tkeys = Object.keys(map$1$1);
	let i, j, k, ok, nk;
	for (i = 0; i < keys.length; i++) {
		ok = nk = keys[i];
		for (j = 0; j < tkeys.length; j++) {
			k = tkeys[j];
			nk = nk.replace(k, map$1$1[k]);
		}
		k = parseInt(names[ok], 16);
		unpacked[nk] = [k >> 16 & 0xFF, k >> 8 & 0xFF, k & 0xFF];
	}
	return unpacked;
}
let names$1;
function nameParse(str) {
	if (!names$1) {
		names$1 = unpack();
		names$1.transparent = [0, 0, 0, 0];
	}
	const a = names$1[str.toLowerCase()];
	return a && {
		r: a[0],
		g: a[1],
		b: a[2],
		a: a.length === 4 ? a[3] : 255
	};
}
function modHSL(v, i, ratio) {
	if (v) {
		let tmp = rgb2hsl(v);
		tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
		tmp = hsl2rgb(tmp);
		v.r = tmp[0];
		v.g = tmp[1];
		v.b = tmp[2];
	}
}
function clone$2(v, proto) {
	return v ? Object.assign(proto || {}, v) : v;
}
function fromObject(input) {
	var v = {r: 0, g: 0, b: 0, a: 255};
	if (Array.isArray(input)) {
		if (input.length >= 3) {
			v = {r: input[0], g: input[1], b: input[2], a: 255};
			if (input.length > 3) {
				v.a = n2b(input[3]);
			}
		}
	} else {
		v = clone$2(input, {r: 0, g: 0, b: 0, a: 1});
		v.a = n2b(v.a);
	}
	return v;
}
function functionParse(str) {
	if (str.charAt(0) === 'r') {
		return rgbParse(str);
	}
	return hueParse(str);
}
class Color {
	constructor(input) {
		if (input instanceof Color) {
			return input;
		}
		const type = typeof input;
		let v;
		if (type === 'object') {
			v = fromObject(input);
		} else if (type === 'string') {
			v = hexParse(input) || nameParse(input) || functionParse(input);
		}
		this._rgb = v;
		this._valid = !!v;
	}
	get valid() {
		return this._valid;
	}
	get rgb() {
		var v = clone$2(this._rgb);
		if (v) {
			v.a = b2n(v.a);
		}
		return v;
	}
	set rgb(obj) {
		this._rgb = fromObject(obj);
	}
	rgbString() {
		return this._valid ? rgbString(this._rgb) : this._rgb;
	}
	hexString() {
		return this._valid ? hexString(this._rgb) : this._rgb;
	}
	hslString() {
		return this._valid ? hslString(this._rgb) : this._rgb;
	}
	mix(color, weight) {
		const me = this;
		if (color) {
			const c1 = me.rgb;
			const c2 = color.rgb;
			let w2;
			const p = weight === w2 ? 0.5 : weight;
			const w = 2 * p - 1;
			const a = c1.a - c2.a;
			const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
			w2 = 1 - w1;
			c1.r = 0xFF & w1 * c1.r + w2 * c2.r + 0.5;
			c1.g = 0xFF & w1 * c1.g + w2 * c2.g + 0.5;
			c1.b = 0xFF & w1 * c1.b + w2 * c2.b + 0.5;
			c1.a = p * c1.a + (1 - p) * c2.a;
			me.rgb = c1;
		}
		return me;
	}
	clone() {
		return new Color(this.rgb);
	}
	alpha(a) {
		this._rgb.a = n2b(a);
		return this;
	}
	clearer(ratio) {
		const rgb = this._rgb;
		rgb.a *= 1 - ratio;
		return this;
	}
	greyscale() {
		const rgb = this._rgb;
		const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
		rgb.r = rgb.g = rgb.b = val;
		return this;
	}
	opaquer(ratio) {
		const rgb = this._rgb;
		rgb.a *= 1 + ratio;
		return this;
	}
	negate() {
		const v = this._rgb;
		v.r = 255 - v.r;
		v.g = 255 - v.g;
		v.b = 255 - v.b;
		return this;
	}
	lighten(ratio) {
		modHSL(this._rgb, 2, ratio);
		return this;
	}
	darken(ratio) {
		modHSL(this._rgb, 2, -ratio);
		return this;
	}
	saturate(ratio) {
		modHSL(this._rgb, 1, ratio);
		return this;
	}
	desaturate(ratio) {
		modHSL(this._rgb, 1, -ratio);
		return this;
	}
	rotate(deg) {
		rotate(this._rgb, deg);
		return this;
	}
}
function index_esm(input) {
	return new Color(input);
}

const isPatternOrGradient = (value) => value instanceof CanvasGradient || value instanceof CanvasPattern;
function color(value) {
  return isPatternOrGradient(value) ? value : index_esm(value);
}
function getHoverColor(value) {
  return isPatternOrGradient(value)
    ? value
    : index_esm(value).saturate(0.5).darken(0.1).hexString();
}

const overrides = Object.create(null);
const descriptors = Object.create(null);
function getScope$1(node, key) {
  if (!key) {
    return node;
  }
  const keys = key.split('.');
  for (let i = 0, n = keys.length; i < n; ++i) {
    const k = keys[i];
    node = node[k] || (node[k] = Object.create(null));
  }
  return node;
}
function set(root, scope, values) {
  if (typeof scope === 'string') {
    return merge$1(getScope$1(root, scope), values);
  }
  return merge$1(getScope$1(root, ''), scope);
}
class Defaults {
  constructor(_descriptors) {
    this.animation = undefined;
    this.backgroundColor = 'rgba(0,0,0,0.1)';
    this.borderColor = 'rgba(0,0,0,0.1)';
    this.color = '#666';
    this.datasets = {};
    this.devicePixelRatio = (context) => context.chart.platform.getDevicePixelRatio();
    this.elements = {};
    this.events = [
      'mousemove',
      'mouseout',
      'click',
      'touchstart',
      'touchmove'
    ];
    this.font = {
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      style: 'normal',
      lineHeight: 1.2,
      weight: null
    };
    this.hover = {};
    this.hoverBackgroundColor = (ctx, options) => getHoverColor(options.backgroundColor);
    this.hoverBorderColor = (ctx, options) => getHoverColor(options.borderColor);
    this.hoverColor = (ctx, options) => getHoverColor(options.color);
    this.indexAxis = 'x';
    this.interaction = {
      mode: 'nearest',
      intersect: true
    };
    this.maintainAspectRatio = true;
    this.onHover = null;
    this.onClick = null;
    this.parsing = true;
    this.plugins = {};
    this.responsive = true;
    this.scale = undefined;
    this.scales = {};
    this.showLine = true;
    this.drawActiveElementsOnTop = true;
    this.describe(_descriptors);
  }
  set(scope, values) {
    return set(this, scope, values);
  }
  get(scope) {
    return getScope$1(this, scope);
  }
  describe(scope, values) {
    return set(descriptors, scope, values);
  }
  override(scope, values) {
    return set(overrides, scope, values);
  }
  route(scope, name, targetScope, targetName) {
    const scopeObject = getScope$1(this, scope);
    const targetScopeObject = getScope$1(this, targetScope);
    const privateName = '_' + name;
    Object.defineProperties(scopeObject, {
      [privateName]: {
        value: scopeObject[name],
        writable: true
      },
      [name]: {
        enumerable: true,
        get() {
          const local = this[privateName];
          const target = targetScopeObject[targetName];
          if (isObject(local)) {
            return Object.assign({}, target, local);
          }
          return valueOrDefault(local, target);
        },
        set(value) {
          this[privateName] = value;
        }
      }
    });
  }
}
var defaults = new Defaults({
  _scriptable: (name) => !name.startsWith('on'),
  _indexable: (name) => name !== 'events',
  hover: {
    _fallback: 'interaction'
  },
  interaction: {
    _scriptable: false,
    _indexable: false,
  }
});

function toFontString(font) {
  if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
    return null;
  }
  return (font.style ? font.style + ' ' : '')
		+ (font.weight ? font.weight + ' ' : '')
		+ font.size + 'px '
		+ font.family;
}
function _measureText(ctx, data, gc, longest, string) {
  let textWidth = data[string];
  if (!textWidth) {
    textWidth = data[string] = ctx.measureText(string).width;
    gc.push(string);
  }
  if (textWidth > longest) {
    longest = textWidth;
  }
  return longest;
}
function _longestText(ctx, font, arrayOfThings, cache) {
  cache = cache || {};
  let data = cache.data = cache.data || {};
  let gc = cache.garbageCollect = cache.garbageCollect || [];
  if (cache.font !== font) {
    data = cache.data = {};
    gc = cache.garbageCollect = [];
    cache.font = font;
  }
  ctx.save();
  ctx.font = font;
  let longest = 0;
  const ilen = arrayOfThings.length;
  let i, j, jlen, thing, nestedThing;
  for (i = 0; i < ilen; i++) {
    thing = arrayOfThings[i];
    if (thing !== undefined && thing !== null && isArray(thing) !== true) {
      longest = _measureText(ctx, data, gc, longest, thing);
    } else if (isArray(thing)) {
      for (j = 0, jlen = thing.length; j < jlen; j++) {
        nestedThing = thing[j];
        if (nestedThing !== undefined && nestedThing !== null && !isArray(nestedThing)) {
          longest = _measureText(ctx, data, gc, longest, nestedThing);
        }
      }
    }
  }
  ctx.restore();
  const gcLen = gc.length / 2;
  if (gcLen > arrayOfThings.length) {
    for (i = 0; i < gcLen; i++) {
      delete data[gc[i]];
    }
    gc.splice(0, gcLen);
  }
  return longest;
}
function _alignPixel(chart, pixel, width) {
  const devicePixelRatio = chart.currentDevicePixelRatio;
  const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
  return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
}
function clearCanvas(canvas, ctx) {
  ctx = ctx || canvas.getContext('2d');
  ctx.save();
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
function drawPoint(ctx, options, x, y) {
  let type, xOffset, yOffset, size, cornerRadius;
  const style = options.pointStyle;
  const rotation = options.rotation;
  const radius = options.radius;
  let rad = (rotation || 0) * RAD_PER_DEG;
  if (style && typeof style === 'object') {
    type = style.toString();
    if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rad);
      ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
      ctx.restore();
      return;
    }
  }
  if (isNaN(radius) || radius <= 0) {
    return;
  }
  ctx.beginPath();
  switch (style) {
  default:
    ctx.arc(x, y, radius, 0, TAU);
    ctx.closePath();
    break;
  case 'triangle':
    ctx.moveTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
    rad += TWO_THIRDS_PI;
    ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
    rad += TWO_THIRDS_PI;
    ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
    ctx.closePath();
    break;
  case 'rectRounded':
    cornerRadius = radius * 0.516;
    size = radius - cornerRadius;
    xOffset = Math.cos(rad + QUARTER_PI) * size;
    yOffset = Math.sin(rad + QUARTER_PI) * size;
    ctx.arc(x - xOffset, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
    ctx.arc(x + yOffset, y - xOffset, cornerRadius, rad - HALF_PI, rad);
    ctx.arc(x + xOffset, y + yOffset, cornerRadius, rad, rad + HALF_PI);
    ctx.arc(x - yOffset, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
    ctx.closePath();
    break;
  case 'rect':
    if (!rotation) {
      size = Math.SQRT1_2 * radius;
      ctx.rect(x - size, y - size, 2 * size, 2 * size);
      break;
    }
    rad += QUARTER_PI;
  case 'rectRot':
    xOffset = Math.cos(rad) * radius;
    yOffset = Math.sin(rad) * radius;
    ctx.moveTo(x - xOffset, y - yOffset);
    ctx.lineTo(x + yOffset, y - xOffset);
    ctx.lineTo(x + xOffset, y + yOffset);
    ctx.lineTo(x - yOffset, y + xOffset);
    ctx.closePath();
    break;
  case 'crossRot':
    rad += QUARTER_PI;
  case 'cross':
    xOffset = Math.cos(rad) * radius;
    yOffset = Math.sin(rad) * radius;
    ctx.moveTo(x - xOffset, y - yOffset);
    ctx.lineTo(x + xOffset, y + yOffset);
    ctx.moveTo(x + yOffset, y - xOffset);
    ctx.lineTo(x - yOffset, y + xOffset);
    break;
  case 'star':
    xOffset = Math.cos(rad) * radius;
    yOffset = Math.sin(rad) * radius;
    ctx.moveTo(x - xOffset, y - yOffset);
    ctx.lineTo(x + xOffset, y + yOffset);
    ctx.moveTo(x + yOffset, y - xOffset);
    ctx.lineTo(x - yOffset, y + xOffset);
    rad += QUARTER_PI;
    xOffset = Math.cos(rad) * radius;
    yOffset = Math.sin(rad) * radius;
    ctx.moveTo(x - xOffset, y - yOffset);
    ctx.lineTo(x + xOffset, y + yOffset);
    ctx.moveTo(x + yOffset, y - xOffset);
    ctx.lineTo(x - yOffset, y + xOffset);
    break;
  case 'line':
    xOffset = Math.cos(rad) * radius;
    yOffset = Math.sin(rad) * radius;
    ctx.moveTo(x - xOffset, y - yOffset);
    ctx.lineTo(x + xOffset, y + yOffset);
    break;
  case 'dash':
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(rad) * radius, y + Math.sin(rad) * radius);
    break;
  }
  ctx.fill();
  if (options.borderWidth > 0) {
    ctx.stroke();
  }
}
function _isPointInArea(point, area, margin) {
  margin = margin || 0.5;
  return !area || (point && point.x > area.left - margin && point.x < area.right + margin &&
		point.y > area.top - margin && point.y < area.bottom + margin);
}
function clipArea(ctx, area) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  ctx.clip();
}
function unclipArea(ctx) {
  ctx.restore();
}
function _steppedLineTo(ctx, previous, target, flip, mode) {
  if (!previous) {
    return ctx.lineTo(target.x, target.y);
  }
  if (mode === 'middle') {
    const midpoint = (previous.x + target.x) / 2.0;
    ctx.lineTo(midpoint, previous.y);
    ctx.lineTo(midpoint, target.y);
  } else if (mode === 'after' !== !!flip) {
    ctx.lineTo(previous.x, target.y);
  } else {
    ctx.lineTo(target.x, previous.y);
  }
  ctx.lineTo(target.x, target.y);
}
function _bezierCurveTo(ctx, previous, target, flip) {
  if (!previous) {
    return ctx.lineTo(target.x, target.y);
  }
  ctx.bezierCurveTo(
    flip ? previous.cp1x : previous.cp2x,
    flip ? previous.cp1y : previous.cp2y,
    flip ? target.cp2x : target.cp1x,
    flip ? target.cp2y : target.cp1y,
    target.x,
    target.y);
}
function renderText(ctx, text, x, y, font, opts = {}) {
  const lines = isArray(text) ? text : [text];
  const stroke = opts.strokeWidth > 0 && opts.strokeColor !== '';
  let i, line;
  ctx.save();
  ctx.font = font.string;
  setRenderOpts(ctx, opts);
  for (i = 0; i < lines.length; ++i) {
    line = lines[i];
    if (stroke) {
      if (opts.strokeColor) {
        ctx.strokeStyle = opts.strokeColor;
      }
      if (!isNullOrUndef(opts.strokeWidth)) {
        ctx.lineWidth = opts.strokeWidth;
      }
      ctx.strokeText(line, x, y, opts.maxWidth);
    }
    ctx.fillText(line, x, y, opts.maxWidth);
    decorateText(ctx, x, y, line, opts);
    y += font.lineHeight;
  }
  ctx.restore();
}
function setRenderOpts(ctx, opts) {
  if (opts.translation) {
    ctx.translate(opts.translation[0], opts.translation[1]);
  }
  if (!isNullOrUndef(opts.rotation)) {
    ctx.rotate(opts.rotation);
  }
  if (opts.color) {
    ctx.fillStyle = opts.color;
  }
  if (opts.textAlign) {
    ctx.textAlign = opts.textAlign;
  }
  if (opts.textBaseline) {
    ctx.textBaseline = opts.textBaseline;
  }
}
function decorateText(ctx, x, y, line, opts) {
  if (opts.strikethrough || opts.underline) {
    const metrics = ctx.measureText(line);
    const left = x - metrics.actualBoundingBoxLeft;
    const right = x + metrics.actualBoundingBoxRight;
    const top = y - metrics.actualBoundingBoxAscent;
    const bottom = y + metrics.actualBoundingBoxDescent;
    const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.lineWidth = opts.decorationWidth || 2;
    ctx.moveTo(left, yDecoration);
    ctx.lineTo(right, yDecoration);
    ctx.stroke();
  }
}
function addRoundedRectPath(ctx, rect) {
  const {x, y, w, h, radius} = rect;
  ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, -HALF_PI, PI, true);
  ctx.lineTo(x, y + h - radius.bottomLeft);
  ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
  ctx.lineTo(x + w - radius.bottomRight, y + h);
  ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
  ctx.lineTo(x + w, y + radius.topRight);
  ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
  ctx.lineTo(x + radius.topLeft, y);
}

const LINE_HEIGHT = new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
const FONT_STYLE = new RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);
function toLineHeight(value, size) {
  const matches = ('' + value).match(LINE_HEIGHT);
  if (!matches || matches[1] === 'normal') {
    return size * 1.2;
  }
  value = +matches[2];
  switch (matches[3]) {
  case 'px':
    return value;
  case '%':
    value /= 100;
    break;
  }
  return size * value;
}
const numberOrZero = v => +v || 0;
function _readValueToProps(value, props) {
  const ret = {};
  const objProps = isObject(props);
  const keys = objProps ? Object.keys(props) : props;
  const read = isObject(value)
    ? objProps
      ? prop => valueOrDefault(value[prop], value[props[prop]])
      : prop => value[prop]
    : () => value;
  for (const prop of keys) {
    ret[prop] = numberOrZero(read(prop));
  }
  return ret;
}
function toTRBL(value) {
  return _readValueToProps(value, {top: 'y', right: 'x', bottom: 'y', left: 'x'});
}
function toTRBLCorners(value) {
  return _readValueToProps(value, ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']);
}
function toPadding(value) {
  const obj = toTRBL(value);
  obj.width = obj.left + obj.right;
  obj.height = obj.top + obj.bottom;
  return obj;
}
function toFont(options, fallback) {
  options = options || {};
  fallback = fallback || defaults.font;
  let size = valueOrDefault(options.size, fallback.size);
  if (typeof size === 'string') {
    size = parseInt(size, 10);
  }
  let style = valueOrDefault(options.style, fallback.style);
  if (style && !('' + style).match(FONT_STYLE)) {
    console.warn('Invalid font style specified: "' + style + '"');
    style = '';
  }
  const font = {
    family: valueOrDefault(options.family, fallback.family),
    lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
    size,
    style,
    weight: valueOrDefault(options.weight, fallback.weight),
    string: ''
  };
  font.string = toFontString(font);
  return font;
}
function resolve(inputs, context, index, info) {
  let i, ilen, value;
  for (i = 0, ilen = inputs.length; i < ilen; ++i) {
    value = inputs[i];
    if (value === undefined) {
      continue;
    }
    if (value !== undefined) {
      return value;
    }
  }
}
function _addGrace(minmax, grace, beginAtZero) {
  const {min, max} = minmax;
  const change = toDimension(grace, (max - min) / 2);
  const keepZero = (value, add) => beginAtZero && value === 0 ? 0 : value + add;
  return {
    min: keepZero(min, -Math.abs(change)),
    max: keepZero(max, change)
  };
}
function createContext(parentContext, context) {
  return Object.assign(Object.create(parentContext), context);
}

function _lookup(table, value, cmp) {
  cmp = cmp || ((index) => table[index] < value);
  let hi = table.length - 1;
  let lo = 0;
  let mid;
  while (hi - lo > 1) {
    mid = (lo + hi) >> 1;
    if (cmp(mid)) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return {lo, hi};
}
const _lookupByKey = (table, key, value) =>
  _lookup(table, value, index => table[index][key] < value);
const _rlookupByKey = (table, key, value) =>
  _lookup(table, value, index => table[index][key] >= value);
function _filterBetween(values, min, max) {
  let start = 0;
  let end = values.length;
  while (start < end && values[start] < min) {
    start++;
  }
  while (end > start && values[end - 1] > max) {
    end--;
  }
  return start > 0 || end < values.length
    ? values.slice(start, end)
    : values;
}
const arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];
function listenArrayEvents(array, listener) {
  if (array._chartjs) {
    array._chartjs.listeners.push(listener);
    return;
  }
  Object.defineProperty(array, '_chartjs', {
    configurable: true,
    enumerable: false,
    value: {
      listeners: [listener]
    }
  });
  arrayEvents.forEach((key) => {
    const method = '_onData' + _capitalize(key);
    const base = array[key];
    Object.defineProperty(array, key, {
      configurable: true,
      enumerable: false,
      value(...args) {
        const res = base.apply(this, args);
        array._chartjs.listeners.forEach((object) => {
          if (typeof object[method] === 'function') {
            object[method](...args);
          }
        });
        return res;
      }
    });
  });
}
function unlistenArrayEvents(array, listener) {
  const stub = array._chartjs;
  if (!stub) {
    return;
  }
  const listeners = stub.listeners;
  const index = listeners.indexOf(listener);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
  if (listeners.length > 0) {
    return;
  }
  arrayEvents.forEach((key) => {
    delete array[key];
  });
  delete array._chartjs;
}
function _arrayUnique(items) {
  const set = new Set();
  let i, ilen;
  for (i = 0, ilen = items.length; i < ilen; ++i) {
    set.add(items[i]);
  }
  if (set.size === ilen) {
    return items;
  }
  return Array.from(set);
}

function _createResolver(scopes, prefixes = [''], rootScopes = scopes, fallback, getTarget = () => scopes[0]) {
  if (!defined(fallback)) {
    fallback = _resolve('_fallback', scopes);
  }
  const cache = {
    [Symbol.toStringTag]: 'Object',
    _cacheable: true,
    _scopes: scopes,
    _rootScopes: rootScopes,
    _fallback: fallback,
    _getTarget: getTarget,
    override: (scope) => _createResolver([scope, ...scopes], prefixes, rootScopes, fallback),
  };
  return new Proxy(cache, {
    deleteProperty(target, prop) {
      delete target[prop];
      delete target._keys;
      delete scopes[0][prop];
      return true;
    },
    get(target, prop) {
      return _cached(target, prop,
        () => _resolveWithPrefixes(prop, prefixes, scopes, target));
    },
    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(scopes[0]);
    },
    has(target, prop) {
      return getKeysFromAllScopes(target).includes(prop);
    },
    ownKeys(target) {
      return getKeysFromAllScopes(target);
    },
    set(target, prop, value) {
      const storage = target._storage || (target._storage = getTarget());
      target[prop] = storage[prop] = value;
      delete target._keys;
      return true;
    }
  });
}
function _attachContext(proxy, context, subProxy, descriptorDefaults) {
  const cache = {
    _cacheable: false,
    _proxy: proxy,
    _context: context,
    _subProxy: subProxy,
    _stack: new Set(),
    _descriptors: _descriptors(proxy, descriptorDefaults),
    setContext: (ctx) => _attachContext(proxy, ctx, subProxy, descriptorDefaults),
    override: (scope) => _attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
  };
  return new Proxy(cache, {
    deleteProperty(target, prop) {
      delete target[prop];
      delete proxy[prop];
      return true;
    },
    get(target, prop, receiver) {
      return _cached(target, prop,
        () => _resolveWithContext(target, prop, receiver));
    },
    getOwnPropertyDescriptor(target, prop) {
      return target._descriptors.allKeys
        ? Reflect.has(proxy, prop) ? {enumerable: true, configurable: true} : undefined
        : Reflect.getOwnPropertyDescriptor(proxy, prop);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(proxy);
    },
    has(target, prop) {
      return Reflect.has(proxy, prop);
    },
    ownKeys() {
      return Reflect.ownKeys(proxy);
    },
    set(target, prop, value) {
      proxy[prop] = value;
      delete target[prop];
      return true;
    }
  });
}
function _descriptors(proxy, defaults = {scriptable: true, indexable: true}) {
  const {_scriptable = defaults.scriptable, _indexable = defaults.indexable, _allKeys = defaults.allKeys} = proxy;
  return {
    allKeys: _allKeys,
    scriptable: _scriptable,
    indexable: _indexable,
    isScriptable: isFunction(_scriptable) ? _scriptable : () => _scriptable,
    isIndexable: isFunction(_indexable) ? _indexable : () => _indexable
  };
}
const readKey = (prefix, name) => prefix ? prefix + _capitalize(name) : name;
const needsSubResolver = (prop, value) => isObject(value) && prop !== 'adapters' &&
  (Object.getPrototypeOf(value) === null || value.constructor === Object);
function _cached(target, prop, resolve) {
  if (Object.prototype.hasOwnProperty.call(target, prop)) {
    return target[prop];
  }
  const value = resolve();
  target[prop] = value;
  return value;
}
function _resolveWithContext(target, prop, receiver) {
  const {_proxy, _context, _subProxy, _descriptors: descriptors} = target;
  let value = _proxy[prop];
  if (isFunction(value) && descriptors.isScriptable(prop)) {
    value = _resolveScriptable(prop, value, target, receiver);
  }
  if (isArray(value) && value.length) {
    value = _resolveArray(prop, value, target, descriptors.isIndexable);
  }
  if (needsSubResolver(prop, value)) {
    value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors);
  }
  return value;
}
function _resolveScriptable(prop, value, target, receiver) {
  const {_proxy, _context, _subProxy, _stack} = target;
  if (_stack.has(prop)) {
    throw new Error('Recursion detected: ' + Array.from(_stack).join('->') + '->' + prop);
  }
  _stack.add(prop);
  value = value(_context, _subProxy || receiver);
  _stack.delete(prop);
  if (needsSubResolver(prop, value)) {
    value = createSubResolver(_proxy._scopes, _proxy, prop, value);
  }
  return value;
}
function _resolveArray(prop, value, target, isIndexable) {
  const {_proxy, _context, _subProxy, _descriptors: descriptors} = target;
  if (defined(_context.index) && isIndexable(prop)) {
    value = value[_context.index % value.length];
  } else if (isObject(value[0])) {
    const arr = value;
    const scopes = _proxy._scopes.filter(s => s !== arr);
    value = [];
    for (const item of arr) {
      const resolver = createSubResolver(scopes, _proxy, prop, item);
      value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors));
    }
  }
  return value;
}
function resolveFallback(fallback, prop, value) {
  return isFunction(fallback) ? fallback(prop, value) : fallback;
}
const getScope = (key, parent) => key === true ? parent
  : typeof key === 'string' ? resolveObjectKey(parent, key) : undefined;
function addScopes(set, parentScopes, key, parentFallback, value) {
  for (const parent of parentScopes) {
    const scope = getScope(key, parent);
    if (scope) {
      set.add(scope);
      const fallback = resolveFallback(scope._fallback, key, value);
      if (defined(fallback) && fallback !== key && fallback !== parentFallback) {
        return fallback;
      }
    } else if (scope === false && defined(parentFallback) && key !== parentFallback) {
      return null;
    }
  }
  return false;
}
function createSubResolver(parentScopes, resolver, prop, value) {
  const rootScopes = resolver._rootScopes;
  const fallback = resolveFallback(resolver._fallback, prop, value);
  const allScopes = [...parentScopes, ...rootScopes];
  const set = new Set();
  set.add(value);
  let key = addScopesFromKey(set, allScopes, prop, fallback || prop, value);
  if (key === null) {
    return false;
  }
  if (defined(fallback) && fallback !== prop) {
    key = addScopesFromKey(set, allScopes, fallback, key, value);
    if (key === null) {
      return false;
    }
  }
  return _createResolver(Array.from(set), [''], rootScopes, fallback,
    () => subGetTarget(resolver, prop, value));
}
function addScopesFromKey(set, allScopes, key, fallback, item) {
  while (key) {
    key = addScopes(set, allScopes, key, fallback, item);
  }
  return key;
}
function subGetTarget(resolver, prop, value) {
  const parent = resolver._getTarget();
  if (!(prop in parent)) {
    parent[prop] = {};
  }
  const target = parent[prop];
  if (isArray(target) && isObject(value)) {
    return value;
  }
  return target;
}
function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
  let value;
  for (const prefix of prefixes) {
    value = _resolve(readKey(prefix, prop), scopes);
    if (defined(value)) {
      return needsSubResolver(prop, value)
        ? createSubResolver(scopes, proxy, prop, value)
        : value;
    }
  }
}
function _resolve(key, scopes) {
  for (const scope of scopes) {
    if (!scope) {
      continue;
    }
    const value = scope[key];
    if (defined(value)) {
      return value;
    }
  }
}
function getKeysFromAllScopes(target) {
  let keys = target._keys;
  if (!keys) {
    keys = target._keys = resolveKeysFromAllScopes(target._scopes);
  }
  return keys;
}
function resolveKeysFromAllScopes(scopes) {
  const set = new Set();
  for (const scope of scopes) {
    for (const key of Object.keys(scope).filter(k => !k.startsWith('_'))) {
      set.add(key);
    }
  }
  return Array.from(set);
}

const EPSILON = Number.EPSILON || 1e-14;
const getPoint = (points, i) => i < points.length && !points[i].skip && points[i];
const getValueAxis = (indexAxis) => indexAxis === 'x' ? 'y' : 'x';
function splineCurve(firstPoint, middlePoint, afterPoint, t) {
  const previous = firstPoint.skip ? middlePoint : firstPoint;
  const current = middlePoint;
  const next = afterPoint.skip ? middlePoint : afterPoint;
  const d01 = distanceBetweenPoints(current, previous);
  const d12 = distanceBetweenPoints(next, current);
  let s01 = d01 / (d01 + d12);
  let s12 = d12 / (d01 + d12);
  s01 = isNaN(s01) ? 0 : s01;
  s12 = isNaN(s12) ? 0 : s12;
  const fa = t * s01;
  const fb = t * s12;
  return {
    previous: {
      x: current.x - fa * (next.x - previous.x),
      y: current.y - fa * (next.y - previous.y)
    },
    next: {
      x: current.x + fb * (next.x - previous.x),
      y: current.y + fb * (next.y - previous.y)
    }
  };
}
function monotoneAdjust(points, deltaK, mK) {
  const pointsLen = points.length;
  let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (let i = 0; i < pointsLen - 1; ++i) {
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);
    if (!pointCurrent || !pointAfter) {
      continue;
    }
    if (almostEquals(deltaK[i], 0, EPSILON)) {
      mK[i] = mK[i + 1] = 0;
      continue;
    }
    alphaK = mK[i] / deltaK[i];
    betaK = mK[i + 1] / deltaK[i];
    squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
    if (squaredMagnitude <= 9) {
      continue;
    }
    tauK = 3 / Math.sqrt(squaredMagnitude);
    mK[i] = alphaK * tauK * deltaK[i];
    mK[i + 1] = betaK * tauK * deltaK[i];
  }
}
function monotoneCompute(points, mK, indexAxis = 'x') {
  const valueAxis = getValueAxis(indexAxis);
  const pointsLen = points.length;
  let delta, pointBefore, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (let i = 0; i < pointsLen; ++i) {
    pointBefore = pointCurrent;
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);
    if (!pointCurrent) {
      continue;
    }
    const iPixel = pointCurrent[indexAxis];
    const vPixel = pointCurrent[valueAxis];
    if (pointBefore) {
      delta = (iPixel - pointBefore[indexAxis]) / 3;
      pointCurrent[`cp1${indexAxis}`] = iPixel - delta;
      pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i];
    }
    if (pointAfter) {
      delta = (pointAfter[indexAxis] - iPixel) / 3;
      pointCurrent[`cp2${indexAxis}`] = iPixel + delta;
      pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i];
    }
  }
}
function splineCurveMonotone(points, indexAxis = 'x') {
  const valueAxis = getValueAxis(indexAxis);
  const pointsLen = points.length;
  const deltaK = Array(pointsLen).fill(0);
  const mK = Array(pointsLen);
  let i, pointBefore, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (i = 0; i < pointsLen; ++i) {
    pointBefore = pointCurrent;
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);
    if (!pointCurrent) {
      continue;
    }
    if (pointAfter) {
      const slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
      deltaK[i] = slopeDelta !== 0 ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
    }
    mK[i] = !pointBefore ? deltaK[i]
      : !pointAfter ? deltaK[i - 1]
      : (sign(deltaK[i - 1]) !== sign(deltaK[i])) ? 0
      : (deltaK[i - 1] + deltaK[i]) / 2;
  }
  monotoneAdjust(points, deltaK, mK);
  monotoneCompute(points, mK, indexAxis);
}
function capControlPoint(pt, min, max) {
  return Math.max(Math.min(pt, max), min);
}
function capBezierPoints(points, area) {
  let i, ilen, point, inArea, inAreaPrev;
  let inAreaNext = _isPointInArea(points[0], area);
  for (i = 0, ilen = points.length; i < ilen; ++i) {
    inAreaPrev = inArea;
    inArea = inAreaNext;
    inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);
    if (!inArea) {
      continue;
    }
    point = points[i];
    if (inAreaPrev) {
      point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
      point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
    }
    if (inAreaNext) {
      point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
      point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
    }
  }
}
function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
  let i, ilen, point, controlPoints;
  if (options.spanGaps) {
    points = points.filter((pt) => !pt.skip);
  }
  if (options.cubicInterpolationMode === 'monotone') {
    splineCurveMonotone(points, indexAxis);
  } else {
    let prev = loop ? points[points.length - 1] : points[0];
    for (i = 0, ilen = points.length; i < ilen; ++i) {
      point = points[i];
      controlPoints = splineCurve(
        prev,
        point,
        points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen],
        options.tension
      );
      point.cp1x = controlPoints.previous.x;
      point.cp1y = controlPoints.previous.y;
      point.cp2x = controlPoints.next.x;
      point.cp2y = controlPoints.next.y;
      prev = point;
    }
  }
  if (options.capBezierPoints) {
    capBezierPoints(points, area);
  }
}

function _isDomSupported() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
function _getParentNode(domNode) {
  let parent = domNode.parentNode;
  if (parent && parent.toString() === '[object ShadowRoot]') {
    parent = parent.host;
  }
  return parent;
}
function parseMaxStyle(styleValue, node, parentProperty) {
  let valueInPixels;
  if (typeof styleValue === 'string') {
    valueInPixels = parseInt(styleValue, 10);
    if (styleValue.indexOf('%') !== -1) {
      valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
    }
  } else {
    valueInPixels = styleValue;
  }
  return valueInPixels;
}
const getComputedStyle = (element) => window.getComputedStyle(element, null);
function getStyle(el, property) {
  return getComputedStyle(el).getPropertyValue(property);
}
const positions = ['top', 'right', 'bottom', 'left'];
function getPositionedStyle(styles, style, suffix) {
  const result = {};
  suffix = suffix ? '-' + suffix : '';
  for (let i = 0; i < 4; i++) {
    const pos = positions[i];
    result[pos] = parseFloat(styles[style + '-' + pos + suffix]) || 0;
  }
  result.width = result.left + result.right;
  result.height = result.top + result.bottom;
  return result;
}
const useOffsetPos = (x, y, target) => (x > 0 || y > 0) && (!target || !target.shadowRoot);
function getCanvasPosition(evt, canvas) {
  const e = evt.native || evt;
  const touches = e.touches;
  const source = touches && touches.length ? touches[0] : e;
  const {offsetX, offsetY} = source;
  let box = false;
  let x, y;
  if (useOffsetPos(offsetX, offsetY, e.target)) {
    x = offsetX;
    y = offsetY;
  } else {
    const rect = canvas.getBoundingClientRect();
    x = source.clientX - rect.left;
    y = source.clientY - rect.top;
    box = true;
  }
  return {x, y, box};
}
function getRelativePosition$1(evt, chart) {
  const {canvas, currentDevicePixelRatio} = chart;
  const style = getComputedStyle(canvas);
  const borderBox = style.boxSizing === 'border-box';
  const paddings = getPositionedStyle(style, 'padding');
  const borders = getPositionedStyle(style, 'border', 'width');
  const {x, y, box} = getCanvasPosition(evt, canvas);
  const xOffset = paddings.left + (box && borders.left);
  const yOffset = paddings.top + (box && borders.top);
  let {width, height} = chart;
  if (borderBox) {
    width -= paddings.width + borders.width;
    height -= paddings.height + borders.height;
  }
  return {
    x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
    y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
  };
}
function getContainerSize(canvas, width, height) {
  let maxWidth, maxHeight;
  if (width === undefined || height === undefined) {
    const container = _getParentNode(canvas);
    if (!container) {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
    } else {
      const rect = container.getBoundingClientRect();
      const containerStyle = getComputedStyle(container);
      const containerBorder = getPositionedStyle(containerStyle, 'border', 'width');
      const containerPadding = getPositionedStyle(containerStyle, 'padding');
      width = rect.width - containerPadding.width - containerBorder.width;
      height = rect.height - containerPadding.height - containerBorder.height;
      maxWidth = parseMaxStyle(containerStyle.maxWidth, container, 'clientWidth');
      maxHeight = parseMaxStyle(containerStyle.maxHeight, container, 'clientHeight');
    }
  }
  return {
    width,
    height,
    maxWidth: maxWidth || INFINITY,
    maxHeight: maxHeight || INFINITY
  };
}
const round1 = v => Math.round(v * 10) / 10;
function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
  const style = getComputedStyle(canvas);
  const margins = getPositionedStyle(style, 'margin');
  const maxWidth = parseMaxStyle(style.maxWidth, canvas, 'clientWidth') || INFINITY;
  const maxHeight = parseMaxStyle(style.maxHeight, canvas, 'clientHeight') || INFINITY;
  const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
  let {width, height} = containerSize;
  if (style.boxSizing === 'content-box') {
    const borders = getPositionedStyle(style, 'border', 'width');
    const paddings = getPositionedStyle(style, 'padding');
    width -= paddings.width + borders.width;
    height -= paddings.height + borders.height;
  }
  width = Math.max(0, width - margins.width);
  height = Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height - margins.height);
  width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
  height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
  if (width && !height) {
    height = round1(width / 2);
  }
  return {
    width,
    height
  };
}
function retinaScale(chart, forceRatio, forceStyle) {
  const pixelRatio = forceRatio || 1;
  const deviceHeight = Math.floor(chart.height * pixelRatio);
  const deviceWidth = Math.floor(chart.width * pixelRatio);
  chart.height = deviceHeight / pixelRatio;
  chart.width = deviceWidth / pixelRatio;
  const canvas = chart.canvas;
  if (canvas.style && (forceStyle || (!canvas.style.height && !canvas.style.width))) {
    canvas.style.height = `${chart.height}px`;
    canvas.style.width = `${chart.width}px`;
  }
  if (chart.currentDevicePixelRatio !== pixelRatio
      || canvas.height !== deviceHeight
      || canvas.width !== deviceWidth) {
    chart.currentDevicePixelRatio = pixelRatio;
    canvas.height = deviceHeight;
    canvas.width = deviceWidth;
    chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    return true;
  }
  return false;
}
const supportsEventListenerOptions = (function() {
  let passiveSupported = false;
  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      }
    };
    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
  } catch (e) {
  }
  return passiveSupported;
}());
function readUsedSize(element, property) {
  const value = getStyle(element, property);
  const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
  return matches ? +matches[1] : undefined;
}

function _pointInLine(p1, p2, t, mode) {
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y)
  };
}
function _steppedInterpolation(p1, p2, t, mode) {
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: mode === 'middle' ? t < 0.5 ? p1.y : p2.y
    : mode === 'after' ? t < 1 ? p1.y : p2.y
    : t > 0 ? p2.y : p1.y
  };
}
function _bezierInterpolation(p1, p2, t, mode) {
  const cp1 = {x: p1.cp2x, y: p1.cp2y};
  const cp2 = {x: p2.cp1x, y: p2.cp1y};
  const a = _pointInLine(p1, cp1, t);
  const b = _pointInLine(cp1, cp2, t);
  const c = _pointInLine(cp2, p2, t);
  const d = _pointInLine(a, b, t);
  const e = _pointInLine(b, c, t);
  return _pointInLine(d, e, t);
}

const intlCache = new Map();
function getNumberFormat(locale, options) {
  options = options || {};
  const cacheKey = locale + JSON.stringify(options);
  let formatter = intlCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    intlCache.set(cacheKey, formatter);
  }
  return formatter;
}
function formatNumber(num, locale, options) {
  return getNumberFormat(locale, options).format(num);
}

const getRightToLeftAdapter = function(rectX, width) {
  return {
    x(x) {
      return rectX + rectX + width - x;
    },
    setWidth(w) {
      width = w;
    },
    textAlign(align) {
      if (align === 'center') {
        return align;
      }
      return align === 'right' ? 'left' : 'right';
    },
    xPlus(x, value) {
      return x - value;
    },
    leftForLtr(x, itemWidth) {
      return x - itemWidth;
    },
  };
};
const getLeftToRightAdapter = function() {
  return {
    x(x) {
      return x;
    },
    setWidth(w) {
    },
    textAlign(align) {
      return align;
    },
    xPlus(x, value) {
      return x + value;
    },
    leftForLtr(x, _itemWidth) {
      return x;
    },
  };
};
function getRtlAdapter(rtl, rectX, width) {
  return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
}
function overrideTextDirection(ctx, direction) {
  let style, original;
  if (direction === 'ltr' || direction === 'rtl') {
    style = ctx.canvas.style;
    original = [
      style.getPropertyValue('direction'),
      style.getPropertyPriority('direction'),
    ];
    style.setProperty('direction', direction, 'important');
    ctx.prevTextDirection = original;
  }
}
function restoreTextDirection(ctx, original) {
  if (original !== undefined) {
    delete ctx.prevTextDirection;
    ctx.canvas.style.setProperty('direction', original[0], original[1]);
  }
}

function propertyFn(property) {
  if (property === 'angle') {
    return {
      between: _angleBetween,
      compare: _angleDiff,
      normalize: _normalizeAngle,
    };
  }
  return {
    between: _isBetween,
    compare: (a, b) => a - b,
    normalize: x => x
  };
}
function normalizeSegment({start, end, count, loop, style}) {
  return {
    start: start % count,
    end: end % count,
    loop: loop && (end - start + 1) % count === 0,
    style
  };
}
function getSegment(segment, points, bounds) {
  const {property, start: startBound, end: endBound} = bounds;
  const {between, normalize} = propertyFn(property);
  const count = points.length;
  let {start, end, loop} = segment;
  let i, ilen;
  if (loop) {
    start += count;
    end += count;
    for (i = 0, ilen = count; i < ilen; ++i) {
      if (!between(normalize(points[start % count][property]), startBound, endBound)) {
        break;
      }
      start--;
      end--;
    }
    start %= count;
    end %= count;
  }
  if (end < start) {
    end += count;
  }
  return {start, end, loop, style: segment.style};
}
function _boundSegment(segment, points, bounds) {
  if (!bounds) {
    return [segment];
  }
  const {property, start: startBound, end: endBound} = bounds;
  const count = points.length;
  const {compare, between, normalize} = propertyFn(property);
  const {start, end, loop, style} = getSegment(segment, points, bounds);
  const result = [];
  let inside = false;
  let subStart = null;
  let value, point, prevValue;
  const startIsBefore = () => between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;
  const endIsBefore = () => compare(endBound, value) === 0 || between(endBound, prevValue, value);
  const shouldStart = () => inside || startIsBefore();
  const shouldStop = () => !inside || endIsBefore();
  for (let i = start, prev = start; i <= end; ++i) {
    point = points[i % count];
    if (point.skip) {
      continue;
    }
    value = normalize(point[property]);
    if (value === prevValue) {
      continue;
    }
    inside = between(value, startBound, endBound);
    if (subStart === null && shouldStart()) {
      subStart = compare(value, startBound) === 0 ? i : prev;
    }
    if (subStart !== null && shouldStop()) {
      result.push(normalizeSegment({start: subStart, end: i, loop, count, style}));
      subStart = null;
    }
    prev = i;
    prevValue = value;
  }
  if (subStart !== null) {
    result.push(normalizeSegment({start: subStart, end, loop, count, style}));
  }
  return result;
}
function _boundSegments(line, bounds) {
  const result = [];
  const segments = line.segments;
  for (let i = 0; i < segments.length; i++) {
    const sub = _boundSegment(segments[i], line.points, bounds);
    if (sub.length) {
      result.push(...sub);
    }
  }
  return result;
}
function findStartAndEnd(points, count, loop, spanGaps) {
  let start = 0;
  let end = count - 1;
  if (loop && !spanGaps) {
    while (start < count && !points[start].skip) {
      start++;
    }
  }
  while (start < count && points[start].skip) {
    start++;
  }
  start %= count;
  if (loop) {
    end += start;
  }
  while (end > start && points[end % count].skip) {
    end--;
  }
  end %= count;
  return {start, end};
}
function solidSegments(points, start, max, loop) {
  const count = points.length;
  const result = [];
  let last = start;
  let prev = points[start];
  let end;
  for (end = start + 1; end <= max; ++end) {
    const cur = points[end % count];
    if (cur.skip || cur.stop) {
      if (!prev.skip) {
        loop = false;
        result.push({start: start % count, end: (end - 1) % count, loop});
        start = last = cur.stop ? end : null;
      }
    } else {
      last = end;
      if (prev.skip) {
        start = end;
      }
    }
    prev = cur;
  }
  if (last !== null) {
    result.push({start: start % count, end: last % count, loop});
  }
  return result;
}
function _computeSegments(line, segmentOptions) {
  const points = line.points;
  const spanGaps = line.options.spanGaps;
  const count = points.length;
  if (!count) {
    return [];
  }
  const loop = !!line._loop;
  const {start, end} = findStartAndEnd(points, count, loop, spanGaps);
  if (spanGaps === true) {
    return splitByStyles(line, [{start, end, loop}], points, segmentOptions);
  }
  const max = end < start ? end + count : end;
  const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
  return splitByStyles(line, solidSegments(points, start, max, completeLoop), points, segmentOptions);
}
function splitByStyles(line, segments, points, segmentOptions) {
  if (!segmentOptions || !segmentOptions.setContext || !points) {
    return segments;
  }
  return doSplitByStyles(line, segments, points, segmentOptions);
}
function doSplitByStyles(line, segments, points, segmentOptions) {
  const chartContext = line._chart.getContext();
  const baseStyle = readStyle(line.options);
  const {_datasetIndex: datasetIndex, options: {spanGaps}} = line;
  const count = points.length;
  const result = [];
  let prevStyle = baseStyle;
  let start = segments[0].start;
  let i = start;
  function addStyle(s, e, l, st) {
    const dir = spanGaps ? -1 : 1;
    if (s === e) {
      return;
    }
    s += count;
    while (points[s % count].skip) {
      s -= dir;
    }
    while (points[e % count].skip) {
      e += dir;
    }
    if (s % count !== e % count) {
      result.push({start: s % count, end: e % count, loop: l, style: st});
      prevStyle = st;
      start = e % count;
    }
  }
  for (const segment of segments) {
    start = spanGaps ? start : segment.start;
    let prev = points[start % count];
    let style;
    for (i = start + 1; i <= segment.end; i++) {
      const pt = points[i % count];
      style = readStyle(segmentOptions.setContext(createContext(chartContext, {
        type: 'segment',
        p0: prev,
        p1: pt,
        p0DataIndex: (i - 1) % count,
        p1DataIndex: i % count,
        datasetIndex
      })));
      if (styleChanged(style, prevStyle)) {
        addStyle(start, i - 1, segment.loop, prevStyle);
      }
      prev = pt;
      prevStyle = style;
    }
    if (start < i - 1) {
      addStyle(start, i - 1, segment.loop, prevStyle);
    }
  }
  return result;
}
function readStyle(options) {
  return {
    backgroundColor: options.backgroundColor,
    borderCapStyle: options.borderCapStyle,
    borderDash: options.borderDash,
    borderDashOffset: options.borderDashOffset,
    borderJoinStyle: options.borderJoinStyle,
    borderWidth: options.borderWidth,
    borderColor: options.borderColor
  };
}
function styleChanged(style, prevStyle) {
  return prevStyle && JSON.stringify(style) !== JSON.stringify(prevStyle);
}

/*!
 * Chart.js v3.7.1
 * https://www.chartjs.org
 * (c) 2022 Chart.js Contributors
 * Released under the MIT License
 */

class Animator {
  constructor() {
    this._request = null;
    this._charts = new Map();
    this._running = false;
    this._lastDate = undefined;
  }
  _notify(chart, anims, date, type) {
    const callbacks = anims.listeners[type];
    const numSteps = anims.duration;
    callbacks.forEach(fn => fn({
      chart,
      initial: anims.initial,
      numSteps,
      currentStep: Math.min(date - anims.start, numSteps)
    }));
  }
  _refresh() {
    if (this._request) {
      return;
    }
    this._running = true;
    this._request = requestAnimFrame.call(window, () => {
      this._update();
      this._request = null;
      if (this._running) {
        this._refresh();
      }
    });
  }
  _update(date = Date.now()) {
    let remaining = 0;
    this._charts.forEach((anims, chart) => {
      if (!anims.running || !anims.items.length) {
        return;
      }
      const items = anims.items;
      let i = items.length - 1;
      let draw = false;
      let item;
      for (; i >= 0; --i) {
        item = items[i];
        if (item._active) {
          if (item._total > anims.duration) {
            anims.duration = item._total;
          }
          item.tick(date);
          draw = true;
        } else {
          items[i] = items[items.length - 1];
          items.pop();
        }
      }
      if (draw) {
        chart.draw();
        this._notify(chart, anims, date, 'progress');
      }
      if (!items.length) {
        anims.running = false;
        this._notify(chart, anims, date, 'complete');
        anims.initial = false;
      }
      remaining += items.length;
    });
    this._lastDate = date;
    if (remaining === 0) {
      this._running = false;
    }
  }
  _getAnims(chart) {
    const charts = this._charts;
    let anims = charts.get(chart);
    if (!anims) {
      anims = {
        running: false,
        initial: true,
        items: [],
        listeners: {
          complete: [],
          progress: []
        }
      };
      charts.set(chart, anims);
    }
    return anims;
  }
  listen(chart, event, cb) {
    this._getAnims(chart).listeners[event].push(cb);
  }
  add(chart, items) {
    if (!items || !items.length) {
      return;
    }
    this._getAnims(chart).items.push(...items);
  }
  has(chart) {
    return this._getAnims(chart).items.length > 0;
  }
  start(chart) {
    const anims = this._charts.get(chart);
    if (!anims) {
      return;
    }
    anims.running = true;
    anims.start = Date.now();
    anims.duration = anims.items.reduce((acc, cur) => Math.max(acc, cur._duration), 0);
    this._refresh();
  }
  running(chart) {
    if (!this._running) {
      return false;
    }
    const anims = this._charts.get(chart);
    if (!anims || !anims.running || !anims.items.length) {
      return false;
    }
    return true;
  }
  stop(chart) {
    const anims = this._charts.get(chart);
    if (!anims || !anims.items.length) {
      return;
    }
    const items = anims.items;
    let i = items.length - 1;
    for (; i >= 0; --i) {
      items[i].cancel();
    }
    anims.items = [];
    this._notify(chart, anims, Date.now(), 'complete');
  }
  remove(chart) {
    return this._charts.delete(chart);
  }
}
var animator = new Animator();

const transparent = 'transparent';
const interpolators = {
  boolean(from, to, factor) {
    return factor > 0.5 ? to : from;
  },
  color(from, to, factor) {
    const c0 = color(from || transparent);
    const c1 = c0.valid && color(to || transparent);
    return c1 && c1.valid
      ? c1.mix(c0, factor).hexString()
      : to;
  },
  number(from, to, factor) {
    return from + (to - from) * factor;
  }
};
class Animation {
  constructor(cfg, target, prop, to) {
    const currentValue = target[prop];
    to = resolve([cfg.to, to, currentValue, cfg.from]);
    const from = resolve([cfg.from, currentValue, to]);
    this._active = true;
    this._fn = cfg.fn || interpolators[cfg.type || typeof from];
    this._easing = effects[cfg.easing] || effects.linear;
    this._start = Math.floor(Date.now() + (cfg.delay || 0));
    this._duration = this._total = Math.floor(cfg.duration);
    this._loop = !!cfg.loop;
    this._target = target;
    this._prop = prop;
    this._from = from;
    this._to = to;
    this._promises = undefined;
  }
  active() {
    return this._active;
  }
  update(cfg, to, date) {
    if (this._active) {
      this._notify(false);
      const currentValue = this._target[this._prop];
      const elapsed = date - this._start;
      const remain = this._duration - elapsed;
      this._start = date;
      this._duration = Math.floor(Math.max(remain, cfg.duration));
      this._total += elapsed;
      this._loop = !!cfg.loop;
      this._to = resolve([cfg.to, to, currentValue, cfg.from]);
      this._from = resolve([cfg.from, currentValue, to]);
    }
  }
  cancel() {
    if (this._active) {
      this.tick(Date.now());
      this._active = false;
      this._notify(false);
    }
  }
  tick(date) {
    const elapsed = date - this._start;
    const duration = this._duration;
    const prop = this._prop;
    const from = this._from;
    const loop = this._loop;
    const to = this._to;
    let factor;
    this._active = from !== to && (loop || (elapsed < duration));
    if (!this._active) {
      this._target[prop] = to;
      this._notify(true);
      return;
    }
    if (elapsed < 0) {
      this._target[prop] = from;
      return;
    }
    factor = (elapsed / duration) % 2;
    factor = loop && factor > 1 ? 2 - factor : factor;
    factor = this._easing(Math.min(1, Math.max(0, factor)));
    this._target[prop] = this._fn(from, to, factor);
  }
  wait() {
    const promises = this._promises || (this._promises = []);
    return new Promise((res, rej) => {
      promises.push({res, rej});
    });
  }
  _notify(resolved) {
    const method = resolved ? 'res' : 'rej';
    const promises = this._promises || [];
    for (let i = 0; i < promises.length; i++) {
      promises[i][method]();
    }
  }
}

const numbers$1 = ['x', 'y', 'borderWidth', 'radius', 'tension'];
const colors = ['color', 'borderColor', 'backgroundColor'];
defaults.set('animation', {
  delay: undefined,
  duration: 1000,
  easing: 'easeOutQuart',
  fn: undefined,
  from: undefined,
  loop: undefined,
  to: undefined,
  type: undefined,
});
const animationOptions = Object.keys(defaults.animation);
defaults.describe('animation', {
  _fallback: false,
  _indexable: false,
  _scriptable: (name) => name !== 'onProgress' && name !== 'onComplete' && name !== 'fn',
});
defaults.set('animations', {
  colors: {
    type: 'color',
    properties: colors
  },
  numbers: {
    type: 'number',
    properties: numbers$1
  },
});
defaults.describe('animations', {
  _fallback: 'animation',
});
defaults.set('transitions', {
  active: {
    animation: {
      duration: 400
    }
  },
  resize: {
    animation: {
      duration: 0
    }
  },
  show: {
    animations: {
      colors: {
        from: 'transparent'
      },
      visible: {
        type: 'boolean',
        duration: 0
      },
    }
  },
  hide: {
    animations: {
      colors: {
        to: 'transparent'
      },
      visible: {
        type: 'boolean',
        easing: 'linear',
        fn: v => v | 0
      },
    }
  }
});
class Animations {
  constructor(chart, config) {
    this._chart = chart;
    this._properties = new Map();
    this.configure(config);
  }
  configure(config) {
    if (!isObject(config)) {
      return;
    }
    const animatedProps = this._properties;
    Object.getOwnPropertyNames(config).forEach(key => {
      const cfg = config[key];
      if (!isObject(cfg)) {
        return;
      }
      const resolved = {};
      for (const option of animationOptions) {
        resolved[option] = cfg[option];
      }
      (isArray(cfg.properties) && cfg.properties || [key]).forEach((prop) => {
        if (prop === key || !animatedProps.has(prop)) {
          animatedProps.set(prop, resolved);
        }
      });
    });
  }
  _animateOptions(target, values) {
    const newOptions = values.options;
    const options = resolveTargetOptions(target, newOptions);
    if (!options) {
      return [];
    }
    const animations = this._createAnimations(options, newOptions);
    if (newOptions.$shared) {
      awaitAll(target.options.$animations, newOptions).then(() => {
        target.options = newOptions;
      }, () => {
      });
    }
    return animations;
  }
  _createAnimations(target, values) {
    const animatedProps = this._properties;
    const animations = [];
    const running = target.$animations || (target.$animations = {});
    const props = Object.keys(values);
    const date = Date.now();
    let i;
    for (i = props.length - 1; i >= 0; --i) {
      const prop = props[i];
      if (prop.charAt(0) === '$') {
        continue;
      }
      if (prop === 'options') {
        animations.push(...this._animateOptions(target, values));
        continue;
      }
      const value = values[prop];
      let animation = running[prop];
      const cfg = animatedProps.get(prop);
      if (animation) {
        if (cfg && animation.active()) {
          animation.update(cfg, value, date);
          continue;
        } else {
          animation.cancel();
        }
      }
      if (!cfg || !cfg.duration) {
        target[prop] = value;
        continue;
      }
      running[prop] = animation = new Animation(cfg, target, prop, value);
      animations.push(animation);
    }
    return animations;
  }
  update(target, values) {
    if (this._properties.size === 0) {
      Object.assign(target, values);
      return;
    }
    const animations = this._createAnimations(target, values);
    if (animations.length) {
      animator.add(this._chart, animations);
      return true;
    }
  }
}
function awaitAll(animations, properties) {
  const running = [];
  const keys = Object.keys(properties);
  for (let i = 0; i < keys.length; i++) {
    const anim = animations[keys[i]];
    if (anim && anim.active()) {
      running.push(anim.wait());
    }
  }
  return Promise.all(running);
}
function resolveTargetOptions(target, newOptions) {
  if (!newOptions) {
    return;
  }
  let options = target.options;
  if (!options) {
    target.options = newOptions;
    return;
  }
  if (options.$shared) {
    target.options = options = Object.assign({}, options, {$shared: false, $animations: {}});
  }
  return options;
}

function scaleClip(scale, allowedOverflow) {
  const opts = scale && scale.options || {};
  const reverse = opts.reverse;
  const min = opts.min === undefined ? allowedOverflow : 0;
  const max = opts.max === undefined ? allowedOverflow : 0;
  return {
    start: reverse ? max : min,
    end: reverse ? min : max
  };
}
function defaultClip(xScale, yScale, allowedOverflow) {
  if (allowedOverflow === false) {
    return false;
  }
  const x = scaleClip(xScale, allowedOverflow);
  const y = scaleClip(yScale, allowedOverflow);
  return {
    top: y.end,
    right: x.end,
    bottom: y.start,
    left: x.start
  };
}
function toClip(value) {
  let t, r, b, l;
  if (isObject(value)) {
    t = value.top;
    r = value.right;
    b = value.bottom;
    l = value.left;
  } else {
    t = r = b = l = value;
  }
  return {
    top: t,
    right: r,
    bottom: b,
    left: l,
    disabled: value === false
  };
}
function getSortedDatasetIndices(chart, filterVisible) {
  const keys = [];
  const metasets = chart._getSortedDatasetMetas(filterVisible);
  let i, ilen;
  for (i = 0, ilen = metasets.length; i < ilen; ++i) {
    keys.push(metasets[i].index);
  }
  return keys;
}
function applyStack(stack, value, dsIndex, options = {}) {
  const keys = stack.keys;
  const singleMode = options.mode === 'single';
  let i, ilen, datasetIndex, otherValue;
  if (value === null) {
    return;
  }
  for (i = 0, ilen = keys.length; i < ilen; ++i) {
    datasetIndex = +keys[i];
    if (datasetIndex === dsIndex) {
      if (options.all) {
        continue;
      }
      break;
    }
    otherValue = stack.values[datasetIndex];
    if (isNumberFinite(otherValue) && (singleMode || (value === 0 || sign(value) === sign(otherValue)))) {
      value += otherValue;
    }
  }
  return value;
}
function convertObjectDataToArray(data) {
  const keys = Object.keys(data);
  const adata = new Array(keys.length);
  let i, ilen, key;
  for (i = 0, ilen = keys.length; i < ilen; ++i) {
    key = keys[i];
    adata[i] = {
      x: key,
      y: data[key]
    };
  }
  return adata;
}
function isStacked(scale, meta) {
  const stacked = scale && scale.options.stacked;
  return stacked || (stacked === undefined && meta.stack !== undefined);
}
function getStackKey(indexScale, valueScale, meta) {
  return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
}
function getUserBounds(scale) {
  const {min, max, minDefined, maxDefined} = scale.getUserBounds();
  return {
    min: minDefined ? min : Number.NEGATIVE_INFINITY,
    max: maxDefined ? max : Number.POSITIVE_INFINITY
  };
}
function getOrCreateStack(stacks, stackKey, indexValue) {
  const subStack = stacks[stackKey] || (stacks[stackKey] = {});
  return subStack[indexValue] || (subStack[indexValue] = {});
}
function getLastIndexInStack(stack, vScale, positive, type) {
  for (const meta of vScale.getMatchingVisibleMetas(type).reverse()) {
    const value = stack[meta.index];
    if ((positive && value > 0) || (!positive && value < 0)) {
      return meta.index;
    }
  }
  return null;
}
function updateStacks(controller, parsed) {
  const {chart, _cachedMeta: meta} = controller;
  const stacks = chart._stacks || (chart._stacks = {});
  const {iScale, vScale, index: datasetIndex} = meta;
  const iAxis = iScale.axis;
  const vAxis = vScale.axis;
  const key = getStackKey(iScale, vScale, meta);
  const ilen = parsed.length;
  let stack;
  for (let i = 0; i < ilen; ++i) {
    const item = parsed[i];
    const {[iAxis]: index, [vAxis]: value} = item;
    const itemStacks = item._stacks || (item._stacks = {});
    stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index);
    stack[datasetIndex] = value;
    stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
    stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
  }
}
function getFirstScaleId(chart, axis) {
  const scales = chart.scales;
  return Object.keys(scales).filter(key => scales[key].axis === axis).shift();
}
function createDatasetContext(parent, index) {
  return createContext(parent,
    {
      active: false,
      dataset: undefined,
      datasetIndex: index,
      index,
      mode: 'default',
      type: 'dataset'
    }
  );
}
function createDataContext(parent, index, element) {
  return createContext(parent, {
    active: false,
    dataIndex: index,
    parsed: undefined,
    raw: undefined,
    element,
    index,
    mode: 'default',
    type: 'data'
  });
}
function clearStacks(meta, items) {
  const datasetIndex = meta.controller.index;
  const axis = meta.vScale && meta.vScale.axis;
  if (!axis) {
    return;
  }
  items = items || meta._parsed;
  for (const parsed of items) {
    const stacks = parsed._stacks;
    if (!stacks || stacks[axis] === undefined || stacks[axis][datasetIndex] === undefined) {
      return;
    }
    delete stacks[axis][datasetIndex];
  }
}
const isDirectUpdateMode = (mode) => mode === 'reset' || mode === 'none';
const cloneIfNotShared = (cached, shared) => shared ? cached : Object.assign({}, cached);
const createStack = (canStack, meta, chart) => canStack && !meta.hidden && meta._stacked
  && {keys: getSortedDatasetIndices(chart, true), values: null};
class DatasetController {
  constructor(chart, datasetIndex) {
    this.chart = chart;
    this._ctx = chart.ctx;
    this.index = datasetIndex;
    this._cachedDataOpts = {};
    this._cachedMeta = this.getMeta();
    this._type = this._cachedMeta.type;
    this.options = undefined;
    this._parsing = false;
    this._data = undefined;
    this._objectData = undefined;
    this._sharedOptions = undefined;
    this._drawStart = undefined;
    this._drawCount = undefined;
    this.enableOptionSharing = false;
    this.$context = undefined;
    this._syncList = [];
    this.initialize();
  }
  initialize() {
    const meta = this._cachedMeta;
    this.configure();
    this.linkScales();
    meta._stacked = isStacked(meta.vScale, meta);
    this.addElements();
  }
  updateIndex(datasetIndex) {
    if (this.index !== datasetIndex) {
      clearStacks(this._cachedMeta);
    }
    this.index = datasetIndex;
  }
  linkScales() {
    const chart = this.chart;
    const meta = this._cachedMeta;
    const dataset = this.getDataset();
    const chooseId = (axis, x, y, r) => axis === 'x' ? x : axis === 'r' ? r : y;
    const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, 'x'));
    const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, 'y'));
    const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, 'r'));
    const indexAxis = meta.indexAxis;
    const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
    const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
    meta.xScale = this.getScaleForId(xid);
    meta.yScale = this.getScaleForId(yid);
    meta.rScale = this.getScaleForId(rid);
    meta.iScale = this.getScaleForId(iid);
    meta.vScale = this.getScaleForId(vid);
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(scaleID) {
    return this.chart.scales[scaleID];
  }
  _getOtherScale(scale) {
    const meta = this._cachedMeta;
    return scale === meta.iScale
      ? meta.vScale
      : meta.iScale;
  }
  reset() {
    this._update('reset');
  }
  _destroy() {
    const meta = this._cachedMeta;
    if (this._data) {
      unlistenArrayEvents(this._data, this);
    }
    if (meta._stacked) {
      clearStacks(meta);
    }
  }
  _dataCheck() {
    const dataset = this.getDataset();
    const data = dataset.data || (dataset.data = []);
    const _data = this._data;
    if (isObject(data)) {
      this._data = convertObjectDataToArray(data);
    } else if (_data !== data) {
      if (_data) {
        unlistenArrayEvents(_data, this);
        const meta = this._cachedMeta;
        clearStacks(meta);
        meta._parsed = [];
      }
      if (data && Object.isExtensible(data)) {
        listenArrayEvents(data, this);
      }
      this._syncList = [];
      this._data = data;
    }
  }
  addElements() {
    const meta = this._cachedMeta;
    this._dataCheck();
    if (this.datasetElementType) {
      meta.dataset = new this.datasetElementType();
    }
  }
  buildOrUpdateElements(resetNewElements) {
    const meta = this._cachedMeta;
    const dataset = this.getDataset();
    let stackChanged = false;
    this._dataCheck();
    const oldStacked = meta._stacked;
    meta._stacked = isStacked(meta.vScale, meta);
    if (meta.stack !== dataset.stack) {
      stackChanged = true;
      clearStacks(meta);
      meta.stack = dataset.stack;
    }
    this._resyncElements(resetNewElements);
    if (stackChanged || oldStacked !== meta._stacked) {
      updateStacks(this, meta._parsed);
    }
  }
  configure() {
    const config = this.chart.config;
    const scopeKeys = config.datasetScopeKeys(this._type);
    const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
    this.options = config.createResolver(scopes, this.getContext());
    this._parsing = this.options.parsing;
    this._cachedDataOpts = {};
  }
  parse(start, count) {
    const {_cachedMeta: meta, _data: data} = this;
    const {iScale, _stacked} = meta;
    const iAxis = iScale.axis;
    let sorted = start === 0 && count === data.length ? true : meta._sorted;
    let prev = start > 0 && meta._parsed[start - 1];
    let i, cur, parsed;
    if (this._parsing === false) {
      meta._parsed = data;
      meta._sorted = true;
      parsed = data;
    } else {
      if (isArray(data[start])) {
        parsed = this.parseArrayData(meta, data, start, count);
      } else if (isObject(data[start])) {
        parsed = this.parseObjectData(meta, data, start, count);
      } else {
        parsed = this.parsePrimitiveData(meta, data, start, count);
      }
      const isNotInOrderComparedToPrev = () => cur[iAxis] === null || (prev && cur[iAxis] < prev[iAxis]);
      for (i = 0; i < count; ++i) {
        meta._parsed[i + start] = cur = parsed[i];
        if (sorted) {
          if (isNotInOrderComparedToPrev()) {
            sorted = false;
          }
          prev = cur;
        }
      }
      meta._sorted = sorted;
    }
    if (_stacked) {
      updateStacks(this, parsed);
    }
  }
  parsePrimitiveData(meta, data, start, count) {
    const {iScale, vScale} = meta;
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const labels = iScale.getLabels();
    const singleScale = iScale === vScale;
    const parsed = new Array(count);
    let i, ilen, index;
    for (i = 0, ilen = count; i < ilen; ++i) {
      index = i + start;
      parsed[i] = {
        [iAxis]: singleScale || iScale.parse(labels[index], index),
        [vAxis]: vScale.parse(data[index], index)
      };
    }
    return parsed;
  }
  parseArrayData(meta, data, start, count) {
    const {xScale, yScale} = meta;
    const parsed = new Array(count);
    let i, ilen, index, item;
    for (i = 0, ilen = count; i < ilen; ++i) {
      index = i + start;
      item = data[index];
      parsed[i] = {
        x: xScale.parse(item[0], index),
        y: yScale.parse(item[1], index)
      };
    }
    return parsed;
  }
  parseObjectData(meta, data, start, count) {
    const {xScale, yScale} = meta;
    const {xAxisKey = 'x', yAxisKey = 'y'} = this._parsing;
    const parsed = new Array(count);
    let i, ilen, index, item;
    for (i = 0, ilen = count; i < ilen; ++i) {
      index = i + start;
      item = data[index];
      parsed[i] = {
        x: xScale.parse(resolveObjectKey(item, xAxisKey), index),
        y: yScale.parse(resolveObjectKey(item, yAxisKey), index)
      };
    }
    return parsed;
  }
  getParsed(index) {
    return this._cachedMeta._parsed[index];
  }
  getDataElement(index) {
    return this._cachedMeta.data[index];
  }
  applyStack(scale, parsed, mode) {
    const chart = this.chart;
    const meta = this._cachedMeta;
    const value = parsed[scale.axis];
    const stack = {
      keys: getSortedDatasetIndices(chart, true),
      values: parsed._stacks[scale.axis]
    };
    return applyStack(stack, value, meta.index, {mode});
  }
  updateRangeFromParsed(range, scale, parsed, stack) {
    const parsedValue = parsed[scale.axis];
    let value = parsedValue === null ? NaN : parsedValue;
    const values = stack && parsed._stacks[scale.axis];
    if (stack && values) {
      stack.values = values;
      value = applyStack(stack, parsedValue, this._cachedMeta.index);
    }
    range.min = Math.min(range.min, value);
    range.max = Math.max(range.max, value);
  }
  getMinMax(scale, canStack) {
    const meta = this._cachedMeta;
    const _parsed = meta._parsed;
    const sorted = meta._sorted && scale === meta.iScale;
    const ilen = _parsed.length;
    const otherScale = this._getOtherScale(scale);
    const stack = createStack(canStack, meta, this.chart);
    const range = {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY};
    const {min: otherMin, max: otherMax} = getUserBounds(otherScale);
    let i, parsed;
    function _skip() {
      parsed = _parsed[i];
      const otherValue = parsed[otherScale.axis];
      return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
    }
    for (i = 0; i < ilen; ++i) {
      if (_skip()) {
        continue;
      }
      this.updateRangeFromParsed(range, scale, parsed, stack);
      if (sorted) {
        break;
      }
    }
    if (sorted) {
      for (i = ilen - 1; i >= 0; --i) {
        if (_skip()) {
          continue;
        }
        this.updateRangeFromParsed(range, scale, parsed, stack);
        break;
      }
    }
    return range;
  }
  getAllParsedValues(scale) {
    const parsed = this._cachedMeta._parsed;
    const values = [];
    let i, ilen, value;
    for (i = 0, ilen = parsed.length; i < ilen; ++i) {
      value = parsed[i][scale.axis];
      if (isNumberFinite(value)) {
        values.push(value);
      }
    }
    return values;
  }
  getMaxOverflow() {
    return false;
  }
  getLabelAndValue(index) {
    const meta = this._cachedMeta;
    const iScale = meta.iScale;
    const vScale = meta.vScale;
    const parsed = this.getParsed(index);
    return {
      label: iScale ? '' + iScale.getLabelForValue(parsed[iScale.axis]) : '',
      value: vScale ? '' + vScale.getLabelForValue(parsed[vScale.axis]) : ''
    };
  }
  _update(mode) {
    const meta = this._cachedMeta;
    this.update(mode || 'default');
    meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
  }
  update(mode) {}
  draw() {
    const ctx = this._ctx;
    const chart = this.chart;
    const meta = this._cachedMeta;
    const elements = meta.data || [];
    const area = chart.chartArea;
    const active = [];
    const start = this._drawStart || 0;
    const count = this._drawCount || (elements.length - start);
    const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
    let i;
    if (meta.dataset) {
      meta.dataset.draw(ctx, area, start, count);
    }
    for (i = start; i < start + count; ++i) {
      const element = elements[i];
      if (element.hidden) {
        continue;
      }
      if (element.active && drawActiveElementsOnTop) {
        active.push(element);
      } else {
        element.draw(ctx, area);
      }
    }
    for (i = 0; i < active.length; ++i) {
      active[i].draw(ctx, area);
    }
  }
  getStyle(index, active) {
    const mode = active ? 'active' : 'default';
    return index === undefined && this._cachedMeta.dataset
      ? this.resolveDatasetElementOptions(mode)
      : this.resolveDataElementOptions(index || 0, mode);
  }
  getContext(index, active, mode) {
    const dataset = this.getDataset();
    let context;
    if (index >= 0 && index < this._cachedMeta.data.length) {
      const element = this._cachedMeta.data[index];
      context = element.$context ||
        (element.$context = createDataContext(this.getContext(), index, element));
      context.parsed = this.getParsed(index);
      context.raw = dataset.data[index];
      context.index = context.dataIndex = index;
    } else {
      context = this.$context ||
        (this.$context = createDatasetContext(this.chart.getContext(), this.index));
      context.dataset = dataset;
      context.index = context.datasetIndex = this.index;
    }
    context.active = !!active;
    context.mode = mode;
    return context;
  }
  resolveDatasetElementOptions(mode) {
    return this._resolveElementOptions(this.datasetElementType.id, mode);
  }
  resolveDataElementOptions(index, mode) {
    return this._resolveElementOptions(this.dataElementType.id, mode, index);
  }
  _resolveElementOptions(elementType, mode = 'default', index) {
    const active = mode === 'active';
    const cache = this._cachedDataOpts;
    const cacheKey = elementType + '-' + mode;
    const cached = cache[cacheKey];
    const sharing = this.enableOptionSharing && defined(index);
    if (cached) {
      return cloneIfNotShared(cached, sharing);
    }
    const config = this.chart.config;
    const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
    const prefixes = active ? [`${elementType}Hover`, 'hover', elementType, ''] : [elementType, ''];
    const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
    const names = Object.keys(defaults.elements[elementType]);
    const context = () => this.getContext(index, active);
    const values = config.resolveNamedOptions(scopes, names, context, prefixes);
    if (values.$shared) {
      values.$shared = sharing;
      cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
    }
    return values;
  }
  _resolveAnimations(index, transition, active) {
    const chart = this.chart;
    const cache = this._cachedDataOpts;
    const cacheKey = `animation-${transition}`;
    const cached = cache[cacheKey];
    if (cached) {
      return cached;
    }
    let options;
    if (chart.options.animation !== false) {
      const config = this.chart.config;
      const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
      const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
      options = config.createResolver(scopes, this.getContext(index, active, transition));
    }
    const animations = new Animations(chart, options && options.animations);
    if (options && options._cacheable) {
      cache[cacheKey] = Object.freeze(animations);
    }
    return animations;
  }
  getSharedOptions(options) {
    if (!options.$shared) {
      return;
    }
    return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
  }
  includeOptions(mode, sharedOptions) {
    return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
  }
  updateElement(element, index, properties, mode) {
    if (isDirectUpdateMode(mode)) {
      Object.assign(element, properties);
    } else {
      this._resolveAnimations(index, mode).update(element, properties);
    }
  }
  updateSharedOptions(sharedOptions, mode, newOptions) {
    if (sharedOptions && !isDirectUpdateMode(mode)) {
      this._resolveAnimations(undefined, mode).update(sharedOptions, newOptions);
    }
  }
  _setStyle(element, index, mode, active) {
    element.active = active;
    const options = this.getStyle(index, active);
    this._resolveAnimations(index, mode, active).update(element, {
      options: (!active && this.getSharedOptions(options)) || options
    });
  }
  removeHoverStyle(element, datasetIndex, index) {
    this._setStyle(element, index, 'active', false);
  }
  setHoverStyle(element, datasetIndex, index) {
    this._setStyle(element, index, 'active', true);
  }
  _removeDatasetHoverStyle() {
    const element = this._cachedMeta.dataset;
    if (element) {
      this._setStyle(element, undefined, 'active', false);
    }
  }
  _setDatasetHoverStyle() {
    const element = this._cachedMeta.dataset;
    if (element) {
      this._setStyle(element, undefined, 'active', true);
    }
  }
  _resyncElements(resetNewElements) {
    const data = this._data;
    const elements = this._cachedMeta.data;
    for (const [method, arg1, arg2] of this._syncList) {
      this[method](arg1, arg2);
    }
    this._syncList = [];
    const numMeta = elements.length;
    const numData = data.length;
    const count = Math.min(numData, numMeta);
    if (count) {
      this.parse(0, count);
    }
    if (numData > numMeta) {
      this._insertElements(numMeta, numData - numMeta, resetNewElements);
    } else if (numData < numMeta) {
      this._removeElements(numData, numMeta - numData);
    }
  }
  _insertElements(start, count, resetNewElements = true) {
    const meta = this._cachedMeta;
    const data = meta.data;
    const end = start + count;
    let i;
    const move = (arr) => {
      arr.length += count;
      for (i = arr.length - 1; i >= end; i--) {
        arr[i] = arr[i - count];
      }
    };
    move(data);
    for (i = start; i < end; ++i) {
      data[i] = new this.dataElementType();
    }
    if (this._parsing) {
      move(meta._parsed);
    }
    this.parse(start, count);
    if (resetNewElements) {
      this.updateElements(data, start, count, 'reset');
    }
  }
  updateElements(element, start, count, mode) {}
  _removeElements(start, count) {
    const meta = this._cachedMeta;
    if (this._parsing) {
      const removed = meta._parsed.splice(start, count);
      if (meta._stacked) {
        clearStacks(meta, removed);
      }
    }
    meta.data.splice(start, count);
  }
  _sync(args) {
    if (this._parsing) {
      this._syncList.push(args);
    } else {
      const [method, arg1, arg2] = args;
      this[method](arg1, arg2);
    }
    this.chart._dataChanges.push([this.index, ...args]);
  }
  _onDataPush() {
    const count = arguments.length;
    this._sync(['_insertElements', this.getDataset().data.length - count, count]);
  }
  _onDataPop() {
    this._sync(['_removeElements', this._cachedMeta.data.length - 1, 1]);
  }
  _onDataShift() {
    this._sync(['_removeElements', 0, 1]);
  }
  _onDataSplice(start, count) {
    if (count) {
      this._sync(['_removeElements', start, count]);
    }
    const newCount = arguments.length - 2;
    if (newCount) {
      this._sync(['_insertElements', start, newCount]);
    }
  }
  _onDataUnshift() {
    this._sync(['_insertElements', 0, arguments.length]);
  }
}
DatasetController.defaults = {};
DatasetController.prototype.datasetElementType = null;
DatasetController.prototype.dataElementType = null;

function getAllScaleValues(scale, type) {
  if (!scale._cache.$bar) {
    const visibleMetas = scale.getMatchingVisibleMetas(type);
    let values = [];
    for (let i = 0, ilen = visibleMetas.length; i < ilen; i++) {
      values = values.concat(visibleMetas[i].controller.getAllParsedValues(scale));
    }
    scale._cache.$bar = _arrayUnique(values.sort((a, b) => a - b));
  }
  return scale._cache.$bar;
}
function computeMinSampleSize(meta) {
  const scale = meta.iScale;
  const values = getAllScaleValues(scale, meta.type);
  let min = scale._length;
  let i, ilen, curr, prev;
  const updateMinAndPrev = () => {
    if (curr === 32767 || curr === -32768) {
      return;
    }
    if (defined(prev)) {
      min = Math.min(min, Math.abs(curr - prev) || min);
    }
    prev = curr;
  };
  for (i = 0, ilen = values.length; i < ilen; ++i) {
    curr = scale.getPixelForValue(values[i]);
    updateMinAndPrev();
  }
  prev = undefined;
  for (i = 0, ilen = scale.ticks.length; i < ilen; ++i) {
    curr = scale.getPixelForTick(i);
    updateMinAndPrev();
  }
  return min;
}
function computeFitCategoryTraits(index, ruler, options, stackCount) {
  const thickness = options.barThickness;
  let size, ratio;
  if (isNullOrUndef(thickness)) {
    size = ruler.min * options.categoryPercentage;
    ratio = options.barPercentage;
  } else {
    size = thickness * stackCount;
    ratio = 1;
  }
  return {
    chunk: size / stackCount,
    ratio,
    start: ruler.pixels[index] - (size / 2)
  };
}
function computeFlexCategoryTraits(index, ruler, options, stackCount) {
  const pixels = ruler.pixels;
  const curr = pixels[index];
  let prev = index > 0 ? pixels[index - 1] : null;
  let next = index < pixels.length - 1 ? pixels[index + 1] : null;
  const percent = options.categoryPercentage;
  if (prev === null) {
    prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
  }
  if (next === null) {
    next = curr + curr - prev;
  }
  const start = curr - (curr - Math.min(prev, next)) / 2 * percent;
  const size = Math.abs(next - prev) / 2 * percent;
  return {
    chunk: size / stackCount,
    ratio: options.barPercentage,
    start
  };
}
function parseFloatBar(entry, item, vScale, i) {
  const startValue = vScale.parse(entry[0], i);
  const endValue = vScale.parse(entry[1], i);
  const min = Math.min(startValue, endValue);
  const max = Math.max(startValue, endValue);
  let barStart = min;
  let barEnd = max;
  if (Math.abs(min) > Math.abs(max)) {
    barStart = max;
    barEnd = min;
  }
  item[vScale.axis] = barEnd;
  item._custom = {
    barStart,
    barEnd,
    start: startValue,
    end: endValue,
    min,
    max
  };
}
function parseValue(entry, item, vScale, i) {
  if (isArray(entry)) {
    parseFloatBar(entry, item, vScale, i);
  } else {
    item[vScale.axis] = vScale.parse(entry, i);
  }
  return item;
}
function parseArrayOrPrimitive(meta, data, start, count) {
  const iScale = meta.iScale;
  const vScale = meta.vScale;
  const labels = iScale.getLabels();
  const singleScale = iScale === vScale;
  const parsed = [];
  let i, ilen, item, entry;
  for (i = start, ilen = start + count; i < ilen; ++i) {
    entry = data[i];
    item = {};
    item[iScale.axis] = singleScale || iScale.parse(labels[i], i);
    parsed.push(parseValue(entry, item, vScale, i));
  }
  return parsed;
}
function isFloatBar(custom) {
  return custom && custom.barStart !== undefined && custom.barEnd !== undefined;
}
function barSign(size, vScale, actualBase) {
  if (size !== 0) {
    return sign(size);
  }
  return (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1);
}
function borderProps(properties) {
  let reverse, start, end, top, bottom;
  if (properties.horizontal) {
    reverse = properties.base > properties.x;
    start = 'left';
    end = 'right';
  } else {
    reverse = properties.base < properties.y;
    start = 'bottom';
    end = 'top';
  }
  if (reverse) {
    top = 'end';
    bottom = 'start';
  } else {
    top = 'start';
    bottom = 'end';
  }
  return {start, end, reverse, top, bottom};
}
function setBorderSkipped(properties, options, stack, index) {
  let edge = options.borderSkipped;
  const res = {};
  if (!edge) {
    properties.borderSkipped = res;
    return;
  }
  const {start, end, reverse, top, bottom} = borderProps(properties);
  if (edge === 'middle' && stack) {
    properties.enableBorderRadius = true;
    if ((stack._top || 0) === index) {
      edge = top;
    } else if ((stack._bottom || 0) === index) {
      edge = bottom;
    } else {
      res[parseEdge(bottom, start, end, reverse)] = true;
      edge = top;
    }
  }
  res[parseEdge(edge, start, end, reverse)] = true;
  properties.borderSkipped = res;
}
function parseEdge(edge, a, b, reverse) {
  if (reverse) {
    edge = swap(edge, a, b);
    edge = startEnd(edge, b, a);
  } else {
    edge = startEnd(edge, a, b);
  }
  return edge;
}
function swap(orig, v1, v2) {
  return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}
function startEnd(v, start, end) {
  return v === 'start' ? start : v === 'end' ? end : v;
}
function setInflateAmount(properties, {inflateAmount}, ratio) {
  properties.inflateAmount = inflateAmount === 'auto'
    ? ratio === 1 ? 0.33 : 0
    : inflateAmount;
}
class BarController extends DatasetController {
  parsePrimitiveData(meta, data, start, count) {
    return parseArrayOrPrimitive(meta, data, start, count);
  }
  parseArrayData(meta, data, start, count) {
    return parseArrayOrPrimitive(meta, data, start, count);
  }
  parseObjectData(meta, data, start, count) {
    const {iScale, vScale} = meta;
    const {xAxisKey = 'x', yAxisKey = 'y'} = this._parsing;
    const iAxisKey = iScale.axis === 'x' ? xAxisKey : yAxisKey;
    const vAxisKey = vScale.axis === 'x' ? xAxisKey : yAxisKey;
    const parsed = [];
    let i, ilen, item, obj;
    for (i = start, ilen = start + count; i < ilen; ++i) {
      obj = data[i];
      item = {};
      item[iScale.axis] = iScale.parse(resolveObjectKey(obj, iAxisKey), i);
      parsed.push(parseValue(resolveObjectKey(obj, vAxisKey), item, vScale, i));
    }
    return parsed;
  }
  updateRangeFromParsed(range, scale, parsed, stack) {
    super.updateRangeFromParsed(range, scale, parsed, stack);
    const custom = parsed._custom;
    if (custom && scale === this._cachedMeta.vScale) {
      range.min = Math.min(range.min, custom.min);
      range.max = Math.max(range.max, custom.max);
    }
  }
  getMaxOverflow() {
    return 0;
  }
  getLabelAndValue(index) {
    const meta = this._cachedMeta;
    const {iScale, vScale} = meta;
    const parsed = this.getParsed(index);
    const custom = parsed._custom;
    const value = isFloatBar(custom)
      ? '[' + custom.start + ', ' + custom.end + ']'
      : '' + vScale.getLabelForValue(parsed[vScale.axis]);
    return {
      label: '' + iScale.getLabelForValue(parsed[iScale.axis]),
      value
    };
  }
  initialize() {
    this.enableOptionSharing = true;
    super.initialize();
    const meta = this._cachedMeta;
    meta.stack = this.getDataset().stack;
  }
  update(mode) {
    const meta = this._cachedMeta;
    this.updateElements(meta.data, 0, meta.data.length, mode);
  }
  updateElements(bars, start, count, mode) {
    const reset = mode === 'reset';
    const {index, _cachedMeta: {vScale}} = this;
    const base = vScale.getBasePixel();
    const horizontal = vScale.isHorizontal();
    const ruler = this._getRuler();
    const firstOpts = this.resolveDataElementOptions(start, mode);
    const sharedOptions = this.getSharedOptions(firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions);
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
    for (let i = start; i < start + count; i++) {
      const parsed = this.getParsed(i);
      const vpixels = reset || isNullOrUndef(parsed[vScale.axis]) ? {base, head: base} : this._calculateBarValuePixels(i);
      const ipixels = this._calculateBarIndexPixels(i, ruler);
      const stack = (parsed._stacks || {})[vScale.axis];
      const properties = {
        horizontal,
        base: vpixels.base,
        enableBorderRadius: !stack || isFloatBar(parsed._custom) || (index === stack._top || index === stack._bottom),
        x: horizontal ? vpixels.head : ipixels.center,
        y: horizontal ? ipixels.center : vpixels.head,
        height: horizontal ? ipixels.size : Math.abs(vpixels.size),
        width: horizontal ? Math.abs(vpixels.size) : ipixels.size
      };
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i, bars[i].active ? 'active' : mode);
      }
      const options = properties.options || bars[i].options;
      setBorderSkipped(properties, options, stack, index);
      setInflateAmount(properties, options, ruler.ratio);
      this.updateElement(bars[i], i, properties, mode);
    }
  }
  _getStacks(last, dataIndex) {
    const meta = this._cachedMeta;
    const iScale = meta.iScale;
    const metasets = iScale.getMatchingVisibleMetas(this._type);
    const stacked = iScale.options.stacked;
    const ilen = metasets.length;
    const stacks = [];
    let i, item;
    for (i = 0; i < ilen; ++i) {
      item = metasets[i];
      if (!item.controller.options.grouped) {
        continue;
      }
      if (typeof dataIndex !== 'undefined') {
        const val = item.controller.getParsed(dataIndex)[
          item.controller._cachedMeta.vScale.axis
        ];
        if (isNullOrUndef(val) || isNaN(val)) {
          continue;
        }
      }
      if (stacked === false || stacks.indexOf(item.stack) === -1 ||
				(stacked === undefined && item.stack === undefined)) {
        stacks.push(item.stack);
      }
      if (item.index === last) {
        break;
      }
    }
    if (!stacks.length) {
      stacks.push(undefined);
    }
    return stacks;
  }
  _getStackCount(index) {
    return this._getStacks(undefined, index).length;
  }
  _getStackIndex(datasetIndex, name, dataIndex) {
    const stacks = this._getStacks(datasetIndex, dataIndex);
    const index = (name !== undefined)
      ? stacks.indexOf(name)
      : -1;
    return (index === -1)
      ? stacks.length - 1
      : index;
  }
  _getRuler() {
    const opts = this.options;
    const meta = this._cachedMeta;
    const iScale = meta.iScale;
    const pixels = [];
    let i, ilen;
    for (i = 0, ilen = meta.data.length; i < ilen; ++i) {
      pixels.push(iScale.getPixelForValue(this.getParsed(i)[iScale.axis], i));
    }
    const barThickness = opts.barThickness;
    const min = barThickness || computeMinSampleSize(meta);
    return {
      min,
      pixels,
      start: iScale._startPixel,
      end: iScale._endPixel,
      stackCount: this._getStackCount(),
      scale: iScale,
      grouped: opts.grouped,
      ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
    };
  }
  _calculateBarValuePixels(index) {
    const {_cachedMeta: {vScale, _stacked}, options: {base: baseValue, minBarLength}} = this;
    const actualBase = baseValue || 0;
    const parsed = this.getParsed(index);
    const custom = parsed._custom;
    const floating = isFloatBar(custom);
    let value = parsed[vScale.axis];
    let start = 0;
    let length = _stacked ? this.applyStack(vScale, parsed, _stacked) : value;
    let head, size;
    if (length !== value) {
      start = length - value;
      length = value;
    }
    if (floating) {
      value = custom.barStart;
      length = custom.barEnd - custom.barStart;
      if (value !== 0 && sign(value) !== sign(custom.barEnd)) {
        start = 0;
      }
      start += value;
    }
    const startValue = !isNullOrUndef(baseValue) && !floating ? baseValue : start;
    let base = vScale.getPixelForValue(startValue);
    if (this.chart.getDataVisibility(index)) {
      head = vScale.getPixelForValue(start + length);
    } else {
      head = base;
    }
    size = head - base;
    if (Math.abs(size) < minBarLength) {
      size = barSign(size, vScale, actualBase) * minBarLength;
      if (value === actualBase) {
        base -= size / 2;
      }
      head = base + size;
    }
    if (base === vScale.getPixelForValue(actualBase)) {
      const halfGrid = sign(size) * vScale.getLineWidthForValue(actualBase) / 2;
      base += halfGrid;
      size -= halfGrid;
    }
    return {
      size,
      base,
      head,
      center: head + size / 2
    };
  }
  _calculateBarIndexPixels(index, ruler) {
    const scale = ruler.scale;
    const options = this.options;
    const skipNull = options.skipNull;
    const maxBarThickness = valueOrDefault(options.maxBarThickness, Infinity);
    let center, size;
    if (ruler.grouped) {
      const stackCount = skipNull ? this._getStackCount(index) : ruler.stackCount;
      const range = options.barThickness === 'flex'
        ? computeFlexCategoryTraits(index, ruler, options, stackCount)
        : computeFitCategoryTraits(index, ruler, options, stackCount);
      const stackIndex = this._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index : undefined);
      center = range.start + (range.chunk * stackIndex) + (range.chunk / 2);
      size = Math.min(maxBarThickness, range.chunk * range.ratio);
    } else {
      center = scale.getPixelForValue(this.getParsed(index)[scale.axis], index);
      size = Math.min(maxBarThickness, ruler.min * ruler.ratio);
    }
    return {
      base: center - size / 2,
      head: center + size / 2,
      center,
      size
    };
  }
  draw() {
    const meta = this._cachedMeta;
    const vScale = meta.vScale;
    const rects = meta.data;
    const ilen = rects.length;
    let i = 0;
    for (; i < ilen; ++i) {
      if (this.getParsed(i)[vScale.axis] !== null) {
        rects[i].draw(this._ctx);
      }
    }
  }
}
BarController.id = 'bar';
BarController.defaults = {
  datasetElementType: false,
  dataElementType: 'bar',
  categoryPercentage: 0.8,
  barPercentage: 0.9,
  grouped: true,
  animations: {
    numbers: {
      type: 'number',
      properties: ['x', 'y', 'base', 'width', 'height']
    }
  }
};
BarController.overrides = {
  scales: {
    _index_: {
      type: 'category',
      offset: true,
      grid: {
        offset: true
      }
    },
    _value_: {
      type: 'linear',
      beginAtZero: true,
    }
  }
};

class BubbleController extends DatasetController {
  initialize() {
    this.enableOptionSharing = true;
    super.initialize();
  }
  parsePrimitiveData(meta, data, start, count) {
    const parsed = super.parsePrimitiveData(meta, data, start, count);
    for (let i = 0; i < parsed.length; i++) {
      parsed[i]._custom = this.resolveDataElementOptions(i + start).radius;
    }
    return parsed;
  }
  parseArrayData(meta, data, start, count) {
    const parsed = super.parseArrayData(meta, data, start, count);
    for (let i = 0; i < parsed.length; i++) {
      const item = data[start + i];
      parsed[i]._custom = valueOrDefault(item[2], this.resolveDataElementOptions(i + start).radius);
    }
    return parsed;
  }
  parseObjectData(meta, data, start, count) {
    const parsed = super.parseObjectData(meta, data, start, count);
    for (let i = 0; i < parsed.length; i++) {
      const item = data[start + i];
      parsed[i]._custom = valueOrDefault(item && item.r && +item.r, this.resolveDataElementOptions(i + start).radius);
    }
    return parsed;
  }
  getMaxOverflow() {
    const data = this._cachedMeta.data;
    let max = 0;
    for (let i = data.length - 1; i >= 0; --i) {
      max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
    }
    return max > 0 && max;
  }
  getLabelAndValue(index) {
    const meta = this._cachedMeta;
    const {xScale, yScale} = meta;
    const parsed = this.getParsed(index);
    const x = xScale.getLabelForValue(parsed.x);
    const y = yScale.getLabelForValue(parsed.y);
    const r = parsed._custom;
    return {
      label: meta.label,
      value: '(' + x + ', ' + y + (r ? ', ' + r : '') + ')'
    };
  }
  update(mode) {
    const points = this._cachedMeta.data;
    this.updateElements(points, 0, points.length, mode);
  }
  updateElements(points, start, count, mode) {
    const reset = mode === 'reset';
    const {iScale, vScale} = this._cachedMeta;
    const firstOpts = this.resolveDataElementOptions(start, mode);
    const sharedOptions = this.getSharedOptions(firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions);
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    for (let i = start; i < start + count; i++) {
      const point = points[i];
      const parsed = !reset && this.getParsed(i);
      const properties = {};
      const iPixel = properties[iAxis] = reset ? iScale.getPixelForDecimal(0.5) : iScale.getPixelForValue(parsed[iAxis]);
      const vPixel = properties[vAxis] = reset ? vScale.getBasePixel() : vScale.getPixelForValue(parsed[vAxis]);
      properties.skip = isNaN(iPixel) || isNaN(vPixel);
      if (includeOptions) {
        properties.options = this.resolveDataElementOptions(i, point.active ? 'active' : mode);
        if (reset) {
          properties.options.radius = 0;
        }
      }
      this.updateElement(point, i, properties, mode);
    }
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
  }
  resolveDataElementOptions(index, mode) {
    const parsed = this.getParsed(index);
    let values = super.resolveDataElementOptions(index, mode);
    if (values.$shared) {
      values = Object.assign({}, values, {$shared: false});
    }
    const radius = values.radius;
    if (mode !== 'active') {
      values.radius = 0;
    }
    values.radius += valueOrDefault(parsed && parsed._custom, radius);
    return values;
  }
}
BubbleController.id = 'bubble';
BubbleController.defaults = {
  datasetElementType: false,
  dataElementType: 'point',
  animations: {
    numbers: {
      type: 'number',
      properties: ['x', 'y', 'borderWidth', 'radius']
    }
  }
};
BubbleController.overrides = {
  scales: {
    x: {
      type: 'linear'
    },
    y: {
      type: 'linear'
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        title() {
          return '';
        }
      }
    }
  }
};

function getRatioAndOffset(rotation, circumference, cutout) {
  let ratioX = 1;
  let ratioY = 1;
  let offsetX = 0;
  let offsetY = 0;
  if (circumference < TAU) {
    const startAngle = rotation;
    const endAngle = startAngle + circumference;
    const startX = Math.cos(startAngle);
    const startY = Math.sin(startAngle);
    const endX = Math.cos(endAngle);
    const endY = Math.sin(endAngle);
    const calcMax = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.max(a, a * cutout, b, b * cutout);
    const calcMin = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a, a * cutout, b, b * cutout);
    const maxX = calcMax(0, startX, endX);
    const maxY = calcMax(HALF_PI, startY, endY);
    const minX = calcMin(PI, startX, endX);
    const minY = calcMin(PI + HALF_PI, startY, endY);
    ratioX = (maxX - minX) / 2;
    ratioY = (maxY - minY) / 2;
    offsetX = -(maxX + minX) / 2;
    offsetY = -(maxY + minY) / 2;
  }
  return {ratioX, ratioY, offsetX, offsetY};
}
class DoughnutController extends DatasetController {
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    this.enableOptionSharing = true;
    this.innerRadius = undefined;
    this.outerRadius = undefined;
    this.offsetX = undefined;
    this.offsetY = undefined;
  }
  linkScales() {}
  parse(start, count) {
    const data = this.getDataset().data;
    const meta = this._cachedMeta;
    if (this._parsing === false) {
      meta._parsed = data;
    } else {
      let getter = (i) => +data[i];
      if (isObject(data[start])) {
        const {key = 'value'} = this._parsing;
        getter = (i) => +resolveObjectKey(data[i], key);
      }
      let i, ilen;
      for (i = start, ilen = start + count; i < ilen; ++i) {
        meta._parsed[i] = getter(i);
      }
    }
  }
  _getRotation() {
    return toRadians(this.options.rotation - 90);
  }
  _getCircumference() {
    return toRadians(this.options.circumference);
  }
  _getRotationExtents() {
    let min = TAU;
    let max = -TAU;
    for (let i = 0; i < this.chart.data.datasets.length; ++i) {
      if (this.chart.isDatasetVisible(i)) {
        const controller = this.chart.getDatasetMeta(i).controller;
        const rotation = controller._getRotation();
        const circumference = controller._getCircumference();
        min = Math.min(min, rotation);
        max = Math.max(max, rotation + circumference);
      }
    }
    return {
      rotation: min,
      circumference: max - min,
    };
  }
  update(mode) {
    const chart = this.chart;
    const {chartArea} = chart;
    const meta = this._cachedMeta;
    const arcs = meta.data;
    const spacing = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.spacing;
    const maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
    const cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1);
    const chartWeight = this._getRingWeight(this.index);
    const {circumference, rotation} = this._getRotationExtents();
    const {ratioX, ratioY, offsetX, offsetY} = getRatioAndOffset(rotation, circumference, cutout);
    const maxWidth = (chartArea.width - spacing) / ratioX;
    const maxHeight = (chartArea.height - spacing) / ratioY;
    const maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
    const outerRadius = toDimension(this.options.radius, maxRadius);
    const innerRadius = Math.max(outerRadius * cutout, 0);
    const radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
    this.offsetX = offsetX * outerRadius;
    this.offsetY = offsetY * outerRadius;
    meta.total = this.calculateTotal();
    this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index);
    this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0);
    this.updateElements(arcs, 0, arcs.length, mode);
  }
  _circumference(i, reset) {
    const opts = this.options;
    const meta = this._cachedMeta;
    const circumference = this._getCircumference();
    if ((reset && opts.animation.animateRotate) || !this.chart.getDataVisibility(i) || meta._parsed[i] === null || meta.data[i].hidden) {
      return 0;
    }
    return this.calculateCircumference(meta._parsed[i] * circumference / TAU);
  }
  updateElements(arcs, start, count, mode) {
    const reset = mode === 'reset';
    const chart = this.chart;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const animationOpts = opts.animation;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const animateScale = reset && animationOpts.animateScale;
    const innerRadius = animateScale ? 0 : this.innerRadius;
    const outerRadius = animateScale ? 0 : this.outerRadius;
    const firstOpts = this.resolveDataElementOptions(start, mode);
    const sharedOptions = this.getSharedOptions(firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions);
    let startAngle = this._getRotation();
    let i;
    for (i = 0; i < start; ++i) {
      startAngle += this._circumference(i, reset);
    }
    for (i = start; i < start + count; ++i) {
      const circumference = this._circumference(i, reset);
      const arc = arcs[i];
      const properties = {
        x: centerX + this.offsetX,
        y: centerY + this.offsetY,
        startAngle,
        endAngle: startAngle + circumference,
        circumference,
        outerRadius,
        innerRadius
      };
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i, arc.active ? 'active' : mode);
      }
      startAngle += circumference;
      this.updateElement(arc, i, properties, mode);
    }
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
  }
  calculateTotal() {
    const meta = this._cachedMeta;
    const metaData = meta.data;
    let total = 0;
    let i;
    for (i = 0; i < metaData.length; i++) {
      const value = meta._parsed[i];
      if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i) && !metaData[i].hidden) {
        total += Math.abs(value);
      }
    }
    return total;
  }
  calculateCircumference(value) {
    const total = this._cachedMeta.total;
    if (total > 0 && !isNaN(value)) {
      return TAU * (Math.abs(value) / total);
    }
    return 0;
  }
  getLabelAndValue(index) {
    const meta = this._cachedMeta;
    const chart = this.chart;
    const labels = chart.data.labels || [];
    const value = formatNumber(meta._parsed[index], chart.options.locale);
    return {
      label: labels[index] || '',
      value,
    };
  }
  getMaxBorderWidth(arcs) {
    let max = 0;
    const chart = this.chart;
    let i, ilen, meta, controller, options;
    if (!arcs) {
      for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
        if (chart.isDatasetVisible(i)) {
          meta = chart.getDatasetMeta(i);
          arcs = meta.data;
          controller = meta.controller;
          break;
        }
      }
    }
    if (!arcs) {
      return 0;
    }
    for (i = 0, ilen = arcs.length; i < ilen; ++i) {
      options = controller.resolveDataElementOptions(i);
      if (options.borderAlign !== 'inner') {
        max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
      }
    }
    return max;
  }
  getMaxOffset(arcs) {
    let max = 0;
    for (let i = 0, ilen = arcs.length; i < ilen; ++i) {
      const options = this.resolveDataElementOptions(i);
      max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
    }
    return max;
  }
  _getRingWeightOffset(datasetIndex) {
    let ringWeightOffset = 0;
    for (let i = 0; i < datasetIndex; ++i) {
      if (this.chart.isDatasetVisible(i)) {
        ringWeightOffset += this._getRingWeight(i);
      }
    }
    return ringWeightOffset;
  }
  _getRingWeight(datasetIndex) {
    return Math.max(valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1), 0);
  }
  _getVisibleDatasetWeightTotal() {
    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
  }
}
DoughnutController.id = 'doughnut';
DoughnutController.defaults = {
  datasetElementType: false,
  dataElementType: 'arc',
  animation: {
    animateRotate: true,
    animateScale: false
  },
  animations: {
    numbers: {
      type: 'number',
      properties: ['circumference', 'endAngle', 'innerRadius', 'outerRadius', 'startAngle', 'x', 'y', 'offset', 'borderWidth', 'spacing']
    },
  },
  cutout: '50%',
  rotation: 0,
  circumference: 360,
  radius: '100%',
  spacing: 0,
  indexAxis: 'r',
};
DoughnutController.descriptors = {
  _scriptable: (name) => name !== 'spacing',
  _indexable: (name) => name !== 'spacing',
};
DoughnutController.overrides = {
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        generateLabels(chart) {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            const {labels: {pointStyle}} = chart.legend.options;
            return data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              return {
                text: label,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                pointStyle: pointStyle,
                hidden: !chart.getDataVisibility(i),
                index: i
              };
            });
          }
          return [];
        }
      },
      onClick(e, legendItem, legend) {
        legend.chart.toggleDataVisibility(legendItem.index);
        legend.chart.update();
      }
    },
    tooltip: {
      callbacks: {
        title() {
          return '';
        },
        label(tooltipItem) {
          let dataLabel = tooltipItem.label;
          const value = ': ' + tooltipItem.formattedValue;
          if (isArray(dataLabel)) {
            dataLabel = dataLabel.slice();
            dataLabel[0] += value;
          } else {
            dataLabel += value;
          }
          return dataLabel;
        }
      }
    }
  }
};

class LineController extends DatasetController {
  initialize() {
    this.enableOptionSharing = true;
    super.initialize();
  }
  update(mode) {
    const meta = this._cachedMeta;
    const {dataset: line, data: points = [], _dataset} = meta;
    const animationsDisabled = this.chart._animationsDisabled;
    let {start, count} = getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
    this._drawStart = start;
    this._drawCount = count;
    if (scaleRangesChanged(meta)) {
      start = 0;
      count = points.length;
    }
    line._chart = this.chart;
    line._datasetIndex = this.index;
    line._decimated = !!_dataset._decimated;
    line.points = points;
    const options = this.resolveDatasetElementOptions(mode);
    if (!this.options.showLine) {
      options.borderWidth = 0;
    }
    options.segment = this.options.segment;
    this.updateElement(line, undefined, {
      animated: !animationsDisabled,
      options
    }, mode);
    this.updateElements(points, start, count, mode);
  }
  updateElements(points, start, count, mode) {
    const reset = mode === 'reset';
    const {iScale, vScale, _stacked, _dataset} = this._cachedMeta;
    const firstOpts = this.resolveDataElementOptions(start, mode);
    const sharedOptions = this.getSharedOptions(firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions);
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const {spanGaps, segment} = this.options;
    const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
    const directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
    let prevParsed = start > 0 && this.getParsed(start - 1);
    for (let i = start; i < start + count; ++i) {
      const point = points[i];
      const parsed = this.getParsed(i);
      const properties = directUpdate ? point : {};
      const nullData = isNullOrUndef(parsed[vAxis]);
      const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
      const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
      properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
      properties.stop = i > 0 && (parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
      if (segment) {
        properties.parsed = parsed;
        properties.raw = _dataset.data[i];
      }
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
      }
      if (!directUpdate) {
        this.updateElement(point, i, properties, mode);
      }
      prevParsed = parsed;
    }
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
  }
  getMaxOverflow() {
    const meta = this._cachedMeta;
    const dataset = meta.dataset;
    const border = dataset.options && dataset.options.borderWidth || 0;
    const data = meta.data || [];
    if (!data.length) {
      return border;
    }
    const firstPoint = data[0].size(this.resolveDataElementOptions(0));
    const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
    return Math.max(border, firstPoint, lastPoint) / 2;
  }
  draw() {
    const meta = this._cachedMeta;
    meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis);
    super.draw();
  }
}
LineController.id = 'line';
LineController.defaults = {
  datasetElementType: 'line',
  dataElementType: 'point',
  showLine: true,
  spanGaps: false,
};
LineController.overrides = {
  scales: {
    _index_: {
      type: 'category',
    },
    _value_: {
      type: 'linear',
    },
  }
};
function getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
  const pointCount = points.length;
  let start = 0;
  let count = pointCount;
  if (meta._sorted) {
    const {iScale, _parsed} = meta;
    const axis = iScale.axis;
    const {min, max, minDefined, maxDefined} = iScale.getUserBounds();
    if (minDefined) {
      start = _limitValue(Math.min(
        _lookupByKey(_parsed, iScale.axis, min).lo,
        animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo),
      0, pointCount - 1);
    }
    if (maxDefined) {
      count = _limitValue(Math.max(
        _lookupByKey(_parsed, iScale.axis, max).hi + 1,
        animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max)).hi + 1),
      start, pointCount) - start;
    } else {
      count = pointCount - start;
    }
  }
  return {start, count};
}
function scaleRangesChanged(meta) {
  const {xScale, yScale, _scaleRanges} = meta;
  const newRanges = {
    xmin: xScale.min,
    xmax: xScale.max,
    ymin: yScale.min,
    ymax: yScale.max
  };
  if (!_scaleRanges) {
    meta._scaleRanges = newRanges;
    return true;
  }
  const changed = _scaleRanges.xmin !== xScale.min
		|| _scaleRanges.xmax !== xScale.max
		|| _scaleRanges.ymin !== yScale.min
		|| _scaleRanges.ymax !== yScale.max;
  Object.assign(_scaleRanges, newRanges);
  return changed;
}

class PolarAreaController extends DatasetController {
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    this.innerRadius = undefined;
    this.outerRadius = undefined;
  }
  getLabelAndValue(index) {
    const meta = this._cachedMeta;
    const chart = this.chart;
    const labels = chart.data.labels || [];
    const value = formatNumber(meta._parsed[index].r, chart.options.locale);
    return {
      label: labels[index] || '',
      value,
    };
  }
  update(mode) {
    const arcs = this._cachedMeta.data;
    this._updateRadius();
    this.updateElements(arcs, 0, arcs.length, mode);
  }
  _updateRadius() {
    const chart = this.chart;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    const outerRadius = Math.max(minSize / 2, 0);
    const innerRadius = Math.max(opts.cutoutPercentage ? (outerRadius / 100) * (opts.cutoutPercentage) : 1, 0);
    const radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
    this.outerRadius = outerRadius - (radiusLength * this.index);
    this.innerRadius = this.outerRadius - radiusLength;
  }
  updateElements(arcs, start, count, mode) {
    const reset = mode === 'reset';
    const chart = this.chart;
    const dataset = this.getDataset();
    const opts = chart.options;
    const animationOpts = opts.animation;
    const scale = this._cachedMeta.rScale;
    const centerX = scale.xCenter;
    const centerY = scale.yCenter;
    const datasetStartAngle = scale.getIndexAngle(0) - 0.5 * PI;
    let angle = datasetStartAngle;
    let i;
    const defaultAngle = 360 / this.countVisibleElements();
    for (i = 0; i < start; ++i) {
      angle += this._computeAngle(i, mode, defaultAngle);
    }
    for (i = start; i < start + count; i++) {
      const arc = arcs[i];
      let startAngle = angle;
      let endAngle = angle + this._computeAngle(i, mode, defaultAngle);
      let outerRadius = chart.getDataVisibility(i) ? scale.getDistanceFromCenterForValue(dataset.data[i]) : 0;
      angle = endAngle;
      if (reset) {
        if (animationOpts.animateScale) {
          outerRadius = 0;
        }
        if (animationOpts.animateRotate) {
          startAngle = endAngle = datasetStartAngle;
        }
      }
      const properties = {
        x: centerX,
        y: centerY,
        innerRadius: 0,
        outerRadius,
        startAngle,
        endAngle,
        options: this.resolveDataElementOptions(i, arc.active ? 'active' : mode)
      };
      this.updateElement(arc, i, properties, mode);
    }
  }
  countVisibleElements() {
    const dataset = this.getDataset();
    const meta = this._cachedMeta;
    let count = 0;
    meta.data.forEach((element, index) => {
      if (!isNaN(dataset.data[index]) && this.chart.getDataVisibility(index)) {
        count++;
      }
    });
    return count;
  }
  _computeAngle(index, mode, defaultAngle) {
    return this.chart.getDataVisibility(index)
      ? toRadians(this.resolveDataElementOptions(index, mode).angle || defaultAngle)
      : 0;
  }
}
PolarAreaController.id = 'polarArea';
PolarAreaController.defaults = {
  dataElementType: 'arc',
  animation: {
    animateRotate: true,
    animateScale: true
  },
  animations: {
    numbers: {
      type: 'number',
      properties: ['x', 'y', 'startAngle', 'endAngle', 'innerRadius', 'outerRadius']
    },
  },
  indexAxis: 'r',
  startAngle: 0,
};
PolarAreaController.overrides = {
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        generateLabels(chart) {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            const {labels: {pointStyle}} = chart.legend.options;
            return data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              return {
                text: label,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                pointStyle: pointStyle,
                hidden: !chart.getDataVisibility(i),
                index: i
              };
            });
          }
          return [];
        }
      },
      onClick(e, legendItem, legend) {
        legend.chart.toggleDataVisibility(legendItem.index);
        legend.chart.update();
      }
    },
    tooltip: {
      callbacks: {
        title() {
          return '';
        },
        label(context) {
          return context.chart.data.labels[context.dataIndex] + ': ' + context.formattedValue;
        }
      }
    }
  },
  scales: {
    r: {
      type: 'radialLinear',
      angleLines: {
        display: false
      },
      beginAtZero: true,
      grid: {
        circular: true
      },
      pointLabels: {
        display: false
      },
      startAngle: 0
    }
  }
};

class PieController extends DoughnutController {
}
PieController.id = 'pie';
PieController.defaults = {
  cutout: 0,
  rotation: 0,
  circumference: 360,
  radius: '100%'
};

class RadarController extends DatasetController {
  getLabelAndValue(index) {
    const vScale = this._cachedMeta.vScale;
    const parsed = this.getParsed(index);
    return {
      label: vScale.getLabels()[index],
      value: '' + vScale.getLabelForValue(parsed[vScale.axis])
    };
  }
  update(mode) {
    const meta = this._cachedMeta;
    const line = meta.dataset;
    const points = meta.data || [];
    const labels = meta.iScale.getLabels();
    line.points = points;
    if (mode !== 'resize') {
      const options = this.resolveDatasetElementOptions(mode);
      if (!this.options.showLine) {
        options.borderWidth = 0;
      }
      const properties = {
        _loop: true,
        _fullLoop: labels.length === points.length,
        options
      };
      this.updateElement(line, undefined, properties, mode);
    }
    this.updateElements(points, 0, points.length, mode);
  }
  updateElements(points, start, count, mode) {
    const dataset = this.getDataset();
    const scale = this._cachedMeta.rScale;
    const reset = mode === 'reset';
    for (let i = start; i < start + count; i++) {
      const point = points[i];
      const options = this.resolveDataElementOptions(i, point.active ? 'active' : mode);
      const pointPosition = scale.getPointPositionForValue(i, dataset.data[i]);
      const x = reset ? scale.xCenter : pointPosition.x;
      const y = reset ? scale.yCenter : pointPosition.y;
      const properties = {
        x,
        y,
        angle: pointPosition.angle,
        skip: isNaN(x) || isNaN(y),
        options
      };
      this.updateElement(point, i, properties, mode);
    }
  }
}
RadarController.id = 'radar';
RadarController.defaults = {
  datasetElementType: 'line',
  dataElementType: 'point',
  indexAxis: 'r',
  showLine: true,
  elements: {
    line: {
      fill: 'start'
    }
  },
};
RadarController.overrides = {
  aspectRatio: 1,
  scales: {
    r: {
      type: 'radialLinear',
    }
  }
};

class ScatterController extends LineController {
}
ScatterController.id = 'scatter';
ScatterController.defaults = {
  showLine: false,
  fill: false
};
ScatterController.overrides = {
  interaction: {
    mode: 'point'
  },
  plugins: {
    tooltip: {
      callbacks: {
        title() {
          return '';
        },
        label(item) {
          return '(' + item.label + ', ' + item.formattedValue + ')';
        }
      }
    }
  },
  scales: {
    x: {
      type: 'linear'
    },
    y: {
      type: 'linear'
    }
  }
};

var controllers = /*#__PURE__*/Object.freeze({
__proto__: null,
BarController: BarController,
BubbleController: BubbleController,
DoughnutController: DoughnutController,
LineController: LineController,
PolarAreaController: PolarAreaController,
PieController: PieController,
RadarController: RadarController,
ScatterController: ScatterController
});

function abstract() {
  throw new Error('This method is not implemented: Check that a complete date adapter is provided.');
}
class DateAdapter {
  constructor(options) {
    this.options = options || {};
  }
  formats() {
    return abstract();
  }
  parse(value, format) {
    return abstract();
  }
  format(timestamp, format) {
    return abstract();
  }
  add(timestamp, amount, unit) {
    return abstract();
  }
  diff(a, b, unit) {
    return abstract();
  }
  startOf(timestamp, unit, weekday) {
    return abstract();
  }
  endOf(timestamp, unit) {
    return abstract();
  }
}
DateAdapter.override = function(members) {
  Object.assign(DateAdapter.prototype, members);
};
var adapters = {
  _date: DateAdapter
};

function getRelativePosition(e, chart) {
  if ('native' in e) {
    return {
      x: e.x,
      y: e.y
    };
  }
  return getRelativePosition$1(e, chart);
}
function evaluateAllVisibleItems(chart, handler) {
  const metasets = chart.getSortedVisibleDatasetMetas();
  let index, data, element;
  for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
    ({index, data} = metasets[i]);
    for (let j = 0, jlen = data.length; j < jlen; ++j) {
      element = data[j];
      if (!element.skip) {
        handler(element, index, j);
      }
    }
  }
}
function binarySearch(metaset, axis, value, intersect) {
  const {controller, data, _sorted} = metaset;
  const iScale = controller._cachedMeta.iScale;
  if (iScale && axis === iScale.axis && axis !== 'r' && _sorted && data.length) {
    const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
    if (!intersect) {
      return lookupMethod(data, axis, value);
    } else if (controller._sharedOptions) {
      const el = data[0];
      const range = typeof el.getRange === 'function' && el.getRange(axis);
      if (range) {
        const start = lookupMethod(data, axis, value - range);
        const end = lookupMethod(data, axis, value + range);
        return {lo: start.lo, hi: end.hi};
      }
    }
  }
  return {lo: 0, hi: data.length - 1};
}
function optimizedEvaluateItems(chart, axis, position, handler, intersect) {
  const metasets = chart.getSortedVisibleDatasetMetas();
  const value = position[axis];
  for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
    const {index, data} = metasets[i];
    const {lo, hi} = binarySearch(metasets[i], axis, value, intersect);
    for (let j = lo; j <= hi; ++j) {
      const element = data[j];
      if (!element.skip) {
        handler(element, index, j);
      }
    }
  }
}
function getDistanceMetricForAxis(axis) {
  const useX = axis.indexOf('x') !== -1;
  const useY = axis.indexOf('y') !== -1;
  return function(pt1, pt2) {
    const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
    const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  };
}
function getIntersectItems(chart, position, axis, useFinalPosition) {
  const items = [];
  if (!_isPointInArea(position, chart.chartArea, chart._minPadding)) {
    return items;
  }
  const evaluationFunc = function(element, datasetIndex, index) {
    if (element.inRange(position.x, position.y, useFinalPosition)) {
      items.push({element, datasetIndex, index});
    }
  };
  optimizedEvaluateItems(chart, axis, position, evaluationFunc, true);
  return items;
}
function getNearestRadialItems(chart, position, axis, useFinalPosition) {
  let items = [];
  function evaluationFunc(element, datasetIndex, index) {
    const {startAngle, endAngle} = element.getProps(['startAngle', 'endAngle'], useFinalPosition);
    const {angle} = getAngleFromPoint(element, {x: position.x, y: position.y});
    if (_angleBetween(angle, startAngle, endAngle)) {
      items.push({element, datasetIndex, index});
    }
  }
  optimizedEvaluateItems(chart, axis, position, evaluationFunc);
  return items;
}
function getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition) {
  let items = [];
  const distanceMetric = getDistanceMetricForAxis(axis);
  let minDistance = Number.POSITIVE_INFINITY;
  function evaluationFunc(element, datasetIndex, index) {
    const inRange = element.inRange(position.x, position.y, useFinalPosition);
    if (intersect && !inRange) {
      return;
    }
    const center = element.getCenterPoint(useFinalPosition);
    const pointInArea = _isPointInArea(center, chart.chartArea, chart._minPadding);
    if (!pointInArea && !inRange) {
      return;
    }
    const distance = distanceMetric(position, center);
    if (distance < minDistance) {
      items = [{element, datasetIndex, index}];
      minDistance = distance;
    } else if (distance === minDistance) {
      items.push({element, datasetIndex, index});
    }
  }
  optimizedEvaluateItems(chart, axis, position, evaluationFunc);
  return items;
}
function getNearestItems(chart, position, axis, intersect, useFinalPosition) {
  if (!_isPointInArea(position, chart.chartArea, chart._minPadding)) {
    return [];
  }
  return axis === 'r' && !intersect
    ? getNearestRadialItems(chart, position, axis, useFinalPosition)
    : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition);
}
function getAxisItems(chart, e, options, useFinalPosition) {
  const position = getRelativePosition(e, chart);
  const items = [];
  const axis = options.axis;
  const rangeMethod = axis === 'x' ? 'inXRange' : 'inYRange';
  let intersectsItem = false;
  evaluateAllVisibleItems(chart, (element, datasetIndex, index) => {
    if (element[rangeMethod](position[axis], useFinalPosition)) {
      items.push({element, datasetIndex, index});
    }
    if (element.inRange(position.x, position.y, useFinalPosition)) {
      intersectsItem = true;
    }
  });
  if (options.intersect && !intersectsItem) {
    return [];
  }
  return items;
}
var Interaction = {
  modes: {
    index(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || 'x';
      const items = options.intersect
        ? getIntersectItems(chart, position, axis, useFinalPosition)
        : getNearestItems(chart, position, axis, false, useFinalPosition);
      const elements = [];
      if (!items.length) {
        return [];
      }
      chart.getSortedVisibleDatasetMetas().forEach((meta) => {
        const index = items[0].index;
        const element = meta.data[index];
        if (element && !element.skip) {
          elements.push({element, datasetIndex: meta.index, index});
        }
      });
      return elements;
    },
    dataset(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || 'xy';
      let items = options.intersect
        ? getIntersectItems(chart, position, axis, useFinalPosition) :
        getNearestItems(chart, position, axis, false, useFinalPosition);
      if (items.length > 0) {
        const datasetIndex = items[0].datasetIndex;
        const data = chart.getDatasetMeta(datasetIndex).data;
        items = [];
        for (let i = 0; i < data.length; ++i) {
          items.push({element: data[i], datasetIndex, index: i});
        }
      }
      return items;
    },
    point(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || 'xy';
      return getIntersectItems(chart, position, axis, useFinalPosition);
    },
    nearest(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || 'xy';
      return getNearestItems(chart, position, axis, options.intersect, useFinalPosition);
    },
    x(chart, e, options, useFinalPosition) {
      return getAxisItems(chart, e, {axis: 'x', intersect: options.intersect}, useFinalPosition);
    },
    y(chart, e, options, useFinalPosition) {
      return getAxisItems(chart, e, {axis: 'y', intersect: options.intersect}, useFinalPosition);
    }
  }
};

const STATIC_POSITIONS = ['left', 'top', 'right', 'bottom'];
function filterByPosition(array, position) {
  return array.filter(v => v.pos === position);
}
function filterDynamicPositionByAxis(array, axis) {
  return array.filter(v => STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
}
function sortByWeight(array, reverse) {
  return array.sort((a, b) => {
    const v0 = reverse ? b : a;
    const v1 = reverse ? a : b;
    return v0.weight === v1.weight ?
      v0.index - v1.index :
      v0.weight - v1.weight;
  });
}
function wrapBoxes(boxes) {
  const layoutBoxes = [];
  let i, ilen, box, pos, stack, stackWeight;
  for (i = 0, ilen = (boxes || []).length; i < ilen; ++i) {
    box = boxes[i];
    ({position: pos, options: {stack, stackWeight = 1}} = box);
    layoutBoxes.push({
      index: i,
      box,
      pos,
      horizontal: box.isHorizontal(),
      weight: box.weight,
      stack: stack && (pos + stack),
      stackWeight
    });
  }
  return layoutBoxes;
}
function buildStacks(layouts) {
  const stacks = {};
  for (const wrap of layouts) {
    const {stack, pos, stackWeight} = wrap;
    if (!stack || !STATIC_POSITIONS.includes(pos)) {
      continue;
    }
    const _stack = stacks[stack] || (stacks[stack] = {count: 0, placed: 0, weight: 0, size: 0});
    _stack.count++;
    _stack.weight += stackWeight;
  }
  return stacks;
}
function setLayoutDims(layouts, params) {
  const stacks = buildStacks(layouts);
  const {vBoxMaxWidth, hBoxMaxHeight} = params;
  let i, ilen, layout;
  for (i = 0, ilen = layouts.length; i < ilen; ++i) {
    layout = layouts[i];
    const {fullSize} = layout.box;
    const stack = stacks[layout.stack];
    const factor = stack && layout.stackWeight / stack.weight;
    if (layout.horizontal) {
      layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
      layout.height = hBoxMaxHeight;
    } else {
      layout.width = vBoxMaxWidth;
      layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
    }
  }
  return stacks;
}
function buildLayoutBoxes(boxes) {
  const layoutBoxes = wrapBoxes(boxes);
  const fullSize = sortByWeight(layoutBoxes.filter(wrap => wrap.box.fullSize), true);
  const left = sortByWeight(filterByPosition(layoutBoxes, 'left'), true);
  const right = sortByWeight(filterByPosition(layoutBoxes, 'right'));
  const top = sortByWeight(filterByPosition(layoutBoxes, 'top'), true);
  const bottom = sortByWeight(filterByPosition(layoutBoxes, 'bottom'));
  const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, 'x');
  const centerVertical = filterDynamicPositionByAxis(layoutBoxes, 'y');
  return {
    fullSize,
    leftAndTop: left.concat(top),
    rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
    chartArea: filterByPosition(layoutBoxes, 'chartArea'),
    vertical: left.concat(right).concat(centerVertical),
    horizontal: top.concat(bottom).concat(centerHorizontal)
  };
}
function getCombinedMax(maxPadding, chartArea, a, b) {
  return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
}
function updateMaxPadding(maxPadding, boxPadding) {
  maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
  maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
  maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
  maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
}
function updateDims(chartArea, params, layout, stacks) {
  const {pos, box} = layout;
  const maxPadding = chartArea.maxPadding;
  if (!isObject(pos)) {
    if (layout.size) {
      chartArea[pos] -= layout.size;
    }
    const stack = stacks[layout.stack] || {size: 0, count: 1};
    stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
    layout.size = stack.size / stack.count;
    chartArea[pos] += layout.size;
  }
  if (box.getPadding) {
    updateMaxPadding(maxPadding, box.getPadding());
  }
  const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, 'left', 'right'));
  const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, 'top', 'bottom'));
  const widthChanged = newWidth !== chartArea.w;
  const heightChanged = newHeight !== chartArea.h;
  chartArea.w = newWidth;
  chartArea.h = newHeight;
  return layout.horizontal
    ? {same: widthChanged, other: heightChanged}
    : {same: heightChanged, other: widthChanged};
}
function handleMaxPadding(chartArea) {
  const maxPadding = chartArea.maxPadding;
  function updatePos(pos) {
    const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
    chartArea[pos] += change;
    return change;
  }
  chartArea.y += updatePos('top');
  chartArea.x += updatePos('left');
  updatePos('right');
  updatePos('bottom');
}
function getMargins(horizontal, chartArea) {
  const maxPadding = chartArea.maxPadding;
  function marginForPositions(positions) {
    const margin = {left: 0, top: 0, right: 0, bottom: 0};
    positions.forEach((pos) => {
      margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
    });
    return margin;
  }
  return horizontal
    ? marginForPositions(['left', 'right'])
    : marginForPositions(['top', 'bottom']);
}
function fitBoxes(boxes, chartArea, params, stacks) {
  const refitBoxes = [];
  let i, ilen, layout, box, refit, changed;
  for (i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i) {
    layout = boxes[i];
    box = layout.box;
    box.update(
      layout.width || chartArea.w,
      layout.height || chartArea.h,
      getMargins(layout.horizontal, chartArea)
    );
    const {same, other} = updateDims(chartArea, params, layout, stacks);
    refit |= same && refitBoxes.length;
    changed = changed || other;
    if (!box.fullSize) {
      refitBoxes.push(layout);
    }
  }
  return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
}
function setBoxDims(box, left, top, width, height) {
  box.top = top;
  box.left = left;
  box.right = left + width;
  box.bottom = top + height;
  box.width = width;
  box.height = height;
}
function placeBoxes(boxes, chartArea, params, stacks) {
  const userPadding = params.padding;
  let {x, y} = chartArea;
  for (const layout of boxes) {
    const box = layout.box;
    const stack = stacks[layout.stack] || {placed: 0, weight: 1};
    const weight = (layout.stackWeight / stack.weight) || 1;
    if (layout.horizontal) {
      const width = chartArea.w * weight;
      const height = stack.size || box.height;
      if (defined(stack.start)) {
        y = stack.start;
      }
      if (box.fullSize) {
        setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
      } else {
        setBoxDims(box, chartArea.left + stack.placed, y, width, height);
      }
      stack.start = y;
      stack.placed += width;
      y = box.bottom;
    } else {
      const height = chartArea.h * weight;
      const width = stack.size || box.width;
      if (defined(stack.start)) {
        x = stack.start;
      }
      if (box.fullSize) {
        setBoxDims(box, x, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
      } else {
        setBoxDims(box, x, chartArea.top + stack.placed, width, height);
      }
      stack.start = x;
      stack.placed += height;
      x = box.right;
    }
  }
  chartArea.x = x;
  chartArea.y = y;
}
defaults.set('layout', {
  autoPadding: true,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});
var layouts = {
  addBox(chart, item) {
    if (!chart.boxes) {
      chart.boxes = [];
    }
    item.fullSize = item.fullSize || false;
    item.position = item.position || 'top';
    item.weight = item.weight || 0;
    item._layers = item._layers || function() {
      return [{
        z: 0,
        draw(chartArea) {
          item.draw(chartArea);
        }
      }];
    };
    chart.boxes.push(item);
  },
  removeBox(chart, layoutItem) {
    const index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
    if (index !== -1) {
      chart.boxes.splice(index, 1);
    }
  },
  configure(chart, item, options) {
    item.fullSize = options.fullSize;
    item.position = options.position;
    item.weight = options.weight;
  },
  update(chart, width, height, minPadding) {
    if (!chart) {
      return;
    }
    const padding = toPadding(chart.options.layout.padding);
    const availableWidth = Math.max(width - padding.width, 0);
    const availableHeight = Math.max(height - padding.height, 0);
    const boxes = buildLayoutBoxes(chart.boxes);
    const verticalBoxes = boxes.vertical;
    const horizontalBoxes = boxes.horizontal;
    each(chart.boxes, box => {
      if (typeof box.beforeLayout === 'function') {
        box.beforeLayout();
      }
    });
    const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap) =>
      wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
    const params = Object.freeze({
      outerWidth: width,
      outerHeight: height,
      padding,
      availableWidth,
      availableHeight,
      vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
      hBoxMaxHeight: availableHeight / 2
    });
    const maxPadding = Object.assign({}, padding);
    updateMaxPadding(maxPadding, toPadding(minPadding));
    const chartArea = Object.assign({
      maxPadding,
      w: availableWidth,
      h: availableHeight,
      x: padding.left,
      y: padding.top
    }, padding);
    const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
    fitBoxes(boxes.fullSize, chartArea, params, stacks);
    fitBoxes(verticalBoxes, chartArea, params, stacks);
    if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
      fitBoxes(verticalBoxes, chartArea, params, stacks);
    }
    handleMaxPadding(chartArea);
    placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
    chartArea.x += chartArea.w;
    chartArea.y += chartArea.h;
    placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
    chart.chartArea = {
      left: chartArea.left,
      top: chartArea.top,
      right: chartArea.left + chartArea.w,
      bottom: chartArea.top + chartArea.h,
      height: chartArea.h,
      width: chartArea.w,
    };
    each(boxes.chartArea, (layout) => {
      const box = layout.box;
      Object.assign(box, chart.chartArea);
      box.update(chartArea.w, chartArea.h, {left: 0, top: 0, right: 0, bottom: 0});
    });
  }
};

class BasePlatform {
  acquireContext(canvas, aspectRatio) {}
  releaseContext(context) {
    return false;
  }
  addEventListener(chart, type, listener) {}
  removeEventListener(chart, type, listener) {}
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(element, width, height, aspectRatio) {
    width = Math.max(0, width || element.width);
    height = height || element.height;
    return {
      width,
      height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
    };
  }
  isAttached(canvas) {
    return true;
  }
  updateConfig(config) {
  }
}

class BasicPlatform extends BasePlatform {
  acquireContext(item) {
    return item && item.getContext && item.getContext('2d') || null;
  }
  updateConfig(config) {
    config.options.animation = false;
  }
}

const EXPANDO_KEY = '$chartjs';
const EVENT_TYPES = {
  touchstart: 'mousedown',
  touchmove: 'mousemove',
  touchend: 'mouseup',
  pointerenter: 'mouseenter',
  pointerdown: 'mousedown',
  pointermove: 'mousemove',
  pointerup: 'mouseup',
  pointerleave: 'mouseout',
  pointerout: 'mouseout'
};
const isNullOrEmpty = value => value === null || value === '';
function initCanvas(canvas, aspectRatio) {
  const style = canvas.style;
  const renderHeight = canvas.getAttribute('height');
  const renderWidth = canvas.getAttribute('width');
  canvas[EXPANDO_KEY] = {
    initial: {
      height: renderHeight,
      width: renderWidth,
      style: {
        display: style.display,
        height: style.height,
        width: style.width
      }
    }
  };
  style.display = style.display || 'block';
  style.boxSizing = style.boxSizing || 'border-box';
  if (isNullOrEmpty(renderWidth)) {
    const displayWidth = readUsedSize(canvas, 'width');
    if (displayWidth !== undefined) {
      canvas.width = displayWidth;
    }
  }
  if (isNullOrEmpty(renderHeight)) {
    if (canvas.style.height === '') {
      canvas.height = canvas.width / (aspectRatio || 2);
    } else {
      const displayHeight = readUsedSize(canvas, 'height');
      if (displayHeight !== undefined) {
        canvas.height = displayHeight;
      }
    }
  }
  return canvas;
}
const eventListenerOptions = supportsEventListenerOptions ? {passive: true} : false;
function addListener(node, type, listener) {
  node.addEventListener(type, listener, eventListenerOptions);
}
function removeListener(chart, type, listener) {
  chart.canvas.removeEventListener(type, listener, eventListenerOptions);
}
function fromNativeEvent(event, chart) {
  const type = EVENT_TYPES[event.type] || event.type;
  const {x, y} = getRelativePosition$1(event, chart);
  return {
    type,
    chart,
    native: event,
    x: x !== undefined ? x : null,
    y: y !== undefined ? y : null,
  };
}
function nodeListContains(nodeList, canvas) {
  for (const node of nodeList) {
    if (node === canvas || node.contains(canvas)) {
      return true;
    }
  }
}
function createAttachObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const observer = new MutationObserver(entries => {
    let trigger = false;
    for (const entry of entries) {
      trigger = trigger || nodeListContains(entry.addedNodes, canvas);
      trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
    }
    if (trigger) {
      listener();
    }
  });
  observer.observe(document, {childList: true, subtree: true});
  return observer;
}
function createDetachObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const observer = new MutationObserver(entries => {
    let trigger = false;
    for (const entry of entries) {
      trigger = trigger || nodeListContains(entry.removedNodes, canvas);
      trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
    }
    if (trigger) {
      listener();
    }
  });
  observer.observe(document, {childList: true, subtree: true});
  return observer;
}
const drpListeningCharts = new Map();
let oldDevicePixelRatio = 0;
function onWindowResize() {
  const dpr = window.devicePixelRatio;
  if (dpr === oldDevicePixelRatio) {
    return;
  }
  oldDevicePixelRatio = dpr;
  drpListeningCharts.forEach((resize, chart) => {
    if (chart.currentDevicePixelRatio !== dpr) {
      resize();
    }
  });
}
function listenDevicePixelRatioChanges(chart, resize) {
  if (!drpListeningCharts.size) {
    window.addEventListener('resize', onWindowResize);
  }
  drpListeningCharts.set(chart, resize);
}
function unlistenDevicePixelRatioChanges(chart) {
  drpListeningCharts.delete(chart);
  if (!drpListeningCharts.size) {
    window.removeEventListener('resize', onWindowResize);
  }
}
function createResizeObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const container = canvas && _getParentNode(canvas);
  if (!container) {
    return;
  }
  const resize = throttled((width, height) => {
    const w = container.clientWidth;
    listener(width, height);
    if (w < container.clientWidth) {
      listener();
    }
  }, window);
  const observer = new ResizeObserver(entries => {
    const entry = entries[0];
    const width = entry.contentRect.width;
    const height = entry.contentRect.height;
    if (width === 0 && height === 0) {
      return;
    }
    resize(width, height);
  });
  observer.observe(container);
  listenDevicePixelRatioChanges(chart, resize);
  return observer;
}
function releaseObserver(chart, type, observer) {
  if (observer) {
    observer.disconnect();
  }
  if (type === 'resize') {
    unlistenDevicePixelRatioChanges(chart);
  }
}
function createProxyAndListen(chart, type, listener) {
  const canvas = chart.canvas;
  const proxy = throttled((event) => {
    if (chart.ctx !== null) {
      listener(fromNativeEvent(event, chart));
    }
  }, chart, (args) => {
    const event = args[0];
    return [event, event.offsetX, event.offsetY];
  });
  addListener(canvas, type, proxy);
  return proxy;
}
class DomPlatform extends BasePlatform {
  acquireContext(canvas, aspectRatio) {
    const context = canvas && canvas.getContext && canvas.getContext('2d');
    if (context && context.canvas === canvas) {
      initCanvas(canvas, aspectRatio);
      return context;
    }
    return null;
  }
  releaseContext(context) {
    const canvas = context.canvas;
    if (!canvas[EXPANDO_KEY]) {
      return false;
    }
    const initial = canvas[EXPANDO_KEY].initial;
    ['height', 'width'].forEach((prop) => {
      const value = initial[prop];
      if (isNullOrUndef(value)) {
        canvas.removeAttribute(prop);
      } else {
        canvas.setAttribute(prop, value);
      }
    });
    const style = initial.style || {};
    Object.keys(style).forEach((key) => {
      canvas.style[key] = style[key];
    });
    canvas.width = canvas.width;
    delete canvas[EXPANDO_KEY];
    return true;
  }
  addEventListener(chart, type, listener) {
    this.removeEventListener(chart, type);
    const proxies = chart.$proxies || (chart.$proxies = {});
    const handlers = {
      attach: createAttachObserver,
      detach: createDetachObserver,
      resize: createResizeObserver
    };
    const handler = handlers[type] || createProxyAndListen;
    proxies[type] = handler(chart, type, listener);
  }
  removeEventListener(chart, type) {
    const proxies = chart.$proxies || (chart.$proxies = {});
    const proxy = proxies[type];
    if (!proxy) {
      return;
    }
    const handlers = {
      attach: releaseObserver,
      detach: releaseObserver,
      resize: releaseObserver
    };
    const handler = handlers[type] || removeListener;
    handler(chart, type, proxy);
    proxies[type] = undefined;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(canvas, width, height, aspectRatio) {
    return getMaximumSize(canvas, width, height, aspectRatio);
  }
  isAttached(canvas) {
    const container = _getParentNode(canvas);
    return !!(container && container.isConnected);
  }
}

function _detectPlatform(canvas) {
  if (!_isDomSupported() || (typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas)) {
    return BasicPlatform;
  }
  return DomPlatform;
}

class Element {
  constructor() {
    this.x = undefined;
    this.y = undefined;
    this.active = false;
    this.options = undefined;
    this.$animations = undefined;
  }
  tooltipPosition(useFinalPosition) {
    const {x, y} = this.getProps(['x', 'y'], useFinalPosition);
    return {x, y};
  }
  hasValue() {
    return isNumber(this.x) && isNumber(this.y);
  }
  getProps(props, final) {
    const anims = this.$animations;
    if (!final || !anims) {
      return this;
    }
    const ret = {};
    props.forEach(prop => {
      ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
    });
    return ret;
  }
}
Element.defaults = {};
Element.defaultRoutes = undefined;

const formatters = {
  values(value) {
    return isArray(value) ? value : '' + value;
  },
  numeric(tickValue, index, ticks) {
    if (tickValue === 0) {
      return '0';
    }
    const locale = this.chart.options.locale;
    let notation;
    let delta = tickValue;
    if (ticks.length > 1) {
      const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
      if (maxTick < 1e-4 || maxTick > 1e+15) {
        notation = 'scientific';
      }
      delta = calculateDelta(tickValue, ticks);
    }
    const logDelta = log10(Math.abs(delta));
    const numDecimal = Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
    const options = {notation, minimumFractionDigits: numDecimal, maximumFractionDigits: numDecimal};
    Object.assign(options, this.options.ticks.format);
    return formatNumber(tickValue, locale, options);
  },
  logarithmic(tickValue, index, ticks) {
    if (tickValue === 0) {
      return '0';
    }
    const remain = tickValue / (Math.pow(10, Math.floor(log10(tickValue))));
    if (remain === 1 || remain === 2 || remain === 5) {
      return formatters.numeric.call(this, tickValue, index, ticks);
    }
    return '';
  }
};
function calculateDelta(tickValue, ticks) {
  let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
  if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
    delta = tickValue - Math.floor(tickValue);
  }
  return delta;
}
var Ticks = {formatters};

defaults.set('scale', {
  display: true,
  offset: false,
  reverse: false,
  beginAtZero: false,
  bounds: 'ticks',
  grace: 0,
  grid: {
    display: true,
    lineWidth: 1,
    drawBorder: true,
    drawOnChartArea: true,
    drawTicks: true,
    tickLength: 8,
    tickWidth: (_ctx, options) => options.lineWidth,
    tickColor: (_ctx, options) => options.color,
    offset: false,
    borderDash: [],
    borderDashOffset: 0.0,
    borderWidth: 1
  },
  title: {
    display: false,
    text: '',
    padding: {
      top: 4,
      bottom: 4
    }
  },
  ticks: {
    minRotation: 0,
    maxRotation: 50,
    mirror: false,
    textStrokeWidth: 0,
    textStrokeColor: '',
    padding: 3,
    display: true,
    autoSkip: true,
    autoSkipPadding: 3,
    labelOffset: 0,
    callback: Ticks.formatters.values,
    minor: {},
    major: {},
    align: 'center',
    crossAlign: 'near',
    showLabelBackdrop: false,
    backdropColor: 'rgba(255, 255, 255, 0.75)',
    backdropPadding: 2,
  }
});
defaults.route('scale.ticks', 'color', '', 'color');
defaults.route('scale.grid', 'color', '', 'borderColor');
defaults.route('scale.grid', 'borderColor', '', 'borderColor');
defaults.route('scale.title', 'color', '', 'color');
defaults.describe('scale', {
  _fallback: false,
  _scriptable: (name) => !name.startsWith('before') && !name.startsWith('after') && name !== 'callback' && name !== 'parser',
  _indexable: (name) => name !== 'borderDash' && name !== 'tickBorderDash',
});
defaults.describe('scales', {
  _fallback: 'scale',
});
defaults.describe('scale.ticks', {
  _scriptable: (name) => name !== 'backdropPadding' && name !== 'callback',
  _indexable: (name) => name !== 'backdropPadding',
});

function autoSkip(scale, ticks) {
  const tickOpts = scale.options.ticks;
  const ticksLimit = tickOpts.maxTicksLimit || determineMaxTicks(scale);
  const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
  const numMajorIndices = majorIndices.length;
  const first = majorIndices[0];
  const last = majorIndices[numMajorIndices - 1];
  const newTicks = [];
  if (numMajorIndices > ticksLimit) {
    skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
    return newTicks;
  }
  const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
  if (numMajorIndices > 0) {
    let i, ilen;
    const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
    skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
    for (i = 0, ilen = numMajorIndices - 1; i < ilen; i++) {
      skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
    }
    skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
    return newTicks;
  }
  skip(ticks, newTicks, spacing);
  return newTicks;
}
function determineMaxTicks(scale) {
  const offset = scale.options.offset;
  const tickLength = scale._tickSize();
  const maxScale = scale._length / tickLength + (offset ? 0 : 1);
  const maxChart = scale._maxLength / tickLength;
  return Math.floor(Math.min(maxScale, maxChart));
}
function calculateSpacing(majorIndices, ticks, ticksLimit) {
  const evenMajorSpacing = getEvenSpacing(majorIndices);
  const spacing = ticks.length / ticksLimit;
  if (!evenMajorSpacing) {
    return Math.max(spacing, 1);
  }
  const factors = _factorize(evenMajorSpacing);
  for (let i = 0, ilen = factors.length - 1; i < ilen; i++) {
    const factor = factors[i];
    if (factor > spacing) {
      return factor;
    }
  }
  return Math.max(spacing, 1);
}
function getMajorIndices(ticks) {
  const result = [];
  let i, ilen;
  for (i = 0, ilen = ticks.length; i < ilen; i++) {
    if (ticks[i].major) {
      result.push(i);
    }
  }
  return result;
}
function skipMajors(ticks, newTicks, majorIndices, spacing) {
  let count = 0;
  let next = majorIndices[0];
  let i;
  spacing = Math.ceil(spacing);
  for (i = 0; i < ticks.length; i++) {
    if (i === next) {
      newTicks.push(ticks[i]);
      count++;
      next = majorIndices[count * spacing];
    }
  }
}
function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
  const start = valueOrDefault(majorStart, 0);
  const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
  let count = 0;
  let length, i, next;
  spacing = Math.ceil(spacing);
  if (majorEnd) {
    length = majorEnd - majorStart;
    spacing = length / Math.floor(length / spacing);
  }
  next = start;
  while (next < 0) {
    count++;
    next = Math.round(start + count * spacing);
  }
  for (i = Math.max(start, 0); i < end; i++) {
    if (i === next) {
      newTicks.push(ticks[i]);
      count++;
      next = Math.round(start + count * spacing);
    }
  }
}
function getEvenSpacing(arr) {
  const len = arr.length;
  let i, diff;
  if (len < 2) {
    return false;
  }
  for (diff = arr[0], i = 1; i < len; ++i) {
    if (arr[i] - arr[i - 1] !== diff) {
      return false;
    }
  }
  return diff;
}

const reverseAlign = (align) => align === 'left' ? 'right' : align === 'right' ? 'left' : align;
const offsetFromEdge = (scale, edge, offset) => edge === 'top' || edge === 'left' ? scale[edge] + offset : scale[edge] - offset;
function sample(arr, numItems) {
  const result = [];
  const increment = arr.length / numItems;
  const len = arr.length;
  let i = 0;
  for (; i < len; i += increment) {
    result.push(arr[Math.floor(i)]);
  }
  return result;
}
function getPixelForGridLine(scale, index, offsetGridLines) {
  const length = scale.ticks.length;
  const validIndex = Math.min(index, length - 1);
  const start = scale._startPixel;
  const end = scale._endPixel;
  const epsilon = 1e-6;
  let lineValue = scale.getPixelForTick(validIndex);
  let offset;
  if (offsetGridLines) {
    if (length === 1) {
      offset = Math.max(lineValue - start, end - lineValue);
    } else if (index === 0) {
      offset = (scale.getPixelForTick(1) - lineValue) / 2;
    } else {
      offset = (lineValue - scale.getPixelForTick(validIndex - 1)) / 2;
    }
    lineValue += validIndex < index ? offset : -offset;
    if (lineValue < start - epsilon || lineValue > end + epsilon) {
      return;
    }
  }
  return lineValue;
}
function garbageCollect(caches, length) {
  each(caches, (cache) => {
    const gc = cache.gc;
    const gcLen = gc.length / 2;
    let i;
    if (gcLen > length) {
      for (i = 0; i < gcLen; ++i) {
        delete cache.data[gc[i]];
      }
      gc.splice(0, gcLen);
    }
  });
}
function getTickMarkLength(options) {
  return options.drawTicks ? options.tickLength : 0;
}
function getTitleHeight(options, fallback) {
  if (!options.display) {
    return 0;
  }
  const font = toFont(options.font, fallback);
  const padding = toPadding(options.padding);
  const lines = isArray(options.text) ? options.text.length : 1;
  return (lines * font.lineHeight) + padding.height;
}
function createScaleContext(parent, scale) {
  return createContext(parent, {
    scale,
    type: 'scale'
  });
}
function createTickContext(parent, index, tick) {
  return createContext(parent, {
    tick,
    index,
    type: 'tick'
  });
}
function titleAlign(align, position, reverse) {
  let ret = _toLeftRightCenter(align);
  if ((reverse && position !== 'right') || (!reverse && position === 'right')) {
    ret = reverseAlign(ret);
  }
  return ret;
}
function titleArgs(scale, offset, position, align) {
  const {top, left, bottom, right, chart} = scale;
  const {chartArea, scales} = chart;
  let rotation = 0;
  let maxWidth, titleX, titleY;
  const height = bottom - top;
  const width = right - left;
  if (scale.isHorizontal()) {
    titleX = _alignStartEnd(align, left, right);
    if (isObject(position)) {
      const positionAxisID = Object.keys(position)[0];
      const value = position[positionAxisID];
      titleY = scales[positionAxisID].getPixelForValue(value) + height - offset;
    } else if (position === 'center') {
      titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
    } else {
      titleY = offsetFromEdge(scale, position, offset);
    }
    maxWidth = right - left;
  } else {
    if (isObject(position)) {
      const positionAxisID = Object.keys(position)[0];
      const value = position[positionAxisID];
      titleX = scales[positionAxisID].getPixelForValue(value) - width + offset;
    } else if (position === 'center') {
      titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
    } else {
      titleX = offsetFromEdge(scale, position, offset);
    }
    titleY = _alignStartEnd(align, bottom, top);
    rotation = position === 'left' ? -HALF_PI : HALF_PI;
  }
  return {titleX, titleY, maxWidth, rotation};
}
class Scale extends Element {
  constructor(cfg) {
    super();
    this.id = cfg.id;
    this.type = cfg.type;
    this.options = undefined;
    this.ctx = cfg.ctx;
    this.chart = cfg.chart;
    this.top = undefined;
    this.bottom = undefined;
    this.left = undefined;
    this.right = undefined;
    this.width = undefined;
    this.height = undefined;
    this._margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
    this.maxWidth = undefined;
    this.maxHeight = undefined;
    this.paddingTop = undefined;
    this.paddingBottom = undefined;
    this.paddingLeft = undefined;
    this.paddingRight = undefined;
    this.axis = undefined;
    this.labelRotation = undefined;
    this.min = undefined;
    this.max = undefined;
    this._range = undefined;
    this.ticks = [];
    this._gridLineItems = null;
    this._labelItems = null;
    this._labelSizes = null;
    this._length = 0;
    this._maxLength = 0;
    this._longestTextCache = {};
    this._startPixel = undefined;
    this._endPixel = undefined;
    this._reversePixels = false;
    this._userMax = undefined;
    this._userMin = undefined;
    this._suggestedMax = undefined;
    this._suggestedMin = undefined;
    this._ticksLength = 0;
    this._borderValue = 0;
    this._cache = {};
    this._dataLimitsCached = false;
    this.$context = undefined;
  }
  init(options) {
    this.options = options.setContext(this.getContext());
    this.axis = options.axis;
    this._userMin = this.parse(options.min);
    this._userMax = this.parse(options.max);
    this._suggestedMin = this.parse(options.suggestedMin);
    this._suggestedMax = this.parse(options.suggestedMax);
  }
  parse(raw, index) {
    return raw;
  }
  getUserBounds() {
    let {_userMin, _userMax, _suggestedMin, _suggestedMax} = this;
    _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
    _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
    _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
    _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
    return {
      min: finiteOrDefault(_userMin, _suggestedMin),
      max: finiteOrDefault(_userMax, _suggestedMax),
      minDefined: isNumberFinite(_userMin),
      maxDefined: isNumberFinite(_userMax)
    };
  }
  getMinMax(canStack) {
    let {min, max, minDefined, maxDefined} = this.getUserBounds();
    let range;
    if (minDefined && maxDefined) {
      return {min, max};
    }
    const metas = this.getMatchingVisibleMetas();
    for (let i = 0, ilen = metas.length; i < ilen; ++i) {
      range = metas[i].controller.getMinMax(this, canStack);
      if (!minDefined) {
        min = Math.min(min, range.min);
      }
      if (!maxDefined) {
        max = Math.max(max, range.max);
      }
    }
    min = maxDefined && min > max ? max : min;
    max = minDefined && min > max ? min : max;
    return {
      min: finiteOrDefault(min, finiteOrDefault(max, min)),
      max: finiteOrDefault(max, finiteOrDefault(min, max))
    };
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    const data = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
  }
  beforeLayout() {
    this._cache = {};
    this._dataLimitsCached = false;
  }
  beforeUpdate() {
    callback(this.options.beforeUpdate, [this]);
  }
  update(maxWidth, maxHeight, margins) {
    const {beginAtZero, grace, ticks: tickOpts} = this.options;
    const sampleSize = tickOpts.sampleSize;
    this.beforeUpdate();
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this._margins = margins = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, margins);
    this.ticks = null;
    this._labelSizes = null;
    this._gridLineItems = null;
    this._labelItems = null;
    this.beforeSetDimensions();
    this.setDimensions();
    this.afterSetDimensions();
    this._maxLength = this.isHorizontal()
      ? this.width + margins.left + margins.right
      : this.height + margins.top + margins.bottom;
    if (!this._dataLimitsCached) {
      this.beforeDataLimits();
      this.determineDataLimits();
      this.afterDataLimits();
      this._range = _addGrace(this, grace, beginAtZero);
      this._dataLimitsCached = true;
    }
    this.beforeBuildTicks();
    this.ticks = this.buildTicks() || [];
    this.afterBuildTicks();
    const samplingEnabled = sampleSize < this.ticks.length;
    this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
    this.configure();
    this.beforeCalculateLabelRotation();
    this.calculateLabelRotation();
    this.afterCalculateLabelRotation();
    if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === 'auto')) {
      this.ticks = autoSkip(this, this.ticks);
      this._labelSizes = null;
    }
    if (samplingEnabled) {
      this._convertTicksToLabels(this.ticks);
    }
    this.beforeFit();
    this.fit();
    this.afterFit();
    this.afterUpdate();
  }
  configure() {
    let reversePixels = this.options.reverse;
    let startPixel, endPixel;
    if (this.isHorizontal()) {
      startPixel = this.left;
      endPixel = this.right;
    } else {
      startPixel = this.top;
      endPixel = this.bottom;
      reversePixels = !reversePixels;
    }
    this._startPixel = startPixel;
    this._endPixel = endPixel;
    this._reversePixels = reversePixels;
    this._length = endPixel - startPixel;
    this._alignToPixels = this.options.alignToPixels;
  }
  afterUpdate() {
    callback(this.options.afterUpdate, [this]);
  }
  beforeSetDimensions() {
    callback(this.options.beforeSetDimensions, [this]);
  }
  setDimensions() {
    if (this.isHorizontal()) {
      this.width = this.maxWidth;
      this.left = 0;
      this.right = this.width;
    } else {
      this.height = this.maxHeight;
      this.top = 0;
      this.bottom = this.height;
    }
    this.paddingLeft = 0;
    this.paddingTop = 0;
    this.paddingRight = 0;
    this.paddingBottom = 0;
  }
  afterSetDimensions() {
    callback(this.options.afterSetDimensions, [this]);
  }
  _callHooks(name) {
    this.chart.notifyPlugins(name, this.getContext());
    callback(this.options[name], [this]);
  }
  beforeDataLimits() {
    this._callHooks('beforeDataLimits');
  }
  determineDataLimits() {}
  afterDataLimits() {
    this._callHooks('afterDataLimits');
  }
  beforeBuildTicks() {
    this._callHooks('beforeBuildTicks');
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks('afterBuildTicks');
  }
  beforeTickToLabelConversion() {
    callback(this.options.beforeTickToLabelConversion, [this]);
  }
  generateTickLabels(ticks) {
    const tickOpts = this.options.ticks;
    let i, ilen, tick;
    for (i = 0, ilen = ticks.length; i < ilen; i++) {
      tick = ticks[i];
      tick.label = callback(tickOpts.callback, [tick.value, i, ticks], this);
    }
  }
  afterTickToLabelConversion() {
    callback(this.options.afterTickToLabelConversion, [this]);
  }
  beforeCalculateLabelRotation() {
    callback(this.options.beforeCalculateLabelRotation, [this]);
  }
  calculateLabelRotation() {
    const options = this.options;
    const tickOpts = options.ticks;
    const numTicks = this.ticks.length;
    const minRotation = tickOpts.minRotation || 0;
    const maxRotation = tickOpts.maxRotation;
    let labelRotation = minRotation;
    let tickWidth, maxHeight, maxLabelDiagonal;
    if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
      this.labelRotation = minRotation;
      return;
    }
    const labelSizes = this._getLabelSizes();
    const maxLabelWidth = labelSizes.widest.width;
    const maxLabelHeight = labelSizes.highest.height;
    const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
    tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
    if (maxLabelWidth + 6 > tickWidth) {
      tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
      maxHeight = this.maxHeight - getTickMarkLength(options.grid)
				- tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
      maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
      labelRotation = toDegrees(Math.min(
        Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)),
        Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))
      ));
      labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
    }
    this.labelRotation = labelRotation;
  }
  afterCalculateLabelRotation() {
    callback(this.options.afterCalculateLabelRotation, [this]);
  }
  beforeFit() {
    callback(this.options.beforeFit, [this]);
  }
  fit() {
    const minSize = {
      width: 0,
      height: 0
    };
    const {chart, options: {ticks: tickOpts, title: titleOpts, grid: gridOpts}} = this;
    const display = this._isVisible();
    const isHorizontal = this.isHorizontal();
    if (display) {
      const titleHeight = getTitleHeight(titleOpts, chart.options.font);
      if (isHorizontal) {
        minSize.width = this.maxWidth;
        minSize.height = getTickMarkLength(gridOpts) + titleHeight;
      } else {
        minSize.height = this.maxHeight;
        minSize.width = getTickMarkLength(gridOpts) + titleHeight;
      }
      if (tickOpts.display && this.ticks.length) {
        const {first, last, widest, highest} = this._getLabelSizes();
        const tickPadding = tickOpts.padding * 2;
        const angleRadians = toRadians(this.labelRotation);
        const cos = Math.cos(angleRadians);
        const sin = Math.sin(angleRadians);
        if (isHorizontal) {
          const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
          minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
        } else {
          const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
          minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
        }
        this._calculatePadding(first, last, sin, cos);
      }
    }
    this._handleMargins();
    if (isHorizontal) {
      this.width = this._length = chart.width - this._margins.left - this._margins.right;
      this.height = minSize.height;
    } else {
      this.width = minSize.width;
      this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
    }
  }
  _calculatePadding(first, last, sin, cos) {
    const {ticks: {align, padding}, position} = this.options;
    const isRotated = this.labelRotation !== 0;
    const labelsBelowTicks = position !== 'top' && this.axis === 'x';
    if (this.isHorizontal()) {
      const offsetLeft = this.getPixelForTick(0) - this.left;
      const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
      let paddingLeft = 0;
      let paddingRight = 0;
      if (isRotated) {
        if (labelsBelowTicks) {
          paddingLeft = cos * first.width;
          paddingRight = sin * last.height;
        } else {
          paddingLeft = sin * first.height;
          paddingRight = cos * last.width;
        }
      } else if (align === 'start') {
        paddingRight = last.width;
      } else if (align === 'end') {
        paddingLeft = first.width;
      } else {
        paddingLeft = first.width / 2;
        paddingRight = last.width / 2;
      }
      this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
      this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
    } else {
      let paddingTop = last.height / 2;
      let paddingBottom = first.height / 2;
      if (align === 'start') {
        paddingTop = 0;
        paddingBottom = first.height;
      } else if (align === 'end') {
        paddingTop = last.height;
        paddingBottom = 0;
      }
      this.paddingTop = paddingTop + padding;
      this.paddingBottom = paddingBottom + padding;
    }
  }
  _handleMargins() {
    if (this._margins) {
      this._margins.left = Math.max(this.paddingLeft, this._margins.left);
      this._margins.top = Math.max(this.paddingTop, this._margins.top);
      this._margins.right = Math.max(this.paddingRight, this._margins.right);
      this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
    }
  }
  afterFit() {
    callback(this.options.afterFit, [this]);
  }
  isHorizontal() {
    const {axis, position} = this.options;
    return position === 'top' || position === 'bottom' || axis === 'x';
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(ticks) {
    this.beforeTickToLabelConversion();
    this.generateTickLabels(ticks);
    let i, ilen;
    for (i = 0, ilen = ticks.length; i < ilen; i++) {
      if (isNullOrUndef(ticks[i].label)) {
        ticks.splice(i, 1);
        ilen--;
        i--;
      }
    }
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let labelSizes = this._labelSizes;
    if (!labelSizes) {
      const sampleSize = this.options.ticks.sampleSize;
      let ticks = this.ticks;
      if (sampleSize < ticks.length) {
        ticks = sample(ticks, sampleSize);
      }
      this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length);
    }
    return labelSizes;
  }
  _computeLabelSizes(ticks, length) {
    const {ctx, _longestTextCache: caches} = this;
    const widths = [];
    const heights = [];
    let widestLabelSize = 0;
    let highestLabelSize = 0;
    let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
    for (i = 0; i < length; ++i) {
      label = ticks[i].label;
      tickFont = this._resolveTickFontOptions(i);
      ctx.font = fontString = tickFont.string;
      cache = caches[fontString] = caches[fontString] || {data: {}, gc: []};
      lineHeight = tickFont.lineHeight;
      width = height = 0;
      if (!isNullOrUndef(label) && !isArray(label)) {
        width = _measureText(ctx, cache.data, cache.gc, width, label);
        height = lineHeight;
      } else if (isArray(label)) {
        for (j = 0, jlen = label.length; j < jlen; ++j) {
          nestedLabel = label[j];
          if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
            width = _measureText(ctx, cache.data, cache.gc, width, nestedLabel);
            height += lineHeight;
          }
        }
      }
      widths.push(width);
      heights.push(height);
      widestLabelSize = Math.max(width, widestLabelSize);
      highestLabelSize = Math.max(height, highestLabelSize);
    }
    garbageCollect(caches, length);
    const widest = widths.indexOf(widestLabelSize);
    const highest = heights.indexOf(highestLabelSize);
    const valueAt = (idx) => ({width: widths[idx] || 0, height: heights[idx] || 0});
    return {
      first: valueAt(0),
      last: valueAt(length - 1),
      widest: valueAt(widest),
      highest: valueAt(highest),
      widths,
      heights,
    };
  }
  getLabelForValue(value) {
    return value;
  }
  getPixelForValue(value, index) {
    return NaN;
  }
  getValueForPixel(pixel) {}
  getPixelForTick(index) {
    const ticks = this.ticks;
    if (index < 0 || index > ticks.length - 1) {
      return null;
    }
    return this.getPixelForValue(ticks[index].value);
  }
  getPixelForDecimal(decimal) {
    if (this._reversePixels) {
      decimal = 1 - decimal;
    }
    const pixel = this._startPixel + decimal * this._length;
    return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
  }
  getDecimalForPixel(pixel) {
    const decimal = (pixel - this._startPixel) / this._length;
    return this._reversePixels ? 1 - decimal : decimal;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const {min, max} = this;
    return min < 0 && max < 0 ? max :
      min > 0 && max > 0 ? min :
      0;
  }
  getContext(index) {
    const ticks = this.ticks || [];
    if (index >= 0 && index < ticks.length) {
      const tick = ticks[index];
      return tick.$context ||
				(tick.$context = createTickContext(this.getContext(), index, tick));
    }
    return this.$context ||
			(this.$context = createScaleContext(this.chart.getContext(), this));
  }
  _tickSize() {
    const optionTicks = this.options.ticks;
    const rot = toRadians(this.labelRotation);
    const cos = Math.abs(Math.cos(rot));
    const sin = Math.abs(Math.sin(rot));
    const labelSizes = this._getLabelSizes();
    const padding = optionTicks.autoSkipPadding || 0;
    const w = labelSizes ? labelSizes.widest.width + padding : 0;
    const h = labelSizes ? labelSizes.highest.height + padding : 0;
    return this.isHorizontal()
      ? h * cos > w * sin ? w / cos : h / sin
      : h * sin < w * cos ? h / cos : w / sin;
  }
  _isVisible() {
    const display = this.options.display;
    if (display !== 'auto') {
      return !!display;
    }
    return this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(chartArea) {
    const axis = this.axis;
    const chart = this.chart;
    const options = this.options;
    const {grid, position} = options;
    const offset = grid.offset;
    const isHorizontal = this.isHorizontal();
    const ticks = this.ticks;
    const ticksLength = ticks.length + (offset ? 1 : 0);
    const tl = getTickMarkLength(grid);
    const items = [];
    const borderOpts = grid.setContext(this.getContext());
    const axisWidth = borderOpts.drawBorder ? borderOpts.borderWidth : 0;
    const axisHalfWidth = axisWidth / 2;
    const alignBorderValue = function(pixel) {
      return _alignPixel(chart, pixel, axisWidth);
    };
    let borderValue, i, lineValue, alignedLineValue;
    let tx1, ty1, tx2, ty2, x1, y1, x2, y2;
    if (position === 'top') {
      borderValue = alignBorderValue(this.bottom);
      ty1 = this.bottom - tl;
      ty2 = borderValue - axisHalfWidth;
      y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
      y2 = chartArea.bottom;
    } else if (position === 'bottom') {
      borderValue = alignBorderValue(this.top);
      y1 = chartArea.top;
      y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
      ty1 = borderValue + axisHalfWidth;
      ty2 = this.top + tl;
    } else if (position === 'left') {
      borderValue = alignBorderValue(this.right);
      tx1 = this.right - tl;
      tx2 = borderValue - axisHalfWidth;
      x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
      x2 = chartArea.right;
    } else if (position === 'right') {
      borderValue = alignBorderValue(this.left);
      x1 = chartArea.left;
      x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
      tx1 = borderValue + axisHalfWidth;
      tx2 = this.left + tl;
    } else if (axis === 'x') {
      if (position === 'center') {
        borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
      }
      y1 = chartArea.top;
      y2 = chartArea.bottom;
      ty1 = borderValue + axisHalfWidth;
      ty2 = ty1 + tl;
    } else if (axis === 'y') {
      if (position === 'center') {
        borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
      }
      tx1 = borderValue - axisHalfWidth;
      tx2 = tx1 - tl;
      x1 = chartArea.left;
      x2 = chartArea.right;
    }
    const limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
    const step = Math.max(1, Math.ceil(ticksLength / limit));
    for (i = 0; i < ticksLength; i += step) {
      const optsAtIndex = grid.setContext(this.getContext(i));
      const lineWidth = optsAtIndex.lineWidth;
      const lineColor = optsAtIndex.color;
      const borderDash = grid.borderDash || [];
      const borderDashOffset = optsAtIndex.borderDashOffset;
      const tickWidth = optsAtIndex.tickWidth;
      const tickColor = optsAtIndex.tickColor;
      const tickBorderDash = optsAtIndex.tickBorderDash || [];
      const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
      lineValue = getPixelForGridLine(this, i, offset);
      if (lineValue === undefined) {
        continue;
      }
      alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
      if (isHorizontal) {
        tx1 = tx2 = x1 = x2 = alignedLineValue;
      } else {
        ty1 = ty2 = y1 = y2 = alignedLineValue;
      }
      items.push({
        tx1,
        ty1,
        tx2,
        ty2,
        x1,
        y1,
        x2,
        y2,
        width: lineWidth,
        color: lineColor,
        borderDash,
        borderDashOffset,
        tickWidth,
        tickColor,
        tickBorderDash,
        tickBorderDashOffset,
      });
    }
    this._ticksLength = ticksLength;
    this._borderValue = borderValue;
    return items;
  }
  _computeLabelItems(chartArea) {
    const axis = this.axis;
    const options = this.options;
    const {position, ticks: optionTicks} = options;
    const isHorizontal = this.isHorizontal();
    const ticks = this.ticks;
    const {align, crossAlign, padding, mirror} = optionTicks;
    const tl = getTickMarkLength(options.grid);
    const tickAndPadding = tl + padding;
    const hTickAndPadding = mirror ? -padding : tickAndPadding;
    const rotation = -toRadians(this.labelRotation);
    const items = [];
    let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
    let textBaseline = 'middle';
    if (position === 'top') {
      y = this.bottom - hTickAndPadding;
      textAlign = this._getXAxisLabelAlignment();
    } else if (position === 'bottom') {
      y = this.top + hTickAndPadding;
      textAlign = this._getXAxisLabelAlignment();
    } else if (position === 'left') {
      const ret = this._getYAxisLabelAlignment(tl);
      textAlign = ret.textAlign;
      x = ret.x;
    } else if (position === 'right') {
      const ret = this._getYAxisLabelAlignment(tl);
      textAlign = ret.textAlign;
      x = ret.x;
    } else if (axis === 'x') {
      if (position === 'center') {
        y = ((chartArea.top + chartArea.bottom) / 2) + tickAndPadding;
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        y = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
      }
      textAlign = this._getXAxisLabelAlignment();
    } else if (axis === 'y') {
      if (position === 'center') {
        x = ((chartArea.left + chartArea.right) / 2) - tickAndPadding;
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        x = this.chart.scales[positionAxisID].getPixelForValue(value);
      }
      textAlign = this._getYAxisLabelAlignment(tl).textAlign;
    }
    if (axis === 'y') {
      if (align === 'start') {
        textBaseline = 'top';
      } else if (align === 'end') {
        textBaseline = 'bottom';
      }
    }
    const labelSizes = this._getLabelSizes();
    for (i = 0, ilen = ticks.length; i < ilen; ++i) {
      tick = ticks[i];
      label = tick.label;
      const optsAtIndex = optionTicks.setContext(this.getContext(i));
      pixel = this.getPixelForTick(i) + optionTicks.labelOffset;
      font = this._resolveTickFontOptions(i);
      lineHeight = font.lineHeight;
      lineCount = isArray(label) ? label.length : 1;
      const halfCount = lineCount / 2;
      const color = optsAtIndex.color;
      const strokeColor = optsAtIndex.textStrokeColor;
      const strokeWidth = optsAtIndex.textStrokeWidth;
      if (isHorizontal) {
        x = pixel;
        if (position === 'top') {
          if (crossAlign === 'near' || rotation !== 0) {
            textOffset = -lineCount * lineHeight + lineHeight / 2;
          } else if (crossAlign === 'center') {
            textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
          } else {
            textOffset = -labelSizes.highest.height + lineHeight / 2;
          }
        } else {
          if (crossAlign === 'near' || rotation !== 0) {
            textOffset = lineHeight / 2;
          } else if (crossAlign === 'center') {
            textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
          } else {
            textOffset = labelSizes.highest.height - lineCount * lineHeight;
          }
        }
        if (mirror) {
          textOffset *= -1;
        }
      } else {
        y = pixel;
        textOffset = (1 - lineCount) * lineHeight / 2;
      }
      let backdrop;
      if (optsAtIndex.showLabelBackdrop) {
        const labelPadding = toPadding(optsAtIndex.backdropPadding);
        const height = labelSizes.heights[i];
        const width = labelSizes.widths[i];
        let top = y + textOffset - labelPadding.top;
        let left = x - labelPadding.left;
        switch (textBaseline) {
        case 'middle':
          top -= height / 2;
          break;
        case 'bottom':
          top -= height;
          break;
        }
        switch (textAlign) {
        case 'center':
          left -= width / 2;
          break;
        case 'right':
          left -= width;
          break;
        }
        backdrop = {
          left,
          top,
          width: width + labelPadding.width,
          height: height + labelPadding.height,
          color: optsAtIndex.backdropColor,
        };
      }
      items.push({
        rotation,
        label,
        font,
        color,
        strokeColor,
        strokeWidth,
        textOffset,
        textAlign,
        textBaseline,
        translation: [x, y],
        backdrop,
      });
    }
    return items;
  }
  _getXAxisLabelAlignment() {
    const {position, ticks} = this.options;
    const rotation = -toRadians(this.labelRotation);
    if (rotation) {
      return position === 'top' ? 'left' : 'right';
    }
    let align = 'center';
    if (ticks.align === 'start') {
      align = 'left';
    } else if (ticks.align === 'end') {
      align = 'right';
    }
    return align;
  }
  _getYAxisLabelAlignment(tl) {
    const {position, ticks: {crossAlign, mirror, padding}} = this.options;
    const labelSizes = this._getLabelSizes();
    const tickAndPadding = tl + padding;
    const widest = labelSizes.widest.width;
    let textAlign;
    let x;
    if (position === 'left') {
      if (mirror) {
        x = this.right + padding;
        if (crossAlign === 'near') {
          textAlign = 'left';
        } else if (crossAlign === 'center') {
          textAlign = 'center';
          x += (widest / 2);
        } else {
          textAlign = 'right';
          x += widest;
        }
      } else {
        x = this.right - tickAndPadding;
        if (crossAlign === 'near') {
          textAlign = 'right';
        } else if (crossAlign === 'center') {
          textAlign = 'center';
          x -= (widest / 2);
        } else {
          textAlign = 'left';
          x = this.left;
        }
      }
    } else if (position === 'right') {
      if (mirror) {
        x = this.left + padding;
        if (crossAlign === 'near') {
          textAlign = 'right';
        } else if (crossAlign === 'center') {
          textAlign = 'center';
          x -= (widest / 2);
        } else {
          textAlign = 'left';
          x -= widest;
        }
      } else {
        x = this.left + tickAndPadding;
        if (crossAlign === 'near') {
          textAlign = 'left';
        } else if (crossAlign === 'center') {
          textAlign = 'center';
          x += widest / 2;
        } else {
          textAlign = 'right';
          x = this.right;
        }
      }
    } else {
      textAlign = 'right';
    }
    return {textAlign, x};
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror) {
      return;
    }
    const chart = this.chart;
    const position = this.options.position;
    if (position === 'left' || position === 'right') {
      return {top: 0, left: this.left, bottom: chart.height, right: this.right};
    } if (position === 'top' || position === 'bottom') {
      return {top: this.top, left: 0, bottom: this.bottom, right: chart.width};
    }
  }
  drawBackground() {
    const {ctx, options: {backgroundColor}, left, top, width, height} = this;
    if (backgroundColor) {
      ctx.save();
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(left, top, width, height);
      ctx.restore();
    }
  }
  getLineWidthForValue(value) {
    const grid = this.options.grid;
    if (!this._isVisible() || !grid.display) {
      return 0;
    }
    const ticks = this.ticks;
    const index = ticks.findIndex(t => t.value === value);
    if (index >= 0) {
      const opts = grid.setContext(this.getContext(index));
      return opts.lineWidth;
    }
    return 0;
  }
  drawGrid(chartArea) {
    const grid = this.options.grid;
    const ctx = this.ctx;
    const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
    let i, ilen;
    const drawLine = (p1, p2, style) => {
      if (!style.width || !style.color) {
        return;
      }
      ctx.save();
      ctx.lineWidth = style.width;
      ctx.strokeStyle = style.color;
      ctx.setLineDash(style.borderDash || []);
      ctx.lineDashOffset = style.borderDashOffset;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.restore();
    };
    if (grid.display) {
      for (i = 0, ilen = items.length; i < ilen; ++i) {
        const item = items[i];
        if (grid.drawOnChartArea) {
          drawLine(
            {x: item.x1, y: item.y1},
            {x: item.x2, y: item.y2},
            item
          );
        }
        if (grid.drawTicks) {
          drawLine(
            {x: item.tx1, y: item.ty1},
            {x: item.tx2, y: item.ty2},
            {
              color: item.tickColor,
              width: item.tickWidth,
              borderDash: item.tickBorderDash,
              borderDashOffset: item.tickBorderDashOffset
            }
          );
        }
      }
    }
  }
  drawBorder() {
    const {chart, ctx, options: {grid}} = this;
    const borderOpts = grid.setContext(this.getContext());
    const axisWidth = grid.drawBorder ? borderOpts.borderWidth : 0;
    if (!axisWidth) {
      return;
    }
    const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
    const borderValue = this._borderValue;
    let x1, x2, y1, y2;
    if (this.isHorizontal()) {
      x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
      x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
      y1 = y2 = borderValue;
    } else {
      y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
      y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
      x1 = x2 = borderValue;
    }
    ctx.save();
    ctx.lineWidth = borderOpts.borderWidth;
    ctx.strokeStyle = borderOpts.borderColor;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
  drawLabels(chartArea) {
    const optionTicks = this.options.ticks;
    if (!optionTicks.display) {
      return;
    }
    const ctx = this.ctx;
    const area = this._computeLabelArea();
    if (area) {
      clipArea(ctx, area);
    }
    const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
    let i, ilen;
    for (i = 0, ilen = items.length; i < ilen; ++i) {
      const item = items[i];
      const tickFont = item.font;
      const label = item.label;
      if (item.backdrop) {
        ctx.fillStyle = item.backdrop.color;
        ctx.fillRect(item.backdrop.left, item.backdrop.top, item.backdrop.width, item.backdrop.height);
      }
      let y = item.textOffset;
      renderText(ctx, label, 0, y, tickFont, item);
    }
    if (area) {
      unclipArea(ctx);
    }
  }
  drawTitle() {
    const {ctx, options: {position, title, reverse}} = this;
    if (!title.display) {
      return;
    }
    const font = toFont(title.font);
    const padding = toPadding(title.padding);
    const align = title.align;
    let offset = font.lineHeight / 2;
    if (position === 'bottom' || position === 'center' || isObject(position)) {
      offset += padding.bottom;
      if (isArray(title.text)) {
        offset += font.lineHeight * (title.text.length - 1);
      }
    } else {
      offset += padding.top;
    }
    const {titleX, titleY, maxWidth, rotation} = titleArgs(this, offset, position, align);
    renderText(ctx, title.text, 0, 0, font, {
      color: title.color,
      maxWidth,
      rotation,
      textAlign: titleAlign(align, position, reverse),
      textBaseline: 'middle',
      translation: [titleX, titleY],
    });
  }
  draw(chartArea) {
    if (!this._isVisible()) {
      return;
    }
    this.drawBackground();
    this.drawGrid(chartArea);
    this.drawBorder();
    this.drawTitle();
    this.drawLabels(chartArea);
  }
  _layers() {
    const opts = this.options;
    const tz = opts.ticks && opts.ticks.z || 0;
    const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
    if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
      return [{
        z: tz,
        draw: (chartArea) => {
          this.draw(chartArea);
        }
      }];
    }
    return [{
      z: gz,
      draw: (chartArea) => {
        this.drawBackground();
        this.drawGrid(chartArea);
        this.drawTitle();
      }
    }, {
      z: gz + 1,
      draw: () => {
        this.drawBorder();
      }
    }, {
      z: tz,
      draw: (chartArea) => {
        this.drawLabels(chartArea);
      }
    }];
  }
  getMatchingVisibleMetas(type) {
    const metas = this.chart.getSortedVisibleDatasetMetas();
    const axisID = this.axis + 'AxisID';
    const result = [];
    let i, ilen;
    for (i = 0, ilen = metas.length; i < ilen; ++i) {
      const meta = metas[i];
      if (meta[axisID] === this.id && (!type || meta.type === type)) {
        result.push(meta);
      }
    }
    return result;
  }
  _resolveTickFontOptions(index) {
    const opts = this.options.ticks.setContext(this.getContext(index));
    return toFont(opts.font);
  }
  _maxDigits() {
    const fontSize = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / fontSize;
  }
}

class TypedRegistry {
  constructor(type, scope, override) {
    this.type = type;
    this.scope = scope;
    this.override = override;
    this.items = Object.create(null);
  }
  isForType(type) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
  }
  register(item) {
    const proto = Object.getPrototypeOf(item);
    let parentScope;
    if (isIChartComponent(proto)) {
      parentScope = this.register(proto);
    }
    const items = this.items;
    const id = item.id;
    const scope = this.scope + '.' + id;
    if (!id) {
      throw new Error('class does not have id: ' + item);
    }
    if (id in items) {
      return scope;
    }
    items[id] = item;
    registerDefaults(item, scope, parentScope);
    if (this.override) {
      defaults.override(item.id, item.overrides);
    }
    return scope;
  }
  get(id) {
    return this.items[id];
  }
  unregister(item) {
    const items = this.items;
    const id = item.id;
    const scope = this.scope;
    if (id in items) {
      delete items[id];
    }
    if (scope && id in defaults[scope]) {
      delete defaults[scope][id];
      if (this.override) {
        delete overrides[id];
      }
    }
  }
}
function registerDefaults(item, scope, parentScope) {
  const itemDefaults = merge$1(Object.create(null), [
    parentScope ? defaults.get(parentScope) : {},
    defaults.get(scope),
    item.defaults
  ]);
  defaults.set(scope, itemDefaults);
  if (item.defaultRoutes) {
    routeDefaults(scope, item.defaultRoutes);
  }
  if (item.descriptors) {
    defaults.describe(scope, item.descriptors);
  }
}
function routeDefaults(scope, routes) {
  Object.keys(routes).forEach(property => {
    const propertyParts = property.split('.');
    const sourceName = propertyParts.pop();
    const sourceScope = [scope].concat(propertyParts).join('.');
    const parts = routes[property].split('.');
    const targetName = parts.pop();
    const targetScope = parts.join('.');
    defaults.route(sourceScope, sourceName, targetScope, targetName);
  });
}
function isIChartComponent(proto) {
  return 'id' in proto && 'defaults' in proto;
}

class Registry {
  constructor() {
    this.controllers = new TypedRegistry(DatasetController, 'datasets', true);
    this.elements = new TypedRegistry(Element, 'elements');
    this.plugins = new TypedRegistry(Object, 'plugins');
    this.scales = new TypedRegistry(Scale, 'scales');
    this._typedRegistries = [this.controllers, this.scales, this.elements];
  }
  add(...args) {
    this._each('register', args);
  }
  remove(...args) {
    this._each('unregister', args);
  }
  addControllers(...args) {
    this._each('register', args, this.controllers);
  }
  addElements(...args) {
    this._each('register', args, this.elements);
  }
  addPlugins(...args) {
    this._each('register', args, this.plugins);
  }
  addScales(...args) {
    this._each('register', args, this.scales);
  }
  getController(id) {
    return this._get(id, this.controllers, 'controller');
  }
  getElement(id) {
    return this._get(id, this.elements, 'element');
  }
  getPlugin(id) {
    return this._get(id, this.plugins, 'plugin');
  }
  getScale(id) {
    return this._get(id, this.scales, 'scale');
  }
  removeControllers(...args) {
    this._each('unregister', args, this.controllers);
  }
  removeElements(...args) {
    this._each('unregister', args, this.elements);
  }
  removePlugins(...args) {
    this._each('unregister', args, this.plugins);
  }
  removeScales(...args) {
    this._each('unregister', args, this.scales);
  }
  _each(method, args, typedRegistry) {
    [...args].forEach(arg => {
      const reg = typedRegistry || this._getRegistryForType(arg);
      if (typedRegistry || reg.isForType(arg) || (reg === this.plugins && arg.id)) {
        this._exec(method, reg, arg);
      } else {
        each(arg, item => {
          const itemReg = typedRegistry || this._getRegistryForType(item);
          this._exec(method, itemReg, item);
        });
      }
    });
  }
  _exec(method, registry, component) {
    const camelMethod = _capitalize(method);
    callback(component['before' + camelMethod], [], component);
    registry[method](component);
    callback(component['after' + camelMethod], [], component);
  }
  _getRegistryForType(type) {
    for (let i = 0; i < this._typedRegistries.length; i++) {
      const reg = this._typedRegistries[i];
      if (reg.isForType(type)) {
        return reg;
      }
    }
    return this.plugins;
  }
  _get(id, typedRegistry, type) {
    const item = typedRegistry.get(id);
    if (item === undefined) {
      throw new Error('"' + id + '" is not a registered ' + type + '.');
    }
    return item;
  }
}
var registry = new Registry();

class PluginService {
  constructor() {
    this._init = [];
  }
  notify(chart, hook, args, filter) {
    if (hook === 'beforeInit') {
      this._init = this._createDescriptors(chart, true);
      this._notify(this._init, chart, 'install');
    }
    const descriptors = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
    const result = this._notify(descriptors, chart, hook, args);
    if (hook === 'afterDestroy') {
      this._notify(descriptors, chart, 'stop');
      this._notify(this._init, chart, 'uninstall');
    }
    return result;
  }
  _notify(descriptors, chart, hook, args) {
    args = args || {};
    for (const descriptor of descriptors) {
      const plugin = descriptor.plugin;
      const method = plugin[hook];
      const params = [chart, args, descriptor.options];
      if (callback(method, params, plugin) === false && args.cancelable) {
        return false;
      }
    }
    return true;
  }
  invalidate() {
    if (!isNullOrUndef(this._cache)) {
      this._oldCache = this._cache;
      this._cache = undefined;
    }
  }
  _descriptors(chart) {
    if (this._cache) {
      return this._cache;
    }
    const descriptors = this._cache = this._createDescriptors(chart);
    this._notifyStateChanges(chart);
    return descriptors;
  }
  _createDescriptors(chart, all) {
    const config = chart && chart.config;
    const options = valueOrDefault(config.options && config.options.plugins, {});
    const plugins = allPlugins(config);
    return options === false && !all ? [] : createDescriptors(chart, plugins, options, all);
  }
  _notifyStateChanges(chart) {
    const previousDescriptors = this._oldCache || [];
    const descriptors = this._cache;
    const diff = (a, b) => a.filter(x => !b.some(y => x.plugin.id === y.plugin.id));
    this._notify(diff(previousDescriptors, descriptors), chart, 'stop');
    this._notify(diff(descriptors, previousDescriptors), chart, 'start');
  }
}
function allPlugins(config) {
  const plugins = [];
  const keys = Object.keys(registry.plugins.items);
  for (let i = 0; i < keys.length; i++) {
    plugins.push(registry.getPlugin(keys[i]));
  }
  const local = config.plugins || [];
  for (let i = 0; i < local.length; i++) {
    const plugin = local[i];
    if (plugins.indexOf(plugin) === -1) {
      plugins.push(plugin);
    }
  }
  return plugins;
}
function getOpts(options, all) {
  if (!all && options === false) {
    return null;
  }
  if (options === true) {
    return {};
  }
  return options;
}
function createDescriptors(chart, plugins, options, all) {
  const result = [];
  const context = chart.getContext();
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    const id = plugin.id;
    const opts = getOpts(options[id], all);
    if (opts === null) {
      continue;
    }
    result.push({
      plugin,
      options: pluginOpts(chart.config, plugin, opts, context)
    });
  }
  return result;
}
function pluginOpts(config, plugin, opts, context) {
  const keys = config.pluginScopeKeys(plugin);
  const scopes = config.getOptionScopes(opts, keys);
  return config.createResolver(scopes, context, [''], {scriptable: false, indexable: false, allKeys: true});
}

function getIndexAxis(type, options) {
  const datasetDefaults = defaults.datasets[type] || {};
  const datasetOptions = (options.datasets || {})[type] || {};
  return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || 'x';
}
function getAxisFromDefaultScaleID(id, indexAxis) {
  let axis = id;
  if (id === '_index_') {
    axis = indexAxis;
  } else if (id === '_value_') {
    axis = indexAxis === 'x' ? 'y' : 'x';
  }
  return axis;
}
function getDefaultScaleIDFromAxis(axis, indexAxis) {
  return axis === indexAxis ? '_index_' : '_value_';
}
function axisFromPosition(position) {
  if (position === 'top' || position === 'bottom') {
    return 'x';
  }
  if (position === 'left' || position === 'right') {
    return 'y';
  }
}
function determineAxis(id, scaleOptions) {
  if (id === 'x' || id === 'y') {
    return id;
  }
  return scaleOptions.axis || axisFromPosition(scaleOptions.position) || id.charAt(0).toLowerCase();
}
function mergeScaleConfig(config, options) {
  const chartDefaults = overrides[config.type] || {scales: {}};
  const configScales = options.scales || {};
  const chartIndexAxis = getIndexAxis(config.type, options);
  const firstIDs = Object.create(null);
  const scales = Object.create(null);
  Object.keys(configScales).forEach(id => {
    const scaleConf = configScales[id];
    if (!isObject(scaleConf)) {
      return console.error(`Invalid scale configuration for scale: ${id}`);
    }
    if (scaleConf._proxy) {
      return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
    }
    const axis = determineAxis(id, scaleConf);
    const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
    const defaultScaleOptions = chartDefaults.scales || {};
    firstIDs[axis] = firstIDs[axis] || id;
    scales[id] = mergeIf(Object.create(null), [{axis}, scaleConf, defaultScaleOptions[axis], defaultScaleOptions[defaultId]]);
  });
  config.data.datasets.forEach(dataset => {
    const type = dataset.type || config.type;
    const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
    const datasetDefaults = overrides[type] || {};
    const defaultScaleOptions = datasetDefaults.scales || {};
    Object.keys(defaultScaleOptions).forEach(defaultID => {
      const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
      const id = dataset[axis + 'AxisID'] || firstIDs[axis] || axis;
      scales[id] = scales[id] || Object.create(null);
      mergeIf(scales[id], [{axis}, configScales[id], defaultScaleOptions[defaultID]]);
    });
  });
  Object.keys(scales).forEach(key => {
    const scale = scales[key];
    mergeIf(scale, [defaults.scales[scale.type], defaults.scale]);
  });
  return scales;
}
function initOptions(config) {
  const options = config.options || (config.options = {});
  options.plugins = valueOrDefault(options.plugins, {});
  options.scales = mergeScaleConfig(config, options);
}
function initData(data) {
  data = data || {};
  data.datasets = data.datasets || [];
  data.labels = data.labels || [];
  return data;
}
function initConfig(config) {
  config = config || {};
  config.data = initData(config.data);
  initOptions(config);
  return config;
}
const keyCache = new Map();
const keysCached = new Set();
function cachedKeys(cacheKey, generate) {
  let keys = keyCache.get(cacheKey);
  if (!keys) {
    keys = generate();
    keyCache.set(cacheKey, keys);
    keysCached.add(keys);
  }
  return keys;
}
const addIfFound = (set, obj, key) => {
  const opts = resolveObjectKey(obj, key);
  if (opts !== undefined) {
    set.add(opts);
  }
};
class Config {
  constructor(config) {
    this._config = initConfig(config);
    this._scopeCache = new Map();
    this._resolverCache = new Map();
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(type) {
    this._config.type = type;
  }
  get data() {
    return this._config.data;
  }
  set data(data) {
    this._config.data = initData(data);
  }
  get options() {
    return this._config.options;
  }
  set options(options) {
    this._config.options = options;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const config = this._config;
    this.clearCache();
    initOptions(config);
  }
  clearCache() {
    this._scopeCache.clear();
    this._resolverCache.clear();
  }
  datasetScopeKeys(datasetType) {
    return cachedKeys(datasetType,
      () => [[
        `datasets.${datasetType}`,
        ''
      ]]);
  }
  datasetAnimationScopeKeys(datasetType, transition) {
    return cachedKeys(`${datasetType}.transition.${transition}`,
      () => [
        [
          `datasets.${datasetType}.transitions.${transition}`,
          `transitions.${transition}`,
        ],
        [
          `datasets.${datasetType}`,
          ''
        ]
      ]);
  }
  datasetElementScopeKeys(datasetType, elementType) {
    return cachedKeys(`${datasetType}-${elementType}`,
      () => [[
        `datasets.${datasetType}.elements.${elementType}`,
        `datasets.${datasetType}`,
        `elements.${elementType}`,
        ''
      ]]);
  }
  pluginScopeKeys(plugin) {
    const id = plugin.id;
    const type = this.type;
    return cachedKeys(`${type}-plugin-${id}`,
      () => [[
        `plugins.${id}`,
        ...plugin.additionalOptionScopes || [],
      ]]);
  }
  _cachedScopes(mainScope, resetCache) {
    const _scopeCache = this._scopeCache;
    let cache = _scopeCache.get(mainScope);
    if (!cache || resetCache) {
      cache = new Map();
      _scopeCache.set(mainScope, cache);
    }
    return cache;
  }
  getOptionScopes(mainScope, keyLists, resetCache) {
    const {options, type} = this;
    const cache = this._cachedScopes(mainScope, resetCache);
    const cached = cache.get(keyLists);
    if (cached) {
      return cached;
    }
    const scopes = new Set();
    keyLists.forEach(keys => {
      if (mainScope) {
        scopes.add(mainScope);
        keys.forEach(key => addIfFound(scopes, mainScope, key));
      }
      keys.forEach(key => addIfFound(scopes, options, key));
      keys.forEach(key => addIfFound(scopes, overrides[type] || {}, key));
      keys.forEach(key => addIfFound(scopes, defaults, key));
      keys.forEach(key => addIfFound(scopes, descriptors, key));
    });
    const array = Array.from(scopes);
    if (array.length === 0) {
      array.push(Object.create(null));
    }
    if (keysCached.has(keyLists)) {
      cache.set(keyLists, array);
    }
    return array;
  }
  chartOptionScopes() {
    const {options, type} = this;
    return [
      options,
      overrides[type] || {},
      defaults.datasets[type] || {},
      {type},
      defaults,
      descriptors
    ];
  }
  resolveNamedOptions(scopes, names, context, prefixes = ['']) {
    const result = {$shared: true};
    const {resolver, subPrefixes} = getResolver(this._resolverCache, scopes, prefixes);
    let options = resolver;
    if (needContext(resolver, names)) {
      result.$shared = false;
      context = isFunction(context) ? context() : context;
      const subResolver = this.createResolver(scopes, context, subPrefixes);
      options = _attachContext(resolver, context, subResolver);
    }
    for (const prop of names) {
      result[prop] = options[prop];
    }
    return result;
  }
  createResolver(scopes, context, prefixes = [''], descriptorDefaults) {
    const {resolver} = getResolver(this._resolverCache, scopes, prefixes);
    return isObject(context)
      ? _attachContext(resolver, context, undefined, descriptorDefaults)
      : resolver;
  }
}
function getResolver(resolverCache, scopes, prefixes) {
  let cache = resolverCache.get(scopes);
  if (!cache) {
    cache = new Map();
    resolverCache.set(scopes, cache);
  }
  const cacheKey = prefixes.join();
  let cached = cache.get(cacheKey);
  if (!cached) {
    const resolver = _createResolver(scopes, prefixes);
    cached = {
      resolver,
      subPrefixes: prefixes.filter(p => !p.toLowerCase().includes('hover'))
    };
    cache.set(cacheKey, cached);
  }
  return cached;
}
const hasFunction = value => isObject(value)
  && Object.getOwnPropertyNames(value).reduce((acc, key) => acc || isFunction(value[key]), false);
function needContext(proxy, names) {
  const {isScriptable, isIndexable} = _descriptors(proxy);
  for (const prop of names) {
    const scriptable = isScriptable(prop);
    const indexable = isIndexable(prop);
    const value = (indexable || scriptable) && proxy[prop];
    if ((scriptable && (isFunction(value) || hasFunction(value)))
      || (indexable && isArray(value))) {
      return true;
    }
  }
  return false;
}

var version = "3.7.1";

const KNOWN_POSITIONS = ['top', 'bottom', 'left', 'right', 'chartArea'];
function positionIsHorizontal(position, axis) {
  return position === 'top' || position === 'bottom' || (KNOWN_POSITIONS.indexOf(position) === -1 && axis === 'x');
}
function compare2Level(l1, l2) {
  return function(a, b) {
    return a[l1] === b[l1]
      ? a[l2] - b[l2]
      : a[l1] - b[l1];
  };
}
function onAnimationsComplete(context) {
  const chart = context.chart;
  const animationOptions = chart.options.animation;
  chart.notifyPlugins('afterRender');
  callback(animationOptions && animationOptions.onComplete, [context], chart);
}
function onAnimationProgress(context) {
  const chart = context.chart;
  const animationOptions = chart.options.animation;
  callback(animationOptions && animationOptions.onProgress, [context], chart);
}
function getCanvas(item) {
  if (_isDomSupported() && typeof item === 'string') {
    item = document.getElementById(item);
  } else if (item && item.length) {
    item = item[0];
  }
  if (item && item.canvas) {
    item = item.canvas;
  }
  return item;
}
const instances = {};
const getChart = (key) => {
  const canvas = getCanvas(key);
  return Object.values(instances).filter((c) => c.canvas === canvas).pop();
};
function moveNumericKeys(obj, start, move) {
  const keys = Object.keys(obj);
  for (const key of keys) {
    const intKey = +key;
    if (intKey >= start) {
      const value = obj[key];
      delete obj[key];
      if (move > 0 || intKey > start) {
        obj[intKey + move] = value;
      }
    }
  }
}
function determineLastEvent(e, lastEvent, inChartArea, isClick) {
  if (!inChartArea || e.type === 'mouseout') {
    return null;
  }
  if (isClick) {
    return lastEvent;
  }
  return e;
}
class Chart {
  constructor(item, userConfig) {
    const config = this.config = new Config(userConfig);
    const initialCanvas = getCanvas(item);
    const existingChart = getChart(initialCanvas);
    if (existingChart) {
      throw new Error(
        'Canvas is already in use. Chart with ID \'' + existingChart.id + '\'' +
				' must be destroyed before the canvas can be reused.'
      );
    }
    const options = config.createResolver(config.chartOptionScopes(), this.getContext());
    this.platform = new (config.platform || _detectPlatform(initialCanvas))();
    this.platform.updateConfig(config);
    const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
    const canvas = context && context.canvas;
    const height = canvas && canvas.height;
    const width = canvas && canvas.width;
    this.id = uid();
    this.ctx = context;
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this._options = options;
    this._aspectRatio = this.aspectRatio;
    this._layers = [];
    this._metasets = [];
    this._stacks = undefined;
    this.boxes = [];
    this.currentDevicePixelRatio = undefined;
    this.chartArea = undefined;
    this._active = [];
    this._lastEvent = undefined;
    this._listeners = {};
    this._responsiveListeners = undefined;
    this._sortedMetasets = [];
    this.scales = {};
    this._plugins = new PluginService();
    this.$proxies = {};
    this._hiddenIndices = {};
    this.attached = false;
    this._animationsDisabled = undefined;
    this.$context = undefined;
    this._doResize = debounce(mode => this.update(mode), options.resizeDelay || 0);
    this._dataChanges = [];
    instances[this.id] = this;
    if (!context || !canvas) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    animator.listen(this, 'complete', onAnimationsComplete);
    animator.listen(this, 'progress', onAnimationProgress);
    this._initialize();
    if (this.attached) {
      this.update();
    }
  }
  get aspectRatio() {
    const {options: {aspectRatio, maintainAspectRatio}, width, height, _aspectRatio} = this;
    if (!isNullOrUndef(aspectRatio)) {
      return aspectRatio;
    }
    if (maintainAspectRatio && _aspectRatio) {
      return _aspectRatio;
    }
    return height ? width / height : null;
  }
  get data() {
    return this.config.data;
  }
  set data(data) {
    this.config.data = data;
  }
  get options() {
    return this._options;
  }
  set options(options) {
    this.config.options = options;
  }
  _initialize() {
    this.notifyPlugins('beforeInit');
    if (this.options.responsive) {
      this.resize();
    } else {
      retinaScale(this, this.options.devicePixelRatio);
    }
    this.bindEvents();
    this.notifyPlugins('afterInit');
    return this;
  }
  clear() {
    clearCanvas(this.canvas, this.ctx);
    return this;
  }
  stop() {
    animator.stop(this);
    return this;
  }
  resize(width, height) {
    if (!animator.running(this)) {
      this._resize(width, height);
    } else {
      this._resizeBeforeDraw = {width, height};
    }
  }
  _resize(width, height) {
    const options = this.options;
    const canvas = this.canvas;
    const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
    const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
    const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
    const mode = this.width ? 'resize' : 'attach';
    this.width = newSize.width;
    this.height = newSize.height;
    this._aspectRatio = this.aspectRatio;
    if (!retinaScale(this, newRatio, true)) {
      return;
    }
    this.notifyPlugins('resize', {size: newSize});
    callback(options.onResize, [this, newSize], this);
    if (this.attached) {
      if (this._doResize(mode)) {
        this.render();
      }
    }
  }
  ensureScalesHaveIDs() {
    const options = this.options;
    const scalesOptions = options.scales || {};
    each(scalesOptions, (axisOptions, axisID) => {
      axisOptions.id = axisID;
    });
  }
  buildOrUpdateScales() {
    const options = this.options;
    const scaleOpts = options.scales;
    const scales = this.scales;
    const updated = Object.keys(scales).reduce((obj, id) => {
      obj[id] = false;
      return obj;
    }, {});
    let items = [];
    if (scaleOpts) {
      items = items.concat(
        Object.keys(scaleOpts).map((id) => {
          const scaleOptions = scaleOpts[id];
          const axis = determineAxis(id, scaleOptions);
          const isRadial = axis === 'r';
          const isHorizontal = axis === 'x';
          return {
            options: scaleOptions,
            dposition: isRadial ? 'chartArea' : isHorizontal ? 'bottom' : 'left',
            dtype: isRadial ? 'radialLinear' : isHorizontal ? 'category' : 'linear'
          };
        })
      );
    }
    each(items, (item) => {
      const scaleOptions = item.options;
      const id = scaleOptions.id;
      const axis = determineAxis(id, scaleOptions);
      const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
      if (scaleOptions.position === undefined || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
        scaleOptions.position = item.dposition;
      }
      updated[id] = true;
      let scale = null;
      if (id in scales && scales[id].type === scaleType) {
        scale = scales[id];
      } else {
        const scaleClass = registry.getScale(scaleType);
        scale = new scaleClass({
          id,
          type: scaleType,
          ctx: this.ctx,
          chart: this
        });
        scales[scale.id] = scale;
      }
      scale.init(scaleOptions, options);
    });
    each(updated, (hasUpdated, id) => {
      if (!hasUpdated) {
        delete scales[id];
      }
    });
    each(scales, (scale) => {
      layouts.configure(this, scale, scale.options);
      layouts.addBox(this, scale);
    });
  }
  _updateMetasets() {
    const metasets = this._metasets;
    const numData = this.data.datasets.length;
    const numMeta = metasets.length;
    metasets.sort((a, b) => a.index - b.index);
    if (numMeta > numData) {
      for (let i = numData; i < numMeta; ++i) {
        this._destroyDatasetMeta(i);
      }
      metasets.splice(numData, numMeta - numData);
    }
    this._sortedMetasets = metasets.slice(0).sort(compare2Level('order', 'index'));
  }
  _removeUnreferencedMetasets() {
    const {_metasets: metasets, data: {datasets}} = this;
    if (metasets.length > datasets.length) {
      delete this._stacks;
    }
    metasets.forEach((meta, index) => {
      if (datasets.filter(x => x === meta._dataset).length === 0) {
        this._destroyDatasetMeta(index);
      }
    });
  }
  buildOrUpdateControllers() {
    const newControllers = [];
    const datasets = this.data.datasets;
    let i, ilen;
    this._removeUnreferencedMetasets();
    for (i = 0, ilen = datasets.length; i < ilen; i++) {
      const dataset = datasets[i];
      let meta = this.getDatasetMeta(i);
      const type = dataset.type || this.config.type;
      if (meta.type && meta.type !== type) {
        this._destroyDatasetMeta(i);
        meta = this.getDatasetMeta(i);
      }
      meta.type = type;
      meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
      meta.order = dataset.order || 0;
      meta.index = i;
      meta.label = '' + dataset.label;
      meta.visible = this.isDatasetVisible(i);
      if (meta.controller) {
        meta.controller.updateIndex(i);
        meta.controller.linkScales();
      } else {
        const ControllerClass = registry.getController(type);
        const {datasetElementType, dataElementType} = defaults.datasets[type];
        Object.assign(ControllerClass.prototype, {
          dataElementType: registry.getElement(dataElementType),
          datasetElementType: datasetElementType && registry.getElement(datasetElementType)
        });
        meta.controller = new ControllerClass(this, i);
        newControllers.push(meta.controller);
      }
    }
    this._updateMetasets();
    return newControllers;
  }
  _resetElements() {
    each(this.data.datasets, (dataset, datasetIndex) => {
      this.getDatasetMeta(datasetIndex).controller.reset();
    }, this);
  }
  reset() {
    this._resetElements();
    this.notifyPlugins('reset');
  }
  update(mode) {
    const config = this.config;
    config.update();
    const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
    const animsDisabled = this._animationsDisabled = !options.animation;
    this._updateScales();
    this._checkEventBindings();
    this._updateHiddenIndices();
    this._plugins.invalidate();
    if (this.notifyPlugins('beforeUpdate', {mode, cancelable: true}) === false) {
      return;
    }
    const newControllers = this.buildOrUpdateControllers();
    this.notifyPlugins('beforeElementsUpdate');
    let minPadding = 0;
    for (let i = 0, ilen = this.data.datasets.length; i < ilen; i++) {
      const {controller} = this.getDatasetMeta(i);
      const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
      controller.buildOrUpdateElements(reset);
      minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
    }
    minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
    this._updateLayout(minPadding);
    if (!animsDisabled) {
      each(newControllers, (controller) => {
        controller.reset();
      });
    }
    this._updateDatasets(mode);
    this.notifyPlugins('afterUpdate', {mode});
    this._layers.sort(compare2Level('z', '_idx'));
    const {_active, _lastEvent} = this;
    if (_lastEvent) {
      this._eventHandler(_lastEvent, true);
    } else if (_active.length) {
      this._updateHoverStyles(_active, _active, true);
    }
    this.render();
  }
  _updateScales() {
    each(this.scales, (scale) => {
      layouts.removeBox(this, scale);
    });
    this.ensureScalesHaveIDs();
    this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const options = this.options;
    const existingEvents = new Set(Object.keys(this._listeners));
    const newEvents = new Set(options.events);
    if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
      this.unbindEvents();
      this.bindEvents();
    }
  }
  _updateHiddenIndices() {
    const {_hiddenIndices} = this;
    const changes = this._getUniformDataChanges() || [];
    for (const {method, start, count} of changes) {
      const move = method === '_removeElements' ? -count : count;
      moveNumericKeys(_hiddenIndices, start, move);
    }
  }
  _getUniformDataChanges() {
    const _dataChanges = this._dataChanges;
    if (!_dataChanges || !_dataChanges.length) {
      return;
    }
    this._dataChanges = [];
    const datasetCount = this.data.datasets.length;
    const makeSet = (idx) => new Set(
      _dataChanges
        .filter(c => c[0] === idx)
        .map((c, i) => i + ',' + c.splice(1).join(','))
    );
    const changeSet = makeSet(0);
    for (let i = 1; i < datasetCount; i++) {
      if (!setsEqual(changeSet, makeSet(i))) {
        return;
      }
    }
    return Array.from(changeSet)
      .map(c => c.split(','))
      .map(a => ({method: a[1], start: +a[2], count: +a[3]}));
  }
  _updateLayout(minPadding) {
    if (this.notifyPlugins('beforeLayout', {cancelable: true}) === false) {
      return;
    }
    layouts.update(this, this.width, this.height, minPadding);
    const area = this.chartArea;
    const noArea = area.width <= 0 || area.height <= 0;
    this._layers = [];
    each(this.boxes, (box) => {
      if (noArea && box.position === 'chartArea') {
        return;
      }
      if (box.configure) {
        box.configure();
      }
      this._layers.push(...box._layers());
    }, this);
    this._layers.forEach((item, index) => {
      item._idx = index;
    });
    this.notifyPlugins('afterLayout');
  }
  _updateDatasets(mode) {
    if (this.notifyPlugins('beforeDatasetsUpdate', {mode, cancelable: true}) === false) {
      return;
    }
    for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
      this.getDatasetMeta(i).controller.configure();
    }
    for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
      this._updateDataset(i, isFunction(mode) ? mode({datasetIndex: i}) : mode);
    }
    this.notifyPlugins('afterDatasetsUpdate', {mode});
  }
  _updateDataset(index, mode) {
    const meta = this.getDatasetMeta(index);
    const args = {meta, index, mode, cancelable: true};
    if (this.notifyPlugins('beforeDatasetUpdate', args) === false) {
      return;
    }
    meta.controller._update(mode);
    args.cancelable = false;
    this.notifyPlugins('afterDatasetUpdate', args);
  }
  render() {
    if (this.notifyPlugins('beforeRender', {cancelable: true}) === false) {
      return;
    }
    if (animator.has(this)) {
      if (this.attached && !animator.running(this)) {
        animator.start(this);
      }
    } else {
      this.draw();
      onAnimationsComplete({chart: this});
    }
  }
  draw() {
    let i;
    if (this._resizeBeforeDraw) {
      const {width, height} = this._resizeBeforeDraw;
      this._resize(width, height);
      this._resizeBeforeDraw = null;
    }
    this.clear();
    if (this.width <= 0 || this.height <= 0) {
      return;
    }
    if (this.notifyPlugins('beforeDraw', {cancelable: true}) === false) {
      return;
    }
    const layers = this._layers;
    for (i = 0; i < layers.length && layers[i].z <= 0; ++i) {
      layers[i].draw(this.chartArea);
    }
    this._drawDatasets();
    for (; i < layers.length; ++i) {
      layers[i].draw(this.chartArea);
    }
    this.notifyPlugins('afterDraw');
  }
  _getSortedDatasetMetas(filterVisible) {
    const metasets = this._sortedMetasets;
    const result = [];
    let i, ilen;
    for (i = 0, ilen = metasets.length; i < ilen; ++i) {
      const meta = metasets[i];
      if (!filterVisible || meta.visible) {
        result.push(meta);
      }
    }
    return result;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(true);
  }
  _drawDatasets() {
    if (this.notifyPlugins('beforeDatasetsDraw', {cancelable: true}) === false) {
      return;
    }
    const metasets = this.getSortedVisibleDatasetMetas();
    for (let i = metasets.length - 1; i >= 0; --i) {
      this._drawDataset(metasets[i]);
    }
    this.notifyPlugins('afterDatasetsDraw');
  }
  _drawDataset(meta) {
    const ctx = this.ctx;
    const clip = meta._clip;
    const useClip = !clip.disabled;
    const area = this.chartArea;
    const args = {
      meta,
      index: meta.index,
      cancelable: true
    };
    if (this.notifyPlugins('beforeDatasetDraw', args) === false) {
      return;
    }
    if (useClip) {
      clipArea(ctx, {
        left: clip.left === false ? 0 : area.left - clip.left,
        right: clip.right === false ? this.width : area.right + clip.right,
        top: clip.top === false ? 0 : area.top - clip.top,
        bottom: clip.bottom === false ? this.height : area.bottom + clip.bottom
      });
    }
    meta.controller.draw();
    if (useClip) {
      unclipArea(ctx);
    }
    args.cancelable = false;
    this.notifyPlugins('afterDatasetDraw', args);
  }
  getElementsAtEventForMode(e, mode, options, useFinalPosition) {
    const method = Interaction.modes[mode];
    if (typeof method === 'function') {
      return method(this, e, options, useFinalPosition);
    }
    return [];
  }
  getDatasetMeta(datasetIndex) {
    const dataset = this.data.datasets[datasetIndex];
    const metasets = this._metasets;
    let meta = metasets.filter(x => x && x._dataset === dataset).pop();
    if (!meta) {
      meta = {
        type: null,
        data: [],
        dataset: null,
        controller: null,
        hidden: null,
        xAxisID: null,
        yAxisID: null,
        order: dataset && dataset.order || 0,
        index: datasetIndex,
        _dataset: dataset,
        _parsed: [],
        _sorted: false
      };
      metasets.push(meta);
    }
    return meta;
  }
  getContext() {
    return this.$context || (this.$context = createContext(null, {chart: this, type: 'chart'}));
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(datasetIndex) {
    const dataset = this.data.datasets[datasetIndex];
    if (!dataset) {
      return false;
    }
    const meta = this.getDatasetMeta(datasetIndex);
    return typeof meta.hidden === 'boolean' ? !meta.hidden : !dataset.hidden;
  }
  setDatasetVisibility(datasetIndex, visible) {
    const meta = this.getDatasetMeta(datasetIndex);
    meta.hidden = !visible;
  }
  toggleDataVisibility(index) {
    this._hiddenIndices[index] = !this._hiddenIndices[index];
  }
  getDataVisibility(index) {
    return !this._hiddenIndices[index];
  }
  _updateVisibility(datasetIndex, dataIndex, visible) {
    const mode = visible ? 'show' : 'hide';
    const meta = this.getDatasetMeta(datasetIndex);
    const anims = meta.controller._resolveAnimations(undefined, mode);
    if (defined(dataIndex)) {
      meta.data[dataIndex].hidden = !visible;
      this.update();
    } else {
      this.setDatasetVisibility(datasetIndex, visible);
      anims.update(meta, {visible});
      this.update((ctx) => ctx.datasetIndex === datasetIndex ? mode : undefined);
    }
  }
  hide(datasetIndex, dataIndex) {
    this._updateVisibility(datasetIndex, dataIndex, false);
  }
  show(datasetIndex, dataIndex) {
    this._updateVisibility(datasetIndex, dataIndex, true);
  }
  _destroyDatasetMeta(datasetIndex) {
    const meta = this._metasets[datasetIndex];
    if (meta && meta.controller) {
      meta.controller._destroy();
    }
    delete this._metasets[datasetIndex];
  }
  _stop() {
    let i, ilen;
    this.stop();
    animator.remove(this);
    for (i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
      this._destroyDatasetMeta(i);
    }
  }
  destroy() {
    this.notifyPlugins('beforeDestroy');
    const {canvas, ctx} = this;
    this._stop();
    this.config.clearCache();
    if (canvas) {
      this.unbindEvents();
      clearCanvas(canvas, ctx);
      this.platform.releaseContext(ctx);
      this.canvas = null;
      this.ctx = null;
    }
    this.notifyPlugins('destroy');
    delete instances[this.id];
    this.notifyPlugins('afterDestroy');
  }
  toBase64Image(...args) {
    return this.canvas.toDataURL(...args);
  }
  bindEvents() {
    this.bindUserEvents();
    if (this.options.responsive) {
      this.bindResponsiveEvents();
    } else {
      this.attached = true;
    }
  }
  bindUserEvents() {
    const listeners = this._listeners;
    const platform = this.platform;
    const _add = (type, listener) => {
      platform.addEventListener(this, type, listener);
      listeners[type] = listener;
    };
    const listener = (e, x, y) => {
      e.offsetX = x;
      e.offsetY = y;
      this._eventHandler(e);
    };
    each(this.options.events, (type) => _add(type, listener));
  }
  bindResponsiveEvents() {
    if (!this._responsiveListeners) {
      this._responsiveListeners = {};
    }
    const listeners = this._responsiveListeners;
    const platform = this.platform;
    const _add = (type, listener) => {
      platform.addEventListener(this, type, listener);
      listeners[type] = listener;
    };
    const _remove = (type, listener) => {
      if (listeners[type]) {
        platform.removeEventListener(this, type, listener);
        delete listeners[type];
      }
    };
    const listener = (width, height) => {
      if (this.canvas) {
        this.resize(width, height);
      }
    };
    let detached;
    const attached = () => {
      _remove('attach', attached);
      this.attached = true;
      this.resize();
      _add('resize', listener);
      _add('detach', detached);
    };
    detached = () => {
      this.attached = false;
      _remove('resize', listener);
      this._stop();
      this._resize(0, 0);
      _add('attach', attached);
    };
    if (platform.isAttached(this.canvas)) {
      attached();
    } else {
      detached();
    }
  }
  unbindEvents() {
    each(this._listeners, (listener, type) => {
      this.platform.removeEventListener(this, type, listener);
    });
    this._listeners = {};
    each(this._responsiveListeners, (listener, type) => {
      this.platform.removeEventListener(this, type, listener);
    });
    this._responsiveListeners = undefined;
  }
  updateHoverStyle(items, mode, enabled) {
    const prefix = enabled ? 'set' : 'remove';
    let meta, item, i, ilen;
    if (mode === 'dataset') {
      meta = this.getDatasetMeta(items[0].datasetIndex);
      meta.controller['_' + prefix + 'DatasetHoverStyle']();
    }
    for (i = 0, ilen = items.length; i < ilen; ++i) {
      item = items[i];
      const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
      if (controller) {
        controller[prefix + 'HoverStyle'](item.element, item.datasetIndex, item.index);
      }
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(activeElements) {
    const lastActive = this._active || [];
    const active = activeElements.map(({datasetIndex, index}) => {
      const meta = this.getDatasetMeta(datasetIndex);
      if (!meta) {
        throw new Error('No dataset found at index ' + datasetIndex);
      }
      return {
        datasetIndex,
        element: meta.data[index],
        index,
      };
    });
    const changed = !_elementsEqual(active, lastActive);
    if (changed) {
      this._active = active;
      this._lastEvent = null;
      this._updateHoverStyles(active, lastActive);
    }
  }
  notifyPlugins(hook, args, filter) {
    return this._plugins.notify(this, hook, args, filter);
  }
  _updateHoverStyles(active, lastActive, replay) {
    const hoverOptions = this.options.hover;
    const diff = (a, b) => a.filter(x => !b.some(y => x.datasetIndex === y.datasetIndex && x.index === y.index));
    const deactivated = diff(lastActive, active);
    const activated = replay ? active : diff(active, lastActive);
    if (deactivated.length) {
      this.updateHoverStyle(deactivated, hoverOptions.mode, false);
    }
    if (activated.length && hoverOptions.mode) {
      this.updateHoverStyle(activated, hoverOptions.mode, true);
    }
  }
  _eventHandler(e, replay) {
    const args = {
      event: e,
      replay,
      cancelable: true,
      inChartArea: _isPointInArea(e, this.chartArea, this._minPadding)
    };
    const eventFilter = (plugin) => (plugin.options.events || this.options.events).includes(e.native.type);
    if (this.notifyPlugins('beforeEvent', args, eventFilter) === false) {
      return;
    }
    const changed = this._handleEvent(e, replay, args.inChartArea);
    args.cancelable = false;
    this.notifyPlugins('afterEvent', args, eventFilter);
    if (changed || args.changed) {
      this.render();
    }
    return this;
  }
  _handleEvent(e, replay, inChartArea) {
    const {_active: lastActive = [], options} = this;
    const useFinalPosition = replay;
    const active = this._getActiveElements(e, lastActive, inChartArea, useFinalPosition);
    const isClick = _isClickEvent(e);
    const lastEvent = determineLastEvent(e, this._lastEvent, inChartArea, isClick);
    if (inChartArea) {
      this._lastEvent = null;
      callback(options.onHover, [e, active, this], this);
      if (isClick) {
        callback(options.onClick, [e, active, this], this);
      }
    }
    const changed = !_elementsEqual(active, lastActive);
    if (changed || replay) {
      this._active = active;
      this._updateHoverStyles(active, lastActive, replay);
    }
    this._lastEvent = lastEvent;
    return changed;
  }
  _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
    if (e.type === 'mouseout') {
      return [];
    }
    if (!inChartArea) {
      return lastActive;
    }
    const hoverOptions = this.options.hover;
    return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
  }
}
const invalidatePlugins = () => each(Chart.instances, (chart) => chart._plugins.invalidate());
const enumerable = true;
Object.defineProperties(Chart, {
  defaults: {
    enumerable,
    value: defaults
  },
  instances: {
    enumerable,
    value: instances
  },
  overrides: {
    enumerable,
    value: overrides
  },
  registry: {
    enumerable,
    value: registry
  },
  version: {
    enumerable,
    value: version
  },
  getChart: {
    enumerable,
    value: getChart
  },
  register: {
    enumerable,
    value: (...items) => {
      registry.add(...items);
      invalidatePlugins();
    }
  },
  unregister: {
    enumerable,
    value: (...items) => {
      registry.remove(...items);
      invalidatePlugins();
    }
  }
});

function clipArc(ctx, element, endAngle) {
  const {startAngle, pixelMargin, x, y, outerRadius, innerRadius} = element;
  let angleMargin = pixelMargin / outerRadius;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
  if (innerRadius > pixelMargin) {
    angleMargin = pixelMargin / innerRadius;
    ctx.arc(x, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
  } else {
    ctx.arc(x, y, pixelMargin, endAngle + HALF_PI, startAngle - HALF_PI);
  }
  ctx.closePath();
  ctx.clip();
}
function toRadiusCorners(value) {
  return _readValueToProps(value, ['outerStart', 'outerEnd', 'innerStart', 'innerEnd']);
}
function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
  const o = toRadiusCorners(arc.options.borderRadius);
  const halfThickness = (outerRadius - innerRadius) / 2;
  const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
  const computeOuterLimit = (val) => {
    const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
    return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
  };
  return {
    outerStart: computeOuterLimit(o.outerStart),
    outerEnd: computeOuterLimit(o.outerEnd),
    innerStart: _limitValue(o.innerStart, 0, innerLimit),
    innerEnd: _limitValue(o.innerEnd, 0, innerLimit),
  };
}
function rThetaToXY(r, theta, x, y) {
  return {
    x: x + r * Math.cos(theta),
    y: y + r * Math.sin(theta),
  };
}
function pathArc(ctx, element, offset, spacing, end) {
  const {x, y, startAngle: start, pixelMargin, innerRadius: innerR} = element;
  const outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0);
  const innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
  let spacingOffset = 0;
  const alpha = end - start;
  if (spacing) {
    const noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
    const noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
    const avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
    const adjustedAngle = avNogSpacingRadius !== 0 ? (alpha * avNogSpacingRadius) / (avNogSpacingRadius + spacing) : alpha;
    spacingOffset = (alpha - adjustedAngle) / 2;
  }
  const beta = Math.max(0.001, alpha * outerRadius - offset / PI) / outerRadius;
  const angleOffset = (alpha - beta) / 2;
  const startAngle = start + angleOffset + spacingOffset;
  const endAngle = end - angleOffset - spacingOffset;
  const {outerStart, outerEnd, innerStart, innerEnd} = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
  const outerStartAdjustedRadius = outerRadius - outerStart;
  const outerEndAdjustedRadius = outerRadius - outerEnd;
  const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
  const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
  const innerStartAdjustedRadius = innerRadius + innerStart;
  const innerEndAdjustedRadius = innerRadius + innerEnd;
  const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
  const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, outerStartAdjustedAngle, outerEndAdjustedAngle);
  if (outerEnd > 0) {
    const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x, y);
    ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + HALF_PI);
  }
  const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y);
  ctx.lineTo(p4.x, p4.y);
  if (innerEnd > 0) {
    const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x, y);
    ctx.arc(pCenter.x, pCenter.y, innerEnd, endAngle + HALF_PI, innerEndAdjustedAngle + Math.PI);
  }
  ctx.arc(x, y, innerRadius, endAngle - (innerEnd / innerRadius), startAngle + (innerStart / innerRadius), true);
  if (innerStart > 0) {
    const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x, y);
    ctx.arc(pCenter.x, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - HALF_PI);
  }
  const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y);
  ctx.lineTo(p8.x, p8.y);
  if (outerStart > 0) {
    const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x, y);
    ctx.arc(pCenter.x, pCenter.y, outerStart, startAngle - HALF_PI, outerStartAdjustedAngle);
  }
  ctx.closePath();
}
function drawArc(ctx, element, offset, spacing) {
  const {fullCircles, startAngle, circumference} = element;
  let endAngle = element.endAngle;
  if (fullCircles) {
    pathArc(ctx, element, offset, spacing, startAngle + TAU);
    for (let i = 0; i < fullCircles; ++i) {
      ctx.fill();
    }
    if (!isNaN(circumference)) {
      endAngle = startAngle + circumference % TAU;
      if (circumference % TAU === 0) {
        endAngle += TAU;
      }
    }
  }
  pathArc(ctx, element, offset, spacing, endAngle);
  ctx.fill();
  return endAngle;
}
function drawFullCircleBorders(ctx, element, inner) {
  const {x, y, startAngle, pixelMargin, fullCircles} = element;
  const outerRadius = Math.max(element.outerRadius - pixelMargin, 0);
  const innerRadius = element.innerRadius + pixelMargin;
  let i;
  if (inner) {
    clipArc(ctx, element, startAngle + TAU);
  }
  ctx.beginPath();
  ctx.arc(x, y, innerRadius, startAngle + TAU, startAngle, true);
  for (i = 0; i < fullCircles; ++i) {
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, startAngle, startAngle + TAU);
  for (i = 0; i < fullCircles; ++i) {
    ctx.stroke();
  }
}
function drawBorder(ctx, element, offset, spacing, endAngle) {
  const {options} = element;
  const {borderWidth, borderJoinStyle} = options;
  const inner = options.borderAlign === 'inner';
  if (!borderWidth) {
    return;
  }
  if (inner) {
    ctx.lineWidth = borderWidth * 2;
    ctx.lineJoin = borderJoinStyle || 'round';
  } else {
    ctx.lineWidth = borderWidth;
    ctx.lineJoin = borderJoinStyle || 'bevel';
  }
  if (element.fullCircles) {
    drawFullCircleBorders(ctx, element, inner);
  }
  if (inner) {
    clipArc(ctx, element, endAngle);
  }
  pathArc(ctx, element, offset, spacing, endAngle);
  ctx.stroke();
}
class ArcElement extends Element {
  constructor(cfg) {
    super();
    this.options = undefined;
    this.circumference = undefined;
    this.startAngle = undefined;
    this.endAngle = undefined;
    this.innerRadius = undefined;
    this.outerRadius = undefined;
    this.pixelMargin = 0;
    this.fullCircles = 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  inRange(chartX, chartY, useFinalPosition) {
    const point = this.getProps(['x', 'y'], useFinalPosition);
    const {angle, distance} = getAngleFromPoint(point, {x: chartX, y: chartY});
    const {startAngle, endAngle, innerRadius, outerRadius, circumference} = this.getProps([
      'startAngle',
      'endAngle',
      'innerRadius',
      'outerRadius',
      'circumference'
    ], useFinalPosition);
    const rAdjust = this.options.spacing / 2;
    const _circumference = valueOrDefault(circumference, endAngle - startAngle);
    const betweenAngles = _circumference >= TAU || _angleBetween(angle, startAngle, endAngle);
    const withinRadius = _isBetween(distance, innerRadius + rAdjust, outerRadius + rAdjust);
    return (betweenAngles && withinRadius);
  }
  getCenterPoint(useFinalPosition) {
    const {x, y, startAngle, endAngle, innerRadius, outerRadius} = this.getProps([
      'x',
      'y',
      'startAngle',
      'endAngle',
      'innerRadius',
      'outerRadius',
      'circumference',
    ], useFinalPosition);
    const {offset, spacing} = this.options;
    const halfAngle = (startAngle + endAngle) / 2;
    const halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
    return {
      x: x + Math.cos(halfAngle) * halfRadius,
      y: y + Math.sin(halfAngle) * halfRadius
    };
  }
  tooltipPosition(useFinalPosition) {
    return this.getCenterPoint(useFinalPosition);
  }
  draw(ctx) {
    const {options, circumference} = this;
    const offset = (options.offset || 0) / 2;
    const spacing = (options.spacing || 0) / 2;
    this.pixelMargin = (options.borderAlign === 'inner') ? 0.33 : 0;
    this.fullCircles = circumference > TAU ? Math.floor(circumference / TAU) : 0;
    if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
      return;
    }
    ctx.save();
    let radiusOffset = 0;
    if (offset) {
      radiusOffset = offset / 2;
      const halfAngle = (this.startAngle + this.endAngle) / 2;
      ctx.translate(Math.cos(halfAngle) * radiusOffset, Math.sin(halfAngle) * radiusOffset);
      if (this.circumference >= PI) {
        radiusOffset = offset;
      }
    }
    ctx.fillStyle = options.backgroundColor;
    ctx.strokeStyle = options.borderColor;
    const endAngle = drawArc(ctx, this, radiusOffset, spacing);
    drawBorder(ctx, this, radiusOffset, spacing, endAngle);
    ctx.restore();
  }
}
ArcElement.id = 'arc';
ArcElement.defaults = {
  borderAlign: 'center',
  borderColor: '#fff',
  borderJoinStyle: undefined,
  borderRadius: 0,
  borderWidth: 2,
  offset: 0,
  spacing: 0,
  angle: undefined,
};
ArcElement.defaultRoutes = {
  backgroundColor: 'backgroundColor'
};

function setStyle(ctx, options, style = options) {
  ctx.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
  ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
  ctx.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
  ctx.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
  ctx.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
  ctx.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
}
function lineTo(ctx, previous, target) {
  ctx.lineTo(target.x, target.y);
}
function getLineMethod(options) {
  if (options.stepped) {
    return _steppedLineTo;
  }
  if (options.tension || options.cubicInterpolationMode === 'monotone') {
    return _bezierCurveTo;
  }
  return lineTo;
}
function pathVars(points, segment, params = {}) {
  const count = points.length;
  const {start: paramsStart = 0, end: paramsEnd = count - 1} = params;
  const {start: segmentStart, end: segmentEnd} = segment;
  const start = Math.max(paramsStart, segmentStart);
  const end = Math.min(paramsEnd, segmentEnd);
  const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
  return {
    count,
    start,
    loop: segment.loop,
    ilen: end < start && !outside ? count + end - start : end - start
  };
}
function pathSegment(ctx, line, segment, params) {
  const {points, options} = line;
  const {count, start, loop, ilen} = pathVars(points, segment, params);
  const lineMethod = getLineMethod(options);
  let {move = true, reverse} = params || {};
  let i, point, prev;
  for (i = 0; i <= ilen; ++i) {
    point = points[(start + (reverse ? ilen - i : i)) % count];
    if (point.skip) {
      continue;
    } else if (move) {
      ctx.moveTo(point.x, point.y);
      move = false;
    } else {
      lineMethod(ctx, prev, point, reverse, options.stepped);
    }
    prev = point;
  }
  if (loop) {
    point = points[(start + (reverse ? ilen : 0)) % count];
    lineMethod(ctx, prev, point, reverse, options.stepped);
  }
  return !!loop;
}
function fastPathSegment(ctx, line, segment, params) {
  const points = line.points;
  const {count, start, ilen} = pathVars(points, segment, params);
  const {move = true, reverse} = params || {};
  let avgX = 0;
  let countX = 0;
  let i, point, prevX, minY, maxY, lastY;
  const pointIndex = (index) => (start + (reverse ? ilen - index : index)) % count;
  const drawX = () => {
    if (minY !== maxY) {
      ctx.lineTo(avgX, maxY);
      ctx.lineTo(avgX, minY);
      ctx.lineTo(avgX, lastY);
    }
  };
  if (move) {
    point = points[pointIndex(0)];
    ctx.moveTo(point.x, point.y);
  }
  for (i = 0; i <= ilen; ++i) {
    point = points[pointIndex(i)];
    if (point.skip) {
      continue;
    }
    const x = point.x;
    const y = point.y;
    const truncX = x | 0;
    if (truncX === prevX) {
      if (y < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }
      avgX = (countX * avgX + x) / ++countX;
    } else {
      drawX();
      ctx.lineTo(x, y);
      prevX = truncX;
      countX = 0;
      minY = maxY = y;
    }
    lastY = y;
  }
  drawX();
}
function _getSegmentMethod(line) {
  const opts = line.options;
  const borderDash = opts.borderDash && opts.borderDash.length;
  const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== 'monotone' && !opts.stepped && !borderDash;
  return useFastPath ? fastPathSegment : pathSegment;
}
function _getInterpolationMethod(options) {
  if (options.stepped) {
    return _steppedInterpolation;
  }
  if (options.tension || options.cubicInterpolationMode === 'monotone') {
    return _bezierInterpolation;
  }
  return _pointInLine;
}
function strokePathWithCache(ctx, line, start, count) {
  let path = line._path;
  if (!path) {
    path = line._path = new Path2D();
    if (line.path(path, start, count)) {
      path.closePath();
    }
  }
  setStyle(ctx, line.options);
  ctx.stroke(path);
}
function strokePathDirect(ctx, line, start, count) {
  const {segments, options} = line;
  const segmentMethod = _getSegmentMethod(line);
  for (const segment of segments) {
    setStyle(ctx, options, segment.style);
    ctx.beginPath();
    if (segmentMethod(ctx, line, segment, {start, end: start + count - 1})) {
      ctx.closePath();
    }
    ctx.stroke();
  }
}
const usePath2D = typeof Path2D === 'function';
function draw(ctx, line, start, count) {
  if (usePath2D && !line.options.segment) {
    strokePathWithCache(ctx, line, start, count);
  } else {
    strokePathDirect(ctx, line, start, count);
  }
}
class LineElement extends Element {
  constructor(cfg) {
    super();
    this.animated = true;
    this.options = undefined;
    this._chart = undefined;
    this._loop = undefined;
    this._fullLoop = undefined;
    this._path = undefined;
    this._points = undefined;
    this._segments = undefined;
    this._decimated = false;
    this._pointsUpdated = false;
    this._datasetIndex = undefined;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  updateControlPoints(chartArea, indexAxis) {
    const options = this.options;
    if ((options.tension || options.cubicInterpolationMode === 'monotone') && !options.stepped && !this._pointsUpdated) {
      const loop = options.spanGaps ? this._loop : this._fullLoop;
      _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
      this._pointsUpdated = true;
    }
  }
  set points(points) {
    this._points = points;
    delete this._segments;
    delete this._path;
    this._pointsUpdated = false;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = _computeSegments(this, this.options.segment));
  }
  first() {
    const segments = this.segments;
    const points = this.points;
    return segments.length && points[segments[0].start];
  }
  last() {
    const segments = this.segments;
    const points = this.points;
    const count = segments.length;
    return count && points[segments[count - 1].end];
  }
  interpolate(point, property) {
    const options = this.options;
    const value = point[property];
    const points = this.points;
    const segments = _boundSegments(this, {property, start: value, end: value});
    if (!segments.length) {
      return;
    }
    const result = [];
    const _interpolate = _getInterpolationMethod(options);
    let i, ilen;
    for (i = 0, ilen = segments.length; i < ilen; ++i) {
      const {start, end} = segments[i];
      const p1 = points[start];
      const p2 = points[end];
      if (p1 === p2) {
        result.push(p1);
        continue;
      }
      const t = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
      const interpolated = _interpolate(p1, p2, t, options.stepped);
      interpolated[property] = point[property];
      result.push(interpolated);
    }
    return result.length === 1 ? result[0] : result;
  }
  pathSegment(ctx, segment, params) {
    const segmentMethod = _getSegmentMethod(this);
    return segmentMethod(ctx, this, segment, params);
  }
  path(ctx, start, count) {
    const segments = this.segments;
    const segmentMethod = _getSegmentMethod(this);
    let loop = this._loop;
    start = start || 0;
    count = count || (this.points.length - start);
    for (const segment of segments) {
      loop &= segmentMethod(ctx, this, segment, {start, end: start + count - 1});
    }
    return !!loop;
  }
  draw(ctx, chartArea, start, count) {
    const options = this.options || {};
    const points = this.points || [];
    if (points.length && options.borderWidth) {
      ctx.save();
      draw(ctx, this, start, count);
      ctx.restore();
    }
    if (this.animated) {
      this._pointsUpdated = false;
      this._path = undefined;
    }
  }
}
LineElement.id = 'line';
LineElement.defaults = {
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: 'miter',
  borderWidth: 3,
  capBezierPoints: true,
  cubicInterpolationMode: 'default',
  fill: false,
  spanGaps: false,
  stepped: false,
  tension: 0,
};
LineElement.defaultRoutes = {
  backgroundColor: 'backgroundColor',
  borderColor: 'borderColor'
};
LineElement.descriptors = {
  _scriptable: true,
  _indexable: (name) => name !== 'borderDash' && name !== 'fill',
};

function inRange$1(el, pos, axis, useFinalPosition) {
  const options = el.options;
  const {[axis]: value} = el.getProps([axis], useFinalPosition);
  return (Math.abs(pos - value) < options.radius + options.hitRadius);
}
class PointElement extends Element {
  constructor(cfg) {
    super();
    this.options = undefined;
    this.parsed = undefined;
    this.skip = undefined;
    this.stop = undefined;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  inRange(mouseX, mouseY, useFinalPosition) {
    const options = this.options;
    const {x, y} = this.getProps(['x', 'y'], useFinalPosition);
    return ((Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)) < Math.pow(options.hitRadius + options.radius, 2));
  }
  inXRange(mouseX, useFinalPosition) {
    return inRange$1(this, mouseX, 'x', useFinalPosition);
  }
  inYRange(mouseY, useFinalPosition) {
    return inRange$1(this, mouseY, 'y', useFinalPosition);
  }
  getCenterPoint(useFinalPosition) {
    const {x, y} = this.getProps(['x', 'y'], useFinalPosition);
    return {x, y};
  }
  size(options) {
    options = options || this.options || {};
    let radius = options.radius || 0;
    radius = Math.max(radius, radius && options.hoverRadius || 0);
    const borderWidth = radius && options.borderWidth || 0;
    return (radius + borderWidth) * 2;
  }
  draw(ctx, area) {
    const options = this.options;
    if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
      return;
    }
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.fillStyle = options.backgroundColor;
    drawPoint(ctx, options, this.x, this.y);
  }
  getRange() {
    const options = this.options || {};
    return options.radius + options.hitRadius;
  }
}
PointElement.id = 'point';
PointElement.defaults = {
  borderWidth: 1,
  hitRadius: 1,
  hoverBorderWidth: 1,
  hoverRadius: 4,
  pointStyle: 'circle',
  radius: 3,
  rotation: 0
};
PointElement.defaultRoutes = {
  backgroundColor: 'backgroundColor',
  borderColor: 'borderColor'
};

function getBarBounds(bar, useFinalPosition) {
  const {x, y, base, width, height} = bar.getProps(['x', 'y', 'base', 'width', 'height'], useFinalPosition);
  let left, right, top, bottom, half;
  if (bar.horizontal) {
    half = height / 2;
    left = Math.min(x, base);
    right = Math.max(x, base);
    top = y - half;
    bottom = y + half;
  } else {
    half = width / 2;
    left = x - half;
    right = x + half;
    top = Math.min(y, base);
    bottom = Math.max(y, base);
  }
  return {left, top, right, bottom};
}
function skipOrLimit(skip, value, min, max) {
  return skip ? 0 : _limitValue(value, min, max);
}
function parseBorderWidth(bar, maxW, maxH) {
  const value = bar.options.borderWidth;
  const skip = bar.borderSkipped;
  const o = toTRBL(value);
  return {
    t: skipOrLimit(skip.top, o.top, 0, maxH),
    r: skipOrLimit(skip.right, o.right, 0, maxW),
    b: skipOrLimit(skip.bottom, o.bottom, 0, maxH),
    l: skipOrLimit(skip.left, o.left, 0, maxW)
  };
}
function parseBorderRadius(bar, maxW, maxH) {
  const {enableBorderRadius} = bar.getProps(['enableBorderRadius']);
  const value = bar.options.borderRadius;
  const o = toTRBLCorners(value);
  const maxR = Math.min(maxW, maxH);
  const skip = bar.borderSkipped;
  const enableBorder = enableBorderRadius || isObject(value);
  return {
    topLeft: skipOrLimit(!enableBorder || skip.top || skip.left, o.topLeft, 0, maxR),
    topRight: skipOrLimit(!enableBorder || skip.top || skip.right, o.topRight, 0, maxR),
    bottomLeft: skipOrLimit(!enableBorder || skip.bottom || skip.left, o.bottomLeft, 0, maxR),
    bottomRight: skipOrLimit(!enableBorder || skip.bottom || skip.right, o.bottomRight, 0, maxR)
  };
}
function boundingRects(bar) {
  const bounds = getBarBounds(bar);
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const border = parseBorderWidth(bar, width / 2, height / 2);
  const radius = parseBorderRadius(bar, width / 2, height / 2);
  return {
    outer: {
      x: bounds.left,
      y: bounds.top,
      w: width,
      h: height,
      radius
    },
    inner: {
      x: bounds.left + border.l,
      y: bounds.top + border.t,
      w: width - border.l - border.r,
      h: height - border.t - border.b,
      radius: {
        topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
        topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
        bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
        bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r)),
      }
    }
  };
}
function inRange(bar, x, y, useFinalPosition) {
  const skipX = x === null;
  const skipY = y === null;
  const skipBoth = skipX && skipY;
  const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
  return bounds
		&& (skipX || _isBetween(x, bounds.left, bounds.right))
		&& (skipY || _isBetween(y, bounds.top, bounds.bottom));
}
function hasRadius(radius) {
  return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
}
function addNormalRectPath(ctx, rect) {
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
}
function inflateRect(rect, amount, refRect = {}) {
  const x = rect.x !== refRect.x ? -amount : 0;
  const y = rect.y !== refRect.y ? -amount : 0;
  const w = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x;
  const h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y;
  return {
    x: rect.x + x,
    y: rect.y + y,
    w: rect.w + w,
    h: rect.h + h,
    radius: rect.radius
  };
}
class BarElement extends Element {
  constructor(cfg) {
    super();
    this.options = undefined;
    this.horizontal = undefined;
    this.base = undefined;
    this.width = undefined;
    this.height = undefined;
    this.inflateAmount = undefined;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  draw(ctx) {
    const {inflateAmount, options: {borderColor, backgroundColor}} = this;
    const {inner, outer} = boundingRects(this);
    const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
    ctx.save();
    if (outer.w !== inner.w || outer.h !== inner.h) {
      ctx.beginPath();
      addRectPath(ctx, inflateRect(outer, inflateAmount, inner));
      ctx.clip();
      addRectPath(ctx, inflateRect(inner, -inflateAmount, outer));
      ctx.fillStyle = borderColor;
      ctx.fill('evenodd');
    }
    ctx.beginPath();
    addRectPath(ctx, inflateRect(inner, inflateAmount));
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.restore();
  }
  inRange(mouseX, mouseY, useFinalPosition) {
    return inRange(this, mouseX, mouseY, useFinalPosition);
  }
  inXRange(mouseX, useFinalPosition) {
    return inRange(this, mouseX, null, useFinalPosition);
  }
  inYRange(mouseY, useFinalPosition) {
    return inRange(this, null, mouseY, useFinalPosition);
  }
  getCenterPoint(useFinalPosition) {
    const {x, y, base, horizontal} = this.getProps(['x', 'y', 'base', 'horizontal'], useFinalPosition);
    return {
      x: horizontal ? (x + base) / 2 : x,
      y: horizontal ? y : (y + base) / 2
    };
  }
  getRange(axis) {
    return axis === 'x' ? this.width / 2 : this.height / 2;
  }
}
BarElement.id = 'bar';
BarElement.defaults = {
  borderSkipped: 'start',
  borderWidth: 0,
  borderRadius: 0,
  inflateAmount: 'auto',
  pointStyle: undefined
};
BarElement.defaultRoutes = {
  backgroundColor: 'backgroundColor',
  borderColor: 'borderColor'
};

var elements = /*#__PURE__*/Object.freeze({
__proto__: null,
ArcElement: ArcElement,
LineElement: LineElement,
PointElement: PointElement,
BarElement: BarElement
});

function lttbDecimation(data, start, count, availableWidth, options) {
  const samples = options.samples || availableWidth;
  if (samples >= count) {
    return data.slice(start, start + count);
  }
  const decimated = [];
  const bucketWidth = (count - 2) / (samples - 2);
  let sampledIndex = 0;
  const endIndex = start + count - 1;
  let a = start;
  let i, maxAreaPoint, maxArea, area, nextA;
  decimated[sampledIndex++] = data[a];
  for (i = 0; i < samples - 2; i++) {
    let avgX = 0;
    let avgY = 0;
    let j;
    const avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start;
    const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start;
    const avgRangeLength = avgRangeEnd - avgRangeStart;
    for (j = avgRangeStart; j < avgRangeEnd; j++) {
      avgX += data[j].x;
      avgY += data[j].y;
    }
    avgX /= avgRangeLength;
    avgY /= avgRangeLength;
    const rangeOffs = Math.floor(i * bucketWidth) + 1 + start;
    const rangeTo = Math.min(Math.floor((i + 1) * bucketWidth) + 1, count) + start;
    const {x: pointAx, y: pointAy} = data[a];
    maxArea = area = -1;
    for (j = rangeOffs; j < rangeTo; j++) {
      area = 0.5 * Math.abs(
        (pointAx - avgX) * (data[j].y - pointAy) -
        (pointAx - data[j].x) * (avgY - pointAy)
      );
      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = data[j];
        nextA = j;
      }
    }
    decimated[sampledIndex++] = maxAreaPoint;
    a = nextA;
  }
  decimated[sampledIndex++] = data[endIndex];
  return decimated;
}
function minMaxDecimation(data, start, count, availableWidth) {
  let avgX = 0;
  let countX = 0;
  let i, point, x, y, prevX, minIndex, maxIndex, startIndex, minY, maxY;
  const decimated = [];
  const endIndex = start + count - 1;
  const xMin = data[start].x;
  const xMax = data[endIndex].x;
  const dx = xMax - xMin;
  for (i = start; i < start + count; ++i) {
    point = data[i];
    x = (point.x - xMin) / dx * availableWidth;
    y = point.y;
    const truncX = x | 0;
    if (truncX === prevX) {
      if (y < minY) {
        minY = y;
        minIndex = i;
      } else if (y > maxY) {
        maxY = y;
        maxIndex = i;
      }
      avgX = (countX * avgX + point.x) / ++countX;
    } else {
      const lastIndex = i - 1;
      if (!isNullOrUndef(minIndex) && !isNullOrUndef(maxIndex)) {
        const intermediateIndex1 = Math.min(minIndex, maxIndex);
        const intermediateIndex2 = Math.max(minIndex, maxIndex);
        if (intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex) {
          decimated.push({
            ...data[intermediateIndex1],
            x: avgX,
          });
        }
        if (intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex) {
          decimated.push({
            ...data[intermediateIndex2],
            x: avgX
          });
        }
      }
      if (i > 0 && lastIndex !== startIndex) {
        decimated.push(data[lastIndex]);
      }
      decimated.push(point);
      prevX = truncX;
      countX = 0;
      minY = maxY = y;
      minIndex = maxIndex = startIndex = i;
    }
  }
  return decimated;
}
function cleanDecimatedDataset(dataset) {
  if (dataset._decimated) {
    const data = dataset._data;
    delete dataset._decimated;
    delete dataset._data;
    Object.defineProperty(dataset, 'data', {value: data});
  }
}
function cleanDecimatedData(chart) {
  chart.data.datasets.forEach((dataset) => {
    cleanDecimatedDataset(dataset);
  });
}
function getStartAndCountOfVisiblePointsSimplified(meta, points) {
  const pointCount = points.length;
  let start = 0;
  let count;
  const {iScale} = meta;
  const {min, max, minDefined, maxDefined} = iScale.getUserBounds();
  if (minDefined) {
    start = _limitValue(_lookupByKey(points, iScale.axis, min).lo, 0, pointCount - 1);
  }
  if (maxDefined) {
    count = _limitValue(_lookupByKey(points, iScale.axis, max).hi + 1, start, pointCount) - start;
  } else {
    count = pointCount - start;
  }
  return {start, count};
}
var plugin_decimation = {
  id: 'decimation',
  defaults: {
    algorithm: 'min-max',
    enabled: false,
  },
  beforeElementsUpdate: (chart, args, options) => {
    if (!options.enabled) {
      cleanDecimatedData(chart);
      return;
    }
    const availableWidth = chart.width;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const {_data, indexAxis} = dataset;
      const meta = chart.getDatasetMeta(datasetIndex);
      const data = _data || dataset.data;
      if (resolve([indexAxis, chart.options.indexAxis]) === 'y') {
        return;
      }
      if (meta.type !== 'line') {
        return;
      }
      const xAxis = chart.scales[meta.xAxisID];
      if (xAxis.type !== 'linear' && xAxis.type !== 'time') {
        return;
      }
      if (chart.options.parsing) {
        return;
      }
      let {start, count} = getStartAndCountOfVisiblePointsSimplified(meta, data);
      const threshold = options.threshold || 4 * availableWidth;
      if (count <= threshold) {
        cleanDecimatedDataset(dataset);
        return;
      }
      if (isNullOrUndef(_data)) {
        dataset._data = data;
        delete dataset.data;
        Object.defineProperty(dataset, 'data', {
          configurable: true,
          enumerable: true,
          get: function() {
            return this._decimated;
          },
          set: function(d) {
            this._data = d;
          }
        });
      }
      let decimated;
      switch (options.algorithm) {
      case 'lttb':
        decimated = lttbDecimation(data, start, count, availableWidth, options);
        break;
      case 'min-max':
        decimated = minMaxDecimation(data, start, count, availableWidth);
        break;
      default:
        throw new Error(`Unsupported decimation algorithm '${options.algorithm}'`);
      }
      dataset._decimated = decimated;
    });
  },
  destroy(chart) {
    cleanDecimatedData(chart);
  }
};

function getLineByIndex(chart, index) {
  const meta = chart.getDatasetMeta(index);
  const visible = meta && chart.isDatasetVisible(index);
  return visible ? meta.dataset : null;
}
function parseFillOption(line) {
  const options = line.options;
  const fillOption = options.fill;
  let fill = valueOrDefault(fillOption && fillOption.target, fillOption);
  if (fill === undefined) {
    fill = !!options.backgroundColor;
  }
  if (fill === false || fill === null) {
    return false;
  }
  if (fill === true) {
    return 'origin';
  }
  return fill;
}
function decodeFill(line, index, count) {
  const fill = parseFillOption(line);
  if (isObject(fill)) {
    return isNaN(fill.value) ? false : fill;
  }
  let target = parseFloat(fill);
  if (isNumberFinite(target) && Math.floor(target) === target) {
    if (fill[0] === '-' || fill[0] === '+') {
      target = index + target;
    }
    if (target === index || target < 0 || target >= count) {
      return false;
    }
    return target;
  }
  return ['origin', 'start', 'end', 'stack', 'shape'].indexOf(fill) >= 0 && fill;
}
function computeLinearBoundary(source) {
  const {scale = {}, fill} = source;
  let target = null;
  let horizontal;
  if (fill === 'start') {
    target = scale.bottom;
  } else if (fill === 'end') {
    target = scale.top;
  } else if (isObject(fill)) {
    target = scale.getPixelForValue(fill.value);
  } else if (scale.getBasePixel) {
    target = scale.getBasePixel();
  }
  if (isNumberFinite(target)) {
    horizontal = scale.isHorizontal();
    return {
      x: horizontal ? target : null,
      y: horizontal ? null : target
    };
  }
  return null;
}
class simpleArc {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.radius = opts.radius;
  }
  pathSegment(ctx, bounds, opts) {
    const {x, y, radius} = this;
    bounds = bounds || {start: 0, end: TAU};
    ctx.arc(x, y, radius, bounds.end, bounds.start, true);
    return !opts.bounds;
  }
  interpolate(point) {
    const {x, y, radius} = this;
    const angle = point.angle;
    return {
      x: x + Math.cos(angle) * radius,
      y: y + Math.sin(angle) * radius,
      angle
    };
  }
}
function computeCircularBoundary(source) {
  const {scale, fill} = source;
  const options = scale.options;
  const length = scale.getLabels().length;
  const target = [];
  const start = options.reverse ? scale.max : scale.min;
  const end = options.reverse ? scale.min : scale.max;
  let i, center, value;
  if (fill === 'start') {
    value = start;
  } else if (fill === 'end') {
    value = end;
  } else if (isObject(fill)) {
    value = fill.value;
  } else {
    value = scale.getBaseValue();
  }
  if (options.grid.circular) {
    center = scale.getPointPositionForValue(0, start);
    return new simpleArc({
      x: center.x,
      y: center.y,
      radius: scale.getDistanceFromCenterForValue(value)
    });
  }
  for (i = 0; i < length; ++i) {
    target.push(scale.getPointPositionForValue(i, value));
  }
  return target;
}
function computeBoundary(source) {
  const scale = source.scale || {};
  if (scale.getPointPositionForValue) {
    return computeCircularBoundary(source);
  }
  return computeLinearBoundary(source);
}
function findSegmentEnd(start, end, points) {
  for (;end > start; end--) {
    const point = points[end];
    if (!isNaN(point.x) && !isNaN(point.y)) {
      break;
    }
  }
  return end;
}
function pointsFromSegments(boundary, line) {
  const {x = null, y = null} = boundary || {};
  const linePoints = line.points;
  const points = [];
  line.segments.forEach(({start, end}) => {
    end = findSegmentEnd(start, end, linePoints);
    const first = linePoints[start];
    const last = linePoints[end];
    if (y !== null) {
      points.push({x: first.x, y});
      points.push({x: last.x, y});
    } else if (x !== null) {
      points.push({x, y: first.y});
      points.push({x, y: last.y});
    }
  });
  return points;
}
function buildStackLine(source) {
  const {scale, index, line} = source;
  const points = [];
  const segments = line.segments;
  const sourcePoints = line.points;
  const linesBelow = getLinesBelow(scale, index);
  linesBelow.push(createBoundaryLine({x: null, y: scale.bottom}, line));
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    for (let j = segment.start; j <= segment.end; j++) {
      addPointsBelow(points, sourcePoints[j], linesBelow);
    }
  }
  return new LineElement({points, options: {}});
}
function getLinesBelow(scale, index) {
  const below = [];
  const metas = scale.getMatchingVisibleMetas('line');
  for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    if (meta.index === index) {
      break;
    }
    if (!meta.hidden) {
      below.unshift(meta.dataset);
    }
  }
  return below;
}
function addPointsBelow(points, sourcePoint, linesBelow) {
  const postponed = [];
  for (let j = 0; j < linesBelow.length; j++) {
    const line = linesBelow[j];
    const {first, last, point} = findPoint(line, sourcePoint, 'x');
    if (!point || (first && last)) {
      continue;
    }
    if (first) {
      postponed.unshift(point);
    } else {
      points.push(point);
      if (!last) {
        break;
      }
    }
  }
  points.push(...postponed);
}
function findPoint(line, sourcePoint, property) {
  const point = line.interpolate(sourcePoint, property);
  if (!point) {
    return {};
  }
  const pointValue = point[property];
  const segments = line.segments;
  const linePoints = line.points;
  let first = false;
  let last = false;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const firstValue = linePoints[segment.start][property];
    const lastValue = linePoints[segment.end][property];
    if (_isBetween(pointValue, firstValue, lastValue)) {
      first = pointValue === firstValue;
      last = pointValue === lastValue;
      break;
    }
  }
  return {first, last, point};
}
function getTarget(source) {
  const {chart, fill, line} = source;
  if (isNumberFinite(fill)) {
    return getLineByIndex(chart, fill);
  }
  if (fill === 'stack') {
    return buildStackLine(source);
  }
  if (fill === 'shape') {
    return true;
  }
  const boundary = computeBoundary(source);
  if (boundary instanceof simpleArc) {
    return boundary;
  }
  return createBoundaryLine(boundary, line);
}
function createBoundaryLine(boundary, line) {
  let points = [];
  let _loop = false;
  if (isArray(boundary)) {
    _loop = true;
    points = boundary;
  } else {
    points = pointsFromSegments(boundary, line);
  }
  return points.length ? new LineElement({
    points,
    options: {tension: 0},
    _loop,
    _fullLoop: _loop
  }) : null;
}
function resolveTarget(sources, index, propagate) {
  const source = sources[index];
  let fill = source.fill;
  const visited = [index];
  let target;
  if (!propagate) {
    return fill;
  }
  while (fill !== false && visited.indexOf(fill) === -1) {
    if (!isNumberFinite(fill)) {
      return fill;
    }
    target = sources[fill];
    if (!target) {
      return false;
    }
    if (target.visible) {
      return fill;
    }
    visited.push(fill);
    fill = target.fill;
  }
  return false;
}
function _clip(ctx, target, clipY) {
  const {segments, points} = target;
  let first = true;
  let lineLoop = false;
  ctx.beginPath();
  for (const segment of segments) {
    const {start, end} = segment;
    const firstPoint = points[start];
    const lastPoint = points[findSegmentEnd(start, end, points)];
    if (first) {
      ctx.moveTo(firstPoint.x, firstPoint.y);
      first = false;
    } else {
      ctx.lineTo(firstPoint.x, clipY);
      ctx.lineTo(firstPoint.x, firstPoint.y);
    }
    lineLoop = !!target.pathSegment(ctx, segment, {move: lineLoop});
    if (lineLoop) {
      ctx.closePath();
    } else {
      ctx.lineTo(lastPoint.x, clipY);
    }
  }
  ctx.lineTo(target.first().x, clipY);
  ctx.closePath();
  ctx.clip();
}
function getBounds(property, first, last, loop) {
  if (loop) {
    return;
  }
  let start = first[property];
  let end = last[property];
  if (property === 'angle') {
    start = _normalizeAngle(start);
    end = _normalizeAngle(end);
  }
  return {property, start, end};
}
function _getEdge(a, b, prop, fn) {
  if (a && b) {
    return fn(a[prop], b[prop]);
  }
  return a ? a[prop] : b ? b[prop] : 0;
}
function _segments(line, target, property) {
  const segments = line.segments;
  const points = line.points;
  const tpoints = target.points;
  const parts = [];
  for (const segment of segments) {
    let {start, end} = segment;
    end = findSegmentEnd(start, end, points);
    const bounds = getBounds(property, points[start], points[end], segment.loop);
    if (!target.segments) {
      parts.push({
        source: segment,
        target: bounds,
        start: points[start],
        end: points[end]
      });
      continue;
    }
    const targetSegments = _boundSegments(target, bounds);
    for (const tgt of targetSegments) {
      const subBounds = getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
      const fillSources = _boundSegment(segment, points, subBounds);
      for (const fillSource of fillSources) {
        parts.push({
          source: fillSource,
          target: tgt,
          start: {
            [property]: _getEdge(bounds, subBounds, 'start', Math.max)
          },
          end: {
            [property]: _getEdge(bounds, subBounds, 'end', Math.min)
          }
        });
      }
    }
  }
  return parts;
}
function clipBounds(ctx, scale, bounds) {
  const {top, bottom} = scale.chart.chartArea;
  const {property, start, end} = bounds || {};
  if (property === 'x') {
    ctx.beginPath();
    ctx.rect(start, top, end - start, bottom - top);
    ctx.clip();
  }
}
function interpolatedLineTo(ctx, target, point, property) {
  const interpolatedPoint = target.interpolate(point, property);
  if (interpolatedPoint) {
    ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
  }
}
function _fill(ctx, cfg) {
  const {line, target, property, color, scale} = cfg;
  const segments = _segments(line, target, property);
  for (const {source: src, target: tgt, start, end} of segments) {
    const {style: {backgroundColor = color} = {}} = src;
    const notShape = target !== true;
    ctx.save();
    ctx.fillStyle = backgroundColor;
    clipBounds(ctx, scale, notShape && getBounds(property, start, end));
    ctx.beginPath();
    const lineLoop = !!line.pathSegment(ctx, src);
    let loop;
    if (notShape) {
      if (lineLoop) {
        ctx.closePath();
      } else {
        interpolatedLineTo(ctx, target, end, property);
      }
      const targetLoop = !!target.pathSegment(ctx, tgt, {move: lineLoop, reverse: true});
      loop = lineLoop && targetLoop;
      if (!loop) {
        interpolatedLineTo(ctx, target, start, property);
      }
    }
    ctx.closePath();
    ctx.fill(loop ? 'evenodd' : 'nonzero');
    ctx.restore();
  }
}
function doFill(ctx, cfg) {
  const {line, target, above, below, area, scale} = cfg;
  const property = line._loop ? 'angle' : cfg.axis;
  ctx.save();
  if (property === 'x' && below !== above) {
    _clip(ctx, target, area.top);
    _fill(ctx, {line, target, color: above, scale, property});
    ctx.restore();
    ctx.save();
    _clip(ctx, target, area.bottom);
  }
  _fill(ctx, {line, target, color: below, scale, property});
  ctx.restore();
}
function drawfill(ctx, source, area) {
  const target = getTarget(source);
  const {line, scale, axis} = source;
  const lineOpts = line.options;
  const fillOption = lineOpts.fill;
  const color = lineOpts.backgroundColor;
  const {above = color, below = color} = fillOption || {};
  if (target && line.points.length) {
    clipArea(ctx, area);
    doFill(ctx, {line, target, above, below, area, scale, axis});
    unclipArea(ctx);
  }
}
var plugin_filler = {
  id: 'filler',
  afterDatasetsUpdate(chart, _args, options) {
    const count = (chart.data.datasets || []).length;
    const sources = [];
    let meta, i, line, source;
    for (i = 0; i < count; ++i) {
      meta = chart.getDatasetMeta(i);
      line = meta.dataset;
      source = null;
      if (line && line.options && line instanceof LineElement) {
        source = {
          visible: chart.isDatasetVisible(i),
          index: i,
          fill: decodeFill(line, i, count),
          chart,
          axis: meta.controller.options.indexAxis,
          scale: meta.vScale,
          line,
        };
      }
      meta.$filler = source;
      sources.push(source);
    }
    for (i = 0; i < count; ++i) {
      source = sources[i];
      if (!source || source.fill === false) {
        continue;
      }
      source.fill = resolveTarget(sources, i, options.propagate);
    }
  },
  beforeDraw(chart, _args, options) {
    const draw = options.drawTime === 'beforeDraw';
    const metasets = chart.getSortedVisibleDatasetMetas();
    const area = chart.chartArea;
    for (let i = metasets.length - 1; i >= 0; --i) {
      const source = metasets[i].$filler;
      if (!source) {
        continue;
      }
      source.line.updateControlPoints(area, source.axis);
      if (draw) {
        drawfill(chart.ctx, source, area);
      }
    }
  },
  beforeDatasetsDraw(chart, _args, options) {
    if (options.drawTime !== 'beforeDatasetsDraw') {
      return;
    }
    const metasets = chart.getSortedVisibleDatasetMetas();
    for (let i = metasets.length - 1; i >= 0; --i) {
      const source = metasets[i].$filler;
      if (source) {
        drawfill(chart.ctx, source, chart.chartArea);
      }
    }
  },
  beforeDatasetDraw(chart, args, options) {
    const source = args.meta.$filler;
    if (!source || source.fill === false || options.drawTime !== 'beforeDatasetDraw') {
      return;
    }
    drawfill(chart.ctx, source, chart.chartArea);
  },
  defaults: {
    propagate: true,
    drawTime: 'beforeDatasetDraw'
  }
};

const getBoxSize = (labelOpts, fontSize) => {
  let {boxHeight = fontSize, boxWidth = fontSize} = labelOpts;
  if (labelOpts.usePointStyle) {
    boxHeight = Math.min(boxHeight, fontSize);
    boxWidth = Math.min(boxWidth, fontSize);
  }
  return {
    boxWidth,
    boxHeight,
    itemHeight: Math.max(fontSize, boxHeight)
  };
};
const itemsEqual = (a, b) => a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;
class Legend extends Element {
  constructor(config) {
    super();
    this._added = false;
    this.legendHitBoxes = [];
    this._hoveredItem = null;
    this.doughnutMode = false;
    this.chart = config.chart;
    this.options = config.options;
    this.ctx = config.ctx;
    this.legendItems = undefined;
    this.columnSizes = undefined;
    this.lineWidths = undefined;
    this.maxHeight = undefined;
    this.maxWidth = undefined;
    this.top = undefined;
    this.bottom = undefined;
    this.left = undefined;
    this.right = undefined;
    this.height = undefined;
    this.width = undefined;
    this._margins = undefined;
    this.position = undefined;
    this.weight = undefined;
    this.fullSize = undefined;
  }
  update(maxWidth, maxHeight, margins) {
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this._margins = margins;
    this.setDimensions();
    this.buildLabels();
    this.fit();
  }
  setDimensions() {
    if (this.isHorizontal()) {
      this.width = this.maxWidth;
      this.left = this._margins.left;
      this.right = this.width;
    } else {
      this.height = this.maxHeight;
      this.top = this._margins.top;
      this.bottom = this.height;
    }
  }
  buildLabels() {
    const labelOpts = this.options.labels || {};
    let legendItems = callback(labelOpts.generateLabels, [this.chart], this) || [];
    if (labelOpts.filter) {
      legendItems = legendItems.filter((item) => labelOpts.filter(item, this.chart.data));
    }
    if (labelOpts.sort) {
      legendItems = legendItems.sort((a, b) => labelOpts.sort(a, b, this.chart.data));
    }
    if (this.options.reverse) {
      legendItems.reverse();
    }
    this.legendItems = legendItems;
  }
  fit() {
    const {options, ctx} = this;
    if (!options.display) {
      this.width = this.height = 0;
      return;
    }
    const labelOpts = options.labels;
    const labelFont = toFont(labelOpts.font);
    const fontSize = labelFont.size;
    const titleHeight = this._computeTitleHeight();
    const {boxWidth, itemHeight} = getBoxSize(labelOpts, fontSize);
    let width, height;
    ctx.font = labelFont.string;
    if (this.isHorizontal()) {
      width = this.maxWidth;
      height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
    } else {
      height = this.maxHeight;
      width = this._fitCols(titleHeight, fontSize, boxWidth, itemHeight) + 10;
    }
    this.width = Math.min(width, options.maxWidth || this.maxWidth);
    this.height = Math.min(height, options.maxHeight || this.maxHeight);
  }
  _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
    const {ctx, maxWidth, options: {labels: {padding}}} = this;
    const hitboxes = this.legendHitBoxes = [];
    const lineWidths = this.lineWidths = [0];
    const lineHeight = itemHeight + padding;
    let totalHeight = titleHeight;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let row = -1;
    let top = -lineHeight;
    this.legendItems.forEach((legendItem, i) => {
      const itemWidth = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;
      if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
        totalHeight += lineHeight;
        lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
        top += lineHeight;
        row++;
      }
      hitboxes[i] = {left: 0, top, row, width: itemWidth, height: itemHeight};
      lineWidths[lineWidths.length - 1] += itemWidth + padding;
    });
    return totalHeight;
  }
  _fitCols(titleHeight, fontSize, boxWidth, itemHeight) {
    const {ctx, maxHeight, options: {labels: {padding}}} = this;
    const hitboxes = this.legendHitBoxes = [];
    const columnSizes = this.columnSizes = [];
    const heightLimit = maxHeight - titleHeight;
    let totalWidth = padding;
    let currentColWidth = 0;
    let currentColHeight = 0;
    let left = 0;
    let col = 0;
    this.legendItems.forEach((legendItem, i) => {
      const itemWidth = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;
      if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
        totalWidth += currentColWidth + padding;
        columnSizes.push({width: currentColWidth, height: currentColHeight});
        left += currentColWidth + padding;
        col++;
        currentColWidth = currentColHeight = 0;
      }
      hitboxes[i] = {left, top: currentColHeight, col, width: itemWidth, height: itemHeight};
      currentColWidth = Math.max(currentColWidth, itemWidth);
      currentColHeight += itemHeight + padding;
    });
    totalWidth += currentColWidth;
    columnSizes.push({width: currentColWidth, height: currentColHeight});
    return totalWidth;
  }
  adjustHitBoxes() {
    if (!this.options.display) {
      return;
    }
    const titleHeight = this._computeTitleHeight();
    const {legendHitBoxes: hitboxes, options: {align, labels: {padding}, rtl}} = this;
    const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
    if (this.isHorizontal()) {
      let row = 0;
      let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
      for (const hitbox of hitboxes) {
        if (row !== hitbox.row) {
          row = hitbox.row;
          left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
        }
        hitbox.top += this.top + titleHeight + padding;
        hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
        left += hitbox.width + padding;
      }
    } else {
      let col = 0;
      let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
      for (const hitbox of hitboxes) {
        if (hitbox.col !== col) {
          col = hitbox.col;
          top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
        }
        hitbox.top = top;
        hitbox.left += this.left + padding;
        hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
        top += hitbox.height + padding;
      }
    }
  }
  isHorizontal() {
    return this.options.position === 'top' || this.options.position === 'bottom';
  }
  draw() {
    if (this.options.display) {
      const ctx = this.ctx;
      clipArea(ctx, this);
      this._draw();
      unclipArea(ctx);
    }
  }
  _draw() {
    const {options: opts, columnSizes, lineWidths, ctx} = this;
    const {align, labels: labelOpts} = opts;
    const defaultColor = defaults.color;
    const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
    const labelFont = toFont(labelOpts.font);
    const {color: fontColor, padding} = labelOpts;
    const fontSize = labelFont.size;
    const halfFontSize = fontSize / 2;
    let cursor;
    this.drawTitle();
    ctx.textAlign = rtlHelper.textAlign('left');
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 0.5;
    ctx.font = labelFont.string;
    const {boxWidth, boxHeight, itemHeight} = getBoxSize(labelOpts, fontSize);
    const drawLegendBox = function(x, y, legendItem) {
      if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
        return;
      }
      ctx.save();
      const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
      ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
      ctx.lineCap = valueOrDefault(legendItem.lineCap, 'butt');
      ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
      ctx.lineJoin = valueOrDefault(legendItem.lineJoin, 'miter');
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
      ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
      if (labelOpts.usePointStyle) {
        const drawOptions = {
          radius: boxWidth * Math.SQRT2 / 2,
          pointStyle: legendItem.pointStyle,
          rotation: legendItem.rotation,
          borderWidth: lineWidth
        };
        const centerX = rtlHelper.xPlus(x, boxWidth / 2);
        const centerY = y + halfFontSize;
        drawPoint(ctx, drawOptions, centerX, centerY);
      } else {
        const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
        const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
        const borderRadius = toTRBLCorners(legendItem.borderRadius);
        ctx.beginPath();
        if (Object.values(borderRadius).some(v => v !== 0)) {
          addRoundedRectPath(ctx, {
            x: xBoxLeft,
            y: yBoxTop,
            w: boxWidth,
            h: boxHeight,
            radius: borderRadius,
          });
        } else {
          ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
        }
        ctx.fill();
        if (lineWidth !== 0) {
          ctx.stroke();
        }
      }
      ctx.restore();
    };
    const fillText = function(x, y, legendItem) {
      renderText(ctx, legendItem.text, x, y + (itemHeight / 2), labelFont, {
        strikethrough: legendItem.hidden,
        textAlign: rtlHelper.textAlign(legendItem.textAlign)
      });
    };
    const isHorizontal = this.isHorizontal();
    const titleHeight = this._computeTitleHeight();
    if (isHorizontal) {
      cursor = {
        x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
        y: this.top + padding + titleHeight,
        line: 0
      };
    } else {
      cursor = {
        x: this.left + padding,
        y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
        line: 0
      };
    }
    overrideTextDirection(this.ctx, opts.textDirection);
    const lineHeight = itemHeight + padding;
    this.legendItems.forEach((legendItem, i) => {
      ctx.strokeStyle = legendItem.fontColor || fontColor;
      ctx.fillStyle = legendItem.fontColor || fontColor;
      const textWidth = ctx.measureText(legendItem.text).width;
      const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
      const width = boxWidth + halfFontSize + textWidth;
      let x = cursor.x;
      let y = cursor.y;
      rtlHelper.setWidth(this.width);
      if (isHorizontal) {
        if (i > 0 && x + width + padding > this.right) {
          y = cursor.y += lineHeight;
          cursor.line++;
          x = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
        }
      } else if (i > 0 && y + lineHeight > this.bottom) {
        x = cursor.x = x + columnSizes[cursor.line].width + padding;
        cursor.line++;
        y = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
      }
      const realX = rtlHelper.x(x);
      drawLegendBox(realX, y, legendItem);
      x = _textX(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl);
      fillText(rtlHelper.x(x), y, legendItem);
      if (isHorizontal) {
        cursor.x += width + padding;
      } else {
        cursor.y += lineHeight;
      }
    });
    restoreTextDirection(this.ctx, opts.textDirection);
  }
  drawTitle() {
    const opts = this.options;
    const titleOpts = opts.title;
    const titleFont = toFont(titleOpts.font);
    const titlePadding = toPadding(titleOpts.padding);
    if (!titleOpts.display) {
      return;
    }
    const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
    const ctx = this.ctx;
    const position = titleOpts.position;
    const halfFontSize = titleFont.size / 2;
    const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
    let y;
    let left = this.left;
    let maxWidth = this.width;
    if (this.isHorizontal()) {
      maxWidth = Math.max(...this.lineWidths);
      y = this.top + topPaddingPlusHalfFontSize;
      left = _alignStartEnd(opts.align, left, this.right - maxWidth);
    } else {
      const maxHeight = this.columnSizes.reduce((acc, size) => Math.max(acc, size.height), 0);
      y = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
    }
    const x = _alignStartEnd(position, left, left + maxWidth);
    ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = titleOpts.color;
    ctx.fillStyle = titleOpts.color;
    ctx.font = titleFont.string;
    renderText(ctx, titleOpts.text, x, y, titleFont);
  }
  _computeTitleHeight() {
    const titleOpts = this.options.title;
    const titleFont = toFont(titleOpts.font);
    const titlePadding = toPadding(titleOpts.padding);
    return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
  }
  _getLegendItemAt(x, y) {
    let i, hitBox, lh;
    if (_isBetween(x, this.left, this.right)
      && _isBetween(y, this.top, this.bottom)) {
      lh = this.legendHitBoxes;
      for (i = 0; i < lh.length; ++i) {
        hitBox = lh[i];
        if (_isBetween(x, hitBox.left, hitBox.left + hitBox.width)
          && _isBetween(y, hitBox.top, hitBox.top + hitBox.height)) {
          return this.legendItems[i];
        }
      }
    }
    return null;
  }
  handleEvent(e) {
    const opts = this.options;
    if (!isListened(e.type, opts)) {
      return;
    }
    const hoveredItem = this._getLegendItemAt(e.x, e.y);
    if (e.type === 'mousemove') {
      const previous = this._hoveredItem;
      const sameItem = itemsEqual(previous, hoveredItem);
      if (previous && !sameItem) {
        callback(opts.onLeave, [e, previous, this], this);
      }
      this._hoveredItem = hoveredItem;
      if (hoveredItem && !sameItem) {
        callback(opts.onHover, [e, hoveredItem, this], this);
      }
    } else if (hoveredItem) {
      callback(opts.onClick, [e, hoveredItem, this], this);
    }
  }
}
function isListened(type, opts) {
  if (type === 'mousemove' && (opts.onHover || opts.onLeave)) {
    return true;
  }
  if (opts.onClick && (type === 'click' || type === 'mouseup')) {
    return true;
  }
  return false;
}
var plugin_legend = {
  id: 'legend',
  _element: Legend,
  start(chart, _args, options) {
    const legend = chart.legend = new Legend({ctx: chart.ctx, options, chart});
    layouts.configure(chart, legend, options);
    layouts.addBox(chart, legend);
  },
  stop(chart) {
    layouts.removeBox(chart, chart.legend);
    delete chart.legend;
  },
  beforeUpdate(chart, _args, options) {
    const legend = chart.legend;
    layouts.configure(chart, legend, options);
    legend.options = options;
  },
  afterUpdate(chart) {
    const legend = chart.legend;
    legend.buildLabels();
    legend.adjustHitBoxes();
  },
  afterEvent(chart, args) {
    if (!args.replay) {
      chart.legend.handleEvent(args.event);
    }
  },
  defaults: {
    display: true,
    position: 'top',
    align: 'center',
    fullSize: true,
    reverse: false,
    weight: 1000,
    onClick(e, legendItem, legend) {
      const index = legendItem.datasetIndex;
      const ci = legend.chart;
      if (ci.isDatasetVisible(index)) {
        ci.hide(index);
        legendItem.hidden = true;
      } else {
        ci.show(index);
        legendItem.hidden = false;
      }
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: (ctx) => ctx.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(chart) {
        const datasets = chart.data.datasets;
        const {labels: {usePointStyle, pointStyle, textAlign, color}} = chart.legend.options;
        return chart._getSortedDatasetMetas().map((meta) => {
          const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
          const borderWidth = toPadding(style.borderWidth);
          return {
            text: datasets[meta.index].label,
            fillStyle: style.backgroundColor,
            fontColor: color,
            hidden: !meta.visible,
            lineCap: style.borderCapStyle,
            lineDash: style.borderDash,
            lineDashOffset: style.borderDashOffset,
            lineJoin: style.borderJoinStyle,
            lineWidth: (borderWidth.width + borderWidth.height) / 4,
            strokeStyle: style.borderColor,
            pointStyle: pointStyle || style.pointStyle,
            rotation: style.rotation,
            textAlign: textAlign || style.textAlign,
            borderRadius: 0,
            datasetIndex: meta.index
          };
        }, this);
      }
    },
    title: {
      color: (ctx) => ctx.chart.options.color,
      display: false,
      position: 'center',
      text: '',
    }
  },
  descriptors: {
    _scriptable: (name) => !name.startsWith('on'),
    labels: {
      _scriptable: (name) => !['generateLabels', 'filter', 'sort'].includes(name),
    }
  },
};

class Title extends Element {
  constructor(config) {
    super();
    this.chart = config.chart;
    this.options = config.options;
    this.ctx = config.ctx;
    this._padding = undefined;
    this.top = undefined;
    this.bottom = undefined;
    this.left = undefined;
    this.right = undefined;
    this.width = undefined;
    this.height = undefined;
    this.position = undefined;
    this.weight = undefined;
    this.fullSize = undefined;
  }
  update(maxWidth, maxHeight) {
    const opts = this.options;
    this.left = 0;
    this.top = 0;
    if (!opts.display) {
      this.width = this.height = this.right = this.bottom = 0;
      return;
    }
    this.width = this.right = maxWidth;
    this.height = this.bottom = maxHeight;
    const lineCount = isArray(opts.text) ? opts.text.length : 1;
    this._padding = toPadding(opts.padding);
    const textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
    if (this.isHorizontal()) {
      this.height = textSize;
    } else {
      this.width = textSize;
    }
  }
  isHorizontal() {
    const pos = this.options.position;
    return pos === 'top' || pos === 'bottom';
  }
  _drawArgs(offset) {
    const {top, left, bottom, right, options} = this;
    const align = options.align;
    let rotation = 0;
    let maxWidth, titleX, titleY;
    if (this.isHorizontal()) {
      titleX = _alignStartEnd(align, left, right);
      titleY = top + offset;
      maxWidth = right - left;
    } else {
      if (options.position === 'left') {
        titleX = left + offset;
        titleY = _alignStartEnd(align, bottom, top);
        rotation = PI * -0.5;
      } else {
        titleX = right - offset;
        titleY = _alignStartEnd(align, top, bottom);
        rotation = PI * 0.5;
      }
      maxWidth = bottom - top;
    }
    return {titleX, titleY, maxWidth, rotation};
  }
  draw() {
    const ctx = this.ctx;
    const opts = this.options;
    if (!opts.display) {
      return;
    }
    const fontOpts = toFont(opts.font);
    const lineHeight = fontOpts.lineHeight;
    const offset = lineHeight / 2 + this._padding.top;
    const {titleX, titleY, maxWidth, rotation} = this._drawArgs(offset);
    renderText(ctx, opts.text, 0, 0, fontOpts, {
      color: opts.color,
      maxWidth,
      rotation,
      textAlign: _toLeftRightCenter(opts.align),
      textBaseline: 'middle',
      translation: [titleX, titleY],
    });
  }
}
function createTitle(chart, titleOpts) {
  const title = new Title({
    ctx: chart.ctx,
    options: titleOpts,
    chart
  });
  layouts.configure(chart, title, titleOpts);
  layouts.addBox(chart, title);
  chart.titleBlock = title;
}
var plugin_title = {
  id: 'title',
  _element: Title,
  start(chart, _args, options) {
    createTitle(chart, options);
  },
  stop(chart) {
    const titleBlock = chart.titleBlock;
    layouts.removeBox(chart, titleBlock);
    delete chart.titleBlock;
  },
  beforeUpdate(chart, _args, options) {
    const title = chart.titleBlock;
    layouts.configure(chart, title, options);
    title.options = options;
  },
  defaults: {
    align: 'center',
    display: false,
    font: {
      weight: 'bold',
    },
    fullSize: true,
    padding: 10,
    position: 'top',
    text: '',
    weight: 2000
  },
  defaultRoutes: {
    color: 'color'
  },
  descriptors: {
    _scriptable: true,
    _indexable: false,
  },
};

const map = new WeakMap();
var plugin_subtitle = {
  id: 'subtitle',
  start(chart, _args, options) {
    const title = new Title({
      ctx: chart.ctx,
      options,
      chart
    });
    layouts.configure(chart, title, options);
    layouts.addBox(chart, title);
    map.set(chart, title);
  },
  stop(chart) {
    layouts.removeBox(chart, map.get(chart));
    map.delete(chart);
  },
  beforeUpdate(chart, _args, options) {
    const title = map.get(chart);
    layouts.configure(chart, title, options);
    title.options = options;
  },
  defaults: {
    align: 'center',
    display: false,
    font: {
      weight: 'normal',
    },
    fullSize: true,
    padding: 0,
    position: 'top',
    text: '',
    weight: 1500
  },
  defaultRoutes: {
    color: 'color'
  },
  descriptors: {
    _scriptable: true,
    _indexable: false,
  },
};

const positioners = {
  average(items) {
    if (!items.length) {
      return false;
    }
    let i, len;
    let x = 0;
    let y = 0;
    let count = 0;
    for (i = 0, len = items.length; i < len; ++i) {
      const el = items[i].element;
      if (el && el.hasValue()) {
        const pos = el.tooltipPosition();
        x += pos.x;
        y += pos.y;
        ++count;
      }
    }
    return {
      x: x / count,
      y: y / count
    };
  },
  nearest(items, eventPosition) {
    if (!items.length) {
      return false;
    }
    let x = eventPosition.x;
    let y = eventPosition.y;
    let minDistance = Number.POSITIVE_INFINITY;
    let i, len, nearestElement;
    for (i = 0, len = items.length; i < len; ++i) {
      const el = items[i].element;
      if (el && el.hasValue()) {
        const center = el.getCenterPoint();
        const d = distanceBetweenPoints(eventPosition, center);
        if (d < minDistance) {
          minDistance = d;
          nearestElement = el;
        }
      }
    }
    if (nearestElement) {
      const tp = nearestElement.tooltipPosition();
      x = tp.x;
      y = tp.y;
    }
    return {
      x,
      y
    };
  }
};
function pushOrConcat(base, toPush) {
  if (toPush) {
    if (isArray(toPush)) {
      Array.prototype.push.apply(base, toPush);
    } else {
      base.push(toPush);
    }
  }
  return base;
}
function splitNewlines(str) {
  if ((typeof str === 'string' || str instanceof String) && str.indexOf('\n') > -1) {
    return str.split('\n');
  }
  return str;
}
function createTooltipItem(chart, item) {
  const {element, datasetIndex, index} = item;
  const controller = chart.getDatasetMeta(datasetIndex).controller;
  const {label, value} = controller.getLabelAndValue(index);
  return {
    chart,
    label,
    parsed: controller.getParsed(index),
    raw: chart.data.datasets[datasetIndex].data[index],
    formattedValue: value,
    dataset: controller.getDataset(),
    dataIndex: index,
    datasetIndex,
    element
  };
}
function getTooltipSize(tooltip, options) {
  const ctx = tooltip.chart.ctx;
  const {body, footer, title} = tooltip;
  const {boxWidth, boxHeight} = options;
  const bodyFont = toFont(options.bodyFont);
  const titleFont = toFont(options.titleFont);
  const footerFont = toFont(options.footerFont);
  const titleLineCount = title.length;
  const footerLineCount = footer.length;
  const bodyLineItemCount = body.length;
  const padding = toPadding(options.padding);
  let height = padding.height;
  let width = 0;
  let combinedBodyLength = body.reduce((count, bodyItem) => count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
  combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
  if (titleLineCount) {
    height += titleLineCount * titleFont.lineHeight
			+ (titleLineCount - 1) * options.titleSpacing
			+ options.titleMarginBottom;
  }
  if (combinedBodyLength) {
    const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
    height += bodyLineItemCount * bodyLineHeight
			+ (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight
			+ (combinedBodyLength - 1) * options.bodySpacing;
  }
  if (footerLineCount) {
    height += options.footerMarginTop
			+ footerLineCount * footerFont.lineHeight
			+ (footerLineCount - 1) * options.footerSpacing;
  }
  let widthPadding = 0;
  const maxLineWidth = function(line) {
    width = Math.max(width, ctx.measureText(line).width + widthPadding);
  };
  ctx.save();
  ctx.font = titleFont.string;
  each(tooltip.title, maxLineWidth);
  ctx.font = bodyFont.string;
  each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
  widthPadding = options.displayColors ? (boxWidth + 2 + options.boxPadding) : 0;
  each(body, (bodyItem) => {
    each(bodyItem.before, maxLineWidth);
    each(bodyItem.lines, maxLineWidth);
    each(bodyItem.after, maxLineWidth);
  });
  widthPadding = 0;
  ctx.font = footerFont.string;
  each(tooltip.footer, maxLineWidth);
  ctx.restore();
  width += padding.width;
  return {width, height};
}
function determineYAlign(chart, size) {
  const {y, height} = size;
  if (y < height / 2) {
    return 'top';
  } else if (y > (chart.height - height / 2)) {
    return 'bottom';
  }
  return 'center';
}
function doesNotFitWithAlign(xAlign, chart, options, size) {
  const {x, width} = size;
  const caret = options.caretSize + options.caretPadding;
  if (xAlign === 'left' && x + width + caret > chart.width) {
    return true;
  }
  if (xAlign === 'right' && x - width - caret < 0) {
    return true;
  }
}
function determineXAlign(chart, options, size, yAlign) {
  const {x, width} = size;
  const {width: chartWidth, chartArea: {left, right}} = chart;
  let xAlign = 'center';
  if (yAlign === 'center') {
    xAlign = x <= (left + right) / 2 ? 'left' : 'right';
  } else if (x <= width / 2) {
    xAlign = 'left';
  } else if (x >= chartWidth - width / 2) {
    xAlign = 'right';
  }
  if (doesNotFitWithAlign(xAlign, chart, options, size)) {
    xAlign = 'center';
  }
  return xAlign;
}
function determineAlignment(chart, options, size) {
  const yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
  return {
    xAlign: size.xAlign || options.xAlign || determineXAlign(chart, options, size, yAlign),
    yAlign
  };
}
function alignX(size, xAlign) {
  let {x, width} = size;
  if (xAlign === 'right') {
    x -= width;
  } else if (xAlign === 'center') {
    x -= (width / 2);
  }
  return x;
}
function alignY(size, yAlign, paddingAndSize) {
  let {y, height} = size;
  if (yAlign === 'top') {
    y += paddingAndSize;
  } else if (yAlign === 'bottom') {
    y -= height + paddingAndSize;
  } else {
    y -= (height / 2);
  }
  return y;
}
function getBackgroundPoint(options, size, alignment, chart) {
  const {caretSize, caretPadding, cornerRadius} = options;
  const {xAlign, yAlign} = alignment;
  const paddingAndSize = caretSize + caretPadding;
  const {topLeft, topRight, bottomLeft, bottomRight} = toTRBLCorners(cornerRadius);
  let x = alignX(size, xAlign);
  const y = alignY(size, yAlign, paddingAndSize);
  if (yAlign === 'center') {
    if (xAlign === 'left') {
      x += paddingAndSize;
    } else if (xAlign === 'right') {
      x -= paddingAndSize;
    }
  } else if (xAlign === 'left') {
    x -= Math.max(topLeft, bottomLeft) + caretSize;
  } else if (xAlign === 'right') {
    x += Math.max(topRight, bottomRight) + caretSize;
  }
  return {
    x: _limitValue(x, 0, chart.width - size.width),
    y: _limitValue(y, 0, chart.height - size.height)
  };
}
function getAlignedX(tooltip, align, options) {
  const padding = toPadding(options.padding);
  return align === 'center'
    ? tooltip.x + tooltip.width / 2
    : align === 'right'
      ? tooltip.x + tooltip.width - padding.right
      : tooltip.x + padding.left;
}
function getBeforeAfterBodyLines(callback) {
  return pushOrConcat([], splitNewlines(callback));
}
function createTooltipContext(parent, tooltip, tooltipItems) {
  return createContext(parent, {
    tooltip,
    tooltipItems,
    type: 'tooltip'
  });
}
function overrideCallbacks(callbacks, context) {
  const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
  return override ? callbacks.override(override) : callbacks;
}
class Tooltip extends Element {
  constructor(config) {
    super();
    this.opacity = 0;
    this._active = [];
    this._eventPosition = undefined;
    this._size = undefined;
    this._cachedAnimations = undefined;
    this._tooltipItems = [];
    this.$animations = undefined;
    this.$context = undefined;
    this.chart = config.chart || config._chart;
    this._chart = this.chart;
    this.options = config.options;
    this.dataPoints = undefined;
    this.title = undefined;
    this.beforeBody = undefined;
    this.body = undefined;
    this.afterBody = undefined;
    this.footer = undefined;
    this.xAlign = undefined;
    this.yAlign = undefined;
    this.x = undefined;
    this.y = undefined;
    this.height = undefined;
    this.width = undefined;
    this.caretX = undefined;
    this.caretY = undefined;
    this.labelColors = undefined;
    this.labelPointStyles = undefined;
    this.labelTextColors = undefined;
  }
  initialize(options) {
    this.options = options;
    this._cachedAnimations = undefined;
    this.$context = undefined;
  }
  _resolveAnimations() {
    const cached = this._cachedAnimations;
    if (cached) {
      return cached;
    }
    const chart = this.chart;
    const options = this.options.setContext(this.getContext());
    const opts = options.enabled && chart.options.animation && options.animations;
    const animations = new Animations(this.chart, opts);
    if (opts._cacheable) {
      this._cachedAnimations = Object.freeze(animations);
    }
    return animations;
  }
  getContext() {
    return this.$context ||
			(this.$context = createTooltipContext(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(context, options) {
    const {callbacks} = options;
    const beforeTitle = callbacks.beforeTitle.apply(this, [context]);
    const title = callbacks.title.apply(this, [context]);
    const afterTitle = callbacks.afterTitle.apply(this, [context]);
    let lines = [];
    lines = pushOrConcat(lines, splitNewlines(beforeTitle));
    lines = pushOrConcat(lines, splitNewlines(title));
    lines = pushOrConcat(lines, splitNewlines(afterTitle));
    return lines;
  }
  getBeforeBody(tooltipItems, options) {
    return getBeforeAfterBodyLines(options.callbacks.beforeBody.apply(this, [tooltipItems]));
  }
  getBody(tooltipItems, options) {
    const {callbacks} = options;
    const bodyItems = [];
    each(tooltipItems, (context) => {
      const bodyItem = {
        before: [],
        lines: [],
        after: []
      };
      const scoped = overrideCallbacks(callbacks, context);
      pushOrConcat(bodyItem.before, splitNewlines(scoped.beforeLabel.call(this, context)));
      pushOrConcat(bodyItem.lines, scoped.label.call(this, context));
      pushOrConcat(bodyItem.after, splitNewlines(scoped.afterLabel.call(this, context)));
      bodyItems.push(bodyItem);
    });
    return bodyItems;
  }
  getAfterBody(tooltipItems, options) {
    return getBeforeAfterBodyLines(options.callbacks.afterBody.apply(this, [tooltipItems]));
  }
  getFooter(tooltipItems, options) {
    const {callbacks} = options;
    const beforeFooter = callbacks.beforeFooter.apply(this, [tooltipItems]);
    const footer = callbacks.footer.apply(this, [tooltipItems]);
    const afterFooter = callbacks.afterFooter.apply(this, [tooltipItems]);
    let lines = [];
    lines = pushOrConcat(lines, splitNewlines(beforeFooter));
    lines = pushOrConcat(lines, splitNewlines(footer));
    lines = pushOrConcat(lines, splitNewlines(afterFooter));
    return lines;
  }
  _createItems(options) {
    const active = this._active;
    const data = this.chart.data;
    const labelColors = [];
    const labelPointStyles = [];
    const labelTextColors = [];
    let tooltipItems = [];
    let i, len;
    for (i = 0, len = active.length; i < len; ++i) {
      tooltipItems.push(createTooltipItem(this.chart, active[i]));
    }
    if (options.filter) {
      tooltipItems = tooltipItems.filter((element, index, array) => options.filter(element, index, array, data));
    }
    if (options.itemSort) {
      tooltipItems = tooltipItems.sort((a, b) => options.itemSort(a, b, data));
    }
    each(tooltipItems, (context) => {
      const scoped = overrideCallbacks(options.callbacks, context);
      labelColors.push(scoped.labelColor.call(this, context));
      labelPointStyles.push(scoped.labelPointStyle.call(this, context));
      labelTextColors.push(scoped.labelTextColor.call(this, context));
    });
    this.labelColors = labelColors;
    this.labelPointStyles = labelPointStyles;
    this.labelTextColors = labelTextColors;
    this.dataPoints = tooltipItems;
    return tooltipItems;
  }
  update(changed, replay) {
    const options = this.options.setContext(this.getContext());
    const active = this._active;
    let properties;
    let tooltipItems = [];
    if (!active.length) {
      if (this.opacity !== 0) {
        properties = {
          opacity: 0
        };
      }
    } else {
      const position = positioners[options.position].call(this, active, this._eventPosition);
      tooltipItems = this._createItems(options);
      this.title = this.getTitle(tooltipItems, options);
      this.beforeBody = this.getBeforeBody(tooltipItems, options);
      this.body = this.getBody(tooltipItems, options);
      this.afterBody = this.getAfterBody(tooltipItems, options);
      this.footer = this.getFooter(tooltipItems, options);
      const size = this._size = getTooltipSize(this, options);
      const positionAndSize = Object.assign({}, position, size);
      const alignment = determineAlignment(this.chart, options, positionAndSize);
      const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
      this.xAlign = alignment.xAlign;
      this.yAlign = alignment.yAlign;
      properties = {
        opacity: 1,
        x: backgroundPoint.x,
        y: backgroundPoint.y,
        width: size.width,
        height: size.height,
        caretX: position.x,
        caretY: position.y
      };
    }
    this._tooltipItems = tooltipItems;
    this.$context = undefined;
    if (properties) {
      this._resolveAnimations().update(this, properties);
    }
    if (changed && options.external) {
      options.external.call(this, {chart: this.chart, tooltip: this, replay});
    }
  }
  drawCaret(tooltipPoint, ctx, size, options) {
    const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
    ctx.lineTo(caretPosition.x1, caretPosition.y1);
    ctx.lineTo(caretPosition.x2, caretPosition.y2);
    ctx.lineTo(caretPosition.x3, caretPosition.y3);
  }
  getCaretPosition(tooltipPoint, size, options) {
    const {xAlign, yAlign} = this;
    const {caretSize, cornerRadius} = options;
    const {topLeft, topRight, bottomLeft, bottomRight} = toTRBLCorners(cornerRadius);
    const {x: ptX, y: ptY} = tooltipPoint;
    const {width, height} = size;
    let x1, x2, x3, y1, y2, y3;
    if (yAlign === 'center') {
      y2 = ptY + (height / 2);
      if (xAlign === 'left') {
        x1 = ptX;
        x2 = x1 - caretSize;
        y1 = y2 + caretSize;
        y3 = y2 - caretSize;
      } else {
        x1 = ptX + width;
        x2 = x1 + caretSize;
        y1 = y2 - caretSize;
        y3 = y2 + caretSize;
      }
      x3 = x1;
    } else {
      if (xAlign === 'left') {
        x2 = ptX + Math.max(topLeft, bottomLeft) + (caretSize);
      } else if (xAlign === 'right') {
        x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
      } else {
        x2 = this.caretX;
      }
      if (yAlign === 'top') {
        y1 = ptY;
        y2 = y1 - caretSize;
        x1 = x2 - caretSize;
        x3 = x2 + caretSize;
      } else {
        y1 = ptY + height;
        y2 = y1 + caretSize;
        x1 = x2 + caretSize;
        x3 = x2 - caretSize;
      }
      y3 = y1;
    }
    return {x1, x2, x3, y1, y2, y3};
  }
  drawTitle(pt, ctx, options) {
    const title = this.title;
    const length = title.length;
    let titleFont, titleSpacing, i;
    if (length) {
      const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
      pt.x = getAlignedX(this, options.titleAlign, options);
      ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
      ctx.textBaseline = 'middle';
      titleFont = toFont(options.titleFont);
      titleSpacing = options.titleSpacing;
      ctx.fillStyle = options.titleColor;
      ctx.font = titleFont.string;
      for (i = 0; i < length; ++i) {
        ctx.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
        pt.y += titleFont.lineHeight + titleSpacing;
        if (i + 1 === length) {
          pt.y += options.titleMarginBottom - titleSpacing;
        }
      }
    }
  }
  _drawColorBox(ctx, pt, i, rtlHelper, options) {
    const labelColors = this.labelColors[i];
    const labelPointStyle = this.labelPointStyles[i];
    const {boxHeight, boxWidth, boxPadding} = options;
    const bodyFont = toFont(options.bodyFont);
    const colorX = getAlignedX(this, 'left', options);
    const rtlColorX = rtlHelper.x(colorX);
    const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
    const colorY = pt.y + yOffSet;
    if (options.usePointStyle) {
      const drawOptions = {
        radius: Math.min(boxWidth, boxHeight) / 2,
        pointStyle: labelPointStyle.pointStyle,
        rotation: labelPointStyle.rotation,
        borderWidth: 1
      };
      const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
      const centerY = colorY + boxHeight / 2;
      ctx.strokeStyle = options.multiKeyBackground;
      ctx.fillStyle = options.multiKeyBackground;
      drawPoint(ctx, drawOptions, centerX, centerY);
      ctx.strokeStyle = labelColors.borderColor;
      ctx.fillStyle = labelColors.backgroundColor;
      drawPoint(ctx, drawOptions, centerX, centerY);
    } else {
      ctx.lineWidth = labelColors.borderWidth || 1;
      ctx.strokeStyle = labelColors.borderColor;
      ctx.setLineDash(labelColors.borderDash || []);
      ctx.lineDashOffset = labelColors.borderDashOffset || 0;
      const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth - boxPadding);
      const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - boxPadding - 2);
      const borderRadius = toTRBLCorners(labelColors.borderRadius);
      if (Object.values(borderRadius).some(v => v !== 0)) {
        ctx.beginPath();
        ctx.fillStyle = options.multiKeyBackground;
        addRoundedRectPath(ctx, {
          x: outerX,
          y: colorY,
          w: boxWidth,
          h: boxHeight,
          radius: borderRadius,
        });
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = labelColors.backgroundColor;
        ctx.beginPath();
        addRoundedRectPath(ctx, {
          x: innerX,
          y: colorY + 1,
          w: boxWidth - 2,
          h: boxHeight - 2,
          radius: borderRadius,
        });
        ctx.fill();
      } else {
        ctx.fillStyle = options.multiKeyBackground;
        ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
        ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
        ctx.fillStyle = labelColors.backgroundColor;
        ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
      }
    }
    ctx.fillStyle = this.labelTextColors[i];
  }
  drawBody(pt, ctx, options) {
    const {body} = this;
    const {bodySpacing, bodyAlign, displayColors, boxHeight, boxWidth, boxPadding} = options;
    const bodyFont = toFont(options.bodyFont);
    let bodyLineHeight = bodyFont.lineHeight;
    let xLinePadding = 0;
    const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
    const fillLineOfText = function(line) {
      ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
      pt.y += bodyLineHeight + bodySpacing;
    };
    const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
    let bodyItem, textColor, lines, i, j, ilen, jlen;
    ctx.textAlign = bodyAlign;
    ctx.textBaseline = 'middle';
    ctx.font = bodyFont.string;
    pt.x = getAlignedX(this, bodyAlignForCalculation, options);
    ctx.fillStyle = options.bodyColor;
    each(this.beforeBody, fillLineOfText);
    xLinePadding = displayColors && bodyAlignForCalculation !== 'right'
      ? bodyAlign === 'center' ? (boxWidth / 2 + boxPadding) : (boxWidth + 2 + boxPadding)
      : 0;
    for (i = 0, ilen = body.length; i < ilen; ++i) {
      bodyItem = body[i];
      textColor = this.labelTextColors[i];
      ctx.fillStyle = textColor;
      each(bodyItem.before, fillLineOfText);
      lines = bodyItem.lines;
      if (displayColors && lines.length) {
        this._drawColorBox(ctx, pt, i, rtlHelper, options);
        bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
      }
      for (j = 0, jlen = lines.length; j < jlen; ++j) {
        fillLineOfText(lines[j]);
        bodyLineHeight = bodyFont.lineHeight;
      }
      each(bodyItem.after, fillLineOfText);
    }
    xLinePadding = 0;
    bodyLineHeight = bodyFont.lineHeight;
    each(this.afterBody, fillLineOfText);
    pt.y -= bodySpacing;
  }
  drawFooter(pt, ctx, options) {
    const footer = this.footer;
    const length = footer.length;
    let footerFont, i;
    if (length) {
      const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
      pt.x = getAlignedX(this, options.footerAlign, options);
      pt.y += options.footerMarginTop;
      ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
      ctx.textBaseline = 'middle';
      footerFont = toFont(options.footerFont);
      ctx.fillStyle = options.footerColor;
      ctx.font = footerFont.string;
      for (i = 0; i < length; ++i) {
        ctx.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
        pt.y += footerFont.lineHeight + options.footerSpacing;
      }
    }
  }
  drawBackground(pt, ctx, tooltipSize, options) {
    const {xAlign, yAlign} = this;
    const {x, y} = pt;
    const {width, height} = tooltipSize;
    const {topLeft, topRight, bottomLeft, bottomRight} = toTRBLCorners(options.cornerRadius);
    ctx.fillStyle = options.backgroundColor;
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.beginPath();
    ctx.moveTo(x + topLeft, y);
    if (yAlign === 'top') {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x + width - topRight, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
    if (yAlign === 'center' && xAlign === 'right') {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x + width, y + height - bottomRight);
    ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
    if (yAlign === 'bottom') {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x + bottomLeft, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
    if (yAlign === 'center' && xAlign === 'left') {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x, y + topLeft);
    ctx.quadraticCurveTo(x, y, x + topLeft, y);
    ctx.closePath();
    ctx.fill();
    if (options.borderWidth > 0) {
      ctx.stroke();
    }
  }
  _updateAnimationTarget(options) {
    const chart = this.chart;
    const anims = this.$animations;
    const animX = anims && anims.x;
    const animY = anims && anims.y;
    if (animX || animY) {
      const position = positioners[options.position].call(this, this._active, this._eventPosition);
      if (!position) {
        return;
      }
      const size = this._size = getTooltipSize(this, options);
      const positionAndSize = Object.assign({}, position, this._size);
      const alignment = determineAlignment(chart, options, positionAndSize);
      const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
      if (animX._to !== point.x || animY._to !== point.y) {
        this.xAlign = alignment.xAlign;
        this.yAlign = alignment.yAlign;
        this.width = size.width;
        this.height = size.height;
        this.caretX = position.x;
        this.caretY = position.y;
        this._resolveAnimations().update(this, point);
      }
    }
  }
  draw(ctx) {
    const options = this.options.setContext(this.getContext());
    let opacity = this.opacity;
    if (!opacity) {
      return;
    }
    this._updateAnimationTarget(options);
    const tooltipSize = {
      width: this.width,
      height: this.height
    };
    const pt = {
      x: this.x,
      y: this.y
    };
    opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
    const padding = toPadding(options.padding);
    const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    if (options.enabled && hasTooltipContent) {
      ctx.save();
      ctx.globalAlpha = opacity;
      this.drawBackground(pt, ctx, tooltipSize, options);
      overrideTextDirection(ctx, options.textDirection);
      pt.y += padding.top;
      this.drawTitle(pt, ctx, options);
      this.drawBody(pt, ctx, options);
      this.drawFooter(pt, ctx, options);
      restoreTextDirection(ctx, options.textDirection);
      ctx.restore();
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(activeElements, eventPosition) {
    const lastActive = this._active;
    const active = activeElements.map(({datasetIndex, index}) => {
      const meta = this.chart.getDatasetMeta(datasetIndex);
      if (!meta) {
        throw new Error('Cannot find a dataset at index ' + datasetIndex);
      }
      return {
        datasetIndex,
        element: meta.data[index],
        index,
      };
    });
    const changed = !_elementsEqual(lastActive, active);
    const positionChanged = this._positionChanged(active, eventPosition);
    if (changed || positionChanged) {
      this._active = active;
      this._eventPosition = eventPosition;
      this._ignoreReplayEvents = true;
      this.update(true);
    }
  }
  handleEvent(e, replay, inChartArea = true) {
    if (replay && this._ignoreReplayEvents) {
      return false;
    }
    this._ignoreReplayEvents = false;
    const options = this.options;
    const lastActive = this._active || [];
    const active = this._getActiveElements(e, lastActive, replay, inChartArea);
    const positionChanged = this._positionChanged(active, e);
    const changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
    if (changed) {
      this._active = active;
      if (options.enabled || options.external) {
        this._eventPosition = {
          x: e.x,
          y: e.y
        };
        this.update(true, replay);
      }
    }
    return changed;
  }
  _getActiveElements(e, lastActive, replay, inChartArea) {
    const options = this.options;
    if (e.type === 'mouseout') {
      return [];
    }
    if (!inChartArea) {
      return lastActive;
    }
    const active = this.chart.getElementsAtEventForMode(e, options.mode, options, replay);
    if (options.reverse) {
      active.reverse();
    }
    return active;
  }
  _positionChanged(active, e) {
    const {caretX, caretY, options} = this;
    const position = positioners[options.position].call(this, active, e);
    return position !== false && (caretX !== position.x || caretY !== position.y);
  }
}
Tooltip.positioners = positioners;
var plugin_tooltip = {
  id: 'tooltip',
  _element: Tooltip,
  positioners,
  afterInit(chart, _args, options) {
    if (options) {
      chart.tooltip = new Tooltip({chart, options});
    }
  },
  beforeUpdate(chart, _args, options) {
    if (chart.tooltip) {
      chart.tooltip.initialize(options);
    }
  },
  reset(chart, _args, options) {
    if (chart.tooltip) {
      chart.tooltip.initialize(options);
    }
  },
  afterDraw(chart) {
    const tooltip = chart.tooltip;
    const args = {
      tooltip
    };
    if (chart.notifyPlugins('beforeTooltipDraw', args) === false) {
      return;
    }
    if (tooltip) {
      tooltip.draw(chart.ctx);
    }
    chart.notifyPlugins('afterTooltipDraw', args);
  },
  afterEvent(chart, args) {
    if (chart.tooltip) {
      const useFinalPosition = args.replay;
      if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
        args.changed = true;
      }
    }
  },
  defaults: {
    enabled: true,
    external: null,
    position: 'average',
    backgroundColor: 'rgba(0,0,0,0.8)',
    titleColor: '#fff',
    titleFont: {
      weight: 'bold',
    },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: 'left',
    bodyColor: '#fff',
    bodySpacing: 2,
    bodyFont: {
    },
    bodyAlign: 'left',
    footerColor: '#fff',
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: {
      weight: 'bold',
    },
    footerAlign: 'left',
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (ctx, opts) => opts.bodyFont.size,
    boxWidth: (ctx, opts) => opts.bodyFont.size,
    multiKeyBackground: '#fff',
    displayColors: true,
    boxPadding: 0,
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    animation: {
      duration: 400,
      easing: 'easeOutQuart',
    },
    animations: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'width', 'height', 'caretX', 'caretY'],
      },
      opacity: {
        easing: 'linear',
        duration: 200
      }
    },
    callbacks: {
      beforeTitle: noop,
      title(tooltipItems) {
        if (tooltipItems.length > 0) {
          const item = tooltipItems[0];
          const labels = item.chart.data.labels;
          const labelCount = labels ? labels.length : 0;
          if (this && this.options && this.options.mode === 'dataset') {
            return item.dataset.label || '';
          } else if (item.label) {
            return item.label;
          } else if (labelCount > 0 && item.dataIndex < labelCount) {
            return labels[item.dataIndex];
          }
        }
        return '';
      },
      afterTitle: noop,
      beforeBody: noop,
      beforeLabel: noop,
      label(tooltipItem) {
        if (this && this.options && this.options.mode === 'dataset') {
          return tooltipItem.label + ': ' + tooltipItem.formattedValue || tooltipItem.formattedValue;
        }
        let label = tooltipItem.dataset.label || '';
        if (label) {
          label += ': ';
        }
        const value = tooltipItem.formattedValue;
        if (!isNullOrUndef(value)) {
          label += value;
        }
        return label;
      },
      labelColor(tooltipItem) {
        const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
        const options = meta.controller.getStyle(tooltipItem.dataIndex);
        return {
          borderColor: options.borderColor,
          backgroundColor: options.backgroundColor,
          borderWidth: options.borderWidth,
          borderDash: options.borderDash,
          borderDashOffset: options.borderDashOffset,
          borderRadius: 0,
        };
      },
      labelTextColor() {
        return this.options.bodyColor;
      },
      labelPointStyle(tooltipItem) {
        const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
        const options = meta.controller.getStyle(tooltipItem.dataIndex);
        return {
          pointStyle: options.pointStyle,
          rotation: options.rotation,
        };
      },
      afterLabel: noop,
      afterBody: noop,
      beforeFooter: noop,
      footer: noop,
      afterFooter: noop
    }
  },
  defaultRoutes: {
    bodyFont: 'font',
    footerFont: 'font',
    titleFont: 'font'
  },
  descriptors: {
    _scriptable: (name) => name !== 'filter' && name !== 'itemSort' && name !== 'external',
    _indexable: false,
    callbacks: {
      _scriptable: false,
      _indexable: false,
    },
    animation: {
      _fallback: false
    },
    animations: {
      _fallback: 'animation'
    }
  },
  additionalOptionScopes: ['interaction']
};

var plugins = /*#__PURE__*/Object.freeze({
__proto__: null,
Decimation: plugin_decimation,
Filler: plugin_filler,
Legend: plugin_legend,
SubTitle: plugin_subtitle,
Title: plugin_title,
Tooltip: plugin_tooltip
});

const addIfString = (labels, raw, index, addedLabels) => {
  if (typeof raw === 'string') {
    index = labels.push(raw) - 1;
    addedLabels.unshift({index, label: raw});
  } else if (isNaN(raw)) {
    index = null;
  }
  return index;
};
function findOrAddLabel(labels, raw, index, addedLabels) {
  const first = labels.indexOf(raw);
  if (first === -1) {
    return addIfString(labels, raw, index, addedLabels);
  }
  const last = labels.lastIndexOf(raw);
  return first !== last ? index : first;
}
const validIndex = (index, max) => index === null ? null : _limitValue(Math.round(index), 0, max);
class CategoryScale extends Scale {
  constructor(cfg) {
    super(cfg);
    this._startValue = undefined;
    this._valueRange = 0;
    this._addedLabels = [];
  }
  init(scaleOptions) {
    const added = this._addedLabels;
    if (added.length) {
      const labels = this.getLabels();
      for (const {index, label} of added) {
        if (labels[index] === label) {
          labels.splice(index, 1);
        }
      }
      this._addedLabels = [];
    }
    super.init(scaleOptions);
  }
  parse(raw, index) {
    if (isNullOrUndef(raw)) {
      return null;
    }
    const labels = this.getLabels();
    index = isFinite(index) && labels[index] === raw ? index
      : findOrAddLabel(labels, raw, valueOrDefault(index, raw), this._addedLabels);
    return validIndex(index, labels.length - 1);
  }
  determineDataLimits() {
    const {minDefined, maxDefined} = this.getUserBounds();
    let {min, max} = this.getMinMax(true);
    if (this.options.bounds === 'ticks') {
      if (!minDefined) {
        min = 0;
      }
      if (!maxDefined) {
        max = this.getLabels().length - 1;
      }
    }
    this.min = min;
    this.max = max;
  }
  buildTicks() {
    const min = this.min;
    const max = this.max;
    const offset = this.options.offset;
    const ticks = [];
    let labels = this.getLabels();
    labels = (min === 0 && max === labels.length - 1) ? labels : labels.slice(min, max + 1);
    this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
    this._startValue = this.min - (offset ? 0.5 : 0);
    for (let value = min; value <= max; value++) {
      ticks.push({value});
    }
    return ticks;
  }
  getLabelForValue(value) {
    const labels = this.getLabels();
    if (value >= 0 && value < labels.length) {
      return labels[value];
    }
    return value;
  }
  configure() {
    super.configure();
    if (!this.isHorizontal()) {
      this._reversePixels = !this._reversePixels;
    }
  }
  getPixelForValue(value) {
    if (typeof value !== 'number') {
      value = this.parse(value);
    }
    return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
  }
  getPixelForTick(index) {
    const ticks = this.ticks;
    if (index < 0 || index > ticks.length - 1) {
      return null;
    }
    return this.getPixelForValue(ticks[index].value);
  }
  getValueForPixel(pixel) {
    return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
  }
  getBasePixel() {
    return this.bottom;
  }
}
CategoryScale.id = 'category';
CategoryScale.defaults = {
  ticks: {
    callback: CategoryScale.prototype.getLabelForValue
  }
};

function generateTicks$1(generationOptions, dataRange) {
  const ticks = [];
  const MIN_SPACING = 1e-14;
  const {bounds, step, min, max, precision, count, maxTicks, maxDigits, includeBounds} = generationOptions;
  const unit = step || 1;
  const maxSpaces = maxTicks - 1;
  const {min: rmin, max: rmax} = dataRange;
  const minDefined = !isNullOrUndef(min);
  const maxDefined = !isNullOrUndef(max);
  const countDefined = !isNullOrUndef(count);
  const minSpacing = (rmax - rmin) / (maxDigits + 1);
  let spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
  let factor, niceMin, niceMax, numSpaces;
  if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
    return [{value: rmin}, {value: rmax}];
  }
  numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
  if (numSpaces > maxSpaces) {
    spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
  }
  if (!isNullOrUndef(precision)) {
    factor = Math.pow(10, precision);
    spacing = Math.ceil(spacing * factor) / factor;
  }
  if (bounds === 'ticks') {
    niceMin = Math.floor(rmin / spacing) * spacing;
    niceMax = Math.ceil(rmax / spacing) * spacing;
  } else {
    niceMin = rmin;
    niceMax = rmax;
  }
  if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1000)) {
    numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
    spacing = (max - min) / numSpaces;
    niceMin = min;
    niceMax = max;
  } else if (countDefined) {
    niceMin = minDefined ? min : niceMin;
    niceMax = maxDefined ? max : niceMax;
    numSpaces = count - 1;
    spacing = (niceMax - niceMin) / numSpaces;
  } else {
    numSpaces = (niceMax - niceMin) / spacing;
    if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
      numSpaces = Math.round(numSpaces);
    } else {
      numSpaces = Math.ceil(numSpaces);
    }
  }
  const decimalPlaces = Math.max(
    _decimalPlaces(spacing),
    _decimalPlaces(niceMin)
  );
  factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
  niceMin = Math.round(niceMin * factor) / factor;
  niceMax = Math.round(niceMax * factor) / factor;
  let j = 0;
  if (minDefined) {
    if (includeBounds && niceMin !== min) {
      ticks.push({value: min});
      if (niceMin < min) {
        j++;
      }
      if (almostEquals(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
        j++;
      }
    } else if (niceMin < min) {
      j++;
    }
  }
  for (; j < numSpaces; ++j) {
    ticks.push({value: Math.round((niceMin + j * spacing) * factor) / factor});
  }
  if (maxDefined && includeBounds && niceMax !== max) {
    if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
      ticks[ticks.length - 1].value = max;
    } else {
      ticks.push({value: max});
    }
  } else if (!maxDefined || niceMax === max) {
    ticks.push({value: niceMax});
  }
  return ticks;
}
function relativeLabelSize(value, minSpacing, {horizontal, minRotation}) {
  const rad = toRadians(minRotation);
  const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 0.001;
  const length = 0.75 * minSpacing * ('' + value).length;
  return Math.min(minSpacing / ratio, length);
}
class LinearScaleBase extends Scale {
  constructor(cfg) {
    super(cfg);
    this.start = undefined;
    this.end = undefined;
    this._startValue = undefined;
    this._endValue = undefined;
    this._valueRange = 0;
  }
  parse(raw, index) {
    if (isNullOrUndef(raw)) {
      return null;
    }
    if ((typeof raw === 'number' || raw instanceof Number) && !isFinite(+raw)) {
      return null;
    }
    return +raw;
  }
  handleTickRangeOptions() {
    const {beginAtZero} = this.options;
    const {minDefined, maxDefined} = this.getUserBounds();
    let {min, max} = this;
    const setMin = v => (min = minDefined ? min : v);
    const setMax = v => (max = maxDefined ? max : v);
    if (beginAtZero) {
      const minSign = sign(min);
      const maxSign = sign(max);
      if (minSign < 0 && maxSign < 0) {
        setMax(0);
      } else if (minSign > 0 && maxSign > 0) {
        setMin(0);
      }
    }
    if (min === max) {
      let offset = 1;
      if (max >= Number.MAX_SAFE_INTEGER || min <= Number.MIN_SAFE_INTEGER) {
        offset = Math.abs(max * 0.05);
      }
      setMax(max + offset);
      if (!beginAtZero) {
        setMin(min - offset);
      }
    }
    this.min = min;
    this.max = max;
  }
  getTickLimit() {
    const tickOpts = this.options.ticks;
    let {maxTicksLimit, stepSize} = tickOpts;
    let maxTicks;
    if (stepSize) {
      maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
      if (maxTicks > 1000) {
        console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`);
        maxTicks = 1000;
      }
    } else {
      maxTicks = this.computeTickLimit();
      maxTicksLimit = maxTicksLimit || 11;
    }
    if (maxTicksLimit) {
      maxTicks = Math.min(maxTicksLimit, maxTicks);
    }
    return maxTicks;
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const opts = this.options;
    const tickOpts = opts.ticks;
    let maxTicks = this.getTickLimit();
    maxTicks = Math.max(2, maxTicks);
    const numericGeneratorOptions = {
      maxTicks,
      bounds: opts.bounds,
      min: opts.min,
      max: opts.max,
      precision: tickOpts.precision,
      step: tickOpts.stepSize,
      count: tickOpts.count,
      maxDigits: this._maxDigits(),
      horizontal: this.isHorizontal(),
      minRotation: tickOpts.minRotation || 0,
      includeBounds: tickOpts.includeBounds !== false
    };
    const dataRange = this._range || this;
    const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
    if (opts.bounds === 'ticks') {
      _setMinAndMaxByKey(ticks, this, 'value');
    }
    if (opts.reverse) {
      ticks.reverse();
      this.start = this.max;
      this.end = this.min;
    } else {
      this.start = this.min;
      this.end = this.max;
    }
    return ticks;
  }
  configure() {
    const ticks = this.ticks;
    let start = this.min;
    let end = this.max;
    super.configure();
    if (this.options.offset && ticks.length) {
      const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
      start -= offset;
      end += offset;
    }
    this._startValue = start;
    this._endValue = end;
    this._valueRange = end - start;
  }
  getLabelForValue(value) {
    return formatNumber(value, this.chart.options.locale, this.options.ticks.format);
  }
}

class LinearScale extends LinearScaleBase {
  determineDataLimits() {
    const {min, max} = this.getMinMax(true);
    this.min = isNumberFinite(min) ? min : 0;
    this.max = isNumberFinite(max) ? max : 1;
    this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const horizontal = this.isHorizontal();
    const length = horizontal ? this.width : this.height;
    const minRotation = toRadians(this.options.ticks.minRotation);
    const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 0.001;
    const tickFont = this._resolveTickFontOptions(0);
    return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
  }
  getPixelForValue(value) {
    return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
  }
  getValueForPixel(pixel) {
    return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
  }
}
LinearScale.id = 'linear';
LinearScale.defaults = {
  ticks: {
    callback: Ticks.formatters.numeric
  }
};

function isMajor(tickVal) {
  const remain = tickVal / (Math.pow(10, Math.floor(log10(tickVal))));
  return remain === 1;
}
function generateTicks(generationOptions, dataRange) {
  const endExp = Math.floor(log10(dataRange.max));
  const endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp));
  const ticks = [];
  let tickVal = finiteOrDefault(generationOptions.min, Math.pow(10, Math.floor(log10(dataRange.min))));
  let exp = Math.floor(log10(tickVal));
  let significand = Math.floor(tickVal / Math.pow(10, exp));
  let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
  do {
    ticks.push({value: tickVal, major: isMajor(tickVal)});
    ++significand;
    if (significand === 10) {
      significand = 1;
      ++exp;
      precision = exp >= 0 ? 1 : precision;
    }
    tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
  } while (exp < endExp || (exp === endExp && significand < endSignificand));
  const lastTick = finiteOrDefault(generationOptions.max, tickVal);
  ticks.push({value: lastTick, major: isMajor(tickVal)});
  return ticks;
}
class LogarithmicScale extends Scale {
  constructor(cfg) {
    super(cfg);
    this.start = undefined;
    this.end = undefined;
    this._startValue = undefined;
    this._valueRange = 0;
  }
  parse(raw, index) {
    const value = LinearScaleBase.prototype.parse.apply(this, [raw, index]);
    if (value === 0) {
      this._zero = true;
      return undefined;
    }
    return isNumberFinite(value) && value > 0 ? value : null;
  }
  determineDataLimits() {
    const {min, max} = this.getMinMax(true);
    this.min = isNumberFinite(min) ? Math.max(0, min) : null;
    this.max = isNumberFinite(max) ? Math.max(0, max) : null;
    if (this.options.beginAtZero) {
      this._zero = true;
    }
    this.handleTickRangeOptions();
  }
  handleTickRangeOptions() {
    const {minDefined, maxDefined} = this.getUserBounds();
    let min = this.min;
    let max = this.max;
    const setMin = v => (min = minDefined ? min : v);
    const setMax = v => (max = maxDefined ? max : v);
    const exp = (v, m) => Math.pow(10, Math.floor(log10(v)) + m);
    if (min === max) {
      if (min <= 0) {
        setMin(1);
        setMax(10);
      } else {
        setMin(exp(min, -1));
        setMax(exp(max, 1));
      }
    }
    if (min <= 0) {
      setMin(exp(max, -1));
    }
    if (max <= 0) {
      setMax(exp(min, 1));
    }
    if (this._zero && this.min !== this._suggestedMin && min === exp(this.min, 0)) {
      setMin(exp(min, -1));
    }
    this.min = min;
    this.max = max;
  }
  buildTicks() {
    const opts = this.options;
    const generationOptions = {
      min: this._userMin,
      max: this._userMax
    };
    const ticks = generateTicks(generationOptions, this);
    if (opts.bounds === 'ticks') {
      _setMinAndMaxByKey(ticks, this, 'value');
    }
    if (opts.reverse) {
      ticks.reverse();
      this.start = this.max;
      this.end = this.min;
    } else {
      this.start = this.min;
      this.end = this.max;
    }
    return ticks;
  }
  getLabelForValue(value) {
    return value === undefined
      ? '0'
      : formatNumber(value, this.chart.options.locale, this.options.ticks.format);
  }
  configure() {
    const start = this.min;
    super.configure();
    this._startValue = log10(start);
    this._valueRange = log10(this.max) - log10(start);
  }
  getPixelForValue(value) {
    if (value === undefined || value === 0) {
      value = this.min;
    }
    if (value === null || isNaN(value)) {
      return NaN;
    }
    return this.getPixelForDecimal(value === this.min
      ? 0
      : (log10(value) - this._startValue) / this._valueRange);
  }
  getValueForPixel(pixel) {
    const decimal = this.getDecimalForPixel(pixel);
    return Math.pow(10, this._startValue + decimal * this._valueRange);
  }
}
LogarithmicScale.id = 'logarithmic';
LogarithmicScale.defaults = {
  ticks: {
    callback: Ticks.formatters.logarithmic,
    major: {
      enabled: true
    }
  }
};

function getTickBackdropHeight(opts) {
  const tickOpts = opts.ticks;
  if (tickOpts.display && opts.display) {
    const padding = toPadding(tickOpts.backdropPadding);
    return valueOrDefault(tickOpts.font && tickOpts.font.size, defaults.font.size) + padding.height;
  }
  return 0;
}
function measureLabelSize(ctx, font, label) {
  label = isArray(label) ? label : [label];
  return {
    w: _longestText(ctx, font.string, label),
    h: label.length * font.lineHeight
  };
}
function determineLimits(angle, pos, size, min, max) {
  if (angle === min || angle === max) {
    return {
      start: pos - (size / 2),
      end: pos + (size / 2)
    };
  } else if (angle < min || angle > max) {
    return {
      start: pos - size,
      end: pos
    };
  }
  return {
    start: pos,
    end: pos + size
  };
}
function fitWithPointLabels(scale) {
  const orig = {
    l: scale.left + scale._padding.left,
    r: scale.right - scale._padding.right,
    t: scale.top + scale._padding.top,
    b: scale.bottom - scale._padding.bottom
  };
  const limits = Object.assign({}, orig);
  const labelSizes = [];
  const padding = [];
  const valueCount = scale._pointLabels.length;
  const pointLabelOpts = scale.options.pointLabels;
  const additionalAngle = pointLabelOpts.centerPointLabels ? PI / valueCount : 0;
  for (let i = 0; i < valueCount; i++) {
    const opts = pointLabelOpts.setContext(scale.getPointLabelContext(i));
    padding[i] = opts.padding;
    const pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i], additionalAngle);
    const plFont = toFont(opts.font);
    const textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i]);
    labelSizes[i] = textSize;
    const angleRadians = _normalizeAngle(scale.getIndexAngle(i) + additionalAngle);
    const angle = Math.round(toDegrees(angleRadians));
    const hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
    const vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
    updateLimits(limits, orig, angleRadians, hLimits, vLimits);
  }
  scale.setCenterPoint(
    orig.l - limits.l,
    limits.r - orig.r,
    orig.t - limits.t,
    limits.b - orig.b
  );
  scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
}
function updateLimits(limits, orig, angle, hLimits, vLimits) {
  const sin = Math.abs(Math.sin(angle));
  const cos = Math.abs(Math.cos(angle));
  let x = 0;
  let y = 0;
  if (hLimits.start < orig.l) {
    x = (orig.l - hLimits.start) / sin;
    limits.l = Math.min(limits.l, orig.l - x);
  } else if (hLimits.end > orig.r) {
    x = (hLimits.end - orig.r) / sin;
    limits.r = Math.max(limits.r, orig.r + x);
  }
  if (vLimits.start < orig.t) {
    y = (orig.t - vLimits.start) / cos;
    limits.t = Math.min(limits.t, orig.t - y);
  } else if (vLimits.end > orig.b) {
    y = (vLimits.end - orig.b) / cos;
    limits.b = Math.max(limits.b, orig.b + y);
  }
}
function buildPointLabelItems(scale, labelSizes, padding) {
  const items = [];
  const valueCount = scale._pointLabels.length;
  const opts = scale.options;
  const extra = getTickBackdropHeight(opts) / 2;
  const outerDistance = scale.drawingArea;
  const additionalAngle = opts.pointLabels.centerPointLabels ? PI / valueCount : 0;
  for (let i = 0; i < valueCount; i++) {
    const pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + padding[i], additionalAngle);
    const angle = Math.round(toDegrees(_normalizeAngle(pointLabelPosition.angle + HALF_PI)));
    const size = labelSizes[i];
    const y = yForAngle(pointLabelPosition.y, size.h, angle);
    const textAlign = getTextAlignForAngle(angle);
    const left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
    items.push({
      x: pointLabelPosition.x,
      y,
      textAlign,
      left,
      top: y,
      right: left + size.w,
      bottom: y + size.h
    });
  }
  return items;
}
function getTextAlignForAngle(angle) {
  if (angle === 0 || angle === 180) {
    return 'center';
  } else if (angle < 180) {
    return 'left';
  }
  return 'right';
}
function leftForTextAlign(x, w, align) {
  if (align === 'right') {
    x -= w;
  } else if (align === 'center') {
    x -= (w / 2);
  }
  return x;
}
function yForAngle(y, h, angle) {
  if (angle === 90 || angle === 270) {
    y -= (h / 2);
  } else if (angle > 270 || angle < 90) {
    y -= h;
  }
  return y;
}
function drawPointLabels(scale, labelCount) {
  const {ctx, options: {pointLabels}} = scale;
  for (let i = labelCount - 1; i >= 0; i--) {
    const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i));
    const plFont = toFont(optsAtIndex.font);
    const {x, y, textAlign, left, top, right, bottom} = scale._pointLabelItems[i];
    const {backdropColor} = optsAtIndex;
    if (!isNullOrUndef(backdropColor)) {
      const padding = toPadding(optsAtIndex.backdropPadding);
      ctx.fillStyle = backdropColor;
      ctx.fillRect(left - padding.left, top - padding.top, right - left + padding.width, bottom - top + padding.height);
    }
    renderText(
      ctx,
      scale._pointLabels[i],
      x,
      y + (plFont.lineHeight / 2),
      plFont,
      {
        color: optsAtIndex.color,
        textAlign: textAlign,
        textBaseline: 'middle'
      }
    );
  }
}
function pathRadiusLine(scale, radius, circular, labelCount) {
  const {ctx} = scale;
  if (circular) {
    ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
  } else {
    let pointPosition = scale.getPointPosition(0, radius);
    ctx.moveTo(pointPosition.x, pointPosition.y);
    for (let i = 1; i < labelCount; i++) {
      pointPosition = scale.getPointPosition(i, radius);
      ctx.lineTo(pointPosition.x, pointPosition.y);
    }
  }
}
function drawRadiusLine(scale, gridLineOpts, radius, labelCount) {
  const ctx = scale.ctx;
  const circular = gridLineOpts.circular;
  const {color, lineWidth} = gridLineOpts;
  if ((!circular && !labelCount) || !color || !lineWidth || radius < 0) {
    return;
  }
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(gridLineOpts.borderDash);
  ctx.lineDashOffset = gridLineOpts.borderDashOffset;
  ctx.beginPath();
  pathRadiusLine(scale, radius, circular, labelCount);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
function createPointLabelContext(parent, index, label) {
  return createContext(parent, {
    label,
    index,
    type: 'pointLabel'
  });
}
class RadialLinearScale extends LinearScaleBase {
  constructor(cfg) {
    super(cfg);
    this.xCenter = undefined;
    this.yCenter = undefined;
    this.drawingArea = undefined;
    this._pointLabels = [];
    this._pointLabelItems = [];
  }
  setDimensions() {
    const padding = this._padding = toPadding(getTickBackdropHeight(this.options) / 2);
    const w = this.width = this.maxWidth - padding.width;
    const h = this.height = this.maxHeight - padding.height;
    this.xCenter = Math.floor(this.left + w / 2 + padding.left);
    this.yCenter = Math.floor(this.top + h / 2 + padding.top);
    this.drawingArea = Math.floor(Math.min(w, h) / 2);
  }
  determineDataLimits() {
    const {min, max} = this.getMinMax(false);
    this.min = isNumberFinite(min) && !isNaN(min) ? min : 0;
    this.max = isNumberFinite(max) && !isNaN(max) ? max : 0;
    this.handleTickRangeOptions();
  }
  computeTickLimit() {
    return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
  }
  generateTickLabels(ticks) {
    LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
    this._pointLabels = this.getLabels()
      .map((value, index) => {
        const label = callback(this.options.pointLabels.callback, [value, index], this);
        return label || label === 0 ? label : '';
      })
      .filter((v, i) => this.chart.getDataVisibility(i));
  }
  fit() {
    const opts = this.options;
    if (opts.display && opts.pointLabels.display) {
      fitWithPointLabels(this);
    } else {
      this.setCenterPoint(0, 0, 0, 0);
    }
  }
  setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
    this.xCenter += Math.floor((leftMovement - rightMovement) / 2);
    this.yCenter += Math.floor((topMovement - bottomMovement) / 2);
    this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(leftMovement, rightMovement, topMovement, bottomMovement));
  }
  getIndexAngle(index) {
    const angleMultiplier = TAU / (this._pointLabels.length || 1);
    const startAngle = this.options.startAngle || 0;
    return _normalizeAngle(index * angleMultiplier + toRadians(startAngle));
  }
  getDistanceFromCenterForValue(value) {
    if (isNullOrUndef(value)) {
      return NaN;
    }
    const scalingFactor = this.drawingArea / (this.max - this.min);
    if (this.options.reverse) {
      return (this.max - value) * scalingFactor;
    }
    return (value - this.min) * scalingFactor;
  }
  getValueForDistanceFromCenter(distance) {
    if (isNullOrUndef(distance)) {
      return NaN;
    }
    const scaledDistance = distance / (this.drawingArea / (this.max - this.min));
    return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
  }
  getPointLabelContext(index) {
    const pointLabels = this._pointLabels || [];
    if (index >= 0 && index < pointLabels.length) {
      const pointLabel = pointLabels[index];
      return createPointLabelContext(this.getContext(), index, pointLabel);
    }
  }
  getPointPosition(index, distanceFromCenter, additionalAngle = 0) {
    const angle = this.getIndexAngle(index) - HALF_PI + additionalAngle;
    return {
      x: Math.cos(angle) * distanceFromCenter + this.xCenter,
      y: Math.sin(angle) * distanceFromCenter + this.yCenter,
      angle
    };
  }
  getPointPositionForValue(index, value) {
    return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
  }
  getBasePosition(index) {
    return this.getPointPositionForValue(index || 0, this.getBaseValue());
  }
  getPointLabelPosition(index) {
    const {left, top, right, bottom} = this._pointLabelItems[index];
    return {
      left,
      top,
      right,
      bottom,
    };
  }
  drawBackground() {
    const {backgroundColor, grid: {circular}} = this.options;
    if (backgroundColor) {
      const ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length);
      ctx.closePath();
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      ctx.restore();
    }
  }
  drawGrid() {
    const ctx = this.ctx;
    const opts = this.options;
    const {angleLines, grid} = opts;
    const labelCount = this._pointLabels.length;
    let i, offset, position;
    if (opts.pointLabels.display) {
      drawPointLabels(this, labelCount);
    }
    if (grid.display) {
      this.ticks.forEach((tick, index) => {
        if (index !== 0) {
          offset = this.getDistanceFromCenterForValue(tick.value);
          const optsAtIndex = grid.setContext(this.getContext(index - 1));
          drawRadiusLine(this, optsAtIndex, offset, labelCount);
        }
      });
    }
    if (angleLines.display) {
      ctx.save();
      for (i = labelCount - 1; i >= 0; i--) {
        const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i));
        const {color, lineWidth} = optsAtIndex;
        if (!lineWidth || !color) {
          continue;
        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.setLineDash(optsAtIndex.borderDash);
        ctx.lineDashOffset = optsAtIndex.borderDashOffset;
        offset = this.getDistanceFromCenterForValue(opts.ticks.reverse ? this.min : this.max);
        position = this.getPointPosition(i, offset);
        ctx.beginPath();
        ctx.moveTo(this.xCenter, this.yCenter);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  drawBorder() {}
  drawLabels() {
    const ctx = this.ctx;
    const opts = this.options;
    const tickOpts = opts.ticks;
    if (!tickOpts.display) {
      return;
    }
    const startAngle = this.getIndexAngle(0);
    let offset, width;
    ctx.save();
    ctx.translate(this.xCenter, this.yCenter);
    ctx.rotate(startAngle);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    this.ticks.forEach((tick, index) => {
      if (index === 0 && !opts.reverse) {
        return;
      }
      const optsAtIndex = tickOpts.setContext(this.getContext(index));
      const tickFont = toFont(optsAtIndex.font);
      offset = this.getDistanceFromCenterForValue(this.ticks[index].value);
      if (optsAtIndex.showLabelBackdrop) {
        ctx.font = tickFont.string;
        width = ctx.measureText(tick.label).width;
        ctx.fillStyle = optsAtIndex.backdropColor;
        const padding = toPadding(optsAtIndex.backdropPadding);
        ctx.fillRect(
          -width / 2 - padding.left,
          -offset - tickFont.size / 2 - padding.top,
          width + padding.width,
          tickFont.size + padding.height
        );
      }
      renderText(ctx, tick.label, 0, -offset, tickFont, {
        color: optsAtIndex.color,
      });
    });
    ctx.restore();
  }
  drawTitle() {}
}
RadialLinearScale.id = 'radialLinear';
RadialLinearScale.defaults = {
  display: true,
  animate: true,
  position: 'chartArea',
  angleLines: {
    display: true,
    lineWidth: 1,
    borderDash: [],
    borderDashOffset: 0.0
  },
  grid: {
    circular: false
  },
  startAngle: 0,
  ticks: {
    showLabelBackdrop: true,
    callback: Ticks.formatters.numeric
  },
  pointLabels: {
    backdropColor: undefined,
    backdropPadding: 2,
    display: true,
    font: {
      size: 10
    },
    callback(label) {
      return label;
    },
    padding: 5,
    centerPointLabels: false
  }
};
RadialLinearScale.defaultRoutes = {
  'angleLines.color': 'borderColor',
  'pointLabels.color': 'color',
  'ticks.color': 'color'
};
RadialLinearScale.descriptors = {
  angleLines: {
    _fallback: 'grid'
  }
};

const INTERVALS = {
  millisecond: {common: true, size: 1, steps: 1000},
  second: {common: true, size: 1000, steps: 60},
  minute: {common: true, size: 60000, steps: 60},
  hour: {common: true, size: 3600000, steps: 24},
  day: {common: true, size: 86400000, steps: 30},
  week: {common: false, size: 604800000, steps: 4},
  month: {common: true, size: 2.628e9, steps: 12},
  quarter: {common: false, size: 7.884e9, steps: 4},
  year: {common: true, size: 3.154e10}
};
const UNITS = (Object.keys(INTERVALS));
function sorter(a, b) {
  return a - b;
}
function parse(scale, input) {
  if (isNullOrUndef(input)) {
    return null;
  }
  const adapter = scale._adapter;
  const {parser, round, isoWeekday} = scale._parseOpts;
  let value = input;
  if (typeof parser === 'function') {
    value = parser(value);
  }
  if (!isNumberFinite(value)) {
    value = typeof parser === 'string'
      ? adapter.parse(value, parser)
      : adapter.parse(value);
  }
  if (value === null) {
    return null;
  }
  if (round) {
    value = round === 'week' && (isNumber(isoWeekday) || isoWeekday === true)
      ? adapter.startOf(value, 'isoWeek', isoWeekday)
      : adapter.startOf(value, round);
  }
  return +value;
}
function determineUnitForAutoTicks(minUnit, min, max, capacity) {
  const ilen = UNITS.length;
  for (let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
    const interval = INTERVALS[UNITS[i]];
    const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
    if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
      return UNITS[i];
    }
  }
  return UNITS[ilen - 1];
}
function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
  for (let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--) {
    const unit = UNITS[i];
    if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
      return unit;
    }
  }
  return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
}
function determineMajorUnit(unit) {
  for (let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
    if (INTERVALS[UNITS[i]].common) {
      return UNITS[i];
    }
  }
}
function addTick(ticks, time, timestamps) {
  if (!timestamps) {
    ticks[time] = true;
  } else if (timestamps.length) {
    const {lo, hi} = _lookup(timestamps, time);
    const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
    ticks[timestamp] = true;
  }
}
function setMajorTicks(scale, ticks, map, majorUnit) {
  const adapter = scale._adapter;
  const first = +adapter.startOf(ticks[0].value, majorUnit);
  const last = ticks[ticks.length - 1].value;
  let major, index;
  for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
    index = map[major];
    if (index >= 0) {
      ticks[index].major = true;
    }
  }
  return ticks;
}
function ticksFromTimestamps(scale, values, majorUnit) {
  const ticks = [];
  const map = {};
  const ilen = values.length;
  let i, value;
  for (i = 0; i < ilen; ++i) {
    value = values[i];
    map[value] = i;
    ticks.push({
      value,
      major: false
    });
  }
  return (ilen === 0 || !majorUnit) ? ticks : setMajorTicks(scale, ticks, map, majorUnit);
}
class TimeScale extends Scale {
  constructor(props) {
    super(props);
    this._cache = {
      data: [],
      labels: [],
      all: []
    };
    this._unit = 'day';
    this._majorUnit = undefined;
    this._offsets = {};
    this._normalized = false;
    this._parseOpts = undefined;
  }
  init(scaleOpts, opts) {
    const time = scaleOpts.time || (scaleOpts.time = {});
    const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
    mergeIf(time.displayFormats, adapter.formats());
    this._parseOpts = {
      parser: time.parser,
      round: time.round,
      isoWeekday: time.isoWeekday
    };
    super.init(scaleOpts);
    this._normalized = opts.normalized;
  }
  parse(raw, index) {
    if (raw === undefined) {
      return null;
    }
    return parse(this, raw);
  }
  beforeLayout() {
    super.beforeLayout();
    this._cache = {
      data: [],
      labels: [],
      all: []
    };
  }
  determineDataLimits() {
    const options = this.options;
    const adapter = this._adapter;
    const unit = options.time.unit || 'day';
    let {min, max, minDefined, maxDefined} = this.getUserBounds();
    function _applyBounds(bounds) {
      if (!minDefined && !isNaN(bounds.min)) {
        min = Math.min(min, bounds.min);
      }
      if (!maxDefined && !isNaN(bounds.max)) {
        max = Math.max(max, bounds.max);
      }
    }
    if (!minDefined || !maxDefined) {
      _applyBounds(this._getLabelBounds());
      if (options.bounds !== 'ticks' || options.ticks.source !== 'labels') {
        _applyBounds(this.getMinMax(false));
      }
    }
    min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
    max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
    this.min = Math.min(min, max - 1);
    this.max = Math.max(min + 1, max);
  }
  _getLabelBounds() {
    const arr = this.getLabelTimestamps();
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    if (arr.length) {
      min = arr[0];
      max = arr[arr.length - 1];
    }
    return {min, max};
  }
  buildTicks() {
    const options = this.options;
    const timeOpts = options.time;
    const tickOpts = options.ticks;
    const timestamps = tickOpts.source === 'labels' ? this.getLabelTimestamps() : this._generate();
    if (options.bounds === 'ticks' && timestamps.length) {
      this.min = this._userMin || timestamps[0];
      this.max = this._userMax || timestamps[timestamps.length - 1];
    }
    const min = this.min;
    const max = this.max;
    const ticks = _filterBetween(timestamps, min, max);
    this._unit = timeOpts.unit || (tickOpts.autoSkip
      ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min))
      : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
    this._majorUnit = !tickOpts.major.enabled || this._unit === 'year' ? undefined
      : determineMajorUnit(this._unit);
    this.initOffsets(timestamps);
    if (options.reverse) {
      ticks.reverse();
    }
    return ticksFromTimestamps(this, ticks, this._majorUnit);
  }
  initOffsets(timestamps) {
    let start = 0;
    let end = 0;
    let first, last;
    if (this.options.offset && timestamps.length) {
      first = this.getDecimalForValue(timestamps[0]);
      if (timestamps.length === 1) {
        start = 1 - first;
      } else {
        start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
      }
      last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
      if (timestamps.length === 1) {
        end = last;
      } else {
        end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
      }
    }
    const limit = timestamps.length < 3 ? 0.5 : 0.25;
    start = _limitValue(start, 0, limit);
    end = _limitValue(end, 0, limit);
    this._offsets = {start, end, factor: 1 / (start + 1 + end)};
  }
  _generate() {
    const adapter = this._adapter;
    const min = this.min;
    const max = this.max;
    const options = this.options;
    const timeOpts = options.time;
    const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
    const stepSize = valueOrDefault(timeOpts.stepSize, 1);
    const weekday = minor === 'week' ? timeOpts.isoWeekday : false;
    const hasWeekday = isNumber(weekday) || weekday === true;
    const ticks = {};
    let first = min;
    let time, count;
    if (hasWeekday) {
      first = +adapter.startOf(first, 'isoWeek', weekday);
    }
    first = +adapter.startOf(first, hasWeekday ? 'day' : minor);
    if (adapter.diff(max, min, minor) > 100000 * stepSize) {
      throw new Error(min + ' and ' + max + ' are too far apart with stepSize of ' + stepSize + ' ' + minor);
    }
    const timestamps = options.ticks.source === 'data' && this.getDataTimestamps();
    for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
      addTick(ticks, time, timestamps);
    }
    if (time === max || options.bounds === 'ticks' || count === 1) {
      addTick(ticks, time, timestamps);
    }
    return Object.keys(ticks).sort((a, b) => a - b).map(x => +x);
  }
  getLabelForValue(value) {
    const adapter = this._adapter;
    const timeOpts = this.options.time;
    if (timeOpts.tooltipFormat) {
      return adapter.format(value, timeOpts.tooltipFormat);
    }
    return adapter.format(value, timeOpts.displayFormats.datetime);
  }
  _tickFormatFunction(time, index, ticks, format) {
    const options = this.options;
    const formats = options.time.displayFormats;
    const unit = this._unit;
    const majorUnit = this._majorUnit;
    const minorFormat = unit && formats[unit];
    const majorFormat = majorUnit && formats[majorUnit];
    const tick = ticks[index];
    const major = majorUnit && majorFormat && tick && tick.major;
    const label = this._adapter.format(time, format || (major ? majorFormat : minorFormat));
    const formatter = options.ticks.callback;
    return formatter ? callback(formatter, [label, index, ticks], this) : label;
  }
  generateTickLabels(ticks) {
    let i, ilen, tick;
    for (i = 0, ilen = ticks.length; i < ilen; ++i) {
      tick = ticks[i];
      tick.label = this._tickFormatFunction(tick.value, i, ticks);
    }
  }
  getDecimalForValue(value) {
    return value === null ? NaN : (value - this.min) / (this.max - this.min);
  }
  getPixelForValue(value) {
    const offsets = this._offsets;
    const pos = this.getDecimalForValue(value);
    return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
  }
  getValueForPixel(pixel) {
    const offsets = this._offsets;
    const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
    return this.min + pos * (this.max - this.min);
  }
  _getLabelSize(label) {
    const ticksOpts = this.options.ticks;
    const tickLabelWidth = this.ctx.measureText(label).width;
    const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
    const cosRotation = Math.cos(angle);
    const sinRotation = Math.sin(angle);
    const tickFontSize = this._resolveTickFontOptions(0).size;
    return {
      w: (tickLabelWidth * cosRotation) + (tickFontSize * sinRotation),
      h: (tickLabelWidth * sinRotation) + (tickFontSize * cosRotation)
    };
  }
  _getLabelCapacity(exampleTime) {
    const timeOpts = this.options.time;
    const displayFormats = timeOpts.displayFormats;
    const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
    const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [exampleTime], this._majorUnit), format);
    const size = this._getLabelSize(exampleLabel);
    const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
    return capacity > 0 ? capacity : 1;
  }
  getDataTimestamps() {
    let timestamps = this._cache.data || [];
    let i, ilen;
    if (timestamps.length) {
      return timestamps;
    }
    const metas = this.getMatchingVisibleMetas();
    if (this._normalized && metas.length) {
      return (this._cache.data = metas[0].controller.getAllParsedValues(this));
    }
    for (i = 0, ilen = metas.length; i < ilen; ++i) {
      timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
    }
    return (this._cache.data = this.normalize(timestamps));
  }
  getLabelTimestamps() {
    const timestamps = this._cache.labels || [];
    let i, ilen;
    if (timestamps.length) {
      return timestamps;
    }
    const labels = this.getLabels();
    for (i = 0, ilen = labels.length; i < ilen; ++i) {
      timestamps.push(parse(this, labels[i]));
    }
    return (this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps));
  }
  normalize(values) {
    return _arrayUnique(values.sort(sorter));
  }
}
TimeScale.id = 'time';
TimeScale.defaults = {
  bounds: 'data',
  adapters: {},
  time: {
    parser: false,
    unit: false,
    round: false,
    isoWeekday: false,
    minUnit: 'millisecond',
    displayFormats: {}
  },
  ticks: {
    source: 'auto',
    major: {
      enabled: false
    }
  }
};

function interpolate$1(table, val, reverse) {
  let lo = 0;
  let hi = table.length - 1;
  let prevSource, nextSource, prevTarget, nextTarget;
  if (reverse) {
    if (val >= table[lo].pos && val <= table[hi].pos) {
      ({lo, hi} = _lookupByKey(table, 'pos', val));
    }
    ({pos: prevSource, time: prevTarget} = table[lo]);
    ({pos: nextSource, time: nextTarget} = table[hi]);
  } else {
    if (val >= table[lo].time && val <= table[hi].time) {
      ({lo, hi} = _lookupByKey(table, 'time', val));
    }
    ({time: prevSource, pos: prevTarget} = table[lo]);
    ({time: nextSource, pos: nextTarget} = table[hi]);
  }
  const span = nextSource - prevSource;
  return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
}
class TimeSeriesScale extends TimeScale {
  constructor(props) {
    super(props);
    this._table = [];
    this._minPos = undefined;
    this._tableRange = undefined;
  }
  initOffsets() {
    const timestamps = this._getTimestampsForTable();
    const table = this._table = this.buildLookupTable(timestamps);
    this._minPos = interpolate$1(table, this.min);
    this._tableRange = interpolate$1(table, this.max) - this._minPos;
    super.initOffsets(timestamps);
  }
  buildLookupTable(timestamps) {
    const {min, max} = this;
    const items = [];
    const table = [];
    let i, ilen, prev, curr, next;
    for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
      curr = timestamps[i];
      if (curr >= min && curr <= max) {
        items.push(curr);
      }
    }
    if (items.length < 2) {
      return [
        {time: min, pos: 0},
        {time: max, pos: 1}
      ];
    }
    for (i = 0, ilen = items.length; i < ilen; ++i) {
      next = items[i + 1];
      prev = items[i - 1];
      curr = items[i];
      if (Math.round((next + prev) / 2) !== curr) {
        table.push({time: curr, pos: i / (ilen - 1)});
      }
    }
    return table;
  }
  _getTimestampsForTable() {
    let timestamps = this._cache.all || [];
    if (timestamps.length) {
      return timestamps;
    }
    const data = this.getDataTimestamps();
    const label = this.getLabelTimestamps();
    if (data.length && label.length) {
      timestamps = this.normalize(data.concat(label));
    } else {
      timestamps = data.length ? data : label;
    }
    timestamps = this._cache.all = timestamps;
    return timestamps;
  }
  getDecimalForValue(value) {
    return (interpolate$1(this._table, value) - this._minPos) / this._tableRange;
  }
  getValueForPixel(pixel) {
    const offsets = this._offsets;
    const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
    return interpolate$1(this._table, decimal * this._tableRange + this._minPos, true);
  }
}
TimeSeriesScale.id = 'timeseries';
TimeSeriesScale.defaults = TimeScale.defaults;

var scales = /*#__PURE__*/Object.freeze({
__proto__: null,
CategoryScale: CategoryScale,
LinearScale: LinearScale,
LogarithmicScale: LogarithmicScale,
RadialLinearScale: RadialLinearScale,
TimeScale: TimeScale,
TimeSeriesScale: TimeSeriesScale
});

const registerables = [
  controllers,
  elements,
  plugins,
  scales,
];

// Coordinates retained from the user-supplied prototype. Exposure regions corrected against ISO 17636-1 Annex A.
// The inaccessible-wall boundary is geometry, not an exposure threshold. No extrapolation is permitted.
const NOMOGRAMS = {
  "outsideA": [
    {
      "N": 6,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.305647840531561
        },
        {
          "x": 0.0203081232492997,
          "y": 0.239202657807308
        },
        {
          "x": 0.0406162464985994,
          "y": 0.179401993355481
        },
        {
          "x": 0.0609243697478991,
          "y": 0.112956810631229
        },
        {
          "x": 0.0798319327731092,
          "y": 0.0531561461794019
        },
        {
          "x": 0.0952380952380952,
          "y": 0
        }
      ]
    },
    {
      "N": 7,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.697674418604651
        },
        {
          "x": 0.0203081232492997,
          "y": 0.631229235880398
        },
        {
          "x": 0.0406162464985994,
          "y": 0.564784053156146
        },
        {
          "x": 0.0602240896358543,
          "y": 0.491694352159468
        },
        {
          "x": 0.0798319327731092,
          "y": 0.425249169435215
        },
        {
          "x": 0.100140056022408,
          "y": 0.352159468438538
        },
        {
          "x": 0.119747899159663,
          "y": 0.27906976744186
        },
        {
          "x": 0.140056022408963,
          "y": 0.199335548172757
        },
        {
          "x": 0.158963585434173,
          "y": 0.126245847176079
        },
        {
          "x": 0.177170868347338,
          "y": 0.0531561461794019
        },
        {
          "x": 0.1890756302521,
          "y": 0
        }
      ]
    },
    {
      "N": 8,
      "dataPoints": [
        {
          "x": 0,
          "y": 1.07641196013289
        },
        {
          "x": 0.0203081232492997,
          "y": 0.996677740863787
        },
        {
          "x": 0.0406162464985994,
          "y": 0.916943521594684
        },
        {
          "x": 0.0609243697478991,
          "y": 0.837209302325581
        },
        {
          "x": 0.080532212885154,
          "y": 0.757475083056478
        },
        {
          "x": 0.100140056022408,
          "y": 0.677740863787375
        },
        {
          "x": 0.119747899159663,
          "y": 0.598006644518272
        },
        {
          "x": 0.140756302521008,
          "y": 0.504983388704318
        },
        {
          "x": 0.159663865546218,
          "y": 0.425249169435215
        },
        {
          "x": 0.180672268907563,
          "y": 0.332225913621262
        },
        {
          "x": 0.200280112044817,
          "y": 0.245847176079734
        },
        {
          "x": 0.220588235294117,
          "y": 0.15282392026578
        },
        {
          "x": 0.239495798319327,
          "y": 0.0664451827242525
        },
        {
          "x": 0.25,
          "y": 0.01
        }
      ]
    },
    {
      "N": 9,
      "dataPoints": [
        {
          "x": 0,
          "y": 1.46843853820598
        },
        {
          "x": 0.0203081232492997,
          "y": 1.38205980066445
        },
        {
          "x": 0.0399159663865546,
          "y": 1.30232558139534
        },
        {
          "x": 0.0595238095238095,
          "y": 1.21594684385382
        },
        {
          "x": 0.0798319327731092,
          "y": 1.12292358803986
        },
        {
          "x": 0.100140056022408,
          "y": 1.02990033222591
        },
        {
          "x": 0.119747899159663,
          "y": 0.93687707641196
        },
        {
          "x": 0.139355742296918,
          "y": 0.843853820598006
        },
        {
          "x": 0.159663865546218,
          "y": 0.744186046511627
        },
        {
          "x": 0.180672268907563,
          "y": 0.637873754152823
        },
        {
          "x": 0.200280112044817,
          "y": 0.538205980066445
        },
        {
          "x": 0.219887955182072,
          "y": 0.431893687707641
        },
        {
          "x": 0.239495798319327,
          "y": 0.325581395348837
        },
        {
          "x": 0.25,
          "y": 0.272425249169435
        }
      ]
    },
    {
      "N": 10,
      "dataPoints": [
        {
          "x": 0,
          "y": 1.93355481727574
        },
        {
          "x": 0.0203081232492997,
          "y": 1.82724252491694
        },
        {
          "x": 0.0406162464985994,
          "y": 1.72093023255813
        },
        {
          "x": 0.0602240896358543,
          "y": 1.62126245847176
        },
        {
          "x": 0.0798319327731092,
          "y": 1.51495016611295
        },
        {
          "x": 0.100140056022408,
          "y": 1.40199335548172
        },
        {
          "x": 0.119747899159663,
          "y": 1.29568106312292
        },
        {
          "x": 0.140056022408963,
          "y": 1.17607973421926
        },
        {
          "x": 0.159663865546218,
          "y": 1.06312292358804
        },
        {
          "x": 0.180672268907563,
          "y": 0.93687707641196
        },
        {
          "x": 0.200280112044817,
          "y": 0.817275747508305
        },
        {
          "x": 0.219887955182072,
          "y": 0.691029900332225
        },
        {
          "x": 0.240196078431372,
          "y": 0.564784053156146
        },
        {
          "x": 0.25,
          "y": 0.498338870431893
        }
      ]
    },
    {
      "N": 11,
      "dataPoints": [
        {
          "x": 0,
          "y": 2.29900332225913
        },
        {
          "x": 0.0203081232492997,
          "y": 2.1860465116279
        },
        {
          "x": 0.0406162464985994,
          "y": 2.07308970099667
        },
        {
          "x": 0.0602240896358543,
          "y": 1.96677740863787
        },
        {
          "x": 0.080532212885154,
          "y": 1.84717607973421
        },
        {
          "x": 0.100840336134453,
          "y": 1.72757475083056
        },
        {
          "x": 0.119747899159663,
          "y": 1.61461794019933
        },
        {
          "x": 0.140056022408963,
          "y": 1.48837209302325
        },
        {
          "x": 0.159663865546218,
          "y": 1.3687707641196
        },
        {
          "x": 0.179971988795518,
          "y": 1.23588039867109
        },
        {
          "x": 0.199579831932773,
          "y": 1.10963455149501
        },
        {
          "x": 0.219887955182072,
          "y": 0.976744186046511
        },
        {
          "x": 0.240196078431372,
          "y": 0.837209302325581
        },
        {
          "x": 0.25,
          "y": 0.770764119601329
        }
      ]
    },
    {
      "N": 12,
      "dataPoints": [
        {
          "x": 0,
          "y": 2.69767441860465
        },
        {
          "x": 0.0203081232492997,
          "y": 2.57807308970099
        },
        {
          "x": 0.0406162464985994,
          "y": 2.45847176079734
        },
        {
          "x": 0.0609243697478991,
          "y": 2.33222591362126
        },
        {
          "x": 0.080532212885154,
          "y": 2.20598006644518
        },
        {
          "x": 0.100140056022408,
          "y": 2.0797342192691
        },
        {
          "x": 0.120448179271708,
          "y": 1.94684385382059
        },
        {
          "x": 0.140756302521008,
          "y": 1.80730897009966
        },
        {
          "x": 0.159663865546218,
          "y": 1.67441860465116
        },
        {
          "x": 0.179971988795518,
          "y": 1.5282392026578
        },
        {
          "x": 0.200280112044817,
          "y": 1.38205980066445
        },
        {
          "x": 0.219887955182072,
          "y": 1.22923588039867
        },
        {
          "x": 0.240196078431372,
          "y": 1.07641196013289
        },
        {
          "x": 0.25,
          "y": 0.996677740863787
        }
      ]
    },
    {
      "N": 13,
      "dataPoints": [
        {
          "x": 0,
          "y": 3.11627906976744
        },
        {
          "x": 0.0203081232492997,
          "y": 2.98338870431893
        },
        {
          "x": 0.0406162464985994,
          "y": 2.85049833887043
        },
        {
          "x": 0.0602240896358543,
          "y": 2.71760797342192
        },
        {
          "x": 0.080532212885154,
          "y": 2.57807308970099
        },
        {
          "x": 0.100140056022408,
          "y": 2.44518272425249
        },
        {
          "x": 0.119747899159663,
          "y": 2.29900332225913
        },
        {
          "x": 0.140056022408963,
          "y": 2.15282392026578
        },
        {
          "x": 0.159663865546218,
          "y": 2.00664451827242
        },
        {
          "x": 0.179971988795518,
          "y": 1.85382059800664
        },
        {
          "x": 0.200980392156862,
          "y": 1.69435215946843
        },
        {
          "x": 0.219887955182072,
          "y": 1.54152823920265
        },
        {
          "x": 0.239495798319327,
          "y": 1.38205980066445
        },
        {
          "x": 0.25,
          "y": 1.29568106312292
        }
      ]
    },
    {
      "N": 14,
      "dataPoints": [
        {
          "x": 0,
          "y": 3.52159468438538
        },
        {
          "x": 0.0203081232492997,
          "y": 3.37541528239202
        },
        {
          "x": 0.0406162464985994,
          "y": 3.22923588039867
        },
        {
          "x": 0.0595238095238095,
          "y": 3.08305647840531
        },
        {
          "x": 0.0798319327731092,
          "y": 2.93687707641196
        },
        {
          "x": 0.0994397759103641,
          "y": 2.78405315614617
        },
        {
          "x": 0.120448179271708,
          "y": 2.62458471760797
        },
        {
          "x": 0.140056022408963,
          "y": 2.47176079734219
        },
        {
          "x": 0.159663865546218,
          "y": 2.31229235880398
        },
        {
          "x": 0.179971988795518,
          "y": 2.15282392026578
        },
        {
          "x": 0.200280112044817,
          "y": 1.98671096345514
        },
        {
          "x": 0.219887955182072,
          "y": 1.82059800664451
        },
        {
          "x": 0.240196078431372,
          "y": 1.64784053156146
        },
        {
          "x": 0.25,
          "y": 1.56146179401993
        }
      ]
    },
    {
      "N": 15,
      "dataPoints": [
        {
          "x": 0,
          "y": 3.94019933554817
        },
        {
          "x": 0.0203081232492997,
          "y": 3.77408637873754
        },
        {
          "x": 0.0406162464985994,
          "y": 3.60797342192691
        },
        {
          "x": 0.0602240896358543,
          "y": 3.4485049833887
        },
        {
          "x": 0.0798319327731092,
          "y": 3.28239202657807
        },
        {
          "x": 0.100140056022408,
          "y": 3.11627906976744
        },
        {
          "x": 0.119747899159663,
          "y": 2.94352159468438
        },
        {
          "x": 0.140056022408963,
          "y": 2.77076411960132
        },
        {
          "x": 0.159663865546218,
          "y": 2.60465116279069
        },
        {
          "x": 0.179971988795518,
          "y": 2.42524916943521
        },
        {
          "x": 0.200280112044817,
          "y": 2.24584717607973
        },
        {
          "x": 0.219887955182072,
          "y": 2.06644518272425
        },
        {
          "x": 0.240196078431372,
          "y": 1.88704318936877
        },
        {
          "x": 0.25,
          "y": 1.79401993355481
        }
      ]
    },
    {
      "N": 16,
      "dataPoints": [
        {
          "x": 0.0448179271708683,
          "y": 4
        },
        {
          "x": 0.0602240896358543,
          "y": 3.86710963455149
        },
        {
          "x": 0.080532212885154,
          "y": 3.70099667774086
        },
        {
          "x": 0.100140056022408,
          "y": 3.5282392026578
        },
        {
          "x": 0.119747899159663,
          "y": 3.35548172757475
        },
        {
          "x": 0.140056022408963,
          "y": 3.16943521594684
        },
        {
          "x": 0.159663865546218,
          "y": 2.98338870431893
        },
        {
          "x": 0.179971988795518,
          "y": 2.78405315614617
        },
        {
          "x": 0.200280112044817,
          "y": 2.58471760797342
        },
        {
          "x": 0.219887955182072,
          "y": 2.37873754152823
        },
        {
          "x": 0.240196078431372,
          "y": 2.16611295681063
        },
        {
          "x": 0.25,
          "y": 2.05980066445182
        }
      ]
    },
    {
      "N": 17,
      "dataPoints": [
        {
          "x": 0.0868347338935574,
          "y": 4
        },
        {
          "x": 0.109943977591036,
          "y": 3.78737541528239
        },
        {
          "x": 0.130252100840336,
          "y": 3.58803986710963
        },
        {
          "x": 0.149859943977591,
          "y": 3.3953488372093
        },
        {
          "x": 0.17016806722689,
          "y": 3.18272425249169
        },
        {
          "x": 0.189775910364145,
          "y": 2.97674418604651
        },
        {
          "x": 0.210084033613445,
          "y": 2.75747508305647
        },
        {
          "x": 0.2296918767507,
          "y": 2.53156146179402
        },
        {
          "x": 0.25,
          "y": 2.29235880398671
        }
      ]
    },
    {
      "N": 18,
      "dataPoints": [
        {
          "x": 0.119747899159663,
          "y": 4
        },
        {
          "x": 0.140056022408963,
          "y": 3.79401993355481
        },
        {
          "x": 0.159663865546218,
          "y": 3.59468438538205
        },
        {
          "x": 0.179971988795518,
          "y": 3.38205980066445
        },
        {
          "x": 0.200280112044817,
          "y": 3.16279069767441
        },
        {
          "x": 0.219887955182072,
          "y": 2.93687707641196
        },
        {
          "x": 0.240196078431372,
          "y": 2.69767441860465
        },
        {
          "x": 0.25,
          "y": 2.58471760797342
        }
      ]
    }
  ],
  "insideA": [
    {
      "N": 1,
      "dataPoints": [
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0.25,
          "y": 2
        }
      ]
    },
    {
      "N": 2,
      "dataPoints": [
        {
          "x": 0,
          "y": 1.20265780730897
        },
        {
          "x": 0.0203081232492997,
          "y": 1.21594684385382
        },
        {
          "x": 0.0399159663865546,
          "y": 1.22923588039867
        },
        {
          "x": 0.0602240896358543,
          "y": 1.24584717607973
        },
        {
          "x": 0.0812324929971988,
          "y": 1.26245847176079
        },
        {
          "x": 0.100840336134453,
          "y": 1.27906976744186
        },
        {
          "x": 0.121848739495798,
          "y": 1.29568106312292
        },
        {
          "x": 0.140056022408963,
          "y": 1.31229235880398
        },
        {
          "x": 0.161764705882352,
          "y": 1.33222591362126
        },
        {
          "x": 0.179971988795518,
          "y": 1.34883720930232
        },
        {
          "x": 0.200980392156862,
          "y": 1.3687707641196
        },
        {
          "x": 0.218487394957983,
          "y": 1.38538205980066
        },
        {
          "x": 0.237394957983193,
          "y": 1.40531561461794
        },
        {
          "x": 0.25,
          "y": 1.41860465116279
        }
      ]
    },
    {
      "N": 3,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.900332225913621
        },
        {
          "x": 0.0203081232492997,
          "y": 0.920265780730897
        },
        {
          "x": 0.0399159663865546,
          "y": 0.940199335548172
        },
        {
          "x": 0.0588235294117647,
          "y": 0.960132890365448
        },
        {
          "x": 0.0798319327731092,
          "y": 0.983388704318936
        },
        {
          "x": 0.100840336134453,
          "y": 1.00996677740863
        },
        {
          "x": 0.120448179271708,
          "y": 1.03322259136212
        },
        {
          "x": 0.140756302521008,
          "y": 1.05980066445182
        },
        {
          "x": 0.160364145658263,
          "y": 1.08637873754152
        },
        {
          "x": 0.179971988795518,
          "y": 1.11627906976744
        },
        {
          "x": 0.200280112044817,
          "y": 1.14617940199335
        },
        {
          "x": 0.219887955182072,
          "y": 1.17940199335548
        },
        {
          "x": 0.240196078431372,
          "y": 1.2126245847176
        },
        {
          "x": 0.25,
          "y": 1.22923588039867
        }
      ]
    },
    {
      "N": 4,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.534883720930232
        },
        {
          "x": 0.0203081232492997,
          "y": 0.568106312292358
        },
        {
          "x": 0.0399159663865546,
          "y": 0.601328903654485
        },
        {
          "x": 0.0595238095238095,
          "y": 0.634551495016611
        },
        {
          "x": 0.080532212885154,
          "y": 0.67109634551495
        },
        {
          "x": 0.100840336134453,
          "y": 0.707641196013289
        },
        {
          "x": 0.119047619047619,
          "y": 0.740863787375415
        },
        {
          "x": 0.140756302521008,
          "y": 0.780730897009966
        },
        {
          "x": 0.159663865546218,
          "y": 0.817275747508305
        },
        {
          "x": 0.180672268907563,
          "y": 0.857142857142857
        },
        {
          "x": 0.200280112044817,
          "y": 0.897009966777408
        },
        {
          "x": 0.219887955182072,
          "y": 0.93687707641196
        },
        {
          "x": 0.240196078431372,
          "y": 0.980066445182724
        },
        {
          "x": 0.25,
          "y": 1
        }
      ]
    },
    {
      "N": 5,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.149501661129568
        },
        {
          "x": 0.0203081232492997,
          "y": 0.196013289036544
        },
        {
          "x": 0.0406162464985994,
          "y": 0.242524916943521
        },
        {
          "x": 0.0609243697478991,
          "y": 0.289036544850498
        },
        {
          "x": 0.080532212885154,
          "y": 0.335548172757475
        },
        {
          "x": 0.100140056022408,
          "y": 0.382059800664451
        },
        {
          "x": 0.119747899159663,
          "y": 0.431893687707641
        },
        {
          "x": 0.140056022408963,
          "y": 0.48172757475083
        },
        {
          "x": 0.160364145658263,
          "y": 0.53156146179402
        },
        {
          "x": 0.179971988795518,
          "y": 0.581395348837209
        },
        {
          "x": 0.200280112044817,
          "y": 0.634551495016611
        },
        {
          "x": 0.219887955182072,
          "y": 0.687707641196013
        },
        {
          "x": 0.240196078431372,
          "y": 0.740863787375415
        },
        {
          "x": 0.25,
          "y": 0.767441860465116
        }
      ]
    },
    {
      "N": 6,
      "dataPoints": [
        {
          "x": 0.0903361344537815,
          "y": 0
        },
        {
          "x": 0.109943977591036,
          "y": 0.0631229235880398
        },
        {
          "x": 0.130252100840336,
          "y": 0.126245847176079
        },
        {
          "x": 0.149859943977591,
          "y": 0.186046511627906
        },
        {
          "x": 0.17016806722689,
          "y": 0.252491694352159
        },
        {
          "x": 0.19047619047619,
          "y": 0.318936877076411
        },
        {
          "x": 0.210084033613445,
          "y": 0.385382059800664
        },
        {
          "x": 0.230392156862745,
          "y": 0.455149501661129
        },
        {
          "x": 0.25,
          "y": 0.521594684385382
        }
      ]
    },
    {
      "N": 7,
      "dataPoints": [
        {
          "x": 0.185574229691876,
          "y": 0
        },
        {
          "x": 0.200280112044817,
          "y": 0.0598006644518272
        },
        {
          "x": 0.219887955182072,
          "y": 0.13953488372093
        },
        {
          "x": 0.238795518207282,
          "y": 0.21594684385382
        },
        {
          "x": 0.25,
          "y": 0.262458471760797
        }
      ]
    }
  ],
  "outsideB": [
    {
      "N": 8,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.210884354
        },
        {
          "x": 0.020057307,
          "y": 0.163265306
        },
        {
          "x": 0.040114613,
          "y": 0.108843537
        },
        {
          "x": 0.06017192,
          "y": 0.054421769
        },
        {
          "x": 0.077363897,
          "y": 0
        }
      ]
    },
    {
      "N": 9,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.503401361
        },
        {
          "x": 0.020057307,
          "y": 0.448979592
        },
        {
          "x": 0.040114613,
          "y": 0.387755102
        },
        {
          "x": 0.06017192,
          "y": 0.333333333
        },
        {
          "x": 0.080229226,
          "y": 0.265306122
        },
        {
          "x": 0.100286533,
          "y": 0.204081633
        },
        {
          "x": 0.12034384,
          "y": 0.136054422
        },
        {
          "x": 0.140401146,
          "y": 0.06122449
        },
        {
          "x": 0.156876791,
          "y": 0
        }
      ]
    },
    {
      "N": 10,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.782312925
        },
        {
          "x": 0.020057307,
          "y": 0.721088435
        },
        {
          "x": 0.040114613,
          "y": 0.659863946
        },
        {
          "x": 0.060888252,
          "y": 0.591836735
        },
        {
          "x": 0.079512894,
          "y": 0.530612245
        },
        {
          "x": 0.099570201,
          "y": 0.462585034
        },
        {
          "x": 0.12034384,
          "y": 0.387755102
        },
        {
          "x": 0.140401146,
          "y": 0.31292517
        },
        {
          "x": 0.160458453,
          "y": 0.238095238
        },
        {
          "x": 0.180515759,
          "y": 0.156462585
        },
        {
          "x": 0.200573066,
          "y": 0.074829932
        },
        {
          "x": 0.217765043,
          "y": 0
        }
      ]
    },
    {
      "N": 11,
      "dataPoints": [
        {
          "x": 0,
          "y": 1.06122449
        },
        {
          "x": 0.020773639,
          "y": 0.993197279
        },
        {
          "x": 0.040830946,
          "y": 0.925170068
        },
        {
          "x": 0.06017192,
          "y": 0.857142857
        },
        {
          "x": 0.080229226,
          "y": 0.782312925
        },
        {
          "x": 0.100286533,
          "y": 0.707482993
        },
        {
          "x": 0.119627507,
          "y": 0.632653061
        },
        {
          "x": 0.139684814,
          "y": 0.551020408
        },
        {
          "x": 0.15974212,
          "y": 0.469387755
        },
        {
          "x": 0.180515759,
          "y": 0.380952381
        },
        {
          "x": 0.199856734,
          "y": 0.299319728
        },
        {
          "x": 0.220630372,
          "y": 0.204081633
        },
        {
          "x": 0.239971347,
          "y": 0.115646259
        },
        {
          "x": 0.25,
          "y": 0.068027211
        }
      ]
    },
    {
      "N": 12,
      "dataPoints": [
        {
          "x": 0,
          "y": 1.333333333
        },
        {
          "x": 0.020773639,
          "y": 1.258503401
        },
        {
          "x": 0.040830946,
          "y": 1.183673469
        },
        {
          "x": 0.06017192,
          "y": 1.108843537
        },
        {
          "x": 0.080945559,
          "y": 1.027210884
        },
        {
          "x": 0.099570201,
          "y": 0.952380952
        },
        {
          "x": 0.12034384,
          "y": 0.863945578
        },
        {
          "x": 0.140401146,
          "y": 0.775510204
        },
        {
          "x": 0.157593123,
          "y": 0.700680272
        },
        {
          "x": 0.178366762,
          "y": 0.605442177
        },
        {
          "x": 0.196275072,
          "y": 0.517006803
        },
        {
          "x": 0.211318052,
          "y": 0.442176871
        },
        {
          "x": 0.229226361,
          "y": 0.353741497
        },
        {
          "x": 0.25,
          "y": 0.244897959
        }
      ]
    },
    {
      "N": 13,
      "dataPoints": [
        {
          "x": 0,
          "y": 1.632653061
        },
        {
          "x": 0.020773639,
          "y": 1.551020408
        },
        {
          "x": 0.040830946,
          "y": 1.469387755
        },
        {
          "x": 0.06017192,
          "y": 1.387755102
        },
        {
          "x": 0.080229226,
          "y": 1.299319728
        },
        {
          "x": 0.100286533,
          "y": 1.210884354
        },
        {
          "x": 0.12034384,
          "y": 1.115646259
        },
        {
          "x": 0.139684814,
          "y": 1.020408163
        },
        {
          "x": 0.159025788,
          "y": 0.925170068
        },
        {
          "x": 0.179083095,
          "y": 0.823129252
        },
        {
          "x": 0.199856734,
          "y": 0.714285714
        },
        {
          "x": 0.21991404,
          "y": 0.605442177
        },
        {
          "x": 0.23782235,
          "y": 0.503401361
        },
        {
          "x": 0.25,
          "y": 0.43537415
        }
      ]
    },
    {
      "N": 14,
      "dataPoints": [
        {
          "x": 0,
          "y": 1.904761905
        },
        {
          "x": 0.020773639,
          "y": 1.823129252
        },
        {
          "x": 0.039398281,
          "y": 1.741496599
        },
        {
          "x": 0.059455587,
          "y": 1.653061224
        },
        {
          "x": 0.080945559,
          "y": 1.551020408
        },
        {
          "x": 0.101002865,
          "y": 1.455782313
        },
        {
          "x": 0.121060172,
          "y": 1.353741497
        },
        {
          "x": 0.141117479,
          "y": 1.25170068
        },
        {
          "x": 0.160458453,
          "y": 1.149659864
        },
        {
          "x": 0.180515759,
          "y": 1.040816327
        },
        {
          "x": 0.199856734,
          "y": 0.931972789
        },
        {
          "x": 0.21991404,
          "y": 0.816326531
        },
        {
          "x": 0.239971347,
          "y": 0.693877551
        },
        {
          "x": 0.25,
          "y": 0.632653061
        }
      ]
    },
    {
      "N": 15,
      "dataPoints": [
        {
          "x": 0,
          "y": 2.197278912
        },
        {
          "x": 0.020773639,
          "y": 2.102040816
        },
        {
          "x": 0.040830946,
          "y": 2.006802721
        },
        {
          "x": 0.060888252,
          "y": 1.911564626
        },
        {
          "x": 0.080229226,
          "y": 1.816326531
        },
        {
          "x": 0.100286533,
          "y": 1.714285714
        },
        {
          "x": 0.12034384,
          "y": 1.605442177
        },
        {
          "x": 0.140401146,
          "y": 1.496598639
        },
        {
          "x": 0.15974212,
          "y": 1.387755102
        },
        {
          "x": 0.180515759,
          "y": 1.265306122
        },
        {
          "x": 0.199856734,
          "y": 1.149659864
        },
        {
          "x": 0.21991404,
          "y": 1.027210884
        },
        {
          "x": 0.239255014,
          "y": 0.904761905
        },
        {
          "x": 0.25,
          "y": 0.836734694
        }
      ]
    },
    {
      "N": 16,
      "dataPoints": [
        {
          "x": 0,
          "y": 2.496598639
        },
        {
          "x": 0.020057307,
          "y": 2.394557823
        },
        {
          "x": 0.040114613,
          "y": 2.292517007
        },
        {
          "x": 0.060888252,
          "y": 2.183673469
        },
        {
          "x": 0.080229226,
          "y": 2.081632653
        },
        {
          "x": 0.100286533,
          "y": 1.965986395
        },
        {
          "x": 0.12034384,
          "y": 1.850340136
        },
        {
          "x": 0.140401146,
          "y": 1.734693878
        },
        {
          "x": 0.15974212,
          "y": 1.612244898
        },
        {
          "x": 0.179799427,
          "y": 1.489795918
        },
        {
          "x": 0.199856734,
          "y": 1.360544218
        },
        {
          "x": 0.21991404,
          "y": 1.224489796
        },
        {
          "x": 0.239255014,
          "y": 1.095238095
        },
        {
          "x": 0.25,
          "y": 1.020408163
        }
      ]
    },
    {
      "N": 17,
      "dataPoints": [
        {
          "x": 0,
          "y": 2.795918367
        },
        {
          "x": 0.020773639,
          "y": 2.68707483
        },
        {
          "x": 0.040114613,
          "y": 2.578231293
        },
        {
          "x": 0.06017192,
          "y": 2.462585034
        },
        {
          "x": 0.080229226,
          "y": 2.346938776
        },
        {
          "x": 0.100286533,
          "y": 2.224489796
        },
        {
          "x": 0.12034384,
          "y": 2.095238095
        },
        {
          "x": 0.139684814,
          "y": 1.972789116
        },
        {
          "x": 0.160458453,
          "y": 1.836734694
        },
        {
          "x": 0.179799427,
          "y": 1.700680272
        },
        {
          "x": 0.199856734,
          "y": 1.56462585
        },
        {
          "x": 0.21991404,
          "y": 1.421768707
        },
        {
          "x": 0.239971347,
          "y": 1.272108844
        },
        {
          "x": 0.25,
          "y": 1.197278912
        }
      ]
    },
    {
      "N": 18,
      "dataPoints": [
        {
          "x": 0,
          "y": 3.081632653
        },
        {
          "x": 0.020773639,
          "y": 2.959183673
        },
        {
          "x": 0.039398281,
          "y": 2.850340136
        },
        {
          "x": 0.06017192,
          "y": 2.727891156
        },
        {
          "x": 0.080229226,
          "y": 2.605442177
        },
        {
          "x": 0.100286533,
          "y": 2.476190476
        },
        {
          "x": 0.119627507,
          "y": 2.346938776
        },
        {
          "x": 0.139684814,
          "y": 2.210884354
        },
        {
          "x": 0.15974212,
          "y": 2.068027211
        },
        {
          "x": 0.179799427,
          "y": 1.925170068
        },
        {
          "x": 0.199856734,
          "y": 1.782312925
        },
        {
          "x": 0.219197708,
          "y": 1.632653061
        },
        {
          "x": 0.239255014,
          "y": 1.482993197
        },
        {
          "x": 0.25,
          "y": 1.394557823
        }
      ]
    },
    {
      "N": 19,
      "dataPoints": [
        {
          "x": 0,
          "y": 3.340136054
        },
        {
          "x": 0.020057307,
          "y": 3.224489796
        },
        {
          "x": 0.041547278,
          "y": 3.095238095
        },
        {
          "x": 0.060888252,
          "y": 2.972789116
        },
        {
          "x": 0.080229226,
          "y": 2.850340136
        },
        {
          "x": 0.100286533,
          "y": 2.721088435
        },
        {
          "x": 0.12034384,
          "y": 2.585034014
        },
        {
          "x": 0.140401146,
          "y": 2.442176871
        },
        {
          "x": 0.161174785,
          "y": 2.292517007
        },
        {
          "x": 0.180515759,
          "y": 2.149659864
        },
        {
          "x": 0.199856734,
          "y": 2
        },
        {
          "x": 0.21991404,
          "y": 1.843537415
        },
        {
          "x": 0.239971347,
          "y": 1.680272109
        },
        {
          "x": 0.25,
          "y": 1.598639456
        }
      ]
    },
    {
      "N": 20,
      "dataPoints": [
        {
          "x": 0,
          "y": 3.639455782
        },
        {
          "x": 0.020773639,
          "y": 3.510204082
        },
        {
          "x": 0.040114613,
          "y": 3.387755102
        },
        {
          "x": 0.06017192,
          "y": 3.258503401
        },
        {
          "x": 0.080229226,
          "y": 3.12244898
        },
        {
          "x": 0.101002865,
          "y": 2.979591837
        },
        {
          "x": 0.12034384,
          "y": 2.843537415
        },
        {
          "x": 0.140401146,
          "y": 2.693877551
        },
        {
          "x": 0.15974212,
          "y": 2.544217687
        },
        {
          "x": 0.180515759,
          "y": 2.380952381
        },
        {
          "x": 0.199856734,
          "y": 2.224489796
        },
        {
          "x": 0.21991404,
          "y": 2.054421769
        },
        {
          "x": 0.239255014,
          "y": 1.884353741
        },
        {
          "x": 0.25,
          "y": 1.795918367
        }
      ]
    },
    {
      "N": 21,
      "dataPoints": [
        {
          "x": 0,
          "y": 3.911564626
        },
        {
          "x": 0.020057307,
          "y": 3.775510204
        },
        {
          "x": 0.040114613,
          "y": 3.639455782
        },
        {
          "x": 0.06017192,
          "y": 3.503401361
        },
        {
          "x": 0.080229226,
          "y": 3.367346939
        },
        {
          "x": 0.100286533,
          "y": 3.224489796
        },
        {
          "x": 0.12034384,
          "y": 3.074829932
        },
        {
          "x": 0.139684814,
          "y": 2.925170068
        },
        {
          "x": 0.15974212,
          "y": 2.768707483
        },
        {
          "x": 0.180515759,
          "y": 2.598639456
        },
        {
          "x": 0.199856734,
          "y": 2.43537415
        },
        {
          "x": 0.21991404,
          "y": 2.265306122
        },
        {
          "x": 0.239255014,
          "y": 2.088435374
        },
        {
          "x": 0.25,
          "y": 1.993197279
        }
      ]
    },
    {
      "N": 22,
      "dataPoints": [
        {
          "x": 0.03008596,
          "y": 3.993197279
        },
        {
          "x": 0.050143266,
          "y": 3.850340136
        },
        {
          "x": 0.070200573,
          "y": 3.700680272
        },
        {
          "x": 0.089541547,
          "y": 3.557823129
        },
        {
          "x": 0.110315186,
          "y": 3.401360544
        },
        {
          "x": 0.12965616,
          "y": 3.244897959
        },
        {
          "x": 0.150429799,
          "y": 3.081632653
        },
        {
          "x": 0.169770774,
          "y": 2.911564626
        },
        {
          "x": 0.18982808,
          "y": 2.741496599
        },
        {
          "x": 0.209885387,
          "y": 2.56462585
        },
        {
          "x": 0.229942693,
          "y": 2.380952381
        },
        {
          "x": 0.25,
          "y": 2.197278912
        }
      ]
    },
    {
      "N": 23,
      "dataPoints": [
        {
          "x": 0.070200573,
          "y": 3.993197279
        },
        {
          "x": 0.089541547,
          "y": 3.836734694
        },
        {
          "x": 0.109598854,
          "y": 3.673469388
        },
        {
          "x": 0.12965616,
          "y": 3.510204082
        },
        {
          "x": 0.148997135,
          "y": 3.340136054
        },
        {
          "x": 0.169054441,
          "y": 3.163265306
        },
        {
          "x": 0.18982808,
          "y": 2.979591837
        },
        {
          "x": 0.209885387,
          "y": 2.789115646
        },
        {
          "x": 0.229942693,
          "y": 2.591836735
        },
        {
          "x": 0.25,
          "y": 2.394557823
        }
      ]
    },
    {
      "N": 24,
      "dataPoints": [
        {
          "x": 0.099570201,
          "y": 4
        },
        {
          "x": 0.119627507,
          "y": 3.829931973
        },
        {
          "x": 0.138968481,
          "y": 3.659863946
        },
        {
          "x": 0.156876791,
          "y": 3.496598639
        },
        {
          "x": 0.174068768,
          "y": 3.340136054
        },
        {
          "x": 0.18982808,
          "y": 3.19047619
        },
        {
          "x": 0.203438395,
          "y": 3.047619048
        },
        {
          "x": 0.221346705,
          "y": 2.863945578
        },
        {
          "x": 0.237106017,
          "y": 2.693877551
        },
        {
          "x": 0.25,
          "y": 2.557823129
        }
      ]
    }
  ],
  "insideB": [
    {
      "N": 1,
      "dataPoints": [
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0.25,
          "y": 2
        }
      ]
    },
    {
      "N": 2,
      "dataPoints": [
        {
          "x": 0,
          "y": 1.37623762376237
        },
        {
          "x": 0.0202513966480446,
          "y": 1.38283828382838
        },
        {
          "x": 0.0384078212290502,
          "y": 1.38943894389438
        },
        {
          "x": 0.0600558659217877,
          "y": 1.39933993399339
        },
        {
          "x": 0.0803072625698324,
          "y": 1.4092409240924
        },
        {
          "x": 0.102653631284916,
          "y": 1.42244224422442
        },
        {
          "x": 0.13058659217877,
          "y": 1.43894389438943
        },
        {
          "x": 0.150837988826815,
          "y": 1.45214521452145
        },
        {
          "x": 0.170391061452513,
          "y": 1.46534653465346
        },
        {
          "x": 0.190642458100558,
          "y": 1.48184818481848
        },
        {
          "x": 0.212290502793296,
          "y": 1.49834983498349
        },
        {
          "x": 0.229748603351955,
          "y": 1.51155115511551
        },
        {
          "x": 0.25,
          "y": 1.53135313531353
        }
      ]
    },
    {
      "N": 3,
      "dataPoints": [
        {
          "x": 0,
          "y": 1.17161716171617
        },
        {
          "x": 0.0202513966480446,
          "y": 1.18151815181518
        },
        {
          "x": 0.039804469273743,
          "y": 1.18811881188118
        },
        {
          "x": 0.0614525139664804,
          "y": 1.2013201320132
        },
        {
          "x": 0.0817039106145251,
          "y": 1.21452145214521
        },
        {
          "x": 0.100558659217877,
          "y": 1.22772277227722
        },
        {
          "x": 0.118016759776536,
          "y": 1.24092409240924
        },
        {
          "x": 0.131284916201117,
          "y": 1.25412541254125
        },
        {
          "x": 0.150837988826815,
          "y": 1.27392739273927
        },
        {
          "x": 0.169692737430167,
          "y": 1.29372937293729
        },
        {
          "x": 0.189944134078212,
          "y": 1.31683168316831
        },
        {
          "x": 0.210195530726257,
          "y": 1.34323432343234
        },
        {
          "x": 0.229748603351955,
          "y": 1.36963696369636
        },
        {
          "x": 0.25,
          "y": 1.39933993399339
        }
      ]
    },
    {
      "N": 4,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.92079207920792
        },
        {
          "x": 0.0202513966480446,
          "y": 0.94059405940594
        },
        {
          "x": 0.0412011173184357,
          "y": 0.957095709570957
        },
        {
          "x": 0.060754189944134,
          "y": 0.976897689768977
        },
        {
          "x": 0.0810055865921787,
          "y": 0.996699669966996
        },
        {
          "x": 0.104050279329608,
          "y": 1.02310231023102
        },
        {
          "x": 0.126396648044692,
          "y": 1.04950495049504
        },
        {
          "x": 0.150139664804469,
          "y": 1.07920792079207
        },
        {
          "x": 0.169692737430167,
          "y": 1.1056105610561
        },
        {
          "x": 0.189245810055865,
          "y": 1.13201320132013
        },
        {
          "x": 0.210195530726257,
          "y": 1.16501650165016
        },
        {
          "x": 0.229748603351955,
          "y": 1.19471947194719
        },
        {
          "x": 0.25,
          "y": 1.22772277227722
        }
      ]
    },
    {
      "N": 5,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.65016501650165
        },
        {
          "x": 0.0202513966480446,
          "y": 0.679867986798679
        },
        {
          "x": 0.039804469273743,
          "y": 0.706270627062706
        },
        {
          "x": 0.060754189944134,
          "y": 0.735973597359736
        },
        {
          "x": 0.0803072625698324,
          "y": 0.765676567656765
        },
        {
          "x": 0.0998603351955307,
          "y": 0.795379537953795
        },
        {
          "x": 0.120111731843575,
          "y": 0.828382838283828
        },
        {
          "x": 0.14036312849162,
          "y": 0.861386138613861
        },
        {
          "x": 0.160614525139664,
          "y": 0.894389438943894
        },
        {
          "x": 0.180167597765363,
          "y": 0.927392739273927
        },
        {
          "x": 0.199720670391061,
          "y": 0.963696369636963
        },
        {
          "x": 0.218575418994413,
          "y": 0.996699669966996
        },
        {
          "x": 0.238128491620111,
          "y": 1.03300330033003
        },
        {
          "x": 0.25,
          "y": 1.05940594059405
        }
      ]
    },
    {
      "N": 6,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.382838283828382
        },
        {
          "x": 0.0202513966480446,
          "y": 0.415841584158415
        },
        {
          "x": 0.0405027932960893,
          "y": 0.452145214521452
        },
        {
          "x": 0.0614525139664804,
          "y": 0.488448844884488
        },
        {
          "x": 0.079608938547486,
          "y": 0.521452145214521
        },
        {
          "x": 0.0998603351955307,
          "y": 0.557755775577557
        },
        {
          "x": 0.120810055865921,
          "y": 0.597359735973597
        },
        {
          "x": 0.14036312849162,
          "y": 0.636963696369637
        },
        {
          "x": 0.159916201117318,
          "y": 0.676567656765676
        },
        {
          "x": 0.180167597765363,
          "y": 0.719471947194719
        },
        {
          "x": 0.200418994413407,
          "y": 0.762376237623762
        },
        {
          "x": 0.221368715083798,
          "y": 0.808580858085808
        },
        {
          "x": 0.24022346368715,
          "y": 0.851485148514851
        },
        {
          "x": 0.25,
          "y": 0.874587458745874
        }
      ]
    },
    {
      "N": 7,
      "dataPoints": [
        {
          "x": 0,
          "y": 0.0924092409240924
        },
        {
          "x": 0.0202513966480446,
          "y": 0.132013201320132
        },
        {
          "x": 0.0405027932960893,
          "y": 0.174917491749174
        },
        {
          "x": 0.060754189944134,
          "y": 0.217821782178217
        },
        {
          "x": 0.0803072625698324,
          "y": 0.26072607260726
        },
        {
          "x": 0.0998603351955307,
          "y": 0.303630363036303
        },
        {
          "x": 0.119413407821229,
          "y": 0.349834983498349
        },
        {
          "x": 0.139664804469273,
          "y": 0.399339933993399
        },
        {
          "x": 0.159916201117318,
          "y": 0.448844884488448
        },
        {
          "x": 0.180167597765363,
          "y": 0.498349834983498
        },
        {
          "x": 0.199720670391061,
          "y": 0.547854785478547
        },
        {
          "x": 0.219273743016759,
          "y": 0.6006600660066
        },
        {
          "x": 0.238128491620111,
          "y": 0.65016501650165
        },
        {
          "x": 0.25,
          "y": 0.683168316831683
        }
      ]
    },
    {
      "N": 8,
      "dataPoints": [
        {
          "x": 0.0747206703910614,
          "y": 0
        },
        {
          "x": 0.0900837988826815,
          "y": 0.0396039603960396
        },
        {
          "x": 0.108938547486033,
          "y": 0.0891089108910891
        },
        {
          "x": 0.129888268156424,
          "y": 0.141914191419141
        },
        {
          "x": 0.150139664804469,
          "y": 0.198019801980198
        },
        {
          "x": 0.168994413407821,
          "y": 0.25082508250825
        },
        {
          "x": 0.189245810055865,
          "y": 0.31023102310231
        },
        {
          "x": 0.210195530726257,
          "y": 0.372937293729372
        },
        {
          "x": 0.229748603351955,
          "y": 0.435643564356435
        },
        {
          "x": 0.25,
          "y": 0.501650165016501
        }
      ]
    },
    {
      "N": 9,
      "dataPoints": [
        {
          "x": 0.159217877094972,
          "y": 0
        },
        {
          "x": 0.180167597765363,
          "y": 0.0693069306930693
        },
        {
          "x": 0.199720670391061,
          "y": 0.135313531353135
        },
        {
          "x": 0.219972067039106,
          "y": 0.204620462046204
        },
        {
          "x": 0.239525139664804,
          "y": 0.273927392739273
        },
        {
          "x": 0.25,
          "y": 0.313531353135313
        }
      ]
    },
    {
      "N": 10,
      "dataPoints": [
        {
          "x": 0.219972067039106,
          "y": 0
        },
        {
          "x": 0.229748603351955,
          "y": 0.0429042904290429
        },
        {
          "x": 0.24022346368715,
          "y": 0.0858085808580858
        },
        {
          "x": 0.25,
          "y": 0.128712871287128
        }
      ]
    }
  ]
};

// Derived numerical line models, not page images. Source: Waygate Radiographic Film Systems, pp. 14, 16.
// Extracted from PDF vector coordinates and checked visually. Graphical precision only.
// X-ray: steel, constant potential, Pb screens, density 2, FFD 1 m, G135 at 28 C, 8 min cycle.
// Gamma: steel, Ir-192, Pb screens, density 2, SFD 1 m, 10–90 mm.
const XRAY_CHARTS = {
  "D5": [
    {
      "kv": 100,
      "minThickness": 1,
      "maxThickness": 7.846522,
      "log10Slope": 0.221734128,
      "log10Intercept": 0.263233267
    },
    {
      "kv": 120,
      "minThickness": 1,
      "maxThickness": 13.035792,
      "log10Slope": 0.141917022,
      "log10Intercept": 0.153074233
    },
    {
      "kv": 140,
      "minThickness": 1,
      "maxThickness": 19.106859,
      "log10Slope": 0.103126957,
      "log10Intercept": 0.032631267
    },
    {
      "kv": 160,
      "minThickness": 2.672692,
      "maxThickness": 24.542043,
      "log10Slope": 0.091416821,
      "log10Intercept": -0.240496395
    },
    {
      "kv": 180,
      "minThickness": 4.011085,
      "maxThickness": 31.43951,
      "log10Slope": 0.072888862,
      "log10Intercept": -0.287777541
    },
    {
      "kv": 200,
      "minThickness": 5.99536,
      "maxThickness": 36.910414,
      "log10Slope": 0.064627617,
      "log10Intercept": -0.382105063
    },
    {
      "kv": 220,
      "minThickness": 9.241145,
      "maxThickness": 39.971155,
      "log10Slope": 0.054696345,
      "log10Intercept": -0.500096135
    },
    {
      "kv": 240,
      "minThickness": 11.102505,
      "maxThickness": 39.971183,
      "log10Slope": 0.050940542,
      "log10Intercept": -0.560206885
    },
    {
      "kv": 260,
      "minThickness": 14.333052,
      "maxThickness": 39.971183,
      "log10Slope": 0.046239957,
      "log10Intercept": -0.658173774
    }
  ],
  "D7": [
    {
      "kv": 100,
      "minThickness": 1,
      "maxThickness": 8.337262,
      "log10Slope": 0.213615934,
      "log10Intercept": 0.218251646
    },
    {
      "kv": 120,
      "minThickness": 1,
      "maxThickness": 13.247819,
      "log10Slope": 0.150830364,
      "log10Intercept": 0.001038863
    },
    {
      "kv": 140,
      "minThickness": 1.37039,
      "maxThickness": 21.503588,
      "log10Slope": 0.09905814,
      "log10Intercept": -0.130897412
    },
    {
      "kv": 160,
      "minThickness": 4.224832,
      "maxThickness": 26.59833,
      "log10Slope": 0.089139263,
      "log10Intercept": -0.371747546
    },
    {
      "kv": 180,
      "minThickness": 6.37304,
      "maxThickness": 34.27095,
      "log10Slope": 0.071487688,
      "log10Intercept": -0.449973905
    },
    {
      "kv": 200,
      "minThickness": 9.196488,
      "maxThickness": 39.703356,
      "log10Slope": 0.065332255,
      "log10Intercept": -0.594439686
    },
    {
      "kv": 220,
      "minThickness": 11.743802,
      "maxThickness": 39.882328,
      "log10Slope": 0.052898602,
      "log10Intercept": -0.614843082
    },
    {
      "kv": 240,
      "minThickness": 14.321966,
      "maxThickness": 39.882184,
      "log10Slope": 0.049169645,
      "log10Intercept": -0.697818363
    },
    {
      "kv": 260,
      "minThickness": 19.109924,
      "maxThickness": 39.882471,
      "log10Slope": 0.048054623,
      "log10Intercept": -0.912700222
    }
  ],
  "D2": [
    {
      "kv": 140,
      "minThickness": 1,
      "maxThickness": 12.161097,
      "log10Slope": 0.10092715,
      "log10Intercept": 0.769670584
    },
    {
      "kv": 160,
      "minThickness": 1,
      "maxThickness": 16.77257,
      "log10Slope": 0.08937326,
      "log10Intercept": 0.499590067
    },
    {
      "kv": 180,
      "minThickness": 1,
      "maxThickness": 22.306081,
      "log10Slope": 0.070993025,
      "log10Intercept": 0.413477835
    },
    {
      "kv": 200,
      "minThickness": 1,
      "maxThickness": 26.487314,
      "log10Slope": 0.061781347,
      "log10Intercept": 0.361668931
    },
    {
      "kv": 220,
      "minThickness": 1,
      "maxThickness": 32.451093,
      "log10Slope": 0.052616379,
      "log10Intercept": 0.291400961
    },
    {
      "kv": 240,
      "minThickness": 1,
      "maxThickness": 35.955744,
      "log10Slope": 0.050769884,
      "log10Intercept": 0.168524362
    },
    {
      "kv": 260,
      "minThickness": 1,
      "maxThickness": 39.962304,
      "log10Slope": 0.047061673,
      "log10Intercept": 0.070268503
    }
  ],
  "D3": [
    {
      "kv": 120,
      "minThickness": 1,
      "maxThickness": 9.547689,
      "log10Slope": 0.131514331,
      "log10Intercept": 0.736350311
    },
    {
      "kv": 140,
      "minThickness": 1,
      "maxThickness": 14.203275,
      "log10Slope": 0.106379664,
      "log10Intercept": 0.481065761
    },
    {
      "kv": 160,
      "minThickness": 1,
      "maxThickness": 19.594165,
      "log10Slope": 0.089757848,
      "log10Intercept": 0.233272486
    },
    {
      "kv": 180,
      "minThickness": 1,
      "maxThickness": 26.260765,
      "log10Slope": 0.068845159,
      "log10Intercept": 0.184067435
    },
    {
      "kv": 200,
      "minThickness": 1,
      "maxThickness": 31.359882,
      "log10Slope": 0.059268958,
      "log10Intercept": 0.134098411
    },
    {
      "kv": 220,
      "minThickness": 1,
      "maxThickness": 36.260665,
      "log10Slope": 0.052708388,
      "log10Intercept": 0.081019181
    },
    {
      "kv": 240,
      "minThickness": 1.360154,
      "maxThickness": 39.854601,
      "log10Slope": 0.050045791,
      "log10Intercept": -0.064821751
    },
    {
      "kv": 260,
      "minThickness": 2.830131,
      "maxThickness": 39.854543,
      "log10Slope": 0.04289908,
      "log10Intercept": -0.118161785
    }
  ],
  "D4": [
    {
      "kv": 100,
      "minThickness": 1,
      "maxThickness": 6.506753,
      "log10Slope": 0.216071179,
      "log10Intercept": 0.599259957
    },
    {
      "kv": 120,
      "minThickness": 1,
      "maxThickness": 10.936652,
      "log10Slope": 0.150845253,
      "log10Intercept": 0.355431076
    },
    {
      "kv": 140,
      "minThickness": 1,
      "maxThickness": 17.151974,
      "log10Slope": 0.101734799,
      "log10Intercept": 0.261784465
    },
    {
      "kv": 160,
      "minThickness": 1,
      "maxThickness": 22.013177,
      "log10Slope": 0.091604949,
      "log10Intercept": -0.011324146
    },
    {
      "kv": 180,
      "minThickness": 1,
      "maxThickness": 29.427765,
      "log10Slope": 0.069744593,
      "log10Intercept": -0.046185941
    },
    {
      "kv": 200,
      "minThickness": 1.768551,
      "maxThickness": 34.196331,
      "log10Slope": 0.06162914,
      "log10Intercept": -0.100504117
    },
    {
      "kv": 220,
      "minThickness": 4.752868,
      "maxThickness": 40,
      "log10Slope": 0.055278315,
      "log10Intercept": -0.254240378
    },
    {
      "kv": 240,
      "minThickness": 7.06034,
      "maxThickness": 39.990834,
      "log10Slope": 0.050777791,
      "log10Intercept": -0.350018308
    },
    {
      "kv": 260,
      "minThickness": 10.444966,
      "maxThickness": 39.991092,
      "log10Slope": 0.047430172,
      "log10Intercept": -0.486916391
    }
  ]
};
const GAMMA_CHARTS = {
  "D4": {
    "log10Slope": 0.024979402,
    "log10Intercept": 0.455730535,
    "minThickness": 10,
    "maxThickness": 90
  },
  "D5": {
    "log10Slope": 0.024979163,
    "log10Intercept": 0.15800619,
    "minThickness": 10,
    "maxThickness": 90
  },
  "D7": {
    "log10Slope": 0.024991383,
    "log10Intercept": -0.029691636,
    "minThickness": 10,
    "maxThickness": 90
  }
};

const SOURCES = Object.freeze({
  iso1: 'https://weldcalc.ssab.com/sisStandards/ISO%2017636-1.pdf',
  iso2: 'https://weldcalc.ssab.com/sisStandards/ISO%2017636-2.pdf',
  film: 'https://dam.bakerhughes.com/m/15e84aab13c9d73d/original/Radiographic-Film-Systems-Brochure_EN_LR.pdf',
  decay: 'https://www.lnhb.fr/nuclides/Ir-192_tables.pdf',
  cr: 'https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1561_web.pdf',
});
const MATERIALS = { steel: 'Ocel', aluminum: 'Hliník', titanium: 'Titan', copper_nickel: 'Měď / nikl' };
const HALF_LIFE_DAYS = 73.827;
const CALCULATION_VERSION = '2026-09-06.1';
// Product scope, not a normative exposure limit. Over one day the integrated
// activity differs by <0.5% from the constant-activity approximation used here.
const MAX_GAMMA_MINUTES = 24 * 60;

function positive(value, name='Hodnota') {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name}: zadejte kladné konečné číslo.`);
  return value;
}
function nonnegative(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name}: zadejte nulu nebo kladné číslo.`);
  return value;
}
function testingClass(value) {
  if (!['A','B'].includes(value)) throw new Error('Vyberte třídu A nebo B.');
}
function materialKey(value) {
  if (!Object.hasOwn(MATERIALS,value)) throw new Error('Vyberte podporovaný materiál.');
}
function formatDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > Number.MAX_SAFE_INTEGER/60) return 'Mimo rozsah';
  const seconds = Math.round(minutes*60);
  if (seconds===0) return '< 1 s';
  return `${Math.floor(seconds/60)} min ${seconds%60} s`;
}
function interpolate(points, x, logarithmic=false) {
  if (!Number.isFinite(x) || !points?.length || x<points[0].x || x>points.at(-1).x) return null;
  const exact=points.find(p=>p.x===x);
  if (exact) return exact.y;
  const high=points.findIndex(p=>p.x>x),a=points[high-1],b=points[high];
  if (!a || !b) return null;
  const q=(x-a.x)/(b.x-a.x);
  if (logarithmic) return Math.exp(Math.log(positive(a.y))*(1-q)+Math.log(positive(b.y))*q);
  return a.y+(b.y-a.y)*q;
}

// Annex A curves are region boundaries. Clip only to the printed plotting
// rectangle; do not extrapolate incomplete curves into invented thresholds.
function nomogramBoundary(line,x,outside) {
  const p=line.dataPoints;
  if(x<p[0].x)return outside?4:0;
  if(x>p.at(-1).x)return 0;
  return interpolate(p,x);
}
function countAt(lines,x,y,outside) {
  const sorted=[...lines].sort((a,b)=>a.N-b.N);
  return sorted.find(l=>outside?y<=nomogramBoundary(l,x,true):y>=nomogramBoundary(l,x,false))?.N ?? null;
}
function exposureCount({technique,qualityClass,thickness,diameter,distance}) {
  testingClass(qualityClass);
  positive(thickness,'Tloušťka stěny');positive(diameter,'Průměr');positive(distance,'Vzdálenost');
  if(!['outside','inside','double'].includes(technique))throw new Error('Vyberte techniku prozařování.');
  const x=thickness/diameter,y=diameter/distance,outside=technique==='outside';
  if(x>.25)throw new Error('Mimo nomogram: t/De musí být nejvýše 0,25.');
  if(outside && y>4)throw new Error('Mimo nomogram: De/f musí být nejvýše 4.');
  if(technique==='double' && distance<=diameter)throw new Error('Zdroj musí ležet vně trubky: SFD musí být větší než De.');
  if(technique==='inside' && (distance<diameter/2 || distance>=diameter-thickness))throw new Error('Zdroj musí ležet v dutině: De/2 ≤ SFD < De − t. Oblast uvnitř stěny není přípustná.');
  const key=(outside?'outside':'inside')+qualityClass,lines=NOMOGRAMS[key];
  const centered=technique==='inside' && Math.abs(y-2)<1e-12;
  const nominal=centered?1:countAt(lines,x,y,outside);
  // Coordinate reading uncertainty of the supplied digitisation. Use the higher
  // count near a boundary, never fractional interpolation of exposure numbers.
  let count=nominal;
  if(!centered) {
    const candidates=[x,Math.max(0,x-.001),Math.min(.25,x+.001)].map(px=>countAt(lines,px,outside?Math.min(4,y+.01):Math.max(0,y-.01),outside));
    count=candidates.some(n=>n===null)?null:Math.max(nominal??0,...candidates);
  }
  return {count,nominal,nearBoundary:count!==nominal,x,y,lines,outside,yMax:outside?4:2,
    figure:outside?(qualityClass==='B'?'A.1':'A.3'):(qualityClass==='B'?'A.2':'A.4'),
    maxCount:Math.max(...lines.map(l=>l.N)),centered};
}

function unsharpness({focus,sourceDistance,thickness,gap=0,diameter,technique='single',qualityClass='B',planar=false}) {
  positive(focus,'Ohnisko');positive(sourceDistance,'Vzdálenost zdroj–předmět');positive(thickness,'Tloušťka stěny');nonnegative(gap,'Mezera');testingClass(qualityClass);
  if(!['single','dwsi','dwdi'].includes(technique))throw new Error('Nepodporovaná geometrie.');
  if(technique!=='single') {
    positive(diameter,'Průměr');if(diameter<=2*thickness)throw new Error('Průměr musí být větší než dvě tloušťky stěny.');
  }
  const f=sourceDistance+(technique==='dwsi'?diameter-thickness:0);
  const b=(technique==='dwdi'?diameter:thickness)+gap;
  const effectiveB=technique==='dwdi'?diameter:(b<1.2*thickness?thickness:b);
  const coefficient=qualityClass==='B'||planar?15:7.5;
  const minF=coefficient*focus*effectiveB**(2/3);
  return {ug:focus*b/f,f,b,minF,passes:f>=minF,minInputDistance:Math.max(0,minF-(technique==='dwsi'?diameter-thickness:0)),coefficient};
}

function maximumVoltage(material,thickness) {
  materialKey(material);positive(thickness,'Prozářená tloušťka');
  const c={steel:[100,7.5,40,.64],aluminum:[40,2.5,24,.43],titanium:[70,4,35,.5],copper_nickel:[120,9,48,.65]}[material];
  const value=thickness<=10?c[0]+c[1]*thickness:c[2]*thickness**c[3];
  return value<=1000?value:null;
}
function activityAt(activity,referenceTime,exposureTime) {
  positive(activity,'Aktivita');
  const start=new Date(referenceTime).getTime(),end=new Date(exposureTime).getTime();
  if(!Number.isFinite(start)||!Number.isFinite(end))throw new Error('Zadejte datum a čas aktivity i expozice.');
  if(end<start)throw new Error('Datum expozice nesmí předcházet referenční aktivitě.');
  return positive(activity*2**(-(end-start)/86400000/HALF_LIFE_DAYS),'Vypočtená aktivita');
}
function gammaTime({activity,referenceTime,exposureTime,thickness,distance,film},{historical=false}={}) {
  positive(thickness,'Prozářená tloušťka');positive(distance,'SFD');
  const curve=GAMMA_CHARTS[film];if(!curve)throw new Error('Pro tento film není dostupný diagram Ir‑192.');
  if(thickness<10 || thickness>90)throw new Error('Diagram Ir‑192 platí pro ocel 10–90 mm.');
  const currentActivity=activityAt(activity,referenceTime,exposureTime);
  const ciHours=10**(curve.log10Intercept+curve.log10Slope*thickness);
  const gbqHours=ciHours*37;
  const minutes=positive(gbqHours/currentActivity*60*(distance/1000)**2);
  if(!historical&&minutes>MAX_GAMMA_MINUTES)throw new Error('Odhad přesahuje podporovaných 24 hodin. Zkontrolujte aktivitu v GBq, datum a vzdálenost. Pro delší expozici použijte samostatně ověřený postup zohledňující rozpad zdroje.');
  return {minutes,currentActivity,ciHours,gbqHours};
}
function xrayChartExposure(film,thickness,voltage) {
  positive(thickness,'Prozářená tloušťka');positive(voltage,'Napětí');
  const curves=XRAY_CHARTS[film];if(!curves)throw new Error('Film nemá výrobní diagram.');
  if(voltage<curves[0].kv||voltage>curves.at(-1).kv||thickness<1||thickness>40)throw new Error('Mimo výrobní diagram. Použijte vlastní referenční E.');
  let selected=curves.filter(c=>c.kv===voltage);
  if(!selected.length){const hi=curves.findIndex(c=>c.kv>voltage);selected=[curves[hi-1],curves[hi]];}
  if(selected.some(c=>thickness<c.minThickness||thickness>c.maxThickness))throw new Error('Tloušťka a napětí leží mimo vykreslené křivky. Použijte vlastní referenční E.');
  const points=selected.map(c=>({x:c.kv,y:10**(c.log10Intercept+c.log10Slope*thickness)}));
  return interpolate(points,voltage,true);
}
function xrayTime({exposure,distance,referenceDistance,current}) {
  positive(exposure,'Referenční E');positive(distance,'SFD');positive(referenceDistance,'Referenční SFD');positive(current,'Skutečný proud');
  return positive(exposure*(distance/referenceDistance)**2/current,'Expoziční čas');
}

function snrTarget({material,thickness,voltage,qualityClass,roi='weld',flush=false,cp1=false,iqiConfirmed=false}) {
  materialKey(material);positive(thickness,'Prozářená tloušťka');positive(voltage,'Skutečné napětí');testingClass(qualityClass);
  if(!['weld','haz'].includes(roi))throw new Error('Vyberte místo měření SNR.');
  const light=['aluminum','titanium'].includes(material);
  if(voltage>(light?500:1000))throw new Error('Napětí je mimo podporovanou tabulku SNR_N pro tento materiál.');
  let base;
  if(light)base=qualityClass==='A'?70:(voltage<=150?120:100);
  else if(voltage<=50)base=qualityClass==='A'?100:150;
  else if(qualityClass==='A')base=70;
  else if(voltage<=150)base=120;
  else base=voltage>250&&thickness>50?70:100;
  const roiFactor=roi==='haz'&&!flush?1.4:1;
  if(cp1) {
    const max=maximumVoltage(material,thickness);
    if(!iqiConfirmed||max===null||voltage>max*.8+1e-9)throw new Error('CP I vyžaduje potvrzené IQI / kvalitu obrazu a U ≤ 80 % referenčního napětí.');
  }
  return {base,roiFactor,cpFactor:cp1 ? 0.8 : 1,target:base*roiFactor*(cp1 ? 0.8 : 1),table:light?4:3};
}
function normalizedSnr({measured,kind,srb}) {
  positive(measured,'Naměřené SNR');
  if(kind==='normalized')return measured;
  if(kind!=='raw')throw new Error('Vyberte SNR nebo SNR_N.');
  positive(srb,'Základní prostorové rozlišení SR_b');
  return positive(measured*.0886/srb,'Normalizované SNR_N');
}

const REFERENCE_KEYS=['material','thickness','voltage','setup','screens','scan','delay','srb','magnification','roi','flush'];
function predictCrExposure(reference,current,target) {
  if(!isMeasurement(reference) || reference.legacy)throw new Error('Nejprve zvolte referenční měření z knihovny.');
  reference=createCrMeasurement(reference);
  const changed=REFERENCE_KEYS.filter(k=>typeof reference[k]==='number'?!Number.isFinite(current[k])||Math.abs(reference[k]-current[k])>1e-9:reference[k]!==current[k]);
  if(changed.length)throw new Error('Reference neodpovídá materiálu, tloušťce, napětí, geometrii měření nebo nastavení sestavy. Je potřeba nové měření.');
  positive(reference.achievedSnr,'Referenční SNR_N');positive(reference.exposure,'Referenční expozice');positive(reference.fdd);positive(current.fdd);positive(target);
  return positive(reference.exposure*(current.fdd/reference.fdd)**2*(target/reference.achievedSnr)**2,'Odhadovaná expozice');
}
function createCrMeasurement(input) {
  const name=input.name?.trim(),setup=input.setup?.trim(),scan=input.scan?.trim(),screens=input.screens?.trim();
  if(!name||name.length>120||!setup||!scan||!screens)throw new Error('Vyplňte název, sestavu, fólie/filtraci a nastavení skeneru.');
  positive(input.current,'Skutečný proud');positive(input.seconds,'Skutečný čas');positive(input.fdd,'FDD');positive(input.srb,'SR_b');
  if(input.magnification<1||!Number.isFinite(input.magnification))throw new Error('Zvětšení musí být alespoň 1.');
  nonnegative(input.delay,'Prodleva do skenování');
  if(!input.measuredAt || !Number.isFinite(new Date(input.measuredAt).getTime()))throw new Error('Zadejte datum měření.');
  const target=snrTarget(input),achievedSnr=normalizedSnr(input);
  const exposure=positive(input.current*input.seconds/60,'Skutečná expozice');
  return {...input,name,setup,scan,screens,schema:2,calculationVersion:CALCULATION_VERSION,achievedSnr,exposure,target:target.target,snrPass:achievedSnr>=target.target};
}
function isMeasurement(record) {
  try {
    if(!record||record.schema!==2||typeof record.id!=='string')return false;
    const checked=createCrMeasurement(record);
    return Number.isFinite(checked.exposure)&&Number.isFinite(checked.achievedSnr);
  } catch {return false;}
}

// Functional cross-sections: geometry is schematic, never to scale.
const dimension=(x1,x2,y,label,key)=>`<g class="dimension" data-dimension="${key}"><path d="M${x1} ${y-5}v10m0-5h${x2-x1}m0-5v10"/><text x="${(x1+x2)/2}" y="${y-8}" text-anchor="middle">${label}</text></g>`;
function geometryDiagram(technique,{module='n',compact=false,highlight='distance',gap=20}={}){
 const single=technique==='single',inside=technique==='inside',nearFilm=technique==='outside';
 const source=inside?224:30;
 const front=single?174:158,rear=single?238:302,inner=282;
 const film=nearFilm?181:module==='n'||gap===0?rear+4:322;
 const surface=technique==='dwsi'?inner:front;
 const body=single?'<rect class="object-wall" x="174" y="45" width="64" height="68"/>':'<circle class="object-wall" cx="230" cy="79" r="72"/><circle class="object-void" cx="230" cy="79" r="52"/>';
 const rayEnd=film;
 let dims='';
 if(!compact){
  if(module==='n')dims=dimension(source,nearFilm?front:film,173,nearFilm?'f':'SFD','distance')+dimension(inside?inner:front,inside?rear:front+20,139,'t','thickness');
  else dims=dimension(source,surface,173,technique==='dwsi'?'f′':'f','distance')+dimension(surface,film,203,technique==='dwsi'?'b′':'b','gap')+(gap===0?'':dimension(rear,film,139,'mezera','gap'))+dimension(technique==='dwsi'?inner:front,single?rear:technique==='dwsi'?rear:front+20,139,'t','thickness');
  if(!single)dims+=dimension(front,rear,236,'De','diameter');
 }
 const label=single?'Jedna stěna':inside?'Zdroj uvnitř, film vně':nearFilm?'Zdroj vně, film uvnitř':technique==='dwdi'?'Dvě stěny, hodnocení obou':'Dvě stěny, hodnocení stěny u filmu';
 return `<svg class="geometry-svg ${compact?'geometry-mini':''}" viewBox="0 0 356 ${compact?156:250}" ${compact?'aria-hidden="true"':`role="img" aria-label="${label}. Rozměry jsou schematické."`} data-technique="${technique}" data-highlight="${highlight}">
 ${body}<path class="radiation-ray" d="M${source} 79L${rayEnd} 58M${source} 79L${rayEnd} 100"/>
 ${technique==='dwsi'?'<path class="evaluated-wall" d="M282 63v32"/>':technique==='dwdi'?'<path class="evaluated-wall" d="M158 63v32M282 63v32"/>':''}
 <circle class="source-point" cx="${source}" cy="79" r="7"/><path class="film-line" d="M${film} 51v56"/>
 ${compact?'':`<text class="diagram-label" x="${source}" y="35" text-anchor="middle">Zdroj</text><text class="diagram-label" x="${film}" y="35" text-anchor="middle">Film</text>`}${dims}</svg>${compact?'':'<p class="diagram-caption">Schéma není v měřítku.</p>'}`;
}

function geometryChoices(id,label,options){
 return `<div class="geometry-picker"><h3>${label}</h3><select id="${id}" hidden aria-label="${label}">${options.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select><div class="geometry-options" role="radiogroup" aria-label="${label}">${options.map(([v,t],i)=>`<button type="button" class="geometry-option" role="radio" aria-checked="${i===0}" tabindex="${i===0?0:-1}" data-choice-for="${id}" data-value="${v}">${geometryDiagram(v,{compact:true})}<span>${t}</span></button>`).join('')}</div></div>`;
}

const field$1=(id,label,value='',unit='',hint='',extra='')=>`<div class="field"><label for="${id}">${label}</label><div class="input-unit"><input id="${id}" type="text" data-number inputmode="decimal" autocomplete="off" value="${value}" ${extra} aria-describedby="${id}-hint ${id}-error">${unit?`<span aria-hidden="true">${unit}</span>`:''}</div>${hint?`<small id="${id}-hint">${hint}<span class="sr-only">${unit?' Jednotka: '+unit:''}</span></small>`:`<span id="${id}-hint" class="sr-only">${unit?'Jednotka: '+unit:''}</span>`}<p id="${id}-error" class="field-error"></p></div>`;
const textField=(id,label,placeholder='',limit=160)=>`<div class="field"><label for="${id}">${label}</label><input id="${id}" type="text" maxlength="${limit}" placeholder="${placeholder}" aria-describedby="${id}-error"><p id="${id}-error" class="field-error"></p></div>`;
const date=(id,label)=>`<div class="field"><label for="${id}">${label}</label><input type="datetime-local" id="${id}" aria-describedby="${id}-error"><p id="${id}-error" class="field-error"></p></div>`;
const select$1=(id,label,options)=>`<div class="field"><label for="${id}">${label}</label><select id="${id}" aria-describedby="${id}-error">${options.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select><p id="${id}-error" class="field-error"></p></div>`;
const check=(id,label)=>`<label class="check"><input id="${id}" type="checkbox"><span>${label}</span></label>`;
const material=id=>select$1(id,'Materiál',[['steel','Ocel (Fe)'],['aluminum','Hliník (Al)'],['titanium','Titan (Ti)'],['copper_nickel','Měď / nikl a jejich slitiny']]);
const quality=id=>select$1(id,'Třída zkoušení',[['B','B'],['A','A']]);
const result=(id,label,unit='')=>`<div class="result-card"><span>${label}</span><div class="result-value"><output id="${id}" aria-live="polite">—</output>${unit?`<span class="result-unit">${unit}</span>`:''}</div></div>`;
const error=id=>`<p class="error-message" id="${id}" role="status"></p>`;
const source=(url,text)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${text} ↗</a>`;

function forms() {return `
<section id="exposures" class="tab-pane" role="tabpanel" aria-labelledby="tab-exposures">
 <div class="calc-layout"><div class="form-stack">
  ${geometryChoices('n_technique','Technika prozařování',[['outside','Jedna stěna · zdroj vně'],['double','Dvě stěny · DWSI'],['inside','Jedna stěna · zdroj uvnitř']])}
  <p class="help" id="n_technique_help">Film uvnitř, zdroj vně trubky. Vzdálenost f se měří k přivrácenému povrchu.</p>
  <div class="form-section"><h3>Geometrie</h3>
  <div class="fields-two">${field$1('n_thickness','Tloušťka jedné stěny t',10,'mm')}${field$1('n_diameter','Vnější průměr De',219,'mm')}</div>
  ${field$1('n_distance','Vzdálenost zdroj–předmět f',500,'mm','Vzdálenost podle schématu.')}${quality('n_testingClass')}
  </div>
  ${error('n_error')}
  <p class="help">Eliptická a kolmá technika DWDI se těmito nomogramy nepočítají.</p>
 </div><div class="form-stack result-column" id="n_result_panel">
  <div class="result-focus" id="n_result_focus"><span class="result-kind" id="n_result_kind">Odečet nomogramu</span>
  ${result('n_result-display','Minimální počet expozic')}
  <p id="n_result_context" class="result-context"></p><p id="n_next_step" class="next-step"></p></div>
  <div class="chart-wrap"><canvas id="nomogramChart" aria-label="Nomogram počtu expozic" role="img"></canvas></div>
  <p id="n_result-ratios" class="result-detail"></p><p id="n_boundary_note" class="help"></p>
  <details class="calculation-details"><summary>Schéma geometrie a podklad výpočtu</summary>
  <div id="n_geometry_diagram" class="geometry-stage"></div>
  <p class="source-note">${source(SOURCES.iso1+'#page=32','ISO 17636‑1:2022 · příloha A')}<br>Digitalizovaný odečet. V blízkosti hranice se použije vyšší počet.</p>
  </details>
 </div></div>
</section>


<section id="unsharpness" class="tab-pane hidden" role="tabpanel" aria-labelledby="tab-unsharpness" hidden>
 <div class="calc-layout"><div class="form-stack">
  ${geometryChoices('ug_technique','Hodnocená geometrie',[['single','Jedna stěna'],['dwsi','Dvě stěny · DWSI'],['dwdi','Dvě stěny · DWDI']])}
  <div class="form-section"><h3>Geometrie a vzdálenosti</h3><p id="ug_technique_help" class="help"></p>
   <div class="fields-two">${field$1('ug_thickness','Tloušťka jedné stěny t',10,'mm')}${field$1('ug_gap','Mezera za zadním povrchem',0,'mm')}</div>
   <div id="ug_diameter_wrap" hidden>${field$1('ug_diameter','Vnější průměr De',219,'mm')}</div>
   ${field$1('ug_source_distance','Zdroj–přivrácený povrch',490,'mm')}
  </div>
  <div class="form-section"><h3>Zdroj a třída zkoušení</h3>${field$1('ug_focus','Velikost ohniska / zdroje d',1.5,'mm','Větší z obou rozměrů při skutečném výkonu.')}${quality('ug_class')}${check('ug_planar','Ve třídě A se požaduje detekce plošných vad')}</div>${error('ug_error')}
 </div><aside class="form-stack result-column" id="ug_result_panel">
  <div class="result-focus" id="ug_result_focus"><span class="result-kind" id="ug_result_kind">Geometrický výpočet</span>${result('ug_result-display','Geometrická neostrost Ug','mm')}<p id="ug_geometry" class="result-context"></p><p id="ug_next_step" class="next-step"></p><p id="ug_minimum" class="status-box"></p></div>
  <div id="ug_geometry_diagram" class="geometry-stage"></div>
  <p class="help">Posuzuje se geometrická neostrost a minimální vzdálenost pro film.</p>
  <details class="calculation-details"><summary>Podklady výpočtu</summary><p>Ug = d × b / f. DWSI hodnotí stěnu u filmu pomocí f′ a b′. Pro normové minimum f u DWDI se použije De. Podmíněná zkrácení vzdálenosti se neuplatňují.</p>${source(SOURCES.iso1+'#page=26','ISO 17636‑1:2022 · čl. 7.6')}</details>
 </aside></div>
</section>

<section id="time" class="tab-pane hidden" role="tabpanel" aria-labelledby="tab-time" hidden>
 <div class="source-switch">${select$1('source_type','Zdroj záření',[['xray','Rentgenka'],['gamma','Iridium‑192']])}</div>
 <div id="xray_calculator" class="calc-layout section-gap"><div class="form-stack">
  <div class="form-section"><h3>Materiál a film</h3>${select$1('xray_mode','Expoziční podklad',[['chart','Výrobní diagram Waygate / Agfa'],['manual','Vlastní referenční E']])}${material('xray_material')}<div class="fields-two">${field$1('t_thickness_xray','Celková prozářená tloušťka w',20,'mm')}${select$1('xray_film','Film',[['D7','Agfa D7'],['D5','Agfa D5'],['D4','Agfa D4'],['D3','Agfa D3'],['D2','Agfa D2']])}</div></div>
  <div class="form-section"><h3>Nastavení expozice</h3><div class="fields-two">${field$1('xray_voltage','Skutečné napětí U',200,'kV')}${field$1('xray_current','Skutečný proud I','','mA','Podle nastavení přístroje.')}</div><p class="help">Referenční maximum napětí: <strong id="xray_voltage_recommendation">—</strong></p>${field$1('t_distance_xray','Vzdálenost zdroj–film SFD',1000,'mm')}</div>
  <details class="calculation-details" id="xray_reference_fields"><summary>Referenční expozice a vzdálenost</summary><div class="form-stack"><div class="fields-two">${field$1('xray_factor','Referenční expozice E','','mA·min','','readonly')}${field$1('xray_reference_distance','Referenční SFD',1000,'mm','','readonly')}</div><div id="xray_manual_fields" class="form-stack" hidden>${textField('xray_reference_name','Podklad a podmínky','Přístroj, denzita, fólie, zpracování')}<button class="secondary-button" id="xray_confirm_reference" type="button">Potvrdit referenci pro tyto podmínky</button><p id="xray_manual_status" class="help"></p></div></div></details>${error('xray_error')}
 </div><aside class="form-stack result-column" id="xray_result_panel">
  <div class="result-focus" id="xray_result_focus" data-state="estimate"><span class="result-kind" id="xray_result_kind">Odhad z výrobního diagramu</span>${result('t_result_display_xray','Expoziční čas')}<p id="xray_result_context" class="result-context"></p><p id="xray_actual_exposure" class="result-detail"></p><p id="xray_next_step" class="next-step"></p></div>
  <div id="xray_chart_conditions" class="conditions-note"><strong>Podmínky diagramu</strong><p>Ocel · konstantní napětí · Pb fólie · denzita 2 · G135 / 28 °C / 8 minut.</p><p>Orientační podklad; ověřte shodu s přístrojem a zpracováním.</p></div>
  <details class="calculation-details"><summary>Podklady výpočtu</summary><p>t = E<sub>ref</sub> × (SFD / SFD<sub>ref</sub>)² / I</p><p>Používá se křivka zvoleného filmu při 1 m. Mimo její rozsah nebo pro jiné podmínky zvolte vlastní referenční E. Proud se zadává podle přístroje.</p>${source(SOURCES.film+'#page=14','Waygate / Agfa · str. 14')}</details>
 </aside></div>
 <div id="gamma_calculator" class="calc-layout section-gap" hidden><div class="form-stack">
  <div class="form-section"><h3>Aktivita zdroje</h3>${field$1('t_activity','Referenční aktivita A₀',1000,'GBq')}${date('t_activity_date','Datum a čas referenční aktivity')}${date('t_exposure_date','Datum a čas plánované expozice')}</div>
  <div class="form-section"><h3>Materiál a geometrie</h3>${field$1('t_thickness_gamma','Celková prozářená tloušťka oceli',40,'mm','Rozsah diagramu: 10–90 mm.')}${field$1('t_distance_gamma','Vzdálenost zdroj–film SFD',1000,'mm')}${select$1('t_film','Film',[['D7','Agfa D7'],['D5','Agfa D5'],['D4','Agfa D4']])}</div>${error('gamma_error')}
 </div><aside class="form-stack result-column" id="gamma_result_panel">
  <div class="result-focus" id="gamma_result_focus" data-state="estimate"><span class="result-kind" id="gamma_result_kind">Odhad z výrobního diagramu</span>${result('t_result_display_gamma','Expoziční čas')}<p id="gamma_result_context" class="result-context"></p><p id="t_current_activity" class="result-detail"></p><p id="gamma_next_step" class="next-step"></p></div>
  <div class="conditions-note"><strong>Ir‑192 · ocel 10–90 mm</strong><p>Pb fólie · denzita 2 · referenční SFD 1 m.</p><p>Ověřte shodu podmínek a zpracování filmu.</p></div>
  <p class="conditions-note">Kalkulátor podporuje expozice nejvýše 24 hodin. Jde o rozsah tohoto modelu, nikoli limit normy. Aktivita během expozice se aproximuje jako konstantní; do 24 hodin činí rozdíl oproti integrovanému rozpadu méně než 0,5 %.</p>
  <details class="calculation-details"><summary>Podklady výpočtu</summary><p id="gamma_reference_exposure"></p><p>A = A₀ × 2<sup>−Δd/73,827</sup>. Převod: 1 Ci = 37 GBq, 1 h = 60 min. Vzdálenost se uplatňuje ve druhé mocnině.</p>${source(SOURCES.film+'#page=16','Diagram Ir‑192 · str. 16')}<br>${source(SOURCES.decay,'Poločas Ir‑192 · LNHB')}</details>
 </aside></div>
</section>

<section id="digital_radiography" class="tab-pane hidden" role="tabpanel" aria-labelledby="tab-digital_radiography" hidden>
 <select id="cr_task" hidden aria-label="Úkol CR"><option value="check">Zkontrolovat SNR</option><option value="record">Zapsat měření</option><option value="estimate">Odhadnout expozici</option></select>
 <div class="task-switch" role="radiogroup" aria-label="Úkol CR">${[['check','Zkontrolovat SNR'],['record','Zapsat měření'],['estimate','Odhadnout expozici']].map(([v,t],i)=>`<button type="button" role="radio" aria-checked="${i===0}" tabindex="${i===0?0:-1}" data-choice-for="cr_task" data-value="${v}">${t}</button>`).join('')}</div>
 <p id="cr_task_hint" class="pane-intro"></p>
 <div class="calc-layout"><div class="form-stack">
  <div id="cr_reference_picker" class="reference-selection" hidden><div><span class="section-label">Referenční měření</span><strong id="cr_selected_reference">Žádná reference</strong></div><button type="button" id="cr_choose_reference" class="secondary-button">Vybrat z knihovny</button></div>
  <div class="form-section"><h3>Podmínky zkoušky</h3>${material('cr_material')}<div class="fields-two">${field$1('cr_thickness','Celková prozářená tloušťka w',40,'mm')}${field$1('cr_voltage','Skutečné napětí U',400,'kV')}</div>${quality('cr_class')}<p class="help">Referenční napětí: <strong id="cr_voltage_recommendation">—</strong></p>${select$1('cr_roi','Místo měření SNR',[['weld','Homogenní oblast svaru / kořene'],['haz','HAZ / základní materiál']])}${check('cr_flush','Převýšení svaru i kořen jsou zarovnány se základním materiálem')}
   <details class="calculation-details"><summary>Kompenzace CP I</summary><div class="form-stack">${check('cr_cp1','Podmíněně snížit požadavek SNR_N na 80 %')}${check('cr_iqi','Požadované IQI a kvalita obrazu byly ověřeny')}<p class="help">Vyžaduje skutečné napětí ≤ 80 % reference. Ostatní kompenzace se neposuzují.</p><p id="cr_cp1_error" class="field-error"></p></div></details>
  </div>
  <details id="cr_setup_details" class="calculation-details"><summary>Sestava a podmínky skenování</summary><div class="form-stack">${textField('cr_setup','Přístroj, deska a skener','Přesné modely a identifikace sestavy')}${textField('cr_screens','Filtrace, fólie a uspořádání','Materiál, tloušťka; případně bez fólií')}${textField('cr_scan','Nastavení skeneru','Rozlišení, režim, zesílení a zpracování')}${field$1('cr_delay','Prodleva do skenování','','min')}</div></details>
  <div id="cr_exposure_fields" class="form-section"><h3 id="cr_exposure_heading">Skutečná expozice</h3>${field$1('cr_fdd','Vzdálenost ohnisko–detektor FDD',1000,'mm')}<div class="fields-two">${field$1('cr_current','Proud','','mA')}<div id="cr_seconds_wrap">${field$1('cr_seconds','Skutečný čas','','s')}</div></div></div>
  <div id="cr_quality_fields" class="form-section"><h3>Naměřená kvalita</h3>${select$1('cr_snr_kind','Hodnota ze softwaru',[['normalized','Normalizované SNR_N'],['raw','Nenormalizované SNR']])}<div id="cr_resolution_fields"><div class="fields-two">${field$1('cr_srb','Naměřené SR_b','','mm','Nepoužívejte automaticky rozměr pixelu.')}${field$1('cr_magnification','Zvětšení M',1,'×','M ≤ 1,2: SR_b detektoru; M > 1,2: SR_b obrazu.')}</div></div>${field$1('cr_achieved_snr','Naměřená hodnota','','','Zadejte po nastavení podmínek měření.')}<p id="cr_stale_message" class="stale-note" role="status" hidden></p></div>
  <div id="cr_record_fields" class="form-section"><h3>Uložení měření</h3>${textField('cr_technique_name','Název měření','Např. Ocel 40 mm · zkouška 1',120)}${date('cr_measured_at','Datum a čas měření')}<button class="primary-button" type="button" id="cr_save_button">Uložit skutečné měření</button><p class="help">Uložit lze i zkušební měření pod cílem. Výsledek SNR zůstane součástí záznamu.</p>${error('cr_save_error')}</div>
  ${error('cr_error')}
 </div><aside class="form-stack result-column" id="cr_result_panel">
  <div class="result-focus" id="cr_result_focus"><span class="result-kind" id="cr_result_kind">Kontrola SNR_N</span>
   <div id="cr_quality_output">${result('cr_target_snr','Požadované SNR_N')}<p id="cr_validation_message" class="status-box" role="status"></p></div>
   <div id="cr_estimate_output" hidden>${result('cr_suggested_time','Expoziční čas')}<div class="exposure-total"><span>Potřebná expozice</span><output id="cr_suggested_exposure">—</output></div><p id="cr_estimate_target" class="result-detail"></p></div>
   <p id="cr_result_context" class="result-context"></p><p id="cr_next_step" class="next-step"></p>
  </div>
  <div id="cr_reference_status" hidden><p id="cr_reference_name" class="result-detail"></p><div id="cr_reference_error" class="reference-errors" role="status"></div><button id="cr_clear_reference" class="text-button" type="button" hidden>Zrušit referenci</button></div>
  <p class="help" id="cr_scope_note">Posuzuje se pouze SNR_N. IQI, prostorové rozlišení a ostatní požadavky se ověřují samostatně.</p>
  <details class="calculation-details"><summary>Podklady výpočtu</summary><p id="cr_target_explanation"></p>${source(SOURCES.iso2+'#page=27','ISO 17636‑2:2022, oprava 2023‑02 · tabulky 3/4')}<p>Odhad z měření: E ∝ FDD² × SNR_N². Platí při převaze kvantového šumu a shodných ostatních podmínkách. Nový snímek vždy znovu změřte.</p>${source(SOURCES.cr,'Fyzikální základ přepočtu · IAEA')}</details>
 </aside></div>
 <section class="library-section" id="cr_library_section" aria-labelledby="cr_library_title"><div class="library-heading"><div><span class="section-label">MĚŘENÍ V TOMTO PROHLÍŽEČI</span><h3 id="cr_library_title" tabindex="-1">Knihovna měření</h3></div><span id="cr_library_count"></span></div><div id="cr_library_container"></div></section>
</section>`;}

function manual(){return `
<p>Výpočty pracují s rozměry v milimetrech. U každého modulu jsou dostupné použité podklady a rozsah platnosti.</p>
<h3>Ovládání</h3><p>Desetinná čísla lze zadávat čárkou i tečkou. Techniku zvolte podle schématu; při zadávání rozměru se příslušná kóta zvýrazní. Na počítači zůstává panel výsledku při posouvání po ruce. Mobilní souhrn otevře celý výsledek a během psaní se skryje.</p>
<p>Kalkulátory přepínáte vlevo, na mobilu horními záložkami. Zakázku, díl a svar vyberte v řádku nad kalkulátorem. Tlačítko „Uložit k tomuto svaru“ je přímo u výsledku. Historie, společná geometrie a porovnání se otevírají v bočních panelech; zavřete je tlačítkem nebo klávesou Escape.</p><p>V záhlaví lze zvolit světlý, tmavý nebo systémový vzhled. Po rozbalení stavu místního úložiště uvidíte připravenost offline kopie a přístup k ručním zálohám.</p>
<h3>Počet expozic</h3><p>Jedna stěna se zdrojem vně používá f k přivrácenému povrchu. Zdroj uvnitř a DWSI používají SFD k filmu. Zadává se tloušťka jedné stěny, nikoli součet dvou stěn. Nepřípustná poloha zdroje se odmítne; u hranice digitalizovaného nomogramu se zvolí vyšší počet. Eliptická/kolmá DWDI není tímto kalkulátorem pokryta.</p>
<h3>Geometrická neostrost</h3><p>Mezera zahrnuje odstup filmu za zadním povrchem. Pro DWSI se výpočet vztahuje k hodnocené stěně u filmu. Pro DWDI k přivrácené stěně a celé vzdálenosti přes trubku. Minimální vzdálenost se kontroluje pro film bez podmíněných zkrácení; výsledek Ug sám není úplným posouzením radiogramu.</p>
<h3>Expoziční čas na film</h3><p>Do tloušťky w zadejte celou dráhu materiálem ve směru paprsku, včetně prozařovaných stěn a relevantního převýšení. Výrobní diagram je orientační reference pro uvedený materiál, film a zpracování. Vlastní E musí patřit k zadanému filmu, tloušťce, napětí a referenční vzdálenosti. Změna těchto podmínek vyžaduje nové potvrzení hodnoty.</p><p>Rentgenový proud odpovídá skutečnému nastavení přístroje. Pro Ir‑192 se aktivita přepočítá mezi zadanými časy; časy formuláře jsou v místním časovém pásmu zařízení. Výpočet používá převod 1 Ci = 37 GBq a 1 h = 60 min.</p>
<h3>CR měření a reference</h3><p>„Zkontrolovat SNR“ potřebuje pouze podmínky zkoušky a naměřenou kvalitu. „Zapsat měření“ navíc vyžaduje sestavu, skutečnou expozici a údaje záznamu. Ty vyplňte před SNR. „Odhadnout expozici“ použije měření vybrané z knihovny; aktivní reference je označena a její nesoulad se zadáním je rozepsán podle parametrů.</p><p>Při nenormalizovaném SNR je nutné SR_b. Knihovna uchovává i nevyhovující zkušební měření, vždy s jejich výsledkem. Změna podmínek zneplatní dříve zadané SNR a zobrazí důvod. Podrobnosti měření lze rozbalit. Staré záznamy z původního prototypu zůstávají označené jako neověřené odhady a nelze je použít jako referenci.</p><p>Referenční přepočet mění pouze vzdálenost a požadované SNR_N při stejné sestavě, materiálu, tloušťce, kV, SR_b a podmínkách skenování. Při omezení strukturálním šumem nemusí předpověď SNR odpovídat. Požadovaný stav ověřte novým měřením. Splnění SNR_N nepotvrzuje celý postup ani přijatelnost vad.</p>
<h3>Offline, instalace a zálohy</h3><p>Rozbalte stav připojení v záhlaví a otevřete „Offline, instalace a zálohy“. Místní režim ukládá zakázky do zařízení bez účtu. Synchronizovaný režim má oddělené zakázky; přepnutí nic nepřesouvá. Celou místní CR knihovnu a historii zvoleného režimu lze stáhnout jako zálohu JSON a obnovit bez přepsání stávajících záznamů.</p><p>Před prvním odchodem bez sítě vyčkejte na „Aplikace připravena offline“. Instalaci spusťte tlačítkem v panelu nebo z nabídky prohlížeče. Na iPhonu a iPadu použijte Sdílet → Přidat na plochu. Ruční smazání dat webu odstraní místní data i aplikaci pro offline spuštění; pravidelně ukládejte zálohu mimo web. Externí PDF vyžadují internet.</p>
<h3>Podklady</h3><ul><li>${source(SOURCES.iso1,'ISO 17636‑1:2022 · film a geometrie')}</li><li>${source(SOURCES.iso2,'ISO 17636‑2:2022, oprava 2023‑02 · digitální radiografie')}</li><li>${source(SOURCES.film,'Waygate / Agfa · výrobní expoziční diagramy')}</li><li>${source(SOURCES.decay,'LNHB · rozpad Ir‑192')}</li><li>${source(SOURCES.cr,'IAEA · digitální průmyslová radiografie')}</li></ul>
<p>Výrobní diagramy byly převedeny na číselné křivky. Nejde o kalibraci konkrétního pracoviště. Samostatná CR knihovna zůstává v tomto prohlížeči. Zakázky, historie i CR knihovna se ukládají výhradně v tomto zařízení. Mezi zařízeními je přenesete ručním exportem a obnovou zálohy; aktualizaci aplikace stáhnete tlačítkem v panelu Offline a zálohy.</p>`;}

const CR_FIELDS={material:'cr_material',thickness:'cr_thickness',fdd:'cr_fdd',voltage:'cr_voltage',qualityClass:'cr_class',roi:'cr_roi',flush:'cr_flush',cp1:'cr_cp1',iqiConfirmed:'cr_iqi',kind:'cr_snr_kind',measured:'cr_achieved_snr',srb:'cr_srb',magnification:'cr_magnification',current:'cr_current',seconds:'cr_seconds',name:'cr_technique_name',setup:'cr_setup',screens:'cr_screens',scan:'cr_scan',delay:'cr_delay',measuredAt:'cr_measured_at'};
const CONTEXT_FIELDS={
 n:{technique:'n_technique',qualityClass:'n_testingClass',thickness:'n_thickness',diameter:'n_diameter',distance:'n_distance'},
 ug:{technique:'ug_technique',qualityClass:'ug_class',thickness:'ug_thickness',diameter:'ug_diameter',gap:'ug_gap',sourceDistance:'ug_source_distance',focus:'ug_focus',planar:'ug_planar'},
 xray:{mode:'xray_mode',material:'xray_material',film:'xray_film',voltage:'xray_voltage',thickness:'t_thickness_xray',distance:'t_distance_xray',current:'xray_current',exposure:'xray_factor',referenceDistance:'xray_reference_distance',referenceName:'xray_reference_name'},
 gamma:{activity:'t_activity',referenceTime:'t_activity_date',exposureTime:'t_exposure_date',thickness:'t_thickness_gamma',distance:'t_distance_gamma',film:'t_film'},
 cr_check:CR_FIELDS,cr_record:CR_FIELDS,cr_estimate:CR_FIELDS,
};
const booleans=new Set(['planar','flush','cp1','iqiConfirmed']);
const numbers=new Set(['thickness','diameter','distance','gap','sourceDistance','focus','voltage','current','exposure','referenceDistance','activity','fdd','measured','srb','magnification','seconds','delay']);
const parseNumber=x=>/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(String(x).trim().replace(',','.'))?Number(String(x).trim().replace(',','.')):NaN;
const own=(o,k)=>Object.hasOwn(o,k);
function assertContext(context,{partialForm=false}={}){
 const {kind,inputs:i,form}=context||{},fields=CONTEXT_FIELDS[kind];
 if(!fields||!i||typeof i!=='object'||Array.isArray(i)||!form||typeof form!=='object'||Array.isArray(form))throw new Error('Neplatný formát uložených vstupů.');
 const core=kind==='n'?['technique','qualityClass','thickness','diameter','distance']:kind==='ug'?['technique','qualityClass','thickness','focus','sourceDistance']:kind==='gamma'?Object.keys(fields):kind==='xray'?['mode','material','film','voltage','thickness','distance','current','referenceDistance',...(i.mode==='manual'?['exposure','referenceDistance','referenceName']:[])]:['material','thickness','voltage','qualityClass','roi',...(kind==='cr_estimate'?['fdd','current','setup','screens','scan','delay','srb','magnification']:['kind','measured',...(i.kind==='raw'?['srb','magnification']:[])]),...(kind==='cr_record'?['name','setup','screens','scan','current','seconds','fdd','srb','magnification','delay','measuredAt']:[])];
 if(kind==='ug'&&i.technique!=='single')core.push('diameter');
 if(core.some(k=>!own(i,k)||i[k]===null||i[k]===''||!partialForm&&!own(form,fields[k])))throw new Error('V historii chybí povinné vstupy výpočtu.');
 for(const [key,value]of Object.entries(i)){
  if(!own(fields,key))throw new Error('Historie obsahuje neznámý vstup.');
  if(value!==null&&(numbers.has(key)?typeof value!=='number'||!Number.isFinite(value):booleans.has(key)?typeof value!=='boolean':typeof value!=='string'||value.length>1000))throw new Error('Neplatný typ uloženého vstupu.');
  const field=fields[key];if(!own(form,field))continue;
  // Old gamma forms store local wall time without an offset. ISO instants in
  // inputs are authoritative; replay always derives local time from them.
  if(kind==='gamma'&&['referenceTime','exposureTime'].includes(key)){if(!Number.isFinite(Date.parse(value))||!/(?:Z|[+-]\d{2}:\d{2})$/.test(value)||typeof form[field]!=='string')throw new Error('Neplatný čas v historii.');continue;}
  const consistent=value===null?typeof form[field]==='string'&&form[field].trim()==='':numbers.has(key)?parseNumber(form[field])===value:booleans.has(key)?form[field]===value:typeof form[field]==='string'&&form[field].trim()===value.trim();
  if(!consistent)throw new Error('Uložené vstupy a formulář si odporují. Obnova byla zastavena.');
 }
 if(kind==='xray'&&i.mode==='chart'&&i.referenceDistance!==1000)throw new Error('Výrobní diagram používá referenční SFD 1000 mm.');
 if(kind==='xray'&&i.mode==='manual'&&(!i.referenceName?.trim()||context.manualConfirmed!==true))throw new Error('Chybí potvrzená vlastní reference.');
 return context;
}
function canonicalForm(context,{localTime=false}={}){
 const {kind,inputs}=context,fields=CONTEXT_FIELDS[kind];if(!fields)throw new Error('Nepodporovaný výpočet.');
 const result={};for(const [key,id]of Object.entries(fields)){let value=inputs[key];if(kind==='ug'&&key==='gap'&&value===undefined)value=0;if(booleans.has(key))value=!!value;else if(localTime&&kind==='gamma'&&['referenceTime','exposureTime'].includes(key)){const t=new Date(value);value=new Date(t-t.getTimezoneOffset()*60000).toISOString().slice(0,16);}else value=value==null?'':String(value);result[id]=value;}
 if(kind.startsWith('cr_'))result.cr_task=kind.slice(3);
 if(['xray','gamma'].includes(kind))result.source_type=kind;
 return result;
}

const KINDS={n:'Počet expozic',ug:'Neostrost',xray:'Čas filmu · RTG',gamma:'Čas filmu · Ir-192',cr_check:'Kontrola SNR_N',cr_record:'CR měření',cr_estimate:'Odhad času CR'};
const num=x=>typeof x==='number'?x:/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(String(x).trim().replace(',','.'))?Number(String(x).trim().replace(',','.')):NaN;
const fmt=x=>Number.isFinite(x)?x.toLocaleString('cs-CZ',{maximumSignificantDigits:4}):'—';
const clone=x=>JSON.parse(JSON.stringify(x));
function evaluate(context,{modelVersion=CALCULATION_VERSION}={}) {
 const {kind,inputs:i}=context;
 let values,summary,status='info';
 if(kind==='n') {const {lines,...r}=exposureCount(i);values=r;summary=r.count===null?`Více než ${r.maxCount} expozic`:`${r.count} expozic`;status=r.count===null?'limit':'estimate';}
 else if(kind==='ug'){values=unsharpness(i);summary=`Ug ${fmt(values.ug)} mm`;status=values.passes?'pass':'fail';}
 else if(kind==='xray'){
  let exposure;
  if(i.mode==='chart'){if(i.material!=='steel')throw new Error('Výrobní diagram je pouze pro ocel.');exposure=xrayChartExposure(i.film,i.thickness,i.voltage);}
  else if(i.mode==='manual') {if(!context.manualConfirmed)throw new Error('Potvrďte vlastní referenční E v kalkulátoru.');exposure=i.exposure;}
  else throw new Error('Zvolte zdroj referenční expozice.');
  const minutes=xrayTime({...i,exposure});values={minutes,exposure:minutes*i.current};summary=(i.mode==='chart'?'≈ ':'')+formatDuration(minutes);status=i.mode==='chart'?'estimate':'info';
 }
 else if(kind==='gamma'){values=gammaTime(i,{historical:modelVersion==='2026-09-05.2'});summary='≈ '+formatDuration(values.minutes);status='estimate';}
 else if(kind?.startsWith('cr_')){
  const target=snrTarget(i).target;
  if(kind==='cr_estimate'){const exposure=predictCrExposure(context.reference,i,target),minutes=exposure/positive(i.current,'Plánovaný proud');positive(minutes);values={exposure,minutes,target};summary='≈ '+formatDuration(minutes);status='estimate';}
  else {if(kind==='cr_record')createCrMeasurement(i);const actual=normalizedSnr(i);values={actual,target,passes:actual>=target};summary=`SNR_N ${fmt(actual)} / cíl ${fmt(target)}`;status=values.passes?'pass':'fail';}
 }else throw new Error('Nepodporovaný výpočet.');
 for(const value of Object.values(values))if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Výsledek je mimo číselný rozsah.');
 return {values,summary,status};
}

// The common distance is always source–film. t is one wall; w is the actual
// material path, excluding air. 2t is only the central perpendicular-ray default.
function sharedGeometry(g) {
 if(!Object.hasOwn(MATERIALS,g.material))throw new Error('Vyberte materiál.');
 if(!['outside','inside','dwsi','dwdi','flat'].includes(g.technique))throw new Error('Vyberte techniku.');
 if(!['A','B'].includes(g.qualityClass))throw new Error('Vyberte třídu.');
 const t=positive(num(g.thickness),'Tloušťka stěny t'),sfd=positive(num(g.sfd),'SFD'),gap=num(g.gap);
 if(!Number.isFinite(gap)||gap<0)throw new Error('Mezera musí být nula nebo kladné číslo.');
 const pipe=g.technique!=='flat',double=['dwsi','dwdi'].includes(g.technique),de=pipe?positive(num(g.diameter),'Průměr De'):null;
 if(pipe&&de<=2*t)throw new Error('Vnější průměr musí být větší než dvě tloušťky stěny.');
 const w=g.pathMode==='manual'?positive(num(g.penetrated),'Skutečná tloušťka w'):t*(double?2:1);
 if(w<t*(double?2:1))throw new Error('Prozářená tloušťka w nesmí být menší než součet stěn v této geometrii.');
 const f=positive(sfd-(double?de:t)-gap,'Vzdálenost zdroj–povrch odvozená ze SFD');
 if(g.technique==='inside'&&(sfd-gap<de/2||sfd-gap>=de-t))throw new Error('Pro zdroj uvnitř musí SFD bez mezery ležet od De/2 do méně než De − t.');
 if(g.technique==='outside'&&gap>=de-2*t)throw new Error('Film má ležet uvnitř dutiny. Zmenšete mezeru.');
 const maps={ug:{ug_technique:double?g.technique:'single',ug_thickness:t,ug_diameter:de??'',ug_gap:gap,ug_source_distance:f,ug_class:g.qualityClass},
 film:{xray_material:g.material,t_thickness_xray:w,t_distance_xray:sfd,...(g.material==='steel'?{t_thickness_gamma:w,t_distance_gamma:sfd}:{})},
 cr:{cr_material:g.material,cr_thickness:w,cr_fdd:sfd,cr_class:g.qualityClass}};
 const skipped=[];
 if(['outside','inside','dwsi'].includes(g.technique)&&gap===0)maps.n={n_technique:g.technique==='dwsi'?'double':g.technique,n_thickness:t,n_diameter:de,n_distance:g.technique==='outside'?f:sfd,n_testingClass:g.qualityClass};
 else skipped.push('Počet expozic: nomogram nepokrývá tuto techniku nebo mezeru u filmu.');
 if(g.material!=='steel')skipped.push('Ir-192: diagram je pouze pro ocel; zadání tohoto kalkulátoru se nepřenáší.');
 return {maps,t,w,sfd,f,skipped,assumption:g.pathMode==='manual'?'w zadáno jako skutečná dráha v materiálu.':`w = ${double?'2t':'t'} pro kolmý centrální paprsek, bez převýšení svaru. Pro šikmý průchod zadejte skutečné w.`};
}

function variantFields(c){
 if(c.kind==='n')return [{key:'distance',label:c.inputs.technique==='outside'?'Zdroj–povrch f (mm)':'SFD (mm)'}];
 if(c.kind==='ug')return [{key:'sourceDistance',label:'Zdroj–první povrch (mm)'},{key:'focus',label:'Ohnisko (mm)'},{key:'gap',label:'Mezera u filmu (mm)'}];
 if(c.kind==='gamma')return [{key:'distance',label:'SFD (mm)'},{key:'film',label:'Film',options:['D7','D5','D4']}];
 if(c.kind==='xray')return [{key:'distance',label:'SFD (mm)'},{key:'current',label:'Proud (mA)'},...(c.inputs.mode==='chart'?[{key:'film',label:'Film',options:['D7','D5','D4','D3','D2']}]:[])];
 if(c.kind==='cr_estimate')return [{key:'fdd',label:'FDD (mm)'},{key:'current',label:'Proud (mA)'}];
 return [];
}
function compareVariant(base,changes={}) {
 const c=clone(base),allowed=variantFields(base);
 const formKeys={n:{distance:'n_distance'},ug:{sourceDistance:'ug_source_distance',focus:'ug_focus',gap:'ug_gap'},xray:{distance:'t_distance_xray',current:'xray_current',film:'xray_film'},gamma:{distance:'t_distance_gamma',film:'t_film'},cr_estimate:{fdd:'cr_fdd',current:'cr_current'}};
 for(const [key,value]of Object.entries(changes)) {const f=allowed.find(f=>f.key===key);if(!f)throw new Error('Tuto podmínku nelze v porovnání měnit.');c.inputs[key]=f.options?value:num(value);if(c.form)c.form[formKeys[c.kind][key]]=String(value);}
 const result=evaluate(c),original=evaluate(base),metric=c.kind==='ug'?'ug':c.kind==='n'?'count':'minutes';
 const a=result.values[metric],b=original.values[metric];
 return {context:c,result,delta:Number.isFinite(a)&&Number.isFinite(b)?a-b:null,percent:Number.isFinite(a)&&Number.isFinite(b)&&b>0?(a/b-1)*100:null};
}
function historyEntry({id,jobId,part,weld,drawingNumber='',batch='',context,createdAt=new Date().toISOString()}) {
 if(!jobId)throw new Error('Vyberte nebo vytvořte zakázku.');
 if(!part?.trim()||!weld?.trim())throw new Error('Doplňte díl a číslo svaru.');
 for(const [value,label]of [[drawingNumber,'Číslo výkresu'],[batch,'Běžné číslo']])if(typeof value!=='string'||value.length>120)throw new Error(label+' musí být text do 120 znaků.');
 assertContext(context,{partialForm:true});
 const canonicalContext={...context,form:canonicalForm(context)};
 return clone({id,kind:'calculation',jobId,part:part.trim(),weld:weld.trim(),drawingNumber:drawingNumber.trim(),batch:batch.trim(),createdAt,modelVersion:CALCULATION_VERSION,context:canonicalContext,result:evaluate(context)});
}

function focusableWithin(container){
 return [...container.querySelectorAll('button,a[href],input,select,textarea,summary,[tabindex="0"]')].filter(el=>{
  if(el.disabled||el.closest('[hidden],[inert]'))return false;
  for(let node=el.parentElement;node&&node!==container;node=node.parentElement)if(node.tagName==='DETAILS'&&!node.open&&node.querySelector('summary')!==el)return false;
  return true;
 });
}
function trapFocus(event,container){
 if(event.key!=='Tab')return;
 const elements=focusableWithin(container),first=elements[0],last=elements.at(-1),active=container.ownerDocument.activeElement;
 if(!first){event.preventDefault();container.focus();return;}
 if(event.shiftKey&&(active===first||!elements.includes(active))){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&(active===last||!elements.includes(active))){event.preventDefault();first.focus();}
}

const identifier=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(x);
const short=x=>typeof x==='string'&&x.trim().length>0&&x.length<=120;
const optionalShort=x=>x===undefined||typeof x==='string'&&x.length<=120;
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const scalar=x=>x===null||typeof x==='boolean'||typeof x==='string'&&x.length<=1000||typeof x==='number'&&Number.isFinite(x);
function entryShape(e){
 if(!e||!identifier(e.id)||typeof e.createdAt!=='string'||!Number.isFinite(Date.parse(e.createdAt)))return false;
 if(e.kind==='job')return short(e.name);
 return e.kind==='calculation'&&identifier(e.jobId)&&short(e.part)&&short(e.weld)&&optionalShort(e.drawingNumber)&&optionalShort(e.batch)&&typeof e.modelVersion==='string'&&e.modelVersion.length>0&&e.modelVersion.length<80&&e.context&&['n','ug','xray','gamma','cr_check','cr_record','cr_estimate'].includes(e.context.kind)&&object(e.context.inputs)&&Object.values(e.context.inputs).every(scalar)&&object(e.context.form)&&Object.values(e.context.form).every(v=>typeof v==='string'&&v.length<=1000||typeof v==='boolean')&&object(e.result)&&typeof e.result.summary==='string'&&e.result.summary.length<300&&object(e.result.values)&&Object.values(e.result.values).every(scalar);
}
function validEntry(e){
 if(!entryShape(e))return false;if(e.kind==='job')return true;
 try{
  if(![CALCULATION_VERSION,'2026-09-05.2'].includes(e.modelVersion))return false;
  assertContext(e.context);const expected=evaluate(e.context,{modelVersion:e.modelVersion});
  if(expected.status!==e.result.status||expected.summary!==e.result.summary)return false;
  const keys=Object.keys(expected.values);if(keys.length!==Object.keys(e.result.values).length)return false;
  return keys.every(key=>typeof expected.values[key]==='number'?typeof e.result.values[key]==='number'&&Math.abs(expected.values[key]-e.result.values[key])<=1e-10*Math.max(1,Math.abs(expected.values[key])):expected.values[key]===e.result.values[key]);
 }catch{return false;}
}

const BACKUP_LIMIT=20*1024*1024;
const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const copy=value=>JSON.parse(JSON.stringify(value));
const fail=message=>{throw new Error(message);};
const cleanEntry=({pending,...entry})=>copy(entry);
const legacyValid=r=>r&&typeof r.name==='string'&&r.name.length<=1000&&Number.isFinite(r.id)&&Number.isFinite(r.thickness);
function unique(rows,label){const ids=new Set();for(const row of rows){const id=String(row.id);if(ids.has(id))fail(`Záloha obsahuje opakované ID: ${label}.`);ids.add(id);}}
function parseBackup(raw,{exportOnly=false}={}){
 if(typeof raw!=='string'||new TextEncoder().encode(raw).length>BACKUP_LIMIT)fail('Záloha může mít nejvýše 20 MB.');
 let data;try{data=JSON.parse(raw,(key,value)=>{if(['__proto__','constructor','prototype'].includes(key))throw new Error();return value;});}catch{fail('Soubor není platná záloha JSON.');}
 if(data?.app!=='rt-asistent'||data.version!==1)fail('Nepodporovaný formát nebo verze zálohy RT Asistenta.');
 if(!Array.isArray(data.entries)||!Array.isArray(data.library?.measurements)||!Array.isArray(data.library?.legacy))fail('V záloze chybí historie nebo CR knihovna.');
 const {entries,library}=data;
 if(entries.length+library.measurements.length+library.legacy.length>20000)fail('Záloha obsahuje příliš mnoho záznamů.');
 if(entries.some(e=>!(exportOnly?entryShape(e):validEntry(e))||JSON.stringify(e).length>50000||e.context?.reference&&!isMeasurement(e.context.reference)))fail('Záloha obsahuje neplatný, rozporný nebo nepodporovaný záznam historie. Původní data zůstala zachovaná.');
 if(library.measurements.some(r=>!isMeasurement(r))||library.legacy.some(r=>!legacyValid(r)||JSON.stringify(r).length>50000))fail('Záloha obsahuje neplatné CR měření nebo starý odhad.');
 unique(entries,'historie');unique(library.measurements,'CR měření');unique(library.legacy,'staré odhady');
 const jobs=new Set(entries.filter(e=>e.kind==='job').map(e=>e.id));
 if(entries.some(e=>e.kind==='calculation'&&!jobs.has(e.jobId)))fail('Některý výpočet odkazuje na chybějící zakázku.');
 return {app:'rt-asistent',version:1,exportedAt:data.exportedAt,entries:entries.map(cleanEntry),library:{measurements:library.measurements.map(r=>({...createCrMeasurement(r),id:r.id})),legacy:copy(library.legacy)}};
}
function createBackup(entries,library){
 const data={app:'rt-asistent',version:1,exportedAt:new Date().toISOString(),entries:entries.map(cleanEntry),library:copy(library)};
 // Export preserves readable older/unknown history for recovery, while import
 // and replay must pass the stricter version-aware semantic validation.
 return parseBackup(JSON.stringify(data),{exportOnly:true});
}
function merge(existing,incoming,label){
 const byId=new Map(existing.map(row=>[String(row.id),row])),added=[];let skipped=0;
 for(const row of incoming){const old=byId.get(String(row.id));if(old){if(canonical(old)!==canonical(row))fail(`Stejné ID má odlišný obsah (${label}). Obnova byla zastavena; původní data zůstávají beze změny.`);skipped++;}else added.push(row);}
 return {added,skipped,all:[...existing,...added]};
}
function planRestore(data,entries,library){
 const history=merge(entries.map(cleanEntry),data.entries,'historie'),modern=merge(library.measurements,data.library.measurements,'CR měření'),legacy=merge(library.legacy,data.library.legacy,'staré odhady');
 return {entries:history.added,library:{measurements:modern.all,legacy:legacy.all},counts:{jobs:history.added.filter(e=>e.kind==='job').length,calculations:history.added.filter(e=>e.kind==='calculation').length,measurements:modern.added.length,legacy:legacy.added.length,skipped:history.skipped+modern.skipped+legacy.skipped}};
}

// Per-record transactions prevent a stale tab from replacing the whole library.
// The original localStorage snapshot is retained for recovery. Remembering every
// migrated ID also prevents deleted records reappearing from an older tab.
function createCrLibrary({indexedDB,channel=null,onChange=()=>{}}){
 let db,closed=false;
 const transaction=(stores,action)=>new Promise((resolve,reject)=>{
  if(!db||closed)return reject(new Error('CR úložiště není dostupné.'));
  const t=db.transaction(stores,'readwrite');let error;
  const fail=e=>{error=e;t.abort();};
  try{action(t,fail);}catch(e){fail(e);}
  t.oncomplete=resolve;t.onerror=()=>reject(error||t.error);t.onabort=()=>reject(error||t.error||new Error('Uložení CR bylo přerušeno.'));
 });
 const unpack=rows=>({measurements:rows.filter(r=>r.kind==='measurement').map(r=>({...createCrMeasurement(r.data),id:r.data.id})),legacy:rows.filter(r=>r.kind==='legacy').map(r=>r.data)});
 async function snapshot(){
  if(!db||closed)throw new Error('CR úložiště není dostupné.');
  const rows=await new Promise((resolve,reject)=>{const t=db.transaction('records'),r=t.objectStore('records').getAll();t.oncomplete=()=>resolve(r.result);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||new Error('Čtení CR bylo přerušeno.'));});
  return unpack(rows.sort((a,b)=>b.savedAt-a.savedAt||a.key.localeCompare(b.key)));
 }
 const notify=()=>{if(!closed){channel?.postMessage('changed');onChange();}};
 async function merge(incoming,{migration=false}={}){
  await transaction(['records','migrated'],(t,fail)=>{
   const records=t.objectStore('records'),seen=t.objectStore('migrated'),request=records.getAll(),marked=seen.getAllKeys();
   marked.onsuccess=()=>{try{
    const existing=unpack(request.result),known=new Set(marked.result);
    const filtered={measurements:incoming.measurements.filter(r=>!migration||!known.has('measurement/'+r.id)),legacy:incoming.legacy.filter(r=>!migration||!known.has('legacy/'+r.id))};
    // Validate the entire merge before queuing any write.
    const plan=planRestore({entries:[],library:filtered},[],existing),present=new Map(request.result.map(r=>[r.key,r]));
    for(const [kind,rows]of [['measurement',plan.library.measurements],['legacy',plan.library.legacy]])for(const data of rows){const key=kind+'/'+data.id;if(!present.has(key))records.add({key,kind,data,savedAt:Date.now()});}
    if(migration)for(const [kind,rows]of [['measurement',incoming.measurements],['legacy',incoming.legacy]])for(const r of rows)seen.put(true,kind+'/'+r.id);
   }catch(e){fail(e);}};
  });notify();
 }
 async function init(legacy,{hiddenLegacy=[]}={}){
  db=await new Promise((resolve,reject)=>{const r=indexedDB.open('rt-cr-library-v1',1);r.onupgradeneeded=()=>{r.result.createObjectStore('records',{keyPath:'key'});r.result.createObjectStore('migrated');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Zavřete starší karty aplikace.'));});
  if(closed){db.close();return;}db.onversionchange=()=>{db.close();closed=true;};
  if(channel)channel.onmessage=()=>{if(!closed)onChange();};
  if(hiddenLegacy.length)await transaction(['migrated'],t=>{for(const id of hiddenLegacy)t.objectStore('migrated').put(true,'legacy/'+id);});
  await merge(legacy,{migration:true});
 }
 async function add(record){
  await transaction(['records'],(t,fail)=>{const s=t.objectStore('records'),key='measurement/'+record.id,r=s.get(key);r.onsuccess=()=>{try{if(r.result){if(canonical(r.result.data)!==canonical(record))throw new Error('Stejné ID CR měření má odlišný obsah.');}else s.add({key,kind:'measurement',data:record,savedAt:Date.now()});}catch(e){fail(e);}};});notify();
 }
 async function remove(kind,id){await transaction(['records','migrated'],t=>{t.objectStore('records').delete(kind+'/'+id);t.objectStore('migrated').put(true,kind+'/'+id);});notify();}
 return {init,snapshot,add,remove,merge,close(){closed=true;channel?.close();db?.close();}};
}

function initApp({document:d=globalThis.document,Chart}={}) {
 const w=d.defaultView,byId=id=>d.getElementById(id),abort=new w.AbortController();
 byId('tab-content').innerHTML=forms();byId('manual-body').innerHTML=manual();
 const scrollBehavior=()=>w.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
 const on=(el,type,handler,options={})=>el.addEventListener(type,handler,{...options,signal:abort.signal});
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const number=value=>Number.isFinite(value)?value.toLocaleString('cs-CZ',{maximumSignificantDigits:4}):'—';
 const text=(id,value)=>{byId(id).textContent=value;};
 const val=id=>byId(id).value;
 const n=id=>{const value=val(id).trim().replace(',','.');return /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(value)?Number(value):NaN;};
 const checked=id=>byId(id).checked;
 const show=(id,visible)=>{byId(id).hidden=!visible;};
 const memory=new Map();let chart=null,reference=null,destroyed=false;
 const read=key=>{try{return w.localStorage.getItem(key)??memory.get(key)??null;}catch{return memory.get(key)??null;}};
 const write=(key,value)=>{memory.set(key,value);try{w.localStorage.setItem(key,value);}catch{const note=d.querySelector('.save-note');if(note){note.textContent='Ukládání není dostupné; data zůstanou do obnovení stránky.';note.dataset.state='error';}}};
 const parse=(key,fallback)=>{try{return JSON.parse(read(key))??fallback;}catch{return fallback;}};
 const list=value=>Array.isArray(value)?value:[];
 let records=list(parse('rt_measurements_v2',[])).filter(isMeasurement).map(r=>({...createCrMeasurement(r),id:r.id}));
 const deletedLegacy=new Set(list(parse('rt_legacy_hidden_v2',[])).map(String));
 let legacy=list(parse('cr_techniques_library',[])).filter(r=>r&&typeof r.name==='string'&&Number.isFinite(r.id)&&Number.isFinite(r.thickness));
 const inputElements=[...byId('tab-content').querySelectorAll('input,select')];
 const localDate=()=>{const date=new Date();return new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);};
 ['t_activity_date','t_exposure_date','cr_measured_at'].forEach(id=>{byId(id).value=localDate();});
 const saved=parse('rt_inputs_v2',{});
 for(const el of inputElements) {
  if(!saved||!Object.hasOwn(saved,el.id))continue;
  const value=saved[el.id];
  if(el.type==='checkbox'&&typeof value==='boolean')el.checked=value;
  else if(typeof value==='string'&&(el.tagName!=='SELECT'||[...el.options].some(o=>o.value===value)))el.value=value;
 }
 let manualSignature=typeof saved?.manualSignature==='string'?saved.manualSignature:null;
 let staleMeasurement=typeof saved?.staleMeasurement==='string'?saved.staleMeasurement:'',activeTab='exposures';
 reference=isMeasurement(saved?.reference)?clone(saved.reference):records.find(r=>r.id===saved?.referenceId)||null;
 const touched=new Set(),zeroAllowed=new Set(['ug_gap','cr_delay']);
 const label=id=>d.querySelector(`[for="${id}"]`)?.textContent.trim()||id;
 function fieldError(id,message,missing=false){const el=byId(id),error=byId(id+'-error');if(error)error.textContent=missing&&!touched.has(id)?'':message;if(el)el.setAttribute('aria-invalid',String(!!message&&(!missing||touched.has(id))));}
 function failField(id,message,missing=false){fieldError(id,message,missing);throw Object.assign(new Error(message),{field:id,missing});}
 function clearFields(ids){ids.forEach(id=>fieldError(id,''));}
 function requireNumbers(ids){
  const issues=[];
  for(const id of ids){const value=n(id),empty=!val(id).trim();let message='';if(empty)message=`Doplňte ${label(id).toLocaleLowerCase('cs-CZ')}.`;else if(!Number.isFinite(value))message='Zadejte číslo, například 10 nebo 0,5.';else if(zeroAllowed.has(id)?value<0:value<=0)message=zeroAllowed.has(id)?'Zadejte nulu nebo kladné číslo.':'Zadejte číslo větší než 0.';else if(id==='cr_magnification'&&value<1)message='Zvětšení musí být alespoň 1.';fieldError(id,message,empty);if(message)issues.push({id,message,empty});}
  if(issues.length){const first=issues[0];throw Object.assign(new Error(first.message),{field:first.id,missing:first.empty});}
 }
 function requireText(ids){for(const id of ids){if(!val(id).trim())failField(id,`Doplňte ${label(id).toLocaleLowerCase('cs-CZ')}.`,true);fieldError(id,'');}}
 function focusField(id){const el=byId(id);if(!el)return;for(let parent=el.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;el.focus();el.scrollIntoView?.({block:'center',behavior:scrollBehavior()});}
 function resultState(prefix,state,kind,context='',next=''){byId(prefix+'_result_focus').dataset.state=state;const badge=byId(prefix+'_result_kind');if(badge)badge.textContent=kind;const summary=byId(prefix+'_result_context');if(summary)summary.textContent=context;text(prefix+'_next_step',next);}
 function updateMobile(){const prefix=activeTab==='exposures'?'n':activeTab==='unsharpness'?'ug':activeTab==='digital_radiography'?'cr':val('source_type')==='gamma'?'gamma':'xray';const output=byId({n:'n_result-display',ug:'ug_result-display',xray:'t_result_display_xray',gamma:'t_result_display_gamma',cr:val('cr_task')==='estimate'?'cr_suggested_time':'cr_target_snr'}[prefix]);const value=output.textContent==='—'?'Doplňte údaje':output.textContent+(prefix==='ug'?' mm':prefix==='n'?' expozic':'');text('mobile-result-value',value);text('mobile-result-kind',byId(prefix+'_result_kind')?.textContent||(prefix==='gamma'?'Odhad z diagramu':'Výsledek'));text('mobile-result-context',byId(prefix+'_next_step').textContent||byId(prefix+'_result_context')?.textContent||'');byId('mobile-result').dataset.state=byId(prefix+'_result_focus').dataset.state||'neutral';byId('mobile-result').dataset.panel=prefix+'_result_panel';const actions=byId('result-actions'),target=byId(prefix+'_result_focus');if(actions&&actions.parentElement!==target)target.append(actions);}
 const saveInputs=()=>{
  const state=Object.fromEntries(inputElements.map(el=>[el.id,el.type==='checkbox'?el.checked:el.value]));
  state.manualSignature=manualSignature;state.staleMeasurement=staleMeasurement;state.referenceId=reference?.id??null;state.reference=reference?clone(reference):null;write('rt_inputs_v2',JSON.stringify(state));
 };
 const setStatus=(id,message,state='neutral')=>{text(id,message);byId(id).dataset.state=state;};
 const markError=(id,error)=>text(id,error instanceof Error?error.message:String(error));
 const clear=(...ids)=>ids.forEach(id=>text(id,'—'));
 function tab(id,focus=false) {
  activeTab=id;
  const buttons=[...d.querySelectorAll('#tabs button[data-tab]')];
  buttons.forEach(btn=>{
   const active=btn.dataset.tab===id;btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1;
   btn.classList.toggle('tab-active',active);btn.classList.toggle('tab-inactive',!active);
   const panel=byId(btn.dataset.tab);panel.hidden=!active;panel.classList.toggle('hidden',!active);
   if(active){const titles={exposures:['Počet expozic','Počet snímků podle geometrie a třídy zkoušení.'],unsharpness:['Geometrická neostrost','Geometrie snímku a minimální vzdálenost zdroje.'],time:['Expoziční čas na film','Čas podle výrobního diagramu nebo vlastní reference.'],digital_radiography:['CR měření','Kontrola SNR, zápis měření a odhad expozice.']};text('workspace-title',titles[id][0]);if(byId('workspace-description'))text('workspace-description',titles[id][1]);if(focus)btn.focus();}
  });
  if(id==='exposures')chart?.resize?.();
  updateMobile();
 }
 const tabs=[...d.querySelectorAll('#tabs button[data-tab]')];
 byId('tabs').setAttribute('role','tablist');byId('tabs').setAttribute('aria-label','Výpočetní nástroje');
 tabs.forEach((btn,index)=>{
  btn.id='tab-'+btn.dataset.tab;btn.setAttribute('role','tab');btn.setAttribute('aria-controls',btn.dataset.tab);
  on(btn,'click',()=>tab(btn.dataset.tab));
  on(btn,'keydown',event=>{
   let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%tabs.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;
   if(next!==undefined){event.preventDefault();tab(tabs[next].dataset.tab,true);}
  });
 });
 tab('exposures');
 on(byId('mobile-result'),'click',()=>{const panel=byId(byId('mobile-result').dataset.panel);panel.tabIndex=-1;panel.focus({preventScroll:true});panel.scrollIntoView?.({block:'start',behavior:scrollBehavior()});});

 let returnFocus=null,confirmAction=null;
 function closeDialog(id){byId(id).classList.remove('visible');byId(id).setAttribute('aria-hidden','true');if(byId('app-surface'))byId('app-surface').inert=false;d.body.classList.remove('modal-open');returnFocus?.focus?.();confirmAction=null;}
 function openDialog(id){returnFocus=d.activeElement;byId(id).classList.add('visible');byId(id).setAttribute('aria-hidden','false');if(byId('app-surface'))byId('app-surface').inert=true;d.body.classList.add('modal-open');byId('connection-popover')?.removeAttribute('open');byId(id).querySelector('button')?.focus();}
 on(byId('show-manual-button'),'click',()=>openDialog('manual-modal-container'));
 on(byId('manual-modal-close-btn'),'click',()=>closeDialog('manual-modal-container'));
 on(byId('modal-cancel-btn'),'click',()=>closeDialog('modal-container'));
 on(byId('modal-confirm-btn'),'click',()=>{const action=confirmAction;closeDialog('modal-container');action?.();});
 for(const el of d.querySelectorAll('.modal-overlay'))on(el,'click',e=>{if(e.target===el)closeDialog(el.id);});
 on(d,'keydown',e=>{
  const overlay=d.querySelector('.modal-overlay.visible');if(!overlay)return;
  if(e.key==='Escape'){closeDialog(overlay.id);return;}
  trapFocus(e,overlay);
 });

 function renderN() {
  const technique=val('n_technique'),outside=technique==='outside';
  d.querySelector('[for="n_distance"]').textContent=outside?'Vzdálenost zdroj–předmět f':'Vzdálenost zdroj–film SFD';
  byId('n_geometry_diagram').innerHTML=geometryDiagram(technique);syncChoices('n_technique');
  text('n_technique_help',outside?'Film uvnitř, zdroj vně. f se měří k přivrácenému povrchu.':technique==='double'?'Zdroj a film vně, hodnocení stěny u filmu (DWSI). Zadejte celou SFD.':'Zdroj v dutině, film na vnějším povrchu. SFD se měří k filmu v hlavním směru expozice.');
  text('n_error','');text('n_boundary_note','');
  clearFields(['n_thickness','n_diameter','n_distance']);
  const lower=technique==='inside'?n('n_diameter')/2:technique==='outside'?n('n_diameter')/4:n('n_diameter');
  text('n_distance-hint',Number.isFinite(lower)?technique==='inside'?`Povolená SFD: od ${number(lower)} do méně než ${number(n('n_diameter')-n('n_thickness'))} mm.`:outside?`Rozsah nomogramu: f ≥ ${number(lower)} mm.`:`SFD musí být větší než ${number(lower)} mm.`:'Vzdálenost v mm podle schématu.');
  try {
   requireNumbers(['n_thickness','n_diameter','n_distance']);
   if(n('n_thickness')/n('n_diameter')>.25)failField('n_thickness',`Pro tento průměr zadejte nejvýše ${number(n('n_diameter')/4)} mm.`);
   if(technique==='inside'&&(n('n_distance')<lower||n('n_distance')>=n('n_diameter')-n('n_thickness')))failField('n_distance','Zdroj musí být v dutině. '+byId('n_distance-hint').textContent);
   if((outside&&n('n_distance')<lower)||(technique==='double'&&n('n_distance')<=lower))failField('n_distance',byId('n_distance-hint').textContent);
   const result=exposureCount({technique,qualityClass:val('n_testingClass'),thickness:n('n_thickness'),diameter:n('n_diameter'),distance:n('n_distance')});
   text('n_result-display',result.count??`> ${result.maxCount}`);
   text('n_result_context',`Stěna ${number(n('n_thickness'))} mm · De ${number(n('n_diameter'))} mm · třída ${val('n_testingClass')}`);text('n_next_step','');
   byId('n_result_focus').dataset.state='neutral';text('n_result_kind','Odečet nomogramu');
   text('n_result-ratios',`${result.figure} · t/De = ${number(result.x)} · De/${outside?'f':'SFD'} = ${number(result.y)}`);
   text('n_boundary_note',result.centered?'Zdroj v ose: panoramatická expozice.':result.nearBoundary?'Bod je blízko hranice digitalizace. Zvolen vyšší počet.':result.count===null?'Potřebný počet přesahuje dostupné křivky.':'');
   chart?.destroy();chart=null;
   if(Chart){
    const style=w.getComputedStyle(d.documentElement),dark=d.documentElement.dataset.theme==='dark';
    const color=(key,light,night)=>style.getPropertyValue(key).trim()||(dark?night:light);
    const ink=color('--muted','#596778','#b0bdcc'),grid=color('--chart-grid','#e0e5ec','#3c4858'),primary=color('--primary','#255bce','#99baff');
    const datasets=result.lines.map(l=>({label:`N = ${l.N}`,data:l.dataPoints,showLine:true,borderColor:color('--chart-line','#8091a5','#91a3ba'),borderWidth:1,pointRadius:0}));
    if(!outside)datasets.push({label:'Hranice stěny – nepřípustná oblast',data:Array.from({length:51},(_,i)=>({x:i/200,y:1/(1-i/200)})),showLine:true,borderDash:[5,4],borderColor:color('--chart-warning','#a56b20','#e6bd78'),pointRadius:0});
    datasets.push({label:'Vaše geometrie',data:[{x:result.x,y:result.y}],pointBackgroundColor:primary,pointBorderColor:primary,pointRadius:6});
    const axis={ticks:{color:ink,font:{family:'Inter Variable, sans-serif'}},grid:{color:grid,borderColor:grid}};
    chart=new Chart(byId('nomogramChart').getContext('2d'),{type:'scatter',data:{datasets},options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{backgroundColor:color('--panel','#ffffff','#1c222a'),titleColor:ink,bodyColor:ink,borderColor:grid,borderWidth:1}},scales:{x:{...axis,type:'linear',min:0,max:.25,title:{display:true,text:'t/De',color:ink}},y:{...axis,min:0,max:result.yMax,title:{display:true,text:outside?'De/f':'De/SFD',color:ink}}}}});
   }
  }catch(error){clear('n_result-display');text('n_result-ratios','');resultState('n',error.missing?'neutral':'fail',error.missing?'Chybí zadání':'Zkontrolujte geometrii','',error.message);if(!error.missing)markError('n_error',error);chart?.destroy();chart=null;}
  updateMobile();
 }
 function syncChoices(id){d.querySelectorAll(`[data-choice-for="${id}"]`).forEach(button=>{const active=button.dataset.value===val(id);button.setAttribute('aria-checked',String(active));button.tabIndex=active?0:-1;});}
 on(byId('tab-content'),'click',event=>{const button=event.target.closest('[data-choice-for]');if(!button)return;const el=byId(button.dataset.choiceFor);if(el.value!==button.dataset.value){el.value=button.dataset.value;el.dispatchEvent(new w.Event('input',{bubbles:true}));}});
 on(byId('tab-content'),'keydown',event=>{const button=event.target.closest('[data-choice-for]');if(!button)return;const options=[...d.querySelectorAll(`[data-choice-for="${button.dataset.choiceFor}"]`)];const i=options.indexOf(button);let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(i+1)%options.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(i+options.length-1)%options.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=options.length-1;if(next!==undefined){event.preventDefault();options[next].click();options[next].focus();}});
 on(d,'rt-theme-change',()=>renderN());
 function renderUg() {
  show('ug_diameter_wrap',val('ug_technique')!=='single');text('ug_error','');
  syncChoices('ug_technique');byId('ug_geometry_diagram').innerHTML=geometryDiagram(val('ug_technique'),{module:'ug',gap:n('ug_gap')});
  text('ug_technique_help',val('ug_technique')==='single'?'b zahrnuje tloušťku předmětu a mezeru k filmu.':val('ug_technique')==='dwsi'?'Zeleně je označena hodnocená stěna u filmu. f′ a b′ se vztahují k této stěně.':'Zeleně jsou označeny obě hodnocené stěny. Ug se počítá pro přivrácenou stěnu.');
  clearFields(['ug_focus','ug_source_distance','ug_thickness','ug_gap','ug_diameter']);
  try{
   requireNumbers(['ug_focus','ug_source_distance','ug_thickness','ug_gap',...(val('ug_technique')!=='single'?['ug_diameter']:[])]);
   if(val('ug_technique')!=='single'&&n('ug_diameter')<=2*n('ug_thickness'))failField('ug_diameter',`Průměr musí být větší než ${number(2*n('ug_thickness'))} mm.`);
   const r=unsharpness({focus:n('ug_focus'),sourceDistance:n('ug_source_distance'),thickness:n('ug_thickness'),gap:n('ug_gap'),diameter:n('ug_diameter'),technique:val('ug_technique'),qualityClass:val('ug_class'),planar:checked('ug_planar')});
   text('ug_result-display',number(r.ug));text('ug_geometry',`Hodnocená geometrie: f = ${number(r.f)} mm · b = ${number(r.b)} mm`);
   setStatus('ug_minimum',`Minimální f pro tuto kontrolu: ${number(r.minF)} mm. ${r.passes?'Zadaná vzdálenost vyhovuje tomuto kritériu.':'Zadaná vzdálenost je nedostatečná.'}`,r.passes?'pass':'fail');
   resultState('ug',r.passes?'pass':'fail',r.passes?'Minimální vzdálenost splněna':'Nedostatečná vzdálenost');
  }catch(error){clear('ug_result-display');text('ug_geometry','');setStatus('ug_minimum','');resultState('ug',error.missing?'neutral':'fail','Doplňte geometrii','',error.message);if(!error.missing)markError('ug_error',error);}
  updateMobile();
 }
 const voltageLabel=(material,thickness)=>{try{const r=maximumVoltage(material,thickness);return r===null?'Mimo rozsah do 1 000 kV':`${number(r)} kV`;}catch{return '—';}};
 const xraySignature=()=>JSON.stringify(['xray_material','xray_film','t_thickness_xray','xray_voltage','xray_factor','xray_reference_distance','xray_reference_name'].map(val));
 function renderXray() {
  const automatic=val('xray_mode')==='chart';show('xray_manual_fields',!automatic);show('xray_chart_conditions',automatic);
  const curves=XRAY_CHARTS[val('xray_film')];text('xray_voltage-hint',automatic?`Diagram ${val('xray_film')}: ${curves[0].kv}–${curves.at(-1).kv} kV, podle tloušťky.`:'Napětí, pro které platí vlastní referenční E.');byId('xray_voltage-hint').classList.remove('sr-only');byId('xray_voltage-hint').classList.add('input-hint');
  byId('xray_factor').readOnly=automatic;byId('xray_reference_distance').readOnly=automatic;
  text('xray_voltage_recommendation',voltageLabel(val('xray_material'),n('t_thickness_xray')));text('xray_error','');clear('t_result_display_xray');text('xray_actual_exposure','');
  clearFields(['t_thickness_xray','xray_voltage','xray_current','t_distance_xray','xray_factor','xray_reference_distance','xray_reference_name','xray_material']);
  try {
   requireNumbers(['t_thickness_xray','xray_voltage']);
   let exposure;
   if(automatic){
    byId('xray_reference_distance').value='1000';byId('xray_factor').value='';
    if(val('xray_material')!=='steel')failField('xray_material','Výrobní diagram je pro ocel. Pro tento materiál zvolte vlastní referenční E.');
    try{exposure=xrayChartExposure(val('xray_film'),n('t_thickness_xray'),n('xray_voltage'));}catch(error){fieldError('xray_voltage',error.message);failField('t_thickness_xray',error.message);}
    byId('xray_factor').value=exposure.toLocaleString('cs-CZ',{useGrouping:false,maximumSignificantDigits:5});
   }else {
    requireText(['xray_reference_name']);requireNumbers(['xray_factor','xray_reference_distance']);
    if(manualSignature!==xraySignature())failField('xray_factor','Potvrďte platnost E pro aktuální materiál, film, tloušťku, napětí a referenční vzdálenost.');
    exposure=n('xray_factor');
   }
   requireNumbers(['xray_current','t_distance_xray']);
   const minutes=xrayTime({exposure,distance:n('t_distance_xray'),referenceDistance:n('xray_reference_distance'),current:n('xray_current')});
   text('t_result_display_xray',(automatic?'≈ ':'')+formatDuration(minutes));text('xray_actual_exposure',`Při zadané SFD: ${number(minutes*n('xray_current'))} mA·min`);
   resultState('xray',automatic?'estimate':'neutral',automatic?'Odhad z výrobního diagramu':'Přepočet vlastní reference',`${MATERIALS[val('xray_material')]} ${number(n('t_thickness_xray'))} mm · ${val('xray_film')} · ${number(n('xray_voltage'))} kV · ${number(n('xray_current'))} mA · SFD ${number(n('t_distance_xray'))} mm`);
  }catch(error){resultState('xray',error.missing?'neutral':'fail',error.missing?'Chybí zadání':'Zkontrolujte zadání','',error.message);if(!error.missing)markError('xray_error',error);}
  text('xray_manual_status',manualSignature===xraySignature()?'Referenční E je přiřazeno k aktuálně zadaným podmínkám.':'Po změně materiálu, filmu, tloušťky nebo napětí znovu potvrďte platnost E.');
  updateMobile();
 }
 on(byId('xray_confirm_reference'),'click',()=>{const ids=['t_thickness_xray','xray_voltage','xray_factor','xray_reference_distance'];[...ids,'xray_reference_name'].forEach(id=>touched.add(id));try{requireNumbers(ids);requireText(['xray_reference_name']);manualSignature=xraySignature();renderXray();saveInputs();}catch(error){text('xray_next_step',error.message);markError('xray_error',error);focusField(error.field);updateMobile();}});
 function renderGamma() {
  text('gamma_error','');
  clearFields(['t_activity','t_activity_date','t_exposure_date','t_thickness_gamma','t_distance_gamma']);
  try{
   requireNumbers(['t_activity','t_thickness_gamma','t_distance_gamma']);requireText(['t_activity_date','t_exposure_date']);
   if(n('t_thickness_gamma')<10||n('t_thickness_gamma')>90)failField('t_thickness_gamma','Zadejte tloušťku od 10 do 90 mm.');
   if(new Date(val('t_exposure_date'))<new Date(val('t_activity_date')))failField('t_exposure_date','Expozice nesmí předcházet referenční aktivitě.');
   const r=gammaTime({activity:n('t_activity'),referenceTime:val('t_activity_date'),exposureTime:val('t_exposure_date'),thickness:n('t_thickness_gamma'),distance:n('t_distance_gamma'),film:val('t_film')});
   text('t_result_display_gamma','≈ '+formatDuration(r.minutes));text('t_current_activity',`Aktivita k času expozice: ${number(r.currentActivity)} GBq`);
   text('gamma_reference_exposure',`Odečet při 1 m: ${number(r.ciHours)} Ci·h = ${number(r.gbqHours)} GBq·h`);
   resultState('gamma','estimate','Odhad z výrobního diagramu',`Ocel ${number(n('t_thickness_gamma'))} mm · ${val('t_film')} · SFD ${number(n('t_distance_gamma'))} mm`);
  }catch(error){clear('t_result_display_gamma');text('t_current_activity','');text('gamma_reference_exposure','');resultState('gamma',error.missing?'neutral':'fail','Zkontrolujte zadání','',error.message);if(!error.missing)markError('gamma_error',error);}
  updateMobile();
 }
 function renderTime(){const gamma=val('source_type')==='gamma';show('gamma_calculator',gamma);show('xray_calculator',!gamma);if(gamma)renderGamma();else renderXray();}
 function crInput(){return {
  material:val('cr_material'),thickness:n('cr_thickness'),fdd:n('cr_fdd'),voltage:n('cr_voltage'),qualityClass:val('cr_class'),roi:val('cr_roi'),flush:checked('cr_flush'),cp1:checked('cr_cp1'),iqiConfirmed:checked('cr_iqi'),
  kind:val('cr_snr_kind'),measured:n('cr_achieved_snr'),srb:n('cr_srb'),magnification:n('cr_magnification'),current:n('cr_current'),seconds:n('cr_seconds'),
  name:val('cr_technique_name'),setup:val('cr_setup').trim(),screens:val('cr_screens').trim(),scan:val('cr_scan').trim(),delay:n('cr_delay'),measuredAt:val('cr_measured_at')};}

 const referenceLabels={material:['Materiál',''],thickness:['Tloušťka','mm'],voltage:['Napětí','kV'],setup:['Sestava',''],screens:['Filtrace / fólie',''],scan:['Skener',''],delay:['Prodleva','min'],srb:['SR_b','mm'],magnification:['Zvětšení','×'],roi:['Místo měření',''],flush:['Zarovnání svaru','']};
 const displayCondition=(key,value)=>key==='material'?MATERIALS[value]:key==='roi'?(value==='weld'?'Svar':'HAZ / základní materiál'):typeof value==='boolean'?(value?'Ano':'Ne'):typeof value==='number'?`${number(value)} ${referenceLabels[key]?.[1]||''}`.trim():String(value||'Chybí');
 function referenceDifferences(input){return reference?REFERENCE_KEYS.filter(key=>typeof reference[key]==='number'?!Number.isFinite(input[key])||Math.abs(reference[key]-input[key])>1e-9:reference[key]!==input[key]):[];}
 function changeCrTask(mode){byId('cr_task').value=mode;byId('cr_setup_details').open=mode==='record';renderCR();saveInputs();}
 function renderCR() {
  const input=crInput(),mode=val('cr_task'),estimate=mode==='estimate',record=mode==='record';syncChoices('cr_task');
  show('cr_setup_details',mode!=='check');show('cr_exposure_fields',mode!=='check');show('cr_seconds_wrap',record);show('cr_quality_fields',!estimate);show('cr_resolution_fields',record||input.kind==='raw');show('cr_record_fields',record);show('cr_library_section',mode!=='check');show('cr_reference_picker',estimate);show('cr_reference_status',estimate);show('cr_quality_output',!estimate);show('cr_estimate_output',estimate);
  text('cr_task_hint',estimate?'Vyberte skutečné referenční měření a nastavte požadovanou vzdálenost a proud.':record?'Nejprve vyplňte sestavu a skutečnou expozici, potom zadejte naměřené SNR.':'Zadejte podmínky zkoušky a hodnotu SNR ze softwaru.');
  text('cr_exposure_heading',estimate?'Plánovaná expozice':'Skutečná expozice');d.querySelector('[for="cr_current"]').textContent=estimate?'Plánovaný proud':'Skutečný proud';
  text('cr_selected_reference',reference?reference.name:'Žádná reference');text('cr_choose_reference',reference?'Změnit referenci':'Vybrat z knihovny');
  text('cr_scope_note',estimate?'Odhad platí při shodných ostatních podmínkách a převaze kvantového šumu. Nový snímek znovu změřte.':'Posuzuje se pouze SNR_N. IQI, prostorové rozlišení a ostatní požadavky se ověřují samostatně.');
  text('cr_voltage_recommendation',voltageLabel(input.material,input.thickness));text('cr_error','');text('cr_cp1_error','');
  clearFields(['cr_thickness','cr_voltage','cr_achieved_snr','cr_srb','cr_magnification','cr_fdd','cr_current']);
  clear('cr_target_snr','cr_suggested_exposure','cr_suggested_time');text('cr_target_explanation','');text('cr_estimate_target','');setStatus('cr_validation_message','Zadejte naměřené SNR pro kontrolu.');
  show('cr_clear_reference',!!reference);text('cr_reference_name',reference?`${reference.name} · ${number(reference.exposure)} mA·min · SNR_N ${number(reference.achievedSnr)}`:'');text('cr_reference_error','');
  show('cr_stale_message',!!staleMeasurement);text('cr_stale_message',staleMeasurement);
  resultState('cr','neutral',estimate?'Odhad z referenčního měření':'Kontrola SNR_N','',estimate?'Vyberte referenční měření z knihovny.':'Doplňte naměřenou hodnotu SNR.');
  try{
   requireNumbers(['cr_thickness','cr_voltage']);
   const maxU=['aluminum','titanium'].includes(input.material)?500:1000;
   text('cr_voltage-hint',`Podporovaná tabulka: více než 0 až ${number(maxU)} kV.`);
   byId('cr_voltage-hint').classList.remove('sr-only');byId('cr_voltage-hint').classList.add('input-hint');
   if(input.voltage>maxU)failField('cr_voltage',`Pro tento materiál zadejte nejvýše ${number(maxU)} kV.`);
   let r;try{r=snrTarget(input);}catch(error){if(input.cp1)text('cr_cp1_error',error.message);throw error;}
   text('cr_target_snr','≥ '+number(r.target));text('cr_estimate_target',`Cíl SNR_N ≥ ${number(r.target)}`);
   text('cr_target_explanation',`Tabulka ${r.table} · základ ${r.base} × místo měření ${number(r.roiFactor)}${input.cp1?' × CP I 0,8':''}`);
   text('cr_result_context',`${MATERIALS[input.material]} ${number(input.thickness)} mm · ${number(input.voltage)} kV · třída ${input.qualityClass}`);
   if(!estimate&&val('cr_achieved_snr').trim()){
    try{requireNumbers(['cr_achieved_snr',...(input.kind==='raw'?['cr_srb','cr_magnification']:[])]);
     const actual=normalizedSnr(input),passes=actual>=r.target;
     setStatus('cr_validation_message',`SNR_N ${number(actual)} ${passes?'splňuje':'nesplňuje'} požadavek ${number(r.target)}.`,passes?'pass':'fail');
     byId('cr_result_focus').dataset.state=passes?'pass':'fail';text('cr_result_kind',passes?'Kritérium SNR_N splněno':'SNR_N pod požadavkem');text('cr_next_step','');
    }catch(error){setStatus('cr_validation_message',error.message);text('cr_next_step',error.message);}
   }else if(!estimate&&staleMeasurement){text('cr_next_step',staleMeasurement);text('cr_result_kind','Je potřeba nové měření');}
   if(estimate&&reference){
    try{
     const differences=referenceDifferences(input);
     if(differences.length){byId('cr_reference_error').innerHTML='<strong>Reference neodpovídá zadání</strong><ul>'+differences.map(key=>`<li><strong>${esc(referenceLabels[key][0])}:</strong> reference ${esc(displayCondition(key,reference[key]))}, zadání ${esc(displayCondition(key,input[key]))}.</li>`).join('')+'</ul><p>Zvolte odpovídající referenci nebo proveďte nové měření.</p>';text('cr_next_step','Podmínky se liší od reference. Podrobnosti jsou uvedeny níže.');byId('cr_result_focus').dataset.state='fail';text('cr_result_kind','Reference neodpovídá');}
     else {requireNumbers(['cr_fdd']);const exposure=predictCrExposure(reference,input,r.target);text('cr_suggested_exposure','≈ '+number(exposure)+' mA·min');byId('cr_result_focus').dataset.state='estimate';text('cr_next_step','');requireNumbers(['cr_current']);text('cr_suggested_time','≈ '+formatDuration(exposure/input.current));}
    }catch(error){markError('cr_reference_error',error);text('cr_next_step',error.message);}
   }
  }catch(error){if(!error.missing)markError('cr_error',error);setStatus('cr_validation_message','Kritérium nelze vyhodnotit.');resultState('cr',error.missing?'neutral':'fail','Doplňte podmínky','',error.message);}
  updateMobile();
 }
 const temporaryRecords=new Map();let libraryAvailable=false,libraryRevision=0;
 const library=w.indexedDB?createCrLibrary({indexedDB:w.indexedDB,channel:w.BroadcastChannel?new w.BroadcastChannel('rt-cr-library-v1'):null,onChange:()=>{if(libraryAvailable)refreshLibrary().catch(libraryFailure);}}):null;
 function libraryFailure(){const note=d.querySelector('.save-note');if(note){note.textContent='CR knihovnu se nepodařilo trvale uložit. Stáhněte zálohu; dočasná měření zůstanou jen do obnovení stránky.';note.dataset.state='error';}}
 async function refreshLibrary(){const revision=++libraryRevision,snapshot=await library.snapshot();if(destroyed||revision!==libraryRevision)return;records=[...temporaryRecords.values(),...snapshot.measurements.filter(r=>!temporaryRecords.has(r.id))];legacy=snapshot.legacy;deletedLegacy.clear();renderLibrary();renderCR();}
 const libraryReady=library?library.init({measurements:records,legacy:legacy.filter(r=>!deletedLegacy.has(String(r.id)))},{hiddenLegacy:[...deletedLegacy]}).then(async()=>{if(destroyed)return;libraryAvailable=true;await refreshLibrary();if(!reference&&saved?.referenceId){reference=records.find(r=>r.id===saved.referenceId)||null;renderCR();renderLibrary();}}).catch(libraryFailure):Promise.resolve();
 on(w,'focus',()=>{if(libraryAvailable)refreshLibrary().catch(libraryFailure);});
 on(w,'storage',event=>{if(libraryAvailable&&['rt_measurements_v2','cr_techniques_library'].includes(event.key)){const incoming={measurements:list(parse('rt_measurements_v2',[])).filter(isMeasurement).map(r=>({...createCrMeasurement(r),id:r.id})),legacy:list(parse('cr_techniques_library',[])).filter(r=>r&&typeof r.name==='string'&&Number.isFinite(r.id)&&Number.isFinite(r.thickness))};library.merge(incoming,{migration:true}).catch(libraryFailure);}});
 function renderLibrary(){
  const container=byId('cr_library_container');const opened=new Set([...container.querySelectorAll('details[open]')].map(el=>el.closest('[data-record]')?.dataset.record));
  const modern=records.map(r=>`<article class="record-row" data-record="${esc(r.id)}" data-active="${reference?.id===r.id}"><div class="record-overview"><div><h4>${esc(r.name)}</h4><p>${esc(MATERIALS[r.material])} ${number(r.thickness)} mm · ${number(r.voltage)} kV · ${esc(new Date(r.measuredAt).toLocaleDateString('cs-CZ'))}</p></div>${reference?.id===r.id?'<span class="active-reference">Aktivní reference</span>':''}</div><div class="record-metrics"><span>${number(r.exposure)} mA·min</span><span class="measurement-status" data-state="${r.snrPass?'pass':'fail'}">SNR_N ${number(r.achievedSnr)} / ${number(r.target)} · ${r.snrPass?'kritérium splněno':'zkušební měření pod cílem'}</span></div><details ${opened.has(r.id)?'open':''}><summary>Podrobnosti měření</summary><dl>${[['Sestava',r.setup],['Filtrace / fólie',r.screens],['Skener',r.scan],['FDD',number(r.fdd)+' mm'],['Proud a čas',number(r.current)+' mA · '+number(r.seconds)+' s'],['SR_b / zvětšení',number(r.srb)+' mm · '+number(r.magnification)+'×'],['Prodleva',number(r.delay)+' min'],['Místo SNR',displayCondition('roi',r.roi)],['Zarovnání svaru',r.flush?'Ano':'Ne'],['Třída / kompenzace',r.qualityClass+(r.cp1?' · CP I':' · bez CP I')]].map(([key,value])=>`<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></details><div class="record-actions"><button type="button" class="secondary-button" data-action="reference" data-id="${esc(r.id)}">${reference?.id===r.id?'Použít aktivní referenci':'Použít jako referenci'}</button><button type="button" class="text-button" data-action="load" data-id="${esc(r.id)}">Načíst měření</button><button type="button" class="text-button delete-button" data-action="delete" data-id="${esc(r.id)}">Smazat</button></div></article>`);
  const old=legacy.filter(r=>!deletedLegacy.has(String(r.id))).map(r=>`<article class="record-row legacy-record"><div class="record-overview"><h4>${esc(r.name.slice(0,160))}</h4><span class="legacy-badge">Starý neověřený odhad</span></div><p>${number(r.thickness)} mm · Původní záznam nedokládá skutečné parametry měření. Nelze jej použít jako referenci.</p><button type="button" class="text-button delete-button" data-action="delete-legacy" data-id="${esc(r.id)}">Smazat starý záznam</button></article>`);
  text('cr_library_count',`${records.length} měření${old.length?' · '+old.length+' starých odhadů':''}`);
  container.innerHTML=[...modern,...old].join('')||'<div class="empty-library"><strong>Zatím nemáte uložené měření</strong><p>Reference vyžaduje skutečnou expozici a naměřené SNR.</p><button type="button" class="secondary-button" data-action="new">Zapsat první měření</button></div>';
 }
 const crMap={material:'cr_material',thickness:'cr_thickness',fdd:'cr_fdd',voltage:'cr_voltage',qualityClass:'cr_class',roi:'cr_roi',flush:'cr_flush',cp1:'cr_cp1',iqiConfirmed:'cr_iqi',kind:'cr_snr_kind',measured:'cr_achieved_snr',srb:'cr_srb',magnification:'cr_magnification',current:'cr_current',seconds:'cr_seconds',name:'cr_technique_name',setup:'cr_setup',screens:'cr_screens',scan:'cr_scan',delay:'cr_delay',measuredAt:'cr_measured_at'};
 function loadRecord(record,mode){for(const [key,id]of Object.entries(crMap)){const el=byId(id);if(el.type==='checkbox')el.checked=!!record[key];else el.value=record[key]??'';}staleMeasurement='';changeCrTask(mode);renderLibrary();focusField(mode==='estimate'?'cr_fdd':'cr_setup');}
 on(byId('cr_save_button'),'click',async()=>{
  if(val('cr_task')!=='record')return;
  text('cr_save_error','');
  try{
   const numeric=['cr_thickness','cr_voltage','cr_fdd','cr_current','cr_seconds','cr_srb','cr_magnification','cr_delay','cr_achieved_snr'];const strings=['cr_setup','cr_screens','cr_scan','cr_technique_name','cr_measured_at'];[...numeric,...strings].forEach(id=>touched.add(id));requireNumbers(numeric);requireText(strings);
   if(val('cr_technique_name').trim().length>120)failField('cr_technique_name','Použijte název do 120 znaků.');
   const record=createCrMeasurement(crInput());record.id=w.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(16).slice(2)}`;
   temporaryRecords.set(record.id,record);records.unshift(record);renderLibrary();renderCR();byId('cr_save_button').disabled=true;
   await libraryReady;let durable=false;
   try{if(!libraryAvailable)throw new Error();await library.add(record);temporaryRecords.delete(record.id);await refreshLibrary();durable=true;}catch{libraryFailure();}
   if(destroyed)return;byId('cr_save_error').dataset.state=durable?'info':'fail';text('cr_save_error',!durable?'Měření je uložené pouze dočasně v této otevřené stránce. Stáhněte zálohu.':`Měření uloženo. ${record.snrPass?'Kritérium SNR_N splněno.':'SNR_N je pod cílem; záznam slouží jako zkušební reference.'}`);saveInputs();
  }catch(error){if(destroyed)return;byId('cr_save_error').dataset.state='fail';markError('cr_save_error',error);focusField(error.field||'cr_cp1');}
  finally{if(!destroyed)byId('cr_save_button').disabled=false;}
 });
 on(byId('cr_library_container'),'click',event=>{
  const button=event.target.closest('button[data-action]');if(!button)return;
  const {action,id}=button.dataset,record=records.find(r=>r.id===id);
  if(action==='new'){changeCrTask('record');focusField('cr_setup');}
  else if(action==='load'&&record){reference=null;loadRecord(record,'record');}
  else if(action==='reference'&&record){reference=record;loadRecord(record,'estimate');}
  else if(action==='delete'||action==='delete-legacy'){
   text('modal-title','Smazat záznam měření?');text('modal-message','Záznam bude odstraněn z knihovny tohoto prohlížeče.');
   openDialog('modal-container');confirmAction=async()=>{
    try{await libraryReady;if(!libraryAvailable)throw new Error('Smazání nelze trvale uložit. Povolte úložiště a zkuste to znovu.');await library.remove(action==='delete'?'measurement':'legacy',id);temporaryRecords.delete(id);if(reference?.id===id)reference=null;await refreshLibrary();saveInputs();}
    catch(error){byId('cr_save_error').dataset.state='fail';text('cr_save_error',error.message);}
    byId('cr_library_title').focus();
   };
  }
 });
 on(byId('cr_clear_reference'),'click',()=>{reference=null;renderCR();renderLibrary();saveInputs();byId('cr_choose_reference').focus();});
 on(byId('cr_choose_reference'),'click',()=>{byId('cr_library_title').focus();byId('cr_library_section').scrollIntoView?.({block:'start',behavior:scrollBehavior()});});
 const physicalCR=new Set(['cr_material','cr_thickness','cr_fdd','cr_voltage']);
 const measurementCR=new Set(['cr_snr_kind','cr_srb','cr_magnification','cr_roi','cr_flush','cr_current','cr_seconds','cr_setup','cr_screens','cr_scan','cr_delay']);
 function highlightGeometry(id){const module=id.startsWith('n_')?'n':id.startsWith('ug_')?'ug':null;if(!module)return;const svg=byId(module+'_geometry_diagram').querySelector('svg');if(svg)svg.dataset.highlight=id.includes('thickness')?'thickness':id.includes('diameter')?'diameter':id.includes('gap')?'gap':id==='ug_focus'?'focus':'distance';}
 on(byId('tab-content'),'focusin',event=>{if(event.target.matches('input,select')){d.body.classList.add('field-focused');highlightGeometry(event.target.id);}});
 on(byId('tab-content'),'focusout',event=>{const el=event.target;if(!el.matches('input,select'))return;touched.add(el.id);if(el.id.startsWith('n_'))renderN();else if(el.id.startsWith('ug_'))renderUg();else if(el.id.startsWith('cr_'))renderCR();else renderTime();if(el.matches('[data-number]')&&!byId(el.id+'-error')?.textContent){try{requireNumbers([el.id]);}catch{}}w.setTimeout(()=>{d.body.classList.toggle('field-focused',!!d.activeElement?.matches('#tab-content input,#tab-content select'));},0);});
 on(byId('tab-content'),'input',event=>{
  const el=event.target;if(!el.matches('input,select'))return;
  fieldError(el.id,'');
  if(el.id==='n_technique')byId('n_distance').value='';
  if(el.id.startsWith('n_'))renderN();
  else if(el.id.startsWith('ug_'))renderUg();
  else if(el.id.startsWith('cr_')){
   if((physicalCR.has(el.id)||measurementCR.has(el.id))&&val('cr_achieved_snr').trim())staleMeasurement=`Změněno: ${label(el.id)}. Předchozí SNR už neplatí; zadejte nové měření.`;
   if(physicalCR.has(el.id)){byId('cr_achieved_snr').value='';byId('cr_seconds').value='';byId('cr_iqi').checked=false;}
   else if(measurementCR.has(el.id)){byId('cr_achieved_snr').value='';byId('cr_iqi').checked=false;}
   if(el.id==='cr_achieved_snr'&&val(el.id).trim())staleMeasurement='';
   if(el.id==='cr_task')byId('cr_setup_details').open=val('cr_task')==='record';
   text('cr_save_error','');renderCR();
  }else {if(el.id==='xray_mode')byId('xray_reference_fields').open=val('xray_mode')==='manual';renderTime();}
  highlightGeometry(el.id);
  saveInputs();
 });
 // Native selects also emit change; keeping it idempotent supports keyboard and
 // programmatic change without invalidating a measurement twice.
 on(byId('source_type'),'change',()=>{renderTime();saveInputs();});
 byId('cr_setup_details').open=val('cr_task')==='record';byId('xray_reference_fields').open=val('xray_mode')==='manual';
 byId('cr_cp1').setAttribute('aria-describedby','cr_cp1_error');byId('cr_iqi').setAttribute('aria-describedby','cr_cp1_error');
 renderN();renderUg();renderTime();renderCR();renderLibrary();updateMobile();
 text('calculation-version',`Výpočty aktualizovány 6. 9. 2026 · ${CALCULATION_VERSION}`);
 function captureCalculation(){
  const kind=activeTab==='exposures'?'n':activeTab==='unsharpness'?'ug':activeTab==='time'?val('source_type')==='gamma'?'gamma':'xray':'cr_'+val('cr_task');
  let inputs;
  if(kind==='n')inputs={technique:val('n_technique'),qualityClass:val('n_testingClass'),thickness:n('n_thickness'),diameter:n('n_diameter'),distance:n('n_distance')};
  else if(kind==='ug')inputs={technique:val('ug_technique'),qualityClass:val('ug_class'),thickness:n('ug_thickness'),diameter:n('ug_diameter'),gap:n('ug_gap'),sourceDistance:n('ug_source_distance'),focus:n('ug_focus'),planar:checked('ug_planar')};
  else if(kind==='xray')inputs={mode:val('xray_mode'),material:val('xray_material'),film:val('xray_film'),voltage:n('xray_voltage'),thickness:n('t_thickness_xray'),distance:n('t_distance_xray'),current:n('xray_current'),exposure:n('xray_factor'),referenceDistance:n('xray_reference_distance'),referenceName:val('xray_reference_name')};
  else if(kind==='gamma')inputs={activity:n('t_activity'),referenceTime:val('t_activity_date')?new Date(val('t_activity_date')).toISOString():'',exposureTime:val('t_exposure_date')?new Date(val('t_exposure_date')).toISOString():'',thickness:n('t_thickness_gamma'),distance:n('t_distance_gamma'),film:val('t_film')};
  else inputs=crInput();
  const root=byId(kind==='n'?'exposures':kind==='ug'?'unsharpness':kind==='xray'?'xray_calculator':kind==='gamma'?'gamma_calculator':'digital_radiography');
  const form=Object.fromEntries([...root.querySelectorAll('input,select')].map(el=>[el.id,el.type==='checkbox'?el.checked:el.value]));
  const context={kind,inputs,form,...(kind==='xray'?{manualConfirmed:manualSignature===xraySignature()}:{ }),...(kind==='cr_estimate'?{reference:reference?clone(reference):null}:{})};
  evaluate(context);return clone(context);
 }
 function applyForm(values,{restore=false}={}){
  const changed=[];
  for(const [id,value]of Object.entries(values)) {const el=inputElements.find(el=>el.id===id);if(!el)continue;if(el.tagName==='SELECT'&&![...el.options].some(o=>o.value===String(value)))continue;const old=el.type==='checkbox'?el.checked:el.value;if(old!==(el.type==='checkbox'?!!value:String(value)))changed.push(id);if(el.type==='checkbox')el.checked=!!value;else el.value=value??'';fieldError(id,'');}
  if(!restore&&changed.some(id=>physicalCR.has(id)||measurementCR.has(id))){if(val('cr_achieved_snr').trim())staleMeasurement='Změněna společná geometrie. Předchozí SNR už neplatí; zadejte nové měření.';byId('cr_achieved_snr').value='';byId('cr_seconds').value='';byId('cr_iqi').checked=false;}
  renderN();renderUg();renderTime();renderCR();saveInputs();
 }
 function restoreCalculation(context,{preserveCalibration=false}={}){
  assertContext(context);evaluate(context);
  const values=canonicalForm(context,{localTime:true});
  if(['xray','gamma'].includes(context.kind))values.source_type=context.kind==='gamma'?'gamma':'xray';
  if(context.kind.startsWith('cr_')){values.cr_task=context.kind.slice(3);reference=context.reference&&isMeasurement(context.reference)?clone(context.reference):null;staleMeasurement='';}
  // Reopened manual calibration must be explicitly re-confirmed for a new use.
  if(context.kind==='xray')manualSignature=null;
  applyForm(values,{restore:true});
  if(preserveCalibration&&context.kind==='xray'&&context.manualConfirmed){manualSignature=xraySignature();renderTime();}
  renderLibrary();
  tab(context.kind==='n'?'exposures':context.kind==='ug'?'unsharpness':context.kind.startsWith('cr_')?'digital_radiography':'time');
  saveInputs();
 }
 async function exportLibrary(){await libraryReady;if(libraryAvailable){const snapshot=await library.snapshot();return clone({measurements:[...temporaryRecords.values(),...snapshot.measurements.filter(r=>!temporaryRecords.has(r.id))],legacy:snapshot.legacy});}return clone({measurements:records,legacy:legacy.filter(r=>!deletedLegacy.has(String(r.id)))});}
 async function restoreLibrary(incoming){
  await libraryReady;if(!libraryAvailable)throw new Error('CR úložiště není dostupné.');
  await library.merge(incoming);for(const record of incoming.measurements)temporaryRecords.delete(record.id);await refreshLibrary();
 }
 const destroy=()=>{destroyed=true;chart?.destroy();library?.close();abort.abort();};on(w,'pagehide',event=>{if(!event.persisted)destroy();});
 return {libraryReady,exportLibrary,restoreLibrary,destroy,renderN,renderUg,renderTime,renderCR,records:()=>records,tab,captureCalculation,restoreCalculation,applyForm};
}

const LOCAL='@local';
// Former account scopes survive only as separate local archives; no network API.
function createWorkspaceStore({indexedDB=globalThis.indexedDB,onChange=()=>{}}={}){
 let db,archive=LOCAL,items=[],all=[],closed=false;
 const owner=()=>archive;
 const open=()=>new Promise((resolve,reject)=>{if(!indexedDB)return reject(new Error('Prohlížeč nepovoluje úložiště pro práci offline.'));const r=indexedDB.open('rt-workspace-v1',1);r.onupgradeneeded=()=>{r.result.createObjectStore('entries',{keyPath:'key'});r.result.createObjectStore('meta');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Zavřete starší otevřenou verzi aplikace.'));});
 const tx=(name,access,action)=>new Promise((resolve,reject)=>{const t=db.transaction(name,access),request=action(t.objectStore(name));t.oncomplete=()=>resolve(request?.result);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||new Error('Uložení bylo přerušeno.'));});
 const reload=async()=>{if(closed)return;all=await tx('entries','readonly',s=>s.getAll());items=all.filter(r=>r.owner===owner());if(!closed)onChange();};
 const archives=()=>[...new Set([LOCAL,...all.map(r=>r.owner),archive])].map((id,i)=>({id,label:id===LOCAL?'Místní archiv':'Převedený archiv '+i,count:all.filter(r=>r.owner===id).length}));
 async function init(){
  db=await open();if(closed){db.close();return;}
  // Atomic, idempotent conversion: preserve records, IDs and CR restore journal.
  await new Promise((resolve,reject)=>{const t=db.transaction(['entries','meta'],'readwrite'),s=t.objectStore('entries'),m=t.objectStore('meta'),rows=s.getAll(),meta=m.getAllKeys();
   meta.onsuccess=()=>{const saved=m.get('local-archive'),oldOwner=m.get('owner'),oldMode=m.get('mode');oldMode.onsuccess=()=>{
    const available=new Set(rows.result.map(r=>r.owner));archive=saved.result||(oldMode.result!=='local'&&oldOwner.result?oldOwner.result:LOCAL);
    if(archive!==LOCAL&&!available.has(archive))archive=available.has(LOCAL)?LOCAL:rows.result[0]?.owner||LOCAL;
    for(const row of rows.result)if(row.pending)s.put({...row,pending:false});
    for(const key of meta.result)if(key==='owner'||key==='mode'||String(key).startsWith('cursor/'))m.delete(key);
    m.put(archive,'local-archive');
   };};t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||new Error('Převod místních dat byl přerušen.'));
  });await reload();
 }
 async function add(data){if(!db||closed)throw new Error('Úložiště zatím není připravené.');const scope=owner();await tx('entries','readwrite',s=>s.add({key:scope+'/'+data.id,owner:scope,data,pending:false}));await reload();}
 async function setArchive(next){await reload();if(!archives().some(a=>a.id===next))throw new Error('Místní archiv není dostupný.');await tx('meta','readwrite',s=>s.put(next,'local-archive'));archive=next;await reload();}
 async function importEntries(entries,library,expectedOwner=owner()){
  const scope=owner(),pending=false;if(scope!==expectedOwner)throw new Error('Změnil se místní archiv. Znovu načtěte zálohu.');
  // One transaction adds all history and a recoverable CR-library journal.
  await new Promise((resolve,reject)=>{const t=db.transaction(['entries','meta'],'readwrite'),s=t.objectStore('entries'),r=s.getAll(),journal=t.objectStore('meta').get('library-restore');let error;
   journal.onsuccess=()=>{try{const existing=new Map(r.result.filter(e=>e.owner===scope).map(e=>[e.data.id,e.data]));for(const data of entries){const old=existing.get(data.id);if(old&&canonical(old)!==canonical(data))throw new Error('Obsah historie se mezitím změnil. Znovu načtěte zálohu.');if(!old)s.add({key:scope+'/'+data.id,owner:scope,data,pending});}const merged=planRestore({entries:[],library},[],journal.result||{measurements:[],legacy:[]}).library;t.objectStore('meta').put(merged,'library-restore');}catch(e){error=e;t.abort();}};
   t.oncomplete=resolve;t.onerror=()=>reject(error||t.error);t.onabort=()=>reject(error||t.error||new Error('Obnova byla přerušena.'));
  });await reload();
 }
 return {init,add,setArchive,archives,importEntries,reload,entries:()=>items.map(r=>({...r.data})),owner,
  pendingLibrary:()=>tx('meta','readonly',s=>s.get('library-restore')),
  finishLibraryRestore:expected=>new Promise((resolve,reject)=>{const t=db.transaction('meta','readwrite'),s=t.objectStore('meta'),r=s.get('library-restore');let cleared=false;r.onsuccess=()=>{if(expected===undefined||canonical(r.result)===canonical(expected)){s.delete('library-restore');cleared=true;}};t.oncomplete=()=>resolve(cleared);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);}),
  close(){closed=true;db?.close();}};
}

const dataToolsBody=`
 <section class="data-section"><h4>Data v tomto zařízení</h4><p>Zakázky, historie i CR knihovna se ukládají pouze v tomto profilu prohlížeče. Aplikace je nikam neodesílá a nepotřebuje účet.</p><div id="archive-choice" hidden><label for="local-archive">Místní archiv</label><select id="local-archive" disabled></select><p>Oddělené archivy zachovávají data uložená dřívější verzí v tomto zařízení. Každý zálohujte samostatně. CR knihovna je společná.</p></div></section>
 <section class="data-section"><h4>Aplikace pro práci offline</h4><p id="offline-detail" role="status">Kontroluji offline kopii…</p><div class="work-panel-actions"><button id="install-app" type="button" class="primary-button">Instalovat aplikaci</button><button id="offline-update" type="button" class="secondary-button">Vyhledat a stáhnout aktualizaci</button><button id="offline-check" type="button" class="secondary-button">Ověřit připravenost</button></div><p id="offline-update-status" role="status"></p><p>Aktualizace se stahuje pouze na váš pokyn a použije se po zavření všech oken aplikace.</p><p id="install-help">V nabídce prohlížeče zvolte instalaci aplikace. Na iPhonu či iPadu použijte Sdílet → Přidat na plochu. Pokud volbu nevidíte, otevřete adresu aplikace v běžném prohlížeči.</p><p>První stažení vyžaduje připojení. Vestavěný manuál a výpočty jsou součástí offline kopie; odkazované PDF dokumenty vyžadují internet.</p><button id="storage-persist" type="button" class="secondary-button">Chránit místní data</button><p id="storage-persist-status" role="status"></p></section>
 <section class="data-section"><h4>Záloha a obnova</h4><p>Záloha obsahuje zakázky a historii z právě zvoleného místního archivu a celou místní CR knihovnu. Rozepsané formuláře ani nastavení vzhledu se nepřenášejí.</p><button id="backup-export" type="button" class="primary-button" disabled>Stáhnout zálohu</button><p id="backup-last"></p><label for="backup-file">Obnovit ze zálohy JSON</label><input id="backup-file" type="file" accept=".json,application/json" disabled><div id="backup-preview" hidden><p id="backup-summary"></p><p>Existující záznamy zůstanou zachované. Shodné záznamy se přeskočí.</p><button id="backup-restore" type="button" class="primary-button">Přidat záznamy ze zálohy</button></div><p id="backup-status" role="status"></p><p>Zálohu ukládejte mimo data tohoto webu. Smazání dat prohlížeče odstraní místní záznamy i offline kopii.</p></section>`;

function initDataTools({document:d,app,store,open,onArchiveChanged,onRestored}){
 const w=d.defaultView,by=id=>d.getElementById(id),abort=new w.AbortController(),on=(id,event,fn)=>by(id).addEventListener(event,fn,{signal:abort.signal});
 let candidate=null,target=null,ready=false,working=false;
 const status=(text,error=false)=>{by('backup-status').textContent=text;by('backup-status').dataset.error=String(error);};
 let busyFocus=null;
 function controls(){
  const panel=by('data-panel');
  if(working&&!busyFocus&&!panel.hidden&&panel.contains(d.activeElement)){busyFocus=d.activeElement;by('backup-status').tabIndex=-1;by('backup-status').focus();}
  for(const id of ['backup-export','backup-file','local-archive'])by(id).disabled=!ready||working;by('backup-restore').disabled=!ready||working;
  panel.setAttribute('aria-busy',String(working));
  if(!working&&busyFocus&&!panel.hidden){(busyFocus.isConnected&&!busyFocus.disabled&&!busyFocus.closest('[hidden]')?busyFocus:by('backup-status')).focus();busyFocus=null;}
 }
 function reset(){candidate=null;target=null;by('backup-preview').hidden=true;by('backup-file').value='';}
 function render(){const select=by('local-archive'),archives=store.archives?.()||[];select.replaceChildren(...archives.map(a=>{const o=d.createElement('option');o.value=a.id;o.textContent=a.label+' ('+a.count+' záznamů)';return o;}));select.value=store.owner?.()||'';by('archive-choice').hidden=archives.length<2;}
 async function recover(){let pending;while((pending=await store.pendingLibrary?.())){await app.restoreLibrary(pending);if(await store.finishLibraryRestore(pending)!==false)break;}}
 on('data-open','click',()=>{render();open();});
 on('local-archive','change',async()=>{const next=by('local-archive').value;working=true;controls();reset();try{await store.setArchive(next);await onArchiveChanged();status('Místní archiv byl změněn.');}catch(error){status(error.message,true);}finally{working=false;render();controls();}});
 on('backup-export','click',async()=>{working=true;controls();try{
  await store.reload?.();const pending=await store.pendingLibrary?.(),snapshot=await app.exportLibrary(),library=pending?planRestore({entries:[],library:pending},[],snapshot).library:snapshot;
  const data=createBackup(store.entries(),library),blob=new w.Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=w.URL.createObjectURL(blob),link=d.createElement('a');link.href=url;link.download=`RT-Asistent-zaloha-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;d.body.append(link);link.click();link.remove();w.setTimeout(()=>w.URL.revokeObjectURL(url),30000);status('Záloha je připravená ke stažení. Zkontrolujte soubor ve stažených souborech.');by('backup-last').textContent='Poslední vytvoření zálohy: '+new Date().toLocaleString('cs-CZ');
 }catch(error){status('Zálohu se nepodařilo vytvořit: '+error.message,true);}finally{working=false;controls();}});
 on('backup-file','change',async()=>{const file=by('backup-file').files?.[0];reset();if(!file)return;working=true;controls();try{
  if(file.size>BACKUP_LIMIT)throw new Error('Záloha může mít nejvýše 20 MB.');await recover();await store.reload?.();
  const data=parseBackup(await file.text()),plan=planRestore(data,store.entries(),await app.exportLibrary()),c=plan.counts;candidate=data;target=store.owner?.();by('backup-summary').textContent=`Přidá se ${c.jobs} zakázek, ${c.calculations} výpočtů, ${c.measurements} CR měření a ${c.legacy} starých odhadů. Shodných záznamů: ${c.skipped}.`;by('backup-preview').hidden=false;status('Formát, vstupy a výsledky zálohy jsou konzistentní. Zkontrolujte souhrn a potvrďte přidání.');
 }catch(error){status(error.message,true);}finally{working=false;controls();}});
 on('backup-restore','click',async()=>{if(!candidate)return;working=true;controls();let committed=false;try{
  await store.reload?.();if(target!==store.owner?.())throw new Error('Změnil se místní archiv. Vyberte zálohu znovu.');
  const plan=planRestore(candidate,store.entries(),await app.exportLibrary());await store.importEntries(plan.entries,candidate.library,target);committed=true;await recover();reset();await onRestored();status('Obnova dokončena. Původní data zůstala zachovaná.');
 }catch(error){status(committed?'Historie je uložená, dokončení CR knihovny čeká v zařízení. Povolte místní úložiště a otevřete aplikaci znovu; obnovu lze bezpečně zopakovat.':error.message,true);}finally{working=false;controls();}});
 render();
 return {async ready(){ready=true;try{await recover();}catch{status('Dokončení obnovy CR knihovny čeká na povolení místního úložiště. Záloha dosud obnovených dat je dostupná.',true);}render();controls();},destroy(){abort.abort();}};
}

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/rt-asistent/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (true               && deps && deps.length > 0) {
		document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises$2) {
			return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
				status: "fulfilled",
				value: value$1
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			const cssSelector = isCss ? "[rel=\"stylesheet\"]" : "";
			if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err$2) {
		const e$1 = new Event("vite:preloadError", { cancelable: true });
		e$1.payload = err$2;
		window.dispatchEvent(e$1);
		if (!e$1.defaultPrevented) throw err$2;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};

const IDENTIFIERS = [['jobName','Zakázka'],['part','Díl'],['drawingNumber','Číslo výkresu'],['batch','Běžné číslo'],['weld','Číslo svaru']];
const fields = {
 technique:['Technika',''],qualityClass:['Třída zkoušení',''],thickness:['Tloušťka','mm'],diameter:['Vnější průměr De','mm'],distance:['Vzdálenost zdroj–film SFD','mm'],sourceDistance:['Zdroj–první povrch','mm'],gap:['Mezera předmět–film','mm'],focus:['Velikost zdroje / ohniska','mm'],planar:['Planární vady',''],mode:['Zdroj reference',''],material:['Materiál',''],film:['Film',''],voltage:['Napětí','kV'],current:['Proud','mA'],exposure:['Referenční expozice','mA·min'],referenceDistance:['Referenční SFD','mm'],referenceName:['Vlastní reference',''],activity:['Referenční aktivita','GBq'],referenceTime:['Datum referenční aktivity',''],exposureTime:['Datum expozice',''],fdd:['Vzdálenost zdroj–detektor FDD','mm'],roi:['Místo měření SNR',''],flush:['Zarovnaný svar',''],cp1:['Kompenzace CP I',''],iqiConfirmed:['Potvrzené IQI',''],kind:['Druh SNR',''],measured:['Naměřené SNR',''],srb:['Základní prostorové rozlišení SR_b','mm'],magnification:['Zvětšení',''],seconds:['Skutečný čas','s'],name:['Název měření',''],setup:['Sestava',''],screens:['Fólie / filtrace',''],scan:['Skener',''],delay:['Prodleva','min'],measuredAt:['Datum měření',''],achievedSnr:['Dosažené SNR_N',''],target:['Cílové SNR_N',''],snrPass:['Kritérium SNR_N splněno',''],schema:['Verze dat reference',''],calculationVersion:['Model reference',''],id:['ID reference',''],version:['Verze reference','']
};
const resultFields = {count:['Počet expozic',''],nominal:['Nominální odečet',''],nearBoundary:['Bod u hranice oblastí',''],x:['t/De',''],y:['De / vzdálenost',''],outside:['Zdroj vně, film uvnitř',''],yMax:['Horní mez osy y',''],figure:['Obrázek nomogramu',''],maxCount:['Maximum v nomogramu',''],centered:['Zdroj ve středu',''],ug:['Geometrická neostrost Ug','mm'],f:['Hodnocená vzdálenost f','mm'],b:['Vzdálenost b','mm'],minF:['Minimální f','mm'],minInputDistance:['Minimální vzdálenost k prvnímu povrchu','mm'],coefficient:['Koeficient minimální vzdálenosti',''],passes:['Posuzované kritérium splněno',''],minutes:['Expoziční čas','min'],exposure:['Expozice','mA·min'],currentActivity:['Aktivita při expozici','GBq'],ciHours:['Referenční součin aktivity a času','Ci·h'],gbqHours:['Referenční součin aktivity a času','GBq·h'],actual:['Dosažené SNR_N',''],target:['Cílové SNR_N','']};
const values$1={outside:'Jedna stěna, zdroj vně',inside:'Jedna stěna, zdroj uvnitř',single:'Jedna stěna',double:'Dvě stěny, DWSI',dwsi:'DWSI',dwdi:'DWDI',chart:'Výrobní diagram',manual:'Vlastní reference',weld:'Svar',haz:'HAZ / základní materiál',raw:'SNR',normalized:'SNR_N',...MATERIALS};
const displayValue = value => value === null || value === undefined || value === '' ? '—' : typeof value === 'boolean' ? value ? 'Ano' : 'Ne' : typeof value === 'number' ? value.toLocaleString('cs-CZ',{maximumSignificantDigits:7}) : String(value);
const displayDate = date => new Date(date).toLocaleString('cs-CZ',{timeZone:'Europe/Prague'});
const xml = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function fieldLabel(key,kind,inputs={},result=false){
 const [label,unit]=(result?resultFields:fields)[key]||[key,''];
 if(!result&&key==='thickness')return [(kind==='n'||kind==='ug')?'Tloušťka jedné stěny t':'Prozářená tloušťka w',unit];
 if(!result&&key==='distance'&&kind==='n'&&inputs.technique==='outside')return ['Vzdálenost zdroj–předmět f',unit];
 if(!result&&key==='exposure'&&kind==='reference')return ['Naměřená expozice',unit];
 return [label,unit];
}
function valueRows(object,kind,{result=false,inputs={}}={}){
 return Object.entries(object||{}).filter(([,v])=>v!==undefined&&v!==null&&v!==''&&['number','string','boolean'].includes(typeof v)).map(([key,value])=>{
  const [label,unit]=fieldLabel(key,kind,inputs,result);
  const translated=!result&&['technique','mode','material','roi','kind'].includes(key)?values$1[value]??value:value;
  return {key,label,unit,value:translated};
 });
}
function inputRows(record){
 const {kind,inputs}=record.context;
 let rows=valueRows(inputs,kind,{inputs});
 if(record.unverified)return rows;
 if(kind==='cr_estimate')rows=rows.filter(r=>['material','thickness','voltage','qualityClass','roi','flush','cp1','iqiConfirmed','fdd','current','setup','screens','scan','delay','srb','magnification'].includes(r.key));
 if(kind==='cr_check')rows=rows.filter(r=>['material','thickness','voltage','qualityClass','roi','flush','cp1','iqiConfirmed','kind','measured','srb','magnification'].includes(r.key));
 if(kind==='xray'&&inputs.mode==='chart')rows=rows.filter(r=>!['exposure','referenceName'].includes(r.key));
 if(kind==='ug'&&inputs.technique==='single')rows=rows.filter(r=>r.key!=='diameter');
 return rows;
}
function statusText(record){
 const s=record.result.status,k=record.context.kind;
 if(record.unverified)return 'Historický záznam – soulad s podporovaným modelem nelze ověřit';
 if(k==='ug')return s==='pass'?'Kritérium minimální vzdálenosti splněno':'Kritérium minimální vzdálenosti nesplněno';
 if(k==='cr_check'||k==='cr_record')return s==='pass'?'Kritérium SNR_N splněno':'Kritérium SNR_N nesplněno';
 return {limit:'Mimo rozsah odečtu',estimate:'Odhad / odečet',info:'Výpočet'}[s]||'Uložený výsledek';
}
function recordSources(record){
 if(record.unverified)return [];
 const kind=record.context.kind;
 if(kind==='n'||kind==='ug')return [['ISO 17636-1 – podklad modelu',SOURCES.iso1]];
 if(kind==='gamma')return [['Výrobní expoziční diagram',SOURCES.film],['Rozpad Ir-192',SOURCES.decay]];
 if(kind==='xray')return record.context.inputs.mode==='chart'?[['Výrobní expoziční diagram',SOURCES.film]]:[['Vlastní reference',record.context.inputs.referenceName||'']];
 return [['ISO 17636-2 – podklad modelu',SOURCES.iso2],['CR metodika',SOURCES.cr]];
}
function currentExport(context,metadata,{now=new Date().toISOString()}={}){
 const result=evaluate(context);
 return clone({...metadata,id:'current',kind:'calculation',createdAt:now,modelVersion:CALCULATION_VERSION,context,result,current:true});
}
// Historical results and reference snapshots are copied verbatim. Validation
// only supplies a warning; it never substitutes a freshly evaluated result.
function snapshotRecords(records,jobs=[]){
 const names=new Map(jobs.filter(j=>j.kind==='job').map(j=>[j.id,j.name]));
 return records.map(record=>{
  if(!record.current&&!entryShape(record))throw new Error('Záznam má nečitelný formát. Uchovejte úplnou zálohu JSON.');
  return clone({...record,jobName:record.jobName??names.get(record.jobId)??'',unverified:record.current?false:!validEntry(record)});
 });
}
function makeReport(records,options={}){
 if(!records.length)throw new Error('Vyberte alespoň jeden výpočet.');
 return {records:clone(records),exportedAt:new Date().toISOString(),title:records.length===1?'Výpočtový list RT':'Přehled výpočtů RT',technician:String(options.technician||'').trim().slice(0,120),note:String(options.note||'').trim().slice(0,2000),details:options.details!==false,nomogram:options.nomogram!==false,geometry:!!options.geometry,logo:options.logo||null};
}
function exportFilename(report,extension){
 const sameJob=report.records.every(r=>r.jobName===report.records[0].jobName),label=sameJob&&report.records[0].jobName||'vyber';
 const slug=label.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'vypocty';
 return `RT-${slug}-${report.exportedAt.slice(0,10)}.${extension}`;
}

function nomogramSvg(record){
 if(record.unverified||record.context.kind!=='n')return null;
 const r=record.result.values,lines=NOMOGRAMS[(r.outside?'outside':'inside')+record.context.inputs.qualityClass];
 if(!lines||![r.x,r.y,r.yMax].every(Number.isFinite))return null;
 const px=x=>48+x/.25*430,py=y=>215-y/r.yMax*195;
 let body='';
 for(let i=0;i<=5;i++){const x=i*.05;body+=`<path d="M${px(x)} 20V215" stroke="#dce2eb"/><text x="${px(x)}" y="233" text-anchor="middle">${displayValue(x)}</text>`;}
 for(let i=0;i<=8;i++){const y=r.yMax*i/8;body+=`<path d="M48 ${py(y)}H478" stroke="#dce2eb"/><text x="40" y="${py(y)+4}" text-anchor="end">${displayValue(y)}</text>`;}
 for(const line of lines){
  body+=`<polyline points="${line.dataPoints.map(p=>`${px(p.x)},${py(p.y)}`).join(' ')}" stroke="#7d8fa9" stroke-width="1" fill="none" clip-path="url(#plot)"/>`;
  const p=line.dataPoints.find(p=>p.x>=0&&p.x<=.25&&p.y>0&&p.y<r.yMax);
  if(p)body+=`<text x="${px(p.x)+4}" y="${py(p.y)-3}" font-size="9">${line.N}</text>`;
 }
 body+=`<circle cx="${px(r.x)}" cy="${py(r.y)}" r="5" fill="#2557cf" stroke="white" stroke-width="1.5"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="510" height="260" viewBox="0 0 510 260"><defs><clipPath id="plot"><rect x="48" y="20" width="430" height="195"/></clipPath></defs><g font-family="Roboto" font-size="11" fill="#35465e">${body}<text x="260" y="255" text-anchor="middle">t/De</text><text x="8" y="12">${r.outside?'De/f':'De/SFD'}</text></g></svg>`;
}
function geometrySvg(record){
 if(record.unverified||!['n','ug'].includes(record.context.kind))return null;
 const i=record.context.inputs,technique=i.technique==='double'?'dwsi':i.technique;
 let svg=geometryDiagram(technique,{module:record.context.kind,gap:i.gap??0}).split('</svg>')[0]+'</svg>';
 const styles={'object-wall':'fill="#dbe3ee" stroke="#738198" stroke-width="1.5"','object-void':'fill="white" stroke="#738198"','radiation-ray':'fill="none" stroke="#879abc" stroke-width="1.5"','source-point':'fill="#172437"','film-line':'stroke="#2557cf" stroke-width="5"','evaluated-wall':'stroke="#28765b" stroke-width="7"','dimension':'fill="none" stroke="#738198" stroke-width="1"','diagram-label':'fill="#4f6076" font-size="13"'};
 svg=svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="356" height="250" font-family="Roboto" ');
 for(const [name,style]of Object.entries(styles))svg=svg.replaceAll(`class="${name}"`,style);
 return svg.replace(/<text ([^>]+)>/g,(_,attributes)=>`<text ${attributes}${attributes.includes('fill=')?'':' fill="#4f6076"'} stroke="none"${attributes.includes('font-size=')?'':' font-size="13"'}>`);
}
const text=value=>displayValue(value).replace(/[\u2011\u2013\u2014]/g,'-');
const cell=(value,style={})=>({text:text(value),...style});
const layout={hLineWidth:()=>.5,vLineWidth:()=>0,hLineColor:()=>'#dce2eb',paddingLeft:()=>7,paddingRight:()=>7,paddingTop:()=>2.5,paddingBottom:()=>2.5};
const table=(body,widths,headerRows=0)=>({table:{headerRows,widths,body},layout,margin:[0,0,0,12]});
const section=label=>({text:label,fontSize:12,bold:true,color:'#203651',margin:[0,12,0,7]});
function rowTable(rows){return table(rows.map(r=>[cell(r.label,{color:'#526176'}),cell(r.value),{text:r.unit,color:'#526176'}]),[210,'*',55]);}
function pdfDefinition(report){
 const content=[];
 const heading={stack:[{text:report.title,fontSize:24,bold:true,color:'#173352'}, {text:`Vytvořeno ${displayDate(report.exportedAt)} (Europe/Prague) · Počet výpočtů: ${report.records.length}`,fontSize:9,color:'#526176',margin:[0,7,0,0]}]};
 content.push(report.logo?{columns:[heading,{image:report.logo,fit:[85,48],width:85}],columnGap:15}:heading);
 if(report.technician)content.push({text:'Technik: '+report.technician,margin:[0,10,0,0]});
 if(report.note)content.push({text:'Poznámka: '+report.note,margin:[0,8,0,0]});
 if(report.records.length>1||!report.details){
  content.push(section('Přehled'));
  const headers=['Identifikace','Výpočet / datum','Výsledek'].map(v=>cell(v,{bold:true,fillColor:'#eaf0fa'}));
  content.push(table([headers,...report.records.map(r=>[
   {stack:IDENTIFIERS.map(([key,label])=>({text:`${label}: ${text(r[key])}`,margin:[0,0,0,3]}))},
   {stack:[cell(KINDS[r.context.kind],{bold:true}),cell(displayDate(r.createdAt),{margin:[0,5,0,0]}),cell('Model '+r.modelVersion,{fontSize:8,margin:[0,5,0,0]})]},
   {stack:[cell(r.result.summary,{bold:true,fontSize:12}),cell(statusText(r),{margin:[0,5,0,0]}),...(r.current?[cell('Aktuální zadání – neuloženo v historii',{fontSize:8})]:[])]}
  ])],[175,145,'*'],1));
 }
 if(report.details)for(const [index,r]of report.records.entries()){
  if(report.records.length>1)content.push({text:`${index+1}. ${KINDS[r.context.kind]}`,pageBreak:'before',fontSize:20,bold:true,color:'#173352',margin:[0,0,0,12]});
  else content.push(section(KINDS[r.context.kind]));
  content.push(table(IDENTIFIERS.map(([key,label])=>[cell(label,{color:'#526176'}),cell(r[key],{bold:true})]),[125,'*']));
  content.push({text:`${r.current?'Zachyceno z aktuálního zadání':'Uloženo'}: ${displayDate(r.createdAt)} (Europe/Prague) · Model: ${r.modelVersion} · ID: ${r.id}`,fontSize:9,color:'#526176',margin:[0,0,0,10]});
  const sources=recordSources(r);
  if(sources.length)content.push({stack:sources.map(([label,url])=>({text:'Podklad: '+label+(url&&!url.startsWith('https://')?': '+url:''),...(url.startsWith('https://')?{link:url}:{}),fontSize:8,color:'#35557c'})),margin:[0,0,0,8],unbreakable:true});
  content.push({stack:[{text:text(r.result.summary),fontSize:25,bold:true,color:'#173352'},{text:statusText(r),margin:[0,5,0,0],color:r.unverified||r.result.status==='fail'?'#a92c37':'#526176'}],margin:[0,0,0,8]});
  if(r.current)content.push({text:'Aktuální zadání – neuloženo v historii.',fontSize:9,color:'#526176'});
  content.push(section('Vstupy'),rowTable(inputRows(r)));
  if(r.result.values.nearBoundary)content.push({text:'Bod leží u hranice oblastí; výsledek zahrnuje nejistotu odečtu.',fontSize:9,color:'#526176'});
  const mainKeys=['ug','f','b','minF','minInputDistance','minutes','exposure','currentActivity','actual','target'];
  const details=valueRows(r.result.values,r.context.kind,{result:true}).filter(row=>mainKeys.includes(row.key));
  if(details.length)content.push(section('Podrobnosti výsledku'),rowTable(details));
  if(report.nomogram){const svg=nomogramSvg(r);if(svg)content.push({stack:[section('Nomogram '+r.result.values.figure),{svg,width:480},{text:`t/De = ${displayValue(r.result.values.x)} · ${r.result.values.outside?'De/f':'De/SFD'} = ${displayValue(r.result.values.y)}. Čísla křivek označují počty expozic.`,fontSize:9,color:'#526176',margin:[0,5,0,0]}],unbreakable:true});}
  if(report.geometry){const svg=geometrySvg(r);if(svg)content.push({stack:[section('Schéma geometrie'),{svg,width:250},{text:'Schéma není v měřítku.',fontSize:9,color:'#526176'}],unbreakable:true});}
  if(r.context.reference){content.push({text:'Použitá reference CR',pageBreak:'before',fontSize:18,bold:true,color:'#173352',margin:[0,0,0,12]},{text:'Výpočet '+r.id+' · Zakázka '+text(r.jobName)+' · Svar '+text(r.weld),fontSize:9,margin:[0,0,0,12]},rowTable(valueRows(r.context.reference,'reference')));}
 }
 return {info:{title:report.title,author:report.technician||'RT Asistent',subject:'Radiografické výpočty',creator:'RT Asistent'},pageSize:'A4',pageMargins:[40,40,40,45],defaultStyle:{font:'Roboto',fontSize:10,color:'#172437'},content,footer:(page,pages)=>({columns:[{text:'RT Asistent · Výpočtový podklad',width:'*'},{text:`${page} / ${pages}`,alignment:'right',width:70}],margin:[40,15,40,0],fontSize:8,color:'#526176'})};
}
async function createPdf(report){
 const [{default:pdfMake},{default:fonts}]=await Promise.all([__vitePreload(() => import('./pdfmake-Q44JKpeV.js').then(n => n.p),true              ?__vite__mapDeps([0,1]):void 0),__vitePreload(() => import('./vfs_fonts-DYgd5Mxl.js').then(n => n.v),true              ?__vite__mapDeps([2,1]):void 0)]);
 pdfMake.addVirtualFileSystem(fonts);
 pdfMake.setUrlAccessPolicy(()=>false);
 const buffer=await pdfMake.createPdf(pdfDefinition(report)).getBuffer();
 return new Blob([buffer],{type:'application/pdf'});
}

const exportBody=`
 <p>Soubor se vytvoří v tomto zařízení. Výsledky z historie zachovají podobu při uložení.</p>
 <fieldset id="export-controls" class="export-controls">
 <div class="work-grid"><div><label for="export-scope">Co exportovat</label><select id="export-scope"><option value="current">Aktuální výpočet</option><option value="selected">Vybrané záznamy</option><option value="job">Celá zakázka</option></select></div><div><label for="export-format">Formát souboru</label><select id="export-format"><option value="pdf">PDF dokument</option><option value="xlsx">Excel (.xlsx)</option></select></div></div>
 <div id="export-job-wrap" class="export-field" hidden><label for="export-job">Zakázka k exportu</label><select id="export-job"></select></div>
 <div id="export-pdf-options" class="export-field"><label for="export-detail">Obsah PDF</label><select id="export-detail"><option value="details">Přehled a podrobné výpočtové listy</option><option value="summary">Pouze stručný přehled</option></select><div id="export-figures"><label class="work-check"><input id="export-nomogram" type="checkbox" checked> Přidat nomogram, pokud je dostupný</label><label class="work-check"><input id="export-geometry" type="checkbox"> Přidat schéma geometrie</label></div></div>
 <details class="export-field"><summary>Technik, poznámka a logo</summary><div class="export-field"><label for="export-technician">Jméno technika (nepovinné)</label><input id="export-technician" maxlength="120" autocomplete="name"></div><div class="export-field"><label for="export-note">Poznámka do dokumentu (nepovinná)</label><textarea id="export-note" maxlength="2000" rows="3"></textarea></div><div id="export-logo-wrap" class="export-field"><label for="export-logo">Logo do PDF (PNG nebo JPG, nejvýše 2 MB)</label><input id="export-logo" type="file" accept="image/png,image/jpeg"><button id="export-logo-remove" type="button" class="text-button" hidden>Odebrat logo</button><p id="export-logo-status" role="status"></p></div></details>
 </fieldset>
 <div class="export-preview-heading"><h4>Náhled obsahu</h4><p id="export-count" role="status"></p></div><div id="export-preview"></div>
 <nav class="history-pages" aria-label="Stránky náhledu exportu"><button id="export-prev" type="button" class="secondary-button">Předchozí</button><span id="export-page"></span><button id="export-next" type="button" class="secondary-button">Další</button></nav>
 <div class="export-submit"><p id="export-status" role="status" tabindex="-1"></p><button id="export-download" type="button" class="primary-button">Stáhnout PDF</button><a id="export-ready" class="secondary-button" hidden>Stáhnout soubor znovu</a></div>`;

function initExports({document:d,app,readHistory,readMetadata,open,downloadFile}){
 const w=d.defaultView,by=id=>d.getElementById(id),abort=new w.AbortController(),on=(id,event,fn)=>by(id).addEventListener(event,fn,{signal:abort.signal});
 let current=[],history=[],selected=[],jobs=[],currentError='',page=0,logo=null,url=null,busy=false,logoLoading=false,logoRevision=0;
 const status=(message,error=false)=>{by('export-status').textContent=message;by('export-status').dataset.error=String(error);};
 const invalidate=()=>{if(url){w.URL.revokeObjectURL(url);url=null;}by('export-ready').hidden=true;by('export-ready').removeAttribute('href');status('');};
 const records=()=>by('export-scope').value==='current'?current:by('export-scope').value==='selected'?selected:history.filter(r=>r.jobId===by('export-job').value);
 const options=()=>({details:by('export-detail').value==='details',nomogram:by('export-nomogram').checked,geometry:by('export-geometry').checked,technician:by('export-technician').value,note:by('export-note').value,logo});
 function render(){
  const pdf=by('export-format').value==='pdf',detail=by('export-detail').value==='details',rows=records(),pages=Math.max(1,Math.ceil(rows.length/10));page=Math.min(page,pages-1);
  by('export-job-wrap').hidden=by('export-scope').value!=='job';by('export-pdf-options').hidden=!pdf;by('export-logo-wrap').hidden=!pdf;by('export-figures').hidden=!detail;
  by('export-count').textContent=`Počet výpočtů: ${rows.length}`;by('export-download').disabled=!rows.length||busy||logoLoading;by('export-download').textContent=busy?'Vytvářím soubor…':pdf?'Stáhnout PDF':'Stáhnout Excel';
  by('export-prev').disabled=page===0;by('export-next').disabled=page===pages-1;by('export-page').textContent=`${page+1} / ${pages}`;
  by('export-preview').innerHTML=rows.length?rows.slice(page*10,page*10+10).map(r=>{
   const graph=pdf&&detail&&by('export-nomogram').checked?nomogramSvg(r):null,geometry=pdf&&detail&&by('export-geometry').checked?geometrySvg(r):null;
   const fields=[...inputRows(r),...valueRows(r.result.values,r.context.kind,{result:true})];
   return `<article class="export-preview-card"><h4>${xml(KINDS[r.context.kind])}</h4><dl class="export-identifiers">${IDENTIFIERS.map(([key,label])=>`<dt>${label}</dt><dd>${xml(displayValue(r[key]))}</dd>`).join('')}</dl><strong class="export-result">${xml(r.result.summary)}</strong><p>${xml(statusText(r))}</p><p class="export-meta">${r.current?'Aktuální zadání, neuloženo':'Uložená historie'} · ${xml(displayDate(r.createdAt))} · model ${xml(r.modelVersion)}</p>${!pdf||detail?`<details><summary>Vstupy a podrobnosti výsledku</summary><dl class="export-identifiers">${fields.map(f=>`<dt>${xml(f.label)}${f.unit?' ('+xml(f.unit)+')':''}</dt><dd>${xml(displayValue(f.value))}</dd>`).join('')}</dl></details>`:''}${graph?`<div class="export-chart" role="img" aria-label="Nomogram exportovaného výpočtu">${graph}</div>`:''}${geometry?`<div class="export-chart" role="img" aria-label="Schéma exportovaného výpočtu">${geometry}</div><p>Schéma není v měřítku.</p>`:''}</article>`;
  }).join(''):`<p class="export-empty">${xml(by('export-scope').value==='current'?currentError||'Doplňte platný výpočet.':by('export-scope').value==='job'?'Tato zakázka zatím nemá uložené výpočty.':'Vyberte záznamy v historii.')}</p>`;
 }
 function show({scope='current',selection=[],button}={}){
  invalidate();page=0;const all=readHistory();jobs=all.filter(e=>e.kind==='job');history=snapshotRecords(all.filter(e=>e.kind==='calculation'),jobs);selected=snapshotRecords(selection,jobs);
  try{const meta=readMetadata();current=[currentExport(app.captureCalculation(),meta)];currentError='';}catch(error){current=[];currentError=error.message;}
  by('export-job').replaceChildren(...jobs.map(j=>{const option=d.createElement('option');option.value=j.id;option.textContent=j.name;return option;}));
  const meta=readMetadata();if(jobs.some(j=>j.id===meta.jobId))by('export-job').value=meta.jobId;
  by('export-scope').querySelector('[value=selected]').disabled=!selected.length;by('export-scope').querySelector('[value=job]').disabled=!jobs.length;by('export-scope').value=scope;
  open(button);render();
 }
 for(const id of ['export-scope','export-format','export-job','export-detail','export-nomogram','export-geometry','export-technician','export-note'])on(id,'input',()=>{invalidate();page=0;render();});
 on('export-prev','click',()=>{page--;render();});on('export-next','click',()=>{page++;render();});
 on('export-logo-remove','click',()=>{logoRevision++;logo=null;by('export-logo').value='';by('export-logo-remove').hidden=true;by('export-logo-status').textContent='';invalidate();});
 on('export-logo','change',async()=>{
  const revision=++logoRevision,file=by('export-logo').files?.[0];logo=null;invalidate();by('export-logo-remove').hidden=true;by('export-logo-status').textContent='';logoLoading=false;if(!file){render();return;}logoLoading=true;render();
  try{
   if(!['image/png','image/jpeg'].includes(file.type)||file.size>2*1024*1024)throw new Error('Vyberte PNG nebo JPG do 2 MB.');
   const data=await new Promise((resolve,reject)=>{const reader=new w.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Obrázek nelze přečíst.'));reader.readAsDataURL(file);});
   const img=new w.Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('Soubor není platný obrázek.'));img.src=data;});
   if(img.naturalWidth*img.naturalHeight>16000000)throw new Error('Logo je příliš velké. Použijte obrázek do 16 megapixelů.');
   const scale=Math.min(1,600/Math.max(img.naturalWidth,img.naturalHeight)),canvas=d.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
   if(revision!==logoRevision)return;logo=canvas.toDataURL('image/png');by('export-logo-remove').hidden=false;by('export-logo-status').textContent='Logo připraveno: '+file.name;
  }catch(error){if(revision!==logoRevision)return;by('export-logo').value='';by('export-logo-status').textContent=error.message;}
  finally{if(revision===logoRevision){logoLoading=false;render();}}
 });
 on('export-download','click',async()=>{
  if(busy||logoLoading)return;let report;
  try{report=makeReport(records(),options());}catch(error){status(error.message,true);return;}
  const format=by('export-format').value;invalidate();busy=true;by('export-status').focus();by('export-controls').disabled=true;by('export-panel').setAttribute('aria-busy','true');render();status('Vytvářím soubor v zařízení…');
  try{
   const {createXlsx}=format==='xlsx'?await __vitePreload(() => import('./export-xlsx-CBHfML-S.js'),true              ?[]:void 0):{};
   const blob=await (format==='pdf'?createPdf(report):createXlsx(report)),filename=exportFilename(report,format);
   if(downloadFile)await downloadFile({blob,filename,report});
   else {url=w.URL.createObjectURL(blob);const link=by('export-ready');link.href=url;link.download=filename;link.hidden=false;link.click();}
   status(`Soubor ${filename} je připravený ke stažení. Počet výpočtů: ${report.records.length}.`);
  }catch(error){status('Export se nepodařil: '+error.message,true);}
  finally{busy=false;by('export-controls').disabled=false;by('export-panel').removeAttribute('aria-busy');render();}
 });
 return {show,destroy(){abort.abort();logoRevision++;if(url)w.URL.revokeObjectURL(url);}};
}

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const field=(id,label,value='',hint='')=>`<div><label for="${id}">${label}</label><input id="${id}" inputmode="decimal" value="${esc(value)}">${hint?`<small>${hint}</small>`:''}</div>`;
const select=(id,label,options)=>`<div><label for="${id}">${label}</label><select id="${id}">${options.map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select></div>`;
const panel=(id,title,body)=>`<section id="${id}" class="work-panel" hidden role="dialog" aria-modal="true" aria-labelledby="${id}-title"><div class="work-panel-heading"><h3 id="${id}-title" tabindex="-1">${title}</h3><button type="button" class="secondary-button" data-close-panel>Zavřít</button></div><p class="panel-message" role="status"></p>${body}</section>`;
const jobFields={part:'job-part',weld:'job-weld',drawingNumber:'job-drawing',batch:'job-batch'};
const geometryIds={material:'shared-material',technique:'shared-technique',qualityClass:'shared-class',thickness:'shared-thickness',diameter:'shared-diameter',sfd:'shared-sfd',gap:'shared-gap',pathMode:'shared-path',penetrated:'shared-penetrated'};
const labels={technique:'Technika',qualityClass:'Třída',thickness:'Tloušťka (mm)',diameter:'Průměr De (mm)',distance:'Vzdálenost (mm)',sourceDistance:'Zdroj–první povrch (mm)',gap:'Mezera (mm)',focus:'Ohnisko (mm)',planar:'Planární vady',mode:'Zdroj reference',material:'Materiál',film:'Film',voltage:'Napětí (kV)',current:'Proud (mA)',exposure:'Referenční E (mA·min)',referenceDistance:'Referenční SFD (mm)',referenceName:'Vlastní reference',activity:'Referenční aktivita (GBq)',referenceTime:'Datum aktivity',exposureTime:'Datum expozice',fdd:'FDD (mm)',roi:'Místo měření',flush:'Zarovnaný svar',cp1:'CP I',iqiConfirmed:'Potvrzené IQI',kind:'Druh SNR',measured:'Naměřené SNR',srb:'SR_b (mm)',magnification:'Zvětšení',seconds:'Skutečný čas (s)',name:'Název měření',setup:'Sestava',screens:'Fólie / filtrace',scan:'Skener',delay:'Prodleva (min)',measuredAt:'Datum měření'};
const values={outside:'Jedna stěna · zdroj vně',inside:'Jedna stěna · zdroj uvnitř',single:'Jedna stěna',double:'DWSI',dwsi:'DWSI',dwdi:'DWDI',chart:'Výrobní diagram',manual:'Vlastní reference',weld:'Svar',haz:'HAZ / základní materiál',raw:'SNR',normalized:'SNR_N',...MATERIALS};
function initWorkflow({document:d=globalThis.document,app,store:provided,downloadExport}={}){
 const w=d.defaultView,by=id=>d.getElementById(id),abort=new w.AbortController(),on=(el,event,fn)=>el.addEventListener(event,fn,{signal:abort.signal});
 const store=provided||createWorkspaceStore({indexedDB:w.indexedDB,onChange:refresh});
 let entries=[],base=null,variants=[],activePanel=null,returnFocus=null,readyForStorage=false,stopped=false,historyPage=0,historyIndex=[],jobNames=new Map();
 const PAGE_SIZE=50,historySelection=new Set();
 const message=(text,error=false)=>{const target=activePanel?by(activePanel).querySelector('.panel-message'):by('workflow-message');target.textContent=text;target.dataset.error=String(error);};
 by('workflow-panels').innerHTML=
 panel('data-panel','Offline a zálohy',dataToolsBody)+
 panel('export-panel','Export výpočtů',exportBody)+
 panel('job-panel','Nová zakázka','<label for="job-name">Název nebo číslo zakázky</label><input id="job-name" maxlength="120" placeholder="Např. RT-2026-042"><div class="work-panel-actions"><button id="job-create" type="button" class="primary-button">Vytvořit zakázku</button></div>')+
 panel('history-panel','Historie výpočtů',`<div class="work-grid">${select('history-scope','Rozsah historie',[['current','Aktuální zakázka'],['all','Všechny zakázky']])}<div><label for="history-search">Najít záznam</label><input id="history-search" type="search" placeholder="Zakázka, díl, svar, výkres, běžné číslo…"></div></div><p>Každý záznam uchovává původní výsledek a verzi modelu. Otevření přenese vstupy do aktuálního kalkulátoru.</p><div class="history-export-actions"><button id="history-select-all" type="button" class="secondary-button">Vybrat nalezené</button><button id="history-clear-selection" type="button" class="text-button">Zrušit výběr</button><span id="history-selected-count" role="status"></span><button id="history-export" type="button" class="primary-button">Exportovat</button></div><div id="history-list"></div><nav class="history-pages" aria-label="Stránky historie"><button id="history-prev" type="button" class="secondary-button">Předchozí</button><p id="history-page-status" role="status"></p><button id="history-next" type="button" class="secondary-button">Další</button></nav>`)+
 panel('geometry-panel','Společná geometrie',`<p>Vyplňte geometrii a vyberte, kam ji přenést. Následné úpravy jednotlivých kalkulátorů jsou samostatné.</p><div class="work-grid">${select('shared-material','Materiál',Object.entries(MATERIALS))}${select('shared-technique','Technika',[['outside','Trubka · jedna stěna, zdroj vně'],['inside','Trubka · jedna stěna, zdroj uvnitř'],['dwsi','Dvě stěny · DWSI'],['dwdi','Dvě stěny · DWDI'],['flat','Plochý díl · jedna stěna']])}${select('shared-class','Třída',[['B','B'],['A','A']])}${field('shared-thickness','Jedna stěna t (mm)',10)}${field('shared-diameter','Vnější průměr De (mm)',219)}${field('shared-sfd','Zdroj–film SFD (mm)',1000)}${field('shared-gap','Mezera předmět–film (mm)',0)}${select('shared-path','Prozářená tloušťka w',[['auto','Odvodit t / 2t'],['manual','Zadat skutečnou dráhu']])}${field('shared-penetrated','Skutečné w (mm)',20,'Bez vzduchu; včetně převýšení a šikmé dráhy.')}</div><p id="geometry-summary" role="status"></p><p id="geometry-skipped"></p><div class="work-panel-actions">${[['n','Počet expozic'],['ug','Neostrost'],['film','Čas filmu'],['cr','CR']].map(([id,l])=>`<label class="work-check"><input type="checkbox" id="shared-target-${id}" checked>${l}</label>`).join('')}</div><div class="work-panel-actions"><button id="geometry-apply" type="button" class="primary-button">Přenést vybrané údaje</button></div>`)+
 panel('compare-panel','Porovnání variant','<p id="compare-description"></p><button id="compare-refresh" class="secondary-button" type="button">Načíst aktuální zadání</button><div id="comparison-grid" class="comparison-grid"></div>');
 let pref={};try{pref=JSON.parse(w.localStorage.getItem('rt_job_context_v1'))||{};}catch{}
 for(const [key,id]of Object.entries(jobFields))by(id).value=typeof pref[key]==='string'?pref[key]:'';
 const jobValues=()=>Object.fromEntries(Object.entries(jobFields).map(([key,id])=>[key,by(id).value]));
 for(const [key,id]of Object.entries(geometryIds))if(typeof pref.geometry?.[key]==='string')by(id).value=pref.geometry[key];
 const geometryValues=()=>Object.fromEntries(Object.entries(geometryIds).map(([key,id])=>[key,by(id).value]));
 const preference=()=>{try{w.localStorage.setItem('rt_job_context_v1',JSON.stringify({job:by('job-select').value,...jobValues(),geometry:geometryValues()}));}catch{}};
 function jobContext(){const job=by('job-select').selectedOptions[0];by('result-job-context').textContent=by('job-select').value?[job?.textContent,by('job-part').value.trim()||'Doplňte díl',by('job-weld').value.trim()||'Doplňte svar',by('job-drawing').value.trim()?'Výkres '+by('job-drawing').value.trim():'',by('job-batch').value.trim()?'Běžné číslo '+by('job-batch').value.trim():''].filter(Boolean).join(' · '):'Vyberte zakázku, díl a svar.';}
 function open(id,button){returnFocus=button||d.activeElement;for(const p of d.querySelectorAll('.work-panel')){p.hidden=p.id!==id;p.querySelector('.panel-message').textContent='';}activePanel=id;by('workflow-panels').hidden=false;by('app-surface').inert=true;d.body.classList.add('panel-open');by('connection-popover').open=false;returnFocus?.setAttribute?.('aria-expanded','true');by(id+'-title').focus();}
 function close(){if(activePanel)by(activePanel).hidden=true;by('workflow-panels').hidden=true;by('app-surface').inert=false;d.body.classList.remove('panel-open');activePanel=null;returnFocus?.setAttribute?.('aria-expanded','false');returnFocus?.focus();}
 on(by('workflow-panels'),'click',e=>{if(e.target===by('workflow-panels')||e.target.closest('[data-close-panel]'))close();});on(d,'keydown',e=>{if(!activePanel)return;if(e.key==='Escape'){e.preventDefault();close();}else if(activePanel)trapFocus(e,by(activePanel));});
 function refresh(){if(stopped)return;entries=store.entries();const selected=by('job-select').value||pref.job||'';const jobs=entries.filter(e=>e.kind==='job').sort((a,b)=>b.createdAt.localeCompare(a.createdAt));by('job-select').innerHTML='<option value="">Bez zakázky</option>'+jobs.map(j=>`<option value="${esc(j.id)}">${esc(j.name)}</option>`).join('');if(jobs.some(j=>j.id===selected))by('job-select').value=selected;jobNames=new Map(jobs.map(j=>[j.id,j.name]));historyIndex=entries.filter(e=>e.kind==='calculation').map(e=>({entry:e,search:[jobNames.get(e.jobId),e.part,e.weld,e.drawingNumber,e.batch,KINDS[e.context?.kind]].join(' ').toLocaleLowerCase('cs-CZ')})).sort((a,b)=>b.entry.createdAt.localeCompare(a.entry.createdAt));jobContext();if(activePanel==='history-panel')renderHistory();}
 function localStatus(error){by('storage-status').dataset.state=error?'error':'local';by('storage-status').textContent=error||'Zakázky a historie se ukládají pouze v tomto zařízení';}
 async function persist(entry){if(!readyForStorage)throw new Error('Úložiště není připravené. Povolte data webu a otevřete aplikaci znovu.');try{await store.add(entry);refresh();localStatus();}catch(error){localStatus(error.message);throw error;}}
 on(w,'focus',()=>{if(readyForStorage)store.reload().then(refresh).catch(error=>localStatus(error.message));});
 on(by('job-new'),'click',()=>{open('job-panel',by('job-new'));by('job-name').focus();});
 async function createJob(){const button=by('job-create');if(button.disabled)return;const hadFocus=d.activeElement===button;if(hadFocus)by('job-panel-title').focus();button.disabled=true;try{const name=by('job-name').value.trim();if(!name||name.length>120){by('job-name').focus();throw new Error('Zadejte název zakázky do 120 znaků.');}const job={id:w.crypto.randomUUID(),kind:'job',name,createdAt:new Date().toISOString()};await persist(job);by('job-select').value=job.id;pref.job=job.id;preference();jobContext();by('job-name').value='';close();message('Zakázka vytvořena. Doplňte díl a číslo svaru.');}catch(error){message(error.message,true);}finally{button.disabled=false;if(hadFocus&&activePanel==='job-panel'&&d.activeElement===by('job-panel-title'))button.focus();}}
 on(by('job-create'),'click',createJob);on(by('job-name'),'keydown',e=>{if(e.key==='Enter'&&!by('job-create').disabled){e.preventDefault();createJob();}});
 for(const id of ['job-select',...Object.values(jobFields)])on(by(id),'input',()=>{pref.job=by('job-select').value;preference();jobContext();renderHistory();});
 async function saveContext(context){const entry=historyEntry({id:w.crypto.randomUUID(),jobId:by('job-select').value,...jobValues(),context});await persist(entry);message('Výpočet uložen do místní historie.');}
 on(by('history-save'),'click',async()=>{by('history-save').disabled=true;try{await saveContext(app.captureCalculation());}catch(error){message(error.message,true);if(!by('job-select').value)by('job-select').focus();else if(!by('job-part').value.trim())by('job-part').focus();else if(!by('job-weld').value.trim())by('job-weld').focus();}finally{by('history-save').disabled=false;}});
 function filteredHistory(){const query=by('history-search').value.trim().toLocaleLowerCase('cs-CZ');return historyIndex.filter(({entry:e,search})=>(by('history-scope').value==='all'||e.jobId===by('job-select').value)&&search.includes(query)).map(r=>r.entry);}
 function selectionStatus(){by('history-selected-count').textContent='Vybráno: '+historySelection.size;by('history-clear-selection').disabled=!historySelection.size;by('history-select-all').disabled=!filteredHistory().length;by('history-export').disabled=!historySelection.size&&!filteredHistory().length;}
 function renderHistory(){if(activePanel!=='history-panel')return;const rows=filteredHistory();selectionStatus();
  const pages=Math.max(1,Math.ceil(rows.length/PAGE_SIZE));historyPage=Math.min(historyPage,pages-1);const visible=rows.slice(historyPage*PAGE_SIZE,(historyPage+1)*PAGE_SIZE);
  by('history-page-status').textContent=rows.length?`${historyPage*PAGE_SIZE+1}–${Math.min((historyPage+1)*PAGE_SIZE,rows.length)} z ${rows.length}`:'Žádné záznamy';by('history-prev').disabled=historyPage===0;by('history-next').disabled=historyPage===pages-1;
  by('history-list').innerHTML=visible.length?visible.map(e=>`<article class="history-card"><label class="work-check history-select"><input type="checkbox" data-export-select="${esc(e.id)}" ${historySelection.has(e.id)?'checked':''}> Vybrat pro export</label><h4>${esc(KINDS[e.context.kind])} · ${esc(e.weld)}</h4><div>${esc(jobNames.get(e.jobId)||'Zakázka')} / ${esc(e.part)}</div>${e.drawingNumber||e.batch?`<div class="history-identifiers">${[e.drawingNumber?'Výkres: '+e.drawingNumber:'',e.batch?'Běžné číslo: '+e.batch:''].filter(Boolean).map(esc).join(' · ')}</div>`:''}<strong class="history-result">${esc(e.result.summary)}</strong><p>${esc(e.result.status==='pass'?'Posuzované kritérium splněno':e.result.status==='fail'?'Posuzované kritérium nesplněno':e.result.status==='limit'?'Mimo rozsah odečtu':'Výpočet / odhad v rozsahu daného modelu')}</p><div class="history-meta">${esc(new Date(e.createdAt).toLocaleString('cs-CZ'))} · model ${esc(e.modelVersion)} · uloženo v zařízení</div><details><summary>Původní vstupy a reference</summary><dl>${Object.entries(e.context.inputs).filter(([,v])=>v!==null&&v!=='').map(([key,value])=>`<dt>${esc(labels[key]||key)}</dt><dd>${esc(typeof value==='boolean'?value?'Ano':'Ne':typeof value==='number'?fmt(value):values[value]||value)}</dd>`).join('')}</dl>${e.context.reference?`<p>Reference: ${esc(e.context.reference.name)} · ${esc(e.context.reference.measuredAt)} · ${fmt(e.context.reference.exposure)} mA·min · SNR_N ${fmt(e.context.reference.achievedSnr)}</p>`:''}</details><button type="button" class="text-button" data-export-record="${esc(e.id)}">Exportovat záznam</button><button type="button" class="secondary-button" data-restore="${esc(e.id)}" ${validEntry(e)?'':'disabled'}>Otevřít vstupy v kalkulátoru</button>${validEntry(e)?'':'<p>Tento historický záznam nelze ověřit v podporované verzi. Původní údaje lze číst a exportovat.</p>'}</article>`).join(''):'<p>V tomto výběru zatím nejsou uložené výpočty. Vyberte zakázku, doplňte díl a svar a použijte „Uložit k tomuto svaru“.</p>';
 }
 on(by('history-open'),'click',()=>{historyPage=0;open('history-panel',by('history-open'));renderHistory();});for(const id of ['history-search','history-scope'])on(by(id),'input',()=>{historyPage=0;historySelection.clear();renderHistory();});
 for(const [id,delta]of [['history-prev',-1],['history-next',1]])on(by(id),'click',()=>{historyPage+=delta;renderHistory();by('history-panel-title').focus();by('history-panel').scrollTop=0;});
 on(by('history-list'),'click',e=>{const button=e.target.closest('[data-restore]');if(!button)return;const record=entries.find(r=>r.id===button.dataset.restore);if(!record)return;try{if(!validEntry(record))throw new Error('Historický záznam je rozporný nebo používá nepodporovaný model. Původní údaje zůstávají dostupné pro export.');app.restoreCalculation(clone(record.context));by('job-select').value=record.jobId;for(const [key,id]of Object.entries(jobFields))by(id).value=record[key]??'';pref.job=record.jobId;preference();jobContext();close();message(`Vstupy otevřeny v aktuálním kalkulátoru. Původní výsledek „${record.result.summary}“ zůstává v historii.${record.context.kind==='xray'&&record.context.inputs.mode==='manual'?' Platnost vlastní reference před novým použitím znovu potvrďte.':''}`);}catch(error){message(error.message,true);}});

 function renderGeometry(){const g=geometryValues();by('shared-penetrated').disabled=g.pathMode!=='manual';by('shared-diameter').disabled=g.technique==='flat';try{const r=sharedGeometry(g);by('geometry-summary').textContent=`t = ${fmt(r.t)} mm · w = ${fmt(r.w)} mm · SFD = ${fmt(r.sfd)} mm · zdroj–první povrch = ${fmt(r.f)} mm. ${r.assumption}`;by('geometry-summary').dataset.error='false';by('geometry-skipped').textContent=r.skipped.join(' ');by('geometry-apply').disabled=false;by('shared-target-n').disabled=!r.maps.n;}catch(error){by('geometry-summary').textContent=error.message;by('geometry-summary').dataset.error='true';by('geometry-skipped').textContent='';by('geometry-apply').disabled=true;}}
 on(by('geometry-open'),'click',()=>{renderGeometry();open('geometry-panel',by('geometry-open'));});for(const id of Object.values(geometryIds))on(by(id),'input',()=>{renderGeometry();preference();});
 on(by('geometry-apply'),'click',()=>{try{const r=sharedGeometry(geometryValues()),selected=Object.entries(r.maps).filter(([key])=>by('shared-target-'+key).checked);if(!selected.length)throw new Error('Vyberte alespoň jeden kalkulátor.');app.applyForm(Object.assign({},...selected.map(([,map])=>map)));close();message(`Geometrie přenesena: ${selected.map(([key])=>({n:'počet expozic',ug:'neostrost',film:'čas filmu',cr:'CR'}[key])).join(', ')}. t = ${fmt(r.t)} mm, w = ${fmt(r.w)} mm. Zkontrolujte rozsah každého kalkulátoru.`);preference();}catch(error){message(error.message,true);}});
 function loadComparison(){try{base=app.captureCalculation();const fields=variantFields(base);if(!fields.length)throw new Error('Pro porovnání časů CR přepněte na odhad z referenčního měření.');const distance=fields[0].key;variants=[{}, {[distance]:base.inputs[distance]*1.2},{[distance]:base.inputs[distance]*.8}];by('compare-description').textContent=`${KINDS[base.kind]} · zadání převzaté při otevření porovnání. Ostatní podmínky zůstávají stejné.${base.kind==='xray'&&base.inputs.mode==='manual'?' Film nelze měnit bez nové reference.':''} ${base.kind==='ug'?'Hodnotí se geometrická neostrost a minimální vzdálenost.':base.kind==='n'?'Porovnává se počet expozic podle stejného nomogramu.':'Porovnává se expoziční čas; kvalitu nového snímku ověřte měřením.'}`;
  by('comparison-grid').innerHTML=variants.map((changes,i)=>`<article class="comparison-card" id="variant-${i}"><h4>${i===0?'Výchozí zadání':'Varianta '+String.fromCharCode(65+i)}</h4>${fields.map(f=>`<div class="compare-field"><label for="variant-${i}-${f.key}">${f.label}</label>${f.options?`<select id="variant-${i}-${f.key}" data-variant="${i}" data-key="${f.key}" ${i===0?'disabled':''}>${f.options.map(v=>`<option ${v===(changes[f.key]??base.inputs[f.key])?'selected':''}>${v}</option>`).join('')}</select>`:`<input id="variant-${i}-${f.key}" data-variant="${i}" data-key="${f.key}" inputmode="decimal" value="${esc(changes[f.key]??base.inputs[f.key])}" ${i===0?'readonly':''}>`}</div>`).join('')}<div class="comparison-result" id="variant-result-${i}" aria-live="polite"></div><p id="variant-detail-${i}"></p><button type="button" class="secondary-button" data-use-variant="${i}" ${i===0?'hidden':''}>Použít variantu</button></article>`).join('');variants.forEach((_,i)=>renderVariant(i));
 }catch(error){base=null;by('comparison-grid').innerHTML='';by('compare-description').textContent=error.message;message(error.message,true);}}
 function renderVariant(i){const card=by('variant-'+i),use=card.querySelector('[data-use-variant]');try{const r=compareVariant(base,variants[i]);card.dataset.valid='true';card.dataset.state=r.result.status;by('variant-result-'+i).textContent=r.result.summary;const v=r.result.values;by('variant-detail-'+i).textContent=(i===0?'Výchozí hodnota.':r.percent===null?'Rozdíl nelze určit.':`Rozdíl ${r.percent>=0?'+':''}${fmt(r.percent)} % vůči výchozímu zadání.`)+(base.kind==='ug'?` ${v.passes?'Minimální vzdálenost splněna.':'Minimální vzdálenost NESPLNĚNA.'}`:r.result.status==='limit'?' Mimo rozsah počtu v nomogramu.':'');use.disabled=false;}catch(error){card.dataset.valid='false';card.dataset.state='error';by('variant-result-'+i).textContent='Nelze vypočítat';by('variant-detail-'+i).textContent=error.message;use.disabled=true;}}
 on(by('compare-open'),'click',()=>{loadComparison();open('compare-panel',by('compare-open'));});on(by('compare-refresh'),'click',loadComparison);
 on(by('comparison-grid'),'input',e=>{const el=e.target;if(!el.hasAttribute('data-variant')||Number(el.dataset.variant)===0)return;variants[Number(el.dataset.variant)][el.dataset.key]=el.value;renderVariant(Number(el.dataset.variant));});
 on(by('comparison-grid'),'click',e=>{const button=e.target.closest('[data-use-variant]');if(!button)return;try{const r=compareVariant(base,variants[Number(button.dataset.useVariant)]);app.restoreCalculation(r.context,{preserveCalibration:true});close();message('Varianta přenesena do kalkulátoru. Výsledek lze nyní uložit do zakázky.');}catch(error){message(error.message,true);}});
 const exports=initExports({document:d,app,downloadFile:downloadExport,readHistory:()=>entries,readMetadata:()=>({jobId:by('job-select').value,jobName:jobNames.get(by('job-select').value)||'',...jobValues()}),open:button=>open('export-panel',button||by('export-current'))});
 const showExport=options=>{try{exports.show(options);}catch(error){message(error.message,true);}};
 on(by('export-current'),'click',()=>showExport({scope:'current',button:by('export-current')}));
 on(by('history-export'),'click',()=>showExport({scope:'selected',selection:historySelection.size?entries.filter(e=>historySelection.has(e.id)):filteredHistory(),button:by('history-open')}));
 on(by('history-select-all'),'click',()=>{historySelection.clear();for(const e of filteredHistory())historySelection.add(e.id);renderHistory();});
 on(by('history-clear-selection'),'click',()=>{historySelection.clear();renderHistory();});
 on(by('history-list'),'change',e=>{const input=e.target.closest('[data-export-select]');if(!input)return;if(input.checked)historySelection.add(input.dataset.exportSelect);else historySelection.delete(input.dataset.exportSelect);selectionStatus();});
 on(by('history-list'),'click',e=>{const button=e.target.closest('[data-export-record]');if(!button)return;const record=entries.find(e=>e.id===button.dataset.exportRecord);if(record)showExport({scope:'selected',selection:[record],button:by('history-open')});});
 const dataTools=initDataTools({document:d,app,store,open:()=>open('data-panel',by('data-open')),onArchiveChanged:async()=>{historySelection.clear();pref.job='';by('job-select').value='';refresh();preference();localStatus();},onRestored:async()=>{refresh();localStatus();}});
 jobContext();renderGeometry();
 const ready=store.init().then(async()=>{if(stopped)return;readyForStorage=true;refresh();await dataTools.ready();if(!stopped)return localStatus();}).catch(error=>{if(stopped)return;by('storage-status').dataset.state='error';by('storage-status').textContent=error.message;message('Zakázky nyní nelze bezpečně uložit. Výpočty můžete dál používat.',true);});
 return {ready,store,destroy(){stopped=true;abort.abort();dataTools.destroy();exports.destroy();store.close();}};
}

function initOffline({window:w=globalThis.window}={}){
 const d=w.document,by=id=>d.getElementById(id),sw=w.navigator.serviceWorker,build=d.querySelector('meta[name="rt-build"]')?.content,base=d.querySelector('meta[name="rt-base"]')?.content||'/';
 const abort=new w.AbortController(),on=(el,event,fn)=>el?.addEventListener(event,fn,{signal:abort.signal});
 let ready=false,version='',waiting=false,installEvent=null,installed=w.matchMedia?.('(display-mode: standalone)').matches||w.navigator.standalone===true;
 const render=()=>{const text=(w.navigator.onLine===false?'Bez připojení · ':'')+(ready?'Aplikace připravena offline':build==='development'?'Offline režim bude dostupný v nasazené aplikaci':'Offline kopie zatím není připravená')+(ready&&version!==build?' · k dispozici je předchozí verze':'')+(waiting?' · aktualizace se použije po zavření všech karet aplikace':'');by('offline-status').textContent=text;if(by('offline-detail'))by('offline-detail').textContent=text;};
 const installState=()=>{if(by('install-app')){by('install-app').textContent=installed?'Aplikace je nainstalovaná':'Instalovat aplikaci';by('install-app').disabled=installed;}};
 const failure=text=>{if(ready)return;by('offline-status').textContent=text;if(by('offline-detail'))by('offline-detail').textContent=text;};
 function check(){const worker=sw?.controller;if(!worker)return Promise.resolve(false);return new Promise(resolve=>{const channel=new w.MessageChannel(),timer=w.setTimeout(()=>{channel.port1.close();resolve(false);},4000);channel.port1.onmessage=e=>{if(e.data?.type==='OFFLINE_READY'){ready=e.data.ready===true;version=e.data.version;render();}w.clearTimeout(timer);channel.port1.close();resolve(ready);};worker.postMessage({type:'STATUS'},[channel.port2]);});}
 function persistentLabel(persistent){if(by('storage-persist-status'))by('storage-persist-status').textContent=persistent?'Prohlížeč chrání data před automatickým uvolněním místa. Ruční smazání dat webu je stále odstraní.':'Pravidelně stahujte zálohu. Ochranu před automatickým uvolněním místa posuzuje prohlížeč.';}
 on(by('storage-persist'),'click',async()=>{try{persistentLabel(await w.navigator.storage?.persist?.());}catch{persistentLabel(false);}});
 w.navigator.storage?.persisted?.().then(persistentLabel).catch(()=>persistentLabel(false));
 on(w,'beforeinstallprompt',event=>{event.preventDefault();installEvent=event;installState();});
 on(w,'appinstalled',()=>{installed=true;installEvent=null;installState();});
 on(by('install-app'),'click',async()=>{if(!installEvent){by('install-help').textContent='V nabídce Chrome nebo Edge zvolte „Instalovat aplikaci“. Na iPhonu či iPadu použijte Sdílet → Přidat na plochu. Pokud volbu nevidíte, otevřete adresu v běžném prohlížeči. Instalace vyžaduje první otevření online.';return;}const prompt=installEvent;installEvent=null;try{await prompt.prompt();await prompt.userChoice;}catch{by('install-help').textContent='Instalaci můžete spustit z nabídky prohlížeče.';}});
 on(w,'online',render);on(w,'offline',render);render();installState();
 on(by('offline-check'),'click',async()=>{const ok=await check();if(!ok){ready=false;render();}});
 if(!sw||!build||build==='development'){if(!sw)failure('Tento prohlížeč nepodporuje otevření aplikace offline.');return {destroy:()=>abort.abort()};}
 const updateStatus=(text)=>{if(by('offline-update-status'))by('offline-update-status').textContent=text;};
 function observe(reg){waiting=!!reg.waiting;render();check();const watch=worker=>{if(!worker)return;on(worker,'statechange',()=>{waiting=!!reg.waiting;if(worker.state==='redundant')updateStatus('Stažení se nezdařilo. Původní verze zůstává dostupná.');else if(waiting)updateStatus('Aktualizace je stažená. Zavřete všechna okna aplikace a znovu ji spusťte.');render();});};watch(reg.installing);on(reg,'updatefound',()=>watch(reg.installing));}
 const register=version=>sw.register(base+'offline-worker/'+version+'.js',{scope:base,updateViaCache:'none'}).then(reg=>{observe(reg);return reg;});
 on(by('offline-update'),'click',async()=>{
  const button=by('offline-update');button.disabled=true;updateStatus('Hledám aktualizaci…');
  try{
   if(w.navigator.onLine===false)throw new Error('Pro stažení aktualizace se připojte k internetu. Dosavadní aplikace dál funguje offline.');
   if(!sw.controller){await register(build);updateStatus('Připravuji offline kopii…');return;}
   const release=await new Promise((resolve,reject)=>{const channel=new w.MessageChannel(),timer=w.setTimeout(()=>{channel.port1.close();reject(new Error('Server neodpovídá. Zkuste aktualizaci později.'));},20000);channel.port1.onmessage=e=>{w.clearTimeout(timer);channel.port1.close();e.data?.type==='UPDATE_AVAILABLE'?resolve(e.data):reject(new Error(e.data?.error||'Aktualizace není dostupná.'));};sw.controller.postMessage({type:'CHECK_UPDATE'},[channel.port2]);});
   if(release.version===version&&await check()){updateStatus('Používáte aktuální verzi.');return;}
   updateStatus('Stahuji aplikaci…');const reg=await register(release.version);
   // Explicit retry can repair missing cache entries even at the same version.
   if(!reg.installing&&!reg.waiting&&release.version===version) {await new Promise((resolve,reject)=>{const channel=new w.MessageChannel(),timer=w.setTimeout(()=>{channel.port1.close();reject(new Error('Oprava kopie nedokončena. Opakujte stažení.'));},60000);channel.port1.onmessage=e=>{w.clearTimeout(timer);channel.port1.close();e.data?.ok?resolve():reject(new Error('Kopii se nepodařilo stáhnout.'));};sw.controller.postMessage({type:'REPAIR'},[channel.port2]);});await check();updateStatus('Offline kopie byla doplněna.');}
  }catch(error){updateStatus(error.message);}finally{button.disabled=false;}
 });
 check();on(sw,'controllerchange',()=>{check();});
 // getRegistration reads browser state; an installed version makes no update request.
 sw.getRegistration(base).then(async reg=>{
  if(!reg||reg.scope!==new URL(base,w.location.origin).href||!reg.active?.scriptURL?.includes(base+'offline-worker/'))reg=await register(build);
  else observe(reg);
 }).catch(()=>{check().then(ok=>{if(!ok)failure('Offline kopii nelze připravit. Otevřete aplikaci online v prohlížeči s povolenými daty webu.');});});
 return {check,destroy:()=>abort.abort()};
}

const THEMES=['auto','light','dark'];
function initAppearance({document:d=globalThis.document}={}){
 const w=d.defaultView,root=d.documentElement,select=d.getElementById('theme-select'),abort=new w.AbortController();
 const media=w.matchMedia?.('(prefers-color-scheme: dark)'),layout=w.matchMedia?.('(min-width: 851px)');
 let theme='auto';try{const saved=w.localStorage.getItem('rt_theme_v1');if(THEMES.includes(saved))theme=saved;}catch{}
 function apply(){const resolved=theme==='auto'?(media?.matches?'dark':'light'):theme;root.dataset.theme=resolved;root.style.colorScheme=resolved;select.value=theme;d.dispatchEvent(new w.CustomEvent('rt-theme-change',{detail:{theme,resolved}}));}
 function orientation(){d.getElementById('tabs')?.setAttribute('aria-orientation',layout?.matches?'vertical':'horizontal');}
 const change=()=>{theme=THEMES.includes(select.value)?select.value:'auto';try{w.localStorage.setItem('rt_theme_v1',theme);}catch{}apply();};
 select.addEventListener('change',change,{signal:abort.signal});
 const system=()=>{if(theme==='auto')apply();};
 const storage=e=>{if(e.key==='rt_theme_v1'){theme=THEMES.includes(e.newValue)?e.newValue:'auto';apply();}};
 w.addEventListener('storage',storage,{signal:abort.signal});media?.addEventListener?.('change',system);layout?.addEventListener?.('change',orientation);
 const details=d.getElementById('connection-popover'),storageStatus=d.getElementById('storage-status'),offline=d.getElementById('offline-status'),note=d.querySelector('.save-note');
 function connection(){const state=note?.dataset.state==='error'||storageStatus.dataset.state==='error'?'error':storageStatus.dataset.state||'loading';details.dataset.state=state;d.getElementById('connection-summary').textContent=state==='error'?'Zkontrolovat uložení':state==='local'?'Pouze v zařízení':'Načítám místní data…';details.querySelector('summary').title=storageStatus.textContent+' · '+offline.textContent;}
 const observer=new w.MutationObserver(connection);[storageStatus,offline,note].filter(Boolean).forEach(el=>observer.observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:['data-state']}));
 d.addEventListener('click',e=>{if(details.open&&!details.contains(e.target))details.open=false;},{signal:abort.signal});
 details.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();details.open=false;details.querySelector('summary').focus();}},{signal:abort.signal});
 apply();orientation();connection();
 return {destroy(){abort.abort();observer.disconnect();media?.removeEventListener?.('change',system);layout?.removeEventListener?.('change',orientation);},theme:()=>theme};
}

Chart.register(...registerables);
initAppearance();
const app=initApp({ Chart });
initWorkflow({app});
initOffline();

export { IDENTIFIERS as I, KINDS as K, __vitePreload as _, fieldLabel as f, inputRows as i, recordSources as r, statusText as s, valueRows as v };
