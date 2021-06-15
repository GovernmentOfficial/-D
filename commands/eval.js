const util = require('../json/util');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'eval',
    ownerOnly: true,
    args: true,
    async execute(message, args, client, db){
        try {
            var code = args.join(" ");
            var evaled = eval(code);

            if(typeof evaled !== "string"){
                evaled = require("util").inspect(evaled);
            }
            if(message.content.includes('token')) return;
            var embed = new MessageEmbed()
            .addField(`Input`, `${args}`, false)
            .addField(`Output`, `${util.clean(evaled)}`, false);

            message.channel.send({embeds: [embed]});

        } catch (error) {
            var embed = new MessageEmbed()
            .addField(`Input`, `${args}`, false)
            .addField(`Output`, `${util.clean(error)}`, false);

            message.channel.send({embeds: [embed]});
        }
    }
}