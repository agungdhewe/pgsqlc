import pgp from 'pg-promise'


export function createUpdateParameters(self, data, keys) {
	for (const key of keys) {
		if (!(key in data)) {
			throw new Error(`Missing required key field: ${key}`);
		}
	}

	const excludedFields = keys;
	const columns = Object.keys(data).filter(col => !excludedFields.includes(col));

	const values = [
		...columns.map(col => data[col]),
		...keys.map(key => data[key])
	];	

	return values
}


export function createUpdateSql(self, tablename, data, keys) {
	if (keys.length === 0) {
        throw new Error('Update command requires at least one key field');
    }

	const excludedFields = keys;
	const columns = Object.keys(data).filter(col => !excludedFields.includes(col));
    const setClauses = columns.map((col, i) => `"${col}" = $${i + 1}`);
    const whereClauses = keys.map((key, i) => `"${key}" = $${columns.length + i + 1}`);
    const sql = `UPDATE ${tablename} SET ${setClauses.join(', ')} WHERE ${whereClauses.join(' AND ')} RETURNING *`;

	return sql
}




export function createUpdateCommand(self, tablename, data, keys) {
	const cmd = {}
	const sql = createUpdateSql(self, tablename, data, keys)

	return {
		setTransaction(t) {
			cmd.tx = t
		},

        async execute(data) {
			const db = cmd.tx ?? self.db;
			const values = createUpdateParameters(self, data, keys)

			try {
				const result = await db.oneOrNone(sql, values);
				return result;
            } catch (err) {
                throw err;
            }			
		}
	}
}



export function createUpdateStatement(self, tablename, data, keys, name) {
const cmd = {}
	const sql = createUpdateSql(self, tablename, data, keys)

	const ps = new pgp.PreparedStatement({
		name: name ?? `update-${tablename}`,
		text: sql
	});	

	return {
		setTransaction(t) {
			cmd.tx = t
		},

        async execute(data) {
			const db = cmd.tx ?? self.db;
			const values = createUpdateParameters(self, data, keys)

			try {
				ps.values = values;

				const result = await db.oneOrNone(ps);
				return result;
            } catch (err) {
                throw err;
            }			
		}
	}
}

