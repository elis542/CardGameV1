const HostADRESS = "http://localhost:8080/";

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

async function createGame() {
     try {
        const response = await fetch(HostADRESS + "api/create?gameType=Classic", {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error("Nytt spel misslyckat!");
        }  
        const jsonDATA = await response.json();
        const player = new PlayerINFO(jsonDATA.playerID, jsonDATA.gameID);

        goToLobby(player);

} catch (error) {
    document.getElementById("ErrorMessage").innerHTML = "Nytt spel misslyckades!";
    console.log("error meesage: " + error.message);
}}

async function joinGame() {
    const inputGameID = document.getElementById("gameIDInput");
    inputGameIDValue = inputGameID.value;
    var responsePrinted = false;
    try {
        const response = await fetch(HostADRESS + "api/join?gameID=" + inputGameIDValue, {
            method: 'POST'
        }
        )

        if (response.status == 404) {
            responsePrinted = true;
            document.getElementById("ErrorMessage").innerHTML = "Match finns ej!";
            throw new Error("Matchen finns ej!");

        } else if (!response.ok) {
            responsePrinted = true;
            throw new Error("server fel!");
        }
        const jsonDATA = await response.json();
        const player = new PlayerINFO(jsonDATA.playerID, jsonDATA.gameID);

        goToLobby(player);

    } catch (error) {
        if (responsePrinted == false) {
            document.getElementById("ErrorMessage").innerHTML = "Server ej hittad!";
        }
        console.log("error message: " + error.message)
    }
}

function goToLobby(playerData) { //Sparar spelaren info och skickar det till nästa vy
    sessionStorage.setItem("player", JSON.stringify(playerData));
    window.location.href = "GameLobby.html"
}
