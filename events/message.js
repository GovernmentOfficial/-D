const HESS = require('../json/HESS');
const util = require('../json/util');
const smileyQuotes = require('../json/quotes.json');
const fs = require('fs');
const prefix = ":d!";


module.exports = {
    name: "message",
    async execute(message, client, db){
        if(!client.application?.owner) await client.application?.fetch();
        if(message.author.bot || message.channel.type === 'dm' || message.type !== "DEFAULT") return;
        
        var somedemotes = client._demotesFilter.some(demote => message.content.includes(demote));
        
        //Existence Check
        db.get(util.userDb(message.author.id), (err, row) =>{
            if(err) console.error(err);
            if(!row){
                db.run(`INSERT INTO smiles VALUES (?, ?, ?, ?, ?)`, [message.author.id, 0, "newbieSmiler", 0, 0]);
                util.logCon(`${message.author.tag} has been added to the SmileSquad!`);
                HESS._general(client).send(`Welcome ${message.author} to HESS! (High Effort, Smile Server)`);
            }
        })
        db.get(util.guildDb(message.guild.id), (err, row) =>{
            if(err) console.error(err);
            if(!row){
                db.run(`INSERT INTO guildSmile VALUES (?, ?, ?, ?)`, [message.guild.id, 0, 0, 0]);
                util.logCon(`${message.guild.name} (${message.guild.id}) has been added to the Smile Territories!`)
            }
        })


        //Filters
        //Emote Filter
        //Sadword Filter
        //Regular Filter
        if(message.content.includes(":D")){
            var rand = Math.floor(Math.random() * client._demotesReact.length);
            message.react(client._demotesReact[rand]);

            db.get(util.userDb(message.author.id), (err, row) =>{
                db.run(`UPDATE smiles SET smiles = ${row.smiles + 1} WHERE userId = ${message.author.id}`);
            })

            //client.activeSmilers++

        }

        //Commands
/*

        if(client.application?.owner.id === message.author.id){
            if(isCommand('test')) { console.log(`test`) };


            if(isCommand("addquote")){
                if(!args) return message.channel.send(`No arguments sent`);
                smileyQuotes.push(args);
                fs.writeFile('../json/quotes.json', JSON.stringify(smileQuotes), (err) =>{
                    if(err) throw err;
                })
                message.channel.send(`Quote has been added :D\n${smileyQuotes[smileyQuotes.length+1]}`);
            }

            if(isCommand("eval")){
                try {
    
                
                    var code = args;
                    var evaled = eval(code);
              
                    if(typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
                    if(message.content.includes('token')) return message.channel.send("");
                    if(message.content.includes('2 + 2')) return message.channel.send(`:arrow_forward:**Input**\`\`\`js\n${message.content.substring(7)}\`\`\`\n:arrow_down:**Output**\`\`\`xl\n2\`\`\``)
                    message.channel.send(`:arrow_forward:**Input**\`\`\`js\n${message.content.substring(7)}\`\`\`\n:arrow_down:**Output**\`\`\`xl\n${util.clean(evaled)}\`\`\``)
                  } catch (err) {
                    message.channel.send(`\`ERROR\` \nCode\n\`\`\`js\n${message.content.substring(7)}\`\`\`\nError\n\`\`\`xl\n${util.clean(err)}\n\`\`\``);
                  }
            }
        }
        */

        //Command Handler
        if(!message.content.toLowerCase().startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.rawCommands.get(commandName)
          || client.rawCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command) return;

        //Command Settings-----
        /*
        Command Option List
        - args
            -- usage
        - dmGood
        - ownerOnly
        */
        if(message.channel.type !== 'text' && !command.dmGood){
            return message.channel.send(`There is a perfectly good explanation as to why you can not use this bot in dms.`);
        }
        if(command.args && !args.length){
            let reply = `Something here is missing.`;
            if(command.usage){
                reply+= `\n\`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }
        if(command.ownerOnly && message.author.id !== client.application?.owner.id){
            return message.reply(`You are not the owner of this bot.`);
        }

        //---------------------

        //Command Execution
        try {
            command.execute(message, args, client, db);
        } catch (error) {
            message.reply(`There was an error trying to execute that command!`);
            throw error;
        }

        

    }
}