/* THESE ARE THE SECOND PAGE FUNCTIONS */

console.log("the game has loaded!");

/// Grabbing the "Let's Play" button, adding an event listener to it and executing the letsPlay function ///

var lets_play_button = document.getElementById('lets_play_button');
lets_play_button.addEventListener('click', letsPlay);

/// Setting the initial player to be Tony (at the start of the game) so that the game starts with "The Player" ///

function letsPlay() {
  document.getElementById('game_table').style.display = 'block';
  setInitialPlayer();
}



/// --------------------------------------------------------------------------------------------------------------------------------------------- ///



/// Defining all the needed variables ///

var players = {
  player: {
    points: 50000,
    cards: [],
    currentBet: 0,
    fold: false
  },
  daniel: {
    points: 50000,
    cards: [],
    currentBet: 0,
    fold: false
  },
  andrew: {
    points: 50000,
    cards: [],
    currentBet: 0,
    fold: false
  },
  tony: {
    points: 50000,
    cards: [],
    currentBet: 0,
    fold: false
  },
};

var firstPlayer

var round = 1;

var pot = 0;

var muck = [];

var minimum = 500;

var callAmount = minimum;

var lastPersonToBet = "player";

var dealer = {
  pile:      [],
  upCards:   [],
  turnCard:  null,
  riverCard: null
};

var deck = [
  "sA", "sK", "sQ", "sJ", "s10", "s09", "s08", "s07", "s06", "s05", "s04", "s03", "s02",
  "cA", "cK", "cQ", "cJ", "c10", "c09", "c08", "c07", "c06", "c05", "c04", "c03", "c02",
  "dA", "dK", "dQ", "dJ", "d10", "d09", "d08", "d07", "d06", "d05", "d04", "d03", "d02",
  "hA", "hK", "hQ", "hJ", "h10", "h09", "h08", "h07", "h06", "h05", "h04", "h03", "h02"
];

var choicesArray = ['check()', 'call()', 'raise()', 'fold()'];

var house = [];

/*var roundWinner = bestHand;
/*function cardComparison() {
  "sA" || "cA" || "dA" || "hA" >
  "sK" || "cK" || "dK" || "hK" >
  "sQ" || "cQ" || "dQ" || "hQ" >
  "sJ" || "cJ" || "dJ" || "hJ" >
  "s10" || "c10" || "d10" || "h10" >
  "s9" || "c9" || "d9" || "h9" >
  "s8" || "c8" || "d8" || "h8" >
  "s7" || "c7" || "d7" || "h7" >
  "s6" || "c6" || "d6" || "h6" >
  "s5" || "c5" || "d5" || "h5" >
  "s4" || "c4" || "d4" || "h4" >
  "s3" || "c3" || "d3" || "h3" >
  "s2" || "c2" || "d2" || "h2";
}
function highCard() {
}*/



//// ------------------------------------------------------------------------------------------------------------------------------------------ ///



/// Setting a round of betting in motion and advancing it ///

$('.bet_button').click(function () {
  roundOfBetting()
  advanceRound()
});

/// Grabbing the id's of the points divs and setting their value to display what each player's running point total is ///

document.getElementById('playerspoints').innerHTML = players.player.points;

document.getElementById('danielspoints').innerHTML = players.daniel.points;

document.getElementById('andrewspoints').innerHTML = players.andrew.points;

document.getElementById('tonyspoints').innerHTML = players.tony.points;

/// Grabbing the move buttons (for the Player) and adding event listeners on them ///

document.getElementById('check_button').addEventListener('click', check);

document.getElementById('call_button').addEventListener('click', call);

document.getElementById('raise_button').addEventListener('click', raise);

document.getElementById('fold_button').addEventListener('click', fold);



/// ---------------------GAME FLOW FUNCTIONS------------------------------------------------------------------------------------------------------------------------------------------------------ ///



/// Setting the initial player ///

function setInitialPlayer() {
    lastPersonToBet = 'tony';
    startGame();
    console.log('starting the game - setting the player to be "player", creating a new pile, dealing cards, ante"ing up and continuing to bet');
}

/// Creating a function that executes some of the other functions that involve initial moves ///

