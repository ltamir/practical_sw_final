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
import javax.servlet.http.Part;

import org.apache.commons.io.IOUtils;
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerTaskDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.CustomerTask;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "CustomerTaskController", urlPatterns="/customertask")
@MultipartConfig
public class CustomerTaskController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		CustomerTask customerTask = null;
		List<CustomerTask> bulk;
		JsonObject json = new JsonObject();
		int id = 0;
		int actionId = 0;
		
		try {
			
			ActionEnum action = ServletHelper.getAction(req);

			switch(action) {
			case GET_SINGLE:
				id = Integer.parseInt(req.getParameter("customerTaskId"));
				customerTask = CustomerTaskDAL.getInstance().get(id);
				ServletHelper.addJsonTree(jsonHelper, json, "customerTask", customerTask);
				break;
			case CUSTOMERTASK_BY_CUSTOMER:
				id = Integer.parseInt(req.getParameter("customerId"));
				bulk = CustomerTaskDAL.getInstance().getByCustomer(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;
			case CUSTOMERTASK_BY_TASK:
				id = Integer.parseInt(req.getParameter("taskId"));
				bulk = CustomerTaskDAL.getInstance().getByTask(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;
			case GET_ALL:
				bulk = CustomerTaskDAL.getInstance().getAll(false);
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;
				default:
					throw new InvalidActionException(actionId);
			}
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException | InvalidActionException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		response = jsonHelper.toJson(json);			
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		JsonObject json = new JsonObject();
		String response = null;

		try {
			int customerId = Integer.parseInt(req.getParameter("customerId"));
			int taskId = Integer.parseInt(req.getParameter("taskId"));
			int customerTaskId = CustomerTaskDAL.getInstance().insert(customerId, taskId);
			json.addProperty(APIConst.FLD_CUSTOMERTASK_ID, customerTaskId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			if( e instanceof SQLException && ((SQLException)e).getSQLState().equals("23505")) {
				json.addProperty(APIConst.FLD_CUSTOMERTASK_ID, "0");
				json.addProperty("msg", "customer already exist");
			}
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response =null;
		JsonObject json = new JsonObject();
		try {
			int customerTaskId = 0;
			
			Part filePart = req.getPart("customerTaskId");
			int multiplier = 1;
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				customerTaskId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}
			CustomerTaskDAL.getInstance().delete(customerTaskId);
			json.addProperty("customerTaskId", customerTaskId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_DELETE, json, req);
			json.addProperty(APIConst.FLD_CUSTOMERTASK_ID, 0);
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
}
