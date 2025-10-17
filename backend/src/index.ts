import dotenv from "dotenv";
import express from "express";
import session from "express-session"
import auth from "./config/auth";
import router from "./routes/auth";

dotenv.config({ override: true });
auth.config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}))
app.use("/auth", router);

app.get("/", (_, res) => {
    res.send("Hello From Tiew Tid Ngob's Backend");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});