package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Customer;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet
@MultipartConfig
public class CustomerController extends HttpServlet {

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
		Customer customer = null;
		JsonObject json = new JsonObject();
		int id = 0;
		int actionId = 0;

		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == ActionEnum.ACT_ALL.ordinal()) {
				resp.setContentType("application/json");
				List<Customer> bulk = CustomerDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
				
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				id = Integer.parseInt(req.getParameter(APIConst.FLD_CUSTOMER_ID));
				customer = CustomerDAL.getInstance().get(id);	
				response = jsonHelper.toJson(customer);									
			}else if(actionId == ActionEnum.ACT_CUSTOMER_NOT_LINKED_TASK.ordinal()) {
				id = Integer.parseInt(req.getParameter("taskId"));
				List<Customer> bulk = CustomerDAL.getInstance().getNonLinkedToTask(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);				
			}else if(actionId == ActionEnum.ACT_CUSTOMER_NOT_LINKED_CONTACT.ordinal()) {
				
				id = Integer.parseInt(req.getParameter("contactId"));
				List<Customer> bulk = CustomerDAL.getInstance().getNonLinkedToContact(id);
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);				
			}
		}catch(NumberFormatException | SQLException e) {
			System.out.println("CustomerController.doGet: " + e.getStackTrace()[0] + " " +  e.getMessage());
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
			System.out.println("CustomerController.doPost: " + e.getStackTrace()[0] + " " +  e.getMessage());
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
		try {
			int customerId = 0;
			String customerName = null;
			String customerNotes = null;
			
//			boolean isMultipart = ServletFileUpload.isMultipartContent(req);
//			System.out.println("isMultipart :" + isMultipart);
			
			DiskFileItemFactory factory = new DiskFileItemFactory();
			ServletContext servletContext = this.getServletConfig().getServletContext();
			File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
			factory.setRepository(repository);
			
			ServletFileUpload upload = new ServletFileUpload(factory);
			List<FileItem> items = upload.parseRequest(req);
			for(FileItem item : items) {
				if(item.isFormField()) {
					switch(item.getFieldName()) {
					case APIConst.FLD_CUSTOMER_ID:
						customerId = Integer.parseInt(item.getString());
						break;
					case APIConst.FLD_CUSTOMER_NAME:
						customerName = item.getString();
						break;
					case APIConst.FLD_CUSTOMER_NOTES:
						customerNotes = item.getString();
						break;
						default:
							System.out.println("CustomerHandler.doPut: Invalid field: Name:" + item.getFieldName() + " value:" + item.getString());
					}
				}
			}
		     
			CustomerDAL.getInstance().update(customerId, customerName, customerNotes);
			
			json.addProperty("customerId", customerId);

		}catch(SQLException | NullPointerException | NumberFormatException | FileUploadException e) {
			System.out.println("CustomerController.doGet: " + e.getStackTrace()[0] + " " +  e.getMessage());
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
			int customerId = 0; // = Integer.parseInt(req.getParameter("customerTaskId"));
			
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
			System.out.println("CustomerController.doGet: " + e.getStackTrace()[0] + " " +  e.getMessage());
			json.addProperty("customerId", "0");
		}
		response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
}
