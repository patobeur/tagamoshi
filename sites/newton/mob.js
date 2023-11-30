let _mobs = {
	minfast: {x:new Number(0),y:new Number(0)},
	maxfast: {x:new Number(0),y:new Number(0)},
	datas: {
		missile: {
			id: new Number(0),
			objects: {},
			counter:new Number(0),
			conf: {
				type: "missile",
				radius: 12,
				mass: 1 * Math.pow(10, 3),
				velocity: { x: 0, y: 0 },
				position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
				visual: { emoji: "🎱", radius: 30 },
				vitesse:0,
				success:{cur:new Number(0),need:new Number(1),done:false},
			},
		},
		blackHole: {},
	},
	resetAll: function () {
        let MISSILES = this.datas['missile'].objects
        for (const id in MISSILES) {
			if (Object.hasOwnProperty.call(MISSILES, id)) {
                let m = MISSILES[id]
				// m.div.remove()
				m.dead=true
			}
		}
		// this.datas['missile'].objects = {}
		// this.datas['missile'].counter = new Number(0)
		// this.datas['missile'].id = new Number(0)
	},
	addNewMob: function (datas = false) {
        conf = (datas && datas.type && typeof this.datas[datas.type] != "undefined")
            ? JSON.parse(JSON.stringify(this.datas[datas.type].conf))
            : JSON.parse(JSON.stringify(this.datas["missile"].conf));
        if (datas) {
            p = datas.conf.position
			conf.position.x = p.x ? datas.conf.position.x + 0 : tools.rand(conf.radius, Game.worldpos.width - conf.radius);
			conf.position.y = p.y ? datas.conf.position.y + 0 : tools.rand(conf.radius, Game.worldpos.height - conf.radius);
		}
		let allObjects = this.datas[conf.type].objects;
		let counter = this.datas[conf.type].counter;
		let id = this.datas[conf.type].id;
		
		allObjects[id] = { conf: conf };

		let m = allObjects[id];
		m.id = id;

		m.div = tools.createDiv({
			tag: "div",
			attributes: { id: "m_" + id, className: m.conf.type },
			style: {
				width: m.conf.radius * 2 + "px",
				height: m.conf.radius * 2 + "px",
			},
		});
		m.visualdiv = tools.createDiv({
			tag: "div",
			attributes: {
				id: "mv_" + id,
				className: "visual",
				textContent: m.conf.visual.emoji,
				innerHTML: _svg.spaceship.getsvg(m),
			},
			style: {
				width: m.conf.visual.radius * 1.5 + "px",
				height: m.conf.visual.radius * 1.5 + "px",
			},
		});
		this.setVelocity(m);
		this.refreshObjectDivPos(m);
		m.div.appendChild(m.visualdiv);
		Game.world.appendChild(m.div);
		this.datas[conf.type].id++;
		this.datas[conf.type].counter++;
	},
	deleteObject: function (m) {
		m.div.remove();
		delete this.datas[m.conf.type].objects[m.id];
		this.datas[m.conf.type].counter--;
	},
	refreshObjectDivPos: function (m) {
		let x = Math.round(m.conf.position.x); // - Game.worldpos.left)
		let y = Math.round(m.conf.position.y); // - Game.worldpos.top)
		let r = tools.getRotationAngle(m);
		// m.div.style.transform = `translate(${x}px, ${y}px)`;
		m.div.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;

		if ((m.conf.velocity.x + m.conf.velocity.y) / 2 > 15) {
			if (m.conf.velocity.x + m.conf.velocity.y < 20) {
				m.div.classList.add("alerte");
			}
			if (m.conf.velocity.x + m.conf.velocity.y >= 20) {
				m.div.classList.add("alerte2");
				m.dead = true;
			}
		}
		if (m.conf.velocity.x + m.conf.velocity.y <= 15) {
			m.div.classList.remove("alerte");
			m.div.classList.remove("alerte2");
		}
	},
	// updateVelocityOnClick: function (m) {
	// 	let o = this.objects[oid];
	// 	const distance = Math.sqrt(
	// 		Math.pow(this.mouse.x - m.conf.position.x, 2) +
	// 			Math.pow(this.mouse.y - m.conf.position.y, 2)
	// 	);
	// 	m.conf.speed = Math.min(Math.max(2, distance / 50), 6);
	// 	m.conf.angle = Math.atan2(
	// 		this.mouse.y - m.conf.position.y,
	// 		this.mouse.x - m.conf.position.x
	// 	);
	// 	m.conf.velocity.x = m.conf.speed * Math.cos(m.conf.angle);
	// 	m.conf.velocity.y = m.conf.speed * Math.sin(m.conf.angle);
	// },
	addAbounchOfMissile: function (number = false) {
		if (!number) number = 10;
		for (let z = 0; z < number; z++) this.addMob();
	},
	isoutScreen: function (m) {
        if (m.conf.position.x < m.conf.radius){ m.conf.position.x = Game.worldpos.width - m.conf.radius - 1 }
        if (m.conf.position.x > Game.worldpos.width - m.conf.radius){ m.conf.position.x = m.conf.radius + 1}
        if (m.conf.position.y < m.conf.radius){ m.conf.position.y = Game.worldpos.height - m.conf.radius - 1}
        if (m.conf.position.y > Game.worldpos.height - m.conf.radius){ m.conf.position.y = m.conf.radius + 1}
    },
	checkRebond: function (m) {
		let rebond = false;
		// Rebondir sur les bords de la fenetre
		if (
			m.conf.position.x < m.conf.radius ||
			m.conf.position.x > Game.worldpos.width - m.conf.radius
		) {
			rebond = true;
			m.conf.velocity.x *= -1;
		}
		if (
			m.conf.position.y < m.conf.radius ||
			m.conf.position.y > Game.worldpos.height - m.conf.radius
		) {
			rebond = true;
			m.conf.velocity.y *= -1;
		}
		if (rebond) this.setRebondCss(m);
	},
	setRebondCss: function (m) {
		m.div.classList.add("rebond");
		setTimeout(() => {
			m.div.classList.remove("rebond");
		}, 100);
	},
	setVelocity: function (o) {
		o.conf.distanceToMouse = Math.sqrt(
			Math.pow(_mouse.mouse.x - o.conf.position.x, 2) +
			Math.pow(_mouse.mouse.y - o.conf.position.y, 2)
		);
		let speed = Math.min(Math.max(2, o.conf.distanceToMouse / 50), 6);

        o.conf.angleToMouse = Math.atan2(
            _mouse.mouse.y - o.conf.position.y,
            _mouse.mouse.x - o.conf.position.x
        );
        o.conf.velocity.x = speed * Math.cos(o.conf.angleToMouse);
        o.conf.velocity.y = speed * Math.sin(o.conf.angleToMouse);

	},
	setAria: function (m) {
		m.visualdiv.setAttribute('aria-vitesse',Math.floor(m.conf.vitesse/2))
	},
	getVitesseEtDirection: function (m) {
		let vx = m.conf.velocity.x
		let vy = m.conf.velocity.y
		m.conf.vitesse = Math.sqrt(vx * vx + vy * vy);
		m.conf.directionRad = Math.atan2(vy, vx);
	},
	animeStep: function (dt,type='missile') {
        let MISSILES = this.datas[type].objects
        for (const id in MISSILES) {
			if (Object.hasOwnProperty.call(MISSILES, id)) {
                let m = MISSILES[id]
                if (m.dead && !m.deleting){
                    m.deleting=true
                    setTimeout(() => {
						// console.log('die')
                        this.deleteObject(m)
                    }, 1000);
                }
                if(m.dead!=true){
                    // tools.rand(0,1) > .5 ? this.isoutScreen(m) : this.checkRebond(m);
                    this.checkRebond(m)
					// this.setVelocityWithMouseDatas(m)
                    //if (_mouse.active){
                        //tools.updateVelocityOnClick(oid);
                    //}
                    _blackHoles.aplliquerBlackHoles(m)
					_planet.animeStep(m)

                }
				// _mobs.checkVelocityRange(m)
                if(m.conf.success.cur < m.conf.success.need){
					this.getVitesseEtDirection(m)
					this.setAria(m)
					m.conf.position.x += m.conf.velocity.x * dt;
					m.conf.position.y += m.conf.velocity.y * dt;
					this.refreshObjectDivPos(m);
				}
				
                if(m.conf.success.cur >= m.conf.success.need && m.conf.success.done === false){
					m.conf.success.done = true 
					m.visualdiv.className= 'visual point';
				}
				
			}
		}
	},
};
