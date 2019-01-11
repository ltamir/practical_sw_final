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
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerContactDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Customer;
import org.liortamir.maverickcrm.maverickcrmServer.model.CustomerContact;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet
@MultipartConfig
public class CustomerContactController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4769452647655368178L;
	private Gson jsonHelper = new Gson();
	
	
	@Override
	public void init() throws ServletException {
		
		super.init();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response = APIConst.ERROR;
		CustomerContact customerContact = null;
		JsonObject json = null;
		int id = 0;
		int actionId = 0;

		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == ActionEnum.ACT_ALL.ordinal()) {
				resp.setContentType("application/json");
				List<Customer> bulk = CustomerDAL.getInstance().getAll();
				json = new JsonObject();
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
				
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMER_ID));
				customerContact = CustomerContactDAL.getInstance().get(id);	
				json = new JsonObject();
				response = jsonHelper.toJson(customerContact);									
			}else if(actionId == ActionEnum.ACT_CUSTOMER_BY_CONTACT.ordinal()){
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CONTACT_ID));
				List<CustomerContact> bulk = CustomerContactDAL.getInstance().getByContact(id);	
				json = new JsonObject();
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);									
			}else if(actionId == ActionEnum.ACT_CONTACT_BY_CUSTOMER.ordinal()){
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMER_ID));
				List<CustomerContact> bulk = CustomerContactDAL.getInstance().getByCustomer(id);	
				json = new JsonObject();
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);									
			}
		}catch(NumberFormatException | SQLException e) {
			System.out.println("CustomerContactController.doGet: " + e.getStackTrace()[0] + " " +  e.getMessage());
		}
		
		//boolean ajax = "XMLHttpRequest".equals(req.getHeader("X-Requested-With"));
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response = null;
		JsonObject json = new JsonObject();
		try {
			int customerId = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMERCONTACT_CUSTOMERID));
			int contactId = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMERCONTACT_CONTACTID));
			int contactTypeId = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMERCONTACT_CONTACT_TYPE_ID));			
			
			int customerContactId = CustomerContactDAL.getInstance().insert(customerId, contactId, contactTypeId);
			
			json.addProperty("customerContact", customerContactId);			
		}catch(SQLException | NullPointerException e) {
			System.out.println("CustomerContactController.doPost: " + e.getStackTrace()[0] + " " +  e.getMessage());
			json.addProperty("customerContactId", "0");
			if( e instanceof SQLException && ((SQLException)e).getSQLState().equals("23505")) {
				json.addProperty("msg", "customer already exist");
			}	
		}
		response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		try {
			System.out.println(req.getContentType());
			int customerId = 0;
			String customerName = null;
			String customerNotes = null;
		     
			CustomerDAL.getInstance().update(customerId, customerName, customerNotes);
			json.addProperty("customerContactId", "");
		}catch(SQLException | NullPointerException | NumberFormatException e) {
			System.out.println("CustomerContactController.doPost: " + e.getStackTrace()[0] + " " +  e.getMessage());
			json.addProperty("customerContactId", "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		int customerContactId = 0;
		try {
			Part filePart = req.getPart("customerContactId");
			int multiplier = 1;
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				customerContactId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}
			
			CustomerContactDAL.getInstance().delete(customerContactId);
			json.addProperty("customerContactId", customerContactId);
		}catch(SQLException | NullPointerException e) {
			System.out.println("CustomerContactController.doPut: " + e.getStackTrace()[0] + " " +  e.getMessage());
			json.addProperty("customerContactId", "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);			
		req.getRequestDispatcher("/").include(req, resp);
	}
}
