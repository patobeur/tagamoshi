const _css = function () {
	return (
		`` +
		`body{` +
			`overflow:hidden;` +
			`background-color: rgb(26, 26, 28)` +
		`.missile{` +
			// `background-color: rgb(248, 248, 248);`+
		`}` +
		`svg {` +
			`transform: rotate(90deg);}` +
			`.blackhole {` +
			`position:absolute;` +
			`background-color: rgba(255,0,0,.5);` +
			`border:3px solid rgba(255,255,255,.2);` +
			`border-radius:50%;` +
			`width: ${_blackhole.w}px;height:${_blackhole.h}px;` +
			`display: flex;` +
			`align-items: center;` +
			`justify-content: center;` +
		`}` +
		`.blackhole .maxattract {` +
			`position:absolute;` +
			`background-color: rgba(255,255,255,.01);` +
			`border:1px solid rgba(255,255,255,.2);` +
			`border-radius:50%;` +
			`width: ${gravity}px;height:${gravity}px;` +
		`}` +
		`.blackhole .distanceconsume {` +
			`position:absolute;` +
			`background-color: rgba(255,255,255,.01);` +
			`border:1px solid rgba(255,255,255,.05);` +
			`border-radius:50%;` +
			`width: ${_blackhole.w}px;height:${_blackhole.h}px;` +
		`}` +
		`.blackhole .distanceattract {` +
			`position:absolute;` +
			`background-color: rgba(200,200,255,.01);` +
			`border:3px dotted rgba(255,255,255,.05);` +
			`border-radius:50%;` +
			`width: ${gravityRangeDiametre}px;height:${gravityRangeDiametre}px;` +
		`}` +
		`.missile {` +
			`display: flex;` +
			`align-items: center;` +
			`justify-content: center;` +
		`}` +
		`.missile .emoji {` +
			`position:relative;` +
			`display: flex;` +
			`align-items: center;` +
			`justify-content: center;` +
		`}`
	);
};