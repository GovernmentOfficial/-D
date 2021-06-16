const HESS = require('../json/HESS');
const util = require('../json/util');
const message = require('./message');

module.exports = {
    name: "messageUpdate",
    execute(oldMessage, newMessage, client, db){
        if(newMessage.channel.type === 'dm') return;

        //Filters
        var somedemotes = client._demotesFilter.some(demote => newMessage.content.includes(demote));
        //Sadword Filter
        if(client._demotesFilter.some(e => newMessage.content.includes(e))){
            if(client.altSadWords.some(sad => newMessage.content.toLowerCase().includes(sad)) && client._demotesFilter.some(e => newMessage.content.includes(e))){
                return newMessage.delete()
                .then(e =>{
                    HESS._deleteLog(client).send(`<:D_wrong:740826085293555842>\`[${moment().format('LTS')}]\` ${e.author.tag} edited their message into a non-smiley message :D\n\`${oldMessage}\`\nto\n\`${e}\``)
                })
                .catch(e => util.errorCon(`${newMessage.guild.name} does not permit Delete Message Perms`));
            }
            return;
        }
        if(client.sadWords.some(sad => newMessage.content.toLowerCase().includes(sad))){
            return newMessage.delete()
            .then(e =>{
                HESS._deleteLog(client).send(`<:D_wrong:740826085293555842>\`[${moment().format('LTS')}]\` ${e.author.tag} edited their message into a non-smiley message :D\n\`${oldMessage}\`\nto\n\`${e}\``)
            })
            .catch(e => util.errorCon(`${newMessage.guild.name} does not permit Delete Message Perms`));
        }
        //Regular Filter
        if(somedemotes || newMessage.content.includes(":D")){
            var rand = Math.floor(Math.random() * client._demotesFilter.length);
            newMessage.react(client._demotesReact[rand]);
        }else if(client.channelIgnores.some(e => newMessage.channel.id === e)){
            return;
        }else{
            newMessage.delete()
            .then(e =>{
                HESS._deleteLog(client).send(`<:D_wrong:740826085293555842>\`[${moment().format('LTS')}]\` ${e.author.tag} edited their message into a non-smiley message :D\n\`${oldMessage}\`\nto\n\`${e}\``)
            })
            .catch(e => util.errorCon(`${newMessage.guild.name} does not permit Delete Message Perms`))
        }


    }
}