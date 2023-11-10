const _F = {
	frontFunctions: {
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