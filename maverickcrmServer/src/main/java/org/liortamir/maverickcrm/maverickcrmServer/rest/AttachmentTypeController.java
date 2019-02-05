package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.AttachmentTypeDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.AttachmentType;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "AttachmentType", urlPatterns="/attachmenttype")
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
		JsonObject json = new JsonObject();
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			
			if(action == ActionEnum.ACT_ALL) {
				List<AttachmentType> bulk = AttachmentTypeDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
				
			}else if(action == ActionEnum.ACT_SINGLE){
				
				int id = Integer.parseInt(req.getParameter("statusId"));
				attachmentType = AttachmentTypeDAL.getInstance().get(id);
				json.add("attachmentType", jsonHelper.toJsonTree(attachmentType));
			}
			ServletHelper.doSuccess(json);
		}catch(NullPointerException | NumberFormatException | SQLException | InvalidActionException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);		
	}



}
