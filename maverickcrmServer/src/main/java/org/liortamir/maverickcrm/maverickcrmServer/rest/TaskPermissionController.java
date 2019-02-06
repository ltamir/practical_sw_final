package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskPermissionDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskPermission;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

@WebServlet(name = "TaskPermission", urlPatterns="/taskpermission")
@MultipartConfig
public class TaskPermissionController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4769452647655368178L;
	private Gson jsonHelper = null;
	private TaskPermissionDAL dal = TaskPermissionDAL.getInstance();
	

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		TaskPermission taskPermission = null;
		List<TaskPermission> bulk = null;
		JsonObject json = new JsonObject();
		int id = 0;
		int actionId = 0;

		try {
			ActionEnum action = ServletHelper.getAction(req);

			switch(action) {
			case ACT_ALL:
				bulk = dal.getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;
			case ACT_SINGLE:
				id = Integer.parseInt(req.getParameter(APIConst.FLD_TASKPERMISSION_ID));
				taskPermission = dal.get(id);
				ServletHelper.addJsonTree(jsonHelper, json, "taskPermission", taskPermission);
				break;
			case ACT_BY_TASK:
				id = Integer.parseInt(req.getParameter("taskId"));
				bulk = dal.getByTask(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;
			default:
				throw new InvalidActionException(actionId);
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
		resp.setContentType(APIConst.CONTENT_TYPE);
		JsonObject json = new JsonObject();
		try {
			int taskPermissionId = 0;
			int taskId = ServletHelper.getPartInt(req.getPart(APIConst.FLD_TASK_ID));
			int loginId = ServletHelper.getPartInt(req.getPart(APIConst.FLD_LOGIN_ID));
			int permissionTypeId = ServletHelper.getPartInt(req.getPart(APIConst.FLD_TASKPERMISSION_PERMISSIONTYPEID));

			taskPermissionId = dal.insert(taskId, loginId, permissionTypeId);
			json.addProperty(APIConst.FLD_TASKPERMISSION_ID, taskPermissionId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			json.addProperty(APIConst.FLD_TASKPERMISSION_ID, "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);		
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		JsonObject json = new JsonObject();
		try {
			int taskPermissionId = ServletHelper.getPartInt(req.getPart(APIConst.FLD_TASKPERMISSION_ID));
			int taskId = ServletHelper.getPartInt(req.getPart(APIConst.FLD_TASK_ID));
			int loginId = ServletHelper.getPartInt(req.getPart(APIConst.FLD_LOGIN_ID));
			int permissionTypeId = ServletHelper.getPartInt(req.getPart(APIConst.FLD_TASKPERMISSION_PERMISSIONTYPEID));

			dal.update(taskPermissionId, taskId, loginId, permissionTypeId);
			json.addProperty(APIConst.FLD_TASKPERMISSION_ID, taskPermissionId);

			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
			json.addProperty(APIConst.FLD_TASKPERMISSION_ID, "0");
		}
		
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		JsonObject json = new JsonObject();
		try {
			int taskPermissionId = ServletHelper.getPartInt(req.getPart(APIConst.FLD_TASKPERMISSION_ID));

			dal.delete(taskPermissionId);
			json.addProperty(APIConst.FLD_TASKPERMISSION_ID, taskPermissionId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_DELETE, json, req);
			json.addProperty(APIConst.FLD_TASKPERMISSION_ID, 0);
		}
		response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
	
	@Override
	public void init() throws ServletException {

		GsonBuilder gsonBuilder = new GsonBuilder();  
		gsonBuilder.serializeNulls();  
		this.jsonHelper = gsonBuilder.create();
	}	
}
