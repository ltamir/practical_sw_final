package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.liortamir.maverickcrm.maverickcrmServer.model.TaskType;

public class TaskTypeDAL extends AbstractDAL<TaskType>{

	private static final TaskTypeDAL instance = new TaskTypeDAL();

	private TaskTypeDAL() {}	
	
	public static TaskTypeDAL getInstance() {
		return instance;
	}
	
	@Override
	protected PreparedStatement getImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from taskType where taskTypeId=?");
	}
	
	@Override
	protected PreparedStatement getAllImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from taskType order by taskTypeId");
	}
	
	@Override
	protected TaskType mapFields(ResultSet rs)throws SQLException {
		TaskType taskType = null;
		taskType = new TaskType(rs.getInt("taskTypeId"), rs.getString("taskTypeName"));

		return taskType;
	}
}
