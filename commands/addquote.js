const smileyQuotes = require('../json/quotes.json');
const fs = require('fs');

module.exports = {
    name: "addquote",
    ownerOnly: true,
    args: true,
    execute(message, args, client, db){
        smileyQuotes.push(args.join(" "));
        fs.writeFile('./json/quotes.json', JSON.stringify(smileyQuotes), (err) =>{
            if(err) console.error(err);
        })
        message.channel.send(`Quote has been added :D\n${args.join(" ")}`);
    }
}