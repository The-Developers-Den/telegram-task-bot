const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const addTask = async (task, assignee, assignor, under) => {
  const newTask = await prisma.task.create({
    data: {
      task,
      assignee,
      assignor,
      under,
    },
  });
  return newTask;
};

const findTasks = async (username) => {
  const tasks = await prisma.task.findMany({
    where: {
      assignee: username,
    },
  });
  return tasks;
};

const updateTask = async (id, status) => {
  const task = await prisma.task.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  return task;
};

const deleteTask = async (id) => {
  const task = await prisma.task.delete({
    where: {
      id,
    },
  });
  return task;
};

module.exports = {
  addTask,
  findTasks,
  updateTask,
  deleteTask,
};
