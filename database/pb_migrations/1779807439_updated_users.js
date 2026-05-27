/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(10, new Field({
    "help": "",
    "hidden": false,
    "id": "select_users_gpq_kelompok",
    "maxSelect": 1,
    "name": "gpq_kelompok",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Kelompok 1",
      "Kelompok 2",
      "Kelompok 3",
      "Kelompok 4",
      "Kelompok 5",
      "Kelompok 6",
      "Kelompok 7",
      "Kelompok 8",
      "Kelompok 9",
      "Kelompok 10",
      "Kelompok 11",
      "Kelompok 12",
      "Kelompok 13",
      "Kelompok 14"
    ]
  }))

  // update field
  collection.fields.addAt(11, new Field({
    "help": "",
    "hidden": false,
    "id": "select_users_gpq_shift_1",
    "maxSelect": 1,
    "name": "gpq_shift_1",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Kelompok 1",
      "Kelompok 2",
      "Kelompok 3",
      "Kelompok 4",
      "Kelompok 5",
      "Kelompok 6",
      "Kelompok 7",
      "Kelompok 8",
      "Kelompok 9",
      "Kelompok 10",
      "Kelompok 11",
      "Kelompok 12",
      "Kelompok 13",
      "Kelompok 14"
    ]
  }))

  // update field
  collection.fields.addAt(12, new Field({
    "help": "",
    "hidden": false,
    "id": "select_users_gpq_shift_2",
    "maxSelect": 1,
    "name": "gpq_shift_2",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Kelompok 1",
      "Kelompok 2",
      "Kelompok 3",
      "Kelompok 4",
      "Kelompok 5",
      "Kelompok 6",
      "Kelompok 7",
      "Kelompok 8",
      "Kelompok 9",
      "Kelompok 10",
      "Kelompok 11",
      "Kelompok 12",
      "Kelompok 13",
      "Kelompok 14"
    ]
  }))

  // update field
  collection.fields.addAt(13, new Field({
    "help": "",
    "hidden": false,
    "id": "select_users_gpq_shift_3",
    "maxSelect": 1,
    "name": "gpq_shift_3",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Kelompok 1",
      "Kelompok 2",
      "Kelompok 3",
      "Kelompok 4",
      "Kelompok 5",
      "Kelompok 6",
      "Kelompok 7",
      "Kelompok 8",
      "Kelompok 9",
      "Kelompok 10",
      "Kelompok 11",
      "Kelompok 12",
      "Kelompok 13",
      "Kelompok 14"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(10, new Field({
    "help": "",
    "hidden": false,
    "id": "select_users_gpq_kelompok",
    "maxSelect": 1,
    "name": "gpq_kelompok",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Kelompok 1",
      "Kelompok 2",
      "Kelompok 3",
      "Kelompok 4",
      "Kelompok 5",
      "Kelompok 6",
      "Kelompok 7",
      "Kelompok 8",
      "Kelompok 9",
      "Kelompok 10",
      "Kelompok 11",
      "Kelompok 12"
    ]
  }))

  // update field
  collection.fields.addAt(11, new Field({
    "help": "",
    "hidden": false,
    "id": "select_users_gpq_shift_1",
    "maxSelect": 1,
    "name": "gpq_shift_1",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Kelompok 1",
      "Kelompok 2",
      "Kelompok 3",
      "Kelompok 4",
      "Kelompok 5",
      "Kelompok 6",
      "Kelompok 7",
      "Kelompok 8",
      "Kelompok 9",
      "Kelompok 10",
      "Kelompok 11",
      "Kelompok 12"
    ]
  }))

  // update field
  collection.fields.addAt(12, new Field({
    "help": "",
    "hidden": false,
    "id": "select_users_gpq_shift_2",
    "maxSelect": 1,
    "name": "gpq_shift_2",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Kelompok 1",
      "Kelompok 2",
      "Kelompok 3",
      "Kelompok 4",
      "Kelompok 5",
      "Kelompok 6",
      "Kelompok 7",
      "Kelompok 8",
      "Kelompok 9",
      "Kelompok 10",
      "Kelompok 11",
      "Kelompok 12"
    ]
  }))

  // update field
  collection.fields.addAt(13, new Field({
    "help": "",
    "hidden": false,
    "id": "select_users_gpq_shift_3",
    "maxSelect": 1,
    "name": "gpq_shift_3",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Kelompok 1",
      "Kelompok 2",
      "Kelompok 3",
      "Kelompok 4",
      "Kelompok 5",
      "Kelompok 6",
      "Kelompok 7",
      "Kelompok 8",
      "Kelompok 9",
      "Kelompok 10",
      "Kelompok 11",
      "Kelompok 12"
    ]
  }))

  return app.save(collection)
})
