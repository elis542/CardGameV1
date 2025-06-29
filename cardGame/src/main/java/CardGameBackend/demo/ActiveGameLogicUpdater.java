package CardGameBackend.demo;

import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ActiveGameLogicUpdater {
	
	private static ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
	
	private static ArrayList<ActiveMatch> games = new ArrayList<>();
	
	public static void run() {

		executor.scheduleAtFixedRate( () -> {
			games.removeIf(ActiveMatch -> !ActiveMatch.getActive());
			for (ActiveMatch x : games) {
				x.update();
			}
		}, 0, 1, TimeUnit.SECONDS);
	}
	
	public static int addMatch(ActiveMatch addedMatch) {
		games.add(addedMatch);
		boolean isUsed = false;
		for(int x = 1; x < games.size() + 10; x++) {
			isUsed = false;
			for (ActiveMatch y : games) {
				if (y.getGameID() == x) {
					isUsed = true;
				}
			}
			if (!isUsed) {
				return x;
			}
		}
		System.err.println("ERROR kunde inte hitta ledigt gameID");
		addedMatch.setInactive();
		return 0;
	}
	
	public static ActiveMatch getMatchByID(int ID) {
		for (ActiveMatch x : games) {
			if (x.getGameID() == ID) {
				return x;
			}
		}
		return null;
	}
}
