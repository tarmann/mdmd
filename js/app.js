var byKey = function(obj, key){
  return key;
};

var attr = function(value){
  return function(item){
    return item[value];
  };
};

var getAttributes = function(attribute){
  return _(MDM_CARDS)
    .groupBy(attr(attribute))
    .map(byKey)
    .value();
};

var characters   = getAttributes("cardName");
var affiliations = getAttributes("affiliation");
var types        = getAttributes("type");
var rarities     = getAttributes("rarity");

console.log(characters);
console.log(affiliations);
console.log(types);
console.log(rarities);