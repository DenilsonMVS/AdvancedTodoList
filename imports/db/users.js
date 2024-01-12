
import { Meteor } from 'meteor/meteor';

export function subscribeUsers({ onReady }) {
  if(!onReady) {
    onReady = () => {};
  }
  
  return Meteor.subscribe("getUserUsernames", {
    onReady
  });
}
