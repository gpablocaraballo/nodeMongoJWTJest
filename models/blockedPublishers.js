'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

/* 
    in a real scenario you can use role based permissions, something like this:
    users_roles
    roles_permissions
    users_permissions
*/ 

// for this demo, i keep it very simple
const blockedPublishersSchema = Schema({
  author :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

blockedPublishersSchema.set('collection', 'BlockedPublishers');
module.exports = mongoose.model('BlockedPublishers', blockedPublishersSchema);