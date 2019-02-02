package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public class StringPredicate extends AbstractPredicate<String>{

	public StringPredicate(String all, String predicate, int paramIndex) {
		super(all, predicate, paramIndex);
	}

	@Override
	public void setParam(PreparedStatement ps, int pos, String value) throws SQLException {
			ps.setString(pos, value);
	}

}
