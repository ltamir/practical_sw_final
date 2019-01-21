package org.liortamir.maverickcrm.maverickcrmServer.model;

import java.util.ArrayList;
import java.util.List;

public class DatabaseRow {

	private List<String> row = null;
	
	public DatabaseRow(){
		row = new ArrayList<>();
	}
	
	public DatabaseRow(int numOfFields){
		row = new ArrayList<>(numOfFields);
	}
	
	public void add(String field) {
		row.add(field);
	}

	public void add(Integer field) {
		row.add(String.valueOf(field));
	}
	
	public void add(java.sql.Date field) {
		row.add(String.valueOf(field));
	}	
	
	public void add(java.sql.Timestamp field) {
		row.add(String.valueOf(field));
	}
	
	public List<String> getRow(){
		return row;
	}
}
