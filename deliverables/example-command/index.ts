import { Client } from 'discord.js';
import { config } from './config';

config.validate({ allowed: 'strict'});
const client = new Client();
const inflatedConfig = config.getProperties();

client.login(inflatedConfig.token);
client.on("ready", async () => {
    console.log('running');
    const swamp: any = await client.channels.fetch(inflatedConfig.channel);
    swamp.send('pong');
});