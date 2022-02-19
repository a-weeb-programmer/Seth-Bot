const {prefix} = require('../config.json')
const db = require('quick.db')

module.exports = {
    name: "modnote-add",
    execute: async(message, client, args) =>{
        if(!message.member.roles.cache.get("845565648360439809")) return;
        const argument = message.content.slice(prefix.length).trim().split(/\"+(.+)\"+\s+/)
        const rule = argument[1]
        const note = argument[2]
        message.guild.channels.cache.get('939853381340655696').send(`rule: ${rule}\nnote: ${note}`)
        message.channel.send("successfully added modnote")
    }
}
function getarg(argument){
    if(argument != null){
        const matches = argument.match(/^\"?(.+)\"$/)
        if(!matches) return;
        const rule = matches[1]
        return rule;
    }
}