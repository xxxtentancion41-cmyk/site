// app.js - финальная версия с оборудованием и ручным вводом

let currentProject = null;
let scenes = [];
let editingId = null;
let currentFilter = 'all';
let tempImageData = null;

// DOM elements
const scenesGrid = document.getElementById('scenesGrid');
const equipmentPanel = document.getElementById('equipmentPanel');
const totalSpan = document.getElementById('totalScenesCount');
const readySpan = document.getElementById('readyCount');
const progressSpan = document.getElementById('progressCount');
const modal = document.getElementById('sceneModal');
const projectModal = document.getElementById('projectModal');
const openBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const sceneForm = document.getElementById('sceneForm');
const modalTitle = document.getElementById('modalTitle');
const imageInput = document.getElementById('imageInput');
const imageUploadArea = document.getElementById('imageUploadArea');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');
const fullscreenViewer = document.getElementById('fullscreenViewer');
const fullscreenImage = document.getElementById('fullscreenImage');
const currentProjectName = document.getElementById('currentProjectName');
const projectsList = document.getElementById('projectsList');
const openProjectBtn = document.getElementById('openProjectBtn');
const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
const createProjectForm = document.getElementById('createProjectForm');

// ----- Вспомогательные функции -----
function getStatusPriority(status) {
    switch(status) {
        case 'pending': return 0;
        case 'progress': return 1;
        case 'ready': return 2;
        default: return 1;
    }
}

