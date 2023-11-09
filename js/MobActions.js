const _MobActions =  {
		die: function (mob) {
			// todo
			mob.blocs.texte.textContent = "adieu !";
			clearInterval(mob.alive);
			_R.roomFunctions.exitCase(mob);
			if (!mob.mobDivElement.classList.contains("thisistheend")) {
				mob.mobDivElement.classList.add("thisistheend");
			}
			mob.removefromIndexes(mob);
			console.log(mob._.perso.immat + " is on the dev paradise way !!!");
			setTimeout(
				() => {
					this.removefromDom(this);
				},
				_W.worldDatas.mobDeleteTimeout,
				"dom"
			);
			_W.worldDatas.mobcounter++;
		},
		rest: function (mob) {
			if (!mob.mobDivElement.classList.contains("exhausted")) {
				mob.mobDivElement.classList.add("exhausted");
			}
			if (mob.mobDivElement.classList.contains("move")) {
				mob.mobDivElement.classList.remove("move");
			}
			mob.blocs.texte.textContent = "Trop fatigué !";
		},
		fooding: function (mob) {
			if (mob._.targets.consumable.nearest!=null){
				let target = mob._.targets.consumable.nearest
				mob.changedirtotarget(target);
				const distance = Math.sqrt(
					Math.pow(mob._.s.actual.x - target._.s.actual.x, 2) +
						Math.pow(mob._.s.actual.y - target._.s.actual.y, 2)
				);
				// console.log(distance)
				if(distance<100){
					console.log(target)}
				if(distance<10){
					mob._.stats.faim.cur = 60
					// console.log(target._.perso.immat,target._.perso.id)
					// console.log(target._.s.actual.RoomNum)
				}
				// if distance < width/2 ?
				// if collaps
				// add to inventory ?
				// remove from array
				// remove from world
			}
			else {
				mob.changedir();
			}

			_M.mobFunctions.setFuturPosAndRoom(mob);
			mob.applynextPos();
			mob._.stats.fatigue.sens = -3;
			_M.mobFunctions.updateMobDivElementPos(mob);
			mob.blocs.texte.textContent = "j'ai faim !";
		},
		move: function (mob) {
			mob.changedir();
			_M.mobFunctions.setFuturPosAndRoom(mob);
			mob.applynextPos();

			mob._.stats.fatigue.sens = -3;
			_M.mobFunctions.updateMobDivElementPos(mob);

			if (mob.mobDivElement.classList.contains("exhausted")) {
				mob.mobDivElement.classList.remove("exhausted");
			}
			if (!mob.mobDivElement.classList.contains("move")) {
				mob.mobDivElement.classList.add("move");
			}
			mob.blocs.texte.textContent = "Roaming !";
		},
		doAction: function (mob) {
			switch (mob.actionsTodo[0]) {
				case "rest":
					this.rest(mob);
					break;
				case "move":
					this.move(mob);
					break;
				case "fooding":
					this.fooding(mob);
					break;
				case "die":
					this.die(mob);
					break;
				default:
					break;
			}
		},
		setFatigueOrNot: function (mob) {
			let fat = mob._.stats.fatigue;
			if (fat.cur <= fat.min) {
				if (fat.needrest) fat.needrest = false;
				if (fat.active) fat.active = false;
				if (!fat.rested) fat.rested = true;
			} else {
				// fat.active = false;
				fat.sens = 5;
			}
		},
		setFaimOrNot: function (mob) {
			let faim = mob._.stats.faim;
			let affame = faim.cur > faim.max * 0.7;

			if (!affame && faim.active) {
				mob.blocs.starving.classList.remove("up");
			}
			if (affame && !faim.active) {
				mob.blocs.starving.classList.add("up");
				// console.log(mob._.perso.immat,"---------------");
				// if (mob._.targets.consumable.stack === null) {
				// 	console.log("pas de fruits autour");
				// }
				if (mob._.targets.consumable.nearest != null) {
					// console.log("j'ai un fruit en tete");
					// console.log(mob._.targets.consumable.nearest);
				}
				// else {
				// 	console.log("pas de fruit en tete");
				// }
			}
			faim.active = affame;
		},
};