// src/core/database/BaseRepository.js
import { connection } from './connection.js'; // À ajouter
export class BaseRepository {
  constructor(tableName, entityClass) {
    this.tableName = tableName;
    this.entityClass = entityClass;
    this.knex = connection; // Supposant que connection.js exporte knex
  }

  query() {
    return this.knex(this.tableName);
  }

  async findAll() {
    const results = await this.query();
    return results.map(data => new this.entityClass(data));
  }

  async findById(id) {
    const result = await this.query().where('id', id).first();
    return result ? new this.entityClass(result) : null;
  }

  async create(data) {
    const [result] = await this.query().insert(data).returning('*');
    return new this.entityClass(result);
  }

  async update(id, data) {
    const [result] = await this.query().where('id', id).update(data).returning('*');
    return new this.entityClass(result);
  }

  async delete(id) {
    return this.query().where('id', id).del();
  }
}