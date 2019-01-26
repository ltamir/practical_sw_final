package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.AttachmentTypeDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.AttachmentType;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class AttachmentTypeController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		AttachmentType attachmentType = null;
		JsonObject json = null;
		int actionId = 0;
		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == ActionEnum.ACT_ALL.ordinal()) {
				resp.setContentType("application/json");
				List<AttachmentType> bulk = AttachmentTypeDAL.getInstance().getAll();
				json = new JsonObject();

				json.add("array", jsonHelper.toJsonTree(bulk));
				response = jsonHelper.toJson(json);
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				
				int id = Integer.parseInt(req.getParameter("statusId"));
				attachmentType = AttachmentTypeDAL.getInstance().get(id);
				json = new JsonObject();
				response = jsonHelper.toJson(attachmentType);					
			}
		}catch(NullPointerException | NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doGet: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  "Internal error, please check the log");
			json.addProperty("err",  e.toString());
			json.addProperty("status",  "nack");
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);		
	}



}
