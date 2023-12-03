const _Con = {
	div: null,
	divs:{},
	emojis: ["🐰", "🌴", "🍒", "🗺️"],
	init: function () {
		// this.create();
	},
	create: function () {
		// _W.worldDatas.hd = false;
		let objets = [
			{
				objet: {
					name: "_W",
					function: "worldDatas",
					sousfunction: false,
					valueName: "hd",
				},
				type: "boolean",
			},
			{
				objet: {
					name: "_W",
					function: "worldDatas",
					sousfunction: false,
					valueName: "maxconsumable",
				},
				type: "number",
			},
		];

		this.div = _T.tools.createDiv({
			tag: "div",
			attributes: {
				id: "console",
				className: "console",
			},
		});

		for (const key in objets) {
			if (Object.hasOwnProperty.call(objets, key)) {
				let item = this.getObjAndValue(objets[key]);
				// console.log(key, item);
				this.createNewDiv(item);
			}
		}
		document.body.appendChild(this.div);
	},
	getObjAndValue: function (item) {
		let objet = item.objet;
		let newobjet = null;
		let value = null;
		if (objet && objet.name) {
			newobjet = _W;
			if (objet.function) {
				newobjet = newobjet[objet.function];
				if (objet.sousfunction) {
					newobjet = newobjet[objet.sousfunction];
				}
			}
		}
		// need clone ??
		if (newobjet != null) value = newobjet[objet.valueName];
		if (value != null) {
			objet[objet.valueName] = value;
			console.log(objet);
			return objet;
		}
		return false;
	},
	createNewDiv: function (item) {
		let value = item[item.valueName];
		this.divs[item.valueName] = _T.tools.createDiv({
			tag: "div",
			attributes: {
				className:
					item.function +
					(item.sousfunction ? "-" + item.sousfunction : "") +
					"-" + item.valueName,
				textContent: item.valueName +':'+ (value ? value : "ko"),
			},
			// style: {
			// 	textContent: item.value,
			// },
		});
		this.div.appendChild(this.divs[item.valueName]);
	},
};
