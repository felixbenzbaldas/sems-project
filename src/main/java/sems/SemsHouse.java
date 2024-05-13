package sems;
import static sems.Consts.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import sems.general.JsonUtil;
import sems.core.RandomString;

public class SemsHouse {
	private SemsObject rootObject;
	private Map<String, SemsObject> semsObjectsMap = new HashMap<>();
	private List<String> listOfDeletedObjects = new LinkedList<String>();
	
	private List<String> doNotLoadList = new LinkedList<String>();

	private RandomString randomString = new RandomString();

	
	public static SemsHouse createFromJson(Object json) {
		Map<String, Object> jsonObject = (Map<String, Object>) json;
		SemsHouse semsHouse = new SemsHouse();
		for (Object obj: JsonUtil.getList(jsonObject, OBJECTS)) {
			SemsObject semsObject = SemsObject.createFromJson(obj, semsHouse);
			semsHouse.semsObjectsMap.put(semsObject.getSemsAddress(), semsObject);
		}
		semsHouse.setRootObject(semsHouse.getInThisHouse(JsonUtil.getString(jsonObject, ROOT_OBJECT)));
		return semsHouse;
	}

	
	public static void loadFromJson(SemsHouse semsHouse, Object json) {
		Map<String, Object> jsonObject = (Map<String, Object>) json;
		if (jsonObject.containsKey(DELETED_OBJECTS_LIST)) {
			semsHouse.doNotLoadList.addAll(JsonUtil.getList(jsonObject, DELETED_OBJECTS_LIST).stream().map(
					semsAddress -> (String) semsAddress
					).collect(Collectors.toList()));
		}
		for (Object obj: JsonUtil.getList(jsonObject, OBJECTS)) {
			String semsAddressOfJsonObj = getSemsAddressOfJsonObj(obj);
			if (!semsHouse.semsObjectsMap.containsKey(semsAddressOfJsonObj)) {
				if (!semsHouse.doNotLoadList.contains(semsAddressOfJsonObj)) {
					SemsObject semsObject = SemsObject.createFromJson(obj, semsHouse);
					semsHouse.semsObjectsMap.put(semsObject.getSemsAddress(), semsObject);
				}
			}
		}
		if (jsonObject.containsKey(ROOT_OBJECT)) {
			semsHouse.setRootObject(semsHouse.getInThisHouse(JsonUtil.getString(jsonObject, ROOT_OBJECT)));
		}
	}
	
	private static String getSemsAddressOfJsonObj(Object jsonObj) {
		Map<String, Object> jsonObject = (Map<String, Object>) jsonObj;
		return (String) jsonObject.get(SEMS_ADDRESS_PERSISTENCE);
	}

	public Object toJson() {
		Map<String, Object> jsonObject = new HashMap<String, Object>();
		jsonObject.put(ROOT_OBJECT, getRootObject().getSemsAddress());
		List<Object> objects = new LinkedList<Object>();
		for (SemsObject semsObject : getObjects()) {
			objects.add(semsObject.toJson());
		}
		jsonObject.put(OBJECTS, objects);
		return jsonObject;
	}

	public Object getChangesAsJson() {
		Map<String, Object> jsonObject = new HashMap<String, Object>();
		List<Object> objects = new LinkedList<Object>();
		for (SemsObject semsObject : getObjects()) {
			if (semsObject.hasUnsavedChanges) {
				objects.add(semsObject.toJson());
			}
		}
		jsonObject.put(OBJECTS, objects);
		jsonObject.put(DELETED_OBJECTS_LIST, listOfDeletedObjects);
		return jsonObject;
	}
	
	public String createNewSemsName() {
		return randomString.next();
	}
	
	public SemsObject createSemsObject(String text) {
		SemsObject obj = createSemsObject();
		obj.props.setProperty(TEXT, text);
		return obj;
	}
	
	public SemsObject createSemsObject() {
		SemsObject obj = new SemsObject(App.getNameOfSemsHouse(this) + "-" + createNewSemsName());
		obj.setSemsHouse(this);
		semsObjectsMap.put(obj.getSemsAddress(), obj);
		obj.installChangeDetection();
		return obj;
	}

	public SemsObject insertContextDetailAtPosition(SemsObject context, String text, int position) {
		SemsObject detail = createSemsObject(text);
		App.insertContextDetailAtPosition(context.getSemsAddress(), detail.getSemsAddress(), position);
		return detail;
	}
	
	
	public SemsObject getInThisHouse(String semsAddress) {
		return semsObjectsMap.get(semsAddress);
	}

	public SemsObject getRootObject() {
		return (SemsObject) rootObject;
	}
	
	public void setRootObject(SemsObject obj) {
		this.rootObject = obj;
	}

	public Collection<SemsObject> getObjects() {
		return semsObjectsMap.values();
	}
	
	public void removeSemsObject(SemsObject toRemove) {
		semsObjectsMap.remove(toRemove.getSemsAddress());
		listOfDeletedObjects.add(toRemove.getSemsAddress());
	}
	
	public void removeChangeMarks() {
		for (SemsObject semsObject : getObjects()) {
			if (semsObject.hasUnsavedChanges) {
				semsObject.hasUnsavedChanges = false;
			}
		}
	}
	
	public void resetListOfDeletedObjects() {
		listOfDeletedObjects = new LinkedList<String>();
	}
}