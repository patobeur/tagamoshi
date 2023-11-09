const _MobActions = {
	selectAction: function (mob) {
		let fati = mob._.stats.fatigue;
		let faim = mob._.stats.faim;
		mob.actionsTodo[0] = "move";
		if (faim.cur >= faim.max) {
			mob.actionsTodo[0] = "die";
		} else {
			if (fati.needrest) {
				mob.actionsTodo[0] = "rest";
			} else {
				fati.needrest = fati.cur >= fati.max * 0.8; // >80%
			}
			// pas reposé et fatigué
			if (mob._.perso.IAActive) {
				if (!fati.needrest) {
					mob.actionsTodo[0] = "move";
				}
				if (faim.active && mob._.targets.consumable.nearest) {
					mob.actionsTodo[0] = "fooding";
				}
			}
		}
	},
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
				mob.removefromDom(this);
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
		let target = mob._.targets.consumable.nearest;
		if (target!=null) {
			if (_O.indexedconsumableByIds[target._.perso.id]) {
				mob.changedirtotarget(target);
				const distance = Math.sqrt(
					Math.pow(mob._.s.actual.x - target._.s.actual.x, 2) +
						Math.pow(mob._.s.actual.y - target._.s.actual.y, 2)
				);
				if (distance <=5) {
					target.divElement.remove();

					mob._.stats.faim.cur += target._.sheat.stats.faim;
					// mob._.stats.fatigue.cur += target._.sheat.stats.fatigue
					mob._.stats.energie.cur += target._.sheat.stats.energie

					delete _O.indexedRoomsByCaseNumber[target._.s.actual.RoomNum].consumables[
						target._.perso.id
					];
					delete _O.indexedconsumableByIds[target._.perso.id];
					delete target;
					
					mob._.targets.consumable.nearest = null;
				}
			} else {
				mob._.targets.consumable.nearest = null;
			}
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
				this.move(mob);
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
		let affame = faim.cur > faim.max * 0.5;

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
