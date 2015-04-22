'use strict'

import Knex from 'knex'
import Bookshelf from 'bookshelf'
import test from 'blue-tape'

const knex = Knex({
  client: 'sqlite',
  connection: {
    filename: ':memory:'
  }
})
const bookshelf = Bookshelf(knex)
let counter = 0

class User extends bookshelf.Model {
  initialize () {
    this.on('saving', this.encryptPassword)
  }
  encryptPassword () {
    counter++
  }
}
User.prototype.tableName = 'users'

test('"saving" event', (t) => {
  return knex.schema.createTable('users', (t) => {
    t.increments('id')
  })
  .then(() => {
    return new User().save()
  })
  .then(() => {
    t.equal(counter, 1, 'fires "saving" handlers once')
  })
  .finally(() => {
    return knex.destroy()
  })
})
