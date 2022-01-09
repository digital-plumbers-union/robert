import convict from 'convict';

export interface configSchema {
    statusChannel: string;
    namespace: string;
    token: string;
    deployment: string;
};

const schema = {
    statusChannel: {
        doc: 'channel to send status message to',
        default: '716384408642388059', //playground on copa
        format: String,
        env: 'STATUS_CHANNEL',
    },
    token:{
        doc: 'discord bot token',
        required: true,
        format: String,
        env: 'DISCORD_BOT_TOKEN',
        default: null as any as string
    },
    namespace: {
        doc: 'namespace where minecraft is running',
        required: true,
        format: String,
        env: 'POD_NAMESPACE',
        default: null as any as string
    },
    deployment: {
        doc: 'minecraft deployment name',
        required: true,
        format: String,
        env: 'DEPLOYMENT_NAME',
        default: null as any as string
    },
    backupPrefix: {
        doc: 'minecraft backup name prefix',
        required: true,
        format: String,
        env: 'BACKUP_NAME',
        default: null as any as string
    },
    gdriveDirectory: {
        doc: 'directory id to place new backups',
        required: true,
        format: String,
        env: 'GDRIVE_DIR',
        default: null as any as string
    }
    // ,
    // gdriveClientId: {
    //     doc: 'gdrive client id for oauth',
    //     required: true,
    //     format: String,
    //     env: 'GDRIVE_CLIENT_ID',
    //     default: null as any as string
    // },
    // gdriveClientSecret: {
    //     doc: 'gdrive client secret for oauth',
    //     required: true,
    //     format: String,
    //     env: 'GDRIVE_CLIENT_SECRET',
    //     default: null as any as string
    // },
    // gdriveRedirectUris: {
    //     doc: 'gdrive client secret for oauth',
    //     required: true,
    //     format: String,
    //     env: 'GDRIVE_CLIENT_SECRET',
    //     default: null as any as string
    // }
}

export const config = convict(schema);