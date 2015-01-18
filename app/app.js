var app = angular.module('guildRosterApp', ['ui.bootstrap']);

app.controller('guildRosterCtrl', function ($scope, $http) {

	/* Guild Info */
		$scope.guildName = "Shirley Templars";
		$scope.guildRealm = "Tichondrius";

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
		$http.jsonp('http://us.battle.net/api/wow/realm/status?jsonp=JSON_CALLBACK').success(function(data, status, headers, config) {
			data.realms.map(function(item){
				$scope.realms.push(item.name);
			});
		}).error(function(data, status, headers, config) {
			$scope.errorText = "Can not get realms";
		});
	} /* end getRealms() */

	/**
	* Adds a character
	* @param {string} character - The name of the character
	* @param {string} realm - The name of the character's realm
	*/
	$scope.addCharacter = function(character, realm){
		$http.jsonp("http://us.battle.net/api/wow/character/"+realm+"/"+character+"?fields=items,talents,statistics,progression&jsonp=JSON_CALLBACK").success(function(data, status, hearders, config){
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