import * as k8s from '@jkcfg/kubernetes/api';

const labels = {
    app: 'discord-manager'
};

const discordManagerRole = new k8s.rbac.v1.Role('discord-manager', {
    metadata: {
        labels
    },
    rules: [
        {
            apiGroups: [""],
            resources: ["configmaps"],
            verbs: ["get", "list", "watch"]
        },
        {
            apiGroups: [""],
            resources: ["pods"],
            verbs: ["create"]
        }
    ]
});

const discordManagerServiceAccount = new k8s.core.v1.ServiceAccount('discord-manager', {
    metadata: { labels },
    imagePullSecrets: [ { name: 'ghcr-config' } ]
});

const discordManagerRoleBinding = new k8s.rbac.v1.RoleBinding('discord-manager',{
    metadata: { labels },
    subjects: [{
        kind: 'ServiceAccount',
        name: 'discord-manager',
        apiGroup: ''
    }],
    roleRef: {
        kind: 'Role',
        name: 'discord-manager',
        apiGroup: 'rbac.authorization.k8s.io'
    }
});

export default [
    {
        file: 'discord-manager-role.yaml',
        value: discordManagerRole
    },
    {
        file: 'discord-manager-sa.yaml',
        value: discordManagerServiceAccount
    },
    {
        file: 'discord-manager-rb.yaml',
        value: discordManagerRoleBinding
    }
];