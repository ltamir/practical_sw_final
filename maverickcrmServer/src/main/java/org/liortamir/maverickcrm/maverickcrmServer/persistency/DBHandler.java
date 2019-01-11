package org.liortamir.maverickcrm.maverickcrmServer.persistency;

import java.sql.Connection;
import java.sql.SQLException;

import org.apache.commons.dbcp2.BasicDataSource;
import org.liortamir.maverickcrm.maverickcrmServer.infra.Reference;

/**
 * This class manages the connection pool to the Derby DB via Apache DBCP2.<br>
 * 
 * @author liort
 *
 */
public class DBHandler {
    private BasicDataSource ds = null;
    
    private Reference ref = Reference.getInstance();
    private String refPrefix = "db";
    private static final DBHandler instance = new DBHandler();
    
    private DBHandler() {
    	ds = new BasicDataSource();
    	
        ds.setUrl("jdbc:derby:" + ref.getAsString("db.path") + ";create=false");
        ds.setUsername(ref.getAsString(refPrefix + ".dbUser"));
        ds.setPassword(ref.getAsString(refPrefix + ".dbPassword"));
        ds.setDefaultSchema(ref.getAsString(refPrefix + ".schema"));
        ds.setMinIdle(ref.getAsInt(refPrefix + ".minIdel"));
        ds.setMaxIdle(ref.getAsInt(refPrefix + ".maxIdel"));
        ds.setMaxOpenPreparedStatements(ref.getAsInt(refPrefix + ".maxOpenPS"));    	
    }
    
    public static DBHandler getInstance() {
    	return instance;
    }
    
    
     //TODO manage threads
    public static Connection getConnection() throws SQLException {
    	Connection conn = null;
    	conn = getInstance().ds.getConnection();
        return conn;
    }
     
}
