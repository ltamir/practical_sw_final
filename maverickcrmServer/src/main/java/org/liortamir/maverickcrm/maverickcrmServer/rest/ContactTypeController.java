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

import org.liortamir.maverickcrm.maverickcrmServer.dal.AbstractDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.ContactTypeDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.ContactType;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "ContactType", urlPatterns="/contacttype")
public class ContactTypeController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	
	private AbstractDAL<ContactType> dal = ContactTypeDAL.getInstance();
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		ContactType contactType = null;
		JsonObject json = new JsonObject();
		int id = 0;
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			
			if(action == ActionEnum.ACT_ALL){
				
				List<ContactType> bulk;
				bulk = dal.getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));			
					
			}else if(action == ActionEnum.ACT_SINGLE){
				
				id = Integer.parseInt(req.getParameter("contactId"));
				contactType = dal.get(id);
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
