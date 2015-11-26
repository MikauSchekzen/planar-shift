//=============================================================================
// Yanfly Engine Plugins - Battle Engine Extension - Sideview Enemies
// YEP_X_SideviewEnemies.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_X_SideviewEnemies = true;

var Yanfly = Yanfly || {};
Yanfly.SVE = Yanfly.SVE || {};

//=============================================================================
 /*:
 * @plugindesc vBETA (Requires YEP_BattleEngineCore.js) This plugin lets
 * you use Sideview Actors for enemies!
 * @author Yanfly Engine Plugins
 *
 * @param Attack Motion
 * @desc Sets the default attack motion for sideview enemies.
 * Attack Motion Types: swing     thrust     missile
 * @default thrust
 *
 * @param Weapon Image Index
 * @desc Sets the default weapon image index for the sprite.
 * Use 0 for no image.
 * @default 0
 *
 * @param Idle Motion
 * @desc Sets the sprite's idle motion.
 * Default: walk
 * @default walk
 *
 * @param Anchor X
 * @desc Sets the default anchor position of the sprite.
 * Default: 0.5
 * @default 0.5
 *
 * @param Anchor Y
 * @desc Sets the default anchor position of the sprite.
 * Default: 1
 * @default 1
 *
 * @param Sprite Width
 * @desc Sets the default width for sideview sprites.
 * Default: 64
 * @default 80
 *
 * @param Sprite Height
 * @desc Sets the default height for sideview sprites.
 * Default: 64
 * @default 64
 *
 * @param Collapse
 * @desc When a sprite dies, have it collapse and vanish?
 * NO - false     YES - true
 * @default false
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin requires YEP_BattleEngineCore.
 * Make sure this plugin is located under YEP_BattleEngineCore in the
 * plugin list.
 *
 * This extension plugin for the Battle Engine Core enables you to use sideview
 * actor sprites for your enemies to help your battles appear more lively and
 * have more variety.
 *
 * To use this plugin, insert within the enemy's notebox the notetags you see
 * in the section below:
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Insert these notetags into the enemy noteboxes below to change their
 * sidewview battler aspects.
 *
 * Enemy Notetags:
 *
 *   <Sideview Battler: filename>
 *   This is the filename used for the sideview battler found within your
 *   project's img/sv_actors/ folder. Doing this will enable the following
 *   notetags to be applied to the battler. This is case-sensitive and used
 *   without the image's file extension.
 *
 *   *Example: SF_Actor3_8.png would be <Sideview Battler: SF_Actor3_8>
 *
 *   <Sideview Attack Motion: swing>
 *   <Sideview Attack Motion: thrust>
 *   <Sideview Attack Motion: missile>
 *   Sets the basic attack motion for your sideview enemy. You can use any of
 *   the following motions:
 *   walk     wait     chant     guard     damage     evade
 *   thrust   swing    missile   skill     spell      item
 *   escape   victory  dying     abnormal  sleep      dead
 *
 *   <Sideview Idle Motion: swing>
 *   <Sideview Idle Motion: thrust>
 *   <Sideview Idle Motion: missile>
 *   Sets the idling motion for your sideview enemy. You can use any of the
 *   following motions:
 *   walk     wait     chant     guard     damage     evade
 *   thrust   swing    missile   skill     spell      item
 *   escape   victory  dying     abnormal  sleep      dead
 *
 *   <Sideview Weapon Image: x>
 *   This sets the sprite's weapon image to x. If you haven't modified your
 *   system images of the weapons, they would be as follows:
 *   0 - Nothing
 *   1 - Dagger   7 - Long Bow  13 - Mace       19 - Slingshot  25 - Custom
 *   2 - Sword    8 - Crossbow  14 - Rod        20 - Shotgun    26 - Custom
 *   3 - Flail    9 - Gun       15 - Club       21 - Rifle      27 - Custom
 *   4 - Axe     10 - Claw      16 - Chain      22 - Chainsaw   28 - Custom
 *   5 - Whip    11 - Glove     17 - Sword#2    23 - Railgun    29 - Custom
 *   6 - Staff   12 - Spear     18 - Iron Pipe  24 - Stun Rod   30 - Custom
 *
 *   <Sideview Anchor X: y.z>
 *   <Sideview Anchor Y: y.z>
 *   This sets the anchor location for the enemy's sideview battler at y.z.
 *   This is used for the event you have an odd-proportioned sideview battler.
 *
 *   <Sideview Width: x>
 *   <Sideview Height: x>
 *   Sets the width/height of the sideview battler. This is for the event
 *   you're using a battler image that may have different proportions than
 *   normal sideview battlers.
 *
 *   <Sideview Collapse>
 *   Sets it so that the enemy when it dies will collapse and vanish.
 *
 *   <Sideview No Collapse>
 *   Sets it so that the enemy when it dies will leave behind a corpse and
 *   will not vanish.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version BETA:
 * - Started Beta!
 */
