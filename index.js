const Discord = require('discord.js');
const client = new Discord.Client();
const smileyQuotes = require('./json/quotes.json');
const fs = require('fs');
const { token } = require('./config.json');
const moment = require('moment');
client.login(token);
var HESS = '740810964588560424'
var _demotesFilter = []
var d_emotesFilter = [];
var _demotesReact = [];
var smiles = JSON.parse(fs.readFileSync('./json/smilerData.json', 'utf8'))


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
};


client.on('ready', () =>{
    console.log(`${client.user.tag} is online! :D`);
    console.log(`Stopwatch starts at ${moment().format('LTS')}`)

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
        client.guilds.cache.get(HESS).channels.cache.get('816926427328020530').send(SmileUpdate());
    }, 60000*60)




    client.user.setPresence({activity: {name: "with Smilers! :D" }});
    setTimeout(() =>{
        client.guilds.cache.get(HESS).emojis.cache.map(e => _demotesReact.push(`${e.id}`));
        client.guilds.cache.get(HESS).emojis.cache.filter(a => a.identifier.toLowerCase().includes("d:")).map(e => d_emotesFilter.push('<:' + e.identifier + '>'));
        console.log(`${_demotesReact.length} Smiley Emojis have been cached :D \nThere are ${smileyQuotes.length} Smiley Quotes!`);
    }, 2000)
    setInterval(() =>{
        d_emotesFilter = [];
        client.guilds.cache.get(HESS).emojis.cache.filter(a => a.identifier.toLowerCase().includes("d:")).map(e => d_emotesFilter.push('<:' + e.identifier + '>'));
    }, 10000)
})

var sadwords = ["sad", "depress", "hate", "awful", "negativ", ":(", "d:"];
var altSadWords = ["sad", "depress", "hate", "awful", "negativ", ":("];

client.on('message', async message =>{
    if(message.author.bot || message.channel.type === 'dm' || message.type !== "DEFAULT") return;
    
    var somedemotes = _demotesFilter.some(demote => message.content.includes(demote));
    
    if(!smiles[message.author.id]) smiles[message.author.id] = {
        lastCheck: 0,
        smile: 0
    };
    if(!smiles[message.guild.id]) smiles[message.guild.id] = {
        lastCheck: 0,
        smile: 0
    };

    

    


    //Commands
    var args = message.content.split(" ").slice(1).join(' ');
    var userSmile = smiles[message.author.id];

    function isCommand(txt){
        return message.content.toLowerCase().startsWith('!' + txt); 
    };
    if(isCommand(":d")){
        message.reply(`${smileyQuotes[Math.floor(Math.random() * smileyQuotes.length)]}`);
    }
    if(isCommand("checkpositivity")) {
        
        var data = [];
        data.push("```diff"); // Beginning
        data.push("This message shows the positivity of the server! :D\n");
        data.push(`-- ${message.guild.name}'s Smile Stats --`); //Beginning of Guild Stats
        data.push(`+ Current Smiles: ${smiles[message.guild.id].smile}\n+ Smiles from last check: ${smiles[message.guild.id].lastCheck}\n+ Change since last check: +${smiles[message.guild.id].smile - smiles[message.guild.id].lastCheck}\n`);
        data.push(`-- ${message.author.username}'s Smiles --`); //Beginning of User Stats
        data.push(`+ Current Smiles: ${userSmile.smile}\n+ Smiles from last check: ${userSmile.lastCheck}\n+ Change since last check: +${userSmile.smile - userSmile.lastCheck}\n`);
        data.push("```"); // Ending

        message.channel.send(data);

        userSmile.lastCheck = userSmile.smile;
        smiles[message.guild.id].lastCheck = smiles[message.guild.id].smile; 
        fs.writeFile('./json/smilerData.json', JSON.stringify(smiles), (err) =>{
            if (err) console.error(err);
        });
    }



    if(message.author.id !== "161240789660205057" && message.author.id !== "128557464537792512"){
        
    }else{

        if(message.content.toLowerCase().startsWith("!uptime")){
            message.channel.send(SmileUpdate());
        }

        if(message.content.toLowerCase().startsWith("!addquote")){
            let smileyQuotesParse = JSON.parse(fs.readFileSync('./json/quotes.json', 'utf8'));
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
        
        smiles[message.guild.id].smile++;
        smiles[message.author.id].smile++;
        
        fs.writeFile('./json/smilerData.json', JSON.stringify(smiles), (err) =>{
            if (err) console.error(err);
        });
    }else{ 
        if(message.channel.id === "741180990692655157" || message.guild.id === "259303959536205825") return;
        message.delete() 
    }


})

client.on("guildMemberAdd", member => {
    var selfClientG = client.guilds.cache.get(member.guild.id);
    //Perm Check / Nick/Role Change
    member.setNickname(":D").catch(() =>{
        selfClientG.owner.createDM().then(() => console.log(`DM with ${member.guild.owner.user.tag} created!`));
        
    })






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