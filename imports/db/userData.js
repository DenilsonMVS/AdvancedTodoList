import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const userData = new Mongo.Collection("userData");

export function subscribeUserData(onReady) {
  return Meteor.subscribe("userData", {
    onReady: onReady
  });
}
  