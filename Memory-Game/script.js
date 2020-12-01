class AudioControl {
	constructor() {
		this.backgroundMusic = new Audio("Audio/littleidea.mp3");
		this.backgroundMusic.volume = 0.05;
		this.backgroundMusic.loop = true;
		this.effect1 = new Audio("Audio/match2.mp3");
		this.effect1.volume = 0.2;
		this.musicToggle = true;
	}

	playMusic() {
		this.backgroundMusic.play();
		this.musicToggle = true;
	}

	stopMusic() {
		this.backgroundMusic.pause();
		this.musicToggle = false;
	}

	playMatch() {
		this.effect1.play();
	}

}  


class Concentration {
	constructor(time, cards) {
		this.cardList = cards;
		this.timeLeft = time;
		this.timer = document.getElementById('timer');
		this.timeButton = document.getElementById('time-button')
		this.flips = document.getElementById('turns');
		this.audioController = new AudioControl();
		this.gameHasStarted = false;
		this.turnToggle = true;
	} 

	start() {
		this.cardToCheck = null;
		this.timeLeft = 90;
		this.pairs = []
		this.busy = true

		setTimeout(() => {
			if (this.audioController.musicToggle === true) {
				this.audioController.playMusic();
			}
			if (this.turnToggle === true) {
				this.totalFlips = 0;
			}
    		this.timeCounter = this.timerOn();
    		document.getElementById('start-message').innerHTML = "You got this :)";
    		this.gameHasStarted = true;
    		this.busy = false;
    		this.shuffle();
		}, 500)

		this.hideCards();
	}
	
	turnsOn() {
		this.turnToggle = true;
	}

	turnsOff() {
		this.turnToggle = false;
	}

	canFlipCard(card) {
		return (!this.busy && !this.pairs.includes(card) && card !== this.cardToCheck);
	}

	// Timer function
	timerOn() {
        return setInterval(() => {
            this.timeLeft--;
            this.timer.innerHTML = this.timeLeft;
            if (this.timeLeft === 0) {
            	this.gameOver();
            }
        }, 1000);
    }

    timerOff() {
    	clearInterval(this.timeCounter);
    }

    hideCards() {
    	this.cardList.forEach(card => {
    		card.classList.remove('visible');
    		card.classList.remove('matched');
    	})
    }

    flip(card) {
    	if(this.canFlipCard(card)) {
    		card.classList.add('visible');

    		if(this.cardToCheck) {
    			this.checkForMatch(card);
    		}
    		else {
    			this.cardToCheck = card;
    		}
    	}
    }

    checkForMatch(card) {
    	if(this.getCardType(card) === this.getCardType(this.cardToCheck)) {
    		this.cardMatch(card, this.cardToCheck);
    	}
    	else {
    		this.cardMisMatch(card, this.cardToCheck);
    	}
    	if (this.turnToggle) {
	    	this.totalFlips++;
	    	this.flips.innerHTML = this.totalFlips;
	    }
    	this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
    	this.audioController.playMatch();
    	this.pairs.push(card1);
    	this.pairs.push(card2);
    	card1.classList.add('matched');
    	card2.classList.add('matched');
    	card1.classList.add('dancing');
    	card2.classList.add('dancing');
    	if(this.pairs.length === this.cardList.length) {
    		this.victory();
    	}
    }
    cardMisMatch(card1, card2) {
    	this.busy = true;
    	setTimeout(() => {
			card1.classList.remove('visible');
    		card2.classList.remove('visible');
    		this.busy = false;
    	}, 750);
    }

    getCardType(card) {
    	return card.getElementsByClassName('card-img')[0].src;
    }

  	shuffle() {
  		for(let i=this.cardList.length - 1; i > 0; i--) {
  			let randIndex = Math.floor(Math.random() * (i-1));
  			this.cardList[randIndex].style.order = i;
  			this.cardList[i].style.order = randIndex;
  		}
  	}

  	gameOver() {
  		this.timerOff();
  		document.getElementById('start-message').innerHTML = "Game over :( Click to try again!";
  		document.getElementById('overlay-text-lose').classList.add('visible');
  	}

  	victory() {
  		this.timerOff();
  		document.getElementById('start-message').innerHTML = "Nice job!! Click to play again!";
  		document.getElementById('overlay-text-win').classList.add('visible');
  		confetti.start(3000, 100);
  	}

}



if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
	let overlays = Array.from(document.getElementsByClassName('overlay-text'));
	let cards = Array.from(document.getElementsByClassName('card'));
	let game = new Concentration(90, cards);
	let toggleMusic = document.getElementById('music-button');
	let toggleTime = document.getElementById('time-button');
	let toggleTurns = document.getElementById('turns-button');


	overlays.forEach(overlay => {
		overlay.addEventListener('click', () => {
			overlay.classList.remove('visible');
			game.start();
		})
	})

	toggleMusic.onclick = function() {
		if (toggleMusic.innerHTML === "Music: On") {
			game.audioController.stopMusic();
			toggleMusic.innerHTML = "Music: Off";
		}
		else {
			game.audioController.playMusic();
			toggleMusic.innerHTML = "Music: On";
		}
	}

	toggleTime.onclick = function() {
		if (toggleTime.innerHTML === "Time: On") {
			game.timerOff();
			toggleTime.innerHTML = "Time: Off";
		}
		else {
			game.timerOn();
			toggleTime.innerHTML = "Time: On";
		}
	}

	toggleTurns.onclick = function() {
		if (toggleTurns.innerHTML === "Turns: On") {
			game.turnsOff();
			toggleTurns.innerHTML = "Turns: Off";
			document.getElementById('turns').innerHTML = "n/a";
		}
		else {
			game.turnsOn();
			toggleTurns.innerHTML = "Turns: On";
		}
	}

	cards.forEach(card => {
	    card.addEventListener('click', () => {
	        game.flip(card);
	    });
	 });
}
