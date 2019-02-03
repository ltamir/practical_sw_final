package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;

import org.apache.commons.io.IOUtils;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class ServletHelper {

	public static final String METHOD_GET = "doGet()";
	public static final String METHOD_POST = "doPost()";
	public static final String METHOD_PUT = "doPut()";
	public static final String METHOD_DELETE = "doDelete()";
	
	public static void doError(Exception e, Object servlet, String method, JsonObject json, HttpServletRequest req) {
		StringBuilder sb = new StringBuilder();
		sb.append(servlet.getClass().getName() );
		sb.append(".");
		sb.append(method);
		sb.append("(): ");
		sb.append(e.toString());
		sb.append(" ");
		sb.append(req.getQueryString());
		
		System.out.println(sb.toString());
		json.addProperty("msg",  "Internal error, please check the log");
		json.addProperty("err",  e.toString());
		json.addProperty("status",  "nack");
	}
	
	public static void doSuccess(JsonObject json) {
		json.addProperty("status",  "ack");
	}
	
	public static String toJson(Gson jsonHelper, Object obj){
		return jsonHelper.toJson(obj);
	}
	
	public static void addJsonTree(Gson jsonHelper, JsonObject json, String key, Object obj) {
		json.add(key, jsonHelper.toJsonTree(obj));
	}
	
	public static int getActionId(String action) throws InvalidActionException{
		int actionId = 0;
		try {
			actionId = Integer.parseInt(action);
		}catch(NumberFormatException e) {
			throw new InvalidActionException(action);
		}
		return actionId;
	}
	
	public static ActionEnum getAction(HttpServletRequest req) throws InvalidActionException{
		ActionEnum actionEnum;
		String actionParam = req.getParameter(APIConst.PARAM_ACTION_ID);
		try {
			int actionId = Integer.parseInt(actionParam);
			actionEnum = APIConst.ACTION_LIST[actionId];
		}catch(NumberFormatException | NullPointerException e) {
			throw new InvalidActionException(actionParam);
		}
		return actionEnum;
	}
	
	public static String getPartString(Part part) throws IOException{
		return new String(IOUtils.toByteArray(part.getInputStream()));
	}
	
	public static Integer getPartInt(Part part) throws IOException{
		String strPart = getPartString(part);
		return (strPart.equals("null"))?0:Integer.valueOf(strPart);
	}	
}
