
import { Meteor } from 'meteor/meteor';
import { userData } from '../db/userData';

Meteor.publish("userData", function() {
  return userData.find({
    userId: this.userId
  });
});
