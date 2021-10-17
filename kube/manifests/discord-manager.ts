import * as k8s from '@jkcfg/kubernetes/api';
import * as param from '@jkcfg/std/param';

const labels = {
    app: 'discord-manager'
};

const params = {
    image: param.String('image', 'ghcr.io/digital-plumbers-union/robert/discord-manager'),
    tag: param.String('tag', 'dev'),
  };

const discordManagerDeployment = (image: string) => new k8s.apps.v1.Deployment('discord-manager', {
    metadata: {
        labels
    },
    spec: {
        selector: {
            matchLabels: labels
        },
        template: {
            metadata: {
                labels
            },
            spec: {
                serviceAccount: "discord-manager",
                containers: [{
                    image,
                    name: 'manager',
                    envFrom: [{
                        secretRef: {
                            name: 'discord-token'
                        }
                    }],
                    env: [{
                        name: 'POD_NAMESPACE',
                        valueFrom: {
                            fieldRef: {
                                fieldPath: 'metadata.namespace'
                            }
                        }
                    }]
                }],
                imagePullSecrets: [{ name: 'ghcr-config' }]
            }
        }
    }
});

export default [{
    file: 'discord-manager.yaml',
    value: discordManagerDeployment(`${params.image}:${params.tag}`)
}];