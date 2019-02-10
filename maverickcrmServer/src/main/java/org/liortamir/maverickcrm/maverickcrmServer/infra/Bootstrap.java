package org.liortamir.maverickcrm.maverickcrmServer.infra;

import java.io.File;
import java.net.MalformedURLException;

import javax.servlet.ServletException;

import org.apache.catalina.LifecycleException;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBSetup;

public class Bootstrap {

	public static void main(String[] args) {
		Reference ref = Reference.getInstance();
		String storagePath = ref.getAsString("attachment.fileStorage");
		
		if(storagePath == null) {
			System.exit(0);
		}
			
		File attachmentDir = new File(storagePath);
		if(!attachmentDir.exists()) {
			System.out.println("Attachment directory set to " + storagePath);
			new File(storagePath).mkdirs();
		}
		
		// database init
		File[] files = new File(ref.getAsString("db.path")).listFiles();
		if(files == null || files.length == 0) {
			System.out.println("Creating DB");
			DBSetup dbSetup = new DBSetup();
			try {
				dbSetup.startServiceImpl();
			}catch(Exception e) {
				e.printStackTrace();
				System.exit(0);
			}
			System.out.println("Database directory set to " + ref.getAsString("db.path"));
			dbSetup.stopServiceImpl();
		}else {
			System.out.println("DB exists: " + storagePath);
		}
		
		new Thread(new DBUTest()).start();
		EmbeddedTomcat tomcat = new EmbeddedTomcat();
		try {
			tomcat.start();
		} catch (MalformedURLException | ServletException | LifecycleException e) {
			e.printStackTrace();
			System.exit(0);
		}
		

	}

}
