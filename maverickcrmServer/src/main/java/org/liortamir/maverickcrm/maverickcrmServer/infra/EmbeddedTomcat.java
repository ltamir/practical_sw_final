package org.liortamir.maverickcrm.maverickcrmServer.infra;

import java.io.File;
import java.net.MalformedURLException;

import javax.servlet.ServletException;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.StandardRoot;

public class EmbeddedTomcat {

	private Reference ref = Reference.getInstance();
	private String refPrefix = "http";
	
	public void start() throws ServletException, LifecycleException,
    MalformedURLException {
	
		// Define a folder to hold web application contents.
		String webappDirLocation = "Webapps/ROOT/";
		Tomcat tomcat = new Tomcat();
		
		// Define port number for the web application
		String webPort = System.getenv("PORT");
		if (webPort == null || webPort.isEmpty()) {
		webPort = ref.getAsString(refPrefix + ".port", "8080");
		}
		// Bind the port to Tomcat server
		tomcat.setPort(Integer.valueOf(webPort));
		
		// Define a web application context.
		Context context = tomcat.addWebapp("/maverick", new File(
		webappDirLocation).getAbsolutePath());
		
		// Define and bind web.xml file location.
		File configFile = new File(webappDirLocation + "WEB-INF/web.xml");
		context.setConfigFile(configFile.toURI().toURL());
		
		
		// Additions to make @WebServlet work
		  String buildPath = "target";
		  String webAppMount = "/WEB-INF/classes";

		  File additionalWebInfClasses = new File(buildPath);
		  WebResourceRoot resources = new StandardRoot(context);
		  resources.addPreResources(new DirResourceSet(resources, webAppMount, additionalWebInfClasses.getAbsolutePath(), "/"));
		  context.setResources(resources);
		  
		tomcat.start();
		tomcat.getServer().await();
	}
}
