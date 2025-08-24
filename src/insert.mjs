import pgp from 'pg-promise'


function getInsertedColumn(data, keys) {
	const excludedFields = keys;
	const columns = Object.keys(data).filter(col => !excludedFields.includes(col));
	return columns
}

export function createInsertParameters(self, data, keys) {
	const columns = getInsertedColumn(data, keys)
	const values = columns.map(col => data[col]);
	return values
}


export function createInsertSql(self, tablename, data, keys) {
	const columns = getInsertedColumn(data, keys)
	const placeholders = columns.map((_, i) => `$${i + 1}`);
	const sql = `INSERT INTO ${tablename} ("${columns.join('", "')}") VALUES (${placeholders.join(', ')}) RETURNING *`;	
	return sql
}



export function createInsertCommand(self, tablename, data, keys=[]) {
	const cmd = {}
	const sql = createInsertSql(self, tablename, data, keys)

	return {
		setTransaction(t) {
			cmd.tx = t
		},

		async execute (data) {
			const db = cmd.tx ?? self.db;
			const values = createInsertParameters(self, data, keys)
			 
			try {
				const result = await db.oneOrNone(sql, values);
				return result
			} catch (err) {
				throw err
			}
		}
	}	
}

export function createInsertStatement(self, tablename, data, keys=[], name) {
	const cmd = {}
	const sql = createInsertSql(self, tablename, data, keys)

	const ps = new pgp.PreparedStatement({
		name: name ?? `insert-${tablename}`,
		text: sql
	});

	return {
		setTransaction(t) {
			cmd.tx = t
		},

		async execute (data) {
			const db = cmd.tx ?? self.db;
			const values = createInsertParameters(self, data, keys)
 
			try {
				ps.values = values
				const result = await db.oneOrNone(ps);
				return result
			} catch (err) {
				throw err
			}
		}
	}
}


export function createInsertCommand__(self, tablename, data, keys=[]) {
	const cmd = {}
	const excludedFields = keys;
	const columns = Object.keys(data).filter(col => !excludedFields.includes(col));
	const placeholders = columns.map((_, i) => `$${i + 1}`);
	
	const sql = `INSERT INTO ${tablename} ("${columns.join('", "')}") VALUES (${placeholders.join(', ')}) RETURNING *`;	
	
	
	const ps = new pgp.PreparedStatement({
		name: `insert-${tablename}`,
		text: sql
	});

	return {
		setTransaction(t) {
			cmd.tx = t
		},

		async execute (data) {
			 const db = cmd.tx ?? self.db;
			 
			try {
				const values = columns.map(col => data[col]);
				ps.values = values

				const result = await db.oneOrNone(ps);
				return result
			} catch (err) {
				throw err
			}
		}
	}
}