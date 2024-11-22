const fs = require('fs');
const path = require('path');

// File tempat menyimpan data
const TASK_FILE = path.resolve(__dirname, 'tugasku.json');

// Fungsi untuk memuat tugas dari file JSON
function loadTasks() {
  if (!fs.existsSync(TASK_FILE)) return [];
  const data = fs.readFileSync(TASK_FILE, 'utf8');
  return JSON.parse(data || '[]');
}

// Fungsi untuk menyimpan tugas ke file JSON
function saveTasks(tasks) {
  fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
}

// Menambahkan tugas
function addTask(description) {
  const tasks = loadTasks();
  const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
  const task = {
    id,
    description,
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks(tasks);
  console.log(`Berhasil Menambahkan Tugas (ID: ${id})`);
}

// Menampilkan daftar tugas
function listTasks(filter = null) {
  const tasks = loadTasks();
  tasks
    .filter((task) => (filter ? task.status === filter : true))
    .forEach((task) => {
      console.log(
        `[${task.status.toUpperCase()}] ${task.id}: ${task.description}`
      );
    });
}

// Menandai tugas sebagai "done" atau "in-progress"
function markTask(id, status) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`Tugas dengan ID ${id} tidak ditemukan!.`);
    return;
  }
  task.status = status;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log(`ID Tugas ${id} Ditandai sebagai ${status}`);
}

// Menghapus tugas
function deleteTask(id) {
  let tasks = loadTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  if (tasks.length === initialLength) {
    console.log(`Tugas dengan ID ${id} tidak ditemukan.`);
    return;
  }
  saveTasks(tasks);
  console.log(`Tugas dengan ID ${id} berhasil dihapus.`);
}

// CLI Handler
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'add':
    const description = args.slice(1).join(' ');
    if (!description) {
      console.log('Usage: task-cli add <description>');
    } else {
      addTask(description);
    }
    break;
  case 'list':
    const filter = args[1];
    if (filter && !['todo', 'in-progress', 'done'].includes(filter)) {
      console.log('Usage: task-cli list [todo|in-progress|done]');
    } else {
      listTasks(filter);
    }
    break;
  case 'mark-done':
    markTask(parseInt(args[1]), 'Done');
    break;
  case 'mark-in-progress':
    markTask(parseInt(args[1]), 'in-progress');
    break;
  case 'delete':
    deleteTask(parseInt(args[1]));
    break;
  default:
    console.log(`Unknown command: ${command}`);
    console.log('Command Tersedia: add, list, mark-done, mark-in-progress, delete');
}
