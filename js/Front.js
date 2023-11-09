const _F = {
	frontFunctions: {
		createDiv: function (params) {
			let element = document.createElement(params.tag);
			if (params.attributes) {
				for (const key in params.attributes) {
					if (Object.hasOwnProperty.call(params.attributes, key)) {
						element[key] = params.attributes[key];
					}
					if (params.style) {
						for (const key2 in params.style) {
							if (Object.hasOwnProperty.call(params.style, key2)) {
								element.style[key2] = params.style[key2];
							}
						}
					}
				}
			}
			return element;
		},
		addCss: function () {
			let stringcss = _J.jsons.cssString();
			// let stringcss = _J.jsons.abc;
			let style = document.createElement("style");
			style.textContent = _T.tools.sanitize(stringcss);
			style.id = "css";
			document.getElementsByTagName("head")[0].appendChild(style);
		},
		refreshSvgJauge: function (mob, valuename) {
			let v = mob._.stats[valuename];
			mob.blocs[valuename].setAttribute(
				"stroke-dashoffset",
				mob._.stats[valuename].strokedashoffset +
					(Math.floor((v.cur / v.max) * 100) / 100) *
						mob._.stats[valuename].strokedasharray
			); //+ (v.regen < 0 ? -_O.strokeOffset : 0);
		},

		_handleMouseWheel: function (event) {
			if (event.ctrlKey === false && event.altKey === false) {
				// if(event.target.className==="allrooms"){
				// 	console.info(event);
				// 	console.info(event.deltaY);
				// 	_W.worldDatas.scale += 1 * (event.deltaY > 0 ? -.2 : .2);
				// 	let rect = _W.worldDiv.getBoundingClientRect();
				// 	console.log(rect.top,rect.left)
				// 	_W.worldDiv.style.transform= "scale("+_W.worldDatas.scale+")"
				// 	_W.worldDiv.style.top = Math.floor(_W.worldDiv.style.left*(-1*_W.worldDatas.scale))+'px'
				// 	_W.worldDiv.style.left = Math.floor(_W.worldDiv.style.left*(-1*_W.worldDatas.scale))+'px'
				// }
			}
		},
	},
};