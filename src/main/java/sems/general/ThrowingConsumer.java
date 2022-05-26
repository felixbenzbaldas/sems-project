package sems.general;

@FunctionalInterface
public interface ThrowingConsumer<T> {
	public void accept(T t) throws Exception;
}