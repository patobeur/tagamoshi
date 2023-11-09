
"use strict";
const _WA = new FullScreenManager()
// what else ?
const _O = { // Ordinator
	indexedRoomsByCaseNumber: {}, //all Rooms by it number
	indexedconsumableByIds: {}, //all fruits by it number
	indexedtreeByIds: {}, //all tree by it number
	indexedMobsBymobIds: {}, //all mobs by its ids
	arrayRoomsIds: [], //all RoomsIds by arrival
	arrayTreesByIds: [], //all TreesIds by arrival
	mouse: { x: 0, y: 0, isDragging: false },
	setdatas: function () {
		let size = 52;
		_W.worldDatas.mobdatas = {
			lifeNumber: 10,
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
	_WA.init()
});
