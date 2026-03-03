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

	formatISODate(waktuLokalISO, format) {
		return sqlutil_formatISODate(waktuLokalISO, format)
	}


	formatDecimal(value, decimalPlaces) {
		return sqlutil_formatDecimal(value, decimalPlaces)
	}
}

async function lookup(self, db, tablename, key, value) {
	try {
		const sql = `select * from ${tablename} where ${key}=\${value}`
		const row = await db.oneOrNone(sql, { value: value });

		if (row == null) {
			return {}
		} else {
			return row
		}
	} catch (err) {
		throw err
	}
}


function sqlutil_formatISODate(waktuLokalISO, format) {
	const date = new Date(waktuLokalISO);

	// Jika input bukan tanggal yang valid, kembalikan null atau pesan error
	if (isNaN(date.getTime())) return "Invalid Date";

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
	const year = date.getFullYear();

	// Memetakan placeholder ke nilai aslinya
	const map = {
		'dd': day,
		'mm': month,
		'yyyy': year
	};

	// Mengganti placeholder berdasarkan format yang dikirim
	return format.replace(/dd|mm|yyyy/gi, matched => map[matched.toLowerCase()]);
};


function sqlutil_formatDecimal(value, decimalPlaces = 2) {
	if (isNaN(value)) return "0.00";

	return new Intl.NumberFormat('id-ID', {
		minimumFractionDigits: decimalPlaces,
		maximumFractionDigits: decimalPlaces,
	}).format(value);
};