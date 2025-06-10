package CardGameBackend.demo;

import java.util.ArrayList;
import java.util.HashMap;

public class MatchPlayers {
	private boolean isMyTurn = false;
	private HashMap<Integer, Integer> opponentCardsAmount = new HashMap<Integer, Integer>(); //player ID, Card amount
	private int playerID;
	private ArrayList<String> cards = new ArrayList<>();
	private int gameID;
	
	public MatchPlayers(int playerID, int gameID) {
		this.playerID = playerID;
		this.gameID = gameID;
	}
	
	public int getPlayerID() {
		return playerID;
	}
	
	public void setOpponents(HashMap<Integer, Integer> opponents) {
		opponents.forEach( (k, v) -> {
			opponentCardsAmount.put(k, v);
		});
		opponentCardsAmount.remove(playerID);
	}
	
	public HashMap<Integer, Integer> getOpponentCardsAmount() {
		return opponentCardsAmount;
	}
	
	public void addCard(String card) {
		cards.add(card);
	}
	
	public int getGameID() {
		return gameID;
	}
	
	public ArrayList<String> getCards() {
		return cards;
	}
	
	public void turnSpent() {
		isMyTurn = false;
	}
	
	public void turn() {
		isMyTurn = true;
	}
	
	public boolean getTurn() {
		return isMyTurn;
	}
}
