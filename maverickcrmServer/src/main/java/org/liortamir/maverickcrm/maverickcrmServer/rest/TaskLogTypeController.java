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

import org.liortamir.maverickcrm.maverickcrmServer.dal.AbstractDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskLogTypeDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskLogType;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "TaskLogType", urlPatterns="/tasklogtype")
public class TaskLogTypeController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2510794507990929698L;
	private Gson jsonHelper = new Gson();
	private AbstractDAL<TaskLogType> dal = TaskLogTypeDAL.getInstance();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		TaskLogType taskLogType = null;
		JsonObject json = new JsonObject();
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			
			if(action == ActionEnum.GET_ALL) {
				List<TaskLogType> bulk = dal.getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
				
			}else if(action == ActionEnum.GET_SINGLE){
				
				int id = Integer.parseInt(req.getParameter(APIConst.FLD_TASKLOGTYPE_ID));
				taskLogType = dal.get(id);
				ServletHelper.addJsonTree(jsonHelper, json, "taskLogType", taskLogType);					
			}
			ServletHelper.doSuccess(json);
		}catch(NullPointerException | NumberFormatException | SQLException | InvalidActionException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

}
