import http from "http";

const login = () =>
  new Promise((resolve, reject) => {
    const data = JSON.stringify({ email: "staff@fpop.com", password: "staff123" });
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          const setCookie = res.headers["set-cookie"];
          resolve({ body: JSON.parse(body), cookie: setCookie ? setCookie[0].split(";")[0] : null });
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });

const fetchAppts = (cookie) =>
  new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/appointments/staff",
        method: "GET",
        headers: { Cookie: cookie },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve(JSON.parse(body)));
      }
    );
    req.on("error", reject);
    req.end();
  });

const test = async () => {
  const loginRes = await login();
  console.log("Login:", loginRes.body.success ? "OK" : "FAIL");
  if (!loginRes.cookie) {
    console.log("No cookie received");
    return;
  }
  console.log("Cookie:", loginRes.cookie.substring(0, 50) + "...");

  const appts = await fetchAppts(loginRes.cookie);
  console.log("\nStaff appointments response:");
  console.log(JSON.stringify(appts, null, 2));
};

test().catch(console.error);
