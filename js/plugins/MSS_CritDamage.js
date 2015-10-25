/*:
	@plugindesc Changes the critical strike damage (currently only to 2x damage)
	@author MikauSchekzen
*/

Game_Action.prototype.applyCritical = function(damage) {
    return damage * 2;
};