//=============================================================================

if (Imported.YEP_BattleEngineCore) {

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_X_SideviewEnemies');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.SVEAttackMotion = String(Yanfly.Parameters['Attack Motion']);
Yanfly.Param.SVEWeaponIndex = Number(Yanfly.Parameters['Weapon Image Index']);
Yanfly.Param.SVEIdleMotion = String(Yanfly.Parameters['Idle Motion']);
Yanfly.Param.SVEAnchorX = Number(Yanfly.Parameters['Anchor X']);
Yanfly.Param.SVEAnchorY = Number(Yanfly.Parameters['Anchor Y']);
Yanfly.Param.SVEWidth = Number(Yanfly.Parameters['Sprite Width']);
Yanfly.Param.SVEHeight = Number(Yanfly.Parameters['Sprite Height']);
Yanfly.Param.SVECollapse = eval(String(Yanfly.Parameters['Collapse']));

//=============================================================================
// DataManager
//=============================================================================

Yanfly.SVE.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!Yanfly.SVE.DataManager_isDatabaseLoaded.call(this)) return false;
		DataManager.processSVENotetags($dataEnemies);
		return true;
};

DataManager.processSVENotetags = function(group) {
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);

    obj.sideviewBattler = '';
    obj.sideviewAttackMotion = Yanfly.Param.SVEAttackMotion.toLowerCase();
    obj.sideviewIdleMotion = Yanfly.Param.SVEIdleMotion.toLowerCase();
    obj.sideviewAnchorX = Yanfly.Param.SVEAnchorX;
    obj.sideviewAnchorY = Yanfly.Param.SVEAnchorY;
    obj.sideviewWeaponImageIndex = Yanfly.Param.SVEWeaponIndex;
    obj.sideviewWidth = Yanfly.Param.SVEWidth;
    obj.sideviewHeight = Yanfly.Param.SVEHeight;
    obj.sideviewCollapse = Yanfly.Param.SVECollapse;

		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(/<(?:SIDEVIEW BATTLER):[ ](.*)>/i)) {
				obj.sideviewBattler = String(RegExp.$1);
			} else if (line.match(/<(?:SIDEVIEW ATTACK MOTION):[ ](.*)>/i)) {
				obj.sideviewAttackMotion = String(RegExp.$1).toLowerCase();
			} else if (line.match(/<(?:SIDEVIEW IDLE MOTION):[ ](.*)>/i)) {
				obj.sideviewIdleMotion = String(RegExp.$1).toLowerCase();
			} else if (line.match(/<(?:SIDEVIEW ANCHOR X):[ ](\d+)[.](\d+)>/i)) {
				obj.sideviewAnchorX = eval(String(RegExp.$1) + '.' + String(RegExp.$2));
			} else if (line.match(/<(?:SIDEVIEW ANCHOR Y):[ ](\d+)[.](\d+)>/i)) {
				obj.sideviewAnchorY = eval(String(RegExp.$1) + '.' + String(RegExp.$2));
			} else if (line.match(/<(?:SIDEVIEW WEAPON IMAGE):[ ](\d+)>/i)) {
        obj.sideviewWeaponImageIndex = parseInt(RegExp.$1);
      } else if (line.match(/<(?:SIDEVIEW WIDTH):[ ](\d+)>/i)) {
        obj.sideviewWidth = parseInt(RegExp.$1);
      } else if (line.match(/<(?:SIDEVIEW HEIGHT):[ ](\d+)>/i)) {
        obj.sideviewHeight = parseInt(RegExp.$1);
      } else if (line.match(/<(?:SIDEVIEW COLLAPSE)>/i)) {
        obj.sideviewCollapse = true;
      } else if (line.match(/<(?:SIDEVIEW NO COLLAPSE)>/i)) {
        obj.sideviewCollapse = false;
      }
		}
	}
};

