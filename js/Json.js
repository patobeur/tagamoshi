const _J = {
	jsons: {
		cssString: function () {
			return (
				`*,.world,.world ::before,.world ::after{margin:0;padding:0;box-sizing:border-box;-webkit-user-select:none;-webkit-touch-callout:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}` +
				`` +
				// ---------- world ----------------------
				`.world{cursor:grab;` +
				`border-radius: 1rem;` +
				`-webkit-box-shadow: 0px 0px 16px 15px rgba(97, 97, 97, 0.84);` +
				`box-shadow: 0px 0px 16px 15px rgba(53, 53, 53, 0.84);` +
				`outline: none;` +
				`background: rgb(67, 69, 112);` +
				`background: radial-gradient(circle, rgba(67, 69, 112, 1) 3%, rgba(35, 36, 57, 1) 60%);` +
				`}` +
				`.world.grab{cursor:grabbing}` +
				// ----------------------------------------
				`.unselectable{}` +
				// world allrooms -------------------------
				`.world .allrooms {position: absolute;width: 100%;height: 100%;overflow: hidden;border-radius: 1rem;-webkit-box-shadow: inset 0px 0px 35px 11px rgba(39, 39, 39, 0.84);box-shadow: inset 0px 0px 35px 11px rgba(46, 46, 46, 0.84);background-color: #fffafa25;` +
				`}` +
				// room -------------------------
				`.room{padding:5px;color:white;font-size:.5rem;position:absolute;` +
				// `outline:1px solid rgba(0,255,0,0.1);` +
				`height:${_W.worldDatas.roomSideLength}px;` +
				`width:${_W.worldDatas.roomSideLength}px;` +
				`align-content:flex-start;` +
				`}` +
				// ----------------------------------------
				`.room.up{background-color:${_W.worldDatas.mobdatas.case};border-radius:9px;` +
				`}` +
				// ----------------------------------------
				`.room.done{background-color:rgba(68,58,155,.3);` +
				`}` +
				// ----------------------------------------
				`.room:hover{border-radius:0;` +
				`}` +
				// room by lv ----------------------------------------
				`.room.lv1{background-color:rgba(155, 200, 155,.2);}` +
				`.room.lv2{background-color:rgba(200, 200, 155,.2);}` +
				`.room.lv3{background-color:rgba(250, 250, 200,.2);}` +
				`.room.lv4{background-color:rgba(155, 155, 55,.2);}` +
				// -------------consumable--------------------
				`.consumable {` +
					`position:absolute;` +
					// `color:white;` +
					`font-size:${_W.worldDatas.consumabledatas.fontrem}rem;` +
					// `text-shadow: 0px 0px 5px 5px rgba(53, 53, 53, 0.84);` +
					// `outline:2px solid rgba(255,255,255,1);` +
					`width:${_W.worldDatas.consumabledatas.w}px;` +
					`height:${_W.worldDatas.consumabledatas.h}px;` +
					`display:flex;` +
					`align-items:center;` +
					`justify-content:center;` +
					`transition-duration:1s;` +
					`transition-property:transform,opacity;` +
					`transition-timing-function:ease-in-out;` +
					`opacity:1;` +
					`transform:scale(1);` +
				`}` +
				// consumable new --------------------
				`.consumable.new {` +
				`opacity:0.3;` +
				`transition-duration:1s;` +
				`transition-property:transform,opacity;` +
				`transition-timing-function:ease-in-out;` +
				`transform:scale(0.1);` +
				`}` +
				// -------------tree--------------------
				`.tree {` +
				`position:absolute;` +
				// `color:white;` +
				`font-size:${_W.worldDatas.treedatas.fontrem}rem;` +
				// `text-shadow: 0px 0px 5px 5px rgba(53, 53, 53, 0.84);` +
				// `outline:2px solid rgba(255,255,255,.3);` +
				`width:${_W.worldDatas.treedatas.w}px;` +
				`height:${_W.worldDatas.treedatas.h}px;` +
				`display:flex;` +
				`align-items:center;` +
				`justify-content:center;` +
				// `border-radius:50%;` +
				`background: none;` +
				// `background: radial-gradient(circle, rgba(62,232,2,.5) 0%, rgba(16,112,31,0) 50%);` +
				`}` +
				`.tree.visited {` +
				`background: radial-gradient(circle, rgba(32,200,2,.7) 0%, rgba(16,112,31,0) 50%);` +
				`}` +
				`.tree.onfruits {` +
				// `filter: hue-rotate(180deg);` +
				`background: radial-gradient(circle, rgba(2,32,20,.7) 0%, rgba(31,16,112,0) 50%);` +

				`}` +
				// ----------------------------------------
				`.room2{` +
					`align-content:flex-start;` +
					`transform-origin:top left;` +
					`height:${_W.worldDatas.roomSideLength / 10}px;` +
					`width:${_W.worldDatas.roomSideLength / 10}px;` +
				`}` +
				// -------------world----------------------
				`.world {position:absolute;width:100%;height:100%;` +
				`}` +
				// -------------allmobs--------------------
				`.world .mob{` +
					`transition-duration:500ms;` +
					`transition-property:width,height,color,margin;` +
					`transition-timing-function:ease-in-out;` +
					`border-radius:50%;` +
					`cursor:pointer;` +
					`position:absolute;` +
					`display:flex;` +
					`align-items:center;` +
					`justify-content:center;` +
					`width:${_W.worldDatas.mobdatas.mobh}px;` +
					`height:${_W.worldDatas.mobdatas.mobw}px;` +
				`}` +
				`.world .mob:hover{` +
					`transform-orign : 0 0;` +
					`transform : scale(1.2);` +
					`z-index:2;` +
				`}` +
				// ----------------------------------------
				`.mob.move{` +
					`opacity:1;` +
				`}` +
				// exhausted ------------------------------
				`.world .mob.exhausted{` +
					`opacity:.7;` +
					`font-size:.5rem;` +
					`border:2px dotted ${_W.worldDatas.mobdatas.colors[`energie`]};` +
					`width: ${_W.worldDatas.mobdatas.mobwrestin}px;` +
					`height: ${_W.worldDatas.mobdatas.mobhresting}px;` +
				`}` +
				// thisistheend ------------------------------
				`.world .mob.thisistheend{` +
					`opacity:0;` +
					`transition-duration:${_W.worldDatas.mobDeleteTimeout};` +
					`transition-property:opacity;` +
					`transition-timing-function:ease-in-out;` +
				`}` +
				// mobdisplay------------------------------
				`.mob .mobdisplay {` +
					`position: absolute;` +
					`left: 105%;` +
					`width:max-content;` +
					`paddind:.5rem;` +
					`background-color: #0000FFFF;` +
					`border-radius: .5rem;` +
					`display: none;` +
				`}` +
				// alldis------------------------------
				`.mob .alldis {` +
					`display:flex;align-items:center;justify-content:center;` +
					`position: absolute;` +
					`width: ${_W.worldDatas.mobdatas.mobh}px;` +
					`height: ${_W.worldDatas.mobdatas.mobh}px;` +
					`font-size:${_W.worldDatas.mobdatas.cssfonticosize}rem;` +
				`}` +
				// alldis------------------------------
				`.mob .dis {` +
					`position: absolute;` +
					`width:max-content;` +
					`padding: 0 3px;` +
					`transition-duration:500ms;` +
					`transition-property:top,left,opacity;` +
					`transition-timing-function:ease-in-out;` +
					`font-size: .6rem;` +
					`border-radius: 50%;` +
					`opacity:0;` +
				`}` +
				// consumable ---------------------------------
				`.mob .disconsumable {` +
					`padding: 0;` +
					`font-size: .6rem;` +
					`background-color:rgba(255,255,255,.5);` +
					`right:50%;` +
					`opacity:0;` +
				`}` +
				`.mob .disconsumable.up {` +
					`opacity:1;` +
					`right:103%;` +
				`}` +
				// disstarving ---------------------------------
				`.mob .disstarving {` +
					`bottom:103%;left:30%;` +
				`}` +
				`.mob .disstarving.up {display: initial;` +
					`bottom:103%;left:80%;` +
					`opacity:1;` +
				`}` +
				// resting ---------------------------------
				`.mob .disresting {` +
					`bottom:50%;` +
				`}` +
				`.mob.exhausted .disresting {` +
				`font-size: .9rem;` +
					`background-color:rgba(255,255,255,1);` +
					`bottom:103%;` +
					`opacity:1;` +
				`}` +
				// disalerte ------------------------------
				`.mob .disalerte {` +
					`bottom:103%;left: 50%;` +
					`opacity:0;` +
				`}` +
				`.mob .disalerte.up {display: initial;` +
					`bottom:103%;left: 103%;` +
					`opacity:1;` +
				`}` +
				// disico ---------------------------------
				`.mob .disico {` +
					`border-radius: 50%;` +
					`font-size: 1rem;` +
					`opacity:1;` +
				`}` +
				// dismyid ---------------------------------
				`.mob .dismyid {` +
					`font-size: .6rem;` +
					`background-color:rgba(255,255,255,.5);` +
					`bottom:103%;right:103%;` +
					`opacity:1;` +
				`}` +
				`.mob.me .dismyid{` +
					`background-color:rgba(0,255,0,.7);` +
					`color:black;` +
				`}` +
				`.mob.clone .dismyid{` +
					`background-color:rgba(0,0,255,.7);` +
					`color:white;` +
				`}` +
				// disvoisins ---------------------------------
				`.mob .disvoisins {` +
					`background-color: #FFFFFF;` +
					`border-radius: .5rem;` +
					`top: 103%;` +
					`opacity:0;` +
				`}` +
				`.mob .disvoisins.up {` +
					`opacity:1;` +
				`}` +
				// infomob------------------------------
				`.mob .disinfomob {` +
					`position: absolute;` +
					`left: 98%;top: 2%;` +
					`width: max-content;` +
					`border-radius: .5rem;` +
					`padding: .5rem;` +
					`background-color: #f0f0f0a8;` +
					`display: none;` +
				`}` +
				`.mob .disinfomob.up {display: initial;}` +
				// all exhausted ---------------------------------
				`.mob.exhausted .disvoisins {` +
					`background-color: black;opacity:.3;` +
				`` +
				`}` +
				// `.mob.exhausted .dismyid {background-color: black;` +
				// `bottom:50%;right:50%;` +
				// `}` +
				// -------------allsvg---------------------
				`.mob svg{` +
					`position:absolute;` +
					`width:${_W.worldDatas.mobdatas.svgSideLength}px;` +
					`height:${_W.worldDatas.mobdatas.svgSideLength}px;` +
				`}` +
				`.mob svg circle{stroke-linecap:round;}`
				// mobdisplay-------------- JS ------------
				// `.mob:hover .mobdisplay {display: initial;}`
			);
		},
		charactersForImmat: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		indexedFlora: {
			tree: {
				"Deciduous Tree": {
					ico: "🌳",
					description: "Deciduous Tree",
					model: "tree",
					className: "tree",
					stats: {},
				},
				"Evergreen Tree": {
					ico: "🌲",
					description: "Evergreen Tree",
					model: "tree",
					className: "tree",
					stats: {},
				},
				"Palm Tree": {
					ico: "🌴",
					description: "Palm Tree",
					model: "tree",
					className: "tree",
					stats: {},
					drop: {
						indexedFlora: {
							consumable: ["Coconut"],
						},
					},
				},
			},
			consumable: {
				Grapes: {
					ico: "🍇",
					description: "Grapes",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 10,
						fatigue: -5,
						faim: -20,
					},
				},
				Melon: {
					ico: "🍈",
					description: "Melon",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 15,
						fatigue: -3,
						faim: -25,
					},
				},
				Watermelon: {
					ico: "🍉",
					description: "Watermelon",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 20,
						fatigue: -5,
						faim: -30,
					},
				},
				Orange: {
					ico: "🍊",
					description: "Orange",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 12,
						fatigue: -6,
						faim: -15,
					},
				},
				Lemon: {
					ico: "🍋",
					description: "Lemon",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 8,
						fatigue: -4,
						faim: -10,
					},
				},
				Banana: {
					ico: "🍌",
					description: "Banana",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 25,
						fatigue: -8,
						faim: -30,
					},
				},
				Pineapple: {
					ico: "🍍",
					description: "Pineapple",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 18,
						fatigue: -7,
						faim: -25,
					},
				},
				Mango: {
					ico: "🥭",
					description: "Mango",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 22,
						fatigue: -6,
						faim: -28,
					},
				},
				Apple: {
					ico: "🍎",
					description: "Apple",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 13,
						fatigue: -5,
						faim: -18,
					},
				},
				Pear: {
					ico: "🍏",
					description: "Pear",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 14,
						fatigue: -4,
						faim: -20,
					},
				},
				"Green Apple": {
					ico: "🍐",
					description: "Green Apple",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 14,
						fatigue: -5,
						faim: -19,
					},
				},
				Peach: {
					ico: "🍑",
					description: "Peach",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 16,
						fatigue: -6,
						faim: -22,
					},
				},
				Cherries: {
					ico: "🍒",
					description: "Cherries",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 12,
						fatigue: -4,
						faim: -15,
					},
				},
				Strawberry: {
					ico: "🍓",
					description: "Strawberry",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 9,
						fatigue: -3,
						faim: -12,
					},
				},
				Kiwi: {
					ico: "🥝",
					description: "Kiwi",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 10,
						fatigue: -4,
						faim: -14,
					},
				},
				Tomato: {
					ico: "🍅",
					description: "Tomato",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 7,
						fatigue: -2,
						faim: -10,
					},
				},
				Coconut: {
					ico: "🥥",
					description: "Coconut",
					model: "fruit",
					className: "consumable",
					stats: {
						energie: 30,
						fatigue: -10,
						faim: -40,
					},
				},
			},
		},
		indexedFauna: {
			girl: {
				ico: "👧",
				description: "Girl",
				model: "human",
			},
			woman: {
				ico: "👩",
				description: "Woman",
				model: "human",
			},
			oldWoman: {
				ico: "👴",
				description: "Old Woman",
				model: "human",
			},
			boy: {
				ico: "👦",
				description: "Boy",
				model: "human",
			},
			man: {
				ico: "👨",
				description: "Man",
				model: "human",
			},
			oldMan: {
				ico: "🧓",
				description: "Old Man",
				model: "human",
			},
			lion: {
				ico: "🦁",
				description: "Lion",
				model: "animal",
			},
			tiger: {
				ico: "🐯",
				description: "Tiger",
				model: "animal",
			},
			rabbit: {
				ico: "🐰",
				description: "Rabbit",
				model: "animal",
			},
			bat: {
				ico: "🦇",
				description: "Bat",
				model: "animal",
			},
			bear: {
				ico: "🐻",
				description: "Bear",
				model: "animal",
			},
		},
	},
};
