const tools = {
	randEmoji: function () {
        let emoji = ['🎱','🥎','🏀','🏐','🏈','🏉','⚽','⚾','🏓','🦴','🐰','🐺','🐐','🐕']
        return emoji[tools.rand(0,emoji.length-1)]
    },
	sanitize: function (string) {
		const map = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#x27;",
			"./": "&#x2F;",
		};
		const reg = /[&<>"'/]/gi;
		return string.replace(reg, (match) => map[match]);
	},
	addCss: function (string) {
		let stringcss = string;
		let style = document.createElement("style");
		style.textContent = tools.sanitize(stringcss);
		style.id = "css";
		document.getElementsByTagName("head")[0].appendChild(style);
	},
	createDiv(params) {
		let element = document.createElement(params.tag);
		if (params.attributes) {
			for (const key in params.attributes) {
				if (Object.hasOwnProperty.call(params.attributes, key))
					element[key] = params.attributes[key];
				if (params.style) {
					for (const key2 in params.style) {
						if (Object.hasOwnProperty.call(params.style, key2))
							element.style[key2] = params.style[key2];
					}
				}
			}
		}
		return element;
	},
	rand(min, max) {return Math.floor(Math.random() * (max - min + 1) + min);},
	// ----------- MOB -------------------------------------
	getRotationAngle: function (m) {
		return (
			(Math.atan2(
				m.conf.velocity.y,
				m.conf.velocity.x
			) *
				180) /
			Math.PI
		);
	},
	setVelocityWithRandomAngle: function (m) {
		const distance = 30;
		m.conf.angle = this.rand(-180, 180) * (Math.PI / 180);
		m.conf.speed = Math.min(Math.max(2, distance / 50), 6);
		m.conf.velocity.x = m.conf.speed * Math.cos(m.conf.angle);
		m.conf.velocity.y = m.conf.speed * Math.sin(m.conf.angle);
	},
	randEmoji: function () {
        let emoji = ['🎱','🥎','🏀','🏐','🏈','🏉','⚽','⚾','🏓','🦴','🐰','🐺','🐐','🐕']
        return emoji[tools.rand(0,emoji.length-1)]
    },
	calculateDistance: function (x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	},
	getAngleToMouseDegrees: function (obj, adjusted = false) {
		
		let radians = Math.atan2(
			_mouse.mouse.y - Game.worldpos.top - obj.conf.position.y,
			_mouse.mouse.x - Game.worldpos.left - obj.conf.position.x
		);
		let degrees = (radians * 180) / Math.PI;
		if (adjusted) degrees = (degrees + 360) % 360; // angle de 0 à 360 degrés
		return degrees;
	},
}