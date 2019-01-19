package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.LoginDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class LoginController extends HttpServlet {

	
	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Login login = null;
		JsonObject json = new JsonObject();
		int id = 0;
		int actionId = 0;
		
		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == APIConst.ACT_ALL) {
				
				List<Login> bulk = LoginDAL.getInstance().getAll();
				for(Login item : bulk) {
						item.setPassword("*****");
				}
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
				
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				String username = (String)req.getSession().getAttribute("username");
				
				id = Integer.parseInt(req.getParameter("loginId"));
				login = LoginDAL.getInstance().get(id);
				if(!login.getUsername().equals(username))
					login.setPassword("*****");
				json = new JsonObject();
				response = jsonHelper.toJson(login);					
			}
		}catch(NullPointerException | NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doGet: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
			response = jsonHelper.toJson(json);
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		String response;
		
		try {
			String username = req.getParameter(APIConst.FLD_LOGIN_USERNAME);
			String password = req.getParameter(APIConst.FLD_LOGIN_PASSWORD);
			int contactId = Integer.parseInt(req.getParameter(APIConst.FLD_LOGIN_CONTACT_ID));
			int loginId = LoginDAL.getInstance().insert(username, password, contactId);
			json.addProperty("loginId", loginId);
			json.addProperty("status",  "ack");
		}catch(NullPointerException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doPost: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		String response;
		
		try {
			int loginId = Integer.parseInt(req.getParameter(APIConst.FLD_LOGIN_ID));
			String username = req.getParameter(APIConst.FLD_LOGIN_USERNAME);
			String password = req.getParameter(APIConst.FLD_LOGIN_PASSWORD);
			int contactId = Integer.parseInt(req.getParameter(APIConst.FLD_LOGIN_CONTACT_ID));
			LoginDAL.getInstance().update(username, password, contactId, loginId);
			json.addProperty("loginId", loginId);
			json.addProperty("status",  "ack");
		}catch(NullPointerException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doPut: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");		
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

}
