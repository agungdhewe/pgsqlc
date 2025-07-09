import pgp from 'pg-promise'

export function createUpdateCommand(self, tablename, data, keys) {
	if (keys.length === 0) {
        throw new Error('Update command requires at least one key field');
    }

	const cmd = {}
	const excludedFields = keys;
	const columns = Object.keys(data).filter(col => !excludedFields.includes(col));

    const setClauses = columns.map((col, i) => `"${col}" = $${i + 1}`);
    const whereClauses = keys.map((key, i) => `"${key}" = $${columns.length + i + 1}`);

    const sql = `UPDATE ${tablename} SET ${setClauses.join(', ')} WHERE ${whereClauses.join(' AND ')} RETURNING *`;

    const ps = new pgp.PreparedStatement({
        name: `update-${tablename}`,
        text: sql
    });	

    return {
		setTransaction(t) {
			cmd.tx = t
		},

        async execute(data) {
            const db = cmd.tx ?? self.db;

			for (const key of keys) {
				if (!(key in data)) {
					throw new Error(`Missing required key field: ${key}`);
				}
			}

			try {
				const values = [
					...columns.map(col => data[col]),
					...keys.map(key => data[key])
				];

				ps.values = values;

				const result = await db.oneOrNone(ps);
				return result;
            } catch (err) {
                throw err;
            }
        }
    };	

}