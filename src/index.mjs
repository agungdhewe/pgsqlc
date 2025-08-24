import * as sel from './select.mjs'
import * as ins from './insert.mjs'
import * as upd from './update.mjs'
import * as del from './delete.mjs'


export default new class {
	#db

	get db() { return this.#db }
	connect(db) {
		this.#db = db
	}

	createWhereClause(criteria, searchMap) {
		return sel.createWhereClause(criteria, searchMap)	
	}

	createSqlSelect(param) {
		return sel.createSqlSelect(param)
	}



	// insert


	createInsertCommand(tablename, data, keys) {
		return ins.createInsertCommand(this, tablename, data, keys)
	}

	createInsertStatement(tablename, data, keys, name) {
		return ins.createInsertStatement(this, tablename, data, keys, name)
	}


	// update 
	createUpdateParameters(data, keys) {
		return upd.createUpdateSql(this, data, keys)
	}

	createUpdateSql(tablename, data, keys) {
		return upd.createUpdateSql(this, tablename, data, keys)
	}

	createUpdateCommand(tablename, data, keys) {
		return upd.createUpdateCommand(this, tablename, data, keys)
	}

	createUpdateStatement(tablename, data, keys, name) {
		return upd.createUpdateStatement(this, tablename, data, keys, name)
	}



	// delete
	createDeleteParameters(data, keys) {
		return createDeleteParameters(this, data, keys)
	}


	createDeleteSql(tablename, keys) {
		return createDeleteSql(this, tablename, keys)
	}

	createDeleteCommand(tablename, data, keys) {
		return del.createDeleteCommand(this, tablename, data, keys)
	}

	createDeleteStatement(tablename, data, keys, name) {
		return del.createDeleteStatement(this, tablename, keys, data, name)
	}

	// lain-lain
	async lookupdb(db, tablename, key, value) {
		return await lookup(this, db, tablename, key, value)
	}

}

async function lookup(self, db, tablename, key, value) {
	try {
		const sql = `select * from ${tablename} where ${key}=\${value}`
		const row = await db.one(sql, {value: value});
		return row
	} catch (err) {
		throw err
	}
}