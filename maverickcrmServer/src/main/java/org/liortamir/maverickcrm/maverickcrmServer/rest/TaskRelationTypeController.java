package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskRelationTypeDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskRelationType;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "TaskRelationType", urlPatterns="/taskrelationtype")
public class TaskRelationTypeController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -320070227443341261L;

	
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		TaskRelationType taskRelationType = null;
		JsonObject json = new JsonObject();
		int id = 0;
		
		try {
			
			ActionEnum action = ServletHelper.getAction(req);
			if(action == ActionEnum.ACT_SINGLE) {
				
				id = Integer.parseInt(req.getParameter("taskRelationTypeId"));
				taskRelationType = TaskRelationTypeDAL.getInstance().get(id);
				ServletHelper.addJsonTree(jsonHelper, json, "taskRelatoinType", taskRelationType);
			}else if(action == ActionEnum.ACT_ALL) {
				
				List<TaskRelationType> taskRelationList = TaskRelationTypeDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
			}
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException | InvalidActionException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}



}
