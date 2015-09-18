var objKey = function(obj, key){
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
    .map(objKey)
    .value();
};

var fileName = function(str){
  return str
    .toLowerCase()
    .replace("-","_")
    .replace(".","")
    .replace(" ","_");
};

var byCharacters = function(item){
  return (item.subtitle !== "Basic Action Card");
};

var costs = function(cards){
  return _(cards)
    .sortBy(attr('cost'))
    .map(attr('cost'))
    .uniq()
    .value()
    .join(', ');
};

var character = function(cards, key){
  return {
    name: key,
    type: cards[0].type,
    affiliation: cards[0].affiliation,
    cost: costs(cards),
    thumbnail: fileName(key)
  };
};

var getCharacters = function(cards){
  return _(cards)
    .filter(byCharacters)
    .sortBy(attr('type'))
    .groupBy(attr("cardName"))
    .map(character)
    .value();
};

var characters   = getCharacters(MDM_CARDS);
var affiliations = getAttributes("affiliation");
var types        = getAttributes("type");
var rarities     = getAttributes("rarity");

var render = function(){
  $.each(characters, function(i, character){
    $("#characters").append([
      '<div class="character col-xs-2 type-',fileName(character.type),'">',
      '<img class="img-responsive" src="images/characters/', character.thumbnail ,'.jpg" alt="',character.name,'"/>',
      '</div>'
    ].join(''))
  });
};

render();