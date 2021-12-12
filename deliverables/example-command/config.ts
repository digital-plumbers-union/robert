import convict from 'convict';

export interface controllerSchema {
    startupChannel: string;
    commandDelimeter: string;
    token: string;
}
const schema = {
    channel: {
        doc: 'channel to send response',
        format: String,
        env: 'CHANNEL',
        default: null as any as string
    },
    token:{
        doc: 'discord bot token',
        required: true,
        format: String,
        env: 'DISCORD_BOT_TOKEN',
        default: null as any as string
    }
}

export const config = convict(schema);