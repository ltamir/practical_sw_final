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
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerAddressDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.AssociationDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Customer;
import org.liortamir.maverickcrm.maverickcrmServer.model.Association;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

@WebServlet
@MultipartConfig
public class AssociationController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4769452647655368178L;
	private Gson jsonHelper =null;
	
	
	@Override
	public void init() throws ServletException {
		
		GsonBuilder gsonBuilder = new GsonBuilder();  
		gsonBuilder.serializeNulls();  
		this.jsonHelper = gsonBuilder.create();
	}

	protected String toJson(Object obj){
		return jsonHelper.toJson(obj);
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Association association = null;
		JsonObject json = new JsonObject();;
		int id = 0;
		int actionId = 0;

		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == ActionEnum.ACT_ALL.ordinal()) {
				resp.setContentType("application/json");
				List<Customer> bulk = CustomerDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = toJson(json);
				
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMER_ID));
				association = AssociationDAL.getInstance().get(id);	
				response = toJson(association);									
			}else if(actionId == ActionEnum.ACT_CUSTOMER_BY_CONTACT.ordinal()){
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CONTACT_ID));
				List<Association> bulk = AssociationDAL.getInstance().getByContact(id);	
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = toJson(json);									
			}else if(actionId == ActionEnum.ACT_CONTACT_BY_CUSTOMER.ordinal()){
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMER_ID));
				List<Association> bulk = AssociationDAL.getInstance().getByCustomer(id);	
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = toJson(json);									
			}
			json.addProperty("status",  "ack");
		}catch(NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doPost: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  "Internal error, please check the log");
			json.addProperty("err",  e.toString());
			json.addProperty("status",  "nack");
			response = jsonHelper.toJson(json);	
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
			int customerId = Integer.parseInt(req.getParameter(APIConst.FLD_ASSOCIATION_CUSTOMERID));
			int contactId = Integer.parseInt(req.getParameter(APIConst.FLD_ASSOCIATION_CONTACTID));
			int contactTypeId = Integer.parseInt(req.getParameter(APIConst.FLD_ASSOCIATION_CONTACT_TYPE_ID));	
			int addressId = Integer.parseInt(req.getParameter(APIConst.FLD_ASSOCIATION_ADDRESS_ID));
			
			int connectionId = AssociationDAL.getInstance().insert(customerId, contactId, contactTypeId, addressId);
			if(connectionId > 0 && CustomerAddressDAL.getInstance().get(customerId, addressId) != null)
				CustomerAddressDAL.getInstance().delete(customerId, addressId);
			json.addProperty(APIConst.FLD_ASSOCIATION_ID, connectionId);
			json.addProperty("status",  "ack");
		}catch(SQLException | NullPointerException e) {
			System.out.println(this.getClass().getName() + ".doPost: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  "Save failed. Please check the log");
			json.addProperty("status",  "nack");
			json.addProperty("err",  e.toString());
			json.addProperty(APIConst.FLD_ASSOCIATION_ID, "0");
			if( e instanceof SQLException && ((SQLException)e).getSQLState().equals("23505")) {
				json.addProperty("msg", "association already exist");
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
			int associationId = 0; 
			int customerId = 0;
			int contactId = 0;
			int contactTypeId = 0;	
			int addressId = 0;

			for(Part part : req.getParts()) {

				switch(part.getName()) {
				case APIConst.FLD_ASSOCIATION_ID:
					associationId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_ASSOCIATION_CUSTOMERID:
					customerId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_ASSOCIATION_CONTACTID:
					contactId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_ASSOCIATION_CONTACT_TYPE_ID:
					contactTypeId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_ASSOCIATION_ADDRESS_ID:
					addressId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
						
					default:
						System.out.println(this.getClass().getName() + ".doPut: Invalid field: Name:" + part.getName());
				}
				
			}			
			AssociationDAL.getInstance().update(associationId, customerId, contactId, contactTypeId, addressId);
			
			json.addProperty(APIConst.FLD_ASSOCIATION_ID, associationId);
			json.addProperty("status",  "ack");
		}catch(SQLException | NullPointerException | NumberFormatException e) {
			System.out.println(this.getClass().getName() + ".doPut: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  "Error updating association. Please check the log");
			json.addProperty("status",  "nack");
			json.addProperty("err",  e.toString());
			json.addProperty(APIConst.FLD_ASSOCIATION_ID, "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		int connectionId = 0;
		try {
			Part filePart = req.getPart(APIConst.FLD_ASSOCIATION_ID);
			int multiplier = 1;
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				connectionId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}
			Association association = AssociationDAL.getInstance().get(connectionId);
			List<Association> bulk = AssociationDAL.getInstance().getByAddress(association.getAddress().getAddressId());
			if(bulk.size() == 1)
				CustomerAddressDAL.getInstance().insert(association.getCustomer().getCustomerId(), association.getAddress().getAddressId());
			AssociationDAL.getInstance().delete(connectionId);
			
			
			json.addProperty(APIConst.FLD_ASSOCIATION_ID, connectionId);
			json.addProperty("status",  "ack");
		}catch(SQLException | NullPointerException e) {
			System.out.println(this.getClass().getName() + ".doDelete: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  "Internal error, please check the log");
			json.addProperty("err",  e.toString());
			json.addProperty("status",  "nack");
			json.addProperty(APIConst.FLD_ASSOCIATION_ID, "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);			
		req.getRequestDispatcher("/").include(req, resp);
	}
}
