import { execSync } from 'child_process';
import { parse } from 'ndjson';
import { resolve } from 'path';
import { Readable } from 'stream'
import { GH_CONTAINER_REGISTRY, GH_OWNER, ROBERT_COMMAND_PREPEND, WORKSPACE_NAMESPACE } from './constants';
import { discordManagerDeployment } from '../kube/manifests/discord-manager';
interface Workspace {
    name: string;
    location: string;
}

const parseWorkspace = async (workspaceName: string): Promise<Workspace> => {
    let workspace: Workspace | undefined = undefined;
    const resp = execSync('yarn workspaces list --json');
    const readable = new Readable()
    readable._read = () => {} // _read is required but you can noop it
    readable.push(resp)
    readable.push(null)
    return new Promise((resolve, reject) => {
        readable
            .pipe(parse())
            .on('data', (inputWorkspace: Workspace) => {
                if (inputWorkspace.name === workspaceName) {
                    workspace = inputWorkspace;
                }
            })
            .on('error', reject)
            .on('end', () => resolve(workspace));
        
    });
}

const run = async  (
    workspaceName = process.argv[2]!
) => {
    const workspace = await parseWorkspace(workspaceName);
    if (workspace.name.includes(WORKSPACE_NAMESPACE)) {
        const removedNamespaceWorkspace = workspace.name
            .substring(WORKSPACE_NAMESPACE.length + 1)
            .replace(/\//g, '-');

        const dockerImage = `${GH_CONTAINER_REGISTRY}/${GH_OWNER}/${ROBERT_COMMAND_PREPEND}-${removedNamespaceWorkspace}`;
        const gitSha = execSync('git rev-parse HEAD', {
            encoding: 'utf-8'
        }).replace('\n', '');
        const tag = `${dockerImage}:${gitSha}`;
        execSync(`ls && docker build --build-arg workspace_name=\"${workspace.name}\" --build-arg workspace_path=${workspace.location} --tag ${tag} .`, {
            cwd: resolve(__dirname, '..'),
            stdio: 'inherit'
        });

        discordManagerDeployment(tag);
    }
};

run();