var assert = require('assert'),
  createContext = require('../').createContext;

var runtime = createContext('localhost:27017', 'test');

describe('Runtime', function(){
  it('should work', function(){
    assert(runtime.print, 'Missing print');
    assert(runtime.load, 'Missing load');
    assert(runtime.gc, 'Missing gc');
    assert(runtime.MinKey, 'Missing MinKey');
    assert(runtime.MaxKey, 'Missing MaxKey');
    assert(runtime.Mongo, 'Missing Mongo');
    assert(runtime.NumberInt, 'Missing NumberInt');
    assert(runtime.NumberLong, 'Missing NumberLong');
    assert(runtime.ObjectId, 'Missing ObjectId');
    assert(runtime.DBPointer, 'Missing DBPointer');
    assert(runtime.UUID, 'Missing UUID');
    assert(runtime.BinData, 'Missing BinData');
    assert(runtime.HexData, 'Missing HexData');
    assert(runtime.MD5, 'Missing MD5');
    assert(runtime.Map, 'Missing Map');
    assert(runtime.Timestamp, 'Missing Timestamp');
    assert(runtime.JSON, 'Missing JSON');
    assert(runtime._startMongoProgram, 'Missing _startMongoProgram');
    assert(runtime.runProgram, 'Missing runProgram');
    assert(runtime.run, 'Missing run');
    assert(runtime._runMongoProgram, 'Missing _runMongoProgram');
    assert(runtime.stopMongod, 'Missing stopMongod');
    assert(runtime.stopMongoProgram, 'Missing stopMongoProgram');
    assert(runtime.stopMongoProgramByPid, 'Missing stopMongoProgramByPid');
    assert(runtime.rawMongoProgramOutput, 'Missing rawMongoProgramOutput');
    assert(runtime.clearRawMongoProgramOutput, 'Missing clearRawMongoProgramOutput');
    assert(runtime.waitProgram, 'Missing waitProgram');
    assert(runtime.checkProgram, 'Missing checkProgram');
    assert(runtime.resetDbpath, 'Missing resetDbpath');
    assert(runtime.pathExists, 'Missing pathExists');
    assert(runtime.copyDbpath, 'Missing copyDbpath');
    assert(runtime.quit, 'Missing quit');
    assert(runtime.getMemInfo, 'Missing getMemInfo');
    assert(runtime._replMonitorStats, 'Missing _replMonitorStats');
    assert(runtime._srand, 'Missing _srand');
    assert(runtime._rand, 'Missing _rand');
    assert(runtime._isWindows, 'Missing _isWindows');
    assert(runtime.interpreterVersion, 'Missing interpreterVersion');
    assert(runtime.getBuildInfo, 'Missing getBuildInfo');
    assert(runtime.isKeyTooLarge, 'Missing isKeyTooLarge');
    assert(runtime.validateIndexKey, 'Missing validateIndexKey');
    });

});
