const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

const ipKey = process.env.IP_API_KEY;

async function getIp(req,res) {
    try {
        const {visitor_name} = req.query

        // const ipInfo = await fetch(`https://ipinfo.io/json?token=${ipKey}`);
        // const info = await ipInfo.json();
        // const {ip,city,loc} = info;
        // const [lat,lon] = loc.split(",");

        const zig = await fetch(`https://ipapi.co/${req.ip}/json/`);
        const data = await zig.json();
        const {ip, city, latitude, longitude} = data;
        // return res.status(200).json(data);
        const weatherInfo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
        const weather = await weatherInfo.json();
        const temp = weather.hourly.temperature_2m[0];
        const greeting = `Hello ${visitor_name}!, the temperature is ${temp} degrees Celsius in ${city}`;
        
        return res.status(200).json({client_ip:ip,location:city,greeting});
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({error: error.message});
    }
    
}

app.get('/api/hello', getIp)

app.listen(PORT, () => console.log('listening on port' + PORT));