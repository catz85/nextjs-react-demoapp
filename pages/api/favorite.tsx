import withSession from "../../lib/session";
import db from '../../lib/fakeDb';
import { generatePhotoUrl } from '../../lib/colors';
const itemsPerPage = 10;

export default withSession(async (req, res) => {
    const user = req.session.get("user");
    let imageId: string | number;
    if (!user) {
        res.status(503).json({ error: true, message: 'Auth required!' })
    }
    switch (req.method) {
        case "POST":
            console.log('POST')
            const page = parseInt(req.query.page) || 0;
            const favorites = Object.keys(db).sort(function(a:any, b:any) {
                return a - b;
              }).map(el=>db[el])
            
            const data = favorites.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
            const nextId = page < (favorites.length - itemsPerPage) / itemsPerPage ? page + 1 : null
            res.json({ data, nextId })
            break;
        case "DELETE":
            console.log('DELETE')
            console.log('DATABASE', db)
            imageId = parseInt(req.query.imageId);
            if (isNaN(imageId)) {
                res.status(404).json({ error: true, message: "Element not found!" })
                break;
            }
            const deletingKey = db[imageId];
            console.log(deletingKey, imageId)
            if (!deletingKey) {
                res.status(404).json({ error: true, message: "Element not found!" })
                break;
            }
            delete db[imageId]
            res.json({ error: false, message: "Deleted!", deletingKey });
            break;
        case "PUT":
            console.log('PUT')
            imageId = parseInt(req.query.imageId);
            if (isNaN(imageId)) {
                res.status(404).json({ error: true, message: "Element not found!" })
                break;
            }
            let key = db[imageId]
            console.log('DATABASE', db)
            if (!key) {
                key = db[imageId] = {
                    albumId: Math.floor(imageId / 10),
                    title: 'Photo ' + imageId,
                    url: generatePhotoUrl(imageId, 600),
                    thumbnailUrl: generatePhotoUrl(imageId, 100),
                    favorite: true,
                    imageId,
                };
            }
            res.json({ error: false, message: "Added!", key });
            break;
    }
});