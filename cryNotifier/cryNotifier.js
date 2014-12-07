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
  }
});
if (Meteor.isClient){
  Meteor.subscribe('questions');
  
  // var questionsData = [
  //   {
  //     text: 'Why does the sun shine?',
  //     votes: 0
  //   },
  //   {
  //     text: 'If you were a hot dog, and you'
  //    + 'were starving to death, would you eat yourself?',
  //     votes: 0
  //   },
  //   {
  //     text: 'What is the airspeed velocity'
  //     + ' of an unladen swallow?',
  //     votes: 0
  //   }
  // ];
  

  Template.questionsList.helpers({
    // questions: questionsData
    questions:Questions.find({}, {sort: {votes: -1}}), 
  });
  Template.questionForm.events({
    'submit form': function(e) {
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
    }
  });
}

// if (Meteor.isClient) {
//   // counter starts at 0
//   Session.setDefault("counter", 0);

//   Template.hello.helpers({
//     counter: function () {
//       return Session.get("counter");
//     }
//   });

//   Template.hello.events({
//     'click button': function () {
//       // increment the counter when button is clicked
//       Session.set("counter", Session.get("counter") + 1);
//     }
//   });
// }

if (Meteor.isServer) {
  Meteor.startup(function () {
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
