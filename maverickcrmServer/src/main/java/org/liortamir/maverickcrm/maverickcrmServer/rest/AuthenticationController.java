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
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@MultipartConfig
public class AuthenticationController extends HttpServlet {

	private static final long serialVersionUID = -3340984536477397627L;
	Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		JsonObject json = new JsonObject();
		
		try {
			int actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			switch(APIConst.ACTION_LIST[actionId]) {
			case ACT_GET_LOGGED_IN:
				String user = (String) req.getSession().getAttribute("username");
				if(user == null)
					throw new NullPointerException();

				Login login = LoginDAL.getInstance().get(user);
				response = jsonHelper.toJson(login);				
				break;
			case ACT_LOGOUT:
				req.getSession().removeAttribute("username");
				resp.sendRedirect("login.html");
				break;
				default:
					json.addProperty("msg", "invalid state " + actionId);
					json.addProperty("status",  "nack");
					response = jsonHelper.toJson(json);
					break;
			}


		}catch(NullPointerException | NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doGet: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  "Internal error, please check the log");
			json.addProperty("err",  e.toString());
			json.addProperty("status",  "nack");
			response = jsonHelper.toJson(json);
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);
	}	
	
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
				req.getSession().setAttribute("loginId", login.getLoginId());
				json.addProperty("msg", "ok");
				json.addProperty("redirect", "index.html");
				String response = jsonHelper.toJson(json);	
				PrintWriter out = resp.getWriter();
				out.println(response);

			}

		}catch(SQLException | NullPointerException e) {
			System.out.println(this.getClass().getName() + ".doPost: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  "Internal error, please check the log");
			json.addProperty("err",  e.toString());
			json.addProperty("status",  "nack");
			if( e instanceof SQLException && ((SQLException)e).getSQLState().equals("23505")) {
				json.addProperty("msg", "Internal error");
			}			
		}


	}
}
