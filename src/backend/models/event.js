export class Event {
  constructor(x) {
    console.log("This si the data url",x.url)
    this.uuid = x.uuid;
    this.url = x.url;
    this.score_board_url = x.score_board_url;
    this.golf_course = x.golf_course;
    this.name = x.name;
    this.foodItem = x.foodItem;
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
    this.closeFoodEntry = x.closeFoodEntry;

    
    this.executive_fee = x.executive_fee;
    this.golf_guest_fee = x.golf_guest_fee;
    this.social_guest_fee = x.social_guest_fee;
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

    console.log("This is the data of the event",data)

    if (!data) return null;
    return new Event({
      uuid: doc.id,
      name: data["name"] ? data["name"] : "",
      foodItem: data["foodItem"] ? data["foodItem"] : "",
      url: data["url"] ? data["url"] : "",
      score_board_url: data["score_board_url"] ? data["score_board_url"] : "",
      golf_course: data["golf_course"] ? data["golf_course"] : "",
      image: data["image"] ? data["image"] : [],
      date: data["date"] ? data["date"] : [],
      time: data["time"] ? data["time"] : [],
      location: data["location"] ? data["location"] : [],
      website: data["website"] ? data["website"] : [],
      closeFoodEntry: data["closeFoodEntry"],
      guest_first_name: data["guest_first_name"],
      guest_last_name: data["guest_last_name"],
      fee: data["fee"] ? data["fee"] : [],
      executive_fee: data["executive_fee"] ? data["executive_fee"] : [],
      golf_guest_fee: data["golf_guest_fee"] ? data["golf_guest_fee"] : [],
      social_guest_fee: data["social_guest_fee"] ? data["social_guest_fee"] : [],
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
      foodItem: x.foodItem,
      url : x.url,
      score_board_url : x.score_board_url,
      golf_course : x.golf_course,
      image: x.image,
      date: x.date,
      time: x.time,
      fee: x.fee,
      executive_fee : x.executive_fee,
      golf_guest_fee : x.golf_guest_fee,
      social_guest_fee : x.social_guest_fee,
      guestfee: x.guestfee,
      limit: x.limit,
      closeFoodEntry: x.closeFoodEntry,
      
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