//=============================================================================
// Game_Enemy
//=============================================================================

Game_Enemy.prototype.svBattlerName = function() {
    return this.enemy().sideviewBattler;
};

Game_Enemy.prototype.hasSVBattler = function() {
    return this.svBattlerName() !== '';
};

Game_Enemy.prototype.weaponImageId = function() {
    return this.enemy().sideviewWeaponImageIndex;
};

Game_Enemy.prototype.attackMotion = function() {
    return this.enemy().sideviewAttackMotion;
};

Game_Enemy.prototype.idleMotion = function() {
    return this.enemy().sideviewIdleMotion;
};

Game_Enemy.prototype.sideviewAnchorX = function() {
    return this.enemy().sideviewAnchorX;
};

Game_Enemy.prototype.sideviewAnchorY = function() {
    return this.enemy().sideviewAnchorY;
};

Game_Enemy.prototype.spriteWidth = function() {
    if ($gameSystem.isSideView() && this.hasSVBattler()) {
			return this.sideviewWidth();
		} else {
			return Game_Battler.prototype.spriteWidth.call(this);
		}
};

Game_Enemy.prototype.sideviewWidth = function() {
    return this.enemy().sideviewWidth;
};

Game_Enemy.prototype.spriteHeight = function() {
    if ($gameSystem.isSideView() && this.hasSVBattler()) {
			return this.sideviewHeight();
		} else {
			return Game_Battler.prototype.spriteHeight.call(this);
		}
};

Game_Enemy.prototype.sideviewHeight = function() {
    return this.enemy().sideviewHeight;
};

Game_Enemy.prototype.sideviewCollapse = function() {
    return this.enemy().sideviewCollapse;
};

Game_Enemy.prototype.performAttack = function() {
    if (!this.hasSVBattler()) {
      return Game_Battler.prototype.performAttack.call(this);
    }
    this.forceMotion(this.attackMotion());
    this.startWeaponAnimation(this.weaponImageId());
};

Game_Enemy.prototype.performAction = function(action) {
    if (!this.hasSVBattler()) {
      return Game_Battler.prototype.performAction.call(this, action);
    }
    Game_Actor.prototype.performAction.call(this, action);
};

