package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.TaskLogType;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class TaskLogTypeDAL {

	private static TaskLogTypeDAL instance = new TaskLogTypeDAL();
	
	private TaskLogTypeDAL() {}
	
	public static TaskLogTypeDAL getInstance() {
		return instance;
	}
	
	public TaskLogType get(int taskLogTypeId) throws SQLException {
		TaskLogType entity = null;		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskLogType where taskLogTypeId=?");
			ps.setInt(1, taskLogTypeId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<TaskLogType> getAll() throws SQLException {
		List<TaskLogType> entityList = null;
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskLogType");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	private TaskLogType mapFields(ResultSet rs) throws SQLException {
		TaskLogType taskLogType = null;
		taskLogType = new TaskLogType(rs.getInt("taskLogTypeId"), rs.getString("taskLogTypeName"));
		
		return taskLogType;
	}
}
