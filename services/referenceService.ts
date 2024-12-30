import realm from "./realm";

export function addReferenceRanges() {
  try {
    realm.write(() => {
      realm.create("ReferenceRanges", {
        id: new Realm.BSON.ObjectId(),
        test_name: "IgA",
        age_group: "0-1 ay",
        min_value: 0.0,
        max_value: 0.11,
      });
      realm.create("ReferenceRanges", {
        id: new Realm.BSON.ObjectId(),
        test_name: "IgM",
        age_group: "0-5 months",
        min_value: 0.1,
        max_value: 0.5,
      });
    });
    console.log("Referans aralıkları başarıyla eklendi!");
  } catch (error) {
    console.error("Referans aralıkları eklenirken hata oluştu: ", error);
  }
}

export function getReferenceRanges() {
  try {
    return realm.objects("ReferenceRanges");
  } catch (error) {
    console.error("Referans aralıkları alınırken hata oluştu: ", error);
    return [];
  }
}