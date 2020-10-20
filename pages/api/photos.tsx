import { NextApiRequest, NextApiResponse } from 'next'
import { generatePhotoUrl } from '../../lib/colors';
import {imagesColl} from '../../lib/fakeDb';
import withSession from "../../lib/session";
export default withSession(async(req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.page) {
        res.status(404).send('!page')
        return;
    }
    const page = +req.query.page || 0;
    const data = Array(10)
      .fill(0)
      .map((_, i) => {
        return {
            albumId: page,
            title: 'Photo ' + (page * 10 + i),
            url: generatePhotoUrl(page * 10 + i,600),
            thumbnailUrl: generatePhotoUrl(page * 10 + i,100),
            imageId: page * 10 + i,
            favorite: !!imagesColl.find({'imageId': page * 10 + i})[0]
        }
      })
    const nextId = page < 100 ? page + 1 : null
    res.json({ data, nextId })
})
  