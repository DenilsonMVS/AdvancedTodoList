
import { Meteor } from 'meteor/meteor';
import { TASK_STATUS, tasksCollection } from '../db/tasksCollection';


Meteor.publish("tasks", function(onlyToDo) {
  const onlyToDoFilter = onlyToDo ? {status: {
    $in: [TASK_STATUS.READY, TASK_STATUS.IN_PROGRESS]
  }} : {};

  return tasksCollection.find({
    $or: [
      {
        creator: this.userId,
        personal: true,
        ...onlyToDoFilter
      }, {
        users: {
          $in: [this.userId]
        },
        personal: false,
        ...onlyToDoFilter
      }
    ]
  });
});
