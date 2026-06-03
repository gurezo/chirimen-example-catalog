const DEVICE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const ALLOWED_EXAMPLES = ["adt7410", "bme280", "pca9685", "vl53l0x", "ads1115-loadcell"];
const REJECTED_EXAMPLES = ["ADT7410", "BME280", "i2c_ADT7410"];

export function validateDeviceId(deviceId: string): void {
  if (!deviceId) {
    throw new Error("deviceId is required");
  }

  if (deviceId.includes("_")) {
    throw new Error(
      `Invalid deviceId "${deviceId}": underscores are not allowed (e.g. use "${deviceId.replace(/_/g, "-")}" instead). Examples: ${ALLOWED_EXAMPLES.join(", ")}`,
    );
  }

  if (!DEVICE_ID_PATTERN.test(deviceId)) {
    throw new Error(
      `Invalid deviceId "${deviceId}": must be lowercase alphanumeric with optional hyphens. Allowed: ${ALLOWED_EXAMPLES.join(", ")}. Rejected: ${REJECTED_EXAMPLES.join(", ")}`,
    );
  }
}
