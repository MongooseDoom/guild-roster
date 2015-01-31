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
			{name: 'Captnamerica'},
			{name: 'Altrouge'},
			{name: 'Tilias'},
			{name: 'Heartgold'},
			{name: 'Kamihy'},
			{name: 'Vectron'},
			{name: 'Memedom'},
			{name: 'Mavester'},
			{name: 'Sackotaterz'},
			{name: 'Wroughtiron'},
			{name: 'Tatersakk'},
			{name: 'Faerietta'},
			{name: 'Flatugen'},
			{name: 'Saluja'}
		];
		$scope.characters = [];

	/* General Info */
		$scope.errorText = '';
		$scope.raid = 'HM';

		/* sort */
		$scope.orderByField = 'items.averageItemLevelEquipped';
		$scope.reverseSort = true;

		/* ilvl thresholds */
		$scope.iLvlHM = 625;
		$scope.iLvlBRF = 655;

		$scope.iLvlThreshold = $scope.iLvlHM;
		$scope.ringThreshold = 680;

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
				}

				/* Raid kills */
				var highmaul = killsforRaidId(32);
				data.highmaulNormal = highmaul[0];
				data.highmaulHeroic = highmaul[1];
				data.highmaulMythic = highmaul[2];

				var brf = killsforRaidId(33);
      			data.brfNormal = brf[0];
      			data.brfHeroic = brf[1];
      			data.brfMythic = brf[2];

      			/* Add to characters */
				$scope.characters.push(data);
		}).error(function(data, status, hearders, config){
    			$scope.errorText = "Can not get character";
    	}); // end jsonp()
	}; /* end addCharacter() */

	/**
	* Removes a character
	* @param {number} index - The index of the character in $scope.characters
	*/
	$scope.removeCharacter = function(index){
		$scope.characters.splice(index, 1);
	}; /* end removeCharacter() */


	/**
	* Start this shit
	*/
	$scope.getRealms();
	$scope.createCharacterList($scope.guildMembers);


}); /* end app.controller */