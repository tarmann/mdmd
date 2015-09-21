(function(){

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

  var byCardName = function(cardName){
    return function(item){
      return item.cardName === cardName;
    };
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

  var getCards = function(cardName){
    return _(MDM_CARDS)
        .filter(byCardName(cardName))
        .value();
  };

  var characters   = getCharacters(MDM_CARDS);
  var affiliations = getAttributes("affiliation");
  var types        = getAttributes("type");
  var rarities     = getAttributes("rarity");

  var render = function(){
    $.each(characters, function(i, character){
      $("#characters").append([
        '<div class="character" data-name="', character.name ,'">',
          '<div class="character-inner">',
            '<div class="character-costs">', character.cost, '</div>',
            '<div class="character-type">',
              '<img class="img-responsive" src="images/types/', fileName(character.type) ,'.png" alt="',character.type,'"/>',
            '</div>',
            '<div class="character-thumb" style="background-image: url(images/characters/', character.thumbnail ,'.jpg)"></div>',
          '</div>',
        '</div>'
      ].join(''));
    });
  };

  var classes = ["select-red", "select-banned", "select-blue"];

  var toggleClass = function () {
    var classNum = $(this).data("classNum") || 0;
    $(this).removeClass(classes[classNum]);
    classNum = (classNum + 1)  % classes.length;
    $(this).addClass(classes[classNum]);
    $(this).data("classNum", classNum);
  };

  var renderCards = function(cardName){
    var cards = getCards(cardName);

    $("#cards").html('');

    $.each(cards, function(i, character){
      $("#cards").append([
        '<div class="card">',
          '<img src="images/cards/', character.id ,'.jpg" />',
        '</div>'
      ].join(''));
    });
  };

  var showCards = function(e){
    renderCards( $(e.currentTarget).attr('data-name') );
    $("#cards").show();
  };

  var hideCards = function(){
    $('#cards').hide();
  };

  var bindEvents = function(){
    $(".character").click(toggleClass);
    $(".character").hover(showCards, hideCards);
  };

  render();
  bindEvents();

})();