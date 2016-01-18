THREE.AdditiveBlendShader = {
	uniforms: {
		tBase: {
			type: "t",
			value: null
		},
		tAdd: {
			type: "t",
			value: null
		},
		amount: {
			type: "f",
			value: 1
		}
	},
	vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
	fragmentShader: ["uniform sampler2D tBase;", "uniform sampler2D tAdd;", "uniform float amount;", "varying vec2 vUv;", "void main() {", "vec4 texel1 = texture2D( tBase, vUv );", "vec4 texel2 = texture2D( tAdd, vUv );", "gl_FragColor = texel1 + texel2 * amount;", "}"].join("\n")
},

THREE.BarrelBlurShader = {
	uniforms: {
		tDiffuse: {
			type: "t",
			value: null
		},
		amount: {
			type: "f",
			value: .5
		},
		time: {
			type: "f",
			value: 0
		}
	},
	vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
	fragmentShader: ["uniform sampler2D tDiffuse;", "uniform float amount;", "uniform float time;", "varying vec2 vUv;", "const int num_iter = 16;", "const float reci_num_iter_f = 1.0 / float(num_iter);", "const float gamma = 2.2;", "const float MAX_DIST_PX = 200.0;", "vec2 barrelDistortion( vec2 p, vec2 amt )", "{", "    p = 2.0*p-1.0;", "    //float BarrelPower = 1.125;", "    const float maxBarrelPower = 3.0;", "    float theta  = atan(p.y, p.x);", "    float radius = length(p);", "    radius = pow(radius, 1.0 + maxBarrelPower * amt.x);", "    p.x = radius * cos(theta);", "    p.y = radius * sin(theta);", "    return 0.5 * ( p + 1.0 );", "}", "float sat( float t )", "{", "	return clamp( t, 0.0, 1.0 );", "}", "float linterp( float t ) {", "	return sat( 1.0 - abs( 2.0*t - 1.0 ) );", "}", "float remap( float t, float a, float b ) {", "	return sat( (t - a) / (b - a) );", "}", "vec3 spectrum_offset( float t ) {", "	vec3 ret;", "	float lo = step(t,0.5);", "	float hi = 1.0-lo;", "	float w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );", "	ret = vec3(lo,1.0,hi) * vec3(1.0-w, w, 1.0-w);", "", "	return pow( ret, vec3(1.0/2.2) );", "}", "float nrand( vec2 n )", "{", "	return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);", "}", "vec3 lin2srgb( vec3 c )", "{", "    return pow( c, vec3(gamma) );", "}", "vec3 srgb2lin( vec3 c )", "{", "    return pow( c, vec3(1.0/gamma));", "}", "void main() {", "vec2 uv = vUv;", "vec2 max_distort = vec2(amount);", "vec2 oversiz = barrelDistortion( vec2(1,1), max_distort );", "uv = 2.0 * uv - 1.0;", "uv = uv / (oversiz*oversiz);", "uv = 0.5 * uv + 0.5;", "vec3 sumcol = vec3(0.0);", "vec3 sumw = vec3(0.0);", "float rnd = nrand( uv + fract(time) );", "for ( int i=0; i<num_iter;++i ){", "float t = (float(i)+rnd) * reci_num_iter_f;", "vec3 w = spectrum_offset( t );", "sumw += w;", "sumcol += w * srgb2lin(texture2D( tDiffuse, barrelDistortion(uv, max_distort*t ) ).rgb);", "}", "sumcol.rgb /= sumw;", "vec3 outcol = lin2srgb(sumcol.rgb);", "outcol += rnd/255.0;", "gl_FragColor = vec4( outcol, 1.0);", "}"].join("\n")
},

THREE.ColorShiftShader = {
	uniforms: {
		tDiffuse: {
			type: "t",
			value: null
		}
	},
	vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
	fragmentShader: ["uniform sampler2D tDiffuse;", "varying vec2 vUv;", "float wave(float x, float amount) {", "return (sin(x * amount) + 1.) * .5;", "}", "void main() {", "vec4 color = texture2D(tDiffuse, vUv);", "gl_FragColor.r = wave(color.r, 10.);", "gl_FragColor.g = wave(color.g, 20.);", "gl_FragColor.b = wave(color.b, 40.);", "gl_FragColor.a = 1.;", "}"].join("\n")
},

