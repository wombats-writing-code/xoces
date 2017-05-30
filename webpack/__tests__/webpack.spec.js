require("babel-register");

let chai = require('chai');
let path = require('path')
chai.should();

const DIST_PATH = path.resolve(__dirname, '../../dist')
// import xoces from '../../dist/xoces-umd'

describe('dist build targets', function() {
  this.timeout(5000);

  it('should have the xoces lib in UMD target ', (done) => {
    let xoces = require(`${DIST_PATH}/umd/xoces-umd`)

    // console.log('\n xoces UMD', xoces, '\n');

    xoces.should.include.keys('widgets')
    done();
  })

  // it('should have the xoces lib in CommonJS target ', () => {
  //   let xoces = require(`${DIST_PATH}/xoces-commonjs2`)
  //
  //   console.log('\n xoces commonjs2', xoces, '\n');
  //
  //   xoces.should.include.keys('widgets')
  // })
  //
  // it('should have the xoces lib in var target ', () => {
  //   let xoces = require(`${DIST_PATH}/xoces-var`)
  //
  //   console.log('\n xoces var', xoces, '\n');
  //
  //   xoces.should.include.keys('widgets')
  // })

})
