// roles.js
const roles = {
    Admin: ['createTask', 'readTask', 'updateTask', 'deleteTask', 'manageUsers'],
    Manager: ['createTask', 'readTask', 'updateTask', 'assignTask'],
    User: ['readTask', 'updateTask'],
  };
  
  module.exports = roles;
  