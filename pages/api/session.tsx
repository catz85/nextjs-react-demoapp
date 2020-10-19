import { withIronSession } from "next-iron-session";
import config from '../../lib/config.json'
const VALID_EMAIL = config.fakeDb.email;
const VALID_PASSWORD = config.fakeDb.password;

export default withIronSession(
    async (req, res) => {
        if (req.method === "POST") {
            console.log(req.body);
            const { email, password } = req.body;

            if (email === VALID_EMAIL && password === VALID_PASSWORD) {
                req.session.set("user", { email });
                await req.session.save();
                return res.status(200).json({ email });
            }

            return res.status(403).json({ message: 'Not authorized', error: true });
        }

        return res.status(404).json({ message: 'Not found', error: true });
    },
    {
        cookieName: process.env.COOKIE_NAME,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false
        },
        password: process.env.SECRET_COOKIE_PASSWORD
    }
);