function startGame() {
  createNewPile();
  dealStartCards();
  anteUp();
  roundOfBetting();
  console.log('started the game and executed a new pile, dealt the cards and posted small/big blinds');
}

/// Taking the deck file (that's imported) and shuffling it ///

function createNewPile() {
  dealer.pile = _.shuffle(deck);
  console.log('shuffling the deck');
}

/// Dealing the initial two cards to each player and removing the back of the card (that's visible) and revelaing the cards right off the bat for the Player only ///

function dealStartCards() {
  var playerCard1 = dealCard()
  var playerCard2 = dealCard()
  players.player.cards.push(playerCard1);
  players.daniel.cards.push(dealCard());
  players.andrew.cards.push(dealCard());
  players.tony.cards.push(dealCard());
  players.player.cards.push(playerCard2);
  players.daniel.cards.push(dealCard());
  players.andrew.cards.push(dealCard());
  players.tony.cards.push(dealCard());
  $('#player .card').removeClass('back')
  $('#player .card').first().addClass(playerCard1)
  $('#player .card').last().addClass(playerCard2)
  console.log('removing the back, adding the front dealing the two cards for player');
}

/// Excecuting the small and the big blind functions ///

function anteUp() {
  smallBlind();
  bigBlind();
  console.log('posting the small/big blinds');
}

/// Looking at who the current player is and moving on to the next one ///

function nextPlayer() {
  if (lastPersonToBet === "player") {
    lastPersonToBet = "daniel";
  } else if (lastPersonToBet === "daniel") {
    lastPersonToBet = "andrew";
  } else if (lastPersonToBet === "andrew") {
    lastPersonToBet = "tony";
  } else if (lastPersonToBet === "tony") {
    lastPersonToBet = "player";
  }
  if (players[lastPersonToBet].fold === true) {
    return nextPlayer();
  }
  return lastPersonToBet;
}

/// Taking the player and their points, subtracting the points from the player, adding them to the pot, changing the value of the pot string and adding the value to the players current running betting total ///

function bet(playerName, points) {
  console.log(playerName);
  players[playerName].points -= points;
  pot += points;
  document.getElementById('pot').innerHTML = pot;
  players[playerName].currentBet += points;

  if (playerName == 'player') {
    document.getElementById('playerspoints').innerHTML = players.player.points;
  } else if (playerName == 'daniel') {
    document.getElementById('danielspoints').innerHTML = players.daniel.points;
  } else if (playerName == 'andrew') {
    document.getElementById('andrewspoints').innerHTML = players.andrew.points;
  } else if (playerName == 'tony') {
    document.getElementById('tonyspoints').innerHTML = players.tony.points;
  }
  console.log('bet a certain amount');
}

/// Showing the first three community cards ///

function flopReveal () {
  if (areAllBetsSame == true &&
    players.player.fold == true ||
    players.daniel.fold == true ||
    players.andrew.fold == true ||
    players.tony.fold == true) {
    dealer.upcards.push(dealCard());
    dealer.upcards.push(dealCard());
    console.log('revealed the first three cards');
  }
}

function roundOfBetting() {
  while (!isEveryoneFolded() && !areAllBetsSame() && !isPlayerTurn()) {
      keepBetting();
      aI();
  }
  if (areAllBetsSame())
    advanceRound();
  if (isEveryoneFolded()) {
    endRound();
  }
}

/// Asking if it's the Player's turn ///

function isPlayerTurn() {
  if (players['player'].fold)
    return false
  if (lastPersonToBet == 'tony')
    return true
  if (lastPersonToBet == 'andrew' && players['tony'].fold)
    return true
  if (lastPersonToBet == 'daniel' && players['andrew'].fold && players['tony'].fold)
    return true
  return false
}

/// Asking "Are all the bets in and has everyone matched. If that's the case, advance round. If that's not the case, keep"

function hasEveryoneBet() {
  if (areAllBetsSame && players.player.currentBet == players.daniel.currentBet == players.andrew.currentBet == players.tony.currentBet == true) {
    dealFlop();
    moveSmallBlind();
    advanceRound();
  } else if (areAllBetsSame == false) {
    keepBetting();
  }
}

