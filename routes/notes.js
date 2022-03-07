const router = require("express").Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Get Route for retrieving all of the saved notes
router.get("/", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(JSON.parse(data));
            res.json(JSON.parse(data));
        }
    });
});

// Post Route for a new note
router.post("/", (req, res) => {
    // Destructuring assignment for the items in the req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            // Gives the new note a unique id
            note_id: uuidv4()
        };

        // Obtain existing notes
        fs.readFile("./db/db.json", (err, data) => {
            if (err) {
                console.error(err);
            }
            else {
                // Convert string into JSON object
                const parsedData = JSON.parse(data);

                // Add the new note
                parsedData.push(newNote);
                // Write updated notes back to the file
                fs.writeFile("./db/db.json", JSON.stringify(parsedData, null, 4), (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        const response = {
                            status: "success",
                            body: newNote
                        };

                        console.log("Successfully added note");
                        res.status(201).json(response);
                    }
                });                      
            }
        });
    }
    else {
        res.error("Error in adding note");
    }
});

// Delete route for a specific note
router.delete("/:id", (req, res) => {
    const noteId = req.params.id;

    // Read all the notes from the file
    fs.readFile("./db/db.json", (err, data) => {
        if (err) {
            console.err(err);
        }
        else {
            const parsedData = JSON.parse(data);

            // Checks whether there is a note with the given id
            const noteToDelete = parsedData.filter(note => note.note_id === noteId)
            if (noteToDelete.length === 0) {
                return res.json("No note with that id");
            }

            // Make a new array of all notes except the one with the id provided in the URL
            const updatedData = parsedData.filter(note => note.note_id !== noteId);

            // Rewrite the notes to db.json file
            fs.writeFile("./db/db.json", JSON.stringify(updatedData, null, 4), err =>
                err ? console.error(err) : console.log("Successfully updated")
            );

            res.json(`Successfully deleted note with id: ${noteId}`);
        }
    });
});

module.exports = router;