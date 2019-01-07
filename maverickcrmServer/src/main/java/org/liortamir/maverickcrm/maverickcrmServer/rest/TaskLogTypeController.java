package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskLogTypeDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskLogType;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class TaskLogTypeController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2510794507990929698L;
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html");
		String response = APIConst.ERROR;
		TaskLogType taskLogType = null;
		JsonObject json = null;
		int actionId = 0;
		
		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == ActionEnum.ACT_ALL.ordinal()) {
				resp.setContentType("application/json");
				List<TaskLogType> bulk = TaskLogTypeDAL.getInstance().getAll();
				json = new JsonObject();
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
				
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				
				int id = Integer.parseInt(req.getParameter(APIConst.FLD_TASKLOGTYPE_ID));
				taskLogType = TaskLogTypeDAL.getInstance().get(id);
				json = new JsonObject();
				response = jsonHelper.toJson(taskLogType);					
			}

		}catch(NullPointerException | NumberFormatException | SQLException e) {
			System.out.println("TaskLogTypeController.doGet: " + e.getStackTrace()[0] + " " +  e.getMessage());
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

}
