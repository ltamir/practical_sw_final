package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Collections;
import java.util.Comparator;
import java.util.ConcurrentModificationException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.DispatcherType;
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
import org.liortamir.maverickcrm.maverickcrmServer.infra.InvalidPermissionException;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;
import org.liortamir.maverickcrm.maverickcrmServer.model.Task;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskPermission;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
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
	private TaskDAL dal = TaskDAL.getInstance();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Task task = null;
		List<Task> taskRelationList;
		JsonObject json = new JsonObject();
		int taskId = 0;

		try {
			req.getRequestDispatcher("/authenticate?actionId=16").include(req, resp);
			Login login = (Login)req.getSession().getAttribute("login");
			
			ActionEnum action = ServletHelper.getAction(req);
			switch(action) {
			case GET_ALL:
				getTasks(req, login, json);
				break;
			case TASKLIST_SORT:
				int sortField = Integer.parseInt(req.getParameter("sort"));
				TaskListSort sorter = TaskListSort.values()[sortField];
				List<Task> taskList = dal.getTaskList(login.getLoginId(), 0);
				sorter.sort(taskList);
				json.add("array", jsonHelper.toJsonTree(taskList));
				break;
			case GET_SINGLE:
				String id = req.getParameter(APIConst.FLD_TASK_ID);
				taskId = Integer.parseInt(id);
				req.getRequestDispatcher("taskpermission?actionId=19&"+APIConst.FLD_LOGIN_ID + "="+login.getLoginId() + "&taskId=" + id).include(req, resp);
				TaskPermission taskPermission = (TaskPermission)req.getSession().getAttribute("taskPermission");
				if(taskPermission == null){// in case there are no permissions
					throw new InvalidPermissionException(taskId,login.getLoginId());
				}
				task = dal.get(taskId, login.getLoginId());
				if(req.getDispatcherType() == DispatcherType.INCLUDE) {
					req.getSession().setAttribute("task", task);
					return;
				}				
				ServletHelper.addJsonTree(jsonHelper, json, "task", task);
				ServletHelper.addJsonTree(jsonHelper, json, "taskPermission", taskPermission);
				break;
			case GET_RELATION_PARENTS:
				taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));
				taskRelationList = dal.getParents(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				break;
			case GET_TASK_CHILDREN:
				taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));
				taskRelationList = dal.getChildren(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				break;
			default:
				throw new InvalidActionException(action.ordinal());
			}
			req.getSession().removeAttribute("login");
			ServletHelper.doSuccess(json);
		}catch(NumberFormatException | NullPointerException | SQLException | InvalidActionException |InvalidPermissionException e) {
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
			int taskId = dal.insert(taskTypeId, contactId, title, effort, effortUnit, dueDate, statusId);
//			if(taskTypeId == 1) {	//if this is a project task assign edit permission to the creator
//			
//				req.getRequestDispatcher("login?actionId=20&contactId=" + APIConst.FLD_CONTACT_ID).include(req, resp);
//				Login login = (Login)req.getSession().getAttribute("login");
//				req.getRequestDispatcher("taskpermision?contactId=" + APIConst.FLD_CONTACT_ID).include(req, resp);
//				req.getSession().removeAttribute("login");
//			}
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
			

			dal.update(taskId, taskTypeId, contactId, title, effort, effortUnit, dueDate, statusId);
			json.addProperty(APIConst.FLD_TASK_ID, taskId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
		}
		
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
	
	private void getTasks(HttpServletRequest req, Login login, JsonObject json) throws SQLException{
		List<Task> taskList = null;	
		TaskListSort sorter = TaskListSort.DUE_DATE;
		String queryString = req.getQueryString();
		int reqHash = queryString.hashCode();
		sessions.add(req.getSession().getId());
		try{
			synchronized (login) {
				taskList = dal.getTaskList(login.getLoginId(), reqHash);
				if(taskList == null){
					taskList = getTasks(req, login);
					
					dal.addTaskList(login.getLoginId(), reqHash, taskList);
				}
				sorter.sort(taskList);
				JsonElement jsonTaskList = jsonHelper.toJsonTree(taskList);
				json.add("array", jsonTaskList);
				
			}
		}catch(ConcurrentModificationException e){
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
			System.out.println(sessions);
		}
		
	}
	
//	private void formatEffortDisplay(List<Task> taskList) {
//		String ff;
//		taskList.stream().forEach((t) -> {
//			int hours = 0, days = 0, months = 0;
//			hours = t.getEffort();
//			if(hours >= 20){
//				months = hours / 9 / 20;
//				hours = hours % (9*20);		
//			}
//			if(hours >= 9){
//				days = hours / 9;
//				hours = hours % 9;		
//			}
//			ff = months + ':' + days + ':' + hours;			
//		});
//	}
	private static Set<String> sessions = new HashSet<>();
	
	private List<Task> getTasks(HttpServletRequest req, Login login) throws SQLException{
		int customerId = Integer.parseInt(req.getParameter("customerId"));
		String dueDate = req.getParameter("duedate");
		dueDate = (dueDate.equals("null"))?"":dueDate;
		String title = req.getParameter("title");
		int projectId = Integer.parseInt(req.getParameter("projectId"));
		int taskTypeId = Integer.parseInt(req.getParameter("tasktypeId"));
		int status = Integer.parseInt(req.getParameter("showclosed"));
		return dal.getAll(customerId, dueDate, title, projectId, taskTypeId, status,login.getLoginId());
	}
	
	enum TaskListSort{
		TASK_TYPE {
			@Override
			Comparator<Task> getFieldCmp() {
				return (t1, t2)-> t1.getTaskType().compareTo(t2.getTaskType());
			}
		},
		TITLE {
			@Override
			Comparator<Task> getFieldCmp() {
				return (t1, t2)-> t1.getTitle().compareTo(t2.getTitle());
			}
		},
		DUE_DATE {
			@Override
			Comparator<Task> getFieldCmp() {
				return (t1, t2)->t1.getDueDate().compareTo(t2.getDueDate());
			}
		},
		EFFORT {
			@Override
			Comparator<Task> getFieldCmp() {
				return (t1, t2)-> BLHelper.getEffortHours(t1.getEffortUnit(), t1.getEffort()) - BLHelper.getEffortHours(t2.getEffortUnit(), t2.getEffort());
			}
		},
		STATUS {
			@Override
			Comparator<Task> getFieldCmp() {
				return (t1, t2)->t1.getStatus().compareTo(t2.getStatus());
			}
		};		

		abstract Comparator<Task> getFieldCmp();
		
		public void sort(List<Task> taskList){
			Collections.sort(taskList,getFieldCmp());}
	}
	
}
