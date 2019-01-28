package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.InputStream;
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
import org.liortamir.maverickcrm.maverickcrmServer.dal.LoginDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet
@MultipartConfig
public class LoginController extends HttpServlet {

	
	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	private Gson jsonHelper = new Gson();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Login login = null;
		JsonObject json = new JsonObject();
		int id = 0;
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			
			if(action == ActionEnum.ACT_ALL) {
				
				List<Login> bulk = LoginDAL.getInstance().getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
			
			}else if(action == ActionEnum.ACT_SINGLE){
				String username = (String)req.getSession().getAttribute("username");
				
				id = Integer.parseInt(req.getParameter("loginId"));
				login = LoginDAL.getInstance().get(id);
				if(!login.getUsername().equals(username))
					login.setPassword("*****");
				json = new JsonObject();
				ServletHelper.addJsonTree(jsonHelper, json, "login", login);
			}
			
			ServletHelper.doSuccess(json);
		}catch(NullPointerException | NumberFormatException | SQLException | InvalidActionException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_GET, json, req);
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		String response;
		int loginId = 0;
		String username = null;
		String password = null;
		int contactId = 0;
		try {
			for(Part part : req.getParts()) {
				switch(part.getName()) {
				case APIConst.FLD_LOGIN_USERNAME:
					username = new String(IOUtils.toByteArray(part.getInputStream()));
					break;
				case APIConst.FLD_LOGIN_PASSWORD:
					password = new String(IOUtils.toByteArray(part.getInputStream()));
					break;
				case APIConst.FLD_LOGIN_CONTACT_ID:

					InputStream is = part.getInputStream();
					int b;
					while((b = is.read()) != -1) {
						contactId += b-48;
						contactId *=10;
					}
					contactId /= 10;
				}
			}
			loginId = LoginDAL.getInstance().insert(username, password, contactId);
			json.addProperty(APIConst.FLD_LOGIN_ID, loginId);
			ServletHelper.doSuccess(json);
		}catch(NullPointerException | NumberFormatException | SQLException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);
			json.addProperty(APIConst.FLD_LOGIN_ID, 0);
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		JsonObject json = new JsonObject();
		String response;
		int loginId = 0;
		String username = null;
		String password = null;
		int contactId = 0;
		try {
			
			for(Part part : req.getParts()) {
				switch(part.getName()) {
				case APIConst.FLD_LOGIN_ID:
					loginId = Integer.parseInt(new String(IOUtils.toByteArray(part.getInputStream())));
					break;
				case APIConst.FLD_LOGIN_USERNAME:
					username = new String(IOUtils.toByteArray(part.getInputStream()));
					break;
				case APIConst.FLD_LOGIN_PASSWORD:
					password = new String(IOUtils.toByteArray(part.getInputStream()));
					break;
				case APIConst.FLD_LOGIN_CONTACT_ID:
					InputStream is = part.getInputStream();
					int b;
					while((b = is.read()) != -1) {
						contactId += b-48;
						contactId *=10;
					}
					contactId /= 10;
				}
			}

			LoginDAL.getInstance().update(username, contactId, loginId);
			if(password != null && password.length()>4)
				LoginDAL.getInstance().updatePassword(password, loginId);
			
			int loggedInId = (Integer)req.getSession().getAttribute("loginId");
			if(loggedInId == loginId)
				req.getSession().setAttribute("username", username);
			
			json.addProperty(APIConst.FLD_LOGIN_ID, loginId);
			ServletHelper.doSuccess(json);
		}catch(NullPointerException | NumberFormatException | SQLException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
			json.addProperty(APIConst.FLD_LOGIN_ID, 0);
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

}
