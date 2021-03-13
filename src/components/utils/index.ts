import BigNumber from "bignumber.js";

const MIN_ACTION_TIME = 150;

export enum Colors {
  CHANGE = "#722ed1",
  CHANGE_DARK = "#722ed1",
  PENDING = "#1890ff",
  PENDING_DARK = "#1890ff",
  SEND = "#df4567",
  SEND_DARK = "#e04576",
  RECEIVE = "#52c41a",
  RECEIVE_DARK = "#26e8a7",
}

export enum TwoToneColors {
  CHANGE = "purple",
  CHANGE_DARK = "#722ed1",
  PENDING = "blue",
  PENDING_DARK = "#1890ff",
  SEND = "#e04576",
  SEND_DARK = "#e04576",
  RECEIVE = "green",
  RECEIVE_DARK = "#26e8a7",
}

// @TODO: map subtype to color?

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const refreshActionDelay = async (action: Function) => {
  const currentTime = new Date().getTime();

  await action();
  const actionTime = new Date().getTime() - currentTime;

  // Set a minimum so the ui doesn't look glitchy
  await sleep(actionTime > MIN_ACTION_TIME ? 0 : MIN_ACTION_TIME - actionTime);
};

export const rawToRai = (raw: string | number): number => {
  const value = new BigNumber(raw.toString());
  return value.shiftedBy(30 * -1).toNumber();
};

export const raiToRaw = (rai: string | number): number => {
  const value = new BigNumber(rai.toString());
  return value.shiftedBy(30).toNumber();
};

export const secondsToTime = (value: string | number): string => {
  const bigSeconds = new BigNumber(value.toString());

  const bigBinutes = bigSeconds.dividedBy(60);
  const minutes = (Math.floor(bigBinutes.toNumber()) % 60)
    .toString()
    .padStart(2, "0");
  const bigHours = bigBinutes.dividedBy(60);
  const hours = (Math.floor(bigHours.toNumber()) % 24)
    .toString()
    .padStart(2, "0");
  const bigDays = bigHours.dividedBy(24);
  const days = Math.floor(bigDays.toNumber()) % 30;
  const bigMonths = bigDays.dividedBy(30);
  const months = Math.floor(bigMonths.toNumber());

  return `${months ? `${months}M ` : ""}${
    days ? `${days}d ` : ""
  }${hours}h ${minutes}m`;
};

export const formatPublicAddress = (address: string): string => {
  const [, formattedAddress] = address.split("_");

  return formattedAddress;
};

export const ACCOUNT_REGEX = /((nano|xrb)_)?[0-9a-z]{60}/;
export const BLOCK_REGEX = /[0-9A-F]{64}/;

export const isValidAccountAddress = (address: string): boolean =>
  new RegExp(`^${ACCOUNT_REGEX.toString().replace(/\//g, "")}$`).test(address);

export const getAccountAddressFromText = (text: string): string | null => {
  const [, address] =
    text?.match(
      new RegExp(
        `[^sS]*?(${ACCOUNT_REGEX.toString().replace(/\//g, "")})[^sS]*?`,
      ),
    ) || [];
  return address;
};

export const isOpenAccountBlockHash = (hash: string): boolean =>
  /^[0]{64}$/.test(hash);

export const isValidBlockHash = (hash: string): boolean =>
  !/^[0]+$/.test(hash) &&
  new RegExp(`^${BLOCK_REGEX.toString().replace(/\//g, "")}$`).test(hash);

export const getAccountBlockHashFromText = (text: string): string | null => {
  const [, hash] =
    text?.match(
      new RegExp(
        `[^sS]*?(${BLOCK_REGEX.toString().replace(/\//g, "")})[^sS]*?`,
      ),
    ) || [];
  return hash;
};

export const timestampToDate = (timestamp: string | number) => {
  const date = new Date(timestamp);

  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}/${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours(),
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds(),
  ).padStart(2, "0")}`;
};

export const intToString = (value: number) => {
  var suffixes = ["", "K", "M"];
  var suffixNum = Math.floor(("" + value).length / 3);
  var shortValue: any = parseFloat(
    (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
      2,
    ),
  );
  if (shortValue % 1 !== 0) {
    shortValue = shortValue.toFixed(1);
  }
  return shortValue + suffixes[suffixNum];
};

export const toBoolean = (value: any) =>
  typeof value === "string"
    ? value.toLowerCase() === "true" ||
      !["", "0", "false"].includes(value.toLowerCase())
    : typeof value === "number"
    ? value !== 0
    : !!value;
