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
    

}

let isFetching = false;

setInterval(async () => {
    if (isFetching) return;
    try {
    isFetching = true;
    const response = await fetch(hostADRESS + "api/gameUpdate?playerID=" + player.playerID + "&gameID=" + player.gameID);

    if (response.status == 404) {
        throw new Error ("Något blev fel när gamedata hämtades!");
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