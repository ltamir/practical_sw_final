package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskType;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

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
		JsonObject json = null;
		int id = 0;
		int actionId = 0;
		
		
		try {
			Connection conn = DBHandler.getConnection();
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == ActionEnum.ACT_ALL.ordinal()) {
				resp.setContentType("application/json");
				List<TaskType> bulk = new ArrayList<>();
				json = new JsonObject();
				PreparedStatement stmt = conn.prepareStatement("select * from taskType");
				ResultSet rs = stmt.executeQuery();
				while(rs.next()) {
					taskType = new TaskType(rs.getInt("taskTypeId"), rs.getString("taskTypeName")); 
					bulk.add(taskType);
				}

				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				id = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
				PreparedStatement stmt = conn.prepareStatement("select * from taskType where taskTypeId=?");
				stmt.setInt(0, id);
				ResultSet rs = stmt.executeQuery();
				while(rs.next()) 
					taskType = new TaskType(rs.getInt("taskTypeId"), rs.getString("taskTypeName")); 
				
				json = new JsonObject();
				response = jsonHelper.toJson(taskType);					
			}
			conn.close();
		}catch(NullPointerException | NumberFormatException | SQLException e) {
			System.out.println(e.getLocalizedMessage());
			response = "Invalid taskTypeId";
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	public void init() throws ServletException {
		super.init();
	}


}
