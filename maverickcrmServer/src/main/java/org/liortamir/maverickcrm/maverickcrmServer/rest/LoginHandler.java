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
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class LoginHandler extends HttpServlet {

	
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
		JsonObject json = null;
		int id = 0;
		int actionId = 0;
		
		String parLoginId = req.getParameter("loginId");
		String action = req.getParameter("action");
		String username = req.getParameter("username");
		String password = req.getParameter("password");
		
		try {
			Connection conn = DBHandler.getConnection();
			actionId = Integer.parseInt(action);
			
			id = Integer.parseInt(parLoginId);
			if(actionId == APIConst.ACT_ALL) {
				List<Login> bulk = new ArrayList<>();
				json = new JsonObject();
				PreparedStatement stmt = conn.prepareStatement("select * from login where username=? and password=?");
				stmt.setString(1, username);
				stmt.setString(2, password);
				ResultSet rs = stmt.executeQuery();
				while(rs.next()) {
					login = new Login(rs.getInt("loginId"), rs.getString("username"), null); 
					bulk.add(login);
				}

				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				PreparedStatement stmt = conn.prepareStatement("select * from login where username=? and password=?");
				stmt.setInt(0, id);
				ResultSet rs = stmt.executeQuery();
				while(rs.next()) 
					login = new Login(rs.getInt("loginId"), rs.getString("username"), null); 
				
				json = new JsonObject();
				response = jsonHelper.toJson(login);					
			}else if(actionId == ActionEnum.ACT_ALL.ordinal()) {
				PreparedStatement stmt = conn.prepareStatement("select * from login where username=? and password=?");
				stmt.setString(1, username);
				stmt.setString(2, password);
				ResultSet rs = stmt.executeQuery();
				while(rs.next()) {
					login = new Login(rs.getInt("loginId"), rs.getString("username"), null); 
					response = jsonHelper.toJson(login);
				}
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
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		super.doPost(req, resp);
	}

}
