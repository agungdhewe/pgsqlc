import pgp from 'pg-promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import sqlUtil from './src/index.mjs'


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = pgp()({
	port: process.env.DB_PORT,
	host:  process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
});




main()

async function main() {

	try {

		
		const tablename = 'core."user"'
		const rows = [
			{ user_id: 42, user_nickname: 'agung', user_fullname: 'Agung Nugroho', user_email: 'agung_dhewe@yahoo.com', _modifyby:1, _modifydate:'now()' },
			{ user_id: 43, user_nickname: 'budi', user_fullname: 'Budi Santoso', user_email: 'budi_santoso@gmail.com' , _modifyby:1, _modifydate:'now()'},
			// { user_nickname: 'citra', user_fullname: 'Citra Lestari', user_email: 'citra.lestari@outlook.com', _createby: 1 },
			// { user_nickname: 'dwi', user_fullname: 'Dwi Handoko', user_email: 'dwi_hdk@yahoo.com', _createby: 1 },
			// { user_nickname: 'eka', user_fullname: 'Eka Sari', user_email: 'eka_sari@gmail.com', _createby: 1 },
			// { user_nickname: 'faisal', user_fullname: 'Faisal Rahman', user_email: 'faisal.rahman@fgta.net', _createby: 1 },
			// { user_nickname: 'gita', user_fullname: 'Gita Indrawati', user_email: 'gita.indra@yahoo.com', _createby: 1 },
			// { user_nickname: 'hendra', user_fullname: 'Hendra Wijaya', user_email: 'hendra.wijaya@gmail.com', _createby: 1 },
			// { user_nickname: 'irma', user_fullname: 'Irma Nuraini', user_email: 'irma_nur@fgta.net', _createby: 1 },
			// { user_nickname: 'joni', user_fullname: 'Joni Saputra', user_email: 'joni.saputra@outlook.com', _createby: 1 }
		];


		
		sqlUtil.connect(db)


		// dengan transaksi
		db.tx(async t => {
			var cmdUpdate
			for (var row of rows) {
				if (cmdUpdate==null) {
					cmdUpdate = sqlUtil.createUpdateCommand(tablename, row, ['user_id'])
				}
				row._modifyby = 1
				row._modifydate = 'now()'

				cmdUpdate.setTransaction(t)
				var result = await cmdUpdate.execute(row)
				console.log(result)
			}

		})

		
		// tanpa transaksi
		var cmdUpdate
		for (var row of rows) {
			if (cmdUpdate==null) {
				cmdUpdate = sqlUtil.createUpdateCommand(tablename, row, ['user_id'])
			}
			row._modifyby = 1
			row._modifydate = 'now()'

			var result = await cmdUpdate.execute(row)
			console.log(result)
		}
	

	} catch (err) {
		console.error('\x1b[31m%s\x1b[0m', err.message);
	} finally {
		await db.$pool.end()
	}
}
