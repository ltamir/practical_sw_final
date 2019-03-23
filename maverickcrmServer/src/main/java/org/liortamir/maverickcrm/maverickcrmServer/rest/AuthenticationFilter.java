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
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;

@WebFilter(filterName="AuthenticationFilter", urlPatterns="/*")
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
		
		resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
		resp.setHeader("Pragma", "no-cache"); // HTTP 1.0.
		resp.setHeader("Expires", "0"); // Proxies.
		
		String uri = req.getRequestURI();
		HttpSession session = req.getSession(true);

		Integer sessionLoginId = null;
		if(session != null ) {
			sessionLoginId = (Integer)session.getAttribute(APIConst.FLD_LOGIN_ID);
		}
		if(sessionLoginId == null)
			isAuthenticated = false;
		else
			isAuthenticated = true;
		
		int tryCount = 0;
		if(req.getSession().getAttribute("tryCount") != null) tryCount = (Integer)req.getSession().getAttribute("tryCount");
		tryCount++;
		req.getSession().setAttribute("tryCount", tryCount);
		
		if(isAuthenticated) {
			chain.doFilter(request, response);
		}else if(session == null) {
			this.context.log("Not approved: " + uri);
			resp.sendRedirect("login.html");
		}else if(uri.endsWith("authenticate")) {
			chain.doFilter(request, response);
		}
		else if(!isAuthenticated && (uri.contains("maverick/login.html") || uri.endsWith("png"))){	// )
			chain.doFilter(request, response);
		}else if(!isAuthenticated) {
			if(tryCount > 2)
				resp.sendError(404);
			else
				resp.sendRedirect("login.html");
		}
			
	}

	@Override
	public void destroy() {

	}
	

}
