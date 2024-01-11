export const sendResponse = (res, status, message, payload = null) => {
    return res.status(status).json({
        status,
        message,
        payload,
    });
}

export const sendError = (res, message, statusCode = 500) => {
    return sendResponse(res, statusCode, message);
}

export const sendSuccess = (res, message, payload = null) => {
    return sendResponse(res, 200, message, payload);
}

export const sendUnauthorized =(res, message = 'Unauthorized') => {
    return sendError(res, message, 401);
}

export const sendBadRequest = (res, message = 'Bad Request') => {
    return sendError(res, message, 400);
}