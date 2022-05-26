package sems.web;

import static sems.Consts.DEFAULT_EXPANDED;

import java.util.HashSet;
import java.util.Set;
import java.util.Stack;

import sems.App;
import sems.SemsObject;
import sems.general.PropertiesOfIdentity;

public class LoadDependencies {
	
	private Stack<String> todo = new Stack<>();
	private Set<String> done = new HashSet<>();
	private Set<String> dependencies = new HashSet<>();

	public LoadDependencies(String semsAddress) {
		this.todo.add(semsAddress);
	}
	
	public Set<String> get() {
		create();
		return dependencies;
	}
	
	private void create() {
		if (!todo.isEmpty()) {
			String current = todo.pop();
			if (!done.contains(current)) {
				SemsObject semsObject = App.get(current);
				PropertiesOfIdentity props = App.objProperties.getPropertiesOfIdentity(current);
				if (props.get(DEFAULT_EXPANDED) != null) {
					if (props.getBoolean(DEFAULT_EXPANDED)) {
						todo.addAll(semsObject.getDetails());
					}					
				}
				dependencies.add(current);
				done.add(current);
			}
			create();
		}
	}
}