
import { Meteor } from 'meteor/meteor';

export function subscribeUsers(onReady) {
  return Meteor.subscribe("getUserUsernames", {
    onReady: onReady
  });
}
