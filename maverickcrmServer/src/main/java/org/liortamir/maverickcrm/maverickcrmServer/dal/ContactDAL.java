package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Contact;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class ContactDAL {
	
	private static ContactDAL instance = new ContactDAL();
	
	private ContactDAL() {}
	
	public static ContactDAL getInstance() {
		return instance;
	}

	public Contact get(int contactId) throws SQLException {
		Contact entity = null;
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from contact where contactId=?");
			ps.setInt(1, contactId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<Contact> getAll() throws SQLException {
		List<Contact> entityList = null;
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from contact order by contact.firstName");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(50);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public List<Contact> getAllLogin() throws SQLException {
		List<Contact> entityList = null;
		try (Connection conn = DBHandler.getConnection()){

			PreparedStatement ps = conn.prepareStatement("select * from contact inner join login on login.contactId = contact.contactId order by contact.firstName");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(50);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public int insert(Contact contact) throws SQLException{
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into contact values (default,?,?,?,?,?,?)", Statement.RETURN_GENERATED_KEYS);
			ps.setString(1, contact.getFirstName());
			ps.setString(2, contact.getLastName());
			ps.setString(3, contact.getOfficePhone());
			ps.setString(4, contact.getMobilePhone());
			ps.setString(5, contact.getEmail());
			ps.setString(6, contact.getNotes());
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert task");
				
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);
		}
		return identity;
	}
	
	public void update (Contact contact) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update contact set firstName = ?, lastName = ?, officePhone = ?, mobilePhone = ?, email = ?, notes = ? where contactId = ? ");
			
			ps.setString(1, contact.getFirstName());
			ps.setString(2, contact.getLastName());
			ps.setString(3, contact.getOfficePhone());
			ps.setString(4, contact.getMobilePhone());
			ps.setString(5, contact.getEmail());
			ps.setString(6, contact.getNotes());
			ps.setInt(7, contact.getContactId());
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert task");		
		}
	}
	
	public void delete (int contactId) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("delete from contact where contactId=?");
			ps.setInt(1, contactId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert task");		
		}
	}	
	
	private Contact mapFields(ResultSet rs) throws SQLException{
		Contact contact = null;

		contact = new Contact(rs.getInt("contactId"), 
				rs.getString("firstName"), 
				rs.getString("lastName"), 
				rs.getString("officePhone"), 
				rs.getString("mobilePhone"), 
				rs.getString("email"),
				rs.getString("notes"));
		
		return contact;
	}
}
