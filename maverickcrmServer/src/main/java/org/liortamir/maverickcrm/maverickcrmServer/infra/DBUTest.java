package org.liortamir.maverickcrm.maverickcrmServer.infra;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Scanner;

import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class DBUTest implements Runnable{
	
     
    public static void main(String[] args){
    	
    }

	@Override
	public void run() {
		String sql = "enter";
    	try(Scanner scanner = new Scanner(System.in)){

	    	while(!sql.equalsIgnoreCase("exit")){
	    		System.out.print(">>>");
	    		sql=scanner.nextLine();
	        	try(Connection conn = DBHandler.getConnection()){
	        		PreparedStatement ps = conn.prepareStatement(sql);
	        		ResultSet rs = null;
	        		int updatedRows = 0;
	        		if(sql.length() == 0)
	        			continue;
	        		if(sql.contains("insert") || sql.contains("update") || sql.contains("alter")) {
	        			updatedRows = ps.executeUpdate();
	        			System.out.println("updated " + updatedRows + " rows");
	        		}
	        		else {
	        			rs= ps.executeQuery();
	            		while(rs.next()){
	            			for(int col = 1; col<=rs.getMetaData().getColumnCount(); col++){
	            				switch(rs.getMetaData().getColumnType(col)){
	            				case java.sql.Types.DATE:
	            					System.out.print(rs.getDate(col) + "|");
	            					break;
	            				case Types.INTEGER:
	            					System.out.print(rs.getInt(col) + "|");
	            					break;
	            				case Types.VARCHAR:
	            					System.out.print(rs.getString(col) + "|");
	            					break;
	            				case Types.TIMESTAMP:
	            					System.out.print(rs.getTimestamp(col) + "|");
	            					default:
	            						System.out.println("Unknown " + rs.getMetaData().getColumnType(col));
	            				}
	            			}
	            			System.out.println();
	            		}        			
	        		}
	
	        	}catch(SQLException e){
	        		System.out.println("Error: " + e.getMessage() + " try again");
	        	}
	    	}
    	}
	}
    
	
}
