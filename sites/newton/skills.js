let _skills = {
	id: new Number(0),
	objects: {},
	counter: new Number(0),
	conf: {
		antigravity: {
			autonomie: { cur: new Number(1000) },
			birthDate: new Date(),
			done: false,
		},
		speed: {
			autonomie: { cur: new Number(1000) },
			birthDate: new Date(),
			done: false,
		},
		sixcoups: {
			autonomie: { cur: new Number(1000) },
			birthDate: new Date(),
			done: false,
		},
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
};
