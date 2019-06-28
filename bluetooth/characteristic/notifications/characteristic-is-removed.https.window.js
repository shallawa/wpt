// META: script=/resources/testharness.js
// META: script=/resources/testharnessreport.js
// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-helpers.js
'use strict';
const test_desc = 'Characteristic is removed. Reject with InvalidStateError.';
const expected = new DOMException(
    'GATT Characteristic no longer exists.', 'InvalidStateError');

bluetooth_test(async () => {
  let {characteristic, fake_characteristic} =
      await getMeasurementIntervalCharacteristic();
  await fake_characteristic.remove();
  assert_promise_rejects_with_message(
      characteristic.startNotifications(), expected,
      'Characteristic got removed.');
}, test_desc);
