var Model = require('../../src/backbone.base.model'),
    _ = require('underscore');

describe('backbone.base.model', function() {
    it('provide a deep cloned copy of the attribute set when calling toJSON', function() {
        var Extended = Model.extend({});
        var o = new Extended({
            name: 'davide',
            geo:  {
                origin: 'Italy',
                current: 'UK',
                livedAt: ['Italy', 'Spain', 'UK']
            }
        });

        var jsonified = o.toJSON();

        jsonified.geo.origin = "Unknown";
        jsonified.geo.livedAt[2] = "Moon";

        expect(o.attributes.geo.origin).to.equal("Italy");
        expect(o.attributes.geo.livedAt[2]).to.equal("UK");
    });
});