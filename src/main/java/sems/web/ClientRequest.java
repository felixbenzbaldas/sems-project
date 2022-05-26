package sems.web;
import static sems.Consts.*;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import sems.App;
import sems.SemsHouse;
import sems.SemsObject;

public class ClientRequest {
	
	private HttpServletRequest request;
	private HttpServletResponse response;
	private PrintWriter out;
	public ClientRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
		this.request = request;
		this.response = response;
		response.setContentType("text/json");
		response.setCharacterEncoding("UTF-8");
		out = response.getWriter();
	}
	
	public String getMethod() {
		return get(METHOD);
	}
	
	public String get(String key) {
		return request.getParameter(key);
	}

	public SemsObject getSemsObject() {
		return (SemsObject) App.get(request.getParameter(SEMS_ADDRESS));
	}
	
	public SemsHouse getSemsHouse() {
		return App.getSemsHouse(request.getParameter(SEMS_HOUSE));
	}
	
	public SemsObject getSemsObject(String key) {
		return (SemsObject) App.get(request.getParameter(key));
	}
	
	public Boolean getBoolean(String key) {
		return Boolean.valueOf(request.getParameter(key));
	}
	
	public Integer getInteger(String key) {
		return Integer.valueOf(request.getParameter(key));
	}
	
	public Object getContentObj() throws IOException{
		String string = request.getReader().readLine();
		return new ObjectMapper().readValue(string, Object.class);
	}
	
	public String getContent() throws IOException {
		return (String) getContentObj();
	}

	public void setResponse(String response) {
		out.println(response);
	}
	
	public void setJsonResponse(SemsObject semsObject) throws JsonProcessingException {
		LoadDependencies creator = new LoadDependencies(semsObject.getSemsAddress());
		setResponse(Web.jsonToString(creator.get()));
	}
}
