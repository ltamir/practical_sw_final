package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.liortamir.maverickcrm.maverickcrmServer.model.Login;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class LoginDAL {
	private static LoginDAL instance = new LoginDAL();
	private Map<Integer, Login> cacheList = new HashMap<>();
	protected String classLogName = this.getClass().getName();
	private static SimpleDateFormat dateFormat=  new SimpleDateFormat();
	
	static {
		dateFormat.applyPattern("yyyy-MM-dd HH:mm:ss");
	}
	
	private LoginDAL(){
		loadCache();
	}
	
	public static LoginDAL getInstance() {
		return instance;
	}
	
	private synchronized void loadCache() {
		
		try{
			List<Login> loginList = getAll();
			loginList.stream().forEach(l -> this.cacheList.put(l.getLoginId(), l));
		}catch(SQLException e){
			String sysdate = dateFormat.format(new Date());
			System.out.println(sysdate + " "+ classLogName + " Error loading cache: " + e.toString());
		}		
	}
	
	public Login get(int loginId) throws SQLException {
		Login entity = this.cacheList.get(loginId);
		if(entity != null) return entity;

		try( Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from login where loginId=?");
			ps.setInt(1, loginId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}
	
	public Login get(String username) throws SQLException {
		Login entity = null;

		try( Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select loginId from login where username=?");
			ps.setString(1, username);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = get(rs.getInt("loginId"));
		}
		return entity;
	}
	
	public Login getByContact(int contactId) throws SQLException {
		Login entity = null;

		try( Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from login where contactId=?");
			ps.setInt(1, contactId);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				entity = mapFields(rs);
		}
		return entity;
	}		
	
	public List<Login> getAll() throws SQLException{
		List<Login> loginList = null;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from login");
			ResultSet rs = ps.executeQuery();
			loginList = new ArrayList<>(10);
			while(rs.next())
				loginList.add(mapFields(rs));
		}
		return loginList;
	}
	
	public Login authenticate(String username, String password) throws SQLException{
		Login login = null;
		try(Connection conn= DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select loginId from login where username = ? and password = ?");
			ps.setString(1,  username);
			ps.setString(2, password);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				login = get(rs.getInt("loginId"));
		}
		return login;
	}
	
	public int insert(String username, String password, int contactId) throws SQLException {
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into login values(default, ?, ?, ?)");
			ps.setString(1, username);
			ps.setString(2, password);
			ps.setInt(3, contactId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("error in insert login");
		}
		return identity;
	}
	
	public void update(String username, int contactId, int loginId) throws SQLException {
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update login set username=?, contactId=? where loginId=?");
			ps.setString(1, username);
			ps.setInt(2, contactId);
			ps.setInt(3, loginId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("error in update login");
		}
		Login login = this.cacheList.get(loginId);
		login.setUsername(username);
		login.setContact(ContactDAL.getInstance().get(contactId));
	}
	
	public void updatePassword(String password,int loginId) throws SQLException {
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update login set password=? where loginId=?");
			ps.setString(1, password);
			ps.setInt(2, loginId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("error in update login password");
		}
		Login login = this.cacheList.get(loginId);
		login.setPassword(password);
	}
	
	private Login mapFields(ResultSet rs) throws SQLException{
		Login login = null;
		login = new Login(rs.getInt("loginId"), rs.getString("username"), rs.getString("password"),ContactDAL.getInstance().get(rs.getInt("contactId")));

		return login;
	}
}
