var MikauSchekzen = MikauSchekzen || {};
MikauSchekzen.SelfSwitchController = MikauSchekzen.SelfSwitchController || {};


/*:
 * @plugindesc Controls self switches of other events outside of the current event (or even the current map)
 * @author MikauSchekzen
 *
 * @help
 * New script calls:
 * this.setSS(switch, value[, eventId[, mapId]])
 * this.getSS(switch[, eventId[, mapId]])
 */


Game_Interpreter.prototype.setSS = function(sw, value, eventId, mapId) {
	if(mapId === undefined) mapId = this._mapId;
	if(eventId === undefined) eventId = this._eventId;
	var key = [mapId, eventId, sw];
	$gameSelfSwitches.setValue(key, value);
};

Game_Interpreter.prototype.getSS = function(sw, eventId, mapId) {
	if(mapId === undefined) mapId = this._mapId;
	if(eventId === undefined) eventId = this._eventId;
	var key = [mapId, eventId, sw];
	return $gameSelfSwitches.value(key);
};