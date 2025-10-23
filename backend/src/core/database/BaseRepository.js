import { db } from './connection.js';

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  query() {
    return this.db(this.tableName);
  }

  async findAll() {
    return await this.query().select('*');
  }

  async findById(id) {
    return await this.query().where('id', id).first();
  }

  async create(data) {
    const [id] = await this.query().insert(data);
    return await this.findById(id);
  }

  async update(id, data) {
    await this.query()
      .where('id', id)
      .update({
        ...data,
        updated_at: this.db.fn.now()
      });
    return await this.findById(id);
  }

  async delete(id) {
    return await this.query().where('id', id).del();
  }
}

export default BaseRepository;
