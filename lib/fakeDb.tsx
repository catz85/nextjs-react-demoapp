import loki from 'lokijs';
class FakeDB {
    private db;
    public collection;
    constructor () {
        this.db = new loki('app.db');
        this.collection = this.db.addCollection('images');
    }

}
const singletonDbInstance = new FakeDB();
const db = Object.freeze(singletonDbInstance);
export default db;
