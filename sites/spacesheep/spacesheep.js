"use strict";
const _T = {
	tools: {
		setFuturPos: function (obj) {
			let next = {
				x: obj.actual.x - Math.sin(obj.actual.theta) * obj.actual.speed,
				y: obj.actual.y + Math.cos(obj.actual.theta) * obj.actual.speed,
			};
			obj.futur.x = next.x;
			obj.futur.y = next.y;
		},
		createDiv: function (params) {
			let element = document.createElement(params.tag);
			if (params.attributes) {
				for (const key in params.attributes) {
					if (Object.hasOwnProperty.call(params.attributes, key))
						element[key] = params.attributes[key];
					if (params.style) {
						for (const key2 in params.style) {
							if (Object.hasOwnProperty.call(params.style, key2))
								element.style[key2] = params.style[key2];
						}
					}
				}
			}
			return element;
		},
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
		get_DegreeWithTwoPos: function (x, y, X, Y) {
			return (Math.atan2(Y - y, X - x) * 180) / Math.PI;
		},
		get_aleaPos: function () {
			return {
				x: this.rand(50, window.innerWidth - 50),
				y: this.rand(50, window.innerHeight - 50),
			};
		},
		addCss: function (string) {
			let stringcss = string;
			let style = document.createElement("style");
			style.textContent = _T.tools.sanitize(stringcss);
			style.id = "css";
			document.getElementsByTagName("head")[0].appendChild(style);
		},
	},
};
let _Datas = {};
let _mouse = {
	x: 0,
	y: 0,
	mousetargets: null,
	trackAllTarget: function () {
		let t = this.mousetargets;
		for (const key in t) {
			if (Object.hasOwnProperty.call(t, key)) {
				const ship = t[key].objet;
				ship.refreshtheta();
			}
		}
	},
	init: function () {
		_mouse.mousetargets = _ships.ships;
		document.addEventListener("mousemove", (e) => {
			this.x = e.clientX;
			this.y = e.clientY;
			// if(_Datas.mousetarget) this.trackTarget();
			if (this.mousetargets) this.trackAllTarget();
		});
	},
};
let _missiles = {
	missilesids: 0,
	missiles: {},
	add: function (sender) {
		let newmissile = { ..._missile };
		newmissile.id = this.missilesids + 0;
		newmissile.init(sender);
		let missile = {
			id: newmissile.id,
			objet: newmissile,
		};
		this.missiles[this.missilesids] = missile;
		// console.log("missiles", this.missiles[this.missilesids]);
		this.missilesids++;
		// return this.shipsids-1
	},
};
let _missile = {
	div: null,
	past: null,
	actual: null,
	futur: null,
	sender: null,
	init: function (sender) {
		// console.log(sender)
		this.sender = sender;
		this.actual = {
			speed: 2,
			w: 3,
			h: 3,
			x: sender.x + 0,
			y: sender.y + 0,
			theta: sender.theta + 0,
		};
		this.futur = {
			speed: 2,
			w: 3,
			h: 3,
			x: sender.x + 0,
			y: sender.y + 0,
			theta: sender.theta + 0,
		};
		this.div = _T.tools.createDiv({
			tag: "div",
			attributes: {
				className: "missile",
				// innerHTML: _Svg.getsvg(),
				// textContent: "i",
			},
			style: {
				position: "absolute",
			},
		});
		// console.log('sender',sender);
		// console.log('this.actual',this.actual);
		this.initDiv();
		document.body.appendChild(this.div);
	},
	refreshActual: function () {
		this.past = this.actual;
		this.actual = this.futur;
	},
	initDiv: function () {
		this.div.style.top = this.actual.y - this.actual.h / 2 + "px";
		this.div.style.left = this.actual.x - this.actual.w / 2 + "px";
		this.div.style.width = this.actual.h + "px";
		this.div.style.height = this.actual.w + "px";
		// this.actual.theta = _T.tools.get_DegreeWithTwoPos( this.actual.x, this.actual.y, _mouse.x, _mouse.y) + 90;
		this.div.style.transform = "rotate(" + this.actual.theta + "deg)";
	},
	applyFutur: function () {
		this.actual.x = this.futur.x + 0;
		this.actual.y = this.futur.y + 0;
		this.actual.theta = this.futur.theta + 0;
		// console.log('actual',this.actual);
	},
	step: function () {
		_T.tools.setFuturPos(this);
		this.applyFutur(this);
		this.div.style.top = this.actual.y - this.actual.h / 2 + "px";
		this.div.style.left = this.actual.x - this.actual.w / 2 + "px";

		// console.log('missile',this.futur)
	},
};
let _ships = {
	shipsids: 0,
	ships: {},
	add: function () {
		let newship = { ..._ship };
		let newid = this.shipsids + 0;
		newship.id = newid;
		newship.init();
		let sheep = {
			id: newid,
			objet: newship,
		};
		this.ships[this.shipsids] = sheep;
		console.log("missiles", this.ships[this.shipsids]);
		this.shipsids++;
		// return this.shipsids-1
	},
};
let _ship = {
	div: null,
	actual: null,
	futur: null,
	controls: null,
	init: function () {
		this.controls = _controls();
		this.controls.init();
		this.actual = {
			x: _T.tools.rand(50, window.innerWidth - 50),
			y: _T.tools.rand(50, window.innerHeight - 50),
			theta: 0,
		};
		this.div = _T.tools.createDiv({
			tag: "div",
			attributes: {
				className: "ship",
				innerHTML: _Svg.getsvg(),
			},
			style: {
				position: "absolute",
			},
		});
		this.refreshdiv();
		document.body.appendChild(this.div);
	},
	refreshdiv: function () {
		this.div.style.top = this.actual.y - _Svg.h / 2 + "px";
		this.div.style.left = this.actual.x - _Svg.w / 2 + "px";
		this.actual.theta =
			_T.tools.get_DegreeWithTwoPos(
				this.actual.x,
				this.actual.y,
				_mouse.x,
				_mouse.y
			) //+ 90;
		this.div.style.transform = "rotate(" + this.actual.theta + "deg)";
	},
	refreshtheta: function () {
		this.actual.theta =
			_T.tools.get_DegreeWithTwoPos(
				this.actual.x,
				this.actual.y,
				_mouse.x,
				_mouse.y
			) //+ 90;
		this.div.style.transform = "rotate(" + this.actual.theta + "deg)";
	},
	shoot1: function () {
		// let sho = _missiles;
		_missiles.add(this.actual);
	},
	step: function () {
		if (this.controls.shoot1) {
			// do action
			this.shoot1();
			this.controls.shoot1 = false;
		}
	},
	refreshPos: function () {},
};
let _controls = function () {
	let controls = {
		displayConslog: false,
		preventDefaultRightClick: true,
		init: function () {
			this._initProperties();
			this._addKeyboardListeners();
			document.body.oncontextmenu = (event) => {
				if (this.displayConslog) console.log("right click");
				if (this.preventDefaultRightClick) event.preventDefault();
				this.shoot2 = true;
			};
			document.onclick = () => {
				if (this.displayConslog) console.log("left click");
				this.shoot1 = true;
			};
		},
		_initProperties: function () {
			this.zooming = false;
			this.oldintersect = null;
			this.pMouse = { x: 0, y: 0 };

			this.thetaDeg = 0;

			this.shoot1 = false;
			this.shoot2 = false;
			this.shoot3 = false;
			this.shoot4 = false;
			this.shoot5 = false;

			this.space = false; // same ??
			this.jump = false; // same ??
			this.falling = false;

			this.forward = false;
			this.left = false;
			this.right = false;
			this.reverse = false;
			this.sleft = false;
			this.sright = false;
		},
		_addKeyboardListeners: function () {
			if (this.displayConslog) console.log("addKeyboardListeners");
			document.onkeydown = (event) => this._handleKeyDown(event);
			document.onkeyup = (event) => this._handleKeyUp(event);
		},
		_handleKeyDown: function (event) {
			const KEY_MAP = {
				"&": () => (this.shoot1 = true),
				ArrowLeft: () => (this.left = true),
				q: () => (this.left = true),
				a: () => (this.sleft = true),
				ArrowRight: () => (this.right = true),
				d: () => (this.right = true),
				e: () => (this.sright = true),
				ArrowUp: () => (this.forward = true),
				z: () => (this.forward = true),
				ArrowDown: () => (this.reverse = true),
				s: () => (this.reverse = true),
				" ": () => (this.space = true),
				Space: () => (this.space = true),
			};
			if (KEY_MAP[event.key]) {
				if (this.displayConslog) console.log("EVENT", event);
				if (this._preventDefaultRightClick) event.preventDefault();
				if (event.key === "'") event.preventDefault();
				KEY_MAP[event.key]();
			}
		},
		_handleKeyUp: function (event) {
			const KEY_MAP = {
				"&": () => (this.shoot1 = false),
				ArrowLeft: () => (this.left = false),
				q: () => (this.left = false),
				a: () => (this.sleft = false),
				ArrowRight: () => (this.right = false),
				d: () => (this.right = false),
				e: () => (this.sright = false),
				ArrowUp: () => (this.forward = false),
				z: () => (this.forward = false),
				ArrowDown: () => (this.reverse = false),
				s: () => (this.reverse = false),
				" ": () => (this.space = false),
				Space: () => (this.space = false),
			};
			if (KEY_MAP[event.key]) KEY_MAP[event.key]();
		},
	};
	return controls;
};
let animate = () => {
	let anime = setInterval((koi) => {
		for (const ship in _ships.ships) {
			if (Object.hasOwnProperty.call(_ships.ships, ship)) {
				const element = _ships.ships[ship];
				element.objet.step();
			}
		}
		for (const missile in _missiles.missiles) {
			if (Object.hasOwnProperty.call(_missiles.missiles, missile)) {
				const element = _missiles.missiles[missile];
				element.objet.step();
			}
		}
	}, 10);
};
let go = function () {
	_controls.displayConslog = true;
	_controls.preventDefaultRightClick = false;

	_mouse.init();
	_ships.add();
	// _ships.add();

	_T.tools.addCss("body{background-color: rgb(36, 2, 2)}");

	animate();
};
window.addEventListener("DOMContentLoaded", () => go());
