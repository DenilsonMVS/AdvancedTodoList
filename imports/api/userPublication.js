
import { Meteor } from 'meteor/meteor';

Meteor.publish("getUserUsernames", function() {
  return Meteor.users.find(
    {},
    { fields: { _id: 1, username: 1 } }
  );
});
    