THREE.LinesShader = {
	uniforms: {
		tDiffuse: {
			type: "t",
			value: null
		},
		amount: {
			type: "f",
			value: 1500
		},
		strength: {
			type: "f",
			value: .3
		},
		angle: {
			type: "f",
			value: .5
		}
	},
	vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
	fragmentShader: ["uniform sampler2D tDiffuse;", "uniform float strength;", "uniform float amount;", "uniform float angle;", "varying vec2 vUv;", "void main() {", "vec4 col = texture2D(tDiffuse, vUv);", "col += sin(vUv.x*amount*(1.0-angle)+vUv.y*amount*angle)*strength;", "gl_FragColor = col;", "}"].join("\n")
},

THREE.MirrorShader = {
	uniforms: {
		tDiffuse: {
			type: "t",
			value: null
		},
		side: {
			type: "i",
			value: 1
		},
		additive: {
			type: "i",
			value: 0
		}
	},
	vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
	fragmentShader: ["uniform sampler2D tDiffuse;", "uniform int side;", "uniform int additive;", "varying vec2 vUv;", "void main() {", "vec2 p = vUv;", "vec4 color;", "if (additive == 1){", "color = texture2D(tDiffuse, vUv);", "if (side < 2){", "p.x = 1.0 - p.x;", "}else {", "p.y = 1.0 - p.y;", "}", "color += texture2D(tDiffuse, p);", "}else{", "if (side == 0){", "if (p.x > 0.5) p.x = 1.0 - p.x;", "}else if (side == 1){", "if (p.x < 0.5) p.x = 1.0 - p.x;", "}else if (side == 2){", "if (p.y < 0.5) p.y = 1.0 - p.y;", "}else if (side == 3){", "if (p.y > 0.5) p.y = 1.0 - p.y;", "} ", "color = texture2D(tDiffuse, p);", "}", "gl_FragColor = color;", "}"].join("\n")
},

THREE.ShakeShader = {
	uniforms: {
		tDiffuse: {
			type: "t",
			value: null
		},
		time: {
			type: "f",
			value: 0
		},
		amount: {
			type: "f",
			value: .05
		}
	},
	vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
	fragmentShader: ["uniform sampler2D tDiffuse;", "uniform float time;", "uniform float amount;", "varying vec2 vUv;", "float rand(vec2 co){", "return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);", "}", "void main() {", "vec2 p = vUv;", "vec2 offset = vec2((rand(vec2(time,time)) - 0.5)*amount,(rand(vec2(time + 999.0,time + 999.0))- 0.5) *amount);", "p += offset;", "gl_FragColor = texture2D(tDiffuse, p);", "}"].join("\n")
},

THREE.SuperShader = {
	uniforms: {
		tDiffuse: {
			type: "t",
			value: null
		},
		glowAmount: {
			type: "f",
			value: .5
		},
		glowSize: {
			type: "f",
			value: 4
		},
		resolution: {
			type: "v2",
			value: new THREE.Vector2(800, 600)
		},
		vigOffset: {
			type: "f",
			value: 1
		},
		vigDarkness: {
			type: "f",
			value: 1
		},
		brightness: {
			type: "f",
			value: 0
		},
		contrast: {
			type: "f",
			value: 0
		},
		hue: {
			type: "f",
			value: 0
		},
		saturation: {
			type: "f",
			value: 0
		}
	},
	vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
	fragmentShader: ["uniform sampler2D tDiffuse;", "uniform float glowSize;", "uniform float glowAmount;", "uniform vec2 resolution;", "uniform float vigOffset;", "uniform float vigDarkness;", "uniform float brightness;", "uniform float contrast;", "uniform float hue;", "uniform float saturation;", "uniform int mirrorSide;", "varying vec2 vUv;", "void main() {", "float h = glowSize / resolution.x;", "float v = glowSize / resolution.y;", "vec4 sum = vec4( 0.0 );", "sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;", "sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;", "sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;", "sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;", "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;", "sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;", "sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;", "sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;", "sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;", "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;", "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;", "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;", "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;", "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;", "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;", "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;", "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;", "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;", "vec4 col = texture2D( tDiffuse, vUv );", "col = min(col + sum * glowAmount, 1.0);", "vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( vigOffset );", "col = vec4( mix( col.rgb, vec3( 1.0 - vigDarkness ), dot( uv, uv ) ), col.a );", "col.rgb += brightness;", "if (contrast > 0.0) {", "col.rgb = (col.rgb - 0.5) / (1.0 - contrast) + 0.5;", "} else {", "col.rgb = (col.rgb - 0.5) * (1.0 + contrast) + 0.5;", "}", "float angle = hue * 3.14159265;", "float s = sin(angle), c = cos(angle);", "vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;", "float len = length(col.rgb);", "col.rgb = vec3(", "dot(col.rgb, weights.xyz),", "dot(col.rgb, weights.zxy),", "dot(col.rgb, weights.yzx)", ");", "float average = (col.r + col.g + col.b) / 3.0;", "if (saturation > 0.0) {", "col.rgb += (average - col.rgb) * (1.0 - 1.0 / (1.001 - saturation));", "} else {", "col.rgb += (average - col.rgb) * (-saturation);", "}", "gl_FragColor = col;", "}"].join("\n")
},

