import { createCommand } from '../../kube/manifests/command';
export default [{
    file: 'config.yaml',
    value: createCommand('ping', 'ghcr.io/digital-plumbers-union/robert/ping', '^!ping', 'message')
}];