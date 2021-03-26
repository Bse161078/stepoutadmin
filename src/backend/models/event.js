export class Event {
  constructor(x) {
    this.uuid = x.uuid;
    this.name = x.name;
    this.image = x.image;
    this.date = x.date;
    this.time = x.time;
    this.location = x.location;
    this.website = x.website;
    this.about = x.about;
    this.status = x.status;
    this.entry = x.entry;
    this.pairings = x.pairings;
    this.fee = x.fee;
    this.guestfee = x.guestfee;
    this.limit = x.limit;
    this.timestampAdded = x.timestampAdded;
    this.participants = x.participants;
    this.divisions = x.divisions;
    this.otherResults = x.otherResults;
    this.groups = x.groups;
    this.ntp = x.ntp;
    this.ntpPlayer = x.ntpPlayer;
    this.longestDrive = x.longestDrive;
    this.longestDrivePlayer = x.longestDrivePlayer;
    this.lowestGrose = x.lowestGrose;
    this.lowestGrosePlayer = x.lowestGrosePlayer;
  }

  static fromFirestore(doc) {
    const data = doc.data();

    if (!data) return null;

    return new Event({
      uuid: doc.id,
      name: data["name"] ? data["name"] : "",
      image: data["image"] ? data["image"] : [],
      date: data["date"] ? data["date"] : [],
      time: data["time"] ? data["time"] : [],
      location: data["location"] ? data["location"] : [],
      website: data["website"] ? data["website"] : [],

      fee: data["fee"] ? data["fee"] : [],
      guestfee: data["guestfee"] ? data["guestfee"] : [],
      limit: data["limit"] ? data["limit"] : [],

      about: data["about"] ? data["about"] : [],
      status: data["status"] !== undefined ? data["status"] : true,
      entry: data["entry"] !== undefined ? data["entry"] : true,
      pairings: data["pairings"] ? data["pairings"] : [],
      timestampAdded: new Date(),
      participants: data["participants"] ? data["participants"] : [],
      divisions: data["divisions"] ? data["divisions"] : [],
      otherResults: data["otherResults"] ? data["otherResults"] : [],

      groups: data["groups"] ? data["groups"] : [],

      ntp: data["ntp"] ? data["ntp"] : [],
      ntpPlayer: data["ntpPlayer"] ? data["ntpPlayer"] : [],

      longestDrive: data["longestDrive"] ? data["longestDrive"] : [],
      longestDrivePlayer: data["longestDrivePlayer"]
        ? data["longestDrivePlayer"]
        : [],

      lowestGrose: data["lowestGrose"] ? data["lowestGrose"] : [],
      lowestGrosePlayer: data["lowestGrosePlayer"]
        ? data["lowestGrosePlayer"]
        : [],
    });
  }

  toJson(x) {
    return {
      uuid: x.uuid,
      name: x.name,
      image: x.image,
      date: x.date,
      time: x.time,
      fee: x.fee,
      guestfee: x.guestfee,
      limit: x.limit,

      location: x.location,
      website: x.website,
      about: x.about,
      status: x.status,
      entry: x.entry,
      pairings: x.pairings,
      timestampAdded: x.timestampAdded,
      participants: x.participants,
      divisions: x.divisions,
      otherResults: x.otherResults,
      groups: x.groups,

      ntp: x.ntp,
      ntpPlayer: x.ntpPlayer,

      longestDrive: x.longestDrive,
      longestDrivePlayer: x.longestDrivePlayer,

      lowestGrose: x.lowestGrose,
      lowestGrosePlayer: x.lowestGrosePlayer,
    };
  }
}
