var CrudEntityDefinition = {
  customer: {
    key: 'id',
    indexes: [{
      name: 'lastName',
      key: 'lastName',
      unique: false
    }]
  },
  item: {
    key: 'id',
    indexes: []
  }
};

var crudDBPromise = Umbrella.open('crudTestDB', 13, CrudEntityDefinition);
var testO1 = {
  id: 1,
  firstName: 'Tomas',
  lastName: 'Gates'
};
var test02 = {
  id: 2,
  firstName: 'Jonas',
  lastName: 'Bobyrot'
};

var crudDB;

describe('Loading UmbrellaJS library', function() {
  it('should not be undefined', function() {
    expect(Umbrella).toBeDefined();
  });

  it('should load database', function() {
    var flag = false;

    runs(function() {
      crudDBPromise.then(function(db) {
        crudDB = db;
        expect(true).toBe(true);
        flag = true;
      }, function(error) {
        expect(false).toBe(true);
      });
    });

    waitsFor(function() {
      return flag;
    }, 'database should become ready', 2000);
  });
});

describe('UmbrellaJS crud operations', function() {
  it('should support add', function() {
    var flag = false;
    var result;

    runs(function() {
      var promise1 = crudDB.store('customer').add(testO1);
      var promise2 = crudDB.store('customer').add(test02);
      Q.all([promise1, promise2]).then(function() {
        crudDB.store('customer', true).toArray().then(function(result) {
          expect(result[0].id).toBe(1);
          expect(result[1].id).toBe(2);
          expect(result.length).toBe(2);
          flag = true;
        });
      }, function() {
        expect(false).toBeTruthy();
        flag = true;
      });
    });

    waitsFor(function() {
      return flag;
    }, 3000);
  });

  it('should support remove by object', function() {
    var flag = false;
    var result;

    runs(function() {
      var promise1 = crudDB.store('customer').remove(testO1);

      Q.all([promise1]).then(function() {
        crudDB.store('customer', true).toArray().then(function(result) {
          expect(result[0].id).toBe(2);
          expect(result.length).toBe(1);
          flag = true;
        });
      }, function() {
        expect(false).toBeTruthy();
        flag = true;
      });
    });

    waitsFor(function() {
      return flag;
    }, 3000);
  });

  it('should support remove by key', function() {
    var flag = false;
    var result;

    runs(function() {
      var promise1 = crudDB.store('customer').remove(2);

      Q.all([promise1]).then(function() {
        crudDB.store('customer', true).toArray().then(function(result) {
          expect(result.length).toBe(0);
          flag = true;
        });
      }, function() {
        expect(false).toBeTruthy();
        flag = true;
      });
    });

    waitsFor(function() {
      return flag;
    }, 3000);
  });

  it('should support deleting the database', function() {
    var flag = false;

    runs(function() {
      Umbrella.deleteDatabase('crudTestDB').then(function() {
        expect(true).toBe(true);
        flag = true;
      }, function(e) {
        flag = true;
      });
    });

    waitsFor(function() {
      return flag;
    }, 'database should be deleted', 4000);
  });
});