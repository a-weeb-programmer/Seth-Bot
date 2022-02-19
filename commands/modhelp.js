const db = require('quick.db')

module.exports = {
  name: "modhelp",
  execute: async(message, client, args) =>{
    if(db.get(`${message.author.id}_blacklisted`) != null && db.get(`${message.author.id}_blacklisted`) == true) return message.channel.send("YOU CANNOT USE THIS COMMAND");
    const reason = args.join(' ')
    message.channel.send('Mods have been contacted.')
    message.guild.channels.cache.get('817151551985549323').send(`@here the modhelp command has been triggered, there is a situation in ${message.channel}, here is a description of the situation: ${reason}`)
  }
}