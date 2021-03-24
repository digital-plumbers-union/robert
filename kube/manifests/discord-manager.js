import * as k8s from '@jkcfg/kubernetes/api';
import * as std from '@jkcfg/std';
import { resolve } from 'path';
const labels = {
    app: 'discord-manager'
};
const discordManagerDeployment = (image) => new k8s.apps.v1.Deployment('discord-manager', {
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
                containers: [{
                        image,
                        name: 'manager'
                    }]
            }
        }
    }
});
std.write(discordManagerDeployment('test-imag:latest'), resolve(__dirname, 'generated', 'test-discord-manager.yaml'));
