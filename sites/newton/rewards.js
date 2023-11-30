let _rewards = {
	id: new Number(0),
	objects: {},
	counter: new Number(0),
	getRewardsType: () => {
		let cadeaux = [
			{ visual: { emoji: "🕯️", range: 24 , skillName:'antigravity'} },
			{ visual: { emoji: "🎄", range: 24 , skillName:'antigravity'} },
			{ visual: { emoji: "⛄", range: 24 , skillName:'antigravity'} },
			{ visual: { emoji: "🎅🏿", range: 24 , skillName:'antigravity'} },
			{ visual: { emoji: "🤶🏾", range: 24 , skillName:'antigravity'} },
			{ visual: { emoji: "🎁", range: 24 , skillName:'antigravity'} },
			{ visual: { emoji: "❄️", range: 24 , skillName:'antigravity'} },
			{ visual: { emoji: "🌟", range: 24 , skillName:'antigravity'} },
			{ visual: { emoji: "🔔", range: 24 , skillName:'antigravity'} },
		];
		let rand = tools.rand(0, cadeaux.length - 1);
		rand = JSON.parse(JSON.stringify(cadeaux[rand]));
		return rand;
	},
	conf: {
		type: "reward",
		radius: 12,
		mass: 1 * Math.pow(10, 3),
		velocity: { x: 0, y: 0 },
		position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
		visual: { emoji: "🎁", radius: 24 },
		vitesse: 0,
		success: { cur: new Number(0), need: new Number(1), done: false },
		autonomie: { cur: new Number(1000) },
		birthDate: new Date(),
		collected: false,
	},
	animeStep(m) {
		for (const id in this.objects) {
			if (Object.hasOwnProperty.call(this.objects, id)) {
				let r = this.objects[id];
				if (!r.conf.collected && this.checkCollide(m, r)) {
					r.conf.collected = true;
					r.div.classList.add("collected");
					console.log("collide");
					setTimeout(() => {
						r.div.remove();
						delete r;
					}, 1000);
					delete this.objects[id];
					this.counter--;
				}
			}
		}
	},
	checkCollide(m, r) {
		let distance = tools.calculateDistance(
			m.conf.position.x,
			m.conf.position.y,
			r.conf.position.x,
			r.conf.position.y
		);
		if (distance < r.conf.range) {
			return true;
		}
		return false;
	},
	add(m) {
		this.objects[this.id] = { conf: JSON.parse(JSON.stringify(this.conf)) };
		let r = this.objects[this.id];
		r.id = this.id;

		let type = this.getRewardsType();

		console.log(type)
		r.conf.visual.emoji = type.visual.emoji;
		r.conf.range = type.visual.range;

		r.conf.position.x = m.conf.position.x + 0;
		r.conf.position.y = m.conf.position.y + 0;

		r.div = tools.createDiv({
			tag: "div",
			attributes: { id: "r_" + this.id, className: "reward" },
			style: {
				position: "absolute",
				transform: `translate(${r.conf.position.x - r.conf.radius}px, ${
					r.conf.position.y - r.conf.radius
				}px)`,
				width: r.conf.radius * 2 + "px",
				height: r.conf.radius * 2 + "px",
			},
		});
		r.visualDiv = tools.createDiv({
			tag: "div",
			attributes: {
				id: "rv_" + this.id,
				className: "visual",
				textContent: r.conf.visual.emoji,
			},
			style: {
				width: r.conf.visual.radius * 2 + "px",
				height: r.conf.visual.radius * 2 + "px",
			},
		});
		r.div.appendChild(r.visualDiv);
		Game.world.appendChild(r.div);

		this.objects[this.id] = r;
		this.id++;
		this.counter++;
		// this.addNeedDiv(p)
	},
};
