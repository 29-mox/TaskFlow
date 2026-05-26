document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('task-input');
    const dateInput = document.getElementById('task-date');
    const helpBtn = document.getElementById('help-btn');
    const langToggleBtn = document.getElementById('lang-toggle-btn'); // New language button
    const helpBox = document.getElementById('help-box');
    const searchInput = document.getElementById('search-input');
    const progressBar = document.getElementById('progress-bar');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const appCard = document.querySelector('.app-card');

    const translations = {
        fr: {
            appTitle: "🚀 TaskFlow",
            appSubtitle: "Simplifiez votre productivité",
            helpTitle: "📝 Comment ajouter une tâche :",
            helpStep1: "Saisissez l'intitulé de votre tâche dans le premier champ.",
            helpStep2: "Cliquez sur \"Date d'échéance\" pour définir un rappel (optionnel).",
            helpStep3: "Appuyez sur \"Ajouter\" ou sur la touche Entrée.",
            helpTooltip: "Besoin d'aide ?",
            inputPlaceholder: "Ajouter une tâche...",
            datePlaceholder: "Date d'échéance",
            addButton: "Ajouter",
            searchPlaceholder: "Rechercher une tâche...",
            emptyState: "Aucune tâche trouvée...",
            serverError: "Erreur de connexion au serveur",
            save: "Enregistrer",
            cancel: "Annuler",
            imminent: "Échéance proche !",
            edit: "Modifier",
            delete: "Supprimer",
            emptyText: "Le texte ne peut pas être vide",
            taskUpdated: "Tâche mise à jour !",
            updateError: "Erreur lors de la mise à jour",
            confirmDelete: "Supprimer cette tâche ?",
            taskAdded: "🚀 Tâche ajoutée avec succès !",
            addError: "❌ Erreur lors de l'ajout",
            toggleLangButton: 'EN <span class="flag-icon">🇬🇧</span>',
            error_task_required: "Le texte de la tâche est requis",
            error_invalid_data: "Données invalides",
            error_unknown_action: "Action non reconnue"
        },
        en: {
            appTitle: "🚀 TaskFlow",
            appSubtitle: "Simplify your productivity",
            helpTitle: "📝 How to add a task:",
            helpStep1: "Enter your task description in the first field.",
            helpStep2: "Click \"Due Date\" to set a reminder (optional).",
            helpStep3: "Press \"Add\" or the Enter key.",
            helpTooltip: "Need help?",
            inputPlaceholder: "Add a task...",
            datePlaceholder: "Due date",
            addButton: "Add",
            searchPlaceholder: "Search for a task...",
            emptyState: "No tasks found...",
            serverError: "Server connection error",
            save: "Save",
            cancel: "Cancel",
            imminent: "Deadline approaching!",
            edit: "Edit",
            delete: "Delete",
            emptyText: "Text cannot be empty",
            taskUpdated: "Task updated!",
            updateError: "Error during update",
            confirmDelete: "Delete this task?",
            taskAdded: "🚀 Task added successfully!",
            addError: "❌ Error during addition",
            toggleLangButton: 'FR <span class="flag-icon">🇫🇷</span>',
            error_task_required: "Task text is required",
            error_invalid_data: "Invalid data",
            error_unknown_action: "Unknown action"
        }
    };
    let currentLang = localStorage.getItem('lang') || 'fr';
    const t = (key) => translations[currentLang][key] || key;

    // Function to update the language button text
    const updateLangToggleButton = () => {
        if (langToggleBtn) {
            langToggleBtn.innerHTML = t('toggleLangButton');
        }
    };

    // Function to apply all static interface translations
    const applyTranslations = () => {
        const textElements = {
            'app-title': 'appTitle',
            'app-subtitle': 'appSubtitle',
            'help-title': 'helpTitle',
            'help-step-1': 'helpStep1',
            'help-step-2': 'helpStep2',
            'help-step-3': 'helpStep3',
            'add-btn': 'addButton'
        };
        for (const [id, key] of Object.entries(textElements)) {
            const el = document.getElementById(id);
            if (el) el.innerHTML = t(key);
        }

        const placeholders = {
            'task-input': 'inputPlaceholder',
            'task-date': 'datePlaceholder',
            'search-input': 'searchPlaceholder'
        };
        for (const [id, key] of Object.entries(placeholders)) {
            const el = document.getElementById(id);
            if (el) el.placeholder = t(key);
        }

        if (helpBtn) helpBtn.title = t('helpTooltip');
    };

    window.toggleLanguage = () => {
        if (appCard) appCard.classList.add('fade-out');

        setTimeout(() => {
            currentLang = currentLang === 'fr' ? 'en' : 'fr';
            localStorage.setItem('lang', currentLang);
            updateLangToggleButton();
            applyTranslations();
            renderTasks();
            if (appCard) appCard.classList.remove('fade-out');
        }, 200); // Durée synchronisée avec la transition CSS
    };


    let allTasks = [];
    let currentSearchTerm = '';
    let editingId = null;
    
    // Help display management
    if (helpBtn && helpBox) {
        helpBtn.addEventListener('click', () => {
            helpBox.classList.toggle('active');
        });
    }

    // Close the help box if clicked outside
    document.addEventListener('click', (event) => {
        // Checks if the click is neither on the help button nor inside the help box
        if (helpBox && helpBtn && !helpBox.contains(event.target) && !helpBtn.contains(event.target)) {
            // If the help box is open, close it
            if (helpBox.classList.contains('active')) helpBox.classList.remove('active');
        }
    });

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Automatic removal after 3 seconds
        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    };

    const fetchTasks = async () => {
        try {
            // Add a timestamp parameter to avoid browser caching
            const res = await fetch(`api.php?action=list&_=${Date.now()}`);
            const data = await res.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Secure type conversion
            allTasks = Array.isArray(data) ? data.map(t => ({
                ...t,
                id: Number(t.id),
                is_completed: Number(t.is_completed) === 1
            })) : [];
            renderTasks();
        } catch (error) {
            console.error("Erreur lors du chargement :", error);
            taskList.innerHTML = `<li class="empty-state" style="color: var(--danger)">
                ⚠️ ${t(error.message) || t('serverError')}
            </li>`;
        }
    };

    const renderTasks = () => {
        // Filter tasks by search term
        const searchedTasks = allTasks.filter(task =>
            task.task_text.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );

        // Calculate if a task is imminent (less than an hour before deadline)
        const now = new Date();
        const processedTasks = searchedTasks.map(task => {
            const t = { ...task };
            if (t.due_at && !t.is_completed) {
                const dueDate = new Date(t.due_at);
                const timeDiff = dueDate.getTime() - now.getTime(); // Difference in milliseconds
                if (timeDiff > 0 && timeDiff <= 3600000) { // If in the future and less than an hour
                    t.is_imminent = true;
                }
                // Check if the date is overdue (and the task is not completed)
                if (timeDiff < 0) {
                    t.is_overdue = true;
                }
            }
            return t;
        });

        // Update the progress bar
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(task => task.is_completed).length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }

        if (processedTasks.length === 0) {
            taskList.innerHTML = `<li class="empty-state">${t('emptyState')}</li>`;
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
                        <button class="delete-btn" onclick="saveEdit(${task.id})" title="${t('save')}">💾</button>
                        <button class="delete-btn" onclick="cancelEdit()" title="${t('cancel')}">❌</button>
                    </div>
                ` : `
                    <div class="task-content" onclick="toggleTask(${task.id})">
                        ${task.is_imminent ? `<span class="imminent-icon" title="${t('imminent')}">⚠️</span>` : ''}
                        <span class="task-text ${task.is_overdue ? 'overdue' : ''}">${task.task_text}</span>
                        ${task.due_at ? `
                            <small class="task-due">
                                📅 ${new Date(task.due_at).toLocaleString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'short', timeStyle: 'short' })}
                            </small>` : ''}
                    </div>
                    <div class="btn-group">
                        <button class="delete-btn" onclick="startEdit(${task.id})" title="${t('edit')}">✏️</button>
                        <button class="delete-btn danger" onclick="deleteTask(${task.id})" title="${t('delete')}">🗑️</button>
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
            showToast(t('emptyText'), "error");
            return;
        }

        const res = await fetch('api.php?action=edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, task: newText, due_at: newDate })
        });

        if (res.ok) {
            editingId = null;
            showToast(t('taskUpdated'));
            fetchTasks();
        } else {
            showToast(t('updateError'), "error");
        }
    };

    window.deleteTask = async (id) => {
        if (!confirm(t('confirmDelete'))) return;

        const element = document.getElementById(`task-${id}`);
        if (element) {
            element.classList.add('removing');
            
            // Wait for the CSS animation to finish (300ms) before deleting from DB
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
            showToast(t('taskAdded'));
            fetchTasks();
        } else {
            showToast(t('addError'), "error");
        }
    };

    input.onkeypress = (e) => { if (e.key === 'Enter') addBtn.click(); };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value;
            renderTasks();
        });
    }

    // Parallax effect on the background when scrolling
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.body.style.backgroundPositionY = `${-(scrolled * 0.2)}px`;
    }); // Initialize the language button text on load
    
    updateLangToggleButton(); // Apply initial translations
    applyTranslations();
    fetchTasks();
});
