package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.servlet.DispatcherType;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.liortamir.maverickcrm.maverickcrmServer.dal.LoginDAL;
import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.infra.ActionEnum;
import org.liortamir.maverickcrm.maverickcrmServer.infra.Reference;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "Authentication", urlPatterns="/authenticate")
@MultipartConfig
public class AuthenticationController extends HttpServlet {

	private static final long serialVersionUID = -3340984536477397627L;
	private Gson jsonHelper = new Gson();
	private Reference ref = Reference.getInstance();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType(APIConst.CONTENT_TYPE);
		String response = null;
		JsonObject json = new JsonObject();
		
		try {
			ActionEnum action = ServletHelper.getAction(req);
			switch(action) {
			case GET_LOGGED_IN:
				int user = (Integer) req.getSession().getAttribute(APIConst.FLD_LOGIN_ID);

				Login login = LoginDAL.getInstance().get(user);
				if(req.getDispatcherType() == DispatcherType.INCLUDE) {
					req.getSession().setAttribute("login", login);
					return;
				}
				json.add("login", jsonHelper.toJsonTree(login));
				json.addProperty("devmod", ref.getAsString("devmod", "false"));
				break;
			case DO_LOGOUT:
				req.getSession().removeAttribute(APIConst.FLD_LOGIN_ID);
				resp.sendRedirect("login.html");
				break;
				default:
					throw new InvalidActionException(action.ordinal());
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
		Login login = null;
		
		try {
			String username = req.getParameter(APIConst.FLD_LOGIN_USERNAME);
			String password = req.getParameter(APIConst.FLD_LOGIN_PASSWORD);
			login = LoginDAL.getInstance().authenticate(username, password);
			if(login == null) {
				json.addProperty("msg", "Invalid user or password. Please try Again");	
				
			}else {
				req.getSession().setAttribute("loginId", login.getLoginId());
				json.addProperty("msg", "ok");
				ServletHelper.doSuccess(json);
				json.addProperty("redirect", "index.html");
			}
		}catch(SQLException | NullPointerException e) {
			ServletHelper.doError(e, this, ServletHelper.METHOD_POST, json, req);		
		}

		String response = jsonHelper.toJson(json);	
		PrintWriter out = resp.getWriter();
		out.println(response);
	}
}
