// META: script=/resources/testharness.js
// META: script=/resources/testharnessreport.js
// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-helpers.js
'use strict';
const test_desc = 'Same parent service returned from multiple characteristics.';

bluetooth_test(async () => {
  let {service} = await getHealthThermometerService();
  let characteristics = await Promise.all([
    service.getCharacteristic('measurement_interval'),
    service.getCharacteristic('temperature_measurement')
  ]);
  assert_equals(characteristics[0].service, characteristics[1].service);
}, test_desc);
