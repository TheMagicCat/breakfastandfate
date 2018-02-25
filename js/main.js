(function () {
	function transformString(v) {
		return `translate3d(${v.tX}px, ${v.tY}px, ${v.tZ}px) rotateX(${v.rX}deg) rotateY(${v.rY}deg) rotateZ(${v.rZ}deg) scale(${v.s})`;
	}

	function move(scale, bound, pos) {
		return ((scale * 2) / bound) * pos - scale;
	}

	const defaultOpts = {
		movement: {
			image: {
				translation: { x: -12, y: -12, z: 0 },
				rotation: { x: 0, y: 0, z: 0 },
				scale: 1.1,
			},
			lines: {
				translation: { x: 5, y: 5, z: 0 },
				rotation: { x: 0, y: 0, z: 0 },
				scale: 1,
			},
		},
	};

	class TiltFx {
		constructor(el, options) {
			this.mouseleaveFn = this.mouseleaveFn.bind(this);
			this.mousemoveFn = this.mousemoveFn.bind(this);
			this._layout = this._layout.bind(this);

			this.DOM = { el };
			this.options = Object.assign({}, defaultOpts, options);
			this.DOM.animatable = {};
			this.DOM.animatable.image = this.DOM.el.querySelector('.subject');
			// this.DOM.animatable.lines = this.DOM.el.querySelector('.lines');

			console.log(this.DOM.animatable);
			this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
			this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
		}

		mousemoveFn(ev) {
			window.requestAnimationFrame(() => { this._layout(ev) });
		};

		mouseleaveFn(ev) {
			requestAnimationFrame(() => {
				for (var key in this.DOM.animatable) {
					if (this.DOM.animatable[key]) {
					}
					this.DOM.animatable[key].style.transform = transformString(Object.assign({ tX: 0, tY: 0, tZ: 0, rX: 0, rY: 0, rZ: 0 }, {s: this.options.movement[key].scale}));
				}
			});
		};

		_layout(ev) {
			// Mouse position relative to the main element (this.DOM.el).
			let relmousepos = {
				x: ev.offsetX,
				y: ev.offsetY,
			};

			let bounds = this.DOM.el.getBoundingClientRect();

			// Movement settings for the animatable elements.
			for (var key in this.DOM.animatable) {
				if (this.DOM.animatable[key] == undefined || this.options.movement[key] == undefined) {
					continue;
				}

				let t = this.options.movement[key].translation;
				let r = this.options.movement[key].rotation;
				let s = this.options.movement[key].scale;

				// All this math does is bound + damp the transformations! Can also be done with min/max.
				var transforms = {
					tX: move(t.x, bounds.width, relmousepos.x),
					tY: move(t.y, bounds.height, relmousepos.y),
					tZ: move(t.z, bounds.height, relmousepos.y),
					rX: move(r.x, bounds.height, relmousepos.y),
					rY: move(r.y, bounds.width, relmousepos.x),
					rZ: move(r.z, bounds.width, relmousepos.x),
					s
				}

				let txf = transformString(transforms);

				this.DOM.animatable[key].style.WebkitTransform = txf;
				this.DOM.animatable[key].style.transform = txf;
			};
		}
	}

	window.TiltFx = TiltFx;

})();