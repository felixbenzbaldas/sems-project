package sems.general;

public class Utils {
	public static String getRandom(int numberOfCharacters) {
		int number = (int) (Math.random() * Math.pow(10, numberOfCharacters));
		return String.valueOf(number);
	}
}
