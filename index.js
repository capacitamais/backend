const express = require("express");
const cors = require("cors");

const app = express();

//config json response
app.use(express.json());

//solve cors: origin deve receber a url do front
app.use(cors());

//public folder for images
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.send("<h1>🚀 Servidor rodando com sucesso!</h1>");
});

const UserRoutes = require("./routes/UserRoutes");
app.use("/users", UserRoutes);

const EmployeeRoutes = require("./routes/EmployeeRoutes");
app.use("/employees", EmployeeRoutes);

const EmployeeHealthExaminationRoutes = require("./routes/EmployeeHealthExaminationRoutes");
app.use("/employee-health-examinations", EmployeeHealthExaminationRoutes);

const ActivityRoutes = require("./routes/ActivityRoutes");
app.use("/activities", ActivityRoutes);

const ActivityRequiredTrainingRoutes = require("./routes/ActivityRequiredTrainingRoutes");
app.use("/activity-required-training", ActivityRequiredTrainingRoutes);

const HealthExaminationRoutes = require("./routes/HealthExaminationRoutes");
app.use("/health-examinations", HealthExaminationRoutes);

const TaskRoutes = require("./routes/TaskRoutes");
app.use("/tasks", TaskRoutes);

const ReceivedTrainingRoutes = require("./routes/ReceivedTrainingRoutes");
app.use("/received-training", ReceivedTrainingRoutes);

const TrainingRoutes = require("./routes/TrainingRoutes");
app.use("/trainings", TrainingRoutes);

app.listen(5000);
