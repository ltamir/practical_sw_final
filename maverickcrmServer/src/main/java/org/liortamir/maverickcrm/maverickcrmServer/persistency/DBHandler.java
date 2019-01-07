package org.liortamir.maverickcrm.maverickcrmServer.persistency;

import java.sql.Connection;
import java.sql.SQLException;

import org.apache.commons.dbcp2.BasicDataSource;

/**
 * This class manages the connection pool to the Derby DB via Apache DBCP2.<br>
 * 
 * @author liort
 *
 */
public class DBHandler {
    private static BasicDataSource ds = new BasicDataSource();
    
    static {
        ds.setUrl("jdbc:derby:./data/db;create=false");
        ds.setUsername("sa");
        ds.setPassword("pwd");
        ds.setDefaultSchema("APP");
        ds.setMinIdle(5);
        ds.setMaxIdle(10);
        ds.setMaxOpenPreparedStatements(100);
    }
     
    public static Connection getConnection() throws SQLException {
    	Connection conn = null;
    	conn = ds.getConnection();
        return conn;
    }
     
    private DBHandler(){ }
}
