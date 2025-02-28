export const ERRORS = {
  unknown: "An error occured. Please try again",
  failed: "There is an error while performing this action",
};

export const ROOM_TYPE = [
  { name: "Fan", value: "fan" },
  { name: "Air-Conditioner", value: "ac" },
];

export const TIME_UNIT = [
  { name: "Hour", value: "hour" as "hour" | "day" },
  { name: "Day", value: "day" as "hour" | "day" },
];

export const ROOM_STATUES = {
  1: "available",
  2: "being_used",
  3: "unavailable",
};
