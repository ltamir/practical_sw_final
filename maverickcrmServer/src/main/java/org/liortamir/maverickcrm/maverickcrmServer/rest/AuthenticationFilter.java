package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.liortamir.maverickcrm.maverickcrmServer.dal.LoginDAL;
import org.liortamir.maverickcrm.maverickcrmServer.model.Login;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class AuthenticationFilter implements Filter {

	private ServletContext context;
	private Gson jsonHelper = new Gson();
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		this.context = filterConfig.getServletContext();

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		boolean isAuthenticated = false;
		HttpServletRequest req = (HttpServletRequest)request;
		HttpServletResponse resp = (HttpServletResponse)response;
		
		String uri = req.getRequestURI();
		HttpSession session = req.getSession(true);

		String username = null;
		if(session != null ) {
			username = (String)session.getAttribute("username");
		if(username == null)
			isAuthenticated = false;
		}
		
		if(session == null) {
			this.context.log("Unauthorized access request");
			resp.sendRedirect("login.html");
		}else if(!isAuthenticated && (uri.endsWith("html") || uri.endsWith("png"))){	// )
			isAuthenticated = authenticate(req, resp);
			chain.doFilter(request, response);
		}else if(!isAuthenticated) {
			resp.sendRedirect("login.html");
		}
		
		if(isAuthenticated) {
			resp.sendRedirect("index.html");
		}
		
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}
	
	private boolean authenticate(HttpServletRequest req, HttpServletResponse resp) {
		boolean isAuthenticated = false;
		Login login = null;
		try {
			String username = req.getParameter("username");
			String password = req.getParameter("password");
			if(username != null) {
				login = LoginDAL.getInstance().authenticate(username, password);	
				if(login != null)
					isAuthenticated = true;
				else
				{
					JsonObject json = new JsonObject();
					json.addProperty("msg", "Invalid user or password. Please try Again");
					String response = jsonHelper.toJson(json);	
					PrintWriter out = resp.getWriter();
					out.println(response);
				}			
			}

		}catch(IOException | NullPointerException | SQLException e) {
			System.out.println("TaskController.doGet: " + e.toString() + " " + req.getQueryString());
		}
		return isAuthenticated;
	}

}
