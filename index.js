const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());

const requestLogger = (request, response, next) => {
	console.log("Method:", request.method);
	console.log("Path:  ", request.path);
	console.log("Body:  ", request.body);
	console.log("---");
	next();
};

app.use(requestLogger);

morgan.token("body", function (req, res) {
	return JSON.stringify(req.body);
});

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info/", (request, response) => {
	const time = new Date();
	response.send(`
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${time}</p>
	`);
});

app.get("/api/persons/", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/api/persons/:id", (request, response) => {
	// const id = Number(request.params.id);
	// const person = persons.find((person) => person.id === id);

	// Person.findById(request.params.id)

	// if (person) {
	// 	response.json(person);
	// } else {
	// 	response.status(404).end();
	// }
	Person.findById(request.params.id).then((person) => {
		response.json(person);
	});
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "information missing",
		});
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then((savedPerson) => {
		response.json(person);
	});
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
