const _W = {
	worldDatas: {
		lifeNumber: 2,
		updateInterval: 10,
		maxreplicaton: 20,
		mobDeleteTimeout: 5000, // 5000ms -> 5sec
		scale: 1,
		roomSideLength: 100, //Math.floor(window.innerWidth / 5),
		sizes: {
			size: {
				w: Math.floor(window.innerWidth / 1.05),
				h: Math.floor(window.innerHeight / 1.1),
			},
			origine: {
				w: Math.floor(window.innerWidth / 1.05),
				h: Math.floor(window.innerHeight / 1.1),
			},
		},
		roomIds: 0,
		// ----------------
		consumableIds: 0,
		consumableCounter: 0,
		consumableSheatsArray: [],
		consumablechance: 0.5,
		consumabledatas: {
			w: 12, // collateral display damages if changed
			h: 12, // collateral display damages if changed
			fontrem: 0.8,
		},
		// ----------------
		mobIds: 0,
		mobCounter: 0,
		mobSheatsArray: [],
		// ----------------
		treeIds: 0,
		treeCounter: 0,
		treeSheatsArray: [],
		threechance: 0.6,
		treedatas: {
			w: 48, // collateral display damages if changed
			h: 48, // collateral display damages if changed
			fontrem: 0.8,
		},
		mobdatas: {},
	},
	worldFunctions: {
		createWorldDivsAndAddToDom: function () {
			_O.worldDiv = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "world",
				},
				style: {
					top: window.innerHeight / 2 - _W.worldDatas.sizes.size.h / 2 + "px",
					left: window.innerWidth / 2 - _W.worldDatas.sizes.size.w / 2 + "px",
					height: _W.worldDatas.sizes.size.h + "px",
					width: _W.worldDatas.sizes.size.w + "px",
					position: "absolute",
				},
			});
			_O.worldRoomsDiv = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "allrooms",
				},
			});

			_O.worldMobsDiv = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "allmobs",
				},
			});

			_O.worldDiv.appendChild(_O.worldRoomsDiv);
			_O.worldDiv.appendChild(_O.worldMobsDiv);
			document.body.prepend(_O.worldDiv);
		},
		createtreeSheatsArray: function () {
			for (const key in _J.jsons.indexedFlora.tree) {
				if (Object.hasOwnProperty.call(_J.jsons.indexedFlora.tree, key)) {
					_W.worldDatas.treeSheatsArray.push(_J.jsons.indexedFlora.tree[key]);
				}
			}
		},
		createconsumableSheatsArray: function () {
			for (const key in _J.jsons.indexedFlora.consumable) {
				if (Object.hasOwnProperty.call(_J.jsons.indexedFlora.consumable, key)) {
					_W.worldDatas.consumableSheatsArray.push(
						_J.jsons.indexedFlora.consumable[key]
					);
				}
			}
		},
		createMobSheatsArray: function () {
			for (const key in _J.jsons.indexedFauna) {
				if (Object.hasOwnProperty.call(_J.jsons.indexedFauna, key)) {
					_W.worldDatas.mobSheatsArray.push(_J.jsons.indexedFauna[key]);
				}
			}
		},
		hydrateWorld: function () {
			for (let i = 0; i < _W.worldDatas.lifeNumber; i++) {
				let mob = _M.mob();
				mob.createNewMobDiv();
				mob.initiate();
				_O.indexedMobsBymobIds[mob._.perso.id] = mob;
			}
		},
		isXYInWorld: function (x, y) {
			return (
				x > 0 &&
				x < _W.worldDatas.sizes.size.w &&
				y > 0 &&
				y < _W.worldDatas.sizes.size.h
			);
		},
	},
};