Yanfly.SVE.Game_Enemy_performDamage = Game_Enemy.prototype.performDamage;
Game_Enemy.prototype.performDamage = function() {
    if (!this.hasSVBattler()) {
      return Yanfly.SVE.Game_Enemy_performDamage.call(this);
    }
    Game_Battler.prototype.performDamage.call(this);
    if (this.isSpriteVisible()) {
        this.requestMotion('damage');
    } else {
        $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playEnemyDamage();
};

Game_Enemy.prototype.performEvasion = function() {
    Game_Battler.prototype.performEvasion.call(this);
    if (!this.hasSVBattler()) return;
    this.requestMotion('evade');
};

Game_Enemy.prototype.performMagicEvasion = function() {
    Game_Battler.prototype.performMagicEvasion.call(this);
    if (!this.hasSVBattler()) return;
    this.requestMotion('evade');
};

Game_Enemy.prototype.performCounter = function() {
    Game_Battler.prototype.performCounter.call(this);
    if (!this.hasSVBattler()) return;
    this.performAttack();
};

Game_Enemy.prototype.performEscape = function() {
    if (!this.hasSVBattler()) return;
    if (!this.canMove()) return;
    this.requestMotion('escape');
};

//=============================================================================
// Game_Party
//=============================================================================

Yanfly.SVE.Game_Party_requestMotionRefresh =
    Game_Party.prototype.requestMotionRefresh;
Game_Party.prototype.requestMotionRefresh = function() {
    Yanfly.SVE.Game_Party_requestMotionRefresh.call(this);
    $gameTroop.requestMotionRefresh();
};

//=============================================================================
// Sprite_Enemy
//=============================================================================

Yanfly.SVE.Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
Sprite_Enemy.prototype.initMembers = function() {
    Yanfly.SVE.Sprite_Enemy_initMembers.call(this);
    this.initSVSprites();
};

Sprite_Enemy.prototype.initSVSprites = function() {
    this._svBattlerName = '';
    this._motion = null;
    this._motionCount = 0;
    this._pattern = 0;
    this._svBattlerEnabled = false;
    this.createShadowSprite();
    this.createWeaponSprite();
    this.createMainSprite();
    this.createStateSprite();
    this._effectTarget = this;
};

Sprite_Enemy.prototype.createMainSprite = function() {
    Sprite_Actor.prototype.createMainSprite.call(this);
};

Sprite_Enemy.prototype.createShadowSprite = function() {
    Sprite_Actor.prototype.createShadowSprite.call(this);
    this._shadowSprite.opacity = 0;
};

Sprite_Enemy.prototype.createWeaponSprite = function() {
    Sprite_Actor.prototype.createWeaponSprite.call(this);
};

Sprite_Enemy.prototype.createStateSprite = function() {
    Sprite_Actor.prototype.createStateSprite.call(this);
};

Yanfly.SVE.Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function(battler) {
    this._svBattlerEnabled = false;
    Yanfly.SVE.Sprite_Enemy_setBattler.call(this, battler);
    this.setSVBattler(battler);
};

Sprite_Enemy.prototype.setMirror = function(value) {
    if (this._svBattlerEnabled) value = !value;
    Sprite_Battler.prototype.setMirror.call(this, value);
};

Sprite_Enemy.prototype.setSVBattler = function(battler) {
    if (!this._enemy) return;
    if (this._enemy.svBattlerName() === '') return;
    this._actor = this._enemy;
    this._svBattlerEnabled = true;
    this._stateSprite.setup(battler);
};

Yanfly.SVESprite_Enemy_update = Sprite_Enemy.prototype.update;
Sprite_Enemy.prototype.update = function() {
    Yanfly.SVESprite_Enemy_update.call(this);
    if (this._svBattlerEnabled) this.updateMotion();
};

Yanfly.SVE.Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
Sprite_Enemy.prototype.updateBitmap = function() {
    Yanfly.SVE.Sprite_Enemy_updateBitmap.call(this);
    this.updateSVBitmap();
};

Sprite_Enemy.prototype.updateSVBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._enemy.svBattlerName();
    if (this._svBattlerEnabled && this._svBattlerName !== name) {
        this._svBattlerName = name;
        this._mainSprite.bitmap = ImageManager.loadSvActor(name);
        this.setMirror(false);
        this.adjustAnchor();
        this.refreshMotion();
    } else if (this._svBattlerName === '') {
      this._svBattlerName = '';
      this._mainSprite = new Sprite_Base();
      this._mainSprite.anchor.x = 0.5;
      this._mainSprite.anchor.y = 1;
    }
};

Sprite_Enemy.prototype.adjustAnchor = function() {
    if (!this._mainSprite) return;
		this._mainSprite.anchor.x = this._enemy.sideviewAnchorX();
    this._mainSprite.anchor.y = this._enemy.sideviewAnchorY();
};

Yanfly.SVE.Sprite_Enemy_updateFrame = Sprite_Enemy.prototype.updateFrame;
Sprite_Enemy.prototype.updateFrame = function() {
    if (this._svBattlerEnabled) return this.updateSVFrame();
    Yanfly.SVE.Sprite_Enemy_updateFrame.call(this);
};

Sprite_Enemy.prototype.updateSVFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    var bitmap = this._mainSprite.bitmap;
    if (!bitmap) return;
    this._effectTarget = this._mainSprite;
    this._shadowSprite.opacity = 255;
    var motionIndex = this._motion ? this._motion.index : 0;
    var pattern = this._pattern < 3 ? this._pattern : 1;
    var cw = bitmap.width / 9;
    var ch = bitmap.height / 6;
    var svw = this._enemy.sideviewWidth();
    var svh = this._enemy.sideviewHeight();
    this.bitmap = new Bitmap(svw, svh);
    var cx = Math.floor(motionIndex / 6) * 3 + pattern;
    var cy = motionIndex % 6;
    this.setFrame(cx * cw, cy * ch, cw, ch);
    this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
};

