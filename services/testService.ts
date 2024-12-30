import realm from "./realm";

import { convertAgeToMonths } from "../utils/helpers";

type ReferenceRange = {
  test_name: string;
  age_group: string; // Örnek: "0-12 months"
};

export function getReferenceRange(testName: string, ageInMonths: number) {
  const reference = realm.objects<ReferenceRange>("ReferenceRanges").filtered("test_name == $0", testName);

  return reference.find((range) => {
    const [min, max] = range.age_group
      .split("-")
      .map((value: string) => 
        value.includes("months") ? parseInt(value) : parseInt(value) * 12
      );
    return ageInMonths >= min && ageInMonths <= max;
  });
}




export function calculateCategoryStyle(category: string) {
  switch (category) {
    case "Düşük":
      return { color: "blue", fontWeight: "bold" };
    case "Yüksek":
      return { color: "red", fontWeight: "bold" };
    case "Normal":
      return { color: "green", fontWeight: "bold" };
    default:
      return { color: "gray" };
  }
}

export function calculateTrendStyle(trend: string) {
  switch (trend) {
    case "↑":
      return { color: "red", fontWeight: "bold" };
    case "↓":
      return { color: "blue", fontWeight: "bold" };
    case "↔":
      return { color: "green", fontWeight: "bold" };
    default:
      return { color: "gray" };
  }
}



















export async function addPatientWithTests(patient: any, tests: any[]) {
  const realm = new Realm();
  try {
    realm.write(() => {
      const newPatient = realm.create("Users", {
        id: new Realm.BSON.ObjectId(),
        name: patient.name,
        surname: patient.surname,
        age: patient.age,
        email: patient.email,
        password: patient.password,
        role: "patient",
      });

      tests.forEach((test) => {
        realm.create("Tests", {
          id: new Realm.BSON.ObjectId(),
          user_id: newPatient.id,
          test_name: test.test_name,
          value: test.value,
          date: new Date(),
        });
      });
    });
  } finally {
    realm.close();
  }
}