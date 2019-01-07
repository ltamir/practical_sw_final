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
		resp.setContentType("application/json");
		String response = "{msg:'invalid username or password'}";
		Login login = null;
		JsonObject json = new JsonObject();
		int id = 0;
		int actionId = 0;
		

//		String username = req.getParameter("username");
//		String password = req.getParameter("password");
		
		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == APIConst.ACT_ALL) {
				List<Login> bulk = LoginDAL.getInstance().getAll();

				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				id = Integer.parseInt(req.getParameter("loginId"));
				LoginDAL.getInstance().get(id);
				
				json = new JsonObject();
				response = jsonHelper.toJson(login);					
			}
		}catch(NullPointerException | NumberFormatException | SQLException e) {
			System.out.println(e.getLocalizedMessage());
			json.addProperty("msg", e.getLocalizedMessage());
			response = jsonHelper.toJson(json);
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		super.doPost(req, resp);
	}

}
