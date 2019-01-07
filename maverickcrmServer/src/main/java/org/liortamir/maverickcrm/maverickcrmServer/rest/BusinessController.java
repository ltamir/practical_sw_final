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
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;

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
		JsonObject json = null;
		
		try {
			int taskId = Integer.parseInt(req.getParameter("taskId"));
			int totalDays = BusinessDAL.getInstance().get(taskId);
			json = new JsonObject();
			json.addProperty("total", totalDays);
			response = jsonHelper.toJson(json);

		}catch(NullPointerException | NumberFormatException | SQLException e) {
			System.out.println("BusinessController.doGet: " + e.getStackTrace()[0] + " " +  e.getMessage());
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

}
