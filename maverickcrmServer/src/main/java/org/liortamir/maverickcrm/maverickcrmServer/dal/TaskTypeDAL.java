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
	private List<TaskType> cacheList = null;
	
	private TaskTypeDAL() {
		loadCache();
	}
	
	public void loadCache(){
		try{
			this.cacheList = get();
		}catch(SQLException e){
			System.out.println("Error loading TaskTypeDAL chache: " + e.toString());
		}
	}
	
	public static TaskTypeDAL getInstance() {
		return instance;
	}
	
	public TaskType get(int taskTypeId) throws SQLException {
		TaskType entity = this.cacheList.get(taskTypeId-1);
		if(entity != null) return entity;

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
		return this.cacheList;
	}
	
	public List<TaskType> get() throws SQLException {
		List<TaskType> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskType order by taskTypeId");
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
