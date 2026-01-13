export const CLIENT_ID = '683151650006-j18u5i5d90tjb5fv01lmbrsio32p569k.apps.googleusercontent.com';
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file';

let tokenClient: any;
let accessToken: string | null = null;

// ... existing initGoogleAuth and requestAccessToken ... 
// (I will retain them by targeting carefully or just replacing the top block and appending functions)

export const initGoogleAuth = (callback: (token: string) => void) => {
    if (typeof window === 'undefined' || !(window as any).google) return;

    tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
            if (response.access_token) {
                accessToken = response.access_token;
                if (accessToken) callback(accessToken);
            }
        },
    });
};

export const requestAccessToken = () => {
    if (tokenClient) {
        tokenClient.requestAccessToken();
    } else {
        console.error('Token Client not initialized');
    }
};

// -- DRIVE FUNCTIONS --

const findFolder = async (name: string, parentId = 'root') => {
    if (!accessToken) throw new Error('No access token');
    const q = `mimeType='application/vnd.google-apps.folder' and name='${name}' and '${parentId}' in parents and trashed=false`;
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await response.json();
    return data.files?.[0]; // Return first match or undefined
};

const createFolder = async (name: string, parentId = 'root') => {
    if (!accessToken) throw new Error('No access token');
    const metadata = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId]
    };
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
    });
    return response.json();
};

const getAggAssetsFolderId = async () => {
    // 1. Find or Create "AGG Store" in root
    let aggFolder = await findFolder('AGG Store');
    if (!aggFolder) {
        aggFolder = await createFolder('AGG Store');
    }

    // 2. Find or Create "assets" in "AGG Store"
    let assetsFolder = await findFolder('assets', aggFolder.id);
    if (!assetsFolder) {
        assetsFolder = await createFolder('assets', aggFolder.id);
    }

    return assetsFolder.id;
};

export const uploadImageToDrive = async (file: File) => {
    if (!accessToken) throw new Error('No access token');

    const folderId = await getAggAssetsFolderId();

    // Multipart upload
    const metadata = {
        name: file.name,
        parents: [folderId]
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: form
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Upload failed');
    }

    const data = await response.json();

    // Set permission to anyoneReader (Public)
    await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            role: 'reader',
            type: 'anyone'
        })
    });

    // Use webContentLink for direct download/display if possible, or webViewLink
    // For <img> tags, we typically need a direct link. 
    // Google Drive hosting for images is tricky. 
    // webContentLink works for download. 
    // Usually `https://lh3.googleusercontent.com/d/${data.id}` is the trick for images, 
    // but the API returns webContentLink. 
    // Let's rely on the ID to construct a reliable thumbnail link:
    // https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000

    // Actually, let's use the official 'webContentLink' but strip the &export=download if present,
    // Or simpler: construct a thumbnail URL which is robust for images.
    return `https://drive.google.com/thumbnail?id=${data.id}&sz=w1920`;
};


export const appendRow = async (spreadsheetId: string, rowData: any) => {
    if (!accessToken) throw new Error('No access token');

    const values = [
        [
            rowData.id,
            rowData.name,
            rowData.price,
            rowData.category,
            rowData.image,
            Array.isArray(rowData.images) ? rowData.images.join(',') : '', // Handle images array
            Array.isArray(rowData.sizes) ? rowData.sizes.join(',') : rowData.sizes,
            Array.isArray(rowData.colors) ? rowData.colors.join(',') : rowData.colors,
            rowData.description
        ]
    ];

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:I:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            values: values
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error.message);
    }

    return response.json();
};

// Simple update (delete + append fallback for MVP - real update requires finding row index)
// For this MVP, we will only support "Add". Edit requires fetching all rows to find index.
export const findRowIndex = async (spreadsheetId: string, productId: string) => {
    if (!accessToken) throw new Error('No access token');
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:A`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    const rows = data.values || [];
    // Assuming ID is column A (index 0)
    return rows.findIndex((r: string[]) => r[0] === productId); // Returns -1 if not found. API indices are 1-based, but array is 0-based.
};

export const updateRow = async (spreadsheetId: string, rowIndex: number, rowData: any) => {
    if (!accessToken) throw new Error('No access token');
    const range = `Sheet1!A${rowIndex + 1}:I${rowIndex + 1}`; // +1 because Sheet API is 1-based

    const values = [
        [
            rowData.id,
            rowData.name,
            rowData.price,
            rowData.category,
            rowData.image,
            Array.isArray(rowData.images) ? rowData.images.join(',') : '',
            Array.isArray(rowData.sizes) ? rowData.sizes.join(',') : rowData.sizes,
            Array.isArray(rowData.colors) ? rowData.colors.join(',') : rowData.colors,
            rowData.description
        ]
    ];

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            values: values
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error.message);
    }
    return response.json();
};

export const deleteRow = async (_spreadsheetId: string, _rowIndex: number) => {
    if (!accessToken) throw new Error('No access token');

    // Note: Deleting rows shifts others up. This is complex with batchUpdate.
    // For MVP, enable ADD and EDIT. Delete is high risk without rigid ID tracking.
    // We will skip Delete implementation for this simple step to avoid data corruption.
    throw new Error("Delete not supported in this version. Please delete from Sheet directly.");
};
