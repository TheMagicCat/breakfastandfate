(function () {
	// const transformString = (v) => `translate3d(${v.x}px, ${v.y}px, 0px)`;
	const transformString = (v) => `matrix(${v.s}, 0, 0, ${v.s}, ${v.x}, ${v.y})`;

	// All this math does is bound + damp the transformations! Can also be done with min/max!
	const movement = (scale, bound, pos) => ((scale * 2) / bound) * pos - scale;

	const reset = (el, initialScale) => {
		// Could also remove this key to reset to orig. CSS transform!
		return () => { el.style.transform = transformString({ x: 0, y: 0, s: initialScale }) };
	}

	const re = /(?:matrix|scale)\(\s*(\d\.?\d*)/g;
	const parseScale = (el) => {
		const xf = getComputedStyle(el).transform || '';
		const matches = re.exec(xf); 
		return matches ? Number.parseFloat(matches[1]) : 1.0;
	}

	const layout = (el, magnitude, root, initialScale) => (ev) => {

		let bounds = root.getBoundingClientRect();

		let txf = transformString({
			x: movement(magnitude, bounds.width, ev.offsetX),
			y: movement(magnitude, bounds.height, ev.offsetY),
			s: initialScale,
		});

		requestAnimationFrame(() => { el.style.transform = txf; });
	}

	const init = (initialMagnitude, root) => {

		const subscribe = (warp, leave) => {
			root.addEventListener('mousemove', warp);
			// root.addEventListener('mouseleave', leave);
		}

		const stack = (magnitude) => (selector) => {
			// Multiply depth + Subscribe event + Return next chain fn!
			const whoAmI = root.querySelector(selector);
			const initialScale = 1.1;
			subscribe(layout(whoAmI, magnitude, root, initialScale), reset(whoAmI, initialScale));
			return { next: stack(magnitude * 1.2) };
		}

		return { next: stack(initialMagnitude) };
	}

	window.TiltFx = init;

})();