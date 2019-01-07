package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Status;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class BusinessDAL {

	private static final BusinessDAL instance = new BusinessDAL();
	
	private BusinessDAL() {}
	
	public static BusinessDAL getInstance() {
		return instance;
	}
	
	public int get(int taskId) throws SQLException {
		int entity = 0;

		try (Connection conn = DBHandler.getConnection()){
			
			PreparedStatement stmt = conn.prepareStatement("select sum(effort) from task where effortUnit = 2 and taskId = ? or effortUnit = 2 and taskId in(select taskId from taskrelation where parentTaskId = 1)"
					+ " union select sum(effort)*9 from task where effortUnit = 1 and taskId = ? or effortUnit = 1 and taskId in(select taskId from taskrelation where parentTaskId = 1");
			stmt.setInt(1, taskId);
			ResultSet rs = stmt.executeQuery();
			while(rs.next())
				entity = rs.getInt(0);
		}
		return entity;
	}
	
	public List<Status> getAll() throws SQLException {
		List<Status> entityList = null;

		try (Connection conn = DBHandler.getConnection()){
			
			PreparedStatement stmt = conn.prepareStatement("select * from status");
			ResultSet rs = stmt.executeQuery();
			entityList = new ArrayList<>(5);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	private Status mapFields(ResultSet rs) {
		Status status = null;
		try{
			status = new Status(rs.getInt("statusId"), rs.getString("statusName"));
		}catch(SQLException e) {
			return status;
		}
		return status;
	}
}
