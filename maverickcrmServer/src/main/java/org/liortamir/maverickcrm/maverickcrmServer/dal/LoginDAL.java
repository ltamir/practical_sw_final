package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.model.Login;
import org.liortamir.maverickcrm.maverickcrmServer.persistency.DBHandler;

public class LoginDAL {
	private static LoginDAL instance = new LoginDAL();
	
	private LoginDAL() {}
	
	public static LoginDAL getInstance() {
		return instance;
	}
	
	public Login get(int loginId) throws SQLException {
		Login entity = null;

		try( Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("select * from login where loginId=?");
			ps.setInt(1, loginId);
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
			PreparedStatement ps = conn.prepareStatement("select * from login where username = ? and password = ?");
			ps.setString(1,  username);
			ps.setString(2, password);
			ResultSet rs = ps.executeQuery();
			while(rs.next())
				login = mapFields(rs);
		}
		return login;
	}
	
	public int insert(String username, String password, int contactId) throws SQLException {
		int identity = 0;
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("insert into login values(default, ?, ?, ?");
			ps.setString(1, username);
			ps.setString(2, password);
			ps.setInt(3, contactId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("error in insert login");
		}
		return identity;
	}
	
	public void update(String username, String password, int contactId, int loginId) throws SQLException {
		try(Connection conn = DBHandler.getConnection()){
			PreparedStatement ps = conn.prepareStatement("update login set username=?, password=?, contactId=? where loginId=?");
			ps.setString(1, username);
			ps.setString(2, password);
			ps.setInt(3, contactId);
			ps.setInt(4, loginId);
			if(ps.executeUpdate() != 1)
				throw new SQLException("error in update login");
		}
	}
	
	private Login mapFields(ResultSet rs) throws SQLException{
		Login login = null;
		login = new Login(rs.getInt("loginId"), rs.getString("username"), rs.getString("password"),ContactDAL.getInstance().get(rs.getInt("contactId")));

		return login;
	}
}
