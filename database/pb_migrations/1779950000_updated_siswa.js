/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbcsiswa001")

  // add field
  collection.fields.addAt(21, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text_materi_1",
    "max": 0,
    "min": 0,
    "name": "materi_bilqolam_1",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text_materi_2",
    "max": 0,
    "min": 0,
    "name": "materi_bilqolam_2",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(23, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text_materi_3",
    "max": 0,
    "min": 0,
    "name": "materi_bilqolam_3",
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
  collection.fields.removeById("text_materi_1")
  collection.fields.removeById("text_materi_2")
  collection.fields.removeById("text_materi_3")

  return app.save(collection)
})
