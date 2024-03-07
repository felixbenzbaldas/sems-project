package sems;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class Scripts {
	
	private static List<String> rootObjects = Arrays.asList("1-44451244", "1-1629");
	private static String listOf100lastDeleted = "1-60449731";

	// delete everything, that is not accessible from the rootObject
	// at first: delete listOf100lastDeleted
	public static void clean() {
		App.get(listOf100lastDeleted).deleteAllDetails();
		//
		Set<SemsObject> objectsThatAreAccessibleFromRoot = new HashSet<SemsObject>();
		objectsThatAreAccessibleFromRoot.addAll(rootObjects.stream().map(App::get).collect(Collectors.toSet()));
		boolean addedObject = true; 
		while(addedObject) {
			addedObject = false;
			Set<SemsObject> newObjects = new HashSet<SemsObject>();
			for (SemsObject obj : objectsThatAreAccessibleFromRoot) {
				for (SemsObject neighbourObj : obj.createListOfDetails()) {
					if (!objectsThatAreAccessibleFromRoot.contains(neighbourObj)) {
						newObjects.add(neighbourObj);
						addedObject = true;
					}
				}
				String contextAddress = obj.props.getString(Consts.CONTEXT);
				if (contextAddress != null) {
					SemsObject contextObj = App.get(contextAddress);
					if (!objectsThatAreAccessibleFromRoot.contains(contextObj)) {
						newObjects.add(contextObj);
						addedObject = true;
					}
				}
			}
			objectsThatAreAccessibleFromRoot.addAll(newObjects);
		}
		Set<SemsObject> allObjects = App.getAllObjects();
		System.out.println("zu l�schen: " + (allObjects.size() - objectsThatAreAccessibleFromRoot.size()));
		for (SemsObject obj : allObjects) {
			if (!objectsThatAreAccessibleFromRoot.contains(obj)) {
				// delete text to be sure
				obj.props.setProperty(Consts.TEXT, "");
				//
				SemsHouse semsHouse = obj.getSemsHouse();
				semsHouse.removeSemsObject(obj);
			}
		}
		System.out.println("Anzahl Objekte nach clean: " + App.getAllObjects().size());
	}
	
	
	public static void update() {
		int counter = 0;
		int absWeightGesamt = 0;
		for (SemsObject obj : App.getAllObjects()) {
			String text = obj.props.getString(Consts.TEXT);
			if (text != null) {
				if (text.startsWith("__") || text.startsWith(">_")) {
					// 1. die ersten beiden Zeichen abschneiden
					String substring = text.substring(2);
					System.out.println("Substring: " + substring);
					String[] array = substring.split(" _ ");
					if (array.length >= 2) {
						counter++;
						System.out.println("absolutes Gewicht: " + array[0]);
						System.err.println("t�gliches Gewicht: " + array[1]);
						int absWeight = Integer.parseInt(array[0]);
						int dailyWeight = Integer.parseInt(array[1]);
						int newAbsWeight = absWeight + dailyWeight;
						System.out.println("neues absolutes Gewicht: " + newAbsWeight);
						absWeightGesamt += newAbsWeight;
						//
						String newText = "";
						float schwingungsdauer = 2.5f;
						if (array.length == 4) {
							schwingungsdauer = Float.parseFloat(array[2]);
						}
						if (newAbsWeight >= schwingungsdauer * dailyWeight) {
							newText += ">_";
						} else {
							newText += "__";
						}
						newText += newAbsWeight + " _ " + array[1];
						for (int i = 2; i < array.length; i++) {
							newText += " _ " + array[i];
						}
						obj.props.setProperty(Consts.TEXT, newText);
					}
				}
			}
		}
		System.out.println("Anzahl der Systeme mit Gewicht: " + counter);
		System.out.println("Gesamtgewicht: " + (absWeightGesamt / 60.0 ) + " Stunden");
	}
	
}
