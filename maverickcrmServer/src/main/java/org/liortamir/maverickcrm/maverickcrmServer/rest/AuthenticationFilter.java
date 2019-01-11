package org.liortamir.maverickcrm.maverickcrmServer.rest;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@MultipartConfig
public class AuthenticationFilter implements Filter {

	private ServletContext context;
	
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

		}
		if(username == null)
			isAuthenticated = false;
		else
			isAuthenticated = true;
		
//		this.context.log("Request: " + uri);
		if(isAuthenticated) {
//			this.context.log("Approved: " + uri);
			chain.doFilter(request, response);
		}else if(session == null) {
			this.context.log("Not approved: " + uri);
			resp.sendRedirect("login.html");
		}else if(uri.endsWith("authenticate")) {
//			this.context.log("Authenticating: " + uri);
			chain.doFilter(request, response);
		}
		else if(!isAuthenticated && (uri.contains("login.html") || uri.endsWith("png"))){	// )
//			this.context.log("Login.html requested: " + uri);
			chain.doFilter(request, response);
		}else if(!isAuthenticated) {
//			this.context.log("not authenticated: " + uri);
			resp.sendRedirect("login.html");
		}
			
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}
	

}
