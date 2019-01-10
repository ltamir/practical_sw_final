package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskTypeDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskType;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@MultipartConfig
public class TaskTypeController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8113572170218507397L;
	private Gson jsonHelper = new Gson();
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response = APIConst.ERROR;
		TaskType taskType = null;
		JsonObject json = new JsonObject();
		int id = 0;
		int actionId = 0;	
		
		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == ActionEnum.ACT_ALL.ordinal()) {
				resp.setContentType("application/json");
				json = new JsonObject();
				List<TaskType> bulk = TaskTypeDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				id = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
				taskType = TaskTypeDAL.getInstance().get(id);	
				json = new JsonObject();
				response = jsonHelper.toJson(taskType);					
			}
		}catch(NullPointerException | NumberFormatException | SQLException e) {
			System.out.println(e.getLocalizedMessage());
			response = "Invalid taskTypeId";
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}


}
