
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
            status: data['status'] ? data['status'] : '',
            start: data['date'] ? data['date'] : '',
            end: data['date'] ? data['date'] : '',
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