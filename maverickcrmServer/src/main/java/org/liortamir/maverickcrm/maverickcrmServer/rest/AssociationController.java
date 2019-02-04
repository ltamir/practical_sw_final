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
import org.liortamir.maverickcrm.maverickcrmServer.dal.AssociationDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerAddressDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Association;
import org.liortamir.maverickcrm.maverickcrmServer.model.Customer;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

@WebServlet(name = "Association", urlPatterns="/association")
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

		try {
			ActionEnum action = ServletHelper.getAction(req);
			
			if(action == ActionEnum.ACT_ALL) {
				resp.setContentType("application/json");
				List<Customer> bulk = CustomerDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
				
			}else if(action == ActionEnum.ACT_SINGLE){
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMER_ID));
				association = AssociationDAL.getInstance().get(id);	
				json.add("association", jsonHelper.toJsonTree(association));	
				
			}else if(action == ActionEnum.ACT_CUSTOMER_BY_CONTACT){
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CONTACT_ID));
				List<Association> bulk = AssociationDAL.getInstance().getByContact(id);	
				json.add("array", jsonHelper.toJsonTree(bulk));									
			}else if(action == ActionEnum.ACT_CONTACT_BY_CUSTOMER){
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMER_ID));
				List<Association> bulk = AssociationDAL.getInstance().getByCustomer(id);	
				json.add("array", jsonHelper.toJsonTree(bulk));
			}
			ServletHelper.doSuccess(json);
		}catch(NumberFormatException | SQLException | InvalidActionException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		
		response = toJson(json);
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
			
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
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
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
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
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_DELETE, json, req);
			json.addProperty(APIConst.FLD_ASSOCIATION_ID, "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);			
		req.getRequestDispatcher("/").include(req, resp);
	}
}
