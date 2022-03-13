import { randomUUID } from "crypto";

export const createMessage = (type, user, message, timestamp = Date.now()) => {
    return {
        id: randomUUID(),
        type,
        user,
        message,
        timestamp
    };
}

export const createShapeMessage = (user, message, timestamp = Date.now()) => {
    return {
        id: randomUUID(),
        type: "shape",
        user,
        message,
        timestamp
    };
}
 
export default { createMessage, createShapeMessage };