const db = require('quick.db');

module.exports = {
    name: "message-numbers",
    execute: async(message, client, args) =>{
        let message_num = db.get(`message_num_${message.guild.id}`)
		message.channel.send(`this server has had ${message_num} messages since this bot was turned on`)
    }
}