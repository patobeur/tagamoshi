let _base = () => {
	this.id = 0;
	this.bases = {};
	this.basesCounter = 0;
	this.basesconf = {
		radius: 15,
		success:{cur:new Number(0),need:new Number(3),done:false},
		mass: 0,
		velocity: { x: 0, y: 0 },
		position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
		visual: { emoji: "🎱", radius: 15 },
		angleToMouse: 0,
	};
	this.init = (world) => {
		this.world = world;
		this.worldpos = this.world.getBoundingClientRect();
		this.addbase();
	};
	this.addbase = function (datas = false) {
		let base = { conf: JSON.parse(JSON.stringify(this.basesconf)) };
		base.conf.id = this.id;
		base.conf.position.x = datas && datas.x ? datas.x : this.worldpos.width / 2;
		base.conf.position.y =
			datas && datas.y
				? datas.y
				: this.worldpos.height - this.basesconf.radius - 50;
		base.div = tools.createDiv({
			tag: "div",
			attributes: { className: "base" },
			style: {
				width: base.conf.radius * 2 + "px",
				height: base.conf.radius * 2 + "px",
			},
		});
		base.visualdiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "visual",
				// textContent: base.conf.visual.emoji,
				innerHTML: _svg.shipper.getsvg(base),
			},
			style: {
				width: base.conf.visual.radius * 2 + "px",
				height: base.conf.visual.radius * 2 + "px",
			},
		});

		base.div.appendChild(base.visualdiv);

		this.bases[this.id] = base;
		this.world.appendChild(this.bases[this.id].div);

		this.refreshDivPos(this.id);
		this.id++;
	};
	this.refreshDivPos = function (id) {
		let o = this.bases[id];
		let x = Math.round(o.conf.position.x - o.conf.radius);
		let y = Math.round(o.conf.position.y - o.conf.radius);
		let r = o.conf.angleToMouse;
		o.div.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
	};
	this.onMouseclick = function (event) {
		// console.log(event.target)
		if(event.target.className!='num') {
			let currentbase = Game.Bases.bases[this.id - 1];
			if (currentbase && Game.animeOn===true && _mobs.datas.missile.maxAtTime > _mobs.datas.missile.counter) {
				// Game.addMobileObjects(this.bases[0]);
				_mobs.addNewMob(currentbase);
				let lastMissile = _mobs.datas["missile"].objects[_mobs.datas["missile"].id - 1];
				lastMissile.conf.angleRadiansToMouse =
					currentbase.conf.angleRadiansToMouse + 0;
				lastMissile.conf.angleToMouse = currentbase.conf.angleToMouse + 0;
				lastMissile.conf.distanceToMouse = currentbase.conf.distanceToMouse + 0;
			}
		}
	};
	this.onMouseMoove = function () {
		this.refreshDivPos(Game.Bases.id - 1);
	};
	return this;
};
