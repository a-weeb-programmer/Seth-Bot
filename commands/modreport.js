module.exports = {
    name: "modreport",
    execute: async(message, client, args) =>{
      message.delete()
      message.author.send("Please send the name of the mod you want to report and the description of the incident in this format:\n \nName of mod: <username or nickname of mod you're reporting> \nDescription: <description of the incident>").then(async(message) =>{
        const filter = (message) =>{
          return message.author.id != client.user.id;
        }
        const collector = message.channel.createMessageCollector({max:1, filter})
        collector.on('collect', (message)=>{
          message.channel.send('Your report has been sent to the admin team. Thank you for sharing your concerns.')
          client.guilds.cache.get('604171739894775809').channels.cache.get('821101494274883626').send(`A mod report has come in. The report reads: \n"${message.content}" \n\n The report was from <@!${message.author.id}>`)
        })
        collector.on('end', (collected, reason) =>{
          if(reason == 'limit'){
            console.log(`a mod has been reported`)
          }
        })
      })
    }
  }