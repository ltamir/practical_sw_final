package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class PredicateContainer {

	private Map<String, AbstractPredicate> predicateMap = new HashMap<>();
//	private List<AbstractPredicate<? extends Object>> predicateList = new LinkedList<>();


	public <T> void add(String name, AbstractPredicate<T> predicate) {
		predicateMap.put(name, predicate);
	}
	
	public <T> int prepare(String predicateName, T value, int totalParams, StringBuilder sb) {
		AbstractPredicate<T> p = this.predicateMap.get(predicateName);
		return p.prepare(value, totalParams, sb);
	}
	
	public <T> int set(String predicateName, PreparedStatement ps, int paramPosition, T value) throws SQLException{
		AbstractPredicate<T> p = this.predicateMap.get(predicateName);
		return p.set(ps, paramPosition, value);
	}	
}
