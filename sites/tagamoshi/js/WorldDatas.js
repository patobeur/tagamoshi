const _W = {
	worldDatas: {
		roomIds: 0,
		// ----------------
		mobIds: 0,
		mobSheatsArray: [],
		mobdatas: {},
		// ----------------
		treeIds: 0,
		treeSheatsArray: [],
		threechance: 0.6,
		treedatas: {},
		// ----------------
		consumableIds: 0,
		consumableSheatsArray: [],
		consumabledatas: {},
		// ----------------
		counters: {},
		mobCounter: 0,
		treeCounter: 0,
		consumableCounter: 0,
		roomCounter: 0,
		// -------
		mobRecord: 0,
		treeRecord: 0,
		consumableRecord: 0,
		roomRecord: 0,
		// ----------------
	},
	worldFunctions: {
		
		createWorldDivsAndAddToDom: function () {
			_W.worldDiv = _T.tools.createDiv({
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
			_O.worldRoomsDiv = _T.tools.createDiv({
				tag: "div",
				attributes: {
					className: "allrooms",
				},
			});

			_O.worldMobsDiv = _T.tools.createDiv({
				tag: "div",
				attributes: {
					className: "allmobs",
				},
			});

			_W.worldDiv.appendChild(_O.worldRoomsDiv);
			_W.worldDiv.appendChild(_O.worldMobsDiv);
			document.body.prepend(_W.worldDiv);
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
			for (let i = 0; i < _W.worldDatas.mobdatas.lifeNumber; i++) {
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
	communsFunctions: {
		setCenterPosInThisRoom: function (obj, objdatas, parent = false) {
			if (parent) {
				obj._.s.actual.RoomNum = parent._.s.actual.RoomNum;
			}
			let roomCoords =
				_O.indexedRoomsByCaseNumber[obj._.s.actual.RoomNum].coords;

			let next = {
				x: roomCoords.x + _W.worldDatas.roomSideLength/2,
				y: roomCoords.y + _W.worldDatas.roomSideLength/2,
			};
			obj._.s.actual.x = next.x;
			obj._.s.actual.y = next.y;

			obj.divElement.style.left = obj._.s.actual.x - objdatas.w / 2 + "px";
			obj.divElement.style.top = obj._.s.actual.y - objdatas.h / 2 + "px";
		},
		
		setAleaPosInThisRoom: function (obj,objdatas) {
			
			let roomCoords = _O.indexedRoomsByCaseNumber[obj._.s.actual.RoomNum].coords;

			let next = {
				x: roomCoords.x + _T.tools.rand(0, _W.worldDatas.roomSideLength),
				y: roomCoords.y + + _T.tools.rand(0, _W.worldDatas.roomSideLength)
			};
			obj._.s.actual.x = next.x
			obj._.s.actual.y = next.y

			obj.divElement.style.left = obj._.s.actual.x - objdatas.w / 2 + "px";
			obj.divElement.style.top = obj._.s.actual.y - objdatas.h / 2 + "px";
		},
		
		setNewPosInThisRoom: function (obj, objdatas, parent = false) {
			if (parent) {
				obj._.s.actual.RoomNum = parent._.s.actual.RoomNum;
			}
			let roomCoords =
				_O.indexedRoomsByCaseNumber[obj._.s.actual.RoomNum].coords;

			let next = {
				x: roomCoords.x + obj._.s.actual.x,
				y: roomCoords.y + obj._.s.actual.y,
			};
			obj._.s.actual.x = next.x;
			obj._.s.actual.y = next.y;

			obj.divElement.style.left = obj._.s.actual.x - objdatas.w / 2 + "px";
			obj.divElement.style.top = obj._.s.actual.y - objdatas.h / 2 + "px";
		},
		setPos: function (obj, objdatas) {
			let rand = _T.tools.rand(0, _O.arrayRoomsIds.length - 1);
			obj._.s.actual.RoomNum = _O.arrayRoomsIds[rand];
			let roomCoords =
				_O.indexedRoomsByCaseNumber[obj._.s.actual.RoomNum].roomCoords;

			let next = {
				x: roomCoords.x + obj._.s.actual.x,
				y: roomCoords.y + obj._.s.actual.y,
			};
			obj._.s.actual.x = next.x;
			obj._.s.actual.y = next.y;

			obj.divElement.style.left = obj._.s.actual.x - objdatas.w / 2 + "px";
			obj.divElement.style.top = obj._.s.actual.y - objdatas.h / 2 + "px";
		},
	},
};