package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.TaskType;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class TaskTypeDAL {

	private static final TaskTypeDAL instance = new TaskTypeDAL();
	
	private TaskTypeDAL() {}
	
	public static TaskTypeDAL getInstance() {
		return instance;
	}
	
	public TaskType get(int taskTypeId) throws SQLException {
		TaskType entity = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskType where taskTypeId=?");
			ps.setInt(1, taskTypeId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<TaskType> getAll() throws SQLException {
		List<TaskType> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskType");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	private TaskType mapFields(ResultSet rs)throws SQLException {
		TaskType taskType = null;
		taskType = new TaskType(rs.getInt("taskTypeId"), rs.getString("taskTypeName"));

		return taskType;
	}
}
