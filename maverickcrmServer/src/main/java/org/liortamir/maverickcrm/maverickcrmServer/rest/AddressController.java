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
import org.liortamir.maverickcrm.maverickcrmServer.dal.AddressDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerAddressDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.infra.Reference;
import org.liortamir.maverickcrm.maverickcrmServer.model.Address;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

@WebServlet(name = "Address", urlPatterns="/address")
@MultipartConfig
public class AddressController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2510794507990929698L;
	private Gson jsonHelper = null;
	private String defaultCountry=null;
	private AddressDAL dal = AddressDAL.getInstance();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Address address = null;
		JsonObject json = new JsonObject();
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			
			if(action == ActionEnum.GET_ALL) {
				List<Address> bulk = dal.getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
				
			}else if(action == ActionEnum.GET_SINGLE){
				int id = Integer.parseInt(req.getParameter("addressId"));
				address = dal.get(id);
				json.add("address", jsonHelper.toJsonTree(address));					
			}else if(action == ActionEnum.ADDRESS_BY_CUSTOMER){
				int id = Integer.parseInt(req.getParameter("customerId"));
				List<Address> bulk = dal.getByCustomer(id);
				json.add("array", jsonHelper.toJsonTree(bulk));			
			}
			ServletHelper.doSuccess(json);
			
		}catch(NullPointerException | NumberFormatException | SQLException | InvalidActionException e) {			
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		try {
			String street = null;
			String houseNum = null;
			String city = null;
			String country = null;
			int customerId = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMER_ID));

			Part filePart = req.getPart(APIConst.FLD_ADDRESS_STREET);
			street = new String(IOUtils.toByteArray(filePart.getInputStream()), "UTF-8");
			
			filePart = req.getPart(APIConst.FLD_ADDRESS_HOUSENUM);
			houseNum = new String(IOUtils.toByteArray(filePart.getInputStream()));
			
			filePart = req.getPart(APIConst.FLD_ADDRESS_CITY);
			city = new String(IOUtils.toByteArray(filePart.getInputStream()), "UTF-8");
			
			filePart = req.getPart(APIConst.FLD_ADDRESS_COUNTRY);
			if(IOUtils.toByteArray(filePart.getInputStream()).length == 0)
				country = defaultCountry;
			else
				country = new String(IOUtils.toByteArray(filePart.getInputStream()), "UTF-8");			
			
			int addressId = dal.insert(new Address(0, street, houseNum, city, country));
			CustomerAddressDAL.getInstance().insert(customerId, addressId);
			json.addProperty(APIConst.FLD_ADDRESS_ID, addressId);
			
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			json.addProperty("addressId", "0");
			if( e instanceof SQLException && ((SQLException)e).getSQLState().equals("23505")) {
				json.addProperty("msg", "addressId already exists");
			}			
		}
		
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		JsonObject json = new JsonObject();
		int multiplier = 1;
		try {
			String street = null;
			String houseNum = null;
			String city = null;
			String country = null;
			int addressId = 0;			
			
			Part filePart = req.getPart(APIConst.FLD_ADDRESS_STREET);
			street = new String(IOUtils.toByteArray(filePart.getInputStream()), "UTF-8");
			
			filePart = req.getPart(APIConst.FLD_ADDRESS_HOUSENUM);
			houseNum = new String(IOUtils.toByteArray(filePart.getInputStream()));
			
			filePart = req.getPart(APIConst.FLD_ADDRESS_CITY);
			city = new String(IOUtils.toByteArray(filePart.getInputStream()), "UTF-8");
			
			filePart = req.getPart(APIConst.FLD_ADDRESS_COUNTRY);
			if(IOUtils.toByteArray(filePart.getInputStream()).length == 0)
				country = defaultCountry;
			else
				country = new String(IOUtils.toByteArray(filePart.getInputStream()), "UTF-8");

			filePart = req.getPart(APIConst.FLD_ADDRESS_ID);
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				addressId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}			
			
			dal.update(new Address(addressId, street, houseNum, city, country));
			json.addProperty(APIConst.FLD_ADDRESS_ID, addressId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
			json.addProperty(APIConst.FLD_ADDRESS_ID, "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		JsonObject json = new JsonObject();
		int addressId = 0;
		try {
			Part filePart = req.getPart(APIConst.FLD_ADDRESS_ID);
			int multiplier = 1;
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				addressId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}
			
			dal.delete(addressId);
			json.addProperty(APIConst.FLD_ADDRESS_ID, addressId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_DELETE, json, req);
			json.addProperty(APIConst.FLD_ADDRESS_ID, "0");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);			
		req.getRequestDispatcher("/").include(req, resp);
	}

	@Override
	public void init() throws ServletException {

		GsonBuilder gsonBuilder = new GsonBuilder();  
		gsonBuilder.serializeNulls();  
		this.jsonHelper = gsonBuilder.create();
		this.defaultCountry = Reference.getInstance().getAsString("defaultcountry");
	}	

}
