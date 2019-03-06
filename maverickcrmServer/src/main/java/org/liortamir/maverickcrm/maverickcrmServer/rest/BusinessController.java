package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.BusinessDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "Business", urlPatterns="/business")
@MultipartConfig
public class BusinessController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2510794507990929698L;
	private Gson jsonHelper = new Gson();
	private BusinessDAL dal = BusinessDAL.getInstance();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response;
		JsonObject json = new JsonObject();
		int hours = 0;
		int days = 0;
		int months = 0;
		int totalHours = 0;
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			
			if(action == ActionEnum.ACT_TOTAL_HOURS) {
				int taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));

				hours = dal.getHours(taskId);
				totalHours += hours;
				json.addProperty("hours", hours);
				days = dal.getDays(taskId);
				totalHours += days*9;
				json.addProperty("days", days);
				months = dal.getMonths(taskId);
				totalHours += months * 20 * 9;
				json.addProperty("months", months);

				json.addProperty("totalHours", totalHours);
				if(hours > 9){
					days += hours/9;
					hours = hours % 9;
				}

				if(days > 20){
					months += days/20;
					days = days % 20;
				}
				json.addProperty("total", months + ":" + days + ":" + hours);
			}else if (action == ActionEnum.ACT_GENERATE_HASH){
				String toHash = req.getParameter("tohash");
				int hash = toHash.hashCode();
				json.addProperty("hashcode", hash);
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
