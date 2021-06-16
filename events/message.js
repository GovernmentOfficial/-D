const HESS = require('../json/HESS');
const util = require('../json/util');
const smileyQuotes = require('../json/quotes.json');
const fs = require('fs');
const prefix = ":d!";
const moment = require('moment');
const { errorCon } = require('../json/util');

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
        //Sadword Filter
        if(client._demotesFilter.some(e => message.content.includes(e))){
            if(client.altSadWords.some(sad => message.content.toLowerCase().includes(sad)) && d_emotesFilter.some(e => message.content.includes(e))){
                return message.delete()
                .then(e =>{
                    HESS._deleteLog(client).send(`<:D_wrong:740826085293555842>\`[${moment().format('LTS')}]\` ${e.author.tag} (${e.author.id}) posted a sad word!!!\n\`${e}\``)
                })
                .catch(e => util.errorCon(`${message.guild.name} does not permit Delete Message Perms`));
            }
            return;
        }
        if(client.sadWords.some(sad => message.content.toLowerCase().includes(sad))){
            return message.delete()
            .then(e =>{
                HESS._deleteLog(client).send(`<:D_wrong:740826085293555842>\`[${moment().format('LTS')}]\` ${e.author.tag} (${e.author.id}) posted a sad word!!!\n\`${e}\``);
            })
            .catch(e => util.errorCon(`${message.guild.name} does not permit Delete Message Perms`));
        }
        //Regular Filter
        if(somedemotes || message.content.includes(":D")){
            var rand = Math.floor(Math.random() * client._demotesReact.length);
            message.react(client._demotesReact[rand]);

            db.get(util.userDb(message.author.id), (err, row) =>{
                db.run(`UPDATE smiles SET smiles = ${row.smiles + 1} WHERE userId = ${message.author.id}`);
            })
            db.get(util.guildDb(message.guild.id), (err, row) =>{
                db.run(`UPDATE guildSmile SET smiles = ${row.smiles + 1} WHERE guildId = ${message.guild.id}`);
            })

            client.activeSmilers++
        }else if(client.channelIgnores.some(e => message.channel.id === e)){
            return;
        }else{
            message.delete()
            .then(e =>{
                HESS._deleteLog(client).send(`<:D_wrong:740826085293555842>\`[${moment().format('LTS')}]\` ${e.author.tag} (${e.author.id}) posted a non-smiley message :D\n\`${e}\``)
            }).catch(e => util.errorCon(`${message.guild.name} does not permit Delete Message Perms`));
        }

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
            console.log(error);
        }

        

    }
}