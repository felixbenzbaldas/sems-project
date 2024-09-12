package nodomain.easydeprecated;
import nodomain.easy.deprecated.core.RandomString;
import org.assertj.core.data.Offset;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

public class TestRandomString {

    @Test
    void testRandomString() {
        RandomString randomString = new RandomString();
        assertThat(randomString.next()).hasSizeGreaterThan(5);
    }

    @Test
    void testSanity() {
        RandomString randomString = new RandomString();
        // ensure that there is no overflow in calculation
        assertThat(randomString.getNumberOfPossibleStrings()).isLessThan(Long.MAX_VALUE);
    }

    @Test
    void testProbabilityOfCollision() {
        RandomString randomString = new RandomString();
        assertThat(randomString.getProbabilityOfCollision(1000 * 1000)).isLessThan(1.0 / 1000 / 1000 / 1000);
    }

    @Nested
    class TestCalculationOfProbability {

        @Test
        void testFirstGenerationIsSafe() {
            RandomString randomString = new RandomString("ab", 2);

            assertThat(randomString.getProbabilityOfCollision(0))
                    .isCloseTo(0, Offset.offset(0.000001));
        }

        @Test
        void testCalculation() {
            RandomString randomString = new RandomString("ab", 2);

            assertThat(randomString.getProbabilityOfCollision(1))
                    .isCloseTo(0.25, Offset.offset(0.000001));
        }
    }
}