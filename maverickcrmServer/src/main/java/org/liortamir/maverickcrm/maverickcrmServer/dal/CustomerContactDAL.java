package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.CustomerContact;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class CustomerContactDAL {

	private static CustomerContactDAL instance = new CustomerContactDAL();
	
	public static CustomerContactDAL getInstance() {
		return instance;
	}
	
	private CustomerContactDAL() {}
	
	public CustomerContact get(int customerContactId) throws SQLException {
		CustomerContact entity = null;
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from customerContact where customerContactId=?");
			ps.setInt(1, customerContactId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<CustomerContact> getAll() throws SQLException {
		List<CustomerContact> entityList = null;
		
		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from customerContact");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
		
	public int insert(int customerId, int contactId, int contactTypeId) throws SQLException {
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("insert into customerContact values(default,?,?,?)", Statement.RETURN_GENERATED_KEYS);
			ps.setInt(1, customerId);
			ps.setInt(2, contactId);
			ps.setInt(3, contactTypeId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("error insert customercontact");
			
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);
		}
		return identity;
	}
	
	public void update(int customerContactId, int customerId, int ContactId, int contactTypeId) throws SQLException {

		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("update customerContact set customerId=?, contactId=?, contactTypeId=? where customerContactId=?");
			ps.setInt(1, customerId);
			ps.setInt(2, ContactId);
			ps.setInt(3, contactTypeId);
			ps.setInt(4, customerContactId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert task");
		}
	}
	
	public void delete(int customerContactId) throws SQLException {
		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("delete from customerContact where customerContactId=?");
			ps.setInt(1, customerContactId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert task");
		}
	}
	
	public List<CustomerContact> getByContact(int contactId) throws SQLException {
		List<CustomerContact> entityList = null;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from customercontact where contactId=?");
			ps.setInt(1, contactId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(20);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	public List<CustomerContact> getByCustomer(int customerId) throws SQLException {
		List<CustomerContact> entityList = null;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from customercontact where customerId=?");
			ps.setInt(1, customerId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(20);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}		
	
	private CustomerContact mapFields(ResultSet rs)throws SQLException {
		CustomerContact customerContacts = null;

		customerContacts = new CustomerContact(
				rs.getInt("customerContactId"), 
				CustomerDAL.getInstance().get(rs.getInt("customerId")),
				ContactDAL.getInstance().get(rs.getInt("contactId")),
				ContactTypeDAL.getInstance().get(rs.getInt("contactTypeId")));

		return customerContacts;
	}
}
