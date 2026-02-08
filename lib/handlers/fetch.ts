import { ActionResponse } from "@/types/global";
import logger from "../logger";
import handleError from "./error";
import { RequestError } from "../http-errors";



interface FetchOptions extends RequestInit {
    timeout?: number;
}

function isError(error: unknown): error is Error {
    return error instanceof Error;
}

// Creating a centralized handler to make all API calls
export async function fetchHandler<T>(url: string, options: FetchOptions = {}): Promise<ActionResponse<T>> {

    const { 
        timeout = 5000, 
        headers: customHeaders = {}, 
        ...restOptions 
    } = options;

    // Controller to handle request and abort it based on timeout
    const controller = new AbortController();
    // start timer for timeout
    const id = setTimeout(() => controller.abort(), timeout) // We need the id of the setTimeout so we can later clear it

    const defaultHeaders: HeadersInit = {
        "Content-type": "application/json",
        Accept: "application/json"
    };

    const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };

    const config: RequestInit = {
        ...restOptions,
        headers,
        signal: controller.signal, // This is a signal to support the request cancellation
    }

    try {
        const response = await fetch(url, config);

        clearTimeout(id);  // clear timeout if request is made

        if(!response.ok) {
            throw new RequestError(response.status, `HTTP error: ${response.status}`);
        }

        return await response.json()
        
    } catch (err) {
        const error = isError(err) ? err : new Error("Unknown error");

        // if request timesout
        if (error.name === "AbortError") {
            logger.warn(`Request to ${url} timed out`);
        } else {
            logger.error(`Error fetching ${url}: ${error.message}`)
        }

        return handleError(error) as ActionResponse<T>;
    }

}


