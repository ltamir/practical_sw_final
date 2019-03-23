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

import org.liortamir.maverickcrm.maverickcrmServer.dal.LoginDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.infra.InvalidLoginException;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "Login", urlPatterns="/login")
@MultipartConfig
public class LoginController extends HttpServlet {

	
	/**
	 * 
	 */
	private static final long serialVersionUID = -2104805615225405434L;
	private Gson jsonHelper = new Gson();
	private LoginDAL dal = LoginDAL.getInstance();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		Login login = null;
		JsonObject json = new JsonObject();
		int id = 0;
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			
			if(action == ActionEnum.GET_ALL) {
				
				List<Login> bulk = dal.getAll();
				json.add("array", jsonHelper.toJsonTree(bulk));
			
			}else if(action == ActionEnum.GET_SINGLE){
				int sessionLoginId = (Integer)req.getSession().getAttribute(APIConst.FLD_LOGIN_ID);
				
				id = Integer.parseInt(req.getParameter(APIConst.FLD_LOGIN_ID));
				login = dal.get(id);
//				if(login.getLoginId() != sessionLoginId)
//					login.setPassword("*****");
				ServletHelper.addJsonTree(jsonHelper, json, "login", login);
			}else if(action == ActionEnum.LOGIN_BY_CONTACT) {
				int contactId = Integer.parseInt(req.getParameter(APIConst.FLD_CONTACT_ID));
				login = dal.getByContact(contactId);
				req.getSession().setAttribute("login", login);
				return;
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
					username = ServletHelper.getPartString(part);
					break;
				case APIConst.FLD_LOGIN_PASSWORD:
					password = ServletHelper.getPartString(part);
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
			loginId = dal.insert(username, password, contactId);
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
					loginId = ServletHelper.getPartInt(part);
					break;
				case APIConst.FLD_LOGIN_USERNAME:
					username = ServletHelper.getPartString(part);
					break;
				case APIConst.FLD_LOGIN_PASSWORD:
					password = ServletHelper.getPartString(part);
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

			dal.update(username, contactId, loginId);
			if(password == null || password.length() < 4)
				throw new InvalidLoginException("password must have at least 4 characters");
			dal.updatePassword(password, loginId);
			
			json.addProperty(APIConst.FLD_LOGIN_ID, loginId);
			ServletHelper.doSuccess(json);
		}catch(NullPointerException | NumberFormatException | SQLException | InvalidLoginException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_PUT, json, req);
			json.addProperty(APIConst.FLD_LOGIN_ID, 0);
		}
		response = jsonHelper.toJson(json);
		PrintWriter out = resp.getWriter();
		out.println(response);	
	}

}
