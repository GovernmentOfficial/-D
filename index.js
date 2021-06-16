const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const HESS = require('./json/HESS.js');
const util = require('./json/util');
const { token } = require('./config.json');



//Opening Database
const dbPath = path.resolve(__dirname, 'smile.sqlite');
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if(err){ console.error(err.message) };
    util.infoCon(`SQL Database is active!`);
})


//Logging in Discord API
const {Client, Intents, Collection} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS ]});
client.login(token);



//Custom Client Object Adds
client.activeSmilers = 0;
client._demotesFilter = [];
client._demotesReact = [];
client.sadWords = ["sad", "depress", "hate", "awful", "negativ", ":(", "d:", ">:^)", ">:)"];
client.altSadWords = ["sad", "depress", "hate", "awful", "negativ", ":(", "d:", ">:^)", ">:)"];
client.rawCommands = new Collection();
client.channelIgnores = ["741180990692655157"];



// client.on(`ready`, () =>{ console.log(`${client.user.tag} is logged in!`) })

//Event Handler
const eventPath = path.resolve(__dirname, 'events');
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));
for(const file of eventFiles){
    const event = require(`./events/${file}`);
    if(event.once){
        client.once(event.name, (...args) => event.execute(...args, client, db));
    }else{
        client.on(event.name, (...args) => event.execute(...args, client, db));
    }
}

//Command Handler
const commandPath = path.resolve(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.rawCommands.set(command.name, command);
}
