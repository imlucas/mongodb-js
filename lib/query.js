// autogenerated shim -->
var co = require('co');
co(function *(){
module.exports = DBQuery;
module.exports.DBCommandCursor = DBCommandCursor;

var assert = require('assert'),
  DBQuery = require('./query'),
  types = require('./types'),
  tojson = types.tojson,
  utils = require('./utils'),
  _verboseShell = utils._verboseShell,
  __magicNoPrint = utils.__magicNoPrint,
  ___it___ = process.___it___,
  QueryPlan;
// <-- autogenerated shim
function DBQuery(mongo, db, collection, ns, query, fields, limit, skip, batchSize, options) {
  this._mongo = mongo;
  // 0
  this._db = db;
  // 1
  this._collection = collection;
  // 2
  this._ns = ns;
  // 3
  this._query = query || {};
  // 4
  this._fields = fields;
  // 5
  this._limit = limit || 0;
  // 6
  this._skip = skip || 0;
  // 7
  this._batchSize = batchSize || 0;
  this._options = options || 0;
  this._cursor = null;
  this._numReturned = 0;
  this._special = false;
  this._prettyShell = false;
}
DBQuery.prototype.help = function() {
  print('find() modifiers');
  print('\t.sort( {...} )');
  print('\t.limit( n )');
  print('\t.skip( n )');
  print('\t.count(applySkipLimit) - total # of objects matching query. by default ignores skip,limit');
  print('\t.size() - total # of objects cursor would return, honors skip,limit');
  print('\t.explain([verbose])');
  print('\t.hint(...)');
  print('\t.addOption(n) - adds op_query options -- see wire protocol');
  print('\t._addSpecial(name, value) - http://dochub.mongodb.org/core/advancedqueries#AdvancedQueries-Metaqueryoperators');
  print('\t.batchSize(n) - sets the number of docs to return per getMore');
  print('\t.showDiskLoc() - adds a $diskLoc field to each returned object');
  print('\t.min(idxDoc)');
  print('\t.max(idxDoc)');
  print('\t.comment(comment)');
  print('\t.snapshot()');
  print('\t.readPref(mode, tagset)');
  print('\nCursor methods');
  print('\t.toArray() - iterates through docs and returns an array of the results');
  print('\t.forEach( func )');
  print('\t.map( func )');
  print('\t.hasNext()');
  print('\t.next()');
  print('\t.objsLeftInBatch() - returns count of docs left in current batch (when exhausted, a new getMore will be issued)');
  print('\t.itcount() - iterates through documents and counts them');
  print('\t.getQueryPlan() - get query plans associated with shape. To get more info on query plans, ' + 'call getQueryPlan().help().');
  print('\t.pretty() - pretty print each document, possibly over multiple lines');
};
DBQuery.prototype.clone = function() {
  var q = new DBQuery(this._mongo, this._db, this._collection, this._ns, this._query, this._fields, this._limit, this._skip, this._batchSize, this._options);
  q._special = this._special;
  return q;
};
DBQuery.prototype._ensureSpecial = function() {
  if (this._special)
    return;
  var n = {
    query: this._query
  };
  this._query = n;
  this._special = true;
};
DBQuery.prototype._checkModify = function() {
  if (this._cursor)
    throw 'query already executed';
};
DBQuery.prototype._exec = function *() {
  if (!this._cursor) {
    assert.eq(0, this._numReturned);
    this._cursor = yield this._mongo.find(this._ns, this._query, this._fields, this._limit, this._skip, this._batchSize, this._options);
    this._cursorSeen = 0;
  }
  return this._cursor;
};
DBQuery.prototype.limit = function(limit) {
  this._checkModify();
  this._limit = limit;
  return this;
};
DBQuery.prototype.batchSize = function(batchSize) {
  this._checkModify();
  this._batchSize = batchSize;
  return this;
};
DBQuery.prototype.addOption = function(option) {
  this._options |= option;
  return this;
};
DBQuery.prototype.skip = function(skip) {
  this._checkModify();
  this._skip = skip;
  return this;
};
DBQuery.prototype.hasNext = function *() {
  this._exec();
  if (this._limit > 0 && this._cursorSeen >= this._limit)
    return false;
  var o = yield this._cursor.hasNext();
  return o;
};
DBQuery.prototype.next = function *() {
  yield this._exec();
  var o = yield this._cursor.hasNext();
  if (o) {
    this._cursorSeen++;
  }
  else
    throw 'error hasNext: ' + o;
  var ret = yield this._cursor.next();
  if (ret.$err)
    throw 'error: ' + tojson(ret);
  this._numReturned++;
  return ret;
};
DBQuery.prototype.objsLeftInBatch = function *() {
  yield this._exec();
  var ret = yield this._cursor.objsLeftInBatch();
  if (ret.$err)
    throw 'error: ' + tojson(ret);
  return ret;
};
DBQuery.prototype.readOnly = function *() {
  yield this._exec();
  yield this._cursor.readOnly();
  return this;
};
DBQuery.prototype.toArray = function *() {
  if (this._arr)
    return this._arr;
  var a = [];
  while (yield this.hasNext()) {
    a.push(yield this.next());
  }
  this._arr = a;
  return a;
};
DBQuery.prototype.count = function *(applySkipLimit) {
  var cmd = {
    count: this._collection.getName()
  };
  if (this._query) {
    if (this._special) {
      cmd.query = this._query.query;
      if (this._query.$maxTimeMS) {
        cmd.maxTimeMS = this._query.$maxTimeMS;
      }
      if (this._query.$hint) {
        cmd.hint = this._query.$hint;
      }
    } else {
      cmd.query = this._query;
    }
  }
  cmd.fields = this._fields || {};
  if (applySkipLimit) {
    if (this._limit) {
      cmd.limit = this._limit;
    }
    if (this._skip) {
      cmd.skip = this._skip;
    }
  }
  var res = yield this._db.runCommand(cmd);
  if (res && res.n !== null)
    return res.n;
  throw 'count failed: ' + tojson(res);
};
DBQuery.prototype.size = function *() {
  return yield this.count(true);
};
DBQuery.prototype.countReturn = function *() {
  var c = yield this.count();
  if (this._skip) {
    c = c - this._skip;
  }
  if (this._limit > 0 && this._limit < c)
    return this._limit;
  return c;
};
/**
* iterative count - only for testing
*/
DBQuery.prototype.itcount = function *() {
  var num = 0;
  while (yield this.hasNext()) {
    num++;
    yield this.next();
  }
  return num;
};
DBQuery.prototype.length = function *() {
  return yield this.toArray().length;
};
DBQuery.prototype._addSpecial = function(name, value) {
  this._ensureSpecial();
  this._query[name] = value;
  return this;
};
DBQuery.prototype.sort = function(sortBy) {
  return this._addSpecial('orderby', sortBy);
};
DBQuery.prototype.hint = function(hint) {
  return this._addSpecial('$hint', hint);
};
DBQuery.prototype.min = function(min) {
  return this._addSpecial('$min', min);
};
DBQuery.prototype.max = function(max) {
  return this._addSpecial('$max', max);
};
DBQuery.prototype.showDiskLoc = function() {
  return this._addSpecial('$showDiskLoc', true);
};
DBQuery.prototype.maxTimeMS = function(maxTimeMS) {
  return this._addSpecial('$maxTimeMS', maxTimeMS);
};
/**
 * Sets the read preference for this cursor.
 *
 * @param mode {string} read prefrence mode to use.
 * @param tagSet {Array.<Object>} optional. The list of tags to use, order matters.
 *     Note that this object only keeps a shallow copy of this array.
 *
 * @return this cursor
 */
DBQuery.prototype.readPref = function(mode, tagSet) {
  var readPrefObj = {
    mode: mode
  };
  if (tagSet) {
    readPrefObj.tags = tagSet;
  }
  return this._addSpecial('$readPreference', readPrefObj);
};
DBQuery.prototype.forEach = function *(func) {
  while (yield this.hasNext()) {
    func(yield this.next());
  }
};
DBQuery.prototype.map = function *(func) {
  var a = [];
  while (yield this.hasNext()) {
    a.push(func(yield this.next()));
  }
  return a;
};
DBQuery.prototype.arrayAccess = function *(idx) {
  return (yield this.toArray())[idx];
};
DBQuery.prototype.comment = function(comment) {
  return this._addSpecial('$comment', comment);
};
DBQuery.prototype.explain = function *(verbose) {
  /* verbose=true --> include allPlans, oldPlan fields */
  var n = this.clone();
  n._addSpecial('$explain', true);
  n._limit = Math.abs(n._limit) * -1;
  var e = yield n.next();
  function cleanup(obj) {
    if (typeof obj !== 'object') {
      return;
    }
    delete obj.allPlans;
    delete obj.oldPlan;
    delete obj.stats;
    if (typeof obj.length === 'number') {
      for (var i = 0; i < obj.length; i++) {
        cleanup(obj[i]);
      }
    }
    if (obj.shards) {
      for (var key in obj.shards) {
        cleanup(obj.shards[key]);
      }
    }
    if (obj.clauses) {
      cleanup(obj.clauses);
    }
  }
  if (!verbose) {
    cleanup(e);
  }
  return e;
};
DBQuery.prototype.snapshot = function() {
  return this._addSpecial('$snapshot', true);
};
DBQuery.prototype.pretty = function() {
  this._prettyShell = true;
  return this;
};
DBQuery.prototype.shellPrint = function *() {
  try {
    var start = new Date().getTime();
    var n = 0;
    while (this.hasNext() && n < DBQuery.shellBatchSize) {
      var s = this._prettyShell ? tojson(yield this.next()) : tojson(yield this.next(), '', true);
      print(s);
      n++;
    }
    if (typeof _verboseShell !== 'undefined' && _verboseShell) {
      var time = new Date().getTime() - start;
      print('Fetched ' + n + ' record(s) in ' + time + 'ms');
    }
    if (yield this.hasNext()) {
      print('Type "it" for more');
      ___it___ = this;
    } else {
      ___it___ = null;
    }
  } catch ( e ) {
    print(e);
  }
};
/**
 * Returns a QueryPlan for the query.
 */
DBQuery.prototype.getQueryPlan = function() {
  return new QueryPlan(this);
};
DBQuery.prototype.toString = function() {
  return 'DBQuery: ' + this._ns + ' -> ' + tojson(this._query);
};
DBQuery.shellBatchSize = 20;
/**
 * Query option flag bit constants.
 * @see http://dochub.mongodb.org/core/mongowireprotocol#MongoWireProtocol-OPQUERY
 */
DBQuery.Option = {
  tailable: 2,
  slaveOk: 4,
  oplogReplay: 8,
  noTimeout: 16,
  awaitData: 32,
  exhaust: 64,
  partial: 128
};
function DBCommandCursor(mongo, cmdResult, batchSize) {
  assert.commandWorked(cmdResult);
  this._firstBatch = cmdResult.cursor.firstBatch.reverse();
  // modifies input to allow popping
  this._cursor = mongo.cursorFromId(cmdResult.cursor.ns, cmdResult.cursor.id, batchSize);
}
DBCommandCursor.prototype = {};
DBCommandCursor.prototype.hasNext = function *() {
  return this._firstBatch.length || this._cursor.hasNext();
};
DBCommandCursor.prototype.next = function *() {
  if (this._firstBatch.length) {
    // $err wouldn't be in _firstBatch since ok was true.
    return this._firstBatch.pop();
  } else {
    var ret = yield this._cursor.next();
    if (ret.$err)
      throw 'error: ' + tojson(ret);
    return ret;
  }
};
DBCommandCursor.prototype.objsLeftInBatch = function *() {
  if (this._firstBatch.length) {
    return this._firstBatch.length;
  } else {
    return yield this._cursor.objsLeftInBatch();
  }
};
DBCommandCursor.prototype.help = function() {
  // This is the same as the "Cursor Methods" section of DBQuery.help().
  print('\nCursor methods');
  print('\t.toArray() - iterates through docs and returns an array of the results');
  print('\t.forEach( func )');
  print('\t.map( func )');
  print('\t.hasNext()');
  print('\t.next()');
  print('\t.objsLeftInBatch() - returns count of docs left in current batch (when exhausted, a new getMore will be issued)');
  print('\t.itcount() - iterates through documents and counts them');
  print('\t.pretty() - pretty print each document, possibly over multiple lines');
};
// Copy these methods from DBQuery
DBCommandCursor.prototype.toArray = DBQuery.prototype.toArray;
DBCommandCursor.prototype.forEach = DBQuery.prototype.forEach;
DBCommandCursor.prototype.map = DBQuery.prototype.map;
DBCommandCursor.prototype.itcount = DBQuery.prototype.itcount;
DBCommandCursor.prototype.shellPrint = DBQuery.prototype.shellPrint;
DBCommandCursor.prototype.pretty = DBQuery.prototype.pretty;
/**
 * QueryCache
 * Holds a reference to the cursor.
 * Proxy for planCache* query shape-specific commands.
 */
if (typeof QueryPlan === 'undefined') {
  QueryPlan = function(cursor) {
    this._cursor = cursor;
  };
}
/**
 * Name of QueryPlan.
 * Same as collection.
 */
QueryPlan.prototype.getName = function() {
  return this._cursor._collection.getName();
};
/**
 * tojson prints the name of the collection
 */
QueryPlan.prototype.tojson = function *() {
  return tojson(yield this.getPlans());
};
/**
 * Displays help for a PlanCache object.
 */
QueryPlan.prototype.help = function() {
  print('QueryPlan help');
  print('\t.help() - show QueryPlan help');
  print('\t.clearPlans() - drops query shape from plan cache');
  print('\t.getPlans() - displays the cached plans for a query shape');
  return __magicNoPrint;
};
/**
 * List plans for a query shape.
 */
QueryPlan.prototype.getPlans = function *() {
  return yield this._cursor._collection.getPlanCache().getPlansByQuery(this._cursor);
};
/**
 * Drop query shape from the plan cache.
 */
QueryPlan.prototype.clearPlans = function *() {
  yield this._cursor._collection.getPlanCache().clearPlansByQuery(this._cursor);
  return;
};
})();
