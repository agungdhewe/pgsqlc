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


const pad = (str, length) => {
  return str.toString().padEnd(length, ' ');
}

const body = {
	criteria: {
		searchtext: 'na',
		user_isdisabled: true
	},
	limit: 0, 
	offset: 0, 
	columns:['user_id', 'user_fullname', 'user_isdisabled'],
	sort:{
		user_fullname: 'asc',
		user_isdisabled: 'desc'
	}
}


const searchMap = {
	searchtext: `user_fullname ILIKE '%' || \${searchtext} || '%' OR user_id=try_cast_bigint(\${searchtext}::text, 0)`,
	user_isdisabled: `user_isdisabled = \${user_isdisabled}`
};



main(body)

async function main(body) {
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body

	try {

		const tablename = 'core."user"'
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({tablename, columns, whereClause, sort, limit, offset})


		// tampilkan hasilnya
		const rows = await db.any(sql, queryParams);
		console.log('----------------------------------------------------------')
		rows.forEach(row => {
			console.log(row)
			// console.log(pad(row.user_fullname, 30) + pad(row.user_isdisabled, 5))	
		});
		console.log('----------------------------------------------------------')

	} catch (err) {
		console.log(err)
	} finally {
		await db.$pool.end()
	}
}
