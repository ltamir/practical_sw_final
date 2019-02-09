package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.DatabaseRow;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class DatabaseDAL {

	private static final DatabaseDAL instance = new DatabaseDAL();
	
	private DatabaseDAL() {}
	
	public static DatabaseDAL getInstance() {
		return instance;
	}
	
	public List<DatabaseRow> executeSQL(String sql) throws SQLException{
		List<DatabaseRow> bulk = null;
    	try(Connection conn = DBHandler.getConnection()){
    		PreparedStatement ps = conn.prepareStatement(sql);
    		ResultSet rs = null;
    		int updatedRows = 0;

    		if(sql.startsWith("insert") || sql.startsWith("update") || sql.startsWith("delete")) {
    			updatedRows = ps.executeUpdate();
    			System.out.println("updated " + updatedRows + " rows");
    		}else if(sql.startsWith("alter") || sql.startsWith("create") || sql.startsWith("drop") || sql.startsWith("rename")) {
    			updatedRows = ps.executeUpdate();
    		}else if(sql.contains("CALL")) {
    			ps.execute();
    		}
    		else {
    			rs= ps.executeQuery();
    			bulk = new ArrayList<>();
    			DatabaseRow row = new DatabaseRow(rs.getMetaData().getColumnCount());
    			for(int col = 1; col<=rs.getMetaData().getColumnCount(); col++) {
    				row.add(rs.getMetaData().getColumnLabel(col));
    			}
    			bulk.add(row);
        		while(rs.next()){
        			bulk.add(mapFields(rs));
        		}        			
    		}

    	}
    	return bulk;
	}
	
	
	private DatabaseRow mapFields(ResultSet rs) throws SQLException{
		DatabaseRow row = new DatabaseRow(rs.getMetaData().getColumnCount());
		
		for(int col = 1; col<=rs.getMetaData().getColumnCount(); col++){
			switch(rs.getMetaData().getColumnType(col)){
			case java.sql.Types.DATE:
				row.add(rs.getDate(col));
				break;
			case Types.INTEGER:
				row.add(rs.getInt(col));
				break;
			case Types.VARCHAR:
				row.add(rs.getString(col));
				break;
			case Types.TIMESTAMP:
				row.add(rs.getTimestamp(col));
				break;
				default:
					System.out.println("Unknown " + rs.getMetaData().getColumnType(col));
			}
		}
		return row;
	}
}
