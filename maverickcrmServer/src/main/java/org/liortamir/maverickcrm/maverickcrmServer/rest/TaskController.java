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
import javax.servlet.http.Part;

import org.apache.commons.io.IOUtils;
import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;
import org.liortamir.maverickcrm.maverickcrmServer.model.Task;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskPermission;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * This servlet controls all actions on the resource task.
 * @author liort
 *
 */
@WebServlet(name = "Task", urlPatterns="/task")
@MultipartConfig
public class TaskController extends HttpServlet {

	private static final long serialVersionUID = -2104805615225405434L;
	
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Task task = null;
		List<Task> taskRelationList;
		JsonObject json = new JsonObject();
		int taskId = 0;

		try {
			req.getRequestDispatcher("authenticate?actionId=16").include(req, resp);
			Login login = (Login)req.getSession().getAttribute("login");
			
			ActionEnum action = ServletHelper.getAction(req);
			switch(action) {
			case ACT_ALL:
				List<Task> taskList = null;			
				int customerId = Integer.parseInt(req.getParameter("customerId"));
				String dueDate = req.getParameter("duedate");
				String title = req.getParameter("title");
				int projectId = Integer.parseInt(req.getParameter("projectId"));
				int taskTypeId = Integer.parseInt(req.getParameter("tasktypeId"));
				int status = Integer.parseInt(req.getParameter("showclosed"));
				taskList = TaskDAL.getInstance().getAll(customerId, dueDate, title, projectId, taskTypeId, status,login.getLoginId());
				json.add("array", jsonHelper.toJsonTree(taskList));
				
				break;
			case ACT_SINGLE:
				req.getRequestDispatcher("taskpermission?actionId=19&"+APIConst.FLD_LOGIN_ID + "="+login.getLoginId()).include(req, resp);
				TaskPermission taskPermission = (TaskPermission)req.getSession().getAttribute("taskPermission");
				
				taskId = Integer.parseInt(req.getParameter("taskId"));
				task = TaskDAL.getInstance().get(taskId, login.getLoginId());
				ServletHelper.addJsonTree(jsonHelper, json, "task", task);
				ServletHelper.addJsonTree(jsonHelper, json, "taskPermission", taskPermission);
				break;
			case ACT_RELATION_PARENTS:
				taskId = Integer.parseInt(req.getParameter("taskId"));
				taskRelationList = TaskDAL.getInstance().getParents(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				break;
			case ACT_RELATION_CHILDREN:
				taskId = Integer.parseInt(req.getParameter("taskId"));
				taskRelationList = TaskDAL.getInstance().getChildren(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				break;
			default:
				throw new InvalidActionException(action.ordinal());
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
		int taskTypeId = 0;
		int contactId = 0;
		String title = null;
		int effort = 0;
		int effortUnit = 0;
		String dueDate = null;
		int statusId = 0;
		
		for(Part part : req.getParts()) {
			switch(part.getName()) {
			case APIConst.FLD_TASK_TASKTYPEID:
				taskTypeId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
				break;
			case APIConst.FLD_CONTACT_ID:
				contactId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
				break;
			case APIConst.FLD_TASK_TITLE:
				title = new String(IOUtils.toByteArray(part.getInputStream()));
				break;
			case APIConst.FLD_TASK_EFFORT:
				effort = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
				break;
			case APIConst.FLD_TASK_EFFORT_UNIT:
				effortUnit = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
				break;	
			case APIConst.FLD_TASK_DUE_DATE:
				dueDate = new String(IOUtils.toByteArray(part.getInputStream()));
				break;
			case APIConst.FLD_TASK_STATUS_ID:
				statusId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
				break;	
			default:
				System.out.println(this.getClass().getName() + ".doPost: Invalid field: Name:" + part.getName());				
			}
		}
		
		try {
			int taskId = TaskDAL.getInstance().insert(taskTypeId, contactId, title, effort, effortUnit, dueDate, statusId);
			json.addProperty(APIConst.FLD_TASK_ID, taskId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			if(e instanceof SQLException && ((SQLException)e).getSQLState().equals("22001"))
				json.addProperty("msg",  "title too long");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		int taskId = 0;
		int taskTypeId = 0;
		int contactId = 0;
		int effort = 0;
		int effortUnit = 0;
		String title = null;
		String dueDate = null;
		int statusId = 0;
		try {
	
			for(Part part : req.getParts()) {
				switch(part.getName()) {
				case APIConst.FLD_TASK_ID:
					taskId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;				
				case APIConst.FLD_TASK_TASKTYPEID:
					taskTypeId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_ID:
					contactId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_TASK_TITLE:
					title = new String(IOUtils.toByteArray(part.getInputStream()));
					break;
				case APIConst.FLD_TASK_EFFORT:
					effort = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_TASK_EFFORT_UNIT:
					effortUnit = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;	
				case APIConst.FLD_TASK_DUE_DATE:
					dueDate = new String(IOUtils.toByteArray(part.getInputStream()));
					break;
				case APIConst.FLD_TASK_STATUS_ID:
					statusId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;	
				default:
					System.out.println(this.getClass().getName() + ".doPut: Invalid field: Name:" + part.getName());				
				}
			}
			

			TaskDAL.getInstance().update(taskId, taskTypeId, contactId, title, effort, effortUnit, dueDate, statusId);
			json.addProperty(APIConst.FLD_TASK_ID, taskId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
		}
		
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	
}
