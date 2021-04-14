import * as k8s from '@jkcfg/kubernetes/api';
import * as std from '@jkcfg/std';
import * as param from '@jkcfg/std/param';

const labels = {
    app: 'discord-manager'
};

const params = {
    image: param.String('image', 'ghcr.io/digital-plumbers-union/robert/discord-manager'),
    tag: param.String('tag', 'dev'),
    dir: param.String('port', './generated'),
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
                containers: [{
                    image,
                    name: 'manager'
                }]
            }
        }
    }
});


std.write(discordManagerDeployment(`${params.image}:${params.tag}`),  `${params.dir}/test-discord-manager.yaml`);
console.log('hi');