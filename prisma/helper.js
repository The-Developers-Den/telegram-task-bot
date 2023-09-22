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

module.exports = {
  addTask,
  findTasks,
};
