var extend = require('../../src/extend'),
    _ = require('underscore');

describe('extend', function() {
    it('exports a function', function() {
        expect(_.isFunction(extend)).to.be.true;
    });

    it('clones an object deeply', function() {
        var source = {
            subobj: {
                name: 'name',
                lastname: 'lastname'
            },
            subarr: [
                {name: 'arrname1'}, {name:'arrname2'}
            ]
        };

        var outcome = extend(true, {}, source);

        //alter outcome
        outcome.subobj.name = "altered";
        outcome.subarr[1].name = "alteredname";

        expect(source.subobj.name).to.equal('name');
        expect(source.subarr[1].name).to.equal('arrname2');
    });
});