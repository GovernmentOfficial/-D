const Discord = require('discord.js');
const client = new Discord.Client();
const smileyQuotes = require('./json/quotes.json');
const fs = require('fs');
const sql = require('sqlite');
const { token } = require('./config.json');
const moment = require('moment');
client.login(token);
var HESS = {
    "guild": '740810964588560424',
    "general": '740810964588560427',
    "uptime": '816926427328020530',
    "deleteLog": '849750395609808907'
}
var _demotesFilter = []
var d_emotesFilter = [];
var _demotesReact = [];
// var smiles = JSON.parse(fs.readFileSync('./json/smilerData.json', 'utf8'))


function errorCon(txt){
    return console.log(`[ERROR] (${moment().format('LTS')}) ${txt}`);
}
// eslint-disable-next-line no-unused-vars
function logCon(txt){
    return console.log(`[LOG] (${moment().format('LTS')}) ${txt}`);
}
function infoCon(txt){
    return console.log(`[INFO] (${moment().format('LTS')}) ${txt}`);
}

const path = require('path');
// eslint-disable-next-line no-undef
const dbPath = path.resolve(__dirname, 'smile.sqlite'); //Something fucky here.
sql.open(dbPath);

//Stopwatch setup

var seconds = 0;
var minutes = 0;
var hours = 0;
var days = 0;
var weeks = 0;
var months = 0;

function SmileUpdate(){
    const data = [];

    if(months > 0){
        data.push(` ${months} Months`);
    }
    if(weeks > 0){
        data.push(` ${weeks} Weeks`);
    }
    if(days > 0){
        data.push(` ${days} Days`);
    }
    if(hours > 0){
        data.push(` ${hours} Hours`);
    }
    if(minutes > 0){
        data.push(` ${minutes} Minutes`);
    }
    return `${data.join()} ${seconds} Seconds`;
}

