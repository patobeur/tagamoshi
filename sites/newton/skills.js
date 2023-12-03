let _skills = {
	id: new Number(0),
	objects: {},
	counter: new Number(0),
	skillsNames: ['antigravity','whormhole','autonomia','doubleship'],
	skills: {
		antigravity: {
			autonomie: { cur: new Number(0),max: new Number(3000) },
			birthDate: new Date(),
			done: false,
			active: false,
			comment:'Rescue Ships are not affected by gravity !',
			counter:0,
			start:function() {Game.blackholesActivity=false},
			end:function() {Game.blackholesActivity=true},
		},
		whormhole: {
			autonomie: { cur: new Number(0),max: new Number(300) },
			birthDate: new Date(),
			done: false,
			active: false,
			comment:'No idea ! Extraterrestrial stuff !',
			counter:0,
			start:function() {Game.borderLimited=false},
			end:function() {Game.borderLimited=true},
		},
		autonomia: {
			autonomie: { cur: new Number(0),max: new Number(3000) },
			birthDate: new Date(),
			done: false,
			active: false,
			comment:'Double your Rescue Ship Autonomia !',
			counter:0,
			start:function() {_mobs.datas.missile.conf.autonomie.max=6000},
			end:function() {_mobs.datas.missile.conf.autonomie.max=1000},
		},
		doubleship: {
			autonomie: { cur: new Number(0),max: new Number(3000) },
			birthDate: new Date(),
			done: false,
			active: false,
			comment:'Double your Rescue Ship number !',
			counter:0,
			start:function() {_mobs.datas.missile.maxAtTimeOld = _mobs.datas.missile.maxAtTime; _mobs.datas.missile.maxAtTime *= 2 },
			end:function() {_mobs.datas.missile.maxAtTime = _mobs.datas.missile.maxAtTimeOld},
		},
	},
	init() {
		// console.log('datas')
		this.addSkillsDiv()
		this.addAllSkills()
	},
	// --------------------------------------
	addSkillsDiv() {
		this.skillsDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "vignettesskills",
			},
			style: {
				position: "absolute",
			},
		});
		document.body.appendChild(this.skillsDiv)
	},
	addAllSkills() {
		let skills = this.skills;
		for (const name in skills) {
			if (Object.hasOwnProperty.call(skills, name)) {
				const skillConf = skills[name];
				this.addSkillDiv(skillConf,name)
				// add listener click on vignette clickable
			}
		}
	},
	addSkillDiv(skill,name) {
		skill.div = tools.createDiv({
			tag: "div",
			attributes: {
				className: "vignette",
				innerHTML: _svg[name].getsvg(),
				title:skill.comment
			},
			style: {
				// position: "absolute",
			},
		});
		this.skillsDiv.appendChild(skill.div)
	},
	// --------------------------------------
	animeStep() {
		// for (const id in this.objects) {
		// 	if (Object.hasOwnProperty.call(this.objects, id)) {
		// 		let r = this.objects[id];
		// 		if (!r.conf.collected && this.checkCollide(m, r)) {
		// 			r.conf.collected = true;
		// 			r.div.classList.add("collected");
		// 			console.log("collide");
		// 			setTimeout(() => {
		// 				r.div.remove();
		// 				delete r;
		// 			}, 1000);
		// 			delete this.objects[id];
		// 			this.counter--;
		// 		}
		// 	}
		// }
		for (const name in this.skills) {
			if (Object.hasOwnProperty.call(this.skills, name)) {
				let skill = this.skills[name];
				if(skill.autonomie.cur>0){
					if(skill.autonomie.cur===1)_messages.add('startskill')
					skill.autonomie.cur++;

					// update div height
					
					if(skill.autonomie.cur>=skill.autonomie.max) this.endskilltimer(skill)					
				}
			}
		}
	},
	endskilltimer(skill){
		skill.autonomie.cur=0
		_messages.add('endskill')
		skill.div.classList.remove('running')
		skill.end()
		if(skill.counter<1) {
			skill.div.removeEventListener("click", this.clickSkill, true);
		}
		else {
			skill.div.classList.add('up')
		}
	},
	activateSkill(skillName) {
		let skill = this.skills[skillName];
		// console.log(skill)
		skill.div.classList.add('up')
		skill.counter++
		skill.div.addEventListener("click", (event) => {
			this.clickSkill(skill)
		});


		// r.autonomie.cur=0
	},
	clickSkill(skill){
		if(skill.autonomie.cur>0){
			skill.div.classList.remove('running')
			// console.log('stop skill ?')
			this.endskilltimer(skill)
		}
		else {
			skill.div.classList.remove('up')
			skill.div.classList.add('running')
			skill.counter--
			console.log('skill',skill)
			skill.autonomie.cur = 1
			skill.start()
		}
	},
	add(r) {
		// console.log(r)
		// console.log(r.conf.rewardtype)
		
		let rand = tools.rand(0,this.skillsNames.length-1)
		let skillName = this.skillsNames[rand]
		this.activateSkill(skillName)

		console.log('addSkilltoInventory')
        _messages.add({name:'newskill'})


		// addSkilltoInventory

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
