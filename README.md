# @agung_dhewe/pgsqlc

Utilitas SQL untuk PostgreSQL, mempermudah pembuatan perintah `INSERT`, `UPDATE`, dan `DELETE` dalam aplikasi berbasis Node.js. Sangat cocok digunakan dalam proyek TypeScript atau JavaScript modern.

---

## ✨ Fitur Utama

- Generate perintah SQL `INSERT`, `UPDATE`, dan `DELETE` secara otomatis
- Fokus pada *convention over configuration*
- Mengurangi penulisan SQL manual
- Dukungan parameterisasi yang aman

---

## 🚀 Instalasi

```bash
npm install @agung_dhewe/pgsqlc
```


---

## 🔧 Contoh Penggunaan

```js
import sqlUtil from '@agung_dhewe/pgsqlc'

// Data yang ingin dimasukkan ke dalam tabel
const user = {
  user_nickname: 'agung',
  user_fullname: 'Agung Nugroho',
  user_email: 'myemai@mydomain.com',
  _createby: 1
}

// Nama tabel dalam schema PostgreSQL
const tablename = 'user'

// Buat perintah SQL INSERT
const cmdInsert = sqlUtil.createInsertCommand(tablename, user, ['user_id'])

// Eksekusi perintah (dengan asumsi cmdInsert sudah memiliki method execute)
const result = await cmdInsert.execute()

console.log(result)

```


---

## Menggunakan Transaksi

```js
import sqlUtil from '@agung_dhewe/pgsqlc'


const tablename = 'core."user"'
const rows = [
  { user_id: 1, user_nickname: 'citra', user_fullname: 'Citra Lestari', user_email: 'citra.lestari@outlook.com' },
  { user_id: 2, user_nickname: 'dwi', user_fullname: 'Dwi Handoko', user_email: 'dwi_hdk@yahoo.com' },
  { user_id: 3, user_nickname: 'eka', user_fullname: 'Eka Sari', user_email: 'eka_sari@gmail.com' },
  { user_id: 4, user_nickname: 'faisal', user_fullname: 'Faisal Rahman', user_email: 'faisal.rahman@fgta.net' },
  { user_id: 5, user_nickname: 'gita', user_fullname: 'Gita Indrawati', user_email: 'gita.indra@yahoo.com'},
  { user_id: 6, user_nickname: 'hendra', user_fullname: 'Hendra Wijaya', user_email: 'hendra.wijaya@gmail.com' },
  { user_id: 7, user_nickname: 'irma', user_fullname: 'Irma Nuraini', user_email: 'irma_nur@fgta.net' },
  { user_id: 8, user_nickname: 'joni', user_fullname: 'Joni Saputra', user_email: 'joni.saputra@outlook.com' }
];


sqlUtil.connect(db)


// dengan transaksi
db.tx(async t => {
  var cmdUpdate
  for (var row of rows) {

    row._modifyby = 1
    row._modifydate = 'now()'
    if (cmdUpdate==null) {
      cmdUpdate = sqlUtil.createUpdateCommand(tablename, row, ['user_id'])
    }

    cmdUpdate.setTransaction(t)
    var result = await cmdUpdate.execute(row)
    console.log(result)
  }

})
```