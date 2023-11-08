"use strict";
// what else ?
const _O = { // Ordinator
	indexedRoomsByCaseNumber: {}, //all Rooms by it number
	indexedconsumableByIds: {}, //all fruits by it number
	indexedtreeByIds: {}, //all tree by it number
	indexedMobsBymobIds: {}, //all mobs by its ids
	arrayRoomsIds: [], //all RoomsIds by arrival
	arrayTreesByIds: [], //all TreesIds by arrival
	mouse: { x: 0, y: 0, isDragging: false },

	
	// communsFunctions: {
	// 	setNewPosInThisRoom: function (obj, objdatas, parent = false) {
	// 		if (parent) {
	// 			obj._.s.actual.RoomNum = parent._.s.actual.RoomNum;
	// 		}
	// 		let roomCoords =
	// 			_O.indexedRoomsByCaseNumber[obj._.s.actual.RoomNum].coords;

	// 		let next = {
	// 			x: roomCoords.x + obj._.s.actual.x,
	// 			y: roomCoords.y + obj._.s.actual.y,
	// 		};
	// 		obj._.s.actual.x = next.x;
	// 		obj._.s.actual.y = next.y;

	// 		obj.divElement.style.left = obj._.s.actual.x - objdatas.w / 2 + "px";
	// 		obj.divElement.style.top = obj._.s.actual.y - objdatas.h / 2 + "px";
	// 	},
	// 	setPos: function (obj, objdatas) {
	// 		let rand = _T.tools.rand(0, _O.arrayRoomsIds.length - 1);
	// 		obj._.s.actual.RoomNum = _O.arrayRoomsIds[rand];
	// 		let roomCoords =
	// 			_O.indexedRoomsByCaseNumber[obj._.s.actual.RoomNum].roomCoords;

	// 		let next = {
	// 			x: roomCoords.x + obj._.s.actual.x,
	// 			y: roomCoords.y + obj._.s.actual.y,
	// 		};
	// 		obj._.s.actual.x = next.x;
	// 		obj._.s.actual.y = next.y;

	// 		obj.divElement.style.left = obj._.s.actual.x - objdatas.w / 2 + "px";
	// 		obj.divElement.style.top = obj._.s.actual.y - objdatas.h / 2 + "px";
	// 	},
	// },

	setdatas: function () {
		let size = 52;
		_W.worldDatas.mobdatas = {
			svgSideLength: size,
			mobw: size / 2,
			mobh: size / 2,
			mobwrestin: size / 1.5,
			mobhresting: size / 1.5,
			case: "rgba(155, 155, 55,.2)",
			cssfontsize: 5, //rem
			cssfonticosize: 1.2, //rem
			colors: {
				energie: "#ffffffDD", //blanc
				faim: "#ff0000", //rouge
				fatigue: "#00ff00", //vert
			},
		};
	},
	start: function () {
		this.setdatas();
		_F.frontFunctions.addCss();
		_W.worldFunctions.createWorldDivsAndAddToDom();
		_W.worldFunctions.createMobSheatsArray();
		_W.worldFunctions.createconsumableSheatsArray();
		_W.worldFunctions.createtreeSheatsArray();
		_W.worldFunctions.hydrateWorld(); // mobs will auto start
		_L.listenerFunctions.addWorldListener();
	},
};
window.addEventListener("DOMContentLoaded", () => {
	_O.start();
});
