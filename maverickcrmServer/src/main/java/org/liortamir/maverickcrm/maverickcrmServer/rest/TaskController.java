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
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
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
		resp.setContentType("application/json");
		String response = APIConst.ERROR;
		Task task = null;
		JsonObject json = new JsonObject();
		int taskId = 0;

		int actionId = 0;
		String username = (String)req.getSession().getAttribute("username");
		if(username == null) {
			resp.sendRedirect("/login.html");
			return;
		}
		try {

			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == ActionEnum.ACT_ALL.ordinal()){
				List<Task> taskList = null;
				List<TaskCustomerView> bulk = new ArrayList<>();
				
				int customerId = Integer.parseInt(req.getParameter("customerId"));
				String dueDate = req.getParameter("duedate");
				int projectId = Integer.parseInt(req.getParameter("projectId"));
				int taskTypeId = Integer.parseInt(req.getParameter("tasktypeId"));
				boolean isClosed = (req.getParameter("showclosed").equals("1"))?true:false;
				
				taskList = TaskDAL.getInstance().getAll(customerId, dueDate, projectId, taskTypeId, isClosed);
				
				for(Task item : taskList){
					Customer customer = CustomerDAL.getInstance().getByTask(item.getTaskId());
					if(customer== null)
						customer = new Customer(0, "No Customer", null);
					bulk.add(new TaskCustomerView(item, customer));
				}
				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);	
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){

				taskId = Integer.parseInt(req.getParameter("taskId"));
				task = TaskDAL.getInstance().get(taskId);
				response = jsonHelper.toJson(task);	
			}else if(actionId == ActionEnum.ACT_RELATION_PARENTS.ordinal()) {
				
				taskId = Integer.parseInt(req.getParameter("taskId"));
				List<Task> taskRelationList = TaskDAL.getInstance().getParents(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				response = jsonHelper.toJson(json);	
				
			}else if(actionId == ActionEnum.ACT_RELATION_CHILDREN.ordinal()) {
				
				taskId = Integer.parseInt(req.getParameter("taskId"));
				List<Task> taskRelationList = TaskDAL.getInstance().getChildren(taskId);
				json.add("array", jsonHelper.toJsonTree(taskRelationList));
				response = jsonHelper.toJson(json);	
			}
		}catch(NumberFormatException | SQLException e) {
			System.out.println("TaskController.doGet: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
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
			System.out.println("TaskController.doPost: " + e.getStackTrace()[0] + " " +  e.getMessage());
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
		}catch(SQLException | FileUploadException e) {
			e.printStackTrace();
		}catch(NumberFormatException e) {
			e.printStackTrace();
		}
		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}

	
}
