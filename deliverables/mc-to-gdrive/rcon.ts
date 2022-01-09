import { Exec, KubeConfig } from '@kubernetes/client-node';
import * as stream from 'stream';


export function executeRCONCommand(command: string, kc: KubeConfig, namespace: string, pod:string): Promise<any> {
    const exec = new Exec(kc);
    return exec.exec(namespace, pod, 'thpm3-minecraft', ['rcon-cli', command],
    process.stdout as stream.Writable, process.stderr as stream.Writable, process.stdin as stream.Readable,
    true /* tty */)

}