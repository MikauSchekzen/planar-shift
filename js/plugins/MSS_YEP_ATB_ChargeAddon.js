var MikauSchekzen = MikauSchekzen || {};
MikauSchekzen.ATB_ChargeAddon = MikauSchekzen.ATB_ChargeAddon || {};


/*:
 * @plugindesc An addon to Yanfly's ATB, for charging skills and items
 * @author MikauSchekzen
 *
 * @param Action speed eval
 * @desc The speed at which battlers' action gauge will fill up
 * @default 10000
 *
 * @param Default charge eval
 * @desc Overrides the speed at which the ATB charge bar will fill
 * @default 10000
 *
 * @param ------------------------------------
 *
 * @param Cast Speed XParam ID
 * @desc The id for the cast speed xparam. If unsure, leave at default
 * @default 10
 *
 * @param Cast Speed Lower Limit
 * @desc The lower limit of the cast speed as a modifier (eg 0.25 would be 25% of default speed)
 * @default 0.25
 *
 * @param ------------------------------------
 *
 * @param Act Rate XParam ID
 * @desc The id for the cast speed xparam. If unsure, leave at default
 * @default 11
 * 
 * @help
 * ============================================
 * <ChargeTime>
 * eval
 * </ChargeTime>
 * --------------------------------------------
 * Scope: Skills, Items
 * --------------------------------------------
 * Replace 'eval' with a javascript notation (or just a number) to adjust
 *  the charge time of said skill or item.
 * 
 * 
 * ============================================
 * <CastSpeed: number>
 * --------------------------------------------
 * Scope: Weapons, Armor, States, Enemies, Actors, Classes
 * --------------------------------------------
 * Replace 'number' with a number to change the casting speed.
 *  For example, <CastSpeed: 5> will increase the cast speed by 5%.
 * 
 * 
 * ============================================
 * <ActRate: number>
 * --------------------------------------------
 * Scope: Weapons, Armor, States, Enemies, Actors, Classes
 * --------------------------------------------
 * Replace 'number' with a number to modify the speed of a battler.
 *  For example, <ActRate: 5> will increase the act speed by 5%, and
 *  <ActRate: -15> will decrease the act speed by 15%.
*/

MikauSchekzen.Parameters = PluginManager.parameters('MSS_YEP_ATB_ChargeAddon');
MikauSchekzen.Param = MikauSchekzen.Param || {};

MikauSchekzen.Param.actionSpeedEval = String(MikauSchekzen.Parameters['Action speed eval']);
MikauSchekzen.Param.defaultChargeEval = String(MikauSchekzen.Parameters['Default charge eval']);
MikauSchekzen.Param.xParamIdCastSpeed = Number(MikauSchekzen.Parameters['Cast Speed XParam ID']);
MikauSchekzen.Param.castSpeedMin = Number(MikauSchekzen.Parameters['Cast Speed Lower Limit']);
MikauSchekzen.Param.xParamIdActSpeed = Number(MikauSchekzen.Parameters['Act Rate XParam ID']);



// DataManager

MikauSchekzen.ATB_ChargeAddon.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
	if(!MikauSchekzen.ATB_ChargeAddon.DataManager_isDatabaseLoaded.call(this)) return false;
	DataManager.processATB_ChargeAddon_Notetags($dataSkills);
	DataManager.processATB_ChargeAddon_Notetags($dataItems);
	DataManager.processATB_ChargeAddon_Notetags2($dataWeapons);
	DataManager.processATB_ChargeAddon_Notetags2($dataArmors);
	DataManager.processATB_ChargeAddon_Notetags2($dataStates);
	DataManager.processATB_ChargeAddon_Notetags2($dataEnemies);
	DataManager.processATB_ChargeAddon_Notetags2($dataActors);
	DataManager.processATB_ChargeAddon_Notetags2($dataClasses);
	return true;
};

DataManager.processATB_ChargeAddon_Notetags = function(group) {
	var noteA1 = /<(?:Charge|Cast)[ ]?Time>/i;
	var noteA2 = /<\/(?:Charge|Cast)[ ]?Time>/i;

	var a, b, line, obj, notedata, evalMode;
	for(a = 1;a < group.length;a++) {
		obj = group[a];
		notedata = obj.note.split(/[\r\n]+/);
		evalMode = 'none';

		obj.castTime = '1';

		for(b = 0;b < notedata.length;b++) {
			line = notedata[b];
			if(line.match(noteA1)) {
				evalMode = 'castTime';
				obj.castTime = '';
			} else if(line.match(noteA2)) {
				evalMode = 'none';
			} else if(evalMode === 'castTime') {
				obj.castTime = obj.castTime + line + '\n';
			}
		}
	}
};

DataManager.processATB_ChargeAddon_Notetags2 = function(group) {
	var noteA1 = /<(?:Cast[ ]?Speed: ([-]?[0-9]+))>/i
	var noteB1 = /<Act[ ]?Rate:[ ]?(-?[0-9]+)>/i

	var a, b, line, obj, notedata;
	for(a = 1;a < group.length;a++) {
		obj = group[a];
		notedata = obj.note.split(/[\r\n]+/);

		for(b = 0;b < notedata.length;b++) {
			line = notedata[b];
			if(line.match(noteA1)) {
				obj.traits.push({
					code: Game_BattlerBase.TRAIT_XPARAM,
					dataId: MikauSchekzen.Param.xParamIdCastSpeed,
					value: parseFloat(RegExp.$1 * 0.01)
				});
			} else if(line.match(noteB1)) {
				obj.traits.push({
					code: Game_BattlerBase.TRAIT_XPARAM,
					dataId: MikauSchekzen.Param.xParamIdActSpeed,
					value: parseFloat(RegExp.$1 * 0.01)
				});
			}
		}
	}
};


// Game_Battler

MikauSchekzen.ATB_ChargeAddon.Game_Battler_atbChargeDenom = Game_Battler.prototype.atbChargeDenom;
Game_Battler.prototype.atbChargeDenom = function() {
	var action = this.currentAction();
	var denom = 1;
	if(action && (action.isItem() || action.isSkill())) {
		denom = eval(action.item().castTime);
	}
	else {
		denom = MikauSchekzen.ATB_ChargeAddon.Game_Battler_atbChargeDenom.call(this);
	}
	return denom;
};

MikauSchekzen.ATB_ChargeAddon.Game_Battler_atbSpeedTick = Game_Battler.prototype.atbSpeedTick;
Game_Battler.prototype.atbSpeedTick = function() {
	var value = 1;
	if(this.isATBCharging()) {
		value = eval(MikauSchekzen.Param.defaultChargeEval);
		if(this.currentAction().isMagicSkill()) {
			value = value * Math.max(MikauSchekzen.Param.castSpeedMin, (1 + this.crt));
		}
	}
	else {
		value = eval(MikauSchekzen.Param.actionSpeedEval);
		value *= (1 + this.art);
	}
	return value;
};


// Game_BattlerBase

Object.defineProperties(Game_BattlerBase.prototype, {
	crt: { get: function() { return this.xparam(MikauSchekzen.Param.xParamIdCastSpeed); }, configurable: true },
	art: { get: function() { return this.xparam(MikauSchekzen.Param.xParamIdActSpeed); }, configurable: true }
});

