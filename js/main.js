(function () {
	const transformString = (v) => `translate3d(${v.x}px, ${v.y}px, 0px) scale(1)`;

	// All this math does is bound + damp the transformations! Can also be done with min/max.
	const move = (scale, bound, pos) => ((scale * 2) / bound) * pos - scale;

	const init = (magnitude, root) => {

		const _layout = (el, ev) => {
	
			let bounds = el.getBoundingClientRect();
	
			let txf = transformString({
				x: move(magnitude, bounds.width, ev.offsetX),
				y: move(magnitude, bounds.height, ev.offsetY),
			});
	
			// el.style.WebkitTransform = txf;
			requestAnimationFrame(() => { el.style.transform = txf; });
		}

		const reset = () => {
			root.style.transform = transformString(0);
		}

		const mouseleaveFn = (ev) => {
			requestAnimationFrame(() => {
			});
		}

		root.addEventListener('mousemove', _layout);
		root.addEventListener('mouseleave', mouseleaveFn);

		const r = (selector) => {
			const moveMe = root.querySelector(selector);
			return r;
			
		}

		return r;
	}

	window.TiltFx = init;

})();