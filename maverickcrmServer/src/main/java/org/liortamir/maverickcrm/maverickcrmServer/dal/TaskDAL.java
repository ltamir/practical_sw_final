package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Contact;
import org.liortamir.maverickcrm.maverickcrmServer.model.Status;
import org.liortamir.maverickcrm.maverickcrmServer.model.Task;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskType;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

/**
 * This class manages the database access to for task table
 * 
 * @author liort
 *
 */
public class TaskDAL {

	
	private static TaskDAL instance = new TaskDAL();
	
	public static TaskDAL getInstance() {
		return instance;
	}
	
	private TaskDAL() {}
	
	/**
	 * Get task by taskId
	 * @param taskId
	 * @return
	 * @throws SQLException
	 */
	public Task get(int taskId) throws SQLException {
		Task entity = null;
		try (Connection conn = DBHandler.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("select * from task where taskId=?");
			ps.setInt(1, taskId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	/**
	 * get all tasks
	 * @return List<Task>
	 * @throws SQLException
	 */
	public List<Task> getAll() throws SQLException {
		List<Task> entityList = null;
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from task");
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(14);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	/**
	 * 
	 * @param customerId
	 * @param dueDate
	 * @param projectId
	 * @param taskTypeId
	 * @param isOpen
	 * @return
	 * @throws SQLException
	 */
	public List<Task> getAll(int customerId, String dueDate, int projectTaskId, int taskTypeId, boolean isOpen) throws SQLException {
		List<Task> entityList = null;
		int closedTask = 0;
		final String baseSQL = "select * from task where statusId=? and dueDate = ? and taskTypeId=?";
		final String customerPredicate = "taskId in (select taskId from customerTask where customerId=?) or taskId in(select childTaskId from taskRelation where parentTaskId in(select taskId from customerTask where customerId=?))";
		final String projectPredicate = "taskId in (select taskId from customerTask where taskId=?) or taskId in(select childTaskId from taskRelation where parentTaskId in(select taskId from customerTask where taskId=?))";

		try (Connection conn = DBHandler.getConnection()){
			if(!isOpen)
				closedTask = 4;
			PreparedStatement ps = conn.prepareStatement(baseSQL + " and " + customerPredicate + " and " + projectPredicate);
			
			ps.setInt(1, closedTask);
			ps.setDate(2, java.sql.Date.valueOf(dueDate));
			ps.setInt(3, taskTypeId);
			ps.setInt(4, customerId);
			ps.setInt(5, customerId);
			ps.setInt(6, projectTaskId);
			ps.setInt(7, projectTaskId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(14);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}
	
	/**
	 * Get Tasks connected to a customer directly or by parent task
	 * @param customerId
	 * @return
	 * @throws SQLException
	 */
	public List<Task> getAllByCustomer(int customerId, boolean isOpen) throws SQLException {
		List<Task> entityList = null;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from task where taskId in(select taskId from customerTask where customerId = ?) or taskId in (select childTaskId from taskRelation where parentTaskId in(select taskId from customerTask where customerId = ?))");
			ps.setInt(1, customerId);
			ps.setInt(2, customerId);
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(14);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	/**
	 * Get all tasks with the given due date
	 * @param dueDate
	 * @return
	 * @throws SQLException
	 */
	public List<Task> getAllByDate(String dueDate) throws SQLException {
		List<Task> entityList = null;
		try(Connection conn = DBHandler.getConnection()) {

			PreparedStatement ps = conn.prepareStatement("select * from task where duedate=?");
			ps.setDate(1,java.sql.Date.valueOf(dueDate));
			ResultSet rs = ps.executeQuery();
			entityList = new ArrayList<>(14);
			while(rs.next())
				entityList.add(mapFields(rs));
		}
		return entityList;
	}	
	
	/**
	 * insert a new task
	 * @param taskTypeId
	 * @param contactId
	 * @param title
	 * @param effort
	 * @param effortUnit
	 * @param dueDate
	 * @param statusId
	 * @return
	 * @throws SQLException
	 */
	public int insert(int taskTypeId, int contactId, String title, int effort, int effortUnit, String dueDate, int statusId) throws SQLException{
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into task values(default,?,?,?,?,?,?,?)", Statement.RETURN_GENERATED_KEYS);
			ps.setInt(1, taskTypeId);
			ps.setInt(2, contactId);
			ps.setString(3, title);
			ps.setInt(4, effort);
			ps.setInt(5, effortUnit);
			ps.setDate(6,java.sql.Date.valueOf(dueDate));
			ps.setInt(7, statusId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert task");
				
			ResultSet rs = ps.getGeneratedKeys();
			if(rs != null && rs.next())
				identity = rs.getInt(1);
		}
		return identity;
	}
	
	/**
	 * update existing task
	 * @param taskId
	 * @param taskTypeId
	 * @param contactId
	 * @param title
	 * @param effort
	 * @param effortUnit
	 * @param dueDate
	 * @param statusId
	 * @return
	 * @throws SQLException
	 */
	public void update(int taskId, int taskTypeId, int contactId, String title, int effort, int effortUnit, String dueDate, int statusId) throws SQLException {
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update task set taskTypeId=?, contactId=?, title=?, effort=?, effortUnit=?, dueDate=?, statusId=? where taskId=?");
			
			ps.setInt(1, taskTypeId);
			ps.setInt(2, contactId);
			ps.setString(3, title);
			ps.setInt(4, effort);
			ps.setInt(5, effortUnit);
			ps.setDate(6,java.sql.Date.valueOf(dueDate));
			ps.setInt(7, statusId);
			ps.setInt(8, taskId);
			
			if(ps.executeUpdate() != 1)
				throw new SQLException("Error performing insert task");
		}
	}
	
	/**
	 * Retrieve parent tasks for given task
	 * @param taskId
	 * @return
	 * @throws SQLException
	 */
	public List<Task> getParents(int taskId) throws SQLException{
		List<Task> taskList = null;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from task where taskId in(select parentTaskId from taskRelation where childTaskId=?)");
			ps.setInt(1, taskId);
			ResultSet rs = ps.executeQuery();
			taskList = new ArrayList<>(7);
			while(rs.next()) 
				taskList.add(mapFields(rs));
		}
		return taskList;
	}
	
	/**
	 * retrieve child tasks for given task
	 * @param taskId
	 * @return
	 * @throws SQLException
	 */
	public List<Task> getChildren(int taskId) throws SQLException{
		List<Task> taskList = null;
		
		try (Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from task where taskId in(select childTaskId from taskRelation where parentTaskId=?)");
			ps.setInt(1, taskId);
			ResultSet rs = ps.executeQuery();
			taskList = new ArrayList<>(7);
			while(rs.next()) 
				taskList.add(mapFields(rs));
		}
		return taskList;
	}
	
	/**
	 * Field mapper between result set and a Task POJO 
	 * @param rs
	 * @return
	 */
	private Task mapFields(ResultSet rs) throws SQLException {
		Task task = null;
		TaskType taskType = TaskTypeDAL.getInstance().get(rs.getInt("taskTypeId"));
		Contact contact = ContactDAL.getInstance().get(rs.getInt("contactId"));
		Status status = StatusDAL.getInstance().get(rs.getInt("statusId"));
		task = new Task(rs.getInt("taskId"), taskType, contact, rs.getString("title"), rs.getInt("effort"), rs.getInt("effortUnit"), rs.getDate("dueDate").toLocalDate(), status);			

		return task;
	}
}
