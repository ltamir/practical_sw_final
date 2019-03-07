package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.BusinessDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;
import org.liortamir.maverickcrm.maverickcrmServer.model.Task;

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
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			switch(action){
			case ACT_TOTAL_HOURS:
				getTotalHours(req, json);
				break;
			case ACT_GENERATE_HASH:
				String toHash = req.getParameter("tohash");
				int hash = toHash.hashCode();
				json.addProperty("hashcode", hash);
				break;
			case ACT_TIMELINE_ALL:
				req.getRequestDispatcher("authenticate?actionId=16").include(req, resp);
				Login login = (Login)req.getSession().getAttribute("login");
				List<Task> bulk = dal.getTimelineAll(login.getLoginId());
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;
			case ACT_TIMELINE_PROJECT:
				break;
			default:
				throw new InvalidActionException(action.ordinal());
			}

			ServletHelper.doSuccess(json);
		}catch(NullPointerException | NumberFormatException | SQLException | InvalidActionException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
	
	private JsonObject getTotalHours(HttpServletRequest req, JsonObject json) throws SQLException{
		int hours = 0;
		int days = 0;
		int months = 0;
		int totalHours = 0;
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
	
		return json;
	}

}
