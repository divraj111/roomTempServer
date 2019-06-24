const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const tempOb = JSON.parse(fs.readFileSync('templog.json'));
let lastCall = parseFloat((Date.now() / 1000).toFixed(0)) - 60;
app.use(express.static('public'));
app.get('/addTemp/:room/:temp', (req, res) => {
    // console.log(req.params);
    let data = req.params;
    let reply;
    const time = (Date.now() / 1000).toFixed(0);
    if (parseFloat(time) - 60 < lastCall) {
        reply = {
            status: "Unsuccessful",
            msg: "Rate Limit Reached"
        };
    } else {

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
                    msg: "Enter a number"
                };
            }
        } else {
            reply = {
                status: "Room not Found",
                msg: "Add a room before sending a new temp"
            };
        }
        lastCall = parseFloat(time);
    }

    res.send(reply);
});

app.get('/clearRoom/:room', (req, res) => {
    const time = (Date.now() / 1000).toFixed(0);
    data = req.params;
    let reply;
    if (tempOb[data.room]) {
        reply = {
            status: "Cleared",
            room: data.room,
        };
        tempOb[data.room] = [];
        fs.writeFile('tempLog.json', JSON.stringify(tempOb, null, 2), () => console.log(`Room ${data.room} cleared at ${time}`));

    } else {
        reply = {
            status: "Room not Found"
        };
    }
    res.send(reply);
});

app.get('/addRoom/:room', (req, res) => {
    const time = (Date.now() / 1000).toFixed(0);
    data = req.params;
    let reply;
    if (!tempOb[data.room]) {
        reply = {
            status: "Room Added",
            room: data.room,
        };
        tempOb[data.room] = [];
        fs.writeFile('tempLog.json', JSON.stringify(tempOb, null, 2), () => console.log(`Room ${data.room} cleared at ${time}`));

    } else {
        reply = {
            status: "Current Room already there"
        };
    }
    res.send(reply);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));