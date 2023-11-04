"use strict";
const _O = {
	// MOB : mobile object behaviour
	mouse: { x: 0, y: 0, isDragging: false },
	indexedRoomsByCaseNumber: {}, //all cases by it number
	indexedconsumableByIds: {}, //all cases by it number
	indexedtreeByIds: {}, //all cases by it number
	indexedMobsBymobIds: {}, //all mobs by its ids
	worldDatas: {
		lifeNumber: 2,
		updateInterval: 10,
		maxreplicaton: 20,
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
		mobIds: 0,
		consumableIds: 0,
		roomIds: 0,
		mobSheatsArray: [],
		consumableheatsArray: [],
		consumablechance:0.5,
		consumabledatas: {
			consumablew: 24, // collateral display damages if changed
			consumableh: 24, // collateral display damages if changed
		},
		mobdatas: {
			svgfontsize: 8,
			svgfontposX: 12,
			svgfontposY: 15,
			svgfontcolor: "white",
			cssfontsize: 0.5, //rem
			colors: {
				energie: "#ff1f87",
				faim: "#87ff1f",
				fatigue: "#1f87ff",
			},
			mobw: 24, // collateral display damages if changed
			mobh: 24, // collateral display damages if changed
			mobwresting: 24 + 14, // collateral display damages if changed
			mobhresting: 24 + 14, // collateral display damages if changed
			case: "rgba(155, 155, 55,.2)",
		},
		treeIds: 0,
		treeSheatsArray: [],
		threechance:.6,
		treedatas: {
			treew: 48, // collateral display damages if changed
			treeh: 48, // collateral display damages if changed
		},
	},
	mob: function () {
		let mob = {
			mobDivElement: document.createElement("div"),
			blocs: {},
			actionsTodo: [],
			test: Math.floor(Math.random() * _O.worldDatas.mobSheatsArray.length),
			_: {
				stats: {
					energie: {
						color: _O.worldDatas.mobdatas.colors.energie,
						cur: _O.tools.rand(15, 45),
						min: 0,
						max: 100,
						regen: 0.05,
						sens: 1,
						active: false,
						rested: false,
						needrest: false,
						strokedashoffset: 48,
						strokedasharray: 48,
						whenactive: "dying",
						svg: {
							type: "circle",
							r: 7,
						},
					},
					faim: {
						color: _O.worldDatas.mobdatas.colors.faim,
						cur: _O.tools.rand(10, 20),
						min: 0,
						max: 100,
						regen: -0.03,
						sens: -1,
						active: false,
						rested: false,
						needrest: false,
						strokedashoffset: 79,
						strokedasharray: 79,
						whenactive: "starving",
						svg: {
							type: "circle",
							r: 9,
						},
					},
					fatigue: {
						color: _O.worldDatas.mobdatas.colors.fatigue,
						cur: _O.tools.rand(10, 20),
						min: 0,
						max: 100,
						regen: -0.05,
						sens: 1,
						active: false,
						rested: false,
						needrest: false,
						strokedashoffset: 69,
						strokedasharray: 69,
						whenactive: "exhausted",
						svg: {
							type: "circle",
							r: 11,
						},
					},
				},
				perso: {
					id: null,
					immat: null, // name
					type: null, // type of mob
					IA: true,
					xp: 0,
					dicoveredCase: [],
					clones: 0,
					speed: 1,
					updateInterval: _O.worldDatas.updateInterval + _O.tools.rand(0, 50),
					alone: true,
					parentId: null,
				},
				s: {
					actual: {
						x: _O.tools.rand(0, this.worldDatas.sizes.size.w),
						y: _O.tools.rand(0, this.worldDatas.sizes.size.h),
						z: _O.tools.rand(-1, 1),
						RoomNum: 0,
					},
					futur: {
						x: 0,
						y: 0,
						z: 0,
						RoomNum: 0,
					},
					past: {
						x: 0,
						y: 0,
						z: 0,
						RoomNum: 0,
					},
				},
				// ----------- todo regroupe dir,delayBeforeChangeDir,diramplitude
				// dirx: {
				// 	cur: _O.tools.rand(0, 360),
				// 	amplitude: 45,
				// 	delayChange: { cur: 0, max: 10 },
				// },
				dir: _O.tools.rand(0, 360),
				delayBeforeChangeDir: { cur: 0, max: 30 },
				diramplitude: 45,
				// -------------------------
				status: { cur: 0, old: 0 },
				mouse: this.mouse,
				sheat:
					_O.worldDatas.mobSheatsArray[
						Math.floor(Math.random() * _O.worldDatas.mobSheatsArray.length)
					],
				test: _O.worldDatas.mobSheatsArray[self.test],
			},
			initiate: function () {
				_O.mobFunctions.setFuturPosAndRoom(this);
				_O.frontFunctions.updateMobDivElementPos(this);
				_O.frontFunctions.setMobDivElementsAndAddToDom(this);
				setInterval(() => {
					this.update();
				}, this._.perso.updateInterval);
			},
			createNewMobDiv: function () {
				_O.mobFunctions.setNewImmat(this);
				// init some datas
				this._.s.actual.RoomNum = _O.roomFunctions.getRoomNumberFromXY(
					this._.s.actual.x,
					this._.s.actual.y
				);

				this.mobDivElement.title = this._.perso.id + " " + this._.perso.immat;
				this.mobDivElement.className =
					this._.sheat.model +
					" mob" +
					(mob._.perso.id != 0 ? " ia" : " me") +
					(mob._.perso.parentId ? " clone" : "");

				_O.worldDatas.mobIds++;
			},
			applynextPos: function () {
				this._.s.past = structuredClone(this._.s.actual);
				this._.s.actual = structuredClone(this._.s.futur);
			},
			changedir: function () {
				if (this._.delayBeforeChangeDir.cur === 0) {
					// let choix = _O.tools.rand(0, 1) === 1 ? -1 : 1;
					this._.dir += _O.tools.rand(0, 1) === 1 ? -1 : 1;
					if (this._.dir > 360) this._.dir = 360 - this._.dir;
					if (this._.dir < 0) this._.dir = this._.dir + 360;
				}
				this._.delayBeforeChangeDir.cur < this._.delayBeforeChangeDir.max
					? this._.delayBeforeChangeDir.cur++
					: (this._.delayBeforeChangeDir.cur = 0);
			},
			setFatigueOrNot: function (mob) {
				let fat = mob._.stats.fatigue;
				if (fat.cur <= fat.min) {
					if (fat.needrest) fat.needrest = false;
					if (fat.active) fat.active = false;
					if (!fat.rested) fat.rested = true;
				} else {
					// fat.active = false;
					fat.sens = 5;
				}
			},
			doAction: function (mob) {
				switch (mob.actionsTodo[0]) {
					case "rest":
						if (!mob.mobDivElement.classList.contains("exhausted")) {
							mob.mobDivElement.classList.add("exhausted");
						}
						if (mob.mobDivElement.classList.contains("move")) {
							mob.mobDivElement.classList.remove("move");
						}
						break;
					case "move":
						mob.changedir();
						_O.mobFunctions.setFuturPosAndRoom(mob);
						this.applynextPos();

						mob._.stats.fatigue.sens = -3;
						_O.frontFunctions.updateMobDivElementPos(mob);

						if (mob.mobDivElement.classList.contains("exhausted")) {
							mob.mobDivElement.classList.remove("exhausted");
						}
						if (!mob.mobDivElement.classList.contains("move")) {
							mob.mobDivElement.classList.add("move");
						}
						break;
					case "die":
						// todo
						break;

					default:
						break;
				}
			},
			_step: function () {
				_O.roomFunctions.siJeChangeDeCase(this);
				_O.roomFunctions.isThereAnyOne(mob);

				let fat = this._.stats.fatigue;
				this.setFatigueOrNot(this);
				// pas reposé et fatigué
				if (fat.needrest) {
					this.actionsTodo[0] = "rest";
				} else {
					fat.needrest = fat.cur >= fat.max * 0.8; // >80%
				}
				if (!fat.needrest) {
					this.actionsTodo[0] = "move";
				}

				this.doAction(this);

				_O.mobFunctions.regenvalue(this, "fatigue");
				// _O.mobFunctions.regenvalue(this, "energie");

				_O.mobFunctions.regen_energie(this, "energie");
				_O.mobFunctions.regenvalue(this, "faim");

				_O.mobFunctions.siJeMeReplique(this);
			},
			update: function () {
				this._step();
			},
		};
		return { ...mob };
	},
	svgfunctions: {
		setSvg: function (mob, name) {
			mob.blocs.svg = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"svg"
			);
			mob.blocs.svg.setAttribute("class", name);
			mob.blocs.svg.setAttribute("title", "Change Profil");
			mob.blocs.svg.setAttribute("viewBox", "0 0 24 24");
			mob.blocs.svg.setAttribute("enable-background", "new -24 -24 48 48");
			for (const key in mob._.stats) {
				if (Object.hasOwnProperty.call(mob._.stats, key)) {
					const stat = mob._.stats[key];
					_O.svgfunctions.setSvgJauge(
						mob,
						stat.svg.type,
						key,
						stat.color,
						stat.svg.r
					);
				}
			}
			_O.svgfunctions.setSvgTexte(mob, "text");
			mob.blocs.svg.appendChild(mob.svgtextgrid);
		},
		setSvgTexte: function (mob, type) {
			mob.svgtextgrid = document.createElementNS(
				"http://www.w3.org/2000/svg",
				type
			);
			mob.svgtextgridNum = document.createTextNode(mob._.s.actual.RoomNum);
			// mob.svgtextgrid.setAttribute("transform", "translate(?, ?) rotate(90)"); // ??
			mob.svgtextgrid.setAttribute("x", _O.worldDatas.mobdatas.svgfontposX);
			mob.svgtextgrid.setAttribute("y", _O.worldDatas.mobdatas.svgfontposY);
			mob.svgtextgrid.setAttribute(
				"font-size",
				_O.worldDatas.mobdatas.svgfontsize
			);
			mob.svgtextgrid.setAttribute("text-anchor", "middle");
			mob.svgtextgrid.setAttribute("fill", _O.worldDatas.mobdatas.svgfontcolor);
			mob.svgtextgrid.appendChild(mob.svgtextgridNum);
			mob.blocs.svg.appendChild(mob.svgtextgrid);
		},
		setSvgJauge: function (mob, type, name, color, r) {
			mob.blocs[name] = document.createElementNS(
				"http://www.w3.org/2000/svg",
				type
			);
			mob.blocs[name].setAttribute("class", name);
			mob.blocs[name].setAttribute("stroke", color);
			mob.blocs[name].setAttribute("r", r);
			mob.blocs[name].setAttribute("cx", "12");
			mob.blocs[name].setAttribute("cy", "12");
			mob.blocs[name].setAttribute("fill", "none");
			mob.blocs[name].setAttribute("stroke-width", "2");
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
	rewardBonus: {
		newRoomdiscovered: function (mob) {
			mob._.perso.xp += 50;
			mob._.stats.fatigue.max += 2;
			mob._.stats.energie.max += 2;
			if (mob._.perso.updateInterval >= _O.worldDatas.updateInterval + 5)
				mob._.perso.updateInterval -= 5;
			// add Room to personal list
			mob._.perso.dicoveredCase.push(mob._.s.actual.RoomNum);
		},
		replication: function (mob) {
			mob._.stats.energie.cur = mob._.stats.energie.cur / 2;
			mob._.stats.faim.cur = mob._.stats.faim.cur * 1.5;
			mob._.stats.fatigue.max = mob._.stats.fatigue.max * 0.9;
			mob._.perso.updateInterval += 2;
		},
	},
	roomFunctions: {
		siJeChangeDeCase: function (mob) {
			if (mob._.s.past.RoomNum != mob._.s.actual.RoomNum) {
				// siLaCaseEstInconue
				_O.roomFunctions.checkIfRoomeExiste(mob);
				_O.roomFunctions.exitCase(mob);
				_O.roomFunctions.enterCase(mob);
			}
		},
		checkIfRoomeExiste: function (mob) {
			let actualRoom = _O.indexedRoomsByCaseNumber[mob._.s.actual.RoomNum];
			if (typeof actualRoom === "undefined") {
				_O.roomFunctions.createNewRoom(mob._.s.actual.RoomNum);

				_O.rewardBonus.newRoomdiscovered(mob);

				mob.svgtextgridNum.textContent = mob._.s.actual.RoomNum;

				if (_O.worldDatas.roomIds > _O.worldDatas.mobIds * 2) {
					_O.decorationFunctions.addtree(mob._.s.actual.RoomNum);
					_O.decorationFunctions.addtree(mob._.s.actual.RoomNum);
					_O.decorationFunctions.addtree(mob._.s.actual.RoomNum);
					_O.decorationFunctions.addtree(mob._.s.actual.RoomNum);
					_O.consumableFunctions.addconsumable(mob._.s.actual.RoomNum);
				}
			}
		},
		isThereAnyOne: function (mob) {
			mob._.perso.alone = true;

			let enemies = [];
			let consumables = [];
			let trees = [];
			let stringEnemies = "";
			let roomes = _O.roomFunctions.getAllThe9RoomsAroundXY(
				mob._.s.actual.x,
				mob._.s.actual.y
			);
			let habitantscount = 0;
			let roomscount = 0;
			let consumablescount = 0;
			let treescount = 0;
			roomes.forEach((RoomNum) => {
				let currentcase = _O.indexedRoomsByCaseNumber[RoomNum];
				if (currentcase) {
					if(currentcase.habitants){
					for (const key in currentcase.habitants) {
						if (Object.hasOwnProperty.call(currentcase.habitants, key)) {
							enemies.push(currentcase.habitants[key]);
							stringEnemies =
								stringEnemies + (habitantscount > 0 ? "," : "") + key;
							habitantscount++;
						}
					}}
					if(currentcase.consumables){
					for (const key in currentcase.consumables) {
						if (Object.hasOwnProperty.call(currentcase.consumables, key)) {
							consumables.push(currentcase.consumables[key]);
							consumablescount++;
						}
					}}
					if(currentcase.decors){
					for (const key in currentcase.trees) {
						if (Object.hasOwnProperty.call(currentcase.trees, key)) {
							trees.push(currentcase.trees[key]);
							treescount++;
						}
					}}
				}
				roomscount++;
			});
			mob.blocs.voisins.textContent = stringEnemies;
			// console.log("-ici---------------------------------");
			// if (i > 1) console.log(enemies);

			if (habitantscount > 1) {
				mob._.perso.alone = false;
				mob.blocs.alerte.classList.add("up");
			} else {
				mob._.perso.alone = true;
				mob.blocs.alerte.classList.remove("up");
			}
		},
		createNewRoom: function (caseNumber) {
			// case jamais découverte
			let newRoomPos = _O.roomFunctions.getRoomXYFromNumber(caseNumber);
			let newgrid = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "c_" + caseNumber + " room up",
					textContent: caseNumber,
				},
				style: {
					top: newRoomPos.y + "px",
					left: newRoomPos.x + "px",
				},
			});
			_O.indexedRoomsByCaseNumber[caseNumber] = {
				div: newgrid,
				habitants: {},
				trees: {},
				consumables: {},
				coords: { x: newRoomPos.x, y: newRoomPos.y },
			};
			_O.worldDatas.roomIds++;
			_O.worldCasesDiv.prepend(_O.indexedRoomsByCaseNumber[caseNumber].div);
		},
		exitCase: function (mob) {
			let pastCase = _O.indexedRoomsByCaseNumber[mob._.s.past.RoomNum];
			if (pastCase) {
				delete pastCase.habitants[mob._.perso.id];
				let i = 0;
				let mobstring = "";
				for (const key in pastCase.habitants) {
					if (Object.hasOwnProperty.call(pastCase.habitants, key)) {
						mobstring =
							mobstring + (i > 0 ? "," : "") + pastCase.habitants[key].mobid;
						i++;
					}
				}
				pastCase.div.textContent = mobstring;
			}
		},
		enterCase: function (mob) {
			let actualCase = _O.indexedRoomsByCaseNumber[mob._.s.actual.RoomNum];
			if (actualCase) {
				actualCase.habitants[mob._.perso.id] = { mobid: mob._.perso.id };
				// -------------------------------
				let mobstring = "";
				let i = 0;
				for (const key in actualCase.habitants) {
					if (Object.hasOwnProperty.call(actualCase.habitants, key)) {
						mobstring =
							mobstring + (i > 0 ? "," : "") + actualCase.habitants[key].mobid;
						i++;
					}
				}
				actualCase.div.textContent = mobstring;
			} else {
				console.log(`il n'y a pas de actualCase`);
			}
		},
		getRoomXYFromNumber: function (caseNumber) {
			const col =
				((caseNumber - 1) %
					Math.ceil(
						_O.worldDatas.sizes.size.w / _O.worldDatas.roomSideLength
					)) +
				1;
			const row = Math.ceil(
				caseNumber /
					Math.ceil(_O.worldDatas.sizes.size.w / _O.worldDatas.roomSideLength)
			);
			return {
				x: (col - 1) * _O.worldDatas.roomSideLength,
				y: (row - 1) * _O.worldDatas.roomSideLength,
				col: col,
				row: row,
			};
		},
		getRoomNumberFromXY: function (x, y) {
			const col = Math.floor(x / _O.worldDatas.roomSideLength);
			const row = Math.floor(y / _O.worldDatas.roomSideLength);
			return (
				row *
					Math.ceil(_O.worldDatas.sizes.size.w / _O.worldDatas.roomSideLength) +
				col +
				1
			);
		},
		getThe8RoomsAroundXY: function (x, y) {
			const col = Math.floor(x / _O.worldDatas.roomSideLength);
			const row = Math.floor(y / _O.worldDatas.roomSideLength);
			const cols = Math.ceil(
				_O.worldDatas.sizes.size.w / _O.worldDatas.roomSideLength
			);
			const rooms = [];

			// Les 8 cases autour des coordonnées (x, y)
			const offsets = [
				{ x: -1, y: -1 },
				{ x: 0, y: -1 },
				{ x: 1, y: -1 },
				{ x: -1, y: 0 },
				{ x: 1, y: 0 },
				{ x: -1, y: 1 },
				{ x: 0, y: 1 },
				{ x: 1, y: 1 },
			];

			for (const offset of offsets) {
				const newCol = col + offset.x;
				const newRow = row + offset.y;

				// Vérifier que la salle adjacente est dans les limites du monde
				if (newCol >= 0 && newCol < cols && newRow >= 0) {
					const roomNumber = newRow * cols + newCol + 1;
					rooms.push(roomNumber);
				}
			}

			return rooms;
		},
		getAllThe9RoomsAroundXY: function (x, y) {
			const col = Math.floor(x / _O.worldDatas.roomSideLength);
			const row = Math.floor(y / _O.worldDatas.roomSideLength);
			const cols = Math.ceil(
				_O.worldDatas.sizes.size.w / _O.worldDatas.roomSideLength
			);
			const rooms = [];

			const offsets = [
				{ x: -1, y: -1 },
				{ x: 0, y: -1 },
				{ x: 1, y: -1 },
				{ x: -1, y: 0 },
				{ x: 1, y: 0 },
				{ x: 0, y: 0 },
				{ x: -1, y: 1 },
				{ x: 0, y: 1 },
				{ x: 1, y: 1 },
			];

			for (const offset of offsets) {
				const newCol = col + offset.x;
				const newRow = row + offset.y;

				if (newCol >= 0 && newCol < cols && newRow >= 0) {
					const roomNumber = newRow * cols + newCol + 1;
					rooms.push(roomNumber);
				}
			}

			return rooms;
		},
	},
	worldFunctions: {
		createWorldDivsAndAddToDom: function () {
			_O.worldDiv = document.createElement("div");
			_O.worldDiv.className = "world";
			_O.worldDiv.style.height = _O.worldDatas.sizes.size.h + "px";
			_O.worldDiv.style.width = _O.worldDatas.sizes.size.w + "px";
			_O.worldDiv.style.position = "absolute";
			_O.worldDiv.style.top =
				window.innerHeight / 2 - _O.worldDatas.sizes.size.h / 2 + "px";
			_O.worldDiv.style.left =
				window.innerWidth / 2 - _O.worldDatas.sizes.size.w / 2 + "px";

			_O.worldCasesDiv = document.createElement("div");
			_O.worldCasesDiv.className = "allrooms";
			_O.worldMobsDiv = document.createElement("div");
			_O.worldMobsDiv.className = "allmobs";
			_O.worldDiv.appendChild(_O.worldCasesDiv);
			_O.worldDiv.appendChild(_O.worldMobsDiv);
			document.body.prepend(_O.worldDiv);
		},
		createtreeSheatsArray: function () {
			for (const key in _O.jsons.indexedFlora.tree) {
				if (Object.hasOwnProperty.call(_O.jsons.indexedFlora.tree, key)) {
					_O.worldDatas.treeSheatsArray.push(_O.jsons.indexedFlora.tree[key]);
				}
			}
		},
		createconsumableSheatsArray: function () {
			for (const key in _O.jsons.indexedFlora.consumable) {
				if (Object.hasOwnProperty.call(_O.jsons.indexedFlora.consumable, key)) {
					_O.worldDatas.consumableheatsArray.push(
						_O.jsons.indexedFlora.consumable[key]
					);
				}
			}
		},
		createMobSheatsArray: function () {
			for (const key in _O.jsons.indexedFauna) {
				if (Object.hasOwnProperty.call(_O.jsons.indexedFauna, key)) {
					_O.worldDatas.mobSheatsArray.push(_O.jsons.indexedFauna[key]);
				}
			}
		},
		hydrateWorld: function () {
			for (let i = 0; i < _O.worldDatas.lifeNumber; i++) {
				let mob = _O.mob();
				mob.createNewMobDiv();
				mob.initiate();
				_O.indexedMobsBymobIds[mob._.perso.id] = mob;
			}
		},
		isXYInWorld: function (x, y) {
			return (
				x > 0 &&
				x < _O.worldDatas.sizes.size.w &&
				y > 0 &&
				y < _O.worldDatas.sizes.size.h
			);
		},
	},
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
			let stringcss = _O.jsons.cssString();
			let style = document.createElement("style");
			style.textContent = _O.tools.sanitize(stringcss);
			style.id = "css";
			document.getElementsByTagName("head")[0].appendChild(style);
		},
		refreshSvgJauge: function (mob, valuename) {
			let v = mob._.stats[valuename];
			mob.blocs[valuename].setAttribute(
				"stroke-dashoffset",
				mob._.stats[valuename].strokedasharray +
					(Math.floor((v.cur / v.max) * 100) / 100) *
						mob._.stats[valuename].strokedasharray
			); //+ (v.regen < 0 ? -_O.strokeOffset : 0);
		},
		addWorldListerner: function () {
			window.addEventListener(
				"resize",
				(e) => {
					_O.worldDiv.style.top =
						window.innerHeight / 2 - _O.worldDatas.sizes.size.h / 2 + "px";
					_O.worldDiv.style.left =
						window.innerWidth / 2 - _O.worldDatas.sizes.size.w / 2 + "px";
				},
				{ passive: true }
			);

			window.addEventListener("mousedown", (e) => {
				// if (e.target === _O.worldDiv) {
				_O.mouse.isDragging = true;
				_O.mouse.x = e.clientX;
				_O.mouse.y = e.clientY;
				_O.worldDatas.sizes.origine.w = _O.worldDiv.offsetLeft;
				_O.worldDatas.sizes.origine.h = _O.worldDiv.offsetTop;
				_O.worldDiv.classList.add("grab");
				// }
			});

			window.addEventListener("mousemove", (e) => {
				if (_O.mouse.isDragging) {
					const deltaX = e.clientX - _O.mouse.x;
					const deltaY = e.clientY - _O.mouse.y;
					const newWorldX = _O.worldDatas.sizes.origine.w + deltaX;
					const newWorldY = _O.worldDatas.sizes.origine.h + deltaY;

					// pour pas dépasser les limites du monde mais c'est pas top !!
					// if (newWorldX >= 0 && newWorldX <= window.innerWidth - _O.worldDiv.clientWidth) {_O.worldDiv.style.left = newWorldX + "px";}
					// if (newWorldY >= 0 && newWorldY <= window.innerHeight - _O.worldDiv.clientHeight) {_O.worldDiv.style.top = newWorldY + "px";}

					_O.worldDiv.style.left = newWorldX + "px";
					_O.worldDiv.style.top = newWorldY + "px";
				}
			});

			window.addEventListener("mouseup", () => {
				_O.mouse.isDragging = false;
				_O.worldDiv.classList.remove("grab");
			});
		},
		updateMobDivElementPos: function (mob) {
			if (mob._.s.actual.x != mob._.s.past.x)
				mob.mobDivElement.style.left =
					mob._.s.actual.x - _O.worldDatas.mobdatas.mobw / 2 + "px";
			if (mob._.s.actual.y != mob._.s.past.y)
				mob.mobDivElement.style.top =
					mob._.s.actual.y - _O.worldDatas.mobdatas.mobh / 2 + "px";
		},
		setMobDivElementsAndAddToDom: function (mob) {
			_O.svgfunctions.setSvg(mob, "svg");
			mob.mobDivElement.appendChild(mob.blocs.svg);
			//-------------------------------------
			mob.mobDisplayDiv = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "mobdisplay" },
			});
			mob.mobDatasDiv = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "datasdiv" },
			});
			mob.mobDisplayDiv.appendChild(mob.mobDatasDiv);
			mob.mobDivElement.appendChild(mob.mobDisplayDiv);
			//-------------------------------------
			mob.blocs.alldis = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "alldis" },
			});
			//-------------------------------------
			mob.blocs.alerte = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "disalerte", textContent: "☠️" },
			}); //💤🎲💭
			mob.blocs.ico = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "disico",
					textContent: _O.tools.sanitize(mob._.sheat.ico),
				},
			});
			mob.blocs.voisins = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "disvoisins",
					textContent: "...",
				},
			});
			mob.blocs.myid = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "dismyid",
					textContent: mob._.perso.id,
				},
			});
			mob.blocs.alldis.prepend(mob.blocs.myid);
			mob.blocs.alldis.prepend(mob.blocs.alerte);
			mob.blocs.alldis.prepend(mob.blocs.ico);
			mob.blocs.alldis.prepend(mob.blocs.voisins);
			//-------------------------------------

			mob.blocs.infomob = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "disinfomob",
					textContent: "disinfomob",
				},
			});
			mob.blocs.alldis.appendChild(mob.blocs.infomob);
			_O.frontFunctions.setInfoMobListener(mob);

			mob.mobDivElement.appendChild(mob.blocs.alldis);
			//-------------------------------------
			_O.worldMobsDiv.appendChild(mob.mobDivElement);
			// _O.worldCasesDiv.appendChild(mob.mobDivElement);
		},
		setInfoMobListener: function (mob) {
			mob.blocs.alldis.addEventListener("mouseout", () => {
				mob.blocs.infomob.classList.remove("up");
			});
			mob.blocs.alldis.addEventListener("mouseover", () => {
				mob.blocs.infomob.classList.add("up");
				mob.blocs.infomob.textContent = "";

				let immat = _O.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disimmat",
						textContent: "Name: " + mob._.perso.immat,
					},
				});
				let xp = _O.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disxp",
						textContent: "Xp: " + mob._.perso.xp,
					},
				});
				let clones = _O.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disclones",
						textContent: "Cloned: " + mob._.perso.clones,
					},
				});
				mob.blocs.infomob.appendChild(immat);
				mob.blocs.infomob.appendChild(xp);
				mob.blocs.infomob.appendChild(clones);

				// console.log(mob._.perso.immat + " talking : what ?");
				// console.log(this._);
			});
		},
	},
	decorationFunctions: {
		tree: function () {
			let tree = {
				treeDivElement: _O.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "tree",
						textContent: "a",
					},
				}),
				_: {
					stats: {},
					perso: {
						id: null,
						immat: null, // name
						type: null, // type of trees
						updateInterval: _O.worldDatas.updateInterval + _O.tools.rand(0, 50),
					},
					s: {
						actual: {
							x: _O.tools.rand(0, _O.worldDatas.roomSideLength),
							y: _O.tools.rand(0, _O.worldDatas.roomSideLength),
							z: _O.tools.rand(-1, 1),
							RoomNum: 0,
						},
					},
					sheat: null,
				},
				update: function () {},
				initiate: function (tree, caseNumber) {
					_O.decorationFunctions.setNewIDS(tree);
					_O.decorationFunctions.createNewDiv(tree);
					_O.decorationFunctions.setNewPos(tree, caseNumber);
					_O.indexedtreeByIds[tree._.perso.id] = tree;
					_O.indexedRoomsByCaseNumber[caseNumber].trees[tree._.perso.id] = tree
					_O.worldCasesDiv.append(tree.treeDivElement);
				},
			};
			return { ...tree };
		},
		addtree: function (caseNumber) {
			if (_O.tools.rand(0, 100) <= _O.worldDatas.threechance * 100) {
				if (_O.worldDatas.treeIds < _O.worldDatas.roomIds *2) {
					let tree = _O.decorationFunctions.tree();
					tree.initiate(tree, caseNumber);
				}
			}
		},
		createNewDiv: function (tree) {
			tree.treeDivElement = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "tree",
					textContent: tree._.sheat.ico,
				},
			});
			tree.treeDivElement.title = tree._.perso.id + " " + tree._.perso.immat;
			tree.treeDivElement.className = "three " + tree._.sheat.model;
		},
		setNewPos: function (tree, caseNumber) {
			let coords = _O.indexedRoomsByCaseNumber[caseNumber].coords;
			let next = {
				x: coords.x + tree._.s.actual.x - _O.worldDatas.treedatas.treew / 2,
				y: coords.y + tree._.s.actual.y - _O.worldDatas.treedatas.treew / 2,
			};
			tree._.s.actual.x = next.x;
			tree._.s.actual.y = next.y;
			tree.treeDivElement.style.left = tree._.s.actual.x + "px";
			tree.treeDivElement.style.top = tree._.s.actual.y + "px";
		},
		setNewIDS: function (tree) {
			tree._.perso.id = _O.worldDatas.treeIds + 0;
			tree._.perso.type = Math.floor(
				Math.random() * _O.worldDatas.treeSheatsArray.length
			);
			tree._.sheat = _O.worldDatas.treeSheatsArray[tree._.perso.type];
			// ---------------------------------
			let immat = "";
			for (let i = 0; i < 5; i++) {
				immat =
					immat +
					_O.jsons.charactersForImmat.charAt(
						Math.floor(Math.random() * _O.jsons.charactersForImmat.length)
					);
			}
			tree._.perso.immat = immat;
			_O.worldDatas.treeIds++;
		},
	},
	consumableFunctions: {
		consumable: function () {
			let consumable = {
				consumableDivElement: _O.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "consumable",
						textContent: "a",
					},
				}),
				_: {
					stats: {},
					perso: {
						id: null,
						immat: null, // name
						type: null, // type of consumable
						updateInterval: _O.worldDatas.updateInterval + _O.tools.rand(0, 50),
					},
					s: {
						actual: {
							x: _O.tools.rand(0, _O.worldDatas.roomSideLength),
							y: _O.tools.rand(0, _O.worldDatas.roomSideLength),
							z: _O.tools.rand(-1, 1),
							RoomNum: 0,
						},
					},
					sheat: null,
				},
				update: function () {},
				initiate: function (caseNumber) {
					_O.consumableFunctions.setNewIDS(consumable);
					_O.consumableFunctions.createNewDiv(consumable);
					_O.consumableFunctions.setNewPos(consumable, caseNumber);

					_O.indexedconsumableByIds[consumable._.perso.id] = consumable;
					
					_O.indexedRoomsByCaseNumber[caseNumber].consumables[consumable._.perso.id] = consumable

					_O.worldCasesDiv.append(consumable.consumableDivElement);
				},
			};
			return { ...consumable };
		},
		addconsumable: function (caseNumber) {
			if (_O.tools.rand(0, 100) <= _O.worldDatas.consumablechance * 100) {
				if (_O.worldDatas.consumableIds < _O.worldDatas.roomIds / 3) {
					let consumable = _O.consumableFunctions.consumable();
					consumable.initiate(caseNumber);
				}
			}
		},
		createNewDiv: function (consumable) {
			consumable.consumableDivElement = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "consumable",
					textContent: consumable._.sheat.ico,
				},
			});
			consumable.consumableDivElement.title =
				consumable._.perso.id + " " + consumable._.perso.immat;
			consumable.consumableDivElement.className = "consumable " + consumable._.sheat.model
		},
		setNewPos: function (consumable, caseNumber) {
			let coords = _O.indexedRoomsByCaseNumber[caseNumber].coords;
			let next = {
				x: coords.x + consumable._.s.actual.x - _O.worldDatas.consumabledatas.consumablew / 2,
				y: coords.y + consumable._.s.actual.y - _O.worldDatas.consumabledatas.consumablew / 2,
			};
			consumable._.s.actual.x = next.x;
			consumable._.s.actual.y = next.y;

			consumable.consumableDivElement.style.left = consumable._.s.actual.x + "px";
			consumable.consumableDivElement.style.top = consumable._.s.actual.y + "px";
		},
		setNewIDS: function (consumable) {
			consumable._.perso.id = _O.worldDatas.consumableIds + 0;
			consumable._.perso.type = Math.floor(
				Math.random() * _O.worldDatas.consumableheatsArray.length
			);
			consumable._.sheat = _O.worldDatas.consumableheatsArray[consumable._.perso.type];
			// ---------------------------------
			let immat = "";
			for (let i = 0; i < 5; i++) {
				immat =
					immat +
					_O.jsons.charactersForImmat.charAt(
						Math.floor(Math.random() * _O.jsons.charactersForImmat.length)
					);
			}
			consumable._.perso.immat = immat;
			_O.worldDatas.consumableIds++;
		},
	},
	mobFunctions: {
		setNewImmat: function (mob, parent = false) {
			// i am the One ! i mean the Zero !
			if (mob._.perso.id === 0 && !parent) mob._.perso.IA = false;
			mob._.perso.id = _O.worldDatas.mobIds + 0;
			let immat = "";
			// ---------------------------------
			for (let i = 0; i < 7; i++) {
				immat =
					immat +
					(i === 5
						? "_"
						: _O.jsons.charactersForImmat.charAt(
								Math.floor(Math.random() * _O.jsons.charactersForImmat.length)
						  ));
			}
			mob._.perso.immat = !parent
				? immat
				: parent._.perso.id + "" + parent._.perso.immat;
		},
		// isvalueunder: function (mob,valuename, value) {
		// 	return mob._.stats[valuename].cur < value;
		// },
		replicate: function (mob) {
			//todo (a revoir)
			let mobx = _O.mob();

			mobx._.s = structuredClone(mob._.s);
			mobx._.sheat = structuredClone(mob._.sheat);
			mobx._.perso = structuredClone(mob._.perso);
			mobx._.perso.clones = 0;
			mobx._.perso.dicoveredCase = [];
			mobx._.perso.xp = 0;

			mobx._.stats.faim.cur = 0;
			mobx._.stats.fatigue.cur = mobx._.stats.fatigue.max;

			mobx._.perso.parentId = mob._.perso.id;
			mobx.createNewMobDiv();

			mobx.initiate();
			// mobx.updateMobDivElementPos();
			// _O.frontFunctions.setMobDivElementsAndAddToDom(mobx);

			_O.indexedMobsBymobIds[mobx._.perso.id] = mobx;

			mob._.perso.clones++;
			_O.rewardBonus.replication(mob);
		},
		regen_energie: function (mob, valuename) {
			let v = mob._.stats[valuename];
			v.cur += v.regen * v.sens;
			if (v.cur > v.max) v.cur = v.max;
			if (v.cur < v.min) v.cur = v.min;
			let centage = Math.floor((Math.floor((v.cur / v.max) * 100) / 100) * 100);
			_O.frontFunctions.refreshSvgJauge(mob, valuename);
		},
		regenvalue: function (mob, valuename) {
			let v = mob._.stats[valuename];
			v.cur += v.regen * v.sens;
			if (v.cur > v.max) v.cur = v.max;
			if (v.cur < v.min) v.cur = v.min;
			let centage = Math.floor((Math.floor((v.cur / v.max) * 100) / 100) * 100);
			// refresh jauge
			mob.blocs[valuename].setAttribute(
				"stroke-dashoffset",
				mob._.stats[valuename].strokedasharray +
					(Math.floor((v.cur / v.max) * 100) / 100) *
						mob._.stats[valuename].strokedasharray
			); //+ (v.regen < 0 ? -_O.strokeOffset : 0);
		},
		siJeMeReplique: function (mob) {
			// replication ???
			if (
				mob._.stats.energie.cur > 90 &&
				mob._.stats.fatigue.max > 100 &&
				_O.worldDatas.mobIds < _O.worldDatas.maxreplicaton
				// && this._.stats.fatigue.cur < 50
				// && this._.stats.faim.cur < 20
			) {
				_O.mobFunctions.replicate(mob);
			}
		},
		setFuturPosAndRoom: function (mob) {
			let next = {
				x: mob._.s.actual.x - Math.sin(mob._.dir) * mob._.perso.speed,
				y: mob._.s.actual.y + Math.cos(mob._.dir) * mob._.perso.speed,
			};
			if (_O.worldFunctions.isXYInWorld(next.x, next.y)) {
				// add room to next
				(next.RoomNum = _O.roomFunctions.getRoomNumberFromXY(next.x, next.y)),
					(mob._.s.futur = next);
			} else {
				// reset changeDir delay if x,y is out the world
				mob._.delayBeforeChangeDir.cur = 0;
			}
		},
	},
	start: function () {
		this.frontFunctions.addCss();
		this.worldFunctions.createWorldDivsAndAddToDom();
		this.worldFunctions.createMobSheatsArray();
		this.worldFunctions.createconsumableSheatsArray();
		this.worldFunctions.createtreeSheatsArray();
		this.worldFunctions.hydrateWorld(); // mobs will auto start
		this.frontFunctions.addWorldListerner();
	},
	tools: {
		sanitize: function (string) {
			const map = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#x27;",
				"./": "&#x2F;",
			};
			const reg = /[&<>"'/]/gi;
			return string.replace(reg, (match) => map[match]);
		},
		rand: (min, max) => {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
	},
	jsons: {
		cssString: function () {
			return (
				`*,.world,.world ::before,.world ::after{margin:0;padding:0;box-sizing:border-box;-webkit-user-select:none;-webkit-touch-callout:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}` +
				`` +
				// ---------- world ----------------------
				`.world{cursor:grab;` +
				`border-radius: 1rem;` +
				`-webkit-box-shadow: 0px 0px 16px 15px rgba(97, 97, 97, 0.84);` +
				`box-shadow: 0px 0px 16px 15px rgba(53, 53, 53, 0.84);` +
				`outline: none;` +
				`background: rgb(67, 69, 112);` +
				`background: radial-gradient(circle, rgba(67, 69, 112, 1) 3%, rgba(35, 36, 57, 1) 60%);` +
				`}` +
				`.world.grab{cursor:grabbing}` +
				// ----------------------------------------
				`.unselectable{}` +
				// world allrooms -------------------------
				`.world .allrooms {position: absolute;width: 100%;height: 100%;overflow: hidden;border-radius: 1rem;-webkit-box-shadow: inset 0px 0px 35px 11px rgba(39, 39, 39, 0.84);box-shadow: inset 0px 0px 35px 11px rgba(46, 46, 46, 0.84);background-color: #fffafa25;` +
				`}` +
				`.room{padding:5px;color:white;font-size:.5rem;position:absolute;` +
				// `outline:1px solid rgba(0,255,0,0.1);` +
				`height:${_O.worldDatas.roomSideLength}px;` +
				`width:${_O.worldDatas.roomSideLength}px;` +
				`align-content:flex-start;` +
				`}` +
				// ----------------------------------------
				`.room.up{background-color:${_O.worldDatas.mobdatas.case};border-radius:9px;` +
				`}` +
				// ----------------------------------------
				`.room.done{background-color:rgba(68,58,155,.3);` +
				`}` +
				// ----------------------------------------
				`.room:hover{border-radius:0;` +
				`}` +
				// -------------consumable--------------------
				`.consumable {` +
				`position:absolute;` +
				`color:white;` +
				`font-size:1rem;` +
				`text-shadow: 0px 0px 5px 5px rgba(53, 53, 53, 0.84);` +
				// `outline:2px solid rgba(255,255,255,1);` +
				`width:${_O.worldDatas.consumabledatas.consumableh}px;` +
				`height:${_O.worldDatas.consumabledatas.consumablew}px;` +
				`display:flex;` +
				`align-items:center;` +
				`justify-content:center;` +
				`}` +
				// -------------tree--------------------
				`.tree {` +
				`position:absolute;` +
				`color:white;` +
				`font-size:1rem;` +
				//`text-shadow: 0px 0px 5px 5px rgba(53, 53, 53, 0.84);` +
				// `outline:2px solid rgba(255,255,255,.3);` +
				`width:${_O.worldDatas.treedatas.treeh}px;` +
				`height:${_O.worldDatas.treedatas.treew}px;` +
				`display:flex;` +
				`align-items:center;` +
				`justify-content:center;` +
				`border-radius:50%;` +
				`background: none;` +
				`background: radial-gradient(circle, rgba(62,232,2,.5) 0%, rgba(16,112,31,0) 50%);` +
				`}` +
				`.tree.visited {` +
				`background: radial-gradient(circle, rgba(32,200,2,.7) 0%, rgba(16,112,31,0) 50%);` +
				`}` +
				// ----------------------------------------
				`.room2{align-content:flex-start;transform-origin:top left;` +
				`height:${_O.worldDatas.roomSideLength / 10}px;` +
				`width:${_O.worldDatas.roomSideLength / 10}px;` +
				`}` +
				// -------------world----------------------
				`.world {position:absolute;width:100%;height:100%;` +
				`}` +
				// -------------allmobs--------------------
				`.world .mob{transition-duration:500ms;transition-property:width,height,color,margin;transition-timing-function:ease-in-out;border-radius:50%;cursor:pointer;position:absolute;` +
				`display:flex;align-items:center;justify-content:center;` +
				`border:1px dotted ${_O.worldDatas.mobdatas.colors[`energie`]};` +
				`font-size:${_O.worldDatas.mobdatas.cssfontsize}rem;` +
				`width:${_O.worldDatas.mobdatas.mobh}px;` +
				`height:${_O.worldDatas.mobdatas.mobw}px;` +
				`}` +
				`.world .mob:hover{` +
				`transform-orign : 0 0;` +
				`transform : scale(2);` +
				`}` +
				
				// ----------------------------------------
				`.mob.move{opacity:1;` +
				`}` +
				// exhausted ------------------------------
				`.world .mob.exhausted{` +
				`opacity:.7;` +
				`font-size:.5rem;` +
				`border:2px dotted ${_O.worldDatas.mobdatas.colors[`fatigue`]};` +
				`width: ${_O.worldDatas.mobdatas.mobhresting}px;` +
				`height: ${_O.worldDatas.mobdatas.mobwresting}px;` +
				`margin-left: -7px;` +
				`margin-top: -7px;` +
				`}` +
				// mobdisplay------------------------------
				`.mob .mobdisplay {position: absolute;left: 105%;width:max-content; paddind:.5rem;background-color: #0000FFFF;border-radius: .5rem;display: none;` +
				`}` +
				// alldis------------------------------
				`.mob .alldis {` +
				`display:flex;align-items:center;justify-content:center;` +
				`position: absolute;` +
				`width: ${_O.worldDatas.mobdatas.mobh}px;` +
				`height: ${_O.worldDatas.mobdatas.mobh}px;` +
				// `background-color: #FFFFFF65;` +
				`}` +
				// disalerte ------------------------------
				`.mob .disalerte {` +
				`position: absolute;` +
				// `top: 103%;left: 103%;` +
				`top: 70%;left: 70%;` +
				`z-index: +1;font-size: .6rem;` +
				`transition-duration:500ms;` +
				`transition-property:top,left,opacity;` +
				`transition-timing-function:ease-in-out;` +
				// `display: none;` +
				`opacity:0;` +
				`}` +
				`.mob .disalerte.up {display: initial;` +
				`top: 98%;left: 98%;` +
				`opacity:1;` +
				`}` +
				// disico ---------------------------------
				`.mob .disico {font-size: .9rem;border-radius: 50%;
					width:max-content` +
				`}` +
				// dismyid ---------------------------------
				`.mob .dismyid {font-size: .6rem;` +
				`border-radius: .5rem;` +
				`background-color:rgba(255,255,255,.5);` +
				`width:max-content;position: absolute;bottom:103%;right:103%;padding: 0 3px;` +
				`}` +
				// --------------- me ----------------------
				`.mob.me .dismyid{` +
				`background-color:rgba(0,255,0,.7);` +
				`color:black;` +
				`}` +
				`.mob.clone .dismyid{` +
				`background-color:rgba(0,0,255,.7);` +
				`color:white;` +
				`}` +
				// disvoisins ---------------------------------
				`.mob .disvoisins {font-size: .6rem;` +
				`background-color: #FFFFFF;` +
				`border-radius: .5rem;` +
				`width:max-content;` +
				`position: absolute;` +
				`top: 103%;` +
				`padding: 0 3px;` +
				`}` +
				// infomob------------------------------
				`.mob .disinfomob {position: absolute;left: 98%;top: 2%;width: max-content;border-radius: .5rem;padding: .5rem;` +
				`background-color: #f0f0f0a8;` +
				`display: none;` +
				`}` +
				`.mob .disinfomob.up {display: initial;}` +
				// all exhausted ---------------------------------
				`.mob.exhausted .disvoisins {background-color: black;opacity:.3;` +
				`` +
				`}` +
				// `.mob.exhausted .dismyid {background-color: black;` +
				// `bottom:50%;right:50%;` +
				// `}` +
				// -------------allsvg---------------------
				`.mob svg{position:absolute;width:40px;height:40px;}` +
				`.mob svg circle{stroke-linecap:round;}`
				// mobdisplay-------------- JS ------------
				// `.mob:hover .mobdisplay {display: initial;}`
			);
		},
		charactersForImmat: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		indexedFlora: {
			tree: {
				"Deciduous Tree": {
					ico: "🌳",
					description: "Deciduous Tree",
					model: "tree",
					stats: {},
				},
				"Evergreen Tree": {
					ico: "🌲",
					description: "Evergreen Tree",
					model: "tree",
					stats: {},
				},
				"Palm Tree": {
					ico: "🌴",
					description: "Palm Tree",
					model: "tree",
					stats: {},
				},
			},
			consumable: {
				Grapes: {
					ico: "🍇",
					description: "Grapes",
					model: "consumable",
					stats: {
						energie: 10,
						fatigue: -5,
						faim: -20,
					},
				},
				Melon: {
					ico: "🍈",
					description: "Melon",
					model: "consumable",
					stats: {
						energie: 15,
						fatigue: -3,
						faim: -25,
					},
				},
				Watermelon: {
					ico: "🍉",
					description: "Watermelon",
					model: "consumable",
					stats: {
						energie: 20,
						fatigue: -5,
						faim: -30,
					},
				},
				Orange: {
					ico: "🍊",
					description: "Orange",
					model: "consumable",
					stats: {
						energie: 12,
						fatigue: -6,
						faim: -15,
					},
				},
				Lemon: {
					ico: "🍋",
					description: "Lemon",
					model: "consumable",
					stats: {
						energie: 8,
						fatigue: -4,
						faim: -10,
					},
				},
				Banana: {
					ico: "🍌",
					description: "Banana",
					model: "consumable",
					stats: {
						energie: 25,
						fatigue: -8,
						faim: -30,
					},
				},
				Pineapple: {
					ico: "🍍",
					description: "Pineapple",
					model: "consumable",
					stats: {
						energie: 18,
						fatigue: -7,
						faim: -25,
					},
				},
				Mango: {
					ico: "🥭",
					description: "Mango",
					model: "consumable",
					stats: {
						energie: 22,
						fatigue: -6,
						faim: -28,
					},
				},
				Apple: {
					ico: "🍎",
					description: "Apple",
					model: "consumable",
					stats: {
						energie: 13,
						fatigue: -5,
						faim: -18,
					},
				},
				Pear: {
					ico: "🍏",
					description: "Pear",
					model: "consumable",
					stats: {
						energie: 14,
						fatigue: -4,
						faim: -20,
					},
				},
				"Green Apple": {
					ico: "🍐",
					description: "Green Apple",
					model: "consumable",
					stats: {
						energie: 14,
						fatigue: -5,
						faim: -19,
					},
				},
				Peach: {
					ico: "🍑",
					description: "Peach",
					model: "consumable",
					stats: {
						energie: 16,
						fatigue: -6,
						faim: -22,
					},
				},
				Cherries: {
					ico: "🍒",
					description: "Cherries",
					model: "consumable",
					stats: {
						energie: 12,
						fatigue: -4,
						faim: -15,
					},
				},
				Strawberry: {
					ico: "🍓",
					description: "Strawberry",
					model: "consumable",
					stats: {
						energie: 9,
						fatigue: -3,
						faim: -12,
					},
				},
				Kiwi: {
					ico: "🥝",
					description: "Kiwi",
					model: "consumable",
					stats: {
						energie: 10,
						fatigue: -4,
						faim: -14,
					},
				},
				Tomato: {
					ico: "🍅",
					description: "Tomato",
					model: "consumable",
					stats: {
						energie: 7,
						fatigue: -2,
						faim: -10,
					},
				},
				Coconut: {
					ico: "🥥",
					description: "Coconut",
					model: "consumable",
					stats: {
						energie: 30,
						fatigue: -10,
						faim: -40,
					},
				},
			},
		},
		indexedFauna: {
			girl: {
				ico: "👧",
				description: "Girl",
				model: "human",
			},
			woman: {
				ico: "👩",
				description: "Woman",
				model: "human",
			},
			oldWoman: {
				ico: "👴",
				description: "Old Woman",
				model: "human",
			},
			boy: {
				ico: "👦",
				description: "Boy",
				model: "human",
			},
			man: {
				ico: "👨",
				description: "Man",
				model: "human",
			},
			oldMan: {
				ico: "🧓",
				description: "Old Man",
				model: "human",
			},
			lion: {
				ico: "🦁",
				description: "Lion",
				model: "animal",
			},
			tiger: {
				ico: "🐯",
				description: "Tiger",
				model: "animal",
			},
			rabbit: {
				ico: "🐰",
				description: "Rabbit",
				model: "animal",
			},
			bat: {
				ico: "🦇",
				description: "Bat",
				model: "animal",
			},
			bear: {
				ico: "🐻",
				description: "Bear",
				model: "animal",
			},
		},
	},
};
window.addEventListener("DOMContentLoaded", () => {
	_O.start();
});
