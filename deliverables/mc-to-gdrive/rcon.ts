import { Exec, KubeConfig } from '@kubernetes/client-node';
import * as stream from 'stream';

/**
 * run an rcon command in a mc container
 * @param command the command to execute
 * @param kc kube config for the cluster
 * @param namespace namespace where the pod is
 * @param pod name of pod
 * @param container container in pod to execute command in
 */
export function executeRCONCommand(command: string, kc: KubeConfig, namespace: string, pod:string, container: string): Promise<any> {
    const exec = new Exec(kc);
    return exec.exec(
        namespace, 
        pod, 
        container, 
        ['rcon-cli', command],
        process.stdout as stream.Writable, 
        process.stderr as stream.Writable, 
        process.stdin as stream.Readable,
        true /* tty */
    );
}