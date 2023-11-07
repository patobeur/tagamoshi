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
	// MOB : mobile object behaviour
	mob: function () {
		let mob = {
			mobDivElement: document.createElement("div"),
			blocs: {},
			actionsTodo: [],
			test: Math.floor(Math.random() * _W.worldDatas.mobSheatsArray.length),
			_: {
				alive: null,
				stats: {
					energie: {
						color: _W.worldDatas.mobdatas.colors.energie,
						cur: 0,
						min: 0,
						max: 100,
						regen: 0.05,
						sens: 1,
						active: false,
						rested: false,
						needrest: false,
						strokedashoffset: 102,
						strokedasharray: 102,
						whenactive: "dying",
						svg: {
							type: "circle",
							r: _W.worldDatas.mobdatas.svgSideLength / 2 - 10,
						},
					},
					faim: {
						color: _W.worldDatas.mobdatas.colors.faim,
						cur: 25,
						min: 0,
						max: 100,
						regen: -0.01,
						sens: -1,
						active: false,
						rested: false,
						needrest: false,
						strokedashoffset: 124,
						strokedasharray: 124,
						whenactive: "starving",
						svg: {
							type: "circle",
							r: _W.worldDatas.mobdatas.svgSideLength / 2 - 6,
						},
					},
					fatigue: {
						color: _W.worldDatas.mobdatas.colors.fatigue,
						cur: _O.tools.rand(10, 20),
						min: 0,
						max: 100,
						regen: -0.04,
						sens: 1,
						active: false,
						rested: false,
						needrest: false,
						strokedashoffset: 150,
						strokedasharray: 150,
						whenactive: "exhausted",
						svg: {
							type: "circle",
							r: _W.worldDatas.mobdatas.svgSideLength / 2 - 2,
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
					updateInterval: _W.worldDatas.updateInterval + 25, // + _O.tools.rand(0, 50),
					alone: true,
					parentId: null,
				},
				s: {
					actual: {
						x: _O.tools.rand(0, _W.worldDatas.sizes.size.w),
						y: _O.tools.rand(0, _W.worldDatas.sizes.size.h),
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
					_W.worldDatas.mobSheatsArray[
						Math.floor(Math.random() * _W.worldDatas.mobSheatsArray.length)
					],
				test: _W.worldDatas.mobSheatsArray[self.test],
			},
			initiate: function () {
				_O.mobFunctions.setFuturPosAndRoom(this);
				_O.frontFunctions.updateMobDivElementPos(this);
				_O.frontFunctions.setMobDivElementsAndAddToDom(this);
				this.alive = setInterval(() => {
					this.mobUpdate();
				}, this._.perso.updateInterval);
			},
			removefromIndexes: function (mob) {
				console.log(mob);
				delete _O.indexedMobsBymobIds[mob._.perso.id];
			},
			removefromDom: function (mob) {
				mob.mobDivElement.remove();
			},
			die: function (mob) {
				clearInterval(mob.alive);
				_O.roomFunctions.exitCase(mob);
				if (!mob.mobDivElement.classList.contains("thisistheend")) {
					mob.mobDivElement.classList.add("thisistheend");
				}
				mob.removefromIndexes(mob);
				console.log(mob._.perso.immat + " is on the dev paradise way !!!");
				setTimeout(
					(dom) => {
						this.removefromDom(this);
					},
					_W.worldDatas.mobDeleteTimeout,
					"dom"
				);
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

				_W.worldDatas.mobIds++;
				_W.worldDatas.mobCounter++;
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
						mob.die(mob);
						_O.mobCounter++;
						break;

					default:
						break;
				}
			},
			_step: function () {
				_O.roomFunctions.siJeChangeDeCase(this);
				_O.roomFunctions.isThereAnyOne(mob);
				let fati = this._.stats.fatigue;
				let faim = this._.stats.faim;
				this.setFatigueOrNot(this);
				if (faim.cur >= faim.max) {
					this.actionsTodo[0] = "die";
				} else {
					// pas reposé et fatigué
					if (fati.needrest) {
						this.actionsTodo[0] = "rest";
					} else {
						fati.needrest = fati.cur >= fati.max * 0.8; // >80%
					}
					if (!fati.needrest) {
						this.actionsTodo[0] = "move";
					}
				}

				this.doAction(this);
				_O.mobFunctions.regenvalue(this, "fatigue");

				if (!fati.needrest) _O.mobFunctions.regenvalue(this, "faim");
				// _O.mobFunctions.regenvalue(this, "energie");
				if (fati.needrest) _O.mobFunctions.regen_energie(this, "energie");

				_O.mobFunctions.siJeMeReplique(this);
			},
			mobUpdate: function () {
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
					_O.svgfunctions.setSvgJauge(name, mob);
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
	rewardBonus: {
		newRoomdiscovered: function (mob) {
			mob._.perso.xp += 50;
			mob._.stats.fatigue.max += 2;
			mob._.stats.energie.max += 2;
			// if (mob._.perso.updateInterval >= _W.worldDatas.updateInterval + 5)
			// 	mob._.perso.updateInterval -= 5;
			// add Room to personal list
			mob._.perso.dicoveredCase.push(mob._.s.actual.RoomNum);
		},
		// replication: function (mob) {
		// 	// mob._.perso.updateInterval += 2;
		// },
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
				// mob.svgtextgridNum.textContent = mob._.s.actual.RoomNum;

				if (_W.worldDatas.roomIds > _W.worldDatas.mobIds * 2) {
					let maxroom = Math.floor(
						(_W.worldDatas.sizes.size.w / _W.worldDatas.roomSideLength) *
							(_W.worldDatas.sizes.size.h / _W.worldDatas.roomSideLength)
					);

					if (_W.worldDatas.treeCounter < maxroom) {
						_O.decorationFunctions.addtree(
							"addtree",
							false,
							mob._.s.actual.RoomNum
						);
						_O.decorationFunctions.addtree(
							"addtree",
							false,
							mob._.s.actual.RoomNum
						);
						_O.decorationFunctions.addtree(
							"addtree",
							false,
							mob._.s.actual.RoomNum
						);
						console.log(_W.worldDatas.treeCounter, maxroom, " arbre !??");
					} else {
						console.log("trop d'arbre !??");
					}

					// _O.consumableFunctions.dropconsumable("pop consumable",false, mob._.s.actual.RoomNum);
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
					if (currentcase.habitants) {
						for (const key in currentcase.habitants) {
							if (Object.hasOwnProperty.call(currentcase.habitants, key)) {
								enemies.push(currentcase.habitants[key]);
								stringEnemies =
									stringEnemies + (habitantscount > 0 ? "," : "") + key;
								habitantscount++;
							}
						}
					}
					if (currentcase.consumables) {
						for (const key in currentcase.consumables) {
							if (Object.hasOwnProperty.call(currentcase.consumables, key)) {
								consumables.push(currentcase.consumables[key]);
								consumablescount++;
							}
						}
					}
					if (currentcase.decors) {
						for (const key in currentcase.trees) {
							if (Object.hasOwnProperty.call(currentcase.trees, key)) {
								trees.push(currentcase.trees[key]);
								treescount++;
							}
						}
					}
				}
				roomscount++;
			});
			mob.blocs.voisins.textContent = stringEnemies;
			if (habitantscount > 1) {
				mob._.perso.alone = false;
				mob.blocs.alerte.classList.add("up");
			} else {
				mob._.perso.alone = true;
				mob.blocs.alerte.classList.remove("up");
			}
		},
		setRoomLevel: function (room) {
			let oldmapname = "lv" + room.lv - 1;
			let mapname = "lv" + room.lv;
			room.div.classList.remove(oldmapname); //,'lv1','lv2','lv3','lv4,','lv5')
			room.div.classList.add(mapname);

			// _O.indexedRoomsByCaseNumber[caseNumber]
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
			let room = {
				roomNum: caseNumber,
				lv: 0,
				div: newgrid,
				habitants: {},
				trees: {},
				consumables: {},
				coords: { x: newRoomPos.x, y: newRoomPos.y },
			};
			_O.indexedRoomsByCaseNumber[caseNumber] = room;
			_O.arrayRoomsIds.push(caseNumber);
			_W.worldDatas.roomIds++;
			_O.worldRoomsDiv.prepend(_O.indexedRoomsByCaseNumber[caseNumber].div);
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
						_W.worldDatas.sizes.size.w / _W.worldDatas.roomSideLength
					)) +
				1;
			const row = Math.ceil(
				caseNumber /
					Math.ceil(_W.worldDatas.sizes.size.w / _W.worldDatas.roomSideLength)
			);
			return {
				x: (col - 1) * _W.worldDatas.roomSideLength,
				y: (row - 1) * _W.worldDatas.roomSideLength,
				col: col,
				row: row,
			};
		},
		getRoomNumberFromXY: function (x, y) {
			const col = Math.floor(x / _W.worldDatas.roomSideLength);
			const row = Math.floor(y / _W.worldDatas.roomSideLength);
			return (
				row *
					Math.ceil(_W.worldDatas.sizes.size.w / _W.worldDatas.roomSideLength) +
				col +
				1
			);
		},
		getAllThe9RoomsAroundXY: function (x, y) {
			const col = Math.floor(x / _W.worldDatas.roomSideLength);
			const row = Math.floor(y / _W.worldDatas.roomSideLength);
			const cols = Math.ceil(
				_W.worldDatas.sizes.size.w / _W.worldDatas.roomSideLength
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
					const roomNum = newRow * cols + newCol + 1;
					rooms.push(roomNum);
				}
			}
			return rooms;
		},
	},
	worldFunctions: {
		createWorldDivsAndAddToDom: function () {
			_O.worldDiv = _O.frontFunctions.createDiv({
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
			_O.worldRoomsDiv = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "allrooms",
				},
			});

			_O.worldMobsDiv = _O.frontFunctions.createDiv({
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
				let mob = _O.mob();
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
			let stringcss = _J.jsons.cssString();
			// let stringcss = _J.jsons.abc;
			let style = document.createElement("style");
			style.textContent = _O.tools.sanitize(stringcss);
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
		addWorldListerner: function () {
			window.addEventListener(
				"resize",
				(e) => {
					_O.worldDiv.style.top =
						window.innerHeight / 2 - _W.worldDatas.sizes.size.h / 2 + "px";
					_O.worldDiv.style.left =
						window.innerWidth / 2 - _W.worldDatas.sizes.size.w / 2 + "px";
				},
				{ passive: true }
			);

			window.addEventListener("mousedown", (e) => {
				// if (e.target === _O.worldDiv) {
				_O.mouse.isDragging = true;
				_O.mouse.x = e.clientX;
				_O.mouse.y = e.clientY;
				_W.worldDatas.sizes.origine.w = _O.worldDiv.offsetLeft;
				_W.worldDatas.sizes.origine.h = _O.worldDiv.offsetTop;
				_O.worldDiv.classList.add("grab");
				// }
			});

			window.addEventListener("mousemove", (e) => {
				if (_O.mouse.isDragging) {
					const deltaX = e.clientX - _O.mouse.x;
					const deltaY = e.clientY - _O.mouse.y;
					const newWorldX = _W.worldDatas.sizes.origine.w + deltaX;
					const newWorldY = _W.worldDatas.sizes.origine.h + deltaY;

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

			document.documentElement.oncontextmenu = (event) => {
				console.log("right click");
				if (this._preventDefaultRightClick) event.preventDefault();
			};
			// document.documentElement.onwheel = (event) => {
			// 	// event.preventDefault();
			// 	this._handleMouseWheel(event);
			// };
		},
		_handleMouseWheel: function (event) {
			if (event.ctrlKey === false && event.altKey === false) {
				// if(event.target.className==="allrooms"){
				// 	console.info(event);
				// 	console.info(event.deltaY);
				// 	_W.worldDatas.scale += 1 * (event.deltaY > 0 ? -.2 : .2);
				// 	let rect = _O.worldDiv.getBoundingClientRect();
				// 	console.log(rect.top,rect.left)
				// 	_O.worldDiv.style.transform= "scale("+_W.worldDatas.scale+")"
				// 	_O.worldDiv.style.top = Math.floor(_O.worldDiv.style.left*(-1*_W.worldDatas.scale))+'px'
				// 	_O.worldDiv.style.left = Math.floor(_O.worldDiv.style.left*(-1*_W.worldDatas.scale))+'px'
				// }
			}
		},
		updateMobDivElementPos: function (mob) {
			if (mob._.s.actual.x != mob._.s.past.x)
				mob.mobDivElement.style.left =
					mob._.s.actual.x - _W.worldDatas.mobdatas.mobw / 2 + "px";
			if (mob._.s.actual.y != mob._.s.past.y)
				mob.mobDivElement.style.top =
					mob._.s.actual.y - _W.worldDatas.mobdatas.mobh / 2 + "px";
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
			mob.blocs.starving = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "starving", textContent: "💭" },
			}); //
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
			mob.blocs.alldis.prepend(mob.blocs.starving);
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
			// _O.worldRoomsDiv.appendChild(mob.mobDivElement);
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
				divElement: _O.frontFunctions.createDiv({
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
						updateInterval:
							_W.worldDatas.updateInterval + _O.tools.rand(10000, 15000),
					},
					s: {
						actual: {
							x: _O.tools.rand(0, _W.worldDatas.roomSideLength),
							y: _O.tools.rand(0, _W.worldDatas.roomSideLength),
							z: _O.tools.rand(-1, 1),
							RoomNum: 0,
						},
					},
					sheat: null,
				},
				treeUpdate: function (tree) {
					let rand = _O.tools.rand(0, 100);

					// console.log(tree._.sheat.description + " updating : " + rand);

					if (rand > 8) {
						_O.consumableFunctions.dropconsumable("new fruit:", tree, false);
					}
				},
				initiate: function (tree, caseNumber) {
					_O.decorationFunctions.setNewIDS(tree);
					_O.decorationFunctions.createNewDiv(tree);
					tree._.s.actual.RoomNum = caseNumber;

					_O.communsFunctions.setNewPosInThisRoom(
						tree,
						_W.worldDatas.treedatas,
						(parent = false)
					);

					_O.arrayTreesByIds.push(tree._.perso.id);
					_O.indexedtreeByIds[tree._.perso.id] = tree;
					_O.indexedRoomsByCaseNumber[caseNumber].trees[tree._.perso.id] = tree;

					_O.worldRoomsDiv.append(tree.divElement);
					if (tree._.sheat.drop) {
						_O.indexedRoomsByCaseNumber[caseNumber].lv += 1;
						_O.roomFunctions.setRoomLevel(
							_O.indexedRoomsByCaseNumber[caseNumber]
						);

						// console.log(tree._.sheat.description + " is a dropper");
						tree.treeAlive = setInterval(() => {
							tree.treeUpdate(tree);
						}, tree._.perso.updateInterval);
					}
				},
			};
			return { ...tree };
		},
		addtree: function (help = "vide", parent = false, caseNumber) {
			// console.log(help, parent, caseNumber);
			if (!(parent === false && caseNumber === false)) {
				if (_O.tools.rand(0, 100) <= _W.worldDatas.threechance * 100) {
					if (_W.worldDatas.treeIds < _W.worldDatas.roomIds * 2) {
						let tree = _O.decorationFunctions.tree();
						tree.initiate(tree, caseNumber);
					}
				}
			} else {
				console.log(
					help +
						" has no parent and no caseNumber ! this is not suppose to happen !!"
				);
			}
		},
		createNewDiv: function (tree) {
			tree.divElement = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "three " + tree._.sheat.model,
					textContent: tree._.sheat.ico,
				},
				styles: {
					title: tree._.perso.id + " " + tree._.perso.immat,
				},
			});
		},
		setNewIDS: function (tree) {
			tree._.perso.id = _W.worldDatas.treeIds + 0;
			tree._.perso.type = Math.floor(
				Math.random() * _W.worldDatas.treeSheatsArray.length
			);
			tree._.sheat = _W.worldDatas.treeSheatsArray[tree._.perso.type];
			// ---------------------------------
			let immat = "";
			for (let i = 0; i < 5; i++) {
				immat =
					immat +
					_J.jsons.charactersForImmat.charAt(
						Math.floor(Math.random() * _J.jsons.charactersForImmat.length)
					);
			}
			tree._.perso.immat = immat;
			_O.treeCounter++;
			_W.worldDatas.treeIds++;
		},
	},
	communsFunctions: {
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
			let rand = _O.tools.rand(0, _O.arrayRoomsIds.length - 1);
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
	consumableFunctions: {
		consumable: function () {
			let consumable = {
				divElement: _O.frontFunctions.createDiv({
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
						updateInterval: _W.worldDatas.updateInterval + _O.tools.rand(0, 50),
						parent: null,
					},
					s: {
						actual: {
							x: _O.tools.rand(0, _W.worldDatas.roomSideLength),
							y: _O.tools.rand(0, _W.worldDatas.roomSideLength),
							z: _O.tools.rand(-1, 1),
							RoomNum: 0,
						},
					},
					sheat: null,
				},
				update: function () {},
				initiate: function (parent, caseNumber) {
					this._.s.actual.RoomNum = caseNumber;
					if (parent) {
						this._.s.actual.RoomNum = parent._.s.actual.RoomNum;
						this._.perso.parent = parent;
					}
					_O.consumableFunctions.setNewIDS(this);
					_O.consumableFunctions.createNewDiv(this);
					// _O.communsFunctions.setPos(this, _W.worldDatas.consumabledatas);
					_O.communsFunctions.setNewPosInThisRoom(
						this,
						_W.worldDatas.consumabledatas,
						parent
					);
					_O.indexedconsumableByIds[consumable._.perso.id] = this;
					_O.indexedRoomsByCaseNumber[this._.s.actual.RoomNum].consumables[
						this._.perso.id
					] = this;
					_O.worldRoomsDiv.append(this.divElement);
				},
			};
			return { ...consumable };
		},
		dropconsumable: function (help = "", parent = false, caseNumber = false) {
			if (!(parent === false && caseNumber === false)) {
				if (_O.tools.rand(0, 100) <= _W.worldDatas.consumablechance * 100) {
					if (_W.worldDatas.consumableIds < _W.worldDatas.roomIds / 3) {
						let consumable = _O.consumableFunctions.consumable();
						consumable.initiate(parent, caseNumber);

						parent.divElement.classList.add("onfruits");
						consumable.divElement.classList.add("new");
						setTimeout(() => {
							consumable.divElement.classList.remove("new");
							parent.divElement.classList.remove("onfruits");
						}, 2000);
					}
				}
			} else {
				console.log(help + " has no parent and no caseNumber");
			}
		},
		createNewDiv: function (consumable) {
			consumable.divElement = _O.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: consumable._.sheat.className + " new",
					textContent: consumable._.sheat.ico,
					title: consumable._.sheat.description,
				},
			});
			consumable.divElement.title =
				consumable._.perso.id + " " + consumable._.perso.immat;
			consumable.divElement.className =
				consumable._.sheat.className + " " + consumable._.sheat.model;
		},
		setNewIDS: function (consumable) {
			consumable._.perso.id = _W.worldDatas.consumableIds + 0;
			consumable._.perso.type = Math.floor(
				Math.random() * _W.worldDatas.consumableSheatsArray.length
			);
			consumable._.sheat =
				_W.worldDatas.consumableSheatsArray[consumable._.perso.type];
			// ---------------------------------
			let immat = "";
			for (let i = 0; i < 5; i++) {
				immat =
					immat +
					_J.jsons.charactersForImmat.charAt(
						Math.floor(Math.random() * _J.jsons.charactersForImmat.length)
					);
			}
			consumable._.perso.immat = immat;
			_W.worldDatas.consumableIds++;
		},
	},
	mobFunctions: {
		setNewImmat: function (mob, parent = false) {
			// i am the One ! i mean the Zero !
			if (mob._.perso.id === 0 && !parent) mob._.perso.IA = false;
			mob._.perso.id = _W.worldDatas.mobIds + 0;
			let immat = "";
			// ---------------------------------
			for (let i = 0; i < 7; i++) {
				immat =
					immat +
					(i === 5
						? "_"
						: _J.jsons.charactersForImmat.charAt(
								Math.floor(Math.random() * _J.jsons.charactersForImmat.length)
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
			mobx._.stats = structuredClone(mob._.stats);
			mobx._.sheat = structuredClone(mob._.sheat);
			mobx._.perso = structuredClone(mob._.perso);

			mobx._.perso.xp = +10;
			mobx._.stats.fatigue.cur = mob._.stats.fatigue.max * 0.7;
			mob._.stats.energie.cur = 0;
			mob._.stats.fatigue.cur = mob._.stats.fatigue.max;

			mobx._.stats.energie.cur = 0;
			mobx._.perso.clones = 0;
			mobx._.perso.dicoveredCase = [];
			mobx._.perso.xp = 0;
			mobx._.stats.faim.cur = 0;
			// mobx._.perso.updateInterval = _W.worldDatas.updateInterval + 50;
			mobx._.perso.parentId = mob._.perso.id;
			mobx.createNewMobDiv();

			mobx.initiate();

			_O.indexedMobsBymobIds[mobx._.perso.id] = mobx;

			mob._.perso.clones++;

			// _O.rewardBonus.replication(mob);
		},
		regen_energie: function (mob, valuename) {
			let v = mob._.stats[valuename];
			v.cur += v.regen * v.sens;
			if (v.cur > v.max) v.cur = v.max;
			if (v.cur < v.min) v.cur = v.min;
			let centage = Math.floor((Math.floor((v.cur / v.max) * 100) / 100) * 100);

			// let v = mob._.stats[valuename];
			mob.blocs[valuename].setAttribute(
				"stroke-dashoffset",
				mob._.stats[valuename].strokedashoffset +
					(Math.floor((v.cur / v.max) * 100) / 100) *
						mob._.stats[valuename].strokedasharray
			); //+ (v.regen < 0 ? -_O.strokeOffset : 0);

			// _O.frontFunctions.refreshSvgJauge(mob, valuename);
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
				mob._.stats[valuename].strokedashoffset +
					(Math.floor((v.cur / v.max) * 100) / 100) *
						mob._.stats[valuename].strokedasharray
			); //+ (v.regen < 0 ? -_O.strokeOffset : 0);
		},
		siJeMeReplique: function (mob) {
			// replication ???
			if (
				mob._.stats.energie.cur > 90 &&
				mob._.stats.fatigue.max > 100 &&
				_W.worldDatas.mobCounter < _W.worldDatas.maxreplicaton
				// && this._.stats.fatigue.cur < 50
				// && this._.stats.faim.cur < 20
				// && mob personal max cloning
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
			// svgfontsize: 24,
			// svgfontposX: 24,
			// svgfontposY: 24,
			// svgfontcolor: "white",
		};
	},
	start: function () {
		this.setdatas();
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
};
const _C = {
};
window.addEventListener("DOMContentLoaded", () => {
	_O.start();
});
