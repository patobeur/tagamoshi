const _L = {
	listenerFunctions: {
		addWorldListener: function () {
			element = _W.worldDiv;
			let isDragging = false;
			let offsetX, offsetY;

			document.addEventListener("mousedown", (e) => {
				isDragging = true;
				const rect = element.getBoundingClientRect();
				offsetX = e.clientX - rect.left;
				offsetY = e.clientY - rect.top;
				element.style.cursor = "grabbing";
			});

			document.addEventListener("touchstart", (e) => {
				isDragging = true;
				const rect = element.getBoundingClientRect();
				const touch = e.touches[0];
				offsetX = touch.clientX - rect.left;
				offsetY = touch.clientY - rect.top;
				element.style.cursor = "grabbing";
			});

			document.addEventListener("mousemove", (e) => {
				if (isDragging) {
					element.style.left = e.clientX - offsetX + "px";
					element.style.top = e.clientY - offsetY + "px";
				}
			});

			document.addEventListener("touchmove", (e) => {
				if (isDragging) {
					const touch = e.touches[0];
					element.style.left = touch.clientX - offsetX + "px";
					element.style.top = touch.clientY - offsetY + "px";
				}
			});

			document.addEventListener("mouseup", () => {
				isDragging = false;
				element.style.cursor = "grab";
			});

			document.addEventListener("touchend", () => {
				isDragging = false;
				element.style.cursor = "grab";
			});
		},
	},
};
