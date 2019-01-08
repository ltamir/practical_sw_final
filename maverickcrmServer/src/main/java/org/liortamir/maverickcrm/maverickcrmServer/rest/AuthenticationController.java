package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.LoginDAL;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@MultipartConfig
public class AuthenticationController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3340984536477397627L;
	Gson jsonHelper = new Gson();

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		Login login = null;
		
		try {
			String username = req.getParameter("username");
			String password = req.getParameter("password");
			login = LoginDAL.getInstance().authenticate(username, password);
			if(login == null) {
				json.addProperty("msg", "Invalid user or password. Please try Again");
				String response = jsonHelper.toJson(json);	
				PrintWriter out = resp.getWriter();
				out.println(response);	
				
			}else {
				req.getSession().setAttribute("username", login.getUsername());
				json.addProperty("msg", "ok");
				json.addProperty("redirect", "index.html");
				String response = jsonHelper.toJson(json);	
				PrintWriter out = resp.getWriter();
				out.println(response);
//				getServletContext().getRequestDispatcher("/index.html");
			}

		}catch(SQLException | NullPointerException e) {
			System.out.println("ContactController.doPost: " + e.getStackTrace()[0] + " " +  e.getMessage());
			json.addProperty("customerTaskId", "0");
			if( e instanceof SQLException && ((SQLException)e).getSQLState().equals("23505")) {
				json.addProperty("msg", "Internal error");
			}			
		}


	}
}
