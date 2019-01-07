package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.TaskRelationType;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class TaskRelationTypeDAL {
	private static TaskRelationTypeDAL instance = new TaskRelationTypeDAL();
	
	private TaskRelationTypeDAL() {}
	
	public static TaskRelationTypeDAL getInstance() {
		return instance;
	}

	public TaskRelationType get(int taskRelationTypeId) throws SQLException {
		TaskRelationType entity = null;
		try (Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from taskRelationType where taskRelationTypeId=?");
			ps.setInt(1, taskRelationTypeId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<TaskRelationType> getAll() throws SQLException {
		List<TaskRelationType> entityList = null;
		try (Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from taskRelationType");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(10);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	private TaskRelationType mapFields(ResultSet rs) throws SQLException {
		TaskRelationType taskType = null;
		taskType = new TaskRelationType(rs.getInt("taskRelationTypeId"), rs.getString("taskRelationTypeName"));
		
		return taskType;
	}
}
