package org.liortamir.maverickcrm.maverickcrmServer.infra;

import java.io.File;
import java.net.MalformedURLException;

import javax.servlet.ServletException;

import org.apache.catalina.LifecycleException;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBSetup;

public class Bootstrap {

	public static void main(String[] args) {
		
		
		File[] files = new File("./data/db").listFiles();
		if(files == null || files.length == 0) {
			System.out.println("creating db");
			DBSetup dbSetup = new DBSetup();
			try {
				dbSetup.startServiceImpl();
			}catch(Exception e) {
				e.printStackTrace();
				System.exit(0);
			}
			dbSetup.stopServiceImpl();
		}else {
			System.out.println("db exists");
		}
		
		new Thread(new DBUTest()).start();
		EmbeddedTomcat tomcat = new EmbeddedTomcat();
		try {
			tomcat.start();
		} catch (MalformedURLException | ServletException | LifecycleException e) {
			e.printStackTrace();
		}
		

	}

}
