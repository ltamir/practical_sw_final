package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public abstract class AbstractDAL <T>{
	
	public T get(int customerContactsId) throws SQLException {
		T entity = null;
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = getImpl(conn);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	protected abstract PreparedStatement getImpl(Connection conn);
	
		
	public int insert(T t) throws SQLException {
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = insertImpl(conn);
			if(ps.executeUpdate() != 1)
				throw new SQLException("error insert customercontact");
			
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);
		}
		return identity;
	}
	protected abstract PreparedStatement insertImpl(Connection conn);
	
	
	public void update(T model) throws SQLException {

		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = updateImpl(conn);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert task");
		}
	}
	protected abstract PreparedStatement updateImpl(Connection conn);
	
	public void delete(int customerContactId) throws SQLException {
		try(Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = deleteImpl(conn);

			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert task");
		}
	}
	protected abstract PreparedStatement deleteImpl(Connection conn);
			
	
	protected abstract T mapFields(ResultSet rs) throws SQLException;
}