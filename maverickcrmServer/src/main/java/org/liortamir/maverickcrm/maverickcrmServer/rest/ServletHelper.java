package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;

import org.apache.commons.io.IOUtils;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.infra.IUserExceptionMessage;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class ServletHelper {

	public static final String METHOD_GET = "doGet()";
	public static final String METHOD_POST = "doPost()";
	public static final String METHOD_PUT = "doPut()";
	public static final String METHOD_DELETE = "doDelete()";
	
	public static final ActionEnum[] ACTION_LIST = ActionEnum.values();
	private static SimpleDateFormat dateFormat=  new SimpleDateFormat();
	
	static {
		dateFormat.applyPattern("yyyy-MM-dd HH:mm:ss");
	}
	
	public static void doError(Exception e, Object servlet, String method, JsonObject json, HttpServletRequest req) {
		String sysdate = dateFormat.format(new Date());
		final String DOT = ".";
		final String SPACE = " ";
		StringBuilder sb = new StringBuilder();
		sb.append(sysdate).append(SPACE).append(servlet.getClass().getName()).append(DOT).append(method).append(SPACE).append(e.toString());

		if(e.getCause() != null)
			if(e.getCause().getCause() != null)
				if(e.getCause().getCause().getCause() != null){
					sb.append(SPACE);
					sb.append(e.getCause().getCause().getCause());
				}
		sb.append(SPACE);
		sb.append(req.getQueryString());
		
		for(StackTraceElement s : e.getStackTrace()) {
			if(s.toString().contains("org.liortamir")){
				sb.append("\n" + s);
				break;
			}
		}
		
		if(e instanceof IUserExceptionMessage)
			json.addProperty("msg",  ((IUserExceptionMessage)e).getUserMessage());
		else
			json.addProperty("msg",  "Internal error, please check the log");
		json.addProperty("err",  sb.toString());
		json.addProperty("status",  "nack");
		
		System.out.println(sb.toString());
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
			actionEnum = ACTION_LIST[actionId];
		}catch(NumberFormatException | NullPointerException e) {
			throw new InvalidActionException(actionParam);
		}
		return actionEnum;
	}
	
	public static String getPartString(Part part) throws IOException, NullPointerException{
		return new String(IOUtils.toByteArray(part.getInputStream()));
	}
	
	public static Integer getPartInt(Part part) throws IOException, NullPointerException{
		String strPart = getPartString(part);
		return (strPart.equals("null"))?0:Integer.valueOf(strPart);
	}	
}
