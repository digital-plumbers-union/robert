import { Client } from 'discord.js';
import { config } from './config';
import { CoreV1Api, KubeConfig } from '@kubernetes/client-node';
import tar from 'tar-fs';
import zlib from 'zlib';
import { createWriteStream, unlinkSync } from 'fs';

import { removeOldTars, serviceAccountLogin, uploadTar } from "./gDrive";

import { executeRCONCommand } from './rcon';

const sanitySleep = () => new Promise((resolve) => setTimeout(resolve, 15000));

try {
    const client = new Client();
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const coreApi = kc.makeApiClient(CoreV1Api);
    console.log('client created');
    config.validate({ allowed: 'strict'});
    const inflatedConfig = config.getProperties();

    client.on("ready", async () => {
        console.log('connected to discord');
        await run(client).catch(e => {
            console.log(e);
            process.exit(1);
        });    
    });

    client.login(inflatedConfig.token);

    const run = async (client: Client) => {
        let passed = true;
        const pods = await coreApi.listNamespacedPod(inflatedConfig.namespace);
        console.log('got pods');
        const pod = pods.body.items.find(pod => pod.metadata?.name!.startsWith(inflatedConfig.deployment))!;
        console.log(`pod: ${pod.metadata?.name}`);
        const swamp: any = await client.channels.fetch(inflatedConfig.statusChannel);
        try {
            console.log('executing rcon command');
            await executeRCONCommand('save-off', kc, inflatedConfig.namespace, pod.metadata?.name!)
            await executeRCONCommand('save-all', kc, inflatedConfig.namespace, pod.metadata?.name!)
            console.log('building tar')
            await sanitySleep();
            await new Promise((resolve, reject) => tar.pack('/data')
                .pipe(zlib.createGzip())
                .pipe(createWriteStream('data-backup-data.tar.gz'))
                .on('finish', resolve)
                .on('close', resolve)
                .on('error', reject));
            const serviceAccountAuth = serviceAccountLogin();
            console.log('logged in');
            console.log('uploading tar');
            await uploadTar('./data-backup-data.tar.gz', serviceAccountAuth, inflatedConfig.gdriveDirectory, inflatedConfig.backupPrefix)
            unlinkSync('./data-backup-data.tar.gz');
            console.log('cleanup old tars');
            await removeOldTars(serviceAccountAuth, inflatedConfig.backupPrefix);
            console.log('done');
            swamp.send('beep boop tony hawk pro miner has been backed up');
        } catch (e) {
            console.log('fuck')
            console.log(e);
            console.log(JSON.stringify(e, null, 2));
            passed = false;
            await swamp.send('beep boop tony hawk pro miner has NOT been backed up');
        } finally {
            console.log('turning save back on');
            await executeRCONCommand('save-on', kc, inflatedConfig.namespace, pod.metadata?.name!)
            process.exit(passed ? 0 : 1);
        }
    }
} catch(e) {
    console.log(e);
    process.exit(1);
}