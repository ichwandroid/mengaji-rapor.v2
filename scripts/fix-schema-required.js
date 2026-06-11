const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../database/pb_data/data.db');

const db = new sqlite3.Database(dbPath);

const collectionsToFix = ['nilai_doa', 'nilai_tahfizh', 'nilai_tathbiq', 'bilqolam'];

db.serialize(() => {
    collectionsToFix.forEach(collectionName => {
        db.get(`SELECT options, fields FROM _collections WHERE name='${collectionName}'`, (err, row) => {
            if (err) {
                console.error(`Error reading ${collectionName}:`, err);
                return;
            }
            if (!row) {
                console.log(`Collection ${collectionName} not found.`);
                return;
            }
            
            let fields = JSON.parse(row.fields);
            let changed = false;
            
            fields.forEach(f => {
                // If it's a number field and required is true, change it to false
                if ((f.name === 'nilai' || f.type === 'number') && f.required === true) {
                    f.required = false;
                    changed = true;
                }
            });
            
            if (changed) {
                db.run(`UPDATE _collections SET fields = ? WHERE name='${collectionName}'`, [JSON.stringify(fields)], function(err) {
                    if (err) console.error(`Error updating ${collectionName}:`, err);
                    else console.log(`[SUCCESS] Removed 'required: true' from number fields in ${collectionName}`);
                });
            } else {
                console.log(`[OK] No changes needed for ${collectionName}`);
            }
        });
    });
});

// also fix saran_gpq and saran_gpai in siswa maybe? No, strings can be empty without validation error if required is false, but if required is true, empty string is invalid. We leave it as is unless it's a problem.

setTimeout(() => {
    db.close();
    console.log("Database patch completed.");
}, 1000);
