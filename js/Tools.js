const _T = {
	tools: {
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
		rand: (min, max) => {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
	},
};