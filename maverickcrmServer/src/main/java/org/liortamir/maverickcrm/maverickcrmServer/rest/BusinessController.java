package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.Period;
import java.util.Collections;
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
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
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
		Login login = null;
		int taskId = 0;
		List<Task> bulk = null;
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			switch(action){
			case GET_TOTAL_HOURS:
				taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));
				Task task;
				req.getRequestDispatcher("task?actionId=3&taskId=" + taskId).include(req, resp);
				task = (Task)req.getSession().getAttribute("task");				
				getTotalHours(task, json);
				break;
			case GENERATE_HASH:
				String toHash = req.getParameter("tohash");
				int hash = toHash.hashCode();
				json.addProperty("hashcode", hash);
				break;
			case TIMELINE_PROJECTS:
				req.getRequestDispatcher("authenticate?actionId=16").include(req, resp);
				login = (Login)req.getSession().getAttribute("login");
				bulk = dal.getTimelineProjects(login.getLoginId());
				Collections.sort(bulk, (t1, t2) -> t1.getDueDate().compareTo(t2.getDueDate()));
				getTimeline(bulk, json);
				break;
			case TIMELINE_SUB_TASKS:
				req.getRequestDispatcher("authenticate?actionId=16").include(req, resp);
				login = (Login)req.getSession().getAttribute("login");
				taskId = Integer.parseInt(req.getParameter(APIConst.FLD_TASK_ID));
				bulk = dal.getTimelineTask(taskId);
				Collections.sort(bulk, (t1, t2) -> t1.getDueDate().compareTo(t2.getDueDate()));
				getTimeline(bulk, json);		
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
	
	private JsonObject getTotalHours(Task task, JsonObject json) throws SQLException{
		int hours = 0;
		int days = 0;
		int months = 0;
		int totalHours = 0;

		hours = dal.getHours(task.getTaskId());
		totalHours += hours;
		json.addProperty("hours", hours);
		days = dal.getDays(task.getTaskId());
		totalHours += days*9;
		json.addProperty("days", days);
		months = dal.getMonths(task.getTaskId());
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
		json.addProperty("taskTotal", buildTotalEffortTime(BLHelper.getEffortHours(task.getEffortUnit(),task.getEffort())));
		return json;
	}

	private String buildTotalEffortTime(int totalHours){
		String totalEffort = "";
		int days= 0, months = 0;
		
		if(totalHours > 9){
			days += totalHours/9;
			totalHours = totalHours % 9;
		}

		if(days > 20){
			months += days/20;
			days = days % 20;
		}
		totalEffort =  months + ":" + days + ":" + totalHours;
		return totalEffort;
	}
	private JsonElement getTimeline(List<Task> bulk, JsonObject json) throws SQLException{
		LocalDate currentDate = LocalDate.now();
		JsonArray jsonArray = new JsonArray();
		for(Task task : bulk){
			jsonArray.add(jsonHelper.toJsonTree(task));
			JsonObject jsonTask = (JsonObject)jsonArray.get(jsonArray.size()-1);
			
			List<Task> childBulk = dal.getTimelineTask(task.getTaskId());
			int calculatedUsedEffort = (childBulk.size() == 0) ? calculateUsedEffort(task) : 0;
			for(Task childTask : childBulk){
				calculatedUsedEffort += calculateUsedEffort(childTask);
			}
			jsonTask.addProperty("usedEffortFormatted", buildTotalEffortTime(calculatedUsedEffort));
			jsonTask.addProperty("usedEffort", calculatedUsedEffort);
			jsonTask.addProperty("leftEffort", caculateDateDiff(currentDate, task, calculatedUsedEffort));
			
		}
		ServletHelper.addJsonTree(jsonHelper, json, "array", jsonArray);
		
		return json;
	}
	
	private int caculateDateDiff(LocalDate currentDate, Task task, int usedEffort){
		int remainingPercentage = 0;
		Period period = Period.between(currentDate, task.getDueDate());
		int daysToDueDate = period.getDays();
		daysToDueDate += period.getMonths() * 20;
		daysToDueDate += period.getYears() * 12 * 20;
//		if(daysToDueDate >5)
//			daysToDueDate -= daysToDueDate / 7 * 2;	// 5 working days, remove friday and saturday
		int hoursToDueDate = (daysToDueDate < 0)?0 : (daysToDueDate * 9);
		hoursToDueDate = (hoursToDueDate == 0)? 0 : (hoursToDueDate - usedEffort);
		int effortInHours = BLHelper.getEffortHours(task.getEffortUnit(),task.getEffort());
		if(hoursToDueDate == 0)
			remainingPercentage = 100;
		else if(hoursToDueDate < effortInHours)
			remainingPercentage = (int) ((((double)(effortInHours - hoursToDueDate) / (double)effortInHours) * 100));
		else
			remainingPercentage = 100 - (int)((double)((effortInHours - usedEffort) / (double)effortInHours) * 100);
		remainingPercentage = (remainingPercentage <0)?0 : remainingPercentage;	// if < 0 then task is 0%
		return remainingPercentage;		
	}
	
	private int calculateUsedEffort(Task task){
		int hours = 0;
		//n/a, new, Running, Deliered, Closed, On Hold
		double[] ststusEffort  = {0, 0, 0.25, 0.75, 1, 0};
		
		hours = BLHelper.getEffortHours(task.getEffortUnit(),task.getEffort());
		hours = (int) Math.round((hours * ststusEffort[task.getStatus().getStatusId()]));
		return hours;
	}
	
	
}
