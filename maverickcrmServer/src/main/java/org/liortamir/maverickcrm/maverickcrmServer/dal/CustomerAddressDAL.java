package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.CustomerAddress;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class CustomerAddressDAL {

	private static final CustomerAddressDAL instance = new CustomerAddressDAL();
	
	private CustomerAddressDAL() {}
	
	public static CustomerAddressDAL getInstance() {
		return instance;
	}
	
	public CustomerAddress get(int customerId, int addressId)throws SQLException {
		CustomerAddress customerAddress = null;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from customeraddress where customerId=? and addressId=?");
			ps.setInt(1, customerId);
			ps.setInt(2, addressId);
			ResultSet rs = ps.executeQuery();

			while(rs.next())
				customerAddress = mapFields(rs);
		}
		return customerAddress;
	}
	
	public List<CustomerAddress> getByCustomer(int customerId)throws SQLException {
		List<CustomerAddress> customerAddressList = null;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from customeraddress where customerId=?");
			ps.setInt(1, customerId);
			ResultSet rs = ps.executeQuery();
			customerAddressList = new ArrayList<>(5);
			while(rs.next())
				customerAddressList.add(mapFields(rs));
		}
		return customerAddressList;
	}
	
	public void insert(int customerId, int addressId) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into customeraddress values (?,?)");
			ps.setInt(1, customerId);
			ps.setInt(2, addressId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("error inserting into customeraddress");
		}
	}
	
	public void delete(int customerId, int addressId)throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("delete from customeraddress address where customerId=? and addressId=?");
			ps.setInt(1, customerId);
			ps.setInt(2, addressId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("error deleting from customeraddress");
		}
	}
	
	private CustomerAddress mapFields(ResultSet rs)throws SQLException {
		CustomerAddress customerAddress = null;

		customerAddress = new CustomerAddress(
				CustomerDAL.getInstance().get(rs.getInt("customerId")),
				AddressDAL.getInstance().get(rs.getInt("addressId")));

		return customerAddress;
	}
}
