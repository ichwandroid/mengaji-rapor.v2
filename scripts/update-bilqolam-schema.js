const pb = require('pocketbase/cjs');
const client = new pb('http://127.0.0.1:8090');

async function updateSchema() {
    try {
        await client.admins.authWithPassword('opsdanaksaleh@gmail.com', '4n4k54l3H.');
        const collection = await client.collections.getOne('bilqolam');
        
        let schemaUpdated = false;

        // Set existing fields to not required
        ['tajwid', 'fashahah', 'lagu'].forEach(fieldName => {
            const field = collection.fields.find(f => f.name === fieldName);
            if (field && field.required) {
                field.required = false;
                schemaUpdated = true;
            }
        });

        // Add tadarus if not exists
        if (!collection.fields.find(f => f.name === 'tadarus')) {
            collection.fields.push({
                "id": "num_tadarus",
                "name": "tadarus",
                "type": "number",
                "system": false,
                "required": false,
                "presentable": false,
                "hidden": false,
                "min": 0,
                "max": 100,
                "onlyInt": false
            });
            schemaUpdated = true;
        }

        // Add bahasa_arab if not exists
        if (!collection.fields.find(f => f.name === 'bahasa_arab')) {
            collection.fields.push({
                "id": "num_arab",
                "name": "bahasa_arab",
                "type": "number",
                "system": false,
                "required": false,
                "presentable": false,
                "hidden": false,
                "min": 0,
                "max": 100,
                "onlyInt": false
            });
            schemaUpdated = true;
        }

        if (schemaUpdated) {
            await client.collections.update('bilqolam', collection);
            console.log("Berhasil mengupdate skema database bilqolam!");
        } else {
            console.log("Skema sudah mutakhir, tidak ada perubahan yang dilakukan.");
        }
    } catch (error) {
        console.error("Gagal mengupdate skema:", error.response || error);
    }
}

updateSchema();
