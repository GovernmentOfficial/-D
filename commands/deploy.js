module.exports = {
    name: "deploy",
    args: true,
    ownerOnly: true,
    async execute(message, args, client, db){
        var first = args[0];
        var second = args.slice(1).join(" ");
        if(!first) return message.reply(`This needs a name...`);
        if(!second) return message.reply(`This needs a description...`);
        message.channel.send(`New command sent to application.\n**Name:** ${first}\n**Description:** ${second}`);
        
        const data = {
            name: first,
            description: second
        }
        const command = await client.application?.commands.create(data);
        console.log(command);
    }
}