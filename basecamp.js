import fs from "fs";
import axios from "axios";
import { time } from "console";
import moment from "moment";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

const encryptedclientId = "U2FsdGVkX1+6MsIsueKkci7uBxy/+avvqa4KcLiB9EBvBy+vfhpXKo0NZjvdZpBzRALQvY5lyHiG0Wq8YzOhxA==";
const encryptedclientSecret = "U2FsdGVkX1/jNxCNe3GvMdwie8TaiejQv0/SKANMdrqtZYhs2yv6DTgHxqqJmZynwKe9ILPd4QrfWFv3aGEn9g==";
const encryptedrefreshToken = "U2FsdGVkX19YGd8OIF2dBtiJHKtWTOKr60MB6MVbQO0iQX2b4OGJnkMkxk7wFsTwbr5Zw4gxbzkSRaMmpI8MO4oiv39ezeWOCkEe10UB+0o9pK04LGiTakrXb1f7Z70aMFRjYSxtHu0FRa9CRs7AQzlMHHA/P45tbvpmO2ELWi8iucwzRn73eKoo9P7QhOxA/uEjB7guDTkwUyZflRdyWOvm1t/MbuwH/9HpPUmKuKs3p3drKmjbocM9hGh6TNURaSDEhEeH4ed3KsuQoAYOksKEFZXjbalhU05PboIbTmhAs5q2xgjD57YnyffwQQuwY7QqVcHUt6pJI17BXfk9YceHpi0wYDkiLTUkchyYhj1sdMb8QW+8CuFILJLA+RCWfjhOuhiDCROcx86DTt/Fnw8j4B3dCra495kAp7KSYJqdUm6CxOC38YHXXctAiP2oTAguZtFp+gwNA4dNPS9h+SE15fd1nkUsC2idhOT1jKrOEt4twwdLAQ0Jk4J4GnfcCu53B3e/EP0/TfZ5TJ7U0LiHDdnK6RMR2I7rCoqJUq0=";


async function getAccessTokenFromRefreshToken() {
  const clientId = CryptoJS.AES.decrypt(encryptedclientId, secretKey).toString(CryptoJS.enc.Utf8);
  const clientSecret = CryptoJS.AES.decrypt(encryptedclientSecret, secretKey).toString(CryptoJS.enc.Utf8);
  const refreshToken = CryptoJS.AES.decrypt(encryptedrefreshToken, secretKey).toString(CryptoJS.enc.Utf8);

  try {
    const response = await axios.post("https://launchpad.37signals.com/authorization/token", {
      type: "refresh",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error("❌ Failed to fetch access token from refresh token:", error.response?.data || error.message);
    throw error;
  }
}

const postToBasecamp = async () => {
const accessToken = await getAccessTokenFromRefreshToken();
console.log("accessToken: "+ accessToken);
  const url = "https://3.basecampapi.com/4489886/buckets/20201395/recordings/7964796971/comments.json";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const report = fs.readFileSync(`output.txt`, `utf8`);
  
  const body = {
    content: report,
  };
  try {
    const response = await axios.post(url, body, { headers });
  } catch (error) {
    console.log(error);
  }
};

export { postToBasecamp };
