export class Blogs {
    constructor(x) {
      this.date = x.date;
      this.description = x.description;
      this.title = x.title;
      this.id = x.id;
      this.Images=x.Images;
      this.Videos=x.Videos;
      this.img=x.img;
    }
  
    static fromFirestore(doc) {
      const data = doc.data();
  
      if (!data) return null;
  
      return new Blogs({
        id: doc.id,
        date: data["date"] ? data["date"] : "",
        Images: data["Images"] ? data["Images"] : "",
        Videos: data["Videos"] ? data["Videos"] : "",
        description: data["description"] ? data["description"] : "",
        title: data["title"] ? data["title"] : "",
        img: data["img"] ? data["img"] : "",
        id: data["id"] ? data["id"] : "",
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
  