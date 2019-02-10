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

import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskRelationDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.infra.SecurityHandler;
import org.liortamir.maverickcrm.maverickcrmServer.model.Task;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskRelation;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "TaskRelation", urlPatterns="/taskrelation")
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
				
				id = Integer.parseInt(req.getParameter(APIConst.FLD_TASKRELATION_ID));
				taskRelation = TaskRelationDAL.getInstance().get(id);
				ServletHelper.addJsonTree(jsonHelper, json, "taskRelation", taskRelation);
			
			}else if(action == ActionEnum.ACT_RELATION_PARENTS) {

				taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));
				List<TaskRelation> taskRelationList = TaskRelationDAL.getInstance().getParents(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				
			}else if(action == ActionEnum.ACT_RELATION_CHILDREN) {
				taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));
				List<TaskRelation> taskRelationList = TaskRelationDAL.getInstance().getChildren(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));	
			}
			ServletHelper.doSuccess(json);
		}catch(SQLException | InvalidActionException | NullPointerException |NumberFormatException e) {
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
			int parentTaskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASKRELATION_PARENT_TASK_ID));
			int childTaskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASKRELATION_CHILD_TASK_ID));
			int taskRelationTypeId = Integer.parseInt(req.getParameter(APIConst.FLD_TASKRELATION_TASKRELATIONTYPE_ID));
			
			SecurityHandler sec = new SecurityHandler();
			Task root = sec.getRootTask(parentTaskId);
			int taskRelationId = TaskRelationDAL.getInstance().insert(parentTaskId, childTaskId, taskRelationTypeId, root.getTaskId());
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
		resp.setContentType(APIConst.CONTENT_TYPE);
		JsonObject json = new JsonObject();
		int taskRelationId = 0;
		int parentTaskId = 0;
		int childTaskId = 0;
		int taskRelationTypeId = 0;

		try {
	
			for(Part part : req.getParts()) {

				switch(part.getName()) {
				case APIConst.FLD_TASKRELATION_ID:
					taskRelationId = ServletHelper.getPartInt(part);
					break;
				case APIConst.FLD_TASKRELATION_PARENT_TASK_ID:
					parentTaskId = ServletHelper.getPartInt(part);
					break;
				case APIConst.FLD_TASKRELATION_CHILD_TASK_ID:
					childTaskId = ServletHelper.getPartInt(part);
					break;
				case APIConst.FLD_TASKRELATION_TASKRELATIONTYPE_ID:
					taskRelationTypeId = ServletHelper.getPartInt(part);
					break;
						
					default:
						break;
				}
			}

			if(parentTaskId > 0)
				TaskRelationDAL.getInstance().update(taskRelationId, parentTaskId, childTaskId, taskRelationTypeId);
			else
				TaskRelationDAL.getInstance().update(taskRelationId, taskRelationTypeId);
			json.addProperty(APIConst.FLD_TASKRELATION_ID, taskRelationId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException e) {
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
		resp.setContentType(APIConst.CONTENT_TYPE);
		JsonObject json = new JsonObject();
		int taskRelationId=0;

		try {
			taskRelationId = ServletHelper.getPartInt(req.getPart(APIConst.FLD_TASKRELATION_ID));
		
			TaskRelationDAL.getInstance().delete(taskRelationId);
			json.addProperty(APIConst.FLD_TASKRELATION_ID, taskRelationId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_DELETE, json, req);
			json.addProperty(APIConst.FLD_TASKRELATION_ID, "0");
		}
		String response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}	
}
