package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskRelationTypeDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskRelationType;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class TaskRelationTypeController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -320070227443341261L;

	
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response = APIConst.ERROR;
		TaskRelationType taskRelationType = null;
		JsonObject json = null;
		int id = 0;
		int actionId = 0;
		
		try {
			
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			if(actionId == ActionEnum.ACT_SINGLE.ordinal()) {
				
				id = Integer.parseInt(req.getParameter("taskRelationTypeId"));
				taskRelationType = TaskRelationTypeDAL.getInstance().get(id);
				json = new JsonObject();
				response = jsonHelper.toJson(taskRelationType);	
				
			}else if(actionId == ActionEnum.ACT_ALL.ordinal()) {
				
				json = new JsonObject();;
				List<TaskRelationType> taskRelationList = TaskRelationTypeDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				response = jsonHelper.toJson(json);	
				
			}
		}catch(SQLException e) {
			e.printStackTrace();
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}



}
