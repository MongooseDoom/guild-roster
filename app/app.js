var app = angular.module('shirleyTemplarsApp', []);

app.controller('armoryCtrl', function ($scope, $http) {
	$scope.toons = [
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
	{name: 'Flatugen'}
	];
	$scope.orderByField = 'name';
	$scope.reverseSort = false;
	$scope.toonRealm = "Tichondrius";
	$scope.iLvlThreshold = 625;
	$scope.ringThreshold = 680;

	angular.forEach($scope.toons, function(toon, index) {
		$http.jsonp("http://us.battle.net/api/wow/character/"+$scope.toonRealm+"/"+toon.name+"?fields=items,talents,statistics,progression&jsonp=JSON_CALLBACK").
		success(function(data, status, hearders, config){
			toon.class = data.class;
			toon.className = returnClassName(data.class);
			toon.primarySpec = data.talents[0].spec.role.toLowerCase();
			toon.secondarySpec = data.talents[1].spec.role.toLowerCase();
			toon.level = data.level;
			toon.ilevel = data.items.averageItemLevelEquipped;
			toon.ilevelThreshold = returnThreshold(toon.ilevel);
			toon.maxRing = Math.max(data.items.finger1.itemLevel, data.items.finger2.itemLevel);
			toon.maxRingThreshold = returnMaxRing(toon.maxRing);
			console.log(data);

			var giftindex = [5310, 5317, 5311, 5324, 5318, 5325, 5312, 5319, 5326, 5313, 5320, 5327, 5314, 5321, 5328],
			breathindex = [5281, 5285, 5284, 5298, 5292, 5297, 5300, 5293, 5299, 5302, 5294, 5301, 5304, 5295, 5303]

			var enchantsByItem = function(item){
				if (item) {
					var enchant
					if (giftindex.indexOf(item.tooltipParams["enchant"]) > -1) {
						enchant = "gift"
					} else if (breathindex.indexOf(item.tooltipParams["enchant"]) > -1) {
						enchant = "breath"
					} else {
						enchant = "none"
					}
				}
				else { enchant = "none" }
					return enchant
			}

			if (data.items.mainHand) {
				var wepchantID = data.items.mainHand.tooltipParams["enchant"]
				switch (wepchantID) {
					case 5336:
					case 5335:
					case 5334:
					case 5331:
					case 5276:
					case 5275:
					case 5383:
					case 5330:
					case 5337:
					case 5384:
						toon.mhEnchant = "gift"
						break;
					default:
						toon.mhEnchant = "none"
				}
				if (data.class == 6) {toon.mhEnchant = "gift"}
			} else { toon.mhEnchant = "" }

			toon.head = data.items.head.itemLevel;
			toon.headQuality = data.items.head.quality;
			toon.headId = data.items.head.id;

			toon.neck = data.items.neck.itemLevel;
			toon.neckQuality = data.items.neck.quality;
			toon.neckId = data.items.neck.id;
			toon.neckEnchant = enchantsByItem(data.items.neck);

			toon.shoulder = data.items.shoulder.itemLevel;
			toon.shoulderQuality = data.items.shoulder.quality;
			toon.shoulderId = data.items.shoulder.id;

			toon.back = data.items.back.itemLevel;
			toon.backQuality = data.items.back.quality;
			toon.backId = data.items.back.id;
			toon.backEnchant = enchantsByItem(data.items.back);

			toon.chest = data.items.chest.itemLevel;
			toon.chestQuality = data.items.chest.quality;
			toon.chestId = data.items.chest.id;

			toon.wrist = data.items.wrist.itemLevel;
			toon.wristQuality = data.items.wrist.quality;
			toon.wristId = data.items.wrist.id;

			toon.hands = data.items.hands.itemLevel;
			toon.handsQuality = data.items.hands.quality;
			toon.handsId = data.items.hands.id;

			toon.waist = data.items.waist.itemLevel;
			toon.waistQuality = data.items.waist.quality;
			toon.waistId = data.items.waist.id;

			toon.legs = data.items.legs.itemLevel;
			toon.legsQuality = data.items.legs.quality;
			toon.legsId = data.items.legs.id;

			toon.feet = data.items.feet.itemLevel;
			toon.feetQuality = data.items.feet.quality;
			toon.feetId = data.items.feet.id;

			toon.ring1 = data.items.finger1.itemLevel;
			toon.ring1Quality = data.items.finger1.quality;
			toon.ring1Id = data.items.finger1.id;
			toon.ring1Enchant = enchantsByItem(data.items.finger1);

			toon.ring2 = data.items.finger2.itemLevel;
			toon.ring2Quality = data.items.finger2.quality;
			toon.ring2Id = data.items.finger2.id;
			toon.ring2Enchant = enchantsByItem(data.items.finger2);

			toon.trinket1 = data.items.trinket1.itemLevel;
			toon.trinket1Quality = data.items.trinket1.quality;
			toon.trinket1Id = data.items.trinket1.id;

			toon.trinket2 = data.items.trinket2.itemLevel;
			toon.trinket2Quality = data.items.trinket2.quality;
			toon.trinket2Id = data.items.trinket2.id;

			toon.mh = data.items.mainHand.itemLevel;
			toon.mhQuality = data.items.mainHand.quality;
			toon.mhId = data.items.mainHand.id;

			if (data.items.offHand) {
				toon.oh = data.items.offHand.itemLevel;
				toon.ohQuality = data.items.offHand.quality;
			} else {
				toon.oh = "";
				toon.ohQuality = "";
			}

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

			var highmaul = killsforRaidId(32);
			toon.highmaulNormal = highmaul[0];
			toon.highmaulHeroic = highmaul[1];
			toon.highmaulMythic = highmaul[2];

		}).
error(function(data, status, hearders, config){
    			//log error
    		});
});



function returnThreshold(ilvl){
	if (ilvl >= $scope.iLvlThreshold) {
		return "success";
	} else {
		return "danger";
	}
}

function returnMaxRing(ilvl){
	if (ilvl >= $scope.ringThreshold) {
		return "success";
	} else {
		return "danger";
	}
}

function returnClassName(classId){
	var classArray = ["","warrior","paladin","hunter","rogue","priest","death-knight","shaman","mage","warlock","monk","druid"];
	return classArray[classId];
}
});