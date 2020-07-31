'use strict'

const chai = require('chai')
  .use(require('dirty-chai'))
const { expect } = chai

const util = require('../src/helpers/util')

module.exports = () => {
  describe('## util-tests', () => {
    it('isNil - it should return false in case that the value is not null or undefined', () => {
      expect(util.isNil(true)).to.be.false()
      expect(util.isNil(false)).to.be.false()
      expect(util.isNil('test')).to.be.false()
      expect(util.isNil(0)).to.be.false()
      expect(util.isNil({})).to.be.false()
      expect(util.isNil([])).to.be.false()
      expect(util.isNil(NaN)).to.be.false()
    })

    it('isNil - it should return true in case that the value is null or undefined', () => {
      expect(util.isNil(null)).to.be.true()
      expect(util.isNil(undefined)).to.be.true()
      expect(util.isNil()).to.be.true()
    })
  })
}
