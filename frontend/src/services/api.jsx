const API = "http://127.0.0.1:8000";

async function parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    const contentLength = response.headers.get("content-length");
    let payload = null;

    // 204/205 responses and zero-length bodies should not be parsed as JSON.
    if (response.status === 204 || response.status === 205 || contentLength === "0") {
        payload = null;
    } else if (contentType.includes("application/json")) {
        try {
            payload = await response.json();
        } catch {
            payload = null;
        }
    } else {
        const textPayload = await response.text();
        payload = textPayload ? { detail: textPayload } : null;
    }

    if (!response.ok) {
        let message = "Request failed.";

        if (payload) {
            if (typeof payload === "string") {
                message = payload;
            } else if (Array.isArray(payload.detail)) {
                message = payload.detail.map((issue) => issue.msg).join(", ");
            } else if (typeof payload.detail === "string") {
                message = payload.detail;
            } else if (typeof payload.message === "string") {
                message = payload.message;
            }
        }

        throw new Error(message);
    }

    return payload;
}

async function request(path, options = {}) {
    let response;

    try {
        response = await fetch(`${API}${path}`, options);
    } catch {
        throw new Error("Unable to connect to the server. Please try again.");
    }

    return parseResponse(response);
}

export async function getGoals() {
    return request("/goals");
}

export async function createTask(task) {
    return request("/goals", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });
}

export async function updateTask(id, task) {
    return request(`/goals/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });
}

export async function markTaskComplete(id, completed = true) {
    return request(`/goals/${id}/complete`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
    });
}

export async function deleteTask(id) {
    await request(`/goals/${id}`, {
        method: "DELETE",
    });
}