package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.ContactType;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class ContactTypeDAL {

	private static ContactTypeDAL instance = new ContactTypeDAL();
	private List<ContactType> cacheList = null;
	
	public static ContactTypeDAL getInstance() {
		return instance;
	}
	
	private ContactTypeDAL() {
		loadCache();
	}
	
	public void loadCache(){
		try{
			this.cacheList = get();
		}catch(SQLException | IndexOutOfBoundsException e){
			System.out.println("Error loading ContactTypeDAL chache: " + e.toString());
		}
	}
	
	public ContactType get(int contactTypeId) throws SQLException {
		ContactType entity = this.cacheList.get(contactTypeId-1);
		if(entity != null) return entity;	
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from contactType where contactTypeId=?");
			ps.setInt(1, contactTypeId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<ContactType> getAll() throws SQLException {
		return this.cacheList;
	}
	
	public List<ContactType> get() throws SQLException {
		List<ContactType> entityList = null;
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from contactType order by contactTypeId");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	private ContactType mapFields(ResultSet rs) throws SQLException {
		ContactType contactType = null;

		contactType = new ContactType(rs.getInt("contactTypeId"), rs.getString("contactTypeName"));
		return contactType;
	}
}
