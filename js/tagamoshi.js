
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
		_W.worldDatas.scale = 1;
		_W.worldDatas.timescale = 1;
		_W.worldDatas.updateInterval= 1*_W.worldDatas.timescale;
		_W.worldDatas.updatetreeInterval= 10000*_W.worldDatas.timescale;
		_W.worldDatas.updatetreeDropRatePlus = 1000;
		_W.worldDatas.treeConsumableDropChance = .6;
		

		_W.worldDatas.consumableTimeout = 5000 * _W.worldDatas.timescale; // to be active

		_W.worldDatas.consumabledropchance= 1;
		_W.worldDatas.maxconsumable = 20;

		_W.worldDatas.mobdatas = {
			lifeNumber: 2,
			svgSideLength: size,
			mobw: size / 2,
			mobh: size / 2,
			mobwrestin: size / 1.5,
			mobhresting: size / 1.5,
			case: "rgba(155, 155, 55,.2)",
			colors: {
				energie: "#ffffff99", //blanc
				faim: "#ff000099", //rouge
				fatigue: "#00ff0099", //vert
			},
		};
		_W.worldDatas.maxreplicaton= 20;
		_W.worldDatas.mobDeleteTimeout= 5000; // 5000ms -> 5sec
		_W.worldDatas.roomSideLength= 100; //Math.floor(window.innerWidth / 5),
		_W.worldDatas.alldisfontsize= 1; // div alldis


		// display 
		_W.worldDatas.displayEnemiesUnderMob = true;
		_W.worldDatas.disfontsize= .7, // all dis in div alldis
		_W.worldDatas.disconsumablefontsize= _W.worldDatas.disfontsize, //rem
		_W.worldDatas.disstarvingfontsize= _W.worldDatas.disfontsize, //rem
		_W.worldDatas.mobEmojiFontSize= _W.worldDatas.disfontsize, //rem
		_W.worldDatas.dismyidfontsize= _W.worldDatas.disfontsize, //rem
		_W.worldDatas.disvoisinsfontsize= _W.worldDatas.disfontsize, //rem
		_W.worldDatas.distextefontsize= _W.worldDatas.disfontsize, //rem

		_W.worldDatas.disinfomobfontsize= .8, //rem
		_W.worldDatas.disinfomobtagfontsize= .7, //rem

		_W.worldDatas.treedatas= {
			w: 16*.8,
			h: 16*.8,
			fontSize: 0.8,
			backgroundColor: 0.8,
		};
		_W.worldDatas.consumabledatas= {
			w: 16*.8,
			h: 16*.8,
			fontSize: 0.8,
			backgroundColor: 0.8,
		};
	},
	start: function () {
		this.setdatas();
		_F.frontFunctions.addCss();
		_W.worldFunctions.createWorldDivsAndAddToDom();
		_W.worldFunctions.createCountersDivsAndAddToDom();
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
