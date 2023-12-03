let _messages = {
	id: new Number(0),
	objects: {},
	counter: new Number(0),
	conf: {
		position: { x: window.innerWidth / 2, y: 200 },
	},
	init:function(){
		this.messDiv = tools.createDiv({
			tag: "div",
			attributes: {
				id: "messages",
				className: "messages"
			},
			style: {
				position: "absolute",
			},
		});
		this.messInDiv = tools.createDiv({
			tag: "div",
			attributes: {
				id: "messagesin",
				className: "messagesin"
			},
			style: {
				position: "absolute",
			},
		});
		this.messDiv.appendChild(this.messInDiv);
		document.body.appendChild(this.messDiv);
	},
	getMessage: (name) => {
		let fuseesrestantes = _mobs.datas.missile.maxAtTime-_mobs.datas.missile.counter - 1
		let pluriel = (fuseesrestantes>0) ? 's' :''
		let messages = {
			newmissile:{ emoji: "🕯️", ele:{textContent:(_mobs.datas.missile.maxAtTime+1)+' fusées disponibles.'} },
			newplanet:{ emoji: "🕯️", ele:{textContent:_planet.maxAtTime+' planètes à sauver.'} },
			newblackHoles:{ emoji: "🕯️", ele:{textContent:_blackHoles.maxAtTime+' trous noirs à proximité..'} },
			extraRewards:{ emoji: "🕯️", ele:{color:'yellow',fontsize:'1.2rem',textContent:'Extra Cadeau !! ....'} },
			oneClick:{ emoji: "🕯️", ele:{color:'yellow',fontsize:'1.2rem',textContent:`D'un coup  !!`} },
			getbonus:{ emoji: "🕯️", ele:{color:'yellow',fontsize:'1.2rem',textContent:'You get a bonus !!'} },
			getplanete:{ emoji: "🕯️", ele:{color:'yellow',fontsize:'1.2rem',textContent:'You saved us !! ...............'} },
			nombreCoups:{ emoji: "🕯️", ele:{color:'green',fontsize:'1.1rem',textContent:'en '+Game.shoots + ' coup'+(Game.shoots>1?'s':'')+'...'} },

			default:{ emoji: "🕯️", ele:{textContent:'Go !'} },
			newstage:{ emoji: "🕯️", ele:{color:'orange',fontsize:'1.5rem',textContent:'Stage '+Game.stageLv} },
			
			newskill:{ emoji: "🕯️", ele:{color:'red',fontsize:'1.5rem',textContent:'new skill'} },


			newmissile:{ emoji: "🕯️", ele:{textContent:'Fusée'+pluriel+' restante'+pluriel+': '+fuseesrestantes+'...'} },
			bonjour:{ emoji: "🕯️", ele:{textContent:'bonjour !'} },
			bravo:{ emoji: "🕯️", ele:{color:'yellow',fontsize:'1.5rem',textContent:'bravo !'} },
			test:false,
		};
		let message = (typeof messages[name] != 'undefined' && messages[name]) ? messages[name] : messages['default']
		return message;
	},
	// animeStep(mess) {
	// 	for (const id in this.objects) {
	// 		if (Object.hasOwnProperty.call(this.objects, id)) {
	// 			let r = this.objects[id];
	// 			if (!mess.conf.collected && this.checkCollide(m, r)) {
	// 				mess.conf.collected = true;
	// 				mess.div.classList.add("collected");
	// 				console.log("collide");
	// 				setTimeout(() => {
	// 					mess.div.remove();
	// 					delete r;
	// 				}, 1000);
	// 				delete this.objects[id];
	// 				this.counter--;
	// 			}
	// 		}
	// 	}
	// },
	add(datas) {
		if(this.counter>4){
			// delette first message
		}
		let name = datas.name
		this.objects[this.id] = { conf: JSON.parse(JSON.stringify(this.conf)) };


		let mess = this.objects[this.id];
		mess.id = this.id;
		mess.message = JSON.parse(JSON.stringify(this.getMessage(name)));

		mess.div = tools.createDiv({
			tag: "div",
			attributes: {
				id: "info_" + this.id,
				className: "popinfo",
				textContent: mess.message.ele.textContent,
			},
			style:{
				fontsize: mess.message.ele.fontsize ? mess.message.ele.fontsize : false,
				color: mess.message.ele.color ? mess.message.ele.color : false

			}
		});
		this.messInDiv.appendChild(mess.div);

		this.objects[this.id] = mess;
		this.id++;
		this.counter++;
		mess.div.classList.add('up')
		setTimeout(() => {
			mess.div.classList.remove('up')
			setTimeout(() => {
				mess.div.classList.add('end')
				setTimeout(() => {
					mess.div.remove()
					delete this.objects[mess.id]
					this.counter--;
				}, 3000);
			}, 4000);
		}, 1000);
		// this.addNeedDiv(p)
	},
};
