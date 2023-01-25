require("dotenv").config(); 
const {Client,GatewayIntentBits, ApplicationCommandPermissionType, GuildMember} = require("discord.js");
const client = new Client({//Declaring intents
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,//Why does this exist if it needs perms for reading content anyway??
		GatewayIntentBits.MessageContent,//Need this to read content of messages, otherwise it returns empty
		GatewayIntentBits.GuildMembers,
	],
});

client.once("ready", () =>{ //Online check on console
    console.log(`I'M ALIVE`);
});

const inviteCounter = new Map([]);

client.on('messageCreate', msg => {
    
    if (msg.content.toLowerCase().includes("discord.gg")){//Checks if message contains discord.gg
        if (!msg.member.roles.cache.some(role => role.name === 'Hall Monitors')){//Checks if the user has the role 'Hall Monitor'
            msg.delete();
            const user =  msg.author.tag;
            console.log(`Invite Deleted ${user}`);
            console.log(`Message contents: ${msg.content}`);
            if (inviteCounter.has(user)){//Checks for an existing entry
                if (inviteCounter.get(user) >= 9){
                    msg.member.ban(msg.author, 7);//Ban method
                    client.channels.cache.get('channelid').send(`**${user} has been banned.**`);//Logs banned user in #Quarantine
                    inviteCounter.delete(user);
                    console.log([inviteCounter.entries()]);
                } if (inviteCounter.get(user) == 4){
                    client.channels.cache.get('channelid').send(`Possible spammer: ${user}`);//Logs a message in #Quarantine when user posts link 5 times
                    temp = inviteCounter.get(user);
                    temp++;
                    inviteCounter.set(user, temp);//Increasing value attached to key
                } else{
                    temp = inviteCounter.get(user);
                    temp++;
                    inviteCounter.set(user, temp);//Increasing value attached to key
                }
            } else{
                inviteCounter.set(user, 1);//Creates an entry if one didn't exist
            }
        }
    }
    if (msg.content.includes(`ping`)){ //Send and read perm check
        if (msg.member.roles.cache.some(role => role.name === 'Hall Monitors')){
            msg.reply(`pong`);
        }
    }
});
client.login(process.env.TOKEN);