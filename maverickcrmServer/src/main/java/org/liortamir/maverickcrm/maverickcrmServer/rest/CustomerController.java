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
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			switch(APIConst.ACTION_LIST[actionId]) {
			case ACT_ALL:
				resp.setContentType("application/json");
				bulk = CustomerDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
				break;
			case ACT_SINGLE:
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMER_ID));
				customer = CustomerDAL.getInstance().get(id);	
				response = jsonHelper.toJson(customer);	
				break;
			case ACT_CUSTOMER_NOT_LINKED_TASK:
				id = Integer.parseInt(req.getParameter("taskId"));
				bulk = CustomerDAL.getInstance().getNonLinkedToTask(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);	
				break;
			case ACT_CUSTOMER_NOT_LINKED_CONTACT:
				id = Integer.parseInt(req.getParameter("contactId"));
				bulk = CustomerDAL.getInstance().getNonLinkedToContact(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
				break;
			default:
				json.addProperty("msg",  this.getClass().getName() + ".doGet: invalid State");
				json.addProperty("status",  "nack");
				break;
			}

		}catch(NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doGet: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
		}
		
		//boolean ajax = "XMLHttpRequest".equals(req.getHeader("X-Requested-With"));
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

			Part filePart = req.getPart("customerName");
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			customerName = new String(bytes);

			filePart = req.getPart("customerNotes");
			bytes = IOUtils.toByteArray(filePart.getInputStream());
			customerNotes = new String(bytes);

			customerId = CustomerDAL.getInstance().insert(customerName, customerNotes);
			json.addProperty("customerId", customerId);

		}catch(SQLException | NullPointerException e) {
			System.out.println(this.getClass().getName() + ".doPost: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
			json.addProperty("customerId", "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);		
//		req.getRequestDispatcher("/").include(req, resp);
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
//			boolean isMultipart = ServletFileUpload.isMultipartContent(req);
//			System.out.println("isMultipart :" + isMultipart);
		     
			CustomerDAL.getInstance().update(customerId, customerName, customerNotes);
			
			json.addProperty("customerId", customerId);

		}catch(SQLException | NullPointerException | NumberFormatException e) {
			System.out.println(this.getClass().getName() + ".doPut: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
			json.addProperty("customerId", "0");
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
			
			Part filePart = req.getPart("customerId");
			int multiplier = 1;
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				customerId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}
			//TODO check if customer is in relation with task or contact
			CustomerDAL.getInstance().delete(customerId);
			json.addProperty("customerId", customerId);
		}catch(SQLException | NumberFormatException | NullPointerException e) {
			System.out.println(this.getClass().getName() + ".doDelete: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
			json.addProperty("customerId", "0");
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
