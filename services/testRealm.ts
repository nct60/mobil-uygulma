import Realm from "realm";

export function testRealmInitialization() {
  try {
    const realm = new Realm();
    console.log("Realm initialized successfully!");
  } catch (error) {
    console.error("Realm initialization failed:", error);
  }
}
