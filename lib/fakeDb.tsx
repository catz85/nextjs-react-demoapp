import loki from 'lokijs';
export const db = new loki('app.db');
export const imagesColl = db.addCollection('images');
