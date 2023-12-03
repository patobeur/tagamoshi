let _planet = {
	id: new Number(0),
	objects: {},
	counter: new Number(0),
	maxAtTime:1,
	success:{
		cur:new Number(0),
		need:new Number(0),
		done:false
	},
	stageDone:false,
	conf: {
		radius: Game.planetesRadius,
		mass: Game.planetesMass,
		velocity: { x: 0, y: 0 },
		position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
		visual: { emoji: "🎅🏿", radius: 30 },//⛄
		success:{cur:new Number(0),need:new Number(1),done:false},
	},
	// Planets --------------------
	addABounch: function (number = false) {
		if (!number) number = this.maxAtTime;
		for (let z = 0; z < number; z++) this.add();
	},
	add: function (datas = false) {
		// let conf = datas ? datas.conf.position : false;
		this.objects[this.id] = { conf: JSON.parse(JSON.stringify(this.conf)) };
		let p = this.objects[this.id];
		
		p.conf.position.x = tools.rand(this.conf.radius+100, Game.worldpos.width - this.conf.radius -50);
		p.conf.position.y = tools.rand(this.conf.radius+25, (Game.worldpos.height/3) - this.conf.radius);

		p.div = tools.createDiv({
			tag: "div",
			attributes: { id: "p_" + this.id, className: "planet" },
			style: {
				position: "absolute",
				transform: `translate(${p.conf.position.x - this.conf.radius}px, ${p.conf.position.y - this.conf.radius}px)`,
				width: p.conf.radius * 2 + "px",
				height: p.conf.radius * 2 + "px",
			},
		});
		p.visualDiv = tools.createDiv({
			tag: "div",
			attributes: {
				id: "Vis_" + this.id,
				className: "visual",
				innerHTML: _svg['planet'+tools.rand(1,3)].getsvg(p),
			},
			style: {
				width: p.conf.visual.radius * 2 + "px",
				height: p.conf.visual.radius * 2 + "px",
			},
		});
		p.id = this.id;
		p.div.appendChild(p.visualDiv);
		Game.world.appendChild(p.div);
		this.success.need += this.conf.success.need
		console.log(this.success,'+=',this.conf.success.need)
		this.id++;
		this.counter++;
		this.addNeedDiv(p)
	},
	addVignettesDiv: function () {
		// this.success.need += this.conf.success.need
		this.vignettesDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "needs",
			},
			style: {
				position: "absolute",
			},
		});
		document.body.appendChild(this.vignettesDiv)
	},
	addNeedDiv: function (p) {
		p.needDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "need",
			},
			style: {
			},
		});
		let clone = p.visualDiv.cloneNode(true)
		clone.style='';
		clone.id='n_'+p.id
		clone.className='need-item'
		p.needDiv.appendChild(clone)
		this.vignettesDiv.appendChild(p.needDiv)

	},
	resetAll: function () {
        

        let PLANETS = this.objects
        for (const id in PLANETS) {
			if (Object.hasOwnProperty.call(PLANETS, id)) {
                let p = PLANETS[id]
				setTimeout(() => {
					p.div.remove()
				}, tools.rand(1000,2000));
			}
		}
		this.objects = {}
		this.counter = new Number(0)
		this.success={cur:new Number(0),need:new Number(0),done:false}
		this.stageDone=false
	},
	addSuccess: function (m,p) {
		m.div.classList.add('success');
		p.div.classList.add('done');
		p.needDiv.classList.add('success');
		m.conf.success.cur++;
		p.conf.success.cur++;
		this.success.cur++;
		// m.div.remove();

        _messages.add({name:'getplanete'})
		Game.rewards('missile',100,m);//Math.floor(100/_mobs.datas.missile.counter));

		if (p.conf.success.cur>=p.conf.success.need) {
			setTimeout(() => {
				p.div.classList.remove('done');
				p.div.classList.remove('success');
				p.div.classList.add('removed');
				// p.needDiv.classList.add('removed');
				this.counter--;
				setTimeout(() => {
					p.needDiv.remove();
				}, 2000);
				// p.div.remove();
				// delete p;
				return
			}, 2000);
			return;
		}
		_mobs.deleteObject(m)
	},
	aplliquerGravity: function (m) {
		for (const id in this.bobjects) {
			if (Object.hasOwnProperty.call(this.objects, id)) {
				_newton.appliquerGravite(m, this.objects[id]);
			}
		}
	},
	animeStep: function (m) {
		// let empty = true;
        let PLANETS = this.objects
        for (const id in PLANETS) {
			if (Object.hasOwnProperty.call(PLANETS, id)) {
                let p = PLANETS[id]
				if(p.conf.done!=true){

					if (Game.planetesActivity) _newton.appliquerGravite(m, p);

					let distance = tools.calculateDistance(
						m.conf.position.x,// + Game.worldpos.left,
						m.conf.position.y,// + Game.worldpos.height,
						p.conf.position.x,
						p.conf.position.y,
					)
					if (distance<15) {
						p.conf.done = true
						this.addSuccess(m,p)
						Game.checkIfOneClick()
						p.div.style.filter = `hue-rotate(180deg)`;
					}
					// if (distance<30) {
					// 	console.log('------------------------')
					// 	this.addChild(m)
					// }
					empty = false
				}
			}
		}
	},
};
