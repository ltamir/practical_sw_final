package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public abstract class AbstractDAL <T>{
	
	private List<T> cacheList = null;
	protected String classLogName = this.getClass().getName();
	private static SimpleDateFormat dateFormat=  new SimpleDateFormat();
	
	static {
		dateFormat.applyPattern("yyyy-MM-dd HH:mm:ss");
	}
	
	protected AbstractDAL(){
		loadCache();
	}
	protected void loadCache(){
		try{
			this.cacheList = get();
		}catch(SQLException e){
			String sysdate = dateFormat.format(new Date());
			System.out.println(sysdate + " "+ classLogName + " Error loading cache: " + e.toString());
		}
	}
	
	public List<T> getAll() throws SQLException {
		return this.cacheList;
	}
	
	public T get(int id) throws SQLException {
		T entity = this.cacheList.get(id-1);
		if(entity != null) return entity;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = getImpl(conn);
			ps.setInt(1, id);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	protected List<T> get() throws SQLException {
		List<T> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = getAllImpl(conn);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	protected abstract PreparedStatement getImpl(Connection conn) throws SQLException;
	protected abstract PreparedStatement getAllImpl(Connection conn) throws SQLException;
		
//	public int insert(T t) throws SQLException {
//		int identity = 0;
//		try(Connection conn = DBHandler.getConnection()) {
//			PreparedStatement ps = insertImpl(conn);
//			if(ps.executeUpdate() != 1)
//				throw new SQLException("error insert customercontact");
//			
//			ResultSet rs = ps.getGeneratedKeys();
//			if(rs != null && rs.next())
//				identity = rs.getInt(1);
//		}
//		return identity;
//	}
//	protected abstract PreparedStatement insertImpl(Connection conn);
//	
//	
//	public void update(T model) throws SQLException {
//
//		try(Connection conn = DBHandler.getConnection()) {
//			PreparedStatement ps = updateImpl(conn);
//			if(ps.executeUpdate() != 1)
//				throw new SQLException("Error performing insert task");
//		}
//	}
//	protected abstract PreparedStatement updateImpl(Connection conn);
//	
//	public void delete(int customerContactId) throws SQLException {
//		try(Connection conn = DBHandler.getConnection()) {
//			PreparedStatement ps = deleteImpl(conn);
//
//			if(ps.executeUpdate() != 1)
//				throw new SQLException("Error performing insert task");
//		}
//	}
//	protected abstract PreparedStatement deleteImpl(Connection conn);
			
	
	protected abstract T mapFields(ResultSet rs) throws SQLException;
}