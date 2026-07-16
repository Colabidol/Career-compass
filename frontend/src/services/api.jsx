const API = "http://127.0.0.1:8000";

export async function getGoals() {
    const res = await fetch(`${API}/goals`);
    return await res.json();
}

export async function createTask(task) {
    const res = await fetch(`${API}/goals`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    return await res.json();
}

export async function updateTask(id, task) {
    const res = await fetch(`${API}/goals/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    return await res.json();
}

export async function markTaskComplete(id, completed = true) {
    const res = await fetch(`${API}/goals/${id}/complete`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
    });

    return await res.json();
}

export async function deleteTask(id) {
    await fetch(`${API}/goals/${id}`, {
        method: "DELETE",
    });
}