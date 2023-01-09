import {getConfig} from "../config";

export const apiHelper = {
    callApi: async (getAccessTokenSilently, options) => {
        const config = getConfig()
        const accessToken = await getAccessTokenSilently({
            audience: config.audience,
            scope: "read:current_user",
        });
        
        const requestOptions = {
            method: options.method,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(options.request)
        }
        
        fetch(options.url, requestOptions)
            .then(response => response.json())
            .then(options.successCallback)
            .catch(err => options.errorCallback(err))
    }
}

export const { callApi } = apiHelper;
