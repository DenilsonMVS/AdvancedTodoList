
import { Meteor } from 'meteor/meteor';
import { TASK_STATUS, tasksCollection } from '../db/tasksCollection';


Meteor.publish("tasks", function(onlyToDo, substr) {
  const onlyToDoFilter = onlyToDo ? {status: {
    $in: [TASK_STATUS.READY, TASK_STATUS.IN_PROGRESS]
  }} : {};
  console.log(substr);
  
  const substrFilter = substr ? {
    name: { $regex: new RegExp(substr)}
  } : {};

  return tasksCollection.find({
    $or: [
      {
        creator: this.userId,
        personal: true,
        ...onlyToDoFilter,
        ...substrFilter
      }, {
        users: {
          $in: [this.userId]
        },
        personal: false,
        ...onlyToDoFilter,
        ...substrFilter
      }
    ]
  });
});
