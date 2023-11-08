const _R = {
	roomFunctions: {
		siJeChangeDeCase: function (mob) {
			if (mob._.s.past.RoomNum != mob._.s.actual.RoomNum) {
				// siLaCaseEstInconue
				_R.roomFunctions.checkIfRoomeExiste(mob);
				_R.roomFunctions.exitCase(mob);
				_R.roomFunctions.enterCase(mob);
			}
		},
		checkIfRoomeExiste: function (mob) {
			let actualRoom = _O.indexedRoomsByCaseNumber[mob._.s.actual.RoomNum];
			if (typeof actualRoom === "undefined") {
				_R.roomFunctions.createNewRoom(mob._.s.actual.RoomNum);
				_M.rewardBonus.newRoomdiscovered(mob);
				// mob.svgtextgridNum.textContent = mob._.s.actual.RoomNum;

				if (_W.worldDatas.roomIds > _W.worldDatas.mobIds * 2) {
					let maxroom = Math.floor(
						(_W.worldDatas.sizes.size.w / _W.worldDatas.roomSideLength) *
							(_W.worldDatas.sizes.size.h / _W.worldDatas.roomSideLength)
					);

					if (_W.worldDatas.treeCounter < maxroom) {
						_D.decorationFunctions.addtree(
							"addtree",
							false,
							mob._.s.actual.RoomNum
						);
						_D.decorationFunctions.addtree(
							"addtree",
							false,
							mob._.s.actual.RoomNum
						);
						_D.decorationFunctions.addtree(
							"addtree",
							false,
							mob._.s.actual.RoomNum
						);
						// console.log(_W.worldDatas.treeCounter, maxroom, " arbre !??");
					} else {
						console.log("trop d'arbre !??");
					}

					// _C.consumableFunctions.dropconsumable("pop consumable",false, mob._.s.actual.RoomNum);
				}
			}
		},
		isThereAnyConsumable: function (mob) {},
		isThereAnyOne: function (mob) {
			mob._.perso.alone = true;
			let enemies = [];
			let consumables = [];
			let trees = [];
			let stringEnemies = "";
			let roomes = _R.roomFunctions.getAllThe9RoomsAroundXY(
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
								if (mob._.perso.id != currentcase.habitants[key].mobid) {
									enemies.push(currentcase.habitants[key]);
									stringEnemies =
										stringEnemies + (habitantscount > 0 ? "," : "") + key;
									// ------------------------
									// is colliding ??
									// ------------------------
									habitantscount++;
								}
							}
						}
					}
					if (currentcase.consumables) {
						for (const key in currentcase.consumables) {
							if (Object.hasOwnProperty.call(currentcase.consumables, key)) {
								consumables.push(currentcase.consumables[key]);
								// ------------------------
								// is colliding ??
								// ------------------------
								consumablescount++;
							}
						}
					}
					if (currentcase.decors) {
						for (const key in currentcase.trees) {
							if (Object.hasOwnProperty.call(currentcase.trees, key)) {
								trees.push(currentcase.trees[key]);
								// ------------------------
								// is colliding ??
								// ------------------------
								treescount++;
							}
						}
					}
				}
				roomscount++;
			});

			mob.blocs.voisins.textContent = stringEnemies;
			if (habitantscount > 0) {
				mob._.perso.alone = false;
				mob.blocs.alerte.classList.add("up");
				mob.blocs.voisins.classList.add("up");
			} else {
				mob._.perso.alone = true;
				mob.blocs.alerte.classList.remove("up");
				mob.blocs.voisins.classList.remove("up");
			}
			if (consumablescount > 0) {
				mob.blocs.consumable.classList.add("up");
				mob.blocs.consumable.textContent = consumables[0]._.sheat.ico
			} else {
				mob.blocs.consumable.classList.remove("up");
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
			let newRoomPos = _R.roomFunctions.getRoomXYFromNumber(caseNumber);
			let newgrid = _F.frontFunctions.createDiv({
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
};
