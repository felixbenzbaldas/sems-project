package sems;

import static sems.Consts.*;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import sems.general.Config;
import sems.general.Properties;
import sems.general.PropertiesOfIdentity;
import sems.web.LoadDependencies;
import sems.web.Web;

public class App {
	
	public static SemsHouse semsHouseZero;
	public static SemsHouse semsHouseOne;
	public static String nameOfSemsHouseZero = "0";
	public static String nameOfSemsHouseOne= "1";
	

	public static Properties objProperties = new Properties();
	
	
	public synchronized static void initialize() throws Exception {
		Config.load();
		if (Persistence.getFileOfSemsHouse(nameOfSemsHouseZero).exists()) {
			semsHouseZero = Persistence.loadSemsHouse(nameOfSemsHouseZero);
		} else {
			semsHouseZero = new SemsHouse();
			semsHouseZero.setRootObject(semsHouseZero.createSemsObject("Root of house 0"));
		}
		if (Persistence.getFileOfSemsHouse(nameOfSemsHouseOne).exists()) {
			semsHouseOne = Persistence.loadSemsHouse(nameOfSemsHouseOne);
		} else {
			semsHouseOne= new SemsHouse();
			semsHouseOne.setRootObject(semsHouseOne.createSemsObject("Root of house 1"));
			App.insertLinkDetailAtPosition(semsHouseOne.getRootObject(), semsHouseZero.getRootObject(), 0);
		}
		Web.createResponses();
	}
	
	static public SemsObject get(String address) {
		SemsAddressParser parser = new SemsAddressParser(address);
		if (parser.hasSemsHouse()) {
			return parser.getSemsHouse().getInThisHouse(address);
		} else {
			return semsHouseZero.getInThisHouse(address);
		}
	}
	
	static public String getNameOfSemsHouse(SemsHouse semsHouse) {
		if (semsHouse == semsHouseZero) {
			return nameOfSemsHouseZero;
		} else if (semsHouse == semsHouseOne) {
			return nameOfSemsHouseOne;
		} else {
			return null;
		}
	}
	
	static public SemsHouse getSemsHouse(String nameOfSemsHouse) {
		if (nameOfSemsHouseZero.equals(nameOfSemsHouse)) {
			return semsHouseZero;
		} else if (nameOfSemsHouseOne.equals(nameOfSemsHouse)) {
			return semsHouseOne;
		} else {
			return null;
		}
	}
	
	static public void insertContextDetailAtPosition(String context, String detail, int position) {
		App.get(context).addDetail(position, App.get(detail));
		objProperties.getPropertiesOfIdentity(detail).setProperty(CONTEXT, context);
	}
	
	static public void insertLinkDetailAtPosition(SemsObject subject, SemsObject linkDetail, int position) {
		subject.addDetail(position, linkDetail);
	}
	
	static public void clearObjProperties() {
		objProperties = new Properties();
	}
	
	static public Map<String, Object> getJsonOfProperties(String identity) {
		PropertiesOfIdentity props =  App.objProperties.getPropertiesOfIdentity(identity);
		Map<String, Object> propertiesJson = new HashMap<String, Object>();
		for (String property : props.getProperties()) {
			propertiesJson.put(property, props.get(property));
		}
		return propertiesJson;
	}
	
	public static Set<String> getDependenciesSet(Collection<String> addresses) {
		Set<String> dependenciesSet = new HashSet<>();
		for (String address : addresses) {
			dependenciesSet.addAll(new LoadDependencies(address).get());
		}
		return dependenciesSet;
	}
	

	public static Set<SemsObject> getAllObjects() {
		Set<SemsObject> allObjects = new HashSet<SemsObject>();
		allObjects.addAll(semsHouseOne.getObjects());
		allObjects.addAll(semsHouseZero.getObjects());
		return allObjects;
	}
}