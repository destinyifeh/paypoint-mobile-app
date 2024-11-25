import crashlytics from '@react-native-firebase/crashlytics';

var logOfConsole = [];

var _log = console.log,
  _warn = console.warn,
  _error = console.error;

// console.log = function() {
//   crashlytics().log('[INFO]', JSON.stringify(Object.values(arguments)));
//   // crashlytics().crash();
//   logOfConsole.push({method: 'log', arguments: arguments});
//   return _log.apply(console, arguments);
// };

console.warn = function() {
  crashlytics().log('[WARN]', JSON.stringify(Object.values(arguments)));
  crashlytics().log(JSON.stringify(Object.values(arguments)));
  logOfConsole.push({method: 'warn', arguments: arguments});
  return _warn.apply(console, arguments);
};

console.error = function() {
  crashlytics().log('[ERROR]', JSON.stringify(Object.values(arguments)));
  // crashlytics().log(JSON.stringify(Object.values(arguments)));
  logOfConsole.push({method: 'error', arguments: arguments});
  return _error.apply(console, arguments);
};
