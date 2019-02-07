package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.dal.predicate.DatePredicate;
import org.liortamir.maverickcrm.maverickcrmServer.dal.predicate.IntPredicate;
import org.liortamir.maverickcrm.maverickcrmServer.dal.predicate.MutableBool;
import org.liortamir.maverickcrm.maverickcrmServer.dal.predicate.MutableInt;
import org.liortamir.maverickcrm.maverickcrmServer.dal.predicate.PredicateContainer;
import org.liortamir.maverickcrm.maverickcrmServer.dal.predicate.StringPredicate;
import org.liortamir.maverickcrm.maverickcrmServer.dal.predicate.TaskStatusPredicate;
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
	private PredicateContainer predicate = new PredicateContainer();
	
	public static TaskDAL getInstance() {
		return instance;
	}
	
	private TaskDAL() {
		// customer, duedate, status, title, project, taskType
		predicate.add("customer", new IntPredicate(0, 
				" taskId in (select taskId from customerTask where customerId=?) or taskId in(select childTaskId from taskRelation where parentTaskId in(select taskId from customerTask where customerId=?)) or taskId in(select childTaskId from taskRelation where parentTaskId in(select childTaskId from taskRelation where parentTaskId in(select taskId from customerTask where customerId=?)))",
				3));
		predicate.add("duedate", new DatePredicate(new java.sql.Date(1), 
				" dueDate <= ? ",
				1));
		predicate.add("status", new TaskStatusPredicate(0, 
				" statusId=? ",
				1));
		predicate.add("title", new StringPredicate("", 
				" title like ?",
				1));
		predicate.add("project", new IntPredicate(0, 
				" ( taskId = ? or taskId in(select childTaskId from taskRelation where parentTaskId=?) or taskId in(select childTaskId from taskRelation where parentTaskId in (select childTaskId from taskRelation where parentTaskId=?)))",
				3));
		predicate.add("taskType", new IntPredicate(0, 
				" taskTypeId=? ",
				1));	
	}
	
	/**
	 * Get task by taskId
	 * @param taskId
	 * @return
	 * @throws SQLException
	 */
	public Task get(int taskId) throws SQLException {
		Task entity = null;
		final String authentication = " permissiontypeid from taskpermission where (taskId in(select parenttaskId from taskrelation where childtaskId = ?) and loginId =?) or (taskId in (select parentTaskId from taskrelation where childtaskid in(select parentTaskId from taskrelation where  childtaskId = ?) )  and loginId = ? )";
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
	public List<Task> getAll(int customerId, String dueDate, String title, int projectTaskId, int taskTypeId, int status, int loginId) throws SQLException {
		List<Task> entityList = null;
		MutableInt paramCount = new MutableInt(0);
		MutableBool whereUsed = new MutableBool(false);
		final String baseSQL = "select * from task ";
		final String orderBy = " order by duedate asc, statusId asc";
		final String authentication = " (taskId in (select taskId from taskPermission where loginId=?) or   taskid in (select childtaskId from taskrelation where parentTaskId in(select taskId from taskPermission where loginId = ?)) or "
				+ " taskId in (select childTaskId from taskrelation where parentTaskId in(select childTaskId from taskrelation where parentTaskId in (select taskId from taskPermission where loginId = ?)))) ";
		StringBuilder sqlStatement = new StringBuilder(baseSQL);

		
		Date dateDueDate = null;
		if(dueDate.equals(""))
			dateDueDate = new java.sql.Date(1);
		else
			dateDueDate = java.sql.Date.valueOf(dueDate);
		this.predicate.prepare("customer", customerId, whereUsed, sqlStatement);
		this.predicate.prepare("duedate", dateDueDate, whereUsed, sqlStatement);
		this.predicate.prepare("title", title, whereUsed, sqlStatement);
		this.predicate.prepare("project", projectTaskId, whereUsed, sqlStatement);
		this.predicate.prepare("taskType", taskTypeId, whereUsed, sqlStatement);
		this.predicate.prepare("status", status, whereUsed, sqlStatement);
		
		if(!whereUsed.get())
			sqlStatement.append(" where ");
		else
			sqlStatement.append(" and ");
		sqlStatement.append(authentication);
		sqlStatement.append(orderBy);

		try (Connection conn = DBHandler.getConnection()){

			PreparedStatement ps = conn.prepareStatement(sqlStatement.toString());

			this.predicate.set("customer", ps, paramCount, customerId);
			this.predicate.set("duedate", ps, paramCount, dateDueDate);
			this.predicate.set("title", ps, paramCount, title);
			this.predicate.set("project", ps, paramCount, projectTaskId);
			this.predicate.set("taskType", ps, paramCount, taskTypeId);
			this.predicate.set("status", ps, paramCount, status);
			
			ps.setInt(paramCount.get() + 1, loginId);
			ps.setInt(paramCount.get() + 2, loginId);
			ps.setInt(paramCount.get() + 3, loginId);
			
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
