package sems.web;

import static sems.Consts.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import sems.App;
import sems.Persistence;
import sems.Scripts;
import sems.SemsObject;
import sems.general.Config;
import sems.general.ThrowingConsumer;

@SuppressWarnings("serial")
public class Web extends HttpServlet {

	private static Map<String, ThrowingConsumer<ClientRequest>> responses = new HashMap<>();
	
	@Override
	public void init() {
		try {
			App.initialize();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doGetPost(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doGetPost(req, resp);
	}
	
	static public void doGetPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		try {
			handleClientRequest(new ClientRequest(request, response));
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	
	public static void createResponses() {
		addResponse(GET_OBJ, cr -> {
			Set<String> loadDependencies = new LoadDependencies(cr.get(SEMS_ADDRESS)).get();
			cr.setResponse(jsonToString(setToJson(loadDependencies)));
		});
		addResponse(ROOT_OBJECT, cr -> {
			cr.setResponse(jsonToString(App.semsHouseOne.getRootObject().getSemsAddress()));
		});
		addResponse(GET_DETAILS, cr -> {
			Map<String, Object> json = new HashMap<>();
			List<String> details = cr.getSemsObject().getDetails();
			json.put(DETAILS, details);
			json.put(LOAD_DEPENDENCIES, setToJson(App.getDependenciesSet(details)));
			cr.setResponse(jsonToString(json));
		});
		if (!runOnServer()) {
			addResponse(TEXT_OBJECT, cr -> {
				String text = cr.getContent();
				SemsObject obj = cr.getSemsHouse().createSemsObject(text);
				cr.setResponse(obj.getSemsAddress());
			});
			addResponse(SET_PROPERTY, cr -> {
				SemsObject semsObject = cr.getSemsObject();
				Object contentObj = cr.getContentObj();
				semsObject.props.setProperty(cr.get(PROPERTY), contentObj);
			});
			//
			addResponse(DETAIL, cr -> {
				App.insertContextDetailAtPosition(cr.get(CONTEXT), cr.get(DETAIL), 0);
			});
			addResponse(CONTEXT_DETAIL_AT_POSITION, cr -> {
				SemsObject context = cr.getSemsObject(CONTEXT);
				String text = cr.getContent();
				SemsObject insertedObject = cr.getSemsHouse().insertContextDetailAtPosition(context, text, cr.getInteger(POSITION));
				cr.setResponse(insertedObject.getSemsAddress());
			});
			addResponse(INSERT_LINK_DETAIL_AT_POSITION, cr -> {
				App.insertLinkDetailAtPosition(cr.getSemsObject(CONTEXT), cr.getSemsObject(DETAIL), cr.getInteger(POSITION));
			});
			addResponse(DELETE_DETAIL, cr -> {
				cr.getSemsObject(CONTEXT).deleteDetail(cr.getSemsObject(DETAIL));
			});
			//
			addResponse(SAVE, cr -> {
				String dirPath = Persistence.getBasePath() + "savings/" + Persistence.getTimestamp() + "/";
				Persistence.saveSemsHouse(dirPath, App.semsHouseZero);
				Persistence.saveSemsHouse(dirPath, App.semsHouseOne);
				cr.setResponse(SUCCESS);
			});
			addResponse(SAVE_CHANGES, cr -> {
				String dirPath = Persistence.getBasePath() + "savings/" + Persistence.getTimestamp() + "-" + CHANGES + "/";
				Persistence.saveChangesOfSemsHouse(dirPath, App.semsHouseZero);
				Persistence.saveChangesOfSemsHouse(dirPath, App.semsHouseOne);
				cr.setResponse(SUCCESS);
			});
			addResponse(CLEAR, cr -> {
				cr.getSemsObject().clear();
				cr.setResponse(SUCCESS);
			});
			addResponse(CLEAN, cr -> {
				Scripts.clean();
				cr.setResponse(SUCCESS);
			});
			addResponse(UPDATE, cr -> {
				Scripts.update();
				cr.setResponse(SUCCESS);
			});
			addResponse(SEARCH, cr -> {
				SemsObject semsObject = cr.getSemsObject();
				String searchText = semsObject.getText();
				List<SemsObject> searchResultOfHouseOne = App.semsHouseOne.search(searchText); // XXX hier muss eine Sicherheitsüberprüfung statt finden!!!
				semsObject.getDetails().addAll(searchResultOfHouseOne.stream().map(obj -> obj.getSemsAddress()).collect(Collectors.toList()));
				semsObject.props.setProperty(TEXT, "searched");
				String semsAddress = semsObject.getSemsAddress();
				Set<String> loadDependencies = new LoadDependencies(semsAddress).get();
				cr.setResponse(jsonToString(setToJson(loadDependencies)));
			});
		}
	}

	static void handleClientRequest(ClientRequest cr) throws Exception {
		if (securityVerification(cr)) {
			String semsMethod = cr.getMethod();
			if (responses.containsKey(semsMethod)) {
				responses.get(semsMethod).accept(cr);
			}
		} else {
			throw new RuntimeException("security verification failed!");
		}
	}
	
	static boolean securityVerification(ClientRequest cr) {
		if (runOnServer()) {
			return true;
		} else {
			String auth = Config.get("auth");
			return auth.equals(cr.get("auth"));
		}
	}
	
	static void addResponse(String method, ThrowingConsumer<ClientRequest> responseCreator) {
		responses.put(method, responseCreator);
	}

	public static String jsonToString(Object jsonObject) throws JsonProcessingException {
		return new ObjectMapper().writeValueAsString(jsonObject);
	}
	
	private static List<Object> setToJson(Set<String> addresses) {
		List<Object> jsonObjects = new ArrayList<>();
		for (String dependency : addresses) {
			jsonObjects.add(JsonWeb.getJson(App.get(dependency)));
		}
		return jsonObjects;		
	}
	
	public static boolean runOnServer() {
		return Boolean.valueOf(Config.get("runOnServer"));
	}
}