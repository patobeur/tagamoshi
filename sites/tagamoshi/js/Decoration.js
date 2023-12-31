const _D = {
	decorationFunctions: {
		tree: function () {
			let tree = {
				divElement: _T.tools.createDiv({
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
						immat: null, 
						type: null, 
						updateInterval: _W.worldDatas.updatetreeInterval + _T.tools.rand(
							_W.worldDatas.updatetreeDropRatePlus-1000,
							_W.worldDatas.updatetreeDropRatePlus
					)},
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
				treeUpdate: function (tree) {
					let rand = _T.tools.rand(0, 100);
					// chance to get fruits
					if (rand <= _W.worldDatas.treeConsumableDropChance * 100) {
						_C.consumableFunctions.dropconsumable("new fruit:", tree, false);
					}
				},
				initiate: function (tree, caseNumber) {
					tree._.perso.updateInterval  = _W.worldDatas.updatetreeInterval + _T.tools.rand( _W.worldDatas.updatetreeDropRatePlus-1000, _W.worldDatas.updatetreeDropRatePlus)

					_D.decorationFunctions.setNewIDS(tree);
					_D.decorationFunctions.createNewDiv(tree);
					tree._.s.actual.RoomNum = caseNumber;

					_W.communsFunctions.setNewPosInThisRoom(
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
						_R.roomFunctions.setRoomLevel(
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
				if (_T.tools.rand(0, 100) <= _W.worldDatas.threechance * 100) {
					if (_W.worldDatas.treeIds < _W.worldDatas.roomIds * 2) {
						let tree = _D.decorationFunctions.tree();
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
			tree.divElement = _T.tools.createDiv({
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

			_W.worldDatas.treeIds++;
			_Co.countersFunctions.refreshCounter('treeCounter',1,tree)
		},
	},
};