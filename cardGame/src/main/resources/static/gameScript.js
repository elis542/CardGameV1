const hostADRESS = "http://192.168.50.81:8080/";

class gameInfo {
    constructor(matchData) {
        this.turn = matchData.turn;
        this.opponentCardsAmount = matchData.opponentCardsAmount;
        this.playerID = matchData.playerID;
        this.cards = matchData.cards;
        this.gameID = matchData.gameID;
        this.points = matchData.opponentPoints;
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
let match;

let selectedCard = null;

let selectedPlayer = null;

let chosenCardTemplate = document.getElementById("valtKort");
chosenCardTemplate.src = "/cards/card_back.png";

if (sessionStorage.getItem("player") == null) {
    window.location.href = "index.html"
}

const playerStringed = sessionStorage.getItem("player");
const playerObj = JSON.parse(playerStringed);
const player = new PlayerINFO(playerObj.playerID, playerObj.gameID);

document.addEventListener("DOMContentLoaded", () => {
    const displayId = document.getElementById("displayName");
    displayId.innerHTML = `PlayperID: ${player.playerID} GameID: ${player.gameID}`;
})

const p2Select = document.getElementById("p2");
p2Select.addEventListener("click", () => {

    for (let x = match.playerID + 1; x < 11; x++) {

        let enemies = match.opponentCardsAmount;
        delete enemies[match.playerID];

        for (let enemy in enemies) {
            if (x == Number(enemy)) {
                document.getElementById("cardArea3").classList.remove("selected");
                document.getElementById("cardArea4").classList.remove("selected");
                document.getElementById("cardArea2").classList.add("selected");

                changeSelectedPlayerHtml(x);
                return;
            }
        }
        if (x == 10) {
            x = 0;
        }
        if (x == match.playerID) {
            return
        }
    }
});

const p3Select = document.getElementById("p3");
p3Select.addEventListener("click", () => {

    let playersFound = 0;

    for (let x = match.playerID + 1; x < 11; x++) {
        let enemies = match.opponentCardsAmount;
        delete enemies[match.playerID];

        for (let enemy in enemies) {
            if (x == Number(enemy)) {
                playersFound += 1;

                if (playersFound == 2) {
                    document.getElementById("cardArea2").classList.remove("selected");
                    document.getElementById("cardArea4").classList.remove("selected");
                    document.getElementById("cardArea3").classList.add("selected");

                    changeSelectedPlayerHtml(x);
                    return;
                }
            }
        }

        if (x == 10) {
            x = 0;
        }

        if (x == match.playerID) {
            console.log("player does not exist!");
            return
        }
    }
});

const p4Select = document.getElementById("p4");
p4Select.addEventListener("click", () => {

    let playersFound = 0;

    for (let x = match.playerID + 1; x < 11; x++) {

        let enemies = match.opponentCardsAmount;
        delete enemies[match.playerID];
        for (let enemy in enemies) {
            if (x == Number(enemy)) {
                playersFound += 1;

                if (playersFound == 3) {
                    changeSelectedPlayerHtml(x);

                    document.getElementById("cardArea2").classList.remove("selected");
                    document.getElementById("cardArea3").classList.remove("selected");
                    document.getElementById("cardArea4").classList.add("selected");
                    return;
                }
            }
        }

        if (x == 10) {
            x = 0;
        }

        if (x == match.playerID) {
            console.log("player does not exist!");
            return
        }
    }
});

function changeSelectedPlayerHtml(id) {
    selectedPlayer = id;
    let htmlCode = document.getElementById("selectedPlayer");
    htmlCode.innerHTML = `Selected player: ${id}`
}

function postErrorMessage(errorMessage) {
    let paragraf = document.getElementById("errorMessage");
    paragraf.innerHTML = "Error message: " + errorMessage;

    setTimeout(() => {
        paragraf.innerHTML = "";
    }, 5000)
}

function postGameMessage(message) {
    let paragraf = document.getElementById("gameMessage");
    paragraf.innerHTML = message;

    setTimeout(() => {
        paragraf.innerHTML = "";
    }, 5000)
}

async function makeMove() {
    if (selectedPlayer == null || selectedCard == null) {
        postErrorMessage("No selected card / player");
    }

    const fetchParameters = {
        card: selectedCard,
        fromPlayer: selectedPlayer,
        playerID: match.playerID,
        gameID: match.gameID
    };

    try {
        let response = await fetch(hostADRESS + "api/doMove", {
            method: 'POST',
            body: JSON.stringify(fetchParameters),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        response = await response.json();
        if (response == 0) {
            postErrorMessage("Card / Player does not exist!");
        } else if (response == 1) {
            postGameMessage("Spelaren hade inte kortet, du får nu ett slumpmässigt kort!");
        } else if (response == 2) {
            postGameMessage("Du stal det kortet!");
        }

    } catch (error) {
        postErrorMessage("Request failed");
    };
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

function render(match) {
    //render PLAYERLIST
    const playerListElement = document.getElementById("playerlist");
    playerListElement.innerHTML = "";
    for (const key in match.opponentCardsAmount) {
        const li = document.createElement("li");
        li.textContent = "Player " + key + " has " + match.opponentCardsAmount[key] + " cards left and " + match.points[key] + " points";
        playerListElement.appendChild(li);
    }

    //Render PLAYERS turn dot
    let turnDot = document.getElementById("listCanvas");
    let listCanvas = turnDot.getContext("2d");

    listCanvas.beginPath();
    listCanvas.arc(turnDot.width / 2, turnDot.height / 2, 60, 0, 2 * Math.PI);

    if (match.playerID == match.turn) {
        listCanvas.fillStyle = "green";
    } else {
        listCanvas.fillStyle = "red";
    }
    listCanvas.fill();

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

                //Paint cirkel depending on whos turn it is!
                canvas.beginPath();
                canvas.arc(cardAreaEnemy.width - 20, cardAreaEnemy.height - 20, 18, 0, 2 * Math.PI);

                if (i == match.turn) {
                    canvas.fillStyle = "blue";
                } else {
                    canvas.fillStyle = "red";
                }
                canvas.fill();

                //Paint cards
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
        match = new gameInfo(matchData);

        if (response.status == 210) {
            postGameMessage("WINNER IS PLAYER " + match.playerID + " WITH " + match.points[match.playerID] + " points!!");
            return;
        }

        render(match);
    } catch (error) {
        window.location.href = "index.html"
    } finally {
        isFetching = false;
    }
}
    , 1500);