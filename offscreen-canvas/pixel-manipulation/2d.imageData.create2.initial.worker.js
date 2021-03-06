// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.imageData.create2.initial
// Description:createImageData(sw, sh) returns transparent black data of the right size
// Note:

importScripts("/resources/testharness.js");
importScripts("/common/canvas-tests.js");

var t = async_test("createImageData(sw, sh) returns transparent black data of the right size");
t.step(function() {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

var imgdata = ctx.createImageData(10, 20);
_assertSame(imgdata.data.length, imgdata.width*imgdata.height*4, "imgdata.data.length", "imgdata.width*imgdata.height*4");
_assert(imgdata.width < imgdata.height, "imgdata.width < imgdata.height");
_assert(imgdata.width > 0, "imgdata.width > 0");
var isTransparentBlack = true;
for (var i = 0; i < imgdata.data.length; ++i)
    if (imgdata.data[i] !== 0)
        isTransparentBlack = false;
_assert(isTransparentBlack, "isTransparentBlack");

t.done();

});
done();
