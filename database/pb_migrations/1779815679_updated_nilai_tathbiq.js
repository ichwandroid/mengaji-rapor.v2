/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbcnilaitbq0011")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != ''",
    "deleteRule": "@request.auth.id != ''",
    "updateRule": "@request.auth.id != ''"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbcnilaitbq0011")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = 'Admin'",
    "deleteRule": "@request.auth.role = 'Admin'",
    "updateRule": "@request.auth.role = 'Admin'"
  }, collection)

  return app.save(collection)
})
