const hostADRESS = "http://localhost:8080/";

class gameInfo {
    constructor(matchData) {
        this.myTurn = matchData.turn;
        this.opponentCardsAmount = matchData.opponentCardsAmount;
        this.playerID = matchData.playerID;
        this.cards = matchData.cards;
        this.gameID = matchData.gameID;
    }


}

class PlayerINFO {
    constructor(playerID, gameID) {
        this.playerID = playerID;
        this.gameID = gameID;
    }

    print() {
        console.log("SPELAREN ID: " + this.playerID);
        console.log("MATCH ID: " + this.gameID)
    }
}

async function leaveGame() {

    try {
        const response = await fetch(hostADRESS + "api/leave?playerID=" + player.playerID + "&gameID=" + player.gameID, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error("Leave misslyckades")
        }

        window.location.href = "index.html"

    } catch (error) {
        console.log("error!")
        window.location.href = "index.html"
    }
}

let selectedCard = null;

if (sessionStorage.getItem("player") == null) {
    window.location.href = "index.html"
}

const playerStringed =  sessionStorage.getItem("player");
const playerObj = JSON.parse(playerStringed);
const player = new PlayerINFO(playerObj.playerID, playerObj.gameID);

document.addEventListener("DOMContentLoaded", () => {
    const displayId = document.getElementById("displayName");
    displayId.innerHTML = `PlayperID: ${player.playerID} GameID: ${player.gameID}`; 
})

function render(match) {
    //render PLAYERLIST
     const playerListElement = document.getElementById("playerlist");
     playerListElement.innerHTML= "";
      for (const key in match.opponentCardsAmount) {
        const li = document.createElement("li");
        li.textContent = "Player " + key + " has " + match.opponentCardsAmount[key] + " cards left";
        playerListElement.appendChild(li);
    } 

    //render YOUR CARDS
    const yourArea = document.getElementById("cardArea1");
    yourArea.innerHTML = "";
    
    for (let x of match.cards) {
        let img = document.createElement("img");
        
        img.addEventListener("click", () => {
            selectedCard = x;
            let chosenCard = document.getElementById("valtKort");

            chosenCard.src = `/cards/${x}.png`;
        })

        img.classList.add("playerCard");
        img.src = `/cards/${x}.png`;
        yourArea.appendChild(img);
    }
    

    //render OPPONENTS cards
    match.opponentCardsAmount[match.playerID] = match.cards;

    let playersRenderd = 2;
    let cardBack = new Image();

    console.log(match.opponentCardsAmount);

    for (let x = 2; x < 5; x++) { //Clear all opponent areas
        let opponentArea = document.getElementById(`cardArea${x}`);
        let canvas = opponentArea.getContext("2d");
        canvas.clearRect(0, 0, opponentArea.width, opponentArea.height);
    }

    cardBack.onload = () => {
        for (let i = (match.playerID + 1); i < 11; i++) {
            if (i == match.playerID) {
                break;

            } else if (match.opponentCardsAmount.hasOwnProperty(i)) {
                let cardAreaEnemy = document.getElementById(`cardArea${playersRenderd}`);
                let canvas = cardAreaEnemy.getContext("2d");
                canvas.clearRect(0, 0, cardAreaEnemy.width, cardAreaEnemy.height);

                playersRenderd += 1;
                const size = 50;
                for (let j = 0; j < match.opponentCardsAmount[i]; j++) {
                    canvas.drawImage(cardBack, (j * 10), 0, size, size);
                }
            } else if (i == 9) {
                i = 0;
            }
        }
    }

    cardBack.src = `/cards/card_back.png`
}

let isFetching = false;

setInterval(async () => {
    if (isFetching) return;
    try {
        isFetching = true;
        const response = await fetch(hostADRESS + "api/gameUpdate?playerID=" + player.playerID + "&gameID=" + player.gameID);

        if (response.status == 404) {
            throw new Error("Något blev fel när gamedata hämtades!");
        }
        const matchData = await response.json();
        let match = new gameInfo(matchData);

        render(match);
    } catch (error) {
        window.location.href = "index.html"
    } finally {
        isFetching = false;
    }
}
    , 1500);