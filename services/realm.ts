// realm.ts
import Realm from "realm";
import { ReferenceRangeSchema, UserSchema, TestSchema } from "../models/realmModels";

// Referans veri seti
const referenceData = [
  { test_name: "IgG", age_group: "0-5 months", min_value: 1.0, max_value: 1.34 },
  { test_name: "IgG", age_group: "5-9 months", min_value: 1.64, max_value: 5.88 },
  { test_name: "IgG", age_group: "9-15 months", min_value: 2.46, max_value: 9.04 },
  { test_name: "IgG", age_group: "15-24 months", min_value: 3.13, max_value: 11.7 },
  { test_name: "IgG", age_group: "2-4 years", min_value: 2.95, max_value: 11.56 },
  { test_name: "IgA", age_group: "0-5 months", min_value: 0.07, max_value: 0.37 },
  { test_name: "IgA", age_group: "5-9 months", min_value: 0.16, max_value: 0.5 },
  { test_name: "IgA", age_group: "9-15 months", min_value: 0.27, max_value: 0.66 },
  { test_name: "IgA", age_group: "15-24 months", min_value: 0.36, max_value: 0.79 },
  { test_name: "IgA", age_group: "2-4 years", min_value: 0.27, max_value: 0.46 },
  { test_name: "IgM", age_group: "0-5 months", min_value: 0.26, max_value: 1.12 },
  { test_name: "IgM", age_group: "5-9 months", min_value: 0.34, max_value: 1.26 },
  { test_name: "IgM", age_group: "9-15 months", min_value: 0.42, max_value: 1.38 },
  { test_name: "IgM", age_group: "15-24 months", min_value: 0.49, max_value: 1.51 },
  { test_name: "IgM", age_group: "2-4 years", min_value: 0.37, max_value: 1.84 },

 
];







// Realm Başlatma Fonksiyonu
export function testRealmInitialization() {
  try {
    // Realm'i yapılandır ve başlat
    const realm = new Realm({
      path: "new_database.realm",
      schema: [ReferenceRangeSchema, UserSchema, TestSchema],
      schemaVersion: 3,
    });

    realm.write(() => {
      referenceData.forEach((data) => {
        const exists = realm.objects("ReferenceRanges").filtered(
          `test_name = "${data.test_name}" AND age_group = "${data.age_group}"`
        ).length > 0;

        if (!exists) {
          realm.create("ReferenceRanges", {
            id: new Realm.BSON.ObjectId(),
            test_name: data.test_name,
            age_group: data.age_group,
            min_value: data.min_value,
            max_value: data.max_value,
          });
        }
      });
    });














    console.log("✅ Realm initialized successfully!");
    console.log("📂 Realm Path:", realm.path);

    // Mevcut Tabloları Listele
    const schemaNames = realm.schema.map((s) => s.name);
    console.log("📋 Available Schemas:", schemaNames);

    // Tabloda Veri Kontrolü (örneğin, 'Users' tablosu)
    if (schemaNames.includes("Users")) {
      const users = realm.objects("Users");
      console.log(`👥 'Users' table contains ${users.length} records.`);

      // Eğer kayıt yoksa bir kullanıcı ekle
      if (users.length === 0) {
        realm.write(() => {
          realm.create("Users", {
            id: new Realm.BSON.ObjectId(),
            name: "Ali",
            surname: "Veli",
            email: "ali.veli@example.com",
            password: "12345",
            role: "doktor",
            age: 35,
          });
        });
        console.log("✅ Yeni kullanıcı başarıyla eklendi.");
      }
    } else {
      console.warn("⚠️ 'Users' schema not found.");
    }

    // Realm'i Kapat
    realm.close();
    console.log("🔒 Realm connection closed.");
  } catch (error) {
    console.error("❌ Realm initialization failed:", error);
  }






  
}






export default testRealmInitialization;