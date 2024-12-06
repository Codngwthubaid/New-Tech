import arcjet, { validateEmail } from "@arcjet/node";
import express from "express"
import session from "express-session"
import dotenv from "dotenv"

dotenv.config()
const app = express()
const port = 3000

const users = []

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

// arcjet security layer
const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        validateEmail({
            mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
            // block disposable, invalid, and email addresses with no MX records
            block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        }),
    ],
});



const displayEmails = () => {
    console.log('Registering users ...')
    users.forEach(user => console.log(user.email)
    )
}

app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body


        const decision = await aj.protect(req, {
            email,
        });
        console.log("Arcjet decision", decision);

        if (decision.isDenied()) {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Forbidden" }));
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Hello World", email: req.body.email }));
        }

        // check in database
        if (users.find(user => user.email === email)) {
            return res.status(400).json({message : "User allready exists"})
        }

    } catch (error) {
        console.log("Error !!!", error);

    }
})





app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);

})