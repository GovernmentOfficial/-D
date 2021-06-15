module.exports = {
    "guildId": '740810964588560424',
    "generalId": '740810964588560427',
    "uptimeId": '816926427328020530',
    "deleteLogId": '849750395609808907',
    _guild(bot){
        return bot.guilds.resolve(this.guildId);
    },
    _general(bot){
        return bot.guilds.resolve(this.guildId).channels.resolve(this.generalId);
    },
    _uptime(bot){
        return bot.guilds.resolve(this.guildId).channels.resolve(this.uptimeId);
    },
    _deleteLog(bot){
        return bot.guilds.resolve(this.guildId).channels.resolve(this.deleteLogId);
    },
    async _guildSql(yes){
        var row = yes.get(`SELECT * FROM guildSmile WHERE guildId = ${this.guildId}`);

        return row;
    }
}