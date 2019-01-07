package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.commons.io.IOUtils;
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerTaskDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.CustomerTask;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@MultipartConfig
public class CustomerTaskController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response = APIConst.ERROR;
		CustomerTask customerTask = null;
		JsonObject json = null;
		int id = 0;
		int actionId = 0;
		
		try {
			
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			if(actionId == ActionEnum.ACT_SINGLE.ordinal()) {
				
				id = Integer.parseInt(req.getParameter("customerTaskId"));
				customerTask = CustomerTaskDAL.getInstance().get(id);
				json = new JsonObject();
				response = jsonHelper.toJson(customerTask);	
				
			}else if(actionId == ActionEnum.ACT_CUSTOMER_TASK_BY_CUSTOMER.ordinal()) {
				json = new JsonObject();
				id = Integer.parseInt(req.getParameter("customerId"));
				List<CustomerTask> bulk = CustomerTaskDAL.getInstance().getByCustomer(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);				
			}else if(actionId == ActionEnum.ACT_CUSTOMER_TASK_BY_TASK.ordinal()) {
				json = new JsonObject();
				id = Integer.parseInt(req.getParameter("taskId"));
				List<CustomerTask> bulk = CustomerTaskDAL.getInstance().getByTask(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);				
			}else if(actionId == ActionEnum.ACT_ALL.ordinal()) {
				
				json = new JsonObject();
				List<CustomerTask> bulk = CustomerTaskDAL.getInstance().getAll(true);
				json.add("array", jsonHelper.toJsonTree(bulk));
			}
		}catch(SQLException e) {
			System.out.println("CustomerTaskController.doGet: " + e.getStackTrace()[0] + " " +  e.getMessage());
		}
		response = jsonHelper.toJson(json);			
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		String response = null;

		try {
			int customerId = Integer.parseInt(req.getParameter("customerId"));
			int taskId = Integer.parseInt(req.getParameter("taskId"));
			int customerTaskId = CustomerTaskDAL.getInstance().insert(customerId, taskId);
			json.addProperty("customerTaskId", customerTaskId);

		}catch(SQLException | NumberFormatException | NullPointerException e) {
			System.out.println("CustomerTaskController.doPost: " + e.getStackTrace()[0] + " " +  e.getMessage());
			if( e instanceof SQLException && ((SQLException)e).getSQLState().equals("23505")) {
				json.addProperty("customerTaskId", "0");
				json.addProperty("msg", "customer already exist");
			}
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response =null;
		JsonObject json = new JsonObject();
		try {
			int customerTaskId = 0; // = Integer.parseInt(req.getParameter("customerTaskId"));
			
			Part filePart = req.getPart("customerTaskId");
			int multiplier = 1;
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				customerTaskId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}
			CustomerTaskDAL.getInstance().delete(customerTaskId);
			json.addProperty("customerTaskId", customerTaskId);
		}catch(SQLException | NumberFormatException | NullPointerException e) {
			System.out.println("CustomerTaskController.doDelete: " + e.getStackTrace()[0] + " " +  e.getMessage());
			json.addProperty("customerTaskId", "0");
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
}
