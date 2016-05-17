var expect = require("chai").expect;
var valtree = require("..");

describe('Valtree', function() {
    var json, obj;

    beforeEach(function() {
        json = {
            'foo': [
                'apple',
                'pear'
            ],
            'bar': {
                'apple': 0,
                'pear': 1
            },
            'first': {
                'second': {
                    'third': 'last'
                }
            }
        };
        obj = valtree(json);
    });

    describe('#instance', function() {

        it('should get undefined value by an unexisting property', function() {
            expect(obj()).to.not.exist;
            expect(obj('foobar')).to.not.exist;
            expect(obj()).to.not.exist;
        });

        it('should get value from first level property', function() {
            expect(obj('first')).to.be.ok;
            expect(obj('first')).to.have.property('second');
            expect(obj('first')).to.be.equal(json['first']);
        });

        it('should get value from second level property', function() {
            expect(obj('first.second')).to.be.ok;
            expect(obj('first.second')).to.have.property('third');
            expect(obj('first.second')).to.be.equal(json['first']['second']);
        });

        it('should get value from third level property', function() {
            expect(obj('first.second.third')).to.be.ok;
            expect(obj('first.second.third')).to.be.equal('last');
            expect(obj('first.second.third')).to.be.equal(json['first']['second']['third']);
        });

        it('should replace value from first.second.third to first.second properties', function() {

            var value = obj('first.second', obj('first.second.third'), true);

            expect(value).to.be.ok;
            expect(value).to.have.property('third');
            expect(value).to.not.be.equal(json['first']['second']);
            expect(obj('first.second')).to.not.have.property('third');
            expect(obj('first.second')).to.be.equal('last');
            expect(obj('first.second')).to.be.equal(json['first']['second']);
            expect(obj('first.second.third')).to.not.exist;
        });

        it('should switch value from bar.apple to bar.pear properties', function() {
            var value = obj('bar.apple', obj('bar.pear', obj('bar.apple'), true), true);

            expect(value).to.be.exist;
            expect(value).to.be.equal(json['bar']['pear']);
            expect(value).to.be.not.equal(json['bar']['apple']);
            expect(obj('bar.pear')).to.be.equal(json['bar']['pear']);
            expect(obj('bar.pear')).to.be.not.equal(json['bar']['apple']);
            expect(obj('bar.apple')).to.be.equal(json['bar']['apple']);
            expect(obj('bar.apple')).to.be.not.equal(json['bar']['pear']);
        });

        it('should switch value from foo.apple to foo.pear properties', function() {

            var value = obj('foo.0', obj('foo.1', obj('foo.0'), true), true);

            expect(value).to.be.exist;
            expect(value).to.be.equal(json['foo']['1']);
            expect(value).to.be.not.equal(json['foo']['0']);
            expect(obj('foo.1')).to.be.equal(json['foo']['1']);
            expect(obj('foo.1')).to.be.not.equal(json['foo']['0']);
            expect(obj('foo.0')).to.be.equal(json['foo']['0']);
            expect(obj('foo.0')).to.be.not.equal(json['foo']['1']);
        });

        it('should create nested property when undefined parents', function() {

            expect(obj('one.two')).to.not.be.exist;

            var last = obj('one.two.three.for.five', 'six', true);
            var current = obj('1.2.3.4.5', '6');

            expect(last).to.be.undefined;
            expect(obj('one.two')).to.be.exist;
            expect(obj('one.two.three')).to.has.property('for');
        });
    });

    describe('#inline', function() {
        it('should works as instance version', function() {
            expect(valtree(json, 'first')).to.be.equal(obj('first'));
            expect(valtree(json, 'foobar')).to.be.equal(obj('foobar'));
        });

        it('should throw an exception', function() {
            expect(valtree.bind()).to.throw(TypeError);
            expect(valtree.bind()).to.throw('obj must be an Object instance');
        });
    });
});
