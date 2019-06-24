const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const tempOb = JSON.parse(fs.readFileSync('templog.json'));
app.use(express.static('public'));
app.get('/addTemp/:room/:temp', (req, res) => {
    // console.log(req.params);
    let time = (Date.now() / 1000).toFixed(0)
    data = req.params;
    let reply;
    if (tempOb[data.room]) {
        if (!isNaN(data.temp)) {
            reply = {
                status: "Success",
                room: data.room,
                temp: parseFloat(data.temp).toFixed(2)
            };
            let newItem = {};
            newItem[time] = parseFloat(parseFloat(data.temp).toFixed(2));
            tempOb[data.room].push(newItem);
            fs.writeFile('tempLog.json', JSON.stringify(tempOb, null, 2), () => console.log("Log Updated at " + time));
        }
        else {
            reply = {
                status: "Invalid Number",
                description: "Enter a number"
            };
        }
    } else {
        reply = {
            status: "Room not Found",
            description: "Add a room before sending a new temp"
        };
    }
    res.send(reply);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))