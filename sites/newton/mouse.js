const _mouse = {
	mouse: {
		x:window.innerWidth/2,
		y:window.innerHeight/2,
		active:false,
		power:{
			level:1,//%
			height:400,//px
		},
		mire:{
			r:10,//px
		},
		distanceToBase:0,
	},
	addMouseMove() {
		document.addEventListener("mousemove", (event) => {
			// this.mouse.active = true;
			this.mouse.x = event.clientX;
			this.mouse.y = event.clientY;
			this.mireDiv.style.top = this.mouse.y - this.mouse.mire.r - Game.worldpos.y +'px'
			this.mireDiv.style.left = this.mouse.x - this.mouse.mire.r - Game.worldpos.x +'px'
			let currentbase = Game.Bases.bases[Game.Bases.id-1]
			if(currentbase){
				_mouse.refreshMouseAngleTo(currentbase)
				_mouse.refreshMouseAngleRadiansTo(currentbase)
				_mouse.refreshMouseDistanceTo(currentbase)
				Game.Bases.onMouseMoove();
			}
		});
	},
	addMouseClick() {
		document.addEventListener("click", (event) => {
			// this.mouse.active = true;
			this.mouse.x = event.clientX;
			this.mouse.y = event.clientY;
			// let currentbase = Game.Bases.bases[Game.Bases.id-1]
			// if(currentbase){
			// 	_mouse.refreshMouseDistanceTo(currentbase)
			// 	_mouse.refreshMouseAngleTo(currentbase)
			// 	_mouse.refreshMouseAngleRadiansTo(currentbase)
			// 	Game.Bases.onMouseMoove();
			// }
			if(event.target.className!='clickable') {
				Game.Bases.onMouseclick(event);
			}
		});
	},
	addMouseRightClick() {
		document.addEventListener("contextmenu", (event) => {
			this.mouse.x = event.clientX;
			this.mouse.y = event.clientY;
			if(event.target.className!='clickable') {
				this.mouse.active = true;
				event.preventDefault();
				return false;
			}
		});
	},
	refreshPowerDiv: function () {
		// this.mouse.power.level = this.distanceToBase/window.innerHeight
		this.mouse.power.level = this.distanceToBase/Game.worldpos.height
		this.power.style.height = (this.mouse.power.level*this.mouse.power.height)+'px'
		this.power.style.filter = `hue-rotate(${this.mouse.power.level*270}deg)`
	},
	refreshMouseAngleRadiansTo: function (o) {
		let angleRadians = ( o.conf.angleToMouse ) * (Math.PI/ 180)
		o.conf.angleRadiansToMouse = angleRadians
		if(this.angleRadiansDiv) this.angleRadiansDiv.textContent = Math.floor(angleRadians) + "r";
	},
	refreshMouseAngleTo: function (o) {
		let angle = tools.getAngleToMouseDegrees(o)
		o.conf.angleToMouse = angle
		if(this.anglediv) this.anglediv.textContent = Math.floor(angle) + "°";
	},
    refreshMouseDistanceTo: function (currentbase) {
		let cBase = currentbase
		this.distanceToBase = Math.floor(tools.calculateDistance(
			cBase.conf.position.x,
			cBase.conf.position.y,
			this.mouse.x - Game.worldpos.x,
			this.mouse.y - Game.worldpos.y,
		));
		// console.log('--------------------')
		// console.log('this.mouse.x-Game.worldpos.x',this.mouse.x-Game.worldpos.x)
		// console.log('cBase.conf.position.x',cBase.conf.position.x)
		// console.log('Game.worldpos.x',Game.worldpos.x)
		cBase.conf.distanceToMouse = this.distanceToBase

		if(this.distanceToBaseDiv) this.distanceToBaseDiv.textContent = this.distanceToBase + "px";
		if(this.refreshPowerDiv) this.refreshPowerDiv()
	},
	displayPowerDiv: function () {
		this.power = tools.createDiv({
			tag: "div",
			attributes: {
				id: "power",
				className: "power",
			},
			style:{
				height:this.mouse.power.height+'px'
			},
		});
		this.powerBull = tools.createDiv({
			tag: "div",
			attributes: {
				className: "bull",
			},
			style:{
			},
		});
		this.power.appendChild(this.powerBull);
		document.body.appendChild(this.power);
	},
	displayDistanceDiv: function () {
		this.distanceToBaseDiv = tools.createDiv({
			tag: "div",
			attributes: {
				id: "dte",
				className: "dte",
				textContent: "00000px",
			},
		});
		document.body.appendChild(this.distanceToBaseDiv);
	},
	displayMire: function () {
		this.mireDiv = tools.createDiv({
			tag: "div",
			attributes: {
				className: "mire",
			},
			style:{
				width:this.mouse.mire.r*2+'px',
				height:this.mouse.mire.r*2+'px'
			},
		});
		Game.world.appendChild(this.mireDiv);
	},
	displayAngleDiv: function () {
		this.anglediv = tools.createDiv({
			tag: "div",
			attributes: {
				id: "angle",
				className: "angle",
				textContent: "00",
			},
		});
		document.body.appendChild(this.anglediv);
	},
	displayAngleRadiansDiv: function () {
		this.angleRadiansDiv = tools.createDiv({
			tag: "div",
			attributes: {
				id: "angleradians",
				className: "angleradians",
				textContent: "00",
			},
		});
		document.body.appendChild(this.angleRadiansDiv);
	},
	addTouchMove() {
	  document.addEventListener("touchmove", (event) => {
		event.preventDefault(); // Empêche le défilement par défaut sur les écrans tactiles
		const touch = event.touches[0];
		this.mouse.x = touch.clientX;
		this.mouse.y = touch.clientY;
		this.mireDiv.style.top = this.mouse.y - this.mouse.mire.r - Game.worldpos.y + 'px';
		this.mireDiv.style.left = this.mouse.x - this.mouse.mire.r - Game.worldpos.x + 'px';
		let currentbase = Game.Bases.bases[Game.Bases.id - 1];
		if (currentbase) {
		  _mouse.refreshMouseAngleTo(currentbase);
		  _mouse.refreshMouseAngleRadiansTo(currentbase);
		  _mouse.refreshMouseDistanceTo(currentbase);
		  Game.Bases.onMouseMoove();
		}
	  });
	},
  
	// addTouchStart() {
	// 	document.addEventListener("touchstart", (event) => {
	// 	  const touch = event.touches[0];
	// 	  this.mouse.x = touch.clientX;
	// 	  this.mouse.y = touch.clientY;
	// 	  let currentbase = Game.Bases.bases[Game.Bases.id - 1];
	// 	  if (currentbase) {
	// 		_mouse.refreshMouseAngleTo(currentbase);
	// 		_mouse.refreshMouseAngleRadiansTo(currentbase);
	// 		_mouse.refreshMouseDistanceTo(currentbase);
	// 		Game.Bases.onMouseMoove();
	// 	  }
	// 	  Game.Bases.onMouseclick(event);
	// 	});
	//   },
	  addTouchEnd() {
		document.addEventListener("touchend", (event) => {
		  const touch = event.changedTouches[0];
		  this.mouse.x = touch.clientX;
		  this.mouse.y = touch.clientY;
		  let currentbase = Game.Bases.bases[Game.Bases.id - 1];
		  if (currentbase) {
			_mouse.refreshMouseAngleTo(currentbase);
			_mouse.refreshMouseAngleRadiansTo(currentbase);
			_mouse.refreshMouseDistanceTo(currentbase);
			Game.Bases.onMouseMoove();
		  }
		  Game.Bases.onMouseclick(event);
		});
	  },
	  addClickEvent() {
		if ('ontouchstart' in window || navigator.maxTouchPoints) {
		  // Si l'appareil prend en charge les événements tactiles
			this.addTouchMove()
			this.addTouchEnd()
		} else {
		  // Sinon, ajoutez l'événement de clic de souris
			this.addMouseClick();
		}
	  },

	init: function () {
		this.addMouseRightClick();
		this.addClickEvent()
		this.displayPowerDiv()
		this.displayMire()
		this.addMouseMove();
		this.displayAngleRadiansDiv()
		this.displayAngleDiv()
		this.displayDistanceDiv()
	},
};
