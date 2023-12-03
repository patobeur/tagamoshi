
const Game = {
    xp:new Number(0),
    stageLv:0,
    animeOn:false,
    minfast:new Number(0),
    maxfast:new Number(0),
    // lifes:{cur:new Number(3),done:false},
    isSceneEmpty:true,
    shoots:0,
    wordlDivConf: {
        tag:'div',
        attributes:{
            id:'World',
        },
        style:{
            width:(window.innerWidth-50)+'px',
            height:(window.innerHeight-50)+'px'
        }
    },
	addWorld: function () {
        this.world = tools.createDiv(this.wordlDivConf)
        document.body.prepend(this.world)
        this.worldpos = this.world.getBoundingClientRect();
	},
    refreshXpPoint: function (){
        this.xpDiv.textContent=Math.floor(this.xp);
    },
    refreshstageLvDiv: function (){
        this.stageLvDiv.textContent=this.stageLv;
    },
    extraRewards: function (m){
        console.log('extraRewards')
        _rewards.add(m)

    },
    rewards: function (type=false,value,m){
        if(type==='missile'){

            this.extraRewards(m)
            if(_mobs.datas.missile.counter<2) {
            }

            let timeNow = new Date();
            let distibuted = 0;
            let age = Math.floor(Math.abs(timeNow.getTime()-m.conf.birthDate.getTime())/100);
            let reward = setInterval(() => {
                distibuted += age/10
                this.xp += age/10
                this.refreshXpPoint();
                if (distibuted >= age){
                    clearInterval(reward);
                }
            },100);
        }
    },
	checkSuccess: function () {
		if(_planet.success.cur >= _planet.success.need && _planet.success.done === false) {
			_planet.success.done = true;
		}
		if(_planet.success.done === true && _planet.success.cur >=1){
			this.restart();
		}
	},
	animeStep: function (dt) {
        if(this.animeOn){
            this.checkSuccess()
            _mobs.animeStep(dt)
            _skills.animeStep(dt)
            _mouse.active = false;
        }
	},
    animate: function () {
        let lastTimestamp = 0;
        const animateStep = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const dt = (timestamp - lastTimestamp) / 30; //ms
            this.animeStep(dt);
            lastTimestamp = timestamp;
            requestAnimationFrame(animateStep);
        };
        requestAnimationFrame(animateStep);
    },
	// setMoveCss: function () {
	// 	document.body.classList.add("up");
	// 	setTimeout(() => {
	// 		document.body.classList.remove("up");
	// 	}, 100);
	// },
	resize() {
        this.worldpos = this.world.getBoundingClientRect();
    },
	addXpDiv: function (p) {
		this.boardDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "board",
                textContent: ''
				// innerHTML: _svg['planet'+tools.rand(1,3)].getsvg(p),
			},
			style: {
			},
		});
		this.xpDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "xp",
                textContent: '0'
				// innerHTML: _svg['planet'+tools.rand(1,3)].getsvg(p),
			},
			style: {
			},
		});
		this.stageLvDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "lv",
                textContent: '0'
				// innerHTML: _svg['planet'+tools.rand(1,3)].getsvg(p),
			},
			style: {
			},
		});
        this.boardDiv.appendChild(this.xpDiv)
        this.boardDiv.appendChild(this.stageLvDiv)
		document.body.appendChild(this.boardDiv)

	},
	leveling: function () {
        _mobs.datas.missile.maxAtTime = Math.floor(((this.stageLv+1)/10)+3)
        _planet.maxAtTime = Math.floor((this.stageLv+1)/5)+1
        _blackHoles.maxAtTime = Math.floor((this.stageLv+1)/10)+1
    },
	restart: function () {
        this.animeOn=false

        _messages.add({name:'bravo'})
        // reset all
        
        _messages.add({name:'nombreCoups'})
        this.shoots = 0
        _planet.resetAll();
        _mobs.resetAll();
        _blackHoles.resetAll();

        
        this.animeOn=false

        setTimeout(() => {
            this.isSceneEmpty=true
            this.stageLv++
            this.leveling()
            this.refreshstageLvDiv()

            this.startNewStage()
            this.animeOn=true
        }, 5000);
    },
    checkIfOneClick: function () {
        if(this.shoots===1) {
            _messages.add({name:'oneClick'})
            return true
        }
        return false
    },
	startNewStage: function () {
        let first = (this.stageLv===0) ? 5 : false;
        shoots=0;
        _blackHoles.addABounch(first)
        _planet.addABounch()
        _messages.add({name:'newmissile'})
        _messages.add({name:'newplanet'})
        _messages.add({name:'newblackHoles'})
    },
	go: function () {
        tools.addCss(_css());
        this.addWorld()
        
        this.Bases = _base()
        this.Bases.init(this.world)

		_mouse.init();
		this.animate();
        
		_planet.addVignettesDiv();
		_mobs.addCoupsDiv();

        _messages.init()
        _messages.add({name:'bonjour'})

        this.startNewStage()
        this.animeOn=true
        this.addXpDiv()   
        _skills.init()
        
	},
    // Skill value powers
    borderLimited:true,
    
    planetesActivity:false,
    planetesMass:3.989 * Math.pow(10, 3),

    blackholesActivity:true,
    blackHolesRadius:200,
    blackHolesMass:3.989 * Math.pow(10, 3),
    //
};
document.addEventListener("DOMContentLoaded", function () {
	Game.go();
});
window.addEventListener("resize", function () {
    Game.resize();
});