function keepBetting() {
  if (lastPersonToBet === "player" ||
    lastPersonToBet === 'daniel' ||
    lastPersonToBet === 'andrew' ||
    lastPersonToBet === 'tony' &&
    areAllBetsSame === false) {
    aI();
    nextPlayer();
    bet();
  } else {
    dealFlop();
  }
}

/// Dealing the flop cards (first three community cards) ///

function dealFlop() {
  var house1 = dealCard();
  $('#upcard1').addClass(house1);
  house.push(house1);
  var house2 = dealCard();
  $('#upcard2').addClass(house2);
  house.push(house2);
  var house3 = dealCard();
  $('#upcard3').addClass(house3);
  house.push(house3);
  roundOfBetting()
}

/// Advancing Rounds before the showdown ///

function advanceRound() {
  if (roundOfBetting == 1 && areAllBetsSame === true) {
    roundOfBetting = 2
    dealFlop();
    moveSmallBlind();
  } else if (roundOfBetting == 2 && areAllBetsSame === true) {
    roundOfBetting = 3
    dealTurn();
    moveSmallBlind();
  } else if (roundOfBetting == 3 && areAllBetsSame === true) {
    roundOfBetting = 4
    dealRiver();
    moveSmallBlind();
    roundOfBetting();
    winningHand();
  }
}

/// 1. Create a function that determines the winning hand
/// 2. Call that function upon completion of the final round of betting
/// 3. Display an indication of who has won the game

/// Saying "if everyone did not fold, not everyone matched and it's not the Player's turn and executing the AI function"
/// Also saying "everyone matched than advance to the next round" and "if everyone folded, to end the round"
/// when you start a new round of betting and there is no ante
/// determine a logic when to stop betting
/// everyone that's still in the game has a chance to make a betting action at least once
/// on top of that all the bets must be the same (match)
/// function hasEveryoneBet()
/// true or false
/// if everyone has not bet the round of betting continues
/// ORRRRR... can skip and just make sure that the win logic is executed upon one/first round

function endRound () {
  round = false;
  advanceRound();
  alert("GAME OVER. EVERYONE FOLDED!")
}

/// Dealing the turn (the fourth community card) ///

function dealTurn () {
  var house4 = dealCard();
  $('#turn').addClass(house4);
  house.push(house4);
  roundOfBetting()
}

/// Dealing the river (fifth community card) ///

function dealRiver() {
  var house5 = dealCard();
  $('#river').addClass(house5);
  house.push(house5);
  roundOfBetting()
}

/// Asking "Has everyone folded". If it's true than return "Everyone folded" ///

function isEveryoneFolded () {
  var allFolded = true;
  $.each(players, function (key, player) {
    if (!player.fold)
      allFolded = false
  })
  return allFolded
} console.log('everyone folded');

/// Asking if everyone has matched ///

/*function areAllBetsSame () {
  var same = true
  var remaining = remainingPlayers()
  if (remaining.length == 0)
    return true
  remaining.forEach(function (player, i) {
    if (i != 0 && player.currentBet != remaining[0].currentBet)
      same = false
  })
  return same
} console.log('all bets are the same')*/

function areAllBetsSame() {
  if (players.player.currentBet == players.daniel.currentBet == players.andrew.currentBet == players.tony.currentBet) {
    dealFlop();
  }
}

///  ///

function remainingPlayers () {
  var remaining = []
  $.each(players, function (key, player) {
    if (!player.fold)
      remaining.push(player)
  })
  return remaining
}

/// Executing a choice by AI from the above array with choices ///

function aI() {
  var value = choicesArray[Math.floor(Math.random() * choicesArray.length)];
  console.log(value)
  eval(value);
  if (raise() == true) {
    Math.random(points);
  }
  console.log('choosing from the choices array for AI');
}

/* ----------------------------------------MOVE FUNCTIONS----------------------------------------------------------------------------------------------------------------------- */

/// The function that makes sure a player hasn't bet any points and defers turn to the next player ///

function check() {
  return nextPlayer();
  if (lastPersonToBet = call() || raise()) {
    check() = false;
  }
  if (areAllBetsSame != true) {
    aI();
  }
} console.log('checking')

/// Function that matches the points from the previous player ///

