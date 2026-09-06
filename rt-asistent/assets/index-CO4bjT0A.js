import { getOpeningTagMarkup, getClosingTagMarkup, getSelfClosingTagMarkup, getCellAddress, escapeTextContent as sanitizeTextContent, convertDateToSerialNumber, escapeAttributeValue as sanitizeAttributeValue, insertElementMarkupAccordingToOrderOfSiblings, getOrderOfSiblings, findElement, findElementInsideElement, replaceElement, appendMarkupInsideElement, prependMarkupInsideElement } from './index-D2KwxtmB.js';

// This function doesn't use `async`/`await` in order to avoid adding `@babel/runtime` to `dependencies`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/105

/**
 * Converts file content to a `Uint8Array`.
 * @param {Blob} fileContent
 * @returns {Promise<Uint8Array>}
 */
function convertFileContentToUint8Array(fileContent) {
  if (fileContent instanceof Blob) {
    return blobToUint8Array(fileContent);
  }
  throw new Error('Unsupported file content type. Expected a `Blob`');
}
function blobToUint8Array(blob) {
  return blob.arrayBuffer().then(function (arrayBuffer) {
    return new Uint8Array(arrayBuffer);
  });
}

// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).
var ch2 = {};
var wk = (function (c, id, msg, transfer, cb) {
    var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
        c + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
    ], { type: 'text/javascript' }))));
    w.onmessage = function (e) {
        var d = e.data, ed = d.$e$;
        if (ed) {
            var err = new Error(ed[0]);
            err['code'] = ed[1];
            err.stack = ed[2];
            cb(err, null);
        }
        else
            cb(null, d);
    };
    w.postMessage(msg, transfer);
    return w;
});

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new i32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return { b: b, r: r };
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), revfd = _b.r;
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >> 8) | ((x & 0x00FF) << 8)) >> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i) {
        if (cd[i])
            ++l[cd[i] - 1];
    }
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 1; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// fixed length map
var flm = /*#__PURE__*/ hMap(flt, 9, 0);
// fixed distance map
var fdm = /*#__PURE__*/ hMap(fdt, 5, 0);
// get end of byte
var shft = function (p) { return ((p + 7) / 8) | 0; };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        s = 0;
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    return new u8(v.subarray(s, e));
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    , // determined by compression function
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
    if (!nt)
        throw e;
    return e;
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16 = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
    d[o + 2] |= v >> 16;
};
// creates code lengths from a frequency table
var hTree = function (d, mb) {
    // Need extra info to make a tree
    var t = [];
    for (var i = 0; i < d.length; ++i) {
        if (d[i])
            t.push({ s: i, f: d[i] });
    }
    var s = t.length;
    var t2 = t.slice();
    if (!s)
        return { t: et, l: 0 };
    if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return { t: v, l: 1 };
    }
    t.sort(function (a, b) { return a.f - b.f; });
    // after i2 reaches last ind, will be stopped
    // freq must be greater than largest possible number of symbols
    t.push({ s: -1, f: 25001 });
    var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
    t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
    // efficient algorithm from UZIP.js
    // i0 is lookbehind, i2 is lookahead - after processing two low-freq
    // symbols that combined have high freq, will start processing i2 (high-freq,
    // non-composite) symbols instead
    // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
    while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
    }
    var maxSym = t2[0].s;
    for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
            maxSym = t2[i].s;
    }
    // code lengths
    var tr = new u16(maxSym + 1);
    // max bits in tree
    var mbt = ln(t[i1 - 1], tr, 0);
    if (mbt > mb) {
        // more algorithms from UZIP.js
        // TODO: find out how this code works (debt)
        //  ind    debt
        var i = 0, dt = 0;
        //    left            cost
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
        for (; i < s; ++i) {
            var i2_1 = t2[i].s;
            if (tr[i2_1] > mb) {
                dt += cst - (1 << (mbt - tr[i2_1]));
                tr[i2_1] = mb;
            }
            else
                break;
        }
        dt >>= lft;
        while (dt > 0) {
            var i2_2 = t2[i].s;
            if (tr[i2_2] < mb)
                dt -= 1 << (mb - tr[i2_2]++ - 1);
            else
                ++i;
        }
        for (; i >= 0 && dt; --i) {
            var i2_3 = t2[i].s;
            if (tr[i2_3] == mb) {
                --tr[i2_3];
                ++dt;
            }
        }
        mbt = mb;
    }
    return { t: new u8(tr), l: mbt };
};
// get the max length and assign length codes
var ln = function (n, l, d) {
    return n.s == -1
        ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
        : (l[n.s] = d);
};
// length codes generation
var lc = function (c) {
    var s = c.length;
    // Note that the semicolon was intentional
    while (s && !c[--s])
        ;
    var cl = new u16(++s);
    //  ind      num         streak
    var cli = 0, cln = c[0], cls = 1;
    var w = function (v) { cl[cli++] = v; };
    for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
            ++cls;
        else {
            if (!cln && cls > 2) {
                for (; cls > 138; cls -= 138)
                    w(32754);
                if (cls > 2) {
                    w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                    cls = 0;
                }
            }
            else if (cls > 3) {
                w(cln), --cls;
                for (; cls > 6; cls -= 6)
                    w(8304);
                if (cls > 2)
                    w(((cls - 3) << 5) | 8208), cls = 0;
            }
            while (cls--)
                w(cln);
            cls = 1;
            cln = c[i];
        }
    }
    return { c: cl.subarray(0, cli), n: s };
};
// calculate the length of output from tree, code lengths
var clen = function (cf, cl) {
    var l = 0;
    for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
    return l;
};
// writes a fixed block
// returns the new bit pos
var wfblk = function (out, pos, dat) {
    // no need to write 00 as type: TypedArray defaults to 0
    var s = dat.length;
    var o = shft(pos + 2);
    out[o] = s & 255;
    out[o + 1] = s >> 8;
    out[o + 2] = out[o] ^ 255;
    out[o + 3] = out[o + 1] ^ 255;
    for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
    return (o + 4 + s) * 8;
};
// writes a block
var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
    wbits(out, p++, final);
    ++lf[256];
    var _a = hTree(lf, 15), dlt = _a.t, mlb = _a.l;
    var _b = hTree(df, 15), ddt = _b.t, mdb = _b.l;
    var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
    var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
    var lcfreq = new u16(19);
    for (var i = 0; i < lclt.length; ++i)
        ++lcfreq[lclt[i] & 31];
    for (var i = 0; i < lcdt.length; ++i)
        ++lcfreq[lcdt[i] & 31];
    var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
    var nlcc = 19;
    for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
    var flen = (bl + 5) << 3;
    var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
    var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
    if (bs >= 0 && flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
    var lm, ll, dm, dl;
    wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
    if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
            wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i = 0; i < clct.length; ++i) {
                var len = clct[i] & 31;
                wbits(out, p, llm[len]), p += lct[len];
                if (len > 15)
                    wbits(out, p, (clct[i] >> 5) & 127), p += clct[i] >> 12;
            }
        }
    }
    else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
    }
    for (var i = 0; i < li; ++i) {
        var sym = syms[i];
        if (sym > 255) {
            var len = (sym >> 18) & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
                wbits(out, p, (sym >> 23) & 31), p += fleb[len];
            var dst = sym & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
                wbits16(out, p, (sym >> 5) & 8191), p += fdeb[dst];
        }
        else {
            wbits16(out, p, lm[sym]), p += ll[sym];
        }
    }
    wbits16(out, p, lm[256]);
    return p + ll[256];
};
// deflate options (nice << 13) | chain
var deo = /*#__PURE__*/ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
// empty
var et = /*#__PURE__*/ new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt = function (dat, lvl, plvl, pre, post, st) {
    var s = st.z || dat.length;
    var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
    // writing to this writes to the output buffer
    var w = o.subarray(pre, o.length - post);
    var lst = st.l;
    var pos = (st.r || 0) & 7;
    if (lvl) {
        if (pos)
            w[0] = st.r >> 3;
        var opt = deo[lvl - 1];
        var n = opt >> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        //    prev 2-byte val map    curr 2-byte val map
        var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
        // 24576 is an arbitrary number of maximum symbols per block
        // 424 buffer for last block
        var syms = new i32(25000);
        // length/literal freq   distance freq
        var lf = new u16(288), df = new u16(32);
        //  l/lcnt  exbits  index          l/lind  waitdx          blkpos
        var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
        for (; i + 2 < s; ++i) {
            // hash value
            var hv = hsh(i);
            // index mod 32768    previous index mod
            var imod = i & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            // We always should modify head and prev, but only add symbols if
            // this data is not yet processed ("wait" for wait index)
            if (wi <= i) {
                // bytes remaining
                var rem = s - i;
                if ((lc_1 > 7000 || li > 24576) && (rem > 423 || !lst)) {
                    pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                    li = lc_1 = eb = 0, bs = i;
                    for (var j = 0; j < 286; ++j)
                        lf[j] = 0;
                    for (var j = 0; j < 30; ++j)
                        df[j] = 0;
                }
                //  len    dist   chain
                var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
                if (rem > 2 && hv == hsh(i - dif)) {
                    var maxn = Math.min(n, rem) - 1;
                    var maxd = Math.min(32767, i);
                    // max possible length
                    // not capped at dif because decompressors implement "rolling" index population
                    var ml = Math.min(258, rem);
                    while (dif <= maxd && --ch_1 && imod != pimod) {
                        if (dat[i + l] == dat[i + l - dif]) {
                            var nl = 0;
                            for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                ;
                            if (nl > l) {
                                l = nl, d = dif;
                                // break out early when we reach "nice" (we are satisfied enough)
                                if (nl > maxn)
                                    break;
                                // now, find the rarest 2-byte sequence within this
                                // length of literals and search for that instead.
                                // Much faster than just using the start
                                var mmd = Math.min(dif, nl - 2);
                                var md = 0;
                                for (var j = 0; j < mmd; ++j) {
                                    var ti = i - dif + j & 32767;
                                    var pti = prev[ti];
                                    var cd = ti - pti & 32767;
                                    if (cd > md)
                                        md = cd, pimod = ti;
                                }
                            }
                        }
                        // check the previous match
                        imod = pimod, pimod = prev[imod];
                        dif += imod - pimod & 32767;
                    }
                }
                // d will be nonzero only when a match was found
                if (d) {
                    // store both dist and len data in one int32
                    // Make sure this is recognized as a len/dist with 28th bit (2^28)
                    syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                    var lin = revfl[l] & 31, din = revfd[d] & 31;
                    eb += fleb[lin] + fdeb[din];
                    ++lf[257 + lin];
                    ++df[din];
                    wi = i + l;
                    ++lc_1;
                }
                else {
                    syms[li++] = dat[i];
                    ++lf[dat[i]];
                }
            }
        }
        for (i = Math.max(i, wi); i < s; ++i) {
            syms[li++] = dat[i];
            ++lf[dat[i]];
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        if (!lst) {
            st.r = (pos & 7) | w[(pos / 8) | 0] << 3;
            // shft(pos) now 1 less if pos & 7 != 0
            pos -= 7;
            st.h = head, st.p = prev, st.i = i, st.w = wi;
        }
    }
    else {
        for (var i = st.w || 0; i < s + lst; i += 65535) {
            // end
            var e = i + 65535;
            if (e >= s) {
                // write final block
                w[(pos / 8) | 0] = lst;
                e = s;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
        st.i = s;
    }
    return slc(o, 0, pre + shft(pos) + post);
};
// CRC32 table
var crct = /*#__PURE__*/ (function () {
    var t = new Int32Array(256);
    for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
            c = ((c & 1) && -306674912) ^ (c >>> 1);
        t[i] = c;
    }
    return t;
})();
// CRC32
var crc = function () {
    var c = -1;
    return {
        p: function (d) {
            // closures have awful performance
            var cr = c;
            for (var i = 0; i < d.length; ++i)
                cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
            c = cr;
        },
        d: function () { return ~c; }
    };
};
// deflate with opts
var dopt = function (dat, opt, pre, post, st) {
    if (!st) {
        st = { l: 1 };
        if (opt.dictionary) {
            var dict = opt.dictionary.subarray(-32768);
            var newDat = new u8(dict.length + dat.length);
            newDat.set(dict);
            newDat.set(dat, dict.length);
            dat = newDat;
            st.w = dict.length;
        }
    }
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? (st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20) : (12 + opt.mem), pre, post, st);
};
// Walmart object spread
var mrg = function (a, b) {
    var o = {};
    for (var k in a)
        o[k] = a[k];
    for (var k in b)
        o[k] = b[k];
    return o;
};
// worker clone
// This is possibly the craziest part of the entire codebase, despite how simple it may seem.
// The only parameter to this function is a closure that returns an array of variables outside of the function scope.
// We're going to try to figure out the variable names used in the closure as strings because that is crucial for workerization.
// We will return an object mapping of true variable name to value (basically, the current scope as a JS object).
// The reason we can't just use the original variable names is minifiers mangling the toplevel scope.
// This took me three weeks to figure out how to do.
var wcln = function (fn, fnStr, td) {
    var dt = fn();
    var st = fn.toString();
    var ks = st.slice(st.indexOf('[') + 1, st.lastIndexOf(']')).replace(/\s+/g, '').split(',');
    for (var i = 0; i < dt.length; ++i) {
        var v = dt[i], k = ks[i];
        if (typeof v == 'function') {
            fnStr += ';' + k + '=';
            var st_1 = v.toString();
            if (v.prototype) {
                // for global objects
                if (st_1.indexOf('[native code]') != -1) {
                    var spInd = st_1.indexOf(' ', 8) + 1;
                    fnStr += st_1.slice(spInd, st_1.indexOf('(', spInd));
                }
                else {
                    fnStr += st_1;
                    for (var t in v.prototype)
                        fnStr += ';' + k + '.prototype.' + t + '=' + v.prototype[t].toString();
                }
            }
            else
                fnStr += st_1;
        }
        else
            td[k] = v;
    }
    return fnStr;
};
var ch = [];
// clone bufs
var cbfs = function (v) {
    var tl = [];
    for (var k in v) {
        if (v[k].buffer) {
            tl.push((v[k] = new v[k].constructor(v[k])).buffer);
        }
    }
    return tl;
};
// use a worker to execute code
var wrkr = function (fns, init, id, cb) {
    if (!ch[id]) {
        var fnStr = '', td_1 = {}, m = fns.length - 1;
        for (var i = 0; i < m; ++i)
            fnStr = wcln(fns[i], fnStr, td_1);
        ch[id] = { c: wcln(fns[m], fnStr, td_1), e: td_1 };
    }
    var td = mrg({}, ch[id].e);
    return wk(ch[id].c + ';onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=' + init.toString() + '}', id, td, cbfs(td), cb);
};
var bDflt = function () { return [u8, u16, i32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf]; };
// post buf
var pbf = function (msg) { return postMessage(msg, [msg.buffer]); };
// async helper
var cbify = function (dat, opts, fns, init, id, cb) {
    var w = wrkr(fns, init, id, function (err, dat) {
        w.terminate();
        cb(err, dat);
    });
    w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
    return function () { w.terminate(); };
};
// write bytes
var wbytes = function (d, b, v) {
    for (; v; ++b)
        d[b] = v, v >>>= 8;
};
function deflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    return cbify(data, opts, [
        bDflt,
    ], function (ev) { return pbf(deflateSync(ev.data[0], ev.data[1])); }, 0, cb);
}
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
function deflateSync(data, opts) {
    return dopt(data, opts || {}, 0, 0);
}
// flatten a directory structure
var fltn = function (d, p, t, o) {
    for (var k in d) {
        var val = d[k], n = p + k, op = o;
        if (Array.isArray(val))
            op = mrg(o, val[1]), val = val[0];
        if (ArrayBuffer.isView(val))
            t[n] = [val, op];
        else {
            t[n += '/'] = [new u8(0), op];
            fltn(val, n, t, o);
        }
    }
};
// text encoder
var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder();
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
function strToU8(str, latin1) {
    var i; 
    if (te)
        return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function (v) { ar[ai++] = v; };
    for (var i = 0; i < l; ++i) {
        if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + ((l - i) << 1));
            n.set(ar);
            ar = n;
        }
        var c = str.charCodeAt(i);
        if (c < 128 || latin1)
            w(c);
        else if (c < 2048)
            w(192 | (c >> 6)), w(128 | (c & 63));
        else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                w(240 | (c >> 18)), w(128 | ((c >> 12) & 63)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
        else
            w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
    }
    return slc(ar, 0, ai);
}
// extra field length
var exfl = function (ex) {
    var le = 0;
    if (ex) {
        for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
                err(9);
            le += l + 4;
        }
    }
    return le;
};
// write zip header
var wzh = function (d, b, f, fn, u, c, ce, co) {
    var fl = fn.length, ex = f.extra, col = co && co.length;
    var exl = exfl(ex);
    wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
    if (ce != null)
        d[b++] = 20, d[b++] = f.os;
    d[b] = 20, b += 2; // spec compliance? what's that?
    d[b++] = (f.flag << 1) | (c < 0 && 8), d[b++] = u && 8;
    d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
    var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
    if (y < 0 || y > 119)
        err(10);
    wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >> 1)), b += 4;
    if (c != -1) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c < 0 ? -c - 2 : c);
        wbytes(d, b + 8, f.size);
    }
    wbytes(d, b + 12, fl);
    wbytes(d, b + 14, exl), b += 16;
    if (ce != null) {
        wbytes(d, b, col);
        wbytes(d, b + 6, f.attrs);
        wbytes(d, b + 10, ce), b += 14;
    }
    d.set(fn, b);
    b += fl;
    if (exl) {
        for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d, b, +k);
            wbytes(d, b + 2, l);
            d.set(exf, b + 4), b += 4 + l;
        }
    }
    if (col)
        d.set(co, b), b += col;
    return b;
};
// write zip footer (end of central directory)
var wzf = function (o, b, c, d, e) {
    wbytes(o, b, 0x6054B50); // skip disk
    wbytes(o, b + 8, c);
    wbytes(o, b + 10, c);
    wbytes(o, b + 12, d);
    wbytes(o, b + 16, e);
};
function zip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        err(7);
    var r = {};
    fltn(data, '', r, opts);
    var k = Object.keys(r);
    var lft = k.length, o = 0, tot = 0;
    var slft = lft, files = new Array(lft);
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var cbd = function (a, b) {
        mt(function () { cb(a, b); });
    };
    mt(function () { cbd = cb; });
    var cbf = function () {
        var out = new u8(tot + 22), oe = o, cdl = tot - o;
        tot = 0;
        for (var i = 0; i < slft; ++i) {
            var f = files[i];
            try {
                var l = f.c.length;
                wzh(out, tot, f, f.f, f.u, l);
                var badd = 30 + f.f.length + exfl(f.extra);
                var loc = tot + badd;
                out.set(f.c, loc);
                wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
            }
            catch (e) {
                return cbd(e, null);
            }
        }
        wzf(out, o, files.length, cdl, oe);
        cbd(null, out);
    };
    if (!lft)
        cbf();
    var _loop_1 = function (i) {
        var fn = k[i];
        var _a = r[fn], file = _a[0], p = _a[1];
        var c = crc(), size = file.length;
        c.p(file);
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        var compression = p.level == 0 ? 0 : 8;
        var cbl = function (e, d) {
            if (e) {
                tAll();
                cbd(e, null);
            }
            else {
                var l = d.length;
                files[i] = mrg(p, {
                    size: size,
                    crc: c.d(),
                    c: d,
                    f: f,
                    m: m,
                    u: s != fn.length || (m && (com.length != ms)),
                    compression: compression
                });
                o += 30 + s + exl + l;
                tot += 76 + 2 * (s + exl) + (ms || 0) + l;
                if (!--lft)
                    cbf();
            }
        };
        if (s > 65535)
            cbl(err(11, 0, 1), null);
        if (!compression)
            cbl(null, file);
        else if (size < 160000) {
            try {
                cbl(null, deflateSync(file, p));
            }
            catch (e) {
                cbl(e, null);
            }
        }
        else
            term.push(deflate(file, p, cbl));
    };
    // Cannot use lft because it can decrease
    for (var i = 0; i < slft; ++i) {
        _loop_1(i);
    }
    return tAll;
}
var mt = typeof queueMicrotask == 'function' ? queueMicrotask : typeof setTimeout == 'function' ? setTimeout : function (fn) { fn(); };

