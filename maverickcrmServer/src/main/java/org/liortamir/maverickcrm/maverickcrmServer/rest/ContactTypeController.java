package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.ContactTypeDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.ContactType;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class ContactTypeController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		ContactType contactType = null;
		JsonObject json = null;
		int id = 0;
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			
			if(action == ActionEnum.ACT_ALL){
				
				List<ContactType> bulk;
				json = new JsonObject();
				bulk = ContactTypeDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));			
					
			}else if(action == ActionEnum.ACT_SINGLE){
				
				id = Integer.parseInt(req.getParameter("contactId"));
				contactType = ContactTypeDAL.getInstance().get(id);
				ServletHelper.addJsonTree(jsonHelper, json, "contactType", contactType);								
			}
			ServletHelper.doSuccess(json);
		}catch(NumberFormatException | SQLException | InvalidActionException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}



	

}
