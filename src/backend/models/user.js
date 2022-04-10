export class User {
  constructor(x) {
    this.IndoorActivities = x.IndoorActivities;
    this.OutdoorActivities = x.OutdoorActivities;
    this.Restaurants = x.Restaurants;
    this.dob = x.dob;
    this.email = x.email;
    this.firstname = x.firstname;
    this.gender = x.gender;
    this.id = x.id;
    this.lastname = x.lastname;
    this.occupation = x.occupation;
    this.updatedTripLocation = x.updatedTripLocation;
    this.signup_stage = x.signup_stage;
    this.username = x.username;
  }

  static fromFirestore(doc) {
    const data = doc.data();

    if (!data) return null;

    return new User({
      id: doc.id,
      IndoorActivities: data["IndoorActivities"] ? data["IndoorActivities"] : "",
      OutdoorActivities: data["OutdoorActivities"] ? data["OutdoorActivities"] : "",
      Restaurants: data["Restaurants"] ? data["Restaurants"] : "",
      dob: data["dob"] ? data["dob"] : "",
      occupation: data["occupation"] ? data["occupation"] : "",
      email: data["email"] ? data["email"] : "",
      firstname: data["firstname"] ? data["firstname"] : "",
      updatedTripLocation: data["updatedTripLocation"] ? data["updatedTripLocation"] : "",
      gender: data["gender"] ? data["gender"] : "",
      lastname: data["lastname"] ? data["lastname"] : "Unknown",
      signup_stage: data["signup_stage"] ? data["signup_stage"] : "Unknown",
      username: data["username"],

      

      // sneakerCount: data['sneakerCount'] ? data['sneakerCount'] : '',
      // sneakerScans: data['sneakerScans'] ? data['sneakerScans'] : '',
      timestampRegister: data["timestampRegister"]
        ? data["timestampRegister"]
        : "",
      profileImage: data["profileImage"] ? data["profileImage"] : "",
    });
  }

  toJson(x) {
    return {
      uuid: x.uuid,
      name: x.name,
      fname: x.fname,
      lname: x.lname,
      email: x.email,
      isActive: x.isActive,
      phone: x.phone,
      // fcmToken: x.fcmToken,
      // collections: x.collections,
      // sneakerSize: x.sneakerSize,
      handicap: x.handicap,
      membership: x.membership,
      membership_fee_status:x.membership_fee_status,
      credit:x.credit,
      // sneakerCount: x.sneakerCount,
      // sneakerScans: x.sneakerScans,
      timestampRegister: x.timestampRegister,
      profileImage: x.profileImage,
    };
  }
}
