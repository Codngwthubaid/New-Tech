import arcjet, { validateEmail } from "@arcjet/node";
import express from "express";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 4000;

const users = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
    })
);

// Arcjet security layer
const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        validateEmail({
            mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only.
            // Block disposable, invalid, and email addresses with no MX records.
            block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        }),
    ],
});

const displayEmails = () => {
    console.log("Registering users...");
    users.forEach((user) => console.log(user.email));
};

app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        const decision = await aj.protect(req, { email });
        console.log("Arcjet decision:", decision);

        if (decision.isDenied()) {
            console.error("Denied by Arcjet:", decision.getReason());
            return res.status(403).json({ error: "Forbidden: Invalid email address" });
        }


        if (users.find((user) => user.email === email)) {
            return res.status(400).json({ message: "User already exists" });
        }


        users.push({ email, password });
        displayEmails();


        res.status(200).json({ message: "Signup successful", email });
    } catch (error) {
        console.error("Error occurred during signup:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
