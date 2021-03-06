/**
 *
 */

function SIPClientCtrl($scope) {
	$scope.toaddr = '';
	$scope.connected = false;
	$scope.dialpad = [
		{
			sort: 1,
			digit: 1,
			letters: ' '
		},
		{
			sort: 2,
			digit: 2,
			letters: 'abc'
		},
		{
			sort: 3,
			digit: 3,
			letters: 'def'
		},
		{
			sort: 4,
			digit: 4,
			letters: 'ghi'
		},
		{
			sort: 5,
			digit: 5,
			letters: 'jkl'
		},
		{
			sort: 6,
			digit: 6,
			letters: 'mno'
		},
		{
			sort: 7,
			digit: 7,
			letters: 'pqrs'
		},
		{
			sort: 8,
			digit: 8,
			letters: 'tuv'
		},
		{
			sort: 9,
			digit: 9,
			letters: 'wxyz'
		},
		{
			sort: 10,
			digit: '*',
			letters: ' '
		},
		{
			sort: 11,
			digit: 0,
			letters: '+'
		},
		{
			sort: 12,
			digit: '#',
			letters: ' '
		},
	];
	$scope.calls = {};

	chrome.runtime.onMessage.addListener(function(message) {
		if(message.type == 'update') {
			$scope.connected = message.connected;
			$scope.calls = {};
			for(var key in message.calls) {
				$scope.calls[key] = message.calls[key];
			}
			console.log($scope.calls);
			$scope.$apply();
		}
	});
	chrome.runtime.sendMessage({
		type: 'noop'
	});

	$scope.connect = function() {
		chrome.runtime.sendMessage({
			type: 'connect'
		});
	};

	$scope.disconnect = function() {
		chrome.runtime.sendMessage({
			type: 'disconnect'
		});
	};

	$scope.dialToAddr = function(digit) {
		$scope.toaddr += digit;
	};

	$scope.toAddrChange = function() {
		$scope.toaddr = $('#toaddr').val();
	};

	$scope.startCall = function() {
		chrome.runtime.sendMessage({
			type: 'call',
			toaddr: $scope.toaddr
		});
	};

	$scope.answer = function(sipCall) {
		chrome.runtime.sendMessage({
			type: 'answer',
			session: sipCall.session
		});
	};

	$scope.hangup = function(sipCall) {
		chrome.runtime.sendMessage({
			type: 'hangup',
			session: sipCall.session
		});
	};

	$scope.dtmf = function(sipCall, digit) {
		chrome.runtime.sendMessage({
			type: 'dtmf',
			session: sipCall.session,
			digit: digit
		});
	};

	$scope.transfer = function(sipCall, toaddr) {
		chrome.runtime.sendMessage({
			type: 'transfer',
			session: sipCall.session,
			toaddr: sipCall.toaddr
		});
	};

	$scope.displayText = function(sipCall) {
		if(sipCall.started) {
			// TODO: Display duration since call started
			return "Active call";
		} else {
			return "Incoming call";
		}
	};

	$scope.stateIcon = function(sipCall) {
		if(sipCall.state == 'incoming') {
			return 'fa-exclamation';
		} else if(sipCall.state == 'active') {
			return 'fa-play';
		} else if(sipCall.state == 'hold') {
			return 'fa-pause';
		} else {
			return 'fa-question';
		}
	};
}

var SIPClient = angular.module('SIPClient', ['ui.bootstrap']);
SIPClient.controller('SIPClientCtrl', ['$scope', SIPClientCtrl]);
