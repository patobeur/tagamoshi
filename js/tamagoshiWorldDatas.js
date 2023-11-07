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
};