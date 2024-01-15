import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const TASK_STATUS = {
  READY: "ready",
  IN_PROGRESS: "in progress",
  FINISHED: "finished"
};

export const tasksCollection = new Mongo.Collection("tasks");

export function subscribeTasks({ onlyToDo, substr, onReady, pageNumber }) {
  if(onReady == undefined) {
    onReady = () => {};
  }

  return Meteor.subscribe("tasks", onlyToDo, substr, pageNumber, {
    onReady
  });
}
