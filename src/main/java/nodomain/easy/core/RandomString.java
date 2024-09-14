package nodomain.easy.core;

import java.util.Random;

public class RandomString {
    private final String allowedCharacters;
    private final int length;

    private final Random random = new Random();

    public RandomString(String allowedCharacters, int length) {
        this.allowedCharacters = allowedCharacters;
        this.length = length;
    }

    public RandomString() {
        this.allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        this.length = 10;
    }

    public String next() {
        StringBuilder stringBuilder = new StringBuilder(length);
        int numberOfCharacters = allowedCharacters.length();
        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(numberOfCharacters);
            char randomChar = allowedCharacters.charAt(randomIndex);
            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }

    public long getNumberOfPossibleStrings() {
        return (long) Math.pow(allowedCharacters.length(), length);
    }

    public double getProbabilityOfCollision(long generatedStrings) {
        return generatedStrings / (float) getNumberOfPossibleStrings();
    }
}