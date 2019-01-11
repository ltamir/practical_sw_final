package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.liortamir.maverickcrm.maverickcrmServer.dal.ContactDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Contact;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

@MultipartConfig
public class ContactController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	
	private Gson jsonHelper = null;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response = "{msg:\"Invalid request\"}";
		Contact contact = null;
		JsonObject json = new JsonObject();
		int id = 0;
		int actionId = 0;
		
		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId ==ActionEnum.ACT_LOGIN_CONTACT_ALL.ordinal()) {
				
				List<Contact> bulk=null;
				bulk = ContactDAL.getInstance().getAllLogin();
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
				
			}else if(actionId == ActionEnum.ACT_ALL.ordinal()){
				
				List<Contact> bulk;
				bulk = ContactDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));			
				response = jsonHelper.toJson(json);	
				
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				
				id = Integer.parseInt(req.getParameter("contactId"));
				contact = ContactDAL.getInstance().get(id);
				response = jsonHelper.toJson(contact);							
			}

		}catch(NumberFormatException | SQLException e) {
			System.out.println("ContactController.doGet: " + e.getStackTrace()[0] + " " +  e.getMessage());
			json.addProperty("msg", e.getMessage());
			response = jsonHelper.toJson(json);
		}
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		try {
			Contact contact = new Contact(0, 
					req.getParameter("firstName"),
					req.getParameter("lastName"),
					req.getParameter("officePhone"),
					req.getParameter("cellPhone"),
					req.getParameter("email"),
					req.getParameter("notes"));
			
			int contactId = ContactDAL.getInstance().insert(contact);
			json.addProperty("contactId", contactId);
		}catch(SQLException | NullPointerException e) {
			System.out.println("ContactController.doPost: " + e.getStackTrace()[0] + " " +  e.getMessage());
			json.addProperty("customerTaskId", "0");
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
			DiskFileItemFactory factory = new DiskFileItemFactory();
			ServletContext servletContext = this.getServletConfig().getServletContext();
			File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
			factory.setRepository(repository);
			
			ServletFileUpload upload = new ServletFileUpload(factory);
			List<FileItem> items = upload.parseRequest(req);
			for(FileItem item : items) {
				if(item.isFormField()) {
					switch(item.getFieldName()) {
					case APIConst.FLD_CONTACT_ID:
						contact.setContactId(Integer.parseInt(item.getString()));
						break;
					case APIConst.FLD_CONTACT_FIRST_NAME:
						contact.setFirstName(item.getString());
						break;
					case APIConst.FLD_CONTACT_LAST_NAME:
						contact.setLastName(item.getString());
						break;
					case APIConst.FLD_CONTACT_OFFICE_PHONE:
						contact.setOfficePhone(item.getString());
						break;
					case APIConst.FLD_CONTACT_CELL_PHONE:
						contact.setCellPhone(item.getString());
						break;
					case APIConst.FLD_CONTACT_EMAIL:
						contact.setEmail(item.getString());
						break;
					case APIConst.FLD_CONTACT_NOTES:
						contact.setNotes(item.getString());
						break;						
						default:
							System.out.println("CustomerHandler.doPut: Invalid field: Name:" + item.getFieldName() + " value:" + item.getString());
					}
				}
			}
			
			ContactDAL.getInstance().update(contact);
			json.addProperty("contactId", contact.getContactId());
		}catch(SQLException | NullPointerException | NumberFormatException |FileUploadException e) {
			System.out.println("ContactController.doPut: " + e.getStackTrace()[0] + " " +  e.getMessage());
			json.addProperty("contactId", "0");
		}
		
		String response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);
		req.getRequestDispatcher("/").include(req, resp);
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		String response = "{msg:\"Invalid request\"}";
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
			json.addProperty("contactId", contactId);
		}catch(SQLException | NumberFormatException | NullPointerException e) {
			System.out.println("ContactController.doPut: " + e.getStackTrace()[0] + " " +  e.getMessage());
			json.addProperty("contactId", "0");
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
