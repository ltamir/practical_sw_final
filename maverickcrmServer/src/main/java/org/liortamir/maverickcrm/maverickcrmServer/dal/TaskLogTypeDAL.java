package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.liortamir.maverickcrm.maverickcrmServer.model.TaskLogType;

public class TaskLogTypeDAL extends AbstractDAL<TaskLogType>{

	private static TaskLogTypeDAL instance = new TaskLogTypeDAL();
	
	private TaskLogTypeDAL() {}
	
	public static TaskLogTypeDAL getInstance() {
		return instance;
	}
	
	@Override
	protected PreparedStatement getImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from taskLogType where taskLogTypeId=?");
	}
	
	@Override
	protected PreparedStatement getAllImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from taskLogType order by taskLogTypeId");
	}
	
	
	@Override
	protected TaskLogType mapFields(ResultSet rs) throws SQLException {
		TaskLogType taskLogType = null;
		taskLogType = new TaskLogType(rs.getInt("taskLogTypeId"), rs.getString("taskLogTypeName"));
		
		return taskLogType;
	}
}
