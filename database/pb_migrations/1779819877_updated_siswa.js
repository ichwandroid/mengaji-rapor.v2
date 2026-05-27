/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbcsiswa001")

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text_desk_bilqolam",
    "max": 0,
    "min": 0,
    "name": "deskripsi_bilqolam",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text_desk_doa",
    "max": 0,
    "min": 0,
    "name": "deskripsi_doa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text_desk_tathbiq",
    "max": 0,
    "min": 0,
    "name": "deskripsi_tathbiq",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbcsiswa001")

  // remove field
  collection.fields.removeById("text_desk_bilqolam")

  // remove field
  collection.fields.removeById("text_desk_doa")

  // remove field
  collection.fields.removeById("text_desk_tathbiq")

  return app.save(collection)
})
