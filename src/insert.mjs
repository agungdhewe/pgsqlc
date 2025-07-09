import pgp from 'pg-promise'

export function createInsertCommand(self, tablename, data, keys=[]) {
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