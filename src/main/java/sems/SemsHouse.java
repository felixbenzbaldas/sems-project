package sems;
import static sems.Consts.*;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import sems.general.JsonUtil;
import sems.general.Properties;
import sems.general.Utils;

public class SemsHouse {
	private SemsObject rootObject;
	private Map<String, SemsObject> semsObjectsMap = new HashMap<>();
	private int idCounter = 0;
	
	public List<String> listOfDeletedObjects = new LinkedList<String>();
	
	
	public static SemsHouse createFromJson(Object json) {
		Map<String, Object> jsonObject = (Map<String, Object>) json;
		SemsHouse semsHouse = new SemsHouse();
		semsHouse.setIdCounter(JsonUtil.getInt(jsonObject, ID_COUNTER));
		for (Object obj: JsonUtil.getList(jsonObject, OBJECTS)) {
			SemsObject semsObject = SemsObject.createFromJson(obj, semsHouse);
			semsHouse.semsObjectsMap.put(semsObject.getSemsAddress(), semsObject);
		}
		semsHouse.setRootObject(semsHouse.getInThisHouse(JsonUtil.getString(jsonObject, ROOT_OBJECT)));
		return semsHouse;
	}

	public Object toJson() {
		Map<String, Object> jsonObject = new HashMap<String, Object>();
		jsonObject.put(ROOT_OBJECT, getRootObject().getSemsAddress());
		jsonObject.put(ID_COUNTER, getIdCounter());
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
		String newSemsName = Utils.getRandom(2) + String.valueOf(idCounter++) + Utils.getRandom(2);
		return newSemsName;
	}
	
	public SemsObject createSemsObject(String text) {
		SemsObject obj = createSemsObject();
		App.objProperties.setProperty(obj.getSemsAddress(), TEXT, text);
		return obj;
	}
	
	public SemsObject createSemsObject() {
		SemsObject obj = new SemsObject(App.getNameOfSemsHouse(this) + "-" + createNewSemsName());
		obj.setSemsHouse(this);
		semsObjectsMap.put(obj.getSemsAddress(), obj);
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

	public int getIdCounter() {
		return idCounter;
	}
	public void setIdCounter(int idCounter) {
		this.idCounter = idCounter;
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