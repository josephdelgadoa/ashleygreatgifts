export const CLIENT_ID = '683151650006-j18u5i5d90tjb5fv01lmbrsio32p569k.apps.googleusercontent.com';
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient: any;
let accessToken: string | null = null;

export const initGoogleAuth = (callback: (token: string) => void) => {
    if (typeof window === 'undefined' || !(window as any).google) return;

    tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
            if (response.access_token) {
                accessToken = response.access_token;
                callback(accessToken);
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

export const appendRow = async (spreadsheetId: string, rowData: any) => {
    if (!accessToken) throw new Error('No access token');

    const values = [
        [
            rowData.id,
            rowData.name,
            rowData.price,
            rowData.category,
            rowData.image,
            Array.isArray(rowData.sizes) ? rowData.sizes.join(',') : rowData.sizes,
            Array.isArray(rowData.colors) ? rowData.colors.join(',') : rowData.colors,
            rowData.description
        ]
    ];

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:H:append?valueInputOption=USER_ENTERED`, {
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
    const range = `Sheet1!A${rowIndex + 1}:H${rowIndex + 1}`; // +1 because Sheet API is 1-based

    const values = [
        [
            rowData.id,
            rowData.name,
            rowData.price,
            rowData.category,
            rowData.image,
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

export const deleteRow = async (spreadsheetId: string, rowIndex: number) => {
    if (!accessToken) throw new Error('No access token');

    // Note: Deleting rows shifts others up. This is complex with batchUpdate.
    // For MVP, enable ADD and EDIT. Delete is high risk without rigid ID tracking.
    // We will skip Delete implementation for this simple step to avoid data corruption.
    throw new Error("Delete not supported in this version. Please delete from Sheet directly.");
};
