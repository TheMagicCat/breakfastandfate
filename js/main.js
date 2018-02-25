(function () {
	const transformString = (v) => `translate3d(${v.x}px, ${v.y}px, 0px) scale(1)`;

	// All this math does is bound + damp the transformations! Can also be done with min/max!
	const movement = (scale, bound, pos) => ((scale * 2) / bound) * pos - scale;

	const reset = (el) => {
		// Could also remove this key to reset to orig. CSS transform!
		el.style.transform = transformString({ x: 0, y: 0 });
	}

	const layout = (el, magnitude) => (ev) => {

		let bounds = el.getBoundingClientRect();

		let txf = transformString({
			x: movement(magnitude, bounds.width, ev.offsetX),
			y: movement(magnitude, bounds.height, ev.offsetY),
		});

		requestAnimationFrame(() => { el.style.transform = txf; });
	}

	const init = (initialMagnitude, root) => {

		const subscribe = (warp, leave) => {
			root.addEventListener('mousemove', warp);
			root.addEventListener('mouseleave', leave);
		}

		const r = (magnitude) => (selector) => {
			// Multiply depth + Subscribe event + Return next chain fn!
			const whoAmI = root.querySelector(selector);
			subscribe(layout(whoAmI, magnitude), reset(el));
			return r(initialMagnitude * 1.2);
		}

		return r(initialMagnitude);
	}

	window.TiltFx = init;

})();