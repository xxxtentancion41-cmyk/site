// Database configuration
const DB_NAME = 'ShotlistManagerDB';
const DB_VERSION = 3; // увеличиваем версию, чтобы обновить схему
const PROJECTS_STORE = 'projects';
const SCENES_STORE = 'scenes';

let db = null;

// Инициализация базы данных
function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            db = request.result;
            console.log('Database initialized');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Создаём хранилище проектов (без привязки к пользователю)
            if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
                const projectStore = db.createObjectStore(PROJECTS_STORE, { keyPath: 'id' });
                projectStore.createIndex('createdAt', 'createdAt');
            }

            // Создаём хранилище сцен (без привязки к userId)
            if (!db.objectStoreNames.contains(SCENES_STORE)) {
                const sceneStore = db.createObjectStore(SCENES_STORE, { keyPath: 'id' });
                sceneStore.createIndex('projectId', 'projectId');
                sceneStore.createIndex('status', 'status');
            }
        };
    });
}

function ensureDB() {
    if (!db) return initDatabase();
    return Promise.resolve(db);
}

// ----- Проекты -----
async function createProject(project) {
    await ensureDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PROJECTS_STORE], 'readwrite');
        const store = transaction.objectStore(PROJECTS_STORE);
        const request = store.add(project);
        request.onsuccess = () => resolve(project);
        request.onerror = () => reject(request.error);
    });
}

async function getAllProjects() {
    await ensureDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PROJECTS_STORE], 'readonly');
        const store = transaction.objectStore(PROJECTS_STORE);
        const request = store.getAll();
        request.onsuccess = () => {
            const projects = request.result || [];
            resolve(projects.sort((a, b) => b.updatedAt - a.updatedAt));
        };
        request.onerror = () => reject(request.error);
    });
}

async function updateProject(project) {
    await ensureDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PROJECTS_STORE], 'readwrite');
        const store = transaction.objectStore(PROJECTS_STORE);
        const request = store.put(project);
        request.onsuccess = () => resolve(project);
        request.onerror = () => reject(request.error);
    });
}

async function deleteProject(projectId) {
    await ensureDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PROJECTS_STORE, SCENES_STORE], 'readwrite');
        const projectStore = transaction.objectStore(PROJECTS_STORE);
        const scenesStore = transaction.objectStore(SCENES_STORE);

        // Удаляем все сцены этого проекта
        const scenesIndex = scenesStore.index('projectId');
        scenesIndex.openCursor(IDBKeyRange.only(projectId)).onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };

        const request = projectStore.delete(projectId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// ----- Сцены -----
async function getScenesByProject(projectId) {
    await ensureDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([SCENES_STORE], 'readonly');
        const store = transaction.objectStore(SCENES_STORE);
        const index = store.index('projectId');
        const scenes = [];
        index.openCursor(IDBKeyRange.only(projectId)).onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                scenes.push(cursor.value);
                cursor.continue();
            } else {
                resolve(scenes);
            }
        };
    });
}

async function addScene(scene) {
    await ensureDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([SCENES_STORE], 'readwrite');
        const store = transaction.objectStore(SCENES_STORE);
        const request = store.add(scene);
        request.onsuccess = () => resolve(scene);
        request.onerror = () => reject(request.error);
    });
}

async function updateScene(scene) {
    await ensureDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([SCENES_STORE], 'readwrite');
        const store = transaction.objectStore(SCENES_STORE);
        const request = store.put(scene);
        request.onsuccess = () => resolve(scene);
        request.onerror = () => reject(request.error);
    });
}

async function deleteScene(sceneId) {
    await ensureDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([SCENES_STORE], 'readwrite');
        const store = transaction.objectStore(SCENES_STORE);
        const request = store.delete(sceneId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}