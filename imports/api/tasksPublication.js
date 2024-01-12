
import { Meteor } from 'meteor/meteor';
import { TASK_STATUS, tasksCollection } from '../db/tasksCollection';


Meteor.publish("tasks", function(onlyToDo) {
  if(onlyToDo) {
    return tasksCollection.find({
      $or: [
        {
          creator: this.userId,
          personal: true,
          status: {
            $in: [TASK_STATUS.READY, TASK_STATUS.IN_PROGRESS]
          },
        },
        {
          users: {
            $in: [this.userId]
          },
          personal: false,
          status: {
            $in: [TASK_STATUS.READY, TASK_STATUS.IN_PROGRESS]
          },
        }
      ]
    });
  } else {
    return tasksCollection.find({
      $or: [
        {
          creator: this.userId,
          personal: true
        },
        {
          users: {
            $in: [this.userId]
          },
          personal: false
        }
      ]
    });
  }
});
