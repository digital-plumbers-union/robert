import * as k8s from '@jkcfg/kubernetes/api';

export const createCommand = (name: string, image: string, match: string, event: string) => new k8s.core.v1.ConfigMap(name, {
    metadata: {
        labels: {
            'discord-event': 'true'
        }
    },
    data: {
        match,
        image,
        event
    }
})