'use strict';

angular.module('app', [])
.controller('MainController', MainController)
.directive('mainView', mainView)
.controller('FooDialogController', FooDialogController)
.directive('fooDialogView', fooDialogView)
;

function MainController() {
  var self = this;

  self.fooDialog = { // !!! shared code between main component and foo dialog
    isVisible: false,
    ok: function(msg) {
      console.log('ok: ', msg);
    },
    cancel: function(msg) {
      console.log('cancel: ', msg);
    },
  };

  self.toggleDialogVisible = function() {
    self.fooDialog.isVisible = !self.fooDialog.isVisible; // !!!
  };
}

function mainView() {
  return {
    restrict: 'AE',
    controller: 'MainController as mc',
    template: '<div>'+
      '<input type="button" value="toggle isDialogVisible" ng-click="mc.toggleDialogVisible()"/>'+
      '<foo-dialog-view share=mc.fooDialog></foo-dialog-view>'+ // !!!
    '</div>',
  };
}

FooDialogController.$inject = ['$scope'];
function FooDialogController($scope) {
  var self = this;

  self.printIsVisible = function() {
    console.log('$scope.share.isVisible: ', $scope.share.isVisible);
  };

  self.hide = function() {
    $scope.share.isVisible = false; // !!!
  };

  self.ok = function() {
    self.hide();
    $scope.share.ok('ok ' + Date.now().toString()); // !!!
  };

  self.cancel = function() {
    self.hide();
    $scope.share.cancel('cancel ' + Date.now().toString()); // !!!
  };
}

function fooDialogView() {
  return {
    restrict: 'AE',
    controller: 'FooDialogController as fdc',
    template: '<div>'+
      '<input type="button" value="print isVisible" ng-click="fdc.printIsVisible()"/>'+
      '<div ng-show="share.isVisible">'+ // !!!
        '<div>dialog content</div>'+
        '<input type="button" value="ok" ng-click="fdc.ok()"/>'+ // !!!
        '<input type="button" value="cancel" ng-click="fdc.cancel()"/>'+ // !!!
      '</div>'+
    '</div>',
    scope: {
      share: '=', // !!!
    },
  };
}
