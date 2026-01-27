import qs from "query-string"

interface URLQueryParams {
    params: string;
    key: string;
    value: string;
}

interface RemoveUrlQueryParams {
    params: string;
    keysToRemove: string[];

}

export const formUrlQuery = ({params, key, value}: URLQueryParams) => {
    // This function will update the URL query params with a new value
    // We're accepting "params" cuz we want to know the existing params taht it has so we can append the new key and value to it

    const queryString = qs.parse(params);

    queryString[key] = value;

    return qs.stringifyUrl({
        url: window.location.pathname,
        query: queryString,
    });
}


export const removeKeysFromUrlQuery = ({params, keysToRemove}: RemoveUrlQueryParams) => {
    // This function will update the URL query params with a new value
    // We're accepting "params" cuz we want to know the existing params taht it has so we can append the new key and value to it

    const queryString = qs.parse(params);

    keysToRemove.forEach((key) => {
        delete queryString[key]
    })

    return qs.stringifyUrl(
        {
        url: window.location.pathname,
        query: queryString,
        },
        {skipNull: true} // This option guarantee that the query will be set to empty string instead of null
    );
}