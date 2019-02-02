package org.liortamir.maverickcrm.maverickcrmServer.dal.predicate;

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
	
	public <T> void prepare(String predicateName, T value, MutableBool whereUsed, StringBuilder sb) {
		AbstractPredicate<T> p = this.predicateMap.get(predicateName);
		p.prepare(value, whereUsed, sb);
	}
	
	public <T> void set(String predicateName, PreparedStatement ps, MutableInt paramPosition, T value) throws SQLException{
		AbstractPredicate<T> p = this.predicateMap.get(predicateName);
		p.set(ps, paramPosition, value);
	}	
}
