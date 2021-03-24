import { Client } from 'discord.js';
import { config } from './config';
import { CoreV1Api, KubeConfig, V1ConfigMap, Watch } from '@kubernetes/client-node';

const kc = new KubeConfig();
kc.loadFromDefault();
const coreApi = kc.makeApiClient(CoreV1Api);

config.validate({ allowed: 'strict'});
const client = new Client();
const inflatedConfig = config.getProperties();

const watcher = new Watch(kc);
watcher.watch('/api/v1/configmaps', {
    labelSelector: 'discord-event=true'
}, (type, apiObject: V1ConfigMap) => {
    if (type === 'ADDED') {
        const reg = new RegExp(apiObject.data!.match);
        client.on(apiObject.data!.event, async message => {
            if (reg.test(message.content)) {
                await coreApi.createNamespacedPod(apiObject.metadata!.namespace || 'default', {
                    metadata: {
                        name: `${apiObject.metadata!.name}-${Math.random() * 99999999}`,
                        labels: {
                            'discord-event': 'true'
                        }
                    },
                    spec: {
                        containers: [
                            {
                                name: 'main',
                                image: apiObject.data!.image,
                                env: [
                                    {
                                        name: 'CHANNEL',
                                        value: message.channel.id
                                    }
                                ]
                            }
                        ] 
                    }
                })
            }
        });
        console.log('setup action for ' + apiObject.metadata!.name);
    }
}, err => {
    console.error(err);
});

client.on("ready", async () => {
    console.log('running');
    const swamp: any = await client.channels.fetch(inflatedConfig.startupChannel);
    swamp.send('app server go brrr');
});

client.login(inflatedConfig.token);