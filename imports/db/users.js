
import { Meteor } from 'meteor/meteor';

export function subscribeUsers(onReady) {
  Meteor.subscribe("getUserUsernames", {
    onReady: onReady
  });
}
