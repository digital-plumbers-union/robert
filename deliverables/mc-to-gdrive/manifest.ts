import * as k8s from '@jkcfg/kubernetes/api';

const podSpec = {
    spec: {
        restartPolicy: 'Never',
        volumes: [{
            name: 'google-sa',
            secret: {
                secretName: 'google-sa'
            }
        },
        {
            name: 'datadir',
            persistentVolumeClaim: {
                claimName: 'thpm3-minecraft-data'
            }
        }],
        serviceAccount: 'cron',
        imagePullSecrets: [{ name: 'ghcr-config' }],
        containers: [{
            name: 'backup',
            image: 'ghcr.io/digital-plumbers-union/robert/mc-to-gdrive',
            volumeMounts: [{
                name: 'google-sa',
                mountPath: '/secrets'
            },
            {
                name: 'datadir',
                mountPath: '/data'
            }],
            envFrom: [
                {
                    secretRef: {
                        name: 'discord-token'
                    }
                },
                {
                    secretRef: {
                        name: 'backup-context'
                    }
                }
            ],
            env: [{
                    name: 'POD_NAMESPACE',
                    valueFrom: {
                        fieldRef: {
                            fieldPath: 'metadata.namespace'
                        }
                    }
                }, 
                {
                    name: 'DEPLOYMENT_NAME',
                    value: 'thpm3-minecraft'
                }, 
                {
                    name: 'BACKUP_NAME',
                    value: 'thpm3-backup'
                }, 
                {
                    name: 'GOOGLE_APPLICATION_CREDENTIALS',
                    value: '/secrets/sa.json'
                }
            ]
        }]
    }
};

const cronSpec = new k8s.batch.v1beta1.CronJob('mc-backup', {
    spec: {
        schedule: '5 9 * * 0,2,4',
        failedJobsHistoryLimit: 1,
        concurrencyPolicy: 'Forbid',
        jobTemplate: {
            spec:{
                backoffLimit: 0,
                template: podSpec
            }
        }
    }
})

export default [{
    file: 'config.yaml',
    value: cronSpec
}];