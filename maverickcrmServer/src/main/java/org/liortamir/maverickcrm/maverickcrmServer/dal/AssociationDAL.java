package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Association;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class AssociationDAL {

	private static AssociationDAL instance = new AssociationDAL();
	
	public static AssociationDAL getInstance() {
		return instance;
	}
	
	private AssociationDAL() {}
	
	public Association get(int connectionId) throws SQLException {
		Association entity = null;
		try (java.sql.Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from association where associationId=?");
			ps.setInt(1, connectionId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<Association> getAll() throws SQLException {
		List<Association> entityList = null;
		
		try(java.sql.Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from association");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
		
	public int insert(int customerId, int contactId, int contactTypeId, int addressId) throws SQLException {
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("insert into association values(default,?,?,?,?)", Statement.RETURN_GENERATED_KEYS);
			ps.setInt(1, customerId);
			ps.setInt(2, contactId);
			ps.setInt(3, contactTypeId);
			ps.setInt(4, addressId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("error insert association");
			
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);
		}
		return identity;
	}
	
	public void update(int associationId, int customerId, int contactId, int contactTypeId, int addressId) throws SQLException {

		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("update association set customerId=?, contactId=?, contactTypeId=?, addressId=? where associationId=?");
			ps.setInt(1, customerId);
			ps.setInt(2, contactId);
			ps.setInt(3, contactTypeId);
			ps.setInt(4, addressId);
			ps.setInt(5, associationId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing update association");
		}
	}
	
	public void delete(int associationId) throws SQLException {
		try(java.sql.Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("delete from association where associationId=?");
			ps.setInt(1, associationId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing delete association");
		}
	}
	
	public List<Association> getByContact(int contactId) throws SQLException {
		List<Association> entityList = null;
		
		try (java.sql.Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from association where contactId=?");
			ps.setInt(1, contactId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(20);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	public List<Association> getByCustomer(int customerId) throws SQLException {
		List<Association> entityList = null;
		
		try (java.sql.Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from association where customerId=?");
			ps.setInt(1, customerId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(20);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public List<Association> getByAddress(int addressId) throws SQLException {
		List<Association> entityList = null;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from association where addressId=?");
			ps.setInt(1, addressId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(20);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	private Association mapFields(ResultSet rs)throws SQLException {
		Association association = null;

		association = new Association(
				rs.getInt("associationId"), 
				CustomerDAL.getInstance().get(rs.getInt("customerId")),
				ContactDAL.getInstance().get(rs.getInt("contactId")),
				AddressDAL.getInstance().get(rs.getInt("addressId")),
				ContactTypeDAL.getInstance().get(rs.getInt("contactTypeId")));

		return association;
	}
}
