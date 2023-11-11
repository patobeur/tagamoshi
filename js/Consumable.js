const _C = {
	consumableFunctions: {
		consumable: function () {
			let consumable = {
				divElement: _T.tools.createDiv({
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
						updateInterval: _W.worldDatas.updateInterval + _T.tools.rand(0, 50),
						parent: null,
					},
					s: {
						actual: {
							x: _T.tools.rand(0, _W.worldDatas.roomSideLength),
							y: _T.tools.rand(0, _W.worldDatas.roomSideLength),
							z: _T.tools.rand(-1, 1),
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
					_C.consumableFunctions.setNewIDS(this);
					_C.consumableFunctions.createNewDiv(this);
					// _W.communsFunctions.setPos(this, _W.worldDatas.consumabledatas);
					_W.communsFunctions.setCenterPosInThisRoom(
						this,
						_W.worldDatas.consumabledatas,
						parent
					);
					if (
						_W.worldFunctions.isXYInWorld(this._.s.actual.x, this._.s.actual.y)
					) {
						_O.worldRoomsDiv.append(this.divElement);
						return true
					}
					else {
						delete this
						return false
					}
				},
			};
			return { ...consumable };
		},
		dropconsumable: function (help = "###", parent = false, caseNumber = false) {
			
			if (!(parent === false && caseNumber === false)) {
				let rand = _T.tools.rand(0, 100)
				if (rand <= _W.worldDatas.consumabledropchance * 100) {
					if (_W.worldDatas.consumableIds < _W.worldDatas.maxconsumable) {

						let consumable = _C.consumableFunctions.consumable();

						let isconsumableok = consumable.initiate(parent, caseNumber);
						if (isconsumableok){

							_W.worldDatas.consumableIds++;
							parent.divElement.classList.add("onfruits");
							consumable.divElement.classList.add("new");

							setTimeout(function() {
								// _W.communsFunctions.setPos(this, _W.worldDatas.consumabledatas);
								_W.communsFunctions.setAleaPosInThisRoom(consumable,_W.worldDatas.consumabledatas);
								consumable.divElement.classList.remove("new");
								parent.divElement.classList.remove("onfruits");
							}, _W.worldDatas.consumableTimeout/3);
							setTimeout(function() {
								_W.worldFunctions.refreshCounter('consumableCounter',1)
								_O.indexedconsumableByIds[consumable._.perso.id] = consumable;
								_O.indexedRoomsByCaseNumber[consumable._.s.actual.RoomNum].consumables[consumable._.perso.id] = consumable;
	
							}, _W.worldDatas.consumableTimeout);
						}
						else {
							console.log('consumable out of world',_W.worldDatas.consumableIds,_W.worldDatas.maxconsumable)
						}
					}
					else {
						console.log('max consumableIds ',_W.worldDatas.consumableIds,_W.worldDatas.maxconsumable)
					}
				}
			} else {
				console.log(help + " has no parent and no caseNumber");
			}
		},
		createNewDiv: function (consumable) {
			consumable.divElement = _T.tools.createDiv({
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
		},
	},
};
