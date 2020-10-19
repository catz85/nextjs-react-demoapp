import { NextApiRequest, NextApiResponse } from 'next'
import { generatePhotoUrl } from '../../lib/colors';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.imageId) {
        res.status(404).send('!imageId');
        return;
    }
    const imageId = +req.query.imageId || 0
    
    const data = {
        albumId: Math.floor(imageId / 10),
        title: 'Photo ' + imageId,
        url: generatePhotoUrl(imageId,600),
        thumbnailUrl: generatePhotoUrl(imageId,100),
        id: imageId,
    }
    res.json(data)
}
  