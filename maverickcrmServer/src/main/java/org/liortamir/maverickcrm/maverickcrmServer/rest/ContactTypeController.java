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
		int actionId = 0;
		
		try {
			actionId = Integer.parseInt(req.getParameter(APIConst.PARAM_ACTION_ID));
			
			if(actionId == ActionEnum.ACT_ALL.ordinal()){
				
				List<ContactType> bulk;
				json = new JsonObject();
				bulk = ContactTypeDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));			
				response = jsonHelper.toJson(json);	
				
			}else if(actionId == ActionEnum.ACT_SINGLE.ordinal()){
				
				id = Integer.parseInt(req.getParameter("contactId"));
				contactType = ContactTypeDAL.getInstance().get(id);
				json = new JsonObject();
				response = jsonHelper.toJson(contactType);									
			}

		}catch(NumberFormatException | SQLException e) {
			System.out.println(this.getClass().getName() + ".doPost: " + e.toString() + " " + req.getQueryString());
			json.addProperty("msg",  e.getMessage());
			json.addProperty("status",  "nack");
		}
		
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}



	

}