function clean(text){
    if(typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}





client.on('ready', () =>{
    infoCon(`${client.user.tag} is online! :D`);
    infoCon(`Stopwatch starts at ${moment().format('LTS')}`);
    infoCon(`Sqlite DB is open!`);



    //Stopwatch
    setInterval(() => {
        
        if(seconds >= 60){
            minutes++;
            seconds = 0;
        }
        if(minutes >= 60){
            hours++;
            minutes = 0;
            
        }
        if(hours >= 24){
            days++;
            hours = 0;
        }
        if(days >= 7){
            weeks++;
            days = 0;
        }
        if(weeks >= 4){
            months++;
            weeks = 0;
        }
        seconds++;
    }, 1000)
    setInterval(() => {
        client.guilds.cache.get(HESS.guild).channels.cache.get(HESS.uptime).send(SmileUpdate());
    }, 60000*60)



    //Random Ping
    var randomPingTimer = (60000 * 75) * Math.random();
    var gSmileChat = client.guilds.cache.get(HESS.guild).channels.cache.get(HESS.general);
    // NEVER DO THIS \/\/\/\/\/\/\/\/\/\/\/\/\/\/
    // async function punishAllSmilers(){
    //     var smileGuild = client.guilds.cache.get(HESS.guild);
    //     try {
    //         var smileMembers = await smileGuild.fetch();
    //         smileMembers.each(e => e.send(`<:D_mmmwoke:779119205361778738>`));
    //     } catch (error) {
    //         errorCon(error)
    //     }
    // }




    setInterval(() =>{
        randomPingTimer = (60000 * 75) * Math.random();
        gSmileChat.send(`A random non-smiler is walking by, hurry to be the first smiler to convert him to smilerhood. If he passes you, something bad will happen!`);
        const filter = m => m.content.includes(":D");
        gSmileChat.awaitMessages(filter, { max: 1, time: (60000 * 5), errors: ["time"] })
            .then(async c => {
                var winner = c.first().author;
                var row = await sql.get(`SELECT * FROM smiles WHERE userId = ${winner.id}`);
                sql.run(`UPDATE smiles SET specials = ${row.specials + 1} WHERE = ${winner.id}`);
                gSmileChat.send(`${winner} is an outstanding smiler! :D`);
            })
            .catch(() => {
                gSmileChat.send(`<:D_mmmwoke:779119205361778738> This is sickening. We'll get them next time, I'm positive about it :D`);
            });
    }, randomPingTimer)


    client.user.setPresence({activity: {name: "with Smilers! :D" }});

    //Initial Emote Cache
    setTimeout(() =>{
        client.guilds.cache.get(HESS.guild).emojis.cache.map(e => _demotesReact.push(`${e.id}`));
        client.guilds.cache.get(HESS.guild).emojis.cache.filter(a => a.identifier.toLowerCase().includes("d:")).map(e => d_emotesFilter.push('<:' + e.identifier + '>'));
        infoCon(`${_demotesReact.length} Smiley Emojis have been cached :D \nThere are ${smileyQuotes.length} Smiley Quotes!`);
    }, 2000)

    //Keeping the Emote Array Updated
    setInterval(() =>{
        d_emotesFilter = [];
        client.guilds.cache.get(HESS.guild).emojis.cache.filter(a => a.identifier.toLowerCase().includes("d:")).map(e => d_emotesFilter.push('<:' + e.identifier + '>'));
    }, 10000)
})

var sadwords = ["sad", "depress", "hate", "awful", "negativ", ":(", "d:", ">:^)", ">:)"];
var altSadWords = ["sad", "depress", "hate", "awful", "negativ", ":(", "d:", ">:^)", ">:)"];

client.on('message', async message =>{
    if(message.author.bot || message.channel.type === 'dm' || message.type !== "DEFAULT") return;
    
    var somedemotes = _demotesFilter.some(demote => message.content.includes(demote));
    
    
    //SQL Initialize/Check
    var row = await sql.get(`SELECT * FROM smiles WHERE userId = ${message.author.id}`);
    var guildRow = await sql.get(`SELECT * FROM guildSmile WHERE guildId = ${message.guild.id}`);




    
    
    if(!row){
        sql.run(`INSERT INTO smiles VALUES (?, ?, ?, ?, ?)`, [message.author.id, 0, "newbieSmiler", 0, 0]);
        console.log(`${message.author.tag} has been added to the SmileSquad!`);
    }
    if(!guildRow){
        sql.run(`INSERT INTO guildSmile VALUES (?, ?, ?)`, [message.guild.id, 0, 0]);
        console.log(`${message.guild.name} (${message.guild.id}) has been added to the Smile Territories!`);
    }


    
    
    

    


    //Commands
    var args = message.content.split(" ").slice(1).join(' ');
    // var userSmile = smiles[message.author.id]; From JSON DB

    function isCommand(txt){
        return message.content.toLowerCase().startsWith('!' + txt); 
    }
    if(isCommand(":d")){
        message.reply(`${smileyQuotes[Math.floor(Math.random() * smileyQuotes.length)]}`);
    }
    if(isCommand("checkpositivity")) {
        
        var data = [];
        data.push("```diff"); // Beginning
        data.push("This message shows the positivity of the server! :D\n");
        data.push(`-- ${message.guild.name}'s Smile Stats --`); //Beginning of Guild Stats
        data.push(`+ Current Smiles: ${guildRow.smiles}\n+ Smiles from last check: ${guildRow.lastCheck}\n+ Change since last check: +${guildRow.smiles - guildRow.lastCheck}\n`);
        data.push(`-- ${message.author.username}'s Smiles --`); //Beginning of User Stats
        data.push(`+ Current Smiles: ${row.smiles}\n+ Smiles from last check: ${row.lastCheck}\n+ Change since last check: +${row.smiles - row.lastCheck}\n`);
        data.push("```"); // Ending

        message.channel.send(data);

        // userSmile.lastCheck = userSmile.smile;
        // smiles[message.guild.id].lastCheck = smiles[message.guild.id].smile; 
        try {
            sql.run(`UPDATE smiles SET lastCheck = ${row.smiles} WHERE userId = ${message.author.id}`);
            sql.run(`UPDATE guildSmile SET lastCheck = ${guildRow.smiles} WHERE guildId = ${message.guild.id}`);
        } catch (error) {
            console.log(error);
        }
        
    }



    if(message.author.id !== "161240789660205057" && message.author.id !== "128557464537792512"){
        return;
    }else{


        if(message.content.toLowerCase().startsWith("!uptime")){
            message.channel.send(SmileUpdate());
        }

        if(message.content.toLowerCase().startsWith("!addquote")){
            // let smileyQuotesParse = JSON.parse(fs.readFileSync('./json/quotes.json', 'utf8'));
            smileyQuotes.push(args);
            fs.writeFile('./json/quotes.json', JSON.stringify(smileyQuotes), (err) =>{
                if (err) console.error(err);
            });
            message.channel.send(`Quote has been added :D\n${smileyQuotes[smileyQuotes.length-1]}`);
        }
        if(message.content.toLowerCase().startsWith("!:deval")){
    
             
            try {
    
                
                var code = args;
                var evaled = eval(code);
          
                if(typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
                if(message.content.includes('token')) return message.channel.send("");
                if(message.content.includes('2 + 2')) return message.channel.send(`:arrow_forward:**Input**\`\`\`js\n${message.content.substring(7)}\`\`\`\n:arrow_down:**Output**\`\`\`xl\n2\`\`\``)
                message.channel.send(`:arrow_forward:**Input**\`\`\`js\n${message.content.substring(7)}\`\`\`\n:arrow_down:**Output**\`\`\`xl\n${clean(evaled)}\`\`\``)
              } catch (err) {
                message.channel.send(`\`ERROR\` \nCode\n\`\`\`js\n${message.content.substring(7)}\`\`\`\nError\n\`\`\`xl\n${clean(err)}\n\`\`\``);
              }
        }
    }

    
    if(d_emotesFilter.some(e => message.content.includes(e))){
        if(altSadWords.some(sad => message.content.toLowerCase().includes(sad)) && d_emotesFilter.some(e => message.content.includes(e))){
            return message.delete().catch();
        }
        return;
    }
    if(sadwords.some(sad => message.content.toLowerCase().includes(sad))){
        return message.delete().catch();
    }
    if(somedemotes || message.content.includes(":D")){
        var rand = Math.floor(Math.random() * _demotesReact.length);
        message.react(_demotesReact[rand]);
        
        // smiles[message.guild.id].smile++;
        // smiles[message.author.id].smile++;
        
        // fs.writeFile('./json/smilerData.json', JSON.stringify(smiles), (err) =>{
        //     if (err) console.error(err);
        // });

        sql.run(`UPDATE smiles SET smiles = ${row.smiles + 1} WHERE userId = ${message.author.id}`);
        sql.run(`UPDATE guildSmile SET smiles = ${guildRow.smiles + 1} WHERE guildId = ${message.guild.id}`)

    }else{ 
        if(message.channel.id === "741180990692655157" || message.guild.id === "259303959536205825") return;
        message.delete() 
    }


})


client.on("guildCreate", async guild =>{
    var row = await sql.get(`SELECT * FROM guildSmile WHERE guildId = ${guild.id}`);
    if(!row) sql.run(`INSERT INTO guildSmile VALUES (?, ?, ?)`, [guild.id, 0, 0]);
})

client.on("guildMemberAdd", async member => {
    //Perm Check / Nick/Role Change
    member.setNickname(":D").catch(() =>{
        errorCon(`${member.guild.name} does not permit Nickname Perms`);
    })
    var row = await sql.get(`SELECT * FROM smiles WHERE userId = ${member.id}`);
    if(!row) sql.run(`INSERT INTO smiles VALUES (?, ?, ?, ?)`, [member.id, 0, "newbieSmiler", 0, 0]);



    if(member.guild.id === "740810964588560424"){
        member.roles.add('740816514030108755');
    }
})

client.on("messageUpdate", (oldMessage, newMessage) =>{
    var somedemotes = _demotesFilter.some(demote => newMessage.content.includes(demote));
    if(d_emotesFilter.some(e => newMessage.content.includes(e))){
        if(altSadWords.some(sad => newMessage.content.toLowerCase().includes(sad)) && d_emotesFilter.some(e => newMessage.content.includes(e))){
            return newMessage.delete();
        }
        return;
    }
    if(sadwords.some(sad => newMessage.content.toLowerCase().includes(sad))){
        return newMessage.delete();
    }
    if(somedemotes || newMessage.content.includes(":D")){
        newMessage.react("740821929178431508");
    }else{
        if(newMessage.channel.id === "741180990692655157" || newMessage.guild.id === "259303959536205825") return;
        newMessage.delete();
    }

})