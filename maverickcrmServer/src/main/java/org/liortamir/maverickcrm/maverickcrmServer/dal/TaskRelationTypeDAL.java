package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.liortamir.maverickcrm.maverickcrmServer.model.TaskRelationType;

public class TaskRelationTypeDAL extends AbstractDAL<TaskRelationType>{
	private static TaskRelationTypeDAL instance = new TaskRelationTypeDAL();
	
	private TaskRelationTypeDAL() {
		loadCache();
	}
	
	public static TaskRelationTypeDAL getInstance() {
		return instance;
	}
	
	@Override
	protected PreparedStatement getImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from taskRelationType where taskRelationTypeId=?");
	}
	
	@Override
	protected PreparedStatement getAllImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from taskRelationType order by taskRelationTypeId");
	}
	
	@Override
	protected TaskRelationType mapFields(ResultSet rs) throws SQLException {
		TaskRelationType taskRelationType = null;
		taskRelationType = new TaskRelationType(rs.getInt("taskRelationTypeId"), rs.getString("taskRelationTypeName"));
		
		return taskRelationType;
	}
}
