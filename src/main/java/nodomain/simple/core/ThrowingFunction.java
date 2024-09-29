package nodomain.simple.core;

@FunctionalInterface
public interface ThrowingFunction<T, R> {
    R apply(T var1) throws Exception;
}