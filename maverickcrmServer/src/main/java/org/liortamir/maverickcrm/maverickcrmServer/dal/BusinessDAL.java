package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Task;
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
			PreparedStatement ps = conn.prepareStatement("select sum(effort) from task where effortUnit = 3 and taskId = ? or effortUnit = 3 and taskId in(select taskId from taskrelation where parentTaskId = ?)"
				+ " union select sum(effort)/20 from task where effortUnit = 2 and taskId = ? or effortUnit = 2 and taskId in(select taskId from taskrelation where parentTaskId = ?");
			ps.setInt(1, taskId);
			ps.setInt(2, taskId);
			ps.setInt(3, taskId);
			ps.setInt(4, taskId);
			ps.setInt(5, taskId);
			ps.setInt(6, taskId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = rs.getInt(0);
		}
		return entity;
	}
	
	public int getHours(int taskId) throws SQLException {
		int entity = 0;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select sum(effort) from task where effortUnit = 1 and taskId in(select childtaskId from taskrelation where parentTaskId = ? and taskRelationTypeId=2)");
			ps.setInt(1, taskId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = rs.getInt(1);
		}
		return entity;
	}

	public int getDays(int taskId) throws SQLException {
		int entity = 0;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select sum(effort) from task where effortUnit = 2 and taskId in(select childtaskId from taskrelation where parentTaskId = ? and taskRelationTypeId=2)");
			ps.setInt(1, taskId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = rs.getInt(1);
		}
		return entity;
	}	

	public int getMonths(int taskId) throws SQLException {
		int entity = 0;

		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select sum(effort) from task where effortUnit = 3 and taskId in(select childtaskId from taskrelation where parentTaskId = ? and taskRelationTypeId=2)");
			ps.setInt(1, taskId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = rs.getInt(1);
		}
		return entity;
	}	

	public List<Task> getTimelineProjects(int loginId) throws SQLException {
		List<Task> bulk = TaskDAL.getInstance().getAll(0, "", "", 0, 1, 0, loginId);

		return bulk;
	}	

	public List<Task> getTimelineTask(int taskId) throws SQLException {
		List<Task> bulk = TaskDAL.getInstance().getProcessChildren(taskId);

		return bulk;
	}
}
