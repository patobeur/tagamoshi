let _blackHoles = {
	boId:new Number(0),
	bobjects: {},
    bobjectsCounter:new Number(0),
	blackHoleConf: {
		radius:100,
		mass: 3.989 * Math.pow(10, 3),
		velocity: { x: 0, y: 0 },
		position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        visual:{emoji:'🎱',radius: 30},
	},
    // BlackHoles --------------------
	addAbounch: function (number=false) {
        if(!number) number = 10
        for (let z = 0; z < number; z++) this.add();
    },
	add: function (datas=false) {
        let conf = (datas) ? datas.conf.position : false;
		this.bobjects[this.boId] = {conf: JSON.parse(JSON.stringify(this.blackHoleConf)),};

        let bo = this.bobjects[this.boId]
        bo.conf.visual.emoji = tools.randEmoji()

        bo.conf.position.x = (conf && conf.x) ? conf.x : tools.rand(this.blackHoleConf.radius ,Game.worldpos.width-this.blackHoleConf.radius)
        bo.conf.position.y = (conf && conf.y) ? conf.y : tools.rand(this.blackHoleConf.radius+(Game.worldpos.height/3) ,((Game.worldpos.height/3)*2.5) -this.blackHoleConf.radius)
        


        bo.div = tools.createDiv({tag:'div',attributes:{id:'Bh_'+this.boId,className:'blackhole'},style:{width:bo.conf.radius*2+'px',height:bo.conf.radius*2+'px'}})
        let visual = tools.createDiv({tag:'div',attributes:{id:'Vis_'+this.boId,className:'visual',
            // textContent:bo.conf.visual.emoji,
            innerHTML:_svg.magnet.getsvg(bo)
        },style:{width:bo.conf.visual.radius*2+'px',height:bo.conf.visual.radius*2+'px'}})
        bo.div.appendChild(visual)
        Game.world.appendChild(bo.div)
        this.refreshBObjectDivPos(this.boId);
        this.boId++
        this.bobjectsCounter++
    },
    refreshBObjectDivPos: function (oid) {
        let o = this.bobjects[oid];
        let x = Math.round(o.conf.position.x - o.conf.radius)// - this.worldpos.left)
        let y = Math.round(o.conf.position.y - o.conf.radius)// - this.worldpos.top)
        // let r = tools.getRotationAngle(oid)
        o.div.style.transform =`translate(${x}px, ${y}px)`;
    },
	aplliquerBlackHoles: function (m) {
        for (const boid in this.bobjects) {
            if (Object.hasOwnProperty.call(this.bobjects, boid)) {
                _newton.appliquerGravite(m, this.bobjects[boid])
            }
        }
    },
	resetAll: function () {
        let BLACKHOLES = this.bobjects
        for (const id in BLACKHOLES) {
			if (Object.hasOwnProperty.call(BLACKHOLES, id)) {
                let p = BLACKHOLES[id]
                p.div.classList.add('removed')
				setTimeout(() => {
					p.div.remove()
					console.log('reseting bo ...')
                    delete p
				}, tools.rand(1000,4000));
			}
		}
		this.bobjects = {}
		this.bobjectsCounter = new Number(0)
		// this.boId = new Number(0)
		console.log('resetAll Bo done')
	},
};