function sortScenesByStatus(sceneArray) {
    return [...sceneArray].sort((a, b) => {
        const priorityA = getStatusPriority(a.status);
        const priorityB = getStatusPriority(b.status);
        if (priorityA !== priorityB) return priorityA - priorityB;
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
}

function updateStats() {
    const total = scenes.length;
    const ready = scenes.filter(s => s.status === 'ready').length;
    const progress = scenes.filter(s => s.status === 'progress').length;
    if (totalSpan) totalSpan.innerText = total;
    if (readySpan) readySpan.innerText = ready;
    if (progressSpan) progressSpan.innerText = progress;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ----- Отрисовка сцен или оборудования -----
async function renderScenes() {
    if (!scenesGrid) return;

    if (!currentProject) {
        scenesGrid.innerHTML = `<div class="empty-state"><i class="fas fa-folder-open" style="font-size: 2rem;"></i><p>Выберите или создайте проект для начала работы</p></div>`;
        if (equipmentPanel) equipmentPanel.style.display = 'none';
        return;
    }

    if (currentFilter === 'equipment') {
        // Показать панель оборудования, скрыть сетку сцен
        if (scenesGrid) scenesGrid.style.display = 'none';
        if (equipmentPanel) {
            equipmentPanel.style.display = 'block';
            renderEquipment();
        }
        return;
    } else {
        if (scenesGrid) scenesGrid.style.display = 'grid';
        if (equipmentPanel) equipmentPanel.style.display = 'none';
    }

    let filteredScenes = scenes;
    if (currentFilter === 'ready') filteredScenes = scenes.filter(s => s.status === 'ready');
    else if (currentFilter === 'progress') filteredScenes = scenes.filter(s => s.status === 'progress');
    else if (currentFilter === 'pending') filteredScenes = scenes.filter(s => s.status === 'pending');

    const sortedScenes = sortScenesByStatus(filteredScenes);

    if (sortedScenes.length === 0) {
        scenesGrid.innerHTML = `<div class="empty-state"><i class="fas fa-camera" style="font-size: 2rem; opacity: 0.5;"></i><p>Нет сцен в проекте. Добавьте первую сцену!</p></div>`;
        return;
    }

    scenesGrid.innerHTML = sortedScenes.map(scene => {
        let statusText = '', statusClass = '';
        if (scene.status === 'ready') { statusText = 'ГОТОВО'; statusClass = 'ready'; }
        else if (scene.status === 'progress') { statusText = 'В РАБОТЕ'; statusClass = 'progress'; }
        else { statusText = 'ОЖИДАНИЕ'; statusClass = 'pending'; }

        const imageHtml = scene.imageData
            ? `<div class="scene-image-preview" data-fullimage="${scene.imageData.replace(/"/g, '&quot;')}">
                    <img src="${scene.imageData}" alt="референс сцены">
               </div>`
            : `<div class="no-image-placeholder"><i class="fas fa-image"></i> нет прикреплённого фото</div>`;

        return `
            <div class="scene-card" data-id="${scene.id}">
                <div class="card-header">
                    <span class="scene-number">${escapeHtml(scene.number) || '—'}</span>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="scene-title">${escapeHtml(scene.title)}</div>
                <div class="scene-desc">${escapeHtml(scene.description) || 'Нет описания'}</div>
                ${imageHtml}
                <div class="meta-row">
                    <span><i class="far fa-calendar-alt"></i> ${new Date(scene.createdAt).toLocaleDateString()}</span>
                    <span><i class="fas fa-tag"></i> ${scene.status}</span>
                </div>
                <div class="status-actions">
                    <button class="status-action-btn" data-action="progress" data-id="${scene.id}">В работу</button>
                    <button class="status-action-btn" data-action="ready" data-id="${scene.id}">Готово</button>
                    <button class="status-action-btn" data-action="edit" data-id="${scene.id}">Правка</button>
                    <button class="status-action-btn" data-action="delete" data-id="${scene.id}">Удалить</button>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.status-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');
            if (action === 'progress') changeStatus(id, 'progress');
            else if (action === 'ready') changeStatus(id, 'ready');
            else if (action === 'edit') openEditModal(id);
            else if (action === 'delete') deleteSceneById(id);
        });
    });

    document.querySelectorAll('.scene-image-preview').forEach(preview => {
        preview.addEventListener('click', (e) => {
            e.stopPropagation();
            const fullImg = preview.getAttribute('data-fullimage');
            if (fullImg && fullscreenImage && fullscreenViewer) {
                fullscreenImage.src = fullImg;
                fullscreenViewer.classList.add('active');
            }
        });
    });
}

function renderEquipment() {
    const container = document.getElementById('equipmentContent');
    if (!container || !currentProject) return;
    const eq = currentProject.equipment || {};
    const cameras = [...(eq.cameras || []), ...(eq.customCameras || [])];
    const lenses = [...(eq.lenses || []), ...(eq.customLenses || [])];
    const recorders = [...(eq.recorders || []), ...(eq.customRecorders || [])];
    const stabilization = [...(eq.stabilization || []), ...(eq.customStabilization || [])];

    let html = '';
    if (cameras.length) html += `<div class="eq-category"><h4><i class="fas fa-camera"></i> Камеры</h4><ul>${cameras.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul></div>`;
    if (lenses.length) html += `<div class="eq-category"><h4><i class="fas fa-eye"></i> Объективы</h4><ul>${lenses.map(l => `<li>${escapeHtml(l)}</li>`).join('')}</ul></div>`;
    if (recorders.length) html += `<div class="eq-category"><h4><i class="fas fa-tachometer-alt"></i> Рекордеры/Мониторы</h4><ul>${recorders.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul></div>`;
    if (stabilization.length) html += `<div class="eq-category"><h4><i class="fas fa-hand-peace"></i> Стабилизация</h4><ul>${stabilization.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul></div>`;
    if (!cameras.length && !lenses.length && !recorders.length && !stabilization.length) html = '<p>Оборудование не выбрано. Отредактируйте проект и добавьте технику.</p>';
    container.innerHTML = html;
}

async function changeStatus(id, newStatus) {
    const scene = scenes.find(s => s.id === id);
    if (scene) {
        scene.status = newStatus;
        await updateScene(scene);
        updateStats();
        renderScenes();
    }
}

async function deleteSceneById(id) {
    if (confirm('Удалить сцену из шотлиста? Это действие необратимо.')) {
        await deleteScene(id);
        scenes = scenes.filter(s => s.id !== id);
        if (editingId === id) resetFormAndModal();
        updateStats();
        renderScenes();
    }
}

function openEditModal(id) {
    const scene = scenes.find(s => s.id === id);
    if (!scene) return;
    editingId = scene.id;
    if (modalTitle) modalTitle.innerText = 'Редактировать сцену';
    document.getElementById('sceneNumber').value = scene.number || '';
    document.getElementById('sceneTitle').value = scene.title || '';
    document.getElementById('sceneDesc').value = scene.description || '';
    document.getElementById('sceneStatus').value = scene.status || 'pending';
    if (scene.imageData) {
        tempImageData = scene.imageData;
        imagePreview.src = scene.imageData;
        imagePreviewContainer.style.display = 'block';
    } else {
        tempImageData = null;
        imagePreviewContainer.style.display = 'none';
        imagePreview.src = '';
    }
    modal.classList.add('active');
}

function resetFormAndModal() {
    editingId = null;
    if (modalTitle) modalTitle.innerText = 'Новая сцена';
    if (sceneForm) sceneForm.reset();
    document.getElementById('sceneNumber').value = '';
    document.getElementById('sceneTitle').value = '';
    document.getElementById('sceneDesc').value = '';
    document.getElementById('sceneStatus').value = 'pending';
    tempImageData = null;
    imagePreviewContainer.style.display = 'none';
    imagePreview.src = '';
}

async function saveSceneFromForm(event) {
    event.preventDefault();
    if (!currentProject) { alert('Пожалуйста, выберите проект'); return; }
    const number = document.getElementById('sceneNumber').value.trim();
    const title = document.getElementById('sceneTitle').value.trim();
    const description = document.getElementById('sceneDesc').value.trim();
    const status = document.getElementById('sceneStatus').value;
    if (!title) { alert('Укажите название сцены'); return; }
    if (editingId) {
        const index = scenes.findIndex(s => s.id === editingId);
        if (index !== -1) {
            const updatedScene = { ...scenes[index], number: number || '—', title, description: description || 'Без описания', status, imageData: tempImageData !== undefined ? tempImageData : scenes[index].imageData, updatedAt: Date.now() };
            await updateScene(updatedScene);
            scenes[index] = updatedScene;
        }
    } else {
        const newScene = { id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 6), projectId: currentProject.id, number: number || `SC-${scenes.length + 1}`, title, description: description || 'Добавьте детали съемки', status, imageData: tempImageData || null, createdAt: Date.now() };
        await addScene(newScene);
        scenes.unshift(newScene);
    }
    updateStats();
    renderScenes();
    modal.classList.remove('active');
    resetFormAndModal();
}

async function loadProjectScenes() {
    if (currentProject) {
        scenes = await getScenesByProject(currentProject.id);
        updateStats();
        renderScenes();
    }
}

async function renderProjectsList() {
    if (!projectsList) return;
    const projects = await getAllProjects();
    if (projects.length === 0) {
        projectsList.innerHTML = '<div class="empty-projects">Нет проектов. Создайте первый проект!</div>';
        return;
    }
    projectsList.innerHTML = projects.map(project => `
        <div class="project-item ${currentProject && currentProject.id === project.id ? 'active' : ''}" data-id="${project.id}">
            <div class="project-info">
                <div class="project-name">${escapeHtml(project.name)}</div>
                <div class="project-dates">${new Date(project.createdAt).toLocaleDateString()}</div>
            </div>
            <div class="project-actions">
                <button class="project-select-btn" data-id="${project.id}">Выбрать</button>
                <button class="project-delete-btn" data-id="${project.id}">🗑️</button>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.project-select-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => { e.stopPropagation(); const id = btn.getAttribute('data-id'); await selectProject(id); });
    });
    document.querySelectorAll('.project-delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => { e.stopPropagation(); const id = btn.getAttribute('data-id'); if (confirm('Удалить проект? Все сцены будут удалены безвозвратно!')) { await deleteProject(id); if (currentProject && currentProject.id === id) { currentProject = null; currentProjectName.textContent = 'Нет активного проекта'; scenes = []; renderScenes(); } renderProjectsList(); } });
    });
}

async function selectProject(projectId) {
    const projects = await getAllProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
        currentProject = project;
        currentProjectName.textContent = project.name;
        await loadProjectScenes();
        renderProjectsList();
        closeProjectModal();
        alert(`Проект "${project.name}" загружен`);
        // Если текущий фильтр "equipment", обновить отображение
        if (currentFilter === 'equipment') renderEquipment();
    }
}

// ----- Функции для ручного добавления оборудования (сохранение в DOM) -----
function initCustomEquipmentHandlers() {
    // Камеры
    let customCameras = [];
    const addCamBtn = document.getElementById('addCustomCameraBtn');
    const camInput = document.getElementById('customCameraInput');
    const camListDiv = document.getElementById('customCamerasList');
    if (addCamBtn) {
        addCamBtn.addEventListener('click', () => {
            const val = camInput.value.trim();
            if (val && !customCameras.includes(val)) {
                customCameras.push(val);
                camListDiv.innerText = customCameras.join(', ');
                camInput.value = '';
            }
        });
    }
    // Объективы
    let customLenses = [];
    const addLensBtn = document.getElementById('addCustomLensBtn');
    const lensInput = document.getElementById('customLensInput');
    const lensListDiv = document.getElementById('customLensesList');
    if (addLensBtn) {
        addLensBtn.addEventListener('click', () => {
            const val = lensInput.value.trim();
            if (val && !customLenses.includes(val)) {
                customLenses.push(val);
                lensListDiv.innerText = customLenses.join(', ');
                lensInput.value = '';
            }
        });
    }
    // Рекордеры
    let customRecorders = [];
    const addRecBtn = document.getElementById('addCustomRecorderBtn');
    const recInput = document.getElementById('customRecorderInput');
    const recListDiv = document.getElementById('customRecordersList');
    if (addRecBtn) {
        addRecBtn.addEventListener('click', () => {
            const val = recInput.value.trim();
            if (val && !customRecorders.includes(val)) {
                customRecorders.push(val);
                recListDiv.innerText = customRecorders.join(', ');
                recInput.value = '';
            }
        });
    }
    // Стабилизация
    let customStab = [];
    const addStabBtn = document.getElementById('addCustomStabBtn');
    const stabInput = document.getElementById('customStabInput');
    const stabListDiv = document.getElementById('customStabList');
    if (addStabBtn) {
        addStabBtn.addEventListener('click', () => {
            const val = stabInput.value.trim();
            if (val && !customStab.includes(val)) {
                customStab.push(val);
                stabListDiv.innerText = customStab.join(', ');
                stabInput.value = '';
            }
        });
    }
    // Сохраняем массивы в глобальные переменные для использования при создании проекта
    window._customEquipment = { customCameras, customLenses, customRecorders, customStab };
}

// ----- Создание проекта с учётом кастомного оборудования -----
async function createNewProject(event) {
    event.preventDefault();
    const name = document.getElementById('projectName').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const client = document.getElementById('projectClient').value.trim();
    const deadline = document.getElementById('projectDeadline').value;
    if (!name) { alert('Введите название проекта'); return; }

    const camerasSelect = document.getElementById('projectCameras');
    const lensesSelect = document.getElementById('projectLenses');
    const recordersSelect = document.getElementById('projectRecorders');
    const stabilizationSelect = document.getElementById('projectStabilization');

    const selectedCameras = camerasSelect ? Array.from(camerasSelect.selectedOptions).map(opt => opt.text) : [];
    const selectedLenses = lensesSelect ? Array.from(lensesSelect.selectedOptions).map(opt => opt.text) : [];
    const selectedRecorders = recordersSelect ? Array.from(recordersSelect.selectedOptions).map(opt => opt.text) : [];
    const selectedStabilization = stabilizationSelect ? Array.from(stabilizationSelect.selectedOptions).map(opt => opt.text) : [];

    // Получаем кастомные значения из DOM
    const customCameras = (document.getElementById('customCamerasList')?.innerText || '').split(',').map(s=>s.trim()).filter(s=>s);
    const customLenses = (document.getElementById('customLensesList')?.innerText || '').split(',').map(s=>s.trim()).filter(s=>s);
    const customRecorders = (document.getElementById('customRecordersList')?.innerText || '').split(',').map(s=>s.trim()).filter(s=>s);
    const customStab = (document.getElementById('customStabList')?.innerText || '').split(',').map(s=>s.trim()).filter(s=>s);

    const newProject = {
        id: Date.now().toString(),
        name,
        description,
        client,
        deadline,
        equipment: {
            cameras: selectedCameras,
            lenses: selectedLenses,
            recorders: selectedRecorders,
            stabilization: selectedStabilization,
            customCameras,
            customLenses,
            customRecorders,
            customStabilization: customStab
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    await createProject(newProject);
    await renderProjectsList();
    await selectProject(newProject.id);
    createProjectForm.reset();
    // Очистить списки кастомного оборудования в DOM
    ['customCamerasList', 'customLensesList', 'customRecordersList', 'customStabList'].forEach(id => {
        const div = document.getElementById(id);
        if (div) div.innerText = '';
    });
    closeProjectModal();
    alert(`Проект "${name}" создан!`);
}

function openProjectModal() {
    renderProjectsList();
    // Сбросить кастомные списки
    ['customCamerasList', 'customLensesList', 'customRecordersList', 'customStabList'].forEach(id => {
        const div = document.getElementById(id);
        if (div) div.innerText = '';
    });
    projectModal.classList.add('active');
}

function closeProjectModal() {
    projectModal.classList.remove('active');
}

// ----- Фильтры (включая вкладку "Оборудование") -----
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderScenes();
        });
    });
}

