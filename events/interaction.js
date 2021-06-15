const smileyQuotes = require('../json/quotes.json');
module.exports = {
    name: "interaction",
    async execute(interaction, client, db){
        if(!interaction.isCommand()) return;
        if(interaction.commandName === 'quote'){
            await interaction.reply({
                content: `${smileyQuotes[Math.floor(Math.random() * smileyQuotes.length)]}`
            })
        }
    }
}