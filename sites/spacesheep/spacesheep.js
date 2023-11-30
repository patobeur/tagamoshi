
const gravityRangeDiametre = 5000; // portée de gravité
const gravity = .00003; // force de gravité
const missileMass = .00005; // masse des missiles
const missileSpeed = 3; // masse des missiles
// ---------------------------------------------
const maxMissileSteps = 3000;
const animateInterval = 10;
// ---------------------------------------------
const _tools = {
	calculateDistance: function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
	setFuturPos: function (obj) {
		let radianTheta = obj.actual.theta * (Math.PI / 180); // Convertir en radians
		let next = {
			x: obj.actual.x + Math.cos(radianTheta) * obj.speed, // Utiliser cos pour x
			y: obj.actual.y + Math.sin(radianTheta) * obj.speed, // Utiliser sin pour y
		};
		obj.actual.x = next.x;
		obj.actual.y = next.y;
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
		style.textContent = _tools.sanitize(stringcss);
		style.id = "css";
		document.getElementsByTagName("head")[0].appendChild(style);
	},
};
let _mouse = {
	x: 0,
	y: 0,
	ok: false,
	trackAllTarget: function () {
		for (const key in _ships.ships) {
			if (Object.hasOwnProperty.call(_ships.ships, key)) {
				_ships.ships[key].refreshtheta();
			}
		}
	},
	track: function(){
		let ship = _ships.ships[0]
		ship.mousedistance = Math.floor(Math.sqrt(Math.pow(ship.actual.x - _mouse.x, 2) + Math.pow(ship.actual.y - _mouse.y, 2)));
		let theta = _tools.get_DegreeWithTwoPos(
			ship.actual.x,
			ship.actual.y,
			_mouse.x,
			_mouse.y
		); //+ 90;
		// console.log(ship.mousedistance,theta)
	},
	init: function () {
		document.addEventListener("mousemove", (e) => {
			this.x = e.clientX;
			this.y = e.clientY;
			this.trackAllTarget();
			// this.track()
		});
	},
};
let _goals = {
	goalsids: 0,
	goals: {},
	add: function (goal) {
		let newgoal = { ..._goal() };
		newgoal.id = this.goalsids + 0;
		newgoal.init(goal);
		this.goals[newgoal.id] = newgoal;
		this.goalsids++;
	},
};
let _goal = () => {
	let goal = {
		div: null,
		actual: null,
		w:2,
		h:2,
		init: function () {
			// this.controls = _controls();
			// this.controls.init();
			this.actual = {
				// x: _tools.rand(50, window.innerWidth - 50),
				// y: _tools.rand(50, window.innerHeight - 50),
				x: !_ships.shipsSide ? _tools.rand(25, window.innerWidth/4) : _tools.rand(window.innerWidth - (window.innerWidth/4), window.innerWidth - 50) ,
				y: _tools.rand(50, window.innerHeight - 50),
				theta: 0,
			};
			this.div = _tools.createDiv({
				tag: "div",
				attributes: {
					className: "goal"
				},
				style: {
					position: "absolute",
				},
			});
			this.divemoji = _tools.createDiv({
				tag: "div",
				attributes: {
					className: "emoji",
					innerHTML: _svg.goal.getsvg(),
				},
				// style: {
				// 	position: "absolute",
				// },
			});
			this.refreshdiv();
			this.div.appendChild(this.divemoji);
			document.body.appendChild(this.div);
		},
		refreshdiv: function () {
			this.div.style.top = this.actual.y - this.h/2 + "px";
			this.div.style.left = this.actual.x - this.w/2 + "px";
		},
	}
	return { ...goal}
}
let _blackholes = {
	blackholesids: 0,
	blackholes: {},
	add: function (blackhole) {
		let newblackhole = { ..._blackhole() };
		// let newblackhole = _blackhole();
		newblackhole.id = this.blackholesids + 0;
		newblackhole.init(blackhole);
		this.blackholes[newblackhole.id] = newblackhole;
		this.blackholesids++;
	},
};
let _blackhole = () => {
	let blackhole = {
		div: null,
		actual: null,
		w:10,
		h:10,
		gravityRangeDiametre: gravityRangeDiametre,
		gravity: gravity,
		init: function () {
			this.actual = {
				x: _tools.rand(50+(window.innerWidth/3), ((window.innerWidth/3)*2) - 50),
				y: _tools.rand(50, window.innerHeight - 50),
				theta: 0,
			};
			this.div = _tools.createDiv({
				tag: "div",
				attributes: {
					className: "blackhole"
				},
				style: {
					position: "absolute",
				},
			});
			this.divemoji = _tools.createDiv({
				tag: "div",
				attributes: {
					className: "emoji",
					// innerHTML: _svg.blackhole.getsvg(),
				}
			});
			this.divmaxattract = _tools.createDiv({
				tag: "div",
				attributes: {
					className: "maxattract"
				}
			});
			this.divdistanceconsume = _tools.createDiv({
				tag: "div",
				attributes: {
					className: "distanceconsume"
				}
			});
			this.divdistanceattract = _tools.createDiv({
				tag: "div",
				attributes: {
					className: "distanceattract"
				}
			});
			this.refreshdiv();
			this.div.appendChild(this.divemoji);
			this.div.appendChild(this.divdistanceattract);
			this.div.appendChild(this.divdistanceconsume);
			this.div.appendChild(this.divmaxattract);
			document.body.appendChild(this.div);
		},
		refreshdiv: function () {
			this.div.style.top = this.actual.y - this.h/2 + "px";
			this.div.style.left = this.actual.x - this.w/2 + "px";
		},
	}
	return { ...blackhole}
}
let _missiles = {
	missilesids: 0,
	missiles: {},
	add: function (ship) {
		// let newmissile = { ..._missile };
		let newmissile = _missile();
		newmissile.id = this.missilesids + 0;
		newmissile.init(ship);
		this.missiles[newmissile.id] = newmissile;
		this.missilesids++;
		// console.log("newmissile", newmissile);
		// return this.shipsids-1
	},
};
let _missile = () => {
	let missile = {
		div: null,
		divemoji: null,
		actual: null,
		sender: null,
		w: 8,
		h: 8,
		speed: missileSpeed,
		speeds: {x:null,y:null},
		steps: { cur: 0, max: maxMissileSteps },
		distance: { cur: 0, max: window.innerWidth },
		missileMass: missileMass,
		init: function (sender) {

			this.sender = { ...sender };
			//this.sender.mousedistance = Math.floor(Math.sqrt(Math.pow(this.sender.actual.x - _mouse.x, 2) + Math.pow(this.sender.actual.y - _mouse.y, 2)));
			// let speed =  (sender.mousedistance/window.innerWidth) * 5
			// this.speeds.x = speed
			// this.speeds.y = speed

			this.actual = {
				x: this.sender.actual.x + 0,
				y: this.sender.actual.y + 0,
				theta: this.sender.actual.theta + 0,
			};
			this.div = _tools.createDiv({
				tag: "div",
				attributes: {
					className: "missile"
				},
				style: {
					position: "absolute",
					transform: "rotate(" + this.actual.theta + "deg)"
				},
			});
			this.divemoji = _tools.createDiv({
				tag: "div",
				attributes: {
					className: "emoji",
					innerHTML: _svg.mouton.getsvg(),
				}
			});
			this.div.appendChild(this.divemoji);
			// console.log('theta start',this.actual.theta)
			document.body.appendChild(this.div);
		},
		initDiv: function () {
			this.div.style.top = this.actual.y - this.h / 2 + "px";
			this.div.style.left = this.actual.x - this.w / 2 + "px";
			this.div.style.width = this.w + "px";
			this.div.style.height = this.h + "px";
			// this.actual.theta = _tools.get_DegreeWithTwoPos( this.actual.x, this.actual.y, _mouse.x, _mouse.y) + 90;
			// this.div.style.transform = "rotate(" + this.actual.theta + "deg)";
		},
		step: function () {
			if (this.steps.cur < this.steps.max) {
				this.steps.cur++;
				console.log(this.steps.cur)
				_tools.setFuturPos(this);
				this.div.style.top = this.actual.y - this.h / 2 + "px";
				this.div.style.left = this.actual.x - this.w / 2 + "px";
			}
	
			// Vérifier si le missile est en dehors des limites de l'écran
			// if (this.actual.x < 0 || this.actual.x > window.innerWidth || this.actual.y < 0 || this.actual.y > window.innerHeight) {
			if ((this.steps.cur >= this.steps.max)){// || (this.distance.cur >= this.distance.max)) {
				this.div.remove(); // Supprimer le div du DOM				
				console.log('missile lost in space!!')
				delete _missiles.missiles[this.id]; // Supprimer de l'objet _missiles
				return; 
			}
		},
		attractedByBlackhole: function(blackhole) {
			let distance = _tools.calculateDistance(this.actual.x, this.actual.y, blackhole.actual.x, blackhole.actual.y);
			let collisionDistance = this.w / 2 + blackhole.w / 2;
		
			if (distance < blackhole.gravityRangeDiametre / 2) {
				let force = blackhole.gravity / (distance * distance);
		
				let forceX = force * (blackhole.actual.x - this.actual.x) ;
				let forceY = force * (blackhole.actual.y - this.actual.y) ;
		
				this.speeds.x += forceX / this.missileMass;
				this.speeds.y += forceY / this.missileMass;
						
				this.nextx = this.actual.x + this.speeds.x;
				this.nexty = this.actual.y + this.speeds.y;
        
				this.actual.theta = _tools.get_DegreeWithTwoPos(
					this.actual.x,
					this.actual.y,
					this.nextx,
					this.nexty
				); //+ 90;
        
				this.actual.x = this.nextx;
				this.actual.y = this.nexty;

				this.div.style.transform = "rotate(" + this.actual.theta + "deg)";
		
				if (distance < collisionDistance) {
					return true;
				}
			}
			return false;
		},
		attractedByBlackhole2: function(blackhole) {
			let distance = _tools.calculateDistance(this.actual.x, this.actual.y, blackhole.actual.x, blackhole.actual.y);
			let collisionDistance = this.w / 2 + blackhole.w / 2;
			let deviationDistance = blackhole.gravityRangeDiametre / 2;
		
				
				// le missile suit une trajectoire de projectile dans l'espace (en 2d ici)
				// le missile suit une trajectoire deformée par les blackhole existants
				// la gravité s'appliqe en fonction de la distance.
				// le missile doit respecter les effets de fronde gravitationelle.
				// les trajectoires doivent etre réalistes d'un point de vue scientifique

		
			if (distance < collisionDistance) {
				return true; // Le missile est consommé par le trou noir
			}
		
			return false; // Le missile n'est pas encore consommé
		},
	};
	return { ...missile };
};
let _ships = {
	shipsids: 0,
	ships: {},
	shipsSide:true,
	add: function () {
		let newship = _ship();
		let newid = this.shipsids + 0;
		newship.id = newid;
		newship.init();
		// let sheep = {
		// 	id: newid,
		// 	objet: newship,
		// };
		this.ships[this.shipsids] = newship;
		// console.log("ship:", newship);
		this.shipsids++;
		// return this.shipsids-1
	},
	shoot1: function () {
		console.log("shoot1");
		for (const key in _ships.ships) {
			if (Object.hasOwnProperty.call(_ships.ships, key)) {
				const ship = _ships.ships[key];
				ship.mousedistance = Math.floor(Math.sqrt(Math.pow(ship.actual.x - _mouse.x, 2) + Math.pow(ship.actual.y - _mouse.y, 2)));
				_missiles.add(ship);
			}
		}
	},
};
let _ship = () => {
	let ship = {
		div: null,
		actual: null,
		init: function () {
			this.actual = {
				x: _ships.shipsSide ? _tools.rand(25, window.innerWidth/4) : _tools.rand(window.innerWidth - (window.innerWidth/4), window.innerWidth - 50) ,
				y: _tools.rand(100, window.innerHeight - 25),
				theta: 0,
			};
			this.div = _tools.createDiv({
				tag: "div",
				attributes: {
					className: "ship",
					innerHTML: _svg.sheep.getsvg(),
				},
				style: {
					position: "absolute",
				},
			});
			this.refreshdiv();
			document.body.appendChild(this.div);
		},
		refreshdiv: function () {
			this.div.style.top = this.actual.y - _svg.sheep.h / 2 + "px";
			this.div.style.left = this.actual.x - _svg.sheep.w / 2 + "px";
			this.actual.theta = _tools.get_DegreeWithTwoPos(
				this.actual.x,
				this.actual.y,
				_mouse.x,
				_mouse.y
			); //+ 90;
			this.div.style.transform = "rotate(" + this.actual.theta + "deg)";
		},
		refreshtheta: function () {
			let newTheta = _tools.get_DegreeWithTwoPos(
				this.actual.x,
				this.actual.y,
				_mouse.x,
				_mouse.y
			); //+ 90;
			this.actual.theta = newTheta;
			this.div.style.transform = "rotate(" + this.actual.theta + "deg)";
		},
	};
	return { ...ship };
};
let _controls = {
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
let animate = () => {
    let anime = setInterval(() => {
        for (const key in _missiles.missiles) {
            if (Object.hasOwnProperty.call(_missiles.missiles, key)) {
                const missile = _missiles.missiles[key];
                missile.step();
            }
        }
        for (const missileKey in _missiles.missiles) {
            const missile = _missiles.missiles[missileKey];
    
            for (const blackholeKey in _blackholes.blackholes) {
                const blackhole = _blackholes.blackholes[blackholeKey];
    
                if (missile.attractedByBlackhole(blackhole)) {
                    if (missile.div) missile.div.remove(); // Supprimer le div du DOM
                    delete _missiles.missiles[missileKey]; // Supprimer le missile de l'objet _missiles
                    break; // Sortir de la boucle des trous noirs
                }
            }
        }
        if (_controls.shoot1) {
            _ships.shoot1();
            _controls.shoot1 = false;
        }
    }, animateInterval);
};
let go = function () {
	_controls.displayConslog = false;
	_controls.preventDefaultRightClick = false;	
	_ships.shipsSide = _tools.rand(0,1) > 0.5;
	_controls.init();
	_mouse.init();
	_ships.add();
	_blackholes.add();
	_blackholes.add();
	_blackholes.add();
	_blackholes.add();
	_goals.add();
	_tools.addCss(_css());
	animate();
};
window.addEventListener("DOMContentLoaded", () => go());
