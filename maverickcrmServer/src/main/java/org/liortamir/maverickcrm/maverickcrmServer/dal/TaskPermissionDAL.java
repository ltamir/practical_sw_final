package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.TaskPermission;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class TaskPermissionDAL {

	private static final TaskPermissionDAL instance = new TaskPermissionDAL();
	
	private TaskPermissionDAL() {}
	
	public static TaskPermissionDAL getInstance() {
		return instance;
	}
	
	public TaskPermission get(int taskpermissionId) throws SQLException {
		TaskPermission entity = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskpermission where taskpermissionId=?");
			ps.setInt(1, taskpermissionId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<TaskPermission> getAll() throws SQLException {
		List<TaskPermission> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskpermission");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	public List<TaskPermission> getByTask(int taskId) throws SQLException {
		List<TaskPermission> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskpermission where taskId = ?");
			ps.setInt(1, taskId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	public int insert(int taskId, int loginId, int permissionTypeId) throws SQLException{
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into taskpermission values (default,?,?,?)", Statement.RETURN_GENERATED_KEYS);
			ps.setInt(1, taskId);
			ps.setInt(2, loginId);
			ps.setInt(3, permissionTypeId);

			if(ps.executeUpdate() != 1)
				throw new SQLException("Error inserting into taskpermission");
			
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);
		}
		return identity;
	}
	
	public void update(int taskPermissionId, int taskId, int loginId, int permissionTypeId) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update taskpermission set taskId = ?, loginId=?, permissionTypeId = ? where taskPermissionId = ? ");
			ps.setInt(1, taskId);
			ps.setInt(2, loginId);
			ps.setInt(3, permissionTypeId);
			ps.setInt(4, taskPermissionId);
			
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error updating table taskpermission");
		}
	}	
	
	public void delete (int taskPermissionId) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("delete from taskpermission where taskPermissionId=?");
			ps.setInt(1, taskPermissionId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error deleting from taskpermission");		
		}
	}		
	
	private TaskPermission mapFields(ResultSet rs)throws SQLException {
		TaskPermission taskpermission = null;
		taskpermission = new TaskPermission(rs.getInt("taskpermissionId"), TaskDAL.getInstance().get(rs.getInt("taskId")), LoginDAL.getInstance().get(rs.getInt("loginId")), PermissionTypeDAL.getInstance().get(rs.getInt("permissionTypeId")));

		return taskpermission;
	}
}
