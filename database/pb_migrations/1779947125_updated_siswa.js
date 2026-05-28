/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbcsiswa001")

  // add field
  collection.fields.addAt(18, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2119570554",
    "max": 0,
    "min": 0,
    "name": "deskripsi_bilqolam_tajwid",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2231709433",
    "max": 0,
    "min": 0,
    "name": "deskripsi_bilqolam_fashahah",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2063887385",
    "max": 0,
    "min": 0,
    "name": "deskripsi_bilqolam_lagu",
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
  collection.fields.removeById("text2119570554")

  // remove field
  collection.fields.removeById("text2231709433")

  // remove field
  collection.fields.removeById("text2063887385")

  return app.save(collection)
})
