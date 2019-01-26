package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.BusinessDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.ContactDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.LoginDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.model.Contact;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@MultipartConfig
public class BusinessController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2510794507990929698L;
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response = APIConst.ERROR;
		JsonObject json = new JsonObject();
		int hours = 0;
		int days = 0;
		int months = 0;
		int totalEffort = 0;
		
		try {
			int taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));

			hours = BusinessDAL.getInstance().getHours(taskId);
			json.addProperty("hours", hours);
			days = BusinessDAL.getInstance().getDays(taskId);
			json.addProperty("days", days);
			months = BusinessDAL.getInstance().getMonths(taskId);
			json.addProperty("months", months);

			if(hours > 9){
				days += hours/9;
				hours = hours % 9;
			}

			if(days > 20){
				months += days/20;
				days = days % 20;
			}
			json.addProperty("total", months + ":" + days + ":" + hours);			
			response = jsonHelper.toJson(json);

		}catch(NullPointerException | NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doGet: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  "Internal error, please check the log");
			json.addProperty("err",  e.toString());
			json.addProperty("status",  "nack");
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		Login login = null;
		String nextURL = "/";
		try {
			String username = req.getParameter("username");
			String password = req.getParameter("password");
			login = LoginDAL.getInstance().authenticate(username, password);
			if(login == null) {
				json.addProperty("msg", "Invalid user or password. Please try Again");
				nextURL = "/login.html";
				String response = jsonHelper.toJson(json);	
				PrintWriter out = resp.getWriter();
				out.println(response);	

			}else {
				req.getSession().setAttribute("username", login.getUsername());
			}

		}catch(SQLException | NullPointerException e) {
			System.out.println(this.getClass().getName() + ".doPost: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  "Internal error, please check the log");
			json.addProperty("err",  e.toString());
			json.addProperty("status",  "nack");			
			json.addProperty("customerTaskId", "0");
			if( e instanceof SQLException && ((SQLException)e).getSQLState().equals("23505")) {
				json.addProperty("msg", "Internal error");
			}			
		}

	}
}
