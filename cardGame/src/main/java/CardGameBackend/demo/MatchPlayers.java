package CardGameBackend.demo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

public class MatchPlayers {
	private int pairs = 0;
	private int playerTurn = 0;
	private HashMap<Integer, Integer> opponentCardsAmount = new HashMap<Integer, Integer>(); //player ID, Card amount
	private HashMap<Integer, Integer> opponentPoints = new HashMap<Integer, Integer>();
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
	
	public HashMap<Integer, Integer> getOpponentPoints() {
		return opponentPoints;
	}
	
	public void setOpponentPoints(HashMap<Integer, Integer> map) {
		opponentPoints = map;
	}
	
	public void setOpponents(HashMap<Integer, Integer> opponents) {
		opponents.forEach( (k, v) -> {
			opponentCardsAmount.put(k, v);
		});
		opponentCardsAmount.remove(playerID);
	}
	
	public void removeOpponent(int x) {
		opponentCardsAmount.remove((Integer)x);
	}
	
	public HashMap<Integer, Integer> getOpponentCardsAmount() {
		return opponentCardsAmount;
	}
	
	public String getCardType(char type) {
		for (String x : cards) {
			if (type == x.charAt(1)) {
				return x;
			}
		}
		return null;
	}
	
	public void testPair() {
		HashSet<Character> allPairs = new HashSet<>();

		for (int y = 0; y < cards.size(); y++) {
			String card = cards.get(y);
			int match = 0;

			for (String card2 : cards) {
				if (card.charAt(1) == card2.charAt(1)) {
					match++;
				}
			}
			if (match == 4) {
				allPairs.add(card.charAt(1));
			}
		}
		for (Character x : allPairs) {
			cards.removeIf(s -> s.length() > 1 && s.charAt(1) == x);
		}
		
		for (int x = 0; x < allPairs.size(); x++) {
			pairs += 1;
		}
		allPairs.clear();
	}
	
	public int getPoints() {
		return pairs;
	}

	public void addCard(String card) {
		cards.add(card);
	}
	
	public void removeCard(String card) {
		cards.remove(card);
	}
	
	public int getGameID() {
		return gameID;
	}
	
	public ArrayList<String> getCards() {
		return cards;
	}
	
	public int getTurn() {
		return playerTurn;
	}
	
	public void setTurn(int i) {
		playerTurn = i;
	}
}
