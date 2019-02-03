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
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Customer;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

@WebServlet
@MultipartConfig
public class CustomerController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4769452647655368178L;
	private Gson jsonHelper = null;
	

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Customer customer = null;
		List<Customer> bulk = null;
		JsonObject json = new JsonObject();
		int id = 0;
		int actionId = 0;

		try {
			ActionEnum action = ServletHelper.getAction(req);

			switch(action) {
			case ACT_ALL:
				resp.setContentType("application/json");
				bulk = CustomerDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;
			case ACT_SINGLE:
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMER_ID));
				customer = CustomerDAL.getInstance().get(id);
				ServletHelper.addJsonTree(jsonHelper, json, "customer", customer);
				break;
			case ACT_CUSTOMER_NOT_LINKED_TASK:
				id = Integer.parseInt(req.getParameter("taskId"));
				bulk = CustomerDAL.getInstance().getNonLinkedToTask(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;
			case ACT_CUSTOMER_LINKED_BY_TASK:
				id = Integer.parseInt(req.getParameter("taskId"));
				bulk = CustomerDAL.getInstance().getAllByTask(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;				
			case ACT_CUSTOMER_NOT_LINKED_CONTACT:
				id = Integer.parseInt(req.getParameter("contactId"));
				bulk = CustomerDAL.getInstance().getNonLinkedToContact(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				break;
			default:
				throw new InvalidActionException(actionId);
			}
			ServletHelper.doSuccess(json);
		}catch(NumberFormatException | SQLException | InvalidActionException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		try {
			int customerId = 0;
			String customerName = null;
			String customerNotes = null;

			customerName = ServletHelper.getPartString(req.getPart(APIConst.FLD_CUSTOMER_NAME));
			customerNotes = ServletHelper.getPartString(req.getPart(APIConst.FLD_CUSTOMER_NOTES));

			customerId = CustomerDAL.getInstance().insert(customerName, customerNotes);
			json.addProperty(APIConst.FLD_CUSTOMER_ID, customerId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			json.addProperty(APIConst.FLD_CUSTOMER_ID, "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);		
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		int multiplier = 1;
		try {
			int customerId = 0;
			String customerName = null;
			String customerNotes = null;
			
			
			Part filePart = req.getPart(APIConst.FLD_CUSTOMER_NAME);
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			customerName = new String(bytes);

			filePart = req.getPart(APIConst.FLD_CUSTOMER_NOTES);
			bytes = IOUtils.toByteArray(filePart.getInputStream());
			customerNotes = new String(bytes);
			
			filePart = req.getPart(APIConst.FLD_CUSTOMER_ID);
			bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				customerId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}	
		     
			CustomerDAL.getInstance().update(customerId, customerName, customerNotes);
			
			json.addProperty("customerId", customerId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			json.addProperty(APIConst.FLD_CUSTOMER_ID, "0");
		}
		
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response = null;
		JsonObject json = new JsonObject();
		try {
			int customerId = 0; 
			
			Part filePart = req.getPart(APIConst.FLD_CUSTOMER_ID);
			int multiplier = 1;
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				customerId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}
			//TODO check if customer is in relation with task or contact
			CustomerDAL.getInstance().delete(customerId);
			json.addProperty(APIConst.FLD_CUSTOMER_ID, customerId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			json.addProperty(APIConst.FLD_CUSTOMER_ID, 0);
		}
		response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
	
	@Override
	public void init() throws ServletException {

		GsonBuilder gsonBuilder = new GsonBuilder();  
		gsonBuilder.serializeNulls();  
		this.jsonHelper = gsonBuilder.create();
	}	
}