Sprite_Enemy.prototype.updateMotion = function() {
    if (!this._svBattlerEnabled) return;
    this.setupMotion();
    this.setupWeaponAnimation();
    if (this._enemy.isMotionRefreshRequested()) {
      Sprite_Actor.prototype.refreshMotion.call(this);
      this._enemy.clearMotion();
    }
    this.updateMotionCount();
};

Sprite_Enemy.prototype.setupMotion = function() {
    if (!this._svBattlerEnabled) return;
    if (!this._enemy.isMotionRequested()) return;
    this.startMotion(this._enemy.motionType());
    this._enemy.clearMotion();
};

Sprite_Enemy.prototype.startMotion = function(motionType) {
    if (!this._svBattlerEnabled) return;
    var newMotion = Sprite_Actor.MOTIONS[motionType];
    if (this._motion === newMotion) return;
    this._motion = newMotion;
    this._motionCount = 0;
    this._pattern = 0;
};

Sprite_Enemy.prototype.setupWeaponAnimation = function() {
    if (!this._svBattlerEnabled) return;
    if (!this._enemy.isWeaponAnimationRequested()) return;
    this._weaponSprite.setup(this._enemy.weaponImageId());
    this._enemy.clearWeaponAnimation();
};

Sprite_Enemy.prototype.updateMotionCount = function() {
    if (!this._svBattlerEnabled) return;
    if (this._motion && ++this._motionCount >= this.motionSpeed()) {
        if (this._motion.loop) {
            this._pattern = (this._pattern + 1) % 4;
        } else if (this._pattern < 2) {
            this._pattern++;
        } else {
            this.refreshMotion();
        }
        this._motionCount = 0;
    }
};

Sprite_Enemy.prototype.refreshMotion = function() {
    if (!this._svBattlerEnabled) return;
    var enemy = this._enemy;
    if (!enemy) return;
    var stateMotion = enemy.stateMotionIndex();
    if (enemy.isInputting() || enemy.isActing()) {
        this.startMotion('walk');
    } else if (stateMotion === 3) {
        this.startMotion('dead');
    } else if (stateMotion === 2) {
        this.startMotion('sleep');
    } else if (enemy.isGuard() || enemy.isGuardWaiting()) {
        this.startMotion('guard');
    } else if (stateMotion === 1) {
        this.startMotion('abnormal');
    } else if (enemy.isDying()) {
        this.startMotion('dying');
    } else {
        this.startMotion(enemy.idleMotion());
    }
};

Sprite_Enemy.prototype.motionSpeed = function() {
    return Sprite_Actor.prototype.motionSpeed.call(this);
};

Sprite_Enemy.prototype.updateSelectionEffect = function() {
    if (!this._svBattlerEnabled) {
      return Sprite_Battler.prototype.updateSelectionEffect.call(this);
    }
    var target = this._mainSprite;
    if (this._battler.isSelected()) {
        this._selectionEffectCount++;
        if (this._selectionEffectCount % 30 < 15) {
            target.setBlendColor([255, 255, 255, 64]);
        } else {
            target.setBlendColor([0, 0, 0, 0]);
        }
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target.setBlendColor([0, 0, 0, 0]);
    }
};

Sprite_Enemy.prototype.isSideviewCollapse = function() {
    if (!this._svBattlerEnabled) return true;
    return this._enemy.sideviewCollapse();
};

Yanfly.SVE.Sprite_Enemy_updateCollapse = Sprite_Enemy.prototype.updateCollapse;
Sprite_Enemy.prototype.updateCollapse = function() {
    if (!this.isSideviewCollapse()) return;
    Yanfly.SVE.Sprite_Enemy_updateCollapse.call(this);
};

Yanfly.SVE.Sprite_Enemy_updateBossCollapse =
    Sprite_Enemy.prototype.updateBossCollapse;
Sprite_Enemy.prototype.updateBossCollapse = function() {
    if (!this.isSideviewCollapse()) return;
    Yanfly.SVE.Sprite_Enemy_updateBossCollapse.call(this);
};

Yanfly.SVE.Sprite_Enemy_updateInstantCollapse =
    Sprite_Enemy.prototype.updateInstantCollapse;
Sprite_Enemy.prototype.updateInstantCollapse = function() {
    if (!this.isSideviewCollapse()) return;
    Yanfly.SVE.Sprite_Enemy_updateInstantCollapse.call(this);
};

//=============================================================================
// End of File
//=============================================================================
};
