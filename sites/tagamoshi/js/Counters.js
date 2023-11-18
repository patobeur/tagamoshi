const _Co = {
	countersFunctions: {
		hd:true,
		refreshCounter: function (counterName, value, obj = false) {
			if (obj) {
				_W.worldDatas.counters[counterName + "ico"].textContent =
					obj._.sheat.ico;
			}
			_W.worldDatas[counterName] += value;
			_W.worldDatas.counters[counterName + "num"].textContent = (_W.worldDatas[counterName]<10?'0':'') + _W.worldDatas[counterName];

			if (this.hd) {
				let classname = value > 0 ? "up" : "down";
				_W.worldDatas.counters[counterName + "ico"].classList.add(classname);
				setTimeout(function () {
					_W.worldDatas.counters[counterName + "ico"].classList.remove(
						classname
					);
				}, 500);
			}
		},
		createCountersDivsAndAddToDom: function () {
			let arraydiv = [
				"mobCounter",
				"treeCounter",
				"consumableCounter",
				"roomCounter",
			];
			let arrayemoji = ["🐰", "🌴", "🍒", "🗺️"];
			_W.worldDatas.counters.divCounter = _T.tools.createDiv({
				tag: "div",
				attributes: {
					id: "counters",
					className: "counters",
				},
				// style: {
				// top: window.innerHeight / 2 - _W.worldDatas.sizes.size.h / 2 + "px",
				// left: window.innerWidth / 2 - _W.worldDatas.sizes.size.w / 2 + "px",
				// height: _W.worldDatas.sizes.size.h + "px",
				// width: _W.worldDatas.sizes.size.w + "px",
				position: "absolute",
				// },
			});
			for (let i = 0; i < arraydiv.length; i++) {
				const element = arraydiv[i];
				_W.worldDatas.counters[element + "ico"] = _T.tools.createDiv({
					tag: "div",
					attributes: {
						className: "counter-item counterico",
						textContent: arrayemoji[i],
					},
				});
				_W.worldDatas.counters[element + "num"] = _T.tools.createDiv({
					tag: "div",
					attributes: {
						className: "counter-item counternum",
						textContent: "00",
					},
				});
				_W.worldDatas.counters[element] = _T.tools.createDiv({
					tag: "div",
					attributes: { className: "counter " + element },
				});
				_W.worldDatas.counters[element].appendChild(
					_W.worldDatas.counters[element + "ico"]
				);
				_W.worldDatas.counters[element].appendChild(
					_W.worldDatas.counters[element + "num"]
				);
				_W.worldDatas.counters.divCounter.appendChild(
					_W.worldDatas.counters[element]
				);
			}
			document.body.appendChild(_W.worldDatas.counters.divCounter);
		},
		setcounterDatas: function () {},
	},
};
