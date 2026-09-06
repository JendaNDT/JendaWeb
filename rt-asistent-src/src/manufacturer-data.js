// Derived numerical line models, not page images. Source: Waygate Radiographic Film Systems, pp. 14, 16.
// Extracted from PDF vector coordinates and checked visually. Graphical precision only.
// X-ray: steel, constant potential, Pb screens, density 2, FFD 1 m, G135 at 28 C, 8 min cycle.
// Gamma: steel, Ir-192, Pb screens, density 2, SFD 1 m, 10–90 mm.
export const XRAY_CHARTS = {
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
export const GAMMA_CHARTS = {
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
