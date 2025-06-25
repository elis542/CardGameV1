package CardGameBackend.demo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Random;

public class ActiveMatch {
	private boolean active = true;
	private boolean isStarted = false;
	private int ID;
	private String gameType;
	private ArrayList<MatchPlayers> playersInGame = new ArrayList<>();
	private int TimeSinceActivity;
	private ArrayList<String> deckOfCards = new ArrayList<>();
	
	public ActiveMatch(String gameType) {
		this.gameType = gameType;
		ID = ActiveGameLogicUpdater.addMatch(this);
		
		MatchPlayers firstPlayer = new MatchPlayers(1, ID);
		playersInGame.add(firstPlayer);
	}
	
	public int getGameID() {
		return ID;
	}

	public MatchPlayers getPlayerByID(int ID) {
		TimeSinceActivity = 0;
		for (MatchPlayers x : playersInGame) {
			if (x.getPlayerID() == ID) {
				return x;
			}
		}
		return null;
	}
	
	public ArrayList<MatchPlayers> getAllPlayer() {
		TimeSinceActivity = 0;
		return playersInGame;
	}
	
	public void setInactive() {
		active = false;
	}
	
	public void update() {
		TimeSinceActivity++;
		if (TimeSinceActivity > 5 || playersInGame.size() < 1) {
			System.out.println("tar bort match!");
			setInactive();
		}
		if (!isStarted) {
			return;
		}
	}
	
	public void start() {
		createDeckOfCards();
		
		isStarted = true;
		
		for (MatchPlayers x : playersInGame) {
			for (int y = 0; y < 8; y++) {
				x.addCard(deckOfCards.getFirst());
				deckOfCards.removeFirst();
			}
		}
		
		HashMap<Integer, Integer> cardMap = new HashMap<>();
		for (MatchPlayers x : playersInGame) {
			cardMap.put(x.getPlayerID(), x.getCards().size());
		}
		
		for (MatchPlayers x : playersInGame) {
			x.setOpponents(cardMap);
		}
	}
	
	public boolean getStart() {
		return isStarted;
	}
	
	public boolean getActive() {
		return active;
	}
	
	public MatchPlayers newPlayer() {
		TimeSinceActivity = 0;
		MatchPlayers newPlayer;
		for (int x = 1; x < 10; x ++) {
			boolean numBusy = false;
			for (MatchPlayers y : playersInGame) {
				if (y.getPlayerID() == x) {
					numBusy = true;
				} 
			}
			if (!numBusy) {
				newPlayer = new MatchPlayers(x , ID);
				playersInGame.add(newPlayer);
				return newPlayer;
			}
		}
		return null;
	}
	
	public boolean removePlayer(int playerID) {
		for (MatchPlayers x : playersInGame) {
			if (x.getPlayerID() == playerID) {
				playersInGame.remove(x);
				
				for (MatchPlayers y : playersInGame) {
					y.removeOpponent(x.getPlayerID());
				}
				
				return true;
			}
		}
		return false;
	}
	
	private void createDeckOfCards() {
		String[] deck = {"DA", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "DJ", "DQ", "DK",
				"CA", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "CJ", "CQ", "CK", 
				"HA", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "HJ", "HQ", "HK", 
				"SA", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "SJ", "SQ", "SK"};
		for (int x = 0; x < 52; x++) {
			deckOfCards.add(deck[x]);
		}
		Collections.shuffle(deckOfCards);
	}
}
