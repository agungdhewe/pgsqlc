import pgp from 'pg-promise';


export function createWhereClause(criteria, searchMap) {
    try {

		const queryParams = {}
		const whereClause = []
		for (var searchkey in criteria) {
			if (searchMap[searchkey]==null) {
				throw new Error(`${searchkey} is not defined in searchMap`)
			}

			var searchvalue = criteria[searchkey]
			if (Array.isArray(searchvalue)) {
				const values = {};
				const parts = searchvalue.map((val, idx) => {
					const paramName = `${searchkey}_${idx}`;
					values[paramName] = val;
					// return pgp.as.format(searchMap.searchtext, { searchtext: `\${${paramName}}` });
					return pgp.as.format(searchMap.searchtext, { searchtext: val });
				});
				
				Object.assign(queryParams, values)
				whereClause.push('(' + parts.join(') OR (') + ')')
			} else if (typeof searchvalue === "string") {
				queryParams[searchkey] = searchvalue
				whereClause.push(searchMap[searchkey])
			} else if (typeof searchvalue==='number' || typeof searchvalue==='boolean') {
				queryParams[searchkey] = String(searchvalue)
				whereClause.push(searchMap[searchkey])
			} else {
				throw new Error(`type error in criteria, '${searchkey}' have to be string, number, boolean or array`)
			}
		}	

		return { whereClause, queryParams }
    } catch (err) {
        throw err
    }
}


export function createSqlSelect(param) {
	const { tablename, columns=[], whereClause = '', sort={}, limit=0, offset=0 } = param

	try {

		let coldef = '*'
		if (columns.length>0) {
			coldef = columns.join(', ')
		}
		
		let sql = `select ${coldef} from ${tablename}`
		if (whereClause.length>0) {
			sql += ' where (' + whereClause.join(') AND (') + ')'
		}

		// sort column
		if (Object.keys(sort).length > 0) {
			const sortClause = []
			for (var sortkey in sort) {
				sortClause.push(`${sortkey} ${sort[sortkey]}`)
			}
			sql += ' order by ' + sortClause.join(', ')
		}

		// limit rows to retrieve
		if (limit>0) {
			queryParams.limit = limit
			sql += ' limit ${limit} '
		}

		// starting row to retrieve
		if (offset>0) {
			queryParams.offset = offset
			sql += ' offset ${offset} '
		}

		return sql
	} catch (err) {
		throw err
	}
}