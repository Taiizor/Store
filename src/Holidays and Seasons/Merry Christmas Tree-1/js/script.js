(function() {
	function r(a) {
		gsap.killTweensOf(a, {
			opacity: !0
		});
		gsap.fromTo(a, {
			opacity: 1
		}, {
			duration: .07,
			opacity: Math.random(),
			repeat: -1
		})
	}

	function t(a) {
		e && (a = l[d], gsap.set(a, {
			x: gsap.getProperty(".pContainer", "x"),
			y: gsap.getProperty(".pContainer", "y"),
			scale: m()
		}), gsap.timeline().to(a, {
			duration: gsap.utils.random(.61, 6),
			physics2D: {
				velocity: gsap.utils.random(-23, 23),
				angle: gsap.utils.random(-180, 180),
				gravity: gsap.utils.random(-6, 50)
			},
			scale: 0,
			rotation: gsap.utils.random(-123, 360),
			ease: "power1",
			onStart: r,
			onStartParams: [a],
			onRepeat: function(b) {
				gsap.set(b, {
					scale: m()
				})
			},
			onRepeatParams: [a]
		}), d++, d = 201 <= d ? 0 : d)
	}
	MorphSVGPlugin.convertToPath("polygon");
	document.querySelector(".pContainer");
	var u = document.querySelector(".mainSVG");
	document.querySelector("#star");
	var c = document.querySelector(".sparkle");
	document.querySelector("#tree");
	var e = !0,
		n = "#E8F6F8 #ACE8F8 #F6FBFE #A2CBDC #B74551 #5DBA72 #910B28 #910B28 #446D39".split(" "),
		p = ["#star", "#circ", "#cross", "#heart"],
		l = [],
		d = 0;
	gsap.set("svg", {
		visibility: "visible"
	});
	gsap.set(c, {
		transformOrigin: "50% 50%",
		y: -100
	});
	c = function(a) {
		var b = [],
			f = MotionPathPlugin.getRawPath(a)[0];
		f.forEach(function(v, g) {
			var h = {};
			h.x = f[2 * g];
			h.y = f[2 * g + 1];
			g % 2 && b.push(h)
		});
		return b
	};
	c(".treePath");
	var q = c(".treeBottomPath");
	c = gsap.timeline({
		delay: 0,
		repeat: -1
	});
	var k, m = gsap.utils.random(.5, 3, .001, !0);
	(function() {
		for (var a = 201, b; - 1 < --a;) b = document.querySelector(p[a % p.length]).cloneNode(!0), u.appendChild(b), b.setAttribute("fill", n[a % n.length]), b.setAttribute("class", "particle"), l.push(b), gsap.set(b, {
			x: -100,
			y: -100,
			transformOrigin: "50% 50%"
		})
	})();
	(function() {
		k = gsap.timeline({
			onUpdate: t
		});
		k.to(".pContainer, .sparkle", {
			duration: 6,
			motionPath: {
				path: ".treePath",
				autoRotate: !1
			},
			ease: "linear"
		}).to(".pContainer, .sparkle", {
			duration: 1,
			onStart: function() {
				e = !1
			},
			x: q[0].x,
			y: q[0].y
		}).to(".pContainer, .sparkle", {
			duration: 2,
			onStart: function() {
				e = !0
			},
			motionPath: {
				path: ".treeBottomPath",
				autoRotate: !1
			},
			ease: "linear"
		}, "-=0").from(".treeBottomMask", {
			duration: 2,
			drawSVG: "0% 0%",
			stroke: "#FFF",
			ease: "linear"
		}, "-=2")
	})();
	c.from([".treePathMask",
		".treePotMask"
	], {
		drawSVG: "0% 0%",
		stroke: "#FFF",
		stagger: {
			each: 6
		},
		duration: gsap.utils.wrap([6, 1, 2]),
		ease: "linear"
	}).from(".treeStar", {
		duration: 3,
		scaleY: 0,
		scaleX: .15,
		transformOrigin: "50% 50%",
		ease: "elastic(1,0.5)"
	}, "-=4").to(".sparkle", {
		duration: 3,
		opacity: 0,
		ease: "rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})"
	}, "-=0").to(".treeStarOutline", {
			duration: 1,
			opacity: 1,
			ease: "rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})"
		},
		"+=1");
	c.add(k, 0);
	gsap.globalTimeline.timeScale(1.5)
})();