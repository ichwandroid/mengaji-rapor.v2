/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbcsiswa001")

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text_deskripsi_tahfizh",
    "max": 0,
    "min": 0,
    "name": "deskripsi_tahfizh",
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
  collection.fields.removeById("text_deskripsi_tahfizh")

  return app.save(collection)
})
