
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { TASK_STATUS, tasksCollection } from '../db/tasksCollection';


Meteor.methods({
  "tasks.update"(taskId, task) {
    if(!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    check(task, Object);

    const taskFound = tasksCollection.findOne(taskId);
    if(!taskFound) {
      throw new Meteor.Error('Task not found');
    }
    if(taskFound.creator != this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    if(task.name !== undefined) {
      check(task.name, String);
      if (task.name.trim() === '') {
        throw new Meteor.Error('Invalid name.');
      }
    }

    if(task.description !== undefined) {
      check(task.description, String);
    }

    if(task.date !== undefined) {
      check(task.date, Date);
    }

    if(task.users !== undefined) {
      check(task.users, [String]);

      task.users.forEach(userId => {
        check(userId, String);
        const user = Meteor.users.findOne(userId);
        if(!user) {
          throw new Meteor.Error("Invalid user.");
        }
      });
    }

    if(task.personal !== undefined) {
      check(task.personal, Boolean);
    }

    tasksCollection.update(taskId, {
      $set: task
    });
  },

  "tasks.create"(task) {
    if(!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    check(task, Object);
    

    check(task.name, String);
    if(task.name.trim() === "") {
      throw new Meteor.Error('Not authorized.');
    }

    check(task.description, String);

    check(task.date, Date);

    check(task.status, String);
    if(
      task.status !== TASK_STATUS.FINISHED &&
      task.status !== TASK_STATUS.IN_PROGRESS &&
      task.status !== TASK_STATUS.READY
    ) {
      throw new Meteor.Error('Not authorized.');
    }

    check(task.creator, String);
    if(task.creator !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    check(task.users, [String]);
    task.users.forEach(userId => {
      check(userId, String);
      const user = Meteor.users.findOne(userId);
      if(!user) {
        throw new Meteor.Error("Invalid user.");
      }
    });

    check(task.personal, Boolean);

    tasksCollection.insert(task);
  },

  "tasks.changeStatus"(taskId, nextStatus) {
    if(!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    check(nextStatus, String);
    if(
      nextStatus !== TASK_STATUS.FINISHED &&
      nextStatus !== TASK_STATUS.IN_PROGRESS &&
      nextStatus !== TASK_STATUS.READY
    ) {
      throw new Meteor.Error('Not authorized.');
    }

    const taskFound = tasksCollection.findOne(taskId);
    if(!taskFound) {
      throw new Meteor.Error('Task not found');
    }
    if(taskFound.creator != this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    
    tasksCollection.update(taskId, {
      $set: {
        status: nextStatus
      }
    });
  },

  "tasks.remove"(taskId) {
    if(!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    check(taskId, String);
    const taskFound = tasksCollection.findOne(taskId);
    if(!taskFound) {
      throw new Meteor.Error("Task doesn't exist");
    }
    if(taskFound.creator != this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    tasksCollection.remove(taskId);
  }
});
