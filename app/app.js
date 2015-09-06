var app = angular.module('guildRosterApp', ['ui.bootstrap', 'angular-loading-bar']);

app.controller('guildRosterCtrl', function ($scope, $http) {

	/* Guild Info */
		$scope.guildName = "Shirley Templars";
		$scope.guildRealm = "Tichondrius";
		/* http://blizzard.github.io/api-wow-docs/#localization */
		$scope.regionHost = "us.battle.net";
		$scope.regionLocale = "en_US";
		$scope.guildList = 'raid';

	/* Member Info */
		$scope.guildMembers = [
			{name: 'Gankymcstab'},
			{name: 'Maralina'},
			{name: 'Kartekk'},
			{name: 'Tirial'},
			{name: 'Sunflowers'},
			{name: 'Alexithymia'},
			{name: 'Heartgold'},
			{name: 'Goradra'},
			{name: 'Yrlokami'},
			{name: 'Altrouge'},
			{name: 'Aphidy'}
		];
		$scope.characters = [];

	/* General Info */
		$scope.raids = ['HM','BRF',"HC"]
		$scope.errorText = '';
		$scope.raid = $scope.raids[2];
		$scope.raidNormal = 'hcNormal';
		$scope.raidHeroic = 'hcHeroic';
		$scope.raidMythic = 'hcMythic';

		/* sort */
		$scope.orderByField = 'items.averageItemLevelEquipped';
		$scope.reverseSort = true;

		/* ilvl thresholds */
		$scope.iLvlHM = 625;
		$scope.iLvlBRF = 645;
		$scope.iLvlHC = 670;

		$scope.iLvlThreshold = $scope.iLvlHC;
		$scope.ringThreshold = 735;

		/* forms */
		$scope.formRealm = $scope.guildRealm;
		$scope.realms = [];


	/**
	* Gets all US WoW Realms
	*/
	$scope.getRealms = function(){
		$http.jsonp("http://"+$scope.regionHost+"/api/wow/realm/status?locale="+$scope.regionLocale+"&jsonp=JSON_CALLBACK").success(function(data, status, headers, config) {
			data.realms.map(function(item){
				$scope.realms.push(item.name);
			});
		}).error(function(data, status, headers, config) {
			$scope.errorText = "Can not get realms";
		});
	} /* end getRealms() */

	/**
	* Creates character list
	* @param {array} characters - Array of character names
	*/
	$scope.createCharacterList = function(characters){
		$scope.characters = [];
		if (characters) {
			angular.forEach($scope.guildMembers, function(member, index) {
				$scope.addCharacter(member.name, $scope.guildRealm);
			});
		} else {
			$scope.getGuildList();
		}
	}; /* end createCharacterList() */

	/**
	* Creates character list based on all guild members over lvl 100
	*/
	$scope.getGuildList = function(){
		$http.jsonp("http://"+$scope.regionHost+"/api/wow/guild/"+$scope.guildRealm+"/"+$scope.guildName+"?fields=members&jsonp=JSON_CALLBACK").success(function(data, status, hearders, config){
			angular.forEach(data.members, function (member, index) {
				if (member.character.level >= 100) {
					$scope.addCharacter(member.character.name, $scope.guildRealm);
				}
			});
		}).error(function(data, status, hearders, config){
			$scope.errorText = "Can not load guild";
		}); // end jsonp()
	}; /* end getGuildList() */

	/**
	* Checks item for enchant
	* @param {object} item - Item with enchant
	*/
	$scope.getEnchant = function(item){
		/* Enchants */
		var giftindex = [5310, 5317, 5311, 5324, 5318, 5325, 5312, 5319, 5326, 5313, 5320, 5327, 5314, 5321, 5328];
		var breathindex = [5281, 5285, 5284, 5298, 5292, 5297, 5300, 5293, 5299, 5302, 5294, 5301, 5304, 5295, 5303];
		var wepchantID = [5336, 5335, 5334, 5331, 5276, 5275, 5383, 5330, 5337, 5384];

		if (item) {
			var enchant;
			if (giftindex.indexOf(item.tooltipParams["enchant"]) > -1 || wepchantID.indexOf(item.tooltipParams["enchant"]) > -1) {
				enchant = "gift";
			} else if (breathindex.indexOf(item.tooltipParams["enchant"]) > -1) {
				enchant = "breath";
			} else {
				enchant = "none";
			}
		} else {
			enchant = "none";
		}
			return enchant;
	}  /* end getEnchant() */

	/**
	* Checks item for gems
	* @param {object} item - Item with gems
	*/
	$scope.getGems = function(item){
		/* Gems */
		var goodGems = [115815, 115814, 115809, 115811, 115812, 115813];
		var badGems = [115807, 115805, 115803, 115804, 115806, 115808];

		if (item.tooltipParams && item.tooltipParams["gem0"]) {
			var gem;
			if (goodGems.indexOf(item.tooltipParams["gem0"]) > -1) {
				gem = "good-gem";
			} else if (badGems.indexOf(item.tooltipParams["gem0"]) > -1) {
				gem = "bad-gem";
			} else {
				gem = "no-gem";
			}
		} else {
			gem = "";
		}
			return gem;
	}  /* end getGems() */

	/**
	* Adds a character
	* @param {string} character - The name of the character
	* @param {string} realm - The name of the character's realm
	*/
	$scope.addCharacter = function(character, realm){
		$http.jsonp("http://"+$scope.regionHost+"/api/wow/character/"+realm+"/"+character+"?locale="+$scope.regionLocale+"&fields=items,talents,statistics,progression&jsonp=JSON_CALLBACK").success(function(data, status, hearders, config){
				var killsforRaidId = function(raid_id){
					var normal = 0,
					heroic = 0,
					mythic = 0;

					data.progression.raids[raid_id].bosses.forEach(function(boss){
						normal += boss.normalKills
						heroic += boss.heroicKills
						mythic += boss.mythicKills
					})
					return [normal, heroic, mythic]
				}

				/* Extra character data for chart */
				data.maxRing = Math.max(data.items.finger1.itemLevel, data.items.finger2.itemLevel);
				if (!data.items.offHand) {
					data.items.offHand = "";
					data.items.offHand.itemLevel = "";
					data.items.offHand.quality = "";
					data.items.offHand.tooltipParams = "";
				}

				/* Raid kills */
				var highmaul = killsforRaidId(32);
				data.highmaul = [];
				data.highmaul[0] = highmaul[0];
				data.highmaul[1] = highmaul[1];
				data.highmaul[2] = highmaul[2];

				var brf = killsforRaidId(33);
				data.brf = [];
      			data.brf[0] = brf[0];
      			data.brf[1] = brf[1];
      			data.brf[2] = brf[2];

				var hc = killsforRaidId(34);
				data.hc = [];
      			data.hc[0] = hc[0];
      			data.hc[1] = hc[1];
      			data.hc[2] = hc[2];

      			data.roles = (data.talents[0].spec.role == data.talents[1].spec.role) ? data.talents[0].spec.role : data.talents[0].spec.role + ', ' + data.talents[1].spec.role;

      			/* Add to characters */
				$scope.characters.push(data);
		}).error(function(data, status, hearders, config){
    			$scope.errorText = "Could not load "+character+" - "+realm;
    	}); // end jsonp()
	}; /* end addCharacter() */

	/**
	* Removes a character
	* @param {object} character - The character in $scope.characters to remove
	*/
	$scope.removeCharacter = function(character){
		var index = $scope.characters.indexOf(character);
		if (index != -1) {
			$scope.characters.splice(index, 1);
		}
	}; /* end removeCharacter() */


	/**
	* Start this shit
	*/
	$scope.getRealms();
	$scope.createCharacterList($scope.guildMembers);


}); /* end app.controller */
