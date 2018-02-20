/*
 * Create a list that holds all of your cards
 */
let cards = ["fa fa-diamond", "fa fa-paper-plane-o",
             "fa fa-anchor", "fa fa-bolt",
             "fa fa-cube", "fa fa-anchor",
             "fa fa-leaf", "fa fa-bicycle",
             "fa fa-diamond", "fa fa-bomb",
             "fa fa-leaf", "fa fa-bomb",
             "fa fa-bolt", "fa fa-bicycle",
             "fa fa-paper-plane-o", "fa fa-cube"
           ];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Shuffling the cards before display
function shuffle_cards(cards){
  cards = shuffle(cards);
  let ul_list = document.querySelector("ul[class=deck]");
  while (ul_list.firstChild) {
      ul_list.removeChild(ul_list.firstChild);
  }

  for (card of cards){
    let list_ele = document.createElement("li");
    list_ele.setAttribute("class", "card");
    let icon_ele = document.createElement("i");
    icon_ele.setAttribute("class", card);

    list_ele.insertAdjacentElement("afterbegin", icon_ele);
    ul_list.insertAdjacentElement("beforeend", list_ele);
  }
}

shuffle_cards(cards);


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let temp_open = [];
let open_cards = [];
let num_moves = 0;
let rating_flag = 0;
let rating = document.querySelector("ul[class=stars]");
let start_time = new Date();

function show_card(event){
    if (event.target.nodeName === "LI"){
      event.target.setAttribute("class", "card open show");
      temp_open.push(event.target);
    }
}

function close_cards(){
  for (card of temp_open){
    card.setAttribute("class", "card mismatch");
  }
  temp_open = [];
}

function check_match(){
  let [card1, card2] = temp_open;
  let decision = card1.isEqualNode(card2);
  if (decision) {
    console.log("same cards");
    // keep cards open
    for (card of temp_open){
      card.setAttribute("class", "card match");
      open_cards.push(card);
    }
    temp_open = [];
  }
  else {
    //close cards
    console.log("different cards");
    setTimeout(close_cards, 500);
  }
}

function check_win_condition(){
  if (open_cards.length == cards.length){
    document.querySelector(".game-start").style.display = "none";
    document.querySelector(".game-finish").style.display = "block";
    document.querySelector(".moves-result").textContent = num_moves;
    [minutes, seconds] = timer()
    document.querySelector(".time-result").textContent = minutes + ":" + seconds;

    let num_stars;
    if (num_moves <= 10){
      num_stars = 3;
    } else if (num_moves > 10 && num_moves <= 20) {
      num_stars = 2;
    } else {
      num_stars = 1;
    }

    document.querySelector(".rating-result").textContent = num_stars;
    console.log("Game Won");
    console.log(num_moves);
  }
}


function update_stats(){
  num_moves += 1;
  let moves_ele = document.querySelector(".moves");
  moves_ele.textContent = num_moves;

  if (num_moves === 21){
    rating_flag = 0;
  }

  if (num_moves > 10 && num_moves <= 20 && rating_flag == 0){
    rating.removeChild(rating.firstElementChild);
    let empty_star = document.createElement('li');
    empty_star.innerHTML = '<i class="fa fa-star-o"></i>';
    rating.appendChild(empty_star);
    rating_flag = 1;
  }
  else if (num_moves > 20 && rating_flag === 0) {
    rating.removeChild(rating.firstElementChild);
    let empty_star = document.createElement('li');
    empty_star.innerHTML = '<i class="fa fa-star-o"></i>';
    rating.appendChild(empty_star);
    rating_flag = 1;
  }
}



// function that has game flow logic
function main(event){
  update_stats();
  let num_open = temp_open.length;
  if (num_open < 1){
    // open the card
    show_card(event);
  }
  else if (num_open < 2) {
    // open the card
    show_card(event);

    // check for match or not match
    check_match();

    // check for win condition
    check_win_condition()
  }
}


//timer functionality that updates the DOM every second
function timer(){
  current_time = new Date();
  time_elapsed_ms = current_time - start_time;
  minutes = (Math.floor(time_elapsed_ms / 60000));
  seconds = Math.floor(time_elapsed_ms/1000) - (minutes * 60);
  seconds = seconds < 10 ? "0" + seconds: seconds;
  let timer_element = document.querySelector(".timer");
  timer_element.textContent = minutes + ":" + seconds;
  return [minutes, seconds];
}
setInterval(timer, 1000);


// functionality to play the game through click events
let deck = document.querySelector("ul[class=deck]");
deck.addEventListener("click", main);


// functionality to reset the game
let repeat = document.querySelector(".fa-repeat");
repeat.addEventListener("click", function reset_game(){
  //shuffling cards
  shuffle_cards(cards);

  // resetting moves
  let moves_ele = document.querySelector(".moves");
  moves_ele.textContent = 0;

  //resetting stars
  while (rating.firstElementChild){
    rating.removeChild(rating.firstElementChild);
  }
  for (let i = 0; i < 3; i++){
    let full_star = document.createElement('li');
    full_star.innerHTML = '<i class="fa fa-star"></i>';
    rating.insertAdjacentElement("afterbegin", full_star);
  }

  //resetting timer
  start_time = new Date()
});
