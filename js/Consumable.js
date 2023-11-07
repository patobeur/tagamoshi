const _C = {
	consumableFunctions: {
		consumable: function () {
			let consumable = {
				divElement: _F.frontFunctions.createDiv({
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
				if (_T.tools.rand(0, 100) <= _W.worldDatas.consumablechance * 100) {
					if (_W.worldDatas.consumableIds < _W.worldDatas.roomIds / 3) {
						let consumable = _C.consumableFunctions.consumable();
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
			consumable.divElement = _F.frontFunctions.createDiv({
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
	}
};