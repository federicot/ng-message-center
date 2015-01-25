describe('ng-message-center', function() {

  var $compile,
    $rootScope,
    $timeout,
    element,
    message;

  // Load module
  beforeEach(module('federicot.ng-message-center'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _ngMessageCenter_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    message = _ngMessageCenter_;

  }));

  it('should compile', function() {
    // Compile a piece of HTML containing the directive
    element = $compile("<ngmessagecenter-messages></ngmessagecenter-messages>")($rootScope);
    // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
    $rootScope.$digest();

    // Check that the compiled element contains the templated content
    expect(element.html()).not.toBe("");
  });

  it('should show messages', function() {
    element = $compile("<ngmessagecenter-messages></ngmessagecenter-messages>")($rootScope);
    $rootScope.$digest();

    message.error({
      title: 'title1',
      text: 'text1',
      stack: true
    });
    message.warning({
      title: 'title2',
      text: 'text2',
      stack: true
    });
    message.success({
      title: 'title3',
      text: 'text3',
      stack: true
    });
    message.info({
      title: 'title4',
      text: 'text4',
      stack: true
    });

    $rootScope.$digest();

    expect(element.children().length).toBe(4);
    expect(element.children().children().find('div').contents()[4].innerHTML).toBe('title1');
    expect(element.children().children().find('div').contents()[7].nodeValue).toBe('text1');
    expect(element.children().children().find('div').contents()[12].innerHTML).toBe('title2');
    expect(element.children().children().find('div').contents()[15].nodeValue).toBe('text2');
    expect(element.children().children().find('div').contents()[20].innerHTML).toBe('title3');
    expect(element.children().children().find('div').contents()[23].nodeValue).toBe('text3');
    expect(element.children().children().find('div').contents()[28].innerHTML).toBe('title4');
    expect(element.children().children().find('div').contents()[31].nodeValue).toBe('text4');
    expect(message.get().current.length).toBe(4);
  });

  it('should show message after location change', function() {
    // Create directive
    element = $compile("<ngmessagecenter-messages></ngmessagecenter-messages>")($rootScope);
    $rootScope.$digest();

    message.error({
      title: 'title1',
      text: 'text1',
      next: true
    });

    // Add message
    $rootScope.$digest();

    expect(element.children().length).toBe(0);
    expect(message.get().current.length).toBe(0);

    // Trigger '$locationChangeSuccess' event
    $rootScope.$broadcast('$locationChangeSuccess');

    $rootScope.$digest();

    expect(element.children().length).toBe(1);
    expect(message.get().current.length).toBe(1);

  });

  it('should remove message after timeout', function() {

    element = $compile("<ngmessagecenter-messages></ngmessagecenter-messages>")($rootScope);
    $rootScope.$digest();

    message.error({
      title: 'title1',
      text: 'text1'
    });

    $rootScope.$digest();

    expect(element.children().length).toBe(1);
    expect(message.get().current.length).toBe(1);

    // Trigger timeout
    $timeout.flush();

    expect(element.children().length).toBe(0);
    expect(message.get().current.length).toBe(0);

  });

  it('should not remove message if no timeout is set', function() {

    // Set dummy timeout so $timout.flush() doesnt throw an exception if theres no timeouts registered
    $timeout(function() {
      return;
    }, 3000);

    element = $compile("<ngmessagecenter-messages></ngmessagecenter-messages>")($rootScope);
    $rootScope.$digest();

    message.error({
      title: 'title1',
      text: 'text1',
      timeout: false
    });

    $rootScope.$digest();

    expect(element.children().length).toBe(1);
    expect(message.get().current.length).toBe(1);

    $timeout.flush();

    expect(element.children().length).toBe(1);
    expect(message.get().current.length).toBe(1);

  });
});