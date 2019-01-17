package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.liortamir.maverickcrm.maverickcrmServer.dal.CustomerDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.model.Customer;
import org.liortamir.maverickcrm.maverickcrmServer.model.Task;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskCustomerView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * This servlet controls all actions on the resource task.
 * @author liort
 *
 */
@MultipartConfig
public class TaskController extends HttpServlet {

	private static final long serialVersionUID = -2104805615225405434L;
	
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Task task = null;
		List<Task> taskRelationList;
		JsonObject json = new JsonObject();
		int taskId = 0;
		int actionId = 0;

		try {

			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			switch(APIConst.ACTION_LIST[actionId]) {
			case ACT_ALL:
				List<Task> taskList = null;
				List<TaskCustomerView> bulk = new ArrayList<>();
				
				int customerId = Integer.parseInt(req.getParameter("customerId"));
				String dueDate = req.getParameter("duedate");
				String title = req.getParameter("title");
				int projectId = Integer.parseInt(req.getParameter("projectId"));
				int taskTypeId = Integer.parseInt(req.getParameter("tasktypeId"));
				boolean isClosed = (req.getParameter("showclosed").equals("1"))?true:false;
				
				taskList = TaskDAL.getInstance().getAll(customerId, dueDate, title, projectId, taskTypeId, isClosed);
				
				for(Task item : taskList){
					Customer customer = CustomerDAL.getInstance().getByTask(item.getTaskId());
					if(customer== null)
						customer = new Customer(0, "No Customer", null);
					bulk.add(new TaskCustomerView(item, customer));
				}
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
				break;
			case ACT_SINGLE:
				taskId = Integer.parseInt(req.getParameter("taskId"));
				task = TaskDAL.getInstance().get(taskId);
				response = jsonHelper.toJson(task);
				break;
			case ACT_RELATION_PARENTS:
				taskId = Integer.parseInt(req.getParameter("taskId"));
				taskRelationList = TaskDAL.getInstance().getParents(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				response = jsonHelper.toJson(json);
				break;
			case ACT_RELATION_CHILDREN:
				taskId = Integer.parseInt(req.getParameter("taskId"));
				taskRelationList = TaskDAL.getInstance().getChildren(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				response = jsonHelper.toJson(json);
				break;
			default:
				json.addProperty("msg", "invalid state " + actionId);
				json.addProperty("status",  "nack");
				response = jsonHelper.toJson(json);
				break;
			}

		}catch(NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doGet: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
			response = jsonHelper.toJson(json);
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		JsonObject json = new JsonObject();
		int taskTypeId = Integer.parseInt(req.getParameter("taskTypeId"));
		int contactId = Integer.parseInt(req.getParameter("contactId"));
		String title = req.getParameter("title");
		int effort = Integer.parseInt(req.getParameter("effort"));
		int effortUnit = Integer.parseInt(req.getParameter("effortUnit"));
		String dueDate = req.getParameter("dueDate");
		int statusId = Integer.parseInt(req.getParameter("statusId"));
		
		try {
			int taskId = TaskDAL.getInstance().insert(taskTypeId, contactId, title, effort, effortUnit, dueDate, statusId);
			json.addProperty("taskId", taskId);

		}catch(SQLException | NumberFormatException e) {
			System.out.println(this.getClass().getName() + ".doPost: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		int taskId = 0;
		int taskTypeId = 0;
		int contactId = 0;
		int effort = 0;
		int effortUnit = 0;
		String title = null;
		String dueDate = null;
		int statusId = 0;
		try {
	
			DiskFileItemFactory factory = new DiskFileItemFactory();
			ServletContext servletContext = this.getServletConfig().getServletContext();
			File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
			factory.setRepository(repository);
			
			ServletFileUpload upload = new ServletFileUpload(factory);
			List<FileItem> items = upload.parseRequest(req);
			for(FileItem item : items) {
				if(item.isFormField()) {
					switch(item.getFieldName()) {
					case APIConst.FLD_TASK_ID:
						taskId = Integer.parseInt(item.getString());
						break;
					case APIConst.FLD_TASK_TASKTYPEID:
						taskTypeId = Integer.parseInt(item.getString());
						break;
					case APIConst.FLD_TASK_CONTACT_ID:
						contactId = Integer.parseInt(item.getString());
						break;
					case APIConst.FLD_TASK_TITLE:
						title = item.getString();
						break;
					case APIConst.FLD_TASK_EFFORT:
						effort = Integer.parseInt(item.getString());
						break;
					case APIConst.FLD_TASK_EFFORT_UNIT:
						effortUnit = Integer.parseInt(item.getString());
						break;	
					case APIConst.FLD_TASK_DUE_DATE:
						dueDate = item.getString();
						break;						
					case APIConst.FLD_TASK_STATUS_ID:
						statusId = Integer.parseInt(item.getString());
						break;						
						default:
							System.out.println("CustomerHandler.doPut: Invalid field: Name:" + item.getFieldName() + " value:" + item.getString());
					}
				}
			}	
			TaskDAL.getInstance().update(taskId, taskTypeId, contactId, title, effort, effortUnit, dueDate, statusId);
			json.addProperty("taskId", taskId);
		}catch(SQLException | FileUploadException | NumberFormatException e) {
			System.out.println(this.getClass().getName() + ".doPut: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
		}
		
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	
}
