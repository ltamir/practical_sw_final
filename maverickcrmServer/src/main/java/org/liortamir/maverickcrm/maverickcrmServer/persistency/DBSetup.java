package org.liortamir.maverickcrm.maverickcrmServer.persistency;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.SQLNonTransientConnectionException;
import java.sql.Statement;
import java.util.Properties;

import org.liortamir.maverickcrm.maverickcrmServer.infra.Reference;

public class DBSetup {
	
	private static final String derbyDriver = "org.apache.derby.jdbc.EmbeddedDriver";
	private String protocol = "jdbc:derby:";
	private String createDB = "create=";
	private String dbPath = "./data/db";
	private String refPrefix = "db";
	
	private Properties connectionProperties = new Properties();
	private Connection conn = null;
	private Reference ref = Reference.getInstance();

	private static String LOG_ERROR = "ERROR: ";
	
	public DBSetup() {
		
	}
	
	public void startServiceImpl() throws Exception{
		this.createDB =  "create=" + ref.getAsString(refPrefix + ".createDB");
		this.dbPath = ref.getAsString(refPrefix + ".path");
		connectionProperties.put("dbUser", ref.getAsString(refPrefix + ".dbUser"));
		connectionProperties.put("dbPassword", ref.getAsString(refPrefix + ".dbPassword"));
		connectionProperties.put("shutdown", "false");
		
		try {
			Class.forName(derbyDriver).newInstance();
			conn = DriverManager.getConnection(protocol + dbPath + ";" + createDB, connectionProperties);
			
			conn.setAutoCommit(true);
		} catch (InstantiationException | IllegalAccessException
				| ClassNotFoundException e) {
			e.printStackTrace();
			throw new Exception();
		} catch (SQLException e) {
			e.printStackTrace();
			throw new Exception();
		} catch(NullPointerException e){

			e.printStackTrace();
			throw new Exception();
		}
		
		if(ref.getAsBool(refPrefix + ".createDB"))
			initTables();
	}
	
	public void stopServiceImpl() {
		connectionProperties.put("shutdown", "true");
		try {
			DriverManager.getConnection(protocol + dbPath + ";", connectionProperties);
		} catch(SQLNonTransientConnectionException e){
			logger("INFO", "db shutdown");
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}
	
	// ***** database init ***** //
	
		private void initTables() throws Exception{
			logger("INFO", "initializting " + refPrefix + "database");
			String ddlString = null;
			try {
				
				// create tables
					
				int tableCount = ref.getAsInt(refPrefix + ".table.count");
				
				if(tableCount < 1){
					logger(LOG_ERROR, refPrefix + ":initTables(): " + refPrefix + ".tables.count is invalid" );
					return;
				}
					
				for(int currTable = 0; currTable < tableCount; currTable++){
					Statement statement = conn.createStatement();
					ddlString = ref.getAsString(refPrefix + ".table." + currTable + ".ddl");
					
					statement.execute(ddlString);
					logger("INFO", "Executing DDM statement: " + ddlString);
				}
				
				
				// insert data into reference tables
				
				int metadataCount = ref.getAsInt(refPrefix + ".metadata.count", 0);
				
				if(metadataCount < 1){
					logger(LOG_ERROR, refPrefix + ":initTables(): " + refPrefix + ".metadata.count is invalid" );
					return;
				}
				
				for(int currRec = 0; currRec < metadataCount; currRec++){
					Statement statement = conn.createStatement();
					ddlString = ref.getAsString(refPrefix + ".metadata." + currRec + ".dml");
					
					statement.execute(ddlString);
					logger("INFO", "Executing DDM statement: " + ddlString);
				}
				
				// insert data into reference tables
				
				int dataCount = ref.getAsInt(refPrefix + ".data.count", 0);
				
				if(dataCount < 1){
					logger(LOG_ERROR, refPrefix + ":initTables(): " + refPrefix + ".data.count is invalid" );
					return;
				}
				
				for(int currRec = 0; currRec < dataCount; currRec++){
					Statement statement = conn.createStatement();
					ddlString = ref.getAsString(refPrefix + ".data." + currRec + ".dml");
					
					statement.execute(ddlString);
					logger("INFO", "Executing DDM statement: " + ddlString);
				}				

			} catch (SQLException e) {
				logger("ERROR", "Error during statement: " + ddlString);
				e.printStackTrace();
				throw new Exception();
			}
		}
		
		private void logger(String severity, String data) {
			System.out.println(data);
		}
}
