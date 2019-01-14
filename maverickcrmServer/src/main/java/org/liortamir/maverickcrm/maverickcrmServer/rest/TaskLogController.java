package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskLogDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
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
	private SimpleDateFormat frm=  new SimpleDateFormat();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response = "{msg:\"Invalid request\"}";
		TaskLog taskLog = null;
		JsonObject json = null;
		int taskLogId = 0;
		int actionId = 0;		

		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
						
			if(actionId == ActionEnum.ACT_ALL.ordinal()){
				int taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));
				List<TaskLog> bulk = null;
				json = new JsonObject();
				bulk = TaskLogDAL.getInstance().getByTask(taskId);
				json.add("array", jsonHelper.toJsonTree(bulk));			
				response = jsonHelper.toJson(json);	

			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				
				taskLogId = Integer.parseInt(req.getParameter("taskLogId"));
				taskLog = TaskLogDAL.getInstance().get(taskLogId);
				json = new JsonObject();
				response = jsonHelper.toJson(taskLog);	

			}
		}catch(NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doGet: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		try {
			String sysdate = frm.format(new Date());
			int taskId = Integer.parseInt(req.getParameter("taskId"));
			int contactId = Integer.parseInt(req.getParameter("contactId"));
			String description = req.getParameter("description");
			int taskLogTypeId = Integer.parseInt(req.getParameter("taskLogTypeId"));
			
			int taskLogId = TaskLogDAL.getInstance().insert(sysdate, taskId, contactId, description, taskLogTypeId);
			json.addProperty("taskId", taskLogId);
		}catch(NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doPost: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
		}
		String response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		try {
			int taskLogId = 0;
			String sysdate = null;
			int taskId = 0;
			int contactId = 0;
			String description = null;
			int taskLogTypeId = 0;
			
			
			DiskFileItemFactory factory = new DiskFileItemFactory();
			ServletContext servletContext = this.getServletConfig().getServletContext();
			File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
			factory.setRepository(repository);
			
			ServletFileUpload upload = new ServletFileUpload(factory);
			List<FileItem> items = upload.parseRequest(req);
			for(FileItem item : items) {
				if(item.isFormField()) {
					switch(item.getFieldName()) {
					case APIConst.FLD_TASKLOG_ID:
						taskLogId = Integer.parseInt(item.getString());
						break;
					case APIConst.FLD_TASKLOG_SYSDATE:
						sysdate = item.getString();
						if(sysdate.contains(","))
							sysdate = sysdate.replace(",", "");
						break;
					case APIConst.FLD_TASKLOG_TASK_ID:
						taskId = Integer.parseInt(item.getString());
						break;
					case APIConst.FLD_TASKLOG_CONTACT_ID:
						contactId = Integer.parseInt(item.getString());
						break;
					case APIConst.FLD_TASKLOG_DESCRIPTION:
						description = item.getString();
						break;
					case APIConst.FLD_TASKLOG_TASKLOGTYPE_ID:
						taskLogTypeId = Integer.parseInt(item.getString());
						break;					
						default:
							System.out.println("CustomerHandler.doPut: Invalid field: Name:" + item.getFieldName() + " value:" + item.getString());
					}
				}
			}			
			TaskLogDAL.getInstance().update(taskLogId, taskId, contactId, description, taskLogTypeId);
			json.addProperty("taskLogId", taskLogId);

		}catch(SQLException | FileUploadException | NumberFormatException e) {
			System.out.println(this.getClass().getName() + ".doPut: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
			json.addProperty("taskId", "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	public void init() throws ServletException {
		super.init();
		frm.applyPattern("yyyy-MM-dd HH:mm:ss");
	}

	
}
