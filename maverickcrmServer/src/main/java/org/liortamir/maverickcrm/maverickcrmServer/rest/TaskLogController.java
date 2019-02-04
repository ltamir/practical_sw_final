package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.commons.io.IOUtils;
import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskLogDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.infra.Reference;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskLog;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

@MultipartConfig
public class TaskLogController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	
	private Gson jsonHelper = new GsonBuilder()
			   .setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	private SimpleDateFormat dateFormat=  new SimpleDateFormat();
	private Reference ref = Reference.getInstance();
	private TaskLogDAL dal = TaskLogDAL.getInstance();
	private int maxlog = 0;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		TaskLog taskLog = null;
		JsonObject json = new JsonObject();
		int taskLogId = 0;	

		try {
			ActionEnum action = ServletHelper.getAction(req);
						
			if(action == ActionEnum.ACT_ALL){
				int taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));
				List<TaskLog> bulk = dal.getByTask(taskId);
				json.add("array", jsonHelper.toJsonTree(bulk));			
			}else if(action == ActionEnum.ACT_SINGLE){
				
				taskLogId = Integer.parseInt(req.getParameter("taskLogId"));
				taskLog = dal.get(taskLogId);
				ServletHelper.addJsonTree(jsonHelper, json, "taskLog", taskLog);
			}
			ServletHelper.doSuccess(json);
		}catch(NumberFormatException | SQLException | InvalidActionException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		
		response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		int taskLogId = 0;
		try {
			String sysdate = dateFormat.format(new Date());
			int taskId = 0;
			int contactId = 0;
			String description = null;
			int taskLogTypeId = 0;
			
			for(Part part : req.getParts()) {

				switch(part.getName()) {
				case APIConst.FLD_TASKLOG_TASK_ID:
					taskId = ServletHelper.getPartInt(part);
					break;
				case APIConst.FLD_TASKLOG_CONTACT_ID:
					contactId = ServletHelper.getPartInt(part);
					break;
				case APIConst.FLD_TASKLOG_DESCRIPTION:
					description = ServletHelper.getPartString(part);
					break;
				case APIConst.FLD_TASKLOG_TASKLOGTYPE_ID:
					taskLogTypeId = ServletHelper.getPartInt(part);
					break;						
					default:
						break;
				}
			}				
			
			if(description.length() > maxlog) {	//split large descriptions to several tasklog entries
				StringBuilder sb  = new StringBuilder(description);
				while(sb.length() > 0) {
					sysdate = dateFormat.format(new Date());
					int end = (sb.length()>maxlog)?maxlog-1:sb.length();
					taskLogId = dal.insert(sysdate, taskId, contactId, sb.substring(0, end), taskLogTypeId);
					sb.delete(0, end);
				}
			}else {
				taskLogId = dal.insert(sysdate, taskId, contactId, description, taskLogTypeId);	
			}
			
			json.addProperty(APIConst.FLD_TASKLOG_ID, taskLogId);
			ServletHelper.doSuccess(json);
		}catch(NumberFormatException | SQLException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			json.addProperty(APIConst.FLD_TASKLOG_ID, taskLogId);
		}
		
		String response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	//TODO split if longer than 500 chars
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		try {
			int taskLogId = 0;
			int taskId = 0;
			int contactId = 0;
			String description = null;
			int taskLogTypeId = 0;
			
			for(Part part : req.getParts()) {

				switch(part.getName()) {
				case APIConst.FLD_TASKLOG_ID:
					taskLogId = ServletHelper.getPartInt(part);
					break;
				case APIConst.FLD_TASKLOG_TASK_ID:
					taskId = ServletHelper.getPartInt(part);
					break;
				case APIConst.FLD_TASKLOG_CONTACT_ID:
					contactId = ServletHelper.getPartInt(part);
					break;
				case APIConst.FLD_TASKLOG_DESCRIPTION:
					description = ServletHelper.getPartString(part);
					break;
				case APIConst.FLD_TASKLOG_TASKLOGTYPE_ID:
					taskLogTypeId = ServletHelper.getPartInt(part);
					break;						
					default:
						break;
				}
			}			
						
			dal.update(taskLogId, taskId, contactId, description, taskLogTypeId);
			json.addProperty(APIConst.FLD_TASKLOG_ID, taskLogId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
			json.addProperty(APIConst.FLD_TASKLOG_ID, 0);
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	//TODO implement task log deletion 
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response;
		JsonObject json = new JsonObject();
		try {
			int tasklogId = 0;
			
			Part filePart = req.getPart(APIConst.FLD_TASKLOG_ID);
			int multiplier = 1;
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				tasklogId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}
			dal.delete(tasklogId);
			json.addProperty(APIConst.FLD_TASKLOG_ID, 0);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_DELETE, json, req);
			json.addProperty(APIConst.FLD_TASKLOG_ID, 0);
		}
		response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
	
	@Override
	public void init() throws ServletException {
		super.init();
		dateFormat.applyPattern("yyyy-MM-dd HH:mm:ss");
		maxlog = ref.getAsInt("app.maxlog", 500);
	}

	
}
