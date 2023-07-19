package sems;

import static sems.Consts.*;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import sems.general.Config;
import sems.general.PropertiesOfIdentity;
import sems.web.LoadDependencies;
import sems.web.Web;

public class App {
	
	public static SemsHouse semsHouseZero;
	public static SemsHouse semsHouseOne;
	public static String nameOfSemsHouseZero = "0";
	public static String nameOfSemsHouseOne= "1";
	
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
		SemsObject detailObj = App.get(detail);
		App.get(context).addDetail(position, detailObj);
		detailObj.props.setProperty(CONTEXT, context);
	}
	
	static public void insertLinkDetailAtPosition(SemsObject subject, SemsObject linkDetail, int position) {
		subject.addDetail(position, linkDetail);
	}
	
	static public Map<String, Object> getJsonOfProperties(PropertiesOfIdentity props) {
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
	
	public static List<SemsObject> search(String searchText) {
		List<SemsObject> searchResult = new LinkedList<SemsObject>();
		for (SemsObject obj : getAllObjects()) {
			if (obj.getText().toLowerCase().contains(searchText.toLowerCase())) {
				searchResult.add(obj);
			}
		}
		return searchResult;
	}
	
	public static List<String> searchLinkContexts(String address) {
		SemsObject obj = App.get(address);
		List<String> searchResult = new LinkedList<>();
		for (SemsObject current : getAllObjects()) {
			if (current.getDetails().contains(address)) {
				if (!current.getSemsAddress().equals(obj.props.get(CONTEXT))) {
					searchResult.add(current.getSemsAddress());
				}
			}
		}
		return searchResult;
	}
}