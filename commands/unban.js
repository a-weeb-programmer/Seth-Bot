const Discord = require('discord.js');

module.exports = {
    name: "unban",
    execute: async(message, client, args) =>{
        if(!message.member.permissions.has('BAN_MEMBERS')) return;
		if(args.length < 1)
		  return message.channel.send('PUT IN A USER ID TO UNBAN');
	    let user = message.guild.members.resolveId(args[0])
        message.guild.bans.fetch().then(bans =>{
        if(bans.size == 0) return message.channel.send('THERE IS NO ONE TO UNBAN')
        let bUser = bans.find(b => b.user.id == user)
        if(!bUser) return message.channel.send('CANNOT FIND BANNED USER');
        message.guild.members.unban(bUser.user)
        return message.channel.send(`${user} HAS BEEN BROUGHT BACK FROM THE SHADOW REALM`)
            }
        )}
}