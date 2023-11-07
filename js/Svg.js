const _S = {
	svgfunctions: {
		setSvg: function (mob, name) {
			mob.blocs.svg = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"svg"
			);
			let svgSideLength = _W.worldDatas.mobdatas.svgSideLength;
			mob.blocs.svg.setAttribute("class", name);
			mob.blocs.svg.setAttribute("title", "Change Profil");
			mob.blocs.svg.setAttribute(
				"viewBox",
				"0 0 " + svgSideLength + " " + svgSideLength
			);
			mob.blocs.svg.setAttribute(
				"enable-background",
				"new 0 0 " + svgSideLength + " " + svgSideLength
			);
			for (const name in mob._.stats) {
				if (Object.hasOwnProperty.call(mob._.stats, name)) {
					const stat = mob._.stats[name];
					_S.svgfunctions.setSvgJauge(name, mob);
				}
			}
		},
		setSvgJauge: function (name, mob) {
			let stat = mob._.stats[name];
			let type = stat.svg.type;
			let color = stat.color;
			let r = stat.svg.r;

			mob.blocs[name] = document.createElementNS(
				"http://www.w3.org/2000/svg",
				type
			);
			mob.blocs[name].setAttribute("class", name);
			mob.blocs[name].setAttribute("stroke", color);
			mob.blocs[name].setAttribute("r", r);
			mob.blocs[name].setAttribute(
				"cx",
				_W.worldDatas.mobdatas.svgSideLength / 2
			);
			mob.blocs[name].setAttribute(
				"cy",
				_W.worldDatas.mobdatas.svgSideLength / 2
			);
			mob.blocs[name].setAttribute("fill", "none");
			mob.blocs[name].setAttribute("stroke-width", "4");
			mob.blocs[name].setAttribute(
				"stroke-dasharray",
				mob._.stats[name].strokedasharray
			); //63max
			mob.blocs[name].setAttribute(
				"stroke-dashoffset",
				mob._.stats[name].strokedashoffset
			); //63max
			mob.blocs.svg.appendChild(mob.blocs[name]);
		},
	},
};