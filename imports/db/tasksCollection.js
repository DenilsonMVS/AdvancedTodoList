import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const TASK_STATUS = {
  READY: "ready",
  IN_PROGRESS: "in progress",
  FINISHED: "finished"
};

export const tasksCollection = new Mongo.Collection("tasks");

export function subscribeTasks(onlyToDo, onReady) {
  return Meteor.subscribe("tasks", onlyToDo, {
    onReady: onReady
  });
}
