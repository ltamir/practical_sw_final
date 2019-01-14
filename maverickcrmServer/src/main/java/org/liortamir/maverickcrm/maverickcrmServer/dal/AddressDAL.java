package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Address;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class AddressDAL {

	private static final AddressDAL instance = new AddressDAL();
	
	private AddressDAL() {}
	
	public static AddressDAL getInstance() {
		return instance;
	}
	
	public Address get(int addressId) throws SQLException {
		Address entity = null;

		try (Connection conn = DBHandler.getConnection()){
			
			PreparedStatement stmt = conn.prepareStatement("select * from address where addressId=?");
			stmt.setInt(1, addressId);
			ResultSet rs = stmt.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<Address> getAll() throws SQLException {
		List<Address> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement stmt = conn.prepareStatement("select * from address");
			ResultSet rs = stmt.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public List<Address> getByCustomer(int customerId) throws SQLException {
		List<Address> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement stmt = conn.prepareStatement("select * from address where addressId in(select addressId from customercontact where customerId=?)"
					+ " or addressId in(select addressId from customeraddress where customerId=?)");
			stmt.setInt(1, customerId);
			stmt.setInt(2, customerId);
			ResultSet rs = stmt.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public int insert(Address address) throws SQLException{
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into address values(default, ?,?,?,?)", Statement.RETURN_GENERATED_KEYS);
			ps.setString(1, address.getStreet());
			ps.setString(2, address.getHouseNum());
			ps.setString(3, address.getCity());
			ps.setString(4, address.getCountry());
			if(ps.executeUpdate()  != 1)
				throw new SQLException("error inserting into address");
			
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);
		}
		return identity;
	}
	
	public void update(Address address) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update address set street=?, houseNum=?, city=?, country=? where addressId=?");
			ps.setString(1, address.getStreet());
			ps.setString(2, address.getHouseNum());
			ps.setString(3, address.getCity());
			ps.setString(4, address.getCountry());
			ps.setInt(5, address.getAddressId());
			
			if(ps.executeUpdate()  != 1)
				throw new SQLException("error inserting into address");
		}
	}
	
	public void delete(int addressId) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("delete from address where addressId=?");
				ps.setInt(1, addressId);
			if(ps.executeUpdate()  != 1)
				throw new SQLException("error inserting into address");
		}
	}
	
	private Address mapFields(ResultSet rs) throws SQLException{
		Address address = null;
		address = new Address(rs.getInt("addressId"), rs.getString("street"), rs.getString("houseNum"), rs.getString("city"), rs.getString("country"));

		return address;
	}
}
