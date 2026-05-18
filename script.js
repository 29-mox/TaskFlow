document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let allTasks = [];
    let currentFilter = 'all';

    const fetchTasks = async () => {
        try {
            const res = await fetch('api.php?action=list');
            allTasks = await res.json();
            renderTasks();
        } catch (error) {
            console.error("Erreur lors du chargement :", error);
        }
    };

    const renderTasks = () => {
        const filtered = allTasks.filter(task => {
            if (currentFilter === 'active') return !task.is_completed;
            if (currentFilter === 'completed') return task.is_completed;
            return true;
        });

        if (filtered.length === 0) {
            taskList.innerHTML = `<li class="empty-state">Aucune tâche trouvée...</li>`;
            return;
        }

        taskList.innerHTML = filtered.map(task => `
            <li class="task-item ${task.is_completed ? 'completed' : ''}" id="task-${task.id}">
                <span onclick="toggleTask(${task.id})">${task.task_text}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Supprimer</button>
            </li>
        `).join('');
    };

    window.toggleTask = async (id) => {
        // UI Optimiste : on change visuellement tout de suite
        const task = allTasks.find(t => t.id === id);
        if (task) {
            task.is_completed = !task.is_completed;
            renderTasks();
        }

        await fetch('api.php?action=toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
    };

    window.deleteTask = async (id) => {
        if (!confirm('Supprimer cette tâche ?')) return;

        const element = document.getElementById(`task-${id}`);
        if (element) {
            element.classList.add('removing');
            
            // On attend la fin de l'animation CSS (300ms) avant de supprimer en BDD
            setTimeout(async () => {
                const res = await fetch('api.php?action=delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                if (res.ok) fetchTasks();
            }, 300);
        }
    };

    addBtn.onclick = async () => {
        const text = input.value.trim();
        if (!text) return;
        const res = await fetch('api.php?action=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: text })
        });

        if (res.ok) {
            input.value = '';
            fetchTasks();
        } else {
            alert("Erreur lors de l'ajout de la tâche");
        }
    };

    input.onkeypress = (e) => { if (e.key === 'Enter') addBtn.click(); };

    fetchTasks();
});
