import pgp from 'pg-promise'


export function createDeleteParameters(self, data, keys) {
	for (const key of keys) {
		if (!(key in data)) {
			throw new Error(`Missing required key field: ${key}`);
		}
	}

	const values = keys.map(key => data[key]);
	return values
}

export function createDeleteSql(self, tablename, keys) {
	if (keys.length === 0) {
		throw new Error('Delete command requires at least one key field');
	}

	const whereClauses = keys.map((key, i) => `"${key}" = $${i + 1}`);
	const sql = `DELETE FROM ${tablename} WHERE ${whereClauses.join(' AND ')} RETURNING *`;

	return sql
}


export function createDeleteCommand(this, tablename, data, keys) {
	const cmd = {}
	const sql = createDeleteSql(self, tablename, keys)

	return {
		setTransaction(t) {
			cmd.tx = t
		},

		async execute(data) {
			const db = cmd.tx ?? self.db;
			const values = createDeleteParameters(self, data, keys)

			try {
				const result = await db.oneOrNone(sql, values);
				return result;
			} catch (err) {
				throw err
			}

		}
	}
	
}


export function createDeleteStatement(this, tablename, keys, data, name) {
	const cmd = {}
	const sql = createDeleteSql(self, tablename, keys)
	
	const ps = new pgp.PreparedStatement({
		name: name ?? `delete-${tablename}`,
		text: sql
	});

	return {
		setTransaction(t) {
			cmd.tx = t
		},
		
		async execute(data) {
			const db = cmd.tx ?? self.db;
			const values = createDeleteParameters(self, data, keys)

			try {
				ps.values = values;
				const result = await db.oneOrNone(ps);
				return result;
			} catch (err) {
				throw err
			}
		}
	}	
}




export function createQ(self, tablename, keys) {
	if (keys.length === 0) {
		throw new Error('Delete command requires at least one key field');
	}

	const cmd = {}
	const whereClauses = keys.map((key, i) => `"${key}" = $${i + 1}`);
	const sql = `DELETE FROM ${tablename} WHERE ${whereClauses.join(' AND ')} RETURNING *`;

	const ps = new pgp.PreparedStatement({
		name: `delete-${tablename}`,
		text: sql
	});

    return {
		setTransaction(t) {
			cmd.tx = t
		},

		async execute(data) {
			const db = cmd.tx ?? self.db;

			// Validasi bahwa semua key tersedia
			for (const key of keys) {
				if (!(key in data)) {
					throw new Error(`Missing required key field: ${key}`);
				}
			}

			try {
				const values = keys.map(key => data[key]);
				ps.values = values;

				const result = await db.oneOrNone(ps);
				return result;
			} catch (err) {
				throw err;
			}
		}
	};	
}