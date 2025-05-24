import crypto from "crypto";

// const makeSignature =(timestamp: number) {
// 	let space = " ";				// one space
// 	let newLine = "\n";				// new line
// 	let method = "GET";				// method
// 	let url = "/photos/puppy.jpg?query1=&query2";	// url (include query string)
// 	let timestamp = "{timestamp}";			// current timestamp (epoch)
// 	let accessKey = process.env.SENS_ACCESS_KEY!;		// access key id (from portal or Sub Account)
// 	let secretKey = process.env.SENS_SECRET_KEY!;	// secret key (from portal or Sub Account)

// 	let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
// 	hmac.update(method);
// 	hmac.update(space);
// 	hmac.update(url);
// 	hmac.update(newLine);
// 	hmac.update(timestamp);
// 	hmac.update(newLine);
// 	hmac.update(accessKey);

//   let hash = hmac.finalize();

// 	return hash.toString(CryptoJS.enc.Base64);
// }
const makeSignature = (timestamp: number) => {
  const space = " ";
  const newLine = "\n";
  const method = "POST";
  const url = `/alimtalk/v2/services/${process.env.SENS_SERVICE_ID}/messages`;
  const accessKey = process.env.SENS_ACCESS_KEY!;
  const secretKey = process.env.SENS_SECRET_KEY!;

  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(
    `${method}${space}${url}${newLine}${timestamp}${newLine}${accessKey}`
  );
  return hmac.digest("base64");
};

export async function sendKakaoMessage({
  to,
  content,
}: {
  to: string;
  content: string;
}) {
  const serviceId = process.env.SENS_SERVICE_ID!;
  const accessKey = process.env.SENS_ACCESS_KEY!;

  const timestamp = Date.now();
  const signature = makeSignature(timestamp);

  const res = await fetch(
    `https://sens.apigw.ntruss.com/alimtalk/v2/services/${serviceId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ncp-apigw-timestamp": timestamp.toString(),
        "x-ncp-iam-access-key": accessKey,
        "x-ncp-apigw-signature-v2": signature,
      },
      body: JSON.stringify({
        plusFriendId: "@샤인학원",
        templateCode: "shine02",
        messages: [
          {
            to: to,
            content: content,
            buttons: [],
          },
        ],
      }),
    }
  );

  return await res.json();
}
