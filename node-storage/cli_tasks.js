var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2);
var command = args.shift();
var taskDescription = args.join(' ');
var file = path.join(process.cwd(), '/.tasks');

switch (command) {
    case 'list':
        listTasks(file);
        break;

    case 'add':
        addTask(file, taskDescription);
        break;
    default:
        console.log('Usages: ' + process.argv[0] + ' list|add [taskDescription]');
        break;
}


//从文本文件中加载用到的JSON编码的数据
function loadOrInitializeTaskArray(file, cb) {
    fs.exists(file, exists => {
        var tasks = [];
        if (exists) {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) throw err;
                var data = data.toString();
                var tasks = JSON.parse(data || '[]');
                cb(tasks);
            });
        } else {
            cb([]);
        }
    });
}

function listTasks() {
    loadOrInitializeTaskArray(file, tasks => {
        for (const i in tasks) {
            if (tasks.hasOwnProperty(i)) {
                const element = tasks[i];
                console.log(element);
            }
        }
    });
}

function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', err => {
        if (err) throw err;
        console.log('Saved.');
    })
}

function addTask(file, taskDescription) {
    loadOrInitializeTaskArray(file, tasks => {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    })
}
