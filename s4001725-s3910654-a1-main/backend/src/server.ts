import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

import applicationRoutes from "./routes/applicationRoutes";
import courseRoutes from "./routes/courseRoutes";
import userRoutes from "./routes/userRoutes";
import skillRoutes from "./routes/skillRoutes"; 

app.use(cors());
app.use(express.json());

app.use("/api/applications", applicationRoutes);  
app.use("/api/courses", courseRoutes);           
app.use("/api/users", userRoutes);               
app.use("/api/skills", skillRoutes);             

app.get("/", (req, res) => {
    res.json({ 
        message: "API is running!", 
        endpoints: [
            "/api/users",
            "/api/courses", 
            "/api/skills",
            "/api/applications"
        ]
    });
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log("Available endpoints:");
            console.log("- GET  http://localhost:" + PORT + "/api/users");
            console.log("- GET  http://localhost:" + PORT + "/api/courses");
            console.log("- GET  http://localhost:" + PORT + "/api/skills");
            console.log("- GET  http://localhost:" + PORT + "/api/applications");
        });
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error);
        process.exit(1);
    });

export default app;