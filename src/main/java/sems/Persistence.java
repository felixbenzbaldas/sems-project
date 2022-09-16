package sems;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import static sems.Consts.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import sems.general.Config;
import sems.web.Web;

public class Persistence {
	
	private static boolean tmpLoadWithChanges = true;
	
	public static String getTimestamp() {
		Date date = new Date();
		return date.getYear() % 100 + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "___" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
	}
	
	public static void saveJson(String path, Object jsonObject) throws Exception {
		new File(path).getParentFile().mkdirs();
		new ObjectMapper().writeValue(new File(path), jsonObject);
	}
	
	public static Object loadJson(String path) throws Exception {
		Object loaded = new ObjectMapper().readValue(new File(path), Object.class);
		return loaded;
	}
	
	public static void writeStringToFile(String path, String string) throws IOException {
		File file = new File(path);
		file.createNewFile();
		try (PrintWriter out = new PrintWriter(file)) {
		    out.println(string);
		}
	}
	
	public static String readStringFromFile(String path) throws IOException {
		return new String(Files.readAllBytes(Paths.get(path)));
	}
	
	//////////////////////////////////

	public static File getFileOfSemsHouse(String nameOfSemsHouse) {
		File file = new File(getPathOfSemsHouse(nameOfSemsHouse));
		return file;
	}
	
	public static String getPathOfSemsHouse(String nameOfSemsHouse) {
		return getBasePath() + "savings/" + getLastSavingFolder() + "/" + getFileNameOfSemsHouse(nameOfSemsHouse);
	}
	
	static private String getLastSavingFolder() {
		List<String> pathsUntilLastCompleteSaving = getDirNamesUntilLastCompleteSaving();
		String toReturn = pathsUntilLastCompleteSaving.get(pathsUntilLastCompleteSaving.size() - 1);
		return toReturn;
	}
	
	private static List<Integer> toNumbersList(String string) {
		String[] splitted = string.split("_|-");
		List<Integer> numbersList = new LinkedList<Integer>();
		for (int i = 0; i < splitted.length; i++) {
			if (splitted[i].length() > 0) {
				if (!splitted[i].contains(CHANGES)) {
					numbersList.add(Integer.valueOf(splitted[i]));
				}
			}
		}
		return numbersList;
	}
	
	public static String getBasePath() {
		return Config.get("basePath");
	}
	
	public static String getFileNameOfSemsHouse(String nameOfSemsHouse) {
		return "sh" + nameOfSemsHouse + ".json";
	}

	public static void saveSemsHouse(String dirPath, SemsHouse semsHouse) throws Exception {
		Persistence.saveJson(dirPath + getFileNameOfSemsHouse(App.getNameOfSemsHouse(semsHouse)), semsHouse.toJson());
		semsHouse.removeChangeMarks();
		semsHouse.resetListOfDeletedObjects();
	}
	
	public static void saveChangesOfSemsHouse(String dirPath, SemsHouse semsHouse) throws Exception {
		Persistence.saveJson(dirPath + getFileNameOfSemsHouse(App.getNameOfSemsHouse(semsHouse)), semsHouse.getChangesAsJson());
		semsHouse.removeChangeMarks();
		semsHouse.resetListOfDeletedObjects();
	}
	
	public static SemsHouse loadSemsHouse(String nameOfSemsHouse) throws Exception {
		if (tmpLoadWithChanges) {
			List<String> listOfDirNames = getDirNamesUntilLastCompleteSaving();
			SemsHouse semsHouse = new SemsHouse();
			for (int i = 0; i < listOfDirNames.size(); i++) {
				SemsHouse.loadFromJson(semsHouse, Persistence.loadJson(getPathWithDirNameAndSemsHouse(listOfDirNames.get(i), nameOfSemsHouse)));
			}
			return semsHouse;
		} else {
			return SemsHouse.createFromJson(Persistence.loadJson(getPathOfSemsHouse(nameOfSemsHouse)));
		}
	}
	
	private static String getPathWithDirNameAndSemsHouse(String dirName, String nameOfSemsHouse) {
		return getBasePath() + "savings/" + dirName + "/" + getFileNameOfSemsHouse(nameOfSemsHouse);
	}
	
	private static List<String> getDirNamesUntilLastCompleteSaving() {
		File savingsFolder = new File(getBasePath() + "savings");
		String[] savings = savingsFolder.list();
		Comparator<String> stringComparator_absteigend = new Comparator<String>() {
			@Override
			public int compare(String dirName0, String dirName1) {
				List<Integer> arg0AsNumbersList = toNumbersList(dirName0);
				List<Integer> arg1AsNumbersList = toNumbersList(dirName1);
				for (int i = 0; i < arg0AsNumbersList.size(); i++) {
					if (arg0AsNumbersList.get(i).equals(arg1AsNumbersList.get(i))) {
						continue;
					} else {
						if (arg0AsNumbersList.get(i) < arg1AsNumbersList.get(i)) {
							return 1;
						} else {
							return -1;
						}
					}
				}
				return 0;
			}
		};
		Arrays.sort(savings, stringComparator_absteigend);
		for (int i = 0;i < savings.length;i++) {
			if (!savings[i].contains(CHANGES) ) {
				List<String> toReturn = Arrays.asList(savings).subList(0, i + 1);
				return toReturn;
			}
		}
		throw new RuntimeException("Error! Found no complete saving!");
	}
}