function call() {
  var player = nextPlayer();
  bet(player, callAmount - players[player].currentBet);
} console.log('matching')

/// The function (primarily for the Player at this point) where the Player can enter some amount of points and bet it as a raise ///

function raise() {
  var raiseAmount = parseInt(document.getElementById('input_field').value);
  var player = nextPlayer();
  callAmount += raiseAmount;
  var betAmount = callAmount - players[player].currentBet;
  console.log(betAmount, callAmount);
  bet(player, betAmount);
} console.log('raising')

/// Folding the cards and throwing them into the muck var ///

function fold() {
  var player = nextPlayer()
  document.getElementById(player).style.color = 'red';
  muckCards(player);
  $('#player .card').removeClass('back');
} console.log('folding')

/* RANDOM FUNCTIONS */

/// Betting have the minimum 500 points (250) ///

function smallBlind() {
  bet(nextPlayer(), minimum/2);
}

/// Betting the set 500 point minimum ///

function bigBlind() {
  bet(nextPlayer(), minimum);
}

/// The dealer throwing out two cards to each player ///

function dealCard() {
  return dealer.pile.pop();
}

function moveSmallBlind() {
  if (lastPersonToBet === "player" && areAllBetsSame === true) {
    lastPersonToBet = 'player';
  } else if (lastPersonToBet === "daniel" && areAllBetsSame === true) {
    lastPersonToBet = 'daniel';
  } else if (lastPersonToBet === "andrew" && areAllBetsSame === true) {
    lastPersonToBet = 'andrew';
  } else if (lastPersonToBet === "tony" && areAllBetsSame === true) {
    lastPersonToBet = 'tony';
  } console.log('moving the small blind to the next person')
}

/// The representation for the much pile where folded cards end up ///

function muckCards(currentPlayer) {
  players[currentPlayer].fold = true;
  muck.push(currentPlayer.cards);
} console.log('mucking the cards')

/*function getRandomInt(min, max) {
  return Math.floor((Math.random()*50000) + 1);
}*/

/* -------------------------------------------------------------END OF FUNCTIONS----------------------------------------------------------------------------------------------- */





































/*function winningHand() {
  hands=["4 of a Kind", "Straight Flush", "Straight", "Flush", "High Card",
       "1 Pair", "2 Pair", "Royal Flush", "3 of a Kind", "Full House" ];
  var A=14, K=13, Q=12, J=11, _ = { "♠":1, "♣":2, "♥":4, "♦":8 };
  //Calculates the Rank of a 5 card Poker hand using bit manipulations.
  function rankPokerHand(cs,ss) {
    var v, i, o, s = 1<<cs[0]|1<<cs[1]|1<<cs[2]|1<<cs[3]|1<<cs[4];
    for (i=-1, v=o=0; i<5; i++, o=Math.pow(2,cs[i]*4)) {v += o*((v/o&15)+1);}
    v = v % 15 - ((s/(s&-s) == 31) || (s == 0x403c) ? 3 : 1);
    v -= (ss[0] == (ss[1]|ss[2]|ss[3]|ss[4])) * ((s == 0x7c00) ? -5 : 1);
    document.write("Hand: " + hands[v] + (s == 0x403c?" (Ace low)":"")+"<br/>");
  }
  rankPokerHand([10, J, Q, K, A], [ _["♠"], _["♠"], _["♠"], _["♠"], _["♠"] ] ); // Royal Flush
  rankPokerHand([ 4, 5, 6, 7, 8], [ _["♠"], _["♠"], _["♠"], _["♠"], _["♠"] ] ); // Straight Flush
  rankPokerHand([ 2, 3, 4, 5, A], [ _["♠"], _["♠"], _["♠"], _["♠"], _["♠"] ] ); // Straight Flush
  rankPokerHand([ 8, 8, 8, 8, 9], [ _["♠"], _["♣"], _["♥"], _["♦"], _["♠"] ] ); // 4 of a Kind
  rankPokerHand([ 7, 7, 7, 9, 9], [ _["♠"], _["♣"], _["♥"], _["♠"], _["♣"] ] ); // Full house
  rankPokerHand([10, J, 6, K, 9], [ _["♣"], _["♣"], _["♣"], _["♣"], _["♣"] ] ); // Flush
  rankPokerHand([10, J, Q, K, 9], [ _["♠"], _["♣"], _["♥"], _["♣"], _["♦"] ] ); // Straight
  rankPokerHand([ 2, 3, 4, 5, A], [ _["♠"], _["♣"], _["♥"], _["♣"], _["♦"] ] ); // Straight
  rankPokerHand([ 4, 4, 4, 8, 9], [ _["♠"], _["♣"], _["♥"], _["♠"], _["♣"] ] ); // 3 of a Kind
  rankPokerHand([ 8, 8, J, 9, 9], [ _["♠"], _["♣"], _["♥"], _["♠"], _["♣"] ] ); // 2 Pair
  rankPokerHand([ 8, 8, 3, 5, 9], [ _["♠"], _["♣"], _["♥"], _["♠"], _["♣"] ] ); // 1 Pair
  rankPokerHand([10, 5, 4, 7, 9], [ _["♠"], _["♣"], _["♥"], _["♠"], _["♣"] ] ); // High Card
  }*/







































