// We're using classes cuz they will help us to keep our error types organized
// We're defining a base class which can then extended on other classes

export class RequestError extends Error {
    statusCode: number;
    errors?: Record<string, string[]>;

    constructor(
        statusCode: number, 
        message: string, 
        errors?: Record<string, string[]>
    ) {
        super(message); // Just passing the message to the parent class (Error)
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = "RequestError";
    }
}

export class ValidationError extends RequestError {

    constructor(fieldErrors: Record<string, string[]>){
        const message = ValidationError.formatFieldErrors(fieldErrors);
        super(400, message, fieldErrors);
        this.name = "ValidationError";
        this.errors = fieldErrors;
    }

    // This method takes  a record of field errors as input and returns a formatted string
    static formatFieldErrors(errors: Record<string, string[]>): string {
        const formattedMessages = Object.entries(errors).map(
            ([field, messages]) => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1);  // Just uppercasing the fieldname

            if(messages[0] === 'Required') {
                return `${fieldName} is required`;
            } else {
                return messages.join(" and ");
            }
        });

        return formattedMessages.join(", ")
    }
};

export class NotFoundError extends RequestError {

    constructor(resource: string) {
        super(404, `${resource} not found`);
        this.name = "NotFoundError";
    }
}

export class ForbiddenError extends RequestError {
    constructor(message: string = 'Forbidden') {
        super(403, message);
        this.name = "ForbiddenError";
    }
}

export class UnauthorizedError extends RequestError {
    constructor(message: string = 'Unauthorized') {
        super(401, message);
        this.name = "UnauthorizedError";
    }
}