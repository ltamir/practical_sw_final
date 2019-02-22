package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.liortamir.maverickcrm.maverickcrmServer.model.ContactType;

public class ContactTypeDAL extends AbstractDAL<ContactType>{

	private static ContactTypeDAL instance = new ContactTypeDAL();
	
	public static ContactTypeDAL getInstance() {
		return instance;
	}
	
	private ContactTypeDAL() {	}

	@Override
	protected PreparedStatement getImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from contactType where contactTypeId=?");
	}
	
	@Override
	protected PreparedStatement getAllImpl(Connection conn) throws SQLException{
		return conn.prepareStatement("select * from contactType order by contactTypeId");
	}
	
	@Override
	protected ContactType mapFields(ResultSet rs) throws SQLException {
		ContactType contactType = null;

		contactType = new ContactType(rs.getInt("contactTypeId"), rs.getString("contactTypeName"));
		return contactType;
	}
}
