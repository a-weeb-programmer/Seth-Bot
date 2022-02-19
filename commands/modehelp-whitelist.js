const db = require('quick.db');

module.exports = {
  name: "modhelp-whitelist",
  execute: async(message, client, args) =>{
    if(!message.member.roles.cache.get("845565648360439809")) return;
    const user = getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if(!user) return message.channel.send("COULDN'T FIND USER");
    if(db.get(`${user.id}_blacklisted`) == null){
      db.set(`${user.id}_blacklisted`, false);
    } else{
      db.set(`${user.id}_blacklisted`, false);
    }
    message.channel.send('SUCCESFULLY WHITELISTED MEMBER TO USE MODHELP');
  }
}
function getMemberFromMention(message, mention){
	if(mention != null){
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.members.cache.get(id);
	}
	return;
}