export class Venue {
    constructor(x) {
      this.Address = x.Address;
      this.Description = x.Description;
      this.Image = x.Image;
      this.Images = x.Images;
      this.Name = x.Name;
      this.Rating = x.Rating;
      this.Reviews = x.Reviews;
      this.Time = x.Time;
      this.Restaurants = x.Restaurants;
      this.IndoorActivities = x.IndoorActivities;
      this.OutdoorActivities = x.OutdoorActivities;
      this.endTime = x.endTime;
      this.id = x.id;
    }
  
    static fromFirestore(doc) {
      const data = doc.data();
  console.log("data",data)
      if (!data) return null;
  
      return new Venue({
        id: doc.id,
        Address: data["Address"] ? data["Address"] : "",
        Description: data["Description"] ? data["Description"] : "",
        Image: data["Image"] ? data["Image"] : "",
        Images: data["Images"] ? data["Images"] : "",
        Name: data["Name"] ? data["Name"] : "",
        Rating: data["Rating"] ? data["Rating"] : "",
        Reviews: data["Reviews"] ? data["Reviews"] : "",
        Time: data["Time"] ? data["Time"] : "",
        Restaurants: data["Restaurants"] ? data["Restaurants"] : "",
        IndoorActivities: data["IndoorActivities"] ? data["IndoorActivities"] : "",
        OutdoorActivities: data["OutdoorActivities"] ? data["OutdoorActivities"] : "",
        endTime: data["endTime"] ? data["endTime"] : "",
        id: data["id"] ? data["id"] : "",
        coordinates: data["coordinates"],
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
  