// META: script=/resources/testharness.js
// META: script=/resources/testharnessreport.js
// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-helpers.js
'use strict';
const test_desc = 'A regular write request to a writable characteristic ' +
    'should succeed.';

bluetooth_test(async () => {
  let {characteristic, fake_characteristic} =
      await getMeasurementIntervalCharacteristic();

  let last_value = await fake_characteristic.getLastWrittenValue();
  await assert_equals(last_value, null);

  await fake_characteristic.setNextWriteResponse(GATT_SUCCESS);

  let typed_array = Uint8Array.of(1, 2);
  await characteristic.writeValue(typed_array);
  last_value = await fake_characteristic.getLastWrittenValue();
  await assert_array_equals(last_value, [1, 2]);

  await fake_characteristic.setNextWriteResponse(GATT_SUCCESS);

  let array_buffer = Uint8Array.of(3, 4).buffer;
  await characteristic.writeValue(array_buffer);
  last_value = await fake_characteristic.getLastWrittenValue();
  await assert_array_equals(last_value, [3, 4]);

  await fake_characteristic.setNextWriteResponse(GATT_SUCCESS);

  let data_view = new DataView(new ArrayBuffer(2));
  data_view.setUint8(0, 5);
  data_view.setUint8(1, 6);
  await characteristic.writeValue(data_view);
  last_value = await fake_characteristic.getLastWrittenValue();
  await assert_array_equals(last_value, [5, 6]);
}, test_desc);
