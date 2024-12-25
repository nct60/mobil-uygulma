export const ReferenceRangeSchema = {
  name: "ReferenceRanges",
  primaryKey: "id",
  properties: {
    id: "objectId",
    test_name: "string", // Test adı
    age_group: "string", // Yaş grubu
    min_value: "float", // Minimum değer
    max_value: "float", // Maksimum değer
  },
};

export const UserSchema = {
  name: "Users",
  primaryKey: "id",
  properties: {
    id: "objectId",
    name: "string", // Kullanıcı adı
    surname: "string", // Kullanıcı soyadı
    email: "string", // Kullanıcı email
    password: "string", // Şifre
    role: "string", // Kullanıcı rolü (ör: doktor, hasta)
    age: "int", // Kullanıcı yaşı
  },
};

export const TestSchema = {
  name: "Tests",
  primaryKey: "id",
  properties: {
    id: "objectId",
    user_id: "objectId", // Kullanıcı ID'si
    test_name: "string", // Test adı
    value: "float", // Test sonucu
    date: "date", // Test tarihi
  },
};
