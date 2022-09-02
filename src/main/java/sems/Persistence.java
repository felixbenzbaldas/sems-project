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

import com.fasterxml.jackson.databind.ObjectMapper;

import sems.general.Config;
import sems.web.Web;

public class Persistence {
	
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
		File savingsFolder = new File(getBasePath() + "savings");
		String[] savings = savingsFolder.list();
		Comparator<String> stringComparator = new Comparator<String>() {
			@Override
			public int compare(String arg0, String arg1) {
				List<Integer> arg0AsNumbersList = toNumbersList(arg0);
				List<Integer> arg1AsNumbersList = toNumbersList(arg1);
				for (int i = 0; i < arg0AsNumbersList.size(); i++) {
					if (arg0AsNumbersList.get(i).equals(arg1AsNumbersList.get(i))) {
						continue;
					} else {
						if (arg0AsNumbersList.get(i) < arg1AsNumbersList.get(i)) {
							return -1;
						} else {
							return 1;
						}
					}
				}
				return 0;
			}
		};
		Arrays.sort(savings, stringComparator);
		return savings[savings.length - 1];
	}
	
	private static List<Integer> toNumbersList(String string) {
		String[] splitted = string.split("_|-");
		List<Integer> numbersList = new LinkedList<Integer>();
		for (int i = 0; i < splitted.length; i++) {
			if (splitted[i].length() > 0) {
				numbersList.add(Integer.valueOf(splitted[i]));
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
	}
	
	public static void saveChangesOfSemsHouse(String dirPath, SemsHouse semsHouse) throws Exception {
		Persistence.saveJson(dirPath + getFileNameOfSemsHouse(App.getNameOfSemsHouse(semsHouse)), semsHouse.getChangesAsJson());
		semsHouse.removeChangeMarks();
		semsHouse.resetListOfDeletedObjects();
	}
	
	public static SemsHouse loadSemsHouse(String nameOfSemsHouse) throws Exception {
		SemsHouse semsHouse = SemsHouse.createFromJson(Persistence.loadJson(getPathOfSemsHouse(nameOfSemsHouse)));
		semsHouse.removeChangeMarks();
		return semsHouse;
	}
}