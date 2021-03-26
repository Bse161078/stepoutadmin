export class Notification {
  constructor(x) {
    this.uuid = x.uuid;
    this.title = x.title;
    this.message = x.message;
  }

  static fromFirestore(doc) {
    const data = doc.data();

    if (!data) return null;

    return new Event({
      uuid: doc.id,
      title: data["title"] ? data["title"] : "",
      message: data["message"] ? data["message"] : [],
    });
  }

  toJson(x) {
    return {
      uuid: x.uuid,
      title: x.title,
      message: x.message,
    };
  }
}
