module.exports = {
    name: 'ignore',
    ownerOnly: true,
    execute(message, args, client, db){
        client.channelIgnores.push(message.channel.id);
        message.channel.send(`${message.channel} has been added to the ignore list (It will be removed on bot restart)`);
    }
}