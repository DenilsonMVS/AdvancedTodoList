
import { Meteor } from 'meteor/meteor';
import { TASK_STATUS, tasksCollection } from '../db/tasksCollection';


Meteor.publish("tasks", function(onlyToDo, substr, pageNumber) {
  const onlyToDoFilter = onlyToDo ? {status: {
    $in: [TASK_STATUS.READY, TASK_STATUS.IN_PROGRESS]
  }} : {};
  
  const substrFilter = substr ? {
    name: { $regex: new RegExp(substr)}
  } : {};

  const [skipTasks, limitTasks] = (typeof pageNumber === "number") ?
    [pageNumber * 4, 4] :
    [0, 1024];

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
  },
  {
    skip: skipTasks,
    limit: limitTasks,
  });
});
