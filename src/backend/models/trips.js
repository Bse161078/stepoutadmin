export class Trips {
    constructor(x) {
      this.Name = x.Name;
      this.Rating = x.Rating;
      this.Reviews = x.Reviews;
      this.Venues = x.Venues;
      this.endTime = x.endTime;
      this.id = x.id;
      this.Image=x.Image;
      this.Description=x.Description;
      this.startTime = x.startTime;
      this.totalTime = x.totalTime;
      this.restaurants = x.restaurants
      this.IndoorActivities = x.IndoorActivities
      this.OutdoorActivities = x.OutdoorActivities
    }
  
    static fromFirestore(doc) {
      const data = doc.data();
  
      if (!data) return null;
  
      return new Trips({
        id: doc.id,
        endTime: data["endTime"] ? data["endTime"] : "",
        Image: data["Image"] ? data["Image"] : "",
        Venues: data["Venues"] ? data["Venues"] : "",
        Name: data["Name"] ? data["Name"] : "",
        Rating: data["Rating"] ? data["Rating"] : "",
        Description:data["Description"] ? data["Description"] : "",
        Reviews: data["Reviews"] ? data["Reviews"] : "",
        totalTime: data["totalTime"] ? data["totalTime"] : "",
        startTime: data["startTime"] ? data["startTime"] : "",
        id: data["id"] ? data["id"] : "",
        IndoorActivities: data["IndoorActivities"] ? data["IndoorActivities"] : "",
        OutdoorActivities: data["OutdoorActivities"] ? data["OutdoorActivities"] : "",
        restaurants: data["restaurants"] ? data["restaurants"] : "",
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
        handicap: x.handicap,
        membership: x.membership,
        membership_fee_status:x.membership_fee_status,
        credit:x.credit,
        timestampRegister: x.timestampRegister,
        profileImage: x.profileImage,
      };
    }
  }
  