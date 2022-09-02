package sems;

import static sems.Consts.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import sems.general.JsonUtil;
import sems.general.PropertiesOfIdentity;

public class SemsObject {

	private String semsAddress;
	private List<String> details = new ArrayList<>();
	private SemsHouse semsHouse;
	private PropertiesOfIdentity props; 
	public boolean hasUnsavedChanges = false;

	public static SemsObject createFromJson(Object json, SemsHouse semsHouse) {
		Map<String, Object> jsonObject = (Map<String, Object>) json;
		SemsObject semsObject = new SemsObject(JsonUtil.getString(jsonObject, SEMS_ADDRESS_PERSISTENCE));
		Map<String, Object> propertiesJson = (Map<String, Object>) jsonObject.get(PROPERTIES);
		for (String property : propertiesJson.keySet()) {
			semsObject.props.setProperty(property, propertiesJson.get(property));
		}
		semsObject.details = JsonUtil.getList(jsonObject, DETAILS).stream().map(
				semsAddress -> (String) semsAddress
				).collect(Collectors.toList());
		semsObject.semsHouse = semsHouse;
		return semsObject;
	}

	public Object toJson() {
		Map<String, Object> jsonObject = new HashMap<String, Object>();
		jsonObject.put(SEMS_ADDRESS_PERSISTENCE, getSemsAddress());
		jsonObject.put(PROPERTIES, App.getJsonOfProperties(getSemsAddress()));
		jsonObject.put(DETAILS, details);
		return jsonObject;
	}
	
	public SemsObject(String semsAddress) {
		this.semsAddress = semsAddress;
		initialize();
	}
	
	private void initialize() {
		props = App.objProperties.getPropertiesOfIdentity(getSemsAddress());
		props.onChanged = (Object obj) -> {
			this.registerChange();
			return null;
		};
		props.setProperty(IS_PRIVATE, false);
		props.setProperty(DEFAULT_EXPANDED, true);
	}
	
	public List<SemsObject> createListOfDetails() {
		return details.stream().map(App::get).collect(Collectors.toList());
	}
	
	public List<String> getDetails() {
		return details;
	}
	
	public void addDetail(SemsObject detail) {
		this.details.add(detail.getSemsAddress());
		registerChange();
	}
	
	public void addDetail(int position, SemsObject detail) {
		this.details.add(position, detail.getSemsAddress());
		registerChange();
	}
	
	public String getSemsAddress() {
		return this.semsAddress;
	}

	public void deleteDetail(SemsObject detail) {
		this.details.remove(detail.getSemsAddress());
		registerChange();
	}
	
	public SemsHouse getSemsHouse() {
		return semsHouse;
	}
	
	public void setSemsHouse(SemsHouse semsHouse) {
		this.semsHouse = semsHouse;
	}
	
	public void clear() {
		deleteAllDetails();
		PropertiesOfIdentity props = App.objProperties.getPropertiesOfIdentity(this.getSemsAddress());
		props.clear();
	}
	
	public void deleteAllDetails() {
		while(!this.details.isEmpty()) {
			this.details.remove(0);
		}
		registerChange();
	}
	
	private void registerChange() {
		this.hasUnsavedChanges = true;
	}
}