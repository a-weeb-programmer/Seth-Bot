const app = require('http');
const fs = require('fs');
const port = 3000;
app.createServer((req, res) => {
  if(req.url === "/"){
  fs.readFile('seth.html', (err, data)=>{
    if(err) throw err;
      res.write(data)
    })
  }
  if(req.url === "/seth.css"){
    
    fs.readFile('seth.css', (err, data)=>{
      if(err) throw err;
      res.write(data);
         res.end();
    })
  }
}).listen('3001', () => console.log(`listening at http://localhost:${port}`));

//--------------------------------BOT CODE START------------------------------

const {Client, Intents, Collection} = require('discord.js')
const{prefix} = require('./config.json')
const db = require('quick.db')
const command_files = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
const client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS]}) 
client.once('ready', ()=>{
	console.log("KUUDERE OS IS LOADING.......... INITIALIZING SETH BOT.. READY!!!!!1111!!!!!!!!!!!1")
});
client.commands = new Collection();
for(const file of command_files){
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command);
}
//message creation event
client.on('messageCreate', message =>{
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	if(message.mentions.members.first() == message.guild.members.cache.get("888196466269642752")){
		if(message.channel === message.guild.channels.cache.get("772130040389304340")){
		  message.reply("FRIK OFF LIL SUSSY BAKA <3");
		} else{
		  if(!db.get(`already_warned_${message.mentions.members.first().id}`)) return; else{
				db.set(`already_warned_${message.mentions.members.first().id}`, true)
			  const spam = message.guild.channels.cache.get("772130040389304340");
			  message.channel.send(`IF YOU WANT ME TO SAY "FRIK OFF", DO IT IN ${spam} PLS UwU`)
			}
		  }
		}
	//I had to put that != null check because the bot kept crashing due to the guild id being null for some reason
	if(message.guild.id != null){
		if(db.get(`message_num_${message.guild.id}`) == null){
			db.set(`message_num_${message.guild.id}`, 0)
			}
			if(message.channel === message.guild.channels.cache.get('772129160411217940')){
		db.add(`message_num_${message.guild.id}`, 1)
		}
	}
	if(!message.guild) return;
	if(message.author.bot)return;
	if(!message.content.startsWith(prefix)) return;
	const command_name = client.commands.get(command);
	if(!command_name) return;
	command_name.execute(message, client, args)
});
//ded chat timer
setInterval(() =>{
	if(db.get(`message_num_${client.guilds.cache.get('604171739894775809').id}`) < 15){
		const chat_revive_role = client.guilds.cache.get('604171739894775809').roles.cache.get('907031895102087179')
		const channel = client.guilds.cache.get('604171739894775809').channels.cache.get('772129160411217940')
		channel.send(`${chat_revive_role} THE CHAT IS DED`)
		return db.subtract(`message_num_${client.guilds.cache.get('604171739894775809').id}`, db.get(`message_num_${client.guilds.cache.get('604171739894775809').id}`));
	} else if(db.get(`message_num_${client.guilds.cache.get('604171739894775809').id}`) > 15){
		return db.subtract(`message_num_${client.guilds.cache.get('604171739894775809').id}`, db.get(`message_num_${client.guilds.cache.get('604171739894775809').id}`));
	}
}, (1000 * 60) * 3);
//welcoming system
client.on('guildMemberUpdate', (oldMember, newMember)=>{
	if(!oldMember.roles.cache.get('772129150114201620') && newMember.roles.cache.get('772129150114201620')){
		let channel = newMember.guild.channels.cache.get('667857844237893703')
    const rules = newMember.guild.channels.cache.get('606019936397295628');
		channel.send(`Welcome to the MVPerry Discord Server, ${newMember.user}, Please read the ${rules} if you haven't done already! I hope you enjoy you experience in this server!!`)
	}
});
client.login(Process.env.TOKEN)