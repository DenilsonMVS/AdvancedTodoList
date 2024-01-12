
import { Meteor } from 'meteor/meteor';
import { tasksCollection } from '../db/tasksCollection';


Meteor.publish("tasks", function() {
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
});
