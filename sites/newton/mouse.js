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
		}
	},
	addMouseMove() {
		document.addEventListener("mousemove", (event) => {
			// this.mouse.active = true;
			this.mouse.x = event.clientX;
			this.mouse.y = event.clientY;
			this.mireDiv.style.top = this.mouse.y - this.mouse.mire.r - Game.worldpos.top +'px'
			this.mireDiv.style.left = this.mouse.x - this.mouse.mire.r - Game.worldpos.left +'px'
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
			let currentbase = Game.Bases.bases[Game.Bases.id-1]
			if(currentbase){
				_mouse.refreshMouseAngleTo(currentbase)
				_mouse.refreshMouseAngleRadiansTo(currentbase)
				_mouse.refreshMouseDistanceTo(currentbase)
				Game.Bases.onMouseMoove();
			}
			Game.Bases.onMouseclick(event);
		});
	},
	addMouseRightClick() {
		document.addEventListener("contextmenu", (event) => {
			this.mouse.x = event.clientX;
			this.mouse.y = event.clientY;
			this.mouse.active = true;
			event.preventDefault();
			return false;
		});
	},
	refreshPowerDiv: function (distance) {
		this.mouse.power.level = distance/window.innerHeight
		this.power.style.height = (this.mouse.power.level*this.mouse.power.height)+'px'
		this.power.style.filter = `hue-rotate(${this.mouse.power.level*270}deg)`
	},
	refreshMouseAngleRadiansTo: function (o) {
		let angleRadians = ( o.conf.angleToMouse ) * (Math.PI/ 180)
		o.conf.angleRadiansToMouse = angleRadians
		if(this.angleRadiansDiv) this.angleRadiansDiv.textContent = Math.floor(angleRadians) + "r";
	},
	refreshMouseAngleTo: function (o) {
		let modif = 90
		let angle = tools.getAngleToMouseDegrees(o) + modif
		o.conf.angleToMouse = angle
		if(this.anglediv) this.anglediv.textContent = Math.floor(angle) + "°";
	},
    refreshMouseDistanceTo: function (currentbase) {
		let o = currentbase
		const distance = Math.floor(tools.calculateDistance(
			o.conf.position.x,
			o.conf.position.y,
			this.mouse.x,
			this.mouse.y
		));
		o.conf.distanceToMouse = distance
		if(this.distanceToBaseDiv) this.distanceToBaseDiv.textContent = distance + "px";
		if(this.refreshPowerDiv) this.refreshPowerDiv(distance)
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
		this.mireDiv.style.top = this.mouse.y - this.mouse.mire.r - Game.worldpos.top + 'px';
		this.mireDiv.style.left = this.mouse.x - this.mouse.mire.r - Game.worldpos.left + 'px';
		let currentbase = Game.Bases.bases[Game.Bases.id - 1];
		if (currentbase) {
		  _mouse.refreshMouseAngleTo(currentbase);
		  _mouse.refreshMouseAngleRadiansTo(currentbase);
		  _mouse.refreshMouseDistanceTo(currentbase);
		  Game.Bases.onMouseMoove();
		}
	  });
	},
  
	addTouchStart() {
		document.addEventListener("touchstart", (event) => {
		  const touch = event.touches[0];
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

	init: function () {
		this.displayPowerDiv()
		this.displayMire()
		this.addTouchMove()
		this.addTouchEnd()
		// this.displayAngleRadiansDiv()
		// this.displayAngleDiv()
		// this.displayDistanceDiv()
	},
};
