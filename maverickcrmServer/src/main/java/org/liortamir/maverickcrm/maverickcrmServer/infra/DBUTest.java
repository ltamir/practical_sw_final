package org.liortamir.maverickcrm.maverickcrmServer.infra;

import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

import org.liortamir.maverickcrm.maverickcrmServer.dal.DatabaseDAL;
import org.liortamir.maverickcrm.maverickcrmServer.model.DatabaseRow;

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
	    		try {
	    		List<DatabaseRow> bulk = DatabaseDAL.getInstance().executeSQL(sql);
	    		bulk.forEach((item) -> {
	    			item.getRow().forEach((row) ->{
	    				System.out.print(row.toString());	
	    				});
	    				System.out.println();
	    			});
	    		}catch(SQLException | NullPointerException e) {
	    			System.out.println("Error: " + e.getMessage() + " try again");
	    		}

	    	}
    	}
	}
    
	
}
