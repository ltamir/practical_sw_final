package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.infra.APIConst;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskRelation;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class TaskRelationDAL {
	
	private static final TaskRelationDAL instance = new TaskRelationDAL();
	
	private TaskRelationDAL() {}
	
	public static TaskRelationDAL getInstance() {
		return instance;
	}
	
	public TaskRelation get(int taskRelationId) throws SQLException {
		TaskRelation entity = null;

		try (Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from taskRelation where taskRelationId=?");
			ps.setInt(1, taskRelationId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public List<TaskRelation> getParents(int parentTaskId) throws SQLException{
		List<TaskRelation> taskRelationList = null;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskRelation where childTaskId=?");
			ps.setInt(1, parentTaskId);
			ResultSet rs = ps.executeQuery();
			taskRelationList = new ArrayList<>(7);
			while(rs.next()) 
				taskRelationList.add(mapFields(rs));
		}
		return taskRelationList;
	}
	
	public List<TaskRelation> getChildren(int parentTaskId) throws SQLException{
		List<TaskRelation> taskRelationList = null;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from taskRelation where parentTaskId=?");
			ps.setInt(1, parentTaskId);
			ResultSet rs = ps.executeQuery();
			taskRelationList = new ArrayList<>(7);
			while(rs.next()) 
				taskRelationList.add(mapFields(rs));
		}
		return taskRelationList;
	}
	
	public int insert(int parentTaskId, int childTaskId, int relationTypeId) throws SQLException {
		int identity = 0;
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into taskRelation values(default,?,?,?)", Statement.RETURN_GENERATED_KEYS);
			ps.setInt(1, parentTaskId);
			ps.setInt(2, childTaskId);
			ps.setInt(3, relationTypeId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert taskRelation", "row not inserted");
				
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);
		}
		return identity;
	}
	
	public void update(int taskRelationId, int parentTaskId, int childTaskId, int relationTypeId) throws SQLException {
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update taskRelation set parentTaskId=?, childTaskId=?, taskRelationTypeId = ? where taskRelationId=?");
			ps.setInt(1, parentTaskId);
			ps.setInt(2, childTaskId);
			ps.setInt(3, relationTypeId);
			ps.setInt(4, taskRelationId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing update taskRelation", "row not updated");
		}
	}
	
	public void update(int taskRelationId, int relationTypeId) throws SQLException {
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update taskRelation set taskRelationTypeId = ? where taskRelationId=?");
			ps.setInt(1, relationTypeId);
			ps.setInt(2, taskRelationId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing update taskRelation", "row not updated");
		}
	}	
	
	public void delete(int taskRelationId) throws SQLException {
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("delete from taskRelation where taskRelationId=?");
			ps.setInt(1, taskRelationId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing delete taskRelation", "row not deleted");
		}
	}
	
	private TaskRelation mapFields(ResultSet rs) throws SQLException{
		TaskRelation taskrelation = null;
		taskrelation = new TaskRelation(rs.getInt(APIConst.FLD_TASKRELATION_ID), 
				TaskDAL.getInstance().get(rs.getInt(APIConst.FLD_TASKRELATION_PARENT_TASK_ID)),
				TaskDAL.getInstance().get(rs.getInt(APIConst.FLD_TASKRELATION_CHILD_TASK_ID)),
				TaskRelationTypeDAL.getInstance().get(rs.getInt(APIConst.FLD_TASKRELATION_TASKRELATIONTYPE_ID)));

		return taskrelation;
	}
}
