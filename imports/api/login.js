
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { userData } from '../db/userData';


function isValidName(name) {
  return name.trim() !== "";
}

function isValidPassword(password) {
  return password !== "";
}

function isValidEmail(email) {
  const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isValidSex(sex) {
  return sex === "m" || sex === "f" || sex === "n";
}

const isBase64Image = (str) => {
  const base64Regex = /^data:image\/(jpeg|jpg|png|gif);base64,([A-Za-z0-9+/=])+$/;
  return base64Regex.test(str);
};


Meteor.methods({
  "user.create"(user) {

    check(user.name, String);
    check(user.email, String);
    check(user.birthDate, Date);
    check(user.sex, String);
    check(user.company, String);
    check(user.image, String);
    check(user.password, String);

    if(!isValidName(user.name))
      throw new Meteor.Error('Not authorized.');
    
    if(!isValidPassword(user.password))
      throw new Meteor.Error('Not authorized.');
  
    if(!isValidEmail(user.email))
      throw new Meteor.Error('Not authorized.');

    if(!isValidSex(user.sex))
      throw new Meteor.Error('Not authorized.');

    if(!isBase64Image(user.image))
      throw new Meteor.Error('Not authorized.');

    if(Accounts.findUserByUsername(user.name)) {
      throw new Meteor.Error("Nome de usuário já utilizado");
    }

    if(Accounts.findUserByEmail(user.email)) {
      throw new Meteor.Error("Email já utilizado");
    }

    const userId = Accounts.createUser({
      username: user.name,
      email: user.email,
      password: user.password
    });

    userData.insert({
      userId,
      birthDate: user.birthDate,
      sex: user.sex,
      company: user.company,
      image: user.image
    });
  },

  "user.changePassword"(password) {
    if(!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Accounts.setPassword(this.userId, password, { logout: false });
    return 'Password changed successfully';
  },

  "userData.update"(data) {
    if(!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    check(data, Object);

    if(data.birthDate !== undefined) {
      check(data.birthDate, Date);
    }

    if(data.sex !== undefined) {
      if(data.sex !== "m" && data.sex !== "f" && data.sex !== "n") {
        throw new Meteor.Error('Not authorized.');
      }
    }

    if(data.company !== undefined) {
      check(data.company, String);
      if(data.company.trim() === '') {
        throw new Meteor.Error('Invalid company name.');
      }
    }

    if (data.image !== undefined) {
      check(data.image, String);
      if(!isBase64Image(data.image)) {
        throw new Meteor.Error('Invalid base64 image.');
      }
    }

    const userDataId = userData.findOne({userId: this.userId})._id;
    userData.update(userDataId, {
      $set: data
    });
  }
});

