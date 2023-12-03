let _mobs = {
	minfast: {x:new Number(0),y:new Number(0)},
	maxfast: {x:new Number(0),y:new Number(0)},
	datas: {
		missile: {
			id: new Number(0),
			objects: {},
			counter:new Number(0),
			maxAtTime:3,
			conf: {
				type: "missile",
				radius: 12,
				mass: 1 * Math.pow(10, 3),
				velocity: { x: 0, y: 0 },
				position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
				visual: { emoji: "🎱", radius: 30 },
				vitesse:0,
				success:{cur:new Number(0),need:new Number(1),done:false},
				autonomie:{cur:new Number(0),max:new Number(1000)},
				birthDate:new Date(),
			},
		},
		blackHole: {},
	},
	addCoupsDiv: function () {
			// this.success.need += this.conf.success.need
			this.coupsDiv = tools.createDiv({
				tag: "div",
				attributes: {
					className: "vignettecoups",
				},
				style: {
					position: "absolute",
				},
			});
			document.body.appendChild(this.coupsDiv)
	},
	addVignette: function (m) {
		m.containerDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "container",
			},
			style: {
				position: "absolute",
			},
		});
		m.timerDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "timer",
			},
			style: {
				position:'absolute',
			}
		});
		m.VignetteDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "vignette",
			}
		});
		m.clikDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "clickable",
				textContent: this.datas.missile.counter+1,
			},
			style: {
				position:'absolute',
			}
		});
		let clone = m.visualDiv.cloneNode(true)
		clone.style='';
		clone.id='mc_'+m.id;
		clone.className='vignette-item';

		m.containerDiv.appendChild(m.timerDiv)
		m.containerDiv.appendChild(clone)
		m.containerDiv.appendChild(m.clikDiv)
		
		m.VignetteDiv.appendChild(m.containerDiv)

		m.clikDiv.addEventListener("click", (event) => {
			m.VignetteDiv.classList.add('removed')
			// this.destroy(m)
			this.deleteObject(m)
		});
		this.coupsDiv.prepend(m.VignetteDiv)
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
        this.datas.missile.counter = 0
		// this.datas['missile'].objects = {}
		// this.datas['missile'].counter = new Number(0)
		// this.datas['missile'].id = new Number(0)
	},
	add: function (datas = false) {
        conf = (datas && datas.type && typeof this.datas[datas.type] != "undefined")
            ? JSON.parse(JSON.stringify(this.datas[datas.type].conf))
            : JSON.parse(JSON.stringify(this.datas["missile"].conf));
        if (datas) {
            p = datas.conf.position
			conf.position.x = p.x ? datas.conf.position.x + 0 : tools.rand(conf.radius, Game.worldpos.width - conf.radius);
			conf.position.y = p.y ? datas.conf.position.y + 0 : tools.rand(conf.radius, Game.worldpos.height - conf.radius);
		}
		let allObjects = this.datas[conf.type].objects;
		// let counter = this.datas[conf.type].counter;
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
		m.visualDiv = tools.createDiv({
			tag: "div",
			attributes: {
				id: "mv_" + id,
				className: "visual",
				// textContent: m.conf.visual.emoji,
				innerHTML: _svg.spaceship.getsvg(m),
			},
			style: {
				width: m.conf.visual.radius * 2 + "px",
				height: m.conf.visual.radius * 2 + "px",
			},
		});
		
		m.conf.birthDate=new Date();
		this.setVelocity(m);
		this.refreshObjectDivPos(m);
		m.div.appendChild(m.visualDiv);
		Game.world.appendChild(m.div);

		this.addVignette(m);
		
		_messages.add({name:'newmissile'});
		this.datas[conf.type].id++;
		this.datas[conf.type].counter++;
	},
	deleteObject: function (m) {
		m.VignetteDiv.remove()
		m.div.remove();
		delete this.datas[m.conf.type].objects[m.id];
		this.datas[m.conf.type].counter--;
	},
	destroy: function (m) {
		m.dead=true
	},
	refreshObjectDivPos: function (m) {
		let x = Math.round(m.conf.position.x-m.conf.radius); // - Game.worldpos.left)
		let y = Math.round(m.conf.position.y-m.conf.radius); // - Game.worldpos.top)
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
	// addAbounchOfMissile: function (number = false) {
	// 	if (!number) number = 10;
	// 	for (let z = 0; z < number; z++) this.addMob();
	// },
	isoutScreen: function (m) {
        if (m.conf.position.x < m.conf.radius){ m.conf.position.x = Game.worldpos.width - m.conf.radius - 1}
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
	setVelocity: function (m) {
		m.conf.distanceToMouse = Math.sqrt(
			Math.pow(_mouse.mouse.x - Game.worldpos.x - m.conf.position.x, 2) +
			Math.pow(_mouse.mouse.y - Game.worldpos.y - m.conf.position.y, 2)
		);
		let speed = Math.min(Math.max(2, m.conf.distanceToMouse / 50), 6);

        m.conf.angleToMouse = Math.atan2(
            _mouse.mouse.y - Game.worldpos.y - m.conf.position.y,
            _mouse.mouse.x - Game.worldpos.x - m.conf.position.x
        );
        m.conf.velocity.x = speed * Math.cos(m.conf.angleToMouse);
        m.conf.velocity.y = speed * Math.sin(m.conf.angleToMouse);

	},
	setAriaVitesse: function (m) {
		m.visualDiv.setAttribute('aria-vitesse',Math.floor(m.conf.vitesse/2))
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
					
					// check si recup rewards
					_rewards.animeStep(m)

                    // // tools.rand(0,1) > .5 ? this.isoutScreen(m) : this.checkRebond(m);
                    // this.checkRebond(m)
					m.timerDiv.style.height = (m.conf.autonomie.pourcent * 30)+'px'

                    _blackHoles.aplliquerBlackHoles(m)
					_planet.animeStep(m)

                    if (Game.borderLimited){
						this.checkRebond(m)
					 } else {
						this.isoutScreen(m)
					};
                }
				// _mobs.checkVelocityRange(m)
                if(m.conf.success.cur < m.conf.success.need){
					this.getVitesseEtDirection(m)
					this.setAriaVitesse(m)
					m.conf.position.x += m.conf.velocity.x * dt;
					m.conf.position.y += m.conf.velocity.y * dt;
					this.refreshObjectDivPos(m);
				}
				
                if(m.conf.success.cur >= m.conf.success.need && m.conf.success.done === false){
					m.conf.success.done = true
					m.visualDiv.className= 'visual point';
				}
				
                if(m.dead!=true && m.conf.autonomie.cur < m.conf.autonomie.max){
					m.conf.autonomie.cur++

					m.conf.autonomie.pourcent = 1 - (m.conf.autonomie.cur / m.conf.autonomie.max)

					if (m.conf.autonomie.cur >= m.conf.autonomie.max){
						m.div.classList.add('endtime')
						m.dead=true;
						this.deleteObject(m)
					}
				}
				
			}
		}
	},
};
