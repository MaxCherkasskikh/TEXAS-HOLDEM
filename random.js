/*
bet = {
  type:
  amount:
}
​
function bettingRound() {
  actions = {
    "player": false,
    "tony": false,
    "daniel": "check",
    "andrew": false
  }
  betSoFar = {
    "player": 250,
    "tony": 0,
    "daniel": 500,
    "andrew": 0
  }
  currentBet = 500
  canCheck = true
  while (keepBetting(actions))
    next = nextPlayer()
    if (actions[next] != "fold") {
      if (next == "player")
        bet = getPlayerBet(canCheck)
      else
        bet = aI(canCheck)
      end
      if (bet.type == "raise") {
        canCheck = false
        currentBet += bet.amount;
        bet(next, currentBet - betSoFar[next])
        betSoFar[next] = currentBet
      }
      if (bet.type == "call") {
        bet(next, currentBet - betSoFar[next])
        betSoFar[next] = currentBet
      }
      actions[next] = bet.type
    }
  }
}
​
getPlayerBet(canCheck) {
  if (canCheck)
    possibleChoices = choicesArray
  else
    possibleChoices = choicesArray.slice(1)
  end
  var choice = null
  while (possibleChoices.indexOf(choice) == -1) {
    choice = prompt("what is your bet? your choices are" + possibleChoices.join(", "))
  }
  bet = {}
  bet.type = choice
  if (choice == "raise") {
    raise = prompt("how much do you want to raise?")
    bet.amount = parseInt(raise)
  }
  return bet
}
​
​
ai(canCheck) {
  var possibleChoices;
  if (canCheck)
    possibleChoices = choicesArray
  else
    possibleChoices = choicesArray.slice(1)
  end
  var type = previous random logic but with possibleChoices
  var bet = {}
  bet.type = type
  if (bet.type == "raise") {
    bet.amount = random number between 1 and 500
  }
  return bet
}
​
keepBetting(actions) {
  if ((actions.player && actions.player != "raise" ) && (actions.tony && actions.tony != "raise") &&
  ... ) {
    return false
  } else
    return true
  }
}
*/