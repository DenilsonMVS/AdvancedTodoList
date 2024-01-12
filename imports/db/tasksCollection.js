import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const TASK_STATUS = {
  READY: "ready",
  IN_PROGRESS: "in progress",
  FINISHED: "finished"
};

export const tasksCollection = new Mongo.Collection("tasks");

export function subscribeTasks(onReady) {
  Meteor.subscribe("tasks", {
    onReady: onReady
  });
}
