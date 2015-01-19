var app = angular.module('guildRosterApp', ['ui.bootstrap']);

app.controller('guildRosterCtrl', function ($scope, $http) {

	/* Guild Info */
		$scope.guildName = "Shirley Templars";
		$scope.guildRealm = "Tichondrius";
		$scope.region = "us"; /* http://blizzard.github.io/api-wow-docs/#localization */

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
			{name: 'Bananacake'},
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

		/* sort */
		$scope.orderByField = 'ilevel';
		$scope.reverseSort = true;

		/* ilvl thresholds */
		$scope.iLvlThreshold = 625;
		$scope.ringThreshold = 680;

		/* forms */
		$scope.formRealm = $scope.guildRealm;
		$scope.realms = [];


	/**
	* Gets all US WoW Realms
	*/
	$scope.getRealms = function(){
		$http.jsonp('http://'+$scope.region+'.battle.net/api/wow/realm/status?jsonp=JSON_CALLBACK').success(function(data, status, headers, config) {
			data.realms.map(function(item){
				$scope.realms.push(item.name);
			});
		}).error(function(data, status, headers, config) {
			$scope.errorText = "Can not get realms";
		});
	} /* end getRealms() */

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
		$http.jsonp("http://"$scope.region".battle.net/api/wow/character/"+realm+"/"+character+"?fields=items,talents,statistics,progression&jsonp=JSON_CALLBACK").success(function(data, status, hearders, config){
					data.ilevelThreshold = returnThreshold(data.items.averageItemLevelEquipped);
					function returnThreshold(ilvl){
						if (ilvl >= $scope.iLvlThreshold) {
							return "success";
						} else {
							return "danger";
						}
					}
					data.maxRing = function(){
						return Math.max(data.items.finger1.itemLevel, data.items.finger2.itemLevel);
					}
					if (!data.items.offHand) {
						data.items.offHand = "";
						data.items.offHand.itemLevel = "";
						data.items.offHand.quality = "";
					}

				$scope.characters.push(data);
				console.log(data);
		}).error(function(data, status, hearders, config){
    			$scope.errorText = "Can not get character";
    	}); // end jsonp()
	}; /* end addCharacter() */

	/**
	* Removes a character
	* @param {string} character - The name of the character
	* @param {string} realm - The name of the character's realm
	*/
	$scope.removeCharacter = function(character, realm){
		$scope.characters.splice($scope.characters.indexOf(name), 1);
	}; /* end removeCharacter() */

	/**
	* Start this shit
	*/
	$scope.getRealms();
	angular.forEach($scope.guildMembers, function(member, index) {
		$scope.addCharacter(member.name, $scope.guildRealm);
	});


}); /* end app.controller */