/*hands=["4 of a Kind", "Straight Flush", "Straight", "Flush", "High Card",
       "1 Pair", "2 Pair", "Royal Flush", "3 of a Kind", "Full House", "-Invalid-" ];
handRanks = [8,9,5,6,1,2,3,10,4,7,0];
function calcIndex(cs,ss) {
  var v,i,o,s; for (i=-1, v=o=0; i<5; i++, o=Math.pow(2,cs[i]*4)) {v += o*((v/o&15)+1);}
  if ((v%=15)!=5) {return v-1;} else {s = 1<<cs[0]|1<<cs[1]|1<<cs[2]|1<<cs[3]|1<<cs[4];}
  v -= ((s/(s&-s) == 31) || (s == 0x403c) ? 3 : 1);
  return v - (ss[0] == (ss[0]|ss[1]|ss[2]|ss[3]|ss[4])) * ((s == 0x7c00) ? -5 : 1);
}
function getCombinations(k,n) {
    console.log('called getcombinations' + ' ' + k + ' ' + n);
    var result = [], comb = [];
        function next_comb(comb, k, n ,i) {
            if (comb.length === 0) {for (i = 0; i < k; ++i) {comb[i] = i;} return true;}
            i = k - 1; ++comb[i];
            while ((i > 0) && (comb[i] >= n - k + 1 + i)) { --i; ++comb[i];}
            if (comb[0] > n - k) {return false;} // No more combinations can be generated
            for (i = i + 1; i < k; ++i) {comb[i] = comb[i-1] + 1;}
            return true;
        }
    while (next_comb(comb, k, n)) { result.push(comb.slice());}
    return result;
}
function getPokerScore(cs) {
    console.log('called getpokerscore ' + cs);
    var a = cs.slice(), d={}, i;
    for (i=0; i<5; i++) {d[a[i]] = (d[a[i]] >= 1) ? d[a[i]] + 1 : 1;}
    a.sort(function(a,b){return (d[a] < d[b]) ? +1 : (d[a] > d[b]) ? -1 : (b - a);});
    return a[0]<<16|a[1]<<12|a[2]<<8|a[3]<<4|a[4];
}
function showParsedCards(cs,ss) {
    var card, i;
    var suitMap = {"♠":"spades", "♣":"clubs", "♥":"hearts", "♦":"diams"};
    if (cs !== null && ss !== null) {
        if (cs.length == ss.length) {
            for (i=0;i<7;i++) {
                card = document.getElementById("card"+(i+1));
                if (i < 5) {
                    if (i < cs.length && cs.length !== 0) {
                        card.className = "card rank-" + cs[i].toLowerCase() + " " + suitMap[ss[i]];
                        card.getElementsByTagName("span")[0].innerHTML = cs[i];
                        card.getElementsByTagName("span")[1].innerHTML = ss[i];
                    } else {
                        card.className = "card back";
                        card.getElementsByTagName("span")[0].innerHTML = "";
                        card.getElementsByTagName("span")[1].innerHTML = "";
                        if (card.parentNode.tagName == "STRONG") {
                            card.parentNode.parentNode.innerHTML = card.outerHTML;
                        }
                    }
                } else {
                    if (i < cs.length && cs.length !== 0) {
                        card.className = "card rank-" + cs[i].toLowerCase() + " " + suitMap[ss[i]];
                        card.getElementsByTagName("span")[0].innerHTML = cs[i];
                        card.getElementsByTagName("span")[1].innerHTML = ss[i];
                    } else {
                        card.className = "blank";
                        card.getElementsByTagName("span")[0].innerHTML = "";
                        card.getElementsByTagName("span")[1].innerHTML = "";
                        if (card.parentNode.tagName == "STRONG") {
                            card.parentNode.parentNode.innerHTML = card.outerHTML;
                        }
                    }
                }
                if (cs.length < 5) {
                    if (card.parentNode.tagName == "STRONG") {
                        card.parentNode.parentNode.innerHTML = card.outerHTML;
                    }
                }
            }
        }
    } else {
        //Reset the cards
        for (i=0;i<7;i++) {
            card = document.getElementById("card"+(i+1));
            if (i>4 && i<7) {
                card.className = "blank";
                card.getElementsByTagName("span")[0].innerHTML = "";
                card.getElementsByTagName("span")[1].innerHTML = "";
            } else {
                card.className = "card back";
                card.getElementsByTagName("span")[0].innerHTML = "";
                card.getElementsByTagName("span")[1].innerHTML = "";
            }
            if (card.parentNode.tagName == "STRONG") {
                card.parentNode.parentNode.innerHTML = card.outerHTML;
            }
        }
    }
    if (cs === null) {document.getElementById("wrapper").style.width = "425px";}
    if (cs !== null && ss !== null && cs.length <= 7 && cs.length == ss.length)
        {document.getElementById("wrapper").style.width = Math.max(85*cs.length, 425) + "px";}
}
function rankHand(str) {
    var index = 10, winCardIndexes, i ,e;
    showParsedCards(str.match(/(1[0-4]|[2-9]|[J|Q|K|A])/g), str.match(/♠|♣|♥|♦/g));
    if (str.match(/((?:\s*)(10|[2-9]|[J|Q|K|A])[♠|♣|♥|♦](?:\s*)){5,7}/g) !== null) {
        var cardStr = str.replace(/A/g,"14").replace(/K/g,"13").replace(/Q/g,"12")
            .replace(/J/g,"11").replace(/♠|♣|♥|♦/g,",");
        var cards = cardStr.replace(/\s/g, '').slice(0, -1).split(",");
        var suits = str.match(/♠|♣|♥|♦/g);
        if (cards !== null && suits !== null) {
            if (cards.length == suits.length) {
                var o = {}, keyCount = 0, j;
                for (i = 0; i < cards.length; i++) { e = cards[i]+suits[i]; o[e] = 1;}
                for (j in o) { if (o.hasOwnProperty(j)) { keyCount++;}}
                if (cards.length >=5) {
                 if (cards.length == suits.length && cards.length == keyCount) {
                    for (i=0;i<cards.length;i++) { cards[i]-=0; }
                    for (i=0;i<suits.length;i++)
                        { suits[i] = Math.pow(2, (suits[i].charCodeAt(0)%9824)); }
                    var c = getCombinations(5, cards.length);
                    var maxRank = 0, winIndex = 10;
                    for (i=0; i < c.length; i++) {
                         var cs = [cards[c[i][0]], cards[c[i][1]], cards[c[i][2]],
                                   cards[c[i][3]], cards[c[i][4]]];
                         var ss = [suits[c[i][0]], suits[c[i][1]], suits[c[i][2]],
                                   suits[c[i][3]], suits[c[i][4]]];
                         index = calcIndex(cs,ss);
                         if (handRanks[index] > maxRank) {
                             maxRank = handRanks[index];
                             winIndex = index;
                             wci = c[i].slice();
                         } else if (handRanks[index] == maxRank) {
                             //If by chance we have a tie, find the best one
                             var score1 = getPokerScore(cs);
                             var score2 = getPokerScore([cards[wci[0]],cards[wci[1]],cards[wci[2]],
                                                         cards[wci[3]],cards[wci[4]]]);
                             if (score1 > score2) { wci= c[i].slice(); }
                         }
                    }
                    index = winIndex;
                 }
                }
                //Show the best cards if cs.length is less than 7 cards.
                var card;
                if (cards.length <= 7) {
                    for (i=0; i<7; i++) {
                        card = document.getElementById("card"+(i+1));
                        if (wci.indexOf(i) == -1) {
                            //Not in the solution
                            if (card.parentNode.tagName == "STRONG") {
                                card.parentNode.parentNode.innerHTML = card.outerHTML;
                            }
                        } else {
                            //Is in the solution
                            if (card.parentNode.tagName == "LI") {
                                card.outerHTML = "<strong>" + card.outerHTML  + "</strong>";
                            }
                        }
                    }
                }
            }
        }
    }
    document.getElementById("output").innerHTML = "<Big><B>Hand: </B>" + hands[index] + "</Big>";
}
function inputCardSymbolsOnly(e) {
    var chrTyped, chrCode=0, evt=e?e:event;
    if (evt.charCode!==undefined)     { chrCode = evt.charCode; }
    else if (evt.which!==undefined)   { chrCode = evt.which; }
    else if (evt.keyCode!==undefined) { chrCode = evt.keyCode; }
    if (chrCode===0) {chrTyped = 'SPECIAL KEY';}
    else {chrTyped = String.fromCharCode(chrCode);}
    //[test only:] display chrTyped on the status bar
    //document.getElementById("output").innerHTML += chrCode;
    //Setup a collection of substitutions
    var keyMap = {"a":"A", "k":"K", "q":"Q", "j":"J", "A":"A", "K":"K", "Q":"Q", "J":"J",
                  "s":"♠", "c":"♣", "h":"♥", "d":"♦", "S":"♠", "C":"♣", "H":"♥", "D":"♦",
                  "@":"A", "&":"K", "$":"Q", ")":"J", "?":"♠", "!":"♣", "'":"♥", '"':"♦"};
    if (chrTyped in keyMap) {
        evt.returnValue=false; //Super important do not move!!!
        if(document.selection){
          //IE
          var range = document.selection.createRange();
          range.text = keyMap[chrTyped];
            if (evt.preventDefault !== undefined) {evt.preventDefault();}
          // Chrome + FF
          }else if(e.target.selectionStart || e.target.selectionStart == '0'){
                 var start = evt.target.selectionStart;
                 var end = evt.target.selectionEnd;
                 evt.target.value = evt.target.value.substring(0, start) + keyMap[chrTyped] +
                  evt.target.value.substring(end, evt.target.value.length);
                 evt.target.selectionStart = start + 1;
                 evt.target.selectionEnd = start +1;
             }else{
                 evt.target.value += keyMap[chrTyped];
             }
        return false;
    }
    if (chrTyped.match(/\d|\s|SPECIAL/)) { evt.returnValue=true; return true;}
    if (evt.altKey || evt.ctrlKey || chrCode<28) {return true;}
     //Any other input? Prevent the default response:
    if (evt.preventDefault) {evt.preventDefault();}
        evt.returnValue=false;
    return false;
}
function addEventHandler(elem,eventType,handler) {
    if (elem.addEventListener) {elem.addEventListener (eventType,handler,true);}
    else if (elem.attachEvent) {elem.attachEvent ('on'+eventType,handler);}
    else {return 0;}
    return 1;
}
function doRank(e) {
    setTimeout(function() { rankHand(document.getElementById("cardInput").value); }, 0);
}
var isiPad = navigator.userAgent.match(/iPad/i) !== null;
if (isiPad) {
    document.getElementById("cardInput").type = "tel";
    document.getElementById("output").innerHTML= "<small>Use ),$,&,@ to key in J,Q,K,A.<br/>" +
        "Use ?,!,',&quot; to key in suits.</small>";
}
addEventHandler(document.getElementById("cardInput"),'keypress',inputCardSymbolsOnly);
addEventHandler(document.getElementById("cardInput"),'keyup',doRank);
addEventHandler(document.getElementById("cardInput"),'input', doRank);
document.getElementById('cardInput').focus();*/