THREE.WobbleShader = {
	uniforms: {
		tDiffuse: {
			type: "t",
			value: null
		},
		time: {
			type: "f",
			value: 0
		},
		strength: {
			type: "f",
			value: .001
		},
		size: {
			type: "f",
			value: 50
		},
		speed: {
			type: "f",
			value: 1
		}
	},
	vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
	fragmentShader: ["uniform sampler2D tDiffuse;", "uniform float time;", "uniform float strength;", "uniform float size;", "uniform float speed;", "varying vec2 vUv;", "void main() {", "vec2 p = -1.0 + 2.0 * vUv;", "gl_FragColor = texture2D(tDiffuse, vUv + strength * vec2(cos(time*speed+length(p*size)), sin(time*speed+length(p*size))));", "}"].join("\n")
},

THREE.EclipseShader = {
    uniforms: {
        radius: {
            type: "f",
            value: .25
        },
        brightness: {
            type: "f",
            value: .02
        },
        opacity: {
            type: "f",
            value: 1
        },
        time: {
            type: "f",
            value: 0
        },
        levelsTexture: {
            type: "t",
            value: 2
        }
    },
    vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
    fragmentShader: ["const float DOT_COUNT = 16.0;", "uniform float radius;", "uniform float brightness;", "uniform float time;", "uniform float opacity;", "uniform sampler2D levelsTexture;", "varying vec2 vUv;", "vec3 hsv2rgb(vec3 c){", "vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);", "vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);", "return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);", "}", "void main() {", "vec2 p= vUv - 0.5;", "vec3 c=vec3(0,0,0.1);", "for(float i=0.;i < DOT_COUNT; i++){", "float vol = texture2D(levelsTexture, vec2(i/DOT_COUNT, 0.0)).r;", "float b = vol * brightness;", "float x = radius*cos(2.*3.14*float(i)/DOT_COUNT);", "float y = radius*sin(2.*3.14*float(i)/DOT_COUNT);", "vec2 o = vec2(x,y);", "vec3 dotCol = hsv2rgb(vec3((i + time*10.)/DOT_COUNT,1.,1.0));", "c += b/(length(p-o))*dotCol;", "}", "float dist = distance(p , vec2(0));", "c = mix(vec3(0), c, smoothstep(radius + 0.01, radius + 0.015 , dist));", "gl_FragColor = vec4(c,opacity);", "}"].join("\n")
}, THREE.ImageRippleShader = {
    uniforms: {
        texture: {
            type: "t",
            value: null
        },
        audioDepth: {
            type: "f",
            value: 400
        },
        levels: {
            type: "fv1",
            value: []
        },
        numStrips: {
            type: "f",
            value: 60
        },
        opacity: {
            type: "f",
            value: 1
        }
    },
    vertexShader: ["uniform sampler2D texture;", "uniform float audioDepth;", "uniform float numStrips;", "uniform float levels[ 100 ];", "uniform float opacity;", "varying vec2 vUv;", "void main() {", "vUv = uv;", "float x = uv.x;", "if (x < 0.5){", "x = 1.0 - 2.0 * x;", "}else{", "x = (x - 0.5) * 2.0 ;", "}", "int index = int(floor( x * numStrips)) - 1;", "float levelVal = levels[ index ];", "float value = levelVal * audioDepth ;", "vec3 newPosition = position + normal * value;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );", "}"].join("\n"),
    fragmentShader: ["uniform sampler2D texture;", "varying vec2 vUv;", "uniform float bulge;", "uniform float opacity;", "void main() {", "vec4 col = texture2D(texture, vUv);", "col.a = opacity;", "gl_FragColor = col;", "}"].join("\n")
};
