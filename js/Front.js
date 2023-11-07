const _F = {
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
			style.textContent = _T.tools.sanitize(stringcss);
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
				attributes: { className: "dis disstarving", textContent: "💭" },
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
			}); //🎲💭
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
			mob.blocs.myid = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "dis dismyid",
					textContent: mob._.perso.id,
				},
			});
			mob.blocs.alldis.prepend(mob.blocs.myid);
			mob.blocs.alldis.prepend(mob.blocs.starving);
			mob.blocs.alldis.prepend(mob.blocs.resting);
			mob.blocs.alldis.prepend(mob.blocs.alerte);
			mob.blocs.alldis.prepend(mob.blocs.ico);
			mob.blocs.alldis.prepend(mob.blocs.voisins);
			//-------------------------------------

			mob.blocs.infomob = _F.frontFunctions.createDiv({
				tag: "div",
				attributes: {
					className: "disinfomob",
					textContent: "disinfomob",
				},
			});
			mob.blocs.alldis.appendChild(mob.blocs.infomob);
			_F.frontFunctions.setInfoMobListener(mob);

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
						textContent: "Faim: " + Math.floor(mob._.stats.faim.cur) + '/' + mob._.stats.faim.max,
					},
				});
				let energie = _F.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disenergie",
						textContent: "Energie: " + Math.floor(mob._.stats.energie.cur) + '/' + mob._.stats.energie.max,
					},
				});
				let fatigue = _F.frontFunctions.createDiv({
					tag: "div",
					attributes: {
						className: "disfatigue",
						textContent: "Fatigue: " + Math.floor(mob._.stats.fatigue.cur) + '/' + mob._.stats.fatigue.max,
					},
				});
				mob.blocs.infomob.appendChild(immat);
				mob.blocs.infomob.appendChild(xp);
				mob.blocs.infomob.appendChild(faim);
				mob.blocs.infomob.appendChild(energie);
				mob.blocs.infomob.appendChild(fatigue);

				// console.log(mob._.perso.immat + " talking : what ?");
				// console.log(this._);
			});
		},
	},
};