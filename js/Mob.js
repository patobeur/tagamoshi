const _M = {
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
						cur: 60,
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
						cur: _T.tools.rand(10, 20),
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
					IAActive: true,
					xp: 0,
					dicoveredCase: [],
					clones: 0,
					speed: 1,
					updateInterval: _W.worldDatas.updateInterval + 25, // + _T.tools.rand(0, 50),
					alone: true,
					parentId: null,
				},
				s: {
					actual: {
						x: _T.tools.rand(0, _W.worldDatas.sizes.size.w),
						y: _T.tools.rand(0, _W.worldDatas.sizes.size.h),
						z: _T.tools.rand(-1, 1),
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
				targets: {
					mob: {
						stack: [],
						current: null,
						last: null,
						nearest: null,
					},
					consumable: {
						stack: [],
						current: null,
						last: null,
						nearest: null,
					},
				},
				// ----------- todo regroupe dir,delayBeforeChangeDir,diramplitude
				// dirx: {
				// 	cur: _T.tools.rand(0, 360),
				// 	amplitude: 45,
				// 	delayChange: { cur: 0, max: 10 },
				// },
				dir: _T.tools.rand(0, 360),
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
				_M.mobFunctions.setFuturPosAndRoom(this);
				_M.mobFunctions.updateMobDivElementPos(this);
				_M.mobFunctions.setMobDivElementsAndAddToDom(this);
				this.alive = setInterval(() => {
					this.mobUpdate();
				}, this._.perso.updateInterval);
			},
			removefromIndexes: function () {
				// console.log(mob);
				delete _O.indexedMobsBymobIds[this._.perso.id];
			},
			createNewMobDiv: function () {
				_M.mobFunctions.setNewImmat(this);
				// init some datas
				this._.s.actual.RoomNum = _R.roomFunctions.getRoomNumberFromXY(
					this._.s.actual.x,
					this._.s.actual.y
				);

				this.mobDivElement.title = this._.perso.id + " " + this._.perso.immat;
				this.mobDivElement.className =
					this._.sheat.model +
					" mob" +
					(this._.perso.id != 0 ? " ia" : " me") +
					(this._.perso.parentId ? " clone" : "");

				_W.worldDatas.mobIds++;
				_W.worldDatas.mobCounter++;
			},
			applynextPos: function () {
				this._.s.past = structuredClone(this._.s.actual);
				this._.s.actual = structuredClone(this._.s.futur);
			},
			changedir: function () {
				if (this._.delayBeforeChangeDir.cur === 0) {
					// let choix = _T.tools.rand(0, 1) === 1 ? -1 : 1;
					this._.dir += _T.tools.rand(0, 1) === 1 ? -1 : 1;
					if (this._.dir > 360) this._.dir = 360 - this._.dir;
					if (this._.dir < 0) this._.dir = this._.dir + 360;
				}
				this._.delayBeforeChangeDir.cur < this._.delayBeforeChangeDir.max
					? this._.delayBeforeChangeDir.cur++
					: (this._.delayBeforeChangeDir.cur = 0);
			},

			changedirtotarget: function (target) {
				this._.dir = _T.tools.get_DegreeWithTwoPos(
					this._.s.actual.x,
					this._.s.actual.y,
					target._.s.actual.x,
					target._.s.actual.y,
				);
			},
			_step: function () {
				_R.roomFunctions.siJeChangeDeCase(this);
				_R.roomFunctions.isThereAnyOne(this);
				_MobActions.setFatigueOrNot(this);
				_MobActions.setFaimOrNot(this);
				_MobActions.selectAction(this)
				_MobActions.doAction(this);

				_M.mobFunctions.regenvalue(this, "fatigue");
				if (!this._.stats.fatigue.needrest) _M.mobFunctions.regenvalue(this, "faim");
				if (this._.stats.fatigue.needrest) _M.mobFunctions.regen_energie(this, "energie");

				_M.mobFunctions.siJeMeReplique(this);
			},
			mobUpdate: function () {
				this._step();
			},
		};
		return { ...mob };
	},
	mobFunctions: {
		setNewImmat: function (mob, parent = false) {
			// i am the One ! i mean the Zero !
			mob._.perso.id = _W.worldDatas.mobIds + 0;
			let immat = "";
			// ---------------------------------
			if (mob._.perso.id === 0) {
				mob._.perso.IA = false;
				mob._.perso.immat = "Patobeur";
			} else {
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
			}
		},
		// isvalueunder: function (mob,valuename, value) {
		// 	return mob._.stats[valuename].cur < value;
		// },
		replicate: function (mob) {
			//todo (a revoir)
			let mobx = _M.mob();

			mob._.stats.energie.cur = 0;
			mob._.stats.fatigue.cur = mob._.stats.fatigue.max * 0.7;

			mobx._.s = structuredClone(mob._.s);
			mobx._.stats = structuredClone(mob._.stats);
			mobx._.sheat = structuredClone(mob._.sheat);
			mobx._.perso = structuredClone(mob._.perso);

			mobx._.perso.clones = 0;
			mobx._.perso.dicoveredCase = [];
			mobx._.perso.xp = 0;
			mobx._.stats.faim.cur = 0;
			// mobx._.perso.updateInterval = _W.worldDatas.updateInterval + 50;
			mobx._.perso.parentId = mob._.perso.id;
			mobx.createNewMobDiv();

			mobx.initiate();

			_O.indexedMobsBymobIds[mobx._.perso.id] = mobx;

			mob._.perso.xp = +10;
			mob._.perso.clones++;

			// _M.rewardBonus.replication(mob);
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

			// _S.svgfunctions.refreshSvgJauge(mob, valuename);
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
				mob._.stats.faim.cur > mob._.stats.faim.max * .5  &&
				mob._.stats.fatigue.cur < mob._.stats.fatigue.max * .5 &&
				_W.worldDatas.mobCounter < _W.worldDatas.maxreplicaton
				// && this._.stats.fatigue.cur < 50
				// && this._.stats.faim.cur < 20
				// && mob personal max cloning
			) {
				_W.worldDatas.mobCounter++
				_M.mobFunctions.replicate(mob);
			}
		},
		setFuturPosAndRoom: function (mob) {
			let next = {
				x: mob._.s.actual.x - Math.sin(mob._.dir) * mob._.perso.speed,
				y: mob._.s.actual.y + Math.cos(mob._.dir) * mob._.perso.speed,
			};
			if (_W.worldFunctions.isXYInWorld(next.x, next.y)) {
				// add room to next
				(next.RoomNum = _R.roomFunctions.getRoomNumberFromXY(next.x, next.y)),
					(mob._.s.futur = next);
			} else {
				// reset changeDir delay if x,y is out the world
				mob._.delayBeforeChangeDir.cur = 0;
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
			_S.svgfunctions.setSvg(mob, "svg");
			mob.mobDivElement.appendChild(mob.blocs.svg);
			//-------------------------------------
			mob.mobDisplayDiv = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "mobdisplay" },
			});
			mob.mobDatasDiv = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "datasdiv" },
			});
			mob.mobDisplayDiv.appendChild(mob.mobDatasDiv);
			mob.mobDivElement.appendChild(mob.mobDisplayDiv);
			//-------------------------------------
			mob.blocs.alldis = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "alldis" },
			});
			//-------------------------------------
			mob.blocs.starving = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "dis disstarving", textContent: "💔" }, //❤️
			}); //
			//-------------------------------------
			mob.blocs.resting = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "dis disresting", textContent: "💤" },
			}); //
			//-------------------------------------
			mob.blocs.alerte = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: { className: "dis disalerte", textContent: "☠️" },
			}); //💭
			mob.blocs.ico = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "dis disico",
					textContent: _T.tools.sanitize(mob._.sheat.ico),
				},
			});
			mob.blocs.voisins = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "dis disvoisins",
					textContent: "...",
				},
			});
			mob.blocs.texte = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "dis distexte",
					textContent: "",
				},
			});
			mob.blocs.myid = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "dis dismyid",
					textContent: mob._.perso.id,
				},
			});
			mob.blocs.consumable = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "dis disconsumable",
					textContent: "🔍",
				},
			});
			mob.blocs.consumablelast = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "dis disconsumablelast",
					textContent: "🔍",
				},
			});
			mob.blocs.alldis.prepend(mob.blocs.resting);
			mob.blocs.alldis.prepend(mob.blocs.myid);
			mob.blocs.alldis.prepend(mob.blocs.starving);
			mob.blocs.alldis.prepend(mob.blocs.alerte);
			mob.blocs.alldis.prepend(mob.blocs.consumable);
			mob.blocs.alldis.prepend(mob.blocs.consumablelast);
			mob.blocs.alldis.prepend(mob.blocs.ico);
			if (_W.worldDatas.displayEnemiesUnderMob) mob.blocs.alldis.prepend(mob.blocs.voisins);
			mob.blocs.alldis.prepend(mob.blocs.texte);
			//-------------------------------------

			mob.blocs.infomob = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "disinfomob",
					textContent: "disinfomob",
				},
			});
			mob.blocs.alldis.appendChild(mob.blocs.infomob);
			_M.mobFunctions.setInfoMobListener(mob);

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

				let immat = _F.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disimmat",
						textContent: "Name: " + mob._.perso.immat,
					},
				});
				let xp = _F.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disxp",
						textContent: "Xp: " + mob._.perso.xp,
					},
				});
				let faim = _F.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disfaim",
						textContent:
							"Faim: " +
							Math.floor(mob._.stats.faim.cur) +
							"/" +
							mob._.stats.faim.max,
					},
				});
				let energie = _F.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disenergie",
						textContent:
							"Energie: " +
							Math.floor(mob._.stats.energie.cur) +
							"/" +
							mob._.stats.energie.max,
					},
				});
				let fatigue = _F.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disfatigue",
						textContent:
							"Fatigue: " +
							Math.floor(mob._.stats.fatigue.cur) +
							"/" +
							mob._.stats.fatigue.max,
					},
				});
				let infomobtag = _F.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disinfomobtag",
						textContent: "disinfomob",
					},
				});
				mob.blocs.infomob.appendChild(infomobtag);
				mob.blocs.infomob.appendChild(immat);
				mob.blocs.infomob.appendChild(xp);
				mob.blocs.infomob.appendChild(faim);
				mob.blocs.infomob.appendChild(energie);
				mob.blocs.infomob.appendChild(fatigue);
			});
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
};
