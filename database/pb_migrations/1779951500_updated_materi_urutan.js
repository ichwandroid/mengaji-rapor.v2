/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbcmateri001")

  // update field
  const field = collection.fields.getById("text_urutan")
  if (field) {
    field.max = null
    field.min = null
  }

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbcmateri001")

  // revert field
  const field = collection.fields.getById("text_urutan")
  if (field) {
    field.max = 0
    field.min = 0
  }

  return app.save(collection)
})
