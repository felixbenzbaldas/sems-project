package sems.general;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class Config {
	static private Properties props;
	
	static String fileName = "props.txt";
	static String filePathInServer = "/webs/_NEW/k40321mu/tomcat/webapps/ROOT/" + fileName;
	
	public static String get(String key) {
		return props.getProperty(key);
	}
	
	public static void load() {
		String path = null;
		if (new File(fileName).exists()) {
			path = fileName;
		} else if (new File(filePathInServer).exists()) {
			path = filePathInServer;
		}
		try (InputStream input = new FileInputStream(path)) {
            props = new Properties();
            props.load(input);
            System.out.println("properties:");
            props.forEach((key, value) -> System.out.println("key : " + key + ", value : " + value));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
	}
}