function initFadeAnimation() {
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observer.observe(el));
    setTimeout(() => {
        document.querySelectorAll('.fade-up').forEach(el => el.classList.add('reveal'));
    }, 100);
}

function handleImageUpload(file) {
    if (!file) return;
    if (!file.type.match('image.*')) { alert('Пожалуйста, загрузите изображение в формате JPEG, PNG или WEBP'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        tempImageData = e.target.result;
        imagePreview.src = tempImageData;
        imagePreviewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    tempImageData = null;
    imagePreviewContainer.style.display = 'none';
    imagePreview.src = '';
    if (imageInput) imageInput.value = '';
}

// ----- Заполнение списков оборудования из библиотеки -----
function initEquipmentSelects() {
    if (typeof equipmentLibrary === 'undefined') { console.warn('equipmentLibrary не найдена'); return; }
    const cameraSelect = document.getElementById('projectCameras');
    const lensSelect = document.getElementById('projectLenses');
    const recorderSelect = document.getElementById('projectRecorders');
    const stabilizationSelect = document.getElementById('projectStabilization');
    if (cameraSelect && equipmentLibrary.cameras) {
        cameraSelect.innerHTML = equipmentLibrary.cameras.map(cam => `<option value="${cam.id}">${cam.name} - ${cam.type} (${cam.resolution})</option>`).join('');
    }
    if (lensSelect && equipmentLibrary.lenses) {
        lensSelect.innerHTML = equipmentLibrary.lenses.map(lens => `<option value="${lens.id}">${lens.name} - ${lens.focal_length} (${lens.aperture})</option>`).join('');
    }
    if (recorderSelect && equipmentLibrary.recorders) {
        recorderSelect.innerHTML = equipmentLibrary.recorders.map(rec => `<option value="${rec.id}">${rec.name} - ${rec.type}</option>`).join('');
    }
    if (stabilizationSelect && equipmentLibrary.stabilization) {
        stabilizationSelect.innerHTML = equipmentLibrary.stabilization.map(stab => `<option value="${stab.id}">${stab.name} - ${stab.payload}</option>`).join('');
    }
}

// ----- Event Listeners -----
if (openBtn) openBtn.addEventListener('click', () => {
    if (!currentProject) { alert('Пожалуйста, создайте или выберите проект'); openProjectModal(); return; }
    resetFormAndModal(); modal.classList.add('active');
});
if (closeModalBtn) closeModalBtn.addEventListener('click', () => { modal.classList.remove('active'); resetFormAndModal(); });
if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.remove('active'); resetFormAndModal(); } });
if (sceneForm) sceneForm.addEventListener('submit', saveSceneFromForm);
if (imageUploadArea) imageUploadArea.addEventListener('click', () => imageInput && imageInput.click());
if (imageInput) imageInput.addEventListener('change', (e) => e.target.files && e.target.files[0] && handleImageUpload(e.target.files[0]));
if (removeImageBtn) removeImageBtn.addEventListener('click', (e) => { e.preventDefault(); removeImage(); });
if (fullscreenViewer) fullscreenViewer.addEventListener('click', () => { fullscreenViewer.classList.remove('active'); fullscreenImage.src = ''; });
if (openProjectBtn) openProjectBtn.addEventListener('click', openProjectModal);
if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
if (projectModal) projectModal.addEventListener('click', (e) => { if (e.target === projectModal) closeProjectModal(); });
if (createProjectForm) createProjectForm.addEventListener('submit', createNewProject);

// ----- Инициализация приложения -----
async function initApp() {
    try {
        await initDatabase();
        initEquipmentSelects();
        initCustomEquipmentHandlers();
        await renderProjectsList();
        initFilters();
        initFadeAnimation();
    } catch (error) {
        console.error('Init error:', error);
        alert('Ошибка инициализации базы данных. Перезагрузите страницу.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}