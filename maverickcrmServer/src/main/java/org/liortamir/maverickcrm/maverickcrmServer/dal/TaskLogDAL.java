package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskLog;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class TaskLogDAL {

	private static TaskLogDAL instance = new TaskLogDAL();
	
	private TaskLogDAL() {}
	
	public static TaskLogDAL getInstance() {
		return instance;
	}

	public TaskLog get(int taskLogId) throws SQLException {
		TaskLog entity = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from tasklog where taskLogId=?");
			ps.setInt(1, taskLogId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<TaskLog> getByTask(int taskId) throws SQLException {
		List<TaskLog> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from tasklog where taskId=? order by sysdate");
			ps.setInt(1, taskId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	public int insert(String sysdate, int taskId, int ContactId, String description, int taskLogTypeId) throws SQLException{
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into taskLog values (default,?,?,?,?,?)", Statement.RETURN_GENERATED_KEYS);
			ps.setTimestamp(1, java.sql.Timestamp.valueOf(sysdate));
			ps.setInt(2, taskId);
			ps.setInt(3, ContactId);
			ps.setString(4, description);
			ps.setInt(5, taskLogTypeId);

			if(ps.executeUpdate() != 1)
				throw new SQLException("Error inseting record to taskLog");
			
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);
		}
		return identity;
	}
	
	public void update(int taskLogId, int taskId, int ContactId, String description, int taskLogTypeId) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update tasklog set taskId = ?, contactId = ?, description = ?, taskLogTypeId = ? where taskLogId = ? ");
			ps.setInt(1, taskId);
			ps.setInt(2, ContactId);
			ps.setString(3, description);
			ps.setInt(4, taskLogTypeId);
			ps.setInt(5, taskLogId);
			
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error inseting record to taskLog");
		}
	}
	
	public void update(int taskLogId, String description, int contactId) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update tasklog set description = ?, contactId=? where taskLogId = ? ");
			ps.setString(1, description);
			ps.setInt(2, contactId);
			ps.setInt(3, taskLogId);
			
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error inseting record to taskLog");
		}
	}	
	
	public void delete (int taskLogId) throws SQLException{
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("delete from tasklog where taskLogId=?");
			ps.setInt(1, taskLogId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error deleting from taskLog");		
		}
	}	
	
	private TaskLog mapFields(ResultSet rs) throws SQLException{
		TaskLog taskLog = null;
	
		taskLog = new TaskLog(rs.getInt(APIConst.FLD_TASKLOG_ID), 
				rs.getTimestamp(APIConst.FLD_TASKLOG_SYSDATE), 
				TaskDAL.getInstance().get(rs.getInt(APIConst.FLD_TASKLOG_TASK_ID)), 
				ContactDAL.getInstance().get(rs.getInt(APIConst.FLD_TASKLOG_CONTACT_ID)), 
				rs.getString(APIConst.FLD_TASKLOG_DESCRIPTION), 
				TaskLogTypeDAL.getInstance().get(rs.getInt(APIConst.FLD_TASKLOG_TASKLOGTYPE_ID)));
	
		return taskLog;
	}
}
