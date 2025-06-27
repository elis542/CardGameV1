package CardGameBackend.demo;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class Controller {
	
	@GetMapping()
	public ResponseEntity<Boolean> basicAnswer() {
		return ResponseEntity.ok(true);
	}
	
	@PostMapping("/create")
	public ResponseEntity<MatchPlayers> createGame(@RequestParam String gameType) {	
		
		ActiveMatch createdGame = new ActiveMatch(gameType);
		return ResponseEntity.ok(createdGame.getPlayerByID(1));
	}
	
	@PostMapping("/join")
	public ResponseEntity<MatchPlayers> joinGame(@RequestParam int gameID) {
		
		ActiveMatch joinMatch = ActiveGameLogicUpdater.getMatchByID(gameID);
		if (joinMatch == null) {
			System.out.println("Spelare försökte ansluta till match som ej finns!");
			return ResponseEntity.status(404).build();
			
		} else if (joinMatch.getAllPlayer().size() > 3) {
			System.out.println("Spelare försökte ansluta till match som är full");
			return ResponseEntity.status(402).build(); //match full
		} else if (joinMatch.getStart()) {
			System.out.println("Spelare försökte ansluta till match som har startat");
			return ResponseEntity.status(405).build();
		}
		
		System.out.println("Spelare ansluten till match! MatchID: " + joinMatch.getGameID()); //Ta bort sen!
		MatchPlayers temp = joinMatch.newPlayer();
		
		if (temp == null) {
			return ResponseEntity.status(403).build();
		}
		
		
		return ResponseEntity.ok(temp);
	}
	
	@PostMapping("/start")
	public ResponseEntity<Boolean> startGame(@RequestParam int gameID) { 
		
		ActiveMatch startMatch = ActiveGameLogicUpdater.getMatchByID(gameID);
		if (startMatch == null) {
			return ResponseEntity.status(404).body(false); //match dosent exist
		}else if (startMatch.getAllPlayer().size() < 2) {
			return ResponseEntity.status(403).body(false); //cant start because there is less then 2 players
		}
		startMatch.start();
		return ResponseEntity.ok().body(true);
	}
	
	@GetMapping("/gameUpdate")
	public ResponseEntity<MatchPlayers> gameUpdate(@RequestParam int playerID, @RequestParam int gameID) {
		ActiveMatch findMatch = ActiveGameLogicUpdater.getMatchByID(gameID);
		
		if (findMatch == null || findMatch.getStart() == false) {
			return ResponseEntity.status(404).build();
		}
		
		MatchPlayers findPlayer = findMatch.getPlayerByID(playerID);
		
		if (findPlayer == null) {
			return ResponseEntity.status(404).build();
		}
		return ResponseEntity.ok().body(findPlayer);
	}
	
	@GetMapping("/players")
	public ResponseEntity<ArrayList<MatchPlayers>> getPlayersAndStart(@RequestParam int gameID) {
		
		ActiveMatch holder = ActiveGameLogicUpdater.getMatchByID(gameID);
		
		if (holder == null) {
			return ResponseEntity.status(404).build();
		} else if (holder.getStart()) {
			return ResponseEntity.status(202).build(); //Answer if the match has started!
		}
		return ResponseEntity.ok(holder.getAllPlayer());
	}
	
	private record moveStruct(String card, int fromPlayer, int playerID, int gameID) {}
		
	@PostMapping()
	public ResponseEntity<Integer> doMove(@RequestBody moveStruct moveMade) {
		ActiveMatch holder = ActiveGameLogicUpdater.getMatchByID(moveMade.gameID);
		int status = holder.makeMove(moveMade.card, moveMade.fromPlayer, moveMade.playerID);
		
		if (status == 2) {
			return ResponseEntity.ok().body(2); //full sucess!
		} else if (status == 1) {
			return ResponseEntity.ok().body(1); //Player does not have card!
		}
		return ResponseEntity.status(400).body(0); //Not your turn or you do not have the card
	}
	
	@PostMapping("/leave")
	public ResponseEntity<Boolean> leaveMatch(@RequestParam int playerID, @RequestParam int gameID) {
		
		ActiveMatch holder = ActiveGameLogicUpdater.getMatchByID(gameID);
		
		if (holder.removePlayer(playerID)) {
			return ResponseEntity.ok(true);
		}
		return ResponseEntity.status(404).body(false);
	}
}
