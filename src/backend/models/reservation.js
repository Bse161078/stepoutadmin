
export class Reservation {
    constructor(x) {
        this.id = x.id;
        this.status = x.status;
        this.start = x.start;
        this.end = x.end
    }

    static fromFirestore(doc) {
        const data = doc.data();

        if (!data) return null;

        return new Reservation({
            id: doc.id,
            status: data['status'] ? data['status'] :data['title'],
            start: data['date'] ? data['date'] : data['start'],
            end: data['date'] ? data['date'] : data['end'],
        });
    }

    toJson(x) {
        return {
            uuid: x.uuid,
            privacyPolicy: x.privacyPolicy,
            timestampAdded: x.timestampAdded,
        };
    }
}