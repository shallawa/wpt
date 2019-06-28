// META: script=/resources/testharness.js
// META: script=/resources/testharnessreport.js
// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-helpers.js
'use strict';
const test_desc = 'writeValue() fails when passed a detached buffer';

function detachBuffer(buffer) {
  window.postMessage('', '*', [buffer]);
}

bluetooth_test(async (t) => {
  let {characteristic, fake_characteristic} =
      await getMeasurementIntervalCharacteristic();

  let typed_array = Uint8Array.of(1, 2);
  detachBuffer(typed_array.buffer);
  await promise_rejects(
      t, 'InvalidStateError', characteristic.writeValue(typed_array));

  let array_buffer = Uint8Array.of(3, 4).buffer;
  detachBuffer(array_buffer);
  await promise_rejects(
      t, 'InvalidStateError', characteristic.writeValue(array_buffer));
}, test_desc);
