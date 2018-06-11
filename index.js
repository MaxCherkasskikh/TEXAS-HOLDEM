24 lines (17 sloc)  556 Bytes
/* THIS IS THE RANDOM BUTTON FUNCTIONS */

console.log("index.js loaded!");

var link2history_button = document.getElementById('link2history_button');

link2history_button.addEventListener('click', toggleHistory);

function showHistory(event) {
  document.getElementById('history').style.display = 'inline';
}

function hideHistory(event) {
  document.getElementById('history').style.display = 'none';
}

function toggleHistory() {
  if (document.getElementById('history').style.display === 'none') {
    showHistory();
  } else {
    hideHistory();
  }
}