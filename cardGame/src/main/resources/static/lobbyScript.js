const hostADRESS = "http://192.168.50.81:8080/";

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

const playerList = async () => { //Den här kollar också om matchen har startat, så det är med av en update :)
        try {
            const response = await fetch(hostADRESS + "api/players?gameID=" + player.gameID);

            if (response.status == 404 || !response.ok) {
                throw new Error("fel när spelare skulle hittas!")
            } else if (response.status == 202) {
                window.location.href = "inGame.html"
                return;
            }

            const playerList = await response.json();

            const playerListDiv = document.getElementById("playerList");
            playerListDiv.innerHTML = "";

            playerList.forEach(player => {
                const li = document.createElement("li");
                li.textContent = "PlayerID: " + player.playerID;
                playerListDiv.appendChild(li);
            })

        } catch (error) {
            console.log("Fel vid inhämtning av spelare!");
             window.location.href = "index.html"
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

async function startGame() {
     try {
        const response = await fetch(hostADRESS + "api/start?gameID=" + player.gameID, {
            method: 'POST'
        });

        if (response.status == 404) {
            throw new Error ("Matchen du försökte starta finns ej!");
        } else if (response.status == 403) {
            console.log("För få spelare!");
        } else if (!response.ok) {
            throw new Error ("Något gick fel!");
        } else {
            window.location.href = "inGame.html"
        }

    } catch (error) {
        console.log("error!")
        window.location.href = "index.html"
    }
}

document.addEventListener("DOMContentLoaded", () => {
const gameIDdisplay = document.getElementById("displayID");
gameIDdisplay.innerHTML = "Game ID: " + player.gameID;

const playerIDdisplay = document.getElementById("displayIDname");
playerIDdisplay.innerHTML = "Player ID: " + player.playerID;

playerList();
})

setInterval(playerList, 3000);

