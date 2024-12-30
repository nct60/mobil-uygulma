import Realm from "realm";
export async function addPatientWithTests(patient: any, tests: any[]) {
  const realm = new Realm();
  try {

    console.log("Hasta Bilgileri:");
    console.log(patient);

    console.log("Test Verileri:");
    tests.forEach((test) => console.log(test));




    realm.write(() => {
      const newPatient = realm.create("Users", {
        id: new Realm.BSON.ObjectId(),
        name: patient.name,
        surname: patient.surname,
        age: Math.round(patient.age),        email: patient.email,
        password: patient.password,
        role: "patient",
      });

      tests.forEach((test) => {
        realm.create("Tests", {
          id: new Realm.BSON.ObjectId(),
          user_id: newPatient.id,
          test_name: test.test_name,
          value: parseFloat(test.value), 
          date: new Date(),
        });
      });
    });
  } finally {
    realm.close();
  }
}