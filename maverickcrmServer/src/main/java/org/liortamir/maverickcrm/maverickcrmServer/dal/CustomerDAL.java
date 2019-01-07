package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Customer;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class CustomerDAL {
	
	private static CustomerDAL instance = new CustomerDAL();
	
	public static CustomerDAL getInstance() {
		return instance;
	}
	
	private CustomerDAL() {}
	
	public Customer get(int customerId) throws SQLException {
		Customer entity = null;
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from customer where customerId=?");
			ps.setInt(1, customerId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<Customer> getAll() throws SQLException {
		List<Customer> entityList = null;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from customer");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(20);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public List<Customer> getByContact(int contactId) throws SQLException {
		List<Customer> entityList = null;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from customer where customerId in (select customerId from customercontact where contactId=?)");
			ps.setInt(1, contactId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(20);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public List<Customer> getNonLinkedToContact(int contactId) throws SQLException {
		List<Customer> entityList = null;

		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from customer where customerId not in(select customerId from customercontact where contactId=?)");
			ps.setInt(1, contactId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	public Customer getByTask(int TaskId) throws SQLException {
		Customer entity = null;

		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from customer where customerId in(select customerId from customerTask where taskId=?) or customerId in (select customerId from customerTask where taskId in (select parentTaskId from taskrelation where childTaskId=?))");
			ps.setInt(1, TaskId);
			ps.setInt(2, TaskId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<Customer> getNonLinkedToTask(int TaskId) throws SQLException {
		List<Customer> entityList = null;

		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from customer where customerId not in(select customerId from customerTask where taskId=?)");
			ps.setInt(1, TaskId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public int insert(String customerName, String customerNotes) throws SQLException{
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into customer values (default,?,?)", Statement.RETURN_GENERATED_KEYS);
			ps.setString(1, customerName);
			ps.setString(2, customerNotes);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert task");
				
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);		
		}
		return identity;
	}
	
	public void update(int customerId, String customerName, String customerNotes) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
		PreparedStatement ps = conn.prepareStatement("update customer set customerName = ?, customerNotes = ? where customerID = ? ");
		
		ps.setString(1, customerName);
		ps.setString(2, customerNotes);
		ps.setInt(3, customerId);
		if(ps.executeUpdate() != 1)
			throw new SQLException("Error performing update task");
		}
	}
	
	
	public void delete(int customerId) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
		PreparedStatement ps = conn.prepareStatement("delete from customer where customerID = ? ");

		ps.setInt(1, customerId);
		if(ps.executeUpdate() != 1)
			throw new SQLException("Error performing delete task");
		}
	}
	
	private Customer mapFields(ResultSet rs) throws SQLException {
		Customer customer = null;
	
		customer = new Customer(rs.getInt("customerId"), rs.getString("customerName"), rs.getString("customerNotes"));

		return customer;
	}
}
