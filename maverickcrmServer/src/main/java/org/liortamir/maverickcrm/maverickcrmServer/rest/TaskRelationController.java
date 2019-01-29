package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
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
import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskRelationDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskRelation;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@MultipartConfig
public class TaskRelationController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		TaskRelation taskRelation = null;
		int id = 0;
		int taskId = 0;
		JsonObject json = new JsonObject();
		
		try {
			
			ActionEnum action = ServletHelper.getAction(req);
			if(action == ActionEnum.ACT_SINGLE) {
				
				id = Integer.parseInt(req.getParameter("taskRelationId"));
				taskRelation = TaskRelationDAL.getInstance().get(id);
				ServletHelper.addJsonTree(jsonHelper, json, "taskRelation", taskRelation);
			
			}else if(action == ActionEnum.ACT_RELATION_PARENTS) {

				taskId = Integer.parseInt(req.getParameter("taskId"));
				List<TaskRelation> taskRelationList = TaskRelationDAL.getInstance().getParents(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				
			}else if(action == ActionEnum.ACT_RELATION_CHILDREN) {
				taskId = Integer.parseInt(req.getParameter("taskId"));
				List<TaskRelation> taskRelationList = TaskRelationDAL.getInstance().getChildren(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));	
			}
			ServletHelper.doSuccess(json);
		}catch(SQLException | InvalidActionException | NullPointerException e) {
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

		try {
			int parentTaskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASKRELATION_PARENT_TASK_ID));
			int childTaskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASKRELATION_CHILD_TASK_ID));
			int taskRelationTypeId = Integer.parseInt(req.getParameter(APIConst.FLD_TASKRELATION_TASKRELATIONTYPE_ID));
			
			int taskRelationId = TaskRelationDAL.getInstance().insert(parentTaskId, childTaskId, taskRelationTypeId);
			json.addProperty(APIConst.FLD_TASKRELATION_ID, taskRelationId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			json.addProperty(APIConst.FLD_TASKRELATION_ID, 0);
			if( e instanceof SQLException && ((SQLException)e).getSQLState().equals("23505")) {
				json.addProperty("msg", "relation already exist");
			}	
		}
		String response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		int taskRelationId = 0;
		int parentTaskId = 0;
		int childTaskId = 0;
		int taskRelationTypeId = 0;

		String strParentTaskId = null;
		String strChildTaskId = null;
		try {
	
			DiskFileItemFactory factory = new DiskFileItemFactory();
			ServletContext servletContext = this.getServletConfig().getServletContext();
			File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
			factory.setRepository(repository);
			
			ServletFileUpload upload = new ServletFileUpload(factory);
			List<FileItem> items = upload.parseRequest(req);
			for(FileItem item : items) {
				if(item.isFormField()) {
					switch(item.getFieldName()) {
					case APIConst.FLD_TASKRELATION_ID:
						taskRelationId = Integer.parseInt(item.getString());
						break;
					case APIConst.FLD_TASKRELATION_PARENT_TASK_ID:
						strParentTaskId = item.getString();
						parentTaskId = Integer.parseInt(strParentTaskId);
						break;
					case APIConst.FLD_TASKRELATION_CHILD_TASK_ID:
						strChildTaskId = item.getString();
						childTaskId = Integer.parseInt(strChildTaskId);
						break;
					case APIConst.FLD_TASKRELATION_TASKRELATIONTYPE_ID:
						taskRelationTypeId = Integer.parseInt(item.getString());;
						break;					
						default:
							System.out.println("TaskRelationController.doPut: Invalid field: Name:" + item.getFieldName() + " value:" + item.getString());
					}
				}
			}	
			if(strParentTaskId != null)
				TaskRelationDAL.getInstance().update(taskRelationId, parentTaskId, childTaskId, taskRelationTypeId);
			else
				TaskRelationDAL.getInstance().update(taskRelationId, taskRelationTypeId);
			json.addProperty(APIConst.FLD_TASKRELATION_ID, taskRelationId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | FileUploadException |NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
			json.addProperty(APIConst.FLD_TASKRELATION_ID, 0);
			if( e instanceof SQLException) {
				SQLException sqe = (SQLException)e;
				if(sqe.getSQLState().equals("23505"))
					json.addProperty("msg", "relation already exist");
			}
		}
		String response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		int taskRelationId=0;

		try {
			DiskFileItemFactory factory = new DiskFileItemFactory();
			ServletContext servletContext = this.getServletConfig().getServletContext();
			File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
			factory.setRepository(repository);
			
			ServletFileUpload upload = new ServletFileUpload(factory);
			List<FileItem> items = upload.parseRequest(req);
			for(FileItem item : items) {
				if(item.isFormField()) {
					switch(item.getFieldName()) {
					case APIConst.FLD_TASKRELATION_ID:
						taskRelationId = Integer.parseInt(item.getString());
						break;
					
						default:
							System.out.println("TaskRelationController.doDelete: Invalid field: Name:" + item.getFieldName() + " value:" + item.getString());
					}
				}
			}			
			TaskRelationDAL.getInstance().delete(taskRelationId);
			json.addProperty(APIConst.FLD_TASKRELATION_ID, taskRelationId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | FileUploadException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
			json.addProperty(APIConst.FLD_TASKRELATION_ID, "0");
		}
		String response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}	
}
