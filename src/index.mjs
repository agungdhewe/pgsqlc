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

	createInsertCommand(tablename, data, keys) {
		return ins.createInsertCommand(this, tablename, data, keys)
	}

	createUpdateCommand(tablename, data, keys) {
		return upd.createUpdateCommand(this, tablename, data, keys)
	}

	createDeleteCommand(tablename, keys) {
		return del.createDeleteCommand(this, tablename, keys)
	}

}

