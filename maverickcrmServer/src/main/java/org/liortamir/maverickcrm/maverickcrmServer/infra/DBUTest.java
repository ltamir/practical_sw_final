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
	    		if(bulk.isEmpty()) {
	    			System.out.println("no results");
	    			continue;
	    		}
	    			
	    		int[] lengths = new int[bulk.get(0).getRow().size()];

	    		for(int i = 0; i < bulk.size(); i++) {
	    			for(int j = 0; j < bulk.get(0).getRow().size(); j++) {
	    				int len = bulk.get(i).getRow().get(j).length();
	    				if(len > lengths[j] && len < 51)
	    					lengths[j] = len;
	    			}
	    		}
	    		
	    		for(int i = 0; i < bulk.size(); i++) {
	    			for(int j = 0; j < bulk.get(0).getRow().size(); j++) {
	    				String ggg = String.format("|%-" + lengths[j] + "s|", bulk.get(i).getRow().get(j));
	    				System.out.print(ggg);
	    			}
	    			System.out.println();
	    		}	    		
//	    		bulk.forEach((item) -> {
//	    			item.getRow().forEach((row) ->{
//	    				System.out.print(String.format("%-" + lengths[j] + "s", row.toString()));	
//	    				});
//	    				System.out.println();
//	    			});
	    		}catch(SQLException | NullPointerException e) {
	    			System.out.println("Error: " + e.getMessage() + " try again");
	    		}

	    	}
    	}
	}
    
	
}