// `fflate` readme is too complicated:
// https://github.com/101arrowz/fflate/issues/251
// I just used whatever approach seemed to work.
//
// It was a choice between "syncrhonous" (blocking) unzip via `zipSync()`
// and "asynchronous" (non-blocking) unzip via `zip()`.
//
// In the readme they say that using "asynchronous" API  will cause the compression or decompression
// run in a separate thread by using Web (or Node) Workers, so it won't block the main thread.
// Yet, they also say that there is an initial overhead to using workers of about 50ms for each
// asynchronous function. For small (under about 50kB) payloads, they say that the "asynchronous" API
// will be much slower compared to the "synchronous" one. However, when compressing larger files
// or multiple files at once, the "synchronous" API causes the main thread to hang for too long,
// and the "asynchronous" API is an order of magnitude better.
//

/**
 * Creates a `*.zip` file from a map of files.
 * @param  {Record<string,Uint8Array>} files
 * @return {Promise<ArrayBuffer>} Promise of `*.zip` file data.
 */
function zipToArrayBuffer(files) {
  return zipAsync(files).then(function (uint8Array) {
    return uint8Array.buffer;
  });
}
function zipAsync(files) {
  return new Promise(function (resolve, reject) {
    // `zip()` will resort to "synchronous" compression in an edge case:
    // * When an individual file size is less than `160KB`.
    zip(files, function (error, archive) {
      if (error) {
        reject(error);
      } else {
        resolve(archive);
      }
    });
  });
}

/**
 * Converts `files` values to `Uint8Array`s.
 * @param {Record<string,any>} files
 * @param {function} convertFileContentToUint8Array
 * @returns {Promise<Record<string,Uint8Array>>}
 */
function convertFilesContentToUint8Arrays(files, convertFileContentToUint8Array) {
  var convertedFiles = {};
  return Promise.all(Object.keys(files).map(function (key) {
    if (files[key] instanceof Uint8Array) {
      convertedFiles[key] = files[key];
    } else if (typeof files[key] === 'string') {
      convertedFiles[key] = convertStringToUint8Array(files[key]);
    } else {
      return convertFileContentToUint8Array(files[key]).then(function (uint8Array) {
        convertedFiles[key] = uint8Array;
      });
    }
  })).then(function () {
    return convertedFiles;
  });
}
function convertStringToUint8Array(string) {
  return strToU8(string);
}

