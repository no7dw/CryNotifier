Questions = new Mongo.Collection('questions');
Meteor.methods({
  upvote: function(questionId) {
    var question = Questions.findOne(questionId);
    Questions.update(
      questionId,
      { $set: { votes: question.votes + 1 }}
    );
  },
  
  downvote: function(questionId) {
    var question = Questions.findOne(questionId);
    Questions.update(
      questionId,
      { $set: { votes: question.votes - 1 }}
    );
  },
  removequestion: function(questionId) {
    console.log('remove', questionId);
    Questions.remove(
      {"_id":questionId}
    );
  }
});
if (Meteor.isClient){
  Meteor.subscribe('questions');

  Template.questionsList.helpers({
    questions:Questions.find({}, {sort: {votes: -1}}), 
  });
  Template.questionForm.events({
    'submit form': function(e) {
      console.log('insert',$(e.target).find('#question').val());
      Questions.insert({
        'text': $(e.target).find('#question').val(),
        'votes': 0
      });      
    }
  });
  Template.questionsList.events({
    'click .vote-up': function(e) {
      
      e.preventDefault();
      Meteor.call('upvote', this._id);
    },
    
    'click .vote-down': function(e) {
      e.preventDefault();
      Meteor.call('downvote', this._id);
    },
    'click .remove': function(e) {
      e.preventDefault();
      Meteor.call('removequestion', this._id);
    }
  });
}


if (Meteor.isServer) {
  console.log("this is server side");
  //this allow is important in auth mode, otherwise you will get access deny
  Questions.allow({
    insert: function () { return true; },
    // update: function () { return true; },
    // remove: function () { return true; } 
  });
  Meteor.startup(function () {
    console.log("in startup");
    // code to run on server at startup
    if (Questions.find().count() === 0) {
      console.log('==0');
    Questions.insert({
      text: 'Why does the sun shine?',
      votes: 0
    });

    Questions.insert({
      text: 'If you were a hot dog, and you were...',
      votes: 0 
    });

    Questions.insert({
      text: 'What is the airspeed velocity of...',
      votes: 0 
    });
  }
    Meteor.publish('questions', function() {
    return Questions.find();
  });
  });
}
