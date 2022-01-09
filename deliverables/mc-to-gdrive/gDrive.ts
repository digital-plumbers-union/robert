import { createReadStream } from 'fs';
import { drive_v3, google } from 'googleapis';

export function serviceAccountLogin(): any {
    return new google.auth.GoogleAuth({
        keyFile: '/secrets/sa.json',
        scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.appdata'],
      });
}

export function uploadTar(path: string, auth: any, parentId: string, namePrefix: string): Promise<any> {
    const drive = google.drive({version: 'v3', auth});
    const mimeType = 'application/gzip';
    return drive.files.create({
        requestBody: {
            name: namePrefix + '-' + (new Date()).toISOString() + '.tar.gz',
            mimeType,
            parents: [parentId]
        },
        media: {
            mimeType,
            body: createReadStream(path)
        }
    })
}

export async function listTars(auth: any): Promise<{ data: drive_v3.Schema$FileList }> {
    const drive = google.drive({version: 'v3', auth});
    return drive.files.list({
        includeItemsFromAllDrives: true,
        supportsAllDrives: true
    });
}

export async function deleteFile(auth: any, id: string):Promise<unknown> {
    const drive = google.drive({version: 'v3', auth});
    return drive.files.delete({
        fileId: id,
        supportsAllDrives: true
    });
}

export async function removeOldTars(auth: any, namePrefix: string) {
    const { data } = await listTars(auth);
    if (data.files) {
        const allTarsInDescending = data.files
            .filter((file) => file.name && file.name.startsWith(namePrefix))
            .sort((a, b) => {
                let compareResult = 0;
                if (a.name! < b.name!) {
                    compareResult = 1;
                } else if (a.name! > b.name!) {
                    compareResult = -1;
                }
                return compareResult;
            });
        if (allTarsInDescending.length > 5) {
            const filesToDelete = allTarsInDescending.slice(5);
            const promises = filesToDelete.map(file => {
                console.log(`deleting file: ${file.name}`);
                return deleteFile(auth, file.id!)
            });
            await Promise.all(promises);
        }
    }
}