function _createForOfIteratorHelperLoose$b(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$d(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$d(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$d(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$d(r, a) : void 0; } }
function _arrayLikeToArray$d(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// Returns the content that should be inserted by `features` when performing a `transformName` transform.
function getAdditionalContent(fileName, features, sheetOptions, properties) {
  var content = '';
  for (var _iterator = _createForOfIteratorHelperLoose$b(features), _step; !(_step = _iterator()).done;) {
    var feature = _step.value;
    var transform = feature.files && feature.files.transform && feature.files.transform[fileName];
    if (transform && transform.insert) {
      var insertedContent = transform.insert(sheetOptions, properties);
      if (insertedContent) {
        content += insertedContent;
      }
    }
  }
  return content;
}

function _createForOfIteratorHelperLoose$a(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$c(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$c(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$c(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$c(r, a) : void 0; } }
function _arrayLikeToArray$c(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// Transforms the content by `features` when performing a `transformName` transform.
function transformContent(content, fileName, features, sheetOptions, properties) {
  for (var _iterator = _createForOfIteratorHelperLoose$a(features), _step; !(_step = _iterator()).done;) {
    var feature = _step.value;
    var transform = feature.files && feature.files.transform && feature.files.transform[fileName];
    if (transform && transform.transform) {
      content = transform.transform(content, sheetOptions, properties);
    }
  }
  return content;
}

function _createForOfIteratorHelperLoose$9(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$b(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$b(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$b(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$b(r, a) : void 0; } }
function _arrayLikeToArray$b(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function getElementXml(fileName, tagName, attributes,
// Could be `undefined` or `null`
innerXml,
// Could be `undefined` or `null`
index,
// Could be `undefined`
properties, sheetOptionsOrSheetsOptions, features) {
  for (var _iterator = _createForOfIteratorHelperLoose$9(features), _step; !(_step = _iterator()).done;) {
    var feature = _step.value;
    var transform = feature.files && feature.files.transform && feature.files.transform[fileName];
    if (transform && transform.transformElementAttributes) {
      attributes = transform.transformElementAttributes(tagName, attributes || NO_ATTRIBUTES, index, sheetOptionsOrSheetsOptions, properties);
    }
  }
  if (innerXml) {
    return getOpeningTagMarkup(tagName, attributes) + innerXml + getClosingTagMarkup(tagName);
  } else {
    return getSelfClosingTagMarkup(tagName, attributes);
  }
}
var NO_ATTRIBUTES = {};

function generateWorkbookXml(_ref) {
  var sheetIdsAndNames = _ref.sheetIdsAndNames,
    features = _ref.features,
    sheetsOptions = _ref.sheetsOptions;
  /**
   * Creates XML tag markup.
   * @param {string} tagName
   * @param {object} attributes
   * @param {string} [innerXml]
   * @param {number} [index]
   * @returns {string}
   */
  var tag = function tag(tagName, attributes, innerXml, index) {
    return getElementXml('xl/workbook.xml', tagName, attributes, innerXml, index, EMPTY_OBJECT, sheetsOptions, features);
  };
  var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">' +
  // The order of elements is dictated by the XLSX spec.
  //
  // <workbookPr/>
  tag('workbookPr') +
  // <bookViews/>
  tag('bookViews', null, tag('workbookView', null, null, 0)) +
  // <sheets/>
  tag('sheets', null, sheetIdsAndNames.map(function (_ref2, i) {
    var sheetId = _ref2.sheetId,
      sheetName = _ref2.sheetName;
    return tag('sheet', {
      'r:id': "rId".concat(sheetId),
      sheetId: sheetId,
      name: sheetName
    }, null, i);
  }).join('')) +
  // <definedNames/>
  tag('definedNames') +
  // <calcPr/>
  tag('calcPr') +
  // Apply any plugins that insert additional content to this XML.
  getAdditionalContent('xl/workbook.xml', features, sheetsOptions) + '</workbook>';

  // Apply any plugins that transform this XML.
  xml = transformContent(xml, 'xl/workbook.xml', features, sheetsOptions);
  return xml;
}
var EMPTY_OBJECT = {};

function generateWorkbookXmlRels(_ref) {
  var sheetIds = _ref.sheetIds,
    features = _ref.features,
    sheetsOptions = _ref.sheetsOptions;
  var xml = '<?xml version="1.0" ?>' + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + sheetIds.map(function (id) {
    return "<Relationship Id=\"rId".concat(id, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet").concat(id, ".xml\"/>");
  }).join('') + "<Relationship Id=\"rId".concat(sheetIds.length + 1, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings\" Target=\"sharedStrings.xml\"/>") + "<Relationship Id=\"rId".concat(sheetIds.length + 2, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/>") +
  // Apply any plugins that insert additional content to this XML.
  getAdditionalContent('xl/_rels/workbook.xml.rels', features, sheetsOptions) + '</Relationships>';

  // Apply any plugins that transform this XML.
  xml = transformContent(xml, 'xl/_rels/workbook.xml.rels', features, sheetsOptions);
  return xml;
}

function generateRelsXml(_ref) {
  var features = _ref.features,
    sheetsOptions = _ref.sheetsOptions;
  var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + '<Relationship Id="rId-workbook-1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
  // Apply any plugins that insert additional content to this XML.
  getAdditionalContent('_rels/.rels', features, sheetsOptions) + '</Relationships>';

  // Apply any plugins that transform this XML.
  xml = transformContent(xml, '_rels/.rels', features, sheetsOptions);
  return xml;
}

function generateContentTypesXml(_ref) {
  var sheetIds = _ref.sheetIds,
    features = _ref.features,
    sheetsOptions = _ref.sheetsOptions;
  var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' + '<Default ContentType="application/xml" Extension="xml"/>' + '<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>' + '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" PartName="/xl/workbook.xml"/>' + '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" PartName="/xl/sharedStrings.xml"/>' + '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" PartName="/xl/styles.xml"/>' + sheetIds.map(function (sheetId) {
    return "<Override ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\" PartName=\"/xl/worksheets/sheet".concat(sheetId, ".xml\"/>");
  }).join('') + sheetIds.map(function (sheetId) {
    return getDrawingContentTypeXml(sheetId);
  }).join('') +
  // Apply any plugins that insert additional content to this XML.
  getAdditionalContent('[Content_Types].xml', features, sheetsOptions) + '</Types>';

  // Apply any plugins that transform this XML.
  xml = transformContent(xml, '[Content_Types].xml', features, sheetsOptions);
  return xml;
}
function getDrawingContentTypeXml(sheetId) {
  return "<Override ContentType=\"application/vnd.openxmlformats-officedocument.drawing+xml\" PartName=\"/xl/drawings/drawing".concat(sheetId, ".xml\"/>");
}

// https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md
function generateDrawingXml(_ref) {
  var sheetIndex = _ref.sheetIndex,
    sheetId = _ref.sheetId,
    sheetOptions = _ref.sheetOptions,
    features = _ref.features;
  var xml = DRAWING_XML_START +
  // Apply any plugins that insert additional content to this XML.
  getAdditionalContent('xl/drawings/drawing{id}.xml', features, sheetOptions, {
    sheetIndex: sheetIndex,
    sheetId: sheetId
  }) + DRAWING_XML_END;

  // Apply any plugins that transform this XML.
  xml = transformContent(xml, 'xl/drawings/drawing{id}.xml', features, sheetOptions, {
    sheetIndex: sheetIndex,
    sheetId: sheetId
  });
  return xml;
}
var DRAWING_XML_START = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">';
var DRAWING_XML_END = '</xdr:wsDr>';

function generateDrawingXmlRels(_ref) {
  var sheetIndex = _ref.sheetIndex,
    sheetId = _ref.sheetId,
    sheetOptions = _ref.sheetOptions,
    features = _ref.features;
  var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  // Apply any plugins that insert additional content to this XML.
  getAdditionalContent('xl/drawings/_rels/drawing{id}.xml.rels', features, sheetOptions, {
    sheetIndex: sheetIndex,
    sheetId: sheetId
  }) + '</Relationships>';

  // Apply any plugins that transform this XML.
  xml = transformContent(xml, 'xl/drawings/_rels/drawing{id}.xml.rels', features, sheetOptions, {
    sheetIndex: sheetIndex,
    sheetId: sheetId
  });
  return xml;
}

function generateSheetViews(tag, viewProperties, sheetIndex) {
  if (!hasView(viewProperties)) {
    return '';
  }
  var showGridLines = viewProperties.showGridLines,
    rightToLeft = viewProperties.rightToLeft,
    zoomScale = viewProperties.zoomScale;
  var sheetViewAttributes = {
    tabSelected: sheetIndex === 0 ? 1 : 0,
    // The first sheet is selected by default.
    workbookViewId: 0
  };
  if (showGridLines === false) {
    sheetViewAttributes.showGridLines = false;
  }
  if (rightToLeft) {
    sheetViewAttributes.rightToLeft = 1;
  }
  if (typeof zoomScale === 'number') {
    // Convert the scale number to a percentage.
    //
    // Excel 2007 doesn't like fractional `zoomScale` percentage values.
    // To work around that, it rounds the resulting percentage value.
    //
    sheetViewAttributes.zoomScale = Math.round(zoomScale * 100);
  }
  var sheetViewXml = tag('sheetView', sheetViewAttributes, null, 0);
  return tag('sheetViews', null, sheetViewXml);
}
function hasView(_ref) {
  var showGridLines = _ref.showGridLines,
    rightToLeft = _ref.rightToLeft,
    zoomScale = _ref.zoomScale;
  return showGridLines === false || rightToLeft || typeof zoomScale === 'number';
}

// import floatToInteger from './helpers/floatToInteger.js'

function generateColumnDescription(tag, column, index) {
  // Guards against a developer forgetting to put some columns
  // in the `columns` list.
  // For example, a developer may pass `data` with `7` columns
  // but only specify `6` of them in the `columns` list.
  // Hence, it handles missing column description here.
  if (!column) {
    return '';
  }

  // Get the column width (in characters).
  var width = column.width;

  // If no width specified (0 width is not allowed as well), then
  // leave the definition empty and the width will be applied automatically.
  if (!width) {
    return '';
  }

  // To ensure the column number starts as in Excel.
  var columnNumber = index + 1;

  // `column` format is described here:
  // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.column.aspx
  //
  // `customWidth="1"` is required in order for `width="..."` to be applied.
  // Otherwise, Microsoft Office 2007 Excel wouldn't apply the custom column `width`.
  //
  var attributes = {
    min: columnNumber,
    max: columnNumber,
    width: width,
    customWidth: 1
  };
  return tag('col', attributes, null, index);
}

// /**
//  * Converts column width in pixels to column width in characters.
//  * Column width is measured as the number of characters of the maximum digit width
//  * of the numbers 0, 1, 2, …, 9 as rendered in the normal style's font.
//  * There are 4 pixels of margin padding (two on each side), plus 1 pixel padding
//  * for the gridlines.
//  * @param {number} widthInPixels — Target column width in pixels.
//  * @return {number}
//  */
//  function getColumnWidthInCharacters(columnWidthInPixels) {
//   // Using the Calibri font as an example,
//   // the maximum width of a digit character
//   // when using font size "11 pt" is equal to 7 pixels (at 96 dpi).
//   // TODO make it configurable?
//   const maximumDigitWidth = 7 // in pixels
//
//   // To translate from pixels to character width, use this calculation:
//   // =Truncate(({pixels}-5)/{Maximum Digit Width} * 100+0.5)/100
//   const characterWidth = floatToInteger((((columnWidthInPixels - 5) / maximumDigitWidth) * 100) + 0.5) / 100
//
//   // To translate from character width to real width, use this calculation:
//   // =Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256
//   return floatToInteger((((characterWidth * maximumDigitWidth) + 5) / maximumDigitWidth) * 256) / 256
// }

function generateColumnsDescription(tag, columns) {
  // If column options are specified.
  if (columns) {
    // `cols` format is described here:
    // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.columns.aspx
    var columnsXml = columns.map(function (column, index) {
      return generateColumnDescription(tag, column, index);
    }).join('');

    // If any column has any custom properties, create a `<cols/>` element.
    // An empty `<cols></cols>` element would produce an error in some versions of Excel.
    // https://gitlab.com/catamphetamine/write-excel-file/-/issues/6
    if (columnsXml) {
      return tag('cols', null, columnsXml);
    }
  }

  // Return an empty string rather than an empty `<cols></cols>` element.
  // An empty `<cols></cols>` element would produce an error in some versions of Excel.
  // https://gitlab.com/catamphetamine/write-excel-file/-/issues/6
  return '';
}

function _slicedToArray$1(r, e) { return _arrayWithHoles$1(r) || _iterableToArrayLimit$1(r, e) || _unsupportedIterableToArray$a(r, e) || _nonIterableRest$1(); }
function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$a(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$a(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$a(r, a) : void 0; } }
function _arrayLikeToArray$a(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit$1(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = true, o = false; try { if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = true, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles$1(r) { if (Array.isArray(r)) return r; }
function generateCell(tag, _ref, index, rowIndex) {
  var value = _ref.value,
    type = _ref.type,
    cellStyleId = _ref.cellStyleId,
    findOrCreateSharedString = _ref.findOrCreateSharedString;
  // Empty cells could be skipped completely,
  // if they don't have a style applied to them,
  // like border or background color.
  if (value === null) {
    if (cellStyleId === undefined) {
      return '';
    }
  }
  var cellAttributes = {
    r: getCellAddress(rowIndex, index)
  };

  // Available formatting style IDs (built-in in Excel):
  // https://xlsxwriter.readthedocs.io/format.html#format-set-num-format
  // `2` — 0.00
  // `3` —  #,##0
  if (cellStyleId !== undefined) {
    // From the attribute s="12" we know that the cell's formatting is stored at the 13th (zero-based index) <xf> within the <cellXfs>
    cellAttributes.s = String(cellStyleId);
  }
  if (value === null) {
    return tag('c', cellAttributes, null, index);
  }

  // Validate date format.
  if (type === Date && cellStyleId === undefined) {
    throw new Error("No `format` was specified for a `Date` value in a cell in row ".concat(rowIndex + 1, " column ").concat(index + 1, ". Either specify a `format` for this cell or specify a default global one by passing `dateFormat` option to `writeXlsxFile()` function"));
  }
  var valueTextContent = getValueTextContent(type, value, findOrCreateSharedString);
  var typeAttribute = getTypeAttribute(type);

  // The default value for `t` is `"n"` (a number or a date).
  if (typeAttribute) {
    cellAttributes.t = typeAttribute;
  }
  var _getOpeningAndClosing = getOpeningAndClosingTags(type),
    _getOpeningAndClosing2 = _slicedToArray$1(_getOpeningAndClosing, 2),
    valueOpeningTags = _getOpeningAndClosing2[0],
    valueClosingTags = _getOpeningAndClosing2[1];
  var cellXml = valueOpeningTags + valueTextContent + valueClosingTags;
  return tag('c', cellAttributes, cellXml, index);
}
function getTypeAttribute(type) {
  // Available Excel cell types:
  // https://github.com/SheetJS/sheetjs/blob/19620da30be2a7d7b9801938a0b9b1fd3c4c4b00/docbits/52_datatype.md
  //
  // Some other document (seems to be old):
  // http://webapp.docx4java.org/OnlineDemo/ecma376/SpreadsheetML/ST_CellType.html
  //
  switch (type) {
    case String:
      return 's';
    // I don't know why did I comment out the use of "inlineStr" XLSX type.
    // Perhaps there were some issues with it. Or perhaps there weren't and everyone else just uses "s".
    // // "inlineStr" type is used instead of "s" to avoid creating a "shared strings" index.
    // return 'inlineStr'

    case Number:
      // `n` is the default cell type (if no `t` has been specified).
      // return 'n'
      return;
    case Date:
      // `n` is the default cell type (if no `t` has been specified).
      // return 'n'
      return;
    case Boolean:
      return 'b';
    case 'Formula':
      return;
    default:
      throw new Error("Unknown type: ".concat(type && type.name || type));
  }
}
function getValueTextContent(type, value, findOrCreateSharedString) {
  // Available Excel cell types:
  // https://github.com/SheetJS/sheetjs/blob/19620da30be2a7d7b9801938a0b9b1fd3c4c4b00/docbits/52_datatype.md
  //
  // Some other document (seems to be old):
  // http://webapp.docx4java.org/OnlineDemo/ecma376/SpreadsheetML/ST_CellType.html
  //
  switch (type) {
    case String:
      if (typeof value !== 'string') {
        throw new Error("Invalid cell value: ".concat(value, ". Expected a string"));
      }
      return findOrCreateSharedString(value);
    case Number:
      if (typeof value !== 'number') {
        throw new Error("Invalid cell value: ".concat(value, ". Expected a number"));
      }
      return String(value);
    case Date:
      if (!(value instanceof Date)) {
        throw new Error("Invalid cell value: ".concat(value, ". Expected a Date"));
      }
      // "d" type doesn't seem to work.
      // return value.toISOString()
      return String(convertDateToSerialNumber(value));
    case Boolean:
      if (typeof value !== 'boolean') {
        throw new Error("Invalid cell value: ".concat(value, ". Expected a boolean"));
      }
      return value ? '1' : '0';
    case 'Formula':
      if (typeof value !== 'string') {
        throw new Error("Invalid cell value: ".concat(value, ". Expected a string"));
      }
      return sanitizeTextContent(value);
    default:
      throw new Error("Unknown type: ".concat(type && type.name || type));
  }
}
var TAG_BRACKET_LEFT_REGEXP = /</g;
function getOpeningAndClosingTags(type) {
  var openingTags = getOpeningTags(type);
  var closingTags = openingTags.replace(TAG_BRACKET_LEFT_REGEXP, '</');
  return [openingTags, closingTags];
}
function getOpeningTags(type) {
  switch (type) {
    // case 'inlineStr':
    //   return '<is><t>'
    case 'Formula':
      return '<f>';
    default:
      return '<v>';
  }
}

function hasAlignment(_ref) {
  var align = _ref.align,
    alignVertical = _ref.alignVertical,
    textRotation = _ref.textRotation,
    indent = _ref.indent,
    wrap = _ref.wrap;
  return Boolean(align || alignVertical || typeof textRotation === 'number' || indent || wrap);
}

function hasBorder(_ref) {
  var borderColor = _ref.borderColor,
    borderStyle = _ref.borderStyle,
    leftBorderColor = _ref.leftBorderColor,
    leftBorderStyle = _ref.leftBorderStyle,
    rightBorderColor = _ref.rightBorderColor,
    rightBorderStyle = _ref.rightBorderStyle,
    topBorderColor = _ref.topBorderColor,
    topBorderStyle = _ref.topBorderStyle,
    bottomBorderColor = _ref.bottomBorderColor,
    bottomBorderStyle = _ref.bottomBorderStyle;
  return Boolean(borderColor || borderStyle || leftBorderColor || leftBorderStyle || rightBorderColor || rightBorderStyle || topBorderColor || topBorderStyle || bottomBorderColor || bottomBorderStyle);
}

function hasFill(_ref) {
  var backgroundColor = _ref.backgroundColor,
    fillPatternStyle = _ref.fillPatternStyle,
    fillPatternColor = _ref.fillPatternColor;
  return Boolean(backgroundColor || fillPatternStyle && fillPatternColor);
}

function hasFont(_ref) {
  var fontFamily = _ref.fontFamily,
    fontSize = _ref.fontSize,
    fontWeight = _ref.fontWeight,
    fontStyle = _ref.fontStyle,
    textDecoration = _ref.textDecoration,
    textColor = _ref.textColor;
  return Boolean(fontFamily || typeof fontSize === 'number' || fontWeight || fontStyle || textDecoration && Object.keys(textDecoration).length > 0 || textColor);
}

function getCellStyleProperties(cell, features) {
  var align = cell.align,
    alignVertical = cell.alignVertical,
    textRotation = cell.textRotation,
    indent = cell.indent,
    wrap = cell.wrap,
    fontFamily = cell.fontFamily,
    fontSize = cell.fontSize,
    fontWeight = cell.fontWeight,
    fontStyle = cell.fontStyle,
    textDecoration = cell.textDecoration,
    textColor = cell.textColor,
    backgroundColor = cell.backgroundColor,
    fillPatternStyle = cell.fillPatternStyle,
    fillPatternColor = cell.fillPatternColor,
    borderColor = cell.borderColor,
    borderStyle = cell.borderStyle,
    leftBorderColor = cell.leftBorderColor,
    leftBorderStyle = cell.leftBorderStyle,
    rightBorderColor = cell.rightBorderColor,
    rightBorderStyle = cell.rightBorderStyle,
    topBorderColor = cell.topBorderColor,
    topBorderStyle = cell.topBorderStyle,
    bottomBorderColor = cell.bottomBorderColor,
    bottomBorderStyle = cell.bottomBorderStyle;
  if (hasAlignment({
    align: align,
    alignVertical: alignVertical,
    textRotation: textRotation,
    indent: indent,
    wrap: wrap
  }) || hasFont({
    fontFamily: fontFamily,
    fontSize: fontSize,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    textDecoration: textDecoration,
    textColor: textColor
  }) || hasFill({
    backgroundColor: backgroundColor,
    fillPatternStyle: fillPatternStyle,
    fillPatternColor: fillPatternColor
  }) || hasBorder({
    borderColor: borderColor,
    borderStyle: borderStyle,
    leftBorderColor: leftBorderColor,
    leftBorderStyle: leftBorderStyle,
    rightBorderColor: rightBorderColor,
    rightBorderStyle: rightBorderStyle,
    topBorderColor: topBorderColor,
    topBorderStyle: topBorderStyle,
    bottomBorderColor: bottomBorderColor,
    bottomBorderStyle: bottomBorderStyle
  })) {
    return omitUndefinedProperties({
      // alignment
      align: align,
      alignVertical: alignVertical,
      textRotation: textRotation,
      indent: indent,
      wrap: wrap,
      // font
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      textDecoration: textDecoration,
      textColor: textColor,
      // fill
      backgroundColor: backgroundColor,
      fillPatternStyle: fillPatternStyle,
      fillPatternColor: fillPatternColor,
      // border
      borderColor: borderColor,
      borderStyle: borderStyle,
      leftBorderColor: leftBorderColor,
      leftBorderStyle: leftBorderStyle,
      rightBorderColor: rightBorderColor,
      rightBorderStyle: rightBorderStyle,
      topBorderColor: topBorderColor,
      topBorderStyle: topBorderStyle,
      bottomBorderColor: bottomBorderColor,
      bottomBorderStyle: bottomBorderStyle
    });
  }
}
function omitUndefinedProperties(object) {
  var filteredObject = {};
  for (var key in object) {
    if (object[key] !== undefined) {
      filteredObject[key] = object[key];
    }
  }
  return filteredObject;
}

var objectConstructor = {}.constructor;
function isObject(object) {
  return object !== undefined && object !== null && object.constructor === objectConstructor;
}

/**
 * Tells if a cell in sheet data is a simple value like `1` or "abc"
 * or if it's a fully-specified object like `{ value: "abc", type: String, ... }`.
 * https://gitlab.com/catamphetamine/write-excel-file/-/issues/107
 * @returns {boolean}
 */
function isCellObject(cell) {
  // (cell: Cell): value is CellObject {
  return isObject(cell);
}

function _typeof$4(o) { "@babel/helpers - typeof"; return _typeof$4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$4(o); }
function ownKeys$4(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$4(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$4(Object(t), true).forEach(function (r) { _defineProperty$4(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$4(e, r, t) { return (r = _toPropertyKey$4(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$4(t) { var i = _toPrimitive$4(t, "string"); return "symbol" == _typeof$4(i) ? i : i + ""; }
function _toPrimitive$4(t, r) { if ("object" != _typeof$4(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$4(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelperLoose$8(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$9(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$9(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$9(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$9(r, a) : void 0; } }
function _arrayLikeToArray$9(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function generateRow(tag, row, index, parameters) {
  // Calculate row height.
  var rowHeight;
  for (var _iterator = _createForOfIteratorHelperLoose$8(row), _step; !(_step = _iterator()).done;) {
    var cell = _step.value;
    if (isCellObject(cell)) {
      if (cell.height) {
        if (rowHeight === undefined || rowHeight < cell.height) {
          rowHeight = cell.height;
        }
      }
    }
  }

  // Generate `<r/>` element inner XML.
  var rowIndex = index;
  var rowCellsXml = row.map(function (cell, index) {
    return getCellXml(tag, cell, index, rowIndex, parameters);
  }).join('');
  var rowAttributes = {
    r: index + 1
  };
  if (rowHeight) {
    rowAttributes.ht = rowHeight;
    rowAttributes.customHeight = 1;
  }
  return tag('row', rowAttributes, rowCellsXml, index);
}
function getCellXml(tag, cell, index, rowIndex, _ref) {
  var findOrCreateCellStyle = _ref.findOrCreateCellStyle,
    findOrCreateSharedString = _ref.findOrCreateSharedString,
    hasDefaultFont = _ref.hasDefaultFont,
    dateFormat = _ref.dateFormat;
  if (cell === undefined || cell === null) {
    return '';
  }
  var cellObject = isCellObject(cell) ? cell : {
    value: cell
  };
  var cellStyleProperties = getCellStyleProperties(cellObject);
  var type = cellObject.type,
    value = cellObject.value,
    format = cellObject.format;
  if (isEmpty(value)) {
    value = null;
  } else {
    // Get cell value type.
    if (type === undefined) {
      type = detectValueType(value);
      if (type === undefined) {
        // The default cell value type is `String`.
        type = String;
        value = String(value);
      }
    }
  }

  // Validate `format` property.
  if (format) {
    if (type !== Date && type !== Number && type !== String && type !== 'Formula') {
      throw new Error("`format` \"".concat(format, "\" was specified on a cell of type `").concat(type, "`. `format` could only be specified on a cell of type `Date`, `Number`, `String` or `\"Formula\"`."));
    }
    if (type === String && format !== '@') {
      throw new Error("`format` \"".concat(format, "\" was specified on a cell of type `String`. The only supported `format` for a cell of type `String` is \"@\"."));
    }
  } else {
    if (type === Date) {
      format = dateFormat;
    }
  }
  var hasFormat = Boolean(format);
  var hasCellStyle = Boolean(cellStyleProperties);
  var cellStyleId;
  if (hasDefaultFont || hasFormat || hasCellStyle) {
    cellStyleId = findOrCreateCellStyle(_objectSpread$4({
      format: format
    }, cellStyleProperties));
  }
  return generateCell(tag, {
    value: value,
    type: type,
    cellStyleId: cellStyleId,
    findOrCreateSharedString: findOrCreateSharedString
  }, index, rowIndex);
}
function isEmpty(value) {
  return value === undefined || value === null || value === '';
}
function detectValueType(value) {
  switch (_typeof$4(value)) {
    case 'string':
      return String;
    case 'number':
      return Number;
    case 'boolean':
      return Boolean;
    default:
      if (value instanceof Date) {
        return Date;
      }
  }
}

function generateSheetData(tag, sheetData, parameters) {
  var sheetDataXml = sheetData.map(function (row, index) {
    return generateRow(tag, row, index, parameters);
  }).join('');
  return tag('sheetData', null, sheetDataXml);
}

// Supports "merging cells" across columns and rows.
// https://rdrr.io/cran/openxlsx/man/mergeCells.html
//
// Returned result example for merged cells range "A2:C3":
// { mergedCells: [ [0, 1], [2, 2] ] }
//
// Data example:
//
// rows:
// [
//   [...],
//   [
//     { type: String, value: 'abc', columnSpan: 3, rowSpan: 2 },
//     { ... },
//     { ... }
//   ],
//   [...]
// ]

function processMergedCells(sheetData, features) {
  var mergedCells = [];
  var _cloneSheetData = function cloneSheetData() {
    // The code will apply the style from the originating "merged" cells
    // to their adjacent `null` cells, so clone `sheetData` to prevent mutating it.
    sheetData = sheetData.slice();
    // Also clone each row of `sheetData`.
    var i = 0;
    while (i < sheetData.length) {
      sheetData[i] = sheetData[i].slice();
      i++;
    }
    // `sheetData` has been cloned. No need to clone it again.
    _cloneSheetData = function cloneSheetData() {
      return sheetData;
    };
    // Return the cloned `sheetData`.
    return sheetData;
  };
  var rowIndex = 0;
  while (rowIndex < sheetData.length) {
    var row = sheetData[rowIndex];
    var columnIndex = 0;
    while (columnIndex < row.length) {
      var cell = row[columnIndex];
      if (cell) {
        var _cell$rowSpan = cell.rowSpan,
          rowSpan = _cell$rowSpan === void 0 ? 1 : _cell$rowSpan;

        // `cell.span` property was renamed to `cell.columnSpan`.
        var columnSpan = typeof cell.span === 'number' ? cell.span : cell.columnSpan;
        if (typeof columnSpan !== 'number') {
          columnSpan = 1;
        }
        if (columnSpan > 1 || rowSpan > 1) {
          // Validate that `columnSpan`-ning or `rowSpan`-ning cells only overlap
          // `null` or `undefined` ones. Especially that `columnSpan`-ning or `rowSpan`-ning cells
          // don't overlap other `columnSpan`-ning or `rowSpan`-ning cells.
          processSpanningCells(sheetData, rowIndex, columnIndex, columnSpan, rowSpan, _cloneSheetData);

          // Add "merged cells" entry:
          // `[ [fromRowIndex, fromColumnIndex], [toRowIndex, toColumnIndex] ]`.
          mergedCells.push([[rowIndex, columnIndex], [rowIndex + (rowSpan ? rowSpan - 1 : 0), columnIndex + (columnSpan ? columnSpan - 1 : 0)]]);
        }
      }
      columnIndex++;
    }
    rowIndex++;
  }
  return {
    sheetData: sheetData,
    mergedCells: mergedCells
  };
}

// Validate that a `columnSpan`-ning / `rowSpan`-ning cell doesn't overlap
// with other cells, especially `columnSpan`-ning / `rowSpan`-ning ones,
// because those ones would make MS Office 2007 Excel say:
// "Excel found unreadable content in 'file.xlsx'.
//  Do you want to recover the contents of this workbook?
//  If you trust the source of this workbook, click Yes".
function processSpanningCells(sheetData, rowIndex, columnIndex, columnSpan, rowSpan, cloneSheetData, features) {
  var cellStyleProperties = getCellStyleProperties(sheetData[rowIndex][columnIndex]);
  if (cellStyleProperties) {
    sheetData = cloneSheetData();
  }
  var i = rowIndex;
  while (i <= rowIndex + (rowSpan - 1)) {
    var j = columnIndex;
    while (j <= columnIndex + (columnSpan - 1)) {
      var cell = sheetData[i][j];
      if (i > rowIndex || j > columnIndex) {
        // Validate that all hidden cells are `null` or `undefined`.
        if (cell !== null && cell !== undefined) {
          throw new Error("[write-excel-file] When using `columnSpan` or `rowSpan` parameters, all hidden overlapped cells should be represented by `null`s or `undefined`s. Cell at row ".concat(rowIndex + 1, " and column ").concat(columnIndex + 1, " is configured with `columnSpan` ").concat(columnSpan, " and `rowSpan` ").concat(rowSpan, ". Cell at row ").concat(i + 1, " and column ").concat(j + 1, " is neither `null` nor `undefined`: ").concat(JSON.stringify(cell)));
        }
        // Apply the style from the original cell to this `null` cell.
        // https://gitlab.com/catamphetamine/write-excel-file/-/issues/43
        if (cellStyleProperties) {
          sheetData[i][j] = cellStyleProperties;
        }
      }
      j++;
    }
    i++;
  }
}

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray$8(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$8(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$8(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$8(r, a) : void 0; } }
function _arrayLikeToArray$8(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = true, o = false; try { if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = true, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }

// Supports "merging cells" across columns and rows.
// https://rdrr.io/cran/openxlsx/man/mergeCells.html
//
// Returned XML example for merged cells range "A2:C3":
// `<sheetData>...</sheetData><mergeCells count="1"><mergeCell ref="A2:C3"/></mergeCells>`
//
// Data example:
//
// rows:
// [
//   [...],
//   [
//     { type: String, value: 'abc', columnSpan: 3, rowSpan: 2 },
//     { ... },
//     { ... }
//   ],
//   [...]
// ]

function generateMergedCellsDescription(tag, mergedCells) {
  if (mergedCells.length === 0) {
    return '';
  }
  var mergeCellsXml = mergedCells.map(function (_ref, index) {
    var _ref2 = _slicedToArray(_ref, 2),
      from = _ref2[0],
      to = _ref2[1];
    var ref = getCellAddress(from[0], from[1]) + ':' + getCellAddress(to[0], to[1]);
    return tag('mergeCell', {
      ref: ref
    }, null, index);
  }).join('');
  return tag('mergeCells', {
    count: mergedCells.length
  }, mergeCellsXml);
}

function generatePageMargins(tag, _ref) {
  var orientation = _ref.orientation;
  // Margins are required when setting custom orientation,
  // otherwise they'd be `0`.
  // https://gitlab.com/catamphetamine/write-excel-file/-/issues/7#note_782347297
  if (orientation) {
    // Page margins (when printing).
    // https://github.com/randym/axlsx/blob/master/lib/axlsx/workbook/worksheet/page_margins.rb

    var marginLeft = 0.7; // The left margin in inches.
    var marginRight = 0.7; // The right margin in inches.
    var marginTop = 0.75; // The top margin in inches.
    var marginBottom = 0.75; // The bottom margin in inches.
    var header = 0.3; // The header margin in inches.
    var footer = 0.3; // The footer margin in inches.

    return tag('pageMargins', {
      left: marginLeft,
      right: marginRight,
      top: marginTop,
      bottom: marginBottom,
      header: header,
      footer: footer
    });
  }
  return '';
}

function generatePageSetup(tag, _ref) {
  var orientation = _ref.orientation;
  // Allows setting "landscape" orientation.
  // https://gitlab.com/catamphetamine/write-excel-file/-/issues/7
  if (orientation) {
    // Paper size (when printing).
    // https://github.com/randym/axlsx/blob/master/lib/axlsx/workbook/worksheet/page_setup.rb
    //
    // `paperSize` `9` means "A4 paper (210 mm by 297 mm)".
    //
    var paperSize = 9;

    // Page orientation (when printing).
    //
    // `orientation` can be:
    // * `landscape`
    // * `portrait`
    // https://docs.microsoft.com/en-us/office/vba/api/excel.pagesetup.orientation

    return tag('pageSetup', {
      paperSize: paperSize,
      orientation: sanitizeAttributeValue(orientation)
    });
  }
  return '';
}

function generateDrawingReference(tag) {
  // Each sheet has at most one "drawing", so the drawing ID is always `1`.
  // Here it always creates a drawing, even if it's going to be empty.
  // Such behavior is more convenient for "features" (plugins)
  // that might rely on a drawing to already exist.
  // For example, images "feature" uses this drawing.
  return tag('drawing', {
    'r:id': 'rId-drawing-1'
  });
}

function generateSheetXml(sheetXmlParameters, features) {
  var sheetData_ = sheetXmlParameters.sheetData,
    sheetOptions = sheetXmlParameters.sheetOptions,
    sheetIndex = sheetXmlParameters.sheetIndex,
    sheetId = sheetXmlParameters.sheetId,
    hasDefaultFont = sheetXmlParameters.hasDefaultFont,
    findOrCreateCellStyle = sheetXmlParameters.findOrCreateCellStyle,
    findOrCreateSharedString = sheetXmlParameters.findOrCreateSharedString;
  var columns = sheetOptions.columns,
    dateFormat = sheetOptions.dateFormat,
    orientation = sheetOptions.orientation,
    showGridLines = sheetOptions.showGridLines,
    rightToLeft = sheetOptions.rightToLeft,
    zoomScale = sheetOptions.zoomScale;
  var _processMergedCells = processMergedCells(sheetData_),
    sheetData = _processMergedCells.sheetData,
    mergedCells = _processMergedCells.mergedCells;

  // A parameter that will be used inside the `tag()` function below.
  var tagFunctionProperties = {
    sheetIndex: sheetIndex,
    sheetId: sheetId
  };

  /**
   * Creates XML tag markup.
   * @param {string} tagName
   * @param {object} attributes
   * @param {string} [innerXml]
   * @param {number} [index]
   * @returns {string}
   */
  var tag = function tag(tagName, attributes, innerXml, index) {
    return getElementXml('xl/worksheets/sheet{id}.xml', tagName, attributes, innerXml, index, tagFunctionProperties, sheetOptions, features);
  };
  var xml = '<?xml version="1.0" ?>' + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">' +
  // The order of elements is dictated by the XLSX spec.
  //
  // `<sheetViews/>`
  generateSheetViews(tag, {
    showGridLines: showGridLines,
    rightToLeft: rightToLeft,
    zoomScale: zoomScale
  }, sheetIndex) +
  // `<cols/>`
  generateColumnsDescription(tag, columns) +
  // `<sheetData/>`
  generateSheetData(tag, sheetData, {
    findOrCreateCellStyle: findOrCreateCellStyle,
    findOrCreateSharedString: findOrCreateSharedString,
    hasDefaultFont: hasDefaultFont,
    dateFormat: dateFormat}) +
  // `<mergeCells/>`
  generateMergedCellsDescription(tag, mergedCells) +
  // `<pageMargins/>`
  generatePageMargins(tag, {
    orientation: orientation
  }) +
  // `<pageSetup/>`
  generatePageSetup(tag, {
    orientation: orientation
  }) +
  // `<drawing/>`
  generateDrawingReference(tag) +
  // Apply any plugins that insert additional content to this XML.
  getAdditionalContent('xl/worksheets/sheet{id}.xml', features, sheetOptions, {
    sheetIndex: sheetIndex,
    sheetId: sheetId
  }) + '</worksheet>';

  // Apply any plugins that transform this XML.
  xml = transformContent(xml, 'xl/worksheets/sheet{id}.xml', features, sheetOptions, {
    sheetIndex: sheetIndex,
    sheetId: sheetId
  });
  return xml;
}

function generateSheetXmlRels(_ref) {
  var sheetIndex = _ref.sheetIndex,
    sheetId = _ref.sheetId,
    sheetOptions = _ref.sheetOptions,
    features = _ref.features;
  var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  // Each sheet has at most one "drawing", so a globally-unique drawing ID is assumed to be the sheet ID.
  getDrawingRelationshipXml(sheetId) +
  // Apply any plugins that insert additional content to this XML.
  getAdditionalContent('xl/worksheets/_rels/sheet{id}.xml.rels', features, sheetOptions, {
    sheetIndex: sheetIndex,
    sheetId: sheetId
  }) + '</Relationships>';

  // Apply any plugins that transform this XML.
  xml = transformContent(xml, 'xl/worksheets/_rels/sheet{id}.xml.rels', features, sheetOptions, {
    sheetIndex: sheetIndex,
    sheetId: sheetId
  });
  return xml;
}
function getDrawingRelationshipXml(sheetId) {
  return "<Relationship Id=\"rId-drawing-1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing\" Target=\"../drawings/drawing".concat(sheetId, ".xml\"/>");
}

function _createForOfIteratorHelperLoose$7(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$7(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$7(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$7(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$7(r, a) : void 0; } }
function _arrayLikeToArray$7(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function generateSharedStringsXml(sharedStrings) {
  var xml = '<?xml version="1.0"?>';
  xml += '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
  for (var _iterator = _createForOfIteratorHelperLoose$7(sharedStrings), _step; !(_step = _iterator()).done;) {
    var string = _step.value;
    var attributes = string.trim().length === string.length ? '' : ' xml:space="preserve"';
    xml += "<si><t".concat(attributes, ">");
    xml += sanitizeTextContent(string);
    xml += '</t></si>';
  }
  xml += '</sst>';
  return xml;
}

function getXlsxColorForHexColor(color) {
  if (color[0] !== '#') {
    throw new Error("Color \"".concat(color, "\" must start with a \"#\""));
  }
  return "FF".concat(color.slice('#'.length).toUpperCase());
}

function getFillXml(fill) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    conditionalFormatting = _ref.conditionalFormatting;
  var backgroundColor = fill.backgroundColor,
    fillPatternStyle = fill.fillPatternStyle,
    fillPatternColor = fill.fillPatternColor;
  var isSolidFill = !fillPatternStyle || fillPatternStyle === 'solid';
  if (!hasFill(fill)) {
    return '<fill>' + '<patternFill patternType="none"/>' + '</fill>';
  }
  var xml = '<fill>';

  // In XLSX, a background could be one of two types:
  //
  // * Some background color
  //   * `<patternFill patternType="solid"/>`
  //   * `<fgColor rgb="..."/>` — extremely weirdly, "background color" is specified as "foreground color" in XLSX standard.
  //   * `<bgColor indexed="64"/>` — just ignore this extremely weird mandatory element in XLSX standard.
  // * Some background color + Some pattern over it
  //   * `<patternFill patternType="...something-other-than-solid..."/>`
  //   * `<fgColor rgb="..."/>` — Pattern color
  //   * `<bgColor rgb="..."/>` — Background color
  //
  // As weird as it is, it gets more weird when it comes to "conditional formatting":
  // for some weird reason, it doesn't work same way in case of "conditional formatting".
  // Specifically, `<bgColor indexed="64"/>` should not be used and instead it should specify
  // `<bgColor rgb="..."/>` same as `<fgColor rgb="..."/>`.

  xml += "<patternFill patternType=\"".concat(isSolidFill ? 'solid' : fillPatternStyle, "\">");
  xml += "<fgColor rgb=\"".concat(sanitizeAttributeValue(getXlsxColorForHexColor(isSolidFill ? backgroundColor : fillPatternColor)), "\"/>");
  xml += "<bgColor ".concat(isSolidFill && !conditionalFormatting ? 'indexed="64"' : 'rgb="' + sanitizeAttributeValue(getXlsxColorForHexColor(backgroundColor)) + '"', "/>");
  xml += '</patternFill>';

  // Close the `<fill>` element.
  xml += '</fill>';

  // Return the XML.
  return xml;
}

function getBorderXml(_ref) {
  var borderColor = _ref.borderColor,
    borderStyle = _ref.borderStyle,
    leftBorderColor = _ref.leftBorderColor,
    leftBorderStyle = _ref.leftBorderStyle,
    rightBorderColor = _ref.rightBorderColor,
    rightBorderStyle = _ref.rightBorderStyle,
    topBorderColor = _ref.topBorderColor,
    topBorderStyle = _ref.topBorderStyle,
    bottomBorderColor = _ref.bottomBorderColor,
    bottomBorderStyle = _ref.bottomBorderStyle;
  var left = {
    style: leftBorderStyle || borderStyle,
    color: leftBorderColor || borderColor
  };
  var right = {
    style: rightBorderStyle || borderStyle,
    color: rightBorderColor || borderColor
  };
  var top = {
    style: topBorderStyle || borderStyle,
    color: topBorderColor || borderColor
  };
  var bottom = {
    style: bottomBorderStyle || borderStyle,
    color: bottomBorderColor || borderColor
  };
  var xml = '<border>';
  xml += getSideBorderXml('left', left);
  xml += getSideBorderXml('right', right);
  xml += getSideBorderXml('top', top);
  xml += getSideBorderXml('bottom', bottom);
  xml += '<diagonal/>';
  xml += '</border>';
  return xml;
}
function getSideBorderXml(side, _ref2) {
  var style = _ref2.style,
    color = _ref2.color;
  if (color && !style) {
    style = 'thin';
  }
  var hasChildren = Boolean(color);
  return "<".concat(side) + (style ? " style=\"".concat(sanitizeAttributeValue(style), "\"") : '') + (hasChildren ? '>' : '/>') + (color ? "<color rgb=\"".concat(sanitizeAttributeValue(getXlsxColorForHexColor(color)), "\"/>") : '') + (hasChildren ? "</".concat(side, ">") : '');
}

function getFontXml(font) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _ref.isDefaultGenericFont;
  var fontFamily = font.fontFamily,
    fontSize = font.fontSize,
    fontWeight = font.fontWeight,
    fontStyle = font.fontStyle,
    textDecoration = font.textDecoration,
    textColor = font.textColor;
  var xml = '<font>';

  // Apply `fontFamily`
  if (fontFamily) {
    // `<name/>` element specifies the actual typeface name, such as "Calibri" or "Arial".
    xml += "<name val=\"".concat(sanitizeAttributeValue(fontFamily), "\"/>");
  }

  // Apply `fontSize`
  if (typeof fontSize === 'number') {
    xml += "<sz val=\"".concat(fontSize, "\"/>");
  }

  // `<family/>` element specifies a generic font family classification, which is used
  // by the application's font substitution logic if the exact font name is unavailable.
  // The `val` attribute uses a numerical value corresponding to a generic family:
  // 0: Automatic
  // 1: Roman (serif typefaces, like Times New Roman)
  // 2: Swiss (sans-serif typefaces, like Arial or Calibri)
  // 3: Modern (typefaces with a consistent stroke width, often monospaced)
  // 4: Script (handwriting or calligraphy style)
  // 5: Decorative (display typefaces)
  xml += '<family val="2"/>';

  // When no custom font family or size are specified,
  // it uses a default generic font.
  if (!(fontFamily || typeof fontSize === 'number')) {
    // Specifies that a font belongs to the theme's "minor" (body) category,
    // mapping it to the default paragraph/body font. It enables automatic font updates
    //  when changing themes, separating it from "major" (heading) fonts.
    xml += '<scheme val="minor"/>';
  }

  // Apply `fontWeight`
  if (fontWeight === 'bold') {
    xml += '<b/>';
  }

  // Apply `fontStyle`
  if (fontStyle === 'italic') {
    xml += '<i/>';
  }

  // Apply `textDecoration`
  if (textDecoration) {
    if (textDecoration.strikethrough) {
      xml += '<strike/>';
    }
    if (textDecoration.underline) {
      xml += '<u/>';
    } else if (textDecoration.doubleUnderline) {
      xml += '<u val="double"/>';
    }
  }

  // Sidenote: "subscript" and "superscript" text styles
  // don't seem to work with "conditional formatting" feature.
  //
  // if (... === 'subscript') {
  // 	xml += '<vertAlign val="subscript"/>'
  // } else if (... === 'superscript') {
  // 	xml += '<vertAlign val="superscript"/>'
  // }

  // Apply `textColor`
  if (textColor) {
    xml += "<color rgb=\"".concat(sanitizeAttributeValue(getXlsxColorForHexColor(textColor)), "\"/>");
  } else {
    // In XLSX files, `theme="1"` for font color typically refers to the first color
    // in the document's theme palette, which is usually "light-1" (white or very light grey)
    // or "dark-1" (black or very dark grey) depending on the background theme,
    // designed to contrast with the default background color.
    //
    // It is part of the XML structure in XLSX files that defines theme-based colors
    // rather than hardcoded RGB values, allowing for dynamic updates when changing themes in Excel.
    //
    // It is generally used to define the primary text color (e.g., black on white) for default styling.
    //
    xml += '<color theme="1"/>';
  }
  xml += '</font>';
  return xml;
}

function getAlignmentXml(_ref) {
  var align = _ref.align,
    alignVertical = _ref.alignVertical,
    textRotation = _ref.textRotation,
    indent = _ref.indent,
    wrap = _ref.wrap;
  return '<alignment' + (align ? " horizontal=\"".concat(sanitizeAttributeValue(align), "\"") : '') + (alignVertical ? " vertical=\"".concat(sanitizeAttributeValue(alignVertical), "\"") : '') + (textRotation ? " textRotation=\"".concat(getTextRotation(validateTextRotation(textRotation)), "\"") : '') + (indent ? " indent=\"".concat(sanitizeAttributeValue(String(indent)), "\"") : '') + (wrap ? " wrapText=\"1\"" : '') + '/>';
}

// Validates text rotation parameter value.
// Text rotation parameter value could be from -90 to 90.
// Positive values rotate the text counterclockwise, and negative values rotate the text clockwise.
//
// The spec-compliant `textRotation` parameter value is weird.
// See `getTextRotation()` function comments.
//
// I've searched the internet on how other libraries expect text rotation parameter to look like.
// The consensus seems to be "-90...90" so that it's not as weird as the official spec defines it.
//
// In ClosedXML .NET library, it allows the values from -90 to 90:
// https://docs.closedxml.io/en/latest/features/cell-format.html#orientation
//
// In XlsxWriter Python library, it's -90 to 90 with 270 as a special magic value:
// https://xlsxwriter.readthedocs.io/format.html#format-set-rotation
//
// In Apache POI, it's also -90 to 90 and 255 as a special magic value:
// https://copyprogramming.com/howto/how-to-rotate-text-in-a-spreadsheet-cell-using-apache-poi
//
// "Specify the angle of rotation for the text within the cell.
//  The degree of rotation can range between -90 and 90 degrees, or it can be set to 0xff for vertical alignment."
//
// So -90 to 90 seems like a common-practice value range.
//
function validateTextRotation(textRotation) {
  if (!(textRotation >= -90 && textRotation <= 90)) {
    throw new Error("Unsupported text rotation angle: ".concat(textRotation, ". Values from -90 to 90 are supported."));
  }
  return textRotation;
}

// Transforms `textRotation` parameter value to the spec-compliant form.
//
// The XLSX specification for the value of `textRotation` is weird:
// https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.alignment?view=openxml-2.8.1
//
// "Text rotation in cells. Expressed in degrees. Values range from 0 to 180.
//  The first letter of the text is considered the center-point of the arc.
//  For 0 - 90, the value represents degrees above horizon.
//  For 91-180 the degrees below the horizon is calculated as:
//  [degrees below horizon] = 90 - textRotation"
//
function getTextRotation(textRotation) {
  if (textRotation < 0) {
    return 90 - textRotation;
  }
  return textRotation;
}

function _typeof$3(o) { "@babel/helpers - typeof"; return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$3(o); }
function ownKeys$3(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$3(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$3(Object(t), true).forEach(function (r) { _defineProperty$3(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$3(e, r, t) { return (r = _toPropertyKey$3(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$3(t) { var i = _toPrimitive$3(t, "string"); return "symbol" == _typeof$3(i) ? i : i + ""; }
function _toPrimitive$3(t, r) { if ("object" != _typeof$3(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$3(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

// There seem to be about 100 "built-in" formats in Excel.
// https://docs.microsoft.com/en-us/previous-versions/office/developer/office-2010/ee857658(v=office.14)?redirectedfrom=MSDN
var FORMAT_ID_STARTS_FROM = 100;
function initializeStyles(defaultFont) {
  var formats = [];
  var formatIdByFormat = {};
  var styles = [];
  var stylesIndex = {};
  var fonts = [];
  var fontIdByFontKey = {};
  var fills = [];
  var fillIdByFillKey = {};
  var borders = [];
  var borderIdByBorderKey = {};

  // Add default font.
  var defaultFontId = fonts.length;
  fontIdByFontKey[getKey(defaultFont)] = defaultFontId;
  fonts.push(defaultFont || {});

  // // If any of the sheets have a default font that is different from the generic one,
  // // add those fonts to the collection.
  // const sheetsDefaultFontIds = sheetsDefaultFonts.map((font) => {
  //   if (font) {
  //     const fontKey = getKey(font)
  //     if (fontIdByFontKey[fontKey] !== undefined) {
  //       return fontIdByFontKey[fontKey]
  //     }
  //     const fontId = fonts.length
  //     fontIdByFontKey[fontKey] = fontId
  //     fonts.push(font)
  //     return fontId
  //   } else {
  //     return defaultFontId
  //   }
  // })

  // Default fill (no color).
  var defaultFill = {};
  fillIdByFillKey[getKey(defaultFill)] = fills.length;
  fills.push(defaultFill);

  // Default border.
  var defaultBorder = {};
  borderIdByBorderKey[getKey(defaultBorder)] = borders.length;
  borders.push(defaultBorder);

  // Always add a mandatory "gray125" fill.
  // For some weird reason, MS Office 2007 Excel seems to require this type of `<fill>`
  // to always be present in an `*.xslx` document.
  // Otherwise, if this `<fill>` is absent in the document, it would forcefully overwrite
  // the first custom `backgroundColor` with a "gray125" fill.
  var gray125Fill = {
    gray125: true
  };
  fills.push(gray125Fill);

  // Returns a style ID number.
  // Adds a new style if it doesn't exist yet.
  // If it already exists, just reuses the existing one.
  function findOrCreateCellStyle(cellStyle) {
    var format = cellStyle.format,
      align = cellStyle.align,
      alignVertical = cellStyle.alignVertical,
      textRotation = cellStyle.textRotation,
      indent = cellStyle.indent,
      wrap = cellStyle.wrap,
      fontFamily = cellStyle.fontFamily,
      fontSize = cellStyle.fontSize,
      fontWeight = cellStyle.fontWeight,
      fontStyle = cellStyle.fontStyle,
      textDecoration = cellStyle.textDecoration,
      textColor = cellStyle.textColor,
      backgroundColor = cellStyle.backgroundColor,
      fillPatternStyle = cellStyle.fillPatternStyle,
      fillPatternColor = cellStyle.fillPatternColor,
      borderColor = cellStyle.borderColor,
      borderStyle = cellStyle.borderStyle,
      leftBorderColor = cellStyle.leftBorderColor,
      leftBorderStyle = cellStyle.leftBorderStyle,
      rightBorderColor = cellStyle.rightBorderColor,
      rightBorderStyle = cellStyle.rightBorderStyle,
      topBorderColor = cellStyle.topBorderColor,
      topBorderStyle = cellStyle.topBorderStyle,
      bottomBorderColor = cellStyle.bottomBorderColor,
      bottomBorderStyle = cellStyle.bottomBorderStyle;

    // const defaultFont = sheetsDefaultFonts[sheetIndex]
    // const defaultFontId = sheetsDefaultFontIds[sheetIndex]

    var font = {
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      textDecoration: textDecoration,
      textColor: textColor
    };
    var fill = {
      backgroundColor: backgroundColor,
      fillPatternStyle: fillPatternStyle,
      fillPatternColor: fillPatternColor
    };
    var border = {
      borderColor: borderColor,
      borderStyle: borderStyle,
      leftBorderColor: leftBorderColor,
      leftBorderStyle: leftBorderStyle,
      rightBorderColor: rightBorderColor,
      rightBorderStyle: rightBorderStyle,
      topBorderColor: topBorderColor,
      topBorderStyle: topBorderStyle,
      bottomBorderColor: bottomBorderColor,
      bottomBorderStyle: bottomBorderStyle
    };
    var alignment = {
      align: align,
      alignVertical: alignVertical,
      textRotation: textRotation,
      indent: indent,
      wrap: wrap
    };
    var formatKey = getKey(format);
    var fontKey = getKey(font);
    var fillKey = getKey(fill);
    var borderKey = getKey(border);
    // const alignmentKey = getKey(alignment)

    var styleKey = getKey(cellStyle);

    // Returns style ID.
    var addStyle = function addStyle() {
      // Get format ID.
      var formatId;
      if (format) {
        formatId = formatIdByFormat[formatKey];
        if (formatId === undefined) {
          formatId = FORMAT_ID_STARTS_FROM + formats.length;
          formatIdByFormat[formatKey] = formatId;
          formats.push(format);
        }
      }

      // Get font ID.
      var fontId;
      if (hasFont(font)) {
        fontId = fontIdByFontKey[fontKey];
        if (fontId === undefined) {
          fontId = fonts.length;
          fontIdByFontKey[fontKey] = fontId;
          fonts.push(_objectSpread$3(_objectSpread$3({}, font), {}, {
            fontSize: font.fontSize || defaultFont && defaultFont.fontSize,
            fontFamily: font.fontFamily || defaultFont && defaultFont.fontFamily
          }));
        }
      } else if (defaultFont) {
        fontId = defaultFontId;
      }

      // Get fill ID.
      var fillId;
      if (hasFill(fill)) {
        fillId = fillIdByFillKey[fillKey];
        if (fillId === undefined) {
          fillId = fills.length;
          fillIdByFillKey[fillKey] = fillId;
          fills.push({
            backgroundColor: backgroundColor,
            fillPatternStyle: fillPatternStyle,
            fillPatternColor: fillPatternColor
          });
        }
      }

      // Get border ID.
      var borderId;
      if (hasBorder(border)) {
        borderId = borderIdByBorderKey[borderKey];
        if (borderId === undefined) {
          borderId = borders.length;
          borderIdByBorderKey[borderKey] = borderId;
          borders.push(border);
        }
      }
      var styleId = styles.length;
      stylesIndex[styleKey] = styleId;

      // Add a style.
      styles.push({
        formatId: formatId,
        fontId: fontId,
        fillId: fillId,
        borderId: borderId,
        alignment: alignment
      });
      return styleId;
    };

    // Look for an existing style.
    if (stylesIndex[styleKey] !== undefined) {
      return stylesIndex[styleKey];
    }

    // Create new style if doesn't exist.
    return addStyle();
  }

  // Add default style.
  // It will be used for any cell that doesn't specify any custom style properties.
  findOrCreateCellStyle({});
  return {
    getCellStyles: function getCellStyles() {
      return {
        formats: formats,
        styles: styles,
        fonts: fonts,
        fills: fills,
        borders: borders
      };
    },
    findOrCreateCellStyle: findOrCreateCellStyle
  };
}
function getKey(object) {
  return JSON.stringify(object);
}

function _createForOfIteratorHelperLoose$6(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$6(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$6(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$6(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$6(r, a) : void 0; } }
function _arrayLikeToArray$6(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function generateStylesXml(cellStyles, sheetsOptions, features) {
  var formats = cellStyles.formats,
    styles = cellStyles.styles,
    fonts = cellStyles.fonts,
    fills = cellStyles.fills,
    borders = cellStyles.borders;
  var xml = '<?xml version="1.0" ?>';
  xml += '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';

  // Turns out, as weird as it sounds, the order of XML elements matters to MS Office Excel.
  // https://social.msdn.microsoft.com/Forums/office/en-US/cc47ab65-dab7-4e32-b676-b641aa1e1411/how-to-validate-the-xlsx-that-i-generate?forum=oxmlsdk
  // For example, previously this library was inserting `<cellXfs/>` before `<fonts/>`
  // and that caused MS Office 2007 Excel to throw an error about the file being corrupt:
  // "Excel found unreadable content in '*.xlsx'. Do you want to recover the contents of this workbook?"
  // "Excel was able to open the file by repairing or removing the unreadable content."
  // "Removed Part: /xl/styles.xml part with XML error.  (Styles) Load error. Line 1, column ..."
  // "Repaired Records: Cell information from /xl/worksheets/sheet1.xml part"

  if (formats.length > 0) {
    xml += "<numFmts count=\"".concat(formats.length, "\">");
    for (var i = 0; i < formats.length; i++) {
      xml += "<numFmt numFmtId=\"".concat(FORMAT_ID_STARTS_FROM + i, "\" formatCode=\"").concat(sanitizeAttributeValue(formats[i]), "\"/>");
    }
    xml += "</numFmts>";
  }
  xml += "<fonts count=\"".concat(fonts.length, "\">");
  for (var _iterator = _createForOfIteratorHelperLoose$6(fonts), _step; !(_step = _iterator()).done;) {
    var font = _step.value;
    xml += getFontXml(font);
  }
  xml += '</fonts>';

  // MS Office 2007 Excel seems to require a `<fills/>` element to always exist.
  // without it, MS Office 2007 Excel thinks that the file is broken.
  xml += "<fills count=\"".concat(fills.length, "\">");
  for (var _iterator2 = _createForOfIteratorHelperLoose$6(fills), _step2; !(_step2 = _iterator2()).done;) {
    var fill = _step2.value;
    if (fill.gray125) {
      // "gray125" fill.
      // For some weird reason, MS Office 2007 Excel seems to require "gray125" fill to be present in styles.
      // Otherwise, if it's absent, it would replace the first custom `<fill/>` with a "gray125" fill.
      xml += '<fill>';
      xml += '<patternFill patternType="gray125"/>';
      xml += '</fill>';
    } else {
      xml += getFillXml(fill);
    }
  }
  xml += '</fills>';

  // MS Office 2007 Excel seems to require a `<borders/>` element to exist:
  // without it, MS Office 2007 Excel thinks that the file is broken.
  xml += "<borders count=\"".concat(borders.length, "\">");
  for (var _iterator3 = _createForOfIteratorHelperLoose$6(borders), _step3; !(_step3 = _iterator3()).done;) {
    var border = _step3.value;
    xml += getBorderXml(border);
  }
  xml += '</borders>';

  // What are `<cellXfs/>` and `<cellStyleXfs/>`:
  // http://officeopenxml.com/SSstyles.php
  //
  // `<cellStyleXfs/>` are referenced from `<cellXfs/>` as `<xf xfId="..."/>`.
  // `<cellStyleXfs/>` defines abstract "cell styles" that can be "extended"
  // by "cell styles" defined by `<cellXfs/>` that can be applied to individual cells:
  // 1. `<cellStyleXfs><xf .../></cellStyleXfs>`
  // 2. `<cellXfs><xf xfId={cellStyleXfs.xf.index}/></cellXfs>`
  // 3. `<c s={cellXfs.xf.index}/>`
  // Seems like "cell styles" defined by `<cellXfs/>` have to reference
  // some abstract "cell styles" defined by `<cellStyleXfs/>` by the spec.
  // Otherwise, there would be no need to use `<cellStyleXfs/>` at all.
  // The naming is ambiguous and weird. The whole scheme is needlessly redundant.

  // xml += '<cellStyleXfs count="2">'
  // xml += '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>'
  // // `applyFont="1"` means apply a custom font in this "abstract" "cell style"
  // // rather than using a default font.
  // // Seems like by default `applyFont` is `"0"` meaning that,
  // // unless `"1"` is specified, it would ignore the `fontId` attribute.
  // xml += '<xf numFmtId="0" fontId="1" applyFont="1" fillId="0" borderId="0"/>'
  // xml += '</cellStyleXfs>'

  xml += "<cellXfs count=\"".concat(styles.length, "\">");
  for (var _iterator4 = _createForOfIteratorHelperLoose$6(styles), _step4; !(_step4 = _iterator4()).done;) {
    var cellStyle = _step4.value;
    var fontId = cellStyle.fontId,
      fillId = cellStyle.fillId,
      borderId = cellStyle.borderId,
      alignment = cellStyle.alignment,
      formatId = cellStyle.formatId;
    // `applyNumberFormat="1"` means "apply the `numFmtId` attribute".
    // Seems like by default `applyNumberFormat` is `"0"` meaning that,
    // unless `"1"` is specified, it would ignore the `numFmtId` attribute.
    xml += '<xf ' + [formatId === undefined ? undefined : "numFmtId=\"".concat(formatId, "\" applyNumberFormat=\"1\""), fontId === undefined ? undefined : "fontId=\"".concat(fontId, "\" applyFont=\"1\""), fillId === undefined ? undefined : "fillId=\"".concat(fillId, "\" applyFill=\"1\""), borderId === undefined ? undefined : "borderId=\"".concat(borderId, "\" applyBorder=\"1\""), hasAlignment(alignment) ? 'applyAlignment="1"' : undefined
    // 'xfId="0"'
    ].filter(function (_) {
      return _;
    }).join(' ') + '>' + (
    // Possible horizontal alignment values:
    //  left, center, right, fill, justify, center_across, distributed.
    // Possible vertical alignment values:
    //  top, vcenter, bottom, vjustify, vdistributed.
    // https://xlsxwriter.readthedocs.io/format.html#set_align
    hasAlignment(alignment) ? getAlignmentXml(alignment) : '') + '</xf>';
  }
  xml += "</cellXfs>";

  // Apply any plugins that insert additional content to this XML.
  xml += getAdditionalContent('xl/styles.xml', features, sheetsOptions);
  xml += '</styleSheet>';

  // Apply any plugins that transform this XML.
  xml = transformContent(xml, 'xl/styles.xml', features, sheetsOptions);
  return xml;
}

function _createForOfIteratorHelperLoose$5(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$5(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$5(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$5(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$5(r, a) : void 0; } }
function _arrayLikeToArray$5(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
const conditionalFormatting = {
  files: {
    transform: {
      'xl/worksheets/sheet{id}.xml': {
        // For some weird reason, Excel 2007 demands `<conditionalFormatting/>` element to go before `<drawing/>` element.
        // Because `<drawing/>` element is added before any of the `insert()`s of any features,
        // this feature has to use a `transform()` function instead of an `insert()` function.
        transform: function transform(xml, sheetOptions, _ref) {
          _ref.sheetIndex;
            _ref.sheetId;
          var conditionalFormatting = sheetOptions.conditionalFormatting;
          if (conditionalFormatting) {
            var conditionalFormattingRulesXml = getConditionalFormattingRulesXml(conditionalFormatting);
            return insertElementMarkupAccordingToOrderOfSiblings(xml, conditionalFormattingRulesXml, getOrderOfSiblings('xl/worksheets/sheet{id}.xml', 'worksheet'), 'worksheet');
          }
          return xml;
        }
      },
      'xl/styles.xml': {
        insert: function insert(sheetsOptions) {
          var sheetsConditionalFormatting = sheetsOptions.map(function (sheetOptions) {
            return sheetOptions.conditionalFormatting;
          });
          if (sheetsConditionalFormatting.some(Boolean)) {
            return getConditionalFormattingStylesXml(sheetsConditionalFormatting);
          }
        }
      }
    }
  }
};
function getConditionalFormattingRulesXml(conditionalFormattingRules) {
  var xml = '';
  var i = 0;
  for (var _iterator = _createForOfIteratorHelperLoose$5(conditionalFormattingRules), _step; !(_step = _iterator()).done;) {
    var conditionalFormattingRule = _step.value;
    var _conditionalFormattin = conditionalFormattingRule.cellRange,
      from = _conditionalFormattin.from,
      to = _conditionalFormattin.to,
      _conditionalFormattin2 = conditionalFormattingRule.condition,
      formula = _conditionalFormattin2.formula,
      operator = _conditionalFormattin2.operator,
      value = _conditionalFormattin2.value,
      value2 = _conditionalFormattin2.value2;

    // Cell range example: "A1:C5"
    var cellRange = getCellAddress(from.row - 1, from.column - 1) + ':' + getCellAddress(to.row - 1, to.column - 1);
    xml += "<conditionalFormatting sqref=\"".concat(cellRange, "\">");

    // The priority attribute in conditional formatting XML is an integer value that must be a positive integer between 1 and the total number of conditional formatting rules on the worksheet.
    // * The value is defined by the W3C XML Schema int datatype.
    // * The valid range is dynamic, starting from 1 (highest priority) and ending at the total number of rules on that specific worksheet (lowest priority).
    // * Each priority value must be unique for all rules on the same worksheet. Changing the priority of one rule will automatically adjust the priorities of other rules to maintain uniqueness and order.
    // * A lower numeric value indicates a higher priority (e.g., priority 1 is the highest possible priority).
    var priority = i + 1;

    // The `dxfId` attribute in ".xlsx" (OpenXML) files is a zero-based integer index (0, 1, 2, ...)
    // referencing a specific differential format record (`<dxf>`) within the "styles.xml" file.
    //
    var dxfId = conditionalFormattingRule._globalIndex;
    //
    // const dxfId = getConditionalFormattingRuleGlobalIndex({
    // 	conditionalFormattingRuleIndex: i,
    // 	sheetsConditionalFormatting,
    // 	sheetIndex
    // })

    // There're a lot of possible `type`s of a `<cfRule/>`.
    // The full list could be viewed by googling for "ST_CfType".

    if (formula) {
      xml += "<cfRule type=\"expression\" dxfId=\"".concat(dxfId, "\" priority=\"").concat(priority, "\">");
      xml += "<formula>".concat(sanitizeTextContent(formula), "</formula>");
      xml += '</cfRule>';
    } else if (operator) {
      xml += "<cfRule type=\"cellIs\" operator=\"".concat(getXlsxOperatorName(operator), "\" dxfId=\"").concat(dxfId, "\" priority=\"").concat(priority, "\">");
      xml += "<formula>".concat(sanitizeTextContent(formatValue(value)), "</formula>");
      if (getXlsxOperatorName(operator) === 'between') {
        xml += "<formula>".concat(sanitizeTextContent(formatValue(value2)), "</formula>");
      }
      xml += '</cfRule>';
    } else {
      throw new Error("Invalid conditional formatting rule:\n".concat(JSON.stringify(conditionalFormattingRule, null, 2)));
    }
    xml += '</conditionalFormatting>';
    i++;
  }
  return xml;
}
function formatValue(value) {
  if (typeof value === 'string') {
    return '"' + value + '"';
  }
  return String(value);
}

// function getConditionalFormattingRuleGlobalIndex({
// 	conditionalFormattingRuleIndex,
// 	sheetsConditionalFormattingRules,
// 	sheetIndex
// }) {
// 	let sheetRulesIndexOffset = 0
//
// 	let i = 0
// 	while (i < sheetIndex) {
// 		if (sheetsConditionalFormattingRules[i]) {
// 			sheetRulesIndexOffset += sheetsConditionalFormattingRules[i].length
// 		}
// 		i++
// 	}
//
// 	return sheetRulesIndexOffset + conditionalFormattingRuleIndex
// }

function getXlsxOperatorName(operator) {
  switch (operator) {
    case '<':
      return 'lessThan';
    case '>':
      return 'greaterThan';
    case '<=':
      return 'lessThanOrEqual';
    case '>=':
      return 'greaterThanOrEqual';
    case '=':
      return 'equal';
    case '!=':
      return 'notEqual';
    case '...':
      return 'between';
    default:
      throw new Error("Unknown conditional formatting operator: ".concat(operator));
  }
}
function getConditionalFormattingStylesXml(sheetsConditionalFormatting) {
  var totalConditionalFormattingRulesCount = 0;
  for (var _iterator2 = _createForOfIteratorHelperLoose$5(sheetsConditionalFormatting), _step2; !(_step2 = _iterator2()).done;) {
    var conditionalFormattingOfSheet = _step2.value;
    if (conditionalFormattingOfSheet) {
      totalConditionalFormattingRulesCount += conditionalFormattingOfSheet.length;
    }
  }
  var xml = '';
  xml += "<dxfs count=\"".concat(totalConditionalFormattingRulesCount, "\">");
  for (var _iterator3 = _createForOfIteratorHelperLoose$5(sheetsConditionalFormatting), _step3; !(_step3 = _iterator3()).done;) {
    var _conditionalFormattingOfSheet = _step3.value;
    if (_conditionalFormattingOfSheet) {
      for (var _iterator4 = _createForOfIteratorHelperLoose$5(_conditionalFormattingOfSheet), _step4; !(_step4 = _iterator4()).done;) {
        var conditionalFormattingRule = _step4.value;
        var _conditionalFormattin3 = conditionalFormattingRule.style,
          fontFamily = _conditionalFormattin3.fontFamily,
          fontSize = _conditionalFormattin3.fontSize,
          fontWeight = _conditionalFormattin3.fontWeight,
          fontStyle = _conditionalFormattin3.fontStyle,
          textDecoration = _conditionalFormattin3.textDecoration,
          textColor = _conditionalFormattin3.textColor,
          backgroundColor = _conditionalFormattin3.backgroundColor,
          fillPatternStyle = _conditionalFormattin3.fillPatternStyle,
          fillPatternColor = _conditionalFormattin3.fillPatternColor,
          borderColor = _conditionalFormattin3.borderColor,
          borderStyle = _conditionalFormattin3.borderStyle,
          leftBorderColor = _conditionalFormattin3.leftBorderColor,
          leftBorderStyle = _conditionalFormattin3.leftBorderStyle,
          rightBorderColor = _conditionalFormattin3.rightBorderColor,
          rightBorderStyle = _conditionalFormattin3.rightBorderStyle,
          topBorderColor = _conditionalFormattin3.topBorderColor,
          topBorderStyle = _conditionalFormattin3.topBorderStyle,
          bottomBorderColor = _conditionalFormattin3.bottomBorderColor,
          bottomBorderStyle = _conditionalFormattin3.bottomBorderStyle;
        xml += '<dxf>';
        var font = {
          fontFamily: fontFamily,
          fontSize: fontSize,
          fontWeight: fontWeight,
          fontStyle: fontStyle,
          textDecoration: textDecoration,
          textColor: textColor
        };
        if (hasFont(font)) {
          // It seems that the "conditional formatting" feature in the XLSX specification
          // doesn't support setting custom `fontFamily` or `fontSize` for some weird reason.
          // https://github.com/catamphetamine/write-excel-file/pull/10#issuecomment-3960778016
          if (fontFamily) {
            throw new Error('Conditional formatting can\'t be used to override font family');
          }
          if (typeof fontSize === 'number') {
            throw new Error('Conditional formatting can\'t be used to override font size');
          }
          xml += getFontXml(font);
        }
        var fill = {
          backgroundColor: backgroundColor,
          fillPatternStyle: fillPatternStyle,
          fillPatternColor: fillPatternColor
        };
        if (hasFill(fill)) {
          xml += getFillXml(fill, {
            conditionalFormatting: true
          });
        }
        var border = {
          borderColor: borderColor,
          borderStyle: borderStyle,
          leftBorderColor: leftBorderColor,
          leftBorderStyle: leftBorderStyle,
          rightBorderColor: rightBorderColor,
          rightBorderStyle: rightBorderStyle,
          topBorderColor: topBorderColor,
          topBorderStyle: topBorderStyle,
          bottomBorderColor: bottomBorderColor,
          bottomBorderStyle: bottomBorderStyle
        };
        if (hasBorder(border)) {
          xml += getBorderXml(border);
        }
        xml += '</dxf>';
      }
    }
  }
  xml += '</dxfs>';
  return xml;
}

function getFileExtensionForContentType(contentType) {
  if (!contentType) {
    throw new Error('`contentType` is required');
  }
  // Discards everything before the slash, and the slash too.
  // Example: "image/jpeg" → "jpeg".
  var extension = contentType.toLowerCase().replace(/.*\//, '');
  if (!extension) {
    throw new Error('Unsupported `contentType`: ' + contentType);
  }
  return extension;
}

function _typeof$2(o) { "@babel/helpers - typeof"; return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$2(o); }
function _createForOfIteratorHelperLoose$4(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$4(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray$4(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$4(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$4(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$4(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray$4(r); }
function _arrayLikeToArray$4(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2(Object(t), true).forEach(function (r) { _defineProperty$2(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$2(e, r, t) { return (r = _toPropertyKey$2(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$2(t) { var i = _toPrimitive$2(t, "string"); return "symbol" == _typeof$2(i) ? i : i + ""; }
function _toPrimitive$2(t, r) { if ("object" != _typeof$2(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$2(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const images = {
  files: {
    transform: {
      '[Content_Types].xml': {
        insert: function insert(sheetsOptions) {
          var sheetsImages = sheetsOptions.map(function (sheetOptions) {
            return sheetOptions.images;
          });
          if (sheetsImages.some(Boolean)) {
            return getContentTypesXml(sheetsImages);
          }
        }
      },
      'xl/drawings/drawing{id}.xml': {
        insert: function insert(sheetOptions, _ref) {
          _ref.sheetIndex;
            _ref.sheetId;
          var images = sheetOptions.images;
          if (images) {
            return getImagesDrawingXml({
              images: images
            });
          }
        }
      },
      'xl/drawings/_rels/drawing{id}.xml.rels': {
        insert: function insert(sheetOptions, _ref2) {
          var sheetIndex = _ref2.sheetIndex;
            _ref2.sheetId;
          var images = sheetOptions.images;
          if (images) {
            return getImagesDrawingXmlRels({
              images: images,
              sheetIndex: sheetIndex
            });
          }
        }
      }
    },
    write: {
      files: function files(sheetsOptions, _ref3) {
        _ref3.read;
        var sheetsImages = sheetsOptions.map(function (sheetOptions) {
          return sheetOptions.images;
        });
        if (sheetsImages.some(Boolean)) {
          return sheetsImages.map(function (images, sheetIndex) {
            if (images) {
              return images.reduce(function (imagesContent, image, imageIndex) {
                return _objectSpread$2(_objectSpread$2({}, imagesContent), {}, _defineProperty$2({}, "xl/media/".concat(getImageFileName(image, {
                  sheetIndex: sheetIndex,
                  imageIndex: imageIndex
                })), image.content));
              }, {});
            }
            return {};
          }).reduce(function (allImagesContent, sheetImagesContent) {
            return _objectSpread$2(_objectSpread$2({}, allImagesContent), sheetImagesContent);
          }, {});
        }
      }
    }
  }
};
function getContentTypesXml(sheetsImages) {
  // Get images from all sheets.
  var imagesFromAllSheets = sheetsImages.reduce(function (all, images) {
    return [].concat(_toConsumableArray(all), _toConsumableArray(images || []));
  }, []);
  var xml = '';

  // Elements with `PartName="/xl/drawings/drawing${sheetId}.xml"` are already added by default.
  // Hence, this block of code was commented out.
  //
  // let i = 0
  // for (const images of imagesPerSheet) {
  // 	if (images) {
  // 		xml += `<Override ContentType="application/vnd.openxmlformats-officedocument.drawing+xml" PartName="/xl/drawings/drawing${sheetId}.xml"/>`
  // 	}
  // 	i++
  // }

  for (var _iterator = _createForOfIteratorHelperLoose$4(getFileExtensionContentTypes(imagesFromAllSheets)), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
      fileExtension = _step$value.fileExtension,
      contentType = _step$value.contentType;
    xml += "<Default Extension=\"".concat(fileExtension, "\" ContentType=\"").concat(contentType, "\"/>");
  }
  return xml;
}
function getFileExtensionContentTypes(images) {
  var fileExtensionContentTypes = [];
  var addFileExtensionContentType = function addFileExtensionContentType(image) {
    var fileExtension = getFileExtensionForContentType(image.contentType);
    var existingFileExtensionContentType = fileExtensionContentTypes.find(function (_) {
      return _.fileExtension === fileExtension;
    });
    if (!existingFileExtensionContentType) {
      fileExtensionContentTypes.push({
        fileExtension: fileExtension,
        contentType: image.contentType
      });
    }
  };
  for (var _iterator2 = _createForOfIteratorHelperLoose$4(images), _step2; !(_step2 = _iterator2()).done;) {
    var image = _step2.value;
    addFileExtensionContentType(image);
  }
  return fileExtensionContentTypes;
}
function getImageFileName(image, _ref4) {
  var sheetIndex = _ref4.sheetIndex,
    imageIndex = _ref4.imageIndex;
  var sheetNumber = sheetIndex + 1;
  var imageNumber = imageIndex + 1;
  return "sheet".concat(sheetNumber, "-image").concat(imageNumber, ".").concat(getFileExtensionForContentType(image.contentType));
}
function getImagesDrawingXml(_ref5) {
  var images = _ref5.images;
  var xml = '';
  var i = 0;
  var _loop = function _loop() {
    var image = _step3.value;
    // `imageId` is used to get the "relationship ID" of the image.
    var imageId = i + 1;
    var pxToEmu = function pxToEmu(px) {
      return pxToEmu_(px, image.dpi);
    };

    // There're two ways an image could be "anchored" in a spreadsheet:
    // * One-cell anchor — "anchors" the image's top-left corner to a top-left corner of a cell.
    // * Two-cell anchor — "anchors" the image's top-left corner to a top-left corner of the first cell,
    //   and then the image's bottom-right corner to the bottom-right corner of the second cell.
    //   While doing so, it completely ignores the image's aspect ratio, so there seems to be
    //   no equivalent for CSS's `object-fit: contain` behavior.
    xml += '<xdr:oneCellAnchor>';
    xml += '<xdr:from>';
    xml += "<xdr:col>".concat(image.anchor.column - 1, "</xdr:col>");
    xml += "<xdr:colOff>".concat(typeof image.offsetX === 'number' ? pxToEmu(image.offsetX) : 0, "</xdr:colOff>");
    xml += "<xdr:row>".concat(image.anchor.row - 1, "</xdr:row>");
    xml += "<xdr:rowOff>".concat(typeof image.offsetY === 'number' ? pxToEmu(image.offsetY) : 0, "</xdr:rowOff>");
    xml += '</xdr:from>';
    xml += "<xdr:ext cx=\"".concat(pxToEmu(image.width), "\" cy=\"").concat(pxToEmu(image.height), "\"/>");
    xml += '<xdr:pic>';
    xml += '<xdr:nvPicPr>';
    xml += "<xdr:cNvPr id=\"".concat(imageId, "\" name=\"").concat(image.title ? sanitizeAttributeValue(image.title) : 'Picture ' + imageId, "\" descr=\"").concat(image.description ? sanitizeAttributeValue(image.description) : '', "\"/>");
    xml += '<xdr:cNvPicPr>';
    // Optional XML element. Locks the aspect ratio of the image. -->
    xml += '<a:picLocks noChangeAspect="1"/>';
    xml += '</xdr:cNvPicPr>';
    xml += '</xdr:nvPicPr>';
    xml += '<xdr:blipFill>';

    // The link to the image.
    xml += "<a:blip xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" r:embed=\"rId-image-".concat(imageId, "\" cstate=\"print\"/>");

    // Allows scaling the image.
    xml += '<a:stretch>';
    xml += '<a:fillRect/>';
    xml += '</a:stretch>';
    xml += '</xdr:blipFill>';

    // Dunno what this is.
    xml += '<xdr:spPr>';
    xml += '<a:prstGeom prst="rect">';
    xml += '<a:avLst/>';
    xml += '</a:prstGeom>';
    xml += '</xdr:spPr>';
    xml += '</xdr:pic>';
    xml += '<xdr:clientData/>';
    xml += '</xdr:oneCellAnchor>';
    i++;
  };
  for (var _iterator3 = _createForOfIteratorHelperLoose$4(images), _step3; !(_step3 = _iterator3()).done;) {
    _loop();
  }
  return xml;
}
function getImagesDrawingXmlRels(_ref6) {
  var images = _ref6.images,
    sheetIndex = _ref6.sheetIndex;
  return images.map(function (image, i) {
    var imageId = i + 1;
    return "<Relationship Id=\"rId-image-".concat(imageId, "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image\" Target=\"../media/").concat(getImageFileName(image, {
      sheetIndex: sheetIndex,
      imageIndex: i
    }), "\"/>");
  }).join('');
}

// For legacy reasons, XLSX documents measure image dimensions not in pixels
// but rather in a weird measurement unit called EMU (English Metric Unit).
// https://gitlab.com/catamphetamine/write-excel-file/-/blob/main/docs/IMAGES.md#image-dimensions
// This function converts pixels to EMUs.
var DEFAULT_DISPLAY_DPI = 96;
var DEFAULT_IMAGE_DPI = 96;
function pxToEmu_(px, imageDpi) {
  var displayDpi = DEFAULT_DISPLAY_DPI;
  return Math.round(px * 9525 * (DEFAULT_DISPLAY_DPI / displayDpi) * (DEFAULT_IMAGE_DPI / imageDpi));
}

const stickyRowsOrColumns = {
  files: {
    transform: {
      'xl/worksheets/sheet{id}.xml': {
        transform: function transform(xml, sheetOptions, _ref) {
          var sheetIndex = _ref.sheetIndex,
            sheetId = _ref.sheetId;
          if (hasStickyRowsOrColumns(sheetOptions)) {
            var stickyRowsCount = sheetOptions.stickyRowsCount,
              stickyColumnsCount = sheetOptions.stickyColumnsCount;
            var paneAttributes = {
              // The vertical position of the split, in 1/20th of a point (twips),
              // or, when frozen, the number of visible rows in the top pane(s).
              ySplit: stickyRowsCount || 0,
              // The horizontal position of the split, in 1/20th of a point (twips),
              // or, when frozen, the number of visible columns in the left pane(s).
              xSplit: stickyColumnsCount || 0,
              // The visible cell in the top-left corner of the bottom-right pane.
              topLeftCell: getCellAddress(stickyRowsCount || 0, stickyColumnsCount || 0),
              // `activePane` defines which pane is active in a "split" or "frozen" `state`.
              // Possible values: "bottomLeft", "bottomRight", "topLeft", "topRight".
              activePane: 'bottomRight',
              // `state: "frozen"` indicates that the panes are frozen, meaning the split area
              // (usually top rows or leftmost columns) remains fixed while the rest of the sheet scrolls.
              // Other possible values:
              // "split" — Indicates that the window is split into separate panes that can be scrolled independently, but are not locked in place.
              // "frozenSplit" — A combination used in specific scenarios (often by Excel itself) to manage complex freezing.
              state: 'frozen'
            };
            var sheetViewElement = findElement(xml, 'sheetView');
            if (sheetViewElement) {
              // Add a `<pane/>` element inside the `<sheetView/>` element.
              // If a `<pane/>` element already exists, it will overwrite it.
              var paneElement = findElementInsideElement(xml, 'pane', sheetViewElement);
              var paneXml = getSelfClosingTagMarkup('pane', paneAttributes);
              if (paneElement) {
                // Overwrite the existing `<pane/>` element.
                // It doesn't seem to be any sense in patching the existing `<pane/>` element
                // because all of its properties would be rewritten anyway in the process.
                xml = replaceElement(xml, paneElement, paneXml);
              } else {
                // Add a `<pane/>` element.
                xml = appendMarkupInsideElement(xml, sheetViewElement, paneXml);
              }
            } else {
              // Add a `<sheetViews/>` element.
              // It isn't supposed to exist when no `<sheetView/>` element is present.
              var sheetViewsElement = findElement(xml, 'sheetViews');
              if (sheetViewsElement) {
                throw new Error("xl/worksheets/sheet".concat(sheetId, ".xml: <sheetViews/> element exists but it doesn't contain any <sheetView/> elements"));
              }
              var sheetViewAttributes = {
                tabSelected: sheetIndex === 0 ? 1 : 0,
                // The first sheet is selected by default.
                workbookViewId: 0
              };
              var sheetViewsXml = getOpeningTagMarkup('sheetViews') + getOpeningTagMarkup('sheetView', sheetViewAttributes) + getSelfClosingTagMarkup('pane', paneAttributes) + getClosingTagMarkup('sheetView') + getClosingTagMarkup('sheetViews');

              // Add a `<sheetViews/>` element with a child '<sheetView/>` element with a child `<pane/>` element.
              // For some reason, Excel 2007 demands `<sheetViews/>` element to be the first one in a `<worksheet/>` element.
              var worksheetElement = findElement(xml, 'worksheet');
              xml = prependMarkupInsideElement(xml, worksheetElement, sheetViewsXml);
            }
          }
          return xml;
        }
      },
      'xl/workbook.xml': {
        transform: function transform(xml, sheetsOptions) {
          // If "sticky rows" or "sticky columns" feature is used, there must exist a `<workbookView/>` element
          // because it will be referenced when configuring those "sticky rows" or "sticky columns".
          if (sheetsOptions.some(hasStickyRowsOrColumns)) {
            // Find a `<workbookView/>` element.
            // It is required to exist because it is referenced as `workbookViewId="0"`
            // attribute in `<sheetViews/>` element in `xl/worksheets/sheet{id}.xml` file.
            var workbookViewElement = findElement(xml, 'workbookView');
            if (!workbookViewElement) {
              // `<workbookView/>` element doesn't exist, so it should be created.
              // The parent element for it should be `<bookViews/>`.
              var bookViewsElement = findElement(xml, 'bookViews');
              if (bookViewsElement) {
                throw new Error("xl/workbook.xml: <bookViews/> element exists but it doesn't contain any <workbookView/> elements");
              }
              // Add a `<bookViews/>` element with a child '<workbookView/>` element.
              // For some reason, Excel 2007 demands `<bookViews/>` element to go before `<sheets/>` element.
              // And `<sheets/>` element always exists.
              return insertElementMarkupAccordingToOrderOfSiblings(xml, '<bookViews><workbookView/></bookViews>', getOrderOfSiblings('xl/workbook.xml', 'workbook'), 'workbook');
            }
          }
          return xml;
        }
      }
    }
  }
};
function hasStickyRowsOrColumns(sheetOptions) {
  return Boolean(sheetOptions.stickyRowsCount) || Boolean(sheetOptions.stickyColumnsCount);
}

function getFeatures(customFeatures) {
  var features = [];

  // Add "conditional formatting" feature implicitly.
  features.push(conditionalFormatting);

  // Add "images" feature implicitly.
  features.push(images);

  // Add "sticky rows or columns" feature implicitly.
  features.push(stickyRowsOrColumns);

  // Custom features might depend on "default" features
  // so the order of inclusion of custom features is after including "default" features.
  if (customFeatures) {
    customFeatures.forEach(validateFeature);
    features = features.concat(customFeatures);
  }
  return features;
}
var TRANSFORMABLE_FILES = ['[Content_Types].xml', '_rels/.rels', 'xl/styles.xml', 'xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/worksheets/sheet{id}.xml', 'xl/worksheets/_rels/sheet{id}.xml.rels', 'xl/drawings/drawing{id}.xml', 'xl/drawings/_rels/drawing{id}.xml.rels'];
function validateFeature(feature) {
  if (feature.files && feature.files.transform) {
    for (var _i = 0, _Object$keys = Object.keys(feature.files.transform); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      if (TRANSFORMABLE_FILES.indexOf(key) < 0) {
        throw new Error("Unknown file to transform: ".concat(key));
      }
    }
  }
}

function _createForOfIteratorHelperLoose$3(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$3(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$3(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$3(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$3(r, a) : void 0; } }
function _arrayLikeToArray$3(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function validateSheetData(data) {
  if (!Array.isArray(data)) {
    throw new TypeError('Expected sheet data to be an array of rows');
  }
  for (var _iterator = _createForOfIteratorHelperLoose$3(data), _step; !(_step = _iterator()).done;) {
    var row = _step.value;
    if (Array.isArray(row)) {
      return;
    } else {
      throw new Error('Expected each sheet data row to be an array');
    }
  }
}

function initializeSharedStrings() {
  var sharedStrings = [];
  var sharedStringIdByString = {};
  return {
    getSharedStrings: function getSharedStrings() {
      return sharedStrings;
    },
    findOrCreateSharedString: function findOrCreateSharedString(string) {
      var id = sharedStringIdByString[string];
      if (id === undefined) {
        id = sharedStrings.length;
        sharedStringIdByString[string] = id;
        sharedStrings.push(string);
      }
      return id;
    }
  };
}

// https://stackoverflow.com/questions/451452/valid-characters-for-excel-sheet-names
// Sheet name can't be empty.
// Sheet name shouldn't exceed 31 characters.
// Sheet name shouldn't contain any of the following characters: []/\:*?

var ILLEGAL_CHARACTERS_IN_SHEET_NAME = /[\[\]\/\\:*?]+/;
function validateSheetName(sheetName) {
  if (!sheetName) {
    throw new Error('Sheet name can\'t be empty');
  }
  if (sheetName.length > 31) {
    throw new Error("Sheet name \"".concat(sheetName, "\" can't be longer than 31 characters"));
  }
  if (ILLEGAL_CHARACTERS_IN_SHEET_NAME.test(sheetName)) {
    throw new Error("Sheet name \"".concat(sheetName, "\" contains illegal characters: []/\\:*?"));
  }
}

function _createForOfIteratorHelperLoose$2(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$2(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$2(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$2(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$2(r, a) : void 0; } }
function _arrayLikeToArray$2(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function initializeSheets(sheetsData, sheetsOptions, globalOptions) {
  var _initializeSharedStri = initializeSharedStrings(),
    getSharedStrings = _initializeSharedStri.getSharedStrings,
    findOrCreateSharedString = _initializeSharedStri.findOrCreateSharedString;

  // const sheetsDefaultFonts = sheetsOptions.map((sheetOptions) => {
  // 	const { fontFamily, fontSize } = sheetOptions
  //   if (fontFamily || fontSize) {
  // 		return { fontFamily, fontSize }
  // 	}
  // })

  var defaultFont = getDefaultFont(globalOptions);
  var _initializeStyles = initializeStyles(defaultFont),
    getCellStyles = _initializeStyles.getCellStyles,
    findOrCreateCellStyle = _initializeStyles.findOrCreateCellStyle;

  // Get sheet names.
  var sheetNames = sheetsOptions.map(function (sheetOptions) {
    return sheetOptions.sheet;
  });

  // Validate sheet names.
  for (var _iterator = _createForOfIteratorHelperLoose$2(sheetNames), _step; !(_step = _iterator()).done;) {
    var sheetName = _step.value;
    validateSheetName(sheetName);
  }
  var sheetXmlParameters = [];
  var sheetIndex = 0;
  while (sheetIndex < sheetNames.length) {
    sheetXmlParameters.push({
      sheetData: sheetsData[sheetIndex],
      sheetOptions: sheetsOptions[sheetIndex],
      sheetIndex: sheetIndex,
      sheetId: getSheetId(sheetIndex),
      hasDefaultFont: Boolean(defaultFont),
      // hasDefaultFont: Boolean(sheetsDefaultFonts[sheetIndex]),
      // findOrCreateCellStyle: (style) => findOrCreateCellStyle(style, sheetIndex),
      findOrCreateCellStyle: findOrCreateCellStyle,
      findOrCreateSharedString: findOrCreateSharedString
    });
    sheetIndex++;
  }
  return {
    sheets: sheetNames.map(function (sheetName, _i) {
      // Reassign the `_i` variable to prevent "closure" bug when in `generateSheetXml()` function
      // the `_i` value is always equal to the last sheet's index.
      var sheetIndex = _i;
      return {
        sheetId: getSheetId(sheetIndex),
        sheetName: sheetName,
        sheetXmlParameters: sheetXmlParameters[sheetIndex]
      };
    }),
    getSharedStrings: getSharedStrings,
    getCellStyles: getCellStyles
  };
}
function getSheetId(sheetIndex) {
  return String(sheetIndex + 1);
}
function getDefaultFont(globalOptions) {
  var fontFamily = globalOptions.fontFamily,
    fontSize = globalOptions.fontSize;
  if (fontFamily || typeof fontSize === 'number') {
    return {
      fontFamily: fontFamily,
      fontSize: fontSize
    };
  }
}

function getSheetData(objects, columns) {
  // Create header row.
  var headerRow;
  // If at least one column has a header
  // then a header row will be rendered.
  // Otherwise, there will be no header row.
  if (columns.some(function (column) {
    return column.header;
  })) {
    headerRow = columns.map(function (_ref) {
      var header = _ref.header;
      return header || null;
    });
  }
  return (headerRow ? [headerRow] : []).concat(objects.map(function (object, objectIndex) {
    return columns.map(function (_ref2) {
      var cell = _ref2.cell;
      return cell(object, objectIndex);
    });
  }));
}

function _typeof$1(o) { "@babel/helpers - typeof"; return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$1(o); }
function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), true).forEach(function (r) { _defineProperty$1(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$1(e, r, t) { return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$1(t) { var i = _toPrimitive$1(t, "string"); return "symbol" == _typeof$1(i) ? i : i + ""; }
function _toPrimitive$1(t, r) { if ("object" != _typeof$1(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$1(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelperLoose$1(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$1(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$1(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$1(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$1(r, a) : void 0; } }
function _arrayLikeToArray$1(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function getWrittenFiles(features, sheetsOptions, _ref) {
  var read = _ref.read;
  var writtenFiles = {};
  for (var _iterator = _createForOfIteratorHelperLoose$1(features), _step; !(_step = _iterator()).done;) {
    var feature = _step.value;
    if (feature.files && feature.files.write) {
      if (feature.files.write.files) {
        var files = feature.files.write.files(sheetsOptions, {
          read: read
        });
        if (files) {
          writtenFiles = _objectSpread$1(_objectSpread$1({}, writtenFiles), files);
        }
      }
    }
  }
  return writtenFiles;
}

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["data"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

/**
 * Creates contents (files) an `*.xlsx` file.
 * @param {SheetData|Object[]|Sheet[]} arg1
 * @param {object} arg2 — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @param {object} [arg3] — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @return {Record<string,string|Blob>} A map of files that exist inside an `.xlsx` file.
 */
function generateXlsxFileContents(arg1, arg2, arg3) {
  var _getArguments = getArguments(arg1, arg2, arg3),
    sheetsDataAndOptions = _getArguments.sheets,
    options = _getArguments.options;
  var sheetsData = sheetsDataAndOptions.map(function (sheet) {
    return sheet.data;
  });
  var sheetsOptions = sheetsDataAndOptions.map(function (sheet) {
    return sheet.options;
  });
  sheetsOptions = setSheetNames(sheetsOptions);

  // Here's a small hack for `conditionalFormatting` feature support.
  // `.xlsx` format is weird and has many quirks.
  // One of those quirks is each conditional formatting rule has to be assigned a globally-unique ID.
  // That itself wouldn't be an issue if that globally-unique ID could be any string,
  // but `.xlsx` format specification complicates things by demanding it to be
  // a zero-based integer index (0, 1, 2, ...) referencing a specific `<dxf>` element in "styles.xml" file.
  // So a conditional formatting rule ID can't be just "sheet1-rule2", it has to be specifically
  // an index of this rule in the list of all rules for all sheets in a given `.xlsx` file.
  // Because a sheet-specific file tranform function doesn't have access to other sheets' options,
  // here it manually sets the global indexes of all conditional formatting rules,
  // and it has to do so without mutating any input arguments.
  sheetsOptions = setConditionalFormattingRulesGlobalIndexes(sheetsOptions);
  var features = getFeatures(options.features);
  var files = {};
  var readFile = function readFile(path) {
    return files[path];
  };
  // const fileExists = (path) => Boolean(files[path])

  var writeFiles = function writeFiles(filesToWrite) {
    for (var _i = 0, _Object$keys = Object.keys(filesToWrite); _i < _Object$keys.length; _i++) {
      var path = _Object$keys[_i];
      validateFilePath(path);
      validateFileContent(path, filesToWrite[path]);
      files[path] = filesToWrite[path];
    }
  };
  var _initializeSheets = initializeSheets(sheetsData, sheetsOptions, options),
    sheets = _initializeSheets.sheets,
    getSharedStrings = _initializeSheets.getSharedStrings,
    getCellStyles = _initializeSheets.getCellStyles;
  files['[Content_Types].xml'] = generateContentTypesXml({
    sheetIds: sheets.map(function (_) {
      return _.sheetId;
    }),
    features: features,
    sheetsOptions: sheetsOptions
  });
  files['_rels/.rels'] = generateRelsXml({
    features: features,
    sheetsOptions: sheetsOptions
  });
  files['xl/_rels/workbook.xml.rels'] = generateWorkbookXmlRels({
    sheetIds: sheets.map(function (_) {
      return _.sheetId;
    }),
    features: features,
    sheetsOptions: sheetsOptions
  });
  files['xl/workbook.xml'] = generateWorkbookXml({
    sheetIdsAndNames: sheets.map(function (_ref) {
      var sheetId = _ref.sheetId,
        sheetName = _ref.sheetName;
      return {
        sheetId: sheetId,
        sheetName: sheetName
      };
    }),
    features: features,
    sheetsOptions: sheetsOptions
  });
  var sheetIndex = 0;
  for (var _iterator = _createForOfIteratorHelperLoose(sheets), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
      sheetId = _step$value.sheetId,
      sheetXmlParameters = _step$value.sheetXmlParameters;
    var sheetOptions = sheetsOptions[sheetIndex];
    files["xl/worksheets/sheet".concat(sheetId, ".xml")] = generateSheetXml(sheetXmlParameters, features);
    files["xl/worksheets/_rels/sheet".concat(sheetId, ".xml.rels")] = generateSheetXmlRels({
      sheetIndex: sheetIndex,
      sheetId: sheetId,
      sheetOptions: sheetOptions,
      features: features
    });
    files["xl/drawings/drawing".concat(sheetId, ".xml")] = generateDrawingXml({
      sheetIndex: sheetIndex,
      sheetId: sheetId,
      sheetOptions: sheetOptions,
      features: features
    });
    files["xl/drawings/_rels/drawing".concat(sheetId, ".xml.rels")] = generateDrawingXmlRels({
      sheetIndex: sheetIndex,
      sheetId: sheetId,
      sheetOptions: sheetOptions,
      features: features
    });
    sheetIndex++;
  }
  writeFiles(getWrittenFiles(features, sheetsOptions, {
    read: readFile
  }));

  // After sheets' XML was generated, it can generate "styles.xml" and "sharedStrings.xml".
  files['xl/styles.xml'] = generateStylesXml(getCellStyles(), sheetsOptions, features);
  files['xl/sharedStrings.xml'] = generateSharedStringsXml(getSharedStrings());

  // (minor minimization) Remove unused `drawing${id}.xml` files.
  removeUnusedDrawings(files, sheets);
  return files;
}

// (minor minimization)
//
// For each `xl/drawings/drawing${id}.xml`, see if it has no actual content,
// i.e. the `<xdr:wsDr>` element has no child elements.
// If that's the case, remove `xl/drawings/drawing${sheetId}.xml` and `xl/drawings/drawing${sheetId}.xml.rels`,
// and also remove `<drawing r:id="..."/>` element from `xl/worksheets/sheet${sheetId}.xml`
// and the corresponding `<Relationship Id="..." .../>` element from `xl/worksheets/_rels/sheet${sheetId}.xml.rels`
// and the corresponding `<Override/> element from `[Content_Types].xml`.
//
function removeUnusedDrawings(files, sheets) {
  for (var _iterator2 = _createForOfIteratorHelperLoose(sheets), _step2; !(_step2 = _iterator2()).done;) {
    var sheetId = _step2.value.sheetId;
    if (files["xl/drawings/drawing".concat(sheetId, ".xml")] === DRAWING_XML_START + DRAWING_XML_END) {
      delete files["xl/drawings/drawing".concat(sheetId, ".xml")];
      delete files["xl/drawings/_rels/drawing".concat(sheetId, ".xml.rels")];
      if (!removeSubstring(files, "xl/worksheets/sheet".concat(sheetId, ".xml"), generateDrawingReference(getSelfClosingTagMarkup))) {
        throw new Error(COULD_NOT_REMOVE_UNUSED_DRAWINGS);
      }
      removeSubstring(files, "xl/worksheets/_rels/sheet".concat(sheetId, ".xml.rels"), getDrawingRelationshipXml(sheetId));
      removeSubstring(files, '[Content_Types].xml', getDrawingContentTypeXml(sheetId));
    }
  }
}
var COULD_NOT_REMOVE_UNUSED_DRAWINGS = 'Couldn\'t remove unused drawings';
function removeSubstring(files, key, substring) {
  if (!files[key]) {
    throw new Error("File not found: ".concat(key));
  }
  if (files[key].indexOf(substring) < 0) {
    throw new Error("Substring \"".concat(substring, "\" not found in \"").concat(key, "\""));
  }
  var stringBeforeRemoval = files[key];
  var stringAfterRemoval = stringBeforeRemoval.replace(substring, '');
  files[key] = stringAfterRemoval;
  return stringBeforeRemoval !== stringAfterRemoval;
}
function validateFilePath(path) {
  if (path[0] === '/') {
    throw new Error("File path must not start with a slash (/)");
  }
}
function validateFileContent(path, content) {
  if (!content) {
    throw new Error("File `content` not specified: ".concat(path));
  }
}
function getArguments(arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    if (arg1.length === 0 || Array.isArray(arg1[0])) {
      // `arg1` is `SheetData`
      validateSheetData(arg1);
      // Validate that a developer is not using the legacy way of writing multiple sheets.
      if (Array.isArray(arg1[0]) && arg1.length > 0 && Array.isArray(arg1[0][0])) {
        throw new Error('In order to write multiple sheets, pass an array of sheet objects');
      }
      return {
        sheets: [{
          data: arg1,
          options: arg2 || {}
        }],
        options: arg3 || {}
      };
    } else if (isObject(arg1[0])) {
      // `arg1` is either `Sheet[]` or `Object[]`
      // Validate that a developer is not using a legacy parameter `schema`.
      if (isObject(arg2) && Array.isArray(arg2.schema)) {
        throw new Error('`schema` parameter was removed, use `columns` parameter instead');
      }
      if (isObject(arg2) && Array.isArray(arg2.columns)) {
        // `arg1` is `Object[]`.
        // Don't remove `columns` property from `arg2` because it's still required there
        // to apply the column `width`.
        return getArguments(getSheetData(arg1, arg2.columns), arg2, arg3);
      }
      // `arg1` is `Sheet[]`
      return {
        sheets: arg1.map(function (_ref2) {
          var data = _ref2.data,
            options = _objectWithoutProperties(_ref2, _excluded);
          if (!data) {
            throw new Error('`data` property is required for each sheet');
          }
          validateSheetData(data);
          return {
            data: data,
            options: options || {}
          };
        }),
        options: arg2 || {}
      };
    } else {
      throw new Error('Invalid first argument: must be either sheet data — an array of arrays — or an array of sheet objects');
    }
  } else {
    throw new Error('Invalid first argument: must be an array');
  }
}

// Sets a sheet name for each sheet.
function setSheetNames(sheetsOptions) {
  return sheetsOptions.map(function (sheetOptions, sheetIndex) {
    return _objectSpread(_objectSpread({}, sheetOptions), {}, {
      sheet: sheetOptions.sheet || "Sheet".concat(sheetIndex + 1)
    });
  });
}

// Sets a `_globalIndex: number` property on each conditional formatting rule.
function setConditionalFormattingRulesGlobalIndexes(sheetsOptions) {
  var globalIndex = 0;
  return sheetsOptions.map(function (sheetOptions) {
    return _objectSpread(_objectSpread({}, sheetOptions), {}, {
      conditionalFormatting: sheetOptions.conditionalFormatting && sheetOptions.conditionalFormatting.map(function (conditionalFormattingRule) {
        return _objectSpread(_objectSpread({}, conditionalFormattingRule), {}, {
          // `++` operator returns the value before the increment.
          _globalIndex: globalIndex++
        });
      })
    });
  });
}

// This function doesn't use `async`/`await` in order to avoid adding `@babel/runtime` to `dependencies`.
// https://gitlab.com/catamphetamine/write-excel-file/-/issues/105

/**
 * Creates an `*.xlsx` file.
 * @param {SheetData|Object[]|Sheet[]} arg1
 * @param {object} arg2 — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @param {object} [arg3] — If `arg1` is `SheetData`, `arg2` is `SheetOptions` and `arg3` is `Options`. If `arg1` is `Sheet[]`, `arg2` is `Options`.
 * @returns {object} Returns an object with `async` methods: `toBlob()`.
 */
function writeXlsxFile(arg1, arg2, arg3) {
  return {
    toBlob: function toBlob() {
      return generateXlsxFileAsync(arg1, arg2, arg3, convertFileContentToUint8Array);
    }
  };
}

/**
 * @return {Promise<Blob>}
 */
function generateXlsxFile(arg1, arg2, arg3, convertFileContentToUint8Array, createZipArchiveAsArrayBuffer, isAsyncZip) {
  // Generate the sub-files inside the `.xlsx` file.
  var files = generateXlsxFileContents(arg1, arg2, arg3);

  // Convert files' content to `Uint8Array`s.
  return convertFilesContentToUint8Arrays(files, convertFileContentToUint8Array).then(function (files) {
    // Create a `.zip` archive from the files.
    // An `.xlsx` file is just a `.zip` archive with an `.xlsx` file extension.
    // `result` is either `Uint8Array` or `Promise<Uint8Array>`
    var result = createZipArchiveAsArrayBuffer(files);
    // Return a `Blob` with the `.zip` archive data.
    {
      return result.then(function (result) {
        return convertArrayBufferToBlob(result);
      });
    }
  });
}

// Converts `ArrayBuffer` to `Blob`.
function convertArrayBufferToBlob(arrayBuffer) {
  return new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

/**
 * Generates an *.xlsx file "asynchronously".
 * @return {Promise<Blob>}
 */
function generateXlsxFileAsync(arg1, arg2, arg3, convertFileContentToUint8Array) {
  return generateXlsxFile(arg1, arg2, arg3, convertFileContentToUint8Array, zipToArrayBuffer);
}

export { writeXlsxFile as default, getSheetData };
