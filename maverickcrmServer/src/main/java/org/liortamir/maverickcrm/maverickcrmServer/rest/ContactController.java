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
import org.liortamir.maverickcrm.maverickcrmServer.dal.ContactDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Contact;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

@WebServlet(name = "Contact", urlPatterns="/contact")
@MultipartConfig
public class ContactController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	
	private Gson jsonHelper = null;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Contact contact = null;
		JsonObject json = new JsonObject();
		int id = 0;
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			
			if(action ==ActionEnum.ACT_LOGIN_CONTACT_ALL) {
				
				List<Contact> bulk=null;
				bulk = ContactDAL.getInstance().getAllLogin();
				json.add("array", jsonHelper.toJsonTree(bulk));
				
			}else if(action == ActionEnum.ACT_ALL){
				
				List<Contact> bulk;
				bulk = ContactDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));			
				
			}else if(action == ActionEnum.ACT_SINGLE){
				
				id = Integer.parseInt(req.getParameter("contactId"));
				contact = ContactDAL.getInstance().get(id);
				json.add("contact", jsonHelper.toJsonTree(contact));					
			}
			ServletHelper.doSuccess(json);
		}catch(NumberFormatException | SQLException |InvalidActionException e) {
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
			Contact contact = new Contact();
			for(Part part : req.getParts()) {
				switch(part.getName()) {
				case APIConst.FLD_CONTACT_FIRST_NAME:
					contact.setFirstName(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_LAST_NAME:
					contact.setLastName(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_OFFICE_PHONE:
					contact.setOfficePhone(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_CELL_PHONE:
					contact.setMobilePhone(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_EMAIL:
					contact.setEmail(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_NOTES:
					contact.setNotes(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
					default:
						break;
				}
			}
			
			int contactId = ContactDAL.getInstance().insert(contact);
			json.addProperty(APIConst.FLD_CONTACT_ID, contactId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			if( e instanceof SQLException && ((SQLException)e).getSQLState().equals("23505")) {
				json.addProperty("msg", "contact already exist");
			}			
		}
		
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		
		try {			
			Contact contact = new Contact();

			for(Part part : req.getParts()) {

				switch(part.getName()) {
				case APIConst.FLD_CONTACT_ID:
					contact.setContactId(Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream()))));
					break;
				case APIConst.FLD_CONTACT_FIRST_NAME:
					contact.setFirstName(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_LAST_NAME:
					contact.setLastName(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_OFFICE_PHONE:
					contact.setOfficePhone(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_CELL_PHONE:
					contact.setMobilePhone(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_EMAIL:
					contact.setEmail(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_CONTACT_NOTES:
					contact.setNotes(new String(IOUtils.toByteArray(part.getInputStream())));
					break;						
					default:
						System.out.println(this.getClass().getName() + ".doPut: Invalid field: Name:" + part.getName());
				}
			}
			
			ContactDAL.getInstance().update(contact);
			json.addProperty(APIConst.FLD_CONTACT_ID, contact.getContactId());
			ServletHelper.doSuccess(json);
		}catch(SQLException | NullPointerException | NumberFormatException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
			json.addProperty(APIConst.FLD_CONTACT_ID, "0");
		}
		
		String response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
		req.getRequestDispatcher("/").include(req, resp);
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response;
		JsonObject json = new JsonObject();
		try {
			int contactId = 0;
			
			Part filePart = req.getPart("contactId");
			int multiplier = 1;
			byte[] bytes = IOUtils.toByteArray(filePart.getInputStream());
			for(int i= bytes.length-1; i>=0; i--) {
				contactId += (bytes[i]-48) * multiplier;
				multiplier *= 10;
			}
			ContactDAL.getInstance().delete(contactId);
			json.addProperty(APIConst.FLD_CONTACT_ID, contactId);
			ServletHelper.doSuccess(json);
		}catch(SQLException | NumberFormatException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_DELETE, json, req);
			json.addProperty(APIConst.FLD_CONTACT_ID, "0");
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
