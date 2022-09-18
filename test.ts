const admin = require("firebase-admin")
const firestore = require("firebase-admin/firestore");
const messagingPkg = require("firebase-admin/messaging");

var serviceAccount = require("./key.json");

interface User {
  timestamp: Date;
  token: string;
}

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = firestore.getFirestore(app);
const messaging = messagingPkg.getMessaging(app);

const main = async () => {
  const data = await db.collection("users").get();

  let tokens: string[] = []

  data.forEach((user: {data: () => User}) => {
    tokens.push(user.data().token)
  });

  messaging.subscribeToTopic(tokens, "alerts");
  messaging.send({
    notification: {
      body: "test",
      title: "hi"
    },
    topic: "alerts"
  })
}

main()

