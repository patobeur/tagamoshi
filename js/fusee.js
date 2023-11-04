"use strict";
const _F = {
	originaleId: "fusee",
	stats: {
		kloneId: "patate",
		rect: null,
		destination: {
			x: 1,
			y: 1,
		},
		dir: -90,
        speed:1
	},
	updateInterval: 100,
	init: null,
	count: 0,
	start: function () {
		let originaleId;
		let original = document.getElementById(this.originaleId);
		this.stats.rect = original.getBoundingClientRect();
		this.stats.dir = this.get_DegreeWithTwoPos(
			this.stats.rect.x - this.stats.rect.width / 2,
			this.stats.rect.y - this.stats.rect.height / 2,
			this.stats.destination.x,
			this.stats.destination.y
		);
		original.style.width = this.stats.rect.width + "px";
		original.style.height = this.stats.rect.height + "px";
		this.klone = original.cloneNode(true);

		this.klone.id = this.stats.kloneId;
		this.klone.style.transform = `rotate(${this.stats.dir}deg)`;
		this.addCss();
		document.body.appendChild(this.klone);

		console.log(this.stats);
		console.log(this.klone);
		this.initiate();
	},
	get_DegreeWithTwoPos: function (fromX, fromY, destX, destY) {
		console.log(fromX, ",", fromY, ",", destX, ",", destY);
		var nextY = fromY - destY;
		var nextX = fromX - destX;
		var theta = Math.atan2(nextX, nextY); // 0° = east
		// theta = (theta * 180); // radians to degrees
		theta = (theta * 180) / Math.PI - 90; // radians to degrees
		// if (theta < 0) {
		// 	theta += 360; // negative case
		// }
		return theta;
	},
	getDistanceXY: function (from, destination) {
		let AB = destination.position.x - from.position.x;
		let AC = destination.position.y - from.position.y;
		let distance = Math.sqrt(AB * AB + AC * AC);
		return distance;
	},
	animate: function () {
		console.log("----------------");
		this.count++;

		this.setFuturPos();

		if (this.count >= 50) {
			clearInterval(this.init);
		}
	},
	initiate: function () {
		// _O.mobFunctions.setFuturPosAndRoom(this);
		// _O.frontFunctions.updateMobDivElementPos(this);
		this.init = setInterval(() => {
			this.animate();
		}, this.updateInterval);

		// this.clearInterval()
	},
	setFuturPos: function () {
		let x = this.stats.rect.x - this.stats.rect.width / 2;
		let y = this.stats.rect.y - this.stats.rect.height / 2;
		let next = {
			x: x - Math.sin(this.stats.dir) * this.stats.speed,
			y: y + Math.cos(this.stats.dir) * this.stats.speed,
		};
		console.log(next);
        this.klone.style.top = x+'px'
        this.klone.style.left = y+'px'
	},
	addCss: function () {
		let style = document.createElement("style");
		style.textContent = _F.cssString();
		style.id = "css";
		document.getElementsByTagName("head")[0].appendChild(style);
	},
	cssString: function () {
		let stringcss =
		`*, ::before, ::after {margin:0;padding:0;box-sizing:border-box;}` +
			`#${this.stats.kloneId}{` +
			`position:absolute;` +
			`top:${this.stats.rect.y}px;` +
			`left:${this.stats.rect.x}px;` +
			`width:${this.stats.rect.width}px;` +
			`height:${this.stats.rect.height}px;` +
			`}` +
			`#${this.originaleId}{` +
			`width:${this.stats.rect.width}px;` +
			`height:${this.stats.rect.height}px;` +
			`opacity:0;` +
			`}`;
		return stringcss;
	},
};
window.addEventListener("DOMContentLoaded", () => {
	_F.start();
});
