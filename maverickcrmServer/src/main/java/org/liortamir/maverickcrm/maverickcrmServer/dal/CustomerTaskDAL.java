package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.CustomerTask;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class CustomerTaskDAL {

	private static CustomerTaskDAL instance = new CustomerTaskDAL();
	
	public static CustomerTaskDAL getInstance() {
		return instance;
	}
	
	private CustomerTaskDAL() {}
	
	public CustomerTask get(int customerTaskId) throws SQLException {
		CustomerTask entity = null;
		
		try (Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from customerTask where customerTaskId=?");
			ps.setInt(1, customerTaskId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<CustomerTask> getByCustomer(int customerId) throws SQLException {
		List<CustomerTask> entityList = null;
		
		try (Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from customerTask where customerId=?");
			ps.setInt(1, customerId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public List<CustomerTask> getByTask(int taskId) throws SQLException {
		List<CustomerTask> entityList = null;
		
		try (Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from customerTask where taskId=?");
			ps.setInt(1, taskId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	public List<CustomerTask> getAll(boolean isOpen) throws SQLException {
		List<CustomerTask> entityList = null;
		PreparedStatement ps = null;
		String sqlAll = "select * from customerTask";
		String sqlAllOpen = "select * from customerTask inner join task on task.taskId = customerTask.TaskId where task.statusId!=4";
		try (Connection conn = DBHandler.getConnection()) {
			if(isOpen)
				ps = conn.prepareStatement(sqlAllOpen);
			else
				ps = conn.prepareStatement(sqlAll);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	public int insert(int customerId, int taskId) throws SQLException {
		int identity = 0;
		try (Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("insert into customerTask values(default, ?, ?)", Statement.RETURN_GENERATED_KEYS);
			ps.setInt(1, customerId);
			ps.setInt(2, taskId);

			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert customerTask");
				
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);
		}
		return identity;
	}
	
	public void delete(int customerTaskId) throws SQLException {
		try (Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("delete from customerTask where customerTaskId = ?");
			ps.setInt(1, customerTaskId);

			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing delete customerTask");

		}
	}	
	
	private CustomerTask mapFields(ResultSet rs) throws SQLException{
		CustomerTask customerTask = null;
		try{
			customerTask = new CustomerTask(rs.getInt("customerTaskId"), CustomerDAL.getInstance().get(rs.getInt("customerId")), TaskDAL.getInstance().get(rs.getInt("customerId")));
		}catch(SQLException e) {
			return customerTask;
		}
		return customerTask;
	}
}
