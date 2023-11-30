let _planet = {
	id: new Number(0),
	objects: {},
	counter: new Number(0),
	success:{
		cur:new Number(0),
		need:new Number(0),
		done:false
	},
	stageDone:false,
	conf: {
		radius: 10,
		mass: 3.989 * Math.pow(10, 3),
		velocity: { x: 0, y: 0 },
		position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
		visual: { emoji: "🎱", radius: 30 },
		success:{cur:new Number(0),need:new Number(1),done:false},
	},
	// BlackHoles --------------------
	addABounch: function (number = false) {
		if (!number) number = 1;
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
				transform: `translate(${p.conf.position.x}px, ${p.conf.position.y}px)`,
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
		// this.refreshDivPos(p);


		this.success.need += this.conf.success.need
		console.log(this.success,'+=',this.conf.success.need)
		this.id++;
		this.counter++;
		this.addNeedDiv(p)
	},
	addNeedsDiv: function () {
		// this.success.need += this.conf.success.need
		this.needsDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "needs",
			},
			style: {
				position: "absolute",
			},
		});
		// let titre = tools.createDiv({
		// 	tag: "div",
		// 	attributes: {
		// 		className: "need",
		// 		textContent: "Need",
		// 		// innerHTML: _svg['planet'+tools.rand(1,3)].getsvg(p),
		// 	},
		// 	style: {
		// 	},
		// });
		// this.needsDiv.appendChild(titre)
		document.body.appendChild(this.needsDiv)
	},
	addNeedDiv: function (p) {
		p.needDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "need",
				// innerHTML: _svg['planet'+tools.rand(1,3)].getsvg(p),
			},
			style: {
			},
		});
		let clone = p.visualDiv.cloneNode(true)
		clone.style='';
		clone.id='n_'+p.id
		clone.className='need-item'
		p.needDiv.appendChild(clone)
		this.needsDiv.appendChild(p.needDiv)

	},
	resetAll: function () {
        let PLANETS = this.objects
        for (const id in PLANETS) {
			if (Object.hasOwnProperty.call(PLANETS, id)) {
                let p = PLANETS[id]
				setTimeout(() => {
					p.div.remove()
					console.log('removing planete...')
				}, tools.rand(1000,2000));
			}
		}
		this.objects = {}
		this.counter = new Number(0)
		this.success={cur:new Number(0),need:new Number(0),done:false}
		this.stageDone=false
		console.log('resetAll PLANETS sent')
	},
	// checkSuccess: function () {
	// 	if(this.success.cur >= this.success.need && this.success.done === false) {
	// 		this.success.done = true;
	// 	}

	// 	if(this.success.done === true && this.success.cur >=1){
	// 		console.log('success done')
	// 		console.log('success done')
	// 		console.log('success done')
	// 		this.stageDone=true
	// 		this.success.cur = 0
	// 		// reset all planetes 
	// 		this.resetAll();

	// 		// reset all missile
	// 		_blackHoles.resetAll();

	// 		// reset all blackHoles
	// 		Game._Mobs.resetAll();
	// 		Game.restart();

	// 		// add button restart

	// 		// add a bunch of planete
	// 		// and black holes 
	// 	}
	// },
	addSuccess: function (m,p) {
		p.div.classList.add('done');
		m.div.classList.add('success');
		p.needDiv.classList.add('success');
		m.conf.success.cur++;
		p.conf.success.cur++;
		this.success.cur++;
		console.log(this.success.cur+'/'+this.success.need);
		// m.div.remove();
		Game.refreshPoint(100);
		if (p.conf.success.cur>=p.conf.success.need) {
			this.counter--;
			setTimeout(() => {
				p.div.classList.remove('done');
				p.div.classList.remove('success');
				p.div.classList.add('removed');
				// p.needDiv.classList.add('removed');
				m.div.classList.add('removed');
				setTimeout(() => {
					p.needDiv.remove();
				}, 2000);
				// p.div.remove();
				// delete p;
				return
			}, 2000);
			return;
		}
	},
	refreshDivPos: function (p) {
		let x = Math.floor(p.conf.position.x); // - Game.worldpos.left)
		let y = Math.floor(p.conf.position.y); // - Game.worldpos.top)
		// m.div.style.transform = `translate(${x}px, ${y}px)`;
		p.div.style.transform = `translate(${x}px, ${y}px)`;

	},
	// addChild: function (parent) {
	// 	let c = tools.createDiv({
	// 		tag: "div",
	// 		attributes: {
	// 			className: "child"
	// 		},
	// 		style: {
	// 			position: "absolute",
	// 			// top: parent.conf.position.y+'px',
	// 			// left: parent.conf.position.x+'px',
	// 			transform: `translate(`+
	// 				`${parent.conf.position.x + parent.conf.radius - 3 }px,`+
	// 				`${parent.conf.position.y + parent.conf.radius - 3 }px)`,
	// 			backgroundColor: 'white',
	// 			width: 6 + "px",
	// 			height: 6 + "px",
	// 			zIndex:10000,
	// 		},
	// 	});
	// 	Game.world.appendChild(c);
	// },
	animeStep: function (m) {
		// let empty = true;
        let PLANETS = this.objects
        for (const id in PLANETS) {
			if (Object.hasOwnProperty.call(PLANETS, id)) {
                let p = PLANETS[id]
				if(p.conf.done!=true){
					let distance = tools.calculateDistance(
						m.conf.position.x,// + Game.worldpos.left,
						m.conf.position.y,// + Game.worldpos.height,
						p.conf.position.x,
						p.conf.position.y,
					)
					if (distance<15) {
						p.conf.done = true
						// console.log('ooo DONE oooooooooo')
						// this.addChild(m)
						this.addSuccess(m,p)
						p.div.style.filter = `hue-rotate(180deg)`;
					}
					// if (distance<50) {
					// 	console.log('------------------------')
					// 	this.addChild(m)
					// }
					// empty = false
				}
			}
		}
	},
};
