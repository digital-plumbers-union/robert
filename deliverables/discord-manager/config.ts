import convict from 'convict';

export interface controllerSchema {
    startupChannel: string;
    commandDelimeter: string;
    token: string;
}
const schema = {
    startupChannel: {
        doc: 'channel to send the startup message to',
        default: '716384408642388059', //playground on copa
        format: String
    },
    token:{
        doc: 'discord bot token',
        required: true,
        format: String,
        env: 'DISCORD_BOT_TOKEN',
        default: null as any as string
    },
    namespace: {
        doc: 'namespace where the watcher is running',
        required: true,
        format: String,
        env: 'POD_NAMESPACE',
        default: null as any as string
    }
}

export const config = convict(schema);