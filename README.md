ng-message-center
=================

Message library for AngularJS

Usage
=====

Add module
```javascript
angular.module('my-app', [
        'federicot.ng-message-center'
  ]);
```

Add directive
```html
<!-- if no name is provided it uses "default" -->
<ngmessagecenter-messages></ngmessagecenter-messages>

<!-- Assign a name -->
<ngmessagecenter-messages name="sidebar"></ngmessagecenter-messages>
```

Inject into your controller
```javascript
.controller('MyCtrl', ['ngMessageCenter', function(ngMessageCenter) {
  
  // By default messages are shown instantly
  message.error({title: 'Oh snap!', text: 'Something went wrong, try submitting again'});
  
  // next: true will show the message after $locationChangeSuccess event is triggered
  message.success({title: 'Well done!', text: 'Client was successfully saved', next: true});
  
  // Named message will only be shown on <ngmessagecenter-messages name="sidebar">
  message.success({name: 'sidebar', title: 'Well done!', text: 'Client was successfully saved', next: true});
  
  // Stack messages (all messages should have stack: true in order display the full stack)
  message.success({stack: true, title: 'Well done!', text: 'Client was successfully saved'});
  
  // Timeout
  message.success({timeout: 5000, title: 'Well done!', text: 'Client was successfully saved'});
  
  // No timeout
  message.success({timeout: false, title: 'Well done!', text: 'Client was successfully saved'});
```

Default Options
```javascript
name: 'default',
next: false,
stack: false,
timeout: 3000
```
