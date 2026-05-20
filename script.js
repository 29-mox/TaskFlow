document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('task-input');
    const dateInput = document.getElementById('task-date');
    const helpBtn = document.getElementById('help-btn');
    const helpBox = document.getElementById('help-box');
    const progressBar = document.getElementById('progress-bar');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const sortBtns = document.querySelectorAll('.sort-btn');

    let allTasks = [];
    let currentSort = 'created';
    let editingId = null;

    // Gestion de l'affichage de l'aide
    if (helpBtn && helpBox) {
        helpBtn.addEventListener('click', () => {
            helpBox.classList.toggle('active');
        });
    }

    // Fermer la boîte d'aide si l'on clique en dehors
    document.addEventListener('click', (event) => {
        // Vérifie si le clic n'est ni sur le bouton d'aide, ni à l'intérieur de la boîte d'aide
        if (helpBox && helpBtn && !helpBox.contains(event.target) && !helpBtn.contains(event.target)) {
            // Si la boîte d'aide est ouverte, on la ferme
            if (helpBox.classList.contains('active')) {
                helpBox.classList.remove('active');
            }
        }
    });

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Suppression automatique après 3 secondes
        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    };

    const fetchTasks = async () => {
        try {
            const res = await fetch('api.php?action=list');
            const data = await res.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Conversion sécurisée des types
            allTasks = Array.isArray(data) ? data.map(t => ({
                ...t,
                id: Number(t.id),
                is_completed: Number(t.is_completed) === 1
            })) : [];
            renderTasks();
        } catch (error) {
            console.error("Erreur lors du chargement :", error);
            taskList.innerHTML = `<li class="empty-state" style="color: var(--danger)">
                ⚠️ ${error.message || "Erreur de connexion au serveur"}
            </li>`;
        }
    };

    const renderTasks = () => {
        // Calculer si une tâche est imminente (moins d'une heure avant l'échéance)
        const now = new Date();
        const processedTasks = allTasks.map(task => {
            const t = { ...task };
            if (t.due_at && !t.is_completed) {
                const dueDate = new Date(t.due_at);
                const timeDiff = dueDate.getTime() - now.getTime(); // Différence en millisecondes
                if (timeDiff > 0 && timeDiff <= 3600000) { // Si dans le futur et moins d'une heure
                    t.is_imminent = true;
                }
                // Vérifier si la date est dépassée (et la tâche n'est pas complétée)
                if (timeDiff < 0) {
                    t.is_overdue = true;
                }
            }
            return t;
        });

        // Mettre à jour la barre de progression
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(task => task.is_completed).length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }

        // Logique de tri
        processedTasks.sort((a, b) => {
            if (currentSort === 'due') {
                // Les tâches sans date vont à la fin
                if (!a.due_at) return 1;
                if (!b.due_at) return -1;
                return new Date(a.due_at) - new Date(b.due_at);
            } else {
                // Tri par date de création (décroissant par défaut)
                return new Date(b.created_at) - new Date(a.created_at);
            }
        });

        if (processedTasks.length === 0) {
            taskList.innerHTML = `<li class="empty-state">Aucune tâche trouvée...</li>`;
            return;
        }

        taskList.innerHTML = processedTasks.map(task => `
            <li class="task-item ${task.is_completed ? 'completed' : ''} ${editingId === task.id ? 'editing' : ''}" id="task-${task.id}">
                ${editingId === task.id ? `
                    <div class="edit-container">
                        <input type="text" id="edit-text-${task.id}" value="${task.task_text}">
                        <input type="datetime-local" id="edit-date-${task.id}" value="${task.due_at ? task.due_at.replace(' ', 'T') : ''}">
                    </div>
                    <div class="btn-group">
                        <button class="delete-btn" onclick="saveEdit(${task.id})" title="Enregistrer">💾</button>
                        <button class="delete-btn" onclick="cancelEdit()" title="Annuler">❌</button>
                    </div>
                ` : `
                    <div class="task-content" onclick="toggleTask(${task.id})">
                        ${task.is_imminent ? `<span class="imminent-icon" title="Échéance proche !">⚠️</span>` : ''}
                        <span class="task-text ${task.is_overdue ? 'overdue' : ''}">${task.task_text}</span>
                        ${task.due_at ? `
                            <small class="task-due">
                                📅 ${new Date(task.due_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                            </small>` : ''}
                    </div>
                    <div class="btn-group">
                        <button class="delete-btn" onclick="startEdit(${task.id})" title="Modifier">✏️</button>
                        <button class="delete-btn danger" onclick="deleteTask(${task.id})" title="Supprimer">🗑️</button>
                    </div>
                `}
            </li>
        `).join('');
    };

    window.startEdit = (id) => {
        editingId = id;
        renderTasks();
    };

    window.cancelEdit = () => {
        editingId = null;
        renderTasks();
    };

    window.saveEdit = async (id) => {
        const newText = document.getElementById(`edit-text-${id}`).value.trim();
        const newDate = document.getElementById(`edit-date-${id}`).value;

        if (!newText) {
            showToast("Le texte ne peut pas être vide", "error");
            return;
        }

        const res = await fetch('api.php?action=edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, task: newText, due_at: newDate })
        });

        if (res.ok) {
            editingId = null;
            showToast("Tâche mise à jour !");
            fetchTasks();
        } else {
            showToast("Erreur lors de la mise à jour", "error");
        }
    };

    window.toggleTask = async (id) => {
        // UI Optimiste : on change visuellement tout de suite
        const task = allTasks.find(t => t.id === Number(id));
        if (task) {
            task.is_completed = !task.is_completed;
            renderTasks();
        }

        const res = await fetch('api.php?action=toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (!res.ok) fetchTasks(); // En cas d'erreur serveur, on recharge la vraie liste
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
        const due_at = dateInput ? dateInput.value : null;
        if (!text) return;
        const res = await fetch('api.php?action=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: text, due_at: due_at })
        });

        if (res.ok) {
            input.value = '';
            if (dateInput) {
                dateInput.value = '';
                dateInput.type = 'text';
            }
            showToast("🚀 Tâche ajoutée avec succès !");
            fetchTasks();
        } else {
            showToast("❌ Erreur lors de l'ajout", "error");
        }
    };

    input.onkeypress = (e) => { if (e.key === 'Enter') addBtn.click(); };

    fetchTasks();
});
