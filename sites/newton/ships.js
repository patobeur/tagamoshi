let _ships = {
	id: 0,
	objects: {},
    counter:0,
	config: {
		radius: 12,
		mass: 1 * Math.pow(10, 3),
		velocity: { x: 0, y: 0 },
		position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        visual:{emoji:'🎱',radius: 30},
	},
    deleteObject: function (m) {
        m.div.remove()
        delete m
        this.counter--
	},
	addAbounchOfMobileObjects: function (number=false) {
        if(!number) number = 10
        for (let z = 0; z < number; z++) this.addMobileObjects();
    },
	addMobileObjects: function (datas=false) {
        let conf = (datas) ? datas.conf.position : false;
		this.objects[this.id] = {conf: JSON.parse(JSON.stringify(this.config)),};

        let o = this.objects[this.id]
        o.id = this.id
        o.conf.visual.emoji = tools.randEmoji()
        o.conf.position.x = (conf && conf.x) ? conf.x+0 : tools.rand(this.config.radius ,Game.worldpos.width-this.config.radius)
        o.conf.position.y = (conf && conf.y) ? conf.y+0 : tools.rand(this.config.radius ,Game.worldpos.height-this.config.radius)

        o.div = tools.createDiv({
            tag:'div',
            attributes:{id:'Obj_'+this.id,
            className:'missile'},style:{width:o.conf.radius*2+'px',height:o.conf.radius*2+'px'}
        })

        o.visualdiv = tools.createDiv({
            tag:'div',
            attributes:{id:'Vis_'+this.id,className:'visual',
            // textContent:o.conf.visual.emoji,
            innerHTML:_svg.spaceship.getsvg(o)
            },
            style:{
                width:o.conf.visual.radius*2+'px',
                height:o.conf.visual.radius*2+'px'
        }})
        tools.setVelocityWithRandomAngle(o)

        o.div.appendChild(o.visualdiv)
        Game.world.appendChild(o.div)

        // console.log('o',o)
        this.id++
        this.counter++
	},
	animeStep: function (dt) {
        for (const oid in this.objects) {
			if (Object.hasOwnProperty.call(this.objects, oid)) {
                let o = this.objects[oid]
                if (o.dead && !o.deleting){
                    o.deleting=true
                    setTimeout(() => {
                        this.deleteObject(o)
                    }, 1000);
                }
                if(o.dead!=true){
                    tools.rand(0,1) > .5 ? Game._Mobs.isoutScreen(o) : Game._Mobs.checkRebond(o);
                    
                    if (_mouse.active){
                        tools.updateVelocityOnClick(oid);
                    }    
                    for (const boid in Game.bobjects) {
                        if (Object.hasOwnProperty.call(Game.bobjects, boid)) {
                            _newton.appliquerGravite(o, Game.bobjects[boid])
                        }
                    }
                }
				_mobs.checkVelocityLimite(o)
                    o.conf.position.x += o.conf.velocity.x * dt;
                    o.conf.position.y += o.conf.velocity.y * dt;
                    Game._Mobs.refreshObjectDivPos(o);
			}
		}
	},
};
